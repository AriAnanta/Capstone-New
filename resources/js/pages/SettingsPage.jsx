import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/api/client';
import {
    User, Lock, Bell, Shield, Mail, Phone, MapPin,
    Save, AlertCircle, CheckCircle2, Eye, EyeOff, Camera, ChevronRight, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import clsx from 'clsx';

const SettingsPage = () => {
    const user = useAuthStore((state) => state.user);
    const role = useAuthStore((state) => state.role);
    const updateUser = useAuthStore((state) => state.setUser);
    
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });
    
    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const tabs = [
        { id: 'profile', label: 'Profil Saya', description: 'Kelola informasi pribadi anda', icon: User },
        { id: 'security', label: 'Keamanan Akun', description: 'Update password dan keamanan', icon: Lock },
        { id: 'notifications', label: 'Notifikasi', description: 'Atur preferensi notifikasi', icon: Bell },
    ];

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await apiClient.put('/user/profile', profileForm);
            updateUser(response.data.user);
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal memperbarui profil.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok!' });
            return;
        }
        if (passwordForm.new_password.length < 8) {
            setMessage({ type: 'error', text: 'Password minimal 8 karakter!' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await apiClient.put('/user/password', {
                current_password: passwordForm.current_password,
                password: passwordForm.new_password,
                password_confirmation: passwordForm.new_password_confirmation,
            });
            setMessage({ type: 'success', text: 'Password berhasil diubah!' });
            setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal mengubah password.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-violet-50/30 to-purple-50/30 pt-6 px-4 sm:px-8 pb-12">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-8 shadow-2xl shadow-violet-500/20 mb-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                
                {/* Floating decorative elements */}
                <div className="absolute top-4 right-[10%] w-32 h-32 bg-white/10 rounded-full blur-3xl floating-slow" />
                <div className="absolute bottom-4 left-1/4 w-24 h-24 bg-fuchsia-300/20 rounded-full blur-2xl floating-delayed" />
                
                <div className="relative flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg border border-white/20">
                        <Settings className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
                            <User className="h-3.5 w-3.5" />
                            Pengaturan Akun
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-1">Pengaturan</h1>
                        <p className="text-violet-50 text-lg">Kelola preferensi akun dan keamanan anda</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Content wrapper removed the old header */}

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group",
                                    isActive 
                                        ? "bg-white shadow-sm ring-1 ring-emerald-500/20" 
                                        : "hover:bg-white/60 hover:shadow-sm"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={clsx(
                                        "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                                        isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500 group-hover:bg-white"
                                    )}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className={clsx("text-sm font-semibold", isActive ? "text-slate-900" : "text-slate-600")}>{tab.label}</p>
                                    </div>
                                </div>
                                {isActive && <ChevronRight className="h-4 w-4 text-emerald-500" />}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm relative overflow-hidden">
                        {message.text && (
                            <div className={clsx(
                                "absolute top-0 inset-x-0 p-4 flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-full z-10",
                                message.type === 'success' ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                            )}>
                                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                {message.text}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="animate-in fade-in duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                         <div className="relative group cursor-pointer">
                                            <div className="h-16 w-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold ring-4 ring-white shadow-lg">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="h-5 w-5 text-white" />
                                            </div>
                                         </div>
                                         <div>
                                             <CardTitle>Profil Saya</CardTitle>
                                             <CardDescription>
                                                 {user?.email} • <span className="capitalize text-emerald-600 font-medium">{role}</span>
                                             </CardDescription>
                                         </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Nama Lengkap</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                    <Input 
                                                        className="pl-9" 
                                                        value={profileForm.name}
                                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                    <Input 
                                                        type="email" 
                                                        className="pl-9"
                                                        value={profileForm.email}
                                                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Nomor Telepon</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                    <Input 
                                                        className="pl-9"
                                                        value={profileForm.phone}
                                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label>Alamat</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                    <Input 
                                                        className="pl-9"
                                                        value={profileForm.address}
                                                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button type="submit" isLoading={loading}>
                                                <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="animate-in fade-in duration-300">
                                <CardHeader>
                                    <CardTitle>Keamanan & Password</CardTitle>
                                    <CardDescription>Pastikan akun anda aman dengan password yang kuat.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-lg">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Password Saat Ini</Label>
                                                <div className="relative">
                                                    <Input 
                                                        type={showPasswords.current ? "text" : "password"}
                                                        value={passwordForm.current_password}
                                                        onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                                                    />
                                                    <button type="button" onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                                                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Password Baru</Label>
                                                <div className="relative">
                                                    <Input 
                                                        type={showPasswords.new ? "text" : "password"}
                                                        value={passwordForm.new_password}
                                                        onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                                                    />
                                                    <button type="button" onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                                                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Konfirmasi Password Baru</Label>
                                                <div className="relative">
                                                    <Input 
                                                        type={showPasswords.confirm ? "text" : "password"}
                                                        value={passwordForm.new_password_confirmation}
                                                        onChange={(e) => setPasswordForm({...passwordForm, new_password_confirmation: e.target.value})}
                                                    />
                                                    <button type="button" onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                                                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <p className="text-xs font-semibold text-slate-700 mb-2">Persyaratan Keamanan:</p>
                                            <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                                                <li>Minimal 8 karakter</li>
                                                <li>Gunakan kombinasi huruf dan angka</li>
                                                <li>Hindari penggunaan data pribadi (seperti tgl lahir)</li>
                                            </ul>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <Button type="submit" isLoading={loading} variant="primary">
                                                Ubah Password
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="animate-in fade-in duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-5 w-5 text-amber-500" />
                                        <div>
                                            <CardTitle>Preferensi Notifikasi</CardTitle>
                                            <CardDescription>Pilih bagaimana anda ingin menerima pemberitahuan.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {['Email', 'Dokumen Baru', 'Status Perkara'].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-sm hover:border-slate-200 transition-all bg-slate-50/50">
                                                <div>
                                                    <p className="font-medium text-slate-900">Notifikasi {item}</p>
                                                    <p className="text-xs text-slate-500">Terima update seputar {item.toLowerCase()}</p>
                                                </div>
                                                 <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked={idx < 2} />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
            </div>
        </div>
    );
};

export default SettingsPage;
