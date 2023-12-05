<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WorkTimeService;
use Illuminate\Database\Eloquent\Casts\Json;

class WorkTimeController extends Controller
{
    private WorkTimeService $workTimeService;

    public function __construct(WorkTimeService $workTimeService)
    {
        $this->workTimeService = $workTimeService;
    }

    public function startWork()
    {
        $this->workTimeService->startWork();
        return $this->workTimeService->getLatestWorkTimesForUser();
    }

    public function finishWork()
    {
        $this->workTimeService->finishWork();

        return response()->json(['message' => 'Work finished successfully']);
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
