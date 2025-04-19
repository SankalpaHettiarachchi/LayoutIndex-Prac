<?php

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ConcessionsInterface
{
    public function getAll(array $filters = [], int $perPage = 10): LengthAwarePaginator;
}
