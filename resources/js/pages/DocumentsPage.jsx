import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Eye, Pencil, Trash2, Plus, Filter, Search, Loader2, AlertCircle, Cloud } from 'lucide-react';
import { useDocuments, useDeleteDocument } from '@/api/hooks';
import { DOCUMENT_TYPES } from '@/constants';
import { formatDate } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';

const useQueryParam = (key) => {
    const { search } = useLocation();
    return new URLSearchParams(search).get(key);
};

const DocumentsPage = () => {
    const caseParam = useQueryParam('case');
    const role = useAuthStore((state) => state.role);
    const canUpload = role === 'panitera';
    const deleteDocument = useDeleteDocument();
    const [deletingId, setDeletingId] = useState(null);
    const [typeFilter, setTypeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const { data: documents = [], isLoading } = useDocuments(caseParam ? { perkara_id: caseParam } : {});

    const filtered = useMemo(() => {
        let result = documents;

        if (typeFilter) {
            result = result.filter((doc) => doc.jenis_dokumen === typeFilter);
        }

        if (searchQuery) {
            result = result.filter((doc) =>
                doc.id.toString().includes(searchQuery) ||
                doc.jenis_dokumen.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [documents, typeFilter, searchQuery]);

    const handleDelete = (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;
        setDeletingId(id);
        deleteDocument.mutate(id, {
            onSettled: () => setDeletingId(null),
        });
    };

    const getOCRStatus = (doc) => {
        if (doc.teks_ocr) return { label: '✓ OCR Selesai', color: 'emerald' };
        return { label: '◐ Menunggu OCR', color: 'amber' };
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 pb-12 pt-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">Dokumen Digital</h1>
                        <p className="text-slate-600 mt-1">Kelola dokumen hasil scan, OCR, ringkasan, dan rekomendasi</p>
                    </div>
                    {canUpload && (
                        <Link
                            to="/documents/upload"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95 whitespace-nowrap"
                        >
                            <Cloud className="h-5 w-5" />
                            Unggah Dokumen
                        </Link>
                    )}
                </div>

                {/* Search & Filter Bar */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Cari dokumen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all whitespace-nowrap"
                        >
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">Jenis Dokumen</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setTypeFilter('')}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                        typeFilter === ''
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Semua Jenis
                                </button>
                                {DOCUMENT_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setTypeFilter(type.value)}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                            typeFilter === type.value
                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                {!isLoading && (
                    <div className="text-sm font-medium text-slate-600">
                        Menampilkan <span className="font-bold text-slate-900">{filtered.length}</span> dari <span className="font-bold text-slate-900">{documents.length}</span> dokumen
                    </div>
                )}

                {/* Table */}
                <div className="rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
                            <p className="text-slate-600 font-medium">Memuat daftar dokumen...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <Cloud className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-lg font-semibold text-slate-900 mb-2">Tidak ada dokumen ditemukan</p>
                            <p className="text-slate-600 text-center mb-6">
                                {searchQuery || typeFilter
                                    ? 'Coba ubah kriteria pencarian atau filter Anda'
                                    : 'Mulai dengan mengunggah dokumen baru'}
                            </p>
                            {canUpload && !searchQuery && !typeFilter && (
                                <Link
                                    to="/documents/upload"
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                                >
                                    <Plus className="h-4 w-4" />
                                    Unggah Dokumen Pertama
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-slate-200 text-sm">
                                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    <tr>
                                        <th className="px-6 py-4">Dokumen</th>
                                        <th className="px-6 py-4">Jenis</th>
                                        <th className="px-6 py-4">Status OCR</th>
                                        <th className="px-6 py-4">Tanggal Upload</th>
                                        <th className="px-6 py-4">Ringkasan</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((document, idx) => {
                                        const ocrStatus = getOCRStatus(document);
                                        return (
                                            <tr
                                                key={document.id}
                                                className="hover:bg-slate-50/50 transition-colors group"
                                                style={{ animationDelay: `${idx * 50}ms` }}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-900">Dokumen #{document.id}</div>
                                                    {document.metadata?.nomor_naskah && (
                                                        <div className="text-xs text-slate-500 mt-1 font-mono">{document.metadata.nomor_naskah}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                                                        {DOCUMENT_TYPES.find((t) => t.value === document.jenis_dokumen)?.label ?? document.jenis_dokumen}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                        ocrStatus.color === 'emerald'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {ocrStatus.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {formatDate(document.tanggal_upload)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <span className="font-semibold text-slate-900">{document.summaries?.length ?? 0}</span>
                                                        <span className="text-slate-500"> ringkasan</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            to={`/documents/${document.id}`}
                                                            title="Lihat detail"
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        {canUpload && (
                                                            <>
                                                                <Link
                                                                    to={`/documents/${document.id}/edit`}
                                                                    title="Edit metadata"
                                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(document.id)}
                                                                    title="Hapus dokumen"
                                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                                                                    disabled={deletingId === document.id && deleteDocument.isPending}
                                                                >
                                                                    {deletingId === document.id && deleteDocument.isPending ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-4 w-4" />
                                                                    )}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentsPage;