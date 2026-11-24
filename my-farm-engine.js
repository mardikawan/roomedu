/* =========================================================================
   MODUL MY FARM ENGINE V2 — KANDANG TERBUKA BEBAS BERJALAN:
   - 2 Kandang Terpisah: Kandang Unggas (Ayam & Bebek) & Padang Rumput (Sapi & Kambing)
   - Hewan Bebas Berjalan Keliling + Berbalik Arah Otomatis (100% Lokal, 0 Beban Server)
   - Fase Pertumbuhan: Anakan -> Remaja -> Dewasa/Produktif (Baru Menghasilkan Telur/Susu)
   - Pakan (Dedak & Rumput), Sakit & Obat Ternak, Jual Hasil & Jual Daging (+Coin & +XP)
   - Sinergi Ekosistem: Bersihkan Kotoran Kandang -> +1 Pupuk NPK di My Garden
   ========================================================================= */

window.MY_FARM_CATALOG = {
    maxCapPerPen: 10,
    defaultPoultryCap: 4,
    defaultPastureCap: 3,
    animals: [
        {
            id: "ayam_petelur", nama: "Ayam Petelur", pen: "poultry", kategori: "Unggas",
            feedId: "pakan_dedak", feedLabel: "Dedak", harga: 120,
            prodNama: "Telur Ayam", prodIkon: "🥚", prodQty: 3, prodDetik: 1200, prodLabel: "20 mnt",
            prodCoin: 18, prodXp: 4, meatCoin: 85, meatXp: 15,
            dewasaDetik: 900, dewasaLabel: "15 mnt", feedBoostDetik: 180, penyakit: "Flu Unggas",
            deskripsi: "Penghasil telur produktif (3 butir/panen) saat dewasa, tetapi harga jual dagingnya murah."
        },
        {
            id: "ayam_pedaging", nama: "Ayam Pedaging", pen: "poultry", kategori: "Unggas",
            feedId: "pakan_dedak", feedLabel: "Dedak", harga: 150,
            prodNama: "Telur Ayam", prodIkon: "🥚", prodQty: 1, prodDetik: 2700, prodLabel: "45 mnt",
            prodCoin: 15, prodXp: 3, meatCoin: 340, meatXp: 45,
            dewasaDetik: 720, dewasaLabel: "12 mnt", feedBoostDetik: 180, penyakit: "Flu Unggas",
            deskripsi: "Ayam broiler cepat dewasa & berdaging tebal; telurnya sedikit, namun harga jual dagingnya tinggi."
        },
        {
            id: "bebek_petelur", nama: "Bebek Petelur", pen: "poultry", kategori: "Unggas",
            feedId: "pakan_dedak", feedLabel: "Dedak", harga: 260,
            prodNama: "Telur Bebek", prodIkon: "🥚", prodQty: 3, prodDetik: 1800, prodLabel: "30 mnt",
            prodCoin: 28, prodXp: 6, meatCoin: 180, meatXp: 25,
            dewasaDetik: 1500, dewasaLabel: "25 mnt", feedBoostDetik: 240, penyakit: "Flu Unggas",
            deskripsi: "Menghasilkan telur bebek biru bernilai tinggi secara rutin setelah memasuki fase produktif."
        },
        {
            id: "kambing_etawa", nama: "Kambing Etawa", pen: "pasture", kategori: "Ruminansia",
            feedId: "pakan_rumput", feedLabel: "Rumput", harga: 480,
            prodNama: "Susu Kambing", prodIkon: "🥛", prodQty: 2, prodDetik: 2400, prodLabel: "40 mnt",
            prodCoin: 55, prodXp: 10, meatCoin: 620, meatXp: 75,
            dewasaDetik: 2400, dewasaLabel: "40 mnt", feedBoostDetik: 300, penyakit: "Cacingan",
            deskripsi: "Ternak ruminansia penghasil susu bergizi tinggi dan daging berkualitas saat dewasa."
        },
        {
            id: "sapi_perah", nama: "Sapi Perah", pen: "pasture", kategori: "Ruminansia",
            feedId: "pakan_rumput", feedLabel: "Rumput", harga: 850,
            prodNama: "Susu Sapi", prodIkon: "🥛", prodQty: 3, prodDetik: 2700, prodLabel: "45 mnt",
            prodCoin: 85, prodXp: 14, meatCoin: 720, meatXp: 90,
            dewasaDetik: 3600, dewasaLabel: "60 mnt", feedBoostDetik: 360, penyakit: "Kembung Rumen",
            deskripsi: "Sapi Friesian Holstein penghasil susu melimpah (3 botol/panen), daging bernilai standar."
        },
        {
            id: "sapi_potong", nama: "Sapi Potong", pen: "pasture", kategori: "Ruminansia",
            feedId: "pakan_rumput", feedLabel: "Rumput", harga: 1100,
            prodNama: "Susu Sapi", prodIkon: "🥛", prodQty: 1, prodDetik: 4500, prodLabel: "75 mnt",
            prodCoin: 70, prodXp: 10, meatCoin: 2450, meatXp: 260,
            dewasaDetik: 3000, dewasaLabel: "50 mnt", feedBoostDetik: 360, penyakit: "Kembung Rumen",
            deskripsi: "Sapi pedaging super; susu sedikit, tetapi harga jual daging dewasanya sangat tinggi."
        }
    ],
    supplies: [
        { id: "pakan_dedak",  nama: "Dedak Unggas", tipe: "feed", harga: 15, kenyang: 45, ikon: "🌾", deskripsi: "Pakan bergizi untuk Ayam Petelur, Ayam Pedaging, & Bebek. Mempercepat tumbuh dewasa!" },
        { id: "pakan_rumput", nama: "Rumput Segar", tipe: "feed", harga: 25, kenyang: 45, ikon: "🌿", deskripsi: "Hijauan segar untuk Sapi Perah, Sapi Potong, & Kambing. Mempercepat tumbuh dewasa!" },
        { id: "obat_ternak",  nama: "Obat Ternak",  tipe: "med",  harga: 45, sembuh: true, ikon: "💊", deskripsi: "Obat & vitamin untuk menyembuhkan hewan ternak yang terserang penyakit." }
    ]
};

(function kunciKatalogFarmV2() {
    window.MY_FARM_CATALOG.animals.forEach(function(a) { Object.freeze(a); });
    window.MY_FARM_CATALOG.supplies.forEach(function(s) { Object.freeze(s); });
    Object.freeze(window.MY_FARM_CATALOG.animals);
    Object.freeze(window.MY_FARM_CATALOG.supplies);
    Object.freeze(window.MY_FARM_CATALOG);
})();

// =========================================================================
// 1. STATE, MIGRASI DATA, & KAPASITAS PER KANDANG
// =========================================================================
window.isMyFarmModalOpen = false;
window.activeFarmView = "kandang"; // 'kandang' | 'shop'
window.selectedFarmAnimalUid = "";
window._farmTickInterval = null;
window._farmRoamInterval = null;
window._farmRoamState = {};
window._farmLastAnimalStates = {};

window.apakahAdminSandboxFarm = function() {
    let rawU = String(sessionStorage.getItem("username") || "").trim().toLowerCase();
    return (typeof window.isAdminSession === "function" && window.isAdminSession()) ||
           sessionStorage.getItem("statusLogin") === "admin" ||
           rawU === "mahardika";
};

window.cariInfoTernak = function(animalId) {
    return window.MY_FARM_CATALOG.animals.find(function(a) { return a.id === animalId; }) || null;
};

window.pastikanStrukturMyFarm = function(uName) {
    let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(uName)
        : null;
    if (!lb) return null;

    if (!lb.myFarmData || typeof lb.myFarmData !== "object") {
        lb.myFarmData = {
            animals: {},
            poultryCap: window.MY_FARM_CATALOG.defaultPoultryCap,
            pastureCap: window.MY_FARM_CATALOG.defaultPastureCap,
            supplies: { pakan_dedak: 3, pakan_rumput: 2, obat_ternak: 1 },
            totalProductsSold: 0,
            totalMeatSold: 0
        };
    } else {
        let fd = lb.myFarmData;
        if (!fd.animals || typeof fd.animals !== "object") fd.animals = {};
        if (!fd.supplies || typeof fd.supplies !== "object") {
            fd.supplies = { pakan_dedak: 2, pakan_rumput: 2, obat_ternak: 1 };
        }
        if (typeof fd.poultryCap !== "number" || fd.poultryCap < 4) fd.poultryCap = window.MY_FARM_CATALOG.defaultPoultryCap;
        if (typeof fd.pastureCap !== "number" || fd.pastureCap < 3) fd.pastureCap = window.MY_FARM_CATALOG.defaultPastureCap;

        // Migrasi otomatis dari format slots lama jika ada
        if (fd.slots && typeof fd.slots === "object" && Object.keys(fd.slots).length > 0 && Object.keys(fd.animals).length === 0) {
            Object.keys(fd.slots).forEach(function(k) {
                let s = fd.slots[k];
                if (s && s.animalId) {
                    let uid = "an_" + (s.boughtAt || Date.now()) + "_" + k;
                    fd.animals[uid] = Object.assign({ uid: uid }, s);
                }
            });
            delete fd.slots;
        }
    }
    return lb;
};

window.simpanDataFarmKeServer = function(lb) {
    if (!lb || window.apakahAdminSandboxFarm()) return;
    let rawU = sessionStorage.getItem("username") || "";
    let cleanKey = (typeof window.normalisasiKeySiswaPet === "function")
        ? window.normalisasiKeySiswaPet(rawU)
        : rawU.trim().toLowerCase();
    if (cleanKey && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(cleanKey, lb);
    }
};

window.ambilDaftarHewanPerKandang = function(fData, penKey) {
    let list = [];
    let map = (fData && fData.animals) ? fData.animals : {};
    Object.keys(map).forEach(function(uid) {
        let obj = map[uid];
        if (!obj || !obj.animalId) return;
        let cfg = window.cariInfoTernak(obj.animalId);
        if (!cfg) return;
        if (!penKey || cfg.pen === penKey) {
            obj.uid = uid;
            list.push(obj);
        }
    });
    return list;
};

window.hitungHargaUpgradeKandang = function(fData, penKey) {
    let isPoultry = (penKey === "poultry");
    let defCap = isPoultry ? window.MY_FARM_CATALOG.defaultPoultryCap : window.MY_FARM_CATALOG.defaultPastureCap;
    let curCap = isPoultry ? (fData.poultryCap || defCap) : (fData.pastureCap || defCap);
    let extra = Math.max(0, curCap - defCap);
    let base = isPoultry ? 150 : 250;
    return Math.round(base * Math.pow(1.5, extra));
};

// =========================================================================
// 2. MESIN SIMULASI PERTUMBUHAN BERTAHAP, FASE PRODUKTIF, LAPAR, & SAKIT
// =========================================================================
window.sinkronkanKondisiSemuaTernak = function(lb) {
    if (!lb || !lb.myFarmData || !lb.myFarmData.animals) return false;
    let now = Date.now();
    let berubah = false;

    Object.keys(lb.myFarmData.animals).forEach(function(uid) {
        let obj = lb.myFarmData.animals[uid];
        if (!obj || !obj.animalId) return;
        let cfg = window.cariInfoTernak(obj.animalId);
        if (!cfg) return;

        let lastMs = Number(obj.lastUpdate) || now;
        let jamLewat = Math.max(0, (now - lastMs) / 3600000);

        if (jamLewat >= 0.08) {
            let turunLapar = Math.floor(jamLewat * 6);
            if (turunLapar > 0) {
                obj.hunger = Math.max(0, Math.min(100, (Number(obj.hunger) || 85) - turunLapar));
                obj.lastUpdate = lastMs + Math.floor((turunLapar / 6) * 3600000);
                berubah = true;
            }

            if (!obj.hasWaste && (now - (Number(obj.lastCleanAt) || Number(obj.boughtAt) || now)) >= 5400000) {
                obj.hasWaste = true;
                berubah = true;
            }

            if (!obj.isSick) {
                let kotorLama = obj.hasWaste && (now - (Number(obj.lastCleanAt) || Number(obj.boughtAt) || now) >= 21600000);
                if (obj.hunger <= 15 || kotorLama) {
                    obj.isSick = true;
                    obj.sickName = cfg.penyakit || "Sakit Ternak";
                    berubah = true;
                }
            }
        }
    });

    if (berubah) window.simpanDataFarmKeServer(lb);
    return berubah;
};

