<?php

namespace App\Http\Controllers;

use App\Interfaces\ConcessionsInterface;
use App\Models\Order;
use App\Repositories\OrdersRepository;
use Illuminate\Http\Request;
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
        return Inertia::render('Orders/createOrder');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
}
