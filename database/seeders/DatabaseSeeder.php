<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Hakim Utama',
            'username' => 'hakim',
            'email' => 'hakim@example.com',
            'role' => UserRole::Judge->value,
        ]);

        User::factory()->create([
            'name' => 'Panitera Utama',
            'username' => 'panitera',
            'email' => 'panitera@example.com',
            'role' => UserRole::Registrar->value,
        ]);

        User::factory(5)->create();
    }
}
