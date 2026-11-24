/* =========================================================================
   MODUL MY GARDEN ENGINE V2:
   - Live Countdown 1 Detik (100% Lokal, 0 Beban Server)
   - 5 Lahan Gratis + 15 Lahan Terkunci (Mulai 100 Coin, Berikutnya x1.5)
   - Tanaman Layu Pascapanen (Biaya Buang 5 Coin / Petak)
   - Hanya 1 Pupuk: Pupuk NPK (Mempercepat 2 Menit)
   - 16 Tanaman (Termasuk Flora Endemik Indonesia Berdurasi Lama)
   - Kuis Biologi Wajib Saat Membeli Bibit (Benar +5 Coin, Salah -5 Coin)
   ========================================================================= */

window.MY_GARDEN_CATALOG = {
    totalPlots: 20,
    freePlotsCount: 5,
    wiltClearCost: 5,
    quizRewardCoin: 5,
    quizPenaltyCoin: 5,
    plants: [
        { id: "bayam",         nama: "Bayam Hijau",            latin: "Amaranthus tricolor",      rarity: "Common",    harga: 30,   panenCoin: 70,   panenXp: 8,   durasiDetik: 1200,   durasiLabel: "20 mnt", deskripsi: "Sayuran daun hijau kaya zat besi (Fe), asam folat, dan vitamin A untuk mencegah anemia." },
        { id: "wortel",        nama: "Wortel",                 latin: "Daucus carota",            rarity: "Common",    harga: 40,   panenCoin: 90,   panenXp: 10,  durasiDetik: 1800,   durasiLabel: "30 mnt", deskripsi: "Umbi akar kaya beta-karoten yang cepat tumbuh di tanah gembur." },
        { id: "padi",          nama: "Padi Sawah",             latin: "Oryza sativa",             rarity: "Common",    harga: 55,   panenCoin: 120,  panenXp: 12,  durasiDetik: 2700,   durasiLabel: "45 mnt", deskripsi: "Tanaman pangan serelia Poaceae penghasil karbohidrat amilum utama masyarakat Indonesia." },
        { id: "jagung",        nama: "Jagung Manis",           latin: "Zea mays",                 rarity: "Uncommon",  harga: 105,  panenCoin: 230,  panenXp: 16,  durasiDetik: 5400,   durasiLabel: "1,5 jam",deskripsi: "Tumbuhan C4 monokotil penghasil karbohidrat kompleks dan serat pangan tinggi." },
        { id: "kedelai",       nama: "Kedelai Kuning",         latin: "Glycine max",              rarity: "Uncommon",  harga: 120,  panenCoin: 265,  panenXp: 18,  durasiDetik: 9000,   durasiLabel: "2,5 jam",deskripsi: "Polong-polongan Fabaceae bersimbiosis dengan Rhizobium, sumber protein nabati lengkap." },
        { id: "brokoli",       nama: "Brokoli Segar",          latin: "Brassica oleracea",        rarity: "Rare",      harga: 280,  panenCoin: 620,  panenXp: 30,  durasiDetik: 14400,  durasiLabel: "4 jam",  deskripsi: "Bunga hijau padat antioksidan, vitamin C, vitamin K, dan serat tinggi." },
        { id: "alpukat",       nama: "Alpukat Mentega",        latin: "Persea americana",         rarity: "Rare",      harga: 410,  panenCoin: 910,  panenXp: 42,  durasiDetik: 25200,  durasiLabel: "7 jam",  deskripsi: "Buah kaya lemak tak jenuh tunggal (Omega-9) yang menyehatkan jantung dan pembuluh darah." },
        { id: "daisy",         nama: "Bunga Daisy",            latin: "Bellis perennis",          rarity: "Common",    harga: 60,   panenCoin: 130,  panenXp: 12,  durasiDetik: 3600,   durasiLabel: "1 jam",  deskripsi: "Bunga majemuk Asteraceae berwarna putih dengan cakram kuning cerah." },
        { id: "tulip",         nama: "Tulip Merah",            latin: "Tulipa gesneriana",        rarity: "Common",    harga: 90,   panenCoin: 195,  panenXp: 15,  durasiDetik: 7200,   durasiLabel: "2 jam",  deskripsi: "Tumbuhan monokotil berbunga merah cerah yang berkembang biak dengan umbi lapis." },
        { id: "tomat",         nama: "Tomat Ceri",             latin: "Solanum lycopersicum",     rarity: "Uncommon",  harga: 130,  panenCoin: 280,  panenXp: 18,  durasiDetik: 10800,  durasiLabel: "3 jam",  deskripsi: "Buah buni merah segar anggota Solanaceae yang kaya likopen dan vitamin C." },
        { id: "pukul_empat",   nama: "Bunga Pukul Empat",      latin: "Mirabilis jalapa",         rarity: "Uncommon",  harga: 150,  panenCoin: 330,  panenXp: 20,  durasiDetik: 10800,  durasiLabel: "3 jam",  deskripsi: "Flora model genetika klasik (Merah, Merah Muda, Putih) yang mekar menjelang sore hari." },
        { id: "matahari",      nama: "Bunga Matahari",         latin: "Helianthus annuus",        rarity: "Uncommon",  harga: 180,  panenCoin: 390,  panenXp: 22,  durasiDetik: 14400,  durasiLabel: "4 jam",  deskripsi: "Bunga ceria yang menunjukkan gerak fototropisme mengikuti arah matahari." },
        { id: "stroberi",      nama: "Stroberi Manis",         latin: "Fragaria × ananassa",      rarity: "Uncommon",  harga: 240,  panenCoin: 520,  panenXp: 25,  durasiDetik: 18000,  durasiLabel: "5 jam",  deskripsi: "Buah semu merah manis yang berkembang biak vegetatif menggunakan stolon." },
        { id: "kaktus",        nama: "Kaktus Emas",            latin: "Echinocactus grusonii",    rarity: "Rare",      harga: 350,  panenCoin: 770,  panenXp: 35,  durasiDetik: 21600,  durasiLabel: "6 jam",  deskripsi: "Tumbuhan xerofit berduri dengan batang sukulen penyimpan air dan fotosintesis CAM." },
        { id: "melati",        nama: "Melati Putih",           latin: "Jasminum sambac",          rarity: "Rare",      harga: 450,  panenCoin: 980,  panenXp: 45,  durasiDetik: 28800,  durasiLabel: "8 jam",  deskripsi: "Puspa Bangsa Indonesia berkelopak putih harum yang melambangkan kesucian." },
        { id: "anggrek",       nama: "Anggrek Bulan",          latin: "Phalaenopsis amabilis",    rarity: "Rare",      harga: 580,  panenCoin: 1280, panenXp: 55,  durasiDetik: 36000,  durasiLabel: "10 jam", deskripsi: "Puspa Pesona Indonesia yang hidup epifit dengan jaringan velamen di akarnya." },
        { id: "kantong_semar", nama: "Kantong Semar",          latin: "Nepenthes rajah",          rarity: "Epic",      harga: 820,  panenCoin: 1850, panenXp: 75,  durasiDetik: 50400,  durasiLabel: "14 jam", deskripsi: "Tumbuhan insektivora endemik tropis dengan modifikasi ujung daun berupa kantong." },
        { id: "edelweiss",     nama: "Edelweiss Jawa",         latin: "Anaphalis javanica",       rarity: "Epic",      harga: 1100, panenCoin: 2500, panenXp: 95,  durasiDetik: 64800,  durasiLabel: "18 jam", deskripsi: "Bunga abadi pegunungan tinggi Indonesia yang mengandung hormon etilen pencegah gugur." },
        { id: "cendana",       nama: "Pohon Cendana",          latin: "Santalum album",           rarity: "Epic",      harga: 1500, panenCoin: 3450, panenXp: 125, durasiDetik: 86400,  durasiLabel: "24 jam", deskripsi: "Flora aromatik khas Nusa Tenggara Timur yang bersifat hemiparasit akar pada fase awal." },
        { id: "bunga_bangkai", nama: "Bunga Bangkai Raksasa",  latin: "Amorphophallus titanum",   rarity: "Legendary", harga: 2200, panenCoin: 5200, panenXp: 175, durasiDetik: 129600, durasiLabel: "36 jam", deskripsi: "Flora endemik Sumatra dengan perbungaan majemuk (spadiks) tertinggi di dunia." },
        { id: "rafflesia",     nama: "Rafflesia arnoldii",     latin: "Rafflesia arnoldii",       rarity: "Legendary", harga: 3000, panenCoin: 7200, panenXp: 230, durasiDetik: 172800, durasiLabel: "48 jam", deskripsi: "Puspa Langka Indonesia asal Bengkulu, holoparasit tanpa klorofil dengan bunga tunggal terbesar." },
        { id: "anggrek_hitam", nama: "Anggrek Hitam Kaltim",   latin: "Coelogyne pandurata",      rarity: "Legendary", harga: 4000, panenCoin: 9800, panenXp: 300, durasiDetik: 216000, durasiLabel: "60 jam", deskripsi: "Maskot flora Kalimantan Timur yang memiliki lidah bunga (labellum) hitam pekat." },
        { id: "ercis",         nama: "Kacang Ercis",           latin: "Pisum sativum",            rarity: "Uncommon",  harga: 140,  panenCoin: 310,  panenXp: 19,  durasiDetik: 7200,   durasiLabel: "2 jam",  deskripsi: "Tanaman percobaan klasik Gregor Mendel dengan variasi bunga ungu/putih dan polong hijau." },
        { id: "mawar",         nama: "Bunga Mawar",            latin: "Rosa hybrida",             rarity: "Rare",      harga: 380,  panenCoin: 840,  panenXp: 38,  durasiDetik: 18000,  durasiLabel: "5 jam",  deskripsi: "Tanaman hias dikotil berbatang berduri dengan variasi warna mahkota merah, merah muda, dan putih." },
        { id: "kristal",       nama: "Bunga Kristal",          latin: "Flora Sains Mitologis",    rarity: "Legendary", harga: 5500, panenCoin: 14000,panenXp: 420, durasiDetik: 259200, durasiLabel: "72 jam", deskripsi: "Flora legendaris berkilau permata yang hanya mekar setelah kesabaran penuh 3 hari." }
    ],
    fertilizers: [
        { id: "pupuk_npk", nama: "Pupuk NPK", harga: 30, percepatDetik: 120, ikon: "🧪", deskripsi: "Mempercepat pertumbuhan tanaman selama 2 menit." }
    ]
};

