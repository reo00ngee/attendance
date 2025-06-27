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
}
