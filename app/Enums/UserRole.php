<?php

namespace App\Enums;

enum UserRole: string
{
    case Judge = 'hakim';
    case Registrar = 'panitera';
    case Staff = 'staf';
    case Public = 'publik';

    public static function default(): self
    {
        return self::Public;
    }
}
