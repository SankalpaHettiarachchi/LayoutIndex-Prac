<?php

namespace App\Interfaces;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface KitchenInterface
{
    public function getAll(array $filters = [],string $status = 'in-progress', int $perPage = 10): LengthAwarePaginator;
    public function getOrder(string $id): Order;
}
