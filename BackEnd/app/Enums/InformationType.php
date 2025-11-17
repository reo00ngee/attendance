<?php

namespace App\Enums;

enum InformationType: int
{
    case SUBMIT_ATTENDANCE_EXPENSE = 0;
    case SUBMISSION_SUBMITTED = 1;
    case SUBMISSION_REJECTED = 2;
    case SUBMISSION_APPROVED = 3;
    case PAYSLIPS_CREATED = 4;

    public function label(): string
    {
        return match($this) {
            self::SUBMIT_ATTENDANCE_EXPENSE => 'Submit your attendance/expense',
            self::SUBMISSION_SUBMITTED => 'Submission has been submitted',
            self::SUBMISSION_REJECTED => 'Submission has been rejected',
            self::SUBMISSION_APPROVED => 'Submission has been approved',
            self::PAYSLIPS_CREATED => 'Payslips have been created',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::SUBMIT_ATTENDANCE_EXPENSE => 'Information prompting the user to submit attendance or expenses.',
            self::SUBMISSION_SUBMITTED => 'Notification that a submission has been completed.',
            self::SUBMISSION_REJECTED => 'Notification that a submission has been rejected.',
            self::SUBMISSION_APPROVED => 'Notification that a submission has been approved.',
            self::PAYSLIPS_CREATED => 'Notification that payslips have been generated.',
        };
    }
}
