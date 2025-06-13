<?php

namespace App\Services;

use App\Repositories\AttendanceRepository;
use App\Traits\FetchAttendanceTimeTrait;
use DateTime;

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
                'start_time'        => $attendance->start_time->format('Y-m-d\TH:i:s'),
                'end_time'          => optional($attendance->end_time)->format('Y-m-d\TH:i:s'),
                'attendance_breaks' => $attendance->attendanceBreaks->map(function ($break) {
                    return [
                        'start_time' => $break->start_time->format('Y-m-d\TH:i:s'),
                        'end_time'   => optional($break->end_time)->format('Y-m-d\TH:i:s'),
                    ];
                }),
            ];
        });
    }
}
