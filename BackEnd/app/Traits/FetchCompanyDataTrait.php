<?php

namespace App\Traits;

use App\Repositories\CompanyRepository;
use Illuminate\Support\Facades\Log;


trait FetchCompanyDataTrait
{

    public function getCompany($company_id)
    {
        try {
            return $this->companyRepository->getCompany($company_id);
        } catch (\Exception $e) {
            Log::error('Failed to fetch company data: ' . $e->getMessage());
            return null;
        }
    }

    public function getCompanyClosingDate($company_id)
    {
        $company = $this->getCompany($company_id);
        if ($company) {
            return $company->closing_date;
        }
        return null;
    }
}
