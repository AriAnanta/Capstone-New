<?php

namespace App\Services;

use App\Models\LlmRecommendation;
use App\Models\Perkara;
use App\Models\Regulation;
use App\Services\Llm\GeminiClient;

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

        if (empty($response['articles'])) {
            return;
        }

        LlmRecommendation::create([
            'perkara_id' => $perkara->id,
            'document_id' => $document?->id,
            'daftar_pasal' => $response['articles'],
            'pertimbangan_llm' => $response['reasoning'] ?? null,
            'meta' => [
                'model' => config('services.gemini.model'),
            ],
        ]);
    }
}
