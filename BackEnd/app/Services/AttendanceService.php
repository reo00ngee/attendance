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

    public function startWork()
    {
        return $this->attendanceRepository->saveStartAttendance();
    }

    public function finishWork()
    {
        $this->attendanceRepository->saveFinishAttendance();
    }
}