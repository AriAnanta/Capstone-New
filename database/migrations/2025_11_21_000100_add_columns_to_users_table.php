<?php

use App\Enums\UserRole;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('email');
            $table->string('phone')->nullable()->after('username');
            $table->enum('role', array_column(UserRole::cases(), 'value'))
                ->default(UserRole::Public->value)
                ->after('phone');
            $table->string('origin_court')->nullable()->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'phone', 'role', 'origin_court']);
        });
    }
};
