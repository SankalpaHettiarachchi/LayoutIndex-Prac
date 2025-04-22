<?php

namespace App\Events;

use Carbon\Carbon;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderReceivedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function broadcastOn():array
    {
        return [
            new Channel('OrderReceivedChannel'),
            new Channel('OrderSentChannel'),
            new Channel('OrderCreateChannel'),
        ];
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
                'send_to_kitchen_at' => Carbon::parse($this->order->send_to_kitchen_at)->format('M d, Y h:i A'),
                'created_at' => $this->order->created_at->toISOString(),
                'created_by' => $this->order->created_by,
            ],
            'message' => "New Order Received",
        ];
    }
}
