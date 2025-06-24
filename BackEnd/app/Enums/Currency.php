<?php

namespace App\Enums;

enum Currency: int
{
    case USD = 1;
    case EUR = 2;

    public function code(): string
    {
        return match($this) {
            self::USD => 'USD',
            self::EUR => 'EUR',
        };
    }

    public function symbol(): string
    {
        return match($this) {
            self::USD => '$',
            self::EUR => '€',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::USD => 'United States Dollar',
            self::EUR => 'Euro',
        };
    }
}
