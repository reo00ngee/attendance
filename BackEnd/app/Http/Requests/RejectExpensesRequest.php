<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RejectExpensesRequest extends FormRequest
{
  public function authorize()
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'user_id' => 'required|integer|exists:users,id',
      'year' => 'required|integer|min:2020|max:2100',
      'month' => 'required|integer|min:1|max:12',
      'rejection_reason' => 'required|string|max:2000',
    ];
  }

  protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
  {
    throw new \Illuminate\Http\Exceptions\HttpResponseException(
      response()->json([
        'message' => 'Validation failed',
        'errors' => $validator->errors(),
      ], 422)
    );
  }
}
