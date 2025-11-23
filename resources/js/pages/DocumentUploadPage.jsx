import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePerkaras, useUploadDocument } from '@/api/hooks';
import { DOCUMENT_TYPES } from '@/constants';
import {
    ArrowLeft, Upload, AlertCircle, Loader2, CheckCircle2,
    FileText, Tag, FileCode, MessageSquare, Zap, Cloud
} from 'lucide-react';

const FormField = ({ label, required, error, children, hint }) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {children}
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
        {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 mt-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
            </div>
        )}
    </div>
);

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
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
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
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 pb-12 pt-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        to="/documents"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Dokumen
                    </Link>
                </div>

                {/* Main Card */}
                <div className="rounded-3xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-xl p-8 md:p-10">
                    {/* Title Section */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-amber-100 to-orange-100">
                                <Cloud className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Unggah Dokumen Perkara</h1>
                                <p className="text-sm text-slate-600">File akan diproses melalui pipeline OCR, ringkasan AI, dan rekomendasi hukum</p>
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3 animate-pulse-slow">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-emerald-800">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Pilih Perkara & Jenis */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-1 w-1 rounded-full bg-emerald-600" />
                                <h2 className="text-lg font-bold text-slate-900">Pilih Perkara & Jenis Dokumen</h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField label="Perkara" required error={!hasCases && !loadingCases ? 'Belum ada perkara' : ''}>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                        value={perkaraId}
                                        onChange={(e) => setPerkaraId(e.target.value)}
                                        disabled={loadingCases || !hasCases}
                                    >
                                        <option value="">{hasCases ? '-- Pilih perkara --' : 'Memuat...'}</option>
                                        {perkaraOptions.map((perkara) => (
                                            <option key={perkara.id} value={perkara.id}>
                                                {perkara.nomor_perkara}
                                            </option>
                                        ))}
                                    </select>
                                    {!loadingCases && !hasCases && (
                                        <p className="text-xs text-amber-600 font-medium">
                                            Buat perkara terlebih dahulu di halaman Tambah Perkara
                                        </p>
                                    )}
                                </FormField>

                                <FormField label="Jenis Dokumen" required>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                        value={documentType}
                                        onChange={(e) => setDocumentType(e.target.value)}
                                    >
                                        {DOCUMENT_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                        </div>

                        {/* Section 2: Upload File */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-1 w-1 rounded-full bg-blue-600" />
                                <h2 className="text-lg font-bold text-slate-900">Upload File</h2>
                            </div>

                            <FormField label="File Dokumen" required hint="Dukung format PDF dan gambar (JPG, PNG)">
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
                                        dragActive
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-slate-300 bg-slate-50/50 hover:border-slate-400'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        accept="application/pdf,image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />

                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="mb-4 p-4 rounded-full bg-slate-200">
                                            <Upload className="h-6 w-6 text-slate-600" />
                                        </div>
                                        <p className="text-lg font-semibold text-slate-900 mb-1">
                                            Seret file ke sini atau klik untuk memilih
                                        </p>
                                        <p className="text-sm text-slate-600">PDF atau gambar hingga 50MB</p>
                                    </div>
                                </div>

                                {file && (
                                    <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                        <FileText className="h-5 w-5 text-emerald-600 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-emerald-900 truncate">{file.name}</p>
                                            <p className="text-xs text-emerald-700">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFile(null)}
                                            className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                                        >
                                            Ganti
                                        </button>
                                    </div>
                                )}
                            </FormField>
                        </div>

                        {/* Section 3: Metadata Tambahan */}
                        <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-1 w-1 rounded-full bg-amber-600" />
                                <h2 className="text-lg font-bold text-slate-900">Metadata Dokumen</h2>
                                <span className="text-xs font-medium text-slate-500">(Opsional)</span>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField label="Nomor Naskah" hint="Contoh: 02/PTS-PTA/2025">
                                    <div className="relative">
                                        <FileCode className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={nomorNaskah}
                                            onChange={(e) => setNomorNaskah(e.target.value)}
                                            placeholder="Opsional"
                                        />
                                    </div>
                                </FormField>

                                <FormField label="Tag" hint="Pisahkan dengan koma, contoh: prioritas, publik">
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            value={tagsInput}
                                            onChange={(e) => setTagsInput(e.target.value)}
                                            placeholder="Tag1, Tag2, Tag3"
                                        />
                                    </div>
                                </FormField>
                            </div>

                            <FormField label="Catatan Internal" hint="Catatan untuk tim internal atau reviewer">
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <textarea
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                        rows={4}
                                        value={catatanInternal}
                                        onChange={(e) => setCatatanInternal(e.target.value)}
                                        placeholder="Masukkan catatan penting..."
                                    />
                                </div>
                            </FormField>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 animate-shake">
                                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Processing Info */}
                        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
                            <Zap className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Pipeline Otomatis</p>
                                <p>Dokumen akan diproses melalui: OCR → Ringkasan AI → Rekomendasi Hukum</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                            <button
                                type="submit"
                                disabled={uploadDocument.isPending || !file}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 active:scale-95"
                            >
                                {uploadDocument.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Mengunggah...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        Unggah & Jalankan Pipeline
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/documents')}
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
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default DocumentUploadPage;