window.hitungStatusHewanFarm = function(obj) {
    if (!obj || !obj.animalId) return null;
    let cfg = window.cariInfoTernak(obj.animalId);
    if (!cfg) return null;

    let now = Date.now();
    let boughtAt = Number(obj.boughtAt) || now;
    let adultAt = Number(obj.adultAt) || (boughtAt + cfg.dewasaDetik * 1000);
    let growSpan = Math.max(1000, adultAt - boughtAt);
    let isAdult = now >= adultAt;
    let growPct = isAdult ? 100 : Math.max(2, Math.min(99, Math.round(((now - boughtAt) / growSpan) * 100)));
    let growRemMs = isAdult ? 0 : Math.max(0, adultAt - now);

    let stageKey = isAdult ? "adult" : (growPct < 45 ? "baby" : "teen");
    let stageLabel = isAdult ? "Dewasa (Produktif)" : (growPct < 45 ? "Anakan (" + growPct + "%)" : "Remaja (" + growPct + "%)");

    let hunger = Math.max(0, Math.min(100, Math.round(Number(obj.hunger) || 0)));
    let isSick = Boolean(obj.isSick);

    // Hewan HANYA mulai berproduksi setelah memasuki fase Dewasa/Produktif!
    let prodReady = false;
    let prodRemMs = 0;
    if (isAdult) {
        let nextProdAt = Number(obj.nextProduceAt) || (adultAt + cfg.prodDetik * 1000);
        if (nextProdAt < adultAt) nextProdAt = adultAt + cfg.prodDetik * 1000;
        prodRemMs = Math.max(0, nextProdAt - now);
        prodReady = !isSick && hunger > 10 && prodRemMs === 0;
    }

    let statusKey = stageKey + "_" + (isSick ? "sick" : (prodReady ? "ready" : (hunger < 30 ? "hungry" : "ok"))) + "_" + (obj.hasWaste ? "w" : "c");

    // Harga jual daging mengikuti fase pertumbuhan (Dewasa = 100%, Remaja = 55%, Anakan = 30%)
    let rasioDaging = isAdult ? 1 : (stageKey === "teen" ? 0.55 : 0.30);
    let hargaDagingAktif = Math.max(15, Math.round(cfg.meatCoin * rasioDaging));
    let xpDagingAktif = Math.max(4, Math.round(cfg.meatXp * rasioDaging));

    return {
        cfg: cfg,
        stageKey: stageKey,
        stageLabel: stageLabel,
        isAdult: isAdult,
        growPct: growPct,
        growRemMs: growRemMs,
        hunger: hunger,
        isSick: isSick,
        hasWaste: Boolean(obj.hasWaste),
        prodReady: prodReady,
        prodRemMs: prodRemMs,
        hargaDagingAktif: hargaDagingAktif,
        xpDagingAktif: xpDagingAktif,
        statusKey: statusKey
    };
};

window.formatDurasiFarm = function(ms) {
    let dtkTotal = Math.max(0, Math.ceil(ms / 1000));
    if (dtkTotal <= 0) return "Siap!";
    let j = Math.floor(dtkTotal / 3600);
    let m = Math.floor((dtkTotal % 3600) / 60);
    let d = dtkTotal % 60;
    let pad = function(n) { return String(n).padStart(2, "0"); };
    if (j > 0) return j + "j " + pad(m) + "m " + pad(d) + "d";
    if (m > 0) return m + "m " + pad(d) + "d";
    return d + "d";
};

// =========================================================================
// 3. MESIN JALAN BEBAS (FREE ROAMING) & LIVE COUNTDOWN 1 DETIK
// =========================================================================
window.ambilKoordinatRoamHewan = function(uid) {
    if (!window._farmRoamState[uid]) {
        let rx = 16 + Math.random() * 68;
        let ry = 24 + Math.random() * 52;
        window._farmRoamState[uid] = {
            x: rx,
            y: ry,
            facingRight: Math.random() > 0.5,
            isWalking: false,
            nextMoveAt: Date.now() + 800 + Math.random() * 2500
        };
    }
    return window._farmRoamState[uid];
};

window.gerakkanHewanKandangLangkah = function() {
    if (!window.isMyFarmModalOpen || document.hidden || window.activeFarmView !== "kandang") return;
    let ctx = window.ambilDataFarmAktif();
    if (!ctx || !ctx.fData || !ctx.fData.animals) return;

    let now = Date.now();
    Object.keys(ctx.fData.animals).forEach(function(uid) {
        let obj = ctx.fData.animals[uid];
        if (!obj) return;
        let el = document.getElementById("farm-actor-" + uid);
        if (!el) return;

        let st = window.ambilKoordinatRoamHewan(uid);
        if (obj.isSick) {
            if (st.isWalking) {
                st.isWalking = false;
                el.classList.remove("is-walking");
            }
            return;
        }

        if (now < st.nextMoveAt) return;

        // Pilih tujuan baru yang tidak terlalu jauh dan tidak keluar batas pagar kandang
        let dx = (Math.random() - 0.5) * 34;
        let dy = (Math.random() - 0.5) * 26;
        let nextX = Math.max(11, Math.min(89, st.x + dx));
        let nextY = Math.max(20, Math.min(80, st.y + dy));
        if (Math.abs(nextX - st.x) < 5) {
            nextX = st.x > 50 ? Math.max(14, st.x - 18) : Math.min(86, st.x + 18);
        }

        let dist = Math.hypot(nextX - st.x, nextY - st.y);
        let durSec = Math.max(1.4, Math.min(3.6, dist * 0.085));
        st.facingRight = nextX > st.x;
        st.x = nextX;
        st.y = nextY;
        st.isWalking = true;
        st.nextMoveAt = now + Math.round(durSec * 1000) + 1200 + Math.random() * 2600;

        el.style.transition = "left " + durSec.toFixed(2) + "s linear, top " + durSec.toFixed(2) + "s linear";
        el.style.left = nextX.toFixed(1) + "%";
        el.style.top = nextY.toFixed(1) + "%";
        el.style.zIndex = String(10 + Math.round(nextY));
        el.classList.add("is-walking");

        let flipWrap = el.querySelector(".farm-actor-flip");
        if (flipWrap) {
            flipWrap.classList.toggle("facing-right", st.facingRight);
        }

        clearTimeout(el._stopWalkTimer);
        el._stopWalkTimer = setTimeout(function() {
            if (el) el.classList.remove("is-walking");
            st.isWalking = false;
        }, Math.round(durSec * 1000));
    });
};

window.perbaruiCountdownLiveFarm = function() {
    if (!window.isMyFarmModalOpen || document.hidden || window.activeFarmView !== "kandang") return;
    let ctx = window.ambilDataFarmAktif();
    if (!ctx || !ctx.fData || !ctx.fData.animals) return;

    let adaFaseBerubah = false;
    let animals = ctx.fData.animals;

    Object.keys(animals).forEach(function(uid) {
        let info = window.hitungStatusHewanFarm(animals[uid]);
        if (!info) return;

        if (window._farmLastAnimalStates[uid] !== info.statusKey) {
            adaFaseBerubah = true;
            return;
        }

        // Update angka timer detail panel jika hewan ini sedang dipilih (tanpa re-render kandang!)
        if (uid === window.selectedFarmAnimalUid) {
            let elGrowPct = document.getElementById("farm-detail-grow-pct");
            let elGrowFill = document.getElementById("farm-detail-grow-fill");
            let elGrowRem = document.getElementById("farm-detail-grow-rem");
            let elProdRem = document.getElementById("farm-detail-prod-timer");

            if (elGrowPct) elGrowPct.textContent = info.isAdult ? "100% (Produktif)" : (info.growPct + "%");
            if (elGrowFill) elGrowFill.style.width = info.growPct + "%";
            if (elGrowRem && !info.isAdult) elGrowRem.textContent = window.formatDurasiFarm(info.growRemMs);
            if (elProdRem && info.isAdult && !info.prodReady && !info.isSick) {
                elProdRem.textContent = window.formatDurasiFarm(info.prodRemMs);
            }
        }
    });

    if (adaFaseBerubah) {
        window.renderMyFarmUI();
    }
};

