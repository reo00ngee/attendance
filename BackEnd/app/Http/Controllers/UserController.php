<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    private UserService $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        $this->middleware('auth');
    }

    public function getUserForLogin(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        $user_id = $user->id;
        return $this->userService->getUser($user_id);
    }

    public function storeUser(StoreUserRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();
        return $this->userService->storeUser($user, $validated);
    }

    public function updateUser(UpdateUserRequest $request)
    {
        $validated = $request->validated();
        return $this->userService->updateUser($validated);
    }

    public function getUsersForManagement(Request $request)
    {
        $user = Auth::user();
        return $this->userService->getUsersForManagement($user);
    }

    public function getUser(Request $request)
    {
        $user_id = $request->query('user_id');
        return $this->userService->getUser($user_id);
    }

    public function getUsersWithAttendances(Request $request)
    {
        $user = Auth::user();
        $company_id = $user->company_id;
        $year = $request->query('year');
        $month = $request->query('month');
        return $this->userService->getUsersWithAttendances($company_id, $year, $month);
    }

    public function getUsersWithExpensesAndDeductions(Request $request)
    {
        $user = Auth::user();
        $company_id = $user->company_id;
        $year = $request->query('year');
        $month = $request->query('month');
        return $this->userService->getUsersWithExpensesAndDeductions($company_id, $year, $month);
    }

    // Admin用のメソッド
    public function adminStoreUser(StoreUserRequest $request)
    {
        // 管理者認証チェック
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return response()->json(['error' => 'Admin not authenticated'], 401);
        }

        $validated = $request->validated();
        return $this->userService->adminStoreUser($validated);
    }

    public function adminUpdateUser(UpdateUserRequest $request)
    {
        // 管理者認証チェック
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return response()->json(['error' => 'Admin not authenticated'], 401);
        }

        $validated = $request->validated();
        return $this->userService->adminUpdateUser($validated);
    }

    public function adminGetUsersForManagement(Request $request)
    {
        // 管理者認証チェック
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return response()->json(['error' => 'Admin not authenticated'], 401);
        }

        $company_id = $request->query('company_id');
        if (!$company_id) {
            return response()->json(['error' => 'Company ID is required'], 400);
        }

        return $this->userService->adminGetUsersForManagement($company_id);
    }

    public function adminGetUser(Request $request)
    {
        // 管理者認証チェック
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return response()->json(['error' => 'Admin not authenticated'], 401);
        }

        $user_id = $request->query('user_id');
        return $this->userService->adminGetUser($user_id);
    }
}
