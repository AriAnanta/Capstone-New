const STATUS_COLORS = {
    draft: 'bg-slate-100 text-slate-600',
    review: 'bg-amber-100 text-amber-700',
    processed: 'bg-sky-100 text-sky-700',
    published: 'bg-emerald-100 text-emerald-700',
    'VERIFIKASI_BERKAS': 'bg-indigo-100 text-indigo-700',
    'PROSES_PEMERIKSAAN': 'bg-sky-100 text-sky-700',
    'MUSYAWARAH': 'bg-amber-100 text-amber-700',
    'PUTUSAN': 'bg-emerald-100 text-emerald-700',
    'BANDING': 'bg-fuchsia-100 text-fuchsia-700',
};

export const getStatusClass = (status) => STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-600';
