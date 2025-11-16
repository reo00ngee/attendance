<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Models\ExpensesAndDeduction;
use App\Enums\SubmissionStatus;
use App\Enums\ExpenseOrDeduction;
use Carbon\Carbon;

class CreateTestPayrollData extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userId = 6;
        $startDate = Carbon::parse('2025-09-26');
        $endDate = Carbon::parse('2025-10-25');
        
        // 既存のデータを削除
        Attendance::where('user_id', $userId)
            ->whereBetween('start_time', [$startDate, $endDate->copy()->endOfDay()])
            ->delete();
            
        ExpensesAndDeduction::where('user_id', $userId)
            ->whereBetween('date', [$startDate, $endDate])
            ->delete();

        $currentDate = $startDate->copy();
        $dayCount = 0;

        while ($currentDate->lte($endDate)) {
            // 週末は休日勤務として扱う（Holiday Pay をテストするため）
            if ($currentDate->isWeekend()) {
                $dayCount++;
                $isHoliday = true;

                // 休日勤務パターン: 10:00-16:00（休憩1時間）
                $startTime = $currentDate->copy()->setTime(10, 0, 0);
                $endTime = $currentDate->copy()->setTime(16, 0, 0);
                $attendance = $this->createAttendance($userId, $startTime, $endTime, $isHoliday);
                $this->createBreak(
                    $attendance->id,
                    $userId,
                    $startTime->copy()->setTime(12, 0, 0),
                    $startTime->copy()->setTime(13, 0, 0)
                );

                // 休日の経費（例: 特別手当）も1件追加
                $this->createExpense($userId, $currentDate, 'Holiday Allowance', 1500, ExpenseOrDeduction::EXPENSE);

                $currentDate->addDay();
                continue;
            }

            $dayCount++;
            $isHoliday = false; // 平日は通常日

            // パターン1: 通常勤務（9:00-18:00、休憩1時間）
            if ($dayCount % 5 == 1) {
                $startTime = $currentDate->copy()->setTime(9, 0, 0);
                $endTime = $currentDate->copy()->setTime(18, 0, 0);
                $attendance = $this->createAttendance($userId, $startTime, $endTime, $isHoliday);
                $this->createBreak($attendance->id, $userId, $startTime->copy()->setTime(12, 0, 0), $startTime->copy()->setTime(13, 0, 0));
            }
            // パターン2: 残業あり（9:00-20:00、休憩1時間）
            elseif ($dayCount % 5 == 2) {
                $startTime = $currentDate->copy()->setTime(9, 0, 0);
                $endTime = $currentDate->copy()->setTime(20, 0, 0);
                $attendance = $this->createAttendance($userId, $startTime, $endTime, $isHoliday);
                $this->createBreak($attendance->id, $userId, $startTime->copy()->setTime(12, 0, 0), $startTime->copy()->setTime(13, 0, 0));
            }
            // パターン3: 深夜勤務（22:00-06:00、休憩1時間）
            elseif ($dayCount % 5 == 3) {
                $startTime = $currentDate->copy()->setTime(22, 0, 0);
                $endTime = $currentDate->copy()->addDay()->setTime(6, 0, 0);
                $attendance = $this->createAttendance($userId, $startTime, $endTime, $isHoliday);
                $this->createBreak($attendance->id, $userId, $startTime->copy()->addHours(2)->setTime(0, 0, 0), $startTime->copy()->addHours(3)->setTime(1, 0, 0));
            }
            // パターン4: 短時間勤務（10:00-15:00、休憩30分）
            elseif ($dayCount % 5 == 4) {
                $startTime = $currentDate->copy()->setTime(10, 0, 0);
                $endTime = $currentDate->copy()->setTime(15, 0, 0);
                $attendance = $this->createAttendance($userId, $startTime, $endTime, $isHoliday);
                $this->createBreak($attendance->id, $userId, $startTime->copy()->setTime(12, 30, 0), $startTime->copy()->setTime(13, 0, 0));
            }
            // パターン5: 複数休憩あり（9:00-19:00、休憩2回）
            else {
                $startTime = $currentDate->copy()->setTime(9, 0, 0);
                $endTime = $currentDate->copy()->setTime(19, 0, 0);
                $attendance = $this->createAttendance($userId, $startTime, $endTime, $isHoliday);
                $this->createBreak($attendance->id, $userId, $startTime->copy()->setTime(12, 0, 0), $startTime->copy()->setTime(13, 0, 0));
                $this->createBreak($attendance->id, $userId, $startTime->copy()->setTime(15, 0, 0), $startTime->copy()->setTime(15, 15, 0));
            }

            // 経費データを作成（週に2-3回程度）
            if ($dayCount % 3 == 0) {
                $this->createExpense($userId, $currentDate, 'Transportation Fee', 500, ExpenseOrDeduction::EXPENSE);
            }
            if ($dayCount % 4 == 0) {
                $this->createExpense($userId, $currentDate, 'Lunch Expense', 1000, ExpenseOrDeduction::EXPENSE);
            }
            if ($dayCount % 7 == 0) {
                $this->createExpense($userId, $currentDate, 'Office Supplies', 2000, ExpenseOrDeduction::EXPENSE);
            }

            $currentDate->addDay();
        }

        // 控除データを数件追加
        $this->createExpense($userId, $startDate->copy()->addDays(5), 'Insurance Deduction', 5000, ExpenseOrDeduction::DEDUCTION);
        $this->createExpense($userId, $startDate->copy()->addDays(15), 'Tax Deduction', 3000, ExpenseOrDeduction::DEDUCTION);
    }

    private function createAttendance(int $userId, Carbon $startTime, Carbon $endTime, bool $isHoliday): Attendance
    {
        return Attendance::create([
            'user_id' => $userId,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'is_holiday' => $isHoliday,
            'submission_status' => SubmissionStatus::SUBMITTED->value,
            'comment' => null,
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);
    }

    private function createBreak(int $attendanceId, int $userId, Carbon $startTime, Carbon $endTime): void
    {
        AttendanceBreak::create([
            'attendance_id' => $attendanceId,
            'user_id' => $userId,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);
    }

    private function createExpense(int $userId, Carbon $date, string $name, float $amount, ExpenseOrDeduction $type): void
    {
        ExpensesAndDeduction::create([
            'user_id' => $userId,
            'expense_or_deduction' => $type->value,
            'name' => $name,
            'amount' => $amount,
            'date' => $date,
            'submission_status' => SubmissionStatus::SUBMITTED->value,
            'comment' => null,
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);
    }
}

