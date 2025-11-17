<?php

namespace App\Services;

use App\Repositories\AttendanceRepository;
use App\Repositories\CompanyRepository;
use App\Repositories\InformationRepository;
use App\Traits\FetchAttendanceTimeTrait;
use App\Traits\FetchCompanyDataTrait;
use App\Traits\PeriodCalculatorTrait;
use App\Enums\SubmissionType;
use App\Enums\InformationType;
use DateTime;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AttendanceService
{
    use FetchAttendanceTimeTrait;
    use FetchCompanyDataTrait;
    use PeriodCalculatorTrait;
    private AttendanceRepository $attendanceRepository;
    private CompanyRepository $companyRepository;
    private InformationRepository $informationRepository;
    public function __construct(
        AttendanceRepository $attendanceRepository,
        CompanyRepository $companyRepository,
        InformationRepository $informationRepository
    ) {
        $this->attendanceRepository = $attendanceRepository;
        $this->companyRepository = $companyRepository;
        $this->informationRepository = $informationRepository;
    }

    public function startWork(int $company_id, int $user_id)
    {
        $company = $this->getCompany($company_id);
        if (!$company) {
            throw ValidationException::withMessages([
                'company' => 'Company not found for attendance registration.',
            ]);
        }

        $this->assertAttendanceDateAllowed($company, Carbon::now());

        return $this->attendanceRepository->saveStartAttendance($user_id);
    }

    public function finishWork($attendance_id)
    {
        return $this->attendanceRepository->saveFinishAttendance($attendance_id);
    }

    public function startBreak($attendance_id)
    {
        return $this->attendanceRepository->saveStartBreak($attendance_id);
    }

    public function finishBreak($attendance_id)
    {
        return $this->attendanceRepository->saveFinishBreak($attendance_id);
    }

    public function updateAttendance(int $company_id, int $user_id, array $validated)
    {
        $company = $this->getCompany($company_id);
        if (!$company) {
            throw ValidationException::withMessages([
                'company' => 'Company not found for attendance registration.',
            ]);
        }

        if (!empty($validated['start_time'])) {
            $this->assertAttendanceDateAllowed($company, Carbon::parse($validated['start_time']));
        }

        if (!empty($validated['end_time'])) {
            $this->assertAttendanceDateAllowed($company, Carbon::parse($validated['end_time']));
        }

        if (!empty($validated['attendance_breaks'])) {
            foreach ($validated['attendance_breaks'] as $break) {
                if (!empty($break['start_time'])) {
                    $this->assertAttendanceDateAllowed($company, Carbon::parse($break['start_time']));
                }
                if (!empty($break['end_time'])) {
                    $this->assertAttendanceDateAllowed($company, Carbon::parse($break['end_time']));
                }
            }
        }

        Log::debug('Attendance update request', [
            'user_id' => $user_id,
            'company_id' => $company->id,
            'attendance_id' => $validated['attendance_id'] ?? null,
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
        ]);

        if (!empty($validated['attendance_id'])) {
            return $this->attendanceRepository->updateAttendance($user_id, $validated);
        }

        return $this->attendanceRepository->createAttendance($user_id, $validated);
    }

    public function getAllAttendancesForUser($company_id, $user_id, $year, $month)
    {
        $closing_date = $this->getCompanyClosingDate($company_id);
        [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
        $attendances = $this->attendanceRepository->getAllAttendancesForUser($user_id, $start, $end);
        return $attendances->map(function ($attendance) {
            return [
                'attendance_id'     => $attendance->id,
                'start_time'        => $attendance->start_time ? $attendance->start_time->format('Y-m-d\TH:i:s') : '',
                'end_time'          => $attendance->end_time ? $attendance->end_time->format('Y-m-d\TH:i:s') : '',
                'comment'           => $attendance->comment,
                'submission_status' => $attendance->submission_status?->value,
                'attendance_breaks' => $attendance->attendanceBreaks->map(function ($break) {
                    return [
                        'start_time' => $break->start_time ? $break->start_time->format('Y-m-d\TH:i:s') : '',
                        'end_time'   => $break->end_time ? $break->end_time->format('Y-m-d\TH:i:s') : '',
                    ];
                }),
            ];
        });
    }

    public function submitAttendances($company_id, $user_id, $year, $month)
    {
        try {
            $company = $this->getCompany($company_id);
            if (!$company) {
                throw ValidationException::withMessages([
                    'company' => 'Company not found for attendance submission.',
                ]);
            }

            $closingDate = $company->closing_date;
            [$periodStart, $periodEnd] = $this->getPeriodRange($closingDate, $year, $month);

            if ($company->attendance_ready) {
                $lockedThrough = $company->last_closing_date->copy()->addMonth()->startOfDay();

                if ($periodEnd->copy()->startOfDay()->lte($lockedThrough)) {
                    throw ValidationException::withMessages([
                        'period' => sprintf(
                            'attendance_readyが有効のため、%s以前の勤怠は申請できません。',
                            $lockedThrough->toDateString()
                        ),
                    ]);
                }
            }

            DB::transaction(function () use ($user_id, $company_id, $periodStart, $periodEnd) {
                $attendances = $this->attendanceRepository->getAllAttendancesForUser($user_id, $periodStart, $periodEnd);
                foreach ($attendances as $attendance) {
                    $this->attendanceRepository->submitAttendance($attendance);
                }
            });

            $this->informationRepository->deleteInformations($user_id);
            $this->informationRepository->createInformation(
                $user_id,
                SubmissionType::ATTENDANCE->value,
                InformationType::SUBMISSION_SUBMITTED->value,
            );

            return $this->getAllAttendancesForUser($company_id, $user_id, $year, $month);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to submit attendances: ' . $e->getMessage()], 500);
        }
    }

    public function getSubmittedAndApprovedAttendances($company_id, $user_id, $year, $month)
    {
        $closing_date = $this->getCompanyClosingDate($company_id);
        [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
        $submitted_attendances = $this->attendanceRepository->getSubmittedAndApprovedAttendances($user_id, $start, $end);
        return $submitted_attendances->map(function ($attendance) {
            return [
                'attendance_id'     => $attendance->id,
                'start_time'        => $attendance->start_time ? $attendance->start_time->format('Y-m-d\TH:i:s') : '',
                'end_time'          => $attendance->end_time ? $attendance->end_time->format('Y-m-d\TH:i:s') : '',
                'comment'           => $attendance->comment,
                'submission_status' => $attendance->submission_status?->value,
                'attendance_breaks' => $attendance->attendanceBreaks->map(function ($break) {
                    return [
                        'start_time' => $break->start_time ? $break->start_time->format('Y-m-d\TH:i:s') : '',
                        'end_time'   => $break->end_time ? $break->end_time->format('Y-m-d\TH:i:s') : '',
                    ];
                }),
            ];
        });
    }

    public function approveAttendances($company_id, $user_id, $year, $month)
    {
        try {
            DB::transaction(function () use ($company_id, $user_id, $year, $month) {
                $closing_date = $this->getCompanyClosingDate($company_id);
                [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
                $attendances = $this->attendanceRepository->getSubmittedAndApprovedAttendances($user_id, $start, $end);
                foreach ($attendances as $attendance) {
                    $this->attendanceRepository->approveAttendance($attendance);
                }

                $this->informationRepository->deleteInformations($user_id);
                $this->informationRepository->createInformation(
                    $user_id,
                    SubmissionType::ATTENDANCE->value,
                    InformationType::SUBMISSION_APPROVED->value,
                );
            });

            return $this->getSubmittedAndApprovedAttendances($company_id, $user_id, $year, $month);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to approve attendances: ' . $e->getMessage()], 500);
        }
    }

    public function rejectAttendances($company_id, $user_id, $year, $month, $rejection_reason)
    {
        try {
            DB::transaction(function () use ($company_id, $user_id, $year, $month, $rejection_reason) {
                $closing_date = $this->getCompanyClosingDate($company_id);
                [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
                $attendances = $this->attendanceRepository->getSubmittedAndApprovedAttendances($user_id, $start, $end);
                foreach ($attendances as $attendance) {
                    $this->attendanceRepository->rejectAttendance($attendance);
                }

                $this->informationRepository->deleteInformations($user_id);
                $this->informationRepository->createInformation(
                    $user_id,
                    SubmissionType::ATTENDANCE->value,
                    InformationType::SUBMISSION_REJECTED->value,
                    $rejection_reason,
                );
            });

            return $this->getSubmittedAndApprovedAttendances($company_id, $user_id, $year, $month);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to reject attendances: ' . $e->getMessage()], 500);
        }
    }

    private function assertAttendanceDateAllowed($company, Carbon $date): void
    {
        if (!$company->attendance_ready) {
            return;
        }

        $lockedThrough = $company->last_closing_date->copy()->addMonth()->startOfDay();
        Log::debug('Attendance date validation', [
            'user_id' => auth()->id(),
            'company_id' => $company->id,
            'target_date' => $date->copy()->startOfDay()->toDateString(),
            'locked_through' => $lockedThrough->toDateString(),
            'attendance_ready' => $company->attendance_ready,
        ]);

        if ($date->copy()->startOfDay()->lte($lockedThrough)) {
            throw ValidationException::withMessages([
                'date' => sprintf(
                    'attendance_readyが有効のため、%s以前の日付では勤怠を登録できません。',
                    $lockedThrough->toDateString()
                ),
            ]);
        }
    }
}
