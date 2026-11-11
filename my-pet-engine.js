/* =========================================================================
   MODUL MY PET ENGINE — REBORN:
   - Sistem Dual-XP murni (Total Leaderboard & Tersedia Belanja)
   - 1 Habitat Universal, Tanpa Batas Kapasitas, Menampilkan Semua Pet Sekaligus
   - Katalog Spesies (7), Makanan (6), Camilan (7), Mainan (15), Wardrobe (38)
   ========================================================================= */

window.MY_PET_CATALOG = {
    pets: [
        { id: "kadal",   namaDefault: "Gecko",  spesies: "Kadal",   zona: "land",  rarity: "Common",    harga: 1200,  scale: 0.72, favSnack: "snack_kadal",   warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "kucing",  namaDefault: "Mochi",  spesies: "Kucing",  zona: "land",  rarity: "Common",    harga: 16000,  scale: 0.82, favSnack: "snack_kucing",  warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "anjing",  namaDefault: "Bobi",   spesies: "Anjing",  zona: "land",  rarity: "Common",    harga: 18000,  scale: 0.86, favSnack: "snack_anjing",  warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "ikan",    namaDefault: "Nemo",   spesies: "Ikan",    zona: "water", rarity: "Uncommon",  harga: 32000,  scale: 0.78, favSnack: "snack_ikan",    warnaRarity: "#0284c7", bgRarity: "#e0f2fe" },
        { id: "monyet",  namaDefault: "Koko",   spesies: "Monyet",  zona: "land",  rarity: "Uncommon",  harga: 40000,  scale: 0.84, favSnack: "snack_monyet",  warnaRarity: "#16a34a", bgRarity: "#dcfce7" },
        { id: "buaya",   namaDefault: "Croco",  spesies: "Buaya",   zona: "water", rarity: "Rare",      harga: 58000,  scale: 0.94, favSnack: "snack_buaya",   warnaRarity: "#059669", bgRarity: "#d1fae5" },
        { id: "beruang", namaDefault: "Bubu",   spesies: "Beruang", zona: "land",  rarity: "Rare",      harga: 650000,  scale: 0.98, favSnack: "snack_beruang", warnaRarity: "#2563eb", bgRarity: "#dbeafe" },
        { id: "gajah",   namaDefault: "Dumbo",  spesies: "Gajah",   zona: "land",  rarity: "Epic",      harga: 1000000,  scale: 1.12, favSnack: "snack_gajah",   warnaRarity: "#9333ea", bgRarity: "#f3e8ff" },
        { id: "",    namaDefault: "Ember",  spesies: "Naga",    zona: "land",  rarity: "Legendary", harga: 5000000, scale: 1.05, favSnack: "snack_naga",    warnaRarity: "#d97706", bgRarity: "#fef3c7" }
    ],
    foods: [
        { id: "food_biscuit", nama: "Biskuit Pet",  kenyang: 15,  mood: 2,  tahan: "3 jam 45 menit",  harga: 20,  ikon: "🍪", tipe: "main" },
        { id: "food_daily",   nama: "Pakan Harian", kenyang: 25,  mood: 4,  tahan: "6 jam 15 menit",  harga: 40,  ikon: "🥫", tipe: "main" },
        { id: "food_fresh",   nama: "Fresh Meal",   kenyang: 40,  mood: 6,  tahan: "10 jam",          harga: 60,  ikon: "🥗", tipe: "main" },
        { id: "food_nutri",   nama: "Nutri Bowl",   kenyang: 55,  mood: 8,  tahan: "13 jam 45 menit", harga: 80,  ikon: "🍲", tipe: "main" },
        { id: "food_feast",   nama: "Hearty Feast", kenyang: 75,  mood: 12, tahan: "18 jam 45 menit", harga: 100, ikon: "🍗", tipe: "main" },
        { id: "food_golden",  nama: "Golden Meal",  kenyang: 100, mood: 20, tahan: "25 jam",          harga: 120, ikon: "🍱", tipe: "main" }
    ],
    snacks: [
        { id: "snack_anjing",  nama: "Dog Biscuit",  favPet: "anjing",  favLabel: "Anjing",  kenyang: 5, mood: 10, harga: 25, ikon: "🦴", tipe: "snack" },
        { id: "snack_kucing",  nama: "Fish Treat",   favPet: "kucing",  favLabel: "Kucing",  kenyang: 5, mood: 10, harga: 30, ikon: "🐟", tipe: "snack" },
        { id: "snack_ikan",    nama: "Fish Flakes",  favPet: "ikan",    favLabel: "Ikan",    kenyang: 5, mood: 10, harga: 25, ikon: "🐠", tipe: "snack" },
        { id: "snack_monyet",  nama: "Banana Snack", favPet: "monyet",  favLabel: "Monyet",  kenyang: 5, mood: 10, harga: 20, ikon: "🍌", tipe: "snack" },
        { id: "snack_buaya",   nama: "Prime Meat",   favPet: "buaya",   favLabel: "Buaya",   kenyang: 5, mood: 10, harga: 40, ikon: "🥩", tipe: "snack" },
        { id: "snack_naga",    nama: "Ember Berry",  favPet: "naga",    favLabel: "Naga",    kenyang: 5, mood: 10, harga: 45, ikon: "🍒", tipe: "snack" },
        { id: "snack_beruang", nama: "Honey Berry",  favPet: "beruang", favLabel: "Beruang", kenyang: 5, mood: 10, harga: 35, ikon: "🍯", tipe: "snack" },
        { id: "snack_gajah",   nama: "Bamboo Snack", favPet: "gajah",   favLabel: "Gajah",   kenyang: 5, mood: 10, harga: 30, ikon: "🎍", tipe: "snack" },
        { id: "snack_kadal",   nama: "Cricket Snack",favPet: "kadal",   favLabel: "Kadal",   kenyang: 5, mood: 10, harga: 25, ikon: "🦗", tipe: "snack" }
    ],
    toys: [
        { id: "toy_bola",      nama: "Bola",              harga: 300,  ikon: "🎾", animasi: "happy",  deskripsi: "Pet mengejar dan menyentuh bola." },
        { id: "toy_benang",    nama: "Gulungan Benang",   harga: 250,  ikon: "🧶", animasi: "happy",  deskripsi: "Pet bermain dan mengejar benang." },
        { id: "toy_frisbee",   nama: "Frisbee",           harga: 450,  ikon: "🥏", animasi: "happy",  deskripsi: "Pet melompat mengejar frisbee." },
        { id: "toy_bunyi",     nama: "Mainan Berbunyi",   harga: 350,  ikon: "🐤", animasi: "idle",   deskripsi: "Pet menepuk dan bereaksi pada suara." },
        { id: "toy_sabun",     nama: "Gelembung Sabun",   harga: 400,  ikon: "🫧", animasi: "happy",  deskripsi: "Pet mengejar gelembung melayang." },
        { id: "toy_boneka",    nama: "Boneka Plush",      harga: 5000,  ikon: "🧸", animasi: "sleepy", deskripsi: "Pet memeluk boneka." },
        { id: "toy_bulu",      nama: "Tongkat Bulu",      harga: 4000,  ikon: "🪶", animasi: "happy",  deskripsi: "Pet mengikuti gerakan bulu." },
        { id: "toy_terowongan",nama: "Terowongan Bermain",harga: 7000,  ikon: "🕳️", animasi: "idle",   deskripsi: "Pet masuk terowongan." },
        { id: "toy_alatmusik", nama: "Alat Musik Mini",   harga: 6500,  ikon: "🪘", animasi: "happy",  deskripsi: "Pet memainkan alat musik." },
        { id: "toy_kotakmusik",nama: "Kotak Musik",       harga: 7000,  ikon: "🎶", animasi: "happy",  deskripsi: "Pet bergoyang mengikuti musik." },
        { id: "toy_keyboard",  nama: "Mini Keyboard",     harga: 9000,  ikon: "🎹", animasi: "happy",  deskripsi: "Pet menekan tuts." },
        { id: "toy_mp3",       nama: "Pemutar Musik",     harga: 85000,  ikon: "🎧", animasi: "happy",  deskripsi: "Pet menari dengan irama lagu." },
        { id: "toy_garuk",     nama: "Tiang Garukan",     harga: 90000,  ikon: "🪵", animasi: "idle",   deskripsi: "Pet meregangkan tubuh dan menggaruk." },
        { id: "toy_panjat",    nama: "Rangka Panjat",     harga: 120000, ikon: "🪜", animasi: "happy",  deskripsi: "Pet memanjat dan melompat." },
        { id: "toy_bintang",   nama: "Proyektor Bintang", harga: 100000, ikon: "🌌", animasi: "sleepy", deskripsi: "Pet memandangi proyeksi bintang." }
    ],
    decorations: [
        { id: "dec_bed",      nama: "Tempat Tidur Pet",  harga: 250,  ikon: "🛏️", slot: "Kiri Tanah" },
        { id: "dec_pillow",   nama: "Bantal Lucu",       harga: 2000,  ikon: "🛋️", slot: "Tengah Tanah" },
        { id: "dec_tree",     nama: "Pohon Panjat",      harga: 5000,  ikon: "🌳", slot: "Kiri Belakang" },
        { id: "dec_woodhouse",nama: "Rumah Kayu Mini",   harga: 7000,  ikon: "🛖", slot: "Kiri Tanah" },
        { id: "dec_pond",     nama: "Kolam Mini",        harga: 9000,  ikon: "🏝️", slot: "Kanan Tanah" },
        { id: "dec_fountain", nama: "Air Mancur",        harga: 12000, ikon: "⛲", slot: "Kanan Tanah" },
        { id: "dec_flower",   nama: "Taman Bunga",       harga: 15000, ikon: "🌷", slot: "Tengah Belakang" },
        { id: "dec_crystal",  nama: "Kristal Bercahaya", harga: 20000, ikon: "💎", slot: "Kanan Belakang" },
        { id: "dec_castle",   nama: "Istana Mini",       harga: 3000000, ikon: "🏰", slot: "Kiri Belakang" },
        { id: "dec_painting", nama: "Lukisan Dinding",   harga: 600,  ikon: "🖼️", slot: "Dinding Belakang" }
    ],
    wardrobe: [
        { id: "head_bandana", nama: "Bandana",             slot: "head",    harga: 250,  ikon: "🧣", deskripsi: "Kain keren di dahi pet." },
        { id: "head_casual",  nama: "Topi Kasual",         slot: "head",    harga: 400,  ikon: "🧢", deskripsi: "Topi santai untuk jalan-jalan." },
        { id: "head_pesta",   nama: "Topi Pesta",          slot: "head",    harga: 300,  ikon: "🥳", deskripsi: "Topi kerucut perayaan." },
        { id: "head_flower",  nama: "Flower Crown",        slot: "head",    harga: 650,  ikon: "🌸", deskripsi: "Mahkota rangkaian bunga segar." },
        { id: "head_wizard",  nama: "Wizard Hat",          slot: "head",    harga: 7500,  ikon: "🧙", deskripsi: "Topi penyihir berbintang." },
        { id: "head_wisuda",  nama: "Topi Wisuda",         slot: "head",    harga: 5000,  ikon: "🎓", deskripsi: "Toga topi kelulusan." },
        { id: "head_crown",   nama: "Royal Crown",         slot: "head",    harga: 18000, ikon: "👑", deskripsi: "Mahkota emas kerajaan." },
        { id: "head_bajak",   nama: "Topi Bajak Laut",     slot: "head",    harga: 70000,  ikon: "🏴‍☠️", deskripsi: "Topi kapten kapal." },

        { id: "eyes_round",   nama: "Kacamata Bulat",      slot: "eyes",    harga: 300,  ikon: "👓", deskripsi: "Kacamata bulat gaya ilmuwan." },
        { id: "eyes_star",    nama: "Kacamata Bintang",    slot: "eyes",    harga: 500,  ikon: "🤩", deskripsi: "Bingkai bintang ceria." },
        { id: "eyes_goggles", nama: "Goggles Penjelajah",  slot: "eyes",    harga: 6000,  ikon: "🥽", deskripsi: "Pelindung petualang." },
        { id: "eyes_monocle", nama: "Monocle Emas",        slot: "eyes",    harga: 9000,  ikon: "🧐", deskripsi: "Lensa tunggal berlapis emas." },
        { id: "eyes_halo",    nama: "Halo Bercahaya",      slot: "eyes",    harga: 12000, ikon: "😇", deskripsi: "Cincin melayang di atas kepala." },

        { id: "neck_dasi",    nama: "Dasi Pita",           slot: "neck",    harga: 200,  ikon: "🎀", deskripsi: "Pita mungil di leher." },
        { id: "neck_syal",    nama: "Syal",                slot: "neck",    harga: 300,  ikon: "🧣", deskripsi: "Syal rajut penghangat tubuh." },
        { id: "neck_kalung",  nama: "Kalung Bintang",      slot: "neck",    harga: 350,  ikon: "⭐", deskripsi: "Kalung dengan liontin bintang." },
        { id: "neck_ransel",  nama: "Ransel Mini",         slot: "neck",    harga: 600,  ikon: "🎒", deskripsi: "Tas ransel petualang." },
        { id: "neck_hp",      nama: "Headphone",           slot: "neck",    harga: 500,  ikon: "🎧", deskripsi: "Headset musik modis." },
        { id: "neck_sayap",   nama: "Sayap Peri",          slot: "neck",    harga: 9000,  ikon: "🦋", deskripsi: "Sayap hias transparan." },
        { id: "neck_sepatu",  nama: "Sepatu Mini",         slot: "neck",    harga: 4500,  ikon: "👟", deskripsi: "Alas kaki mungil." },
        { id: "neck_jubah",   nama: "Jubah Pendek",        slot: "neck",    harga: 8000,  ikon: "🧥", deskripsi: "Jubah kain sebahu." },

        { id: "body_tshirt",  nama: "Kaos Kasual",         slot: "body",    harga: 500,  ikon: "👕", deskripsi: "Kaos santai sehari-hari." },
        { id: "body_hoodie",  nama: "Hoodie",              slot: "body",    harga: 800,  ikon: "🧥", deskripsi: "Jaket hoodie hangat." },
        { id: "body_labcoat", nama: "Jas Laboratorium",    slot: "body",    harga: 900,  ikon: "🥼", deskripsi: "Jas putih peneliti." },
        { id: "body_explorer",nama: "Seragam Penjelajah",  slot: "body",    harga: 1100, ikon: "🦺", deskripsi: "Rompi lapangan lengkap." },
        { id: "body_winter",  nama: "Mantel Musim Dingin", slot: "body",    harga: 1200, ikon: "🧣", deskripsi: "Mantel tebal berbulu." },
        { id: "body_grad",    nama: "Jubah Wisuda",        slot: "body",    harga: 140000, ikon: "🎓", deskripsi: "Jubah kelulusan." },
        { id: "body_festival",nama: "Seragam Festival",    slot: "body",    harga: 160000, ikon: "👘", deskripsi: "Pakaian meriah festival." },
        { id: "body_batik",   nama: "Baju Batik",          slot: "body",    harga: 90000,  ikon: "👔", deskripsi: "Batik motif elegan." },
        { id: "body_koki",    nama: "Kostum Koki",         slot: "body",    harga: 100000, ikon: "🧑‍🍳", deskripsi: "Celemek dan seragam dapur." },
        { id: "body_detektif",nama: "Kostum Detektif",     slot: "body",    harga: 180000, ikon: "🕵️", deskripsi: "Mantel investigasi." },

        { id: "cost_dino",    nama: "Dino Suit",           slot: "costume", harga: 220000, ikon: "🦖", deskripsi: "Kostum dinosaurus imut." },
        { id: "cost_hero",    nama: "Superhero",           slot: "costume", harga: 250000, ikon: "🦸", deskripsi: "Pakaian pahlawan berjubah." },
        { id: "cost_astro",   nama: "Astronaut",           slot: "costume", harga: 300000, ikon: "🧑‍🚀", deskripsi: "Baju antariksa lengkap." },
        { id: "cost_knight",  nama: "Royal Knight",        slot: "costume", harga: 350000, ikon: "⚔️", deskripsi: "Zirah kesatria kerajaan." },
        { id: "cost_royal",   nama: "Royal Costume",       slot: "costume", harga: 450000, ikon: "🤴", deskripsi: "Jubah beludru & aksen emas." },
        { id: "cost_penyihir",nama: "Penyihir Fantasi",    slot: "costume", harga: 260000, ikon: "🪄", deskripsi: "Jubah bintang magis." },
        { id: "cost_pirate",  nama: "Bajak Laut",          slot: "costume", harga: 220000, ikon: "🏴‍☠️", deskripsi: "Pakaian kapten lautan." }
    ]
};


// =========================================================================
// 2. ARSITEKTUR DUAL-XP (XP TOTAL LEADERBOARD vs XP TERSEDIA BELANJA)
// =========================================================================

// Pastikan objek siswa di Leaderboard memiliki xp (XP Total), xpTersedia (Saldo Belanja), & myPetData
window.pastikanStrukturDualXPDanPet = function(uName) {
    let userKey = uName || sessionStorage.getItem("username");
    if (!userKey) return null;

    let isAdmin = (typeof window.isAdminSession === "function" && window.isAdminSession()) ||
                  sessionStorage.getItem("statusLogin") === "admin" ||
                  userKey.toLowerCase() === "mahardika";

    if (!window.leaderboardSiswaData) window.leaderboardSiswaData = {};

    // Isolasi Admin/Guru ke memori terpisah agar tidak pernah masuk ke Leaderboard Siswa di Firebase
    if (isAdmin) {
        if (!window._adminSandboxPetProfile) {
            window._adminSandboxPetProfile = {
                kelas: "Guru / Admin",
                namaLengkap: userKey,
                xp: 1000000000,
                xpTotal: 1000000000,
                xpTersedia: 1000000000,
                myPetData: {
                    habitatLevel: 6,
                    activePetId: "",
                    ownedPets: {},
                    foodInventory: {},
                    ownedDecorations: [],
                    activeDecorations: [],
                    ownedWardrobe: []
                }
            };
        }
        return window._adminSandboxPetProfile;
    }

    let akunAsli = (window.akunSiswaData && window.akunSiswaData[userKey]) ? window.akunSiswaData[userKey] : null;

    if (!window.leaderboardSiswaData[userKey]) {
        if (!window.leaderboardLoaded || !akunAsli) return null;

        window.leaderboardSiswaData[userKey] = {
            kelas: akunAsli.kelas || "Umum",
            namaLengkap: akunAsli.namaLengkap || userKey,
            xp: 0,
            xpTotal: 0,
            xpTersedia: 0,
            statSoal: { PG: 0, PGK: 0, IS: 0, Essay: 0 }
        };
    }

    let lb = window.leaderboardSiswaData[userKey];

    // Pulihkan kelas dan nama lengkap siswa dari akunSiswaData jika sempat kosong
    if (akunAsli) {
        if ((!lb.kelas || lb.kelas === "Umum") && akunAsli.kelas && akunAsli.kelas !== "Umum") {
            lb.kelas = akunAsli.kelas;
        }
        if ((!lb.namaLengkap || lb.namaLengkap === userKey) && akunAsli.namaLengkap) {
            lb.namaLengkap = akunAsli.namaLengkap;
        }
    }

    let currentTotal = Number(lb.xp) || 0;
    if (typeof lb.xpTotal !== "number" || currentTotal > lb.xpTotal) {
        lb.xpTotal = currentTotal;
    }
    lb.xp = lb.xpTotal;

    if (typeof lb.xpTersedia !== "number") {
        let spent = Number(lb.xpSpentTotal) || 0;
        lb.xpTersedia = Math.max(0, lb.xpTotal - spent);
    }

    if (!lb.myPetData || typeof lb.myPetData !== "object") {
        lb.myPetData = {
            habitatLevel: 0,
            activePetId: "",
            ownedPets: {},
            foodInventory: {},
            ownedDecorations: [],
            activeDecorations: [],
            ownedWardrobe: []
        };
    } else {
        if (!lb.myPetData.ownedPets) lb.myPetData.ownedPets = {};
        if (!lb.myPetData.foodInventory) lb.myPetData.foodInventory = {};
        if (!Array.isArray(lb.myPetData.ownedDecorations)) lb.myPetData.ownedDecorations = Object.values(lb.myPetData.ownedDecorations || {});
        if (!Array.isArray(lb.myPetData.activeDecorations)) lb.myPetData.activeDecorations = Object.values(lb.myPetData.activeDecorations || {});
        if (!Array.isArray(lb.myPetData.ownedWardrobe)) lb.myPetData.ownedWardrobe = Object.values(lb.myPetData.ownedWardrobe || {});
    }

    return lb;
};

