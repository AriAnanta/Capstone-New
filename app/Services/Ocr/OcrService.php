<?php

namespace App\Services\Ocr;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;
use Smalot\PdfParser\Parser;

class OcrService
{
    public function __construct(private readonly Parser $pdfParser)
    {
    }

    public function extractText(string $absolutePath, string $mimeType): ?string
    {
        if (str_contains($mimeType, 'text')) {
            return file_get_contents($absolutePath) ?: null;
        }

        if (str_contains($mimeType, 'pdf')) {
            $embeddedText = $this->extractEmbeddedPdfText($absolutePath);

            if ($this->isMeaningful($embeddedText)) {
                Log::info('PDF memiliki teks, melewati OCR', ['path' => $absolutePath]);
                return $embeddedText;
            }

            return $this->runCommand(config('services.ocr.pdf_command'), $absolutePath, 'PDF');
        }

        return $this->runCommand(config('services.ocr.image_command'), $absolutePath, 'IMAGE');
    }

    protected function extractEmbeddedPdfText(string $absolutePath): ?string
    {
        try {
            $document = $this->pdfParser->parseFile($absolutePath);
            $text = $document?->getText() ?? '';

            return $text ? trim($text) : null;
        } catch (\Throwable $exception) {
            Log::warning('Gagal membaca teks PDF langsung, fallback ke OCR', [
                'path' => $absolutePath,
                'message' => $exception->getMessage(),
            ]);

            return null;
        }
    }

    protected function isMeaningful(?string $text): bool
    {
        if (! $text) {
            return false;
        }

        $condensed = Str::replaceMatches('/\s+/', ' ', trim($text));

        return Str::length($condensed) >= 30;
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
