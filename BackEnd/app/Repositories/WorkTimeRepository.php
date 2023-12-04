<?php

namespace App\Repositories;

use App\Models\WorkTime;

class WorkTimeRepository
{
    public function saveStartWorkTime()
    {
        $workTime = new WorkTime();
        $workTime->start_work_time = now();
        $workTime->user_id = 1;
        $workTime->save();
        return WorkTime::orderBy('created_at', 'desc')->value('start_work_time')->format('H:i:s');
    }

    public function saveFinishWorkTime()
    {
        $workTime = WorkTime::latest()->first();
        $workTime->finish_work_time = now();
        $workTime->save();
    }
}