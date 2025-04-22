<?php

namespace App\Http\Controllers;

use App\Events\NotificationEvent;
use App\Events\OrderReceivedEvent;
use App\Interfaces\ConcessionsInterface;
use App\Interfaces\KithchenInterface;
use App\Interfaces\OrdersInterface;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KitchenController extends Controller
{
    public function __construct(
        protected KithchenInterface $kitchenInterface,
        protected ConcessionsInterface $concessionsInterface
    ) {}
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page', 'sort', 'direction','status']);

        return Inertia::render('Kitchen/Index', [
            'orders' => $this->kitchenInterface->getAll($filters, $filters['per_page'] ?? 5),
            'filters' => $filters
        ]);
    }

    public function complete(Order $order)
    {
        try {
            $order->update([
                'status' => 'completed',
                'completed_at' => now() // Add this if you track completion time
            ]);

            event(new NotificationEvent('Order #'.$order->order_no.' completed', 'success'));
            return back();
        } catch (\Exception $e) {
            event(new NotificationEvent('Failed to complete order: '.$e->getMessage(), 'error'));
            return back()->withInput();
        }
    }
}
