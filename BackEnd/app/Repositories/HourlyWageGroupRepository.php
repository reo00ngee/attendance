<?php

namespace App\Repositories;

use App\Models\HourlyWageGroup;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class HourlyWageGroupRepository
{
  public function getHourlyWageGroupsByCompanyId($company_id)
  {
    return HourlyWageGroup::where('company_id', $company_id)->get();
  }

  public function getHourlyWageGroup($hourly_wage_group_id)
  {
    return HourlyWageGroup::find($hourly_wage_group_id);
  }

  public function storeHourlyWageGroup(array $data)
  {
    try {
      return DB::transaction(function () use ($data) {
        return HourlyWageGroup::create($data);
      });
    } catch (\Exception $e) {
      Log::error('Failed to create hourly wage group: ' . $e->getMessage());
      return null;
    }
  }

  public function updateHourlyWageGroup($hourly_wage_group_id, array $data)
  {
    try {
      return DB::transaction(function () use ($hourly_wage_group_id, $data) {
        $hourly_wage_group = HourlyWageGroup::findOrFail($hourly_wage_group_id);
        $hourly_wage_group->update($data);
        return $hourly_wage_group;
      });
    } catch (\Exception $e) {
      Log::error('Failed to update hourly wage group: ' . $e->getMessage());
      return null;
    }
  }
}
