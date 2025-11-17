<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetRepository
{
    public function createToken(string $email): string
    {
        try {
            // 既存トークン削除
            $this->deleteToken($email);
            
            // 新しいトークン生成
            $token = Str::random(64);
            
            DB::table('password_reset_tokens')->insert([
                'email' => $email,
                'token' => $token,
                'created_at' => Carbon::now()
            ]);
            
            return $token;
        } catch (\Exception $e) {
            Log::error('Failed to create reset token: ' . $e->getMessage());
            throw $e;
        }
    }

    public function validateToken(string $email, string $token): bool
    {
        try {
            $record = DB::table('password_reset_tokens')
                ->where('email', $email)
                ->where('token', $token)
                ->where('created_at', '>', Carbon::now()->subHours(24))
                ->first();
                
            return $record !== null;
        } catch (\Exception $e) {
            Log::error('Failed to validate token: ' . $e->getMessage());
            return false;
        }
    }

    public function deleteToken(string $email): void
    {
        try {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
        } catch (\Exception $e) {
            Log::error('Failed to delete token: ' . $e->getMessage());
            throw $e;
        }
    }
}