# Troubleshooting: Gemini API Timeout Issues

## Masalah yang Sering Terjadi

### 1. Connection Timeout (cURL error 28)
```
cURL error 28: Operation timed out after 60005 milliseconds with 0 bytes received
```

**Penyebab:**
- Koneksi internet lambat atau tidak stabil
- Gemini API sedang mengalami gangguan
- Firewall atau proxy memblokir akses
- Rate limiting dari Google

**Solusi:**
1. **Periksa koneksi internet**
2. **Gunakan multiple API keys** (tambahkan di `.env`):
   ```
   GEMINI_API_KEYS=key1,key2,key3
   ```
3. **Kurangi timeout** (sudah dilakukan di update):
   ```
   GEMINI_TIMEOUT=30
   ```
4. **Gunakan VPN** jika Gemini API diblokir di region Anda

### 2. Semua API Key Gagal
```
Semua Gemini API key gagal dipakai
```

**Penyebab:**
- Quota API habis
- API key tidak valid
- Rate limiting

**Solusi:**
1. **Periksa quota** di [Google AI Studio](https://makersuite.google.com)
2. **Generate API key baru**
3. **Upgrade billing** jika perlu
4. **Distribusikan load** dengan multiple keys

### 3. Response Kosong dari Gemini
```
Gemini tidak mengembalikan daftar pasal
```

**Penyebab:**
- Prompt terlalu panjang
- Content policy violation
- Model overload

**Solusi:**
1. **Cek panjang dokumen** (max ~30,000 characters)
2. **Pastikan content aman** (tidak ada content yang dilindungi)
3. **Coba model lain**: `gemini-1.5-pro` atau `gemini-1.0-pro`

## Konfigurasi yang Disarankan

### Untuk Produksi:
```env
# Multiple keys untuk redundancy
GEMINI_API_KEYS=key1,key2,key3

# Model yang stabil
GEMINI_MODEL=gemini-1.5-flash

# Timeout yang reasonable
GEMINI_TIMEOUT=30

# Retry configuration
GEMINI_MAX_RETRIES=2
GEMINI_RETRY_DELAY=1000
```

### Untuk Development:
```env
# Single key OK untuk testing
GEMINI_API_KEY=your-key-here

# Faster timeout untuk development
GEMINI_TIMEOUT=20
```

## Monitoring dan Debugging

### Log Files
Periksa log di `storage/logs/laravel.log` untuk:
- Connection errors
- API response details
- Retry attempts
- Success/failure patterns

### Useful Commands
```bash
# Clear cache
php artisan config:cache

# Test API connection
php artisan tinker
>>> app(\App\Services\Llm\GeminiClient::class)->analyze('Test prompt')

# Reprocess failed documents
php artisan queue:work --tries=3
```

## Frontend Error Handling

Update frontend sudah ditambahkan untuk:
- ✅ Mendeteksi error state
- ✅ Menampilkan pesan error yang jelas
- ✅ Tombol retry untuk admin
- ✅ Indikator timeout/connection issues
- ✅ Auto-refresh yang lebih smart

## Performance Tips

1. **Gunakan model yang tepat:**
   - `gemini-1.5-flash`: Cepat, untuk summary sederhana
   - `gemini-1.5-pro`: Lebih akurat, untuk analisis kompleks

2. **Optimasi prompt:**
   - Buat prompt yang specific dan pendek
   - Gunakan format JSON yang konsisten

3. **Queue processing:**
   - Gunakan queue untuk background processing
   - Set retry attempts yang reasonable

4. **Monitoring:**
   - Track API usage via logs
   - Monitor success/failure rates
   - Set up alerts untuk multiple failures