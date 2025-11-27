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
            return $this->extractPdfText($absolutePath);
        }

        return $this->runImageOcr($absolutePath);
    }

    protected function extractPdfText(string $absolutePath): ?string
    {
        try {
            $document = $this->pdfParser->parseFile($absolutePath);
            $embeddedText = $document?->getText() ?? '';
            $pageCount = count($document->getPages());
            
            // Jika ada embedded text, cek kualitasnya
            if ($embeddedText && $this->hasGoodTextQuality($embeddedText, $pageCount)) {
                Log::info('PDF memiliki teks berkualitas baik, melewati OCR', [
                    'path' => $absolutePath,
                    'pages' => $pageCount,
                    'text_length' => strlen($embeddedText)
                ]);
                return trim($embeddedText);
            }
            
            // Text tidak cukup atau kualitas buruk, gunakan OCR
            Log::info('PDF text tidak memadai, menggunakan OCR', [
                'path' => $absolutePath,
                'pages' => $pageCount,
                'text_length' => strlen($embeddedText ?? '')
            ]);
            
            return $this->extractTextFromScannedPdf($absolutePath);
            
        } catch (\Throwable $exception) {
            Log::warning('Gagal membaca teks PDF langsung, fallback ke OCR', [
                'path' => $absolutePath,
                'message' => $exception->getMessage(),
            ]);

            return $this->extractTextFromScannedPdf($absolutePath);
        }
    }

    protected function hasGoodTextQuality(?string $text, int $pageCount): bool
    {
        if (!$text) {
            return false;
        }

        $condensed = Str::replaceMatches('/\s+/', ' ', trim($text));
        $textLength = Str::length($condensed);
        
        // Minimum 30 karakter untuk single page
        if ($textLength < 30) {
            return false;
        }
        
        // Untuk multi-page, cek rata-rata per halaman
        if ($pageCount > 1) {
            $avgPerPage = $textLength / $pageCount;
            
            // Minimal 300 karakter per halaman untuk dianggap "good quality"
            // (dokumen legal biasanya 1000-2000 char per halaman)
            if ($avgPerPage < 300) {
                Log::info('Text quality insufficient for multi-page PDF', [
                    'pages' => $pageCount,
                    'total_length' => $textLength,
                    'avg_per_page' => round($avgPerPage)
                ]);
                return false;
            }
        }
        
        return true;
    }

    protected function extractTextFromScannedPdf(string $pdfPath): ?string
    {
        $tempDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'pdf_ocr_' . uniqid();
        
        try {
            if (!mkdir($tempDir, 0755, true)) {
                Log::error('Gagal membuat direktori temporary untuk OCR PDF');
                return null;
            }

            // Konversi PDF ke gambar
            $imageFiles = $this->convertPdfToImages($pdfPath, $tempDir);
            
            if (empty($imageFiles)) {
                Log::warning('Tidak ada gambar yang berhasil diekstrak dari PDF', ['path' => $pdfPath]);
                return null;
            }

            // OCR setiap halaman
            $allText = [];
            foreach ($imageFiles as $imageFile) {
                $text = $this->runImageOcr($imageFile);
                if ($text) {
                    $allText[] = $text;
                }
            }

            return !empty($allText) ? implode("\n\n", $allText) : null;
            
        } finally {
            // Cleanup temporary files
            if (is_dir($tempDir)) {
                $this->deleteDirectory($tempDir);
            }
        }
    }

    protected function convertPdfToImages(string $pdfPath, string $outputDir): array
    {
        // Normalize paths untuk Windows
        $pdfPath = str_replace('/', DIRECTORY_SEPARATOR, $pdfPath);
        $outputPattern = $outputDir . DIRECTORY_SEPARATOR . 'page_%04d.png';
        
        // Coba menggunakan Ghostscript terlebih dahulu
        // Untuk Windows, gunakan quote langsung tanpa escapeshellarg untuk menghindari double-escaping
        $gsCommand = sprintf(
            'gswin64c -dNOPAUSE -dBATCH -sDEVICE=png16m -r300 "-sOutputFile=%s" "%s"',
            $outputPattern,
            $pdfPath
        );
        
        $process = Process::timeout(120)->run($gsCommand);
        
        if (!$process->successful()) {
            // Fallback ke ImageMagick jika Ghostscript gagal
            Log::info('Ghostscript gagal, mencoba ImageMagick', [
                'gs_error' => $process->errorOutput(),
                'command' => $gsCommand
            ]);
            
            $imagickCommand = sprintf(
                'magick -density 300 "%s" "%s"',
                $pdfPath,
                $outputPattern
            );
            
            $process = Process::timeout(120)->run($imagickCommand);
            
            if (!$process->successful()) {
                Log::error('Gagal mengkonversi PDF ke gambar', [
                    'path' => $pdfPath,
                    'imagick_error' => $process->errorOutput(),
                    'command' => $imagickCommand
                ]);
                return [];
            }
        }

        // Ambil semua file gambar yang dihasilkan
        $images = glob($outputDir . DIRECTORY_SEPARATOR . 'page_*.png');
        sort($images);
        
        Log::info('PDF berhasil dikonversi ke gambar', [
            'pdf_path' => $pdfPath,
            'images_count' => count($images)
        ]);
        
        return $images ?: [];
    }

    protected function runImageOcr(string $imagePath): ?string
    {
        $tesseractPath = config('services.ocr.tesseract_path', 'tesseract');
        $lang = config('services.ocr.tesseract_lang', 'ind+eng');
        $outputFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'ocr_output_' . uniqid();
        
        // Normalize paths
        $imagePath = str_replace('/', DIRECTORY_SEPARATOR, $imagePath);
        
        $command = sprintf(
            '"%s" "%s" "%s" -l %s --oem %s --psm %s',
            $tesseractPath,
            $imagePath,
            $outputFile,
            $lang,
            config('services.ocr.tesseract_oem', '3'),
            config('services.ocr.tesseract_psm', '3')
        );

        $process = Process::timeout(60)->run($command);

        try {
            if ($process->successful() && file_exists($outputFile . '.txt')) {
                $text = file_get_contents($outputFile . '.txt');
                return $text ? trim($text) : null;
            }

            Log::warning('OCR gambar gagal diproses', [
                'path' => $imagePath,
                'command' => $command,
                'error' => $process->errorOutput(),
            ]);

            return null;
        } finally {
            // Cleanup output file
            if (file_exists($outputFile . '.txt')) {
                @unlink($outputFile . '.txt');
            }
        }
    }

    protected function deleteDirectory(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }

        $files = array_diff(scandir($dir), ['.', '..']);
        
        foreach ($files as $file) {
            $path = $dir . DIRECTORY_SEPARATOR . $file;
            is_dir($path) ? $this->deleteDirectory($path) : @unlink($path);
        }
        
        @rmdir($dir);
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