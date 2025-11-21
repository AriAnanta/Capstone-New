<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegulationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_undang' => $this->nama_undang,
            'pasal' => $this->pasal,
            'kategori_perkara' => $this->kategori_perkara,
            'isi_pasal' => $this->isi_pasal,
            'meta' => $this->meta,
        ];
    }
}
