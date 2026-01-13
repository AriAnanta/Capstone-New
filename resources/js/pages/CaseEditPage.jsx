import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CASE_TYPES } from '@/constants';
import { usePerkara, useUpdatePerkara } from '@/api/hooks';
import { 
    ArrowLeft, Save, AlertCircle, Loader2, Calendar, 
    Building2, DollarSign, MessageSquare, Briefcase, Pencil, 
    Scale, CheckCircle2, Gavel, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { value: 'review', label: 'Review', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'processed', label: 'Diproses', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { value: 'published', label: 'Publik', color: 'bg-blue-100 text-blue-700 border-blue-200' },
];

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
    const [success, setSuccess] = useState('');

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
        setSuccess('');

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
                onSuccess: () => {
                    setSuccess('Perkara berhasil diperbarui!');
                    setTimeout(() => navigate('/cases'), 1500);
                },
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
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Memuat data perkara...</p>
                </div>
            </div>
        );
    }

    if (!perkara) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-slate-100 p-4 rounded-full inline-block mb-4">
                        <Gavel className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium mb-4">Perkara tidak ditemukan.</p>
                    <Button onClick={() => navigate('/cases')}>Kembali ke Daftar</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 pt-6 px-4 sm:px-8 pb-12">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600 p-8 shadow-2xl shadow-blue-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                    
                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-[10%] w-32 h-32 bg-white/10 rounded-full blur-3xl floating-slow" />
                    <div className="absolute bottom-4 left-1/4 w-24 h-24 bg-violet-300/20 rounded-full blur-2xl floating-delayed" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => navigate('/cases')}
                                className="shrink-0 bg-white/90 hover:bg-white border-white/50 backdrop-blur-sm shadow-lg h-10 w-10"
                            >
                                <ArrowLeft className="h-5 w-5 text-slate-700" />
                            </Button>
                            <div>
                                <Badge className="mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                    <Pencil className="h-3 w-3 mr-1.5" />
                                    Edit Perkara
                                </Badge>
                                <h1 className="text-2xl font-bold text-white tracking-tight">{perkara.nomor_perkara}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className={`${STATUS_OPTIONS.find(s => s.value === perkara.status)?.color || 'bg-slate-100 text-slate-700'} px-3 py-1.5`}>
                                {STATUS_OPTIONS.find(s => s.value === perkara.status)?.label || perkara.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        <p className="text-sm font-medium text-emerald-800">{success}</p>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informasi Dasar */}
                            <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                                <CardHeader className="bg-linear-to-r from-slate-50 to-emerald-50/50 border-b border-slate-100 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900">Informasi Dasar</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Nomor Perkara <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    className="pl-9 font-mono text-sm h-9"
                                                    value={nomorPerkara}
                                                    onChange={(e) => setNomorPerkara(e.target.value.toUpperCase())}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Jenis Perkara <span className="text-red-500">*</span></Label>
                                            <select
                                                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
                                                value={jenisPerkara}
                                                onChange={(e) => setJenisPerkara(e.target.value)}
                                            >
                                                {CASE_TYPES.map((type) => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Jadwal & Lokasi */}
                            <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                                <CardHeader className="bg-linear-to-r from-slate-50 to-blue-50/50 border-b border-slate-100 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900">Jadwal & Lokasi</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Status</Label>
                                            <select
                                                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
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
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Tanggal Masuk</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    type="date"
                                                    className="pl-9 text-sm h-9"
                                                    value={tanggalMasuk}
                                                    onChange={(e) => setTanggalMasuk(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Pengadilan Asal</Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    className="pl-9 text-sm h-9"
                                                    placeholder="PA Jakarta Selatan"
                                                    value={pengadilanAsal}
                                                    onChange={(e) => setPengadilanAsal(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Informasi Tambahan */}
                            <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                                <CardHeader className="bg-linear-to-r from-slate-50 to-amber-50/50 border-b border-slate-100 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                                            <MessageSquare className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900">Informasi Tambahan</CardTitle>
                                        <Badge variant="secondary" className="text-xs">Opsional</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Nilai Gugatan</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    className="pl-9 text-sm h-9"
                                                    placeholder="150.000.000"
                                                    value={nilaiGugatan}
                                                    onChange={(e) => setNilaiGugatan(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Catatan Internal</Label>
                                            <div className="relative">
                                                <MessageSquare className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    className="pl-9 text-sm h-9"
                                                    placeholder="Catatan untuk tim internal"
                                                    value={catatan}
                                                    onChange={(e) => setCatatan(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Error Alert */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-800 text-sm border border-red-100 animate-in slide-in-from-top-2">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <Button type="submit" isLoading={updatePerkara.isPending} className="px-6 h-10 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25">
                                    <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                                </Button>
                                <Button type="button" variant="outline" onClick={() => navigate('/cases')} className="h-10">
                                    Batalkan
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Info Panel */}
                    <div className="space-y-6">
                        {/* Quick Info */}
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-purple-50/50 border-b border-slate-100 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-base font-bold text-slate-900">Ringkasan</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-xs font-medium text-slate-500 uppercase">ID Perkara</span>
                                        <span className="text-sm font-bold text-slate-900">#{perkara.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-xs font-medium text-slate-500 uppercase">Dibuat</span>
                                        <span className="text-sm font-medium text-slate-700">{new Date(perkara.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-xs font-medium text-slate-500 uppercase">Dokumen</span>
                                        <Badge variant="secondary" className="text-xs">{perkara.documents?.length || 0} file</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tips */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Tips</h4>
                                    <ul className="text-xs text-blue-800 space-y-1 list-disc pl-3">
                                        <li>Gunakan format nomor perkara yang standar</li>
                                        <li>Status akan mempengaruhi tampilan di portal publik</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseEditPage;