<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #333; }
        h1, h2, h3 { margin: 0 0 8px 0; }
        .section { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        .text-right { text-align: right; }
        .summary-table td { border: none; }
        .summary-table tr td:first-child { font-weight: bold; }
    </style>
</head>
<body>
    <?php
        // 通貨シンボルの決定（App\Enums\Currency による）
        $currency = '';
        try {
            if (!is_null($company->currency)) {
                $currencyEnum = \App\Enums\Currency::from((int)$company->currency);
                $currency = $currencyEnum->symbol();
            }
        } catch (\Throwable $e) {
            $currency = '';
        }

        // 分 → 「Xh Ym」形式に整形するヘルパ
        $formatMinutes = function ($minutes) {
            $minutes = (int) $minutes;
            $hours = intdiv($minutes, 60);
            $mins = $minutes % 60;
            return sprintf('%dh %02dm', $hours, $mins);
        };
    ?>
    <div class="section">
        <h1>Payroll Statement</h1>
        <table class="summary-table">
            <tr>
                <td>Company</td>
                <td>{{ $company->name }}</td>
            </tr>
            <tr>
                <td>Address</td>
                <td>{{ $company->address }}</td>
            </tr>
            <tr>
                <td>Phone</td>
                <td>{{ $company->phone_number }}</td>
            </tr>
            <tr>
                <td>Employee</td>
                <td>{{ $user->first_name }} {{ $user->last_name }} (ID: {{ $user->id }})</td>
            </tr>
            <tr>
                <td>Period</td>
                <td>{{ $periodStart->format('Y/m/d') }} - {{ $periodEnd->format('Y/m/d') }}</td>
            </tr>
            <tr>
                <td>Hourly Wage</td>
                <td>{{ number_format($summary['hourly_rate'], 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Attendance Summary</h2>
        <table>
            <tr>
                <th>Total Working Days</th>
                <td>{{ $summary['days_worked'] }}</td>
            </tr>
            <tr>
                <th>Regular Hours</th>
                <td>{{ $formatMinutes($summary['regular_minutes']) }}</td>
            </tr>
            <tr>
                <th>Total Working Hours</th>
                <td>{{ $formatMinutes($summary['total_work_minutes']) }}</td>
            </tr>
            <tr>
                <th>Overtime Hours</th>
                <td>{{ $formatMinutes($summary['overtime_minutes']) }}</td>
            </tr>
            <tr>
                <th>Night Shift Hours</th>
                <td>{{ $formatMinutes($summary['night_minutes']) }}</td>
            </tr>
            <tr>
                <th>Holiday Hours</th>
                <td>{{ $formatMinutes($summary['holiday_minutes']) }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Salary Details</h2>
        <table>
            <tr>
                <th>Description</th>
                <th class="text-right">Amount</th>
            </tr>
            <tr>
                <td>Base Pay</td>
                <td class="text-right">{{ $currency }} {{ number_format($summary['basic_pay'], 2) }}</td>
            </tr>
            <tr>
                <td>Overtime Pay</td>
                <td class="text-right">{{ $currency }} {{ number_format($summary['overtime_pay'], 2) }}</td>
            </tr>
            <tr>
                <td>Night Shift Pay</td>
                <td class="text-right">{{ $currency }} {{ number_format($summary['night_pay'], 2) }}</td>
            </tr>
            <tr>
                <td>Holiday Pay</td>
                <td class="text-right">{{ $currency }} {{ number_format($summary['holiday_pay'], 2) }}</td>
            </tr>
            <tr>
                <td><strong>Salary Subtotal</strong></td>
                <td class="text-right"><strong>{{ $currency }} {{ number_format($summary['basic_pay'] + $summary['overtime_pay'] + $summary['night_pay'] + $summary['holiday_pay'], 2) }}</strong></td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Expense Reimbursements</h2>
        <table>
            <tr>
                <th>Description</th>
                <th class="text-right">Amount</th>
            </tr>
            <tr>
                <td>Transportation</td>
                <td class="text-right">{{ $currency }} {{ number_format($summary['transportation_expenses'], 2) }}</td>
            </tr>
            <tr>
                <td>Other Expenses</td>
                <td class="text-right">{{ $currency }} {{ number_format($summary['other_expenses'], 2) }}</td>
            </tr>
            <tr>
                <td><strong>Total Expenses</strong></td>
                <td class="text-right"><strong>{{ $currency }} {{ number_format($summary['total_expenses'], 2) }}</strong></td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Deductions</h2>
        <table>
            <tr>
                <th>Description</th>
                <th class="text-right">Amount</th>
            </tr>
            <tr>
                <td>Total Deductions</td>
                <td class="text-right">{{ $currency }} {{ number_format($summary['total_deductions'], 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Total Compensation</h2>
        <table>
            <tr>
                <th>Gross Pay (Before Deductions)</th>
                <th class="text-right">{{ $currency }} {{ number_format($summary['gross_pay'], 2) }}</th>
            </tr>
            <tr>
                <th>Net Pay</th>
                <th class="text-right">{{ $currency }} {{ number_format($summary['net_pay'], 2) }}</th>
            </tr>
        </table>
    </div>
</body>
</html>


