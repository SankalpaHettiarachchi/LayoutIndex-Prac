<?php

namespace App\Casts;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class FormattedDateTimeCast implements CastsAttributes
{
    public function get($model, $key, $value, $attributes)
    {
        return $value ? Carbon::parse($value)->format('M d, Y h:i A') : null;
    }

    public function set($model, $key, $value, $attributes)
    {
        return $value;
    }
}
