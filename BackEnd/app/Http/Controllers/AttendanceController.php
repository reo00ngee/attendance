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
        // $user = Auth::user();
        // $user2 = request()->user();
        // \Log::info('User: ' , [$user,$user2] );
        // \Log::info('User ID: ' . $user_id);
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
        $this->attendanceService->startBreak();
        return $this->attendanceService->getLatestAttendancesForUser();
    }


    public function getLatestAttendancesForUser(Request $request)
    {
        $user_id = Auth::id();
        return $this->attendanceService->getLatestAttendancesForUser($user_id);
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
