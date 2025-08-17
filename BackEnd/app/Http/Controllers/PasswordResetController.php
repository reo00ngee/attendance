<?php

namespace App\Http\Controllers;

use App\Services\PasswordResetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PasswordResetController extends Controller
{
    public function __construct(
        private PasswordResetService $passwordResetService
    ) {}

    public function sendResetLink(Request $request)
    {
        Log::info('sendResetLink', $request->all());
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->passwordResetService->sendResetLink($validator->validated()['email']);
        
        // Serviceの結果をHTTPレスポンスに変換
        $statusCode = $result['status'] === 'success' ? 200 : 500;
        return response()->json($result, $statusCode);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->passwordResetService->resetPassword(
            $request->email,
            $request->token,
            $request->password
        );
        
        $statusCode = $result['status'] === 'success' ? 200 : 500;
        return response()->json($result, $statusCode);
    }
}