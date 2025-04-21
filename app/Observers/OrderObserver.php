<?php

namespace App\Observers;

use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function creating(Order $order): void
    {
        $order->order_no = $this->generateOrderNumber();

        if (Auth::check()) {
            $order->created_by = Auth::id();
        }
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updating(Order $order): void
    {
        if (Auth::check()) {
            $order->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "restored" event.
     */
    public function restored(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "force deleted" event.
     */
    public function forceDeleted(Order $order): void
    {
        //
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
