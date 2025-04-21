<?php

namespace App\Http\Controllers;

use App\Events\OrderReceivedEvent;
use App\Http\Requests\StoreOrderRequest;
use App\Interfaces\ConcessionsInterface;
use App\Models\Concession;
use App\Models\ConcessionOrder;
use App\Models\Order;
use App\Repositories\OrdersRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrdersController extends Controller
{
    public function __construct(
        protected OrdersRepository $orderRepository,
        protected ConcessionsInterface $concessionsInterface
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page', 'sort', 'direction']);

        return Inertia::render('Orders/Index', [
            'orders' => $this->orderRepository->getAll($filters, $filters['per_page'] ?? 5),
            'filters' => $filters
        ]);
    }

    public function create()
    {
        return Inertia::render('Orders/createOrder');
    }


    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        $order = $this->orderRepository->createOrder(
            $validated,
            $validated['concessions']
        );

        return redirect()->route('orders.index')
            ->with('success', 'Order created successfully');
    }

    public function show(Order $order)
    {
        $orderWithDetails = $this->orderRepository->getOrder($order->id);

        return inertia('Orders/viewOrder', [
            'order' => $orderWithDetails,
        ]);
    }

    public function destroy(Order $order)
    {
        //
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

//    public function loadConcessions()
//    {
//        $perPage = request('per_page', 5);
//
//        $concessions = Concession::query()
//            ->when(request('search'), function($query, $search) {
//                $query->where('name', 'like', "%{$search}%");
//            })
//            ->paginate($perPage);
//
//        return response()->json($concessions);
//    }

    public function send(Order $order)
    {
        // Make sure to load any relationships you need
//        $order->load(['concessions', 'user']);

        event(new OrderReceivedEvent($order));

//        return response()->json(['message' => 'Order sent']);
    }
}
