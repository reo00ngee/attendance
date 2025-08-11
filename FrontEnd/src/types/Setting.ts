export interface Setting {
  company_id: number;
  id: number;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  currency: number;
  closing_date: number;
  last_closing_date: string;
  payroll_rounding_interval: number;
  prompt_submission_reminder_days: number;
  standard_working_hours: number;
  overtime_pay_multiplier: number;
  night_shift_hours_from: string;
  night_shift_hours_to: string;
  night_shift_pay_multiplier: number;
  holiday_pay_multiplier: number;
  attendance_ready: number;
  expense_ready: number;
}