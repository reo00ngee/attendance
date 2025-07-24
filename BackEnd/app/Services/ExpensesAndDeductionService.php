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
}