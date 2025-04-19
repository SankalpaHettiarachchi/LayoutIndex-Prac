<?php

namespace App\Http\Controllers;

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
            'concessions' => $this->concessionRepository->getAll($filters, $filters['per_page'] ?? 10),
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ]);

        if ($request->hasFile('image_path')) {
            $validated['image_path'] = $request->file('image_path')->store('concessions', 'public');
        }

        // Just create - the observer will handle created_by
        Concession::create($validated);

        return redirect()->route('concessions.index')
            ->with('success', 'Concession created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Concession $concession)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Concession $concession)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Concession $concession)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Concession $concession)
    {
        //
    }
}
