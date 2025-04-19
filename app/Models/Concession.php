<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Concession extends Model
{
    use HasFactory;

    protected $table = 'concession'; // Explicit table name

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'price',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'id' => 'string',       // UUID as string
        'price' => 'decimal:2', // Proper decimal handling
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relationship to creator (user)
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Relationship with orders (through pivot)
    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'concession_order')
            ->withPivot(['quantity', 'unit_price'])
            ->withTimestamps();
    }
}
