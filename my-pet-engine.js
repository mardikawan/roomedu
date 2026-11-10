/* =========================================================================
   MODUL MY PET ENGINE — TAHAP 1:
   - Sistem Dual-XP (XP Total Leaderboard vs XP Tersedia Belanja)
   - Katalog Lengkap (7 Pet, 6 Habitat, 9 Dekorasi, 13 Pakan/Camilan, 22 Kostum)
   - Kalkulasi Real-Time Kenyang (-4 poin/jam) & Status Kritis (Tanpa Mati Permanen)
   - Kerangka UI Tombol Kiri Bawah & Modal 4 Tab
   ========================================================================= */

// 1. KATALOG MASTER DATA MY PET
window.MY_PET_CATALOG = {
    pets: [
        { id: "kadal",   namaDefault: "Gecko",  spesies: "Kadal",   rarity: "Common",    harga: 1200,  scale: 0.72, favSnack: "snack_kadal",   warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "kucing",  namaDefault: "Mochi",  spesies: "Kucing",  rarity: "Common",    harga: 1600,  scale: 0.82, favSnack: "snack_kucing",  warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "anjing",  namaDefault: "Bobi",   spesies: "Anjing",  rarity: "Common",    harga: 1800,  scale: 0.86, favSnack: "snack_anjing",  warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "monyet",  namaDefault: "Koko",   spesies: "Monyet",  rarity: "Uncommon",  harga: 4000,  scale: 0.84, favSnack: "snack_monyet",  warnaRarity: "#16a34a", bgRarity: "#dcfce7" },
        { id: "beruang", namaDefault: "Bubu",   spesies: "Beruang", rarity: "Rare",      harga: 6500,  scale: 0.98, favSnack: "snack_beruang", warnaRarity: "#2563eb", bgRarity: "#dbeafe" },
        { id: "gajah",   namaDefault: "Dumbo",  spesies: "Gajah",   rarity: "Epic",      harga: 9000,  scale: 1.12, favSnack: "snack_gajah",   warnaRarity: "#9333ea", bgRarity: "#f3e8ff" },
        { id: "naga",    namaDefault: "Ember",  spesies: "Naga",    rarity: "Legendary", harga: 14000, scale: 1.05, favSnack: "snack_naga",    warnaRarity: "#d97706", bgRarity: "#fef3c7" }
    ],
    habitats: [
        { level: 1, nama: "Starter Habitat",   kapasitas: 1, harga: 0,     temaCss: "hab-lv-1", deskripsi: "Ruang awal yang hangat dan nyaman untuk pet pertamamu." },
        { level: 2, nama: "Cozy Home",         kapasitas: 2, harga: 1800,  temaCss: "hab-lv-2", deskripsi: "Ruangan kayu hangat dengan karpet lembut dan jendela cerah." },
        { level: 3, nama: "Garden Habitat",    kapasitas: 3, harga: 3500,  temaCss: "hab-lv-3", deskripsi: "Taman hijau segar dengan rumput, pepohonan, dan udara terbuka." },
        { level: 4, nama: "Adventure Habitat", kapasitas: 4, harga: 6000,  temaCss: "hab-lv-4", deskripsi: "Lembah petualangan dengan bukit batu, sungai kecil, dan jembatan." },
        { level: 5, nama: "Royal Sanctuary",   kapasitas: 6, harga: 10000, temaCss: "hab-lv-5", deskripsi: "Taman istana megah dengan pilar marmer dan lantai keemasan." },
        { level: 6, nama: "Mythic Sanctuary",  kapasitas: 8, harga: 15000, temaCss: "hab-lv-6", deskripsi: "Pulau fantasi legendaris dengan air terjun, kristal, dan aura bintang." }
    ],
    decorations: [
        { id: "dec_bed",      nama: "Tempat Tidur Pet",  harga: 250,  ikon: "🛏️", posX: "14%", posY: "72%" },
        { id: "dec_pillow",   nama: "Bantal Lucu",       harga: 200,  ikon: "🛋️", posX: "28%", posY: "78%" },
        { id: "dec_tree",     nama: "Pohon Panjat",      harga: 500,  ikon: "🌳", posX: "10%", posY: "42%" },
        { id: "dec_woodhouse",nama: "Rumah Kayu Mini",   harga: 700,  ikon: "🛖", posX: "80%", posY: "48%" },
        { id: "dec_pond",     nama: "Kolam Mini",        harga: 900,  ikon: "🏝️", posX: "72%", posY: "76%" },
        { id: "dec_fountain", nama: "Air Mancur",        harga: 1200, ikon: "⛲", posX: "50%", posY: "44%" },
        { id: "dec_flower",   nama: "Taman Bunga",       harga: 1500, ikon: "🌷", posX: "36%", posY: "68%" },
        { id: "dec_crystal",  nama: "Kristal Bercahaya", harga: 2000, ikon: "💎", posX: "86%", posY: "30%" },
        { id: "dec_castle",   nama: "Istana Mini",       harga: 3000, ikon: "🏰", posX: "20%", posY: "26%" }
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
        { id: "snack_monyet",  nama: "Banana Snack", favPet: "monyet",  favLabel: "Monyet",  kenyang: 5, mood: 10, harga: 20, ikon: "🍌", tipe: "snack" },
        { id: "snack_naga",    nama: "Ember Berry",  favPet: "naga",    favLabel: "Naga",    kenyang: 5, mood: 10, harga: 45, ikon: "🍒", tipe: "snack" },
        { id: "snack_beruang", nama: "Honey Berry",  favPet: "beruang", favLabel: "Beruang", kenyang: 5, mood: 10, harga: 35, ikon: "🍯", tipe: "snack" },
        { id: "snack_gajah",   nama: "Bamboo Snack", favPet: "gajah",   favLabel: "Gajah",   kenyang: 5, mood: 10, harga: 30, ikon: "🎍", tipe: "snack" },
        { id: "snack_kadal",   nama: "Cricket Snack",favPet: "kadal",   favLabel: "Kadal",   kenyang: 5, mood: 10, harga: 25, ikon: "🦗", tipe: "snack" }
    ],
    wardrobe: [
        // A. Aksesori Kepala (slot: "head")
        { id: "head_bandana", nama: "Bandana",             slot: "head",    harga: 250,  ikon: "🧣", deskripsi: "Bandana keren di dahi pet." },
        { id: "head_casual",  nama: "Topi Kasual",         slot: "head",    harga: 400,  ikon: "🧢", deskripsi: "Topi santai untuk jalan-jalan." },
        { id: "head_flower",  nama: "Flower Crown",        slot: "head",    harga: 650,  ikon: "🌸", deskripsi: "Mahkota rangkaian bunga segar." },
        { id: "head_wizard",  nama: "Wizard Hat",          slot: "head",    harga: 750,  ikon: "🧙", deskripsi: "Topi penyihir berbintang." },
        { id: "head_crown",   nama: "Royal Crown",         slot: "head",    harga: 1800, ikon: "👑", deskripsi: "Mahkota emas permata kerajaan." },

        // B. Kacamata & Wajah (slot: "eyes")
        { id: "eyes_round",   nama: "Kacamata Bulat",      slot: "eyes",    harga: 300,  ikon: "👓", deskripsi: "Kacamata bulat gaya ilmuwan muda." },
        { id: "eyes_star",    nama: "Kacamata Bintang",    slot: "eyes",    harga: 500,  ikon: "🤩", deskripsi: "Kacamata bingkai bintang ceria." },
        { id: "eyes_goggles", nama: "Goggles Penjelajah",  slot: "eyes",    harga: 600,  ikon: "🥽", deskripsi: "Kacamata pelindung petualang." },
        { id: "eyes_monocle", nama: "Monocle Emas",        slot: "eyes",    harga: 900,  ikon: "🧐", deskripsi: "Lensa tunggal bangsawan berlapis emas." },
        { id: "eyes_halo",    nama: "Halo Bercahaya",      slot: "eyes",    harga: 1200, ikon: "😇", deskripsi: "Cincin cahaya melayang di atas kepala." },

        // C. Pakaian (slot: "body")
        { id: "body_tshirt",  nama: "Kaos Kasual",         slot: "body",    harga: 500,  ikon: "👕", deskripsi: "Kaos santai sehari-hari." },
        { id: "body_hoodie",  nama: "Hoodie",              slot: "body",    harga: 800,  ikon: "🧥", deskripsi: "Jaket hoodie hangat dan modis." },
        { id: "body_labcoat", nama: "Jas Laboratorium",    slot: "body",    harga: 900,  ikon: "🥼", deskripsi: "Jas putih resmi peneliti sains." },
        { id: "body_explorer",nama: "Seragam Penjelajah",  slot: "body",    harga: 1100, ikon: "🦺", deskripsi: "Rompi lapangan lengkap dengan kantong." },
        { id: "body_winter",  nama: "Mantel Musim Dingin", slot: "body",    harga: 1200, ikon: "🧣", deskripsi: "Mantel tebal berbulu hangat." },
        { id: "body_grad",    nama: "Jubah Wisuda",        slot: "body",    harga: 1400, ikon: "🎓", deskripsi: "Jubah kelulusan sarjana sains." },
        { id: "body_festival",nama: "Seragam Festival",    slot: "body",    harga: 1600, ikon: "👘", deskripsi: "Pakaian meriah penuh warna festival." },

        // D. Kostum Lengkap (slot: "costume" — menggantikan pakaian biasa)
        { id: "cost_hero",    nama: "Superhero",           slot: "costume", harga: 2500, ikon: "🦸", deskripsi: "Jubah merah berkibar, pakaian pahlawan, dan lambang bintang." },
        { id: "cost_astro",   nama: "Astronaut",           slot: "costume", harga: 3000, ikon: "🧑‍🚀", deskripsi: "Baju antariksa dan helm transparan khusus bentuk kepala pet." },
        { id: "cost_knight",  nama: "Royal Knight",        slot: "costume", harga: 3500, ikon: "⚔️", deskripsi: "Zirah kesatria dekoratif, pelindung bahu, dan ornamen kerajaan." },
        { id: "cost_dino",    nama: "Dino Suit",           slot: "costume", harga: 2200, ikon: "🦖", deskripsi: "Kostum dinosaurus imut dengan tudung dan duri punggung." },
        { id: "cost_royal",   nama: "Royal Costume",       slot: "costume", harga: 4500, ikon: "🤴", deskripsi: "Jubah kerajaan beludru, aksen emas, dan permata berkilau." }
    ]
};

// =========================================================================
// 2. ARSITEKTUR DUAL-XP (XP TOTAL LEADERBOARD vs XP TERSEDIA BELANJA)
// =========================================================================

