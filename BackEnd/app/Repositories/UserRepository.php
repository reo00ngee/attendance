<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Enums\SubmissionStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserRepository
{
  public function storeUser(array $data, array $roles = [])
  {
    try {
      return DB::transaction(function () use ($data, $roles) {
        $user = User::create($data);

        $user_id = $user->id;
        $current_roles = DB::table('user_role')
          ->where('user_id', $user_id)
          ->pluck('role')
          ->toArray();

        $roles_to_add = array_diff($roles, $current_roles);
        $roles_to_remove = array_diff($current_roles, $roles);

        foreach ($roles_to_add as $role) {
          DB::table('user_role')->insert([
            'user_id' => $user_id,
            'role' => $role,
            'created_at' => now(),
            'updated_at' => now()
          ]);
        }

        if (!empty($roles_to_remove)) {
          DB::table('user_role')
            ->where('user_id', $user_id)
            ->whereIn('role', $roles_to_remove)
            ->delete();
        }

        return $user;
      });
    } catch (\Exception $e) {
      Log::error('Failed to create user: ' . $e->getMessage());
      return null;
    }
  }

  public function updateUser($user_id, array $data, array $roles = [])
  {
    try {
      return DB::transaction(function () use ($user_id, $data, $roles) {
        $user = User::findOrFail($user_id);
        $user->update($data);

        $current_roles = DB::table('user_role')
          ->where('user_id', $user_id)
          ->pluck('role')
          ->toArray();

        $roles_to_add = array_diff($roles, $current_roles);
        $roles_to_remove = array_diff($current_roles, $roles);

        foreach ($roles_to_add as $role) {
          DB::table('user_role')->insert([
            'user_id' => $user_id,
            'role' => $role,
            'updated_at' => now()
          ]);
        }

        if (!empty($roles_to_remove)) {
          DB::table('user_role')
            ->where('user_id', $user_id)
            ->whereIn('role', $roles_to_remove)
            ->delete();
        }

        return $user;
      });
    } catch (\Exception $e) {
      Log::error('Failed to update user: ' . $e->getMessage());
      return null;
    }
  }

  public function getUsersForManagement($company_id)
  {
    $users = User::where('company_id', $company_id)->get();

    foreach ($users as $user) {
      $user->roles = DB::table('user_role')
        ->where('user_id', $user->id)
        ->pluck('role')
        ->toArray();
    }

    return $users;
  }

  public function getUser($user_id)
  {
    $user = User::find($user_id);
    if (!$user) {
      return null;
    }
    $user->roles = DB::table('user_role')
      ->where('user_id', $user->id)
      ->pluck('role')
      ->toArray();
    return $user;
  }

  // get users with their submitted attendances for a specific month
  public function getUsersWithAttendances($company_id, $year, $month)
  {
    return User::where('company_id', $company_id)
      ->with(['attendances' => function ($query) use ($year, $month) {
        $query->whereYear('start_time', $year)
          ->whereMonth('start_time', $month)
          ->where('submission_status', SubmissionStatus::SUBMITTED)
          ->orderBy('start_time', 'desc')
          ->with('attendanceBreaks');
      }])
      ->get();
  }
}
