<?php

namespace App\Http\Controllers;

use App\Events\NotificationEvent;
use App\Events\OrderEvent;
use App\Interfaces\ConcessionsInterface;
use App\Interfaces\KitchenInterface;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KitchenController extends Controller
{
    public function __construct(
        protected KitchenInterface $kitchenInterface,
        protected ConcessionsInterface $concessionsInterface
    ) {}
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page', 'sort', 'direction','status']);

        return Inertia::render('Kitchen/Index', [
            'orders' => $this->kitchenInterface->getAll($filters, $filters['status'] ?? 'in-progress',$filters['per_page'] ?? 5),
            'filters' => $filters
        ]);
    }

    public function complete(Order $order)
    {
        $order->update([
            'status' => 'completed',
            'completed_at' => now() // Add this if you track completion time
        ]);

        event(new OrderEvent($order));
    }
}
