<?php

namespace App\Services\Summarization;

use App\Enums\SummaryType;
use App\Models\Document;
use App\Models\Summary;
use App\Services\Llm\GeminiClient;
use Illuminate\Support\Arr;

class SummarizerService
{
    public function __construct(private readonly GeminiClient $gemini)
    {
    }

    public function summarizeDocument(Document $document): void
    {
        $text = $document->teks_ocr ?? $this->loadFallbackText($document);

        if (! $text) {
            return;
        }

        foreach (SummaryType::cases() as $type) {
            $response = $this->gemini->summarize($text, [
                'jenis_perkara' => $document->perkara?->jenis_perkara?->value,
                'tipe_ringkasan' => $type->value,
            ]);

            if (empty($response['summary'])) {
                continue;
            }

            Summary::updateOrCreate([
                'document_id' => $document->id,
                'tipe_ringkasan' => $type,
            ], [
                'ringkasan' => $response['summary'],
                'meta' => Arr::except($response, ['summary']),
                'created_via' => 'llm',
            ]);
        }
    }

    protected function loadFallbackText(Document $document): ?string
    {
        $path = storage_path('app/' . $document->path_file);

        if (! file_exists($path)) {
            return null;
        }

        if (str_contains($document->format_file, 'text')) {
            return file_get_contents($path) ?: null;
        }

        return null;
    }
}
