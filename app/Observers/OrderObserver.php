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
        $latest = Order::latest()->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        $order->order_number = 'ORD-' . str_pad($nextId, 7, '0', STR_PAD_LEFT);

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
}
