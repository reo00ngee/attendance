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
                'as' => sprintf(
                    '%s_%s.pdf',
                    $this->user->id,
                    $this->periodStart->format('Ym')
                ),
                'mime' => 'application/pdf',
            ]);
    }
}

