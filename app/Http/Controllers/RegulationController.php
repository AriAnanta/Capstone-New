<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegulationRequest;
use App\Http\Requests\UpdateRegulationRequest;
use App\Http\Resources\RegulationResource;
use App\Models\Regulation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegulationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Regulation::query()
            ->when($request->filled('kategori_perkara'), fn ($q) => $q->where('kategori_perkara', $request->string('kategori_perkara')))
            ->when($request->filled('search'), function ($q) use ($request) {
                $term = $request->string('search');
                $q->where(function ($qq) use ($term) {
                    $qq->where('nama_undang', 'like', "%{$term}%")
                        ->orWhere('pasal', 'like', "%{$term}%")
                        ->orWhere('isi_pasal', 'like', "%{$term}%");
                });
            })
            ->orderBy('nama_undang');

        return RegulationResource::collection($query->paginate($request->integer('per_page', 20)))->response();
    }

    public function store(StoreRegulationRequest $request): JsonResponse
    {
        $regulation = Regulation::create($request->validated());

        return (new RegulationResource($regulation))->response()->setStatusCode(201);
    }

    public function update(UpdateRegulationRequest $request, Regulation $regulation): JsonResponse
    {
        $regulation->update($request->validated());

        return (new RegulationResource($regulation))->response();
    }

    public function destroy(Regulation $regulation): JsonResponse
    {
        $regulation->delete();

        return response()->json(['message' => 'Regulasi dihapus']);
    }
}
