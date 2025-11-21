import { useMemo } from 'react';
import { usePerkaras, useDocuments } from '@/api/hooks';
import { CASE_TYPES, STATUS_VARIANTS } from '@/constants';
import { formatDate } from '@/utils/format';

const StatCard = ({ label, value, sub }) => (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
);

const DashboardPage = () => {
    const { data: perkaras = [] } = usePerkaras();
    const { data: documents = [] } = useDocuments();

    const grouped = useMemo(() => {
        return perkaras.reduce(
            (acc, item) => {
                acc.byType[item.jenis_perkara] = (acc.byType[item.jenis_perkara] ?? 0) + 1;
                acc.byStatus[item.status] = (acc.byStatus[item.status] ?? 0) + 1;
                return acc;
            },
            { byType: {}, byStatus: {} },
        );
    }, [perkaras]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Ringkasan Pengadilan</h1>
                <p className="text-sm text-slate-600">Status perkara, dokumen, dan aktivitas OCR/LLM.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard label="Perkara aktif" value={perkaras.length} />
                <StatCard label="Dokumen terunggah" value={documents.length} />
                <StatCard label="OCR & Ringkasan" value={`${documents.filter((doc) => doc.teks_ocr).length} OCR`} sub="Dokumen sudah diproses" />
            </div>

            <section className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
                    <h2 className="text-base font-semibold text-slate-900">Perkara terbaru</h2>
                    <div className="mt-4 divide-y divide-slate-100">
                        {perkaras.slice(0, 6).map((perkara) => (
                            <div key={perkara.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{perkara.nomor_perkara}</p>
                                    <p className="text-xs text-slate-500">{formatDate(perkara.tanggal_masuk)}</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_VARIANTS[perkara.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                    {perkara.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900">Distribusi jenis perkara</h2>
                    <div className="mt-4 space-y-3">
                        {CASE_TYPES.map((type) => (
                            <div key={type.value} className="flex items-center justify-between text-sm">
                                <span>{type.label}</span>
                                <span className="font-semibold text-slate-900">{grouped.byType[type.value] ?? 0}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;
