<?php

namespace App\Services;

use App\Enums\ExpenseOrDeduction;
use App\Enums\SubmissionStatus;
use App\Mail\EmployeePayslip;
use App\Mail\FinancePayslipArchive;
use App\Models\Attendance;
use App\Models\Company;
use App\Models\ExpensesAndDeduction;
use App\Models\Holiday;
use App\Models\PayrollBatchLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use ZipArchive;
use Throwable;

class PayrollService
{
    private PayrollPdfService $pdfService;

    public function __construct(PayrollPdfService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    /**
     * Process monthly payroll for eligible companies.
     */
    public function process(Carbon $runDate): void
    {
        Log::info('Payroll batch process started', [
            'run_date' => $runDate->format('Y-m-d H:i:s'),
            'timezone' => 'Asia/Tokyo',
        ]);

        $companies = $this->getTargetCompanies($runDate);

        Log::info('Target companies retrieved', [
            'count' => $companies->count(),
            'company_ids' => $companies->pluck('id')->toArray(),
        ]);

        if ($companies->isEmpty()) {
            Log::info('No companies to process. Batch completed.');
            return;
        }

        $successCount = 0;
        $errorCount = 0;

        foreach ($companies as $company) {
            try {
                Log::info('Processing company', [
                    'company_id' => $company->id,
                    'company_name' => $company->name,
                    'closing_date' => $company->closing_date,
                    'last_closing_date' => $company->last_closing_date?->format('Y-m-d'),
                ]);

                DB::transaction(function () use ($company, $runDate) {
                    $this->processCompany($company, $runDate);
                }, 5);

                PayrollBatchLog::create([
                    'company_id' => $company->id,
                    'status' => 'success',
                    'processed_at' => Carbon::now('Asia/Tokyo'),
                ]);

                Log::info('Company processed successfully', [
                    'company_id' => $company->id,
                    'company_name' => $company->name,
                ]);

                $successCount++;
            } catch (Throwable $e) {
                Log::error('Payroll processing failed for company', [
                    'company_id' => $company->id,
                    'company_name' => $company->name,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                PayrollBatchLog::create([
                    'company_id' => $company->id,
                    'status' => 'error',
                    'error_message' => $e->getMessage(),
                    'processed_at' => Carbon::now('Asia/Tokyo'),
                ]);

                $this->notifyAdmin($company, $e, false);
                $errorCount++;
            }
        }

        Log::info('Payroll batch process completed', [
            'total_companies' => $companies->count(),
            'success_count' => $successCount,
            'error_count' => $errorCount,
        ]);
    }

    /**
     * Retrieve companies that should be processed.
     */
    private function getTargetCompanies(Carbon $runDate): Collection
    {
        $closingDateTargets = [15, 20, 25, 30];

        return Company::query()
            ->whereIn('closing_date', $closingDateTargets)
            ->where('attendance_ready', true)
            ->where('expense_ready', true)
            ->get()
            ->filter(function (Company $company) use ($runDate) {
                // last_closing_date がない場合は処理対象外
                if (!$company->last_closing_date) {
                    return false;
                }

                // last_closing_date の次の月の closing_date を計算
                $nextClosingMonth = $company->last_closing_date->copy()->addMonth();
                $closing = $company->closing_date;
                
                if (in_array($closing, [15, 20, 25])) {
                    $targetDay = min($closing, $nextClosingMonth->daysInMonth);
                    $targetDate = $nextClosingMonth->copy()->day($targetDay)->startOfDay();
                } elseif ($closing === 30) {
                    $targetDate = $nextClosingMonth->copy()->endOfMonth()->startOfDay();
                } else {
                    return false;
                }

                // 実行日が targetDate 以降であれば処理対象
                return $runDate->greaterThanOrEqualTo($targetDate);
            });
    }

    /**
     * Process payroll for a single company (transactional).
     *
     * @throws Throwable
     */
    private function processCompany(Company $company, Carbon $runDate): void
    {
        // last_closing_date の次の月の closing_date を計算
        if (!$company->last_closing_date) {
            throw new \RuntimeException('Company has no last_closing_date.');
        }

        $nextClosingMonth = $company->last_closing_date->copy()->addMonth();
        $closing = $company->closing_date;
        
        if (in_array($closing, [15, 20, 25])) {
            $targetDay = min($closing, $nextClosingMonth->daysInMonth);
            $targetDate = $nextClosingMonth->copy()->day($targetDay)->startOfDay();
        } elseif ($closing === 30) {
            $targetDate = $nextClosingMonth->copy()->endOfMonth()->startOfDay();
        } else {
            throw new \RuntimeException('Invalid closing_date.');
        }

        $periodStart = $company->last_closing_date->copy()->addDay()->startOfDay();
        $periodEnd = $targetDate->copy()->endOfDay();

        Log::info('Processing period calculated', [
            'company_id' => $company->id,
            'period_start' => $periodStart->format('Y-m-d H:i:s'),
            'period_end' => $periodEnd->format('Y-m-d H:i:s'),
            'target_date' => $targetDate->format('Y-m-d'),
        ]);

        $tempDirectory = $this->createTempDirectory($company);
        $financeArchiveFiles = [];
        $userProcessedCount = 0;
        $userSkippedCount = 0;
        $userErrorCount = 0;
        $emailSentCount = 0;
        $emailErrorCount = 0;

        try {
            $totalUsers = User::query()->where('company_id', $company->id)->count();
            Log::info('Users to process', [
                'company_id' => $company->id,
                'total_users' => $totalUsers,
            ]);

            User::query()
                ->where('company_id', $company->id)
                ->with(['hourly_wage_group'])
                ->chunkById(50, function ($users) use (
                    $company,
                    $periodStart,
                    $periodEnd,
                    $tempDirectory,
                    &$financeArchiveFiles,
                    &$userProcessedCount,
                    &$userSkippedCount,
                    &$userErrorCount,
                    &$emailSentCount,
                    &$emailErrorCount
                ) {
                    foreach ($users as $user) {
                        try {
                            Log::debug('Processing user', [
                                'company_id' => $company->id,
                                'user_id' => $user->id,
                                'user_email' => $user->email,
                            ]);

                            $summary = $this->calculateEmployeePayroll($company, $user, $periodStart, $periodEnd);

                            if ($summary['total_work_minutes'] === 0 && $summary['total_expenses'] == 0.0) {
                                Log::debug('User skipped (no work minutes and no expenses)', [
                                    'company_id' => $company->id,
                                    'user_id' => $user->id,
                                ]);
                                $userSkippedCount++;
                                continue;
                            }

                            Log::debug('Generating PDF for user', [
                                'company_id' => $company->id,
                                'user_id' => $user->id,
                            ]);

                            $pdfPath = $this->pdfService->generatePayslip(
                                $company,
                                $user,
                                $periodStart,
                                $periodEnd,
                                $summary,
                                $tempDirectory
                            );

                            Log::info('PDF generated successfully', [
                                'company_id' => $company->id,
                                'user_id' => $user->id,
                                'pdf_path' => $pdfPath,
                            ]);

                            $financeArchiveFiles[] = $pdfPath;

                            Log::debug('Sending email to user', [
                                'company_id' => $company->id,
                                'user_id' => $user->id,
                                'user_email' => $user->email,
                            ]);

                            Mail::to($user->email)->send(
                                new EmployeePayslip($company, $user, $periodStart, $periodEnd, $pdfPath)
                            );

                            Log::info('Email sent successfully', [
                                'company_id' => $company->id,
                                'user_id' => $user->id,
                                'user_email' => $user->email,
                            ]);

                            $userProcessedCount++;
                            $emailSentCount++;
                        } catch (Throwable $e) {
                            Log::error('Payroll processing failed for user', [
                                'company_id' => $company->id,
                                'user_id' => $user->id,
                                'user_email' => $user->email ?? 'N/A',
                                'error' => $e->getMessage(),
                                'trace' => $e->getTraceAsString(),
                            ]);

                            PayrollBatchLog::create([
                                'company_id' => $company->id,
                                'user_id' => $user->id,
                                'status' => 'error',
                                'error_message' => $e->getMessage(),
                                'processed_at' => Carbon::now('Asia/Tokyo'),
                            ]);

                            $userErrorCount++;
                            $emailErrorCount++;

                            // Skip this user and continue with others.
                            continue;
                        }
                    }
                });

            if (!empty($financeArchiveFiles)) {
                Log::info('Creating finance ZIP archive', [
                    'company_id' => $company->id,
                    'file_count' => count($financeArchiveFiles),
                ]);

                $zipPath = $this->createFinanceZip($company, $periodStart, $periodEnd, $tempDirectory, $financeArchiveFiles);

                Log::info('Finance ZIP archive created', [
                    'company_id' => $company->id,
                    'zip_path' => $zipPath,
                ]);

                $financeRecipients = $this->getFinanceRecipients($company);
                Log::info('Finance recipients retrieved', [
                    'company_id' => $company->id,
                    'recipient_count' => $financeRecipients->count(),
                    'recipient_emails' => $financeRecipients->pluck('email')->toArray(),
                ]);

                if ($financeRecipients->isNotEmpty()) {
                    try {
                        Mail::to($financeRecipients->all())->send(
                            new FinancePayslipArchive($company, $periodStart, $periodEnd, $zipPath)
                        );

                        Log::info('Finance archive email sent successfully', [
                            'company_id' => $company->id,
                            'recipient_count' => $financeRecipients->count(),
                        ]);
                    } catch (Throwable $e) {
                        Log::error('Failed to send finance archive email', [
                            'company_id' => $company->id,
                            'error' => $e->getMessage(),
                        ]);
                        throw $e;
                    }
                } else {
                    Log::warning('No finance recipients found', [
                        'company_id' => $company->id,
                    ]);
                }
            } else {
                Log::warning('No PDFs generated, skipping finance archive', [
                    'company_id' => $company->id,
                ]);
            }

            Log::info('Updating submission statuses', [
                'company_id' => $company->id,
                'period_start' => $periodStart->format('Y-m-d'),
                'period_end' => $periodEnd->format('Y-m-d'),
            ]);

            $this->updateSubmissionStatuses($company, $periodStart, $periodEnd);

            Log::info('Updating company status', [
                'company_id' => $company->id,
                'new_last_closing_date' => $targetDate->format('Y-m-d'),
            ]);

            $company->last_closing_date = $targetDate->copy()->startOfDay();
            $company->attendance_ready = false;
            $company->expense_ready = false;
            $company->save();

            Log::info('Company processing completed', [
                'company_id' => $company->id,
                'users_processed' => $userProcessedCount,
                'users_skipped' => $userSkippedCount,
                'users_error' => $userErrorCount,
                'emails_sent' => $emailSentCount,
                'emails_error' => $emailErrorCount,
                'pdfs_generated' => count($financeArchiveFiles),
            ]);
        } finally {
            $this->cleanupTempDirectory($tempDirectory);
            Log::debug('Temporary directory cleaned up', [
                'company_id' => $company->id,
                'temp_directory' => $tempDirectory,
            ]);
        }
    }

    /**
     * Calculate payroll summary for a single employee.
     */
    private function calculateEmployeePayroll(
        Company $company,
        User $user,
        Carbon $periodStart,
        Carbon $periodEnd
    ): array {
        $attendances = Attendance::query()
            ->with('attendanceBreaks')
            ->where('user_id', $user->id)
            ->whereBetween('start_time', [$periodStart, $periodEnd])
            ->get();

        $expenses = ExpensesAndDeduction::query()
            ->where('user_id', $user->id)
            ->where('expense_or_deduction', ExpenseOrDeduction::EXPENSE->value)
            ->whereBetween('date', [$periodStart->toDateString(), $periodEnd->toDateString()])
            ->get();

        $deductions = ExpensesAndDeduction::query()
            ->where('user_id', $user->id)
            ->where('expense_or_deduction', ExpenseOrDeduction::DEDUCTION->value)
            ->whereBetween('date', [$periodStart->toDateString(), $periodEnd->toDateString()])
            ->get();

        $holidays = Holiday::query()
            ->where('company_id', $company->id)
            ->whereBetween('date', [$periodStart->toDateString(), $periodEnd->toDateString()])
            ->pluck('date')
            ->map(fn ($date) => Carbon::parse($date)->startOfDay())
            ->values();

        $summary = [
            'total_work_minutes' => 0,
            'regular_minutes' => 0,
            'overtime_minutes' => 0,
            'night_minutes' => 0,
            'holiday_minutes' => 0,
            'days_worked' => 0,
            'transportation_expenses' => 0.0,
            'other_expenses' => 0.0,
            'total_expenses' => 0.0,
            'total_deductions' => 0.0,
            'basic_pay' => 0.0,
            'overtime_pay' => 0.0,
            'night_pay' => 0.0,
            'holiday_pay' => 0.0,
            'gross_pay' => 0.0,
            'hourly_rate' => 0.0,
            'net_pay' => 0.0,
        ];

        if ($attendances->isEmpty() && $expenses->isEmpty() && $deductions->isEmpty()) {
            return $summary;
        }

        $hourlyRate = optional($user->hourly_wage_group)->hourly_wage ?? 0;
        $summary['hourly_rate'] = $hourlyRate;
        $standardMinutesPerDay = $company->standard_working_hours * 60;
        $nightFrom = $company->night_shift_hours_from ? Carbon::parse($company->night_shift_hours_from) : null;
        $nightTo = $company->night_shift_hours_to ? Carbon::parse($company->night_shift_hours_to) : null;

        foreach ($attendances as $attendance) {
            if (!$attendance->start_time || !$attendance->end_time) {
                continue;
            }

            $start = Carbon::parse($attendance->start_time);
            $end = Carbon::parse($attendance->end_time);
            if ($end->lessThanOrEqualTo($start)) {
                continue;
            }

            $workMinutes = $start->diffInMinutes($end);
            foreach ($attendance->attendanceBreaks as $break) {
                if ($break->start_time && $break->end_time) {
                    $breakStart = Carbon::parse($break->start_time);
                    $breakEnd = Carbon::parse($break->end_time);
                    if ($breakEnd->greaterThan($breakStart)) {
                        $workMinutes -= $breakStart->diffInMinutes($breakEnd);
                    }
                }
            }

            if ($workMinutes <= 0) {
                continue;
            }

            $summary['days_worked']++;
            $summary['total_work_minutes'] += $workMinutes;

            // 勤務全体の休日時間・深夜時間（休憩考慮済）を集計（残業・通常とは独立に重複カウント）
            $attendanceHoliday = $this->calculateHolidayMinutes($start, $end, $holidays, $attendance->attendanceBreaks);
            $attendanceNight = $this->calculateNightMinutes($start, $end, $nightFrom, $nightTo, $attendance->attendanceBreaks);

            // 勤務時間を超えないようにクリップ（重複は許容）
            $summary['holiday_minutes'] += min($attendanceHoliday, $workMinutes);
            $summary['night_minutes'] += min($attendanceNight, $workMinutes);

            // 残業時間を日毎に算出（Regular はループ後に Total - Overtime で決定）
            $perDayOvertime = 0;
            $cursor = $start->copy()->startOfDay();
            $lastDay = $end->copy()->startOfDay();
            while ($cursor->lte($lastDay)) {
                $dayStart = $cursor->isSameDay($start) ? $start->copy() : $cursor->copy()->startOfDay();
                $dayEnd = $cursor->isSameDay($end) ? $end->copy() : $cursor->copy()->endOfDay();

                // その日の総労働（休憩控除後）
                $dayWork = $dayStart->diffInMinutes($dayEnd);
                Log::debug('Payroll per-day base window', [
                    'company_id' => $company->id,
                    'user_id' => $user->id,
                    'day' => $cursor->toDateString(),
                    'day_start' => $dayStart->toDateTimeString(),
                    'day_end' => $dayEnd->toDateTimeString(),
                    'day_work_before_breaks' => $dayWork,
                ]);
                if ($attendance->attendanceBreaks) {
                    foreach ($attendance->attendanceBreaks as $break) {
                        if ($break->start_time && $break->end_time) {
                            $breakStart = Carbon::parse($break->start_time);
                            $breakEnd = Carbon::parse($break->end_time);
                            // 休憩とその日区間の重なり分のみ引く
                            $overlapStart = $dayStart->max($breakStart);
                            $overlapEnd = $dayEnd->min($breakEnd);
                            if ($overlapEnd->greaterThan($overlapStart)) {
                                $dayWork -= $overlapStart->diffInMinutes($overlapEnd);
                            }
                        }
                    }
                }
                if ($dayWork <= 0) {
                    $cursor->addDay();
                    continue;
                }

                // この日の Regular / Overtime を算出（プレミアムカテゴリとは独立）
                $dayRegular = min($dayWork, $standardMinutesPerDay);
                $dayOvertime = max(0, $dayWork - $standardMinutesPerDay);

                Log::debug('Payroll per-day allocation', [
                    'company_id' => $company->id,
                    'user_id' => $user->id,
                    'day' => $cursor->toDateString(),
                    'day_work' => $dayWork,
                    // 休日・深夜は上位で集計済みなのでここは参考情報のみ
                    'day_holiday' => null,
                    'day_night' => null,
                    'day_regular' => $dayRegular,
                    'day_overtime' => $dayOvertime,
                    'standard_minutes_per_day' => $standardMinutesPerDay,
                ]);

                $perDayOvertime += $dayOvertime;

                $cursor->addDay();
            }

            $summary['overtime_minutes'] += $perDayOvertime;
        }

        // Regular は「総労働時間 − 残業時間」で定義し、Regular + Overtime = Total Working を保証
        $summary['regular_minutes'] = max(0, $summary['total_work_minutes'] - $summary['overtime_minutes']);

        $transportation = $expenses->filter(function ($expense) {
            return str_contains(mb_strtolower($expense->name ?? ''), 'transport');
        })->sum('amount');

        $totalExpenses = $expenses->sum('amount');
        $otherExpenses = $totalExpenses - $transportation;

        $summary['transportation_expenses'] = $transportation;
        $summary['other_expenses'] = $otherExpenses;
        $summary['total_expenses'] = $totalExpenses;

        // 控除（DEDUCTION）の集計
        $totalDeductions = $deductions->sum('amount');
        $summary['total_deductions'] = $totalDeductions;

        // Base Pay は総労働時間（1x）、各手当はプレミアム分（倍率 - 1）を加算（重複許容）
        $summary['basic_pay'] = $hourlyRate * ($summary['total_work_minutes'] / 60);
        $summary['overtime_pay'] = $hourlyRate * ($summary['overtime_minutes'] / 60) * max(($company->overtime_pay_multiplier ?? 1.0) - 1.0, 0);
        $summary['night_pay'] = $hourlyRate * ($summary['night_minutes'] / 60) * max(($company->night_shift_pay_multiplier ?? 1.0) - 1.0, 0);
        $summary['holiday_pay'] = $hourlyRate * ($summary['holiday_minutes'] / 60) * max(($company->holiday_pay_multiplier ?? 1.0) - 1.0, 0);

        $gross = $summary['basic_pay']
            + $summary['overtime_pay']
            + $summary['night_pay']
            + $summary['holiday_pay']
            + $summary['total_expenses'];

        // 総支給額は丸めず「そのまま」の値を保持（表示側で小数2桁に整形）
        $summary['gross_pay'] = $gross;

        // 控除を差し引いた実支給額（Net Pay）も丸めず保持
        $net = $gross - $summary['total_deductions'];
        $summary['net_pay'] = $net;

        return $summary;
    }

    private function calculateNightMinutes(
        Carbon $start,
        Carbon $end,
        ?Carbon $nightFrom,
        ?Carbon $nightTo,
        $breaks = null
    ): int {
        if (!$nightFrom || !$nightTo) {
            return 0;
        }

        $totalNightMinutes = 0;
        $currentDate = $start->copy()->startOfDay();
        $endDate = $end->copy()->startOfDay();

        // 勤務が複数日にまたがる場合、各日の深夜時間を計算
        while ($currentDate->lte($endDate)) {
            $dayStart = $currentDate->copy()->setTimeFromTimeString($nightFrom->format('H:i:s'));
            $dayEnd = $currentDate->copy()->setTimeFromTimeString($nightTo->format('H:i:s'));

            // 深夜時間帯が日をまたぐ場合（例：22:00-05:00）
            if ($dayEnd->lessThanOrEqualTo($dayStart)) {
                $dayEnd->addDay();
            }

            // その日の勤務時間範囲を取得
            $shiftStart = $currentDate->isSameDay($start) ? $start->copy() : $currentDate->copy()->startOfDay();
            $shiftEnd = $currentDate->isSameDay($end) ? $end->copy() : $currentDate->copy()->endOfDay();

            // 深夜時間帯と勤務時間の重複部分を計算
            $overlapStart = $shiftStart->max($dayStart);
            $overlapEnd = $shiftEnd->min($dayEnd);

            if ($overlapEnd->greaterThan($overlapStart)) {
                $dayNightMinutes = $overlapStart->diffInMinutes($overlapEnd);

                // 休憩時間を除外
                if ($breaks) {
                    foreach ($breaks as $break) {
                        if ($break->start_time && $break->end_time) {
                            $breakStart = Carbon::parse($break->start_time);
                            $breakEnd = Carbon::parse($break->end_time);

                            // 休憩時間と深夜時間の重複部分を計算
                            $breakOverlapStart = $overlapStart->max($breakStart);
                            $breakOverlapEnd = $overlapEnd->min($breakEnd);

                            if ($breakOverlapEnd->greaterThan($breakOverlapStart)) {
                                $dayNightMinutes -= $breakOverlapStart->diffInMinutes($breakOverlapEnd);
                            }
                        }
                    }
                }

                $totalNightMinutes += max($dayNightMinutes, 0);
            }

            $currentDate->addDay();
        }

        return $totalNightMinutes;
    }

    private function calculateHolidayMinutes(Carbon $start, Carbon $end, Collection $holidays, $breaks = null): int
    {
        $totalHolidayMinutes = 0;
        $currentDate = $start->copy()->startOfDay();
        $endDate = $end->copy()->startOfDay();

        // 勤務が複数日にまたがる場合、各日の休日判定を行う
        while ($currentDate->lte($endDate)) {
            $isHoliday = false;
            
            // カスタム休日をチェック
            foreach ($holidays as $holiday) {
                if ($holiday->equalTo($currentDate)) {
                    $isHoliday = true;
                    break;
                }
            }

            // 週末をチェック
            if (!$isHoliday && !$currentDate->isWeekend()) {
                $currentDate->addDay();
                continue;
            }

            // その日の勤務時間範囲を取得
            $dayStart = $currentDate->isSameDay($start) ? $start->copy() : $currentDate->copy()->startOfDay();
            $dayEnd = $currentDate->isSameDay($end) ? $end->copy() : $currentDate->copy()->endOfDay();

            // その日の休日労働時間を計算
            $dayHolidayMinutes = $dayStart->diffInMinutes($dayEnd);

            // 休憩時間を除外
            if ($breaks) {
                foreach ($breaks as $break) {
                    if ($break->start_time && $break->end_time) {
                        $breakStart = Carbon::parse($break->start_time);
                        $breakEnd = Carbon::parse($break->end_time);
                        
                        if ($breakEnd->greaterThan($breakStart)) {
                            // 休憩時間がその日の勤務時間内にある場合のみ除外
                            $breakOverlapStart = $dayStart->max($breakStart);
                            $breakOverlapEnd = $dayEnd->min($breakEnd);
                            
                            if ($breakOverlapEnd->greaterThan($breakOverlapStart)) {
                                $dayHolidayMinutes -= $breakOverlapStart->diffInMinutes($breakOverlapEnd);
                            }
                        }
                    }
                }
            }

            $totalHolidayMinutes += max($dayHolidayMinutes, 0);
            $currentDate->addDay();
        }

        return $totalHolidayMinutes;
    }

    private function applyRounding(float $amount, ?int $interval): float
    {
        if (!$interval || $interval <= 0) {
            return round($amount, 2);
        }

        return round($amount / $interval) * $interval;
    }

    private function createTempDirectory(Company $company): string
    {
        $path = 'payroll/' . $company->id . '/' . uniqid('batch_', true);
        Storage::disk('local')->makeDirectory($path);
        return storage_path('app/' . $path);
    }

    private function cleanupTempDirectory(string $path): void
    {
        if (!str_contains($path, storage_path('app/payroll'))) {
            return;
        }

        if (is_dir($path)) {
            collect(scandir($path))
                ->reject(fn ($file) => in_array($file, ['.', '..']))
                ->each(function ($file) use ($path) {
                    $filePath = $path . DIRECTORY_SEPARATOR . $file;
                    if (is_file($filePath)) {
                        @unlink($filePath);
                    } elseif (is_dir($filePath)) {
                        $this->cleanupTempDirectory($filePath);
                    }
                });
            @rmdir($path);
        }
    }

    private function createFinanceZip(
        Company $company,
        Carbon $periodStart,
        Carbon $periodEnd,
        string $tempDirectory,
        array $files
    ): string {
        $zipPath = $tempDirectory . DIRECTORY_SEPARATOR . "payslips_{$company->id}.zip";
        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException('Unable to create ZIP archive.');
        }

        foreach ($files as $file) {
            if (file_exists($file)) {
                $zip->addFile($file, basename($file));
            }
        }

        $zip->close();

        return $zipPath;
    }

    private function getFinanceRecipients(Company $company): Collection
    {
        return User::query()
            ->where('company_id', $company->id)
            ->whereHas('user_roles', function ($query) {
                $query->where('role', 2);
            })
            ->pluck('email');
    }

    private function updateSubmissionStatuses(Company $company, Carbon $start, Carbon $end): void
    {
        Attendance::query()
            ->whereHas('user', function ($query) use ($company) {
                $query->where('company_id', $company->id);
            })
            ->whereBetween('start_time', [$start, $end])
            ->update(['submission_status' => SubmissionStatus::CALCULATED->value]);

        ExpensesAndDeduction::query()
            ->whereHas('user', function ($query) use ($company) {
                $query->where('company_id', $company->id);
            })
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->update(['submission_status' => SubmissionStatus::CALCULATED->value]);
    }

    public function notifyFatal(Throwable $exception): void
    {
        $this->notifyAdmin(null, $exception, true);
    }

    private function notifyAdmin(?Company $company, Throwable $exception, bool $fatal = false): void
    {
        $companyName = $company ? $company->name : 'Payroll Batch';

        $subject = $fatal
            ? "[{$companyName}] Payroll Batch Fatal Error"
            : "[{$companyName}] Payroll Batch Failed";

        Mail::raw($exception->getMessage(), function ($message) use ($subject) {
            $message->to('reo00kura@gmail.com')
                ->subject($subject);
        });
    }

    private function calculateTargetDate(Company $company, Carbon $runDate): ?Carbon
    {
        $closing = $company->closing_date;
        $target = $runDate->copy()->startOfMonth();

        if (in_array($closing, [15, 20, 25])) {
            return $target->setDay($closing)->startOfDay();
        }

        if ($closing === 30) {
            return $target->endOfMonth()->startOfDay();
        }

        return null;
    }
}

