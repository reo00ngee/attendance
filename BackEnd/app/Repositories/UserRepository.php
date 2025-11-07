<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Enums\SubmissionStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UserRepository
{
  public function findByEmail(string $email)
  {
    try {
      return User::where('email', $email)->first();
    } catch (\Exception $e) {
      Log::error('Failed to find user by email: ' . $e->getMessage());
      return null;
    }
  }

  public function updatePassword(string $email, string $password): bool
  {
    try {
      $user = User::where('email', $email)->first();
      if (!$user) {
        return false;
      }

      // モデルのmutatorを使用してパスワードをハッシュ化
      $user->password = $password;
      $user->save();
      
      return true;
    } catch (\Exception $e) {
      Log::error('Failed to update password: ' . $e->getMessage());
      return false;
    }
  }

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
        
        // パスワードが空の場合は配列から削除
        if (isset($data['password']) && empty($data['password'])) {
          unset($data['password']);
        }
        
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
  public function getUsersWithAttendances($company_id, $start, $end)
  {
    return User::where('company_id', $company_id)
      ->with(['attendances' => function ($query) use ($start, $end) {
        $query->whereBetween('start_time', [$start, $end])
          ->where('submission_status', SubmissionStatus::SUBMITTED->value)
          ->orderBy('start_time', 'desc')
          ->with('attendanceBreaks');
      }])
      ->get();
  }

  public function getUsersWithExpensesAndDeductions($company_id, $start, $end)
  {
    return User::where('company_id', $company_id)
      ->with(['expenses_and_deductions' => function ($query) use ($start, $end) {
        $query->whereBetween('date', [$start, $end])
          ->orderBy('date', 'desc');
      }])
      ->get();
  }
}
