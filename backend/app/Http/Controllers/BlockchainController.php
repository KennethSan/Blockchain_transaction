<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Services\BlockchainService;
use Illuminate\Http\Request;

class BlockchainController extends Controller
{
    protected BlockchainService $blockchainService;

    public function __construct(BlockchainService $blockchainService)
    {
        $this->blockchainService = $blockchainService;
    }

    /**
     * Mine a new block
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function mine()
    {
        try {
            $block = $this->blockchainService->mineBlock();

            return response()->json([
                'success' => true,
                'message' => 'Block mined successfully',
                'data' => $block->load('transactions')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Mining failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all blocks
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $blocks = Block::with('transactions')
                ->orderBy('index_no', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $blocks,
                'count' => $blocks->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch blocks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate blockchain
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function validate()
    {
        try {
            $isValid = $this->blockchainService->validateChain();

            return response()->json([
                'success' => true,
                'is_valid' => $isValid,
                'message' => $isValid 
                    ? 'Blockchain is valid' 
                    : 'Blockchain validation failed'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get blockchain statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        try {
            $stats = $this->blockchainService->getStatistics();

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
