<?php

namespace App\Interfaces;

use App\Models\Concession;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

interface ConcessionsInterface
{
    public function getAll(array $filters = [], int $perPage = 10): LengthAwarePaginator;
    public function createConcession(array $data,?UploadedFile $image = null);
    public function deleteConcession(string $id): bool;
    public function updateConcession(string $id, array $data, ?UploadedFile $image = null): Concession;
}
