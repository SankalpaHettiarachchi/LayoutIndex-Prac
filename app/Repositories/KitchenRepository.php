<?php

namespace App\Repositories;

use App\Enums\OrderStatusEnum;
use App\Interfaces\KitchenInterface;
use App\Jobs\SendOrderToKitchen;
use App\Models\ConcessionOrder;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class KitchenRepository implements KitchenInterface
{

    public function __construct(protected Order $model) {}

    public function getAll(array $filters = [],OrderStatusEnum $status = OrderStatusEnum::IN_PROGRESS, int $perPage = 5): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['concessions' => function ($query) {
                $query->select('concession.*')  // Use the correct table name here
                ->withPivot(['quantity', 'unit_price']);
            }]);

        // Status filter
        if (($filters['status'] ?? null) && $filters['status'] !== 'in-progress') {
            $query->where('status', $filters['status']);
        }else{
            $query->where('status', $status);
        }

        // Search functionality
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function($q) use ($search) {
                $q->where('order_no', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%")
                    ->orWhereHas('concessions', function($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        });

        // Sorting
        $sortField = $filters['sort'] ?? 'send_to_kitchen_at';
        $sortDirection = $filters['direction'] ?? 'desc';

        $query->orderBy($sortField, $sortDirection);

        $orders = $query->paginate($perPage);

        // Calculate and append totals to each order
        $orders->getCollection()->transform(function ($order) {
            $order->total = $order->concessions->sum(function ($concession) {
                return $concession->pivot->quantity * $concession->pivot->unit_price;
            });
            return $order;
        });

        return $orders;
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
}
