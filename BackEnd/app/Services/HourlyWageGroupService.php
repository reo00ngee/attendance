<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\HourlyWageGroupRepository;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HourlyWageGroupService
{
  private HourlyWageGroupRepository $hourlyWageGroupRepository;
  public function __construct(HourlyWageGroupRepository $hourlyWageGroupRepository)
  {
    $this->hourlyWageGroupRepository = $hourlyWageGroupRepository;
  }

  public function getHourlyWageGroupByCompanyId(User $user){
        $company_id = $user->company_id;

    $hourly_wage_groups = $this->hourlyWageGroupRepository->getHourlyWageGroupByCompanyId($company_id);
    return $hourly_wage_groups->map(function ($hourly_wage_group) {
      return [
        'hourly_wage_group_id' => $hourly_wage_group->id,
        'name' => $hourly_wage_group->name,
        'hourly_wage' => $hourly_wage_group->hourly_wage,
      ];
    });

  }
}


