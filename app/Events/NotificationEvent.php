<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $type;
    public $model;

    public function __construct($message, $type = 'success',$model = null)
    {
        $this->message = $message;
        $this->type = $type;
        $this->model = $model;
    }

    public function broadcastOn(): array
    {
        // Determine channel based on order status
        $channelName = match($this->model) {
            'order' => 'OrderNotificationChannel',
            'concession' => 'ConcessionNotificationChannel',
            default => 'NotificationChannel'
        };

        return [
            new Channel($channelName),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ActionResponse';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'type' => $this->type
        ];
    }
}
