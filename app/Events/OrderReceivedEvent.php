<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderReceivedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;
    /**
     * Create a new event instance.
     */
    public function __construct($order)
    {
        $this->order = $order;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn():Channel
    {
        return new Channel('OrderChannel');
    }

    public function broadcastAs():String
    {
        return ('Create');
    }

    public function broadcastWith():array
    {
        return [
            'order' => [
                'id' => $this->order->id,
                'order_no' => $this->order->order_no,
                'status' => $this->order->status,
                'send_to_kitchen_at' => \Carbon\Carbon::parse($this->order->send_to_kitchen_at)->format('M d, Y h:i A'),
                'created_at' => $this->order->created_at->toISOString(),
                'created_by' => $this->order->created_by,
                // include anything else you want
            ],
            'message' => "New Order Received",
        ];
    }
}
