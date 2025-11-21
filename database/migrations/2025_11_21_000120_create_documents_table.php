<?php

use App\Enums\DocumentType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('perkara_id')->constrained('perkaras')->cascadeOnDelete();
            $table->enum('jenis_dokumen', array_column(DocumentType::cases(), 'value'));
            $table->string('path_file');
            $table->string('format_file');
            $table->longText('teks_ocr')->nullable();
            $table->timestamp('tanggal_upload')->useCurrent();
            $table->foreignId('diunggah_oleh')->constrained('users')->cascadeOnDelete();
            $table->json('metadata')->nullable();
            $table->uuid('external_reference')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
