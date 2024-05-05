<?php

namespace App\Repositories;

use App\Models\Attendance;

class AttendanceRepository
{
    public function saveStartAttendance()
    {
        $attendance = new Attendance();
        $attendance->start_time = now();
        // $attendance->date = now()->format('Y-m-d');
        $attendance->user_id = 1;
        $attendance->submission_status = 1;
        $attendance->save();
        // return Attendance::orderBy('created_at', 'desc')->value('start_work_time')->format('H:i:s');
    }

    public function saveFinishAttendance()
    {
        $attendance = Attendance::latest()->first();
        $attendance->end_time = now();
        $attendance->save();
    }

    public function getLatestAttendancesForUser()
    {
        try {
            $latestattendance = Attendance::where('user_id', 1)
                ->orderBy('start_time', 'desc')
                ->orderBy('end_time', 'desc')
                ->first();

            return $latestattendance;
        } catch (\Exception $e) {
            return null;
        }
    }
}