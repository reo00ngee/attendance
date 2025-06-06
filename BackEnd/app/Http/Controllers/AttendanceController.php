<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AttendanceService;
use Illuminate\Database\Eloquent\Casts\Json;

class AttendanceController extends Controller
{
    private AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function startWork(Request $request)
    {
        \Log::info('startWork in');
        $user_id = Auth::id();
        $this->attendanceService->startWork($user_id);
        return $this->attendanceService->getLatestAttendancesForUser($user_id);
    }

    public function finishWork(Request $request)
    {
        $user_id = Auth::id();
        $this->attendanceService->finishWork($user_id);
        return $this->attendanceService->getLatestAttendancesForUser($user_id);
    }

    public function startBreak(Request $request)
    {
        $user_id = Auth::id();
        $this->attendanceService->startBreak($user_id);
        return $this->attendanceService->getLatestAttendancesForUser($user_id);
    }

    public function finishBreak(Request $request)
    {
        $user_id = Auth::id();
        $this->attendanceService->finishBreak($user_id);
        return $this->attendanceService->getLatestAttendancesForUser($user_id);
    }

    public function updateAttendance(Request $request)
    {
        $user_id = Auth::id();
        $validated = $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'attendance_breaks' => 'nullable|array',
            'attendance_breaks.*.start_time' => 'required|date',
            'attendance_breaks.*.end_time' => 'required|date|after_or_equal:attendance_breaks.*.start_time',
        ]);

        $this->attendanceService->updateAttendance($user_id, $validated);
        return $this->attendanceService->getLatestAttendancesForUser($user_id);
    }


    public function getLatestAttendancesForUser(Request $request)
    {
        $user_id = Auth::id();
        return $this->attendanceService->getLatestAttendancesForUser($user_id);
    }

    public function getAllAttendancesForUser(Request $request)
    {
        $user_id = Auth::id();
        $year = $request->query('year');
        $month = $request->query('month');
        return $this->attendanceService->getAllAttendancesForUser($user_id, $year, $month);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
