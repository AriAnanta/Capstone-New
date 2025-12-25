import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { FileText, Upload, Copy, Check, RefreshCw, Download, Trash2, Search, X, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/format';

const OcrOnlyPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(false);
    const [kategori, setKategori] = useState('umum');
    const [keterangan, setKeterangan] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [expandedOcrIds, setExpandedOcrIds] = useState(new Set());
    const [highlightId, setHighlightId] = useState(null);

    // Fetch OCR documents dengan auto-refresh
    const { data, isLoading, error } = useQuery({
        queryKey: ['ocr-documents', searchTerm],
        queryFn: async () => {
            const params = searchTerm ? { search: searchTerm } : {};
            const response = await apiClient.get('/ocr-only', { params });
            return response.data;
        },
        staleTime: 0, // Data selalu dianggap stale untuk refresh otomatis
        refetchOnMount: true, // Selalu fetch saat component mount
        refetchOnWindowFocus: true, // Refetch saat window focus
        refetchInterval: (data) => {
            // Auto-refresh setiap 3 detik jika ada dokumen yang sedang processing
            const hasProcessing = data?.data?.some(doc => 
                doc.status_ocr === 'pending' || doc.status_ocr === 'processing'
            );
            return hasProcessing ? 3000 : false;
        },
    });

    // Handle URL hash untuk highlight dokumen
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#doc-')) {
            const docId = parseInt(hash.replace('#doc-', ''));
            setHighlightId(docId);
            
            // Scroll ke dokumen setelah render
            setTimeout(() => {
                const element = document.getElementById(`doc-${docId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
            
            // Hapus highlight setelah 3 detik
            setTimeout(() => {
                setHighlightId(null);
                window.history.replaceState(null, '', window.location.pathname);
            }, 3000);
        }
    }, [data]);

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await apiClient.post('/ocr-only', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['ocr-documents']);
            setSelectedFile(null);
            setKeterangan('');
            setUploadProgress(false);
            alert('Dokumen berhasil diunggah! Proses OCR sedang berjalan...');
        },
        onError: (error) => {
            setUploadProgress(false);
            alert('Gagal mengunggah dokumen: ' + (error.response?.data?.message || error.message));
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await apiClient.delete(`/ocr-only/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['ocr-documents']);
            alert('Dokumen berhasil dihapus');
        },
    });

    // Reprocess mutation
    const reprocessMutation = useMutation({
        mutationFn: async (id) => {
            await apiClient.post(`/ocr-only/${id}/reprocess`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['ocr-documents']);
            alert('Proses OCR ulang telah dimulai');
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploadProgress(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('kategori', kategori);
        if (keterangan.trim()) {
            formData.append('keterangan', keterangan);
        }

        uploadMutation.mutate(formData);
    };

    const handleCopyOcr = async (text, id) => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleExpandOcr = (id) => {
        setExpandedOcrIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleDownload = async (id, filename) => {
        try {
            const response = await apiClient.get(`/ocr-only/${id}/download`, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { 
                type: response.headers['content-type'] 
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Gagal mengunduh dokumen');
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-amber-50/30 to-orange-50/30">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-500 via-orange-500 to-red-500 p-8 shadow-2xl shadow-amber-500/20 mx-4 sm:mx-8 mt-4 mb-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                <div className="relative">
                    <div className="mb-3 inline-block px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm text-xs font-semibold uppercase tracking-wide">
                        <FileText className="inline h-3 w-3 mr-1.5 -mt-0.5" />
                        OCR Processing
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">OCR Dokumen</h1>
                    <p className="text-amber-50 text-lg">Upload dokumen untuk ekstraksi teks otomatis tanpa perkara</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Upload Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Upload className="h-5 w-5 text-blue-600" />
                                Upload Dokumen
                            </h2>
                            
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Kategori Dokumen
                                    </label>
                                    <select
                                        value={kategori}
                                        onChange={(e) => setKategori(e.target.value)}
                                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm"
                                    >
                                        <option value="umum">Umum</option>
                                        <option value="surat">Surat</option>
                                        <option value="formulir">Formulir</option>
                                        <option value="ktp">KTP/Identitas</option>
                                        <option value="akta">Akta</option>
                                        <option value="sertifikat">Sertifikat</option>
                                        <option value="kontrak">Kontrak/Perjanjian</option>
                                        <option value="nota">Nota/Kwitansi</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Keterangan (Opsional)
                                    </label>
                                    <textarea
                                        value={keterangan}
                                        onChange={(e) => setKeterangan(e.target.value)}
                                        placeholder="Catatan tambahan tentang dokumen..."
                                        rows={2}
                                        maxLength={500}
                                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm resize-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {keterangan.length}/500 karakter
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        File Dokumen
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Format: PDF, JPG, PNG (Max 10MB)
                                    </p>
                                </div>

                                {selectedFile && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-gray-700 font-medium">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!selectedFile || uploadProgress}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
                                        !selectedFile || uploadProgress
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
                                    }`}
                                >
                                    {uploadProgress ? (
                                        <>
                                            <RefreshCw className="h-5 w-5 animate-spin" />
                                            Mengunggah...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-5 w-5" />
                                            Upload & Proses OCR
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Documents List */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Search */}
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 p-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari berdasarkan nama file atau teks OCR..."
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="space-y-4">
                            {isLoading && (
                                <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 text-center">
                                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                                    <p className="text-gray-600">Memuat dokumen...</p>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                                    <p className="text-red-600 font-medium">Gagal memuat dokumen</p>
                                </div>
                            )}

                            {!isLoading && !error && data?.data?.length === 0 && (
                                <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 text-center">
                                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">Belum ada dokumen OCR</p>
                                    <p className="text-sm text-gray-400 mt-1">Upload dokumen untuk memulai</p>
                                </div>
                            )}

                            {data?.data?.map((doc) => (
                                <div 
                                    key={doc.id} 
                                    id={`doc-${doc.id}`}
                                    className={`bg-white rounded-2xl shadow-xl border-2 overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                                        highlightId === doc.id 
                                            ? 'border-yellow-400 bg-yellow-50 ring-4 ring-yellow-200 animate-in fade-in' 
                                            : 'border-blue-200'
                                    }`}
                                >
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                    {doc.nama_file}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 text-sm">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium capitalize">
                                                        {doc.kategori}
                                                    </span>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                                                        {doc.format_file?.toUpperCase()}
                                                    </span>
                                                    
                                                    {/* Status OCR Badge */}
                                                    {doc.status_ocr === 'pending' && (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                                                            <Clock className="h-3 w-3" />
                                                            Menunggu
                                                        </span>
                                                    )}
                                                    {doc.status_ocr === 'processing' && (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium animate-pulse">
                                                            <RefreshCw className="h-3 w-3 animate-spin" />
                                                            Memproses...
                                                        </span>
                                                    )}
                                                    {doc.status_ocr === 'completed' && (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Selesai
                                                        </span>
                                                    )}
                                                    {doc.status_ocr === 'failed' && (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                                                            <XCircle className="h-3 w-3" />
                                                            Gagal
                                                        </span>
                                                    )}
                                                    
                                                    <span className="text-gray-500">
                                                        {formatDate(doc.tanggal_upload)}
                                                    </span>
                                                </div>
                                                {doc.keterangan && (
                                                    <p className="text-sm text-gray-600 mt-2 italic">
                                                        "{doc.keterangan}"
                                                    </p>
                                                )}
                                                {doc.error_message && (
                                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                                                        <p className="text-xs text-red-600 flex items-start gap-1">
                                                            <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                                                            <span>{doc.error_message}</span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* OCR Result */}
                                        {doc.status_ocr === 'completed' && doc.teks_ocr ? (
                                            <div className="mb-4 bg-linear-to-br from-slate-900 to-slate-800 rounded-xl p-4 border-2 border-slate-700">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                                        Hasil OCR ({doc.teks_ocr.length} karakter)
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {doc.teks_ocr.length > 500 && (
                                                            <button
                                                                onClick={() => toggleExpandOcr(doc.id)}
                                                                className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-all"
                                                            >
                                                                {expandedOcrIds.has(doc.id) ? 'Sembunyikan' : 'Lihat Semua'}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleCopyOcr(doc.teks_ocr, doc.id)}
                                                            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-all"
                                                        >
                                                            {copiedId === doc.id ? (
                                                                <>
                                                                    <Check className="h-3 w-3" />
                                                                    Tersalin
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="h-3 w-3" />
                                                                    Salin
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className={`overflow-y-auto ${expandedOcrIds.has(doc.id) ? 'max-h-96' : 'max-h-48'}`}>
                                                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                                                        {expandedOcrIds.has(doc.id) 
                                                            ? doc.teks_ocr 
                                                            : (doc.teks_ocr.length > 500 
                                                                ? doc.teks_ocr.substring(0, 500) + '...' 
                                                                : doc.teks_ocr)
                                                        }
                                                    </pre>
                                                </div>
                                                {expandedOcrIds.has(doc.id) && doc.teks_ocr.length > 500 && (
                                                    <div className="mt-3 pt-3 border-t border-slate-700">
                                                        <button
                                                            onClick={() => toggleExpandOcr(doc.id)}
                                                            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                                                        >
                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                            </svg>
                                                            Sembunyikan
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : doc.status_ocr === 'pending' || doc.status_ocr === 'processing' ? (
                                            <div className="mb-4 p-4 bg-linear-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <RefreshCw className="h-5 w-5 animate-spin text-yellow-600 shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-yellow-800">
                                                            {doc.status_ocr === 'pending' ? 'Menunggu antrian...' : 'Sedang memproses OCR...'}
                                                        </p>
                                                        <p className="text-xs text-yellow-600 mt-1">
                                                            Halaman akan otomatis diperbarui setiap 3 detik
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : doc.status_ocr === 'failed' ? (
                                            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                                                <div className="flex items-start gap-3">
                                                    <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-red-800">Proses OCR gagal</p>
                                                        <p className="text-xs text-red-600 mt-1">
                                                            Klik tombol "Proses Ulang" untuk mencoba lagi
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleDownload(doc.id, doc.nama_file)}
                                                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-xl font-medium text-sm"
                                            >
                                                <Download className="h-4 w-4" />
                                                Download
                                            </button>
                                            
                                            <button
                                                onClick={() => reprocessMutation.mutate(doc.id)}
                                                disabled={reprocessMutation.isPending}
                                                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all shadow-md hover:shadow-xl font-medium text-sm"
                                            >
                                                <RefreshCw className={`h-4 w-4 ${reprocessMutation.isPending ? 'animate-spin' : ''}`} />
                                                Proses Ulang
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (confirm('Yakin ingin menghapus dokumen ini?')) {
                                                        deleteMutation.mutate(doc.id);
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-xl font-medium text-sm"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {data && data.last_page > 1 && (
                            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Halaman {data.current_page} dari {data.last_page}
                                    </span>
                                    <div className="flex gap-2">
                                        {data.current_page > 1 && (
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm">
                                                Sebelumnya
                                            </button>
                                        )}
                                        {data.current_page < data.last_page && (
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm">
                                                Selanjutnya
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OcrOnlyPage;