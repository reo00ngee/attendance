<?php

namespace App\Enums;

enum Role: int
{
    case ATTENDANCE_AND_EXPENSE_REGISTRATION = 0;
    case ATTENDANCE_MANAGEMENT = 1;
    case FINANCE_MANAGEMENT = 2;
    case USER_MANAGEMENT = 3;
    case SETTING_MANAGEMENT = 4;

    public function label(): string
    {
        return match($this) {
            self::ATTENDANCE_AND_EXPENSE_REGISTRATION => 'Attendance and Expense Registration',
            self::ATTENDANCE_MANAGEMENT => 'Attendance Management',
            self::FINANCE_MANAGEMENT => 'Finance Management',
            self::USER_MANAGEMENT => 'User Management',
            self::SETTING_MANAGEMENT => 'Setting Management',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::ATTENDANCE_AND_EXPENSE_REGISTRATION => 'A role that can register attendance and expenses. Granted to employees.',
            self::ATTENDANCE_MANAGEMENT => 'A role that can manage attendance. Granted to managers.',
            self::FINANCE_MANAGEMENT => 'A role that can manage finance. Granted to accounting department.',
            self::USER_MANAGEMENT => 'A role that can manage users. Granted to human resources department.',
            self::SETTING_MANAGEMENT => 'A role that can manage settings. Granted to executives.',
        };
    }
}
