<?php

namespace App\Enums;

enum SubmissionStatus: int
{
    case CREATED = 0;
    case SUBMITTED = 1;
    case REJECTED = 2;
    case APPROVED = 3;
    case CALCULATED = 4;

    public function label(): string
    {
        return match($this) {
            self::CREATED => 'Created',
            self::SUBMITTED => 'Submitted',
            self::REJECTED => 'Rejected',
            self::APPROVED => 'Approved',
            self::CALCULATED => 'Calculated',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::CREATED => 'A status that created in the registration process.',
            self::SUBMITTED => 'A status that submitted in the registration process.',
            self::REJECTED => 'A status that rejected in the management process.',
            self::APPROVED => 'A status that approved in the management process.',
            self::CALCULATED => 'A status that calculated in the payroll process.',
        };
    }
}