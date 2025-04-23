<?php

namespace App\Models;

use App\Casts\FormattedDateTimeCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Concession extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'concession';

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'price',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'id' => 'string',
        'price' => 'decimal:2',
        'created_at' => FormattedDateTimeCast::class,
        'updated_at' => FormattedDateTimeCast::class,
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relationship to creator of concession (user)
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relationship to updated of concession (user)
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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
        });
    }

    // Ensure image path
    public function getImageUrlAttribute()
    {
        return $this->image_path
            ? Storage::disk('public')->url($this->image_path)
            : null;
    }
}
