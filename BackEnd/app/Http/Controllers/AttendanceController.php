<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AttendanceService;
use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\UpdateAttendanceRequest;

class AttendanceController extends Controller
{
    private AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
        $this->middleware('auth');
    }

    public function startWork(Request $request)
    {
        $user_id = Auth::id();
        $this->attendanceService->startWork($user_id);
        return $this->attendanceService->getLatestAttendancesForUser($user_id);
    }

    public function finishWork(Request $request)
    {
        $attendance_id = $request->query('attendance_id');
        $this->attendanceService->finishWork($attendance_id);
        return $this->attendanceService->getAttendanceForUser($attendance_id);
    }

    public function startBreak(Request $request)
    {
        $attendance_id = $request->query('attendance_id');
        $this->attendanceService->startBreak($attendance_id);
        return $this->attendanceService->getAttendanceForUser($attendance_id);
    }

    public function finishBreak(Request $request)
    {
        $attendance_id = $request->query('attendance_id');
        $this->attendanceService->finishBreak($attendance_id);
        return $this->attendanceService->getAttendanceForUser($attendance_id);
    }

    public function updateAttendance(UpdateAttendanceRequest $request)
    {
        $user_id = Auth::id();
        $validated = $request->validated();

        $this->attendanceService->updateAttendance($user_id, $validated);
        return $this->attendanceService->getAttendanceForUser($validated['attendance_id']);
    }


    public function getLatestAttendancesForUser(Request $request)
    {
        $user_id = Auth::id();
        return $this->attendanceService->getLatestAttendancesForUser($user_id);
    }

    public function getAttendanceForUser(Request $request)
    {
        $attendance_id = $request->query('attendance_id');
        return $this->attendanceService->getAttendanceForUser($attendance_id);
    }

    public function getAllAttendancesForUser(Request $request)
    {
        $company_id = Auth::user()->company_id;
        $user_id = Auth::id();
        $year = $request->query('year');
        $month = $request->query('month');
        return $this->attendanceService->getAllAttendancesForUser($company_id, $user_id, $year, $month);
    }

    public function submitAttendances(Request $request)
    {
        $company_id = Auth::user()->company_id;
        $user_id = Auth::id();
        $year = $request->query('year');
        $month = $request->query('month');
        return $this->attendanceService->submitAttendances($company_id, $user_id, $year, $month);
    }

    public function getSubmittedAttendances(Request $request)
    {
        $company_id = Auth::user()->company_id;
        $user_id = Auth::id();
        $year = $request->query('year');
        $month = $request->query('month');

        return $this->attendanceService->getSubmittedAttendances($company_id, $user_id, $year, $month);
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
