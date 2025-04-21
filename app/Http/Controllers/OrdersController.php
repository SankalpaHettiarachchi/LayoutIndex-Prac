<?php

namespace App\Http\Controllers;

use App\Events\NotificationEvent;
use App\Events\OrderReceivedEvent;
use App\Http\Requests\StoreOrderRequest;
use App\Interfaces\ConcessionsInterface;
use App\Interfaces\OrdersInterface;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrdersController extends Controller
{
    public function __construct(
        protected OrdersInterface $ordersInterface,
        protected ConcessionsInterface $concessionsInterface
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page', 'sort', 'direction']);

        return Inertia::render('Orders/Index', [
            'orders' => $this->ordersInterface->getAll($filters, $filters['per_page'] ?? 5),
            'filters' => $filters
        ]);
    }

    public function create()
    {
        return Inertia::render('Orders/createOrder');
    }


    public function store(StoreOrderRequest $request)
    {
        try {
            $validated = $request->validated();

            $validated = $request->validated();

            $this->ordersInterface->createOrder(
                $validated,
                $validated['concessions']
            );

            event(new NotificationEvent('Order created successfully!', 'success'));

        } catch (\Exception $e) {
            dd($e->getMessage());
            event(new NotificationEvent('Failed to create order: ' . $e->getMessage(), 'error'));

            return back()->withInput();
        }
    }

    public function show(Order $order)
    {
        $orderWithDetails = $this->ordersInterface->getOrder($order->id);

        return inertia('Orders/viewOrder', [
            'order' => $orderWithDetails,
        ]);
    }

    public function destroy(Order $order)
    {
        try {

            $this->ordersInterface->deleteOrder($order->id);

            event(new NotificationEvent('Order deleted successfully!', 'success'));

        } catch (\Exception $e) {
            event(new NotificationEvent('Failed to delete order: ' . $e->getMessage(), 'error'));

            return back()->withInput();
        }
    }

    public function loadConcessions()
    {
        $perPage = request('per_page', 5);
        $search = request('search');

        $concessions = $this->concessionsInterface->getConcessions(
            $search,
            $perPage
        );

        return response()->json($concessions);
    }

    public function send(Order $order)
    {
        // Make sure to load any relationships you need
//        $order->load(['concessions', 'user']);

        event(new OrderReceivedEvent($order));

//        return response()->json(['message' => 'Order sent']);
    }
}
