import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useDocument, useManualSummary, useReprocessDocument } from '@/api/hooks';
import { formatDate } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/api/client';
import { 
    FileText, Download, Printer, RefreshCw, Edit, ArrowLeft, 
    CheckCircle2, Circle, BrainCircuit, Sparkles, Copy, Check, Activity,
    AlertTriangle, XCircle, Clock, Wifi, WifiOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import clsx from 'clsx';

const SUMMARY_TYPES = [
    { value: 'internal', label: 'Internal (Hakim/Panitera)' },
    { value: 'publik', label: 'Publik (Portal Web)' },
];

/**
 * Extract summary dari format JSON jika ada
 */
const extractSummaryText = (text) => {
    if (!text) return '';
    
    // Cek jika text dimulai dengan JSON marker tapi tidak complete
    if (typeof text === 'string' && text.startsWith('{"summary":"') && !text.includes('"}')) {
        // Kemungkinan JSON yang terpotong atau malformed
        console.warn('Detected malformed JSON in summary:', text.substring(0, 100));
        return 'Terjadi kesalahan dalam memproses ringkasan. Silakan coba proses ulang dokumen.';
    }
    
    // Cek apakah text adalah JSON
    try {
        const parsed = JSON.parse(text);
        if (parsed.summary) {
            return parsed.summary;
        }
        if (typeof parsed === 'string') {
            return parsed;
        }
    } catch (e) {
        // Jika parsing gagal dan text mengandung JSON markers, anggap sebagai error
        if (text.includes('{"') || text.includes('"}') || text.includes('"summary"')) {
            console.warn('Failed to parse JSON summary:', e.message);
            return 'Terjadi kesalahan dalam format ringkasan. Silakan coba proses ulang dokumen.';
        }
        // Bukan JSON, return text biasa
    }
    
    return text;
};

/**
 * Membersihkan format Markdown dan mengkonversi ke plain text yang rapi
 */
const cleanMarkdownText = (text) => {
    if (!text) return '';
    
    // Extract dari JSON jika ada
    const extractedText = extractSummaryText(text);
    
    return extractedText
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^\s*[\*\-\+]\s+/gm, '- ')
        .replace(/^>\s+/gm, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^[-*_]{3,}$/gm, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

const FormattedText = ({ text, className = '' }) => {
    const cleanedText = cleanMarkdownText(text);
    const paragraphs = cleanedText.split(/\n\n+/).filter(p => p.trim());
    
    return (
        <div className={`space-y-4 ${className}`}>
            {paragraphs.map((paragraph, index) => {
                const lines = paragraph.split('\n');
                const isAllList = lines.every(line => /^[-\d]+[.)\s]/.test(line.trim()) || !line.trim());
                
                if (isAllList && lines.length > 1) {
                    return (
                        <ul key={index} className="space-y-2 ml-4 list-disc marker:text-slate-400">
                            {lines.filter(l => l.trim()).map((line, i) => (
                                <li key={i} className="text-slate-700 text-sm leading-relaxed pl-1">
                                    {line.replace(/^[-\d]+[.)\s]+/, '').trim()}
                                </li>
                            ))}
                        </ul>
                    );
                }
                
                return (
                    <p key={index} className="text-slate-700 text-sm leading-relaxed whitespace-pre-line text-justify">
                        {paragraph}
                    </p>
                );
            })}
        </div>
    );
};

const DetailRow = ({ label, value }) => (
    <div className="py-3 border-b border-slate-100 last:border-0 flex justify-between items-center group hover:bg-slate-50/50 px-2 rounded-lg transition-colors -mx-2">
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="text-sm font-semibold text-slate-900 text-right max-w-[60%] truncate">{value || '-'}</dd>
    </div>
);

const SummaryContent = ({ text, summaryId, expanded, onToggle }) => {
    // Cek apakah text dalam format JSON dan extract
    let isJsonFormat = false;
    let confidence = null;
    try {
        const parsed = JSON.parse(text);
        if (parsed.summary) {
            isJsonFormat = true;
            confidence = parsed.confidence;
        }
    } catch (e) {
        // Bukan JSON
    }
    
    const cleanedText = cleanMarkdownText(text);
    const MAX_LENGTH = 400;
    const shouldTruncate = cleanedText.length > MAX_LENGTH;
    const displayText = (shouldTruncate && !expanded) ? cleanedText.slice(0, MAX_LENGTH) + '...' : cleanedText;
    
    return (
        <div className="space-y-3">
            {isJsonFormat && confidence !== null && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    <span className="font-medium">AI Generated • Confidence: {Math.round(confidence * 100)}%</span>
                </div>
            )}
            <FormattedText text={displayText} />
            {shouldTruncate && (
                <button
                    onClick={onToggle}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 mt-3 transition-colors"
                >
                    {expanded ? (
                        <>
                            <span>Tampilkan Lebih Sedikit</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>Lihat Selengkapnya</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </>
                    )}
                </button>
            )}
        </div>
    );
};



