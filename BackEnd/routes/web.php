<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// 認証関連のルート
Route::get('/login', function () {
    return response()->json(['message' => 'Please login via frontend'], 401);
})->name('login');

// CSRFトークン取得エンドポイント（Sanctum用）
Route::middleware('web')->get('/sanctum/csrf-cookie', function (\Illuminate\Http\Request $request) {
    // Laravel SanctumのCsrfCookieControllerと同じ機能を実装
    if ($request->expectsJson()) {
        return response()->json(null, 204);
    }
    return response('', 204);
});

Route::prefix('api')->name('api.')->middleware(\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class)->group(function () {
    // Route::get('/user', function (Request $request) {
    //     return request()->user();
    // });
    Route::post('/send_reset_link', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset_password', [PasswordResetController::class, 'resetPassword']);
    Route::get('/get_user_for_login', [\App\Http\Controllers\UserController::class, 'getUserForLogin']);
    Route::post('/start_work', [AttendanceController::class, 'startWork'])->middleware('role:0');
    Route::post('/finish_work', [AttendanceController::class, 'finishWork'])->middleware('role:0');
    Route::post('/start_break', [AttendanceController::class, 'startBreak'])->middleware('role:0');
    Route::post('/finish_break', [AttendanceController::class, 'finishBreak'])->middleware('role:0');
    Route::post('/update_attendance', [AttendanceController::class, 'updateAttendance'])->middleware('role:0');
    Route::get('/get_latest_attendances_for_user', [AttendanceController::class, 'getLatestAttendancesForUser']);
    Route::get('/get_attendance_for_user', [AttendanceController::class, 'getAttendanceForUser']);
    Route::get('/get_all_attendances_for_user', [AttendanceController::class, 'getAllAttendancesForUser']);
    Route::post('submit_attendances', [AttendanceController::class, 'submitAttendances'])->middleware('role:0');
    Route::get('/get_submitted_and_approved_attendances', [AttendanceController::class, 'getSubmittedAndApprovedAttendances']);
    Route::post('/approve_attendances', [\App\Http\Controllers\AttendanceController::class, 'approveAttendances'])->middleware('role:1');
    Route::post('/reject_attendances', [\App\Http\Controllers\AttendanceController::class, 'rejectAttendances'])->middleware('role:1');
    Route::get('/get_all_expenses_for_user', [\App\Http\Controllers\ExpensesAndDeductionController::class, 'getAllExpensesForUser']);
    Route::post('/batch_update_expenses', [\App\Http\Controllers\ExpensesAndDeductionController::class, 'batchUpdateExpenses'])->middleware('role:0');
    Route::post('/submit_expenses', [\App\Http\Controllers\ExpensesAndDeductionController::class, 'submitExpenses'])->middleware('role:0');
    Route::get('/get_submitted_and_approved_expenses', [\App\Http\Controllers\ExpensesAndDeductionController::class, 'getSubmittedAndApprovedExpenses']);
    Route::get('/get_created_by_manager_expenses_and_deductions', [\App\Http\Controllers\ExpensesAndDeductionController::class, 'getCreatedByManagerExpensesAndDeductions']);
    Route::post('/approve_expenses', [\App\Http\Controllers\ExpensesAndDeductionController::class, 'approveExpenses'])->middleware('role:2');
    Route::post('/reject_expenses', [\App\Http\Controllers\ExpensesAndDeductionController::class, 'rejectExpenses'])->middleware('role:2');
    Route::post('/store_user', [\App\Http\Controllers\UserController::class, 'storeUser'])->middleware('role:3');
    Route::post('/update_user', [\App\Http\Controllers\UserController::class, 'updateUser'])->middleware('role:3');
    Route::get('/get_users_for_management', [\App\Http\Controllers\UserController::class, 'getUsersForManagement']);
    Route::get('/get_user', [\App\Http\Controllers\UserController::class, 'getUser']);
    Route::get('/get_users_with_attendances', [\App\Http\Controllers\UserController::class, 'getUsersWithAttendances']);
    Route::get('/get_users_with_expenses_and_deductions', [\App\Http\Controllers\UserController::class, 'getUsersWithExpensesAndDeductions']);
    Route::get('/get_hourly_wage_groups_by_company_id', [\App\Http\Controllers\HourlyWageGroupController::class, 'getHourlyWageGroupsByCompanyId']);
    Route::get('/get_hourly_wage_group', [\App\Http\Controllers\HourlyWageGroupController::class, 'getHourlyWageGroup']);
    Route::post('/store_hourly_wage_group', [\App\Http\Controllers\HourlyWageGroupController::class, 'storeHourlyWageGroup'])->middleware('role:3');
    Route::post('/update_hourly_wage_group', [\App\Http\Controllers\HourlyWageGroupController::class, 'updateHourlyWageGroup'])->middleware('role:3');
    Route::get('/get_informations', [\App\Http\Controllers\InformationController::class, 'getInformations']);
    Route::get('/get_setting', [CompanyController::class, 'getSetting'])->middleware('role:4');
    Route::post('/update_setting', [CompanyController::class, 'updateSetting'])->middleware('role:4');
});




require __DIR__ . '/auth.php';
