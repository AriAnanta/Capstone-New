import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { login as loginRequest } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

const LoginPage = () => {
    const token = useAuthStore((state) => state.token);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (token) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await loginRequest({ identifier, password });
        } catch (err) {
            const apiError = err.response?.data;
            const message =
                apiError?.message ||
                apiError?.errors?.identifier?.[0] ||
                'Gagal masuk. Periksa kembali email/username dan kata sandi Anda.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">Masuk ke PTA Digital</h1>
                <p className="mt-2 text-sm text-slate-600">Gunakan email atau username internal PTA.</p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <label className="block text-sm text-slate-600">
                        Email atau username
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={identifier}
                            onChange={(event) => setIdentifier(event.target.value)}
                            placeholder="hakim@example.com atau hakim"
                            autoComplete="username"
                        />
                    </label>

                    <label className="block text-sm text-slate-600">
                        Kata sandi
                        <input
                            type="password"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </label>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                <div className="mt-6 rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">Akun contoh</p>
                    <ul className="mt-2 space-y-1">
                        <li>hakim@example.com / password</li>
                        <li>panitera@example.com / password</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
