<?php

namespace App\Services;

use App\Repositories\UserRepository;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserService
{
  private UserRepository $userRepository;
  public function __construct(UserRepository $userRepository)
  {
    $this->userRepository = $userRepository;
  }

public function getUserForLogin($user)
  {
    if (!$user) {
      return response()->json(['error' => 'User not authenticated'], 401);
    }
    $userData = response()->json([
      'user_id' => $user->id,
      'first_name' => $user->first_name,
      'last_name' => $user->last_name,
      'email' => $user->email,
      'phone_number' => $user->phone_number,
      'gender' => $user->gender,
      'birth_date' => $user->birth_date,
      'address' => $user->address,
      'hire_date' => $user->hire_date,
      'retire_date' => $user->retire_date,
      'hourly_wage_group_id' => $user->hourly_wage_group_id,
      'roles' => $user->roles,
    ]);
    return $userData;
  }

  public function storeUser($user, $validated)
  {
    $data = [
      'company_id' => $user->company_id,
      'first_name' => $validated['first_name'],
      'last_name' => $validated['last_name'],
      'email' => $validated['email'],
      'password' => bcrypt($validated['password']),
      'phone_number' => $validated['phone_number'] ?? null,
      'gender' => $validated['gender'] ?? null,
      'birth_date' => $validated['birth_date'] ?? null,
      'address' => $validated['address'] ?? null,
      'hire_date' => $validated['hire_date'] ?? null,
      'retire_date' => $validated['retire_date'] ?? null,
      'hourly_wage_group_id' => $validated['hourly_wage_group_id'],
    ];
    $user = $this->userRepository->storeUser($data, $validated['roles']);
    if ($user) {
      return response()->json(['message' => 'User created successfully'], 201);
    } else {
      return response()->json(['error' => 'Failed to create user'], 500);
    }
  }

  public function updateUser($validated)
  {
    $user_id = $validated['user_id'];
    $data = [
      'first_name' => $validated['first_name'],
      'last_name' => $validated['last_name'],
      'email' => $validated['email'],
      'password' => bcrypt($validated['password']),
      'phone_number' => $validated['phone_number'] ?? null,
      'gender' => $validated['gender'] ?? null,
      'birth_date' => $validated['birth_date'] ?? null,
      'address' => $validated['address'] ?? null,
      'hire_date' => $validated['hire_date'] ?? null,
      'retire_date' => $validated['retire_date'] ?? null,
      'hourly_wage_group_id' => $validated['hourly_wage_group_id'],
    ]; 
    $user = $this->userRepository->updateUser($user_id, $data, $validated['roles']);
    if ($user) {
      return response()->json(['message' => 'User updated successfully'], 200);
    } else {
      return response()->json(['error' => 'Failed to update user'], 500);
    }
  }

  public function getUsersForManagement($user)
  {
    $company_id = $user->company_id;
    if (!$company_id) {
      return response()->json(['error' => 'Company ID not found'], 400);
    }
    $users = $this->userRepository->getUsersForManagement($company_id);
    if ($users->isEmpty()) {
      return response()->json(['message' => 'No users found'], 404);
    }
    return response()->json($users->map(function ($user) {
      return [
        'user_id' => $user->id,
        'first_name' => $user->first_name,
        'last_name' => $user->last_name,
        'email' => $user->email,
        'phone_number' => $user->phone_number,
        'gender' => $user->gender,
        'birth_date' => $user->birth_date,
        'address' => $user->address,
        'hire_date' => $user->hire_date,
        'retire_date' => $user->retire_date,
        'hourly_wage_group_id' => $user->hourly_wage_group_id,
        'roles' => $user->roles
      ];
    }));
  }

  public function getUser($user_id)
  {
    $user = $this->userRepository->getUser($user_id);
    if (!$user) {
      return response()->json(['error' => 'User not found'], 404);
    }
    return response()->json([
        'user_id' => $user->id,
        'first_name' => $user->first_name,
        'last_name' => $user->last_name,
        'email' => $user->email,
        'phone_number' => $user->phone_number,
        'gender' => $user->gender,
        'birth_date' => $user->birth_date,
        'address' => $user->address,
        'hire_date' => $user->hire_date,
        'retire_date' => $user->retire_date,
        'hourly_wage_group_id' => $user->hourly_wage_group_id,
        'roles' => $user->roles
    ]);
  }

  public function getUsersWithAttendances($company_id, $year, $month)
  {
      $users = $this->userRepository->getUsersWithAttendances($company_id, $year, $month);
      return response()->json($users);
  }

}
