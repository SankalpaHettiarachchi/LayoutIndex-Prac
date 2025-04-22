<?php

namespace App\Events;

use Carbon\Carbon;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function broadcastOn(): array
    {
        // Determine channel based on order status
        $channelName = match($this->order->status) {
            'in-progress' => 'OrderInProgressChannel',
            'completed' => 'OrderCompleteChannel',
            default => 'OrderChannel' // Fallback channel
        };

        return [
            new Channel($channelName),
        ];
    }

    public function broadcastAs(): string
    {
        return 'OrderStatusUpdate';
    }

    public function broadcastWith(): array
    {
        return [
            'order' => [
                'id' => $this->order->id,
                'order_no' => $this->order->order_no,
                'status' => $this->order->status,
                'send_to_kitchen_at' => $this->order->send_to_kitchen_at
                    ? Carbon::parse($this->order->send_to_kitchen_at)->format('M d, Y h:i A')
                    : null,
                'created_at' => $this->order->created_at->toISOString(),
                'created_by' => $this->order->created_by,
            ]
        ];
    }
}
