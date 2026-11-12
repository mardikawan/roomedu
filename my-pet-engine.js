/* =========================================================================
   MODUL MY PET ENGINE — REBORN:
   - Sistem Dual-XP murni (Total Leaderboard & Tersedia Belanja)
   - 1 Habitat Universal, Tanpa Batas Kapasitas, Menampilkan Semua Pet Sekaligus
   - Katalog Spesies (7), Makanan (6), Camilan (7), Mainan (15), Wardrobe (38)
   ========================================================================= */

window.MY_PET_CATALOG = {
    pets: [
        { id: "kadal",    namaDefault: "Gecko",     spesies: "Kadal",      zona: "land",  rarity: "Common",    harga: 12000,   scale: 0.72, favSnack: "snack_kadal",    warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "kucing",   namaDefault: "Mochi",     spesies: "Kucing",     zona: "land",  rarity: "Common",    harga: 16000,   scale: 0.82, favSnack: "snack_kucing",   warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "anjing",   namaDefault: "Bobi",      spesies: "Anjing",     zona: "land",  rarity: "Common",    harga: 18000,   scale: 0.86, favSnack: "snack_anjing",   warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "ikan",     namaDefault: "Nemo",      spesies: "Ikan",       zona: "water", rarity: "Uncommon",  harga: 32000,   scale: 0.78, favSnack: "snack_ikan",     warnaRarity: "#0284c7", bgRarity: "#e0f2fe" },
        { id: "monyet",   namaDefault: "Koko",      spesies: "Monyet",     zona: "land",  rarity: "Uncommon",  harga: 40000,   scale: 0.84, favSnack: "snack_monyet",   warnaRarity: "#16a34a", bgRarity: "#dcfce7" },
        { id: "buaya",    namaDefault: "Croco",     spesies: "Buaya",      zona: "water", rarity: "Rare",      harga: 58000,   scale: 0.94, favSnack: "snack_buaya",    warnaRarity: "#059669", bgRarity: "#d1fae5" },
        { id: "beruang",  namaDefault: "Bubu",      spesies: "Beruang",    zona: "land",  rarity: "Rare",      harga: 65000,   scale: 0.98, favSnack: "snack_beruang",  warnaRarity: "#2563eb", bgRarity: "#dbeafe" },
        { id: "gajah",    namaDefault: "Dumbo",     spesies: "Gajah",      zona: "land",  rarity: "Epic",      harga: 90000,   scale: 1.08, favSnack: "snack_gajah",    warnaRarity: "#9333ea", bgRarity: "#f3e8ff" },
        { id: "naga",     namaDefault: "Ember",     spesies: "Naga",       zona: "land",  rarity: "Legendary", harga: 140000,  scale: 1.05, favSnack: "snack_naga",     warnaRarity: "#d97706", bgRarity: "#fef3c7" },
        { id: "kecoa",    namaDefault: "Oggy",      spesies: "Kecoa",      zona: "land",  rarity: "Common",    harga: 5000,    scale: 0.62, favSnack: "snack_kecoa",    warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "tikus",    namaDefault: "Jerry",     spesies: "Tikus",      zona: "land",  rarity: "Common",    harga: 8000,    scale: 0.68, favSnack: "snack_tikus",    warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "kelinci",  namaDefault: "Bugs",      spesies: "Kelinci",    zona: "land",  rarity: "Common",    harga: 15000,   scale: 0.80, favSnack: "snack_kelinci",  warnaRarity: "#64748b", bgRarity: "#f1f5f9" },
        { id: "pipit",    namaDefault: "Pipi",      spesies: "Br. Pipit",  zona: "land",  rarity: "Uncommon",  harga: 25000,   scale: 0.54, favSnack: "snack_pipit",    warnaRarity: "#16a34a", bgRarity: "#dcfce7" },
        { id: "ular",     namaDefault: "Slyther",   spesies: "Ular",       zona: "land",  rarity: "Rare",      harga: 60000,   scale: 0.88, favSnack: "snack_ular",     warnaRarity: "#2563eb", bgRarity: "#dbeafe" },
        { id: "panda",    namaDefault: "Po",        spesies: "Panda",      zona: "land",  rarity: "Epic",      harga: 95000,   scale: 1.02, favSnack: "snack_panda",    warnaRarity: "#9333ea", bgRarity: "#f3e8ff" },
        { id: "elang",    namaDefault: "Garuda",    spesies: "Elang",      zona: "land",  rarity: "Epic",      harga: 98000,   scale: 1.00, favSnack: "snack_elang",    warnaRarity: "#9333ea", bgRarity: "#f3e8ff" },
        { id: "shibainu", namaDefault: "Doge",      spesies: "Shiba Inu",  zona: "land",  rarity: "Special",   harga: 500000,  scale: 0.90, favSnack: "snack_shibainu", warnaRarity: "#ec4899", bgRarity: "#fce7f3" },
        { id: "merak_s",  namaDefault: "Pavo",      spesies: "Merak Biru", zona: "land",  rarity: "Special",   harga: 500000,  scale: 0.96, favSnack: "snack_merak_s",  warnaRarity: "#ec4899", bgRarity: "#fce7f3" },
        { id: "merak_l",  namaDefault: "Lord Shen", spesies: "Merak Emas", zona: "land",  rarity: "Legendary", harga: 1000000, scale: 1.00, favSnack: "snack_merak_l",  warnaRarity: "#d97706", bgRarity: "#fef3c7" }
    ],
    foods: [
        { id: "food_biscuit", nama: "Biskuit Pet",  kenyang: 15,  mood: 2,  tahan: "3 jam 45 menit",  harga: 200,  ikon: "🍪", tipe: "main" },
        { id: "food_daily",   nama: "Pakan Harian", kenyang: 25,  mood: 4,  tahan: "6 jam 15 menit",  harga: 400,  ikon: "🥫", tipe: "main" },
        { id: "food_fresh",   nama: "Fresh Meal",   kenyang: 40,  mood: 6,  tahan: "10 jam",          harga: 600,  ikon: "🥗", tipe: "main" },
        { id: "food_nutri",   nama: "Nutri Bowl",   kenyang: 55,  mood: 8,  tahan: "13 jam 45 menit", harga: 800,  ikon: "🍲", tipe: "main" },
        { id: "food_feast",   nama: "Hearty Feast", kenyang: 75,  mood: 12, tahan: "18 jam 45 menit", harga: 1000, ikon: "🍗", tipe: "main" },
        { id: "food_golden",  nama: "Golden Meal",  kenyang: 100, mood: 20, tahan: "25 jam",          harga: 1200, ikon: "🍱", tipe: "main" }
    ],
    snacks: [
        { id: "snack_anjing",   nama: "Dog Biscuit",   favPet: "anjing",   favLabel: "Anjing",     kenyang: 5, mood: 10, harga: 250, ikon: "🦴", tipe: "snack" },
        { id: "snack_kucing",   nama: "Fish Treat",    favPet: "kucing",   favLabel: "Kucing",     kenyang: 5, mood: 10, harga: 300, ikon: "🐟", tipe: "snack" },
        { id: "snack_ikan",     nama: "Fish Flakes",   favPet: "ikan",     favLabel: "Ikan",       kenyang: 5, mood: 10, harga: 250, ikon: "🐠", tipe: "snack" },
        { id: "snack_monyet",   nama: "Banana Snack",  favPet: "monyet",   favLabel: "Monyet",     kenyang: 5, mood: 10, harga: 200, ikon: "🍌", tipe: "snack" },
        { id: "snack_buaya",    nama: "Prime Meat",    favPet: "buaya",    favLabel: "Buaya",      kenyang: 5, mood: 10, harga: 400, ikon: "🥩", tipe: "snack" },
        { id: "snack_naga",     nama: "Ember Berry",   favPet: "naga",     favLabel: "Naga",       kenyang: 5, mood: 10, harga: 450, ikon: "🍒", tipe: "snack" },
        { id: "snack_beruang",  nama: "Honey Berry",   favPet: "beruang",  favLabel: "Beruang",    kenyang: 5, mood: 10, harga: 350, ikon: "🍯", tipe: "snack" },
        { id: "snack_gajah",    nama: "Peanut Crunch", favPet: "gajah",    favLabel: "Gajah",      kenyang: 5, mood: 10, harga: 300, ikon: "🥜", tipe: "snack" },
        { id: "snack_kadal",    nama: "Cricket Snack", favPet: "kadal",    favLabel: "Kadal",      kenyang: 5, mood: 10, harga: 250, ikon: "🦗", tipe: "snack" },
        { id: "snack_kecoa",    nama: "Sugar Crumb",   favPet: "kecoa",    favLabel: "Kecoa",      kenyang: 5, mood: 10, harga: 150, ikon: "🧁", tipe: "snack" },
        { id: "snack_tikus",    nama: "Cheddar Cube",  favPet: "tikus",    favLabel: "Tikus",      kenyang: 5, mood: 10, harga: 200, ikon: "🧀", tipe: "snack" },
        { id: "snack_kelinci",  nama: "Crisp Carrot",  favPet: "kelinci",  favLabel: "Kelinci",    kenyang: 5, mood: 10, harga: 250, ikon: "🥕", tipe: "snack" },
        { id: "snack_pipit",    nama: "Millet Seed",   favPet: "pipit",    favLabel: "Br. Pipit",  kenyang: 5, mood: 10, harga: 200, ikon: "🌾", tipe: "snack" },
        { id: "snack_ular",     nama: "Quail Egg",     favPet: "ular",     favLabel: "Ular",       kenyang: 5, mood: 10, harga: 350, ikon: "🥚", tipe: "snack" },
        { id: "snack_panda",    nama: "Bamboo Shoot",  favPet: "panda",    favLabel: "Panda",      kenyang: 5, mood: 10, harga: 400, ikon: "🎍", tipe: "snack" },
        { id: "snack_elang",    nama: "Fresh Salmon",  favPet: "elang",    favLabel: "Elang",      kenyang: 5, mood: 10, harga: 450, ikon: "🍣", tipe: "snack" },
        { id: "snack_shibainu", nama: "Wagyu Treat",   favPet: "shibainu", favLabel: "Shiba Inu",  kenyang: 5, mood: 10, harga: 600, ikon: "🥓", tipe: "snack" },
        { id: "snack_merak_s",  nama: "Royal Fig",     favPet: "merak_s",  favLabel: "Merak Biru", kenyang: 5, mood: 10, harga: 600, ikon: "🫐", tipe: "snack" },
        { id: "snack_merak_l",  nama: "Golden Nectar", favPet: "merak_l",  favLabel: "Merak Emas", kenyang: 5, mood: 10, harga: 800, ikon: "🏵️", tipe: "snack" }
    ],
    toys: [
        { id: "toy_bola",      nama: "Bola",              harga: 3000,  ikon: "🎾", animasi: "happy",  deskripsi: "Pet mengejar dan menyentuh bola." },
        { id: "toy_benang",    nama: "Gulungan Benang",   harga: 2500,  ikon: "🧶", animasi: "happy",  deskripsi: "Pet bermain dan mengejar benang." },
        { id: "toy_frisbee",   nama: "Frisbee",           harga: 4500,  ikon: "🥏", animasi: "happy",  deskripsi: "Pet melompat mengejar frisbee." },
        { id: "toy_bunyi",     nama: "Mainan Berbunyi",   harga: 3500,  ikon: "🐤", animasi: "idle",   deskripsi: "Pet menepuk dan bereaksi pada suara." },
        { id: "toy_sabun",     nama: "Gelembung Sabun",   harga: 4000,  ikon: "🫧", animasi: "happy",  deskripsi: "Pet mengejar gelembung melayang." },
        { id: "toy_boneka",    nama: "Boneka Plush",      harga: 5000,  ikon: "🧸", animasi: "sleepy", deskripsi: "Pet memeluk boneka." },
        { id: "toy_bulu",      nama: "Tongkat Bulu",      harga: 4000,  ikon: "🪶", animasi: "happy",  deskripsi: "Pet mengikuti gerakan bulu." },
        { id: "toy_terowongan",nama: "Terowongan Bermain",harga: 7000,  ikon: "🕳️", animasi: "idle",   deskripsi: "Pet masuk terowongan." },
        { id: "toy_alatmusik", nama: "Alat Musik Mini",   harga: 6500,  ikon: "🪘", animasi: "happy",  deskripsi: "Pet memainkan alat musik." },
        { id: "toy_kotakmusik",nama: "Kotak Musik",       harga: 7000,  ikon: "🎶", animasi: "happy",  deskripsi: "Pet bergoyang mengikuti musik." },
        { id: "toy_keyboard",  nama: "Mini Keyboard",     harga: 9000,  ikon: "🎹", animasi: "happy",  deskripsi: "Pet menekan tuts." },
        { id: "toy_mp3",       nama: "Pemutar Musik",     harga: 8500,  ikon: "🎧", animasi: "happy",  deskripsi: "Pet menari dengan irama lagu." },
        { id: "toy_garuk",     nama: "Tiang Garukan",     harga: 9000,  ikon: "🪵", animasi: "idle",   deskripsi: "Pet meregangkan tubuh dan menggaruk." },
        { id: "toy_panjat",    nama: "Rangka Panjat",     harga: 12000, ikon: "🪜", animasi: "happy",  deskripsi: "Pet memanjat dan melompat." },
        { id: "toy_bintang",   nama: "Proyektor Bintang", harga: 10000, ikon: "🌌", animasi: "sleepy", deskripsi: "Pet memandangi proyeksi bintang." }
    ],
    decorations: [
        { id: "dec_bed",      nama: "Tempat Tidur Pet",  harga: 2500,  ikon: "🛏️", slot: "Kiri Tanah" },
        { id: "dec_pillow",   nama: "Bantal Lucu",       harga: 2000,  ikon: "🛋️", slot: "Tengah Tanah" },
        { id: "dec_tree",     nama: "Pohon Panjat",      harga: 5000,  ikon: "🌳", slot: "Kiri Belakang" },
        { id: "dec_woodhouse",nama: "Rumah Kayu Mini",   harga: 7000,  ikon: "🛖", slot: "Kiri Tanah" },
        { id: "dec_pond",     nama: "Kolam Mini",        harga: 9000,  ikon: "🏝️", slot: "Kanan Tanah" },
        { id: "dec_fountain", nama: "Air Mancur",        harga: 12000, ikon: "⛲", slot: "Kanan Tanah" },
        { id: "dec_flower",   nama: "Taman Bunga",       harga: 15000, ikon: "🌷", slot: "Tengah Belakang" },
        { id: "dec_crystal",  nama: "Kristal Bercahaya", harga: 20000, ikon: "💎", slot: "Kanan Belakang" },
        { id: "dec_castle",   nama: "Istana Mini",       harga: 30000, ikon: "🏰", slot: "Kiri Belakang" },
        { id: "dec_painting", nama: "Lukisan Dinding",   harga: 6000,  ikon: "🖼️", slot: "Dinding Belakang" },
        // Item Dekorasi Ekstra Tema Habitat Baru
        { id: "dec_coral",    nama: "Terumbu Karang",    harga: 8000,  ikon: "🪸", slot: "Kiri Tanah" },
        { id: "dec_crab",     nama: "Kepiting Lucu",     harga: 6500,  ikon: "🦀", slot: "Tengah Tanah" },
        { id: "dec_seagrass", nama: "Padang Lamun",      harga: 7000,  ikon: "🌿", slot: "Kanan Belakang" },
        { id: "dec_bubbles",  nama: "Gelembung Udara",   harga: 5000,  ikon: "🫧", slot: "Tengah Belakang" },
        { id: "dec_fish",     nama: "Kumpulan Ikan",     harga: 12000, ikon: "🐟", slot: "Kiri Belakang" },
        { id: "dec_volcano",  nama: "Lava Mini",         harga: 15000, ikon: "🌋", slot: "Kanan Tanah" },
        { id: "dec_mushroom", nama: "Jamur Menyala",     harga: 9000,  ikon: "🍄", slot: "Kiri Tanah" },
        { id: "dec_alienplant",nama:"Tumbuhan Alien",    harga: 11000, ikon: "🪴", slot: "Tengah Belakang" },
        { id: "dec_meteor",   nama: "Batu Meteor",       harga: 10000, ikon: "☄️", slot: "Kanan Belakang" },
        { id: "dec_ufo",      nama: "UFO Mainan",        harga: 18000, ikon: "🛸", slot: "Kiri Belakang" },
        // 20 DEKORASI EKSPANSI BARU
        { id: "dec_campfire", nama: "Api Unggun",        harga: 7500,  ikon: "🔥", slot: "Kiri Tanah" },
        { id: "dec_tent",     nama: "Tenda Kemah",       harga: 12000, ikon: "⛺", slot: "Tengah Belakang" },
        { id: "dec_log",      nama: "Batang Pohon",      harga: 4000,  ikon: "🪵", slot: "Kanan Tanah" },
        { id: "dec_bush",     nama: "Semak Berries",     harga: 5500,  ikon: "🍒", slot: "Kiri Belakang" },
        { id: "dec_rock",     nama: "Batu Lumut",        harga: 3000,  ikon: "🪨", slot: "Tengah Tanah" },
        { id: "dec_starfish", nama: "Bintang Laut",      harga: 4500,  ikon: "⭐", slot: "Kanan Tanah" },
        { id: "dec_pearl",    nama: "Kerang Mutiara",    harga: 15000, ikon: "🦪", slot: "Kiri Tanah" },
        { id: "dec_anchor",   nama: "Jangkar Karat",     harga: 8500,  ikon: "⚓", slot: "Kiri Belakang" },
        { id: "dec_sandcastle",nama: "Istana Pasir",     harga: 9500,  ikon: "🏖️", slot: "Tengah Tanah" },
        { id: "dec_surfboard",nama: "Papan Selancar",    harga: 11000, ikon: "🏄", slot: "Kanan Belakang" },
        { id: "dec_cactus",   nama: "Kaktus Hijau",      harga: 6000,  ikon: "🌵", slot: "Kiri Belakang" },
        { id: "dec_skull",    nama: "Tengkorak Gurun",   harga: 7000,  ikon: "💀", slot: "Kanan Tanah" },
        { id: "dec_chest",    nama: "Harta Karun",       harga: 25000, ikon: "🪙", slot: "Tengah Tanah" },
        { id: "dec_oasis",    nama: "Oasis Kecil",       harga: 18000, ikon: "🏝️", slot: "Kiri Tanah" },
        { id: "dec_lamp",     nama: "Lampu Jin",         harga: 22000, ikon: "🪔", slot: "Tengah Belakang" },
        { id: "dec_satellite",nama: "Satelit Mini",      harga: 16000, ikon: "🛰️", slot: "Kanan Belakang" },
        { id: "dec_crater",   nama: "Kawah Bulan",       harga: 8000,  ikon: "🕳️", slot: "Tengah Tanah" },
        { id: "dec_telescope",nama: "Teleskop Bintang",  harga: 14000, ikon: "🔭", slot: "Kiri Tanah" },
        { id: "dec_robot",    nama: "Robot Penjelajah",  harga: 20000, ikon: "🤖", slot: "Kiri Belakang" },
        { id: "dec_portal",   nama: "Portal Dimensi",    harga: 35000, ikon: "🌀", slot: "Tengah Belakang" }
    ],
    wardrobe: [
        { id: "head_bandana", nama: "Bandana",             slot: "head",    harga: 2500,  ikon: "🧣", deskripsi: "Kain keren di dahi pet." },
        { id: "head_casual",  nama: "Topi Kasual",         slot: "head",    harga: 4000,  ikon: "🧢", deskripsi: "Topi santai untuk jalan-jalan." },
        { id: "head_pesta",   nama: "Topi Pesta",          slot: "head",    harga: 3000,  ikon: "🥳", deskripsi: "Topi kerucut perayaan." },
        { id: "head_flower",  nama: "Flower Crown",        slot: "head",    harga: 6500,  ikon: "🌸", deskripsi: "Mahkota rangkaian bunga segar." },
        { id: "head_wizard",  nama: "Wizard Hat",          slot: "head",    harga: 7500,  ikon: "🧙", deskripsi: "Topi penyihir berbintang." },
        { id: "head_wisuda",  nama: "Topi Wisuda",         slot: "head",    harga: 5000,  ikon: "🎓", deskripsi: "Toga topi kelulusan." },
        { id: "head_crown",   nama: "Royal Crown",         slot: "head",    harga: 18000, ikon: "👑", deskripsi: "Mahkota emas kerajaan." },
        { id: "head_bajak",   nama: "Topi Bajak Laut",     slot: "head",    harga: 7000,  ikon: "🏴‍☠️", deskripsi: "Topi kapten kapal." },

        { id: "eyes_round",   nama: "Kacamata Bulat",      slot: "eyes",    harga: 3000,  ikon: "👓", deskripsi: "Kacamata bulat gaya ilmuwan." },
        { id: "eyes_star",    nama: "Kacamata Bintang",    slot: "eyes",    harga: 5000,  ikon: "🤩", deskripsi: "Bingkai bintang ceria." },
        { id: "eyes_goggles", nama: "Goggles Penjelajah",  slot: "eyes",    harga: 6000,  ikon: "🥽", deskripsi: "Pelindung petualang." },
        { id: "eyes_monocle", nama: "Monocle Emas",        slot: "eyes",    harga: 9000,  ikon: "🧐", deskripsi: "Lensa tunggal berlapis emas." },
        { id: "eyes_halo",    nama: "Halo Bercahaya",      slot: "eyes",    harga: 12000, ikon: "😇", deskripsi: "Cincin melayang di atas kepala." },

        { id: "neck_dasi",    nama: "Dasi Pita",           slot: "neck",    harga: 2000,  ikon: "🎀", deskripsi: "Pita mungil di leher." },
        { id: "neck_syal",    nama: "Syal",                slot: "neck",    harga: 3000,  ikon: "🧣", deskripsi: "Syal rajut penghangat tubuh." },
        { id: "neck_kalung",  nama: "Kalung Bintang",      slot: "neck",    harga: 3500,  ikon: "⭐", deskripsi: "Kalung dengan liontin bintang." },
        { id: "neck_ransel",  nama: "Ransel Mini",         slot: "neck",    harga: 6000,  ikon: "🎒", deskripsi: "Tas ransel petualang." },
        { id: "neck_hp",      nama: "Headphone",           slot: "neck",    harga: 5000,  ikon: "🎧", deskripsi: "Headset musik modis." },
        { id: "neck_sayap",   nama: "Sayap Peri",          slot: "neck",    harga: 9000,  ikon: "🦋", deskripsi: "Sayap hias transparan." },
        { id: "neck_sepatu",  nama: "Sepatu Mini",         slot: "neck",    harga: 4500,  ikon: "👟", deskripsi: "Alas kaki mungil." },
        { id: "neck_jubah",   nama: "Jubah Pendek",        slot: "neck",    harga: 8000,  ikon: "🧥", deskripsi: "Jubah kain sebahu." },

        { id: "body_tshirt",  nama: "Kaos Kasual",         slot: "body",    harga: 5000,  ikon: "👕", deskripsi: "Kaos santai sehari-hari." },
        { id: "body_hoodie",  nama: "Hoodie",              slot: "body",    harga: 8000,  ikon: "🧥", deskripsi: "Jaket hoodie hangat." },
        { id: "body_labcoat", nama: "Jas Laboratorium",    slot: "body",    harga: 9000,  ikon: "🥼", deskripsi: "Jas putih peneliti." },
        { id: "body_explorer",nama: "Seragam Penjelajah",  slot: "body",    harga: 11000, ikon: "🦺", deskripsi: "Rompi lapangan lengkap." },
        { id: "body_winter",  nama: "Mantel Musim Dingin", slot: "body",    harga: 12000, ikon: "🧣", deskripsi: "Mantel tebal berbulu." },
        { id: "body_grad",    nama: "Jubah Wisuda",        slot: "body",    harga: 14000, ikon: "🎓", deskripsi: "Jubah kelulusan." },
        { id: "body_festival",nama: "Seragam Festival",    slot: "body",    harga: 16000, ikon: "👘", deskripsi: "Pakaian meriah festival." },
        { id: "body_batik",   nama: "Baju Batik",          slot: "body",    harga: 9000,  ikon: "👔", deskripsi: "Batik motif elegan." },
        { id: "body_koki",    nama: "Kostum Koki",         slot: "body",    harga: 10000, ikon: "🧑‍🍳", deskripsi: "Celemek dan seragam dapur." },
        { id: "body_detektif",nama: "Kostum Detektif",     slot: "body",    harga: 18000, ikon: "🕵️", deskripsi: "Mantel investigasi." },

        { id: "cost_dino",    nama: "Dino Suit",           slot: "costume", harga: 22000, ikon: "🦖", deskripsi: "Kostum dinosaurus imut." },
        { id: "cost_hero",    nama: "Superhero",           slot: "costume", harga: 25000, ikon: "🦸", deskripsi: "Pakaian pahlawan berjubah." },
        { id: "cost_astro",   nama: "Astronaut",           slot: "costume", harga: 30000, ikon: "🧑‍🚀", deskripsi: "Baju antariksa lengkap." },
        { id: "cost_knight",  nama: "Royal Knight",        slot: "costume", harga: 35000, ikon: "⚔️", deskripsi: "Zirah kesatria kerajaan." },
        { id: "cost_royal",   nama: "Royal Costume",       slot: "costume", harga: 45000, ikon: "🤴", deskripsi: "Jubah beludru & aksen emas." },
        { id: "cost_penyihir",nama: "Penyihir Fantasi",    slot: "costume", harga: 26000, ikon: "🪄", deskripsi: "Jubah bintang magis." },
        { id: "cost_pirate",  nama: "Bajak Laut",          slot: "costume", harga: 22000, ikon: "🏴‍☠️", deskripsi: "Pakaian kapten lautan." }
    ],
    themes: [
        { id: "thm_volcano", nama: "Gunung Berapi", harga: 50000, ikon: "🌋", deskripsi: "Lahar panas dan bebatuan vulkanik." },
        { id: "thm_jungle",  nama: "Hutan Tropis",  harga: 45000, ikon: "🌴", deskripsi: "Lebatnya pepohonan eksotis." },
        { id: "thm_underwater",nama:"Bawah Laut",   harga: 50000, ikon: "🌊", deskripsi: "Terumbu karang dan keindahan samudera." },
        { id: "thm_beach",   nama: "Pantai Tropis", harga: 40000, ikon: "🏖️", deskripsi: "Pasir putih dan deburan ombak." },
        { id: "thm_cloud",   nama: "Negeri Awan",   harga: 60000, ikon: "☁️", deskripsi: "Melayang di atas awan langit biru." },
        { id: "thm_wood",    nama: "Kabin Kayu",    harga: 35000, ikon: "🪵", deskripsi: "Hangat dan nyaman di dalam ruangan." },
        { id: "thm_desert",  nama: "Gurun Pasir",   harga: 40000, ikon: "🏜️", deskripsi: "Oase di tengah panasnya matahari." },
        { id: "thm_space",   nama: "Luar Angkasa",  harga: 80000, ikon: "🚀", deskripsi: "Bintang-bintang dan planet asing." },
        { id: "thm_underground",nama:"Dalam Tanah", harga: 45000, ikon: "🪨", deskripsi: "Gua kristal dan jamur bercahaya." }
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
            activePetId: "", activeTheme: "default", ownedPets: {}, foodInventory: {}, ownedToys: [], ownedDecorations: [], activeDecorations: [], ownedWardrobe: [], ownedThemes: []
        };
    } else {
        if (!lb.myPetData.ownedPets) lb.myPetData.ownedPets = {};
        if (!lb.myPetData.foodInventory) lb.myPetData.foodInventory = {};
        if (!lb.myPetData.activeTheme) lb.myPetData.activeTheme = "default";
        if (!Array.isArray(lb.myPetData.ownedThemes)) lb.myPetData.ownedThemes = [];
        if (!Array.isArray(lb.myPetData.ownedToys)) lb.myPetData.ownedToys = Object.values(lb.myPetData.ownedToys || {});
        if (!Array.isArray(lb.myPetData.ownedDecorations)) lb.myPetData.ownedDecorations = Object.values(lb.myPetData.ownedDecorations || {});
        if (!Array.isArray(lb.myPetData.ownedWardrobe)) lb.myPetData.ownedWardrobe = Object.values(lb.myPetData.ownedWardrobe || {});
        
        // Migrasi Active Decorations dari Array String ke Array Object (Untuk menyimpan koordinat X/Y Drag)
        let rawActiveDec = Object.values(lb.myPetData.activeDecorations || {});
        lb.myPetData.activeDecorations = rawActiveDec.map(function(dec) {
            if (typeof dec === "string") {
                let dCfg = window.MY_PET_CATALOG.decorations.find(x => x.id === dec);
                let defSlot = dCfg ? dCfg.slot : "";
                let left = "50%", bottom = "20%";
                if (defSlot.includes("Kiri")) left = "20%"; else if (defSlot.includes("Kanan")) left = "80%";
                if (defSlot.includes("Belakang")) bottom = "45%";
                return { id: dec, left: left, bottom: bottom };
            }
            return dec;
        });
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
    let translateY = Math.round((1 - spScale) * 200);

    let palet = {
        kadal:    { main: "#4ade80", dark: "#15803d", belly: "#dcfce7", cheek: "#fb7185", accent: "#166534" },
        kucing:   { main: "#fb923c", dark: "#c2410c", belly: "#ffedd5", cheek: "#f43f5e", accent: "#ea580c" },
        anjing:   { main: "#d97706", dark: "#78350f", belly: "#fef3c7", cheek: "#fb7185", accent: "#92400e" },
        ikan:     { main: "#38bdf8", dark: "#0369a1", belly: "#e0f2fe", cheek: "#fb7185", accent: "#f97316" },
        monyet:   { main: "#a16207", dark: "#713f12", belly: "#fde68a", cheek: "#f43f5e", accent: "#fef08a" },
        buaya:    { main: "#10b981", dark: "#065f46", belly: "#fef08a", cheek: "#fb7185", accent: "#047857" },
        beruang:  { main: "#92400e", dark: "#451a03", belly: "#fde68a", cheek: "#fb7185", accent: "#b45309" },
        gajah:    { main: "#94a3b8", dark: "#475569", belly: "#e2e8f0", cheek: "#f472b6", accent: "#64748b" },
        naga:     { main: "#ef4444", dark: "#991b1b", belly: "#fde047", cheek: "#fb923c", accent: "#f59e0b" },
        kecoa:    { main: "#9a3412", dark: "#431407", belly: "#fed7aa", cheek: "#fb7185", accent: "#7c2d12" },
        tikus:    { main: "#94a3b8", dark: "#475569", belly: "#f1f5f9", cheek: "#f472b6", accent: "#fda4af" },
        kelinci:  { main: "#f8fafc", dark: "#94a3b8", belly: "#ffffff", cheek: "#f472b6", accent: "#fbcfe8" },
        pipit:    { main: "#fb923c", dark: "#9a3412", belly: "#ffedd5", cheek: "#f43f5e", accent: "#f59e0b" },
        ular:     { main: "#22c55e", dark: "#14532d", belly: "#fef08a", cheek: "#fb7185", accent: "#15803d" },
        panda:    { main: "#ffffff", dark: "#0f172a", belly: "#f8fafc", cheek: "#f472b6", accent: "#1e293b" },
        elang:    { main: "#78350f", dark: "#451a03", belly: "#fef3c7", cheek: "#fb923c", accent: "#f59e0b" },
        shibainu: { main: "#e67e22", dark: "#7c2d12", belly: "#fffbeb", cheek: "#fb7185", accent: "#d97706" },
        merak_s:  { main: "#0284c7", dark: "#0c4a6e", belly: "#bae6fd", cheek: "#f472b6", accent: "#10b981" },
        merak_l:  { main: "#f59e0b", dark: "#78350f", belly: "#fef08a", cheek: "#ef4444", accent: "#dc2626" }
    }[petId] || { main: "#60a5fa", dark: "#1d4ed8", belly: "#dbeafe", cheek: "#fb7185", accent: "#2563eb" };

    function buildEyes(lx, ly, rx, ry, rEye) {
        let r = rEye || 15;
        let rHi = Math.max(4, Math.round(r * 0.38));
        let rSub = Math.max(2, Math.round(r * 0.18));
        if (state === "happy") {
            return '<path d="M' + (lx - r) + ',' + ly + ' Q' + lx + ',' + (ly - r * 1.3) + ' ' + (lx + r) + ',' + ly + '" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>' +
                   '<path d="M' + (rx - r) + ',' + ry + ' Q' + rx + ',' + (ry - r * 1.3) + ' ' + (rx + r) + ',' + ry + '" fill="none" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>';
        }
        if (state === "sleepy") {
            return '<path d="M' + (lx - r) + ',' + ly + ' Q' + lx + ',' + (ly + r * 0.8) + ' ' + (lx + r) + ',' + ly + '" fill="none" stroke="#0f172a" stroke-width="5.5" stroke-linecap="round"/>' +
                   '<path d="M' + (rx - r) + ',' + ry + ' Q' + rx + ',' + (ry + r * 0.8) + ' ' + (rx + r) + ',' + ry + '" fill="none" stroke="#0f172a" stroke-width="5.5" stroke-linecap="round"/>';
        }
        if (state === "hungry" || state === "critical") {
            return '<circle cx="' + lx + '" cy="' + ly + '" r="' + (r - 1) + '" fill="#0f172a"/><circle cx="' + (lx - 4) + '" cy="' + (ly - 4) + '" r="' + (rHi - 1) + '" fill="#ffffff"/>' +
                   '<circle cx="' + rx + '" cy="' + ry + '" r="' + (r - 1) + '" fill="#0f172a"/><circle cx="' + (rx - 4) + '" cy="' + (ry - 4) + '" r="' + (rHi - 1) + '" fill="#ffffff"/>' +
                   '<line x1="' + (lx - r) + '" y1="' + (ly - r - 5) + '" x2="' + (lx + r) + '" y2="' + (ly - r + 2) + '" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>' +
                   '<line x1="' + (rx + r) + '" y1="' + (ry - r - 5) + '" x2="' + (rx - r) + '" y2="' + (ry - r + 2) + '" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>';
        }
        return '<g class="pet-eyes-blink">' +
                   '<circle cx="' + lx + '" cy="' + ly + '" r="' + r + '" fill="#0f172a"/>' +
                   '<circle cx="' + (lx - r * 0.32) + '" cy="' + (ly - r * 0.35) + '" r="' + rHi + '" fill="#ffffff"/>' +
                   '<circle cx="' + (lx + r * 0.3) + '" cy="' + (ly + r * 0.3) + '" r="' + rSub + '" fill="#ffffff"/>' +
                   '<circle cx="' + rx + '" cy="' + ry + '" r="' + r + '" fill="#0f172a"/>' +
                   '<circle cx="' + (rx - r * 0.32) + '" cy="' + (ry - r * 0.35) + '" r="' + rHi + '" fill="#ffffff"/>' +
                   '<circle cx="' + (rx + r * 0.3) + '" cy="' + (ry + r * 0.3) + '" r="' + rSub + '" fill="#ffffff"/>' +
               '</g>';
    }

    function buildMouth(mx, my, scaleM) {
        let sc = scaleM || 1;
        if (state === "happy") {
            return '<path d="M' + (mx - 20 * sc) + ',' + my + ' Q' + mx + ',' + (my + 26 * sc) + ' ' + (mx + 20 * sc) + ',' + my + ' Z" fill="#ef4444" stroke="#0f172a" stroke-width="4.5"/>';
        }
        if (state === "eating") {
            return '<ellipse class="pet-mouth-chew" cx="' + mx + '" cy="' + (my + 6 * sc) + '" rx="' + (16 * sc) + '" ry="' + (13 * sc) + '" fill="#ef4444" stroke="#0f172a" stroke-width="4.5"/>';
        }
        if (state === "sleepy") {
            return '<circle cx="' + mx + '" cy="' + (my + 6 * sc) + '" r="' + (7 * sc) + '" fill="#fda4af" stroke="#0f172a" stroke-width="4"/>';
        }
        if (state === "hungry" || state === "critical") {
            return '<path d="M' + (mx - 16 * sc) + ',' + (my + 12 * sc) + ' Q' + mx + ',' + (my - 4 * sc) + ' ' + (mx + 16 * sc) + ',' + (my + 12 * sc) + '" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>';
        }
        return '<path d="M' + (mx - 16 * sc) + ',' + my + ' Q' + mx + ',' + (my + 14 * sc) + ' ' + (mx + 16 * sc) + ',' + my + '" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>';
    }

    let backLayer = "";
    let bodyLayer = "";
    let limbsLayer = "";
    let headLayer = "";
    let clothesLayer = "";
    let neckLayer = "";

    let hatAnchor = { x: 256, y: 120, scale: 1 };
    let eyeAnchor = { lx: 205, rx: 307, y: 185, scale: 1 };
    let neckAnchor = { x: 256, y: 292, scale: 1 };
    let allowBodySuit = true;

    // =====================================================================
    // SPESIES 1: IKAN (NEMO / TROPICAL FISH)
    // =====================================================================
    if (petId === "ikan") {
        allowBodySuit = false;
        hatAnchor = { x: 225, y: 175, scale: 0.78 };
        eyeAnchor = { lx: 162, rx: 222, y: 272, scale: 0.78 };
        neckAnchor = { x: 235, y: 345, scale: 0.75 };

        backLayer =
            '<g class="pet-tail-part">' +
                '<path d="M345,285 L448,205 C468,242 462,272 425,288 C462,304 468,334 448,370 L345,295 Z" fill="' + palet.accent + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/>' +
                '<path d="M355,286 L428,238 M355,290 L422,288 M355,294 L428,338" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>' +
            '</g>' +
            '<path d="M195,212 C225,140 305,145 340,228 Z" fill="' + palet.accent + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/>' +
            '<path d="M235,355 C260,405 315,400 330,348 Z" fill="' + palet.accent + '" stroke="' + palet.dark + '" stroke-width="5" stroke-linejoin="round"/>';

        bodyLayer =
            '<path d="M112,288 C112,200 225,182 362,262 C382,276 382,300 362,314 C225,394 112,376 112,288 Z" fill="url(#gradBody_ikan)" stroke="' + palet.dark + '" stroke-width="6"/>' +
            '<path d="M128,312 C185,368 285,365 348,312 C285,342 195,342 128,312 Z" fill="' + palet.belly + '"/>' +
            '<path d="M245,204 Q225,288 245,372 L272,366 Q252,288 272,210 Z" fill="#ffffff" stroke="' + palet.dark + '" stroke-width="4"/>' +
            '<path d="M322,238 Q308,288 322,338 L342,328 Q330,288 342,248 Z" fill="#ffffff" stroke="' + palet.dark + '" stroke-width="4"/>' +
            '<path d="M228,242 Q245,288 225,332" fill="none" stroke="' + palet.dark + '" stroke-width="5" stroke-linecap="round"/>';

        limbsLayer =
            '<g class="pet-wing-left">' +
                '<path d="M238,302 C285,282 305,328 265,352 C242,360 228,332 238,302 Z" fill="' + palet.accent + '" stroke="' + palet.dark + '" stroke-width="5"/>' +
            '</g>';

        headLayer =
            '<g class="pet-head-group">' +
                '<ellipse cx="145" cy="296" rx="14" ry="8" fill="' + palet.cheek + '" opacity="0.6"/>' +
                '<ellipse cx="218" cy="296" rx="14" ry="8" fill="' + palet.cheek + '" opacity="0.6"/>' +
                buildEyes(162, 272, 212, 272, 14) +
                (state === "eating"
                    ? '<circle class="pet-mouth-chew" cx="184" cy="306" r="12" fill="#ef4444" stroke="#0f172a" stroke-width="4"/>'
                    : '<circle cx="184" cy="306" r="8" fill="#fb7185" stroke="#0f172a" stroke-width="4"/>') +
            '</g>';
    }

    // =====================================================================
    // SPESIES 2: ULAR (SLYTHER)
    // =====================================================================
    else if (petId === "ular") {
        allowBodySuit = false;
        hatAnchor = { x: 256, y: 112, scale: 0.85 };
        eyeAnchor = { lx: 218, rx: 294, y: 175, scale: 0.88 };
        neckAnchor = { x: 256, y: 245, scale: 0.82 };

        backLayer =
            '<g class="pet-tail-part">' +
                '<path d="M365,412 Q445,410 468,352 Q442,382 365,382 Z" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/>' +
            '</g>';

        bodyLayer =
            '<path d="M135,402 C135,362 385,362 385,402 C385,438 135,438 135,402 Z" fill="url(#gradBody_ular)" stroke="' + palet.dark + '" stroke-width="6"/>' +
            '<path d="M165,412 Q260,432 355,412" fill="none" stroke="' + palet.belly + '" stroke-width="14" stroke-linecap="round"/>' +
            '<path d="M168,382 C135,330 355,342 332,272 C320,235 256,242 256,195" fill="none" stroke="' + palet.dark + '" stroke-width="64" stroke-linecap="round"/>' +
            '<path d="M168,382 C135,330 355,342 332,272 C320,235 256,242 256,195" fill="none" stroke="url(#gradBody_ular)" stroke-width="52" stroke-linecap="round"/>' +
            '<path d="M185,375 C160,335 340,342 318,275 C308,242 256,245 256,205" fill="none" stroke="' + palet.belly + '" stroke-width="22" stroke-linecap="round" stroke-dasharray="14,6"/>' +
            '<circle cx="295" cy="312" r="9" fill="' + palet.accent + '"/><circle cx="235" cy="345" r="10" fill="' + palet.accent + '"/><circle cx="285" cy="392" r="10" fill="' + palet.accent + '"/>';

        headLayer =
            '<g class="pet-head-group">' +
                '<path d="M256,228 L256,268 L242,284 M256,268 L270,284" fill="none" stroke="#ef4444" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
                '<path d="M172,182 C168,118 344,118 340,182 C335,222 298,236 256,236 C214,236 177,222 172,182 Z" fill="url(#gradHead_ular)" stroke="' + palet.dark + '" stroke-width="6"/>' +
                '<ellipse cx="195" cy="198" rx="14" ry="8" fill="' + palet.cheek + '" opacity="0.55"/>' +
                '<ellipse cx="317" cy="198" rx="14" ry="8" fill="' + palet.cheek + '" opacity="0.55"/>' +
                buildEyes(218, 175, 294, 175, 15) +
                '<circle cx="244" cy="202" r="3.5" fill="' + palet.dark + '"/><circle cx="268" cy="202" r="3.5" fill="' + palet.dark + '"/>' +
                buildMouth(256, 214, 0.85) +
            '</g>';
    }

    // =====================================================================
    // SPESIES 3: KADAL (GECKO)
    // =====================================================================
    else if (petId === "kadal") {
        allowBodySuit = false;
        hatAnchor = { x: 195, y: 155, scale: 0.82 };
        eyeAnchor = { lx: 158, rx: 222, y: 225, scale: 0.82 };
        neckAnchor = { x: 215, y: 295, scale: 0.8 };

        backLayer =
            '<g class="pet-tail-part">' +
                '<path d="M325,310 C405,325 435,275 425,235 C418,212 448,215 452,248 C458,312 405,368 320,350 Z" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/>' +
            '</g>';

        bodyLayer =
            '<path d="M195,275 C245,248 335,265 358,318 C368,352 315,372 245,362 C195,355 175,312 195,275 Z" fill="url(#gradBody_kadal)" stroke="' + palet.dark + '" stroke-width="6"/>' +
            '<path d="M205,335 Q275,365 342,338 Q275,352 205,335 Z" fill="' + palet.belly + '"/>' +
            '<circle cx="265" cy="292" r="8" fill="' + palet.accent + '" opacity="0.65"/>' +
            '<circle cx="298" cy="302" r="10" fill="' + palet.accent + '" opacity="0.65"/>' +
            '<circle cx="325" cy="318" r="7" fill="' + palet.accent + '" opacity="0.65"/>';

        limbsLayer =
            '<g fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M205,338 L175,382 L155,385 L195,388 L218,345 Z"/>' +
                '<path d="M252,348 L242,395 L225,398 L265,398 L272,350 Z"/>' +
                '<path d="M312,345 L308,392 L292,396 L332,396 L332,345 Z"/>' +
                '<path d="M342,332 L365,378 L352,382 L385,382 L356,325 Z"/>' +
            '</g>';

        headLayer =
            '<g class="pet-head-group">' +
                '<path d="M112,235 C112,172 268,168 268,235 C268,278 232,298 190,298 C142,298 112,272 112,235 Z" fill="url(#gradHead_kadal)" stroke="' + palet.dark + '" stroke-width="6"/>' +
                '<ellipse cx="136" cy="252" rx="14" ry="8" fill="' + palet.cheek + '" opacity="0.6"/>' +
                '<ellipse cx="242" cy="252" rx="14" ry="8" fill="' + palet.cheek + '" opacity="0.6"/>' +
                buildEyes(158, 225, 222, 225, 16) +
                '<circle cx="178" cy="246" r="3" fill="' + palet.dark + '"/><circle cx="198" cy="246" r="3" fill="' + palet.dark + '"/>' +
                buildMouth(190, 262, 0.9) +
            '</g>';
    }

    // =====================================================================
    // SPESIES 4: BUAYA (CROCO)
    // =====================================================================
    else if (petId === "buaya") {
        allowBodySuit = false;
        hatAnchor = { x: 205, y: 145, scale: 0.82 };
        eyeAnchor = { lx: 175, rx: 228, y: 198, scale: 0.8 };
        neckAnchor = { x: 235, y: 305, scale: 0.85 };

        backLayer =
            '<g class="pet-tail-part">' +
                '<polygon points="365,305 382,278 398,308 415,282 430,312 448,290 458,318" fill="' + palet.accent + '" stroke="' + palet.dark + '" stroke-width="4" stroke-linejoin="round"/>' +
                '<path d="M335,305 C405,305 455,315 478,342 C445,368 385,368 325,352 Z" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/>' +
            '</g>';

        bodyLayer =
            '<polygon points="245,268 262,242 280,268 298,242 316,270 334,246 350,278" fill="' + palet.accent + '" stroke="' + palet.dark + '" stroke-width="4" stroke-linejoin="round"/>' +
            '<path d="M195,282 C245,258 335,262 368,315 C378,352 325,375 245,368 C190,362 175,320 195,282 Z" fill="url(#gradBody_buaya)" stroke="' + palet.dark + '" stroke-width="6"/>' +
            '<path d="M205,340 Q280,372 355,342 Q280,358 205,340 Z" fill="' + palet.belly + '"/>';

        limbsLayer =
            '<g fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5" stroke-linejoin="round">' +
                '<rect x="192" y="342" width="32" height="44" rx="12" transform="rotate(10 208 364)"/>' +
                '<rect x="245" y="348" width="32" height="44" rx="12" transform="rotate(5 261 370)"/>' +
                '<rect x="302" y="345" width="32" height="44" rx="12" transform="rotate(-6 318 367)"/>' +
                '<rect x="342" y="335" width="30" height="42" rx="12" transform="rotate(-14 357 356)"/>' +
            '</g>';

        headLayer =
            '<g class="pet-head-group">' +
                '<circle cx="175" cy="195" r="26" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/>' +
                '<circle cx="228" cy="195" r="26" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/>' +
                '<path d="M82,248 C82,212 145,205 245,205 C272,215 278,285 235,295 C165,302 82,288 82,248 Z" fill="url(#gradHead_buaya)" stroke="' + palet.dark + '" stroke-width="6"/>' +
                '<path d="M92,262 Q165,278 242,262 C238,292 155,298 92,262 Z" fill="' + palet.belly + '" stroke="' + palet.dark + '" stroke-width="4"/>' +
                '<polygon points="108,262 115,275 122,263" fill="#ffffff" stroke="' + palet.dark + '" stroke-width="2"/>' +
                '<polygon points="138,265 145,278 152,266" fill="#ffffff" stroke="' + palet.dark + '" stroke-width="2"/>' +
                '<polygon points="172,266 179,278 186,265" fill="#ffffff" stroke="' + palet.dark + '" stroke-width="2"/>' +
                '<circle cx="105" cy="234" r="5" fill="#064e3b"/><circle cx="124" cy="234" r="5" fill="#064e3b"/>' +
                '<ellipse cx="225" cy="245" rx="14" ry="8" fill="' + palet.cheek + '" opacity="0.6"/>' +
                buildEyes(175, 198, 228, 198, 13) +
            '</g>';
    }

    // =====================================================================
    // SPESIES 5: KECOA (OGGY)
    // =====================================================================
    else if (petId === "kecoa") {
        allowBodySuit = false;
        hatAnchor = { x: 256, y: 122, scale: 0.78 };
        eyeAnchor = { lx: 226, rx: 286, y: 185, scale: 0.78 };
        neckAnchor = { x: 256, y: 245, scale: 0.78 };

        limbsLayer =
            '<g fill="none" stroke="' + palet.dark + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M195,268 L138,245 L112,268"/>' +
                '<path d="M317,268 L374,245 L400,268"/>' +
                '<path d="M185,318 L122,318 L98,348"/>' +
                '<path d="M327,318 L390,318 L414,348"/>' +
                '<path d="M195,368 L138,402 L118,432"/>' +
                '<path d="M317,368 L374,402 L394,432"/>' +
            '</g>';

        bodyLayer =
            '<ellipse cx="256" cy="342" rx="76" ry="92" fill="' + palet.belly + '" stroke="' + palet.dark + '" stroke-width="6"/>' +
            '<path d="M188,378 Q256,395 324,378 M198,402 Q256,418 314,402" fill="none" stroke="' + palet.dark + '" stroke-width="4"/>' +
            '<path d="M182,255 C175,335 205,412 254,418 L254,255 Z" fill="url(#gradBody_kecoa)" stroke="' + palet.dark + '" stroke-width="5.5" stroke-linejoin="round"/>' +
            '<path d="M330,255 C337,335 307,412 258,418 L258,255 Z" fill="url(#gradBody_kecoa)" stroke="' + palet.dark + '" stroke-width="5.5" stroke-linejoin="round"/>' +
            '<ellipse cx="220" cy="325" rx="12" ry="38" transform="rotate(-8 220 325)" fill="#ffffff" opacity="0.22"/>' +
            '<ellipse cx="292" cy="325" rx="12" ry="38" transform="rotate(8 292 325)" fill="#ffffff" opacity="0.22"/>' +
            '<ellipse cx="256" cy="245" rx="74" ry="34" fill="' + palet.accent + '" stroke="' + palet.dark + '" stroke-width="6"/>';

        headLayer =
            '<g class="pet-head-group">' +
                '<path d="M230,145 Q155,45 85,78" fill="none" stroke="' + palet.dark + '" stroke-width="5" stroke-linecap="round"/>' +
                '<path d="M282,145 Q357,45 427,78" fill="none" stroke="' + palet.dark + '" stroke-width="5" stroke-linecap="round"/>' +
                '<ellipse cx="256" cy="188" rx="68" ry="56" fill="url(#gradHead_kecoa)" stroke="' + palet.dark + '" stroke-width="6"/>' +
                '<ellipse cx="202" cy="202" rx="12" ry="7" fill="' + palet.cheek + '" opacity="0.6"/>' +
                '<ellipse cx="310" cy="202" rx="12" ry="7" fill="' + palet.cheek + '" opacity="0.6"/>' +
                buildEyes(226, 185, 286, 185, 15) +
                buildMouth(256, 212, 0.78) +
            '</g>';
    }

    // =====================================================================
    // SPESIES 6: BURUNG (PIPIT, ELANG, MERAK BIRU 5 BARIS, MERAK EMAS 5 BARIS)
    // =====================================================================
    else if (["pipit", "elang", "merak_s", "merak_l"].includes(petId)) {
        hatAnchor = { x: 256, y: 122, scale: 0.85 };
        eyeAnchor = { lx: 215, rx: 297, y: 195, scale: 0.88 };
        neckAnchor = { x: 256, y: 275, scale: 0.85 };

        if (petId === "pipit") {
            backLayer =
                '<g class="pet-tail-part">' +
                    '<path d="M312,332 L412,272 L395,308 L418,328 L318,365 Z" fill="' + palet.dark + '" stroke="' + palet.dark + '" stroke-width="5" stroke-linejoin="round"/>' +
                '</g>';
        } else if (petId === "elang") {
            backLayer =
                '<g class="pet-tail-part">' +
                    '<path d="M195,368 L162,432 L212,422 L256,442 L300,422 L350,432 L317,368 Z" fill="#ffffff" stroke="' + palet.dark + '" stroke-width="5" stroke-linejoin="round"/>' +
                    '<path d="M180,400 L332,400" stroke="' + palet.dark + '" stroke-width="8"/>' +
                '</g>';
        } else {
            // 5 BARIS BULU MERAK MEKAR SANGAT BESAR (55 MATA BULU BERLAPIS DARI DALAM KE LUAR)
            let buluMerak = '<g class="pet-tail-part">';
            let isGold = (petId === "merak_l");
            let bgFanFill = isGold ? "#b45309" : "#065f46";
            let bgFanStroke = isGold ? "#78350f" : "#042f2e";
            let vaneCol1 = isGold ? "#d97706" : "#047857";
            let vaneCol2 = isGold ? "#f59e0b" : "#0d9488";
            let ocellusOuter = isGold ? "#fef08a" : "#2dd4bf";
            let ocellusMid = isGold ? "#f97316" : "#facc15";
            let ocellusCore = isGold ? "#991b1b" : "#1e3a8a";

            // Kipas dasar pas seukuran bentangan bulu (tidak memanjang ke bawah) & ekstra lebar
            buluMerak += '<path d="M -18,282 A 274,268 0 0,1 530,282 Q 395,292 256,288 Q 117,292 -18,282 Z" fill="' + bgFanFill + '" stroke="' + bgFanStroke + '" stroke-width="7" stroke-linejoin="round"/>';

            // Konfigurasi 5 Baris Ekstra Lebar & Rapat
            let rowsConfig = [
                { r: 248, count: 17, minDeg: -92, maxDeg: 92, sz: 22, vaneW: 31 },
                { r: 208, count: 15, minDeg: -88, maxDeg: 88, sz: 20, vaneW: 28 },
                { r: 168, count: 13, minDeg: -82, maxDeg: 82, sz: 18, vaneW: 25 },
                { r: 130, count: 11, minDeg: -75, maxDeg: 75, sz: 16, vaneW: 22 },
                { r: 92,  count: 9,  minDeg: -65, maxDeg: 65, sz: 14, vaneW: 19 }
            ];

            let centerFanX = 256;
            let centerFanY = 278;

            rowsConfig.forEach(function(rowCfg, rIdx) {
                let step = rowCfg.count > 1 ? (rowCfg.maxDeg - rowCfg.minDeg) / (rowCfg.count - 1) : 0;
                let colVane = (rIdx % 2 === 0) ? vaneCol1 : vaneCol2;
                for (let j = 0; j < rowCfg.count; j++) {
                    let deg = rowCfg.minDeg + (j * step);
                    let rad = (deg - 90) * Math.PI / 180;
                    let fx = Math.round(centerFanX + Math.cos(rad) * rowCfg.r);
                    let fy = Math.round(centerFanY + Math.sin(rad) * rowCfg.r);
                    let rotDeg = deg;

                    buluMerak +=
                        '<line x1="' + centerFanX + '" y1="' + centerFanY + '" x2="' + fx + '" y2="' + fy + '" stroke="#fde047" stroke-width="2.5" opacity="0.55"/>' +
                        '<g transform="translate(' + fx + ',' + fy + ') rotate(' + rotDeg + ')">' +
                            '<ellipse cx="0" cy="10" rx="' + rowCfg.vaneW + '" ry="' + (rowCfg.sz + 10) + '" fill="' + colVane + '" stroke="' + bgFanStroke + '" stroke-width="2.5"/>' +
                            '<circle cx="0" cy="0" r="' + rowCfg.sz + '" fill="' + ocellusOuter + '" stroke="' + bgFanStroke + '" stroke-width="2.5"/>' +
                            '<circle cx="0" cy="2" r="' + Math.round(rowCfg.sz * 0.65) + '" fill="' + ocellusMid + '"/>' +
                            '<circle cx="0" cy="4" r="' + Math.round(rowCfg.sz * 0.36) + '" fill="' + ocellusCore + '"/>' +
                            '<circle cx="-3" cy="1" r="2.5" fill="#ffffff" opacity="0.85"/>' +
                        '</g>';
                }
            });

            buluMerak += '</g>';
            backLayer = buluMerak;
        }

        // Badan & Sayap Samping Burung
        let birdBodyRx = (petId === "merak_s" || petId === "merak_l") ? 74 : 84;
        let birdBodyRy = (petId === "merak_s" || petId === "merak_l") ? 82 : 86;
        bodyLayer =
            '<ellipse cx="256" cy="332" rx="' + birdBodyRx + '" ry="' + birdBodyRy + '" fill="url(#gradBody_' + petId + ')" stroke="' + palet.dark + '" stroke-width="6"/>' +
            '<ellipse cx="256" cy="344" rx="' + Math.round(birdBodyRx * 0.68) + '" ry="' + Math.round(birdBodyRy * 0.68) + '" fill="' + palet.belly + '"/>' +
            '<g class="pet-wing-left"><path d="M' + (256 - birdBodyRx + 4) + ',285 C135,302 145,380 190,384 C202,358 196,315 ' + (256 - birdBodyRx + 4) + ',285 Z" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5.5"/></g>' +
            '<g class="pet-wing-right"><path d="M' + (256 + birdBodyRx - 4) + ',285 C377,302 367,380 322,384 C310,358 316,315 ' + (256 + birdBodyRx - 4) + ',285 Z" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5.5"/></g>';

        limbsLayer =
            '<g fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M225,408 L225,436 M210,439 L225,431 L240,439 M225,431 L225,442"/>' +
                '<path d="M287,408 L287,436 M272,439 L287,431 L302,439 M287,431 L287,442"/>' +
            '</g>';

        let crestHtml = "";
        if (petId === "merak_s" || petId === "merak_l") {
            crestHtml =
                '<g stroke="' + palet.dark + '" stroke-width="3.5" stroke-linecap="round">' +
                    '<line x1="256" y1="128" x2="256" y2="82"/><circle cx="256" cy="78" r="7" fill="#fde047"/>' +
                    '<line x1="242" y1="130" x2="225" y2="88"/><circle cx="222" cy="84" r="6.5" fill="#fde047"/>' +
                    '<line x1="270" y1="130" x2="287" y2="88"/><circle cx="290" cy="84" r="6.5" fill="#fde047"/>' +
                '</g>';
        } else if (petId === "pipit") {
            crestHtml = '<path d="M245,122 Q256,98 272,118" fill="none" stroke="' + palet.dark + '" stroke-width="6" stroke-linecap="round"/>';
        }

        let headColorFill = petId === "elang" ? "#ffffff" : "url(#gradHead_" + petId + ")";
        let headRxBird = (petId === "merak_s" || petId === "merak_l") ? 72 : 82;
        let headRyBird = (petId === "merak_s" || petId === "merak_l") ? 68 : 76;
        let eagleBrows = petId === "elang"
            ? '<polygon points="182,175 235,188 232,175" fill="' + palet.dark + '"/><polygon points="330,175 277,188 280,175" fill="' + palet.dark + '"/>'
            : '';
        let beakHtml = petId === "elang"
            ? '<path d="M234,205 Q256,195 278,205 C284,228 268,248 256,254 C244,248 228,228 234,205 Z" fill="#facc15" stroke="#b45309" stroke-width="4.5"/>'
            : '<polygon points="240,208 272,208 256,232" fill="#facc15" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>';

        headLayer =
            '<g class="pet-head-group">' +
                crestHtml +
                '<ellipse cx="256" cy="202" rx="' + headRxBird + '" ry="' + headRyBird + '" fill="' + headColorFill + '" stroke="' + palet.dark + '" stroke-width="6"/>' +
                '<ellipse cx="198" cy="212" rx="13" ry="7.5" fill="' + palet.cheek + '" opacity="0.6"/>' +
                '<ellipse cx="314" cy="212" rx="13" ry="7.5" fill="' + palet.cheek + '" opacity="0.6"/>' +
                buildEyes(216, 195, 296, 195, 14) +
                eagleBrows +
                beakHtml +
            '</g>';
    }

    // =====================================================================
    // SPESIES 7: SHIBA INU (DOGE - SESUAI FOTO REFERENSI ASLI)
    // =====================================================================
    else if (petId === "shibainu") {
        hatAnchor = { x: 256, y: 108, scale: 0.95 };
        eyeAnchor = { lx: 205, rx: 307, y: 184, scale: 0.96 };
        neckAnchor = { x: 256, y: 288, scale: 0.95 };

        // 1. Ekor Melingkar Tebal Berbulu Khas Shiba Inu (Fluffy Curled Tail)
        backLayer =
            '<g class="pet-tail-part">' +
                '<path d="M325,365 C412,355 422,255 358,255 C318,255 318,308 355,315" fill="none" stroke="' + palet.dark + '" stroke-width="42" stroke-linecap="round"/>' +
                '<path d="M325,365 C412,355 422,255 358,255 C318,255 318,308 355,315" fill="none" stroke="' + palet.main + '" stroke-width="32" stroke-linecap="round"/>' +
                '<path d="M352,256 C392,256 398,302 360,310" fill="none" stroke="' + palet.belly + '" stroke-width="14" stroke-linecap="round"/>' +
            '</g>';

        // 2. Badan Oranye-Merah Rubah dengan Dada & Perut Putih-Krem (Urajiro)
        bodyLayer =
            '<ellipse cx="256" cy="346" rx="92" ry="88" fill="url(#gradBody_shibainu)" stroke="' + palet.dark + '" stroke-width="6"/>' +
            '<!-- Corak Urajiro Dada & Perut Putih-Krem -->' +
            '<path d="M192,285 Q256,312 320,285 C332,338 322,415 256,426 C190,415 180,338 192,285 Z" fill="' + palet.belly + '"/>';

        // 3. Kaki Shiba Inu dengan Kaus Kaki Putih-Krem (White Socks)
        let shoeCol = (eq.neck === "neck_sepatu") ? "#ef4444" : palet.belly;
        limbsLayer =
            '<!-- Kaki Depan Kiri & Kanan -->' +
            '<ellipse cx="164" cy="335" rx="24" ry="18" transform="rotate(-20 164 335)" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5.5"/>' +
            '<ellipse cx="154" cy="340" rx="12" ry="11" transform="rotate(-20 154 340)" fill="' + palet.belly + '"/>' +
            '<ellipse cx="348" cy="335" rx="24" ry="18" transform="rotate(20 348 335)" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5.5"/>' +
            '<ellipse cx="358" cy="340" rx="12" ry="11" transform="rotate(20 358 340)" fill="' + palet.belly + '"/>' +
            '<!-- Kaki Bawah dengan Kaus Kaki Krem -->' +
            '<ellipse cx="205" cy="425" rx="30" ry="18" fill="' + shoeCol + '" stroke="' + palet.dark + '" stroke-width="5.5"/>' +
            '<ellipse cx="307" cy="425" rx="30" ry="18" fill="' + shoeCol + '" stroke="' + palet.dark + '" stroke-width="5.5"/>';

        // 4. Kepala Shiba Inu (Telinga Segitiga Tebal, Pipi Plush, Masker Urajiro, Alis Maru-Mayu, Lidah Menjulur)
        let shibaMouth = "";
        if (state === "sleepy" || state === "hungry" || state === "critical") {
            shibaMouth = buildMouth(256, 224, 0.95);
        } else {
            // Senyum khas Shiba Inu dengan lidah pink menjulur ceria seperti foto referensi
            shibaMouth =
                '<path d="M241,225 C241,264 271,264 271,225 Z" fill="#fb7185" stroke="#0f172a" stroke-width="4.5"/>' +
                '<line x1="256" y1="227" x2="256" y2="250" stroke="#e11d48" stroke-width="3" stroke-linecap="round"/>' +
                '<path d="M220,218 Q238,234 256,216 Q274,234 292,218" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
        }

        headLayer =
            '<g class="pet-head-group">' +
                '<!-- Telinga Segitiga Tegak Tebal Khas Shiba Inu -->' +
                '<g class="pet-ear-left">' +
                    '<path d="M148,162 C134,115 142,68 158,64 C176,60 212,92 226,122 Z" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/>' +
                    '<path d="M160,148 C152,115 156,84 165,82 C176,80 198,102 208,124 Z" fill="' + palet.belly + '"/>' +
                '</g>' +
                '<g class="pet-ear-right">' +
                    '<path d="M364,162 C378,115 370,68 354,64 C336,60 300,92 286,122 Z" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/>' +
                    '<path d="M352,148 C360,115 356,84 347,82 C336,80 314,102 304,124 Z" fill="' + palet.belly + '"/>' +
                '</g>' +
                '<!-- Bentuk Kepala & Pipi Lebar Khas Shiba Inu -->' +
                '<path d="M138,198 C134,122 188,98 256,98 C324,98 378,122 374,198 C380,248 330,286 256,286 C182,286 132,248 138,198 Z" fill="#ea580c" stroke="#7c2d12" stroke-width="6"/>' +
                '<!-- Bayangan Halus Dahi & Pipi Atas Oranye Kemerahan -->' +
                '<path d="M150,185 C155,126 198,104 256,104 C314,104 357,126 362,185 C340,168 305,172 282,195 L256,210 L230,195 C207,172 172,168 150,185 Z" fill="#f97316"/>' +
                '<!-- Pola Urajiro Putih Bersih di Pipi, Moncong, & Dagu -->' +
                '<path d="M142,204 C162,175 208,175 236,204 C246,212 266,212 276,204 C304,175 350,175 370,204 C366,256 320,283 256,283 C192,283 146,256 142,204 Z" fill="#ffffff"/>' +
                '<!-- Moncong Putih Menonjol & Garis Bibir Anjing -->' +
                '<ellipse cx="256" cy="212" rx="34" ry="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>' +
                '<!-- Bintik Alis Putih Tegas Khas Shiba (Maru-Mayu) -->' +
                '<ellipse cx="208" cy="148" rx="15" ry="8.5" transform="rotate(-12 208 148)" fill="#ffffff"/>' +
                '<ellipse cx="304" cy="148" rx="15" ry="8.5" transform="rotate(12 304 148)" fill="#ffffff"/>' +
                '<!-- Rona Pipi & Mata -->' +
                '<ellipse cx="172" cy="218" rx="16" ry="9" fill="#fda4af" opacity="0.65"/>' +
                '<ellipse cx="340" cy="218" rx="16" ry="9" fill="#fda4af" opacity="0.65"/>' +
                buildEyes(206, 180, 306, 180, 15) +
                shibaMouth +
                '<!-- Hidung Hitam Segitiga Membulat Khas Anjing -->' +
                '<path d="M238,195 Q256,188 274,195 C276,207 265,216 256,216 C247,216 236,207 238,195 Z" fill="#0f172a"/>' +
                '<line x1="256" y1="215" x2="256" y2="224" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>' +
                '<ellipse cx="251" cy="198" rx="5.5" ry="2.5" fill="#ffffff" opacity="0.75"/>' +
            '</g>';
    }

    // =====================================================================
    // SPESIES 8: MAMALIA LAIN & NAGA (GAJAH DENGAN BELALAI BARU, KUCING,
    //            ANJING, MONYET, BERUANG, PANDA, TIKUS, KELINCI, NAGA)
    // =====================================================================
    else {
        if (petId === "naga") {
            backLayer +=
                '<g class="pet-wing-left"><path d="M175,275 C88,205 55,255 82,328 C115,312 145,320 175,315 Z" fill="#f97316" stroke="#991b1b" stroke-width="6"/></g>' +
                '<g class="pet-wing-right"><path d="M337,275 C424,205 457,255 430,328 C397,312 367,320 337,315 Z" fill="#f97316" stroke="#991b1b" stroke-width="6"/></g>' +
                '<g class="pet-tail-part"><path d="M330,385 Q425,402 435,335" fill="none" stroke="' + palet.main + '" stroke-width="24" stroke-linecap="round"/>' +
                '<polygon points="435,315 462,338 430,352" fill="#facc15" stroke="#991b1b" stroke-width="4"/></g>';
        } else if (petId === "kucing") {
            backLayer += '<g class="pet-tail-part"><path d="M332,385 Q420,355 402,280" fill="none" stroke="' + palet.main + '" stroke-width="22" stroke-linecap="round"/></g>';
        } else if (petId === "anjing") {
            backLayer += '<g class="pet-tail-part"><path d="M332,378 Q405,340 388,298" fill="none" stroke="' + palet.main + '" stroke-width="24" stroke-linecap="round"/></g>';
        } else if (petId === "monyet") {
            backLayer += '<g class="pet-tail-part"><path d="M328,385 Q435,368 422,285 Q412,250 388,278" fill="none" stroke="' + palet.dark + '" stroke-width="18" stroke-linecap="round"/></g>';
        } else if (petId === "tikus") {
            backLayer += '<g class="pet-tail-part"><path d="M325,392 Q435,405 445,335" fill="none" stroke="#f472b6" stroke-width="10" stroke-linecap="round"/></g>';
        } else if (petId === "kelinci") {
            backLayer += '<circle class="pet-tail-part" cx="352" cy="382" r="24" fill="#ffffff" stroke="' + palet.dark + '" stroke-width="5"/>';
        } else if (petId === "beruang") {
            backLayer += '<circle class="pet-tail-part" cx="348" cy="385" r="18" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="5"/>';
        } else if (petId === "panda") {
            backLayer += '<circle class="pet-tail-part" cx="345" cy="385" r="18" fill="#0f172a"/>';
        } else if (petId === "gajah") {
            backLayer += '<g class="pet-tail-part"><path d="M355,380 Q405,395 408,425" fill="none" stroke="' + palet.dark + '" stroke-width="14" stroke-linecap="round"/></g>';
        }

        let earsLayer = "";
        if (petId === "kucing") {
            earsLayer =
                '<g class="pet-ear-left"><polygon points="152,165 135,78 218,122" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/><polygon points="160,152 148,98 205,126" fill="#fda4af"/></g>' +
                '<g class="pet-ear-right"><polygon points="360,165 377,78 294,122" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linejoin="round"/><polygon points="352,152 364,98 307,126" fill="#fda4af"/></g>';
        } else if (petId === "anjing") {
            earsLayer =
                '<g class="pet-ear-left"><ellipse cx="138" cy="182" rx="34" ry="62" transform="rotate(18 138 182)" fill="' + palet.accent + '" stroke="' + palet.dark + '" stroke-width="6"/></g>' +
                '<g class="pet-ear-right"><ellipse cx="374" cy="182" rx="34" ry="62" transform="rotate(-18 374 182)" fill="' + palet.accent + '" stroke="' + palet.dark + '" stroke-width="6"/></g>';
        } else if (petId === "kelinci") {
            earsLayer =
                '<g class="pet-ear-left"><ellipse cx="202" cy="88" rx="26" ry="72" transform="rotate(-8 202 88)" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><ellipse cx="202" cy="92" rx="13" ry="52" transform="rotate(-8 202 92)" fill="#fbcfe8"/></g>' +
                '<g class="pet-ear-right"><ellipse cx="310" cy="88" rx="26" ry="72" transform="rotate(8 310 88)" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><ellipse cx="310" cy="92" rx="13" ry="52" transform="rotate(8 310 92)" fill="#fbcfe8"/></g>';
        } else if (petId === "tikus") {
            earsLayer =
                '<g class="pet-ear-left"><circle cx="148" cy="128" r="46" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><circle cx="148" cy="128" r="28" fill="#fda4af"/></g>' +
                '<g class="pet-ear-right"><circle cx="364" cy="128" r="46" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><circle cx="364" cy="128" r="28" fill="#fda4af"/></g>';
        } else if (petId === "monyet") {
            earsLayer =
                '<g class="pet-ear-left"><circle cx="128" cy="190" r="36" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><circle cx="128" cy="190" r="20" fill="#fde68a"/></g>' +
                '<g class="pet-ear-right"><circle cx="384" cy="190" r="36" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><circle cx="384" cy="190" r="20" fill="#fde68a"/></g>';
        } else if (petId === "beruang") {
            earsLayer =
                '<g class="pet-ear-left"><circle cx="160" cy="115" r="36" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><circle cx="160" cy="115" r="18" fill="' + palet.belly + '"/></g>' +
                '<g class="pet-ear-right"><circle cx="352" cy="115" r="36" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><circle cx="352" cy="115" r="18" fill="' + palet.belly + '"/></g>';
        } else if (petId === "panda") {
            earsLayer =
                '<g class="pet-ear-left"><circle cx="160" cy="115" r="36" fill="#0f172a"/></g>' +
                '<g class="pet-ear-right"><circle cx="352" cy="115" r="36" fill="#0f172a"/></g>';
        } else if (petId === "gajah") {
            earsLayer =
                '<g class="pet-ear-left"><ellipse cx="106" cy="194" rx="58" ry="76" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><ellipse cx="110" cy="198" rx="36" ry="50" fill="#fbcfe8"/></g>' +
                '<g class="pet-ear-right"><ellipse cx="406" cy="194" rx="58" ry="76" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6"/><ellipse cx="402" cy="198" rx="36" ry="50" fill="#fbcfe8"/></g>';
        } else if (petId === "naga") {
            earsLayer =
                '<g class="pet-ear-left"><path d="M178,125 Q135,52 192,74 Q208,95 208,120 Z" fill="#facc15" stroke="#991b1b" stroke-width="5.5"/></g>' +
                '<g class="pet-ear-right"><path d="M334,125 Q377,52 320,74 Q304,95 304,120 Z" fill="#facc15" stroke="#991b1b" stroke-width="5.5"/></g>';
        }

        let bodyRx = petId === "gajah" ? 108 : (petId === "beruang" || petId === "panda" ? 102 : 92);
        let bodyRy = 90;
        let strokeMamalia = petId === "panda" ? "#0f172a" : palet.dark;
        let fillBodyMamalia = petId === "panda" ? "#ffffff" : "url(#gradBody_" + petId + ")";
        let fillHeadMamalia = petId === "panda" ? "#ffffff" : "url(#gradHead_" + petId + ")";

        bodyLayer =
            '<ellipse cx="256" cy="345" rx="' + bodyRx + '" ry="' + bodyRy + '" fill="' + fillBodyMamalia + '" stroke="' + strokeMamalia + '" stroke-width="6"/>' +
            '<ellipse cx="256" cy="355" rx="' + Math.round(bodyRx * 0.65) + '" ry="60" fill="' + palet.belly + '"/>';

        if (petId === "panda") {
            bodyLayer += '<path d="M160,318 Q256,346 352,318 L342,272 Q256,294 170,272 Z" fill="#0f172a"/>';
        } else if (petId === "naga") {
            bodyLayer +=
                '<line x1="205" y1="332" x2="307" y2="332" stroke="#f59e0b" stroke-width="3.5"/>' +
                '<line x1="200" y1="358" x2="312" y2="358" stroke="#f59e0b" stroke-width="3.5"/>' +
                '<line x1="210" y1="384" x2="302" y2="384" stroke="#f59e0b" stroke-width="3.5"/>';
        }

        let limbFill = petId === "panda" ? "#0f172a" : palet.main;
        let footFill = (eq.neck === "neck_sepatu") ? "#ef4444" : limbFill;
        let footStroke = (eq.neck === "neck_sepatu") ? "#991b1b" : strokeMamalia;
        limbsLayer =
            '<ellipse cx="164" cy="332" rx="24" ry="18" transform="rotate(-22 164 332)" fill="' + limbFill + '" stroke="' + strokeMamalia + '" stroke-width="5.5"/>' +
            '<ellipse cx="348" cy="332" rx="24" ry="18" transform="rotate(22 348 332)" fill="' + limbFill + '" stroke="' + strokeMamalia + '" stroke-width="5.5"/>' +
            '<ellipse cx="205" cy="425" rx="30" ry="18" fill="' + footFill + '" stroke="' + footStroke + '" stroke-width="5.5"/>' +
            '<ellipse cx="307" cy="425" rx="30" ry="18" fill="' + footFill + '" stroke="' + footStroke + '" stroke-width="5.5"/>';

        headLayer = '<g class="pet-head-group">' + earsLayer;
        if (eq.costume === "cost_dino") {
            headLayer += '<ellipse cx="256" cy="190" rx="120" ry="105" fill="#22c55e" stroke="#15803d" stroke-width="6"/><polygon points="256,62 240,88 272,88" fill="#facc15"/>';
        }

        headLayer += '<ellipse cx="256" cy="192" rx="108" ry="92" fill="' + fillHeadMamalia + '" stroke="' + strokeMamalia + '" stroke-width="6"/>';
        
        if (petId === "monyet") {
            headLayer += '<ellipse cx="256" cy="208" rx="84" ry="64" fill="#fef3c7"/>';
        } else if (petId === "beruang" || petId === "anjing" || petId === "tikus" || petId === "kelinci") {
            headLayer += '<ellipse cx="256" cy="216" rx="40" ry="28" fill="' + palet.belly + '"/>';
        } else if (petId === "panda") {
            headLayer +=
                '<ellipse cx="205" cy="186" rx="26" ry="32" transform="rotate(18 205 186)" fill="#0f172a"/>' +
                '<ellipse cx="307" cy="186" rx="26" ry="32" transform="rotate(-18 307 186)" fill="#0f172a"/>';
        }

        headLayer +=
            '<ellipse cx="178" cy="212" rx="18" ry="10" fill="' + palet.cheek + '" opacity="0.6"/>' +
            '<ellipse cx="334" cy="212" rx="18" ry="10" fill="' + palet.cheek + '" opacity="0.6"/>' +
            buildEyes(205, 185, 307, 185, 16);

        // PERBAIKAN BELALAI GAJAH: Lebar di pangkal hidung, menyatu tanpa garis putus, melengkung gembil dengan gading mungil & kerutan belalai
        if (petId === "gajah") {
            headLayer +=
                '<!-- Senyum Mungil di Bawah Pangkal Belalai -->' +
                '<path d="M214,230 Q226,242 238,232" fill="none" stroke="#0f172a" stroke-width="4.5" stroke-linecap="round"/>' +
                '<!-- Gading Putih Mungil di Kiri-Kanan Pangkal Belalai -->' +
                '<path d="M228,218 L216,238 L236,230 Z" fill="#ffffff" stroke="' + palet.dark + '" stroke-width="3.5" stroke-linejoin="round"/>' +
                '<path d="M284,218 L296,238 L276,230 Z" fill="#ffffff" stroke="' + palet.dark + '" stroke-width="3.5" stroke-linejoin="round"/>' +
                '<!-- Belalai Gajah Utuh Menyatu dari Wajah -->' +
                '<path d="M232,194 C230,248 242,292 292,292 C326,292 338,262 320,245 C306,232 288,248 296,262 C272,262 274,232 278,194" fill="' + palet.main + '" stroke="' + palet.dark + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
                '<!-- Penutup Pangkal Belalai agar Menyatu 100% Tanpa Garis Batas dengan Wajah -->' +
                '<ellipse cx="255" cy="194" rx="22" ry="8" fill="' + palet.main + '"/>' +
                '<!-- Garis Kerutan Belalai & Ujung Hidung -->' +
                '<path d="M242,216 Q256,220 268,215 M244,234 Q258,238 270,232 M250,252 Q262,256 274,248" fill="none" stroke="' + palet.dark + '" stroke-width="3" stroke-linecap="round" opacity="0.65"/>' +
                '<ellipse cx="312" cy="252" rx="5" ry="3.5" transform="rotate(-25 312 252)" fill="#fbcfe8" stroke="' + palet.dark + '" stroke-width="2"/>';
        } else if (petId === "kucing" || petId === "tikus" || petId === "kelinci") {
            let noseCol = "#f43f5e";
            headLayer +=
                buildMouth(256, 220, 0.95) +
                '<polygon points="246,200 266,200 256,212" fill="' + noseCol + '"/>' +
                '<line x1="145" y1="204" x2="182" y2="208" stroke="#475569" stroke-width="3" stroke-linecap="round"/>' +
                '<line x1="145" y1="218" x2="182" y2="216" stroke="#475569" stroke-width="3" stroke-linecap="round"/>' +
                '<line x1="367" y1="204" x2="330" y2="208" stroke="#475569" stroke-width="3" stroke-linecap="round"/>' +
                '<line x1="367" y1="218" x2="330" y2="216" stroke="#475569" stroke-width="3" stroke-linecap="round"/>';
        } else {
            headLayer +=
                buildMouth(256, 220, 1) +
                '<ellipse cx="256" cy="204" rx="11" ry="7.5" fill="#0f172a"/>';
        }

        headLayer += '</g>';
    }

    // =====================================================================
    // KOSMETIK & WARDROBE UNIVERSAL
    // =====================================================================
    let activeBodyId = eq.costume || eq.body || "";
    if (allowBodySuit && activeBodyId) {
        if (activeBodyId === "body_tshirt") {
            clothesLayer = '<path d="M166,305 Q256,325 346,305 L340,392 Q256,408 172,392 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="4"/><circle cx="256" cy="350" r="14" fill="#fef08a"/>';
        } else if (activeBodyId === "body_hoodie") {
            clothesLayer = '<path d="M162,298 Q256,318 350,298 L344,400 Q256,415 168,400 Z" fill="#f97316" stroke="#c2410c" stroke-width="4"/><line x1="240" y1="310" x2="240" y2="345" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/><line x1="272" y1="310" x2="272" y2="345" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>';
        } else if (activeBodyId === "body_labcoat") {
            clothesLayer = '<path d="M162,298 Q256,318 350,298 L346,408 L272,408 L272,315 L240,315 L240,408 L166,408 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>';
        } else if (activeBodyId === "body_explorer") {
            clothesLayer = '<path d="M164,302 Q256,322 348,302 L342,400 Q256,412 170,400 Z" fill="#d97706" stroke="#78350f" stroke-width="4"/>';
        } else if (activeBodyId === "body_winter") {
            clothesLayer = '<path d="M160,298 Q256,318 352,298 L346,405 Q256,418 166,405 Z" fill="#0284c7" stroke="#0369a1" stroke-width="4"/><rect x="158" y="286" width="196" height="22" rx="11" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>';
        } else if (activeBodyId === "body_grad") {
            clothesLayer = '<path d="M160,298 Q256,318 352,298 L348,410 L164,410 Z" fill="#1e293b" stroke="#0f172a" stroke-width="4"/><path d="M210,302 L256,358 L302,302" fill="none" stroke="#facc15" stroke-width="7" stroke-linecap="round"/>';
        } else if (activeBodyId === "body_festival") {
            clothesLayer = '<path d="M162,300 Q256,320 350,300 L344,405 Q256,418 168,405 Z" fill="#e11d48" stroke="#9f1239" stroke-width="4"/><path d="M168,368 L344,368" stroke="#facc15" stroke-width="9"/>';
        } else if (activeBodyId === "body_batik") {
            clothesLayer = '<path d="M162,300 Q256,320 350,300 L344,405 Q256,418 168,405 Z" fill="#78350f" stroke="#451a03" stroke-width="4"/><line x1="256" y1="312" x2="256" y2="408" stroke="#facc15" stroke-width="4"/>';
        } else if (activeBodyId === "body_koki") {
            clothesLayer = '<path d="M162,300 Q256,320 350,300 L344,405 Q256,418 168,405 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/><path d="M195,302 L256,330 L317,302" fill="none" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>';
        } else if (activeBodyId === "body_detektif") {
            clothesLayer = '<path d="M160,298 Q256,318 352,298 L346,408 Q256,420 166,408 Z" fill="#a16207" stroke="#713f12" stroke-width="4"/>';
        } else if (activeBodyId === "cost_hero") {
            clothesLayer = '<path d="M162,298 Q256,318 350,298 L343,402 Q256,416 169,402 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="4"/><circle cx="256" cy="348" r="16" fill="#facc15"/>';
        } else if (activeBodyId === "cost_astro") {
            clothesLayer = '<path d="M158,295 Q256,315 354,295 L348,408 Q256,422 164,408 Z" fill="#f8fafc" stroke="#64748b" stroke-width="5"/><rect x="218" y="330" width="76" height="44" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>';
        } else if (activeBodyId === "cost_knight") {
            clothesLayer = '<path d="M158,295 Q256,318 354,295 L346,408 Q256,422 166,408 Z" fill="#94a3b8" stroke="#334155" stroke-width="5"/><polygon points="256,322 276,352 256,382 236,352" fill="#facc15"/>';
        } else if (activeBodyId === "cost_dino") {
            clothesLayer = '<path d="M160,295 Q256,315 352,295 L346,408 Q256,422 166,408 Z" fill="#22c55e" stroke="#15803d" stroke-width="5"/><ellipse cx="256" cy="358" rx="50" ry="42" fill="#fef08a"/>';
        } else if (activeBodyId === "cost_royal") {
            clothesLayer = '<path d="M160,295 Q256,318 352,295 L346,408 Q256,422 166,408 Z" fill="#b91c1c" stroke="#facc15" stroke-width="5"/>';
        } else if (activeBodyId === "cost_penyihir") {
            clothesLayer = '<path d="M160,295 Q256,318 352,295 L346,408 Q256,422 166,408 Z" fill="#4c1d95" stroke="#c084fc" stroke-width="5"/>';
        } else if (activeBodyId === "cost_pirate") {
            clothesLayer = '<path d="M160,295 Q256,318 352,295 L346,408 Q256,422 166,408 Z" fill="#991b1b" stroke="#0f172a" stroke-width="5"/>';
        }
    }

    if (eq.neck) {
        let nx = neckAnchor.x - 256;
        let ny = neckAnchor.y - 295;
        let nInner = "";
        if (eq.neck === "neck_dasi") {
            nInner = '<polygon points="256,295 224,280 224,310" fill="#e11d48" stroke="#881337" stroke-width="3"/><polygon points="256,295 288,280 288,310" fill="#e11d48" stroke="#881337" stroke-width="3"/><circle cx="256" cy="295" r="8" fill="#fb7185" stroke="#881337" stroke-width="3"/>';
        } else if (eq.neck === "neck_syal") {
            nInner = '<path d="M172,285 Q256,312 340,285 Q346,308 332,314 Q256,334 180,314 Q166,308 172,285 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="4"/><path d="M284,308 L298,368 L322,362 L310,304 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="4"/>';
        } else if (eq.neck === "neck_kalung") {
            nInner = '<path d="M192,288 Q256,328 320,288" fill="none" stroke="#eab308" stroke-width="5"/><circle cx="256" cy="318" r="11" fill="#facc15" stroke="#a16207" stroke-width="3"/>';
        }
        if (nInner) {
            neckLayer = '<g transform="translate(' + nx + ',' + ny + ') scale(' + neckAnchor.scale + ')" style="transform-origin:256px 295px;">' + nInner + '</g>';
        }
    }

    let cosmeticHeadOverlay = "";
    if (eq.eyes) {
        let exMid = (eyeAnchor.lx + eyeAnchor.rx) / 2;
        let dxE = exMid - 256;
        let dyE = eyeAnchor.y - 188;
        let eInner = "";
        if (eq.eyes === "eyes_round") {
            eInner = '<circle cx="205" cy="188" r="25" fill="rgba(56,189,248,0.18)" stroke="#0f172a" stroke-width="5"/><circle cx="307" cy="188" r="25" fill="rgba(56,189,248,0.18)" stroke="#0f172a" stroke-width="5"/><line x1="230" y1="188" x2="282" y2="188" stroke="#0f172a" stroke-width="5"/>';
        } else if (eq.eyes === "eyes_star") {
            eInner = '<polygon points="205,158 213,174 231,176 217,189 221,208 205,198 189,208 193,189 179,176 197,174" fill="rgba(250,204,21,0.45)" stroke="#ca8a04" stroke-width="4"/><polygon points="307,158 315,174 333,176 319,189 323,208 307,198 291,208 295,189 281,176 299,174" fill="rgba(250,204,21,0.45)" stroke="#ca8a04" stroke-width="4"/><line x1="230" y1="185" x2="282" y2="185" stroke="#ca8a04" stroke-width="4"/>';
        } else if (eq.eyes === "eyes_goggles") {
            eInner = '<rect x="168" y="166" width="176" height="42" rx="18" fill="#78350f" stroke="#451a03" stroke-width="4"/><circle cx="205" cy="187" r="20" fill="#38bdf8" stroke="#facc15" stroke-width="4" opacity="0.8"/><circle cx="307" cy="187" r="20" fill="#38bdf8" stroke="#facc15" stroke-width="4" opacity="0.8"/>';
        } else if (eq.eyes === "eyes_monocle") {
            eInner = '<circle cx="307" cy="188" r="26" fill="rgba(254,240,138,0.28)" stroke="#eab308" stroke-width="5"/>';
        } else if (eq.eyes === "eyes_halo") {
            eInner = '<ellipse cx="256" cy="70" rx="56" ry="14" fill="none" stroke="#fde047" stroke-width="9"/>';
        }
        cosmeticHeadOverlay += '<g transform="translate(' + dxE + ',' + dyE + ') scale(' + eyeAnchor.scale + ')" style="transform-origin:256px 188px;">' + eInner + '</g>';
    }

    let activeHeadId = eq.head || "";
    if (eq.costume === "cost_penyihir" && !activeHeadId) activeHeadId = "head_wizard";
    else if (eq.costume === "cost_pirate" && !activeHeadId) activeHeadId = "head_bajak";

    if (activeHeadId) {
        let hx = hatAnchor.x - 256;
        let hy = hatAnchor.y - 115;
        let hInner = "";
        if (activeHeadId === "head_bandana") {
            hInner = '<path d="M152,142 Q256,166 360,142 L352,118 Q256,138 160,118 Z" fill="#ef4444" stroke="#991b1b" stroke-width="4"/>';
        } else if (activeHeadId === "head_casual") {
            hInner = '<path d="M175,120 C175,65 337,65 337,120 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="5"/><path d="M168,118 Q256,130 382,120 Q360,136 168,125 Z" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="4"/>';
        } else if (activeHeadId === "head_pesta") {
            hInner = '<polygon points="212,115 256,28 300,115" fill="#ec4899" stroke="#9d174d" stroke-width="5" stroke-linejoin="round"/><circle cx="256" cy="24" r="11" fill="#fde047"/>';
        } else if (activeHeadId === "head_flower") {
            hInner = '<circle cx="195" cy="112" r="14" fill="#f472b6"/><circle cx="225" cy="104" r="15" fill="#fb7185"/><circle cx="256" cy="100" r="16" fill="#facc15"/><circle cx="287" cy="104" r="15" fill="#a855f7"/><circle cx="317" cy="112" r="14" fill="#4ade80"/>';
        } else if (activeHeadId === "head_wizard") {
            hInner = '<ellipse cx="256" cy="118" rx="95" ry="18" fill="#4c1d95" stroke="#2e1065" stroke-width="5"/><polygon points="190,116 256,16 322,116" fill="#6d28d9" stroke="#2e1065" stroke-width="5" stroke-linejoin="round"/>';
        } else if (activeHeadId === "head_wisuda") {
            hInner = '<polygon points="256,52 356,82 256,112 156,82" fill="#1e293b" stroke="#0f172a" stroke-width="4"/><rect x="208" y="96" width="96" height="20" rx="4" fill="#334155"/>';
        } else if (activeHeadId === "head_crown") {
            hInner = '<polygon points="192,115 184,58 220,88 256,48 292,88 328,58 320,115" fill="#facc15" stroke="#b45309" stroke-width="5" stroke-linejoin="round"/>';
        } else if (activeHeadId === "head_bajak") {
            hInner = '<path d="M152,120 Q256,48 360,120 L336,130 Q256,116 176,130 Z" fill="#1e293b" stroke="#facc15" stroke-width="5"/>';
        }
        cosmeticHeadOverlay += '<g transform="translate(' + hx + ',' + hy + ') scale(' + hatAnchor.scale + ')" style="transform-origin:256px 115px;">' + hInner + '</g>';
    }

    let statusBubble = "";
    if (state === "hungry") {
        statusBubble = '<g class="pet-status-float"><circle cx="415" cy="95" r="34" fill="#ffffff" stroke="#f59e0b" stroke-width="4"/><text x="415" y="108" font-size="34" text-anchor="middle">🍖</text></g>';
    } else if (state === "critical") {
        statusBubble = '<g class="pet-status-float"><circle cx="415" cy="95" r="36" fill="#fee2e2" stroke="#dc2626" stroke-width="5"/><text x="415" y="108" font-size="34" text-anchor="middle">🆘</text></g>';
    } else if (state === "happy") {
        statusBubble = '<g class="pet-status-float"><text x="410" y="95" font-size="40" text-anchor="middle">💖</text></g>';
    } else if (state === "sleepy") {
        statusBubble = '<g class="pet-status-float"><text x="410" y="95" font-size="32" font-weight="900" fill="#6366f1" text-anchor="middle">Zzz</text></g>';
    } else if (state === "eating") {
        statusBubble = '<g class="pet-status-float"><text x="410" y="105" font-size="36" text-anchor="middle">😋</text></g>';
    }

    return (
        '<div class="mypet-25d-actor pet-state-' + state + '" data-pet-id="' + petId + '" style="width:' + size + 'px; height:' + size + 'px;">' +
            '<svg viewBox="0 0 512 512" width="100%" height="100%" style="overflow:visible;">' +
                '<defs>' +
                    '<radialGradient id="gradHead_' + petId + '" cx="38%" cy="32%" r="68%">' +
                        '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.32"/>' +
                        '<stop offset="35%" stop-color="' + palet.main + '" stop-opacity="1"/>' +
                        '<stop offset="100%" stop-color="' + palet.dark + '" stop-opacity="1"/>' +
                    '</radialGradient>' +
                    '<radialGradient id="gradBody_' + petId + '" cx="40%" cy="35%" r="70%">' +
                        '<stop offset="0%" stop-color="' + palet.main + '"/>' +
                        '<stop offset="100%" stop-color="' + palet.dark + '"/>' +
                    '</radialGradient>' +
                '</defs>' +
                '<ellipse class="pet-ground-shadow" cx="256" cy="442" rx="' + Math.round(108 * spScale) + '" ry="20" fill="' + (catPet.zona === "water" ? "rgba(2,132,199,0.28)" : "rgba(15,23,42,0.2)") + '"/>' +
                '<g transform="translate(0, ' + translateY + ') scale(' + spScale + ')" style="transform-origin: 256px 256px;">' +
                    '<g class="pet-whole-body">' +
                        backLayer +
                        bodyLayer +
                        clothesLayer +
                        limbsLayer +
                        neckLayer +
                        headLayer +
                        cosmeticHeadOverlay +
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
        dec_painting: '<svg viewBox="0 0 110 90" width="72" height="60"><ellipse cx="55" cy="82" rx="28" ry="5" fill="rgba(0,0,0,0.15)"/><line x1="40" y1="82" x2="55" y2="20" stroke="#78350f" stroke-width="4"/><line x1="70" y1="82" x2="55" y2="20" stroke="#78350f" stroke-width="4"/><rect x="24" y="22" width="62" height="44" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="5"/><path d="M28,58 Q45,42 62,54 Q74,46 82,58 L82,62 L28,62 Z" fill="#4ade80"/><circle cx="42" cy="36" r="6" fill="#facc15"/></svg>',
        dec_coral: '<svg viewBox="0 0 100 100" width="80" height="80"><ellipse cx="50" cy="90" rx="35" ry="8" fill="rgba(0,0,0,0.15)"/><path d="M50,90 Q40,60 20,40 M50,90 Q50,50 40,20 M50,90 Q65,60 85,30 M50,90 Q80,60 90,70" fill="none" stroke="#f43f5e" stroke-width="12" stroke-linecap="round"/><path d="M50,90 Q40,60 20,40 M50,90 Q50,50 40,20 M50,90 Q65,60 85,30 M50,90 Q80,60 90,70" fill="none" stroke="#fb7185" stroke-width="6" stroke-linecap="round"/></svg>',
        dec_crab: '<svg viewBox="0 0 100 80" width="75" height="60"><ellipse cx="50" cy="70" rx="30" ry="6" fill="rgba(0,0,0,0.15)"/><ellipse cx="50" cy="50" rx="35" ry="20" fill="#ef4444"/><circle cx="35" cy="25" r="5" fill="#fff" stroke="#dc2626" stroke-width="2"/><circle cx="35" cy="25" r="2" fill="#000"/><circle cx="65" cy="25" r="5" fill="#fff" stroke="#dc2626" stroke-width="2"/><circle cx="65" cy="25" r="2" fill="#000"/><path d="M25,50 Q10,40 5,20 M75,50 Q90,40 95,20" fill="none" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/><circle cx="5" cy="20" r="8" fill="#ef4444"/><circle cx="95" cy="20" r="8" fill="#ef4444"/><path d="M15,60 Q5,65 10,75 M25,65 Q15,70 20,80 M85,60 Q95,65 90,75 M75,65 Q85,70 80,80" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/></svg>',
        dec_seagrass: '<svg viewBox="0 0 80 120" width="70" height="90"><ellipse cx="40" cy="110" rx="25" ry="5" fill="rgba(0,0,0,0.15)"/><path d="M40,110 Q20,60 30,10 M40,110 Q50,70 70,20 M40,110 Q25,80 10,40 M40,110 Q55,80 60,30" fill="none" stroke="#22c55e" stroke-width="8" stroke-linecap="round"/><path d="M40,110 Q20,60 30,10 M40,110 Q50,70 70,20 M40,110 Q25,80 10,40 M40,110 Q55,80 60,30" fill="none" stroke="#4ade80" stroke-width="3" stroke-linecap="round"/></svg>',
        dec_bubbles: '<svg viewBox="0 0 100 120" width="80" height="90"><circle cx="40" cy="100" r="8" fill="none" stroke="#bae6fd" stroke-width="2"/><circle cx="60" cy="70" r="14" fill="none" stroke="#38bdf8" stroke-width="2.5"/><circle cx="30" cy="40" r="10" fill="none" stroke="#bae6fd" stroke-width="2"/><circle cx="70" cy="20" r="18" fill="none" stroke="#7dd3fc" stroke-width="3"/><circle cx="66" cy="16" r="4" fill="#ffffff"/><circle cx="56" cy="66" r="3" fill="#ffffff"/></svg>',
        dec_fish: '<svg viewBox="0 0 100 80" width="80" height="60"><g transform="translate(10,20)"><ellipse cx="20" cy="15" rx="15" ry="8" fill="#facc15"/><polygon points="5,15 -5,5 -5,25" fill="#f59e0b"/><circle cx="28" cy="12" r="2" fill="#000"/></g><g transform="translate(50,40)"><ellipse cx="20" cy="15" rx="12" ry="6" fill="#38bdf8"/><polygon points="8,15 -2,7 -2,23" fill="#0284c7"/><circle cx="26" cy="13" r="1.5" fill="#000"/></g><g transform="translate(40,5)"><ellipse cx="20" cy="15" rx="10" ry="5" fill="#f43f5e"/><polygon points="10,15 2,9 2,21" fill="#be123c"/><circle cx="25" cy="14" r="1" fill="#000"/></g></svg>',
        dec_volcano: '<svg viewBox="0 0 120 100" width="90" height="75"><ellipse cx="60" cy="90" rx="45" ry="8" fill="rgba(0,0,0,0.2)"/><path d="M15,90 Q40,40 45,30 L75,30 Q80,40 105,90 Z" fill="#451a03"/><path d="M45,30 Q55,50 60,35 Q65,60 75,30 Z" fill="#ef4444"/><circle cx="60" cy="15" r="6" fill="#f97316"/><circle cx="45" cy="5" r="4" fill="#facc15"/><circle cx="75" cy="10" r="5" fill="#ef4444"/></svg>',
        dec_mushroom: '<svg viewBox="0 0 100 110" width="80" height="85"><ellipse cx="50" cy="100" rx="30" ry="6" fill="rgba(0,0,0,0.3)"/><path d="M45,100 L45,50 C45,40 55,40 55,50 L55,100 Z" fill="#e2e8f0"/><ellipse cx="50" cy="45" rx="40" ry="25" fill="#a855f7"/><ellipse cx="50" cy="50" rx="38" ry="15" fill="#c084fc"/><circle cx="35" cy="35" r="6" fill="#f3e8ff"/><circle cx="65" cy="40" r="4" fill="#f3e8ff"/><circle cx="50" cy="30" r="5" fill="#f3e8ff"/></svg>',
        dec_alienplant: '<svg viewBox="0 0 100 110" width="80" height="85"><ellipse cx="50" cy="100" rx="25" ry="6" fill="rgba(0,0,0,0.2)"/><path d="M50,100 Q40,60 20,30 M50,100 Q60,60 80,30 M50,100 L50,20" fill="none" stroke="#0ea5e9" stroke-width="6" stroke-linecap="round"/><circle cx="20" cy="30" r="10" fill="#f43f5e"/><circle cx="80" cy="30" r="10" fill="#f43f5e"/><circle cx="50" cy="20" r="14" fill="#facc15"/></svg>',
        dec_meteor: '<svg viewBox="0 0 100 100" width="80" height="80"><path d="M20,80 Q40,60 80,20 Q60,40 20,80" fill="none" stroke="#f59e0b" stroke-width="6"/><circle cx="75" cy="25" r="15" fill="#64748b"/><circle cx="72" cy="22" r="3" fill="#475569"/><circle cx="80" cy="28" r="4" fill="#475569"/><circle cx="70" cy="30" r="2" fill="#475569"/></svg>',
        dec_ufo: '<svg viewBox="0 0 120 80" width="90" height="60"><ellipse cx="60" cy="40" rx="50" ry="15" fill="#94a3b8"/><ellipse cx="60" cy="35" rx="50" ry="12" fill="#cbd5e1"/><ellipse cx="60" cy="25" rx="25" ry="15" fill="#38bdf8" opacity="0.6"/><circle cx="30" cy="40" r="3" fill="#ef4444"/><circle cx="60" cy="42" r="3" fill="#22c55e"/><circle cx="90" cy="40" r="3" fill="#facc15"/></svg>',
        dec_campfire: '<svg viewBox="0 0 100 100" width="70" height="70"><path d="M20,80 L80,80 L50,90 Z" fill="#78350f"/><path d="M30,85 L70,85 L50,95 Z" fill="#451a03"/><path d="M35,80 Q50,20 65,80 Q50,50 35,80 Z" fill="#f97316"/><path d="M42,80 Q50,40 58,80 Q50,60 42,80 Z" fill="#facc15"/></svg>',
        dec_tent: '<svg viewBox="0 0 120 100" width="90" height="75"><polygon points="10,90 60,20 110,90" fill="#16a34a"/><polygon points="60,20 110,90 90,90 60,30" fill="#15803d"/><polygon points="60,35 45,90 75,90" fill="#0f172a"/></svg>',
        dec_log: '<svg viewBox="0 0 100 60" width="80" height="48"><rect x="15" y="20" width="70" height="25" rx="5" fill="#78350f"/><ellipse cx="15" cy="32.5" rx="5" ry="12.5" fill="#d97706"/><line x1="25" y1="25" x2="70" y2="25" stroke="#451a03" stroke-width="2"/><line x1="25" y1="35" x2="60" y2="35" stroke="#451a03" stroke-width="2"/></svg>',
        dec_bush: '<svg viewBox="0 0 100 80" width="75" height="60"><circle cx="30" cy="50" r="25" fill="#15803d"/><circle cx="70" cy="50" r="25" fill="#15803d"/><circle cx="50" cy="35" r="30" fill="#22c55e"/><circle cx="40" cy="30" r="5" fill="#ef4444"/><circle cx="60" cy="20" r="5" fill="#ef4444"/><circle cx="25" cy="45" r="5" fill="#ef4444"/><circle cx="75" cy="55" r="5" fill="#ef4444"/></svg>',
        dec_rock: '<svg viewBox="0 0 100 70" width="75" height="52"><path d="M10,60 Q30,20 60,30 T90,60 Z" fill="#64748b"/><path d="M20,50 Q40,15 65,35" fill="none" stroke="#22c55e" stroke-width="5" stroke-linecap="round"/></svg>',
        dec_starfish: '<svg viewBox="0 0 100 100" width="70" height="70"><polygon points="50,10 65,40 95,45 70,65 75,95 50,80 25,95 30,65 5,45 35,40" fill="#f97316" stroke="#c2410c" stroke-width="3" stroke-linejoin="round"/><circle cx="50" cy="50" r="3" fill="#fff"/></svg>',
        dec_pearl: '<svg viewBox="0 0 100 90" width="75" height="68"><path d="M10,70 Q50,90 90,70 Q70,20 50,10 Q30,20 10,70 Z" fill="#94a3b8"/><path d="M20,65 Q50,80 80,65 Q65,30 50,25 Q35,30 20,65 Z" fill="#cbd5e1"/><circle cx="50" cy="55" r="12" fill="#fbcfe8"/><circle cx="47" cy="52" r="3" fill="#fff"/></svg>',
        dec_anchor: '<svg viewBox="0 0 100 110" width="70" height="78"><circle cx="50" cy="20" r="10" fill="none" stroke="#64748b" stroke-width="5"/><line x1="50" y1="30" x2="50" y2="90" stroke="#64748b" stroke-width="8"/><line x1="30" y1="50" x2="70" y2="50" stroke="#64748b" stroke-width="6"/><path d="M20,70 Q50,110 80,70" fill="none" stroke="#64748b" stroke-width="8" stroke-linecap="round"/><polygon points="10,70 30,70 20,60" fill="#64748b"/><polygon points="90,70 70,70 80,60" fill="#64748b"/></svg>',
        dec_sandcastle: '<svg viewBox="0 0 100 100" width="75" height="75"><rect x="20" y="50" width="60" height="40" fill="#fde047"/><rect x="35" y="20" width="30" height="30" fill="#fde047"/><polygon points="20,50 20,40 25,40 25,50" fill="#facc15"/><polygon points="75,50 75,40 80,40 80,50" fill="#facc15"/><path d="M45,90 A10,10 0 0,1 55,90 Z" fill="#78350f"/><polygon points="50,20 50,5 65,12" fill="#ef4444"/></svg>',
        dec_surfboard: '<svg viewBox="0 0 100 120" width="65" height="85"><ellipse cx="50" cy="60" rx="20" ry="50" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/><path d="M50,10 L50,110" stroke="#fff" stroke-width="4"/><path d="M32,40 Q50,60 68,40" fill="none" stroke="#facc15" stroke-width="4"/></svg>',
        dec_cactus: '<svg viewBox="0 0 100 110" width="70" height="78"><rect x="40" y="30" width="20" height="70" rx="10" fill="#16a34a"/><path d="M40,60 Q20,60 20,40" fill="none" stroke="#16a34a" stroke-width="12" stroke-linecap="round"/><path d="M60,70 Q80,70 80,50" fill="none" stroke="#16a34a" stroke-width="12" stroke-linecap="round"/><line x1="45" y1="40" x2="45" y2="90" stroke="#15803d" stroke-width="2"/><line x1="55" y1="40" x2="55" y2="90" stroke="#15803d" stroke-width="2"/></svg>',
        dec_skull: '<svg viewBox="0 0 100 80" width="75" height="60"><path d="M30,30 Q50,10 70,30 L65,60 L35,60 Z" fill="#f1f5f9"/><circle cx="40" cy="40" r="6" fill="#0f172a"/><circle cx="60" cy="40" r="6" fill="#0f172a"/><polygon points="50,55 45,50 55,50" fill="#0f172a"/><path d="M30,30 Q10,10 0,30" fill="none" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/><path d="M70,30 Q90,10 100,30" fill="none" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/></svg>',
        dec_chest: '<svg viewBox="0 0 100 90" width="75" height="68"><rect x="15" y="40" width="70" height="40" fill="#92400e" stroke="#451a03" stroke-width="4"/><path d="M15,40 Q50,10 85,40 Z" fill="#b45309" stroke="#451a03" stroke-width="4"/><rect x="45" y="35" width="10" height="15" fill="#facc15"/><circle cx="50" cy="42" r="2" fill="#000"/><line x1="15" y1="50" x2="85" y2="50" stroke="#451a03" stroke-width="2"/></svg>',
        dec_oasis: '<svg viewBox="0 0 120 80" width="90" height="60"><ellipse cx="60" cy="60" rx="50" ry="15" fill="#38bdf8"/><path d="M90,60 Q80,20 100,10" fill="none" stroke="#78350f" stroke-width="4"/><path d="M100,10 Q80,10 70,20 M100,10 Q110,0 120,15 M100,10 Q110,25 90,30" fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round"/></svg>',
        dec_lamp: '<svg viewBox="0 0 100 80" width="75" height="60"><path d="M30,50 Q50,70 70,50 Q60,30 40,30 Z" fill="#facc15"/><path d="M70,50 Q90,50 95,30" fill="none" stroke="#facc15" stroke-width="5" stroke-linecap="round"/><polygon points="20,40 35,45 35,55 20,60" fill="#eab308"/><ellipse cx="50" cy="30" rx="10" ry="3" fill="#ca8a04"/></svg>',
        dec_satellite: '<svg viewBox="0 0 100 100" width="75" height="75"><rect x="10" y="40" width="30" height="20" fill="#0284c7" stroke="#cbd5e1" stroke-width="2"/><rect x="60" y="40" width="30" height="20" fill="#0284c7" stroke="#cbd5e1" stroke-width="2"/><circle cx="50" cy="50" r="10" fill="#94a3b8"/><line x1="50" y1="40" x2="50" y2="10" stroke="#94a3b8" stroke-width="3"/><path d="M40,20 Q50,0 60,20" fill="none" stroke="#fff" stroke-width="2"/></svg>',
        dec_crater: '<svg viewBox="0 0 100 60" width="75" height="45"><ellipse cx="50" cy="30" rx="40" ry="20" fill="#94a3b8"/><ellipse cx="50" cy="32" rx="35" ry="15" fill="#64748b"/><circle cx="40" cy="35" r="3" fill="#475569"/><circle cx="65" cy="28" r="4" fill="#475569"/></svg>',
        dec_telescope: '<svg viewBox="0 0 100 100" width="75" height="75"><line x1="30" y1="90" x2="50" y2="60" stroke="#64748b" stroke-width="4"/><line x1="70" y1="90" x2="50" y2="60" stroke="#64748b" stroke-width="4"/><line x1="50" y1="90" x2="50" y2="60" stroke="#475569" stroke-width="4"/><polygon points="20,70 80,30 85,40 25,80" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/><rect x="75" y="25" width="15" height="25" fill="#38bdf8" transform="rotate(-33 82 37)"/></svg>',
        dec_robot: '<svg viewBox="0 0 100 100" width="70" height="70"><rect x="30" y="40" width="40" height="30" rx="5" fill="#cbd5e1"/><rect x="35" y="20" width="30" height="20" rx="3" fill="#94a3b8"/><circle cx="50" cy="30" r="5" fill="#ef4444"/><line x1="50" y1="20" x2="50" y2="5" stroke="#64748b" stroke-width="3"/><circle cx="50" cy="5" r="3" fill="#facc15"/><rect x="40" y="70" width="20" height="20" fill="#475569"/><circle cx="40" cy="90" r="6" fill="#1e293b"/><circle cx="60" cy="90" r="6" fill="#1e293b"/></svg>',
        dec_portal: '<svg viewBox="0 0 100 120" width="75" height="90"><ellipse cx="50" cy="60" rx="40" ry="50" fill="none" stroke="#22d3ee" stroke-width="6"/><ellipse cx="50" cy="60" rx="30" ry="40" fill="none" stroke="#0ea5e9" stroke-width="4"/><ellipse cx="50" cy="60" rx="20" ry="30" fill="#0284c7" opacity="0.5"/><circle cx="50" cy="10" r="3" fill="#fff"/><circle cx="90" cy="60" r="4" fill="#fff"/><circle cx="10" cy="60" r="3" fill="#fff"/></svg>'
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

window.fokusDekorasiIdx = -1;

window.fokusDekorasiHabitat = function(idx, e) {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    window.fokusDekorasiIdx = idx;
    window.renderTabHabitatMyPet();
};

window.lepasDekorasiHabitat = function(idx, e) {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    let uName = window.modeKunjunganPet || sessionStorage.getItem("username");
    let lb = window.modeKunjunganPet ? window.leaderboardSiswaData[uName] : window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData) return;
    lb.myPetData.activeDecorations.splice(idx, 1);
    window.fokusDekorasiIdx = -1;
    if (!window.modeKunjunganPet && typeof window.simpanLeaderboardSiswaKeDB === "function") window.simpanLeaderboardSiswaKeDB(uName, lb);
    window.renderTabHabitatMyPet();
};

window.mulaiDragDekorasi = function(e, idx) {
    if (window.modeKunjunganPet) return;
    e.stopPropagation(); e.preventDefault();
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb || !lb.myPetData || !lb.myPetData.activeDecorations[idx]) return;

    let el = document.getElementById('mypet-decor-item-' + idx);
    let stage = document.getElementById('mypet-habitat-stage');
    let sRect = stage.getBoundingClientRect();
    
    let startX = e.clientX, startY = e.clientY;
    let decObj = lb.myPetData.activeDecorations[idx];
    let initLeft = parseFloat(decObj.left) || 50;
    let initBottom = parseFloat(decObj.bottom) || 20;

    e.target.setPointerCapture(e.pointerId);

    function move(ev) {
        let dxPct = ((ev.clientX - startX) / sRect.width) * 100;
        let dyPct = (-(ev.clientY - startY) / sRect.height) * 100;
        
        let nL = Math.max(0, Math.min(100, initLeft + dxPct));
        let nB = Math.max(0, Math.min(100, initBottom + dyPct));
        
        el.style.left = nL + '%';
        el.style.bottom = nB + '%';
        decObj.left = nL.toFixed(1) + '%';
        decObj.bottom = nB.toFixed(1) + '%';
    }
    function up(ev) {
        e.target.releasePointerCapture(e.pointerId);
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") window.simpanLeaderboardSiswaKeDB(uName, lb);
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
};

window.bangunSVGTemaHabitat = function(themeId) {
    let defSvg = '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"><defs><linearGradient id="skyWarmGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f0f9ff"/><stop offset="55%" stop-color="#fef9c3"/><stop offset="100%" stop-color="#dcfce7"/></linearGradient><linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="#15803d"/></linearGradient><linearGradient id="hillLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#bef264"/><stop offset="100%" stop-color="#65a30d"/></linearGradient><linearGradient id="hillRightGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#a3e635"/><stop offset="100%" stop-color="#4d7c0f"/></linearGradient><linearGradient id="riverWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#bae6fd"/><stop offset="45%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs><rect width="1000" height="360" fill="url(#skyWarmGrad)"/><circle cx="480" cy="42" r="46" fill="#fde047" opacity="0.35"/><circle cx="480" cy="42" r="32" fill="#facc15"/><g stroke="#f59e0b" stroke-width="3" stroke-linecap="round" opacity="0.75"><line x1="480" y1="82" x2="480" y2="96"/><line x1="450" y1="76" x2="442" y2="90"/><line x1="510" y1="76" x2="518" y2="90"/><line x1="428" y1="58" x2="414" y2="66"/><line x1="532" y1="58" x2="546" y2="66"/></g><path d="M260,55 Q268,45 276,55 Q284,45 292,55" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/><path d="M295,68 Q302,60 309,68 Q316,60 323,68" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round"/><path d="M680,48 Q687,40 694,48 Q701,40 708,48" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round"/><polygon points="290,195 430,28 595,28 710,195" fill="url(#mountainGrad)" opacity="0.65"/><polygon points="360,195 495,48 640,195" fill="#16a34a" opacity="0.45"/><path d="M0,145 Q220,115 440,185 L440,360 L0,360 Z" fill="url(#hillLeftGrad)"/><path d="M360,185 Q720,105 1000,135 L1000,360 L360,360 Z" fill="url(#hillRightGrad)"/><path d="M0,205 Q480,165 1000,200 L1000,360 L0,360 Z" fill="#86efac"/><path d="M0,235 Q520,195 1000,225 L1000,360 L0,360 Z" fill="#4ade80"/><path d="M395,182 Q335,235 160,260 Q95,305 155,360 L465,360 Q485,295 435,245 Q415,210 395,182 Z" fill="#fde68a"/><path d="M402,184 Q345,238 175,264 Q115,308 170,360 L448,360 Q468,295 422,246 Q408,210 402,184 Z" fill="url(#riverWaterGrad)"/><path d="M240,295 Q280,290 320,295 M210,325 Q265,318 315,325 M310,255 Q345,250 380,255" fill="none" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round" opacity="0.75"/><rect x="34" y="105" width="18" height="125" rx="5" fill="#78350f"/><circle cx="45" cy="85" r="48" fill="#4d7c0f"/><circle cx="22" cy="108" r="36" fill="#65a30d"/><circle cx="68" cy="105" r="34" fill="#84cc16"/><rect x="945" y="100" width="18" height="130" rx="5" fill="#78350f"/><circle cx="952" cy="82" r="48" fill="#4d7c0f"/><circle cx="928" cy="105" r="36" fill="#84cc16"/><circle cx="975" cy="108" r="34" fill="#3f6212"/><path d="M0,360 L0,305 Q35,285 60,320 Q90,295 125,335 Q150,315 175,360 Z" fill="#15803d" opacity="0.85"/><path d="M820,360 Q850,310 885,335 Q915,290 950,320 Q975,285 1000,310 L1000,360 Z" fill="#15803d" opacity="0.85"/><circle cx="75" cy="318" r="6" fill="#f43f5e"/><circle cx="112" cy="332" r="5" fill="#facc15"/><circle cx="875" cy="328" r="6" fill="#fb923c"/><circle cx="925" cy="315" r="6" fill="#f43f5e"/></svg>';

    let themesMap = {
        "thm_volcano": '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"><rect width="1000" height="360" fill="#7f1d1d"/><polygon points="200,200 400,20 600,200 800,50 1000,200 1000,360 0,360 0,200" fill="#1c1917"/><polygon points="370,50 400,20 430,50 410,120 450,180 350,180 390,120" fill="#ea580c"/><path d="M0,250 Q250,220 500,280 T1000,250 L1000,360 L0,360 Z" fill="#292524"/><path d="M200,260 Q400,230 600,300 T1000,280 L1000,360 L0,360 L0,300 Q100,280 200,260 Z" fill="#ea580c" opacity="0.8"/></svg>',
        "thm_jungle": '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"><rect width="1000" height="360" fill="#ecfccb"/><circle cx="200" cy="150" r="250" fill="#14532d"/><circle cx="800" cy="150" r="280" fill="#166534"/><path d="M0,200 Q250,150 500,220 T1000,180 L1000,360 L0,360 Z" fill="#22c55e"/><path d="M0,260 Q250,220 500,280 T1000,240 L1000,360 L0,360 Z" fill="#15803d"/><rect x="100" y="0" width="10" height="360" fill="#a3e635" opacity="0.5"/><rect x="850" y="0" width="12" height="360" fill="#a3e635" opacity="0.5"/></svg>',
        "thm_underwater": '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"><defs><linearGradient id="uwGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#082f49"/></linearGradient></defs><rect width="1000" height="360" fill="url(#uwGrad)"/><path d="M0,300 Q250,260 500,320 T1000,280 L1000,360 L0,360 Z" fill="#fef3c7"/><path d="M0,330 Q250,300 500,340 T1000,310 L1000,360 L0,360 Z" fill="#fde68a"/><circle cx="150" cy="120" r="8" fill="#fff" opacity="0.3"/><circle cx="160" cy="80" r="12" fill="#fff" opacity="0.2"/><circle cx="850" cy="180" r="6" fill="#fff" opacity="0.4"/><circle cx="840" cy="130" r="15" fill="#fff" opacity="0.2"/></svg>',
        "thm_beach": '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"><rect width="1000" height="360" fill="#a5f3fc"/><circle cx="800" cy="80" r="50" fill="#fef08a"/><path d="M0,180 Q250,170 500,190 T1000,180 L1000,360 L0,360 Z" fill="#0ea5e9"/><path d="M0,220 Q250,200 500,240 T1000,210 L1000,360 L0,360 Z" fill="#38bdf8"/><path d="M0,280 Q250,250 500,290 T1000,260 L1000,360 L0,360 Z" fill="#fde047"/><path d="M0,310 Q250,290 500,320 T1000,300 L1000,360 L0,360 Z" fill="#facc15"/></svg>',
        "thm_cloud": '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"><rect width="1000" height="360" fill="#e0f2fe"/><circle cx="200" cy="300" r="120" fill="#ffffff"/><circle cx="400" cy="320" r="140" fill="#ffffff"/><circle cx="600" cy="280" r="130" fill="#ffffff"/><circle cx="850" cy="340" r="150" fill="#ffffff"/><rect x="0" y="300" width="1000" height="60" fill="#ffffff"/><circle cx="150" cy="100" r="40" fill="#ffffff" opacity="0.6"/><circle cx="220" cy="120" r="50" fill="#ffffff" opacity="0.6"/><circle cx="800" cy="80" r="60" fill="#ffffff" opacity="0.6"/></svg>',
        "thm_wood": '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"><rect width="1000" height="360" fill="#78350f"/><rect x="0" y="0" width="1000" height="40" fill="#451a03" opacity="0.5"/><rect x="0" y="80" width="1000" height="40" fill="#451a03" opacity="0.5"/><rect x="0" y="160" width="1000" height="40" fill="#451a03" opacity="0.5"/><rect x="350" y="40" width="300" height="150" fill="#bae6fd" stroke="#451a03" stroke-width="10"/><line x1="500" y1="40" x2="500" y2="190" stroke="#451a03" stroke-width="10"/><line x1="350" y1="115" x2="650" y2="115" stroke="#451a03" stroke-width="10"/><path d="M0,240 L1000,240 L1000,360 L0,360 Z" fill="#92400e"/><line x1="0" y1="280" x2="1000" y2="280" stroke="#78350f" stroke-width="4"/><line x1="0" y1="320" x2="1000" y2="320" stroke="#78350f" stroke-width="4"/><polygon points="200,250 800,250 850,350 150,350" fill="#ef4444" opacity="0.8"/></svg>',
        "thm_desert": '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"><rect width="1000" height="360" fill="#fdba74"/><circle cx="500" cy="150" r="100" fill="#fef08a"/><path d="M0,200 Q300,100 600,220 T1000,180 L1000,360 L0,360 Z" fill="#fcd34d"/><path d="M0,260 Q400,200 700,280 T1000,250 L1000,360 L0,360 Z" fill="#fbbf24"/><path d="M0,300 Q500,260 1000,320 L1000,360 L0,360 Z" fill="#f59e0b"/></svg>',
        "thm_space": '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"><rect width="1000" height="360" fill="#1e1b4b"/><circle cx="100" cy="80" r="2" fill="#fff"/><circle cx="250" cy="150" r="3" fill="#fff"/><circle cx="400" cy="60" r="2" fill="#fff"/><circle cx="700" cy="120" r="4" fill="#fff"/><circle cx="850" cy="70" r="2" fill="#fff"/><circle cx="800" cy="180" r="60" fill="#6366f1" opacity="0.8"/><circle cx="780" cy="160" r="10" fill="#4f46e5"/><circle cx="820" cy="190" r="15" fill="#4f46e5"/><path d="M0,250 Q250,220 500,270 T1000,230 L1000,360 L0,360 Z" fill="#475569"/><path d="M0,300 Q300,280 600,320 T1000,290 L1000,360 L0,360 Z" fill="#334155"/><ellipse cx="300" cy="320" rx="40" ry="15" fill="#1e293b"/><ellipse cx="750" cy="340" rx="30" ry="10" fill="#1e293b"/></svg>',
        "thm_underground": '<svg viewBox="0 0 1000 360" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"><rect width="1000" height="360" fill="#334155"/><polygon points="100,0 150,120 200,0" fill="#475569"/><polygon points="400,0 480,180 550,0" fill="#475569"/><polygon points="800,0 830,100 860,0" fill="#475569"/><path d="M0,220 Q250,180 500,240 T1000,200 L1000,360 L0,360 Z" fill="#1e293b"/><path d="M0,280 Q300,250 600,300 T1000,270 L1000,360 L0,360 Z" fill="#0f172a"/><polygon points="250,300 270,220 290,300" fill="#c084fc" opacity="0.8"/><polygon points="265,300 280,240 295,300" fill="#d8b4fe" opacity="0.8"/><polygon points="750,320 780,190 810,320" fill="#c084fc" opacity="0.8"/><polygon points="770,320 790,210 820,320" fill="#d8b4fe" opacity="0.8"/></svg>'
    };

    return themesMap[themeId] || defSvg;
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
        let coinSaldo = window.ambilCoinSiswa(uName);
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

    let decorHtml = '';
    let activeDecs = Array.isArray(petData.activeDecorations) ? petData.activeDecorations : [];
    activeDecs.forEach(function(decObj, idx) {
        if (typeof decObj === "string") decObj = { id: decObj, left: "50%", bottom: "20%" };
        let decCfg = window.MY_PET_CATALOG.decorations.find(function(d) { return d.id === decObj.id; });
        if (decCfg) {
            let svgDec = window.bangunSVGDeKorasiHabitat(decObj.id);
            let isFokus = (window.fokusDekorasiIdx === idx) && !isVisitMode;
            let dragBtn = isFokus ?
                '<div class="mypet-decor-drag-btn" style="position:absolute; top:-30px; left:50%; transform:translateX(-50%); background:#f39c12; color:white; padding:4px 12px; border-radius:12px; font-size:11px; font-weight:bold; cursor:grab; z-index:10; white-space:nowrap; box-shadow:0 2px 5px rgba(0,0,0,0.2);" onpointerdown="window.mulaiDragDekorasi(event, ' + idx + ')">✥ Drag</div>' +
                '<button class="mypet-decor-del-btn" style="position:absolute; top:-30px; right:-25px; background:#e74c3c; color:white; border:none; border-radius:50%; width:24px; height:24px; font-size:11px; font-weight:bold; cursor:pointer; z-index:10; box-shadow:0 2px 5px rgba(0,0,0,0.2);" onclick="window.lepasDekorasiHabitat(' + idx + ', event)">✕</button>'
                : '';

            decorHtml +=
                '<div class="mypet-decor-svg-item" id="mypet-decor-item-' + idx + '" style="position:absolute; left:' + decObj.left + '; bottom:' + decObj.bottom + '; z-index:3; transform:translate(-50%, 10%); cursor:pointer;" onclick="window.fokusDekorasiHabitat(' + idx + ', event)" title="' + decCfg.nama + '">' +
                    dragBtn +
                    (svgDec || '<span style="font-size:40px;">' + decCfg.ikon + '</span>') +
                '</div>';
        }
    });

    let stagePetsHtml = '';
    let waterSlots = [ { l: 28, b: 16 }, { l: 38, b: 24 }, { l: 22, b: 28 }, { l: 34, b: 11 } ];
    let landSlots = [ { l: 58, b: 14 }, { l: 72, b: 22 }, { l: 48, b: 26 }, { l: 84, b: 18 }, { l: 65, b: 30 }, { l: 12, b: 20 }, { l: 78, b: 30 } ];
    let wIdx = 0, lIdx = 0;

    ownedIds.forEach(function(pid) {
        let pObj = petData.ownedPets[pid];
        let pCat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === pid; }) || window.MY_PET_CATALOG.pets[0];
        let pLapar = window.dapatkanInfoStatusLaparPet(pObj.hunger);
        let isMain = (pid === activeId);

        let isWaterPet = (pCat.zona === "water" || pid === "ikan" || pid === "buaya");
        let slotPos = isWaterPet ? waterSlots[(wIdx++) % waterSlots.length] : landSlots[(lIdx++) % landSlots.length];
        let ukuranDiHabitat = isMain ? 114 : 86;
        let svgPet = window.bangunVisualPet25DSVG(pid, pObj.outfit || {}, pLapar.animState, ukuranDiHabitat);
        let waterRipple = isWaterPet ? '<div class="mypet-water-ripple"></div>' : '';

        stagePetsHtml +=
            '<div class="mypet-stage-actor-wrap ' + (isMain ? 'is-active-pet' : 'is-companion-pet') + (isWaterPet ? ' is-aquatic-pet' : '') + '" ' +
                 'style="left:' + slotPos.l + '%; bottom:' + slotPos.b + '%; z-index:' + (isMain ? 12 : 7) + ';" ' +
                 'onclick="window.interaksiKlikPetDiHabitat(\'' + pid + '\')" ' +
                 'title="Klik untuk berinteraksi dengan ' + (pObj.customName || pCat.namaDefault) + '">' +
                svgPet + waterRipple +
                '<div class="mypet-stage-nametag">' + (isMain ? '⭐ ' : '') + (pObj.customName || pCat.namaDefault) + '</div>' +
            '</div>';
    });

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
        : ('🏡 Sanctuary Alam Bebas (<b style="color:#16a34a;">' + ownedIds.length + ' Pet Tinggal Bersama</b>)');

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

    container.innerHTML =
        bannerKritis +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">' +
            '<div style="background:#ffffff; border:1px solid #cbd5e1; color:#334155; padding:6px 14px; border-radius:20px; font-size:12px;">' + titleHabitat + '</div>' +
            (isVisitMode ? '<button class="btn-action" style="background:#e74c3c; width:auto; padding:6px 14px; font-size:11px;" onclick="window.akhiriKunjunganPet()">🚪 Pulang ke Habitat Sendiri</button>' : '<div style="font-size:11px; color:#64748b; font-weight:600;">💡 Klik 1x dekorasi untuk menyeretnya (drag). Klik ruang kosong untuk melepas!</div>') +
        '</div>' +

        '<div id="mypet-habitat-stage" class="mypet-habitat-stage" style="border-color:#94a3b8;" onclick="if(window.fokusDekorasiIdx !== -1) { window.fokusDekorasiIdx = -1; window.renderTabHabitatMyPet(); }">' +
            window.bangunSVGTemaHabitat(petData.activeTheme) +
            decorHtml +
            stagePetsHtml +
            (!isVisitMode ? '<div class="mypet-food-bowl" onclick="window.toggleLaciMakanHabitat(true)" title="Wadah Makanan (Klik untuk memberi makan)"><span>' + (hungerVal < 25 ? '🥣' : '🍲') + '</span></div>' : '') +
            '<div id="mypet-interaction-toast" class="mypet-interaction-toast" style="display:none;"></div>' +
        '</div>' +

        laciMakanHtml + laciMainanHtml +

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

