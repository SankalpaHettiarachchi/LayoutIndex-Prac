<?php

namespace App\Observers;

use App\Models\Concession;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ConcessionObserver
{
    public function creating(Concession $concession): void
    {
        if (Auth::check()) {
            $concession->created_by = Auth::id();
        }
    }

    public function updating(Concession $concession): void
    {
        if (Auth::check()) {
            $concession->updated_by = Auth::id();
        }
    }
}
