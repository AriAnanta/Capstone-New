import { Link } from 'react-router-dom';
import { usePublicDecisions } from '@/api/hooks';
import { formatDate } from '@/utils/format';
import { getStatusClass } from '@/pages/helpers';

const PublicPortalPage = () => {
    const { data: decisions = [], isLoading } = usePublicDecisions();

    return (
        <div className="mx-auto max-w-4xl space-y-6 py-8">
            <header className="text-center">
                <p className="text-sm uppercase tracking-wide text-indigo-600">Portal Publik</p>
                <h1 className="text-3xl font-bold text-slate-900">Putusan PTA Digital</h1>
                <p className="mt-2 text-sm text-slate-600">Akses ringkasan putusan yang telah dipublikasikan.</p>
            </header>

            <div className="space-y-4">
                {isLoading && <p className="text-center text-sm text-slate-500">Memuat putusan publik...</p>}
                {!isLoading && decisions.length === 0 && (
                    <p className="text-center text-sm text-slate-500">Belum ada putusan yang dipublikasikan.</p>
                )}
                {!isLoading &&
                    decisions.map((decision) => (
                        <article key={decision.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Nomor perkara</p>
                                    <h2 className="text-lg font-semibold text-slate-900">{decision.nomor_perkara}</h2>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(decision.status)}`}>
                                    {decision.status}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">
                                {decision.pengadilan_asal} • Masuk {formatDate(decision.tanggal_masuk)}
                            </p>
                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                {decision.documents?.map((doc) => (
                                    <span key={doc.id} className="rounded-full bg-slate-100 px-3 py-1 font-semibold capitalize text-slate-700">
                                        {doc.jenis_dokumen}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4 text-right">
                                <Link
                                    to={`/documents/${decision.documents?.[0]?.id ?? ''}`}
                                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    Baca ringkasan
                                </Link>
                            </div>
                        </article>
                    ))}
            </div>
        </div>
    );
};

export default PublicPortalPage;
