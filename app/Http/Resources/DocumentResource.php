<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'perkara_id' => $this->perkara_id,
            'perkara' => $this->whenLoaded('perkara', fn () => $this->perkara?->only(['id', 'nomor_perkara', 'jenis_perkara', 'status'])),
            'jenis_dokumen' => $this->jenis_dokumen,
            'path_file' => $this->path_file,
            'format_file' => $this->format_file,
            'teks_ocr' => $this->teks_ocr,
            'tanggal_upload' => $this->tanggal_upload,
            'metadata' => $this->metadata,
            'external_reference' => $this->external_reference,
            'tags' => $this->tags->pluck('name'),
            'summaries' => SummaryResource::collection($this->whenLoaded('summaries')),
            'recommendations' => LlmRecommendationResource::collection($this->whenLoaded('recommendations')),
        ];
    }
}
