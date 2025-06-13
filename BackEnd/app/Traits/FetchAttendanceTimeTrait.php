<?php

namespace App\Traits;

use App\Repositories\AttendanceRepository;
use Illuminate\Support\Facades\Log;


trait FetchAttendanceTimeTrait
{

    // private AttendanceRepository $attendanceRepository;
    // public function __construct(AttendanceRepository $attendanceRepository)
    // {
    //     $this->attendanceRepository = $attendanceRepository;
    // }

    public function getLatestAttendancesForUser($user_id): \Illuminate\Http\JsonResponse
    {
        $latestAttendance = $this->attendanceRepository->getLatestAttendancesForUser($user_id);

        if ($latestAttendance) {
            // 最後の出席時間と終了時間をフォーマット
            $startTime = $latestAttendance->start_time === null ? '' : $latestAttendance->start_time->format('Y-m-d\TH:i:s');
            $endTime = $latestAttendance->end_time === null ? '' : $latestAttendance->end_time->format('Y-m-d\TH:i:s');

            // attendanceBreaks（休憩）をフォーマットして追加
            $attendanceBreaks = $latestAttendance->attendanceBreaks->map(function ($break) {
                return [
                    'start_time' => $break->start_time ? $break->start_time->format('Y-m-d\TH:i:s') : '',
                    'end_time' => $break->end_time ? $break->end_time->format('Y-m-d\TH:i:s') : '',
                ];
            });

            return response()->json([
                'attendance_id' => $latestAttendance->id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'attendance_breaks' => $attendanceBreaks,  // attendanceBreaks を追加
            ]);
        } else {
            Log::info("it doesn't exist");
            return response()->json(['error' => 'error'], 500);
        }
    }

    public function getAttendanceForUser($attendance_id): \Illuminate\Http\JsonResponse
    {
        $attendance = $this->attendanceRepository->getAttendanceForUser($attendance_id);

        if (!$attendance) {
            return response()->json(['message' => 'Attendance not found.'], 404);
        }

        return response()->json([
            'attendance_id' => $attendance->id,
            'start_time' => $attendance->start_time ? $attendance->start_time->format('Y-m-d\TH:i:s') : '',
            'end_time' => $attendance->end_time ? $attendance->end_time->format('Y-m-d\TH:i:s') : '',
            'attendance_breaks' => $attendance->attendanceBreaks->map(function ($break) {
                return [
                    'start_time' => $break->start_time ? $break->start_time->format('Y-m-d\TH:i:s') : '',
                    'end_time' => $break->end_time ? $break->end_time->format('Y-m-d\TH:i:s') : '',
                ];
            }),
        ]);
    }
}
