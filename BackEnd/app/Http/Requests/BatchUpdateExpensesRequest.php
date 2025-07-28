<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class BatchUpdateExpensesRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
        return [
            'updated' => 'sometimes|array',
            'updated.*.user_id' => 'integer|exists:users,id',
            'updated.*.id' => 'required_with:updated|integer|exists:expenses_and_deductions,id',
            'updated.*.name' => 'required_with:updated|string|max:30',
            'updated.*.amount' => 'required_with:updated|numeric|min:0',
            'updated.*.date' => 'required_with:updated|date',
            'updated.*.comment' => 'nullable|string|max:2000',
            'updated.*.expense_or_deduction' => 'required_with:updated|integer|in:0,1',
            
            'created' => 'sometimes|array',
            'created.*.name' => 'required_with:created|string|max:30',
            'created.*.amount' => 'required_with:created|numeric|min:0',
            'created.*.date' => 'required_with:created|date',
            'created.*.comment' => 'nullable|string|max:2000',
            'created.*.expense_or_deduction' => 'required_with:created|integer|in:0,1',
            
            'year' => 'required|integer|min:2000|max:2100',
            'month' => 'required|integer|min:1|max:12',

            'deleted' => 'sometimes|array',
            // 'deleted.*.id' => 'integer',
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
