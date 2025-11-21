import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePerkaras } from '@/api/hooks';
import { CASE_TYPES } from '@/constants';
import { formatDate, formatStatus } from '@/utils/format';
import { getStatusClass } from '@/pages/helpers';

const CasesPage = () => {
    const [typeFilter, setTypeFilter] = useState('');
    const { data: perkaras = [], isLoading } = usePerkaras();

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
                    <Link
                        to="/cases/new"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        Tambah perkara
                    </Link>
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
                                        <Link to={`/documents?case=${perkara.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                                            Lihat dokumen
                                        </Link>
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