// =========================================================================
// BANK SOAL BIOLOGI WAJIB SAAT MEMBELI BIBIT (DIPUTAR PER TANAMAN)
// =========================================================================
window.MY_GARDEN_PLANT_QUIZ = {
    bayam: [
        { q: "Mineral mikro utama pada daun bayam hijau yang berperan penting dalam pembentukan hemoglobin sel darah merah adalah...", opts: ["Zat besi (Fe)", "Natrium (Na)", "Yodium (I)", "Silikon (Si)"], ans: 0, info: "Zat besi (Fe) adalah inti gugus heme pada hemoglobin pengangkut oksigen." },
        { q: "Pigmen hijau pada daun bayam yang menangkap energi cahaya matahari untuk reaksi fotosintesis adalah...", opts: ["Klorofil", "Likopen", "Melanin", "Hemoglobin"], ans: 0, info: "Klorofil a dan b di dalam kloroplas menyerap spektrum cahaya merah dan biru." },
        { q: "Kekurangan asupan zat besi dan asam folat dari sayuran hijau seperti bayam dapat memicu gangguan darah berupa...", opts: ["Anemia defisiensi besi", "Hipertensi kronis", "Diabetes insipidus", "Osteoporosis"], ans: 0, info: "Kekurangan Fe menurunkan produksi hemoglobin sehingga suplai oksigen ke jaringan berkurang." }
    ],
    padi: [
        { q: "Tumbuhan padi (Oryza sativa) termasuk kelompok monokotil famili Poaceae. Ciri sistem perakaran tanaman padi adalah...", opts: ["Akar serabut", "Akar tunggang berkambium", "Akar haustorium", "Akar napas mangrove"], ans: 0, info: "Semua tumbuhan monokotil termasuk padi memiliki sistem perakaran serabut." },
        { q: "Cadangan makanan utama pada endosperma butir beras (padi) yang menjadi sumber energi utama manusia adalah...", opts: ["Amilum (pati)", "Selulosa murni", "Keratin", "Kitin"], ans: 0, info: "Amilum adalah polisakarida yang dipecah enzim amilase menjadi maltosa dan glukosa." },
        { q: "Bunga padi berukuran kecil tanpa mahkota mencolok serta serbuk sari ringan sehingga penyerbukannya dibantu oleh...", opts: ["Angin (anemogami)", "Kelelawar (kiropterogami)", "Siput (malakogami)", "Burung (ornitogami)"], ans: 0, info: "Anemogami merupakan penyerbukan alami melalui perantara angin." }
    ],
    jagung: [
        { q: "Jagung (Zea mays) memiliki efisiensi fotosintesis tinggi di daerah panas karena menggunakan jalur fiksasi karbon...", opts: ["Jalur C4", "Jalur C3 murni", "Kemosintesis sulfur", "Fermentasi laktat"], ans: 0, info: "Tumbuhan C4 meminimalkan fotorespirasi dengan memisahkan fiksasi CO2 di sel mesofil dan seludang berkas." },
        { q: "Pada tanaman jagung, bunga jantan (malai) berada di pucuk batang sedangkan bunga betina (tongkol) di ketiak daun pada satu individu. Sifat ini disebut...", opts: ["Berumah satu (monoesis)", "Berumah dua (diesis)", "Apomiksis", "Partenogenesis"], ans: 0, info: "Tumbuhan monoesis memiliki bunga jantan dan bunga betina terpisah namun pada satu pohon." },
        { q: "Struktur akar tambahan yang tumbuh dari buku-buku batang bawah jagung untuk menopang batang agar tidak roboh disebut...", opts: ["Akar tunjang / akar sokong", "Akar gantung", "Akar pengisap", "Rizoid"], ans: 0, info: "Akar adventif penunjang memperkuat posisi tegak batang jagung." }
    ],
    kedelai: [
        { q: "Bintil akar tanaman kedelai (Glycine max) dihuni bakteri pengikat nitrogen udara (N2) menjadi amonia yang bersimbiosis mutualisme, yaitu...", opts: ["Rhizobium sp.", "Escherichia coli", "Vibrio cholerae", "Mycobacterium tuberculosis"], ans: 0, info: "Bakteri Rhizobium membantu menyuburkan tanah dengan fiksasi nitrogen biologis." },
        { q: "Biji kedelai menjadi bahan baku utama tempe dan tahu karena kandungan makronutriennya yang sangat tinggi akan...", opts: ["Protein nabati", "Garam mineral natrium", "Asam klorida", "Laktosa"], ans: 0, info: "Kacang-kacangan famili Fabaceae kaya akan protein nabati dan asam amino esensial." },
        { q: "Sebagai anggota tumbuhan dikotil famili Fabaceae, tipe pertulangan daun tanaman kedelai adalah...", opts: ["Menyirip", "Sejajar", "Lurus tunggal", "Melengkung seperti pita"], ans: 0, info: "Tumbuhan dikotil umumnya berakar tunggang dan bertulang daun menyirip atau menjari." }
    ],
    brokoli: [
        { q: "Bagian hijau padat pada tanaman brokoli (Brassica oleracea) yang dikonsumsi manusia merupakan modifikasi dari organ...", opts: ["Kuncup bunga majemuk", "Umbi akar", "Umbi lapis", "Rimpang bawah tanah"], ans: 0, info: "Kepala brokoli tersusun atas ratusan kuncup bunga muda yang belum mekar." },
        { q: "Vitamin larut air pada brokoli yang berperan sebagai antioksidan sekaligus membantu penyerapan zat besi di usus adalah...", opts: ["Vitamin C (asam askorbat)", "Vitamin D", "Vitamin K", "Vitamin E"], ans: 0, info: "Vitamin C larut air dan meningkatkan bioavailabilitas penyerapan zat besi non-heme." },
        { q: "Serat selulosa tinggi pada brokoli tidak dicerna oleh enzim manusia, namun sangat penting di usus besar untuk...", opts: ["Memperlancar gerak peristaltik dan mencegah konstipasi (sembelit)", "Menghentikan aliran darah", "Menggantikan fungsi asam lambung", "Menghancurkan vili usus halus"], ans: 0, info: "Serat pangan menambah massa feses dan menjaga kesehatan mikrobiota usus." }
    ],
    alpukat: [
        { q: "Buah alpukat terkenal menyehatkan sistem kardiovaskular karena kaya akan lemak baik berupa...", opts: ["Asam lemak tak jenuh tunggal (Omega-9 / asam oleat)", "Lemak trans sintetis", "Kolesterol LDL tinggi", "Lilin parafin"], ans: 0, info: "Lemak tak jenuh tunggal membantu menurunkan kolesterol LDL dan menjaga elastisitas pembuluh darah." },
        { q: "Enzim pencernaan utama yang disekresikan pankreas untuk menghidrolisis lemak alpukat menjadi asam lemak dan gliserol di usus halus adalah...", opts: ["Lipase", "Ptialin (amilase)", "Pepsin", "Renin"], ans: 0, info: "Garam empedu mengemulsikan lemak terlebih dahulu, lalu enzim lipase mencernanya." },
        { q: "Secara botani, buah alpukat yang berdaging lembut dan memiliki satu biji besar berkulit keras di tengahnya digolongkan sebagai...", opts: ["Buah buni berbiji tunggal", "Buah polong kering", "Buah semu majemuk", "Buah agregat"], ans: 0, info: "Alpukat berkembang dari satu bakal buah tunggal dengan perikarp berdaging." }
    ],
    wortel: [
        { q: "Bagian wortel yang biasa dikonsumsi manusia merupakan hasil modifikasi dari organ...", opts: ["Umbi batang", "Umbi akar", "Umbi lapis", "Rimpang (rizoma)"], ans: 1, info: "Wortel adalah umbi akar (radix tuberosa) yang menyimpan cadangan makanan." },
        { q: "Pigmen dominan yang memberi warna jingga cerah pada umbi wortel dan menjadi prekursor vitamin A adalah...", opts: ["Klorofil a", "Antosianin", "Beta-karoten", "Fikosianin"], ans: 2, info: "Beta-karoten adalah pigmen karotenoid yang diubah tubuh menjadi vitamin A." },
        { q: "Berdasarkan kelompok dikotilnya, sistem perakaran tumbuhan wortel adalah...", opts: ["Akar tunggang", "Akar serabut", "Akar napas", "Akar gantung"], ans: 0, info: "Wortel termasuk tumbuhan dikotil sehingga memiliki sistem akar tunggang." }
    ],
    daisy: [
        { q: "Bunga Daisy (Bellis perennis) termasuk dalam famili tumbuhan berbunga majemuk, yaitu...", opts: ["Poaceae", "Asteraceae", "Orchidaceae", "Fabaceae"], ans: 1, info: "Bunga Daisy termasuk famili Asteraceae dengan susunan bunga majemuk bongkol." },
        { q: "Bagian tengah berwarna kuning pada bunga Daisy tersusun atas puluhan bunga kecil yang disebut...", opts: ["Bunga pita", "Bunga tabung (floret cakram)", "Kelopak tambahan", "Braktea"], ans: 1, info: "Bagian kuning tengah adalah bunga tabung fertil, sedangkan mahkota putih adalah bunga pita." },
        { q: "Penyerbukan bunga Daisy yang dibantu oleh lebah atau kupu-kupu disebut...", opts: ["Anemogami", "Hidrogami", "Entomogami", "Ornitogami"], ans: 2, info: "Entomogami adalah penyerbukan yang diperantarai oleh serangga." }
    ],
    tulip: [
        { q: "Tumbuhan tulip menyimpan cadangan makanan dan berkembang biak secara vegetatif melalui...", opts: ["Umbi lapis (bulbus)", "Stolon", "Umbi akar", "Spora"], ans: 0, info: "Tulip memiliki umbi lapis (bulbus) yang tersusun atas pelepah daun berdaging." },
        { q: "Tulip termasuk tumbuhan monokotil. Ciri pertulangan daun yang dimiliki tulip adalah...", opts: ["Menyirip", "Menjari", "Sejajar", "Melengkung bercabang"], ans: 2, info: "Tumbuhan monokotil seperti famili Liliaceae (tulip) bertulang daun sejajar." },
        { q: "Gerak mekarnya bunga tulip saat suhu udara naik di musim semi merupakan contoh gerak...", opts: ["Termonasti", "Seismonasti", "Fotonasti", "Tigmotropisme"], ans: 0, info: "Termonasti adalah gerak nasti tumbuhan yang dipengaruhi oleh rangsangan perubahan suhu." }
    ],
    tomat: [
        { q: "Pigmen karotenoid yang menyebabkan buah tomat matang berwarna merah cerah adalah...", opts: ["Xantofil", "Likopen", "Klorofil b", "Fikoeritrin"], ans: 1, info: "Likopen adalah pigmen karotenoid merah sekaligus antioksidan kuat pada tomat." },
        { q: "Secara botani, buah tomat yang berdaging tebal dengan banyak biji di dalamnya digolongkan sebagai...", opts: ["Buah buni (berry)", "Buah polong", "Buah batu (drupa)", "Buah semu"], ans: 0, info: "Tomat adalah buah sejati berdaging tipe buah buni (berry)." },
        { q: "Tumbuhan tomat (Solanum lycopersicum) satu famili dengan kentang dan terung, yaitu famili...", opts: ["Rutaceae", "Solanaceae", "Malvaceae", "Arecaceae"], ans: 1, info: "Tomat, kentang, cabai, dan terung tergabung dalam famili Solanaceae." }
    ],
    pukul_empat: [
        { q: "Bunga Pukul Empat (Mirabilis jalapa) terkenal dalam kajian genetika karena persilangan bunga merah (MM) dan putih (mm) menghasilkan F1 berwarna merah muda (Mm). Sifat ini disebut...", opts: ["Dominansi penuh", "Intermediet (dominansi tak sempurna)", "Epistasis resesif", "Mutasi kromosom"], ans: 1, info: "Pada sifat intermediet, alel dominan tidak menutupi alel resesif secara penuh sehingga muncul warna antara (merah muda)." },
        { q: "Gerak mekarnya bunga Mirabilis jalapa secara rutin pada sore hari akibat perubahan intensitas cahaya disebut gerak...", opts: ["Fotonasti", "Seismonasti", "Geotropisme", "Hidrotropisme"], ans: 0, info: "Fotonasti adalah gerak nasti tumbuhan yang dipengaruhi oleh rangsangan perubahan cahaya." },
        { q: "Menurut Hukum Mendel I (Segregasi Bebas), pada saat pembentukan gamet dari individu bergenotipe Mm, alel M dan m akan...", opts: ["Selalu menempel bersama dalam satu gamet", "Memisah secara bebas sehingga terbentuk gamet M dan gamet m", "Menghilang seluruhnya", "Berubah menjadi alel resesif ganda"], ans: 1, info: "Hukum Segregasi Bebas menyatakan pasangan alel memisah secara bebas saat pembelahan meiosis." }
    ],
    matahari: [
        { q: "Gerak pucuk bunga matahari muda mengikuti pergerakan arah datangnya cahaya matahari disebut...", opts: ["Geotropisme", "Fototropisme / Heliotropisme", "Kemotropisme", "Tigmonasti"], ans: 1, info: "Heliotropisme adalah bentuk fototropisme yang dipengaruhi distribusi hormon auksin." },
        { q: "Hormon tumbuhan yang berperan utama dalam pemanjangan sel batang pada sisi gelap saat fototropisme adalah...", opts: ["Auksin", "Asam absisat", "Gas etilen", "Asam traumalin"], ans: 0, info: "Auksin terakumulasi di sisi yang tidak terkena cahaya sehingga batang membengkok ke arah sinar." },
        { q: "Biji bunga matahari (kuaci) kaya akan cadangan makanan utama berupa...", opts: ["Amilum murni", "Lipid (minyak nabati) dan protein", "Selulosa", "Kitin"], ans: 1, info: "Biji bunga matahari menyimpan banyak minyak nabati tak jenuh dan protein." }
    ],
    stroberi: [
        { q: "Perkembangbiakan vegetatif alami pada tanaman stroberi berlangsung menggunakan batang menjalar di atas tanah yang disebut...", opts: ["Rizoma", "Stolon (geragih)", "Umbi lapis", "Tunas adventif"], ans: 1, info: "Stolon/geragih tumbuh menjalar di atas permukaan tanah dan membentuk individu baru di bukunya." },
        { q: "Bagian merah berdaging manis pada stroberi secara botani berkembang dari dasar bunga (reseptakel), sehingga disebut...", opts: ["Buah semu (buah aksesori)", "Buah sejati tunggal", "Buah polong", "Buah kering pecah"], ans: 0, info: "Buah sejati stroberi justru bintik-bintik kecil (achene) di permukaannya, bukan daging merahnya." },
        { q: "Pigmen larut air yang memberi warna merah pada buah stroberi matang adalah...", opts: ["Klorofil a", "Antosianin", "Fikosianin", "Fukosantin"], ans: 1, info: "Antosianin adalah pigmen flavonoid yang disimpan di vakuola sel tumbuhan." }
    ],
    kaktus: [
        { q: "Duri-duri tajam pada tumbuhan kaktus merupakan hasil modifikasi dari organ...", opts: ["Akar", "Daun", "Bunga", "Biji"], ans: 1, info: "Daun kaktus bermodifikasi menjadi duri untuk menekan laju transpirasi (penguapan air)." },
        { q: "Untuk menghemat air di lingkungan kering, kaktus membuka stomatanya pada malam hari melalui mekanisme fotosintesis...", opts: ["Jalur C3", "Jalur C4", "Jalur CAM", "Fermentasi"], ans: 2, info: "Tumbuhan CAM mengikat CO2 di malam hari menjadi asam malat lalu memprosesnya di siang hari." },
        { q: "Berdasarkan adaptasinya terhadap habitat yang sangat minim air, kaktus digolongkan sebagai tumbuhan...", opts: ["Hidrofit", "Higrofit", "Xerofit", "Halofit"], ans: 2, info: "Xerofit adalah tumbuhan yang beradaptasi hidup di lingkungan kering/gurun." }
    ],
    melati: [
        { q: "Dalam penetapan flora nasional Indonesia, Melati Putih (Jasminum sambac) menyandang gelar sebagai...", opts: ["Puspa Langka", "Puspa Pesona", "Puspa Bangsa", "Puspa Nusantara"], ans: 2, info: "Melati Putih adalah Puspa Bangsa, Anggrek Bulan Puspa Pesona, dan Rafflesia Puspa Langka." },
        { q: "Aroma harum kuat pada bunga melati di malam hari berfungsi secara ekologis untuk...", opts: ["Menarik serangga penyerbuk nokturnal", "Menghambat fotosintesis", "Mengusir semua serangga", "Mempercepat gugurnya daun"], ans: 0, info: "Senyawa volatil harum menarik ngengat dan serangga malam untuk membantu penyerbukan." },
        { q: "Bunga melati yang memiliki benang sari dan putik dalam satu bunga disebut bunga...", opts: ["Bunga sempurna (hermafrodit)", "Bunga jantan saja", "Bunga mandul", "Bunga tak lengkap"], ans: 0, info: "Bunga sempurna memiliki dua alat kelamin sekaligus: benang sari dan putik." }
    ],
    anggrek: [
        { q: "Anggrek Bulan (Phalaenopsis amabilis) yang menempel pada batang pohon lain tanpa mengambil nutrien inangnya disebut hidup secara...", opts: ["Parasit", "Epifit", "Saprofit", "Simbiosis parasitisme"], ans: 1, info: "Epifit hanya menumpang tempat hidup untuk mendapat cahaya matahari tanpa merugikan inang." },
        { q: "Jaringan spons khusus berlapis putih pada akar udara anggrek yang berfungsi menyerap uap air dan embun disebut...", opts: ["Lentisel", "Velamen", "Kambium", "Empulur"], ans: 1, info: "Velamen adalah epidermis ganda pada akar anggrek epifit untuk menyerap air hujan dan kelembapan." },
        { q: "Dalam flora identitas nasional Indonesia, Anggrek Bulan ditetapkan sebagai...", opts: ["Puspa Bangsa", "Puspa Pesona", "Puspa Langka", "Puspa Rimba"], ans: 1, info: "Anggrek Bulan (Phalaenopsis amabilis) adalah Puspa Pesona Indonesia." }
    ],
    kantong_semar: [
        { q: "Struktur kantong penangkap serangga pada Kantong Semar (Nepenthes) merupakan modifikasi dari organ...", opts: ["Akar napas", "Ujung daun", "Kelopak bunga", "Batang bawah tanah"], ans: 1, info: "Sulur dan kantong Nepenthes terbentuk dari modifikasi helai/ujung daun." },
        { q: "Mengapa tumbuhan Kantong Semar memangsa serangga di habitat rawa gambut?", opts: ["Karena tidak memiliki klorofil", "Untuk memenuhi kebutuhan unsur Nitrogen (N) dari tanah yang miskin hara", "Untuk memperoleh oksigen", "Karena tidak memiliki akar"], ans: 1, info: "Kantong Semar tetap berfotosintesis, tetapi mencerna serangga untuk suplai nitrogen." },
        { q: "Enzim pencerna protein serangga yang disekresikan di dalam cairan kantong Nepenthes adalah...", opts: ["Amilase", "Nepentesin (protease)", "Lipase", "Katalase"], ans: 1, info: "Cairan asam di dalam kantong mengandung enzim protease (nepentesin) untuk mengurai protein mangsa." }
    ],
    edelweiss: [
        { q: "Edelweiss Jawa (Anaphalis javanica) dikenal sebagai 'bunga abadi' karena tidak mudah rontok akibat adanya hormon...", opts: ["Etilen yang menghambat gugur kelopak", "Giberelin murni", "Auksin akar", "Klorofil tinggi"], ans: 0, info: "Selain struktur kelopak keringnya, senyawa pengatur di bunga Edelweiss membuatnya sangat awet." },
        { q: "Habitat alami tumbuhan Edelweiss Jawa di Indonesia berada di ekosistem...", opts: ["Hutan mangrove pesisir", "Zona subalpin / lereng gunung tinggi", "Rawa gambut dataran rendah", "Padang lamun laut"], ans: 1, info: "Anaphalis javanica merupakan tumbuhan pionir di tanah vulkanik pegunungan tinggi Jawa." },
        { q: "Status perlindungan Edelweiss Jawa di kawasan taman nasional mengharuskan pengunjung untuk...", opts: ["Memetik secukupnya", "Dilarang keras memetik dan merusaknya (dilindungi undang-undang)", "Membawa pulang akarnya", "Menebang batangnya"], ans: 1, info: "Edelweiss Jawa dilindungi undang-undang konservasi alam; memetiknya di taman nasional adalah pelanggaran hukum." }
    ],
    cendana: [
        { q: "Tumbuhan Cendana (Santalum album) terkenal sebagai flora penghasil minyak atsiri harum yang berasal dari provinsi...", opts: ["Nusa Tenggara Timur (NTT)", "Riau", "Kalimantan Barat", "Aceh"], ans: 0, info: "Cendana adalah flora identitas khas Nusa Tenggara Timur (terutama Pulau Timor dan Sumba)." },
        { q: "Pada fase awal pertumbuhannya, akar pohon Cendana menempel pada akar tumbuhan lain untuk mengambil air dan mineral. Sifat ini disebut...", opts: ["Saprofit", "Hemiparasit (parasit fakultatif)", "Holoparasit", "Epifit murni"], ans: 1, info: "Cendana tetap berdaun hijau untuk fotosintesis, namun akarnya membentuk haustorium pada inang." },
        { q: "Bagian pohon Cendana yang paling kaya akan minyak atsiri beraroma harum (santalol) adalah...", opts: ["Kelopak bunga", "Kayu teras (bagian tengah batang dan akar)", "Bulu daun", "Kulit buah"], ans: 1, info: "Minyak cendana disuling dari kayu teras (heartwood) batang dan akarnya." }
    ],
    bunga_bangkai: [
        { q: "Bunga Bangkai Raksasa (Amorphophallus titanum) merupakan flora endemik hutan hujan tropis Pulau...", opts: ["Sumatra", "Sulawesi", "Papua", "Bali"], ans: 0, info: "Amorphophallus titanum asli hutan hujan dataran rendah Pulau Sumatra." },
        { q: "Berbeda dengan Rafflesia, Bunga Bangkai Raksasa memiliki tangkai perbungaan tinggi yang disebut...", opts: ["Spadiks (tongkol bunga)", "Haustorium", "Stolon", "Rizoid"], ans: 0, info: "Struktur menjulang di tengah adalah spadiks yang dikelilingi seludang (spatha)." },
        { q: "Bau menyengat seperti daging busuk pada Bunga Bangkai Raksasa berfungsi untuk...", opts: ["Menarik lalat dan kumbang bangkai sebagai penyerbuk", "Membunuh tumbuhan sekitar", "Mengusir cahaya matahari", "Menyimpan cadangan air"], ans: 0, info: "Bau busuk dan panas dari spadiks memikat lalat/kumbang untuk membantu penyerbukan." }
    ],
    rafflesia: [
        { q: "Rafflesia arnoldii tidak memiliki daun, batang sejati, maupun klorofil sehingga seluruh nutriennya diambil dari tumbuhan inang (Tetrastigma). Sifat ini disebut...", opts: ["Autotrof", "Holoparasit (parasit obligat)", "Epifit", "Komensalisme"], ans: 1, info: "Rafflesia adalah tumbuhan holoparasit yang 100% bergantung pada liana inang Tetrastigma." },
        { q: "Provinsi di Indonesia yang dikenal luas sebagai habitat utama dan ikon Rafflesia arnoldii adalah...", opts: ["Bengkulu", "Bali", "Gorontalo", "Maluku"], ans: 0, info: "Rafflesia arnoldii pertama kali didokumentasikan secara ilmiah di hutan Bengkulu (Sumatra)." },
        { q: "Struktur khusus milik Rafflesia arnoldii yang menembus jaringan floem dan xilem inang untuk menyerap nutrien disebut...", opts: ["Stomata", "Haustorium", "Velamen", "Lentisel"], ans: 1, info: "Rafflesia menyerap air dan nutrien inang menggunakan jaringan benang haustorium." }
    ],
    anggrek_hitam: [
        { q: "Anggrek Hitam (Coelogyne pandurata) merupakan flora maskot kebanggaan dari provinsi...", opts: ["Kalimantan Timur", "Jawa Tengah", "Sumatra Barat", "Lampung"], ans: 0, info: "Anggrek Hitam (Coelogyne pandurata) adalah flora identitas Provinsi Kalimantan Timur." },
        { q: "Bagian bunga Anggrek Hitam yang sebenarnya berwarna hitam pekat adalah...", opts: ["Seluruh daunnya", "Lidah bunga (labellum)", "Batang semunya", "Akarnya"], ans: 1, info: "Mahkota luarnya hijau kekuningan, sedangkan lidah bunga (labellum)-nya berwarna hitam pekat." },
        { q: "Pelestarian Anggrek Hitam di habitat aslinya (seperti Cagar Alam Kersik Luway) disebut konservasi...", opts: ["In situ", "Ex situ", "Kultur jaringan", "Domestikasi"], ans: 0, info: "Konservasi in situ berarti melindungi spesies langsung di habitat alaminya." }
    ],
    ercis: [
        { q: "Alasan utama Gregor Mendel memilih Kacang Ercis (Pisum sativum) sebagai objek percobaan genetika adalah...", opts: ["Memiliki banyak sifat beda yang kontras, daur hidup singkat, dan mudah disilangkan maupun menyerbuk sendiri", "Hanya dapat tumbuh di daerah kutub bersalju", "Memiliki masa panen lebih dari 10 tahun", "Tidak menghasilkan biji maupun bunga"], ans: 0, info: "Pisum sativum cepat berbuah, punya 7 pasang sifat kontras tegas, dan menghasilkan banyak keturunan." },
        { q: "Tanaman Kacang Ercis termasuk famili polong-polongan (Fabaceae) yang bijinya tersusun atas dua keping lembaga, sehingga termasuk...", opts: ["Tumbuhan dikotil", "Tumbuhan monokotil", "Tumbuhan lumut", "Tumbuhan paku"], ans: 0, info: "Kacang-kacangan Fabaceae adalah tumbuhan berbiji belah (dikotil)." },
        { q: "Warna ungu pada bunga Pisum sativum bersifat dominan penuh terhadap warna putih. Jika individu Pp disilangkan sesamanya, rasio fenotipe keturunannya adalah...", opts: ["3 Ungu : 1 Putih", "1 Ungu : 1 Putih", "100% Putih", "9 : 3 : 3 : 1"], ans: 0, info: "Persilangan monohibrid heterozigot dominan penuh menghasilkan rasio fenotipe 3 : 1." }
    ],
    mawar: [
        { q: "Duri tempel (spina/akuleus) pada batang mawar secara morfologi berfungsi utama untuk...", opts: ["Melindungi batang dan bunga dari hewan herbivora", "Menyerap gas nitrogen dari udara", "Melakukan pembelahan meiosis", "Menghasilkan klorofil utama"], ans: 0, info: "Duri tempel merupakan penonjolan jaringan epidermis/korteks sebagai alat pertahanan fisik." },
        { q: "Perbanyakan vegetatif buatan yang paling umum dilakukan petani untuk mempertahankan warna bunga mawar yang identik dengan induknya adalah...", opts: ["Stek batang dan okulasi (menempel)", "Pembentukan spora", "Fragmentasi akar serabut", "Konjugasi"], ans: 0, info: "Stek batang dan okulasi menghasilkan anakan klonal yang sifat genetiknya sama persis dengan induk." },
        { q: "Pigmen yang memberikan warna merah dan merah muda pada kelopak mahkota bunga mawar adalah...", opts: ["Antosianin", "Klorofil a", "Hemoglobin", "Melanin"], ans: 0, info: "Antosianin larut air di vakuola sel mahkota bunga dan menentukan spektrum warna merah hingga ungu." }
    ],
    kristal: [
        { q: "Jaringan pembuluh tumbuhan yang bertugas mengangkut air dan mineral dari akar menuju daun adalah...", opts: ["Floem", "Xilem", "Kolenkim", "Sklerenkim"], ans: 1, info: "Xilem mengangkut air dan unsur hara dari akar ke daun, sedangkan floem mengangkut hasil fotosintesis." },
        { q: "Reaksi terang fotosintesis yang menghasilkan ATP, NADPH, dan oksigen berlangsung di bagian kloroplas bernama...", opts: ["Stroma", "Grana (membran tilakoid)", "Krista mitokondria", "Ribosom"], ans: 1, info: "Reaksi terang terjadi di membran tilakoid (grana), sedangkan Siklus Calvin terjadi di stroma." },
        { q: "Proses keluarnya uap air dari tumbuhan melalui stomata daun ke atmosfer disebut...", opts: ["Gutasi", "Transpirasi", "Respirasi anaerob", "Imbibisi"], ans: 1, info: "Transpirasi membantu daya isap daun untuk menaikkan air lewat pembuluh xilem." }
    ]
};

