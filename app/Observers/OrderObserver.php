<?php

namespace App\Observers;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderObserver
{
    public function creating(Order $order): void
    {
        $order->order_no = $this->generateOrderNumber();

        if (Auth::check()) {
            $order->created_by = Auth::id();
        }

        $order->status = OrderStatusEnum::PENDING;
    }

    public function updating(Order $order): void
    {
        if (Auth::check()) {
            $order->updated_by = Auth::id();
        }
    }

    protected function generateOrderNumber(): string
    {
        $latestOrder = Order::withTrashed()
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
