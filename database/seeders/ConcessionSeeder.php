<?php

namespace Database\Seeders;

use App\Models\Concession;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ConcessionSeeder extends Seeder
{
    public function run()
    {
        if (User::count() === 0) {
            $this->call(UserSeeder::class);
            $this->command->info('Created 5 staff users first');
        }

        $users = User::all();
        $foodTypes = ['Burger', 'Pizza', 'Hot Dog', 'Nachos', 'Popcorn'];

        for ($i = 1; $i <= 100; $i++) {
            Concession::create([
                'id' => Str::uuid(),
                'name' => $this->generateFoodName($i, $foodTypes),
                'description' => "Delicious {$foodTypes[$i % count($foodTypes)]} with special sauce",
                'image_path' => 'concessions/default.webp',
                'price' => (float) rand(100, 1000) + (rand(0, 99) / 100),
                'created_by' => (string)$users->random()->id,
                'updated_by' => (string)$users->random()->id,
            ]);
        }

        $this->command->info('Created 100 concessions with default image');
    }

    private function storeDefaultImage(): string
    {
        $path = 'concessions/default.jpg';
        if (!Storage::exists($path)) {
            Storage::put(
                $path,
                file_get_contents(database_path('seeders/images/default.jpg'))
            );
        }
        return $path;
    }

    private function generateFoodName(int $index, array $types): string
    {
        $adjectives = ['Crispy', 'Spicy', 'Cheesy', 'Deluxe'];
        return sprintf('%s %s #%d',
            $adjectives[$index % count($adjectives)],
            $types[$index % count($types)],
            $index
        );
    }

}
