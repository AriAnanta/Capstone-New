<?php

namespace App\Console\Commands;

use App\Jobs\ProcessDocumentOcr;
use App\Models\Document;
use Illuminate\Console\Command;

class ReprocessDocumentOcr extends Command
{
    protected $signature = 'ocr:reprocess 
                            {--all : Reprocess all documents including those with existing OCR}
                            {--id= : Reprocess specific document by ID}';

    protected $description = 'Reprocess OCR for documents (failed or missing OCR text)';

    public function handle(): int
    {
        $this->info('Starting OCR reprocessing...');

        if ($this->option('id')) {
            return $this->processById((int) $this->option('id'));
        }

        $query = Document::query();

        if (!$this->option('all')) {
            // Only documents without OCR text or with very short text (likely failed)
            $query->where(function ($q) {
                $q->whereNull('teks_ocr')
                  ->orWhereRaw('LENGTH(teks_ocr) < 30');
            });
        }

        $documents = $query->get();

        if ($documents->isEmpty()) {
            $this->warn('No documents found to process.');
            return self::SUCCESS;
        }

        $this->info("Found {$documents->count()} documents to process.");

        $bar = $this->output->createProgressBar($documents->count());
        $bar->start();

        foreach ($documents as $document) {
            ProcessDocumentOcr::dispatch($document->id, true);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        $this->info('OCR jobs dispatched successfully!');
        $this->info('Run: php artisan queue:work to process them.');

        return self::SUCCESS;
    }

    private function processById(int $id): int
    {
        $document = Document::find($id);

        if (!$document) {
            $this->error("Document ID {$id} not found.");
            return self::FAILURE;
        }

        $this->info("Processing document ID: {$id}");
        $this->info("File: {$document->path_file}");

        ProcessDocumentOcr::dispatch($document->id, true);

        $this->info('OCR job dispatched successfully!');
        $this->info('Run: php artisan queue:work --once to process it.');

        return self::SUCCESS;
    }
}
