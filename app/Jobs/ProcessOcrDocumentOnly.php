<?php

namespace App\Jobs;

use App\Models\OcrDocument;
use App\Services\Ocr\OcrService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessOcrDocumentOnly implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300; // 5 minutes
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $ocrDocumentId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(OcrService $ocrService): void
    {
        $document = OcrDocument::find($this->ocrDocumentId);

        if (!$document) {
            Log::warning("OcrDocument {$this->ocrDocumentId} not found");
            return;
        }

        try {
            // Set status to processing
            $document->update(['status_ocr' => 'processing']);
            
            Log::info("Starting OCR processing for OcrDocument {$document->id}");

            // Get full path dan mime type
            $fullPath = storage_path('app/public/' . $document->path_file);
            $mimeType = mime_content_type($fullPath) ?: 'application/octet-stream';

            // Proses OCR
            $ocrText = $ocrService->extractText($fullPath, $mimeType);

            // Update dokumen dengan hasil OCR dan status completed
            $document->update([
                'teks_ocr' => $ocrText,
                'status_ocr' => 'completed',
                'error_message' => null,
            ]);

            Log::info("OCR processing completed for OcrDocument {$document->id}");
        } catch (\Exception $e) {
            // Set status to failed dengan error message
            $document->update([
                'status_ocr' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            
            Log::error("OCR processing failed for OcrDocument {$document->id}: {$e->getMessage()}");
            throw $e;
        }
    }
}
