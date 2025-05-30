<?php

namespace App\Repositories;

use App\Interfaces\OrdersInterface;
use App\Jobs\SendOrderToKitchen;
use App\Models\ConcessionOrder;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OrdersRepository implements OrdersInterface
{
    public function __construct(protected Order $model) {}

    public function getAll(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $orders = $this->model->query()
            ->with(['concessions' => function ($query) {
                $query->select('concession.*')
                    ->withPivot(['quantity', 'unit_price']);
            }])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('send_to_kitchen_at', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhere('order_no', 'like', "%{$search}%");
                });
            })
            ->orderBy(
                $filters['sort'] ?? 'send_to_kitchen_at',
                $filters['direction'] ?? 'asc'
            )
            ->orderBy(
                $filters['sort'] ?? 'order_no',
                $filters['direction'] ?? 'asc'
            )
            ->paginate($perPage);

        // Calculate and append totals to each order
        $orders->getCollection()->transform(function ($order) {
            $order->total = $order->concessions->sum(function ($concession) {
                return $concession->pivot->quantity * $concession->pivot->unit_price;
            });
            return $order;
        });

        return $orders;
    }

    public function createOrder(array $orderData, array $concessions): Order
    {
        // Create the order (same as original)
        $order = Order::create([
            'send_to_kitchen_at' => $orderData['send_to_kitchen_at'],
        ]);

        // Create concession orders one by one (same as original)
        foreach ($concessions as $concession) {
            ConcessionOrder::create([
                'order_id' => $order->id,
                'concession_id' => $concession['id'],
                'quantity' => $concession['quantity'],
                'unit_price' => $concession['price']
            ]);
        }

        SendOrderToKitchen::dispatch($order)->delay(Carbon::parse($order->send_to_kitchen_at));

        return $order;
    }

    public function getOrder(string $id): Order
    {
        return $this->model->with([
            'concessions' => function ($query) {
                $query->select('concession.*')
                    ->withPivot(['quantity', 'unit_price']);
            },
            'creator',
            'updater'
        ])
            ->findOrFail($id);
    }

    public function deleteOrder(string $id): bool
    {
        $order = $this->model->findOrFail($id);

        return $order->delete();
    }
}
