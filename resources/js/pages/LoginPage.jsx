import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Shield, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, Globe, Sparkles, Zap, Lock } from 'lucide-react';
import { login as loginRequest } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(null);
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (token) {
            navigate('/', { replace: true });
        }
    }, [token, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (loading) {
            return;
        }

        setError('');
        setLoading(true);

        try {
            await loginRequest({ identifier, password });
            navigate('/', { replace: true });
        } catch (err) {
            const responseMessage = err?.response?.data?.message;
            const identifierError = err?.response?.data?.errors?.identifier?.[0];
            const passwordError = err?.response?.data?.errors?.password?.[0];

            setError(
                responseMessage || identifierError || passwordError || 'Gagal masuk. Periksa kembali kredensial Anda.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background - Enhanced */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Main gradient orbs */}
                <div className="absolute -top-1/2 -left-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl floating-slow" />
                <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl floating-delayed" />
                <div className="absolute -bottom-1/3 left-1/3 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-3xl floating" />
                <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-2xl floating-slow" />
                
                {/* Rotating gradient ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-rotate-slow" />
                    <div className="absolute inset-8 rounded-full border border-cyan-500/20 animate-counter-rotate" />
                </div>
                
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.08) 25%, rgba(255, 255, 255, 0.08) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.08) 75%, rgba(255, 255, 255, 0.08) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.08) 25%, rgba(255, 255, 255, 0.08) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.08) 75%, rgba(255, 255, 255, 0.08) 76%, transparent 77%, transparent)',
                        backgroundSize: '60px 60px'
                    }} />
                </div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Form Section */}
                    <div className="order-2 lg:order-1">
                        <div className="space-y-8">
                            {/* Header */}
                            <div className="space-y-4 animate-fade-in-up" style={{ animationDuration: '0.6s' }}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-16 w-16 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg shadow-emerald-500/30 group p-2">
                                        <img src="/images/logo-pta.png" alt="Logo PTA Bandung" className="h-full w-full object-contain" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">Sistem Digitalisasi</h1>
                                        <p className="text-xs font-medium text-emerald-400">Pengadilan Tinggi Agama Bandung</p>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                                        Selamat Datang
                                    </h2>
                                    <p className="text-base text-slate-400 leading-relaxed">
                                        Masukkan kredensial Anda untuk mengakses dashboard Sistem Digitalisasi.
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" style={{ animationDuration: '0.8s' }}>
                                {/* Email/Username */}
                                <div className="relative group">
                                    <label className="block text-sm font-semibold text-slate-200 mb-3 transition-colors duration-300">
                                        Email atau Username
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            placeholder="user@example.com"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            onFocus={() => setFocused('identifier')}
                                            onBlur={() => setFocused(null)}
                                            className={`w-full px-4 py-3.5 rounded-xl bg-slate-800/40 backdrop-blur-sm border transition-all duration-300 text-white placeholder:text-slate-500 focus:outline-none ${
                                                focused === 'identifier'
                                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10'
                                                    : 'border-slate-700/50 hover:border-slate-600'
                                            }`}
                                        />
                                        <Shield className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="relative group">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-semibold text-slate-200">
                                            Kata Sandi
                                        </label>
                                        <a href="#" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                                            Lupa Password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocused('password')}
                                            onBlur={() => setFocused(null)}
                                            className={`w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-800/40 backdrop-blur-sm border transition-all duration-300 text-white placeholder:text-slate-500 focus:outline-none ${
                                                focused === 'password'
                                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10'
                                                    : 'border-slate-700/50 hover:border-slate-600'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors duration-300"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 animate-shake">
                                        <div className="flex items-start gap-3">
                                            <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <div className="h-2 w-2 rounded-full bg-red-400" />
                                            </div>
                                            <p className="text-sm font-medium text-red-300">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:scale-105 group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Memproses...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Masuk Sistem</span>
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>

                                {/* Public Portal Button */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-700/50"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-3 bg-slate-950 text-slate-500">atau</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate('/public/putusan')}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700/40 hover:border-emerald-500/50 hover:text-white transition-all duration-300 group"
                                >
                                    <Globe className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                                    <span>Akses Portal Publik</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="pt-6 border-t border-slate-700/50">
                                <p className="text-xs text-slate-500 text-center">
                                    © 2025 Pengadilan Tinggi Agama Bandung<br/>
                                    <span className="text-slate-600">Sistem Manajemen Digital Terintegrasi</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right - Visual Section */}
                    <div className="order-1 lg:order-2 hidden lg:block relative">
                        <div className="relative space-y-8">
                            {/* Feature Cards */}
                            <div className="space-y-4 animate-fade-in" style={{ animationDuration: '1s' }}>
                                {[
                                    {
                                        icon: '⚖️',
                                        title: 'Transparansi',
                                        desc: 'Publikasi dokumen hukum terverifikasi'
                                    },
                                    {
                                        icon: '🔒',
                                        title: 'Keamanan',
                                        desc: 'Enkripsi end-to-end untuk data sensitif'
                                    },
                                    {
                                        icon: '⚡',
                                        title: 'Efisiensi',
                                        desc: 'Percepatan proses administrasi perkara'
                                    }
                                ].map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-4 p-4 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 group hover:bg-slate-800/50"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <div className="text-2xl">{feature.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-white mb-1">
                                                {feature.title}
                                            </h3>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Trust Badge */}
                            <div className="p-4 rounded-xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                                    <p className="text-xs text-slate-300">
                                        <span className="font-semibold text-emerald-400">Terpercaya</span> oleh ribuan pengguna di seluruh Indonesia
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .animate-fade-in-up {
                    animation: fade-in-up ease-out forwards;
                }

                .animate-fade-in {
                    animation: fade-in ease-out forwards;
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;