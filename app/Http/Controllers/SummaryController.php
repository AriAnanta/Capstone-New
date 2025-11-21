<?php

namespace App\Http\Controllers;

use App\Enums\SummaryType;
use App\Http\Resources\SummaryResource;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SummaryController extends Controller
{
    public function index(Document $document): JsonResponse
    {
        return SummaryResource::collection($document->summaries()->latest()->get())->response();
    }

    public function store(Request $request, Document $document): JsonResponse
    {
        $validated = $request->validate([
            'ringkasan' => ['required', 'string'],
            'tipe_ringkasan' => ['required', 'string', 'in:' . implode(',', array_column(SummaryType::cases(), 'value'))],
            'meta' => ['nullable', 'array'],
        ]);

        $summary = $document->summaries()->create([
            'ringkasan' => $validated['ringkasan'],
            'tipe_ringkasan' => $validated['tipe_ringkasan'],
            'meta' => $validated['meta'] ?? null,
            'created_by' => Auth::id(),
            'created_via' => 'manual',
        ]);

        return (new SummaryResource($summary))->response()->setStatusCode(201);
    }
}
