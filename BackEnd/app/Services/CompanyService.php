<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\CompanyRepository;
use App\Traits\FetchCompanyDataTrait;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanyService
{
  use FetchCompanyDataTrait;
  private CompanyRepository $companyRepository;
  public function __construct(CompanyRepository $companyRepository)
  {
    $this->companyRepository = $companyRepository;
  }

  public function getSetting(int $company_id)
  {
    try {
      $company = $this->companyRepository->getSetting($company_id);
      if (!$company) {
        return response()->json(['error' => 'Company settings not found'], 404);
      }
      return response()->json([
        'company_id' => $company->id,
        'name' => $company->name,
        'address' => $company->address,
        'phone_number' => $company->phone_number,
        'email' => $company->email,
        'currency' => $company->currency,
        'closing_date' => $company->closing_date,
        'last_closing_date' => $company->last_closing_date,
        'payroll_rounding_interval' => $company->payroll_rounding_interval,
        'prompt_submission_reminder_days' => $company->prompt_submission_reminder_days,
        'standard_working_hours' => $company->standard_working_hours,
        'overtime_pay_multiplier' => $company->overtime_pay_multiplier,
        'night_shift_hours_from' => $company->night_shift_hours_from,
        'night_shift_hours_to' => $company->night_shift_hours_to,
        'night_shift_pay_multiplier' => $company->night_shift_pay_multiplier,
        'holiday_pay_multiplier' => $company->holiday_pay_multiplier,
        'attendance_ready' => $company->attendance_ready,
        'expense_ready' => $company->expense_ready,
      ]);
    } catch (\Exception $e) {
      Log::error('Error fetching company settings: ' . $e->getMessage());
      return response()->json(['error' => 'Failed to fetch company settings'], 500);
    }
  }

  public function updateSetting(int $company_id, array $data)
  {
    try {
      // 更新処理
      $this->companyRepository->updateSetting($company_id, $data);
      return $this->getSetting($company_id);
    } catch (\Exception $e) {
      Log::error('Error updating company settings: ' . $e->getMessage());
      return response()->json(['error' => 'Failed to update company settings'], 500);
    }
  }
}
