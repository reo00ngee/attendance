<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Enums\Currency;
use App\Enums\PayrollRoundingInterval;
use App\Enums\PromptSubmissionReminderDays;
use App\Enums\ClosingDate;


class UpdateSettingRequest extends FormRequest
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
      // 必須フィールド
      'name' => 'required|string|max:30',
      'address' => 'required|string|max:255',
      'phone_number' => 'required|string|max:20',
      'email' => 'required|email|max:255',
      'currency' => 'required|integer|in:' . implode(',', array_column(Currency::cases(), 'value')),
      'closing_date' => 'required|integer|in:' . implode(',', array_column(ClosingDate::cases(), 'value')),
      'payroll_rounding_interval' => 'required|integer|in:' . implode(',', array_column(PayrollRoundingInterval::cases(), 'value')),
      'prompt_submission_reminder_days' => 'required|integer|in:' . implode(',', array_column(PromptSubmissionReminderDays::cases(), 'value')),
      'standard_working_hours' => 'required|numeric|min:0|max:24',

      // オプションフィールド（nullableまたは空文字列許可）
      'overtime_pay_multiplier' => 'nullable|numeric|min:1',
      'night_shift_hours_from' => 'nullable|date_format:H:i:s',
      'night_shift_hours_to' => 'nullable|date_format:H:i:s',
      'night_shift_pay_multiplier' => 'nullable|numeric|min:1',
      'holiday_pay_multiplier' => 'nullable|numeric|min:1',
    ];
  }

  /**
   * Configure the validator instance.
   */
  public function withValidator($validator)
  {
    $validator->after(function ($validator) {
      // 夜勤時間の組み合わせチェック
      $this->validateNightShiftHours($validator);
    });
  }

  /**
   * 夜勤時間の整合性チェック
   */
  private function validateNightShiftHours($validator)
  {
    $nightShiftFrom = $this->input('night_shift_hours_from');
    $nightShiftTo = $this->input('night_shift_hours_to');

    // 一方だけが設定されている場合はエラー
    if (($nightShiftFrom && !$nightShiftTo) || (!$nightShiftFrom && $nightShiftTo)) {
      $validator->errors()->add(
        'night_shift_hours',
        'Both night shift start and end times must be set together.'
      );
      return;
    }

    // 両方が設定されている場合の詳細チェック
    if ($nightShiftFrom && $nightShiftTo) {
      // 開始時間と終了時間が同じ場合
      if ($nightShiftFrom === $nightShiftTo) {
        $validator->errors()->add(
          'night_shift_hours',
          'Night shift start and end times cannot be the same.'
        );
        return;
      }
    }
  }

  /**
   * Get custom messages for validator errors.
   */
  public function messages(): array
  {
    return [
      'name.required' => 'Company name is required.',
      'name.max' => 'Company name must be 30 characters or less.',
      'address.required' => 'Address is required.',
      'address.max' => 'Address must be 255 characters or less.',
      'phone_number.required' => 'Phone number is required.',
      'phone_number.max' => 'Phone number must be 20 characters or less.',
      'email.required' => 'Email is required.',
      'email.email' => 'Invalid email format.',
      'currency.required' => 'Currency is required.',
      'currency.in' => 'Invalid currency.',
      'closing_date.required' => 'Closing date is required.',
      'closing_date.min' => 'Closing date must be between 1 and 31.',
      'closing_date.max' => 'Closing date must be between 1 and 31.',
      'payroll_rounding_interval.required' => 'Payroll rounding interval is required.',
      'payroll_rounding_interval.in' => 'Invalid payroll rounding interval.',
      'prompt_submission_reminder_days.required' => 'Prompt submission reminder days is required.',
      'prompt_submission_reminder_days.min' => 'Prompt submission reminder days must be 1 or greater.',
      'prompt_submission_reminder_days.max' => 'Prompt submission reminder days must be 30 or less.',
      'standard_working_hours.required' => 'Standard working hours is required.',
      'standard_working_hours.min' => 'Standard working hours must be 0 or greater.',
      'standard_working_hours.max' => 'Standard working hours must be 24 or less.',
      'overtime_pay_multiplier.min' => 'Overtime pay multiplier must be 1 or greater.',
      'night_shift_hours_from.date_format' => 'Night shift start time must be in HH:MM:SS format.',
      'night_shift_hours_to.date_format' => 'Night shift end time must be in HH:MM:SS format.',
      'night_shift_pay_multiplier.min' => 'Night shift pay multiplier must be 1 or greater.',
      'holiday_pay_multiplier.min' => 'Holiday pay multiplier must be 1 or greater.',
    ];
  }

  /**
   * Handle a failed validation attempt.
   */
  protected function failedValidation(Validator $validator)
  {
    // バリデーションエラー内容をログに出力
    Log::error('Setting validation failed', $validator->errors()->toArray());

    // 既定の422レスポンスを返すための例外を投げる
    throw new HttpResponseException(response()->json([
      'message' => 'Validation failed',
      'errors' => $validator->errors(),
    ], 422));
  }
}
