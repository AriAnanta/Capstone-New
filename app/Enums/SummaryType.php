<?php

namespace App\Enums;

enum SummaryType: string
{
    case Internal = 'internal';
    case Public = 'publik';
    case Legal = 'pertimbangan_hukum';
}
