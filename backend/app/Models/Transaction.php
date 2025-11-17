<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sender',
        'receiver',
        'amount',
        'timestamp',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'timestamp' => 'datetime',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the blocks that include this transaction.
     */
    public function blocks(): BelongsToMany
    {
        return $this->belongsToMany(Block::class, 'block_transactions');
    }

    /**
     * Scope a query to only include pending transactions.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include mined transactions.
     */
    public function scopeMined($query)
    {
        return $query->where('status', 'mined');
    }
}
