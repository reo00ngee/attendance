<?php

namespace App\Repositories;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Enums\SubmissionStatus;

class AttendanceRepository
{
    public function saveStartAttendance($user_id)
    {
        $attendance = new Attendance();
        $attendance->start_time = now();
        $attendance->user_id = $user_id;
        $attendance->submission_status = SubmissionStatus::CREATED;
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
            $attendance->end_time = $validated['end_time'] ?? null;
            $attendance->comment = $validated['comment'] ?? null;
            $attendance->submission_status = SubmissionStatus::CREATED;
            $attendance->save();

            $attendance->attendanceBreaks()->delete();

            foreach ($validated['attendance_breaks'] ?? [] as $break) {
                $attendance->attendanceBreaks()->create([
                    'user_id' => $user_id,
                    'start_time' => $break['start_time'],
                    'end_time' => $break['end_time'],
                ]);
            }

            DB::commit();

            return $attendance->fresh('attendanceBreaks');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error("Failed to update attendance: " . $e->getMessage());

            throw $e;
        }
    }

    public function createAttendance($user_id, $validated)
    {
        try {
            return DB::transaction(function () use ($user_id, $validated) {
                $attendance = new Attendance();
                $attendance->user_id = $user_id;
                $attendance->start_time = $validated['start_time'];
                $attendance->end_time = $validated['end_time'] ?? null;
                $attendance->comment = $validated['comment'] ?? null;
                $attendance->submission_status = SubmissionStatus::CREATED;
                $attendance->save();

                foreach ($validated['attendance_breaks'] ?? [] as $break) {
                    $attendance->attendanceBreaks()->create([
                        'user_id' => $user_id,
                        'start_time' => $break['start_time'],
                        'end_time' => $break['end_time'],
                    ]);
                }

                return $attendance->fresh('attendanceBreaks');
            });
        } catch (\Exception $e) {
            Log::error("Failed to create attendance: " . $e->getMessage());
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

    public function getAllAttendancesForUser($user_id, $start, $end)
    {
        return Attendance::with('attendanceBreaks')
            ->where('user_id', $user_id)
            ->whereBetween('start_time', [$start, $end])
            ->orderBy('start_time', 'desc')
            ->get();
    }

    public function submitAttendance($attendance)
    {
        $attendance->submission_status = SubmissionStatus::SUBMITTED;
        $attendance->save();
    }

    public function getSubmittedAndApprovedAttendances($user_id, $start, $end)
    {
        return Attendance::with('attendanceBreaks')
            ->where('user_id', $user_id)
            ->whereBetween('start_time', [$start, $end])
            ->whereIn('submission_status', [
                SubmissionStatus::SUBMITTED->value,
                SubmissionStatus::APPROVED->value,
            ])
            ->orderBy('start_time', 'desc')
            ->get();
    }

    public function approveAttendance($attendance)
    {
        $attendance->submission_status = SubmissionStatus::APPROVED;
        $attendance->save();
    }

    public function rejectAttendance($attendance)
    {
        $attendance->submission_status = SubmissionStatus::REJECTED;
        $attendance->save();
    }

}
