<?php

namespace App\Interfaces;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface KithchenInterface
{
    public function getAll(array $filters = [], int $perPage = 10): LengthAwarePaginator;
    public function createOrder(array $orderData, array $concessions): Order;
    public function getOrder(string $id): Order;
    public function deleteOrder(string $id): bool;
}
