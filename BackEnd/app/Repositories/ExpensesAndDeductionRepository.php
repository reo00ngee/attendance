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

  public function createExpense(array $data): ExpensesAndDeduction
  {
    return ExpensesAndDeduction::create($data);
  }

  public function updateExpense(int $expense_id, int $user_id, array $data): bool
  {
    return ExpensesAndDeduction::where('id', $expense_id)
      ->where('user_id', $user_id) // セキュリティ: 自分の経費のみ更新可能
      ->update([
        'name' => $data['name'],
        'amount' => $data['amount'],
        'date' => $data['date'],
        'comment' => $data['comment'] ?? null,
        'expense_or_deduction' => $data['expense_or_deduction'],
        'updated_by' => $user_id,
        'updated_at' => now(),
      ]);
  }


  public function deleteExpense(int $expense_id, int $user_id): bool
  {
    return ExpensesAndDeduction::where('id', $expense_id)
      ->where('user_id', $user_id)
      ->delete();
  }
}