// Pastikan objek siswa di Leaderboard memiliki xp (XP Total), xpTersedia (Saldo Belanja), & myPetData
window.pastikanStrukturDualXPDanPet = function(uName) {
    let userKey = uName || sessionStorage.getItem("username");
    if (!userKey || !window.leaderboardSiswaData || !window.leaderboardSiswaData[userKey]) return null;

    let lb = window.leaderboardSiswaData[userKey];
    let currentTotal = Number(lb.xp) || 0;

    // Jika xpTotal belum pernah dicatat, samakan dengan xp saat ini
    if (typeof lb.xpTotal !== "number") {
        lb.xpTotal = currentTotal;
    }
    // Jika xp lebih besar dari xpTotal (misal baru dapat tambahan dari latihan), naikkan xpTotal
    if (currentTotal > lb.xpTotal) {
        lb.xpTotal = currentTotal;
    }
    // Pastikan lb.xp selalu bernilai XP Total agar Leaderboard tidak pernah turun saat siswa belanja!
    lb.xp = lb.xpTotal;

    // Jika xpTersedia belum pernah diinisialisasi, samakan dengan xpTotal dikurangi total pengeluaran
    if (typeof lb.xpTersedia !== "number") {
        let spent = Number(lb.xpSpentTotal) || 0;
        lb.xpTersedia = Math.max(0, lb.xpTotal - spent);
    }

    // Struktur dasar My Pet milik siswa
    if (!lb.myPetData || typeof lb.myPetData !== "object") {
        lb.myPetData = {
            habitatLevel: 0, // 0 = belum punya pet; otomatis jadi 1 (Starter Habitat Gratis) saat beli pet pertama
            activePetId: "",
            ownedPets: {},        // { kadal: { id, customName, hunger, mood, bondXp, bondLevel, lastUpdate, lastPetTime, lastPlayTime, outfit: { head, eyes, body, costume } } }
            foodInventory: {},    // { food_biscuit: 2, snack_kucing: 1 }
            ownedDecorations: [], // ["dec_bed", "dec_tree"]
            activeDecorations: [],
            ownedWardrobe: []     // ["head_bandana", "cost_hero"]
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

// Hook pada window.tambahXPSiswa agar setiap tambahan XP dari belajar menambah XP Total DAN XP Tersedia sekaligus
if (!window._hookedDualXPTambah && typeof window.tambahXPSiswa === "function") {
    window._hookedDualXPTambah = true;
    const _asliTambahXPSiswa = window.tambahXPSiswa;
    window.tambahXPSiswa = function(jumlahXP, aktivitas, arrSoal) {
        let uName = sessionStorage.getItem("username");
        let stat = sessionStorage.getItem("statusLogin");
        let tambahan = Number(jumlahXP) || 0;

        if (stat === "siswa" && uName) {
            window.pastikanStrukturDualXPDanPet(uName);
        }

        // Jalankan fungsi asli (menambah lb.xp dan menyimpan ke Firebase)
        _asliTambahXPSiswa(jumlahXP, aktivitas, arrSoal);

        if (stat === "siswa" && uName && window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) {
            let lb = window.leaderboardSiswaData[uName];
            lb.xpTotal = (Number(lb.xpTotal) || 0) + tambahan;
            lb.xpTersedia = (Number(lb.xpTersedia) || 0) + tambahan;
            lb.xp = lb.xpTotal; // Leaderboard tetap memakai XP Total
            if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
                window.simpanLeaderboardSiswaKeDB(uName, lb);
            }
            window.perbaruiTampilanSaldoXPPet();
        }
    };
}

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

window.pastikanUIMyPetAda = function() {
    // A. Tombol Melayang di Kiri Bawah
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

    // B. Modal Utama My Pet (4 Tab: Habitat, Pet Collection, Shop, Wardrobe)
    if (!document.getElementById("modal-my-pet")) {
        let modal = document.createElement("div");
        modal.id = "modal-my-pet";
        modal.className = "modal-overlay";
        modal.onclick = function(e) {
            if (e.target === modal) window.tutupModalMyPet();
        };

        modal.innerHTML =
            '<div class="modal-box mypet-modal-box">' +
                '<!-- HEADER MY PET + SALDO DUAL XP -->' +
                '<div class="mypet-header">' +
                    '<div style="display:flex; align-items:center; gap:10px;">' +
                        '<span style="font-size:24px;">🐾</span>' +
                        '<div>' +
                            '<h3 style="margin:0; color:#ffffff; font-size:17px; letter-spacing:0.3px;">My Pet Sanctuary</h3>' +
                            '<div style="font-size:11px; color:#cbd5e1;">Rawat hewan kesayanganmu dengan XP hasil belajar!</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">' +
                        '<div class="mypet-xp-pill" title="Saldo XP yang bisa dipakai belanja di My Pet (Tidak mengurangi skor Leaderboard)">' +
                            '<span style="font-size:10px; color:#fde047; font-weight:700; text-transform:uppercase;">XP Tersedia</span>' +
                            '<strong id="mypet-header-xp-tersedia" style="font-size:15px; color:#ffffff;">0 XP</strong>' +
                        '</div>' +
                        '<div class="mypet-xp-pill total-pill" title="Akumulasi XP Total untuk peringkat di Leaderboard">' +
                            '<span style="font-size:10px; color:#93c5fd; font-weight:700; text-transform:uppercase;">XP Total</span>' +
                            '<strong id="mypet-header-xp-total" style="font-size:13px; color:#e0f2fe;">0 XP</strong>' +
                        '</div>' +
                        '<button type="button" class="close-btn" style="color:#ffffff; font-size:20px; margin-left:4px;" onclick="window.tutupModalMyPet()">✕</button>' +
                    '</div>' +
                '</div>' +

                '<!-- BAR NAVIGASI 4 TAB INTERNAL -->' +
                '<div class="mypet-tabs-bar">' +
                    '<button type="button" id="tab-btn-mypet-habitat" class="mypet-tab-btn active" onclick="window.gantiTabMyPet(\'habitat\')">🏡 Habitat</button>' +
                    '<button type="button" id="tab-btn-mypet-collection" class="mypet-tab-btn" onclick="window.gantiTabMyPet(\'collection\')">🐾 Pet Collection</button>' +
                    '<button type="button" id="tab-btn-mypet-shop" class="mypet-tab-btn" onclick="window.gantiTabMyPet(\'shop\')">🛒 Shop</button>' +
                    '<button type="button" id="tab-btn-mypet-wardrobe" class="mypet-tab-btn" onclick="window.gantiTabMyPet(\'wardrobe\')">👗 Wardrobe</button>' +
                '</div>' +

                '<!-- ISI KONTEN 4 TAB -->' +
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

    if (elAvail) elAvail.innerText = (lb ? Number(lb.xpTersedia || 0).toLocaleString("id-ID") : "0") + " XP";
    if (elTotal) elTotal.innerText = (lb ? Number(lb.xpTotal || 0).toLocaleString("id-ID") : "0") + " XP";

    // Tampilkan tanda seru merah di tombol My Pet jika ada pet yang lapar (< 30) atau kritis
    if (dotHungry && lb && lb.myPetData && lb.myPetData.ownedPets) {
        let adaLapar = Object.values(lb.myPetData.ownedPets).some(function(p) {
            return p && Number(p.hunger) < 30;
        });
        dotHungry.style.display = adaLapar ? "flex" : "none";
    }

    // Sinkronkan juga tampilan di Modal Profil Siswa agar menampilkan XP Total & XP Tersedia
    let elProfilXp = document.getElementById("profil-total-xp");
    if (elProfilXp && lb) {
        elProfilXp.innerHTML = Number(lb.xpTotal || 0).toLocaleString("id-ID") + " XP" +
            '<div style="font-size:10px; font-weight:700; color:#d35400; font-family:\'Poppins\',sans-serif; margin-top:2px;">Saldo: ' + Number(lb.xpTersedia || 0).toLocaleString("id-ID") + ' XP</div>';
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

// Placeholder awal sebelum Tahap 2, 3, dan 4 dipasang
window.renderTabHabitatMyPet = window.renderTabHabitatMyPet || function() {
    let el = document.getElementById("mypet-view-habitat");
    if (el) el.innerHTML = '<div style="padding:30px; text-align:center; color:#475569; font-weight:bold;">🏡 Mesin Pondasi Habitat & Dual-XP Siap! Lanjutkan ke Tahap 2 & 3 untuk merender animasi 2.5D dan panggung Habitat.</div>';
};
window.renderTabCollectionMyPet = window.renderTabCollectionMyPet || function() {
    let el = document.getElementById("mypet-view-collection");
    if (el) el.innerHTML = '<div style="padding:30px; text-align:center; color:#475569; font-weight:bold;">🐾 Katalog 7 Spesies Pet Siap!</div>';
};
window.renderTabShopMyPet = window.renderTabShopMyPet || function() {
    let el = document.getElementById("mypet-view-shop");
    if (el) el.innerHTML = '<div style="padding:30px; text-align:center; color:#475569; font-weight:bold;">🛒 Database Harga Pet, Upgrade Kandang, Makanan, & Kostum Siap!</div>';
};
window.renderTabWardrobeMyPet = window.renderTabWardrobeMyPet || function() {
    let el = document.getElementById("mypet-view-wardrobe");
    if (el) el.innerHTML = '<div style="padding:30px; text-align:center; color:#475569; font-weight:bold;">👗 Database 22 Item Wardrobe Siap!</div>';
};

// Hubungkan Border Shop lama agar juga memotong XP Tersedia (bukan XP Total Leaderboard)
window.beliBorderDiShop = function(borderId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let item = window.cariDataBorderById(borderId);
    if (!item) return;

    if (!Array.isArray(lb.ownedBorders)) {
        lb.ownedBorders = lb.ownedBorders ? Object.values(lb.ownedBorders) : [];
    }
    if (lb.ownedBorders.includes(borderId)) {
        window.pasangBorderProfil(borderId);
        return;
    }

    let saldo = window.ambilXPTersediaSiswa(uName);
    if (saldo < item.harga) {
        let kurang = (item.harga - saldo).toLocaleString('id-ID');
        return alert("⚠️ Saldo XP Tersedia kamu belum cukup untuk membeli bingkai " + item.nama + "!\n\nHarga: " + item.harga.toLocaleString('id-ID') + " XP\nXP Tersedia: " + saldo.toLocaleString('id-ID') + " XP\n(Kurang " + kurang + " XP lagi)");
    }

    if (!confirm("Beli bingkai \"" + item.nama + "\" (" + item.tier + ") seharga " + item.harga.toLocaleString('id-ID') + " XP?\n\nHanya XP Tersedia yang berkurang, sedangkan XP Total di Leaderboard tetap utuh!")) {
        return;
    }

    if (window.gunakanXPTersediaSiswa(item.harga, "beli_border_" + borderId)) {
        lb.ownedBorders.push(borderId);
        lb.equippedBorder = borderId;
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.bukaModalProfilSiswa();
        window.renderIsiShopBorder(window.activeShopTier);
        window.perbaruiUIHeaderProfilSiswa();
        alert("🎉 Selamat! Kamu berhasil membeli dan memasang bingkai \"" + item.nama + "\"!");
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

// 1. GENERATOR SVG KARTUN 2.5D CHIBI (KANVAS 512 x 512 PX)
window.bangunVisualPet25DSVG = function(petId, outfit, animState, ukuranPx) {
    let catPet = window.MY_PET_CATALOG.pets.find(function(p) { return p.id === petId; }) || window.MY_PET_CATALOG.pets[0];
    let eq = outfit || {};
    let state = animState || "idle";
    let size = ukuranPx || 120;

    // Skala proporsi tubuh visual berdasarkan spesies di dalam kanvas 512x512 (Gajah > Beruang > Naga > Anjing > Kucing > Kadal)
    let spScale = catPet.scale || 1.0;
    let translateY = Math.round((1 - spScale) * 210);

    // Palet warna 2.5D tiap spesies
    let palet = {
        kadal:   { main: "#4ade80", dark: "#16a34a", belly: "#dcfce7", cheek: "#fb7185", accent: "#15803d" },
        kucing:  { main: "#fb923c", dark: "#ea580c", belly: "#ffedd5", cheek: "#f43f5e", accent: "#9a3412" },
        anjing:  { main: "#d97706", dark: "#92400e", belly: "#fef3c7", cheek: "#fb7185", accent: "#78350f" },
        monyet:  { main: "#a16207", dark: "#713f12", belly: "#fde68a", cheek: "#f43f5e", accent: "#fef08a" },
        beruang: { main: "#78350f", dark: "#451a03", belly: "#fde68a", cheek: "#fb7185", accent: "#b45309" },
        gajah:   { main: "#94a3b8", dark: "#475569", belly: "#e2e8f0", cheek: "#f472b6", accent: "#cbd5e1" },
        naga:    { main: "#ef4444", dark: "#991b1b", belly: "#fde047", cheek: "#fb923c", accent: "#f59e0b" }
    }[petId] || { main: "#60a5fa", dark: "#2563eb", belly: "#dbeafe", cheek: "#fb7185", accent: "#1d4ed8" };

    // A. LAYER BELAKANG (Ekor, Sayap, Jubah Kostum)
    let backLayer = "";
    if (eq.costume === "cost_hero") {
        // Jubah Superhero Merah
        backLayer += '<path class="pet-cape-part" d="M165,260 L105,435 L407,435 L347,260 Z" fill="#dc2626" stroke="#991b1b" stroke-width="6"/>';
    } else if (eq.costume === "cost_royal") {
        // Jubah Kerajaan Beludru & Emas
        backLayer += '<path class="pet-cape-part" d="M150,255 L95,442 L417,442 L362,255 Z" fill="#7e22ce" stroke="#facc15" stroke-width="8"/>';
    }

    // Ekor & Sayap Spesies
    if (petId === "naga") {
        // Sayap Naga Kiri & Kanan + Ekor Api
        backLayer +=
            '<g class="pet-wing-left"><path d="M175,275 C95,210 60,255 85,325 C115,310 145,320 175,315 Z" fill="#f97316" stroke="#991b1b" stroke-width="6"/></g>' +
            '<g class="pet-wing-right"><path d="M337,275 C417,210 452,255 427,325 C397,310 367,320 337,315 Z" fill="#f97316" stroke="#991b1b" stroke-width="6"/></g>' +
            '<g class="pet-tail-part"><path d="M330,390 Q425,405 435,340" fill="none" stroke="' + palet.main + '" stroke-width="26" stroke-linecap="round"/>' +
            '<path d="M435,340 C450,310 475,335 450,360 C435,370 420,355 435,340 Z" fill="#facc15" stroke="#ea580c" stroke-width="4"/></g>';
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

    // Duri Dino Suit di Punggung jika memakai Dino Suit
    if (eq.costume === "cost_dino") {
        backLayer += '<polygon points="150,240 120,255 155,275" fill="#facc15"/><polygon points="145,295 112,315 152,330" fill="#facc15"/>';
    }

    // B. TELINGA / TANDUK SPESIES (Di Belakang Kepala)
    let earsLayer = "";
    if (petId === "kucing") {
        earsLayer =
            '<g class="pet-ear-left"><polygon points="155,175 135,85 215,130" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/><polygon points="162,162 148,105 202,135" fill="#fda4af"/></g>' +
            '<g class="pet-ear-right"><polygon points="357,175 377,85 297,130" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/><polygon points="350,162 364,105 310,135" fill="#fda4af"/></g>';
    } else if (petId === "anjing") {
        earsLayer =
            '<g class="pet-ear-left"><ellipse cx="140" cy="185" rx="34" ry="62" transform="rotate(18 140 185)" fill="' + palet.dark + '"/></g>' +
            '<g class="pet-ear-right"><ellipse cx="372" cy="185" rx="34" ry="62" transform="rotate(-18 372 185)" fill="' + palet.dark + '"/></g>';
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
    } else if (petId === "naga") {
        earsLayer =
            '<g class="pet-ear-left"><path d="M175,125 Q135,55 190,75 Q205,95 205,120 Z" fill="#facc15" stroke="#b45309" stroke-width="5"/></g>' +
            '<g class="pet-ear-right"><path d="M337,125 Q377,55 322,75 Q307,95 307,120 Z" fill="#facc15" stroke="#b45309" stroke-width="5"/></g>';
    } else if (petId === "kadal") {
        earsLayer =
            '<path d="M235,98 L256,68 L277,98 Z" fill="#16a34a"/>';
    }

    // C. TUBUH & PERUT 2.5D CHIBI
    let bodyLayer =
        '<ellipse cx="256" cy="355" rx="95" ry="88" fill="url(#gradBody_' + petId + ')" stroke="' + palet.dark + '" stroke-width="6"/>' +
        '<ellipse cx="256" cy="362" rx="62" ry="62" fill="' + palet.belly + '"/>';

    if (petId === "naga" || petId === "kadal") {
        // Garis sisik perut naga/kadal
        bodyLayer +=
            '<line x1="205" y1="340" x2="307" y2="340" stroke="' + palet.accent + '" stroke-width="3" opacity="0.45"/>' +
            '<line x1="200" y1="365" x2="312" y2="365" stroke="' + palet.accent + '" stroke-width="3" opacity="0.45"/>' +
            '<line x1="210" y1="390" x2="302" y2="390" stroke="' + palet.accent + '" stroke-width="3" opacity="0.45"/>';
    }

    // D. LAYER PAKAIAN ATAU KOSTUM LENGKAP DI TUBUH
    let clothesLayer = "";
    let activeBodyId = eq.costume || eq.body || "";

    if (activeBodyId === "body_tshirt") {
        clothesLayer = '<path d="M163,315 Q256,335 349,315 L342,395 Q256,410 170,395 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="4"/>' +
                       '<circle cx="256" cy="358" r="14" fill="#fef08a"/>';
    } else if (activeBodyId === "body_hoodie") {
        clothesLayer = '<path d="M160,305 Q256,325 352,305 L346,405 Q256,420 166,405 Z" fill="#f97316" stroke="#c2410c" stroke-width="4"/>' +
                       '<path d="M215,365 L297,365 L288,402 L224,402 Z" fill="#ea580c"/>' +
                       '<line x1="240" y1="315" x2="240" y2="350" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>' +
                       '<line x1="272" y1="315" x2="272" y2="350" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>';
    } else if (activeBodyId === "body_labcoat") {
        clothesLayer = '<path d="M160,305 Q256,325 352,305 L348,412 L272,412 L272,320 L240,320 L240,412 L164,412 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>' +
                       '<polygon points="240,315 215,355 240,365" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>' +
                       '<polygon points="272,315 297,355 272,365" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>' +
                       '<rect x="285" y="355" width="26" height="28" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
                       '<line x1="293" y1="348" x2="293" y2="360" stroke="#ef4444" stroke-width="4"/>';
    } else if (activeBodyId === "body_explorer") {
        clothesLayer = '<path d="M162,310 Q256,330 350,310 L345,405 Q256,418 167,405 Z" fill="#d97706" stroke="#78350f" stroke-width="4"/>' +
                       '<rect x="190" y="350" width="34" height="32" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2"/>' +
                       '<rect x="288" y="350" width="34" height="32" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2"/>';
    } else if (activeBodyId === "body_winter") {
        clothesLayer = '<path d="M158,305 Q256,325 354,305 L348,410 Q256,422 164,410 Z" fill="#0284c7" stroke="#0369a1" stroke-width="4"/>' +
                       '<rect x="155" y="292" width="202" height="24" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>';
    } else if (activeBodyId === "body_grad") {
        clothesLayer = '<path d="M158,305 Q256,325 354,305 L350,415 L162,415 Z" fill="#1e293b" stroke="#0f172a" stroke-width="4"/>' +
                       '<path d="M210,310 L256,365 L302,310" fill="none" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>';
    } else if (activeBodyId === "body_festival") {
        clothesLayer = '<path d="M160,308 Q256,328 352,308 L346,410 Q256,422 166,410 Z" fill="#e11d48" stroke="#9f1239" stroke-width="4"/>' +
                       '<path d="M166,375 L346,375" stroke="#facc15" stroke-width="10"/>';
    } else if (activeBodyId === "cost_hero") {
        clothesLayer = '<path d="M160,305 Q256,325 352,305 L345,408 Q256,422 167,408 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="4"/>' +
                       '<path d="M166,388 L346,388" stroke="#facc15" stroke-width="12"/>' +
                       '<polygon points="256,330 264,348 284,348 268,360 274,378 256,366 238,378 244,360 228,348 248,348" fill="#facc15" stroke="#b45309" stroke-width="2"/>';
    } else if (activeBodyId === "cost_astro") {
        clothesLayer = '<path d="M156,302 Q256,322 356,302 L350,412 Q256,426 162,412 Z" fill="#f8fafc" stroke="#64748b" stroke-width="5"/>' +
                       '<rect x="218" y="335" width="76" height="46" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>' +
                       '<circle cx="238" cy="358" r="8" fill="#ef4444"/><circle cx="262" cy="358" r="8" fill="#22c55e"/><circle cx="282" cy="358" r="6" fill="#3b82f6"/>';
    } else if (activeBodyId === "cost_knight") {
        clothesLayer = '<path d="M156,302 Q256,325 356,302 L348,412 Q256,426 164,412 Z" fill="#94a3b8" stroke="#334155" stroke-width="5"/>' +
                       '<ellipse cx="162" cy="318" rx="26" ry="18" fill="#cbd5e1" stroke="#334155" stroke-width="4"/>' +
                       '<ellipse cx="350" cy="318" rx="26" ry="18" fill="#cbd5e1" stroke="#334155" stroke-width="4"/>' +
                       '<polygon points="256,328 278,360 256,392 234,360" fill="#facc15" stroke="#b45309" stroke-width="3"/>';
    } else if (activeBodyId === "cost_dino") {
        clothesLayer = '<path d="M158,302 Q256,322 354,302 L348,412 Q256,426 164,412 Z" fill="#22c55e" stroke="#15803d" stroke-width="5"/>' +
                       '<ellipse cx="256" cy="365" rx="52" ry="44" fill="#fef08a"/>';
    } else if (activeBodyId === "cost_royal") {
        clothesLayer = '<path d="M158,302 Q256,325 354,302 L348,414 Q256,426 164,414 Z" fill="#b91c1c" stroke="#facc15" stroke-width="5"/>' +
                       '<rect x="156" y="294" width="200" height="20" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>' +
                       '<circle cx="256" cy="352" r="14" fill="#38bdf8" stroke="#facc15" stroke-width="4"/>';
    }

    // E. TANGAN & KAKI CHIBI
    let limbsLayer =
        '<ellipse cx="162" cy="340" rx="24" ry="18" transform="rotate(-20 162 340)" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5"/>' +
        '<ellipse cx="350" cy="340" rx="24" ry="18" transform="rotate(20 350 340)" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5"/>' +
        '<ellipse cx="205" cy="432" rx="30" ry="18" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5"/>' +
        '<ellipse cx="307" cy="432" rx="30" ry="18" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5"/>';

    // F. KEPALA & WAJAH 2.5D
    let headLayer = '<g class="pet-head-group">' + earsLayer;

    // Tudung Dino jika memakai Dino Suit
    if (eq.costume === "cost_dino") {
        headLayer += '<ellipse cx="256" cy="195" rx="122" ry="108" fill="#22c55e" stroke="#15803d" stroke-width="6"/>' +
                     '<polygon points="256,65 240,92 272,92" fill="#facc15"/>';
    }

    headLayer += '<ellipse cx="256" cy="198" rx="112" ry="96" fill="url(#gradHead_' + petId + ')" stroke="' + palet.dark + '" stroke-width="6"/>';

    // Bercak wajah khusus monyet / anjing / beruang
    if (petId === "monyet") {
        headLayer += '<ellipse cx="256" cy="212" rx="86" ry="68" fill="#fef3c7"/>';
    } else if (petId === "beruang" || petId === "anjing") {
        headLayer += '<ellipse cx="256" cy="222" rx="42" ry="30" fill="' + palet.belly + '"/>';
    }

    // Pipi merona (Blush)
    headLayer +=
        '<ellipse cx="178" cy="218" rx="18" ry="10" fill="' + palet.cheek + '" opacity="0.55"/>' +
        '<ellipse cx="334" cy="218" rx="18" ry="10" fill="' + palet.cheek + '" opacity="0.55"/>';

    // G. EKSPRESI MATA & MULUT SESUAI 5 STATE ANIMASI
    let eyesMouthLayer = "";
    if (state === "happy") {
        // Mata melengkung gembira (^ ^) & mulut tertawa lebar
        eyesMouthLayer =
            '<path d="M188,190 Q205,168 222,190" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M290,190 Q307,168 324,190" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M232,222 Q256,252 280,222 Z" fill="#ef4444" stroke="#0f172a" stroke-width="5"/>';
    } else if (state === "eating") {
        // Mata berbinar & mulut mengunyah + ikon makanan
        eyesMouthLayer =
            '<circle cx="205" cy="188" r="16" fill="#0f172a"/><circle cx="200" cy="182" r="6" fill="#ffffff"/>' +
            '<circle cx="307" cy="188" r="16" fill="#0f172a"/><circle cx="302" cy="182" r="6" fill="#ffffff"/>' +
            '<ellipse class="pet-mouth-chew" cx="256" cy="232" rx="20" ry="16" fill="#ef4444" stroke="#0f172a" stroke-width="5"/>';
    } else if (state === "sleepy") {
        // Mata terpejam mengantuk & gelembung tidur
        eyesMouthLayer =
            '<path d="M188,192 Q205,204 222,192" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>' +
            '<path d="M290,192 Q307,204 324,192" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>' +
            '<circle cx="256" cy="232" r="9" fill="#fda4af" stroke="#0f172a" stroke-width="4"/>';
    } else if (state === "hungry" || state === "critical") {
        // Mata sayu/sedih & mulut melengkung turun
        eyesMouthLayer =
            '<circle cx="205" cy="192" r="15" fill="#0f172a"/><circle cx="200" cy="187" r="5" fill="#ffffff"/>' +
            '<circle cx="307" cy="192" r="15" fill="#0f172a"/><circle cx="302" cy="187" r="5" fill="#ffffff"/>' +
            '<line x1="185" y1="170" x2="222" y2="178" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>' +
            '<line x1="327" y1="170" x2="290" y2="178" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>' +
            '<path d="M236,238 Q256,222 276,238" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>';
    } else {
        // IDLE: Mata ekspresif berkedip alami & senyum manis
        eyesMouthLayer =
            '<g class="pet-eyes-blink">' +
                '<circle cx="205" cy="188" r="17" fill="#0f172a"/><circle cx="199" cy="181" r="6.5" fill="#ffffff"/><circle cx="211" cy="194" r="3" fill="#ffffff"/>' +
                '<circle cx="307" cy="188" r="17" fill="#0f172a"/><circle cx="301" cy="181" r="6.5" fill="#ffffff"/><circle cx="313" cy="194" r="3" fill="#ffffff"/>' +
            '</g>' +
            '<path d="M238,224 Q256,238 274,224" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>';
    }

    // Hidung / Belalai Gajah / Kumis Kucing
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
    }

    headLayer += eyesMouthLayer + noseLayer;

    // H. LAYER KACAMATA & AKSESORI WAJAH (slot: "eyes")
    if (eq.eyes === "eyes_round") {
        headLayer +=
            '<circle cx="205" cy="188" r="26" fill="rgba(56,189,248,0.18)" stroke="#0f172a" stroke-width="5"/>' +
            '<circle cx="307" cy="188" r="26" fill="rgba(56,189,248,0.18)" stroke="#0f172a" stroke-width="5"/>' +
            '<line x1="231" y1="188" x2="281" y2="188" stroke="#0f172a" stroke-width="5"/>';
    } else if (eq.eyes === "eyes_star") {
        headLayer +=
            '<polygon points="205,156 213,174 233,176 218,190 222,210 205,199 188,210 192,190 177,176 197,174" fill="rgba(250,204,21,0.45)" stroke="#ca8a04" stroke-width="4"/>' +
            '<polygon points="307,156 315,174 335,176 320,190 324,210 307,199 290,210 294,190 279,176 299,174" fill="rgba(250,204,21,0.45)" stroke="#ca8a04" stroke-width="4"/>' +
            '<line x1="230" y1="185" x2="282" y2="185" stroke="#ca8a04" stroke-width="4"/>';
    } else if (eq.eyes === "eyes_goggles") {
        headLayer +=
            '<rect x="165" y="164" width="182" height="44" rx="18" fill="#78350f" stroke="#451a03" stroke-width="4"/>' +
            '<circle cx="205" cy="186" r="22" fill="#38bdf8" stroke="#facc15" stroke-width="5" opacity="0.8"/>' +
            '<circle cx="307" cy="186" r="22" fill="#38bdf8" stroke="#facc15" stroke-width="5" opacity="0.8"/>';
    } else if (eq.eyes === "eyes_monocle") {
        headLayer +=
            '<circle cx="307" cy="188" r="27" fill="rgba(254,240,138,0.28)" stroke="#eab308" stroke-width="6"/>' +
            '<path d="M332,202 Q345,245 330,275" fill="none" stroke="#eab308" stroke-width="3" stroke-dasharray="4,4"/>';
    } else if (eq.eyes === "eyes_halo") {
        headLayer +=
            '<ellipse cx="256" cy="64" rx="58" ry="14" fill="none" stroke="#fde047" stroke-width="9"/>' +
            '<ellipse cx="256" cy="64" rx="58" ry="14" fill="none" stroke="#ffffff" stroke-width="3"/>';
    }

    // I. LAYER TOPI / AKSESORI KEPALA (slot: "head") ATAU HELM ASTRONAUT
    if (eq.costume === "cost_astro") {
        // Helm kaca antariksa transparan menyesuaikan kepala pet
        headLayer +=
            '<circle cx="256" cy="192" r="134" fill="rgba(186,230,253,0.22)" stroke="#cbd5e1" stroke-width="10"/>' +
            '<path d="M165,125 Q210,90 275,105" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.75"/>';
    } else if (eq.head === "head_bandana") {
        headLayer +=
            '<path d="M150,148 Q256,172 362,148 L355,122 Q256,144 157,122 Z" fill="#ef4444" stroke="#991b1b" stroke-width="4"/>' +
            '<circle cx="256" cy="145" r="6" fill="#ffffff"/>';
    } else if (eq.head === "head_casual") {
        headLayer +=
            '<path d="M172,125 C172,68 340,68 340,125 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="5"/>' +
            '<path d="M165,122 Q256,134 388,125 Q365,142 165,130 Z" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="4"/>';
    } else if (eq.head === "head_flower") {
        headLayer +=
            '<circle cx="190" cy="112" r="14" fill="#f472b6"/><circle cx="190" cy="112" r="5" fill="#facc15"/>' +
            '<circle cx="222" cy="104" r="15" fill="#fb7185"/><circle cx="222" cy="104" r="5" fill="#ffffff"/>' +
            '<circle cx="256" cy="100" r="16" fill="#facc15"/><circle cx="256" cy="100" r="6" fill="#ea580c"/>' +
            '<circle cx="290" cy="104" r="15" fill="#a855f7"/><circle cx="290" cy="104" r="5" fill="#fef08a"/>' +
            '<circle cx="322" cy="112" r="14" fill="#4ade80"/><circle cx="322" cy="112" r="5" fill="#ffffff"/>';
    } else if (eq.head === "head_wizard") {
        headLayer +=
            '<ellipse cx="256" cy="118" rx="98" ry="20" fill="#4c1d95" stroke="#2e1065" stroke-width="5"/>' +
            '<polygon points="188,116 256,14 324,116" fill="#6d28d9" stroke="#2e1065" stroke-width="5" stroke-linejoin="round"/>' +
            '<path d="M196,105 Q256,118 316,105" fill="none" stroke="#facc15" stroke-width="8"/>';
    } else if (eq.head === "head_crown") {
        headLayer +=
            '<polygon points="190,115 182,58 220,88 256,46 292,88 330,58 322,115" fill="#facc15" stroke="#b45309" stroke-width="5" stroke-linejoin="round"/>' +
            '<circle cx="256" cy="88" r="8" fill="#ef4444"/><circle cx="212" cy="96" r="6" fill="#38bdf8"/><circle cx="300" cy="96" r="6" fill="#22c55e"/>';
    }

    headLayer += '</g>'; // Tutup .pet-head-group

    // J. IKON EFEK TAMBAHAN DI ATAS PET (Lapar, Kritis, Mengantuk, Senang)
    let statusBubble = "";
    if (state === "hungry") {
        statusBubble = '<g class="pet-status-float"><circle cx="405" cy="105" r="36" fill="#ffffff" stroke="#f59e0b" stroke-width="4"/><text x="405" y="118" font-size="36" text-anchor="middle">🍖</text></g>';
    } else if (state === "critical") {
        statusBubble = '<g class="pet-status-float"><circle cx="405" cy="105" r="38" fill="#fee2e2" stroke="#dc2626" stroke-width="5"/><text x="405" y="118" font-size="36" text-anchor="middle">🆘</text></g>';
    } else if (state === "happy") {
        statusBubble = '<g class="pet-status-float"><text x="400" y="105" font-size="40" text-anchor="middle">💖</text></g>';
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
                '<!-- Bayangan Lantai 2.5D -->' +
                '<ellipse class="pet-ground-shadow" cx="256" cy="455" rx="' + Math.round(92 * spScale) + '" ry="20" fill="rgba(15,23,42,0.22)"/>' +
                '<!-- Proporsi Spesies -->' +
                '<g transform="translate(0, ' + translateY + ') scale(' + spScale + ')" style="transform-origin: 256px 256px;">' +
                    '<g class="pet-whole-body">' +
                        backLayer +
                        bodyLayer +
                        clothesLayer +
                        limbsLayer +
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
window.renderTabHabitatMyPet = function() {
    let container = document.getElementById("mypet-view-habitat");
    if (!container) return;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    window.sinkronkanWaktuLaparSemuaPet(uName);
    let petData = lb.myPetData;
    let ownedIds = Object.keys(petData.ownedPets || {});

    // JIKA SISWA BELUM MEMILIKI PET SAMA SEKALI
    if (ownedIds.length === 0) {
        container.innerHTML =
            '<div style="background:white; border:2px dashed #cbd5e1; border-radius:16px; padding:40px 20px; text-align:center;">' +
                '<div style="font-size:64px; margin-bottom:10px;">🥚</div>' +
                '<h3 style="margin:0 0 8px 0; color:#0b3954; font-size:20px;">Kandangmu Masih Kosong!</h3>' +
                '<p style="margin:0 auto 20px auto; max-width:460px; font-size:13px; color:#64748b; line-height:1.6;">' +
                    'Kamu memiliki <b>' + Number(lb.xpTersedia || 0).toLocaleString("id-ID") + ' XP Tersedia</b>. ' +
                    'Yuk adopsi hewan pertamamu di <b>Shop</b>! Saat membeli pet pertama, <b>Starter Habitat (Lv. 1)</b> akan terbuka secara gratis!' +
                '</p>' +
                '<button type="button" class="btn-action" style="background:#16a085; width:auto; padding:11px 28px; border-radius:30px; font-size:14px; font-weight:800;" onclick="window.gantiTabMyPet(\'shop\')">🛒 Pergi ke Shop & Adopsi Pet</button>' +
            '</div>';
        return;
    }

    // Pastikan ada activePetId yang valid
    if (!petData.activePetId || !petData.ownedPets[petData.activePetId]) {
        petData.activePetId = ownedIds[0];
    }
    if (!petData.habitatLevel || petData.habitatLevel < 1) {
        petData.habitatLevel = 1;
    }

    let activeId = petData.activePetId;
    let activePet = petData.ownedPets[activeId];
    let catActive = window.MY_PET_CATALOG.pets.find(function(p) { return p.id === activeId; }) || window.MY_PET_CATALOG.pets[0];
    let habCfg = window.MY_PET_CATALOG.habitats.find(function(h) { return h.level === petData.habitatLevel; }) || window.MY_PET_CATALOG.habitats[0];

    let hungerVal = Math.max(0, Math.min(100, Math.round(Number(activePet.hunger) || 0)));
    let moodVal = Math.max(0, Math.min(100, Math.round(Number(activePet.mood) || 0)));
    let infoLapar = window.dapatkanInfoStatusLaparPet(hungerVal);
    let infoBond = window.hitungLevelBondPet(activePet.bondXp || 0);

    // A. Susun Ornamen Latar Habitat & Dekorasi Aktif
    let decorHtml = '';
    let activeDecs = Array.isArray(petData.activeDecorations) ? petData.activeDecorations : [];
    activeDecs.forEach(function(decId) {
        let decCfg = window.MY_PET_CATALOG.decorations.find(function(d) { return d.id === decId; });
        if (decCfg) {
            decorHtml +=
                '<div class="mypet-decor-item" style="left:' + decCfg.posX + '; top:' + decCfg.posY + ';" title="' + decCfg.nama + '">' +
                    '<span>' + decCfg.ikon + '</span>' +
                '</div>';
        }
    });

    // B. Susun Semua Pet yang Dimiliki di Panggung Habitat (Ukuran 78-128 px)
    let stagePetsHtml = '';
    ownedIds.forEach(function(pid, idx) {
        let pObj = petData.ownedPets[pid];
        let pCat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === pid; }) || window.MY_PET_CATALOG.pets[0];
        let pLapar = window.dapatkanInfoStatusLaparPet(pObj.hunger);
        let isMain = (pid === activeId);

        // Sebarkan posisi pet di halaman habitat agar tidak menumpuk
        let posLeft = 50;
        let posBottom = 18;
        if (!isMain) {
            let slotOffsets = [18, 82, 30, 70, 12, 88, 38];
            posLeft = slotOffsets[idx % slotOffsets.length];
            posBottom = (idx % 2 === 0) ? 24 : 14;
        }

        let ukuranDiHabitat = isMain ? 118 : 86;
        let svgPet = window.bangunVisualPet25DSVG(pid, pObj.outfit || {}, pLapar.animState, ukuranDiHabitat);

        stagePetsHtml +=
            '<div class="mypet-stage-actor-wrap ' + (isMain ? 'is-active-pet' : 'is-companion-pet') + '" ' +
                 'style="left:' + posLeft + '%; bottom:' + posBottom + 'px;" ' +
                 'onclick="window.interaksiKlikPetDiHabitat(\'' + pid + '\')" ' +
                 'title="Klik untuk berinteraksi dengan ' + (pObj.customName || pCat.namaDefault) + '">' +
                svgPet +
                '<div class="mypet-stage-nametag">' +
                    (isMain ? '⭐ ' : '') + (pObj.customName || pCat.namaDefault) +
                '</div>' +
            '</div>';
    });

    // C. Wadah Makanan di Sudut Kanan Bawah Habitat
    let foodBowlIcon = hungerVal < 25 ? '🥣' : '🍲';

    // D. Laci Pilihan Makanan (Muncul saat tombol "Beri Makan" ditekan)
    let laciMakanHtml = '';
    if (window.bukaLaciMakanHabitat) {
        let inv = petData.foodInventory || {};
        let semuaMakanan = [...window.MY_PET_CATALOG.foods, ...window.MY_PET_CATALOG.snacks];
        let stokAda = semuaMakanan.filter(function(f) { return (Number(inv[f.id]) || 0) > 0; });

        if (stokAda.length === 0) {
            laciMakanHtml =
                '<div class="mypet-feed-drawer">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">' +
                        '<strong style="font-size:13px; color:#0b3954;">🍽️ Pilih Makanan dari Inventaris</strong>' +
                        '<button type="button" onclick="window.toggleLaciMakanHabitat(false)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:#64748b;">✕</button>' +
                    '</div>' +
                    '<div style="text-align:center; padding:12px; color:#64748b; font-size:12px;">' +
                        'Stok makananmu sedang habis! Yuk beli makanan atau camilan favorit di Shop.' +
                        '<div style="margin-top:8px;"><button type="button" class="btn-action" style="background:#e67e22; width:auto; padding:6px 16px; font-size:11px;" onclick="window.gantiTabMyPet(\'shop\')">🛒 Beli Makanan di Shop</button></div>' +
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
                        '<strong style="font-size:13px; color:#0b3954;">🍽️ Pilih Makanan untuk ' + (activePet.customName || catActive.namaDefault) + ':</strong>' +
                        '<button type="button" onclick="window.toggleLaciMakanHabitat(false)" style="background:none; border:none; cursor:pointer; font-weight:bold; color:#64748b;">✕ Tutup</button>' +
                    '</div>' +
                    '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(190px, 1fr)); gap:8px;">' + itemsHtml + '</div>' +
                '</div>';
        }
    }

    // E. Peringatan Merah jika Pet dalam Kondisi Kritis (Kenyang = 0)
    let bannerKritis = '';
    if (infoLapar.isKritis) {
        bannerKritis =
            '<div style="background:#fee2e2; border:2px solid #dc2626; color:#991b1b; padding:10px 14px; border-radius:10px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; gap:10px; font-size:12px; font-weight:700;">' +
                '<span>🆘 <b>PERINGATAN KRITIS:</b> ' + (activePet.customName || catActive.namaDefault) + ' sangat lemas karena kelaparan (0/100)! Segera beri makan untuk memulihkannya!</span>' +
                '<button type="button" class="btn-action" style="background:#dc2626; width:auto; padding:6px 12px; font-size:11px; white-space:nowrap;" onclick="window.toggleLaciMakanHabitat(true)">🍖 Pulihkan Sekarang</button>' +
            '</div>';
    }

    // F. Susun Kartu Detail Pet Aktif (Sesuai Desain Konsep: Avatar 140-200px, Nama, Spesies · Bond Lv, Bar Kenyang, Bar Mood, & Tombol Aksi)
    let detailActorSvg = window.bangunVisualPet25DSVG(activeId, activePet.outfit || {}, infoLapar.animState, 155);

    container.innerHTML =
        bannerKritis +
        '<!-- INFO BAR HABITAT LEVEL & KAPASITAS -->' +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">' +
            '<div style="display:flex; align-items:center; gap:8px;">' +
                '<span style="background:#0b3954; color:#f1c40f; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:800;">🏡 Lv.' + habCfg.level + ' ' + habCfg.nama + '</span>' +
                '<span style="background:#ffffff; border:1px solid #cbd5e1; color:#334155; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700;">🐾 Kapasitas: ' + ownedIds.length + ' / ' + habCfg.kapasitas + ' Pet</span>' +
            '</div>' +
            '<div style="font-size:11px; color:#64748b; font-weight:600;">💡 Tips: Klik langsung hewan di kandang untuk menyapanya!</div>' +
        '</div>' +

        '<!-- PANGGUNG VISUAL HABITAT (TINGGI DESKTOP 280-360PX, HP 220-300PX) -->' +
        '<div id="mypet-habitat-stage" class="mypet-habitat-stage ' + habCfg.temaCss + '">' +
            '<div class="mypet-hab-sky-ornament"></div>' +
            '<div class="mypet-hab-ground"></div>' +
            decorHtml +
            stagePetsHtml +
            '<div class="mypet-food-bowl" onclick="window.toggleLaciMakanHabitat(true)" title="Wadah Makanan (Klik untuk memberi makan)">' +
                '<span>' + foodBowlIcon + '</span>' +
            '</div>' +
            '<div id="mypet-interaction-toast" class="mypet-interaction-toast" style="display:none;"></div>' +
        '</div>' +

        laciMakanHtml +

        '<!-- KARTU UTAMA DETAIL & INTERAKSI PET AKTIF -->' +
        '<div class="mypet-detail-card">' +
            '<!-- Kiri: Pratinjau Besar Pet Aktif (140-200px) -->' +
            '<div id="mypet-detail-preview-box" class="mypet-detail-avatar-box" onclick="window.interaksiKlikPetDiHabitat(\'' + activeId + '\')">' +
                detailActorSvg +
                '<span style="font-size:10px; font-weight:800; padding:3px 10px; border-radius:12px; background:' + infoLapar.bg + '; color:' + infoLapar.warna + '; margin-top:4px;">' +
                    infoLapar.status + ' • ' + infoLapar.respons +
                '</span>' +
            '</div>' +

            '<!-- Kanan: Identitas, Bar Kenyang/Mood, & Tombol Aksi -->' +
            '<div class="mypet-detail-info-box">' +
                '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; flex-wrap:wrap;">' +
                    '<div>' +
                        '<div style="display:flex; align-items:center; gap:8px;">' +
                            '<h3 style="margin:0; font-size:22px; color:#0f172a; font-weight:900;">' + (activePet.customName || catActive.namaDefault) + '</h3>' +
                            '<button type="button" onclick="window.gantiNamaPetAktif()" style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:3px 8px; font-size:11px; font-weight:700; color:#334155; cursor:pointer;" title="Ganti Nama Pet">✏️ Nama</button>' +
                        '</div>' +
                        '<div style="font-size:13px; font-weight:700; color:#64748b; margin-top:2px;">' +
                            '<span style="color:' + catActive.warnaRarity + '; background:' + catActive.bgRarity + '; padding:1px 8px; border-radius:8px; font-size:11px; font-weight:800;">' + catActive.spesies + ' (' + catActive.rarity + ')</span>' +
                            ' · <span style="color:#d97706; font-weight:800;">❤️ Bond Lv. ' + infoBond.level + '</span> <span style="font-size:11px; color:#94a3b8;">(' + infoBond.current + '/100)</span>' +
                        '</div>' +
                    '</div>' +
                    (ownedIds.length > 1 ? '<button type="button" onclick="window.gantiTabMyPet(\'collection\')" style="background:#eaf2f8; color:#2980b9; border:1px solid #aed6f1; padding:5px 12px; border-radius:16px; font-size:11px; font-weight:800; cursor:pointer;">🔄 Ganti Pet Aktif</button>' : '') +
                '</div>' +

                '<!-- INDIKATOR BAR KENYANG (0-100) & MOOD (0-100) -->' +
                '<div style="display:flex; flex-direction:column; gap:10px; margin:14px 0;">' +
                    '<div>' +
                        '<div style="display:flex; justify-content:space-between; font-size:12px; font-weight:800; color:#334155; margin-bottom:4px;">' +
                            '<span>🍖 Kenyang</span>' +
                            '<span style="color:' + infoLapar.warna + ';">' + hungerVal + '/100</span>' +
                        '</div>' +
                        '<div class="mypet-stat-bar-bg">' +
                            '<div class="mypet-stat-bar-fill" style="width:' + hungerVal + '%; background:' + (hungerVal >= 50 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : (hungerVal >= 25 ? '#f59e0b' : '#ef4444')) + ';"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="display:flex; justify-content:space-between; font-size:12px; font-weight:800; color:#334155; margin-bottom:4px;">' +
                            '<span>😊 Mood</span>' +
                            '<span style="color:#ec4899;">' + moodVal + '/100</span>' +
                        '</div>' +
                        '<div class="mypet-stat-bar-bg">' +
                            '<div class="mypet-stat-bar-fill" style="width:' + moodVal + '%; background:linear-gradient(90deg, #f472b6, #ec4899);"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                '<!-- BAR TOMBOL INTERAKSI UTAMA (ELUS, BERI MAKAN, AJAK BERMAIN, DANDANI) -->' +
                '<div class="mypet-action-btns-grid">' +
                    '<button type="button" class="mypet-act-btn btn-elus" onclick="window.aksiElusPetAktif()">🤚 Elus</button>' +
                    '<button type="button" class="mypet-act-btn btn-makan" onclick="window.toggleLaciMakanHabitat()">🍖 Beri Makan</button>' +
                    '<button type="button" class="mypet-act-btn btn-main" onclick="window.aksiAjakBermainPetAktif()">🎾 Ajak Bermain</button>' +
                    '<button type="button" class="mypet-act-btn btn-dandan" onclick="window.gantiTabMyPet(\'wardrobe\')">👗 Dandani</button>' +
                '</div>' +
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
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData) return;

    let activeId = lb.myPetData.activePetId;
    let pet = lb.myPetData.ownedPets[activeId];
    if (!pet) return;

    let cat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === activeId; }) || window.MY_PET_CATALOG.pets[0];
    let nama = pet.customName || cat.namaDefault;
    let now = Date.now();
    let cooldownMs = 5 * 60 * 1000; // Cooldown 5 menit untuk perolehan Bond

    window.triggerAnimasiPetSementara("#mypet-habitat-stage", "happy", 1800);
    window.triggerAnimasiPetSementara("#mypet-detail-preview-box", "happy", 1800);

    if (pet.lastPetTime && (now - pet.lastPetTime) < cooldownMs) {
        let sisaMenit = Math.ceil((cooldownMs - (now - pet.lastPetTime)) / 60000);
        window.tampilkanToastInteraksiPet("💖 <b>" + nama + "</b> merasa nyaman dielus! (Bonus Bond tersedia lagi dalam " + sisaMenit + " menit)");
        return;
    }

    pet.lastPetTime = now;
    pet.mood = Math.min(100, (Number(pet.mood) || 80) + 8);
    pet.bondXp = (Number(pet.bondXp) || 0) + 12;

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }

    setTimeout(function() {
        window.renderTabHabitatMyPet();
        window.tampilkanToastInteraksiPet("🥰 <b>" + nama + "</b> sangat senang dielus! (+8 Mood, +12 Bond)");
    }, 450);
};

// Aksi Ajak Bermain (Melompat riang, +12 Mood, +15 Bond dengan Cooldown 10 Menit)
window.aksiAjakBermainPetAktif = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData) return;

    let activeId = lb.myPetData.activePetId;
    let pet = lb.myPetData.ownedPets[activeId];
    if (!pet) return;

    let cat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === activeId; }) || window.MY_PET_CATALOG.pets[0];
    let nama = pet.customName || cat.namaDefault;

    if ((Number(pet.hunger) || 0) < 15) {
        window.tampilkanToastInteraksiPet("⚠️ <b>" + nama + "</b> terlalu lapar untuk bermain! Beri makan dulu ya.");
        return;
    }

    let now = Date.now();
    let cooldownMs = 10 * 60 * 1000; // Cooldown 10 menit

    window.triggerAnimasiPetSementara("#mypet-habitat-stage", "happy", 2000);
    window.triggerAnimasiPetSementara("#mypet-detail-preview-box", "happy", 2000);

    if (pet.lastPlayTime && (now - pet.lastPlayTime) < cooldownMs) {
        let sisaMenit = Math.ceil((cooldownMs - (now - pet.lastPlayTime)) / 60000);
        window.tampilkanToastInteraksiPet("🎾 <b>" + nama + "</b> berlari mengejar bola! (Bonus Bond bermain kembali dalam " + sisaMenit + " menit)");
        return;
    }

    pet.lastPlayTime = now;
    pet.mood = Math.min(100, (Number(pet.mood) || 80) + 12);
    pet.bondXp = (Number(pet.bondXp) || 0) + 15;

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }

    setTimeout(function() {
        window.renderTabHabitatMyPet();
        window.tampilkanToastInteraksiPet("🎾 <b>" + nama + "</b> melompat gembira bermain bersamamu! (+12 Mood, +15 Bond)");
    }, 500);
};

