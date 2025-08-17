<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\InformationService;


class InformationController extends Controller
{
    private InformationService $informationService;

    public function __construct(InformationService $informationService)
    {
        $this->informationService = $informationService;
    }

    public function getInformations(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $company_id = $user->company_id;
        $user_id = $user->id;
        
        return $this->informationService->getInformations($company_id, $user_id);
    }


    
}
