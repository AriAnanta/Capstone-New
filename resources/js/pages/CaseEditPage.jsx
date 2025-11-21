import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CASE_TYPES } from '@/constants';
import { usePerkara, useUpdatePerkara } from '@/api/hooks';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'Review' },
    { value: 'processed', label: 'Diproses' },
    { value: 'published', label: 'Publik' },
];

const CaseEditPage = () => {
    const navigate = useNavigate();
    const { caseId } = useParams();
    const { data: perkara, isLoading } = usePerkara(caseId);
    const updatePerkara = useUpdatePerkara();

    const [nomorPerkara, setNomorPerkara] = useState('');
    const [jenisPerkara, setJenisPerkara] = useState(CASE_TYPES[0]?.value ?? 'cerai_talak');
    const [status, setStatus] = useState(STATUS_OPTIONS[0].value);
    const [tanggalMasuk, setTanggalMasuk] = useState('');
    const [pengadilanAsal, setPengadilanAsal] = useState('');
    const [catatan, setCatatan] = useState('');
    const [nilaiGugatan, setNilaiGugatan] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!perkara) return;
        setNomorPerkara(perkara.nomor_perkara ?? '');
        setJenisPerkara(perkara.jenis_perkara ?? CASE_TYPES[0]?.value ?? 'cerai_talak');
        setStatus(perkara.status ?? STATUS_OPTIONS[0].value);
        setTanggalMasuk(perkara.tanggal_masuk ?? '');
        setPengadilanAsal(perkara.pengadilan_asal ?? '');
        setCatatan(perkara.metadata?.catatan_internal ?? '');
        setNilaiGugatan(perkara.metadata?.nilai_gugatan ?? '');
    }, [perkara]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (!nomorPerkara.trim()) {
            setError('Nomor perkara wajib diisi.');
            return;
        }

        updatePerkara.mutate(
            {
                id: caseId,
                nomor_perkara: nomorPerkara,
                jenis_perkara: jenisPerkara,
                status,
                tanggal_masuk: tanggalMasuk || null,
                pengadilan_asal: pengadilanAsal || null,
                metadata: {
                    nilai_gugatan: nilaiGugatan || undefined,
                    catatan_internal: catatan || undefined,
                },
            },
            {
                onSuccess: () => navigate('/cases'),
                onError: (apiError) => {
                    const message =
                        apiError.response?.data?.message ||
                        apiError.response?.data?.errors?.nomor_perkara?.[0] ||
                        'Gagal memperbarui perkara.';
                    setError(message);
                },
            },
        );
    };

    if (isLoading && !perkara) {
        return <p className="text-sm text-slate-600">Memuat data perkara...</p>;
    }

    if (!perkara) {
        return (
            <div className="space-y-3">
                <p className="text-sm text-slate-600">Perkara tidak ditemukan.</p>
                <Link to="/cases" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                    Kembali ke daftar perkara
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Perkara</h1>
                    <p className="text-sm text-slate-600">Perbarui informasi perkara #{perkara.nomor_perkara}.</p>
                </div>
                <Link
                    to="/cases"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Kembali ke daftar
                </Link>
            </div>

            <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    <label className="text-sm text-slate-600">
                        Nomor perkara
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={nomorPerkara}
                            onChange={(event) => setNomorPerkara(event.target.value.toUpperCase())}
                            placeholder="123/Pdt.G/2025/PTA.JKT"
                        />
                    </label>
                    <label className="text-sm text-slate-600">
                        Jenis perkara
                        <select
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={jenisPerkara}
                            onChange={(event) => setJenisPerkara(event.target.value)}
                        >
                            {CASE_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <label className="text-sm text-slate-600">
                        Status
                        <select
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                        >
                            {STATUS_OPTIONS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="text-sm text-slate-600">
                        Tanggal masuk
                        <input
                            type="date"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={tanggalMasuk ?? ''}
                            onChange={(event) => setTanggalMasuk(event.target.value)}
                        />
                    </label>
                    <label className="text-sm text-slate-600">
                        Pengadilan asal
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={pengadilanAsal}
                            onChange={(event) => setPengadilanAsal(event.target.value)}
                            placeholder="PA Jakarta Selatan"
                        />
                    </label>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <label className="text-sm text-slate-600">
                        Nilai gugatan (opsional)
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={nilaiGugatan}
                            onChange={(event) => setNilaiGugatan(event.target.value)}
                            placeholder="Contoh: 150.000.000"
                        />
                    </label>
                    <label className="text-sm text-slate-600">
                        Catatan internal (opsional)
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                            value={catatan}
                            onChange={(event) => setCatatan(event.target.value)}
                            placeholder="Prioritas hakim, berkas belum lengkap, dll"
                        />
                    </label>
                </div>

                {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={updatePerkara.isPending}
                        className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-70"
                    >
                        {updatePerkara.isPending ? 'Menyimpan...' : 'Simpan perubahan'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/cases')}
                        className="rounded-lg border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Batalkan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CaseEditPage;