// Kamus Variasi Warna & Sifat Genetik My Garden (Monohibrid, Intermediet, & Dihibrid)
window.MY_GARDEN_GENE_VARIANTS = {
    tulip: {
        MM: { label: "Merah Dominan",    primary: "#f43f5e", secondary: "#fb7185", stroke: "#9f1239", bonusMult: 1.05 },
        Mm: { label: "Merah Hibrida",    primary: "#e11d48", secondary: "#fb7185", stroke: "#881337", bonusMult: 1.12 },
        Mp: { label: "Merah Muda",       primary: "#f472b6", secondary: "#fbcfe8", stroke: "#be185d", bonusMult: 1.25 },
        mm: { label: "Putih Resesif",    primary: "#f8fafc", secondary: "#e2e8f0", stroke: "#64748b", bonusMult: 1.30 },
        kk: { label: "Kuning Emas",      primary: "#facc15", secondary: "#fef08a", stroke: "#a16207", bonusMult: 1.25 },
        uu: { label: "Ungu Royal",       primary: "#a855f7", secondary: "#d8b4fe", stroke: "#581c87", bonusMult: 1.35 }
    },
    pukul_empat: {
        MM: { label: "Merah Dominan",    primary: "#e11d48", secondary: "#fb7185", stroke: "#881337", bonusMult: 1.05 },
        Mm: { label: "Merah Hibrida",    primary: "#f43f5e", secondary: "#fda4af", stroke: "#9f1239", bonusMult: 1.12 },
        Mp: { label: "Pink Intermediet", primary: "#f472b6", secondary: "#fbcfe8", stroke: "#be185d", bonusMult: 1.25 },
        mm: { label: "Putih Resesif",    primary: "#ffffff", secondary: "#f1f5f9", stroke: "#64748b", bonusMult: 1.30 },
        kk: { label: "Kuning Cerah",     primary: "#facc15", secondary: "#fef08a", stroke: "#a16207", bonusMult: 1.25 }
    },
    daisy: {
        MM: { label: "Putih Dominan",    primary: "#ffffff", secondary: "#facc15", stroke: "#94a3b8", bonusMult: 1.05 },
        Mm: { label: "Putih Hibrida",    primary: "#f8fafc", secondary: "#fbbf24", stroke: "#94a3b8", bonusMult: 1.12 },
        Mp: { label: "Pink Pastel",      primary: "#fbcfe8", secondary: "#facc15", stroke: "#db2777", bonusMult: 1.25 },
        mm: { label: "Biru Resesif",     primary: "#7dd3fc", secondary: "#fef08a", stroke: "#0284c7", bonusMult: 1.30 },
        kk: { label: "Kuning Mentari",   primary: "#fef08a", secondary: "#f97316", stroke: "#ca8a04", bonusMult: 1.25 }
    },
    anggrek: {
        MM: { label: "Putih Dominan",    primary: "#ffffff", secondary: "#facc15", stroke: "#cbd5e1", bonusMult: 1.05 },
        Mm: { label: "Putih Hibrida",    primary: "#f8fafc", secondary: "#f59e0b", stroke: "#cbd5e1", bonusMult: 1.12 },
        Mp: { label: "Ungu Lavender",    primary: "#e9d5ff", secondary: "#a855f7", stroke: "#7e22ce", bonusMult: 1.25 },
        mm: { label: "Kuning Emas",      primary: "#fef08a", secondary: "#ea580c", stroke: "#ca8a04", bonusMult: 1.30 }
    }
};

window.parseSeedKeyGarden = function(rawKey) {
    let str = String(rawKey || "");
    if (str.indexOf("__") !== -1) {
        let parts = str.split("__");
        return { baseId: parts[0], geneCode: parts[1] || "" };
    }
    return { baseId: str, geneCode: "" };
};

window.ambilInfoVarianGenetikGarden = function(plantId, geneCode) {
    if (!geneCode) return null;
    let clean = String(geneCode).trim();
    // Mendukung 2 huruf (Monohibrid/Intermediet) & 4 huruf (Dihibrid: 2 huruf warna + 2 huruf ukuran)
    let colorKey = clean.length >= 2 ? clean.slice(0, 2) : clean;
    let sizeKey = clean.length >= 4 ? clean.slice(2, 4) : "";

    let mapPlant = window.MY_GARDEN_GENE_VARIANTS[plantId];
    let v = (mapPlant && mapPlant[colorKey]) ? mapPlant[colorKey] : null;
    if (!v) return null;

    let sizeScale = 1.0;
    let sizeLabel = "";
    if (sizeKey === "bb") {
        sizeScale = 0.82;
        sizeLabel = " Mini";
    } else if (sizeKey === "BB" || sizeKey === "Bb") {
        sizeScale = 1.08;
        sizeLabel = " Besar";
    }

    return {
        code: clean,
        label: v.label + sizeLabel,
        primary: v.primary,
        secondary: v.secondary,
        stroke: v.stroke,
        bonusMult: v.bonusMult || 1.1,
        sizeScale: sizeScale
    };
};

(function kunciKatalogGarden() {
    window.MY_GARDEN_CATALOG.plants.forEach(function(p) { Object.freeze(p); });
    window.MY_GARDEN_CATALOG.fertilizers.forEach(function(f) { Object.freeze(f); });
    Object.freeze(window.MY_GARDEN_CATALOG.plants);
    Object.freeze(window.MY_GARDEN_CATALOG.fertilizers);
    Object.freeze(window.MY_GARDEN_CATALOG);
})();

// =========================================================================
// 1. STATE & STRUKTUR DATA MY GARDEN (SINKRON DENGAN PROFIL SISWA)
// =========================================================================
window.isMyGardenModalOpen = false;
window.activeGardenView = "kebun";
window.activeGardenTool = "select";
window.selectedGardenPlotIdx = 0;
window._gardenTickInterval = null;
window._gardenLastPlotStatuses = {};
window._gardenQuizRotasi = {};
window._activeSeedQuizState = null;

window.apakahAdminSandboxGarden = function() {
    let rawU = String(sessionStorage.getItem("username") || "").trim().toLowerCase();
    return (typeof window.isAdminSession === "function" && window.isAdminSession()) ||
           sessionStorage.getItem("statusLogin") === "admin" ||
           rawU === "mahardika";
};

window.pastikanStrukturMyGarden = function(uName) {
    let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(uName)
        : null;
    if (!lb) return null;

    if (!lb.myGardenData || typeof lb.myGardenData !== "object") {
        lb.myGardenData = {
            plots: {},
            unlockedPlots: [0, 1, 2, 3, 4],
            seedInventory: { wortel: 2 },
            fertilizerInventory: { pupuk_npk: 2 },
            totalHarvested: 0
        };
    } else {
        if (!lb.myGardenData.plots || typeof lb.myGardenData.plots !== "object") {
            lb.myGardenData.plots = {};
        }
        if (!lb.myGardenData.seedInventory || typeof lb.myGardenData.seedInventory !== "object") {
            lb.myGardenData.seedInventory = {};
        }
        if (!lb.myGardenData.fertilizerInventory || typeof lb.myGardenData.fertilizerInventory !== "object") {
            lb.myGardenData.fertilizerInventory = {};
        }

        // Migrasi pupuk lama (kompos / ajaib) -> Pupuk NPK agar stok lama tidak sia-sia
        let fInv = lb.myGardenData.fertilizerInventory;
        let bonusNpk = 0;
        if (fInv.pupuk_kompos) { bonusNpk += Number(fInv.pupuk_kompos) || 0; delete fInv.pupuk_kompos; }
        if (fInv.pupuk_ajaib)  { bonusNpk += (Number(fInv.pupuk_ajaib) || 0) * 2; delete fInv.pupuk_ajaib; }
        if (bonusNpk > 0) {
            fInv.pupuk_npk = (Number(fInv.pupuk_npk) || 0) + bonusNpk;
        }

        // Pastikan 5 lahan awal selalu terbuka + jaga lahan yang sudah terlanjur ditanami sebelumnya
        let rawUnlocked = Array.isArray(lb.myGardenData.unlockedPlots)
            ? lb.myGardenData.unlockedPlots
            : (lb.myGardenData.unlockedPlots ? Object.values(lb.myGardenData.unlockedPlots) : []);
        let setUnlocked = new Set([0, 1, 2, 3, 4]);
        rawUnlocked.forEach(function(n) {
            let num = parseInt(n, 10);
            if (!isNaN(num) && num >= 0 && num < window.MY_GARDEN_CATALOG.totalPlots) setUnlocked.add(num);
        });
        Object.keys(lb.myGardenData.plots).forEach(function(k) {
            let num = parseInt(k, 10);
            if (!isNaN(num) && num >= 0 && num < window.MY_GARDEN_CATALOG.totalPlots) setUnlocked.add(num);
        });
        lb.myGardenData.unlockedPlots = Array.from(setUnlocked).sort(function(a, b) { return a - b; });

        if (typeof lb.myGardenData.totalHarvested !== "number") {
            lb.myGardenData.totalHarvested = 0;
        }
    }
    return lb;
};

window.apakahLahanTerbuka = function(gData, plotIdx) {
    if (!gData || !Array.isArray(gData.unlockedPlots)) return plotIdx < 5;
    return gData.unlockedPlots.indexOf(plotIdx) !== -1;
};

window.hitungHargaBukaLahanBerikutnya = function(gData) {
    let unlockedCount = (gData && Array.isArray(gData.unlockedPlots)) ? gData.unlockedPlots.length : 5;
    let extraUnlocked = Math.max(0, unlockedCount - window.MY_GARDEN_CATALOG.freePlotsCount);
    return Math.round(100 * Math.pow(1.5, extraUnlocked));
};

window.simpanDataKebunKeServer = function(lb) {
    if (!lb || window.apakahAdminSandboxGarden()) return;
    let rawU = sessionStorage.getItem("username") || "";
    let cleanKey = (typeof window.normalisasiKeySiswaPet === "function")
        ? window.normalisasiKeySiswaPet(rawU)
        : rawU.trim().toLowerCase();
    if (cleanKey && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(cleanKey, lb);
    }
};

// =========================================================================
// 2. MESIN WAKTU TUMBUH & LIVE COUNTDOWN 1 DETIK (0 BEBAN SERVER)
// =========================================================================
window.cariInfoTanaman = function(plantId) {
    return window.MY_GARDEN_CATALOG.plants.find(function(p) { return p.id === plantId; }) || null;
};

window.hitungStatusPetakKebun = function(plotObj) {
    if (!plotObj || !plotObj.plantId) {
        return { status: "empty", pct: 0, remainingMs: 0, plant: null, fromHarvest: false };
    }
    let plant = window.cariInfoTanaman(plotObj.plantId);
    if (!plant) {
        return { status: "empty", pct: 0, remainingMs: 0, plant: null, fromHarvest: false };
    }

    // Jika baru saja dipanen, langsung menjadi sisa tanaman layu yang harus dibuang (5 Coin)
    if (plotObj.harvestedWilted === true) {
        return { status: "wilted", pct: 100, remainingMs: 0, plant: plant, fromHarvest: true };
    }

    let now = Date.now();
    let plantedAt = Number(plotObj.plantedAt) || now;
    let readyAt = Number(plotObj.readyAt) || (plantedAt + plant.durasiDetik * 1000);
    let batasLayuJam = plotObj.watered ? 48 : 30;
    let wiltAt = readyAt + (batasLayuJam * 3600 * 1000);

    if (now >= wiltAt) {
        return { status: "wilted", pct: 100, remainingMs: 0, plant: plant, fromHarvest: false };
    }
    if (now >= readyAt) {
        return { status: "ready", pct: 100, remainingMs: 0, plant: plant, fromHarvest: false };
    }

    let totalSpan = Math.max(1000, readyAt - plantedAt);
    let elapsed = Math.max(0, now - plantedAt);
    let pct = Math.max(1, Math.min(99, Math.round((elapsed / totalSpan) * 100)));
    let stage = pct < 38 ? "sprout" : "growing";
    return { status: stage, pct: pct, remainingMs: Math.max(0, readyAt - now), plant: plant, fromHarvest: false };
};

window.formatDurasiRingkasKebun = function(ms) {
    let totalDetik = Math.max(0, Math.ceil(ms / 1000));
    if (totalDetik <= 0) return "Siap!";
    let jam = Math.floor(totalDetik / 3600);
    let mnt = Math.floor((totalDetik % 3600) / 60);
    let dtk = totalDetik % 60;
    let pad = function(n) { return String(n).padStart(2, "0"); };
    if (jam > 0) return jam + "j " + pad(mnt) + "m " + pad(dtk) + "d";
    if (mnt > 0) return mnt + "m " + pad(dtk) + "d";
    return dtk + "d";
};

// Ticker ringan 1 detik: hanya ubah teks angka DOM (0 render ulang, 0 beban server)
window.perbaruiCountdownLiveGarden = function() {
    if (!window.isMyGardenModalOpen || document.hidden || window.activeGardenView !== "kebun") return;

    let ctx = window.ambilDataKebunAktif();
    if (!ctx || !ctx.gData) return;

    let gData = ctx.gData;
    let plots = gData.plots || {};
    let totalPlots = window.MY_GARDEN_CATALOG.totalPlots;
    let adaStatusBerubah = false;
    let readyCount = 0;
    let minRemainingMs = Infinity;

    for (let i = 0; i < totalPlots; i++) {
        if (!window.apakahLahanTerbuka(gData, i)) continue;
        let pObj = plots[String(i)] || null;
        let info = window.hitungStatusPetakKebun(pObj);

        if (window._gardenLastPlotStatuses[i] !== info.status) {
            adaStatusBerubah = true;
            break;
        }
        if (info.status === "ready") readyCount++;
        if (info.status === "sprout" || info.status === "growing") {
            if (info.remainingMs < minRemainingMs) minRemainingMs = info.remainingMs;
            let badgeEl = document.querySelector('[data-plot-timer="' + i + '"]');
            if (badgeEl) {
                badgeEl.textContent = (pObj && pObj.watered ? "💧" : "") + window.formatDurasiRingkasKebun(info.remainingMs);
            }
            if (i === window.selectedGardenPlotIdx) {
                let sisaEl = document.getElementById("garden-detail-sisa-val");
                let pctEl = document.getElementById("garden-detail-prog-pct");
                let fillEl = document.getElementById("garden-detail-prog-fill");
                if (sisaEl) sisaEl.textContent = window.formatDurasiRingkasKebun(info.remainingMs);
                if (pctEl) pctEl.textContent = info.pct + "%";
                if (fillEl) fillEl.style.width = info.pct + "%";
            }
        }
    }

    if (adaStatusBerubah) {
        window.renderMyGardenUI();
        return;
    }

    let nextEl = document.getElementById("garden-next-panen-val");
    if (nextEl) {
        if (readyCount > 0) nextEl.textContent = "Sekarang!";
        else if (minRemainingMs < Infinity) nextEl.textContent = window.formatDurasiRingkasKebun(minRemainingMs);
        else nextEl.textContent = "Kosong";
    }
};

