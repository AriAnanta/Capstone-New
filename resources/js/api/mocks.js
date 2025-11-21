import { CASE_TYPES } from '@/constants';

const today = new Date().toISOString().slice(0, 10);

export const mockPerkaras = [
    {
        id: 1,
        nomor_perkara: '123/Pdt.G/2024/PTA.JKT',
        jenis_perkara: CASE_TYPES[0].value,
        status: 'processed',
        tanggal_masuk: today,
        pengadilan_asal: 'PA Jakarta Selatan',
        metadata: { nilai_gugatan: '150.000.000' },
        documents: [],
    },
    {
        id: 2,
        nomor_perkara: '456/Pdt.G/2024/PTA.JKT',
        jenis_perkara: CASE_TYPES[2].value,
        status: 'review',
        tanggal_masuk: today,
        pengadilan_asal: 'PA Depok',
        metadata: { penggugat: 'Aisyah' },
        documents: [],
    },
];

export const mockDocuments = [
    {
        id: 10,
        perkara_id: 1,
        jenis_dokumen: 'putusan',
        path_file: 'documents/1/putusan.pdf',
        format_file: 'application/pdf',
        tanggal_upload: today,
        teks_ocr: 'Ini adalah hasil OCR contoh yang memuat pokok perkara secara ringkas.',
        metadata: { halaman: 35 },
        summaries: [
            {
                id: 100,
                tipe_ringkasan: 'internal',
                ringkasan: 'Ringkasan internal contoh.',
                created_at: today,
            },
        ],
        recommendations: [
            {
                id: 200,
                daftar_pasal: [
                    {
                        nama: 'UU Perkawinan',
                        pasal: '39',
                        alasan: 'Mengatur prosedur perceraian dan syarat hakim memutus.'
                    },
                ],
                pertimbangan_llm: 'Gemini merekomendasikan fokus pada Pasal 39 untuk aspek perceraian.',
                created_at: today,
            },
        ],
    },
];

export const mockPublicDecisions = [
    {
        id: 3,
        nomor_perkara: '789/Pdt.G/2023/PTA.JKT',
        jenis_perkara: CASE_TYPES[3].value,
        status: 'published',
        tanggal_masuk: '2023-11-01',
        pengadilan_asal: 'PA Bekasi',
        documents: mockDocuments,
    },
];