// =========================================================================
// 4. GENERATOR SVG 2.5D TERNAK (UKURAN BERUBAH ANAKAN -> REMAJA -> DEWASA)
// =========================================================================
window.bangunSVGTernakFarm = function(animalId, isSick, stageKey, sizePx) {
    let sz = sizePx || 78;
    let sc = stageKey === "adult" ? 1.0 : (stageKey === "teen" ? 0.80 : 0.62);
    let ty = stageKey === "adult" ? 0 : (stageKey === "teen" ? 16 : 30);
    let sickOverlay = isSick
        ? '<g><circle cx="94" cy="24" r="14" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/><text x="94" y="29" font-size="16" text-anchor="middle">🤒</text></g>'
        : '';

    let mapSvg = {
        ayam_petelur:
            '<ellipse cx="60" cy="102" rx="28" ry="7.5" fill="rgba(0,0,0,0.2)"/>' +
            '<path d="M52,92 L50,104 M68,92 L70,104" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round"/>' +
            '<path d="M26,70 C24,44 46,38 66,46 C84,48 94,64 88,82 C82,94 42,96 30,84 Z" fill="#fef3c7" stroke="#b45309" stroke-width="3.5"/>' +
            '<path d="M74,56 Q96,42 94,64 Q88,72 78,68 Z" fill="#fde68a" stroke="#b45309" stroke-width="3"/>' +
            '<circle cx="42" cy="48" r="18" fill="#fffbeb" stroke="#b45309" stroke-width="3.5"/>' +
            '<path d="M34,30 Q40,18 46,28 Q52,20 54,32 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>' +
            '<polygon points="24,48 14,52 24,56" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>' +
            '<circle cx="36" cy="45" r="3.5" fill="#0f172a"/><circle cx="35" cy="44" r="1.2" fill="#fff"/>' +
            '<path d="M44,64 Q62,56 72,72 Q58,82 44,72 Z" fill="#fde68a" stroke="#b45309" stroke-width="2.5"/>',

        ayam_pedaging:
            '<ellipse cx="60" cy="104" rx="34" ry="8.5" fill="rgba(0,0,0,0.22)"/>' +
            '<path d="M48,94 L46,105 M72,94 L74,105" stroke="#ea580c" stroke-width="5.5" stroke-linecap="round"/>' +
            '<ellipse cx="62" cy="70" rx="34" ry="28" fill="#ffffff" stroke="#64748b" stroke-width="3.5"/>' +
            '<circle cx="40" cy="48" r="19" fill="#ffffff" stroke="#64748b" stroke-width="3.5"/>' +
            '<path d="M32,29 Q39,16 46,27 Q52,19 55,31 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2.5"/>' +
            '<ellipse cx="32" cy="58" rx="5" ry="7" fill="#ef4444"/>' +
            '<polygon points="22,47 12,51 22,55" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>' +
            '<circle cx="35" cy="45" r="3.5" fill="#0f172a"/>' +
            '<path d="M48,62 Q68,54 80,72 Q66,86 48,74 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2.5"/>',

        bebek_petelur:
            '<ellipse cx="60" cy="102" rx="30" ry="7.5" fill="rgba(0,0,0,0.2)"/>' +
            '<path d="M52,92 L50,104 M68,92 L70,104" stroke="#f97316" stroke-width="4.5" stroke-linecap="round"/>' +
            '<ellipse cx="64" cy="74" rx="30" ry="21" fill="#d97706" stroke="#78350f" stroke-width="3.5"/>' +
            '<path d="M42,66 Q38,44 44,34" stroke="#92400e" stroke-width="14" stroke-linecap="round"/>' +
            '<circle cx="42" cy="36" r="15" fill="#15803d" stroke="#052e16" stroke-width="3"/>' +
            '<ellipse cx="22" cy="40" rx="11" ry="5" fill="#facc15" stroke="#b45309" stroke-width="2.5"/>' +
            '<circle cx="38" cy="33" r="3" fill="#0f172a"/><circle cx="37" cy="32" r="1" fill="#fff"/>' +
            '<path d="M48,68 Q68,62 82,74 Q68,84 50,78 Z" fill="#b45309" stroke="#78350f" stroke-width="2.5"/>',

        kambing_etawa:
            '<ellipse cx="60" cy="104" rx="34" ry="8" fill="rgba(0,0,0,0.2)"/>' +
            '<rect x="38" y="82" width="8" height="22" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="2.5"/>' +
            '<rect x="74" y="82" width="8" height="22" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="2.5"/>' +
            '<ellipse cx="62" cy="68" rx="32" ry="22" fill="#f8fafc" stroke="#475569" stroke-width="3.5"/>' +
            '<path d="M30,36 Q24,18 36,24" fill="none" stroke="#92400e" stroke-width="5" stroke-linecap="round"/>' +
            '<path d="M44,34 Q50,18 42,24" fill="none" stroke="#92400e" stroke-width="5" stroke-linecap="round"/>' +
            '<ellipse cx="36" cy="48" rx="18" ry="16" fill="#ffffff" stroke="#475569" stroke-width="3.5"/>' +
            '<ellipse cx="50" cy="54" rx="6" ry="14" transform="rotate(-15 50 54)" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>' +
            '<path d="M28,62 L32,72 L38,63 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>' +
            '<circle cx="31" cy="45" r="3.2" fill="#0f172a"/>',

        sapi_perah:
            '<ellipse cx="60" cy="105" rx="38" ry="9" fill="rgba(0,0,0,0.22)"/>' +
            '<rect x="34" y="80" width="10" height="24" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>' +
            '<rect x="76" y="80" width="10" height="24" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>' +
            '<ellipse cx="64" cy="66" rx="36" ry="24" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>' +
            '<ellipse cx="64" cy="58" rx="12" ry="9" fill="#1e293b"/><ellipse cx="82" cy="72" rx="9" ry="7" fill="#1e293b"/>' +
            '<ellipse cx="62" cy="88" rx="11" ry="7" fill="#fbcfe8" stroke="#be185d" stroke-width="2"/>' +
            '<path d="M24,36 Q18,22 30,28 M46,36 Q52,22 40,28" fill="none" stroke="#fde68a" stroke-width="5" stroke-linecap="round"/>' +
            '<rect x="18" y="34" width="36" height="32" rx="14" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>' +
            '<ellipse cx="36" cy="58" rx="15" ry="9" fill="#fbcfe8" stroke="#be185d" stroke-width="2.5"/>' +
            '<circle cx="29" cy="45" r="3.2" fill="#0f172a"/><circle cx="43" cy="45" r="3.2" fill="#0f172a"/>' +
            '<circle cx="31" cy="58" r="2" fill="#9d174d"/><circle cx="41" cy="58" r="2" fill="#9d174d"/>',

        sapi_potong:
            '<ellipse cx="60" cy="105" rx="40" ry="9" fill="rgba(0,0,0,0.24)"/>' +
            '<rect x="32" y="80" width="12" height="24" rx="4" fill="#7c2d12" stroke="#431407" stroke-width="3"/>' +
            '<rect x="76" y="80" width="12" height="24" rx="4" fill="#7c2d12" stroke="#431407" stroke-width="3"/>' +
            '<ellipse cx="64" cy="65" rx="38" ry="26" fill="#c2410c" stroke="#431407" stroke-width="3.5"/>' +
            '<ellipse cx="76" cy="58" rx="14" ry="10" fill="#fed7aa" opacity="0.85"/>' +
            '<ellipse cx="52" cy="70" rx="12" ry="9" fill="#fed7aa" opacity="0.8"/>' +
            '<path d="M22,35 Q16,20 29,27 M48,35 Q54,20 41,27" fill="none" stroke="#fef3c7" stroke-width="5.5" stroke-linecap="round"/>' +
            '<rect x="17" y="33" width="38" height="33" rx="14" fill="#c2410c" stroke="#431407" stroke-width="3.5"/>' +
            '<ellipse cx="36" cy="58" rx="16" ry="9.5" fill="#fed7aa" stroke="#7c2d12" stroke-width="2.5"/>' +
            '<circle cx="29" cy="45" r="3.2" fill="#0f172a"/><circle cx="43" cy="45" r="3.2" fill="#0f172a"/>' +
            '<circle cx="31" cy="58" r="2" fill="#7c2d12"/><circle cx="41" cy="58" r="2" fill="#7c2d12"/>'
    };

    return '<svg viewBox="0 0 120 120" width="' + sz + '" height="' + sz + '">' +
        '<g transform="translate(0,' + ty + ') scale(' + sc + ')" style="transform-origin:60px 100px;">' +
            (mapSvg[animalId] || mapSvg.ayam_petelur) +
        '</g>' +
        sickOverlay +
    '</svg>';
};

// =========================================================================
// 5. INJEKSI TOMBOL MELAYANG & MODAL UTAMA
// =========================================================================
window.pastikanUIMyFarmAda = function() {
    if (!document.getElementById("btn-floating-myfarm")) {
        let btn = document.createElement("button");
        btn.id = "btn-floating-myfarm";
        btn.className = "myfarm-floating-btn";
        btn.onclick = function() { window.bukaModalMyFarm(); };
        btn.title = "Buka My Farm (Peternakan Sains)";
        btn.innerHTML =
            '<span class="myfarm-float-icon">🐄</span>' +
            '<span class="myfarm-float-text">My Farm</span>' +
            '<span id="myfarm-alert-dot" class="myfarm-alert-badge" style="display:none;">!</span>';
        document.body.appendChild(btn);
    }

    if (!document.getElementById("modal-my-farm")) {
        let modal = document.createElement("div");
        modal.id = "modal-my-farm";
        modal.className = "modal-overlay";
        modal.onclick = function(e) {
            if (e.target === modal) window.tutupModalMyFarm();
        };

        modal.innerHTML =
            '<div class="modal-box myfarm-modal-box">' +
                '<div class="myfarm-hud">' +
                    '<div class="myfarm-hud-left">' +
                        '<div class="myfarm-wood-sign" onclick="window.gantiViewMyFarm(\'kandang\')" title="Kembali ke Kandang">' +
                            '<span style="font-size:20px;">🐄</span>' +
                            '<div>' +
                                '<div class="farm-sign-top">My</div>' +
                                '<div class="farm-sign-main">Farm</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="mypet-hud-currencies">' +
                            '<div class="mypet-hud-pill coin-pill" title="Saldo Coin Belanja">' +
                                '<span class="hud-orb coin-orb">🪙</span>' +
                                '<strong id="myfarm-hud-coin">0</strong>' +
                            '</div>' +
                            '<div class="mypet-hud-pill xp-pill" title="Total XP Leaderboard">' +
                                '<span class="hud-orb xp-orb">⭐</span>' +
                                '<strong id="myfarm-hud-xp">0</strong>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    '<div class="myfarm-hud-right">' +
                        '<button type="button" id="btn-farm-kandang" class="myfarm-hud-btn active" onclick="window.gantiViewMyFarm(\'kandang\')">' +
                            '<span class="hud-ico">🏡</span><span class="hud-lbl">Kandang</span>' +
                        '</button>' +
                        '<button type="button" id="btn-farm-shop" class="myfarm-hud-btn" onclick="window.gantiViewMyFarm(\'shop\')">' +
                            '<span class="hud-ico">🏪</span><span class="hud-lbl">Toko Ternak</span>' +
                        '</button>' +
                        '<button type="button" class="myfarm-hud-btn garden-btn" onclick="window.bukaMyGardenDariFarm()" title="Pindah ke My Garden">' +
                            '<span class="hud-ico">🌱</span><span class="hud-lbl">Garden</span>' +
                        '</button>' +
                        '<button type="button" class="myfarm-hud-btn pet-btn" onclick="window.bukaMyPetDariFarm()" title="Pindah ke My Pet">' +
                            '<span class="hud-ico">🐾</span><span class="hud-lbl">My Pet</span>' +
                        '</button>' +
                        '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupModalMyFarm()" title="Tutup">✕</button>' +
                    '</div>' +
                '</div>' +

                '<div class="modal-body myfarm-body" id="myfarm-main-body"></div>' +
                '<div id="myfarm-quiz-overlay" class="garden-quiz-overlay" style="display:none;"></div>' +
            '</div>';

        document.body.appendChild(modal);
    }
};

window.bukaMyPetDariFarm = function() {
    window.tutupModalMyFarm();
    if (typeof window.bukaModalMyPet === "function") window.bukaModalMyPet();
};

window.bukaMyGardenDariFarm = function() {
    window.tutupModalMyFarm();
    if (typeof window.bukaModalMyGarden === "function") window.bukaModalMyGarden();
};

window.perbaruiSaldoHUDFarm = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    let elCoin = document.getElementById("myfarm-hud-coin");
    let elXp = document.getElementById("myfarm-hud-xp");
    let dotAlert = document.getElementById("myfarm-alert-dot");

    let coinVal = lb ? Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia || 0) : 0;
    let xpVal = lb ? Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp || 0) : 0;

    if (elCoin) elCoin.innerText = coinVal.toLocaleString("id-ID");
    if (elXp) elXp.innerText = xpVal.toLocaleString("id-ID");

    if (dotAlert && lb && lb.myFarmData && lb.myFarmData.animals) {
        let adaAksi = Object.values(lb.myFarmData.animals).some(function(obj) {
            let info = window.hitungStatusHewanFarm(obj);
            return info && (info.prodReady || info.isSick || info.hasWaste);
        });
        dotAlert.style.display = adaAksi ? "flex" : "none";
    }
};

window.modeKunjunganFarm = null;

window.ambilDataFarmAktif = function() {
    if (window.modeKunjunganFarm && window.leaderboardSiswaData && window.leaderboardSiswaData[window.modeKunjunganFarm]) {
        let hostLb = window.leaderboardSiswaData[window.modeKunjunganFarm];
        let fd = (hostLb && hostLb.myFarmData) ? hostLb.myFarmData : { animals: {}, poultryCap: 4, pastureCap: 3, supplies: {} };
        if (!fd.animals) fd.animals = {};
        return { isVisit: true, hostUser: window.modeKunjunganFarm, hostNama: hostLb.namaPanggilan || hostLb.namaLengkap || window.modeKunjunganFarm, fData: fd };
    }
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    return { isVisit: false, hostUser: uName, hostNama: uName, fData: lb ? lb.myFarmData : null };
};

window.bukaModalMyFarmKunjungan = function(targetUsername) {
    if (!targetUsername || !window.leaderboardSiswaData || !window.leaderboardSiswaData[targetUsername]) return;
    window.modeKunjunganFarm = targetUsername;
    window.pastikanUIMyFarmAda();
    window.activeFarmView = "kandang";
    window.isMyFarmModalOpen = true;
    window.perbaruiSaldoHUDFarm();
    window.renderMyFarmUI();

    if (typeof window.bukaModal === "function") window.bukaModal("modal-my-farm");
    else {
        let m = document.getElementById("modal-my-farm");
        if (m) m.style.display = "flex";
    }

    clearInterval(window._farmTickInterval);
    clearInterval(window._farmRoamInterval);
    window._farmTickInterval = setInterval(window.perbaruiCountdownLiveFarm, 1000);
    window._farmRoamInterval = setInterval(window.gerakkanHewanKandangLangkah, 750);
    setTimeout(window.gerakkanHewanKandangLangkah, 350);
};

