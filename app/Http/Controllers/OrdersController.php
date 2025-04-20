<?php

namespace App\Http\Controllers;

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
        protected OrdersRepository $orderRepository
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page', 'sort', 'direction']);

        return Inertia::render('Orders/Index', [
            'orders' => $this->orderRepository->getAll($filters, $filters['per_page'] ?? 5),
            'filters' => $filters
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $concessions = Concession::query()
            ->paginate(10); // Adjust pagination as needed

        return Inertia::render('Orders/createOrder', [
            'concessions' => $concessions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'send_to_kitchen_at' => ['required', 'date'],
            'concessions' => ['required', 'array', 'min:1'],
            'concessions.*.id' => ['required', 'exists:concession,id'],
            'concessions.*.quantity' => ['required', 'integer', 'min:1'],
            'concessions.*.price' => ['required', 'numeric', 'min:0'],
        ]);

        // Calculate total price
        $totalPrice = collect($validated['concessions'])->sum(function ($item) {
            return $item['price'] * $item['quantity'];
        });

        // Create the order
        $order = Order::create([
            'user_id' => auth()->id(),
            'total_price' => $totalPrice,
            'status' => 'pending',
            'send_to_kitchen_at' => $validated['send_to_kitchen_at'],
        ]);

        // Create concession orders using create method
        foreach ($validated['concessions'] as $concession) {
            ConcessionOrder::create([
                'order_id' => $order->id,
                'concession_id' => $concession['id'],
                'quantity' => $concession['quantity'],
                'unit_price' => $concession['price']
            ]);
        }

        return redirect()->route('orders.index')->with('success', 'Order created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }

    public function loadConcessions()
    {
        $perPage = request('per_page', 5); // Default to 5 items per page

        $concessions = Concession::query()
            ->when(request('search'), function($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate($perPage);

        return response()->json($concessions);
    }
}
