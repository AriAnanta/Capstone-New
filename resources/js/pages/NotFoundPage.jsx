import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <p className="text-sm uppercase tracking-wide text-slate-500">404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
        <p className="mt-2 max-w-md text-sm text-slate-600">
            Kami tidak menemukan halaman yang Anda tuju. Silakan kembali ke dashboard atau gunakan navigasi utama.
        </p>
        <div className="mt-6 flex gap-3">
            <Link to="/" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
                Kembali ke dashboard
            </Link>
            <Link to="/public/putusan" className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700">
                Portal publik
            </Link>
        </div>
    </div>
);

export default NotFoundPage;