// Buka / Tutup Laci Pilih Makanan
window.toggleLaciMakanHabitat = function(forceState) {
    if (typeof forceState === "boolean") {
        window.bukaLaciMakanHabitat = forceState;
    } else {
        window.bukaLaciMakanHabitat = !window.bukaLaciMakanHabitat;
    }
    window.renderTabHabitatMyPet();
};

// Berikan Makanan atau Camilan Favorit ke Pet Aktif
window.berikanMakananKePet = function(foodId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData) return;

    let petData = lb.myPetData;
    let activeId = petData.activePetId;
    let pet = petData.ownedPets[activeId];
    if (!pet) return;

    let stok = Number(petData.foodInventory[foodId]) || 0;
    if (stok <= 0) return alert("Stok makanan ini sudah habis!");

    let semuaMakanan = [...window.MY_PET_CATALOG.foods, ...window.MY_PET_CATALOG.snacks];
    let itemFood = semuaMakanan.find(function(f) { return f.id === foodId; });
    if (!itemFood) return;

    let cat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === activeId; }) || window.MY_PET_CATALOG.pets[0];
    let nama = pet.customName || cat.namaDefault;

    // Kurangi 1 dari inventaris
    petData.foodInventory[foodId] = stok - 1;
    if (petData.foodInventory[foodId] <= 0) delete petData.foodInventory[foodId];

    // Cek apakah ini camilan favorit spesies tersebut
    let isFavSnack = (itemFood.tipe === "snack" && itemFood.favPet === activeId);
    let tambahKenyang = Number(itemFood.kenyang) || 0;
    let tambahMood = (Number(itemFood.mood) || 5) + (isFavSnack ? 8 : 0);
    let tambahBond = isFavSnack ? 15 : 6;

    pet.hunger = Math.min(100, (Number(pet.hunger) || 0) + tambahKenyang);
    pet.mood = Math.min(100, (Number(pet.mood) || 0) + tambahMood);
    pet.bondXp = (Number(pet.bondXp) || 0) + tambahBond;
    pet.lastUpdate = Date.now();

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }

    window.bukaLaciMakanHabitat = false;
    window.renderTabHabitatMyPet();
    window.perbaruiTampilanSaldoXPPet();

    // Jalankan animasi Eating lalu disusul Happy jika camilan favorit!
    window.triggerAnimasiPetSementara("#mypet-habitat-stage", "eating", 1600);
    window.triggerAnimasiPetSementara("#mypet-detail-preview-box", "eating", 1600);

    if (isFavSnack) {
        window.tampilkanToastInteraksiPet("🌟 <b>CAMILAN FAVORIT!</b> " + nama + " melompat kegirangan memakan " + itemFood.ikon + " " + itemFood.nama + "! (+" + tambahKenyang + " Kenyang, +" + tambahMood + " Mood, +" + tambahBond + " Bond)");
        setTimeout(function() {
            window.triggerAnimasiPetSementara("#mypet-habitat-stage", "happy", 1500);
            window.triggerAnimasiPetSementara("#mypet-detail-preview-box", "happy", 1500);
        }, 1650);
    } else {
        window.tampilkanToastInteraksiPet("😋 <b>" + nama + "</b> menikmati " + itemFood.ikon + " " + itemFood.nama + " dengan lahap! (+" + tambahKenyang + " Kenyang, +" + tambahMood + " Mood)");
    }
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

