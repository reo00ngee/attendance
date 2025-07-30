<?php

namespace App\Services;

use App\Repositories\AttendanceRepository;
use App\Repositories\CompanyRepository;
use App\Traits\FetchAttendanceTimeTrait;
use App\Traits\FetchCompanyDataTrait;
use App\Traits\PeriodCalculatorTrait;
use DateTime;
use Illuminate\Support\Facades\DB;

class AttendanceService
{
    use FetchAttendanceTimeTrait;
    use FetchCompanyDataTrait;
    use PeriodCalculatorTrait;
    private AttendanceRepository $attendanceRepository;
    private CompanyRepository $companyRepository;
    public function __construct(AttendanceRepository $attendanceRepository, CompanyRepository $companyRepository)
    {
        $this->attendanceRepository = $attendanceRepository;
        $this->companyRepository = $companyRepository;
    }

    public function startWork($user_id)
    {
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

    public function updateAttendance($user_id, $validated)
    {
        return $this->attendanceRepository->updateAttendance($user_id, $validated);
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
                'submission_status' => $attendance->submission_status,
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
            DB::transaction(function () use ($company_id, $user_id, $year, $month) {
                $closing_date = $this->getCompanyClosingDate($company_id);
                [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
                $attendances = $this->attendanceRepository->getAllAttendancesForUser($user_id, $start, $end);
                foreach ($attendances as $attendance) {
                    $this->attendanceRepository->submitAttendance($attendance);
                }
            });

            return $this->getAllAttendancesForUser($company_id, $user_id, $year, $month);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to submit attendances: ' . $e->getMessage()], 500);
        }
    }

    public function getSubmittedAttendances($company_id, $user_id, $year, $month)
    {
        $closing_date = $this->getCompanyClosingDate($company_id);
        [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
        $submitted_attendances = $this->attendanceRepository->getSubmittedAttendances($user_id, $start, $end);
        return $submitted_attendances->map(function ($attendance) {
            return [
                'attendance_id'     => $attendance->id,
                'start_time'        => $attendance->start_time ? $attendance->start_time->format('Y-m-d\TH:i:s') : '',
                'end_time'          => $attendance->end_time ? $attendance->end_time->format('Y-m-d\TH:i:s') : '',
                'comment'           => $attendance->comment,
                'submission_status' => $attendance->submission_status,
                'attendance_breaks' => $attendance->attendanceBreaks->map(function ($break) {
                    return [
                        'start_time' => $break->start_time ? $break->start_time->format('Y-m-d\TH:i:s') : '',
                        'end_time'   => $break->end_time ? $break->end_time->format('Y-m-d\TH:i:s') : '',
                    ];
                }),
            ];
        });
    }
}
