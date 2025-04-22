<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use App\Models\Concession;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::pluck('id')->toArray();
        $concessions = Concession::all();
        $baseTime = Carbon::now()->subHours(3);

        // Create 5 orders with concession items
        for ($i = 0; $i < 10000; $i++) {
            $randomHours = rand(0, 3); // Random hours between 0-3
            $randomMinutes = rand(0, 59); // Random minutes
            $orderCreateTime = $baseTime->copy()->addMinutes($i);
            $orderUpdateTime = $baseTime->copy()->addMinutes($i+2);

            $order = Order::create([
                'id' => Str::uuid(),
                'order_no' => $this->generateOrderNumber(),
                'send_to_kitchen_at' => Carbon::now()->addHours($randomHours)->addMinutes($randomMinutes),
                'status' => 'pending',
                'created_by' => $userIds[array_rand($userIds)],
                'updated_by' => $userIds[array_rand($userIds)],
                'created_at' => $orderCreateTime,
                'updated_at' => $orderUpdateTime,
            ]);

            // Add 1-5 concession items to each order
            $itemsCount = rand(1, 5);
            $selectedConcessions = $concessions->random($itemsCount);

            foreach ($selectedConcessions as $concession) {
                DB::table('concession_order')->insert([
                    'id' => Str::uuid(),
                    'order_id' => $order->id,
                    'concession_id' => $concession->id,
                    'quantity' => rand(1, 5),
                    'unit_price' => $concession->price,
                ]);
            }
        }
    }

    protected function generateOrderNumber(): string
    {
        $latestOrder = Order::withTrashed() // Include soft deleted records
        ->whereNotNull('order_no')
            ->orderBy('created_at', 'desc')
            ->first();

        $nextNumber = 1; // Default starting number

        if ($latestOrder) {
            $lastNumber = (int) substr($latestOrder->order_no, 4);
            $nextNumber = $lastNumber + 1;
        }

        return 'ORD-' . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);
    }
}
