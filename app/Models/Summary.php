<?php

namespace App\Models;

use App\Enums\SummaryType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Summary extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id',
        'tipe_ringkasan',
        'ringkasan',
        'meta',
        'created_by',
        'created_via',
    ];

    protected $casts = [
        'meta' => 'array',
        'tipe_ringkasan' => SummaryType::class,
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
