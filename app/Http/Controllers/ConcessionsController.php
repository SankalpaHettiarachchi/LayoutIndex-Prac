<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConcessionRequest;
use App\Http\Requests\UpdateConcessionRequest;
use App\Interfaces\ConcessionsInterface;
use App\Models\Concession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConcessionsController extends Controller
{
    public function __construct(
        protected ConcessionsInterface $concessionRepository
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page', 'sort', 'direction']);

        return Inertia::render('Concessions/Index', [
            'concessions' => $this->concessionRepository->getAll($filters, $filters['per_page'] ?? 5),
            'filters' => $filters
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Concessions/createConcession');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreConcessionRequest $request)
    {
        $validated = $request->validated();

        $this->concessionRepository->createConcession(
            $validated,
            $request->file('image_path')
        );

        return redirect()->route('concessions.index')
            ->with('success', 'Concession created successfully!');
    }

    /**
     * Display the specified resource.
     */
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
                'created_at' => $concession->created_at->format('M d, Y h:i A'),
                'updated_at' => $concession->updated_at->format('M d, Y h:i A'),
                'created_by' => $concession->creator ? $concession->creator->name : null,
                'updated_by' => $concession->updater ? $concession->updater->name : null,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Concession $concession)
    {
        return Inertia::render('Concessions/editConcession', [
            'concession' => $concession,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConcessionRequest $request, Concession $concession)
    {
        $validated = $request->validated();
        $this->concessionRepository->updateConcession(
            $concession->id,
            $validated,
            $request->file('image_path')
        );

        return redirect()->route('concessions.index')
            ->with('success', 'Concession updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Concession $concession)
    {
        $this->concessionRepository->deleteConcession($concession->id);

        return redirect()->route('concessions.index')
            ->with('success', 'Concession deleted successfully');
    }
}