window.bukaModalMyFarm = function() {
    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        alert("🔒 Silakan login menggunakan akun Siswa terlebih dahulu untuk membuka My Farm!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    window.modeKunjunganFarm = null;
    window.pastikanUIMyFarmAda();
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    window.sinkronkanKondisiSemuaTernak(lb);

    window.activeFarmView = "kandang";
    window.isMyFarmModalOpen = true;
    window.perbaruiSaldoHUDFarm();
    window.renderMyFarmUI();

    if (typeof window.bukaModal === "function") window.bukaModal("modal-my-farm");
    else {
        let m = document.getElementById("modal-my-farm");
        if (m) m.style.display = "flex";
    }

    clearInterval(window._farmTickInterval);
    clearInterval(window._farmRoamInterval);
    window._farmTickInterval = setInterval(window.perbaruiCountdownLiveFarm, 1000);
    window._farmRoamInterval = setInterval(window.gerakkanHewanKandangLangkah, 750);
    setTimeout(window.gerakkanHewanKandangLangkah, 350);
};

window.tutupModalMyFarm = function() {
    window.isMyFarmModalOpen = false;
    clearInterval(window._farmTickInterval);
    clearInterval(window._farmRoamInterval);
    window._farmTickInterval = null;
    window._farmRoamInterval = null;
    if (typeof window.tutupModal === "function") window.tutupModal("modal-my-farm");
    else {
        let m = document.getElementById("modal-my-farm");
        if (m) m.style.display = "none";
    }
};

window.gantiViewMyFarm = function(v) {
    window.activeFarmView = v || "kandang";
    window.renderMyFarmUI();
    if (window.activeFarmView === "kandang") {
        setTimeout(window.gerakkanHewanKandangLangkah, 300);
    }
};

window.tampilkanToastFarm = function(pesan) {
    let t = document.getElementById("myfarm-toast-box");
    if (!t) return;
    t.innerHTML = pesan;
    t.style.display = "block";
    clearTimeout(window._farmToastTimer);
    window._farmToastTimer = setTimeout(function() {
        if (t) t.style.display = "none";
    }, 2800);
};

// =========================================================================
// 6. RENDER 2 KANDANG BERPAGAR TERBUKA (UNGGAS & PADANG RUMPUT)
// =========================================================================
window.bangunHTMLSatuKandangTerbuka = function(penKey, judul, subJudul, daftarHewan, capMax, upgradeCost, canUpgrade, ctx) {
    let isVisit = Boolean(ctx && ctx.isVisit);
    let actorsHtml = '';
    if (daftarHewan.length === 0) {
        actorsHtml =
            '<div class="paddock-empty-hint">' +
                '<div>' + (penKey === "poultry" ? "🐔🦆" : "🐄🐐") + '</div>' +
                '<span>' + (isVisit ? 'Kandang ini belum diisi oleh ' + ctx.hostNama + '.' : 'Kandang ini masih kosong. Beli ternak di <b>Toko Ternak</b>!') + '</span>' +
            '</div>';
    } else {
        daftarHewan.forEach(function(obj) {
            let info = window.hitungStatusHewanFarm(obj);
            if (!info) return;
            window._farmLastAnimalStates[obj.uid] = info.statusKey;

            let roam = window.ambilKoordinatRoamHewan(obj.uid);
            let isSelected = (window.selectedFarmAnimalUid === obj.uid);
            let svgAnimal = window.bangunSVGTernakFarm(obj.animalId, info.isSick, info.stageKey, penKey === "poultry" ? 68 : 84);
            let safeUid = String(obj.uid).replace(/'/g, "\\'");

            let prodBubble = '';
            if (info.prodReady) {
                if (isVisit) {
                    let ck = ctx.hostUser + "__farm__" + obj.uid;
                    let sdh = typeof window.apakahItemSudahDiminta === "function" && window.apakahItemSudahDiminta(ck);
                    prodBubble = sdh
                        ? '<span class="paddock-stage-pill growing">✓</span>'
                        : '<button type="button" class="paddock-prod-bubble" onclick="event.stopPropagation(); window.mintaHasilTernakTeman(\'' + safeUid + '\')" title="Minta ' + info.cfg.prodQty + ' ' + info.cfg.prodNama + '">🎁' + info.cfg.prodIkon + '</button>';
                } else {
                    prodBubble = '<button type="button" class="paddock-prod-bubble" onclick="event.stopPropagation(); window.jualHasilTernak(\'' + safeUid + '\')" title="Jual ' + info.cfg.prodQty + ' ' + info.cfg.prodNama + '">' + info.cfg.prodIkon + '×' + info.cfg.prodQty + '</button>';
                }
            }

            let wasteBubble = (!isVisit && info.hasWaste)
                ? '<button type="button" class="paddock-waste-bubble" onclick="event.stopPropagation(); window.bersihkanSatuKandangFarm(\'' + safeUid + '\')" title="Bersihkan kotoran (+1 Pupuk NPK)">💩</button>'
                : '';

            let stageMiniTag = !info.isAdult
                ? '<span class="paddock-stage-pill growing">' + (info.stageKey === "baby" ? "🐣" : "🌱") + ' ' + info.growPct + '%</span>'
                : (info.isSick ? '<span class="paddock-stage-pill sick">🤒</span>' : '');

            actorsHtml +=
                '<div id="farm-actor-' + obj.uid + '" class="paddock-animal-actor' + (isSelected ? ' is-selected' : '') + (roam.isWalking ? ' is-walking' : '') + '" ' +
                     'style="left:' + roam.x.toFixed(1) + '%; top:' + roam.y.toFixed(1) + '%; z-index:' + (10 + Math.round(roam.y)) + ';" ' +
                     'onclick="event.stopPropagation(); window.pilihHewanDiKandang(\'' + safeUid + '\')">' +
                    '<div class="paddock-select-ring"></div>' +
                    prodBubble + wasteBubble + stageMiniTag +
                    '<div class="farm-actor-flip' + (roam.facingRight ? ' facing-right' : '') + '">' + svgAnimal + '</div>' +
                '</div>';
        });
    }

    let upgradeBtn = isVisit
        ? ''
        : (canUpgrade
            ? '<button type="button" class="paddock-upgrade-btn" onclick="window.upgradeKapasitasKandang(\'' + penKey + '\')" title="Tambah +1 kapasitas kandang">+1 Kap (🪙' + upgradeCost.toLocaleString("id-ID") + ')</button>'
            : '<span class="paddock-max-pill">MAX</span>');

    let decorScene = penKey === "poultry"
        ? '<div class="paddock-prop prop-coop" title="Rumah Ayam">🛖</div><div class="paddock-prop prop-pond" title="Kolam Bebek">💧</div><div class="paddock-prop prop-hay" title="Pakan Dedak">🌾</div>'
        : '<div class="paddock-prop prop-barn" title="Lumbung Ternak">🏚️</div><div class="paddock-prop prop-grass" title="Tumpukan Jerami">🌿</div><div class="paddock-prop prop-trough" title="Bak Minum">🪣</div>';

    return (
        '<div class="farm-paddock-card pen-' + penKey + '">' +
            '<div class="farm-paddock-header">' +
                '<div><strong>' + judul + '</strong><small>' + subJudul + '</small></div>' +
                '<div style="display:flex; align-items:center; gap:6px;">' +
                    '<span class="paddock-cap-pill">' + daftarHewan.length + ' / ' + capMax + ' Ekor</span>' +
                    upgradeBtn +
                '</div>' +
            '</div>' +
            '<div class="farm-paddock-yard yard-' + penKey + '">' +
                '<div class="paddock-fence-frame">' + decorScene + actorsHtml + '</div>' +
            '</div>' +
        '</div>'
    );
};

window.renderMyFarmUI = function() {
    let body = document.getElementById("myfarm-main-body");
    if (!body) return;

    let ctx = window.ambilDataFarmAktif();
    if (!ctx || !ctx.fData) return;
    let isVisit = ctx.isVisit;
    let fData = ctx.fData;

    window.perbaruiSaldoHUDFarm();

    let btnK = document.getElementById("btn-farm-kandang");
    let btnS = document.getElementById("btn-farm-shop");
    if (btnK) btnK.classList.toggle("active", isVisit || window.activeFarmView === "kandang");
    if (btnS) {
        btnS.style.display = isVisit ? "none" : "inline-flex";
        btnS.classList.toggle("active", !isVisit && window.activeFarmView === "shop");
    }

    if (!isVisit && window.activeFarmView === "shop") {
        let uName = sessionStorage.getItem("username");
        let lb = window.pastikanStrukturMyFarm(uName);
        if (lb) window.renderShopMyFarm(body, lb);
        return;
    }

    let sup = fData.supplies || {};
    let poultryList = window.ambilDaftarHewanPerKandang(fData, "poultry");
    let pastureList = window.ambilDaftarHewanPerKandang(fData, "pasture");
    let allList = poultryList.concat(pastureList);

    if (allList.length > 0 && (!window.selectedFarmAnimalUid || !fData.animals[window.selectedFarmAnimalUid])) {
        window.selectedFarmAnimalUid = allList[0].uid;
    } else if (allList.length === 0) {
        window.selectedFarmAnimalUid = "";
    }

    let siapPanen = 0, sakitCount = 0, kotorCount = 0;
    window._farmLastAnimalStates = {};
    allList.forEach(function(obj) {
        let info = window.hitungStatusHewanFarm(obj);
        if (!info) return;
        if (info.prodReady) siapPanen++;
        if (info.isSick) sakitCount++;
        if (info.hasWaste) kotorCount++;
    });

    let poultryCap = fData.poultryCap || window.MY_FARM_CATALOG.defaultPoultryCap;
    let pastureCap = fData.pastureCap || window.MY_FARM_CATALOG.defaultPastureCap;

    let kandangUnggasHtml = window.bangunHTMLSatuKandangTerbuka(
        "poultry",
        "🐔 Kandang Unggas (Ayam & Bebek)",
        isVisit ? ("Milik " + ctx.hostNama + " • Ketuk 🎁 untuk meminta hasil") : "Pakan: 🌾 Dedak • Bebas berjalan keliling",
        poultryList, poultryCap, window.hitungHargaUpgradeKandang(fData, "poultry"),
        poultryCap < window.MY_FARM_CATALOG.maxCapPerPen, ctx
    );

    let padangRumputHtml = window.bangunHTMLSatuKandangTerbuka(
        "pasture",
        "🐄 Padang Rumput (Sapi & Kambing)",
        isVisit ? ("Milik " + ctx.hostNama + " • Ketuk 🎁 untuk meminta susu") : "Pakan: 🌿 Rumput • Bebas merumput",
        pastureList, pastureCap, window.hitungHargaUpgradeKandang(fData, "pasture"),
        pastureCap < window.MY_FARM_CATALOG.maxCapPerPen, ctx
    );

    let topSupplyStrip = '';
    if (isVisit) {
        let q = (typeof window.ambilStatusKuotaVisitSaya === "function") ? window.ambilStatusKuotaVisitSaya() : { usedCount: 0, quizPassed: false };
        let maxR = (window.MY_WORLD_VISIT_CONFIG && window.MY_WORLD_VISIT_CONFIG.maxProdukPer8Jam) || 3;
        topSupplyStrip =
            '<div class="garden-tool-notice" style="background:#9a3412; border:2px solid #431407;">' +
                '<span>🎁 <b>Peternakan ' + ctx.hostNama + ':</b> Pilih ternak bertanda 🎁 untuk meminta telur/susunya! Kuota 8 jam: <b>' + q.usedCount + '/' + maxR + '</b> • ' + (q.quizPassed ? '🔓 Kuis 20 Soal Lulus' : '🔒 Wajib Lulus 10/20 Soal') + '</span>' +
                '<button type="button" onclick="window.tutupModalMyFarm()">🚪 Kembali ke World</button>' +
            '</div>';
    } else {
        topSupplyStrip =
            '<div class="farm-supply-strip">' +
                '<div class="farm-supply-chips">' +
                    '<span class="farm-sup-pill">🌾 Dedak: <b>x' + (Number(sup.pakan_dedak) || 0) + '</b></span>' +
                    '<span class="farm-sup-pill">🌿 Rumput: <b>x' + (Number(sup.pakan_rumput) || 0) + '</b></span>' +
                    '<span class="farm-sup-pill">💊 Obat: <b>x' + (Number(sup.obat_ternak) || 0) + '</b></span>' +
                    '<span class="farm-sup-pill" style="background:#e0f2fe; border-color:#0284c7; color:#0c4a6e;">💧 Air: <b>' + ((typeof window.ambilStokAirFarmWorld === "function") ? window.ambilStokAirFarmWorld() : 5) + ' L</b></span>' +
                '</div>' +
                '<div class="farm-quick-btns">' +
                    (siapPanen > 0 ? '<button type="button" class="farm-mini-cta green" onclick="window.jualSemuaHasilTernak()">🥚🥛 Panen Semua (' + siapPanen + ')</button>' : '') +
                    (kotorCount > 0 ? '<button type="button" class="farm-mini-cta amber" onclick="window.bersihkanSemuaKandangFarm()">🧹 Bersihkan (' + kotorCount + ' ➔ +' + kotorCount + ' NPK)</button>' : '') +
                    (sakitCount > 0 ? '<span class="farm-sick-alert">🤒 ' + sakitCount + ' Sakit!</span>' : '') +
                '</div>' +
            '</div>';
    }

    body.innerHTML =
        '<div class="farm-openworld-wrap">' +
            '<div id="myfarm-toast-box" class="mygarden-toast-box" style="display:none;"></div>' +
            topSupplyStrip +
            '<div class="farm-main-split">' +
                '<div class="farm-paddocks-stack">' + kandangUnggasHtml + padangRumputHtml + '</div>' +
                '<div id="farm-detail-panel-host">' + window.bangunKartuDetailHewanFarm(fData, ctx) + '</div>' +
            '</div>' +
        '</div>';
};

window.bangunKartuDetailHewanFarm = function(fData, ctx) {
    let isVisit = Boolean(ctx && ctx.isVisit);
    let uid = window.selectedFarmAnimalUid;
    let obj = (uid && fData && fData.animals) ? fData.animals[uid] : null;
    if (!obj) {
        return (
            '<div class="garden-right-card">' +
                '<div class="garden-detail-ribbon">🏡 ' + (isVisit ? 'Peternakan ' + ctx.hostNama : 'Peternakan Sains') + '</div>' +
                '<div class="garden-detail-preview" style="font-size:44px;">🐄🐔</div>' +
                '<p class="garden-detail-desc">' + (isVisit ? 'Temanmu belum memelihara ternak di kandangnya.' : 'Beli ternak di <b>Toko Ternak</b>, besarkan hingga fase <b>Produktif</b> agar mulai menghasilkan telur/susu!') + '</p>' +
                (!isVisit ? '<button type="button" class="mypet-green-cta" onclick="window.gantiViewMyFarm(\'shop\')">🏪 Buka Toko Ternak</button>' : '') +
            '</div>'
        );
    }

    let info = window.hitungStatusHewanFarm(obj);
    if (!info) return "";
    let c = info.cfg;
    let safeUid = String(uid).replace(/'/g, "\\'");
    let totalProdCoin = c.prodQty * c.prodCoin;
    let totalProdXp = c.prodQty * c.prodXp;
    let feedIkon = c.feedId === "pakan_dedak" ? "🌾" : "🌿";
    let stokFeed = Number((fData.supplies || {})[c.feedId]) || 0;
    let stokObat = Number((fData.supplies || {}).obat_ternak) || 0;

    if (isVisit) {
        let ck = ctx.hostUser + "__farm__" + uid;
        let sudahDiminta = typeof window.apakahItemSudahDiminta === "function" && window.apakahItemSudahDiminta(ck);
        let aksiVisitHtml = '';
        if (info.prodReady) {
            aksiVisitHtml = sudahDiminta
                ? '<button type="button" class="mypet-gray-cta sm" disabled>✓ Sudah Diminta (8 Jam Ini)</button>'
                : '<button type="button" class="mypet-green-cta" onclick="window.mintaHasilTernakTeman(\'' + safeUid + '\')">🎁 Minta ' + c.prodQty + ' ' + c.prodNama + ' (+🪙' + totalProdCoin + ')</button>';
        } else if (!info.isAdult) {
            aksiVisitHtml = '<div class="farm-phase-box growing">🌱 Masih ' + info.stageLabel + ' (belum menghasilkan produk).</div>';
        } else if (info.isSick) {
            aksiVisitHtml = '<div class="farm-phase-box sick">🤒 Hewan sedang sakit sehingga belum menghasilkan produk.</div>';
        } else {
            aksiVisitHtml = '<div class="farm-phase-box ready-wait">' + c.prodIkon + ' Siap dalam: <b id="farm-detail-prod-timer">' + window.formatDurasiFarm(info.prodRemMs) + '</b></div>';
        }

        return (
            '<div class="garden-right-card">' +
                '<div class="garden-detail-ribbon' + (info.isSick ? ' wilted' : '') + '">' + c.nama + '</div>' +
                '<div class="garden-detail-preview">' + window.bangunSVGTernakFarm(c.id, info.isSick, info.stageKey, 96) + '</div>' +
                '<div class="garden-reward-row"><span>' + c.prodIkon + ' <b>+' + totalProdCoin + ' Coin</b></span><span>⭐ <b>+' + totalProdXp + ' XP</b></span></div>' +
                aksiVisitHtml +
                '<p class="garden-detail-desc">Ternak milik ' + ctx.hostNama + '. Meminta hasil tidak mengurangi produk milik teman.</p>' +
            '</div>'
        );
    }

    let statusProduksiHtml = '';
    if (!info.isAdult) {
        statusProduksiHtml =
            '<div class="farm-phase-box growing">' +
                '<div>🌱 <b>Belum Produktif (' + info.stageLabel + ')</b></div>' +
                '<div>Dewasa dalam: <b id="farm-detail-grow-rem">' + window.formatDurasiFarm(info.growRemMs) + '</b></div>' +
                '<small>Beri pakan ' + c.feedLabel + ' agar lebih cepat dewasa!</small>' +
            '</div>';
    } else if (info.isSick) {
        statusProduksiHtml =
            '<div class="farm-phase-box sick">' +
                '<div>🤒 <b>Sakit: ' + (obj.sickName || c.penyakit) + '</b></div>' +
                '<small>Produksi terhenti sampai diberi Obat Ternak.</small>' +
            '</div>' +
            '<button type="button" class="mypet-amber-cta sm" style="background:linear-gradient(180deg,#fb7185,#dc2626); border-color:#7f1d1d;" onclick="window.obatiTernakFarm(\'' + safeUid + '\')">💊 Beri Obat (Stok: x' + stokObat + ')</button>';
    } else if (info.prodReady) {
        statusProduksiHtml =
            '<button type="button" class="mypet-green-cta sm" onclick="window.jualHasilTernak(\'' + safeUid + '\')">' + c.prodIkon + ' Jual ' + c.prodQty + ' ' + c.prodNama + ' (+🪙' + totalProdCoin + ', +' + totalProdXp + 'XP)</button>';
    } else {
        statusProduksiHtml =
            '<div class="farm-phase-box ready-wait">' +
                '<div>' + c.prodIkon + ' <b>Fase Produktif (' + c.prodQty + ' ' + c.prodNama + ')</b></div>' +
                '<div>Siap dalam: <b id="farm-detail-prod-timer">' + window.formatDurasiFarm(info.prodRemMs) + '</b></div>' +
            '</div>';
    }

    let cleanBtn = info.hasWaste
        ? '<button type="button" class="mypet-amber-cta sm" onclick="window.bersihkanSatuKandangFarm(\'' + safeUid + '\')">🧹 Bersihkan 💩 (+1 Pupuk NPK)</button>'
        : '';

    return (
        '<div class="garden-right-card">' +
            '<div class="garden-detail-ribbon' + (info.isSick ? ' wilted' : '') + '">' + c.nama + '</div>' +
            '<div class="garden-detail-preview">' + window.bangunSVGTernakFarm(c.id, info.isSick, info.stageKey, 96) + '</div>' +
            '<div class="garden-prog-wrap">' +
                '<div class="garden-prog-top"><span>📈 Pertumbuhan</span><b id="farm-detail-grow-pct">' + (info.isAdult ? '100% (Produktif)' : info.growPct + '%') + '</b></div>' +
                '<div class="garden-prog-track"><div id="farm-detail-grow-fill" class="garden-prog-fill" style="width:' + info.growPct + '%; background:linear-gradient(90deg,#f59e0b,#16a34a);"></div></div>' +
            '</div>' +
            '<div class="garden-prog-wrap">' +
                '<div class="garden-prog-top"><span>' + feedIkon + ' Kenyang (' + c.feedLabel + ')</span><b>' + info.hunger + '%</b></div>' +
                '<div class="garden-prog-track"><div class="garden-prog-fill" style="width:' + info.hunger + '%; background:' + (info.hunger < 30 ? '#ef4444' : 'linear-gradient(90deg,#84cc16,#16a34a)') + ';"></div></div>' +
            '</div>' +
            statusProduksiHtml +
            cleanBtn +
            '<div style="display:flex; gap:6px; width:100%;">' +
                '<button type="button" class="mypet-green-cta sm" onclick="window.beriPakanTernakFarm(\'' + safeUid + '\')">' + feedIkon + ' Pakan (x' + stokFeed + ')</button>' +
                '<button type="button" class="mypet-green-cta sm" style="background:linear-gradient(180deg,#38bdf8,#0284c7); border-color:#0c4a6e;" onclick="window.beriMinumTernakFarm(\'' + safeUid + '\')" title="Gunakan 1 L Air dari Tandon (mempercepat produksi 3 menit)">💧 Minum</button>' +
            '</div>' +
            '<button type="button" class="mypet-amber-cta sm" onclick="window.jualDagingTernakFarm(\'' + safeUid + '\')" title="Jual hewan ini menjadi daging">🥩 Jual Daging (🪙 ' + info.hargaDagingAktif.toLocaleString("id-ID") + ')</button>' +
            '<p class="garden-detail-desc">' + c.deskripsi + '</p>' +
        '</div>'
    );
};

window.pilihHewanDiKandang = function(uid) {
    let ctx = window.ambilDataFarmAktif();
    if (!ctx || !ctx.fData || !ctx.fData.animals[uid]) return;

    window.selectedFarmAnimalUid = uid;
    document.querySelectorAll(".paddock-animal-actor.is-selected").forEach(function(el) {
        el.classList.remove("is-selected");
    });
    let targetEl = document.getElementById("farm-actor-" + uid);
    if (targetEl) targetEl.classList.add("is-selected");

    let host = document.getElementById("farm-detail-panel-host");
    if (host) host.innerHTML = window.bangunKartuDetailHewanFarm(ctx.fData, ctx);
};

window.mintaHasilTernakTeman = function(uid) {
    let ctx = window.ambilDataFarmAktif();
    if (!ctx || !ctx.isVisit || !ctx.fData || !ctx.fData.animals[uid]) return;
    let info = window.hitungStatusHewanFarm(ctx.fData.animals[uid]);
    if (!info || !info.prodReady || !info.cfg) return;

    if (typeof window.prosesMintaProdukTeman === "function") {
        window.prosesMintaProdukTeman({
            sumber: "farm",
            hostUser: ctx.hostUser,
            claimKey: ctx.hostUser + "__farm__" + uid,
            namaProduk: info.cfg.prodQty + " " + info.cfg.prodNama,
            ikon: info.cfg.prodIkon,
            coin: info.cfg.prodQty * info.cfg.prodCoin,
            xp: info.cfg.prodQty * info.cfg.prodXp
        });
    }
};

// =========================================================================
// 7. TOKO TERNAK, PAKAN (DEDAK & RUMPUT), & OBAT
// =========================================================================
window.renderShopMyFarm = function(bodyEl, lb) {
    let fData = lb.myFarmData;
    let sup = fData.supplies || {};

    let renderGrup = function(penKey, judul) {
        let items = window.MY_FARM_CATALOG.animals.filter(function(a) { return a.pen === penKey; });
        let cards = '';
        items.forEach(function(a) {
            let hasilCoin = a.prodQty * a.prodCoin;
            let hasilXp = a.prodQty * a.prodXp;
            cards +=
                '<div class="garden-shop-card">' +
                    '<div class="cozy-card-top-row">' +
                        '<span class="cozy-tag green">Dewasa ' + a.dewasaLabel + '</span>' +
                        '<span class="cozy-tag amber">Pakan: ' + a.feedLabel + '</span>' +
                    '</div>' +
                    '<div style="margin:4px 0;">' + window.bangunSVGTernakFarm(a.id, false, "adult", 76) + '</div>' +
                    '<div class="cozy-item-name">' + a.nama + '</div>' +
                    '<div class="garden-shop-meta">' + a.prodIkon + ' Produktif: ' + a.prodQty + 'x/' + a.prodLabel + ' (+' + hasilCoin + 'C, +' + hasilXp + 'XP)</div>' +
                    '<div style="font-size:10.5px; font-weight:800; color:#b45309; margin-bottom:4px;">🥩 Daging Dewasa: +' + a.meatCoin.toLocaleString("id-ID") + ' Coin & +' + a.meatXp + ' XP</div>' +
                    '<div class="cozy-item-sub" style="flex:1;">' + a.deskripsi + '</div>' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiKuisBeliFarm(\'animal\', \'' + a.id + '\')">🧠 Kuis & Beli (🪙 ' + a.harga.toLocaleString("id-ID") + ')</button>' +
                '</div>';
        });
        return '<h4 class="cozy-section-title">' + judul + '</h4><div class="garden-shop-grid" style="margin-bottom:18px;">' + cards + '</div>';
    };

    let supCards = '';
    window.MY_FARM_CATALOG.supplies.forEach(function(s) {
        let stok = Number(sup[s.id]) || 0;
        supCards +=
            '<div class="garden-shop-card">' +
                '<div class="cozy-card-top-row">' +
                    '<span class="cozy-tag neutral">' + (s.tipe === "med" ? "Kesehatan" : "Pakan") + '</span>' +
                    '<span class="cozy-stock-lbl">Stok: <b>' + stok + '</b></span>' +
                '</div>' +
                '<div style="font-size:40px; margin:8px 0;">' + s.ikon + '</div>' +
                '<div class="cozy-item-name">' + s.nama + '</div>' +
                '<div class="cozy-item-sub" style="flex:1;">' + s.deskripsi + '</div>' +
                '<button type="button" class="mypet-amber-cta sm" onclick="window.mulaiKuisBeliFarm(\'supply\', \'' + s.id + '\')">🧠 Kuis & Beli (🪙 ' + s.harga + ')</button>' +
            '</div>';
    });

    bodyEl.innerHTML =
        '<div class="garden-shop-wrap">' +
            '<div id="myfarm-toast-box" class="mygarden-toast-box" style="display:none;"></div>' +
            '<div class="garden-shop-head">' +
                '<div>' +
                    '<h3 style="margin:0; color:#4a2e14; font-size:17px;">🏪 Toko Ternak, Pakan, & Obat</h3>' +
                    '<div style="font-size:11.5px; color:#785a3a;">🧠 Jawab 1 soal Biologi sebelum membeli ternak/pakan/obat (<b>Benar: +5 Coin & Terbeli</b> • <b>Salah: -5 Coin</b>).</div>' +
                '</div>' +
                '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:8px 16px;" onclick="window.gantiViewMyFarm(\'kandang\')">🏡 Kembali ke Kandang</button>' +
            '</div>' +
            renderGrup("poultry", "🐔 1. Penghuni Kandang Unggas (Pakan Dedak)") +
            renderGrup("pasture", "🐄 2. Penghuni Padang Rumput (Pakan Rumput)") +
            '<h4 class="cozy-section-title">🌾 3. Pakan (Dedak & Rumput) & Obat Ternak</h4>' +
            '<div class="garden-shop-grid">' + supCards + '</div>' +
        '</div>';
};

// =========================================================================
// 8. AKSI TRANSAKSI, PERAWATAN, & PENJUALAN
// =========================================================================
window.upgradeKapasitasKandang = function(penKey) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb) return;
    let fData = lb.myFarmData;

    let isPoultry = (penKey === "poultry");
    let curCap = isPoultry ? fData.poultryCap : fData.pastureCap;
    if (curCap >= window.MY_FARM_CATALOG.maxCapPerPen) return;

    let harga = window.hitungHargaUpgradeKandang(fData, penKey);
    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    let namaKandang = isPoultry ? "Kandang Unggas" : "Padang Rumput";

    if (saldo < harga) {
        return window.tampilkanCustomDialog("alert", "⚠️ Coin belum cukup untuk memperluas " + namaKandang + " (" + harga.toLocaleString("id-ID") + " Coin)!", null, null);
    }

    window.tampilkanCustomDialog("confirm", "Perluas kapasitas " + namaKandang + " menjadi " + (curCap + 1) + " ekor seharga " + harga.toLocaleString("id-ID") + " Coin?", null, function(isYes) {
        if (!isYes) return;
        if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(harga, "upgrade_" + penKey, true)) {
            if (isPoultry) fData.poultryCap = curCap + 1;
            else fData.pastureCap = curCap + 1;
            window.simpanDataFarmKeServer(lb);
            window.renderMyFarmUI();
            window.tampilkanToastFarm("🏡 Kapasitas <b>" + namaKandang + "</b> bertambah menjadi " + (curCap + 1) + " ekor!");
        }
    });
};

window.beliHewanTernakFarm = function(animalId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    let cfg = window.cariInfoTernak(animalId);
    if (!lb || !cfg) return;

    let fData = lb.myFarmData;
    let curList = window.ambilDaftarHewanPerKandang(fData, cfg.pen);
    let maxCap = cfg.pen === "poultry" ? fData.poultryCap : fData.pastureCap;
    let namaKandang = cfg.pen === "poultry" ? "Kandang Unggas" : "Padang Rumput";

    if (curList.length >= maxCap) {
        return window.tampilkanCustomDialog("alert", "⚠️ " + namaKandang + " sudah penuh (" + curList.length + "/" + maxCap + " ekor)!\nPerluas kapasitas kandang atau jual daging hewan yang sudah dewasa.", null, null);
    }

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < cfg.harga) {
        return window.tampilkanCustomDialog("alert", "⚠️ Coin belum cukup untuk membeli " + cfg.nama + " (" + cfg.harga.toLocaleString("id-ID") + " Coin)!", null, null);
    }

    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(cfg.harga, "beli_ternak_" + animalId, true)) {
        let now = Date.now();
        let uid = "an_" + now + "_" + Math.floor(100 + Math.random() * 899);
        let adultAt = now + (cfg.dewasaDetik * 1000);
        fData.animals[uid] = {
            uid: uid,
            animalId: animalId,
            boughtAt: now,
            adultAt: adultAt,
            nextProduceAt: adultAt + (cfg.prodDetik * 1000),
            hunger: 85,
            isSick: false,
            sickName: "",
            hasWaste: false,
            lastCleanAt: now,
            lastUpdate: now
        };
        window.selectedFarmAnimalUid = uid;
        window.simpanDataFarmKeServer(lb);
        window.gantiViewMyFarm("kandang");
        window.tampilkanToastFarm("🐣 Anakan <b>" + cfg.nama + "</b> masuk ke " + namaKandang + "! Rawat sampai fase produktif.");
    }
};

