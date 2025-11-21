<?php

namespace App\Http\Requests;

use App\Enums\CaseType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePerkaraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nomor_perkara' => ['required', 'string', 'max:255', 'unique:perkaras,nomor_perkara'],
            'jenis_perkara' => ['required', Rule::enum(CaseType::class)],
            'status' => ['nullable', 'string', 'max:100'],
            'tanggal_masuk' => ['nullable', 'date'],
            'pengadilan_asal' => ['nullable', 'string', 'max:255'],
            'metadata' => ['nullable', 'array'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ];
    }
}
