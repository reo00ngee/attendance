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
        $fileName = sprintf(
            '%s_%s_%s.pdf',
            $user->id,
            $periodStart->format('Ym'),
            uniqid()
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


