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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
