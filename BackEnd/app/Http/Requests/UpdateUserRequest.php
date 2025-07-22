<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\Gender;
use App\Enums\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email,' . $this->user_id,
            'password'   => 'required|string|min:6',
            'phone_number' => 'nullable|string|max:20',
            'gender'    => 'nullable|in:' . implode(',', array_column(Gender::cases(), 'value')),
            'birth_date' => 'nullable|date',
            'address'    => 'nullable|string|max:255',
            'hire_date' => 'nullable|date',
            'retire_date' => 'nullable|date|after_or_equal:hire_date',
            'hourly_wage_group_id' => 'required|integer|exists:hourly_wage_groups,id',
            'roles'     => 'required|array|min:1',
            'roles.*'   => 'integer|in:' . implode(',', array_column(Role::cases(), 'value')),
        ];
    }

        protected function failedValidation(Validator $validator)
    {
        // バリデーションエラー内容をログに出力
        Log::error('バリデーションエラー', $validator->errors()->toArray());

        // 既定の422レスポンスを返すための例外を投げる
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