// Ambil XP Total (untuk Leaderboard & Lencana)
window.ambilXPTotalSiswa = function(uName) {
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    return lb ? (Number(lb.xpTotal) || 0) : 0;
};

// Ambil XP Tersedia (untuk belanja di My Pet & Border Shop)
window.ambilXPTersediaSiswa = function(uName) {
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    return lb ? (Number(lb.xpTersedia) || 0) : 0;
};

// Kurangi XP Tersedia saat membeli item (XP Total tetap utuh!)
window.gunakanXPTersediaSiswa = function(hargaXP, keterangan) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return false;

    let biaya = Number(hargaXP) || 0;
    if (lb.xpTersedia < biaya) return false;

    lb.xpTersedia -= biaya;
    lb.xpSpentTotal = (Number(lb.xpSpentTotal) || 0) + biaya;
    // Pastikan lb.xp tetap memegang XP Total agar peringkat Leaderboard tidak berubah
    lb.xp = lb.xpTotal;

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }
    window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") {
        window.perbaruiUIHeaderProfilSiswa();
    }
    return true;
};


// =========================================================================
// 3. MESIN WAKTU LAPAR REAL-TIME (-4 POIN / JAM) & STATUS RESPONS PET
// =========================================================================

// Hitung penurunan kenyang & mood berdasarkan selisih waktu nyata sejak terakhir dibuka
window.sinkronkanWaktuLaparSemuaPet = function(uName) {
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData || !lb.myPetData.ownedPets) return false;

    let nowMs = Date.now();
    let adaPerubahan = false;
    let petsMap = lb.myPetData.ownedPets;

    Object.keys(petsMap).forEach(function(petId) {
        let p = petsMap[petId];
        if (!p) return;

        let lastMs = Number(p.lastUpdate) || nowMs;
        let selisihJam = Math.max(0, (nowMs - lastMs) / (1000 * 60 * 60));

        // Jika sudah lewat minimal 3 menit (0.05 jam), hitung penurunan (4 poin per jam)
        if (selisihJam >= 0.05) {
            let turunKenyang = Math.floor(selisihJam * 4);
            if (turunKenyang > 0) {
                let kenyangLama = typeof p.hunger === "number" ? p.hunger : 80;
                p.hunger = Math.max(0, Math.min(100, kenyangLama - turunKenyang));

                // Mood ikut turun perlahan (2 poin per jam, atau 4 poin per jam jika pet sedang lapar < 25)
                let lajuMood = p.hunger < 25 ? 4 : 2;
                let turunMood = Math.floor(selisihJam * lajuMood);
                let moodLama = typeof p.mood === "number" ? p.mood : 85;
                p.mood = Math.max(0, Math.min(100, moodLama - turunMood));

                // Majukan penanda waktu sesuai porsi jam yang sudah dihitung agar akurat
                p.lastUpdate = lastMs + Math.floor((turunKenyang / 4) * 3600 * 1000);
                adaPerubahan = true;
            }
        }
    });

    if (adaPerubahan && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        let keyUser = uName || sessionStorage.getItem("username");
        if (keyUser) window.simpanLeaderboardSiswaKeDB(keyUser, lb);
    }
    return adaPerubahan;
};

// Ambil informasi status lapar sesuai tabel aturan (80-100, 50-79, 25-49, 1-24, 0=Kritis)
window.dapatkanInfoStatusLaparPet = function(nilaiKenyang) {
    let k = Math.max(0, Math.min(100, Math.round(Number(nilaiKenyang) || 0)));
    if (k >= 80) {
        return { status: "Kenyang", warna: "#16a34a", bg: "#dcfce7", animState: "happy", respons: "Aktif dan ceria", isKritis: false };
    }
    if (k >= 50) {
        return { status: "Normal", warna: "#2563eb", bg: "#dbeafe", animState: "idle", respons: "Tenang dan nyaman di habitat", isKritis: false };
    }
    if (k >= 25) {
        return { status: "Lapar", warna: "#d97706", bg: "#fef3c7", animState: "hungry", respons: "Sesekali melihat wadah makanan", isKritis: false };
    }
    if (k >= 1) {
        return { status: "Sangat Lapar", warna: "#ea580c", bg: "#ffedd5", animState: "hungry", respons: "Gerakan melambat dan butuh makan segera!", isKritis: false };
    }
    return { status: "Kritis", warna: "#dc2626", bg: "#fee2e2", animState: "critical", respons: "⚠️ Pet duduk lemas! Beri makan sekarang untuk memulihkannya!", isKritis: true };
};

// Hitung Level Bond dari akumulasi poin Bond
window.hitungLevelBondPet = function(bondXp) {
    let bx = Number(bondXp) || 0;
    // Setiap 100 poin Bond naik 1 level (Level 1 mulai dari 0)
    let lvl = Math.floor(bx / 100) + 1;
    let sisa = bx % 100;
    return { level: lvl, progressPct: sisa, current: sisa, next: 100 };
};

// =========================================================================
// 4. INJEKSI TOMBOL MELAYANG "🐾 My Pet" DI KIRI BAWAH & MODAL UTAMA 4 TAB
// =========================================================================
window.activeMyPetTab = "habitat";

window.pastikanStrukturDualXPDanPet = function(uName) {
    let userKey = uName || sessionStorage.getItem("username");
    if (!userKey) return null;

    let isAdmin = (typeof window.isAdminSession === "function" && window.isAdminSession()) ||
                  sessionStorage.getItem("statusLogin") === "admin" ||
                  userKey.toLowerCase() === "mahardika";

    if (!window.leaderboardSiswaData) window.leaderboardSiswaData = {};

    // Sandbox khusus Admin agar bisa menguji semua fitur dengan 1 Miliar Coin tanpa masuk ke Leaderboard Siswa
    if (isAdmin) {
        if (!window._adminSandboxPetProfile) {
            window._adminSandboxPetProfile = {
                kelas: "Guru / Admin",
                namaLengkap: userKey,
                xp: 1000000000,
                xpTotal: 1000000000,
                coin: 1000000000,
                xpTersedia: 1000000000,
                myPetData: {
                    activePetId: "",
                    ownedPets: {},
                    foodInventory: {},
                    ownedToys: [],
                    ownedDecorations: [],
                    activeDecorations: [],
                    ownedWardrobe: []
                }
            };
        }
        return window._adminSandboxPetProfile;
    }

    let akunAsli = (window.akunSiswaData && window.akunSiswaData[userKey]) ? window.akunSiswaData[userKey] : null;

    if (!window.leaderboardSiswaData[userKey]) {
        if (!window.leaderboardLoaded || !akunAsli) return null;

        window.leaderboardSiswaData[userKey] = {
            kelas: akunAsli.kelas || "Umum",
            namaLengkap: akunAsli.namaLengkap || userKey,
            xp: 0,
            xpTotal: 0,
            coin: 0,
            xpTersedia: 0,
            statSoal: { PG: 0, PGK: 0, IS: 0, Essay: 0 }
        };
    }

    let lb = window.leaderboardSiswaData[userKey];

    if (akunAsli) {
        if ((!lb.kelas || lb.kelas === "Umum") && akunAsli.kelas && akunAsli.kelas !== "Umum") {
            lb.kelas = akunAsli.kelas;
        }
        if ((!lb.namaLengkap || lb.namaLengkap === userKey) && akunAsli.namaLengkap) {
            lb.namaLengkap = akunAsli.namaLengkap;
        }
    }

    // 1. Pastikan XP Total Leaderboard selalu utuh dan tidak pernah turun
    let currentTotal = Number(lb.xp) || 0;
    if (typeof lb.xpTotal !== "number" || currentTotal > lb.xpTotal) {
        lb.xpTotal = currentTotal;
    }
    lb.xp = lb.xpTotal;

    // 2. Migrasi & Sinkronisasi Saldo COIN (Untuk Belanja Pet & Border)
    let spent = Number(lb.xpSpentTotal) || 0;
    if (typeof lb.coin !== "number") {
        if (typeof lb.xpTersedia === "number") {
            lb.coin = Math.max(0, lb.xpTersedia);
        } else {
            lb.coin = Math.max(0, lb.xpTotal - spent);
        }
    }
    lb.xpTersedia = lb.coin;

    // 3. Struktur dasar My Pet milik siswa (Habitat Universal Tanpa Batas)
    if (!lb.myPetData || typeof lb.myPetData !== "object") {
        lb.myPetData = {
            activePetId: "",
            ownedPets: {},
            foodInventory: {},
            ownedToys: [],
            ownedDecorations: [],
            activeDecorations: [],
            ownedWardrobe: []
        };
    } else {
        if (!lb.myPetData.ownedPets) lb.myPetData.ownedPets = {};
        if (!lb.myPetData.foodInventory) lb.myPetData.foodInventory = {};
        if (!Array.isArray(lb.myPetData.ownedToys)) lb.myPetData.ownedToys = Object.values(lb.myPetData.ownedToys || {});
        if (!Array.isArray(lb.myPetData.ownedDecorations)) lb.myPetData.ownedDecorations = Object.values(lb.myPetData.ownedDecorations || {});
        if (!Array.isArray(lb.myPetData.activeDecorations)) lb.myPetData.activeDecorations = Object.values(lb.myPetData.activeDecorations || {});
        if (!Array.isArray(lb.myPetData.ownedWardrobe)) lb.myPetData.ownedWardrobe = Object.values(lb.myPetData.ownedWardrobe || {});
    }

    return lb;
};

// Ambil XP Total (Murni untuk Leaderboard & Lencana Sains)
window.ambilXPTotalSiswa = function(uName) {
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    return lb ? (Number(lb.xpTotal) || 0) : 0;
};

// Ambil Saldo Coin (Untuk belanja di My Pet & Border Shop)
window.ambilCoinSiswa = function(uName) {
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    return lb ? (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) : 0;
};
window.ambilXPTersediaSiswa = window.ambilCoinSiswa;

// Kurangi Coin saat membeli item (XP Leaderboard tetap 100% utuh!)
window.gunakanCoinSiswa = function(hargaCoin, keterangan) {
    if (window._sedangTransaksiCoin) return false;
    window._sedangTransaksiCoin = true;

    try {
        let uName = sessionStorage.getItem("username");
        let lb = window.pastikanStrukturDualXPDanPet(uName);
        if (!lb) return false;

        let biaya = Math.max(0, Number(hargaCoin) || 0);
        let saldoCoin = Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0;
        if (saldoCoin < biaya) return false;

        lb.coin = Math.max(0, saldoCoin - biaya);
        lb.xpTersedia = lb.coin;
        lb.xpSpentTotal = (Number(lb.xpSpentTotal) || 0) + biaya;
        lb.xp = lb.xpTotal; // Jaga XP Leaderboard tetap utuh

        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.perbaruiTampilanSaldoXPPet();
        if (typeof window.perbaruiUIHeaderProfilSiswa === "function") {
            window.perbaruiUIHeaderProfilSiswa();
        }
        return true;
    } finally {
        window._sedangTransaksiCoin = false;
    }
};
window.gunakanXPTersediaSiswa = window.gunakanCoinSiswa;

// =========================================================================
// 3. MESIN WAKTU LAPAR REAL-TIME (-4 POIN / JAM) & STATUS RESPONS PET
// =========================================================================
window.sinkronkanWaktuLaparSemuaPet = function(uName) {
    let keyUser = uName || sessionStorage.getItem("username");
    let lb = (uName && window.leaderboardSiswaData && window.leaderboardSiswaData[uName])
        ? window.leaderboardSiswaData[uName]
        : window.pastikanStrukturDualXPDanPet(keyUser);
    if (!lb || !lb.myPetData || !lb.myPetData.ownedPets) return false;

    let nowMs = Date.now();
    let adaPerubahan = false;
    let petsMap = lb.myPetData.ownedPets;

    Object.keys(petsMap).forEach(function(petId) {
        let p = petsMap[petId];
        if (!p) return;

        let lastMs = Number(p.lastUpdate) || nowMs;
        let selisihJam = Math.max(0, (nowMs - lastMs) / (1000 * 60 * 60));

        if (selisihJam >= 0.05) {
            let turunKenyang = Math.floor(selisihJam * 4);
            if (turunKenyang > 0) {
                let kenyangLama = typeof p.hunger === "number" ? p.hunger : 80;
                p.hunger = Math.max(0, Math.min(100, kenyangLama - turunKenyang));

                let lajuMood = p.hunger < 25 ? 4 : 2;
                let turunMood = Math.floor(selisihJam * lajuMood);
                let moodLama = typeof p.mood === "number" ? p.mood : 85;
                p.mood = Math.max(0, Math.min(100, moodLama - turunMood));

                p.lastUpdate = lastMs + Math.floor((turunKenyang / 4) * 3600 * 1000);
                adaPerubahan = true;
            }
        }
    });

    if (adaPerubahan && !window.modeKunjunganPet && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        if (keyUser) window.simpanLeaderboardSiswaKeDB(keyUser, lb);
    }
    return adaPerubahan;
};

window.dapatkanInfoStatusLaparPet = function(nilaiKenyang) {
    let k = Math.max(0, Math.min(100, Math.round(Number(nilaiKenyang) || 0)));
    if (k >= 80) {
        return { status: "Kenyang", warna: "#16a34a", bg: "#dcfce7", animState: "happy", respons: "Aktif dan ceria", isKritis: false };
    }
    if (k >= 50) {
        return { status: "Normal", warna: "#2563eb", bg: "#dbeafe", animState: "idle", respons: "Tenang dan nyaman di habitat", isKritis: false };
    }
    if (k >= 25) {
        return { status: "Lapar", warna: "#d97706", bg: "#fef3c7", animState: "hungry", respons: "Sesekali melihat wadah makanan", isKritis: false };
    }
    if (k >= 1) {
        return { status: "Sangat Lapar", warna: "#ea580c", bg: "#ffedd5", animState: "hungry", respons: "Gerakan melambat dan butuh makan segera!", isKritis: false };
    }
    return { status: "Kritis", warna: "#dc2626", bg: "#fee2e2", animState: "critical", respons: "Pet duduk lemas! Beri makan sekarang untuk memulihkannya!", isKritis: true };
};

window.hitungLevelBondPet = function(bondXp) {
    let bx = Number(bondXp) || 0;
    let lvl = Math.floor(bx / 100) + 1;
    let sisa = bx % 100;
    return { level: lvl, progressPct: sisa, current: sisa, next: 100 };
};

// =========================================================================
// 4. INJEKSI TOMBOL MELAYANG "🐾 My Pet" DI KIRI BAWAH & MODAL UTAMA 4 TAB
// =========================================================================
window.activeMyPetTab = "habitat";

window.pastikanUIMyPetAda = function() {
    if (!document.getElementById("btn-floating-mypet")) {
        let btn = document.createElement("button");
        btn.id = "btn-floating-mypet";
        btn.className = "mypet-floating-btn";
        btn.onclick = function() { window.bukaModalMyPet(); };
        btn.innerHTML =
            '<span class="mypet-float-icon">🐾</span>' +
            '<span class="mypet-float-text">My Pet</span>' +
            '<span id="mypet-hungry-dot" class="mypet-hungry-badge" style="display:none;">!</span>';
        document.body.appendChild(btn);
    }

    if (!document.getElementById("modal-my-pet")) {
        let modal = document.createElement("div");
        modal.id = "modal-my-pet";
        modal.className = "modal-overlay";
        modal.onclick = function(e) {
            if (e.target === modal) window.tutupModalMyPet();
        };

        modal.innerHTML =
            '<div class="modal-box mypet-modal-box">' +
                '<div class="mypet-header">' +
                    '<div style="display:flex; align-items:center; gap:10px;">' +
                        '<span style="font-size:24px;">🐾</span>' +
                        '<div>' +
                            '<h3 style="margin:0; color:#ffffff; font-size:17px; letter-spacing:0.3px;">My Pet Sanctuary</h3>' +
                            '<div style="font-size:11px; color:#cbd5e1;">Rawat hewan kesayanganmu dengan Coin hasil belajar!</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">' +
                        '<div class="mypet-xp-pill" title="Saldo Coin untuk membeli Pet, Makanan, Mainan, Kostum, & Bingkai (Tidak mengurangi XP Leaderboard)">' +
                            '<span style="font-size:10px; color:#fde047; font-weight:700; text-transform:uppercase;">🪙 Coin Belanja</span>' +
                            '<strong id="mypet-header-xp-tersedia" style="font-size:15px; color:#ffffff;">0 Coin</strong>' +
                        '</div>' +
                        '<div class="mypet-xp-pill total-pill" title="Akumulasi XP murni untuk peringkat di Leaderboard">' +
                            '<span style="font-size:10px; color:#93c5fd; font-weight:700; text-transform:uppercase;">🏆 XP Leaderboard</span>' +
                            '<strong id="mypet-header-xp-total" style="font-size:13px; color:#e0f2fe;">0 XP</strong>' +
                        '</div>' +
                        '<button type="button" class="close-btn" style="color:#ffffff; font-size:20px; margin-left:4px;" onclick="window.tutupModalMyPet()">✕</button>' +
                    '</div>' +
                '</div>' +

                '<div class="mypet-tabs-bar">' +
                    '<button type="button" id="tab-btn-mypet-habitat" class="mypet-tab-btn active" onclick="window.gantiTabMyPet(\'habitat\')">🏡 Habitat</button>' +
                    '<button type="button" id="tab-btn-mypet-collection" class="mypet-tab-btn" onclick="window.gantiTabMyPet(\'collection\')">🐾 Pet Collection</button>' +
                    '<button type="button" id="tab-btn-mypet-shop" class="mypet-tab-btn" onclick="window.gantiTabMyPet(\'shop\')">🛒 Shop</button>' +
                    '<button type="button" id="tab-btn-mypet-wardrobe" class="mypet-tab-btn" onclick="window.gantiTabMyPet(\'wardrobe\')">👗 Wardrobe</button>' +
                '</div>' +

                '<div class="modal-body mypet-body-container">' +
                    '<div id="mypet-view-habitat" class="mypet-tab-view"></div>' +
                    '<div id="mypet-view-collection" class="mypet-tab-view" style="display:none;"></div>' +
                    '<div id="mypet-view-shop" class="mypet-tab-view" style="display:none;"></div>' +
                    '<div id="mypet-view-wardrobe" class="mypet-tab-view" style="display:none;"></div>' +
                '</div>' +
            '</div>';

        document.body.appendChild(modal);
    }
};

window.perbaruiTampilanSaldoXPPet = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    let elAvail = document.getElementById("mypet-header-xp-tersedia");
    let elTotal = document.getElementById("mypet-header-xp-total");
    let dotHungry = document.getElementById("mypet-hungry-dot");

    let coinVal = lb ? Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia || 0) : 0;
    let xpVal = lb ? Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp || 0) : 0;

    if (elAvail) elAvail.innerText = coinVal.toLocaleString("id-ID") + " Coin";
    if (elTotal) elTotal.innerText = xpVal.toLocaleString("id-ID") + " XP";

    if (dotHungry && lb && lb.myPetData && lb.myPetData.ownedPets) {
        let adaLapar = Object.values(lb.myPetData.ownedPets).some(function(p) {
            return p && Number(p.hunger) < 30;
        });
        dotHungry.style.display = adaLapar ? "flex" : "none";
    }

    let elProfilXp = document.getElementById("profil-total-xp");
    if (elProfilXp && lb) {
        elProfilXp.innerHTML = xpVal.toLocaleString("id-ID") + " XP" +
            '<div style="font-size:11px; font-weight:800; color:#d97706; font-family:\'Poppins\',sans-serif; margin-top:3px; background:#fef3c7; padding:2px 8px; border-radius:10px; border:1px solid #facc15;">🪙 ' + coinVal.toLocaleString("id-ID") + ' Coin</div>';
    }
};

