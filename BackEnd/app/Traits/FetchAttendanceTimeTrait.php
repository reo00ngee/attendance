<?php

namespace App\Traits;

use App\Repositories\AttendanceRepository;
use Illuminate\Support\Facades\Log;


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
            // 最後の出席時間と終了時間をフォーマット
            $latestStartAttendance = $latestAttendance->start_time === null ? '' : $latestAttendance->start_time->format('G:i');
            $latestFinishAttendance = $latestAttendance->end_time === null ? '' : $latestAttendance->end_time->format('G:i');

            // attendanceBreaks（休憩）をフォーマットして追加
            $attendanceBreaks = $latestAttendance->attendanceBreaks->map(function ($break) {
                return [
                    'start_time' => $break->start_time ? $break->start_time->format('G:i') : '',
                    'end_time' => $break->end_time ? $break->end_time->format('G:i') : '',
                ];
            });

            return response()->json([
                'start_time' => $latestStartAttendance,
                'end_time' => $latestFinishAttendance,
                'attendance_breaks' => $attendanceBreaks,  // attendanceBreaks を追加
            ]);
        } else {
            Log::info("it doesn't exist");
            return response()->json(['error' => 'error'], 500);
        }
    }
}
