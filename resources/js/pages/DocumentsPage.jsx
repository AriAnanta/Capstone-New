import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Pencil, Trash2, FileText, Eye, Plus, Filter, Search, Loader2, AlertCircle, Upload, ChevronRight } from 'lucide-react';
import { useDocuments, useDeleteDocument, usePerkaras } from '@/api/hooks';
import { DOCUMENT_TYPES } from '@/constants';
import { formatDate } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const DocumentsPage = () => {
    const [searchParams] = useSearchParams();
    const caseId = searchParams.get('case');
    
    const [typeFilter, setTypeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const { data: documents = [], isLoading } = useDocuments();
    const { data: perkaras = [] } = usePerkaras();
    const role = useAuthStore((state) => state.role);
    const canCreate = role === 'panitera';
    const deleteDocument = useDeleteDocument();
    const [deletingId, setDeletingId] = useState(null);

    const filtered = useMemo(() => {
        let result = documents;

        if (caseId) {
            result = result.filter((item) => item.perkara_id === parseInt(caseId));
        }

        if (typeFilter) {
            result = result.filter((item) => item.jenis_dokumen === typeFilter);
        }

        if (searchQuery) {
            result = result.filter((item) => {
                const caseNumber = perkaras.find(p => p.id === item.perkara_id)?.nomor_perkara || '';
                return caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.jenis_dokumen?.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }

        return result;
    }, [documents, typeFilter, searchQuery, caseId, perkaras]);

    const handleDelete = (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;
        setDeletingId(id);
        deleteDocument.mutate(id, {
            onSettled: () => setDeletingId(null),
        });
    };

    const getPerkara = (perkaraId) => {
        return perkaras.find(p => p.id === perkaraId);
    };

    const getStatusBadge = (doc) => {
        if (doc.teks_ocr && (doc.summaries?.length ?? 0) > 0) {
            return <Badge variant="success" className="text-xs font-semibold">Lengkap</Badge>;
        } else if (doc.teks_ocr) {
            return <Badge variant="warning" className="text-xs font-semibold">OCR Selesai</Badge>;
        } else {
            return <Badge variant="secondary" className="text-xs font-semibold">Pending</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 pt-6">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-2xl shadow-emerald-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30">
                                <FileText className="h-3.5 w-3.5 mr-1.5" />
                                Manajemen Dokumen
                            </Badge>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Daftar Dokumen</h1>
                            <p className="text-emerald-50 text-lg">Kelola dan pantau semua dokumen perkara pengadilan</p>
                        </div>
                        {canCreate && (
                            <Link
                                to="/documents/upload"
                                className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl shadow-black/10 border-0 h-12 px-6 text-base font-semibold rounded-xl inline-flex items-center gap-2 transition-all"
                            >
                                <Upload className="h-5 w-5" />
                                Unggah Dokumen
                            </Link>
                        )}
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white mt-4">
                    <CardContent className="p-6 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3 mt-5">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Cari nomor perkara atau jenis dokumen..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 h-11 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 h-11 text-sm font-semibold transition-all whitespace-nowrap ${
                                    showFilters 
                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </button>
                        </div>

                        {/* Filter Options */}
                        {showFilters && (
                            <div className="rounded-xl border border-slate-200 bg-linear-to-r from-slate-50 to-emerald-50/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">Jenis Dokumen</p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setTypeFilter('')}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                            typeFilter === ''
                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
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
                                                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                                            }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Results Count */}
                        {!isLoading && (
                            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <p className="text-sm font-medium text-slate-600">
                                    Menampilkan <span className="font-bold text-emerald-700">{filtered.length}</span> dari <span className="font-bold text-slate-900">{documents.length}</span> dokumen
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
                            <p className="text-slate-600 font-medium">Memuat daftar dokumen...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-lg font-semibold text-slate-900 mb-2">Tidak ada dokumen ditemukan</p>
                            <p className="text-slate-600 text-center mb-6">
                                {searchQuery || typeFilter || caseId
                                    ? 'Coba ubah kriteria pencarian atau filter Anda'
                                    : 'Mulai dengan mengunggah dokumen baru'}
                            </p>
                            {canCreate && !searchQuery && !typeFilter && (
                                <Link
                                    to="/documents/upload"
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
                                >
                                    <Upload className="h-4 w-4" />
                                    Unggah Dokumen Pertama
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-slate-200 text-sm">
                                <thead className="bg-linear-to-r from-slate-50 to-emerald-50/30 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Nomor Perkara</th>
                                        <th className="px-6 py-4">Jenis Dokumen</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Tanggal Upload</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((doc, idx) => {
                                        const perkara = getPerkara(doc.perkara_id);
                                        return (
                                            <tr
                                                key={doc.id}
                                                className="hover:bg-linear-to-r hover:from-emerald-50/50 hover:to-teal-50/30 transition-all duration-200 group"
                                                style={{ animationDelay: `${idx * 50}ms` }}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-900 font-mono text-sm">#{doc.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {perkara ? (
                                                        <div>
                                                            <div className="font-semibold text-slate-900 text-sm">{perkara.nomor_perkara}</div>
                                                            {perkara.pengadilan_asal && (
                                                                <div className="text-xs text-slate-500 mt-1">{perkara.pengadilan_asal}</div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                                                        {doc.jenis_dokumen || 'Tidak diketahui'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(doc)}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {formatDate(doc.tanggal_upload)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            to={`/documents/${doc.id}`}
                                                            title="Lihat detail"
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-all"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        {canCreate && (
                                                            <>
                                                                <Link
                                                                    to={`/documents/${doc.id}/edit`}
                                                                    title="Edit dokumen"
                                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(doc.id)}
                                                                    title="Hapus dokumen"
                                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-50"
                                                                    disabled={deletingId === doc.id && deleteDocument.isPending}
                                                                >
                                                                    {deletingId === doc.id && deleteDocument.isPending ? (
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
                </Card>
            </div>
        </div>
    );
};

export default DocumentsPage;