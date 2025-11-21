# PTA Digital Intelligence Platform

Platform ini mendigitalisasi proses Pengadilan Tinggi Agama: dari unggah dokumen perkara, OCR, ringkasan LLM, sampai publikasi putusan ke portal publik. Backend dibangun dengan Laravel 12 + Sanctum, sedangkan frontend memakai React 18 (Vite, Tailwind v4, TanStack Query, Zustand).

## Fitur utama
- Unggah dan kelola perkara, dokumen, serta metadata via REST API.
- Pipeline terotomasi: OCR -> ringkasan Gemini -> rekomendasi dasar hukum, dijalankan lewat job queue.
- Dasbor internal (hakim/panitera) untuk memantau status perkara, dokumen, dan hasil proses AI.
- Form tambah perkara agar panitera dapat mendaftarkan perkara sebelum dokumen diunggah.
- Portal publik dengan subset putusan yang boleh dirilis.
- Penulisan ringkasan manual dan tombol reprocess untuk menjalankan pipeline ulang.
- Autentikasi Sanctum: pengguna masuk dengan email/username + password dan mendapat token Bearer untuk setiap panggilan API.

## Arsitektur singkat

| Lapisan | Rangkuman |
| --- | --- |
| Backend (Laravel) | `app/Http/Controllers` mengekspos resource `perkaras`, `documents`, `summaries`, `regulations`. Model dan relasi berada di `app/Models`, enumerasi tipe di `app/Enums`. Auth via Sanctum + middleware `auth:sanctum`. |
| Pipeline dokumen | `app/Services/DocumentProcessingPipeline` memicu tiga job berantai (`ProcessDocumentOcr`, `GenerateDocumentSummary`, `GenerateLegalReferences`). OCR memanggil executable yang diset di variabel `OCR_PDF_COMMAND`/`OCR_IMAGE_COMMAND`. Ringkasan memakai `app/Services/Llm/GeminiClient`. |
| Frontend (React) | Entrypoint `resources/js/app.jsx` menjalankan router SPA (`resources/js/router.jsx`). State auth tersimpan via `useAuthStore`. Data diambil lewat hooks TanStack Query (`resources/js/api/hooks.js`) yang fallback ke mock saat API belum tersedia. |
| Penyimpanan | File masuk ke `storage/app` (publik lewat `storage:link`). Queue default memakai tabel `jobs` (migration `0001_01_01_000002_create_jobs_table.php`). |

## Persiapan lingkungan

1. **Prasyarat**
	- PHP >= 8.2 + Composer
	- Node.js >= 20 + npm
	- Database MySQL/MariaDB (atau driver lain sesuai `.env`)
	- Eksekutor OCR (contoh: Tesseract CLI) dan API key Gemini

2. **Salin konfigurasi**
	```powershell
	Copy-Item .env.example .env
	```
	Sesuaikan nilai penting:
	- `APP_URL`, `FRONTEND_URL` (opsional jika dipisah)
	- `DB_*`
	- `SANCTUM_STATEFUL_DOMAINS` jika memakai domain berbeda
	- `GEMINI_API_KEY`, `GEMINI_MODEL`
	- `OCR_PDF_COMMAND`, `OCR_IMAGE_COMMAND` (misal `tesseract {input} {output}`)
	- `QUEUE_CONNECTION=database`

3. **Install dependensi**
	```powershell
	composer install
	npm install
	```

4. **Migrasi & seeding**
	```powershell
	php artisan key:generate
	php artisan migrate --seed
	php artisan storage:link
	```
	Seeder membuat akun contoh `hakim@example.com` dan `panitera@example.com` (password: `password`).

5. **Jalankan server lokal**
	Jalankan perintah di terminal terpisah:
	```powershell
	php artisan serve
	php artisan queue:work
	npm run dev
	```
	Frontend Vite otomatis memuat React SPA dan proxy ke Laravel (`/api`).

6. **Build produksi**
	```powershell
	npm run build
	php artisan optimize
	```
	Hasil Vite berada di `public/build`. Pastikan worker antrian berjalan (supervisor/systemd) di lingkungan produksi.

7. **Pengujian**
	```powershell
	php artisan test
	```

## Struktur penting

```
app/
  Enums/           -> Role, jenis perkara, tipe dokumen, dll.
  Http/Controllers -> PerkaraController, DocumentController, SummaryController, dll.
  Jobs/            -> ProcessDocumentOcr, GenerateDocumentSummary, GenerateLegalReferences.
  Services/        -> OcrService, SummarizerService, GeminiClient, LegalReferenceService.
resources/js/
	app.jsx          -> Boot React + QueryClient + Zustand.
  router.jsx       -> ProtectedRoute, public portal, detail dokumen.
  api/             -> Axios client + hooks + mock data.
  pages/           -> Dashboard, Cases, Documents, DocumentDetail, Settings, PublicPortal.
routes/api.php     -> REST API terproteksi Sanctum + endpoint publik.
routes/web.php     -> Blade fallback untuk SPA.
```

