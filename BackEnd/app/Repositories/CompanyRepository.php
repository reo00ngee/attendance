<?php

namespace App\Repositories;

use App\Models\Company;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CompanyRepository
{
  public function getCompany($company_id)
  {
    return Company::where('id', $company_id)
      ->first();
  }
}
