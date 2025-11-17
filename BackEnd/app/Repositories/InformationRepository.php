<?php

namespace App\Repositories;

use App\Models\Information;
use App\Models\UserInformation;
use App\Models\User;
use App\Enums\SubmissionType;
use App\Enums\InformationType;
use App\Enums\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class InformationRepository
{
  public function getInformations($user_id, $user_roles, $last_closing_date)
  {
    $currentUser = User::select('id', 'first_name', 'last_name')->find($user_id);
    
    $baseInformations = UserInformation::where('user_id', $user_id)
      ->with('information')
      ->whereHas('information', function ($query) use ($last_closing_date) {
        $query->where('created_at', '>', $last_closing_date)
          ->whereIn('information_type', [
            InformationType::SUBMISSION_REJECTED->value,
            InformationType::SUBMISSION_APPROVED->value
          ]);
      })
      ->get()
      ->pluck('information')
      ->map(function ($information) use ($currentUser) {
        $information->source_user_id = $currentUser->id;
        $information->source_user_first_name = $currentUser->first_name;
        $information->source_user_last_name = $currentUser->last_name;
        $information->source_user_full_name = trim($currentUser->first_name . ' ' . $currentUser->last_name);
        return $information;
      })
      ->unique('id');

    $attendancelInformations = collect();
    if (in_array(Role::ATTENDANCE_MANAGEMENT->value, $user_roles)) {
      $attendancelInformations = Information::where('submission_type', SubmissionType::ATTENDANCE->value)
        ->where('created_at', '>', $last_closing_date)
        ->where('information_type', InformationType::SUBMISSION_SUBMITTED->value)
        ->with('users:id,first_name,last_name')
        ->get()
        ->map(function ($information) {
          $firstUser = $information->users->first();
          if ($firstUser) {
            $information->source_user_id = $firstUser->id;
            $information->source_user_first_name = $firstUser->first_name;
            $information->source_user_last_name = $firstUser->last_name;
            $information->source_user_full_name = trim($firstUser->first_name . ' ' . $firstUser->last_name);
          } else {
            $information->source_user_id = null;
            $information->source_user_first_name = null;
            $information->source_user_last_name = null;
            $information->source_user_full_name = null;
          }
          return $information;
        });
    }

    $expenseInformations = collect();
    if (in_array(Role::FINANCE_MANAGEMENT->value, $user_roles)) {
      $expenseInformations = Information::where('submission_type', SubmissionType::EXPENSE->value)
        ->where('created_at', '>', $last_closing_date)
        ->where('information_type', InformationType::SUBMISSION_SUBMITTED->value)
        ->with('users:id,first_name,last_name')
        ->get()
        ->map(function ($information) {
          $firstUser = $information->users->first();
          if ($firstUser) {
            $information->source_user_id = $firstUser->id;
            $information->source_user_first_name = $firstUser->first_name;
            $information->source_user_last_name = $firstUser->last_name;
            $information->source_user_full_name = trim($firstUser->first_name . ' ' . $firstUser->last_name);
          } else {
            $information->source_user_id = null;
            $information->source_user_first_name = null;
            $information->source_user_last_name = null;
            $information->source_user_full_name = null;
          }
          return $information;
        });
    }

    // 両方の結果をマージして重複除去
    $allInformations = $baseInformations
      ->merge($attendancelInformations)
      ->merge($expenseInformations)
      ->unique('id')
      ->sortByDesc('created_at')
      ->take(50)
      ->values();

    return $allInformations;
  }

  public function createInformation($user_id, $submission_type, $information_type, $comment = null)
  {
    try {
      return DB::transaction(function () use ($user_id, $submission_type, $information_type, $comment) {
        $data = [
          'submission_type' => $submission_type,
          'information_type' => $information_type,
          'comment' => $comment,
        ];

        $information = Information::create($data);

        UserInformation::create([
          'user_id' => $user_id,
          'information_id' => $information->id,
        ]);
      });
    } catch (\Exception $e) {
      Log::error('Failed to create information: ' . $e->getMessage());
      throw $e;
    }
  }

  public function deleteInformations(int $user_id)
  {
    try {
      return DB::transaction(function () use ($user_id) {
        $information_ids = UserInformation::where('user_id', $user_id)
          ->pluck('information_id')
          ->unique();

        Information::whereIn('id', $information_ids)
          ->whereNull('deleted_at')
          ->delete(); // SoftDelete

        UserInformation::where('user_id', $user_id)->delete();
      });
    } catch (\Exception $e) {
      Log::error('Failed to delete informations: ' . $e->getMessage());
      throw $e;
    }
  }
}
