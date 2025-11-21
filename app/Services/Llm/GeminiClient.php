<?php

namespace App\Services\Llm;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GeminiClient
{
    protected int $keyCursor = 0;

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
        $timeout = (int) config('services.gemini.timeout', 60);
        $apiKeys = $this->getApiKeys();

        if (empty($apiKeys)) {
            Log::warning('Gemini API key belum diatur');
            return [];
        }

        $attempted = [];
        $count = count($apiKeys);

        for ($offset = 0; $offset < $count; $offset++) {
            $keyIndex = ($this->keyCursor + $offset) % $count;
            $apiKey = $apiKeys[$keyIndex];
            $attempted[] = $keyIndex;

            try {
                $response = $this->sendRequest($model, $apiKey, $prompt, $timeout);

                if ($response->successful()) {
                    $this->keyCursor = ($keyIndex + 1) % $count;
                    return $this->extractPayload($response->json());
                }

                Log::warning('Gemini API gagal untuk key tertentu', [
                    'key_index' => $keyIndex,
                    'status' => $response->status(),
                    'body' => $response->json(),
                ]);
            } catch (ConnectionException $exception) {
                Log::warning('Gemini API timeout/connection error', [
                    'key_index' => $keyIndex,
                    'message' => $exception->getMessage(),
                ]);
            }
        }

        Log::error('Semua Gemini API key gagal dipakai', ['attempted_indexes' => $attempted]);

        return [];
    }

    protected function sendRequest(string $model, string $apiKey, string $prompt, int $timeout): Response
    {
        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

        return Http::timeout($timeout)
            ->retry(1, 500)
            ->post($endpoint, [
                'contents' => [[
                    'parts' => [[
                        'text' => $prompt,
                    ]],
                ]],
                'safetySettings' => config('services.gemini.safety', []),
            ]);
    }

    protected function extractPayload(array $data): array
    {
        $text = Arr::get($data, 'candidates.0.content.parts.0.text');

        if (! $text) {
            return [];
        }

        $decoded = $this->decodeGeminiText($text);

        return is_array($decoded) ? $decoded : ['summary' => $text];
    }

    protected function decodeGeminiText(string $text): ?array
    {
        $json = $this->pluckJsonString($text);

        if (! $json) {
            return null;
        }

        $decoded = json_decode($json, true);

        return json_last_error() === JSON_ERROR_NONE ? $decoded : null;
    }

    protected function pluckJsonString(string $text): ?string
    {
        $clean = trim($text);

        if (Str::startsWith($clean, '```')) {
            $clean = preg_replace('/^```[a-zA-Z]*\s*/', '', $clean);
            $clean = preg_replace('/```$/', '', $clean);
            $clean = trim($clean);
        }

        if (Str::startsWith($clean, '{') && Str::endsWith($clean, '}')) {
            return $clean;
        }

        if (preg_match('/\{(?:[^{}]|(?R))*\}/s', $clean, $matches)) {
            return $matches[0];
        }

        return null;
    }

    protected function getApiKeys(): array
    {
        $keys = config('services.gemini.keys', []);

        if (empty($keys) && ($single = config('services.gemini.key'))) {
            $keys = [$single];
        }

        return array_values(array_filter($keys));
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
