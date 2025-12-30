<?php

namespace App\Http\Controllers;

use App\Services\AnonymizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AnonymizationController extends Controller
{
    protected AnonymizationService $service;

    public function __construct(AnonymizationService $service)
    {
        $this->service = $service;
    }

    /**
     * Proses anonimisasi dari file upload
     */
    public function processFile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:doc,docx,rtf,txt|max:10240', // Max 10MB
            'case_type' => 'nullable|string|in:cerai_talak,cerai_gugat,hadhanah,waris,umum',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $file = $request->file('file');
            
            // Simpan file sementara
            $tempPath = $file->storeAs(
                'temp/anonymization',
                Str::uuid() . '.' . $file->getClientOriginalExtension(),
                'local'
            );
            
            $fullPath = Storage::disk('local')->path($tempPath);
            
            // Proses anonimisasi
            $result = $this->service->processDocument($fullPath, [
                'case_type' => $request->input('case_type', 'umum'),
            ]);
            
            // Hapus file temp
            Storage::disk('local')->delete($tempPath);
            
            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['error'] ?? 'Gagal memproses dokumen',
                ], 500);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Dokumen berhasil dianonimkan',
                'data' => [
                    'original_text' => $result['original_text'],
                    'anonymized_text' => $result['anonymized_text'],
                    'entities_found' => $result['entities_found'],
                    'entities_count' => $result['entities_count'],
                    'original_filename' => $file->getClientOriginalName(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Proses anonimisasi dari teks langsung
     */
    public function processText(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|min:50',
            'case_type' => 'nullable|string|in:cerai_talak,cerai_gugat,hadhanah,waris,umum',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $result = $this->service->anonymize(
                $request->input('text'),
                ['case_type' => $request->input('case_type', 'umum')]
            );
            
            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['error'] ?? 'Gagal memproses teks',
                ], 500);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Teks berhasil dianonimkan',
                'data' => [
                    'original_text' => $result['original_text'],
                    'anonymized_text' => $result['anonymized_text'],
                    'entities_found' => $result['entities_found'],
                    'entities_count' => $result['entities_count'],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download hasil anonimisasi sebagai file
     */
    public function download(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string',
            'filename' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $filename = $request->input('filename', 'dokumen_anonim');
            $filename = pathinfo($filename, PATHINFO_FILENAME) . '_anonim.txt';
            
            $content = $request->input('text');
            
            return response($content)
                ->header('Content-Type', 'text/plain; charset=utf-8')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengunduh: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get jenis perkara yang didukung
     */
    public function caseTypes(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                ['value' => 'cerai_talak', 'label' => 'Cerai Talak'],
                ['value' => 'cerai_gugat', 'label' => 'Cerai Gugat'],
                ['value' => 'hadhanah', 'label' => 'Hadhanah (Penguasaan Anak)'],
                ['value' => 'waris', 'label' => 'Kewarisan'],
                ['value' => 'umum', 'label' => 'Umum/Lainnya'],
            ],
        ]);
    }
}
