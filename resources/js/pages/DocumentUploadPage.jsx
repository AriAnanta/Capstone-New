import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePerkaras, useUploadDocument } from '@/api/hooks';
import { DOCUMENT_TYPES, CASE_TYPES } from '@/constants';
import {
    ArrowLeft, Upload, AlertCircle, Loader2, CheckCircle2,
    FileText, Tag, FileCode, MessageSquare, Zap, Cloud, 
    Briefcase, Info, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';

const DocumentUploadPage = () => {
    const navigate = useNavigate();
    const { data: perkaras = [], isLoading: loadingCases } = usePerkaras({ per_page: 100 });
    const uploadDocument = useUploadDocument();

    const perkaraOptions = Array.isArray(perkaras) ? perkaras : perkaras?.data ?? [];
    const hasCases = perkaraOptions.length > 0;

    const [perkaraId, setPerkaraId] = useState('');
    const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]?.value ?? 'putusan');
    const [file, setFile] = useState(null);
    const [tagsInput, setTagsInput] = useState('');
    const [nomorNaskah, setNomorNaskah] = useState('');
    const [catatanInternal, setCatatanInternal] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const isPdfFile = (f) => f && f.type === 'application/pdf';

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const dropped = e.dataTransfer.files[0];
            if (!isPdfFile(dropped)) {
                setError('Hanya file PDF yang diizinkan.');
                setFile(null);
                return;
            }
            setError('');
            setFile(dropped);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            const picked = e.target.files[0];
            if (!isPdfFile(picked)) {
                setError('Hanya file PDF yang diizinkan.');
                setFile(null);
                return;
            }
            setError('');
            setFile(picked);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!perkaraId || !documentType || !file) {
            setError('Pilih perkara, jenis dokumen, dan file terlebih dahulu.');
            return;
        }

        const tags = tagsInput
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

        uploadDocument.mutate(
            {
                perkara_id: Number(perkaraId),
                jenis_dokumen: documentType,
                dokumen: file,
                metadata: {
                    nomor_naskah: nomorNaskah,
                    catatan_internal: catatanInternal,
                },
                tags,
            },
            {
                onSuccess: (document) => {
                    setSuccess('Dokumen berhasil diunggah! Pipeline OCR & LLM sedang berjalan...');
                    setPerkaraId('');
                    setDocumentType(DOCUMENT_TYPES[0]?.value ?? 'putusan');
                    setFile(null);
                    setTagsInput('');
                    setNomorNaskah('');
                    setCatatanInternal('');

                    setTimeout(() => {
                        if (document?.id) {
                            navigate(`/documents/${document.id}`);
                        } else {
                            navigate('/documents');
                        }
                    }, 1500);
                },
                onError: (apiError) => {
                    const message = apiError.response?.data?.message ?? 'Gagal mengunggah dokumen. Coba lagi.';
                    setError(message);
                },
            },
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-amber-50/30 to-orange-50/30 pt-6 px-4 sm:px-8 pb-12">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-500 via-orange-500 to-rose-500 p-8 shadow-2xl shadow-amber-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                    
                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-[10%] w-32 h-32 bg-white/10 rounded-full blur-3xl floating-slow" />
                    <div className="absolute bottom-4 left-1/4 w-24 h-24 bg-rose-300/20 rounded-full blur-2xl floating-delayed" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => navigate('/documents')}
                                className="shrink-0 bg-white/90 hover:bg-white border-white/50 backdrop-blur-sm shadow-lg h-10 w-10"
                            >
                                <ArrowLeft className="h-5 w-5 text-slate-700" />
                            </Button>
                            <div>
                                <Badge className="mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                    <Cloud className="h-3 w-3 mr-1.5" />
                                    Upload Dokumen
                                </Badge>
                                <h1 className="text-2xl font-bold text-white tracking-tight">Unggah Dokumen Perkara</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-200" />
                            <span className="text-amber-100 text-sm">Pipeline OCR + AI Aktif</span>
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
                            {/* Pilih Perkara & Jenis Dokumen */}
                            <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                                <CardHeader className="bg-linear-to-r from-slate-50 to-amber-50/50 border-b border-slate-100 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900">Perkara & Jenis Dokumen</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Perkara <span className="text-red-500">*</span></Label>
                                            <select
                                                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
                                                value={perkaraId}
                                                onChange={(e) => setPerkaraId(e.target.value)}
                                                disabled={loadingCases || !hasCases}
                                            >
                                                <option value="">{hasCases ? '-- Pilih perkara --' : 'Memuat...'}</option>
                                                {perkaraOptions.map((perkara) => {
                                                    const caseTypeLabel = CASE_TYPES.find(ct => ct.value === perkara.jenis_perkara)?.label || perkara.jenis_perkara;
                                                    return (
                                                        <option key={perkara.id} value={perkara.id}>
                                                            {perkara.nomor_perkara} - {caseTypeLabel}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            {!loadingCases && !hasCases && (
                                                <p className="text-xs text-amber-600 font-medium">
                                                    <Link to="/cases/new" className="underline">Buat perkara terlebih dahulu</Link>
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Jenis Dokumen <span className="text-red-500">*</span></Label>
                                            <select
                                                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
                                                value={documentType}
                                                onChange={(e) => setDocumentType(e.target.value)}
                                            >
                                                {DOCUMENT_TYPES.map((type) => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upload File */}
                            <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                                <CardHeader className="bg-linear-to-r from-slate-50 to-blue-50/50 border-b border-slate-100 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                            <Upload className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900">Upload File</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                                            dragActive
                                                ? 'border-amber-500 bg-amber-50'
                                                : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center justify-center text-center py-4">
                                            <div className="mb-3 p-3 rounded-full bg-slate-100">
                                                <Upload className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 mb-0.5">
                                                Seret file ke sini atau klik untuk memilih
                                            </p>
                                            <p className="text-xs text-slate-500">PDF hingga 50MB</p>
                                        </div>
                                    </div>

                                    {file && (
                                        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                            <FileText className="h-5 w-5 text-emerald-600 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-emerald-900 truncate text-sm">{file.name}</p>
                                                <p className="text-xs text-emerald-700">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFile(null)}
                                                className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs"
                                            >
                                                Ganti
                                            </button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Metadata Tambahan */}
                            <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                                <CardHeader className="bg-linear-to-r from-slate-50 to-purple-50/50 border-b border-slate-100 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                            <Tag className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900">Metadata Dokumen</CardTitle>
                                        <Badge variant="secondary" className="text-xs">Opsional</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Nomor Naskah</Label>
                                            <div className="relative">
                                                <FileCode className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    className="pl-9 text-sm h-9"
                                                    placeholder="02/PTS-PTA/2025"
                                                    value={nomorNaskah}
                                                    onChange={(e) => setNomorNaskah(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Tag</Label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    className="pl-9 text-sm h-9"
                                                    placeholder="prioritas, publik, urgent"
                                                    value={tagsInput}
                                                    onChange={(e) => setTagsInput(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500">Pisahkan dengan koma</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Catatan Internal</Label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <textarea
                                                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all min-h-20 resize-y"
                                                value={catatanInternal}
                                                onChange={(e) => setCatatanInternal(e.target.value)}
                                                placeholder="Catatan untuk tim internal..."
                                            />
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
                                <Button 
                                    type="submit" 
                                    isLoading={uploadDocument.isPending} 
                                    disabled={!file}
                                    className="px-6 h-10 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25"
                                >
                                    <Upload className="mr-2 h-4 w-4" /> Unggah & Buat Ringkasan
                                </Button>
                                <Button type="button" variant="outline" onClick={() => navigate('/documents')} className="h-10">
                                    Batalkan
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Info Panel */}
                    <div className="space-y-6">
                        {/* Pipeline Info */}
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-blue-50/50 border-b border-slate-100 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                        <Zap className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-base font-bold text-slate-900">Pipeline Otomatis</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3">
                                <div className="space-y-2">
                                    {[
                                        { label: 'OCR Extraction', desc: 'Ekstraksi teks dari PDF' },
                                        { label: 'AI Summarization', desc: 'Ringkasan otomatis' },
                                        { label: 'Legal Analysis', desc: 'Rekomendasi hukum' },
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{step.label}</p>
                                                <p className="text-xs text-slate-500">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Document Types Reference */}
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-emerald-50/50 border-b border-slate-100 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-base font-bold text-slate-900">Jenis Dokumen</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="flex flex-wrap gap-2">
                                    {DOCUMENT_TYPES.map((type) => (
                                        <Badge 
                                            key={type.value}
                                            variant="secondary" 
                                            className={`text-xs cursor-pointer transition-all ${
                                                documentType === type.value 
                                                    ? 'bg-amber-100 text-amber-700 border-amber-200' 
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                            onClick={() => setDocumentType(type.value)}
                                        >
                                            {type.label}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tips */}
                        <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-amber-900 text-sm mb-1">Tips Upload</h4>
                                    <ul className="text-xs text-amber-800 space-y-1 list-disc pl-3">
                                        <li>Gunakan file PDF dengan resolusi tinggi</li>
                                        <li>Pastikan teks dalam dokumen dapat dibaca</li>
                                        <li>Proses OCR akan berjalan otomatis</li>
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

export default DocumentUploadPage;
