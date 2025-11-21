<?php

namespace App\Models;

use App\Enums\CaseType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Regulation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nama_undang',
        'pasal',
        'kategori_perkara',
        'isi_pasal',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
        'kategori_perkara' => CaseType::class,
    ];
}
