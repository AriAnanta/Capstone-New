<?php

namespace App\Http\Requests;

use App\Enums\CaseType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePerkaraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nomor_perkara' => ['sometimes', 'string', 'max:255', Rule::unique('perkaras', 'nomor_perkara')->ignore($this->route('perkara'))],
            'jenis_perkara' => ['sometimes', Rule::enum(CaseType::class)],
            'status' => ['sometimes', 'string', 'max:100'],
            'tanggal_masuk' => ['sometimes', 'date'],
            'pengadilan_asal' => ['sometimes', 'string', 'max:255'],
            'metadata' => ['nullable', 'array'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ];
    }
}