window.bukaModalMyPet = function() {
    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        alert("🔒 Silakan login menggunakan akun Siswa terlebih dahulu untuk membuka fitur My Pet!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    window.pastikanUIMyPetAda();
    // Pastikan kembali ke habitat milik sendiri jika sebelumnya habis mengunjungi teman
    window.modeKunjunganPet = null;
    document.querySelectorAll(".mypet-tab-btn").forEach(function(btn) {
        btn.style.display = "inline-block";
    });

    let uName = sessionStorage.getItem("username");
    window.pastikanStrukturDualXPDanPet(uName);
    window.sinkronkanWaktuLaparSemuaPet(uName);
    window.perbaruiTampilanSaldoXPPet();

    window.bukaModal("modal-my-pet");
    window.isMyPetModalOpen = true;
    window.gantiTabMyPet(window.activeMyPetTab || "habitat");
};

window.tutupModalMyPet = function() {
    window.isMyPetModalOpen = false;
    // Hentikan interval animasi yang tidak diperlukan saat modal ditutup agar hemat resource
    if (window.myPetAnimTimer) {
        clearInterval(window.myPetAnimTimer);
        window.myPetAnimTimer = null;
    }
    window.tutupModal("modal-my-pet");
};

window.gantiTabMyPet = function(tabName) {
    window.activeMyPetTab = tabName;
    let tabs = ["habitat", "collection", "shop", "wardrobe"];
    tabs.forEach(function(t) {
        let btn = document.getElementById("tab-btn-mypet-" + t);
        let view = document.getElementById("mypet-view-" + t);
        if (btn) {
            if (t === tabName) btn.classList.add("active");
            else btn.classList.remove("active");
        }
        if (view) {
            view.style.display = (t === tabName) ? "block" : "none";
        }
    });

    window.perbaruiTampilanSaldoXPPet();

    if (tabName === "habitat" && typeof window.renderTabHabitatMyPet === "function") {
        window.renderTabHabitatMyPet();
    } else if (tabName === "collection" && typeof window.renderTabCollectionMyPet === "function") {
        window.renderTabCollectionMyPet();
    } else if (tabName === "shop" && typeof window.renderTabShopMyPet === "function") {
        window.renderTabShopMyPet();
    } else if (tabName === "wardrobe" && typeof window.renderTabWardrobeMyPet === "function") {
        window.renderTabWardrobeMyPet();
    }
};


document.addEventListener("DOMContentLoaded", function() {
    window.pastikanUIMyPetAda();
    setTimeout(function() {
        let uName = sessionStorage.getItem("username");
        if (uName) {
            window.pastikanStrukturDualXPDanPet(uName);
            window.sinkronkanWaktuLaparSemuaPet(uName);
            window.perbaruiTampilanSaldoXPPet();
        }
    }, 1200);
});

/* =========================================================================
   MODUL MY PET ENGINE — TAHAP 2:
   - Generator Karakter Kartun 2.5D Chibi (Kanvas 512x512, Proporsi Spesies)
   - Sistem Layering 22 Item Wardrobe (Head, Eyes, Body, & Full Costume)
   - Mesin 5 Animasi Ringan (Idle, Happy, Eating, Sleepy, Hungry/Critical)
   - Auto-Pause Animasi saat Modal My Pet Tidak Terlihat (Hemat CPU/Baterai)
   ========================================================================= */

// Kunci Katalog agar Harga & Atribut Tidak Bisa Diubah via Inspect/Console
(function kunciKatalogMyPet() {
    if (!window.MY_PET_CATALOG) return;
    Object.keys(window.MY_PET_CATALOG).forEach(function(k) {
        if (Array.isArray(window.MY_PET_CATALOG[k])) {
            window.MY_PET_CATALOG[k].forEach(function(item) { Object.freeze(item); });
            Object.freeze(window.MY_PET_CATALOG[k]);
        }
    });
    Object.freeze(window.MY_PET_CATALOG);
})();

window.bangunVisualPet25DSVG = function(petId, outfit, animState, ukuranPx) {
    let catPet = window.MY_PET_CATALOG.pets.find(function(p) { return p.id === petId; }) || window.MY_PET_CATALOG.pets[0];
    let eq = (outfit && typeof outfit === "object") ? outfit : {};
    let state = animState || "idle";
    let size = ukuranPx || 120;

    let spScale = catPet.scale || 1.0;
    let translateY = Math.round((1 - spScale) * 210);

    let palet = {
        kadal:   { main: "#4ade80", dark: "#16a34a", belly: "#dcfce7", cheek: "#fb7185", accent: "#15803d" },
        kucing:  { main: "#fb923c", dark: "#ea580c", belly: "#ffedd5", cheek: "#f43f5e", accent: "#9a3412" },
        anjing:  { main: "#d97706", dark: "#92400e", belly: "#fef3c7", cheek: "#fb7185", accent: "#78350f" },
        ikan:    { main: "#38bdf8", dark: "#0284c7", belly: "#e0f2fe", cheek: "#fb7185", accent: "#f97316" },
        monyet:  { main: "#a16207", dark: "#713f12", belly: "#fde68a", cheek: "#f43f5e", accent: "#fef08a" },
        buaya:   { main: "#10b981", dark: "#047857", belly: "#fef08a", cheek: "#fb7185", accent: "#065f46" },
        beruang: { main: "#78350f", dark: "#451a03", belly: "#fde68a", cheek: "#fb7185", accent: "#b45309" },
        gajah:   { main: "#94a3b8", dark: "#475569", belly: "#e2e8f0", cheek: "#f472b6", accent: "#cbd5e1" },
        :    { main: "#ef4444", dark: "#991b1b", belly: "#fde047", cheek: "#fb923c", accent: "#f59e0b" }
    }[petId] || { main: "#60a5fa", dark: "#2563eb", belly: "#dbeafe", cheek: "#fb7185", accent: "#1d4ed8" };

    // A. LAYER BELAKANG (Jubah Kostum, Sayap Peri, Ransel, Ekor Spesies)
    let backLayer = "";
    if (eq.costume === "cost_hero") {
        backLayer += '<path class="pet-cape-part" d="M165,260 L105,435 L407,435 L347,260 Z" fill="#dc2626" stroke="#991b1b" stroke-width="6"/>';
    } else if (eq.costume === "cost_royal") {
        backLayer += '<path class="pet-cape-part" d="M150,255 L95,442 L417,442 L362,255 Z" fill="#7e22ce" stroke="#facc15" stroke-width="8"/>';
    } else if (eq.costume === "cost_penyihir") {
        backLayer += '<path class="pet-cape-part" d="M155,258 L100,438 L412,438 L357,258 Z" fill="#312e81" stroke="#c084fc" stroke-width="6"/>';
    } else if (eq.neck === "neck_jubah") {
        backLayer += '<path class="pet-cape-part" d="M168,265 L125,385 L387,385 L344,265 Z" fill="#0284c7" stroke="#bae6fd" stroke-width="5"/>';
    }

    if (eq.neck === "neck_sayap") {
        backLayer +=
            '<g class="pet-wing-left"><ellipse cx="135" cy="285" rx="58" ry="34" transform="rotate(-25 135 285)" fill="rgba(244,114,182,0.55)" stroke="#ec4899" stroke-width="4"/><ellipse cx="145" cy="330" rx="42" ry="24" transform="rotate(15 145 330)" fill="rgba(192,132,252,0.55)" stroke="#a855f7" stroke-width="4"/></g>' +
            '<g class="pet-wing-right"><ellipse cx="377" cy="285" rx="58" ry="34" transform="rotate(25 377 285)" fill="rgba(244,114,182,0.55)" stroke="#ec4899" stroke-width="4"/><ellipse cx="367" cy="330" rx="42" ry="24" transform="rotate(-15 367 330)" fill="rgba(192,132,252,0.55)" stroke="#a855f7" stroke-width="4"/></g>';
    } else if (eq.neck === "neck_ransel") {
        backLayer += '<rect x="142" y="285" width="228" height="95" rx="22" fill="#e11d48" stroke="#881337" stroke-width="5"/>';
    }

    // Ekor & Sayap Bawaan Spesies
    if (petId === "") {
        backLayer +=
            '<g class="pet-wing-left"><path d="M175,275 C95,210 60,255 85,325 C115,310 145,320 175,315 Z" fill="#f97316" stroke="#991b1b" stroke-width="6"/></g>' +
            '<g class="pet-wing-right"><path d="M337,275 C417,210 452,255 427,325 C397,310 367,320 337,315 Z" fill="#f97316" stroke="#991b1b" stroke-width="6"/></g>' +
            '<g class="pet-tail-part"><path d="M330,390 Q425,405 435,340" fill="none" stroke="' + palet.main + '" stroke-width="26" stroke-linecap="round"/>' +
            '<path d="M435,340 C450,310 475,335 450,360 C435,370 420,355 435,340 Z" fill="#facc15" stroke="#ea580c" stroke-width="4"/></g>';
    } else if (petId === "ikan") {
        backLayer +=
            '<g class="pet-tail-part"><path d="M340,350 L435,295 C450,335 450,375 435,415 Z" fill="#f97316" stroke="#c2410c" stroke-width="6" stroke-linejoin="round"/>' +
            '<path d="M345,350 L412,320 M345,355 L412,388" stroke="#fde047" stroke-width="4" stroke-linecap="round"/></g>';
    } else if (petId === "buaya") {
        backLayer +=
            '<g class="pet-tail-part"><path d="M330,392 Q435,405 445,345 Q420,335 390,355" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/>' +
            '<polygon points="375,360 390,336 402,356" fill="#047857"/><polygon points="408,354 424,332 434,352" fill="#047857"/></g>';
    } else if (petId === "kadal") {
        backLayer += '<g class="pet-tail-part"><path d="M330,395 Q430,415 425,355 Q420,325 395,340" fill="none" stroke="' + palet.main + '" stroke-width="24" stroke-linecap="round"/></g>';
    } else if (petId === "kucing") {
        backLayer += '<g class="pet-tail-part"><path d="M335,390 Q420,360 405,285" fill="none" stroke="' + palet.main + '" stroke-width="22" stroke-linecap="round"/></g>';
    } else if (petId === "anjing") {
        backLayer += '<g class="pet-tail-part"><path d="M335,380 Q405,345 390,305" fill="none" stroke="' + palet.main + '" stroke-width="24" stroke-linecap="round"/></g>';
    } else if (petId === "monyet") {
        backLayer += '<g class="pet-tail-part"><path d="M330,390 Q435,370 425,290 Q415,255 390,280" fill="none" stroke="' + palet.dark + '" stroke-width="18" stroke-linecap="round"/></g>';
    } else if (petId === "beruang") {
        backLayer += '<circle class="pet-tail-part" cx="355" cy="390" r="20" fill="' + palet.dark + '"/>';
    } else if (petId === "gajah") {
        backLayer += '<g class="pet-tail-part"><path d="M355,390 Q405,405 410,430" fill="none" stroke="' + palet.dark + '" stroke-width="14" stroke-linecap="round"/></g>';
    }

    if (eq.costume === "cost_dino") {
        backLayer += '<polygon points="150,240 120,255 155,275" fill="#facc15"/><polygon points="145,295 112,315 152,330" fill="#facc15"/>';
    }

    // B. TELINGA / SIRIP / TANDUK SPESIES
    let earsLayer = "";
    if (petId === "kucing") {
        earsLayer =
            '<g class="pet-ear-left"><polygon points="155,175 135,85 215,130" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/><polygon points="162,162 148,105 202,135" fill="#fda4af"/></g>' +
            '<g class="pet-ear-right"><polygon points="357,175 377,85 297,130" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/><polygon points="350,162 364,105 310,135" fill="#fda4af"/></g>';
    } else if (petId === "anjing") {
        earsLayer =
            '<g class="pet-ear-left"><ellipse cx="140" cy="185" rx="34" ry="62" transform="rotate(18 140 185)" fill="' + palet.dark + '"/></g>' +
            '<g class="pet-ear-right"><ellipse cx="372" cy="185" rx="34" ry="62" transform="rotate(-18 372 185)" fill="' + palet.dark + '"/></g>';
    } else if (petId === "ikan") {
        earsLayer =
            '<path d="M210,110 Q256,52 302,110 Z" fill="#f97316" stroke="#c2410c" stroke-width="5" stroke-linejoin="round"/>' +
            '<g class="pet-ear-left"><ellipse cx="135" cy="205" rx="28" ry="16" transform="rotate(-25 135 205)" fill="#f97316" stroke="#c2410c" stroke-width="5"/></g>' +
            '<g class="pet-ear-right"><ellipse cx="377" cy="205" rx="28" ry="16" transform="rotate(25 377 205)" fill="#f97316" stroke="#c2410c" stroke-width="5"/></g>';
    } else if (petId === "buaya") {
        earsLayer =
            '<circle cx="195" cy="112" r="22" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5"/>' +
            '<circle cx="317" cy="112" r="22" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5"/>' +
            '<polygon points="232,102 246,74 256,102" fill="#047857"/><polygon points="256,102 268,74 280,102" fill="#047857"/>';
    } else if (petId === "monyet") {
        earsLayer =
            '<g class="pet-ear-left"><circle cx="128" cy="195" r="36" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><circle cx="128" cy="195" r="22" fill="#fde68a"/></g>' +
            '<g class="pet-ear-right"><circle cx="384" cy="195" r="36" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><circle cx="384" cy="195" r="22" fill="#fde68a"/></g>';
    } else if (petId === "beruang") {
        earsLayer =
            '<g class="pet-ear-left"><circle cx="155" cy="115" r="38" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><circle cx="155" cy="115" r="20" fill="' + palet.belly + '"/></g>' +
            '<g class="pet-ear-right"><circle cx="357" cy="115" r="38" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><circle cx="357" cy="115" r="20" fill="' + palet.belly + '"/></g>';
    } else if (petId === "gajah") {
        earsLayer =
            '<g class="pet-ear-left"><ellipse cx="112" cy="195" rx="58" ry="74" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><ellipse cx="116" cy="198" rx="38" ry="50" fill="#fbcfe8"/></g>' +
            '<g class="pet-ear-right"><ellipse cx="400" cy="195" rx="58" ry="74" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><ellipse cx="396" cy="198" rx="38" ry="50" fill="#fbcfe8"/></g>';
    } else if (petId === "") {
        earsLayer =
            '<g class="pet-ear-left"><path d="M175,125 Q135,55 190,75 Q205,95 205,120 Z" fill="#facc15" stroke="#b45309" stroke-width="5"/></g>' +
            '<g class="pet-ear-right"><path d="M337,125 Q377,55 322,75 Q307,95 307,120 Z" fill="#facc15" stroke="#b45309" stroke-width="5"/></g>';
    } else if (petId === "kadal") {
        earsLayer = '<path d="M235,98 L256,68 L277,98 Z" fill="#16a34a"/>';
    }

    // C. TUBUH & PERUT 2.5D CHIBI
    let bodyLayer =
        '<ellipse cx="256" cy="355" rx="95" ry="88" fill="url(#gradBody_' + petId + ')" stroke="' + palet.dark + '" stroke-width="6"/>' +
        '<ellipse cx="256" cy="362" rx="62" ry="62" fill="' + palet.belly + '"/>';

    if (petId === "" || petId === "kadal" || petId === "buaya") {
        bodyLayer +=
            '<line x1="205" y1="340" x2="307" y2="340" stroke="' + palet.accent + '" stroke-width="3" opacity="0.45"/>' +
            '<line x1="200" y1="365" x2="312" y2="365" stroke="' + palet.accent + '" stroke-width="3" opacity="0.45"/>' +
            '<line x1="210" y1="390" x2="302" y2="390" stroke="' + palet.accent + '" stroke-width="3" opacity="0.45"/>';
    } else if (petId === "ikan") {
        bodyLayer +=
            '<path d="M210,335 Q230,350 210,365" fill="none" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>' +
            '<path d="M302,335 Q282,350 302,365" fill="none" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>';
    }

    // D. LAYER PAKAIAN (10 BODY ITEMS) & KOSTUM LENGKAP (7 COSTUME ITEMS)
    let clothesLayer = "";
    let activeBodyId = eq.costume || eq.body || "";

    if (activeBodyId === "body_tshirt") {
        clothesLayer = '<path d="M163,315 Q256,335 349,315 L342,395 Q256,410 170,395 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="4"/><circle cx="256" cy="358" r="14" fill="#fef08a"/>';
    } else if (activeBodyId === "body_hoodie") {
        clothesLayer = '<path d="M160,305 Q256,325 352,305 L346,405 Q256,420 166,405 Z" fill="#f97316" stroke="#c2410c" stroke-width="4"/><path d="M215,365 L297,365 L288,402 L224,402 Z" fill="#ea580c"/><line x1="240" y1="315" x2="240" y2="350" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/><line x1="272" y1="315" x2="272" y2="350" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>';
    } else if (activeBodyId === "body_labcoat") {
        clothesLayer = '<path d="M160,305 Q256,325 352,305 L348,412 L272,412 L272,320 L240,320 L240,412 L164,412 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/><polygon points="240,315 215,355 240,365" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/><polygon points="272,315 297,355 272,365" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/><rect x="285" y="355" width="26" height="28" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><line x1="293" y1="348" x2="293" y2="360" stroke="#ef4444" stroke-width="4"/>';
    } else if (activeBodyId === "body_explorer") {
        clothesLayer = '<path d="M162,310 Q256,330 350,310 L345,405 Q256,418 167,405 Z" fill="#d97706" stroke="#78350f" stroke-width="4"/><rect x="190" y="350" width="34" height="32" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2"/><rect x="288" y="350" width="34" height="32" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2"/>';
    } else if (activeBodyId === "body_winter") {
        clothesLayer = '<path d="M158,305 Q256,325 354,305 L348,410 Q256,422 164,410 Z" fill="#0284c7" stroke="#0369a1" stroke-width="4"/><rect x="155" y="292" width="202" height="24" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>';
    } else if (activeBodyId === "body_grad") {
        clothesLayer = '<path d="M158,305 Q256,325 354,305 L350,415 L162,415 Z" fill="#1e293b" stroke="#0f172a" stroke-width="4"/><path d="M210,310 L256,365 L302,310" fill="none" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>';
    } else if (activeBodyId === "body_festival") {
        clothesLayer = '<path d="M160,308 Q256,328 352,308 L346,410 Q256,422 166,410 Z" fill="#e11d48" stroke="#9f1239" stroke-width="4"/><path d="M166,375 L346,375" stroke="#facc15" stroke-width="10"/>';
    } else if (activeBodyId === "body_batik") {
        clothesLayer = '<path d="M160,306 Q256,326 352,306 L346,410 Q256,422 166,410 Z" fill="#78350f" stroke="#451a03" stroke-width="4"/><circle cx="210" cy="350" r="10" fill="none" stroke="#facc15" stroke-width="3"/><circle cx="256" cy="365" r="10" fill="none" stroke="#facc15" stroke-width="3"/><circle cx="302" cy="350" r="10" fill="none" stroke="#facc15" stroke-width="3"/><line x1="256" y1="320" x2="256" y2="414" stroke="#facc15" stroke-width="4"/>';
    } else if (activeBodyId === "body_koki") {
        clothesLayer = '<path d="M160,306 Q256,326 352,306 L346,410 Q256,422 166,410 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/><path d="M195,308 L256,335 L317,308" fill="none" stroke="#ef4444" stroke-width="7" stroke-linecap="round"/><circle cx="242" cy="355" r="5" fill="#1e293b"/><circle cx="270" cy="355" r="5" fill="#1e293b"/><circle cx="242" cy="380" r="5" fill="#1e293b"/><circle cx="270" cy="380" r="5" fill="#1e293b"/>';
    } else if (activeBodyId === "body_detektif") {
        clothesLayer = '<path d="M158,305 Q256,325 354,305 L348,412 Q256,424 164,412 Z" fill="#a16207" stroke="#713f12" stroke-width="4"/><polygon points="180,308 256,352 332,308" fill="#ca8a04" stroke="#713f12" stroke-width="3"/><line x1="256" y1="350" x2="256" y2="415" stroke="#451a03" stroke-width="4"/>';
    } else if (activeBodyId === "cost_hero") {
        clothesLayer = '<path d="M160,305 Q256,325 352,305 L345,408 Q256,422 167,408 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="4"/><path d="M166,388 L346,388" stroke="#facc15" stroke-width="12"/><polygon points="256,330 264,348 284,348 268,360 274,378 256,366 238,378 244,360 228,348 248,348" fill="#facc15" stroke="#b45309" stroke-width="2"/>';
    } else if (activeBodyId === "cost_astro") {
        clothesLayer = '<path d="M156,302 Q256,322 356,302 L350,412 Q256,426 162,412 Z" fill="#f8fafc" stroke="#64748b" stroke-width="5"/><rect x="218" y="335" width="76" height="46" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="3"/><circle cx="238" cy="358" r="8" fill="#ef4444"/><circle cx="262" cy="358" r="8" fill="#22c55e"/><circle cx="282" cy="358" r="6" fill="#3b82f6"/>';
    } else if (activeBodyId === "cost_knight") {
        clothesLayer = '<path d="M156,302 Q256,325 356,302 L348,412 Q256,426 164,412 Z" fill="#94a3b8" stroke="#334155" stroke-width="5"/><ellipse cx="162" cy="318" rx="26" ry="18" fill="#cbd5e1" stroke="#334155" stroke-width="4"/><ellipse cx="350" cy="318" rx="26" ry="18" fill="#cbd5e1" stroke="#334155" stroke-width="4"/><polygon points="256,328 278,360 256,392 234,360" fill="#facc15" stroke="#b45309" stroke-width="3"/>';
    } else if (activeBodyId === "cost_dino") {
        clothesLayer = '<path d="M158,302 Q256,322 354,302 L348,412 Q256,426 164,412 Z" fill="#22c55e" stroke="#15803d" stroke-width="5"/><ellipse cx="256" cy="365" rx="52" ry="44" fill="#fef08a"/>';
    } else if (activeBodyId === "cost_royal") {
        clothesLayer = '<path d="M158,302 Q256,325 354,302 L348,414 Q256,426 164,414 Z" fill="#b91c1c" stroke="#facc15" stroke-width="5"/><rect x="156" y="294" width="200" height="20" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/><circle cx="256" cy="352" r="14" fill="#38bdf8" stroke="#facc15" stroke-width="4"/>';
    } else if (activeBodyId === "cost_penyihir") {
        clothesLayer = '<path d="M158,302 Q256,325 354,302 L348,414 Q256,426 164,414 Z" fill="#4c1d95" stroke="#c084fc" stroke-width="5"/><polygon points="256,335 262,352 280,352 266,362 271,378 256,368 241,378 246,362 232,352 250,352" fill="#fde047"/>';
    } else if (activeBodyId === "cost_pirate") {
        clothesLayer = '<path d="M158,302 Q256,325 354,302 L348,414 Q256,426 164,414 Z" fill="#991b1b" stroke="#0f172a" stroke-width="5"/><path d="M165,382 L347,382" stroke="#b45309" stroke-width="14"/><rect x="242" y="372" width="28" height="20" fill="none" stroke="#facc15" stroke-width="4"/>';
    }

    // E. TANGAN, SIRIP, KAKI, & AKSESORI LEHER/TUBUH (8 NECK ITEMS)
    let warnaSepatu = (eq.neck === "neck_sepatu") ? "#ef4444" : palet.main;
    let strokeSepatu = (eq.neck === "neck_sepatu") ? "#991b1b" : palet.dark;
    let limbsLayer =
        '<ellipse cx="162" cy="340" rx="24" ry="18" transform="rotate(-20 162 340)" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5"/>' +
        '<ellipse cx="350" cy="340" rx="24" ry="18" transform="rotate(20 350 340)" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5"/>' +
        '<ellipse cx="205" cy="432" rx="30" ry="18" fill="' + warnaSepatu + '" stroke="' + strokeSepatu + '" stroke-width="5"/>' +
        '<ellipse cx="307" cy="432" rx="30" ry="18" fill="' + warnaSepatu + '" stroke="' + strokeSepatu + '" stroke-width="5"/>';

    let neckLayer = "";
    if (eq.neck === "neck_dasi") {
        neckLayer = '<polygon points="256,302 222,286 222,318" fill="#e11d48" stroke="#881337" stroke-width="3"/><polygon points="256,302 290,286 290,318" fill="#e11d48" stroke="#881337" stroke-width="3"/><circle cx="256" cy="302" r="9" fill="#fb7185" stroke="#881337" stroke-width="3"/>';
    } else if (eq.neck === "neck_syal") {
        neckLayer = '<path d="M168,292 Q256,320 344,292 Q350,316 336,322 Q256,342 176,322 Q162,316 168,292 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="4"/><path d="M286,315 L302,382 L328,376 L314,310 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="4"/>';
    } else if (eq.neck === "neck_kalung") {
        neckLayer = '<path d="M188,295 Q256,338 324,295" fill="none" stroke="#eab308" stroke-width="5"/><polygon points="256,315 262,329 278,329 265,338 270,352 256,343 242,352 247,338 234,329 250,329" fill="#facc15" stroke="#a16207" stroke-width="2"/>';
    } else if (eq.neck === "neck_ransel") {
        neckLayer = '<path d="M188,302 L182,382 M324,302 L330,382" stroke="#9f1239" stroke-width="10" stroke-linecap="round"/>';
    }

    // F. KEPALA & WAJAH 2.5D
    let headLayer = '<g class="pet-head-group">' + earsLayer;

    if (eq.costume === "cost_dino") {
        headLayer += '<ellipse cx="256" cy="195" rx="122" ry="108" fill="#22c55e" stroke="#15803d" stroke-width="6"/><polygon points="256,65 240,92 272,92" fill="#facc15"/>';
    }

    headLayer += '<ellipse cx="256" cy="198" rx="112" ry="96" fill="url(#gradHead_' + petId + ')" stroke="' + palet.dark + '" stroke-width="6"/>';

    if (petId === "monyet") {
        headLayer += '<ellipse cx="256" cy="212" rx="86" ry="68" fill="#fef3c7"/>';
    } else if (petId === "beruang" || petId === "anjing") {
        headLayer += '<ellipse cx="256" cy="222" rx="42" ry="30" fill="' + palet.belly + '"/>';
    } else if (petId === "buaya") {
        headLayer += '<ellipse cx="256" cy="226" rx="68" ry="34" fill="#34d399" stroke="#047857" stroke-width="4"/><polygon points="215,244 222,256 229,244" fill="#ffffff"/><polygon points="283,244 290,256 297,244" fill="#ffffff"/>';
    }

    // Headphone di Kepala/Telinga jika dipakai
    if (eq.neck === "neck_hp") {
        headLayer += '<path d="M140,195 C140,80 372,80 372,195" fill="none" stroke="#1e293b" stroke-width="12" stroke-linecap="round"/><rect x="122" y="168" width="28" height="56" rx="12" fill="#ec4899" stroke="#831843" stroke-width="4"/><rect x="362" y="168" width="28" height="56" rx="12" fill="#ec4899" stroke="#831843" stroke-width="4"/>';
    }

    headLayer +=
        '<ellipse cx="178" cy="218" rx="18" ry="10" fill="' + palet.cheek + '" opacity="0.55"/>' +
        '<ellipse cx="334" cy="218" rx="18" ry="10" fill="' + palet.cheek + '" opacity="0.55"/>';

    // G. EKSPRESI MATA & MULUT SESUAI STATE ANIMASI
    let eyesMouthLayer = "";
    if (state === "happy") {
        eyesMouthLayer =
            '<path d="M188,190 Q205,168 222,190" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M290,190 Q307,168 324,190" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M232,222 Q256,252 280,222 Z" fill="#ef4444" stroke="#0f172a" stroke-width="5"/>';
    } else if (state === "eating") {
        eyesMouthLayer =
            '<circle cx="205" cy="188" r="16" fill="#0f172a"/><circle cx="200" cy="182" r="6" fill="#ffffff"/>' +
            '<circle cx="307" cy="188" r="16" fill="#0f172a"/><circle cx="302" cy="182" r="6" fill="#ffffff"/>' +
            '<ellipse class="pet-mouth-chew" cx="256" cy="232" rx="20" ry="16" fill="#ef4444" stroke="#0f172a" stroke-width="5"/>';
    } else if (state === "sleepy") {
        eyesMouthLayer =
            '<path d="M188,192 Q205,204 222,192" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>' +
            '<path d="M290,192 Q307,204 324,192" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>' +
            '<circle cx="256" cy="232" r="9" fill="#fda4af" stroke="#0f172a" stroke-width="4"/>';
    } else if (state === "hungry" || state === "critical") {
        eyesMouthLayer =
            '<circle cx="205" cy="192" r="15" fill="#0f172a"/><circle cx="200" cy="187" r="5" fill="#ffffff"/>' +
            '<circle cx="307" cy="192" r="15" fill="#0f172a"/><circle cx="302" cy="187" r="5" fill="#ffffff"/>' +
            '<line x1="185" y1="170" x2="222" y2="178" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>' +
            '<line x1="327" y1="170" x2="290" y2="178" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>' +
            '<path d="M236,238 Q256,222 276,238" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>';
    } else {
        eyesMouthLayer =
            '<g class="pet-eyes-blink">' +
                '<circle cx="205" cy="188" r="17" fill="#0f172a"/><circle cx="199" cy="181" r="6.5" fill="#ffffff"/><circle cx="211" cy="194" r="3" fill="#ffffff"/>' +
                '<circle cx="307" cy="188" r="17" fill="#0f172a"/><circle cx="301" cy="181" r="6.5" fill="#ffffff"/><circle cx="313" cy="194" r="3" fill="#ffffff"/>' +
            '</g>' +
            (petId === "ikan"
                ? '<circle cx="256" cy="226" r="10" fill="#fb7185" stroke="#0f172a" stroke-width="4"/>'
                : '<path d="M238,224 Q256,238 274,224" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>');
    }

    let noseLayer = '<ellipse cx="256" cy="208" rx="9" ry="6" fill="#0f172a"/>';
    if (petId === "gajah") {
        noseLayer = '<path d="M242,202 Q256,202 270,202 Q272,262 296,258 Q308,255 302,242" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linecap="round"/>';
    } else if (petId === "kucing") {
        noseLayer =
            '<polygon points="247,205 265,205 256,215" fill="#f43f5e"/>' +
            '<line x1="145" y1="208" x2="180" y2="212" stroke="#334155" stroke-width="3" stroke-linecap="round"/>' +
            '<line x1="145" y1="222" x2="180" y2="220" stroke="#334155" stroke-width="3" stroke-linecap="round"/>' +
            '<line x1="367" y1="208" x2="332" y2="212" stroke="#334155" stroke-width="3" stroke-linecap="round"/>' +
            '<line x1="367" y1="222" x2="332" y2="220" stroke="#334155" stroke-width="3" stroke-linecap="round"/>';
    } else if (petId === "buaya") {
        noseLayer = '<circle cx="238" cy="212" r="5" fill="#064e3b"/><circle cx="274" cy="212" r="5" fill="#064e3b"/>';
    } else if (petId === "ikan") {
        noseLayer = '';
    }

    headLayer += eyesMouthLayer + noseLayer;

    // H. LAYER KACAMATA & WAJAH (5 EYES ITEMS)
    if (eq.eyes === "eyes_round") {
        headLayer += '<circle cx="205" cy="188" r="26" fill="rgba(56,189,248,0.18)" stroke="#0f172a" stroke-width="5"/><circle cx="307" cy="188" r="26" fill="rgba(56,189,248,0.18)" stroke="#0f172a" stroke-width="5"/><line x1="231" y1="188" x2="281" y2="188" stroke="#0f172a" stroke-width="5"/>';
    } else if (eq.eyes === "eyes_star") {
        headLayer += '<polygon points="205,156 213,174 233,176 218,190 222,210 205,199 188,210 192,190 177,176 197,174" fill="rgba(250,204,21,0.45)" stroke="#ca8a04" stroke-width="4"/><polygon points="307,156 315,174 335,176 320,190 324,210 307,199 290,210 294,190 279,176 299,174" fill="rgba(250,204,21,0.45)" stroke="#ca8a04" stroke-width="4"/><line x1="230" y1="185" x2="282" y2="185" stroke="#ca8a04" stroke-width="4"/>';
    } else if (eq.eyes === "eyes_goggles") {
        headLayer += '<rect x="165" y="164" width="182" height="44" rx="18" fill="#78350f" stroke="#451a03" stroke-width="4"/><circle cx="205" cy="186" r="22" fill="#38bdf8" stroke="#facc15" stroke-width="5" opacity="0.8"/><circle cx="307" cy="186" r="22" fill="#38bdf8" stroke="#facc15" stroke-width="5" opacity="0.8"/>';
    } else if (eq.eyes === "eyes_monocle") {
        headLayer += '<circle cx="307" cy="188" r="27" fill="rgba(254,240,138,0.28)" stroke="#eab308" stroke-width="6"/><path d="M332,202 Q345,245 330,275" fill="none" stroke="#eab308" stroke-width="3" stroke-dasharray="4,4"/>';
    } else if (eq.eyes === "eyes_halo") {
        headLayer += '<ellipse cx="256" cy="64" rx="58" ry="14" fill="none" stroke="#fde047" stroke-width="9"/><ellipse cx="256" cy="64" rx="58" ry="14" fill="none" stroke="#ffffff" stroke-width="3"/>';
    }

    // I. LAYER TOPI / AKSESORI KEPALA (8 HEAD ITEMS + HELM KOSTUM)
    let activeHeadId = eq.head || "";
    if (eq.costume === "cost_astro") {
        headLayer += '<circle cx="256" cy="192" r="134" fill="rgba(186,230,253,0.22)" stroke="#cbd5e1" stroke-width="10"/><path d="M165,125 Q210,90 275,105" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.75"/>';
    } else if (eq.costume === "cost_penyihir" && !activeHeadId) {
        activeHeadId = "head_wizard";
    } else if (eq.costume === "cost_pirate" && !activeHeadId) {
        activeHeadId = "head_bajak";
    }

    if (activeHeadId === "head_bandana") {
        headLayer += '<path d="M150,148 Q256,172 362,148 L355,122 Q256,144 157,122 Z" fill="#ef4444" stroke="#991b1b" stroke-width="4"/><circle cx="256" cy="145" r="6" fill="#ffffff"/>';
    } else if (activeHeadId === "head_casual") {
        headLayer += '<path d="M172,125 C172,68 340,68 340,125 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="5"/><path d="M165,122 Q256,134 388,125 Q365,142 165,130 Z" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="4"/>';
    } else if (activeHeadId === "head_pesta") {
        headLayer += '<polygon points="212,115 256,28 300,115" fill="#ec4899" stroke="#9d174d" stroke-width="5" stroke-linejoin="round"/><circle cx="256" cy="24" r="12" fill="#fde047"/><circle cx="246" cy="75" r="6" fill="#38bdf8"/><circle cx="268" cy="92" r="6" fill="#fde047"/>';
    } else if (activeHeadId === "head_flower") {
        headLayer += '<circle cx="190" cy="112" r="14" fill="#f472b6"/><circle cx="190" cy="112" r="5" fill="#facc15"/><circle cx="222" cy="104" r="15" fill="#fb7185"/><circle cx="222" cy="104" r="5" fill="#ffffff"/><circle cx="256" cy="100" r="16" fill="#facc15"/><circle cx="256" cy="100" r="6" fill="#ea580c"/><circle cx="290" cy="104" r="15" fill="#a855f7"/><circle cx="290" cy="104" r="5" fill="#fef08a"/><circle cx="322" cy="112" r="14" fill="#4ade80"/><circle cx="322" cy="112" r="5" fill="#ffffff"/>';
    } else if (activeHeadId === "head_wizard") {
        headLayer += '<ellipse cx="256" cy="118" rx="98" ry="20" fill="#4c1d95" stroke="#2e1065" stroke-width="5"/><polygon points="188,116 256,14 324,116" fill="#6d28d9" stroke="#2e1065" stroke-width="5" stroke-linejoin="round"/><path d="M196,105 Q256,118 316,105" fill="none" stroke="#facc15" stroke-width="8"/>';
    } else if (activeHeadId === "head_wisuda") {
        headLayer += '<polygon points="256,52 360,82 256,112 152,82" fill="#1e293b" stroke="#0f172a" stroke-width="4"/><rect x="206" y="96" width="100" height="22" rx="4" fill="#334155"/><path d="M315,92 L332,140" stroke="#facc15" stroke-width="6" stroke-linecap="round"/><circle cx="332" cy="142" r="7" fill="#eab308"/>';
    } else if (activeHeadId === "head_crown") {
        headLayer += '<polygon points="190,115 182,58 220,88 256,46 292,88 330,58 322,115" fill="#facc15" stroke="#b45309" stroke-width="5" stroke-linejoin="round"/><circle cx="256" cy="88" r="8" fill="#ef4444"/><circle cx="212" cy="96" r="6" fill="#38bdf8"/><circle cx="300" cy="96" r="6" fill="#22c55e"/>';
    } else if (activeHeadId === "head_bajak") {
        headLayer += '<path d="M150,122 Q256,48 362,122 L338,132 Q256,118 174,132 Z" fill="#1e293b" stroke="#facc15" stroke-width="5"/><circle cx="256" cy="96" r="12" fill="#ffffff"/><path d="M238,112 L274,82 M238,82 L274,112" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>';
    }

    headLayer += '</g>';

    // J. IKON EFEK STATUS DI ATAS PET
    let statusBubble = "";
    if (state === "hungry") {
        statusBubble = '<g class="pet-status-float"><circle cx="405" cy="105" r="36" fill="#ffffff" stroke="#f59e0b" stroke-width="4"/><text x="405" y="118" font-size="36" text-anchor="middle">🍖</text></g>';
    } else if (state === "critical") {
        statusBubble = '<g class="pet-status-float"><circle cx="405" cy="105" r="38" fill="#fee2e2" stroke="#dc2626" stroke-width="5"/><text x="405" y="118" font-size="36" text-anchor="middle">🆘</text></g>';
    } else if (state === "happy") {
        statusBubble = '<g class="pet-status-float"><text x="400" y="105" font-size="42" text-anchor="middle">💖</text></g>';
    } else if (state === "sleepy") {
        statusBubble = '<g class="pet-status-float"><text x="400" y="105" font-size="34" font-weight="900" fill="#6366f1" text-anchor="middle">Zzz</text></g>';
    } else if (state === "eating") {
        statusBubble = '<g class="pet-status-float"><text x="400" y="115" font-size="38" text-anchor="middle">😋</text></g>';
    }

    return (
        '<div class="mypet-25d-actor pet-state-' + state + '" data-pet-id="' + petId + '" style="width:' + size + 'px; height:' + size + 'px;">' +
            '<svg viewBox="0 0 512 512" width="100%" height="100%" style="overflow:visible;">' +
                '<defs>' +
                    '<radialGradient id="gradHead_' + petId + '" cx="38%" cy="32%" r="68%">' +
                        '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>' +
                        '<stop offset="35%" stop-color="' + palet.main + '" stop-opacity="1"/>' +
                        '<stop offset="100%" stop-color="' + palet.dark + '" stop-opacity="1"/>' +
                    '</radialGradient>' +
                    '<radialGradient id="gradBody_' + petId + '" cx="40%" cy="35%" r="70%">' +
                        '<stop offset="0%" stop-color="' + palet.main + '"/>' +
                        '<stop offset="100%" stop-color="' + palet.dark + '"/>' +
                    '</radialGradient>' +
                '</defs>' +
                '<ellipse class="pet-ground-shadow" cx="256" cy="455" rx="' + Math.round(92 * spScale) + '" ry="20" fill="' + (catPet.zona === "water" ? "rgba(2,132,199,0.28)" : "rgba(15,23,42,0.22)") + '"/>' +
                '<g transform="translate(0, ' + translateY + ') scale(' + spScale + ')" style="transform-origin: 256px 256px;">' +
                    '<g class="pet-whole-body">' +
                        backLayer +
                        bodyLayer +
                        clothesLayer +
                        limbsLayer +
                        neckLayer +
                        headLayer +
                    '</g>' +
                '</g>' +
                statusBubble +
            '</svg>' +
        '</div>'
    );
};

// 2. PENGONTROL ANIMASI SEMENTARA (MISAL SAAT DIKLIK, DIELUS, ATAU DIBERI MAKAN)
window.triggerAnimasiPetSementara = function(selectorWadah, stateBaru, durasiMs) {
    let container = document.querySelector(selectorWadah);
    if (!container) return;
    let actor = container.querySelector('.mypet-25d-actor');
    if (!actor) return;

    actor.classList.remove('pet-state-idle', 'pet-state-happy', 'pet-state-eating', 'pet-state-sleepy', 'pet-state-hungry', 'pet-state-critical');
    actor.classList.add('pet-state-' + stateBaru);

    clearTimeout(actor._animResetTimer);
    actor._animResetTimer = setTimeout(function() {
        if (typeof window.renderTabHabitatMyPet === "function" && window.isMyPetModalOpen && window.activeMyPetTab === "habitat") {
            window.renderTabHabitatMyPet();
        }
    }, durasiMs || 1800);
};

// 3. AUTO-PAUSE ANIMASI SAAT TAB BROWSER TIDAK AKTIF ATAU MODAL TERTUTUP
document.addEventListener("visibilitychange", function() {
    let modal = document.getElementById("modal-my-pet");
    if (!modal) return;
    if (document.hidden || !window.isMyPetModalOpen) {
        modal.classList.add("mypet-anim-paused");
    } else {
        modal.classList.remove("mypet-anim-paused");
    }
});

/* =========================================================================
   MODUL MY PET ENGINE — TAHAP 3:
   - Panggung Habitat Visual Level 1 s/d Level 6 & Penempatan Dekorasi
   - Panel Detail Pet Aktif (Kenyang 0-100, Mood 0-100, Bond Level)
   - Aksi Interaksi: Klik Pet, Elus (Cooldown), Beri Makan (+Animasi Favorit),
     Ajak Bermain (Cooldown), Ganti Nama, & Pilih Pet Aktif
   - Tab Pet Collection (Thumbnail 64-80px, Status, & Ganti Pet Utama)
   ========================================================================= */

window.bukaLaciMakanHabitat = false;

// 1. RENDER TAB HABITAT (PANGGUNG HABITAT + KARTU INTERAKSI PET AKTIF)
window.bukaLaciMakanHabitat = false;
window.bukaLaciMainanHabitat = false;
window.modeKunjunganPet = null; // Menyimpan username tuan rumah jika sedang berkunjung

// GENERATOR ILUSTRASI VEKTOR SVG 2.5D UNTUK DEKORASI TAMAN (BUKAN EMOJI MENTAH)
window.bangunSVGDeKorasiHabitat = function(decId) {
    let svgMap = {
        dec_tree: '<svg viewBox="0 0 120 140" width="84" height="96"><ellipse cx="60" cy="130" rx="34" ry="8" fill="rgba(0,0,0,0.16)"/><rect x="50" y="75" width="20" height="55" rx="6" fill="#78350f"/><circle cx="60" cy="52" r="36" fill="#4d7c0f"/><circle cx="38" cy="64" r="24" fill="#65a30d"/><circle cx="82" cy="64" r="24" fill="#3f6212"/><circle cx="60" cy="36" r="26" fill="#84cc16"/></svg>',
        dec_castle: '<svg viewBox="0 0 130 130" width="90" height="90"><ellipse cx="65" cy="120" rx="46" ry="9" fill="rgba(0,0,0,0.16)"/><rect x="28" y="52" width="74" height="66" rx="4" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/><rect x="18" y="38" width="24" height="80" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/><rect x="88" y="38" width="24" height="80" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/><polygon points="14,38 30,14 46,38" fill="#e11d48"/><polygon points="84,38 100,14 116,38" fill="#e11d48"/><polygon points="45,52 65,24 85,52" fill="#2563eb"/><path d="M52,118 L52,90 A13,13 0 0,1 78,90 L78,118 Z" fill="#78350f"/></svg>',
        dec_woodhouse: '<svg viewBox="0 0 120 110" width="82" height="76"><ellipse cx="60" cy="100" rx="44" ry="9" fill="rgba(0,0,0,0.18)"/><rect x="26" y="48" width="68" height="50" rx="4" fill="#d97706" stroke="#78350f" stroke-width="3"/><polygon points="16,52 60,18 104,52" fill="#9a3412" stroke="#451a03" stroke-width="3"/><path d="M48,98 L48,68 A12,12 0 0,1 72,68 L72,98 Z" fill="#451a03"/></svg>',
        dec_bed: '<svg viewBox="0 0 110 80" width="76" height="56"><ellipse cx="55" cy="68" rx="46" ry="9" fill="rgba(0,0,0,0.16)"/><ellipse cx="55" cy="56" rx="44" ry="18" fill="#fb7185" stroke="#be123c" stroke-width="3"/><ellipse cx="55" cy="54" rx="32" ry="11" fill="#ffe4e6"/></svg>',
        dec_pillow: '<svg viewBox="0 0 100 70" width="68" height="48"><ellipse cx="50" cy="58" rx="38" ry="8" fill="rgba(0,0,0,0.15)"/><rect x="18" y="32" width="64" height="26" rx="13" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/><circle cx="38" cy="45" r="4" fill="#bae6fd"/><circle cx="62" cy="45" r="4" fill="#bae6fd"/></svg>',
        dec_pond: '<svg viewBox="0 0 130 80" width="92" height="58"><ellipse cx="65" cy="52" rx="56" ry="20" fill="#38bdf8" stroke="#84cc16" stroke-width="6"/><ellipse cx="55" cy="48" rx="36" ry="10" fill="#7dd3fc" opacity="0.65"/><circle cx="88" cy="54" r="9" fill="#22c55e"/><circle cx="88" cy="51" r="4" fill="#f472b6"/></svg>',
        dec_fountain: '<svg viewBox="0 0 120 110" width="82" height="76"><ellipse cx="60" cy="98" rx="46" ry="9" fill="rgba(0,0,0,0.16)"/><ellipse cx="60" cy="86" rx="42" ry="14" fill="#94a3b8" stroke="#475569" stroke-width="3"/><ellipse cx="60" cy="84" rx="36" ry="10" fill="#38bdf8"/><rect x="52" y="48" width="16" height="36" fill="#cbd5e1" stroke="#475569" stroke-width="2"/><ellipse cx="60" cy="50" rx="24" ry="8" fill="#94a3b8" stroke="#475569" stroke-width="2"/><path d="M60,44 Q42,20 36,48 M60,44 Q78,20 84,48" fill="none" stroke="#7dd3fc" stroke-width="3" stroke-linecap="round"/></svg>',
        dec_flower: '<svg viewBox="0 0 110 80" width="76" height="56"><ellipse cx="55" cy="68" rx="40" ry="7" fill="rgba(0,0,0,0.14)"/><path d="M35,66 L35,40 M55,66 L55,34 M75,66 L75,42" stroke="#15803d" stroke-width="4" stroke-linecap="round"/><circle cx="35" cy="36" r="10" fill="#f43f5e"/><circle cx="35" cy="36" r="4" fill="#fde047"/><circle cx="55" cy="30" r="11" fill="#a855f7"/><circle cx="55" cy="30" r="4" fill="#fde047"/><circle cx="75" cy="38" r="10" fill="#f97316"/><circle cx="75" cy="38" r="4" fill="#ffffff"/></svg>',
        dec_crystal: '<svg viewBox="0 0 100 110" width="70" height="78"><ellipse cx="50" cy="98" rx="32" ry="8" fill="rgba(56,189,248,0.25)"/><polygon points="50,16 70,52 62,94 38,94 30,52" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/><polygon points="50,16 62,94 38,94" fill="#bae6fd" opacity="0.55"/><polygon points="24,48 38,66 34,94 18,94" fill="#818cf8" stroke="#4f46e5" stroke-width="2.5"/></svg>',
        dec_painting: '<svg viewBox="0 0 110 90" width="72" height="60"><ellipse cx="55" cy="82" rx="28" ry="5" fill="rgba(0,0,0,0.15)"/><line x1="40" y1="82" x2="55" y2="20" stroke="#78350f" stroke-width="4"/><line x1="70" y1="82" x2="55" y2="20" stroke="#78350f" stroke-width="4"/><rect x="24" y="22" width="62" height="44" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="5"/><path d="M28,58 Q45,42 62,54 Q74,46 82,58 L82,62 L28,62 Z" fill="#4ade80"/><circle cx="42" cy="36" r="6" fill="#facc15"/></svg>'
    };
    return svgMap[decId] || '';
};

// EFEK PARTIKEL VISUAL SAAT INTERAKSI (ELUS, BERMAIN MAINAN, MAKAN)
window.mainkanEfekVisualInteraksiPet = function(ikonUtama, subIkon) {
    let stage = document.getElementById("mypet-habitat-stage");
    let preview = document.getElementById("mypet-detail-preview-box");
    [stage, preview].forEach(function(wadah) {
        if (!wadah) return;
        let oldFx = wadah.querySelector(".mypet-live-fx-overlay");
        if (oldFx) oldFx.remove();

        let fx = document.createElement("div");
        fx.className = "mypet-live-fx-overlay";
        fx.innerHTML =
            '<span class="fx-burst-1">' + (ikonUtama || '💖') + '</span>' +
            '<span class="fx-burst-2">' + (subIkon || '✨') + '</span>' +
            '<span class="fx-burst-3">' + (ikonUtama || '💖') + '</span>';
        wadah.appendChild(fx);
        setTimeout(function() { if (fx.parentNode) fx.remove(); }, 2400);
    });
};

window.renderTabHabitatMyPet = function() {
    let container = document.getElementById("mypet-view-habitat");
    if (!container) return;

    let uName = window.modeKunjunganPet || sessionStorage.getItem("username");
    let isVisitMode = Boolean(window.modeKunjunganPet);
    let lb = isVisitMode ? window.leaderboardSiswaData[uName] : window.pastikanStrukturDualXPDanPet(uName);

    if (!lb || !lb.myPetData) {
        container.innerHTML = '<div style="padding:40px; text-align:center;">Data habitat tidak ditemukan.</div>';
        return;
    }

    window.sinkronkanWaktuLaparSemuaPet(uName);
    let petData = lb.myPetData;
    let ownedIds = Object.keys(petData.ownedPets || {});

    if (ownedIds.length === 0) {
        if (isVisitMode) {
            container.innerHTML =
                '<div style="background:white; border:2px dashed #cbd5e1; border-radius:16px; padding:40px 20px; text-align:center;">' +
                    '<div style="font-size:56px; margin-bottom:10px;">🏡</div>' +
                    '<h3 style="margin:0 0 8px 0; color:#0b3954; font-size:19px;">Habitat ' + (lb.namaLengkap || uName) + ' Masih Kosong</h3>' +
                    '<p style="margin:0 auto 20px auto; max-width:420px; font-size:13px; color:#64748b;">Temanmu belum mengadopsi hewan peliharaan di habitatnya.</p>' +
                    '<button type="button" class="btn-action" style="background:#e74c3c; width:auto; padding:10px 24px; border-radius:25px; font-size:13px; font-weight:800;" onclick="window.akhiriKunjunganPet()">🚪 Kembali ke Habitatku</button>' +
                '</div>';
            return;
        }
        let coinSaldo = Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia || 0);
        container.innerHTML =
            '<div style="background:white; border:2px dashed #cbd5e1; border-radius:16px; padding:40px 20px; text-align:center;">' +
                '<div style="font-size:64px; margin-bottom:10px;">🥚</div>' +
                '<h3 style="margin:0 0 8px 0; color:#0b3954; font-size:20px;">Habitatmu Masih Kosong!</h3>' +
                '<p style="margin:0 auto 20px auto; max-width:460px; font-size:13px; color:#64748b; line-height:1.6;">' +
                    'Kamu memiliki <b>🪙 ' + coinSaldo.toLocaleString("id-ID") + ' Coin</b>. ' +
                    'Yuk adopsi hewan darat atau hewan air pertamamu di <b>Shop</b>! Lembah & Sungai Habitat Universal sudah siap secara gratis.' +
                '</p>' +
                '<button type="button" class="btn-action" style="background:#16a085; width:auto; padding:11px 28px; border-radius:30px; font-size:14px; font-weight:800;" onclick="window.gantiTabMyPet(\'shop\')">🛒 Pergi ke Shop & Adopsi Pet</button>' +
            '</div>';
        return;
    }

    if (!petData.activePetId || !petData.ownedPets[petData.activePetId]) {
        petData.activePetId = ownedIds[0];
    }

    let activeId = petData.activePetId;
    let activePet = petData.ownedPets[activeId];
    let catActive = window.MY_PET_CATALOG.pets.find(function(p) { return p.id === activeId; }) || window.MY_PET_CATALOG.pets[0];

    let hungerVal = Math.max(0, Math.min(100, Math.round(Number(activePet.hunger) || 0)));
    let moodVal = Math.max(0, Math.min(100, Math.round(Number(activePet.mood) || 0)));
    let infoLapar = window.dapatkanInfoStatusLaparPet(hungerVal);
    let infoBond = window.hitungLevelBondPet(activePet.bondXp || 0);

    // KOORDINAT SLOT DEKORASI TETAP (MENYATU DENGAN TANAH & BUKIT, TIDAK MELAYANG DI LANGIT)
    let slotCoords = {
        "Kiri Belakang":    { left: "14%", bottom: "42%", z: 3 },
        "Dinding Belakang": { left: "44%", bottom: "44%", z: 3 },
        "Tengah Belakang":  { left: "62%", bottom: "43%", z: 3 },
        "Kanan Belakang":   { left: "84%", bottom: "40%", z: 3 },
        "Kiri Tanah":       { left: "14%", bottom: "14%", z: 4 },
        "Tengah Tanah":     { left: "54%", bottom: "12%", z: 4 },
        "Kanan Tanah":      { left: "78%", bottom: "16%", z: 4 }
    };

    let decorHtml = '';
    let activeDecs = Array.isArray(petData.activeDecorations) ? petData.activeDecorations : [];
    activeDecs.forEach(function(decId) {
        let decCfg = window.MY_PET_CATALOG.decorations.find(function(d) { return d.id === decId; });
        if (decCfg && slotCoords[decCfg.slot]) {
            let pos = slotCoords[decCfg.slot];
            let svgDec = window.bangunSVGDeKorasiHabitat(decId);
            decorHtml +=
                '<div class="mypet-decor-svg-item" style="position:absolute; left:' + pos.left + '; bottom:' + pos.bottom + '; z-index:' + pos.z + '; transform:translate(-50%, 10%); pointer-events:none;" title="' + decCfg.nama + '">' +
                    (svgDec || '<span style="font-size:40px;">' + decCfg.ikon + '</span>') +
                '</div>';
        }
    });

    // PENEMPATAN PET BERDASARKAN ZONA ALAM (HEWAN AIR DI SUNGAI KIRI-TENGAH, HEWAN DARAT DI BUKIT RUMPUT KANAN-TENGAH)
    let stagePetsHtml = '';
    let waterSlots = [
        { l: 28, b: 16 }, { l: 38, b: 24 }, { l: 22, b: 28 }, { l: 34, b: 11 }
    ];
    let landSlots = [
        { l: 58, b: 14 }, { l: 72, b: 22 }, { l: 48, b: 26 }, { l: 84, b: 18 },
        { l: 65, b: 30 }, { l: 12, b: 20 }, { l: 78, b: 30 }
    ];
    let wIdx = 0, lIdx = 0;

    ownedIds.forEach(function(pid) {
        let pObj = petData.ownedPets[pid];
        let pCat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === pid; }) || window.MY_PET_CATALOG.pets[0];
        let pLapar = window.dapatkanInfoStatusLaparPet(pObj.hunger);
        let isMain = (pid === activeId);

        let isWaterPet = (pCat.zona === "water" || pid === "ikan" || pid === "buaya");
        let slotPos = isWaterPet
            ? waterSlots[(wIdx++) % waterSlots.length]
            : landSlots[(lIdx++) % landSlots.length];

        let ukuranDiHabitat = isMain ? 114 : 86;
        let svgPet = window.bangunVisualPet25DSVG(pid, pObj.outfit || {}, pLapar.animState, ukuranDiHabitat);
        let waterRipple = isWaterPet
            ? '<div class="mypet-water-ripple"></div>'
            : '';

        stagePetsHtml +=
            '<div class="mypet-stage-actor-wrap ' + (isMain ? 'is-active-pet' : 'is-companion-pet') + (isWaterPet ? ' is-aquatic-pet' : '') + '" ' +
                 'style="left:' + slotPos.l + '%; bottom:' + slotPos.b + '%; z-index:' + (isMain ? 12 : 7) + ';" ' +
                 'onclick="window.interaksiKlikPetDiHabitat(\'' + pid + '\')" ' +
                 'title="Klik untuk berinteraksi dengan ' + (pObj.customName || pCat.namaDefault) + '">' +
                svgPet +
                waterRipple +
                '<div class="mypet-stage-nametag">' + (isMain ? '⭐ ' : '') + (pObj.customName || pCat.namaDefault) + '</div>' +
            '</div>';
    });

    // LACI MAKANAN
    let laciMakanHtml = '';
    if (window.bukaLaciMakanHabitat) {
        let myUName = sessionStorage.getItem("username");
        let myLb = window.pastikanStrukturDualXPDanPet(myUName);
        let inv = (myLb && myLb.myPetData) ? myLb.myPetData.foodInventory : {};
        let semuaMakanan = [...window.MY_PET_CATALOG.foods, ...window.MY_PET_CATALOG.snacks];
        let stokAda = semuaMakanan.filter(function(f) { return (Number(inv[f.id]) || 0) > 0; });

        if (stokAda.length === 0) {
            laciMakanHtml =
                '<div class="mypet-feed-drawer">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                        '<strong style="font-size:13px; color:#0b3954;">🍽️ Inventaris Makanan Kosong</strong>' +
                        '<button type="button" onclick="window.toggleLaciMakanHabitat(false)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:#64748b;">✕</button>' +
                    '</div>' +
                    '<div style="text-align:center; padding:12px; color:#64748b; font-size:12px;">' +
                        'Stok makananmu sedang habis! Yuk beli makanan atau camilan favorit dengan Coin di Shop.' +
                        (!isVisitMode ? '<div style="margin-top:8px;"><button type="button" class="btn-action" style="background:#e67e22; width:auto; padding:6px 16px; font-size:11px;" onclick="window.gantiTabMyPet(\'shop\'); window.renderTabShopMyPet(\'foods\');">🛒 Beli Makanan di Shop</button></div>' : '') +
                    '</div>' +
                '</div>';
        } else {
            let itemsHtml = '';
            stokAda.forEach(function(f) {
                let jml = Number(inv[f.id]) || 0;
                let isFav = (f.tipe === "snack" && f.favPet === activeId);
                let badgeFav = isFav ? '<span style="background:#fef08a; color:#b45309; font-size:9px; padding:1px 5px; border-radius:6px; font-weight:800; margin-left:4px;">💖 Favorit!</span>' : '';
                itemsHtml +=
                    '<button type="button" class="mypet-food-item-btn" onclick="window.berikanMakananKePet(\'' + f.id + '\')">' +
                        '<span style="font-size:22px;">' + f.ikon + '</span>' +
                        '<div style="text-align:left; flex:1;">' +
                            '<div style="font-weight:800; font-size:12px; color:#1e293b;">' + f.nama + badgeFav + '</div>' +
                            '<div style="font-size:10px; color:#16a34a; font-weight:700;">+' + f.kenyang + ' Kenyang' + (f.mood ? ', +' + f.mood + ' Mood' : '') + '</div>' +
                        '</div>' +
                        '<span style="background:#0b3954; color:#f1c40f; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:800;">x' + jml + '</span>' +
                    '</button>';
            });
            laciMakanHtml =
                '<div class="mypet-feed-drawer">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                        '<strong style="font-size:13px; color:#0b3954;">🍽️ ' + (isVisitMode ? 'Beri Camilan ke Pet Teman:' : 'Pilih Makanan untuk ' + (activePet.customName || catActive.namaDefault) + ':') + '</strong>' +
                        '<button type="button" onclick="window.toggleLaciMakanHabitat(false)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:#64748b;">✕ Tutup</button>' +
                    '</div>' +
                    '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(190px, 1fr)); gap:8px;">' + itemsHtml + '</div>' +
                '</div>';
        }
    }

    // LACI MAINAN
    let laciMainanHtml = '';
    if (window.bukaLaciMainanHabitat && !isVisitMode) {
        let invToys = Array.isArray(petData.ownedWardrobe) ? petData.ownedWardrobe.filter(function(id) { return id.indexOf("toy_") === 0; }) : [];
        if (Array.isArray(petData.ownedToys)) {
            petData.ownedToys.forEach(function(tid) { if (!invToys.includes(tid)) invToys.push(tid); });
        }
        if (invToys.length === 0) {
            laciMainanHtml =
                '<div class="mypet-feed-drawer">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                        '<strong style="font-size:13px; color:#0b3954;">🎾 Kotak Mainan Kosong</strong>' +
                        '<button type="button" onclick="window.toggleLaciMainanHabitat(false)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:#64748b;">✕</button>' +
                    '</div>' +
                    '<div style="text-align:center; padding:12px; color:#64748b; font-size:12px;">' +
                        'Kamu belum memiliki mainan. Beli mainan permanen di Shop untuk bermain bersama pet!' +
                        '<div style="margin-top:8px;"><button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:auto; padding:6px 16px; font-size:11px;" onclick="window.gantiTabMyPet(\'shop\'); window.renderTabShopMyPet(\'toys\');">🛒 Ke Shop Mainan</button></div>' +
                    '</div>' +
                '</div>';
        } else {
            let itemsHtml = '';
            invToys.forEach(function(toyId) {
                let t = window.MY_PET_CATALOG.toys.find(function(x) { return x.id === toyId; });
                if (t) {
                    itemsHtml +=
                        '<button type="button" class="mypet-food-item-btn" onclick="window.aksiMainDenganToy(\'' + t.id + '\')">' +
                            '<span style="font-size:22px;">' + t.ikon + '</span>' +
                            '<div style="text-align:left; flex:1;">' +
                                '<div style="font-weight:800; font-size:12px; color:#1e293b;">' + t.nama + '</div>' +
                                '<div style="font-size:10px; color:#ec4899; font-weight:700;">+15 Mood, +15 Bond</div>' +
                            '</div>' +
                        '</button>';
                }
            });
            laciMainanHtml =
                '<div class="mypet-feed-drawer">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                        '<strong style="font-size:13px; color:#0b3954;">🎾 Pilih Mainan untuk ' + (activePet.customName || catActive.namaDefault) + ':</strong>' +
                        '<button type="button" onclick="window.toggleLaciMainanHabitat(false)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:#64748b;">✕ Tutup</button>' +
                    '</div>' +
                    '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(170px, 1fr)); gap:8px;">' + itemsHtml + '</div>' +
                '</div>';
        }
    }

    let bannerKritis = '';
    if (infoLapar.isKritis && !isVisitMode) {
        bannerKritis =
            '<div style="background:#fee2e2; border:2px solid #dc2626; color:#991b1b; padding:10px 14px; border-radius:10px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; gap:10px; font-size:12px; font-weight:700;">' +
                '<span>🆘 <b>PERINGATAN KRITIS:</b> ' + (activePet.customName || catActive.namaDefault) + ' kelaparan (0/100)! Beri makan sekarang!</span>' +
                '<button type="button" class="btn-action" style="background:#dc2626; width:auto; padding:6px 12px; font-size:11px; white-space:nowrap;" onclick="window.toggleLaciMakanHabitat(true)">🍖 Pulihkan</button>' +
            '</div>';
    }

    let detailActorSvg = window.bangunVisualPet25DSVG(activeId, activePet.outfit || {}, infoLapar.animState, 155);
    let titleHabitat = isVisitMode
        ? ('🏡 Sedang Berkunjung ke Habitat: <b style="color:#d97706;">' + (lb.namaLengkap || uName) + '</b>')
        : ('🏡 Lembah & Sungai Sanctuary (<b style="color:#16a34a;">' + ownedIds.length + ' Pet Tinggal Bersama</b>)');

    let tombolAksiUser = isVisitMode
        ? '<div class="mypet-action-btns-grid" style="grid-template-columns: 1fr 1fr;">' +
            '<button type="button" class="mypet-act-btn btn-elus" onclick="window.aksiElusPetAktif()">🤚 Sapa & Elus</button>' +
            '<button type="button" class="mypet-act-btn btn-makan" onclick="window.toggleLaciMakanHabitat()">🎁 Give Treat (Beri Makan)</button>' +
          '</div>'
        : '<div class="mypet-action-btns-grid">' +
            '<button type="button" class="mypet-act-btn btn-elus" onclick="window.aksiElusPetAktif()">🤚 Elus</button>' +
            '<button type="button" class="mypet-act-btn btn-makan" onclick="window.toggleLaciMakanHabitat()">🍖 Beri Makan</button>' +
            '<button type="button" class="mypet-act-btn btn-main" onclick="window.toggleLaciMainanHabitat()">🎾 Ajak Main</button>' +
            '<button type="button" class="mypet-act-btn btn-dandan" onclick="window.gantiTabMyPet(\'wardrobe\')">👗 Dandani</button>' +
          '</div>';

    // LUKISAN PEMANDANGAN ALAM 2.5D (GABUNGAN BUKIT CAT AIR GAMBAR 1 & SUNGAI LEMBAH GAMBAR 2)
    let landscapeSvgBg =
        '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;">' +
            '<defs>' +
                '<linearGradient id="skyWarmGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="#f0f9ff"/>' +
                    '<stop offset="55%" stop-color="#fef9c3"/>' +
                    '<stop offset="100%" stop-color="#dcfce7"/>' +
                '</linearGradient>' +
                '<linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="#86efac"/>' +
                    '<stop offset="100%" stop-color="#15803d"/>' +
                '</linearGradient>' +
                '<linearGradient id="hillLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="#bef264"/>' +
                    '<stop offset="100%" stop-color="#65a30d"/>' +
                '</linearGradient>' +
                '<linearGradient id="hillRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="#a3e635"/>' +
                    '<stop offset="100%" stop-color="#4d7c0f"/>' +
                '</linearGradient>' +
                '<linearGradient id="riverWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
                    '<stop offset="0%" stop-color="#bae6fd"/>' +
                    '<stop offset="45%" stop-color="#38bdf8"/>' +
                    '<stop offset="100%" stop-color="#0284c7"/>' +
                '</linearGradient>' +
            '</defs>' +
            '<!-- Langit Hangat & Matahari Bersinar (Ref Gambar 1) -->' +
            '<rect width="1000" height="360" fill="url(#skyWarmGrad)"/>' +
            '<circle cx="480" cy="42" r="46" fill="#fde047" opacity="0.35"/>' +
            '<circle cx="480" cy="42" r="32" fill="#facc15"/>' +
            '<g stroke="#f59e0b" stroke-width="3" stroke-linecap="round" opacity="0.75">' +
                '<line x1="480" y1="82" x2="480" y2="96"/><line x1="450" y1="76" x2="442" y2="90"/><line x1="510" y1="76" x2="518" y2="90"/>' +
                '<line x1="428" y1="58" x2="414" y2="66"/><line x1="532" y1="58" x2="546" y2="66"/>' +
            '</g>' +
            '<!-- Burung Terbang di Kejauhan -->' +
            '<path d="M260,55 Q268,45 276,55 Q284,45 292,55" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/>' +
            '<path d="M295,68 Q302,60 309,68 Q316,60 323,68" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round"/>' +
            '<path d="M680,48 Q687,40 694,48 Q701,40 708,48" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round"/>' +
            '<!-- Gunung Hijau Berlapis di Tengah Belakang (Ref Gambar 2) -->' +
            '<polygon points="290,195 430,28 595,28 710,195" fill="url(#mountainGrad)" opacity="0.65"/>' +
            '<polygon points="360,195 495,48 640,195" fill="#16a34a" opacity="0.45"/>' +
            '<!-- Perbukitan Gelombang Kiri & Kanan (Ref Gambar 1 & 2) -->' +
            '<path d="M0,145 Q220,115 440,185 L440,360 L0,360 Z" fill="url(#hillLeftGrad)"/>' +
            '<path d="M360,185 Q720,105 1000,135 L1000,360 L360,360 Z" fill="url(#hillRightGrad)"/>' +
            '<!-- Padang Rumput Utama Tempat Pet Berpijak -->' +
            '<path d="M0,205 Q480,165 1000,200 L1000,360 L0,360 Z" fill="#86efac"/>' +
            '<path d="M0,235 Q520,195 1000,225 L1000,360 L0,360 Z" fill="#4ade80"/>' +
            '<!-- Tepian Pasir & Aliran Sungai / Telaga Air Jernih (Zona Hewan Air) -->' +
            '<path d="M395,182 Q335,235 160,260 Q95,305 155,360 L465,360 Q485,295 435,245 Q415,210 395,182 Z" fill="#fde68a"/>' +
            '<path d="M402,184 Q345,238 175,264 Q115,308 170,360 L448,360 Q468,295 422,246 Q408,210 402,184 Z" fill="url(#riverWaterGrad)"/>' +
            '<!-- Riak Kilau Air Sungai -->' +
            '<path d="M240,295 Q280,290 320,295 M210,325 Q265,318 315,325 M310,255 Q345,250 380,255" fill="none" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round" opacity="0.75"/>' +
            '<!-- Pohon Rindang Kiri & Kanan Membingkai Habitat (Ref Gambar 1) -->' +
            '<rect x="34" y="105" width="18" height="125" rx="5" fill="#78350f"/>' +
            '<circle cx="45" cy="85" r="48" fill="#4d7c0f"/><circle cx="22" cy="108" r="36" fill="#65a30d"/><circle cx="68" cy="105" r="34" fill="#84cc16"/>' +
            '<rect x="945" y="100" width="18" height="130" rx="5" fill="#78350f"/>' +
            '<circle cx="952" cy="82" r="48" fill="#4d7c0f"/><circle cx="928" cy="105" r="36" fill="#84cc16"/><circle cx="975" cy="108" r="34" fill="#3f6212"/>' +
            '<!-- Semak & Bunga Latar Depan (Foreground) -->' +
            '<path d="M0,360 L0,305 Q35,285 60,320 Q90,295 125,335 Q150,315 175,360 Z" fill="#15803d" opacity="0.85"/>' +
            '<path d="M820,360 Q850,310 885,335 Q915,290 950,320 Q975,285 1000,310 L1000,360 Z" fill="#15803d" opacity="0.85"/>' +
            '<circle cx="75" cy="318" r="6" fill="#f43f5e"/><circle cx="112" cy="332" r="5" fill="#facc15"/>' +
            '<circle cx="875" cy="328" r="6" fill="#fb923c"/><circle cx="925" cy="315" r="6" fill="#f43f5e"/>' +
        '</svg>';

    container.innerHTML =
        bannerKritis +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">' +
            '<div style="background:#ffffff; border:1px solid #cbd5e1; color:#334155; padding:6px 14px; border-radius:20px; font-size:12px;">' + titleHabitat + '</div>' +
            (isVisitMode ? '<button class="btn-action" style="background:#e74c3c; width:auto; padding:6px 14px; font-size:11px;" onclick="window.akhiriKunjunganPet()">🚪 Pulang ke Habitat Sendiri</button>' : '<div style="font-size:11px; color:#64748b; font-weight:600;">💡 Hewan air bermain di sungai & hewan darat di padang rumput!</div>') +
        '</div>' +

        '<!-- PANGGUNG VISUAL HABITAT ALAM 2.5D -->' +
        '<div id="mypet-habitat-stage" class="mypet-habitat-stage mypet-universal-stage">' +
            landscapeSvgBg +
            decorHtml +
            stagePetsHtml +
            (!isVisitMode ? '<div class="mypet-food-bowl" onclick="window.toggleLaciMakanHabitat(true)" title="Wadah Makanan (Klik untuk memberi makan)"><span>' + (hungerVal < 25 ? '🥣' : '🍲') + '</span></div>' : '') +
            '<div id="mypet-interaction-toast" class="mypet-interaction-toast" style="display:none;"></div>' +
        '</div>' +

        laciMakanHtml + laciMainanHtml +

        '<!-- KARTU DETAIL PET -->' +
        '<div class="mypet-detail-card">' +
            '<div id="mypet-detail-preview-box" class="mypet-detail-avatar-box" style="position:relative;" onclick="window.interaksiKlikPetDiHabitat(\'' + activeId + '\')">' +
                detailActorSvg +
                '<span style="font-size:10px; font-weight:800; padding:3px 10px; border-radius:12px; background:' + infoLapar.bg + '; color:' + infoLapar.warna + '; margin-top:4px;">' + infoLapar.status + '</span>' +
            '</div>' +
            '<div class="mypet-detail-info-box">' +
                '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; flex-wrap:wrap;">' +
                    '<div>' +
                        '<div style="display:flex; align-items:center; gap:8px;">' +
                            '<h3 style="margin:0; font-size:22px; color:#0f172a; font-weight:900;">' + (activePet.customName || catActive.namaDefault) + '</h3>' +
                            (!isVisitMode ? '<button type="button" onclick="window.gantiNamaPetAktif()" style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:3px 8px; font-size:11px; font-weight:700; color:#334155; cursor:pointer;" title="Ganti Nama Pet">✏️ Nama</button>' : '') +
                        '</div>' +
                        '<div style="font-size:13px; font-weight:700; color:#64748b; margin-top:2px;">' +
                            '<span style="color:' + catActive.warnaRarity + '; background:' + catActive.bgRarity + '; padding:1px 8px; border-radius:8px; font-size:11px; font-weight:800;">' + catActive.spesies + (catActive.zona === "water" ? " 🌊" : " 🌿") + '</span>' +
                            ' · <span style="color:#d97706; font-weight:800;">❤️ Bond Lv. ' + infoBond.level + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div style="display:flex; flex-direction:column; gap:10px; margin:14px 0;">' +
                    '<div>' +
                        '<div style="display:flex; justify-content:space-between; font-size:12px; font-weight:800; color:#334155; margin-bottom:4px;"><span>🍖 Kenyang</span><span style="color:' + infoLapar.warna + ';">' + hungerVal + '/100</span></div>' +
                        '<div class="mypet-stat-bar-bg"><div class="mypet-stat-bar-fill" style="width:' + hungerVal + '%; background:' + (hungerVal >= 50 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : (hungerVal >= 25 ? '#f59e0b' : '#ef4444')) + ';"></div></div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="display:flex; justify-content:space-between; font-size:12px; font-weight:800; color:#334155; margin-bottom:4px;"><span>😊 Mood</span><span style="color:#ec4899;">' + moodVal + '/100</span></div>' +
                        '<div class="mypet-stat-bar-bg"><div class="mypet-stat-bar-fill" style="width:' + moodVal + '%; background:linear-gradient(90deg, #f472b6, #ec4899);"></div></div>' +
                    '</div>' +
                '</div>' +
                tombolAksiUser +
            '</div>' +
        '</div>';
};

