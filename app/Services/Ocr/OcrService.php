<?php

namespace App\Services\Ocr;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class OcrService
{
    public function extractText(string $absolutePath, string $mimeType): ?string
    {
        if (str_contains($mimeType, 'text')) {
            return file_get_contents($absolutePath) ?: null;
        }

        if (str_contains($mimeType, 'pdf')) {
            return $this->runCommand(config('services.ocr.pdf_command'), $absolutePath, 'PDF');
        }

        return $this->runCommand(config('services.ocr.image_command'), $absolutePath, 'IMAGE');
    }

    protected function runCommand(?string $command, string $absolutePath, string $context): ?string
    {
        if (! $command) {
            return null;
        }

        $process = Process::timeout(60)->run(str_replace('{input}', escapeshellarg($absolutePath), $command));

        if ($process->successful()) {
            return trim($process->output());
        }

        Log::warning("OCR {$context} gagal diproses", [
            'path' => $absolutePath,
            'command' => $command,
            'error' => $process->errorOutput(),
        ]);

        return null;
    }
}
