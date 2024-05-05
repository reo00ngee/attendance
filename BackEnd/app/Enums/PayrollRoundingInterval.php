<?php

namespace App\Enums;

class PayrollRoundingInterval
{
    const ONE_MINUTE = 1;
    const FIVE_MINUTES = 5;
    const FIFTEEN_MINUTES = 15;

    public static function getRoundingInterval($value)
    {
        switch ($value) {
            case self::ONE_MINUTE:
                return '1 min';
                break;
            case self::FIVE_MINUTES:
                return '5 mins';
                break;
            case self::FIFTEEN_MINUTES:
                return '15 mins';
                break;
            default:
                return null;
        }
    }
}
