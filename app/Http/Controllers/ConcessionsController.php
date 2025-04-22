<?php

namespace App\Http\Controllers;

use App\Events\NotificationEvent;
use App\Http\Requests\StoreConcessionRequest;
use App\Http\Requests\UpdateConcessionRequest;
use App\Interfaces\ConcessionsInterface;
use App\Models\Concession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConcessionsController extends Controller
{
    public function __construct(
        protected ConcessionsInterface $concessionsInterface
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page', 'sort', 'direction']);

        return Inertia::render('Concessions/Index', [
            'concessions' => $this->concessionsInterface->getAll($filters, $filters['per_page'] ?? 5),
            'filters' => $filters
        ]);
    }

    public function create()
    {
        return Inertia::render('Concessions/createConcession');
    }

    public function store(StoreConcessionRequest $request)
    {
        try {
            $validated = $request->validated();

            $this->concessionsInterface->createConcession(
                $validated,
                $request->file('image_path')
            );

            event(new NotificationEvent('Concession created successfully!', 'success','concession'));

        } catch (\Exception $e) {
            event(new NotificationEvent('Failed to create concession: ' . $e->getMessage(), 'error','concession'));

            return back()->withInput();
        }
    }

    public function show(Concession $concession)
    {
        // Load the relationships
        $concession->load(['creator', 'updater']);

        return Inertia::render('Concessions/viewConcession', [
            'concession' => [
                'id' => $concession->id,
                'name' => $concession->name,
                'description' => $concession->description,
                'price' => $concession->price,
                'image_path' => $concession->image_path,
                'created_at' => $concession->created_at,
                'updated_at' => $concession->updated_at,
                'created_by' => $concession->creator ? $concession->creator->name : null,
                'updated_by' => $concession->updater ? $concession->updater->name : null,
            ],
        ]);
    }

    public function edit(Concession $concession)
    {
        return Inertia::render('Concessions/editConcession', [
            'concession' => $concession,
        ]);
    }

    public function update(UpdateConcessionRequest $request, Concession $concession)
    {
        try {

            $validated = $request->validated();
            $this->concessionsInterface->updateConcession(
                $concession->id,
                $validated,
                $request->file('image_path')
            );

            event(new NotificationEvent('Concession updated successfully!', 'success','concession'));

        } catch (\Exception $e) {
            event(new NotificationEvent('Failed to update concession: ' . $e->getMessage(), 'error','concession'));

            return back()->withInput();
        }
    }
    public function destroy(Concession $concession)
    {
        try {

            $this->concessionsInterface->deleteConcession($concession->id);

            event(new NotificationEvent('Concession deleted successfully!', 'success','concession'));

        } catch (\Exception $e) {
            event(new NotificationEvent('Failed to delete concession: ' . $e->getMessage(), 'error','concession'));

            return back()->withInput();
        }
    }
}
