<?php

namespace App\Jobs;

use App\Events\OrderReceivedEvent;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendOrderToKitchen implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function handle()
    {
        // Optional double check
        if ($this->order->status === Order::STATUS_PENDING && now()->gte($this->order->send_to_kitchen_at)) {
            $this->order->update([
                'status' => Order::STATUS_IN_PROGRESS
            ]);
            event(new OrderReceivedEvent($this->order));
        }else{
            Log::info('No order has been sent to Kitchen. At ::'.$this->order->send_to_kitchen_at);
        }
    }
}
