<?php

namespace App\Services;

use App\Models\LlmRecommendation;
use App\Models\Perkara;
use App\Models\Regulation;
use App\Services\Llm\GeminiClient;
use Illuminate\Support\Facades\Log;

class LegalReferenceService
{
    public function __construct(private readonly GeminiClient $gemini)
    {
    }

    public function generateForPerkara(int $perkaraId, ?int $documentId = null): void
    {
        $perkara = Perkara::with(['documents', 'recommendations'])->find($perkaraId);

        if (! $perkara) {
            return;
        }

        $document = $documentId ? $perkara->documents->firstWhere('id', $documentId) : $perkara->documents->first();

        $text = $document?->teks_ocr;

        if (! $text) {
            return;
        }

        $candidates = Regulation::where('kategori_perkara', $perkara->jenis_perkara?->value)
            ->limit(20)
            ->get()
            ->map(fn ($reg) => "{$reg->nama_undang} Pasal {$reg->pasal} : {$reg->isi_pasal}")
            ->implode("\n\n");

        $prompt = "Teks putusan:\n{$text}\n\nDaftar regulasi kandidat:\n{$candidates}\n\nKembalikan JSON {\"articles\":[{\"nama\":...,\"pasal\":...,\"alasan\":...}]}";

        $response = $this->gemini->legalReference($prompt);
        $articles = $this->extractArticles($response);

        if (empty($articles)) {
            Log::warning('Gemini tidak mengembalikan daftar pasal', [
                'perkara_id' => $perkara->id,
                'document_id' => $document?->id,
                'response_keys' => array_keys($response ?? []),
            ]);
            return;
        }

        LlmRecommendation::create([
            'perkara_id' => $perkara->id,
            'document_id' => $document?->id,
            'daftar_pasal' => $articles,
            'pertimbangan_llm' => $response['reasoning'] ?? null,
            'meta' => [
                'model' => config('services.gemini.model'),
            ],
        ]);
    }

    protected function extractArticles(?array $response): array
    {
        if (empty($response)) {
            return [];
        }

        if (! empty($response['articles']) && is_array($response['articles'])) {
            return $response['articles'];
        }

        if (isset($response['summary']) && is_string($response['summary'])) {
            $decoded = json_decode($response['summary'], true);

            if (json_last_error() === JSON_ERROR_NONE && ! empty($decoded['articles'])) {
                return $decoded['articles'];
            }
        }

        return [];
    }
}
