<?php

namespace App\Services;

use App\Repositories\ClosureRepository;
use App\Traits\PeriodCalculatorTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ClosureService
{
    use PeriodCalculatorTrait;

    private ClosureRepository $closureRepository;

    public function __construct(ClosureRepository $closureRepository)
    {
        $this->closureRepository = $closureRepository;
    }

    /**
     * Check if attendance closure can be performed
     * Returns validation result with users list if there are issues
     */
    public function checkAttendanceClosure($company_id)
    {
        $company = $this->closureRepository->getCompany($company_id);
        
        if (!$company) {
            return ['success' => false, 'error' => 'Company not found'];
        }

        [$start, $end] = $this->getClosurePeriodRange($company->last_closing_date, $company->closing_date);

        // Strict: allow closure only when ALL attendances in period are APPROVED
        $nonApproved = $this->closureRepository->getUnsubmittedAttendances($company_id, $start, $end);
        if ($nonApproved->isNotEmpty()) {
            return [
                'success' => false,
                'error' => 'There are attendances not approved in the closure period',
                'data' => $nonApproved
            ];
        }

        return [
            'success' => true,
            'start' => $start->toDateString(),
            'end' => $end->toDateString()
        ];
    }

    /**
     * Perform attendance closure
     */
    public function performAttendanceClosure($company_id, bool $force = false)
    {
        try {
            $company = $this->closureRepository->getCompany($company_id);
            
            if (!$company) {
                return ['success' => false, 'error' => 'Company not found'];
            }

            [$start, $end] = $this->getClosurePeriodRange($company->last_closing_date, $company->closing_date);

            // Guard: already ready
            if ($company->attendance_ready) {
                return ['success' => false, 'error' => 'Attendance closure already prepared'];
            }

            // Re-validate strictly; do not allow force to bypass
            $check = $this->checkAttendanceClosure($company_id);
            if (!$check['success']) {
                return $check;
            }

            DB::transaction(function () use ($company_id) {
                $this->closureRepository->updateAttendanceReady($company_id, true);
            });

            return [
                'success' => true,
                'message' => 'Attendance closure completed successfully',
                'attendance_ready' => true,
            ];
        } catch (\Exception $e) {
            Log::error('Attendance closure failed: ' . $e->getMessage());
            return ['success' => false, 'error' => 'Failed to perform attendance closure'];
        }
    }

    /**
     * Check if expense closure can be performed
     * Returns validation result with users list if there are issues
     */
    public function checkExpenseClosure($company_id)
    {
        $company = $this->closureRepository->getCompany($company_id);
        
        if (!$company) {
            return ['success' => false, 'error' => 'Company not found'];
        }

        [$start, $end] = $this->getClosurePeriodRange($company->last_closing_date, $company->closing_date);

        // Strict: allow closure only when ALL expenses in period are APPROVED
        $nonApproved = $this->closureRepository->getUnsubmittedExpenses($company_id, $start, $end);
        if ($nonApproved->isNotEmpty()) {
            return [
                'success' => false,
                'error' => 'There are expenses not approved in the closure period',
                'data' => $nonApproved
            ];
        }

        return [
            'success' => true,
            'start' => $start->toDateString(),
            'end' => $end->toDateString()
        ];
    }

    /**
     * Perform expense closure
     */
    public function performExpenseClosure($company_id, bool $force = false)
    {
        try {
            $company = $this->closureRepository->getCompany($company_id);
            
            if (!$company) {
                return ['success' => false, 'error' => 'Company not found'];
            }

            [$start, $end] = $this->getClosurePeriodRange($company->last_closing_date, $company->closing_date);

            // Guard: already ready
            if ($company->expense_ready) {
                return ['success' => false, 'error' => 'Expense closure already prepared'];
            }

            // Re-validate strictly; do not allow force to bypass
            $check = $this->checkExpenseClosure($company_id);
            if (!$check['success']) {
                return $check;
            }

            DB::transaction(function () use ($company_id) {
                $this->closureRepository->updateExpenseReady($company_id, true);
            });

            return [
                'success' => true,
                'message' => 'Expense closure completed successfully',
                'expense_ready' => true,
            ];
        } catch (\Exception $e) {
            Log::error('Expense closure failed: ' . $e->getMessage());
            return ['success' => false, 'error' => 'Failed to perform expense closure'];
        }
    }

    /**
     * Check if date is within valid range for registration
     */
    public function isValidDateForRegistration($company_id, Carbon $date, $type = 'attendance')
    {
        $company = $this->closureRepository->getCompany($company_id);
        
        if (!$company) {
            return false;
        }

        // Check if date is before last_closing_date
        if ($date->lt($company->last_closing_date)) {
            return false;
        }

        // If closure is ready, check if date is within 1 month from last_closing_date
        $isReady = $type === 'attendance' ? $company->attendance_ready : $company->expense_ready;
        
        if ($isReady) {
            $oneMonthLater = $company->last_closing_date->copy()->addMonth();
            if ($date->gt($oneMonthLater)) {
                return false;
            }
        }

        return true;
    }
}



