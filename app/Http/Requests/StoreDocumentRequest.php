<?php

namespace App\Http\Requests;

use App\Enums\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'perkara_id' => ['required', 'exists:perkaras,id'],
            'jenis_dokumen' => ['required', Rule::enum(DocumentType::class)],
            'dokumen' => ['required', 'file', 'max:102400'],
            'metadata' => ['nullable', 'array'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'distinct'],
        ];
    }
}