window.beliKebutuhanFarm = function(supId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    let item = window.MY_FARM_CATALOG.supplies.find(function(s) { return s.id === supId; });
    if (!lb || !item) return;

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < item.harga) {
        return window.tampilkanCustomDialog("alert", "⚠️ Coin belum cukup untuk membeli " + item.nama + " (" + item.harga + " Coin)!", null, null);
    }

    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(item.harga, "beli_farm_" + supId, true)) {
        lb.myFarmData.supplies[supId] = (Number(lb.myFarmData.supplies[supId]) || 0) + 1;
        window.simpanDataFarmKeServer(lb);
        window.renderMyFarmUI();
        window.tampilkanToastFarm(item.ikon + " Berhasil membeli 1 <b>" + item.nama + "</b>!");
    }
};

window.beriPakanTernakFarm = function(uid) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb || !lb.myFarmData.animals[uid]) return;

    let fData = lb.myFarmData;
    let obj = fData.animals[uid];
    let info = window.hitungStatusHewanFarm(obj);
    if (!info) return;

    let feedId = info.cfg.feedId;
    let stok = Number((fData.supplies || {})[feedId]) || 0;
    if (stok <= 0) {
        window.tampilkanToastFarm("⚠️ Stok <b>" + info.cfg.feedLabel + "</b> habis! Beli di Toko Ternak dulu ya.");
        return;
    }

    fData.supplies[feedId] = stok - 1;
    obj.hunger = Math.min(100, (Number(obj.hunger) || 0) + 45);
    obj.lastUpdate = Date.now();

    let extraInfo = "+45 Kenyang";
    if (!info.isAdult) {
        let boostMs = (info.cfg.feedBoostDetik || 180) * 1000;
        let now = Date.now();
        obj.adultAt = Math.max(now, (Number(obj.adultAt) || now) - boostMs);
        obj.nextProduceAt = obj.adultAt + (info.cfg.prodDetik * 1000);
        extraInfo += " & lebih cepat dewasa " + Math.round(boostMs / 60000) + " mnt!";
    }

    window.simpanDataFarmKeServer(lb);
    window.renderMyFarmUI();
    window.tampilkanToastFarm("🍽️ <b>" + info.cfg.nama + "</b> makan " + info.cfg.feedLabel + "! (" + extraInfo + ")");
};

