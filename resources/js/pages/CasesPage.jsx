import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, FileText, Eye, Plus, Filter, Search, Loader2, AlertCircle, Scale, Gavel, ChevronRight } from 'lucide-react';
import { usePerkaras, useDeletePerkara } from '@/api/hooks';
import { CASE_TYPES } from '@/constants';
import { formatDate, formatStatus } from '@/utils/format';
import { getStatusClass } from '@/pages/helpers';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const CasesPage = () => {
    const [typeFilter, setTypeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const { data: perkaras = [], isLoading } = usePerkaras();
    const role = useAuthStore((state) => state.role);
    const canCreate = role === 'panitera';
    const deletePerkara = useDeletePerkara();
    const [deletingId, setDeletingId] = useState(null);

    const filtered = useMemo(() => {
        let result = perkaras;

        if (typeFilter) {
            result = result.filter((item) => item.jenis_perkara === typeFilter);
        }

        if (searchQuery) {
            result = result.filter((item) =>
                item.nomor_perkara.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [perkaras, typeFilter, searchQuery]);

    const handleDelete = (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus perkara ini?')) return;
        setDeletingId(id);
        deletePerkara.mutate(id, {
            onSettled: () => setDeletingId(null),
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 pt-6">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-600 via-violet-600 to-indigo-600 p-8 shadow-2xl shadow-purple-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30">
                                <Scale className="h-3.5 w-3.5 mr-1.5" />
                                Manajemen Perkara
                            </Badge>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Daftar Perkara</h1>
                            <p className="text-purple-50 text-lg">Kelola dan pantau status semua perkara pengadilan</p>
                        </div>
                        {canCreate && (
                            <Link
                                to="/cases/new"
                                className="bg-white text-purple-700 hover:bg-purple-50 shadow-xl shadow-black/10 border-0 h-12 px-6 text-base font-semibold rounded-xl inline-flex items-center gap-2 transition-all"
                            >
                                <Plus className="h-5 w-5" />
                                Tambah Perkara
                            </Link>
                        )}
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white mt-3">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 mt-5">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Cari nomor perkara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 h-11 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 h-11 text-sm font-semibold transition-all whitespace-nowrap ${
                                    showFilters 
                                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </button>
                        </div>

                        {/* Filter Options */}
                        {showFilters && (
                            <div className="rounded-xl border border-slate-200 bg-linear-to-r from-slate-50 to-purple-50/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">Jenis Perkara</p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setTypeFilter('')}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                            typeFilter === ''
                                                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                                        }`}
                                    >
                                        Semua Jenis
                                    </button>
                                    {CASE_TYPES.map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => setTypeFilter(type.value)}
                                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                                typeFilter === type.value
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
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
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <p className="text-sm font-medium text-slate-600">
                                    Menampilkan <span className="font-bold text-purple-700">{filtered.length}</span> dari <span className="font-bold text-slate-900">{perkaras.length}</span> perkara
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
                            <p className="text-slate-600 font-medium">Memuat daftar perkara...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-lg font-semibold text-slate-900 mb-2">Tidak ada perkara ditemukan</p>
                            <p className="text-slate-600 text-center mb-6">
                                {searchQuery || typeFilter
                                    ? 'Coba ubah kriteria pencarian atau filter Anda'
                                    : 'Mulai dengan membuat perkara baru'}
                            </p>
                            {canCreate && !searchQuery && !typeFilter && (
                                <Link
                                    to="/cases/new"
                                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Perkara Pertama
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-slate-200 text-sm">
                                <thead className="bg-linear-to-r from-slate-50 to-purple-50/30 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    <tr>
                                        <th className="px-6 py-4">Nomor Perkara</th>
                                        <th className="px-6 py-4">Jenis</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Tanggal Masuk</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((perkara, idx) => (
                                        <tr
                                            key={perkara.id}
                                            className="hover:bg-linear-to-r hover:from-purple-50/50 hover:to-indigo-50/30 transition-all duration-200 group"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900 font-mono text-sm">{perkara.nomor_perkara}</div>
                                                {perkara.pengadilan_asal && (
                                                    <div className="text-xs text-slate-500 mt-1">{perkara.pengadilan_asal}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                                                    {CASE_TYPES.find((t) => t.value === perkara.jenis_perkara)?.label ?? perkara.jenis_perkara}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(perkara.status)}`}>
                                                    {formatStatus(perkara.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {formatDate(perkara.tanggal_masuk)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/documents?case=${perkara.id}`}
                                                        title="Lihat dokumen"
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </Link>
                                                    {canCreate && (
                                                        <>
                                                            <Link
                                                                to={`/cases/${perkara.id}/edit`}
                                                                title="Edit perkara"
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(perkara.id)}
                                                                title="Hapus perkara"
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-50"
                                                                disabled={deletingId === perkara.id && deletePerkara.isPending}
                                                            >
                                                                {deletingId === perkara.id && deletePerkara.isPending ? (
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default CasesPage;