<?php

namespace App\Http\Controllers;

use App\Enums\CaseType;
use App\Services\LegalAdvisorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class LegalAdvisorController extends Controller
{
    public function __construct(protected LegalAdvisorService $legalAdvisorService)
    {
    }

    /**
     * Dapatkan daftar jenis perkara yang tersedia
     */
    public function caseTypes(): JsonResponse
    {
        $caseTypes = $this->legalAdvisorService->getAvailableCaseTypes();

        return response()->json([
            'data' => $caseTypes,
        ]);
    }

    /**
     * Dapatkan rekomendasi pasal berdasarkan jenis perkara
     */
    public function recommendations(Request $request): JsonResponse
    {
        $request->validate([
            'jenis_perkara' => ['required', 'string', new Enum(CaseType::class)],
            'context' => ['nullable', 'string', 'max:5000'],
        ]);

        $caseType = CaseType::from($request->input('jenis_perkara'));
        $context = $request->input('context');

        $recommendations = $this->legalAdvisorService->getRecommendations($caseType, $context);

        return response()->json([
            'data' => $recommendations,
        ]);
    }

    /**
     * Dapatkan rekomendasi pasal untuk perkara spesifik
     */
    public function forCase(int $perkaraId): JsonResponse
    {
        $recommendations = $this->legalAdvisorService->getRecommendationsForCase($perkaraId);

        return response()->json([
            'data' => $recommendations,
        ]);
    }

    /**
     * Endpoint untuk mendapatkan rekomendasi dengan analisis LLM
     */
    public function analyze(Request $request): JsonResponse
    {
        $request->validate([
            'jenis_perkara' => ['required', 'string', new Enum(CaseType::class)],
            'kronologi' => ['required', 'string', 'min:50', 'max:10000'],
            'fakta_persidangan' => ['nullable', 'string', 'max:5000'],
            'tuntutan' => ['nullable', 'string', 'max:2000'],
        ]);

        $caseType = CaseType::from($request->input('jenis_perkara'));

        // Bangun konteks dari input
        $context = "KRONOLOGI PERKARA:\n" . $request->input('kronologi');

        if ($request->filled('fakta_persidangan')) {
            $context .= "\n\nFAKTA PERSIDANGAN:\n" . $request->input('fakta_persidangan');
        }

        if ($request->filled('tuntutan')) {
            $context .= "\n\nTUNTUTAN:\n" . $request->input('tuntutan');
        }

        $recommendations = $this->legalAdvisorService->getRecommendations($caseType, $context);

        return response()->json([
            'data' => $recommendations,
        ]);
    }
}
