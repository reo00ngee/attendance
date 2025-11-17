<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use App\Enums\ExpenseOrDeduction;
use App\Enums\SubmissionStatus;

class BatchUpdateExpensesRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
        $expenseOrDeductionValues = implode(',', array_column(ExpenseOrDeduction::cases(), 'value'));
        $submissionStatusValues = implode(',', array_column(SubmissionStatus::cases(), 'value'));
        
        return [
            'updated' => 'sometimes|array',
            'updated.*.user_id' => 'integer|exists:users,id',
            'updated.*.id' => 'required_with:updated|integer|exists:expenses_and_deductions,id',
            'updated.*.name' => 'required_with:updated|string|max:30',
            'updated.*.amount' => 'required_with:updated|numeric|min:0',
            'updated.*.date' => 'required_with:updated|date',
            'updated.*.comment' => 'nullable|string|max:2000',
            'updated.*.expense_or_deduction' => 'required_with:updated|integer|in:' . $expenseOrDeductionValues,
            'updated.*.submission_status' => 'sometimes|integer|in:' . $submissionStatusValues,
            
            'created' => 'sometimes|array',
            'created.*.name' => 'required_with:created|string|max:30',
            'created.*.amount' => 'required_with:created|numeric|min:0',
            'created.*.date' => 'required_with:created|date',
            'created.*.comment' => 'nullable|string|max:2000',
            'created.*.expense_or_deduction' => 'required_with:created|integer|in:' . $expenseOrDeductionValues,
            'created.*.submission_status' => 'sometimes|integer|in:' . $submissionStatusValues,
            
            'year' => 'required|integer|min:2000|max:2100',
            'month' => 'required|integer|min:1|max:12',
            'is_created_by_user' => 'required|boolean',

            'deleted' => 'sometimes|array',
            // 'deleted.*.id' => 'integer',
        ];
  }

  public function messages(): array
  {
    $submissionStatusLabels = array_map(fn($case) => $case->value . ' (' . $case->label() . ')', SubmissionStatus::cases());
    $submissionStatusMessage = 'The submission status must be one of: ' . implode(', ', $submissionStatusLabels) . '.';
    
    return [
      'updated.*.expense_or_deduction.in' => 'The expense or deduction type must be either ' . ExpenseOrDeduction::EXPENSE->value . ' (Expense) or ' . ExpenseOrDeduction::DEDUCTION->value . ' (Deduction).',
      'created.*.expense_or_deduction.in' => 'The expense or deduction type must be either ' . ExpenseOrDeduction::EXPENSE->value . ' (Expense) or ' . ExpenseOrDeduction::DEDUCTION->value . ' (Deduction).',
      'updated.*.submission_status.in' => $submissionStatusMessage,
      'created.*.submission_status.in' => $submissionStatusMessage,
    ];
  }

  protected function failedValidation(Validator $validator)
  {
    Log::error('バリデーションエラー', $validator->errors()->toArray());

    throw new HttpResponseException(response()->json([
      'message' => 'Validation failed',
      'errors' => $validator->errors(),
    ], 422));
  }
}