// 2. FUNGSI INTERAKSI PET (KLIK, ELUS + COOLDOWN, MAKAN, BERMAIN, GANTI NAMA)
window.tampilkanToastInteraksiPet = function(pesan) {
    let t = document.getElementById("mypet-interaction-toast");
    if (!t) return;
    t.innerHTML = pesan;
    t.style.display = "block";
    clearTimeout(window._toastPetTimer);
    window._toastPetTimer = setTimeout(function() {
        if (t) t.style.display = "none";
    }, 2600);
};

// Klik / Ketuk Pet di Habitat
window.interaksiKlikPetDiHabitat = function(petId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData || !lb.myPetData.ownedPets[petId]) return;

    // Jika yang diklik adalah pet pendamping, jadikan sebagai pet aktif
    if (lb.myPetData.activePetId !== petId) {
        lb.myPetData.activePetId = petId;
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.renderTabHabitatMyPet();
        return;
    }

    let pet = lb.myPetData.ownedPets[petId];
    let cat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === petId; }) || window.MY_PET_CATALOG.pets[0];
    let nama = pet.customName || cat.namaDefault;

    let statesAcak = ["happy", "sleepy", "happy"];
    let pilihState = statesAcak[Math.floor(Math.random() * statesAcak.length)];
    window.triggerAnimasiPetSementara("#mypet-habitat-stage", pilihState, 1600);
    window.triggerAnimasiPetSementara("#mypet-detail-preview-box", pilihState, 1600);

    let sapaan = pilihState === "sleepy"
        ? "🥱 <b>" + nama + "</b> menguap manja dan menoleh ke arahmu!"
        : "✨ <b>" + nama + "</b> melompat senang saat kamu menyapanya!";
    window.tampilkanToastInteraksiPet(sapaan);
};

