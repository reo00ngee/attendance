<?php

namespace App\Enums;

class SubmissionType
{
    const ATTENDANCE = 0;
    const EXPENSE = 1;

    public static function getSubmissionTypen($value)
    {
        switch ($value) {
            case self::ATTENDANCE:
                return 'Attendance';
                break;
            case self::EXPENSE:
                return 'Expense';
                break;
            default:
                return null;
        }
    }
}
