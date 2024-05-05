<?php

namespace App\Enums;

class SubmissionStatus
{
    const CREATED = 0;
    const SUBMITTED = 1;
    const REJECTED = 2;
    const APPROVED = 3;
    const CALCULATED = 4;

    public static function getStatus($value)
    {
        switch ($value) {
            case self::CREATED:
                return 'Created';
                break;
            case self::SUBMITTED:
                return 'Submitted';
                break;
            case self::REJECTED:
                return 'Rejected';
                break;
            case self::APPROVED:
                return 'Approved';
                break;
            case self::CALCULATED:
                return 'Calculated';
                break;
            default:
                return null;
        }
    }

    public static function getStatusDescription($value)
    {
        switch ($value) {
            case self::CREATED:
                return 'A status that created in the registration process.';
                break;
            case self::SUBMITTED:
                return 'A status that submitted in the registration process.';
                break;
            case self::REJECTED:
                return 'A status that rejected in the management process.';
                break;
            case self::APPROVED:
                return 'A status that approved in the management process.';
                break;
            case self::CALCULATED:
                return 'A status that calculated in the payroll process.';
                break;
            default:
                return null;
        }
    }
}
