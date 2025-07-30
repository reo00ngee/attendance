<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\CompanyRepository;
use App\Traits\FetchCompanyDataTrait;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanyService
{
  use FetchCompanyDataTrait;
  private CompanyRepository $companyRepository;
  public function __construct(CompanyRepository $companyRepository)
  {
    $this->companyRepository = $companyRepository;
  }

}
