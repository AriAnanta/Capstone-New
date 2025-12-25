import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FileQuestion, ArrowLeft, Home, Scale } from 'lucide-react';

const NotFoundPage = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 px-4 text-center">
        <div className="animate-in fade-in zoom-in duration-500">
            {/* Icon Section */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-linear-to-br from-purple-200 to-indigo-200 rounded-full blur-3xl opacity-50 scale-150"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl shadow-purple-500/10 inline-flex ring-1 ring-slate-100">
                    <div className="relative">
                        <FileQuestion className="h-24 w-24 text-purple-500" />
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Error Code */}
            <h1 className="text-9xl font-black bg-linear-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2 tracking-tighter">
                404
            </h1>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Halaman Tidak Ditemukan</h2>
            
            <p className="max-w-md mx-auto text-slate-600 mb-8 leading-relaxed">
                Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada. 
                Silakan periksa kembali URL atau kembali ke halaman utama.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                    className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 gap-2 h-12 px-6 text-base shadow-xl shadow-purple-500/20 border-0" 
                    asChild
                >
                    <Link to="/">
                        <Home className="h-4 w-4" />
                        Ke Dashboard
                    </Link>
                </Button>
                <Button variant="outline" className="gap-2 h-12 px-6 text-base border-slate-200 hover:bg-slate-50" asChild>
                    <Link to="/public/putusan">
                        <ArrowLeft className="h-4 w-4" />
                        Portal Publik
                    </Link>
                </Button>
            </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-sm text-slate-400">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Scale className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-slate-500">Pengadilan Tinggi Agama Bandung</span>
            </div>
            &copy; {new Date().getFullYear()} Sistem Manajemen Dokumen Digital
        </div>
    </div>
);

export default NotFoundPage;
