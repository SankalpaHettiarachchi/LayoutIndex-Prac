<?php

namespace App\Repositories;

use App\Interfaces\ConcessionsInterface;
use App\Models\Concession;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

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

    public function createConcession(array $data, ?UploadedFile $image = null)
    {
        if ($image) {
            $data['image_path'] = $this->processAndStoreImage($image);
        }

        return $this->model->create($data);
    }

    public function deleteConcession(string $id): bool
    {
        $concession = $this->model->findOrFail($id);

        // Delete associated image if exists
        if ($concession->image_path && $concession->image_path !== 'concessions/default.webp') {
            Storage::disk('public')->delete($concession->image_path);
        }

        return $concession->delete();
    }

    public function updateConcession(string $id, array $data, ?UploadedFile $image = null): Concession
    {
        $concession = $this->model->findOrFail($id);

        if ($image) {
            // Delete old image if exists
            if ($concession->image_path && $concession->image_path !== 'concessions/default.webp') {
                Storage::disk('public')->delete($concession->image_path);
            }

            // Process and store new image
            $data['image_path'] = $this->processAndStoreImage($image);
        }else{
            $data['image_path'] = $concession->image_path;
        }

        $concession->update($data);

        return $concession;
    }

    protected function processAndStoreImage(UploadedFile $image): string
    {
        // Initialize ImageManager with driver
        $manager = new ImageManager(new Driver());

        // Read the uploaded file
        $img = $manager->read($image->getRealPath());

        // Resize with aspect ratio preservation
        $img->resize(800, 600, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        // Generate unique filename and path
        $filename = 'concession_'.Str::uuid().'.webp';
        $path = 'concessions/'.$filename;

        // Store in public disk as WebP
        Storage::disk('public')->put($path, $img->toWebp(80));

        return $path;
    }
}
