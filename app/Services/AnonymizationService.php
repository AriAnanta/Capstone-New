<?php

namespace App\Services;

use App\Services\Llm\GeminiClient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\Element\TextRun;

class AnonymizationService
{
    protected GeminiClient $gemini;

    // Pola regex untuk data sensitif yang umum
    protected array $sensitivePatterns = [
        // NIK (16 digit)
        'nik' => '/\b\d{16}\b/',
        // Email
        'email' => '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/',
        // Nomor telepon Indonesia
        'phone' => '/\b(?:0|\+62|62)[\s\-]?\d{2,4}[\s\-]?\d{3,4}[\s\-]?\d{3,4}\b/',
        // Nomor KK (16 digit setelah kata "KK" atau "Kartu Keluarga")
        'kk' => '/(?:KK|Kartu Keluarga)[:\s]*(\d{16})/i',
        // Rekening Bank
        'rekening' => '/(?:rekening|rek|account|nomor rekening)[:\s]*[\d\s\-]{10,20}/i',
        // Tanggal lahir format Indonesia (dd bulan yyyy atau dd-mm-yyyy)
        'date_of_birth' => '/\b\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+\d{4}\b/i',
        // Alamat dengan RT/RW
        'address_rt_rw' => '/RT\.?\s*\d{1,3}\s*(?:\/|RW\.?\s*)\s*\d{1,3}/i',
        // Alamat Jalan lengkap
        'address_jalan' => '/(?:Jl\.|Jalan|Komp\.|Komplek|Gang|Gg\.)\s+[A-Za-z0-9\s\.\-\/]+(?:No\.|Nomor|Blok)\s*[A-Za-z0-9\.\-\/]+/i',
        // Kelurahan/Desa
        'address_kelurahan' => '/(?:Kelurahan|Kel\.|Desa)\s+[A-Za-z\s]+/i',
        // Kecamatan
        'address_kecamatan' => '/(?:Kecamatan|Kec\.)\s+[A-Za-z\s]+/i',
    ];

    // Placeholder untuk penggantian
    protected array $placeholders = [
        // Nama pihak
        'name' => '[NAMA PIHAK]', 
        
        // Alamat
        'address' => '[ALAMAT]',
        'address_rt_rw' => '[RT/RW]',
        'address_jalan' => '[ALAMAT JALAN]',
        'address_kelurahan' => '[KELURAHAN]',
        'address_kecamatan' => '[KECAMATAN]',
        
        'nik' => '[NIK]',
        'email' => '[EMAIL]',
        'phone' => '[NO. TELEPON]',
        'kk' => '[NO. KK]',
        'rekening' => '[NO. REKENING]',
        'witness' => '[NAMA SAKSI]',
        'child' => '[NAMA ANAK]',
        
        // Tempat lahir
        'place' => '[TEMPAT LAHIR]', 
        
        // Tanggal lahir
        'date_of_birth' => '[TANGGAL LAHIR]',
        
        // Pekerjaan
        'job' => '[PEKERJAAN]',
    ];

    public function __construct(GeminiClient $gemini)
    {
        $this->gemini = $gemini;
    }

