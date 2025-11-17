<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\HourlyWageGroupService;
use App\Http\Requests\StoreHourlyWageGroupRequest;
use App\Http\Requests\UpdateHourlyWageGroupRequest;
use Illuminate\Support\Facades\Log;

class HourlyWageGroupController extends Controller
{
    private HourlyWageGroupService $hourlyWageGroupService;
    public function __construct(HourlyWageGroupService $hourlyWageGroupService)
    {
        $this->hourlyWageGroupService = $hourlyWageGroupService;
        $this->middleware('auth');
    }

    public function getHourlyWageGroupsByCompanyId(Request $request)
    {
        $user = Auth::user();
        return $this->hourlyWageGroupService->getHourlyWageGroupsByCompanyId($user);
    }

    public function getHourlyWageGroup(Request $request) {
        $hourly_wage_group_id = $request->query('hourly_wage_group_id');
        return $this->hourlyWageGroupService->getHourlyWageGroup($hourly_wage_group_id);
    } 

    public function storeHourlyWageGroup(StoreHourlyWageGroupRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();
        return $this->hourlyWageGroupService->storeHourlyWageGroup($user, $validated);
    }

    public function updateHourlyWageGroup(UpdateHourlyWageGroupRequest $request)
    {
        $validated = $request->validated();
        return $this->hourlyWageGroupService->updateHourlyWageGroup($validated);
    }

    // Admin用のメソッド
    public function adminGetHourlyWageGroupsByCompanyId(Request $request)
    {
        // 管理者認証チェック
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return response()->json(['error' => 'Admin not authenticated'], 401);
        }

        $company_id = $request->query('company_id');
        if (!$company_id) {
            return response()->json(['error' => 'Company ID is required'], 400);
        }

        return $this->hourlyWageGroupService->adminGetHourlyWageGroupsByCompanyId($company_id);
    }
}
