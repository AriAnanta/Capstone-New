import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePublicDecisions } from '@/api/hooks';
import { formatDate } from '@/utils/format';
import { getStatusClass } from '@/pages/helpers';
import { logout as logoutRequest } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { 
    LogOut, Search, Filter, Calendar, FileText, Gavel, X, 
    ChevronRight, Scale, Lock, Eye, EyeOff, Loader2
} from 'lucide-react';

const getFirstPublicSummary = (decision) => {
    for (const doc of decision.documents ?? []) {
        const summary = (doc.summaries ?? []).find((item) => item.tipe_ringkasan === 'publik');
        if (summary) {
            return summary;
        }
    }
    return null;
};

// Decision Card Component
const DecisionCard = ({ decision }) => {
    const [expanded, setExpanded] = useState(false);
    const publicSummary = useMemo(() => getFirstPublicSummary(decision), [decision]);
    const summaryText = publicSummary?.ringkasan ?? '';
    const shouldTruncate = summaryText.length > 260;
    const displayText = expanded || !shouldTruncate ? summaryText : `${summaryText.slice(0, 260)}…`;

    const getStatusColor = (status) => {
        switch(status) {
            case 'processed':
                return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
            case 'review':
                return 'bg-amber-100 text-amber-700 ring-amber-200';
            case 'rejected':
                return 'bg-red-100 text-red-700 ring-red-200';
            default:
                return 'bg-slate-100 text-slate-700 ring-slate-200';
        }
    };

    return (
        <article className="group rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-200 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">Nomor Perkara</p>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {decision.nomor_perkara}
                    </h2>
                </div>
                <span className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold ring-1 ring-inset whitespace-nowrap ${getStatusColor(decision.status)}`}>
                    {decision.status === 'processed' && '✓ Diterbitkan'}
                    {decision.status === 'review' && '◐ Dalam Review'}
                    {decision.status === 'rejected' && '✕ Ditolak'}
                    {!['processed', 'review', 'rejected'].includes(decision.status) && decision.status}
                </span>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Gavel className="h-4 w-4 text-emerald-600" />
                    {decision.pengadilan_asal}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {formatDate(decision.tanggal_masuk)}
                </div>
            </div>

            {/* Document Types */}
            {decision.documents && decision.documents.length > 0 && (
                <div className="mb-5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Dokumen</p>
                    <div className="flex flex-wrap gap-2">
                        {decision.documents.map((doc) => (
                            <span
                                key={doc.id}
                                className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-slate-100 to-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200"
                            >
                                <FileText className="h-3 w-3" />
                                {doc.jenis_dokumen}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Summary Section */}
            {publicSummary ? (
                <div className="rounded-xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-600" />
                            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Ringkasan Publik</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">{formatDate(publicSummary.created_at)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{displayText}</p>
                    {shouldTruncate && (
                        <button
                            type="button"
                            onClick={() => setExpanded((prev) => !prev)}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-emerald-500 active:scale-95"
                        >
                            {expanded ? 'Sembunyikan' : 'Baca Lengkap'}
                            <ChevronRight className="h-3 w-3" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)' }} />
                        </button>
                    )}
                </div>
            ) : (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-slate-400" />
                        Ringkasan publik belum tersedia untuk perkara ini.
                    </p>
                </div>
            )}
        </article>
    );
};

// Public Portal Page
const PublicPortalPage = () => {
    const { data: decisions = [], isLoading } = usePublicDecisions();
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logoutRequest();
        } finally {
            setIsLoggingOut(false);
            navigate('/login');
        }
    };

    // Filter decisions based on search and status
    const filteredDecisions = useMemo(() => {
        return decisions.filter(decision => {
            const matchesSearch = decision.nomor_perkara.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 decision.pengadilan_asal.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' || decision.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [decisions, searchQuery, filterStatus]);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Hero Header */}
            <header className="relative overflow-hidden border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col gap-6">
                        {/* Header Content */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 shadow-lg">
                                        <Scale className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Portal Publik</p>
                                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Putusan PTA Digital</h1>
                                    </div>
                                </div>
                                <p className="text-slate-600">Akses ringkasan putusan yang telah dipublikasikan dan diverifikasi secara resmi.</p>
                                {token && (
                                    <p className="mt-2 text-sm text-slate-500 flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-emerald-600" />
                                        Masuk sebagai <span className="font-semibold text-slate-700">{user?.name ?? 'pengguna'}</span>
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {token ? (
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                                        {isLoggingOut ? 'Keluar...' : 'Keluar'}
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <Lock className="h-4 w-4" />
                                        Masuk Sistem
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1 relative">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari nomor perkara atau pengadilan asal..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">Status Perkara</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { value: 'all', label: 'Semua Status' },
                                        { value: 'processed', label: 'Diterbitkan' },
                                        { value: 'review', label: 'Dalam Review' },
                                        { value: 'rejected', label: 'Ditolak' },
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => setFilterStatus(option.value)}
                                            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                                                filterStatus === option.value
                                                    ? 'bg-emerald-600 text-white shadow-lg'
                                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
                        <p className="text-slate-600">Memuat putusan publik...</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && decisions.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/50 py-16">
                        <Gavel className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-lg font-semibold text-slate-900 mb-2">Belum ada putusan</p>
                        <p className="text-slate-600">Putusan akan ditampilkan setelah dipublikasikan.</p>
                    </div>
                )}

                {/* Results Count */}
                {!isLoading && decisions.length > 0 && (
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-600">
                            Menampilkan <span className="font-bold text-slate-900">{filteredDecisions.length}</span> dari <span className="font-bold text-slate-900">{decisions.length}</span> putusan
                        </p>
                        {(searchQuery || filterStatus !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterStatus('all');
                                }}
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                )}

                {/* Decisions Grid */}
                {!isLoading && filteredDecisions.length > 0 && (
                    <div className="grid gap-6">
                        {filteredDecisions.map((decision, idx) => (
                            <div
                                key={decision.id}
                                style={{ animation: `fadeIn 0.5s ease-out ${idx * 50}ms forwards`, opacity: 0 }}
                            >
                                <DecisionCard decision={decision} />
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results for Filters */}
                {!isLoading && decisions.length > 0 && filteredDecisions.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/50 py-16">
                        <Search className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-lg font-semibold text-slate-900 mb-2">Tidak ada hasil</p>
                        <p className="text-slate-600 mb-4">Coba ubah kriteria pencarian atau filter Anda.</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilterStatus('all');
                            }}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                        >
                            Reset Filter
                        </button>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default PublicPortalPage;