## Alur pemrosesan dokumen
1. Admin/panitera mengunggah dokumen melalui endpoint `POST /api/documents` (ditangani `DocumentController@store`). File disimpan, metadata dicatat.
2. `DocumentProcessingPipeline` dijalankan dan mendorong job `ProcessDocumentOcr` ke queue.
3. **ProcessDocumentOcr** menjalankan `OcrService`:
	- Mengecek apakah PDF sudah memiliki teks (hasil ekspor Word, dsb). Jika iya, langkah OCR dilewati dan teks langsung disalin.
	- Jika teks tidak tersedia, menjalankan command OCR sesuai tipe file.
	- Menyimpan teks hasil ekstraksi di kolom `teks_ocr` dokumen.
	- Mem-queue `GenerateDocumentSummary`.
4. **GenerateDocumentSummary** memanggil Gemini melalui `SummarizerService`, menyimpan ringkasan ke tabel `summaries`, lalu mem-queue `GenerateLegalReferences`.
5. **GenerateLegalReferences** menghasilkan referensi peraturan atau rekomendasi hukum tambahan, menyimpannya ke tabel `legal_recommendations`.
6. Dokumentasi siap ditinjau di dasbor. Pengguna dapat:
	- Menambah ringkasan manual via `POST /documents/{id}/summaries`.
	- Menjalankan ulang pipeline via `PATCH /documents/{id}` dengan payload `reprocess: true`.

Antarmuka dashboard telah menyediakan halaman **Dokumen → Unggah Dokumen** yang membungkus alur ini: pengguna memilih perkara, jenis dokumen, metadata opsional, serta file PDF/gambar. Form tersebut memanggil endpoint `POST /api/documents`, menyimpan tag, dan langsung memicu pipeline (OCR → Ringkasan LLM → Rekomendasi hukum) tanpa perlu menggunakan API client terpisah.

Jika dropdown perkara kosong, buka **Cases → Tambah Perkara** untuk mendaftarkan nomor perkara terlebih dahulu. Setelah tersimpan, daftar tersebut otomatis muncul di form unggah.

Halaman detail dokumen memperlihatkan status masing-masing tahap (OCR, ringkasan, rekomendasi Gemini), menampilkan teks OCR penuh, daftar ringkasan, serta daftar rekomendasi hukum yang dihasilkan Gemini agar hakim dapat meninjau hasil AI sebelum publikasi.

## Frontend flow singkat
- Pengguna memasukkan email/username + password di halaman login, token hasil `POST /api/login` disimpan di Zustand + localStorage.
- `ProtectedRoute` memastikan halaman internal hanya muncul setelah autentikasi.
- Data tabel memakai hooks React Query (`usePerkaras`, `useDocuments`, `usePublicDecisions`). Saat API gagal, otomatis fallback ke `resources/js/api/mocks.js` agar tampilan tetap demo-ready.
- Halaman kunci:
  - **Dashboard**: ringkasan perkara/dokumen + distribusi jenis perkara.
  - **Cases**: tabel perkara + filter jenis.
	- **Case Create**: form pembuatan perkara baru (nomor, jenis, status, metadata) sebelum upload dokumen.
	- **Documents**: daftar dokumen dengan filter tipe, tombol "Unggah dokumen", dan tautan detail.
	- **Document Upload**: form unggah yang otomatis menjalankan pipeline begitu file masuk.
	- **Document Detail**: metadata, histori ringkasan, status pipeline OCR→LLM, teks OCR lengkap, rekomendasi Gemini, form ringkasan manual, tombol proses ulang.
  - **Public Portal**: daftar putusan yang statusnya publik.

## Autentikasi API
- Endpoint `POST /api/login` menerima `identifier` (email atau username) dan `password`. Jika valid, backend mengembalikan `token` dan objek `user`.
- Token disimpan front-end di Zustand + `localStorage` dan dikirim sebagai header `Authorization: Bearer <token>` oleh `apiClient`.
- Endpoint `GET /api/me` mengembalikan profil pengguna aktif untuk kebutuhan klien lain.
- Endpoint `POST /api/logout` (wajib header Bearer) mencabut token aktif melalui Sanctum. Frontend memanggil endpoint ini dari tombol "Keluar" di header aplikasi.
- Setiap respons `401` otomatis memanggil `useAuthStore.getState().logout()` agar sesi lokal bersih.

## Operasional & tips
- Jalankan `php artisan queue:failed` untuk memantau kegagalan job. Gunakan `php artisan queue:retry {id}` setelah perbaikan.
- Pastikan command OCR memiliki hak akses baca file di `storage/app`. Jika menggunakan tool eksternal, bungkus path dengan tanda kutip untuk Windows.
- Untuk integrasi auth produksi, ganti mekanisme mock login di `resources/js/store/authStore.js` dengan call nyata ke endpoint Sanctum login dan simpan token.
- Sesuaikan policy publikasi putusan di `PublicDecisionController` agar hanya menampilkan dokumen yang sudah lolos verifikasi.

## Lisensi
Kode ini mengikuti lisensi proyek induk (MIT). Lihat file `LICENSE` bila diperlukan.
