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

    /**
     * Calculate the next closing date period based on last_closing_date and closing_date
     * Returns [start_date, end_date] for the closure period
     */
    public function getClosurePeriodRange(Carbon $last_closing_date, int $closing_date): array
    {
        $start = $last_closing_date->copy()->addDay()->startOfDay();
        
        // Calculate the next closing date
        $nextClosingMonth = $last_closing_date->copy()->addMonth();
        $targetDay = min($closing_date, $nextClosingMonth->daysInMonth);
        $end = $nextClosingMonth->copy()->day($targetDay)->endOfDay();

        return [$start, $end];
    }
}
