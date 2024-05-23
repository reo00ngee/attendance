<?php

namespace App\Repositories;

use App\Models\Attendance;
use App\Models\AttendanceBreak;

class AttendanceRepository
{
    public function saveStartAttendance($user_id)
    {
        $attendance = new Attendance();
        $attendance->start_time = now();
        // $attendance->date = now()->format('Y-m-d');
        $attendance->user_id = $user_id;
        $attendance->submission_status = 0;
        $attendance->save();
        // return Attendance::orderBy('created_at', 'desc')->value('start_work_time')->format('H:i:s');
    }

    public function saveFinishAttendance($user_id)
    {
        $attendance = Attendance::where('user_id', $user_id)->latest()->first();
        $attendance->end_time = now();
        $attendance->save();
    }

    public function saveStartBreak()
    {
        $attendance = new Attendance();
        $attendance->start_time = now();
        // $attendance->date = now()->format('Y-m-d');
        $attendance->user_id = 1;
        $attendance->submission_status = 0;
        $attendance->save();
        // return Attendance::orderBy('created_at', 'desc')->value('start_work_time')->format('H:i:s');
    }

    public function getLatestAttendancesForUser($user_id)
    {
        try {
            $latestattendance = Attendance::where('user_id', $user_id)
                ->orderBy('start_time', 'desc')
                ->orderBy('end_time', 'desc')
                ->first();

            return $latestattendance;
        } catch (\Exception $e) {
            \Log::info($e->getMessage());
            return null;
        }
    }
}