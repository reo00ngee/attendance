@component('mail::message')
# {{ $company->name }} Consolidated Payslips

Finance Team,

The payroll statements for all employees covering
{{ $periodStart->format('Y/m/d') }} - {{ $periodEnd->format('Y/m/d') }} are attached as a ZIP archive.

Please review and archive as necessary.

Thanks,<br>
Payroll Automation
@endcomponent


