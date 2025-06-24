<?php

namespace App\Enums;

enum ExpenseOrDeduction: int
{
    case EXPENSE = 0;
    case DEDUCTION = 1;

    public function label(): string
    {
        return match($this) {
            self::EXPENSE => 'Expense',
            self::DEDUCTION => 'Deduction',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::EXPENSE => 'An amount paid or reimbursed by the company.',
            self::DEDUCTION => 'An amount subtracted from the employee’s salary.',
        };
    }
}
