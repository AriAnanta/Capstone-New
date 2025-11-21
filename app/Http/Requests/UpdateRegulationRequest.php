<?php

namespace App\Http\Requests;

use App\Enums\CaseType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRegulationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_undang' => ['sometimes', 'string', 'max:255'],
            'pasal' => ['sometimes', 'string', 'max:255'],
            'kategori_perkara' => ['sometimes', Rule::enum(CaseType::class)],
            'isi_pasal' => ['sometimes', 'string'],
            'meta' => ['nullable', 'array'],
        ];
    }
}
