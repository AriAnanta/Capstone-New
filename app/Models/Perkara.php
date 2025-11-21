<?php

namespace App\Models;

use App\Enums\CaseType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Perkara extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nomor_perkara',
        'jenis_perkara',
        'status',
        'tanggal_masuk',
        'pengadilan_asal',
        'metadata',
        'created_by',
        'assigned_to',
    ];

    protected $casts = [
        'metadata' => 'array',
        'tanggal_masuk' => 'date',
        'jenis_perkara' => CaseType::class,
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function recommendations(): HasMany
    {
        return $this->hasMany(LlmRecommendation::class);
    }
}