const DocumentDetailPage = () => {
    const { documentId } = useParams();
    const [searchParams] = useSearchParams();
    const pageRef = useRef(null);
    const { data: document, isLoading } = useDocument(documentId);
    const manualSummary = useManualSummary(documentId);
    const reprocessDocument = useReprocessDocument(documentId);
    const role = useAuthStore((state) => state.role);
    const [summaryType, setSummaryType] = useState('internal');
    const [summaryText, setSummaryText] = useState('');
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [highlightEffect, setHighlightEffect] = useState(false);
    const [expandedSummaries, setExpandedSummaries] = useState({});

    const canManageSummaries = role === 'panitera';
    const canDownloadOutputs = role === 'hakim';
    const fromSearch = searchParams.get('from') === 'search';
    
    useEffect(() => {
        if (fromSearch && document) {
            setHighlightEffect(true);
            setTimeout(() => setHighlightEffect(false), 3000);
            pageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [fromSearch, document]);

    const handleManualSummary = (e) => { 
        e.preventDefault(); 
        if(!summaryText.trim()) return; 
        manualSummary.mutate({ tipe_ringkasan: summaryType, ringkasan: summaryText }, { onSuccess: () => setSummaryText('') }); 
    };

    const handleReprocess = () => { if(canManageSummaries) reprocessDocument.mutate(); };
    
    const handleDownload = async () => {
        if (!canDownloadOutputs || !document?.id) return;
        try {
            setDownloading(true);
            const response = await apiClient.get(`/documents/${document.id}/download`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const anchor = window.document.createElement('a');
            anchor.href = downloadUrl;
            const fileExt = document.format_file?.includes('pdf') ? 'pdf' : 'bin';
            anchor.download = `dokumen-${document.id}.${fileExt}`;
            window.document.body.appendChild(anchor);
            anchor.click();
            window.document.body.removeChild(anchor);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Gagal mengunduh dokumen:', error);
            alert('Gagal mengunduh dokumen. Silakan coba lagi.');
        } finally {
            setDownloading(false);
        }
    };
    
    const handleCopyOcr = async () => {
        if (!document?.teks_ocr) return;
        await navigator.clipboard.writeText(document.teks_ocr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const pipelineSteps = useMemo(() => {
        if (!document) return [];
        
        // Check if processing has been stuck for too long
        const uploadTime = new Date(document.tanggal_upload || document.created_at);
        const now = new Date();
        const timeDiff = (now - uploadTime) / (1000 * 60); // in minutes
        const isStale = timeDiff > 15; // Consider stale if more than 15 minutes
        
        return [
            { 
                key: 'ocr', 
                label: 'Extraksi OCR', 
                icon: FileText, 
                done: Boolean(document?.teks_ocr),
                error: isStale && !document?.teks_ocr,
                processing: !document?.teks_ocr && !isStale
            },
            { 
                key: 'summary', 
                label: 'AI Summarization', 
                icon: BrainCircuit, 
                done: Boolean(document?.summaries?.length),
                error: isStale && document?.teks_ocr && !document?.summaries?.length,
                processing: document?.teks_ocr && !document?.summaries?.length && !isStale
            },
            { 
                key: 'gemini', 
                label: 'Analisis Hukum', 
                icon: Sparkles, 
                done: Boolean(document?.recommendations?.length),
                error: isStale && document?.summaries?.length && !document?.recommendations?.length,
                processing: document?.summaries?.length && !document?.recommendations?.length && !isStale
            },
        ];
    }, [document]);

    if (isLoading) return (
        <div className="flex bg-slate-50 min-h-screen items-center justify-center">
            <RefreshCw className="animate-spin text-emerald-600 h-8 w-8" />
        </div>
    );
    
    if (!document) return <div className="p-8 text-center">Dokumen tidak ditemukan</div>;

    return (
        <div ref={pageRef} className="min-h-screen bg-liear-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
            <div className={clsx("space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", highlightEffect && "ring-4 ring-yellow-400/50 rounded-xl transition-all duration-500")}>
                {/* Highlight banner when coming from search */}
                {fromSearch && (
                    <div className={clsx(
                        "bg-linear-to-r from-yellow-400 via-amber-400 to-orange-400 text-white px-6 py-3 text-center font-bold rounded-xl shadow-xl shadow-yellow-500/20 transition-all duration-500",
                        highlightEffect ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 hidden'
                    )}>
                        ✨ Dokumen ditemukan dari hasil pencarian
                    </div>
                )}

                {/* Header Navigation */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-2xl shadow-blue-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => window.history.back()} className="shrink-0 bg-white/90 hover:bg-white border-white/50 backdrop-blur-sm shadow-lg">
                                <ArrowLeft className="h-5 w-5 text-slate-700" />
                            </Button>
                            <div>
                                <Badge className="mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                    <FileText className="h-3 w-3 mr-1.5" />
                                    {document.jenis_dokumen.toUpperCase()}
                                </Badge>
                                <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Detail Dokumen #{document.id}</h1>
                                <p className="text-blue-50 text-sm">Diunggah {formatDate(document.tanggal_upload)}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {canDownloadOutputs && (
                                <Button variant="outline" onClick={handleDownload} disabled={downloading} className="bg-white/90 hover:bg-white border-white/50 text-slate-700 shadow-lg backdrop-blur-sm">
                                    <Download className="mr-2 h-4 w-4" /> Unduh
                                </Button>
                            )}
                            {canManageSummaries && (
                                <Button onClick={handleReprocess} disabled={reprocessDocument.isPending} className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl shadow-black/10 border-0 font-semibold">
                                    <RefreshCw className={clsx("mr-2 h-4 w-4", reprocessDocument.isPending && "animate-spin")} /> 
                                    Proses Ulang
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Metadata & Pipeline */}
                <div className="space-y-6">
                    {/* Pipeline Status Card */}
                    <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                        <CardHeader className="bg-linear-to-r from-slate-50 to-blue-50/50 border-b border-slate-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-base font-bold text-slate-900">Status Pemrosesan</CardTitle>
                                </div>
                                {(!document.teks_ocr || !document.summaries?.length || !document.recommendations?.length) && (
                                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                                        {pipelineSteps.some(step => step.error) ? (
                                            <div className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                                <WifiOff className="h-3.5 w-3.5" />
                                                <span>KONEKSI BERMASALAH</span>
                                            </div>
                                        ) : (
                                            <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full animate-pulse shadow-lg shadow-blue-200/50">
                                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                                <span>AUTO-REFRESH (3s)</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            {pipelineSteps.map((step) => (
                                <div key={step.key} className="flex items-center gap-3 group">
                                    <div className={clsx(
                                        "flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300",
                                        step.done 
                                            ? "bg-emerald-100 border-emerald-200 text-emerald-600" 
                                            : step.error
                                            ? "bg-red-100 border-red-200 text-red-600"
                                            : step.processing
                                            ? "bg-blue-100 border-blue-200 text-blue-600"
                                            : "bg-slate-50 border-slate-200 text-slate-300"
                                    )}>
                                        {step.error ? (
                                            <AlertTriangle className="h-4 w-4" />
                                        ) : step.processing ? (
                                            <Clock className="h-4 w-4 animate-pulse" />
                                        ) : (
                                            <step.icon className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={clsx(
                                            "text-sm font-medium transition-colors", 
                                            step.done ? "text-slate-900" : 
                                            step.error ? "text-red-700" :
                                            step.processing ? "text-blue-700" :
                                            "text-slate-400"
                                        )}>
                                            {step.label}
                                        </p>
                                        {step.error && (
                                            <p className="text-xs text-red-600 mt-0.5">Gagal - Periksa koneksi atau coba proses ulang</p>
                                        )}
                                        {step.processing && (
                                            <p className="text-xs text-blue-600 mt-0.5">Sedang diproses...</p>
                                        )}
                                        {!step.done && !step.error && !step.processing && (
                                            <p className="text-xs text-slate-400 mt-0.5">Menunggu...</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {step.done ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        ) : step.error ? (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        ) : step.processing ? (
                                            <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-slate-200" />
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {/* Show retry button if there are errors and user can manage summaries */}
                            {pipelineSteps.some(step => step.error) && canManageSummaries && (
                                <div className="pt-4 border-t border-slate-100">
                                    <Button 
                                        onClick={handleReprocess} 
                                        disabled={reprocessDocument.isPending}
                                        size="sm"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        <RefreshCw className={clsx("mr-2 h-4 w-4", reprocessDocument.isPending && "animate-spin")} />
                                        Coba Proses Ulang
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Metadata Card */}
                    <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                        <CardHeader className="bg-linear-to-r from-slate-50 to-purple-50/50 border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base font-bold text-slate-900">Metadata</CardTitle>
                            </div>
                            {canManageSummaries && (
                                <Button variant="ghost" size="icon" onClick={() => window.location.href=`/documents/${document.id}/edit`} className="h-8 w-8 hover:bg-purple-50">
                                    <Edit className="h-4 w-4 text-slate-400 hover:text-purple-600 transition-colors" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="p-6">
                            <dl className="divide-y divide-slate-100">
                                <DetailRow label="Format File" value={document.format_file} />
                                {document.metadata && Object.entries(document.metadata).map(([k, v]) => (
                                    <DetailRow key={k} label={k.replace('_', ' ')} value={String(v)} />
                                ))}
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle & Right Column: Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Summary */}
                    <Card className="overflow-hidden border-emerald-100 shadow-xl shadow-emerald-500/10 bg-white">
                        <div className="bg-linear-to-r from-emerald-50 to-teal-50/50 px-6 py-5 border-b border-emerald-100 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                <BrainCircuit className="h-5 w-5" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Ringkasan Otomatis</h2>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            {(document.summaries ?? []).map((summary) => (
                                <div key={summary.id} className="relative pl-6 border-l-2 border-emerald-200">
                                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-100 border-2 border-emerald-400" />
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge variant={summary.tipe_ringkasan === 'publik' ? 'info' : 'secondary'} className="uppercase text-[10px]">
                                            {summary.tipe_ringkasan}
                                        </Badge>
                                        <span className="text-xs text-slate-400 font-medium">{formatDate(summary.created_at)}</span>
                                    </div>
                                    <SummaryContent 
                                        text={summary.ringkasan}
                                        summaryId={summary.id}
                                        expanded={expandedSummaries[summary.id]}
                                        onToggle={() => setExpandedSummaries(prev => ({ ...prev, [summary.id]: !prev[summary.id] }))}
                                    />
                                </div>
                            ))}
                            {(!document.summaries?.length) && (
                                <div className="text-center py-8 rounded-xl border border-dashed">
                                    {pipelineSteps.find(s => s.key === 'summary')?.error ? (
                                        <div className="text-red-500 bg-red-50 border-red-200">
                                            <AlertTriangle className="h-8 w-8 mx-auto text-red-400 mb-2" />
                                            <p className="text-sm font-medium mb-1">Gagal Membuat Ringkasan</p>
                                            <p className="text-xs text-red-600">Sistem mengalami masalah koneksi ke AI service. Silakan coba proses ulang.</p>
                                            {canManageSummaries && (
                                                <Button 
                                                    onClick={handleReprocess} 
                                                    disabled={reprocessDocument.isPending}
                                                    size="sm"
                                                    className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    <RefreshCw className={clsx("mr-2 h-4 w-4", reprocessDocument.isPending && "animate-spin")} />
                                                    Coba Lagi
                                                </Button>
                                            )}
                                        </div>
                                    ) : pipelineSteps.find(s => s.key === 'summary')?.processing ? (
                                        <div className="text-blue-500 bg-blue-50 border-blue-200">
                                            <RefreshCw className="h-8 w-8 mx-auto text-blue-400 mb-2 animate-spin" />
                                            <p className="text-sm font-medium">Sedang Membuat Ringkasan...</p>
                                            <p className="text-xs text-blue-600">AI sedang menganalisis dokumen. Mohon tunggu sebentar.</p>
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 bg-slate-50 border-slate-200">
                                            <BrainCircuit className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                            <p className="text-sm">Belum ada ringkasan yang dihasilkan.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Legal Recommendations */}
                    <Card className="overflow-hidden border-indigo-100 shadow-xl shadow-indigo-500/10 bg-white">
                        <div className="bg-linear-to-r from-indigo-50 to-purple-50/50 px-6 py-5 border-b border-indigo-100 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Analisis Hukum & Pasal</h2>
                        </div>
                        <CardContent className="p-6">
                            {(document.recommendations ?? []).map((rec) => (
                                <div key={rec.id} className="space-y-6">
                                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
                                        {(rec.daftar_pasal ?? []).map((pasal, i) => (
                                            <div key={i} className="bg-linear-to-br from-white to-indigo-50/30 rounded-xl p-5 border border-indigo-100/60 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
                                                {/* Header dengan Badge */}
                                                <div className="mb-4 pb-3 border-b border-indigo-100/50 space-y-2">
                                                    <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-700 transition-colors wrap-break-word">
                                                        {pasal.nama}
                                                    </h3>
                                                    <Badge variant="outline" className="font-mono text-xs bg-indigo-50/80 border-indigo-200 text-indigo-700 px-2.5 py-1 inline-block">
                                                        {pasal.pasal ? `Pasal ${pasal.pasal}` : 'Tidak disebutkan'}
                                                    </Badge>
                                                </div>
                                                
                                                {/* Alasan/Deskripsi */}
                                                <div className="space-y-2">
                                                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                                                        {pasal.alasan}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Pertimbangan AI */}
                                    {rec.pertimbangan_llm && (
                                        <div className="mt-6 p-6 bg-linear-to-br from-indigo-50 to-purple-50/50 rounded-xl border border-indigo-200/60 shadow-sm">
                                            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-indigo-200/50">
                                                <div className="p-1.5 rounded-lg bg-indigo-100">
                                                    <Sparkles className="h-4 w-4 text-indigo-600" />
                                                </div>
                                                <span className="text-sm font-bold text-indigo-900">Pertimbangan AI</span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed text-justify">
                                                {rec.pertimbangan_llm}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(!document.recommendations?.length) && (
                                <div className="text-center py-8 rounded-xl border border-dashed">
                                    {pipelineSteps.find(s => s.key === 'gemini')?.error ? (
                                        <div className="text-red-500 bg-red-50 border-red-200">
                                            <AlertTriangle className="h-8 w-8 mx-auto text-red-400 mb-2" />
                                            <p className="text-sm font-medium mb-1">Gagal Menganalisis Hukum</p>
                                            <p className="text-xs text-red-600">Sistem mengalami timeout atau masalah koneksi ke Gemini AI. Silakan coba proses ulang.</p>
                                            {canManageSummaries && (
                                                <Button 
                                                    onClick={handleReprocess} 
                                                    disabled={reprocessDocument.isPending}
                                                    size="sm"
                                                    className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    <RefreshCw className={clsx("mr-2 h-4 w-4", reprocessDocument.isPending && "animate-spin")} />
                                                    Coba Lagi
                                                </Button>
                                            )}
                                        </div>
                                    ) : pipelineSteps.find(s => s.key === 'gemini')?.processing ? (
                                        <div className="text-blue-500 bg-blue-50 border-blue-200">
                                            <RefreshCw className="h-8 w-8 mx-auto text-blue-400 mb-2 animate-spin" />
                                            <p className="text-sm font-medium">Sedang Menganalisis Hukum...</p>
                                            <p className="text-xs text-blue-600">AI sedang mencari pasal dan peraturan yang relevan. Mohon tunggu sebentar.</p>
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 bg-slate-50 border-slate-200">
                                            <Sparkles className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                            <p className="text-sm">Belum ada rekomendasi hukum yang dihasilkan.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* OCR Content */}
                    <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between bg-linear-to-r from-slate-50 to-slate-100/50 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base font-bold text-slate-900">Teks Asli (OCR)</CardTitle>
                            </div>
                            {document.teks_ocr && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleCopyOcr}
                                    className={clsx("h-8 text-xs gap-1.5", copied && "text-emerald-600")}
                                >
                                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    {copied ? 'Tersalin' : 'Salin Text'}
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="bg-slate-900 p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {document.teks_ocr || 'Menunggu proses OCR...'}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Manual Input */}
                    {canManageSummaries && (
                        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                            <CardHeader className="bg-linear-to-r from-slate-50 to-emerald-50/50 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                        <Edit className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-base font-bold text-slate-900">Tambah Ringkasan Manual</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleManualSummary} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Tipe Ringkasan</label>
                                        <select 
                                            className="w-full rounded-lg border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={summaryType}
                                            onChange={(e) => setSummaryType(e.target.value)}
                                        >
                                            {SUMMARY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Isi Ringkasan</label>
                                        <textarea 
                                            className="w-full rounded-lg border-slate-200 text-sm p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[120px]"
                                            value={summaryText}
                                            onChange={(e) => setSummaryText(e.target.value)}
                                            placeholder="Ketik ringkasan manual di sini..."
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button 
                                            type="submit" 
                                            isLoading={manualSummary.isPending}
                                        >
                                            Simpan Ringkasan
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

export default DocumentDetailPage;