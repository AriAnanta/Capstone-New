<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Models\Tag;
use App\Services\DocumentProcessingPipeline;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $documents = Document::query()
            ->with(['perkara', 'tags', 'summaries', 'recommendations'])
            ->when($request->filled('jenis_dokumen'), fn ($q) => $q->where('jenis_dokumen', $request->string('jenis_dokumen')))
            ->when($request->filled('perkara_id'), fn ($q) => $q->where('perkara_id', $request->integer('perkara_id')))
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return DocumentResource::collection($documents)->response();
    }

    public function store(StoreDocumentRequest $request, DocumentProcessingPipeline $pipeline): JsonResponse
    {
        $file = $request->file('dokumen');
        $folder = 'documents/' . $request->input('perkara_id');
        $filename = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $filename, 'local');

        $uploaderId = optional($request->user())->getKey() ?? Auth::id();

        $document = Document::create([
            'perkara_id' => $request->integer('perkara_id'),
            'jenis_dokumen' => $request->input('jenis_dokumen'),
            'path_file' => $path,
            'format_file' => $file->getClientMimeType(),
            'teks_ocr' => null,
            'diunggah_oleh' => $uploaderId,
            'metadata' => $request->input('metadata'),
        ]);

        $this->syncTags($document, $request->input('tags'));

        $pipeline->handle($document);

        return (new DocumentResource($document->load(['tags', 'summaries', 'recommendations'])))->response()->setStatusCode(201);
    }

    public function show(Document $document): JsonResponse
    {
        $document->load(['tags', 'summaries', 'recommendations']);

        return (new DocumentResource($document))->response();
    }

    public function update(UpdateDocumentRequest $request, Document $document, DocumentProcessingPipeline $pipeline): JsonResponse
    {
        $document->update($request->safe()->except('tags'));
        $this->syncTags($document, $request->has('tags') ? $request->input('tags') : null);

        if ($request->boolean('reprocess', false)) {
            $pipeline->handle($document, forceOcr: $request->boolean('force_ocr', false));
        }

        return (new DocumentResource($document->refresh()->load(['tags', 'summaries', 'recommendations'])))->response();
    }

    public function destroy(Document $document): JsonResponse
    {
        Storage::disk('local')->delete($document->path_file);
        $document->delete();

        return response()->json(['message' => 'Dokumen dihapus']);
    }

    protected function syncTags(Document $document, ?array $tags): void
    {
        if ($tags === null) {
            return;
        }

        $tagNames = collect($tags)->filter()->unique();

        if ($tagNames->isEmpty()) {
            $document->tags()->detach();
            return;
        }

        $tagIds = $tagNames->map(function ($tag) {
            return Tag::firstOrCreate(['name' => $tag])->id;
        });

        $document->tags()->sync($tagIds->all());
    }
}
