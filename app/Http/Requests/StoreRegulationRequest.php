<?php

namespace App\Http\Requests;

use App\Enums\CaseType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRegulationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_undang' => ['required', 'string', 'max:255'],
            'pasal' => ['required', 'string', 'max:255'],
            'kategori_perkara' => ['required', Rule::enum(CaseType::class)],
            'isi_pasal' => ['required', 'string'],
            'meta' => ['nullable', 'array'],
        ];
    }
}
