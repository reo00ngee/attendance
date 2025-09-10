<?php

namespace App\Repositories;

use App\Models\ExpensesAndDeduction;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Enums\SubmissionStatus;
use App\Enums\ExpenseOrDeduction;

class ExpensesAndDeductionRepository
{
  public function getAllExpensesForUser($user_id, $start, $end)
  {
    return ExpensesAndDeduction::where('user_id', $user_id)
      ->where('expense_or_deduction', ExpenseOrDeduction::EXPENSE->value)
      ->whereBetween('date', [$start, $end])
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
        'submission_status' => $data['submission_status'] ?? SubmissionStatus::CREATED->value,
        'expense_or_deduction' => $data['expense_or_deduction'] ?? ExpenseOrDeduction::EXPENSE->value,
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

  public function submitExpense($expense)
  {
        $expense->submission_status = SubmissionStatus::SUBMITTED->value;
        $expense->updated_by = auth()->id();
        $expense->updated_at = now();
        return $expense->save();
  }

  public function getSubmittedAndApprovedExpenses($user_id, $start, $end)
  {
    return ExpensesAndDeduction::where('user_id', $user_id)
      ->whereBetween('date', [$start, $end])
      ->whereIn('submission_status', [
        SubmissionStatus::SUBMITTED,
        SubmissionStatus::APPROVED
      ])
      ->get();
  }

  public function approveExpense($expense)
  {
    $expense->submission_status = SubmissionStatus::APPROVED->value;
    $expense->save();
  }

  public function rejectExpense($expense)
  {
    $expense->submission_status = SubmissionStatus::REJECTED->value;
    $expense->save();
  }

  public function getCreatedByManagerExpensesAndDeductions($user_id, $start, $end)
  {
    return ExpensesAndDeduction::where('user_id', $user_id)
      ->whereBetween('date', [$start, $end])
      ->where('submission_status', SubmissionStatus::CREATED_BY_MANAGER->value)
      ->get();
  }

}