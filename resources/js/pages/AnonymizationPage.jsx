import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { 
    Shield, 
    Upload, 
    FileText, 
    Copy, 
    Check, 
    Download, 
    AlertCircle, 
    Eye, 
    EyeOff,
    RefreshCw,
    Sparkles,
    Info,
    ChevronDown,
    ChevronUp,
    User,
    MapPin,
    CreditCard,
    Mail,
    Phone,
    Baby,
    Users
} from 'lucide-react';

const AnonymizationPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [caseType, setCaseType] = useState('umum');
    const [textInput, setTextInput] = useState('');
    const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'
    const [result, setResult] = useState(null);
    const [showOriginal, setShowOriginal] = useState(false);
    const [copiedText, setCopiedText] = useState(null);
    const [expandedEntities, setExpandedEntities] = useState(true);

    // Fetch case types
    const { data: caseTypesData } = useQuery({
        queryKey: ['anonymization-case-types'],
        queryFn: async () => {
            const response = await apiClient.get('/anonymization/case-types');
            return response.data.data;
        },
    });

    // Process file mutation
    const processFileMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await apiClient.post('/anonymization/process-file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                setResult(data.data);
            }
        },
        onError: (error) => {
            alert('Gagal memproses dokumen: ' + (error.response?.data?.message || error.message));
        },
    });

    // Process text mutation
    const processTextMutation = useMutation({
        mutationFn: async (payload) => {
            const response = await apiClient.post('/anonymization/process-text', payload);
            return response.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                setResult(data.data);
            }
        },
        onError: (error) => {
            alert('Gagal memproses teks: ' + (error.response?.data?.message || error.message));
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setResult(null);
        }
    };

    const handleProcess = async () => {
        if (inputMode === 'file') {
            if (!selectedFile) {
                alert('Pilih file terlebih dahulu');
                return;
            }
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('case_type', caseType);
            processFileMutation.mutate(formData);
        } else {
            if (!textInput.trim() || textInput.length < 50) {
                alert('Masukkan teks minimal 50 karakter');
                return;
            }
            processTextMutation.mutate({
                text: textInput,
                case_type: caseType,
            });
        }
    };

    const handleCopy = async (text, type) => {
        await navigator.clipboard.writeText(text);
        setCopiedText(type);
        setTimeout(() => setCopiedText(null), 2000);
    };

    const handleDownload = () => {
        if (!result?.anonymized_text) return;

        const blob = new Blob([result.anonymized_text], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        
        const filename = result.original_filename 
            ? result.original_filename.replace(/\.[^/.]+$/, '') + '_anonim.txt'
            : 'dokumen_anonim.txt';
        
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        setSelectedFile(null);
        setTextInput('');
        setResult(null);
        setShowOriginal(false);
    };

    const getEntityIcon = (type) => {
        const icons = {
            name: User,
            child: Baby,
            witness: Users,
            address: MapPin,
            nik: CreditCard,
            email: Mail,
            phone: Phone,
            kk: CreditCard,
            rekening: CreditCard,
            place: MapPin,
            date_of_birth: User,
        };
        return icons[type] || FileText;
    };

    const getEntityLabel = (type) => {
        const labels = {
            name: 'Nama',
            child: 'Nama Anak',
            witness: 'Nama Saksi',
            address: 'Alamat',
            nik: 'NIK',
            email: 'Email',
            phone: 'No. Telepon',
            kk: 'No. KK',
            rekening: 'No. Rekening',
            place: 'Tempat',
            date_of_birth: 'Tanggal Lahir',
        };
        return labels[type] || type;
    };

    const isProcessing = processFileMutation.isPending || processTextMutation.isPending;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-violet-50/30 to-purple-50/30">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 shadow-2xl shadow-purple-500/20 mx-4 sm:mx-8 mt-4 mb-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                <div className="relative">
                    <div className="mb-3 inline-block px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm text-xs font-semibold uppercase tracking-wide">
                        <Shield className="inline h-3 w-3 mr-1.5 -mt-0.5" />
                        Data Privacy Protection
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Anonimisasi Dokumen</h1>
                    <p className="text-purple-100 text-lg">Lindungi data pribadi dalam dokumen putusan pengadilan dengan AI</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    
                    {/* Input Section */}
                    <div className="space-y-6">
                        {/* Input Mode Toggle */}
                        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <button
                                    onClick={() => { setInputMode('file'); setResult(null); }}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                                        inputMode === 'file'
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload File
                                </button>
                                <button
                                    onClick={() => { setInputMode('text'); setResult(null); }}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                                        inputMode === 'text'
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <FileText className="h-4 w-4" />
                                    Input Teks
                                </button>
                            </div>

                            {/* Case Type Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Jenis Perkara
                                </label>
                                <select
                                    value={caseType}
                                    onChange={(e) => setCaseType(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                                >
                                    {caseTypesData?.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* File Input */}
                            {inputMode === 'file' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        File Dokumen
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".doc,.docx,.rtf,.txt"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
                                        >
                                            <div className="text-center">
                                                <Upload className="mx-auto h-10 w-10 text-purple-400 mb-3" />
                                                {selectedFile ? (
                                                    <div>
                                                        <p className="text-sm font-semibold text-purple-700">{selectedFile.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-600">
                                                            Klik untuk memilih file
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            DOC, DOCX, RTF, TXT (Max 10MB)
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Text Input */}
                            {inputMode === 'text' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Teks Dokumen
                                    </label>
                                    <textarea
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        placeholder="Tempelkan atau ketik teks dokumen putusan di sini..."
                                        rows={12}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all resize-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400 mt-2 text-right">
                                        {textInput.length} karakter (minimum 50)
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleProcess}
                                    disabled={isProcessing || (inputMode === 'file' ? !selectedFile : textInput.length < 50)}
                                    className="flex-1 py-3 px-6 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                                >
                                    {isProcessing ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4" />
                                            Anonimkan
                                        </>
                                    )}
                                </button>
                                {(selectedFile || textInput || result) && (
                                    <button
                                        onClick={handleReset}
                                        className="py-3 px-4 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                            <div className="flex gap-3">
                                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-1">Tentang Fitur Ini</h4>
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                        Fitur anonimisasi menggunakan AI untuk mendeteksi dan menyamarkan data pribadi seperti 
                                        nama, alamat, NIK, email, nomor telepon, dan informasi sensitif lainnya dalam dokumen 
                                        putusan pengadilan agama.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Section */}
                    <div className="space-y-6">
                        {result ? (
                            <>
                                {/* Stats */}
                                <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-600" />
                                            Hasil Anonimisasi
                                        </h3>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                            {result.entities_count} data ditemukan
                                        </span>
                                    </div>

                                    {/* Entities Found */}
                                    {result.entities_found?.length > 0 && (
                                        <div className="mb-4">
                                            <button
                                                onClick={() => setExpandedEntities(!expandedEntities)}
                                                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors mb-3"
                                            >
                                                {expandedEntities ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                Data yang Dianonimkan
                                            </button>
                                            {expandedEntities && (
                                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                                    {result.entities_found.map((entity, idx) => {
                                                        const IconComponent = getEntityIcon(entity.type);
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm"
                                                            >
                                                                <IconComponent className="h-4 w-4 text-purple-500 shrink-0" />
                                                                <span className="font-medium text-gray-500 w-24 shrink-0">
                                                                    {getEntityLabel(entity.type)}
                                                                </span>
                                                                <span className="text-gray-700 truncate">
                                                                    {entity.value}
                                                                </span>
                                                                <span className={`ml-auto px-2 py-0.5 rounded text-xs ${
                                                                    entity.source === 'llm' 
                                                                        ? 'bg-purple-100 text-purple-700' 
                                                                        : 'bg-blue-100 text-blue-700'
                                                                }`}>
                                                                    {entity.source === 'llm' ? 'AI' : 'Regex'}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleCopy(result.anonymized_text, 'anon')}
                                            className="flex-1 py-2.5 px-4 bg-purple-100 text-purple-700 font-semibold rounded-xl hover:bg-purple-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            {copiedText === 'anon' ? (
                                                <>
                                                    <Check className="h-4 w-4" />
                                                    Tersalin!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4" />
                                                    Salin Hasil
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleDownload}
                                            className="flex-1 py-2.5 px-4 bg-green-100 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download
                                        </button>
                                    </div>
                                </div>

                                {/* Text Preview */}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {showOriginal ? 'Teks Asli' : 'Teks Hasil Anonimisasi'}
                                        </h3>
                                        <button
                                            onClick={() => setShowOriginal(!showOriginal)}
                                            className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                                        >
                                            {showOriginal ? (
                                                <>
                                                    <EyeOff className="h-4 w-4" />
                                                    Tampilkan Anonim
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="h-4 w-4" />
                                                    Tampilkan Asli
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-xl p-4 max-h-[500px] overflow-y-auto font-sans leading-relaxed">
                                            {showOriginal ? result.original_text : result.anonymized_text}
                                        </pre>
                                        {!showOriginal && (
                                            <div className="absolute top-2 right-2">
                                                <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg">
                                                    ANONIM
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Shield className="h-10 w-10 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    Belum Ada Hasil
                                </h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    Upload file dokumen atau masukkan teks, lalu klik tombol "Anonimkan" untuk memproses.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnonymizationPage;
