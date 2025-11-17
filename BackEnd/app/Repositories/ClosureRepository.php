<?php

namespace App\Repositories;

use App\Models\Company;
use App\Models\Attendance;
use App\Models\ExpensesAndDeduction;
use App\Enums\SubmissionStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ClosureRepository
{
    /**
     * Get company by ID
     */
    public function getCompany($company_id)
    {
        return Company::find($company_id);
    }

    /**
     * Get attendances in the closure period that are not submitted
     */
    public function getUnsubmittedAttendances($company_id, Carbon $start, Carbon $end)
    {
        return Attendance::join('users', 'attendance.user_id', '=', 'users.id')
            ->where('users.company_id', $company_id)
            ->whereBetween('attendance.start_time', [$start, $end])
            // Disallow CREATED, SUBMITTED, REJECTED
            ->whereIn('attendance.submission_status', [
                SubmissionStatus::CREATED->value,
                SubmissionStatus::SUBMITTED->value,
                SubmissionStatus::REJECTED->value,
            ])
            ->select('attendance.*', \Illuminate\Support\Facades\DB::raw("CONCAT(users.first_name, ' ', users.last_name) as user_name"))
            ->get();
    }

    /**
     * Get rejected or created attendances in the closure period
     */
    public function getRejectedOrCreatedAttendances($company_id, Carbon $start, Carbon $end)
    {
        return Attendance::join('users', 'attendance.user_id', '=', 'users.id')
            ->where('users.company_id', $company_id)
            ->whereBetween('attendance.start_time', [$start, $end])
            ->whereIn('attendance.submission_status', [
                SubmissionStatus::REJECTED->value,
                SubmissionStatus::CREATED->value,
            ])
            ->select('attendance.*', \Illuminate\Support\Facades\DB::raw("CONCAT(users.first_name, ' ', users.last_name) as user_name"), 'users.id as user_id')
            ->get()
            ->groupBy('user_id')
            ->map(function ($group) {
                $first = $group->first();
                return [
                    'user_id' => $first->user_id,
                    'user_name' => $first->user_name,
                    'rejected_count' => $group->where('submission_status', SubmissionStatus::REJECTED)->count(),
                    'created_count' => $group->where('submission_status', SubmissionStatus::CREATED)->count(),
                ];
            })
            ->values();
    }

    /**
     * Get expenses in the closure period that are not submitted
     */
    public function getUnsubmittedExpenses($company_id, Carbon $start, Carbon $end)
    {
        return ExpensesAndDeduction::join('users', 'expenses_and_deductions.user_id', '=', 'users.id')
            ->where('users.company_id', $company_id)
            ->whereBetween('expenses_and_deductions.date', [$start, $end])
            // Disallow CREATED, SUBMITTED, REJECTED
            ->whereIn('expenses_and_deductions.submission_status', [
                SubmissionStatus::CREATED->value,
                SubmissionStatus::SUBMITTED->value,
                SubmissionStatus::REJECTED->value,
            ])
            ->select('expenses_and_deductions.*', \Illuminate\Support\Facades\DB::raw("CONCAT(users.first_name, ' ', users.last_name) as user_name"))
            ->get();
    }

    /**
     * Get rejected or created expenses in the closure period
     */
    public function getRejectedOrCreatedExpenses($company_id, Carbon $start, Carbon $end)
    {
        return ExpensesAndDeduction::join('users', 'expenses_and_deductions.user_id', '=', 'users.id')
            ->where('users.company_id', $company_id)
            ->whereBetween('expenses_and_deductions.date', [$start, $end])
            ->whereIn('expenses_and_deductions.submission_status', [
                SubmissionStatus::REJECTED->value,
                SubmissionStatus::CREATED->value,
            ])
            ->select('expenses_and_deductions.*', \Illuminate\Support\Facades\DB::raw("CONCAT(users.first_name, ' ', users.last_name) as user_name"), 'users.id as user_id')
            ->get()
            ->groupBy('user_id')
            ->map(function ($group) {
                $first = $group->first();
                return [
                    'user_id' => $first->user_id,
                    'user_name' => $first->user_name,
                    'rejected_count' => $group->where('submission_status', SubmissionStatus::REJECTED)->count(),
                    'created_count' => $group->where('submission_status', SubmissionStatus::CREATED)->count(),
                ];
            })
            ->values();
    }

    /**
     * Update attendance_ready flag
     */
    public function updateAttendanceReady($company_id, $value)
    {
        try {
            return DB::table('companies')
                ->where('id', $company_id)
                ->update(['attendance_ready' => $value]);
        } catch (\Exception $e) {
            Log::error('Error updating attendance_ready: ' . $e->getMessage());
            throw new \Exception('Failed to update attendance_ready');
        }
    }

    /**
     * Update expense_ready flag
     */
    public function updateExpenseReady($company_id, $value)
    {
        try {
            return DB::table('companies')
                ->where('id', $company_id)
                ->update(['expense_ready' => $value]);
        } catch (\Exception $e) {
            Log::error('Error updating expense_ready: ' . $e->getMessage());
            throw new \Exception('Failed to update expense_ready');
        }
    }

    /**
     * Update last_closing_date
     */
    public function updateLastClosingDate($company_id, Carbon $date)
    {
        try {
            return DB::table('companies')
                ->where('id', $company_id)
                ->update(['last_closing_date' => $date->format('Y-m-d')]);
        } catch (\Exception $e) {
            Log::error('Error updating last_closing_date: ' . $e->getMessage());
            throw new \Exception('Failed to update last_closing_date');
        }
    }
}



