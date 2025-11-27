import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, FileText, Eye, Plus, Filter, Search, Loader2, AlertCircle } from 'lucide-react';
import { usePerkaras, useDeletePerkara } from '@/api/hooks';
import { CASE_TYPES } from '@/constants';
import { formatDate, formatStatus } from '@/utils/format';
import { getStatusClass } from '@/pages/helpers';
import { useAuthStore } from '@/store/authStore';

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
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 pb-12 pt-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">Daftar Perkara</h1>
                        <p className="text-slate-600 mt-1">Kelola dan pantau status semua perkara yang ada</p>
                    </div>
                    {canCreate && (
                        <Link
                            to="/cases/new"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95 whitespace-nowrap"
                        >
                            <Plus className="h-5 w-5" />
                            Tambah Perkara
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
                                placeholder="Cari nomor perkara..."
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
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">Jenis Perkara</p>
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
                                {CASE_TYPES.map((type) => (
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
                        Menampilkan <span className="font-bold text-slate-900">{filtered.length}</span> dari <span className="font-bold text-slate-900">{perkaras.length}</span> perkara
                    </div>
                )}

                {/* Table */}
                <div className="rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
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
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Perkara Pertama
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-slate-200 text-sm">
                                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
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
                                            className="hover:bg-slate-50/50 transition-colors group"
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
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        to={`/documents?case=${perkara.id}`}
                                                        title="Lihat dokumen"
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </Link>
                                                    {canCreate && (
                                                        <>
                                                            <Link
                                                                to={`/cases/${perkara.id}/edit`}
                                                                title="Edit perkara"
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(perkara.id)}
                                                                title="Hapus perkara"
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
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
                </div>
            </div>
        </div>
    );
};

export default CasesPage;