// 3. RENDER TAB PET COLLECTION (DAFTAR 7 SPESIES, THUMBNAIL 64-80PX, & PILIH PET AKTIF)
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
    let habLvl = petData.habitatLevel || 1;
    let habCfg = window.MY_PET_CATALOG.habitats.find(function(h) { return h.level === habLvl; }) || window.MY_PET_CATALOG.habitats[0];

    let html =
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:white; padding:12px 16px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:14px;">' +
            '<div>' +
                '<h4 style="margin:0; color:#0b3954; font-size:15px;">🐾 Koleksi Hewan Peliharaanmu (' + ownedCount + ' / ' + window.MY_PET_CATALOG.pets.length + ' Spesies)</h4>' +
                '<div style="font-size:11px; color:#64748b;">Kapasitas Kandang (' + habCfg.nama + '): <b>' + ownedCount + ' / ' + habCfg.kapasitas + ' Pet</b></div>' +
            '</div>' +
            '<button type="button" class="btn-action" style="background:#0b3954; width:auto; padding:7px 14px; font-size:11px; border-radius:20px;" onclick="window.gantiTabMyPet(\'shop\')">🛒 Tambah Pet / Upgrade Kandang</button>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(235px, 1fr)); gap:12px;">';

    window.MY_PET_CATALOG.pets.forEach(function(cat) {
        let dimiliki = ownedMap[cat.id];
        let isActive = (petData.activePetId === cat.id);
        let snackFav = window.MY_PET_CATALOG.snacks.find(function(s) { return s.favPet === cat.id; });

        if (dimiliki) {
            let hVal = Math.max(0, Math.min(100, Math.round(Number(dimiliki.hunger) || 0)));
            let mVal = Math.max(0, Math.min(100, Math.round(Number(dimiliki.mood) || 0)));
            let stLapar = window.dapatkanInfoStatusLaparPet(hVal);
            let bInfo = window.hitungLevelBondPet(dimiliki.bondXp || 0);
            let thumbSvg = window.bangunVisualPet25DSVG(cat.id, dimiliki.outfit || {}, stLapar.animState, 74); // Thumbnail 74px (64-80px)

            html +=
                '<div style="background:white; border:2px solid ' + (isActive ? '#16a085' : '#cbd5e1') + '; border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:10px; box-shadow:0 4px 10px rgba(0,0,0,0.03);">' +
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
                    (isActive
                        ? '<button type="button" class="btn-action" style="background:#16a085; width:100%; padding:8px; font-size:12px;" onclick="window.gantiTabMyPet(\'habitat\')">⭐ Sedang Aktif (Lihat di Habitat)</button>'
                        : '<button type="button" class="btn-action" style="background:#0b3954; width:100%; padding:8px; font-size:12px;" onclick="window.pilihPetAktifUtama(\'' + cat.id + '\')">👆 Jadikan Pet Utama</button>'
                    ) +
                '</div>';
        } else {
            // Belum dimiliki (Tampilan Terkunci + Tombol Beli di Shop)
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
                            '<div style="font-size:12px; color:#d97706; font-weight:800;">🏷️ ' + cat.harga.toLocaleString("id-ID") + ' XP</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="font-size:10px; color:#64748b;">Camilan Favorit: <b>' + (snackFav ? snackFav.ikon + ' ' + snackFav.nama : '-') + '</b></div>' +
                    '<button type="button" class="btn-action" style="background:#e67e22; width:100%; padding:8px; font-size:12px;" onclick="window.gantiTabMyPet(\'shop\')">🛒 Adopsi di Shop</button>' +
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
/* =========================================================================
   MODUL MY PET ENGINE — TAHAP 4:
   - Tab Shop Terpadu (5 Kategori: Adopsi Pet, Upgrade & Dekorasi Habitat,
     Makanan & Camilan Favorit, serta Kostum & Aksesori)
   - Aturan Kapasitas Kandang & Upgrade Berjenjang (Wajib Urut Lv.1 -> Lv.6)
   - Tab Wardrobe (Ruang Ganti Kostum Interaktif dengan Pratinjau Langsung 2.5D)
   ========================================================================= */

window.activeMyPetShopCategory = "pets";
window.activeWardrobeSlot = "all";

// =========================================================================
// 1. RENDER TAB SHOP TERPADU (5 KATEGORI BELANJA DENGAN XP TERSEDIA)
// =========================================================================
window.renderTabShopMyPet = function(kategori) {
    if (kategori) window.activeMyPetShopCategory = kategori;
    let catAktif = window.activeMyPetShopCategory || "pets";

    let container = document.getElementById("mypet-view-shop");
    if (!container) return;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let petData = lb.myPetData;
    let saldoXP = window.ambilXPTersediaSiswa(uName);
    let ownedPetsMap = petData.ownedPets || {};
    let jmlPetDimiliki = Object.keys(ownedPetsMap).length;
    let habLevel = petData.habitatLevel || (jmlPetDimiliki > 0 ? 1 : 0);
    let habCfg = window.MY_PET_CATALOG.habitats.find(function(h) { return h.level === Math.max(1, habLevel); }) || window.MY_PET_CATALOG.habitats[0];
    let kapasitasMaks = habLevel === 0 ? 1 : habCfg.kapasitas;

    // Bar Sub-Kategori Shop
    let navShopHtml =
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:white; padding:12px 16px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:14px;">' +
            '<div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:2px;">' +
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "pets" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'pets\')">🐾 Adopsi Pet</button>' +
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "habitat" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'habitat\')">🏡 Upgrade & Dekorasi</button>' +
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "foods" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'foods\')">🍖 Makanan & Camilan</button>' +
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "wardrobe" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'wardrobe\')">👗 Kostum & Aksesori</button>' +
            '</div>' +
            '<div style="font-size:12px; font-weight:800; color:#0b3954; background:#fef9e7; border:1px solid #facc15; padding:5px 12px; border-radius:20px;">' +
                '💰 Saldo Belanja: <span style="color:#d97706;">' + saldoXP.toLocaleString("id-ID") + ' XP</span>' +
            '</div>' +
        '</div>';

    let bodyShopHtml = '';

    // KATEGORI A: ADOPSI PET (7 SPESIES)
    if (catAktif === "pets") {
        bodyShopHtml +=
            '<div style="background:#eaf2f8; border-left:4px solid #2980b9; padding:10px 14px; border-radius:8px; margin-bottom:12px; font-size:12px; color:#1e293b; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
                '<span>🏡 <b>Kapasitas Kandang Saat Ini (' + (habLevel === 0 ? "Starter Habitat Gratis saat beli pet pertama" : habCfg.nama) + '):</b> Terisi <b>' + jmlPetDimiliki + ' / ' + kapasitasMaks + ' Pet</b></span>' +
                (jmlPetDimiliki >= kapasitasMaks ? '<button type="button" class="btn-action" style="background:#e67e22; width:auto; padding:5px 12px; font-size:11px;" onclick="window.renderTabShopMyPet(\'habitat\')">⬆️ Upgrade Kapasitas Kandang</button>' : '') +
            '</div>' +
            '<div class="mypet-shop-grid">';

        window.MY_PET_CATALOG.pets.forEach(function(p) {
            let sudahPunya = Boolean(ownedPetsMap[p.id]);
            let previewSvg = window.bangunVisualPet25DSVG(p.id, {}, "idle", 92);
            let snackFav = window.MY_PET_CATALOG.snacks.find(function(s) { return s.favPet === p.id; });

            let btnHtml = '';
            if (sudahPunya) {
                btnHtml = '<button type="button" class="btn-action" style="background:#16a085; width:100%; padding:8px; font-size:12px;" onclick="window.pilihPetAktifUtama(\'' + p.id + '\')">✓ Sudah Dimiliki (Lihat)</button>';
            } else {
                btnHtml = '<button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:100%; padding:9px; font-size:12px; font-weight:800;" onclick="window.beliPetDiShop(\'' + p.id + '\')">🛒 Adopsi (' + p.harga.toLocaleString("id-ID") + ' XP)</button>';
            }

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

    // KATEGORI B: UPGRADE KANDANG BERJENJANG (LV.1 - LV.6) & DEKORASI HABITAT
    else if (catAktif === "habitat") {
        let curLvl = Math.max(1, petData.habitatLevel || 1);
        bodyShopHtml +=
            '<h4 style="margin:0 0 10px 0; color:#0b3954; font-size:15px;">🏡 1. Upgrade Level & Kapasitas Habitat (Berjenjang)</h4>' +
            '<div class="mypet-shop-grid" style="margin-bottom:22px;">';

        window.MY_PET_CATALOG.habitats.forEach(function(h) {
            let isUnlocked = (petData.habitatLevel >= h.level) || (h.level === 1 && jmlPetDimiliki > 0);
            let isNextLevel = (h.level === curLvl + 1) && (jmlPetDimiliki > 0 || curLvl >= 1);

            let btnHab = '';
            if (isUnlocked) {
                btnHab = '<button type="button" disabled style="background:#cbd5e1; color:#334155; border:none; width:100%; padding:8px; border-radius:8px; font-size:12px; font-weight:800;">✓ Terbuka (Kapasitas ' + h.kapasitas + ' Pet)</button>';
            } else if (h.level === 1 && jmlPetDimiliki === 0) {
                btnHab = '<button type="button" class="btn-action" style="background:#16a085; width:100%; padding:8px; font-size:12px;" onclick="window.renderTabShopMyPet(\'pets\')">Gratis Saat Adopsi Pet Pertama</button>';
            } else if (isNextLevel) {
                btnHab = '<button type="button" class="btn-action" style="background:#e67e22; width:100%; padding:9px; font-size:12px; font-weight:800;" onclick="window.beliUpgradeHabitat()">⬆️ Upgrade ke Lv.' + h.level + ' (' + h.harga.toLocaleString("id-ID") + ' XP)</button>';
            } else {
                btnHab = '<button type="button" disabled style="background:#f1f5f9; color:#94a3b8; border:1px dashed #cbd5e1; width:100%; padding:8px; border-radius:8px; font-size:11px; font-weight:700; cursor:not-allowed;">🔒 Buka Level ' + (h.level - 1) + ' Terlebih Dahulu (' + h.harga.toLocaleString("id-ID") + ' XP)</button>';
            }

            bodyShopHtml +=
                '<div class="mypet-shop-card" style="border-color:' + (isUnlocked ? '#22c55e' : (isNextLevel ? '#f59e0b' : '#e2e8f0')) + ';">' +
                    '<div style="width:100%; height:54px; border-radius:8px; margin-bottom:6px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#0f172a; font-size:12px;" class="' + h.temaCss + '">' +
                        '<span style="background:rgba(255,255,255,0.85); padding:3px 10px; border-radius:12px;">Lv.' + h.level + ' • Maks. ' + h.kapasitas + ' Pet</span>' +
                    '</div>' +
                    '<div style="font-weight:900; font-size:15px; color:#0f172a;">' + h.nama + '</div>' +
                    '<div style="font-size:11px; color:#64748b; line-height:1.4; flex:1; margin:4px 0 8px 0;">' + h.deskripsi + '</div>' +
                    btnHab +
                '</div>';
        });

        bodyShopHtml +=
            '</div>' +
            '<h4 style="margin:0 0 10px 0; color:#0b3954; font-size:15px;">⛲ 2. Shop Dekorasi Habitat (Kosmetik Kandang)</h4>' +
            '<div class="mypet-shop-grid">';

        let ownedDecs = Array.isArray(petData.ownedDecorations) ? petData.ownedDecorations : [];
        let activeDecs = Array.isArray(petData.activeDecorations) ? petData.activeDecorations : [];

        window.MY_PET_CATALOG.decorations.forEach(function(dec) {
            let isOwned = ownedDecs.includes(dec.id);
            let isActive = activeDecs.includes(dec.id);

            let btnDec = '';
            if (isOwned) {
                btnDec = '<button type="button" class="btn-action" style="background:' + (isActive ? '#64748b' : '#27ae60') + '; width:100%; padding:8px; font-size:12px;" onclick="window.togglePasangDekorasiHabitat(\'' + dec.id + '\')">' +
                            (isActive ? '✓ Terpasang di Kandang (Lepas)' : '📌 Pasang di Kandang') +
                         '</button>';
            } else {
                btnDec = '<button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="window.beliDekorasiHabitat(\'' + dec.id + '\')">🛒 Beli (' + dec.harga.toLocaleString("id-ID") + ' XP)</button>';
            }

            bodyShopHtml +=
                '<div class="mypet-shop-card">' +
                    '<div style="font-size:40px; margin:6px 0;">' + dec.ikon + '</div>' +
                    '<div style="font-weight:800; font-size:14px; color:#0f172a;">' + dec.nama + '</div>' +
                    '<div style="font-size:11px; color:#64748b; margin-bottom:8px;">Ornamen kosmetik habitat</div>' +
                    btnDec +
                '</div>';
        });
        bodyShopHtml += '</div>';
    }

    // KATEGORI C: MAKANAN UTAMA & CAMILAN FAVORIT SPESIES
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
                    '<button type="button" class="btn-action" style="background:#16a34a; width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="window.beliMakananPetDiShop(\'' + f.id + '\')">🛒 Beli 1x (' + f.harga + ' XP)</button>' +
                '</div>';
        });

        bodyShopHtml +=
            '</div>' +
            '<h4 style="margin:0 0 10px 0; color:#0b3954; font-size:15px;">🦴 2. Camilan Favorit Spesies (+5 Kenyang, +10 Mood, & Animasi Spesial)</h4>' +
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
                    '<button type="button" class="btn-action" style="background:#d97706; width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="window.beliMakananPetDiShop(\'' + s.id + '\')">🛒 Beli 1x (' + s.harga + ' XP)</button>' +
                '</div>';
        });
        bodyShopHtml += '</div>';
    }

    // KATEGORI D: SHOP KOSTUM & AKSESORI (22 ITEM PERMANEN)
    else if (catAktif === "wardrobe") {
        let ownedW = Array.isArray(petData.ownedWardrobe) ? petData.ownedWardrobe : [];
        let grupList = [
            { slot: "head",    judul: "🎩 A. Aksesori Kepala" },
            { slot: "eyes",    judul: "👓 B. Kacamata & Aksesori Wajah" },
            { slot: "body",    judul: "👕 C. Pakaian Kasual & Profesi" },
            { slot: "costume", judul: "🦸 D. Kostum Lengkap (Full Costume)" }
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
                    : '<button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="window.beliItemWardrobeDiShop(\'' + item.id + '\')">🛒 Beli (' + item.harga.toLocaleString("id-ID") + ' XP)</button>';

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
// 2. LOGIKA TRANSAKSI BELANJA SHOP (MEMOTONG XP TERSEDIA, XP TOTAL TETAP)
// =========================================================================

// A. Beli / Adopsi Pet Baru
window.beliPetDiShop = function(petId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let petData = lb.myPetData;
    let catPet = window.MY_PET_CATALOG.pets.find(function(p) { return p.id === petId; });
    if (!catPet) return;

    if (petData.ownedPets && petData.ownedPets[petId]) {
        return alert("Kamu sudah memiliki " + catPet.spesies + " di koleksimu!");
    }

    let jmlSekarang = Object.keys(petData.ownedPets || {}).length;
    // Saat membeli pet pertama, Starter Habitat (Lv.1, kapasitas 1 pet) terbuka otomatis dan gratis
    if (jmlSekarang === 0 && (!petData.habitatLevel || petData.habitatLevel < 1)) {
        petData.habitatLevel = 1;
    }

    let habCfg = window.MY_PET_CATALOG.habitats.find(function(h) { return h.level === (petData.habitatLevel || 1); }) || window.MY_PET_CATALOG.habitats[0];
    if (jmlSekarang >= habCfg.kapasitas) {
        alert("⚠️ Kapasitas kandangmu saat ini (" + habCfg.nama + ": Maks. " + habCfg.kapasitas + " Pet) sudah penuh!\n\nSilakan upgrade level kandangmu terlebih dahulu di tab '🏡 Upgrade & Dekorasi' agar bisa menampung lebih banyak pet.");
        window.renderTabShopMyPet("habitat");
        return;
    }

    let saldo = window.ambilXPTersediaSiswa(uName);
    if (saldo < catPet.harga) {
        let kurang = (catPet.harga - saldo).toLocaleString("id-ID");
        return alert("⚠️ XP Tersedia kamu belum cukup untuk mengadopsi " + catPet.spesies + "!\n\nHarga: " + catPet.harga.toLocaleString("id-ID") + " XP\nXP Tersedia: " + saldo.toLocaleString("id-ID") + " XP\n(Kurang " + kurang + " XP lagi)");
    }

    if (!confirm("Adopsi \"" + catPet.spesies + "\" (" + catPet.rarity + ") seharga " + catPet.harga.toLocaleString("id-ID") + " XP?\n\n(XP Total di Leaderboard tidak akan berkurang)")) {
        return;
    }

    if (window.gunakanXPTersediaSiswa(catPet.harga, "beli_pet_" + petId)) {
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
            outfit: { head: "", eyes: "", body: "", costume: "" }
        };
        petData.activePetId = petId;

        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.gantiTabMyPet("habitat");
        window.tampilkanToastInteraksiPet("🎉 Selamat datang di kandang, <b>" + namaCustom + "</b>!");
    }
};

// B. Beli Upgrade Habitat Berjenjang (Wajib Urut Level 1 -> 2 -> 3 -> 4 -> 5 -> 6)
window.beliUpgradeHabitat = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let petData = lb.myPetData;
    let curLvl = Math.max(1, petData.habitatLevel || 1);
    if (curLvl >= 6) return alert("Kandangmu sudah mencapai level tertinggi (Mythic Sanctuary Lv. 6)!");

    let nextCfg = window.MY_PET_CATALOG.habitats.find(function(h) { return h.level === curLvl + 1; });
    if (!nextCfg) return;

    let saldo = window.ambilXPTersediaSiswa(uName);
    if (saldo < nextCfg.harga) {
        let kurang = (nextCfg.harga - saldo).toLocaleString("id-ID");
        return alert("⚠️ XP Tersedia belum cukup untuk upgrade ke " + nextCfg.nama + " (Lv." + nextCfg.level + ")!\n\nBiaya Upgrade: " + nextCfg.harga.toLocaleString("id-ID") + " XP\nXP Tersedia: " + saldo.toLocaleString("id-ID") + " XP\n(Kurang " + kurang + " XP lagi)");
    }

    if (!confirm("Upgrade kandang ke Level " + nextCfg.level + " (" + nextCfg.nama + " — Kapasitas " + nextCfg.kapasitas + " Pet) seharga " + nextCfg.harga.toLocaleString("id-ID") + " XP?")) {
        return;
    }

    if (window.gunakanXPTersediaSiswa(nextCfg.harga, "upgrade_habitat_lv" + nextCfg.level)) {
        petData.habitatLevel = nextCfg.level;
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.renderTabShopMyPet("habitat");
        alert("🏡 Luar Biasa! Habitat berhasil di-upgrade ke Level " + nextCfg.level + ": " + nextCfg.nama + " (Kapasitas " + nextCfg.kapasitas + " Pet)!");
    }
};

// C. Beli & Pasang Dekorasi Habitat
window.beliDekorasiHabitat = function(decId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let dec = window.MY_PET_CATALOG.decorations.find(function(d) { return d.id === decId; });
    if (!dec) return;

    let saldo = window.ambilXPTersediaSiswa(uName);
    if (saldo < dec.harga) {
        return alert("⚠️ XP Tersedia kamu belum cukup untuk membeli " + dec.nama + " (" + dec.harga.toLocaleString("id-ID") + " XP)!");
    }

    if (!confirm("Beli dekorasi \"" + dec.nama + "\" seharga " + dec.harga.toLocaleString("id-ID") + " XP?")) return;

    if (window.gunakanXPTersediaSiswa(dec.harga, "beli_decor_" + decId)) {
        if (!petDataHasItem(lb.myPetData.ownedDecorations, decId)) {
            lb.myPetData.ownedDecorations.push(decId);
        }
        if (!petDataHasItem(lb.myPetData.activeDecorations, decId)) {
            lb.myPetData.activeDecorations.push(decId);
        }
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.renderTabShopMyPet("habitat");
    }
};

function petDataHasItem(arr, id) {
    return Array.isArray(arr) && arr.includes(id);
}

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

// D. Beli Makanan & Camilan Favorit
window.beliMakananPetDiShop = function(foodId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let semuaMakanan = [...window.MY_PET_CATALOG.foods, ...window.MY_PET_CATALOG.snacks];
    let item = semuaMakanan.find(function(f) { return f.id === foodId; });
    if (!item) return;

    let saldo = window.ambilXPTersediaSiswa(uName);
    if (saldo < item.harga) {
        return alert("⚠️ XP Tersedia kamu belum cukup untuk membeli " + item.nama + " (" + item.harga + " XP)!");
    }

    if (window.gunakanXPTersediaSiswa(item.harga, "beli_food_" + foodId)) {
        if (!lb.myPetData.foodInventory) lb.myPetData.foodInventory = {};
        lb.myPetData.foodInventory[foodId] = (Number(lb.myPetData.foodInventory[foodId]) || 0) + 1;
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.renderTabShopMyPet("foods");
    }
};

// E. Beli Item Kostum & Aksesori (Masuk Permanen ke Wardrobe)
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

    let saldo = window.ambilXPTersediaSiswa(uName);
    if (saldo < item.harga) {
        let kurang = (item.harga - saldo).toLocaleString("id-ID");
        return alert("⚠️ XP Tersedia belum cukup untuk membeli \"" + item.nama + "\"!\n\nHarga: " + item.harga.toLocaleString("id-ID") + " XP\nXP Tersedia: " + saldo.toLocaleString("id-ID") + " XP\n(Kurang " + kurang + " XP lagi)");
    }

    if (!confirm("Beli \"" + item.nama + "\" seharga " + item.harga.toLocaleString("id-ID") + " XP?\n\nItem ini akan tersimpan permanen di Wardrobe dan bebas dipakai pada pet mana pun!")) {
        return;
    }

    if (window.gunakanXPTersediaSiswa(item.harga, "beli_wardrobe_" + itemId)) {
        lb.myPetData.ownedWardrobe.push(itemId);
        // Langsung pasangkan pada pet aktif jika ada
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
// 3. RENDER TAB WARDROBE (RUANG GANTI KOSTUM + ATURAN KOMPATIBILITAS VISUAL)
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
    if (!activePet.outfit) activePet.outfit = { head: "", eyes: "", body: "", costume: "" };
    let eq = activePet.outfit;

    let catActive = window.MY_PET_CATALOG.pets.find(function(p) { return p.id === activeId; }) || window.MY_PET_CATALOG.pets[0];
    let previewSvg = window.bangunVisualPet25DSVG(activeId, eq, "idle", 165);

    // Dropdown ganti pet yang sedang didandani
    let opsiPetHtml = '';
    ownedPetIds.forEach(function(pid) {
        let pObj = ownedPetsMap[pid];
        let pCat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === pid; }) || window.MY_PET_CATALOG.pets[0];
        let sel = (pid === activeId) ? "selected" : "";
        opsiPetHtml += '<option value="' + pid + '" ' + sel + '>🐾 ' + (pObj.customName || pCat.namaDefault) + ' (' + pCat.spesies + ')</option>';
    });

    // Daftar item wardrobe yang dimiliki
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
            btnAction = '<button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:100%; padding:7px; font-size:11px; font-weight:800;" onclick="window.beliItemWardrobeDiShop(\'' + item.id + '\')">🛒 Beli (' + item.harga.toLocaleString("id-ID") + ' XP)</button>';
        }

        let labelSlot = item.slot === "head" ? "Kepala" : (item.slot === "eyes" ? "Wajah/Mata" : (item.slot === "body" ? "Pakaian" : "Kostum Penuh"));

        gridItemsHtml +=
            '<div class="mypet-shop-card" style="border-color:' + (isEquipped ? '#8b5cf6' : (isOwned ? '#22c55e' : '#e2e8f0')) + '; background:' + (isEquipped ? '#f5f3ff' : '#ffffff') + ';">' +
                '<div style="display:flex; justify-content:space-between; width:100%; font-size:10px; font-weight:800;">' +
                    '<span style="background:#f1f5f9; color:#475569; padding:2px 7px; border-radius:8px;">' + labelSlot + '</span>' +
                    (isOwned ? '<span style="color:#16a34a;">✓ Dimiliki</span>' : '<span style="color:#d97706;">' + item.harga.toLocaleString("id-ID") + ' XP</span>') +
                '</div>' +
                '<div style="font-size:36px; margin:6px 0;">' + item.ikon + '</div>' +
                '<div style="font-weight:800; font-size:13px; color:#0f172a;">' + item.nama + '</div>' +
                '<div style="font-size:10px; color:#64748b; line-height:1.3; flex:1; margin:3px 0 8px 0;">' + item.deskripsi + '</div>' +
                btnAction +
            '</div>';
    });

    container.innerHTML =
        '<div style="display:flex; gap:18px; flex-wrap:wrap; align-items:flex-start;">' +
            '<!-- KIRI: PANGGUNG PRATINJAU KOSTUM LANGSUNG -->' +
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

            '<!-- KANAN: DAFTAR LEMARI PAKAIAN & AKSESORI -->' +
            '<div style="flex:1; min-width:280px;">' +
                '<div style="display:flex; gap:6px; overflow-x:auto; background:white; padding:10px 12px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:12px;">' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "all" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'all\')">🌟 Semua (' + ownedW.length + '/' + window.MY_PET_CATALOG.wardrobe.length + ')</button>' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "head" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'head\')">🎩 Kepala</button>' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "eyes" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'eyes\')">👓 Kacamata</button>' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "body" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'body\')">👕 Pakaian</button>' +
                    '<button type="button" class="mypet-subtab-btn ' + (slotAktif === "costume" ? "active" : "") + '" onclick="window.renderTabWardrobeMyPet(\'costume\')">🦸 Kostum Lengkap</button>' +
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

