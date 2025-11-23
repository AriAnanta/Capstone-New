import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CASE_TYPES } from '@/constants';
import { usePerkara, useUpdatePerkara } from '@/api/hooks';
import { 
    ArrowLeft, Save, AlertCircle, Loader2, Pencil,
    Calendar, Building2, DollarSign, MessageSquare, X
} from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'Review' },
    { value: 'processed', label: 'Diproses' },
    { value: 'published', label: 'Publik' },
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

const CaseEditPage = () => {
    const navigate = useNavigate();
    const { caseId } = useParams();
    const { data: perkara, isLoading } = usePerkara(caseId);
    const updatePerkara = useUpdatePerkara();

    const [nomorPerkara, setNomorPerkara] = useState('');
    const [jenisPerkara, setJenisPerkara] = useState(CASE_TYPES[0]?.value ?? 'cerai_talak');
    const [status, setStatus] = useState(STATUS_OPTIONS[0].value);
    const [tanggalMasuk, setTanggalMasuk] = useState('');
    const [pengadilanAsal, setPengadilanAsal] = useState('');
    const [catatan, setCatatan] = useState('');
    const [nilaiGugatan, setNilaiGugatan] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!perkara) return;
        setNomorPerkara(perkara.nomor_perkara ?? '');
        setJenisPerkara(perkara.jenis_perkara ?? CASE_TYPES[0]?.value ?? 'cerai_talak');
        setStatus(perkara.status ?? STATUS_OPTIONS[0].value);
        setTanggalMasuk(perkara.tanggal_masuk ?? '');
        setPengadilanAsal(perkara.pengadilan_asal ?? '');
        setCatatan(perkara.metadata?.catatan_internal ?? '');
        setNilaiGugatan(perkara.metadata?.nilai_gugatan ?? '');
    }, [perkara]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (!nomorPerkara.trim()) {
            setError('Nomor perkara wajib diisi.');
            return;
        }

        updatePerkara.mutate(
            {
                id: caseId,
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
                        'Gagal memperbarui perkara.';
                    setError(message);
                },
            },
        );
    };

    if (isLoading && !perkara) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    <p className="text-slate-600 font-medium">Memuat data perkara...</p>
                </div>
            </div>
        );
    }

    if (!perkara) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-slate-600 mb-4">Perkara tidak ditemukan.</p>
                    <Link 
                        to="/cases" 
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Daftar
                    </Link>
                </div>
            </div>
        );
    }

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
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-100 to-cyan-100">
                                <Pencil className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Edit Perkara</h1>
                                <p className="text-sm text-slate-600">Nomor Perkara: <span className="font-mono font-semibold">{perkara.nomor_perkara}</span></p>
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
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                                        value={nomorPerkara}
                                        onChange={(e) => setNomorPerkara(e.target.value.toUpperCase())}
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
                                    </div>
                                </FormField>

                                <FormField label="Tanggal Masuk">
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="date"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={tanggalMasuk ?? ''}
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
                                disabled={updatePerkara.isPending}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 active:scale-95"
                            >
                                {updatePerkara.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Simpan Perubahan
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

export default CaseEditPage;