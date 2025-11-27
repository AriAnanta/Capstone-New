# Panduan Instalasi OCR untuk PDF

Sistem OCR ini dapat mengekstrak teks dari file PDF yang berisi gambar (scanned documents). Untuk itu diperlukan beberapa software tambahan.

## Kebutuhan Software

### 1. Tesseract OCR (Sudah Terinstall)
Tesseract digunakan untuk membaca teks dari gambar.
- Path: `C:\Program Files\Tesseract-OCR\tesseract.exe`

### 2. Ghostscript (Diperlukan untuk konversi PDF ke gambar)

#### Download & Install Ghostscript:
1. Download Ghostscript dari: https://ghostscript.com/releases/gsdnld.html
2. Pilih versi "GPL Ghostscript" untuk Windows (64-bit)
3. Install dengan default settings
4. Ghostscript biasanya terinstall di: `C:\Program Files\gs\gs10.XX.X\bin\gswin64c.exe`

#### Verifikasi Instalasi:
Buka PowerShell dan jalankan:
```powershell
gswin64c -version
```

Jika muncul error "command not found", tambahkan Ghostscript ke PATH:
1. Buka "Environment Variables" di Windows
2. Edit variable "Path" di System Variables
3. Tambahkan: `C:\Program Files\gs\gs10.XX.X\bin` (sesuaikan dengan versi yang terinstall)
4. Restart terminal/PowerShell

### 3. Alternative: ImageMagick (Optional Fallback)

Jika Ghostscript tidak tersedia, sistem akan mencoba menggunakan ImageMagick.

#### Download & Install ImageMagick:
1. Download dari: https://imagemagick.org/script/download.php#windows
2. Pilih installer untuk Windows
3. Saat instalasi, pastikan centang "Install legacy utilities (e.g. convert)"
4. Verifikasi dengan: `magick -version`

## Konfigurasi

Update file `.env` Anda:

```env
# Tesseract Configuration
TESSERACT_PATH="C:\\Program Files\\Tesseract-OCR\\tesseract.exe"
TESSERACT_LANG=ind+eng
TESSERACT_OEM=3
TESSERACT_PSM=3
```

## Cara Kerja Sistem

1. **PDF dengan teks embedded**: Ekstrak langsung tanpa OCR
2. **PDF dengan gambar/scanned**:
   - Konversi PDF ke gambar (menggunakan Ghostscript)
   - OCR setiap halaman gambar (menggunakan Tesseract)
   - Gabungkan hasil OCR dari semua halaman

## Testing

### Test Manual OCR
Untuk test apakah OCR PDF bekerja:

```bash
php artisan tinker
```

```php
$service = app(\App\Services\Ocr\OcrService::class);
$text = $service->extractText('path/to/scanned.pdf', 'application/pdf');
echo $text;
```

### Reprocess Dokumen yang Gagal

Jika ada dokumen yang gagal di-OCR, Anda bisa reprocess dengan command:

```bash
# Reprocess semua dokumen yang belum memiliki OCR text
php artisan ocr:reprocess

# Reprocess dokumen tertentu berdasarkan ID
php artisan ocr:reprocess --id=123

# Reprocess SEMUA dokumen (termasuk yang sudah berhasil)
php artisan ocr:reprocess --all
```

Setelah dispatch jobs, jalankan queue worker:

```bash
# Process satu job saja
php artisan queue:work --once --timeout=120

# Process semua jobs di queue
php artisan queue:work --timeout=120
```

## Troubleshooting

### Error: "gswin64c not found"
- Pastikan Ghostscript sudah terinstall
- Tambahkan Ghostscript ke Windows PATH
- Restart terminal/PowerShell

### Error: "Gagal mengkonversi PDF ke gambar"
- Cek log di `storage/logs/laravel.log`
- Pastikan PDF tidak corrupted
- Install ImageMagick sebagai alternatif

### OCR menghasilkan teks yang tidak akurat
- Coba tingkatkan resolusi konversi (edit di `OcrService.php`, ubah `-r300` ke `-r600`)
- Pastikan Tesseract language data untuk Indonesian sudah terinstall
- Coba ubah `TESSERACT_PSM` di `.env` (coba nilai 1, 4, atau 6)

## Performance Tips

- PDF besar dengan banyak halaman akan memakan waktu lama
- Gunakan queue untuk process OCR di background
- Temporary files akan otomatis dibersihkan setelah OCR selesai
