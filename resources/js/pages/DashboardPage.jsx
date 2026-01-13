import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, Gavel, Clock, AlertCircle, UploadCloud,
    TrendingUp, CheckCircle2, ChevronRight, Sparkles, ArrowUpRight, Activity,
    BarChart3, PieChart, Calendar, Scale, Zap, Users, Shield, Eye,
    ArrowRight, Plus, Bell, Star, Target, Layers
} from 'lucide-react';
import { usePerkaras, useDocuments } from '@/api/hooks';
import { CASE_TYPES } from '@/constants';
import { formatDate, formatStatus } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';

// Enhanced Stat Card with 3D hover effect
const StatCard = ({ label, value, sub, icon: Icon, color = "emerald", trend, href, delay = 0 }) => {
    const colorStyles = {
        emerald: {
            bg: "from-emerald-500 to-teal-600",
            icon: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
            trend: "bg-emerald-500/10 text-emerald-700",
            glow: "group-hover:shadow-emerald-500/25"
        },
        blue: {
            bg: "from-blue-500 to-indigo-600",
            icon: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
            trend: "bg-blue-500/10 text-blue-700",
            glow: "group-hover:shadow-blue-500/25"
        },
        amber: {
            bg: "from-amber-500 to-orange-600",
            icon: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
            trend: "bg-amber-500/10 text-amber-700",
            glow: "group-hover:shadow-amber-500/25"
        },
        rose: {
            bg: "from-rose-500 to-pink-600",
            icon: "bg-rose-500/10 text-rose-600 ring-rose-500/20",
            trend: "bg-rose-500/10 text-rose-700",
            glow: "group-hover:shadow-rose-500/25"
        },
        purple: {
            bg: "from-purple-500 to-violet-600",
            icon: "bg-purple-500/10 text-purple-600 ring-purple-500/20",
            trend: "bg-purple-500/10 text-purple-700",
            glow: "group-hover:shadow-purple-500/25"
        },
        cyan: {
            bg: "from-cyan-500 to-blue-600",
            icon: "bg-cyan-500/10 text-cyan-600 ring-cyan-500/20",
            trend: "bg-cyan-500/10 text-cyan-700",
            glow: "group-hover:shadow-cyan-500/25"
        }
    };

    const CardWrapper = href ? Link : 'div';
    const wrapperProps = href ? { to: href } : {};
    const styles = colorStyles[color];

    return (
        <CardWrapper 
            {...wrapperProps} 
            className="block group animate-card-entrance"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-lg hover:shadow-2xl ${styles.glow} transition-all duration-500 group-hover:-translate-y-2`}>
                {/* Animated gradient background on hover */}
                <div className={`absolute inset-0 bg-linear-to-br ${styles.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-current opacity-[0.03] rounded-full transition-transform duration-500 group-hover:scale-150" />
                
                <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-black text-slate-900 tracking-tight tabular-nums">{value}</span>
                                {trend && (
                                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${styles.trend} ring-1 ring-inset ring-current/10`}>
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        +{trend}%
                                    </span>
                                )}
                            </div>
                        </div>
                        {Icon && (
                            <div className={`p-3.5 rounded-xl ring-1 shadow-sm ${styles.icon} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                <Icon className="h-6 w-6" strokeWidth={2.5} />
                            </div>
                        )}
                    </div>
                    {sub && (
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                            <div className={`h-1.5 w-1.5 rounded-full ${styles.icon.split(' ')[1]} animate-pulse`} />
                            <p className="text-xs text-slate-500 font-medium">{sub}</p>
                            <ArrowRight className="h-3 w-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                    )}
                </div>
            </div>
        </CardWrapper>
    );
};

// Quick Action Button Component
const QuickAction = ({ icon: Icon, label, description, href, color = "emerald", delay = 0 }) => {
    const colorStyles = {
        emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/30",
        blue: "from-blue-500 to-indigo-600 shadow-blue-500/30",
        purple: "from-purple-500 to-violet-600 shadow-purple-500/30",
        amber: "from-amber-500 to-orange-600 shadow-amber-500/30",
    };

    return (
        <Link 
            to={href}
            className="group block animate-card-entrance"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="relative p-5 rounded-2xl bg-white border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${colorStyles[color]} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">{label}</h3>
                <p className="text-sm text-slate-500">{description}</p>
                <ArrowRight className="absolute top-5 right-5 h-5 w-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
        </Link>
    );
};

// Mini Progress Bar Component
const MiniProgressBar = ({ label, value, max, color = "emerald" }) => {
    const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
    const colorStyles = {
        emerald: "from-emerald-500 to-teal-500",
        blue: "from-blue-500 to-indigo-500",
        purple: "from-purple-500 to-violet-500",
        amber: "from-amber-500 to-orange-500",
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span className="text-sm font-bold text-slate-900">{value}/{max}</span>
            </div>
            <div className="relative h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div 
                    className={`absolute inset-y-0 left-0 rounded-full bg-linear-to-r ${colorStyles[color]} transition-all duration-1000 ease-out progress-animated`}
                    style={{ width: `${percentage}%` }} 
                />
            </div>
        </div>
    );
};

// Activity Timeline Item
const TimelineItem = ({ icon: Icon, title, time, status, color = "emerald" }) => {
    const colorStyles = {
        emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
        blue: "bg-blue-100 text-blue-600 border-blue-200",
        purple: "bg-purple-100 text-purple-600 border-purple-200",
        amber: "bg-amber-100 text-amber-600 border-amber-200",
    };

    return (
        <div className="flex gap-4 items-start group">
            <div className={`p-2 rounded-lg border ${colorStyles[color]} group-hover:scale-110 transition-transform`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
                <p className="text-xs text-slate-500">{time}</p>
            </div>
            {status && (
                <Badge variant="secondary" className="text-xs shrink-0">{status}</Badge>
            )}
        </div>
    );
};

const RegistrarDashboard = ({ perkaras, documents, user }) => {
    const pendingOcr = documents.filter((doc) => !doc.teks_ocr).length;
    const awaitingSummary = documents.filter((doc) => (doc.summaries?.length ?? 0) === 0).length;
    const completedDocs = documents.filter((doc) => doc.teks_ocr && (doc.summaries?.length ?? 0) > 0).length;
    const recentDocs = documents.slice(0, 4);
    const totalProgress = documents.length > 0 ? Math.round((completedDocs / documents.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/30 pt-6 px-4 sm:px-8">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-2xl shadow-emerald-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                    
                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl floating-slow" />
                    <div className="absolute bottom-4 left-1/3 w-24 h-24 bg-cyan-300/20 rounded-full blur-2xl floating-delayed" />
                    
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30">
                                <Sparkles className="h-3.5 w-3.5 mr-1.5 animate-pulse" />
                                Dashboard Panitera
                            </Badge>
                            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                                Selamat Datang, {user?.name}
                            </h1>
                            <p className="text-emerald-50 text-lg">
                                Kelola dokumen dan perkara pengadilan dengan efisien
                            </p>
                            
                            {/* Quick Stats in Header */}
                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                                    <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                                    <span className="text-sm font-medium text-white">{pendingOcr} pending OCR</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                                    <span className="text-sm font-medium text-white">{totalProgress}% selesai</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button 
                                className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl shadow-black/10 border-0 h-12 px-6 text-base font-semibold btn-shine"
                                onClick={() => window.location.href = '/documents/upload'}
                            >
                                <UploadCloud className="mr-2 h-5 w-5" />
                                Unggah Dokumen
                            </Button>
                            <Button 
                                variant="outline"
                                className="bg-white/10 text-white border-white/30 hover:bg-white/20 h-10 text-sm"
                                onClick={() => window.location.href = '/cases/new'}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Perkara
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        label="Perkara Aktif" 
                        value={perkaras.length} 
                        icon={Gavel} 
                        color="blue" 
                        sub="Total perkara terdaftar"
                        trend={8}
                        href="/cases"
                        delay={0}
                    />
                    <StatCard 
                        label="Total Dokumen" 
                        value={documents.length} 
                        icon={FileText} 
                        color="emerald" 
                        sub="Arsip digital tersedia"
                        trend={12}
                        href="/documents"
                        delay={100}
                    />
                    <StatCard 
                        label="Pending OCR" 
                        value={pendingOcr} 
                        icon={Activity} 
                        color="amber" 
                        sub="Menunggu pemindaian"
                        href="/documents"
                        delay={200}
                    />
                    <StatCard 
                        label="Dokumen Lengkap" 
                        value={completedDocs} 
                        icon={CheckCircle2} 
                        color="purple" 
                        sub="OCR + AI Summary"
                        href="/documents"
                        delay={300}
                    />
                </div>

                {/* Quick Actions Section */}
                <div className="mt-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Aksi Cepat</h2>
                            <p className="text-sm text-slate-500">Akses fitur utama dengan cepat</p>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <QuickAction 
                            icon={UploadCloud}
                            label="Upload Dokumen"
                            description="Unggah dokumen baru untuk OCR"
                            href="/documents/upload"
                            color="emerald"
                            delay={0}
                        />
                        <QuickAction 
                            icon={Scale}
                            label="Asisten Hukum AI"
                            description="Rekomendasi pasal & peraturan"
                            href="/legal-advisor"
                            color="purple"
                            delay={100}
                        />
                        <QuickAction 
                            icon={Eye}
                            label="Pencarian Lanjutan"
                            description="Cari dokumen dengan AI"
                            href="/search"
                            color="blue"
                            delay={200}
                        />
                        <QuickAction 
                            icon={Shield}
                            label="Anonimisasi"
                            description="Redaksi data sensitif"
                            href="/anonymization"
                            color="amber"
                            delay={300}
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Recent Documents - Takes 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Documents Card */}
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-blue-50/50 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">Dokumen Terbaru</CardTitle>
                                            <p className="text-sm text-slate-500 mt-0.5">4 dokumen terakhir yang diunggah</p>
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
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {recentDocs.length > 0 ? (
                                        recentDocs.map((doc, idx) => (
                                            <Link
                                                key={doc.id}
                                                to={`/documents/${doc.id}`}
                                                className="group relative p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 animate-card-entrance"
                                                style={{ animationDelay: `${idx * 100}ms` }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="relative shrink-0">
                                                        <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                                                            <FileText className="h-6 w-6" strokeWidth={2.5} />
                                                        </div>
                                                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${doc.teks_ocr ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                                            {doc.teks_ocr ? '✓' : '⏳'}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                                                            Dokumen #{doc.id}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {doc.jenis_dokumen || 'Dokumen'}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-2">
                                                            <Calendar className="h-3 w-3 text-slate-400" />
                                                            <p className="text-xs text-slate-400">
                                                                {formatDate(doc.tanggal_upload)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-12">
                                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 mb-4">
                                                <UploadCloud className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <p className="text-base font-semibold text-slate-900 mb-1">Belum ada dokumen</p>
                                            <p className="text-sm text-slate-500 mb-4">Mulai dengan mengunggah dokumen baru</p>
                                            <Button 
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white"
                                                onClick={() => window.location.href = '/documents/upload'}
                                            >
                                                <UploadCloud className="mr-2 h-4 w-4" />
                                                Upload Sekarang
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Progress Overview Card */}
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-purple-50/50 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                        <Target className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Progress Pemrosesan</CardTitle>
                                        <p className="text-sm text-slate-500 mt-0.5">Status pengolahan dokumen</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <MiniProgressBar 
                                    label="OCR Selesai" 
                                    value={documents.length - pendingOcr} 
                                    max={documents.length} 
                                    color="emerald" 
                                />
                                <MiniProgressBar 
                                    label="Ringkasan AI" 
                                    value={completedDocs} 
                                    max={documents.length} 
                                    color="purple" 
                                />
                                <MiniProgressBar 
                                    label="Perkara Selesai" 
                                    value={perkaras.filter(p => p.status === 'processed').length} 
                                    max={perkaras.length} 
                                    color="blue" 
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Case Distribution & Activity */}
                    <div className="space-y-6">
                        {/* Case Distribution */}
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-purple-50/50 border-b border-slate-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                        <PieChart className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Distribusi Perkara</CardTitle>
                                        <p className="text-sm text-slate-500 mt-0.5">Berdasarkan jenis</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="space-y-4">
                                    {CASE_TYPES.map((type, idx) => {
                                        const count = perkaras.filter((p) => p.jenis_perkara === type.value).length;
                                        const percentage = perkaras.length ? Math.round((count / perkaras.length) * 100) : 0;
                                        const colors = ['from-emerald-500 to-teal-500', 'from-blue-500 to-indigo-500', 'from-purple-500 to-violet-500', 'from-amber-500 to-orange-500'];
                                        return (
                                            <div key={type.value} className="space-y-2 animate-card-entrance" style={{ animationDelay: `${idx * 100}ms` }}>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-700">{type.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900 tabular-nums">{count}</span>
                                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                                    <div 
                                                        className={`absolute inset-y-0 left-0 rounded-full bg-linear-to-r ${colors[idx % colors.length]} transition-all duration-1000 ease-out progress-animated`}
                                                        style={{ width: `${percentage}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Features Highlight */}
                        {/* <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-linear-to-br from-emerald-600 to-teal-600 text-white overflow-hidden">
                            <CardContent className="p-6 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                                            <Star className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-bold text-lg">Fitur Unggulan</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {[
                                            { icon: Eye, text: 'OCR Dokumen Otomatis' },
                                            { icon: Sparkles, text: 'Ringkasan AI Cerdas' },
                                            { icon: Shield, text: 'Anonimisasi Data' },
                                            { icon: Scale, text: 'Asisten Hukum AI' },
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-sm text-emerald-50">
                                                <div className="p-1.5 rounded-lg bg-white/10">
                                                    <item.icon className="h-4 w-4" />
                                                </div>
                                                {item.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card> */}
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
                    
                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl floating-slow" />
                    
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30">
                                <Gavel className="h-3.5 w-3.5 mr-1.5" />
                                Dashboard Hakim
                            </Badge>
                            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                                Selamat Datang, Yang Mulia {user?.name}
                            </h1>
                            <p className="text-purple-50 text-lg">
                                Tinjau perkara dan validasi ringkasan dokumen dengan efektif
                            </p>
                            
                            {/* Quick Stats in Header */}
                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                                    <Clock className="h-4 w-4 text-amber-300" />
                                    <span className="text-sm font-medium text-white">{reviewCases.length} menunggu review</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                                    <span className="text-sm font-medium text-white">{processedCases.length} selesai</span>
                                </div>
                            </div>
                        </div>
                        <Button 
                            className="bg-white text-purple-700 hover:bg-purple-50 shadow-xl shadow-black/10 border-0 h-12 px-6 text-base font-semibold btn-shine"
                            onClick={() => window.location.href = '/cases'}
                        >
                            <Scale className="mr-2 h-5 w-5" />
                            Lihat Perkara
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard 
                        label="Siap Tinjau" 
                        value={reviewCases.length} 
                        icon={Clock}
                        color="amber"
                        sub="Perkara menunggu review"
                        href="/cases"
                        delay={0}
                    />
                    <StatCard 
                        label="Selesai Diproses" 
                        value={processedCases.length} 
                        icon={CheckCircle2}
                        color="emerald"
                        sub="Perkara telah diputus"
                        href="/cases"
                        delay={100}
                    />
                    <StatCard 
                        label="Siap Publikasi" 
                        value={needsPublication} 
                        icon={FileText}
                        color="blue"
                        sub="Dokumen dengan ringkasan"
                        href="/documents"
                        delay={200}
                    />
                </div>

                {/* Quick Actions for Judge */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 rounded-lg bg-linear-to-br from-purple-500 to-violet-600 text-white">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Aksi Cepat</h2>
                            <p className="text-sm text-slate-500">Fitur yang sering digunakan</p>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <QuickAction 
                            icon={Scale}
                            label="Asisten Hukum AI"
                            description="Dapatkan rekomendasi pasal"
                            href="/legal-advisor"
                            color="purple"
                            delay={0}
                        />
                        <QuickAction 
                            icon={Eye}
                            label="Pencarian Dokumen"
                            description="Cari dengan kata kunci atau AI"
                            href="/search"
                            color="blue"
                            delay={100}
                        />
                        <QuickAction 
                            icon={FileText}
                            label="Portal Publik"
                            description="Lihat putusan terpublikasi"
                            href="/public/putusan"
                            color="emerald"
                            delay={200}
                        />
                    </div>
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
                        <div className="grid gap-4 sm:grid-cols-2">
                            {reviewCases.slice(0, 4).length > 0 ? (
                                reviewCases.slice(0, 4).map((perkara, idx) => (
                                    <Link
                                        key={perkara.id}
                                        to={`/cases`}
                                        className="group relative p-4 rounded-xl border border-slate-200 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 animate-card-entrance"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="relative shrink-0">
                                                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                                                    <Gavel className="h-6 w-6" strokeWidth={2.5} />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                                                    {perkara.nomor_perkara}
                                                </p>
                                                <div className="flex items-center gap-1 mt-2">
                                                    <Calendar className="h-3 w-3 text-slate-400" />
                                                    <p className="text-xs text-slate-500">
                                                        Masuk: {formatDate(perkara.tanggal_masuk)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge 
                                            variant="outline" 
                                            className="absolute top-4 right-4 bg-amber-50 text-amber-700 border-amber-200 text-xs"
                                        >
                                            {formatStatus(perkara.status)}
                                        </Badge>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12">
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