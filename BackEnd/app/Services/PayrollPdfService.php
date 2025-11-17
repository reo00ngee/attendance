<?php

namespace App\Services;

use App\Models\Company;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Carbon\Carbon;

class PayrollPdfService
{
    /**
     * Generate a payslip PDF and persist it to the temp directory.
     */
    public function generatePayslip(
        Company $company,
        User $user,
        Carbon $periodStart,
        Carbon $periodEnd,
        array $summary,
        string $directory
    ): string {
        // Sanitize names for filename (remove special characters, replace spaces with underscores)
        $sanitize = function ($str) {
            return preg_replace('/[^a-zA-Z0-9_-]/', '_', $str);
        };

        // Get user name from first_name and last_name, fallback to email username if empty
        $userName = trim(($user->first_name ?? '') . ($user->last_name ?? ''));
        if (empty($userName)) {
            // Extract username from email (part before @)
            $userName = explode('@', $user->email)[0] ?? 'User';
        }
        $userName = $sanitize($userName);

        $periodStr = sprintf(
            '%s_%s',
            $periodStart->format('Y-m-d'),
            $periodEnd->format('Y-m-d')
        );

        $fileName = sprintf(
            '%s_%s_Payslip.pdf',
            $periodStr,
            $userName
        );

        $filePath = $directory . DIRECTORY_SEPARATOR . $fileName;

        $pdf = PDF::loadView('pdf.payslip', [
            'company' => $company,
            'user' => $user,
            'periodStart' => $periodStart,
            'periodEnd' => $periodEnd,
            'summary' => $summary,
        ])->setPaper('a4', 'portrait');

        $pdf->save($filePath);

        return $filePath;
    }
}


