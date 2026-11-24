/* =========================================================================
   MODUL MY WORLD EXPANSION V9:
   - Fix Bug Avatar Tertarik Sendiri (Ghost-Click & Stuck Joystick Guard)
   - Efek Suara Prosedural Web Audio API (0 KB Asset + Mute Toggle)
   - Stamina Bar + Kalkulator BMI, BMR, & TDEE + Konsumsi Bekal My Kitchen
   - Buku Ensiklopedia Alam (Bio-Dex + Milestone 25%/50%/75%/100%)
   - Upgrade Alat (Kapak Baja 150x, Ember/Tandon Jumbo, Sprinkler, Joran/Jaring Pro)
   - Siklus Musim Mingguan, Spesies Nokturnal, & Foraging Jamur (Kingdom Fungi)
   - Gedung Museum Biologi & Taksonomi (Donasi Kuis Kunci Determinasi + Visit)
   - 3 NPC Edukatif (Pak Tani, Dr. Gizi, & Prof. Biologi)
   ========================================================================= */

// =========================================================================
// 1. FIX BUG AVATAR TERTARIK SENDIRI (ANTI GHOST-CLICK & STUCK INPUT)
// =========================================================================
window._owJoyLastReleaseAt = 0;
window._owOverlayClosedAt = 0;

window.resetTotalInputGerakWorld = function(markOverlayClose) {
    let ws = window.myWorldState;
    if (ws) {
        ws.keys = { up: false, down: false, left: false, right: false };
        ws.targetX = null;
        ws.targetY = null;
        ws.autoEnterZone = "";
    }
    window._openWorldPendingAction = null;
    if (window._owJoyState) {
        window._owJoyState.active = false;
        window._owJoyState.pointerId = null;
        window._owJoyState.vx = 0;
        window._owJoyState.vy = 0;
    }
    let knob = document.getElementById("ow-joystick-knob");
    if (knob) knob.style.transform = "translate(-50%, -50%)";
    if (markOverlayClose) window._owOverlayClosedAt = Date.now();
};

// Rekam waktu lepas joystick agar klik sintetis setelah lepas jari tidak menarik avatar
document.addEventListener("pointerup", function(e) {
    if (window._owJoyState && (window._owJoyState.active || (e.target && e.target.closest && e.target.closest(".ow-joystick-zone")))) {
        window._owJoyLastReleaseAt = Date.now();
        window._owJoyState.active = false;
        window._owJoyState.pointerId = null;
        window._owJoyState.vx = 0;
        window._owJoyState.vy = 0;
        let knob = document.getElementById("ow-joystick-knob");
        if (knob) knob.style.transform = "translate(-50%, -50%)";
    }
}, true);

document.addEventListener("pointercancel", function() {
    if (window._owJoyState && window._owJoyState.active) {
        window._owJoyLastReleaseAt = Date.now();
        window.resetTotalInputGerakWorld(false);
    }
}, true);

window.addEventListener("blur", function() {
    window.resetTotalInputGerakWorld(false);
});

document.addEventListener("visibilitychange", function() {
    if (document.hidden) window.resetTotalInputGerakWorld(false);
});

// Override klikPetaMyWorld: HANYA izinkan klik langsung pada permukaan rumput/peta (bukan elemen UI/joystick)
(function pasangPengamanKlikPetaWorld() {
    let origKlik = window.klikPetaMyWorld;
    window.klikPetaMyWorld = function(e) {
        if (!e) return;
        let now = Date.now();
        if (now - (window._owJoyLastReleaseAt || 0) < 420) return;
        if (now - (window._owOverlayClosedAt || 0) < 350) return;
        if (window._owJoyState && window._owJoyState.active) return;

        let t = e.target;
        if (t && t.closest) {
            if (t.closest(".ow-joystick-zone, .ow-ml-minimap, .ow-sdv-clock-box, .ow-stamina-hud, .myworld-hotbar, .myworld-enter-bar, .ow-decor-toolbar, .world-zone-btn, .ow-tree-actor, .ow-gate-actor, .ow-bug-actor, .ow-forage-actor, .ow-npc-actor, .ow-decor-placed, button")) {
                return;
            }
        }
        if (typeof origKlik === "function") origKlik(e);
    };

    if (typeof window.pulihkanGerakSetelahOverlayWorld === "function") {
        let origPulih = window.pulihkanGerakSetelahOverlayWorld;
        window.pulihkanGerakSetelahOverlayWorld = function() {
            window.resetTotalInputGerakWorld(true);
            origPulih();
        };
    }
})();

// =========================================================================
// 2. MESIN EFEK SUARA PROSEDURAL WEB AUDIO API (0 KB FILE + MUTE TOGGLE)
// =========================================================================
window.myWorldSoundMuted = (localStorage.getItem("mw_sound_muted") === "true");
window._mwAudioCtx = null;

window.mainkanSuaraWorld = function(jenis) {
    if (window.myWorldSoundMuted) return;
    try {
        let AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return;
        if (!window._mwAudioCtx) window._mwAudioCtx = new AudioCtor();
        let ctx = window._mwAudioCtx;
        if (ctx.state === "suspended") ctx.resume();

        let now = ctx.currentTime;
        let playTone = function(freq, endFreq, dur, type, vol, delay) {
            let osc = ctx.createOscillator();
            let gain = ctx.createGain();
            osc.type = type || "sine";
            osc.frequency.setValueAtTime(freq, now + (delay || 0));
            if (endFreq && endFreq !== freq) {
                osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + (delay || 0) + dur);
            }
            gain.gain.setValueAtTime(vol || 0.08, now + (delay || 0));
            gain.gain.exponentialRampToValueAtTime(0.001, now + (delay || 0) + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + (delay || 0));
            osc.stop(now + (delay || 0) + dur + 0.02);
        };

        if (jenis === "chop") {
            playTone(170, 65, 0.11, "triangle", 0.16, 0);
        } else if (jenis === "splash") {
            playTone(320, 620, 0.14, "sine", 0.09, 0);
            playTone(480, 240, 0.12, "sine", 0.07, 0.08);
        } else if (jenis === "coin") {
            playTone(880, 880, 0.08, "sine", 0.09, 0);
            playTone(1320, 1320, 0.14, "sine", 0.09, 0.07);
        } else if (jenis === "catch" || jenis === "levelup") {
            playTone(523, 523, 0.09, "triangle", 0.10, 0);
            playTone(659, 659, 0.09, "triangle", 0.10, 0.09);
            playTone(784, 784, 0.16, "triangle", 0.11, 0.18);
        } else if (jenis === "eat") {
            playTone(380, 520, 0.08, "sine", 0.09, 0);
            playTone(460, 640, 0.10, "sine", 0.09, 0.09);
        } else if (jenis === "error") {
            playTone(220, 140, 0.18, "sawtooth", 0.08, 0);
        } else {
            playTone(540, 640, 0.05, "sine", 0.05, 0);
        }
    } catch (e) {}
};

window.toggleSuaraWorld = function() {
    window.myWorldSoundMuted = !window.myWorldSoundMuted;
    try { localStorage.setItem("mw_sound_muted", String(window.myWorldSoundMuted)); } catch (e) {}
    let btn = document.getElementById("btn-myworld-sound");
    if (btn) btn.innerHTML = window.myWorldSoundMuted ? "🔇" : "🔊";
    if (!window.myWorldSoundMuted) window.mainkanSuaraWorld("click");
};

// =========================================================================
// 3. DATA & KATALOG EKSPANSI V9 (MUSIM, NOKTURNAL, FORAGING, UPGRADE, MUSEUM, NPC)
// =========================================================================
window.MY_WORLD_SEASONS = [
    { id: "semi",    nama: "Musim Semi",    ikon: "🌸", bonus: "Kupu-kupu & bunga mekar lebih melimpah!" },
    { id: "kemarau", nama: "Musim Kemarau", ikon: "☀️", bonus: "Harga jual Madu Lebah +25% lebih tinggi!" },
    { id: "hujan",   nama: "Musim Hujan",   ikon: "🌧️", bonus: "Jamur liar di hutan tumbuh lebih banyak!" },
    { id: "gugur",   nama: "Musim Gugur",   ikon: "🍂", bonus: "Harga jual Ikan & Kayu +20% lebih tinggi!" }
];

window.dapatkanMusimMingguanWorld = function() {
    let weekIndex = Math.floor(Date.now() / (7 * 24 * 3600 * 1000));
    return window.MY_WORLD_SEASONS[weekIndex % 4];
};

// Tambah Spesies Khusus Malam (Nokturnal) ke Katalog Ikan & Serangga
(function tambahSpesiesNokturnal() {
    if (Array.isArray(window.MY_WORLD_FISH_CATALOG) && !window.MY_WORLD_FISH_CATALOG.some(function(f) { return f.id === "ikan_lele_malam"; })) {
        window.MY_WORLD_FISH_CATALOG.push(
            { id: "ikan_lele_malam", nama: "Lele Raksasa Malam", latin: "Clarias batrachus", rarity: "Rare", chance: 14, coin: 175, xp: 34, zoneWidth: 19, speed: 3.1, primary: "#334155", belly: "#94a3b8", fin: "#0f172a", nightOnly: true },
            { id: "ikan_belida",     nama: "Belida Emas",        latin: "Chitala lopis",     rarity: "Legendary", chance: 8, coin: 440, xp: 88, zoneWidth: 13, speed: 3.8, primary: "#eab308", belly: "#fef08a", fin: "#b45309", nightOnly: true }
        );
    }
    if (Array.isArray(window.MY_WORLD_INSECT_CATALOG) && !window.MY_WORLD_INSECT_CATALOG.some(function(b) { return b.id === "kunang_kunang"; })) {
        window.MY_WORLD_INSECT_CATALOG.push(
            { id: "kunang_kunang", nama: "Kunang-Kunang", latin: "Pteroptyx malaccae", ordo: "Coleoptera",  rarity: "Rare",      coin: 75,  xp: 24, zoneWidth: 18, speed: 3.2, ikon: "✨", zones: ["yard", "forest", "river"], nightOnly: true },
            { id: "ngengat_bulan", nama: "Ngengat Bulan", latin: "Actias selene",      ordo: "Lepidoptera", rarity: "Legendary", coin: 165, xp: 48, zoneWidth: 13, speed: 3.8, ikon: "🦋", zones: ["forest", "east_forest", "island"], nightOnly: true }
        );
    }
})();

// Katalog Foraging (Kingdom Fungi & Flora Air)
window.MY_WORLD_FORAGE_CATALOG = [
    { id: "jamur_tiram",  nama: "Jamur Tiram Putih",   latin: "Pleurotus ostreatus",  divisi: "Basidiomycota", ikon: "🍄", coin: 28, xp: 8,  toxic: false, zone: "forest",      fakta: "Jamur pangan saprofit tinggi protein dan serat beta-glukan." },
    { id: "jamur_kuping", nama: "Jamur Kuping Hitam",  latin: "Auricularia auricula", divisi: "Basidiomycota", ikon: "🍄", coin: 36, xp: 10, toxic: false, zone: "forest",      fakta: "Tumbuh di kayu lapuk lembap, kaya zat besi dan antioksidan." },
    { id: "teratai_air",  nama: "Teratai Merah Muda",  latin: "Nymphaea rubra",       divisi: "Magnoliophyta", ikon: "🪷", coin: 55, xp: 15, toxic: false, zone: "island",      fakta: "Tumbuhan hidrofit berdaun lebar mengapung dengan rongga udara aerenkim." },
    { id: "amanita_racun",nama: "Amanita muscaria",    latin: "Amanita muscaria",     divisi: "Basidiomycota", ikon: "🍄", coin: 0,  xp: 12, toxic: true,  zone: "east_forest", fakta: "Jamur bertudung merah berbintik putih yang mengandung toksin muskarin dan asam ibotenat — DILARANG dikonsumsi!" }
];

// Tambah Bahan Jamur & Resep Baru ke My Kitchen + Nilai Kalori (kkal) untuk Stamina
if (window.MY_KITCHEN_INGREDIENTS) {
    window.MY_KITCHEN_INGREDIENTS.jamur_tiram  = { nama: "Jamur Tiram",  ikon: "🍄", gizi: "Protein Nabati & Serat Beta-Glukan", kat: "protein", hargaBeli: 42 };
    window.MY_KITCHEN_INGREDIENTS.jamur_kuping = { nama: "Jamur Kuping", ikon: "🍄", gizi: "Zat Besi & Polisakarida",            kat: "vit",     hargaBeli: 48 };
}
if (window.MY_KITCHEN_RECIPES && !window.MY_KITCHEN_RECIPES.some(function(r) { return r.id === "tumis_jamur"; })) {
    window.MY_KITCHEN_RECIPES.push({
        id: "tumis_jamur", nama: "Tumis Jamur Tiram Bayam", ikon: "🍲",
        req: ["jamur_tiram", "bayam", "wortel"], coin: 235, xp: 42,
        petFoodId: "food_nutri", petFoodNama: "Nutri Bowl",
        gizi: "Protein Jamur + Zat Besi Bayam + Beta-Karoten"
    });
}

window.MY_KITCHEN_CALORIES = {
    bubur_sayur:      { kcal: 320, stamina: 38 },
    omelet_tomat:     { kcal: 380, stamina: 45 },
    perkedel_kedelai: { kcal: 420, stamina: 50 },
    tumis_jamur:      { kcal: 360, stamina: 44 },
    sup_ikan:         { kcal: 480, stamina: 58 },
    toast_madu:       { kcal: 450, stamina: 55 },
    smoothie_alpukat: { kcal: 540, stamina: 68 },
    bento_gurame:     { kcal: 760, stamina: 100 }
};

// Katalog 4 Upgrade Alat & Otomatisasi Lahan
window.MY_WORLD_UPGRADES = [
    { id: "steelAxe",  nama: "Kapak Baja (150 Pohon)",      ikon: "🪓", woodCost: 4, coinCost: 260, deskripsi: "Ketahanan 150 pohon dan cukup 1× ketuk langsung menumbangkan pohon." },
    { id: "bigWater",  nama: "Ember 20L & Tandon 120L",     ikon: "🛢️", woodCost: 3, coinCost: 220, deskripsi: "Kapasitas ember jadi 20 L (+10 L/timba) dan kapasitas Tandon naik ke 120 L." },
    { id: "sprinkler", nama: "Sprinkler Kebun Otomatis",    ikon: "💦", woodCost: 5, coinCost: 350, deskripsi: "Menyiram otomatis seluruh tanaman My Garden dengan menarik air langsung dari Tandon." },
    { id: "proCatch",  nama: "Joran Karbon & Jaring Halus", ikon: "🎣", woodCost: 3, coinCost: 300, deskripsi: "Memperlebar zona tangkap ikan & serangga (+40%) dan menaikkan peluang spesies langka." }
];

