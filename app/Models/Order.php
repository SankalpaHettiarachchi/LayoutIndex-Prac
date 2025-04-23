<?php

namespace App\Models;

use App\Casts\FormattedDateTimeCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'order';

    protected $fillable = [
        'order_no',
        'send_to_kitchen_at',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'id' => 'string',
        'send_to_kitchen_at' => FormattedDateTimeCast::class,
        'status' => 'string',
        'created_at' => FormattedDateTimeCast::class,
        'updated_at' => FormattedDateTimeCast::class,
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

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Helper methods
    public function markAsInProgress()
    {
        $this->update([
            'status' => self::STATUS_IN_PROGRESS,
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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
        });
    }

    // Relationship to concessions
    public function concessions(): BelongsToMany
    {
        return $this->belongsToMany(Concession::class, 'concession_order')
            ->withPivot(['quantity', 'unit_price'])
            ->withTimestamps();
    }

    public function getTotalAttribute()
    {
        $total = $this->concessions->sum(function ($concession) {
            return $concession->pivot->quantity * $concession->pivot->unit_price;
        });

        return number_format($total, 2);
    }
}
