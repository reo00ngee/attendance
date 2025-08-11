<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CompanyService;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UpdateSettingRequest;

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
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
