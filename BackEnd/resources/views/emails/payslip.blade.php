@component('mail::message')
# {{ $company->name }} Payroll Statement

Dear {{ $user->first_name }} {{ $user->last_name }},

Please find your payroll statement for the period
{{ $periodStart->format('Y/m/d') }} - {{ $periodEnd->format('Y/m/d') }} attached to this email.

If you have any questions, please contact the finance team.

Thanks,<br>
{{ $company->name }}
@endcomponent