// =========================================================================
// 3. GENERATOR SVG 2.5D UNTUK 16 TANAMAN + FASE BIBIT, TUMBUH, LAYU, & GEMBOK
// =========================================================================
window.bangunSVGTanamanKebun = function(plantId, status, sizePx, geneCode) {
    let sz = sizePx || 72;
    let gVar = window.ambilInfoVarianGenetikGarden(plantId, geneCode);

    if (status === "empty") {
        return '<svg viewBox="0 0 120 120" width="' + sz + '" height="' + sz + '"><ellipse cx="60" cy="88" rx="40" ry="14" fill="#6b3e1b" opacity="0.45"/><circle cx="48" cy="86" r="4" fill="#4a2810" opacity="0.5"/><circle cx="68" cy="91" r="5" fill="#4a2810" opacity="0.5"/><circle cx="78" cy="83" r="3" fill="#4a2810" opacity="0.5"/></svg>';
    }

    if (status === "wilted") {
        return '<svg viewBox="0 0 120 120" width="' + sz + '" height="' + sz + '">' +
            '<ellipse cx="60" cy="98" rx="34" ry="10" fill="#4a2810" opacity="0.45"/>' +
            '<path d="M60,96 Q58,64 42,50 Q28,42 26,64" fill="none" stroke="#786352" stroke-width="6" stroke-linecap="round"/>' +
            '<path d="M60,94 Q68,66 84,56 Q96,52 94,74" fill="none" stroke="#6b5645" stroke-width="5.5" stroke-linecap="round"/>' +
            '<path d="M40,54 Q20,56 18,74 Q36,74 42,58 Z" fill="#8b735b" stroke="#4f3e30" stroke-width="2.5"/>' +
            '<path d="M80,58 Q100,62 100,80 Q82,78 78,62 Z" fill="#7c6650" stroke="#4f3e30" stroke-width="2.5"/>' +
            '<path d="M58,66 Q46,44 64,34 Q78,46 62,68 Z" fill="#9a8268" stroke="#4f3e30" stroke-width="2.5"/>' +
        '</svg>';
    }

    if (status === "sprout") {
        return '<svg viewBox="0 0 120 120" width="' + sz + '" height="' + sz + '">' +
            '<ellipse cx="60" cy="98" rx="28" ry="8" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M60,96 Q60,72 60,58" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>' +
            '<path d="M60,64 C36,62 24,44 36,36 C48,30 60,48 60,64 Z" fill="#4ade80" stroke="#166534" stroke-width="3"/>' +
            '<path d="M60,64 C84,62 96,44 84,36 C72,30 60,48 60,64 Z" fill="#22c55e" stroke="#166534" stroke-width="3"/>' +
        '</svg>';
    }

    if (status === "growing") {
        return '<svg viewBox="0 0 120 120" width="' + sz + '" height="' + sz + '">' +
            '<ellipse cx="60" cy="100" rx="32" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M60,98 L60,38" stroke="#15803d" stroke-width="6.5" stroke-linecap="round"/>' +
            '<path d="M60,78 C32,76 22,58 34,50 C48,44 60,62 60,78 Z" fill="#22c55e" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M60,78 C88,76 98,58 86,50 C72,44 60,62 60,78 Z" fill="#16a34a" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M60,54 C38,48 30,30 44,24 C56,22 60,38 60,54 Z" fill="#4ade80" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M60,54 C82,48 90,30 76,24 C64,22 60,38 60,54 Z" fill="#84cc16" stroke="#14532d" stroke-width="3"/>' +
            '<circle cx="60" cy="30" r="7" fill="#bef264" stroke="#15803d" stroke-width="2.5"/>' +
        '</svg>';
    }

    let innerMap = {
        bayam:
            '<ellipse cx="60" cy="100" rx="34" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M60,98 L60,48 M60,92 L38,60 M60,92 L82,60" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>' +
            '<ellipse cx="38" cy="54" rx="18" ry="24" transform="rotate(-24 38 54)" fill="#22c55e" stroke="#14532d" stroke-width="3"/>' +
            '<ellipse cx="82" cy="54" rx="18" ry="24" transform="rotate(24 82 54)" fill="#16a34a" stroke="#14532d" stroke-width="3"/>' +
            '<ellipse cx="60" cy="40" rx="19" ry="26" fill="#4ade80" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M60,60 L60,22 M38,66 L32,42 M82,66 L88,42" stroke="#15803d" stroke-width="2.2" stroke-linecap="round"/>',

        padi:
            '<ellipse cx="60" cy="102" rx="34" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M56,100 Q46,62 28,36 M60,100 Q60,56 64,22 M64,100 Q76,62 94,40" fill="none" stroke="#65a30d" stroke-width="5" stroke-linecap="round"/>' +
            '<g fill="#facc15" stroke="#a16207" stroke-width="2">' +
                '<ellipse cx="26" cy="36" rx="5" ry="9" transform="rotate(-40 26 36)"/><ellipse cx="34" cy="44" rx="5" ry="9" transform="rotate(-35 34 44)"/><ellipse cx="42" cy="54" rx="5" ry="9" transform="rotate(-25 42 54)"/>' +
                '<ellipse cx="64" cy="22" rx="5" ry="9"/><ellipse cx="61" cy="34" rx="5" ry="9"/><ellipse cx="66" cy="46" rx="5" ry="9"/>' +
                '<ellipse cx="94" cy="40" rx="5" ry="9" transform="rotate(40 94 40)"/><ellipse cx="86" cy="48" rx="5" ry="9" transform="rotate(35 86 48)"/><ellipse cx="78" cy="58" rx="5" ry="9" transform="rotate(25 78 58)"/>' +
            '</g>',

        jagung:
            '<ellipse cx="60" cy="102" rx="34" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<ellipse cx="60" cy="56" rx="18" ry="38" fill="#facc15" stroke="#a16207" stroke-width="3"/>' +
            '<path d="M46,38 L74,38 M44,50 L76,50 M44,62 L76,62 M46,74 L74,74 M54,22 L54,84 M66,22 L66,84" stroke="#d97706" stroke-width="2"/>' +
            '<path d="M56,96 C26,88 22,56 36,42 C46,56 50,76 56,96 Z" fill="#22c55e" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M64,96 C94,88 98,56 84,42 C74,56 70,76 64,96 Z" fill="#16a34a" stroke="#14532d" stroke-width="3"/>',

        kedelai:
            '<ellipse cx="60" cy="100" rx="36" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M60,98 L60,44" stroke="#15803d" stroke-width="5.5" stroke-linecap="round"/>' +
            '<circle cx="42" cy="44" r="16" fill="#22c55e" stroke="#14532d" stroke-width="3"/>' +
            '<circle cx="78" cy="44" r="16" fill="#16a34a" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M26,70 Q42,60 56,74 Q42,92 26,82 Z" fill="#bef264" stroke="#3f6212" stroke-width="3"/>' +
            '<circle cx="35" cy="76" r="5" fill="#facc15"/><circle cx="46" cy="76" r="5" fill="#facc15"/>' +
            '<path d="M64,74 Q78,60 94,70 Q94,82 78,92 Z" fill="#a3e635" stroke="#3f6212" stroke-width="3"/>' +
            '<circle cx="74" cy="76" r="5" fill="#facc15"/><circle cx="85" cy="74" r="5" fill="#facc15"/>',

        brokoli:
            '<ellipse cx="60" cy="100" rx="34" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M48,98 L52,58 L68,58 L72,98 Z" fill="#86efac" stroke="#15803d" stroke-width="3.5" stroke-linejoin="round"/>' +
            '<circle cx="36" cy="52" r="20" fill="#15803d" stroke="#052e16" stroke-width="3"/>' +
            '<circle cx="84" cy="52" r="20" fill="#166534" stroke="#052e16" stroke-width="3"/>' +
            '<circle cx="60" cy="36" r="24" fill="#22c55e" stroke="#052e16" stroke-width="3"/>' +
            '<circle cx="48" cy="48" r="16" fill="#16a34a"/><circle cx="72" cy="48" r="16" fill="#15803d"/>' +
            '<circle cx="54" cy="30" r="4" fill="#4ade80"/><circle cx="68" cy="34" r="4" fill="#4ade80"/><circle cx="34" cy="48" r="3.5" fill="#4ade80"/>',

        alpukat:
            '<ellipse cx="60" cy="100" rx="34" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M60,18 C78,18 90,48 90,70 C90,90 76,100 60,100 C44,100 30,90 30,70 C30,48 42,18 60,18 Z" fill="#166534" stroke="#052e16" stroke-width="3.5"/>' +
            '<path d="M60,26 C73,26 82,50 82,70 C82,84 72,92 60,92 C48,92 38,84 38,70 C38,50 47,26 60,26 Z" fill="#bef264"/>' +
            '<circle cx="60" cy="70" r="16" fill="#92400e" stroke="#451a03" stroke-width="3"/>' +
            '<ellipse cx="55" cy="64" rx="5" ry="3" transform="rotate(-25 55 64)" fill="#d97706" opacity="0.7"/>',

        wortel:
            '<ellipse cx="60" cy="96" rx="34" ry="10" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M60,50 C42,38 30,22 42,16 C50,14 58,30 60,48 Z" fill="#22c55e" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M60,50 C78,38 90,22 78,16 C70,14 62,30 60,48 Z" fill="#16a34a" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M60,48 C54,28 54,10 60,10 C66,10 66,28 60,48 Z" fill="#4ade80" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M38,52 Q60,42 82,52 L67,102 Q60,110 53,102 Z" fill="#f97316" stroke="#9a3412" stroke-width="3.5" stroke-linejoin="round"/>' +
            '<path d="M46,64 L58,64 M62,74 L73,74 M50,84 L62,84" stroke="#c2410c" stroke-width="3" stroke-linecap="round"/>',

        daisy: (function() {
            let pCol = gVar ? gVar.primary : "#ffffff";
            let cCol = gVar ? gVar.secondary : "#facc15";
            let sCol = gVar ? gVar.stroke : "#cbd5e1";
            let floret = '<circle cx="0" cy="-14" r="9" fill="' + pCol + '" stroke="' + sCol + '" stroke-width="2"/><circle cx="13" cy="-5" r="9" fill="' + pCol + '" stroke="' + sCol + '" stroke-width="2"/><circle cx="8" cy="11" r="9" fill="' + pCol + '" stroke="' + sCol + '" stroke-width="2"/><circle cx="-8" cy="11" r="9" fill="' + pCol + '" stroke="' + sCol + '" stroke-width="2"/><circle cx="-13" cy="-5" r="9" fill="' + pCol + '" stroke="' + sCol + '" stroke-width="2"/><circle cx="0" cy="0" r="9" fill="' + cCol + '" stroke="#ca8a04" stroke-width="2"/>';
            return '<ellipse cx="60" cy="100" rx="36" ry="9" fill="#4a2810" opacity="0.4"/>' +
                '<path d="M60,98 L60,44 M60,96 Q42,76 34,58 M60,96 Q78,76 86,58" fill="none" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>' +
                '<g transform="translate(60,36)">' + floret + '</g>' +
                '<g transform="translate(32,56) scale(0.75)">' + floret + '</g>' +
                '<g transform="translate(88,56) scale(0.75)">' + floret + '</g>';
        })(),

        tulip: (function() {
            let pCol = gVar ? gVar.primary : "#f43f5e";
            let sCol = gVar ? gVar.secondary : "#fb7185";
            let stCol = gVar ? gVar.stroke : "#9f1239";
            return '<ellipse cx="60" cy="100" rx="32" ry="9" fill="#4a2810" opacity="0.4"/>' +
                '<path d="M60,98 L60,58" stroke="#15803d" stroke-width="6.5" stroke-linecap="round"/>' +
                '<path d="M58,96 C32,88 22,64 30,44 C44,54 54,74 58,96 Z" fill="#22c55e" stroke="#14532d" stroke-width="3"/>' +
                '<path d="M62,96 C88,88 98,64 90,44 C76,54 66,74 62,96 Z" fill="#16a34a" stroke="#14532d" stroke-width="3"/>' +
                '<path d="M36,46 C36,24 48,18 60,30 C72,18 84,24 84,46 C84,66 72,72 60,72 C48,72 36,66 36,46 Z" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="3.5"/>' +
                '<path d="M48,34 Q60,12 72,34 Q66,68 60,70 Q54,68 48,34 Z" fill="' + sCol + '" stroke="' + stCol + '" stroke-width="3"/>';
        })(),

        pukul_empat: (function() {
            let pCol = gVar ? gVar.primary : "#e11d48";
            let sCol = gVar ? gVar.secondary : "#fb7185";
            let stCol = gVar ? gVar.stroke : "#881337";
            let trump =
                '<ellipse cx="0" cy="-12" rx="10" ry="12" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2"/>' +
                '<ellipse cx="12" cy="-3" rx="10" ry="11" transform="rotate(72 12 -3)" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2"/>' +
                '<ellipse cx="7" cy="11" rx="10" ry="11" transform="rotate(144 7 11)" fill="' + sCol + '" stroke="' + stCol + '" stroke-width="2"/>' +
                '<ellipse cx="-7" cy="11" rx="10" ry="11" transform="rotate(216 -7 11)" fill="' + sCol + '" stroke="' + stCol + '" stroke-width="2"/>' +
                '<ellipse cx="-12" cy="-3" rx="10" ry="11" transform="rotate(288 -12 -3)" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2"/>' +
                '<circle cx="0" cy="0" r="6" fill="#fef08a" stroke="' + stCol + '" stroke-width="1.5"/>';
            return '<ellipse cx="60" cy="100" rx="36" ry="9" fill="#4a2810" opacity="0.4"/>' +
                '<path d="M60,98 L60,44 M60,86 Q40,72 34,54 M60,86 Q80,72 86,54" fill="none" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>' +
                '<path d="M58,92 C32,90 22,74 36,68 C48,64 56,78 58,92 Z" fill="#22c55e" stroke="#14532d" stroke-width="2.5"/>' +
                '<path d="M62,92 C88,90 98,74 84,68 C72,64 64,78 62,92 Z" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>' +
                '<g transform="translate(60,36)">' + trump + '</g>' +
                '<g transform="translate(33,54) scale(0.72)">' + trump + '</g>' +
                '<g transform="translate(87,54) scale(0.72)">' + trump + '</g>';
        })(),

        tomat:
            '<ellipse cx="60" cy="100" rx="36" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M60,98 L60,36 M60,64 Q42,54 34,62 M60,58 Q78,48 86,58" fill="none" stroke="#15803d" stroke-width="5.5" stroke-linecap="round"/>' +
            '<path d="M60,40 C42,36 38,20 52,18 C62,18 62,32 60,40 Z" fill="#4ade80" stroke="#14532d" stroke-width="2.5"/>' +
            '<path d="M60,40 C78,36 82,20 68,18 C58,18 58,32 60,40 Z" fill="#22c55e" stroke="#14532d" stroke-width="2.5"/>' +
            '<circle cx="38" cy="72" r="16" fill="#ef4444" stroke="#991b1b" stroke-width="3"/><ellipse cx="33" cy="66" rx="4" ry="2.5" fill="#fecaca"/>' +
            '<circle cx="80" cy="70" r="17" fill="#dc2626" stroke="#991b1b" stroke-width="3"/><ellipse cx="74" cy="64" rx="4.5" ry="2.5" fill="#fecaca"/>' +
            '<circle cx="58" cy="54" r="13" fill="#f87171" stroke="#991b1b" stroke-width="3"/>',

        matahari:
            '<ellipse cx="60" cy="102" rx="34" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M60,100 L60,52" stroke="#15803d" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M60,84 C34,82 26,64 38,58 C50,54 60,70 60,84 Z" fill="#22c55e" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M60,80 C86,78 94,60 82,54 C70,50 60,66 60,80 Z" fill="#16a34a" stroke="#14532d" stroke-width="3"/>' +
            '<g transform="translate(60,42)">' +
                '<ellipse cx="0" cy="-24" rx="8" ry="15" fill="#facc15" stroke="#b45309" stroke-width="2.5"/>' +
                '<ellipse cx="0" cy="24" rx="8" ry="15" fill="#facc15" stroke="#b45309" stroke-width="2.5"/>' +
                '<ellipse cx="-24" cy="0" rx="15" ry="8" fill="#facc15" stroke="#b45309" stroke-width="2.5"/>' +
                '<ellipse cx="24" cy="0" rx="15" ry="8" fill="#facc15" stroke="#b45309" stroke-width="2.5"/>' +
                '<ellipse cx="-17" cy="-17" rx="8" ry="14" transform="rotate(-45 -17 -17)" fill="#fde047" stroke="#b45309" stroke-width="2.5"/>' +
                '<ellipse cx="17" cy="-17" rx="8" ry="14" transform="rotate(45 17 -17)" fill="#fde047" stroke="#b45309" stroke-width="2.5"/>' +
                '<ellipse cx="-17" cy="17" rx="8" ry="14" transform="rotate(45 -17 17)" fill="#fde047" stroke="#b45309" stroke-width="2.5"/>' +
                '<ellipse cx="17" cy="17" rx="8" ry="14" transform="rotate(-45 17 17)" fill="#fde047" stroke="#b45309" stroke-width="2.5"/>' +
                '<circle cx="0" cy="0" r="18" fill="#78350f" stroke="#451a03" stroke-width="3"/>' +
                '<circle cx="-5" cy="-5" r="2.2" fill="#d97706"/><circle cx="5" cy="-5" r="2.2" fill="#d97706"/><circle cx="0" cy="4" r="2.2" fill="#d97706"/>' +
            '</g>',

        stroberi:
            '<ellipse cx="60" cy="98" rx="40" ry="10" fill="#4a2810" opacity="0.4"/>' +
            '<circle cx="42" cy="56" r="22" fill="#22c55e" stroke="#14532d" stroke-width="3"/>' +
            '<circle cx="78" cy="56" r="22" fill="#16a34a" stroke="#14532d" stroke-width="3"/>' +
            '<circle cx="60" cy="44" r="24" fill="#4ade80" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M32,68 Q44,60 54,68 Q52,92 43,96 Q34,92 32,68 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>' +
            '<path d="M66,68 Q78,60 88,68 Q86,92 77,96 Q68,92 66,68 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2.5"/>' +
            '<path d="M48,74 Q60,66 72,74 Q70,98 60,102 Q50,98 48,74 Z" fill="#f43f5e" stroke="#991b1b" stroke-width="2.5"/>' +
            '<circle cx="43" cy="78" r="1.5" fill="#fef08a"/><circle cx="60" cy="84" r="1.5" fill="#fef08a"/><circle cx="77" cy="78" r="1.5" fill="#fef08a"/>' +
            '<circle cx="52" cy="40" r="6" fill="#ffffff"/><circle cx="52" cy="40" r="2.5" fill="#facc15"/>' +
            '<circle cx="72" cy="44" r="6" fill="#ffffff"/><circle cx="72" cy="44" r="2.5" fill="#facc15"/>',

        kaktus:
            '<ellipse cx="60" cy="98" rx="34" ry="10" fill="#4a2810" opacity="0.4"/>' +
            '<rect x="36" y="34" width="48" height="64" rx="24" fill="#84cc16" stroke="#365314" stroke-width="3.5"/>' +
            '<path d="M36,68 Q20,68 20,52 Q20,42 28,42 Q34,42 34,54" fill="#a3e635" stroke="#365314" stroke-width="3.5" stroke-linejoin="round"/>' +
            '<path d="M84,64 Q100,64 100,48 Q100,38 92,38 Q86,38 86,50" fill="#a3e635" stroke="#365314" stroke-width="3.5" stroke-linejoin="round"/>' +
            '<line x1="50" y1="38" x2="50" y2="94" stroke="#4d7c0f" stroke-width="2.5"/>' +
            '<line x1="60" y1="36" x2="60" y2="96" stroke="#4d7c0f" stroke-width="2.5"/>' +
            '<line x1="70" y1="38" x2="70" y2="94" stroke="#4d7c0f" stroke-width="2.5"/>' +
            '<circle cx="60" cy="28" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/><circle cx="60" cy="28" r="4" fill="#f97316"/>',

        melati:
            '<ellipse cx="60" cy="100" rx="36" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<circle cx="42" cy="68" r="22" fill="#15803d" stroke="#052e16" stroke-width="3"/>' +
            '<circle cx="78" cy="68" r="22" fill="#166534" stroke="#052e16" stroke-width="3"/>' +
            '<circle cx="60" cy="54" r="26" fill="#22c55e" stroke="#052e16" stroke-width="3"/>' +
            '<g transform="translate(60,44)"><ellipse cx="0" cy="-13" rx="6.5" ry="11" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.8"/><ellipse cx="12" cy="-4" rx="6.5" ry="11" transform="rotate(72 12 -4)" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.8"/><ellipse cx="8" cy="10" rx="6.5" ry="11" transform="rotate(144 8 10)" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.8"/><ellipse cx="-8" cy="10" rx="6.5" ry="11" transform="rotate(216 -8 10)" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.8"/><ellipse cx="-12" cy="-4" rx="6.5" ry="11" transform="rotate(288 -12 -4)" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.8"/><circle cx="0" cy="0" r="5" fill="#fef08a"/></g>' +
            '<g transform="translate(36,68) scale(0.75)"><circle cx="0" cy="-10" r="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="10" cy="0" r="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="0" cy="10" r="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="-10" cy="0" r="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="0" cy="0" r="4.5" fill="#fef08a"/></g>' +
            '<g transform="translate(84,68) scale(0.75)"><circle cx="0" cy="-10" r="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="10" cy="0" r="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="0" cy="10" r="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="-10" cy="0" r="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><circle cx="0" cy="0" r="4.5" fill="#fef08a"/></g>',

        anggrek: (function() {
            let pCol = gVar ? gVar.primary : "#ffffff";
            let cCol = gVar ? gVar.secondary : "#facc15";
            let stCol = gVar ? gVar.stroke : "#cbd5e1";
            return '<ellipse cx="60" cy="100" rx="32" ry="9" fill="#4a2810" opacity="0.4"/>' +
                '<path d="M58,98 C58,72 52,46 72,26" fill="none" stroke="#15803d" stroke-width="5.5" stroke-linecap="round"/>' +
                '<path d="M58,96 C32,96 22,78 36,72 C48,68 58,82 58,96 Z" fill="#16a34a" stroke="#14532d" stroke-width="3"/>' +
                '<path d="M60,96 C86,96 96,78 82,72 C70,68 60,82 60,96 Z" fill="#22c55e" stroke="#14532d" stroke-width="3"/>' +
                '<g transform="translate(68,36)"><ellipse cx="-16" cy="0" rx="14" ry="10" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2.5"/><ellipse cx="16" cy="0" rx="14" ry="10" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2.5"/><ellipse cx="0" cy="-14" rx="10" ry="13" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2.5"/><ellipse cx="-9" cy="12" rx="9" ry="11" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2.5"/><ellipse cx="9" cy="12" rx="9" ry="11" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2.5"/><circle cx="0" cy="2" r="7" fill="' + cCol + '" stroke="#d97706" stroke-width="2"/></g>' +
                '<g transform="translate(46,58) scale(0.75)"><ellipse cx="-16" cy="0" rx="14" ry="10" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2.5"/><ellipse cx="16" cy="0" rx="14" ry="10" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2.5"/><ellipse cx="0" cy="-14" rx="10" ry="13" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2.5"/><circle cx="0" cy="2" r="7" fill="' + cCol + '"/></g>';
        })(),

        kantong_semar:
            '<ellipse cx="60" cy="100" rx="34" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M42,96 C36,64 40,34 62,28 C76,26 80,38 74,48" fill="none" stroke="#15803d" stroke-width="5.5" stroke-linecap="round"/>' +
            '<path d="M42,88 C20,80 18,56 32,52 C42,50 46,68 42,88 Z" fill="#22c55e" stroke="#14532d" stroke-width="3"/>' +
            '<path d="M52,44 C46,68 50,94 68,94 C86,94 90,68 84,44 Z" fill="#84cc16" stroke="#365314" stroke-width="3.5"/>' +
            '<path d="M52,44 C50,58 54,70 68,70 C82,70 86,58 84,44 Z" fill="#ef4444" opacity="0.72"/>' +
            '<ellipse cx="68" cy="44" rx="18" ry="6" fill="#dc2626" stroke="#7f1d1d" stroke-width="3"/>' +
            '<path d="M56,34 Q68,20 82,30 Q74,38 56,34 Z" fill="#f97316" stroke="#7c2d12" stroke-width="2.5"/>',

        edelweiss:
            '<ellipse cx="60" cy="100" rx="34" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M60,98 L60,46 M60,82 L40,56 M60,80 L80,54" stroke="#64748b" stroke-width="5" stroke-linecap="round"/>' +
            '<path d="M60,92 C36,92 28,78 40,74 C50,72 58,82 60,92 Z" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/>' +
            '<path d="M60,92 C84,92 92,78 80,74 C70,72 62,82 60,92 Z" fill="#cbd5e1" stroke="#475569" stroke-width="2.5"/>' +
            '<g transform="translate(60,36)"><circle cx="0" cy="0" r="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/><circle cx="-12" cy="-6" r="8" fill="#ffffff"/><circle cx="12" cy="-6" r="8" fill="#ffffff"/><circle cx="0" cy="-14" r="8" fill="#ffffff"/><circle cx="-8" cy="10" r="8" fill="#ffffff"/><circle cx="8" cy="10" r="8" fill="#ffffff"/><circle cx="0" cy="0" r="8" fill="#facc15" stroke="#ca8a04" stroke-width="2"/></g>' +
            '<g transform="translate(38,54) scale(0.7)"><circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/><circle cx="0" cy="0" r="7" fill="#facc15"/></g>' +
            '<g transform="translate(82,52) scale(0.7)"><circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/><circle cx="0" cy="0" r="7" fill="#facc15"/></g>',

        cendana:
            '<ellipse cx="60" cy="102" rx="36" ry="9" fill="#4a2810" opacity="0.42"/>' +
            '<path d="M52,100 L54,58 L66,58 L68,100 Z" fill="#92400e" stroke="#451a03" stroke-width="3"/>' +
            '<path d="M58,72 L40,54 M62,68 L80,50" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>' +
            '<circle cx="60" cy="36" r="26" fill="#15803d" stroke="#052e16" stroke-width="3"/>' +
            '<circle cx="38" cy="50" r="20" fill="#22c55e" stroke="#052e16" stroke-width="3"/>' +
            '<circle cx="82" cy="48" r="20" fill="#16a34a" stroke="#052e16" stroke-width="3"/>' +
            '<circle cx="52" cy="34" r="4" fill="#fde047"/><circle cx="72" cy="42" r="4" fill="#fde047"/><circle cx="42" cy="52" r="3.5" fill="#fef08a"/>',

        bunga_bangkai:
            '<ellipse cx="60" cy="102" rx="36" ry="10" fill="#4a2810" opacity="0.45"/>' +
            '<path d="M36,96 C20,76 22,52 44,54 C48,72 48,88 60,96 Z" fill="#65a30d" stroke="#365314" stroke-width="3"/>' +
            '<path d="M84,96 C100,76 98,52 76,54 C72,72 72,88 60,96 Z" fill="#65a30d" stroke="#365314" stroke-width="3"/>' +
            '<path d="M26,64 Q42,50 60,58 Q78,50 94,64 Q86,98 60,98 Q34,98 26,64 Z" fill="#881337" stroke="#4c0519" stroke-width="3.5"/>' +
            '<path d="M50,86 L55,14 Q60,8 65,14 L70,86 Z" fill="#fef08a" stroke="#a16207" stroke-width="3" stroke-linejoin="round"/>' +
            '<path d="M30,66 Q44,74 60,68 Q76,74 90,66" fill="none" stroke="#be123c" stroke-width="4" stroke-linecap="round"/>',

        rafflesia:
            '<ellipse cx="60" cy="96" rx="46" ry="12" fill="#4a2810" opacity="0.48"/>' +
            '<g transform="translate(60,64)">' +
                '<ellipse cx="0" cy="-28" rx="18" ry="20" fill="#dc2626" stroke="#7f1d1d" stroke-width="3"/>' +
                '<ellipse cx="28" cy="-8" rx="20" ry="17" transform="rotate(15 28 -8)" fill="#dc2626" stroke="#7f1d1d" stroke-width="3"/>' +
                '<ellipse cx="-28" cy="-8" rx="20" ry="17" transform="rotate(-15 -28 -8)" fill="#dc2626" stroke="#7f1d1d" stroke-width="3"/>' +
                '<ellipse cx="18" cy="22" rx="19" ry="17" transform="rotate(-25 18 22)" fill="#b91c1c" stroke="#7f1d1d" stroke-width="3"/>' +
                '<ellipse cx="-18" cy="22" rx="19" ry="17" transform="rotate(25 -18 22)" fill="#b91c1c" stroke="#7f1d1d" stroke-width="3"/>' +
                '<circle cx="-4" cy="-32" r="3" fill="#fef3c7"/><circle cx="6" cy="-26" r="2.5" fill="#fef3c7"/>' +
                '<circle cx="28" cy="-10" r="3" fill="#fef3c7"/><circle cx="34" cy="-2" r="2.5" fill="#fef3c7"/>' +
                '<circle cx="-28" cy="-10" r="3" fill="#fef3c7"/><circle cx="-34" cy="-2" r="2.5" fill="#fef3c7"/>' +
                '<circle cx="18" cy="22" r="3" fill="#fef3c7"/><circle cx="-18" cy="22" r="3" fill="#fef3c7"/>' +
                '<circle cx="0" cy="0" r="20" fill="#7f1d1d" stroke="#450a0a" stroke-width="3"/>' +
                '<circle cx="0" cy="0" r="13" fill="#450a0a"/>' +
                '<circle cx="-4" cy="-2" r="2.5" fill="#f97316"/><circle cx="4" cy="-2" r="2.5" fill="#f97316"/><circle cx="0" cy="4" r="2.5" fill="#f97316"/>' +
            '</g>',

        anggrek_hitam:
            '<ellipse cx="60" cy="100" rx="34" ry="9" fill="#4a2810" opacity="0.4"/>' +
            '<path d="M58,98 C58,70 54,48 64,28" fill="none" stroke="#15803d" stroke-width="5.5" stroke-linecap="round"/>' +
            '<path d="M58,96 C32,94 22,76 36,70 C48,66 58,82 58,96 Z" fill="#15803d" stroke="#052e16" stroke-width="3"/>' +
            '<path d="M60,96 C86,94 96,76 82,70 C70,66 60,82 60,96 Z" fill="#22c55e" stroke="#052e16" stroke-width="3"/>' +
            '<g transform="translate(60,44)">' +
                '<ellipse cx="0" cy="-22" rx="9" ry="18" fill="#a3e635" stroke="#365314" stroke-width="2.5"/>' +
                '<ellipse cx="-24" cy="-4" rx="18" ry="8" transform="rotate(-18 -24 -4)" fill="#bef264" stroke="#365314" stroke-width="2.5"/>' +
                '<ellipse cx="24" cy="-4" rx="18" ry="8" transform="rotate(18 24 -4)" fill="#bef264" stroke="#365314" stroke-width="2.5"/>' +
                '<ellipse cx="-16" cy="16" rx="15" ry="7" transform="rotate(35 -16 16)" fill="#84cc16" stroke="#365314" stroke-width="2.5"/>' +
                '<ellipse cx="16" cy="16" rx="15" ry="7" transform="rotate(-35 16 16)" fill="#84cc16" stroke="#365314" stroke-width="2.5"/>' +
                '<path d="M-12,-4 Q0,-12 12,-4 Q14,16 0,20 Q-14,16 -12,-4 Z" fill="#0f172a" stroke="#365314" stroke-width="2.5"/>' +
                '<path d="M-5,2 L0,10 L5,2" fill="none" stroke="#84cc16" stroke-width="2"/>' +
            '</g>',

        ercis: (function() {
            let pCol = gVar ? gVar.primary : "#9333ea";
            let sCol = gVar ? gVar.secondary : "#d8b4fe";
            let stCol = gVar ? gVar.stroke : "#581c87";
            return '<ellipse cx="60" cy="100" rx="36" ry="9" fill="#4a2810" opacity="0.4"/>' +
                '<path d="M60,98 L60,36 M60,72 Q42,60 32,70 M60,64 Q78,52 88,62" fill="none" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>' +
                '<path d="M30,72 Q44,64 56,78 Q42,96 28,84 Z" fill="#4ade80" stroke="#14532d" stroke-width="2.5"/>' +
                '<circle cx="38" cy="79" r="4" fill="#15803d"/><circle cx="47" cy="77" r="4" fill="#15803d"/>' +
                '<g transform="translate(60,36)"><ellipse cx="-11" cy="2" rx="11" ry="13" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2"/><ellipse cx="11" cy="2" rx="11" ry="13" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2"/><ellipse cx="0" cy="-7" rx="12" ry="11" fill="' + sCol + '" stroke="' + stCol + '" stroke-width="2"/></g>' +
                '<g transform="translate(84,56) scale(0.72)"><ellipse cx="-10" cy="2" rx="11" ry="13" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2"/><ellipse cx="10" cy="2" rx="11" ry="13" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="2"/><ellipse cx="0" cy="-6" rx="11" ry="10" fill="' + sCol + '" stroke="' + stCol + '" stroke-width="2"/></g>';
        })(),

        mawar: (function() {
            let pCol = gVar ? gVar.primary : "#dc2626";
            let sCol = gVar ? gVar.secondary : "#f87171";
            let stCol = gVar ? gVar.stroke : "#7f1d1d";
            return '<ellipse cx="60" cy="100" rx="34" ry="9" fill="#4a2810" opacity="0.4"/>' +
                '<path d="M60,98 L60,50" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>' +
                '<path d="M58,82 C34,80 28,64 40,60 C50,58 58,72 58,82 Z" fill="#22c55e" stroke="#14532d" stroke-width="2.5"/>' +
                '<path d="M62,76 C86,74 92,58 80,54 C70,52 62,66 62,76 Z" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>' +
                '<circle cx="60" cy="38" r="24" fill="' + pCol + '" stroke="' + stCol + '" stroke-width="3"/>' +
                '<circle cx="60" cy="38" r="16" fill="' + sCol + '" stroke="' + stCol + '" stroke-width="2.5"/>' +
                '<path d="M52,38 A8,8 0 1,1 66,42 A5,5 0 1,1 57,36" fill="none" stroke="' + stCol + '" stroke-width="2.5" stroke-linecap="round"/>';
        })(),

        kristal:
            '<ellipse cx="60" cy="98" rx="38" ry="10" fill="#38bdf8" opacity="0.38"/>' +
            '<polygon points="60,12 74,48 68,94 52,94 46,48" fill="#38bdf8" stroke="#0369a1" stroke-width="3" stroke-linejoin="round"/>' +
            '<polygon points="60,12 68,94 52,94" fill="#bae6fd" opacity="0.65"/>' +
            '<polygon points="30,36 48,60 48,94 34,94 24,62" fill="#818cf8" stroke="#3730a3" stroke-width="3" stroke-linejoin="round"/>' +
            '<polygon points="90,36 96,62 86,94 72,94 72,60" fill="#c084fc" stroke="#6b21a8" stroke-width="3" stroke-linejoin="round"/>' +
            '<polygon points="26,20 29,26 35,28 29,30 26,36 23,30 17,28 23,26" fill="#fef08a"/>' +
            '<polygon points="92,18 94,23 99,25 94,27 92,32 90,27 85,25 90,23" fill="#fef08a"/>'
    };

    let bodySvg = innerMap[plantId] || innerMap.matahari;
    if (gVar && gVar.sizeScale && gVar.sizeScale !== 1.0) {
        bodySvg = '<g transform="scale(' + gVar.sizeScale + ')" style="transform-origin:60px 100px;">' + bodySvg + '</g>';
    }
    return '<svg viewBox="0 0 120 120" width="' + sz + '" height="' + sz + '">' + bodySvg + '</svg>';
};

