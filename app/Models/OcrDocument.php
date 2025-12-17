<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OcrDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_file',
        'path_file',
        'format_file',
        'ukuran_file',
        'teks_ocr',
        'status_ocr',
        'error_message',
        'kategori',
        'keterangan',
        'uploaded_by',
        'tanggal_upload',
    ];

    protected $casts = [
        'tanggal_upload' => 'datetime',
        'ukuran_file' => 'integer',
    ];

    /**
     * Relasi ke user yang upload
     */
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
