<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Str;

class ConcessionOrder extends Pivot
{
    protected $table = 'concession_order';

    protected $casts = [
        'id' => 'string', // For UUID
        'unit_price' => 'decimal:2',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'order_id',
        'concession_id',
        'quantity',
        'unit_price'
    ];

    // Accessor for total price
    public function getTotalAttribute()
    {
        return $this->quantity * $this->unit_price;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
        });
    }
}