// =========================================================================
// 4. INJEKSI TOMBOL MELAYANG "🌱 My Garden" & MODAL UTAMA
// =========================================================================
window.pastikanUIMyGardenAda = function() {
    if (!document.getElementById("btn-floating-mygarden")) {
        let btn = document.createElement("button");
        btn.id = "btn-floating-mygarden";
        btn.className = "mygarden-floating-btn";
        btn.onclick = function() { window.bukaModalMyGarden(); };
        btn.title = "Buka My Garden (Kebun Sains)";
        btn.innerHTML =
            '<span class="mygarden-float-icon">🌱</span>' +
            '<span class="mygarden-float-text">My Garden</span>' +
            '<span id="mygarden-ready-dot" class="mygarden-ready-badge" style="display:none;">!</span>';
        document.body.appendChild(btn);
    }

    if (!document.getElementById("modal-my-garden")) {
        let modal = document.createElement("div");
        modal.id = "modal-my-garden";
        modal.className = "modal-overlay";
        modal.onclick = function(e) {
            if (e.target === modal) window.tutupModalMyGarden();
        };

        modal.innerHTML =
            '<div class="modal-box mygarden-modal-box">' +
                '<div class="mygarden-hud">' +
                    '<div class="mygarden-hud-left">' +
                        '<div class="mygarden-wood-sign" onclick="window.gantiViewMyGarden(\'kebun\')" title="Kembali ke Kebun">' +
                            '<span class="garden-sign-ico">🌼</span>' +
                            '<div>' +
                                '<div class="garden-sign-top">My</div>' +
                                '<div class="garden-sign-main">Garden</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="mypet-hud-currencies">' +
                            '<div class="mypet-hud-pill coin-pill" title="Saldo Coin Belanja">' +
                                '<span class="hud-orb coin-orb">🪙</span>' +
                                '<strong id="mygarden-hud-coin">0</strong>' +
                            '</div>' +
                            '<div class="mypet-hud-pill xp-pill" title="Total XP Leaderboard">' +
                                '<span class="hud-orb xp-orb">⭐</span>' +
                                '<strong id="mygarden-hud-xp">0</strong>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    '<div class="mygarden-hud-right">' +
                        '<button type="button" id="btn-garden-toko" class="mygarden-hud-btn" onclick="window.gantiViewMyGarden(window.activeGardenView === \'toko\' ? \'kebun\' : \'toko\')">' +
                            '<span class="hud-ico">🏪</span><span class="hud-lbl">Toko Bibit</span>' +
                        '</button>' +
                        '<button type="button" id="btn-garden-water" class="mygarden-hud-btn" onclick="window.toggleAlatKebun(\'water\')">' +
                            '<span class="hud-ico">🚿</span><span class="hud-lbl">Penyiram</span>' +
                        '</button>' +
                        '<button type="button" id="btn-garden-fert" class="mygarden-hud-btn" onclick="window.toggleAlatKebun(\'fertilize\')">' +
                            '<span class="hud-ico">🧪</span><span class="hud-lbl">Pupuk NPK</span>' +
                        '</button>' +
                        '<button type="button" class="mygarden-hud-btn pet-link-btn" onclick="window.bukaMyPetDariGarden()" title="Pindah ke My Pet Sanctuary">' +
                            '<span class="hud-ico">🐾</span><span class="hud-lbl">My Pet</span>' +
                        '</button>' +
                        '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupModalMyGarden()" title="Tutup">✕</button>' +
                    '</div>' +
                '</div>' +

                '<div class="modal-body mygarden-body" id="mygarden-main-body"></div>' +
                '<div id="mygarden-quiz-overlay" class="garden-quiz-overlay" style="display:none;"></div>' +
            '</div>';

        document.body.appendChild(modal);
    }
};

