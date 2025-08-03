<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Information;
use App\Repositories\InformationRepository;
use App\Repositories\CompanyRepository;
use App\Repositories\UserRepository;
use App\Traits\FetchCompanyDataTrait;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InformationService
{
    use FetchCompanyDataTrait;
    private InformationRepository $informationRepository;
    private CompanyRepository $companyRepository;
    private UserRepository $userRepository;

    public function __construct(
        InformationRepository $informationRepository,
        CompanyRepository $companyRepository,
        UserRepository $userRepository
    ) {
        $this->informationRepository = $informationRepository;
        $this->companyRepository = $companyRepository;
        $this->userRepository = $userRepository;
    }

    public function getInformations(int $company_id, int $user_id)
    {
        $last_closing_date = $this->getCompanyLastClosingDate($company_id);
        $user_roles = $this->userRepository->getUser($user_id)->roles;
        $informations = $this->informationRepository->getInformations($user_id, $user_roles, $last_closing_date);
        return $informations->map(function ($information) {
            return [
                'information_id' => $information->id,
                'submission_type' => $information->submission_type,
                'information_type' => $information->information_type,
                'comment' => $information->comment,
                'created_at' => $information->created_at,
                'user_name' => $information->source_user_full_name ?? null,
            ];
        });
    }
}
