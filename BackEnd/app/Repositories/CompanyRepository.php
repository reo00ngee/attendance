<?php

namespace App\Repositories;

use App\Models\Company;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CompanyRepository
{
  public function getCompany($company_id)
  {
    return Company::where('id', $company_id)
      ->first();
  }

  public function getSetting($company_id)
  {
    try {
      return DB::table('companies')
        ->where('id', $company_id)
        ->first();
    } catch (\Exception $e) {
      Log::error('Error fetching company settings: ' . $e->getMessage());
      throw new \Exception('Failed to fetch company settings');
    }
  }

  public function updateSetting($company_id, array $data)
  {
    try {
      DB::table('companies')
        ->where('id', $company_id)
        ->update($data);
    } catch (\Exception $e) {
      Log::error('Error updating company settings: ' . $e->getMessage());
      throw new \Exception('Failed to update company settings');
    }
  }

  public function createCompany(array $data)
  {
    try {
      return Company::create($data);
    } catch (\Exception $e) {
      Log::error('Error creating company: ' . $e->getMessage());
      throw new \Exception('Failed to create company');
    }
  }
}
