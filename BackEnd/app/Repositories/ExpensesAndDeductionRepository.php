<?php

namespace App\Repositories;

use App\Models\ExpensesAndDeduction;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Enums\SubmissionStatus;
use App\Enums\ExpenseOrDeduction;

class ExpensesAndDeductionRepository
{
  public function getAllExpensesForUser($user_id, $year, $month)
  {
    return ExpensesAndDeduction::where('user_id', $user_id)
    ->where('expense_or_deduction', ExpenseOrDeduction::EXPENSE->value)
    ->whereYear('date', $year)
    ->whereMonth('date', $month)
    ->get();
  }
}