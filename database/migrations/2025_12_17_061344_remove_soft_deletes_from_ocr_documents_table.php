<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, permanently delete all soft-deleted records
        DB::table('ocr_documents')->whereNotNull('deleted_at')->delete();
        
        // Then drop the deleted_at column
        Schema::table('ocr_documents', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ocr_documents', function (Blueprint $table) {
            $table->softDeletes();
        });
    }
};
