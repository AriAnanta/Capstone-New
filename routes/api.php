<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\LegalAdvisorController;
use App\Http\Controllers\PerkaraController;
use App\Http\Controllers\PublicDecisionController;
use App\Http\Controllers\RegulationController;
use App\Http\Controllers\SummaryController;

Route::get('public/putusan', [PublicDecisionController::class, 'index']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

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

