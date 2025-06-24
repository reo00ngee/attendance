<?php

namespace App\Enums;

enum PromptSubmissionReminderDays: int
{
    case THREE_DAYS = 3;
    case FIVE_DAYS = 5;
    case SEVEN_DAYS = 7;

    public function label(): string
    {
        return match($this) {
            self::THREE_DAYS => '3 days',
            self::FIVE_DAYS => '5 days',
            self::SEVEN_DAYS => '7 days',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::THREE_DAYS => 'Send reminder 3 days before submission deadline.',
            self::FIVE_DAYS => 'Send reminder 5 days before submission deadline.',
            self::SEVEN_DAYS => 'Send reminder 7 days before submission deadline.',
        };
    }
}
