<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePerkaraRequest;
use App\Http\Requests\UpdatePerkaraRequest;
use App\Http\Resources\PerkaraResource;
use App\Models\Perkara;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PerkaraController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Perkara::query()
            ->with(['creator', 'assignee'])
            ->when($request->filled('jenis_perkara'), fn ($q) => $q->where('jenis_perkara', $request->string('jenis_perkara')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('search'), function ($q) use ($request) {
                $term = $request->string('search');
                $q->where(function ($qq) use ($term) {
                    $qq->where('nomor_perkara', 'like', "%{$term}%")
                        ->orWhere('pengadilan_asal', 'like', "%{$term}%");
                });
            })
            ->latest();

        $perkaras = $query->paginate($request->integer('per_page', 15));

        return PerkaraResource::collection($perkaras)->response();
    }

    public function store(StorePerkaraRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['created_by'] = optional($request->user())->getKey() ?? Auth::id();

        $perkara = Perkara::create($data);

        return (new PerkaraResource($perkara->load(['creator', 'assignee'])))->response()->setStatusCode(201);
    }

    public function show(Perkara $perkara): JsonResponse
    {
        $perkara->load(['creator', 'assignee', 'documents.tags', 'recommendations']);

        return (new PerkaraResource($perkara))->response();
    }

    public function update(UpdatePerkaraRequest $request, Perkara $perkara): JsonResponse
    {
        $perkara->update($request->validated());

        return (new PerkaraResource($perkara->refresh()->load(['creator', 'assignee'])))->response();
    }

    public function destroy(Perkara $perkara): JsonResponse
    {
        $perkara->delete();

        return response()->json(['message' => 'Perkara dihapus']);
    }
}
