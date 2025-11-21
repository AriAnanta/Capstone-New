<?php

namespace App\Models;

use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'perkara_id',
        'jenis_dokumen',
        'path_file',
        'format_file',
        'teks_ocr',
        'tanggal_upload',
        'diunggah_oleh',
        'metadata',
        'external_reference',
    ];

    protected $casts = [
        'metadata' => 'array',
        'tanggal_upload' => 'datetime',
        'jenis_dokumen' => DocumentType::class,
    ];

    public function perkara(): BelongsTo
    {
        return $this->belongsTo(Perkara::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diunggah_oleh');
    }

    public function summaries(): HasMany
    {
        return $this->hasMany(Summary::class);
    }

    public function recommendations(): HasMany
    {
        return $this->hasMany(LlmRecommendation::class, 'document_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }
}
