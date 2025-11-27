import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
    FileText, LayoutDashboard, LogOut, Settings, Users, Scale, 
    UploadCloud, Menu, X, ChevronDown, Zap, Bell, Search
} from 'lucide-react';
import { logout as logoutRequest } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import clsx from 'clsx';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['panitera', 'hakim'] },
    { to: '/cases', label: 'Perkara', icon: Scale, roles: ['panitera', 'hakim'] },
    { to: '/documents', label: 'Dokumen', icon: FileText, roles: ['panitera', 'hakim'] },
    { to: '/documents/upload', label: 'Unggah Dokumen', icon: UploadCloud, roles: ['panitera'] },
    { to: '/settings', label: 'Pengaturan', icon: Settings, roles: ['panitera'] },
];

const Sidebar = ({ open, setOpen }) => {
    const location = useLocation();
    const role = useAuthStore((state) => state.role);
    const user = useAuthStore((state) => state.user);
    const availableItems = navItems.filter((item) => !item.roles || item.roles.includes(role));

    return (
        <>
            {/* Mobile Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    'fixed top-0 left-0 z-50 h-screen w-64 transform transition-transform duration-300 md:static md:translate-x-0 md:z-0 md:h-screen',
                    open ? 'translate-x-0' : '-translate-x-full',
                    'bg-linear-to-b from-slate-900 via-slate-800/95 to-slate-900 border-r border-slate-700/50 flex flex-col overflow-hidden shadow-2xl'
                )}
            >
                {/* Header */}
                <div className="border-b border-slate-700/50 bg-linear-to-r from-emerald-600/20 to-teal-600/20 backdrop-blur px-6 py-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/40">
                                <Scale className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-emerald-300">Sistem</div>
                                <h1 className="text-lg font-bold text-white">PTA</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="md:hidden p-1 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-slate-300" />
                        </button>
                    </div>
                    <p className="text-xs text-slate-400">Pengadilan Tinggi Agama Bandung</p>
                </div>

                {/* User Profile */}
                <div className="border-b border-slate-700/50 px-6 py-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/40 border border-slate-600/50 hover:border-emerald-500/30 transition-all">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg font-bold text-white text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.name ?? 'User'}</p>
                            <p className="text-xs text-emerald-300 capitalize font-medium">{role ?? 'user'}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                    {availableItems.map((item) => {
                        const Icon = item.icon;
                        const active =
                            location.pathname === item.to ||
                            (item.to !== '/' && location.pathname.startsWith(`${item.to}/`));

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                                    active
                                        ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                )}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span>{item.label}</span>
                                {active && (
                                    <div className="ml-auto h-2 w-2 rounded-full bg-white shadow-lg" />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-slate-700/50 p-4 bg-linear-to-t from-slate-900 to-slate-800/50">
                    <div className="rounded-lg bg-slate-700/40 border border-slate-600/50 p-3 text-center">
                        <p className="text-xs text-slate-400">© 2025</p>
                        <p className="text-xs font-semibold text-emerald-300">v1.0.0</p>
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

    const handleLogout = async () => {
        setSigningOut(true);
        try {
            await logoutRequest();
        } catch (error) {
            console.warn('Logout failed', error);
        } finally {
            logoutStore();
            window.location.href = '/login';
        }
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-sm h-16">
            <div className="flex items-center justify-between px-4 py-0 sm:px-6 lg:px-8 h-full">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                    >
                        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    {/* Logo for Mobile */}
                    <div className="md:hidden flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-600 to-teal-600 shadow-lg">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 hidden sm:inline">PTA</span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                    {/* Search Bar - Hidden on Mobile */}
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 border border-slate-200">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari..."
                            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                        />
                    </div>

                    {/* Status Badge */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r from-emerald-100 to-teal-100 border border-emerald-200 shadow-sm">
                        <Zap className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 capitalize">{role ?? 'User'}</span>
                    </div>

                    {/* Notifications */}
                    <button className="hidden sm:flex p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors group"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-md">
                                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name ?? 'User'}</p>
                                <p className="text-xs text-slate-500">{user?.email}</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                        </button>

                        {/* Dropdown Menu */}
                        {userMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    <p className="text-xs text-emerald-600 font-medium capitalize mt-1">{role}</p>
                                </div>

                                {/* Menu Items */}
                                <button
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                    <Settings className="h-4 w-4" />
                                    Pengaturan Akun
                                </button>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    disabled={signingOut}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50 mt-1"
                                >
                                    <LogOut className="h-4 w-4" />
                                    {signingOut ? 'Keluar...' : 'Keluar'}
                                </button>
                            </div>
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
        <div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="px-4 py-6 sm:px-6 lg:px-8 pb-20">
                        <div className="max-w-7xl mx-auto w-full">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppLayout;