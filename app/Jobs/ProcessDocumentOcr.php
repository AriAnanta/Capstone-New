<?php

namespace App\Jobs;

use App\Models\Document;
use App\Services\Ocr\OcrService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessDocumentOcr implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $documentId,
        public bool $force = false
    ) {
    }

    public function handle(OcrService $ocrService): void
    {
        $document = Document::find($this->documentId);

        if (! $document) {
            return;
        }

        if (! $this->force && filled($document->teks_ocr)) {
            return;
        }

        $disk = Storage::disk('local');

        if (! $disk->exists($document->path_file)) {
            Log::warning('Dokumen tidak ditemukan untuk OCR', ['document_id' => $document->id]);
            return;
        }

        $absolutePath = $disk->path($document->path_file);

        $text = $ocrService->extractText($absolutePath, $document->format_file);

        if ($text !== null) {
            $document->update(['teks_ocr' => $text]);
        }
    }
}
