<?php

namespace App\Console\Commands;

use App\Services\PayrollService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessMonthlyPayroll extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'payroll:process';

    /**
     * The console command description.
     */
    protected $description = 'Process monthly payroll for eligible companies';

    private PayrollService $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        parent::__construct();
        $this->payrollService = $payrollService;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $runDate = Carbon::now('Asia/Tokyo');

        Log::info('Payroll batch command started', [
            'run_date' => $runDate->format('Y-m-d H:i:s'),
            'timezone' => 'Asia/Tokyo',
        ]);

        try {
            $this->info(sprintf('Starting payroll batch at %s', $runDate->toDateTimeString()));

            $this->payrollService->process($runDate);

            $this->info('Payroll batch completed successfully.');
            Log::info('Payroll batch command completed successfully');

            return Command::SUCCESS;
        } catch (Throwable $e) {
            Log::critical('Fatal error occurred during payroll batch', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            $this->payrollService->notifyFatal($e);
            $this->error('Payroll batch terminated due to a fatal error.');

            return Command::FAILURE;
        }
    }
}


