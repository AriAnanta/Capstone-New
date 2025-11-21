import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
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
    const { data: documents = [], isLoading } = useDocuments(caseParam ? { perkara_id: caseParam } : {});

    const filtered = useMemo(() => {
        if (!typeFilter) return documents;
        return documents.filter((doc) => doc.jenis_dokumen === typeFilter);
    }, [documents, typeFilter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dokumen Digital</h1>
                    <p className="text-sm text-slate-600">Kelola dokumen hasil pemindaian, OCR, dan ringkasan.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {canUpload && (
                        <Link
                            to="/documents/upload"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Unggah dokumen
                        </Link>
                    )}
                    <label className="text-sm text-slate-600">
                        Filter jenis dokumen
                        <select
                            className="mt-1 block rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            value={typeFilter}
                            onChange={(event) => setTypeFilter(event.target.value)}
                        >
                            <option value="">Semua jenis</option>
                            {DOCUMENT_TYPES.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        <tr>
                            <th className="px-4 py-3">Dokumen</th>
                            <th className="px-4 py-3">Jenis</th>
                            <th className="px-4 py-3">Tanggal unggah</th>
                            <th className="px-4 py-3">Ringkasan</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading && (
                            <tr>
                                <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                                    Memuat data dokumen...
                                </td>
                            </tr>
                        )}
                        {!isLoading && filtered.length === 0 && (
                            <tr>
                                <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                                    Tidak ada dokumen untuk filter ini.
                                </td>
                            </tr>
                        )}
                        {!isLoading &&
                            filtered.map((document) => (
                                <tr key={document.id} className="text-slate-700">
                                    <td className="px-4 py-3 font-semibold text-slate-900">Dokumen #{document.id}</td>
                                    <td className="px-4 py-3 capitalize">{document.jenis_dokumen?.replace('_', ' ')}</td>
                                    <td className="px-4 py-3">{formatDate(document.tanggal_upload)}</td>
                                    <td className="px-4 py-3">{document.summaries?.length ?? 0} ringkasan</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/documents/${document.id}`}
                                                className="rounded-full border border-slate-200 p-2 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                                title="Lihat detail"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            {canUpload && (
                                                <>
                                                    <Link
                                                        to={`/documents/${document.id}/edit`}
                                                        className="rounded-full border border-slate-200 p-2 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                                        title="Edit dokumen"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (!window.confirm('Hapus dokumen ini?')) return;
                                                            setDeletingId(document.id);
                                                            deleteDocument.mutate(document.id, {
                                                                onSettled: () => setDeletingId(null),
                                                            });
                                                        }}
                                                        className="rounded-full border border-slate-200 p-2 text-rose-500 hover:border-rose-200 hover:text-rose-600"
                                                        title="Hapus dokumen"
                                                        disabled={deletingId === document.id && deleteDocument.isPending}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentsPage;
