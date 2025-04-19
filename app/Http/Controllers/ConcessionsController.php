<?php

namespace App\Http\Controllers;

use App\Models\Concession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConcessionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'asc');
        $search = $request->input('search');

        $query = Concession::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy($sortField, $sortDirection);

        $concessions = $query->paginate($perPage);

        return Inertia::render('Concessions/Index', [
            'concessions' => $concessions,
            'filters' => $request->only(['search', 'per_page', 'sort', 'direction'])
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
