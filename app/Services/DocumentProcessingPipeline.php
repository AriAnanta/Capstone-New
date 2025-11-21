<?php

namespace App\Services;

use App\Jobs\GenerateDocumentSummary;
use App\Jobs\GenerateLegalReferences;
use App\Jobs\ProcessDocumentOcr;
use App\Models\Document;
use Illuminate\Support\Facades\Bus;

class DocumentProcessingPipeline
{
    public function handle(Document $document, bool $forceOcr = false): void
    {
        Bus::chain([
            new ProcessDocumentOcr($document->id, $forceOcr),
            new GenerateDocumentSummary($document->id),
            new GenerateLegalReferences($document->perkara_id, $document->id),
        ])->dispatch();
    }
}