    /**
     * Proses anonimisasi dokumen
     */
    public function anonymize(string $text, array $options = []): array
    {
        try {
            // Clean UTF-8 encoding first
            $text = $this->cleanUtf8($text);
            
            // Step 1: Gunakan LLM untuk identifikasi entitas yang perlu dianonimkan
            $entities = $this->identifyEntitiesWithLlm($text, $options);
            
            // Step 2: Juga deteksi dengan regex untuk data yang pasti (NIK, email, dll)
            $regexEntities = $this->detectWithRegex($text);
            
            // Step 3: Gabungkan hasil LLM dan regex
            $allEntities = $this->mergeEntities($entities, $regexEntities);
            
            // Step 4: Lakukan penggantian
            $anonymizedText = $this->replaceEntities($text, $allEntities);
            
            return [
                'success' => true,
                'original_text' => $text,
                'anonymized_text' => $anonymizedText,
                'entities_found' => $allEntities,
                'entities_count' => count($allEntities),
            ];
        } catch (\Exception $e) {
            Log::error('Anonymization failed: ' . $e->getMessage());
            
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'original_text' => $text ?? '',
                'anonymized_text' => $text ?? '',
                'entities_found' => [],
            ];
        }
    }

    /**
     * Clean and ensure valid UTF-8 encoding
     */
    protected function cleanUtf8(string $text): string
    {
        // Convert to UTF-8 if needed
        if (!mb_check_encoding($text, 'UTF-8')) {
            // Try to detect encoding
            $encoding = mb_detect_encoding($text, ['UTF-8', 'ISO-8859-1', 'Windows-1252', 'ASCII'], true);
            if ($encoding && $encoding !== 'UTF-8') {
                $text = mb_convert_encoding($text, 'UTF-8', $encoding);
            } else {
                // Force UTF-8 conversion, replacing invalid characters
                $text = mb_convert_encoding($text, 'UTF-8', 'UTF-8');
            }
        }
        
        // Remove any remaining invalid UTF-8 sequences
        $text = iconv('UTF-8', 'UTF-8//IGNORE', $text);
        
        // Replace control characters (except newline, tab, carriage return)
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $text);
        
        return $text;
    }

    /**
     * Identifikasi entitas menggunakan Gemini LLM
     */
    protected function identifyEntitiesWithLlm(string $text, array $options = []): array
    {
        $caseType = $options['case_type'] ?? 'umum';
        
        $prompt = $this->buildAnonymizationPrompt($text, $caseType);
        
        $response = $this->gemini->analyze($prompt);
        
        if (empty($response)) {
            Log::warning('LLM returned empty response for entity identification');
            return [];
        }
        
        return $this->parseEntitiesFromLlm($response);
    }

  /**
     * Build prompt untuk LLM (Optimized for Gemini Flash & Court Decision Structure)
     */
    protected function buildAnonymizationPrompt(string $text, string $caseType): string
    {
        return <<<PROMPT
Anda adalah sistem anonimisasi dokumen putusan pengadilan. Tugas Anda adalah mengidentifikasi SEMUA data pribadi yang harus dianonimkan.

## ATURAN WAJIB - IDENTIFIKASI SEMUA DATA BERIKUT:

### 1. NAMA_PIHAK (SANGAT PENTING)
Identifikasi SEMUA nama orang dalam dokumen:
- Nama Pemohon/Penggugat beserta gelar dan BIN/BINTI (contoh: "AGUNG PERMADI BIN EKA RAHARJA, S.SIT." → ambil lengkap)
- Nama Termohon/Tergugat beserta gelar dan BIN/BINTI (contoh: "DWITA KEMALASARI BINTI ENDANG DITA")
- Nama yang muncul berulang dalam dokumen (baik huruf kapital maupun biasa)
- Contoh variasi: "Agung Permadi", "AGUNG PERMADI", "Agung Permadi bin Eka Raharja"

### 2. NAMA_ANAK (SANGAT PENTING)
- Nama anak yang disebutkan dalam dokumen
- Biasanya muncul setelah kata "anak bernama", "anak yang bernama"
- Contoh: "Alkhalifi Zaviyar Rayyanka Permadi bin Agung Permadi"

### 3. ALAMAT_LENGKAP (SANGAT PENTING)
Identifikasi SELURUH alamat lengkap termasuk:
- Nama kompleks/perumahan (Komp. Ciceri Permai IV)
- Nama jalan dan nomor (Jalan Ciremai Blok E4 No. 07)
- RT/RW (RT. 001 RW. 020)
- Kelurahan (Kelurahan Cipare)
- Kecamatan (Kecamatan Serang)
- Ambil sebagai SATU kesatuan alamat lengkap, bukan per-bagian

### 4. TEMPAT_LAHIR
- Nama kota/kabupaten tempat lahir (setelah kata "tempat lahir", "lahir di")
- Contoh: "tempat dan tanggal lahir Serang" → ambil "Serang"
- Contoh: "lahir di Bandung" → ambil "Bandung"

### 5. TANGGAL_LAHIR
- Tanggal lengkap (15 Mei 1991, 13 Januari 1991, 09 November 2018)
- Format: dd bulan yyyy

### 6. NIK
- Nomor 16 digit setelah kata "NIK"

### 7. PEKERJAAN
- Jenis pekerjaan (Wiraswasta, Mengurus Rumah Tangga, PNS, dll)

## YANG TIDAK BOLEH DIAMBIL:
- Nama Advokat/Pengacara (Riko Setia Graha, Nata Sasmita) - mereka adalah kuasa hukum publik
- Nama Hakim, Panitera
- Nama Pengadilan (Pengadilan Agama Bandung)
- Nomor perkara
- Tanggal putusan

## FORMAT OUTPUT (JSON):
```json
{
  "entities": [
    {"type": "NAMA_PIHAK", "value": "AGUNG PERMADI BIN EKA RAHARJA, S.SIT."},
    {"type": "NAMA_PIHAK", "value": "Agung Permadi bin Eka Raharja, S.SIT"},
    {"type": "NAMA_PIHAK", "value": "Agung Permadi"},
    {"type": "NAMA_PIHAK", "value": "DWITA KEMALASARI BINTI ENDANG DITA"},
    {"type": "NAMA_PIHAK", "value": "Dwita Kemalasari binti Endang Dita"},
    {"type": "NAMA_PIHAK", "value": "Dwita Kemalasari"},
    {"type": "NAMA_ANAK", "value": "Alkhalifi Zaviyar Rayyanka Permadi bin Agung Permadi"},
    {"type": "ALAMAT_LENGKAP", "value": "Komp. Ciceri Permai IV, Jalan Ciremai Blok E4 No. 07, RT. 001 RW. 020, Kelurahan Cipare, Kecamatan Serang, Kota Serang, Provinsi Banten"},
    {"type": "TEMPAT_LAHIR", "value": "Serang"},
    {"type": "TANGGAL_LAHIR", "value": "15 Mei 1991"}
  ]
}
```

## PENTING:
1. Ambil SEMUA variasi penulisan nama (kapital, normal, dengan gelar, tanpa gelar)
2. Nilai "value" harus PERSIS sama dengan teks asli (case-sensitive) agar bisa di-replace
3. Jangan lewatkan nama yang muncul di bagian amar putusan

TEKS UNTUK DIANALISIS:
{$text}
PROMPT;
    }

   /**
     * Parse hasil LLM menjadi array entitas (Robust Version)
     */
    protected function parseEntitiesFromLlm(array|string $response): array
    {
        $entities = [];
        $rawContent = '';

        // Handle jika response dari library GeminiClient berbeda struktur
        if (is_array($response) && isset($response['text'])) {
            $rawContent = $response['text']; // Sesuaikan dengan output GeminiClient Anda
        } elseif (is_string($response)) {
            $rawContent = $response;
        } elseif (is_array($response) && isset($response['candidates'][0]['content']['parts'][0]['text'])) {
             // Struktur raw Google API
            $rawContent = $response['candidates'][0]['content']['parts'][0]['text'];
        } else {
            // Asumsi response sudah array hasil json_decode dari GeminiClient
            if (isset($response['entities'])) {
                return $this->normalizeEntities($response['entities']);
            }
            return [];
        }

        // 1. Bersihkan Markdown Block jika ada (```json ... ```)
        $cleanJson = preg_replace('/^```json\s*|\s*```$/s', '', $rawContent);
        
        // 2. Decode JSON
        $data = json_decode($cleanJson, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('JSON Decode Error from LLM: ' . json_last_error_msg());
            // Fallback: Coba cari pattern JSON array manual jika format rusak
            return [];
        }

        if (isset($data['entities']) && is_array($data['entities'])) {
            return $this->normalizeEntities($data['entities']);
        }

        return [];
    }

    /**
     * Helper untuk normalisasi loop entitas
     */
    protected function normalizeEntities(array $rawEntities): array
    {
        $entities = [];
        foreach ($rawEntities as $entity) {
            if (isset($entity['type'], $entity['value'])) {
                // Trim value untuk memastikan replace bersih
                $value = trim($entity['value']);
                
                // Skip jika value terlalu pendek (kemungkinan noise)
                if (strlen($value) < 2) continue;

                $entities[] = [
                    'type' => $this->normalizeEntityType($entity['type']),
                    'value' => $value,
                    'source' => 'llm',
                ];
                
                // Untuk nama, tambahkan variasi otomatis
                $type = strtoupper($entity['type']);
                if (in_array($type, ['NAMA_PIHAK', 'NAMA_ANAK'])) {
                    $variations = $this->extractNameVariations($value);
                    foreach ($variations as $variation) {
                        if ($variation !== $value && strlen($variation) >= 3) {
                            $entities[] = [
                                'type' => $this->normalizeEntityType($entity['type']),
                                'value' => $variation,
                                'source' => 'llm_variation',
                            ];
                        }
                    }
                }
            }
        }
        return $entities;
    }
    
    /**
     * Ekstrak variasi nama dari nama lengkap
     */
    protected function extractNameVariations(string $fullName): array
    {
        $variations = [];
        
        // Hapus gelar terlebih dahulu untuk dapat nama dasar
        $nameWithoutTitle = preg_replace('/,?\s*(S\.H\.|S\.Pd\.|S\.E\.|S\.SIT\.|S\.Sos\.|S\.Ag\.|S\.Kom\.|M\.H\.|M\.Pd\.|M\.M\.|Dr\.|Drs\.|Ir\.|H\.|Hj\.)\s*/i', '', $fullName);
        $nameWithoutTitle = trim($nameWithoutTitle);
        
        // Versi dengan dan tanpa gelar
        if ($nameWithoutTitle !== $fullName) {
            $variations[] = $nameWithoutTitle;
        }
        
        // Jika ada BIN/BINTI, ambil nama depan saja
        if (preg_match('/^(.+?)\s+(?:BIN|BINTI)\s+/i', $nameWithoutTitle, $matches)) {
            $firstName = trim($matches[1]);
            $variations[] = $firstName;
            
            // Juga tambahkan versi lowercase/titlecase
            $variations[] = mb_strtoupper($firstName);
            $variations[] = mb_convert_case($firstName, MB_CASE_TITLE, 'UTF-8');
        }
        
        // Tambahkan versi UPPERCASE dan Title Case dari nama lengkap
        $variations[] = mb_strtoupper($nameWithoutTitle);
        $variations[] = mb_convert_case($nameWithoutTitle, MB_CASE_TITLE, 'UTF-8');
        
        // Untuk nama dengan BIN/BINTI, buat variasi penulisan
        if (preg_match('/(.+?)\s+(BIN|BINTI)\s+(.+)/i', $nameWithoutTitle, $matches)) {
            $beforeBin = trim($matches[1]);
            $binWord = $matches[2];
            $afterBin = trim($matches[3]);
            
            // Variasi: "Nama bin Nama" (lowercase bin)
            $variations[] = $beforeBin . ' bin ' . $afterBin;
            $variations[] = $beforeBin . ' binti ' . $afterBin;
            $variations[] = mb_convert_case($beforeBin, MB_CASE_TITLE, 'UTF-8') . ' bin ' . mb_convert_case($afterBin, MB_CASE_TITLE, 'UTF-8');
            $variations[] = mb_convert_case($beforeBin, MB_CASE_TITLE, 'UTF-8') . ' binti ' . mb_convert_case($afterBin, MB_CASE_TITLE, 'UTF-8');
        }
        
        return array_unique($variations);
    }

    /**
     * Normalisasi tipe entitas ke format standar
     */
    protected function normalizeEntityType(string $type): string
    {
        $mapping = [
            'NAMA_PIHAK' => 'name',
            'NAMA_ANAK' => 'child',
            'NAMA_SAKSI' => 'witness',
            'NIK' => 'nik',
            'ALAMAT' => 'address',
            'ALAMAT_LENGKAP' => 'address',
            'EMAIL' => 'email',
            'TELEPON' => 'phone',
            'TEMPAT_LAHIR' => 'place',
            'TANGGAL_LAHIR' => 'date_of_birth',
            'NOMOR_AKTA' => 'nik',
            'PEKERJAAN' => 'job',
            'NOMOR_REKENING' => 'rekening',
            'NOMOR_KK' => 'kk',
        ];
        
        return $mapping[strtoupper($type)] ?? 'name';
    }

    /**
     * Deteksi data sensitif dengan regex
     */
    protected function detectWithRegex(string $text): array
    {
        $entities = [];
        
        // Deteksi dari pola baku
        foreach ($this->sensitivePatterns as $type => $pattern) {
            if (preg_match_all($pattern, $text, $matches)) {
                foreach ($matches[0] as $match) {
                    $entities[] = [
                        'type' => $type,
                        'value' => trim($match),
                        'source' => 'regex',
                    ];
                }
            }
        }
        
        // Deteksi alamat lengkap dengan pola kompleks
        // Pattern untuk alamat yang dimulai dengan Komp./Jl./Gang dll sampai Provinsi/Kota
        $addressPattern = '/(?:Komp\.|Komplek|Jl\.|Jalan|Gang|Gg\.|Perumahan)[^,]+(?:,\s*[^,]+){2,}(?:,\s*(?:Provinsi|Kota|Kabupaten)[^,;]+)?/i';
        if (preg_match_all($addressPattern, $text, $addressMatches)) {
            foreach ($addressMatches[0] as $match) {
                // Pastikan ini benar-benar alamat (harus mengandung RT/RW atau Kelurahan)
                if (preg_match('/RT|RW|Kelurahan|Kecamatan/i', $match)) {
                    $entities[] = [
                        'type' => 'address',
                        'value' => trim($match),
                        'source' => 'regex',
                    ];
                }
            }
        }
        
        // Deteksi nama dengan BIN/BINTI (biasanya nama pihak)
        // Format: NAMA BIN/BINTI NAMA_AYAH, gelar
        $nameBinPattern = '/[A-Z][A-Z\s\']+\s+(?:BIN|BINTI)\s+[A-Z][A-Z\s\']+(?:,?\s*S\.[A-Za-z]+\.?)?/';
        if (preg_match_all($nameBinPattern, $text, $nameMatches)) {
            foreach ($nameMatches[0] as $match) {
                $entities[] = [
                    'type' => 'name',
                    'value' => trim($match),
                    'source' => 'regex',
                ];
            }
        }
        
        // Deteksi tempat lahir setelah kata kunci
        $placePattern = '/(?:tempat\s+(?:dan\s+)?tanggal\s+lahir|lahir\s+di)\s+([A-Za-z]+)/i';
        if (preg_match_all($placePattern, $text, $placeMatches)) {
            foreach ($placeMatches[1] as $match) {
                $entities[] = [
                    'type' => 'place',
                    'value' => trim($match),
                    'source' => 'regex',
                ];
            }
        }
        
        // Deteksi pekerjaan
        $jobPattern = '/pekerjaan\s+([A-Za-z\s]+)(?:,|pendidikan)/i';
        if (preg_match_all($jobPattern, $text, $jobMatches)) {
            foreach ($jobMatches[1] as $match) {
                $job = trim($match);
                if (strlen($job) > 2 && strlen($job) < 50) {
                    $entities[] = [
                        'type' => 'job',
                        'value' => $job,
                        'source' => 'regex',
                    ];
                }
            }
        }
        
        return $entities;
    }

    /**
     * Gabungkan entitas dari LLM dan regex, hilangkan duplikat
     */
    protected function mergeEntities(array $llmEntities, array $regexEntities): array
    {
        $merged = $llmEntities;
        $existingValues = array_column($llmEntities, 'value');
        
        foreach ($regexEntities as $entity) {
            // Cek apakah nilai sudah ada
            $found = false;
            foreach ($existingValues as $existing) {
                if (stripos($existing, $entity['value']) !== false || 
                    stripos($entity['value'], $existing) !== false) {
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                $merged[] = $entity;
                $existingValues[] = $entity['value'];
            }
        }
        
        // Sort by value length (descending) untuk mengganti yang panjang dulu
        usort($merged, fn($a, $b) => strlen($b['value']) - strlen($a['value']));
        
        return $merged;
    }

    /**
     * Ganti semua entitas dengan placeholder
     */
    protected function replaceEntities(string $text, array $entities): string
    {
        $result = $text;
        $replacementCount = [];
        $replacedValues = []; // Track yang sudah di-replace untuk hindari overlap
        
        foreach ($entities as $entity) {
            $type = $entity['type'];
            $value = $entity['value'];
            
            // Skip jika value terlalu pendek
            if (strlen($value) < 3) continue;
            
            // Skip jika sudah di-replace sebagai bagian dari string lebih panjang
            $alreadyReplaced = false;
            foreach ($replacedValues as $replaced) {
                if (stripos($replaced, $value) !== false && strlen($replaced) > strlen($value)) {
                    $alreadyReplaced = true;
                    break;
                }
            }
            if ($alreadyReplaced) continue;
            
            // Track berapa kali tipe ini sudah diganti
            if (!isset($replacementCount[$type])) {
                $replacementCount[$type] = 0;
            }
            $replacementCount[$type]++;
            
            // Buat placeholder dengan nomor jika lebih dari 1
            $placeholder = $this->placeholders[$type] ?? '[DATA DIRAHASIAKAN]';
            if ($replacementCount[$type] > 1) {
                $placeholder = str_replace(']', " {$replacementCount[$type]}]", $placeholder);
            }
            
            // Escape special regex characters in value
            $escapedValue = preg_quote($value, '/');
            
            // Ganti semua kemunculan - gunakan pattern yang lebih flexible
            // Tidak menggunakan \b untuk awal jika dimulai dengan huruf non-ASCII
            $pattern = '/' . $escapedValue . '/iu';
            
            $newResult = preg_replace($pattern, $placeholder, $result);
            
            // Jika berhasil replace, track value
            if ($newResult !== $result) {
                $replacedValues[] = $value;
                $result = $newResult;
            }
        }
        
        return $result;
    }

    /**
     * Proses file dokumen (Word/RTF)
     */
    public function processDocument(string $filePath, array $options = []): array
    {
        try {
            // Baca konten dokumen
            $text = $this->extractTextFromDocument($filePath);
            
            if (empty(trim($text))) {
                return [
                    'success' => false,
                    'error' => 'Tidak dapat mengekstrak teks dari dokumen',
                ];
            }
            
            // Lakukan anonimisasi
            $result = $this->anonymize($text, $options);
            
            return $result;
        } catch (\Exception $e) {
            Log::error('Document processing failed: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Ekstrak teks dari file Word/RTF
     */
    protected function extractTextFromDocument(string $filePath): string
    {
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        
        // Detect actual file type by reading file header
        $handle = fopen($filePath, 'r');
        $header = fread($handle, 10);
        fclose($handle);
        
        // Check if file is actually RTF (starts with {\rtf)
        if (strpos($header, '{\\rtf') === 0) {
            Log::info("File detected as RTF by content header");
            return $this->extractFromRtf($filePath);
        }
        
        // Check if file is a ZIP (DOCX starts with PK)
        if (substr($header, 0, 2) === 'PK') {
            Log::info("File detected as DOCX (ZIP format)");
            return $this->extractFromWord($filePath);
        }
        
        // Fallback to extension-based detection
        if (in_array($extension, ['doc', 'docx'])) {
            return $this->extractFromWord($filePath);
        } elseif ($extension === 'rtf') {
            return $this->extractFromRtf($filePath);
        } elseif ($extension === 'txt') {
            $content = file_get_contents($filePath);
            return $this->cleanUtf8($content);
        }
        
        throw new \Exception("Format file tidak didukung: {$extension}");
    }

    /**
     * Ekstrak teks dari file Word
     */
    protected function extractFromWord(string $filePath): string
    {
        // Check if ZipArchive is available
        if (!class_exists('ZipArchive')) {
            Log::warning('ZipArchive not available, using fallback method for Word extraction');
            return $this->extractFromWordFallback($filePath);
        }

        try {
            $phpWord = IOFactory::load($filePath);
            $text = '';
            
            foreach ($phpWord->getSections() as $section) {
                foreach ($section->getElements() as $element) {
                    $text .= $this->extractTextFromElement($element) . "\n";
                }
            }
            
            return $this->cleanUtf8($text);
        } catch (\Exception $e) {
            Log::warning('PhpWord extraction failed: ' . $e->getMessage());
            return $this->extractFromWordFallback($filePath);
        }
    }

    /**
     * Fallback: Ekstrak teks dari Word tanpa ZipArchive
     */
    protected function extractFromWordFallback(string $filePath): string
    {
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        
        // Try antiword for .doc files
        if ($extension === 'doc') {
            $result = shell_exec("antiword " . escapeshellarg($filePath) . " 2>NUL");
            if ($result && trim($result)) {
                return $result;
            }
        }
        
        // For .docx, try to extract manually
        if ($extension === 'docx') {
            $text = $this->extractDocxManually($filePath);
            if ($text) {
                return $text;
            }
        }
        
        // Last resort: read as binary and extract visible text
        return $this->extractTextFromBinary($filePath);
    }

    /**
     * Extract text from DOCX manually without ZipArchive
     */
    protected function extractDocxManually(string $filePath): ?string
    {
        // Read file content
        $content = file_get_contents($filePath);
        
        // DOCX is a ZIP file, try to find XML content markers
        // Look for document.xml content which contains the text
        if (preg_match('/<w:t[^>]*>.*?<\/w:t>/s', $content, $matches)) {
            // Extract all text nodes
            preg_match_all('/<w:t[^>]*>(.*?)<\/w:t>/s', $content, $textMatches);
            if (!empty($textMatches[1])) {
                $text = implode(' ', $textMatches[1]);
                // Decode XML entities
                $text = html_entity_decode($text, ENT_QUOTES | ENT_XML1, 'UTF-8');
                return $this->cleanUtf8($text);
            }
        }
        
        return null;
    }

    /**
     * Extract readable text from binary file
     */
    protected function extractTextFromBinary(string $filePath): string
    {
        $content = file_get_contents($filePath);
        
        // Remove null bytes and control characters
        $content = preg_replace('/[\x00-\x08\x0B-\x0C\x0E-\x1F]/', ' ', $content);
        
        // Extract words (sequences of printable characters)
        preg_match_all('/[\x20-\x7E\x{00A0}-\x{FFFF}]{3,}/u', $content, $matches);
        
        if (empty($matches[0])) {
            throw new \Exception('Tidak dapat mengekstrak teks dari dokumen. Silakan gunakan format TXT atau pastikan ekstensi PHP zip aktif.');
        }
        
        // Join words with space and clean up
        $text = implode(' ', $matches[0]);
        $text = preg_replace('/\s+/', ' ', $text);
        
        return $this->cleanUtf8(trim($text));
    }

    /**
     * Ekstrak teks dari element PhpWord
     */
    protected function extractTextFromElement($element): string
    {
        $text = '';
        
        if ($element instanceof Text) {
            $text = $element->getText();
        } elseif ($element instanceof TextRun) {
            foreach ($element->getElements() as $child) {
                $text .= $this->extractTextFromElement($child);
            }
        } elseif (method_exists($element, 'getElements')) {
            foreach ($element->getElements() as $child) {
                $text .= $this->extractTextFromElement($child) . ' ';
            }
        } elseif (method_exists($element, 'getText')) {
            $text = $element->getText();
        }
        
        return $text;
    }

    /**
     * Ekstrak teks dari file RTF
     */
    protected function extractFromRtf(string $filePath): string
    {
        // Gunakan unrtf jika tersedia
        $result = shell_exec("unrtf --text " . escapeshellarg($filePath) . " 2>/dev/null");
        if ($result) {
            // Bersihkan output unrtf
            $result = preg_replace('/^.*?-{10,}.*?\n/s', '', $result);
            return $result;
        }
        
        // Fallback: baca raw dan strip RTF tags
        $content = file_get_contents($filePath);
        return $this->stripRtfTags($content);
    }

    /**
     * Strip RTF tags dari konten - Improved RTF Parser
     */
    protected function stripRtfTags(string $rtf): string
    {
        $text = '';
        $stack = [];
        $ignorable = false;
        $ucskip = 1;
        $curskip = 0;
        
        // State machine to parse RTF
        $len = strlen($rtf);
        $i = 0;
        
        while ($i < $len) {
            $char = $rtf[$i];
            
            if ($char === '{') {
                // Push state
                $stack[] = [$ucskip, $ignorable];
                $i++;
            } elseif ($char === '}') {
                // Pop state
                if (!empty($stack)) {
                    list($ucskip, $ignorable) = array_pop($stack);
                }
                $i++;
            } elseif ($char === '\\') {
                $i++;
                if ($i >= $len) break;
                
                $nextChar = $rtf[$i];
                
                // Escaped characters
                if ($nextChar === '\\' || $nextChar === '{' || $nextChar === '}') {
                    if (!$ignorable) {
                        if ($curskip > 0) {
                            $curskip--;
                        } else {
                            $text .= $nextChar;
                        }
                    }
                    $i++;
                } elseif ($nextChar === "'") {
                    // Hex character \'xx
                    if ($i + 2 < $len) {
                        $hex = substr($rtf, $i + 1, 2);
                        if (ctype_xdigit($hex)) {
                            if (!$ignorable) {
                                if ($curskip > 0) {
                                    $curskip--;
                                } else {
                                    $text .= chr(hexdec($hex));
                                }
                            }
                        }
                        $i += 3;
                    } else {
                        $i++;
                    }
                } elseif ($nextChar === '~') {
                    // Non-breaking space
                    if (!$ignorable) $text .= ' ';
                    $i++;
                } elseif ($nextChar === '_') {
                    // Non-breaking hyphen
                    if (!$ignorable) $text .= '-';
                    $i++;
                } elseif ($nextChar === '*') {
                    // Ignorable destination
                    $ignorable = true;
                    $i++;
                } elseif (ctype_alpha($nextChar)) {
                    // Control word
                    $word = '';
                    while ($i < $len && ctype_alpha($rtf[$i])) {
                        $word .= $rtf[$i];
                        $i++;
                    }
                    
                    // Check for numeric parameter
                    $param = null;
                    if ($i < $len && ($rtf[$i] === '-' || ctype_digit($rtf[$i]))) {
                        $numStr = '';
                        if ($rtf[$i] === '-') {
                            $numStr .= '-';
                            $i++;
                        }
                        while ($i < $len && ctype_digit($rtf[$i])) {
                            $numStr .= $rtf[$i];
                            $i++;
                        }
                        if ($numStr !== '' && $numStr !== '-') {
                            $param = (int)$numStr;
                        }
                    }
                    
                    // Skip delimiter space
                    if ($i < $len && $rtf[$i] === ' ') {
                        $i++;
                    }
                    
                    // Handle special control words
                    $destinations = ['fonttbl', 'colortbl', 'datastore', 'themedata', 
                        'stylesheet', 'info', 'pict', 'object', 'fldinst', 'panose',
                        'shp', 'shpinst', 'shprslt', 'blipuid', 'buptim', 'rsidtbl',
                        'generator', 'expandedcolortbl', 'mmathPr', 'latentstyles',
                        'datafield', 'formfield', 'xmlnstbl', 'listtable', 'listoverridetable',
                        'pgptbl', 'revtbl', 'upr', 'ud', 'background', 'defchp', 'defpap'];
                    
                    if (in_array($word, $destinations)) {
                        $ignorable = true;
                    } elseif ($word === 'uc') {
                        $ucskip = $param ?? 1;
                    } elseif ($word === 'u') {
                        // Unicode character
                        if ($param !== null) {
                            if (!$ignorable) {
                                if ($param < 0) $param += 65536;
                                if ($param >= 32 && $param < 55296) {
                                    $text .= mb_chr($param, 'UTF-8');
                                }
                            }
                            $curskip = $ucskip;
                        }
                    } elseif ($word === 'par' || $word === 'line') {
                        if (!$ignorable) $text .= "\n";
                    } elseif ($word === 'tab') {
                        if (!$ignorable) $text .= "\t";
                    } elseif ($word === 'emdash') {
                        if (!$ignorable) $text .= "\xE2\x80\x94"; // —
                    } elseif ($word === 'endash') {
                        if (!$ignorable) $text .= "\xE2\x80\x93"; // –
                    } elseif ($word === 'bullet') {
                        if (!$ignorable) $text .= "\xE2\x80\xA2"; // •
                    } elseif ($word === 'lquote') {
                        if (!$ignorable) $text .= "\xE2\x80\x98"; // '
                    } elseif ($word === 'rquote') {
                        if (!$ignorable) $text .= "\xE2\x80\x99"; // '
                    } elseif ($word === 'ldblquote') {
                        if (!$ignorable) $text .= "\xE2\x80\x9C"; // "
                    } elseif ($word === 'rdblquote') {
                        if (!$ignorable) $text .= "\xE2\x80\x9D"; // "
                    }
                } else {
                    $i++;
                }
            } elseif ($char === "\n" || $char === "\r") {
                // Ignore line breaks in RTF source
                $i++;
            } else {
                // Regular text
                if (!$ignorable) {
                    if ($curskip > 0) {
                        $curskip--;
                    } else {
                        $text .= $char;
                    }
                }
                $i++;
            }
        }
        
        // Clean up the result
        $text = preg_replace('/\s+/', ' ', $text);
        $text = preg_replace('/\n\s*\n+/', "\n\n", $text);
        $text = trim($text);
        
        // Ensure valid UTF-8
        $text = $this->cleanUtf8($text);
        
        return $text;
    }

    /**
     * Generate dokumen hasil anonimisasi
     */
    public function generateAnonymizedDocument(string $anonymizedText, string $originalFilename): array
    {
        $filename = pathinfo($originalFilename, PATHINFO_FILENAME) . '_anonim.txt';
        $tempPath = storage_path('app/temp/' . Str::uuid() . '_' . $filename);
        
        // Pastikan direktori temp ada
        if (!is_dir(dirname($tempPath))) {
            mkdir(dirname($tempPath), 0755, true);
        }
        
        file_put_contents($tempPath, $anonymizedText);
        
        return [
            'path' => $tempPath,
            'filename' => $filename,
        ];
    }
}
