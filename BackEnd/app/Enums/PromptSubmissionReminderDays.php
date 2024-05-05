<?php

namespace App\Enums;

class PromptSubmissionReminderDays
{
    const THREE_DAYS = 3;
    const FIVE_DAYS = 5;
    const SEVEN_DAYS = 7;

    public static function getReminderDays($value)
    {
        switch ($value) {
            case self::THREE_DAYS:
                return '3 days';
                break;
            case self::FIVE_DAYS:
                return '5 days';
                break;
            case self::SEVEN_DAYS:
                return '7 days';
                break;
            default:
                return null;
        }
    }
}