// Aksi Elus Pet (Menaikkan Bond +10 & Mood +8 dengan Cooldown 5 Menit anti-spam farming)
window.aksiElusPetAktif = function() {
    let targetUser = window.modeKunjunganPet || sessionStorage.getItem("username");
    let lb = window.leaderboardSiswaData[targetUser];
    if (!lb || !lb.myPetData) return;

    let activeId = lb.myPetData.activePetId;
    let pet = lb.myPetData.ownedPets[activeId];
    if (!pet) return;

    let cat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === activeId; }) || window.MY_PET_CATALOG.pets[0];
    let nama = pet.customName || cat.namaDefault;
    let now = Date.now();
    let cooldownMs = 5 * 60 * 1000;

    window.bukaLaciMainanHabitat = false;
    window.triggerAnimasiPetSementara("#mypet-habitat-stage", mainan.animasi || "happy", 2600);
    window.triggerAnimasiPetSementara("#mypet-detail-preview-box", mainan.animasi || "happy", 2600);
    window.mainkanEfekVisualInteraksiPet(mainan.ikon, "✨");

    if (pet.lastPetTime && (now - pet.lastPetTime) < cooldownMs) {
        let sisaMenit = Math.ceil((cooldownMs - (now - pet.lastPetTime)) / 60000);
        window.tampilkanToastInteraksiPet("💖 <b>" + nama + "</b> merasa nyaman dielus! (Bond dapat naik lagi dalam " + sisaMenit + " menit)");
        return;
    }

    pet.lastPetTime = now;
    pet.mood = Math.min(100, (Number(pet.mood) || 80) + 8);
    pet.bondXp = (Number(pet.bondXp) || 0) + 12;

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(targetUser, lb);
    }

    setTimeout(function() {
        window.renderTabHabitatMyPet();
        window.tampilkanToastInteraksiPet(window.modeKunjunganPet ? ("🥰 Kamu mengelus <b>" + nama + "</b> milik " + targetUser + "!") : ("🥰 <b>" + nama + "</b> sangat senang dielus! (+8 Mood, +12 Bond)"));
    }, 450);
};

