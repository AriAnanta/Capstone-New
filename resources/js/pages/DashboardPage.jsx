import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, Gavel, Clock, AlertCircle, UploadCloud,
    TrendingUp, CheckCircle2, ChevronRight, Sparkles, ArrowUpRight, Activity,
    BarChart3, PieChart, Calendar, Scale
} from 'lucide-react';
import { usePerkaras, useDocuments } from '@/api/hooks';
import { CASE_TYPES } from '@/constants';
import { formatDate, formatStatus } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';

const StatCard = ({ label, value, sub, icon: Icon, color = "emerald", trend, href }) => {
    const colorStyles = {
        emerald: {
            bg: "from-emerald-500 to-teal-600",
            icon: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
            trend: "bg-emerald-500/10 text-emerald-700"
        },
        blue: {
            bg: "from-blue-500 to-indigo-600",
            icon: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
            trend: "bg-blue-500/10 text-blue-700"
        },
        amber: {
            bg: "from-amber-500 to-orange-600",
            icon: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
            trend: "bg-amber-500/10 text-amber-700"
        },
        rose: {
            bg: "from-rose-500 to-pink-600",
            icon: "bg-rose-500/10 text-rose-600 ring-rose-500/20",
            trend: "bg-rose-500/10 text-rose-700"
        },
        purple: {
            bg: "from-purple-500 to-violet-600",
            icon: "bg-purple-500/10 text-purple-600 ring-purple-500/20",
            trend: "bg-purple-500/10 text-purple-700"
        }
    };

    const CardWrapper = href ? Link : 'div';
    const wrapperProps = href ? { to: href } : {};
    const styles = colorStyles[color];

    return (
        <CardWrapper {...wrapperProps} className="block group">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group-hover:-translate-y-1">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-linear-to-br ${styles.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-slate-900 tracking-tight tabular-nums">{value}</span>
                                {trend && (
                                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${styles.trend} ring-1 ring-inset ring-current/10`}>
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        +{trend}%
                                    </span>
                                )}
                            </div>
                        </div>
                        {Icon && (
                            <div className={`p-3.5 rounded-xl ring-1 shadow-sm ${styles.icon} group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="h-6 w-6" strokeWidth={2.5} />
                            </div>
                        )}
                    </div>
                    {sub && (
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                            <div className={`h-1.5 w-1.5 rounded-full ${styles.icon.split(' ')[1]}`} />
                            <p className="text-xs text-slate-500 font-medium">{sub}</p>
                        </div>
                    )}
                </div>
            </div>
        </CardWrapper>
    );
};

