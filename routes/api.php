<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\LegalAdvisorController;
use App\Http\Controllers\OcrOnlyController;
use App\Http\Controllers\PerkaraController;
use App\Http\Controllers\PublicDecisionController;
use App\Http\Controllers\RegulationController;
use App\Http\Controllers\SummaryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SearchController;

Route::get('public/putusan', [PublicDecisionController::class, 'index']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    // User profile routes
    Route::put('user/profile', [UserController::class, 'updateProfile']);
    Route::put('user/password', [UserController::class, 'updatePassword']);

    Route::middleware(['role:panitera'])->prefix('search')->group(function () {
        Route::get('/', [SearchController::class, 'search']);
        Route::get('/suggestions', [SearchController::class, 'suggestions']);
        Route::get('/history', [SearchController::class, 'history']);
        Route::get('/filter-options', [SearchController::class, 'filterOptions']);
    });

    // OCR-only routes (khusus panitera)
    Route::middleware(['role:panitera'])->prefix('ocr-only')->group(function () {
        Route::get('/', [OcrOnlyController::class, 'index']);
        Route::post('/', [OcrOnlyController::class, 'store']);
        Route::get('/{id}', [OcrOnlyController::class, 'show']);
        Route::delete('/{id}', [OcrOnlyController::class, 'destroy']);
        Route::post('/{id}/reprocess', [OcrOnlyController::class, 'reprocess']);
        Route::get('/{id}/download', [OcrOnlyController::class, 'download']);
    });

    Route::middleware('role:panitera,hakim')->group(function () {
        Route::apiResource('perkaras', PerkaraController::class);

        Route::apiResource('documents', DocumentController::class);
        Route::get('documents/{document}/download', [DocumentController::class, 'download']);
        Route::get('documents/{document}/summaries', [SummaryController::class, 'index']);
        Route::post('documents/{document}/summaries', [SummaryController::class, 'store']);

        Route::apiResource('regulations', RegulationController::class)->except(['show']);
    });

    // Legal Advisor routes (khusus hakim)
    Route::middleware('role:hakim')->prefix('legal-advisor')->group(function () {
        Route::get('case-types', [LegalAdvisorController::class, 'caseTypes']);
        Route::post('recommendations', [LegalAdvisorController::class, 'recommendations']);
        Route::get('perkara/{perkaraId}', [LegalAdvisorController::class, 'forCase']);
        Route::post('analyze', [LegalAdvisorController::class, 'analyze']);
    });
});

