<?php

namespace App\Services;

use App\Repositories\ExpensesAndDeductionRepository;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpensesAndDeductionService
{
  private ExpensesAndDeductionRepository $expensesAndDeductionRepository;

  public function __construct(ExpensesAndDeductionRepository $expensesAndDeductionRepository)
  {
    $this->expensesAndDeductionRepository = $expensesAndDeductionRepository;
  }

  public function getAllExpensesForUser(User $user, $year, $month)
  {
    $expenses = $this->expensesAndDeductionRepository->getAllExpensesForUser($user->id, $year, $month);
    if ($expenses->isEmpty()) {
      return response()->json(['message' => 'No expenses found for the specified period'], 404);
    }
    return $expenses->map(function ($expense) {
      return [
        'id' => $expense->id,
        'user_id' => $expense->user_id,
        'expense_or_deduction' => $expense->expense_or_deduction,
        'name' => $expense->name,
        'amount' => $expense->amount,
        'date' => $expense->date ? $expense->date->format('Y-m-d') : '',
        'comment' => $expense->comment,
      ];
    });
  }

  public function batchUpdateExpenses(User $user, array $updated, array $created, int $year, int $month)
  {
    try {
      return DB::transaction(function () use ($user, $updated, $created, $year, $month) {

        // 既存データの更新
        foreach ($updated as $expenseData) {
          $this->expensesAndDeductionRepository->updateExpense(
            $expenseData['id'],
            $user->id,
            $expenseData
          );
        }

        // 新規データの作成
        foreach ($created as $expenseData) {
          $expenseData['user_id'] = $user->id;
          $expenseData['submission_status'] = 0; // 未提出
          $expenseData['created_by'] = $user->id;
          $expenseData['updated_by'] = $user->id;

          $this->expensesAndDeductionRepository->createExpense($expenseData);
        }

        // 更新後のデータを取得
        $expenses = $this->expensesAndDeductionRepository->getAllExpensesForUser($user->id, $year, $month);

        return response()->json([
          'message' => 'Expenses updated successfully',
          'data' => $expenses
        ]);
      });
    } catch (\Exception $e) {
      Log::error('Failed to batch update expenses', [
        'user_id' => $user->id,
        'updated_count' => count($updated),
        'created_count' => count($created),
        'error' => $e->getMessage()
      ]);

      return response()->json(['message' => 'Failed to update expenses'], 500);
    }
  }
}
