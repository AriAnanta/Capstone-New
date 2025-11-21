<?php

namespace App\Jobs;

use App\Services\LegalReferenceService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateLegalReferences implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $perkaraId,
        public ?int $documentId = null
    ) {
    }

    public function handle(LegalReferenceService $service): void
    {
        $service->generateForPerkara($this->perkaraId, $this->documentId);
    }
}