// Katalog Museum Biologi & Taksonomi (Donasi + Kuis Kunci Determinasi)
window.MY_WORLD_MUSEUM_EXHIBITS = [
    { id: "ikan_mujair",     hall: "akuarium",    nama: "Ikan Mujair",            latin: "Oreochromis mossambicus", ikon: "🐟", q: "Berdasarkan struktur tulang penyusun rangkanya, Ikan Mujair termasuk kelas...", opts: ["Osteichthyes (Ikan bertulang sejati)", "Chondrichthyes (Ikan bertulang rawan)", "Amphibia", "Reptilia"], ans: 0 },
    { id: "ikan_gurame",     hall: "akuarium",    nama: "Ikan Gurame",            latin: "Osphronemus goramy",      ikon: "🐠", q: "Alat pernapasan tambahan pada ikan gurame yang memungkinkannya mengambil O2 langsung dari udara adalah...", opts: ["Labirin", "Pundi-pundi udara", "Trakea serangga", "Stomata"], ans: 0 },
    { id: "ikan_koi",        hall: "akuarium",    nama: "Ikan Koi Kohaku",        latin: "Cyprinus rubrofuscus",    ikon: "🐟", q: "Ikan Koi merupakan anggota famili ikan air tawar terbesar di dunia, yaitu famili...", opts: ["Cyprinidae", "Felidae", "Poaceae", "Formicidae"], ans: 0 },
    { id: "ikan_arwana",     hall: "akuarium",    nama: "Arwana Super Red",       latin: "Scleropages formosus",    ikon: "🐉", q: "Arwana Super Red adalah ikan endemik yang dilindungi berasal dari perairan sungai pulau...", opts: ["Kalimantan (Sungai Kapuas)", "Bali", "Madura", "Lombok"], ans: 0 },
    { id: "ikan_lele_malam", hall: "akuarium",    nama: "Lele Raksasa Malam",     latin: "Clarias batrachus",       ikon: "🐟", q: "Ciri khas adaptasi nokturnal ikan lele di perairan keruh adalah kumis peraba (sungut) yang berfungsi sebagai...", opts: ["Kemoreseptor dan mekanoreseptor pencari mangsa", "Alat fotosintesis", "Kelenjar racun ular", "Sayap terbang"], ans: 0 },
    { id: "kupu_kuning",     hall: "insektarium", nama: "Kupu-Kupu Kuning",       latin: "Eurema hecabe",           ikon: "🦋", q: "Kupu-kupu bersayap bersisik halus mengalami metamorfosis sempurna dan masuk ke dalam ordo...", opts: ["Lepidoptera", "Coleoptera", "Odonata", "Orthoptera"], ans: 0 },
    { id: "capung_hijau",    hall: "insektarium", nama: "Capung Jarum Hijau",     latin: "Agriocnemis femina",      ikon: "🪰", q: "Capung dengan dua pasang sayap membran memanjang dan fase nimfa akuatik tergolong ordo...", opts: ["Odonata", "Lepidoptera", "Diptera", "Isoptera"], ans: 0 },
    { id: "belalang_sembah", hall: "insektarium", nama: "Belalang Sembah",        latin: "Hierodula vitrea",        ikon: "🦗", q: "Belalang sembah bersifat predator dengan kaki depan pencengkeram dan tergolong ordo...", opts: ["Mantodea", "Coleoptera", "Hymenoptera", "Siphonaptera"], ans: 0 },
    { id: "kumbang_badak",   hall: "insektarium", nama: "Kumbang Badak",          latin: "Oryctes rhinoceros",      ikon: "🪲", q: "Kumbang memiliki sayap depan mengeras seperti perisai (elitra), ciri khas ordo...", opts: ["Coleoptera", "Lepidoptera", "Odonata", "Hemiptera"], ans: 0 },
    { id: "kumbang_emas",    hall: "insektarium", nama: "Kumbang Rusa Emas",      latin: "Cyclommatus metallifer",  ikon: "🪲", q: "Sebagai anggota filum Arthropoda kelas Insecta, tubuh Kumbang Rusa Emas terbagi menjadi...", opts: ["3 bagian (Kepala, Toraks, Abdomen) dan 3 pasang kaki", "2 bagian dan 4 pasang kaki", "Tidak bersegmen dan tanpa rangka luar", "Memiliki tulang belakang sejati"], ans: 0 },
    { id: "kunang_kunang",   hall: "insektarium", nama: "Kunang-Kunang",          latin: "Pteroptyx malaccae",      ikon: "✨", q: "Cahaya bioluminesensi pada abdomen kunang-kunang dihasilkan dari reaksi enzim lusiferase dengan...", opts: ["Lusiferin, ATP, dan Oksigen", "Klorofil dan CO2", "Asam klorida pekat", "Amilum dan iodin"], ans: 0 },
    { id: "jamur_tiram",     hall: "herbarium",   nama: "Jamur Tiram Putih",      latin: "Pleurotus ostreatus",     ikon: "🍄", q: "Jamur Tiram membentuk tubuh buah bertudung penghasil basidiospora sehingga masuk divisi...", opts: ["Basidiomycota", "Bryophyta", "Pteridophyta", "Chlorophyta"], ans: 0 },
    { id: "jamur_kuping",    hall: "herbarium",   nama: "Jamur Kuping Hitam",     latin: "Auricularia auricula",    ikon: "🍄", q: "Dinding sel jamur pada Kingdom Fungi berbeda dari tumbuhan karena tersusun atas zat...", opts: ["Kitin", "Selulosa murni", "Peptidoglikan", "Lignin kayu"], ans: 0 },
    { id: "teratai_air",     hall: "herbarium",   nama: "Teratai Merah Muda",     latin: "Nymphaea rubra",          ikon: "🪷", q: "Jaringan parenkim berongga udara besar pada tangkai daun teratai agar tetap mengapung disebut...", opts: ["Aerenkim", "Sklerenkim", "Kambium gabus", "Velamen"], ans: 0 },
    { id: "padi",            hall: "herbarium",   nama: "Padi Sawah",             latin: "Oryza sativa",            ikon: "🌾", q: "Padi (Oryza sativa) memiliki akar serabut dan tulang daun sejajar sehingga masuk kelas...", opts: ["Monocotyledonae (Liliopsida)", "Dicotyledonae", "Gymnospermae", "Bryopsida"], ans: 0 },
    { id: "kedelai",         hall: "herbarium",   nama: "Kedelai Kuning",         latin: "Glycine max",             ikon: "🫘", q: "Tanaman kedelai penghasil polong bersimbiosis dengan Rhizobium dan tergolong famili...", opts: ["Fabaceae (Leguminosae)", "Poaceae", "Orchidaceae", "Asteraceae"], ans: 0 }
];

// 3 NPC Edukatif di Alun-Alun My World
window.MY_WORLD_NPCS = [
    {
        id: "npc_tani",
        nama: "Pak Tani",
        peran: "Pakar Agronomi & Botani",
        ikon: "👨‍🌾",
        x: 25.0, y: 39.2,
        salam: "Selamat datang di lahan! Ingat ya, air dari Sumur ke Tandon menjaga turgor tanaman dan kesehatan ternak. Jawab pertanyaan botani hari ini untuk bonus Coin!",
        coin: 30, xp: 15,
        pool: [
            { q: "Mengapa penyiraman air sangat vital bagi pertumbuhan tanaman di My Garden?", opts: ["Menjaga tekanan turgor sel, sebagai pelarut mineral hara, dan bahan baku reaksi terang fotosintesis", "Menggantikan seluruh fungsi klorofil", "Menghilangkan gas oksigen dari daun", "Membuat akar berhenti menyerap mineral"], ans: 0 },
            { q: "Peran ekologis lebah madu yang diletakkan di dekat kebun bunga pada My World adalah...", opts: ["Membantu penyerbukan (entomogami) sekaligus menghasilkan madu dari nektar", "Memakan seluruh daun tanaman", "Menghambat pembuahan bunga", "Mengubah tanah menjadi batu"], ans: 0 },
            { q: "Tumbuhan C4 seperti Jagung (Zea mays) sangat efisien tumbuh di musim kemarau panas karena...", opts: ["Meminimalkan fotorespirasi dengan memisahkan tempat fiksasi CO2 dan Siklus Calvin", "Tidak membutuhkan cahaya matahari", "Tidak memiliki stomata", "Hidup sebagai parasit di dalam tanah"], ans: 0 }
        ]
    },
    {
        id: "npc_gizi",
        nama: "Dr. Gizi",
        peran: "Ahli Fisiologi & Nutrisi",
        ikon: "🧑‍⚕️",
        x: 39.6, y: 29.5,
        salam: "Halo! Jangan lupa pantau Stamina Bar-mu dan hitung BMI, BMR, serta TDEE! Asupan kalori seimbang diubah sel menjadi ATP. Siap tantangan nutrisi hari ini?",
        coin: 35, xp: 20,
        pool: [
            { q: "Apa perbedaan mendasar antara BMR (Basal Metabolic Rate) dan TDEE (Total Daily Energy Expenditure)?", opts: ["BMR adalah energi minimum saat istirahat total, sedangkan TDEE mencakup BMR ditambah seluruh aktivitas fisik harian", "BMR selalu lebih besar daripada TDEE", "TDEE hanya menghitung kalori saat tidur", "BMI dan TDEE memiliki rumus yang sama persis"], ans: 0 },
            { q: "Seorang siswa memiliki berat badan 60 kg dan tinggi badan 1,60 m (160 cm). Berapakah nilai BMI-nya dan termasuk kategori apa?", opts: ["23,4 — Berat Badan Normal", "15,2 — Sangat Kurus", "32,5 — Obesitas", "40,0 — Sangat Obesitas"], ans: 0 },
            { q: "Di dalam mitokondria sel, energi kimia dari glukosa hidangan My Kitchen dikonversi melalui respirasi seluler menjadi molekul energi siap pakai bernama...", opts: ["ATP (Adenosin Trifosfat)", "DNA polimerase", "Selulosa", "Hemoglobin"], ans: 0 }
        ]
    },
    {
        id: "npc_prof",
        nama: "Prof. Biologi",
        peran: "Kurator Museum & Ekologi",
        ikon: "👩‍🔬",
        x: 52.8, y: 44.8,
        salam: "Salam ilmiah! Museum Biologi di sebelah barat siap menampung spesimen ikan, serangga, jamur, dan flora untuk diidentifikasi taksonominya. Uji wawasanmu hari ini!",
        coin: 35, xp: 20,
        pool: [
            { q: "Dalam sistem tata nama ganda (Binomial Nomenklatur) pada Oreochromis mossambicus, kata pertama menunjukkan tingkat takson...", opts: ["Genus (huruf pertama kapital)", "Spesies (huruf kecil semua)", "Kingdom", "Filum"], ans: 0 },
            { q: "Mengapa jamur beracun Amanita muscaria di Hutan Timur tidak boleh dikonsumsi sembarangan?", opts: ["Mengandung senyawa toksik muskarin dan asam ibotenat yang mengganggu sistem saraf", "Karena merupakan tumbuhan berklorofil", "Karena tidak memiliki dinding sel", "Karena termasuk golongan bakteri"], ans: 0 },
            { q: "Dalam jaring-jaring makanan ekosistem hutan, peran jamur saprofit seperti Jamur Tiram dan Jamur Kuping adalah sebagai...", opts: ["Dekomposer (pengurai bahan organik kayu lapuk menjadi mineral)", "Produsen fotosintetik", "Konsumen puncak karnivora", "Parasit obligat darah"], ans: 0 }
        ]
    }
];

// Daftarkan Zona & Collision Gedung Museum Biologi
(function daftarMuseumBiologiWorld() {
    if (!window.MY_WORLD_ZONES.some(function(z) { return z.id === "museum"; })) {
        window.MY_WORLD_ZONES.push({
            id: "museum",
            nama: "Museum Biologi & Taksonomi",
            labelSingkat: "🏛️ Museum",
            doorX: 43.2,
            doorY: 54.0,
            exitX: 43.2,
            exitY: 58.2
        });
    }
    if (!window.MY_WORLD_OBSTACLES.some(function(o) { return o.id === "gedung_museum"; })) {
        window.MY_WORLD_OBSTACLES.push({
            id: "gedung_museum",
            x1: 39.0,
            x2: 47.4,
            y1: 42.0,
            y2: 52.5
        });
    }
})();

// Pastikan Data V9 di profil siswa (0 extra reads)
window.pastikanDataV9Expansion = function(uName) {
    let lb = window.pastikanDataV8MyWorld(uName || sessionStorage.getItem("username"));
    if (!lb || !lb.myWorldData) return null;
    let wd = lb.myWorldData;

    if (typeof wd.stamina !== "number" || isNaN(wd.stamina)) wd.stamina = 100;
    if (typeof wd.lastStaminaAt !== "number") wd.lastStaminaAt = Date.now();
    // Regenerasi stamina pasif: +1 setiap 20 detik
    let elapsedRegen = Math.floor((Date.now() - wd.lastStaminaAt) / 20000);
    if (elapsedRegen > 0) {
        wd.stamina = Math.min(100, wd.stamina + elapsedRegen);
        wd.lastStaminaAt = Date.now();
    }

    if (!wd.bioProfile || typeof wd.bioProfile !== "object") {
        wd.bioProfile = { gender: "L", age: 16, weightKg: 55, heightCm: 165, activity: 1.55 };
    }
    if (!wd.staminaFoods || typeof wd.staminaFoods !== "object") wd.staminaFoods = {};
    if (!wd.upgrades || typeof wd.upgrades !== "object") {
        wd.upgrades = { steelAxe: false, bigWater: false, sprinkler: false, proCatch: false };
    }
    if (!wd.forageInventory || typeof wd.forageInventory !== "object") wd.forageInventory = {};
    if (!Array.isArray(wd.bioDexSeen)) wd.bioDexSeen = wd.bioDexSeen ? Object.values(wd.bioDexSeen) : [];
    if (!Array.isArray(wd.bioDexClaimed)) wd.bioDexClaimed = wd.bioDexClaimed ? Object.values(wd.bioDexClaimed) : [];
    if (!Array.isArray(wd.museumDonated)) wd.museumDonated = wd.museumDonated ? Object.values(wd.museumDonated) : [];
    if (!wd.npcQuizDone || typeof wd.npcQuizDone !== "object") wd.npcQuizDone = {};
    if (typeof wd.sprinklerLastDate !== "string") wd.sprinklerLastDate = "";

    return lb;
};

window.catatBioDexTerbuka = function(lb, itemId) {
    if (!lb || !lb.myWorldData || !itemId) return;
    if (!Array.isArray(lb.myWorldData.bioDexSeen)) lb.myWorldData.bioDexSeen = [];
    if (lb.myWorldData.bioDexSeen.indexOf(itemId) === -1) {
        lb.myWorldData.bioDexSeen.push(itemId);
    }
};

// =========================================================================
// 4. SISTEM STAMINA + KALKULATOR BMI, BMR, TDEE + KONSUMSI BEKAL DAPUR
// =========================================================================
window.pakaiStaminaWorld = function(cost, namaAksi) {
    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    if (!lb) return true;
    let wd = lb.myWorldData;
    if (wd.stamina < cost) {
        window.mainkanSuaraWorld("error");
        window.tampilkanCustomDialog(
            "confirm",
            "⚡ Stamina tidak cukup untuk " + (namaAksi || "aktivitas ini") + " (Butuh " + cost + " ⚡, Sisa " + wd.stamina + "/100 ⚡).\n\nBuka Panel Energi & Bekal Makanan untuk memulihkan stamina?",
            null,
            function(yes) {
                if (yes) window.bukaOverlayStaminaBMI();
                else window.pulihkanGerakSetelahOverlayWorld();
            }
        );
        return false;
    }
    wd.stamina = Math.max(0, wd.stamina - cost);
    wd.lastStaminaAt = Date.now();
    window.simpanDataWorldKeServer(lb);
    window.perbaruiBarStaminaHUD();
    return true;
};

window.perbaruiBarStaminaHUD = function() {
    let el = document.getElementById("myworld-stamina-bar");
    if (!el) return;
    if (window.modeKunjunganWorld) { el.style.display = "none"; return; }
    el.style.display = "flex";
    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    let stVal = lb ? Math.round(lb.myWorldData.stamina) : 100;
    let col = stVal <= 20 ? "#ef4444" : (stVal <= 50 ? "#f59e0b" : "#22c55e");
    el.innerHTML =
        '<div class="ow-st-top"><span>⚡ Stamina &amp; BMI/TDEE</span><b>' + stVal + '/100</b></div>' +
        '<div class="ow-st-track"><div class="ow-st-fill" style="width:' + stVal + '%; background:' + col + ';"></div></div>';
};

window.hitungMetabolismeTubuh = function(prof) {
    let g = prof.gender === "P" ? "P" : "L";
    let age = Math.max(10, Math.min(80, Number(prof.age) || 16));
    let w = Math.max(25, Math.min(180, Number(prof.weightKg) || 55));
    let h = Math.max(110, Math.min(220, Number(prof.heightCm) || 165));
    let act = Number(prof.activity) || 1.55;

    let hM = h / 100;
    let bmi = Number((w / (hM * hM)).toFixed(1));
    let bmiKat = "Normal";
    let bmiCol = "#16a34a";
    if (bmi < 18.5) { bmiKat = "Berat Kurang (Underweight)"; bmiCol = "#0284c7"; }
    else if (bmi < 25) { bmiKat = "Berat Ideal (Normal)"; bmiCol = "#16a34a"; }
    else if (bmi < 30) { bmiKat = "Berat Berlebih (Overweight)"; bmiCol = "#d97706"; }
    else { bmiKat = "Obesitas"; bmiCol = "#dc2626"; }

    // Rumus Mifflin-St Jeor
    let bmr = Math.round((10 * w) + (6.25 * h) - (5 * age) + (g === "L" ? 5 : -161));
    let tdee = Math.round(bmr * act);

    return { bmi: bmi, bmiKat: bmiKat, bmiCol: bmiCol, bmr: bmr, tdee: tdee };
};

window.bukaOverlayStaminaBMI = function() {
    window.resetTotalInputGerakWorld(false);
    window.renderOverlayStaminaBMI();
    let ov = document.getElementById("myworld-stamina-overlay");
    if (ov) ov.style.display = "flex";
};

