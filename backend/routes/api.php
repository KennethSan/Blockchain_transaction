<?php

use App\Http\Controllers\BlockchainController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

// Transaction routes
Route::post('/transaction', [TransactionController::class, 'store']);
Route::get('/transactions/pending', [TransactionController::class, 'getPending']);
Route::get('/transactions', [TransactionController::class, 'index']);

// Blockchain routes
Route::post('/block/mine', [BlockchainController::class, 'mine']);
Route::get('/blocks', [BlockchainController::class, 'index']);
Route::get('/blockchain/validate', [BlockchainController::class, 'validate']);
Route::get('/blockchain/statistics', [BlockchainController::class, 'statistics']);
