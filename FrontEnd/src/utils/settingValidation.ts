import { CURRENCY } from "../constants/currency";
import { CLOSING_DATE } from "../constants/closingDate";
import { PAYROLL_ROUNDING_INTERVAL } from "../constants/payrollRoundingInterval";
import { PROMPT_SUBMISSION_REMINDER_DAYS } from "../constants/promptSubmissionReminderDays";

export function validateSettingModification({
  name,
  address,
  phoneNumber,
  email,
  currency,
  closingDate,
  payrollRoundingInterval,
  promptSubmissionReminderDays,
  standardWorkingHours,
  overtimePayMultiplier,
  nightShiftHoursFrom,
  nightShiftHoursTo,
  nightShiftPayMultiplier,
  holidayPayMultiplier,
}: {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  currency: number;
  closingDate: number;
  payrollRoundingInterval: number;
  promptSubmissionReminderDays: number;
  standardWorkingHours: number;
  overtimePayMultiplier: number | "";
  nightShiftHoursFrom: string | "";
  nightShiftHoursTo: string | "";
  nightShiftPayMultiplier: number | "";
  holidayPayMultiplier: number | "";
}): string | null {


  const validateTimeFormat = (timeString: string): boolean => {
    const timeRegex = /^([0-1]?\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(timeString);
  };


  // 必須フィールドのチェック
  if (
    !name ||
    !address ||
    !phoneNumber ||
    !email ||
    !currency ||
    !closingDate ||
    !payrollRoundingInterval ||
    !promptSubmissionReminderDays ||
    !standardWorkingHours
  ) {
    return "Company name, address, phone number, email, currency, closing date, payroll rounding interval, prompt submission reminder days and standard working hours are required.";
  }

  // 文字列長の検証
  if (name.length > 30) {
    return "Company name must be 30 characters or less.";
  }

  if (address.length > 255) {
    return "Address must be 255 characters or less.";
  }

  if (phoneNumber.length > 20) {
    return "Phone number must be 20 characters or less.";
  }

  // メールアドレスの検証（任意フィールド）
  if (!/^[\w\-.]+@[\w\-.]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Invalid email format.";
  }

  if (!CURRENCY.some(c => c.value === currency)) {
    return "Invalid currency.";
  }

  if (!CLOSING_DATE.some(c => c.value === closingDate)) {
    return "Invalid closing date.";
  }

  if (!PAYROLL_ROUNDING_INTERVAL.some(p => p.value === payrollRoundingInterval)) {
    return "Invalid payroll rounding interval.";
  }

  if (!PROMPT_SUBMISSION_REMINDER_DAYS.some(p => p.value === promptSubmissionReminderDays)) {
    return "Invalid prompt submission reminder days.";
  }

  if (standardWorkingHours && Number(standardWorkingHours) < 0) {
    return "Standard working hours must be 0 or greater.";
  }

  if (standardWorkingHours && Number(standardWorkingHours) > 24) {
    return "Standard working hours must be 24 or less.";
  }

  if (overtimePayMultiplier && isNaN(Number(overtimePayMultiplier))) {
    return "Overtime pay multiplier must be a number.";
  }

  if (overtimePayMultiplier && Number(overtimePayMultiplier) < 1) {
    return "Overtime pay multiplier must be 1 or greater.";
  }

  if (nightShiftPayMultiplier && isNaN(Number(nightShiftPayMultiplier))) {
    return "Night shift pay multiplier must be a number.";
  }

  if (nightShiftPayMultiplier && Number(nightShiftPayMultiplier) < 1) {
    return "Night shift pay multiplier must be 1 or greater.";
  }

  if (holidayPayMultiplier && isNaN(Number(holidayPayMultiplier))) {
    return "Holiday pay multiplier must be a number.";
  }

  if (holidayPayMultiplier && Number(holidayPayMultiplier) < 1) {
    return "Holiday pay multiplier must be 1 or greater.";
  }

  if (nightShiftHoursFrom && !validateTimeFormat(nightShiftHoursFrom)) {
    return "Night shift start time must be in HH:MM format (e.g., 22:00).";
  }

  if (nightShiftHoursTo && !validateTimeFormat(nightShiftHoursTo)) {
    return "Night shift end time must be in HH:MM format (e.g., 06:00).";
  }

  if ((nightShiftHoursFrom && !nightShiftHoursTo) || (!nightShiftHoursFrom && nightShiftHoursTo)) {
    return "Both night shift start and end times must be set.";
  }

  // 夜勤時間の論理チェック（両方が設定されている場合）
  if (nightShiftHoursFrom && nightShiftHoursTo) {
    if (nightShiftHoursFrom === nightShiftHoursTo) {
      return "Night shift start and end times cannot be the same.";
    }
  }

  return null;
}