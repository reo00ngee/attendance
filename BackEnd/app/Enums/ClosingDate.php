<?php

namespace App\Enums;

class ClosingDate
{
    const FIFTEENTH = 15;
    const TWENTIETH = 20;
    const TWENTY_FIFTH = 25;
    const END_OF_MONTH = 30;

    public static function getClosingDate($value)
    {
        switch ($value) {
            case self::FIFTEENTH:
                return '15th';
                break;
            case self::TWENTIETH:
                return '20th';
                break;
            case self::TWENTY_FIFTH:
                return '25th';
                break;
            case self::END_OF_MONTH:
                return 'end of month';
                break;
            default:
                return null;
        }
    }
}
