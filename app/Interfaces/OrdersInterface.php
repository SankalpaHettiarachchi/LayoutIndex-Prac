<?php

namespace App\Interfaces;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

interface OrdersInterface
{
    public function getAll(array $filters = [], int $perPage = 10): LengthAwarePaginator;
//    public function createConcession(array $data,?UploadedFile $image = null);
//    public function deleteConcession(string $id): bool;
//    public function updateConcession(string $id, array $data, ?UploadedFile $image = null): Order;
}
