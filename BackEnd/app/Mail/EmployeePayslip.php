<?php

namespace App\Mail;

use App\Models\Company;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmployeePayslip extends Mailable
{
    use SerializesModels;

    public Company $company;
    public User $user;
    public Carbon $periodStart;
    public Carbon $periodEnd;
    public string $payslipPath;

    public function __construct(
        Company $company,
        User $user,
        Carbon $periodStart,
        Carbon $periodEnd,
        string $payslipPath
    ) {
        $this->company = $company;
        $this->user = $user;
        $this->periodStart = $periodStart;
        $this->periodEnd = $periodEnd;
        $this->payslipPath = $payslipPath;
    }

    public function build(): self
    {
        $subject = sprintf(
            '[%s] %s Payroll Statement',
            $this->company->name,
            $this->periodStart->format('Y/m/d') . ' - ' . $this->periodEnd->format('Y/m/d')
        );

        return $this->subject($subject)
            ->markdown('emails.payslip')
            ->with([
                'company' => $this->company,
                'user' => $this->user,
                'periodStart' => $this->periodStart,
                'periodEnd' => $this->periodEnd,
            ])
            ->attach($this->payslipPath, [
                'as' => $this->generatePayslipFileName(),
                'mime' => 'application/pdf',
            ]);
    }

    private function generatePayslipFileName(): string
    {
        // Sanitize names for filename (remove special characters, replace spaces with underscores)
        $sanitize = function ($str) {
            return preg_replace('/[^a-zA-Z0-9_-]/', '_', $str);
        };

        // Get user name from first_name and last_name, fallback to email username if empty
        $userName = trim(($this->user->first_name ?? '') . ($this->user->last_name ?? ''));
        if (empty($userName)) {
            // Extract username from email (part before @)
            $userName = explode('@', $this->user->email)[0] ?? 'User';
        }
        $userName = $sanitize($userName);

        $periodStr = sprintf(
            '%s_%s',
            $this->periodStart->format('Y-m-d'),
            $this->periodEnd->format('Y-m-d')
        );

        return sprintf(
            '%s_%s_Payslip.pdf',
            $periodStr,
            $userName
        );
    }
}

