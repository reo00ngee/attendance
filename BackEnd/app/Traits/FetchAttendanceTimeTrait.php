<?php

namespace App\Traits;

use App\Repositories\WorkTimeRepository;


trait FetchAttendanceTimeTrait
{

    private WorkTimeRepository $workTimeRepository;
    public function __construct(WorkTimeRepository $workTimeRepository)
    {
        $this->workTimeRepository = $workTimeRepository;
    }

    public function getLatestWorkTimesForUser(): \Illuminate\Http\JsonResponse
    {
        $latestWorkTime = $this->workTimeRepository->getLatestWorkTimesForUser();

        if ($latestWorkTime) {
            $latestStartWorkTime = $latestWorkTime->start_work_time === null ? '' : $latestWorkTime->start_work_time->format('G:i');
            $latestFinishWorkTime = $latestWorkTime->finish_work_time === null ? '' : $latestWorkTime->finish_work_time->format('G:i');
            return response()->json(['start_work_time' => $latestStartWorkTime, 'finish_work_time' => $latestFinishWorkTime]);
        } else {
            Log::info("it doesn't exist");
            return response()->json(['error' => 'error'], 500);
        }
    }
}
