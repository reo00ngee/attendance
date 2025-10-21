<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->name('api.')->group(function () {
Route::post('/register', [RegisteredUserController::class, 'store'])
                ->middleware('guest')
                ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
                ->middleware('guest')
                ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
                ->middleware('guest')
                ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
                ->middleware('guest')
                ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
                ->middleware(['auth', 'signed', 'throttle:6,1'])
                ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
                ->middleware(['auth', 'throttle:6,1'])
                ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
                ->middleware('auth')
                ->name('logout');

// Admin authentication routes
Route::post('/admin/login', [\App\Http\Controllers\Auth\AdminAuthenticatedSessionController::class, 'store'])
                ->middleware('guest')
                ->name('admin.login');

Route::post('/admin/logout', [\App\Http\Controllers\Auth\AdminAuthenticatedSessionController::class, 'destroy'])
                ->middleware('auth:admin')
                ->name('admin.logout');

// Admin protected routes
Route::middleware('auth:admin')->group(function () {
    Route::get('/admin/me', [\App\Http\Controllers\AdminController::class, 'me']);
    Route::apiResource('admin/administrators', \App\Http\Controllers\AdminController::class);
});
});