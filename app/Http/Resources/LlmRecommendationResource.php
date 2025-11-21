<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LlmRecommendationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'perkara_id' => $this->perkara_id,
            'document_id' => $this->document_id,
            'daftar_pasal' => $this->daftar_pasal,
            'pertimbangan_llm' => $this->pertimbangan_llm,
            'meta' => $this->meta,
            'created_at' => $this->created_at,
        ];
    }
}
