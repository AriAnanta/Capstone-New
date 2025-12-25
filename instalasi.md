# Panduan Instalasi Lengkap PTA Digital Intelligence Platform

Dokumentasi ini berisi langkah-langkah instalasi lengkap semua tools dan software yang dibutuhkan untuk menjalankan PTA Digital Intelligence Platform di Windows.

## Daftar Isi
1. [Instalasi Laragon](#1-instalasi-laragon)
2. [Instalasi & Konfigurasi PHP](#2-instalasi--konfigurasi-php)
3. [Instalasi Composer](#3-instalasi-composer)
4. [Instalasi Node.js & npm](#4-instalasi-nodejs--npm)
5. [Instalasi MySQL/MariaDB](#5-instalasi-mysqlmariadb)
6. [Instalasi Tesseract OCR](#6-instalasi-tesseract-ocr)
7. [Instalasi ImageMagick](#7-instalasi-imagemagick)
8. [Instalasi Extension PHP Imagick](#8-instalasi-extension-php-imagick)
9. [Instalasi Poppler (Opsional)](#9-instalasi-poppler-opsional)
10. [Konfigurasi Environment](#10-konfigurasi-environment)
11. [Setup Project](#11-setup-project)
12. [Verifikasi Instalasi](#12-verifikasi-instalasi)

---

## 1. Instalasi Laragon

Laragon adalah lingkungan pengembangan lokal yang sudah menyertakan Apache/Nginx, MySQL, PHP, dan tools lainnya.

### Langkah Instalasi:

1. **Download Laragon**
   - Kunjungi: https://laragon.org/download/
   - Download versi **Laragon Full** (sudah include Apache, MySQL, PHP, Node.js)
   - Pilih versi terbaru (mis. Laragon 6.0+)

2. **Install Laragon**
   - Jalankan installer `laragon-wamp.exe`
   - Pilih lokasi instalasi (default: `C:\laragon`)
   - Ikuti wizard instalasi hingga selesai
   - Centang opsi "Run Laragon" saat selesai

3. **Jalankan Laragon**
   - Buka Laragon
   - Klik tombol **"Start All"** untuk menjalankan Apache dan MySQL
   - Status akan berubah hijau jika berhasil

4. **Verifikasi**
   ```powershell
   # Buka PowerShell dan cek
   php -v
   mysql --version
   ```

---

## 2. Instalasi & Konfigurasi PHP

Laragon sudah menyertakan PHP, namun Anda perlu memastikan versi dan ekstensi yang tepat.

### Langkah Instalasi:

1. **Cek Versi PHP**
   ```powershell
   php -v
   ```
   Pastikan versi PHP >= 8.2

2. **Update PHP (jika perlu)**
   - Klik kanan icon Laragon di system tray
   - Pilih **PHP** → **Version** → pilih PHP 8.2 atau 8.3
   - Jika versi tidak tersedia, download manual:
     - Download PHP dari: https://windows.php.net/download/
     - Pilih **VS16 x64 Thread Safe**
     - Ekstrak ke folder `C:\laragon\bin\php\php-8.2.x`
     - Restart Laragon dan pilih versi baru

3. **Aktifkan Extension PHP**
   - Buka file `php.ini`:
     - Klik kanan icon Laragon → **PHP** → **php.ini**
   - Uncomment (hapus tanda `;`) pada extension berikut:
     ```ini
     extension=curl
     extension=fileinfo
     extension=gd
     extension=mbstring
     extension=openssl
     extension=pdo_mysql
     extension=zip
     extension=intl
     extension=exif
     ```
   - Simpan dan restart Laragon

4. **Tingkatkan Limit PHP**
   - Masih di file `php.ini`, sesuaikan:
     ```ini
     memory_limit = 512M
     upload_max_filesize = 100M
     post_max_size = 100M
     max_execution_time = 300
     max_input_time = 300
     ```
   - Simpan dan restart Laragon

5. **Verifikasi Extension**
   ```powershell
   php -m
   ```
   Pastikan extension di atas muncul dalam list

---

## 3. Instalasi Composer

Composer adalah dependency manager untuk PHP.

### Langkah Instalasi:

1. **Download Composer**
   - Kunjungi: https://getcomposer.org/download/
   - Download **Composer-Setup.exe** untuk Windows

2. **Install Composer**
   - Jalankan `Composer-Setup.exe`
   - Pilih **PHP path**: `C:\laragon\bin\php\php-8.2.x\php.exe`
   - Biarkan opsi default untuk proxy (kosong jika tidak pakai proxy)
   - Klik **Install**
   - Centang **"Add to PATH"** agar bisa dipanggil dari mana saja
   - Selesaikan instalasi

3. **Verifikasi**
   ```powershell
   composer --version
   ```
   Output: `Composer version 2.x.x`

4. **Update Composer (opsional)**
   ```powershell
   composer self-update
   ```

---

## 4. Instalasi Node.js & npm

Node.js diperlukan untuk menjalankan Vite dan build frontend React.

### Langkah Instalasi:

1. **Download Node.js**
   - Kunjungi: https://nodejs.org/
   - Download versi **LTS** (Long Term Support) terbaru
   - Minimal versi: **Node.js 20.x**

2. **Install Node.js**
   - Jalankan installer `node-vXX.x.x-x64.msi`
   - Centang opsi **"Automatically install necessary tools"**
   - Ikuti wizard instalasi
   - Pastikan opsi **"Add to PATH"** tercentang

3. **Verifikasi**
   ```powershell
   node -v
   npm -v
   ```
   Output:
   ```
   v20.x.x
   10.x.x
   ```

4. **Update npm (opsional)**
   ```powershell
   npm install -g npm@latest
   ```

5. **Alternatif: Gunakan Node.js dari Laragon**
   - Laragon Full sudah include Node.js
   - Cek kanan icon Laragon → **nodejs** → pilih versi
   - Path: `C:\laragon\bin\nodejs\node-vXX`

---

## 5. Instalasi MySQL/MariaDB

Laragon sudah menyertakan MySQL atau MariaDB.

### Langkah Konfigurasi:

1. **Akses MySQL**
   - Klik kanan icon Laragon → **MySQL** → **MySQL Console**
   - Atau gunakan HeidiSQL (sudah include di Laragon)

2. **Buat Database**
   - Buka HeidiSQL atau MySQL Console
   - Jalankan query:
     ```sql
     CREATE DATABASE pta_digital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```

3. **Buat User (opsional untuk produksi)**
   ```sql
   CREATE USER 'pta_user'@'localhost' IDENTIFIED BY 'password_anda';
   GRANT ALL PRIVILEGES ON pta_digital.* TO 'pta_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Verifikasi**
   ```sql
   SHOW DATABASES;
   ```
   Database `pta_digital` harus muncul dalam list

5. **Credentials Default Laragon**
   - Host: `localhost` atau `127.0.0.1`
   - Port: `3306`
   - Username: `root`
   - Password: (kosong / blank)

---

## 6. Instalasi Tesseract OCR

Tesseract adalah engine OCR open-source untuk mengekstrak teks dari gambar dan PDF.

### Langkah Instalasi:

1. **Download Tesseract**
   - Kunjungi: https://github.com/UB-Mannheim/tesseract/wiki
   - Download installer: **tesseract-ocr-w64-setup-vX.X.X.XXXXXXXX.exe**
   - Pilih versi terbaru (mis. 5.3.x atau lebih baru)

2. **Install Tesseract**
   - Jalankan installer
   - Pilih lokasi instalasi: `C:\Program Files\Tesseract-OCR`
   - **PENTING**: Centang opsi instalasi language data:
     - ✅ **English** (eng)
     - ✅ **Indonesian** (ind)
     - ✅ Additional languages jika diperlukan
   - Centang opsi **"Add Tesseract to the system PATH"**
   - Klik **Install**

3. **Verifikasi Instalasi**
   ```powershell
   # Restart PowerShell terlebih dahulu, kemudian:
   tesseract --version
   ```
   Output:
   ```
   tesseract 5.3.x
   ```

4. **Cek Language Data**
   ```powershell
   tesseract --list-langs
   ```
   Output harus mencakup:
   ```
   eng
   ind
   ```

5. **Download Language Data Tambahan (jika perlu)**
   - Jika bahasa Indonesia tidak terinstall:
   - Download dari: https://github.com/tesseract-ocr/tessdata
   - Download file `ind.traineddata` dan `eng.traineddata`
   - Copy ke folder: `C:\Program Files\Tesseract-OCR\tessdata\`

6. **Test Manual OCR**
   ```powershell
   # Test dengan file gambar sample
   tesseract sample.png output
   # Hasilnya akan tersimpan di output.txt
   ```

---

## 7. Instalasi ImageMagick

ImageMagick digunakan untuk konversi PDF ke gambar dengan resolusi tinggi sebelum di-OCR.

### Langkah Instalasi:

1. **Download ImageMagick**
   - Kunjungi: https://imagemagick.org/script/download.php#windows
   - Download versi: **ImageMagick-7.x.x-Q16-HDRI-x64-dll.exe**
   - Pilih versi terbaru dengan **Q16-HDRI** (kualitas tinggi)

2. **Install ImageMagick**
   - Jalankan installer
   - **PENTING**: Centang opsi berikut:
     - ✅ **Install legacy utilities (e.g. convert)** → Untuk kompatibilitas command `convert`
     - ✅ **Add application directory to system path** → Agar bisa dipanggil dari terminal
     - ✅ **Install FFmpeg** (opsional, untuk video processing)
   - Pilih lokasi instalasi: `C:\Program Files\ImageMagick-7.x.x-Q16-HDRI`
   - Klik **Install**

3. **Verifikasi Instalasi**
   ```powershell
   # Restart PowerShell terlebih dahulu
   magick -version
   ```
   Output:
   ```
   Version: ImageMagick 7.x.x Q16-HDRI x64
   ```

4. **Test Konversi PDF**
   ```powershell
   # Test konversi PDF ke PNG
   magick -density 300 sample.pdf output.png
   ```

5. **Troubleshooting**
   - Jika command `magick` tidak dikenali:
     - Buka **Environment Variables** (cari di Start menu)
     - Edit variable **Path** di System Variables
     - Tambahkan: `C:\Program Files\ImageMagick-7.x.x-Q16-HDRI`
     - Restart PowerShell

---

## 8. Instalasi Extension PHP Imagick

Extension PHP Imagick memungkinkan PHP untuk menggunakan ImageMagick library.

### Langkah Instalasi:

1. **Download PHP Imagick DLL**
   - Kunjungi: https://windows.php.net/downloads/pecl/releases/imagick/
   - Atau: https://mlocati.github.io/articles/php-windows-imagick.html
   - Pilih versi yang sesuai dengan PHP Anda:
     - **PHP Version**: 8.2 atau 8.3 (cek dengan `php -v`)
     - **Thread Safety**: Thread Safe (TS)
     - **Architecture**: x64
   - Download file: `php_imagick-X.X.X-8.2-ts-vs16-x64.zip`

2. **Ekstrak dan Install**
   - Ekstrak file ZIP
   - Copy file `php_imagick.dll` ke folder PHP extension:
     ```
     C:\laragon\bin\php\php-8.2.x\ext\
     ```
   - Copy semua file `CORE_RL_*.dll` dan `IM_MOD_*.dll` ke folder PHP root:
     ```
     C:\laragon\bin\php\php-8.2.x\
     ```

3. **Aktifkan Extension di php.ini**
   - Buka `php.ini`:
     - Klik kanan icon Laragon → **PHP** → **php.ini**
   - Tambahkan di bagian extension:
     ```ini
     extension=imagick
     ```
   - Simpan file

4. **Restart Laragon**
   - Klik **Stop All** di Laragon
   - Tunggu beberapa detik
   - Klik **Start All**

5. **Verifikasi Extension**
   ```powershell
   php -m | Select-String imagick
   ```
   Output: `imagick`

6. **Cek Detail Imagick**
   ```powershell
   php -r "phpinfo();" | Select-String -Pattern "imagick"
   ```

7. **Troubleshooting**
   - Jika error "Unable to load dynamic library 'imagick'":
     - Pastikan semua DLL sudah dicopy ke folder yang benar
     - Pastikan versi PHP dan Imagick match (8.2 TS x64)
     - Cek log error: `C:\laragon\bin\php\php-8.2.x\logs\php_error.log`
   
   - Download Visual C++ Redistributable jika belum ada:
     - https://aka.ms/vs/17/release/vc_redist.x64.exe
     - Install dan restart komputer

---

## 9. Instalasi Poppler (Opsional)

Poppler adalah alternatif ImageMagick untuk konversi PDF ke gambar, biasanya lebih cepat.

### Langkah Instalasi:

1. **Download Poppler**
   - Kunjungi: https://github.com/oschwartz10612/poppler-windows/releases
   - Download versi terbaru: `Release-XX.XX.X-X.zip`

2. **Ekstrak Poppler**
   - Ekstrak file ZIP ke lokasi permanen, misalnya:
     ```
     C:\tools\poppler\
     ```
   - Struktur folder setelah ekstrak:
     ```
     C:\tools\poppler\
       ├── Library\
       │   └── bin\     <- pdftoppm.exe ada di sini
       └── ...
     ```

3. **Tambahkan ke PATH**
   - Buka **Environment Variables**
   - Edit variable **Path** di System Variables
   - Tambahkan: `C:\tools\poppler\Library\bin`
   - Klik **OK**

4. **Verifikasi**
   ```powershell
   # Restart PowerShell terlebih dahulu
   pdftoppm -h
   ```
   Seharusnya menampilkan help text

5. **Test Konversi**
   ```powershell
   pdftoppm -png -r 300 sample.pdf output
   # Menghasilkan output-1.png, output-2.png, dst.
   ```

---

## 10. Konfigurasi Environment

Setelah semua tools terinstall, saatnya konfigurasi project.

### Langkah Konfigurasi:

1. **Clone atau Copy Project**
   ```powershell
   cd C:\laragon\www
   # Jika dari git:
   git clone <repository-url> cobacoba
   # Atau copy folder project yang sudah ada
   ```

2. **Copy File Environment**
   ```powershell
   cd C:\laragon\www\cobacoba
   Copy-Item .env.example .env
   ```

3. **Edit File .env**
   - Buka file `.env` dengan text editor
   - Sesuaikan konfigurasi berikut:

   ```env
   APP_NAME="PTA Digital Intelligence"
   APP_ENV=local
   APP_DEBUG=true
   APP_URL=http://cobacoba.test
   
   # Frontend URL (jika berbeda)
   FRONTEND_URL=http://cobacoba.test
   
   # Database Configuration
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=pta_digital
   DB_USERNAME=root
   DB_PASSWORD=
   
   # Queue Configuration
   QUEUE_CONNECTION=database
   
   # Sanctum Configuration
   SANCTUM_STATEFUL_DOMAINS=cobacoba.test,localhost:3000,localhost:5173
   SESSION_DOMAIN=.cobacoba.test
   
   # Gemini AI Configuration
   GEMINI_API_KEY=your-gemini-api-key-here
   # Atau gunakan multiple keys (pisahkan dengan koma):
   # GEMINI_API_KEYS=key1,key2,key3
   GEMINI_MODEL=gemini-1.5-flash
   
   # OCR Configuration - Tesseract
   TESSERACT_PATH="C:\\Program Files\\Tesseract-OCR\\tesseract.exe"
   TESSERACT_LANG=ind+eng
   TESSERACT_OEM=3
   TESSERACT_PSM=3
   
   # OCR Commands
   OCR_PDF_COMMAND="\"C:\\Program Files\\Tesseract-OCR\\tesseract.exe\" {input} {output} pdf"
   OCR_IMAGE_COMMAND="\"C:\\Program Files\\Tesseract-OCR\\tesseract.exe\" {input} {output}"
   
   # PDF to Image Conversion - ImageMagick (pilih salah satu)
   OCR_PDF_TO_IMAGE_COMMAND="\"C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\magick.exe\" -density 300 {input} {output}.png"
   
   # Atau gunakan Poppler:
   # OCR_PDF_TO_IMAGE_COMMAND="\"C:\\tools\\poppler\\Library\\bin\\pdftoppm.exe\" -png -r 300 {input} {output}"
   
   # Mail Configuration (opsional)
   MAIL_MAILER=log
   ```

4. **Verifikasi Path di .env**
   - Pastikan semua path sesuai dengan lokasi instalasi di komputer Anda
   - Gunakan double backslash `\\` untuk path Windows di .env
   - Gunakan tanda kutip ganda jika path mengandung spasi

5. **Generate Application Key**
   ```powershell
   php artisan key:generate
   ```

6. **Clear Config Cache**
   ```powershell
   php artisan config:clear
   php artisan cache:clear
   ```

---

## 11. Setup Project

Setelah environment dikonfigurasi, setup project Laravel dan frontend.

### Langkah Setup:

1. **Install Dependencies PHP**
   ```powershell
   cd C:\laragon\www\cobacoba
   composer install
   ```
   Tunggu hingga selesai (bisa memakan waktu beberapa menit)

2. **Install Dependencies Node.js**
   ```powershell
   npm install
   ```
   Tunggu hingga selesai

3. **Jalankan Migrasi Database**
   ```powershell
   php artisan migrate
   ```
   Pilih **Yes** jika ditanya untuk create database

4. **Jalankan Seeder (Data Dummy)**
   ```powershell
   php artisan db:seed
   ```
   Ini akan membuat user contoh:
   - Email: `hakim@example.com`, Password: `password`
   - Email: `panitera@example.com`, Password: `password`

5. **Create Storage Link**
   ```powershell
   php artisan storage:link
   ```
   Ini membuat symlink dari `storage/app/public` ke `public/storage`

6. **Set Permissions (jika di Linux/Mac)**
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```
   Di Windows/Laragon biasanya tidak perlu

---

## 12. Verifikasi Instalasi

Pastikan semua komponen berjalan dengan baik.

### Test Backend:

1. **Jalankan Laravel Server**
   ```powershell
   # Terminal 1
   php artisan serve
   ```
   Output: `Server started on http://127.0.0.1:8000`

2. **Jalankan Queue Worker**
   ```powershell
   # Terminal 2 (PowerShell baru)
   cd C:\laragon\www\cobacoba
   php artisan queue:work --timeout=300
   ```
   Biarkan berjalan, ini akan memproses job OCR dan AI

3. **Test API**
   - Buka browser: http://127.0.0.1:8000/api/health (jika ada endpoint health)
   - Atau test login API menggunakan Postman/curl

### Test Frontend:

1. **Jalankan Vite Dev Server**
   ```powershell
   # Terminal 3 (PowerShell baru)
   cd C:\laragon\www\cobacoba
   npm run dev
   ```
   Output: `VITE vX.X.X ready in XXX ms`
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

2. **Akses Aplikasi**
   - Buka browser: http://localhost:5173
   - Atau: http://cobacoba.test (jika sudah setup virtual host di Laragon)
   - Login dengan:
     - Email: `hakim@example.com`
     - Password: `password`

### Test OCR & Pipeline:

1. **Test OCR Manual**
   ```powershell
   php artisan tinker
   ```
   Kemudian di dalam tinker:
   ```php
   $service = app(\App\Services\Ocr\OcrService::class);
   $text = $service->extractText('path/to/test.pdf', 'application/pdf');
   echo $text;
   ```

2. **Upload Dokumen via UI**
   - Login ke dashboard
   - Buka menu **Documents → Upload**
   - Pilih perkara dan upload file PDF
   - Cek queue worker terminal untuk melihat progress
   - Buka detail dokumen untuk melihat hasil OCR dan ringkasan

3. **Cek Queue Status**
   ```powershell
   # Lihat failed jobs
   php artisan queue:failed
   
   # Retry failed job
   php artisan queue:retry {job-id}
   
   # Retry all failed jobs
   php artisan queue:retry all
   ```

### Test Semua Komponen:

1. **Cek PHP dan Extensions**
   ```powershell
   php -v
   php -m | Select-String -Pattern "curl|fileinfo|gd|mbstring|openssl|pdo_mysql|imagick"
   ```

2. **Cek Composer**
   ```powershell
   composer --version
   ```

3. **Cek Node.js**
   ```powershell
   node -v
   npm -v
   ```

4. **Cek Database**
   ```powershell
   php artisan db:show
   ```

5. **Cek OCR Tools**
   ```powershell
   tesseract --version
   magick -version
   # atau
   pdftoppm -h
   ```

6. **Cek Logs**
   - Laravel logs: `storage/logs/laravel.log`
   - PHP error logs: `C:\laragon\bin\php\php-8.2.x\logs\php_error.log`
   - Apache/Nginx logs: `C:\laragon\logs\`

---

## Troubleshooting Umum

### 1. Error "Class 'Imagick' not found"
**Solusi:**
- Pastikan extension imagick sudah diaktifkan di php.ini
- Pastikan semua DLL imagick sudah dicopy ke folder PHP
- Restart Laragon
- Verifikasi: `php -m | Select-String imagick`

### 2. Queue Worker Error "gswin64c not found"
**Solusi:**
- Install Ghostscript: https://ghostscript.com/releases/gsdnld.html
- Tambahkan Ghostscript ke PATH
- Atau gunakan ImageMagick/Poppler yang sudah terinstall
- Update OCR_PDF_TO_IMAGE_COMMAND di .env

### 3. OCR Tidak Menghasilkan Teks
**Solusi:**
- Cek log di `storage/logs/laravel.log`
- Pastikan Tesseract language data (ind, eng) sudah terinstall
- Test manual: `tesseract sample.png output -l ind+eng`
- Tingkatkan resolusi konversi PDF: ubah `-density 300` ke `-density 600`

### 4. Error "SQLSTATE[HY000] [2002] No connection"
**Solusi:**
- Pastikan MySQL/MariaDB sudah jalan di Laragon
- Cek credentials di .env (DB_USERNAME, DB_PASSWORD)
- Test koneksi: `php artisan db:show`

### 5. Vite Dev Server Error "Cannot find module"
**Solusi:**
- Hapus `node_modules` dan `package-lock.json`
- Install ulang: `npm install`
- Clear cache: `npm cache clean --force`

### 6. Queue Worker Stuck/Not Processing
**Solusi:**
- Stop worker (Ctrl+C)
- Clear failed jobs: `php artisan queue:flush`
- Restart worker: `php artisan queue:work --timeout=300`
- Cek log: `php artisan queue:failed`

### 7. Upload File Gagal "File too large"
**Solusi:**
- Edit php.ini dan tingkatkan:
  ```ini
  upload_max_filesize = 100M
  post_max_size = 100M
  ```
- Restart Laragon
- Cek konfigurasi Nginx/Apache juga jika ada limit

### 8. CORS Error di Frontend
**Solusi:**
- Pastikan SANCTUM_STATEFUL_DOMAINS di .env sudah benar
- Tambahkan domain frontend (mis. `localhost:5173`)
- Clear config: `php artisan config:clear`
- Restart Laravel server

---

## Checklist Instalasi

Gunakan checklist ini untuk memastikan semua sudah terinstall:

- [ ] Laragon terinstall dan berjalan
- [ ] PHP >= 8.2 terinstall
- [ ] Extension PHP aktif (curl, fileinfo, gd, mbstring, openssl, pdo_mysql, zip, imagick)
- [ ] Composer terinstall
- [ ] Node.js >= 20 terinstall
- [ ] npm terinstall
- [ ] MySQL/MariaDB berjalan dan database dibuat
- [ ] Tesseract OCR terinstall dengan language data (ind, eng)
- [ ] ImageMagick terinstall (atau Poppler sebagai alternatif)
- [ ] Extension PHP Imagick terinstall dan aktif
- [ ] File .env dikonfigurasi dengan benar
- [ ] Dependencies PHP terinstall (`composer install`)
- [ ] Dependencies Node.js terinstall (`npm install`)
- [ ] Migrasi database berhasil (`php artisan migrate`)
- [ ] Seeder berhasil (`php artisan db:seed`)
- [ ] Storage link dibuat (`php artisan storage:link`)
- [ ] Laravel server berjalan (`php artisan serve`)
- [ ] Queue worker berjalan (`php artisan queue:work`)
- [ ] Vite dev server berjalan (`npm run dev`)
- [ ] Aplikasi dapat diakses di browser
- [ ] Login berhasil dengan user dummy
- [ ] Upload dokumen dan OCR berhasil

---

## Konfigurasi Produksi

Untuk deployment ke server produksi:

1. **Environment**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

2. **Build Frontend**
   ```powershell
   npm run build
   ```

3. **Optimize Laravel**
   ```powershell
   php artisan optimize
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

4. **Setup Queue Worker (Supervisor/Systemd)**
   - Jangan gunakan `php artisan queue:work` manual di produksi
   - Gunakan process manager seperti Supervisor (Linux) atau Task Scheduler (Windows)

5. **Setup Cron Job (Laravel Scheduler)**
   ```
   * * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
   ```

6. **HTTPS & Domain**
   - Setup SSL certificate (Let's Encrypt)
   - Konfigurasi virtual host untuk domain produksi

---

## Referensi

- Laravel Documentation: https://laravel.com/docs
- Laragon: https://laragon.org/
- Tesseract OCR: https://github.com/tesseract-ocr/tesseract
- ImageMagick: https://imagemagick.org/
- Poppler: https://poppler.freedesktop.org/
- Node.js: https://nodejs.org/
- Composer: https://getcomposer.org/

---

## Bantuan & Support

Jika mengalami masalah:

1. Cek log error di `storage/logs/laravel.log`
2. Cek PHP error log di `C:\laragon\bin\php\php-X.X.X\logs\php_error.log`
3. Jalankan `php artisan queue:failed` untuk cek failed jobs
4. Restart Laragon dan semua service
5. Clear semua cache: `php artisan optimize:clear`

---

**Selamat! Instalasi lengkap selesai. Anda sekarang siap untuk mengembangkan dan menjalankan PTA Digital Intelligence Platform.**