window.bukaMyPetDariGarden = function() {
    window.tutupModalMyGarden();
    if (typeof window.bukaModalMyPet === "function") {
        window.bukaModalMyPet();
    }
};

window.perbaruiSaldoHUDGarden = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    let elCoin = document.getElementById("mygarden-hud-coin");
    let elXp = document.getElementById("mygarden-hud-xp");
    let dotReady = document.getElementById("mygarden-ready-dot");

    let coinVal = lb ? Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia || 0) : 0;
    let xpVal = lb ? Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp || 0) : 0;

    if (elCoin) elCoin.innerText = coinVal.toLocaleString("id-ID");
    if (elXp) elXp.innerText = xpVal.toLocaleString("id-ID");

    if (dotReady && lb && lb.myGardenData && lb.myGardenData.plots) {
        let adaSiap = Object.values(lb.myGardenData.plots).some(function(pl) {
            let st = window.hitungStatusPetakKebun(pl);
            return st.status === "ready" || st.status === "wilted";
        });
        dotReady.style.display = adaSiap ? "flex" : "none";
    }
};

window.modeKunjunganGarden = null;

window.ambilDataKebunAktif = function() {
    if (window.modeKunjunganGarden && window.leaderboardSiswaData && window.leaderboardSiswaData[window.modeKunjunganGarden]) {
        let hostLb = window.leaderboardSiswaData[window.modeKunjunganGarden];
        let gd = (hostLb && hostLb.myGardenData) ? hostLb.myGardenData : { plots: {}, unlockedPlots: [0, 1, 2, 3, 4], totalHarvested: 0 };
        return { isVisit: true, hostUser: window.modeKunjunganGarden, hostNama: hostLb.namaPanggilan || hostLb.namaLengkap || window.modeKunjunganGarden, gData: gd };
    }
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    return { isVisit: false, hostUser: uName, hostNama: uName, gData: lb ? lb.myGardenData : null };
};

window.bukaModalMyGardenKunjungan = function(targetUsername) {
    if (!targetUsername || !window.leaderboardSiswaData || !window.leaderboardSiswaData[targetUsername]) return;
    window.modeKunjunganGarden = targetUsername;
    window.pastikanUIMyGardenAda();
    window.activeGardenView = "kebun";
    window.activeGardenTool = "select";
    window.selectedGardenPlotIdx = 0;
    window.isMyGardenModalOpen = true;

    window.perbaruiSaldoHUDGarden();
    window.renderMyGardenUI();

    if (typeof window.bukaModal === "function") window.bukaModal("modal-my-garden");
    else {
        let m = document.getElementById("modal-my-garden");
        if (m) m.style.display = "flex";
    }

    clearInterval(window._gardenTickInterval);
    window._gardenTickInterval = setInterval(window.perbaruiCountdownLiveGarden, 1000);
};

