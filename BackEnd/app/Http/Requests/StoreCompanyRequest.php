<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
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
            // Company validation rules
            'name' => 'required|string|max:30|unique:companies',
            'address' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'currency' => 'required|integer',
            'closing_date' => 'required|integer|in:15,20,25,30',
            'payroll_rounding_interval' => 'required|integer|min:1',
            'prompt_submission_reminder_days' => 'required|integer|min:1',
            'standard_working_hours' => 'required|integer|min:1',
            'overtime_pay_multiplier' => 'nullable|numeric|min:0',
            'night_shift_hours_from' => 'nullable|date_format:H:i',
            'night_shift_hours_to' => 'nullable|date_format:H:i',
            'night_shift_pay_multiplier' => 'nullable|numeric|min:0',
            'holiday_pay_multiplier' => 'nullable|numeric|min:0',
            
            // User validation rules
            'user_email' => 'required|email|max:255|unique:users,email',
            'user_password' => 'required|string|min:8|confirmed',
            'user_first_name' => 'required|string|max:255',
            'user_last_name' => 'required|string|max:255',
            'user_phone' => 'nullable|string|max:20',
            'user_gender' => 'nullable|string|max:10',
            'user_birth_date' => 'nullable|date',
            'user_address' => 'nullable|string|max:255',
            'user_hire_date' => 'required|date',
            'user_retire_date' => 'nullable|date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Company name is required.',
            'name.unique' => 'Company name already exists.',
            'name.max' => 'Company name must not exceed 30 characters.',
            'address.required' => 'Company address is required.',
            'address.max' => 'Company address must not exceed 255 characters.',
            'phone_number.required' => 'Phone number is required.',
            'phone_number.max' => 'Phone number must not exceed 20 characters.',
            'email.required' => 'Company email is required.',
            'email.email' => 'Please enter a valid company email address.',
            'email.max' => 'Company email must not exceed 255 characters.',
            'currency.required' => 'Currency is required.',
            'currency.integer' => 'Currency must be a valid selection.',
            'closing_date.required' => 'Closing date is required.',
            'closing_date.in' => 'Closing date must be one of: 15, 20, 25, 30.',
            'payroll_rounding_interval.required' => 'Payroll rounding interval is required.',
            'payroll_rounding_interval.min' => 'Payroll rounding interval must be at least 1.',
            'prompt_submission_reminder_days.required' => 'Prompt submission reminder days is required.',
            'prompt_submission_reminder_days.min' => 'Prompt submission reminder days must be at least 1.',
            'standard_working_hours.required' => 'Standard working hours is required.',
            'standard_working_hours.min' => 'Standard working hours must be at least 1.',
            'overtime_pay_multiplier.numeric' => 'Overtime pay multiplier must be a number.',
            'overtime_pay_multiplier.min' => 'Overtime pay multiplier must be 0 or greater.',
            'night_shift_hours_from.date_format' => 'Night shift start time must be in HH:MM format.',
            'night_shift_hours_to.date_format' => 'Night shift end time must be in HH:MM format.',
            'night_shift_pay_multiplier.numeric' => 'Night shift pay multiplier must be a number.',
            'night_shift_pay_multiplier.min' => 'Night shift pay multiplier must be 0 or greater.',
            'holiday_pay_multiplier.numeric' => 'Holiday pay multiplier must be a number.',
            'holiday_pay_multiplier.min' => 'Holiday pay multiplier must be 0 or greater.',
            
            'user_email.required' => 'User email is required.',
            'user_email.email' => 'Please enter a valid user email address.',
            'user_email.unique' => 'User email already exists.',
            'user_email.max' => 'User email must not exceed 255 characters.',
            'user_password.required' => 'User password is required.',
            'user_password.min' => 'User password must be at least 8 characters.',
            'user_password.confirmed' => 'User password confirmation does not match.',
            'user_first_name.required' => 'User first name is required.',
            'user_first_name.max' => 'User first name must not exceed 255 characters.',
            'user_last_name.required' => 'User last name is required.',
            'user_last_name.max' => 'User last name must not exceed 255 characters.',
            'user_phone.max' => 'User phone number must not exceed 20 characters.',
            'user_gender.max' => 'User gender must not exceed 10 characters.',
            'user_birth_date.date' => 'User birth date must be a valid date.',
            'user_address.max' => 'User address must not exceed 255 characters.',
            'user_hire_date.required' => 'User hire date is required.',
            'user_hire_date.date' => 'User hire date must be a valid date.',
            'user_retire_date.date' => 'User retire date must be a valid date.',
        ];
    }
}

