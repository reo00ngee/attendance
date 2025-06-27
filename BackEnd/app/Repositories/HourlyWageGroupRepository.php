<?php

namespace App\Repositories;

use App\Models\HourlyWageGroup;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class HourlyWageGroupRepository
{
  public function getHourlyWageGroupByCompanyId($company_id)
  {
    return HourlyWageGroup::where('company_id', $company_id)->get();
  }
}
