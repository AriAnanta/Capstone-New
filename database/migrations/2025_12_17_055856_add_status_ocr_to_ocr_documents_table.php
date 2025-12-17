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
        Schema::table('ocr_documents', function (Blueprint $table) {
            $table->enum('status_ocr', ['pending', 'processing', 'completed', 'failed'])
                ->default('pending')
                ->after('teks_ocr');
            $table->text('error_message')->nullable()->after('status_ocr');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ocr_documents', function (Blueprint $table) {
            $table->dropColumn(['status_ocr', 'error_message']);
        });
    }
};