window.toggleLaciMainanHabitat = function(forceState) {
    if (typeof forceState === "boolean") window.bukaLaciMainanHabitat = forceState;
    else window.bukaLaciMainanHabitat = !window.bukaLaciMainanHabitat;
    window.bukaLaciMakanHabitat = false;
    window.renderTabHabitatMyPet();
};

window.toggleLaciMakanHabitat = function(forceState) {
    if (typeof forceState === "boolean") window.bukaLaciMakanHabitat = forceState;
    else window.bukaLaciMakanHabitat = !window.bukaLaciMakanHabitat;
    window.bukaLaciMainanHabitat = false;
    window.renderTabHabitatMyPet();
};

window.aksiMainDenganToy = function(toyId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData) return;

    let pet = lb.myPetData.ownedPets[lb.myPetData.activePetId];
    if (!pet) return;

    let mainan = window.MY_PET_CATALOG.toys.find(x => x.id === toyId);
    if (!mainan) return;

    if ((Number(pet.hunger) || 0) < 15) {
        return window.tampilkanToastInteraksiPet("⚠️ Pet terlalu lapar untuk bermain! Beri makan dulu ya.");
    }

    let now = Date.now();
    let cooldownMs = 10 * 60 * 1000;

    window.bukaLaciMainanHabitat = false;
    window.triggerAnimasiPetSementara("#mypet-habitat-stage", mainan.animasi, 2500);
    window.triggerAnimasiPetSementara("#mypet-detail-preview-box", mainan.animasi, 2500);

    if (pet.lastPlayTime && (now - pet.lastPlayTime) < cooldownMs) {
        let sisaMenit = Math.ceil((cooldownMs - (now - pet.lastPlayTime)) / 60000);
        window.tampilkanToastInteraksiPet(mainan.ikon + " " + mainan.deskripsi + " (Bonus XP Main tersedia dalam " + sisaMenit + " menit)");
        return;
    }

    pet.lastPlayTime = now;
    pet.mood = Math.min(100, (Number(pet.mood) || 80) + 15);
    pet.bondXp = (Number(pet.bondXp) || 0) + 15;

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }

    setTimeout(function() {
        window.renderTabHabitatMyPet();
        window.tampilkanToastInteraksiPet(mainan.ikon + " " + mainan.deskripsi + " (+15 Mood, +15 Bond)");
    }, 500);
};