window.ambilDataLbPetAktif = function() {
    let targetUser = window.modeKunjunganPet || sessionStorage.getItem("username");
    if (window.modeKunjunganPet && window.leaderboardSiswaData && window.leaderboardSiswaData[targetUser]) {
        return { user: targetUser, lb: window.leaderboardSiswaData[targetUser] };
    }
    return { user: targetUser, lb: window.pastikanStrukturDualXPDanPet(targetUser) };
};

window.interaksiKlikPetDiHabitat = function(petId) {
    let ctx = window.ambilDataLbPetAktif();
    let lb = ctx.lb;
    if (!lb || !lb.myPetData || !lb.myPetData.ownedPets[petId]) return;

    if (lb.myPetData.activePetId !== petId) {
        lb.myPetData.activePetId = petId;
        if (typeof window.simpanLeaderboardSiswaKeDB === "function" && !window.modeKunjunganPet) {
            window.simpanLeaderboardSiswaKeDB(ctx.user, lb);
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
    window.mainkanEfekVisualInteraksiPet(pilihState === "sleepy" ? "💤" : "✨", "✨");

    let sapaan = pilihState === "sleepy"
        ? "🥱 <b>" + nama + "</b> menguap manja dan menoleh ke arahmu!"
        : "✨ <b>" + nama + "</b> melompat senang saat kamu menyapanya!";
    window.tampilkanToastInteraksiPet(sapaan);
};

window.aksiElusPetAktif = function() {
    let ctx = window.ambilDataLbPetAktif();
    let lb = ctx.lb;
    if (!lb || !lb.myPetData) return;

    let activeId = lb.myPetData.activePetId || Object.keys(lb.myPetData.ownedPets || {})[0];
    let pet = lb.myPetData.ownedPets[activeId];
    if (!pet) return;

    let cat = window.MY_PET_CATALOG.pets.find(function(x) { return x.id === activeId; }) || window.MY_PET_CATALOG.pets[0];
    let nama = pet.customName || cat.namaDefault;
    let now = Date.now();
    let cooldownMs = 5 * 60 * 1000;

    window.bukaLaciMainanHabitat = false;
    window.triggerAnimasiPetSementara("#mypet-habitat-stage", "happy", 2600);
    window.triggerAnimasiPetSementara("#mypet-detail-preview-box", "happy", 2600);
    window.mainkanEfekVisualInteraksiPet("💖", "✨");

    if (pet.lastPetTime && (now - pet.lastPetTime) < cooldownMs) {
        let sisaMenit = Math.ceil((cooldownMs - (now - pet.lastPetTime)) / 60000);
        window.tampilkanToastInteraksiPet("💖 <b>" + nama + "</b> merasa nyaman dielus! (Bond dapat naik lagi dalam " + sisaMenit + " menit)");
        return;
    }

    pet.lastPetTime = now;
    pet.mood = Math.min(100, (Number(pet.mood) || 80) + 8);
    pet.bondXp = (Number(pet.bondXp) || 0) + 12;

    if (typeof window.simpanLeaderboardSiswaKeDB === "function" && !window.modeKunjunganPet) {
        window.simpanLeaderboardSiswaKeDB(ctx.user, lb);
    }

    setTimeout(function() {
        window.renderTabHabitatMyPet();
        window.tampilkanToastInteraksiPet(window.modeKunjunganPet ? ("🥰 Kamu mengelus <b>" + nama + "</b> milik " + ctx.user + "!") : ("🥰 <b>" + nama + "</b> sangat senang dielus! (+8 Mood, +12 Bond)"));
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
    let ctx = window.ambilDataLbPetAktif();
    let lb = ctx.lb;
    if (!lb || !lb.myPetData) return;

    let activeId = lb.myPetData.activePetId || Object.keys(lb.myPetData.ownedPets || {})[0];
    let pet = lb.myPetData.ownedPets[activeId];
    if (!pet) return;

    let mainan = window.MY_PET_CATALOG.toys.find(function(x) { return x.id === toyId; });
    if (!mainan) return;

    let nilaiKenyang = (pet.hunger !== undefined && pet.hunger !== null && !isNaN(Number(pet.hunger))) ? Number(pet.hunger) : 85;
    if (nilaiKenyang < 15) {
        return window.tampilkanToastInteraksiPet("⚠️ Pet terlalu lapar (" + Math.round(nilaiKenyang) + "/100) untuk bermain! Beri makan dulu ya.");
    }

    let now = Date.now();
    let cooldownMs = 10 * 60 * 1000;

    window.bukaLaciMainanHabitat = false;
    window.triggerAnimasiPetSementara("#mypet-habitat-stage", mainan.animasi || "happy", 2500);
    window.triggerAnimasiPetSementara("#mypet-detail-preview-box", mainan.animasi || "happy", 2500);
    window.mainkanEfekVisualInteraksiPet(mainan.ikon, "✨");

    if (pet.lastPlayTime && (now - pet.lastPlayTime) < cooldownMs) {
        let sisaMenit = Math.ceil((cooldownMs - (now - pet.lastPlayTime)) / 60000);
        window.tampilkanToastInteraksiPet(mainan.ikon + " " + mainan.deskripsi + " (Bonus XP Main tersedia dalam " + sisaMenit + " menit)");
        return;
    }

    pet.lastPlayTime = now;
    pet.mood = Math.min(100, (Number(pet.mood) || 80) + 15);
    pet.bondXp = (Number(pet.bondXp) || 0) + 15;

    if (typeof window.simpanLeaderboardSiswaKeDB === "function" && !window.modeKunjunganPet) {
        window.simpanLeaderboardSiswaKeDB(ctx.user, lb);
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
    if (stokKu <= 0) return window.tampilkanCustomDialog("alert", "Stok makanan ini milikmu sudah habis!", null, null);

    let pet = targetLb.myPetData.ownedPets[targetLb.myPetData.activePetId];
    if (!pet) return;

    let itemFood = [...window.MY_PET_CATALOG.foods, ...window.MY_PET_CATALOG.snacks].find(f => f.id === foodId);
    if (!itemFood) return;

    let nama = pet.customName || window.MY_PET_CATALOG.pets.find(x => x.id === targetLb.myPetData.activePetId).namaDefault;

    myLb.myPetData.foodInventory[foodId] = stokKu - 1;
    if (myLb.myPetData.foodInventory[foodId] <= 0) delete myLb.myPetData.foodInventory[foodId];
    if (window.modeKunjunganPet && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(myUName, myLb);
    }

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
    
    window.tampilkanCustomDialog("prompt", "Berikan nama panggilan khusus untuk " + cat.spesies + " kesayanganmu (Maks. 16 karakter):", namaLama, function(namaBaru) {
        if (namaBaru === null) return;
        namaBaru = namaBaru.trim().slice(0, 16);
        if (!namaBaru) return;

        pet.customName = namaBaru;
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        window.renderTabHabitatMyPet();
        window.tampilkanToastInteraksiPet("🏷️ Nama pet berhasil diubah menjadi <b>" + namaBaru + "</b>!");
    });
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
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "themes" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'themes\')">🖼️ Tema</button>' +
                '<button type="button" class="mypet-subtab-btn ' + (catAktif === "habitat" ? "active" : "") + '" onclick="window.renderTabShopMyPet(\'habitat\')">⛲ Dekorasi</button>' +
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
else if (catAktif === "themes") {
        let ownedTh = Array.isArray(petData.ownedThemes) ? petData.ownedThemes : [];
        let activeTh = petData.activeTheme || "default";

        bodyShopHtml +=
            '<div style="background:#eaf2f8; border-left:4px solid #2980b9; padding:10px 14px; border-radius:8px; margin-bottom:12px; font-size:12px; color:#1e293b;">' +
                '🖼️ <b>Ganti Suasana Panggung Habitat:</b> Beli tema sekali dan gunakan selamanya untuk mengganti latar belakang alam di Habitat Universalmu!' +
            '</div>' +
            '<div class="mypet-shop-grid">';

        window.MY_PET_CATALOG.themes.forEach(function(thm) {
            let isOwned = ownedTh.includes(thm.id);
            let isActive = (activeTh === thm.id);

            let btnThm = isOwned
                ? '<button type="button" class="btn-action" style="background:' + (isActive ? '#64748b' : '#27ae60') + '; width:100%; padding:8px; font-size:12px;" onclick="window.beliTemaHabitat(\'' + thm.id + '\')">' +
                      (isActive ? '✓ Sedang Dipakai' : '✨ Pakai Tema') +
                  '</button>'
                : '<button type="button" class="btn-action" style="background:#0b3954; color:#f1c40f; width:100%; padding:8px; font-size:12px; font-weight:800;" onclick="window.beliTemaHabitat(\'' + thm.id + '\')">🛒 Beli (' + thm.harga.toLocaleString("id-ID") + ' Coin)</button>';

            bodyShopHtml +=
                '<div class="mypet-shop-card">' +
                    '<div style="font-size:40px; margin:8px 0;">' + thm.ikon + '</div>' +
                    '<div style="font-weight:800; font-size:14px; color:#0f172a;">' + thm.nama + '</div>' +
                    '<div style="font-size:11px; color:#64748b; margin-bottom:8px; min-height:30px;">' + thm.deskripsi + '</div>' +
                    btnThm +
                '</div>';
        });
        bodyShopHtml += '</div>';
    }
    
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
window.beliTemaHabitat = function(themeId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;
    let t = window.MY_PET_CATALOG.themes.find(x => x.id === themeId);
    if (!t) return;

    if (!Array.isArray(lb.myPetData.ownedThemes)) lb.myPetData.ownedThemes = [];
    if (lb.myPetData.ownedThemes.includes(themeId)) {
        lb.myPetData.activeTheme = themeId;
        if (typeof window.simpanLeaderboardSiswaKeDB === "function") window.simpanLeaderboardSiswaKeDB(uName, lb);
        window.gantiTabMyPet("habitat");
        return;
    }

    let saldo = window.ambilCoinSiswa(uName);
    if (saldo < t.harga) return window.tampilkanCustomDialog("alert", "⚠️ Coin belum cukup untuk membeli tema \"" + t.nama + "\"!", null, null);
    
    window.tampilkanCustomDialog("confirm", "Beli tema habitat \"" + t.nama + "\" seharga " + t.harga.toLocaleString("id-ID") + " Coin?", null, function(isYes) {
        if (!isYes) return;
        if (window.gunakanCoinSiswa(t.harga, "beli_theme_" + themeId)) {
            lb.myPetData.ownedThemes.push(themeId);
            lb.myPetData.activeTheme = themeId;
            if (typeof window.simpanLeaderboardSiswaKeDB === "function") window.simpanLeaderboardSiswaKeDB(uName, lb);
            window.renderTabShopMyPet("themes");
            window.tampilkanCustomDialog("alert", "🖼️ Berhasil membeli tema Habitat! Background telah diubah.", null, null);
        }
    });
};

window.beliPetDiShop = function(petId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let petData = lb.myPetData;
    let catPet = window.MY_PET_CATALOG.pets.find(function(p) { return p.id === petId; });
    if (!catPet) return;

    if (petData.ownedPets && petData.ownedPets[petId]) {
        return window.tampilkanCustomDialog("alert", "Kamu sudah memiliki " + catPet.spesies + " di habitatmu!", null, null);
    }

    let saldo = window.ambilCoinSiswa(uName);
    if (saldo < catPet.harga) {
        let kurang = (catPet.harga - saldo).toLocaleString("id-ID");
        return window.tampilkanCustomDialog("alert", "⚠️ Coin kamu belum cukup untuk mengadopsi " + catPet.spesies + "!\n\nHarga: " + catPet.harga.toLocaleString("id-ID") + " Coin\nCoin Kamu: " + saldo.toLocaleString("id-ID") + " Coin\n(Kurang " + kurang + " Coin lagi)", null, null);
    }

    window.tampilkanCustomDialog("confirm", "Adopsi \"" + catPet.spesies + "\" (" + catPet.rarity + ") seharga " + catPet.harga.toLocaleString("id-ID") + " Coin?\n\n(XP kamu di Leaderboard tidak akan berkurang!)", null, function(isYes) {
        if (!isYes) return;
        if (window.gunakanCoinSiswa(catPet.harga, "beli_pet_" + petId)) {
            window.tampilkanCustomDialog("prompt", "🎉 Selamat! Berikan nama panggilan untuk " + catPet.spesies + " barumu:", catPet.namaDefault, function(namaCustom) {
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
            });
        }
    });
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
        return window.tampilkanCustomDialog("alert", "Kamu sudah memiliki mainan ini!", null, null);
    }

    let saldo = window.ambilCoinSiswa(uName);
    if (saldo < item.harga) {
        let kurang = (item.harga - saldo).toLocaleString("id-ID");
        return window.tampilkanCustomDialog("alert", "⚠️ Coin belum cukup untuk membeli mainan \"" + item.nama + "\"!\n\nHarga: " + item.harga.toLocaleString("id-ID") + " Coin\nCoin Kamu: " + saldo.toLocaleString("id-ID") + " Coin\n(Kurang " + kurang + " Coin lagi)", null, null);
    }

    window.tampilkanCustomDialog("confirm", "Beli mainan permanen \"" + item.nama + "\" seharga " + item.harga.toLocaleString("id-ID") + " Coin?", null, function(isYes) {
        if (!isYes) return;
        if (window.gunakanCoinSiswa(item.harga, "beli_toy_" + toyId)) {
            lb.myPetData.ownedWardrobe.push(toyId);
            lb.myPetData.ownedToys.push(toyId);
            if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
                window.simpanLeaderboardSiswaKeDB(uName, lb);
            }
            window.renderTabShopMyPet("toys");
            window.tampilkanCustomDialog("alert", "🎾 Berhasil membeli \"" + item.nama + "\"! Sekarang kamu bisa menggunakannya lewat tombol Main di Habitat.", null, null);
        }
    });
};

window.beliDekorasiHabitat = function(decId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let dec = window.MY_PET_CATALOG.decorations.find(function(d) { return d.id === decId; });
    if (!dec) return;

    let saldo = window.ambilCoinSiswa(uName);
    if (saldo < dec.harga) {
        return window.tampilkanCustomDialog("alert", "⚠️ Coin kamu belum cukup untuk membeli " + dec.nama + " (" + dec.harga.toLocaleString("id-ID") + " Coin)!", null, null);
    }

    window.tampilkanCustomDialog("confirm", "Beli dekorasi \"" + dec.nama + "\" seharga " + dec.harga.toLocaleString("id-ID") + " Coin?", null, function(isYes) {
        if (!isYes) return;
        if (window.gunakanCoinSiswa(dec.harga, "beli_decor_" + decId)) {
            if (!lb.myPetData.ownedDecorations.includes(decId)) {
                lb.myPetData.ownedDecorations.push(decId);
            }
            
            let left = "50%", bottom = "20%";
            if (dec.slot.includes("Kiri")) left = "20%"; 
            else if (dec.slot.includes("Kanan")) left = "80%";
            if (dec.slot.includes("Belakang")) bottom = "45%";
            
            let isAlreadyActive = lb.myPetData.activeDecorations.some(x => (typeof x === "object" ? x.id : x) === decId);
            if (!isAlreadyActive) {
                lb.myPetData.activeDecorations.push({ id: decId, left: left, bottom: bottom });
            }
            
            if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
                window.simpanLeaderboardSiswaKeDB(uName, lb);
            }
            window.renderTabShopMyPet("habitat");
        }
    });
};

window.togglePasangDekorasiHabitat = function(decId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturDualXPDanPet(uName);
    if (!lb) return;

    let act = lb.myPetData.activeDecorations || [];
    let idx = act.findIndex(function(x) { return (typeof x === "object" ? x.id : x) === decId; });
    
    if (idx !== -1) {
        act.splice(idx, 1);
    } else {
        let dCfg = window.MY_PET_CATALOG.decorations.find(x => x.id === decId);
        let left = "50%", bottom = "20%";
        if (dCfg && dCfg.slot) {
            if (dCfg.slot.includes("Kiri")) left = "20%"; 
            else if (dCfg.slot.includes("Kanan")) left = "80%";
            if (dCfg.slot.includes("Belakang")) bottom = "45%";
        }
        act.push({ id: decId, left: left, bottom: bottom });
    }
    
    lb.myPetData.activeDecorations = act;
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
        return window.tampilkanCustomDialog("alert", "⚠️ Coin kamu belum cukup untuk membeli " + item.nama + " (" + item.harga + " Coin)!", null, null);
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
        return window.tampilkanCustomDialog("alert", "⚠️ Coin belum cukup untuk membeli \"" + item.nama + "\"!\n\nHarga: " + item.harga.toLocaleString("id-ID") + " Coin\nCoin Kamu: " + saldo.toLocaleString("id-ID") + " Coin\n(Kurang " + kurang + " Coin lagi)", null, null);
    }

    window.tampilkanCustomDialog("confirm", "Beli \"" + item.nama + "\" seharga " + item.harga.toLocaleString("id-ID") + " Coin?\n\nItem ini akan tersimpan permanen di Wardrobe!", null, function(isYes) {
        if (!isYes) return;
        if (window.gunakanCoinSiswa(item.harga, "beli_wardrobe_" + itemId)) {
            lb.myPetData.ownedWardrobe.push(itemId);
            if (lb.myPetData.activePetId && lb.myPetData.ownedPets[lb.myPetData.activePetId]) {
                window.pakaiLepasItemWardrobe(itemId, true);
            }
            if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
                window.simpanLeaderboardSiswaKeDB(uName, lb);
            }
            window.renderTabShopMyPet("wardrobe");
            window.tampilkanCustomDialog("alert", "👗 Berhasil membeli \"" + item.nama + "\"! Item telah masuk ke Wardrobe.", null, null);
        }
    });
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
