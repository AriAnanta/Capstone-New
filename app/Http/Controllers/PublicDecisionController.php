<?php

namespace App\Http\Controllers;

use App\Http\Resources\PerkaraResource;
use App\Models\Perkara;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicDecisionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perkaras = Perkara::query()
            ->where('status', 'published')
            ->when($request->filled('jenis_perkara'), fn ($q) => $q->where('jenis_perkara', $request->string('jenis_perkara')))
            ->when($request->filled('search'), function ($q) use ($request) {
                $term = $request->string('search');
                $q->where(function ($qq) use ($term) {
                    $qq->where('nomor_perkara', 'like', "%{$term}%")
                        ->orWhere('pengadilan_asal', 'like', "%{$term}%");
                });
            })
            ->with([
                'documents' => function ($q) {
                    $q->where('jenis_dokumen', 'putusan')->with('summaries');
                },
                'recommendations',
            ])
            ->latest()
            ->paginate($request->integer('per_page', 12));

        return PerkaraResource::collection($perkaras)->response();
    }
}
