import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, History, Filter, FileText, Mic, MicOff, Volume2 } from 'lucide-react';
import { useAdvancedSearch, useSearchHistory, useSearchSuggestions, useSearchFilterOptions } from '@/api/hooks';
import { CASE_TYPES } from '@/constants';

const highlight = (text, term) => {
    const value = String(text ?? '');
    const q = String(term ?? '').trim();
    if (!q) return value;

    const lower = value.toLowerCase();
    const needle = q.toLowerCase();

    let result = '';
    let idx = 0;
    while (idx < value.length) {
        const found = lower.indexOf(needle, idx);
        if (found === -1) {
            result += value.slice(idx);
            break;
        }
        if (found > idx) {
            result += value.slice(idx, found);
        }
        result += `<mark class="rounded bg-emerald-100 px-1 text-emerald-900">${value.slice(found, found + q.length)}</mark>`;
        idx = found + q.length;
    }

    return result;
};

const Field = ({ label, children }) => (
    <label className="block">
        <div className="text-xs font-semibold text-slate-600 mb-1">{label}</div>
        {children}
    </label>
);

export default function AdvancedSearchPage() {
    const [q, setQ] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(true);
    const [page, setPage] = useState(1);
    const perPage = 15;

    const [filters, setFilters] = useState({
        jenis_perkara: '',
        jenis_dokumen: '',
        kategori_ocr: '',
    });

    // Voice recognition states
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [speechSupported, setSpeechSupported] = useState(false);
    
    // Text-to-speech states
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
    
    // Summary type preference
    const [summaryType, setSummaryType] = useState('internal'); // 'internal', 'legal', 'publik'
    
    // Suggestions visibility
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'id-ID'; // Bahasa Indonesia
            
            recognitionInstance.onstart = () => {
                setIsListening(true);
            };
            
            recognitionInstance.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQ(transcript);
                setIsListening(false);
                setShowSuggestions(false); // Hide suggestions after voice input
            };
            
            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            
            recognitionInstance.onend = () => {
                setIsListening(false);
            };
            
            setRecognition(recognitionInstance);
            setSpeechSupported(true);
        }
    }, []);

    // Voice input handler
    const handleVoiceInput = () => {
        if (!recognition) return;
        
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    // Text-to-speech handler with stop functionality
    const handleReadText = (text, itemId) => {
        if ('speechSynthesis' in window) {
            // If already speaking, stop it
            if (isSpeaking && currentSpeakingId === itemId) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
                setCurrentSpeakingId(null);
                return;
            }
            
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID'; // Bahasa Indonesia
            utterance.rate = 0.9; // Slightly slower for better clarity
            utterance.pitch = 1;
            
            utterance.onstart = () => {
                setIsSpeaking(true);
                setCurrentSpeakingId(itemId);
            };
            
            utterance.onend = () => {
                setIsSpeaking(false);
                setCurrentSpeakingId(null);
            };
            
            utterance.onerror = () => {
                setIsSpeaking(false);
                setCurrentSpeakingId(null);
            };
            
            window.speechSynthesis.speak(utterance);
        }
    };

    // Read search result snippet
    const handleReadResult = (item) => {
        let textToRead = `Dokumen nomor ${item.id}. `;
        
        if (item?.perkara?.nomor_perkara) {
            textToRead += `Perkara ${item.perkara.nomor_perkara}. `;
        }
        
        if (item?.snippet?.text) {
            // Clean HTML tags from snippet
            const cleanSnippet = item.snippet.text.replace(/<[^>]*>/g, '');
            textToRead += cleanSnippet;
        }
        
        handleReadText(textToRead, item.id);
    };

    const [suggestTerm, setSuggestTerm] = useState('');
    useEffect(() => {
        const handle = setTimeout(() => {
            setSuggestTerm(q);
            // Show suggestions only if there's a query and not listening
            if (q.trim() && !isListening) {
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        }, 250);
        return () => clearTimeout(handle);
    }, [q, isListening]);

    useEffect(() => {
        setPage(1);
    }, [q, filters]);

    const params = useMemo(() => {
        const clean = {
            q: q.trim() || undefined,
            jenis_perkara: filters.jenis_perkara || undefined,
            jenis_dokumen: filters.jenis_dokumen || undefined,
            kategori_ocr: filters.kategori_ocr || undefined,
            per_page: perPage,
            page,
        };

        return clean;
    }, [q, filters, page]);

    const { data, isLoading, error } = useAdvancedSearch(params);
    const { data: suggestionsData } = useSearchSuggestions(suggestTerm);
    const { data: historyData } = useSearchHistory();
    const { data: filterOptionsData } = useSearchFilterOptions();

    const suggestions = suggestionsData?.items ?? [];
    const historyItems = historyData?.items ?? [];
    const filterOptions = filterOptionsData ?? { jenis_dokumen: [], jenis_perkara: [] };

    const meta = data?.meta ?? {};
    const currentPage = Number(meta.current_page ?? page);
    const lastPage = Number(meta.last_page ?? 1);

    const caseTypeLabel = (value) =>
        CASE_TYPES.find((t) => t.value === value)?.label ?? value;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-6">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl shadow-indigo-500/20 mb-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
                            <Search className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <div className="mb-2 inline-block px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm text-xs font-semibold uppercase tracking-wide">
                                Pencarian Lanjutan
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Pencarian Dokumen & AI</h1>
                            <p className="text-indigo-50 text-sm">Cari dengan kata kunci, filter, atau gunakan pencarian suara</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFiltersOpen((v) => !v)}
                        className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl shadow-black/10 border-0 font-semibold inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm transition-all"
                    >
                        <Filter className="h-4 w-4" />
                        {filtersOpen ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                    </button>
                </div>
            </div>
            
            <div className="space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {/* Search Box */}
                    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                        <div className="relative">
                            <div className="flex items-center gap-3 rounded-xl border-2 border-slate-300 bg-white px-4 py-3.5 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                                <Search className="h-5 w-5 text-emerald-600 shrink-0" />
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setShowSuggestions(false);
                                        }
                                    }}
                                    onFocus={() => {
                                        if (q.trim()) setShowSuggestions(true);
                                    }}
                                    placeholder="Ketik kata kunci untuk mencari dokumen..."
                                    className="w-full bg-transparent text-base text-slate-800 placeholder:text-slate-400 outline-none"
                                />
                                
                                {/* Voice Input Button */}
                                {speechSupported && (
                                    <button
                                        type="button"
                                        onClick={handleVoiceInput}
                                        className={`p-2 rounded-lg transition-all ${
                                            isListening 
                                                ? 'bg-red-100 text-red-600 animate-pulse' 
                                                : 'hover:bg-emerald-100 text-slate-500 hover:text-emerald-600'
                                        }`}
                                        title={isListening ? 'Mendengarkan...' : 'Pencarian dengan suara'}
                                    >
                                        {isListening ? (
                                            <MicOff className="h-5 w-5" />
                                        ) : (
                                            <Mic className="h-5 w-5" />
                                        )}
                                    </button>
                                )}
                                
                                {q && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQ('');
                                            setShowSuggestions(false);
                                        }}
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Voice status indicator */}
                            {isListening && (
                                <div className="absolute top-full mt-2 left-0 right-0">
                                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                        <div className="flex gap-1">
                                            <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                        <span className="text-sm font-medium text-red-700">Mendengarkan... Silakan berbicara</span>
                                    </div>
                                </div>
                            )}

                            {showSuggestions && suggestions.length > 0 && q.trim() !== '' && (
                                <div className="absolute z-20 mt-3 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
                                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Saran Pencarian</p>
                                    </div>
                                    {suggestions.map((s, idx) => (
                                        <button
                                            type="button"
                                            key={`${s.type}-${s.value}-${idx}`}
                                            onClick={() => {
                                                setQ(String(s.value ?? ''));
                                                setShowSuggestions(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 transition-colors border-b border-slate-50 last:border-0 group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <div className="text-slate-800 font-medium group-hover:text-emerald-700">{s.label}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5 capitalize">{s.type}</div>
                                                </div>
                                                <svg className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
                        <div className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Hasil Pencarian</h3>
                                    <p className="text-sm text-slate-600 mt-0.5">
                                        Ditemukan <span className="font-semibold text-emerald-700">{data?.meta?.total ?? 0}</span> dokumen
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {!isLoading && !error && (data?.items?.length ?? 0) > 0 && (
                                        <>
                                            {/* Summary Type Selector */}
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs font-medium text-slate-600">Tampilkan:</label>
                                                <select
                                                    value={summaryType}
                                                    onChange={(e) => setSummaryType(e.target.value)}
                                                    className="px-3 py-1.5 border-2 border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <option value="internal">Ringkasan Internal</option>
                                                    <option value="legal">Ringkasan Penegak Hukum</option>
                                                    <option value="publik">Ringkasan Publik</option>
                                                </select>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-xs font-semibold">Aktif</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {isLoading && (
                                <div className="px-6 py-12 text-center">
                                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-50 text-emerald-700">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="font-medium">Mencari dokumen...</span>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="px-6 py-12 text-center">
                                    <div className="inline-flex flex-col items-center gap-3 max-w-md">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Gagal memuat hasil</p>
                                            <p className="text-sm text-slate-600 mt-1">Terjadi kesalahan saat mencari dokumen. Silakan coba lagi.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isLoading && !error && (data?.items?.length ?? 0) === 0 && (
                                <div className="px-6 py-12 text-center">
                                    <div className="inline-flex flex-col items-center gap-3 max-w-md">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                            <Search className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Tidak ada hasil</p>
                                            <p className="text-sm text-slate-600 mt-1">
                                                Coba gunakan kata kunci yang berbeda atau ubah filter pencarian
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(data?.items ?? []).map((item) => (
                                <div 
                                    key={item.id} 
                                    className="group p-6 hover:bg-linear-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/30">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <Link
                                                        to={`/documents/${item.id}`}
                                                        className="text-lg font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
                                                    >
                                                        Dokumen #{item.id}
                                                    </Link>
                                                    {item?.perkara?.nomor_perkara && (
                                                        <p className="text-sm text-slate-600 mt-0.5">
                                                            {item.perkara.nomor_perkara}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {item.jenis_dokumen && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-medium">
                                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                                            <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                                        </svg>
                                                        {item.jenis_dokumen}
                                                    </span>
                                                )}
                                                {item?.perkara?.jenis_perkara && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium">
                                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                        </svg>
                                                        {caseTypeLabel(item.perkara.jenis_perkara)}
                                                    </span>
                                                )}
                                                {item?.perkara?.status && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium">
                                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        {item.perkara.status}
                                                    </span>
                                                )}
                                            </div>

                                            {(() => {
                                                // Determine which summary to show based on user preference
                                                let displayText = '';
                                                let displaySource = '';
                                                
                                                if (summaryType === 'internal' && item.summaries?.internal) {
                                                    displayText = item.summaries.internal;
                                                    displaySource = 'Ringkasan Internal';
                                                } else if (summaryType === 'legal' && item.summaries?.legal) {
                                                    displayText = item.summaries.legal;
                                                    displaySource = 'Ringkasan Penegak Hukum';
                                                } else if (summaryType === 'publik' && item.summaries?.publik) {
                                                    displayText = item.summaries.publik;
                                                    displaySource = 'Ringkasan Publik';
                                                } else if (item.snippet?.text) {
                                                    // Fallback to original snippet if preferred summary not available
                                                    displayText = item.snippet.text;
                                                    displaySource = item.snippet.source === 'ringkasan_publik' ? 'Ringkasan Publik' :
                                                        item.snippet.source === 'ringkasan_internal' ? 'Ringkasan Internal' :
                                                        item.snippet.source === 'ringkasan_legal' ? 'Ringkasan Pertimbangan Hukum' :
                                                        item.snippet.source === 'pertimbangan_llm' ? 'Pertimbangan LLM' :
                                                        item.snippet.source === 'ocr' ? 'Teks OCR' :
                                                        item.snippet.source;
                                                }
                                                
                                                // Truncate for display (limit to 300 chars)
                                                if (displayText && displayText.length > 300) {
                                                    displayText = displayText.substring(0, 300) + '...';
                                                }

                                                return displayText ? (
                                                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mt-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100">
                                                                <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            <span className="text-xs font-medium text-emerald-700">
                                                                Sumber: {displaySource}
                                                            </span>
                                                        </div>
                                                        <p 
                                                            className="text-sm text-slate-700 leading-relaxed"
                                                            dangerouslySetInnerHTML={{
                                                                __html: highlight(displayText, q)
                                                            }}
                                                        />
                                                    </div>
                                                ) : null;
                                            })()}

                                            {(item?.tags?.length ?? 0) > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {item.tags.map((t) => (
                                                        <span
                                                            key={t.id}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
                                                        >
                                                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                            </svg>
                                                            {t.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="shrink-0 flex flex-col gap-2">
                                            <Link
                                                to={item.perkara_id ? `/documents/${item.id}` : `/ocr-only#doc-${item.id}`}
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-blue-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-200"
                                            >
                                                Lihat Detail
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                            
                                            {/* Read Aloud Button */}
                                            {'speechSynthesis' in window && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleReadResult(item)}
                                                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${
                                                        isSpeaking && currentSpeakingId === item.id
                                                            ? 'border-2 border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-400'
                                                            : 'border-2 border-blue-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300'
                                                    }`}
                                                    title={isSpeaking && currentSpeakingId === item.id ? "Berhenti" : "Dengarkan hasil"}
                                                >
                                                    {isSpeaking && currentSpeakingId === item.id ? (
                                                        <>
                                                            <MicOff className="h-4 w-4" />
                                                            <span>Berhenti</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Volume2 className="h-4 w-4" />
                                                            <span>Dengarkan</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200">
                                    <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                </div>
                                <span className="font-medium">
                                    Halaman <span className="text-emerald-600 font-semibold">{currentPage}</span> dari <span className="font-semibold">{lastPage}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={isLoading || currentPage <= 1}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Sebelumnya
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                                    disabled={isLoading || currentPage >= lastPage}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-emerald-500 bg-linear-to-r from-emerald-600 to-blue-600 text-sm font-semibold text-white hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Berikutnya
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {filtersOpen && (
                        <div className="rounded-2xl border-2 border-slate-200 bg-linear-to-br from-white to-slate-50 shadow-xl overflow-hidden">
                            <div className="bg-linear-to-r from-purple-600 to-blue-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                        <Filter className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white">Filter Pencarian</div>
                                        <div className="text-xs text-white/80 mt-0.5">Saring hasil berdasarkan kriteria</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <Field label="Jenis Perkara">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <select
                                            value={filters.jenis_perkara}
                                            onChange={(e) =>
                                                setFilters((p) => ({ ...p, jenis_perkara: e.target.value }))
                                            }
                                            className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-slate-200 text-sm bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer hover:border-slate-300"
                                        >
                                            <option value="">Semua Jenis Perkara</option>
                                            {(filterOptions.jenis_perkara ?? []).map((value) => {
                                                const label = CASE_TYPES.find((t) => t.value === value)?.label ?? value;
                                                return (
                                                    <option key={value} value={value}>
                                                        {label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Field>

                                <Field label="Jenis Dokumen">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                                <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                            </svg>
                                        </div>
                                        <select
                                            value={filters.jenis_dokumen}
                                            onChange={(e) =>
                                                setFilters((p) => ({ ...p, jenis_dokumen: e.target.value }))
                                            }
                                            className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-slate-200 text-sm bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all appearance-none cursor-pointer hover:border-slate-300"
                                        >
                                            <option value="">Semua Jenis Dokumen</option>
                                            {(filterOptions.jenis_dokumen ?? []).map((value) => (
                                                <option key={value} value={value}>
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Field>

                                <Field label="Kategori OCR">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <select
                                            value={filters.kategori_ocr}
                                            onChange={(e) =>
                                                setFilters((p) => ({ ...p, kategori_ocr: e.target.value }))
                                            }
                                            className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-slate-200 text-sm bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer hover:border-slate-300"
                                        >
                                            <option value="">Semua Kategori OCR</option>
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
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Field>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFilters({
                                            jenis_perkara: '',
                                            jenis_dokumen: '',
                                            kategori_ocr: '',
                                        })
                                    }
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    )}

                    {/* <div className="rounded-2xl border-2 border-slate-200 bg-linear-to-br from-white to-slate-50 shadow-xl overflow-hidden">
                        <div className="bg-linear-to-r from-amber-600 to-orange-600 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <History className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">Riwayat Pencarian</div>
                                    <div className="text-xs text-white/80 mt-0.5">Pencarian terakhir Anda</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {(historyItems.length ?? 0) === 0 && (
                                <div className="text-center py-8">
                                    <div className="inline-flex flex-col items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                                            <History className="h-6 w-6 text-slate-400" />
                                        </div>
                                        <p className="text-sm text-slate-600">Belum ada riwayat pencarian</p>
                                    </div>
                                </div>
                            )}

                        <div className="space-y-3">
                            {historyItems.map((h) => (
                                <button
                                    type="button"
                                    key={h.id}
                                    onClick={() => {
                                        setQ(h.query ?? '');
                                        setPage(1);
                                        setFilters((p) => ({
                                            ...p,
                                            ...(h.filters ?? {}),
                                        }));
                                    }}
                                    className="w-full text-left group rounded-xl border-2 border-slate-200 bg-white px-4 py-3 hover:border-amber-400 hover:bg-amber-50 transition-all duration-200"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-amber-100 transition-colors">
                                            <Search className="h-4 w-4 text-slate-600 group-hover:text-amber-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-slate-900 group-hover:text-amber-900 truncate">
                                                {h.query || 'Pencarian kosong'}
                                            </div>
                                            <div className="text-xs text-slate-500 group-hover:text-amber-700 mt-1">
                                                {h.results_count ?? 0} hasil ditemukan
                                            </div>
                                        </div>
                                        <svg className="h-5 w-5 text-slate-400 group-hover:text-amber-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                        </div>
                    </div> */}
                </div>
            </div>
            </div>
        </div>
    );
}