<?php

namespace App\Enums;

enum Gender: int
{
    case MALE = 1;
    case FEMALE = 2;

    public function label(): string
    {
        return match($this) {
            self::MALE => 'Male',
            self::FEMALE => 'Female',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::MALE => 'Identifies as male.',
            self::FEMALE => 'Identifies as female.',
        };
    }
}
