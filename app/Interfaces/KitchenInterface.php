<?php

namespace App\Interfaces;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\Rules\Enum;

interface KitchenInterface
{
    public function getAll(array $filters = [],OrderStatusEnum $status = OrderStatusEnum::IN_PROGRESS, int $perPage = 10): LengthAwarePaginator;
    public function getOrder(string $id): Order;
}
