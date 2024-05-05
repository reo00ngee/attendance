<?php

namespace App\Enums;

class ExpenseOrDeduction
{
    const EXPENSE = 0;
    const DEDUCTION = 1;

    public static function getExpenseOrDeduction($value)
    {
        switch ($value) {
            case self::EXPENSE:
                return 'Expense';
                break;
            case self::DEDUCTION:
                return 'Deduction';
                break;
            default:
                return null;
        }
    }
}
