import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, Gavel, Clock, AlertCircle, UploadCloud,
    TrendingUp, CheckCircle2, ChevronRight, Sparkles, ArrowUpRight
} from 'lucide-react';
import { usePerkaras, useDocuments } from '@/api/hooks';
import { CASE_TYPES } from '@/constants';
import { formatDate, formatStatus } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';

const StatCard = ({ label, value, sub, icon: Icon, color = "emerald", trend, href }) => {
    const colorMap = {
        emerald: {
            bg: "bg-linear-to-br from-emerald-500/10 to-teal-500/10",
            icon: "bg-linear-to-br from-emerald-500 to-teal-600 text-white",
            border: "border-emerald-500/20 hover:border-emerald-500/50"
        },
        blue: {
            bg: "bg-linear-to-br from-blue-500/10 to-cyan-500/10",
            icon: "bg-linear-to-br from-blue-500 to-cyan-600 text-white",
            border: "border-blue-500/20 hover:border-blue-500/50"
        },
        amber: {
            bg: "bg-linear-to-br from-amber-500/10 to-orange-500/10",
            icon: "bg-linear-to-br from-amber-500 to-orange-600 text-white",
            border: "border-amber-500/20 hover:border-amber-500/50"
        },
        rose: {
            bg: "bg-linear-to-br from-rose-500/10 to-pink-500/10",
            icon: "bg-linear-to-br from-rose-500 to-pink-600 text-white",
            border: "border-rose-500/20 hover:border-rose-500/50"
        },
    };

    const colors = colorMap[color];
    const CardComponent = href ? Link : 'div';
    const cardProps = href ? { to: href } : {};

    return (
        <CardComponent
            {...cardProps}
            className={`group relative overflow-hidden rounded-2xl ${colors.bg} border ${colors.border} p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer`}
        >
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">{label}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-4xl font-bold tracking-tight text-slate-900">{value}</p>
                        {trend && (
                            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-100 shadow-sm">
                                <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                                <span className="text-xs font-bold text-emerald-600">{trend}%</span>
                            </div>
                        )}
                    </div>
                </div>
                {Icon && (
                    <div className={`rounded-2xl p-3 ${colors.icon} shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                    </div>
                )}
            </div>
            {sub && (
                <div className="mt-4 flex items-center text-xs font-medium text-slate-500">
                    {sub}
                </div>
            )}
        </CardComponent>
    );
};

const RegistrarDashboard = ({ perkaras, documents, user }) => {
    const pendingOcr = documents.filter((doc) => !doc.teks_ocr).length;
    const awaitingSummary = documents.filter((doc) => (doc.summaries?.length ?? 0) === 0).length;
    const recentDocs = documents.slice(0, 6);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Dasbor Panitera</h1>
                        <Sparkles className="h-8 w-8 text-amber-500" />
                    </div>
                    <p className="text-slate-600">Selamat datang, <span className="font-semibold text-slate-900">{user?.name}</span>. Pantau status dokumen dan perkara secara realtime.</p>
                </div>
                <Link
                    to="/documents/upload"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95 whitespace-nowrap"
                >
                    <UploadCloud className="h-5 w-5" />
                    Unggah Dokumen Baru
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    label="Perkara Aktif" 
                    value={perkaras.length} 
                    icon={Gavel} 
                    color="blue" 
                    sub="Total dalam sistem"
                    trend={12}
                    href="/cases"
                />
                <StatCard 
                    label="Dokumen" 
                    value={documents.length} 
                    icon={FileText} 
                    color="emerald" 
                    sub="Total tersimpan"
                    href="/documents"
                />
                <StatCard 
                    label="Menunggu OCR" 
                    value={pendingOcr} 
                    icon={Clock} 
                    color="amber" 
                    sub="Perlu diproses"
                    href="/documents"
                />
                <StatCard 
                    label="No Summary" 
                    value={awaitingSummary} 
                    icon={AlertCircle} 
                    color="rose" 
                    sub="Perlu ringkasan"
                    href="/documents"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Documents */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-sm p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Dokumen Terbaru</h2>
                        <Link to="/documents" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                            Lihat semua <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentDocs.length > 0 ? (
                            recentDocs.map((doc, idx) => (
                                <Link
                                    key={doc.id}
                                    to={`/documents/${doc.id}`}
                                    className="group flex items-center justify-between rounded-xl border border-slate-100 bg-linear-to-r from-slate-50 to-transparent p-4 transition-all duration-300 hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-md hover:-translate-y-1"
                                    style={{ animationDelay: `${idx * 30}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-600 group-hover:from-emerald-200 group-hover:to-teal-200 transition-colors shadow-sm">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Dokumen #{doc.id}</p>
                                            <p className="text-xs text-slate-500">{formatDate(doc.tanggal_upload)}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                                        doc.teks_ocr 
                                            ? 'bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200' 
                                            : 'bg-amber-100 text-amber-700 shadow-sm ring-1 ring-amber-200'
                                    }`}>
                                        {doc.teks_ocr ? '✓ OCR Selesai' : '◐ Menunggu OCR'}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                                <p className="font-medium">Belum ada dokumen</p>
                                <p className="text-sm mt-1">Mulai dengan mengunggah dokumen baru</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Case Distribution */}
                <div className="rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-sm p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Distribusi Perkara</h2>
                    <div className="space-y-5">
                        {CASE_TYPES.map((type) => {
                            const count = perkaras.filter((p) => p.jenis_perkara === type.value).length;
                            const percentage = perkaras.length ? Math.round((count / perkaras.length) * 100) : 0;
                            return (
                                <div key={type.value} className="group">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-700 font-semibold">{type.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-900 font-bold text-sm">{count}</span>
                                            <span className="text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded">({percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden shadow-sm">
                                        <div 
                                            className="h-2.5 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-500" 
                                            style={{ width: `${percentage}%` }} 
                                        />
                                    </div>
                                </div>
                            );
                        })}
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
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-slate-900">Dasbor Hakim</h1>
                    <Sparkles className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-slate-600">Selamat datang, <span className="font-semibold text-slate-900">{user?.name}</span>. Pantau perkara banding dan ringkasan terbaru.</p>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard 
                    label="Perkara Siap Tinjau" 
                    value={reviewCases.length} 
                    icon={Clock}
                    color="blue"
                    href="/cases"
                />
                <StatCard 
                    label="Perkara Selesai" 
                    value={processedCases.length} 
                    icon={CheckCircle2}
                    color="emerald"
                    href="/cases"
                />
                <StatCard 
                    label="Siap Publikasi" 
                    value={needsPublication} 
                    icon={FileText}
                    color="amber"
                    sub="Memiliki ringkasan"
                    href="/documents"
                />
            </div>

            {/* Priority Cases */}
            <div className="rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-sm p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Perkara Prioritas</h2>
                    <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                        {reviewCases.length} menunggu
                    </span>
                </div>
                <div className="divide-y divide-slate-100">
                    {reviewCases.slice(0, 8).length > 0 ? (
                        reviewCases.slice(0, 8).map((perkara) => (
                            <Link
                                key={perkara.id}
                                to={`/cases`}
                                className="flex items-center justify-between py-4 group hover:bg-emerald-50/50 px-2 rounded-lg transition-colors"
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">{perkara.nomor_perkara}</p>
                                    <p className="text-xs text-slate-500">Masuk {formatDate(perkara.tanggal_masuk)}</p>
                                </div>
                                <span className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                                    {formatStatus(perkara.status)}
                                </span>
                            </Link>
                        ))
                    ) : (
                        <div className="py-8 text-center text-sm text-slate-500">
                            <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-300 mb-3" />
                            <p className="font-medium">Tidak ada perkara menunggu review</p>
                        </div>
                    )}
                </div>
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
        <main className="space-y-6">
            {content}
        </main>
    );
};

export default DashboardPage;