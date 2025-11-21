<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PerkaraResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nomor_perkara' => $this->nomor_perkara,
            'jenis_perkara' => $this->jenis_perkara,
            'status' => $this->status,
            'tanggal_masuk' => $this->tanggal_masuk?->toDateString(),
            'pengadilan_asal' => $this->pengadilan_asal,
            'metadata' => $this->metadata,
            'created_by' => $this->creator?->only(['id', 'name', 'role']),
            'assigned_to' => $this->assignee?->only(['id', 'name', 'role']),
            'documents' => DocumentResource::collection($this->whenLoaded('documents')),
            'recommendations' => LlmRecommendationResource::collection($this->whenLoaded('recommendations')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
