# Dokumentasi Teknologi & Tools

## 📋 Daftar Isi
- [Backend Framework](#backend-framework)
- [Frontend Framework](#frontend-framework)
- [Database](#database)
- [Queue System](#queue-system)
- [AI & Machine Learning](#ai--machine-learning)
- [OCR (Optical Character Recognition)](#ocr-optical-character-recognition)
- [PDF Processing](#pdf-processing)
- [Authentication & Security](#authentication--security)
- [Development Tools](#development-tools)

---

## Backend Framework

### Laravel 12
- **Versi**: ^12.0
- **Bahasa**: PHP ^8.2
- **Penggunaan**: Framework utama backend untuk routing, controller, model, middleware, dan business logic
- **File Config**: 
  - `config/app.php`
  - `config/services.php`
  - `routes/api.php`, `routes/web.php`

**Fitur yang Menggunakan**:
- Semua endpoint API
- Authentication & Authorization
- Database ORM (Eloquent)
- Validation & Request handling
- Job queue processing
- File storage management

---

## Frontend Framework

### React 18
- **Versi**: ^18.3.1
- **Penggunaan**: Library utama untuk membangun user interface
- **File Config**: `package.json`

**Komponen Utama**:
- `DocumentDetailPage.jsx` - Detail dokumen dengan auto-refresh
- `AdvancedSearchPage.jsx` - Pencarian lanjutan dengan filter
- `PublicPortalPage.jsx` - Portal publik untuk akses tanpa login
- `OcrOnlyPage.jsx` - Upload dan proses OCR tanpa perkara
- `LegalAdvisorPage.jsx` - Asisten hukum AI

### React Router v6
- **Versi**: ^6.28.0
- **Penggunaan**: Routing dan navigasi SPA
- **File**: `resources/js/router.jsx`

### TanStack Query
- **Versi**: ^5.59.0
- **Penggunaan**: Data fetching, caching, dan synchronization
- **File**: `resources/js/api/hooks.js`

**Fitur**:
- Auto-refresh setiap 3 detik untuk dokumen yang sedang diproses
- Cache management
- Optimistic updates
- Background refetching

### Tailwind CSS
- **Versi**: ^4.0.0
- **Penggunaan**: Utility-first CSS framework
- **File Config**: `vite.config.js`

**Design System**:
- Gradient headers dengan pattern overlay
- Badge system dengan backdrop blur
- Responsive grid layouts
- Custom color themes per page

### Lucide React
- **Versi**: ^0.469.0
- **Penggunaan**: Icon library
- **Contoh**: `FileText`, `Search`, `Scale`, `Globe`, `RefreshCw`

### Zustand
- **Versi**: ^5.0.0
- **Penggunaan**: State management untuk authentication
- **File**: `resources/js/store/authStore.js`

### Vite
- **Versi**: ^7.0.7
- **Penggunaan**: Build tool dan development server
- **File Config**: `vite.config.js`

---

## Database

### SQLite (Default)
- **Driver**: sqlite
- **Penggunaan**: Database utama untuk development dan production
- **File Database**: `database/database.sqlite`
- **File Config**: `config/database.php`

**Alternatif yang Didukung**:
- MySQL/MariaDB
- PostgreSQL

**Models**:
- `Document` - Dokumen perkara
- `Perkara` - Data perkara/kasus
- `Summary` - Ringkasan dokumen (internal, ringkas, publik)
- `LlmRecommendation` - Rekomendasi pasal dari AI
- `Regulation` - Database peraturan dan pasal hukum
- `OcrDocument` - Dokumen OCR-only (tanpa perkara)
- `Tag` - Tag untuk kategorisasi
- `User` - Data pengguna

---

## Queue System

### Laravel Queue (Database Driver)
- **Driver**: database
- **Penggunaan**: Background job processing untuk task yang memakan waktu
- **File Config**: `config/queue.php`
- **Table**: `jobs`, `failed_jobs`

**Jobs yang Berjalan**:

#### 1. ProcessDocumentOcr
- **File**: `app/Jobs/ProcessDocumentOcr.php`
- **Fungsi**: Ekstraksi teks dari dokumen (PDF/Image)
- **Teknologi**: Tesseract OCR, PDFParser
- **Trigger**: Upload dokumen baru

#### 2. GenerateDocumentSummary
- **File**: `app/Jobs/GenerateDocumentSummary.php`
- **Fungsi**: Generate 3 tipe ringkasan (internal, ringkas, publik)
- **Teknologi**: Google Gemini AI
- **Trigger**: Setelah OCR selesai

#### 3. GenerateLegalReferences
- **File**: `app/Jobs/GenerateLegalReferences.php`
- **Fungsi**: Identifikasi pasal-pasal hukum yang relevan
- **Teknologi**: Google Gemini AI + Database Regulations
- **Trigger**: Setelah OCR selesai

**Command untuk Menjalankan Queue**:
```bash
php artisan queue:listen --tries=1
```

---

## AI & Machine Learning

### Google Gemini AI
- **Model**: gemini-1.5-flash (default) / gemini-1.5-pro
- **Penggunaan**: Generative AI untuk summarization dan legal analysis
- **File Service**: `app/Services/Llm/GeminiClient.php`
- **Config**: `config/services.php`

**Environment Variables**:
```env
GEMINI_API_KEY=your_key_here
GEMINI_API_KEY_2=your_backup_key  # Optional untuk load balancing
GEMINI_API_KEY_3=your_backup_key_2
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TIMEOUT=60
```

**Fitur yang Menggunakan**:

#### 1. Document Summarization (`SummarizerService`)
- **File**: `app/Services/Summarization/SummarizerService.php`
- **Output**: 3 tipe ringkasan
  - `internal` - Ringkasan detail untuk internal (hakim, panitera)
  - `ringkas` - Ringkasan singkat untuk review cepat
  - `publik` - Ringkasan untuk publikasi umum (privasi-aware)
- **Prompt Engineering**: Custom prompts per tipe ringkasan
- **Max Tokens**: ~2000 untuk input, ~500-1000 untuk output

#### 2. Legal Reference Generation (`LegalReferenceService`)
- **File**: `app/Services/LegalReferenceService.php`
- **Fungsi**: 
  - Ekstrak pasal yang disebutkan dalam putusan
  - Cocokkan dengan database regulations
  - Generate reasoning/alasan per pasal
  - Berikan pertimbangan AI untuk kasus
- **Input**: Teks OCR + Database regulations (filtered by case type)
- **Output**: Array of pasal dengan nama, nomor pasal, dan alasan

#### 3. Legal Advisor (Interactive AI)
- **File**: `app/Services/LegalAdvisorService.php`
- **Fungsi**: Asisten interaktif untuk rekomendasi pasal
- **Input**: Jenis perkara + konteks opsional
- **Output**: Daftar pasal yang relevan dengan penjelasan
- **Controller**: `app/Http/Controllers/LegalAdvisorController.php`

**Fitur Khusus**:
- **Load Balancing**: Rotasi otomatis antar multiple API keys
- **Retry Logic**: Auto-retry dengan exponential backoff
- **Token Management**: Deteksi dan handle token limit errors
- **JSON Response Parsing**: Auto-extract JSON dari markdown code blocks
- **Confidence Scoring**: AI memberikan confidence level pada output

---

## OCR (Optical Character Recognition)

### Tesseract OCR
- **Versi**: 5.x
- **Bahasa**: Indonesia + English (`ind+eng`)
- **Penggunaan**: Ekstraksi teks dari gambar dan PDF hasil scan
- **File Service**: `app/Services/Ocr/OcrService.php`

**Environment Variables**:
```env
TESSERACT_PATH="C:\Program Files\Tesseract-OCR\tesseract.exe"
TESSERACT_LANG=ind+eng
TESSERACT_OEM=3  # OCR Engine Mode (3 = Default, based on what's available)
TESSERACT_PSM=3  # Page Segmentation Mode (3 = Fully automatic page segmentation)
```

**Konfigurasi OCR**:
- **OEM (OCR Engine Mode)**: 3 (Default - LSTM atau Legacy)
- **PSM (Page Segmentation Mode)**: 3 (Automatic page segmentation)
- **Languages**: ind (Indonesia) + eng (English)

**Fitur OCR Service**:

#### 1. Smart Text Extraction
- **Cek Embedded Text**: Coba extract text dari PDF native terlebih dahulu
- **Quality Check**: Validasi kualitas text (min 300 char/page)
- **Fallback to OCR**: Jika embedded text tidak ada/buruk, gunakan OCR

#### 2. PDF Processing Pipeline
```
PDF Input
    ↓
Check Embedded Text (PDFParser)
    ↓
Quality Check (<300 char/page?)
    ↓ (Yes: Bad Quality)
Convert PDF to Images (pdftoppm)
    ↓
OCR Each Image (Tesseract)
    ↓
Merge Text from All Pages
    ↓
Final Output
```

#### 3. Image Processing
- **Format Support**: JPG, JPEG, PNG
- **Direct OCR**: Langsung proses dengan Tesseract
- **Command**: `tesseract {input} {output} -l ind+eng --oem 3 --psm 3`

#### 4. Multi-Page Support
- Ekstrak text per halaman
- Merge dengan separator `\n\n=== Page X ===\n\n`

**Dependencies**:
- **Tesseract OCR**: Harus diinstall di sistem
- **pdftoppm**: Untuk convert PDF ke images (biasanya termasuk dalam poppler-utils)
- **ImageMagick**: Optional, untuk preprocessing gambar

**Fitur yang Menggunakan**:
- Upload dokumen baru (via `ProcessDocumentOcr` job)
- OCR-only feature (`OcrOnlyController`)
- Re-process OCR untuk dokumen lama

---

## PDF Processing

### Smalot PDFParser
- **Package**: `smalot/pdfparser` ^2.9
- **Penggunaan**: Ekstraksi teks dari PDF yang memiliki embedded text
- **File Service**: `app/Services/Ocr/OcrService.php`

**Fungsi**:
- Parse PDF files
- Extract embedded text
- Get page count
- Get metadata (title, author, etc)

**Kelebihan**:
- Cepat (tidak perlu OCR untuk PDF native)
- Akurat untuk PDF yang di-generate dari text
- Preserve formatting

**Limitasi**:
- Tidak bisa extract text dari PDF hasil scan
- Tidak bisa process PDF image-only

**Fallback Strategy**:
```php
// 1. Try PDFParser first (fast)
$embeddedText = $pdfParser->parseFile($path)->getText();

// 2. Check quality
if (strlen($embeddedText) < 300 * $pageCount) {
    // 3. Fallback to Tesseract OCR
    $ocrText = $this->extractTextFromScannedPdf($path);
}
```

---

## Authentication & Security

### Laravel Sanctum
- **Versi**: ^4.0
- **Penggunaan**: API authentication dengan token
- **File Config**: `config/sanctum.php`

**Fitur**:
- Token-based authentication
- SPA authentication
- API token management
- CSRF protection

**Tokens**:
- **personal_access_tokens** table
- Token abilities/scopes
- Token expiration
- Token revocation

### Middleware
- **auth:sanctum** - Require authentication
- **guest** - Hanya untuk guest users
- **role:admin,staff** - Role-based authorization

**User Roles**:
- `admin` - Full access
- `hakim` - Judge role
- `panitera` - Clerk role
- `staff` - General staff

---

## Development Tools

### Composer
- **Penggunaan**: PHP dependency management
- **File**: `composer.json`

**Dev Dependencies**:
- **Laravel Pint**: Code style fixer
- **Laravel Sail**: Docker environment
- **Laravel Pail**: Log viewer
- **PHPUnit**: Testing framework
- **Faker**: Fake data generator

### NPM
- **Penggunaan**: JavaScript dependency management
- **File**: `package.json`

**Scripts**:
```bash
npm run dev   # Development server (Vite)
npm run build # Production build
```

### Concurrently
- **Versi**: ^9.0.1
- **Penggunaan**: Run multiple commands simultaneously
- **File**: `composer.json` scripts

**Development Command**:
```bash
composer dev
```

Menjalankan secara paralel:
1. `php artisan serve` - Laravel server
2. `php artisan queue:listen` - Queue worker
3. `php artisan pail` - Log viewer
4. `npm run dev` - Vite dev server

### Axios
- **Versi**: ^1.11.0
- **Penggunaan**: HTTP client untuk API calls
- **File**: `resources/js/api/`

**Features**:
- Interceptors untuk auth token
- Error handling
- Request/response transformation
- Timeout configuration

### Day.js
- **Versi**: ^1.11.11
- **Penggunaan**: Date manipulation dan formatting
- **File**: `resources/js/utils/format.js`

---

## Fitur-Fitur Utama & Teknologi yang Digunakan

### 1. OCR Only
**Controller**: `OcrOnlyController.php`

**Teknologi**:
- ✅ Tesseract OCR
- ✅ Smalot PDFParser
- ✅ Laravel Queue (ProcessOcrDocumentOnly job)
- ✅ File Storage System

**Flow**:
1. Upload file (PDF/Image)
2. Store di `storage/app/public/ocr-documents`
3. Dispatch job `ProcessOcrDocumentOnly`
4. Extract text dengan OcrService
5. Save hasil OCR ke database (`ocr_documents` table)

### 2. Document Management
**Controller**: `DocumentController.php`

**Teknologi**:
- ✅ Tesseract OCR
- ✅ Smalot PDFParser
- ✅ Google Gemini AI (summarization)
- ✅ Laravel Queue (3 jobs: OCR, Summary, Legal References)
- ✅ Eloquent ORM

**Pipeline** (`DocumentProcessingPipeline.php`):
```
Upload → OCR Job → Summarization Job → Legal References Job
```

**Auto-Refresh**: Frontend polling setiap 3 detik untuk cek status processing

### 3. Advanced Search
**Controller**: `SearchController.php`

**Teknologi**:
- ✅ Eloquent Query Builder
- ✅ Database LIKE queries
- ✅ Full-text search (untuk MySQL/PostgreSQL)
- ✅ Tag system
- ✅ Multi-source search (Documents + OCR-only)

**Filter Options**:
- Jenis Perkara
- Jenis Dokumen
- Kategori OCR
- Source (Documents/OCR-only/All)

### 4. Legal Advisor (AI Assistant)
**Controller**: `LegalAdvisorController.php`
**Service**: `LegalAdvisorService.php`

**Teknologi**:
- ✅ Google Gemini AI
- ✅ Regulations Database
- ✅ Context-aware recommendations
- ✅ Case-type specific filtering

**Input**:
- Jenis perkara (wajib)
- Konteks kasus (opsional)

**Output**:
- List pasal yang relevan
- Penjelasan per pasal
- Pertimbangan hukum

### 5. Public Portal
**Controller**: `PublicDecisionController.php`
**Page**: `PublicPortalPage.jsx`

**Teknologi**:
- ✅ React 18
- ✅ TanStack Query
- ✅ Public-only summaries
- ✅ No authentication required

**Fitur**:
- Search & filter putusan
- Card-based layout
- Ringkasan publik only
- Status publikasi

### 6. Document Summarization
**Service**: `SummarizerService.php`
**Job**: `GenerateDocumentSummary.php`

**Teknologi**:
- ✅ Google Gemini AI
- ✅ Custom prompts per summary type
- ✅ Context-aware (case type, document type)

**Output Types**:
- `internal` - Detail lengkap
- `ringkas` - Summary singkat
- `publik` - Privacy-aware untuk publik

### 7. Legal References
**Service**: `LegalReferenceService.php`
**Job**: `GenerateLegalReferences.php`

**Teknologi**:
- ✅ Google Gemini AI
- ✅ Regulations database matching
- ✅ Context injection (case type)

**Process**:
1. Load regulations by case type (limit 20)
2. Build prompt dengan context
3. Call Gemini untuk ekstraksi pasal
4. Parse JSON response
5. Save ke `llm_recommendations` table

### 8. User Management
**Controller**: `UserController.php`
**Auth**: `AuthController.php`

**Teknologi**:
- ✅ Laravel Sanctum
- ✅ Token authentication
- ✅ Role-based access control
- ✅ Password hashing (bcrypt)

---

## Environment Configuration

### Required Environment Variables

```env
# Application
APP_NAME="Sistem Manajemen Dokumen Pengadilan"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

# Database
DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

# Queue
QUEUE_CONNECTION=database

# Gemini AI
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TIMEOUT=60

# Tesseract OCR
TESSERACT_PATH="C:\Program Files\Tesseract-OCR\tesseract.exe"
TESSERACT_LANG=ind+eng
TESSERACT_OEM=3
TESSERACT_PSM=3

# File Storage
FILESYSTEM_DISK=public
```

---

## Deployment Requirements

### System Requirements
- PHP >= 8.2
- Composer
- Node.js & NPM
- Tesseract OCR 5.x
- PDFtoPPM (poppler-utils)
- SQLite / MySQL / PostgreSQL
- Web Server (Apache/Nginx)

### PHP Extensions
- OpenSSL
- PDO
- Mbstring
- Tokenizer
- XML
- Ctype
- JSON
- BCMath
- Fileinfo
- GD atau Imagick (untuk image processing)

### Installation Commands
```bash
# 1. Install dependencies
composer install --optimize-autoloader --no-dev
npm install

# 2. Build frontend
npm run build

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Setup database
php artisan migrate --force
php artisan db:seed

# 5. Setup storage
php artisan storage:link

# 6. Start queue worker (production)
php artisan queue:work --tries=3 --timeout=90
```

---

## Performance Optimization

### Frontend
- **Vite Build**: Code splitting, tree shaking, minification
- **React Query**: Data caching, background refetch
- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: Responsive images

### Backend
- **Eloquent**: Eager loading dengan `with()`
- **Database Indexing**: Index pada kolom pencarian
- **Queue Jobs**: Offload heavy tasks
- **Response Caching**: Cache API responses
- **Opcache**: PHP bytecode caching

### OCR Optimization
- **PDF Native Text**: Skip OCR jika ada embedded text
- **Quality Check**: Avoid unnecessary OCR
- **Batch Processing**: Process multiple pages in parallel
- **Temp File Cleanup**: Auto-delete temporary files

---

## Monitoring & Logging

### Laravel Logs
- **File**: `storage/logs/laravel.log`
- **Channels**: single, daily, stack
- **Tool**: `php artisan pail` untuk real-time viewing

### Queue Monitoring
- **Table**: `jobs` (pending), `failed_jobs` (failed)
- **Command**: `php artisan queue:failed` untuk list failed jobs
- **Retry**: `php artisan queue:retry {id}`

### Performance Monitoring
- Laravel Telescope (optional)
- New Relic (optional)
- Custom metrics via logs

---

## Security Features

### Input Validation
- Laravel Request validation
- Type hints & strict types
- SQL injection prevention (Eloquent ORM)
- XSS prevention (React escaping)

### File Upload Security
- MIME type validation
- File size limits (10MB max)
- Storage segregation (public vs private)
- Filename sanitization

### API Security
- CSRF protection (Sanctum)
- Token authentication
- Rate limiting
- CORS configuration

### Data Privacy
- Public summaries (privacy-aware)
- Role-based access control
- Sensitive data masking
- Secure password hashing

---

## Support & Documentation

### Official Documentation
- Laravel: https://laravel.com/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Gemini AI: https://ai.google.dev/docs
- Tesseract OCR: https://tesseract-ocr.github.io

### Project Documentation
- `README.md` - Project overview
- `instalasi.md` - Installation guide
- `tools.md` - This file (technology documentation)

---

**Last Updated**: December 25, 2025
**Version**: 1.0.0
**Maintainer**: Development Team