window.tutupOverlayStaminaBMI = function() {
    let ov = document.getElementById("myworld-stamina-overlay");
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

window.ubahProfilBioStamina = function(field, val) {
    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    if (!lb) return;
    let p = lb.myWorldData.bioProfile;
    if (field === "gender") p.gender = val;
    else if (field === "activity") p.activity = parseFloat(val) || 1.55;
    else p[field] = parseFloat(val) || p[field];
    window.simpanDataWorldKeServer(lb);
    window.renderOverlayStaminaBMI();
};

window.makanBekalStaminaWorld = function(recipeId) {
    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    if (!lb) return;
    let wd = lb.myWorldData;
    let qty = Number((wd.staminaFoods || {})[recipeId]) || 0;
    if (qty <= 0) return;
    let cal = window.MY_KITCHEN_CALORIES[recipeId] || { kcal: 350, stamina: 40 };

    wd.staminaFoods[recipeId] = qty - 1;
    if (wd.staminaFoods[recipeId] <= 0) delete wd.staminaFoods[recipeId];
    wd.stamina = Math.min(100, (Number(wd.stamina) || 0) + cal.stamina);
    wd.lastStaminaAt = Date.now();

    window.simpanDataWorldKeServer(lb);
    window.mainkanSuaraWorld("eat");
    window.perbaruiBarStaminaHUD();
    window.renderOverlayStaminaBMI();
    window.tampilkanToastEnvMyWorld("⚡ Mengonsumsi " + cal.kcal + " kkal! Stamina pulih +" + cal.stamina + " ⚡ (Respirasi Seluler ➔ ATP).");
};

window.renderOverlayStaminaBMI = function() {
    let ov = document.getElementById("myworld-stamina-overlay");
    if (!ov) return;
    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    if (!lb) return;
    let wd = lb.myWorldData;
    let p = wd.bioProfile;
    let m = window.hitungMetabolismeTubuh(p);

    let foodKeys = Object.keys(wd.staminaFoods || {}).filter(function(k) { return (Number(wd.staminaFoods[k]) || 0) > 0; });
    let foodsHtml = foodKeys.length === 0
        ? '<div class="exp-empty-note">Belum ada bekal makanan di tas. Masak hidangan di <b>🍳 My Kitchen</b> lalu pilih <b>⚡ Simpan Bekal Stamina</b>!</div>'
        : foodKeys.map(function(rid) {
              let r = (window.MY_KITCHEN_RECIPES || []).find(function(x) { return x.id === rid; });
              let cal = window.MY_KITCHEN_CALORIES[rid] || { kcal: 350, stamina: 40 };
              if (!r) return "";
              return '<div class="exp-food-row">' +
                  '<span>' + r.ikon + ' <b>' + r.nama + '</b> (x' + wd.staminaFoods[rid] + ')<br><small>' + cal.kcal + ' kkal • Pulih +' + cal.stamina + ' ⚡ Stamina</small></span>' +
                  '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:6px 12px;" onclick="window.makanBekalStaminaWorld(\'' + rid + '\')">🍽️ Makan</button>' +
              '</div>';
          }).join('');

    ov.innerHTML =
        '<div class="ws-modal-card" style="max-width:620px;">' +
            '<div class="ws-modal-head">' +
                '<div><strong>⚡ Energi Tubuh, Stamina, &amp; Analisis BMI / BMR / TDEE</strong><small>Keterkaitan Asupan Kalori My Kitchen ➔ Respirasi Seluler (ATP) ➔ Stamina Fisik</small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupOverlayStaminaBMI()">✕</button>' +
            '</div>' +
            '<div class="world-shop-body" style="display:flex; flex-direction:column; gap:10px;">' +
                '<div class="exp-card-box">' +
                    '<div class="garden-prog-top"><span>⚡ Stamina Avatar Saat Ini (Regen Pasif +1/20 dtk)</span><b>' + Math.round(wd.stamina) + ' / 100 ⚡</b></div>' +
                    '<div class="garden-prog-track" style="height:13px; margin-bottom:8px;"><div class="garden-prog-fill" style="width:' + Math.round(wd.stamina) + '%;"></div></div>' +
                    '<div style="font-size:11.5px; font-weight:900; color:#5c3210; margin-bottom:6px;">🍱 Bekal Hidangan dari My Kitchen:</div>' +
                    foodsHtml +
                '</div>' +
                '<div class="exp-card-box">' +
                    '<div style="font-size:12.5px; font-weight:900; color:#0b3954; margin-bottom:8px;">📊 Laboratorium Kalkulator BMI, BMR, &amp; TDEE (Fisiologi Metabolisme)</div>' +
                    '<div class="exp-bmi-inputs">' +
                        '<label>Kelamin<select onchange="window.ubahProfilBioStamina(\'gender\', this.value)"><option value="L"' + (p.gender === "L" ? " selected" : "") + '>Laki-laki</option><option value="P"' + (p.gender === "P" ? " selected" : "") + '>Perempuan</option></select></label>' +
                        '<label>Usia (th)<input type="number" min="10" max="80" value="' + p.age + '" onchange="window.ubahProfilBioStamina(\'age\', this.value)"></label>' +
                        '<label>Berat (kg)<input type="number" min="25" max="180" value="' + p.weightKg + '" onchange="window.ubahProfilBioStamina(\'weightKg\', this.value)"></label>' +
                        '<label>Tinggi (cm)<input type="number" min="110" max="220" value="' + p.heightCm + '" onchange="window.ubahProfilBioStamina(\'heightCm\', this.value)"></label>' +
                    '</div>' +
                    '<label class="exp-act-label">Tingkat Aktivitas Fisik Harian:' +
                        '<select onchange="window.ubahProfilBioStamina(\'activity\', this.value)">' +
                            '<option value="1.2"' + (p.activity === 1.2 ? " selected" : "") + '>1,2 — Sedenter (minim gerak / duduk)</option>' +
                            '<option value="1.375"' + (p.activity === 1.375 ? " selected" : "") + '>1,375 — Aktivitas Ringan (olahraga 1–3×/minggu)</option>' +
                            '<option value="1.55"' + (p.activity === 1.55 ? " selected" : "") + '>1,55 — Aktivitas Sedang (olahraga 3–5×/minggu)</option>' +
                            '<option value="1.725"' + (p.activity === 1.725 ? " selected" : "") + '>1,725 — Aktivitas Berat (olahraga 6–7×/minggu)</option>' +
                            '<option value="1.9"' + (p.activity === 1.9 ? " selected" : "") + '>1,9 — Sangat Berat (atlet latihan intensif)</option>' +
                        '</select>' +
                    '</label>' +
                    '<div class="exp-met-cards">' +
                        '<div class="exp-met-pill"><small>BMI (Indeks Massa Tubuh)</small><b style="color:' + m.bmiCol + ';">' + m.bmi + '</b><span>' + m.bmiKat + '</span></div>' +
                        '<div class="exp-met-pill"><small>BMR (Energi Basal)</small><b>' + m.bmr.toLocaleString("id-ID") + ' kkal</b><span>Kebutuhan organ saat istirahat total</span></div>' +
                        '<div class="exp-met-pill is-tdee"><small>TDEE (Total Harian)</small><b>' + m.tdee.toLocaleString("id-ID") + ' kkal</b><span>Target energi harian untuk jaga berat badan</span></div>' +
                    '</div>' +
                    '<div class="exp-met-note">💡 <b>Konsep Biologi:</b> <b>BMI</b> = BB(kg) / TB(m)². <b>BMR</b> (Mifflin-St Jeor) adalah energi minimum untuk bernapas, detak jantung, dan homeostasis. <b>TDEE</b> = BMR × Faktor Aktivitas. Kelebihan asupan kalori di atas TDEE disimpan sebagai glikogen/lemak, sedangkan kekurangan menurunkan cadangan energi dan stamina.</div>' +
                '</div>' +
            '</div>' +
        '</div>';
};

// =========================================================================
// 5. BUKU ENSIKLOPEDIA ALAM (BIO-DEX + MILESTONE 25% / 50% / 75% / 100%)
// =========================================================================
window.activeBioDexTab = "flora";

window.kumpulkanDataBioDexLengkap = function(lb) {
    let wd = (lb && lb.myWorldData) ? lb.myWorldData : {};
    let seen = Array.isArray(wd.bioDexSeen) ? wd.bioDexSeen : [];
    let gData = (lb && lb.myGardenData) ? lb.myGardenData : { plots: {}, seedInventory: {} };
    let pData = (lb && lb.myPetData) ? lb.myPetData : { ownedPets: {} };
    let fData = (lb && lb.myFarmData) ? lb.myFarmData : { animals: {} };
    let lData = (lb && lb.myLabData) ? lb.myLabData : { records: {} };

    let plantedIds = Object.values(gData.plots || {}).map(function(pl) { return pl && pl.plantId; });
    let seedBaseIds = Object.keys(gData.seedInventory || {}).map(function(k) { return k.split("__")[0]; });
    let farmAnimalIds = Object.values(fData.animals || {}).map(function(a) { return a && a.animalId; });
    let donated = Array.isArray(wd.museumDonated) ? wd.museumDonated : [];

    let hasSeen = function(id, extraCheck) {
        return Boolean(extraCheck || seen.indexOf(id) !== -1 || donated.indexOf(id) !== -1);
    };

    let tabs = {
        flora: (window.MY_GARDEN_CATALOG ? window.MY_GARDEN_CATALOG.plants : []).map(function(p) {
            return { id: p.id, nama: p.nama, latin: p.latin || "", ikon: "🌱", info: p.deskripsi, found: hasSeen(p.id, plantedIds.indexOf(p.id) !== -1 || seedBaseIds.indexOf(p.id) !== -1 || (wd.kitchenInventory && wd.kitchenInventory[p.id])) };
        }),
        pet: (window.MY_PET_CATALOG ? window.MY_PET_CATALOG.pets : []).map(function(p) {
            return { id: p.id, nama: p.spesies + " (" + p.namaDefault + ")", latin: p.rarity, ikon: "🐾", info: (typeof window.dapatkanBioPet === "function" ? window.dapatkanBioPet(p.id) : p.spesies), found: hasSeen("pet_" + p.id, Boolean(pData.ownedPets && pData.ownedPets[p.id])) };
        }),
        farm: (window.MY_FARM_CATALOG ? window.MY_FARM_CATALOG.animals : []).map(function(a) {
            return { id: a.id, nama: a.nama, latin: a.kategori, ikon: a.prodIkon, info: a.deskripsi, found: hasSeen("farm_" + a.id, farmAnimalIds.indexOf(a.id) !== -1) };
        }),
        fish: (window.MY_WORLD_FISH_CATALOG || []).map(function(f) {
            return { id: f.id, nama: f.nama, latin: f.latin + (f.nightOnly ? " • Nokturnal 🌙" : ""), ikon: "🐟", info: "Kelangkaan: " + f.rarity + " • Nilai jual: " + f.coin + " Coin.", found: hasSeen(f.id, Boolean(wd.fishInventory && wd.fishInventory[f.id])) };
        }),
        insect: (window.MY_WORLD_INSECT_CATALOG || []).map(function(b) {
            return { id: b.id, nama: b.nama, latin: b.latin + " (Ordo " + b.ordo + ")" + (b.nightOnly ? " • Malam 🌙" : ""), ikon: b.ikon, info: "Kelangkaan: " + b.rarity + " • Nilai jual: " + b.coin + " Coin.", found: hasSeen(b.id, Boolean(wd.insectInventory && wd.insectInventory[b.id])) };
        }),
        forage: (window.MY_WORLD_FORAGE_CATALOG || []).map(function(m) {
            return { id: m.id, nama: m.nama, latin: m.latin + " (" + m.divisi + ")", ikon: m.ikon, info: m.fakta, found: hasSeen(m.id, Boolean(wd.forageInventory && wd.forageInventory[m.id])) };
        }),
        lab: (window.MY_LAB_CATALOG ? window.MY_LAB_CATALOG.experiments : []).map(function(e) {
            let rec = lData.records && lData.records[e.id];
            return { id: e.id, nama: e.judul, latin: e.sub, ikon: e.ikon, info: e.deskripsi, found: Boolean(rec && Number(rec.completions) > 0) };
        })
    };

    let totalAll = 0, foundAll = 0;
    Object.values(tabs).forEach(function(arr) {
        arr.forEach(function(it) { totalAll++; if (it.found) foundAll++; });
    });
    let pct = totalAll > 0 ? Math.round((foundAll / totalAll) * 100) : 0;
    return { tabs: tabs, totalAll: totalAll, foundAll: foundAll, pct: pct };
};

window.bukaBioDexOverlay = function(tabKey) {
    window.resetTotalInputGerakWorld(false);
    if (tabKey) window.activeBioDexTab = tabKey;
    window.renderBioDexOverlay();
    let ov = document.getElementById("myworld-biodex-overlay");
    if (ov) ov.style.display = "flex";
};

window.tutupBioDexOverlay = function() {
    let ov = document.getElementById("myworld-biodex-overlay");
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

window.klaimMilestoneBioDex = function(pctKey, coinG, xpG) {
    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    if (!lb) return;
    let wd = lb.myWorldData;
    if (wd.bioDexClaimed.indexOf(pctKey) !== -1) return;
    let dex = window.kumpulkanDataBioDexLengkap(lb);
    if (dex.pct < parseInt(pctKey, 10)) return;

    wd.bioDexClaimed.push(pctKey);
    lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + coinG;
    lb.xpTersedia = lb.coin;
    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + xpG;
    lb.xp = lb.xpTotal;

    window.simpanDataWorldKeServer(lb);
    window.mainkanSuaraWorld("levelup");
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.perbaruiBadgeMyWorld();
    window.renderBioDexOverlay();
};

window.renderBioDexOverlay = function() {
    let ov = document.getElementById("myworld-biodex-overlay");
    if (!ov) return;
    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    if (!lb) return;
    let wd = lb.myWorldData;
    let dex = window.kumpulkanDataBioDexLengkap(lb);
    let curTab = window.activeBioDexTab || "flora";

    let tabBtns = [
        { k: "flora",  l: "🌱 Flora" },
        { k: "fish",   l: "🐟 Ikan" },
        { k: "insect", l: "🦋 Serangga" },
        { k: "forage", l: "🍄 Jamur" },
        { k: "farm",   l: "🐄 Ternak" },
        { k: "pet",    l: "🐾 Pet" },
        { k: "lab",    l: "🧪 Lab" }
    ].map(function(t) {
        return '<button type="button" class="ws-tab-btn' + (curTab === t.k ? ' active' : '') + '" onclick="window.bukaBioDexOverlay(\'' + t.k + '\')">' + t.l + '</button>';
    }).join('');

    let milestones = [
        { pct: "25",  c: 100, x: 50 },
        { pct: "50",  c: 200, x: 100 },
        { pct: "75",  c: 350, x: 175 },
        { pct: "100", c: 600, x: 300 }
    ].map(function(m) {
        let done = wd.bioDexClaimed.indexOf(m.pct) !== -1;
        let ready = !done && dex.pct >= parseInt(m.pct, 10);
        return '<button type="button" class="exp-mile-btn' + (done ? ' is-done' : (ready ? ' is-ready' : '')) + '" ' + (ready ? ('onclick="window.klaimMilestoneBioDex(\'' + m.pct + '\',' + m.c + ',' + m.x + ')"') : 'disabled') + '>' +
            '<b>' + m.pct + '%</b><small>' + (done ? '✓ Diklaim' : (ready ? '🎁 Klaim +' + m.c + '🪙' : '🪙' + m.c)) + '</small>' +
        '</button>';
    }).join('');

    let itemsHtml = (dex.tabs[curTab] || []).map(function(it) {
        return '<div class="exp-dex-card' + (it.found ? ' is-found' : ' is-unknown') + '">' +
            '<div class="exp-dex-ico">' + (it.found ? it.ikon : '❓') + '</div>' +
            '<div style="flex:1; min-width:0;">' +
                '<div class="exp-dex-name">' + (it.found ? it.nama : 'Spesimen Belum Ditemukan') + '</div>' +
                '<div class="exp-dex-latin"><i>' + (it.found ? it.latin : 'Jelajahi My World untuk membukanya') + '</i></div>' +
                (it.found ? '<div class="exp-dex-info">' + it.info + '</div>' : '') +
            '</div>' +
        '</div>';
    }).join('');

    ov.innerHTML =
        '<div class="ws-modal-card" style="max-width:680px;">' +
            '<div class="ws-modal-head">' +
                '<div><strong>📖 Bio-Dex — Ensiklopedia Alam Pribadi</strong><small>Koleksi Terbuka: <b>' + dex.foundAll + ' / ' + dex.totalAll + ' (' + dex.pct + '%)</b></small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupBioDexOverlay()">✕</button>' +
            '</div>' +
            '<div class="exp-mile-bar">' + milestones + '</div>' +
            '<div class="ws-tabs-row" style="overflow-x:auto; flex-wrap:nowrap;">' + tabBtns + '</div>' +
            '<div class="world-shop-body"><div class="exp-dex-grid">' + itemsHtml + '</div></div>' +
        '</div>';
};

// =========================================================================
// 6. FORAGING JAMUR & FLORA AIR (TERMASUK JEBAKAN AMANITA MUSCARIA)
// =========================================================================
window.myWorldLiveForage = [];
window._activeForagePick = null;

window.spawnForagingDiPetaWorld = function() {
    let ctx = window.ambilDataOpenWorldTampil();
    let unlocked = ctx.unlockedGates || [];
    let musim = window.dapatkanMusimMingguanWorld();
    let spots = [
        { x: 34, y: 73, zone: "forest" },
        { x: 46, y: 76, zone: "forest" },
        { x: 57, y: 71, zone: "forest" }
    ];
    if (musim.id === "hujan") {
        spots.push({ x: 51, y: 89, zone: "forest" }, { x: 40, y: 86, zone: "forest" });
    }
    if (unlocked.indexOf("gate_east_forest") !== -1) {
        spots.push({ x: 74, y: 86, zone: "east_forest" }, { x: 84, y: 84, zone: "east_forest" }, { x: 92, y: 76, zone: "east_forest" });
    }
    if (unlocked.indexOf("gate_lotus_bridge") !== -1) {
        spots.push({ x: 12, y: 87, zone: "island" }, { x: 14, y: 81, zone: "island" });
    }

    window.myWorldLiveForage = spots.map(function(sp, idx) {
        let pool = window.MY_WORLD_FORAGE_CATALOG.filter(function(m) {
            if (sp.zone === "island") return m.zone === "island";
            if (sp.zone === "east_forest") return m.zone === "east_forest" || m.zone === "forest";
            return m.zone === "forest" || (Math.random() < 0.25 && m.toxic);
        });
        let pick = pool[Math.floor(Math.random() * pool.length)] || window.MY_WORLD_FORAGE_CATALOG[0];
        return { uid: "frg_" + idx + "_" + Date.now(), itemId: pick.id, x: sp.x, y: sp.y };
    });
};

window.renderForageLayerWorld = function() {
    let layer = document.getElementById("myworld-forage-layer");
    if (!layer) return;
    if (window.modeKunjunganWorld) { layer.innerHTML = ""; return; }
    if (!window.myWorldLiveForage || window.myWorldLiveForage.length === 0) window.spawnForagingDiPetaWorld();

    layer.innerHTML = window.myWorldLiveForage.map(function(f) {
        let cfg = window.MY_WORLD_FORAGE_CATALOG.find(function(x) { return x.id === f.itemId; }) || window.MY_WORLD_FORAGE_CATALOG[0];
        return '<button type="button" class="ow-forage-actor' + (cfg.toxic ? ' is-redcap' : '') + '" style="left:' + f.x + '%; top:' + f.y + '%;" onclick="event.stopPropagation(); window.klikForagingWorld(\'' + f.uid + '\')" title="Periksa Spesimen Liar">' +
            '<span>' + cfg.ikon + '</span>' +
        '</button>';
    }).join('');
};

window.klikForagingWorld = function(uid) {
    if (window.modeKunjunganWorld) return;
    let item = window.myWorldLiveForage.find(function(x) { return x.uid === uid; });
    if (!item) return;
    let ws = window.myWorldState;
    let dist = Math.hypot((ws.x - item.x) * 24, (ws.y - item.y) * 15);
    if (dist > 175) {
        ws.targetX = item.x;
        ws.targetY = item.y;
        ws.autoEnterZone = "";
        window._openWorldPendingAction = { type: "forage", id: uid };
        return;
    }
    window.bukaModalForagingWorld(uid);
};

window.bukaModalForagingWorld = function(uid) {
    let item = window.myWorldLiveForage.find(function(x) { return x.uid === uid; });
    if (!item) return;
    let cfg = window.MY_WORLD_FORAGE_CATALOG.find(function(x) { return x.id === item.itemId; });
    if (!cfg) return;
    window.resetTotalInputGerakWorld(false);
    window._activeForagePick = { uid: uid, cfg: cfg };

    let ov = document.getElementById("myworld-forage-overlay");
    if (!ov) return;
    let ciriVisual = cfg.toxic
        ? "Tudung merah menyala dengan bintik-bintik putih, cincin batang (annulus), dan volva di pangkal tangkai."
        : (cfg.id === "teratai_air" ? "Kelopak merah muda mekar di permukaan air dengan daun bundar lebar mengapung." : "Tumbuh bergerombol pada kayu lembap berwarna putih/cokelat gelap tanpa bintik merah mencolok.");

    ov.innerHTML =
        '<div class="ws-modal-card" style="max-width:450px;">' +
            '<div class="ws-modal-head"><div><strong>🍄 Observasi Foraging Alam</strong><small>Identifikasi aman atau beracun sebelum memungut spesimen!</small></div><button type="button" class="mypet-hud-close-btn" onclick="window.tutupModalForagingWorld()">✕</button></div>' +
            '<div class="world-shop-body" style="text-align:center; display:flex; flex-direction:column; gap:10px; align-items:center;">' +
                '<div style="font-size:52px;">' + cfg.ikon + '</div>' +
                '<div style="font-size:15px; font-weight:900; color:#451a03;">' + cfg.nama + ' (<i>' + cfg.latin + '</i>)</div>' +
                '<div class="exp-card-box" style="text-align:left; font-size:11.5px; color:#334155;"><b>🔍 Ciri Morfologi:</b> ' + ciriVisual + '</div>' +
                '<div style="display:flex; gap:8px; width:100%;">' +
                    '<button type="button" class="mypet-green-cta sm" style="flex:1;" onclick="window.aksiKeputusanForaging(\'pick\')">🧺 Pungut ke Tas (−3 ⚡)</button>' +
                    '<button type="button" class="mypet-amber-cta sm" style="flex:1; background:linear-gradient(180deg,#fb7185,#dc2626); border-color:#7f1d1d;" onclick="window.aksiKeputusanForaging(\'avoid\')">⚠️ Hindari (Beracun!)</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    ov.style.display = "flex";
};

window.tutupModalForagingWorld = function() {
    window._activeForagePick = null;
    let ov = document.getElementById("myworld-forage-overlay");
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

window.aksiKeputusanForaging = function(aksi) {
    let pick = window._activeForagePick;
    if (!pick) return;
    let cfg = pick.cfg;
    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    if (!lb) return;
    let wd = lb.myWorldData;

    window.myWorldLiveForage = window.myWorldLiveForage.filter(function(x) { return x.uid !== pick.uid; });
    window.catatBioDexTerbuka(lb, cfg.id);

    if (aksi === "pick") {
        if (cfg.toxic) {
            wd.stamina = Math.max(0, (Number(wd.stamina) || 0) - 15);
            window.mainkanSuaraWorld("error");
            window.simpanDataWorldKeServer(lb);
            window.perbaruiBarStaminaHUD();
            window.tutupModalForagingWorld();
            window.renderForageLayerWorld();
            window.tampilkanToastEnvMyWorld("☠️ Keracunan Muskarin dari <i>Amanita muscaria</i>! Stamina −15 ⚡.");
            return;
        }
        if (!window.pakaiStaminaWorld(3, "memungut spesimen")) {
            window.tutupModalForagingWorld();
            return;
        }
        wd.forageInventory[cfg.id] = (Number(wd.forageInventory[cfg.id]) || 0) + 1;
        if (cfg.id === "jamur_tiram" || cfg.id === "jamur_kuping") {
            window.tambahBahanDapurWorld(lb, cfg.id, 1);
        }
        lb.xpTotal = (Number(lb.xpTotal) || 0) + cfg.xp;
        lb.xp = lb.xpTotal;
        window.simpanDataWorldKeServer(lb);
        window.mainkanSuaraWorld("catch");
        window.tampilkanToastEnvMyWorld("🍄 Berhasil memungut <b>" + cfg.nama + "</b> (+⭐ " + cfg.xp + " XP)! Siap didonasikan ke Museum atau dimasak di Dapur.");
    } else {
        if (cfg.toxic) {
            lb.xpTotal = (Number(lb.xpTotal) || 0) + cfg.xp;
            lb.xp = lb.xpTotal;
            window.simpanDataWorldKeServer(lb);
            window.mainkanSuaraWorld("coin");
            window.tampilkanToastEnvMyWorld("✅ Identifikasi tepat! Menghindari jamur beracun <i>Amanita muscaria</i> (+⭐ " + cfg.xp + " XP).");
        } else {
            window.tampilkanToastEnvMyWorld("ℹ️ " + cfg.nama + " sebenarnya aman & bergizi! Anda meninggalkannya di alam.");
        }
    }

    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.tutupModalForagingWorld();
    window.renderForageLayerWorld();
};

// =========================================================================
// 7. MUSEUM BIOLOGI & TAKSONOMI (DONASI + KUNCI DETERMINASI + MODE VISIT)
// =========================================================================
window.activeMuseumHall = "akuarium";
window._museumQuizTarget = null;

window.bukaModalMuseumBiologi = function() {
    window.resetTotalInputGerakWorld(false);
    window._museumQuizTarget = null;
    window.renderModalMuseumBiologi();
    let ov = document.getElementById("myworld-museum-overlay");
    if (ov) ov.style.display = "flex";
};

window.tutupModalMuseumBiologi = function() {
    window._museumQuizTarget = null;
    let ov = document.getElementById("myworld-museum-overlay");
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

window.cekPunyaSpesimenUntukMuseum = function(lb, exId) {
    if (!lb || !lb.myWorldData) return false;
    let wd = lb.myWorldData;
    return Boolean(
        (wd.fishInventory && wd.fishInventory[exId] > 0) ||
        (wd.insectInventory && wd.insectInventory[exId] > 0) ||
        (wd.forageInventory && wd.forageInventory[exId] > 0) ||
        (wd.kitchenInventory && wd.kitchenInventory[exId] > 0)
    );
};

window.kurangiSpesimenDonasiMuseum = function(lb, exId) {
    let wd = lb.myWorldData;
    ["fishInventory", "insectInventory", "forageInventory", "kitchenInventory"].forEach(function(bagKey) {
        if (wd[bagKey] && wd[bagKey][exId] > 0) {
            wd[bagKey][exId]--;
            if (wd[bagKey][exId] <= 0) delete wd[bagKey][exId];
        }
    });
};

window.mulaiDonasiMuseum = function(exId) {
    let ex = window.MY_WORLD_MUSEUM_EXHIBITS.find(function(x) { return x.id === exId; });
    if (!ex) return;
    let tagged = ex.opts.map(function(t, i) { return { txt: t, ok: i === ex.ans }; }).sort(function() { return Math.random() - 0.5; });
    window._museumQuizTarget = { ex: ex, opts: tagged.map(function(x) { return x.txt; }), ans: tagged.findIndex(function(x) { return x.ok; }) };
    window.renderModalMuseumBiologi();
};

window.jawabKuisDonasiMuseum = function(pickedIdx) {
    let qt = window._museumQuizTarget;
    if (!qt) return;
    if (pickedIdx !== qt.ans) {
        window.mainkanSuaraWorld("error");
        window.tampilkanToastEnvMyWorld("❌ Klasifikasi taksonomi kurang tepat! Pelajari ciri spesimen lalu coba donasikan lagi.");
        window._museumQuizTarget = null;
        window.renderModalMuseumBiologi();
        return;
    }

    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    if (!lb) return;
    let wd = lb.myWorldData;
    window.kurangiSpesimenDonasiMuseum(lb, qt.ex.id);
    if (wd.museumDonated.indexOf(qt.ex.id) === -1) wd.museumDonated.push(qt.ex.id);
    window.catatBioDexTerbuka(lb, qt.ex.id);

    lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + 60;
    lb.xpTersedia = lb.coin;
    lb.xpTotal = (Number(lb.xpTotal) || 0) + 35;
    lb.xp = lb.xpTotal;

    window.simpanDataWorldKeServer(lb);
    window.mainkanSuaraWorld("levelup");
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.perbaruiBadgeMyWorld();
    window._museumQuizTarget = null;
    window.renderModalMuseumBiologi();
    window.tampilkanToastEnvMyWorld("🏛️ <b>" + qt.ex.nama + "</b> resmi dipajang di Museum Biologi! +🪙 60 Coin &amp; +⭐ 35 XP!");
};

window.renderModalMuseumBiologi = function() {
    let ov = document.getElementById("myworld-museum-overlay");
    if (!ov) return;
    let isVisit = Boolean(window.modeKunjunganWorld);
    let lb = isVisit
        ? window.leaderboardSiswaData[window.modeKunjunganWorld]
        : window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    let wd = (lb && lb.myWorldData) ? lb.myWorldData : {};
    let donated = Array.isArray(wd.museumDonated) ? wd.museumDonated : Object.values(wd.museumDonated || {});
    let hostNama = isVisit ? (lb.namaPanggilan || lb.namaLengkap || window.modeKunjunganWorld) : "Anda";

    if (window._museumQuizTarget) {
        let qt = window._museumQuizTarget;
        let letters = ["A", "B", "C", "D"];
        ov.innerHTML =
            '<div class="ws-modal-card" style="max-width:520px;">' +
                '<div class="ws-modal-head"><div><strong>🏛️ Verifikasi Taksonomi Donasi: ' + qt.ex.nama + '</strong><small>Jawab benar untuk memasang spesimen pada etalase Museum!</small></div><button type="button" class="mypet-hud-close-btn" onclick="window._museumQuizTarget=null; window.renderModalMuseumBiologi();">✕</button></div>' +
                '<div class="world-shop-body" style="display:flex; flex-direction:column; gap:10px;">' +
                    '<div class="garden-quiz-question">' + qt.ex.ikon + ' <b>' + qt.ex.nama + ' (<i>' + qt.ex.latin + '</i>)</b><br><br>' + qt.ex.q + '</div>' +
                    '<div class="garden-quiz-opts">' + qt.opts.map(function(t, i) { return '<button type="button" class="garden-quiz-opt" onclick="window.jawabKuisDonasiMuseum(' + i + ')"><b>' + letters[i] + '.</b> <span>' + t + '</span></button>'; }).join('') + '</div>' +
                '</div>' +
            '</div>';
        return;
    }

    let hall = window.activeMuseumHall || "akuarium";
    let list = window.MY_WORLD_MUSEUM_EXHIBITS.filter(function(x) { return x.hall === hall; });
    let cardsHtml = list.map(function(ex) {
        let isDonated = donated.indexOf(ex.id) !== -1;
        let hasInBag = !isVisit && !isDonated && window.cekPunyaSpesimenUntukMuseum(lb, ex.id);
        return '<div class="exp-mus-case' + (isDonated ? ' is-donated' : '') + '">' +
            '<div class="exp-mus-glass">' + (isDonated ? ex.ikon : '⬜') + '</div>' +
            '<div class="cozy-item-name" style="font-size:12px;">' + (isDonated ? ex.nama : 'Etalase Kosong') + '</div>' +
            '<div class="garden-latin-name"><i>' + (isDonated ? ex.latin : ex.nama) + '</i></div>' +
            (isDonated
                ? '<span class="cozy-tag green">✓ Terpajang</span>'
                : (isVisit
                    ? '<span class="cozy-tag neutral">Belum Terisi</span>'
                    : (hasInBag
                        ? '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiDonasiMuseum(\'' + ex.id + '\')">🏛️ Donasikan (+60🪙)</button>'
                        : '<span class="cozy-tag neutral">Cari di My World</span>'))) +
        '</div>';
    }).join('');

    ov.innerHTML =
        '<div class="ws-modal-card" style="max-width:650px;">' +
            '<div class="ws-modal-head">' +
                '<div><strong>🏛️ Museum Biologi &amp; Taksonomi (' + hostNama + ')</strong><small>Koleksi Terpajang: <b>' + donated.length + ' / ' + window.MY_WORLD_MUSEUM_EXHIBITS.length + ' Spesimen</b></small></div>' +
                '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupModalMuseumBiologi()">✕</button>' +
            '</div>' +
            '<div class="ws-tabs-row">' +
                '<button type="button" class="ws-tab-btn' + (hall === "akuarium" ? ' active' : '') + '" onclick="window.activeMuseumHall=\'akuarium\'; window.renderModalMuseumBiologi();">🐟 Akuarium</button>' +
                '<button type="button" class="ws-tab-btn' + (hall === "insektarium" ? ' active' : '') + '" onclick="window.activeMuseumHall=\'insektarium\'; window.renderModalMuseumBiologi();">🦋 Insektarium</button>' +
                '<button type="button" class="ws-tab-btn' + (hall === "herbarium" ? ' active' : '') + '" onclick="window.activeMuseumHall=\'herbarium\'; window.renderModalMuseumBiologi();">🌿 Herbarium &amp; Fungi</button>' +
            '</div>' +
            '<div class="world-shop-body"><div class="ws-pantry-grid">' + cardsHtml + '</div></div>' +
        '</div>';
};

// =========================================================================
// 8. 3 NPC EDUKATIF DI ALUN-ALUN MY WORLD (DIALOG + KUIS HARIAN)
// =========================================================================
window._activeNpcState = null;

window.dapatkanTanggalHariIniWorld = function() {
    let d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};

window.renderNpcLayerWorld = function() {
    let layer = document.getElementById("myworld-npc-layer");
    if (!layer) return;
    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    let doneMap = (lb && lb.myWorldData && lb.myWorldData.npcQuizDone) ? lb.myWorldData.npcQuizDone : {};
    let today = window.dapatkanTanggalHariIniWorld();

    layer.innerHTML = window.MY_WORLD_NPCS.map(function(npc) {
        let ready = !window.modeKunjunganWorld && (doneMap[npc.id] !== today);
        return '<button type="button" class="ow-npc-actor" style="left:' + npc.x + '%; top:' + npc.y + '%;" onclick="event.stopPropagation(); window.bukaDialogNpcWorld(\'' + npc.id + '\')" title="Bicara dengan ' + npc.nama + '">' +
            (ready ? '<span class="ow-npc-quest-mark">!</span>' : '') +
            '<span class="ow-npc-ico">' + npc.ikon + '</span>' +
            '<span class="ow-npc-name">' + npc.nama + '</span>' +
        '</button>';
    }).join('');
};

window.bukaDialogNpcWorld = function(npcId) {
    let npc = window.MY_WORLD_NPCS.find(function(x) { return x.id === npcId; });
    if (!npc) return;
    window.resetTotalInputGerakWorld(false);
    window.mainkanSuaraWorld("click");

    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    let today = window.dapatkanTanggalHariIniWorld();
    let alreadyDone = Boolean(window.modeKunjunganWorld || (lb && lb.myWorldData.npcQuizDone[npc.id] === today));

    let rawQ = npc.pool[Math.floor(Math.random() * npc.pool.length)];
    let tagged = rawQ.opts.map(function(t, i) { return { txt: t, ok: i === rawQ.ans }; }).sort(function() { return Math.random() - 0.5; });
    window._activeNpcState = { npc: npc, done: alreadyDone, q: rawQ.q, opts: tagged.map(function(x) { return x.txt; }), ans: tagged.findIndex(function(x) { return x.ok; }), feedback: "" };

    window.renderDialogNpcWorld();
    let ov = document.getElementById("myworld-npc-overlay");
    if (ov) ov.style.display = "flex";
};

window.tutupDialogNpcWorld = function() {
    window._activeNpcState = null;
    let ov = document.getElementById("myworld-npc-overlay");
    if (ov) ov.style.display = "none";
    window.pulihkanGerakSetelahOverlayWorld();
};

window.jawabKuisNpcWorld = function(pickedIdx) {
    let st = window._activeNpcState;
    if (!st || st.done) return;
    let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
    if (!lb) return;

    st.done = true;
    lb.myWorldData.npcQuizDone[st.npc.id] = window.dapatkanTanggalHariIniWorld();

    if (pickedIdx === st.ans) {
        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + st.npc.coin;
        lb.xpTersedia = lb.coin;
        lb.xpTotal = (Number(lb.xpTotal) || 0) + st.npc.xp;
        lb.xp = lb.xpTotal;
        st.feedback = '<div class="garden-quiz-feedback ok">✅ <b>Jawaban Tepat!</b> Terima kasih atas diskusinya — hadiah <b>+🪙 ' + st.npc.coin + ' Coin &amp; +⭐ ' + st.npc.xp + ' XP</b> telah ditambahkan!</div>';
        window.mainkanSuaraWorld("coin");
    } else {
        st.feedback = '<div class="garden-quiz-feedback err">❌ <b>Kurang Tepat!</b> Kunci: <b>' + st.opts[st.ans] + '</b>. Datang lagi besok untuk diskusi berikutnya!</div>';
        window.mainkanSuaraWorld("error");
    }

    window.simpanDataWorldKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.perbaruiBadgeMyWorld();
    window.renderNpcLayerWorld();
    window.renderDialogNpcWorld();
};

window.renderDialogNpcWorld = function() {
    let ov = document.getElementById("myworld-npc-overlay");
    let st = window._activeNpcState;
    if (!ov || !st) return;
    let npc = st.npc;
    let letters = ["A", "B", "C", "D"];

    let bodyQuiz = st.feedback
        ? st.feedback
        : (st.done
            ? '<div class="exp-empty-note">✅ Anda sudah menyelesaikan tantangan harian bersama <b>' + npc.nama + '</b> hari ini. Kembali lagi besok ya!</div>'
            : '<div class="garden-quiz-question">🧠 <b>Tantangan Harian (+🪙 ' + npc.coin + ' &amp; +' + npc.xp + ' XP):</b><br>' + st.q + '</div>' +
              '<div class="garden-quiz-opts">' + st.opts.map(function(t, i) { return '<button type="button" class="garden-quiz-opt" onclick="window.jawabKuisNpcWorld(' + i + ')"><b>' + letters[i] + '.</b> <span>' + t + '</span></button>'; }).join('') + '</div>');

    ov.innerHTML =
        '<div class="ws-modal-card" style="max-width:520px;">' +
            '<div class="ws-modal-head"><div><strong>' + npc.ikon + ' ' + npc.nama + ' — ' + npc.peran + '</strong><small>Dialog &amp; Misi Biologi Harian My World</small></div><button type="button" class="mypet-hud-close-btn" onclick="window.tutupDialogNpcWorld()">✕</button></div>' +
            '<div class="world-shop-body" style="display:flex; flex-direction:column; gap:10px;">' +
                '<div class="exp-npc-bubble">"' + npc.salam + '"</div>' +
                bodyQuiz +
            '</div>' +
        '</div>';
};

// =========================================================================
// 9. UPGRADE ALAT & OTOMATISASI SPRINKLER + INTEGRASI OVERRIDE TERPADU
// =========================================================================
window.beliUpgradeAlatWorld = function(upId) {
    let cfg = window.MY_WORLD_UPGRADES.find(function(u) { return u.id === upId; });
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataV9Expansion(uName);
    if (!cfg || !lb) return;
    let wd = lb.myWorldData;
    if (wd.upgrades[upId]) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    let wood = Number(wd.woodCount) || 0;
    if (wood < cfg.woodCost || saldo < cfg.coinCost) {
        return window.tampilkanCustomDialog("alert", "Sumber daya belum cukup untuk " + cfg.nama + "!\nButuh: " + cfg.woodCost + " 🪵 Kayu (Punya: " + wood + ") & " + cfg.coinCost + " 🪙 Coin (Punya: " + saldo.toLocaleString("id-ID") + ").", null, null);
    }

    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(cfg.coinCost, "upgrade_" + upId, true)) {
        wd.woodCount = Math.max(0, wood - cfg.woodCost);
        wd.upgrades[upId] = true;
        if (upId === "steelAxe") { wd.hasAxe = true; wd.axeDurability = 150; }
        if (upId === "proCatch") { wd.hasFishingRod = true; wd.hasBugNet = true; }
        window.simpanDataWorldKeServer(lb);
        window.mainkanSuaraWorld("levelup");
        window.perbaruiBadgeMyWorld();
        window.renderHotbarAlatWorld();
        window.renderWorldShopUI();
        window.tampilkanToastEnvMyWorld("⬆️ Berhasil upgrade <b>" + cfg.nama + "</b>!");
    }
};

window.jalankanSprinklerOtomatisKebun = function(uName) {
    let lb = window.pastikanDataV9Expansion(uName);
    if (!lb || !lb.myWorldData.upgrades.sprinkler) return 0;
    if (typeof window.pastikanStrukturMyGarden !== "function" || typeof window.hitungStatusPetakKebun !== "function") return 0;

    window.pastikanStrukturMyGarden(uName);
    let plots = (lb.myGardenData && lb.myGardenData.plots) ? lb.myGardenData.plots : {};
    let wd = lb.myWorldData;
    let disiram = 0;

    Object.keys(plots).forEach(function(k) {
        let pObj = plots[k];
        if (!pObj || pObj.watered || wd.waterTank <= 0) return;
        let info = window.hitungStatusPetakKebun(pObj);
        if (info && (info.status === "sprout" || info.status === "growing")) {
            pObj.readyAt = Math.max(Date.now(), pObj.readyAt - Math.round(info.remainingMs * 0.15));
            pObj.watered = true;
            wd.waterTank = Math.max(0, wd.waterTank - 1);
            disiram++;
        }
    });

    if (disiram > 0) {
        window.simpanDataWorldKeServer(lb);
        if (typeof window.simpanDataKebunKeServer === "function") window.simpanDataKebunKeServer(lb);
    }
    return disiram;
};

// Pasang semua Hook V9: HUD (Bio-Dex & Sound), Gedung Museum, Layer NPC & Foraging,
// Upgrade Tab di Shop, Bekal Stamina di My Kitchen, & Efek Upgrade pada Kapak/Sumur/Tandon/Mancing/Serangga
(function pasangHookEkspansiV9() {
    // 1. Hook pemasangan UI Open-World
    let origPassUI = window.pasangUIStardewMinimapDanAnalog;
    window.pasangUIStardewMinimapDanAnalog = function() {
        if (typeof origPassUI === "function") origPassUI.apply(this, arguments);

        let modal = document.getElementById("modal-my-world");
        let stage = document.getElementById("myworld-stage");
        let camWorld = document.getElementById("myworld-camera-world");
        let box = modal ? modal.querySelector(".myworld-modal-box") : null;
        if (!modal || !stage || !camWorld || !box) return;

        // Tombol HUD: 📖 Bio-Dex & 🔊 Suara
        let hudRight = modal.querySelector(".myworld-hud-right");
        if (hudRight && !document.getElementById("btn-myworld-biodex")) {
            let btnDex = document.createElement("button");
            btnDex.type = "button";
            btnDex.id = "btn-myworld-biodex";
            btnDex.className = "world-biodex-hud-btn";
            btnDex.innerHTML = "📖 Bio-Dex";
            btnDex.onclick = function() { window.bukaBioDexOverlay(); };
            hudRight.insertBefore(btnDex, hudRight.firstChild);
        }
        if (hudRight && !document.getElementById("btn-myworld-sound")) {
            let btnSnd = document.createElement("button");
            btnSnd.type = "button";
            btnSnd.id = "btn-myworld-sound";
            btnSnd.className = "world-sound-hud-btn";
            btnSnd.title = "Hidupkan / Matikan Efek Suara";
            btnSnd.innerHTML = window.myWorldSoundMuted ? "🔇" : "🔊";
            btnSnd.onclick = function() { window.toggleSuaraWorld(); };
            hudRight.insertBefore(btnSnd, hudRight.firstChild);
        }

        // Bilah Stamina Bar di bawah Jam Stardew Valley (Kanan Atas)
        if (!document.getElementById("myworld-stamina-bar")) {
            let stBar = document.createElement("button");
            stBar.type = "button";
            stBar.id = "myworld-stamina-bar";
            stBar.className = "ow-stamina-hud";
            stBar.title = "Buka Panel Energi, Bekal Makanan, & Kalkulator BMI/BMR/TDEE";
            stBar.onclick = function(e) { e.stopPropagation(); window.bukaOverlayStaminaBMI(); };
            stage.appendChild(stBar);
        }

        // Gedung Museum Biologi di Peta & Titik Minimap
        let fac = document.getElementById("ow-facilities-layer");
        if (fac && !document.getElementById("world-zone-museum")) {
            let btnMus = document.createElement("button");
            btnMus.type = "button";
            btnMus.id = "world-zone-museum";
            btnMus.className = "world-zone-btn ow-fac-btn";
            btnMus.style.cssText = "left:43.2%; top:47.0%; width:190px; height:164px;";
            btnMus.title = "Museum Biologi & Taksonomi";
            btnMus.onclick = function(e) { e.stopPropagation(); window.arahkanAvatarKeZona("museum"); };
            btnMus.innerHTML =
                '<div class="world-zone-tag">🏛️ Museum</div>' +
                '<svg viewBox="0 0 180 135" width="164" height="122">' +
                    '<ellipse cx="90" cy="122" rx="82" ry="13" fill="rgba(20,40,35,0.24)"/>' +
                    '<rect x="14" y="106" width="152" height="14" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="3.5"/>' +
                    '<rect x="22" y="46" width="136" height="62" fill="#f8fafc" stroke="#475569" stroke-width="4"/>' +
                    '<rect x="34" y="48" width="14" height="58" fill="#e2e8f0" stroke="#64748b" stroke-width="2.5"/>' +
                    '<rect x="132" y="48" width="14" height="58" fill="#e2e8f0" stroke="#64748b" stroke-width="2.5"/>' +
                    '<path d="M72,108 L72,66 A18,18 0 0,1 108,66 L108,108 Z" fill="#0f766e" stroke="#134e4a" stroke-width="4"/>' +
                    '<polygon points="8,48 90,10 172,48" fill="#0d9488" stroke="#134e4a" stroke-width="4.5" stroke-linejoin="round"/>' +
                    '<circle cx="90" cy="34" r="9" fill="#fef08a" stroke="#78350f" stroke-width="2.5"/>' +
                '</svg>';
            fac.appendChild(btnMus);
        }

        let mm = document.getElementById("myworld-ml-minimap");
        if (mm && !mm.querySelector(".d-mus")) {
            let dot = document.createElement("span");
            dot.className = "ow-ml-dot d-mus";
            dot.style.cssText = "left:43.2%; top:47%;";
            dot.textContent = "🏛️";
            mm.insertBefore(dot, document.getElementById("ow-ml-viewport-rect"));
        }

        // Layer Foraging & NPC
        if (!document.getElementById("myworld-forage-layer")) {
            let fl = document.createElement("div");
            fl.id = "myworld-forage-layer";
            fl.className = "myworld-entities-layer";
            camWorld.appendChild(fl);
        }
        if (!document.getElementById("myworld-npc-layer")) {
            let nl = document.createElement("div");
            nl.id = "myworld-npc-layer";
            nl.className = "myworld-entities-layer";
            camWorld.appendChild(nl);
        }

        // Overlays baru
        ["myworld-biodex-overlay", "myworld-stamina-overlay", "myworld-museum-overlay", "myworld-npc-overlay", "myworld-forage-overlay"].forEach(function(oid) {
            if (!document.getElementById(oid)) {
                let ov = document.createElement("div");
                ov.id = oid;
                ov.className = "myworld-inner-overlay";
                ov.style.display = "none";
                ov.onclick = function(e) {
                    if (e.target !== ov) return;
                    ov.style.display = "none";
                    window.pulihkanGerakSetelahOverlayWorld();
                };
                box.appendChild(ov);
            }
        });
    };

    // 2. Hook daftar overlay terbuka
    let origCekOv = window.apakahOverlayDalamWorldTerbuka;
    window.apakahOverlayDalamWorldTerbuka = function() {
        if (typeof origCekOv === "function" && origCekOv()) return true;
        let ids = ["myworld-biodex-overlay", "myworld-stamina-overlay", "myworld-museum-overlay", "myworld-npc-overlay", "myworld-forage-overlay"];
        return ids.some(function(id) {
            let el = document.getElementById(id);
            return Boolean(el && el.style.display && el.style.display !== "none");
        });
    };

    // 3. Hook masuk zona Museum Biologi
    let origMasukV8 = window.masukKeZonaMyWorld;
    window.masukKeZonaMyWorld = function(zoneId) {
        if (zoneId === "museum") {
            let z = window.MY_WORLD_ZONES.find(function(x) { return x.id === "museum"; });
            let ws = window.myWorldState;
            if (z) { ws.x = z.exitX; ws.y = z.exitY; }
            window.resetTotalInputGerakWorld(false);
            ws.exitCooldownUntil = Date.now() + 1800;
            window.renderPosisiAvatarMyWorld(false);
            window.bukaModalMuseumBiologi();
            return;
        }
        origMasukV8.apply(this, arguments);
    };

    // 4. Hook Pending Action untuk Foraging
    let origBukaWorldV8 = window.bukaModalMyWorld;
    window.bukaModalMyWorld = function() {
        origBukaWorldV8.apply(this, arguments);
        let uName = sessionStorage.getItem("username");
        window.pastikanDataV9Expansion(uName);
        window.resetTotalInputGerakWorld(false);

        let stage = document.getElementById("myworld-stage");
        let musim = window.dapatkanMusimMingguanWorld();
        if (stage) {
            stage.classList.remove("season-semi", "season-kemarau", "season-hujan", "season-gugur");
            stage.classList.add("season-" + musim.id);
        }
        let pill = document.getElementById("myworld-env-pill");
        if (pill) {
            let wkt = window.dapatkanFaseWaktuLokalWorld();
            let cuc = window.dapatkanCuacaLokalMyWorld();
            pill.innerHTML = musim.ikon + " " + musim.nama.replace("Musim ", "") + " • " + wkt.ikon + " " + cuc.ikon;
            pill.title = musim.nama + ": " + musim.bonus + " | " + cuc.efek;
        }

        window.spawnForagingDiPetaWorld();
        window.renderForageLayerWorld();
        window.renderNpcLayerWorld();
        window.perbaruiBarStaminaHUD();

        if (!window.modeKunjunganWorld) {
            let sCnt = window.jalankanSprinklerOtomatisKebun(uName);
            if (sCnt > 0) {
                window.tampilkanToastEnvMyWorld("💦 Sprinkler menyiram otomatis <b>" + sCnt + " petak kebun</b> dari Tandon!");
            }
        }
    };

    let origTutupWorldV8 = window.tutupModalMyWorld;
    window.tutupModalMyWorld = function() {
        ["myworld-biodex-overlay", "myworld-stamina-overlay", "myworld-museum-overlay", "myworld-npc-overlay", "myworld-forage-overlay"].forEach(function(id) {
            let el = document.getElementById(id);
            if (el) el.style.display = "none";
        });
        window.resetTotalInputGerakWorld(true);
        origTutupWorldV8.apply(this, arguments);
    };

    // 5. Hook Tebang Pohon (Stamina + Kapak Baja 1x Tebang + Efek Suara)
    let origTebangV8 = window.eksekusiTebangPohon;
    window.eksekusiTebangPohon = function(treeId) {
        if (!window.pakaiStaminaWorld(6, "menebang pohon")) return;
        let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
        if (lb && lb.myWorldData.upgrades.steelAxe) window._treeHpMap[treeId] = 1;
        window.mainkanSuaraWorld("chop");
        origTebangV8(treeId);
    };

    // 6. Hook Sumur & Tandon (Stamina + Upgrade Ember 20L & Tandon 120L + Efek Suara)
    window.tarikTaliSumurManual = function() {
        let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
        if (!lb) return;
        let maxBucket = lb.myWorldData.upgrades.bigWater ? 20 : 10;
        let gainWater = lb.myWorldData.upgrades.bigWater ? 10 : 5;
        if (lb.myWorldData.wellBucket >= maxBucket) return;
        if (window._wellDrawPct === 0 && !window.pakaiStaminaWorld(4, "menimba sumur")) return;

        window.mainkanSuaraWorld("splash");
        window._wellDrawPct = Math.min(100, window._wellDrawPct + 25);
        if (window._wellDrawPct >= 100) {
            window._wellDrawPct = 0;
            lb.myWorldData.wellBucket = Math.min(maxBucket, (Number(lb.myWorldData.wellBucket) || 0) + gainWater);
            window.simpanDataWorldKeServer(lb);
            window.renderHotbarAlatWorld();
            window.perbaruiMinimapDanJamStardew();
        }
        window.renderOverlaySumurWorld();
    };

    window.aksiTandonAirWorld = function(mode) {
        let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
        if (!lb) return;
        let wd = lb.myWorldData;
        let maxTank = wd.upgrades.bigWater ? 120 : 60;
        if (mode === "pour") {
            let pindah = Math.min(wd.wellBucket, Math.max(0, maxTank - wd.waterTank));
            if (pindah <= 0) return;
            wd.wellBucket -= pindah; wd.waterTank += pindah;
        } else if (mode === "garden") {
            let ambil = Math.min(5, wd.waterTank, Math.max(0, 20 - wd.gardenWater));
            if (ambil <= 0) return;
            wd.waterTank -= ambil; wd.gardenWater += ambil;
        } else if (mode === "farm") {
            let ambilF = Math.min(5, wd.waterTank, Math.max(0, 20 - wd.farmWater));
            if (ambilF <= 0) return;
            wd.waterTank -= ambilF; wd.farmWater += ambilF;
        }
        window.mainkanSuaraWorld("splash");
        window.simpanDataWorldKeServer(lb);
        window.renderHotbarAlatWorld();
        window.perbaruiMinimapDanJamStardew();
        window.renderOverlayTandonWorld();
    };

    // 7. Hook Mancing & Tangkap Serangga (Stamina + Upgrade Pro Zone + Spesies Nokturnal + Bio-Dex)
    window.acakSpesiesIkanSungai = function() {
        let isNight = window.dapatkanFaseWaktuLokalWorld().id === "malam";
        let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
        let pro = Boolean(lb && lb.myWorldData.upgrades.proCatch);
        let pool = window.MY_WORLD_FISH_CATALOG.filter(function(f) { return !f.nightOnly || isNight; });
        let weights = pool.map(function(f) {
            let w = f.chance || 15;
            if (pro && (f.rarity === "Rare" || f.rarity === "Legendary")) w *= 1.8;
            return w;
        });
        let total = weights.reduce(function(a, b) { return a + b; }, 0);
        let roll = Math.random() * total, acc = 0;
        for (let i = 0; i < pool.length; i++) {
            acc += weights[i];
            if (roll <= acc) return pool[i];
        }
        return pool[0];
    };

    let origLemparV8 = window.lemparKailMancing;
    window.lemparKailMancing = function() {
        if (!window.pakaiStaminaWorld(5, "memancing ikan")) return;
        window.mainkanSuaraWorld("splash");
        origLemparV8();
        let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
        if (window._fishingState && lb && lb.myWorldData.upgrades.proCatch) {
            window._fishingState.zoneWidth = Math.min(52, Math.round(window._fishingState.zoneWidth * 1.4));
            window._fishingState.zoneStart = Math.round(14 + Math.random() * Math.max(8, 72 - window._fishingState.zoneWidth));
        }
    };

    let origTarikV8 = window.tarikKailMancing;
    window.tarikKailMancing = function() {
        origTarikV8();
        if (window._fishingState && window._fishingState.phase === "caught" && window._fishingState.targetFish) {
            window.mainkanSuaraWorld("catch");
            let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
            window.catatBioDexTerbuka(lb, window._fishingState.targetFish.id);
            window.simpanDataWorldKeServer(lb);
        }
    };

    let origSpawnBug = window.spawnSeranggaLiarWorld;
    window.spawnSeranggaLiarWorld = function() {
        origSpawnBug();
        let isNight = window.dapatkanFaseWaktuLokalWorld().id === "malam";
        if (isNight && Array.isArray(window.myWorldLiveInsects)) {
            let nightPool = window.MY_WORLD_INSECT_CATALOG.filter(function(b) { return b.nightOnly; });
            if (nightPool.length > 0 && window.myWorldLiveInsects.length > 0) {
                window.myWorldLiveInsects[0].bugId = nightPool[Math.floor(Math.random() * nightPool.length)].id;
            }
        }
    };

    let origBukaBug = window.bukaMiniGameSerangga;
    window.bukaMiniGameSerangga = function(bugUid) {
        if (!window.pakaiStaminaWorld(4, "mengayunkan jaring serangga")) return;
        origBukaBug(bugUid);
        let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
        if (window._bugCatchState && lb && lb.myWorldData.upgrades.proCatch) {
            window._bugCatchState.zoneWidth = Math.min(50, Math.round(window._bugCatchState.zoneWidth * 1.4));
            window.renderMiniGameSeranggaUI();
        }
    };

    let origAyunBug = window.ayunkanJaringSerangga;
    window.ayunkanJaringSerangga = function() {
        origAyunBug();
        if (window._bugCatchState && window._bugCatchState.phase === "caught" && window._bugCatchState.bug) {
            window.mainkanSuaraWorld("catch");
            let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
            window.catatBioDexTerbuka(lb, window._bugCatchState.bug.id);
            window.simpanDataWorldKeServer(lb);
        }
    };

    // 8. Hook My Kitchen: Tambah tombol "⚡ Simpan Bekal Stamina" saat masakan matang
    let origRenderKit = window.renderMyKitchenUI;
    window.renderMyKitchenUI = function() {
        origRenderKit();
        let st = window._kitchenState;
        if (!st || st.tab !== "cooked" || !st.activeRecipe || st.claimed) return;
        let ov = document.getElementById("myworld-kitchen-overlay");
        let stove = ov ? ov.querySelector(".kit-stove-box") : null;
        if (stove && !stove.querySelector(".btn-kit-stamina-pack")) {
            let cal = window.MY_KITCHEN_CALORIES[st.activeRecipe.id] || { kcal: 380, stamina: 45 };
            let btn = document.createElement("button");
            btn.type = "button";
            btn.className = "mypet-green-cta sm btn-kit-stamina-pack";
            btn.style.cssText = "margin-top:8px; max-width:300px; background:linear-gradient(180deg,#38bdf8,#0284c7); border-color:#0c4a6e;";
            btn.innerHTML = "⚡ Simpan Bekal Stamina (" + cal.kcal + " kkal • +" + cal.stamina + " ⚡)";
            btn.onclick = function() { window.simpanMasakanKeBekalStamina(); };
            stove.appendChild(btn);
        }
    };

    window.simpanMasakanKeBekalStamina = function() {
        let st = window._kitchenState;
        if (!st || !st.activeRecipe || st.claimed) return;
        let r = st.activeRecipe;
        let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
        if (!lb) return;
        let wd = lb.myWorldData;
        wd.staminaFoods[r.id] = (Number(wd.staminaFoods[r.id]) || 0) + 1;
        wd.totalDishesCooked = (Number(wd.totalDishesCooked) || 0) + 1;
        lb.xpTotal = (Number(lb.xpTotal) || 0) + Math.round(r.xp * 0.8);
        lb.xp = lb.xpTotal;

        st.claimed = true;
        st.claimedMsg = "⚡ <b>1 " + r.nama + "</b> disimpan ke Bekal Stamina! Klik bilah Stamina di kanan atas My World untuk memakannya.";
        window.simpanDataWorldKeServer(lb);
        window.mainkanSuaraWorld("eat");
        window.renderMyKitchenUI();
    };

    // 9. Hook World Shop: Tambah tab ⬆️ Upgrade + Bonus Musim Gugur (Ikan/Kayu +20%) & Musim Kemarau (Madu +25%)
    let origRenderShopV8 = window.renderWorldShopUI;
    window.renderWorldShopUI = function() {
        let ov = document.getElementById("myworld-shop-overlay");
        if (!ov) return;
        let tab = window.activeWorldShopTab || "gear";
        let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
        if (!lb) return;
        let wd = lb.myWorldData;

        if (tab === "upgrades") {
            let upCards = window.MY_WORLD_UPGRADES.map(function(u) {
                let done = Boolean(wd.upgrades[u.id]);
                return '<div class="ws-item-card">' +
                    '<div class="cozy-card-top-row"><span class="cozy-tag amber">Upgrade</span><span>' + (done ? '✓ Aktif' : 'Tersedia') + '</span></div>' +
                    '<div style="font-size:36px; margin:4px 0;">' + u.ikon + '</div>' +
                    '<div class="cozy-item-name" style="font-size:12px;">' + u.nama + '</div>' +
                    '<div class="cozy-item-sub" style="flex:1;">' + u.deskripsi + '</div>' +
                    (done
                        ? '<button type="button" class="mypet-gray-cta sm" disabled>✓ Sudah Di-Upgrade</button>'
                        : '<button type="button" class="mypet-green-cta sm" onclick="window.beliUpgradeAlatWorld(\'' + u.id + '\')">🪵' + u.woodCost + ' + 🪙' + u.coinCost + '</button>') +
                '</div>';
            }).join('');

            ov.innerHTML =
                '<div class="ws-modal-card">' +
                    '<div class="ws-modal-head"><div><strong>🏪 Toko Lahan — Upgrade &amp; Otomatisasi</strong><small>Gunakan Kayu hasil tebangan + Coin untuk meningkatkan peralatan lahan.</small></div><button type="button" class="mypet-hud-close-btn" onclick="window.tutupWorldShop()">✕</button></div>' +
                    '<div class="ws-tabs-row" style="overflow-x:auto; flex-wrap:nowrap;">' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'gear\')">🛠️ Alat</button>' +
                        '<button type="button" class="ws-tab-btn active" onclick="window.gantiTabWorldShop(\'upgrades\')">⬆️ Upgrade</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'sell\')">🐟 Ikan</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'bugs\')">🦋 Serangga</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'avatar\')">👕 Avatar</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'pantry\')">🧺 Bahan</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'decor\')">🪴 Dekor</button>' +
                    '</div>' +
                    '<div class="world-shop-body"><div class="ws-fish-sell-grid">' + upCards + '</div></div>' +
                '</div>';
            return;
        }

        origRenderShopV8();
        let tabsRow = ov.querySelector(".ws-tabs-row");
        if (tabsRow && !tabsRow.querySelector('[data-ws-tab="upgrades"]')) {
            let btnUp = document.createElement("button");
            btnUp.type = "button";
            btnUp.setAttribute("data-ws-tab", "upgrades");
            btnUp.className = "ws-tab-btn";
            btnUp.innerHTML = "⬆️ Upgrade";
            btnUp.onclick = function() { window.gantiTabWorldShop("upgrades"); };
            tabsRow.insertBefore(btnUp, tabsRow.children[1] || null);
        }
    };

    // 10. Hook Pending Action Foraging di Loop Gerak
    let origTickSetup = window.mulaiLoopGerakMyWorld;
    window.mulaiLoopGerakMyWorld = function() {
        origTickSetup();
        // Monitor pending action forage ringan tanpa menambah beban
        clearInterval(window._foragePendingIv);
        window._foragePendingIv = setInterval(function() {
            if (!window.myWorldState || !window.myWorldState.isOpen) { clearInterval(window._foragePendingIv); return; }
            let act = window._openWorldPendingAction;
            if (act && act.type === "forage" && window.myWorldState.targetX === null) {
                window._openWorldPendingAction = null;
                window.bukaModalForagingWorld(act.id);
            }
        }, 180);
    };
})();
// =========================================================================
// 10. EKSPANSI BESAR V10:
//     - My Kitchen: Ayam Goreng, Ayam Gulai (Santan), Telur, Sup, Cap Cay,
//       Sereal, Susu, Milo, + 10 Jajanan Ciki-Ciki
//     - 20 Spesies Serangga (Insektarium) — Peta Hanya Tulisan "Serangga!"
//     - 20 Spesies Fungi + Pemisahan Hall Herbarium & Fungi di Museum/Bio-Dex
//     - 8 Dekorasi Natal di World Shop (Bisa Diletakkan Bebas di Peta)
// =========================================================================

// --- A. PERLUASAN BAHAN DAPUR, RESEP MY KITCHEN, & 10 JAJANAN CIKI-CIKI ---
(function perluasDapurDanJajananV10() {
    if (!window.MY_KITCHEN_INGREDIENTS) window.MY_KITCHEN_INGREDIENTS = {};
    Object.assign(window.MY_KITCHEN_INGREDIENTS, {
        daging_ayam: { nama: "Daging Ayam",     ikon: "🍗", gizi: "Protein Hewani, Niasin, & Vitamin B6", kat: "protein", hargaBeli: 60 },
        santan:      { nama: "Santan Kelapa",   ikon: "🥥", gizi: "Lemak Nabati (Asam Laurat)",           kat: "lemak",   hargaBeli: 30 },
        sereal:      { nama: "Sereal Gandum",   ikon: "🥣", gizi: "Karbohidrat Kompleks & Serat Pangan",  kat: "karbo",   hargaBeli: 45 },
        milo:        { nama: "Bubuk Milo Malt", ikon: "🍫", gizi: "Ekstrak Malt, Kakao, & Vitamin B",     kat: "karbo",   hargaBeli: 50 },
        kentang:     { nama: "Kentang Segar",   ikon: "🥔", gizi: "Karbohidrat Pati & Kalium",            kat: "karbo",   hargaBeli: 30 },
        singkong:    { nama: "Singkong",        ikon: "🍠", gizi: "Karbohidrat Energi & Serat",           kat: "karbo",   hargaBeli: 25 }
    });

    let resepBaru = [
        { id: "ayam_goreng",  nama: "Ayam Goreng",          ikon: "🍗", req: ["daging_ayam"],                             coin: 145, xp: 24, petFoodId: "food_fresh",  petFoodNama: "Fresh Meal",   gizi: "Protein Hewani & Energi Lemak",           kcal: 460, stamina: 56 },
        { id: "ayam_gulai",   nama: "Ayam Gulai Santan",    ikon: "🍛", req: ["daging_ayam", "santan"],                   coin: 230, xp: 38, petFoodId: "food_feast",  petFoodNama: "Hearty Feast", gizi: "Protein Hewani + Asam Lemak Santan",      kcal: 580, stamina: 72 },
        { id: "telur_goreng", nama: "Telur Goreng",         ikon: "🍳", req: ["telur"],                                   coin: 95,  xp: 16, petFoodId: "food_daily",  petFoodNama: "Pakan Harian", gizi: "Protein Albumin & Lemak Kuning Telur",    kcal: 240, stamina: 30 },
        { id: "telur_rebus",  nama: "Telur Rebus",          ikon: "🥚", req: ["telur"],                                   coin: 90,  xp: 15, petFoodId: "food_daily",  petFoodNama: "Pakan Harian", gizi: "Protein Murni Rendah Minyak",             kcal: 180, stamina: 25 },
        { id: "sup_sayur",    nama: "Sup Sayur Segar",      ikon: "🍲", req: ["wortel", "bayam", "kentang"],              coin: 195, xp: 32, petFoodId: "food_nutri",  petFoodNama: "Nutri Bowl",   gizi: "Karbohidrat + Zat Besi + Beta-Karoten",   kcal: 290, stamina: 36 },
        { id: "ikan_goreng",  nama: "Ikan Goreng",          ikon: "🐟", req: ["ikan_mujair"],                             coin: 165, xp: 28, petFoodId: "food_fresh",  petFoodNama: "Fresh Meal",   gizi: "Protein Hewani & Fosfor",                 kcal: 390, stamina: 48 },
        { id: "tumis_sayur",  nama: "Tumis Sayur-Sayuran",  ikon: "🥗", req: ["bayam", "brokoli", "tomat"],               coin: 215, xp: 36, petFoodId: "food_nutri",  petFoodNama: "Nutri Bowl",   gizi: "Serat Tinggi + Vitamin A, C, & K",        kcal: 260, stamina: 34 },
        { id: "cap_cay",      nama: "Cap Cay Spesial",      ikon: "🥘", req: ["wortel", "brokoli", "telur", "tomat"],     coin: 285, xp: 48, petFoodId: "food_feast",  petFoodNama: "Hearty Feast", gizi: "Protein + Beragam Mikronutrien Sayuran",  kcal: 410, stamina: 52 },
        { id: "sereal_susu",  nama: "Semangkuk Sereal",     ikon: "🥣", req: ["sereal", "susu"],                          coin: 185, xp: 30, petFoodId: "food_nutri",  petFoodNama: "Nutri Bowl",   gizi: "Karbohidrat Kompleks + Kalsium Susu",     kcal: 350, stamina: 44 },
        { id: "susu_hangat",  nama: "Susu Segar Hangat",    ikon: "🥛", req: ["susu"],                                    coin: 110, xp: 18, petFoodId: "food_daily",  petFoodNama: "Pakan Harian", gizi: "Kalsium, Protein Kasein, & Laktosa",      kcal: 210, stamina: 28 },
        { id: "milo_susu",    nama: "Milo Susu Energi",     ikon: "🍫", req: ["milo", "susu"],                            coin: 195, xp: 32, petFoodId: "food_nutri",  petFoodNama: "Nutri Bowl",   gizi: "Malt Energi + Kalsium & Vitamin B",       kcal: 370, stamina: 46 }
    ];

    if (!Array.isArray(window.MY_KITCHEN_RECIPES)) window.MY_KITCHEN_RECIPES = [];
    if (!window.MY_KITCHEN_CALORIES) window.MY_KITCHEN_CALORIES = {};

    resepBaru.forEach(function(r) {
        if (!window.MY_KITCHEN_RECIPES.some(function(x) { return x.id === r.id; })) {
            window.MY_KITCHEN_RECIPES.push({
                id: r.id, nama: r.nama, ikon: r.ikon, req: r.req,
                coin: r.coin, xp: r.xp, petFoodId: r.petFoodId,
                petFoodNama: r.petFoodNama, gizi: r.gizi
            });
        }
        window.MY_KITCHEN_CALORIES[r.id] = { kcal: r.kcal, stamina: r.stamina };
    });

    // 10 Jajanan Ciki-Ciki (Beli di World Shop & Bisa Dimakan untuk Stamina)
    window.MY_WORLD_SNACKS_CATALOG = [
        { id: "ciki_kentang",  nama: "Keripik Kentang",     ikon: "🥔", harga: 25, kcal: 160, stamina: 16, gizi: "Karbohidrat & Natrium (Camilan)" },
        { id: "ciki_singkong", nama: "Keripik Singkong",    ikon: "🍠", harga: 20, kcal: 150, stamina: 15, gizi: "Pati Singkong Goreng (Camilan)" },
        { id: "ciki_popcorn",  nama: "Pop Corn Mentega",    ikon: "🍿", harga: 25, kcal: 170, stamina: 18, gizi: "Serat Jagung & Lemak Mentega" },
        { id: "ciki_makaroni", nama: "Makaroni Pedas",      ikon: "🌶️", harga: 22, kcal: 155, stamina: 16, gizi: "Karbohidrat Gandum & Kapsaisin" },
        { id: "ciki_pisang",   nama: "Keripik Pisang",      ikon: "🍌", harga: 24, kcal: 165, stamina: 17, gizi: "Kalium & Gula Alami Pisang" },
        { id: "ciki_tempe",    nama: "Keripik Tempe",       ikon: "🫘", harga: 28, kcal: 180, stamina: 20, gizi: "Protein Nabati Kedelai Renyah" },
        { id: "ciki_keju",     nama: "Stik Keju Ciki",      ikon: "🧀", harga: 30, kcal: 190, stamina: 21, gizi: "Kalsium & Lemak Keju" },
        { id: "ciki_wafer",    nama: "Wafer Cokelat",       ikon: "🍫", harga: 26, kcal: 175, stamina: 18, gizi: "Sukrosa Cepat Serap & Kakao" },
        { id: "ciki_kacang",   nama: "Kacang Atom Gurih",   ikon: "🥜", harga: 24, kcal: 170, stamina: 18, gizi: "Lemak Nabati & Protein Kacang" },
        { id: "ciki_jagung",   nama: "Ciki Ring Jagung",    ikon: "🥨", harga: 22, kcal: 150, stamina: 15, gizi: "Tepung Jagung & Kalori Ringan" }
    ];

    window.MY_WORLD_SNACKS_CATALOG.forEach(function(sn) {
        window.MY_KITCHEN_CALORIES[sn.id] = { kcal: sn.kcal, stamina: sn.stamina };
    });
})();

window.beliJajananCikiShop = function(snackId) {
    let sn = (window.MY_WORLD_SNACKS_CATALOG || []).find(function(x) { return x.id === snackId; });
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanDataV9Expansion(uName);
    if (!sn || !lb) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < sn.harga) {
        return window.tampilkanCustomDialog("alert", "Saldo Coin belum mencukupi untuk membeli " + sn.nama + " (" + sn.harga + " Coin).", null, null);
    }
    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(sn.harga, "beli_ciki_" + snackId, true)) {
        lb.myWorldData.staminaFoods[snackId] = (Number(lb.myWorldData.staminaFoods[snackId]) || 0) + 1;
        window.simpanDataWorldKeServer(lb);
        window.mainkanSuaraWorld("coin");
        window.perbaruiBadgeMyWorld();
        window.renderWorldShopUI();
    }
};

// --- B. 8 DEKORASI NATAL DI WORLD SHOP ---
(function tambahDekorasiNatalV10() {
    if (!Array.isArray(window.MY_WORLD_DECOR_CATALOG)) window.MY_WORLD_DECOR_CATALOG = [];
    let xmasItems = [
        { id: "wd_xmas_tree",     nama: "Pohon Natal Berhias",    harga: 120, ikon: "🎄", isChristmas: true, deskripsi: "Pohon cemara Natal berkilau untuk menghias halaman rumah." },
        { id: "wd_xmas_snowman",  nama: "Manusia Salju",          harga: 95,  ikon: "⛄", isChristmas: true, deskripsi: "Boneka salju ceria bertopi dan syal musim dingin." },
        { id: "wd_xmas_gift",     nama: "Tumpukan Kado Natal",    harga: 55,  ikon: "🎁", isChristmas: true, deskripsi: "Kotak kado berpita merah-emas untuk diletakkan di bawah pohon." },
        { id: "wd_xmas_bell",     nama: "Lonceng Natal Emas",     harga: 65,  ikon: "🔔", isChristmas: true, deskripsi: "Lonceng perayaan Natal di pintu rumah atau alun-alun." },
        { id: "wd_xmas_sock",     nama: "Kaos Kaki Natal",        harga: 45,  ikon: "🧦", isChristmas: true, deskripsi: "Hiasan kaos kaki Natal merah hangat." },
        { id: "wd_xmas_reindeer", nama: "Patung Rusa Kutub",      harga: 130, ikon: "🦌", isChristmas: true, deskripsi: "Ornamen rusa kutub penarik kereta musim dingin." },
        { id: "wd_xmas_sleigh",   nama: "Kereta Salju Santa",     harga: 180, ikon: "🛷", isChristmas: true, deskripsi: "Dekorasi kereta salju klasik edisi Natal spesial." },
        { id: "wd_xmas_star",     nama: "Bintang Natal Bercahaya",harga: 85,  ikon: "🌟", isChristmas: true, deskripsi: "Ornamen bintang emas terang yang tampak indah saat malam." }
    ];
    xmasItems.forEach(function(it) {
        if (!window.MY_WORLD_DECOR_CATALOG.some(function(x) { return x.id === it.id; })) {
            window.MY_WORLD_DECOR_CATALOG.push(it);
        }
    });
})();

// --- C. 20 SPESIES SERANGGA (INSEKTARIUM) — PETA HANYA TULISAN "Serangga!" ---
window.MY_WORLD_INSECT_CATALOG = [
    { id: "kupu_kuning",      nama: "Kupu-Kupu Kuning",        latin: "Eurema hecabe",              ordo: "Lepidoptera", rarity: "Common",    coin: 12,  xp: 4,  zoneWidth: 34, speed: 2.0, ikon: "🦋", zones: ["yard", "forest"] },
    { id: "capung_hijau",     nama: "Capung Jarum Hijau",      latin: "Agriocnemis femina",         ordo: "Odonata",     rarity: "Common",    coin: 14,  xp: 5,  zoneWidth: 32, speed: 2.1, ikon: "🪰", zones: ["river", "yard"] },
    { id: "belalang_kayu",    nama: "Belalang Kayu",           latin: "Valanga nigricornis",        ordo: "Orthoptera",  rarity: "Common",    coin: 14,  xp: 5,  zoneWidth: 31, speed: 2.1, ikon: "🦗", zones: ["yard", "forest"] },
    { id: "kepik_tujuh",      nama: "Kumbang Koksi (Kepik)",   latin: "Coccinella septempunctata",  ordo: "Coleoptera",  rarity: "Common",    coin: 16,  xp: 5,  zoneWidth: 30, speed: 2.2, ikon: "🐞", zones: ["yard", "forest"] },
    { id: "semut_rangrang",   nama: "Semut Rangrang",          latin: "Oecophylla smaragdina",      ordo: "Hymenoptera", rarity: "Common",    coin: 12,  xp: 4,  zoneWidth: 33, speed: 2.0, ikon: "🐜", zones: ["yard", "forest"] },
    { id: "jangkrik_kalung",  nama: "Jangkrik Kalung",         latin: "Gryllus bimaculatus",        ordo: "Orthoptera",  rarity: "Common",    coin: 15,  xp: 5,  zoneWidth: 30, speed: 2.2, ikon: "🦗", zones: ["yard", "forest"] },
    { id: "lebah_kayu",       nama: "Lebah Kayu Hitam",        latin: "Xylocopa latipes",           ordo: "Hymenoptera", rarity: "Common",    coin: 18,  xp: 6,  zoneWidth: 29, speed: 2.3, ikon: "🐝", zones: ["yard", "forest"] },
    { id: "belalang_sembah",  nama: "Belalang Sembah",         latin: "Hierodula vitrea",           ordo: "Mantodea",    rarity: "Uncommon",  coin: 26,  xp: 9,  zoneWidth: 25, speed: 2.5, ikon: "🦗", zones: ["forest"] },
    { id: "tonggeret",        nama: "Tonggeret Hutan",         latin: "Dundubia vaginata",          ordo: "Hemiptera",   rarity: "Uncommon",  coin: 28,  xp: 9,  zoneWidth: 24, speed: 2.6, ikon: "🪲", zones: ["forest", "east_forest"] },
    { id: "capung_merah",     nama: "Capung Sambar Merah",     latin: "Neurothemis terminata",      ordo: "Odonata",     rarity: "Uncommon",  coin: 25,  xp: 8,  zoneWidth: 25, speed: 2.5, ikon: "🪰", zones: ["river", "island"] },
    { id: "undur_undur",      nama: "Undur-Undur Dewasa",      latin: "Myrmeleon frontalis",        ordo: "Neuroptera",  rarity: "Uncommon",  coin: 30,  xp: 10, zoneWidth: 24, speed: 2.6, ikon: "🪰", zones: ["forest", "yard"] },
    { id: "belalang_ranting", nama: "Belalang Ranting",        latin: "Phobaeticus serratipes",     ordo: "Phasmatodea", rarity: "Uncommon",  coin: 34,  xp: 11, zoneWidth: 23, speed: 2.7, ikon: "🦗", zones: ["forest", "east_forest"] },
    { id: "kupu_raja",        nama: "Kupu-Kupu Raja",          latin: "Danaus plexippus",           ordo: "Lepidoptera", rarity: "Uncommon",  coin: 32,  xp: 11, zoneWidth: 23, speed: 2.7, ikon: "🦋", zones: ["yard", "island"] },
    { id: "kumbang_badak",    nama: "Kumbang Badak",           latin: "Oryctes rhinoceros",         ordo: "Coleoptera",  rarity: "Rare",      coin: 52,  xp: 16, zoneWidth: 19, speed: 3.1, ikon: "🪲", zones: ["forest", "east_forest"] },
    { id: "kupu_sayap",       nama: "Kupu-Kupu Sayap Burung",  latin: "Ornithoptera priamus",       ordo: "Lepidoptera", rarity: "Rare",      coin: 66,  xp: 20, zoneWidth: 18, speed: 3.2, ikon: "🦋", zones: ["east_forest", "island"] },
    { id: "kunang_kunang",    nama: "Kunang-Kunang",           latin: "Pteroptyx malaccae",         ordo: "Coleoptera",  rarity: "Rare",      coin: 62,  xp: 20, zoneWidth: 18, speed: 3.2, ikon: "✨", zones: ["yard", "forest", "river"], nightOnly: true },
    { id: "kumbang_tanduk",   nama: "Kumbang Tanduk Tiga",     latin: "Chalcosoma atlas",           ordo: "Coleoptera",  rarity: "Rare",      coin: 72,  xp: 22, zoneWidth: 17, speed: 3.3, ikon: "🪲", zones: ["east_forest"] },
    { id: "belalang_anggrek", nama: "Belalang Anggrek",        latin: "Hymenopus coronatus",        ordo: "Mantodea",    rarity: "Rare",      coin: 78,  xp: 24, zoneWidth: 17, speed: 3.3, ikon: "🌸", zones: ["east_forest", "island"] },
    { id: "kumbang_emas",     nama: "Kumbang Rusa Emas",       latin: "Cyclommatus metallifer",     ordo: "Coleoptera",  rarity: "Legendary", coin: 135, xp: 38, zoneWidth: 13, speed: 3.8, ikon: "🪲", zones: ["east_forest", "island"] },
    { id: "ngengat_bulan",    nama: "Ngengat Bulan",           latin: "Actias selene",              ordo: "Lepidoptera", rarity: "Legendary", coin: 145, xp: 42, zoneWidth: 13, speed: 3.8, ikon: "🦋", zones: ["forest", "east_forest", "island"], nightOnly: true }
];

// --- D. 20 SPESIES FUNGI + TERATAI AIR (FORAGING & MUSEUM FUNGI TERPISAH) ---
window.MY_WORLD_FORAGE_CATALOG = [
    { id: "jamur_tiram",       nama: "Jamur Tiram Putih",      latin: "Pleurotus ostreatus",     divisi: "Basidiomycota", ikon: "🍄", coin: 24, xp: 8,  toxic: false, zone: "forest",      fakta: "Basidiomycota saprofit pada kayu lapuk yang kaya protein nabati dan beta-glukan." },
    { id: "jamur_kuping",      nama: "Jamur Kuping Hitam",     latin: "Auricularia auricula",    divisi: "Basidiomycota", ikon: "🍄", coin: 28, xp: 9,  toxic: false, zone: "forest",      fakta: "Basidiomycota bertekstur kenyal menyerupai daun telinga yang kaya zat besi." },
    { id: "jamur_merang",      nama: "Jamur Merang",           latin: "Volvariella volvacea",    divisi: "Basidiomycota", ikon: "🍄", coin: 25, xp: 8,  toxic: false, zone: "forest",      fakta: "Jamur pangan tropis yang tumbuh subur pada substrat jerami padi lembap." },
    { id: "jamur_shiitake",    nama: "Jamur Shiitake",         latin: "Lentinula edodes",        divisi: "Basidiomycota", ikon: "🍄", coin: 34, xp: 11, toxic: false, zone: "forest",      fakta: "Jamur bertudung cokelat kaya senyawa lentinan peningkat imunitas." },
    { id: "jamur_kancing",     nama: "Jamur Kancing",          latin: "Agaricus bisporus",       divisi: "Basidiomycota", ikon: "🍄", coin: 22, xp: 7,  toxic: false, zone: "forest",      fakta: "Basidiomycota yang paling luas dibudidayakan di dunia, sumber vitamin D & selenium." },
    { id: "jamur_enoki",       nama: "Jamur Enoki",            latin: "Flammulina velutipes",    divisi: "Basidiomycota", ikon: "🍄", coin: 30, xp: 10, toxic: false, zone: "forest",      fakta: "Jamur bertangkai panjang putih bergerombol yang tumbuh di kayu gugur lembap." },
    { id: "jamur_lingzhi",     nama: "Jamur Lingzhi",          latin: "Ganoderma lucidum",       divisi: "Basidiomycota", ikon: "🍄", coin: 52, xp: 16, toxic: false, zone: "east_forest", fakta: "Jamur kayu mengilap berkhasiat obat tradisional dengan senyawa triterpenoid." },
    { id: "jamur_truffle",     nama: "Jamur Truffle Hitam",    latin: "Tuber melanosporum",      divisi: "Ascomycota",    ikon: "🍄", coin: 95, xp: 28, toxic: false, zone: "east_forest", fakta: "Ascomycota ektomikoriza bawah tanah yang bersimbiosis dengan akar pohon hutan." },
    { id: "jamur_morel",       nama: "Jamur Morel",            latin: "Morchella esculenta",     divisi: "Ascomycota",    ikon: "🍄", coin: 68, xp: 20, toxic: false, zone: "east_forest", fakta: "Ascomycota bertudung berongga menyerupai sarang lebah (askokarp)." },
    { id: "jamur_payung",      nama: "Jamur Payung Kelapa",    latin: "Macrolepiota procera",    divisi: "Basidiomycota", ikon: "🍄", coin: 36, xp: 11, toxic: false, zone: "forest",      fakta: "Basidiomycota bertudung lebar seperti payung dengan sisik cokelat halus." },
    { id: "jamur_bola",        nama: "Jamur Puffball",         latin: "Lycoperdon perlatum",     divisi: "Basidiomycota", ikon: "🍄", coin: 32, xp: 10, toxic: false, zone: "forest",      fakta: "Basidiomycota berbentuk bola putih yang melepaskan awan basidiospora saat matang." },
    { id: "jamur_karang",      nama: "Jamur Karang",           latin: "Ramaria botrytis",        divisi: "Basidiomycota", ikon: "🍄", coin: 44, xp: 13, toxic: false, zone: "east_forest", fakta: "Basidiomycota bercabang menyerupai terumbu karang di lantai hutan lembap." },
    { id: "jamur_cawan",       nama: "Jamur Cawan Merah",      latin: "Sarcoscypha coccinea",    divisi: "Ascomycota",    ikon: "🍄", coin: 46, xp: 14, toxic: false, zone: "east_forest", fakta: "Ascomycota dengan badan buah apotesium berbentuk cawan merah cerah." },
    { id: "jamur_biolum",      nama: "Jamur Menyala",          latin: "Mycena chlorophos",       divisi: "Basidiomycota", ikon: "🍄", coin: 78, xp: 24, toxic: false, zone: "east_forest", fakta: "Basidiomycota tropis yang memancarkan cahaya hijau bioluminesensi di malam hari." },
    { id: "jamur_tempe",       nama: "Kapang Tempe",           latin: "Rhizopus oryzae",         divisi: "Zygomycota",    ikon: "🍄", coin: 26, xp: 9,  toxic: false, zone: "forest",      fakta: "Zygomycota berhifa senositik (tanpa sekat) yang memfermentasi kedelai menjadi tempe." },
    { id: "jamur_oncom",       nama: "Kapang Oncom Merah",     latin: "Neurospora crassa",       divisi: "Ascomycota",    ikon: "🍄", coin: 28, xp: 9,  toxic: false, zone: "forest",      fakta: "Ascomycota penghasil spora jingga yang berperan dalam fermentasi oncom dan riset genetika." },
    { id: "jamur_penicillium", nama: "Kapang Penisilin",       latin: "Penicillium notatum",     divisi: "Ascomycota",    ikon: "🍄", coin: 58, xp: 18, toxic: false, zone: "east_forest", fakta: "Ascomycota penghasil antibiotik penisilin pertama yang ditemukan Alexander Fleming." },
    { id: "amanita_racun",     nama: "Jamur Lalat (Beracun)",  latin: "Amanita muscaria",        divisi: "Basidiomycota", ikon: "🍄", coin: 0,  xp: 14, toxic: true,  zone: "east_forest", fakta: "Basidiomycota bertudung merah berbintik putih yang mengandung muskarin dan asam ibotenat." },
    { id: "amanita_maut",      nama: "Tudung Maut (Beracun)",  latin: "Amanita phalloides",      divisi: "Basidiomycota", ikon: "🍄", coin: 0,  xp: 18, toxic: true,  zone: "east_forest", fakta: "Mengandung toksin mematikan amatoxin (alfa-amanitin) yang menghambat RNA polimerase II hati." },
    { id: "galerina_racun",    nama: "Galerina Kayu (Beracun)",latin: "Galerina marginata",      divisi: "Basidiomycota", ikon: "🍄", coin: 0,  xp: 16, toxic: true,  zone: "forest",      fakta: "Jamur kayu cokelat kecil yang memproduksi senyawa amatoxin berbahaya bagi organ hati." },
    { id: "teratai_air",       nama: "Teratai Merah Muda",     latin: "Nymphaea rubra",          divisi: "Magnoliophyta", ikon: "🪷", coin: 48, xp: 15, toxic: false, zone: "island",      isPlant: true, fakta: "Tumbuhan hidrofit berdaun lebar mengapung dengan jaringan aerenkim." }
];

// --- E. SUSUN ULANG ETALASE MUSEUM: PISAHKAN AKUARIUM, INSEKTARIUM (20), HERBARIUM, & FUNGI (20) ---
(function bangunEtalaseMuseum4HallV10() {
    let akuarium = [
        { id: "ikan_mujair",     hall: "akuarium", nama: "Ikan Mujair",        latin: "Oreochromis mossambicus", ikon: "🐟", q: "Berdasarkan penyusun rangkanya, Ikan Mujair termasuk kelas...", opts: ["Osteichthyes (Ikan bertulang sejati)", "Chondrichthyes (Ikan bertulang rawan)", "Amphibia", "Reptilia"], ans: 0 },
        { id: "ikan_gurame",     hall: "akuarium", nama: "Ikan Gurame",        latin: "Osphronemus goramy",      ikon: "🐠", q: "Alat pernapasan tambahan ikan gurame untuk mengambil O2 langsung dari udara adalah...", opts: ["Labirin", "Pundi-pundi udara", "Trakea serangga", "Stomata"], ans: 0 },
        { id: "ikan_koi",        hall: "akuarium", nama: "Ikan Koi Kohaku",    latin: "Cyprinus rubrofuscus",    ikon: "🐟", q: "Ikan Koi merupakan anggota famili ikan air tawar...", opts: ["Cyprinidae", "Felidae", "Poaceae", "Formicidae"], ans: 0 },
        { id: "ikan_arwana",     hall: "akuarium", nama: "Arwana Super Red",   latin: "Scleropages formosus",    ikon: "🐉", q: "Habitat alami Arwana Super Red yang dilindungi di Indonesia berasal dari pulau...", opts: ["Kalimantan", "Bali", "Lombok", "Madura"], ans: 0 },
        { id: "ikan_lele_malam", hall: "akuarium", nama: "Lele Raksasa Malam", latin: "Clarias batrachus",       ikon: "🐟", q: "Sungut (kumis) pada ikan lele nokturnal berfungsi utama sebagai...", opts: ["Kemoreseptor dan mekanoreseptor pencari mangsa", "Alat fotosintesis", "Sayap berenang", "Kelenjar racun"], ans: 0 },
        { id: "ikan_belida",     hall: "akuarium", nama: "Belida Emas",        latin: "Chitala lopis",           ikon: "🐟", q: "Ikan Belida memiliki sirip anal panjang menyatu hingga ekor dan termasuk fauna perairan...", opts: ["Air tawar sungai tropis", "Laut dalam kutub", "Gurun pasir", "Puncak gunung es"], ans: 0 }
    ];

    let allOrdos = ["Lepidoptera", "Odonata", "Orthoptera", "Coleoptera", "Hymenoptera", "Mantodea", "Hemiptera", "Neuroptera", "Phasmatodea"];
    let insektarium = window.MY_WORLD_INSECT_CATALOG.map(function(b) {
        let decoys = allOrdos.filter(function(o) { return o !== b.ordo; }).sort(function() { return Math.random() - 0.5; }).slice(0, 3);
        return {
            id: b.id, hall: "insektarium", nama: b.nama, latin: b.latin, ikon: b.ikon,
            q: "Dalam klasifikasi kelas Insecta, " + b.nama + " (" + b.latin + ") termasuk ke dalam ordo...",
            opts: [b.ordo].concat(decoys), ans: 0
        };
    });

    let herbarium = [
        { id: "teratai_air", hall: "herbarium", nama: "Teratai Merah Muda", latin: "Nymphaea rubra",        ikon: "🪷", q: "Jaringan berongga udara pada tangkai daun teratai agar tetap mengapung adalah...", opts: ["Aerenkim", "Sklerenkim", "Velamen", "Kambium gabus"], ans: 0 },
        { id: "padi",        hall: "herbarium", nama: "Padi Sawah",         latin: "Oryza sativa",          ikon: "🌾", q: "Padi berakar serabut dan bertulang daun sejajar sehingga masuk kelas...", opts: ["Monocotyledonae", "Dicotyledonae", "Gymnospermae", "Bryopsida"], ans: 0 },
        { id: "kedelai",     hall: "herbarium", nama: "Kedelai Kuning",     latin: "Glycine max",           ikon: "🫘", q: "Kedelai bersimbiosis dengan Rhizobium dan termasuk famili...", opts: ["Fabaceae", "Poaceae", "Orchidaceae", "Asteraceae"], ans: 0 },
        { id: "bayam",       hall: "herbarium", nama: "Bayam Hijau",        latin: "Amaranthus tricolor",   ikon: "🥬", q: "Mineral mikro utama pada daun bayam untuk menyusun hemoglobin adalah...", opts: ["Zat besi (Fe)", "Natrium (Na)", "Yodium (I)", "Helium (He)"], ans: 0 },
        { id: "jagung",      hall: "herbarium", nama: "Jagung Manis",       latin: "Zea mays",              ikon: "🌽", q: "Jalur fiksasi karbon fotosintesis yang membuat jagung efisien di iklim panas adalah...", opts: ["Jalur C4", "Kemosintesis", "Fermentasi laktat", "Respirasi anaerob"], ans: 0 },
        { id: "wortel",      hall: "herbarium", nama: "Wortel",             latin: "Daucus carota",         ikon: "🥕", q: "Bagian umbi jingga pada wortel merupakan hasil modifikasi dari organ...", opts: ["Akar tunggang (umbi akar)", "Daun sejati", "Kelopak bunga", "Stolon"], ans: 0 },
        { id: "brokoli",     hall: "herbarium", nama: "Brokoli Segar",      latin: "Brassica oleracea",     ikon: "🥦", q: "Bagian kepala hijau brokoli yang dikonsumsi adalah modifikasi dari...", opts: ["Kuncup bunga majemuk", "Umbi lapis", "Rimpang bawah tanah", "Akar napas"], ans: 0 },
        { id: "alpukat",     hall: "herbarium", nama: "Alpukat Mentega",    latin: "Persea americana",      ikon: "🥑", q: "Kandungan makronutrien sehat utama pada daging buah alpukat adalah...", opts: ["Asam lemak tak jenuh tunggal (Omega-9)", "Selulosa murni", "Laktosa susu", "Kitin"], ans: 0 }
    ];

    let allDivs = ["Basidiomycota", "Ascomycota", "Zygomycota", "Deuteromycota"];
    let fungiHall = window.MY_WORLD_FORAGE_CATALOG.filter(function(m) { return !m.isPlant; }).map(function(m) {
        let decoys = allDivs.filter(function(d) { return d !== m.divisi; });
        return {
            id: m.id, hall: "fungi", nama: m.nama, latin: m.latin, ikon: m.ikon,
            q: "Dalam klasifikasi Kingdom Fungi, " + m.nama + " (" + m.latin + ") digolongkan ke dalam divisi...",
            opts: [m.divisi].concat(decoys), ans: 0
        };
    });

    window.MY_WORLD_MUSEUM_EXHIBITS = [].concat(akuarium, insektarium, herbarium, fungiHall);
})();

// --- F. OVERRIDE TAMPILAN SERANGGA DI PETA (TANPA EMOT SERANGGA, HANYA "Serangga!") ---
(function pasangOverrideV10() {
    let origRenderEntitasV9 = window.renderEntitasOpenWorld;
    window.renderEntitasOpenWorld = function() {
        origRenderEntitasV9();
        let insectsLayer = document.getElementById("myworld-insects-layer");
        let ctx = window.ambilDataOpenWorldTampil();
        if (insectsLayer && !ctx.isVisit) {
            insectsLayer.innerHTML = (window.myWorldLiveInsects || []).map(function(it) {
                return '<button type="button" class="ow-bug-actor is-text-only-bug" style="left:' + it.x.toFixed(1) + '%; top:' + it.y.toFixed(1) + '%;" onclick="event.stopPropagation(); window.klikSeranggaOpenWorld(\'' + it.uid + '\')" title="Tangkap Serangga">' +
                    '<span class="ow-bug-only-text">Serangga!</span>' +
                '</button>';
            }).join('');
        }
    };

    // Perbanyak titik muncul serangga & jamur agar 20 spesies terasa hidup di peta luas
    window.spawnSeranggaLiarWorld = function() {
        let ctx = window.ambilDataOpenWorldTampil();
        let unlocked = ctx.unlockedGates || [];
        let isNight = window.dapatkanFaseWaktuLokalWorld().id === "malam";
        let spots = [
            { x: 25, y: 50, zone: "yard" }, { x: 31, y: 45, zone: "yard" },
            { x: 32, y: 66, zone: "river" }, { x: 37, y: 69, zone: "forest" },
            { x: 48, y: 72, zone: "forest" }, { x: 56, y: 84, zone: "forest" },
            { x: 43, y: 88, zone: "forest" }
        ];
        if (unlocked.indexOf("gate_east_forest") !== -1) {
            spots.push({ x: 75, y: 80, zone: "east_forest" }, { x: 86, y: 76, zone: "east_forest" }, { x: 90, y: 88, zone: "east_forest" });
        }
        if (unlocked.indexOf("gate_lotus_bridge") !== -1) {
            spots.push({ x: 11, y: 84, zone: "island" }, { x: 14, y: 89, zone: "island" });
        }

        window.myWorldLiveInsects = spots.map(function(sp, idx) {
            let pool = window.MY_WORLD_INSECT_CATALOG.filter(function(b) {
                return (!b.nightOnly || isNight) && b.zones.indexOf(sp.zone) !== -1;
            });
            if (pool.length === 0) pool = window.MY_WORLD_INSECT_CATALOG;
            let pick = pool[Math.floor(Math.random() * pool.length)];
            return { uid: "bug_" + idx + "_" + Date.now(), bugId: pick.id, x: sp.x + (Math.random() * 3.5 - 1.75), y: sp.y + (Math.random() * 3.5 - 1.75) };
        });
    };

    // Izinkan koleksi sampel botol kaca saat berhasil menghindari jamur beracun agar bisa didonasikan ke Museum Fungi!
    let origForageAksi = window.aksiKeputusanForaging;
    window.aksiKeputusanForaging = function(aksi) {
        let pick = window._activeForagePick;
        if (pick && pick.cfg && pick.cfg.toxic && aksi === "avoid") {
            let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
            if (lb) {
                lb.myWorldData.forageInventory[pick.cfg.id] = (Number(lb.myWorldData.forageInventory[pick.cfg.id]) || 0) + 1;
                window.simpanDataWorldKeServer(lb);
            }
        }
        origForageAksi(aksi);
    };

    // Museum Biologi: Pisahkan Tab Herbarium & Fungi (4 Hall)
    let origRenderMuseum = window.renderModalMuseumBiologi;
    window.renderModalMuseumBiologi = function() {
        origRenderMuseum();
        if (window._museumQuizTarget) return;
        let ov = document.getElementById("myworld-museum-overlay");
        let tabsRow = ov ? ov.querySelector(".ws-tabs-row") : null;
        if (tabsRow) {
            let h = window.activeMuseumHall || "akuarium";
            tabsRow.innerHTML =
                '<button type="button" class="ws-tab-btn' + (h === "akuarium" ? ' active' : '') + '" onclick="window.activeMuseumHall=\'akuarium\'; window.renderModalMuseumBiologi();">🐟 Akuarium</button>' +
                '<button type="button" class="ws-tab-btn' + (h === "insektarium" ? ' active' : '') + '" onclick="window.activeMuseumHall=\'insektarium\'; window.renderModalMuseumBiologi();">🦋 Insektarium (20)</button>' +
                '<button type="button" class="ws-tab-btn' + (h === "herbarium" ? ' active' : '') + '" onclick="window.activeMuseumHall=\'herbarium\'; window.renderModalMuseumBiologi();">🌿 Herbarium</button>' +
                '<button type="button" class="ws-tab-btn' + (h === "fungi" ? ' active' : '') + '" onclick="window.activeMuseumHall=\'fungi\'; window.renderModalMuseumBiologi();">🍄 Fungi (20)</button>';
        }
    };

    // Bio-Dex: Pastikan Fungi hanya berisi 20 jamur (terpisah dari Teratai/Herbarium)
    let origBioDexData = window.kumpulkanDataBioDexLengkap;
    window.kumpulkanDataBioDexLengkap = function(lb) {
        let res = origBioDexData(lb);
        if (res && res.tabs && Array.isArray(res.tabs.forage)) {
            res.tabs.forage = res.tabs.forage.filter(function(x) { return x.id !== "teratai_air"; });
            let tot = 0, fnd = 0;
            Object.values(res.tabs).forEach(function(arr) { arr.forEach(function(it) { tot++; if (it.found) fnd++; }); });
            res.totalAll = tot;
            res.foundAll = fnd;
            res.pct = tot > 0 ? Math.round((fnd / tot) * 100) : 0;
        }
        return res;
    };

    // Stamina Overlay: Pastikan nama & ikon 10 Jajanan Ciki-Ciki tampil rapi di daftar Bekal
    let origRenderStamina = window.renderOverlayStaminaBMI;
    window.renderOverlayStaminaBMI = function() {
        origRenderStamina();
        let ov = document.getElementById("myworld-stamina-overlay");
        let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
        if (!ov || !lb) return;
        let wd = lb.myWorldData;
        let snackKeys = (window.MY_WORLD_SNACKS_CATALOG || []).filter(function(sn) { return (Number((wd.staminaFoods || {})[sn.id]) || 0) > 0; });
        if (snackKeys.length === 0) return;

        let firstBox = ov.querySelector(".exp-card-box");
        if (!firstBox) return;
        let emptyEl = firstBox.querySelector(".exp-empty-note");
        if (emptyEl) emptyEl.remove();

        snackKeys.forEach(function(sn) {
            let row = document.createElement("div");
            row.className = "exp-food-row";
            row.innerHTML =
                '<span>' + sn.ikon + ' <b>' + sn.nama + '</b> (x' + wd.staminaFoods[sn.id] + ')<br><small>' + sn.kcal + ' kkal • Pulih +' + sn.stamina + ' ⚡ Stamina</small></span>' +
                '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:6px 12px;" onclick="window.makanBekalStaminaWorld(\'' + sn.id + '\')">🍿 Makan</button>';
            firstBox.appendChild(row);
        });
    };

    // World Shop: Tambah Tab 🍿 Jajanan (10 Ciki-Ciki) & Badge Edisi Natal di Tab 🪴 Dekorasi
    let origRenderShopV9 = window.renderWorldShopUI;
    window.renderWorldShopUI = function() {
        let ov = document.getElementById("myworld-shop-overlay");
        if (!ov) return;
        let tab = window.activeWorldShopTab || "gear";
        let lb = window.pastikanDataV9Expansion(sessionStorage.getItem("username"));
        if (!lb) return;
        let wd = lb.myWorldData;

        if (tab === "snacks") {
            let snCards = (window.MY_WORLD_SNACKS_CATALOG || []).map(function(sn) {
                let qty = Number((wd.staminaFoods || {})[sn.id]) || 0;
                return '<div class="ws-item-card" style="padding:8px;">' +
                    '<div class="cozy-card-top-row"><span class="cozy-tag amber">+' + sn.stamina + ' ⚡</span><span class="cozy-stock-lbl">Tas: <b>x' + qty + '</b></span></div>' +
                    '<div style="font-size:30px; margin:4px 0;">' + sn.ikon + '</div>' +
                    '<div class="cozy-item-name" style="font-size:11.5px;">' + sn.nama + '</div>' +
                    '<div class="cozy-item-sub" style="font-size:9.5px;">' + sn.kcal + ' kkal • ' + sn.gizi + '</div>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.beliJajananCikiShop(\'' + sn.id + '\')">🪙 Beli (' + sn.harga + ')</button>' +
                '</div>';
            }).join('');

            ov.innerHTML =
                '<div class="ws-modal-card">' +
                    '<div class="ws-modal-head"><div><strong>🏪 Toko Lahan — 10 Jajanan Ciki-Ciki</strong><small>Camilan praktis pemulih Stamina cepat (masuk otomatis ke Bekal Stamina).</small></div><button type="button" class="mypet-hud-close-btn" onclick="window.tutupWorldShop()">✕</button></div>' +
                    '<div class="ws-tabs-row" style="overflow-x:auto; flex-wrap:nowrap;">' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'gear\')">🛠️ Alat</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'upgrades\')">⬆️ Upgrade</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'sell\')">🐟 Ikan</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'bugs\')">🦋 Serangga</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'avatar\')">👕 Avatar</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'pantry\')">🧺 Bahan</button>' +
                        '<button type="button" data-ws-tab="snacks" class="ws-tab-btn active" onclick="window.gantiTabWorldShop(\'snacks\')">🍿 Jajanan</button>' +
                        '<button type="button" class="ws-tab-btn" onclick="window.gantiTabWorldShop(\'decor\')">🎄 Dekor</button>' +
                    '</div>' +
                    '<div class="world-shop-body"><div class="ws-pantry-grid">' + snCards + '</div></div>' +
                '</div>';
            return;
        }

        origRenderShopV9();

        let tabsRow = ov.querySelector(".ws-tabs-row");
        if (tabsRow) {
            tabsRow.style.overflowX = "auto";
            tabsRow.style.flexWrap = "nowrap";
            if (!tabsRow.querySelector('[data-ws-tab="snacks"]')) {
                let btnSn = document.createElement("button");
                btnSn.type = "button";
                btnSn.setAttribute("data-ws-tab", "snacks");
                btnSn.className = "ws-tab-btn";
                btnSn.innerHTML = "🍿 Jajanan";
                btnSn.onclick = function() { window.gantiTabWorldShop("snacks"); };
                tabsRow.appendChild(btnSn);
            }
        }

        // Tandai item Edisi Natal di tab Dekorasi dengan warna khusus
        if (tab === "decor") {
            let cards = ov.querySelectorAll(".ws-item-card");
            window.MY_WORLD_DECOR_CATALOG.forEach(function(d, idx) {
                if (d.isChristmas && cards[idx]) {
                    cards[idx].classList.add("is-xmas-decor-card");
                    let tag = cards[idx].querySelector(".cozy-tag");
                    if (tag) { tag.textContent = "🎄 Natal"; tag.className = "cozy-tag xmas-tag"; }
                }
            });
        }
    };
})();