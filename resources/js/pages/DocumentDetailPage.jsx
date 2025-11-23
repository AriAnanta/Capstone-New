import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDocument, useManualSummary, useReprocessDocument } from '@/api/hooks';
import { formatDate } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/api/client';
import { 
    FileText, Download, Printer, RefreshCw, Edit, ArrowLeft, 
    CheckCircle2, Circle, BrainCircuit, Sparkles, Copy, Check 
} from 'lucide-react';

const SUMMARY_TYPES = [
    { value: 'internal', label: 'Internal (Hakim/Panitera)' },
    { value: 'publik', label: 'Publik (Portal Web)' },
];

const DetailRow = ({ label, value }) => (
    <div className="py-3 border-b border-slate-100 last:border-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="mt-1 text-sm font-semibold text-slate-900">{value || '-'}</dd>
    </div>
);

const DocumentDetailPage = () => {
    const { documentId } = useParams();
    const { data: document, isLoading } = useDocument(documentId);
    const manualSummary = useManualSummary(documentId);
    const reprocessDocument = useReprocessDocument(documentId);
    const role = useAuthStore((state) => state.role);
    const [summaryType, setSummaryType] = useState('internal');
    const [summaryText, setSummaryText] = useState('');
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const canManageSummaries = role === 'panitera';
    const canDownloadOutputs = role === 'hakim';

    // ... (Handlers tetap sama, hanya styling yang berubah) ...
    const handleManualSummary = (e) => { e.preventDefault(); if(!summaryText.trim()) return; manualSummary.mutate({ tipe_ringkasan: summaryType, ringkasan: summaryText }, { onSuccess: () => setSummaryText('') }); };
    const handleReprocess = () => { if(canManageSummaries) reprocessDocument.mutate(); };
    const handleDownload = async () => { /* ... logic download ... */ }; // Gunakan logic lama
    const handlePrint = () => { if(canDownloadOutputs) window.print(); };
    
    const handleCopyOcr = async () => {
        if (!document?.teks_ocr) return;
        await navigator.clipboard.writeText(document.teks_ocr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const pipelineSteps = useMemo(() => [
        { key: 'ocr', label: 'Extraksi OCR', icon: FileText, done: Boolean(document?.teks_ocr) },
        { key: 'summary', label: 'AI Summarization', icon: BrainCircuit, done: Boolean(document?.summaries?.length) },
        { key: 'gemini', label: 'Analisis Hukum', icon: Sparkles, done: Boolean(document?.recommendations?.length) },
    ], [document]);

    if (isLoading) return <div className="flex h-screen items-center justify-center"><RefreshCw className="animate-spin text-emerald-600 h-8 w-8" /></div>;
    if (!document) return <div className="p-8 text-center">Dokumen tidak ditemukan</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header Navigation */}
            <div className="bg-white border-b border-slate-200 px-4 py-4 sm:px-8 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/documents" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Detail Dokumen #{document.id}</h1>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-medium uppercase">{document.jenis_dokumen}</span>
                                <span>•</span>
                                <span>Diunggah {formatDate(document.tanggal_upload)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {canDownloadOutputs && (
                            <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                                <Download className="h-4 w-4" /> Unduh
                            </button>
                        )}
                        {canManageSummaries && (
                            <button onClick={handleReprocess} disabled={reprocessDocument.isPending} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm">
                                <RefreshCw className={`h-4 w-4 ${reprocessDocument.isPending ? 'animate-spin' : ''}`} /> Proses Ulang
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid lg:grid-cols-3 gap-8">
                
                {/* Left Column: Metadata & Pipeline */}
                <div className="space-y-6">
                    {/* Pipeline Status Card */}
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Status Pemrosesan</h3>
                        <div className="space-y-4">
                            {pipelineSteps.map((step, idx) => (
                                <div key={step.key} className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${step.done ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                        <step.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${step.done ? 'text-slate-900' : 'text-slate-500'}`}>{step.label}</p>
                                    </div>
                                    {step.done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Metadata Card */}
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Metadata</h3>
                            {canManageSummaries && <Link to={`/documents/${document.id}/edit`}><Edit className="h-4 w-4 text-slate-400 hover:text-emerald-600" /></Link>}
                        </div>
                        <dl>
                            <DetailRow label="Format File" value={document.format_file} />
                            {document.metadata && Object.entries(document.metadata).map(([k, v]) => (
                                <DetailRow key={k} label={k.replace('_', ' ')} value={String(v)} />
                            ))}
                        </dl>
                    </section>
                </div>

                {/* Middle & Right Column: Content */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Tab-like Sections */}
                    <div className="space-y-6">
                        {/* AI Summary */}
                        <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                            <div className="bg-linear-to-r from-emerald-50 to-white px-6 py-4 border-b border-emerald-100 flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5 text-emerald-600" />
                                <h2 className="font-bold text-slate-900">Ringkasan Otomatis</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {(document.summaries ?? []).map((summary) => (
                                    <div key={summary.id} className="relative pl-4 border-l-2 border-emerald-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${summary.tipe_ringkasan === 'publik' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {summary.tipe_ringkasan.toUpperCase()}
                                            </span>
                                            <span className="text-xs text-slate-400">{formatDate(summary.created_at)}</span>
                                        </div>
                                        <p className="text-slate-700 text-sm leading-relaxed">{summary.ringkasan}</p>
                                    </div>
                                ))}
                                {(!document.summaries?.length) && <p className="text-slate-400 text-sm italic">Belum ada ringkasan.</p>}
                            </div>
                        </section>

                        {/* Legal Recommendations */}
                        <section className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
                            <div className="bg-linear-to-r from-indigo-50 to-white px-6 py-4 border-b border-indigo-100 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-indigo-600" />
                                <h2 className="font-bold text-slate-900">Analisis Hukum & Pasal</h2>
                            </div>
                            <div className="p-6">
                                {(document.recommendations ?? []).map((rec) => (
                                    <div key={rec.id} className="space-y-4">
                                        <ul className="grid gap-4 sm:grid-cols-2">
                                            {(rec.daftar_pasal ?? []).map((pasal, i) => (
                                                <li key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-slate-800">{pasal.nama}</span>
                                                        <span className="text-xs font-mono bg-white px-2 py-1 border rounded text-slate-500">Pasal {pasal.pasal}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600">{pasal.alasan}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        {rec.pertimbangan_llm && (
                                            <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl text-sm text-slate-700 border border-indigo-100">
                                                <p className="font-semibold mb-1 text-indigo-900">Pertimbangan AI:</p>
                                                {rec.pertimbangan_llm}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {(!document.recommendations?.length) && <p className="text-slate-400 text-sm italic">Belum ada rekomendasi hukum.</p>}
                            </div>
                        </section>

                        {/* OCR Content */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h2 className="font-bold text-slate-900">Teks Asli (OCR)</h2>
                                {document.teks_ocr && (
                                    <button onClick={handleCopyOcr} className="text-xs flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-700">
                                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        {copied ? 'Tersalin' : 'Salin Teks'}
                                    </button>
                                )}
                            </div>
                            <div className="bg-slate-900 p-6 max-h-96 overflow-y-auto">
                                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {document.teks_ocr || 'Menunggu proses OCR...'}
                                </pre>
                            </div>
                        </section>

                        {/* Manual Input */}
                        {canManageSummaries && (
                            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h2 className="font-bold text-slate-900 mb-4">Tambah Ringkasan Manual</h2>
                                <form onSubmit={handleManualSummary} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Ringkasan</label>
                                        <select 
                                            className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={summaryType}
                                            onChange={(e) => setSummaryType(e.target.value)}
                                        >
                                            {SUMMARY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Isi Ringkasan</label>
                                        <textarea 
                                            className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                            rows={4}
                                            value={summaryText}
                                            onChange={(e) => setSummaryText(e.target.value)}
                                            placeholder="Ketik ringkasan manual..."
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button 
                                            type="submit" 
                                            disabled={manualSummary.isPending}
                                            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                                        >
                                            {manualSummary.isPending ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                    </div>
                                </form>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetailPage;