<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Correct order to seed database
        $this->call([
            UserSeeder::class,
            ConcessionSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