window.bukaModalMyGarden = function() {
    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        alert("🔒 Silakan login menggunakan akun Siswa terlebih dahulu untuk membuka fitur My Garden!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    window.modeKunjunganGarden = null;
    window.pastikanUIMyGardenAda();
    let uName = sessionStorage.getItem("username");
    window.pastikanStrukturMyGarden(uName);

    let jmlHujanSiram = (typeof window.terapkanHujanSiramOtomatisGarden === "function")
        ? window.terapkanHujanSiramOtomatisGarden(uName)
        : 0;

    window.activeGardenView = "kebun";
    window.activeGardenTool = "select";
    window.isMyGardenModalOpen = true;

    window.perbaruiSaldoHUDGarden();
    window.renderMyGardenUI();
    if (jmlHujanSiram > 0) {
        window.tampilkanToastGarden("🌧️ Cuaca Hujan menyiram otomatis <b>" + jmlHujanSiram + " tanaman</b> di kebunmu (−15% waktu panen)!");
    }

    if (typeof window.bukaModal === "function") {
        window.bukaModal("modal-my-garden");
    } else {
        let m = document.getElementById("modal-my-garden");
        if (m) m.style.display = "flex";
    }

    // Countdown 100% lokal tiap 1 detik (0 beban server Firebase)
    clearInterval(window._gardenTickInterval);
    window._gardenTickInterval = setInterval(window.perbaruiCountdownLiveGarden, 1000);
};

window.tutupModalMyGarden = function() {
    window.isMyGardenModalOpen = false;
    window.tutupKuisBibitGarden();
    clearInterval(window._gardenTickInterval);
    window._gardenTickInterval = null;
    if (typeof window.tutupModal === "function") {
        window.tutupModal("modal-my-garden");
    } else {
        let m = document.getElementById("modal-my-garden");
        if (m) m.style.display = "none";
    }
};

window.gantiViewMyGarden = function(viewName) {
    window.activeGardenView = viewName || "kebun";
    if (window.activeGardenView === "toko") {
        window.activeGardenTool = "select";
    }
    window.renderMyGardenUI();
};

window.toggleAlatKebun = function(toolName) {
    window.activeGardenView = "kebun";
    window.activeGardenTool = (window.activeGardenTool === toolName) ? "select" : toolName;
    window.renderMyGardenUI();
};

window.tampilkanToastGarden = function(pesan) {
    let t = document.getElementById("mygarden-toast-box");
    if (!t) return;
    t.innerHTML = pesan;
    t.style.display = "block";
    clearTimeout(window._gardenToastTimer);
    window._gardenToastTimer = setTimeout(function() {
        if (t) t.style.display = "none";
    }, 2800);
};

// =========================================================================
// 5. RENDER TAMPILAN UTAMA (KEBUN 20 PETAK: 5 FREE + 15 LOCKED)
// =========================================================================
window.renderMyGardenUI = function() {
    let body = document.getElementById("mygarden-main-body");
    if (!body) return;

    let ctx = window.ambilDataKebunAktif();
    if (!ctx || !ctx.gData) return;
    let isVisit = ctx.isVisit;
    let gData = ctx.gData;

    window.perbaruiSaldoHUDGarden();

    let btnToko = document.getElementById("btn-garden-toko");
    let btnWater = document.getElementById("btn-garden-water");
    let btnFert = document.getElementById("btn-garden-fert");
    if (btnToko) {
        btnToko.style.display = isVisit ? "none" : "inline-flex";
        btnToko.classList.toggle("active", !isVisit && window.activeGardenView === "toko");
    }
    if (btnWater) {
        btnWater.style.display = isVisit ? "none" : "inline-flex";
        btnWater.classList.toggle("active", !isVisit && window.activeGardenView === "kebun" && window.activeGardenTool === "water");
    }
    if (btnFert) {
        btnFert.style.display = isVisit ? "none" : "inline-flex";
        btnFert.classList.toggle("active", !isVisit && window.activeGardenView === "kebun" && window.activeGardenTool === "fertilize");
    }

    if (!isVisit && window.activeGardenView === "toko") {
        let uName = sessionStorage.getItem("username");
        let lb = window.pastikanStrukturMyGarden(uName);
        if (lb) window.renderTokoBibitGarden(body, lb);
        return;
    }

    let plots = gData.plots || {};
    let totalPlots = window.MY_GARDEN_CATALOG.totalPlots;
    let unlockedTotal = Array.isArray(gData.unlockedPlots) ? gData.unlockedPlots.length : 5;
    let nextUnlockCost = window.hitungHargaBukaLahanBerikutnya(gData);
    let npkStok = Number((gData.fertilizerInventory || {}).pupuk_npk) || 0;

    let plantedCount = 0, readyCount = 0, wiltedCount = 0;
    let minRemainingMs = Infinity;
    window._gardenLastPlotStatuses = {};

    let gridHtml = '';
    for (let i = 0; i < totalPlots; i++) {
        let isUnlocked = window.apakahLahanTerbuka(gData, i);
        let isSel = (window.selectedGardenPlotIdx === i);

        if (!isUnlocked) {
            window._gardenLastPlotStatuses[i] = "locked";
            gridHtml +=
                '<button type="button" class="garden-soil-plot status-locked' + (isSel ? ' is-selected' : '') + '" onclick="window.klikPetakKebun(' + i + ')" title="Lahan #' + (i + 1) + ' Terkunci">' +
                    '<span class="plot-lock-ico">🔒</span>' +
                    (!isVisit ? '<span class="plot-lock-price">🪙 ' + nextUnlockCost.toLocaleString("id-ID") + '</span>' : '') +
                '</button>';
            continue;
        }

        let pObj = plots[String(i)] || null;
        let info = window.hitungStatusPetakKebun(pObj);
        window._gardenLastPlotStatuses[i] = info.status;

        if (info.status !== "empty") plantedCount++;
        if (info.status === "ready") readyCount++;
        if (info.status === "wilted") wiltedCount++;
        if ((info.status === "sprout" || info.status === "growing") && info.remainingMs < minRemainingMs) {
            minRemainingMs = info.remainingMs;
        }

        let badgeHtml = '';
        if (info.status === "ready") {
            let ck = ctx.hostUser + "__garden__" + i;
            let sdh = isVisit && typeof window.apakahItemSudahDiminta === "function" && window.apakahItemSudahDiminta(ck);
            badgeHtml = sdh ? '<span class="plot-badge timer">✓</span>' : '<span class="plot-badge ready">' + (isVisit ? '🎁' : '✨') + '</span>';
        } else if (info.status === "wilted") {
            badgeHtml = '<span class="plot-badge wilted">🥀</span>';
        } else if (info.status === "sprout" || info.status === "growing") {
            badgeHtml = '<span class="plot-badge timer" data-plot-timer="' + i + '">' + (pObj && pObj.watered ? '💧' : '') + window.formatDurasiRingkasKebun(info.remainingMs) + '</span>';
        }

        let pGene = pObj ? (pObj.geneCode || "") : "";
        let plantSvg = window.bangunSVGTanamanKebun(pObj ? pObj.plantId : "", info.status, 64, pGene);
        let geneChip = (pGene && info.status !== "empty")
            ? '<span class="plot-gene-chip">' + pGene + '</span>'
            : '';

        gridHtml +=
            '<button type="button" class="garden-soil-plot status-' + info.status + (isSel ? ' is-selected' : '') + '" onclick="window.klikPetakKebun(' + i + ')" title="Petak #' + (i + 1) + (pGene ? ' • Gen: ' + pGene : '') + '">' +
                badgeHtml + geneChip +
                '<div class="plot-plant-wrap">' + plantSvg + '</div>' +
            '</button>';
    }

    let bannerTeks = isVisit
        ? ("🏡 Kebun Milik " + ctx.hostNama + (readyCount > 0 ? " (🎁 " + readyCount + " Siap Diminta!)" : ""))
        : (readyCount > 0 ? "✨ Siap Panen! (" + readyCount + ")" : (wiltedCount > 0 ? "🥀 Ada " + wiltedCount + " Tanaman Layu!" : (plantedCount === 0 ? "🌱 Yuk Mulai Menanam!" : "🌱 Kebun Tumbuh Subur")));

    let nextPanenStr = readyCount > 0 ? "Sekarang!" : (minRemainingMs < Infinity ? window.formatDurasiRingkasKebun(minRemainingMs) : "Kosong");

    let toolTipBar = '';
    if (isVisit) {
        let q = (typeof window.ambilStatusKuotaVisitSaya === "function") ? window.ambilStatusKuotaVisitSaya() : { usedCount: 0, quizPassed: false };
        let maxR = (window.MY_WORLD_VISIT_CONFIG && window.MY_WORLD_VISIT_CONFIG.maxProdukPer8Jam) || 3;
        toolTipBar =
            '<div class="garden-tool-notice" style="background:#0f766e; border:2px solid #134e4a;">' +
                '<span>🎁 <b>Mode Visit:</b> Pilih tanaman siap panen (🎁) untuk meminta hasilnya! Kuota 8 jam: <b>' + q.usedCount + '/' + maxR + '</b> • ' + (q.quizPassed ? '🔓 Kuis 20 Soal Lulus' : '🔒 Wajib Lulus 10/20 Soal') + '</span>' +
                '<button type="button" onclick="window.tutupModalMyGarden()">🚪 Kembali ke World</button>' +
            '</div>';
    } else if (window.activeGardenTool === "water") {
        toolTipBar =
            '<div class="garden-tool-notice water">' +
                '<span>🚿 <b>Mode Penyiram Aktif:</b> Ketuk tanaman yang sedang tumbuh (+15% lebih cepat & tahan layu!).</span>' +
                '<button type="button" onclick="window.toggleAlatKebun(\'select\')">Selesai</button>' +
            '</div>';
    } else if (window.activeGardenTool === "fertilize") {
        toolTipBar =
            '<div class="garden-tool-notice fert">' +
                '<span>🧪 <b>Mode Pupuk NPK (Stok: x' + npkStok + '):</b> Ketuk tanaman yang sedang tumbuh untuk mempercepat <b>2 menit</b>!</span>' +
                '<button type="button" onclick="window.toggleAlatKebun(\'select\')">Selesai</button>' +
            '</div>';
    }

    let selIdx = Math.max(0, Math.min(totalPlots - 1, window.selectedGardenPlotIdx || 0));
    let selUnlocked = window.apakahLahanTerbuka(gData, selIdx);
    let selPlot = selUnlocked ? (plots[String(selIdx)] || null) : null;
    let selInfo = selUnlocked ? window.hitungStatusPetakKebun(selPlot) : { status: "locked" };
    let rightCardHtml = window.bangunKartuDetailPetakGarden(selIdx, selPlot, selInfo, gData, ctx);

    let totalClearCost = wiltedCount * window.MY_GARDEN_CATALOG.wiltClearCost;
    let bottomActionHtml = isVisit
        ? ''
        : '<div class="garden-bottom-actions">' +
              (readyCount > 0 ? '<button type="button" class="garden-wood-cta harvest-all" onclick="window.panenSemuaTanamanSiap()">🧺 Panen Semua (' + readyCount + ')</button>' : '') +
              '<button type="button" class="garden-wood-cta clear-wilted' + (wiltedCount === 0 ? ' is-idle' : '') + '" onclick="window.buangSemuaTanamanLayu()">🗑️ Buang Layu' + (wiltedCount > 0 ? ' (' + wiltedCount + ' • 🪙 ' + totalClearCost + ')' : ' (🪙 5/petak)') + '</button>' +
          '</div>';

    let leftCardHtml = isVisit
        ? '<div class="garden-left-card">' +
              '<div class="garden-card-title">🏡 Info Kebun</div>' +
              '<div class="garden-stat-line"><span>👤</span><div><small>Pemilik:</small><b>' + ctx.hostNama + '</b></div></div>' +
              '<div class="garden-stat-line"><span>🌱</span><div><small>Tanaman:</small><b>' + plantedCount + ' / ' + unlockedTotal + '</b></div></div>' +
              '<div class="garden-stat-line"><span>🎁</span><div><small>Siap Diminta:</small><b>' + readyCount + ' Petak</b></div></div>' +
              '<div class="garden-stat-line"><span>⏱️</span><div><small>Next Panen:</small><b id="garden-next-panen-val">' + nextPanenStr + '</b></div></div>' +
          '</div>'
        : '<div class="garden-left-card">' +
              '<div class="garden-card-title">🌱 Kebun Saya</div>' +
              '<div class="garden-stat-line"><span>🔓</span><div><small>Lahan Aktif:</small><b>' + unlockedTotal + ' / ' + totalPlots + '</b></div></div>' +
              '<div class="garden-stat-line"><span>🟫</span><div><small>Terisi:</small><b>' + plantedCount + ' / ' + unlockedTotal + '</b></div></div>' +
              '<div class="garden-stat-line"><span>⏱️</span><div><small>Next Panen:</small><b id="garden-next-panen-val">' + nextPanenStr + '</b></div></div>' +
              '<div class="garden-stat-line"><span>💧</span><div><small>Air Siram:</small><b>' + ((typeof window.ambilStokAirKebunWorld === "function") ? window.ambilStokAirKebunWorld() : 5) + ' L</b></div></div>' +
              '<div class="garden-stat-line"><span>🧪</span><div><small>Pupuk NPK:</small><b>x' + npkStok + '</b></div></div>' +
              '<button type="button" class="garden-mini-shop-btn" onclick="window.gantiViewMyGarden(\'toko\')">🏪 Toko Bibit</button>' +
          '</div>';

    body.innerHTML =
        '<div class="garden-scenery-wrap">' +
            '<div id="mygarden-toast-box" class="mygarden-toast-box" style="display:none;"></div>' +
            '<div class="garden-banner-row"><div class="garden-curved-banner">' + bannerTeks + '</div></div>' +
            toolTipBar +
            '<div class="garden-three-col">' +
                leftCardHtml +
                '<div class="garden-grid-frame"><div class="garden-plots-grid">' + gridHtml + '</div></div>' +
                rightCardHtml +
            '</div>' +
            bottomActionHtml +
        '</div>';
};

window.bangunKartuDetailPetakGarden = function(plotIdx, plotObj, info, gData, ctx) {
    let isVisit = Boolean(ctx && ctx.isVisit);

    if (info.status === "locked") {
        if (isVisit) {
            return '<div class="garden-right-card"><div class="garden-detail-ribbon locked">🔒 Lahan #' + (plotIdx + 1) + ' Terkunci</div><div class="garden-detail-preview" style="font-size:46px;">🔒</div><p class="garden-detail-desc">Lahan ini belum dibuka oleh ' + ctx.hostNama + '.</p></div>';
        }
        let hargaBuka = window.hitungHargaBukaLahanBerikutnya(gData);
        let unlockedNow = Array.isArray(gData.unlockedPlots) ? gData.unlockedPlots.length : 5;
        let nextAfter = Math.round(hargaBuka * 1.5);
        return (
            '<div class="garden-right-card">' +
                '<div class="garden-detail-ribbon locked">🔒 Lahan #' + (plotIdx + 1) + ' Terkunci</div>' +
                '<div class="garden-detail-preview" style="font-size:48px;">🔒</div>' +
                '<div class="garden-reward-row"><span>Biaya Buka: 🪙 <b>' + hargaBuka.toLocaleString("id-ID") + '</b></span></div>' +
                '<p class="garden-detail-desc">Lahan terbuka saat ini: <b>' + unlockedNow + '/20</b>.<br>Harga pembukaan lahan berikutnya naik 1,5× (' + nextAfter.toLocaleString("id-ID") + ' Coin).</p>' +
                '<button type="button" class="mypet-amber-cta" onclick="window.beliBukaLahanGarden(' + plotIdx + ')">🔓 Buka Lahan (🪙 ' + hargaBuka.toLocaleString("id-ID") + ')</button>' +
            '</div>'
        );
    }

    if (info.status === "empty") {
        if (isVisit) {
            return '<div class="garden-right-card"><div class="garden-detail-ribbon">🟫 Petak #' + (plotIdx + 1) + ' Kosong</div><div class="garden-detail-preview">' + window.bangunSVGTanamanKebun("", "empty", 78) + '</div><p class="garden-detail-desc">Petak ini sedang kosong. Pilih petak bertanda 🎁 untuk meminta hasil kebun teman!</p></div>';
        }
        let sInv = gData.seedInventory || {};
        let daftarBibitDimiliki = Object.keys(sInv).filter(function(k) {
            let parsed = window.parseSeedKeyGarden(k);
            return (Number(sInv[k]) || 0) > 0 && Boolean(window.cariInfoTanaman(parsed.baseId));
        });
        let listBibitHtml = '';
        if (daftarBibitDimiliki.length === 0) {
            listBibitHtml =
                '<div style="font-size:11.5px; color:#785a3a; margin:8px 0 12px 0; line-height:1.45;">Stok bibitmu kosong. Jawab kuis biologi di <b>Toko Bibit</b> atau silangkan bunga di <b>My Lab</b>!</div>' +
                '<button type="button" class="mypet-green-cta" onclick="window.gantiViewMyGarden(\'toko\')">🏪 Buka Toko Bibit</button>';
        } else {
            listBibitHtml = '<div class="garden-seed-pick-list">';
            daftarBibitDimiliki.forEach(function(seedKey) {
                let parsed = window.parseSeedKeyGarden(seedKey);
                let p = window.cariInfoTanaman(parsed.baseId);
                let vInfo = window.ambilInfoVarianGenetikGarden(parsed.baseId, parsed.geneCode);
                let qty = Number(sInv[seedKey]) || 0;
                let coinEst = vInfo ? Math.round(p.panenCoin * vInfo.bonusMult) : p.panenCoin;
                let labelBibit = vInfo ? (p.nama + ' (' + vInfo.label + ' • ' + vInfo.code + ')') : p.nama;
                listBibitHtml +=
                    '<button type="button" class="garden-seed-pick-item" onclick="window.tanamBibitDiPetak(' + plotIdx + ', \'' + seedKey + '\')">' +
                        '<div class="seed-mini-svg">' + window.bangunSVGTanamanKebun(p.id, "ready", 36, parsed.geneCode) + '</div>' +
                        '<div style="flex:1; text-align:left; min-width:0;">' +
                            '<div class="seed-mini-name">' + labelBibit + '</div>' +
                            '<div class="seed-mini-sub">⏳ ' + p.durasiLabel + ' • 🪙 ' + coinEst.toLocaleString("id-ID") + (vInfo ? ' 🧬' : '') + '</div>' +
                        '</div>' +
                        '<span class="cozy-qty-pill">x' + qty + '</span>' +
                    '</button>';
            });
            listBibitHtml += '</div>';
        }
        return (
            '<div class="garden-right-card">' +
                '<div class="garden-detail-ribbon">🟫 Petak #' + (plotIdx + 1) + ' Kosong</div>' +
                '<div class="garden-detail-preview">' + window.bangunSVGTanamanKebun("", "empty", 78) + '</div>' +
                '<div style="font-size:11.5px; font-weight:800; color:#5c3210; margin-bottom:4px;">Pilih Bibit untuk Ditanam:</div>' +
                listBibitHtml +
            '</div>'
        );
    }

    let p = info.plant;
    let pGene = plotObj ? (plotObj.geneCode || "") : "";
    let vInfo = window.ambilInfoVarianGenetikGarden(p.id, pGene);
    let namaLengkap = vInfo ? (p.nama + " (" + vInfo.label + ")") : p.nama;
    let panenCoinAktif = vInfo ? Math.round(p.panenCoin * vInfo.bonusMult) : p.panenCoin;
    let badgeGenDetail = vInfo ? '<div class="garden-gene-badge">🧬 Genotipe: <b>' + vInfo.code + '</b> • ' + vInfo.label + '</div>' : '';

    if (info.status === "wilted") {
        let biaya = window.MY_GARDEN_CATALOG.wiltClearCost;
        let ketLayu = isVisit
            ? "Tanaman milik " + ctx.hostNama + " di petak ini sedang layu."
            : (info.fromHarvest ? "Sisa tanaman layu setelah dipanen. Bersihkan petak ini agar bisa ditanami bibit baru." : "Tanaman terlalu lama tidak dipanen sehingga menjadi layu.");
        return (
            '<div class="garden-right-card">' +
                '<div class="garden-detail-ribbon wilted">🥀 ' + p.nama + ' (Layu)</div>' +
                '<div class="garden-detail-preview">' + window.bangunSVGTanamanKebun(p.id, "wilted", 96) + '</div>' +
                '<p class="garden-detail-desc">' + ketLayu + '</p>' +
                (!isVisit ? '<button type="button" class="mypet-amber-cta" onclick="window.buangSatuPetakLayu(' + plotIdx + ')">🗑️ Buang Layu (🪙 ' + biaya + ')</button>' : '') +
            '</div>'
        );
    }

    if (info.status === "ready") {
        if (isVisit) {
            let ck = ctx.hostUser + "__garden__" + plotIdx;
            let sudahDiminta = typeof window.apakahItemSudahDiminta === "function" && window.apakahItemSudahDiminta(ck);
            let btnMinta = sudahDiminta
                ? '<button type="button" class="mypet-gray-cta sm" disabled>✓ Sudah Diminta (8 Jam Ini)</button>'
                : '<button type="button" class="mypet-green-cta" onclick="window.mintaHasilKebunTeman(' + plotIdx + ')">🎁 Minta Hasil Kebun</button>';
            return (
                '<div class="garden-right-card is-ready-card">' +
                    '<div class="garden-detail-ribbon">🌿 ' + namaLengkap + '</div>' +
                    '<div class="garden-detail-preview">' + window.bangunSVGTanamanKebun(p.id, "ready", 104, pGene) + '</div>' +
                    badgeGenDetail +
                    '<div class="garden-reward-row"><span>🪙 <b>+' + panenCoinAktif.toLocaleString("id-ID") + '</b></span><span>⭐ <b>+' + p.panenXp + ' XP</b></span></div>' +
                    '<p class="garden-detail-desc">Hasil kebun ' + ctx.hostNama + ' siap diminta! (Tidak mengurangi tanaman milik teman).</p>' +
                    btnMinta +
                '</div>'
            );
        }
        return (
            '<div class="garden-right-card is-ready-card">' +
                '<div class="garden-detail-ribbon">🌿 ' + namaLengkap + '</div>' +
                '<div class="garden-detail-preview">' + window.bangunSVGTanamanKebun(p.id, "ready", 104, pGene) + '</div>' +
                badgeGenDetail +
                '<div class="garden-reward-row"><span>🪙 <b>+' + panenCoinAktif.toLocaleString("id-ID") + '</b></span><span>⭐ <b>+' + p.panenXp + ' XP</b></span></div>' +
                '<div class="garden-dur-row">⏳ ' + p.durasiLabel + ' • ✨ Siap Panen!</div>' +
                '<p class="garden-detail-desc">' + p.deskripsi + '</p>' +
                '<button type="button" class="mypet-green-cta" onclick="window.panenSatuPetak(' + plotIdx + ')">🧺 Panen</button>' +
            '</div>'
        );
    }

    return (
        '<div class="garden-right-card">' +
            '<div class="garden-detail-ribbon">🌱 ' + namaLengkap + '</div>' +
            '<div class="garden-detail-preview">' + window.bangunSVGTanamanKebun(p.id, info.status, 96, pGene) + '</div>' +
            badgeGenDetail +
            '<div class="garden-prog-wrap">' +
                '<div class="garden-prog-top"><span>Pertumbuhan</span><b id="garden-detail-prog-pct">' + info.pct + '%</b></div>' +
                '<div class="garden-prog-track"><div id="garden-detail-prog-fill" class="garden-prog-fill" style="width:' + info.pct + '%;"></div></div>' +
            '</div>' +
            '<div class="garden-reward-row"><span>🪙 ' + panenCoinAktif.toLocaleString("id-ID") + '</span><span>⭐ +' + p.panenXp + ' XP</span></div>' +
            '<div class="garden-dur-row">⏳ Sisa: <b id="garden-detail-sisa-val">' + window.formatDurasiRingkasKebun(info.remainingMs) + '</b></div>' +
            '<p class="garden-detail-desc">' + p.deskripsi + '</p>' +
            (!isVisit
                ? '<div style="display:flex; gap:6px; width:100%;">' +
                      '<button type="button" class="mypet-green-cta sm" ' + (plotObj.watered ? 'disabled style="opacity:0.65; cursor:default;"' : '') + ' onclick="window.siramPetakKebun(' + plotIdx + ')">' + (plotObj.watered ? '💧 Disiram' : '🚿 Siram') + '</button>' +
                      '<button type="button" class="mypet-amber-cta sm" onclick="window.beriPupukKePetak(' + plotIdx + ')">🧪 NPK (-2m)</button>' +
                  '</div>'
                : '<div style="font-size:11px; color:#785a3a; font-weight:700;">⏳ Tunggu hingga matang untuk meminta hasilnya.</div>') +
        '</div>'
    );
};

window.mintaHasilKebunTeman = function(plotIdx) {
    let ctx = window.ambilDataKebunAktif();
    if (!ctx || !ctx.isVisit || !ctx.gData) return;
    let pObj = (ctx.gData.plots || {})[String(plotIdx)];
    let info = window.hitungStatusPetakKebun(pObj);
    if (!info || info.status !== "ready" || !info.plant) return;

    if (typeof window.prosesMintaProdukTeman === "function") {
        window.prosesMintaProdukTeman({
            sumber: "garden",
            hostUser: ctx.hostUser,
            claimKey: ctx.hostUser + "__garden__" + plotIdx,
            namaProduk: info.plant.nama,
            ikon: "🌿",
            coin: info.plant.panenCoin,
            xp: info.plant.panenXp
        });
    }
};

// =========================================================================
// 6. TOKO BIBIT (WAJIB KUIS BIOLOGI) & PUPUK NPK
// =========================================================================
window.renderTokoBibitGarden = function(bodyEl, lb) {
    let gData = lb.myGardenData;
    let sInv = gData.seedInventory || {};
    let fInv = gData.fertilizerInventory || {};

    let seedCards = '';
    window.MY_GARDEN_CATALOG.plants.forEach(function(p) {
        let stok = Number(sInv[p.id]) || 0;
        let rarSlug = p.rarity.toLowerCase();
        seedCards +=
            '<div class="garden-shop-card rar-' + rarSlug + '">' +
                '<div class="cozy-card-top-row">' +
                    '<span class="cozy-tag neutral">' + p.rarity + '</span>' +
                    '<span class="cozy-stock-lbl">Stok: <b>' + stok + '</b></span>' +
                '</div>' +
                '<div style="margin:4px 0;">' + window.bangunSVGTanamanKebun(p.id, "ready", 72) + '</div>' +
                '<div class="cozy-item-name">' + p.nama + '</div>' +
                '<div class="garden-latin-name"><i>' + (p.latin || '') + '</i></div>' +
                '<div class="garden-shop-meta">⏳ ' + p.durasiLabel + ' • 🧺 +' + p.panenCoin.toLocaleString("id-ID") + ' Coin & +' + p.panenXp + ' XP</div>' +
                '<div class="cozy-item-sub" style="flex:1;">' + p.deskripsi + '</div>' +
                '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiKuisBeliBibitGarden(\'' + p.id + '\')">🧠 Kuis & Beli (🪙 ' + p.harga.toLocaleString("id-ID") + ')</button>' +
            '</div>';
    });

    let npk = window.MY_GARDEN_CATALOG.fertilizers[0];
    let stokNpk = Number(fInv[npk.id]) || 0;
    let fertCard =
        '<div class="garden-shop-card">' +
            '<div class="cozy-card-top-row">' +
                '<span class="cozy-tag amber">⚡ -2 Menit</span>' +
                '<span class="cozy-stock-lbl">Stok: <b>' + stokNpk + '</b></span>' +
            '</div>' +
            '<div style="font-size:38px; margin:8px 0;">' + npk.ikon + '</div>' +
            '<div class="cozy-item-name">' + npk.nama + '</div>' +
            '<div class="cozy-item-sub" style="flex:1;">' + npk.deskripsi + '</div>' +
            '<button type="button" class="mypet-amber-cta sm" onclick="window.beliPupukGarden(\'' + npk.id + '\')">🪙 Beli (' + npk.harga.toLocaleString("id-ID") + ')</button>' +
        '</div>';

    bodyEl.innerHTML =
        '<div class="garden-shop-wrap">' +
            '<div id="mygarden-toast-box" class="mygarden-toast-box" style="display:none;"></div>' +
            '<div class="garden-shop-head">' +
                '<div>' +
                    '<h3 style="margin:0; color:#4a2e14; font-size:17px;">🏪 Toko Bibit Flora Indonesia & Pupuk NPK</h3>' +
                    '<div style="font-size:11.5px; color:#785a3a;">🧠 Untuk membeli bibit, jawab 1 soal Biologi tentang tanaman tersebut (<b>Benar: +5 Coin & Bibit Masuk</b> • <b>Salah: -5 Coin</b>).</div>' +
                '</div>' +
                '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:8px 16px;" onclick="window.gantiViewMyGarden(\'kebun\')">🏡 Kembali ke Kebun</button>' +
            '</div>' +
            '<h4 class="cozy-section-title">🌱 1. Bibit Tanaman & Flora Indonesia (16 Jenis)</h4>' +
            '<div class="garden-shop-grid" style="margin-bottom:20px;">' + seedCards + '</div>' +
            '<h4 class="cozy-section-title">🧪 2. Pupuk NPK</h4>' +
            '<div class="garden-shop-grid">' + fertCard + '</div>' +
        '</div>';
};

// =========================================================================
// 7. KUIS BIOLOGI WAJIB SAAT MEMBELI BIBIT (SOAL BERPUTAR PER TANAMAN)
// =========================================================================
window.mulaiKuisBeliBibitGarden = function(plantId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    let plant = window.cariInfoTanaman(plantId);
    if (!lb || !plant) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < plant.harga) {
        return window.tampilkanCustomDialog("alert", "⚠️ Coin kamu belum cukup untuk membeli bibit " + plant.nama + "!\nHarga: " + plant.harga.toLocaleString("id-ID") + " Coin | Saldo: " + saldo.toLocaleString("id-ID") + " Coin.", null, null);
    }

    let pool = window.MY_GARDEN_PLANT_QUIZ[plantId] || window.MY_GARDEN_PLANT_QUIZ.kristal;
    let rotIdx = (typeof window._gardenQuizRotasi[plantId] === "number") ? window._gardenQuizRotasi[plantId] : 0;
    let soalObj = pool[rotIdx % pool.length];
    window._gardenQuizRotasi[plantId] = (rotIdx + 1) % pool.length;

    window._activeSeedQuizState = {
        plantId: plantId,
        soal: soalObj,
        answered: false
    };

    window.renderOverlayKuisBibitGarden();
};

window.renderOverlayKuisBibitGarden = function(resultInfo) {
    let ov = document.getElementById("mygarden-quiz-overlay");
    let st = window._activeSeedQuizState;
    if (!ov || !st) return;

    let plant = window.cariInfoTanaman(st.plantId);
    let soal = st.soal;
    let letters = ["A", "B", "C", "D"];

    let optsHtml = '';
    soal.opts.forEach(function(optText, idx) {
        let cls = "garden-quiz-opt";
        let dis = st.answered ? " disabled" : "";
        if (st.answered && resultInfo) {
            if (idx === soal.ans) cls += " is-correct";
            else if (idx === resultInfo.pickedIdx && !resultInfo.isCorrect) cls += " is-wrong";
        }
        optsHtml +=
            '<button type="button" class="' + cls + '"' + dis + ' onclick="window.jawabKuisBibitGarden(' + idx + ')">' +
                '<b>' + letters[idx] + '.</b> <span>' + optText + '</span>' +
            '</button>';
    });

    let feedbackHtml = '';
    if (st.answered && resultInfo) {
        if (resultInfo.isCorrect) {
            feedbackHtml =
                '<div class="garden-quiz-feedback ok">' +
                    '<div><b>✅ Jawaban Benar! (+5 Coin Bonus)</b></div>' +
                    '<div style="margin-top:3px;">1 bibit <b>' + plant.nama + '</b> berhasil masuk ke kebunmu!</div>' +
                    '<div style="margin-top:4px; font-size:11px; opacity:0.9;">💡 ' + soal.info + '</div>' +
                '</div>' +
                '<div style="display:flex; gap:8px; margin-top:10px;">' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.tutupKuisBibitGarden()">Selesai</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.mulaiKuisBeliBibitGarden(\'' + plant.id + '\')">🌱 Beli 1 Lagi</button>' +
                '</div>';
        } else {
            feedbackHtml =
                '<div class="garden-quiz-feedback err">' +
                    '<div><b>❌ Jawaban Salah! (-5 Coin)</b></div>' +
                    '<div style="margin-top:3px;">Pembelian bibit <b>' + plant.nama + '</b> dibatalkan. Kunci: <b>' + letters[soal.ans] + '. ' + soal.opts[soal.ans] + '</b></div>' +
                    '<div style="margin-top:4px; font-size:11px; opacity:0.9;">💡 ' + soal.info + '</div>' +
                '</div>' +
                '<div style="display:flex; gap:8px; margin-top:10px;">' +
                    '<button type="button" class="mypet-gray-cta sm" onclick="window.tutupKuisBibitGarden()">Tutup</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.mulaiKuisBeliBibitGarden(\'' + plant.id + '\')">🔄 Coba Soal Berikutnya</button>' +
                '</div>';
        }
    }

    ov.innerHTML =
        '<div class="garden-quiz-card">' +
            '<div class="garden-quiz-head">' +
                '<div style="display:flex; align-items:center; gap:10px;">' +
                    '<div class="garden-quiz-ico">' + window.bangunSVGTanamanKebun(plant.id, "ready", 46) + '</div>' +
                    '<div>' +
                        '<div style="font-size:14.5px; font-weight:900; color:#4a2e14;">🧠 Kuis Biologi: ' + plant.nama + '</div>' +
                        '<div style="font-size:11px; color:#785a3a;">Harga Bibit: <b>🪙 ' + plant.harga.toLocaleString("id-ID") + '</b> • Benar: <b style="color:#15803d;">+5 Coin</b> | Salah: <b style="color:#dc2626;">-5 Coin</b></div>' +
                    '</div>' +
                '</div>' +
                '<button type="button" class="garden-quiz-close" onclick="window.tutupKuisBibitGarden()">✕</button>' +
            '</div>' +
            '<div class="garden-quiz-question">' + soal.q + '</div>' +
            '<div class="garden-quiz-opts">' + optsHtml + '</div>' +
            feedbackHtml +
        '</div>';

    ov.style.display = "flex";
};

