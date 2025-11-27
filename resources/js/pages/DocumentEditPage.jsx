import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDocument, useUpdateDocument } from '@/api/hooks';
import { DOCUMENT_TYPES } from '@/constants';

const DocumentEditPage = () => {
    const navigate = useNavigate();
    const { documentId } = useParams();
    const { data: document, isLoading } = useDocument(documentId);
    const updateDocument = useUpdateDocument();

    const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]?.value ?? 'putusan');
    const [tagsInput, setTagsInput] = useState('');
    const [nomorNaskah, setNomorNaskah] = useState('');
    const [catatanInternal, setCatatanInternal] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!document) return;
        setDocumentType(document.jenis_dokumen ?? DOCUMENT_TYPES[0]?.value ?? 'putusan');
        setTagsInput(document.tags?.join(', ') ?? '');
        setNomorNaskah(document.metadata?.nomor_naskah ?? '');
        setCatatanInternal(document.metadata?.catatan_internal ?? '');
    }, [document]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        const tags = tagsInput
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

        updateDocument.mutate(
            {
                id: documentId,
                jenis_dokumen: documentType,
                metadata: {
                    nomor_naskah: nomorNaskah || undefined,
                    catatan_internal: catatanInternal || undefined,
                },
                tags,
            },
            {
                onSuccess: () => navigate('/documents'),
                onError: (apiError) => {
                    const message = apiError.response?.data?.message ?? 'Gagal memperbarui dokumen.';
                    setError(message);
                },
            },
        );
    };

    if (isLoading && !document) {
        return <p className="text-sm text-slate-600">Memuat detail dokumen...</p>;
    }

    if (!document) {
        return (
            <div className="space-y-3">
                <p className="text-sm text-slate-600">Dokumen tidak ditemukan.</p>
                <Link to="/documents" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                    Kembali ke daftar dokumen
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Dokumen #{document.id}</h1>
                    <p className="text-sm text-slate-600">Perbarui metadata, tag, dan jenis dokumen.</p>
                </div>
                <Link
                    to={`/documents/${document.id}`}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Lihat detail dokumen
                </Link>
            </div>

            <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
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

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <label className="text-sm text-slate-600">
                        Tag (opsional)
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={tagsInput}
                            onChange={(event) => setTagsInput(event.target.value)}
                            placeholder="Pisahkan dengan koma"
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
                        placeholder="Catatan tambahan untuk tim internal"
                    />
                </label>

                {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={updateDocument.isPending}
                        className="rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-70"
                    >
                        {updateDocument.isPending ? 'Menyimpan...' : 'Simpan perubahan'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/documents')}
                        className="rounded-lg border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Batalkan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentEditPage;
