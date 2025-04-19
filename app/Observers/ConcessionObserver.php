<?php

namespace App\Observers;

use App\Models\Concession;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ConcessionObserver
{
    /**
     * Handle the Concession "created" event.
     */
    public function creating(Concession $concession): void
    {
        if (Auth::check()) {
            $concession->created_by = Auth::id();
        }
    }

    /**
     * Handle the Concession "updated" event.
     */
    public function updating(Concession $concession): void
    {
        if (Auth::check()) {
            $concession->updated_by = Auth::id();
        }
    }

    /**
     * Handle the Concession "deleted" event.
     */
    public function deleted(Concession $concession): void
    {
        //
    }

    /**
     * Handle the Concession "restored" event.
     */
    public function restored(Concession $concession): void
    {
        //
    }

    /**
     * Handle the Concession "force deleted" event.
     */
    public function forceDeleted(Concession $concession): void
    {
        //
    }
}
