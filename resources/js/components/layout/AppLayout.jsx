import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
    FileText, LayoutDashboard, LogOut, Settings, Scale, 
    UploadCloud, Menu, X, ChevronDown, Zap, BookOpen, Search, ScanText
} from 'lucide-react';
import { logout as logoutRequest } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import clsx from 'clsx';
import { Badge } from '@/components/ui/Badge';

const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard, roles: ['panitera', 'hakim'] },
    { to: '/cases', label: 'Perkara', icon: Scale, roles: ['panitera', 'hakim'] },
    { to: '/documents', label: 'Arsip Dokumen', icon: FileText, roles: ['panitera', 'hakim'] },
    { to: '/legal-advisor', label: 'Asisten Hukum', icon: BookOpen, roles: ['hakim'] },
    { type: 'spacer' },
    { to: '/search', label: 'Pencarian', icon: Search, roles: ['panitera'] },
    { to: '/ocr-only', label: 'OCR Tools', icon: ScanText, roles: ['panitera'] },
    { to: '/documents/upload', label: 'Ringkas Dokumen', icon: UploadCloud, roles: ['panitera'] },
    { to: '/settings', label: 'Pengaturan', icon: Settings, roles: ['panitera'] },
];

const Sidebar = ({ open, setOpen }) => {
    const location = useLocation();
    const role = useAuthStore((state) => state.role);
    const availableItems = navItems.filter((item) => 
        item.type === 'spacer' || (!item.roles || item.roles.includes(role))
    );

    return (
        <>
            {/* Mobile Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    'fixed top-0 left-0 z-50 h-screen w-72 transform transition-all duration-300 md:static md:translate-x-0 md:z-0 md:h-screen',
                    open ? 'translate-x-0' : '-translate-x-full',
                    'bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden'
                )}
            >
                {/* Header with Official PTA Bandung Branding */}
                <div className="px-6 py-8">
                    <div className="flex items-center gap-4">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/95 shadow-lg shadow-yellow-500/20 ring-1 ring-white/10 p-2">
                            <img src="/images/logo-pta.png" alt="Logo PTA Bandung" className="h-full w-full object-contain" />
                            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 flex items-center justify-center">
                                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                                <h1 className="text-lg font-bold text-white tracking-tight leading-none">PTA Digital</h1>
                                <button onClick={() => setOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-[11px] font-semibold text-yellow-400/80 uppercase tracking-wider truncate mt-1.5">Pengadilan Tinggi Agama</p>
                            <p className="text-[10px] font-medium text-slate-500 truncate">Kota Bandung</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-4 overflow-y-auto custom-scrollbar">
                    {availableItems.map((item, index) => {
                        if (item.type === 'spacer') {
                            return <div key={`spacer-${index}`} className="my-4 h-px bg-slate-800/50 mx-2" />;
                        }

                        const Icon = item.icon;
                        const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(`${item.to}/`));

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={clsx(
                                    'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                                    active
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                )}
                            >
                                <Icon className={clsx("h-5 w-5 shrink-0 transition-colors", active ? "text-emerald-400" : "text-slate-500 group-hover:text-white")} />
                                <span>{item.label}</span>
                                {active && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 bg-slate-900 border-t border-slate-800">
                    <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-xs font-medium text-emerald-400">System Online</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                            © 2025 PTA Bandung<br/>
                            v2.0.0
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const role = useAuthStore((state) => state.role);
    const user = useAuthStore((state) => state.user);
    const logoutStore = useAuthStore((state) => state.logout);
    const [signingOut, setSigningOut] = useState(false);
    
    // Quick logout for development
    const handleLogout = async () => {
        setSigningOut(true);
        try { await logoutRequest(); } catch (e) { console.error(e); }
        logoutStore();
        window.location.href = '/login';
    };

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 md:hidden"
                    >
                         {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                    {/* Breadcrumbs or Page Title could go here */}
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Badge variant="secondary" className="hidden sm:flex items-center gap-1.5 py-1 px-2.5 font-normal">
                         <Zap className="h-3 w-3 text-emerald-600 fill-emerald-600" />
                         <span className="capitalize text-slate-600">{role ?? 'Guest'}</span>
                    </Badge>

                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold ring-2 ring-slate-100">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>

                        {userMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-1.5 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-3 py-3 mb-1 bg-slate-50/50 rounded-lg border border-slate-100/50">
                                        <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                    <button 
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium"
                                        onClick={() => window.location.href = '/settings'}
                                    >
                                        <Settings className="h-4 w-4 text-slate-400" />
                                        Settings
                                    </button>
                                    <div className="my-1 h-px bg-slate-100" />
                                    <button
                                        onClick={handleLogout}
                                        disabled={signingOut}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        {signingOut ? 'Signing out...' : 'Sign out'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 font-sans antialiased">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-30">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500 slide-in-from-bottom-4">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppLayout;