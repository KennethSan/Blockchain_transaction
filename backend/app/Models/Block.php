<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Block extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'index_no',
        'previous_hash',
        'current_hash',
        'nonce',
        'timestamp',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'timestamp' => 'datetime',
        'nonce' => 'integer',
        'index_no' => 'integer',
    ];

    /**
     * Get the transactions included in this block.
     */
    public function transactions(): BelongsToMany
    {
        return $this->belongsToMany(Transaction::class, 'block_transactions');
    }

    /**
     * Get block data as array for hashing.
     */
    public function getDataForHash(): array
    {
        return [
            'index_no' => $this->index_no,
            'previous_hash' => $this->previous_hash,
            'timestamp' => $this->timestamp->timestamp,
            'transactions' => $this->transactions->map(fn($t) => [
                'sender' => $t->sender,
                'receiver' => $t->receiver,
                'amount' => $t->amount,
            ])->toArray(),
            'nonce' => $this->nonce,
        ];
    }
}
