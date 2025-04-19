<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ConcessionOrder extends Pivot
{
    protected $table = 'concession_order';

    protected $casts = [
        'id' => 'string', // For UUID
        'unit_price' => 'decimal:2',
    ];

    public $incrementing = true;
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
}
