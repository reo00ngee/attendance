<?php

namespace App\Services;

use App\Repositories\AttendanceRepository;
use App\Traits\FetchAttendanceTimeTrait;
use DateTime;
use Illuminate\Support\Facades\DB;

class AttendanceService
{
    use FetchAttendanceTimeTrait;
    private AttendanceRepository $attendanceRepository;
    public function __construct(AttendanceRepository $attendanceRepository)
    {
        $this->attendanceRepository = $attendanceRepository;
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

    public function getAllAttendancesForUser($user_id, $year, $month)
    {
        $attendances = $this->attendanceRepository->getAllAttendancesForUser($user_id, $year, $month);
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

    public function submitAttendances($user_id, $year, $month)
    {
        try {
            DB::transaction(function () use ($user_id, $year, $month) {
                $attendances = $this->attendanceRepository->getAllAttendancesForUser($user_id, $year, $month);
                foreach ($attendances as $attendance) {
                    $this->attendanceRepository->submitAttendance($attendance);
                }
            });

            return $this->getAllAttendancesForUser($user_id, $year, $month);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to submit attendances: ' . $e->getMessage()], 500);
        }
    }
}