window.berikanMakananKePet = function(foodId) {
    let myUName = sessionStorage.getItem("username");
    let targetUser = window.modeKunjunganPet || myUName;
    
    let myLb = window.pastikanStrukturDualXPDanPet(myUName);
    let targetLb = window.modeKunjunganPet ? window.leaderboardSiswaData[targetUser] : myLb;
    if (!myLb || !targetLb || !targetLb.myPetData) return;

    let stokKu = Number(myLb.myPetData.foodInventory[foodId]) || 0;
    if (stokKu <= 0) return alert("Stok makanan ini milikmu sudah habis!");

    let pet = targetLb.myPetData.ownedPets[targetLb.myPetData.activePetId];
    if (!pet) return;

    let itemFood = [...window.MY_PET_CATALOG.foods, ...window.MY_PET_CATALOG.snacks].find(f => f.id === foodId);
    if (!itemFood) return;

    let nama = pet.customName || window.MY_PET_CATALOG.pets.find(x => x.id === targetLb.myPetData.activePetId).namaDefault;

    // Kurangi inventaris pengunjung (diri sendiri)
    myLb.myPetData.foodInventory[foodId] = stokKu - 1;
    if (myLb.myPetData.foodInventory[foodId] <= 0) delete myLb.myPetData.foodInventory[foodId];
    if (window.modeKunjunganPet && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(myUName, myLb);
    }

    // Tambah status pet tuan rumah
    let isFavSnack = (itemFood.tipe === "snack" && itemFood.favPet === targetLb.myPetData.activePetId);
    let tambahKenyang = Number(itemFood.kenyang) || 0;
    let tambahMood = (Number(itemFood.mood) || 5) + (isFavSnack ? 8 : 0);
    let tambahBond = isFavSnack ? 15 : 6;

    pet.hunger = Math.min(100, (Number(pet.hunger) || 0) + tambahKenyang);
    pet.mood = Math.min(100, (Number(pet.mood) || 0) + tambahMood);
    pet.bondXp = (Number(pet.bondXp) || 0) + tambahBond;
    pet.lastUpdate = Date.now();

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(targetUser, targetLb);
    }

    window.bukaLaciMakanHabitat = false;
    window.renderTabHabitatMyPet();

    window.triggerAnimasiPetSementara("#mypet-habitat-stage", "eating", 1600);
    window.triggerAnimasiPetSementara("#mypet-detail-preview-box", "eating", 1600);

    let prefixMsg = window.modeKunjunganPet ? ("Kamu memberi " + itemFood.nama + " kepada pet milik " + targetUser + ". ") : "";

    if (isFavSnack) {
        window.tampilkanToastInteraksiPet(prefixMsg + "🌟 <b>FAVORIT!</b> " + nama + " melompat kegirangan memakan " + itemFood.ikon + "!");
        setTimeout(function() {
            window.triggerAnimasiPetSementara("#mypet-habitat-stage", "happy", 1500);
            window.triggerAnimasiPetSementara("#mypet-detail-preview-box", "happy", 1500);
        }, 1650);
    } else {
        window.tampilkanToastInteraksiPet(prefixMsg + "😋 <b>" + nama + "</b> menikmati " + itemFood.ikon + " dengan lahap!");
    }
};

// MENGAKTIFKAN KUNJUNGAN (VISIT TEMAN)
window.kunjungiHabitatSiswaLain = function(targetUsername) {
    if (!targetUsername || !window.leaderboardSiswaData || !window.leaderboardSiswaData[targetUsername]) return;
    let myUName = sessionStorage.getItem("username");
    if (targetUsername === myUName) {
        window.modeKunjunganPet = null;
        window.bukaModalMyPet();
        return;
    }
    
    window.modeKunjunganPet = targetUsername;
    window.bukaLaciMakanHabitat = false;
    window.bukaLaciMainanHabitat = false;
    
    window.sinkronkanWaktuLaparSemuaPet(targetUsername);
    window.bukaModal("modal-my-pet");
    window.isMyPetModalOpen = true;
    
    // Sembunyikan tab lain karena mode visit hanya boleh melihat habitat
    document.querySelectorAll(".mypet-tab-btn").forEach(btn => btn.style.display = "none");
    document.getElementById("tab-btn-mypet-habitat").style.display = "block";
    
    window.gantiTabMyPet("habitat");
};

window.akhiriKunjunganPet = function() {
    window.modeKunjunganPet = null;
    document.querySelectorAll(".mypet-tab-btn").forEach(btn => btn.style.display = "block");
    window.gantiTabMyPet("habitat");
};

// Ganti Nama Khusus Pet Aktif
window.gantiNamaPetAktif = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData) return;

    let activeId = lb.myPetData.activePetId;
    let pet = lb.myPetData.ownedPets[activeId];
    if (!pet) return;

    let cat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === activeId; }) || window.MY_PET_CATALOG.pets[0];
    let namaLama = pet.customName || cat.namaDefault;
    let namaBaru = prompt("Berikan nama panggilan khusus untuk " + cat.spesies + " kesayanganmu (Maks. 16 karakter):", namaLama);

    if (namaBaru === null) return;
    namaBaru = namaBaru.trim().slice(0, 16);
    if (!namaBaru) return;

    pet.customName = namaBaru;
    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }
    window.renderTabHabitatMyPet();
    window.tampilkanToastInteraksiPet("🏷️ Nama pet berhasil diubah menjadi <b>" + namaBaru + "</b>!");
};

// 3. RENDER TAB PET COLLECTION (HABITAT UNIVERSAL TANPA BATAS KAPASITAS)
window.renderTabCollectionMyPet = function() {
    let container = document.getElementById("mypet-view-collection");
    if (!container) return;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    window.sinkronkanWaktuLaparSemuaPet(uName);
    let petData = lb.myPetData;
    let ownedMap = petData.ownedPets || {};
    let ownedCount = Object.keys(ownedMap).length;

    let html =
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:white; padding:12px 16px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:14px;">' +
            '<div>' +
                '<h4 style="margin:0; color:#0b3954; font-size:15px;">🐾 Koleksi Hewan Peliharaanmu (' + ownedCount + ' / ' + window.MY_PET_CATALOG.pets.length + ' Spesies)</h4>' +
                '<div style="font-size:11px; color:#64748b;">Seluruh pet yang telah diadopsi tinggal bersama di <b>Habitat Universal</b> milikmu!</div>' +
            '</div>' +
            '<button type="button" class="btn-action" style="background:#0b3954; width:auto; padding:7px 14px; font-size:11px; border-radius:20px;" onclick="window.gantiTabMyPet(\'shop\')">🛒 Adopsi Pet Baru</button>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(235px, 1fr)); gap:12px;">';

    window.MY_PET_CATALOG.pets.forEach(function(cat) {
        let dimiliki = ownedMap[cat.id];
        let isFocused = (petData.activePetId === cat.id);
        let snackFav = window.MY_PET_CATALOG.snacks.find(function(s) { return s.favPet === cat.id; });

        if (dimiliki) {
            let hVal = Math.max(0, Math.min(100, Math.round(Number(dimiliki.hunger) || 0)));
            let mVal = Math.max(0, Math.min(100, Math.round(Number(dimiliki.mood) || 0)));
            let stLapar = window.dapatkanInfoStatusLaparPet(hVal);
            let bInfo = window.hitungLevelBondPet(dimiliki.bondXp || 0);
            let thumbSvg = window.bangunVisualPet25DSVG(cat.id, dimiliki.outfit || {}, stLapar.animState, 74);

            html +=
                '<div style="background:white; border:2px solid ' + (isFocused ? '#16a085' : '#cbd5e1') + '; border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:10px; box-shadow:0 4px 10px rgba(0,0,0,0.03);">' +
                    '<div style="display:flex; align-items:center; gap:12px;">' +
                        '<div style="width:76px; height:76px; background:' + cat.bgRarity + '; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">' +
                            thumbSvg +
                        '</div>' +
                        '<div style="flex:1; min-width:0;">' +
                            '<span style="background:' + cat.bgRarity + '; color:' + cat.warnaRarity + '; font-size:10px; font-weight:800; padding:2px 8px; border-radius:10px;">' + cat.rarity + '</span>' +
                            '<div style="font-weight:900; font-size:16px; color:#0f172a; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + (dimiliki.customName || cat.namaDefault) + '</div>' +
                            '<div style="font-size:11px; color:#64748b; font-weight:700;">' + cat.spesies + ' • ❤️ Bond Lv.' + bInfo.level + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="font-size:11px; background:#f8fafc; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0; display:flex; justify-content:space-between;">' +
                        '<span>🍖 Kenyang: <b style="color:' + stLapar.warna + ';">' + hVal + '%</b></span>' +
                        '<span>😊 Mood: <b style="color:#ec4899;">' + mVal + '%</b></span>' +
                    '</div>' +
                    '<div style="font-size:10px; color:#64748b;">Camilan Favorit: <b>' + (snackFav ? snackFav.ikon + ' ' + snackFav.nama : '-') + '</b></div>' +
                    '<button type="button" class="btn-action" style="background:' + (isFocused ? '#16a085' : '#0b3954') + '; width:100%; padding:8px; font-size:12px;" onclick="window.pilihPetAktifUtama(\'' + cat.id + '\')">' +
                        (isFocused ? '🏡 Lihat Detail di Habitat' : '👆 Rawat / Berinteraksi') +
                    '</button>' +
                '</div>';
        } else {
            let thumbLocked = window.bangunVisualPet25DSVG(cat.id, {}, "idle", 74);
            html +=
                '<div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:10px; opacity:0.88;">' +
                    '<div style="display:flex; align-items:center; gap:12px;">' +
                        '<div style="width:76px; height:76px; background:#e2e8f0; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; filter:grayscale(0.65);">' +
                            thumbLocked +
                        '</div>' +
                        '<div style="flex:1; min-width:0;">' +
                            '<span style="background:' + cat.bgRarity + '; color:' + cat.warnaRarity + '; font-size:10px; font-weight:800; padding:2px 8px; border-radius:10px;">' + cat.rarity + '</span>' +
                            '<div style="font-weight:800; font-size:16px; color:#334155; margin-top:3px;">' + cat.spesies + '</div>' +
                            '<div style="font-size:12px; color:#d97706; font-weight:800;">🪙 ' + cat.harga.toLocaleString("id-ID") + ' Coin</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="font-size:10px; color:#64748b;">Camilan Favorit: <b>' + (snackFav ? snackFav.ikon + ' ' + snackFav.nama : '-') + '</b></div>' +
                    '<button type="button" class="btn-action" style="background:#e67e22; width:100%; padding:8px; font-size:12px;" onclick="window.gantiTabMyPet(\'shop\'); window.renderTabShopMyPet(\'pets\');">🛒 Adopsi di Shop</button>' +
                '</div>';
        }
    });

    html += '</div>';
    container.innerHTML = html;
};

window.pilihPetAktifUtama = function(petId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData || !lb.myPetData.ownedPets[petId]) return;

    lb.myPetData.activePetId = petId;
    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }
    window.gantiTabMyPet("habitat");
};

// =========================================================================
// 4. RENDER TAB SHOP TERPADU (5 KATEGORI DENGAN MATA UANG COIN)
// =========================================================================
window.activeMyPetShopCategory = "pets";
window.activeWardrobeSlot = "all";

window.renderTabShopMyPet = function(kategori) {
    if (kategori) window.activeMyPetShopCategory = kategori;
    let catAktif = window.activeMyPetShopCategory || "pets";

    let container = document.getElementById("mypet-view-shop");
    if (!container) return;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let petData = lb.myPetData;
    let saldoCoin = window.ambilCoinSiswa(uName);
    let ownedPetsMap = petData.ownedPets || {};

    let navShopHtml =
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:white; padding:12px 16px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:14px;">' +
            '<div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:2px;">' +
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "pets" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'pets\')">🐾 Adopsi Pet</button>' +
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "foods" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'foods\')">🍖 Makanan & Camilan</button>' +
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "toys" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'toys\')">🎾 Mainan (Toys)</button>' +
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "habitat" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'habitat\')">⛲ Dekorasi Taman</button>' +
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "wardrobe" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'wardrobe\')">👗 Kostum & Aksesori</button>' +
            '</div>' +
            '<div style="font-size:12px; font-weight:800; color:#0b3954; background:#fef9e7; border:1px solid #facc15; padding:5px 12px; border-radius:20px;">' +
                '🪙 Saldo Belanja: <span style="color:#d97706;">' + saldoCoin.toLocaleString("id-ID") + ' Coin</span>' +
            '</div>' +
        '</div>';

    let bodyShopHtml = '';

    // KATEGORI 1: ADOPSI PET (7 SPESIES, TANPA BATAS KAPASITAS)
    if (catAktif === "pets") {
        bodyShopHtml +=
            '<div style="background:#eaf2f8; border-left:4px solid #2980b9; padding:10px 14px; border-radius:8px; margin-bottom:12px; font-size:12px; color:#1e293b;">' +
                '🏡 <b>Habitat Universal Gratis:</b> Seluruh pet yang kamu adopsi akan langsung tinggal dan bermain bersama di dalam satu taman tanpa batas kapasitas!' +
            '</div>' +
            '<div class="mypet-shop-grid">';

        window.MY_PET_CATALOG.pets.forEach(function(p) {
            let sudahPunya = Boolean(ownedPetsMap[p.id]);
            let previewSvg = window.bangunVisualPet25DSVG(p.id, {}, "idle", 92);
            let snackFav = window.MY_PET_CATALOG.snacks.find(function(s) { return s.favPet === p.id; });

            let btnHtml = sudahPunya
                ? '<button type="button" class="btn-action" style="background:#16a085; width:100%; padding:8px; font-size:12px;" onclick="window.pilihPetAktifUtama(\'' + p.id + '\')">✓ Sudah Dimiliki (Lihat)</button>'
                : '<button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:100%; padding:9px; font-size:12px; font-weight:800;" onclick="window.beliPetDiShop(\'' + p.id + '\')">🛒 Adopsi (' + p.harga.toLocaleString("id-ID") + ' Coin)</button>';

            bodyShopHtml +=
                '<div class="mypet-shop-card">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; width:100%;">' +
                        '<span style="background:' + p.bgRarity + '; color:' + p.warnaRarity + '; font-size:10px; font-weight:800; padding:2px 8px; border-radius:10px;">' + p.rarity + '</span>' +
                        '<span style="font-size:11px; color:#64748b; font-weight:700;">Fav: ' + (snackFav ? snackFav.ikon + ' ' + snackFav.nama : '-') + '</span>' +
                    '</div>' +
                    '<div style="height:100px; display:flex; align-items:center; justify-content:center; margin:4px 0;">' + previewSvg + '</div>' +
                    '<div style="font-weight:900; font-size:16px; color:#0f172a;">' + p.spesies + '</div>' +
                    '<div style="font-size:11px; color:#64748b; margin-bottom:6px;">Nama bawaan: <b>' + p.namaDefault + '</b></div>' +
                    btnHtml +
                '</div>';
        });
        bodyShopHtml += '</div>';
    }

    // KATEGORI 2: MAKANAN UTAMA & CAMILAN FAVORIT
    else if (catAktif === "foods") {
        let inv = petData.foodInventory || {};
        bodyShopHtml +=
            '<h4 style="margin:0 0 10px 0; color:#0b3954; font-size:15px;">🍱 1. Makanan Utama Pet (Mengisi Indikator Kenyang 0–100)</h4>' +
            '<div class="mypet-shop-grid" style="margin-bottom:22px;">';

        window.MY_PET_CATALOG.foods.forEach(function(f) {
            let stok = Number(inv[f.id]) || 0;
            bodyShopHtml +=
                '<div class="mypet-shop-card">' +
                    '<div style="display:flex; justify-content:space-between; width:100%; font-size:10px; font-weight:800;">' +
                        '<span style="background:#dcfce7; color:#16a34a; padding:2px 8px; border-radius:10px;">+' + f.kenyang + ' Kenyang</span>' +
                        '<span style="color:#64748b;">Stok: <b>' + stok + '</b></span>' +
                    '</div>' +
                    '<div style="font-size:42px; margin:8px 0;">' + f.ikon + '</div>' +
                    '<div style="font-weight:800; font-size:14px; color:#0f172a;">' + f.nama + '</div>' +
                    '<div style="font-size:11px; color:#64748b; margin:2px 0 8px 0;">Tahan ± ' + f.tahan + '</div>' +
                    '<button type="button" class="btn-action" style="background:#16a34a; width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="window.beliMakananPetDiShop(\'' + f.id + '\')">🛒 Beli 1x (' + f.harga + ' Coin)</button>' +
                '</div>';
        });

        bodyShopHtml +=
            '</div>' +
            '<h4 style="margin:0 0 10px 0; color:#0b3954; font-size:15px;">🦴 2. Camilan Favorit Spesies (+5 Kenyang, +10 Mood, & Reaksi Spesial)</h4>' +
            '<div class="mypet-shop-grid">';

        window.MY_PET_CATALOG.snacks.forEach(function(s) {
            let stok = Number(inv[s.id]) || 0;
            bodyShopHtml +=
                '<div class="mypet-shop-card">' +
                    '<div style="display:flex; justify-content:space-between; width:100%; font-size:10px; font-weight:800;">' +
                        '<span style="background:#fef3c7; color:#d97706; padding:2px 8px; border-radius:10px;">💖 Fav: ' + s.favLabel + '</span>' +
                        '<span style="color:#64748b;">Stok: <b>' + stok + '</b></span>' +
                    '</div>' +
                    '<div style="font-size:40px; margin:8px 0;">' + s.ikon + '</div>' +
                    '<div style="font-weight:800; font-size:14px; color:#0f172a;">' + s.nama + '</div>' +
                    '<div style="font-size:11px; color:#ec4899; font-weight:700; margin:2px 0 8px 0;">+5 Kenyang, +10 Mood</div>' +
                    '<button type="button" class="btn-action" style="background:#d97706; width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="window.beliMakananPetDiShop(\'' + s.id + '\')">🛒 Beli 1x (' + s.harga + ' Coin)</button>' +
                '</div>';
        });
        bodyShopHtml += '</div>';
    }

    // KATEGORI 3: MAINAN PERMANEN (15 TOYS UNTUK INTERAKSI AJAK BERMAIN)
    else if (catAktif === "toys") {
        let ownedW = Array.isArray(petData.ownedWardrobe) ? petData.ownedWardrobe : [];
        let ownedT = Array.isArray(petData.ownedToys) ? petData.ownedToys : [];

        bodyShopHtml +=
            '<div style="background:#fffbeb; border-left:4px solid #f59e0b; padding:10px 14px; border-radius:8px; margin-bottom:12px; font-size:12px; color:#1e293b;">' +
                '🎾 <b>Mainan Permanen:</b> Mainan yang sudah dibeli menjadi milikmu selamanya dan dapat dipakai berulang kali lewat tombol <b>🎾 Main</b> di Habitat!' +
            '</div>' +
            '<div class="mypet-shop-grid">';

        (window.MY_PET_CATALOG.toys || []).forEach(function(t) {
            let sudahPunya = ownedW.includes(t.id) || ownedT.includes(t.id);
            let btnToy = sudahPunya
                ? '<button type="button" class="btn-action" style="background:#16a085; width:100%; padding:8px; font-size:12px;" onclick="window.gantiTabMyPet(\'habitat\'); window.toggleLaciMainanHabitat(true);">✓ Dimiliki (Pakai Main)</button>'
                : '<button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="window.beliMainanDiShop(\'' + t.id + '\')">🛒 Beli (' + t.harga.toLocaleString("id-ID") + ' Coin)</button>';

            bodyShopHtml +=
                '<div class="mypet-shop-card">' +
                    '<div style="font-size:40px; margin:6px 0;">' + t.ikon + '</div>' +
                    '<div style="font-weight:800; font-size:14px; color:#0f172a;">' + t.nama + '</div>' +
                    '<div style="font-size:11px; color:#64748b; line-height:1.35; flex:1; margin:4px 0 8px 0;">' + t.deskripsi + '</div>' +
                    btnToy +
                '</div>';
        });
        bodyShopHtml += '</div>';
    }

    // KATEGORI 4: DEKORASI TAMAN HABITAT (TERikat SLOT KOORDINAT TETAP)
    else if (catAktif === "habitat") {
        let ownedDecs = Array.isArray(petData.ownedDecorations) ? petData.ownedDecorations : [];
        let activeDecs = Array.isArray(petData.activeDecorations) ? petData.activeDecorations : [];

        bodyShopHtml +=
            '<h4 style="margin:0 0 10px 0; color:#0b3954; font-size:15px;">⛲ Dekorasi Taman Habitat Universal</h4>' +
            '<div class="mypet-shop-grid">';

        window.MY_PET_CATALOG.decorations.forEach(function(dec) {
            let isOwned = ownedDecs.includes(dec.id);
            let isActive = activeDecs.includes(dec.id);

            let btnDec = isOwned
                ? '<button type="button" class="btn-action" style="background:' + (isActive ? '#64748b' : '#27ae60') + '; width:100%; padding:8px; font-size:12px;" onclick="window.togglePasangDekorasiHabitat(\'' + dec.id + '\')">' +
                      (isActive ? '✓ Terpasang (Lepas)' : '📌 Pasang di Slot') +
                  '</button>'
                : '<button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="window.beliDekorasiHabitat(\'' + dec.id + '\')">🛒 Beli (' + dec.harga.toLocaleString("id-ID") + ' Coin)</button>';

            bodyShopHtml +=
                '<div class="mypet-shop-card">' +
                    '<span style="background:#f1f5f9; color:#475569; font-size:10px; font-weight:800; padding:2px 8px; border-radius:8px;">📍 Slot: ' + (dec.slot || 'Taman') + '</span>' +
                    '<div style="font-size:40px; margin:8px 0;">' + dec.ikon + '</div>' +
                    '<div style="font-weight:800; font-size:14px; color:#0f172a;">' + dec.nama + '</div>' +
                    '<div style="font-size:11px; color:#64748b; margin-bottom:8px;">Ornamen lingkungan habitat</div>' +
                    btnDec +
                '</div>';
        });
        bodyShopHtml += '</div>';
    }

    // KATEGORI 5: SHOP KOSTUM & AKSESORI (38 ITEM PERMANEN)
    else if (catAktif === "wardrobe") {
        let ownedW = Array.isArray(petData.ownedWardrobe) ? petData.ownedWardrobe : [];
        let grupList = [
            { slot: "head",    judul: "🎩 A. Aksesori Kepala" },
            { slot: "eyes",    judul: "👓 B. Kacamata & Wajah" },
            { slot: "neck",    judul: "🎀 C. Aksesori Leher & Tubuh" },
            { slot: "body",    judul: "👕 D. Pakaian Kasual & Profesi" },
            { slot: "costume", judul: "🦸 E. Kostum Lengkap (Full Costume)" }
        ];

        grupList.forEach(function(g) {
            let items = window.MY_PET_CATALOG.wardrobe.filter(function(w) { return w.slot === g.slot; });
            bodyShopHtml +=
                '<h4 style="margin:0 0 10px 0; color:#0b3954; font-size:15px;">' + g.judul + '</h4>' +
                '<div class="mypet-shop-grid" style="margin-bottom:20px;">';

            items.forEach(function(item) {
                let sudahPunya = ownedW.includes(item.id);
                let btnW = sudahPunya
                    ? '<button type="button" class="btn-action" style="background:#8b5cf6; width:100%; padding:8px; font-size:12px;" onclick="window.gantiTabMyPet(\'wardrobe\')">✓ Milikmu (Buka Wardrobe)</button>'
                    : '<button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="window.beliItemWardrobeDiShop(\'' + item.id + '\')">🛒 Beli (' + item.harga.toLocaleString("id-ID") + ' Coin)</button>';

                bodyShopHtml +=
                    '<div class="mypet-shop-card">' +
                        '<div style="font-size:38px; margin:6px 0;">' + item.ikon + '</div>' +
                        '<div style="font-weight:800; font-size:14px; color:#0f172a;">' + item.nama + '</div>' +
                        '<div style="font-size:11px; color:#64748b; line-height:1.35; flex:1; margin:4px 0 8px 0;">' + item.deskripsi + '</div>' +
                        btnW +
                    '</div>';
            });
            bodyShopHtml += '</div>';
        });
    }

    container.innerHTML = navShopHtml + bodyShopHtml;
};

