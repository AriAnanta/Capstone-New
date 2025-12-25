import { useState } from 'react';
import { 
    Scale, BookOpen, Search, Loader2, AlertCircle, CheckCircle2, 
    ChevronDown, ChevronUp, Sparkles, FileText, Lightbulb, 
    BookMarked, ArrowRight, Info, CheckCircle
} from 'lucide-react';
import { useLegalRecommendations, useLegalAnalysis, usePerkaras } from '@/api/hooks';
import { CASE_TYPES } from '@/constants';
import clsx from 'clsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';

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
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-amber-50/30 to-yellow-50/30">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-600 via-yellow-600 to-orange-600 p-8 shadow-2xl shadow-amber-500/20 mb-8 mx-6 mt-6">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                <div className="relative flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
                        <Scale className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <div className="mb-2 inline-block px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm text-xs font-semibold uppercase tracking-wide">
                            <Sparkles className="inline h-3 w-3 mr-1.5 -mt-0.5" />
                            AI Assistant
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Asisten Hukum AI</h1>
                        <p className="text-amber-50 text-lg">Rekomendasi pasal dan peraturan untuk persidangan menggunakan AI</p>
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Input */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Tab Selection */}
                    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
                        <div className="flex border-b border-slate-200">
                            {[
                                { id: 'quick', label: 'Pencarian Cepat', icon: Search },
                                { id: 'detailed', label: 'Analisis AI', icon: Sparkles }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={clsx(
                                            'flex-1 px-4 py-4 text-sm font-semibold transition-all relative',
                                            activeTab === tab.id
                                                ? 'text-amber-700 bg-amber-50/50'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        )}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Icon className={clsx("h-4 w-4", activeTab === tab.id ? "text-amber-600" : "text-slate-400")} />
                                            {tab.label}
                                        </div>
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <CardContent className="p-6 space-y-5">
                            {/* Case Type Selection */}
                            <div className="space-y-2">
                                <Label>Jenis Perkara</Label>
                                <select
                                    value={selectedCaseType}
                                    onChange={(e) => setSelectedCaseType(e.target.value)}
                                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                                >
                                    <option value="">-- Pilih jenis perkara --</option>
                                    {CASE_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Perkara Selection (Optional) */}
                            <div className="space-y-2">
                                <Label>Dari Perkara (Opsional)</Label>
                                <select
                                    value={selectedPerkara}
                                    onChange={(e) => handlePerkaraSelect(e.target.value)}
                                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                                >
                                    <option value="">-- Pilih perkara yang ada --</option>
                                    {perkaras.map((perkara) => {
                                        const caseTypeLabel = CASE_TYPES.find(ct => ct.value === perkara.jenis_perkara)?.label || perkara.jenis_perkara;
                                        return (
                                            <option key={perkara.id} value={perkara.id}>
                                                {perkara.nomor_perkara} - {caseTypeLabel}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Detailed Analysis Fields */}
                            {activeTab === 'detailed' && (
                                <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <Label required>Kronologi Perkara</Label>
                                        <textarea
                                            value={kronologi}
                                            onChange={(e) => setKronologi(e.target.value)}
                                            placeholder="Jelaskan kronologi perkara secara detail..."
                                            rows={4}
                                            className="w-full min-h-[100px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                        />
                                        <div className="flex justify-end">
                                             <span className={clsx("text-xs font-medium", kronologi.length < 50 ? "text-red-500" : "text-emerald-600")}>
                                                {kronologi.length}/50 karakter min.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Fakta Persidangan</Label>
                                        <textarea
                                            value={faktaPersidangan}
                                            onChange={(e) => setFaktaPersidangan(e.target.value)}
                                            placeholder="Fakta-fakta yang terungkap dalam persidangan..."
                                            rows={3}
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tuntutan</Label>
                                        <textarea
                                            value={tuntutan}
                                            onChange={(e) => setTuntutan(e.target.value)}
                                            placeholder="Tuntutan atau petitum yang diajukan..."
                                            rows={2}
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                onClick={activeTab === 'quick' ? handleQuickSearch : handleDetailedAnalysis}
                                disabled={isLoading || !selectedCaseType || (activeTab === 'detailed' && kronologi.length < 50)}
                                className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-0 shadow-lg shadow-amber-500/20"
                                size="lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Menganalisis...
                                    </>
                                ) : (
                                    <>
                                        {activeTab === 'quick' ? (
                                            <>
                                                <Search className="mr-2 h-5 w-5" />
                                                Cari Rekomendasi
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-5 w-5" />
                                                Analisis dengan AI
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <div className="bg-amber-50 rounded-xl border border-amber-100 p-5 flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-amber-900 text-sm mb-1">Tips Penggunaan</h3>
                            <ul className="text-xs text-amber-800 space-y-1.5 list-disc pl-3">
                                <li><strong>Pencarian Cepat:</strong> Dapatkan daftar pasal dasar untuk jenis perkara umum.</li>
                                <li><strong>Analisis AI:</strong> Berikan kronologi detail untuk mendapatkan rekomendasi yang lebih kontekstual dan akurat.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Results */}
                <div className="lg:col-span-2">
                    {!result && !isLoading && (
                        <Card className="h-full border-slate-200/60 border-dashed bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
                                <BookOpen className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Mulai Analisis Hukum
                            </h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Pilih jenis perkara di panel sebelah kiri untuk mendapatkan rekomendasi pasal dan peraturan yang relevan untuk kasus Anda.
                            </p>
                        </Card>
                    )}

                    {isLoading && (
                        <Card className="h-full border-slate-200/60 bg-white flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-75"></div>
                                <div className="relative h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Sedang Menganalisis...
                            </h3>
                            <p className="text-slate-500">
                                Sistem sedang mencari korelasi hukum dan pasal yang relevan dengan kasus ini.
                            </p>
                        </Card>
                    )}

                    {result && !isLoading && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Result Header */}
                            <div className="bg-linear-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CheckCircle2 className="h-6 w-6 text-amber-200" />
                                        <h2 className="text-xl font-bold">Hasil Rekomendasi</h2>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <p className="text-amber-100 text-xs uppercase tracking-wider font-semibold">Jenis Perkara</p>
                                            <p className="text-white font-medium text-lg">{result.label_perkara}</p>
                                        </div>
                                        <div>
                                            <p className="text-amber-100 text-xs uppercase tracking-wider font-semibold">Sumber Analisis</p>
                                            <Badge variant="secondary" className="mt-1 bg-amber-500/30 text-black border-0 hover:bg-amber-500/40">
                                                {result.source === 'llm_enhanced' ? 'AI Enhanced Analysis' : result.source === 'database' ? 'Database Match' : 'Basic Retrieval'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LLM Analysis (if available) */}
                            {result.llm_analysis && (
                                <Card className="border-purple-200 bg-purple-50/50 overflow-hidden">
                                    <CardHeader className="bg-purple-100/50 border-b border-purple-100 pb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-purple-200 rounded-lg">
                                                <Sparkles className="h-5 w-5 text-purple-700" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg text-purple-900">Analisis AI</CardTitle>
                                                <CardDescription className="text-purple-700/80">Insight tambahan berdasarkan kronologi</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        {result.llm_analysis.summary && (
                                            <div>
                                                <h4 className="text-sm font-bold text-purple-900 mb-2 uppercase tracking-wide">Ringkasan Kasus</h4>
                                                <div className="bg-white rounded-xl p-4 text-purple-900 border border-purple-100 shadow-sm text-sm leading-relaxed">
                                                    {result.llm_analysis.summary}
                                                </div>
                                            </div>
                                        )}

                                        {result.llm_analysis.recommendations?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-bold text-purple-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                    <Lightbulb className="h-4 w-4" />
                                                    Rekomendasi Pertimbangan
                                                </h4>
                                                <div className="space-y-3">
                                                    {result.llm_analysis.recommendations.map((rec, idx) => (
                                                        <div key={idx} className="flex gap-3 min-w-0 bg-white p-3 rounded-xl border border-purple-100">
                                                            <div className="mt-0.5 h-5 w-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 text-xs font-bold">
                                                                {idx + 1}
                                                            </div>
                                                            <p className="text-purple-900 text-sm leading-relaxed">{rec}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {result.llm_analysis.legal_basis?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-bold text-purple-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                                                    <BookMarked className="h-4 w-4" />
                                                    Dasar Hukum Terkait
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.llm_analysis.legal_basis.map((basis, idx) => (
                                                        <Badge key={idx} variant="outline" className="border-purple-200 bg-white text-purple-700 hover:bg-purple-50 px-3 py-1">
                                                            {basis}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Regulations List */}
                            <Card className="border-slate-200/60 bg-white overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                     <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                                                <FileText className="h-5 w-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg text-slate-900">Pasal & Peraturan</CardTitle>
                                                <CardDescription>
                                                    {result.regulations?.length || 0} referensi hukum ditemukan
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <div className="divide-y divide-slate-100">
                                    {result.regulations?.map((regulation, index) => (
                                        <div key={index} className="group transition-all hover:bg-slate-50/50">
                                            <button
                                                onClick={() => toggleRegulation(index)}
                                                className="w-full flex items-start gap-4 p-5 text-left focus:outline-none"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                                                        {regulation.nama_undang}
                                                    </h4>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0 rounded-md">
                                                            {regulation.pasal}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className={clsx(
                                                    "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                                                    expandedRegulations[index] ? "bg-amber-100 text-amber-600 rotate-180" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm"
                                                )}>
                                                    <ChevronDown className="h-5 w-5" />
                                                </div>
                                            </button>

                                            {expandedRegulations[index] && (
                                                <div className="px-5 pb-5 animate-in slide-in-from-top-1">
                                                    <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 text-slate-700 text-sm leading-relaxed font-serif">
                                                        {regulation.isi_pasal}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {(!result.regulations || result.regulations.length === 0) && (
                                        <div className="p-12 text-center">
                                            <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-500 font-medium">Tidak ada peraturan spesifik ditemukan</p>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Disclaimer */}
                            <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 flex gap-3 items-start">
                                <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    <strong>Disclaimer:</strong> Rekomendasi ini dihasilkan oleh sistem AI sebagai referensi awal dan pendukung keputusan. 
                                    Hasil ini tidak menggantikan pertimbangan hukum profesional oleh hakim atau ahli hukum. 
                                    Mohon verifikasi kembali dengan sumber hukum resmi yang berlaku.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

export default LegalAdvisorPage;
