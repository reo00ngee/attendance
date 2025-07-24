import { Attendance } from "../types/Attendance";
import { ExpenseOrDeduction } from "../types/Expense";
type SetNumberFn = (value: number) => void;

// Calculates the difference in time (in minutes) between two time strings 
export function calculateDiffTime(startTime: string, endTime?: string): number {
  if (!startTime) return 0;

  const start = new Date(startTime);
  if (isNaN(start.getTime())) return 0;

  const end = endTime ? new Date(endTime) : new Date();
  if (isNaN(end.getTime())) return 0;

  const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

  return Math.max(diffMinutes, 0);
}

// Calculates the BreakMinutes And NetWorkingMinutes
export function calculateBreakMinutesAndNetWorkingMinutes(att: Attendance): [number, number] {
  const work = calculateDiffTime(att.start_time, att.end_time || undefined);
  const breakSum = att.attendance_breaks.reduce((sum, b) => {
    return sum + calculateDiffTime(b.start_time, b.end_time || undefined);
  }, 0);
  const netWorking = Math.max(work - breakSum, 0);
  return [breakSum, netWorking];
}

export function calculateTotalAmount(expenses: ExpenseOrDeduction[]): number {
  return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
}