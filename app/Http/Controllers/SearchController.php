<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\OcrDocument;
use App\Models\Perkara;
use App\Models\SearchHistory;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => 'nullable|string|max:200',
            'jenis_perkara' => 'nullable|string|max:100',
            'jenis_dokumen' => 'nullable|string|max:100',
            'kategori_ocr' => 'nullable|string|max:100', // Filter untuk OCR-only documents
            'source' => 'nullable|string|in:all,documents,ocr_only', // Filter source: all, documents, atau ocr_only
            'per_page' => 'nullable|integer|min:1|max:50',
            'page' => 'nullable|integer|min:1',
        ]);

        $term = trim((string) ($validated['q'] ?? ''));
        $driver = DB::connection()->getDriverName();
        $perPage = (int) ($validated['per_page'] ?? 15);
        $source = $validated['source'] ?? 'all';

        // Escape special characters untuk LIKE query
        $escapedTerm = $this->escapeLikeValue($term);

        $allResults = collect();

        // Query Documents (jika source adalah 'all' atau 'documents')
        if (in_array($source, ['all', 'documents'])) {
            $documentsQuery = Document::query()
                ->with([
                    'perkara.creator:id,name,email,role',
                    'perkara.assignee:id,name,email,role',
                    'tags:id,name',
                    'summaries' => fn ($q) => $q->latest(),
                    'recommendations' => fn ($q) => $q->latest()->limit(1),
                ])
                ->when(!empty($validated['jenis_dokumen']), fn ($q) => $q->where('jenis_dokumen', $validated['jenis_dokumen']))
                ->when(!empty($validated['jenis_perkara']), function ($q) use ($validated) {
                    $q->whereHas('perkara', fn ($p) => $p->where('jenis_perkara', $validated['jenis_perkara']));
                })
                ->when($term !== '', function ($q) use ($term, $escapedTerm, $driver) {
                    $q->where(function ($qq) use ($term, $escapedTerm, $driver) {
                        $qq->where('teks_ocr', 'like', "%{$escapedTerm}%")
                            ->orWhereHas('summaries', fn ($s) => $s->where('ringkasan', 'like', "%{$escapedTerm}%"))
                            ->orWhereHas('tags', fn ($t) => $t->where('name', 'like', "%{$escapedTerm}%"))
                            ->orWhereHas('perkara', fn ($p) => $p->where('nomor_perkara', 'like', "%{$escapedTerm}%"))
                            ->orWhereHas('recommendations', function ($r) use ($term, $escapedTerm, $driver) {
                                $r->where('pertimbangan_llm', 'like', "%{$escapedTerm}%");

                                if ($driver === 'mysql') {
                                    $r->orWhereRaw('JSON_SEARCH(daftar_pasal, "all", ?) IS NOT NULL', [$term]);
                                }
                            });
                    });
                })
                ->latest('tanggal_upload')
                ->get();

            $allResults = $allResults->merge($documentsQuery);
        }

        // Query OcrDocuments (jika source adalah 'all' atau 'ocr_only')
        if (in_array($source, ['all', 'ocr_only'])) {
            $ocrQuery = OcrDocument::query()
                ->with(['uploader:id,name,email,role'])
                ->where('status_ocr', 'completed') // Hanya tampilkan yang sudah selesai OCR
                ->when(!empty($validated['kategori_ocr']), fn ($q) => $q->where('kategori', $validated['kategori_ocr']))
                ->when($term !== '', function ($q) use ($escapedTerm) {
                    $q->where(function ($qq) use ($escapedTerm) {
                        $qq->where('teks_ocr', 'like', "%{$escapedTerm}%")
                            ->orWhere('nama_file', 'like', "%{$escapedTerm}%")
                            ->orWhere('keterangan', 'like', "%{$escapedTerm}%");
                    });
                })
                ->latest('tanggal_upload')
                ->get();

            $allResults = $allResults->merge($ocrQuery);
        }

        // Sort by tanggal_upload dan paginate manual
        $allResults = $allResults->sortByDesc('tanggal_upload')->values();
        $total = $allResults->count();
        $currentPage = (int) ($validated['page'] ?? 1);
        $offset = ($currentPage - 1) * $perPage;
        $paginatedResults = $allResults->slice($offset, $perPage)->values();

        $items = $paginatedResults->map(function ($item) use ($term) {
            // Check if it's OcrDocument or Document
            if ($item instanceof OcrDocument) {
                // Map OcrDocument
                $snippet = $this->buildSnippet([
                    'ocr' => $item->teks_ocr,
                ], $term);

                return [
                    'id' => $item->id,
                    'source_type' => 'ocr_only', // Identifier untuk frontend
                    'nama_file' => $item->nama_file,
                    'kategori_ocr' => $item->kategori,
                    'keterangan' => $item->keterangan,
                    'tanggal_upload' => optional($item->tanggal_upload)->toISOString(),
                    'format_file' => $item->format_file,
                    'uploader' => $item->uploader,
                    'snippet' => $snippet,
                    'ocr_text' => $item->teks_ocr,
                ];
            } else {
                // Map Document (existing logic)
                $summaries = $item->summaries;
                $summaryPublik = $summaries->firstWhere('tipe_ringkasan', 'publik')?->ringkasan;
                $summaryInternal = $summaries->firstWhere('tipe_ringkasan', 'internal')?->ringkasan;
                $summaryLegal = $summaries->firstWhere('tipe_ringkasan', 'pertimbangan_hukum')?->ringkasan;
                $recommendationText = optional($item->recommendations->first())->pertimbangan_llm;

                $snippet = $this->buildSnippet([
                    'summary_publik' => $summaryPublik,
                    'summary_internal' => $summaryInternal,
                    'summary_legal' => $summaryLegal,
                    'recommendation' => $recommendationText,
                    'ocr' => $item->teks_ocr,
                ], $term);

                return [
                    'id' => $item->id,
                    'source_type' => 'document', // Identifier untuk frontend
                    'jenis_dokumen' => $item->jenis_dokumen?->value ?? null,
                    'tanggal_upload' => optional($item->tanggal_upload)->toISOString(),
                    'format_file' => $item->format_file,
                    'perkara' => $item->perkara ? [
                        'id' => $item->perkara->id,
                        'nomor_perkara' => $item->perkara->nomor_perkara,
                        'jenis_perkara' => $item->perkara->jenis_perkara?->value ?? null,
                        'status' => $item->perkara->status,
                        'creator' => $item->perkara->creator,
                        'assignee' => $item->perkara->assignee,
                    ] : null,
                    'tags' => $item->tags?->map(fn ($t) => ['id' => $t->id, 'name' => $t->name])->values(),
                    'snippet' => $snippet,
                    'summaries' => [
                        'publik' => $summaryPublik,
                        'internal' => $summaryInternal,
                        'legal' => $summaryLegal,
                    ],
                    'ocr_text' => $item->teks_ocr,
                ];
            }
        })->values();

        $filtersForHistory = collect($validated)
            ->except(['page', 'per_page'])
            ->filter(fn ($v) => $v !== null && $v !== '' && $v !== [])
            ->all();

        if (!empty($filtersForHistory)) {
            SearchHistory::create([
                'user_id' => $request->user()->id,
                'query' => $term !== '' ? $term : null,
                'filters' => $filtersForHistory,
                'results_count' => $total,
            ]);
        }

        return response()->json([
            'data' => [
                'items' => $items,
                'meta' => [
                    'current_page' => $currentPage,
                    'last_page' => (int) ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total,
                ],
            ],
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $items = SearchHistory::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->limit(10)
            ->get(['id', 'query', 'filters', 'results_count', 'created_at'])
            ->map(function (SearchHistory $h) {
                return [
                    'id' => $h->id,
                    'query' => $h->query,
                    'filters' => $h->filters,
                    'results_count' => $h->results_count,
                    'created_at' => optional($h->created_at)->toISOString(),
                ];
            });

        return response()->json([
            'data' => [
                'items' => $items,
            ],
        ]);
    }

    public function suggestions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'term' => 'nullable|string|max:200',
        ]);

        $term = trim((string) ($validated['term'] ?? ''));
        $escapedTerm = $this->escapeLikeValue($term);

        $historyQueries = SearchHistory::query()
            ->where('user_id', $request->user()->id)
            ->when($term !== '', fn ($q) => $q->where('query', 'like', "%{$escapedTerm}%"))
            ->whereNotNull('query')
            ->select('query')
            ->groupBy('query')
            ->orderByRaw('MAX(created_at) DESC')
            ->limit(5)
            ->pluck('query');

        $tagSuggestions = Tag::query()
            ->when($term !== '', fn ($q) => $q->where('name', 'like', "%{$escapedTerm}%"))
            ->orderBy('name')
            ->limit(5)
            ->pluck('name');

        $perkaraSuggestions = Perkara::query()
            ->when($term !== '', fn ($q) => $q->where('nomor_perkara', 'like', "%{$escapedTerm}%"))
            ->orderBy('nomor_perkara')
            ->limit(5)
            ->pluck('nomor_perkara');

        $items = collect()
            ->merge($historyQueries->map(fn ($q) => ['type' => 'history', 'value' => $q, 'label' => $q]))
            ->merge($tagSuggestions->map(fn ($t) => ['type' => 'tag', 'value' => $t, 'label' => "Tag: {$t}"]))
            ->merge($perkaraSuggestions->map(fn ($p) => ['type' => 'perkara', 'value' => $p, 'label' => "Perkara: {$p}"]))
            ->values();

        return response()->json([
            'data' => [
                'items' => $items,
            ],
        ]);
    }

    private function buildSnippet(array $sources, string $term): array
    {
        $candidates = [
            ['source' => 'ringkasan_publik', 'text' => $sources['summary_publik'] ?? null],
            ['source' => 'ringkasan_internal', 'text' => $sources['summary_internal'] ?? null],
            ['source' => 'ringkasan_legal', 'text' => $sources['summary_legal'] ?? null],
            ['source' => 'pertimbangan_llm', 'text' => $sources['recommendation'] ?? null],
            ['source' => 'ocr', 'text' => $sources['ocr'] ?? null],
        ];

        foreach ($candidates as $candidate) {
            $text = (string) ($candidate['text'] ?? '');
            if ($text === '') continue;

            if ($term === '') {
                return [
                    'source' => $candidate['source'],
                    'text' => $this->truncate($text, 260),
                ];
            }

            $pos = mb_stripos($text, $term);
            if ($pos === false) continue;

            $start = max(0, $pos - 120);
            $slice = mb_substr($text, $start, 260);

            return [
                'source' => $candidate['source'],
                'text' => ($start > 0 ? '…' : '') . $slice . '…',
            ];
        }

        // fallback - prioritaskan ringkasan publik, lalu internal, lalu OCR
        $fallbackText = (string) (
            $sources['summary_publik'] ?? 
            $sources['summary_internal'] ?? 
            $sources['summary_legal'] ?? 
            $sources['ocr'] ?? 
            ''
        );

        $fallbackSource = 'none';
        if ($fallbackText !== '') {
            if (isset($sources['summary_publik'])) $fallbackSource = 'ringkasan_publik';
            elseif (isset($sources['summary_internal'])) $fallbackSource = 'ringkasan_internal';
            elseif (isset($sources['summary_legal'])) $fallbackSource = 'ringkasan_legal';
            elseif (isset($sources['ocr'])) $fallbackSource = 'ocr';
        }

        return [
            'source' => $fallbackSource,
            'text' => $this->truncate($fallbackText, 260),
        ];
    }

    private function truncate(string $text, int $max): string
    {
        $text = trim($text);
        if ($text === '') return '';
        if (mb_strlen($text) <= $max) return $text;
        return mb_substr($text, 0, $max) . '…';
    }

    private function escapeLikeValue(string $value): string
    {
        // Escape special characters untuk MySQL LIKE: %, _, \
        // Tidak perlu escape karakter lain seperti /, . karena itu bukan wildcard
        return str_replace(
            ['\\', '%', '_'],
            ['\\\\', '\\%', '\\_'],
            $value
        );
    }

    public function filterOptions(Request $request): JsonResponse
    {
        // Ambil distinct jenis_dokumen dari dokumen yang sudah ada
        $jenisDocuments = Document::query()
            ->select('jenis_dokumen')
            ->distinct()
            ->whereNotNull('jenis_dokumen')
            ->get()
            ->map(fn ($d) => $d->jenis_dokumen?->value)
            ->filter()
            ->values();

        // Ambil distinct jenis_perkara dari perkara yang punya dokumen
        $jenisPerkaras = Perkara::query()
            ->whereHas('documents')
            ->select('jenis_perkara')
            ->distinct()
            ->whereNotNull('jenis_perkara')
            ->get()
            ->map(fn ($p) => $p->jenis_perkara?->value)
            ->filter()
            ->values();

        // Ambil distinct kategori dari OCR documents
        $kategoriOcr = OcrDocument::query()
            ->select('kategori')
            ->distinct()
            ->whereNotNull('kategori')
            ->where('status_ocr', 'completed')
            ->pluck('kategori')
            ->filter()
            ->values();

        return response()->json([
            'data' => [
                'jenis_dokumen' => $jenisDocuments,
                'jenis_perkara' => $jenisPerkaras,
                'kategori_ocr' => $kategoriOcr,
            ],
        ]);
    }
}
