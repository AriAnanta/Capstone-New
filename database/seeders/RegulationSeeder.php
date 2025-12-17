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

            // ========== TAMBAHAN CERAI TALAK ==========
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 118',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Talak raj\'i adalah talak kesatu atau kedua, dimana suami berhak rujuk selama isteri dalam masa iddah.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 119',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => '(1) Talak ba\'in sughraa adalah talak yang tidak boleh dirujuk tapi boleh akad nikah baru dengan bekas suaminya meskipun dalam iddah. (2) Talak ba\'in sughraa sebagaimana tersebut pada ayat (1) adalah: a. talak yang terjadi qabla al dukhul; b. talak dengan tebusan atau khuluk; c. talak yang dijatuhkan oleh Pengadilan Agama.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 120',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Talak ba\'in kubraa adalah talak yang terjadi untuk ketiga kalinya. Talak jenis ini tidak dapat dirujuk dan tidak dapat dinikahkan kembali, kecuali apabila pernikahan itu dilakukan setelah bekas isteri menikah dengan orang lain dan kemudian terjadi perceraian ba\'da al dukhul dan habis masa iddahnya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 121',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Talak sunni adalah talak yang dibolehkan yaitu talak yang dijatuhkan terhadap isteri yang sedang suci dan tidak dicampuri dalam waktu suci tersebut.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 122',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Talak bid\'i adalah talak yang dilarang, yaitu talak yang dijatuhkan pada waktu isteri dalam keadaan haid, atau isteri dalam keadaan suci tapi sudah dicampuri pada waktu suci tersebut.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 130',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Pengadilan Agama dapat mengabulkan atau menolak permohonan tersebut, dan terhadap keputusan tersebut dapat diminta upaya hukum banding dan kasasi.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 131',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => '(1) Pengadilan Agama yang bersangkutan mempelajari permohonan dimaksud pasal 129 dan dalam waktu selambat-lambatnya tiga puluh hari memanggil pemohon dan isterinya untuk meminta penjelasan tentang segala sesuatu yang berhubungan dengan maksud menjatuhkan talak.',
            ],
            [
                'nama_undang' => 'Peraturan Pemerintah Nomor 9 Tahun 1975',
                'pasal' => 'Pasal 16',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Pengadilan setelah menerima surat pemberitahuan tersebut mempelajarinya dan selambat-lambatnya 30 hari sesudah menerima surat itu memanggil suami dan isteri yang bersangkutan untuk dimintai penjelasan tentang segala sesuatu yang berhubungan dengan maksud perceraian.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989',
                'pasal' => 'Pasal 70',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => '(1) Pengadilan setelah berkesimpulan bahwa kedua belah pihak tidak mungkin lagi didamaikan dan telah cukup alasan perceraian, maka Pengadilan menetapkan bahwa permohonan tersebut dikabulkan. (2) Terhadap penetapan sebagaimana yang dimaksud dalam ayat (1), isteri dapat mengajukan banding.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989',
                'pasal' => 'Pasal 71',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => '(1) Dalam sidang tersebut suami atau wakilnya yang diberi kuasa khusus dalam suatu akta autentik untuk mengucapkan ikrar talak, mengucapkan ikrar talak yang dihadiri oleh isteri atau kuasanya. (2) Jika isteri telah mendapat panggilan secara sah atau patut, tetapi tidak datang menghadap sendiri atau tidak mengirim wakilnya, maka suami atau wakilnya dapat mengucapkan ikrar talak tanpa hadirnya isteri atau wakilnya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 149',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Bilamana perkawinan putus karena talak, maka bekas suami wajib: a. memberikan mut\'ah yang layak kepada bekas isterinya, baik berupa uang atau benda, kecuali bekas isteri tersebut qabla al dukhul; b. memberi nafkah, maskan dan kiswah kepada bekas isteri selama dalam iddah, kecuali bekas isteri telah dijatuhi talak ba\'in atau nusyuz dan dalam keadaan tidak hamil; c. melunasi mahar yang masih terhutang seluruhnya, dan separuh apabila qabla al dukhul; d. memberikan biaya hadhanah untuk anak-anaknya yang belum mencapai umur 21 tahun.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 152',
                'kategori_perkara' => 'cerai_talak',
                'isi_pasal' => 'Bekas isteri berhak mendapat nafkah iddah dari bekas suaminya kecuali ia nusyuz.',
            ],

            // ========== TAMBAHAN CERAI GUGAT ==========
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989',
                'pasal' => 'Pasal 74',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => 'Apabila gugatan perceraian didasarkan atas alasan salah satu pihak mendapat pidana penjara, maka untuk memperoleh putusan perceraian, sebagai bukti penggugat cukup menyampaikan salinan putusan Pengadilan yang berwenang yang memutuskan perkara disertai keterangan yang menyatakan bahwa putusan itu telah memperoleh kekuatan hukum tetap.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989',
                'pasal' => 'Pasal 75',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => 'Apabila gugatan perceraian didasarkan atas alasan bahwa tergugat mendapat cacat badan atau penyakit dengan akibat tidak dapat menjalankan kewajiban sebagai suami, maka Hakim dapat memerintahkan tergugat untuk memeriksakan diri kepada dokter.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 7 Tahun 1989',
                'pasal' => 'Pasal 76',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => '(1) Apabila gugatan perceraian didasarkan atas alasan syiqaq, maka untuk mendapatkan putusan perceraian harus didengar keterangan saksi-saksi yang berasal dari keluarga atau orang-orang yang dekat dengan suami isteri. (2) Pengadilan setelah mendengar keterangan saksi tentang sifat persengketaan antara suami isteri dapat mengangkat seorang atau lebih dari keluarga masing-masing pihak ataupun orang lain untuk menjadi hakam.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 133',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => '(1) Gugatan perceraian karena alasan tersebut dalam pasal 116 huruf b, dapat diajukan setelah lampau 2 (dua) tahun terhitung sejak tergugat meninggalkan rumah. (2) Gugatan dapat diterima apabila tergugat menyatakan atau menunjukkan sikap tidak mau lagi kembali ke rumah kediaman bersama.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 134',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => 'Gugatan perceraian karena alasan tersebut dalam pasal 116 huruf f, dapat diterima apabila telah cukup jelas bagi Pengadilan Agama mengenai sebab-sebab perselisihan dan pertengkaran itu dan setelah mendengar pihak keluarga serta orang-orang yang dekat dengan suami isteri tersebut.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 135',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => 'Gugatan perceraian karena alasan suami melanggar taklik talak (pasal 116 huruf g) dapat diterima apabila tergugat telah terbukti melakukan pelanggaran terhadap taklik talak yang telah dijanjikan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 136',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => '(1) Selama berlangsungnya gugatan perceraian, atas permohonan penggugat atau tergugat berdasarkan pertimbangan bahaya yang mungkin ditimbulkan, Pengadilan Agama dapat mengizinkan suami isteri tersebut untuk tidak tinggal dalam satu rumah. (2) Selama berlangsungnya gugatan perceraian, atas permohonan penggugat, Pengadilan Agama dapat: a. menentukan nafkah yang harus ditanggung oleh suami; b. menentukan hal-hal yang perlu untuk menjamin pemeliharaan dan pendidikan anak; c. menentukan hal-hal yang perlu untuk menjamin terpeliharanya barang-barang yang menjadi hak bersama suami isteri atau barang-barang yang menjadi hak suami atau barang-barang yang menjadi hak isteri.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 148',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => '(1) Seorang isteri yang mengajukan gugatan perceraian dengan jalan khuluk, menyampaikan permohonannya kepada Pengadilan Agama yang mewilayahi tempat tinggalnya disertai alasan-alasannya. (2) Pengadilan Agama selambat-lambatnya satu bulan memanggil isteri dan suaminya untuk didengar keterangannya masing-masing.',
            ],
            [
                'nama_undang' => 'Peraturan Pemerintah Nomor 9 Tahun 1975',
                'pasal' => 'Pasal 20',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => '(1) Gugatan perceraian diajukan oleh suami atau isteri atau kuasanya kepada Pengadilan yang daerah hukumnya meliputi tempat kediaman tergugat. (2) Dalam hal tempat kediaman tergugat tidak jelas atau tidak diketahui atau tidak mempunyai tempat kediaman yang tetap, gugatan perceraian diajukan kepada Pengadilan di tempat kediaman penggugat.',
            ],
            [
                'nama_undang' => 'Peraturan Pemerintah Nomor 9 Tahun 1975',
                'pasal' => 'Pasal 22',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => '(1) Gugatan perceraian karena alasan tersebut dalam Pasal 19 huruf f, diajukan kepada Pengadilan di tempat kediaman tergugat. (2) Gugatan tersebut dalam ayat (1) dapat diterima apabila telah cukup jelas bagi Pengadilan mengenai sebab-sebab perselisihan dan pertengkaran itu dan setelah mendengar pihak keluarga serta orang-orang yang dekat dengan suami-isteri itu.',
            ],
            [
                'nama_undang' => 'SEMA Nomor 3 Tahun 2018',
                'pasal' => 'Rumusan Hukum Kamar Agama',
                'kategori_perkara' => 'cerai_gugat',
                'isi_pasal' => 'Dalam perkara cerai gugat, isteri yang menggugat cerai tidak berhak mendapatkan nafkah iddah dan mut\'ah dari bekas suami, kecuali jika suami yang menyebabkan terjadinya perceraian tersebut.',
            ],

            // ========== TAMBAHAN KEWARISAN ==========
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 172',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Ahli waris dipandang beragama Islam apabila diketahui dari Kartu Identitas atau pengakuan atau amalan atau kesaksian, sedangkan bagi bayi yang baru lahir atau anak yang belum dewasa, beragama menurut ayahnya atau lingkungannya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 173',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Seorang terhalang menjadi ahli waris apabila dengan putusan hakim yang telah mempunyai kekuatan hukum yang tetap, dihukum karena: a. dipersalahkan telah membunuh atau mencoba membunuh atau menganiaya berat pada pewaris; b. dipersalahkan secara memfitnah telah mengajukan pengaduan bahwa pewaris telah melakukan suatu kejahatan yang diancam dengan hukuman 5 tahun penjara atau hukuman yang lebih berat.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 175',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => '(1) Kewajiban ahli waris terhadap pewaris adalah: a. mengurus dan menyelesaikan sampai pemakaman jenazah selesai; b. menyelesaikan baik hutang-hutang berupa pengobatan, perawatan termasuk kewajiban pewaris maupun menagih piutang; c. menyelesaikan wasiat pewaris; d. membagi harta warisan di antara ahli waris yang berhak. (2) Tanggung jawab ahli waris terhadap hutang atau kewajiban pewaris hanya terbatas pada jumlah atau nilai harta peninggalannya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 177',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Ayah mendapat sepertiga bagian bila pewaris tidak meninggalkan anak, bila ada anak, ayah mendapat seperenam bagian.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 178',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => '(1) Ibu mendapat seperenam bagian bila ada anak atau dua saudara atau lebih. Bila tidak ada anak atau dua orang saudara atau lebih, maka ia mendapat sepertiga bagian. (2) Ibu mendapat sepertiga bagian dari sisa sesudah diambil oleh janda atau duda bila bersama-sama dengan ayah.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 179',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Duda mendapat separuh bagian, bila pewaris tidak meninggalkan anak, dan bila pewaris meninggalkan anak, maka duda mendapat seperempat bagian.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 181',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Bila seorang meninggal tanpa meninggalkan anak dan ayah, maka saudara laki-laki dan saudara perempuan seibu masing-masing mendapat seperenam bagian. Bila mereka itu dua orang atau lebih maka mereka bersama-sama mendapat sepertiga bagian.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 182',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Bila seorang meninggal tanpa meninggalkan ayah dan anak, sedang ia mempunyai satu saudara perempuan kandung atau seayah, maka ia mendapat separuh bagian. Bila saudara perempuan tersebut bersama-sama dengan saudara perempuan kandung atau seayah dua orang atau lebih, maka mereka bersama-sama mendapat dua pertiga bagian. Bila saudara perempuan tersebut bersama-sama dengan saudara laki-laki kandung atau seayah, maka bagian saudara laki-laki adalah dua berbanding satu dengan saudara perempuan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 183',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Para ahli waris dapat bersepakat melakukan perdamaian dalam pembagian harta warisan, setelah masing-masing menyadari bagiannya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 184',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Bagi ahli waris yang belum dewasa atau tidak mampu melaksanakan hak dan kewajibannya, maka baginya diangkat wali berdasarkan keputusan Hakim atas usul anggota keluarga.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 186',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Anak yang lahir di luar perkawinan hanya mempunyai hubungan saling mewaris dengan ibunya dan keluarga dari pihak ibunya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 187',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => '(1) Bilamana pewaris meninggalkan warisan harta peninggalan, maka oleh pewaris semasa hidupnya atau oleh para ahli waris dapat ditunjuk beberapa orang sebagai pelaksana pembagian harta warisan dengan tugas: a. mencatat dalam suatu daftar harta peninggalan, baik berupa benda bergerak maupun tidak bergerak yang kemudian disahkan oleh para ahli waris yang bersangkutan, bila perlu dinilai harganya dengan uang; b. menghitung jumlah pengeluaran untuk kepentingan pewaris sesuai dengan Pasal 175 ayat (1) huruf a, b dan c.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 189',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => '(1) Bila warisan yang akan dibagi berupa lahan pertanian yang luasnya kurang dari 2 hektar, supaya dipertahankan kesatuannya sebagaimana semula, dan dimanfaatkan untuk kepentingan bersama para ahli waris yang bersangkutan. (2) Bila ketentuan tersebut pada ayat (1) pasal ini tidak dimungkinkan karena di antara para ahli waris yang bersangkutan ada yang memerlukan uang, maka lahan tersebut dapat dimiliki oleh seorang atau lebih ahli waris dengan cara membayar harganya kepada ahli waris yang berhak sesuai dengan bagiannya masing-masing.',
            ],
            [
                'nama_undang' => 'SEMA Nomor 2 Tahun 1994',
                'pasal' => 'Angka 3',
                'kategori_perkara' => 'kewarisan',
                'isi_pasal' => 'Cucu perempuan dari anak laki-laki dapat mewarisi bersama dengan anak perempuan, dengan mendapatkan bagian 1/6 (seperenam).',
            ],

            // ========== TAMBAHAN HARTA BERSAMA ==========
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 86',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => '(1) Pada dasarnya tidak ada percampuran antara harta suami dan harta isteri karena perkawinan. (2) Harta isteri tetap menjadi hak isteri dan dikuasai penuh olehnya, demikian juga harta suami tetap menjadi hak suami dan dikuasai penuh olehnya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 87',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => '(1) Harta bawaan dari masing-masing suami dan isteri dan harta yang diperoleh masing-masing sebagai hadiah atau warisan adalah di bawah penguasaan masing-masing, sepanjang para pihak tidak menentukan lain dalam perjanjian perkawinan. (2) Suami dan isteri mempunyai hak sepenuhnya untuk melakukan perbuatan hukum atas harta masing-masing berupa hibah, hadiah, shadaqah atau lainnya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 88',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => 'Apabila terjadi perselisihan antara suami isteri tentang harta bersama, maka penyelesaian perselisihan itu diajukan kepada Pengadilan Agama.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 89',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => 'Suami bertanggung jawab menjaga harta bersama, harta isteri maupun hartanya sendiri.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 90',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => 'Isteri turut bertanggung jawab menjaga harta bersama, maupun harta suami yang ada padanya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 91',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => '(1) Harta bersama sebagaimana tersebut dalam pasal 85 di atas dapat berupa benda berwujud atau tidak berwujud. (2) Harta bersama yang berwujud dapat meliputi benda tidak bergerak, benda bergerak dan surat-surat berharga. (3) Harta bersama yang tidak berwujud dapat berupa hak maupun kewajiban. (4) Harta bersama dapat dijadikan sebagai barang jaminan oleh salah satu pihak atas persetujuan pihak lainnya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 92',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => 'Suami atau isteri tanpa persetujuan pihak lain tidak diperbolehkan menjual atau memindahkan harta bersama.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 93',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => '(1) Pertanggungjawaban terhadap hutang suami atau isteri dibebankan pada hartanya masing-masing. (2) Pertanggungjawaban terhadap hutang yang dilakukan untuk kepentingan keluarga, dibebankan kepada harta bersama. (3) Bila harta bersama tidak mencukupi, dibebankan kepada harta suami. (4) Bila harta suami tidak ada atau tidak mencukupi dibebankan kepada harta isteri.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 96',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => '(1) Apabila terjadi cerai mati, maka separuh harta bersama menjadi hak pasangan yang hidup lebih lama. (2) Pembagian harta bersama bagi seorang suami atau isteri yang isteri atau suaminya hilang harus ditangguhkan sampai adanya kepastian matinya yang hakiki atau matinya secara hukum atas dasar putusan Pengadilan Agama.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 266 K/AG/2010',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => 'Harta bersama dalam perkawinan poligami harus diperhitungkan secara proporsional berdasarkan lamanya perkawinan masing-masing isteri.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 120 K/Sip/1960',
                'kategori_perkara' => 'harta_bersama',
                'isi_pasal' => 'Harta yang diperoleh dari hadiah, hibah, atau warisan selama perkawinan bukan termasuk harta bersama, melainkan harta pribadi masing-masing.',
            ],

            // ========== TAMBAHAN EKONOMI SYARIAH ==========
            [
                'nama_undang' => 'Kompilasi Hukum Ekonomi Syariah',
                'pasal' => 'Pasal 1',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ekonomi syariah adalah usaha atau kegiatan yang dilakukan oleh orang perorangan, kelompok orang, badan usaha yang berbadan hukum atau tidak berbadan hukum dalam rangka memenuhi kebutuhan yang bersifat komersial dan tidak komersial menurut prinsip syariah.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Ekonomi Syariah',
                'pasal' => 'Pasal 21',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Akad dilakukan berdasarkan asas: (a) ikhtiyari/sukarela; (b) amanah/menepati janji; (c) ikhtiyati/kehati-hatian; (d) luzum/tidak berubah; (e) saling menguntungkan; (f) taswiyah/kesetaraan; (g) transparansi; (h) kemampuan; (i) taisir/kemudahan; (j) itikad baik; (k) sebab yang halal.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Ekonomi Syariah',
                'pasal' => 'Pasal 22',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Rukun akad terdiri atas: (a) pihak-pihak yang berakad; (b) obyek akad; (c) tujuan pokok akad; dan (d) kesepakatan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Ekonomi Syariah',
                'pasal' => 'Pasal 26',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Akad tidak sah apabila bertentangan dengan: (a) syariat Islam; (b) peraturan perundang-undangan; (c) ketertiban umum; dan/atau (d) kesusilaan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Ekonomi Syariah',
                'pasal' => 'Pasal 36',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Suatu akad dapat dibatalkan oleh pihak yang bersangkutan, apabila: (a) tidak sesuai dengan rukun akad; (b) tidak sesuai dengan syarat akad; (c) akad yang dapat dibatalkan (fasid); dan (d) akad yang di dalamnya mengandung unsur ghalath (kekhilafan), ikrah (paksaan), taghrir (tipuan), dan gubhn (penyamaran).',
            ],
            [
                'nama_undang' => 'Fatwa DSN-MUI',
                'pasal' => 'No. 08/DSN-MUI/IV/2000',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ketentuan tentang Pembiayaan Musyarakah dalam lembaga keuangan syariah, termasuk rukun, syarat, dan ketentuan pembagian keuntungan.',
            ],
            [
                'nama_undang' => 'Fatwa DSN-MUI',
                'pasal' => 'No. 09/DSN-MUI/IV/2000',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ketentuan tentang Pembiayaan Ijarah (sewa menyewa) dalam lembaga keuangan syariah.',
            ],
            [
                'nama_undang' => 'Fatwa DSN-MUI',
                'pasal' => 'No. 17/DSN-MUI/IX/2000',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ketentuan tentang Sanksi atas Nasabah Mampu yang Menunda-nunda Pembayaran.',
            ],
            [
                'nama_undang' => 'Fatwa DSN-MUI',
                'pasal' => 'No. 19/DSN-MUI/IV/2001',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ketentuan tentang al-Qardh (pinjaman) dalam lembaga keuangan syariah.',
            ],
            [
                'nama_undang' => 'Fatwa DSN-MUI',
                'pasal' => 'No. 27/DSN-MUI/III/2002',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ketentuan tentang al-Ijarah al-Muntahiyah bi al-Tamlik (sewa yang diakhiri dengan kepemilikan).',
            ],
            [
                'nama_undang' => 'Fatwa DSN-MUI',
                'pasal' => 'No. 43/DSN-MUI/VIII/2004',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ketentuan tentang Ganti Rugi (Ta\'widh) dalam transaksi ekonomi syariah.',
            ],
            [
                'nama_undang' => 'Fatwa DSN-MUI',
                'pasal' => 'No. 48/DSN-MUI/II/2005',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Ketentuan tentang Penjadwalan Kembali Tagihan Murabahah.',
            ],
            [
                'nama_undang' => 'SEMA Nomor 2 Tahun 2019',
                'pasal' => 'Rumusan Pleno Kamar Agama',
                'kategori_perkara' => 'ekonomi_syariah',
                'isi_pasal' => 'Dalam perkara ekonomi syariah, jika tergugat tidak hadir dan tidak memberikan jawaban, maka hakim wajib membuktikan dalil-dalil gugatan penggugat dan tidak boleh langsung mengabulkan gugatan (verstek tidak murni).',
            ],

            // ========== TAMBAHAN PEMBATALAN PERKAWINAN ==========
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 23',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => 'Yang dapat mengajukan pembatalan perkawinan yaitu: a. Para keluarga dalam garis keturunan lurus ke atas dari suami atau isteri; b. Suami atau isteri; c. Pejabat yang berwenang hanya selama perkawinan belum diputuskan; d. Pejabat yang ditunjuk tersebut ayat (2) Pasal 16 Undang-undang ini dan setiap orang yang mempunyai kepentingan hukum secara langsung terhadap perkawinan tersebut, tetapi hanya setelah perkawinan itu putus.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 25',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => 'Permohonan pembatalan perkawinan diajukan kepada Pengadilan dalam daerah hukum dimana perkawinan dilangsungkan atau ditempat tinggal kedua suami isteri, suami atau isteri.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 27',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => '(1) Seorang suami atau isteri dapat mengajukan permohonan pembatalan perkawinan apabila perkawinan dilangsungkan di bawah ancaman yang melanggar hukum. (2) Seorang suami atau isteri dapat mengajukan permohonan pembatalan perkawinan apabila pada waktu berlangsungnya perkawinan terjadi salah sangka mengenai diri suami atau isteri. (3) Apabila ancaman telah berhenti, atau yang bersalah sangka itu menyadari keadaannya, dan dalam jangka waktu 6 (enam) bulan setelah itu masih tetap hidup sebagai suami isteri, dan tidak mempergunakan haknya untuk mengajukan permohonan pembatalan, maka haknya gugur.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
                'pasal' => 'Pasal 28',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => '(1) Batalnya suatu perkawinan dimulai setelah keputusan Pengadilan mempunyai kekuatan hukum yang tetap dan berlaku sejak saat berlangsungnya perkawinan. (2) Keputusan tidak berlaku surut terhadap: a. Anak-anak yang dilahirkan dari perkawinan tersebut; b. Suami atau isteri yang bertindak dengan itikad baik, kecuali terhadap harta bersama, bila pembatalan perkawinan didasarkan atas adanya perkawinan lain yang lebih dahulu; c. Orang-orang ketiga lainnya termasuk dalam a dan b sepanjang mereka memperoleh hak-hak dengan itikad baik sebelum keputusan tentang pembatalan mempunyai kekuatan hukum tetap.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 72',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => '(1) Seorang suami atau isteri dapat mengajukan permohonan pembatalan perkawinan apabila perkawinan dilangsungkan di bawah ancaman yang melanggar hukum. (2) Seorang suami atau isteri dapat mengajukan permohonan pembatalan perkawinan apabila pada waktu berlangsungnya perkawinan terjadi penipuan atau salah sangka mengenai diri suami atau isteri. (3) Apabila ancaman telah berhenti, atau yang bersalah sangka itu menyadari keadaannya dan dalam jangka waktu 6 (enam) bulan setelah itu masih tetap hidup sebagai suami isteri, dan tidak mempergunakan haknya untuk mengajukan permohonan pembatalan, maka haknya gugur.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 73',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => 'Yang dapat mengajukan permohonan pembatalan perkawinan adalah: a. para keluarga dalam garis keturunan lurus ke atas dan ke bawah dari suami atau isteri; b. suami atau isteri; c. Pejabat yang berwenang mengawasi pelaksanaan perkawinan menurut Undang-undang; d. para pihak yang berkepentingan yang mengetahui adanya cacat dalam rukun dan syarat perkawinan menurut hukum Islam dan peraturan perundang-undangan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 74',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => '(1) Permohonan pembatalan perkawinan dapat diajukan kepada Pengadilan Agama yang mewilayahi tempat tinggal suami atau isteri atau perkawinan dilangsungkan. (2) Batalnya suatu perkawinan dimulai setelah putusan Pengadilan Agama mempunyai kekuatan hukum yang tetap dan berlaku sejak saat berlangsungnya perkawinan.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 75',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => 'Keputusan pembatalan perkawinan tidak berlaku surut terhadap: a. perkawinan yang batal karena salah satu dari suami atau isteri murtad; b. anak-anak yang dilahirkan dari perkawinan tersebut; c. pihak ketiga sepanjang mereka memperoleh hak-hak dengan beriktikad baik, sebelum keputusan pembatalan perkawinan mempunyai kekuatan hukum yang tetap.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 76',
                'kategori_perkara' => 'pembatalan_perkawinan',
                'isi_pasal' => 'Batalnya suatu perkawinan tidak akan memutuskan hubungan hukum antara anak dengan orang tuanya.',
            ],

            // ========== TAMBAHAN HADLONAH ==========
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 98',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => '(1) Batas usia anak yang mampu berdiri sendiri atau dewasa adalah 21 tahun, sepanjang anak tersebut tidak bercacat fisik maupun mental atau belum pernah melangsungkan perkawinan. (2) Orang tuanya mewakili anak tersebut mengenai segala perbuatan hukum di dalam dan di luar Pengadilan. (3) Pengadilan Agama dapat menunjuk salah seorang kerabat terdekat yang mampu menunaikan kewajiban tersebut apabila kedua orang tuanya tidak mampu.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 99',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => 'Anak yang sah adalah: a. anak yang dilahirkan dalam atau akibat perkawinan yang sah; b. hasil pembuahan suami isteri yang sah di luar rahim dan dilahirkan oleh isteri tersebut.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 104',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => '(1) Semua biaya penyusuan anak dipertanggungjawabkan kepada ayahnya. Apabila ayahnya telah meninggal dunia, maka biaya penyusuan dibebankan kepada orang yang berkewajiban memberi nafkah kepada ayahnya atau walinya. (2) Penyusuan dilakukan untuk paling lama dua tahun dan dapat dilakukan penyapihan dalam masa kurang dua tahun dengan persetujuan ayah dan ibunya.',
            ],
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 106',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => '(1) Orang tua berkewajiban merawat dan mengembangkan harta anaknya yang belum dewasa atau di bawah pengampuan, dan tidak diperbolehkan memindahkan atau menggadaikannya kecuali karena keperluan yang mendesak jika kepentingan dan kemaslahatan anak itu menghendaki atau suatu kenyataan yang tidak dapat dihindarkan lagi. (2) Orang tua bertanggung jawab atas kerugian yang ditimbulkan karena kesalahan dan kelalaian dari kewajiban tersebut pada ayat (1).',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 35 Tahun 2014 tentang Perlindungan Anak',
                'pasal' => 'Pasal 26',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => '(1) Orang tua berkewajiban dan bertanggung jawab untuk: a. mengasuh, memelihara, mendidik, dan melindungi Anak; b. menumbuhkembangkan Anak sesuai dengan kemampuan, bakat, dan minatnya; c. mencegah terjadinya perkawinan pada usia Anak; dan d. memberikan pendidikan karakter dan penanaman nilai budi pekerti pada Anak.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 35 Tahun 2014 tentang Perlindungan Anak',
                'pasal' => 'Pasal 45',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => '(1) Orang Tua dan Keluarga bertanggung jawab menjaga kesehatan Anak dan merawat Anak sejak dalam kandungan. (2) Dalam hal Orang Tua dan Keluarga yang tidak mampu melaksanakan tanggung jawab sebagaimana dimaksud pada ayat (1), Pemerintah dan Pemerintah Daerah wajib memenuhinya.',
            ],
            [
                'nama_undang' => 'Undang-Undang Nomor 4 Tahun 1979 tentang Kesejahteraan Anak',
                'pasal' => 'Pasal 2',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => '(1) Anak berhak atas kesejahteraan, perawatan, asuhan dan bimbingan berdasarkan kasih sayang baik dalam keluarganya maupun di dalam asuhan khusus untuk tumbuh dan berkembang dengan wajar.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 102 K/Sip/1973',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => 'Dalam menentukan hak asuh anak, kepentingan anak harus diutamakan daripada kepentingan orang tua.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 349 K/AG/2006',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => 'Meskipun anak belum mumayyiz, hak hadhanah dapat diberikan kepada ayah apabila ibu dianggap tidak cakap atau tidak mampu menjamin keselamatan jasmani dan rohani anak.',
            ],
            [
                'nama_undang' => 'SEMA Nomor 4 Tahun 2016',
                'pasal' => 'Rumusan Kamar Agama Angka 4',
                'kategori_perkara' => 'hadlonah',
                'isi_pasal' => 'Dalam perkara hadhanah, hakim harus mempertimbangkan fakta siapa yang selama ini mengasuh dan lebih dekat dengan anak, kemampuan ekonomi, serta kepentingan terbaik bagi anak.',
            ],

            // ========== TAMBAHAN HIBAH ==========
            [
                'nama_undang' => 'Kompilasi Hukum Islam',
                'pasal' => 'Pasal 214',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Warga negara Indonesia yang berada di negara asing dapat membuat surat hibah di hadapan Konsulat atau Kedutaan Republik Indonesia setempat sepanjang isinya tidak bertentangan dengan ketentuan pasal-pasal ini.',
            ],
            [
                'nama_undang' => 'Kitab Undang-Undang Hukum Perdata',
                'pasal' => 'Pasal 1667',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Hibah hanyalah dapat mengenai benda-benda yang sudah ada. Jika hibah itu meliputi benda-benda yang baru akan ada di kemudian hari, maka sekedar mengenai itu hibahnya adalah batal.',
            ],
            [
                'nama_undang' => 'Kitab Undang-Undang Hukum Perdata',
                'pasal' => 'Pasal 1668',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Si penghibah tidak boleh memperjanjikan bahwa ia tetap berkuasa untuk menjual atau memberikan kepada orang lain suatu benda yang termasuk dalam hibah; hibah yang semacam itu, sekedar mengenai benda tersebut, dianggap sebagai batal.',
            ],
            [
                'nama_undang' => 'Kitab Undang-Undang Hukum Perdata',
                'pasal' => 'Pasal 1682',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Tiada suatu hibah, kecuali yang disebutkan dalam pasal 1687, dapat, atas ancaman batal, dilakukan selainnya dengan suatu akta notaris, yang aslinya disimpan oleh notaris itu.',
            ],
            [
                'nama_undang' => 'Kitab Undang-Undang Hukum Perdata',
                'pasal' => 'Pasal 1688',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Suatu hibah tidak dapat ditarik kembali maupun dihapuskan karenanya, melainkan dalam hal-hal yang berikut: 1. karena tidak dipenuhi syarat-syarat dengan mana penghibahan telah dilakukan; 2. jika si penerima hibah telah bersalah melakukan atau membantu melakukan kejahatan yang bertujuan mengambil jiwa si penghibah, atau suatu kejahatan lain terhadap si penghibah; 3. jika ia menolak memberikan tunjangan nafkah kepada si penghibah, setelah orang ini jatuh dalam kemiskinan.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 975 K/Sip/1973',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Hibah yang dibuat secara lisan di hadapan saksi-saksi adalah sah menurut hukum adat.',
            ],
            [
                'nama_undang' => 'Yurisprudensi Mahkamah Agung',
                'pasal' => 'No. 350 K/AG/1994',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Hibah yang melebihi 1/3 bagian adalah batal demi hukum, bukan dapat dibatalkan.',
            ],
            [
                'nama_undang' => 'SEMA Nomor 3 Tahun 2015',
                'pasal' => 'Rumusan Kamar Agama',
                'kategori_perkara' => 'hibah',
                'isi_pasal' => 'Dalam sengketa hibah, hakim harus mempertimbangkan apakah hibah tersebut memenuhi syarat dan rukun hibah menurut hukum Islam, termasuk ijab kabul, kepemilikan yang sah, dan tidak melebihi 1/3 harta.',
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