window.obatiTernakFarm = function(uid) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb || !lb.myFarmData.animals[uid]) return;

    let fData = lb.myFarmData;
    let obj = fData.animals[uid];
    if (!obj.isSick) return;

    let stokObat = Number((fData.supplies || {}).obat_ternak) || 0;
    if (stokObat <= 0) {
        window.tampilkanToastFarm("⚠️ Stok <b>Obat Ternak</b> kosong! Beli di Toko Ternak dulu ya.");
        return;
    }

    fData.supplies.obat_ternak = stokObat - 1;
    obj.isSick = false;
    obj.sickName = "";
    obj.hunger = Math.max(55, Number(obj.hunger) || 55);
    obj.lastUpdate = Date.now();

    window.simpanDataFarmKeServer(lb);
    window.renderMyFarmUI();
    window.tampilkanToastFarm("💊 Hewan ternak sembuh total dan kembali aktif berjalan!");
};

window.jualHasilTernak = function(uid) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb || !lb.myFarmData.animals[uid]) return;

    let fData = lb.myFarmData;
    let obj = fData.animals[uid];
    let info = window.hitungStatusHewanFarm(obj);
    if (!info || !info.prodReady) return;

    let c = info.cfg;
    let gainCoin = c.prodQty * c.prodCoin;
    let gainXp = c.prodQty * c.prodXp;

    obj.nextProduceAt = Date.now() + (c.prodDetik * 1000);
    obj.hunger = Math.max(10, (Number(obj.hunger) || 70) - 18);
    obj.hasWaste = true;
    obj.lastUpdate = Date.now();
    fData.totalProductsSold = (Number(fData.totalProductsSold) || 0) + c.prodQty;

    lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + gainCoin;
    lb.xpTersedia = lb.coin;
    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + gainXp;
    lb.xp = lb.xpTotal;

    let ingFarmKey = (c.pen === "poultry") ? "telur" : "susu";
    if (typeof window.tambahBahanDapurWorld === "function") {
        window.tambahBahanDapurWorld(lb, ingFarmKey, 1);
    }

    window.simpanDataFarmKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.renderMyFarmUI();
    window.tampilkanToastFarm(c.prodIkon + " Terjual <b>" + c.prodQty + " " + c.prodNama + "</b>! +🪙 " + gainCoin + " Coin, +⭐ " + gainXp + " XP, & +1 " + (ingFarmKey === "telur" ? "Telur" : "Susu") + " masuk Dapur!");
};

window.jualSemuaHasilTernak = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb || !lb.myFarmData.animals) return;

    let fData = lb.myFarmData;
    let totCoin = 0, totXp = 0, cnt = 0;

    Object.keys(fData.animals).forEach(function(uid) {
        let obj = fData.animals[uid];
        let info = window.hitungStatusHewanFarm(obj);
        if (info && info.prodReady) {
            let c = info.cfg;
            totCoin += (c.prodQty * c.prodCoin);
            totXp += (c.prodQty * c.prodXp);
            cnt++;
            obj.nextProduceAt = Date.now() + (c.prodDetik * 1000);
            obj.hunger = Math.max(10, (Number(obj.hunger) || 70) - 18);
            obj.hasWaste = true;
            obj.lastUpdate = Date.now();
            fData.totalProductsSold = (Number(fData.totalProductsSold) || 0) + c.prodQty;
            if (typeof window.tambahBahanDapurWorld === "function") {
                window.tambahBahanDapurWorld(lb, (c.pen === "poultry" ? "telur" : "susu"), 1);
            }
        }
    });

    if (cnt === 0) return;

    lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + totCoin;
    lb.xpTersedia = lb.coin;
    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + totXp;
    lb.xp = lb.xpTotal;

    window.simpanDataFarmKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.renderMyFarmUI();
    window.tampilkanToastFarm("🎉 Panen hasil dari <b>" + cnt + " ternak</b>! +🪙 " + totCoin.toLocaleString("id-ID") + " Coin & +⭐ " + totXp + " XP!");
};

