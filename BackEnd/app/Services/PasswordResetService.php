<?php

namespace App\Services;

use App\Repositories\PasswordResetRepository;
use App\Repositories\UserRepository;
use App\Jobs\SendPasswordResetEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PasswordResetService
{
    public function __construct(
        private PasswordResetRepository $passwordResetRepository,
        private UserRepository $userRepository
    ) {}

    public function sendResetLink(string $email)
    {
        try {
            Log::info('mail:'. $email);
            // ユーザー存在確認
            $user = $this->userRepository->findByEmail($email);
            Log::info('user:'. $user);
            
            if (!$user) {
                return [
                    'message' => 'If a user with that email address exists, we will send a password reset link.',
                    'status' => 'success'
                ];
            }

            // トークン生成・保存
            $token = $this->passwordResetRepository->createToken($email);
            Log::info('token:'. $token);
            
            // メール送信をキューに追加
            $this->queuePasswordResetEmail($email, $token);

            return [
                'message' => 'Password reset instructions have been queued and will be sent to your email shortly.',
                'status' => 'success'
            ];
        } catch (\Exception $e) {
            Log::error('Failed to send reset link: ' . $e->getMessage());
            return [
                'message' => 'Failed to send reset instructions. Please try again.',
                'status' => 'error'
            ];
        }
    }

    public function resetPassword(string $email, string $token, string $password): array
    {
        try {
            // トークン検証
            if (!$this->passwordResetRepository->validateToken($email, $token)) {
                return [
                    'message' => 'Invalid or expired reset token.',
                    'status' => 'error'
                ];
            }

            // パスワード更新
            $this->userRepository->updatePassword($email, $password);
            
            // トークン削除
            $this->passwordResetRepository->deleteToken($email);

            return [
                'message' => 'Password has been reset successfully.',
                'status' => 'success'
            ];
        } catch (\Exception $e) {
            Log::error('Failed to reset password: ' . $e->getMessage());
            return [
                'message' => 'Failed to reset password. Please try again.',
                'status' => 'error'
            ];
        }
    }

    private function queuePasswordResetEmail(string $email, string $token): void
    {
        try {
            
            // ジョブをキューに追加
            SendPasswordResetEmail::dispatch($email, $token);
            
        } catch (\Exception $e) {
            Log::error('Failed to queue password reset email: ' . $e->getMessage());
            throw $e;
        }
    }
}