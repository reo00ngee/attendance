<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ClosureService;

class ClosureController extends Controller
{
    private ClosureService $closureService;

    public function __construct(ClosureService $closureService)
    {
        $this->closureService = $closureService;
        $this->middleware('auth');
    }

    /**
     * Check if attendance closure can be performed
     */
    public function checkAttendanceClosure(Request $request)
    {
        $user = auth()->user();
        $company_id = $user->company_id;

        $result = $this->closureService->checkAttendanceClosure($company_id);
        
        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Perform attendance closure
     */
    public function performAttendanceClosure(Request $request)
    {
        $user = auth()->user();
        $company_id = $user->company_id;

        $force = (bool) $request->boolean('force', false);
        $result = $this->closureService->performAttendanceClosure($company_id, $force);
        
        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Check if expense closure can be performed
     */
    public function checkExpenseClosure(Request $request)
    {
        $user = auth()->user();
        $company_id = $user->company_id;

        $result = $this->closureService->checkExpenseClosure($company_id);
        
        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Perform expense closure
     */
    public function performExpenseClosure(Request $request)
    {
        $user = auth()->user();
        $company_id = $user->company_id;

        $force = (bool) $request->boolean('force', false);
        $result = $this->closureService->performExpenseClosure($company_id, $force);
        
        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }
}


