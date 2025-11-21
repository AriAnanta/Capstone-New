import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePublicDecisions } from '@/api/hooks';
import { formatDate } from '@/utils/format';
import { getStatusClass } from '@/pages/helpers';
import { logout as logoutRequest } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

const getFirstPublicSummary = (decision) => {
    for (const doc of decision.documents ?? []) {
        const summary = (doc.summaries ?? []).find((item) => item.tipe_ringkasan === 'publik');
        if (summary) {
            return summary;
        }
    }
    return null;
};

const DecisionCard = ({ decision }) => {
    const [expanded, setExpanded] = useState(false);
    const publicSummary = useMemo(() => getFirstPublicSummary(decision), [decision]);
    const summaryText = publicSummary?.ringkasan ?? '';
    const shouldTruncate = summaryText.length > 260;
    const displayText = expanded || !shouldTruncate ? summaryText : `${summaryText.slice(0, 260)}…`;

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
            <div className="mt-4">
                {publicSummary ? (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                            <span>Ringkasan publik</span>
                            <span>{formatDate(publicSummary.created_at)}</span>
                        </div>
                        <p className="mt-2 whitespace-pre-line">{displayText}</p>
                        {shouldTruncate && (
                            <button
                                type="button"
                                onClick={() => setExpanded((prev) => !prev)}
                                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                            >
                                {expanded ? 'Tutup ringkasan' : 'Baca ringkasan lengkap'}
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Belum ada ringkasan publik untuk perkara ini.</p>
                )}
            </div>
        </article>
    );
};

const PublicPortalPage = () => {
    const { data: decisions = [], isLoading } = usePublicDecisions();
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logoutRequest();
        } finally {
            setIsLoggingOut(false);
            navigate('/login');
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6 py-8">
            <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="text-center sm:text-left">
                    <p className="text-sm uppercase tracking-wide text-indigo-600">Portal Publik</p>
                    <h1 className="text-3xl font-bold text-slate-900">Putusan PTA Digital</h1>
                    <p className="mt-2 text-sm text-slate-600">Akses ringkasan putusan yang telah dipublikasikan.</p>
                    {token && (
                        <p className="mt-1 text-xs text-slate-500">Masuk sebagai {user?.name ?? 'pengguna publik'}</p>
                    )}
                </div>
                <div className="flex justify-center gap-2">
                    {token ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            {isLoggingOut ? 'Keluar...' : 'Keluar & kembali' }
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Masuk
                        </Link>
                    )}
                </div>
            </header>

            <div className="space-y-4">
                {isLoading && <p className="text-center text-sm text-slate-500">Memuat putusan publik...</p>}
                {!isLoading && decisions.length === 0 && (
                    <p className="text-center text-sm text-slate-500">Belum ada putusan yang dipublikasikan.</p>
                )}
                {!isLoading && decisions.map((decision) => <DecisionCard key={decision.id} decision={decision} />)}
            </div>
        </div>
    );
};

export default PublicPortalPage;
