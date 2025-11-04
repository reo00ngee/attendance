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

        // Check for unsubmitted attendances
        $unsubmitted = $this->closureRepository->getUnsubmittedAttendances($company_id, $start, $end);
        
        if ($unsubmitted->isNotEmpty()) {
            return [
                'success' => false,
                'error' => 'There are unsubmitted attendances in the closure period',
                'data' => $unsubmitted
            ];
        }

        // Check for rejected or created attendances (require confirmation)
        $rejected_or_created = $this->closureRepository->getRejectedOrCreatedAttendances($company_id, $start, $end);
        
        if ($rejected_or_created->isNotEmpty()) {
            return [
                'success' => false,
                'requires_confirmation' => true,
                'message' => 'There are rejected or created attendances in the closure period',
                'users' => $rejected_or_created
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

            // Re-validate using the same logic as check endpoint
            $check = $this->checkAttendanceClosure($company_id);
            if (!$check['success']) {
                // allow proceed only if it requires confirmation and force=true
                if (!empty($check['requires_confirmation']) && $check['requires_confirmation'] === true && $force === true) {
                    // continue
                } else {
                    return $check;
                }
            }

            DB::transaction(function () use ($company_id, $end) {
                $this->closureRepository->updateLastClosingDate($company_id, $end);
                $this->closureRepository->updateAttendanceReady($company_id, true);
            });

            return [
                'success' => true,
                'message' => 'Attendance closure completed successfully',
                'attendance_ready' => true,
                'last_closing_date' => $end->toDateString(),
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

        // Check for unsubmitted expenses
        $unsubmitted = $this->closureRepository->getUnsubmittedExpenses($company_id, $start, $end);
        
        if ($unsubmitted->isNotEmpty()) {
            return [
                'success' => false,
                'error' => 'There are unsubmitted expenses in the closure period',
                'data' => $unsubmitted
            ];
        }

        // Check for rejected or created expenses (require confirmation)
        $rejected_or_created = $this->closureRepository->getRejectedOrCreatedExpenses($company_id, $start, $end);
        
        if ($rejected_or_created->isNotEmpty()) {
            return [
                'success' => false,
                'requires_confirmation' => true,
                'message' => 'There are rejected or created expenses in the closure period',
                'users' => $rejected_or_created
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

            // Re-validate using the same logic as check endpoint
            $check = $this->checkExpenseClosure($company_id);
            if (!$check['success']) {
                // allow proceed only if it requires confirmation and force=true
                if (!empty($check['requires_confirmation']) && $check['requires_confirmation'] === true && $force === true) {
                    // continue
                } else {
                    return $check;
                }
            }

            DB::transaction(function () use ($company_id, $end) {
                $this->closureRepository->updateLastClosingDate($company_id, $end);
                $this->closureRepository->updateExpenseReady($company_id, true);
            });

            return [
                'success' => true,
                'message' => 'Expense closure completed successfully',
                'expense_ready' => true,
                'last_closing_date' => $end->toDateString(),
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