window.jualDagingTernakFarm = function(uid) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb || !lb.myFarmData.animals[uid]) return;

    let fData = lb.myFarmData;
    let obj = fData.animals[uid];
    let info = window.hitungStatusHewanFarm(obj);
    if (!info) return;

    if (info.isSick) {
        return window.tampilkanCustomDialog("alert", "⚠️ Hewan yang sedang sakit tidak bisa dijual! Obati dulu menggunakan Obat Ternak.", null, null);
    }

    let c = info.cfg;
    let ketFase = info.isAdult ? "DEWASA (100% Harga Penuh)" : (info.stageLabel + " — Belum Dewasa");
    window.tampilkanCustomDialog(
        "confirm",
        "Jual " + c.nama + " [" + ketFase + "]?\n\nHasil penjualan: +🪙 " + info.hargaDagingAktif.toLocaleString("id-ID") + " Coin & +⭐ " + info.xpDagingAktif + " XP.",
        null,
        function(isYes) {
            if (!isYes) return;
            delete fData.animals[uid];
            delete window._farmRoamState[uid];
            fData.totalMeatSold = (Number(fData.totalMeatSold) || 0) + 1;

            lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + info.hargaDagingAktif;
            lb.xpTersedia = lb.coin;
            lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + info.xpDagingAktif;
            lb.xp = lb.xpTotal;

            window.simpanDataFarmKeServer(lb);
            if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
            if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
            window.renderMyFarmUI();
            window.tampilkanToastFarm("🥩 Daging <b>" + c.nama + "</b> terjual! +🪙 " + info.hargaDagingAktif.toLocaleString("id-ID") + " Coin & +⭐ " + info.xpDagingAktif + " XP!");
        }
    );
};

window.bersihkanSatuKandangFarm = function(uid) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb || !lb.myFarmData.animals[uid]) return;

    let obj = lb.myFarmData.animals[uid];
    if (!obj.hasWaste) return;

    obj.hasWaste = false;
    obj.lastCleanAt = Date.now();

    if (typeof window.pastikanStrukturMyGarden === "function") window.pastikanStrukturMyGarden(uName);
    if (lb.myGardenData && lb.myGardenData.fertilizerInventory) {
        lb.myGardenData.fertilizerInventory.pupuk_npk = (Number(lb.myGardenData.fertilizerInventory.pupuk_npk) || 0) + 1;
    }

    window.simpanDataFarmKeServer(lb);
    window.renderMyFarmUI();
    window.tampilkanToastFarm("🧹 Kandang bersih! Kotoran diolah menjadi <b>+1 🧪 Pupuk NPK</b> untuk My Garden!");
};

window.bersihkanSemuaKandangFarm = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb || !lb.myFarmData.animals) return;

    let cnt = 0;
    Object.keys(lb.myFarmData.animals).forEach(function(uid) {
        let obj = lb.myFarmData.animals[uid];
        if (obj && obj.hasWaste) {
            obj.hasWaste = false;
            obj.lastCleanAt = Date.now();
            cnt++;
        }
    });
    if (cnt === 0) return;

    if (typeof window.pastikanStrukturMyGarden === "function") window.pastikanStrukturMyGarden(uName);
    if (lb.myGardenData && lb.myGardenData.fertilizerInventory) {
        lb.myGardenData.fertilizerInventory.pupuk_npk = (Number(lb.myGardenData.fertilizerInventory.pupuk_npk) || 0) + cnt;
    }

    window.simpanDataFarmKeServer(lb);
    window.renderMyFarmUI();
    window.tampilkanToastFarm("🧹 " + cnt + " kandang bersih! Bonus <b>+" + cnt + " 🧪 Pupuk NPK</b> masuk ke My Garden!");
};

document.addEventListener("DOMContentLoaded", function() {
    window.pastikanUIMyFarmAda();
    setTimeout(function() {
        let uName = sessionStorage.getItem("username");
        if (uName) {
            let lb = window.pastikanStrukturMyFarm(uName);
            window.sinkronkanKondisiSemuaTernak(lb);
            window.perbaruiSaldoHUDFarm();
        }
    }, 1700);
});
// =========================================================================
// 9. BANK SOAL BIOLOGI WAJIB BELI TERNAK, PAKAN, & OBAT (+5 / -5 COIN)
// =========================================================================
window.MY_FARM_QUIZ_BANK = {
    ayam_petelur: [
        { q: "Berdasarkan cara berkembang biaknya dengan bertelur, ayam digolongkan sebagai hewan...", opts: ["Vivipar", "Ovipar", "Ovovivipar", "Fragmentasi"], ans: 1, info: "Ayam berkembang biak secara ovipar (bertelur) dengan pembuahan internal." },
        { q: "Muara saluran pencernaan, ekskresi, dan reproduksi pada ayam bermuara pada satu lubang yang disebut...", opts: ["Kloaka", "Anus sejati", "Uretra", "Nefridiopor"], ans: 0, info: "Aves (unggas), reptil, dan amfibi memiliki kloaka sebagai muara bersama 3 saluran." },
        { q: "Alat pernapasan utama ayam adalah paru-paru yang dibantu oleh kantong tambahan bernama...", opts: ["Insang dalam", "Trakea bercabang", "Pundi-pundi udara (sakus pneumatikus)", "Kulit lembap"], ans: 2, info: "Unggas (Aves) bernapas dengan paru-paru yang dibantu pundi-pundi udara." },
        { q: "Ayam termasuk ke dalam kelas vertebrata berbulu dan bersayap (meski tidak terbang jauh), yaitu kelas...", opts: ["Mamalia", "Reptilia", "Aves", "Amfibia"], ans: 2, info: "Semua unggas seperti ayam dan bebek termasuk kelas Aves." }
    ],
    ayam_pedaging: [
        { q: "Ayam tidak memiliki gigi sejati. Organ saluran pencernaan ayam yang berdinding otot tebal untuk menggiling biji-bijian adalah...", opts: ["Empedal (ventrikulus)", "Rumen", "Omasum", "Usus buntu"], ans: 0, info: "Empedal (ventrikulus) menggiling pakan keras secara mekanis, sering dibantu kerikil kecil." },
        { q: "Bagian daging dada ayam pedaging yang kaya protein tersusun atas jenis jaringan otot...", opts: ["Otot polos", "Otot lurik (otot rangka)", "Otot jantung", "Jaringan epitel"], ans: 1, info: "Daging konsumsi pada hewan ternak tersusun dari jaringan otot lurik/rangka." },
        { q: "Suhu tubuh ayam relatif tetap meskipun suhu lingkungan berubah-ubah. Sifat ini disebut...", opts: ["Poikiloterm (berdarah dingin)", "Homoioterm (berdarah panas)", "Ektoterm", "Anaerob"], ans: 1, info: "Aves dan Mamalia bersifat homoioterm (endoterm) dengan jantung 4 ruang sempurna." }
    ],
    bebek_petelur: [
        { q: "Selaput kulit di antara jari-jari kaki bebek merupakan contoh adaptasi morfologi untuk...", opts: ["Mencengkeram mangsa di pohon", "Berenang di air dan berjalan di lumpur", "Menggali tanah keras", "Terbang menukik"], ans: 1, info: "Kaki berselaput memperluas permukaan dorong saat bebek berenang di air." },
        { q: "Agar bulunya tetap kedap air saat berenang, bebek mengoleskan minyak dari kelenjar di pangkal ekor bernama...", opts: ["Kelenjar keringat", "Kelenjar uropigial", "Kelenjar mamae", "Kelenjar tiroid"], ans: 1, info: "Kelenjar uropigial menghasilkan sekret minyak pelapis bulu unggas air." },
        { q: "Bentuk paruh bebek yang pipih melebar dan bergerigi halus (lamela) di tepinya berfungsi untuk...", opts: ["Menyaring makanan kecil dari air dan lumpur", "Mengoyak daging keras", "Menghisap nektar bunga", "Memecah tempurung kelapa"], ans: 0, info: "Paruh berlamela memudahkan bebek menyaring cacing, serangga air, dan tumbuhan kecil." }
    ],
    kambing_etawa: [
        { q: "Kambing berkembang biak dengan melahirkan anak dan menyusui. Cara reproduksi ini disebut...", opts: ["Ovipar", "Vivipar", "Ovovivipar", "Partenogenesis"], ans: 1, info: "Kambing adalah mamalia vivipar yang embrio anaknya berkembang di dalam rahim." },
        { q: "Organ khusus pada kambing betina yang menghasilkan susu bergizi bagi anaknya adalah...", opts: ["Kelenjar mamae (kelenjar susu)", "Kloaka", "Kelenjar uropigial", "Kantung empedu"], ans: 0, info: "Ciri khas utama kelas Mamalia adalah memiliki rambut dan kelenjar mamae." },
        { q: "Sebagai hewan memamah biak (ruminansia), lambung kambing terbagi menjadi berapa ruang?", opts: ["1 ruang", "2 ruang", "3 ruang", "4 ruang (rumen, retikulum, omasum, abomasum)"], ans: 3, info: "Hewan ruminansia (sapi, kambing, domba) memiliki lambung 4 ruang." }
    ],
    sapi_perah: [
        { q: "Dari keempat ruang lambung sapi, bagian yang merupakan lambung sejati penghasil asam lambung dan enzim pencernaan adalah...", opts: ["Rumen", "Retikulum", "Omasum", "Abomasum"], ans: 3, info: "Abomasum bekerja seperti lambung manusia yang mensekresikan HCl dan enzim pepsin." },
        { q: "Karbohidrat disakarida alami yang menjadi gula utama dalam susu sapi adalah...", opts: ["Sukrosa", "Laktosa", "Maltosa", "Amilum"], ans: 1, info: "Susu mamalia mengandung laktosa (gabungan glukosa dan galaktosa) serta protein kasein." },
        { q: "Interaksi antara sapi dan bakteri pengurai selulosa yang hidup di dalam rumennya termasuk simbiosis...", opts: ["Parasitisme", "Mutualisme", "Komensalisme", "Predasi"], ans: 1, info: "Bakteri mendapat tempat hidup dan makanan, sedangkan sapi terbantu mencerna selulosa rumput." }
    ],
    sapi_potong: [
        { q: "Sebagai mamalia berdarah panas, jantung sapi memiliki struktur ruang sebanyak...", opts: ["2 ruang", "3 ruang", "4 ruang sempurna (2 atrium, 2 ventrikel)", "1 ruang tunggal"], ans: 2, info: "Jantung 4 ruang bersekat sempurna mencegah bercampurnya darah kaya O2 dan CO2." },
        { q: "Gas rumah kaca yang dilepaskan dari aktivitas mikroba metanogen di dalam rumen sapi adalah...", opts: ["Oksigen (O2)", "Metana (CH4)", "Nitrogen (N2)", "Helium (He)"], ans: 1, info: "Fermentasi anaerobik selulosa di rumen menghasilkan gas metana (CH4)." },
        { q: "Nutrien makro utama pada daging sapi potong yang berfungsi membangun sel dan jaringan tubuh adalah...", opts: ["Protein hewani", "Selulosa", "Kitin", "Klorofil"], ans: 0, info: "Daging sapi kaya protein hewani dengan asam amino esensial lengkap dan zat besi." }
    ],
    pakan_dedak: [
        { q: "Dedak/bekatul sebagai pakan unggas berasal dari lapisan kulit ari hasil penggilingan biji...", opts: ["Padi", "Kelapa sawit", "Kacang tanah", "Kapas"], ans: 0, info: "Dedak adalah hasil samping penggilingan gabah padi yang kaya karbohidrat, serat, dan vitamin B." },
        { q: "Organ saluran pencernaan unggas yang berfungsi menyimpan dan melunakkan dedak sementara sebelum masuk lambung adalah...", opts: ["Tembolok (ingluvies)", "Kloaka", "Rumen", "Pankreas"], ans: 0, info: "Tembolok adalah pelebaran kerongkongan pada burung/ayam untuk menyimpan makanan sementara." },
        { q: "Vitamin B1 (tiamin) yang banyak terkandung pada kulit ari padi/dedak berfungsi penting untuk...", opts: ["Metabolisme energi dan fungsi saraf", "Membentuk klorofil", "Mengubah warna bulu menjadi biru", "Pembekuan darah secara langsung"], ans: 0, info: "Tiamin (Vitamin B1) berperan sebagai koenzim dalam metabolisme karbohidrat dan saraf." }
    ],
    pakan_rumput: [
        { q: "Dinding sel rumput tersusun atas polisakarida keras yang dicerna sapi dengan bantuan enzim mikroba rumen, yaitu...", opts: ["Glikogen", "Selulosa", "Kitin", "Keratin"], ans: 1, info: "Selulosa pada dinding sel tumbuhan dipecah oleh enzim selulase dari mikroba rumen." },
        { q: "Dalam rantai makanan padang rumput (Rumput -> Sapi -> Manusia), peran ekologis rumput adalah sebagai...", opts: ["Produsen (autotrof)", "Konsumen tingkat I", "Dekomposer", "Detritivor"], ans: 0, info: "Rumput berfotosintesis menyusun senyawa organik sehingga menjadi produsen." },
        { q: "Kebiasaan sapi mengembalikan gumpalan rumput (bolus) dari lambung ke mulut untuk dikunyah kedua kalinya disebut...", opts: ["Memamah biak (regurgitasi)", "Fotosintesis", "Ekskresi", "Fermentasi alkohol"], ans: 0, info: "Regurgitasi menghaluskan serat rumput agar lebih mudah dicerna mikroba di lambung." }
    ],
    obat_ternak: [
        { q: "Pemberian antibiotik pada hewan ternak yang sakit efektif digunakan untuk melawan infeksi dari...", opts: ["Bakteri patogen", "Virus flu murni", "Kekurangan air minum", "Suhu panas"], ans: 0, info: "Antibiotik menargetkan struktur/metabolisme bakteri dan tidak dapat membunuh virus." },
        { q: "Upaya mencegah penyakit menular pada ternak dengan menyuntikkan antigen lemah agar terbentuk antibodi disebut...", opts: ["Vaksinasi (imunisasi aktif)", "Transpirasi", "Metamorfosis", "Osmosis"], ans: 0, info: "Vaksinasi merangsang sistem imun membentuk sel memori dan antibodi spesifik." },
        { q: "Mengapa membersihkan tumpukan kotoran di kandang sangat penting untuk mencegah hewan sakit?", opts: ["Mencegah berkembangnya bakteri patogen, lalat, dan telur cacing parasit", "Menambah gas amonia", "Menghilangkan oksigen di kandang", "Membuat ternak berhenti makan"], ans: 0, info: "Kandang kotor memicu akumulasi amonia dan penularan patogen serta cacing parasit." }
    ]
};

