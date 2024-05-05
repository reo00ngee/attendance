<?php

namespace App\Enums;

class Currency
{
    const USD = 1;
    const EUR = 2;

    public static function getCurrencySymbol($value)
    {
        switch ($value) {
            case self::USD:
                return '$';
                break;
            case self::EUR:
                return '€';
                break;
            default:
                return null;
        }
    }

    public static function getCurrency($value)
    {
        switch ($value) {
            case self::USD:
                return 'USD';
                break;
            case self::EUR:
                return 'EUR';
                break;
            default:
                return null;
        }
    }
}
