import { useState } from 'react';
import { 
    Scale, BookOpen, Search, Loader2, AlertCircle, CheckCircle2, 
    ChevronDown, ChevronUp, Sparkles, FileText, Lightbulb, 
    BookMarked, ArrowRight, Info
} from 'lucide-react';
import { useLegalRecommendations, useLegalAnalysis, usePerkaras } from '@/api/hooks';
import { CASE_TYPES } from '@/constants';
import clsx from 'clsx';

const LegalAdvisorPage = () => {
    const [selectedCaseType, setSelectedCaseType] = useState('');
    const [activeTab, setActiveTab] = useState('quick'); // 'quick' or 'detailed'
    const [kronologi, setKronologi] = useState('');
    const [faktaPersidangan, setFaktaPersidangan] = useState('');
    const [tuntutan, setTuntutan] = useState('');
    const [selectedPerkara, setSelectedPerkara] = useState('');
    const [expandedRegulations, setExpandedRegulations] = useState({});
    const [result, setResult] = useState(null);

    const { data: perkaras = [] } = usePerkaras();
    const recommendationsMutation = useLegalRecommendations();
    const analysisMutation = useLegalAnalysis();

    const isLoading = recommendationsMutation.isPending || analysisMutation.isPending;

    const handleQuickSearch = async () => {
        if (!selectedCaseType) return;

        try {
            const data = await recommendationsMutation.mutateAsync({
                jenis_perkara: selectedCaseType,
            });
            setResult(data);
        } catch (error) {
            console.error('Failed to get recommendations:', error);
        }
    };

    const handleDetailedAnalysis = async () => {
        if (!selectedCaseType || !kronologi) return;

        try {
            const data = await analysisMutation.mutateAsync({
                jenis_perkara: selectedCaseType,
                kronologi,
                fakta_persidangan: faktaPersidangan || undefined,
                tuntutan: tuntutan || undefined,
            });
            setResult(data);
        } catch (error) {
            console.error('Failed to analyze:', error);
        }
    };

    const toggleRegulation = (index) => {
        setExpandedRegulations((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handlePerkaraSelect = (perkaraId) => {
        setSelectedPerkara(perkaraId);
        const perkara = perkaras.find((p) => p.id === parseInt(perkaraId));
        if (perkara) {
            setSelectedCaseType(perkara.jenis_perkara);
        }
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
                        <Scale className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Asisten Hukum</h1>
                        <p className="text-slate-600">Rekomendasi pasal dan peraturan untuk persidangan</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Input */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Tab Selection */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex border-b border-slate-200">
                            <button
                                onClick={() => setActiveTab('quick')}
                                className={clsx(
                                    'flex-1 px-4 py-3 text-sm font-semibold transition-colors',
                                    activeTab === 'quick'
                                        ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                                        : 'text-slate-600 hover:bg-slate-50'
                                )}
                            >
                                <Search className="h-4 w-4 inline mr-2" />
                                Pencarian Cepat
                            </button>
                            <button
                                onClick={() => setActiveTab('detailed')}
                                className={clsx(
                                    'flex-1 px-4 py-3 text-sm font-semibold transition-colors',
                                    activeTab === 'detailed'
                                        ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                                        : 'text-slate-600 hover:bg-slate-50'
                                )}
                            >
                                <Sparkles className="h-4 w-4 inline mr-2" />
                                Analisis AI
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Case Type Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Jenis Perkara
                                </label>
                                <select
                                    value={selectedCaseType}
                                    onChange={(e) => setSelectedCaseType(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                >
                                    <option value="">Pilih jenis perkara...</option>
                                    {CASE_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Perkara Selection (Optional) */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Dari Perkara (Opsional)
                                </label>
                                <select
                                    value={selectedPerkara}
                                    onChange={(e) => handlePerkaraSelect(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                >
                                    <option value="">Pilih perkara...</option>
                                    {perkaras.map((perkara) => (
                                        <option key={perkara.id} value={perkara.id}>
                                            {perkara.nomor_perkara}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Detailed Analysis Fields */}
                            {activeTab === 'detailed' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Kronologi Perkara <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={kronologi}
                                            onChange={(e) => setKronologi(e.target.value)}
                                            placeholder="Jelaskan kronologi perkara secara detail..."
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Minimal 50 karakter</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Fakta Persidangan
                                        </label>
                                        <textarea
                                            value={faktaPersidangan}
                                            onChange={(e) => setFaktaPersidangan(e.target.value)}
                                            placeholder="Fakta-fakta yang terungkap dalam persidangan..."
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Tuntutan
                                        </label>
                                        <textarea
                                            value={tuntutan}
                                            onChange={(e) => setTuntutan(e.target.value)}
                                            placeholder="Tuntutan atau petitum yang diajukan..."
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={activeTab === 'quick' ? handleQuickSearch : handleDetailedAnalysis}
                                disabled={isLoading || !selectedCaseType || (activeTab === 'detailed' && kronologi.length < 50)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Menganalisis...
                                    </>
                                ) : (
                                    <>
                                        {activeTab === 'quick' ? (
                                            <>
                                                <Search className="h-5 w-5" />
                                                Cari Rekomendasi
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-5 w-5" />
                                                Analisis dengan AI
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                            <div>
                                <h3 className="font-semibold text-amber-900 mb-1">Tips Penggunaan</h3>
                                <ul className="text-sm text-amber-800 space-y-1">
                                    <li>• <strong>Pencarian Cepat:</strong> Dapatkan daftar pasal berdasarkan jenis perkara</li>
                                    <li>• <strong>Analisis AI:</strong> Dapatkan rekomendasi yang lebih spesifik berdasarkan kronologi</li>
                                    <li>• Semakin detail informasi, semakin akurat rekomendasi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Results */}
                <div className="lg:col-span-2">
                    {!result && !isLoading && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="h-20 w-20 rounded-full bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                    <BookOpen className="h-10 w-10 text-amber-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Pilih Jenis Perkara
                            </h3>
                            <p className="text-slate-600 max-w-md mx-auto">
                                Pilih jenis perkara di panel sebelah kiri untuk mendapatkan rekomendasi pasal dan peraturan yang relevan.
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Menganalisis Perkara...
                            </h3>
                            <p className="text-slate-600">
                                Sistem sedang mencari pasal-pasal yang relevan
                            </p>
                        </div>
                    )}

                    {result && !isLoading && (
                        <div className="space-y-6">
                            {/* Result Header */}
                            <div className="bg-linear-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircle2 className="h-6 w-6" />
                                    <h2 className="text-xl font-bold">Hasil Rekomendasi</h2>
                                </div>
                                <p className="text-amber-100">
                                    Jenis Perkara: <span className="font-semibold text-white">{result.label_perkara}</span>
                                </p>
                                <p className="text-amber-100 text-sm mt-1">
                                    Sumber: {result.source === 'llm_enhanced' ? 'Analisis AI' : result.source === 'database' ? 'Database' : 'Data Dasar'}
                                </p>
                            </div>

                            {/* LLM Analysis (if available) */}
                            {result.llm_analysis && (
                                <div className="bg-linear-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles className="h-5 w-5 text-purple-600" />
                                        <h3 className="font-bold text-purple-900">Analisis AI</h3>
                                    </div>

                                    {result.llm_analysis.summary && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-purple-800 mb-2">Ringkasan</h4>
                                            <p className="text-purple-900 bg-white/50 rounded-lg p-3">
                                                {result.llm_analysis.summary}
                                            </p>
                                        </div>
                                    )}

                                    {result.llm_analysis.recommendations?.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-purple-800 mb-2">
                                                <Lightbulb className="h-4 w-4 inline mr-1" />
                                                Rekomendasi Pertimbangan
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.llm_analysis.recommendations.map((rec, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-purple-900">
                                                        <ArrowRight className="h-4 w-4 mt-0.5 text-purple-500 shrink-0" />
                                                        <span>{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {result.llm_analysis.legal_basis?.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-purple-800 mb-2">
                                                <BookMarked className="h-4 w-4 inline mr-1" />
                                                Dasar Hukum
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.llm_analysis.legal_basis.map((basis, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                                                    >
                                                        {basis}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Regulations List */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-slate-600" />
                                        <h3 className="font-bold text-slate-900">Daftar Peraturan Terkait</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">
                                        {result.regulations?.length || 0} peraturan ditemukan
                                    </p>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {result.regulations?.map((regulation, index) => (
                                        <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                                            <button
                                                onClick={() => toggleRegulation(index)}
                                                className="w-full flex items-start justify-between gap-4 text-left"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-slate-900">
                                                        {regulation.nama_undang}
                                                    </h4>
                                                    <p className="text-sm text-amber-600 font-medium mt-0.5">
                                                        {regulation.pasal}
                                                    </p>
                                                </div>
                                                {expandedRegulations[index] ? (
                                                    <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                                                )}
                                            </button>

                                            {expandedRegulations[index] && (
                                                <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                                    <p className="text-sm text-slate-700 leading-relaxed">
                                                        {regulation.isi_pasal}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {(!result.regulations || result.regulations.length === 0) && (
                                        <div className="p-8 text-center">
                                            <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-slate-500">Tidak ada peraturan ditemukan</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                <p className="text-xs text-slate-500 text-center">
                                    <strong>Disclaimer:</strong> Rekomendasi ini bersifat referensi dan tidak menggantikan pertimbangan hukum hakim. 
                                    Selalu verifikasi dengan sumber hukum resmi dan terkini.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LegalAdvisorPage;
