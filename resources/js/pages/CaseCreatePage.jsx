import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CASE_TYPES } from '@/constants';
import { useCreatePerkara } from '@/api/hooks';
import { 
    ArrowLeft, Save, FileText, AlertCircle, Calendar, Building2, 
    DollarSign, MessageSquare, Briefcase, Gavel, Scale, Plus, 
    CheckCircle2, Info, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import clsx from 'clsx';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { value: 'review', label: 'Review', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'processed', label: 'Diproses', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { value: 'published', label: 'Publik', color: 'bg-blue-100 text-blue-700 border-blue-200' },
];

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
    const [success, setSuccess] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

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
                onSuccess: () => {
                    setSuccess('Perkara berhasil dibuat!');
                    setTimeout(() => navigate('/cases'), 1500);
                },
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 pt-6 px-4 sm:px-8 pb-12">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-2xl shadow-emerald-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                    
                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-[10%] w-32 h-32 bg-white/10 rounded-full blur-3xl floating-slow" />
                    <div className="absolute bottom-4 left-1/4 w-24 h-24 bg-cyan-300/20 rounded-full blur-2xl floating-delayed" />
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
                                    <Plus className="h-3 w-3 mr-1.5" />
                                    Perkara Baru
                                </Badge>
                                <h1 className="text-2xl font-bold text-white tracking-tight">Tambah Perkara</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-emerald-200" />
                            <span className="text-emerald-100 text-sm">Pengadilan Tinggi Agama Bandung</span>
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
                                <CardHeader className="bg-gradient-to-r from-slate-50 to-emerald-50/50 border-b border-slate-100 py-4">
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
                                                    placeholder="123/Pdt.G/2025/PTA.BDG"
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
                                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-100 py-4">
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
                                <CardHeader className="bg-gradient-to-r from-slate-50 to-amber-50/50 border-b border-slate-100 py-4">
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
                                <Button type="submit" isLoading={createPerkara.isPending} className="px-6 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25">
                                    <Save className="mr-2 h-4 w-4" /> Simpan Perkara
                                </Button>
                                <Button type="button" variant="outline" onClick={() => navigate('/cases')} className="h-10">
                                    Batalkan
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Info Panel */}
                    <div className="space-y-6">
                        {/* Jenis Perkara Reference */}
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50/50 border-b border-slate-100 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                        <Scale className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-base font-bold text-slate-900">Referensi</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Jenis Perkara Tersedia</p>
                                <div className="flex flex-wrap gap-2">
                                    {CASE_TYPES.map((type) => (
                                        <Badge 
                                            key={type.value}
                                            variant="secondary" 
                                            className={clsx(
                                                "text-xs cursor-pointer transition-all",
                                                jenisPerkara === type.value 
                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            )}
                                            onClick={() => setJenisPerkara(type.value)}
                                        >
                                            {type.label}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Reference */}
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-100 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-base font-bold text-slate-900">Status</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-2">
                                {STATUS_OPTIONS.map((item) => (
                                    <div 
                                        key={item.value}
                                        className={clsx(
                                            "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all",
                                            status === item.value ? "bg-slate-100 ring-1 ring-slate-200" : "hover:bg-slate-50"
                                        )}
                                        onClick={() => setStatus(item.value)}
                                    >
                                        <div className={`h-2.5 w-2.5 rounded-full ${item.color.replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
                                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Tips */}
                        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-emerald-900 text-sm mb-1">Tips</h4>
                                    <ul className="text-xs text-emerald-800 space-y-1 list-disc pl-3">
                                        <li>Format nomor: XXX/Pdt.G/YYYY/PTA.XXX</li>
                                        <li>Setelah disimpan, upload dokumen terkait</li>
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

export default CaseCreatePage;