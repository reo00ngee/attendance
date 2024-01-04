<?php

namespace App\Services;

use App\Repositories\WorkTimeRepository;
use App\Traits\FetchAttendanceTimeTrait;
use DateTime;

class WorkTimeService
{
    use FetchAttendanceTimeTrait;
    private WorkTimeRepository $workTimeRepository;
    public function __construct(WorkTimeRepository $workTimeRepository)
    {
        $this->workTimeRepository = $workTimeRepository;
    }

    public function startWork()
    {
        return $this->workTimeRepository->saveStartWorkTime();
    }

    public function finishWork()
    {
        $this->workTimeRepository->saveFinishWorkTime();
    }
}