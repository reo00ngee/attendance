import { Attendance } from "../types/Attendance";
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

export function calculateBreakMinutesAndNetWorkingMinutes(
  att: Attendance,
  setBreakMinutes: SetNumberFn,
  setNetWorkingMinutes: SetNumberFn
) {
  const work = calculateDiffTime(att.start_time, att.end_time || undefined);
  const breakSum = att.attendance_breaks.reduce((sum, b) => {
    return sum + calculateDiffTime(b.start_time, b.end_time || undefined);
  }, 0);

  setBreakMinutes(breakSum);
  const netWorking = Math.max(work - breakSum, 0);
  setNetWorkingMinutes(netWorking);
}