// =========================================================================
// 5. LOGIKA TRANSAKSI BELANJA SHOP (MEMOTONG COIN, XP LEADERBOARD TETAP UTUH)
// =========================================================================
window.beliPetDiShop = function(petId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let petData = lb.myPetData;
    let catPet = window.MY_PET_CATALOG.pets.find(function(p) { return p.id === petId; });
    if (!catPet) return;

    if (petData.ownedPets && petData.ownedPets[petId]) {
        return alert("Kamu sudah memiliki " + catPet.spesies + " di habitatmu!");
    }

    let saldo = window.ambilCoinSiswa(uName);
    if (saldo < catPet.harga) {
        let kurang = (catPet.harga - saldo).toLocaleString("id-ID");
        return alert("⚠️ Coin kamu belum cukup untuk mengadopsi " + catPet.spesies + "!\n\nHarga: " + catPet.harga.toLocaleString("id-ID") + " Coin\nCoin Kamu: " + saldo.toLocaleString("id-ID") + " Coin\n(Kurang " + kurang + " Coin lagi)");
    }

    if (!confirm("Adopsi \"" + catPet.spesies + "\" (" + catPet.rarity + ") seharga " + catPet.harga.toLocaleString("id-ID") + " Coin?\n\n(XP kamu di Leaderboard tidak akan berkurang!)")) {
        return;
    }

    if (window.gunakanCoinSiswa(catPet.harga, "beli_pet_" + petId)) {
        let namaCustom = prompt("🎉 Selamat! Berikan nama panggilan untuk " + catPet.spesies + " barumu:", catPet.namaDefault);
        namaCustom = (namaCustom && namaCustom.trim()) ? namaCustom.trim().slice(0, 16) : catPet.namaDefault;

        petData.ownedPets[petId] = {
            id: petId,
            customName: namaCustom,
            hunger: 85,
            mood: 90,
            bondXp: 0,
            lastUpdate: Date.now(),
            lastPetTime: 0,
            lastPlayTime: 0,
            outfit: { head: "", eyes: "", neck: "", body: "", costume: "" }
        };
        petData.activePetId = petId;

        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.gantiTabMyPet("habitat");
        window.tampilkanToastInteraksiPet("🎉 Selamat datang di Habitat Universal, <b>" + namaCustom + "</b>!");
    }
};

window.beliMainanDiShop = function(toyId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let item = (window.MY_PET_CATALOG.toys || []).find(function(t) { return t.id === toyId; });
    if (!item) return;

    if (!Array.isArray(lb.myPetData.ownedWardrobe)) lb.myPetData.ownedWardrobe = [];
    if (!Array.isArray(lb.myPetData.ownedToys)) lb.myPetData.ownedToys = [];

    if (lb.myPetData.ownedWardrobe.includes(toyId) || lb.myPetData.ownedToys.includes(toyId)) {
        return alert("Kamu sudah memiliki mainan ini!");
    }

    let saldo = window.ambilCoinSiswa(uName);
    if (saldo < item.harga) {
        let kurang = (item.harga - saldo).toLocaleString("id-ID");
        return alert("⚠️ Coin belum cukup untuk membeli mainan \"" + item.nama + "\"!\n\nHarga: " + item.harga.toLocaleString("id-ID") + " Coin\nCoin Kamu: " + saldo.toLocaleString("id-ID") + " Coin\n(Kurang " + kurang + " Coin lagi)");
    }

    if (!confirm("Beli mainan permanen \"" + item.nama + "\" seharga " + item.harga.toLocaleString("id-ID") + " Coin?")) return;

    if (window.gunakanCoinSiswa(item.harga, "beli_toy_" + toyId)) {
        lb.myPetData.ownedWardrobe.push(toyId);
        lb.myPetData.ownedToys.push(toyId);
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.renderTabShopMyPet("toys");
        alert("🎾 Berhasil membeli \"" + item.nama + "\"! Sekarang kamu bisa menggunakannya lewat tombol Main di Habitat.");
    }
};

window.beliDekorasiHabitat = function(decId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let dec = window.MY_PET_CATALOG.decorations.find(function(d) { return d.id === decId; });
    if (!dec) return;

    let saldo = window.ambilCoinSiswa(uName);
    if (saldo < dec.harga) {
        return alert("⚠️ Coin kamu belum cukup untuk membeli " + dec.nama + " (" + dec.harga.toLocaleString("id-ID") + " Coin)!");
    }

    if (!confirm("Beli dekorasi \"" + dec.nama + "\" seharga " + dec.harga.toLocaleString("id-ID") + " Coin?")) return;

    if (window.gunakanCoinSiswa(dec.harga, "beli_decor_" + decId)) {
        if (!lb.myPetData.ownedDecorations.includes(decId)) {
            lb.myPetData.ownedDecorations.push(decId);
        }
        if (!lb.myPetData.activeDecorations.includes(decId)) {
            lb.myPetData.activeDecorations.push(decId);
        }
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.renderTabShopMyPet("habitat");
    }
};

window.togglePasangDekorasiHabitat = function(decId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let act = lb.myPetData.activeDecorations || [];
    if (act.includes(decId)) {
        lb.myPetData.activeDecorations = act.filter(function(x) { return x !== decId; });
    } else {
        act.push(decId);
        lb.myPetData.activeDecorations = act;
    }
    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }
    window.renderTabShopMyPet("habitat");
};

window.beliMakananPetDiShop = function(foodId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let semuaMakanan = [...window.MY_PET_CATALOG.foods, ...window.MY_PET_CATALOG.snacks];
    let item = semuaMakanan.find(function(f) { return f.id === foodId; });
    if (!item) return;

    let saldo = window.ambilCoinSiswa(uName);
    if (saldo < item.harga) {
        return alert("⚠️ Coin kamu belum cukup untuk membeli " + item.nama + " (" + item.harga + " Coin)!");
    }

    if (window.gunakanCoinSiswa(item.harga, "beli_food_" + foodId)) {
        if (!lb.myPetData.foodInventory) lb.myPetData.foodInventory = {};
        lb.myPetData.foodInventory[foodId] = (Number(lb.myPetData.foodInventory[foodId]) || 0) + 1;
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.renderTabShopMyPet("foods");
    }
};

window.beliItemWardrobeDiShop = function(itemId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let item = window.MY_PET_CATALOG.wardrobe.find(function(w) { return w.id === itemId; });
    if (!item) return;

    if (lb.myPetData.ownedWardrobe.includes(itemId)) {
        window.gantiTabMyPet("wardrobe");
        return;
    }

    let saldo = window.ambilCoinSiswa(uName);
    if (saldo < item.harga) {
        let kurang = (item.harga - saldo).toLocaleString("id-ID");
        return alert("⚠️ Coin belum cukup untuk membeli \"" + item.nama + "\"!\n\nHarga: " + item.harga.toLocaleString("id-ID") + " Coin\nCoin Kamu: " + saldo.toLocaleString("id-ID") + " Coin\n(Kurang " + kurang + " Coin lagi)");
    }

    if (!confirm("Beli \"" + item.nama + "\" seharga " + item.harga.toLocaleString("id-ID") + " Coin?\n\nItem ini akan tersimpan permanen di Wardrobe!")) {
        return;
    }

    if (window.gunakanCoinSiswa(item.harga, "beli_wardrobe_" + itemId)) {
        lb.myPetData.ownedWardrobe.push(itemId);
        if (lb.myPetData.activePetId && lb.myPetData.ownedPets[lb.myPetData.activePetId]) {
            window.pakaiLepasItemWardrobe(itemId, true);
        }
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.renderTabShopMyPet("wardrobe");
        alert("👗 Berhasil membeli \"" + item.nama + "\"! Item telah masuk ke Wardrobe.");
    }
};

// =========================================================================
// 6. RENDER TAB WARDROBE (38 ITEM KOSMETIK DENGAN 5 KATEGORI SLOT)
// =========================================================================
window.renderTabWardrobeMyPet = function(filterSlot) {
    if (filterSlot) window.activeWardrobeSlot = filterSlot;
    let slotAktif = window.activeWardrobeSlot || "all";

    let container = document.getElementById("mypet-view-wardrobe");
    if (!container) return;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let petData = lb.myPetData;
    let ownedPetsMap = petData.ownedPets || {};
    let ownedPetIds = Object.keys(ownedPetsMap);

    if (ownedPetIds.length === 0) {
        container.innerHTML =
            '<div style="background:white; border:2px dashed #cbd5e1; border-radius:16px; padding:40px 20px; text-align:center;">' +
                '<div style="font-size:54px; margin-bottom:8px;">👗</div>' +
                '<h3 style="margin:0 0 6px 0; color:#0b3954;">Belum Ada Pet untuk Didandani</h3>' +
                '<p style="margin:0 0 16px 0; font-size:13px; color:#64748b;">Adopsi pet pertamamu di Shop terlebih dahulu untuk mencoba berbagai kostum dan aksesori!</p>' +
                '<button type="button" class="btn-action" style="background:#0b3954; width:auto; padding:10px 24px; border-radius:25px;" onclick="window.gantiTabMyPet(\'shop\'); window.renderTabShopMyPet(\'pets\');">🛒 Ke Shop Adopsi Pet</button>' +
            '</div>';
        return;
    }

    if (!petData.activePetId || !ownedPetsMap[petData.activePetId]) {
        petData.activePetId = ownedPetIds[0];
    }

    let activeId = petData.activePetId;
    let activePet = ownedPetsMap[activeId];
    if (!activePet.outfit) activePet.outfit = { head: "", eyes: "", neck: "", body: "", costume: "" };
    let eq = activePet.outfit;

    let catActive = window.MY_PET_CATALOG.pets.find(function(p) { return p.id === activeId; }) || window.MY_PET_CATALOG.pets[0];
    let previewSvg = window.bangunVisualPet25DSVG(activeId, eq, "idle", 165);

    let opsiPetHtml = '';
    ownedPetIds.forEach(function(pid) {
        let pObj = ownedPetsMap[pid];
        let pCat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === pid; }) || window.MY_PET_CATALOG.pets[0];
        let sel = (pid === activeId) ? "selected" : "";
        opsiPetHtml += '<option value="' + pid + '" ' + sel + '>🐾 ' + (pObj.customName || pCat.namaDefault) + ' (' + pCat.spesies + ')</option>';
    });

    let ownedW = Array.isArray(petData.ownedWardrobe) ? petData.ownedWardrobe : [];
    let semuaWardrobe = window.MY_PET_CATALOG.wardrobe.filter(function(w) {
        if (slotAktif === "all") return true;
        return w.slot === slotAktif;
    });

    let gridItemsHtml = '';
    semuaWardrobe.forEach(function(item) {
        let isOwned = ownedW.includes(item.id);
        let isEquipped = (eq[item.slot] === item.id);

        let btnAction = '';
        if (isEquipped) {
            btnAction = '<button type="button" class="btn-action" style="background:#ef4444; width:100%; padding:7px; font-size:11px;" onclick="window.pakaiLepasItemWardrobe(\'' + item.id + '\')">✕ Lepas</button>';
        } else if (isOwned) {
            btnAction = '<button type="button" class="btn-action" style="background:#27ae60; width:100%; padding:7px; font-size:11px;" onclick="window.pakaiLepasItemWardrobe(\'' + item.id + '\')">✨ Pakai</button>';
        } else {
            btnAction = '<button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:100%; padding:7px; font-size:11px; font-weight:800;" onclick="window.beliItemWardrobeDiShop(\'' + item.id + '\')">🛒 Beli (' + item.harga.toLocaleString("id-ID") + ' Coin)</button>';
        }

        let petaLabelSlot = { head: "Kepala", eyes: "Wajah/Mata", neck: "Leher/Tubuh", body: "Pakaian", costume: "Kostum Penuh" };
        let labelSlot = petaLabelSlot[item.slot] || "Kosmetik";

        gridItemsHtml +=
            '<div class="mypet-shop-card" style="border-color:' + (isEquipped ? '#8b5cf6' : (isOwned ? '#22c55e' : '#e2e8f0')) + '; background:' + (isEquipped ? '#f5f3ff' : '#ffffff') + ';">' +
                '<div style="display:flex; justify-content:space-between; width:100%; font-size:10px; font-weight:800;">' +
                    '<span style="background:#f1f5f9; color:#475569; padding:2px 7px; border-radius:8px;">' + labelSlot + '</span>' +
                    (isOwned ? '<span style="color:#16a34a;">✓ Dimiliki</span>' : '<span style="color:#d97706;">🪙 ' + item.harga.toLocaleString("id-ID") + '</span>') +
                '</div>' +
                '<div style="font-size:36px; margin:6px 0;">' + item.ikon + '</div>' +
                '<div style="font-weight:800; font-size:13px; color:#0f172a;">' + item.nama + '</div>' +
                '<div style="font-size:10px; color:#64748b; line-height:1.3; flex:1; margin:3px 0 8px 0;">' + item.deskripsi + '</div>' +
                btnAction +
            '</div>';
    });

    container.innerHTML =
        '<div style="display:flex; gap:18px; flex-wrap:wrap; align-items:flex-start;">' +
            '<div style="width:240px; background:white; border:2px solid #cbd5e1; border-radius:16px; padding:16px; text-align:center; flex-shrink:0; margin:0 auto;">' +
                '<label style="font-size:11px; font-weight:800; color:#475569; display:block; margin-bottom:6px;">Pilih Pet yang Didandani:</label>' +
                '<select class="input-box" style="margin:0 0 12px 0; padding:7px; font-weight:800; font-size:12px;" onchange="window.pilihPetDiWardrobe(this.value)">' +
                    opsiPetHtml +
                '</select>' +
                '<div style="background:radial-gradient(circle, #f5f3ff 0%, #e0e7ff 100%); border:1px solid #c7d2fe; border-radius:14px; padding:12px; display:flex; align-items:center; justify-content:center; min-height:175px;">' +
                    previewSvg +
                '</div>' +
                '<div style="font-weight:900; font-size:16px; color:#0f172a; margin-top:10px;">' + (activePet.customName || catActive.namaDefault) + '</div>' +
                '<div style="font-size:11px; color:#64748b; margin-bottom:10px;">Kombinasi bebas Aksesori & Pakaian</div>' +
                '<button type="button" class="btn-action" style="background:#64748b; width:100%; padding:7px; font-size:11px;" onclick="window.lepasSemuaKostumPetAktif()">🔄 Lepas Semua Aksesori</button>' +
            '</div>' +

            '<div style="flex:1; min-width:280px;">' +
                '<div style="display:flex; gap:6px; overflow-x:auto; background:white; padding:10px 12px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:12px;">' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "all" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'all\')">🌟 Semua</button>' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "head" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'head\')">🎩 Kepala</button>' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "eyes" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'eyes\')">👓 Wajah</button>' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "neck" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'neck\')">🎀 Leher/Tubuh</button>' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "body" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'body\')">👕 Pakaian</button>' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "costume" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'costume\')">🦸 Kostum</button>' +
                '</div>' +
                '<div class="mypet-shop-grid">' + gridItemsHtml + '</div>' +
            '</div>' +
        '</div>';
};

window.pilihPetDiWardrobe = function(petId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData || !lb.myPetData.ownedPets[petId]) return;

    lb.myPetData.activePetId = petId;
    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }
    window.renderTabWardrobeMyPet();
};

window.pakaiLepasItemWardrobe = function(itemId, forceEquip) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData) return;

    let activeId = lb.myPetData.activePetId;
    let pet = lb.myPetData.ownedPets[activeId];
    if (!pet) return;
    if (!pet.outfit) pet.outfit = { head: "", eyes: "", neck: "", body: "", costume: "" };

    let item = window.MY_PET_CATALOG.wardrobe.find(function(w) { return w.id === itemId; });
    if (!item) return;

    let eq = pet.outfit;
    let sedangDipakai = (eq[item.slot] === item.id);

    if (sedangDipakai && !forceEquip) {
        eq[item.slot] = "";
    } else {
        eq[item.slot] = item.id;

        if (item.slot === "costume") {
            eq.body = "";
            if (item.id === "cost_astro" || item.id === "cost_dino") {
                eq.head = "";
            }
        } else if (item.slot === "body") {
            eq.costume = "";
        } else if (item.slot === "head") {
            if (eq.costume === "cost_astro" || eq.costume === "cost_dino") {
                eq.costume = "";
            }
        }
    }

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }
    if (window.activeMyPetTab === "wardrobe") {
        window.renderTabWardrobeMyPet();
    }
};

window.lepasSemuaKostumPetAktif = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData) return;

    let activeId = lb.myPetData.activePetId;
    let pet = lb.myPetData.ownedPets[activeId];
    if (!pet) return;

    pet.outfit = { head: "", eyes: "", neck: "", body: "", costume: "" };
    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }
    window.renderTabWardrobeMyPet();
};