// Aturan Kompatibilitas Pemakaian Kostum & Aksesori:
// - Kostum Lengkap (slot: "costume") menggantikan Pakaian Biasa (slot: "body") dan sebaliknya.
// - Kostum Astronaut & Dino Suit memiliki helm/tudung kepala bawaan sehingga otomatis melepas topi biasa agar tidak bertabrakan secara visual.
window.pakaiLepasItemWardrobe = function(itemId, forceEquip) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData) return;

    let activeId = lb.myPetData.activePetId;
    let pet = lb.myPetData.ownedPets[activeId];
    if (!pet) return;
    if (!pet.outfit) pet.outfit = { head: "", eyes: "", body: "", costume: "" };

    let item = window.MY_PET_CATALOG.wardrobe.find(function(w) { return w.id === itemId; });
    if (!item) return;

    let eq = pet.outfit;
    let sedangDipakai = (eq[item.slot] === item.id);

    if (sedangDipakai && !forceEquip) {
        eq[item.slot] = "";
    } else {
        eq[item.slot] = item.id;

        // Aturan Kompatibilitas: Kostum Lengkap menggantikan Pakaian Biasa
        if (item.slot === "costume") {
            eq.body = "";
            if (item.id === "cost_astro" || item.id === "cost_dino") {
                eq.head = ""; // Helm Astronaut & Tudung Dino menggantikan topi agar tidak bertabrakan
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

    pet.outfit = { head: "", eyes: "", body: "", costume: "" };
    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }
    window.renderTabWardrobeMyPet();
};



/* =========================================================================
   PATCH PERBAIKAN SINKRONISASI EKOSISTEM UJIAN, REKAP NILAI, LEDGER, & XP
   (Tempelkan di baris paling bawah file js/my-pet-engine.js)
   ========================================================================= */

// 1. JEMBATAN OTENTIKASI FIREBASE OTOMATIS UNTUK AKUN SISWA
// Memastikan siswa yang login dengan akun otomatis (123456) tetap memiliki izin tulis ke Firebase
window.pastikanAuthFirebaseSiswaAktif = function(callback) {
    let stat = sessionStorage.getItem("statusLogin");
    if (stat === "siswa" && typeof window.loginFirebase === "function" && !window._siswaFirebaseAuthReady) {
        window.loginFirebase("siswa@sbd.com", "semangat", function() {
            window._siswaFirebaseAuthReady = true;
            if (callback) callback();
        }, function() {
            if (callback) callback();
        });
    } else {
        if (callback) callback();
    }
};

document.addEventListener("DOMContentLoaded", function() {
    // Matikan pemutus jaringan (goOffline) selama ujian agar pengiriman nilai tidak pernah gagal
    window.modeHematServerUjian = function() {};
    setTimeout(function() {
        window.modeHematServerUjian = function() {};
        window.pastikanAuthFirebaseSiswaAktif();
    }, 1000);
});

// 2. SANITASI KUNCI PATH FIREBASE & PENCARI DATA REKAP ANTI-MELESET
window.sanitasiKeyRekapFirebase = function(teks) {
    return String(teks || "").replace(/[\.\#\$\[\]\/]/g, "").trim();
};

// Mencocokkan nama siswa di Rekap Nilai & Ledger meskipun ada tanda titik (.) atau spasi
window.ambilDataSiswaDiObjekRekap = function(objRekapPaket, namaSiswa) {
    if (!objRekapPaket || !namaSiswa) return null;
    if (objRekapPaket[namaSiswa]) return objRekapPaket[namaSiswa];

    let cleanTarget = window.sanitasiKeyRekapFirebase(namaSiswa).toLowerCase();
    let trimTarget = String(namaSiswa).trim().toLowerCase();

    let keys = Object.keys(objRekapPaket);
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        let item = objRekapPaket[k];
        if (k.trim().toLowerCase() === trimTarget) return item;
        if (window.sanitasiKeyRekapFirebase(k).toLowerCase() === cleanTarget) return item;
        if (item && item.namaAsli && item.namaAsli.trim().toLowerCase() === trimTarget) return item;
    }
    return null;
};

// 3. PERBAIKAN DUAL-XP & SELF-HEALING DATA KELAS/NAMA SISWA (ADMIN 1 MILIAR XP)
window.pastikanStrukturDualXPDanPet = function(uName) {
    let userKey = uName || sessionStorage.getItem("username");
    if (!userKey) return null;

    let isAdmin = (typeof window.isAdminSession === "function" && window.isAdminSession()) ||
                  sessionStorage.getItem("statusLogin") === "admin" ||
                  userKey === "mahardika";

    if (!window.leaderboardSiswaData) window.leaderboardSiswaData = {};

    // Ambil data asli siswa dari akunSiswaData agar kelas & nama lengkap tidak berubah jadi "Umum"
    let akunAsli = (window.akunSiswaData && window.akunSiswaData[userKey]) ? window.akunSiswaData[userKey] : null;

    if (!window.leaderboardSiswaData[userKey]) {
        // Jangan membuat data palsu untuk siswa jika akun_siswa belum selesai dimuat dari server
        if (!isAdmin && !akunAsli) return null;

        window.leaderboardSiswaData[userKey] = {
            kelas: isAdmin ? "Guru / Admin" : (akunAsli ? akunAsli.kelas : "Umum"),
            namaLengkap: isAdmin ? userKey : (akunAsli ? akunAsli.namaLengkap : userKey),
            xp: isAdmin ? 1000000000 : 0,
            xpTotal: isAdmin ? 1000000000 : 0,
            xpTersedia: isAdmin ? 1000000000 : 0,
            statSoal: { PG: 0, PGK: 0, IS: 0, Essay: 0 }
        };
    }

    let lb = window.leaderboardSiswaData[userKey];

    // Self-Healing: Pulihkan kelas & nama lengkap siswa jika sempat tertimpa menjadi "Umum" / username
    if (!isAdmin && akunAsli) {
        if ((!lb.kelas || lb.kelas === "Umum") && akunAsli.kelas && akunAsli.kelas !== "Umum") {
            lb.kelas = akunAsli.kelas;
        }
        if ((!lb.namaLengkap || lb.namaLengkap === userKey) && akunAsli.namaLengkap) {
            lb.namaLengkap = akunAsli.namaLengkap;
        }
    }

    if (isAdmin) {
        lb.xpTotal = 1000000000;
        lb.xpTersedia = 1000000000;
        lb.xp = 1000000000;
    } else {
        let currentTotal = Number(lb.xp) || 0;
        if (typeof lb.xpTotal !== "number" || currentTotal > lb.xpTotal) {
            lb.xpTotal = currentTotal;
        }
        lb.xp = lb.xpTotal;

        if (typeof lb.xpTersedia !== "number") {
            let spent = Number(lb.xpSpentTotal) || 0;
            lb.xpTersedia = Math.max(0, lb.xpTotal - spent);
        }
    }

    if (!lb.myPetData || typeof lb.myPetData !== "object") {
        lb.myPetData = {
            habitatLevel: isAdmin ? 6 : 0,
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
        if (isAdmin && (!lb.myPetData.habitatLevel || lb.myPetData.habitatLevel < 6)) {
            lb.myPetData.habitatLevel = 6;
        }
    }

    return lb;
};

// Penambahan XP Siswa yang Bersih (Tanpa Double-Hook & Aman untuk Ujian/Latihan)
window.tambahXPSiswa = function(jumlahXP, aktivitas, arrSoal) {
    let uName = sessionStorage.getItem("username");
    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" || !uName || uName.toLowerCase() === "sbd") return;

    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let tambahan = Number(jumlahXP) || 0;
    lb.xpTotal = (Number(lb.xpTotal) || 0) + tambahan;
    lb.xpTersedia = (Number(lb.xpTersedia) || 0) + tambahan;
    lb.xp = lb.xpTotal;

    if (arrSoal && Array.isArray(arrSoal)) {
        if (!lb.statSoal) lb.statSoal = { PG: 0, PGK: 0, IS: 0, Essay: 0 };
        arrSoal.forEach(function(q) {
            let t = q.type || "PG";
            if (lb.statSoal[t] !== undefined) lb.statSoal[t]++;
        });
    }

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") {
        window.perbaruiTampilanSaldoXPPet();
    }
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") {
        window.perbaruiUIHeaderProfilSiswa();
    }
};

// 4. PERBAIKAN PENGUMPULAN UJIAN SISWA (TUNGGU KONFIRMASI SERVER SEBELUM PINDAH HALAMAN)
window.kumpulkanUjianSiswa = function(isForce, isKicked) {
    try {
        let forceSubmit = isForce === true;
        let kickedSubmit = isKicked === true;

        if (!forceSubmit) {
            if (!window.confirmAmanUjian("Yakin ingin mengumpulkan jawaban sekarang? Pastikan semua jawaban sudah Anda periksa.")) return;
        }

        if (window._sedangMengirimUjian) return;
        window._sedangMengirimUjian = true;

        let btnKumpul = document.getElementById("btn-kumpul-ujian-utama");
        if (btnKumpul) {
            btnKumpul.disabled = true;
            btnKumpul.style.background = "#f39c12";
            btnKumpul.innerText = "⏳ Mengirim Nilai & Jawaban ke Server...";
        }

        clearInterval(window.timerIntervalUjian);
        clearInterval(window.penaltyInterval);
        clearInterval(window.screenGuardInterval);
        window.isStrictUjianActive = false;
        if (typeof window.matikanWakeLockUjian === "function") window.matikanWakeLockUjian();
        document.body.classList.remove("strict-mode-active");

        try {
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(function() {});
            }
        } catch (e) {}

        let pkt = window.sesiUjianSiswa;
        if (!pkt || !pkt.soal) {
            window._sedangMengirimUjian = false;
            window.alertAmanUjian("❌ Sesi ujian tidak ditemukan. Anda akan dikembalikan ke beranda.");
            window.location.href = "index.html?bab=home";
            return;
        }

        // Pastikan seluruh ketikan terakhir di kotak input isian/essay terekam
        document.querySelectorAll('#ujian-strict-container input[type="text"]').forEach(function(inp) {
            let oninputAttr = inp.getAttribute("oninput") || "";
            let matchIdx = oninputAttr.match(/simpanJawabanUjian\((\d+)/);
            if (matchIdx && matchIdx[1] !== undefined) {
                let sIdx = parseInt(matchIdx[1], 10);
                if (inp.value && (!pkt.jawaban[sIdx] || pkt.jawaban[sIdx] !== inp.value)) {
                    pkt.jawaban[sIdx] = inp.value.trim();
                }
            }
        });

        let bobotPG = (pkt.bobot && pkt.bobot.PG) ? Number(pkt.bobot.PG) : 0;
        let bobotPGK = (pkt.bobot && pkt.bobot.PGK) ? Number(pkt.bobot.PGK) : 0;
        let bobotIS = (pkt.bobot && pkt.bobot.IS) ? Number(pkt.bobot.IS) : 0;
        let bobotES = (pkt.bobot && pkt.bobot.Essay) ? Number(pkt.bobot.Essay) : 0;

        let totalNilai = 0;
        let totalMax = 0;
        let hasilDetail = [];

        pkt.soal.forEach(function(q, idx) {
            let ans = (pkt.jawaban && pkt.jawaban[idx] !== undefined) ? pkt.jawaban[idx] : "";
            let poin = 0;
            let maxPoin = 0;
            let statusJawab = "Salah";

            if (q.type === "PG") {
                maxPoin = bobotPG;
                if (ans === (q.correct && q.correct[0])) {
                    poin = bobotPG;
                    statusJawab = "Benar";
                }
            } else if (q.type === "PGK") {
                maxPoin = bobotPGK;
                if (Array.isArray(ans) && Array.isArray(q.correct)) {
                    let benarAll = (ans.length === q.correct.length) && ans.every(function(a) { return q.correct.includes(a); });
                    if (benarAll) {
                        poin = bobotPGK;
                        statusJawab = "Benar Sempurna";
                    }
                }
            } else if (q.type === "IS") {
                maxPoin = bobotIS;
                let ansClean = (typeof ans === "string") ? ans.trim().toLowerCase() : "";
                if (ansClean && q.correct && q.correct.some(function(k) { return String(k).trim().toLowerCase() === ansClean; })) {
                    poin = bobotIS;
                    statusJawab = "Benar";
                }
            } else if (q.type === "Essay") {
                maxPoin = bobotES;
                poin = 0;
                statusJawab = "Menunggu Guru";
            }

            totalNilai += poin;
            totalMax += maxPoin;

            hasilDetail.push({
                nomor: (typeof q.originalIndex === "number" ? q.originalIndex : idx) + 1,
                soal: q.question || "",
                tipe: q.type || "PG",
                jawabSiswa: ans || "-",
                jawabanSiswa: ans || "-",
                kunci: q.correct || [],
                pembahasan: q.explanation || "Tidak ada pembahasan.",
                poin: poin,
                poinDidapat: poin,
                maxPoin: maxPoin,
                status: statusJawab
            });
        });

        hasilDetail.sort(function(a, b) { return a.nomor - b.nomor; });

        let nAkhirHitung = totalMax > 0 ? (totalNilai / totalMax) * 100 : 0;
        let nilaiAkhir = isNaN(nAkhirHitung) ? 0 : Number(nAkhirHitung.toFixed(2));

        let safeKelas = window.sanitasiKeyRekapFirebase(pkt.kelas);
        let safePaket = window.sanitasiKeyRekapFirebase(pkt.paket);
        let safeNama = window.sanitasiKeyRekapFirebase(pkt.nama);

        let pathRekap = "admin_rekap_nilai/" + safeKelas + "/" + safePaket + "/" + safeNama;
        let payloadRekap = {
            namaAsli: pkt.nama,
            kelasAsli: pkt.kelas,
            paketAsli: pkt.paket,
            nilaiAkhir: nilaiAkhir,
            pelanggaran: window.violationCount || 0,
            waktuKumpul: new Date().toISOString(),
            detail: hasilDetail,
            rincian: hasilDetail
        };

        // Simpan juga ke memori lokal agar langsung terlihat tanpa jeda
        if (!window.adminRekapNilaiData) window.adminRekapNilaiData = {};
        if (!window.adminRekapNilaiData[safeKelas]) window.adminRekapNilaiData[safeKelas] = {};
        if (!window.adminRekapNilaiData[safeKelas][safePaket]) window.adminRekapNilaiData[safeKelas][safePaket] = {};
        window.adminRekapNilaiData[safeKelas][safePaket][pkt.nama] = payloadRekap;

        function selesaikanKeluarRuangUjian() {
            window._sedangMengirimUjian = false;
            window.hapusCadanganLokalUjian();
            window.sesiUjianSiswa = null;

            let bNav = document.getElementById("btn-toggle-cbt-nav");
            if (bNav) bNav.style.display = "none";
            let dNav = document.getElementById("cbt-nav-drawer");
            if (dNav) dNav.classList.remove("show-nav");

            window.alertAmanUjian("✅ Ujian Berhasil Dikumpulkan!\n\nNilai sementara Anda: " + nilaiAkhir + "\n(+ " + Math.round(nilaiAkhir) + " XP)");

            let room = document.getElementById("ujian-strict-room");
            let header = document.getElementById("header-wrap");
            let nav = document.getElementById("main-nav");
            let bc = document.querySelector(".bottom-breadcrumb-bar");

            if (room) room.style.display = "none";
            if (header) header.style.display = "flex";
            if (nav) nav.style.display = "block";
            if (bc) bc.style.display = "flex";
            document.body.style.overflow = "";

            if (typeof window.navigasiHalaman === "function") {
                window.navigasiHalaman(null, "home");
            } else {
                window.location.href = "index.html?bab=home";
            }
        }

        // Pastikan koneksi & otentikasi Firebase aktif, lalu TUNGGU sampai data benar-benar masuk ke server
        window.pastikanAuthFirebaseSiswaAktif(function() {
            if (typeof window.simpanStatusLiveMonitorKeDB === "function") {
                let finalStatus = kickedSubmit ? "Dikeluarkan" : "Selesai";
                window.simpanStatusLiveMonitorKeDB(pkt.paket, pkt.kelas, pkt.nama, {
                    kelas: pkt.kelas,
                    nama: pkt.nama,
                    paket: pkt.paket,
                    status: finalStatus,
                    pelanggaran: window.violationCount || 0,
                    waktuUpdate: new Date().toISOString()
                });
            }

            if (sessionStorage.getItem("statusLogin") === "siswa" && typeof window.tambahXPSiswa === "function") {
                window.tambahXPSiswa(Math.round(nilaiAkhir), "ujian", pkt.soal);
            }

            if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
                window.kirimNilaiUjianAmanKeDB(pathRekap, payloadRekap, function() {
                    selesaikanKeluarRuangUjian();
                }, function() {
                    // Coba kirim sekali lagi jika koneksi sempat padat
                    setTimeout(function() {
                        window.kirimNilaiUjianAmanKeDB(pathRekap, payloadRekap, function() {
                            selesaikanKeluarRuangUjian();
                        }, function() {
                            selesaikanKeluarRuangUjian();
                        });
                    }, 1200);
                });
            } else if (typeof window.simpanNilaiUjianKeDB === "function") {
                window.simpanNilaiUjianKeDB(pathRekap, payloadRekap);
                setTimeout(selesaikanKeluarRuangUjian, 1500);
            } else {
                selesaikanKeluarRuangUjian();
            }
        });
    } catch (err) {
        window._sedangMengirimUjian = false;
        console.error("Kesalahan saat mengumpulkan ujian:", err);
        window.alertAmanUjian("Terjadi kesalahan saat memproses pengumpulan ujian. Silakan tekan tombol Kumpulkan sekali lagi.");
    }
};

