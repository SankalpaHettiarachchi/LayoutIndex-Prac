<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Events\NotificationEvent;
use App\Events\OrderEvent;
use App\Interfaces\ConcessionsInterface;
use App\Interfaces\KitchenInterface;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KitchenController extends Controller
{
    // Implement repository via interface
    public function __construct(
        protected KitchenInterface $kitchenInterface,
        protected ConcessionsInterface $concessionsInterface
    ) {}
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page', 'sort', 'direction','status']);

        // Map string status to enum value
        $status = match ($filters['status'] ?? 'in-progress') {
            'completed' => OrderStatusEnum::COMPLETED,
            default => OrderStatusEnum::IN_PROGRESS,  // Default to 'in-progress'
        };

        dd($this->kitchenInterface->getAll($filters, $status,$filters['per_page'] ?? 5));

        return Inertia::render('Kitchen/Index', [
            'orders' => $this->kitchenInterface->getAll($filters, $status,$filters['per_page'] ?? 5),
            'filters' => $filters
        ]);
    }
    public function complete(Order $order)
    {
        $order->update([
            'status' => OrderStatusEnum::COMPLETED,
            'completed_at' => now() // Add this if you track completion time
        ]);

        event(new OrderEvent($order));
    }

    public function show(Order $order)
    {
        $orderWithDetails = $this->kitchenInterface->getOrder($order->id);

        return inertia('Kitchen/viewOrder', [
            'order' => $orderWithDetails,
        ]);
    }
}
