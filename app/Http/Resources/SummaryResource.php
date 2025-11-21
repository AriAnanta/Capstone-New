<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'document_id' => $this->document_id,
            'tipe_ringkasan' => $this->tipe_ringkasan,
            'ringkasan' => $this->ringkasan,
            'meta' => $this->meta,
            'created_via' => $this->created_via,
            'author' => $this->author?->only(['id', 'name', 'role']),
            'created_at' => $this->created_at,
        ];
    }
}
