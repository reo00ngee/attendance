<?php

namespace App\Enums;

enum SubmissionType: int
{
    case ATTENDANCE = 0;
    case EXPENSE = 1;

    public function label(): string
    {
        return match($this) {
            self::ATTENDANCE => 'Attendance',
            self::EXPENSE => 'Expense',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::ATTENDANCE => 'Submission type for attendance records.',
            self::EXPENSE => 'Submission type for expense reimbursements.',
        };
    }
}
