<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
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

    public function storeUser(StoreUserRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();
        $this->userService->storeUser($user, $validated);
    }

    public function getUsersForManagement(Request $request)
    {
        $user = Auth::user();
        return $this->userService->getUsersForManagement($user);
    }
}
