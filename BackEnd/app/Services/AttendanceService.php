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

    public function finishWork($user_id)
    {
        $this->attendanceRepository->saveFinishAttendance($user_id);
    }

    public function startBreak()
    {
        return $this->attendanceRepository->saveStartBreak();
    }
}