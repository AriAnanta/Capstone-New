import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CASE_TYPES } from '@/constants';
import { useCreatePerkara } from '@/api/hooks';
import { 
    ArrowLeft, Save, FileText, AlertCircle, Loader2,
    Calendar, Building2, DollarSign, MessageSquare, Zap
} from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft', description: 'Perkara dalam tahap draft' },
    { value: 'review', label: 'Review', description: 'Menunggu review' },
    { value: 'processed', label: 'Diproses', description: 'Sedang diproses' },
    { value: 'published', label: 'Publik', description: 'Sudah dipublikasikan' },
];

const FormField = ({ label, required, error, children }) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {children}
        {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 mt-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
            </div>
        )}
    </div>
);

const CaseCreatePage = () => {
    const navigate = useNavigate();
    const createPerkara = useCreatePerkara();

    const [nomorPerkara, setNomorPerkara] = useState('');
    const [jenisPerkara, setJenisPerkara] = useState(CASE_TYPES[0]?.value ?? 'cerai_talak');
    const [status, setStatus] = useState(STATUS_OPTIONS[0].value);
    const [tanggalMasuk, setTanggalMasuk] = useState('');
    const [pengadilanAsal, setPengadilanAsal] = useState('');
    const [catatan, setCatatan] = useState('');
    const [nilaiGugatan, setNilaiGugatan] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (!nomorPerkara.trim()) {
            setError('Nomor perkara wajib diisi.');
            return;
        }

        createPerkara.mutate(
            {
                nomor_perkara: nomorPerkara,
                jenis_perkara: jenisPerkara,
                status,
                tanggal_masuk: tanggalMasuk || null,
                pengadilan_asal: pengadilanAsal || null,
                metadata: {
                    nilai_gugatan: nilaiGugatan || undefined,
                    catatan_internal: catatan || undefined,
                },
            },
            {
                onSuccess: () => navigate('/cases'),
                onError: (apiError) => {
                    const message =
                        apiError.response?.data?.message ||
                        apiError.response?.data?.errors?.nomor_perkara?.[0] ||
                        'Gagal menyimpan perkara, coba lagi.';
                    setError(message);
                },
            },
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 pb-12 pt-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        to="/cases"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Daftar
                    </Link>
                </div>

                {/* Main Card */}
                <div className="rounded-3xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-xl p-8 md:p-10">
                    {/* Title Section */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100 to-teal-100">
                                <FileText className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Tambah Perkara Baru</h1>
                                <p className="text-sm text-slate-600">Lengkapi informasi dasar perkara sebelum mengunggah dokumen</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Informasi Dasar */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-1 w-1 rounded-full bg-emerald-600" />
                                <h2 className="text-lg font-bold text-slate-900">Informasi Dasar</h2>
                            </div>
                            
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField label="Nomor Perkara" required>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                        value={nomorPerkara}
                                        onChange={(e) => setNomorPerkara(e.target.value.toUpperCase())}
                                        placeholder="123/Pdt.G/2025/PTA.JKT"
                                    />
                                </FormField>

                                <FormField label="Jenis Perkara" required>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                        value={jenisPerkara}
                                        onChange={(e) => setJenisPerkara(e.target.value)}
                                    >
                                        {CASE_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                        </div>

                        {/* Section 2: Jadwal & Lokasi */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-1 w-1 rounded-full bg-blue-600" />
                                <h2 className="text-lg font-bold text-slate-900">Jadwal & Lokasi</h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <FormField label="Status">
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            {STATUS_OPTIONS.map((item) => (
                                                <option key={item.value} value={item.value}>
                                                    {item.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        </div>
                                    </div>
                                </FormField>

                                <FormField label="Tanggal Masuk">
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="date"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={tanggalMasuk}
                                            onChange={(e) => setTanggalMasuk(e.target.value)}
                                        />
                                    </div>
                                </FormField>

                                <FormField label="Pengadilan Asal">
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={pengadilanAsal}
                                            onChange={(e) => setPengadilanAsal(e.target.value)}
                                            placeholder="PA Jakarta Selatan"
                                        />
                                    </div>
                                </FormField>
                            </div>
                        </div>

                        {/* Section 3: Informasi Tambahan */}
                        <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-1 w-1 rounded-full bg-amber-600" />
                                <h2 className="text-lg font-bold text-slate-900">Informasi Tambahan</h2>
                                <span className="text-xs font-medium text-slate-500">(Opsional)</span>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField label="Nilai Gugatan">
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={nilaiGugatan}
                                            onChange={(e) => setNilaiGugatan(e.target.value)}
                                            placeholder="150.000.000"
                                        />
                                    </div>
                                </FormField>

                                <FormField label="Catatan Internal">
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={catatan}
                                            onChange={(e) => setCatatan(e.target.value)}
                                            placeholder="Prioritas hakim, berkas belum lengkap"
                                        />
                                    </div>
                                </FormField>
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 animate-shake">
                                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                            <button
                                type="submit"
                                disabled={createPerkara.isPending}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 active:scale-95"
                            >
                                {createPerkara.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Simpan Perkara
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/cases')}
                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                            >
                                Batalkan
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default CaseCreatePage;