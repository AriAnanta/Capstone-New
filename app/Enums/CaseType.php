<?php

namespace App\Enums;

enum CaseType: string
{
    case CeraiTalak = 'cerai_talak';
    case CeraiGugat = 'cerai_gugat';
    case Kewarisan = 'kewarisan';
    case HartaBersama = 'harta_bersama';
    case EkonomiSyariah = 'ekonomi_syariah';
    case PembatalanPerkawinan = 'pembatalan_perkawinan';
    case Hadlonah = 'hadlonah';
    case Hibah = 'hibah';

    public static function labels(): array
    {
        return [
            self::CeraiTalak->value => 'Cerai Talak',
            self::CeraiGugat->value => 'Cerai Gugat',
            self::Kewarisan->value => 'Kewarisan',
            self::HartaBersama->value => 'Harta Bersama',
            self::EkonomiSyariah->value => 'Ekonomi Syariah',
            self::PembatalanPerkawinan->value => 'Pembatalan Perkawinan',
            self::Hadlonah->value => 'Hadlonah/Penguasaan Anak',
            self::Hibah->value => 'Hibah',
        ];
    }
}
