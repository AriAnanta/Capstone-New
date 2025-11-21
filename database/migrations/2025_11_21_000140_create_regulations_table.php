<?php

use App\Enums\CaseType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regulations', function (Blueprint $table) {
            $table->id();
            $table->string('nama_undang');
            $table->string('pasal');
            $table->enum('kategori_perkara', array_column(CaseType::cases(), 'value'));
            $table->text('isi_pasal');
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regulations');
    }
};
