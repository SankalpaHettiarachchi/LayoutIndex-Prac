<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'send_to_kitchen_at',
        'status',
        'created_by'
    ];

    protected $casts = [
        'id' => 'string', // For UUID
        'send_to_kitchen_at' => 'datetime',
        'status' => 'string'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in-progress';
    public const STATUS_COMPLETED = 'completed';

    // Relationship to creator
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relationship to concessions
    public function concessions(): BelongsToMany
    {
        return $this->belongsToMany(Concession::class, 'concession_order')
            ->withPivot(['quantity', 'unit_price'])
            ->withTimestamps();
    }

    // Helper methods
    public function markAsInProgress()
    {
        $this->update([
            'status' => self::STATUS_IN_PROGRESS,
            'send_to_kitchen_at' => now()
        ]);
    }

    public function markAsCompleted()
    {
        $this->update(['status' => self::STATUS_COMPLETED]);
    }

    // Scope for status
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }
}
