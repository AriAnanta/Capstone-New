<?php

namespace App\Services;

use App\Enums\CaseType;
use App\Models\Regulation;
use App\Services\Llm\GeminiClient;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LegalAdvisorService
{
    /**
     * Daftar peraturan dasar per jenis perkara
     * Ini adalah fallback jika database regulations kosong
     */
    protected const BASE_REGULATIONS = [
        'cerai_talak' => [
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 39',
                'isi_pasal' => 'Perceraian hanya dapat dilakukan di depan Sidang Pengadilan setelah Pengadilan yang bersangkutan berusaha dan tidak berhasil mendamaikan kedua belah pihak.',
            ],
            [
                'nama_undang' => 'Peraturan Pemerintah Nomor 9 Tahun 1975',
                'pasal' => 'Pasal 14-18',
                'isi_pasal' => 'Tata cara pengajuan gugatan perceraian di Pengadilan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 114-148',
                'isi_pasal' => 'Ketentuan mengenai putusnya perkawinan karena talak.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989 jo. UU No. 3 Tahun 2006 jo. UU No. 50 Tahun 2009',
                'pasal' => 'Pasal 66',
                'isi_pasal' => 'Seorang suami yang beragama Islam yang akan menceraikan istrinya mengajukan permohonan kepada Pengadilan untuk mengadakan sidang guna menyaksikan ikrar talak.',
            ],
        ],
        'cerai_gugat' => [
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 39',
                'isi_pasal' => 'Perceraian hanya dapat dilakukan di depan Sidang Pengadilan setelah Pengadilan yang bersangkutan berusaha dan tidak berhasil mendamaikan kedua belah pihak.',
            ],
            [
                'nama_undang' => 'Peraturan Pemerintah Nomor 9 Tahun 1975',
                'pasal' => 'Pasal 19',
                'isi_pasal' => 'Perceraian dapat terjadi karena alasan: (a) Salah satu pihak berbuat zina atau menjadi pemabuk, pemadat, penjudi dll; (b) Salah satu pihak meninggalkan pihak lain selama 2 tahun berturut-turut; (c) Salah satu pihak mendapat hukuman penjara 5 tahun atau lebih; (d) Salah satu pihak melakukan kekejaman atau penganiayaan berat; (e) Salah satu pihak mendapat cacat badan atau penyakit sehingga tidak dapat menjalankan kewajibannya; (f) Antara suami dan istri terus menerus terjadi perselisihan dan pertengkaran.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 116',
                'isi_pasal' => 'Perceraian dapat terjadi karena alasan-alasan sebagaimana tercantum dalam pasal ini termasuk pelanggaran taklik talak.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989 jo. UU No. 3 Tahun 2006 jo. UU No. 50 Tahun 2009',
                'pasal' => 'Pasal 73',
                'isi_pasal' => 'Gugatan perceraian diajukan oleh istri atau kuasanya kepada Pengadilan yang daerah hukumnya meliputi tempat kediaman penggugat.',
            ],
            [
                'nama_undang' => 'PERMA Nomor 3 Tahun 2017',
                'pasal' => 'Pasal 1-15',
                'isi_pasal' => 'Pedoman mengadili perkara perempuan berhadapan dengan hukum.',
            ],
        ],
        'kewarisan' => [
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 171-193',
                'isi_pasal' => 'Ketentuan umum kewarisan, ahli waris, besarnya bagian, aul dan radd.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989 jo. UU No. 3 Tahun 2006',
                'pasal' => 'Pasal 49',
                'isi_pasal' => 'Pengadilan Agama bertugas dan berwenang memeriksa, memutus, dan menyelesaikan perkara di tingkat pertama antara orang-orang yang beragama Islam di bidang kewarisan.',
            ],
            [
                'nama_undang' => 'Al-Quran Surah An-Nisa',
                'pasal' => 'Ayat 11, 12, 176',
                'isi_pasal' => 'Ketentuan pembagian warisan dalam Islam menurut Al-Quran.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 51 K/AG/1999',
                'isi_pasal' => 'Ahli waris pengganti dalam hukum kewarisan Islam.',
            ],
        ],
        'harta_bersama' => [
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 35-37',
                'isi_pasal' => 'Harta benda yang diperoleh selama perkawinan menjadi harta bersama. Bila perkawinan putus karena perceraian, harta bersama diatur menurut hukumnya masing-masing.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 85-97',
                'isi_pasal' => 'Ketentuan tentang harta kekayaan dalam perkawinan, termasuk harta bersama dan harta bawaan.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 1448 K/Sip/1974',
                'isi_pasal' => 'Pembagian harta bersama setengah bagian untuk masing-masing pihak.',
            ],
            [
                'nama_undang' => 'SEMA Nomor 3 Tahun 2018',
                'pasal' => 'Tentang Pemberlakuan Hasil Rapat Pleno Kamar MA',
                'isi_pasal' => 'Pedoman penyelesaian perkara harta bersama.',
            ],
        ],
        'ekonomi_syariah' => [
            [
                'nama_undang' => 'Undang-Undang Nomor 21 Tahun 2008 tentang Perbankan Syariah',
                'pasal' => 'Pasal 55',
                'isi_pasal' => 'Penyelesaian sengketa Perbankan Syariah dilakukan oleh pengadilan dalam lingkungan Peradilan Agama.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Ekonomi Syariah (KHES)',
                'pasal' => 'Buku I-IV',
                'isi_pasal' => 'Ketentuan tentang subjek hukum, amwal, akad, dan zakat & hibah dalam ekonomi syariah.',
            ],
            [
                'nama_undang' => 'PERMA Nomor 2 Tahun 2008',
                'pasal' => 'Tentang KHES',
                'isi_pasal' => 'Kompilasi Hukum Ekonomi Syariah sebagai pedoman bagi hakim.',
            ],
            [
                'nama_undang' => 'Fatwa DSN-MUI',
                'pasal' => 'No. 04/DSN-MUI/IV/2000 tentang Murabahah',
                'isi_pasal' => 'Ketentuan akad jual beli murabahah dalam perbankan syariah.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 3 Tahun 2006',
                'pasal' => 'Pasal 49',
                'isi_pasal' => 'Perluasan kewenangan Pengadilan Agama termasuk sengketa ekonomi syariah.',
            ],
        ],
        'pembatalan_perkawinan' => [
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 22-28',
                'isi_pasal' => 'Perkawinan dapat dibatalkan apabila para pihak tidak memenuhi syarat-syarat untuk melangsungkan perkawinan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 70-76',
                'isi_pasal' => 'Ketentuan tentang batalnya perkawinan, termasuk perkawinan yang batal demi hukum dan yang dapat dibatalkan.',
            ],
            [
                'nama_undang' => 'Peraturan Pemerintah Nomor 9 Tahun 1975',
                'pasal' => 'Pasal 37-38',
                'isi_pasal' => 'Tata cara pembatalan perkawinan.',
            ],
        ],
        'hadlonah' => [
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 105-112',
                'isi_pasal' => 'Pemeliharaan anak (hadhanah): anak yang belum mumayyiz (12 tahun) berhak mendapat hadhanah dari ibunya, sedangkan anak yang sudah mumayyiz berhak memilih.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 41',
                'isi_pasal' => 'Akibat putusnya perkawinan karena perceraian terhadap anak: bapak tetap berkewajiban memelihara dan mendidik anak-anaknya.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 35 Tahun 2014 tentang Perlindungan Anak',
                'pasal' => 'Pasal 14',
                'isi_pasal' => 'Setiap anak berhak untuk diasuh oleh orang tuanya sendiri, kecuali jika ada alasan berdasarkan undang-undang.',
            ],
            [
                'nama_undang' => 'SEMA Nomor 1 Tahun 2017',
                'pasal' => 'Tentang Pemberlakuan Rumusan Hasil Rapat Pleno Kamar MA',
                'isi_pasal' => 'Pedoman mengenai hak asuh anak dan kepentingan terbaik bagi anak.',
            ],
        ],
        'hibah' => [
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 210-214',
                'isi_pasal' => 'Ketentuan tentang hibah: orang yang telah berumur sekurang-kurangnya 21 tahun, berakal sehat, dan tanpa paksaan dapat menghibahkan sebanyak-banyaknya 1/3 harta bendanya.',
            ],
            [
                'nama_undang' => 'Kitab Undang-Undang Hukum Perdata',
                'pasal' => 'Pasal 1666-1693',
                'isi_pasal' => 'Ketentuan tentang hibah sebagai perbuatan hukum.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 551 K/AG/1994',
                'isi_pasal' => 'Hibah yang melebihi 1/3 bagian dari harta pewaris dapat dibatalkan.',
            ],
        ],
    ];

    public function __construct(protected GeminiClient $geminiClient)
    {
    }

    /**
     * Dapatkan rekomendasi pasal berdasarkan jenis perkara
     */
    public function getRecommendations(CaseType $caseType, ?string $additionalContext = null): array
    {
        $cacheKey = "legal_recommendations_{$caseType->value}_" . md5($additionalContext ?? '');

        return Cache::remember($cacheKey, now()->addHours(24), function () use ($caseType, $additionalContext) {
            // Ambil peraturan dari database
            $regulations = $this->getRegulationsFromDatabase($caseType);

            // Jika database kosong, gunakan fallback
            if ($regulations->isEmpty()) {
                $regulations = collect($this->getBaseRegulations($caseType));
            }

            // Jika ada konteks tambahan, gunakan LLM untuk memperkaya rekomendasi
            if ($additionalContext) {
                $llmEnhanced = $this->enhanceWithLlm($caseType, $additionalContext, $regulations);

                if (!empty($llmEnhanced)) {
                    return $llmEnhanced;
                }
            }

            // Determine source - check if first item has 'id' key (from database) or not (fallback)
            $firstItem = $regulations->first();
            $source = is_array($firstItem) && isset($firstItem['id']) ? 'database' : 'fallback';

            return [
                'jenis_perkara' => $caseType->value,
                'label_perkara' => CaseType::labels()[$caseType->value] ?? $caseType->value,
                'regulations' => $regulations->toArray(),
                'llm_analysis' => null,
                'source' => $source,
            ];
        });
    }

    /**
     * Dapatkan rekomendasi berdasarkan perkara spesifik
     */
    public function getRecommendationsForCase(int $perkaraId): array
    {
        $perkara = \App\Models\Perkara::with('documents')->findOrFail($perkaraId);

        $additionalContext = $this->buildContextFromPerkara($perkara);

        return $this->getRecommendations($perkara->jenis_perkara, $additionalContext);
    }

    /**
     * Ambil peraturan dari database
     */
    protected function getRegulationsFromDatabase(CaseType $caseType): Collection
    {
        return Regulation::where('kategori_perkara', $caseType->value)
            ->orderBy('nama_undang')
            ->orderBy('pasal')
            ->get()
            ->map(fn($reg) => [
                'id' => $reg->id,
                'nama_undang' => $reg->nama_undang,
                'pasal' => $reg->pasal,
                'isi_pasal' => $reg->isi_pasal,
                'meta' => $reg->meta,
            ]);
    }

    /**
     * Ambil peraturan dasar (fallback)
     */
    protected function getBaseRegulations(CaseType $caseType): array
    {
        return self::BASE_REGULATIONS[$caseType->value] ?? [];
    }

    /**
     * Perkaya rekomendasi dengan LLM
     */
    protected function enhanceWithLlm(CaseType $caseType, string $context, Collection $regulations): array
    {
        try {
            $prompt = $this->buildLlmPrompt($caseType, $context, $regulations);
            $response = $this->geminiClient->analyze($prompt);

            if (empty($response)) {
                return [];
            }

            return [
                'jenis_perkara' => $caseType->value,
                'label_perkara' => CaseType::labels()[$caseType->value] ?? $caseType->value,
                'regulations' => $regulations->toArray(),
                'llm_analysis' => [
                    'summary' => $response['summary'] ?? null,
                    'relevant_articles' => $response['relevant_articles'] ?? [],
                    'recommendations' => $response['recommendations'] ?? [],
                    'legal_basis' => $response['legal_basis'] ?? [],
                ],
                'source' => 'llm_enhanced',
            ];
        } catch (\Throwable $e) {
            Log::warning('LLM enhancement failed for legal recommendations', [
                'case_type' => $caseType->value,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Bangun prompt untuk LLM
     */
    protected function buildLlmPrompt(CaseType $caseType, string $context, Collection $regulations): string
    {
        $regulationList = $regulations->map(fn($r) => "- {$r['nama_undang']} {$r['pasal']}: {$r['isi_pasal']}")->implode("\n");
        $label = CaseType::labels()[$caseType->value] ?? $caseType->value;

        return 
        <<<PROMPT
Anda adalah asisten hukum ahli Pengadilan Agama Indonesia. Analisis perkara {$label} berikut dan berikan rekomendasi pasal-pasal yang relevan.

KONTEKS PERKARA:
{$context}

DAFTAR PERATURAN YANG TERSEDIA:
{$regulationList}

Berikan analisis dalam format JSON:
{
    "summary": "Ringkasan singkat analisis hukum",
    "relevant_articles": [
        {
            "nama_undang": "Nama undang-undang",
            "pasal": "Nomor pasal",
            "relevance": "Penjelasan mengapa pasal ini relevan"
        }
    ],
    "recommendations": [
        "Rekomendasi pertimbangan hukum 1",
        "Rekomendasi pertimbangan hukum 2"
    ],
    "legal_basis": [
        "Dasar hukum 1",
        "Dasar hukum 2"
    ]
}
PROMPT;
    }

    /**
     * Bangun konteks dari perkara
     */
    protected function buildContextFromPerkara(\App\Models\Perkara $perkara): string
    {
        $context = "Nomor Perkara: {$perkara->nomor_perkara}\n";
        $context .= "Jenis: " . (CaseType::labels()[$perkara->jenis_perkara->value] ?? $perkara->jenis_perkara->value) . "\n";
        $context .= "Pengadilan Asal: {$perkara->pengadilan_asal}\n";

        if ($perkara->metadata) {
            $context .= "Informasi Tambahan: " . json_encode($perkara->metadata, JSON_UNESCAPED_UNICODE) . "\n";
        }

        // Tambahkan ringkasan dokumen jika ada
        foreach ($perkara->documents as $document) {
            if ($document->summaries && $document->summaries->isNotEmpty()) {
                $context .= "\nRingkasan Dokumen ({$document->nama_dokumen}): ";
                $context .= $document->summaries->first()->ringkasan ?? '';
            }
        }

        return $context;
    }

    /**
     * Dapatkan semua jenis perkara yang tersedia
     */
    public function getAvailableCaseTypes(): array
    {
        return collect(CaseType::cases())->map(fn($case) => [
            'value' => $case->value,
            'label' => CaseType::labels()[$case->value] ?? $case->value,
        ])->toArray();
    }
}
