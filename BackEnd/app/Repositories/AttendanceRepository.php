<?php

namespace App\Repositories;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AttendanceRepository
{
    public function saveStartAttendance($user_id)
    {
        $attendance = new Attendance();
        $attendance->start_time = now();
        $attendance->user_id = $user_id;
        $attendance->submission_status = 0;
        $attendance->save();
    }

    public function saveFinishAttendance($attendance_id)
    {
        $attendance = Attendance::find($attendance_id);
        if (!$attendance) {
            throw new \Exception("Attendance record not found for ID: {$attendance_id}");
        }
        $attendance->end_time = now();
        $attendance->save();
    }
    public function saveStartBreak($attendance_id)
    {
        $attendance = Attendance::find($attendance_id);
        if (!$attendance) {
            throw new \Exception("Attendance record not found for ID: {$attendance_id}");
        }
        $attendanceBreak = new AttendanceBreak();
        $attendanceBreak->start_time = now();
        $attendanceBreak->attendance_id = $attendance->id;
        $attendanceBreak->user_id = $attendance->user_id;
        $attendanceBreak->save();
    }
    public function saveFinishBreak($attendance_id)
    {
        $attendance = Attendance::find($attendance_id);
        if (!$attendance) {
            throw new \Exception("Attendance record not found for ID: {$attendance_id}");
        }
        $attendanceBreak = AttendanceBreak::where('attendance_id', $attendance->id)->latest()->first();
        if (!$attendanceBreak) {
            throw new \Exception("No break found for attendance ID: {$attendance_id}");
        }
        $attendanceBreak->end_time = now();
        $attendanceBreak->save();
    }

    public function updateAttendance($user_id, $validated)
    {
        try {
            DB::beginTransaction();
            $attendance = Attendance::find($validated['attendance_id']);

            if (!$attendance) {
                throw new \Exception("Attendance record not found for user ID: {$user_id}");
            }

            $attendance->start_time = $validated['start_time'];
            $attendance->end_time = $validated['end_time'];
            $attendance->save();

            $attendance->attendanceBreaks()->delete();

            foreach ($validated['attendance_breaks'] as $break) {
                $attendance->attendanceBreaks()->create([
                    'user_id' => $user_id,
                    'start_time' => $break['start_time'],
                    'end_time' => $break['end_time'],
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error("Failed to update attendance: " . $e->getMessage());

            throw $e;
        }
    }

    public function getLatestAttendancesForUser($user_id)
    {
        $latestattendance = Attendance::with('attendanceBreaks')
            ->where('user_id', $user_id)
            ->orderBy('start_time', 'desc')
            ->orderBy('end_time', 'desc')
            ->first();

        return $latestattendance;
    }

    public function getAttendanceForUser($attendance_id)
    {
        return Attendance::with('attendanceBreaks')
            ->where('id', $attendance_id)
            ->first();
    }

    public function getAllAttendancesForUser($user_id, $year, $month)
    {
        return Attendance::with('attendanceBreaks')
            ->where('user_id', $user_id)
            ->whereYear('start_time', $year)
            ->whereMonth('start_time', $month)
            ->orderBy('start_time', 'desc')
            ->get();
    }
}
