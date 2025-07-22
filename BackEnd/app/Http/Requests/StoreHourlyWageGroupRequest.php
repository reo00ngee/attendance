<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHourlyWageGroupRequest extends FormRequest
{
  public function authorize()
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'name' => 'required|string|max:30',
      'hourly_wage' => 'required|numeric|min:0',
      'comment' => 'nullable|string|max:2000',
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
