<?php

namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

interface ConcessionsInterface
{
    public function getAll(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    public function createConcession(
        array $data,
        ?UploadedFile $image = null
    );

}
