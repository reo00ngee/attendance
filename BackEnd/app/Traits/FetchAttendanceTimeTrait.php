<?php

namespace App\Traits;

use App\Repositories\AttendanceRepository;


trait FetchAttendanceTimeTrait
{

    private AttendanceRepository $attendanceRepository;
    public function __construct(AttendanceRepository $attendanceRepository)
    {
        $this->attendanceRepository = $attendanceRepository;
    }

    public function getLatestAttendancesForUser($user_id): \Illuminate\Http\JsonResponse
    {
        $latestAttendance = $this->attendanceRepository->getLatestAttendancesForUser($user_id);

        if ($latestAttendance) {
            $latestStartAttendance = $latestAttendance->start_time === null ? '' : $latestAttendance->start_time->format('G:i');
            $latestFinishAttendance = $latestAttendance->end_time === null ? '' : $latestAttendance->end_time->format('G:i');
            return response()->json(['start_time' => $latestStartAttendance, 'end_time' => $latestFinishAttendance]);
        } else {
            Log::info("it doesn't exist");
            return response()->json(['error' => 'error'], 500);
        }
    }
}
