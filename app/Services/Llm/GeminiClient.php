<?php

namespace App\Services\Llm;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiClient
{
    public function summarize(string $content, array $context = []): array
    {
        $prompt = $this->buildPrompt($content, $context);

        $response = $this->callGemini($prompt, $context['tipe_ringkasan'] ?? 'umum');

        return [
            'summary' => $response['summary'] ?? null,
            'reasoning' => $response['reasoning'] ?? null,
            'confidence' => $response['confidence'] ?? null,
        ];
    }

    public function legalReference(string $content, array $options = []): array
    {
        $prompt = "Identifikasi daftar pasal yang relevan dari teks berikut dan berikan alasan ringkas:\n" . $content;

        return $this->callGemini($prompt, 'legal_reference');
    }

    protected function callGemini(string $prompt, string $taskType): array
    {
        $model = config('services.gemini.model', 'gemini-1.5-flash');
        $apiKey = config('services.gemini.key');

        if (! $apiKey) {
            Log::warning('Gemini API key belum diatur');
            return [];
        }

        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

        $response = Http::retry(2, 500)
            ->post($endpoint, [
                'contents' => [[
                    'parts' => [[
                        'text' => $prompt,
                    ]],
                ]],
                'safetySettings' => config('services.gemini.safety', []),
            ]);

        if (! $response->successful()) {
            Log::error('Gemini API error', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            return [];
        }

        $data = $response->json();
        $text = Arr::get($data, 'candidates.0.content.parts.0.text');

        if (! $text) {
            return [];
        }

        $decoded = json_decode($text, true);

        return is_array($decoded) ? $decoded : ['summary' => $text];
    }

    protected function buildPrompt(string $content, array $context): string
    {
        $type = $context['tipe_ringkasan'] ?? 'umum';
        $jenis = $context['jenis_perkara'] ?? 'umum';

        return <<<PROMPT
Anda adalah asisten hukum Pengadilan Tinggi Agama. Buat ringkasan bergaya {$type} untuk perkara jenis {$jenis}.
Ringkas dengan struktur JSON {"summary":"...","reasoning":"...","confidence":0-1}
Teks sumber:
{$content}
PROMPT;
    }
}
