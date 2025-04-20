<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    const STAFF_COUNT = 5;
    const DEFAULT_PASSWORD = 'sa123456';

    public function run()
    {
        $this->createStaffUsers();
        $this->showCredentials();
    }

    protected function createStaffUsers()
    {
        for ($i = 1; $i <= self::STAFF_COUNT; $i++) {
            User::create([
                'id' => Str::uuid(),
                'name' => 'Staff ' . $i,
                'email' => 'staff' . $i . '@gmail.com',
                'password' => Hash::make(self::DEFAULT_PASSWORD),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }

    protected function showCredentials()
    {
        $this->command->info('Created '.self::STAFF_COUNT.' staff users:');

        for ($i = 1; $i <= self::STAFF_COUNT; $i++) {
            $this->command->line(
                sprintf('Staff %d: staff%d@gmail.com / %s',
                    $i, $i, self::DEFAULT_PASSWORD)
            );
        }
    }
}

