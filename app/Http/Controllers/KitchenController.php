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

        return Inertia::render('Kitchen/Index', [
            'orders' => $this->kitchenInterface->getAll($filters, $filters['status'] ?? OrderStatusEnum::IN_PROGRESS,$filters['per_page'] ?? 5),
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
