<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\Company;

class PayrollProcessingJob extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:payroll-processing-job';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process to calculate salary once a month';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        // 会社の設定値を取得
        $companies = Company::where('attendance_ready', true)
            ->where('expense_ready', true)
            ->get();
        foreach ($companies as $company) {
            // 締め日を取得
            if (Carbon::now()->day($company->closing_date)->isFuture()) {
                $startDate = Carbon::now()->day($company->closing_date)->subMonths(2)->addDay()->format('Y-m-d');
                $endDate = Carbon::now()->day($company->closing_date)->subMonth()->format('Y-m-d');
            } else {
                $startDate = Carbon::now()->day($company->closing_date)->addDay()->format('Y-m-d');
                $endDate = Carbon::now()->day($company->closing_date)->format('Y-m-d');
            }
        }
            // 勤怠データを取得
    $attendances = Attendance::whereBetween('date', [$startDate, $endDate])->get();

    // 経費データを取得
    $expenses = Expense::whereBetween('date', [$startDate, $endDate])->get();

    // 給与計算ロジック
    // ...

    // 結果を返すまたは保存する
    // ...
    }


}
