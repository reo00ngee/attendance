<?php

namespace App\Enums;

enum ClosingDate: int
{
    case FIFTEENTH = 15;
    case TWENTIETH = 20;
    case TWENTY_FIFTH = 25;
    case END_OF_MONTH = 30;

    public function label(): string
    {
        return match($this) {
            self::FIFTEENTH => '15th',
            self::TWENTIETH => '20th',
            self::TWENTY_FIFTH => '25th',
            self::END_OF_MONTH => 'End of month',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::FIFTEENTH => 'Closing date on the 15th of each month.',
            self::TWENTIETH => 'Closing date on the 20th of each month.',
            self::TWENTY_FIFTH => 'Closing date on the 25th of each month.',
            self::END_OF_MONTH => 'Closing date at the end of each month.',
        };
    }
}
