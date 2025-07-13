<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AttendanceController;

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

Route::prefix('api')->name('api.')->group(function () {
    Route::get('/user', function (Request $request) {
        return request()->user();
    });
    Route::post('/start_work', [AttendanceController::class, 'startWork']);
    Route::post('/finish_work', [AttendanceController::class, 'finishWork']);
    Route::post('/start_break', [AttendanceController::class, 'startBreak']);
    Route::post('/finish_break', [AttendanceController::class, 'finishBreak']);
    Route::post('/update_attendance', [AttendanceController::class, 'updateAttendance']);
    Route::get('/get_latest_attendances_for_user', [AttendanceController::class, 'getLatestAttendancesForUser']);
    Route::get('/get_attendance_for_user', [AttendanceController::class, 'getAttendanceForUser']);
    Route::get('/get_all_attendances_for_user', [AttendanceController::class, 'getAllAttendancesForUser']);
    Route::post('submit_attendances', [AttendanceController::class, 'submitAttendances']);
    Route::get('/get_hourly_wage_group_by_company_id', [\App\Http\Controllers\HourlyWageGroupController::class, 'getHourlyWageGroupByCompanyId']);
    Route::post('/store_user', [\App\Http\Controllers\UserController::class, 'storeUser']);
    Route::get('/get_users_for_management', [\App\Http\Controllers\UserController::class, 'getUsersForManagement']);
    Route::get('/get_user', [\App\Http\Controllers\UserController::class, 'getUser']);
});




require __DIR__ . '/auth.php';
