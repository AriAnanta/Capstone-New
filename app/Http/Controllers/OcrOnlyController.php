<?php

namespace App\Http\Controllers;

use App\Models\OcrDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Jobs\ProcessOcrDocumentOnly;

class OcrOnlyController extends Controller
{
    /**
     * Get all OCR-only documents
     */
    public function index(Request $request)
    {
        $query = OcrDocument::with(['uploader'])
            ->orderBy('tanggal_upload', 'desc');

        // Search by filename or OCR text
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_file', 'like', "%{$search}%")
                  ->orWhere('teks_ocr', 'like', "%{$search}%")
                  ->orWhere('kategori', 'like', "%{$search}%");
            });
        }

        $documents = $query->paginate(20);

        return response()->json($documents);
    }

    /**
     * Upload document for OCR-only processing
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB max
            'kategori' => 'nullable|string|max:100',
            'keterangan' => 'nullable|string|max:500',
        ]);

        $file = $request->file('file');
        
        // Store file
        $path = $file->store('ocr-documents', 'public');
        
        // Create document record
        $document = OcrDocument::create([
            'nama_file' => $file->getClientOriginalName(),
            'path_file' => $path,
            'format_file' => $file->getClientOriginalExtension(),
            'ukuran_file' => $file->getSize(),
            'kategori' => $request->input('kategori', 'umum'),
            'keterangan' => $request->input('keterangan'),
            'uploaded_by' => Auth::id(),
            'tanggal_upload' => now(),
            'status_ocr' => 'pending',
        ]);

        // Dispatch OCR job only
        ProcessOcrDocumentOnly::dispatch($document->id);

        return response()->json([
            'message' => 'Dokumen berhasil diunggah. Proses OCR sedang berjalan...',
            'document' => $document->load('uploader'),
        ], 201);
    }

    /**
     * Get single OCR document
     */
    public function show($id)
    {
        $document = OcrDocument::with(['uploader'])->findOrFail($id);

        return response()->json($document);
    }

    /**
     * Delete OCR document (hard delete)
     */
    public function destroy($id)
    {
        $document = OcrDocument::findOrFail($id);

        // Delete file from storage
        if ($document->path_file && Storage::disk('public')->exists($document->path_file)) {
            Storage::disk('public')->delete($document->path_file);
        }

        // Hard delete from database
        $document->forceDelete();

        return response()->json([
            'message' => 'Dokumen berhasil dihapus permanen.',
        ]);
    }

    /**
     * Reprocess OCR for a document
     */
    public function reprocess($id)
    {
        $document = OcrDocument::findOrFail($id);

        // Clear existing OCR and reset status
        $document->update([
            'teks_ocr' => null,
            'status_ocr' => 'pending',
            'error_message' => null,
        ]);

        // Dispatch OCR job
        ProcessOcrDocumentOnly::dispatch($document->id);

        return response()->json([
            'message' => 'Proses OCR ulang telah dimulai.',
        ]);
    }

    /**
     * Download original file
     */
    public function download($id)
    {
        $document = OcrDocument::findOrFail($id);

        if (!$document->path_file || !Storage::disk('public')->exists($document->path_file)) {
            return response()->json(['message' => 'File tidak ditemukan'], 404);
        }

        $filePath = Storage::disk('public')->path($document->path_file);

        return response()->download($filePath, $document->nama_file);
    }
}
