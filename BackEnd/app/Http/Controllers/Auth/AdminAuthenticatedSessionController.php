<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AdminLoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminAuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(AdminLoginRequest $request): JsonResponse
    {
        try {
            $request->authenticate();

            $request->session()->regenerate();

            // 管理者情報を取得して返す
            $admin = Auth::guard('admin')->user();
            
            return response()->json([
                'message' => 'Login successful',
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Admin login failed: ' . $e->getMessage());
            return response()->json(['error' => 'Login failed'], 401);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        try {
            // 現在の認証状態をログに記録
            $admin = Auth::guard('admin')->user();
            if ($admin) {
                Log::info('Admin logout: ' . $admin->email);
            }

            Auth::guard('admin')->logout();

            $request->session()->invalidate();

            $request->session()->regenerateToken();

            Log::info('Admin session destroyed successfully');
            
            return response()->noContent();
        } catch (\Exception $e) {
            Log::error('Admin logout failed: ' . $e->getMessage());
            return response()->json(['error' => 'Logout failed'], 500);
        }
    }
}
