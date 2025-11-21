import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe2, BookOpen, ShieldCheck, LogOut } from 'lucide-react';
import { usePerkaras, useDocuments } from '@/api/hooks';
import { CASE_TYPES, STATUS_VARIANTS } from '@/constants';
import { formatDate, formatStatus } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import { logout as logoutRequest } from '@/api/auth';

const StatCard = ({ label, value, sub }) => (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
);

const RegistrarDashboard = ({ perkaras, documents }) => {
    const pendingOcr = documents.filter((doc) => !doc.teks_ocr).length;
    const awaitingSummary = documents.filter((doc) => (doc.summaries?.length ?? 0) === 0).length;
    const recentDocs = documents.slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dasbor Panitera</h1>
                    <p className="text-sm text-slate-600">Monitor unggahan, pipeline OCR, dan distribusi perkara.</p>
                </div>
                <Link
                    to="/documents/upload"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                    Unggah dokumen baru
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard label="Perkara aktif" value={perkaras.length} />
                <StatCard label="Dokumen masuk" value={documents.length} />
                <StatCard label="Menunggu OCR" value={pendingOcr} sub="Belum diekstrak" />
                <StatCard label="Tanpa ringkasan" value={awaitingSummary} sub="Perlu tindak lanjut" />
            </div>

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900">Dokumen terbaru</h2>
                    <div className="mt-4 divide-y divide-slate-100 text-sm">
                        {recentDocs.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="font-semibold text-slate-900">Dokumen #{doc.id}</p>
                                    <p className="text-xs text-slate-500">{formatDate(doc.tanggal_upload)}</p>
                                </div>
                                <span className="text-xs text-slate-500">{doc.teks_ocr ? 'Sudah OCR' : 'Menunggu OCR'}</span>
                            </div>
                        ))}
                        {recentDocs.length === 0 && <p className="py-3 text-sm text-slate-500">Belum ada dokumen.</p>}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900">Distribusi jenis perkara</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        {CASE_TYPES.map((type) => (
                            <div key={type.value} className="flex items-center justify-between">
                                <span>{type.label}</span>
                                <span className="font-semibold text-slate-900">{perkaras.filter((p) => p.jenis_perkara === type.value).length}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const JudgeDashboard = ({ perkaras, documents }) => {
    const reviewCases = perkaras.filter((caseItem) => caseItem.status === 'review');
    const processedCases = perkaras.filter((caseItem) => caseItem.status === 'processed');
    const needsPublication = documents.filter((doc) => (doc.summaries?.length ?? 0) > 0).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dasbor Hakim</h1>
                <p className="text-sm text-slate-600">Pantau perkara banding dan hasil ringkasan AI.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard label="Perkara siap ditinjau" value={reviewCases.length} />
                <StatCard label="Perkara selesai" value={processedCases.length} />
                <StatCard label="Dokumen siap publikasi" value={needsPublication} sub="Memiliki ringkasan" />
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Perkara prioritas</h2>
                <div className="mt-4 divide-y divide-slate-100">
                    {reviewCases.slice(0, 8).map((perkara) => (
                        <div key={perkara.id} className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{perkara.nomor_perkara}</p>
                                <p className="text-xs text-slate-500">Masuk {formatDate(perkara.tanggal_masuk)}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_VARIANTS[perkara.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                {formatStatus(perkara.status)}
                            </span>
                        </div>
                    ))}
                    {reviewCases.length === 0 && <p className="py-3 text-sm text-slate-500">Tidak ada perkara menunggu review.</p>}
                </div>
            </section>
        </div>
    );
};

const PublicDashboard = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logoutStore = useAuthStore((state) => state.logout);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logoutRequest();
        } catch (error) {
            console.warn('Failed to hit logout endpoint', error.message);
        } finally {
            logoutStore();
            setLoggingOut(false);
            navigate('/login');
        }
    };

    const highlights = [
        {
            icon: Globe2,
            title: 'Portal putusan',
            description: 'Akses dokumen yang telah dipublikasikan secara resmi untuk masyarakat.',
            href: '/public/putusan',
        },
        {
            icon: ShieldCheck,
            title: 'Data terverifikasi',
            description: 'Seluruh dokumen melewati proses validasi internal sebelum dirilis.',
        },
        {
            icon: BookOpen,
            title: 'Ringkasan AI',
            description: 'Setiap putusan dilengkapi ringkasan otomatis untuk mempermudah pembacaan.',
        },
    ];

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50 to-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-indigo-600">Mode publik</p>
                        <h1 className="mt-1 text-2xl font-bold text-slate-900">Selamat datang, {user?.name ?? 'pengguna'}</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Gunakan portal publik untuk melihat putusan dan ringkasan yang siap dibagikan ke masyarakat.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link
                                to="/public/putusan"
                                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                                <Globe2 className="h-4 w-4" /> Portal publik
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                disabled={loggingOut}
                            >
                                <LogOut className="h-4 w-4" /> {loggingOut ? 'Keluar...' : 'Keluar' }
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                {highlights.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                        <item.icon className="h-6 w-6 text-indigo-500" />
                        <h2 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h2>
                        <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                        {item.href && (
                            <Link to={item.href} className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                                Buka tautan →
                            </Link>
                        )}
                    </article>
                ))}
            </section>
        </div>
    );
};

const DashboardPage = () => {
    const role = useAuthStore((state) => state.role);
    const { data: perkaras = [] } = usePerkaras();
    const { data: documents = [] } = useDocuments();

    const content = useMemo(() => {
        if (role === 'panitera') {
            return <RegistrarDashboard perkaras={perkaras} documents={documents} />;
        }

        if (role === 'hakim') {
            return <JudgeDashboard perkaras={perkaras} documents={documents} />;
        }

        return <PublicDashboard />;
    }, [documents, perkaras, role]);

    return content;
};

export default DashboardPage;
