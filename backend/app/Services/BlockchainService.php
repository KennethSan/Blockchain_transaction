<?php

namespace App\Services;

use App\Models\Block;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BlockchainService
{
    /**
     * Mining difficulty - hash must start with this many zeros
     */
    private const DIFFICULTY = 2;

    /**
     * Generate SHA256 hash from block data
     *
     * @param array $blockData
     * @return string
     */
    public function generateHash(array $blockData): string
    {
        $dataString = json_encode($blockData);
        return hash('sha256', $dataString);
    }

    /**
     * Validate the entire blockchain
     *
     * @return bool
     */
    public function validateChain(): bool
    {
        $blocks = Block::with('transactions')->orderBy('index_no')->get();

        if ($blocks->isEmpty()) {
            return true; // Empty chain is valid
        }

        // Check first block (genesis block)
        $firstBlock = $blocks->first();
        if ($firstBlock->previous_hash !== '0') {
            Log::error('Genesis block has invalid previous hash');
            return false;
        }

        // Validate each block
        foreach ($blocks as $block) {
            // Verify current hash
            $calculatedHash = $this->generateHash($block->getDataForHash());
            if ($calculatedHash !== $block->current_hash) {
                Log::error("Block {$block->index_no} hash mismatch");
                return false;
            }

            // Verify proof of work
            if (!$this->isValidProofOfWork($block->current_hash)) {
                Log::error("Block {$block->index_no} fails proof of work");
                return false;
            }
        }

        // Validate chain links
        for ($i = 1; $i < $blocks->count(); $i++) {
            $previousBlock = $blocks[$i - 1];
            $currentBlock = $blocks[$i];

            if ($currentBlock->previous_hash !== $previousBlock->current_hash) {
                Log::error("Block {$currentBlock->index_no} has invalid previous hash link");
                return false;
            }

            if ($currentBlock->index_no !== $previousBlock->index_no + 1) {
                Log::error("Block {$currentBlock->index_no} has invalid index");
                return false;
            }
        }

        return true;
    }

    /**
     * Mine a new block from pending transactions
     *
     * @return Block
     * @throws \Exception
     */
    public function mineBlock(): Block
    {
        // Get pending transactions
        $pendingTransactions = Transaction::pending()->get();

        if ($pendingTransactions->isEmpty()) {
            throw new \Exception('No pending transactions to mine');
        }

        DB::beginTransaction();
        try {
            // Get previous block
            $lastBlock = Block::orderBy('index_no', 'desc')->first();
            $previousHash = $lastBlock ? $lastBlock->current_hash : '0';
            $indexNo = $lastBlock ? $lastBlock->index_no + 1 : 0;

            $timestamp = now();

            // Prepare block data before persistence
            $block = new Block([
                'index_no' => $indexNo,
                'previous_hash' => $previousHash,
                'timestamp' => $timestamp,
                'nonce' => 0,
            ]);

            // Ensure transactions are available for hashing
            $block->setRelation('transactions', $pendingTransactions);

            // Perform proof of work
            Log::info("Starting mining for block {$indexNo}...");
            $nonce = 0;
            $hash = '';

            while (true) {
                $block->nonce = $nonce;
                $blockData = $block->getDataForHash();
                $hash = $this->generateHash($blockData);

                if ($nonce % 10000 === 0) {
                    Log::info("Mining... nonce: {$nonce}, hash: {$hash}");
                }

                if ($this->isValidProofOfWork($hash)) {
                    break;
                }

                $nonce++;
            }

            $block->current_hash = $hash;

            // Persist block with final hash and nonce
            $block->save();
            $block->transactions()->attach($pendingTransactions->pluck('id'));

            // Update transactions to mined status
            $pendingTransactions->each(function ($transaction) {
                $transaction->update(['status' => 'mined']);
            });

            DB::commit();
            Log::info("Block {$indexNo} mined successfully! Hash: {$hash}, Nonce: {$block->nonce}");

            return $block->load('transactions');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Mining failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Check if hash meets proof of work requirements
     *
     * @param string $hash
     * @return bool
     */
    private function isValidProofOfWork(string $hash): bool
    {
        $prefix = str_repeat('0', self::DIFFICULTY);
        return str_starts_with($hash, $prefix);
    }

    /**
     * Get blockchain statistics
     *
     * @return array
     */
    public function getStatistics(): array
    {
        return [
            'total_blocks' => Block::count(),
            'total_transactions' => Transaction::count(),
            'pending_transactions' => Transaction::pending()->count(),
            'mined_transactions' => Transaction::mined()->count(),
            'is_valid' => $this->validateChain(),
        ];
    }
}
