<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\CompanyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::middleware(['auth:sanctum'])->group(function () {
//   Route::post('/start_work', [AttendanceController::class, 'startWork']);
//   Route::post('/finish_work', [AttendanceController::class, 'finishWork']);
// });

// 会社登録ルート（認証なしでアクセス可能）
Route::post('/register_company', [CompanyController::class, 'store']);

// 会社一覧取得ルート（管理者のみ）
Route::get('/get_companies_for_management', [CompanyController::class, 'index']);

// 会社詳細取得ルート（管理者のみ）
Route::get('/get_company/{id}', [CompanyController::class, 'show']);

// 会社更新ルート（管理者のみ）
Route::put('/update_company/{id}', [CompanyController::class, 'update']);
