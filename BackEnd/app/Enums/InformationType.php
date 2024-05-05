<?php

namespace App\Enums;

class InformationType
{
    const SUBMIT_ATTENDANCE_EXPENSE = 0;
    const SUBMISSION_SUBMITTED = 1;
    const SUBMISSION_REJECTED = 2;
    const SUBMISSION_APPROVED = 3;
    const PAYSLIPS_CREATED = 4;

    public static function getInformationType($value)
    {
        switch ($value) {
            case self::SUBMIT_ATTENDANCE_EXPENSE:
                return 'Submit your attendance/expense';
                break;
            case self::SUBMISSION_SUBMITTED:
                return 'Submission has submitted';
                break;
            case self::SUBMISSION_REJECTED:
                return 'Submission has rejected';
                break;
            case self::SUBMISSION_APPROVED:
                return 'Submission has approved';
                break;
            case self::PAYSLIPS_CREATED:
                return 'Payslips have been created';
                break;
            default:
                return null;
        }
    }

    public static function getInformationTypeDescription($value)
    {
        switch ($value) {
            case self::SUBMIT_ATTENDANCE_EXPENSE:
                return 'Information for propmting submission.';
                break;
            case self::SUBMISSION_SUBMITTED:
                return 'Information that submission has submitted.';
                break;
            case self::SUBMISSION_REJECTED:
                return 'Information that submission has rejected.';
                break;
            case self::SUBMISSION_APPROVED:
                return 'Information that submission has approved.';
                break;
            case self::PAYSLIPS_CREATED:
                return 'Information that payslips have been created.';
                break;
            default:
                return null;
        }
    }
}
