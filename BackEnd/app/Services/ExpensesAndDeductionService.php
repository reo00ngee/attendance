<?php

namespace App\Services;

use App\Repositories\ExpensesAndDeductionRepository;
use App\Repositories\CompanyRepository;
use App\Repositories\InformationRepository;
use App\Traits\FetchCompanyDataTrait;
use App\Traits\PeriodCalculatorTrait;
use App\Enums\SubmissionType;
use App\Enums\InformationType;
use App\Enums\SubmissionStatus;
use App\Enums\ExpenseOrDeduction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ExpensesAndDeductionService
{
  use FetchCompanyDataTrait;
  use PeriodCalculatorTrait;
  private ExpensesAndDeductionRepository $expensesAndDeductionRepository;
  private CompanyRepository $companyRepository;
  private InformationRepository $informationRepository;
  public function __construct(ExpensesAndDeductionRepository $expensesAndDeductionRepository, CompanyRepository $companyRepository, InformationRepository $informationRepository)
  {
    $this->companyRepository = $companyRepository;
    $this->expensesAndDeductionRepository = $expensesAndDeductionRepository;
    $this->informationRepository = $informationRepository;
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

  public function batchUpdateExpenses(int $company_id, int $user_id, array $updated, array $created, array $deleted, int $year, int $month, bool $is_created_by_user)
  {
    try {
      return DB::transaction(function () use ($company_id, $user_id, $updated, $created, $deleted, $year, $month, $is_created_by_user ) {

        foreach ($updated as $expenseData) {
          // ExpenseRegistrationからの更新の場合のみsubmission_statusを0（CREATED）に設定
          if ($is_created_by_user) {
            $expenseData['submission_status'] = SubmissionStatus::CREATED->value;
          }
          $this->expensesAndDeductionRepository->updateExpense(
            $expenseData['id'],
            $user_id,
            $expenseData
          );
        }



        // 新規データの作成
        foreach ($created as $expenseData) {
          $expenseData['user_id'] = $user_id;
          $expenseData['name'] = $expenseData['name'];
          $expenseData['amount'] = $expenseData['amount'];
          $expenseData['date'] = Carbon::parse($expenseData['date'])->format('Y-m-d');
          $expenseData['comment'] = $expenseData['comment'];
          $expenseData['submission_status'] = $expenseData['submission_status'] ?? SubmissionStatus::CREATED->value  ;
          $expenseData['expense_or_deduction'] = $expenseData['expense_or_deduction'] ?? ExpenseOrDeduction::EXPENSE->value  ;
          $expenseData['created_by'] = $user_id;
          $expenseData['updated_by'] = $user_id;

          $this->expensesAndDeductionRepository->createExpense($expenseData);
        }

        // 削除データの処理
        foreach ($deleted as $deleted_id) {
          $this->expensesAndDeductionRepository->deleteExpense($deleted_id, $user_id);
        }

        // 更新後のデータを取得
        if($is_created_by_user) {
          return $this->getAllExpensesForUser($company_id, $user_id, $year, $month);
        } else {
          return $this->getCreatedByManagerExpensesAndDeductions($company_id, $user_id, $year, $month);
        }
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

  public function getSubmittedAndApprovedExpenses($company_id, $user_id, $year, $month)
  {
    $closing_date = $this->getCompanyClosingDate($company_id);
    [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
    $submitted_expenses_and_deductions = $this->expensesAndDeductionRepository->getSubmittedAndApprovedExpenses($user_id, $start, $end);
    return $submitted_expenses_and_deductions->map(function ($expense) {
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

  public function approveExpenses($company_id, $user_id, $year, $month)
  {
    try {
      DB::transaction(function () use ($company_id, $user_id, $year, $month) {

        $closing_date = $this->getCompanyClosingDate($company_id);
        [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
        $expenses = $this->expensesAndDeductionRepository->getSubmittedAndApprovedExpenses($user_id, $start, $end);
        foreach ($expenses as $expense) {
          $this->expensesAndDeductionRepository->approveExpense($expense);
        }

        $this->informationRepository->deleteInformations($user_id);
        $this->informationRepository->createInformation(
          $user_id,
          SubmissionType::EXPENSE->value,
          InformationType::SUBMISSION_APPROVED->value,
        );
      });

      return $this->getSubmittedAndApprovedExpenses($company_id, $user_id, $year, $month);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Failed to approve expenses: ' . $e->getMessage()], 500);
    }
  }

  public function rejectExpenses($company_id, $user_id, $year, $month, $rejection_reason)
  {
    try {
      DB::transaction(function () use ($company_id, $user_id, $year, $month, $rejection_reason) {

        $closing_date = $this->getCompanyClosingDate($company_id);
        [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
        $expenses = $this->expensesAndDeductionRepository->getSubmittedAndApprovedExpenses($user_id, $start, $end);
        foreach ($expenses as $expense) {
          $this->expensesAndDeductionRepository->rejectExpense($expense);
        }

        $this->informationRepository->deleteInformations($user_id);
        $this->informationRepository->createInformation(
          $user_id,
          SubmissionType::EXPENSE->value,
          InformationType::SUBMISSION_REJECTED->value,
          $rejection_reason,
        );
      });

      return $this->getSubmittedAndApprovedExpenses($company_id, $user_id, $year, $month);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Failed to reject expenses: ' . $e->getMessage()], 500);
    }
  }

  public function getCreatedByManagerExpensesAndDeductions($company_id, $user_id, $year, $month)
  {
    $closing_date = $this->getCompanyClosingDate($company_id);
    [$start, $end] = $this->getPeriodRange($closing_date, $year, $month);
    $created_by_manager_expenses_deductions = $this->expensesAndDeductionRepository->getCreatedByManagerExpensesAndDeductions($user_id, $start, $end);
    return $created_by_manager_expenses_deductions->map(function ($expense) {
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
}
