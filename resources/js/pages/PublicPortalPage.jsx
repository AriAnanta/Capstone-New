import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePublicDecisions } from '@/api/hooks';
import { formatDate } from '@/utils/format';
import { logout as logoutRequest } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { 
    LogOut, Search, Filter, Calendar, FileText, Gavel, X, 
    ChevronRight, Scale, Lock, Eye, EyeOff, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

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

    const getStatusVariant = (status) => {
        switch(status) {
            case 'processed': return 'success';
            case 'review': return 'warning';
            case 'rejected': return 'destructive';
            default: return 'secondary';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'processed': return 'from-emerald-500 to-teal-600';
            case 'review': return 'from-amber-500 to-orange-600';
            case 'rejected': return 'from-rose-500 to-red-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    return (
        <Card className="group overflow-hidden border-slate-200/60 bg-white shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-0">
                {/* Header with Case Number and Status - Enhanced with Colors */}
                <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 px-6 py-6 border-b border-white/20">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                    
                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-cyan-300/20 rounded-full blur-xl"></div>
                    
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/90 backdrop-blur-sm">
                                    Nomor Perkara
                                </p>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                                {decision.nomor_perkara}
                            </h2>
                        </div>
                        <Badge 
                            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider shrink-0 bg-white/20 text-white border-2 border-green-400 backdrop-blur-md shadow-xl hover:bg-white/30 transition-all"
                        >
                            {decision.status === 'processed' && '✓ Published'}
                            {decision.status === 'review' && '⏱ In Review'}
                            {decision.status === 'rejected' && '✕ Rejected'}
                            {!['processed', 'review', 'rejected'].includes(decision.status) && decision.status}
                        </Badge>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Court and Date Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <div className="flex items-center gap-2.5 bg-linear-to-br from-emerald-50 to-teal-50 px-4 py-2.5 rounded-xl border border-emerald-100 shadow-sm">
                            <Gavel className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold text-slate-700">{decision.pengadilan_asal}</span>
                        </div>
                        <div className="flex items-center gap-2.5 bg-linear-to-br from-slate-50 to-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-slate-600">{formatDate(decision.tanggal_masuk)}</span>
                        </div>
                    </div>

                    {/* Documents Section - Show only if exists */}
                    {decision.documents && decision.documents.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5" />
                                Dokumen ({decision.documents.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {decision.documents.map((doc) => (
                                    <Badge 
                                        key={doc.id} 
                                        variant="secondary" 
                                        className="bg-linear-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 border border-slate-300 px-3 py-1.5 font-medium shadow-sm"
                                    >
                                        {doc.jenis_dokumen}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Public Summary */}
                    {publicSummary ? (
                        <div className="rounded-xl border-2 border-emerald-200 bg-linear-to-br from-emerald-50/80 via-teal-50/50 to-cyan-50/30 p-6 space-y-3 shadow-inner">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Ringkasan Publik</span>
                                </div>
                                <span className="text-xs font-medium text-slate-500 bg-white/70 px-3 py-1 rounded-full shadow-sm">{formatDate(publicSummary.created_at)}</span>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{displayText}</p>
                            {shouldTruncate && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => setExpanded((prev) => !prev)}
                                    className="mt-2 p-0 h-auto text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1"
                                >
                                    {expanded ? 'Sembunyikan' : 'Baca Selengkapnya'}
                                    <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl bg-linear-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 p-6 text-center">
                            <Lock className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                            <p className="text-sm text-slate-600 font-medium">
                                Ringkasan publik belum tersedia untuk perkara ini
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
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
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 pt-6 px-4 sm:px-8">
            {/* Hero Header with Official PTA Bandung Branding */}
            <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-2xl shadow-emerald-500/20 mb-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                
                {/* Floating decorative elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl floating-slow" />
                <div className="absolute bottom-4 left-1/3 w-24 h-24 bg-cyan-300/20 rounded-full blur-2xl floating-delayed" />
                
                <div className="relative z-20">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
                        <div className="flex-1">
                            {/* Official Logo & Branding */}
                            <div className="flex items-start gap-5 mb-6">
                                <div className="relative shrink-0">
                                    <div className="h-16 w-16 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg shadow-emerald-500/30 group p-2">
                                        <img src="/images/logo-pta.png" alt="Logo PTA Bandung" className="h-full w-full object-contain" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 ring-2 ring-white flex items-center justify-center">
                                        <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30">
                                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                                        Portal Publik
                                    </Badge>
                                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                                        Pengadilan Tinggi Agama Bandung
                                    </h1>
                                </div>
                            </div>
                            
                            <p className="text-emerald-50 text-lg">
                                Akses transparan ke ringkasan putusan yang telah dipublikasikan dan diverifikasi secara resmi
                            </p>
                            
                            {/* Quick Stats in Header */}
                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-sm font-medium text-white">{decisions.length} putusan tersedia</span>
                                </div>
                                {token && (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                                        <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                                        <span className="text-sm font-medium text-white">{user?.name ?? 'Pengguna'}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {token ? (
                                <Button 
                                    variant="outline"
                                    onClick={handleLogout} 
                                    disabled={isLoggingOut}
                                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 h-10 text-sm"
                                >
                                    {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                                    Keluar
                                </Button>
                            ) : (
                                <Button 
                                    className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl shadow-black/10 border-0 h-12 px-6 text-base font-semibold btn-shine"
                                    asChild
                                >
                                    <Link to="/login">
                                        <Scale className="mr-2 h-5 w-5" />
                                        Login
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="max-w-3xl">
                        <div className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/20 flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nomor perkara atau pengadilan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 text-base shadow-inner"
                                />
                            </div>
                             <Button
                                 variant={showFilters ? "primary" : "secondary"}
                                 onClick={() => setShowFilters(!showFilters)}
                                 className="gap-2 shrink-0 rounded-xl"
                             >
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                        </div>

                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="mt-4 animate-in slide-in-from-top-2">
                                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-5">
                                    <p className="text-xs font-bold uppercase tracking-wide text-white/70 mb-4">Status Publikasi</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { value: 'all', label: 'Semua' },
                                            { value: 'processed', label: 'Diterbitkan' },
                                            { value: 'review', label: 'Dalam Review' },
                                            { value: 'rejected', label: 'Ditolak' },
                                        ].map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => setFilterStatus(option.value)}
                                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                    filterStatus === option.value
                                                        ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                                                        : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section for Decisions List */}
                {!isLoading && decisions.length > 0 && (
                    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 shadow-2xl shadow-emerald-500/20 mb-8">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                        
                        {/* Floating decorative elements */}
                        <div className="absolute top-2 right-2 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute bottom-2 left-1/4 w-16 h-16 bg-cyan-300/20 rounded-full blur-xl" />
                        
                        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <Badge className="mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider">
                                        Database Putusan
                                    </Badge>
                                    <h2 className="text-2xl font-black text-white tracking-tight">
                                        Daftar Putusan Terbaru
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                                    <p className="text-xs text-white font-medium">
                                        Total: <span className="font-bold text-2xl ml-1">{filteredDecisions.length}</span>
                                        <span className="text-emerald-100 ml-1">putusan</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4" />
                        <p className="text-slate-600 font-medium">Memuat data publik...</p>
                    </div>
                )}

                {/* Grid */}
                {!isLoading && filteredDecisions.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {filteredDecisions.map((decision, idx) => (
                            <div
                                key={decision.id}
                                className="animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'backwards' }}
                            >
                                <DecisionCard decision={decision} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty States */}
                {!isLoading && decisions.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-6">
                            <Gavel className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Putusan</h3>
                        <p className="text-slate-500">Saat ini belum ada data putusan yang dipublikasikan.</p>
                    </div>
                )}

                {!isLoading && decisions.length > 0 && filteredDecisions.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
                            <Search className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Tidak Ditemukan</h3>
                        <p className="text-slate-500 mb-6">Penelusuran tidak memberikan hasil. Coba kata kunci lain atau reset filter.</p>
                        <Button 
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('');
                                setFilterStatus('all');
                            }}
                        >
                            Reset Pencarian
                        </Button>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes move {
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: 20px 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PublicPortalPage;