window.jawabKuisBibitGarden = function(pickedIdx) {
    let st = window._activeSeedQuizState;
    if (!st || st.answered) return;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    let plant = window.cariInfoTanaman(st.plantId);
    if (!lb || !plant) return;

    st.answered = true;
    let isCorrect = (pickedIdx === st.soal.ans);
    let curCoin = Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0;

    if (isCorrect) {
        // Benar: dapat +5 Coin bonus dan bibit terbeli
        let biayaBersih = Math.max(0, plant.harga - window.MY_GARDEN_CATALOG.quizRewardCoin);
        if (curCoin + window.MY_GARDEN_CATALOG.quizRewardCoin < plant.harga) {
            window.tutupKuisBibitGarden();
            return window.tampilkanCustomDialog("alert", "⚠️ Saldo Coin tidak mencukupi.", null, null);
        }
        lb.coin = Math.max(0, curCoin + window.MY_GARDEN_CATALOG.quizRewardCoin - plant.harga);
        lb.xpTersedia = lb.coin;
        lb.xpSpentTotal = (Number(lb.xpSpentTotal) || 0) + biayaBersih;
        lb.xp = lb.xpTotal;

        let inv = lb.myGardenData.seedInventory;
        inv[plant.id] = (Number(inv[plant.id]) || 0) + 1;
    } else {
        // Salah: -5 Coin dan batal membeli bibit
        lb.coin = Math.max(0, curCoin - window.MY_GARDEN_CATALOG.quizPenaltyCoin);
        lb.xpTersedia = lb.coin;
        lb.xp = lb.xpTotal;
    }

    window.simpanDataKebunKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.renderMyGardenUI();
    window.renderOverlayKuisBibitGarden({ pickedIdx: pickedIdx, isCorrect: isCorrect });
};

window.tutupKuisBibitGarden = function() {
    window._activeSeedQuizState = null;
    let ov = document.getElementById("mygarden-quiz-overlay");
    if (ov) ov.style.display = "none";
};

// =========================================================================
// 8. AKSI KEBUN (BUKA LAHAN, TANAM, SIRAM, PUPUK NPK, PANEN, BUANG LAYU)
// =========================================================================
window.klikPetakKebun = function(plotIdx) {
    if (window.modeKunjunganGarden) {
        window.selectedGardenPlotIdx = plotIdx;
        window.renderMyGardenUI();
        return;
    }
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    if (!lb) return;

    let gData = lb.myGardenData;
    if (!window.apakahLahanTerbuka(gData, plotIdx)) {
        window.selectedGardenPlotIdx = plotIdx;
        window.renderMyGardenUI();
        return;
    }

    let plotObj = gData.plots[String(plotIdx)] || null;
    let info = window.hitungStatusPetakKebun(plotObj);

    if (window.activeGardenTool === "water") {
        window.selectedGardenPlotIdx = plotIdx;
        if (info.status === "sprout" || info.status === "growing") {
            window.siramPetakKebun(plotIdx);
        } else {
            window.renderMyGardenUI();
            window.tampilkanToastGarden("🚿 Pilih tanaman yang sedang tumbuh untuk disiram.");
        }
        return;
    }

    if (window.activeGardenTool === "fertilize") {
        window.selectedGardenPlotIdx = plotIdx;
        if (info.status === "sprout" || info.status === "growing") {
            window.beriPupukKePetak(plotIdx);
        } else {
            window.renderMyGardenUI();
            window.tampilkanToastGarden("🧪 Pilih tanaman yang sedang tumbuh untuk diberi Pupuk NPK.");
        }
        return;
    }

    if (window.selectedGardenPlotIdx === plotIdx && info.status === "ready") {
        window.panenSatuPetak(plotIdx);
        return;
    }

    window.selectedGardenPlotIdx = plotIdx;
    window.renderMyGardenUI();
};

window.beliBukaLahanGarden = function(plotIdx) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    if (!lb) return;

    let gData = lb.myGardenData;
    if (window.apakahLahanTerbuka(gData, plotIdx)) return;

    let harga = window.hitungHargaBukaLahanBerikutnya(gData);
    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < harga) {
        return window.tampilkanCustomDialog("alert", "⚠️ Coin kamu belum cukup untuk membuka Lahan #" + (plotIdx + 1) + "!\nBiaya: " + harga.toLocaleString("id-ID") + " Coin | Saldo: " + saldo.toLocaleString("id-ID") + " Coin.", null, null);
    }

    window.tampilkanCustomDialog("confirm", "Buka Lahan #" + (plotIdx + 1) + " seharga " + harga.toLocaleString("id-ID") + " Coin?\n(XP Leaderboard kamu tetap aman & tidak berkurang)", null, function(isYes) {
        if (!isYes) return;
        if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(harga, "buka_lahan_" + plotIdx, true)) {
            if (!Array.isArray(gData.unlockedPlots)) gData.unlockedPlots = [0, 1, 2, 3, 4];
            if (gData.unlockedPlots.indexOf(plotIdx) === -1) gData.unlockedPlots.push(plotIdx);
            gData.unlockedPlots.sort(function(a, b) { return a - b; });
            window.simpanDataKebunKeServer(lb);
            window.renderMyGardenUI();
            window.tampilkanToastGarden("🔓 Lahan #" + (plotIdx + 1) + " berhasil dibuka dan siap ditanami!");
        }
    });
};

window.beliPupukGarden = function(fertId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    let fert = window.MY_GARDEN_CATALOG.fertilizers.find(function(f) { return f.id === fertId; });
    if (!lb || !fert) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < fert.harga) {
        return window.tampilkanCustomDialog("alert", "⚠️ Coin belum cukup untuk membeli " + fert.nama + " (" + fert.harga.toLocaleString("id-ID") + " Coin)!", null, null);
    }

    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(fert.harga, "beli_pupuk_" + fertId, true)) {
        let inv = lb.myGardenData.fertilizerInventory;
        inv[fertId] = (Number(inv[fertId]) || 0) + 1;
        window.simpanDataKebunKeServer(lb);
        window.renderMyGardenUI();
        window.tampilkanToastGarden("🧪 Berhasil membeli 1 <b>" + fert.nama + "</b>!");
    }
};

window.tanamBibitDiPetak = function(plotIdx, seedKey) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    let parsed = window.parseSeedKeyGarden(seedKey);
    let plant = window.cariInfoTanaman(parsed.baseId);
    if (!lb || !plant) return;

    let gData = lb.myGardenData;
    if (!window.apakahLahanTerbuka(gData, plotIdx)) return;

    let stok = Number(gData.seedInventory[seedKey]) || 0;
    if (stok <= 0) {
        return window.tampilkanToastGarden("⚠️ Stok bibit " + plant.nama + " habis!");
    }

    gData.seedInventory[seedKey] = stok - 1;
    if (gData.seedInventory[seedKey] <= 0) delete gData.seedInventory[seedKey];

    let now = Date.now();
    let vInfo = window.ambilInfoVarianGenetikGarden(parsed.baseId, parsed.geneCode);
    gData.plots[String(plotIdx)] = {
        plantId: parsed.baseId,
        geneCode: parsed.geneCode || "",
        plantedAt: now,
        readyAt: now + (plant.durasiDetik * 1000),
        watered: false,
        fertilized: false,
        harvestedWilted: false
    };

    window.simpanDataKebunKeServer(lb);
    window.renderMyGardenUI();
    window.tampilkanToastGarden("🌱 Bibit <b>" + plant.nama + (vInfo ? " (" + vInfo.label + " • " + vInfo.code + ")" : "") + "</b> ditanam di Petak #" + (plotIdx + 1) + "!");
};

window.siramPetakKebun = function(plotIdx) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    if (!lb) return;

    let plotObj = lb.myGardenData.plots[String(plotIdx)];
    let info = window.hitungStatusPetakKebun(plotObj);
    if (!plotObj || (info.status !== "sprout" && info.status !== "growing")) return;

    if (plotObj.watered) {
        window.tampilkanToastGarden("💧 Tanaman ini sudah disiram!");
        return;
    }

    if (typeof window.pakaiAirKebunWorld === "function" && !window.pakaiAirKebunWorld(1)) {
        window.tampilkanToastGarden("⚠️ Air siram kebun habis! Keluar ke <b>My World</b>, ambil air dari <b>🛢️ Tandon Air</b> (isi Tandon dengan menimba di <b>🪣 Sumur</b>).");
        return;
    }

    let potonganMs = Math.round(info.remainingMs * 0.15);
    plotObj.readyAt = Math.max(Date.now(), plotObj.readyAt - potonganMs);
    plotObj.watered = true;

    window.simpanDataKebunKeServer(lb);
    window.renderMyGardenUI();
    window.tampilkanToastGarden("🚿 <b>" + info.plant.nama + "</b> disiram segar! Waktu panen 15% lebih cepat.");
};

window.beriPupukKePetak = function(plotIdx) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    if (!lb) return;

    let gData = lb.myGardenData;
    let plotObj = gData.plots[String(plotIdx)];
    let info = window.hitungStatusPetakKebun(plotObj);
    if (!plotObj || (info.status !== "sprout" && info.status !== "growing")) return;

    let fInv = gData.fertilizerInventory || {};
    let npk = window.MY_GARDEN_CATALOG.fertilizers[0];
    let stok = Number(fInv[npk.id]) || 0;
    if (stok <= 0) {
        window.tampilkanToastGarden("⚠️ Stok Pupuk NPK kosong! Beli di Toko Bibit dulu ya.");
        return;
    }

    fInv[npk.id] = stok - 1;
    if (fInv[npk.id] <= 0) delete fInv[npk.id];

    // Pupuk NPK mempercepat tepat 2 menit (120.000 ms)
    plotObj.readyAt = Math.max(Date.now(), plotObj.readyAt - (npk.percepatDetik * 1000));
    plotObj.fertilized = true;

    window.simpanDataKebunKeServer(lb);
    window.renderMyGardenUI();
    window.tampilkanToastGarden("🧪 <b>Pupuk NPK</b> diberikan ke " + info.plant.nama + "! Lebih cepat 2 menit.");
};

window.panenSatuPetak = function(plotIdx) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    if (!lb) return;

    let gData = lb.myGardenData;
    let plotObj = gData.plots[String(plotIdx)];
    let info = window.hitungStatusPetakKebun(plotObj);
    if (!plotObj || info.status !== "ready" || !info.plant) return;

    let plant = info.plant;
    let vInfo = window.ambilInfoVarianGenetikGarden(plant.id, plotObj.geneCode);
    let gainCoin = vInfo ? Math.round(plant.panenCoin * vInfo.bonusMult) : plant.panenCoin;

    // Setelah dipanen, petak otomatis menyisakan tanaman layu yang harus dibuang (5 Coin)
    gData.plots[String(plotIdx)] = {
        plantId: plant.id,
        geneCode: plotObj.geneCode || "",
        plantedAt: plotObj.plantedAt,
        readyAt: plotObj.readyAt,
        harvestedWilted: true
    };
    gData.totalHarvested = (Number(gData.totalHarvested) || 0) + 1;

    lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + gainCoin;
    lb.xpTersedia = lb.coin;
    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + plant.panenXp;
    lb.xp = lb.xpTotal;

    let masukDapur = false;
    if (typeof window.tambahBahanDapurWorld === "function") {
        masukDapur = window.tambahBahanDapurWorld(lb, plant.id, 1);
    }

    window.simpanDataKebunKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();

    window.renderMyGardenUI();
    window.tampilkanToastGarden("🎉 Panen <b>" + plant.nama + (vInfo ? " (" + vInfo.label + ")" : "") + "</b>! +🪙 " + gainCoin.toLocaleString("id-ID") + " Coin & +⭐ " + plant.panenXp + " XP!" + (masukDapur ? " (+1 bahan segar masuk Dapur Gizi!)" : ""));
};

window.panenSemuaTanamanSiap = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    if (!lb) return;

    let gData = lb.myGardenData;
    let totalCoin = 0;
    let totalXp = 0;
    let jumlah = 0;

    Object.keys(gData.plots || {}).forEach(function(k) {
        let pObj = gData.plots[k];
        let info = window.hitungStatusPetakKebun(pObj);
        if (info.status === "ready" && info.plant) {
            let vInfo = window.ambilInfoVarianGenetikGarden(info.plant.id, pObj.geneCode);
            totalCoin += (vInfo ? Math.round(info.plant.panenCoin * vInfo.bonusMult) : info.plant.panenCoin);
            totalXp += info.plant.panenXp;
            jumlah++;
            if (typeof window.tambahBahanDapurWorld === "function") {
                window.tambahBahanDapurWorld(lb, info.plant.id, 1);
            }
            gData.plots[k] = {
                plantId: info.plant.id,
                geneCode: pObj.geneCode || "",
                plantedAt: pObj.plantedAt,
                readyAt: pObj.readyAt,
                harvestedWilted: true
            };
        }
    });

    if (jumlah === 0) return;

    gData.totalHarvested = (Number(gData.totalHarvested) || 0) + jumlah;
    lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + totalCoin;
    lb.xpTersedia = lb.coin;
    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + totalXp;
    lb.xp = lb.xpTotal;

    window.simpanDataKebunKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();

    window.renderMyGardenUI();
    window.tampilkanToastGarden("🧺 Panen <b>" + jumlah + " tanaman</b>! +🪙 " + totalCoin.toLocaleString("id-ID") + " Coin & +⭐ " + totalXp + " XP!");
};

window.buangSatuPetakLayu = function(plotIdx) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    if (!lb) return;

    let gData = lb.myGardenData;
    let info = window.hitungStatusPetakKebun(gData.plots[String(plotIdx)]);
    if (info.status !== "wilted") return;

    let biaya = window.MY_GARDEN_CATALOG.wiltClearCost;
    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < biaya) {
        return window.tampilkanCustomDialog("alert", "⚠️ Coin tidak cukup! Membuang 1 tanaman layu memerlukan " + biaya + " Coin.", null, null);
    }

    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(biaya, "buang_layu_" + plotIdx, true)) {
        delete gData.plots[String(plotIdx)];
        window.simpanDataKebunKeServer(lb);
        window.renderMyGardenUI();
        window.tampilkanToastGarden("🗑️ Tanaman layu dibuang (-" + biaya + " Coin). Petak siap ditanami kembali!");
    }
};

window.buangSemuaTanamanLayu = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyGarden(uName);
    if (!lb) return;

    let gData = lb.myGardenData;
    let wiltedKeys = Object.keys(gData.plots || {}).filter(function(k) {
        return window.hitungStatusPetakKebun(gData.plots[k]).status === "wilted";
    });

    if (wiltedKeys.length === 0) {
        window.tampilkanToastGarden("✨ Tidak ada tanaman layu di kebunmu!");
        return;
    }

    let totalBiaya = wiltedKeys.length * window.MY_GARDEN_CATALOG.wiltClearCost;
    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < totalBiaya) {
        return window.tampilkanCustomDialog("alert", "⚠️ Coin belum cukup untuk membuang semua " + wiltedKeys.length + " tanaman layu (butuh " + totalBiaya + " Coin).\nKamu bisa membuangnya satu per satu (5 Coin/petak).", null, null);
    }

    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(totalBiaya, "buang_semua_layu", true)) {
        wiltedKeys.forEach(function(k) { delete gData.plots[k]; });
        window.simpanDataKebunKeServer(lb);
        window.renderMyGardenUI();
        window.tampilkanToastGarden("🗑️ Berhasil membuang <b>" + wiltedKeys.length + " tanaman layu</b> (-" + totalBiaya + " Coin)!");
    }
};

document.addEventListener("DOMContentLoaded", function() {
    window.pastikanUIMyGardenAda();
    setTimeout(function() {
        let uName = sessionStorage.getItem("username");
        if (uName) {
            window.pastikanStrukturMyGarden(uName);
            window.perbaruiSaldoHUDGarden();
        }
    }, 1500);
});

// Tambahan Varian Warna Genetik untuk Kacang Ercis & Bunga Mawar
if (window.MY_GARDEN_GENE_VARIANTS) {
    window.MY_GARDEN_GENE_VARIANTS.ercis = {
        MM: { label: "Ungu Dominan",    primary: "#9333ea", secondary: "#d8b4fe", stroke: "#581c87", bonusMult: 1.08 },
        Mm: { label: "Ungu Hibrida",    primary: "#7e22ce", secondary: "#c084fc", stroke: "#4c1d95", bonusMult: 1.15 },
        Mp: { label: "Lavender Muda",   primary: "#c084fc", secondary: "#f3e8ff", stroke: "#6b21a8", bonusMult: 1.25 },
        mm: { label: "Putih Resesif",   primary: "#ffffff", secondary: "#f1f5f9", stroke: "#64748b", bonusMult: 1.32 }
    };
    window.MY_GARDEN_GENE_VARIANTS.mawar = {
        MM: { label: "Merah Dominan",   primary: "#dc2626", secondary: "#f87171", stroke: "#7f1d1d", bonusMult: 1.08 },
        Mm: { label: "Merah Hibrida",   primary: "#b91c1c", secondary: "#ef4444", stroke: "#7f1d1d", bonusMult: 1.15 },
        Mp: { label: "Merah Muda",      primary: "#f472b6", secondary: "#fbcfe8", stroke: "#be185d", bonusMult: 1.28 },
        mm: { label: "Putih Murni",     primary: "#ffffff", secondary: "#f1f5f9", stroke: "#64748b", bonusMult: 1.35 }
    };
}