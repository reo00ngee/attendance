<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendPasswordResetEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private string $email,
        private string $token
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info('Queue: Attempting to send password reset email to: ' . $this->email);
            
            $resetUrl = config('app.frontend_url') . "/reset-password?token={$this->token}&email={$this->email}";
            Log::info('Queue: Reset URL: ' . $resetUrl);
            
            Mail::send('emails.password-reset', ['resetUrl' => $resetUrl], function($message) {
                $message->to($this->email);
                $message->subject('パスワードリセットのご案内');
            });
            
            Log::info('Queue: Password reset email sent successfully to: ' . $this->email);
        } catch (\Exception $e) {
            Log::error('Queue: Failed to send password reset email: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Queue: Password reset email job failed for email: ' . $this->email . ' - Error: ' . $exception->getMessage());
    }
}