const RegistrarDashboard = ({ perkaras, documents, user }) => {
    const pendingOcr = documents.filter((doc) => !doc.teks_ocr).length;
    const awaitingSummary = documents.filter((doc) => (doc.summaries?.length ?? 0) === 0).length;
    const completedDocs = documents.filter((doc) => doc.teks_ocr && (doc.summaries?.length ?? 0) > 0).length;
    const recentDocs = documents.slice(0, 5);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-2xl shadow-emerald-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30">
                                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                                Dashboard Panitera
                            </Badge>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                                Selamat Datang, {user?.name}
                            </h1>
                            <p className="text-emerald-50 text-lg">
                                Kelola dokumen dan perkara pengadilan dengan efisien
                            </p>
                        </div>
                        <Button 
                            className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl shadow-black/10 border-0 h-12 px-6 text-base font-semibold"
                            onClick={() => window.location.href = '/documents/upload'}
                        >
                            <UploadCloud className="mr-2 h-5 w-5" />
                            Unggah Dokumen
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        label="Perkara Aktif" 
                        value={perkaras.length} 
                        icon={Gavel} 
                        color="blue" 
                        sub="Total perkara terdaftar"
                        trend={8}
                        href="/cases"
                    />
                    <StatCard 
                        label="Total Dokumen" 
                        value={documents.length} 
                        icon={FileText} 
                        color="emerald" 
                        sub="Arsip digital tersedia"
                        trend={12}
                        href="/documents"
                    />
                    <StatCard 
                        label="Pending OCR" 
                        value={pendingOcr} 
                        icon={Activity} 
                        color="amber" 
                        sub="Menunggu pemindaian"
                        href="/documents"
                    />
                    <StatCard 
                        label="Dokumen Lengkap" 
                        value={completedDocs} 
                        icon={CheckCircle2} 
                        color="purple" 
                        sub="OCR + AI Summary"
                        href="/documents"
                    />
                </div>

                {/* Content Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Recent Documents */}
                    <div className="lg:col-span-2">
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-blue-50/50 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">Dokumen Terbaru</CardTitle>
                                            <p className="text-sm text-slate-500 mt-0.5">5 dokumen terakhir yang diunggah</p>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                        onClick={() => window.location.href='/documents'}
                                    >
                                        Lihat Semua 
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {recentDocs.length > 0 ? (
                                        recentDocs.map((doc, idx) => (
                                            <Link
                                                key={doc.id}
                                                to={`/documents/${doc.id}`}
                                                className="group flex items-center justify-between p-4 rounded-xl hover:bg-linear-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 border border-transparent hover:border-emerald-100 hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                                                            <FileText className="h-6 w-6" strokeWidth={2.5} />
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-600">
                                                            {idx + 1}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors text-base">
                                                            Dokumen #{doc.id}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                            <p className="text-sm text-slate-500">
                                                                {formatDate(doc.tanggal_upload)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge 
                                                    variant={doc.teks_ocr ? "success" : "warning"}
                                                    className="text-xs font-semibold px-3 py-1"
                                                >
                                                    {doc.teks_ocr ? '✓ OCR Ready' : '⏳ Processing'}
                                                </Badge>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 mb-4">
                                                <UploadCloud className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <p className="text-base font-semibold text-slate-900 mb-1">Belum ada dokumen</p>
                                            <p className="text-sm text-slate-500">Mulai dengan mengunggah dokumen baru</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Case Distribution */}
                    <div>
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-purple-50/50 border-b border-slate-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                        <PieChart className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Distribusi Perkara</CardTitle>
                                        <p className="text-sm text-slate-500 mt-0.5">Berdasarkan jenis</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-5">
                                    {CASE_TYPES.map((type) => {
                                        const count = perkaras.filter((p) => p.jenis_perkara === type.value).length;
                                        const percentage = perkaras.length ? Math.round((count / perkaras.length) * 100) : 0;
                                        return (
                                            <div key={type.value} className="space-y-2.5">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-semibold text-slate-700">{type.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900 tabular-nums">{count}</span>
                                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="relative h-2.5 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
                                                    <div 
                                                        className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-1000 ease-out shadow-lg" 
                                                        style={{ width: `${percentage}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

const JudgeDashboard = ({ perkaras, documents, user }) => {
    const reviewCases = perkaras.filter((caseItem) => caseItem.status === 'review');
    const processedCases = perkaras.filter((caseItem) => caseItem.status === 'processed');
    const needsPublication = documents.filter((doc) => (doc.summaries?.length ?? 0) > 0).length;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-600 via-violet-600 to-indigo-600 p-8 shadow-2xl shadow-purple-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30">
                                <Gavel className="h-3.5 w-3.5 mr-1.5" />
                                Dashboard Hakim
                            </Badge>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                                Selamat Datang, Yang Mulia {user?.name}
                            </h1>
                            <p className="text-purple-50 text-lg">
                                Tinjau perkara dan validasi ringkasan dokumen dengan efektif
                            </p>
                        </div>
                        <Button 
                            className="bg-white text-purple-700 hover:bg-purple-50 shadow-xl shadow-black/10 border-0 h-12 px-6 text-base font-semibold"
                            onClick={() => window.location.href = '/cases'}
                        >
                            <Scale className="mr-2 h-5 w-5" />
                            Lihat Perkara
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard 
                        label="Siap Tinjau" 
                        value={reviewCases.length} 
                        icon={Clock}
                        color="blue"
                        sub="Perkara menunggu review"
                        href="/cases"
                    />
                    <StatCard 
                        label="Selesai Diproses" 
                        value={processedCases.length} 
                        icon={CheckCircle2}
                        color="emerald"
                        sub="Perkara telah diputus"
                        href="/cases"
                    />
                    <StatCard 
                        label="Siap Publikasi" 
                        value={needsPublication} 
                        icon={FileText}
                        color="amber"
                        sub="Dokumen dengan ringkasan"
                        href="/documents"
                    />
                </div>

                {/* Priority Cases */}
                <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                    <CardHeader className="bg-linear-to-r from-slate-50 to-purple-50/50 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Antrian Review</CardTitle>
                                    <p className="text-sm text-slate-500 mt-0.5">Perkara yang memerlukan tinjauan hakim</p>
                                </div>
                            </div>
                            <Badge 
                                className="bg-amber-100 text-amber-700 border-amber-200 text-sm font-semibold px-4 py-1.5"
                            >
                                {reviewCases.length} Pending
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            {reviewCases.slice(0, 5).length > 0 ? (
                                reviewCases.slice(0, 5).map((perkara, idx) => (
                                    <Link
                                        key={perkara.id}
                                        to={`/cases`}
                                        className="group flex items-center justify-between p-4 rounded-xl hover:bg-linear-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 border border-transparent hover:border-purple-100 hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative">
                                                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                                                    <Gavel className="h-6 w-6" strokeWidth={2.5} />
                                                </div>
                                                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {idx + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors text-base">
                                                    {perkara.nomor_perkara}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                    <p className="text-sm text-slate-500">
                                                        Masuk: {formatDate(perkara.tanggal_masuk)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge 
                                            variant="outline" 
                                            className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-semibold px-3 py-1"
                                        >
                                            {formatStatus(perkara.status)}
                                        </Badge>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-16">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-emerald-200 mb-4">
                                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <p className="text-base font-semibold text-slate-900 mb-1">Semua perkara telah ditinjau</p>
                                    <p className="text-sm text-slate-500">Tidak ada antrian pending saat ini</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const role = useAuthStore((state) => state.role);
    const user = useAuthStore((state) => state.user);
    const { data: perkaras = [] } = usePerkaras();
    const { data: documents = [] } = useDocuments();

    const content = useMemo(() => {
        if (role === 'panitera') {
            return <RegistrarDashboard perkaras={perkaras} documents={documents} user={user} />;
        }
        return <JudgeDashboard perkaras={perkaras} documents={documents} user={user} />;
    }, [documents, perkaras, role, user]);

    return (
        <main>
            {content}
        </main>
    );
};

export default DashboardPage;