// 5. SINKRONISASI PENUH REKAP NILAI, KOREKSI DETAIL, & LEDGER AKADEMIK
window.ambilObjekRekapKelas = function(namaKelas) {
    if (!window.adminRekapNilaiData || !namaKelas) return {};
    if (window.adminRekapNilaiData[namaKelas]) return window.adminRekapNilaiData[namaKelas];
    let safeKls = window.sanitasiKeyRekapFirebase(namaKelas);
    return window.adminRekapNilaiData[safeKls] || {};
};

window.ambilObjekRekapPaket = function(namaKelas, namaPaket) {
    let rekapKelas = window.ambilObjekRekapKelas(namaKelas);
    if (!rekapKelas || !namaPaket) return {};
    if (rekapKelas[namaPaket]) return rekapKelas[namaPaket];
    let safePkt = window.sanitasiKeyRekapFirebase(namaPaket);
    return rekapKelas[safePkt] || {};
};

window.ambilDaftarPaketUjianKelas = function(namaKelas) {
    if (!namaKelas) return [];
    let paketSet = new Set();

    let rekapKelas = window.ambilObjekRekapKelas(namaKelas);
    Object.keys(rekapKelas).forEach(function(p) {
        if (Object.keys(rekapKelas[p] || {}).length > 0) {
            paketSet.add(p);
        }
    });

    if (window.adminLiveMonitorData) {
        Object.keys(window.adminLiveMonitorData).forEach(function(p) {
            let lmPkt = window.adminLiveMonitorData[p] || {};
            let lmKls = lmPkt[namaKelas] || lmPkt[window.sanitasiKeyRekapFirebase(namaKelas)];
            if (lmKls && Object.keys(lmKls).length > 0) {
                paketSet.add(p);
            }
        });
    }

    if (window.adminLedgerMetaData && window.adminLedgerMetaData[namaKelas] && Array.isArray(window.adminLedgerMetaData[namaKelas].kolom)) {
        window.adminLedgerMetaData[namaKelas].kolom.forEach(function(p) {
            if ((window.adminBankUjianData && window.adminBankUjianData[p]) || rekapKelas[p]) {
                paketSet.add(p);
            }
        });
    }

    // Jika belum ada yang mengumpulkan sama sekali, tampilkan juga ujian yang sedang aktif agar guru tetap bisa memantau / input manual
    if (paketSet.size === 0 && window.adminUjianAktifData) {
        Object.values(window.adminUjianAktifData).forEach(function(u) {
            if (u && u.paket) paketSet.add(u.paket);
        });
    }

    return Array.from(paketSet).sort();
};

