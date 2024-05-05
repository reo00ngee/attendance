<?php

namespace App\Enums;

class Role
{
    const ATTENDANCE_AND_EXPENSE_REGISTRATION = 0;
    const ATTENDANCE_MANAGEMENT = 1;
    const FINANCE_MANAGEMENT = 2;
    const USER_MANAGEMENT = 3;
    const SETTING_MANAGEMENT = 4;

    public static function getRole($value) {
        switch ($value) {
            case self::ATTENDANCE_AND_EXPENSE_REGISTRATION:
                return 'Attendance and Expense Registration';
                break;
            case self::ATTENDANCE_MANAGEMENT:
                return 'Attendance Management';
                break;
            case self::FINANCE_MANAGEMENT:
                return 'Finance Management';
                break;
            case self::USER_MANAGEMENT:
                return 'User Management';
                break;
            case self::SETTING_MANAGEMENT:
                return 'Setting Management';
                break;
            default:
                return null;
        }
    }

    public static function getRoleDescription($value) {
        switch ($value) {
            case self::ATTENDANCE_AND_EXPENSE_REGISTRATION:
                return 'A role that can register attendance. granted to employees.';
                break;
            case self::ATTENDANCE_MANAGEMENT:
                return 'A role that can manage attendance. granted to managers.';
                break;
            case self::FINANCE_MANAGEMENT:
                return 'A role that can manage finance. granted to accounting department.';
                break;
            case self::USER_MANAGEMENT:
                return 'A role that can manage users. granted to human resources department.';
                break;
            case self::SETTING_MANAGEMENT:
                return 'A role that can manage setting. granted to executives.';
                break;
            default:
                return null;
        }
    }
}
