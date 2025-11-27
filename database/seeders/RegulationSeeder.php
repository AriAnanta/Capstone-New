<?php

namespace Database\Seeders;

use App\Models\Regulation;
use Illuminate\Database\Seeder;

class RegulationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regulations = [
            // ========== CERAI TALAK ==========
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 39',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => '(1) Perceraian hanya dapat dilakukan di depan Sidang Pengadilan setelah Pengadilan yang bersangkutan berusaha dan tidak berhasil mendamaikan kedua belah pihak. (2) Untuk melakukan perceraian harus ada cukup alasan, bahwa antara suami istri itu tidak akan dapat hidup rukun sebagai suami istri.',
            ],
            [
                'nama_undang' => 'Peraturan Pemerintah Nomor 9 Tahun 1975',
                'pasal' => 'Pasal 14',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Seorang suami yang telah melangsungkan perkawinan menurut agama Islam, yang akan menceraikan isterinya, mengajukan surat kepada Pengadilan di tempat tinggalnya, yang berisi pemberitahuan bahwa ia bermaksud menceraikan isterinya disertai dengan alasan-alasannya serta meminta kepada Pengadilan agar diadakan sidang untuk keperluan itu.',
            ],
            [
                'nama_undang' => 'Peraturan Pemerintah Nomor 9 Tahun 1975',
                'pasal' => 'Pasal 15',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Pengadilan yang bersangkutan mempelajari isi surat tersebut dan dalam waktu selambat-lambatnya 30 (tiga puluh) hari memanggil pengirim surat dan juga isterinya untuk meminta penjelasan tentang segala sesuatu yang berhubungan dengan maksud perceraian itu.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 114',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Putusnya perkawinan yang disebabkan karena perceraian dapat terjadi karena talak atau berdasarkan gugatan perceraian.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 117',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Talak adalah ikrar suami di hadapan sidang Pengadilan Agama yang menjadi salah satu sebab putusnya perkawinan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 129',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Seorang suami yang akan menjatuhkan talak kepada isterinya mengajukan permohonan baik lisan maupun tertulis kepada Pengadilan Agama yang mewilayahi tempat tinggal isteri disertai dengan alasan serta meminta agar diadakan sidang untuk keperluan itu.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989 jo. UU No. 3 Tahun 2006 jo. UU No. 50 Tahun 2009',
                'pasal' => 'Pasal 66',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => '(1) Seorang suami yang beragama Islam yang akan menceraikan isterinya mengajukan permohonan kepada Pengadilan untuk mengadakan sidang guna menyaksikan ikrar talak. (2) Permohonan sebagaimana dimaksud dalam ayat (1) diajukan kepada Pengadilan yang daerah hukumnya meliputi tempat kediaman termohon.',
            ],

            // ========== CERAI GUGAT ==========
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 39',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => '(1) Perceraian hanya dapat dilakukan di depan Sidang Pengadilan setelah Pengadilan yang bersangkutan berusaha dan tidak berhasil mendamaikan kedua belah pihak. (2) Untuk melakukan perceraian harus ada cukup alasan, bahwa antara suami istri itu tidak akan dapat hidup rukun sebagai suami istri.',
            ],
            [
                'nama_undang' => 'Peraturan Pemerintah Nomor 9 Tahun 1975',
                'pasal' => 'Pasal 19',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => 'Perceraian dapat terjadi karena alasan atau alasan-alasan: (a) Salah satu pihak berbuat zina atau menjadi pemabuk, pemadat, penjudi, dan lain sebagainya yang sukar disembuhkan; (b) Salah satu pihak meninggalkan pihak lain selama 2 (dua) tahun berturut-turut tanpa izin pihak lain dan tanpa alasan yang sah atau karena hal lain diluar kemampuannya; (c) Salah satu pihak mendapat hukuman penjara 5 (lima) tahun atau hukuman yang lebih berat setelah perkawinan berlangsung; (d) Salah satu pihak melakukan kekejaman atau penganiayaan berat yang membahayakan pihak yang lain; (e) Salah satu pihak mendapat cacat badan atau penyakit dengan akibat tidak dapat menjalankan kewajibannya sebagai suami/isteri; (f) Antara suami dan isteri terus menerus terjadi perselisihan dan pertengkaran dan tidak ada harapan akan hidup rukun lagi dalam rumah tangga.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 116',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => 'Perceraian dapat terjadi karena alasan atau alasan-alasan: (a) salah satu pihak berbuat zina atau menjadi pemabuk, pemadat, penjudi dan lain sebagainya yang sukar disembuhkan; (b) salah satu pihak meninggalkan pihak lain selama 2 tahun berturut-turut tanpa izin pihak lain dan tanpa alasan yang sah atau karena hal lain diluar kemampuannya; (c) salah satu pihak mendapat hukuman penjara 5 tahun atau hukuman yang lebih berat setelah perkawinan berlangsung; (d) salah satu pihak melakukan kekejaman atau penganiayaan berat yang membahayakan pihak lain; (e) salah satu pihak mendapat cacat badan atau penyakit dengan akibat tidak dapat menjalankan kewajibannya sebagai suami atau isteri; (f) antara suami dan isteri terus menerus terjadi perselisihan dan pertengkaran dan tidak ada harapan akan hidup rukun lagi dalam rumah tangga; (g) Suami melanggar taklik talak; (h) peralihan agama atau murtad yang menyebabkan terjadinya ketidakrukunan dalam rumah tangga.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989 jo. UU No. 3 Tahun 2006 jo. UU No. 50 Tahun 2009',
                'pasal' => 'Pasal 73',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => '(1) Gugatan perceraian diajukan oleh isteri atau kuasanya kepada Pengadilan yang daerah hukumnya meliputi tempat kediaman penggugat, kecuali apabila penggugat dengan sengaja meninggalkan tempat kediaman bersama tanpa izin tergugat.',
            ],
            [
                'nama_undang' => 'PERMA Nomor 3 Tahun 2017',
                'pasal' => 'Pasal 2-4',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => 'Pedoman mengadili perkara perempuan berhadapan dengan hukum, termasuk dalam perkara perceraian, hakim harus mempertimbangkan kesetaraan gender dan ketidakberpihakan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 132',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => 'Gugatan perceraian diajukan oleh isteri atau kuasanya pada Pengadilan Agama yang daerah hukumnya mewilayahi tempat tinggal penggugat kecuali isteri meninggalkan tempat kediaman bersama tanpa izin suami.',
            ],

            // ========== KEWARISAN ==========
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 171',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Hukum kewarisan adalah hukum yang mengatur tentang pemindahan hak pemilikan harta peninggalan (tirkah) pewaris, menentukan siapa-siapa yang berhak menjadi ahli waris dan berapa bagiannya masing-masing.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 174',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => '(1) Kelompok-kelompok ahli waris terdiri dari: a. Menurut hubungan darah: - Golongan laki-laki terdiri dari: ayah, anak laki-laki, saudara laki-laki, paman dan kakek. - Golongan perempuan terdiri dari: ibu, anak perempuan, saudara perempuan dan nenek. b. Menurut hubungan perkawinan terdiri dari: duda atau janda.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 176',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Anak perempuan bila hanya seorang ia mendapat separuh bagian, bila dua orang atau lebih mereka bersama-sama mendapat dua pertiga bagian, dan apabila anak perempuan bersama-sama dengan anak laki-laki, maka bagian anak laki-laki adalah dua berbanding satu dengan anak perempuan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 180',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Janda mendapat seperempat bagian bila pewaris tidak meninggalkan anak, dan bila pewaris meninggalkan anak, maka janda mendapat seperdelapan bagian.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 185',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => '(1) Ahli waris yang meninggal lebih dahulu daripada si pewaris maka kedudukannya dapat digantikan oleh anaknya, kecuali mereka yang tersebut dalam Pasal 173. (2) Bagian ahli waris pengganti tidak boleh melebihi dari bagian ahli waris yang sederajat dengan yang diganti.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989 jo. UU No. 3 Tahun 2006',
                'pasal' => 'Pasal 49',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Pengadilan Agama bertugas dan berwenang memeriksa, memutus, dan menyelesaikan perkara di tingkat pertama antara orang-orang yang beragama Islam di bidang: a. perkawinan; b. waris; c. wasiat; d. hibah; e. wakaf; f. zakat; g. infaq; h. shadaqah; dan i. ekonomi syariah.',
            ],

            // ========== HARTA BERSAMA ==========
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 35',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => '(1) Harta benda yang diperoleh selama perkawinan menjadi harta bersama. (2) Harta bawaan dari masing-masing suami dan isteri dan harta benda yang diperoleh masing-masing sebagai hadiah atau warisan, adalah di bawah penguasaan masing-masing sepanjang para pihak tidak menentukan lain.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 36',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => '(1) Mengenai harta bersama, suami atau isteri dapat bertindak atas persetujuan kedua belah pihak. (2) Mengenai harta bawaan masing-masing, suami dan isteri mempunyai hak sepenuhnya untuk melakukan perbuatan hukum mengenai harta bendanya.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 37',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => 'Bila perkawinan putus karena perceraian, harta bersama diatur menurut hukumnya masing-masing.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 85',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => 'Adanya harta bersama dalam perkawinan itu tidak menutup kemungkinan adanya harta milik masing-masing suami atau isteri.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 97',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => 'Janda atau duda cerai hidup masing-masing berhak seperdua dari harta bersama sepanjang tidak ditentukan lain dalam perjanjian perkawinan.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 1448 K/Sip/1974',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => 'Pembagian harta bersama adalah setengah bagian untuk masing-masing pihak (suami dan istri).',
            ],

            // ========== EKONOMI SYARIAH ==========
            [
                'nama_undang' => 'Undang-Undang Nomor 21 Tahun 2008 tentang Perbankan Syariah',
                'pasal' => 'Pasal 55',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => '(1) Penyelesaian sengketa Perbankan Syariah dilakukan oleh pengadilan dalam lingkungan Peradilan Agama. (2) Dalam hal para pihak telah memperjanjikan penyelesaian sengketa selain sebagaimana dimaksud pada ayat (1), penyelesaian sengketa dilakukan sesuai dengan isi Akad.',
            ],
            [
                'nama_undang' => 'PERMA Nomor 2 Tahun 2008',
                'pasal' => 'Pasal 1',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Kompilasi Hukum Ekonomi Syariah yang selanjutnya disebut KHES adalah pedoman yang berlaku bagi Hakim Pengadilan dalam lingkungan Peradilan Agama yang memeriksa, memutus, dan menyelesaikan perkara yang berkaitan dengan ekonomi syariah.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Ekonomi Syariah',
                'pasal' => 'Pasal 20-35',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ketentuan tentang akad, termasuk rukun akad, syarat akad, kategori akad, dan aib (cacat) pada akad.',
            ],
            [
                'nama_undang' => 'Fatwa DSN-MUI',
                'pasal' => 'No. 04/DSN-MUI/IV/2000',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ketentuan tentang akad Murabahah dalam perbankan syariah, termasuk rukun dan syarat murabahah.',
            ],
            [
                'nama_undang' => 'Fatwa DSN-MUI',
                'pasal' => 'No. 07/DSN-MUI/IV/2000',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ketentuan tentang pembiayaan Mudharabah (Qiradh) dalam lembaga keuangan syariah.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 3 Tahun 2006',
                'pasal' => 'Pasal 49',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Perluasan kewenangan Pengadilan Agama meliputi sengketa ekonomi syariah termasuk: bank syariah, lembaga keuangan mikro syariah, asuransi syariah, reasuransi syariah, reksadana syariah, obligasi dan surat berharga berjangka menengah syariah, sekuritas syariah, pembiayaan syariah, pegadaian syariah, dana pensiun lembaga keuangan syariah, dan bisnis syariah.',
            ],

            // ========== PEMBATALAN PERKAWINAN ==========
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 22',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => 'Perkawinan dapat dibatalkan apabila para pihak tidak memenuhi syarat-syarat untuk melangsungkan perkawinan.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 24',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => 'Barang siapa karena perkawinan masih terikat dirinya dengan salah satu dari kedua belah pihak dan atas dasar masih adanya perkawinan dapat mengajukan pembatalan perkawinan yang baru, dengan tidak mengurangi ketentuan Pasal 3 ayat (2) dan Pasal 4 Undang-undang ini.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 26',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => '(1) Perkawinan yang dilangsungkan di muka pegawai pencatat perkawinan yang tidak berwenang, wali nikah yang tidak sah atau yang dilangsungkan tanpa dihadiri oleh 2 (dua) orang saksi dapat dimintakan pembatalannya oleh para keluarga dalam garis keturunan lurus ke atas dari suami atau isteri, jaksa dan suami atau isteri.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 70',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => 'Perkawinan batal apabila: a. suami melakukan perkawinan, sedang ia tidak berhak melakukan akad nikah karena sudah mempunyai empat orang isteri; b. seseorang menikahi bekas isterinya yang telah dili\'annya; c. seseorang menikahi bekas isterinya yang pernah dijatuhi tiga kali talak olehnya; d. perkawinan dilakukan antara dua orang yang mempunyai hubungan darah, semenda dan sesusuan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 71',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => 'Suatu perkawinan dapat dibatalkan apabila: a. seorang suami melakukan poligami tanpa izin Pengadilan Agama; b. perempuan yang dikawini ternyata kemudian diketahui masih menjadi isteri pria lain yang mafqud; c. perempuan yang dikawini ternyata masih dalam iddah dari suami lain; d. perkawinan yang melanggar batas umur perkawinan; e. perkawinan dilangsungkan tanpa wali atau dilaksanakan oleh wali yang tidak berhak; f. perkawinan yang dilaksanakan dengan paksaan.',
            ],

            // ========== HADLONAH ==========
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 105',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => 'Dalam hal terjadi perceraian: a. Pemeliharaan anak yang belum mumayyiz atau belum berumur 12 tahun adalah hak ibunya; b. Pemeliharaan anak yang sudah mumayyiz diserahkan kepada anak untuk memilih di antara ayah atau ibunya sebagai pemegang hak pemeliharaannya; c. Biaya pemeliharaan ditanggung oleh ayahnya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 156',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => 'Akibat putusnya perkawinan karena perceraian: a. Anak yang belum mumayyiz berhak mendapat hadhanah dari ibunya, kecuali bila ibunya telah meninggal dunia, maka kedudukannya digantikan oleh: 1. wanita-wanita dalam garis lurus ke atas dari ibu; 2. ayah; 3. wanita-wanita dalam garis lurus ke atas dari ayah; 4. saudara perempuan dari anak yang bersangkutan; 5. wanita-wanita kerabat sedarah menurut garis samping dari ibu; 6. wanita-wanita kerabat sedarah menurut garis samping dari ayah.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 41',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => 'Akibat putusnya perkawinan karena perceraian: a. Baik ibu atau bapak tetap berkewajiban memelihara dan mendidik anak-anaknya, semata-mata berdasarkan kepentingan anak; b. Bapak yang bertanggung jawab atas semua biaya pemeliharaan dan pendidikan yang diperlukan anak itu; c. Pengadilan dapat mewajibkan kepada bekas suami untuk memberikan biaya penghidupan dan/atau menentukan sesuatu kewajiban bagi bekas isteri.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 35 Tahun 2014 tentang Perlindungan Anak',
                'pasal' => 'Pasal 14',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => '(1) Setiap Anak berhak untuk diasuh oleh Orang Tuanya sendiri, kecuali jika ada alasan dan/atau aturan hukum yang sah menunjukkan bahwa pemisahan itu adalah demi kepentingan terbaik bagi Anak dan merupakan pertimbangan terakhir.',
            ],
            [
                'nama_undang' => 'SEMA Nomor 1 Tahun 2017',
                'pasal' => 'Rumusan Hukum Kamar Agama',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => 'Dalam menentukan hak asuh anak, hakim harus mempertimbangkan kepentingan terbaik bagi anak (the best interest of the child), bukan semata-mata hak orang tua.',
            ],

            // ========== HIBAH ==========
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 210',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => '(1) Orang yang telah berumur sekurang-kurangnya 21 tahun, berakal sehat dan tanpa adanya paksaan dapat menghibahkan sebanyak-banyaknya 1/3 harta bendanya kepada orang lain atau lembaga di hadapan dua orang saksi untuk dimiliki. (2) Harta benda yang dihibahkan harus merupakan hak dari penghibah.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 211',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Hibah dari orang tua kepada anaknya dapat diperhitungkan sebagai warisan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 212',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Hibah tidak dapat ditarik kembali, kecuali hibah orang tua kepada anaknya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 213',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Hibah yang diberikan pada saat pemberi hibah dalam keadaan sakit yang dekat dengan kematian, maka harus mendapat persetujuan dari ahli warisnya.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 551 K/AG/1994',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Hibah yang melebihi 1/3 (sepertiga) bagian dari harta pewaris dapat dibatalkan.',
            ],
            [
                'nama_undang' => 'Kitab Undang-Undang Hukum Perdata',
                'pasal' => 'Pasal 1666',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Hibah adalah suatu perjanjian dengan mana si penghibah di waktu hidupnya dengan cuma-cuma dan dengan tidak dapat ditarik kembali, menyerahkan sesuatu benda guna keperluan si penerima hibah yang menerima penyerahan itu.',
            ],
        ];

        foreach ($regulations as $regulation) {
            Regulation::updateOrCreate(
                [
                    'nama_undang' => $regulation['nama_undang'],
                    'pasal' => $regulation['pasal'],
                    'kategori_perkara' => $regulation['kategori_perkara'],
                ],
                [
                    'isi_pasal' => $regulation['isi_pasal'],
                ]
            );
        }

        $this->command->info('Regulations seeded successfully: ' . count($regulations) . ' records.');
    }
}
