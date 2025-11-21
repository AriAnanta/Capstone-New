import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { FileText, LayoutDashboard, LogOut, Settings, Users, Scale } from 'lucide-react';
import { logout as logoutRequest } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import clsx from 'clsx';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cases', label: 'Perkara', icon: Scale },
    { to: '/documents', label: 'Dokumen', icon: FileText },
    { to: '/settings', label: 'Pengaturan', icon: Settings },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur md:block">
            <div className="px-6 py-5">
                <div className="text-sm font-semibold text-slate-500">PTA Digital</div>
                <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
            </div>
            <nav className="space-y-1 px-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.to;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={clsx(
                                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100',
                                active ? 'bg-slate-900 text-white hover:bg-slate-900' : 'text-slate-600',
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

const Header = () => {
    const role = useAuthStore((state) => state.role);
    const user = useAuthStore((state) => state.user);
    const [signingOut, setSigningOut] = useState(false);

    const handleLogout = async () => {
        setSigningOut(true);
        try {
            await logoutRequest();
        } finally {
            setSigningOut(false);
        }
    };

    return (
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur">
            <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Peran aktif</p>
                <p className="text-sm font-semibold text-slate-900">{role ?? 'Tidak diketahui'}</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4" />
                    {user?.name ?? 'User'}
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={signingOut}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-70"
                >
                    <LogOut className="h-4 w-4" />
                    {signingOut ? 'Keluar...' : 'Keluar'}
                </button>
            </div>
        </header>
    );
};

const AppLayout = () => (
    <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex flex-1 flex-col">
            <Header />
            <div className="flex-1 space-y-6 px-4 py-6">
                <Outlet />
            </div>
        </main>
    </div>
);

export default AppLayout;
