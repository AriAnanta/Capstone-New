<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ocr_documents', function (Blueprint $table) {
            $table->id();
            $table->string('nama_file'); // Original filename
            $table->string('path_file'); // Storage path
            $table->string('format_file'); // pdf, jpg, png, etc
            $table->bigInteger('ukuran_file')->nullable(); // File size in bytes
            $table->longText('teks_ocr')->nullable(); // OCR result
            $table->string('kategori')->default('umum'); // Kategori dokumen: umum, surat, formulir, dll
            $table->text('keterangan')->nullable(); // Optional notes
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('tanggal_upload')->useCurrent();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ocr_documents');
    }
};
