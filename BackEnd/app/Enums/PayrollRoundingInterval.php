<?php

namespace App\Enums;

enum PayrollRoundingInterval: int
{
    case ONE_MINUTE = 1;
    case FIVE_MINUTES = 5;
    case FIFTEEN_MINUTES = 15;

    public function label(): string
    {
        return match($this) {
            self::ONE_MINUTE => '1 min',
            self::FIVE_MINUTES => '5 mins',
            self::FIFTEEN_MINUTES => '15 mins',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::ONE_MINUTE => 'Rounding to the nearest 1-minute interval for payroll calculation.',
            self::FIVE_MINUTES => 'Rounding to the nearest 5-minute interval for payroll calculation.',
            self::FIFTEEN_MINUTES => 'Rounding to the nearest 15-minute interval for payroll calculation.',
        };
    }
}
