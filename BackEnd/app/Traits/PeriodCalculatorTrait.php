<?php
namespace App\Traits;

use Carbon\Carbon;

trait PeriodCalculatorTrait
{
    public function getPeriodRange(int $closing_date, int $year, int $month): array
    {
        if ($closing_date === 30 || $closing_date === 31) {
            $start = Carbon::create($year, $month, 1)->startOfMonth()->startOfDay();
            $end = Carbon::create($year, $month, 1)->endOfMonth()->endOfDay();
        } else {
            $currentPeriodStart = Carbon::create($year, $month, 1)->subMonth();
            $previousMonthClosing = min($closing_date, $currentPeriodStart->daysInMonth);
            $start = $currentPeriodStart->day($previousMonthClosing)->addDay()->startOfDay();

            $currentPeriodEnd = Carbon::create($year, $month, 1);
            $currentMonthClosing = min($closing_date, $currentPeriodEnd->daysInMonth);
            $end = $currentPeriodEnd->day($currentMonthClosing)->endOfDay();
        }

        return [$start, $end];
    }
}
