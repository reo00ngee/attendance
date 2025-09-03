<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateExpensesAndDeductionRequest;
use App\Models\ExpensesAndDeduction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\ExpensesAndDeductionService;
use App\Http\Requests\BatchUpdateExpensesRequest;
use App\Http\Requests\ApproveExpensesRequest;
use App\Http\Requests\RejectExpensesRequest;

class ExpensesAndDeductionController extends Controller
{
    private ExpensesAndDeductionService $expensesAndDeductionService;
    public function __construct(ExpensesAndDeductionService $expensesAndDeductionService)
    {
        $this->expensesAndDeductionService = $expensesAndDeductionService;
        $this->middleware('auth');
    }
    public function getAllExpensesForUser(Request $request)
    {
        $company_id = Auth::user()->company_id;
        $user_id = Auth::id();
        $year = $request->query('year');
        $month = $request->query('month');
        return $this->expensesAndDeductionService->getAllExpensesForUser($company_id, $user_id, $year, $month);
    }

    public function batchUpdateExpenses(BatchUpdateExpensesRequest $request)
    {
        $company_id = Auth::user()->company_id;
        $user_id = Auth::id();
        $validated = $request->validated();

        return $this->expensesAndDeductionService->batchUpdateExpenses(
            $company_id,
            $user_id,
            $validated['updated'] ?? [],
            $validated['created'] ?? [],
            $validated['deleted'] ?? [],
            $validated['year'],
            $validated['month']
        );
    }

    public function submitExpenses(Request $request)
    {
        $company_id = Auth::user()->company_id;
        $user_id = Auth::id();
        $year = $request->query('year');
        $month = $request->query('month');
        return $this->expensesAndDeductionService->submitExpenses($company_id, $user_id, $year, $month);
    }

    public function getSubmittedAndApprovedExpenses(Request $request)
    {
        $company_id = Auth::user()->company_id;
        $user_id = $request->query('user_id') ?: Auth::id();
        $year = $request->query('year');
        $month = $request->query('month');

        return $this->expensesAndDeductionService->getSubmittedAndApprovedExpenses($company_id, $user_id, $year, $month);
    }

    public function approveExpenses(ApproveExpensesRequest $request)
    {
        $company_id = Auth::user()->company_id;
        $validated = $request->validated();
        return $this->expensesAndDeductionService->approveExpenses(
            $company_id,
            $validated['user_id'],
            $validated['year'],
            $validated['month']
        );
    }

    public function rejectExpenses(RejectExpensesRequest $request)
    {
        $company_id = Auth::user()->company_id;
        $validated = $request->validated();
        return $this->expensesAndDeductionService->rejectExpenses(
            $company_id,
            $validated['user_id'],
            $validated['year'],
            $validated['month'],
            $validated['rejection_reason']
        );
    }

    public function getCreatedByManagerExpensesAndDeductions(Request $request)
    {
        $company_id = Auth::user()->company_id;
        $user_id = $request->query('user_id') ?: Auth::id();
        $year = $request->query('year');
        $month = $request->query('month');

        return $this->expensesAndDeductionService->getCreatedByManagerExpensesAndDeductions(
            $company_id,
            $user_id,
            $year,
            $month
        );
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
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
    public function show(ExpensesAndDeduction $expensesAndDeduction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExpensesAndDeduction $expensesAndDeduction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ExpensesAndDeduction $expensesAndDeduction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExpensesAndDeduction $expensesAndDeduction)
    {
        //
    }
}
