<?php

namespace App\Mail;

use App\Models\Company;
use Carbon\Carbon;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FinancePayslipArchive extends Mailable
{
    use SerializesModels;

    public Company $company;
    public Carbon $periodStart;
    public Carbon $periodEnd;
    public string $archivePath;

    public function __construct(
        Company $company,
        Carbon $periodStart,
        Carbon $periodEnd,
        string $archivePath
    ) {
        $this->company = $company;
        $this->periodStart = $periodStart;
        $this->periodEnd = $periodEnd;
        $this->archivePath = $archivePath;
    }

    public function build(): self
    {
        $subject = sprintf(
            '[%s] %s Consolidated Payroll Statements',
            $this->company->name,
            $this->periodStart->format('Y/m/d') . ' - ' . $this->periodEnd->format('Y/m/d')
        );

        return $this->subject($subject)
            ->markdown('emails.payslip_archive')
            ->with([
                'company' => $this->company,
                'periodStart' => $this->periodStart,
                'periodEnd' => $this->periodEnd,
            ])
            ->attach($this->archivePath, [
                'as' => $this->generateArchiveFileName(),
                'mime' => 'application/zip',
            ]);
    }

    private function generateArchiveFileName(): string
    {
        // Sanitize company name for filename
        $sanitize = function ($str) {
            return preg_replace('/[^a-zA-Z0-9_-]/', '_', $str);
        };

        $companyName = $sanitize($this->company->name);
        $periodStr = sprintf(
            '%s_%s',
            $this->periodStart->format('Y-m-d'),
            $this->periodEnd->format('Y-m-d')
        );

        return sprintf(
            '%s_%s_Payslips.zip',
            $periodStr,
            $companyName
        );
    }
}

