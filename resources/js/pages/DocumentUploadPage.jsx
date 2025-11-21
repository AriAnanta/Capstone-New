import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePerkaras, useUploadDocument } from '@/api/hooks';
import { DOCUMENT_TYPES } from '@/constants';

const DocumentUploadPage = () => {
    const navigate = useNavigate();
    const { data: perkaras = [], isLoading: loadingCases } = usePerkaras({ per_page: 100 });
    const uploadDocument = useUploadDocument();

    const perkaraOptions = Array.isArray(perkaras) ? perkaras : perkaras?.data ?? [];
    const hasCases = perkaraOptions.length > 0;

    const [perkaraId, setPerkaraId] = useState('');
    const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]?.value ?? 'putusan');
    const [file, setFile] = useState(null);
    const [tagsInput, setTagsInput] = useState('');
    const [nomorNaskah, setNomorNaskah] = useState('');
    const [catatanInternal, setCatatanInternal] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!perkaraId || !documentType || !file) {
            setError('Pilih perkara, jenis dokumen, dan file terlebih dahulu.');
            return;
        }

        const tags = tagsInput
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

        uploadDocument.mutate(
            {
                perkara_id: Number(perkaraId),
                jenis_dokumen: documentType,
                dokumen: file,
                metadata: {
                    nomor_naskah: nomorNaskah,
                    catatan_internal: catatanInternal,
                },
                tags,
            },
            {
                onSuccess: (document) => {
                    setSuccess('Dokumen berhasil diunggah. Pipeline OCR & LLM sedang berjalan.');
                    setPerkaraId('');
                    setDocumentType(DOCUMENT_TYPES[0]?.value ?? 'putusan');
                    setFile(null);
                    setTagsInput('');
                    setNomorNaskah('');
                    setCatatanInternal('');

                    if (document?.id) {
                        setTimeout(() => navigate(`/documents/${document.id}`), 600);
                    } else {
                        setTimeout(() => navigate('/documents'), 600);
                    }
                },
                onError: (apiError) => {
                    const message = apiError.response?.data?.message ?? 'Gagal mengunggah dokumen. Coba lagi.';
                    setError(message);
                },
            },
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Unggah Dokumen Perkara</h1>
                    <p className="text-sm text-slate-600">
                        File yang diunggah otomatis menjalankan pipeline OCR → Ringkasan Gemini → Rekomendasi hukum.
                    </p>
                </div>
                <Link
                    to="/documents"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Kembali ke daftar
                </Link>
            </div>

            <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    <label className="text-sm text-slate-600">
                        Pilih perkara
                        <select
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={perkaraId}
                            onChange={(event) => setPerkaraId(event.target.value)}
                            disabled={loadingCases || !hasCases}
                        >
                            <option value="">{hasCases ? '-- Pilih perkara --' : 'Belum ada perkara'}</option>
                            {perkaraOptions.map((perkara) => (
                                <option key={perkara.id} value={perkara.id}>
                                    {perkara.nomor_perkara}
                                </option>
                            ))}
                        </select>
                        {!loadingCases && !hasCases && (
                            <p className="mt-2 text-xs text-slate-500">
                                Belum ada perkara. Tambahkan terlebih dahulu di halaman{' '}
                                <Link to="/cases/new" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Tambah Perkara
                                </Link>
                                .
                            </p>
                        )}
                    </label>

                    <label className="text-sm text-slate-600">
                        Jenis dokumen
                        <select
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={documentType}
                            onChange={(event) => setDocumentType(event.target.value)}
                        >
                            {DOCUMENT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <label className="text-sm text-slate-600">
                        Tag (opsional)
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={tagsInput}
                            onChange={(event) => setTagsInput(event.target.value)}
                            placeholder="Pisahkan dengan koma, contoh: prioritas, publik"
                        />
                    </label>
                    <label className="text-sm text-slate-600">
                        Nomor naskah (opsional)
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={nomorNaskah}
                            onChange={(event) => setNomorNaskah(event.target.value)}
                            placeholder="Mis. 02/PTS-PTA/2025"
                        />
                    </label>
                </div>

                <label className="mt-6 block text-sm text-slate-600">
                    Catatan internal (opsional)
                    <textarea
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                        rows={4}
                        value={catatanInternal}
                        onChange={(event) => setCatatanInternal(event.target.value)}
                        placeholder="Catatan untuk tim internal atau hakim reviewer"
                    />
                </label>

                <label className="mt-6 block text-sm text-slate-600">
                    File dokumen (PDF atau gambar)
                    <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="mt-2 block w-full rounded-lg border border-dashed border-slate-300 px-3 py-4 text-sm"
                        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                    />
                    {file && <p className="mt-1 text-xs text-slate-500">File terpilih: {file.name}</p>}
                </label>

                {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
                {success && <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{success}</p>}

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={uploadDocument.isPending}
                        className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-70"
                    >
                        {uploadDocument.isPending ? 'Mengunggah...' : 'Unggah & jalankan pipeline'}
                    </button>
                    <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        onClick={() => navigate('/documents')}
                    >
                        Batalkan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentUploadPage;
