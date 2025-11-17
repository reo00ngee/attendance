<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class UpdateHourlyWageGroupRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'hourly_wage_group_id' => 'required|integer|exists:hourly_wage_groups,id',
      'name' => 'required|string|max:30',
      'hourly_wage' => 'required|numeric|min:0',
      'comment' => 'nullable|string|max:2000',
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