// Pastikan perhitungan Nilai Akhir di Ledger membaca data dengan pencocokan nama yang aman
window.hitungNilaiAkhirRumusLedger = function(kls, namaSiswa, kolomUjian) {
    let sumKuis = 0, cntKuis = 0;
    let sumPH = 0, cntPH = 0;
    let sumSAS = 0, cntSAS = 0;
    let adaKolomKuis = false, adaKolomPH = false, adaKolomSAS = false;

    (kolomUjian || []).forEach(function(kol) {
        let kat = window.deteksiKategoriKolomLedger(kol);
        if (kat === "KUIS") adaKolomKuis = true;
        else if (kat === "SAS") adaKolomSAS = true;
        else adaKolomPH = true;

        let rekapPaket = window.ambilObjekRekapPaket(kls, kol);
        let dataSiswa = window.ambilDataSiswaDiObjekRekap(rekapPaket, namaSiswa);

        if (dataSiswa && dataSiswa.nilaiAkhir !== undefined) {
            let n = parseFloat(dataSiswa.nilaiAkhir);
            if (!isNaN(n)) {
                if (kat === "KUIS") { sumKuis += n; cntKuis++; }
                else if (kat === "SAS") { sumSAS += n; cntSAS++; }
                else { sumPH += n; cntPH++; }
            }
        }
    });

    let totalDiikuti = cntKuis + cntPH + cntSAS;
    if (totalDiikuti === 0) return { adaNilai: false, nilaiAkhir: 0 };

    let avgKuis = cntKuis > 0 ? (sumKuis / cntKuis) : 0;
    let avgPH = cntPH > 0 ? (sumPH / cntPH) : 0;
    let avgSAS = cntSAS > 0 ? (sumSAS / cntSAS) : 0;

    if (adaKolomKuis && adaKolomPH && adaKolomSAS) {
        let na = (avgKuis * 0.40) + (avgPH * 0.30) + (avgSAS * 0.30);
        return { adaNilai: true, nilaiAkhir: na };
    }

    let bobotAktif = 0;
    let totalTerbobot = 0;
    if (adaKolomKuis && cntKuis > 0) { totalTerbobot += (avgKuis * 40); bobotAktif += 40; }
    if (adaKolomPH && cntPH > 0) { totalTerbobot += (avgPH * 30); bobotAktif += 30; }
    if (adaKolomSAS && cntSAS > 0) { totalTerbobot += (avgSAS * 30); bobotAktif += 30; }

    let nilaiFinal = bobotAktif > 0 ? (totalTerbobot / bobotAktif) : 0;
    return { adaNilai: true, nilaiAkhir: nilaiFinal };
};

// Sinkronisasi Kunci Nama Siswa Saat Membuka Detail Koreksi Ujian
const _asliMuatDataKoreksi = window.muatDataKoreksi;
window.muatDataKoreksi = function(namaSiswa) {
    let t = window.tempKoreksiTarget;
    if (t && window.adminRekapNilaiData) {
        let klsKey = window.adminRekapNilaiData[t.kelas] ? t.kelas : window.sanitasiKeyRekapFirebase(t.kelas);
        if (window.adminRekapNilaiData[klsKey]) {
            t.kelas = klsKey;
            let pktKey = window.adminRekapNilaiData[klsKey][t.paket] ? t.paket : window.sanitasiKeyRekapFirebase(t.paket);
            if (window.adminRekapNilaiData[klsKey][pktKey]) {
                t.paket = pktKey;
                if (!window.adminRekapNilaiData[klsKey][pktKey][namaSiswa]) {
                    let safeN = window.sanitasiKeyRekapFirebase(namaSiswa);
                    if (window.adminRekapNilaiData[klsKey][pktKey][safeN]) {
                        namaSiswa = safeN;
                    }
                }
            }
        }
    }
    if (_asliMuatDataKoreksi) _asliMuatDataKoreksi(namaSiswa);
};