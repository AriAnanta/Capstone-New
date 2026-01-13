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

        $prompt = <<<PROMPT
Anda adalah asisten hukum Pengadilan Agama. Tugas Anda adalah mengekstrak dan mengidentifikasi pasal-pasal hukum yang DISEBUTKAN atau DIRUJUK dalam teks putusan berikut.

TEKS PUTUSAN:
{$text}

DAFTAR REGULASI REFERENSI:
{$candidates}

INSTRUKSI:
1. EKSTRAK semua pasal, undang-undang, peraturan, atau regulasi yang DISEBUTKAN dalam teks putusan
2. Cocokkan dengan daftar regulasi referensi jika ada kesamaan
3. Jika ada pasal yang disebutkan dalam teks tapi tidak ada di daftar referensi, tetap sertakan
4. Berikan alasan singkat mengapa pasal tersebut digunakan dalam putusan

Cari pola seperti:
- "Pasal XX Undang-Undang..."
- "berdasarkan Pasal..."
- "sebagaimana dimaksud dalam Pasal..."
- "Kompilasi Hukum Islam Pasal..."
- "PP Nomor... Pasal..."
- "PERMA Nomor..."

Kembalikan HANYA dalam format JSON (tanpa teks tambahan):
{"articles":[{"nama":"Nama Undang-Undang/Peraturan","pasal":"Pasal XX","alasan":"Konteks penggunaan dalam putusan"}]}

Jika benar-benar tidak ada pasal yang disebutkan dalam teks, kembalikan: {"articles":[]}
PROMPT;

        $response = $this->gemini->legalReference($prompt);
        $articles = $this->extractArticles($response);

        if (empty($articles)) {
            Log::warning('Gemini tidak mengembalikan daftar pasal', [
                'perkara_id' => $perkara->id,
                'document_id' => $document?->id,
                'response_keys' => array_keys($response ?? []),
                'response_sample' => array_map(function($v) {
                    if (is_array($v)) {
                        return 'array(' . count($v) . ' items)';
                    }
                    if (is_string($v) && strlen($v) > 100) {
                        return substr($v, 0, 100) . '...';
                    }
                    return $v;
                }, $response ?? []),
                'prompt_length' => strlen($prompt),
                'has_candidates' => !empty($candidates->toArray()),
                'response_is_empty' => empty($response),
            ]);
            
            // Create a fallback recommendation with error info
            LlmRecommendation::create([
                'perkara_id' => $perkara->id,
                'document_id' => $document?->id,
                'daftar_pasal' => [],
                'pertimbangan_llm' => 'Sistem tidak dapat menganalisis dokumen karena masalah koneksi atau timeout pada AI service. Silakan coba proses ulang atau hubungi administrator.',
                'meta' => [
                    'model' => config('services.gemini.model'),
                    'status' => 'failed',
                    'error_type' => 'gemini_timeout_or_empty_response',
                    'timestamp' => now()->toISOString(),
                ],
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

        // Log untuk debugging
        Log::debug('LegalReferenceService: extractArticles response', [
            'response' => $response,
        ]);

        // Cek jika articles adalah array yang valid
        if (isset($response['articles'])) {
            $articles = $response['articles'];
            
            // Jika articles adalah string, coba decode sebagai JSON
            if (is_string($articles)) {
                $decoded = json_decode($articles, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    return $decoded;
                }
            }
            
            // Jika articles adalah array dan tidak kosong
            if (is_array($articles) && !empty($articles)) {
                return $articles;
            }
        }

        // Handle case where entire response might be a JSON string
        if (count($response) === 1) {
            $firstValue = array_values($response)[0];
            if (is_string($firstValue) && (str_starts_with($firstValue, '{') || str_starts_with($firstValue, '['))) {
                $decoded = json_decode($firstValue, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    if (isset($decoded['articles']) && is_array($decoded['articles'])) {
                        return $decoded['articles'];
                    }
                    if (is_array($decoded) && $this->isArticleArray($decoded)) {
                        return $decoded;
                    }
                }
            }
        }

        // Cek alternatif keys yang mungkin digunakan Gemini
        $alternativeKeys = ['pasal', 'daftar_pasal', 'regulations', 'daftar', 'hasil', 'result', 'data'];
        foreach ($alternativeKeys as $key) {
            if (isset($response[$key]) && is_array($response[$key]) && !empty($response[$key])) {
                return $response[$key];
            }
        }

        // Cek jika response adalah nested structure
        if (isset($response['summary']) && is_string($response['summary'])) {
            $decoded = json_decode($response['summary'], true);

            if (json_last_error() === JSON_ERROR_NONE) {
                if (!empty($decoded['articles'])) {
                    return $decoded['articles'];
                }
                // Cek alternatif keys di dalam summary
                foreach ($alternativeKeys as $key) {
                    if (isset($decoded[$key]) && is_array($decoded[$key]) && !empty($decoded[$key])) {
                        return $decoded[$key];
                    }
                }
            }
        }

        // Cek jika response langsung berisi array of articles (tanpa wrapper)
        if ($this->isArticleArray($response)) {
            return $response;
        }

        return [];
    }

    /**
     * Cek apakah array adalah daftar pasal langsung
     */
    protected function isArticleArray(array $data): bool
    {
        // Cek apakah ini indexed array (bukan associative)
        if (array_keys($data) !== range(0, count($data) - 1)) {
            return false;
        }

        // Cek item pertama apakah memiliki struktur pasal
        $first = $data[0] ?? null;
        if (!is_array($first)) {
            return false;
        }

        // Pasal harus memiliki minimal salah satu dari keys ini
        $requiredKeys = ['nama', 'pasal', 'nama_undang', 'isi_pasal', 'alasan'];
        foreach ($requiredKeys as $key) {
            if (isset($first[$key])) {
                return true;
            }
        }

        return false;
    }
}
