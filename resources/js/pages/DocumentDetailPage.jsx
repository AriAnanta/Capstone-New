import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDocument, useManualSummary, useReprocessDocument } from '@/api/hooks';
import { formatDate } from '@/utils/format';

const SUMMARY_TYPES = [
    { value: 'internal', label: 'Internal' },
    { value: 'publik', label: 'Publik' },
];

const MetadataList = ({ metadata = {} }) => (
    <dl className="grid gap-4 sm:grid-cols-2">
        {Object.entries(metadata).map(([key, value]) => (
            <div key={key}>
                <dt className="text-xs uppercase tracking-wide text-slate-500">{key.replace('_', ' ')}</dt>
                <dd className="text-sm font-semibold text-slate-900">{String(value)}</dd>
            </div>
        ))}
    </dl>
);

const DocumentDetailPage = () => {
    const { documentId } = useParams();
    const { data: document, isLoading } = useDocument(documentId);
    const manualSummary = useManualSummary(documentId);
    const reprocessDocument = useReprocessDocument(documentId);
    const [summaryType, setSummaryType] = useState(SUMMARY_TYPES[0].value);
    const [summaryText, setSummaryText] = useState('');
    const [copied, setCopied] = useState(false);

    const handleManualSummary = (event) => {
        event.preventDefault();
        if (!summaryText.trim()) return;

        manualSummary.mutate(
            { tipe_ringkasan: summaryType, ringkasan: summaryText },
            {
                onSuccess: () => setSummaryText(''),
            },
        );
    };

    const handleReprocess = () => {
        reprocessDocument.mutate();
    };

    const pipelineSteps = useMemo(
        () => [
            { key: 'ocr', label: 'OCR selesai', done: Boolean(document?.teks_ocr) },
            { key: 'summary', label: 'Ringkasan dibuat', done: Boolean(document?.summaries?.length) },
            { key: 'gemini', label: 'Rekomendasi Gemini', done: Boolean(document?.recommendations?.length) },
        ],
        [document?.teks_ocr, document?.summaries, document?.recommendations],
    );

    const handleCopyOcr = async () => {
        if (!document?.teks_ocr) return;
        try {
            await navigator.clipboard.writeText(document.teks_ocr);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (copyError) {
            console.warn('Clipboard unsupported', copyError);
        }
    };

    if (isLoading) {
        return <p className="text-sm text-slate-600">Memuat detail dokumen...</p>;
    }

    if (!document) {
        return (
            <div className="space-y-3">
                <p className="text-sm text-slate-600">Dokumen tidak ditemukan.</p>
                <Link to="/documents" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                    Kembali ke daftar dokumen
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dokumen #{document.id}</h1>
                    <p className="text-sm text-slate-600">Diupload pada {formatDate(document.tanggal_upload)}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleReprocess}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        disabled={reprocessDocument.isPending}
                    >
                        {reprocessDocument.isPending ? 'Memproses ulang...' : 'Proses ulang OCR & LLM'}
                    </button>
                    <Link
                        to="/documents"
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Kembali
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                    <h2 className="text-base font-semibold text-slate-900">Ringkasan otomatis</h2>
                    <div className="mt-4 space-y-4">
                        {(document.summaries ?? []).map((summary) => (
                            <article key={summary.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span className="font-semibold uppercase">{summary.tipe_ringkasan}</span>
                                    <span>{formatDate(summary.created_at)}</span>
                                </div>
                                <p className="mt-2 text-sm text-slate-700">{summary.ringkasan}</p>
                            </article>
                        ))}
                        {(!document.summaries || document.summaries.length === 0) && (
                            <p className="text-sm text-slate-500">Belum ada ringkasan yang tersimpan.</p>
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900">Metadata dokumen</h2>
                    <div className="mt-4 space-y-4 text-sm text-slate-700">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Jenis dokumen</p>
                            <p className="font-semibold text-slate-900">{document.jenis_dokumen}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Format</p>
                            <p className="font-semibold text-slate-900">{document.format_file}</p>
                        </div>
                        {document.metadata && <MetadataList metadata={document.metadata} />}
                    </div>
                </section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Progres pipeline</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {pipelineSteps.map((step) => (
                        <div
                            key={step.key}
                            className={`rounded-xl border px-4 py-3 text-sm ${step.done ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}
                        >
                            <p className="text-xs uppercase tracking-wide">{step.label}</p>
                            <p className="font-semibold">{step.done ? 'Selesai' : 'Menunggu'}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-slate-900">Hasil OCR</h2>
                    {document.teks_ocr && (
                        <button
                            type="button"
                            onClick={handleCopyOcr}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            {copied ? 'Tersalin' : 'Salin teks'}
                        </button>
                    )}
                </div>
                <div className="mt-4 max-h-72 overflow-y-auto rounded-xl bg-slate-900/95 p-4 font-mono text-xs leading-5 text-slate-100">
                    {document.teks_ocr ? document.teks_ocr : 'Belum ada teks OCR. Jalankan proses ulang untuk memulai OCR.'}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Rekomendasi Gemini</h2>
                <div className="mt-4 space-y-4">
                    {(document.recommendations ?? []).length === 0 && (
                        <p className="text-sm text-slate-500">Belum ada rekomendasi hukum dari Gemini.</p>
                    )}
                    {(document.recommendations ?? []).map((recommendation) => (
                        <article key={recommendation.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Diperbarui {formatDate(recommendation.created_at)}</p>
                            <ul className="mt-3 space-y-2 text-sm text-slate-800">
                                {(recommendation.daftar_pasal ?? []).map((pasal, index) => (
                                    <li key={`${recommendation.id}-${index}`} className="rounded-lg bg-white/70 p-3 shadow-sm">
                                        <p className="font-semibold">{pasal.nama}</p>
                                        <p className="text-xs uppercase tracking-wide text-slate-500">Pasal {pasal.pasal}</p>
                                        <p className="mt-1 text-sm text-slate-700">{pasal.alasan}</p>
                                    </li>
                                ))}
                            </ul>
                            {recommendation.pertimbangan_llm && (
                                <p className="mt-3 text-sm text-slate-600">{recommendation.pertimbangan_llm}</p>
                            )}
                        </article>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-dashed border-indigo-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Tambah ringkasan manual</h2>
                <form className="mt-4 space-y-4" onSubmit={handleManualSummary}>
                    <label className="block text-sm">
                        Tipe ringkasan
                        <select
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={summaryType}
                            onChange={(event) => setSummaryType(event.target.value)}
                        >
                            {SUMMARY_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm">
                        Isi ringkasan
                        <textarea
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            rows={4}
                            value={summaryText}
                            onChange={(event) => setSummaryText(event.target.value)}
                            placeholder="Tuliskan ringkasan penting yang ingin dibagikan..."
                        />
                    </label>
                    <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        disabled={manualSummary.isPending}
                    >
                        {manualSummary.isPending ? 'Menyimpan...' : 'Simpan ringkasan'}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default DocumentDetailPage;
