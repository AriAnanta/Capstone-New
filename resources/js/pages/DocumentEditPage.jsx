import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDocument, useUpdateDocument } from '@/api/hooks';
import { DOCUMENT_TYPES } from '@/constants';
import { 
    ArrowLeft, Save, AlertCircle, Loader2, FileText, Tag, 
    Hash, MessageSquare, Pencil, Eye, CheckCircle2, Info, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/format';

const DocumentEditPage = () => {
    const navigate = useNavigate();
    const { documentId } = useParams();
    const { data: document, isLoading } = useDocument(documentId);
    const updateDocument = useUpdateDocument();

    const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]?.value ?? 'putusan');
    const [tagsInput, setTagsInput] = useState('');
    const [nomorNaskah, setNomorNaskah] = useState('');
    const [catatanInternal, setCatatanInternal] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!document) return;
        setDocumentType(document.jenis_dokumen ?? DOCUMENT_TYPES[0]?.value ?? 'putusan');
        setTagsInput(document.tags?.map(t => t.name || t).join(', ') ?? '');
        setNomorNaskah(document.metadata?.nomor_naskah ?? '');
        setCatatanInternal(document.metadata?.catatan_internal ?? '');
    }, [document]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const tags = tagsInput
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

        updateDocument.mutate(
            {
                id: documentId,
                jenis_dokumen: documentType,
                metadata: {
                    nomor_naskah: nomorNaskah || undefined,
                    catatan_internal: catatanInternal || undefined,
                },
                tags,
            },
            {
                onSuccess: () => {
                    setSuccess('Dokumen berhasil diperbarui!');
                    setTimeout(() => navigate('/documents'), 1500);
                },
                onError: (apiError) => {
                    const message = apiError.response?.data?.message ?? 'Gagal memperbarui dokumen.';
                    setError(message);
                },
            },
        );
    };

    if (isLoading && !document) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Memuat detail dokumen...</p>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-slate-100 p-4 rounded-full inline-block mb-4">
                        <FileText className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium mb-4">Dokumen tidak ditemukan.</p>
                    <Button onClick={() => navigate('/documents')}>Kembali ke Daftar</Button>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed':
                return <Badge variant="success" className="text-xs">Selesai</Badge>;
            case 'processing':
                return <Badge variant="warning" className="text-xs">Diproses</Badge>;
            case 'failed':
                return <Badge variant="destructive" className="text-xs">Gagal</Badge>;
            default:
                return <Badge variant="secondary" className="text-xs">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-cyan-600 via-blue-600 to-indigo-600 p-6 shadow-2xl shadow-blue-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
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
                                    <Pencil className="h-3 w-3 mr-1.5" />
                                    Edit Dokumen
                                </Badge>
                                <h1 className="text-2xl font-bold text-white tracking-tight">
                                    {document.nama_file || `Dokumen #${document.id}`}
                                </h1>
                            </div>
                        </div>
                        <Button 
                            variant="outline"
                            onClick={() => navigate(`/documents/${document.id}`)}
                            className="gap-2 bg-white/90 hover:bg-white border-white/50 text-slate-700"
                        >
                            <Eye className="h-4 w-4" />
                            Lihat Detail
                        </Button>
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
                            {/* Jenis Dokumen */}
                            <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                                <CardHeader className="bg-linear-to-r from-slate-50 to-cyan-50/50 border-b border-slate-100 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-cyan-100 text-cyan-600">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900">Jenis Dokumen</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Pilih Jenis Dokumen</Label>
                                        <select
                                            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
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
                                </CardContent>
                            </Card>

                            {/* Metadata */}
                            <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                                <CardHeader className="bg-linear-to-r from-slate-50 to-purple-50/50 border-b border-slate-100 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                            <Tag className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900">Metadata Dokumen</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Tag</Label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    className="pl-9 text-sm h-9"
                                                    value={tagsInput}
                                                    onChange={(e) => setTagsInput(e.target.value)}
                                                    placeholder="prioritas, publik, urgent"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500">Pisahkan dengan koma</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-600">Nomor Naskah</Label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    className="pl-9 font-mono text-sm h-9"
                                                    value={nomorNaskah}
                                                    onChange={(e) => setNomorNaskah(e.target.value)}
                                                    placeholder="02/PTS-PTA/2025"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Catatan Internal */}
                            <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                                <CardHeader className="bg-linear-to-r from-slate-50 to-amber-50/50 border-b border-slate-100 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                                            <MessageSquare className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900">Catatan Internal</CardTitle>
                                        <Badge variant="secondary" className="text-xs">Opsional</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">Catatan untuk Tim Internal</Label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <textarea
                                                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-20 resize-y"
                                                value={catatanInternal}
                                                onChange={(e) => setCatatanInternal(e.target.value)}
                                                placeholder="Catatan tambahan untuk tim internal..."
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
                                <Button type="submit" isLoading={updateDocument.isPending} className="px-6 h-10 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25">
                                    <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                                </Button>
                                <Button type="button" variant="outline" onClick={() => navigate('/documents')} className="h-10">
                                    Batalkan
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Info Panel */}
                    <div className="space-y-6">
                        {/* Document Info */}
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-blue-50/50 border-b border-slate-100 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-base font-bold text-slate-900">Info Dokumen</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-xs font-medium text-slate-500 uppercase">ID</span>
                                    <span className="text-sm font-bold text-slate-900">#{document.id}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-xs font-medium text-slate-500 uppercase">Status OCR</span>
                                    {getStatusBadge(document.status_ocr)}
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-xs font-medium text-slate-500 uppercase">Status LLM</span>
                                    {getStatusBadge(document.status_llm)}
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-xs font-medium text-slate-500 uppercase">Dibuat</span>
                                    <span className="text-sm font-medium text-slate-700">{formatDate(document.created_at)}</span>
                                </div>
                                {document.perkara && (
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-xs font-medium text-slate-500 uppercase">Perkara</span>
                                        <span className="text-sm font-mono font-medium text-slate-700">{document.perkara.nomor_perkara}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Document Types Reference */}
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-cyan-50/50 border-b border-slate-100 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-cyan-100 text-cyan-600">
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
                                                    ? 'bg-blue-100 text-blue-700 border-blue-200' 
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
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Tips</h4>
                                    <ul className="text-xs text-blue-800 space-y-1 list-disc pl-3">
                                        <li>Tag membantu pencarian dokumen lebih mudah</li>
                                        <li>Catatan internal hanya untuk tim</li>
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

export default DocumentEditPage;