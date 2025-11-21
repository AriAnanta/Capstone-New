<?php

use App\Enums\CaseType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perkaras', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_perkara')->unique();
            $table->enum('jenis_perkara', array_column(CaseType::cases(), 'value'));
            $table->string('status')->default('draft');
            $table->date('tanggal_masuk')->nullable();
            $table->string('pengadilan_asal')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perkaras');
    }
};
