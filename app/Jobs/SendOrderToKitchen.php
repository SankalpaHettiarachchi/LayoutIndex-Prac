<?php

namespace App\Jobs;

use App\Events\OrderEvent;
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

    public $tries = 5;

    // Delay between retries (in seconds)
    public $backoff = [30, 60, 120, 300, 600];

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function handle()
    {
        // Double check
        if ($this->order->status === Order::STATUS_PENDING && now()->gte($this->order->send_to_kitchen_at)) {
            $this->order->update([
                'status' => Order::STATUS_IN_PROGRESS
            ]);
            event(new OrderEvent($this->order));
            Log::info('Order has been sent to Kitchen. At ::'.$this->order->send_to_kitchen_at);
        }else{
            Log::error('No order has been sent to Kitchen. At ::'.$this->order->send_to_kitchen_at);
        }
    }

    public function failed(\Throwable $exception)
    {
        Log::error("Failed to send order #{$this->order->id} to kitchen: ".$exception->getMessage());
        event(new OrderEvent($this->order));
    }
}
