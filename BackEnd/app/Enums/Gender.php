<?php

namespace App\Enums;

class Gender
{
    const MALE = 1;
    const FEMALE = 2;

    public static function getGender($value)
    {
        switch ($value) {
            case self::MALE:
                return 'Male';
                break;
            case self::FEMALE:
                return 'Female';
                break;
            default:
                return null;
        }
    }
}
