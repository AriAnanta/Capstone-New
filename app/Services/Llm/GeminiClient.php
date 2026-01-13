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

    public function analyze(string $prompt): array
    {
        return $this->callGemini($prompt, 'analysis');
    }

    protected function callGemini(string $prompt, string $taskType): array
    {
        $model = config('services.gemini.model', 'gemini-1.5-flash');
        $timeout = (int) config('services.gemini.timeout', 30); // Reduced timeout
        $maxRetries = (int) config('services.gemini.max_retries', 2);
        $retryDelay = (int) config('services.gemini.retry_delay', 1000);
        $apiKeys = $this->getApiKeys();

        if (empty($apiKeys)) {
            Log::warning('Gemini API key belum diatur');
            return [];
        }

        $attempted = [];
        $count = count($apiKeys);
        $lastError = null;

        for ($offset = 0; $offset < $count; $offset++) {
            $keyIndex = ($this->keyCursor + $offset) % $count;
            $apiKey = $apiKeys[$keyIndex];
            $attempted[] = $keyIndex;

            // Retry for each key
            for ($retry = 0; $retry <= $maxRetries; $retry++) {
                try {
                    $response = $this->sendRequest($model, $apiKey, $prompt, $timeout);

                    if ($response->successful()) {
                        $this->keyCursor = ($keyIndex + 1) % $count;
                        $payload = $this->extractPayload($response->json());
                        
                        // Log success
                        Log::info('Gemini API berhasil', [
                            'key_index' => $keyIndex,
                            'task_type' => $taskType,
                            'retry_attempt' => $retry,
                            'response_size' => strlen(json_encode($payload)),
                        ]);
                        
                        return $payload;
                    }

                    Log::warning('Gemini API gagal untuk key tertentu', [
                        'key_index' => $keyIndex,
                        'retry_attempt' => $retry,
                        'status' => $response->status(),
                        'task_type' => $taskType,
                    ]);
                    
                    $lastError = 'HTTP ' . $response->status();
                    
                } catch (ConnectionException $exception) {
                    $lastError = $exception->getMessage();
                    
                    Log::warning('Gemini API timeout/connection error', [
                        'key_index' => $keyIndex,
                        'retry_attempt' => $retry,
                        'task_type' => $taskType,
                        'message' => $exception->getMessage(),
                        'timeout' => $timeout,
                    ]);
                } catch (\Throwable $exception) {
                    $lastError = $exception->getMessage();
                    
                    Log::error('Gemini API unexpected error', [
                        'key_index' => $keyIndex,
                        'retry_attempt' => $retry,
                        'task_type' => $taskType,
                        'message' => $exception->getMessage(),
                        'trace' => $exception->getTraceAsString(),
                    ]);
                }
                
                // Wait before retry (except for last attempt)
                if ($retry < $maxRetries) {
                    usleep($retryDelay * 1000); // Convert to microseconds
                }
            }
        }

        Log::error('Semua Gemini API key gagal dipakai', [
            'attempted_indexes' => $attempted,
            'task_type' => $taskType,
            'total_retries' => $maxRetries * $count,
            'last_error' => $lastError,
            'timeout_setting' => $timeout,
        ]);

        return [];
    }

    protected function sendRequest(string $model, string $apiKey, string $prompt, int $timeout): Response
{
    $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

    return Http::timeout($timeout)
        ->connectTimeout(10) // 10 second connect timeout
        ->retry(1, 200) // Reduced retry delay
        ->post($endpoint, [
            'contents' => [
                [
                    'parts' => [
                        [
                            'text' => $prompt
                        ]
                    ]
                ]
            ],
            'safetySettings' => config('services.gemini.safety', [])
        ]);
}

    protected function extractPayload(array $data): array
    {
        $text = Arr::get($data, 'candidates.0.content.parts.0.text');

        if (! $text) {
            Log::warning('Gemini response tidak memiliki text content', ['data' => $data]);
            return [];
        }

        // Log raw text untuk debugging
        Log::debug('Gemini raw text response', [
            'text_preview' => substr($text, 0, 200),
            'text_length' => strlen($text),
        ]);

        $decoded = $this->decodeGeminiText($text);

        if (is_array($decoded)) {
            Log::debug('Gemini JSON successfully decoded', ['keys' => array_keys($decoded)]);
            return $decoded;
        }
        
        // Fallback: wrap text in summary if JSON parsing fails
        Log::warning('Gemini JSON parsing failed, falling back to text wrapper', [
            'text_preview' => substr($text, 0, 100),
            'contains_json_markers' => str_contains($text, '{') && str_contains($text, '}'),
        ]);
        
        return ['summary' => $text];
    }

    protected function decodeGeminiText(string $text): ?array
    {
        $json = $this->pluckJsonString($text);

        if (! $json) {
            Log::debug('No JSON found in Gemini text', ['text_preview' => substr($text, 0, 100)]);
            return null;
        }

        // Try to decode JSON
        $decoded = json_decode($json, true);
        $jsonError = json_last_error();
        
        if ($jsonError === JSON_ERROR_NONE) {
            return $decoded;
        }
        
        // Log JSON parsing error
        Log::warning('JSON decode failed in Gemini response', [
            'json_error' => json_last_error_msg(),
            'json_preview' => substr($json, 0, 200),
            'json_length' => strlen($json),
        ]);
        
        // Try to fix common JSON issues
        $fixedJson = $this->attemptJsonFix($json);
        if ($fixedJson !== $json) {
            $decoded = json_decode($fixedJson, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                Log::info('JSON successfully fixed', ['original_preview' => substr($json, 0, 100)]);
                return $decoded;
            }
        }
        
        return null;
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
    
    protected function attemptJsonFix(string $json): string
    {
        // Common fixes for malformed JSON from LLMs
        $fixed = $json;
        
        // Remove trailing commas
        $fixed = preg_replace('/,\s*}/', '}', $fixed);
        $fixed = preg_replace('/,\s*]/', ']', $fixed);
        
        // Fix unescaped quotes in strings (basic attempt)
        $fixed = preg_replace('/"([^"]*?)"([^":,}\]]*?)"/', '"$1\\"$2"', $fixed);
        
        // Ensure proper closing
        if (substr_count($fixed, '{') > substr_count($fixed, '}')) {
            $fixed .= str_repeat('}', substr_count($fixed, '{') - substr_count($fixed, '}'));
        }
        
        if (substr_count($fixed, '[') > substr_count($fixed, ']')) {
            $fixed .= str_repeat(']', substr_count($fixed, '[') - substr_count($fixed, ']'));
        }
        
        return $fixed;
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
Anda adalah asisten hukum Pengadilan Tinggi Agama. Buat ringkasan untuk perkara jenis {$jenis}.

JENIS RINGKASAN: {$type}

INSTRUKSI FORMAT:
1. Gunakan teks biasa (plain text), JANGAN gunakan format Markdown seperti **, *, #, atau simbol formatting lainnya
2. Gunakan paragraf dan baris baru untuk memisahkan bagian
3. Untuk daftar, gunakan angka atau huruf biasa (1., 2., a., b.) bukan bullet points
4. Tulis dengan bahasa Indonesia yang formal dan jelas

STRUKTUR RINGKASAN:
- Identitas Perkara (nomor, jenis, para pihak)
- Duduk Perkara (kronologi singkat)
- Pertimbangan Hukum (poin-poin utama)
- Amar Putusan (hasil keputusan)

Kembalikan dalam format JSON:
{"summary":"[ringkasan lengkap dalam plain text]","reasoning":"[alasan pembuatan ringkasan]","confidence":[0-1]}

Teks sumber:
{$content}
PROMPT;
    }
}
