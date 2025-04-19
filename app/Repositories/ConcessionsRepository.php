<?php

namespace App\Repositories;

use App\Interfaces\ConcessionsInterface;
use App\Models\Concession;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ConcessionsRepository implements ConcessionsInterface
{
    public function __construct(protected Concession $model) {}

    public function getAll(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy(
                $filters['sort'] ?? 'id',
                $filters['direction'] ?? 'asc'
            )
            ->paginate($perPage);
    }
}
