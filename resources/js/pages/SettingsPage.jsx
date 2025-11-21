import { useState } from 'react';

const SettingsPage = () => {
    const [autoOcr, setAutoOcr] = useState(true);
    const [autoSummaries, setAutoSummaries] = useState(true);
    const [notificationEmail, setNotificationEmail] = useState('panitera@pta.go.id');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Pengaturan Sistem</h1>
                <p className="text-sm text-slate-600">Atur integrasi otomatis dan notifikasi pipeline.</p>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Automasi pemrosesan</h2>
                <div className="mt-4 space-y-4 text-sm text-slate-700">
                    <label className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">OCR otomatis</p>
                            <p className="text-xs text-slate-500">Jalankan OCR segera setelah dokumen terunggah.</p>
                        </div>
                        <input type="checkbox" checked={autoOcr} onChange={(event) => setAutoOcr(event.target.checked)} />
                    </label>
                    <label className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Ringkasan otomatis</p>
                            <p className="text-xs text-slate-500">Aktifkan pipeline LLM setelah OCR selesai.</p>
                        </div>
                        <input type="checkbox" checked={autoSummaries} onChange={(event) => setAutoSummaries(event.target.checked)} />
                    </label>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Notifikasi</h2>
                <div className="mt-4 space-y-4">
                    <label className="block text-sm">
                        Email notifikasi
                        <input
                            type="email"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={notificationEmail}
                            onChange={(event) => setNotificationEmail(event.target.value)}
                        />
                    </label>
                    <button
                        type="button"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        Simpan perubahan
                    </button>
                </div>
            </section>
        </div>
    );
};

export default SettingsPage;
