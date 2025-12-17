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
        Schema::table('documents', function (Blueprint $table) {
            // Drop foreign key constraint first
            $table->dropForeign(['perkara_id']);
            $table->dropForeign(['diunggah_oleh']);
            
            // Make columns nullable
            $table->foreignId('perkara_id')->nullable()->change()->constrained('perkaras')->nullOnDelete();
            $table->foreignId('diunggah_oleh')->nullable()->change()->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            // Drop nullable foreign keys
            $table->dropForeign(['perkara_id']);
            $table->dropForeign(['diunggah_oleh']);
            
            // Make columns required again
            $table->foreignId('perkara_id')->change()->constrained('perkaras')->cascadeOnDelete();
            $table->foreignId('diunggah_oleh')->change()->constrained('users')->cascadeOnDelete();
        });
    }
};