window._farmQuizRotasi = {};
window._activeFarmQuizState = null;

window.mulaiKuisBeliFarm = function(itemType, itemId) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb) return;

    let fData = lb.myFarmData;
    let item = null;
    let namaItem = "";
    let hargaItem = 0;

    if (itemType === "animal") {
        item = window.cariInfoTernak(itemId);
        if (!item) return;
        let curList = window.ambilDaftarHewanPerKandang(fData, item.pen);
        let maxCap = item.pen === "poultry" ? fData.poultryCap : fData.pastureCap;
        let namaKandang = item.pen === "poultry" ? "Kandang Unggas" : "Padang Rumput";
        if (curList.length >= maxCap) {
            return window.tampilkanCustomDialog("alert", "⚠️ " + namaKandang + " sudah penuh (" + curList.length + "/" + maxCap + " ekor)!\nPerluas kapasitas kandang atau jual daging hewan dulu.", null, null);
        }
        namaItem = item.nama;
        hargaItem = item.harga;
    } else {
        item = window.MY_FARM_CATALOG.supplies.find(function(s) { return s.id === itemId; });
        if (!item) return;
        namaItem = item.nama;
        hargaItem = item.harga;
    }

    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < hargaItem) {
        return window.tampilkanCustomDialog("alert", "⚠️ Coin belum cukup untuk membeli " + namaItem + "!\nHarga: " + hargaItem.toLocaleString("id-ID") + " Coin | Saldo: " + saldo.toLocaleString("id-ID") + " Coin.", null, null);
    }

    let pool = window.MY_FARM_QUIZ_BANK[itemId] || window.MY_FARM_QUIZ_BANK.ayam_petelur;
    let rotIdx = (typeof window._farmQuizRotasi[itemId] === "number") ? window._farmQuizRotasi[itemId] : 0;
    let soalObj = pool[rotIdx % pool.length];
    window._farmQuizRotasi[itemId] = (rotIdx + 1) % pool.length;

    window._activeFarmQuizState = {
        itemType: itemType,
        itemId: itemId,
        namaItem: namaItem,
        hargaItem: hargaItem,
        soal: soalObj,
        answered: false
    };

    window.renderOverlayKuisFarm();
};

window.renderOverlayKuisFarm = function(resultInfo) {
    let ov = document.getElementById("myfarm-quiz-overlay");
    let st = window._activeFarmQuizState;
    if (!ov || !st) return;

    let soal = st.soal;
    let letters = ["A", "B", "C", "D"];
    let icoHtml = st.itemType === "animal"
        ? window.bangunSVGTernakFarm(st.itemId, false, "adult", 48)
        : '<span style="font-size:30px;">' + ((window.MY_FARM_CATALOG.supplies.find(function(s) { return s.id === st.itemId; }) || {}).ikon || '🌾') + '</span>';

    let optsHtml = '';
    soal.opts.forEach(function(optText, idx) {
        let cls = "garden-quiz-opt";
        let dis = st.answered ? " disabled" : "";
        if (st.answered && resultInfo) {
            if (idx === soal.ans) cls += " is-correct";
            else if (idx === resultInfo.pickedIdx && !resultInfo.isCorrect) cls += " is-wrong";
        }
        optsHtml +=
            '<button type="button" class="' + cls + '"' + dis + ' onclick="window.jawabKuisBeliFarm(' + idx + ')">' +
                '<b>' + letters[idx] + '.</b> <span>' + optText + '</span>' +
            '</button>';
    });

    let feedbackHtml = '';
    if (st.answered && resultInfo) {
        if (resultInfo.isCorrect) {
            feedbackHtml =
                '<div class="garden-quiz-feedback ok">' +
                    '<div><b>✅ Jawaban Benar! (+5 Coin Bonus)</b></div>' +
                    '<div style="margin-top:3px;">1 <b>' + st.namaItem + '</b> berhasil dibeli!</div>' +
                    '<div style="margin-top:4px; font-size:11px; opacity:0.9;">💡 ' + soal.info + '</div>' +
                '</div>' +
                '<div style="display:flex; gap:8px; margin-top:10px;">' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.tutupKuisFarm(); ' + (st.itemType === "animal" ? 'window.gantiViewMyFarm(\'kandang\');' : '') + '">' + (st.itemType === "animal" ? '🏡 Lihat di Kandang' : 'Selesai') + '</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.mulaiKuisBeliFarm(\'' + st.itemType + '\', \'' + st.itemId + '\')">➕ Beli 1 Lagi</button>' +
                '</div>';
        } else {
            feedbackHtml =
                '<div class="garden-quiz-feedback err">' +
                    '<div><b>❌ Jawaban Salah! (-5 Coin)</b></div>' +
                    '<div style="margin-top:3px;">Pembelian <b>' + st.namaItem + '</b> dibatalkan. Kunci: <b>' + letters[soal.ans] + '. ' + soal.opts[soal.ans] + '</b></div>' +
                    '<div style="margin-top:4px; font-size:11px; opacity:0.9;">💡 ' + soal.info + '</div>' +
                '</div>' +
                '<div style="display:flex; gap:8px; margin-top:10px;">' +
                    '<button type="button" class="mypet-gray-cta sm" onclick="window.tutupKuisFarm()">Tutup</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.mulaiKuisBeliFarm(\'' + st.itemType + '\', \'' + st.itemId + '\')">🔄 Coba Soal Berikutnya</button>' +
                '</div>';
        }
    }

    ov.innerHTML =
        '<div class="garden-quiz-card">' +
            '<div class="garden-quiz-head">' +
                '<div style="display:flex; align-items:center; gap:10px;">' +
                    '<div class="garden-quiz-ico">' + icoHtml + '</div>' +
                    '<div>' +
                        '<div style="font-size:14.5px; font-weight:900; color:#4a2e14;">🧠 Kuis Biologi: ' + st.namaItem + '</div>' +
                        '<div style="font-size:11px; color:#785a3a;">Harga: <b>🪙 ' + st.hargaItem.toLocaleString("id-ID") + '</b> • Benar: <b style="color:#15803d;">+5 Coin</b> | Salah: <b style="color:#dc2626;">-5 Coin</b></div>' +
                    '</div>' +
                '</div>' +
                '<button type="button" class="garden-quiz-close" onclick="window.tutupKuisFarm()">✕</button>' +
            '</div>' +
            '<div class="garden-quiz-question">' + soal.q + '</div>' +
            '<div class="garden-quiz-opts">' + optsHtml + '</div>' +
            feedbackHtml +
        '</div>';

    ov.style.display = "flex";
};

window.jawabKuisBeliFarm = function(pickedIdx) {
    let st = window._activeFarmQuizState;
    if (!st || st.answered) return;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb) return;

    st.answered = true;
    let isCorrect = (pickedIdx === st.soal.ans);
    let curCoin = Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0;

    if (isCorrect) {
        if (curCoin + 5 < st.hargaItem) {
            window.tutupKuisFarm();
            return window.tampilkanCustomDialog("alert", "⚠️ Saldo Coin tidak mencukupi.", null, null);
        }
        lb.coin = Math.max(0, curCoin + 5 - st.hargaItem);
        lb.xpTersedia = lb.coin;
        lb.xpSpentTotal = (Number(lb.xpSpentTotal) || 0) + Math.max(0, st.hargaItem - 5);
        lb.xp = lb.xpTotal;

        let fData = lb.myFarmData;
        if (st.itemType === "animal") {
            let cfg = window.cariInfoTernak(st.itemId);
            if (cfg) {
                let now = Date.now();
                let uid = "an_" + now + "_" + Math.floor(100 + Math.random() * 899);
                let adultAt = now + (cfg.dewasaDetik * 1000);
                fData.animals[uid] = {
                    uid: uid,
                    animalId: cfg.id,
                    boughtAt: now,
                    adultAt: adultAt,
                    nextProduceAt: adultAt + (cfg.prodDetik * 1000),
                    hunger: 85,
                    isSick: false,
                    sickName: "",
                    hasWaste: false,
                    lastCleanAt: now,
                    lastUpdate: now
                };
                window.selectedFarmAnimalUid = uid;
            }
        } else {
            fData.supplies[st.itemId] = (Number(fData.supplies[st.itemId]) || 0) + 1;
        }
    } else {
        lb.coin = Math.max(0, curCoin - 5);
        lb.xpTersedia = lb.coin;
        lb.xp = lb.xpTotal;
    }

    window.simpanDataFarmKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.renderMyFarmUI();
    window.renderOverlayKuisFarm({ pickedIdx: pickedIdx, isCorrect: isCorrect });
};

window.tutupKuisFarm = function() {
    window._activeFarmQuizState = null;
    let ov = document.getElementById("myfarm-quiz-overlay");
    if (ov) ov.style.display = "none";
};
// =========================================================================
// 10. BERI MINUM TERNAK MENGGUNAKAN AIR DARI TANDON MY WORLD
// =========================================================================
window.beriMinumTernakFarm = function(uid) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyFarm(uName);
    if (!lb || !lb.myFarmData.animals[uid]) return;

    if (typeof window.pakaiAirFarmWorld === "function" && !window.pakaiAirFarmWorld(1)) {
        window.tampilkanToastFarm("⚠️ Stok air minum ternak habis! Keluar ke <b>My World</b>, ambil air dari <b>🛢️ Tandon Air</b> (isi Tandon dari <b>🪣 Sumur</b>).");
        return;
    }

    let obj = lb.myFarmData.animals[uid];
    let info = window.hitungStatusHewanFarm(obj);
    if (!info) return;

    obj.hunger = Math.min(100, (Number(obj.hunger) || 0) + 18);
    let now = Date.now();
    if (info.isAdult) {
        obj.nextProduceAt = Math.max(now, (Number(obj.nextProduceAt) || now) - 180000);
    } else {
        obj.adultAt = Math.max(now, (Number(obj.adultAt) || now) - 180000);
        obj.nextProduceAt = obj.adultAt + (info.cfg.prodDetik * 1000);
    }
    obj.lastUpdate = now;

    window.simpanDataFarmKeServer(lb);
    window.renderMyFarmUI();
    window.tampilkanToastFarm("💧 <b>" + info.cfg.nama + "</b> diberi minum air segar! (+18 Segar &amp; lebih cepat 3 menit)");
};