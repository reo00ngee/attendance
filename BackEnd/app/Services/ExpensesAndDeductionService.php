<?php

namespace App\Services;

use App\Repositories\ExpensesAndDeductionRepository;
use App\Repositories\CompanyRepository;
use App\Models\User;
use App\Traits\FetchCompanyDataTrait;
use App\Traits\PeriodCalculatorTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpensesAndDeductionService
{
  use FetchCompanyDataTrait;
  use PeriodCalculatorTrait;
  private ExpensesAndDeductionRepository $expensesAndDeductionRepository;
  private CompanyRepository $companyRepository;

  public function __construct(ExpensesAndDeductionRepository $expensesAndDeductionRepository, CompanyRepository $companyRepository)
  {
    $this->companyRepository = $companyRepository;
    $this->expensesAndDeductionRepository = $expensesAndDeductionRepository;
  }

  public function getAllExpensesForUser($company_id, $user_id, $year, $month)
  {
    $closing_date = $this->getCompanyClosingDate($company_id);
    [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
    $expenses = $this->expensesAndDeductionRepository->getAllExpensesForUser($user_id, $start, $end);
    return $expenses->map(function ($expense) {
      return [
        'id' => $expense->id,
        'user_id' => $expense->user_id,
        'expense_or_deduction' => $expense->expense_or_deduction,
        'name' => $expense->name,
        'amount' => $expense->amount,
        'date' => $expense->date ? $expense->date->format('Y-m-d') : '',
        'submission_status' => $expense->submission_status,
        'comment' => $expense->comment,
      ];
    });
  }

  public function batchUpdateExpenses(int $company_id, int $user_id, array $updated, array $created, array $deleted, int $year, int $month)
  {
    try {
      return DB::transaction(function () use ($company_id, $user_id, $updated, $created, $deleted, $year, $month) {

        // 既存データの更新
        foreach ($updated as $expenseData) {
          $this->expensesAndDeductionRepository->updateExpense(
            $expenseData['id'],
            $user_id,
            $expenseData
          );
        }

        // 新規データの作成
        foreach ($created as $expenseData) {
          $expenseData['user_id'] = $user_id;
          $expenseData['submission_status'] = 0; // 未提出
          $expenseData['created_by'] = $user_id;
          $expenseData['updated_by'] = $user_id;

          $this->expensesAndDeductionRepository->createExpense($expenseData);
        }

        // 削除データの処理
        foreach ($deleted as $deleted_id) {
          $this->expensesAndDeductionRepository->deleteExpense($deleted_id, $user_id);
        }

        // 更新後のデータを取得
        return $this->getAllExpensesForUser($company_id, $user_id, $year, $month);
      });
    } catch (\Exception $e) {
      Log::error('Failed to batch update expenses', [
        'user_id' => $user_id,
        'updated_count' => count($updated),
        'created_count' => count($created),
        'error' => $e->getMessage()
      ]);

      return response()->json(['message' => 'Failed to update expenses'], 500);
    }
  }

  public function submitExpenses($company_id, $user_id, $year, $month)
  {
    try {
      DB::transaction(function () use ($company_id, $user_id, $year, $month) {
        $closing_date = $this->getCompanyClosingDate($company_id);
        [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
        $expenses = $this->expensesAndDeductionRepository->getAllExpensesForUser($user_id, $start, $end);
        foreach ($expenses as $expense) {
          $this->expensesAndDeductionRepository->submitExpense($expense);
        }
      });

      return $this->getAllExpensesForUser($company_id, $user_id, $year, $month);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Failed to submit expenses: ' . $e->getMessage()], 500);
    }
  }
}
