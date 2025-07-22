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

  public function getHourlyWageGroupsByCompanyId(User $user)
  {
    $company_id = $user->company_id;

    $hourly_wage_groups = $this->hourlyWageGroupRepository->getHourlyWageGroupsByCompanyId($company_id);
    return $hourly_wage_groups->map(function ($hourly_wage_group) {
      return [
        'hourly_wage_group_id' => $hourly_wage_group->id,
        'name' => $hourly_wage_group->name,
        'hourly_wage' => $hourly_wage_group->hourly_wage,
        'comment' => $hourly_wage_group->comment,
      ];
    });
  }

  public function getHourlyWageGroup($hourly_wage_group_id)
  {
    $hourly_wage_group = $this->hourlyWageGroupRepository->getHourlyWageGroup($hourly_wage_group_id);
    if (!$hourly_wage_group) {
      return response()->json(['error' => 'Hourly wage group not found'], 404);
    }
    return response()->json([
      'hourly_wage_group_id' => $hourly_wage_group->id,
      'name' => $hourly_wage_group->name,
      'hourly_wage' => $hourly_wage_group->hourly_wage,
      'comment' => $hourly_wage_group->comment,
    ]);
  }


  public function storeHourlyWageGroup(User $user, $validated)
  {
    $data = [
      'company_id' => $user->company_id,
      'name' => $validated['name'],
      'hourly_wage' => $validated['hourly_wage'],
      'comment' => $validated['comment'] ?? null,
    ];
    $hourly_wage_group = $this->hourlyWageGroupRepository->storeHourlyWageGroup($data);
    if ($hourly_wage_group) {
      return response()->json(['message' => 'Hourly wage group created successfully'], 201);
    } else {
      return response()->json(['error' => 'Failed to create hourly wage group'], 500);
    }
  }

  public function updateHourlyWageGroup($validated)
  {
    $hourly_wage_group_id = $validated['hourly_wage_group_id'];
    $data = [
      'name' => $validated['name'],
      'hourly_wage' => $validated['hourly_wage'],
      'comment' => $validated['comment'] ?? null,
    ];

    $hourly_wage_group = $this->hourlyWageGroupRepository->updateHourlyWageGroup($hourly_wage_group_id, $data);
    if ($hourly_wage_group) {
      return response()->json(['message' => 'Hourly wage group updated successfully'], 200);
    } else {
      return response()->json(['error' => 'Failed to update hourly wage group'], 500);
    }
  }
}
