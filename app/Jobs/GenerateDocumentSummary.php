<?php

namespace App\Jobs;

use App\Models\Document;
use App\Services\Summarization\SummarizerService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateDocumentSummary implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $documentId)
    {
    }

    public function handle(SummarizerService $summarizerService): void
    {
        $document = Document::with('perkara')->find($this->documentId);

        if (! $document) {
            return;
        }

        $summarizerService->summarizeDocument($document);
    }
}
