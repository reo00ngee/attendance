<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\HourlyWageGroupService;

class HourlyWageGroupController extends Controller
{
    private HourlyWageGroupService $hourlyWageGroupService;
    public function __construct(HourlyWageGroupService $hourlyWageGroupService)
    {
        $this->hourlyWageGroupService = $hourlyWageGroupService;
        $this->middleware('auth');
    }

    public function getHourlyWageGroupByCompanyId(Request $request)
    {
        $user = Auth::user();
        return $this->hourlyWageGroupService->getHourlyWageGroupByCompanyId($user);
    }
}
