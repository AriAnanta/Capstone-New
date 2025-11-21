import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, FileText } from 'lucide-react';
import { usePerkaras, useDeletePerkara } from '@/api/hooks';
import { CASE_TYPES } from '@/constants';
import { formatDate, formatStatus } from '@/utils/format';
import { getStatusClass } from '@/pages/helpers';
import { useAuthStore } from '@/store/authStore';

const CasesPage = () => {
    const [typeFilter, setTypeFilter] = useState('');
    const { data: perkaras = [], isLoading } = usePerkaras();
    const role = useAuthStore((state) => state.role);
    const canCreate = role === 'panitera';
    const deletePerkara = useDeletePerkara();
    const [deletingId, setDeletingId] = useState(null);

    const filtered = useMemo(() => {
        if (!typeFilter) return perkaras;
        return perkaras.filter((item) => item.jenis_perkara === typeFilter);
    }, [perkaras, typeFilter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Daftar Perkara</h1>
                    <p className="text-sm text-slate-600">Pantau status dan progres masing-masing perkara.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="text-sm text-slate-600">
                        Filter jenis perkara
                        <select
                            className="mt-1 block rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            value={typeFilter}
                            onChange={(event) => setTypeFilter(event.target.value)}
                        >
                            <option value="">Semua jenis</option>
                            {CASE_TYPES.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    {canCreate && (
                        <Link
                            to="/cases/new"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Tambah perkara
                        </Link>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        <tr>
                            <th className="px-4 py-3">Nomor perkara</th>
                            <th className="px-4 py-3">Jenis</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Masuk</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading && (
                            <tr>
                                <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                                    Memuat data perkara...
                                </td>
                            </tr>
                        )}
                        {!isLoading && filtered.length === 0 && (
                            <tr>
                                <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                                    Tidak ada data perkara untuk filter ini.
                                </td>
                            </tr>
                        )}
                        {!isLoading &&
                            filtered.map((perkara) => (
                                <tr key={perkara.id} className="text-slate-700">
                                    <td className="px-4 py-3 font-semibold text-slate-900">{perkara.nomor_perkara}</td>
                                    <td className="px-4 py-3 capitalize">{perkara.jenis_perkara?.replace('_', ' ')}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(perkara.status)}`}>
                                            {formatStatus(perkara.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{formatDate(perkara.tanggal_masuk)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/documents?case=${perkara.id}`}
                                                className="rounded-full border border-slate-200 p-2 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                                title="Lihat dokumen"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </Link>
                                            {canCreate && (
                                                <>
                                                    <Link
                                                        to={`/cases/${perkara.id}/edit`}
                                                        className="rounded-full border border-slate-200 p-2 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                                        title="Edit perkara"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (!window.confirm('Hapus perkara ini?')) return;
                                                            setDeletingId(perkara.id);
                                                            deletePerkara.mutate(perkara.id, {
                                                                onSettled: () => setDeletingId(null),
                                                            });
                                                        }}
                                                        className="rounded-full border border-slate-200 p-2 text-rose-500 hover:border-rose-200 hover:text-rose-600"
                                                        title="Hapus perkara"
                                                        disabled={deletingId === perkara.id && deletePerkara.isPending}
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

export default CasesPage;
