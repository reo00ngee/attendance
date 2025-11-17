<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CompanyService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\UpdateSettingRequest;
use App\Http\Requests\StoreCompanyRequest;

class CompanyController extends Controller
{
    private CompanyService $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    public function getSetting(Request $request)
    {
        $company_id = Auth::user()->company_id;
        return $this->companyService->getSetting($company_id);
    }

    public function updateSetting(UpdateSettingRequest $request)
    {
        $validated = $request->validated();
        $company_id = Auth::user()->company_id;
        return $this->companyService->updateSetting($company_id, $validated);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 両方の認証ガード（web, admin）をチェック
        $user = Auth::user();
        $admin = Auth::guard('admin')->user();
        
        // デバッグ: 認証状態を確認
        Log::info('CompanyController::index - Request details', [
            'url' => $request->url(),
            'method' => $request->method(),
            'web_user_id' => $user ? $user->id : 'not authenticated',
            'web_user_email' => $user ? $user->email : 'no email',
            'admin_user_id' => $admin ? $admin->id : 'not authenticated',
            'admin_user_email' => $admin ? $admin->email : 'no email',
            'session_id' => session()->getId(),
            'csrf_token' => csrf_token()
        ]);

        // どちらかの認証が成功していればOK
        if (!$user && !$admin) {
            Log::warning('CompanyController::index - Neither web nor admin user authenticated', [
                'session_id' => session()->getId(),
                'auth_guards_checked' => ['web', 'admin']
            ]);
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        return $this->companyService->getAllCompanies();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyRequest $request)
    {
        $validated = $request->validated();
        return $this->companyService->createCompany($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        // 両方の認証ガード（web, admin）をチェック
        $user = Auth::user();
        $admin = Auth::guard('admin')->user();
        
        // どちらかの認証が成功していればOK
        if (!$user && !$admin) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        return $this->companyService->getCompanyById($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // 両方の認証ガード（web, admin）をチェック
        $user = Auth::user();
        $admin = Auth::guard('admin')->user();
        
        // どちらかの認証が成功していればOK
        if (!$user && !$admin) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'currency' => 'required|integer',
            'closing_date' => 'required|integer',
            'payroll_rounding_interval' => 'required|integer',
            'prompt_submission_reminder_days' => 'required|integer',
            'standard_working_hours' => 'required|numeric|min:1',
            'overtime_pay_multiplier' => 'nullable|numeric|min:0',
            'night_shift_hours_from' => 'nullable|string',
            'night_shift_hours_to' => 'nullable|string',
            'night_shift_pay_multiplier' => 'nullable|numeric|min:0',
            'holiday_pay_multiplier' => 'nullable|numeric|min:0',
        ]);
        
        return $this->companyService->updateCompany($id, $validated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
