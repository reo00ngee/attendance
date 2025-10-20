<?php

namespace App\Services;

use App\Models\User;
use App\Models\Company;
use App\Models\HourlyWageGroup;
use App\Models\UserRole;
use App\Repositories\CompanyRepository;
use App\Traits\FetchCompanyDataTrait;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Enums\Currency;
use App\Enums\PayrollRoundingInterval;
use App\Enums\PromptSubmissionReminderDays;
use App\Enums\ClosingDate;
use App\Enums\StandardWorkingHours;
use App\Enums\OvertimePayMultiplier;
use App\Enums\NightShiftHoursFrom;
use App\Enums\NightShiftHoursTo;
use App\Enums\NightShiftPayMultiplier;
use App\Enums\HolidayPayMultiplier;
use App\Enums\Gender;



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

  public function createCompany(array $data)
  {
    try {
      DB::beginTransaction();

      // 会社データの準備
      $companyData = [
        'name' => $data['name'],
        'address' => $data['address'],
        'phone_number' => $data['phone_number'],
        'email' => $data['email'],
        'currency' => $data['currency'] ?? Currency::USD->value,
        'closing_date' => $data['closing_date'] ?? ClosingDate::FIFTEENTH->value,
        'payroll_rounding_interval' => $data['payroll_rounding_interval'] ?? PayrollRoundingInterval::ONE_MINUTE->value,
        'prompt_submission_reminder_days' => $data['prompt_submission_reminder_days'] ?? PromptSubmissionReminderDays::THREE_DAYS->value,
        'standard_working_hours' => $data['standard_working_hours'] ?? 8,
        'overtime_pay_multiplier' => $data['overtime_pay_multiplier'] ?? null,
        'night_shift_hours_from' => $data['night_shift_hours_from'] ?? null,
        'night_shift_hours_to' => $data['night_shift_hours_to'] ?? null,
        'night_shift_pay_multiplier' => $data['night_shift_pay_multiplier'] ?? null,
        'holiday_pay_multiplier' => $data['holiday_pay_multiplier'] ?? null,
        'created_by' => Auth::id() ?? null,
      ];

      // 会社を作成
      $company = Company::create($companyData);

      // デフォルトのhourlyWageGroupを作成
      $hourlyWageGroup = HourlyWageGroup::create([
        'company_id' => $company->id,
        'name' => 'test',
        'hourly_wage' => 0,
      ]);

      // 初期ユーザーを作成
      $user = User::create([
        'email' => $data['user_email'],
        'password' => $data['user_password'],
        'company_id' => $company->id,
        'first_name' => $data['user_first_name'] ?? '',
        'last_name' => $data['user_last_name'] ?? '',
        'phone_number' => $data['user_phone'] ?? '',
        'gender' => $data['user_gender'] ?? Gender::MALE->value,
        'birth_date' => $data['user_birth_date'] ?? null,
        'address' => $data['user_address'] ?? '',
        'hire_date' => $data['user_hire_date'] ?? now()->format('Y-m-d'),
        'retire_date' => $data['user_retire_date'] ?? null,
        'hourly_wage_group_id' => $hourlyWageGroup->id,
      ]);

      // ユーザーにattendance and expense registration以外の全ロールを付与
      $rolesToAssign = [1, 2, 3, 4, 5]; // 全ロールを付与（attendance and expense registration以外）
      foreach ($rolesToAssign as $roleId) {
        UserRole::create([
          'user_id' => $user->id,
          'role' => $roleId,
          'created_by' => Auth::id(),
        ]);
      }

      DB::commit();

      return response()->json([
        'message' => 'Company and initial user created successfully',
        'company_id' => $company->id,
        'user_id' => $user->id
      ], 201);

    } catch (\Exception $e) {
      DB::rollBack();
      Log::error('Error creating company: ' . $e->getMessage());
      return response()->json(['error' => 'Failed to create company'], 500);
    }
  }

  public function getAllCompanies()
  {
    try {
      $companies = Company::select([
        'id',
        'name',
        'address',
        'phone_number',
        'email',
        'currency',
        'created_at',
        'updated_at'
      ])->get();

      return response()->json($companies);
    } catch (\Exception $e) {
      Log::error('Error fetching companies: ' . $e->getMessage());
      return response()->json(['error' => 'Failed to fetch companies'], 500);
    }
  }
}
