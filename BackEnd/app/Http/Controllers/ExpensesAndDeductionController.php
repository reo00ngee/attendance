<?php

namespace App\Http\Controllers;

use App\Models\ExpensesAndDeduction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\ExpensesAndDeductionService;

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
        $user = Auth::user();
        $year = $request->query('year');
        $month = $request->query('month');
        return $this->expensesAndDeductionService->getAllExpensesForUser($user, $year, $month);
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
