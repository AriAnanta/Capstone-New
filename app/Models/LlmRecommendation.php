<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LlmRecommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'perkara_id',
        'document_id',
        'daftar_pasal',
        'pertimbangan_llm',
        'meta',
    ];

    protected $casts = [
        'daftar_pasal' => 'array',
        'meta' => 'array',
    ];

    public function perkara(): BelongsTo
    {
        return $this->belongsTo(Perkara::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
