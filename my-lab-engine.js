/* =========================================================================
   MODUL MY LAB ENGINE — TAHAP 1 (GAYA COOKING MAMA + INTEGRASI MY WORLD):
   - Lobi Laboratorium Sains (4 Modul: Tes Golongan Darah Aktif + 3 Roadmap)
   - Praktikum 1: Tes Golongan Darah ABO & Rhesus (4 Layar Interaktif)
   - Penilaian Bintang 1-3, Reward Coin & XP, & Mode Visit Lemari Piala Teman
   ========================================================================= */

window.MY_LAB_CATALOG = {
    experiments: [
        {
            id: "blood_test",
            judul: "Tes Golongan Darah",
            sub: "Sistem ABO & Rhesus (4 Tahap)",
            ikon: "🩸",
            status: "ready",
            rewardMaxCoin: 80,
            rewardMaxXp: 40,
            deskripsi: "Teteskan darah & serum Anti-A, B, AB, D, aduk aseptis, lalu baca reaksi aglutinasi untuk mendiagnosis golongan darah pasien."
        },
        {
            id: "membrane_transport",
            judul: "Transpor Membran & Osmosis",
            sub: "Investigasi Konsentrasi Sel & Osmosis",
            ikon: "🔬",
            status: "ready",
            rewardMaxCoin: 100,
            rewardMaxXp: 50,
            deskripsi: "Tentukan konsentrasi zat sel misteri dengan menguji berbagai konsentrasi larutan, mengamati perubahan sel di mikroskop, dan menarik kesimpulan osmosis."
        },
        {
            id: "tissue_culture",
            judul: "Kultur Jaringan Tumbuhan",
            sub: "Eksplan ➔ Media MS ➔ Plantlet",
            ikon: "🧫",
            status: "ready",
            rewardMaxCoin: 180,
            rewardMaxXp: 90,
            deskripsi: "Potong eksplan ala Cooking Mama, sterilkan bertingkat, atur rasio hormon Auksin–Sitokinin, lalu jual atau kirim plantlet ke My Garden."
        },
        {
            id: "dna_recomb",
            judul: "Rekombinasi DNA (Insulin)",
            sub: "Isolasi ➔ Restriksi ➔ Ligasi ➔ Vial Insulin",
            ikon: "🧬",
            status: "ready",
            rewardMaxCoin: 220,
            rewardMaxXp: 110,
            deskripsi: "Isolasi gen insulin dari sel beta pankreas, ekstrak plasmid E. coli, potong dengan enzim restriksi, ligasi rDNA, hingga panen Vial Insulin."
        },
        {
            id: "genetics_lab",
            judul: "Genetika & Persilangan",
            sub: "6 Mode: Monohibrid s/d Backcross",
            ikon: "🌺",
            status: "ready",
            rewardMaxCoin: 220,
            rewardMaxXp: 110,
            deskripsi: "Tentukan P1 & F2 sendiri, susun gamet (Segregasi & Asortasi Bebas), isi Punnett Drag & Drop untuk Monohibrid, Intermediet, Dihibrid, Resiprok, Testcross, & Backcross."
        },
        {
            id: "microscope_lab",
            judul: "Mikroskop Sel & Jaringan",
            sub: "Ganti Mikroskop, Lensa, & Cahaya",
            ikon: "🔭",
            status: "ready",
            rewardMaxCoin: 200,
            rewardMaxXp: 100,
            deskripsi: "Amati berbagai sel & jaringan dengan memilih jenis mikroskop (Cahaya, Stereo, Elektron), lensa okuler-objektif, cahaya, serta fokus."
        },
        {
            id: "food_test",
            judul: "Uji Kandungan Zat Makanan",
            sub: "Lugol, Biuret, Benedict, & Lemak",
            ikon: "🥗",
            status: "ready",
            rewardMaxCoin: 140,
            rewardMaxXp: 70,
            deskripsi: "Tumbuk sampel makanan, uji 4 reagen warna + pemanasan Bunsen, diagnosis kandungan gizinya, lalu klaim Coin atau Fresh Meal untuk My Pet."
        },
        {
            id: "gram_stain",
            judul: "Pewarnaan Gram Bakteri",
            sub: "Kristal Violet ➔ Iodin ➔ Alkohol ➔ Safranin",
            ikon: "🦠",
            status: "ready",
            rewardMaxCoin: 170,
            rewardMaxXp: 85,
            deskripsi: "Fiksasi apusan bakteri, lakukan 4 tahap pewarnaan Gram secara urut & presisi, lalu identifikasi Gram (+)/(−) untuk bonus Obat Ternak My Farm."
        },
        {
            id: "fermentation_lab",
            judul: "Fermentasi Bioteknologi",
            sub: "Inkubator Real-Time (Yoghurt, Tempe, Tape, Keju)",
            ikon: "🫙",
            status: "ready",
            rewardMaxCoin: 420,
            rewardMaxXp: 150,
            deskripsi: "Pasteurisasi substrat, inokulasi mikroba tepat, atur suhu inkubator, dan pantau fermentasi waktu nyata seperti My Garden hingga panen."
        },
        {
            id: "protein_synth",
            judul: "Sintesis Protein",
            sub: "Transkripsi mRNA ➔ Translasi Ribosom",
            ikon: "🧬",
            status: "ready",
            rewardMaxCoin: 210,
            rewardMaxXp: 105,
            deskripsi: "Rangkai pita mRNA komplementer di nukleus, lalu terjemahkan kodon menggunakan Tabel Kodon & Drag-Drop tRNA hingga membentuk polipeptida."
        },
        {
            id: "hematopoiesis",
            judul: "Hematopoesis & Sel Imun",
            sub: "Rekrut 9 Sel Darah ➔ Misi Tanggap Imun",
            ikon: "🛡️",
            status: "ready",
            rewardMaxCoin: 240,
            rewardMaxXp: 120,
            deskripsi: "Diferensiasikan sel punca HSC ke jalur Mieloid (6 sel) & Limfoid (3 sel imun), lalu kerahkan pasukan sel yang tepat menghadapi kasus klinis."
        }
    ],
    bloodTypes: [
        { type: "A+",  antiA: true,  antiB: false, antiAB: true,  antiD: true,  antigen: "Aglutinogen A dan Rhesus (D)",       aglutinin: "Aglutinin β (anti-B)",          donorAman: "A+, A-, O+, O-" },
        { type: "A-",  antiA: true,  antiB: false, antiAB: true,  antiD: false, antigen: "Aglutinogen A (tanpa Rhesus)",       aglutinin: "Aglutinin β (anti-B)",          donorAman: "A-, O-" },
        { type: "B+",  antiA: false, antiB: true,  antiAB: true,  antiD: true,  antigen: "Aglutinogen B dan Rhesus (D)",       aglutinin: "Aglutinin α (anti-A)",          donorAman: "B+, B-, O+, O-" },
        { type: "B-",  antiA: false, antiB: true,  antiAB: true,  antiD: false, antigen: "Aglutinogen B (tanpa Rhesus)",       aglutinin: "Aglutinin α (anti-A)",          donorAman: "B-, O-" },
        { type: "AB+", antiA: true,  antiB: true,  antiAB: true,  antiD: true,  antigen: "Aglutinogen A, B, dan Rhesus (D)",   aglutinin: "Tidak memiliki α maupun β",     donorAman: "Semua golongan (Resipien Universal)" },
        { type: "AB-", antiA: true,  antiB: true,  antiAB: true,  antiD: false, antigen: "Aglutinogen A dan B (tanpa Rhesus)", aglutinin: "Tidak memiliki α maupun β",     donorAman: "AB-, A-, B-, O-" },
        { type: "O+",  antiA: false, antiB: false, antiAB: false, antiD: true,  antigen: "Hanya antigen Rhesus (tanpa A/B)",   aglutinin: "Aglutinin α dan β",             donorAman: "O+, O-" },
        { type: "O-",  antiA: false, antiB: false, antiAB: false, antiD: false, antigen: "Tidak ada A, B, maupun Rhesus",      aglutinin: "Aglutinin α dan β",             donorAman: "Hanya O- (Donor Universal)" }
    ],
    reagents: [
        { key: "antiA",  label: "Anti-A",  color: "#2563eb", softBg: "#dbeafe", dropCol: "#3b82f6" },
        { key: "antiB",  label: "Anti-B",  color: "#d97706", softBg: "#fef3c7", dropCol: "#facc15" },
        { key: "antiAB", label: "Anti-AB", color: "#059669", softBg: "#d1fae5", dropCol: "#34d399" },
        { key: "antiD",  label: "Anti-D",  color: "#64748b", softBg: "#e2e8f0", dropCol: "#cbd5e1" }
    ],
    patientNames: ["Andi", "Nadia", "Kevin", "Siti", "Bima", "Clara", "Raka", "Dewi", "Fajar", "Tania"]
};

// =========================================================================
// 1. STATE & STRUKTUR DATA MY LAB (0 EXTRA FIREBASE READS)
// =========================================================================
window.isMyLabModalOpen = false;
window.modeKunjunganLab = null;
window.activeLabView = "lobby"; // 'lobby' | 'blood_test' | 'membrane_transport' | 'tissue_culture' | 'dna_recomb'
window.labBloodSession = null;
window.labMembraneSession = null;
window.labTissueSession = null;
window.labDnaSession = null;
window._tcSterilTimer = null;
window._tcKnifeDown = false;
window._dnaHeatTimer = null;
window._labStirPointer = { active: false, wellKey: "", lastX: 0, lastY: 0 };

window.apakahAdminSandboxLab = function() {
    let rawU = String(sessionStorage.getItem("username") || "").trim().toLowerCase();
    return (typeof window.isAdminSession === "function" && window.isAdminSession()) ||
           sessionStorage.getItem("statusLogin") === "admin" ||
           rawU === "mahardika";
};

window.pastikanStrukturMyLab = function(uName) {
    let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(uName)
        : null;
    if (!lb) return null;

    if (!lb.myLabData || typeof lb.myLabData !== "object") {
        lb.myLabData = {
            records: {},
            totalCompleted: 0,
            totalStars: 0
        };
    } else {
        if (!lb.myLabData.records || typeof lb.myLabData.records !== "object") lb.myLabData.records = {};
        if (typeof lb.myLabData.totalCompleted !== "number") lb.myLabData.totalCompleted = 0;
        if (typeof lb.myLabData.totalStars !== "number") lb.myLabData.totalStars = 0;
    }
    return lb;
};

window.simpanDataLabKeServer = function(lb) {
    if (!lb || window.apakahAdminSandboxLab()) return;
    let rawU = sessionStorage.getItem("username") || "";
    let cleanKey = (typeof window.normalisasiKeySiswaPet === "function")
        ? window.normalisasiKeySiswaPet(rawU)
        : rawU.trim().toLowerCase();
    if (cleanKey && typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(cleanKey, lb);
    }
};

window.ambilDataLabAktif = function() {
    if (window.modeKunjunganLab && window.leaderboardSiswaData && window.leaderboardSiswaData[window.modeKunjunganLab]) {
        let hostLb = window.leaderboardSiswaData[window.modeKunjunganLab];
        let ld = (hostLb && hostLb.myLabData) ? hostLb.myLabData : { records: {}, totalCompleted: 0, totalStars: 0 };
        return {
            isVisit: true,
            hostUser: window.modeKunjunganLab,
            hostNama: hostLb.namaPanggilan || hostLb.namaLengkap || window.modeKunjunganLab,
            labData: ld
        };
    }
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyLab(uName);
    return {
        isVisit: false,
        hostUser: uName,
        hostNama: uName,
        labData: lb ? lb.myLabData : { records: {}, totalCompleted: 0, totalStars: 0 }
    };
};

// =========================================================================
// 2. INJEKSI MODAL UTAMA MY LAB & KONTROL BUKA/TUTUP
// =========================================================================
window.pastikanUIMyLabAda = function() {
    if (document.getElementById("modal-my-lab")) return;

    let modal = document.createElement("div");
    modal.id = "modal-my-lab";
    modal.className = "modal-overlay";
    modal.onclick = function(e) {
        if (e.target === modal) window.tutupModalMyLab();
    };

    modal.innerHTML =
        '<div class="modal-box mylab-modal-box">' +
            '<div class="mylab-hud">' +
                '<div class="mylab-hud-left">' +
                    '<div class="mylab-wood-sign" onclick="window.kembaliKeLobiLab()" title="Kembali ke Lobi Lab">' +
                        '<span style="font-size:20px;">🧪</span>' +
                        '<div>' +
                            '<div class="lab-sign-top">Lab Sains</div>' +
                            '<div class="lab-sign-main">My Lab</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="mypet-hud-currencies">' +
                        '<div class="mypet-hud-pill coin-pill" title="Saldo Coin Belanja">' +
                            '<span class="hud-orb coin-orb">🪙</span>' +
                            '<strong id="mylab-hud-coin">0</strong>' +
                        '</div>' +
                        '<div class="mypet-hud-pill xp-pill" title="Total XP Leaderboard">' +
                            '<span class="hud-orb xp-orb">⭐</span>' +
                            '<strong id="mylab-hud-xp">0</strong>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                '<div class="mylab-hud-right">' +
                    '<div id="mylab-lives-pill" class="mylab-lives-pill" style="display:none;" title="Sisa Kesempatan (Maks. 5 Kesalahan Kecil)">❤️❤️❤️❤️❤️</div>' +
                    '<button type="button" id="btn-lab-protocol" class="mylab-hud-btn protocol-btn" style="display:none;" onclick="window.bukaProsedurPraktikumLab()" title="Buka Panduan Praktikum (Alat, Bahan, & Langkah Kerja)">' +
                        '<span class="hud-ico">📖</span><span class="hud-lbl">Prosedur</span>' +
                    '</button>' +
                    '<button type="button" id="btn-lab-guide" class="mylab-hud-btn guide-btn" style="display:none;" onclick="window.bukaPanduanLab()" title="Buka Referensi Konsep & Tabel Data">' +
                        '<span class="hud-ico">❓</span><span class="hud-lbl">Referensi</span>' +
                    '</button>' +
                    '<button type="button" id="btn-lab-history" class="mylab-hud-btn history-btn" onclick="window.bukaRiwayatLab()" title="Riwayat Praktikum & Perolehan Bintang">' +
                        '<span class="hud-ico">📜</span><span class="hud-lbl">Riwayat</span>' +
                    '</button>' +
                    '<button type="button" id="btn-lab-lobby" class="mylab-hud-btn active" onclick="window.kembaliKeLobiLab()">' +
                        '<span class="hud-ico">📋</span><span class="hud-lbl">Daftar Lab</span>' +
                    '</button>' +
                    '<button type="button" class="mypet-hud-close-btn" onclick="window.tutupModalMyLab()" title="Keluar ke My World">✕</button>' +
                '</div>' +
            '</div>' +

            '<div class="modal-body mylab-body" id="mylab-main-body"></div>' +
            '<div id="mylab-protocol-overlay" class="mylab-guide-overlay" style="display:none;" onclick="if(event.target===this) window.tutupProsedurPraktikumLab()"></div>' +
            '<div id="mylab-guide-overlay" class="mylab-guide-overlay" style="display:none;" onclick="if(event.target===this) window.tutupPanduanLab()"></div>' +
            '<div id="mylab-fail-overlay" class="mylab-guide-overlay" style="display:none;"></div>' +
        '</div>';

    document.body.appendChild(modal);
};

window.perbaruiSaldoHUDLab = function() {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyLab(uName);
    let elCoin = document.getElementById("mylab-hud-coin");
    let elXp = document.getElementById("mylab-hud-xp");

    let coinVal = lb ? Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia || 0) : 0;
    let xpVal = lb ? Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp || 0) : 0;

    if (elCoin) elCoin.innerText = coinVal.toLocaleString("id-ID");
    if (elXp) elXp.innerText = xpVal.toLocaleString("id-ID");
};

window.bukaModalMyLab = function() {
    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        alert("🔒 Silakan login menggunakan akun Siswa terlebih dahulu untuk masuk ke My Lab!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    window.modeKunjunganLab = null;
    window.pastikanUIMyLabAda();
    let uName = sessionStorage.getItem("username");
    window.pastikanStrukturMyLab(uName);

    window.activeLabView = "lobby";
    window.labBloodSession = null;
    window.isMyLabModalOpen = true;

    window.perbaruiSaldoHUDLab();
    window.renderMyLabUI();

    if (typeof window.bukaModal === "function") window.bukaModal("modal-my-lab");
    else {
        let m = document.getElementById("modal-my-lab");
        if (m) m.style.display = "flex";
    }
};

window.bukaModalMyLabKunjungan = function(targetUsername) {
    if (!targetUsername || !window.leaderboardSiswaData || !window.leaderboardSiswaData[targetUsername]) return;
    window.modeKunjunganLab = targetUsername;
    window.pastikanUIMyLabAda();
    window.activeLabView = "lobby";
    window.labBloodSession = null;
    window.isMyLabModalOpen = true;

    window.perbaruiSaldoHUDLab();
    window.renderMyLabUI();

    if (typeof window.bukaModal === "function") window.bukaModal("modal-my-lab");
    else {
        let m = document.getElementById("modal-my-lab");
        if (m) m.style.display = "flex";
    }
};

window.hentikanTimerKulturJaringan = function() {
    if (window._tcSterilTimer) {
        clearInterval(window._tcSterilTimer);
        window._tcSterilTimer = null;
    }
    window._tcKnifeDown = false;
};

window.hentikanTimerDnaLab = function() {
    if (window._dnaHeatTimer) {
        clearInterval(window._dnaHeatTimer);
        window._dnaHeatTimer = null;
    }
};

window.hentikanTimerLabTambahan = function() {
    if (window._gramDecolorTimer) {
        clearInterval(window._gramDecolorTimer);
        window._gramDecolorTimer = null;
    }
    if (window._labFermTickInterval) {
        clearInterval(window._labFermTickInterval);
        window._labFermTickInterval = null;
    }
};

window.tutupModalMyLab = function() {
    window.hentikanTimerKulturJaringan();
    window.hentikanTimerDnaLab();
    window.hentikanTimerLabTambahan();
    window.isMyLabModalOpen = false;
    window.labBloodSession = null;
    window.labMembraneSession = null;
    window.labTissueSession = null;
    window.labDnaSession = null;
    window.labGeneticsSession = null;
    window.labMicroscopeSession = null;
    window.labFoodSession = null;
    window.labGramSession = null;
    window.labFermSession = null;
    window.labProteinSession = null;
    window.labHematoSession = null;
    if (typeof window.tutupModal === "function") window.tutupModal("modal-my-lab");
    else {
        let m = document.getElementById("modal-my-lab");
        if (m) m.style.display = "none";
    }
};

window.kembaliKeLobiLab = function() {
    window.hentikanTimerKulturJaringan();
    window.hentikanTimerDnaLab();
    window.hentikanTimerLabTambahan();
    window.activeLabView = "lobby";
    window.labBloodSession = null;
    window.labMembraneSession = null;
    window.labTissueSession = null;
    window.labDnaSession = null;
    window.labGeneticsSession = null;
    window.labMicroscopeSession = null;
    window.labFoodSession = null;
    window.labGramSession = null;
    window.labFermSession = null;
    window.labProteinSession = null;
    window.labHematoSession = null;
    window.renderMyLabUI();
};

window.tampilkanToastLab = function(pesan, tipe) {
    let t = document.getElementById("mylab-toast-box");
    if (!t) return;
    t.innerHTML = pesan;
    t.className = "mylab-toast-box" + (tipe === "err" ? " is-err" : (tipe === "ok" ? " is-ok" : ""));
    t.style.display = "block";
    clearTimeout(window._labToastTimer);
    window._labToastTimer = setTimeout(function() {
        if (t) t.style.display = "none";
    }, 2400);
};

// =========================================================================
// 3. RENDER LOBI MY LAB (DAFTAR PRAKTIKUM & LEMARI PIALA VISIT)
// =========================================================================
window.renderMyLabUI = function() {
    let body = document.getElementById("mylab-main-body");
    if (!body) return;

    window.perbaruiSaldoHUDLab();

    let btnLobby = document.getElementById("btn-lab-lobby");
    if (btnLobby) btnLobby.classList.toggle("active", window.activeLabView === "lobby");
    let btnGuide = document.getElementById("btn-lab-guide");
    if (btnGuide) btnGuide.style.display = (window.activeLabView !== "lobby") ? "inline-flex" : "none";
    if (window.activeLabView === "lobby" && typeof window.tutupPanduanLab === "function") {
        window.tutupPanduanLab();
    }

    if (window.activeLabView === "blood_test" && window.labBloodSession) {
        window.renderBloodTestStage(body);
        return;
    }
    if (window.activeLabView === "membrane_transport" && window.labMembraneSession) {
        window.renderMembraneStage(body);
        return;
    }
    if (window.activeLabView === "tissue_culture" && window.labTissueSession) {
        window.renderTissueCultureStage(body);
        return;
    }
    if (window.activeLabView === "dna_recomb" && window.labDnaSession) {
        window.renderDnaRecombStage(body);
        return;
    }

    if (window.activeLabView === "genetics_lab" && window.labGeneticsSession) {
        window.renderGeneticsLabStage(body);
        return;
    }
    if (window.activeLabView === "microscope_lab" && window.labMicroscopeSession) {
        window.renderMicroscopeLabStage(body);
        return;
    }
    if (window.activeLabView === "food_test" && window.labFoodSession) {
        window.renderFoodTestStage(body);
        return;
    }
    if (window.activeLabView === "gram_stain" && window.labGramSession) {
        window.renderGramStainStage(body);
        return;
    }
    if (window.activeLabView === "fermentation_lab") {
        window.renderFermentationStage(body);
        return;
    }
    if (window.activeLabView === "protein_synth" && window.labProteinSession) {
        window.renderProteinSynthStage(body);
        return;
    }
    if (window.activeLabView === "hematopoiesis" && window.labHematoSession) {
        window.renderHematopoiesisStage(body);
        return;
    }

    let ctx = window.ambilDataLabAktif();
    let labData = ctx.labData || { records: {}, totalCompleted: 0, totalStars: 0 };
    let records = labData.records || {};

    let totalBintang = 0;
    Object.values(records).forEach(function(r) {
        if (r && r.bestStars) totalBintang += Number(r.bestStars) || 0;
    });

    let bannerHeader = ctx.isVisit
        ? '<div class="lab-lobby-banner is-visit">' +
              '<div>' +
                  '<h3>🏆 Lemari Prestasi Lab: ' + ctx.hostNama + '</h3>' +
                  '<p>Total Praktikum Selesai: <b>' + (labData.totalCompleted || 0) + 'x</b> • Rekor Bintang: <b>⭐ ' + totalBintang + '</b></p>' +
              '</div>' +
              '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:7px 14px;" onclick="window.tutupModalMyLab()">🚪 Kembali ke World</button>' +
          '</div>'
        : '<div class="lab-lobby-banner">' +
              '<div>' +
                  '<h3>🧪 Laboratorium Biologi Interaktif</h3>' +
                  '<p>Ikuti setiap tahapan praktikum dengan teliti untuk meraih <b>⭐⭐⭐</b>, <b>Coin</b>, dan <b>XP Leaderboard</b>!</p>' +
              '</div>' +
              '<div class="lab-trophy-pill">🏆 ' + (labData.totalCompleted || 0) + ' Praktikum • ⭐ ' + totalBintang + '</div>' +
          '</div>';

    let cardsHtml = '';
    window.MY_LAB_CATALOG.experiments.forEach(function(exp) {
        let rec = records[exp.id] || { bestStars: 0, completions: 0 };
        let starsHtml = '';
        for (let s = 1; s <= 3; s++) {
            starsHtml += '<span class="lab-star-ico ' + (s <= (rec.bestStars || 0) ? 'lit' : '') + '">★</span>';
        }

        let isReady = (exp.status === "ready");
        let btnHtml = '';
        if (ctx.isVisit) {
            btnHtml = '<div class="lab-visit-stat">' + (rec.completions > 0 ? ('✓ Diselesaikan ' + rec.completions + 'x') : 'Belum pernah dikerjakan') + '</div>';
        } else if (isReady) {
            btnHtml = '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumLab(\'' + exp.id + '\')">🧪 Mulai Praktikum</button>';
        } else {
            btnHtml = '<button type="button" class="mypet-gray-cta sm" disabled>🔒 Segera Hadir</button>';
        }

        cardsHtml +=
            '<div class="lab-exp-card' + (isReady ? '' : ' is-locked') + '">' +
                '<div class="lab-exp-top">' +
                    '<div class="lab-exp-icon">' + exp.ikon + '</div>' +
                    '<div style="flex:1; min-width:0;">' +
                        '<div class="lab-exp-title">' + exp.judul + '</div>' +
                        '<div class="lab-exp-sub">' + exp.sub + '</div>' +
                    '</div>' +
                    '<div class="lab-stars-row" title="Rekor Bintang Terbaik">' + starsHtml + '</div>' +
                '</div>' +
                '<p class="lab-exp-desc">' + exp.deskripsi + '</p>' +
                '<div class="lab-exp-footer">' +
                    '<span class="lab-reward-tag">🎁 Maks. +🪙 ' + exp.rewardMaxCoin + ' & +⭐ ' + exp.rewardMaxXp + ' XP</span>' +
                    (rec.completions > 0 && !ctx.isVisit ? '<span class="lab-done-chip">✓ ' + rec.completions + 'x</span>' : '') +
                '</div>' +
                btnHtml +
            '</div>';
    });

    body.innerHTML =
        '<div class="lab-lobby-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            bannerHeader +
            '<div class="lab-exp-grid">' + cardsHtml + '</div>' +
        '</div>';
};

window.mulaiPraktikumLab = function(expId) {
    if (expId === "genetics_lab") {
        window.mulaiPraktikumGenetika();
    } else if (expId === "microscope_lab") {
        window.mulaiPraktikumMikroskop();
    } else if (expId === "blood_test") {
        window.mulaiPraktikumGolonganDarah();
    } else if (expId === "membrane_transport") {
        window.mulaiPraktikumTransporMembran();
    } else if (expId === "tissue_culture") {
        window.mulaiPraktikumKulturJaringan();
    } else if (expId === "dna_recomb") {
        window.mulaiPraktikumRekombinasiDNA();
    } else if (expId === "food_test") {
        window.mulaiPraktikumUjiMakanan();
    } else if (expId === "gram_stain") {
        window.mulaiPraktikumPewarnaanGram();
    } else if (expId === "fermentation_lab") {
        window.bukaPraktikumFermentasi();
    } else if (expId === "protein_synth") {
        window.mulaiPraktikumSintesisProtein();
    } else if (expId === "hematopoiesis") {
        window.mulaiPraktikumHematopoesis();
    }
};

// =========================================================================
// 4. PRAKTIKUM 1: TES GOLONGAN DARAH (ABO & RHESUS — 4 TAHAP COOKING MAMA)
// =========================================================================
window.buatSoalAnalisisDarah = function(bt) {
    let semuaTipe = window.MY_LAB_CATALOG.bloodTypes;
    let pilihTipeSoal = Math.random() > 0.5 ? "antigen" : "donor";

    if (pilihTipeSoal === "antigen") {
        let distractors = semuaTipe.filter(function(x) { return x.antigen !== bt.antigen; })
            .map(function(x) { return x.antigen; });
        let unik = Array.from(new Set(distractors)).sort(function() { return Math.random() - 0.5; }).slice(0, 3);
        let opts = unik.concat([bt.antigen]).sort(function() { return Math.random() - 0.5; });
        return {
            pertanyaan: "Berdasarkan hasil uji, aglutinogen (antigen) yang terdapat pada membran sel darah merah pasien adalah...",
            options: opts,
            correctIdx: opts.indexOf(bt.antigen)
        };
    }

    let distractorsD = semuaTipe.filter(function(x) { return x.donorAman !== bt.donorAman; })
        .map(function(x) { return x.donorAman; });
    let unikD = Array.from(new Set(distractorsD)).sort(function() { return Math.random() - 0.5; }).slice(0, 3);
    let optsD = unikD.concat([bt.donorAman]).sort(function() { return Math.random() - 0.5; });
    return {
        pertanyaan: "Jika pasien ini memerlukan transfusi sel darah merah, golongan donor manakah yang paling aman?",
        options: optsD,
        correctIdx: optsD.indexOf(bt.donorAman)
    };
};

window.mulaiPraktikumGolonganDarah = function() {
    let btList = window.MY_LAB_CATALOG.bloodTypes;
    let chosenBT = btList[Math.floor(Math.random() * btList.length)];
    let pNames = window.MY_LAB_CATALOG.patientNames;
    let namaPasien = pNames[Math.floor(Math.random() * pNames.length)] + " #" + Math.floor(100 + Math.random() * 899);

    window.labBloodSession = {
        step: 1, // 1: Tetes Darah, 2: Tetes Serum, 3: Aduk Aseptis, 4: Diagnosis, 5: Hasil Bintang
        patientName: namaPasien,
        blood: chosenBT,
        wells: {
            antiA:  { blood: false, reagent: false, stirPct: 0, done: false, agglutinated: chosenBT.antiA },
            antiB:  { blood: false, reagent: false, stirPct: 0, done: false, agglutinated: chosenBT.antiB },
            antiAB: { blood: false, reagent: false, stirPct: 0, done: false, agglutinated: chosenBT.antiAB },
            antiD:  { blood: false, reagent: false, stirPct: 0, done: false, agglutinated: chosenBT.antiD }
        },
        selectedReagent: "antiA",
        stickState: "clean", // 'clean' | 'used'
        stickUsedWell: "",
        mistakes: 0,
        pickedType: "",
        pickedAnalysisIdx: -1,
        analysisQuiz: window.buatSoalAnalisisDarah(chosenBT),
        resultData: null
    };

    window.activeLabView = "blood_test";
    window.renderMyLabUI();
};

window.bangunHTMLSumurDarah = function(wellKey, reagentCfg, wellState, mode, extraClickAttr) {
    let innerDrop = '';
    if (wellState.blood) {
        let isAggl = wellState.done && wellState.agglutinated;
        let isSmooth = wellState.done && !wellState.agglutinated;
        let reagentTint = wellState.reagent ? ('<div class="lab-reagent-ring" style="border-color:' + reagentCfg.dropCol + ';"></div>') : '';
        let clumpHtml = '';

        if (isAggl) {
            clumpHtml =
                '<div class="lab-aggl-clumps">' +
                    '<span style="left:22%; top:24%; width:11px; height:9px;"></span>' +
                    '<span style="left:54%; top:20%; width:13px; height:10px;"></span>' +
                    '<span style="left:36%; top:48%; width:14px; height:11px;"></span>' +
                    '<span style="left:66%; top:54%; width:11px; height:10px;"></span>' +
                    '<span style="left:24%; top:66%; width:10px; height:8px;"></span>' +
                    '<span style="left:50%; top:72%; width:12px; height:9px;"></span>' +
                    '<span style="left:70%; top:34%; width:8px; height:8px;"></span>' +
                '</div>';
        }

        let dropClass = 'lab-blood-pool' + (isAggl ? ' is-clumped' : (isSmooth ? ' is-smooth' : ''));
        innerDrop = '<div class="' + dropClass + '">' + reagentTint + clumpHtml + '</div>';
    }

    let stirRing = (mode === "stir" && !wellState.done)
        ? '<div class="lab-stir-pct" id="lab-stir-pct-' + wellKey + '">' + Math.round(wellState.stirPct) + '%</div>'
        : (wellState.done && mode === "stir" ? '<div class="lab-stir-done">✓</div>' : '');

    return (
        '<div class="lab-well-slot" data-well="' + wellKey + '"' + (extraClickAttr || '') + '>' +
            '<div class="lab-well-label" style="background:' + reagentCfg.softBg + '; color:' + reagentCfg.color + '; border-color:' + reagentCfg.color + ';">' + reagentCfg.label + '</div>' +
            '<div class="lab-well-circle" id="lab-well-circle-' + wellKey + '">' +
                innerDrop +
                stirRing +
            '</div>' +
        '</div>'
    );
};

window.renderBloodTestStage = function(bodyEl) {
    let s = window.labBloodSession;
    if (!s) return;

    let stepNames = ["1. Tetes Darah", "2. Tetes Serum", "3. Aduk Aseptis", "4. Diagnosis"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">🧑‍⚕️ ' + s.patientName + '</span></div>';

    let stageContent = '';

    // --- TAHAP 1: TETESKAN SAMPEL DARAH KE 4 SUMUR ---
    if (s.step === 1) {
        let filled = Object.values(s.wells).filter(function(w) { return w.blood; }).length;
        let wellsHtml = '';
        window.MY_LAB_CATALOG.reagents.forEach(function(r) {
            wellsHtml += window.bangunHTMLSumurDarah(r.key, r, s.wells[r.key], "blood", ' onclick="window.aksiTetesDarahSumur(\'' + r.key + '\')"');
        });

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🩸 Tahap 1: Teteskan Sampel Darah Pasien (' + filled + '/4)</strong>' +
                '<span>Ketuk masing-masing dari 4 sumur kaca objek di bawah ini untuk meneteskan darah segar pasien!</span>' +
            '</div>' +
            '<div class="lab-glass-slide">' + wellsHtml + '</div>' +
            '<div class="lab-tool-tray">' +
                '<div class="lab-active-tool-chip">💉 Pipet Sampel Darah Pasien (Aktif — Ketuk 4 lingkaran di atas)</div>' +
            '</div>';
    }

    // --- TAHAP 2: TETESKAN SERUM ANTI-A, ANTI-B, ANTI-AB, ANTI-D ---
    else if (s.step === 2) {
        let doneCount = Object.values(s.wells).filter(function(w) { return w.reagent; }).length;
        let wellsHtml = '';
        window.MY_LAB_CATALOG.reagents.forEach(function(r) {
            wellsHtml += window.bangunHTMLSumurDarah(r.key, r, s.wells[r.key], "reagent", ' onclick="window.aksiTetesSerumSumur(\'' + r.key + '\')"');
        });

        let bottlesHtml = '';
        window.MY_LAB_CATALOG.reagents.forEach(function(r) {
            let sudah = s.wells[r.key].reagent;
            let aktif = (s.selectedReagent === r.key && !sudah);
            bottlesHtml +=
                '<button type="button" class="lab-reagent-bottle' + (aktif ? ' is-selected' : '') + (sudah ? ' is-done' : '') + '" ' +
                    'style="border-color:' + r.color + ';" ' + (sudah ? 'disabled' : '') +
                    ' onclick="window.pilihBotolSerumLab(\'' + r.key + '\')">' +
                    '<div class="bottle-cap" style="background:' + r.color + ';"></div>' +
                    '<div class="bottle-body" style="background:' + r.softBg + '; color:' + r.color + ';">' +
                        '<b>' + r.label + '</b>' +
                        '<small>' + (sudah ? '✓ Selesai' : (aktif ? 'Pipet Siap' : 'Pilih')) + '</small>' +
                    '</div>' +
                '</button>';
        });

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>💧 Tahap 2: Teteskan Serum Reagen (' + doneCount + '/4)</strong>' +
                '<span>Pilih botol serum di bawah, lalu ketuk sumur kaca objek dengan label yang <b>cocok</b>!</span>' +
            '</div>' +
            '<div class="lab-glass-slide">' + wellsHtml + '</div>' +
            '<div class="lab-bottles-row">' + bottlesHtml + '</div>';
    }

    // --- TAHAP 3: PENGADUKAN ASEPTIS (WAJIB GANTI TUSUK GIGI STERIL) ---
    else if (s.step === 3) {
        let stirredCount = Object.values(s.wells).filter(function(w) { return w.done; }).length;
        let wellsHtml = '';
        window.MY_LAB_CATALOG.reagents.forEach(function(r) {
            let attr = ' onpointerdown="window.mulaiAdukSumurLab(event, \'' + r.key + '\')"';
            wellsHtml += window.bangunHTMLSumurDarah(r.key, r, s.wells[r.key], "stir", attr);
        });

        let isClean = (s.stickState === "clean");
        let stickBar =
            '<div class="lab-stick-tray">' +
                '<div class="lab-stick-status ' + (isClean ? 'clean' : 'dirty') + '">' +
                    (isClean
                        ? '🥢 Tusuk Gigi: <b>STERIL</b> (Siap mengaduk 1 sumur!)'
                        : '⚠️ Tusuk Gigi: <b>BEKAS PAKAI</b> — Wajib ambil yang baru sebelum pindah sumur!') +
                '</div>' +
                '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:8px 16px;" onclick="window.ambilTusukGigiSterilLab()">🥢 Ambil Tusuk Gigi Steril</button>' +
            '</div>';

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🌀 Tahap 3: Aduk Setiap Sumur Secara Aseptis (' + stirredCount + '/4)</strong>' +
                '<span>Gosok memutar (atau ketuk cepat) di dalam lingkaran darah sampai <b>100%</b>. Ganti tusuk gigi steril tiap pindah sumur!</span>' +
            '</div>' +
            '<div class="lab-glass-slide is-stir-mode">' + wellsHtml + '</div>' +
            stickBar;
    }

    // --- TAHAP 4: PEMBACAAN AGLUTINASI & DIAGNOSIS ---
    else if (s.step === 4) {
        let wellsHtml = '';
        window.MY_LAB_CATALOG.reagents.forEach(function(r) {
            wellsHtml += window.bangunHTMLSumurDarah(r.key, r, s.wells[r.key], "read", "");
        });

        let typeBtns = '';
        window.MY_LAB_CATALOG.bloodTypes.forEach(function(bt) {
            let act = (s.pickedType === bt.type) ? " is-picked" : "";
            typeBtns += '<button type="button" class="lab-diag-pill' + act + '" onclick="window.pilihDiagnosisGolDarah(\'' + bt.type + '\')">' + bt.type + '</button>';
        });

        let letters = ["A", "B", "C", "D"];
        let quizOpts = '';
        s.analysisQuiz.options.forEach(function(txt, i) {
            let act = (s.pickedAnalysisIdx === i) ? " is-picked" : "";
            quizOpts += '<button type="button" class="lab-analysis-opt' + act + '" onclick="window.pilihAnalisisGolDarah(' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>';
        });

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🔍 Tahap 4: Amati Aglutinasi (Gumpalan) & Buat Diagnosis</strong>' +
                '<span>Perhatikan sumur mana yang <b>menggumpal berbintik</b> (aglutinasi) dan mana yang tetap <b>halus cair</b>!</span>' +
            '</div>' +
            '<div class="lab-glass-slide is-read-mode">' + wellsHtml + '</div>' +
            '<div class="lab-diag-panel">' +
                '<div class="lab-diag-block">' +
                    '<label>1. Tentukan Golongan Darah Pasien:</label>' +
                    '<div class="lab-diag-pills-grid">' + typeBtns + '</div>' +
                '</div>' +
                '<div class="lab-diag-block">' +
                    '<label>2. ' + s.analysisQuiz.pertanyaan + '</label>' +
                    '<div class="lab-analysis-opts-grid">' + quizOpts + '</div>' +
                '</div>' +
                '<button type="button" class="mypet-green-cta" onclick="window.selesaikanDiagnosisDarah()">📋 Serahkan Laporan Praktikum</button>' +
            '</div>';
    }

    // --- TAHAP 5: LAYAR HASIL BINTANG ALA COOKING MAMA ---
    else if (s.step === 5 && s.resultData) {
        let res = s.resultData;
        let bt = s.blood;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) {
            starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        }

        let summaryRows = window.MY_LAB_CATALOG.reagents.map(function(r) {
            let isClump = Boolean(bt[r.key]);
            return '<div class="lab-sum-chip ' + (isClump ? 'clump' : 'smooth') + '">' +
                '<b>' + r.label + '</b>: ' + (isClump ? '🔴 Menggumpal (+)' : '⚪ Cair Halus (−)') +
            '</div>';
        }).join("");

        stageContent =
            '<div class="lab-result-card">' +
                '<div class="lab-result-stars-wrap">' + starsBig + '</div>' +
                '<h3 class="lab-result-title">' + res.predikat + '</h3>' +
                '<div class="lab-result-rewards">' +
                    '<span>🪙 <b>+' + res.coin + ' Coin</b></span>' +
                    '<span>⭐ <b>+' + res.xp + ' XP</b></span>' +
                    '<span>🎯 Skor: <b>' + res.score + '/100</b></span>' +
                '</div>' +
                '<div class="lab-result-explain">' +
                    '<div><b>🩸 Hasil Resmi Pasien ' + s.patientName + ': Golongan Darah <span style="color:#dc2626; font-size:15px;">' + bt.type + '</span></b></div>' +
                    '<div class="lab-sum-chips-row">' + summaryRows + '</div>' +
                    '<div style="font-size:12px; color:#334155; margin-top:6px; line-height:1.45;">' +
                        '• <b>Aglutinogen:</b> ' + bt.antigen + '<br>' +
                        '• <b>Aglutinin Plasma:</b> ' + bt.aglutinin + '<br>' +
                        '• <b>Donor Aman:</b> ' + bt.donorAman + '<br>' +
                        '• <b>Diagnosis Kamu:</b> ' + (res.typeOk ? '✅ Tepat (' + s.pickedType + ')' : '❌ ' + s.pickedType + ' (Seharusnya ' + bt.type + ')') +
                        ' • <b>Analisis:</b> ' + (res.analysisOk ? '✅ Benar' : '❌ Kurang Tepat') +
                    '</div>' +
                '</div>' +
                '<div style="display:flex; gap:8px; width:100%; max-width:420px; margin-top:10px;">' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumGolonganDarah()">🔄 Uji Pasien Baru</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
                '</div>' +
            '</div>';
    }

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            stepperHtml +
            stageContent +
        '</div>';
};

// --- AKSI TAHAP 1: TETES DARAH ---
window.aksiTetesDarahSumur = function(wellKey) {
    let s = window.labBloodSession;
    if (!s || s.step !== 1 || !s.wells[wellKey]) return;
    if (s.wells[wellKey].blood) return;

    s.wells[wellKey].blood = true;
    let semuaPenuh = Object.values(s.wells).every(function(w) { return w.blood; });
    window.renderMyLabUI();

    if (semuaPenuh) {
        window.tampilkanToastLab("✅ Bagus! Semua 4 sumur terisi darah. Lanjut Tahap 2!", "ok");
        setTimeout(function() {
            if (window.labBloodSession && window.labBloodSession.step === 1) {
                window.labBloodSession.step = 2;
                window.labBloodSession.selectedReagent = "antiA";
                window.renderMyLabUI();
            }
        }, 700);
    }
};

// --- AKSI TAHAP 2: PILIH BOTOL & TETES SERUM ---
window.pilihBotolSerumLab = function(reagentKey) {
    let s = window.labBloodSession;
    if (!s || s.step !== 2) return;
    s.selectedReagent = reagentKey;
    window.renderMyLabUI();
};

window.aksiTetesSerumSumur = function(wellKey) {
    let s = window.labBloodSession;
    if (!s || s.step !== 2 || !s.wells[wellKey]) return;
    if (s.wells[wellKey].reagent) return;

    let selected = s.selectedReagent;
    if (!selected) {
        window.tampilkanToastLab("👆 Pilih salah satu botol serum di bawah terlebih dahulu!", "err");
        return;
    }

    if (selected !== wellKey) {
        s.mistakes++;
        let cfgSel = window.MY_LAB_CATALOG.reagents.find(function(r) { return r.key === selected; });
        let cfgWell = window.MY_LAB_CATALOG.reagents.find(function(r) { return r.key === wellKey; });
        window.tampilkanToastLab("⚠️ Salah sumur! Serum <b>" + (cfgSel ? cfgSel.label : "") + "</b> harus diteteskan ke sumur <b>" + (cfgSel ? cfgSel.label : "") + "</b>, bukan " + (cfgWell ? cfgWell.label : "") + "!", "err");
        return;
    }

    s.wells[wellKey].reagent = true;

    // Otomatis pindah ke botol berikutnya yang belum dipakai agar praktis
    let nextBottle = window.MY_LAB_CATALOG.reagents.find(function(r) { return !s.wells[r.key].reagent; });
    s.selectedReagent = nextBottle ? nextBottle.key : "";

    let semuaTetes = Object.values(s.wells).every(function(w) { return w.reagent; });
    window.renderMyLabUI();

    if (semuaTetes) {
        window.tampilkanToastLab("✅ Tepat! Keempat serum sudah diteteskan. Lanjut Pengadukan Aseptis!", "ok");
        setTimeout(function() {
            if (window.labBloodSession && window.labBloodSession.step === 2) {
                window.labBloodSession.step = 3;
                window.labBloodSession.stickState = "clean";
                window.labBloodSession.stickUsedWell = "";
                window.renderMyLabUI();
            }
        }, 750);
    }
};

// --- AKSI TAHAP 3: PENGADUKAN ASEPTIS (POINTER MOVE + TAP) ---
window.ambilTusukGigiSterilLab = function() {
    let s = window.labBloodSession;
    if (!s || s.step !== 3) return;
    s.stickState = "clean";
    s.stickUsedWell = "";
    window.renderMyLabUI();
    window.tampilkanToastLab("🥢 Tusuk gigi steril baru siap dipakai!", "ok");
};

window.tambahProgresAdukSumur = function(wellKey, tambahPct) {
    let s = window.labBloodSession;
    if (!s || s.step !== 3 || !s.wells[wellKey]) return;
    let w = s.wells[wellKey];
    if (w.done) return;

    w.stirPct = Math.min(100, (Number(w.stirPct) || 0) + tambahPct);
    let pctEl = document.getElementById("lab-stir-pct-" + wellKey);
    if (pctEl) pctEl.innerText = Math.round(w.stirPct) + "%";

    let circleEl = document.getElementById("lab-well-circle-" + wellKey);
    if (circleEl) {
        circleEl.classList.add("is-stirring");
        clearTimeout(circleEl._stirAnimT);
        circleEl._stirAnimT = setTimeout(function() { circleEl.classList.remove("is-stirring"); }, 180);
    }

    if (w.stirPct >= 100) {
        w.done = true;
        s.stickState = "used";
        window._labStirPointer.active = false;

        let semuaSelesai = Object.values(s.wells).every(function(item) { return item.done; });
        window.renderMyLabUI();

        if (semuaSelesai) {
            window.tampilkanToastLab("🔬 Reaksi selesai! Mari amati aglutinasi & diagnosis pasien!", "ok");
            setTimeout(function() {
                if (window.labBloodSession && window.labBloodSession.step === 3) {
                    window.labBloodSession.step = 4;
                    window.renderMyLabUI();
                }
            }, 900);
        } else {
            window.tampilkanToastLab("✓ Sumur selesai diaduk! Jangan lupa <b>ambil tusuk gigi steril baru</b> sebelum pindah sumur.", "ok");
        }
    }
};

window.mulaiAdukSumurLab = function(e, wellKey) {
    let s = window.labBloodSession;
    if (!s || s.step !== 3 || !s.wells[wellKey]) return;
    let w = s.wells[wellKey];
    if (w.done) return;

    e.preventDefault();
    e.stopPropagation();

    // Cek kontaminasi silang: jika tusuk gigi sudah dipakai di sumur lain
    if (s.stickState === "used" && s.stickUsedWell !== wellKey) {
        s.mistakes++;
        window.tampilkanToastLab("⚠️ KONTAMINASI SILANG! Klik <b>🥢 Ambil Tusuk Gigi Steril</b> dulu sebelum mengaduk sumur lain!", "err");
        return;
    }

    s.stickUsedWell = wellKey;
    window._labStirPointer = {
        active: true,
        wellKey: wellKey,
        lastX: e.clientX,
        lastY: e.clientY
    };

    // Tambah +22% setiap ketukan agar nyaman dipakai baik dengan gosok maupun tap cepat
    window.tambahProgresAdukSumur(wellKey, 22);
};

document.addEventListener("pointermove", function(e) {
    let st = window._labStirPointer;
    if (!st || !st.active) return;
    if (!window.labBloodSession || window.labBloodSession.step !== 3) {
        st.active = false;
        return;
    }
    let dist = Math.hypot(e.clientX - st.lastX, e.clientY - st.lastY);
    if (dist >= 4) {
        st.lastX = e.clientX;
        st.lastY = e.clientY;
        window.tambahProgresAdukSumur(st.wellKey, dist * 0.45);
    }
});

document.addEventListener("pointerup", function() {
    if (window._labStirPointer) window._labStirPointer.active = false;
});
document.addEventListener("pointercancel", function() {
    if (window._labStirPointer) window._labStirPointer.active = false;
});

// --- AKSI TAHAP 4: DIAGNOSIS & SIMPAN SKOR ---
window.pilihDiagnosisGolDarah = function(typeStr) {
    if (!window.labBloodSession || window.labBloodSession.step !== 4) return;
    window.labBloodSession.pickedType = typeStr;
    window.renderMyLabUI();
};

window.pilihAnalisisGolDarah = function(optIdx) {
    if (!window.labBloodSession || window.labBloodSession.step !== 4) return;
    window.labBloodSession.pickedAnalysisIdx = optIdx;
    window.renderMyLabUI();
};

window.selesaikanDiagnosisDarah = function() {
    let s = window.labBloodSession;
    if (!s || s.step !== 4) return;

    if (!s.pickedType) {
        return window.tampilkanToastLab("👆 Pilih diagnosis golongan darah pasien terlebih dahulu!", "err");
    }
    if (s.pickedAnalysisIdx < 0) {
        return window.tampilkanToastLab("👆 Jawab pertanyaan analisis biologi nomor 2 terlebih dahulu!", "err");
    }

    let typeOk = (s.pickedType === s.blood.type);
    let analysisOk = (s.pickedAnalysisIdx === s.analysisQuiz.correctIdx);

    let score = 100;
    score -= Math.min(30, s.mistakes * 10);
    if (!typeOk) score -= 35;
    if (!analysisOk) score -= 20;
    score = Math.max(20, score);

    let stars = 1;
    let predikat = "Perlu Lebih Teliti Lagi!";
    let coinGain = 25;
    let xpGain = 12;

    if (score >= 85 && typeOk && analysisOk) {
        stars = 3;
        predikat = "🌟 Analis Lab Sempurna!";
        coinGain = 80;
        xpGain = 40;
    } else if (score >= 60 && typeOk) {
        stars = 2;
        predikat = "👍 Asisten Lab Hebat!";
        coinGain = 50;
        xpGain = 25;
    }

    s.resultData = {
        score: score,
        stars: stars,
        predikat: predikat,
        coin: coinGain,
        xp: xpGain,
        typeOk: typeOk,
        analysisOk: analysisOk
    };

    // Simpan pencapaian & hadiah Coin + XP ke profil siswa
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyLab(uName);
    if (lb && lb.myLabData) {
        let rec = lb.myLabData.records.blood_test || { bestStars: 0, completions: 0, lastAt: 0 };
        rec.bestStars = Math.max(Number(rec.bestStars) || 0, stars);
        rec.completions = (Number(rec.completions) || 0) + 1;
        rec.lastAt = Date.now();
        lb.myLabData.records.blood_test = rec;
        lb.myLabData.totalCompleted = (Number(lb.myLabData.totalCompleted) || 0) + 1;

        let totBintang = 0;
        Object.values(lb.myLabData.records).forEach(function(r) {
            if (r && r.bestStars) totBintang += Number(r.bestStars) || 0;
        });
        lb.myLabData.totalStars = totBintang;

        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + coinGain;
        lb.xpTersedia = lb.coin;
        lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + xpGain;
        lb.xp = lb.xpTotal;

        window.simpanDataLabKeServer(lb);
        if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
        if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
        if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    }

    s.step = 5;
    window.renderMyLabUI();
};

document.addEventListener("DOMContentLoaded", function() {
    window.pastikanUIMyLabAda();
});
// =========================================================================
// 5. PRAKTIKUM 2: TRANSPOR MEMBRAN & OSMOSIS (KONSENTRASI SEL MISTERI)
// =========================================================================
window.MY_LAB_MEMBRANE_SPECIMENS = {
    eritrosit: {
        id: "eritrosit",
        nama: "Eritrosit (Sel Darah Merah)",
        jenis: "Sel Hewan (Tanpa Dinding Sel)",
        zatLarutan: "NaCl (Garam)",
        ikon: "🩸",
        secretPool: [0.6, 0.8, 0.9, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0],
        qPhenom: "Berdasarkan hasil mikroskop pada Eritrosit, apa nama peristiwa yang terjadi saat larutan jauh lebih encer (hipotonis) dan saat lebih pekat (hipertonis)?",
        phenomOpts: [
            "Hemolisis (pecah) saat hipotonis, dan Krenasi (mengkerut) saat hipertonis",
            "Krenasi (mengkerut) saat hipotonis, dan Hemolisis (pecah) saat hipertonis",
            "Turgid (tegang) saat hipotonis, dan Plasmolisis saat hipertonis",
            "Plasmolisis saat hipotonis, dan Krenasi saat hipertonis"
        ],
        phenomAns: 0,
        penjelasanRingkas: "Eritrosit tidak memiliki dinding sel, sehingga masuknya air berlebih pada larutan hipotonis membuatnya menggembung hingga pecah (hemolisis), sedangkan keluarnya air pada larutan hipertonis membuatnya mengkerut bergerigi (krenasi)."
    },
    rhoeo: {
        id: "rhoeo",
        nama: "Epidermis Rhoeo discolor",
        jenis: "Sel Tumbuhan (Memiliki Dinding Sel)",
        zatLarutan: "Sukrosa (Gula)",
        ikon: "🌿",
        secretPool: [0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4],
        qPhenom: "Pada percobaan sel tumbuhan Rhoeo discolor, apa perbedaan utama respons sel saat berada di larutan sangat encer (hipotonis) vs sangat pekat (hipertonis)?",
        phenomOpts: [
            "Menjadi Turgid (penuh & tidak pecah karena dinding sel) saat hipotonis, dan Plasmolisis (membran lepas dari dinding sel) saat hipertonis",
            "Mengalami Hemolisis (pecah) saat hipotonis, dan Krenasi saat hipertonis",
            "Mengalami Plasmolisis saat hipotonis, dan Turgid saat hipertonis",
            "Dinding sel ikut mengkerut dan hancur saat terkena larutan hipertonis"
        ],
        phenomAns: 0,
        penjelasanRingkas: "Sel tumbuhan memiliki dinding sel selulosa yang kaku sehingga tahan terhadap tekanan turgor (turgid, tidak pecah saat hipotonis). Pada larutan hipertonis, air keluar dari vakuola sehingga protoplasma ungu menyusut dan membran terlepas dari dinding sel (plasmolisis)."
    }
};

window.MY_LAB_OSMOSIS_CONCLUSIONS = [
    "Air (pelarut) berpindah melalui membran semipermeabel dari larutan berkonsentrasi zat terlarut rendah (hipotonis) ke konsentrasi tinggi (hipertonis); sel stabil tanpa perubahan volume saat konsentrasi larutan luar sama dengan dalam sel (isotonis).",
    "Zat terlarut (garam/gula) berpindah bebas dari larutan encer ke larutan pekat hingga sel selalu mengecil pada semua konsentrasi.",
    "Air berpindah dari larutan berkonsentrasi zat terlarut tinggi (hipertonis) menuju larutan berkonsentrasi zat terlarut rendah (hipotonis).",
    "Osmosis tidak dipengaruhi oleh perbedaan konsentrasi larutan luar dan dalam sel, melainkan hanya oleh cahaya mikroskop."
];

window.bulatkanSatuDesimalLab = function(val) {
    return Math.round((Number(val) || 0) * 10) / 10;
};

window.mulaiPraktikumTransporMembran = function(presetSpecId) {
    let specId = (presetSpecId && window.MY_LAB_MEMBRANE_SPECIMENS[presetSpecId]) ? presetSpecId : "eritrosit";
    let spec = window.MY_LAB_MEMBRANE_SPECIMENS[specId];
    let secretVal = spec.secretPool[Math.floor(Math.random() * spec.secretPool.length)];

    // Acak urutan opsi Q2 & Q3 sambil melacak indeks kunci jawaban yang benar
    let acakDenganKunci = function(arr, ansIdx) {
        let tagged = arr.map(function(txt, i) { return { txt: txt, isOk: i === ansIdx }; });
        tagged.sort(function() { return Math.random() - 0.5; });
        return {
            opts: tagged.map(function(x) { return x.txt; }),
            ans: tagged.findIndex(function(x) { return x.isOk; })
        };
    };

    let qPhenomMix = acakDenganKunci(spec.phenomOpts, spec.phenomAns);
    let qConclMix = acakDenganKunci(window.MY_LAB_OSMOSIS_CONCLUSIONS, 0);

    window.labMembraneSession = {
        step: 1, // 1: Siapkan Preparat, 2: Fokus Mikroskop, 3: Uji Konsentrasi, 4: Analisis & Kesimpulan, 5: Hasil
        specId: specId,
        secretConc: secretVal,
        prepPlaced: false,
        prepCovered: false,
        // Fokus mikroskop
        targetMacro: 25 + Math.floor(Math.random() * 51),
        targetMicro: 25 + Math.floor(Math.random() * 51),
        macroVal: 5,
        microVal: 10,
        // Uji konsentrasi
        sliderConc: 1.5,
        testedConc: null,
        logs: [],
        // Jawaban Tahap 4
        guessConc: 1.0,
        pickedPhenomIdx: -1,
        pickedConclIdx: -1,
        qPhenom: { q: spec.qPhenom, opts: qPhenomMix.opts, ans: qPhenomMix.ans },
        qConcl: { opts: qConclMix.opts, ans: qConclMix.ans },
        resultData: null
    };

    window.activeLabView = "membrane_transport";
    window.renderMyLabUI();
};

window.pilihSpesimenMembranLab = function(specId) {
    if (!window.MY_LAB_MEMBRANE_SPECIMENS[specId]) return;
    window.mulaiPraktikumTransporMembran(specId);
};

window.hitungKejelasanFokusMikroskop = function(s) {
    let errMacro = Math.abs((Number(s.macroVal) || 0) - s.targetMacro);
    let errMicro = Math.abs((Number(s.microVal) || 0) - s.targetMicro);
    let weightedErr = (errMacro * 0.72) + (errMicro * 0.28);
    let clarity = Math.max(0, Math.min(100, Math.round(100 - weightedErr * 1.85)));
    let blurPx = Number(((100 - clarity) * 0.13).toFixed(2));
    return { clarity: clarity, blurPx: blurPx, isSharp: clarity >= 92 };
};

window.evaluasiKondisiSelOsmosis = function(specId, concExt, secretConc) {
    if (concExt === null || concExt === undefined) {
        return {
            state: "normal",
            label: "Belum Ditetesi Larutan",
            volPct: 100,
            volText: "100%",
            waterDir: "none",
            waterLabel: "Menunggu tetesan larutan...",
            desc: "Atur konsentrasi larutan di bawah, lalu tekan Teteskan Larutan untuk mengamati respons sel."
        };
    }

    let diff = window.bulatkanSatuDesimalLab(concExt - secretConc);
    let isPlant = (specId === "rhoeo");

    // 1. ISOTONIS (Titik Kesetimbangan)
    if (Math.abs(diff) <= 0.05) {
        return {
            state: "isotonic",
            label: "Stabil / Seimbang",
            volPct: 100,
            volText: "100%",
            waterDir: "balanced",
            waterLabel: "⇄ Air masuk = Air keluar",
            desc: isPlant
                ? "Protoplasma ungu mengisi ruang dinding sel secara normal tanpa menekan berlebihan maupun terlepas."
                : "Sel berbentuk cakram bikonkaf normal dengan volume stabil (100%). Tidak ada perubahan netto!"
        };
    }

    // 2. HIPOTONIS (Larutan luar lebih encer -> Air masuk ke dalam sel)
    if (diff < 0) {
        let absD = Math.abs(diff);
        if (!isPlant && absD >= 0.5) {
            return {
                state: "lysis",
                label: "Pecah (Hemolisis!)",
                volPct: 150,
                volText: "PECAH",
                waterDir: "in-fast",
                waterLabel: "➔➔ Air masuk deras!",
                desc: "Air masuk sangat deras hingga membran eritrosit tidak kuat menahan tekanan dan pecah (lisis)!"
            };
        }
        let vol = Math.min(isPlant ? 116 : 138, Math.round(100 + absD * (isPlant ? 20 : 65)));
        if (isPlant && absD >= 0.3) {
            return {
                state: "turgid",
                label: "Menggembung Penuh (Turgid)",
                volPct: vol,
                volText: vol + "%",
                waterDir: "in-fast",
                waterLabel: "➔➔ Air masuk ke vakuola",
                desc: "Vakuola ungu membesar penuh dan menekan dinding sel dengan kuat (tekanan turgor tinggi), namun sel tetap kokoh dan tidak pecah."
            };
        }
        return {
            state: "swell",
            label: "Sedikit Mengembang",
            volPct: vol,
            volText: vol + "%",
            waterDir: "in",
            waterLabel: "➔ Air mulai masuk",
            desc: "Sel tampak sedikit membesar dari ukuran normal — larutan luar masih sedikit lebih encer daripada isi sel."
        };
    }

    // 3. HIPERTONIS (Larutan luar lebih pekat -> Air keluar dari sel)
    let shrinkMag = Math.min(1, diff / 1.2);
    let volShrink = Math.max(54, Math.round(100 - diff * 34));
    if (diff >= 0.3) {
        return {
            state: isPlant ? "plasmolysis" : "crenation",
            label: isPlant ? "Membran Lepas (Plasmolisis)" : "Mengkerut Bergerigi (Krenasi)",
            volPct: volShrink,
            volText: volShrink + "%",
            shrinkMag: shrinkMag,
            waterDir: "out-fast",
            waterLabel: "←← Air keluar deras!",
            desc: isPlant
                ? "Air keluar dari vakuola sehingga protoplasma ungu menyusut ke tengah dan terlepas jelas dari dinding sel!"
                : "Air keluar meninggalkan eritrosit hingga volume menyusut drastis dan tepi membran berkerut tajam!"
        };
    }
    return {
        state: "shrink-mild",
        label: "Mulai Menyusut Tipis",
        volPct: volShrink,
        volText: volShrink + "%",
        shrinkMag: shrinkMag,
        waterDir: "out",
        waterLabel: "← Air mulai keluar",
        desc: "Sel mulai sedikit mengecil — larutan luar sedikit lebih pekat daripada konsentrasi di dalam sel."
    };
};

// Generator Visual Lensa Mikroskop Interaktif (Eritrosit & Sel Tumbuhan Rhoeo discolor)
window.bangunSVGMikroskopSel = function(specId, evalObj, blurPx) {
    let st = evalObj ? evalObj.state : "normal";
    let blurStyle = (blurPx && blurPx > 0.2) ? ('filter:blur(' + blurPx + 'px);') : '';
    let cellSvg = '';
    let arrowsSvg = '';

    // Panah arah aliran air (H2O)
    if (evalObj && (evalObj.waterDir === "in" || evalObj.waterDir === "in-fast")) {
        let fastCls = evalObj.waterDir === "in-fast" ? " fast" : "";
        arrowsSvg =
            '<g class="osm-arrows-in' + fastCls + '">' +
                '<text x="34" y="64" font-size="13" font-weight="900" fill="#0284c7">💧➔</text>' +
                '<text x="206" y="64" font-size="13" font-weight="900" fill="#0284c7">←💧</text>' +
                '<text x="34" y="198" font-size="13" font-weight="900" fill="#0284c7">💧➔</text>' +
                '<text x="206" y="198" font-size="13" font-weight="900" fill="#0284c7">←💧</text>' +
            '</g>';
    } else if (evalObj && (evalObj.waterDir === "out" || evalObj.waterDir === "out-fast")) {
        let fastClsO = evalObj.waterDir === "out-fast" ? " fast" : "";
        arrowsSvg =
            '<g class="osm-arrows-out' + fastClsO + '">' +
                '<text x="26" y="64" font-size="13" font-weight="900" fill="#0369a1">←💧</text>' +
                '<text x="204" y="64" font-size="13" font-weight="900" fill="#0369a1">💧➔</text>' +
                '<text x="26" y="198" font-size="13" font-weight="900" fill="#0369a1">←💧</text>' +
                '<text x="204" y="198" font-size="13" font-weight="900" fill="#0369a1">💧➔</text>' +
            '</g>';
    } else if (evalObj && evalObj.waterDir === "balanced") {
        arrowsSvg =
            '<g opacity="0.85">' +
                '<text x="28" y="135" font-size="13" font-weight="900" fill="#16a34a">⇄</text>' +
                '<text x="216" y="135" font-size="13" font-weight="900" fill="#16a34a">⇄</text>' +
            '</g>';
    }

    if (specId === "eritrosit") {
        if (st === "lysis") {
            cellSvg =
                '<circle cx="130" cy="130" r="68" fill="#fecdd3" opacity="0.55"/>' +
                '<path d="M84,92 Q105,70 132,76 M162,84 Q188,108 180,140 M168,168 Q134,190 98,176 M76,148 Q68,118 82,96" fill="none" stroke="#b91c1c" stroke-width="6" stroke-linecap="round" stroke-dasharray="18,12"/>' +
                '<circle cx="96" cy="112" r="7" fill="#dc2626" opacity="0.7"/><circle cx="158" cy="118" r="9" fill="#ef4444" opacity="0.65"/>' +
                '<circle cx="126" cy="154" r="8" fill="#b91c1c" opacity="0.7"/><circle cx="144" cy="96" r="5" fill="#dc2626" opacity="0.6"/>' +
                '<text x="130" y="135" font-size="15" font-weight="900" fill="#7f1d1d" text-anchor="middle">💥 PECAH</text>';
        } else if (st === "crenation") {
            let sc = Math.max(0.68, (evalObj.volPct || 75) / 100);
            cellSvg =
                '<g transform="translate(130,130) scale(' + sc.toFixed(2) + ')">' +
                    '<polygon points="0,-58 14,-38 36,-48 34,-24 58,-22 40,-4 56,18 32,20 38,44 14,34 0,58 -14,34 -38,44 -32,20 -56,18 -40,-4 -58,-22 -34,-24 -36,-48 -14,-38" fill="#dc2626" stroke="#7f1d1d" stroke-width="4" stroke-linejoin="round"/>' +
                    '<ellipse cx="0" cy="0" rx="18" ry="14" fill="#991b1b" opacity="0.55"/>' +
                '</g>';
        } else {
            let sc = Math.max(0.84, Math.min(1.26, (evalObj.volPct || 100) / 100));
            let dimpleOp = st === "swell" ? "0.22" : "0.52";
            cellSvg =
                '<g transform="translate(130,130) scale(' + sc.toFixed(2) + ')">' +
                    '<ellipse cx="0" cy="0" rx="54" ry="44" fill="url(#rbcGradLab)" stroke="#991b1b" stroke-width="4"/>' +
                    '<ellipse cx="0" cy="0" rx="24" ry="17" fill="#fca5a5" opacity="' + dimpleOp + '"/>' +
                    '<ellipse cx="-16" cy="-14" rx="10" ry="5" transform="rotate(-22 -16 -14)" fill="#ffffff" opacity="0.32"/>' +
                '</g>';
        }
    } else {
        // Sel Tumbuhan Epidermis Rhoeo discolor (Dinding sel kaku + protoplasma/vakuola ungu)
        let protoW = 140, protoH = 98, protoRx = 14, wallBow = 0;
        if (st === "turgid" || st === "swell") {
            protoW = 148; protoH = 106; protoRx = 10; wallBow = 4;
        } else if (st === "plasmolysis") {
            let ratio = Math.max(0.48, (evalObj.volPct || 68) / 100);
            protoW = Math.round(140 * ratio);
            protoH = Math.round(98 * ratio);
            protoRx = 34;
        } else if (st === "shrink-mild") {
            protoW = 122; protoH = 84; protoRx = 22;
        }

        let px = 130 - protoW / 2;
        let py = 130 - protoH / 2;
        let wallStroke = (st === "turgid") ? "#15803d" : "#3f6212";

        cellSvg =
            '<!-- Dinding Sel Kaku Selulosa -->' +
            '<rect x="' + (48 - wallBow) + '" y="' + (70 - wallBow) + '" width="' + (164 + wallBow * 2) + '" height="' + (120 + wallBow * 2) + '" rx="14" fill="#ecfccb" stroke="' + wallStroke + '" stroke-width="9"/>' +
            '<!-- Ruang Kosong antara Dinding & Membran (Jelas terlihat saat Plasmolisis) -->' +
            '<rect x="55" y="77" width="150" height="106" rx="9" fill="#f8fafc" stroke="#bef264" stroke-width="2"/>' +
            '<!-- Protoplasma & Vakuola Ungu Khas Rhoeo discolor -->' +
            '<rect x="' + px + '" y="' + py + '" width="' + protoW + '" height="' + protoH + '" rx="' + protoRx + '" fill="url(#rhoeoGradLab)" stroke="#6b21a8" stroke-width="3.5"/>' +
            '<ellipse cx="112" cy="116" rx="' + Math.max(10, Math.round(protoW * 0.16)) + '" ry="' + Math.max(6, Math.round(protoH * 0.12)) + '" fill="#e9d5ff" opacity="0.45"/>' +
            '<circle cx="' + (px + protoW - 18) + '" cy="' + (py + protoH - 18) + '" r="8" fill="#581c87" opacity="0.7"/>';
    }

    return (
        '<div class="lab-microscope-lens">' +
            '<svg viewBox="0 0 260 260" width="100%" height="100%" style="' + blurStyle + ' transition:filter 0.15s;">' +
                '<defs>' +
                    '<radialGradient id="lensBgLab" cx="50%" cy="45%" r="55%">' +
                        '<stop offset="0%" stop-color="#ffffff"/>' +
                        '<stop offset="80%" stop-color="#e0f2fe"/>' +
                        '<stop offset="100%" stop-color="#bae6fd"/>' +
                    '</radialGradient>' +
                    '<radialGradient id="rbcGradLab" cx="35%" cy="30%" r="70%">' +
                        '<stop offset="0%" stop-color="#f87171"/>' +
                        '<stop offset="55%" stop-color="#dc2626"/>' +
                        '<stop offset="100%" stop-color="#991b1b"/>' +
                    '</radialGradient>' +
                    '<radialGradient id="rhoeoGradLab" cx="40%" cy="35%" r="70%">' +
                        '<stop offset="0%" stop-color="#c084fc"/>' +
                        '<stop offset="65%" stop-color="#9333ea"/>' +
                        '<stop offset="100%" stop-color="#6b21a8"/>' +
                    '</radialGradient>' +
                '</defs>' +
                '<circle cx="130" cy="130" r="128" fill="url(#lensBgLab)"/>' +
                '<line x1="130" y1="8" x2="130" y2="252" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,6" opacity="0.35"/>' +
                '<line x1="8" y1="130" x2="252" y2="130" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,6" opacity="0.35"/>' +
                cellSvg +
                arrowsSvg +
            '</svg>' +
            '<div class="lab-lens-ring-glare"></div>' +
        '</div>'
    );
};

window.renderMembraneStage = function(bodyEl) {
    let s = window.labMembraneSession;
    if (!s) return;
    let spec = window.MY_LAB_MEMBRANE_SPECIMENS[s.specId];

    let stepNames = ["1. Preparat", "2. Fokus Mikroskop", "3. Uji Konsentrasi", "4. Kesimpulan"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">' + spec.ikon + ' ' + spec.nama + ' (Konsentrasi Sel: ?%)</span></div>';

    let stageContent = '';

    // --- TAHAP 1: PILIH SPESIMEN & SIAPKAN PREPARAT DI KACA OBJEK ---
    if (s.step === 1) {
        let specCards = '';
        Object.values(window.MY_LAB_MEMBRANE_SPECIMENS).forEach(function(sp) {
            let act = (s.specId === sp.id) ? " is-selected" : "";
            specCards +=
                '<button type="button" class="lab-spec-btn' + act + '" onclick="window.pilihSpesimenMembranLab(\'' + sp.id + '\')">' +
                    '<span class="spec-ico">' + sp.ikon + '</span>' +
                    '<div style="text-align:left;">' +
                        '<b>' + sp.nama + '</b>' +
                        '<small>' + sp.jenis + ' • Larutan: ' + sp.zatLarutan + '</small>' +
                    '</div>' +
                '</button>';
        });

        let slideVisual =
            '<div class="lab-prep-bench">' +
                '<div class="lab-prep-glass">' +
                    (s.prepPlaced ? '<div class="prep-specimen-drop ' + s.specId + '">' + spec.ikon + '</div>' : '<span class="prep-hint-txt">Kaca Objek Kosong</span>') +
                    (s.prepCovered ? '<div class="prep-coverslip"></div>' : '') +
                '</div>' +
                '<div class="lab-prep-actions">' +
                    '<button type="button" class="' + (s.prepPlaced ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (s.prepPlaced ? 'disabled' : '') + ' onclick="window.aksiSiapkanPreparatMembran(\'place\')">' +
                        (s.prepPlaced ? '✓ 1. Preparat Diletakkan' : '1. Letakkan Sampel ' + spec.ikon) +
                    '</button>' +
                    '<button type="button" class="' + (!s.prepPlaced ? 'mypet-gray-cta sm' : (s.prepCovered ? 'mypet-gray-cta sm' : 'mypet-green-cta sm')) + '" ' + (!s.prepPlaced || s.prepCovered ? 'disabled' : '') + ' onclick="window.aksiSiapkanPreparatMembran(\'cover\')">' +
                        (s.prepCovered ? '✓ 2. Ditutup Cover Slip' : '2. Tutup Kaca Penutup (Cover Slip)') +
                    '</button>' +
                '</div>' +
            '</div>';

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🔬 Tahap 1: Pilih Spesimen & Siapkan Preparat</strong>' +
                '<span>Sel ini memiliki <b>konsentrasi zat terlarut internal misteri (?%)</b>. Siapkan preparat di kaca objek lalu cari tahu konsentrasinya lewat percobaan!</span>' +
            '</div>' +
            '<div class="lab-spec-row">' + specCards + '</div>' +
            slideVisual;
    }

    // --- TAHAP 2: KALIBRASI FOKUS MIKROSKOP (MAKROMETER & MIKROMETER) ---
    else if (s.step === 2) {
        let foc = window.hitungKejelasanFokusMikroskop(s);
        let lensHtml = window.bangunSVGMikroskopSel(s.specId, { state: "normal", volPct: 100, waterDir: "none" }, foc.blurPx);

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🔭 Tahap 2: Atur Fokus Mikroskop (Makrometer & Mikrometer)</strong>' +
                '<span>Geser kenop kasar (Makrometer) lalu haluskan dengan Mikrometer hingga ketajaman fokus mencapai <b>≥ 92%</b>!</span>' +
            '</div>' +
            '<div class="lab-osm-split">' +
                '<div class="lab-lens-panel">' +
                    lensHtml +
                    '<div class="lab-clarity-bar">' +
                        '<span>Ketajaman Fokus: <b id="lab-focus-pct" style="color:' + (foc.isSharp ? '#16a34a' : '#d97706') + ';">' + foc.clarity + '%</b></span>' +
                        '<div class="garden-prog-track"><div id="lab-focus-fill" class="garden-prog-fill" style="width:' + foc.clarity + '%; background:' + (foc.isSharp ? '#16a34a' : '#f59e0b') + ';"></div></div>' +
                    '</div>' +
                '</div>' +
                '<div class="lab-controls-card">' +
                    '<div class="lab-knob-group">' +
                        '<div class="lab-knob-head"><span>⚙️ Makrometer (Fokus Kasar)</span><b id="val-macro-lab">' + s.macroVal + '</b></div>' +
                        '<div class="lab-slider-row">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahFokusMikroskopStep(\'macro\', -5)">−5</button>' +
                            '<input type="range" min="0" max="100" value="' + s.macroVal + '" oninput="window.aturFokusMikroskop(\'macro\', this.value)">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahFokusMikroskopStep(\'macro\', 5)">+5</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="lab-knob-group">' +
                        '<div class="lab-knob-head"><span>🔧 Mikrometer (Fokus Halus)</span><b id="val-micro-lab">' + s.microVal + '</b></div>' +
                        '<div class="lab-slider-row">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahFokusMikroskopStep(\'micro\', -4)">−4</button>' +
                            '<input type="range" min="0" max="100" value="' + s.microVal + '" oninput="window.aturFokusMikroskop(\'micro\', this.value)">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahFokusMikroskopStep(\'micro\', 4)">+4</button>' +
                        '</div>' +
                    '</div>' +
                    '<button type="button" class="' + (foc.isSharp ? 'mypet-green-cta' : 'mypet-gray-cta') + '" ' + (foc.isSharp ? '' : 'disabled') + ' onclick="window.lanjutTahapEksperimenMembran()">' +
                        (foc.isSharp ? '✅ Fokus Tajam! Mulai Uji Larutan ➔' : '🔭 Fokuskan Hingga ≥ 92%') +
                    '</button>' +
                '</div>' +
            '</div>';
    }

    // --- TAHAP 3: EKSPERIMEN KONSENTRASI LARUTAN & BUKU PENGAMATAN ---
    else if (s.step === 3) {
        let evalObj = window.evaluasiKondisiSelOsmosis(s.specId, s.testedConc, s.secretConc);
        let lensHtml = window.bangunSVGMikroskopSel(s.specId, evalObj, 0);

        let logRows = '';
        if (s.logs.length === 0) {
            logRows = '<div class="lab-log-empty">Belum ada uji larutan. Coba teteskan beberapa konsentrasi (misal encer, sedang, pekat) untuk melacak titik stabil (100%)!</div>';
        } else {
            s.logs.forEach(function(item, i) {
                let chipCls = item.state === "isotonic" ? "iso" : ((item.state === "lysis" || item.state === "turgid" || item.state === "swell") ? "hypo" : "hyper");
                logRows +=
                    '<div class="lab-log-row">' +
                        '<span class="log-no">#' + (i + 1) + '</span>' +
                        '<b class="log-conc">' + item.conc.toFixed(1) + '%</b>' +
                        '<span class="log-stat ' + chipCls + '">' + item.volText + ' • ' + item.label + '</span>' +
                    '</div>';
            });
        }

        let bisaLanjut = s.logs.length >= 2;
        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🧪 Tahap 3: Investigasi Konsentrasi Larutan ' + spec.zatLarutan + '</strong>' +
                '<span>Uji beberapa konsentrasi larutan untuk menemukan di angka berapa sel menjadi <b>Stabil (100%)</b> — itulah konsentrasi zat di dalam sel!</span>' +
            '</div>' +
            '<div class="lab-osm-split">' +
                '<div class="lab-lens-panel">' +
                    lensHtml +
                    '<div class="lab-obs-readout">' +
                        '<div class="obs-top-row">' +
                            '<span class="obs-badge">' + (s.testedConc !== null ? ('Larutan: ' + s.testedConc.toFixed(1) + '%') : 'Preparat Awal') + '</span>' +
                            '<span class="obs-vol">Volume Sel: <b>' + evalObj.volText + '</b></span>' +
                        '</div>' +
                        '<div class="obs-status-line"><b>' + evalObj.label + '</b> • <span>' + evalObj.waterLabel + '</span></div>' +
                        '<p class="obs-desc-txt">' + evalObj.desc + '</p>' +
                    '</div>' +
                '</div>' +

                '<div class="lab-controls-card">' +
                    '<div class="lab-knob-group">' +
                        '<div class="lab-knob-head"><span>💧 Konsentrasi ' + spec.zatLarutan + '</span><b class="conc-big-val">' + s.sliderConc.toFixed(1) + '%</b></div>' +
                        '<div class="lab-slider-row">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahKonsentrasiLarutanStep(-0.5)">−0.5</button>' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahKonsentrasiLarutanStep(-0.1)">−0.1</button>' +
                            '<input type="range" min="0" max="3" step="0.1" value="' + s.sliderConc.toFixed(1) + '" oninput="window.aturKonsentrasiLarutanSlider(this.value)">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahKonsentrasiLarutanStep(0.1)">+0.1</button>' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahKonsentrasiLarutanStep(0.5)">+0.5</button>' +
                        '</div>' +
                        '<button type="button" class="mypet-amber-cta sm" style="margin-top:6px;" onclick="window.aksiTetesLarutanMembran()">💧 Teteskan Larutan ' + s.sliderConc.toFixed(1) + '% (Uji Preparat)</button>' +
                    '</div>' +

                    '<div class="lab-log-box">' +
                        '<div class="lab-log-head"><span>📋 Buku Catatan Pengamatan (' + s.logs.length + ' Uji)</span></div>' +
                        '<div class="lab-log-scroll">' + logRows + '</div>' +
                    '</div>' +

                    '<button type="button" class="' + (bisaLanjut ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (bisaLanjut ? '' : 'disabled') + ' onclick="window.lanjutTahapAnalisisMembran()">' +
                        (bisaLanjut ? '📊 Sudah Ketemu! Lanjut ke Kesimpulan ➔' : 'Lakukan Minimal 2x Uji Larutan') +
                    '</button>' +
                '</div>' +
            '</div>';
    }

    // --- TAHAP 4: TEBAK KONSENTRASI SEL MISTERI & KESIMPULAN ILMIAH ---
    else if (s.step === 4) {
        let logMini = s.logs.map(function(it) {
            return '<span class="lab-mini-log-chip">' + it.conc.toFixed(1) + '% ➔ <b>' + it.volText + '</b> (' + it.label + ')</span>';
        }).join('');

        let letters = ["A", "B", "C", "D"];
        let phenomHtml = s.qPhenom.opts.map(function(txt, i) {
            return '<button type="button" class="lab-analysis-opt' + (s.pickedPhenomIdx === i ? ' is-picked' : '') + '" onclick="window.pilihJawabMembran(\'phenom\', ' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>';
        }).join('');

        let conclHtml = s.qConcl.opts.map(function(txt, i) {
            return '<button type="button" class="lab-analysis-opt' + (s.pickedConclIdx === i ? ' is-picked' : '') + '" onclick="window.pilihJawabMembran(\'concl\', ' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>';
        }).join('');

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>📊 Tahap 4: Tentukan Konsentrasi Zat Sel & Kesimpulan Osmosis</strong>' +
                '<span>Gunakan catatan pengamatanmu di bawah untuk menjawab pertanyaan praktikum!</span>' +
            '</div>' +
            '<div class="lab-mini-log-strip"><b>📋 Catatanmu:</b> ' + logMini + '</div>' +
            '<div class="lab-diag-panel">' +
                '<div class="lab-diag-block">' +
                    '<label>1. Berapa perkiraan konsentrasi zat terlarut di dalam sel ' + spec.nama + ' tersebut?</label>' +
                    '<div class="lab-guess-conc-row">' +
                        '<button type="button" class="lab-step-btn" onclick="window.ubahTebakanKonsentrasiSel(-0.5)">−0.5%</button>' +
                        '<button type="button" class="lab-step-btn" onclick="window.ubahTebakanKonsentrasiSel(-0.1)">−0.1%</button>' +
                        '<input type="range" min="0" max="3" step="0.1" value="' + s.guessConc.toFixed(1) + '" style="flex:1;" oninput="window.setTebakanKonsentrasiSel(this.value)">' +
                        '<button type="button" class="lab-step-btn" onclick="window.ubahTebakanKonsentrasiSel(0.1)">+0.1%</button>' +
                        '<button type="button" class="lab-step-btn" onclick="window.ubahTebakanKonsentrasiSel(0.5)">+0.5%</button>' +
                        '<span class="lab-guess-pill">' + s.guessConc.toFixed(1) + '%</span>' +
                    '</div>' +
                '</div>' +
                '<div class="lab-diag-block">' +
                    '<label>2. ' + s.qPhenom.q + '</label>' +
                    '<div class="lab-analysis-opts-grid">' + phenomHtml + '</div>' +
                '</div>' +
                '<div class="lab-diag-block">' +
                    '<label>3. Kesimpulan ilmiah yang paling tepat dari percobaan transpor membran ini adalah...</label>' +
                    '<div class="lab-analysis-opts-grid">' + conclHtml + '</div>' +
                '</div>' +
                '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
                    '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:9px 16px;" onclick="window.kembaliUjiLarutanMembran()">◀ Uji Ulang di Mikroskop</button>' +
                    '<button type="button" class="mypet-green-cta" style="flex:1;" onclick="window.selesaikanPraktikumMembran()">📋 Serahkan Laporan & Lihat Hasil</button>' +
                '</div>' +
            '</div>';
    }

    // --- TAHAP 5: LAYAR HASIL BINTANG 1-3 ---
    else if (s.step === 5 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) {
            starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        }

        stageContent =
            '<div class="lab-result-card">' +
                '<div class="lab-result-stars-wrap">' + starsBig + '</div>' +
                '<h3 class="lab-result-title">' + res.predikat + '</h3>' +
                '<div class="lab-result-rewards">' +
                    '<span>🪙 <b>+' + res.coin + ' Coin</b></span>' +
                    '<span>⭐ <b>+' + res.xp + ' XP</b></span>' +
                    '<span>🎯 Skor: <b>' + res.score + '/100</b></span>' +
                '</div>' +
                '<div class="lab-result-explain">' +
                    '<div><b>🔬 Kunci Misteri Sel ' + spec.nama + ': Konsentrasi Internal = <span style="color:#0284c7; font-size:15px;">' + s.secretConc.toFixed(1) + '% ' + spec.zatLarutan + '</span></b></div>' +
                    '<div style="font-size:12px; color:#334155; margin-top:6px; line-height:1.5;">' +
                        '• <b>Jawaban Konsentrasimu:</b> ' + s.guessConc.toFixed(1) + '% (' + res.concStatus + ')<br>' +
                        '• <b>Identifikasi Fenomena:</b> ' + (res.phenomOk ? '✅ Benar' : '❌ Kurang Tepat') + ' • <b>Kesimpulan Osmosis:</b> ' + (res.conclOk ? '✅ Benar' : '❌ Kurang Tepat') + '<br>' +
                        '• <b>Pembahasan:</b> ' + spec.penjelasanRingkas +
                    '</div>' +
                '</div>' +
                '<div style="display:flex; gap:8px; width:100%; max-width:440px; margin-top:10px;">' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumTransporMembran(\'' + (s.specId === 'eritrosit' ? 'rhoeo' : 'eritrosit') + '\')">🔄 Coba Spesimen Lain</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
                '</div>' +
            '</div>';
    }

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            stepperHtml +
            stageContent +
        '</div>';
};

// --- HANDLER INTERAKSI TRANSPOR MEMBRAN ---
window.aksiSiapkanPreparatMembran = function(aksi) {
    let s = window.labMembraneSession;
    if (!s || s.step !== 1) return;
    if (aksi === "place") {
        s.prepPlaced = true;
        window.renderMyLabUI();
        window.tampilkanToastLab("✓ Sampel diletakkan di kaca objek. Sekarang tutup dengan Cover Slip!", "ok");
    } else if (aksi === "cover" && s.prepPlaced) {
        s.prepCovered = true;
        window.renderMyLabUI();
        window.tampilkanToastLab("✅ Preparat rapi tanpa gelembung! Memasang ke meja mikroskop...", "ok");
        setTimeout(function() {
            if (window.labMembraneSession && window.labMembraneSession.step === 1) {
                window.labMembraneSession.step = 2;
                window.renderMyLabUI();
            }
        }, 700);
    }
};

window.aturFokusMikroskop = function(knob, val) {
    let s = window.labMembraneSession;
    if (!s || s.step !== 2) return;
    let num = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
    if (knob === "macro") s.macroVal = num;
    else s.microVal = num;
    window.renderMyLabUI();
};

window.ubahFokusMikroskopStep = function(knob, delta) {
    let s = window.labMembraneSession;
    if (!s || s.step !== 2) return;
    let cur = knob === "macro" ? s.macroVal : s.microVal;
    window.aturFokusMikroskop(knob, cur + delta);
};

window.lanjutTahapEksperimenMembran = function() {
    let s = window.labMembraneSession;
    if (!s || s.step !== 2) return;
    let foc = window.hitungKejelasanFokusMikroskop(s);
    if (!foc.isSharp) return;
    s.step = 3;
    window.renderMyLabUI();
};

window.aturKonsentrasiLarutanSlider = function(val) {
    let s = window.labMembraneSession;
    if (!s || s.step !== 3) return;
    s.sliderConc = Math.max(0, Math.min(3.0, window.bulatkanSatuDesimalLab(val)));
    window.renderMyLabUI();
};

window.ubahKonsentrasiLarutanStep = function(delta) {
    let s = window.labMembraneSession;
    if (!s || s.step !== 3) return;
    window.aturKonsentrasiLarutanSlider(s.sliderConc + delta);
};

window.aksiTetesLarutanMembran = function() {
    let s = window.labMembraneSession;
    if (!s || s.step !== 3) return;

    let cVal = window.bulatkanSatuDesimalLab(s.sliderConc);
    s.testedConc = cVal;
    let ev = window.evaluasiKondisiSelOsmosis(s.specId, cVal, s.secretConc);

    // Catat ke buku pengamatan (hindari duplikat berturut-turut di angka persis sama)
    let lastLog = s.logs[s.logs.length - 1];
    if (!lastLog || lastLog.conc !== cVal) {
        s.logs.push({ conc: cVal, label: ev.label, volText: ev.volText, state: ev.state });
    }

    // Otomatis isi default tebakan dengan konsentrasi terakhir yang stabil (jika ditemukan)
    if (ev.state === "isotonic") {
        s.guessConc = cVal;
    }

    window.renderMyLabUI();
    window.tampilkanToastLab(
        ev.state === "isotonic"
            ? "✨ Menarik! Pada " + cVal.toFixed(1) + "% ukuran sel tampak stabil (100%)!"
            : "💧 Diteteskan " + cVal.toFixed(1) + "% ➔ " + ev.label + " (Volume " + ev.volText + ")",
        ev.state === "isotonic" ? "ok" : ""
    );
};

window.lanjutTahapAnalisisMembran = function() {
    let s = window.labMembraneSession;
    if (!s || s.step !== 3 || s.logs.length < 2) return;
    s.step = 4;
    window.renderMyLabUI();
};

window.kembaliUjiLarutanMembran = function() {
    let s = window.labMembraneSession;
    if (!s) return;
    s.step = 3;
    window.renderMyLabUI();
};

window.setTebakanKonsentrasiSel = function(val) {
    let s = window.labMembraneSession;
    if (!s || s.step !== 4) return;
    s.guessConc = Math.max(0, Math.min(3.0, window.bulatkanSatuDesimalLab(val)));
    window.renderMyLabUI();
};

window.ubahTebakanKonsentrasiSel = function(delta) {
    let s = window.labMembraneSession;
    if (!s || s.step !== 4) return;
    window.setTebakanKonsentrasiSel(s.guessConc + delta);
};

window.pilihJawabMembran = function(bagian, idx) {
    let s = window.labMembraneSession;
    if (!s || s.step !== 4) return;
    if (bagian === "phenom") s.pickedPhenomIdx = idx;
    else s.pickedConclIdx = idx;
    window.renderMyLabUI();
};

window.selesaikanPraktikumMembran = function() {
    let s = window.labMembraneSession;
    if (!s || s.step !== 4) return;

    if (s.pickedPhenomIdx < 0) return window.tampilkanToastLab("👆 Jawab pertanyaan fenomena nomor 2 terlebih dahulu!", "err");
    if (s.pickedConclIdx < 0) return window.tampilkanToastLab("👆 Pilih kesimpulan ilmiah nomor 3 terlebih dahulu!", "err");

    let diff = Math.abs(window.bulatkanSatuDesimalLab(s.guessConc - s.secretConc));
    let concPts = 0;
    let concStatus = "Meleset (selisih " + diff.toFixed(1) + "%)";
    if (diff <= 0.05) {
        concPts = 50;
        concStatus = "✅ Tepat Sempurna!";
    } else if (diff <= 0.15) {
        concPts = 42;
        concStatus = "✅ Sangat Akurat (selisih 0.1%)";
    } else if (diff <= 0.25) {
        concPts = 28;
        concStatus = "⚠️ Mendekati (selisih 0.2%)";
    } else if (diff <= 0.45) {
        concPts = 14;
        concStatus = "⚠️ Kurang Presisi (selisih " + diff.toFixed(1) + "%)";
    }

    let phenomOk = (s.pickedPhenomIdx === s.qPhenom.ans);
    let conclOk = (s.pickedConclIdx === s.qConcl.ans);
    let score = concPts + (phenomOk ? 25 : 0) + (conclOk ? 25 : 0);

    let stars = 1;
    let predikat = "Coba Uji Lebih Teliti Lagi!";
    let coinGain = 30;
    let xpGain = 15;

    if (score >= 85 && diff <= 0.15) {
        stars = 3;
        predikat = "🌟 Peneliti Osmosis Sempurna!";
        coinGain = 100;
        xpGain = 50;
    } else if (score >= 60) {
        stars = 2;
        predikat = "👍 Pengamat Mikroskop Andal!";
        coinGain = 65;
        xpGain = 32;
    }

    s.resultData = {
        score: score,
        stars: stars,
        predikat: predikat,
        coin: coinGain,
        xp: xpGain,
        concStatus: concStatus,
        phenomOk: phenomOk,
        conclOk: conclOk
    };

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyLab(uName);
    if (lb && lb.myLabData) {
        let rec = lb.myLabData.records.membrane_transport || { bestStars: 0, completions: 0, lastAt: 0 };
        rec.bestStars = Math.max(Number(rec.bestStars) || 0, stars);
        rec.completions = (Number(rec.completions) || 0) + 1;
        rec.lastAt = Date.now();
        lb.myLabData.records.membrane_transport = rec;
        lb.myLabData.totalCompleted = (Number(lb.myLabData.totalCompleted) || 0) + 1;

        let totBintang = 0;
        Object.values(lb.myLabData.records).forEach(function(r) {
            if (r && r.bestStars) totBintang += Number(r.bestStars) || 0;
        });
        lb.myLabData.totalStars = totBintang;

        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + coinGain;
        lb.xpTersedia = lb.coin;
        lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + xpGain;
        lb.xp = lb.xpTotal;

        window.simpanDataLabKeServer(lb);
        if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
        if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
        if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    }

    s.step = 5;
    window.renderMyLabUI();
};
// =========================================================================
// 6. PRAKTIKUM 3: KULTUR JARINGAN TUMBUHAN (TOTIPOTENSI & SINERGI MY GARDEN)
// =========================================================================
window.MY_LAB_TISSUE_PLANTS = [
    {
        id: "wortel",
        gardenId: "wortel",
        nama: "Wortel",
        latin: "Daucus carota",
        ikon: "🥕",
        warna: "#f97316",
        warnaGelap: "#c2410c",
        eksplanBenar: "Jaringan Kambium / Floem Akar Muda",
        sellCoin: 120,
        rewardXp: 60,
        minStarsGarden: 2,
        fakta: "Percobaan klasik F.C. Steward (1958) membuktikan satu sel floem wortel mampu tumbuh menjadi individu wortel utuh."
    },
    {
        id: "stroberi",
        gardenId: "stroberi",
        nama: "Stroberi Manis",
        latin: "Fragaria × ananassa",
        ikon: "🍓",
        warna: "#ef4444",
        warnaGelap: "#991b1b",
        eksplanBenar: "Jaringan Meristem Pucuk Stolon",
        sellCoin: 140,
        rewardXp: 70,
        minStarsGarden: 2,
        fakta: "Kultur meristem pucuk menghasilkan bibit stroberi bebas virus dalam jumlah massal dan seragam secara genetik."
    },
    {
        id: "anggrek",
        gardenId: "anggrek",
        nama: "Anggrek Bulan",
        latin: "Phalaenopsis amabilis",
        ikon: "🌸",
        warna: "#d946ef",
        warnaGelap: "#86198f",
        eksplanBenar: "Jaringan Meristem Ujung Tunas Muda",
        sellCoin: 160,
        rewardXp: 80,
        minStarsGarden: 3,
        fakta: "Biji anggrek nyaris tidak punya endosperma, sehingga perbanyakan in vitro dengan media MS sangat efektif melestarikannya."
    },
    {
        id: "edelweiss",
        gardenId: "edelweiss",
        nama: "Edelweiss Jawa",
        latin: "Anaphalis javanica",
        ikon: "🌼",
        warna: "#eab308",
        warnaGelap: "#a16207",
        eksplanBenar: "Jaringan Meristem Apikal Pucuk",
        sellCoin: 180,
        rewardXp: 90,
        minStarsGarden: 3,
        fakta: "Kultur jaringan menjadi solusi konservasi ex situ untuk memperbanyak flora langka pegunungan tanpa merusak populasi alaminya."
    }
];

window.MY_LAB_TC_STERIL_BATHS = [
    { key: "alkohol",  nama: "1. Alkohol 70%",       ikon: "🧴", minOk: 40, maxOk: 76, speed: 2.1, ket: "Membunuh mikroba permukaan & melarutkan lapisan lilin." },
    { key: "kloroks",  nama: "2. Kloroks (NaOCl)",   ikon: "🧪", minOk: 46, maxOk: 78, speed: 2.3, ket: "Disinfektan kuat pemusnah spora jamur & bakteri." },
    { key: "akuades",  nama: "3. Akuades Steril",    ikon: "💧", minOk: 50, maxOk: 86, speed: 2.0, ket: "Membilas sisa bahan kimia agar eksplan tidak rusak." }
];

window.MY_LAB_TC_HORMONE_GOALS = [
    {
        id: "kalus",
        judul: "Induksi Kalus (Tahap Awal)",
        syaratTeks: "Atur rasio Auksin & Sitokinin SEIMBANG (masing-masing ≥ 4, selisih ≤ 1) agar sel membelah membentuk gumpalan kalus!",
        cek: function(a, c) { return a >= 4 && c >= 4 && Math.abs(a - c) <= 1; }
    },
    {
        id: "tunas",
        judul: "Induksi Tunas Cepat (Kaulogenesis)",
        syaratTeks: "Atur Sitokinin LEBIH TINGGI dari Auksin (Sitokinin ≥ 6 dan Sitokinin − Auksin ≥ 2) agar tunas segera tumbuh!",
        cek: function(a, c) { return c >= 6 && (c - a) >= 2; }
    }
];

window.MY_LAB_TC_QUIZ_POOL = [
    {
        q: "Kemampuan satu sel atau potongan jaringan tumbuhan untuk membelah dan tumbuh menjadi individu baru yang utuh disebut sifat...",
        opts: ["Totipotensi", "Fototropisme", "Metamorfosis", "Osmosis"],
        ans: 0
    },
    {
        q: "Mengapa bagian jaringan meristem pucuk muda paling sering dipilih sebagai eksplan dalam kultur jaringan?",
        opts: ["Sel-selnya masih aktif membelah secara mitosis dan relatif bebas patogen", "Sel-selnya sudah mati dan berkayu keras", "Tidak membutuhkan nutrisi apapun di media", "Memiliki dinding sel dari zat kitin"],
        ans: 0
    },
    {
        q: "Pada pengaturan hormon media MS, jika konsentrasi Sitokinin dibuat jauh lebih tinggi dibanding Auksin, maka kalus akan terdorong membentuk...",
        opts: ["Tunas / daun (kaulogenesis)", "Hanya akar serabut saja", "Biji dorman", "Bunga layu"],
        ans: 0
    },
    {
        q: "Mengapa plantlet hasil botol kultur wajib melalui tahap aklimatisasi sebelum ditanam langsung di lahan terbuka?",
        opts: ["Agar plantlet beradaptasi bertahap dari kondisi steril-lembap heterotrof ke lingkungan luar autotrof", "Agar botol kultur bisa langsung dipecahkan", "Supaya bakteri cepat menginfeksi akar", "Untuk menghentikan fotosintesis daun"],
        ans: 0
    }
];

window.cariInfoTanamanTC = function(plantId) {
    return window.MY_LAB_TISSUE_PLANTS.find(function(p) { return p.id === plantId; }) || window.MY_LAB_TISSUE_PLANTS[0];
};

window.mulaiPraktikumKulturJaringan = function(presetPlantId) {
    window.hentikanTimerKulturJaringan();
    let pCfg = window.cariInfoTanamanTC(presetPlantId || "wortel");
    let goal = window.MY_LAB_TC_HORMONE_GOALS[Math.floor(Math.random() * window.MY_LAB_TC_HORMONE_GOALS.length)];

    let rawQ = window.MY_LAB_TC_QUIZ_POOL[Math.floor(Math.random() * window.MY_LAB_TC_QUIZ_POOL.length)];
    let taggedOpts = rawQ.opts.map(function(txt, i) { return { txt: txt, ok: i === rawQ.ans }; }).sort(function() { return Math.random() - 0.5; });

    let tissueOpts = [
        { label: pCfg.eksplanBenar, ok: true, sub: "Sel muda aktif membelah" },
        { label: "Daun Tua Menguning", ok: false, sub: "Sel mengalami penuaan (senesens)" },
        { label: "Kulit Batang Berkayu Mati", ok: false, sub: "Tersusun sel gabus mati" }
    ].sort(function() { return Math.random() - 0.5; });

    window.labTissueSession = {
        step: 1, // 1: Eksplan & Potong, 2: Sterilisasi, 3: Media MS & Hormon, 4: Inokulasi LAF & Tumbuh, 5: Aklimatisasi & Kuis, 6: Hasil & Klaim
        plantId: pCfg.id,
        tissueOpts: tissueOpts,
        tissuePickedOk: false,
        slicesDone: [false, false, false, false],
        // Stage 2: Sterilisasi
        bathIdx: 0,
        bathDipping: false,
        bathVal: 0,
        bathsDone: [false, false, false],
        // Stage 3: Media MS
        ingredients: { ms: false, sukrosa: false, agar: false },
        auksin: 2,
        sitokinin: 2,
        hormoneGoal: goal,
        autoclaveDone: false,
        // Stage 4: Inokulasi LAF & Pertumbuhan
        bunsenOn: false,
        tweezerSterile: false,
        explantPlanted: false,
        growthPhase: 0, // 0: Eksplan, 1: Kalus, 2: Tunas & Akar, 3: Plantlet
        // Stage 5: Aklimatisasi & Kuis
        acclim: { pot: false, hood: false, sun: false },
        quiz: { q: rawQ.q, opts: taggedOpts.map(function(x) { return x.txt; }), ans: taggedOpts.findIndex(function(x) { return x.ok; }) },
        pickedQuizIdx: -1,
        // Scoring
        mistakes: 0,
        resultData: null,
        rewardClaimed: false,
        claimedMode: ""
    };

    window.activeLabView = "tissue_culture";
    window.renderMyLabUI();
};

window.pilihTanamanKulturLab = function(plantId) {
    window.mulaiPraktikumKulturJaringan(plantId);
};

window.bangunSVGBotolKulturFase = function(pCfg, phase) {
    let plantInner = '';
    if (phase === 0) {
        // Eksplan kecil di permukaan agar
        plantInner = '<ellipse cx="75" cy="116" rx="14" ry="7" fill="' + pCfg.warna + '" stroke="' + pCfg.warnaGelap + '" stroke-width="2.5"/>';
    } else if (phase === 1) {
        // Kalus (gumpalan sel parenkim tak terdiferensiasi)
        plantInner =
            '<g>' +
                '<circle cx="65" cy="112" r="11" fill="#bef264" stroke="#4d7c0f" stroke-width="2"/>' +
                '<circle cx="82" cy="110" r="12" fill="#a3e635" stroke="#4d7c0f" stroke-width="2"/>' +
                '<circle cx="74" cy="100" r="11" fill="#d9f99d" stroke="#4d7c0f" stroke-width="2"/>' +
                '<circle cx="74" cy="114" r="10" fill="#84cc16" stroke="#4d7c0f" stroke-width="2"/>' +
            '</g>';
    } else if (phase === 2) {
        // Tunas hijau & akar serabut halus masuk ke agar
        plantInner =
            '<path d="M75,118 Q66,130 60,138 M75,118 Q76,132 76,142 M75,118 Q84,130 90,138" fill="none" stroke="#fef3c7" stroke-width="2.5" stroke-linecap="round"/>' +
            '<path d="M75,116 L75,78" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>' +
            '<path d="M75,98 C54,94 48,78 60,72 C70,70 75,86 75,98 Z" fill="#4ade80" stroke="#14532d" stroke-width="2.5"/>' +
            '<path d="M75,94 C96,90 102,74 90,68 C80,66 75,82 75,94 Z" fill="#22c55e" stroke="#14532d" stroke-width="2.5"/>';
    } else {
        // Plantlet lengkap siap aklimatisasi
        plantInner =
            '<path d="M75,118 Q62,130 54,142 M75,118 Q70,134 68,146 M75,118 Q82,134 86,145 M75,118 Q90,128 98,138" fill="none" stroke="#fef3c7" stroke-width="2.5" stroke-linecap="round"/>' +
            '<path d="M75,116 L75,62" stroke="#15803d" stroke-width="5.5" stroke-linecap="round"/>' +
            '<path d="M75,102 C48,98 42,80 56,74 C68,70 75,88 75,102 Z" fill="#22c55e" stroke="#14532d" stroke-width="2.5"/>' +
            '<path d="M75,98 C102,94 108,76 94,70 C82,66 75,84 75,98 Z" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>' +
            '<path d="M75,78 C54,70 50,52 64,48 C74,46 75,64 75,78 Z" fill="#4ade80" stroke="#14532d" stroke-width="2.5"/>' +
            '<path d="M75,76 C96,68 100,50 86,46 C76,44 75,62 75,76 Z" fill="#84cc16" stroke="#14532d" stroke-width="2.5"/>' +
            '<circle cx="75" cy="48" r="9" fill="' + pCfg.warna + '" stroke="' + pCfg.warnaGelap + '" stroke-width="2"/>' +
            '<circle cx="75" cy="48" r="3.5" fill="#fef08a"/>';
    }

    return '<svg viewBox="0 0 150 175" width="132" height="154">' +
        '<!-- Tutup Aluminium Foil Steril -->' +
        '<rect x="46" y="10" width="58" height="18" rx="6" fill="#cbd5e1" stroke="#475569" stroke-width="2.5"/>' +
        '<!-- Botol Kaca Kultur -->' +
        '<path d="M52,28 L52,44 L30,66 L30,152 C30,160 36,166 44,166 L106,166 C114,166 120,160 120,152 L120,66 L98,44 L98,28 Z" fill="rgba(240,253,250,0.88)" stroke="#0284c7" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<!-- Media Agar MS Bening -->' +
        '<path d="M33,118 L117,118 L117,151 C117,158 112,163 105,163 L45,163 C38,163 33,158 33,151 Z" fill="#fde68a" opacity="0.82"/>' +
        '<ellipse cx="75" cy="118" rx="42" ry="6" fill="#fef08a" stroke="#eab308" stroke-width="1.5"/>' +
        plantInner +
        '<path d="M40,74 L40,145" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.55"/>' +
    '</svg>';
};

window.renderTissueCultureStage = function(bodyEl) {
    let s = window.labTissueSession;
    if (!s) return;
    let pCfg = window.cariInfoTanamanTC(s.plantId);

    let stepNames = ["1. Potong Eksplan", "2. Sterilisasi", "3. Media MS", "4. Inokulasi LAF", "5. Aklimatisasi"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">' + pCfg.ikon + ' ' + pCfg.nama + '</span></div>';

    let stageContent = '';

    // --- TAHAP 1: PILIH SPESIES, PILIH JARINGAN MERISTEM, & POTONG EKSPLAN ALA COOKING MAMA ---
    if (s.step === 1) {
        if (!s.tissuePickedOk) {
            let plantBtns = window.MY_LAB_TISSUE_PLANTS.map(function(p) {
                let act = (p.id === s.plantId) ? " is-selected" : "";
                return '<button type="button" class="lab-spec-btn tc-plant-card' + act + '" onclick="window.pilihTanamanKulturLab(\'' + p.id + '\')">' +
                    '<span class="spec-ico">' + p.ikon + '</span>' +
                    '<div style="text-align:left; min-width:0;">' +
                        '<b>' + p.nama + '</b>' +
                        '<small><i>' + p.latin + '</i> • 🪙' + p.sellCoin + ' / 🌱 Min ' + p.minStarsGarden + '★</small>' +
                    '</div>' +
                '</button>';
            }).join('');

            let tissueBtns = s.tissueOpts.map(function(opt, idx) {
                return '<button type="button" class="lab-analysis-opt tc-tissue-opt" onclick="window.pilihJaringanEksplanLab(' + idx + ')">' +
                    '<span>🔬</span><div><b>' + opt.label + '</b><div style="font-size:10.5px; color:#64748b; font-weight:600;">' + opt.sub + '</div></div>' +
                '</button>';
            }).join('');

            stageContent =
                '<div class="lab-instruction-banner">' +
                    '<strong>✂️ Tahap 1A: Pilih Tanaman Induk & Jaringan Eksplan</strong>' +
                    '<span>Pilih tanaman yang ingin diperbanyak, lalu tentukan <b>jaringan dengan daya totipotensi tertinggi</b> sebagai bahan eksplan!</span>' +
                '</div>' +
                '<div class="tc-plants-grid">' + plantBtns + '</div>' +
                '<div class="lab-diag-panel" style="margin-top:10px;">' +
                    '<div class="lab-diag-block">' +
                        '<label>Bagian jaringan manakah dari ' + pCfg.nama + ' yang paling tepat dijadikan eksplan?</label>' +
                        '<div class="tc-tissue-opts-grid">' + tissueBtns + '</div>' +
                    '</div>' +
                '</div>';
        } else {
            // Sub-tahap 1B: Talenan Potong Eksplan (Ala Cooking Mama!)
            let doneCount = s.slicesDone.filter(Boolean).length;
            let nextCutIdx = s.slicesDone.findIndex(function(v) { return !v; });

            let slicesVisualHtml = '';
            for (let i = 0; i < 4; i++) {
                let isCut = s.slicesDone[i];
                let isNext = (i === nextCutIdx);
                slicesVisualHtml +=
                    '<div class="tc-explant-piece' + (isCut ? ' is-sliced' : '') + '" style="background:linear-gradient(180deg, ' + pCfg.warna + ', ' + pCfg.warnaGelap + ');">' +
                        '<span>' + (isCut ? '✓' : '') + '</span>' +
                    '</div>' +
                    '<div class="tc-cut-lane' + (isCut ? ' cut-done' : (isNext ? ' cut-active' : '')) + '" data-cut-idx="' + i + '" ' +
                        'onpointerdown="window.mulaiGeserPisauEksplan(event, ' + i + ')" ' +
                        'onclick="window.aksiPotongEksplanLab(' + i + ')" ' +
                        'title="Geser pisau ke bawah atau ketuk garis ini">' +
                        '<div class="tc-cut-line"></div>' +
                        (isNext ? '<div class="tc-knife-badge">🔪</div>' : '') +
                    '</div>';
            }

            stageContent =
                '<div class="lab-instruction-banner">' +
                    '<strong>🔪 Tahap 1B: Iris Eksplan Tipis di Talenan Steril (' + doneCount + '/4 Irisan)</strong>' +
                    '<span><b>Geser pisau ke bawah</b> (atau ketuk) tepat pada garis potong berkedip untuk mendapatkan 4 irisan eksplan yang seragam!</span>' +
                '</div>' +
                '<div class="lab-glass-slide is-stir-mode tc-cutting-board" onpointermove="window.gerakPisauEksplanLab(event)">' +
                    '<div class="tc-board-surface">' +
                        '<div class="tc-explant-bar">' +
                            '<div class="tc-explant-root" style="background:linear-gradient(180deg, ' + pCfg.warna + ', ' + pCfg.warnaGelap + ');">' + pCfg.ikon + '</div>' +
                            slicesVisualHtml +
                        '</div>' +
                    '</div>' +
                    '<div class="tc-board-tip">💡 Jaringan terpilih: <b>' + pCfg.eksplanBenar + '</b> • Ketuk atau geser melintasi garis 🔪</div>' +
                '</div>';
        }
    }

    // --- TAHAP 2: STERILISASI BERTINGKAT (TIMING GAUGE) ---
    else if (s.step === 2) {
        let curBath = window.MY_LAB_TC_STERIL_BATHS[Math.min(2, s.bathIdx)];
        let beakersHtml = window.MY_LAB_TC_STERIL_BATHS.map(function(b, idx) {
            let done = s.bathsDone[idx];
            let active = (idx === s.bathIdx && !done);
            return '<div class="tc-beaker-card' + (active ? ' is-active' : '') + (done ? ' is-done' : '') + '">' +
                '<div class="tc-beaker-ico">' + b.ikon + '</div>' +
                '<div class="tc-beaker-name">' + b.nama + '</div>' +
                '<div class="tc-beaker-stat">' + (done ? '✅ Steril' : (active ? (s.bathDipping ? '🫧 Merendam...' : '⏳ Siap Celup') : 'Menunggu')) + '</div>' +
            '</div>';
        }).join('');

        let zoneLeft = curBath.minOk;
        let zoneWidth = curBath.maxOk - curBath.minOk;

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🧴 Tahap 2: Sterilisasi Eksplan Bertingkat (' + s.bathsDone.filter(Boolean).length + '/3)</strong>' +
                '<span>Tekan <b>Celupkan</b> lalu tekan <b>Angkat Sekarang!</b> tepat saat penanda berada di <b>Zona Hijau</b> agar eksplan steril tanpa mati (browning).</span>' +
            '</div>' +
            '<div class="tc-beakers-row">' + beakersHtml + '</div>' +
            '<div class="tc-steril-panel">' +
                '<div class="tc-steril-head">' +
                    '<b>' + curBath.ikon + ' ' + curBath.nama + '</b>' +
                    '<span>' + curBath.ket + '</span>' +
                '</div>' +
                '<div class="tc-gauge-track">' +
                    '<div class="tc-gauge-green-zone" style="left:' + zoneLeft + '%; width:' + zoneWidth + '%;">ZONA OPTIMAL</div>' +
                    '<div id="tc-steril-bar-fill" class="tc-gauge-fill" style="width:' + Math.round(s.bathVal) + '%;"></div>' +
                    '<div id="tc-steril-needle" class="tc-gauge-needle" style="left:' + Math.round(s.bathVal) + '%;"></div>' +
                '</div>' +
                '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">' +
                    '<span style="font-size:12px; font-weight:800; color:#334155;">Durasi Rendam: <b id="tc-steril-val-txt">' + Math.round(s.bathVal) + '%</b> (Target: ' + curBath.minOk + '%–' + curBath.maxOk + '%)</span>' +
                    (!s.bathDipping
                        ? '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:9px 22px;" onclick="window.mulaiCelupSterilisasiLab()">⬇️ Celupkan Eksplan</button>'
                        : '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:9px 24px; background:linear-gradient(180deg,#fb7185,#dc2626); border-color:#7f1d1d;" onclick="window.angkatEksplanSterilisasiLab()">⬆️ Angkat Sekarang!</button>') +
                '</div>' +
            '</div>';
    }

    // --- TAHAP 3: RACIK MEDIA AGAR MS & RASIO HORMON AUKSIN vs SITOKININ ---
    else if (s.step === 3) {
        let a = s.auksin;
        let c = s.sitokinin;
        let hormonPred = "⏳ Hormon masih terlalu rendah (minimal 4)";
        let hormonCls = "warn";
        if (a < 3 && c < 3) {
            hormonPred = "⏳ Kadar hormon terlalu rendah untuk memicu pembelahan sel";
        } else if (c - a >= 2 && c >= 5) {
            hormonPred = "🌿 Sitokinin > Auksin ➔ Dominan Pembentukan TUNAS (Kaulogenesis)";
            hormonCls = s.hormoneGoal.id === "tunas" ? "ok" : "info";
        } else if (a - c >= 2 && a >= 5) {
            hormonPred = "🌱 Auksin > Sitokinin ➔ Dominan Pembentukan AKAR (Rizogenesis)";
            hormonCls = "info";
        } else if (a >= 4 && c >= 4 && Math.abs(a - c) <= 1) {
            hormonPred = "🫧 Auksin ≈ Sitokinin (Seimbang) ➔ Induksi KALUS Optimal";
            hormonCls = s.hormoneGoal.id === "kalus" ? "ok" : "info";
        }

        let ingList = [
            { k: "ms",      lbl: "🧪 Garam Mineral MS", sub: "Makro & mikronutrien" },
            { k: "sukrosa", lbl: "🍬 Sukrosa 3%",       sub: "Sumber karbon/energi" },
            { k: "agar",    lbl: "🍮 Agar-agar",        sub: "Pemadat media kultur" }
        ];
        let ingBtns = ingList.map(function(it) {
            let done = s.ingredients[it.k];
            return '<button type="button" class="tc-ing-btn' + (done ? ' is-added' : '') + '" ' + (done ? 'disabled' : '') + ' onclick="window.tambahBahanMediaMSLab(\'' + it.k + '\')">' +
                '<b>' + (done ? '✅ ' : '+ ') + it.lbl + '</b><small>' + it.sub + '</small>' +
            '</button>';
        }).join('');

        let semuaBahanAda = s.ingredients.ms && s.ingredients.sukrosa && s.ingredients.agar;
        let hormonCocok = s.hormoneGoal.cek(a, c);
        let isiPersen = (s.ingredients.ms ? 28 : 0) + (s.ingredients.sukrosa ? 26 : 0) + (s.ingredients.agar ? 26 : 0) + ((a + c) > 0 ? 10 : 0);

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🧪 Tahap 3: Racik Media Agar MS & Hormon (' + s.hormoneGoal.judul + ')</strong>' +
                '<span>' + s.hormoneGoal.syaratTeks + '</span>' +
            '</div>' +
            '<div class="tc-media-split">' +
                '<div class="tc-flask-card">' +
                    '<svg viewBox="0 0 140 160" width="128" height="146">' +
                        '<path d="M52,18 L52,52 L22,132 C19,142 26,150 36,150 L104,150 C114,150 121,142 118,132 L88,52 L88,18 Z" fill="#f8fafc" stroke="#0284c7" stroke-width="3.5" stroke-linejoin="round"/>' +
                        '<clipPath id="tcFlaskClip"><path d="M55,54 L26,133 C24,140 29,146 36,146 L104,146 C111,146 116,140 114,133 L85,54 Z"/></clipPath>' +
                        '<rect x="18" y="' + (148 - Math.round(isiPersen * 0.85)) + '" width="104" height="95" fill="' + (hormonCocok && semuaBahanAda ? '#86efac' : '#fde68a') + '" clip-path="url(#tcFlaskClip)" style="transition:y 0.25s;"/>' +
                        '<rect x="46" y="12" width="48" height="9" rx="4" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5"/>' +
                    '</svg>' +
                    '<div class="tc-hormone-preview ' + hormonCls + '">' + hormonPred + '</div>' +
                '</div>' +

                '<div class="lab-controls-card">' +
                    '<div style="font-size:11.5px; font-weight:800; color:#0b3954;">1. Masukkan Bahan Dasar Media MS:</div>' +
                    '<div class="tc-ing-row">' + ingBtns + '</div>' +
                    '<div class="lab-knob-group">' +
                        '<div class="lab-knob-head"><span>🌱 Hormon Auksin (Pemicu Akar)</span><b>' + a + ' ppm</b></div>' +
                        '<div class="lab-slider-row">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'auksin\', -1)">−1</button>' +
                            '<input type="range" min="0" max="10" step="1" value="' + a + '" oninput="window.aturHormonMediaLab(\'auksin\', this.value)">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'auksin\', 1)">+1</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="lab-knob-group">' +
                        '<div class="lab-knob-head"><span>🌿 Hormon Sitokinin (Pemicu Tunas)</span><b>' + c + ' ppm</b></div>' +
                        '<div class="lab-slider-row">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'sitokinin\', -1)">−1</button>' +
                            '<input type="range" min="0" max="10" step="1" value="' + c + '" oninput="window.aturHormonMediaLab(\'sitokinin\', this.value)">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'sitokinin\', 1)">+1</button>' +
                        '</div>' +
                    '</div>' +
                    '<button type="button" class="' + (semuaBahanAda ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" onclick="window.sterilisasiAutoklafMediaLab()">🔥 Sterilisasi Autoklaf (121°C) &amp; Tuang ke Botol ➔</button>' +
                '</div>' +
            '</div>';
    }

    // --- TAHAP 4: INOKULASI ASEPTIS (LAMINAR AIR FLOW) & TUMBUH PLANTLET ---
    else if (s.step === 4) {
        let faseLabel = ["Eksplan Baru Ditanam (Hari 1)", "Kalus Terbentuk (Minggu 2)", "Tunas & Akar Muncul (Minggu 5)", "Plantlet Lengkap Siap Aklimatisasi (Minggu 8)"];
        let faseKet = [
            "Eksplan berada steril di atas media agar MS kaya nutrien & hormon.",
            "Sel meristem aktif membelah mitosis membentuk gumpalan sel kalus.",
            "Organogenesis terjadi: tunas daun dan akar serabut mulai terdiferensiasi.",
            "Plantlet sudah memiliki daun hijau, batang, dan akar lengkap!"
        ];

        if (!s.explantPlanted) {
            stageContent =
                '<div class="lab-instruction-banner">' +
                    '<strong>🔥 Tahap 4A: Inokulasi Aseptis di Laminar Air Flow (LAF)</strong>' +
                    '<span>Lakukan urutan kerja steril yang benar: <b>1) Nyalakan Api Bunsen</b> ➔ <b>2) Panaskan Pinset</b> ➔ <b>3) Tanam Eksplan ke Botol Agar</b>!</span>' +
                '</div>' +
                '<div class="tc-laf-bench">' +
                    '<div class="tc-laf-visual-row">' +
                        '<div class="tc-laf-item ' + (s.bunsenOn ? 'lit' : '') + '">' +
                            '<div class="tc-laf-big-ico">' + (s.bunsenOn ? '🔥' : '🕯️') + '</div>' +
                            '<b>Api Bunsen</b>' +
                            '<small>' + (s.bunsenOn ? 'Menyala (Zona Steril)' : 'Mati') + '</small>' +
                        '</div>' +
                        '<div class="tc-laf-item ' + (s.tweezerSterile ? 'lit' : '') + '">' +
                            '<div class="tc-laf-big-ico">' + (s.tweezerSterile ? '✨🥢' : '🥢') + '</div>' +
                            '<b>Pinset Inokulasi</b>' +
                            '<small>' + (s.tweezerSterile ? 'Steril (Sudah Dipijar)' : 'Belum Disterilkan') + '</small>' +
                        '</div>' +
                        '<div class="tc-laf-item">' +
                            '<div class="tc-laf-big-ico">🫙</div>' +
                            '<b>Botol Media MS</b>' +
                            '<small>Menunggu Eksplan ' + pCfg.ikon + '</small>' +
                        '</div>' +
                    '</div>' +
                    '<div class="tc-laf-btns">' +
                        '<button type="button" class="' + (s.bunsenOn ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (s.bunsenOn ? 'disabled' : '') + ' onclick="window.aksiLAFLab(\'bunsen\')">' + (s.bunsenOn ? '✓ 1. Bunsen Menyala' : '1. 🔥 Nyalakan Api Bunsen') + '</button>' +
                        '<button type="button" class="' + (s.tweezerSterile ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (s.tweezerSterile ? 'disabled' : '') + ' onclick="window.aksiLAFLab(\'tweezer\')">' + (s.tweezerSterile ? '✓ 2. Pinset Steril' : '2. 🥢 Panaskan Pinset di Api') + '</button>' +
                        '<button type="button" class="mypet-green-cta sm" onclick="window.aksiLAFLab(\'plant\')">3. 🧫 Tanam Eksplan ke Botol</button>' +
                    '</div>' +
                '</div>';
        } else {
            let botolSvg = window.bangunSVGBotolKulturFase(pCfg, s.growthPhase);
            let isReadyAcclim = (s.growthPhase >= 3);
            stageContent =
                '<div class="lab-instruction-banner">' +
                    '<strong>🌱 Tahap 4B: Inkubasi &amp; Pertumbuhan In Vitro</strong>' +
                    '<span>Amati proses totipotensi di ruang inkubasi cahaya sampai terbentuk <b>Plantlet Utuh</b>!</span>' +
                '</div>' +
                '<div class="tc-growth-card">' +
                    botolSvg +
                    '<div class="tc-growth-info">' +
                        '<div class="tc-phase-badge">' + faseLabel[s.growthPhase] + '</div>' +
                        '<p>' + faseKet[s.growthPhase] + '</p>' +
                        '<div class="garden-prog-track" style="margin:6px 0 10px 0;"><div class="garden-prog-fill" style="width:' + Math.round(((s.growthPhase + 1) / 4) * 100) + '%;"></div></div>' +
                        (!isReadyAcclim
                            ? '<button type="button" class="mypet-amber-cta sm" onclick="window.percepatFaseTumbuhKultur()">⏩ Inkubasi ke Fase Berikutnya</button>'
                            : '<button type="button" class="mypet-green-cta sm" onclick="window.lanjutTahapAklimatisasiLab()">🪴 Plantlet Siap! Lanjut Aklimatisasi ➔</button>') +
                    '</div>' +
                '</div>';
        }
    }

    // --- TAHAP 5: AKLIMATISASI & UJI KONSEP TOTIPOTENSI ---
    else if (s.step === 5) {
        let semuaAcclim = s.acclim.pot && s.acclim.hood && s.acclim.sun;
        let letters = ["A", "B", "C", "D"];
        let qOptsHtml = s.quiz.opts.map(function(txt, idx) {
            return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === idx ? ' is-picked' : '') + '" onclick="window.pilihKuisKulturLab(' + idx + ')"><b>' + letters[idx] + '.</b> <span>' + txt + '</span></button>';
        }).join('');

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🪴 Tahap 5: Aklimatisasi Plantlet &amp; Evaluasi Konsep</strong>' +
                '<span>Lakukan 3 langkah aklimatisasi ke lingkungan luar, lalu jawab 1 pertanyaan konsep kultur jaringan!</span>' +
            '</div>' +
            '<div class="tc-acclim-row">' +
                '<button type="button" class="tc-ing-btn' + (s.acclim.pot ? ' is-added' : '') + '" ' + (s.acclim.pot ? 'disabled' : '') + ' onclick="window.aksiAklimatisasiLab(\'pot\')">' +
                    '<b>' + (s.acclim.pot ? '✅ ' : '1. ') + '🪴 Pindah ke Pot Tanah</b><small>Keluarkan dari agar &amp; cuci bersih</small>' +
                '</button>' +
                '<button type="button" class="tc-ing-btn' + (s.acclim.hood ? ' is-added' : '') + '" ' + (s.acclim.hood ? 'disabled' : '') + ' onclick="window.aksiAklimatisasiLab(\'hood\')">' +
                    '<b>' + (s.acclim.hood ? '✅ ' : '2. ') + '💨 Buka Sungkup Bertahap</b><small>Adaptasi kelembapan &amp; stomata</small>' +
                '</button>' +
                '<button type="button" class="tc-ing-btn' + (s.acclim.sun ? ' is-added' : '') + '" ' + (s.acclim.sun ? 'disabled' : '') + ' onclick="window.aksiAklimatisasiLab(\'sun\')">' +
                    '<b>' + (s.acclim.sun ? '✅ ' : '3. ') + '☀️ Cahaya Matahari Pagi</b><small>Transisi penuh ke fotosintesis autotrof</small>' +
                '</button>' +
            '</div>' +
            '<div class="lab-diag-panel">' +
                '<div class="lab-diag-block">' +
                    '<label>🧠 Pertanyaan Konsep: ' + s.quiz.q + '</label>' +
                    '<div class="lab-analysis-opts-grid">' + qOptsHtml + '</div>' +
                '</div>' +
                '<button type="button" class="' + (semuaAcclim ? 'mypet-green-cta' : 'mypet-gray-cta') + '" onclick="window.selesaikanPraktikumKulturJaringan()">🎉 Panen Plantlet &amp; Lihat Penilaian</button>' +
            '</div>';
    }

    // --- TAHAP 6: HASIL BINTANG 1-3 + PILIHAN JUAL ATAU KIRIM KE MY GARDEN ---
    else if (s.step === 6 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) {
            starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        }

        let bisaKirimGarden = res.stars >= pCfg.minStarsGarden;
        let actionBoxHtml = '';

        if (!s.rewardClaimed) {
            actionBoxHtml =
                '<div class="tc-claim-choice-box">' +
                    '<div style="font-size:12px; font-weight:800; color:#0f766e; margin-bottom:8px;">🎁 Pilih Nasib Plantlet ' + pCfg.ikon + ' ' + pCfg.nama + ' Hasil Kulturasimu:</div>' +
                    '<div class="tc-claim-btns-row">' +
                        '<button type="button" class="mypet-amber-cta sm" onclick="window.klaimHadiahKulturJaringan(\'sell\')">💰 Jual Plantlet (+🪙 ' + res.sellCoin + ' &amp; +' + res.xp + ' XP)</button>' +
                        '<button type="button" class="' + (bisaKirimGarden ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (bisaKirimGarden ? '' : 'disabled') + ' onclick="window.klaimHadiahKulturJaringan(\'garden\')">' +
                            (bisaKirimGarden ? ('🌱 Kirim +1 Bibit ke My Garden (+' + res.xp + ' XP)') : ('🔒 Butuh ' + pCfg.minStarsGarden + '★ untuk Kirim ke My Garden')) +
                        '</button>' +
                    '</div>' +
                '</div>';
        } else {
            let statusKlaim = s.claimedMode === "garden"
                ? ('🌱 <b>+1 Bibit ' + pCfg.nama + '</b> berhasil dikirim ke inventaris <b>My Garden</b> &amp; <b>+⭐ ' + res.xp + ' XP</b>!')
                : ('💰 Plantlet terjual! Dapat <b>+🪙 ' + res.sellCoin + ' Coin</b> &amp; <b>+⭐ ' + res.xp + ' XP</b>!');
            actionBoxHtml =
                '<div class="garden-quiz-feedback ok" style="width:100%; box-sizing:border-box;">' + statusKlaim + '</div>' +
                '<div style="display:flex; gap:8px; width:100%; max-width:460px; margin-top:6px;">' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumKulturJaringan()">🔄 Kultur Spesies Lain</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
                '</div>';
        }

        stageContent =
            '<div class="lab-result-card">' +
                '<div class="lab-result-stars-wrap">' + starsBig + '</div>' +
                '<h3 class="lab-result-title">' + res.predikat + '</h3>' +
                '<div class="lab-result-rewards">' +
                    '<span>' + pCfg.ikon + ' <b>' + pCfg.nama + '</b></span>' +
                    '<span>🎯 Skor: <b>' + res.score + '/100</b></span>' +
                    '<span>🧠 Kuis: <b>' + (res.quizOk ? '✅ Benar' : '❌ Salah') + '</b></span>' +
                '</div>' +
                '<div class="lab-result-explain">' +
                    '<div style="font-size:12px; color:#334155; line-height:1.5;">' +
                        '<b>💡 Fakta Biologi:</b> ' + pCfg.fakta + '<br>' +
                        '• <b>Kesalahan Prosedur:</b> ' + s.mistakes + 'x' +
                    '</div>' +
                '</div>' +
                actionBoxHtml +
            '</div>';
    }

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            stepperHtml +
            stageContent +
        '</div>';
};

// --- HANDLER INTERAKSI KULTUR JARINGAN ---
window.pilihJaringanEksplanLab = function(optIdx) {
    let s = window.labTissueSession;
    if (!s || s.step !== 1 || !s.tissueOpts[optIdx]) return;
    let opt = s.tissueOpts[optIdx];
    if (!opt.ok) {
        s.mistakes++;
        window.tampilkanToastLab("⚠️ Kurang tepat! " + opt.label + " memiliki daya regenerasi sangat rendah. Pilih jaringan meristem muda!", "err");
        return;
    }
    s.tissuePickedOk = true;
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Tepat! Jaringan meristem muda siap diiris tipis menjadi eksplan!", "ok");
};

window.mulaiGeserPisauEksplan = function(e, cutIdx) {
    e.preventDefault();
    e.stopPropagation();
    window._tcKnifeDown = true;
    window.aksiPotongEksplanLab(cutIdx);
};

window.gerakPisauEksplanLab = function(e) {
    if (!window._tcKnifeDown || !window.labTissueSession || window.labTissueSession.step !== 1) return;
    let elUnder = document.elementFromPoint(e.clientX, e.clientY);
    let lane = (elUnder && elUnder.closest) ? elUnder.closest('.tc-cut-lane') : null;
    if (lane) {
        let idx = parseInt(lane.getAttribute('data-cut-idx'), 10);
        if (!isNaN(idx)) window.aksiPotongEksplanLab(idx);
    }
};

document.addEventListener("pointerup", function() { window._tcKnifeDown = false; });
document.addEventListener("pointercancel", function() { window._tcKnifeDown = false; });

window.aksiPotongEksplanLab = function(cutIdx) {
    let s = window.labTissueSession;
    if (!s || s.step !== 1 || !s.tissuePickedOk) return;
    if (cutIdx < 0 || cutIdx >= 4 || s.slicesDone[cutIdx]) return;

    s.slicesDone[cutIdx] = true;
    let semuaTerpotong = s.slicesDone.every(Boolean);
    window.renderMyLabUI();

    if (semuaTerpotong) {
        window._tcKnifeDown = false;
        window.tampilkanToastLab("🔪 Potongan eksplan presisi sempurna! Lanjut Tahap Sterilisasi!", "ok");
        setTimeout(function() {
            if (window.labTissueSession && window.labTissueSession.step === 1) {
                window.labTissueSession.step = 2;
                window.renderMyLabUI();
            }
        }, 700);
    }
};

// Tahap 2: Sterilisasi Timing Gauge
window.mulaiCelupSterilisasiLab = function() {
    let s = window.labTissueSession;
    if (!s || s.step !== 2 || s.bathDipping) return;
    let curBath = window.MY_LAB_TC_STERIL_BATHS[s.bathIdx];
    if (!curBath) return;

    s.bathDipping = true;
    s.bathVal = 0;
    window.renderMyLabUI();

    window.hentikanTimerKulturJaringan();
    window._tcSterilTimer = setInterval(function() {
        let cur = window.labTissueSession;
        if (!cur || cur.step !== 2 || !cur.bathDipping) {
            window.hentikanTimerKulturJaringan();
            return;
        }
        cur.bathVal = Math.min(100, cur.bathVal + curBath.speed);
        let fillEl = document.getElementById("tc-steril-bar-fill");
        let needleEl = document.getElementById("tc-steril-needle");
        let txtEl = document.getElementById("tc-steril-val-txt");
        let vRound = Math.round(cur.bathVal);
        if (fillEl) fillEl.style.width = vRound + "%";
        if (needleEl) needleEl.style.left = vRound + "%";
        if (txtEl) txtEl.innerText = vRound + "%";

        if (cur.bathVal >= 100) {
            window.angkatEksplanSterilisasiLab();
        }
    }, 45);
};

window.angkatEksplanSterilisasiLab = function() {
    let s = window.labTissueSession;
    if (!s || s.step !== 2 || !s.bathDipping) return;
    window.hentikanTimerKulturJaringan();
    s.bathDipping = false;

    let curBath = window.MY_LAB_TC_STERIL_BATHS[s.bathIdx];
    let val = s.bathVal;

    if (val < curBath.minOk) {
        s.mistakes++;
        s.bathVal = 0;
        window.renderMyLabUI();
        window.tampilkanToastLab("⚠️ Terlalu cepat (" + Math.round(val) + "%)! Mikroba belum mati. Coba celup ulang sampai Zona Hijau!", "err");
        return;
    }
    if (val > curBath.maxOk) {
        s.mistakes++;
        s.bathVal = 0;
        window.renderMyLabUI();
        window.tampilkanToastLab("⚠️ Terlalu lama (" + Math.round(val) + "%)! Jaringan eksplan mengalami browning. Ulangi dengan irisan cadangan!", "err");
        return;
    }

    s.bathsDone[s.bathIdx] = true;
    s.bathVal = 0;
    if (s.bathIdx < 2) {
        s.bathIdx++;
        window.renderMyLabUI();
        window.tampilkanToastLab("✅ Steril pas! Lanjut ke larutan berikutnya.", "ok");
    } else {
        window.renderMyLabUI();
        window.tampilkanToastLab("✅ Ketiga tahap sterilisasi sempurna! Lanjut Racik Media Agar MS!", "ok");
        setTimeout(function() {
            if (window.labTissueSession && window.labTissueSession.step === 2) {
                window.labTissueSession.step = 3;
                window.renderMyLabUI();
            }
        }, 750);
    }
};

// Tahap 3: Media MS & Hormon
window.tambahBahanMediaMSLab = function(key) {
    let s = window.labTissueSession;
    if (!s || s.step !== 3) return;
    s.ingredients[key] = true;
    window.renderMyLabUI();
};

window.aturHormonMediaLab = function(tipe, val) {
    let s = window.labTissueSession;
    if (!s || s.step !== 3) return;
    let num = Math.max(0, Math.min(10, parseInt(val, 10) || 0));
    if (tipe === "auksin") s.auksin = num;
    else s.sitokinin = num;
    window.renderMyLabUI();
};

window.ubahHormonMediaLab = function(tipe, delta) {
    let s = window.labTissueSession;
    if (!s || s.step !== 3) return;
    let cur = tipe === "auksin" ? s.auksin : s.sitokinin;
    window.aturHormonMediaLab(tipe, cur + delta);
};

window.sterilisasiAutoklafMediaLab = function() {
    let s = window.labTissueSession;
    if (!s || s.step !== 3) return;

    if (!s.ingredients.ms || !s.ingredients.sukrosa || !s.ingredients.agar) {
        return window.tampilkanToastLab("⚠️ Masukkan ketiga bahan dasar (Garam MS, Sukrosa, & Agar) terlebih dahulu!", "err");
    }
    if (!s.hormoneGoal.cek(s.auksin, s.sitokinin)) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Rasio hormon belum sesuai target: " + s.hormoneGoal.syaratTeks, "err");
    }

    s.autoclaveDone = true;
    window.tampilkanToastLab("🔥 Media MS steril di Autoklaf 121°C & dituang ke botol kultur! Masuk ke Laminar Air Flow...", "ok");
    setTimeout(function() {
        if (window.labTissueSession && window.labTissueSession.step === 3) {
            window.labTissueSession.step = 4;
            window.renderMyLabUI();
        }
    }, 800);
};

// Tahap 4: Inokulasi LAF & Pertumbuhan
window.aksiLAFLab = function(aksi) {
    let s = window.labTissueSession;
    if (!s || s.step !== 4 || s.explantPlanted) return;

    if (aksi === "bunsen") {
        s.bunsenOn = true;
        window.renderMyLabUI();
        window.tampilkanToastLab("🔥 Api Bunsen menyala! Sekarang panaskan ujung pinset.", "ok");
    } else if (aksi === "tweezer") {
        if (!s.bunsenOn) {
            s.mistakes++;
            return window.tampilkanToastLab("⚠️ Nyalakan Api Bunsen terlebih dahulu untuk memanaskan pinset!", "err");
        }
        s.tweezerSterile = true;
        window.renderMyLabUI();
        window.tampilkanToastLab("✨ Ujung pinset steril! Sekarang tanam eksplan ke botol media MS.", "ok");
    } else if (aksi === "plant") {
        if (!s.bunsenOn) {
            s.mistakes++;
            return window.tampilkanToastLab("⚠️ KONTAMINASI! Api Bunsen belum dinyalakan saat membuka mulut botol!", "err");
        }
        if (!s.tweezerSterile) {
            s.mistakes++;
            return window.tampilkanToastLab("⚠️ KONTAMINASI! Pinset belum dipanaskan di atas api Bunsen!", "err");
        }
        s.explantPlanted = true;
        s.growthPhase = 0;
        window.renderMyLabUI();
        window.tampilkanToastLab("🧫 Eksplan berhasil ditanam aseptis! Amati pertumbuhannya di ruang inkubasi.", "ok");
    }
};

window.percepatFaseTumbuhKultur = function() {
    let s = window.labTissueSession;
    if (!s || s.step !== 4 || !s.explantPlanted) return;
    if (s.growthPhase < 3) {
        s.growthPhase++;
        window.renderMyLabUI();
    }
};

window.lanjutTahapAklimatisasiLab = function() {
    let s = window.labTissueSession;
    if (!s || s.step !== 4 || s.growthPhase < 3) return;
    s.step = 5;
    window.renderMyLabUI();
};

// Tahap 5: Aklimatisasi & Kuis
window.aksiAklimatisasiLab = function(bagian) {
    let s = window.labTissueSession;
    if (!s || s.step !== 5) return;
    if (bagian === "hood" && !s.acclim.pot) {
        return window.tampilkanToastLab("⚠️ Pindahkan plantlet ke pot tanah terlebih dahulu!", "err");
    }
    if (bagian === "sun" && !s.acclim.hood) {
        return window.tampilkanToastLab("⚠️ Buka sungkup plastik bertahap dulu sebelum dikenalkan sinar matahari!", "err");
    }
    s.acclim[bagian] = true;
    window.renderMyLabUI();
};

window.pilihKuisKulturLab = function(idx) {
    let s = window.labTissueSession;
    if (!s || s.step !== 5) return;
    s.pickedQuizIdx = idx;
    window.renderMyLabUI();
};

window.selesaikanPraktikumKulturJaringan = function() {
    let s = window.labTissueSession;
    if (!s || s.step !== 5) return;

    if (!s.acclim.pot || !s.acclim.hood || !s.acclim.sun) {
        return window.tampilkanToastLab("⚠️ Selesaikan ketiga langkah aklimatisasi plantlet terlebih dahulu!", "err");
    }
    if (s.pickedQuizIdx < 0) {
        return window.tampilkanToastLab("👆 Jawab pertanyaan konsep kultur jaringan terlebih dahulu!", "err");
    }

    let pCfg = window.cariInfoTanamanTC(s.plantId);
    let quizOk = (s.pickedQuizIdx === s.quiz.ans);
    let score = 100 - Math.min(40, s.mistakes * 10) - (quizOk ? 0 : 20);
    score = Math.max(25, score);

    let stars = 1;
    let predikat = "Plantlet Tumbuh, Tingkatkan Ketelitian Aseptis!";
    let mult = 0.45;
    if (score >= 85 && quizOk) {
        stars = 3;
        predikat = "🌟 Ahli Kultur Jaringan Sempurna!";
        mult = 1.0;
    } else if (score >= 60) {
        stars = 2;
        predikat = "👍 Peneliti Botani Andal!";
        mult = 0.7;
    }

    s.resultData = {
        score: score,
        stars: stars,
        predikat: predikat,
        quizOk: quizOk,
        sellCoin: Math.round(pCfg.sellCoin * mult),
        xp: Math.round(pCfg.rewardXp * mult)
    };
    s.step = 6;
    window.renderMyLabUI();
};

// Tahap 6: Klaim Hadiah (Jual Plantlet ATAU Kirim Bibit ke My Garden)
window.klaimHadiahKulturJaringan = function(mode) {
    let s = window.labTissueSession;
    if (!s || s.step !== 6 || !s.resultData || s.rewardClaimed) return;

    let pCfg = window.cariInfoTanamanTC(s.plantId);
    let res = s.resultData;
    if (mode === "garden" && res.stars < pCfg.minStarsGarden) return;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyLab(uName);
    if (!lb) return;

    if (mode === "garden") {
        if (typeof window.pastikanStrukturMyGarden === "function") {
            window.pastikanStrukturMyGarden(uName);
        }
        if (lb.myGardenData && lb.myGardenData.seedInventory) {
            let gid = pCfg.gardenId;
            lb.myGardenData.seedInventory[gid] = (Number(lb.myGardenData.seedInventory[gid]) || 0) + 1;
        }
    } else {
        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + res.sellCoin;
        lb.xpTersedia = lb.coin;
    }

    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + res.xp;
    lb.xp = lb.xpTotal;

    let rec = lb.myLabData.records.tissue_culture || { bestStars: 0, completions: 0, lastAt: 0 };
    rec.bestStars = Math.max(Number(rec.bestStars) || 0, res.stars);
    rec.completions = (Number(rec.completions) || 0) + 1;
    rec.lastAt = Date.now();
    lb.myLabData.records.tissue_culture = rec;
    lb.myLabData.totalCompleted = (Number(lb.myLabData.totalCompleted) || 0) + 1;

    let totBintang = 0;
    Object.values(lb.myLabData.records).forEach(function(r) {
        if (r && r.bestStars) totBintang += Number(r.bestStars) || 0;
    });
    lb.myLabData.totalStars = totBintang;

    s.rewardClaimed = true;
    s.claimedMode = mode;

    window.simpanDataLabKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiSaldoHUDGarden === "function") window.perbaruiSaldoHUDGarden();
    if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();

    window.renderMyLabUI();
};
// =========================================================================
// 7. PRAKTIKUM 4: REKOMBINASI DNA — PRODUKSI INSULIN (COOKING MAMA WORKBENCH)
// =========================================================================
window.MY_LAB_DNA_ENZYMES = [
    {
        id: "ecori",
        nama: "EcoRI",
        sumber: "Escherichia coli",
        seqTop: "GAATTC",
        seqBot: "CTTAAG",
        cutPos: 1,
        labelPotong: "5'-G | AATTC-3'",
        overhangTop: "AATT",
        overhangBot: "TTAA",
        decoys: [
            { top: "GCTAGC", bot: "CGATCG" },
            { top: "CCGATG", bot: "GGCTAC" }
        ]
    },
    {
        id: "bamhi",
        nama: "BamHI",
        sumber: "Bacillus amyloliquefaciens",
        seqTop: "GGATCC",
        seqBot: "CCTAGG",
        cutPos: 1,
        labelPotong: "5'-G | GATCC-3'",
        overhangTop: "GATC",
        overhangBot: "CTAG",
        decoys: [
            { top: "GAATTC", bot: "CTTAAG" },
            { top: "TGCATG", bot: "ACGTAC" }
        ]
    },
    {
        id: "hindiii",
        nama: "HindIII",
        sumber: "Haemophilus influenzae",
        seqTop: "AAGCTT",
        seqBot: "TTCGAA",
        cutPos: 1,
        labelPotong: "5'-A | AGCTT-3'",
        overhangTop: "AGCT",
        overhangBot: "TCGA",
        decoys: [
            { top: "GGATCC", bot: "CCTAGG" },
            { top: "CATGCG", bot: "GTACGC" }
        ]
    }
];

window.MY_LAB_DNA_QUIZ_POOL = [
    {
        q: "Mengapa DNA gen insulin manusia dan plasmid bakteri E. coli harus dipotong menggunakan enzim restriksi endonuklease yang SAMA?",
        opts: [
            "Agar keduanya menghasilkan ujung lengket (sticky ends) dengan urutan basa nitrogen yang saling komplementer sehingga dapat disambungkan",
            "Agar bakteri E. coli langsung mati saat dimasukkan ke bioreaktor",
            "Karena plasmid hanya dapat dipotong dengan suhu dingin di bawah 0°C",
            "Agar rantai DNA berubah menjadi rantai tunggal RNA permanen"
        ],
        ans: 0
    },
    {
        q: "Enzim yang berperan menyambungkan ikatan fosfodiester secara permanen antara gen insulin manusia dengan plasmid vektor E. coli adalah...",
        opts: [
            "Enzim DNA Ligase",
            "Enzim Restriksi Endonuklease",
            "Enzim Amilase Pankreas",
            "Enzim Lipase"
        ],
        ans: 0
    },
    {
        q: "Apa fungsi utama perlakuan kejutan panas (Heat Shock 42°C) pada tahap transformasi bakteri E. coli?",
        opts: [
            "Membuka pori-pori membran sel bakteri sementara agar plasmid DNA rekombinan dapat masuk ke dalam sel",
            "Memasak bakteri agar langsung berubah menjadi hormon insulin",
            "Memotong urutan basa nitrogen pada kromosom utama manusia",
            "Menghancurkan dinding sel tumbuhan agar membentuk kalus"
        ],
        ans: 0
    },
    {
        q: "Mengapa plasmid bakteri E. coli sangat ideal digunakan sebagai vektor (pembawa gen) dalam teknologi DNA rekombinan?",
        opts: [
            "Berukuran kecil, berbentuk sirkuler, dapat bereplikasi mandiri, dan bakteri E. coli membelah diri sangat cepat",
            "Memiliki ukuran jauh lebih besar dari seluruh kromosom manusia",
            "Tidak memiliki urutan basa nitrogen sehingga tidak perlu dipotong",
            "Hanya dapat hidup di dalam jaringan otot rangka manusia"
        ],
        ans: 0
    },
    {
        q: "Keunggulan utama produksi insulin manusia menggunakan bakteri rekombinan (Humulin) dibandingkan ekstraksi dari pankreas hewan ternak adalah...",
        opts: [
            "Struktur asam aminonya identik 100% dengan insulin manusia, risiko alergi minimal, dan dapat diproduksi massal dalam bioreaktor",
            "Tidak memerlukan sel inang maupun enzim penyambung DNA",
            "Bekerja tanpa perlu proses pemurnian dari tangki fermentasi",
            "Mengubah hormon insulin menjadi karbohidrat sederhana"
        ],
        ans: 0
    }
];

window.cariEnzimRestriksiLab = function(enzId) {
    return window.MY_LAB_DNA_ENZYMES.find(function(e) { return e.id === enzId; }) || window.MY_LAB_DNA_ENZYMES[0];
};

window.bangunPitaBasaHTML = function(seqTop, seqBot, cutPos, isCut) {
    let warnaBasa = function(ch) {
        if (ch === "A") return "base-a";
        if (ch === "T") return "base-t";
        if (ch === "G") return "base-g";
        return "base-c";
    };

    let rowTop = '<div class="dna-strand-row"><span class="dna-end-lbl">5\'</span>';
    let rowBot = '<div class="dna-strand-row"><span class="dna-end-lbl">3\'</span>';

    for (let i = 0; i < seqTop.length; i++) {
        let cTop = seqTop.charAt(i);
        let cBot = seqBot.charAt(i);
        let sepTop = (i === cutPos) ? '<span class="dna-cut-gap' + (isCut ? ' is-split' : '') + '">' + (isCut ? '✂️' : '┆') + '</span>' : '';
        let sepBot = (i === (seqBot.length - cutPos)) ? '<span class="dna-cut-gap' + (isCut ? ' is-split' : '') + '">' + (isCut ? '✂️' : '┆') + '</span>' : '';
        rowTop += sepTop + '<span class="dna-base-chip ' + warnaBasa(cTop) + '">' + cTop + '</span>';
        rowBot += sepBot + '<span class="dna-base-chip ' + warnaBasa(cBot) + '">' + cBot + '</span>';
    }

    rowTop += '<span class="dna-end-lbl">3\'</span></div>';
    rowBot += '<span class="dna-end-lbl">5\'</span></div>';
    return '<div class="dna-duplex-box' + (isCut ? ' is-cut-done' : '') + '">' + rowTop + rowBot + '</div>';
};

window.mulaiPraktikumRekombinasiDNA = function() {
    window.hentikanTimerDnaLab();
    let enzTarget = window.MY_LAB_DNA_ENZYMES[Math.floor(Math.random() * window.MY_LAB_DNA_ENZYMES.length)];

    let organOpts = [
        { label: "Sel Beta Pankreas (Pulau Langerhans)", ok: true, sub: "Penghasil hormon insulin alami" },
        { label: "Sel Epitel Lambung", ok: false, sub: "Penghasil HCl & pepsinogen" },
        { label: "Sel Otot Rangka", ok: false, sub: "Berperan dalam kontraksi gerak" }
    ].sort(function() { return Math.random() - 0.5; });

    let vektorOpts = [
        { label: "Plasmid Sirkuler E. coli", ok: true, sub: "DNA cincin ekstrakromosomal replikasi mandiri" },
        { label: "Ribosom 70S Bakteri", ok: false, sub: "Organel tempat sintesis protein" },
        { label: "Flagela E. coli", ok: false, sub: "Alat gerak bakteri" }
    ].sort(function() { return Math.random() - 0.5; });

    // Siapkan 3 fragmen untuk tahap Ligasi (1 cocok, 2 pengecoh)
    let otherEnz = window.MY_LAB_DNA_ENZYMES.find(function(e) { return e.id !== enzTarget.id; }) || window.MY_LAB_DNA_ENZYMES[0];
    let ligasiFrags = [
        {
            id: "frag_ok",
            ok: true,
            judul: "Gen Insulin Manusia (Potongan " + enzTarget.nama + ")",
            ujung: "Sticky Ends: " + enzTarget.overhangTop + " / " + enzTarget.overhangBot,
            ket: "Pasangan basa komplementer cocok 100% dengan celah plasmid!"
        },
        {
            id: "frag_wrong_enz",
            ok: false,
            judul: "Gen Insulin (Potongan " + otherEnz.nama + ")",
            ujung: "Sticky Ends: " + otherEnz.overhangTop + " / " + otherEnz.overhangBot,
            ket: "Dipotong enzim berbeda sehingga basa tidak saling berpasangan."
        },
        {
            id: "frag_blunt",
            ok: false,
            judul: "Fragmen DNA Ujung Tumpul (Blunt End)",
            ujung: "Tanpa Overhang: GCGC / CGCG",
            ket: "Tidak memiliki ujung lengket yang cocok untuk celah plasmid ini."
        }
    ].sort(function() { return Math.random() - 0.5; });

    let ligEnzOpts = [
        { id: "ligase",   nama: "DNA Ligase",   ok: true,  sub: "Menyambung ikatan fosfodiester DNA" },
        { id: "helikase", nama: "DNA Helikase", ok: false, sub: "Membuka rantai ganda DNA" },
        { id: "amilase",  nama: "Amilase",      ok: false, sub: "Memecah amilum menjadi maltosa" }
    ].sort(function() { return Math.random() - 0.5; });

    let rawQ = window.MY_LAB_DNA_QUIZ_POOL[Math.floor(Math.random() * window.MY_LAB_DNA_QUIZ_POOL.length)];
    let taggedQ = rawQ.opts.map(function(txt, i) { return { txt: txt, ok: i === rawQ.ans }; }).sort(function() { return Math.random() - 0.5; });

    window.labDnaSession = {
        step: 1, // 1: Isolasi & Ekstraksi, 2: Restriksi, 3: Ligasi, 4: Transformasi & Bioreaktor, 5: Evaluasi, 6: Hasil & Panen Vial
        enzId: enzTarget.id,
        // Tahap 1
        organOpts: organOpts,
        vektorOpts: vektorOpts,
        organOk: false,
        insulinIsolated: false,
        vektorOk: false,
        plasmidExtracted: false,
        // Tahap 2 (Restriksi)
        pickedEnzymeId: "",
        cuts: { insulinLeft: false, insulinRight: false, plasmidSite: false },
        // Tahap 3 (Ligasi)
        ligasiFrags: ligasiFrags,
        ligEnzOpts: ligEnzOpts,
        insertPlaced: false,
        ligasePicked: false,
        ligasePct: 0,
        // Tahap 4 (Transformasi & Fermentasi)
        heatDipping: false,
        heatVal: 0,
        heatDone: false,
        bioreactor: { temp: false, nutrient: false, purify: false },
        // Tahap 5 (Kuis)
        quiz: { q: rawQ.q, opts: taggedQ.map(function(x) { return x.txt; }), ans: taggedQ.findIndex(function(x) { return x.ok; }) },
        pickedQuizIdx: -1,
        // Skor & Hasil
        mistakes: 0,
        resultData: null
    };

    window.activeLabView = "dna_recomb";
    window.renderMyLabUI();
};

window.bangunSVGBioreaktorInsulin = function(bio) {
    let levelFill = 28 + (bio.temp ? 20 : 0) + (bio.nutrient ? 30 : 0) + (bio.purify ? 12 : 0);
    let cairY = 148 - Math.round(levelFill * 1.05);
    let cairCol = bio.purify ? "#38bdf8" : (bio.nutrient ? "#4ade80" : "#fde047");
    let colonies = '';
    let jmlKoloni = bio.nutrient ? 12 : (bio.temp ? 5 : 2);
    for (let i = 0; i < jmlKoloni; i++) {
        let cx = 42 + ((i * 29) % 72);
        let cy = Math.max(cairY + 12, 136 - ((i * 17) % 52));
        colonies += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="6" ry="3" transform="rotate(' + ((i * 35) % 180) + ' ' + cx + ' ' + cy + ')" fill="#14532d" opacity="0.72"/>';
    }

    return '<svg viewBox="0 0 156 176" width="136" height="154">' +
        '<!-- Tutup & Motor Pengaduk Bioreaktor -->' +
        '<rect x="52" y="8" width="52" height="16" rx="5" fill="#475569" stroke="#0f172a" stroke-width="2.5"/>' +
        '<line x1="78" y1="24" x2="78" y2="128" stroke="#64748b" stroke-width="4"/>' +
        '<rect x="56" y="102" width="44" height="6" rx="3" fill="#334155"/>' +
        '<!-- Tabung Kaca Bioreaktor -->' +
        '<rect x="28" y="34" width="100" height="122" rx="18" fill="rgba(248,250,252,0.9)" stroke="#0284c7" stroke-width="4"/>' +
        '<clipPath id="dnaBioClip"><rect x="31" y="37" width="94" height="116" rx="15"/></clipPath>' +
        '<rect x="28" y="' + cairY + '" width="100" height="130" fill="' + cairCol + '" opacity="0.75" clip-path="url(#dnaBioClip)"/>' +
        '<g clip-path="url(#dnaBioClip)">' + colonies + '</g>' +
        '<!-- Indikator Suhu Digital -->' +
        '<rect x="94" y="44" width="44" height="20" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>' +
        '<text x="116" y="58" font-size="10" font-weight="900" fill="' + (bio.temp ? '#4ade80' : '#facc15') + '" text-anchor="middle">' + (bio.temp ? '37°C' : '24°C') + '</text>' +
        '<!-- Kaki Penyangga -->' +
        '<path d="M40,156 L32,168 M116,156 L124,168" stroke="#334155" stroke-width="5" stroke-linecap="round"/>' +
    '</svg>';
};

window.renderDnaRecombStage = function(bodyEl) {
    let s = window.labDnaSession;
    if (!s) return;
    let enz = window.cariEnzimRestriksiLab(s.enzId);

    let stepNames = ["1. Isolasi", "2. Restriksi", "3. Ligasi", "4. Fermentasi", "5. Evaluasi"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">🧬 Enzim Target: ' + enz.nama + ' (' + enz.labelPotong + ')</span></div>';

    let stageContent = '';

    // --- TAHAP 1: ISOLASI SEL BETA PANKREAS & EKSTRAKSI PLASMID E. COLI ---
    if (s.step === 1) {
        let panelPankreas = '';
        if (!s.organOk) {
            let optHtml = s.organOpts.map(function(o, i) {
                return '<button type="button" class="lab-analysis-opt" onclick="window.pilihSumberDnaLab(\'organ\', ' + i + ')">' +
                    '<span>🫀</span><div><b>' + o.label + '</b><div style="font-size:10px; color:#64748b;">' + o.sub + '</div></div>' +
                '</button>';
            }).join('');
            panelPankreas =
                '<div class="dna-iso-card">' +
                    '<div class="dna-iso-head"><span>🧬 1. Isolasi Gen Insulin Manusia</span></div>' +
                    '<p class="dna-iso-sub">Pilih sel donor penghasil hormon insulin yang tepat:</p>' +
                    '<div class="dna-mini-opts">' + optHtml + '</div>' +
                '</div>';
        } else {
            panelPankreas =
                '<div class="dna-iso-card is-ready">' +
                    '<div class="dna-iso-head"><span>🧬 1. Sel Beta Pankreas Terpilih</span><span class="cozy-tag green">✓ Tepat</span></div>' +
                    '<div class="dna-visual-tube">' + (s.insulinIsolated ? '🧬✨ <b>Gen Insulin Terisolasi!</b>' : '🧫 Sel Beta Pankreas Siap Lisis') + '</div>' +
                    '<button type="button" class="' + (s.insulinIsolated ? 'mypet-gray-cta sm' : 'mypet-green-cta sm') + '" ' + (s.insulinIsolated ? 'disabled' : '') + ' onclick="window.aksiEkstraksiTahap1DNA(\'insulin\')">' +
                        (s.insulinIsolated ? '✅ DNA Gen Insulin Siap' : '🧪 Lisis Membran &amp; Isolasi Gen Insulin') +
                    '</button>' +
                '</div>';
        }

        let panelPlasmid = '';
        if (!s.vektorOk) {
            let vOptHtml = s.vektorOpts.map(function(o, i) {
                return '<button type="button" class="lab-analysis-opt" onclick="window.pilihSumberDnaLab(\'vektor\', ' + i + ')">' +
                    '<span>🦠</span><div><b>' + o.label + '</b><div style="font-size:10px; color:#64748b;">' + o.sub + '</div></div>' +
                '</button>';
            }).join('');
            panelPlasmid =
                '<div class="dna-iso-card">' +
                    '<div class="dna-iso-head"><span>🦠 2. Ekstraksi Vektor E. coli</span></div>' +
                    '<p class="dna-iso-sub">Pilih struktur bakteri E. coli yang berfungsi sebagai vektor pembawa gen:</p>' +
                    '<div class="dna-mini-opts">' + vOptHtml + '</div>' +
                '</div>';
        } else {
            panelPlasmid =
                '<div class="dna-iso-card is-ready">' +
                    '<div class="dna-iso-head"><span>🦠 2. Vektor Plasmid Terpilih</span><span class="cozy-tag green">✓ Tepat</span></div>' +
                    '<div class="dna-visual-tube">' + (s.plasmidExtracted ? '⭕✨ <b>Plasmid Sirkuler Terisolasi!</b>' : '🦠 Kultur E. coli Siap Ekstraksi') + '</div>' +
                    '<button type="button" class="' + (s.plasmidExtracted ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (s.plasmidExtracted ? 'disabled' : '') + ' onclick="window.aksiEkstraksiTahap1DNA(\'plasmid\')">' +
                        (s.plasmidExtracted ? '✅ Plasmid E. coli Siap' : '🌀 Sentrifugasi &amp; Ekstrak Plasmid') +
                    '</button>' +
                '</div>';
        }

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🧬 Tahap 1: Isolasi Gen Insulin &amp; Ekstraksi Plasmid E. coli</strong>' +
                '<span>Selesaikan kedua panel di bawah: ambil <b>Gen Insulin</b> dari pankreas manusia dan ekstrak <b>Plasmid</b> dari bakteri E. coli!</span>' +
            '</div>' +
            '<div class="dna-two-col">' + panelPankreas + panelPlasmid + '</div>';
    }

    // --- TAHAP 2: PEMOTONGAN ENZIM RESTRIKSI PADA URUTAN BASA NITROGEN ---
    else if (s.step === 2) {
        let doneCuts = (s.cuts.insulinLeft ? 1 : 0) + (s.cuts.insulinRight ? 1 : 0) + (s.cuts.plasmidSite ? 1 : 0);

        let enzButtons = window.MY_LAB_DNA_ENZYMES.map(function(e) {
            let isPicked = (s.pickedEnzymeId === e.id);
            return '<button type="button" class="dna-enz-bottle' + (isPicked ? ' is-picked' : '') + '" onclick="window.pilihEnzimRestriksiLab(\'' + e.id + '\')">' +
                '<div class="dna-enz-title">✂️ ' + e.nama + '</div>' +
                '<div class="dna-enz-seq">' + e.labelPotong + '</div>' +
                '<small>' + e.sumber + '</small>' +
            '</button>';
        }).join('');

        let dec1 = enz.decoys[0];
        let dec2 = enz.decoys[1];

        let dnaBlocksHtml =
            '<div class="dna-cut-bench">' +
                '<div class="dna-cut-group">' +
                    '<div class="dna-cut-group-title">🧬 A. Pita DNA Manusia (Potong 2 situs pengenalan <b>' + enz.seqTop + '</b> di kiri &amp; kanan Gen Insulin):</div>' +
                    '<div class="dna-sites-row">' +
                        '<button type="button" class="dna-site-btn' + (s.cuts.insulinLeft ? ' is-cut' : '') + '" onclick="window.aksiPotongSitusDna(\'insulinLeft\', true)">' +
                            '<div class="dna-site-lbl">Situs Kiri ' + (s.cuts.insulinLeft ? '✅ Terpotong' : '✂️ Klik Potong') + '</div>' +
                            window.bangunPitaBasaHTML(enz.seqTop, enz.seqBot, enz.cutPos, s.cuts.insulinLeft) +
                        '</button>' +
                        '<button type="button" class="dna-site-btn is-gene-body" onclick="window.aksiPotongSitusDna(\'decoy1\', false)">' +
                            '<div class="dna-site-lbl">Inti Gen Insulin (Jangan Dipotong!)</div>' +
                            window.bangunPitaBasaHTML(dec1.top, dec1.bot, 2, false) +
                        '</button>' +
                        '<button type="button" class="dna-site-btn' + (s.cuts.insulinRight ? ' is-cut' : '') + '" onclick="window.aksiPotongSitusDna(\'insulinRight\', true)">' +
                            '<div class="dna-site-lbl">Situs Kanan ' + (s.cuts.insulinRight ? '✅ Terpotong' : '✂️ Klik Potong') + '</div>' +
                            window.bangunPitaBasaHTML(enz.seqTop, enz.seqBot, enz.cutPos, s.cuts.insulinRight) +
                        '</button>' +
                    '</div>' +
                '</div>' +

                '<div class="dna-cut-group">' +
                    '<div class="dna-cut-group-title">⭕ B. Cincin Plasmid E. coli (Potong 1 situs pengenalan <b>' + enz.seqTop + '</b> agar cincin terbuka):</div>' +
                    '<div class="dna-sites-row two-col">' +
                        '<button type="button" class="dna-site-btn" onclick="window.aksiPotongSitusDna(\'decoy2\', false)">' +
                            '<div class="dna-site-lbl">Wilayah ori (Asal Replikasi)</div>' +
                            window.bangunPitaBasaHTML(dec2.top, dec2.bot, 2, false) +
                        '</button>' +
                        '<button type="button" class="dna-site-btn' + (s.cuts.plasmidSite ? ' is-cut' : '') + '" onclick="window.aksiPotongSitusDna(\'plasmidSite\', true)">' +
                            '<div class="dna-site-lbl">Situs Restriksi Plasmid ' + (s.cuts.plasmidSite ? '✅ Terbuka' : '✂️ Klik Potong') + '</div>' +
                            window.bangunPitaBasaHTML(enz.seqTop, enz.seqBot, enz.cutPos, s.cuts.plasmidSite) +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>✂️ Tahap 2: Pemotongan Enzim Restriksi (' + doneCuts + '/3 Potongan)</strong>' +
                '<span>1) Pilih <b>Enzim Restriksi</b> yang mengenali urutan palindrom <b>5\'-' + enz.seqTop + '-3\'</b>, lalu 2) Ketuk 3 situs pengenalan yang tepat pada DNA Insulin &amp; Plasmid!</span>' +
            '</div>' +
            '<div class="dna-enz-tray">' + enzButtons + '</div>' +
            dnaBlocksHtml;
    }

    // --- TAHAP 3: PENYAMBUNGAN / LIGASI DNA REKOMBINAN ---
    else if (s.step === 3) {
        let plasmidVisual =
            '<div class="dna-lig-visual-card">' +
                '<svg viewBox="0 0 220 170" width="200" height="154">' +
                    '<!-- Cincin Plasmid Terbuka -->' +
                    '<path d="M 65,45 A 62,62 0 1,0 155,45" fill="none" stroke="#0284c7" stroke-width="14" stroke-linecap="round"/>' +
                    '<text x="110" y="148" font-size="10" font-weight="900" fill="#0369a1" text-anchor="middle">Plasmid E. coli</text>' +
                    (s.insertPlaced
                        ? '<path d="M 67,44 Q 110,12 153,44" fill="none" stroke="' + (s.ligasePct >= 100 ? '#16a34a' : '#f97316') + '" stroke-width="14" stroke-linecap="round"/>' +
                          '<text x="110" y="24" font-size="10" font-weight="900" fill="' + (s.ligasePct >= 100 ? '#15803d' : '#c2410c') + '" text-anchor="middle">Gen Insulin</text>' +
                          (s.ligasePct >= 100 ? '<text x="110" y="92" font-size="12" font-weight="900" fill="#15803d" text-anchor="middle">✨ rDNA UTUH!</text>' : '')
                        : '<path d="M 70,40 Q 110,16 150,40" fill="none" stroke="#94a3b8" stroke-width="4" stroke-dasharray="6,6"/>' +
                          '<text x="110" y="26" font-size="10" font-weight="800" fill="#64748b" text-anchor="middle">Celah Sticky Ends: ' + enz.overhangTop + '</text>') +
                    '<circle cx="65" cy="45" r="7" fill="' + (s.ligasePct >= 100 ? '#22c55e' : '#facc15') + '" stroke="#0f172a" stroke-width="2"/>' +
                    '<circle cx="155" cy="45" r="7" fill="' + (s.ligasePct >= 100 ? '#22c55e' : '#facc15') + '" stroke="#0f172a" stroke-width="2"/>' +
                '</svg>' +
                '<div class="dna-sticky-hint">Celah Ujung Lengket: <b>5\'-' + enz.overhangTop + '</b> / <b>' + enz.overhangBot + '-5\'</b></div>' +
            '</div>';

        let rightPanel = '';
        if (!s.insertPlaced) {
            let fragHtml = s.ligasiFrags.map(function(f, idx) {
                return '<button type="button" class="lab-analysis-opt dna-frag-btn" onclick="window.aksiSisipkanFragmenDNA(' + idx + ')">' +
                    '<span>🧬</span><div><b>' + f.judul + '</b><div style="font-size:10.5px; color:#0284c7; font-weight:800;">' + f.ujung + '</div></div>' +
                '</button>';
            }).join('');
            rightPanel =
                '<div class="lab-controls-card">' +
                    '<div style="font-size:12.5px; font-weight:800; color:#0b3954;">1. Pilih Fragmen Gen Insulin yang Pasangannya Komplementer:</div>' +
                    '<div class="dna-mini-opts">' + fragHtml + '</div>' +
                '</div>';
        } else if (!s.ligasePicked) {
            let enzLigHtml = s.ligEnzOpts.map(function(e, idx) {
                return '<button type="button" class="lab-analysis-opt" onclick="window.pilihEnzimLigasiLab(' + idx + ')">' +
                    '<span>🧪</span><div><b>' + e.nama + '</b><div style="font-size:10px; color:#64748b;">' + e.sub + '</div></div>' +
                '</button>';
            }).join('');
            rightPanel =
                '<div class="lab-controls-card">' +
                    '<div style="font-size:12.5px; font-weight:800; color:#15803d;">✅ Fragmen Gen Insulin Terpasang (Ikatan Hidrogen Sementara)!</div>' +
                    '<div style="font-size:12px; font-weight:800; color:#0b3954;">2. Pilih Enzim Penyambung Ikatan Fosfodiester Permanen:</div>' +
                    '<div class="dna-mini-opts">' + enzLigHtml + '</div>' +
                '</div>';
        } else {
            rightPanel =
                '<div class="lab-controls-card">' +
                    '<div style="font-size:12.5px; font-weight:800; color:#15803d;">🧬 Enzim DNA Ligase Aktif!</div>' +
                    '<p style="margin:0; font-size:11.5px; color:#475569;">Ketuk cepat tombol di bawah untuk mengatalisis penyambungan ikatan fosfodiester hingga <b>100%</b>!</p>' +
                    '<div class="garden-prog-wrap">' +
                        '<div class="garden-prog-top"><span>Progres Ligasi rDNA</span><b>' + s.ligasePct + '%</b></div>' +
                        '<div class="garden-prog-track"><div class="garden-prog-fill" style="width:' + s.ligasePct + '%;"></div></div>' +
                    '</div>' +
                    '<button type="button" class="mypet-green-cta" onclick="window.aksiKatalisisLigaseLab()">⚡ Katalisis Ligasi (+25%)</button>' +
                '</div>';
        }

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🔗 Tahap 3: Penyambungan &amp; Ligasi DNA Rekombinan (rDNA)</strong>' +
                '<span>Pasangkan fragmen Gen Insulin dengan <b>sticky ends</b> yang cocok, lalu segel dengan <b>Enzim DNA Ligase</b>!</span>' +
            '</div>' +
            '<div class="tc-media-split">' + plasmidVisual + rightPanel + '</div>';
    }

    // --- TAHAP 4: TRANSFORMASI HEAT SHOCK 42°C & FERMENTASI BIOREAKTOR ---
    else if (s.step === 4) {
        if (!s.heatDone) {
            stageContent =
                '<div class="lab-instruction-banner">' +
                    '<strong>🔥 Tahap 4A: Transformasi rDNA ke E. coli (Heat Shock 42°C)</strong>' +
                    '<span>Tekan <b>Mulai Heat Shock</b> lalu tekan <b>Dinginkan di Es!</b> tepat saat jarum berada di <b>Zona Hijau (42°C)</b> agar plasmid masuk sempurna tanpa membunuh bakteri!</span>' +
                '</div>' +
                '<div class="tc-steril-panel">' +
                    '<div class="tc-steril-head">' +
                        '<b>🦠 Tabung E. coli Kompeten (CaCl2) + Plasmid Rekombinan</b>' +
                        '<span>Kejutan panas membuka pori membran sel bakteri sementara.</span>' +
                    '</div>' +
                    '<div class="tc-gauge-track">' +
                        '<div class="tc-gauge-green-zone" style="left:46%; width:30%;">ZONA 42°C OPTIMAL</div>' +
                        '<div id="dna-heat-bar-fill" class="tc-gauge-fill" style="width:' + Math.round(s.heatVal) + '%; background:rgba(234,88,12,0.45);"></div>' +
                        '<div id="dna-heat-needle" class="tc-gauge-needle" style="left:' + Math.round(s.heatVal) + '%;"></div>' +
                    '</div>' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">' +
                        '<span style="font-size:12px; font-weight:800; color:#334155;">Intensitas Heat Shock: <b id="dna-heat-val-txt">' + Math.round(s.heatVal) + '%</b> (Target: 46%–76%)</span>' +
                        (!s.heatDipping
                            ? '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:9px 22px;" onclick="window.mulaiHeatShockDnaLab()">🔥 Mulai Heat Shock (42°C)</button>'
                            : '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:9px 24px; background:linear-gradient(180deg,#38bdf8,#0284c7); border-color:#0c4a6e;" onclick="window.hentikanHeatShockDnaLab()">❄️ Dinginkan di Es Sekarang!</button>') +
                    '</div>' +
                '</div>';
        } else {
            let bio = s.bioreactor;
            let semuaBio = bio.temp && bio.nutrient && bio.purify;
            stageContent =
                '<div class="lab-instruction-banner">' +
                    '<strong>🏭 Tahap 4B: Fermentasi Bioreaktor &amp; Pemurnian Vial Insulin</strong>' +
                    '<span>Jalankan 3 prosedur tangki fermenter secara berurutan agar koloni E. coli rekombinan memproduksi <b>Vial Insulin Murni</b>!</span>' +
                '</div>' +
                '<div class="tc-growth-card">' +
                    window.bangunSVGBioreaktorInsulin(bio) +
                    '<div class="tc-growth-info">' +
                        '<div class="dna-mini-opts">' +
                            '<button type="button" class="tc-ing-btn' + (bio.temp ? ' is-added' : '') + '" ' + (bio.temp ? 'disabled' : '') + ' onclick="window.aksiBioreaktorDnaLab(\'temp\')">' +
                                '<b>' + (bio.temp ? '✅ ' : '1. ') + '🌡️ Stabilkan Suhu Bioreaktor 37°C</b><small>Suhu optimum pembelahan biner E. coli</small>' +
                            '</button>' +
                            '<button type="button" class="tc-ing-btn' + (bio.nutrient ? ' is-added' : '') + '" ' + (bio.nutrient ? 'disabled' : '') + ' onclick="window.aksiBioreaktorDnaLab(\'nutrient\')">' +
                                '<b>' + (bio.nutrient ? '✅ ' : '2. ') + '🫧 Aktifkan Aerator O2 &amp; Media Nutrisi</b><small>Ekspresi gen insulin secara massal</small>' +
                            '</button>' +
                            '<button type="button" class="tc-ing-btn' + (bio.purify ? ' is-added' : '') + '" ' + (bio.purify ? 'disabled' : '') + ' onclick="window.aksiBioreaktorDnaLab(\'purify\')">' +
                                '<b>' + (bio.purify ? '✅ ' : '3. ') + '💉 Ekstraksi, Pemurnian, &amp; Kemas Vial</b><small>Memisahkan insulin murni dari sel bakteri</small>' +
                            '</button>' +
                        '</div>' +
                        (semuaBio ? '<button type="button" class="mypet-green-cta sm" style="margin-top:10px;" onclick="window.lanjutTahapEvaluasiDnaLab()">💉 Vial Insulin Siap! Lanjut Evaluasi ➔</button>' : '') +
                    '</div>' +
                '</div>';
        }
    }

    // --- TAHAP 5: EVALUASI KONSEP REKOMBINASI DNA ---
    else if (s.step === 5) {
        let letters = ["A", "B", "C", "D"];
        let qOptsHtml = s.quiz.opts.map(function(txt, idx) {
            return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === idx ? ' is-picked' : '') + '" onclick="window.pilihKuisDnaLab(' + idx + ')"><b>' + letters[idx] + '.</b> <span>' + txt + '</span></button>';
        }).join('');

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🧠 Tahap 5: Evaluasi Konsep Rekombinasi DNA</strong>' +
                '<span>Jawab 1 pertanyaan konsep bioteknologi modern berikut untuk memanen Vial Insulin &amp; meraih hadiah!</span>' +
            '</div>' +
            '<div class="lab-diag-panel">' +
                '<div class="lab-diag-block">' +
                    '<label>' + s.quiz.q + '</label>' +
                    '<div class="lab-analysis-opts-grid">' + qOptsHtml + '</div>' +
                '</div>' +
                '<button type="button" class="mypet-green-cta" onclick="window.selesaikanPraktikumRekombinasiDNA()">💉 Panen Vial Insulin &amp; Lihat Hasil</button>' +
            '</div>';
    }

    // --- TAHAP 6: HASIL BINTANG 1-3 & PANEN VIAL INSULIN ---
    else if (s.step === 6 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) {
            starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        }

        let vialsHtml = '';
        for (let v = 0; v < res.vials; v++) {
            vialsHtml += '<span class="dna-vial-badge">💉 Vial Insulin #' + (v + 1) + '</span>';
        }

        stageContent =
            '<div class="lab-result-card">' +
                '<div class="lab-result-stars-wrap">' + starsBig + '</div>' +
                '<h3 class="lab-result-title">' + res.predikat + '</h3>' +
                '<div class="dna-vials-row">' + vialsHtml + '</div>' +
                '<div class="lab-result-rewards">' +
                    '<span>🪙 <b>+' + res.coin + ' Coin</b></span>' +
                    '<span>⭐ <b>+' + res.xp + ' XP</b></span>' +
                    '<span>🎯 Skor: <b>' + res.score + '/100</b></span>' +
                '</div>' +
                '<div class="lab-result-explain">' +
                    '<div style="font-size:12px; color:#334155; line-height:1.5;">' +
                        '<b>💡 Fakta Bioteknologi (Humulin, 1982):</b> Insulin rekombinan merupakan obat bioteknologi modern pertama yang disetujui untuk manusia. Dengan menyisipkan gen insulin ke plasmid <i>E. coli</i> menggunakan enzim restriksi <b>' + enz.nama + '</b> dan <b>DNA Ligase</b>, bakteri memproduksi insulin identik manusia secara aman dan massal.<br>' +
                        '• <b>Evaluasi Konsep:</b> ' + (res.quizOk ? '✅ Benar' : '❌ Kurang Tepat') + ' • <b>Kesalahan Prosedur:</b> ' + s.mistakes + 'x' +
                    '</div>' +
                '</div>' +
                '<div style="display:flex; gap:8px; width:100%; max-width:440px; margin-top:8px;">' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumRekombinasiDNA()">🔄 Produksi Batch Baru</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
                '</div>' +
            '</div>';
    }

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            stepperHtml +
            stageContent +
        '</div>';
};

// --- HANDLER INTERAKSI TAHAP 1 ---
window.pilihSumberDnaLab = function(bagian, optIdx) {
    let s = window.labDnaSession;
    if (!s || s.step !== 1) return;
    let list = bagian === "organ" ? s.organOpts : s.vektorOpts;
    let opt = list[optIdx];
    if (!opt) return;

    if (!opt.ok) {
        s.mistakes++;
        window.tampilkanToastLab("⚠️ Kurang tepat! " + opt.label + " bukan sumber yang tepat (" + opt.sub + ").", "err");
        return;
    }

    if (bagian === "organ") s.organOk = true;
    else s.vektorOk = true;
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Pilihan tepat! Sekarang lakukan proses ekstraksinya.", "ok");
};

window.aksiEkstraksiTahap1DNA = function(target) {
    let s = window.labDnaSession;
    if (!s || s.step !== 1) return;
    if (target === "insulin" && s.organOk) s.insulinIsolated = true;
    if (target === "plasmid" && s.vektorOk) s.plasmidExtracted = true;
    window.renderMyLabUI();

    if (s.insulinIsolated && s.plasmidExtracted) {
        window.tampilkanToastLab("🧬 Gen Insulin &amp; Plasmid E. coli berhasil diisolasi! Lanjut pemotongan enzim restriksi!", "ok");
        setTimeout(function() {
            if (window.labDnaSession && window.labDnaSession.step === 1) {
                window.labDnaSession.step = 2;
                window.renderMyLabUI();
            }
        }, 750);
    }
};

// --- HANDLER INTERAKSI TAHAP 2 (RESTRIKSI) ---
window.pilihEnzimRestriksiLab = function(enzId) {
    let s = window.labDnaSession;
    if (!s || s.step !== 2) return;
    if (enzId !== s.enzId) {
        s.mistakes++;
        let targetEnz = window.cariEnzimRestriksiLab(s.enzId);
        window.tampilkanToastLab("⚠️ Enzim tidak cocok! Cari enzim yang mengenali urutan palindrom 5'-" + targetEnz.seqTop + "-3'!", "err");
        return;
    }
    s.pickedEnzymeId = enzId;
    window.renderMyLabUI();
    window.tampilkanToastLab("✂️ Enzim " + window.cariEnzimRestriksiLab(enzId).nama + " siap! Ketuk 3 situs pengenalan untuk memotong DNA.", "ok");
};

window.aksiPotongSitusDna = function(siteKey, isValidSite) {
    let s = window.labDnaSession;
    if (!s || s.step !== 2) return;

    if (!s.pickedEnzymeId) {
        return window.tampilkanToastLab("👆 Pilih botol enzim restriksi yang tepat di atas terlebih dahulu!", "err");
    }
    if (!isValidSite) {
        s.mistakes++;
        let enz = window.cariEnzimRestriksiLab(s.enzId);
        return window.tampilkanToastLab("⚠️ Salah situs! Enzim " + enz.nama + " hanya memotong urutan palindrom 5'-" + enz.seqTop + "-3'!", "err");
    }
    if (s.cuts[siteKey]) return;

    s.cuts[siteKey] = true;
    let semuaTerpotong = s.cuts.insulinLeft && s.cuts.insulinRight && s.cuts.plasmidSite;
    window.renderMyLabUI();

    if (semuaTerpotong) {
        window.tampilkanToastLab("✂️ Sempurna! Ujung lengket (sticky ends) komplementer terbentuk! Lanjut Tahap Ligasi!", "ok");
        setTimeout(function() {
            if (window.labDnaSession && window.labDnaSession.step === 2) {
                window.labDnaSession.step = 3;
                window.renderMyLabUI();
            }
        }, 800);
    }
};

// --- HANDLER INTERAKSI TAHAP 3 (LIGASI) ---
window.aksiSisipkanFragmenDNA = function(fragIdx) {
    let s = window.labDnaSession;
    if (!s || s.step !== 3 || s.insertPlaced) return;
    let f = s.ligasiFrags[fragIdx];
    if (!f) return;

    if (!f.ok) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Tidak dapat menempel! " + f.ket, "err");
    }

    s.insertPlaced = true;
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Pasangan basa sticky ends cocok! Sekarang pilih enzim penyambung DNA.", "ok");
};

window.pilihEnzimLigasiLab = function(optIdx) {
    let s = window.labDnaSession;
    if (!s || s.step !== 3 || !s.insertPlaced || s.ligasePicked) return;
    let e = s.ligEnzOpts[optIdx];
    if (!e) return;

    if (!e.ok) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Salah enzim! " + e.nama + " berfungsi: " + e.sub + ".", "err");
    }

    s.ligasePicked = true;
    s.ligasePct = 0;
    window.renderMyLabUI();
    window.tampilkanToastLab("🧬 DNA Ligase ditambahkan! Ketuk cepat tombol Katalisis Ligasi sampai 100%!", "ok");
};

window.aksiKatalisisLigaseLab = function() {
    let s = window.labDnaSession;
    if (!s || s.step !== 3 || !s.ligasePicked) return;
    if (s.ligasePct >= 100) return;

    s.ligasePct = Math.min(100, s.ligasePct + 25);
    window.renderMyLabUI();

    if (s.ligasePct >= 100) {
        window.tampilkanToastLab("✨ Plasmid Rekombinan (rDNA) tersambung permanen! Lanjut Transformasi ke E. coli!", "ok");
        setTimeout(function() {
            if (window.labDnaSession && window.labDnaSession.step === 3) {
                window.labDnaSession.step = 4;
                window.renderMyLabUI();
            }
        }, 800);
    }
};

// --- HANDLER INTERAKSI TAHAP 4 (HEAT SHOCK & BIOREAKTOR) ---
window.mulaiHeatShockDnaLab = function() {
    let s = window.labDnaSession;
    if (!s || s.step !== 4 || s.heatDone || s.heatDipping) return;

    s.heatDipping = true;
    s.heatVal = 0;
    window.renderMyLabUI();

    window.hentikanTimerDnaLab();
    window._dnaHeatTimer = setInterval(function() {
        let cur = window.labDnaSession;
        if (!cur || cur.step !== 4 || !cur.heatDipping) {
            window.hentikanTimerDnaLab();
            return;
        }
        cur.heatVal = Math.min(100, cur.heatVal + 2.4);
        let fillEl = document.getElementById("dna-heat-bar-fill");
        let needleEl = document.getElementById("dna-heat-needle");
        let txtEl = document.getElementById("dna-heat-val-txt");
        let vRound = Math.round(cur.heatVal);
        if (fillEl) fillEl.style.width = vRound + "%";
        if (needleEl) needleEl.style.left = vRound + "%";
        if (txtEl) txtEl.innerText = vRound + "%";

        if (cur.heatVal >= 100) {
            window.hentikanHeatShockDnaLab();
        }
    }, 45);
};

window.hentikanHeatShockDnaLab = function() {
    let s = window.labDnaSession;
    if (!s || s.step !== 4 || !s.heatDipping) return;
    window.hentikanTimerDnaLab();
    s.heatDipping = false;

    let v = s.heatVal;
    if (v < 46) {
        s.mistakes++;
        s.heatVal = 0;
        window.renderMyLabUI();
        return window.tampilkanToastLab("⚠️ Terlalu singkat (" + Math.round(v) + "%)! Pori membran E. coli belum terbuka. Ulangi sampai Zona 42°C!", "err");
    }
    if (v > 76) {
        s.mistakes++;
        s.heatVal = 0;
        window.renderMyLabUI();
        return window.tampilkanToastLab("⚠️ Terlalu panas/lama (" + Math.round(v) + "%)! Sel bakteri rusak. Ulangi dengan tabung cadangan!", "err");
    }

    s.heatDone = true;
    window.renderMyLabUI();
    window.tampilkanToastLab("❄️ Transformasi berhasil! Plasmid rDNA masuk ke E. coli. Masukkan ke tangki Bioreaktor!", "ok");
};

window.aksiBioreaktorDnaLab = function(aksi) {
    let s = window.labDnaSession;
    if (!s || s.step !== 4 || !s.heatDone) return;

    if (aksi === "nutrient" && !s.bioreactor.temp) {
        return window.tampilkanToastLab("⚠️ Stabilkan suhu bioreaktor ke 37°C terlebih dahulu!", "err");
    }
    if (aksi === "purify" && !s.bioreactor.nutrient) {
        return window.tampilkanToastLab("⚠️ Aktifkan aerator O2 &amp; nutrisi dulu agar bakteri memproduksi insulin!", "err");
    }

    s.bioreactor[aksi] = true;
    window.renderMyLabUI();
    if (aksi === "purify") {
        window.tampilkanToastLab("💉 Ekstraksi &amp; pemurnian selesai! Vial Insulin Murni siap dievaluasi!", "ok");
    }
};

window.lanjutTahapEvaluasiDnaLab = function() {
    let s = window.labDnaSession;
    if (!s || s.step !== 4) return;
    s.step = 5;
    window.renderMyLabUI();
};

// --- HANDLER INTERAKSI TAHAP 5 & 6 (EVALUASI & SIMPAN SKOR DUAL-XP) ---
window.pilihKuisDnaLab = function(idx) {
    let s = window.labDnaSession;
    if (!s || s.step !== 5) return;
    s.pickedQuizIdx = idx;
    window.renderMyLabUI();
};

window.selesaikanPraktikumRekombinasiDNA = function() {
    let s = window.labDnaSession;
    if (!s || s.step !== 5) return;

    if (s.pickedQuizIdx < 0) {
        return window.tampilkanToastLab("👆 Pilih jawaban evaluasi konsep terlebih dahulu!", "err");
    }

    let quizOk = (s.pickedQuizIdx === s.quiz.ans);
    let score = 100 - Math.min(40, s.mistakes * 10) - (quizOk ? 0 : 20);
    score = Math.max(25, score);

    let stars = 1;
    let predikat = "Insulin Terbentuk, Tingkatkan Ketelitian Molekuler!";
    let coinGain = 80;
    let xpGain = 40;
    let vials = 1;

    if (score >= 85 && quizOk) {
        stars = 3;
        predikat = "🌟 Ahli Bioteknologi Molekuler Sempurna!";
        coinGain = 220;
        xpGain = 110;
        vials = 3;
    } else if (score >= 60) {
        stars = 2;
        predikat = "👍 Peneliti Genetika Andal!";
        coinGain = 150;
        xpGain = 75;
        vials = 2;
    }

    s.resultData = {
        score: score,
        stars: stars,
        predikat: predikat,
        coin: coinGain,
        xp: xpGain,
        vials: vials,
        quizOk: quizOk
    };

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyLab(uName);
    if (lb && lb.myLabData) {
        let rec = lb.myLabData.records.dna_recomb || { bestStars: 0, completions: 0, lastAt: 0 };
        rec.bestStars = Math.max(Number(rec.bestStars) || 0, stars);
        rec.completions = (Number(rec.completions) || 0) + 1;
        rec.lastAt = Date.now();
        lb.myLabData.records.dna_recomb = rec;
        lb.myLabData.totalCompleted = (Number(lb.myLabData.totalCompleted) || 0) + 1;

        let totBintang = 0;
        Object.values(lb.myLabData.records).forEach(function(r) {
            if (r && r.bestStars) totBintang += Number(r.bestStars) || 0;
        });
        lb.myLabData.totalStars = totBintang;

        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + coinGain;
        lb.xpTersedia = lb.coin;
        lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + xpGain;
        lb.xp = lb.xpTotal;

        window.simpanDataLabKeServer(lb);
        if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
        if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
        if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    }

    s.step = 6;
    window.renderMyLabUI();
};
// =========================================================================
// 8. PRAKTIKUM 5: GENETIKA & PERSILANGAN (6 MODE MENDEL + GAMET + DRAG-DROP)
// =========================================================================
window.labGeneticsSession = null;
window._genDndState = { active: false, kind: "", value: "", ghostEl: null, startX: 0, startY: 0, moved: false };
window._genSelectedChip = { kind: "", value: "" };

window.MY_LAB_GENETICS_ROADMAP = [
    { id: "monohibrid",  nama: "1. Monohibrid",  status: "ready", hukum: "Hukum Mendel I (Segregasi Bebas)", ket: "1 sifat beda dominan penuh • Pilih P1 & P2 sendiri" },
    { id: "intermediet", nama: "2. Intermediet", status: "ready", hukum: "Hukum Mendel I (Dominansi Tak Sempurna)", ket: "Alel heterozigot memunculkan warna antara (Pink)" },
    { id: "dihibrid",    nama: "3. Dihibrid",    status: "ready", hukum: "Hukum Mendel II (Asortasi Bebas)", ket: "2 sifat beda (Warna + Ukuran) • Punnett hingga 4×4" },
    { id: "resiprok",    nama: "4. Resiprok",    status: "ready", hukum: "Uji Pembalikan Kelamin (♂×♀ vs ♀×♂)", ket: "Bandingkan pewarisan Autosom vs Terpaut Kromosom X" },
    { id: "testcross",   nama: "5. Testcross",   status: "ready", hukum: "Uji Silang (Induk Misteri M? × mm)", ket: "Buktikan genotipe induk dominan (MM atau Mm)" },
    { id: "backcross",   nama: "6. Backcross",   status: "ready", hukum: "Silang Balik (F1 Mm × Induk Murni)", ket: "Pulihkan galur murni MM atau mm dari hibrida F1" }
];

window.MY_LAB_GEN_SPECIES = [
    { id: "tulip",       nama: "Tulip",             latin: "Tulipa gesneriana", domLabel: "Merah", midLabel: "Merah Muda",  recLabel: "Putih" },
    { id: "pukul_empat", nama: "Bunga Pukul Empat", latin: "Mirabilis jalapa",  domLabel: "Merah", midLabel: "Pink",        recLabel: "Putih" },
    { id: "daisy",       nama: "Bunga Daisy",       latin: "Bellis perennis",   domLabel: "Putih", midLabel: "Pink Pastel", recLabel: "Biru"  }
];

window.MY_LAB_GEN_QUIZ_BY_MODE = {
    monohibrid: [
        {
            q: "Menurut Hukum Mendel I (Segregasi Bebas), peristiwa apa yang terjadi pada pasangan alel (misal Mm) saat pembentukan gamet melalui meiosis?",
            opts: [
                "Pasangan alel memisah secara bebas sehingga setiap gamet hanya menerima satu alel (M atau m)",
                "Kedua alel selalu menempel bersama dalam satu sel gamet",
                "Alel resesif hancur seluruhnya sebelum fertilisasi",
                "Alel dominan berubah menjadi alel resesif saat meiosis"
            ],
            ans: 0
        },
        {
            q: "Mengapa kastrasi (pemotongan benang sari) dilakukan pada bunga induk betina sebelum penyerbukan silang buatan?",
            opts: [
                "Mencegah penyerbukan sendiri (autogami) agar serbuk sari pembuah murni berasal dari induk jantan pilihan",
                "Menghilangkan kepala putik agar tidak terbentuk biji",
                "Memicu mutasi agar muncul warna baru",
                "Menghentikan pembelahan meiosis pada sel telur"
            ],
            ans: 0
        }
    ],
    intermediet: [
        {
            q: "Pada persilangan intermediet (dominansi tak sempurna) Mm × Mm, mengapa rasio fenotipe F2 menjadi 1 : 2 : 1, berbeda dari monohibrid dominan penuh (3 : 1)?",
            opts: [
                "Karena individu heterozigot (Mm) memunculkan fenotipe antara (campuran), sehingga setiap kelas genotipe punya fenotipe sendiri",
                "Karena individu homozigot resesif (mm) selalu mati",
                "Karena tidak terjadi segregasi alel saat pembentukan gamet",
                "Karena gen warna terletak pada dua kromosom berbeda"
            ],
            ans: 0
        }
    ],
    dihibrid: [
        {
            q: "Inti dari Hukum Mendel II (Asortasi Bebas) pada persilangan dihibrid (misal MmBb) adalah...",
            opts: [
                "Alel dari dua sifat berbeda mengelompok secara bebas saat pembentukan gamet sehingga terbentuk 4 kombinasi gamet (MB, Mb, mB, mb)",
                "Alel warna selalu terpaut mati dengan alel ukuran sehingga hanya terbentuk 1 macam gamet",
                "Sifat ukuran tubuh selalu menutupi sifat warna bunga",
                "Persilangan dua sifat beda hanya menghasilkan maksimal 2 jenis fenotipe"
            ],
            ans: 0
        }
    ],
    resiprok: [
        {
            q: "Apa kesimpulan utama jika hasil persilangan Resiprok (♂ A × ♀ B) berbeda secara nyata dari kebalikannya (♂ B × ♀ A)?",
            opts: [
                "Gen pengatur sifat tersebut terpaut kromosom kelamin (seperti kromosom X) atau dipengaruhi pewarisan sitoplasmik",
                "Gen pengatur sifat tersebut pasti berada di kromosom tubuh (autosom) normal",
                "Hukum Mendel I tidak berlaku pada semua tumbuhan",
                "Induk jantan tidak menyumbangkan DNA kepada keturunannya"
            ],
            ans: 0
        }
    ],
    testcross: [
        {
            q: "Mengapa pada uji silang (Testcross), individu berfenotipe dominan yang belum diketahui genotipenya (M?) wajib disilangkan dengan homozigot resesif (mm)?",
            opts: [
                "Karena induk mm hanya menghasilkan gamet resesif (m), sehingga fenotipe keturunan langsung mencerminkan gamet yang dihasilkan individu M?",
                "Karena induk MM terlalu sulit menghasilkan serbuk sari",
                "Agar seluruh keturunan selalu menjadi homozigot dominan (MM)",
                "Untuk mengubah sifat dominan penuh menjadi intermediet"
            ],
            ans: 0
        }
    ],
    backcross: [
        {
            q: "Apa tujuan utama persilangan balik (Backcross) antara keturunan F1 (Mm) dengan salah satu induk galur murni (MM atau mm) dalam pemuliaan tanaman?",
            opts: [
                "Memulihkan kembali galur homozigot murni dengan sifat unggul tertentu secara terarah",
                "Menciptakan spesies tumbuhan baru yang berbeda famili",
                "Menghilangkan seluruh alel dominan dari populasi",
                "Mencegah terjadinya pembuahan antara gamet jantan dan betina"
            ],
            ans: 0
        }
    ]
};

window.cariSpesiesGenLab = function(specId) {
    return window.MY_LAB_GEN_SPECIES.find(function(x) { return x.id === specId; }) || window.MY_LAB_GEN_SPECIES[0];
};

window.formatTeksGenotipeUI = function(code) {
    return String(code || "")
        .replace(/XM/g, "Xᴹ")
        .replace(/Xm/g, "Xᵐ");
};

// Hitung daftar gamet unik dari suatu genotipe (Mendel I & II + Terpaut X)
window.hitungGametUnikGenLab = function(geno, mode, resiprokKind) {
    if (mode === "resiprok" && resiprokKind === "xlinked") {
        let mapX = {
            XMXM: ["XM"],
            XMXm: ["XM", "Xm"],
            XmXm: ["Xm"],
            XMY:  ["XM", "Y"],
            XmY:  ["Xm", "Y"]
        };
        return (mapX[geno] || ["XM"]).slice();
    }
    if (mode === "dihibrid") {
        let a1 = geno.charAt(0), a2 = geno.charAt(1), b1 = geno.charAt(2), b2 = geno.charAt(3);
        let raw = [a1 + b1, a1 + b2, a2 + b1, a2 + b2];
        let order = ["MB", "Mb", "mB", "mb"];
        let unik = Array.from(new Set(raw));
        unik.sort(function(x, y) { return order.indexOf(x) - order.indexOf(y); });
        return unik;
    }
    let g1 = geno.charAt(0), g2 = geno.charAt(1);
    let arr = Array.from(new Set([g1, g2]));
    arr.sort(function(x, y) { return x === "M" ? -1 : (y === "M" ? 1 : 0); });
    return arr;
};

// Gabungkan 2 gamet menjadi genotipe kanonik (huruf kapital selalu di depan)
window.gabungDuaGametLab = function(gRow, gCol, mode, resiprokKind) {
    if (mode === "resiprok" && resiprokKind === "xlinked") {
        let arr = [gRow, gCol];
        if (arr.indexOf("Y") !== -1) {
            let xPart = arr.find(function(v) { return v !== "Y"; }) || "XM";
            return xPart + "Y";
        }
        return (gRow === "XM" || gCol === "XM") ? ((gRow === "XM" && gCol === "XM") ? "XMXM" : "XMXm") : "XmXm";
    }
    if (mode === "dihibrid") {
        let cArr = [gRow.charAt(0), gCol.charAt(0)].sort(function(a, b) { return a === "M" ? -1 : (b === "M" ? 1 : 0); });
        let sArr = [gRow.charAt(1), gCol.charAt(1)].sort(function(a, b) { return a === "B" ? -1 : (b === "B" ? 1 : 0); });
        return cArr.join("") + sArr.join("");
    }
    let pair = [gRow, gCol].sort(function(a, b) { return a === "M" ? -1 : (b === "M" ? 1 : 0); });
    return pair.join("");
};

// Terjemahkan genotipe ke label fenotipe & kode visual My Garden
window.infoFenotipeGenLab = function(geno, mode, specId, resiprokKind) {
    let sp = window.cariSpesiesGenLab(specId);
    if (mode === "resiprok" && resiprokKind === "xlinked") {
        let mapF = {
            XMXM: { label: "♀ Mata Merah", gardenCode: "MM", dot: "#dc2626" },
            XMXm: { label: "♀ Mata Merah (Carrier)", gardenCode: "Mm", dot: "#ef4444" },
            XmXm: { label: "♀ Mata Putih", gardenCode: "mm", dot: "#f8fafc" },
            XMY:  { label: "♂ Mata Merah", gardenCode: "MM", dot: "#dc2626" },
            XmY:  { label: "♂ Mata Putih", gardenCode: "mm", dot: "#f8fafc" }
        };
        return mapF[geno] || { label: geno, gardenCode: "MM", dot: "#94a3b8" };
    }
    if (mode === "dihibrid") {
        let cPart = geno.slice(0, 2);
        let sPart = geno.slice(2, 4);
        let warna = cPart.indexOf("M") !== -1 ? sp.domLabel : sp.recLabel;
        let ukuran = sPart.indexOf("B") !== -1 ? "Besar" : "Mini";
        return { label: warna + " " + ukuran, gardenCode: geno, dot: cPart.indexOf("M") !== -1 ? "#e11d48" : "#cbd5e1" };
    }
    if (mode === "intermediet") {
        if (geno === "MM") return { label: sp.domLabel, gardenCode: "MM", dot: "#e11d48" };
        if (geno === "Mm") return { label: sp.midLabel, gardenCode: "Mp", dot: "#f472b6" };
        return { label: sp.recLabel, gardenCode: "mm", dot: "#f8fafc" };
    }
    // Monohibrid, Resiprok Autosom, Testcross, Backcross
    if (geno === "mm") return { label: sp.recLabel, gardenCode: "mm", dot: "#f8fafc" };
    return { label: sp.domLabel, gardenCode: geno, dot: "#e11d48" };
};

window.bangunPreviewOrganismeGen = function(geno, mode, specId, resiprokKind, sizePx) {
    let sz = sizePx || 50;
    if (mode === "resiprok" && resiprokKind === "xlinked") {
        let isWhite = (geno === "XmXm" || geno === "XmY");
        let isMale = (geno.indexOf("Y") !== -1);
        let eyeCol = isWhite ? "#f8fafc" : "#dc2626";
        return '<svg viewBox="0 0 80 80" width="' + sz + '" height="' + sz + '">' +
            '<ellipse cx="22" cy="40" rx="16" ry="9" transform="rotate(-24 22 40)" fill="#e0f2fe" stroke="#64748b" stroke-width="2"/>' +
            '<ellipse cx="58" cy="40" rx="16" ry="9" transform="rotate(24 58 40)" fill="#e0f2fe" stroke="#64748b" stroke-width="2"/>' +
            '<ellipse cx="40" cy="54" rx="11" ry="18" fill="' + (isMale ? '#b45309' : '#d97706') + '" stroke="#451a03" stroke-width="2"/>' +
            '<path d="M31,52 L49,52 M31,60 L49,60" stroke="#451a03" stroke-width="2.5"/>' +
            '<circle cx="40" cy="28" r="11" fill="#f59e0b" stroke="#451a03" stroke-width="2"/>' +
            '<circle cx="32" cy="24" r="6" fill="' + eyeCol + '" stroke="#0f172a" stroke-width="1.8"/>' +
            '<circle cx="48" cy="24" r="6" fill="' + eyeCol + '" stroke="#0f172a" stroke-width="1.8"/>' +
        '</svg>';
    }
    let fInfo = window.infoFenotipeGenLab(geno, mode, specId, resiprokKind);
    if (typeof window.bangunSVGTanamanKebun === "function") {
        return window.bangunSVGTanamanKebun(specId, "ready", sz, fInfo.gardenCode);
    }
    return '<span style="font-size:28px;">🌺</span>';
};

window.bangunObjekCrossStage = function(maleGeno, femaleGeno, mode, resiprokKind) {
    let expM = window.hitungGametUnikGenLab(maleGeno, mode, resiprokKind);
    let expF = window.hitungGametUnikGenLab(femaleGeno, mode, resiprokKind);
    let totalCells = expM.length * expF.length;

    let expectedCells = [];
    for (let r = 0; r < expM.length; r++) {
        for (let c = 0; c < expF.length; c++) {
            expectedCells.push(window.gabungDuaGametLab(expM[r], expF[c], mode, resiprokKind));
        }
    }

    // Baki pilihan gamet (termasuk pengecoh relevan)
    let gametePool = (mode === "resiprok" && resiprokKind === "xlinked")
        ? ["XM", "Xm", "Y"]
        : (mode === "dihibrid" ? ["MB", "Mb", "mB", "mb"] : ["M", "m"]);

    // Baki pilihan genotipe untuk Drag & Drop Punnett (unik + beberapa pengecoh)
    let allGenos = (mode === "resiprok" && resiprokKind === "xlinked")
        ? ["XMXM", "XMXm", "XmXm", "XMY", "XmY"]
        : (mode === "dihibrid"
            ? Array.from(new Set(expectedCells.concat(["MMBB", "MmBb", "MMbb", "mmBB", "mmbb"]))).slice(0, 9)
            : ["MM", "Mm", "mm"]);

    return {
        maleGeno: maleGeno,
        femaleGeno: femaleGeno,
        expMaleGametes: expM,
        expFemaleGametes: expF,
        pickedMaleGametes: new Array(expM.length).fill(""),
        pickedFemaleGametes: new Array(expF.length).fill(""),
        gametesVerified: false,
        gametePool: gametePool,
        genoTray: allGenos,
        expectedCells: expectedCells,
        punnettCells: new Array(totalCells).fill(""),
        punnettVerified: false
    };
};

window.hitungRingkasanRasioCross = function(crossObj, mode, specId, resiprokKind) {
    let fMap = {};
    (crossObj.expectedCells || []).forEach(function(g) {
        let fLbl = window.infoFenotipeGenLab(g, mode, specId, resiprokKind).label;
        fMap[fLbl] = (fMap[fLbl] || 0) + 1;
    });
    let total = Math.max(1, crossObj.expectedCells.length);
    let entries = Object.keys(fMap).map(function(k) {
        return { label: k, count: fMap[k], pct: Math.round((fMap[k] / total) * 100) };
    }).sort(function(a, b) { return b.count - a.count; });

    let teksRasio = entries.map(function(e) { return e.count + " " + e.label + " (" + e.pct + "%)"; }).join(" : ");
    return { entries: entries, teksRasio: teksRasio };
};

window.buatOpsiRasioEvaluasi = function(benarTeks, mode) {
    let decoys = [];
    if (mode === "dihibrid") {
        decoys = [
            "9 Merah Besar : 3 Merah Mini : 3 Putih Besar : 1 Putih Mini",
            "3 Merah Besar : 1 Putih Mini",
            "1 Merah Besar : 1 Merah Mini : 1 Putih Besar : 1 Putih Mini",
            "12 Merah Besar : 4 Putih Mini"
        ];
    } else if (mode === "intermediet") {
        decoys = [
            "3 Dominan (75%) : 1 Resesif (25%)",
            "1 Dominan (25%) : 2 Intermediet (50%) : 1 Resesif (25%)",
            "100% Dominan",
            "1 Dominan (50%) : 1 Resesif (50%)"
        ];
    } else if (mode === "resiprok") {
        decoys = [
            "100% Sama antara Persilangan I dan II",
            "50% Dominan : 50% Resesif",
            "3 Dominan (75%) : 1 Resesif (25%)",
            "100% Resesif pada semua kelamin"
        ];
    } else {
        decoys = [
            "3 Dominan (75%) : 1 Resesif (25%)",
            "1 Dominan (50%) : 1 Resesif (50%)",
            "100% Dominan (100%)",
            "100% Resesif (100%)"
        ];
    }
    let setOpt = new Set([benarTeks]);
    decoys.forEach(function(d) { if (setOpt.size < 4) setOpt.add(d); });
    return Array.from(setOpt).sort(function() { return Math.random() - 0.5; });
};

window.mulaiPraktikumGenetika = function(modeId, presetSpecId, presetResKind) {
    let mode = modeId || "monohibrid";
    let sp = window.cariSpesiesGenLab(presetSpecId || (mode === "intermediet" ? "pukul_empat" : "tulip"));
    let resKind = presetResKind || "xlinked";

    let qPool = window.MY_LAB_GEN_QUIZ_BY_MODE[mode] || window.MY_LAB_GEN_QUIZ_BY_MODE.monohibrid;
    let rawQ = qPool[Math.floor(Math.random() * qPool.length)];
    let taggedQ = rawQ.opts.map(function(t, i) { return { txt: t, ok: i === rawQ.ans }; }).sort(function() { return Math.random() - 0.5; });

    // Default P1 awal (tetap 100% bisa diganti bebas oleh siswa di Layar 1!)
    let defMale = "MM", defFemale = "mm";
    if (mode === "dihibrid") { defMale = "MMBB"; defFemale = "mmbb"; }
    else if (mode === "resiprok" && resKind === "xlinked") { defMale = "XmY"; defFemale = "XMXM"; }
    else if (mode === "testcross") { defMale = (Math.random() > 0.5 ? "MM" : "Mm"); defFemale = ""; }
    else if (mode === "backcross") { defMale = "Mm"; defFemale = "MM"; }

    window._genSelectedChip = { kind: "", value: "" };

    window.labGeneticsSession = {
        mode: mode,
        specId: sp.id,
        resiprokKind: resKind,
        step: 1, // 1: Pilih P1 & Silangkan, 2: Gamet & Punnett Cross-1, 3: Pilih P2 (F2) & Punnett Cross-2, 4: Evaluasi, 5: Hasil & Panen
        // Pilihan P1 oleh siswa
        p1Male: defMale,
        p1Female: defFemale,
        testcrossSecret: (mode === "testcross" ? defMale : ""),
        crossAct: { castrate: false, pollinate: false, bag: false },
        // Objek Cross 1 (F1 / Testcross / Backcross / Resiprok-I)
        cross1: null,
        // Pilihan P2 oleh siswa (untuk Monohibrid, Intermediet, Dihibrid) atau Cross 2 (Resiprok-II)
        p2Male: "",
        p2Female: "",
        p2Locked: false,
        cross2: null,
        // Evaluasi Tahap 4
        ratioOpts: [],
        expectedRatioStr: "",
        pickedRatioStr: "",
        pickedTestcrossGuess: "",
        quiz: { q: rawQ.q, opts: taggedQ.map(function(x) { return x.txt; }), ans: taggedQ.findIndex(function(x) { return x.ok; }) },
        pickedQuizIdx: -1,
        mistakes: 0,
        resultData: null,
        rewardClaimed: false,
        claimedNote: ""
    };

    window.activeLabView = "genetics_lab";
    window.renderMyLabUI();
};

// Komponen Reusable: Panel Penentuan Gamet (Mendel I/II) + Papan Punnett Drag & Drop
window.bangunHTMLWorkbenchGametDanPunnett = function(stageTag, crossObj, s) {
    let isDihibrid = (s.mode === "dihibrid");
    let hukumLabel = isDihibrid ? "Hukum Mendel II — Asortasi Bebas (2 Sifat Beda)" : "Hukum Mendel I — Segregasi Bebas (Pemisahan Alel)";
    let selChip = window._genSelectedChip || { kind: "", value: "" };

    // A. BAGIAN PENENTUAN GAMET (DRAG & DROP / KLIK CHIP)
    let renderGameteSlots = function(sideKey, labelInduk, genoStr, pickedArr) {
        let slotsHtml = pickedArr.map(function(val, idx) {
            return '<div class="gen-drop-slot gen-gamete-slot' + (val ? ' is-filled' : '') + '" ' +
                'data-drop-kind="gamete" data-stage="' + stageTag + '" data-side="' + sideKey + '" data-idx="' + idx + '" ' +
                'onclick="window.klikSlotDropGenLab(\'gamete\', \'' + stageTag + '\', \'' + sideKey + '\', ' + idx + ')">' +
                (val ? ('<b>' + window.formatTeksGenotipeUI(val) + '</b>') : '<small>Drop</small>') +
            '</div>';
        }).join('');
        return '<div class="gen-gamete-parent-box">' +
            '<div class="gen-gp-head"><b>' + labelInduk + '</b> <span class="gen-gp-code">' + window.formatTeksGenotipeUI(genoStr) + '</span></div>' +
            '<div class="gen-gamete-slots-row">' + slotsHtml + '</div>' +
        '</div>';
    };

    let gameteChipsHtml = crossObj.gametePool.map(function(g) {
        let isPick = (selChip.kind === "gamete" && selChip.value === g);
        return '<div class="gen-dnd-chip' + (isPick ? ' is-chip-active' : '') + '" data-dnd-kind="gamete" data-dnd-val="' + g + '" ' +
            'onpointerdown="window.mulaiDragChipGenLab(event, \'gamete\', \'' + g + '\')" ' +
            'onclick="window.pilihChipGenLab(\'gamete\', \'' + g + '\')">' +
            window.formatTeksGenotipeUI(g) +
        '</div>';
    }).join('');

    let gameteSectionHtml =
        '<div class="gen-gamete-section' + (crossObj.gametesVerified ? ' is-done' : '') + '">' +
            '<div class="gen-sec-title"><span>🧬 A. Penentuan Gamet — ' + hukumLabel + '</span>' +
                (crossObj.gametesVerified ? '<span class="cozy-tag green">✓ Gamet Terverifikasi</span>' : '<span class="cozy-tag amber">Tarik (Drag) gamet ke slot induk!</span>') +
            '</div>' +
            '<div class="gen-gamete-parents-grid">' +
                renderGameteSlots("male", "♂ Induk Jantan", crossObj.maleGeno, crossObj.pickedMaleGametes) +
                renderGameteSlots("female", "♀ Induk Betina", crossObj.femaleGeno, crossObj.pickedFemaleGametes) +
            '</div>' +
            (!crossObj.gametesVerified
                ? '<div class="gen-tray-bar">' +
                      '<span class="gen-tray-lbl">🎯 Tarik Gamet:</span>' +
                      '<div class="gen-chips-list">' + gameteChipsHtml + '</div>' +
                      '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:6px 14px;" onclick="window.verifikasiGametGenLab(\'' + stageTag + '\')">✅ Kunci Gamet</button>' +
                  '</div>'
                : '') +
        '</div>';

    // B. BAGIAN PAPAN PUNNETT DRAG & DROP (TERBUKA SETELAH GAMET BENAR)
    let punnettSectionHtml = '';
    if (crossObj.gametesVerified) {
        let rows = crossObj.expMaleGametes;
        let cols = crossObj.expFemaleGametes;
        let is4x4 = (cols.length >= 4 || rows.length >= 4);

        let gridHtml = '<div class="gen-punnett-dyn' + (is4x4 ? ' is-grid-4x4' : '') + '" style="grid-template-columns: 52px repeat(' + cols.length + ', minmax(' + (is4x4 ? '72px' : '96px') + ', 1fr));">';
        gridHtml += '<div class="gen-punnett-corner">♂ \\ ♀</div>';
        cols.forEach(function(cg) {
            gridHtml += '<div class="gen-punnett-head">' + window.formatTeksGenotipeUI(cg) + '</div>';
        });

        let cIdx = 0;
        for (let r = 0; r < rows.length; r++) {
            gridHtml += '<div class="gen-punnett-head">' + window.formatTeksGenotipeUI(rows[r]) + '</div>';
            for (let c = 0; c < cols.length; c++) {
                let idxNow = cIdx++;
                let val = crossObj.punnettCells[idxNow];
                let fInfo = val ? window.infoFenotipeGenLab(val, s.mode, s.specId, s.resiprokKind) : null;
                let miniSvg = val ? window.bangunPreviewOrganismeGen(val, s.mode, s.specId, s.resiprokKind, is4x4 ? 32 : 44) : '<span class="punnett-qmark">?</span>';

                gridHtml +=
                    '<div class="gen-drop-slot gen-punnett-cell' + (val ? ' is-filled' : '') + (is4x4 ? ' is-compact' : '') + '" ' +
                        'data-drop-kind="geno" data-stage="' + stageTag + '" data-side="cell" data-idx="' + idxNow + '" ' +
                        'onclick="window.klikSlotDropGenLab(\'geno\', \'' + stageTag + '\', \'cell\', ' + idxNow + ')" title="Tarik genotipe ke sini (klik sel terisi untuk mengosongkan)">' +
                        miniSvg +
                        '<div class="punnett-geno">' + (val ? window.formatTeksGenotipeUI(val) : 'Drop') + '</div>' +
                        (fInfo ? '<small>' + fInfo.label + '</small>' : '') +
                    '</div>';
            }
        }
        gridHtml += '</div>';

        let genoChipsHtml = crossObj.genoTray.map(function(gn) {
            let isPick = (selChip.kind === "geno" && selChip.value === gn);
            return '<div class="gen-dnd-chip is-geno' + (isPick ? ' is-chip-active' : '') + '" data-dnd-kind="geno" data-dnd-val="' + gn + '" ' +
                'onpointerdown="window.mulaiDragChipGenLab(event, \'geno\', \'' + gn + '\')" ' +
                'onclick="window.pilihChipGenLab(\'geno\', \'' + gn + '\')">' +
                window.formatTeksGenotipeUI(gn) +
            '</div>';
        }).join('');

        punnettSectionHtml =
            '<div class="gen-punnett-section">' +
                '<div class="gen-sec-title"><span>📊 B. Papan Punnett (Drag &amp; Drop Genotipe)</span><span class="cozy-tag neutral">Seret chip genotipe ke kotak kosong</span></div>' +
                '<div class="gen-tray-bar">' +
                    '<span class="gen-tray-lbl">🧩 Pilihan Genotipe:</span>' +
                    '<div class="gen-chips-list">' + genoChipsHtml + '</div>' +
                '</div>' +
                '<div class="gen-punnett-scroll">' + gridHtml + '</div>' +
                '<div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">' +
                    '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:7px 14px;" onclick="window.kosongkanPunnettGenLab(\'' + stageTag + '\')">🧹 Reset Papan</button>' +
                    '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:7px 18px;" onclick="window.verifikasiPunnettGenLab(\'' + stageTag + '\')">✅ Periksa Papan Punnett ➔</button>' +
                '</div>' +
            '</div>';
    }

    return gameteSectionHtml + punnettSectionHtml;
};

window.renderGeneticsLabStage = function(bodyEl) {
    let s = window.labGeneticsSession;
    if (!s) return;
    let sp = window.cariSpesiesGenLab(s.specId);
    let modeCfg = window.MY_LAB_GENETICS_ROADMAP.find(function(x) { return x.id === s.mode; }) || window.MY_LAB_GENETICS_ROADMAP[0];

    let ctx = window.ambilDataLabAktif();
    let recGen = (ctx && ctx.labData && ctx.labData.records && ctx.labData.records.genetics_lab) || {};
    let doneModes = Array.isArray(recGen.completedModes) ? recGen.completedModes : [];

    // Bar 6 Mode Genetika (Semua Aktif!)
    let roadmapBar = '<div class="gen-roadmap-bar">';
    window.MY_LAB_GENETICS_ROADMAP.forEach(function(m) {
        let isCur = (m.id === s.mode);
        let isDone = doneModes.indexOf(m.id) !== -1;
        roadmapBar +=
            '<button type="button" class="gen-mode-pill' + (isCur ? ' active' : '') + (isDone ? ' is-completed' : '') + '" ' +
                'onclick="window.mulaiPraktikumGenetika(\'' + m.id + '\')" title="' + m.ket + '">' +
                m.nama + (isDone ? ' ✓' : '') +
            '</button>';
    });
    roadmapBar += '</div>';

    let hasTwoStages = (s.mode === "monohibrid" || s.mode === "intermediet" || s.mode === "dihibrid" || s.mode === "resiprok");
    let stepLabels = hasTwoStages
        ? (s.mode === "resiprok"
            ? ["1. Pilih P1", "2. Silang I (♂×♀)", "3. Silang II (Resiprok)", "4. Analisis", "5. Panen"]
            : ["1. Tentukan P1", "2. Gamet & F1", "3. Pilih P2 & F2", "4. Analisis", "5. Panen"])
        : ["1. Tentukan Induk", "2. Gamet & Punnett", "3. Analisis", "4. Panen"];

    let visualStep = s.step;
    if (!hasTwoStages && s.step >= 4) visualStep = s.step - 1;

    let stepperHtml = '<div class="lab-stepper-bar">';
    stepLabels.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < visualStep ? "done" : (num === visualStep ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < visualStep ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">🧬 ' + modeCfg.nama + ' • ' + (s.mode === "resiprok" && s.resiprokKind === "xlinked" ? "Drosophila (Terpaut X)" : sp.nama) + '</span></div>';

    let stageContent = '';

    // =====================================================================
    // TAHAP 1: SISWA MENENTUKAN SENDIRI INDUK P1 & PENYERBUKAN BUATAN
    // =====================================================================
    if (s.step === 1) {
        let topSelectorHtml = '';
        if (s.mode === "resiprok") {
            topSelectorHtml =
                '<div class="lab-spec-row">' +
                    '<button type="button" class="lab-spec-btn' + (s.resiprokKind === "xlinked" ? ' is-selected' : '') + '" onclick="window.mulaiPraktikumGenetika(\'resiprok\', \'' + s.specId + '\', \'xlinked\')">' +
                        '<span class="spec-ico">🪰</span><div><b>Terpaut Kromosom X (Drosophila)</b><small>Hasil Resiprok BERBEDA (♂×♀ ≠ ♀×♂)</small></div>' +
                    '</button>' +
                    '<button type="button" class="lab-spec-btn' + (s.resiprokKind === "autosom" ? ' is-selected' : '') + '" onclick="window.mulaiPraktikumGenetika(\'resiprok\', \'' + s.specId + '\', \'autosom\')">' +
                        '<span class="spec-ico">🌺</span><div><b>Autosom / Kromosom Tubuh (Bunga)</b><small>Hasil Resiprok IDENTIK (♂×♀ = ♀×♂)</small></div>' +
                    '</button>' +
                '</div>';
        } else {
            topSelectorHtml = '<div class="gen-species-row">' +
                window.MY_LAB_GEN_SPECIES.map(function(item) {
                    let act = (item.id === s.specId) ? " is-selected" : "";
                    let subInfo = s.mode === "intermediet"
                        ? (item.domLabel + " • " + item.midLabel + " • " + item.recLabel)
                        : (s.mode === "dihibrid" ? (item.domLabel + "/" + item.recLabel + " + Besar/Mini") : (item.domLabel + " vs " + item.recLabel));
                    return '<button type="button" class="lab-spec-btn' + act + '" onclick="window.mulaiPraktikumGenetika(\'' + s.mode + '\', \'' + item.id + '\')">' +
                        '<div style="flex-shrink:0;">' + window.bangunPreviewOrganismeGen("MM", "monohibrid", item.id, "autosom", 38) + '</div>' +
                        '<div style="text-align:left; min-width:0;"><b>' + item.nama + '</b><small>' + subInfo + '</small></div>' +
                    '</button>';
                }).join('') + '</div>';
        }

        // Opsi pilihan genotipe P1 Jantan & Betina sesuai mode
        let maleChoices = ["MM", "Mm", "mm"];
        let femaleChoices = ["MM", "Mm", "mm"];
        if (s.mode === "dihibrid") {
            maleChoices = ["MMBB", "MMbb", "mmBB", "mmbb", "MmBb"];
            femaleChoices = ["MMBB", "MMbb", "mmBB", "mmbb", "MmBb"];
        } else if (s.mode === "resiprok" && s.resiprokKind === "xlinked") {
            maleChoices = ["XMY", "XmY"];
            femaleChoices = ["XMXM", "XMXm", "XmXm"];
        } else if (s.mode === "backcross") {
            maleChoices = ["Mm"];
            femaleChoices = ["MM", "mm"];
        }

        let renderPickerSide = function(side, title, choices, currentVal, isMystery) {
            if (isMystery) {
                return '<div class="gen-flower-box">' +
                    '<span class="cozy-tag amber">' + title + '</span>' +
                    window.bangunPreviewOrganismeGen("MM", "monohibrid", s.specId, "autosom", 72) +
                    '<b>Fenotipe: ' + sp.domLabel + ' (Genotipe Misteri: M?)</b>' +
                    '<small>Bisa homozigot MM atau heterozigot Mm!</small>' +
                '</div>';
            }
            let curInfo = currentVal ? window.infoFenotipeGenLab(currentVal, s.mode, s.specId, s.resiprokKind) : null;
            let btns = choices.map(function(gn) {
                return '<button type="button" class="mic-opt-pill' + (currentVal === gn ? ' is-picked' : '') + '" onclick="window.pilihIndukP1GenLab(\'' + side + '\', \'' + gn + '\')">' + window.formatTeksGenotipeUI(gn) + '</button>';
            }).join('');
            return '<div class="gen-flower-box">' +
                '<span class="cozy-tag ' + (side === "male" ? 'green' : 'amber') + '">' + title + '</span>' +
                (currentVal ? window.bangunPreviewOrganismeGen(currentVal, s.mode, s.specId, s.resiprokKind, 72) : '<div class="gen-f1-wait">?</div>') +
                '<b>' + (curInfo ? (window.formatTeksGenotipeUI(currentVal) + ' • ' + curInfo.label) : 'Pilih Genotipe Induk') + '</b>' +
                '<div class="mic-pill-row" style="width:100%; justify-content:center; margin-top:4px;">' + btns + '</div>' +
            '</div>';
        };

        let cd = s.crossAct;
        let siapLanjut = Boolean(s.p1Male && s.p1Female && cd.castrate && cd.pollinate);

        let instruksiP1 = s.mode === "testcross"
            ? "Pilih penguji (♀) yang tepat untuk menguji kemurnian induk dominan misteri (M?), lalu lakukan penyerbukan!"
            : (s.mode === "backcross"
                ? "Pilih salah satu induk galur murni (MM atau mm) untuk disilangkan balik dengan F1 (Mm), lalu lakukan penyerbukan!"
                : "Tentukan sendiri genotipe P1 Jantan (♂) dan P1 Betina (♀) yang ingin kamu silangkan, lalu lakukan penyerbukan buatan!");

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🌺 Tahap 1: ' + modeCfg.nama + ' — ' + modeCfg.hukum + '</strong>' +
                '<span>' + instruksiP1 + '</span>' +
            '</div>' +
            topSelectorHtml +
            '<div class="gen-cross-bench">' +
                '<div class="gen-parent-pair">' +
                    renderPickerSide("male", s.mode === "testcross" ? "♂ Induk Uji (Misteri)" : (s.mode === "backcross" ? "♂ Hibrida F1 (Mm)" : "♂ Pilih P1 Jantan"), maleChoices, s.p1Male, s.mode === "testcross") +
                    '<div class="gen-cross-x">×</div>' +
                    renderPickerSide("female", s.mode === "testcross" ? "♀ Pilih Penguji Testcross" : (s.mode === "backcross" ? "♀ Pilih Induk Galur Murni" : "♀ Pilih P1 Betina"), femaleChoices, s.p1Female, false) +
                '</div>' +
                '<div class="tc-laf-btns" style="grid-template-columns:repeat(2, minmax(0, 1fr));">' +
                    '<button type="button" class="' + (cd.castrate ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (cd.castrate ? 'disabled' : '') + ' onclick="window.aksiPenyerbukanP1GenLab(\'castrate\')">' + (cd.castrate ? '✓ 1. Isolasi / Kastrasi Selesai' : '1. ✂️ Kastrasi / Isolasi Induk ♀') + '</button>' +
                    '<button type="button" class="' + (cd.pollinate ? 'mypet-gray-cta sm' : 'mypet-green-cta sm') + '" ' + (cd.pollinate ? 'disabled' : '') + ' onclick="window.aksiPenyerbukanP1GenLab(\'pollinate\')">' + (cd.pollinate ? '✓ 2. Penyerbukan Silang Selesai' : '2. 🖌️ Lakukan Penyerbukan Silang ♂ × ♀') + '</button>' +
                '</div>' +
                (siapLanjut ? '<button type="button" class="mypet-green-cta" onclick="window.mulaiTahapCross1GenLab()">🧬 Lanjut Penentuan Gamet &amp; Papan Punnett ➔</button>' : '') +
            '</div>';
    }

    // =====================================================================
    // TAHAP 2: GAMET P1 (MENDEL I/II) & PAPAN PUNNETT CROSS-1 (DRAG & DROP)
    // =====================================================================
    else if (s.step === 2 && s.cross1) {
        let infoTestcrossObs = '';
        if (s.mode === "testcross") {
            let sumT = window.hitungRingkasanRasioCross(s.cross1, s.mode, s.specId, s.resiprokKind);
            infoTestcrossObs = '<div class="garden-quiz-feedback ok" style="margin-bottom:8px;"><b>🔍 Hasil Kebun Uji Testcross:</b> Persilangan induk misteri (M?) × mm menghasilkan keturunan dengan fenotipe: <b>' + sumT.teksRasio + '</b>. Buktikan dengan menyusun gamet &amp; Papan Punnett di bawah!</div>';
        }
        let judulTahap2 = s.mode === "resiprok"
            ? "🧬 Tahap 2: Persilangan I (♂ " + window.formatTeksGenotipeUI(s.cross1.maleGeno) + " × ♀ " + window.formatTeksGenotipeUI(s.cross1.femaleGeno) + ")"
            : "🧬 Tahap 2: Penentuan Gamet &amp; Papan Punnett F1 (" + window.formatTeksGenotipeUI(s.cross1.maleGeno) + " × " + window.formatTeksGenotipeUI(s.cross1.femaleGeno) + ")";

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>' + judulTahap2 + '</strong>' +
                '<span>Tarik (Drag &amp; Drop) gamet yang terbentuk dari setiap induk, lalu tarik chip genotipe ke dalam Papan Punnett!</span>' +
            '</div>' +
            infoTestcrossObs +
            window.bangunHTMLWorkbenchGametDanPunnett("cross1", s.cross1, s);
    }

    // =====================================================================
    // TAHAP 3: PILIH SENDIRI INDUK P2 DARI HASIL F1 -> GAMET & PUNNETT F2
    //          (ATAU PERSILANGAN II RESIPROK DENGAN KELAMIN DIBALIK)
    // =====================================================================
    else if (s.step === 3) {
        if (s.mode === "resiprok" && s.cross2) {
            let sum1 = window.hitungRingkasanRasioCross(s.cross1, s.mode, s.specId, s.resiprokKind);
            stageContent =
                '<div class="lab-instruction-banner">' +
                    '<strong>🔄 Tahap 3: Persilangan II — RESIPROK (Kelamin Induk Dibalik!)</strong>' +
                    '<span>Persilangan I (♂ ' + window.formatTeksGenotipeUI(s.cross1.maleGeno) + ' × ♀ ' + window.formatTeksGenotipeUI(s.cross1.femaleGeno) + ') menghasilkan: <b>' + sum1.teksRasio + '</b>. Sekarang uji kebalikannya: <b>♂ ' + window.formatTeksGenotipeUI(s.cross2.maleGeno) + ' × ♀ ' + window.formatTeksGenotipeUI(s.cross2.femaleGeno) + '</b>!</span>' +
                '</div>' +
                window.bangunHTMLWorkbenchGametDanPunnett("cross2", s.cross2, s);
        } else if (!s.p2Locked) {
            let unikF1 = Array.from(new Set(s.cross1.expectedCells));
            let renderPilihP2 = function(side, label, curVal) {
                let btns = unikF1.map(function(gn) {
                    let fInf = window.infoFenotipeGenLab(gn, s.mode, s.specId, s.resiprokKind);
                    return '<button type="button" class="lab-spec-btn' + (curVal === gn ? ' is-selected' : '') + '" style="padding:7px 9px;" onclick="window.pilihIndukP2GenLab(\'' + side + '\', \'' + gn + '\')">' +
                        window.bangunPreviewOrganismeGen(gn, s.mode, s.specId, s.resiprokKind, 38) +
                        '<div style="text-align:left;"><b>' + window.formatTeksGenotipeUI(gn) + '</b><small>' + fInf.label + '</small></div>' +
                    '</button>';
                }).join('');
                return '<div class="dna-iso-card">' +
                    '<div class="dna-iso-head"><span>' + label + '</span></div>' +
                    '<div class="dna-mini-opts">' + btns + '</div>' +
                '</div>';
            };

            stageContent =
                '<div class="lab-instruction-banner">' +
                    '<strong>🌱 Tahap 3A: Tentukan Sendiri Induk P2 (dari Keturunan F1) untuk Menghasilkan F2!</strong>' +
                    '<span>Pilih 1 individu F1 sebagai <b>♂ P2 Jantan</b> dan 1 individu F1 sebagai <b>♀ P2 Betina</b>!</span>' +
                '</div>' +
                '<div class="dna-two-col">' +
                    renderPilihP2("male", "♂ Pilih Induk F1 Jantan (P2)", s.p2Male) +
                    renderPilihP2("female", "♀ Pilih Induk F1 Betina (P2)", s.p2Female) +
                '</div>' +
                '<div style="margin-top:12px; display:flex; justify-content:center;">' +
                    '<button type="button" class="mypet-green-cta" style="max-width:420px;" onclick="window.kunciIndukP2DanBukaPunnettF2()">🧬 Silangkan P2 (' + (s.p2Male || '?') + ' × ' + (s.p2Female || '?') + ') ➔ Gamet &amp; Punnett F2</button>' +
                '</div>';
        } else if (s.cross2) {
            stageContent =
                '<div class="lab-instruction-banner">' +
                    '<strong>🧬 Tahap 3B: Penentuan Gamet P2 &amp; Papan Punnett F2 (' + window.formatTeksGenotipeUI(s.cross2.maleGeno) + ' × ' + window.formatTeksGenotipeUI(s.cross2.femaleGeno) + ')</strong>' +
                    '<span>Tentukan gamet induk F1 pilihanmu (' + (s.mode === "dihibrid" ? "Asortasi Bebas Mendel II" : "Segregasi Bebas Mendel I") + '), lalu lengkapi Papan Punnett F2 dengan Drag &amp; Drop!</span>' +
                '</div>' +
                window.bangunHTMLWorkbenchGametDanPunnett("cross2", s.cross2, s);
        }
    }

    // =====================================================================
    // TAHAP 4: ANALISIS RASIO DINAMIS & KUIS KONSEP HUKUM MENDEL
    // =====================================================================
    else if (s.step === 4) {
        let letters = ["A", "B", "C", "D"];
        let activeCross = s.cross2 || s.cross1;
        let sumFinal = window.hitungRingkasanRasioCross(activeCross, s.mode, s.specId, s.resiprokKind);
        let extraBlock = '';

        if (s.mode === "testcross") {
            extraBlock =
                '<div class="lab-diag-block">' +
                    '<label>1. Berdasarkan hasil Testcross di atas (' + sumFinal.teksRasio + '), apakah genotipe asli induk dominan misteri (M?) tersebut?</label>' +
                    '<div class="lab-analysis-opts-grid">' +
                        '<button type="button" class="lab-analysis-opt' + (s.pickedTestcrossGuess === "MM" ? ' is-picked' : '') + '" onclick="window.pilihEvalGenLab(\'tc\', \'MM\')"><span>🧬 <b>MM (Homozigot Dominan Murni)</b> — karena 100% keturunan dominan</span></button>' +
                        '<button type="button" class="lab-analysis-opt' + (s.pickedTestcrossGuess === "Mm" ? ' is-picked' : '') + '" onclick="window.pilihEvalGenLab(\'tc\', \'Mm\')"><span>🧬 <b>Mm (Heterozigot)</b> — karena muncul 50% dominan : 50% resesif</span></button>' +
                    '</div>' +
                '</div>';
        } else {
            let lbl1 = s.mode === "resiprok"
                ? "1. Bagaimana perbandingan hasil Persilangan I vs Persilangan II (Resiprok)?"
                : "1. Berdasarkan Papan Punnett terakhir (" + window.formatTeksGenotipeUI(activeCross.maleGeno) + " × " + window.formatTeksGenotipeUI(activeCross.femaleGeno) + "), manakah rasio fenotipe keturunan yang tepat?";
            extraBlock =
                '<div class="lab-diag-block">' +
                    '<label>' + lbl1 + '</label>' +
                    '<div class="lab-analysis-opts-grid">' +
                        s.ratioOpts.map(function(txt) {
                            return '<button type="button" class="lab-analysis-opt' + (s.pickedRatioStr === txt ? ' is-picked' : '') + '" onclick="window.pilihEvalGenLab(\'ratio\', \'' + txt.replace(/'/g, "\\'") + '\')"><span>📊 ' + txt + '</span></button>';
                        }).join('') +
                    '</div>' +
                '</div>';
        }

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🧮 Tahap Evaluasi: Analisis Hasil Persilangan &amp; Konsep Mendel</strong>' +
                '<span>Jawab analisis berdasarkan hasil Papan Punnett yang baru saja kamu selesaikan!</span>' +
            '</div>' +
            '<div class="lab-diag-panel">' +
                extraBlock +
                '<div class="lab-diag-block">' +
                    '<label>2. ' + s.quiz.q + '</label>' +
                    '<div class="lab-analysis-opts-grid">' +
                        s.quiz.opts.map(function(txt, i) {
                            return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === i ? ' is-picked' : '') + '" onclick="window.pilihEvalGenLab(\'quiz\', ' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>';
                        }).join('') +
                    '</div>' +
                '</div>' +
                '<button type="button" class="mypet-green-cta" onclick="window.selesaikanPraktikumGenetika()">📋 Serahkan Laporan &amp; Panen Hasil</button>' +
            '</div>';
    }

    // =====================================================================
    // TAHAP 5: HASIL BINTANG 1–3 & KIRIM BIBIT VARIAN GENETIK KE MY GARDEN
    // =====================================================================
    else if (s.step === 5 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) {
            starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        }

        // Ambil 2 contoh genotipe unik dari hasil Punnett terakhir untuk pilihan dikirim ke My Garden
        let activeCross = s.cross2 || s.cross1;
        let unikHasil = Array.from(new Set((activeCross && activeCross.expectedCells) || ["MM", "mm"]));
        let canSendGarden = !(s.mode === "resiprok" && s.resiprokKind === "xlinked");

        let claimBox = '';
        if (!s.rewardClaimed) {
            let seedBtns = '';
            if (canSendGarden) {
                unikHasil.slice(0, 2).forEach(function(gn) {
                    let fInf = window.infoFenotipeGenLab(gn, s.mode, s.specId, s.resiprokKind);
                    seedBtns += '<button type="button" class="mypet-green-cta sm" onclick="window.klaimHadiahGenetikaLab(\'seed\', \'' + fInf.gardenCode + '\', \'' + fInf.label.replace(/'/g, "\\'") + '\')">🌱 +1 Bibit ' + fInf.label + ' (' + fInf.gardenCode + ')</button>';
                });
            }
            claimBox =
                '<div class="tc-claim-choice-box">' +
                    '<div style="font-size:12px; font-weight:800; color:#0f766e; margin-bottom:8px;">🎁 Pilih Hadiah Praktikum ' + modeCfg.nama + ':</div>' +
                    '<div class="gen-claim-3row">' +
                        '<button type="button" class="mypet-amber-cta sm" onclick="window.klaimHadiahGenetikaLab(\'sell\', \'\', \'\')">💰 Jual Riset (+🪙 ' + res.coin + ' &amp; +' + res.xp + ' XP)</button>' +
                        seedBtns +
                    '</div>' +
                '</div>';
        } else {
            let nextModeIdx = (window.MY_LAB_GENETICS_ROADMAP.findIndex(function(m) { return m.id === s.mode; }) + 1) % window.MY_LAB_GENETICS_ROADMAP.length;
            let nextM = window.MY_LAB_GENETICS_ROADMAP[nextModeIdx];
            claimBox =
                '<div class="garden-quiz-feedback ok" style="width:100%; box-sizing:border-box;">' + s.claimedNote + '</div>' +
                '<div style="display:flex; gap:8px; width:100%; max-width:480px; margin-top:6px;">' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumGenetika(\'' + nextM.id + '\')">➡️ Lanjut ' + nextM.nama + '</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
                '</div>';
        }

        stageContent =
            '<div class="lab-result-card">' +
                '<div class="lab-result-stars-wrap">' + starsBig + '</div>' +
                '<h3 class="lab-result-title">' + res.predikat + '</h3>' +
                '<div class="lab-result-rewards">' +
                    '<span>🧬 <b>' + modeCfg.nama + '</b></span>' +
                    '<span>🎯 Skor: <b>' + res.score + '/100</b></span>' +
                    '<span>⭐ <b>+' + res.xp + ' XP</b></span>' +
                '</div>' +
                '<div class="lab-result-explain">' +
                    '<div style="font-size:12px; color:#334155; line-height:1.5;">' +
                        '<b>💡 Ringkasan Hasil (' + modeCfg.hukum + '):</b> ' + res.summaryLine + '<br>' +
                        '• <b>Analisis Rasio/Genotipe:</b> ' + (res.ratioOk ? '✅ Tepat' : '❌ Kurang Tepat') +
                        ' • <b>Konsep Mendel:</b> ' + (res.quizOk ? '✅ Benar' : '❌ Kurang Tepat') +
                        ' • <b>Kesalahan Prosedur:</b> ' + s.mistakes + 'x' +
                    '</div>' +
                '</div>' +
                claimBox +
            '</div>';
    }

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            roadmapBar +
            stepperHtml +
            stageContent +
        '</div>';
};

// --- HANDLER PILIH P1, P2, & PENYERBUKAN ---
window.pilihIndukP1GenLab = function(side, geno) {
    let s = window.labGeneticsSession;
    if (!s || s.step !== 1) return;
    if (s.mode === "testcross" && side === "female" && geno !== "mm") {
        s.mistakes++;
        window.tampilkanToastLab("⚠️ Ingat aturan Testcross! Untuk menguji induk misteri (M?), pengujinya WAJIB homozigot resesif (mm)!", "err");
        return;
    }
    if (side === "male") s.p1Male = geno;
    else s.p1Female = geno;
    s.crossAct = { castrate: false, pollinate: false, bag: false };
    window.renderMyLabUI();
};

window.aksiPenyerbukanP1GenLab = function(aksi) {
    let s = window.labGeneticsSession;
    if (!s || s.step !== 1) return;
    if (!s.p1Male || !s.p1Female) {
        return window.tampilkanToastLab("👆 Tentukan genotipe Induk ♂ dan Induk ♀ terlebih dahulu!", "err");
    }
    if (aksi === "pollinate" && !s.crossAct.castrate) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Lakukan Kastrasi / Isolasi Induk ♀ terlebih dahulu!", "err");
    }
    s.crossAct[aksi] = true;
    window.renderMyLabUI();
};

window.mulaiTahapCross1GenLab = function() {
    let s = window.labGeneticsSession;
    if (!s || !s.p1Male || !s.p1Female) return;
    s.cross1 = window.bangunObjekCrossStage(s.p1Male, s.p1Female, s.mode, s.resiprokKind);
    window._genSelectedChip = { kind: "", value: "" };
    s.step = 2;
    window.renderMyLabUI();
};

window.pilihIndukP2GenLab = function(side, geno) {
    let s = window.labGeneticsSession;
    if (!s || s.step !== 3 || s.p2Locked) return;
    if (side === "male") s.p2Male = geno;
    else s.p2Female = geno;
    window.renderMyLabUI();
};

window.kunciIndukP2DanBukaPunnettF2 = function() {
    let s = window.labGeneticsSession;
    if (!s || s.step !== 3) return;
    if (!s.p2Male || !s.p2Female) {
        return window.tampilkanToastLab("👆 Pilih Induk F1 Jantan dan Betina terlebih dahulu!", "err");
    }
    s.p2Locked = true;
    s.cross2 = window.bangunObjekCrossStage(s.p2Male, s.p2Female, s.mode, s.resiprokKind);
    window._genSelectedChip = { kind: "", value: "" };
    window.renderMyLabUI();
};

// --- MESIN DRAG-AND-DROP UNIVERSAL (MOUSE, IPAD, ANDROID, & IPHONE 90°) ---
window.pilihChipGenLab = function(kind, val) {
    let cur = window._genSelectedChip;
    if (cur.kind === kind && cur.value === val) {
        window._genSelectedChip = { kind: "", value: "" };
    } else {
        window._genSelectedChip = { kind: kind, value: val };
    }
    window.renderMyLabUI();
};

window.terapkanIsiDropSlotGenLab = function(kind, stageTag, side, idx, val) {
    let s = window.labGeneticsSession;
    if (!s) return;
    let obj = stageTag === "cross2" ? s.cross2 : s.cross1;
    if (!obj) return;

    if (kind === "gamete") {
        if (obj.gametesVerified) return;
        let arr = side === "male" ? obj.pickedMaleGametes : obj.pickedFemaleGametes;
        if (idx >= 0 && idx < arr.length) arr[idx] = val;
    } else if (kind === "geno") {
        if (!obj.gametesVerified) return;
        if (idx >= 0 && idx < obj.punnettCells.length) obj.punnettCells[idx] = val;
    }
    window.renderMyLabUI();
};

window.klikSlotDropGenLab = function(kind, stageTag, side, idx) {
    let sel = window._genSelectedChip;
    if (sel && sel.kind === kind && sel.value) {
        window.terapkanIsiDropSlotGenLab(kind, stageTag, side, idx, sel.value);
        return;
    }
    // Jika tidak ada chip yang dipilih dan slot sudah terisi, klik akan mengosongkannya
    window.terapkanIsiDropSlotGenLab(kind, stageTag, side, idx, "");
};

window.mulaiDragChipGenLab = function(e, kind, val) {
    if (e.button !== undefined && e.button !== 0) return;
    window._genDndState = {
        active: true,
        kind: kind,
        value: val,
        ghostEl: null,
        startX: e.clientX,
        startY: e.clientY,
        moved: false
    };
};

document.addEventListener("pointermove", function(e) {
    let dnd = window._genDndState;
    if (!dnd || !dnd.active) return;

    let dist = Math.hypot(e.clientX - dnd.startX, e.clientY - dnd.startY);
    if (!dnd.moved && dist < 6) return;

    if (!dnd.moved) {
        dnd.moved = true;
        let ghost = document.createElement("div");
        ghost.className = "gen-dnd-ghost" + (document.body.classList.contains("world-force-rotated") ? " is-rot90" : "");
        ghost.innerText = window.formatTeksGenotipeUI(dnd.value);
        document.body.appendChild(ghost);
        dnd.ghostEl = ghost;
    }

    e.preventDefault();
    if (dnd.ghostEl) {
        dnd.ghostEl.style.left = e.clientX + "px";
        dnd.ghostEl.style.top = e.clientY + "px";
    }

    document.querySelectorAll(".gen-drop-slot.is-drag-over").forEach(function(el) { el.classList.remove("is-drag-over"); });
    let under = document.elementFromPoint(e.clientX, e.clientY);
    let slot = (under && under.closest) ? under.closest('.gen-drop-slot[data-drop-kind="' + dnd.kind + '"]') : null;
    if (slot) slot.classList.add("is-drag-over");
}, { passive: false });

document.addEventListener("pointerup", function(e) {
    let dnd = window._genDndState;
    if (!dnd || !dnd.active) return;

    document.querySelectorAll(".gen-drop-slot.is-drag-over").forEach(function(el) { el.classList.remove("is-drag-over"); });
    if (dnd.ghostEl && dnd.ghostEl.parentNode) dnd.ghostEl.parentNode.removeChild(dnd.ghostEl);

    let wasMoved = dnd.moved;
    let kind = dnd.kind;
    let val = dnd.value;
    window._genDndState = { active: false, kind: "", value: "", ghostEl: null, startX: 0, startY: 0, moved: false };

    if (wasMoved) {
        let under = document.elementFromPoint(e.clientX, e.clientY);
        let slot = (under && under.closest) ? under.closest('.gen-drop-slot[data-drop-kind="' + kind + '"]') : null;
        if (slot) {
            let stTag = slot.getAttribute("data-stage");
            let side = slot.getAttribute("data-side");
            let idx = parseInt(slot.getAttribute("data-idx"), 10);
            window.terapkanIsiDropSlotGenLab(kind, stTag, side, idx, val);
        }
    }
});

document.addEventListener("pointercancel", function() {
    let dnd = window._genDndState;
    if (dnd && dnd.ghostEl && dnd.ghostEl.parentNode) dnd.ghostEl.parentNode.removeChild(dnd.ghostEl);
    window._genDndState = { active: false, kind: "", value: "", ghostEl: null, startX: 0, startY: 0, moved: false };
});

// --- VERIFIKASI GAMET & PAPAN PUNNETT ---
window.verifikasiGametGenLab = function(stageTag) {
    let s = window.labGeneticsSession;
    if (!s) return;
    let obj = stageTag === "cross2" ? s.cross2 : s.cross1;
    if (!obj) return;

    if (obj.pickedMaleGametes.some(function(v) { return !v; }) || obj.pickedFemaleGametes.some(function(v) { return !v; })) {
        return window.tampilkanToastLab("👆 Tarik gamet ke seluruh slot Induk ♂ dan Induk ♀ terlebih dahulu!", "err");
    }

    let normSort = function(arr) { return arr.slice().sort().join("|"); };
    let maleOk = (normSort(obj.pickedMaleGametes) === normSort(obj.expMaleGametes));
    let femaleOk = (normSort(obj.pickedFemaleGametes) === normSort(obj.expFemaleGametes));

    if (!maleOk || !femaleOk) {
        s.mistakes++;
        let hintHukum = s.mode === "dihibrid"
            ? "Ingat Asortasi Bebas (Mendel II): pasangkan 1 alel warna (M/m) dengan 1 alel ukuran (B/b) tanpa duplikat!"
            : "Ingat Segregasi Bebas (Mendel I): pisahkan pasangan alel induk menjadi gamet unik tanpa duplikat!";
        return window.tampilkanToastLab("⚠️ Susunan gamet belum tepat! " + hintHukum, "err");
    }

    obj.gametesVerified = true;
    window._genSelectedChip = { kind: "", value: "" };
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Gamet tepat! Sekarang tarik (Drag &amp; Drop) pilihan genotipe ke Papan Punnett!", "ok");
};

window.kosongkanPunnettGenLab = function(stageTag) {
    let s = window.labGeneticsSession;
    if (!s) return;
    let obj = stageTag === "cross2" ? s.cross2 : s.cross1;
    if (!obj) return;
    obj.punnettCells = obj.punnettCells.map(function() { return ""; });
    window.renderMyLabUI();
};

window.verifikasiPunnettGenLab = function(stageTag) {
    let s = window.labGeneticsSession;
    if (!s) return;
    let obj = stageTag === "cross2" ? s.cross2 : s.cross1;
    if (!obj) return;

    if (obj.punnettCells.some(function(v) { return !v; })) {
        return window.tampilkanToastLab("👆 Lengkapi seluruh kotak Papan Punnett dengan Drag &amp; Drop terlebih dahulu!", "err");
    }

    let salahIdx = [];
    for (let i = 0; i < obj.expectedCells.length; i++) {
        if (obj.punnettCells[i] !== obj.expectedCells[i]) salahIdx.push(i + 1);
    }

    if (salahIdx.length > 0) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Kotak nomor " + salahIdx.join(", ") + " belum tepat! Gabungkan gamet baris &amp; kolom (alel dominan di depan).", "err");
    }

    obj.punnettVerified = true;
    window._genSelectedChip = { kind: "", value: "" };

    // Pindah tahap sesuai mode
    if (stageTag === "cross1") {
        if (s.mode === "monohibrid" || s.mode === "intermediet" || s.mode === "dihibrid") {
            let unikF1 = Array.from(new Set(s.cross1.expectedCells));
            s.p2Male = unikF1[0] || "";
            s.p2Female = unikF1[0] || "";
            s.p2Locked = false;
            s.step = 3;
            window.renderMyLabUI();
            window.tampilkanToastLab("✅ Papan Punnett F1 benar! Sekarang pilih sendiri Induk P2 dari hasil F1!", "ok");
            return;
        }
        if (s.mode === "resiprok") {
            // Siapkan Persilangan II dengan membalik fenotipe/genotipe kelamin induk
            let revMale = s.p1Female;
            let revFemale = s.p1Male;
            if (s.resiprokKind === "xlinked") {
                // Tukar alel dominan/resesif antara ♂ dan ♀
                revMale = (s.p1Male === "XmY") ? "XMY" : "XmY";
                revFemale = (s.p1Female === "XMXM") ? "XmXm" : "XMXM";
            }
            s.cross2 = window.bangunObjekCrossStage(revMale, revFemale, s.mode, s.resiprokKind);
            s.step = 3;
            window.renderMyLabUI();
            window.tampilkanToastLab("✅ Persilangan I selesai! Sekarang uji kebalikannya pada Persilangan II (Resiprok)!", "ok");
            return;
        }
        // Testcross & Backcross langsung ke Evaluasi (Tahap 4)
        window.siapkanEvaluasiGenLab();
        return;
    }

    // Selesai Cross 2 (F2 atau Resiprok II) -> Evaluasi (Tahap 4)
    window.siapkanEvaluasiGenLab();
};

window.siapkanEvaluasiGenLab = function() {
    let s = window.labGeneticsSession;
    if (!s) return;
    let activeCross = s.cross2 || s.cross1;

    if (s.mode === "resiprok") {
        let sum1 = window.hitungRingkasanRasioCross(s.cross1, s.mode, s.specId, s.resiprokKind);
        let sum2 = window.hitungRingkasanRasioCross(s.cross2, s.mode, s.specId, s.resiprokKind);
        let samaPersis = (sum1.teksRasio === sum2.teksRasio);
        s.expectedRatioStr = samaPersis
            ? "Identik antara Persilangan I dan Persilangan II (Ciri Pewarisan Autosom)"
            : "Berbeda antara Persilangan I dan Persilangan II (Ciri Pewarisan Terpaut Kromosom X)";
        s.ratioOpts = [
            "Identik antara Persilangan I dan Persilangan II (Ciri Pewarisan Autosom)",
            "Berbeda antara Persilangan I dan Persilangan II (Ciri Pewarisan Terpaut Kromosom X)",
            "Seluruh keturunan mati pada Persilangan II",
            "Tidak dapat dibandingkan karena jumlah gamet berbeda"
        ].sort(function() { return Math.random() - 0.5; });
    } else {
        let sum = window.hitungRingkasanRasioCross(activeCross, s.mode, s.specId, s.resiprokKind);
        s.expectedRatioStr = sum.teksRasio;
        s.ratioOpts = window.buatOpsiRasioEvaluasi(sum.teksRasio, s.mode);
    }

    s.step = 4;
    window.renderMyLabUI();
};

window.pilihEvalGenLab = function(bagian, val) {
    let s = window.labGeneticsSession;
    if (!s || s.step !== 4) return;
    if (bagian === "ratio") s.pickedRatioStr = val;
    else if (bagian === "tc") s.pickedTestcrossGuess = val;
    else if (bagian === "quiz") s.pickedQuizIdx = val;
    window.renderMyLabUI();
};

window.selesaikanPraktikumGenetika = function() {
    let s = window.labGeneticsSession;
    if (!s || s.step !== 4) return;

    if (s.mode === "testcross") {
        if (!s.pickedTestcrossGuess) return window.tampilkanToastLab("👆 Tentukan kesimpulan genotipe induk misteri (MM atau Mm) terlebih dahulu!", "err");
    } else {
        if (!s.pickedRatioStr) return window.tampilkanToastLab("👆 Pilih jawaban analisis nomor 1 terlebih dahulu!", "err");
    }
    if (s.pickedQuizIdx < 0) return window.tampilkanToastLab("👆 Jawab pertanyaan konsep nomor 2 terlebih dahulu!", "err");

    let ratioOk = s.mode === "testcross"
        ? (s.pickedTestcrossGuess === s.testcrossSecret)
        : (s.pickedRatioStr === s.expectedRatioStr);
    let quizOk = (s.pickedQuizIdx === s.quiz.ans);

    let score = 100 - Math.min(30, s.mistakes * 8) - (ratioOk ? 0 : 30) - (quizOk ? 0 : 20);
    score = Math.max(25, score);

    let stars = 1;
    let predikat = "Persilangan Selesai, Cermati Lagi Hukum Mendel!";
    let coinGain = 85;
    let xpGain = 45;
    if (score >= 85 && ratioOk && quizOk) {
        stars = 3;
        predikat = "🌟 Ahli Genetika Mendel Sempurna!";
        coinGain = 220;
        xpGain = 110;
    } else if (score >= 60 && (ratioOk || quizOk)) {
        stars = 2;
        predikat = "👍 Peneliti Persilangan Andal!";
        coinGain = 145;
        xpGain = 75;
    }

    let summaryLine = s.mode === "testcross"
        ? ("Induk misteri terbukti bergenotipe " + s.testcrossSecret + " melalui uji silang dengan mm.")
        : s.expectedRatioStr;

    s.resultData = { score: score, stars: stars, predikat: predikat, coin: coinGain, xp: xpGain, ratioOk: ratioOk, quizOk: quizOk, summaryLine: summaryLine };
    s.step = 5;
    window.renderMyLabUI();
};

window.klaimHadiahGenetikaLab = function(modeClaim, gardenCode, fenotipeLabel) {
    let s = window.labGeneticsSession;
    if (!s || s.step !== 5 || !s.resultData || s.rewardClaimed) return;
    let sp = window.cariSpesiesGenLab(s.specId);
    let res = s.resultData;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyLab(uName);
    if (!lb) return;

    if (modeClaim === "seed" && gardenCode) {
        let compositeKey = sp.id + "__" + gardenCode;
        if (typeof window.pastikanStrukturMyGarden === "function") window.pastikanStrukturMyGarden(uName);
        if (lb.myGardenData && lb.myGardenData.seedInventory) {
            lb.myGardenData.seedInventory[compositeKey] = (Number(lb.myGardenData.seedInventory[compositeKey]) || 0) + 1;
        }
        s.claimedNote = "🌱 <b>+1 Bibit " + sp.nama + " (" + fenotipeLabel + " • " + gardenCode + ")</b> dikirim ke <b>My Garden</b> &amp; <b>+⭐ " + res.xp + " XP</b>!";
    } else {
        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + res.coin;
        lb.xpTersedia = lb.coin;
        s.claimedNote = "💰 Hasil riset terjual! Dapat <b>+🪙 " + res.coin + " Coin</b> &amp; <b>+⭐ " + res.xp + " XP</b>!";
    }

    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + res.xp;
    lb.xp = lb.xpTotal;

    let rec = lb.myLabData.records.genetics_lab || { bestStars: 0, completions: 0, completedModes: [], lastAt: 0 };
    if (!Array.isArray(rec.completedModes)) rec.completedModes = [];
    if (rec.completedModes.indexOf(s.mode) === -1) rec.completedModes.push(s.mode);

    rec.bestStars = Math.max(Number(rec.bestStars) || 0, res.stars);
    rec.completions = (Number(rec.completions) || 0) + 1;
    rec.lastAt = Date.now();
    lb.myLabData.records.genetics_lab = rec;
    lb.myLabData.totalCompleted = (Number(lb.myLabData.totalCompleted) || 0) + 1;

    let totBintang = 0;
    Object.values(lb.myLabData.records).forEach(function(r) {
        if (r && r.bestStars) totBintang += Number(r.bestStars) || 0;
    });
    lb.myLabData.totalStars = totBintang;

    s.rewardClaimed = true;
    window.simpanDataLabKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiSaldoHUDGarden === "function") window.perbaruiSaldoHUDGarden();
    if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    window.renderMyLabUI();
};

// =========================================================================
// 9. PRAKTIKUM 6: LABORATORIUM MIKROSKOP (SEL & JARINGAN MULTI-MIKROSKOP)
// =========================================================================
window.labMicroscopeSession = null;

window.MY_LAB_MICROSCOPE_TYPES = [
    {
        id: "cahaya",
        nama: "Mikroskop Cahaya",
        sub: "Kompon • Preparat Tipis (40×–1500×)",
        ikon: "🔬",
        oculars: [5, 10, 15],
        objectives: [4, 10, 40, 100],
        lightLabel: "Diafragma & Lampu Bawah",
        ket: "Menggunakan cahaya tampak menembus irisan tipis sel & jaringan."
    },
    {
        id: "stereo",
        nama: "Mikroskop Stereo",
        sub: "Diseksi 3D • Permukaan Utuh (5×–60×)",
        ikon: "🔭",
        oculars: [5, 10, 15],
        objectives: [1, 2, 4],
        lightLabel: "Lampu Refleksi Atas",
        ket: "Menampilkan objek tebal secara 3 dimensi dengan perbesaran rendah."
    },
    {
        id: "elektron",
        nama: "Mikroskop Elektron",
        sub: "TEM/SEM • Ultrastruktur Nano (5.000×–100.000×)",
        ikon: "⚛️",
        oculars: [1, 2],
        objectives: [5000, 20000, 50000],
        lightLabel: "Intensitas Berkas Elektron",
        ket: "Resolusi ultra-tinggi untuk mengamati organel nano seperti krista mitokondria."
    }
];

window.MY_LAB_MICROSCOPE_SPECIMENS = [
    {
        id: "epidermis_bawang",
        nama: "Epidermis Bawang Merah",
        kategori: "Sel Tumbuhan",
        ikon: "🧅",
        idealScope: "cahaya",
        idealMagMin: 200,
        idealMagMax: 600,
        idealMagMid: 400,
        idealLightMin: 50,
        idealLightMax: 80,
        ciriUtama: "Sel berbentuk persegi panjang tersusun rapat seperti batu bata, memiliki dinding sel kaku, inti sel (nukleus), dan vakuola besar.",
        qStruct: "Struktur kaku yang membuat sel epidermis bawang merah berbentuk kotak teratur dan berbeda dari sel hewan adalah...",
        opts: ["Dinding sel tersusun atas selulosa", "Sentriol berpasangan", "Lisosom pencerna", "Flagela penggerak"],
        ans: 0
    },
    {
        id: "stomata_daun",
        nama: "Stomata Epidermis Daun",
        kategori: "Jaringan Tumbuhan",
        ikon: "🍃",
        idealScope: "cahaya",
        idealMagMin: 300,
        idealMagMax: 600,
        idealMagMid: 400,
        idealLightMin: 48,
        idealLightMax: 78,
        ciriUtama: "Celah stomata diapit oleh sepasang sel penjaga (guard cell) berbentuk ginjal yang mengandung kloroplas hijau.",
        qStruct: "Apa fungsi utama sepasang sel penjaga (guard cell) yang mengapit celah stomata pada epidermis daun?",
        opts: ["Mengatur membuka-menutupnya stomata untuk pertukaran gas (CO2/O2) dan transpirasi", "Mengangkut air dari akar ke pucuk daun", "Menyimpan cadangan pati di dalam akar", "Melakukan pembelahan meiosis membentuk biji"],
        ans: 0
    },
    {
        id: "xilem_floem",
        nama: "Berkas Pembuluh Batang",
        kategori: "Jaringan Pengangkut",
        ikon: "🪵",
        idealScope: "cahaya",
        idealMagMin: 100,
        idealMagMax: 400,
        idealMagMid: 200,
        idealLightMin: 52,
        idealLightMax: 82,
        ciriUtama: "Berkas pengangkut kolateral terbuka pada batang dikotil: Xilem berdinding tebal di sisi dalam, Kambium di tengah, dan Floem di sisi luar.",
        qStruct: "Pada penampang melintang batang dikotil, jaringan yang berada di antara Xilem dan Floem dan berperan dalam pertumbuhan sekunder (membesarnya batang) adalah...",
        opts: ["Kambium vaskuler", "Epidermis atas", "Jaringan gabus mati", "Stomata"],
        ans: 0
    },
    {
        id: "otot_lurik",
        nama: "Jaringan Otot Lurik",
        kategori: "Jaringan Hewan",
        ikon: "💪",
        idealScope: "cahaya",
        idealMagMin: 300,
        idealMagMax: 1000,
        idealMagMid: 400,
        idealLightMin: 55,
        idealLightMax: 85,
        ciriUtama: "Serabut silindris panjang tidak bercabang dengan pita gelap-terang melintang (lurik) dan banyak inti sel terletak di tepi.",
        qStruct: "Ciri khas jaringan otot lurik (otot rangka) yang teramati jelas di bawah mikroskop cahaya adalah...",
        opts: ["Berbentuk silindris panjang, berlurik gelap-terang, dengan banyak inti di tepi sel", "Berbentuk gelendong dengan satu inti di tengah dan tidak berlurik", "Bercabang dengan cakram interkalar dan bekerja tak sadar", "Memiliki dinding sel selulosa dan kloroplas"],
        ans: 0
    },
    {
        id: "serbuk_sari",
        nama: "Serbuk Sari & Trikoma 3D",
        kategori: "Permukaan Utuh (3D)",
        ikon: "🌼",
        idealScope: "stereo",
        idealMagMin: 15,
        idealMagMax: 45,
        idealMagMid: 20,
        idealLightMin: 55,
        idealLightMax: 85,
        ciriUtama: "Butiran serbuk sari bulat berduri halus (eksina) terlihat utuh secara 3 dimensi menempel pada permukaan rambut daun (trikoma).",
        qStruct: "Mengapa Mikroskop Stereo lebih cocok dibanding Mikroskop Cahaya biasa untuk mengamati permukaan utuh serbuk sari dan struktur 3D daun?",
        opts: ["Karena memanfaatkan cahaya refleksi dari atas dan dua jalur optik sehingga objek tebal tidak tembus cahaya tampak 3 dimensi", "Karena mampu memperbesar hingga 100.000×", "Karena memotong sel secara otomatis menjadi irisan nano", "Karena tidak menggunakan lensa okuler maupun objektif"],
        ans: 0
    },
    {
        id: "mitokondria",
        nama: "Ultrastruktur Mitokondria",
        kategori: "Organel Nano (TEM)",
        ikon: "⚡",
        idealScope: "elektron",
        idealMagMin: 20000,
        idealMagMax: 50000,
        idealMagMid: 40000,
        idealLightMin: 50,
        idealLightMax: 82,
        ciriUtama: "Organel bermembran ganda; membran dalam berlekuk-lekuk membentuk KRISTA untuk memperluas bidang respirasi seluler penghasil ATP.",
        qStruct: "Lekukan-lekukan membran dalam mitokondria (krista) yang hanya dapat diamati detail dengan Mikroskop Elektron berfungsi untuk...",
        opts: ["Memperluas permukaan reaksi rantai transpor elektron guna memaksimalkan produksi energi ATP", "Menyimpan pigmen klorofil untuk fotosintesis", "Membentuk dinding sel kaku pada tumbuhan", "Mencerna bakteri dari luar sel"],
        ans: 0
    }
];

window.cariTipeMikroskopLab = function(id) {
    return window.MY_LAB_MICROSCOPE_TYPES.find(function(x) { return x.id === id; }) || window.MY_LAB_MICROSCOPE_TYPES[0];
};

window.cariPreparatMikroskopLab = function(id) {
    return window.MY_LAB_MICROSCOPE_SPECIMENS.find(function(x) { return x.id === id; }) || window.MY_LAB_MICROSCOPE_SPECIMENS[0];
};

window.mulaiPraktikumMikroskop = function(presetSpecId) {
    let spec = window.cariPreparatMikroskopLab(presetSpecId || "epidermis_bawang");
    let taggedOpts = spec.opts.map(function(t, i) { return { txt: t, ok: i === spec.ans }; }).sort(function() { return Math.random() - 0.5; });

    window.labMicroscopeSession = {
        step: 1, // 1: Pilih Preparat, 2: Kalibrasi Mikroskop (Jenis, Okuler, Objektif, Cahaya, Fokus), 3: Identifikasi, 4: Hasil
        specId: spec.id,
        scopeType: "cahaya",
        ocular: 10,
        objective: 4,
        light: 30,
        macroVal: 15,
        microVal: 20,
        targetMacro: 35 + Math.floor(Math.random() * 36),
        targetMicro: 30 + Math.floor(Math.random() * 41),
        // Tahap 3 (Evaluasi)
        qStruct: { q: spec.qStruct, opts: taggedOpts.map(function(x) { return x.txt; }), ans: taggedOpts.findIndex(function(x) { return x.ok; }) },
        pickedStructIdx: -1,
        pickedMagVal: "",
        magOpts: [],
        mistakes: 0,
        resultData: null
    };

    window.activeLabView = "microscope_lab";
    window.renderMyLabUI();
};

window.evaluasiOptikMikroskop = function(s) {
    let spec = window.cariPreparatMikroskopLab(s.specId);
    let totalMag = (Number(s.ocular) || 1) * (Number(s.objective) || 1);
    let scopeOk = (s.scopeType === spec.idealScope);
    let magOk = scopeOk && totalMag >= spec.idealMagMin && totalMag <= spec.idealMagMax;
    let lightOk = s.light >= spec.idealLightMin && s.light <= spec.idealLightMax;

    let errM = Math.abs(s.macroVal - s.targetMacro);
    let errMi = Math.abs(s.microVal - s.targetMicro);
    let focusPct = Math.max(0, Math.min(100, Math.round(100 - ((errM * 0.72 + errMi * 0.28) * 1.85))));
    let focusOk = focusPct >= 90;

    let blurPx = Number(((100 - focusPct) * 0.12).toFixed(2));
    if (!scopeOk) blurPx = Math.max(blurPx, 3.5);

    // Hitung skala visual proporsional berdasarkan perbandingan perbesaran aktif vs ideal
    let ratioMag = scopeOk ? (totalMag / Math.max(1, spec.idealMagMid)) : (spec.idealScope === "elektron" ? 0.22 : 0.7);
    let visualScale = Math.max(0.28, Math.min(2.1, Math.pow(ratioMag, 0.48)));

    // Hitung efek cahaya (terlalu gelap vs optimal vs terlalu silau)
    let brightness = 1.0;
    let contrast = 1.0;
    let lightStatus = "Optimal";
    if (s.light < 25) {
        brightness = 0.18 + (s.light / 25) * 0.32;
        lightStatus = "Terlalu Gelap";
    } else if (s.light < spec.idealLightMin) {
        brightness = 0.55 + ((s.light - 25) / Math.max(1, spec.idealLightMin - 25)) * 0.35;
        lightStatus = "Agak Redup";
    } else if (s.light > 88) {
        brightness = 1.75;
        contrast = 0.52;
        lightStatus = "Terlalu Silau!";
    } else if (s.light > spec.idealLightMax) {
        brightness = 1.32;
        contrast = 0.78;
        lightStatus = "Agak Terang";
    }

    let hintText = "";
    if (!scopeOk) {
        let idealObj = window.cariTipeMikroskopLab(spec.idealScope);
        hintText = "⚠️ Jenis mikroskop kurang cocok! Preparat " + spec.kategori + " ini lebih tepat diamati dengan " + idealObj.nama + ".";
    } else if (!magOk) {
        hintText = totalMag < spec.idealMagMin
            ? "🔍 Perbesaran terlalu kecil (" + totalMag.toLocaleString("id-ID") + "×). Naikkan Lensa Objektif / Okuler (target " + spec.idealMagMin.toLocaleString("id-ID") + "×–" + spec.idealMagMax.toLocaleString("id-ID") + "×)."
            : "🔍 Perbesaran terlalu tinggi (" + totalMag.toLocaleString("id-ID") + "×). Turunkan lensa agar seluruh struktur terlihat utuh.";
    } else if (!lightOk) {
        hintText = "💡 Pencahayaan " + lightStatus + " (" + s.light + "%). Sesuaikan cahaya ke kisaran " + spec.idealLightMin + "%–" + spec.idealLightMax + "%.";
    } else if (!focusOk) {
        hintText = "🎯 Tinggal sedikit lagi! Putar Makrometer & Mikrometer hingga ketajaman fokus ≥ 90%.";
    } else {
        hintText = "✨ Sempurna! Seluruh parameter optik optimal. Klik tombol Ambil Foto Pengamatan!";
    }

    return {
        totalMag: totalMag,
        scopeOk: scopeOk,
        magOk: magOk,
        lightOk: lightOk,
        focusPct: focusPct,
        focusOk: focusOk,
        allOk: scopeOk && magOk && lightOk && focusOk,
        blurPx: blurPx,
        visualScale: visualScale,
        brightness: brightness,
        contrast: contrast,
        lightStatus: lightStatus,
        hintText: hintText
    };
};

window.bangunSVGPreparatMikroskop = function(specId, evObj, isElectron) {
    let filterStr = "blur(" + evObj.blurPx + "px) brightness(" + evObj.brightness.toFixed(2) + ") contrast(" + evObj.contrast.toFixed(2) + ")" + (isElectron ? " grayscale(1)" : "");
    let bgFill = isElectron ? "#1e293b" : "#f8fafc";

    let innerMap = {
        epidermis_bawang:
            '<g stroke="#7e22ce" stroke-width="3" fill="#f3e8ff">' +
                '<rect x="20" y="34" width="76" height="44" rx="4"/><rect x="96" y="34" width="76" height="44" rx="4"/><rect x="172" y="34" width="68" height="44" rx="4"/>' +
                '<rect x="38" y="78" width="76" height="46" rx="4"/><rect x="114" y="78" width="76" height="46" rx="4"/><rect x="190" y="78" width="56" height="46" rx="4"/>' +
                '<rect x="20" y="124" width="76" height="46" rx="4"/><rect x="96" y="124" width="76" height="46" rx="4"/><rect x="172" y="124" width="68" height="46" rx="4"/>' +
                '<rect x="38" y="170" width="76" height="44" rx="4"/><rect x="114" y="170" width="76" height="44" rx="4"/><rect x="190" y="170" width="56" height="44" rx="4"/>' +
            '</g>' +
            '<g fill="#581c87">' +
                '<circle cx="48" cy="54" r="6"/><circle cx="136" cy="58" r="6"/><circle cx="204" cy="52" r="6"/>' +
                '<circle cx="72" cy="100" r="6.5"/><circle cx="152" cy="98" r="6.5"/><circle cx="216" cy="104" r="6"/>' +
                '<circle cx="62" cy="148" r="6"/><circle cx="128" cy="144" r="6.5"/><circle cx="206" cy="148" r="6"/>' +
                '<circle cx="78" cy="190" r="6"/><circle cx="154" cy="192" r="6"/>' +
            '</g>',

        stomata_daun:
            '<rect x="0" y="0" width="260" height="260" fill="#dcfce7"/>' +
            '<path d="M0,70 Q60,55 120,74 T260,68 M0,185 Q75,168 145,192 T260,182 M90,0 Q80,65 95,130 T85,260 M175,0 Q190,65 170,130 T182,260" fill="none" stroke="#16a34a" stroke-width="3" opacity="0.65"/>' +
            '<!-- Sepasang Sel Penjaga (Guard Cells) & Celah Stoma -->' +
            '<g transform="translate(130,130)">' +
                '<path d="M-2,-46 C-42,-44 -54,44 -2,46 C-18,22 -18,-22 -2,-46 Z" fill="#4ade80" stroke="#14532d" stroke-width="4"/>' +
                '<path d="M2,-46 C42,-44 54,44 2,46 C18,22 18,-22 2,-46 Z" fill="#4ade80" stroke="#14532d" stroke-width="4"/>' +
                '<ellipse cx="0" cy="0" rx="11" ry="32" fill="#0f172a"/>' +
                '<circle cx="-24" cy="-16" r="4.5" fill="#15803d"/><circle cx="-28" cy="2" r="4.5" fill="#15803d"/><circle cx="-22" cy="18" r="4.5" fill="#15803d"/>' +
                '<circle cx="24" cy="-16" r="4.5" fill="#15803d"/><circle cx="28" cy="2" r="4.5" fill="#15803d"/><circle cx="22" cy="18" r="4.5" fill="#15803d"/>' +
            '</g>',

        xilem_floem:
            '<circle cx="130" cy="130" r="108" fill="#fef3c7" stroke="#92400e" stroke-width="6"/>' +
            '<circle cx="130" cy="130" r="88" fill="#ecfccb" stroke="#65a30d" stroke-width="3"/>' +
            '<!-- Cincin Berkas Pengangkut Dikotil -->' +
            '<g transform="translate(130,130)">' +
                '<circle cx="0" cy="0" r="64" fill="none" stroke="#16a34a" stroke-width="4" stroke-dasharray="6,4"/>' +
                '<g><ellipse cx="0" cy="-64" rx="18" ry="22" fill="#fb7185" stroke="#9f1239" stroke-width="2.5"/><circle cx="-5" cy="-52" r="5" fill="#991b1b"/><circle cx="5" cy="-52" r="5" fill="#991b1b"/><path d="M-16,-66 Q0,-70 16,-66" stroke="#15803d" stroke-width="3.5" fill="none"/></g>' +
                '<g transform="rotate(60)"><ellipse cx="0" cy="-64" rx="18" ry="22" fill="#fb7185" stroke="#9f1239" stroke-width="2.5"/><circle cx="-5" cy="-52" r="5" fill="#991b1b"/><circle cx="5" cy="-52" r="5" fill="#991b1b"/><path d="M-16,-66 Q0,-70 16,-66" stroke="#15803d" stroke-width="3.5" fill="none"/></g>' +
                '<g transform="rotate(120)"><ellipse cx="0" cy="-64" rx="18" ry="22" fill="#fb7185" stroke="#9f1239" stroke-width="2.5"/><circle cx="-5" cy="-52" r="5" fill="#991b1b"/><circle cx="5" cy="-52" r="5" fill="#991b1b"/><path d="M-16,-66 Q0,-70 16,-66" stroke="#15803d" stroke-width="3.5" fill="none"/></g>' +
                '<g transform="rotate(180)"><ellipse cx="0" cy="-64" rx="18" ry="22" fill="#fb7185" stroke="#9f1239" stroke-width="2.5"/><circle cx="-5" cy="-52" r="5" fill="#991b1b"/><circle cx="5" cy="-52" r="5" fill="#991b1b"/><path d="M-16,-66 Q0,-70 16,-66" stroke="#15803d" stroke-width="3.5" fill="none"/></g>' +
                '<g transform="rotate(240)"><ellipse cx="0" cy="-64" rx="18" ry="22" fill="#fb7185" stroke="#9f1239" stroke-width="2.5"/><circle cx="-5" cy="-52" r="5" fill="#991b1b"/><circle cx="5" cy="-52" r="5" fill="#991b1b"/><path d="M-16,-66 Q0,-70 16,-66" stroke="#15803d" stroke-width="3.5" fill="none"/></g>' +
                '<g transform="rotate(300)"><ellipse cx="0" cy="-64" rx="18" ry="22" fill="#fb7185" stroke="#9f1239" stroke-width="2.5"/><circle cx="-5" cy="-52" r="5" fill="#991b1b"/><circle cx="5" cy="-52" r="5" fill="#991b1b"/><path d="M-16,-66 Q0,-70 16,-66" stroke="#15803d" stroke-width="3.5" fill="none"/></g>' +
            '</g>',

        otot_lurik:
            '<defs><pattern id="lurikPat" width="14" height="50" patternUnits="userSpaceOnUse"><rect width="7" height="50" fill="#fca5a5"/><rect x="7" width="7" height="50" fill="#dc2626"/></pattern></defs>' +
            '<rect x="10" y="34" width="240" height="46" rx="12" fill="url(#lurikPat)" stroke="#7f1d1d" stroke-width="3"/>' +
            '<ellipse cx="64" cy="41" rx="12" ry="4.5" fill="#312e81"/><ellipse cx="176" cy="73" rx="12" ry="4.5" fill="#312e81"/>' +
            '<rect x="10" y="106" width="240" height="48" rx="12" fill="url(#lurikPat)" stroke="#7f1d1d" stroke-width="3"/>' +
            '<ellipse cx="96" cy="113" rx="12" ry="4.5" fill="#312e81"/><ellipse cx="204" cy="147" rx="12" ry="4.5" fill="#312e81"/>' +
            '<rect x="10" y="180" width="240" height="46" rx="12" fill="url(#lurikPat)" stroke="#7f1d1d" stroke-width="3"/>' +
            '<ellipse cx="52" cy="219" rx="12" ry="4.5" fill="#312e81"/><ellipse cx="162" cy="187" rx="12" ry="4.5" fill="#312e81"/>',

        serbuk_sari:
            '<rect x="0" y="0" width="260" height="260" fill="#14532d"/>' +
            '<path d="M0,180 Q130,135 260,185 L260,260 L0,260 Z" fill="#22c55e" stroke="#15803d" stroke-width="4"/>' +
            '<!-- Trikoma 3D & Butiran Serbuk Sari Berduri -->' +
            '<path d="M55,175 Q68,125 82,112 M195,180 Q182,128 166,118" stroke="#bef264" stroke-width="6" stroke-linecap="round" fill="none"/>' +
            '<g transform="translate(130,118)">' +
                '<circle cx="0" cy="0" r="46" fill="#facc15" stroke="#a16207" stroke-width="4"/>' +
                '<circle cx="-12" cy="-14" r="14" fill="#fef08a" opacity="0.6"/>' +
                '<path d="M0,-46 L0,-58 M32,-32 L41,-41 M46,0 L58,0 M32,32 L41,41 M0,46 L0,58 M-32,32 L-41,41 M-46,0 L-58,0 M-32,-32 L-41,-41" stroke="#ca8a04" stroke-width="5" stroke-linecap="round"/>' +
                '<circle cx="-16" cy="10" r="5" fill="#ca8a04" opacity="0.5"/><circle cx="16" cy="-6" r="6" fill="#ca8a04" opacity="0.5"/><circle cx="8" cy="22" r="4" fill="#ca8a04" opacity="0.5"/>' +
            '</g>',

        mitokondria:
            '<rect x="0" y="0" width="260" height="260" fill="#0f172a"/>' +
            '<g transform="translate(130,130) rotate(-18)">' +
                '<!-- Membran Luar -->' +
                '<ellipse cx="0" cy="0" rx="92" ry="52" fill="#475569" stroke="#f8fafc" stroke-width="5"/>' +
                '<!-- Membran Dalam Berlekuk (Krista) -->' +
                '<path d="M-76,0 C-76,-30 -52,-36 -46,-10 C-40,16 -24,16 -20,-14 C-16,-38 4,-36 8,-8 C12,18 28,18 32,-12 C36,-36 62,-32 74,0 C68,32 42,36 34,12 C26,-10 12,-8 8,16 C4,38 -16,38 -20,14 C-24,-10 -40,-10 -46,16 C-52,36 -76,30 -76,0 Z" fill="#94a3b8" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/>' +
                '<circle cx="-55" cy="0" r="3" fill="#ffffff"/><circle cx="0" cy="4" r="3.5" fill="#ffffff"/><circle cx="48" cy="-4" r="3" fill="#ffffff"/>' +
            '</g>'
    };

    let contentSvg = innerMap[specId] || innerMap.epidermis_bawang;
    if (!evObj.scopeOk && specId === "serbuk_sari" && !isElectron) {
        // Jika objek tebal dilihat dengan mikroskop cahaya transmisi, tampak siluet gelap
        contentSvg = '<circle cx="130" cy="130" r="54" fill="#1e293b" opacity="0.9"/>';
    }

    return (
        '<div class="lab-microscope-lens' + (isElectron ? ' is-electron-lens' : '') + '">' +
            '<svg viewBox="0 0 260 260" width="100%" height="100%" style="background:' + bgFill + '; filter:' + filterStr + '; transition:filter 0.15s;">' +
                '<g transform="translate(130,130) scale(' + evObj.visualScale.toFixed(2) + ') translate(-130,-130)">' +
                    contentSvg +
                '</g>' +
                '<line x1="130" y1="8" x2="130" y2="252" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,6" opacity="0.3"/>' +
                '<line x1="8" y1="130" x2="252" y2="130" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,6" opacity="0.3"/>' +
            '</svg>' +
            '<div class="lab-lens-ring-glare"></div>' +
            '<div class="mic-lens-mag-tag">' + evObj.totalMag.toLocaleString("id-ID") + '×</div>' +
        '</div>'
    );
};

window.renderMicroscopeLabStage = function(bodyEl) {
    let s = window.labMicroscopeSession;
    if (!s) return;
    let spec = window.cariPreparatMikroskopLab(s.specId);
    let scopeCfg = window.cariTipeMikroskopLab(s.scopeType);

    let stepNames = ["1. Pilih Preparat", "2. Kalibrasi Optik", "3. Identifikasi", "4. Hasil"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">' + spec.ikon + ' ' + spec.nama + '</span></div>';

    let stageContent = '';

    // --- TAHAP 1: PILIH PREPARAT SEL & JARINGAN ---
    if (s.step === 1) {
        let ctx = window.ambilDataLabAktif();
        let recMic = (ctx && ctx.labData && ctx.labData.records && ctx.labData.records.microscope_lab) || {};
        let observed = Array.isArray(recMic.observedSpecimens) ? recMic.observedSpecimens : [];

        let cardsHtml = window.MY_LAB_MICROSCOPE_SPECIMENS.map(function(sp) {
            let isDone = observed.indexOf(sp.id) !== -1;
            let isSel = (sp.id === s.specId);
            return '<button type="button" class="lab-spec-btn mic-spec-card' + (isSel ? ' is-selected' : '') + '" onclick="window.pilihPreparatMikroskopLab(\'' + sp.id + '\')">' +
                '<span class="spec-ico">' + sp.ikon + '</span>' +
                '<div style="text-align:left; flex:1; min-width:0;">' +
                    '<b>' + sp.nama + (isDone ? ' ✅' : '') + '</b>' +
                    '<small>' + sp.kategori + '</small>' +
                '</div>' +
            '</button>';
        }).join('');

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🔬 Tahap 1: Pilih Preparat Sel atau Jaringan yang Akan Diamati</strong>' +
                '<span>Tersedia 6 preparat (Sel Tumbuhan, Jaringan Daun, Pembuluh Batang, Otot Lurik, Objek 3D, hingga Organel Nano). Pilih satu lalu pasang di meja mikroskop!</span>' +
            '</div>' +
            '<div class="mic-specimens-grid">' + cardsHtml + '</div>' +
            '<div style="margin-top:12px; display:flex; justify-content:center;">' +
                '<button type="button" class="mypet-green-cta" style="max-width:380px;" onclick="window.mulaiKalibrasiMikroskopLab()">🔭 Pasang Preparat ' + spec.nama + ' &amp; Atur Optik ➔</button>' +
            '</div>';
    }

    // --- TAHAP 2: MEJA OPTIK (GANTI JENIS MIKROSKOP, OKULER, OBJEKTIF, CAHAYA, & FOKUS) ---
    else if (s.step === 2) {
        let ev = window.evaluasiOptikMikroskop(s);
        let lensHtml = window.bangunSVGPreparatMikroskop(s.specId, ev, s.scopeType === "elektron");

        let scopeBtns = window.MY_LAB_MICROSCOPE_TYPES.map(function(mt) {
            let act = (mt.id === s.scopeType) ? " is-picked" : "";
            return '<button type="button" class="mic-opt-pill' + act + '" onclick="window.gantiJenisMikroskopLab(\'' + mt.id + '\')">' + mt.ikon + ' ' + mt.nama.replace("Mikroskop ", "") + '</button>';
        }).join('');

        let ocBtns = scopeCfg.oculars.map(function(val) {
            return '<button type="button" class="mic-opt-pill' + (s.ocular === val ? ' is-picked' : '') + '" onclick="window.aturLensaMikroskopLab(\'ocular\', ' + val + ')">' + val + '×</button>';
        }).join('');

        let objBtns = scopeCfg.objectives.map(function(val) {
            return '<button type="button" class="mic-opt-pill' + (s.objective === val ? ' is-picked' : '') + '" onclick="window.aturLensaMikroskopLab(\'objective\', ' + val + ')">' + val.toLocaleString("id-ID") + '×</button>';
        }).join('');

        let badgeCheck = function(ok, lbl) {
            return '<span class="mic-chk-chip ' + (ok ? 'ok' : 'wait') + '">' + (ok ? '✓ ' : '• ') + lbl + '</span>';
        };

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🔭 Tahap 2: Kalibrasi Mikroskop, Lensa Okuler–Objektif, Cahaya, &amp; Fokus</strong>' +
                '<span>' + ev.hintText + '</span>' +
            '</div>' +
            '<div class="lab-osm-split">' +
                '<div class="lab-lens-panel">' +
                    lensHtml +
                    '<div class="mic-checks-row">' +
                        badgeCheck(ev.scopeOk, "Mikroskop") +
                        badgeCheck(ev.magOk, "Perbesaran") +
                        badgeCheck(ev.lightOk, "Cahaya") +
                        badgeCheck(ev.focusOk, "Fokus " + ev.focusPct + "%") +
                    '</div>' +
                    '<div class="mic-mag-formula">Total: <b>' + s.ocular + '×</b> (Okuler) × <b>' + s.objective.toLocaleString("id-ID") + '×</b> (Objektif) = <b style="color:#0284c7;">' + ev.totalMag.toLocaleString("id-ID") + '×</b></div>' +
                '</div>' +

                '<div class="lab-controls-card">' +
                    '<div class="lab-knob-group">' +
                        '<div class="lab-knob-head"><span>🔬 1. Jenis Mikroskop</span><small style="color:#64748b;">' + scopeCfg.sub + '</small></div>' +
                        '<div class="mic-pill-row">' + scopeBtns + '</div>' +
                    '</div>' +
                    '<div class="mic-lens-dual">' +
                        '<div class="lab-knob-group">' +
                            '<div class="lab-knob-head"><span>👁️ 2. Okuler</span><b>' + s.ocular + '×</b></div>' +
                            '<div class="mic-pill-row">' + ocBtns + '</div>' +
                        '</div>' +
                        '<div class="lab-knob-group">' +
                            '<div class="lab-knob-head"><span>🔎 3. Objektif</span><b>' + s.objective.toLocaleString("id-ID") + '×</b></div>' +
                            '<div class="mic-pill-row">' + objBtns + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="lab-knob-group">' +
                        '<div class="lab-knob-head"><span>💡 4. ' + scopeCfg.lightLabel + '</span><b>' + s.light + '% (' + ev.lightStatus + ')</b></div>' +
                        '<div class="lab-slider-row">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahSliderMikroskopStep(\'light\', -10)">−10</button>' +
                            '<input type="range" min="0" max="100" value="' + s.light + '" oninput="window.aturSliderMikroskop(\'light\', this.value)">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahSliderMikroskopStep(\'light\', 10)">+10</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="mic-lens-dual">' +
                        '<div class="lab-knob-group">' +
                            '<div class="lab-knob-head"><span>⚙️ Makrometer</span><b>' + s.macroVal + '</b></div>' +
                            '<div class="lab-slider-row">' +
                                '<button type="button" class="lab-step-btn" onclick="window.ubahSliderMikroskopStep(\'macroVal\', -5)">−</button>' +
                                '<input type="range" min="0" max="100" value="' + s.macroVal + '" oninput="window.aturSliderMikroskop(\'macroVal\', this.value)">' +
                                '<button type="button" class="lab-step-btn" onclick="window.ubahSliderMikroskopStep(\'macroVal\', 5)">+</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="lab-knob-group">' +
                            '<div class="lab-knob-head"><span>🔧 Mikrometer</span><b>' + s.microVal + '</b></div>' +
                            '<div class="lab-slider-row">' +
                                '<button type="button" class="lab-step-btn" onclick="window.ubahSliderMikroskopStep(\'microVal\', -4)">−</button>' +
                                '<input type="range" min="0" max="100" value="' + s.microVal + '" oninput="window.aturSliderMikroskop(\'microVal\', this.value)">' +
                                '<button type="button" class="lab-step-btn" onclick="window.ubahSliderMikroskopStep(\'microVal\', 4)">+</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<button type="button" class="' + (ev.allOk ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (ev.allOk ? '' : 'disabled') + ' onclick="window.ambilFotoPengamatanMikroskop()">' +
                        (ev.allOk ? '📸 Ambil Foto Pengamatan &amp; Identifikasi ➔' : '🔭 Sesuaikan Keempat Indikator Hingga Hijau') +
                    '</button>' +
                '</div>' +
            '</div>';
    }

    // --- TAHAP 3: IDENTIFIKASI STRUKTUR SEL/JARINGAN & PERBESARAN ---
    else if (s.step === 3) {
        let evPerfect = { totalMag: s.ocular * s.objective, scopeOk: true, blurPx: 0, visualScale: 1.0, brightness: 1.0, contrast: 1.0 };
        let letters = ["A", "B", "C", "D"];

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>📝 Tahap 3: Identifikasi Struktur &amp; Verifikasi Perbesaran</strong>' +
                '<span>Amati foto hasil mikroskopmu (' + scopeCfg.nama + ', <b>' + evPerfect.totalMag.toLocaleString("id-ID") + '×</b>) lalu jawab 2 pertanyaan pengamatan!</span>' +
            '</div>' +
            '<div class="lab-osm-split">' +
                '<div class="lab-lens-panel">' +
                    window.bangunSVGPreparatMikroskop(s.specId, evPerfect, s.scopeType === "elektron") +
                    '<div class="lab-obs-readout"><b style="color:#0f766e;">' + spec.ikon + ' ' + spec.nama + '</b><p class="obs-desc-txt" style="margin-top:4px;">' + spec.ciriUtama + '</p></div>' +
                '</div>' +
                '<div class="lab-diag-panel">' +
                    '<div class="lab-diag-block">' +
                        '<label>1. ' + s.qStruct.q + '</label>' +
                        '<div class="lab-analysis-opts-grid">' +
                            s.qStruct.opts.map(function(txt, i) {
                                return '<button type="button" class="lab-analysis-opt' + (s.pickedStructIdx === i ? ' is-picked' : '') + '" onclick="window.pilihJawabMikroskop(\'struct\', ' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>';
                            }).join('') +
                        '</div>' +
                    '</div>' +
                    '<div class="lab-diag-block">' +
                        '<label>2. Jika Lensa Okuler = ' + s.ocular + '× dan Lensa Objektif = ' + s.objective.toLocaleString("id-ID") + '×, berapakah Perbesaran Total bayangan yang kamu amati?</label>' +
                        '<div class="mic-pill-row">' +
                            s.magOpts.map(function(valStr) {
                                return '<button type="button" class="mic-opt-pill' + (s.pickedMagVal === valStr ? ' is-picked' : '') + '" onclick="window.pilihJawabMikroskop(\'mag\', \'' + valStr + '\')">' + valStr + '</button>';
                            }).join('') +
                        '</div>' +
                    '</div>' +
                    '<button type="button" class="mypet-green-cta" onclick="window.selesaikanPraktikumMikroskop()">📋 Serahkan Laporan Pengamatan</button>' +
                '</div>' +
            '</div>';
    }

    // --- TAHAP 4: HASIL BINTANG 1-3 ---
    else if (s.step === 4 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) {
            starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        }

        stageContent =
            '<div class="lab-result-card">' +
                '<div class="lab-result-stars-wrap">' + starsBig + '</div>' +
                '<h3 class="lab-result-title">' + res.predikat + '</h3>' +
                '<div class="lab-result-rewards">' +
                    '<span>🪙 <b>+' + res.coin + ' Coin</b></span>' +
                    '<span>⭐ <b>+' + res.xp + ' XP</b></span>' +
                    '<span>🎯 Skor: <b>' + res.score + '/100</b></span>' +
                '</div>' +
                '<div class="lab-result-explain">' +
                    '<div style="font-size:12px; color:#334155; line-height:1.5;">' +
                        '<b>🔬 Ringkasan Preparat ' + spec.nama + ' (' + scopeCfg.nama + '):</b> ' + spec.ciriUtama + '<br>' +
                        '• <b>Identifikasi Struktur:</b> ' + (res.structOk ? '✅ Benar' : '❌ Kurang Tepat') +
                        ' • <b>Hitung Perbesaran Total:</b> ' + (res.magCalcOk ? '✅ Tepat (' + res.expectedMag + ')' : '❌ Seharusnya ' + res.expectedMag) +
                    '</div>' +
                '</div>' +
                '<div style="display:flex; gap:8px; width:100%; max-width:440px; margin-top:8px;">' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumMikroskop()">🔬 Amati Preparat Lain</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
                '</div>' +
            '</div>';
    }

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            stepperHtml +
            stageContent +
        '</div>';
};

// --- HANDLER INTERAKSI MIKROSKOP ---
window.pilihPreparatMikroskopLab = function(specId) {
    window.mulaiPraktikumMikroskop(specId);
};

window.mulaiKalibrasiMikroskopLab = function() {
    let s = window.labMicroscopeSession;
    if (!s) return;
    s.step = 2;
    window.renderMyLabUI();
};

window.gantiJenisMikroskopLab = function(scopeId) {
    let s = window.labMicroscopeSession;
    if (!s || s.step !== 2) return;
    let cfg = window.cariTipeMikroskopLab(scopeId);
    s.scopeType = cfg.id;
    s.ocular = cfg.oculars[0];
    s.objective = cfg.objectives[0];
    window.renderMyLabUI();
};

window.aturLensaMikroskopLab = function(bagian, val) {
    let s = window.labMicroscopeSession;
    if (!s || s.step !== 2) return;
    if (bagian === "ocular") s.ocular = Number(val);
    else s.objective = Number(val);
    window.renderMyLabUI();
};

window.aturSliderMikroskop = function(key, val) {
    let s = window.labMicroscopeSession;
    if (!s || s.step !== 2) return;
    s[key] = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
    window.renderMyLabUI();
};

window.ubahSliderMikroskopStep = function(key, delta) {
    let s = window.labMicroscopeSession;
    if (!s || s.step !== 2) return;
    window.aturSliderMikroskop(key, (Number(s[key]) || 0) + delta);
};

window.ambilFotoPengamatanMikroskop = function() {
    let s = window.labMicroscopeSession;
    if (!s || s.step !== 2) return;
    let ev = window.evaluasiOptikMikroskop(s);
    if (!ev.allOk) return;

    let benarMag = ev.totalMag;
    let sumSalah = s.ocular + s.objective;
    let opsiSet = new Set([
        benarMag.toLocaleString("id-ID") + "×",
        sumSalah.toLocaleString("id-ID") + "×",
        Math.max(5, Math.round(benarMag / 2)).toLocaleString("id-ID") + "×",
        (benarMag * 2).toLocaleString("id-ID") + "×"
    ]);
    s.magOpts = Array.from(opsiSet).sort(function() { return Math.random() - 0.5; });
    s.step = 3;
    window.renderMyLabUI();
    window.tampilkanToastLab("📸 Foto mikroskop tersimpan jernih! Lanjut identifikasi struktur.", "ok");
};

window.pilihJawabMikroskop = function(bagian, val) {
    let s = window.labMicroscopeSession;
    if (!s || s.step !== 3) return;
    if (bagian === "struct") s.pickedStructIdx = val;
    else s.pickedMagVal = val;
    window.renderMyLabUI();
};

window.selesaikanPraktikumMikroskop = function() {
    let s = window.labMicroscopeSession;
    if (!s || s.step !== 3) return;
    if (s.pickedStructIdx < 0 || !s.pickedMagVal) {
        return window.tampilkanToastLab("👆 Jawab kedua pertanyaan pengamatan terlebih dahulu!", "err");
    }

    let expectedMag = (s.ocular * s.objective).toLocaleString("id-ID") + "×";
    let structOk = (s.pickedStructIdx === s.qStruct.ans);
    let magCalcOk = (s.pickedMagVal === expectedMag);

    let score = 40 + (structOk ? 35 : 0) + (magCalcOk ? 25 : 0);
    let stars = 1;
    let predikat = "Pengamatan Selesai, Cermati Lagi Strukturnya!";
    let coinGain = 70;
    let xpGain = 35;

    if (score >= 90 && structOk && magCalcOk) {
        stars = 3;
        predikat = "🌟 Mikroskopis & Histolog Sempurna!";
        coinGain = 200;
        xpGain = 100;
    } else if (score >= 65) {
        stars = 2;
        predikat = "👍 Pengamat Sel & Jaringan Andal!";
        coinGain = 130;
        xpGain = 65;
    }

    s.resultData = {
        score: score,
        stars: stars,
        predikat: predikat,
        coin: coinGain,
        xp: xpGain,
        structOk: structOk,
        magCalcOk: magCalcOk,
        expectedMag: expectedMag
    };

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyLab(uName);
    if (lb && lb.myLabData) {
        let rec = lb.myLabData.records.microscope_lab || { bestStars: 0, completions: 0, observedSpecimens: [], lastAt: 0 };
        if (!Array.isArray(rec.observedSpecimens)) rec.observedSpecimens = [];
        if (rec.observedSpecimens.indexOf(s.specId) === -1) rec.observedSpecimens.push(s.specId);

        rec.bestStars = Math.max(Number(rec.bestStars) || 0, stars);
        rec.completions = (Number(rec.completions) || 0) + 1;
        rec.lastAt = Date.now();
        lb.myLabData.records.microscope_lab = rec;
        lb.myLabData.totalCompleted = (Number(lb.myLabData.totalCompleted) || 0) + 1;

        let totBintang = 0;
        Object.values(lb.myLabData.records).forEach(function(r) {
            if (r && r.bestStars) totBintang += Number(r.bestStars) || 0;
        });
        lb.myLabData.totalStars = totBintang;

        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + coinGain;
        lb.xpTersedia = lb.coin;
        lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + xpGain;
        lb.xp = lb.xpTotal;

        window.simpanDataLabKeServer(lb);
        if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
        if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
        if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    }

    s.step = 4;
    window.renderMyLabUI();
};
// =========================================================================
// HELPER BERSAMA SIMPAN REKOR & HADIAH DUAL-XP UNTUK PRAKTIKUM 7 - 11
// =========================================================================
window.simpanRekorHadiahLabUmum = function(expId, stars, coinGain, xpGain, extraMutator) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyLab(uName);
    if (!lb || !lb.myLabData) return;

    let rec = lb.myLabData.records[expId] || { bestStars: 0, completions: 0, lastAt: 0 };
    rec.bestStars = Math.max(Number(rec.bestStars) || 0, Number(stars) || 1);
    rec.completions = (Number(rec.completions) || 0) + 1;
    rec.lastAt = Date.now();
    lb.myLabData.records[expId] = rec;
    lb.myLabData.totalCompleted = (Number(lb.myLabData.totalCompleted) || 0) + 1;

    let totBintang = 0;
    Object.values(lb.myLabData.records).forEach(function(r) {
        if (r && r.bestStars) totBintang += Number(r.bestStars) || 0;
    });
    lb.myLabData.totalStars = totBintang;

    if (coinGain > 0) {
        lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + coinGain;
        lb.xpTersedia = lb.coin;
    }
    if (xpGain > 0) {
        lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + xpGain;
        lb.xp = lb.xpTotal;
    }

    if (typeof extraMutator === "function") extraMutator(lb, uName);

    window.simpanDataLabKeServer(lb);
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
    if (typeof window.perbaruiSaldoHUDFarm === "function") window.perbaruiSaldoHUDFarm();
    if (typeof window.perbaruiSaldoHUDGarden === "function") window.perbaruiSaldoHUDGarden();
    if (typeof window.perbaruiBadgeMyWorld === "function") window.perbaruiBadgeMyWorld();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
};

// =========================================================================
// 10. PRAKTIKUM 7: UJI KANDUNGAN ZAT MAKANAN (LUGOL, BIURET, BENEDICT, LEMAK)
// =========================================================================
window.labFoodSession = null;

window.MY_LAB_FOOD_SAMPLES = [
    { id: "nasi",          nama: "Nasi Putih",           ikon: "🍚", amilum: true,  protein: false, glukosa: false, lemak: false, fakta: "Nasi kaya polisakarida amilum (pati) yang bereaksi dengan iodin (Lugol) membentuk kompleks biru tua kehitaman." },
    { id: "putih_telur",   nama: "Putih Telur Rebus",    ikon: "🥚", amilum: false, protein: true,  glukosa: false, lemak: false, fakta: "Putih telur didominasi protein albumin yang bereaksi dengan reagen Biuret membentuk warna ungu." },
    { id: "pisang_madu",   nama: "Pisang Matang + Madu", ikon: "🍌", amilum: true,  protein: false, glukosa: true,  lemak: false, fakta: "Pisang matang menyimpan sisa amilum sekaligus gula pereduksi (glukosa/fruktosa) yang membentuk endapan merah bata dengan Benedict panas." },
    { id: "kacang_tanah",  nama: "Kacang Tanah Sangrai", ikon: "🥜", amilum: false, protein: true,  glukosa: false, lemak: true,  fakta: "Kacang tanah mengandung protein nabati tinggi dan lipid yang meninggalkan bekas transparan permanen pada kertas buram." },
    { id: "susu_full",     nama: "Susu Full Cream",      ikon: "🥛", amilum: false, protein: true,  glukosa: true,  lemak: true,  fakta: "Susu full cream mengandung protein kasein, gula pereduksi laktosa, dan lemak susu sekaligus." }
];

window.MY_LAB_FOOD_QUIZ_POOL = [
    { q: "Reagen yang tepat digunakan untuk mendeteksi keberadaan gula pereduksi (glukosa) pada bahan makanan beserta syarat perlakuannya adalah...", opts: ["Benedict disertai pemanasan hingga terbentuk endapan merah bata", "Lugol tanpa pemanasan hingga berwarna ungu", "Biuret disertai pendinginan hingga transparan", "Alkohol 70% hingga berbuih"], ans: 0 },
    { q: "Jika sampel ekstrak makanan ditetesi reagen Biuret dan berubah warna menjadi UNGU, maka sampel tersebut positif mengandung...", opts: ["Protein (ikatan peptida)", "Amilum (zat tepung)", "Lemak jenuh", "Glukosa murni"], ans: 0 },
    { q: "Perubahan warna menjadi BIRU TUA KEHITAMAN setelah makanan ditetesi larutan Lugol (Iodin) membuktikan adanya kandungan...", opts: ["Amilum (karbohidrat pati)", "Protein hewani", "Asam lemak bebas", "Vitamin C"], ans: 0 }
];

window.mulaiPraktikumUjiMakanan = function(presetId) {
    let sp = presetId
        ? (window.MY_LAB_FOOD_SAMPLES.find(function(x) { return x.id === presetId; }) || window.MY_LAB_FOOD_SAMPLES[0])
        : window.MY_LAB_FOOD_SAMPLES[Math.floor(Math.random() * window.MY_LAB_FOOD_SAMPLES.length)];

    let rawQ = window.MY_LAB_FOOD_QUIZ_POOL[Math.floor(Math.random() * window.MY_LAB_FOOD_QUIZ_POOL.length)];
    let tagged = rawQ.opts.map(function(t, i) { return { txt: t, ok: i === rawQ.ans }; }).sort(function() { return Math.random() - 0.5; });

    window.labFoodSession = {
        step: 1, // 1: Haluskan Ekstrak, 2: Uji 4 Reagen, 3: Diagnosis, 4: Hasil & Klaim
        sample: sp,
        grindPct: 0,
        waterAdded: false,
        tests: { lugol: false, biuret: false, benedictDrop: false, benedictHeat: false, paper: false },
        guess: { amilum: false, protein: false, glukosa: false, lemak: false },
        quiz: { q: rawQ.q, opts: tagged.map(function(x) { return x.txt; }), ans: tagged.findIndex(function(x) { return x.ok; }) },
        pickedQuizIdx: -1,
        mistakes: 0,
        resultData: null,
        rewardClaimed: false,
        claimedNote: ""
    };

    window.activeLabView = "food_test";
    window.renderMyLabUI();
};

window.renderFoodTestStage = function(bodyEl) {
    let s = window.labFoodSession;
    if (!s) return;
    let sp = s.sample;

    let stepNames = ["1. Ekstrak Sampel", "2. Uji 4 Reagen", "3. Diagnosis Gizi", "4. Hasil"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">' + sp.ikon + ' Sampel: ' + sp.nama + '</span></div>';

    let stageContent = '';

    if (s.step === 1) {
        let readyExtract = (s.grindPct >= 100 && s.waterAdded);
        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🥣 Tahap 1: Buat Larutan Ekstrak Makanan (Lumpang &amp; Alu)</strong>' +
                '<span>Tumbuk sampel makanan sampai halus (100%), lalu tambahkan akuades untuk menghasilkan ekstrak cair siap uji!</span>' +
            '</div>' +
            '<div class="food-mortar-card">' +
                '<div class="food-mortar-visual" onclick="window.aksiTumbukSampelMakanan()">' +
                    '<div class="food-mortar-ico">' + sp.ikon + '</div>' +
                    '<div class="food-pestle-tag">' + (s.grindPct >= 100 ? '✨ Halus!' : '🔨 Ketuk Tumbuk!') + '</div>' +
                '</div>' +
                '<div class="lab-controls-card" style="flex:1; min-width:220px;">' +
                    '<div class="garden-prog-wrap">' +
                        '<div class="garden-prog-top"><span>Kehalusan Tumbukan</span><b>' + s.grindPct + '%</b></div>' +
                        '<div class="garden-prog-track"><div class="garden-prog-fill" style="width:' + s.grindPct + '%;"></div></div>' +
                    '</div>' +
                    '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
                        '<button type="button" class="' + (s.grindPct >= 100 ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (s.grindPct >= 100 ? 'disabled' : '') + ' style="flex:1;" onclick="window.aksiTumbukSampelMakanan()">🔨 Tumbuk (+25%)</button>' +
                        '<button type="button" class="' + (s.waterAdded ? 'mypet-gray-cta sm' : 'mypet-green-cta sm') + '" ' + (s.waterAdded ? 'disabled' : '') + ' style="flex:1;" onclick="window.aksiTambahAkuadesMakanan()">💧 Tambah Akuades</button>' +
                    '</div>' +
                    (readyExtract ? '<button type="button" class="mypet-green-cta" onclick="window.lanjutUjiReagenMakanan()">🧪 Tuang ke 3 Tabung &amp; Kertas Buram ➔</button>' : '') +
                '</div>' +
            '</div>';
    } else if (s.step === 2) {
        let t = s.tests;
        let colLugol = !t.lugol ? "#f1f5f9" : (sp.amilum ? "#1e1b4b" : "#b45309");
        let lblLugol = !t.lugol ? "Belum ditetesi" : (sp.amilum ? "Biru Tua / Hitam" : "Cokelat Kekuningan");

        let colBiuret = !t.biuret ? "#f1f5f9" : (sp.protein ? "#7e22ce" : "#38bdf8");
        let lblBiuret = !t.biuret ? "Belum ditetesi" : (sp.protein ? "Ungu Pekat" : "Biru Muda");

        let colBen = !t.benedictDrop ? "#f1f5f9" : (!t.benedictHeat ? "#0ea5e9" : (sp.glukosa ? "#c2410c" : "#0284c7"));
        let lblBen = !t.benedictDrop ? "Belum ditetesi" : (!t.benedictHeat ? "Biru (Perlu Dipanaskan!)" : (sp.glukosa ? "Endapan Merah Bata" : "Tetap Biru"));

        let semuaSelesai = t.lugol && t.biuret && t.benedictDrop && t.benedictHeat && t.paper;

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🧪 Tahap 2: Lakukan 4 Uji Reagen &amp; Amati Perubahan Warna</strong>' +
                '<span>Jangan lupa: tabung <b>Benedict</b> wajib dipanaskan di atas api Bunsen agar reaksi gula pereduksi terlihat!</span>' +
            '</div>' +
            '<div class="food-tubes-grid">' +
                '<div class="food-test-card">' +
                    '<div class="food-tube-title">1. Uji Lugol</div>' +
                    '<div class="food-tube-glass"><div class="food-tube-liquid" style="background:' + colLugol + ';"></div></div>' +
                    '<div class="food-tube-res">' + lblLugol + '</div>' +
                    '<button type="button" class="' + (t.lugol ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (t.lugol ? 'disabled' : '') + ' onclick="window.aksiUjiReagenMakanan(\'lugol\')">' + (t.lugol ? '✓ Selesai' : '💧 Tetes Lugol') + '</button>' +
                '</div>' +
                '<div class="food-test-card">' +
                    '<div class="food-tube-title">2. Uji Biuret</div>' +
                    '<div class="food-tube-glass"><div class="food-tube-liquid" style="background:' + colBiuret + ';"></div></div>' +
                    '<div class="food-tube-res">' + lblBiuret + '</div>' +
                    '<button type="button" class="' + (t.biuret ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (t.biuret ? 'disabled' : '') + ' onclick="window.aksiUjiReagenMakanan(\'biuret\')">' + (t.biuret ? '✓ Selesai' : '💧 Tetes Biuret') + '</button>' +
                '</div>' +
                '<div class="food-test-card">' +
                    '<div class="food-tube-title">3. Uji Benedict</div>' +
                    '<div class="food-tube-glass"><div class="food-tube-liquid" style="background:' + colBen + ';"></div>' + (t.benedictHeat ? '<span class="food-flame-mark">🔥</span>' : '') + '</div>' +
                    '<div class="food-tube-res">' + lblBen + '</div>' +
                    (!t.benedictDrop
                        ? '<button type="button" class="mypet-amber-cta sm" onclick="window.aksiUjiReagenMakanan(\'benedictDrop\')">💧 Tetes Benedict</button>'
                        : '<button type="button" class="' + (t.benedictHeat ? 'mypet-gray-cta sm' : 'mypet-green-cta sm') + '" ' + (t.benedictHeat ? 'disabled' : '') + ' onclick="window.aksiUjiReagenMakanan(\'benedictHeat\')">' + (t.benedictHeat ? '✓ Dipanaskan' : '🔥 Panaskan Bunsen') + '</button>') +
                '</div>' +
                '<div class="food-test-card">' +
                    '<div class="food-tube-title">4. Kertas Buram</div>' +
                    '<div class="food-paper-box' + (t.paper && sp.lemak ? ' is-greasy' : '') + '">' + (t.paper ? (sp.lemak ? '✨ Transparan' : '📄 Kering Buram') : '📄 Kosong') + '</div>' +
                    '<div class="food-tube-res">' + (t.paper ? (sp.lemak ? 'Noda Minyak Tembus Cahaya' : 'Tidak Ada Noda Minyak') : 'Belum diusapkan') + '</div>' +
                    '<button type="button" class="' + (t.paper ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (t.paper ? 'disabled' : '') + ' onclick="window.aksiUjiReagenMakanan(\'paper\')">' + (t.paper ? '✓ Selesai' : '🖌️ Usap Ekstrak') + '</button>' +
                '</div>' +
            '</div>' +
            (semuaSelesai ? '<button type="button" class="mypet-green-cta" style="margin-top:10px;" onclick="window.lanjutDiagnosisMakanan()">📋 Catat Hasil &amp; Diagnosis Kandungan Gizi ➔</button>' : '');
    } else if (s.step === 3) {
        let letters = ["A", "B", "C", "D"];
        let chips = [
            { k: "amilum",  lbl: "🍞 Amilum (Pati)",     obs: "Lugol ➔ " + (sp.amilum ? "Biru Tua/Hitam" : "Cokelat") },
            { k: "protein", lbl: "🥩 Protein",            obs: "Biuret ➔ " + (sp.protein ? "Ungu" : "Biru Muda") },
            { k: "glukosa", lbl: "🍯 Glukosa",            obs: "Benedict+Api ➔ " + (sp.glukosa ? "Merah Bata" : "Biru") },
            { k: "lemak",   lbl: "🧈 Lemak / Lipid",      obs: "Kertas ➔ " + (sp.lemak ? "Transparan" : "Buram Kering") }
        ];

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>📋 Tahap 3: Tentukan Kandungan Positif pada ' + sp.nama + '</strong>' +
                '<span>Aktifkan (centang) HANYA zat makanan yang terbukti <b>POSITIF</b> dari perubahan warna percobaanmu!</span>' +
            '</div>' +
            '<div class="lab-diag-panel">' +
                '<div class="lab-diag-block">' +
                    '<label>1. Pilih kandungan zat gizi POSITIF pada ' + sp.nama + ':</label>' +
                    '<div class="lab-analysis-opts-grid">' +
                        chips.map(function(c) {
                            let on = s.guess[c.k];
                            return '<button type="button" class="lab-analysis-opt' + (on ? ' is-picked' : '') + '" onclick="window.toggleDiagnosisMakanan(\'' + c.k + '\')">' +
                                '<span>' + (on ? '☑️' : '⬜') + '</span><div><b>' + c.lbl + '</b><div style="font-size:10px; color:#64748b;">' + c.obs + '</div></div>' +
                            '</button>';
                        }).join('') +
                    '</div>' +
                '</div>' +
                '<div class="lab-diag-block">' +
                    '<label>2. ' + s.quiz.q + '</label>' +
                    '<div class="lab-analysis-opts-grid">' +
                        s.quiz.opts.map(function(txt, i) {
                            return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === i ? ' is-picked' : '') + '" onclick="window.pilihKuisMakananLab(' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>';
                        }).join('') +
                    '</div>' +
                '</div>' +
                '<button type="button" class="mypet-green-cta" onclick="window.selesaikanUjiMakananLab()">📋 Serahkan Laporan Uji Makanan</button>' +
            '</div>';
    } else if (s.step === 4 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';

        let claimBox = !s.rewardClaimed
            ? '<div class="tc-claim-choice-box">' +
                  '<div style="font-size:12px; font-weight:800; color:#0f766e; margin-bottom:8px;">🎁 Pilih Hadiah Praktikum Uji Makanan:</div>' +
                  '<div class="tc-claim-btns-row">' +
                      '<button type="button" class="mypet-amber-cta sm" onclick="window.klaimHadiahUjiMakanan(\'coin\')">💰 Klaim +🪙 ' + res.coin + ' Coin &amp; +' + res.xp + ' XP</button>' +
                      '<button type="button" class="mypet-green-cta sm" onclick="window.klaimHadiahUjiMakanan(\'pet_food\')">🥗 Kirim +1 Fresh Meal ke My Pet (+' + res.xp + ' XP)</button>' +
                  '</div>' +
              '</div>'
            : '<div class="garden-quiz-feedback ok" style="width:100%; box-sizing:border-box;">' + s.claimedNote + '</div>' +
              '<div style="display:flex; gap:8px; width:100%; max-width:440px; margin-top:6px;">' +
                  '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumUjiMakanan()">🔄 Uji Sampel Lain</button>' +
                  '<button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
              '</div>';

        stageContent =
            '<div class="lab-result-card">' +
                '<div class="lab-result-stars-wrap">' + starsBig + '</div>' +
                '<h3 class="lab-result-title">' + res.predikat + '</h3>' +
                '<div class="lab-result-rewards"><span>' + sp.ikon + ' <b>' + sp.nama + '</b></span><span>🎯 Skor: <b>' + res.score + '/100</b></span><span>⭐ <b>+' + res.xp + ' XP</b></span></div>' +
                '<div class="lab-result-explain"><div style="font-size:12px; color:#334155; line-height:1.5;"><b>💡 Fakta Nutrisi:</b> ' + sp.fakta + '<br>• <b>Ketepatan 4 Zat:</b> ' + res.matchCount + '/4 benar • <b>Kuis Konsep:</b> ' + (res.quizOk ? '✅ Benar' : '❌ Kurang Tepat') + '</div></div>' +
                claimBox +
            '</div>';
    }

    bodyEl.innerHTML = '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml + stageContent + '</div>';
};

window.aksiTumbukSampelMakanan = function() {
    let s = window.labFoodSession;
    if (!s || s.step !== 1 || s.grindPct >= 100) return;
    s.grindPct = Math.min(100, s.grindPct + 25);
    window.renderMyLabUI();
};

window.aksiTambahAkuadesMakanan = function() {
    let s = window.labFoodSession;
    if (!s || s.step !== 1) return;
    if (s.grindPct < 100) return window.tampilkanToastLab("⚠️ Tumbuk sampel hingga halus 100% terlebih dahulu!", "err");
    s.waterAdded = true;
    window.renderMyLabUI();
    window.tampilkanToastLab("💧 Ekstrak cair siap diuji dengan 4 reagen!", "ok");
};

window.lanjutUjiReagenMakanan = function() {
    if (!window.labFoodSession) return;
    window.labFoodSession.step = 2;
    window.renderMyLabUI();
};

window.aksiUjiReagenMakanan = function(key) {
    let s = window.labFoodSession;
    if (!s || s.step !== 2) return;
    s.tests[key] = true;
    window.renderMyLabUI();
};

window.lanjutDiagnosisMakanan = function() {
    if (!window.labFoodSession) return;
    window.labFoodSession.step = 3;
    window.renderMyLabUI();
};

window.toggleDiagnosisMakanan = function(k) {
    let s = window.labFoodSession;
    if (!s || s.step !== 3) return;
    s.guess[k] = !s.guess[k];
    window.renderMyLabUI();
};

window.pilihKuisMakananLab = function(idx) {
    if (!window.labFoodSession) return;
    window.labFoodSession.pickedQuizIdx = idx;
    window.renderMyLabUI();
};

window.selesaikanUjiMakananLab = function() {
    let s = window.labFoodSession;
    if (!s || s.step !== 3) return;
    if (s.pickedQuizIdx < 0) return window.tampilkanToastLab("👆 Jawab pertanyaan konsep nomor 2 terlebih dahulu!", "err");

    let sp = s.sample;
    let keys = ["amilum", "protein", "glukosa", "lemak"];
    let matchCount = keys.filter(function(k) { return Boolean(s.guess[k]) === Boolean(sp[k]); }).length;
    let quizOk = (s.pickedQuizIdx === s.quiz.ans);
    let score = (matchCount * 20) + (quizOk ? 20 : 0);

    let stars = 1, predikat = "Cermati Lagi Perubahan Warna Reagen!", coin = 55, xp = 28;
    if (score >= 95) { stars = 3; predikat = "🌟 Analis Nutrisi Sempurna!"; coin = 140; xp = 70; }
    else if (score >= 60) { stars = 2; predikat = "👍 Asisten Lab Gizi Andal!"; coin = 95; xp = 48; }

    s.resultData = { score: score, stars: stars, predikat: predikat, coin: coin, xp: xp, matchCount: matchCount, quizOk: quizOk };
    s.step = 4;
    window.renderMyLabUI();
};

window.klaimHadiahUjiMakanan = function(mode) {
    let s = window.labFoodSession;
    if (!s || !s.resultData || s.rewardClaimed) return;
    let res = s.resultData;

    if (mode === "pet_food") {
        window.simpanRekorHadiahLabUmum("food_test", res.stars, 0, res.xp, function(lb, uName) {
            if (typeof window.pastikanStrukturDualXPDanPet === "function") window.pastikanStrukturDualXPDanPet(uName);
            if (lb.myPetData && lb.myPetData.foodInventory) {
                lb.myPetData.foodInventory.food_fresh = (Number(lb.myPetData.foodInventory.food_fresh) || 0) + 1;
            }
        });
        s.claimedNote = "🥗 <b>+1 Fresh Meal</b> dikirim ke inventaris <b>My Pet</b> &amp; <b>+⭐ " + res.xp + " XP</b>!";
    } else {
        window.simpanRekorHadiahLabUmum("food_test", res.stars, res.coin, res.xp);
        s.claimedNote = "💰 Berhasil klaim <b>+🪙 " + res.coin + " Coin</b> &amp; <b>+⭐ " + res.xp + " XP</b>!";
    }

    s.rewardClaimed = true;
    window.renderMyLabUI();
};

// =========================================================================
// 11. PRAKTIKUM 8: PEWARNAAN GRAM BAKTERI (SINERGI OBAT TERNAK MY FARM)
// =========================================================================
window.labGramSession = null;
window._gramDecolorTimer = null;

window.MY_LAB_GRAM_BACTERIA = [
    { id: "staph",   nama: "Staphylococcus aureus", gram: "Positif", bentuk: "Kokus", ketBentuk: "Bulat bergerombol seperti buah anggur", warnaHex: "#6b21a8", fakta: "Dinding sel peptidoglikan tebal menahan kompleks Kristal Violet–Iodin saat dibilas alkohol sehingga tetap UNGU." },
    { id: "bacillus",nama: "Bacillus subtilis",     gram: "Positif", bentuk: "Basil", ketBentuk: "Batang berderet (streptobasil)",        warnaHex: "#7e22ce", fakta: "Bakteri batang Gram positif yang mampu membentuk endospora tahan panas di lingkungan ekstrem." },
    { id: "ecoli",   nama: "Escherichia coli",      gram: "Negatif", bentuk: "Basil", ketBentuk: "Batang pendek tunggal",                  warnaHex: "#ec4899", fakta: "Peptidoglikan tipis & membran luar lipid larut oleh alkohol, lalu menyerap pewarna tandingan Safranin menjadi MERAH MUDA." },
    { id: "neisser", nama: "Neisseria gonorrhoeae", gram: "Negatif", bentuk: "Kokus", ketBentuk: "Bulat berpasangan (diplokokus)",         warnaHex: "#f43f5e", fakta: "Bakteri Gram negatif berbentuk diplokokus yang tampak merah muda di bawah mikroskop cahaya." },
    { id: "vibrio",  nama: "Vibrio cholerae",       gram: "Negatif", bentuk: "Koma",  ketBentuk: "Batang melengkung seperti tanda koma",   warnaHex: "#db2777", fakta: "Bakteri Gram negatif berbentuk koma yang bergerak cepat menggunakan flagel monotrik." }
];

window.MY_LAB_GRAM_QUIZ_POOL = [
    { q: "Mengapa bakteri Gram Positif tetap berwarna UNGU setelah seluruh tahapan pewarnaan Gram selesai?", opts: ["Lapisan peptidoglikan dinding selnya sangat tebal sehingga mengunci kompleks Kristal Violet–Iodin meski dibilas alkohol", "Memiliki membran luar berlemak sangat tebal", "Tidak dapat menyerap Kristal Violet sejak awal", "Bakteri Gram positif mengandung klorofil ungu"], ans: 0 },
    { q: "Apa fungsi utama Larutan Iodin (Lugol) pada tahap kedua pewarnaan Gram?", opts: ["Sebagai mordan (pengikat) yang membentuk kompleks Kristal Violet–Iodin agar lebih kuat menempel di peptidoglikan", "Sebagai peluntur warna ungu pada semua bakteri", "Sebagai pewarna tandingan merah muda", "Sebagai pemanas kaca objek"], ans: 0 }
];

window.mulaiPraktikumPewarnaanGram = function() {
    window.hentikanTimerLabTambahan();
    let bac = window.MY_LAB_GRAM_BACTERIA[Math.floor(Math.random() * window.MY_LAB_GRAM_BACTERIA.length)];
    let rawQ = window.MY_LAB_GRAM_QUIZ_POOL[Math.floor(Math.random() * window.MY_LAB_GRAM_QUIZ_POOL.length)];
    let tagged = rawQ.opts.map(function(t, i) { return { txt: t, ok: i === rawQ.ans }; }).sort(function() { return Math.random() - 0.5; });

    window.labGramSession = {
        step: 1, // 1: Apusan & Fiksasi, 2: 4 Reagen Gram, 3: Mikroskop & Diagnosis, 4: Hasil
        bacteria: bac,
        prep: { smear: false, dry: false, fix: false },
        stainStep: 0, // 0: Violet, 1: Iodin, 2: Alkohol (Timing), 3: Safranin
        alcoholDipping: false,
        alcoholVal: 0,
        pickedGram: "",
        pickedShape: "",
        quiz: { q: rawQ.q, opts: tagged.map(function(x) { return x.txt; }), ans: tagged.findIndex(function(x) { return x.ok; }) },
        pickedQuizIdx: -1,
        mistakes: 0,
        resultData: null,
        rewardClaimed: false,
        claimedNote: ""
    };

    window.activeLabView = "gram_stain";
    window.renderMyLabUI();
};

window.bangunSVGBakteriGram = function(bac) {
    let col = bac.warnaHex;
    let shapes = '';
    if (bac.id === "staph") {
        let pts = [[90,95],[108,88],[124,98],[102,112],[120,116],[136,108],[112,130],[168,145],[184,138],[176,158],[194,154],[160,162]];
        pts.forEach(function(p) { shapes += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="10" fill="' + col + '" stroke="#3b0764" stroke-width="2"/>'; });
    } else if (bac.id === "neisser") {
        let pairs = [[82,92],[162,84],[120,148],[182,162],[84,174]];
        pairs.forEach(function(p) {
            shapes += '<circle cx="' + (p[0] - 8) + '" cy="' + p[1] + '" r="9" fill="' + col + '" stroke="#881337" stroke-width="2"/>' +
                      '<circle cx="' + (p[0] + 8) + '" cy="' + p[1] + '" r="9" fill="' + col + '" stroke="#881337" stroke-width="2"/>';
        });
    } else if (bac.id === "vibrio") {
        let commas = [[75,95,20],[150,82,-35],[118,145,50],[178,158,-15],[82,172,70]];
        commas.forEach(function(c) {
            shapes += '<path d="M-16,-4 Q0,-16 16,4" transform="translate(' + c[0] + ',' + c[1] + ') rotate(' + c[2] + ')" fill="none" stroke="' + col + '" stroke-width="11" stroke-linecap="round"/>';
        });
    } else {
        // Basil (Bacillus / E. coli)
        let rods = [[78,92,25],[152,86,-22],[118,136,12],[178,156,42],[86,172,-35],[138,182,5]];
        rods.forEach(function(r) {
            shapes += '<rect x="-18" y="-7" width="36" height="14" rx="7" transform="translate(' + r[0] + ',' + r[1] + ') rotate(' + r[2] + ')" fill="' + col + '" stroke="rgba(15,23,42,0.35)" stroke-width="2"/>';
        });
    }

    return '<div class="lab-microscope-lens">' +
        '<svg viewBox="0 0 260 260" width="100%" height="100%" style="background:#f8fafc;">' +
            '<circle cx="130" cy="130" r="126" fill="#f8fafc"/>' + shapes +
        '</svg><div class="lab-lens-ring-glare"></div><div class="mic-lens-mag-tag">1.000× (Minyak Imersi)</div>' +
    '</div>';
};

window.renderGramStainStage = function(bodyEl) {
    let s = window.labGramSession;
    if (!s) return;
    let bac = s.bacteria;

    let stepNames = ["1. Fiksasi Apusan", "2. 4 Reagen Gram", "3. Diagnosis Mikroskop", "4. Hasil"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">🦠 Sampel Bakteri Misteri</span></div>';

    let stageContent = '';

    if (s.step === 1) {
        let p = s.prep;
        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🔥 Tahap 1: Pembuatan Apusan &amp; Fiksasi Panas</strong>' +
                '<span>Lakukan urutan persiapan kaca objek: <b>1) Oleskan Biakan</b> ➔ <b>2) Keringkan Udara</b> ➔ <b>3) Fiksasi di Api Bunsen</b>!</span>' +
            '</div>' +
            '<div class="tc-laf-bench">' +
                '<div class="tc-laf-visual-row">' +
                    '<div class="tc-laf-item ' + (p.smear ? 'lit' : '') + '"><div class="tc-laf-big-ico">🧫</div><b>Apusan Ose</b><small>' + (p.smear ? 'Sudah Dioleskan' : 'Kaca Kosong') + '</small></div>' +
                    '<div class="tc-laf-item ' + (p.dry ? 'lit' : '') + '"><div class="tc-laf-big-ico">💨</div><b>Pengeringan</b><small>' + (p.dry ? 'Kering Merata' : 'Masih Basah') + '</small></div>' +
                    '<div class="tc-laf-item ' + (p.fix ? 'lit' : '') + '"><div class="tc-laf-big-ico">🔥</div><b>Fiksasi Bunsen</b><small>' + (p.fix ? 'Bakteri Menempel Kuat' : 'Belum Difiskasi') + '</small></div>' +
                '</div>' +
                '<div class="tc-laf-btns">' +
                    '<button type="button" class="' + (p.smear ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (p.smear ? 'disabled' : '') + ' onclick="window.aksiPrepGramLab(\'smear\')">1. 🧫 Oleskan Bakteri</button>' +
                    '<button type="button" class="' + (p.dry ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (p.dry ? 'disabled' : '') + ' onclick="window.aksiPrepGramLab(\'dry\')">2. 💨 Keringkan Udara</button>' +
                    '<button type="button" class="' + (p.fix ? 'mypet-gray-cta sm' : 'mypet-green-cta sm') + '" ' + (p.fix ? 'disabled' : '') + ' onclick="window.aksiPrepGramLab(\'fix\')">3. 🔥 Fiksasi Api Bunsen</button>' +
                '</div>' +
            '</div>';
    } else if (s.step === 2) {
        let reagents = [
            { idx: 0, nama: "Kristal Violet", sub: "Pewarna Utama",     col: "#7e22ce", bg: "#f3e8ff" },
            { idx: 1, nama: "Larutan Iodin",  sub: "Mordan Pengikat",   col: "#b45309", bg: "#fef3c7" },
            { idx: 2, nama: "Alkohol 96%",    sub: "Peluntur (Timing)", col: "#0284c7", bg: "#e0f2fe" },
            { idx: 3, nama: "Safranin",       sub: "Pewarna Tandingan", col: "#e11d48", bg: "#ffe4e6" }
        ];

        let slideTint = s.stainStep === 0 ? "#e2e8f0" : (s.stainStep === 1 ? "#a855f7" : (s.stainStep === 2 ? "#6b21a8" : (s.stainStep === 3 ? (bac.gram === "Positif" ? "#7e22ce" : "#e2e8f0") : bac.warnaHex)));
        let alcoholPanel = '';
        if (s.stainStep === 2) {
            alcoholPanel =
                '<div class="tc-steril-panel" style="margin-top:10px;">' +
                    '<div class="tc-steril-head"><b>💧 Tahap Kritis: Dekolorisasi Alkohol 96%</b><span>Bilas tepat di Zona Hijau agar Gram (+) tidak ikut luntur!</span></div>' +
                    '<div class="tc-gauge-track">' +
                        '<div class="tc-gauge-green-zone" style="left:45%; width:32%;">BILAS OPTIMAL</div>' +
                        '<div id="gram-alc-fill" class="tc-gauge-fill" style="width:' + Math.round(s.alcoholVal) + '%;"></div>' +
                        '<div id="gram-alc-needle" class="tc-gauge-needle" style="left:' + Math.round(s.alcoholVal) + '%;"></div>' +
                    '</div>' +
                    '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                        '<span style="font-size:12px; font-weight:800;">Durasi Alkohol: <b id="gram-alc-txt">' + Math.round(s.alcoholVal) + '%</b></span>' +
                        (!s.alcoholDipping
                            ? '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:8px 18px;" onclick="window.mulaiBilasAlkoholGram()">💧 Teteskan Alkohol 96%</button>'
                            : '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:8px 20px;" onclick="window.stopBilasAlkoholGram()">🚿 Bilas Air Sekarang!</button>') +
                    '</div>' +
                '</div>';
        }

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🎨 Tahap 2: Pewarnaan Gram 4 Langkah Berurutan (' + s.stainStep + '/4)</strong>' +
                '<span>Pilih botol reagen sesuai urutan baku: <b>Kristal Violet ➔ Iodin ➔ Alkohol 96% ➔ Safranin</b>!</span>' +
            '</div>' +
            '<div class="lab-prep-bench" style="margin-bottom:10px;">' +
                '<div class="lab-prep-glass"><div style="width:96px; height:48px; border-radius:24px; background:' + slideTint + '; border:2px solid #94a3b8; transition:background 0.3s;"></div></div>' +
            '</div>' +
            '<div class="lab-bottles-row">' +
                reagents.map(function(r) {
                    let done = r.idx < s.stainStep;
                    return '<button type="button" class="lab-reagent-bottle' + (done ? ' is-done' : '') + '" style="border-color:' + r.col + ';" ' + (done ? 'disabled' : '') + ' onclick="window.klikReagenGramLab(' + r.idx + ')">' +
                        '<div class="bottle-cap" style="background:' + r.col + ';"></div>' +
                        '<div class="bottle-body" style="background:' + r.bg + '; color:' + r.col + ';"><b>' + r.nama + '</b><small>' + (done ? '✓ Selesai' : r.sub) + '</small></div>' +
                    '</button>';
                }).join('') +
            '</div>' +
            alcoholPanel;
    } else if (s.step === 3) {
        let letters = ["A", "B", "C", "D"];
        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🔬 Tahap 3: Amati Warna &amp; Bentuk Bakteri di Mikroskop 1.000×</strong>' +
                '<span>Identifikasi kelompok Gram (Ungu = Positif, Merah Muda = Negatif) serta morfologi sel bakteri!</span>' +
            '</div>' +
            '<div class="lab-osm-split">' +
                '<div class="lab-lens-panel">' + window.bangunSVGBakteriGram(bac) + '</div>' +
                '<div class="lab-diag-panel">' +
                    '<div class="lab-diag-block">' +
                        '<label>1. Klasifikasi Pewarnaan Gram:</label>' +
                        '<div class="mic-pill-row">' +
                            '<button type="button" class="mic-opt-pill' + (s.pickedGram === "Positif" ? ' is-picked' : '') + '" onclick="window.pilihDiagGramLab(\'gram\', \'Positif\')">🟣 Gram Positif (Ungu)</button>' +
                            '<button type="button" class="mic-opt-pill' + (s.pickedGram === "Negatif" ? ' is-picked' : '') + '" onclick="window.pilihDiagGramLab(\'gram\', \'Negatif\')">🩷 Gram Negatif (Merah Muda)</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="lab-diag-block">' +
                        '<label>2. Bentuk Morfologi Sel Bakteri:</label>' +
                        '<div class="mic-pill-row">' +
                            ["Kokus", "Basil", "Koma"].map(function(sh) {
                                return '<button type="button" class="mic-opt-pill' + (s.pickedShape === sh ? ' is-picked' : '') + '" onclick="window.pilihDiagGramLab(\'shape\', \'' + sh + '\')">' + sh + '</button>';
                            }).join('') +
                        '</div>' +
                    '</div>' +
                    '<div class="lab-diag-block">' +
                        '<label>3. ' + s.quiz.q + '</label>' +
                        '<div class="lab-analysis-opts-grid">' +
                            s.quiz.opts.map(function(txt, i) {
                                return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === i ? ' is-picked' : '') + '" onclick="window.pilihDiagGramLab(\'quiz\', ' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>';
                            }).join('') +
                        '</div>' +
                    '</div>' +
                    '<button type="button" class="mypet-green-cta" onclick="window.selesaikanPewarnaanGramLab()">📋 Serahkan Identifikasi Bakteri</button>' +
                '</div>' +
            '</div>';
    } else if (s.step === 4 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';

        let claimBox = !s.rewardClaimed
            ? '<div class="tc-claim-choice-box">' +
                  '<div style="font-size:12px; font-weight:800; color:#0f766e; margin-bottom:8px;">🎁 Pilih Hadiah Praktikum Pewarnaan Gram:</div>' +
                  '<div class="tc-claim-btns-row">' +
                      '<button type="button" class="mypet-amber-cta sm" onclick="window.klaimHadiahGramLab(\'coin\')">💰 Klaim +🪙 ' + res.coin + ' Coin &amp; +' + res.xp + ' XP</button>' +
                      '<button type="button" class="mypet-green-cta sm" onclick="window.klaimHadiahGramLab(\'farm_med\')">💊 Kirim +1 Obat Ternak ke My Farm (+' + res.xp + ' XP)</button>' +
                  '</div>' +
              '</div>'
            : '<div class="garden-quiz-feedback ok" style="width:100%; box-sizing:border-box;">' + s.claimedNote + '</div>' +
              '<div style="display:flex; gap:8px; width:100%; max-width:440px; margin-top:6px;">' +
                  '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumPewarnaanGram()">🔄 Uji Bakteri Baru</button>' +
                  '<button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
              '</div>';

        stageContent =
            '<div class="lab-result-card">' +
                '<div class="lab-result-stars-wrap">' + starsBig + '</div>' +
                '<h3 class="lab-result-title">' + res.predikat + '</h3>' +
                '<div class="lab-result-rewards"><span>🦠 <i><b>' + bac.nama + '</b></i></span><span>🎯 Skor: <b>' + res.score + '/100</b></span><span>⭐ <b>+' + res.xp + ' XP</b></span></div>' +
                '<div class="lab-result-explain"><div style="font-size:12px; color:#334155; line-height:1.5;">' +
                    '<b>🔬 Identitas Resmi:</b> <i>' + bac.nama + '</i> — <b>Gram ' + bac.gram + '</b> • <b>' + bac.bentuk + '</b> (' + bac.ketBentuk + ').<br>' +
                    '• <b>Pembahasan:</b> ' + bac.fakta +
                '</div></div>' +
                claimBox +
            '</div>';
    }

    bodyEl.innerHTML = '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml + stageContent + '</div>';
};

window.aksiPrepGramLab = function(k) {
    let s = window.labGramSession;
    if (!s || s.step !== 1) return;
    if (k === "dry" && !s.prep.smear) { s.mistakes++; return window.tampilkanToastLab("⚠️ Oleskan biakan bakteri dulu!", "err"); }
    if (k === "fix" && !s.prep.dry)   { s.mistakes++; return window.tampilkanToastLab("⚠️ Keringkan apusan udara dulu sebelum difiksasi di api!", "err"); }
    s.prep[k] = true;
    window.renderMyLabUI();
    if (k === "fix") {
        window.tampilkanToastLab("🔥 Fiksasi panas berhasil! Lanjut Tahap Pewarnaan 4 Reagen!", "ok");
        setTimeout(function() {
            if (window.labGramSession && window.labGramSession.step === 1) {
                window.labGramSession.step = 2;
                window.renderMyLabUI();
            }
        }, 700);
    }
};

window.klikReagenGramLab = function(idx) {
    let s = window.labGramSession;
    if (!s || s.step !== 2) return;
    if (idx !== s.stainStep) {
        s.mistakes++;
        let urutan = ["Kristal Violet", "Larutan Iodin", "Alkohol 96%", "Safranin"];
        return window.tampilkanToastLab("⚠️ Salah urutan! Tahap sekarang membutuhkan <b>" + urutan[s.stainStep] + "</b>.", "err");
    }
    if (idx === 2) {
        window.mulaiBilasAlkoholGram();
        return;
    }
    s.stainStep++;
    window.renderMyLabUI();
    if (s.stainStep >= 4) {
        window.tampilkanToastLab("🔬 Keempat reagen Gram selesai! Mengamati di mikroskop 1.000×...", "ok");
        setTimeout(function() {
            if (window.labGramSession && window.labGramSession.step === 2) {
                window.labGramSession.step = 3;
                window.renderMyLabUI();
            }
        }, 750);
    }
};

window.mulaiBilasAlkoholGram = function() {
    let s = window.labGramSession;
    if (!s || s.step !== 2 || s.stainStep !== 2 || s.alcoholDipping) return;
    s.alcoholDipping = true;
    s.alcoholVal = 0;
    window.renderMyLabUI();

    window.hentikanTimerLabTambahan();
    window._gramDecolorTimer = setInterval(function() {
        let cur = window.labGramSession;
        if (!cur || cur.step !== 2 || !cur.alcoholDipping) { window.hentikanTimerLabTambahan(); return; }
        cur.alcoholVal = Math.min(100, cur.alcoholVal + 2.4);
        let fEl = document.getElementById("gram-alc-fill");
        let nEl = document.getElementById("gram-alc-needle");
        let tEl = document.getElementById("gram-alc-txt");
        let v = Math.round(cur.alcoholVal);
        if (fEl) fEl.style.width = v + "%";
        if (nEl) nEl.style.left = v + "%";
        if (tEl) tEl.innerText = v + "%";
        if (cur.alcoholVal >= 100) window.stopBilasAlkoholGram();
    }, 45);
};

window.stopBilasAlkoholGram = function() {
    let s = window.labGramSession;
    if (!s || !s.alcoholDipping) return;
    window.hentikanTimerLabTambahan();
    s.alcoholDipping = false;

    if (s.alcoholVal < 45 || s.alcoholVal > 77) {
        s.mistakes++;
        s.alcoholVal = 0;
        window.renderMyLabUI();
        return window.tampilkanToastLab("⚠️ Durasi alkohol kurang pas! Bilas tepat di Zona Hijau (45%–77%).", "err");
    }
    s.stainStep = 3;
    s.alcoholVal = 0;
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Dekolorisasi sempurna! Sekarang teteskan pewarna tandingan <b>Safranin</b>!", "ok");
};

window.pilihDiagGramLab = function(bagian, val) {
    let s = window.labGramSession;
    if (!s || s.step !== 3) return;
    if (bagian === "gram") s.pickedGram = val;
    else if (bagian === "shape") s.pickedShape = val;
    else s.pickedQuizIdx = val;
    window.renderMyLabUI();
};

window.selesaikanPewarnaanGramLab = function() {
    let s = window.labGramSession;
    if (!s || s.step !== 3) return;
    if (!s.pickedGram || !s.pickedShape || s.pickedQuizIdx < 0) {
        return window.tampilkanToastLab("👆 Lengkapi ketiga jawaban identifikasi terlebih dahulu!", "err");
    }
    let bac = s.bacteria;
    let gramOk = (s.pickedGram === bac.gram);
    let shapeOk = (s.pickedShape === bac.bentuk);
    let quizOk = (s.pickedQuizIdx === s.quiz.ans);

    let score = 100 - Math.min(30, s.mistakes * 8) - (gramOk ? 0 : 30) - (shapeOk ? 0 : 20) - (quizOk ? 0 : 20);
    score = Math.max(25, score);

    let stars = 1, predikat = "Uji Gram Selesai, Latih Lagi Urutannya!", coin = 65, xp = 32;
    if (score >= 85 && gramOk && shapeOk && quizOk) { stars = 3; predikat = "🌟 Mikrobiolog Sempurna!"; coin = 170; xp = 85; }
    else if (score >= 60 && gramOk) { stars = 2; predikat = "👍 Analis Bakteri Andal!"; coin = 115; xp = 58; }

    s.resultData = { score: score, stars: stars, predikat: predikat, coin: coin, xp: xp };
    s.step = 4;
    window.renderMyLabUI();
};

window.klaimHadiahGramLab = function(mode) {
    let s = window.labGramSession;
    if (!s || !s.resultData || s.rewardClaimed) return;
    let res = s.resultData;

    if (mode === "farm_med") {
        window.simpanRekorHadiahLabUmum("gram_stain", res.stars, 0, res.xp, function(lb, uName) {
            if (typeof window.pastikanStrukturMyFarm === "function") window.pastikanStrukturMyFarm(uName);
            if (lb.myFarmData && lb.myFarmData.supplies) {
                lb.myFarmData.supplies.obat_ternak = (Number(lb.myFarmData.supplies.obat_ternak) || 0) + 1;
            }
        });
        s.claimedNote = "💊 <b>+1 Obat Ternak</b> dikirim ke inventaris <b>My Farm</b> &amp; <b>+⭐ " + res.xp + " XP</b>!";
    } else {
        window.simpanRekorHadiahLabUmum("gram_stain", res.stars, res.coin, res.xp);
        s.claimedNote = "💰 Berhasil klaim <b>+🪙 " + res.coin + " Coin</b> &amp; <b>+⭐ " + res.xp + " XP</b>!";
    }

    s.rewardClaimed = true;
    window.renderMyLabUI();
};

// =========================================================================
// 12. PRAKTIKUM 9: FERMENTASI BIOTEKNOLOGI (REAL-TIME TIMER SEPERTI GARDEN)
// =========================================================================
window.labFermSession = null;
window._labFermTickInterval = null;

window.MY_LAB_FERM_RECIPES = [
    { id: "yoghurt", nama: "Yoghurt Probiotik", ikon: "🥛", substrat: "Susu Sapi Segar",   mikroba: "Lactobacillus bulgaricus", tipe: "Bakteri Asam Laktat", suhuMin: 40, suhuMax: 45, durasiDetik: 600,  durasiLabel: "10 mnt", coin: 140, xp: 60,  petFoodId: "food_fresh",  petFoodNama: "Fresh Meal" },
    { id: "tempe",   nama: "Tempe Kedelai",     ikon: "🫘", substrat: "Kedelai Rebus",     mikroba: "Rhizopus oryzae",          tipe: "Jamur Zygomycota",    suhuMin: 28, suhuMax: 33, durasiDetik: 1200, durasiLabel: "20 mnt", coin: 220, xp: 90,  petFoodId: "food_nutri",  petFoodNama: "Nutri Bowl" },
    { id: "tape",    nama: "Tape Singkong",     ikon: "🍠", substrat: "Singkong Kukus",    mikroba: "Saccharomyces cerevisiae", tipe: "Khamir (Ragi)",       suhuMin: 26, suhuMax: 31, durasiDetik: 1800, durasiLabel: "30 mnt", coin: 300, xp: 115, petFoodId: "food_feast",  petFoodNama: "Hearty Feast" },
    { id: "keju",    nama: "Keju Cheddar",      ikon: "🧀", substrat: "Susu + Rennet",     mikroba: "Streptococcus lactis",     tipe: "Bakteri Asam Laktat", suhuMin: 30, suhuMax: 35, durasiDetik: 2700, durasiLabel: "45 mnt", coin: 420, xp: 150, petFoodId: "food_golden", petFoodNama: "Golden Meal" }
];

window.MY_LAB_FERM_BOOST_QUIZ = [
    { q: "Jenis respirasi yang dilakukan ragi Saccharomyces cerevisiae saat mengubah glukosa singkong menjadi etanol dan CO2 pada pembuatan tape adalah...", opts: ["Fermentasi alkohol (respirasi anaerob)", "Fotosintesis reaksi terang", "Siklus Krebs aerob penuh", "Transpirasi stomata"], ans: 0 },
    { q: "Rasa asam segar dan tekstur kental pada yoghurt terbentuk karena Lactobacillus bulgaricus mengubah laktosa susu menjadi...", opts: ["Asam laktat yang menggumpalkan protein kasein", "Gas oksigen murni", "Amilum dan selulosa", "Asam sulfat pekat"], ans: 0 },
    { q: "Benang-benang putih (hifa/miselium) yang mengikat biji kedelai menjadi tempe padat dihasilkan oleh jamur...", opts: ["Rhizopus oryzae", "Escherichia coli", "Plasmodium vivax", "Amoeba proteus"], ans: 0 }
];

window.pastikanStrukturFermentasiLab = function(uName) {
    let lb = window.pastikanStrukturMyLab(uName);
    if (!lb || !lb.myLabData) return null;
    if (!lb.myLabData.fermenters || typeof lb.myLabData.fermenters !== "object") {
        lb.myLabData.fermenters = {
            unlocked: [0, 1],
            slots: {}
        };
    } else {
        if (!Array.isArray(lb.myLabData.fermenters.unlocked)) {
            lb.myLabData.fermenters.unlocked = [0, 1];
        }
        if (!lb.myLabData.fermenters.slots || typeof lb.myLabData.fermenters.slots !== "object") {
            lb.myLabData.fermenters.slots = {};
        }
    }
    return lb;
};

window.bukaPraktikumFermentasi = function() {
    window.hentikanTimerLabTambahan();
    let uName = sessionStorage.getItem("username");
    window.pastikanStrukturFermentasiLab(uName);
    window.labFermSession = { setupSlot: -1, recipeId: "yoghurt", prepped: false, microbeOk: false, tempVal: 25, boostSlot: -1, boostQuiz: null };
    window.activeLabView = "fermentation_lab";
    window.renderMyLabUI();

    window._labFermTickInterval = setInterval(window.perbaruiCountdownFermentasiLab, 1000);
};

window.formatDurasiFermLab = function(ms) {
    let dtk = Math.max(0, Math.ceil(ms / 1000));
    if (dtk <= 0) return "Siap Panen!";
    let m = Math.floor(dtk / 60);
    let s = dtk % 60;
    return m + "m " + String(s).padStart(2, "0") + "d";
};

window.perbaruiCountdownFermentasiLab = function() {
    if (!window.isMyLabModalOpen || window.activeLabView !== "fermentation_lab" || document.hidden) return;
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturFermentasiLab(uName);
    if (!lb) return;
    let slots = lb.myLabData.fermenters.slots || {};
    let now = Date.now();
    let adaBaruSiap = false;

    for (let i = 0; i < 4; i++) {
        let sl = slots[String(i)];
        if (!sl || !sl.recipeId) continue;
        let rem = Math.max(0, (Number(sl.readyAt) || 0) - now);
        let timerEl = document.querySelector('[data-ferm-timer="' + i + '"]');
        let fillEl = document.querySelector('[data-ferm-fill="' + i + '"]');

        if (rem <= 0 && timerEl) {
            adaBaruSiap = true;
            break;
        }
        if (timerEl) timerEl.textContent = window.formatDurasiFermLab(rem);
        if (fillEl) {
            let span = Math.max(1000, (Number(sl.readyAt) || now) - (Number(sl.startedAt) || now));
            let pct = Math.max(2, Math.min(99, Math.round(((now - sl.startedAt) / span) * 100)));
            fillEl.style.width = pct + "%";
        }
    }

    if (adaBaruSiap) window.renderMyLabUI();
};

window.renderFermentationStage = function(bodyEl) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturFermentasiLab(uName);
    if (!lb) return;
    let fState = lb.myLabData.fermenters;
    let st = window.labFermSession || { setupSlot: -1, boostSlot: -1 };
    let now = Date.now();

    // A. Mode Persiapan Batch Baru (Cooking Mama Mini-Setup)
    if (st.setupSlot >= 0) {
        let rec = window.MY_LAB_FERM_RECIPES.find(function(r) { return r.id === st.recipeId; }) || window.MY_LAB_FERM_RECIPES[0];
        let tempOk = (st.tempVal >= rec.suhuMin && st.tempVal <= rec.suhuMax);

        let recBtns = window.MY_LAB_FERM_RECIPES.map(function(r) {
            return '<button type="button" class="lab-spec-btn' + (r.id === rec.id ? ' is-selected' : '') + '" style="padding:7px 9px;" onclick="window.pilihResepFermentasiLab(\'' + r.id + '\')">' +
                '<span class="spec-ico" style="font-size:22px;">' + r.ikon + '</span>' +
                '<div style="text-align:left;"><b>' + r.nama + '</b><small>⏳ ' + r.durasiLabel + ' • 🪙 ' + r.coin + '</small></div>' +
            '</button>';
        }).join('');

        let mikBtns = window.MY_LAB_FERM_RECIPES.map(function(r) {
            return '<button type="button" class="lab-analysis-opt' + (st.microbeOk && r.id === rec.id ? ' is-picked' : '') + '" ' + (st.microbeOk ? 'disabled' : '') + ' onclick="window.pilihMikrobaFermLab(\'' + r.id + '\')">' +
                '<span>🦠</span><div><b><i>' + r.mikroba + '</i></b><div style="font-size:10px; color:#64748b;">' + r.tipe + '</div></div>' +
            '</button>';
        }).join('');

        let siapStart = st.prepped && st.microbeOk && tempOk;
        bodyEl.innerHTML =
            '<div class="lab-stage-wrap">' +
                '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
                '<div class="lab-instruction-banner">' +
                    '<strong>🫙 Siapkan Inkubator #' + (st.setupSlot + 1) + ' — ' + rec.ikon + ' ' + rec.nama + '</strong>' +
                    '<span>1) Pilih produk, 2) Sterilkan substrat, 3) Pilih mikroba yang tepat, 4) Atur suhu optimum (' + rec.suhuMin + '°C–' + rec.suhuMax + '°C)!</span>' +
                '</div>' +
                '<div class="tc-plants-grid" style="margin-bottom:10px;">' + recBtns + '</div>' +
                '<div class="lab-diag-panel">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">' +
                        '<span style="font-size:12px; font-weight:800; color:#0b3954;">1. Persiapan Substrat (' + rec.substrat + '):</span>' +
                        '<button type="button" class="' + (st.prepped ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" style="width:auto; padding:6px 14px;" ' + (st.prepped ? 'disabled' : '') + ' onclick="window.aksiPrepSubstratFerm()">' + (st.prepped ? '✅ Substrat Steril &amp; Siap' : '🔥 Pasteurisasi / Kukus Substrat') + '</button>' +
                    '</div>' +
                    '<div class="lab-diag-block"><label>2. Pilih Mikroorganisme Inokulasi untuk ' + rec.nama + ':</label><div class="lab-analysis-opts-grid">' + mikBtns + '</div></div>' +
                    '<div class="lab-knob-group">' +
                        '<div class="lab-knob-head"><span>🌡️ 3. Suhu Inkubator (Target: ' + rec.suhuMin + '°C–' + rec.suhuMax + '°C)</span><b style="color:' + (tempOk ? '#15803d' : '#d97706') + ';">' + st.tempVal + '°C ' + (tempOk ? '✓ Optimal' : '') + '</b></div>' +
                        '<div class="lab-slider-row">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahSuhuFermLab(-2)">−2</button>' +
                            '<input type="range" min="20" max="55" value="' + st.tempVal + '" oninput="window.aturSuhuFermLab(this.value)">' +
                            '<button type="button" class="lab-step-btn" onclick="window.ubahSuhuFermLab(2)">+2</button>' +
                        '</div>' +
                    '</div>' +
                    '<div style="display:flex; gap:8px;">' +
                        '<button type="button" class="mypet-gray-cta sm" style="width:auto; padding:8px 14px;" onclick="window.batalSetupFermentasiLab()">◀ Batal</button>' +
                        '<button type="button" class="' + (siapStart ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (siapStart ? '' : 'disabled') + ' onclick="window.mulaiInkubasiRealTimeFerm()">🚀 Mulai Fermentasi Real-Time (' + rec.durasiLabel + ')</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
        return;
    }

    // B. Mode Kuis Percepat 2 Menit
    if (st.boostSlot >= 0 && st.boostQuiz) {
        let bq = st.boostQuiz;
        let letters = ["A", "B", "C", "D"];
        bodyEl.innerHTML =
            '<div class="lab-stage-wrap">' +
                '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
                '<div class="lab-instruction-banner"><strong>⚡ Kuis Bioteknologi — Percepat Fermentasi (−2 Menit)</strong><span>Jawab benar untuk mempercepat proses fermentasi pada Inkubator #' + (st.boostSlot + 1) + '!</span></div>' +
                '<div class="lab-diag-panel">' +
                    '<div class="lab-diag-block"><label>' + bq.q + '</label><div class="lab-analysis-opts-grid">' +
                        bq.opts.map(function(txt, i) {
                            return '<button type="button" class="lab-analysis-opt" onclick="window.jawabKuisBoostFerm(' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>';
                        }).join('') +
                    '</div></div>' +
                    '<button type="button" class="mypet-gray-cta sm" style="width:auto; padding:7px 14px;" onclick="window.tutupKuisBoostFerm()">◀ Kembali ke Inkubator</button>' +
                '</div>' +
            '</div>';
        return;
    }

    // C. Layar Utama 4 Inkubator Real-Time
    let unlockPrices = { 2: 150, 3: 250 };
    let slotsHtml = '';
    for (let i = 0; i < 4; i++) {
        let isOpen = fState.unlocked.indexOf(i) !== -1;
        let sl = fState.slots[String(i)] || null;

        if (!isOpen) {
            let cost = unlockPrices[i] || 200;
            slotsHtml +=
                '<div class="ferm-slot-card is-locked">' +
                    '<div class="ferm-slot-head"><span>🔒 Inkubator #' + (i + 1) + '</span><span class="cozy-tag neutral">Terkunci</span></div>' +
                    '<div class="ferm-jar-icon">🔒</div>' +
                    '<p class="ferm-slot-desc">Buka inkubator tambahan untuk memproduksi lebih banyak produk fermentasi secara bersamaan!</p>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.bukaSlotFermentasiLab(' + i + ', ' + cost + ')">🔓 Buka Slot (🪙 ' + cost + ')</button>' +
                '</div>';
            continue;
        }

        if (!sl || !sl.recipeId) {
            slotsHtml +=
                '<div class="ferm-slot-card is-empty">' +
                    '<div class="ferm-slot-head"><span>🫙 Inkubator #' + (i + 1) + '</span><span class="cozy-tag green">Kosong</span></div>' +
                    '<div class="ferm-jar-icon">🫙</div>' +
                    '<p class="ferm-slot-desc">Siap digunakan untuk fermentasi Yoghurt, Tempe, Tape Singkong, atau Keju!</p>' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.bukaSetupSlotFermentasi(' + i + ')">➕ Mulai Fermentasi Baru</button>' +
                '</div>';
            continue;
        }

        let rec = window.MY_LAB_FERM_RECIPES.find(function(r) { return r.id === sl.recipeId; }) || window.MY_LAB_FERM_RECIPES[0];
        let rem = Math.max(0, (Number(sl.readyAt) || 0) - now);
        let isReady = rem <= 0;
        let span = Math.max(1000, (Number(sl.readyAt) || now) - (Number(sl.startedAt) || now));
        let pct = isReady ? 100 : Math.max(2, Math.min(99, Math.round(((now - sl.startedAt) / span) * 100)));

        slotsHtml +=
            '<div class="ferm-slot-card ' + (isReady ? 'is-ready' : 'is-running') + '">' +
                '<div class="ferm-slot-head"><span>' + rec.ikon + ' ' + rec.nama + '</span><span class="cozy-tag ' + (isReady ? 'green' : 'amber') + '">' + (isReady ? '✨ Matang!' : '🫧 Berjalan') + '</span></div>' +
                '<div class="ferm-jar-icon ' + (isReady ? '' : 'is-bubbling') + '">' + rec.ikon + '</div>' +
                '<div class="ferm-microbe-lbl"><i>' + rec.mikroba + '</i> • ' + sl.tempVal + '°C</div>' +
                '<div class="garden-prog-wrap">' +
                    '<div class="garden-prog-top"><span>Fermentasi</span><b ' + (isReady ? '' : 'data-ferm-timer="' + i + '"') + '>' + (isReady ? '100% Siap!' : window.formatDurasiFermLab(rem)) + '</b></div>' +
                    '<div class="garden-prog-track"><div class="garden-prog-fill" data-ferm-fill="' + i + '" style="width:' + pct + '%;"></div></div>' +
                '</div>' +
                (isReady
                    ? '<div style="display:flex; gap:6px; width:100%;">' +
                          '<button type="button" class="mypet-amber-cta sm" style="flex:1;" onclick="window.panenFermentasiLab(' + i + ', \'coin\')">💰 +🪙' + rec.coin + '</button>' +
                          '<button type="button" class="mypet-green-cta sm" style="flex:1;" onclick="window.panenFermentasiLab(' + i + ', \'pet\')">🐾 ' + rec.petFoodNama + '</button>' +
                      '</div>'
                    : '<button type="button" class="' + (sl.boosted ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (sl.boosted ? 'disabled' : '') + ' onclick="window.mulaiKuisBoostFerm(' + i + ')">' + (sl.boosted ? '✓ Sudah Dipercepat' : '⚡ Kuis Percepat (−2 mnt)') + '</button>') +
            '</div>';
    }

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            '<div class="lab-instruction-banner">' +
                '<strong>🫙 Ruang Inkubator Fermentasi Real-Time (Bioteknologi Konvensional)</strong>' +
                '<span>Proses fermentasi terus berjalan mengikuti waktu nyata seperti <b>My Garden</b> meski modal ditutup! Panen untuk Coin/XP atau Makanan My Pet.</span>' +
            '</div>' +
            '<div class="ferm-slots-grid">' + slotsHtml + '</div>' +
        '</div>';
};

window.bukaSlotFermentasiLab = function(slotIdx, cost) {
    let uName = sessionStorage.getItem("username");
    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < cost) return window.tampilkanToastLab("⚠️ Coin belum cukup (butuh " + cost + " Coin)!", "err");
    if (typeof window.gunakanCoinSiswa === "function" && window.gunakanCoinSiswa(cost, "buka_ferm_" + slotIdx, true)) {
        let lb = window.pastikanStrukturFermentasiLab(uName);
        if (lb.myLabData.fermenters.unlocked.indexOf(slotIdx) === -1) lb.myLabData.fermenters.unlocked.push(slotIdx);
        window.simpanDataLabKeServer(lb);
        window.renderMyLabUI();
        window.tampilkanToastLab("🔓 Inkubator #" + (slotIdx + 1) + " berhasil dibuka!", "ok");
    }
};

window.bukaSetupSlotFermentasi = function(slotIdx) {
    window.labFermSession = { setupSlot: slotIdx, recipeId: "yoghurt", prepped: false, microbeOk: false, tempVal: 25, boostSlot: -1, boostQuiz: null };
    window.renderMyLabUI();
};

window.batalSetupFermentasiLab = function() {
    if (window.labFermSession) window.labFermSession.setupSlot = -1;
    window.renderMyLabUI();
};

window.pilihResepFermentasiLab = function(recId) {
    if (!window.labFermSession) return;
    window.labFermSession.recipeId = recId;
    window.labFermSession.prepped = false;
    window.labFermSession.microbeOk = false;
    window.labFermSession.tempVal = 25;
    window.renderMyLabUI();
};

window.aksiPrepSubstratFerm = function() {
    if (!window.labFermSession) return;
    window.labFermSession.prepped = true;
    window.renderMyLabUI();
};

window.pilihMikrobaFermLab = function(pickedId) {
    let st = window.labFermSession;
    if (!st) return;
    if (pickedId !== st.recipeId) {
        return window.tampilkanToastLab("⚠️ Mikroorganisme tidak cocok untuk produk ini! Coba pilih agen biologis yang tepat.", "err");
    }
    st.microbeOk = true;
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Mikroba tepat diinokulasi! Sekarang atur suhu inkubator ke zona optimum.", "ok");
};

window.aturSuhuFermLab = function(val) {
    if (!window.labFermSession) return;
    window.labFermSession.tempVal = Math.max(20, Math.min(55, parseInt(val, 10) || 25));
    window.renderMyLabUI();
};

window.ubahSuhuFermLab = function(d) {
    if (!window.labFermSession) return;
    window.aturSuhuFermLab(window.labFermSession.tempVal + d);
};

window.mulaiInkubasiRealTimeFerm = function() {
    let st = window.labFermSession;
    if (!st || st.setupSlot < 0) return;
    let rec = window.MY_LAB_FERM_RECIPES.find(function(r) { return r.id === st.recipeId; });
    if (!rec) return;

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturFermentasiLab(uName);
    if (!lb) return;

    let now = Date.now();
    lb.myLabData.fermenters.slots[String(st.setupSlot)] = {
        recipeId: rec.id,
        startedAt: now,
        readyAt: now + (rec.durasiDetik * 1000),
        tempVal: st.tempVal,
        boosted: false
    };

    st.setupSlot = -1;
    window.simpanDataLabKeServer(lb);
    window.renderMyLabUI();
    window.tampilkanToastLab("🫧 Fermentasi <b>" + rec.nama + "</b> dimulai! Waktu berjalan real-time (" + rec.durasiLabel + ").", "ok");
};

window.mulaiKuisBoostFerm = function(slotIdx) {
    let raw = window.MY_LAB_FERM_BOOST_QUIZ[Math.floor(Math.random() * window.MY_LAB_FERM_BOOST_QUIZ.length)];
    let tagged = raw.opts.map(function(t, i) { return { txt: t, ok: i === raw.ans }; }).sort(function() { return Math.random() - 0.5; });
    window.labFermSession.boostSlot = slotIdx;
    window.labFermSession.boostQuiz = { q: raw.q, opts: tagged.map(function(x) { return x.txt; }), ans: tagged.findIndex(function(x) { return x.ok; }) };
    window.renderMyLabUI();
};

window.tutupKuisBoostFerm = function() {
    if (window.labFermSession) { window.labFermSession.boostSlot = -1; window.labFermSession.boostQuiz = null; }
    window.renderMyLabUI();
};

window.jawabKuisBoostFerm = function(pickedIdx) {
    let st = window.labFermSession;
    if (!st || st.boostSlot < 0 || !st.boostQuiz) return;
    let slotKey = String(st.boostSlot);
    let ok = (pickedIdx === st.boostQuiz.ans);
    window.tutupKuisBoostFerm();

    if (!ok) return window.tampilkanToastLab("❌ Jawaban kurang tepat! Fermentasi tetap berjalan normal.", "err");

    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturFermentasiLab(uName);
    let sl = lb && lb.myLabData.fermenters.slots[slotKey];
    if (sl) {
        sl.readyAt = Math.max(Date.now(), (Number(sl.readyAt) || Date.now()) - 120000);
        sl.boosted = true;
        window.simpanDataLabKeServer(lb);
        window.renderMyLabUI();
        window.tampilkanToastLab("⚡ Jawaban Benar! Fermentasi dipercepat 2 menit!", "ok");
    }
};

window.panenFermentasiLab = function(slotIdx, mode) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturFermentasiLab(uName);
    if (!lb) return;
    let sl = lb.myLabData.fermenters.slots[String(slotIdx)];
    if (!sl || Date.now() < Number(sl.readyAt)) return;

    let rec = window.MY_LAB_FERM_RECIPES.find(function(r) { return r.id === sl.recipeId; }) || window.MY_LAB_FERM_RECIPES[0];
    delete lb.myLabData.fermenters.slots[String(slotIdx)];

    if (mode === "pet") {
        window.simpanRekorHadiahLabUmum("fermentation_lab", 3, 0, rec.xp, function(lbRef, u) {
            if (typeof window.pastikanStrukturDualXPDanPet === "function") window.pastikanStrukturDualXPDanPet(u);
            if (lbRef.myPetData && lbRef.myPetData.foodInventory) {
                lbRef.myPetData.foodInventory[rec.petFoodId] = (Number(lbRef.myPetData.foodInventory[rec.petFoodId]) || 0) + 1;
            }
        });
        window.renderMyLabUI();
        window.tampilkanToastLab("🎉 Panen <b>" + rec.nama + "</b>! +1 <b>" + rec.petFoodNama + "</b> masuk ke My Pet &amp; +⭐ " + rec.xp + " XP!", "ok");
    } else {
        window.simpanRekorHadiahLabUmum("fermentation_lab", 3, rec.coin, rec.xp);
        window.renderMyLabUI();
        window.tampilkanToastLab("🎉 Panen <b>" + rec.nama + "</b> terjual! +🪙 " + rec.coin + " Coin &amp; +⭐ " + rec.xp + " XP!", "ok");
    }
};

// =========================================================================
// 13. PRAKTIKUM 10: SINTESIS PROTEIN (TRANSKRIPSI mRNA & TRANSLASI RIBOSOM)
// =========================================================================
window.labProteinSession = null;
window._psDndState = { active: false, kind: "", value: "", ghostEl: null, startX: 0, startY: 0, moved: false };
window._psSelectedChip = { kind: "", value: "" };

window.MY_LAB_PROTEIN_GENES = [
    {
        id: "gen_a",
        nama: "Peptida Regulator A",
        dnaTemplate: "TACGGACTTATT",
        mrnaTarget:  "AUGCCUGAAUAA",
        aaTarget:    ["Met (Start)", "Pro", "Glu", "STOP"]
    },
    {
        id: "gen_b",
        nama: "Peptida Enzim B",
        dnaTemplate: "TACAAGGCAATC",
        mrnaTarget:  "AUGUUCCGUUAG",
        aaTarget:    ["Met (Start)", "Phe", "Arg", "STOP"]
    },
    {
        id: "gen_c",
        nama: "Peptida Hormon C",
        dnaTemplate: "TACCGTTTAACT",
        mrnaTarget:  "AUGGCAAAUUGA",
        aaTarget:    ["Met (Start)", "Ala", "Asn", "STOP"]
    }
];

window.MY_LAB_CODON_REF = [
    { kodon: "AUG", anti: "UAC", aa: "Met (Start)" },
    { kodon: "CCU", anti: "GGA", aa: "Pro" },
    { kodon: "GAA", anti: "CUU", aa: "Glu" },
    { kodon: "UUC", anti: "AAG", aa: "Phe" },
    { kodon: "CGU", anti: "GCA", aa: "Arg" },
    { kodon: "GCA", anti: "CGU", aa: "Ala" },
    { kodon: "AAU", anti: "UUA", aa: "Asn" },
    { kodon: "UAA / UAG / UGA", anti: "—", aa: "STOP" }
];

window.MY_LAB_PROTEIN_QUIZ = [
    { q: "Di manakah lokasi berlangsungnya tahap TRANSKRIPSI dan TRANSLASI pada sel eukariotik secara berurutan?", opts: ["Transkripsi di Nukleus (inti sel), Translasi di Ribosom (sitoplasma)", "Transkripsi di Ribosom, Translasi di Nukleus", "Keduanya berlangsung di dalam vakuola", "Transkripsi di lisosom, Translasi di dinding sel"], ans: 0 },
    { q: "Molekul RNA yang bertugas membawa asam amino spesifik sesuai pasangan antikodon–kodon menuju ribosom adalah...", opts: ["tRNA (RNA transfer)", "rRNA struktural", "DNA helikase", "Plasmid bakteri"], ans: 0 }
];

window.mulaiPraktikumSintesisProtein = function() {
    let g = window.MY_LAB_PROTEIN_GENES[Math.floor(Math.random() * window.MY_LAB_PROTEIN_GENES.length)];
    let rawQ = window.MY_LAB_PROTEIN_QUIZ[Math.floor(Math.random() * window.MY_LAB_PROTEIN_QUIZ.length)];
    let tagged = rawQ.opts.map(function(t, i) { return { txt: t, ok: i === rawQ.ans }; }).sort(function() { return Math.random() - 0.5; });

    window._psSelectedChip = { kind: "", value: "" };
    window.labProteinSession = {
        step: 1, // 1: Transkripsi mRNA (12 basa), 2: Translasi Ribosom (4 asam amino), 3: Evaluasi, 4: Hasil
        gene: g,
        mrnaSlots: new Array(12).fill(""),
        aaSlots: ["", "", "", ""],
        quiz: { q: rawQ.q, opts: tagged.map(function(x) { return x.txt; }), ans: tagged.findIndex(function(x) { return x.ok; }) },
        pickedQuizIdx: -1,
        mistakes: 0,
        resultData: null
    };

    window.activeLabView = "protein_synth";
    window.renderMyLabUI();
};

window.renderProteinSynthStage = function(bodyEl) {
    let s = window.labProteinSession;
    if (!s) return;
    let g = s.gene;
    let sel = window._psSelectedChip || { kind: "", value: "" };

    let stepNames = ["1. Transkripsi (Nukleus)", "2. Translasi (Ribosom)", "3. Evaluasi", "4. Hasil"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">🧬 ' + g.nama + '</span></div>';

    let stageContent = '';

    if (s.step === 1) {
        let dnaCells = '';
        let rnaCells = '';
        for (let i = 0; i < 12; i++) {
            let dCh = g.dnaTemplate.charAt(i);
            let rCh = s.mrnaSlots[i];
            let sep = (i > 0 && i % 3 === 0) ? '<span class="ps-triplet-sep">|</span>' : '';
            let dCol = dCh === "A" ? "base-a" : (dCh === "T" ? "base-t" : (dCh === "G" ? "base-g" : "base-c"));
            let rCol = rCh === "A" ? "base-a" : (rCh === "U" ? "base-u" : (rCh === "G" ? "base-g" : (rCh === "C" ? "base-c" : "")));

            dnaCells += sep + '<span class="dna-base-chip ps-base-lg ' + dCol + '">' + dCh + '</span>';
            rnaCells += sep +
                '<div class="gen-drop-slot ps-mrna-slot ' + (rCh ? ('is-filled ' + rCol) : '') + '" data-ps-kind="mrna" data-ps-idx="' + i + '" onclick="window.klikSlotProteinLab(\'mrna\', ' + i + ')">' +
                    (rCh || '?') +
                '</div>';
        }

        let baseChips = ["A", "U", "G", "C", "T"].map(function(b) {
            let act = (sel.kind === "mrna" && sel.value === b) ? " is-chip-active" : "";
            return '<div class="gen-dnd-chip' + act + '" onpointerdown="window.mulaiDragChipProteinLab(event, \'mrna\', \'' + b + '\')" onclick="window.klikChipProteinLab(\'mrna\', \'' + b + '\')">' + b + '</div>';
        }).join('');

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🧬 Tahap 1: Transkripsi di Nukleus (DNA Template 3\'➔5\' menjadi mRNA 5\'➔3\')</strong>' +
                '<span>Seret (atau ketuk cepat) basa nitrogen mRNA komplementer: <b>A➔U</b>, <b>T➔A</b>, <b>G➔C</b>, <b>C➔G</b>! (Hati-hati jebakan Timin!)</span>' +
            '</div>' +
            '<div class="ps-workbench-card">' +
                '<div class="ps-strand-line"><span class="ps-strand-tag">DNA 3\'</span><div class="ps-bases-strip">' + dnaCells + '</div><span class="ps-strand-tag">5\'</span></div>' +
                '<div class="ps-strand-line"><span class="ps-strand-tag is-rna">mRNA 5\'</span><div class="ps-bases-strip">' + rnaCells + '</div><span class="ps-strand-tag is-rna">3\'</span></div>' +
                '<div class="gen-tray-bar">' +
                    '<span class="gen-tray-lbl">🎯 Basa mRNA (Drag / Ketuk Otomatis):</span>' +
                    '<div class="gen-chips-list">' + baseChips + '</div>' +
                    '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:6px 12px;" onclick="window.resetSlotProteinLab(\'mrna\')">🧹 Reset</button>' +
                    '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:6px 16px;" onclick="window.verifikasiTranskripsiLab()">✅ Kunci mRNA ➔</button>' +
                '</div>' +
            '</div>';
    } else if (s.step === 2) {
        let codons = [g.mrnaTarget.slice(0, 3), g.mrnaTarget.slice(3, 6), g.mrnaTarget.slice(6, 9), g.mrnaTarget.slice(9, 12)];
        let slotsHtml = codons.map(function(kod, i) {
            let val = s.aaSlots[i];
            return '<div class="ps-ribosome-col">' +
                '<div class="ps-codon-pill">' + kod + '</div>' +
                '<div class="ps-arrow-down">⬇</div>' +
                '<div class="gen-drop-slot ps-aa-slot' + (val ? ' is-filled' : '') + '" data-ps-kind="aa" data-ps-idx="' + i + '" onclick="window.klikSlotProteinLab(\'aa\', ' + i + ')">' +
                    (val || 'Drop AA') +
                '</div>' +
            '</div>';
        }).join('');

        let aaChips = window.MY_LAB_CODON_REF.map(function(c) {
            let act = (sel.kind === "aa" && sel.value === c.aa) ? " is-chip-active" : "";
            return '<div class="gen-dnd-chip is-geno' + act + '" onpointerdown="window.mulaiDragChipProteinLab(event, \'aa\', \'' + c.aa + '\')" onclick="window.klikChipProteinLab(\'aa\', \'' + c.aa + '\')">' + c.aa + '</div>';
        }).join('');

        let tableRows = window.MY_LAB_CODON_REF.map(function(c) {
            return '<span class="ps-codon-ref-chip"><b>' + c.kodon + '</b> ➔ ' + c.aa + '</span>';
        }).join('');

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>⚙️ Tahap 2: Translasi di Ribosom (Kodon mRNA ➔ Rantai Polipeptida)</strong>' +
                '<span>Cocokkan 4 kodon mRNA dengan <b>Tabel Kodon</b> di bawah, lalu tarik (Drag &amp; Drop) asam amino ke slot Ribosom!</span>' +
            '</div>' +
            '<div class="ps-codon-ref-box"><div style="font-size:11px; font-weight:900; color:#0f766e; margin-bottom:5px;">📖 Tabel Kodon Referensi:</div><div class="ps-codon-ref-grid">' + tableRows + '</div></div>' +
            '<div class="ps-workbench-card">' +
                '<div class="ps-ribosome-row">' + slotsHtml + '</div>' +
                '<div class="gen-tray-bar">' +
                    '<span class="gen-tray-lbl">🧩 tRNA / Asam Amino:</span>' +
                    '<div class="gen-chips-list">' + aaChips + '</div>' +
                    '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:6px 16px;" onclick="window.verifikasiTranslasiLab()">✅ Periksa Polipeptida ➔</button>' +
                '</div>' +
            '</div>';
    } else if (s.step === 3) {
        let letters = ["A", "B", "C", "D"];
        stageContent =
            '<div class="lab-instruction-banner"><strong>🧠 Tahap 3: Evaluasi Konsep Sintesis Protein</strong><span>Rantai polipeptida terbentuk: <b>' + g.aaTarget.join(" — ") + '</b>. Jawab 1 pertanyaan konsep!</span></div>' +
            '<div class="lab-diag-panel">' +
                '<div class="lab-diag-block"><label>' + s.quiz.q + '</label><div class="lab-analysis-opts-grid">' +
                    s.quiz.opts.map(function(txt, i) {
                        return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === i ? ' is-picked' : '') + '" onclick="window.pilihKuisProteinLab(' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>';
                    }).join('') +
                '</div></div>' +
                '<button type="button" class="mypet-green-cta" onclick="window.selesaikanSintesisProteinLab()">📋 Serahkan Laporan Sintesis Protein</button>' +
            '</div>';
    } else if (s.step === 4 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        stageContent =
            '<div class="lab-result-card">' +
                '<div class="lab-result-stars-wrap">' + starsBig + '</div>' +
                '<h3 class="lab-result-title">' + res.predikat + '</h3>' +
                '<div class="lab-result-rewards"><span>🪙 <b>+' + res.coin + ' Coin</b></span><span>⭐ <b>+' + res.xp + ' XP</b></span><span>🎯 Skor: <b>' + res.score + '/100</b></span></div>' +
                '<div class="lab-result-explain"><div style="font-size:12px; color:#334155; line-height:1.5;">' +
                    '<b>🧬 Rantai Polipeptida ' + g.nama + ':</b> ' + g.aaTarget.join(" — ") + '<br>' +
                    '• <b>mRNA:</b> 5\'-' + g.mrnaTarget + '-3\' • <b>Kuis Konsep:</b> ' + (res.quizOk ? '✅ Benar' : '❌ Kurang Tepat') + ' • <b>Kesalahan:</b> ' + s.mistakes + 'x' +
                '</div></div>' +
                '<div style="display:flex; gap:8px; width:100%; max-width:440px; margin-top:6px;">' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumSintesisProtein()">🔄 Sintesis Gen Lain</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
                '</div>' +
            '</div>';
    }

    bodyEl.innerHTML = '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml + stageContent + '</div>';
};

window.terapkanIsiProteinSlot = function(kind, idx, val) {
    let s = window.labProteinSession;
    if (!s) return;
    if (kind === "mrna" && val === "T") {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ RNA tidak memiliki Timin (T)! Pada transkripsi, Adenin (A) DNA berpasangan dengan Urasil (U).", "err");
    }
    if (kind === "mrna" && idx >= 0 && idx < 12) s.mrnaSlots[idx] = val;
    if (kind === "aa" && idx >= 0 && idx < 4) s.aaSlots[idx] = val;
    window.renderMyLabUI();
};

window.klikChipProteinLab = function(kind, val) {
    let s = window.labProteinSession;
    if (!s) return;
    if (kind === "mrna" && val === "T") {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ RNA tidak memiliki Timin (T)! Gunakan Urasil (U) sebagai pasangan Adenin.", "err");
    }
    // Tap cepat: langsung isi slot kosong pertama bila ada, sekaligus aktifkan seleksi chip
    window._psSelectedChip = { kind: kind, value: val };
    if (kind === "mrna") {
        let nextEmpty = s.mrnaSlots.findIndex(function(x) { return !x; });
        if (nextEmpty !== -1) { s.mrnaSlots[nextEmpty] = val; window.renderMyLabUI(); return; }
    } else if (kind === "aa") {
        let nextEmptyA = s.aaSlots.findIndex(function(x) { return !x; });
        if (nextEmptyA !== -1) { s.aaSlots[nextEmptyA] = val; window.renderMyLabUI(); return; }
    }
    window.renderMyLabUI();
};

window.klikSlotProteinLab = function(kind, idx) {
    let sel = window._psSelectedChip;
    let s = window.labProteinSession;
    if (!s) return;
    let cur = kind === "mrna" ? s.mrnaSlots[idx] : s.aaSlots[idx];
    if (cur) {
        window.terapkanIsiProteinSlot(kind, idx, "");
    } else if (sel && sel.kind === kind && sel.value) {
        window.terapkanIsiProteinSlot(kind, idx, sel.value);
    }
};

window.resetSlotProteinLab = function(kind) {
    let s = window.labProteinSession;
    if (!s) return;
    if (kind === "mrna") s.mrnaSlots = new Array(12).fill("");
    else s.aaSlots = ["", "", "", ""];
    window.renderMyLabUI();
};

window.mulaiDragChipProteinLab = function(e, kind, val) {
    if (e.button !== undefined && e.button !== 0) return;
    window._psDndState = { active: true, kind: kind, value: val, ghostEl: null, startX: e.clientX, startY: e.clientY, moved: false };
};

document.addEventListener("pointermove", function(e) {
    let dnd = window._psDndState;
    if (!dnd || !dnd.active) return;
    if (!dnd.moved && Math.hypot(e.clientX - dnd.startX, e.clientY - dnd.startY) < 6) return;
    if (!dnd.moved) {
        dnd.moved = true;
        let ghost = document.createElement("div");
        ghost.className = "gen-dnd-ghost" + (document.body.classList.contains("world-force-rotated") ? " is-rot90" : "");
        ghost.innerText = dnd.value;
        document.body.appendChild(ghost);
        dnd.ghostEl = ghost;
    }
    e.preventDefault();
    if (dnd.ghostEl) { dnd.ghostEl.style.left = e.clientX + "px"; dnd.ghostEl.style.top = e.clientY + "px"; }
    document.querySelectorAll(".gen-drop-slot.is-drag-over").forEach(function(el) { el.classList.remove("is-drag-over"); });
    let under = document.elementFromPoint(e.clientX, e.clientY);
    let slot = (under && under.closest) ? under.closest('.gen-drop-slot[data-ps-kind="' + dnd.kind + '"]') : null;
    if (slot) slot.classList.add("is-drag-over");
}, { passive: false });

document.addEventListener("pointerup", function(e) {
    let dnd = window._psDndState;
    if (!dnd || !dnd.active) return;
    document.querySelectorAll(".gen-drop-slot.is-drag-over").forEach(function(el) { el.classList.remove("is-drag-over"); });
    if (dnd.ghostEl && dnd.ghostEl.parentNode) dnd.ghostEl.parentNode.removeChild(dnd.ghostEl);
    let moved = dnd.moved, kind = dnd.kind, val = dnd.value;
    window._psDndState = { active: false, kind: "", value: "", ghostEl: null, startX: 0, startY: 0, moved: false };
    if (moved) {
        let under = document.elementFromPoint(e.clientX, e.clientY);
        let slot = (under && under.closest) ? under.closest('.gen-drop-slot[data-ps-kind="' + kind + '"]') : null;
        if (slot) window.terapkanIsiProteinSlot(kind, parseInt(slot.getAttribute("data-ps-idx"), 10), val);
    }
});

window.verifikasiTranskripsiLab = function() {
    let s = window.labProteinSession;
    if (!s || s.step !== 1) return;
    if (s.mrnaSlots.some(function(v) { return !v; })) return window.tampilkanToastLab("👆 Lengkapi ke-12 basa mRNA terlebih dahulu!", "err");
    if (s.mrnaSlots.join("") !== s.gene.mrnaTarget) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Ada pasangan basa mRNA yang keliru! Ingat: A➔U, T➔A, G➔C, C➔G. Klik basa salah untuk menghapusnya.", "err");
    }
    s.step = 2;
    window._psSelectedChip = { kind: "", value: "" };
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Transkripsi sempurna! mRNA keluar dari nukleus menuju Ribosom!", "ok");
};

window.verifikasiTranslasiLab = function() {
    let s = window.labProteinSession;
    if (!s || s.step !== 2) return;
    if (s.aaSlots.some(function(v) { return !v; })) return window.tampilkanToastLab("👆 Lengkapi ke-4 slot asam amino di Ribosom!", "err");
    let ok = s.gene.aaTarget.every(function(aa, i) { return s.aaSlots[i] === aa; });
    if (!ok) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Urutan asam amino belum sesuai Tabel Kodon! Cek lagi pasangan setiap triplet mRNA.", "err");
    }
    s.step = 3;
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Polipeptida terbentuk! Lanjut evaluasi konsep singkat.", "ok");
};

window.pilihKuisProteinLab = function(idx) {
    if (!window.labProteinSession) return;
    window.labProteinSession.pickedQuizIdx = idx;
    window.renderMyLabUI();
};

window.selesaikanSintesisProteinLab = function() {
    let s = window.labProteinSession;
    if (!s || s.step !== 3) return;
    if (s.pickedQuizIdx < 0) return window.tampilkanToastLab("👆 Pilih jawaban evaluasi terlebih dahulu!", "err");

    let quizOk = (s.pickedQuizIdx === s.quiz.ans);
    let score = Math.max(25, 100 - Math.min(35, s.mistakes * 8) - (quizOk ? 0 : 20));
    let stars = 1, predikat = "Sintesis Selesai, Latih Lagi Pasangan Basa!", coin = 80, xp = 40;
    if (score >= 85 && quizOk) { stars = 3; predikat = "🌟 Ahli Biologi Molekuler Sempurna!"; coin = 210; xp = 105; }
    else if (score >= 60) { stars = 2; predikat = "👍 Translasi Ribosom Andal!"; coin = 140; xp = 70; }

    s.resultData = { score: score, stars: stars, predikat: predikat, coin: coin, xp: xp, quizOk: quizOk };
    window.simpanRekorHadiahLabUmum("protein_synth", stars, coin, xp);
    s.step = 4;
    window.renderMyLabUI();
};

// =========================================================================
// 14. PRAKTIKUM 11: HEMATOPOESIS & SPESIALISASI SEL IMUN (9 SEL + 4 MISI)
// =========================================================================
window.labHematoSession = null;

window.MY_LAB_HEMATO_CELLS = [
    { id: "eritrosit",  nama: "Eritrosit",          jalur: "mieloid",  ikon: "🔴", sinyal: "Eritropoietin (EPO)", peran: "Mengangkut oksigen (O2) ke seluruh jaringan tubuh melalui hemoglobin." },
    { id: "trombosit",  nama: "Trombosit",          jalur: "mieloid",  ikon: "🩹", sinyal: "Trombopoietin (Megakariosit)", peran: "Membentuk sumbat & benang fibrin untuk membekukan darah saat luka." },
    { id: "neutrofil",  nama: "Neutrofil",          jalur: "mieloid",  ikon: "⚔️", sinyal: "G-CSF (Granulosit)", peran: "Fagosit garis depan pemusnah infeksi bakteri akut secara cepat." },
    { id: "eosinofil",  nama: "Eosinofil",          jalur: "mieloid",  ikon: "🪱", sinyal: "IL-5 (Granulosit)", peran: "Menyerang cacing parasit multiseluler & meredam reaksi alergi." },
    { id: "basofil",    nama: "Basofil",            jalur: "mieloid",  ikon: "🔥", sinyal: "IL-3 (Granulosit)", peran: "Melepaskan histamin (memicu inflamasi) & heparin (antikoagulan)." },
    { id: "makrofag",   nama: "Monosit ➔ Makrofag", jalur: "mieloid",  ikon: "👾", sinyal: "M-CSF (Agranulosit)", peran: "Fagosit besar pembersih patogen/sel mati & penyaji antigen (APC)." },
    { id: "sel_b",      nama: "Sel B ➔ Sel Plasma", jalur: "limfoid",  ikon: "🎯", sinyal: "Imunitas Humoral", peran: "Menghasilkan Antibodi spesifik untuk menetralkan antigen & membentuk sel memori." },
    { id: "sel_t",      nama: "Sel T (Helper/T-C)", jalur: "limfoid",  ikon: "🛡️", sinyal: "Pematangan di Timus", peran: "Imunitas seluler: mengaktifkan sel imun lain & membunuh sel terinfeksi virus." },
    { id: "sel_nk",     nama: "Sel NK",             jalur: "limfoid",  ikon: "⚡", sinyal: "Imunitas Bawaan", peran: "Natural Killer: menghancurkan sel tumor & sel terinfeksi virus tanpa sensitisasi awal." }
];

window.MY_LAB_HEMATO_MISSIONS = [
    { kasus: "Pembuluh darah di jari teriris pisau dan mengeluarkan darah segar! Rekrut sel yang membekukan darah!", ans: ["trombosit"] },
    { kasus: "Tubuh mendaki gunung tinggi dan mengalami hipoksia (kekurangan suplai O2 ke jaringan)! Kerahkan sel pengangkut oksigen!", ans: ["eritrosit"] },
    { kasus: "Bakteri patogen masuk mendadak melalui luka kulit! Kerahkan fagosit granulosit garis depan yang paling pertama tiba!", ans: ["neutrofil"] },
    { kasus: "Terdeteksi infeksi cacing parasit di saluran pencernaan! Kerahkan granulosit spesialis pemusnah parasit cacing!", ans: ["eosinofil"] },
    { kasus: "Antigen bakteri baru terdeteksi dan tubuh memerlukan produksi ANTIBODI spesifik secara massal! Kerahkan sel imunitas humoral!", ans: ["sel_b"] },
    { kasus: "Sel jaringan tubuh telah dibajak oleh virus dan perlu dihancurkan langsung melalui imunitas seluler! Kerahkan sel yang matang di Timus!", ans: ["sel_t"] }
];

window.MY_LAB_HEMATO_QUIZ = [
    { q: "Di manakah Sel Punca Hematopoietik (HSC) berasal, dan di organ manakah Limfosit T mengalami pematangan sebelum bertugas?", opts: ["HSC berasal dari Sumsum Tulang Merah, sedangkan Limfosit T matang di Kelenjar Timus", "HSC berasal dari Jantung, sedangkan Limfosit T matang di Lambung", "Keduanya berasal dan matang di pembuluh vena", "HSC berasal dari Pankreas, sedangkan Limfosit T matang di Ginjal"], ans: 0 },
    { q: "Kelompok sel darah berikut ini yang SELURUHNYA berasal dari jalur Progenitor Limfoid adalah...", opts: ["Limfosit B (Sel Plasma), Limfosit T, dan Sel NK", "Eritrosit, Trombosit, dan Neutrofil", "Eosinofil, Basofil, dan Monosit", "Trombosit, Makrofag, dan Eritrosit"], ans: 0 }
];

window.mulaiPraktikumHematopoesis = function() {
    let antrean = window.MY_LAB_HEMATO_CELLS.slice().sort(function() { return Math.random() - 0.5; });
    let misi = window.MY_LAB_HEMATO_MISSIONS.slice().sort(function() { return Math.random() - 0.5; }).slice(0, 4);
    let rawQ = window.MY_LAB_HEMATO_QUIZ[Math.floor(Math.random() * window.MY_LAB_HEMATO_QUIZ.length)];
    let tagged = rawQ.opts.map(function(t, i) { return { txt: t, ok: i === rawQ.ans }; }).sort(function() { return Math.random() - 0.5; });

    window.labHematoSession = {
        step: 1, // 1: Rekrut 9 Sel ke Jalur Mieloid/Limfoid, 2: 4 Misi Tanggap Darurat, 3: Evaluasi, 4: Hasil
        queue: antrean,
        qIdx: 0,
        recruited: [],
        missions: misi,
        mIdx: 0,
        quiz: { q: rawQ.q, opts: tagged.map(function(x) { return x.txt; }), ans: tagged.findIndex(function(x) { return x.ok; }) },
        pickedQuizIdx: -1,
        mistakes: 0,
        resultData: null
    };

    window.activeLabView = "hematopoiesis";
    window.renderMyLabUI();
};

window.renderHematopoiesisStage = function(bodyEl) {
    let s = window.labHematoSession;
    if (!s) return;

    let stepNames = ["1. Rekrut 9 Sel (HSC)", "2. Misi Imun (4 Kasus)", "3. Evaluasi", "4. Hasil"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">🦴 Sumsum Tulang Merah • ' + s.recruited.length + '/9 Sel</span></div>';

    let stageContent = '';

    if (s.step === 1) {
        let curCell = s.queue[s.qIdx];
        let mieloidList = window.MY_LAB_HEMATO_CELLS.filter(function(c) { return c.jalur === "mieloid"; });
        let limfoidList = window.MY_LAB_HEMATO_CELLS.filter(function(c) { return c.jalur === "limfoid"; });

        let renderBranch = function(list) {
            return list.map(function(c) {
                let isRec = s.recruited.indexOf(c.id) !== -1;
                return '<span class="hem-cell-chip' + (isRec ? ' is-recruited' : '') + '">' + (isRec ? (c.ikon + ' ' + c.nama) : '🔒 ???') + '</span>';
            }).join('');
        };

        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🦴 Tahap 1: Diferensiasi Sel Punca Hematopoietik (HSC) — Rekrut 9 Sel (' + s.recruited.length + '/9)</strong>' +
                '<span>Arahkan setiap sel berikut ke jalur progenitor yang benar: <b>Progenitor Mieloid (6 sel)</b> atau <b>Progenitor Limfoid (3 sel imun)</b>!</span>' +
            '</div>' +
            '<div class="hem-tree-box">' +
                '<div class="hem-hsc-node">🦴 <b>Sel Punca Hematopoietik (HSC)</b></div>' +
                '<div class="hem-branches-grid">' +
                    '<div class="hem-branch-card mieloid">' +
                        '<div class="hem-branch-head">🩸 Jalur Progenitor MIELOID</div>' +
                        '<div class="hem-chips-wrap">' + renderBranch(mieloidList) + '</div>' +
                    '</div>' +
                    '<div class="hem-branch-card limfoid">' +
                        '<div class="hem-branch-head">🛡️ Jalur Progenitor LIMFOID</div>' +
                        '<div class="hem-chips-wrap">' + renderBranch(limfoidList) + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            (curCell
                ? '<div class="hem-recruit-card">' +
                      '<div class="hem-recruit-ico">' + curCell.ikon + '</div>' +
                      '<div style="flex:1; min-width:200px;">' +
                          '<div style="font-size:15px; font-weight:900; color:#0b3954;">' + curCell.nama + ' <span class="cozy-tag neutral">' + curCell.sinyal + '</span></div>' +
                          '<div style="font-size:11.5px; color:#475569; margin:3px 0 8px 0;">' + curCell.peran + '</div>' +
                          '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
                              '<button type="button" class="mypet-amber-cta sm" style="flex:1;" onclick="window.rekrutSelHematopoesis(\'mieloid\')">🩸 Rekrut ke Jalur MIELOID</button>' +
                              '<button type="button" class="mypet-green-cta sm" style="flex:1; background:linear-gradient(180deg,#38bdf8,#0284c7); border-color:#0c4a6e;" onclick="window.rekrutSelHematopoesis(\'limfoid\')">🛡️ Rekrut ke Jalur LIMFOID</button>' +
                          '</div>' +
                      '</div>' +
                  '</div>'
                : '');
    } else if (s.step === 2) {
        let curMisi = s.missions[s.mIdx];
        stageContent =
            '<div class="lab-instruction-banner">' +
                '<strong>🚨 Tahap 2: Misi Tanggap Darurat Tubuh (' + (s.mIdx + 1) + '/' + s.missions.length + ')</strong>' +
                '<span>Seluruh 9 sel darah &amp; imun sudah siap! Kerahkan 1 sel spesialis yang paling tepat untuk mengatasi situasi berikut!</span>' +
            '</div>' +
            '<div class="hem-mission-alert">🚨 <b>KASUS ' + (s.mIdx + 1) + ':</b> ' + curMisi.kasus + '</div>' +
            '<div class="hem-roster-grid">' +
                window.MY_LAB_HEMATO_CELLS.map(function(c) {
                    return '<button type="button" class="hem-deploy-btn" onclick="window.kirimPasukanSelImun(\'' + c.id + '\')">' +
                        '<span class="hem-dep-ico">' + c.ikon + '</span>' +
                        '<b>' + c.nama + '</b>' +
                        '<small>' + (c.jalur === "mieloid" ? "Mieloid" : "Limfoid") + '</small>' +
                    '</button>';
                }).join('') +
            '</div>';
    } else if (s.step === 3) {
        let letters = ["A", "B", "C", "D"];
        stageContent =
            '<div class="lab-instruction-banner"><strong>🧠 Tahap 3: Evaluasi Konsep Hematopoesis</strong><span>Jawab 1 pertanyaan konsep berikut untuk menyelesaikan praktikum!</span></div>' +
            '<div class="lab-diag-panel">' +
                '<div class="lab-diag-block"><label>' + s.quiz.q + '</label><div class="lab-analysis-opts-grid">' +
                    s.quiz.opts.map(function(txt, i) {
                        return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === i ? ' is-picked' : '') + '" onclick="window.pilihKuisHematoLab(' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>';
                    }).join('') +
                '</div></div>' +
                '<button type="button" class="mypet-green-cta" onclick="window.selesaikanHematopoesisLab()">📋 Serahkan Laporan Hematopoesis</button>' +
            '</div>';
    } else if (s.step === 4 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        stageContent =
            '<div class="lab-result-card">' +
                '<div class="lab-result-stars-wrap">' + starsBig + '</div>' +
                '<h3 class="lab-result-title">' + res.predikat + '</h3>' +
                '<div class="lab-result-rewards"><span>🪙 <b>+' + res.coin + ' Coin</b></span><span>⭐ <b>+' + res.xp + ' XP</b></span><span>🎯 Skor: <b>' + res.score + '/100</b></span></div>' +
                '<div class="lab-result-explain"><div style="font-size:12px; color:#334155; line-height:1.5;">' +
                    '<b>🛡️ Ringkasan Hematopoesis:</b> Sel Punca HSC di Sumsum Tulang Merah berdiferensiasi menjadi <b>Jalur Mieloid</b> (Eritrosit, Trombosit, Neutrofil, Eosinofil, Basofil, Monosit/Makrofag) dan <b>Jalur Limfoid</b> (Limfosit B/Sel Plasma, Limfosit T, dan Sel NK).<br>' +
                    '• <b>Kuis Konsep:</b> ' + (res.quizOk ? '✅ Benar' : '❌ Kurang Tepat') + ' • <b>Kesalahan Rekrut/Misi:</b> ' + s.mistakes + 'x' +
                '</div></div>' +
                '<div style="display:flex; gap:8px; width:100%; max-width:440px; margin-top:6px;">' +
                    '<button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumHematopoesis()">🔄 Latih Ulang Pasukan Imun</button>' +
                    '<button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
                '</div>' +
            '</div>';
    }

    bodyEl.innerHTML = '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml + stageContent + '</div>';
};

window.rekrutSelHematopoesis = function(jalurPicked) {
    let s = window.labHematoSession;
    if (!s || s.step !== 1) return;
    let cur = s.queue[s.qIdx];
    if (!cur) return;

    if (jalurPicked !== cur.jalur) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Jalur keliru! <b>" + cur.nama + "</b> berasal dari Progenitor <b>" + cur.jalur.toUpperCase() + "</b>.", "err");
    }

    s.recruited.push(cur.id);
    s.qIdx++;
    if (s.qIdx >= s.queue.length) {
        s.step = 2;
        window.renderMyLabUI();
        window.tampilkanToastLab("🎉 Seluruh 9 jenis sel darah &amp; imun berhasil direkrut! Masuk ke Misi Tanggap Darurat!", "ok");
    } else {
        window.renderMyLabUI();
        window.tampilkanToastLab("✅ " + cur.ikon + " " + cur.nama + " berhasil terdiferensiasi!", "ok");
    }
};

window.kirimPasukanSelImun = function(cellId) {
    let s = window.labHematoSession;
    if (!s || s.step !== 2) return;
    let misi = s.missions[s.mIdx];
    if (!misi) return;

    if (misi.ans.indexOf(cellId) === -1) {
        s.mistakes++;
        let pickedObj = window.MY_LAB_HEMATO_CELLS.find(function(c) { return c.id === cellId; });
        return window.tampilkanToastLab("⚠️ Kurang tepat! " + (pickedObj ? pickedObj.nama + " bertugas: " + pickedObj.peran : "Pilih sel spesialis lainnya!"), "err");
    }

    s.mIdx++;
    if (s.mIdx >= s.missions.length) {
        s.step = 3;
        window.renderMyLabUI();
        window.tampilkanToastLab("🛡️ Keempat kasus darurat berhasil diatasi! Lanjut evaluasi akhir.", "ok");
    } else {
        window.renderMyLabUI();
        window.tampilkanToastLab("✅ Tepat! Kasus tertangani, lanjut kasus berikutnya!", "ok");
    }
};

window.pilihKuisHematoLab = function(idx) {
    if (!window.labHematoSession) return;
    window.labHematoSession.pickedQuizIdx = idx;
    window.renderMyLabUI();
};

window.selesaikanHematopoesisLab = function() {
    let s = window.labHematoSession;
    if (!s || s.step !== 3) return;
    if (s.pickedQuizIdx < 0) return window.tampilkanToastLab("👆 Pilih jawaban evaluasi terlebih dahulu!", "err");

    let quizOk = (s.pickedQuizIdx === s.quiz.ans);
    let score = Math.max(25, 100 - Math.min(35, s.mistakes * 7) - (quizOk ? 0 : 20));
    let stars = 1, predikat = "Pasukan Imun Terbentuk, Hafalkan Lagi Jalurnya!", coin = 95, xp = 48;
    if (score >= 85 && quizOk) { stars = 3; predikat = "🌟 Komandan Hematopoesis & Imun Sempurna!"; coin = 240; xp = 120; }
    else if (score >= 60) { stars = 2; predikat = "👍 Spesialis Hematologi Andal!"; coin = 160; xp = 80; }

    s.resultData = { score: score, stars: stars, predikat: predikat, coin: coin, xp: xp, quizOk: quizOk };
    window.simpanRekorHadiahLabUmum("hematopoiesis", stars, coin, xp);
    s.step = 4;
    window.renderMyLabUI();
};
// =========================================================================
// 15. SISTEM MODAL PANDUAN (?) PENUTUP LAYAR & ROMBAK ANTI-DIKTE (11 PRAKTIKUM)
// =========================================================================

// Helper Acak Stabil Per Sesi (Urutan tombol diacak sekali per sesi, tidak melompat saat diklik)
window.urutanAcakStabilLab = function(sessionObj, key, items) {
    if (!sessionObj) return items;
    if (!sessionObj._shuffledCache) sessionObj._shuffledCache = {};
    if (!sessionObj._shuffledCache[key]) {
        sessionObj._shuffledCache[key] = items.slice().sort(function() { return Math.random() - 0.5; });
    }
    return sessionObj._shuffledCache[key];
};

// Pustaka Referensi Lengkap untuk Tombol (?) — Menutupi Layar Kerja Sementara
window.MY_LAB_GUIDE_DB = {
    blood_test: {
        judul: "🩸 Panduan Uji Golongan Darah (ABO & Rhesus)",
        sections: [
            {
                heading: "1. Prosedur Kerja Aseptis",
                html: "<ol><li>Teteskan sampel darah pada 4 sumur kaca objek (Anti-A, Anti-B, Anti-AB, Anti-D).</li><li>Teteskan masing-masing serum pada sumur berlabel sama.</li><li>Aduk setiap sumur dengan <b>tusuk gigi steril yang berbeda</b> agar tidak terjadi kontaminasi silang.</li></ol>"
            },
            {
                heading: "2. Tabel Pembacaan Aglutinasi (Gumpalan)",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Golongan</th><th>Anti-A</th><th>Anti-B</th><th>Anti-AB</th><th>Donor Aman</th></tr></thead><tbody>" +
                      "<tr><td><b>A</b></td><td>+ (Gumpal)</td><td>− (Cair)</td><td>+</td><td>A, O</td></tr>" +
                      "<tr><td><b>B</b></td><td>−</td><td>+</td><td>+</td><td>B, O</td></tr>" +
                      "<tr><td><b>AB</b></td><td>+</td><td>+</td><td>+</td><td>A, B, AB, O</td></tr>" +
                      "<tr><td><b>O</b></td><td>−</td><td>−</td><td>−</td><td>Hanya O</td></tr>" +
                      "</tbody></table><p style='margin:6px 0 0 0;'><b>Rhesus (Anti-D):</b> Menggumpal (+) = <b>Rh+</b> (bisa terima Rh+ &amp; Rh−) • Cair halus (−) = <b>Rh−</b> (hanya boleh terima Rh−).</p>"
            }
        ]
    },
    membrane_transport: {
        judul: "🔬 Panduan Transpor Membran & Osmosis",
        sections: [
            {
                heading: "1. Prinsip Dasar Osmosis",
                html: "<p>Air (pelarut) berpindah melalui membran semipermeabel dari larutan berkonsentrasi zat terlarut <b>rendah (hipotonis)</b> menuju konsentrasi <b>tinggi (hipertonis)</b>. Saat konsentrasi larutan luar <b>sama</b> dengan isi sel (<b>isotonis</b>), volume sel tetap stabil (100%).</p>"
            },
            {
                heading: "2. Tabel Respons Sel Hewan vs Sel Tumbuhan",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Larutan Luar</th><th>Eritrosit (Sel Hewan)</th><th>Rhoeo discolor (Sel Tumbuhan)</th></tr></thead><tbody>" +
                      "<tr><td><b>Hipotonis</b> (Lebih encer)</td><td>Mengembang ➔ <b>Hemolisis</b> (pecah)</td><td>Penuh &amp; tegang ➔ <b>Turgid</b> (tidak pecah karena dinding sel)</td></tr>" +
                      "<tr><td><b>Isotonis</b> (Sama)</td><td>Normal bikonkaf (Volume 100%)</td><td>Normal seimbang (Volume 100%)</td></tr>" +
                      "<tr><td><b>Hipertonis</b> (Lebih pekat)</td><td>Mengkerut bergerigi ➔ <b>Krenasi</b></td><td>Protoplasma menyusut lepas dari dinding ➔ <b>Plasmolisis</b></td></tr>" +
                      "</tbody></table>"
            }
        ]
    },
    tissue_culture: {
        judul: "🧫 Panduan Kultur Jaringan Tumbuhan",
        sections: [
            {
                heading: "1. Pemilihan Eksplan & Urutan Sterilisasi",
                html: "<p>Pilih jaringan <b>meristem / kambium muda</b> karena selnya aktif bermitosis (totipotensi tinggi). Sterilisasi bertingkat dilakukan dengan urutan baku:</p>" +
                      "<ol><li><b>Alkohol 70%</b> (melarutkan lapisan lilin &amp; bunuh mikroba permukaan).</li><li><b>Kloroks / NaOCl</b> (disinfektan kuat pemusnah spora jamur/bakteri).</li><li><b>Akuades Steril</b> (membilas sisa bahan kimia agar eksplan tidak browning).</li></ol>"
            },
            {
                heading: "2. Pengaturan Rasio Hormon Media MS",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Target Pertumbuhan</th><th>Rasio Auksin vs Sitokinin</th></tr></thead><tbody>" +
                      "<tr><td><b>Induksi Kalus</b></td><td>Auksin &amp; Sitokinin <b>SEIMBANG</b> (keduanya ≥ 4 ppm, selisih ≤ 1)</td></tr>" +
                      "<tr><td><b>Induksi Tunas (Kaulogenesis)</b></td><td><b>Sitokinin LEBIH TINGGI</b> (Sitokinin ≥ 6 ppm &amp; selisih ≥ 2 di atas Auksin)</td></tr>" +
                      "<tr><td><b>Induksi Akar (Rizogenesis)</b></td><td><b>Auksin LEBIH TINGGI</b> daripada Sitokinin</td></tr>" +
                      "</tbody></table>"
            },
            {
                heading: "3. Urutan Inokulasi LAF & Aklimatisasi",
                html: "<p><b>Di Laminar Air Flow (LAF):</b> Nyalakan Api Bunsen ➔ Panaskan/pijarkan ujung Pinset di api ➔ Tanam Eksplan ke botol agar MS.</p>" +
                      "<p><b>Aklimatisasi Plantlet:</b> Pindah ke Pot Tanah &amp; bersihkan agar ➔ Buka Sungkup Plastik bertahap (adaptasi kelembapan) ➔ Kenalkan Cahaya Matahari Pagi.</p>"
            }
        ]
    },
    dna_recomb: {
        judul: "🧬 Panduan Rekombinasi DNA (Produksi Insulin)",
        sections: [
            {
                heading: "1. Sumber Donor & Vektor",
                html: "<p>• <b>Donor Gen Insulin:</b> Sel Beta Pankreas (Pulau Langerhans) manusia.<br>• <b>Vektor Pembawa:</b> Plasmid sirkuler bakteri <i>Escherichia coli</i> (bereplikasi mandiri).</p>"
            },
            {
                heading: "2. Tabel Enzim Restriksi Endonuklease (Urutan Palindrom)",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Enzim</th><th>Urutan Pengenalan (5'➔3')</th><th>Ujung Lengket (Sticky Ends)</th></tr></thead><tbody>" +
                      "<tr><td><b>EcoRI</b></td><td><code>5'-G | AATTC-3'</code></td><td><code>AATT / TTAA</code></td></tr>" +
                      "<tr><td><b>BamHI</b></td><td><code>5'-G | GATCC-3'</code></td><td><code>GATC / CTAG</code></td></tr>" +
                      "<tr><td><b>HindIII</b></td><td><code>5'-A | AGCTT-3'</code></td><td><code>AGCT / TCGA</code></td></tr>" +
                      "</tbody></table><p style='margin:6px 0 0 0;'>DNA manusia &amp; plasmid <b>wajib dipotong dengan enzim yang sama</b> agar menghasilkan ujung lengket komplementer.</p>"
            },
            {
                heading: "3. Ligasi, Transformasi, & Urutan Bioreaktor",
                html: "<p>• <b>Ligasi:</b> Gunakan <b>DNA Ligase</b> untuk menyambung ikatan fosfodiester secara permanen.<br>• <b>Transformasi:</b> Lakukan <i>Heat Shock</i> 42°C (lalu dinginkan di es) agar pori membran <i>E. coli</i> membuka sementara.<br>• <b>Urutan Bioreaktor:</b> Stabilkan Suhu 37°C ➔ Aktifkan Aerator O2 &amp; Media Nutrisi ➔ Ekstraksi, Pemurnian, &amp; Kemas Vial Insulin.</p>"
            }
        ]
    },
    genetics_lab: {
        judul: "🌺 Panduan Genetika & 6 Pola Persilangan Mendel",
        sections: [
            {
                heading: "1. Penyerbukan Silang Buatan & Hukum Mendel",
                html: "<p><b>Urutan Penyerbukan:</b> Kastrasi/isolasi benang sari induk ♀ (cegah autogami) ➔ Kuaskan serbuk sari ♂ ke putik ♀.</p>" +
                      "<p><b>Hukum Mendel I (Segregasi Bebas):</b> Pasangan alel (misal <code>Mm</code>) memisah bebas saat meiosis membentuk gamet <code>M</code> dan <code>m</code>.</p>" +
                      "<p><b>Hukum Mendel II (Asortasi Bebas):</b> Pada 2 sifat beda (<code>MmBb</code>), alel mengelompok bebas membentuk 4 gamet: <code>MB, Mb, mB, mb</code>.</p>"
            },
            {
                heading: "2. Ringkasan 6 Pola Persilangan",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Pola</th><th>Ciri Utama &amp; Rasio Kunci</th></tr></thead><tbody>" +
                      "<tr><td><b>Monohibrid</b></td><td>Dominan penuh: <code>Mm × Mm</code> ➔ Fenotipe <b>3 : 1</b>, Genotipe <b>1 : 2 : 1</b></td></tr>" +
                      "<tr><td><b>Intermediet</b></td><td>Dominansi tak sempurna: <code>Mm</code> memunculkan warna antara (Pink) ➔ Fenotipe <b>1 : 2 : 1</b></td></tr>" +
                      "<tr><td><b>Dihibrid</b></td><td>2 sifat beda: <code>MmBb × MmBb</code> ➔ Fenotipe <b>9 : 3 : 3 : 1</b></td></tr>" +
                      "<tr><td><b>Resiprok</b></td><td>Membalik kelamin (♂×♀ vs ♀×♂): Autosom = <b>Identik</b>; Terpaut X = <b>Berbeda</b></td></tr>" +
                      "<tr><td><b>Testcross</b></td><td>Induk dominan misteri (<code>M?</code>) <b>wajib disilangkan dengan <code>mm</code></b> (100% dom = <code>MM</code>; 1:1 = <code>Mm</code>)</td></tr>" +
                      "<tr><td><b>Backcross</b></td><td>Silang balik F1 (<code>Mm</code>) dengan induk galur murni (<code>MM</code> atau <code>mm</code>)</td></tr>" +
                      "</tbody></table>"
            }
        ]
    },
    microscope_lab: {
        judul: "🔭 Panduan Mikroskop Sel & Jaringan",
        sections: [
            {
                heading: "1. Perbandingan 3 Jenis Mikroskop",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Jenis Mikroskop</th><th>Objek yang Cocok</th><th>Perbesaran Ideal</th></tr></thead><tbody>" +
                      "<tr><td><b>Mikroskop Cahaya</b></td><td>Irisan tipis sel &amp; jaringan (epidermis bawang, stomata, berkas pembuluh batang, otot lurik)</td><td><b>100× – 1.000×</b></td></tr>" +
                      "<tr><td><b>Mikroskop Stereo</b></td><td>Objek tebal / permukaan utuh 3D (serbuk sari, trikoma daun, serangga)</td><td><b>15× – 45×</b></td></tr>" +
                      "<tr><td><b>Mikroskop Elektron</b></td><td>Ultrastruktur organel nano (krista mitokondria, ribosom, virus)</td><td><b>20.000× – 50.000×</b></td></tr>" +
                      "</tbody></table>"
            },
            {
                heading: "2. Pengaturan Optik & Pencahayaan",
                html: "<p>• <b>Rumus Perbesaran Total:</b> <code>Perbesaran Okuler × Perbesaran Objektif</code>.<br>• <b>Pencahayaan Optimal:</b> Sekitar <b>50% – 80%</b> (terlalu rendah gelap, terlalu tinggi silau/kontras hilang).<br>• <b>Fokus:</b> Cari bayangan kasar dengan <b>Makrometer</b>, lalu pertajam hingga ≥ 90% dengan <b>Mikrometer</b>.</p>"
            }
        ]
    },
    food_test: {
        judul: "🥗 Panduan Uji Kandungan Zat Makanan",
        sections: [
            {
                heading: "1. Tabel Reagen & Indikator Hasil Positif",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Zat Makanan</th><th>Reagen / Media</th><th>Perlakuan</th><th>Hasil Positif</th></tr></thead><tbody>" +
                      "<tr><td><b>Amilum (Pati)</b></td><td>Lugol (Iodin)</td><td>Tetes dingin (tanpa api)</td><td><b>Biru Tua / Hitam</b></td></tr>" +
                      "<tr><td><b>Protein</b></td><td>Biuret</td><td>Tetes dingin (tanpa api)</td><td><b>Ungu</b></td></tr>" +
                      "<tr><td><b>Glukosa</b></td><td>Benedict</td><td><b>Wajib dipanaskan</b> di Bunsen</td><td><b>Endapan Merah Bata</b></td></tr>" +
                      "<tr><td><b>Lemak / Lipid</b></td><td>Kertas Buram</td><td>Usap &amp; keringkan</td><td><b>Noda Transparan</b></td></tr>" +
                      "</tbody></table>"
            }
        ]
    },
    gram_stain: {
        judul: "🦠 Panduan Pewarnaan Gram Bakteri",
        sections: [
            {
                heading: "1. Persiapan Apusan",
                html: "<p>Urutan baku: <b>Oleskan Biakan Bakteri</b> ➔ <b>Keringkan di Udara</b> ➔ <b>Fiksasi Panas di Api Bunsen</b> (melekatkan sel agar tidak hanyut saat dibilas).</p>"
            },
            {
                heading: "2. Urutan 4 Reagen Pewarnaan Gram",
                html: "<ol><li><b>Kristal Violet</b> — Pewarna utama (mewarnai semua sel jadi ungu).</li><li><b>Larutan Iodin</b> — Mordan pengikat kompleks Kristal Violet–Iodin.</li><li><b>Alkohol 96%</b> — Peluntur/dekolorisasi (wajib tepat waktu di zona optimal).</li><li><b>Safranin</b> — Pewarna tandingan merah muda bagi sel yang luntur.</li></ol>"
            },
            {
                heading: "3. Interpretasi Mikroskop",
                html: "<p>• <b>Gram Positif (Ungu):</b> Dinding peptidoglikan tebal mengunci Kristal Violet.<br>• <b>Gram Negatif (Merah Muda):</b> Peptidoglikan tipis &amp; membran luar lipid larut oleh alkohol lalu menyerap Safranin.<br>• <b>Bentuk:</b> Bulat = <i>Kokus</i>, Batang = <i>Basil</i>, Lengkung = <i>Koma</i>.</p>"
            }
        ]
    },
    fermentation_lab: {
        judul: "🫙 Panduan Fermentasi Bioteknologi Konvensional",
        sections: [
            {
                heading: "1. Tabel Substrat, Mikroorganisme, & Suhu Optimum",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Produk</th><th>Substrat</th><th>Mikroorganisme</th><th>Suhu Optimum</th></tr></thead><tbody>" +
                      "<tr><td><b>Yoghurt</b></td><td>Susu Sapi</td><td><i>Lactobacillus bulgaricus</i></td><td><b>40°C – 45°C</b></td></tr>" +
                      "<tr><td><b>Tempe</b></td><td>Kedelai Rebus</td><td><i>Rhizopus oryzae</i></td><td><b>28°C – 33°C</b></td></tr>" +
                      "<tr><td><b>Tape Singkong</b></td><td>Singkong Kukus</td><td><i>Saccharomyces cerevisiae</i></td><td><b>26°C – 31°C</b></td></tr>" +
                      "<tr><td><b>Keju Cheddar</b></td><td>Susu + Rennet</td><td><i>Streptococcus lactis</i></td><td><b>30°C – 35°C</b></td></tr>" +
                      "</tbody></table><p style='margin:6px 0 0 0;'>Selalu lakukan <b>pasteurisasi/pengukusan substrat</b> sebelum inokulasi agar mikroba liar mati.</p>"
            }
        ]
    },
    protein_synth: {
        judul: "🧬 Panduan Sintesis Protein & Tabel Kodon",
        sections: [
            {
                heading: "1. Aturan Transkripsi (Nukleus)",
                html: "<p>DNA <i>template</i> (3'➔5') ditranskripsi menjadi mRNA (5'➔3') dengan pasangan basa komplementer: <b>A ➔ U</b> (RNA memakai Urasil, bukan Timin!), <b>T ➔ A</b>, <b>G ➔ C</b>, <b>C ➔ G</b>.</p>"
            },
            {
                heading: "2. Tabel Kodon mRNA ➔ Asam Amino (Translasi di Ribosom)",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Kodon mRNA</th><th>Antikodon tRNA</th><th>Asam Amino</th></tr></thead><tbody>" +
                      "<tr><td><code>AUG</code></td><td><code>UAC</code></td><td><b>Met (Start)</b></td></tr>" +
                      "<tr><td><code>CCU</code></td><td><code>GGA</code></td><td><b>Pro</b> (Prolin)</td></tr>" +
                      "<tr><td><code>GAA</code></td><td><code>CUU</code></td><td><b>Glu</b> (Asam Glutamat)</td></tr>" +
                      "<tr><td><code>UUC</code></td><td><code>AAG</code></td><td><b>Phe</b> (Fenilalanin)</td></tr>" +
                      "<tr><td><code>CGU</code></td><td><code>GCA</code></td><td><b>Arg</b> (Arginin)</td></tr>" +
                      "<tr><td><code>GCA</code></td><td><code>CGU</code></td><td><b>Ala</b> (Alanin)</td></tr>" +
                      "<tr><td><code>AAU</code></td><td><code>UUA</code></td><td><b>Asn</b> (Asparagin)</td></tr>" +
                      "<tr><td><code>UAA / UAG / UGA</code></td><td>—</td><td><b>STOP</b> (Terminasi)</td></tr>" +
                      "</tbody></table>"
            }
        ]
    },
    hematopoiesis: {
        judul: "🛡️ Panduan Hematopoesis & Spesialisasi Sel Imun",
        sections: [
            {
                heading: "1. Jalur Progenitor MIELOID (6 Jenis Sel)",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Sel</th><th>Fungsi Utama</th></tr></thead><tbody>" +
                      "<tr><td><b>Eritrosit</b></td><td>Mengangkut oksigen (O2) lewat hemoglobin</td></tr>" +
                      "<tr><td><b>Trombosit</b></td><td>Pembekuan darah &amp; menutup luka</td></tr>" +
                      "<tr><td><b>Neutrofil</b></td><td>Fagosit garis depan pemusnah infeksi bakteri akut</td></tr>" +
                      "<tr><td><b>Eosinofil</b></td><td>Menyerang cacing parasit &amp; meredam alergi</td></tr>" +
                      "<tr><td><b>Basofil</b></td><td>Melepas histamin (inflamasi) &amp; heparin</td></tr>" +
                      "<tr><td><b>Monosit ➔ Makrofag</b></td><td>Fagosit besar pembersih patogen/sel mati &amp; penyaji antigen</td></tr>" +
                      "</tbody></table>"
            },
            {
                heading: "2. Jalur Progenitor LIMFOID (3 Jenis Sel Imun)",
                html: "<table class='lab-guide-tbl'><thead><tr><th>Sel</th><th>Fungsi Utama</th></tr></thead><tbody>" +
                      "<tr><td><b>Sel B ➔ Sel Plasma</b></td><td>Imunitas humoral: memproduksi <b>Antibodi</b> spesifik &amp; sel memori</td></tr>" +
                      "<tr><td><b>Sel T (Matang di Timus)</b></td><td>Imunitas seluler: mengaktifkan sel imun &amp; membunuh sel terinfeksi virus</td></tr>" +
                      "<tr><td><b>Sel NK (Natural Killer)</b></td><td>Imunitas bawaan: menghancurkan sel tumor &amp; sel terinfeksi virus secara cepat</td></tr>" +
                      "</tbody></table>"
            }
        ]
    }
};

window.bukaPanduanLab = function(customKey) {
    let key = customKey || window.activeLabView;
    let data = window.MY_LAB_GUIDE_DB[key];
    let ov = document.getElementById("mylab-guide-overlay");
    if (!ov || !data) return;

    let secHtml = data.sections.map(function(sec) {
        return '<div class="mylab-guide-sec">' +
            '<h4>' + sec.heading + '</h4>' +
            '<div class="mylab-guide-content">' + sec.html + '</div>' +
        '</div>';
    }).join('');

    ov.innerHTML =
        '<div class="mylab-guide-card">' +
            '<div class="mylab-guide-head">' +
                '<div>' +
                    '<div class="mylab-guide-title">' + data.judul + '</div>' +
                    '<div class="mylab-guide-sub">🧠 Pahami &amp; ingat poin penting di bawah ini, lalu tutup panduan untuk melanjutkan praktikum.</div>' +
                '</div>' +
                '<button type="button" class="garden-quiz-close" onclick="window.tutupPanduanLab()" title="Tutup Panduan">✕</button>' +
            '</div>' +
            '<div class="mylab-guide-body">' + secHtml + '</div>' +
            '<div class="mylab-guide-foot">' +
                '<button type="button" class="mypet-green-cta sm" style="max-width:280px;" onclick="window.tutupPanduanLab()">✅ Saya Ingat — Kembali Bekerja</button>' +
            '</div>' +
        '</div>';

    ov.style.display = "flex";
};

window.tutupPanduanLab = function() {
    let ov = document.getElementById("mylab-guide-overlay");
    if (ov) ov.style.display = "none";
};

// -------------------------------------------------------------------------
// OVERRIDE ANTI-DIKTE 1: KULTUR JARINGAN (URUTAN GELAS STERIL, HORMON, LAF, AKLIMATISASI)
// -------------------------------------------------------------------------
window.pilihGelasSterilTC = function(origIdx) {
    let s = window.labTissueSession;
    if (!s || s.step !== 2 || s.bathDipping || s.bathsDone[origIdx]) return;
    if (origIdx !== s.bathIdx) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Urutan larutan sterilisasi keliru! Buka ❓ Panduan untuk mengingat urutan sterilisasi bertingkat.", "err");
    }
    s.bathPickedIdx = origIdx;
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Larutan tepat dipilih! Sekarang celupkan &amp; angkat eksplan di zona optimal.", "ok");
};

const _origAngkatSterilTC = window.angkatEksplanSterilisasiLab;
window.angkatEksplanSterilisasiLab = function() {
    let prevDone = window.labTissueSession ? window.labTissueSession.bathsDone.filter(Boolean).length : 0;
    if (typeof _origAngkatSterilTC === "function") _origAngkatSterilTC();
    if (window.labTissueSession && window.labTissueSession.bathsDone.filter(Boolean).length > prevDone) {
        window.labTissueSession.bathPickedIdx = -1;
        window.renderMyLabUI();
    }
};

window.sterilisasiAutoklafMediaLab = function() {
    let s = window.labTissueSession;
    if (!s || s.step !== 3) return;
    if (!s.ingredients.ms || !s.ingredients.sukrosa || !s.ingredients.agar) {
        return window.tampilkanToastLab("⚠️ Masukkan seluruh bahan dasar Media MS terlebih dahulu!", "err");
    }
    if (!s.hormoneGoal.cek(s.auksin, s.sitokinin)) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Rasio hormon Auksin &amp; Sitokinin belum tepat untuk target " + s.hormoneGoal.judul + "! Buka ❓ Panduan jika lupa.", "err");
    }
    s.autoclaveDone = true;
    window.tampilkanToastLab("🔥 Media MS steril di Autoklaf 121°C &amp; dituang ke botol kultur! Masuk ke Laminar Air Flow...", "ok");
    setTimeout(function() {
        if (window.labTissueSession && window.labTissueSession.step === 3) {
            window.labTissueSession.step = 4;
            window.renderMyLabUI();
        }
    }, 800);
};

window.renderTissueCultureStage = function(bodyEl) {
    let s = window.labTissueSession;
    if (!s) return;
    let pCfg = window.cariInfoTanamanTC(s.plantId);
    if (typeof s.bathPickedIdx !== "number") s.bathPickedIdx = -1;

    let stepNames = ["1. Eksplan", "2. Sterilisasi", "3. Media MS", "4. Inokulasi LAF", "5. Aklimatisasi"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">' + pCfg.ikon + ' ' + pCfg.nama + '</span></div>';

    let stageContent = '';

    if (s.step === 1) {
        if (!s.tissuePickedOk) {
            let plantBtns = window.MY_LAB_TISSUE_PLANTS.map(function(p) {
                let act = (p.id === s.plantId) ? " is-selected" : "";
                return '<button type="button" class="lab-spec-btn tc-plant-card' + act + '" onclick="window.pilihTanamanKulturLab(\'' + p.id + '\')">' +
                    '<span class="spec-ico">' + p.ikon + '</span>' +
                    '<div style="text-align:left; min-width:0;"><b>' + p.nama + '</b><small><i>' + p.latin + '</i></small></div>' +
                '</button>';
            }).join('');

            let tissueBtns = s.tissueOpts.map(function(opt, idx) {
                return '<button type="button" class="lab-analysis-opt tc-tissue-opt" onclick="window.pilihJaringanEksplanLab(' + idx + ')"><span>🔬</span><b>' + opt.label + '</b></button>';
            }).join('');

            stageContent =
                '<div class="lab-instruction-banner"><strong>✂️ Tahap 1A: Pilih Tanaman Induk &amp; Jaringan Eksplan</strong><span>Tentukan jaringan yang paling sesuai untuk perbanyakan kultur jaringan.</span></div>' +
                '<div class="tc-plants-grid">' + plantBtns + '</div>' +
                '<div class="lab-diag-panel" style="margin-top:10px;"><div class="lab-diag-block"><label>Jaringan manakah dari ' + pCfg.nama + ' yang paling tepat dijadikan eksplan?</label><div class="tc-tissue-opts-grid">' + tissueBtns + '</div></div></div>';
        } else {
            let doneCount = s.slicesDone.filter(Boolean).length;
            let nextCutIdx = s.slicesDone.findIndex(function(v) { return !v; });
            let slicesVisualHtml = '';
            for (let i = 0; i < 4; i++) {
                let isCut = s.slicesDone[i];
                let isNext = (i === nextCutIdx);
                slicesVisualHtml +=
                    '<div class="tc-explant-piece' + (isCut ? ' is-sliced' : '') + '" style="background:linear-gradient(180deg, ' + pCfg.warna + ', ' + pCfg.warnaGelap + ');"><span>' + (isCut ? '✓' : '') + '</span></div>' +
                    '<div class="tc-cut-lane' + (isCut ? ' cut-done' : (isNext ? ' cut-active' : '')) + '" data-cut-idx="' + i + '" onpointerdown="window.mulaiGeserPisauEksplan(event, ' + i + ')" onclick="window.aksiPotongEksplanLab(' + i + ')">' +
                        '<div class="tc-cut-line"></div>' + (isNext ? '<div class="tc-knife-badge">🔪</div>' : '') +
                    '</div>';
            }
            stageContent =
                '<div class="lab-instruction-banner"><strong>🔪 Tahap 1B: Iris Eksplan di Talenan Steril (' + doneCount + '/4)</strong><span>Geser pisau ke bawah atau ketuk garis potong untuk mengiris 4 eksplan seragam.</span></div>' +
                '<div class="lab-glass-slide is-stir-mode tc-cutting-board" onpointermove="window.gerakPisauEksplanLab(event)"><div class="tc-board-surface"><div class="tc-explant-bar"><div class="tc-explant-root" style="background:linear-gradient(180deg, ' + pCfg.warna + ', ' + pCfg.warnaGelap + ');">' + pCfg.ikon + '</div>' + slicesVisualHtml + '</div></div></div>';
        }
    } else if (s.step === 2) {
        let orderIdx = window.urutanAcakStabilLab(s, "tcSterilOrder", [0, 1, 2]);
        let curBath = window.MY_LAB_TC_STERIL_BATHS[Math.min(2, s.bathIdx)];
        let isPickedNow = (s.bathPickedIdx === s.bathIdx);

        let beakersHtml = orderIdx.map(function(origIdx) {
            let b = window.MY_LAB_TC_STERIL_BATHS[origIdx];
            let cleanName = b.nama.replace(/^\d+\.\s*/, "");
            let done = s.bathsDone[origIdx];
            let active = (s.bathPickedIdx === origIdx && !done);
            return '<button type="button" class="tc-beaker-card' + (active ? ' is-active' : '') + (done ? ' is-done' : '') + '" style="cursor:pointer;" ' + (done ? 'disabled' : '') + ' onclick="window.pilihGelasSterilTC(' + origIdx + ')">' +
                '<div class="tc-beaker-ico">' + b.ikon + '</div>' +
                '<div class="tc-beaker-name">' + cleanName + '</div>' +
                '<div class="tc-beaker-stat">' + (done ? '✅ Selesai' : (active ? '🫧 Terpilih' : 'Ketuk Pilih')) + '</div>' +
            '</button>';
        }).join('');

        let zoneLeft = curBath.minOk;
        let zoneWidth = curBath.maxOk - curBath.minOk;

        stageContent =
            '<div class="lab-instruction-banner"><strong>🧴 Tahap 2: Sterilisasi Eksplan Bertingkat (' + s.bathsDone.filter(Boolean).length + '/3)</strong><span>Pilih gelas kimia sesuai urutan sterilisasi yang benar, lalu celup &amp; angkat di zona optimal!</span></div>' +
            '<div class="tc-beakers-row">' + beakersHtml + '</div>' +
            '<div class="tc-steril-panel">' +
                '<div class="tc-steril-head"><b>' + (isPickedNow ? (curBath.ikon + ' ' + curBath.nama.replace(/^\d+\.\s*/, "")) : '👆 Pilih gelas kimia yang tepat untuk tahap ini terlebih dahulu') + '</b></div>' +
                '<div class="tc-gauge-track">' +
                    '<div class="tc-gauge-green-zone" style="left:' + zoneLeft + '%; width:' + zoneWidth + '%;"></div>' +
                    '<div id="tc-steril-bar-fill" class="tc-gauge-fill" style="width:' + Math.round(s.bathVal) + '%;"></div>' +
                    '<div id="tc-steril-needle" class="tc-gauge-needle" style="left:' + Math.round(s.bathVal) + '%;"></div>' +
                '</div>' +
                '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">' +
                    '<span style="font-size:12px; font-weight:800; color:#334155;">Progres Rendam: <b id="tc-steril-val-txt">' + Math.round(s.bathVal) + '%</b></span>' +
                    (!s.bathDipping
                        ? '<button type="button" class="' + (isPickedNow ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" style="width:auto; padding:9px 22px;" ' + (isPickedNow ? '' : 'disabled') + ' onclick="window.mulaiCelupSterilisasiLab()">⬇️ Celupkan Eksplan</button>'
                        : '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:9px 24px; background:linear-gradient(180deg,#fb7185,#dc2626); border-color:#7f1d1d;" onclick="window.angkatEksplanSterilisasiLab()">⬆️ Angkat Sekarang!</button>') +
                '</div>' +
            '</div>';
    } else if (s.step === 3) {
        let a = s.auksin, c = s.sitokinin;
        let ingList = [
            { k: "ms", lbl: "🧪 Garam Mineral MS" },
            { k: "sukrosa", lbl: "🍬 Sukrosa 3%" },
            { k: "agar", lbl: "🍮 Agar-agar" }
        ];
        let ingBtns = ingList.map(function(it) {
            let done = s.ingredients[it.k];
            return '<button type="button" class="tc-ing-btn' + (done ? ' is-added' : '') + '" ' + (done ? 'disabled' : '') + ' onclick="window.tambahBahanMediaMSLab(\'' + it.k + '\')"><b>' + (done ? '✅ ' : '+ ') + it.lbl + '</b></button>';
        }).join('');

        let semuaBahanAda = s.ingredients.ms && s.ingredients.sukrosa && s.ingredients.agar;
        let isiPersen = (s.ingredients.ms ? 28 : 0) + (s.ingredients.sukrosa ? 26 : 0) + (s.ingredients.agar ? 26 : 0) + ((a + c) > 0 ? 10 : 0);

        stageContent =
            '<div class="lab-instruction-banner"><strong>🧪 Tahap 3: Racik Media Agar MS — Misi: ' + s.hormoneGoal.judul + '</strong><span>Masukkan bahan dasar media dan atur perbandingan hormon Auksin–Sitokinin yang tepat!</span></div>' +
            '<div class="tc-media-split">' +
                '<div class="tc-flask-card">' +
                    '<svg viewBox="0 0 140 160" width="128" height="146">' +
                        '<path d="M52,18 L52,52 L22,132 C19,142 26,150 36,150 L104,150 C114,150 121,142 118,132 L88,52 L88,18 Z" fill="#f8fafc" stroke="#0284c7" stroke-width="3.5" stroke-linejoin="round"/>' +
                        '<clipPath id="tcFlaskClip"><path d="M55,54 L26,133 C24,140 29,146 36,146 L104,146 C111,146 116,140 114,133 L85,54 Z"/></clipPath>' +
                        '<rect x="18" y="' + (148 - Math.round(isiPersen * 0.85)) + '" width="104" height="95" fill="#fde68a" clip-path="url(#tcFlaskClip)" style="transition:y 0.25s;"/>' +
                        '<rect x="46" y="12" width="48" height="9" rx="4" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5"/>' +
                    '</svg>' +
                    '<div class="tc-hormone-preview info">Rasio Saat Ini:<br><b>Auksin ' + a + ' ppm : Sitokinin ' + c + ' ppm</b></div>' +
                '</div>' +
                '<div class="lab-controls-card">' +
                    '<div style="font-size:11.5px; font-weight:800; color:#0b3954;">Bahan Dasar Media MS:</div>' +
                    '<div class="tc-ing-row">' + ingBtns + '</div>' +
                    '<div class="lab-knob-group"><div class="lab-knob-head"><span>🌱 Auksin</span><b>' + a + ' ppm</b></div><div class="lab-slider-row"><button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'auksin\', -1)">−1</button><input type="range" min="0" max="10" step="1" value="' + a + '" oninput="window.aturHormonMediaLab(\'auksin\', this.value)"><button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'auksin\', 1)">+1</button></div></div>' +
                    '<div class="lab-knob-group"><div class="lab-knob-head"><span>🌿 Sitokinin</span><b>' + c + ' ppm</b></div><div class="lab-slider-row"><button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'sitokinin\', -1)">−1</button><input type="range" min="0" max="10" step="1" value="' + c + '" oninput="window.aturHormonMediaLab(\'sitokinin\', this.value)"><button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'sitokinin\', 1)">+1</button></div></div>' +
                    '<button type="button" class="' + (semuaBahanAda ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" onclick="window.sterilisasiAutoklafMediaLab()">🔥 Autoklaf (121°C) &amp; Tuang ke Botol ➔</button>' +
                '</div>' +
            '</div>';
    } else if (s.step === 4) {
        if (!s.explantPlanted) {
            let lafItems = window.urutanAcakStabilLab(s, "tcLafOrder", [
                { k: "bunsen",  lbl: "🔥 Nyalakan Api Bunsen", done: function() { return s.bunsenOn; } },
                { k: "tweezer", lbl: "🥢 Panaskan Pinset di Api", done: function() { return s.tweezerSterile; } },
                { k: "plant",   lbl: "🧫 Tanam Eksplan ke Botol", done: function() { return s.explantPlanted; } }
            ]);
            stageContent =
                '<div class="lab-instruction-banner"><strong>🔥 Tahap 4A: Inokulasi Aseptis di Laminar Air Flow (LAF)</strong><span>Jalankan langkah kerja aseptis sesuai urutan standar laboratorium!</span></div>' +
                '<div class="tc-laf-bench">' +
                    '<div class="tc-laf-visual-row">' +
                        '<div class="tc-laf-item ' + (s.bunsenOn ? 'lit' : '') + '"><div class="tc-laf-big-ico">' + (s.bunsenOn ? '🔥' : '🕯️') + '</div><b>Api Bunsen</b><small>' + (s.bunsenOn ? 'Menyala' : 'Mati') + '</small></div>' +
                        '<div class="tc-laf-item ' + (s.tweezerSterile ? 'lit' : '') + '"><div class="tc-laf-big-ico">' + (s.tweezerSterile ? '✨🥢' : '🥢') + '</div><b>Pinset</b><small>' + (s.tweezerSterile ? 'Steril' : 'Belum Steril') + '</small></div>' +
                        '<div class="tc-laf-item"><div class="tc-laf-big-ico">🫙</div><b>Botol Media MS</b><small>Siap Inokulasi</small></div>' +
                    '</div>' +
                    '<div class="tc-laf-btns">' +
                        lafItems.map(function(it) {
                            let isDone = it.done();
                            return '<button type="button" class="' + (isDone ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (isDone ? 'disabled' : '') + ' onclick="window.aksiLAFLab(\'' + it.k + '\')">' + (isDone ? '✓ ' : '') + it.lbl + '</button>';
                        }).join('') +
                    '</div>' +
                '</div>';
        } else {
            let faseLabel = ["Eksplan (Hari 1)", "Kalus (Minggu 2)", "Tunas & Akar (Minggu 5)", "Plantlet Lengkap (Minggu 8)"];
            let isReadyAcclim = (s.growthPhase >= 3);
            stageContent =
                '<div class="lab-instruction-banner"><strong>🌱 Tahap 4B: Inkubasi &amp; Pertumbuhan In Vitro</strong><span>Amati tahapan totipotensi hingga terbentuk plantlet siap aklimatisasi.</span></div>' +
                '<div class="tc-growth-card">' + window.bangunSVGBotolKulturFase(pCfg, s.growthPhase) +
                    '<div class="tc-growth-info">' +
                        '<div class="tc-phase-badge">' + faseLabel[s.growthPhase] + '</div>' +
                        '<div class="garden-prog-track" style="margin:6px 0 10px 0;"><div class="garden-prog-fill" style="width:' + Math.round(((s.growthPhase + 1) / 4) * 100) + '%;"></div></div>' +
                        (!isReadyAcclim
                            ? '<button type="button" class="mypet-amber-cta sm" onclick="window.percepatFaseTumbuhKultur()">⏩ Inkubasi ke Fase Berikutnya</button>'
                            : '<button type="button" class="mypet-green-cta sm" onclick="window.lanjutTahapAklimatisasiLab()">🪴 Lanjut Aklimatisasi ➔</button>') +
                    '</div>' +
                '</div>';
        }
    } else if (s.step === 5) {
        let semuaAcclim = s.acclim.pot && s.acclim.hood && s.acclim.sun;
        let acclimOrder = window.urutanAcakStabilLab(s, "tcAcclimOrder", [
            { k: "pot",  lbl: "🪴 Pindah ke Pot Tanah" },
            { k: "hood", lbl: "💨 Buka Sungkup Bertahap" },
            { k: "sun",  lbl: "☀️ Cahaya Matahari Pagi" }
        ]);
        let letters = ["A", "B", "C", "D"];
        stageContent =
            '<div class="lab-instruction-banner"><strong>🪴 Tahap 5: Aklimatisasi Plantlet &amp; Evaluasi</strong><span>Jalankan tahapan aklimatisasi sesuai urutan yang benar lalu jawab evaluasi konsep!</span></div>' +
            '<div class="tc-acclim-row">' +
                acclimOrder.map(function(it) {
                    let done = s.acclim[it.k];
                    return '<button type="button" class="tc-ing-btn' + (done ? ' is-added' : '') + '" ' + (done ? 'disabled' : '') + ' onclick="window.aksiAklimatisasiLab(\'' + it.k + '\')"><b>' + (done ? '✅ ' : '') + it.lbl + '</b></button>';
                }).join('') +
            '</div>' +
            '<div class="lab-diag-panel">' +
                '<div class="lab-diag-block"><label>🧠 ' + s.quiz.q + '</label><div class="lab-analysis-opts-grid">' +
                    s.quiz.opts.map(function(txt, idx) {
                        return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === idx ? ' is-picked' : '') + '" onclick="window.pilihKuisKulturLab(' + idx + ')"><b>' + letters[idx] + '.</b> <span>' + txt + '</span></button>';
                    }).join('') +
                '</div></div>' +
                '<button type="button" class="' + (semuaAcclim ? 'mypet-green-cta' : 'mypet-gray-cta') + '" onclick="window.selesaikanPraktikumKulturJaringan()">🎉 Panen Plantlet &amp; Lihat Penilaian</button>' +
            '</div>';
    } else if (s.step === 6 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        let bisaKirimGarden = res.stars >= pCfg.minStarsGarden;
        let actionBoxHtml = !s.rewardClaimed
            ? '<div class="tc-claim-choice-box"><div style="font-size:12px; font-weight:800; color:#0f766e; margin-bottom:8px;">🎁 Pilih Nasib Plantlet ' + pCfg.ikon + ' ' + pCfg.nama + ':</div><div class="tc-claim-btns-row">' +
                  '<button type="button" class="mypet-amber-cta sm" onclick="window.klaimHadiahKulturJaringan(\'sell\')">💰 Jual (+🪙 ' + res.sellCoin + ' &amp; +' + res.xp + ' XP)</button>' +
                  '<button type="button" class="' + (bisaKirimGarden ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (bisaKirimGarden ? '' : 'disabled') + ' onclick="window.klaimHadiahKulturJaringan(\'garden\')">' + (bisaKirimGarden ? ('🌱 Kirim +1 Bibit ke My Garden (+' + res.xp + ' XP)') : ('🔒 Butuh ' + pCfg.minStarsGarden + '★')) + '</button>' +
              '</div></div>'
            : '<div class="garden-quiz-feedback ok" style="width:100%; box-sizing:border-box;">' + (s.claimedMode === "garden" ? ('🌱 <b>+1 Bibit ' + pCfg.nama + '</b> masuk ke My Garden &amp; +⭐ ' + res.xp + ' XP!') : ('💰 Terjual! +🪙 ' + res.sellCoin + ' Coin &amp; +⭐ ' + res.xp + ' XP!')) + '</div>' +
              '<div style="display:flex; gap:8px; width:100%; max-width:460px; margin-top:6px;"><button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumKulturJaringan()">🔄 Kultur Lagi</button><button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button></div>';

        stageContent = '<div class="lab-result-card"><div class="lab-result-stars-wrap">' + starsBig + '</div><h3 class="lab-result-title">' + res.predikat + '</h3><div class="lab-result-rewards"><span>' + pCfg.ikon + ' <b>' + pCfg.nama + '</b></span><span>🎯 Skor: <b>' + res.score + '/100</b></span></div><div class="lab-result-explain"><div style="font-size:12px; color:#334155; line-height:1.5;"><b>💡 Fakta Biologi:</b> ' + pCfg.fakta + '<br>• <b>Kesalahan Prosedur:</b> ' + s.mistakes + 'x</div></div>' + actionBoxHtml + '</div>';
    }

    bodyEl.innerHTML = '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml + stageContent + '</div>';
};

// -------------------------------------------------------------------------
// OVERRIDE ANTI-DIKTE 2: REKOMBINASI DNA (TANPA BOCORAN ENZIM, PALINDROM, & URUTAN)
// -------------------------------------------------------------------------
window.pilihEnzimRestriksiLab = function(enzId) {
    let s = window.labDnaSession;
    if (!s || s.step !== 2) return;
    s.pickedEnzymeId = enzId;
    window.renderMyLabUI();
    window.tampilkanToastLab("✂️ Enzim " + window.cariEnzimRestriksiLab(enzId).nama + " dipilih. Ketuk segmen DNA yang sesuai dengan urutan palindromnya!", "");
};

window.aksiPotongSitusDna = function(siteKey, isValidSite) {
    let s = window.labDnaSession;
    if (!s || s.step !== 2) return;
    if (!s.pickedEnzymeId) return window.tampilkanToastLab("👆 Pilih salah satu botol enzim restriksi terlebih dahulu!", "err");
    if (s.pickedEnzymeId !== s.enzId) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Enzim " + window.cariEnzimRestriksiLab(s.pickedEnzymeId).nama + " tidak dapat memotong situs pada DNA ini! Cek tabel palindrom di ❓ Panduan.", "err");
    }
    if (!isValidSite) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Urutan basa pada segmen ini bukan situs pengenalan enzim " + window.cariEnzimRestriksiLab(s.pickedEnzymeId).nama + "!", "err");
    }
    if (s.cuts[siteKey]) return;
    s.cuts[siteKey] = true;
    let semuaTerpotong = s.cuts.insulinLeft && s.cuts.insulinRight && s.cuts.plasmidSite;
    window.renderMyLabUI();
    if (semuaTerpotong) {
        window.tampilkanToastLab("✂️ Sempurna! Sticky ends komplementer terbentuk. Lanjut Tahap Ligasi!", "ok");
        setTimeout(function() {
            if (window.labDnaSession && window.labDnaSession.step === 2) {
                window.labDnaSession.step = 3;
                window.renderMyLabUI();
            }
        }, 800);
    }
};

window.renderDnaRecombStage = function(bodyEl) {
    let s = window.labDnaSession;
    if (!s) return;
    let enz = window.cariEnzimRestriksiLab(s.enzId);

    let stepNames = ["1. Isolasi", "2. Restriksi", "3. Ligasi", "4. Fermentasi", "5. Evaluasi"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">🧬 Produksi Insulin Rekombinan</span></div>';

    let stageContent = '';

    if (s.step === 1) {
        let panelPankreas = !s.organOk
            ? '<div class="dna-iso-card"><div class="dna-iso-head"><span>🧬 Isolasi Gen Insulin Manusia</span></div><p class="dna-iso-sub">Pilih sel donor yang tepat:</p><div class="dna-mini-opts">' +
              s.organOpts.map(function(o, i) { return '<button type="button" class="lab-analysis-opt" onclick="window.pilihSumberDnaLab(\'organ\', ' + i + ')"><span>🫀</span><b>' + o.label + '</b></button>'; }).join('') +
              '</div></div>'
            : '<div class="dna-iso-card is-ready"><div class="dna-iso-head"><span>🧬 Sel Donor Terpilih</span><span class="cozy-tag green">✓</span></div><div class="dna-visual-tube">' + (s.insulinIsolated ? '🧬✨ <b>Gen Insulin Terisolasi</b>' : '🧫 Siap Lisis Membran') + '</div><button type="button" class="' + (s.insulinIsolated ? 'mypet-gray-cta sm' : 'mypet-green-cta sm') + '" ' + (s.insulinIsolated ? 'disabled' : '') + ' onclick="window.aksiEkstraksiTahap1DNA(\'insulin\')">' + (s.insulinIsolated ? '✅ DNA Siap' : '🧪 Lisis &amp; Isolasi DNA') + '</button></div>';

        let panelPlasmid = !s.vektorOk
            ? '<div class="dna-iso-card"><div class="dna-iso-head"><span>🦠 Ekstraksi Vektor E. coli</span></div><p class="dna-iso-sub">Pilih struktur pembawa gen yang tepat:</p><div class="dna-mini-opts">' +
              s.vektorOpts.map(function(o, i) { return '<button type="button" class="lab-analysis-opt" onclick="window.pilihSumberDnaLab(\'vektor\', ' + i + ')"><span>🦠</span><b>' + o.label + '</b></button>'; }).join('') +
              '</div></div>'
            : '<div class="dna-iso-card is-ready"><div class="dna-iso-head"><span>🦠 Vektor Terpilih</span><span class="cozy-tag green">✓</span></div><div class="dna-visual-tube">' + (s.plasmidExtracted ? '⭕✨ <b>Plasmid Terisolasi</b>' : '🦠 Siap Sentrifugasi') + '</div><button type="button" class="' + (s.plasmidExtracted ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (s.plasmidExtracted ? 'disabled' : '') + ' onclick="window.aksiEkstraksiTahap1DNA(\'plasmid\')">' + (s.plasmidExtracted ? '✅ Plasmid Siap' : '🌀 Ekstrak Plasmid') + '</button></div>';

        stageContent = '<div class="lab-instruction-banner"><strong>🧬 Tahap 1: Isolasi Gen Insulin &amp; Vektor E. coli</strong><span>Tentukan sel donor dan vektor bakteri yang tepat, lalu ekstrak material genetiknya.</span></div><div class="dna-two-col">' + panelPankreas + panelPlasmid + '</div>';
    } else if (s.step === 2) {
        let doneCuts = (s.cuts.insulinLeft ? 1 : 0) + (s.cuts.insulinRight ? 1 : 0) + (s.cuts.plasmidSite ? 1 : 0);
        let enzButtons = window.MY_LAB_DNA_ENZYMES.map(function(e) {
            return '<button type="button" class="dna-enz-bottle' + (s.pickedEnzymeId === e.id ? ' is-picked' : '') + '" onclick="window.pilihEnzimRestriksiLab(\'' + e.id + '\')"><div class="dna-enz-title">✂️ ' + e.nama + '</div><small><i>' + e.sumber + '</i></small></button>';
        }).join('');

        let dec1 = enz.decoys[0], dec2 = enz.decoys[1];
        let humanSegs = window.urutanAcakStabilLab(s, "dnaHumanSegs", [
            { k: "insulinLeft",  valid: true,  top: enz.seqTop, bot: enz.seqBot, cutPos: enz.cutPos },
            { k: "decoy1",       valid: false, top: dec1.top,   bot: dec1.bot,   cutPos: 2 },
            { k: "insulinRight", valid: true,  top: enz.seqTop, bot: enz.seqBot, cutPos: enz.cutPos }
        ]);
        let plasmidSegs = window.urutanAcakStabilLab(s, "dnaPlasmidSegs", [
            { k: "decoy2",      valid: false, top: dec2.top,   bot: dec2.bot,   cutPos: 2 },
            { k: "plasmidSite", valid: true,  top: enz.seqTop, bot: enz.seqBot, cutPos: enz.cutPos }
        ]);

        stageContent =
            '<div class="lab-instruction-banner"><strong>✂️ Tahap 2: Pemotongan Enzim Restriksi (' + doneCuts + '/3 Potongan)</strong><span>Baca urutan basa nitrogen di bawah, pilih enzim restriksi yang tepat, lalu potong 2 situs pada DNA manusia &amp; 1 situs pada plasmid!</span></div>' +
            '<div class="dna-enz-tray">' + enzButtons + '</div>' +
            '<div class="dna-cut-bench">' +
                '<div class="dna-cut-group"><div class="dna-cut-group-title">🧬 A. Pita DNA Manusia (Cari 2 situs palindrom yang dikenali enzim):</div><div class="dna-sites-row">' +
                    humanSegs.map(function(sg, idx) {
                        let isCut = sg.valid && Boolean(s.cuts[sg.k]);
                        return '<button type="button" class="dna-site-btn' + (isCut ? ' is-cut' : '') + '" onclick="window.aksiPotongSitusDna(\'' + sg.k + '\', ' + sg.valid + ')">' +
                            '<div class="dna-site-lbl">Segmen DNA #' + (idx + 1) + (isCut ? ' ✅' : '') + '</div>' +
                            window.bangunPitaBasaHTML(sg.top, sg.bot, sg.cutPos, isCut) +
                        '</button>';
                    }).join('') +
                '</div></div>' +
                '<div class="dna-cut-group"><div class="dna-cut-group-title">⭕ B. Cincin Plasmid E. coli (Cari 1 situs pemotongan yang cocok):</div><div class="dna-sites-row two-col">' +
                    plasmidSegs.map(function(sg, idx) {
                        let isCut = sg.valid && Boolean(s.cuts[sg.k]);
                        return '<button type="button" class="dna-site-btn' + (isCut ? ' is-cut' : '') + '" onclick="window.aksiPotongSitusDna(\'' + sg.k + '\', ' + sg.valid + ')">' +
                            '<div class="dna-site-lbl">Segmen Plasmid #' + (idx + 1) + (isCut ? ' ✅' : '') + '</div>' +
                            window.bangunPitaBasaHTML(sg.top, sg.bot, sg.cutPos, isCut) +
                        '</button>';
                    }).join('') +
                '</div></div>' +
            '</div>';
    } else if (s.step === 3) {
        let plasmidVisual = '<div class="dna-lig-visual-card"><svg viewBox="0 0 220 170" width="200" height="154">' +
            '<path d="M 65,45 A 62,62 0 1,0 155,45" fill="none" stroke="#0284c7" stroke-width="14" stroke-linecap="round"/>' +
            '<text x="110" y="148" font-size="10" font-weight="900" fill="#0369a1" text-anchor="middle">Plasmid E. coli</text>' +
            (s.insertPlaced
                ? '<path d="M 67,44 Q 110,12 153,44" fill="none" stroke="' + (s.ligasePct >= 100 ? '#16a34a' : '#f97316') + '" stroke-width="14" stroke-linecap="round"/><text x="110" y="24" font-size="10" font-weight="900" fill="' + (s.ligasePct >= 100 ? '#15803d' : '#c2410c') + '" text-anchor="middle">Gen Insulin</text>'
                : '<path d="M 70,40 Q 110,16 150,40" fill="none" stroke="#94a3b8" stroke-width="4" stroke-dasharray="6,6"/><text x="110" y="26" font-size="10" font-weight="800" fill="#64748b" text-anchor="middle">Celah: ' + enz.overhangTop + '</text>') +
            '<circle cx="65" cy="45" r="7" fill="' + (s.ligasePct >= 100 ? '#22c55e' : '#facc15') + '" stroke="#0f172a" stroke-width="2"/>' +
            '<circle cx="155" cy="45" r="7" fill="' + (s.ligasePct >= 100 ? '#22c55e' : '#facc15') + '" stroke="#0f172a" stroke-width="2"/>' +
        '</svg><div class="dna-sticky-hint">Celah Plasmid: <b>' + enz.overhangTop + ' / ' + enz.overhangBot + '</b></div></div>';

        let rightPanel = '';
        if (!s.insertPlaced) {
            rightPanel = '<div class="lab-controls-card"><div style="font-size:12.5px; font-weight:800; color:#0b3954;">Pilih fragmen DNA dengan ujung lengket komplementer:</div><div class="dna-mini-opts">' +
                s.ligasiFrags.map(function(f, idx) {
                    return '<button type="button" class="lab-analysis-opt dna-frag-btn" onclick="window.aksiSisipkanFragmenDNA(' + idx + ')"><span>🧬</span><div><b>Fragmen #' + (idx + 1) + '</b><div style="font-size:10.5px; color:#0284c7; font-weight:800;">' + f.ujung + '</div></div></button>';
                }).join('') + '</div></div>';
        } else if (!s.ligasePicked) {
            rightPanel = '<div class="lab-controls-card"><div style="font-size:12.5px; font-weight:800; color:#15803d;">✅ Fragmen terpasang sementara!</div><div style="font-size:12px; font-weight:800; color:#0b3954;">Pilih enzim untuk menyambung ikatan fosfodiester secara permanen:</div><div class="dna-mini-opts">' +
                s.ligEnzOpts.map(function(e, idx) {
                    return '<button type="button" class="lab-analysis-opt" onclick="window.pilihEnzimLigasiLab(' + idx + ')"><span>🧪</span><b>' + e.nama + '</b></button>';
                }).join('') + '</div></div>';
        } else {
            rightPanel = '<div class="lab-controls-card"><div style="font-size:12.5px; font-weight:800; color:#15803d;">🧬 Enzim Aktif — Selesaikan Ligasi!</div><div class="garden-prog-wrap"><div class="garden-prog-top"><span>Progres Ligasi rDNA</span><b>' + s.ligasePct + '%</b></div><div class="garden-prog-track"><div class="garden-prog-fill" style="width:' + s.ligasePct + '%;"></div></div></div><button type="button" class="mypet-green-cta" onclick="window.aksiKatalisisLigaseLab()">⚡ Katalisis Ligasi (+25%)</button></div>';
        }
        stageContent = '<div class="lab-instruction-banner"><strong>🔗 Tahap 3: Ligasi DNA Rekombinan (rDNA)</strong><span>Cocokkan ujung lengket fragmen gen insulin lalu sambungkan secara permanen.</span></div><div class="tc-media-split">' + plasmidVisual + rightPanel + '</div>';
    } else if (s.step === 4) {
        if (!s.heatDone) {
            stageContent =
                '<div class="lab-instruction-banner"><strong>🔥 Tahap 4A: Transformasi rDNA (Heat Shock)</strong><span>Mulai perlakuan kejutan panas lalu dinginkan di es tepat pada zona optimal!</span></div>' +
                '<div class="tc-steril-panel">' +
                    '<div class="tc-steril-head"><b>🦠 Tabung E. coli Kompeten + Plasmid rDNA</b></div>' +
                    '<div class="tc-gauge-track"><div class="tc-gauge-green-zone" style="left:46%; width:30%;"></div><div id="dna-heat-bar-fill" class="tc-gauge-fill" style="width:' + Math.round(s.heatVal) + '%; background:rgba(234,88,12,0.45);"></div><div id="dna-heat-needle" class="tc-gauge-needle" style="left:' + Math.round(s.heatVal) + '%;"></div></div>' +
                    '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                        '<span style="font-size:12px; font-weight:800;">Progres Heat Shock: <b id="dna-heat-val-txt">' + Math.round(s.heatVal) + '%</b></span>' +
                        (!s.heatDipping
                            ? '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:9px 22px;" onclick="window.mulaiHeatShockDnaLab()">🔥 Mulai Heat Shock</button>'
                            : '<button type="button" class="mypet-green-cta sm" style="width:auto; padding:9px 24px; background:linear-gradient(180deg,#38bdf8,#0284c7); border-color:#0c4a6e;" onclick="window.hentikanHeatShockDnaLab()">❄️ Dinginkan di Es!</button>') +
                    '</div>' +
                '</div>';
        } else {
            let bio = s.bioreactor;
            let bioOrder = window.urutanAcakStabilLab(s, "dnaBioOrder", [
                { k: "temp",     lbl: "🌡️ Stabilkan Suhu Bioreaktor 37°C" },
                { k: "nutrient", lbl: "🫧 Aktifkan Aerator O2 &amp; Media Nutrisi" },
                { k: "purify",   lbl: "💉 Ekstraksi, Pemurnian, &amp; Kemas Vial" }
            ]);
            let semuaBio = bio.temp && bio.nutrient && bio.purify;
            stageContent =
                '<div class="lab-instruction-banner"><strong>🏭 Tahap 4B: Fermentasi Bioreaktor &amp; Panen Insulin</strong><span>Jalankan prosedur tangki bioreaktor sesuai urutan yang benar!</span></div>' +
                '<div class="tc-growth-card">' + window.bangunSVGBioreaktorInsulin(bio) +
                    '<div class="tc-growth-info"><div class="dna-mini-opts">' +
                        bioOrder.map(function(it) {
                            let done = bio[it.k];
                            return '<button type="button" class="tc-ing-btn' + (done ? ' is-added' : '') + '" ' + (done ? 'disabled' : '') + ' onclick="window.aksiBioreaktorDnaLab(\'' + it.k + '\')"><b>' + (done ? '✅ ' : '') + it.lbl + '</b></button>';
                        }).join('') +
                    '</div>' + (semuaBio ? '<button type="button" class="mypet-green-cta sm" style="margin-top:10px;" onclick="window.lanjutTahapEvaluasiDnaLab()">💉 Lanjut Evaluasi ➔</button>' : '') + '</div>' +
                '</div>';
        }
    } else if (s.step === 5) {
        let letters = ["A", "B", "C", "D"];
        stageContent = '<div class="lab-instruction-banner"><strong>🧠 Tahap 5: Evaluasi Konsep Rekombinasi DNA</strong><span>Jawab pertanyaan bioteknologi modern berikut!</span></div><div class="lab-diag-panel"><div class="lab-diag-block"><label>' + s.quiz.q + '</label><div class="lab-analysis-opts-grid">' +
            s.quiz.opts.map(function(txt, idx) { return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === idx ? ' is-picked' : '') + '" onclick="window.pilihKuisDnaLab(' + idx + ')"><b>' + letters[idx] + '.</b> <span>' + txt + '</span></button>'; }).join('') +
            '</div></div><button type="button" class="mypet-green-cta" onclick="window.selesaikanPraktikumRekombinasiDNA()">💉 Panen Vial Insulin &amp; Lihat Hasil</button></div>';
    } else if (s.step === 6 && s.resultData) {
        let res = s.resultData;
        let starsBig = '', vialsHtml = '';
        for (let i = 1; i <= 3; i++) starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        for (let v = 0; v < res.vials; v++) vialsHtml += '<span class="dna-vial-badge">💉 Vial Insulin #' + (v + 1) + '</span>';
        stageContent = '<div class="lab-result-card"><div class="lab-result-stars-wrap">' + starsBig + '</div><h3 class="lab-result-title">' + res.predikat + '</h3><div class="dna-vials-row">' + vialsHtml + '</div><div class="lab-result-rewards"><span>🪙 <b>+' + res.coin + ' Coin</b></span><span>⭐ <b>+' + res.xp + ' XP</b></span><span>🎯 Skor: <b>' + res.score + '/100</b></span></div><div class="lab-result-explain"><div style="font-size:12px; color:#334155; line-height:1.5;"><b>💡 Fakta Bioteknologi:</b> Gen insulin disisipkan ke plasmid <i>E. coli</i> menggunakan <b>' + enz.nama + '</b> dan <b>DNA Ligase</b>.<br>• <b>Evaluasi:</b> ' + (res.quizOk ? '✅ Benar' : '❌ Kurang Tepat') + ' • <b>Kesalahan:</b> ' + s.mistakes + 'x</div></div><div style="display:flex; gap:8px; width:100%; max-width:440px; margin-top:8px;"><button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumRekombinasiDNA()">🔄 Batch Baru</button><button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button></div></div>';
    }

    bodyEl.innerHTML = '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml + stageContent + '</div>';
};

// -------------------------------------------------------------------------
// OVERRIDE ANTI-DIKTE 3: PEWARNAAN GRAM (ACAK BOTOL & PREPARASI, HAPUS BOCORAN WARNA)
// -------------------------------------------------------------------------
window.renderGramStainStage = function(bodyEl) {
    let s = window.labGramSession;
    if (!s) return;
    let bac = s.bacteria;

    let stepNames = ["1. Preparasi", "2. Pewarnaan Gram", "3. Diagnosis", "4. Hasil"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">🦠 Sampel Bakteri Misteri</span></div>';

    let stageContent = '';

    if (s.step === 1) {
        let p = s.prep;
        let prepOrder = window.urutanAcakStabilLab(s, "gramPrepOrder", [
            { k: "smear", lbl: "🧫 Oleskan Biakan Bakteri" },
            { k: "dry",   lbl: "💨 Keringkan di Udara" },
            { k: "fix",   lbl: "🔥 Fiksasi di Api Bunsen" }
        ]);
        stageContent =
            '<div class="lab-instruction-banner"><strong>🔥 Tahap 1: Persiapan Kaca Objek &amp; Apusan Bakteri</strong><span>Lakukan 3 tahapan persiapan apusan sesuai urutan baku laboratorium!</span></div>' +
            '<div class="tc-laf-bench">' +
                '<div class="tc-laf-visual-row">' +
                    '<div class="tc-laf-item ' + (p.smear ? 'lit' : '') + '"><div class="tc-laf-big-ico">🧫</div><b>Apusan</b><small>' + (p.smear ? 'Siap' : 'Kosong') + '</small></div>' +
                    '<div class="tc-laf-item ' + (p.dry ? 'lit' : '') + '"><div class="tc-laf-big-ico">💨</div><b>Kering Udara</b><small>' + (p.dry ? 'Kering' : 'Basah') + '</small></div>' +
                    '<div class="tc-laf-item ' + (p.fix ? 'lit' : '') + '"><div class="tc-laf-big-ico">🔥</div><b>Fiksasi</b><small>' + (p.fix ? 'Terkunci' : 'Belum') + '</small></div>' +
                '</div>' +
                '<div class="tc-laf-btns">' +
                    prepOrder.map(function(it) {
                        let done = p[it.k];
                        return '<button type="button" class="' + (done ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (done ? 'disabled' : '') + ' onclick="window.aksiPrepGramLab(\'' + it.k + '\')">' + (done ? '✓ ' : '') + it.lbl + '</button>';
                    }).join('') +
                '</div>' +
            '</div>';
    } else if (s.step === 2) {
        let reagents = window.urutanAcakStabilLab(s, "gramBottleOrder", [
            { idx: 0, nama: "Kristal Violet", col: "#7e22ce", bg: "#f3e8ff" },
            { idx: 1, nama: "Larutan Iodin",  col: "#b45309", bg: "#fef3c7" },
            { idx: 2, nama: "Alkohol 96%",    col: "#0284c7", bg: "#e0f2fe" },
            { idx: 3, nama: "Safranin",       col: "#e11d48", bg: "#ffe4e6" }
        ]);
        let slideTint = s.stainStep === 0 ? "#e2e8f0" : (s.stainStep === 1 ? "#a855f7" : (s.stainStep === 2 ? "#6b21a8" : (s.stainStep === 3 ? (bac.gram === "Positif" ? "#7e22ce" : "#e2e8f0") : bac.warnaHex)));
        let alcoholPanel = s.stainStep === 2 && s.alcoholDipping
            ? '<div class="tc-steril-panel" style="margin-top:10px;"><div class="tc-steril-head"><b>💧 Dekolorisasi Alkohol 96% Sedang Berlangsung!</b></div><div class="tc-gauge-track"><div class="tc-gauge-green-zone" style="left:45%; width:32%;"></div><div id="gram-alc-fill" class="tc-gauge-fill" style="width:' + Math.round(s.alcoholVal) + '%;"></div><div id="gram-alc-needle" class="tc-gauge-needle" style="left:' + Math.round(s.alcoholVal) + '%;"></div></div><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:12px; font-weight:800;">Durasi: <b id="gram-alc-txt">' + Math.round(s.alcoholVal) + '%</b></span><button type="button" class="mypet-green-cta sm" style="width:auto; padding:8px 20px;" onclick="window.stopBilasAlkoholGram()">🚿 Bilas Air Sekarang!</button></div></div>'
            : '';

        stageContent =
            '<div class="lab-instruction-banner"><strong>🎨 Tahap 2: Pewarnaan Gram (' + s.stainStep + '/4 Selesai)</strong><span>Pilih 4 botol reagen di bawah ini sesuai urutan pewarnaan Gram yang benar!</span></div>' +
            '<div class="lab-prep-bench" style="margin-bottom:10px;"><div class="lab-prep-glass"><div style="width:96px; height:48px; border-radius:24px; background:' + slideTint + '; border:2px solid #94a3b8; transition:background 0.3s;"></div></div></div>' +
            '<div class="lab-bottles-row">' +
                reagents.map(function(r) {
                    let done = r.idx < s.stainStep;
                    return '<button type="button" class="lab-reagent-bottle' + (done ? ' is-done' : '') + '" style="border-color:' + r.col + ';" ' + (done ? 'disabled' : '') + ' onclick="window.klikReagenGramLab(' + r.idx + ')">' +
                        '<div class="bottle-cap" style="background:' + r.col + ';"></div>' +
                        '<div class="bottle-body" style="background:' + r.bg + '; color:' + r.col + ';"><b>' + r.nama + '</b><small>' + (done ? '✓ Terpakai' : 'Teteskan') + '</small></div>' +
                    '</button>';
                }).join('') +
            '</div>' + alcoholPanel;
    } else if (s.step === 3) {
        let letters = ["A", "B", "C", "D"];
        stageContent =
            '<div class="lab-instruction-banner"><strong>🔬 Tahap 3: Amati Hasil di Mikroskop &amp; Tegakkan Identifikasi</strong><span>Tentukan klasifikasi Gram serta morfologi sel bakteri dari tampilan lensa!</span></div>' +
            '<div class="lab-osm-split">' +
                '<div class="lab-lens-panel">' + window.bangunSVGBakteriGram(bac) + '</div>' +
                '<div class="lab-diag-panel">' +
                    '<div class="lab-diag-block"><label>1. Klasifikasi Pewarnaan Gram:</label><div class="mic-pill-row">' +
                        '<button type="button" class="mic-opt-pill' + (s.pickedGram === "Positif" ? ' is-picked' : '') + '" onclick="window.pilihDiagGramLab(\'gram\', \'Positif\')">Gram Positif</button>' +
                        '<button type="button" class="mic-opt-pill' + (s.pickedGram === "Negatif" ? ' is-picked' : '') + '" onclick="window.pilihDiagGramLab(\'gram\', \'Negatif\')">Gram Negatif</button>' +
                    '</div></div>' +
                    '<div class="lab-diag-block"><label>2. Bentuk Morfologi Sel:</label><div class="mic-pill-row">' +
                        ["Kokus", "Basil", "Koma"].map(function(sh) { return '<button type="button" class="mic-opt-pill' + (s.pickedShape === sh ? ' is-picked' : '') + '" onclick="window.pilihDiagGramLab(\'shape\', \'' + sh + '\')">' + sh + '</button>'; }).join('') +
                    '</div></div>' +
                    '<div class="lab-diag-block"><label>3. ' + s.quiz.q + '</label><div class="lab-analysis-opts-grid">' +
                        s.quiz.opts.map(function(txt, i) { return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === i ? ' is-picked' : '') + '" onclick="window.pilihDiagGramLab(\'quiz\', ' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>'; }).join('') +
                    '</div></div>' +
                    '<button type="button" class="mypet-green-cta" onclick="window.selesaikanPewarnaanGramLab()">📋 Serahkan Identifikasi</button>' +
                '</div>' +
            '</div>';
    } else if (s.step === 4 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        let claimBox = !s.rewardClaimed
            ? '<div class="tc-claim-choice-box"><div style="font-size:12px; font-weight:800; color:#0f766e; margin-bottom:8px;">🎁 Pilih Hadiah:</div><div class="tc-claim-btns-row"><button type="button" class="mypet-amber-cta sm" onclick="window.klaimHadiahGramLab(\'coin\')">💰 +🪙 ' + res.coin + ' Coin &amp; +' + res.xp + ' XP</button><button type="button" class="mypet-green-cta sm" onclick="window.klaimHadiahGramLab(\'farm_med\')">💊 +1 Obat Ternak My Farm (+' + res.xp + ' XP)</button></div></div>'
            : '<div class="garden-quiz-feedback ok" style="width:100%; box-sizing:border-box;">' + s.claimedNote + '</div><div style="display:flex; gap:8px; width:100%; max-width:440px; margin-top:6px;"><button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumPewarnaanGram()">🔄 Uji Bakteri Baru</button><button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button></div>';
        stageContent = '<div class="lab-result-card"><div class="lab-result-stars-wrap">' + starsBig + '</div><h3 class="lab-result-title">' + res.predikat + '</h3><div class="lab-result-rewards"><span>🦠 <i><b>' + bac.nama + '</b></i></span><span>🎯 Skor: <b>' + res.score + '/100</b></span></div><div class="lab-result-explain"><div style="font-size:12px; color:#334155; line-height:1.5;"><b>🔬 Hasil Resmi:</b> <i>' + bac.nama + '</i> — <b>Gram ' + bac.gram + '</b> • <b>' + bac.bentuk + '</b>.<br>• ' + bac.fakta + '</div></div>' + claimBox + '</div>';
    }

    bodyEl.innerHTML = '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml + stageContent + '</div>';
};

window.klikReagenGramLab = function(idx) {
    let s = window.labGramSession;
    if (!s || s.step !== 2) return;
    if (idx !== s.stainStep) {
        s.mistakes++;
        return window.tampilkanToastLab("⚠️ Urutan reagen pewarnaan Gram keliru! Buka ❓ Panduan untuk mengingat 4 tahap berurutannya.", "err");
    }
    if (idx === 2) { window.mulaiBilasAlkoholGram(); return; }
    s.stainStep++;
    window.renderMyLabUI();
    if (s.stainStep >= 4) {
        window.tampilkanToastLab("🔬 Pewarnaan selesai! Memasang kaca objek ke mikroskop...", "ok");
        setTimeout(function() {
            if (window.labGramSession && window.labGramSession.step === 2) {
                window.labGramSession.step = 3;
                window.renderMyLabUI();
            }
        }, 750);
    }
};

// -------------------------------------------------------------------------
// OVERRIDE ANTI-DIKTE 4: SINTESIS PROTEIN (TABEL KODON HANYA DI MODAL ?)
// -------------------------------------------------------------------------
window.renderProteinSynthStage = function(bodyEl) {
    let s = window.labProteinSession;
    if (!s) return;
    let g = s.gene;
    let sel = window._psSelectedChip || { kind: "", value: "" };

    let stepNames = ["1. Transkripsi", "2. Translasi", "3. Evaluasi", "4. Hasil"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">🧬 ' + g.nama + '</span></div>';

    let stageContent = '';

    if (s.step === 1) {
        let dnaCells = '', rnaCells = '';
        for (let i = 0; i < 12; i++) {
            let dCh = g.dnaTemplate.charAt(i);
            let rCh = s.mrnaSlots[i];
            let sep = (i > 0 && i % 3 === 0) ? '<span class="ps-triplet-sep">|</span>' : '';
            let dCol = dCh === "A" ? "base-a" : (dCh === "T" ? "base-t" : (dCh === "G" ? "base-g" : "base-c"));
            let rCol = rCh === "A" ? "base-a" : (rCh === "U" ? "base-u" : (rCh === "G" ? "base-g" : (rCh === "C" ? "base-c" : "")));
            dnaCells += sep + '<span class="dna-base-chip ps-base-lg ' + dCol + '">' + dCh + '</span>';
            rnaCells += sep + '<div class="gen-drop-slot ps-mrna-slot ' + (rCh ? ('is-filled ' + rCol) : '') + '" data-ps-kind="mrna" data-ps-idx="' + i + '" onclick="window.klikSlotProteinLab(\'mrna\', ' + i + ')">' + (rCh || '?') + '</div>';
        }
        let baseChips = ["A", "U", "G", "C", "T"].map(function(b) {
            return '<div class="gen-dnd-chip' + (sel.kind === "mrna" && sel.value === b ? ' is-chip-active' : '') + '" onpointerdown="window.mulaiDragChipProteinLab(event, \'mrna\', \'' + b + '\')" onclick="window.klikChipProteinLab(\'mrna\', \'' + b + '\')">' + b + '</div>';
        }).join('');

        stageContent =
            '<div class="lab-instruction-banner"><strong>🧬 Tahap 1: Transkripsi di Nukleus</strong><span>Susun 12 basa nitrogen mRNA komplementer dari pita DNA template di bawah ini.</span></div>' +
            '<div class="ps-workbench-card">' +
                '<div class="ps-strand-line"><span class="ps-strand-tag">DNA 3\'</span><div class="ps-bases-strip">' + dnaCells + '</div><span class="ps-strand-tag">5\'</span></div>' +
                '<div class="ps-strand-line"><span class="ps-strand-tag is-rna">mRNA 5\'</span><div class="ps-bases-strip">' + rnaCells + '</div><span class="ps-strand-tag is-rna">3\'</span></div>' +
                '<div class="gen-tray-bar"><span class="gen-tray-lbl">🎯 Basa Nitrogen:</span><div class="gen-chips-list">' + baseChips + '</div><button type="button" class="mypet-amber-cta sm" style="width:auto; padding:6px 12px;" onclick="window.resetSlotProteinLab(\'mrna\')">🧹 Reset</button><button type="button" class="mypet-green-cta sm" style="width:auto; padding:6px 16px;" onclick="window.verifikasiTranskripsiLab()">✅ Kunci mRNA ➔</button></div>' +
            '</div>';
    } else if (s.step === 2) {
        let codons = [g.mrnaTarget.slice(0, 3), g.mrnaTarget.slice(3, 6), g.mrnaTarget.slice(6, 9), g.mrnaTarget.slice(9, 12)];
        let slotsHtml = codons.map(function(kod, i) {
            let val = s.aaSlots[i];
            return '<div class="ps-ribosome-col"><div class="ps-codon-pill">' + kod + '</div><div class="ps-arrow-down">⬇</div><div class="gen-drop-slot ps-aa-slot' + (val ? ' is-filled' : '') + '" data-ps-kind="aa" data-ps-idx="' + i + '" onclick="window.klikSlotProteinLab(\'aa\', ' + i + ')">' + (val || 'Drop AA') + '</div></div>';
        }).join('');
        let aaChips = window.MY_LAB_CODON_REF.map(function(c) {
            return '<div class="gen-dnd-chip is-geno' + (sel.kind === "aa" && sel.value === c.aa ? ' is-chip-active' : '') + '" onpointerdown="window.mulaiDragChipProteinLab(event, \'aa\', \'' + c.aa + '\')" onclick="window.klikChipProteinLab(\'aa\', \'' + c.aa + '\')">' + c.aa + '</div>';
        }).join('');

        stageContent =
            '<div class="lab-instruction-banner"><strong>⚙️ Tahap 2: Translasi di Ribosom</strong><span>Terjemahkan 4 kodon mRNA menjadi rantai polipeptida! Buka <b>❓ Panduan</b> untuk melihat Tabel Kodon, ingat pasangan asam aminonya, lalu tutup &amp; pasangkan!</span></div>' +
            '<div class="ps-workbench-card">' +
                '<div class="ps-ribosome-row">' + slotsHtml + '</div>' +
                '<div class="gen-tray-bar"><span class="gen-tray-lbl">🧩 tRNA / Asam Amino:</span><div class="gen-chips-list">' + aaChips + '</div><button type="button" class="mypet-green-cta sm" style="width:auto; padding:6px 16px;" onclick="window.verifikasiTranslasiLab()">✅ Periksa Polipeptida ➔</button></div>' +
            '</div>';
    } else if (s.step === 3) {
        let letters = ["A", "B", "C", "D"];
        stageContent = '<div class="lab-instruction-banner"><strong>🧠 Tahap 3: Evaluasi Konsep Sintesis Protein</strong><span>Polipeptida terbentuk: <b>' + g.aaTarget.join(" — ") + '</b>.</span></div><div class="lab-diag-panel"><div class="lab-diag-block"><label>' + s.quiz.q + '</label><div class="lab-analysis-opts-grid">' +
            s.quiz.opts.map(function(txt, i) { return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === i ? ' is-picked' : '') + '" onclick="window.pilihKuisProteinLab(' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>'; }).join('') +
            '</div></div><button type="button" class="mypet-green-cta" onclick="window.selesaikanSintesisProteinLab()">📋 Serahkan Laporan</button></div>';
    } else if (s.step === 4 && s.resultData) {
        let res = s.resultData;
        let starsBig = '';
        for (let i = 1; i <= 3; i++) starsBig += '<span class="lab-result-star ' + (i <= res.stars ? 'lit' : '') + '">★</span>';
        stageContent = '<div class="lab-result-card"><div class="lab-result-stars-wrap">' + starsBig + '</div><h3 class="lab-result-title">' + res.predikat + '</h3><div class="lab-result-rewards"><span>🪙 <b>+' + res.coin + ' Coin</b></span><span>⭐ <b>+' + res.xp + ' XP</b></span><span>🎯 Skor: <b>' + res.score + '/100</b></span></div><div class="lab-result-explain"><div style="font-size:12px; color:#334155; line-height:1.5;"><b>🧬 Polipeptida ' + g.nama + ':</b> ' + g.aaTarget.join(" — ") + '<br>• <b>mRNA:</b> 5\'-' + g.mrnaTarget + '-3\' • <b>Kesalahan:</b> ' + s.mistakes + 'x</div></div><div style="display:flex; gap:8px; width:100%; max-width:440px; margin-top:6px;"><button type="button" class="mypet-green-cta sm" onclick="window.mulaiPraktikumSintesisProtein()">🔄 Gen Lain</button><button type="button" class="mypet-amber-cta sm" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button></div></div>';
    }

    bodyEl.innerHTML = '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml + stageContent + '</div>';
};

// -------------------------------------------------------------------------
// OVERRIDE ANTI-DIKTE 5: UJI MAKANAN (CEK PEMANASAN & HAPUS BOCORAN WARNA DI DIAGNOSIS)
// -------------------------------------------------------------------------
window.aksiPanaskanTabungMakanan = function(tubeKey) {
    let s = window.labFoodSession;
    if (!s || s.step !== 2) return;
    if (tubeKey === "benedict") {
        if (!s.tests.benedictDrop) return window.tampilkanToastLab("⚠️ Teteskan reagen Benedict terlebih dahulu!", "err");
        s.tests.benedictHeat = true;
        window.renderMyLabUI();
        window.tampilkanToastLab("🔥 Tabung Benedict dipanaskan! Amati warna akhirnya.", "ok");
    } else {
        s.mistakes++;
        window.tampilkanToastLab("⚠️ Uji ini tidak memerlukan pemanasan api Bunsen! Cek ❓ Panduan untuk perlakuan tiap reagen.", "err");
    }
};

window.kembaliLihatTabungMakanan = function() {
    if (!window.labFoodSession) return;
    window.labFoodSession.step = 2;
    window.renderMyLabUI();
};

const _origRenderFoodTest = window.renderFoodTestStage;
window.renderFoodTestStage = function(bodyEl) {
    let s = window.labFoodSession;
    if (!s) return;
    if (s.step === 2) {
        let sp = s.sample, t = s.tests;
        let colLugol = !t.lugol ? "#f1f5f9" : (sp.amilum ? "#1e1b4b" : "#b45309");
        let colBiuret = !t.biuret ? "#f1f5f9" : (sp.protein ? "#7e22ce" : "#38bdf8");
        let colBen = !t.benedictDrop ? "#f1f5f9" : (!t.benedictHeat ? "#0ea5e9" : (sp.glukosa ? "#c2410c" : "#0284c7"));
        let semuaSelesai = t.lugol && t.biuret && t.benedictDrop && t.paper;

        let stepperHtml = '<div class="lab-stepper-bar"><span class="lab-step-pill done">✓ 1. Ekstrak</span><span class="lab-step-pill active">2. Uji 4 Reagen</span><span class="lab-step-pill">3. Diagnosis</span><span class="lab-step-pill">4. Hasil</span><span class="lab-patient-tag">' + sp.ikon + ' ' + sp.nama + '</span></div>';

        bodyEl.innerHTML =
            '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml +
            '<div class="lab-instruction-banner"><strong>🧪 Tahap 2: Uji 4 Reagen &amp; Perlakuan Panas</strong><span>Teteskan seluruh reagen, lakukan pemanasan HANYA pada tabung yang memerlukannya, lalu ingat perubahan warna yang muncul!</span></div>' +
            '<div class="food-tubes-grid">' +
                '<div class="food-test-card"><div class="food-tube-title">Lugol</div><div class="food-tube-glass"><div class="food-tube-liquid" style="background:' + colLugol + ';"></div></div>' +
                    '<button type="button" class="' + (t.lugol ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (t.lugol ? 'disabled' : '') + ' onclick="window.aksiUjiReagenMakanan(\'lugol\')">' + (t.lugol ? '✓ Ditetesi' : '💧 Tetes Lugol') + '</button>' +
                    (t.lugol ? '<button type="button" class="lab-step-btn" style="width:100%;" onclick="window.aksiPanaskanTabungMakanan(\'lugol\')">🔥 Panaskan?</button>' : '') +
                '</div>' +
                '<div class="food-test-card"><div class="food-tube-title">Biuret</div><div class="food-tube-glass"><div class="food-tube-liquid" style="background:' + colBiuret + ';"></div></div>' +
                    '<button type="button" class="' + (t.biuret ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (t.biuret ? 'disabled' : '') + ' onclick="window.aksiUjiReagenMakanan(\'biuret\')">' + (t.biuret ? '✓ Ditetesi' : '💧 Tetes Biuret') + '</button>' +
                    (t.biuret ? '<button type="button" class="lab-step-btn" style="width:100%;" onclick="window.aksiPanaskanTabungMakanan(\'biuret\')">🔥 Panaskan?</button>' : '') +
                '</div>' +
                '<div class="food-test-card"><div class="food-tube-title">Benedict</div><div class="food-tube-glass"><div class="food-tube-liquid" style="background:' + colBen + ';"></div>' + (t.benedictHeat ? '<span class="food-flame-mark">🔥</span>' : '') + '</div>' +
                    '<button type="button" class="' + (t.benedictDrop ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (t.benedictDrop ? 'disabled' : '') + ' onclick="window.aksiUjiReagenMakanan(\'benedictDrop\')">' + (t.benedictDrop ? '✓ Ditetesi' : '💧 Tetes Benedict') + '</button>' +
                    (t.benedictDrop && !t.benedictHeat ? '<button type="button" class="lab-step-btn" style="width:100%;" onclick="window.aksiPanaskanTabungMakanan(\'benedict\')">🔥 Panaskan?</button>' : '') +
                '</div>' +
                '<div class="food-test-card"><div class="food-tube-title">Kertas Buram</div><div class="food-paper-box' + (t.paper && sp.lemak ? ' is-greasy' : '') + '">' + (t.paper ? (sp.lemak ? '✨ Tembus Cahaya' : '📄 Kering') : '📄 Kosong') + '</div>' +
                    '<button type="button" class="' + (t.paper ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" ' + (t.paper ? 'disabled' : '') + ' onclick="window.aksiUjiReagenMakanan(\'paper\')">' + (t.paper ? '✓ Diusap' : '🖌️ Usap Ekstrak') + '</button>' +
                '</div>' +
            '</div>' +
            (semuaSelesai ? '<button type="button" class="mypet-green-cta" style="margin-top:10px;" onclick="window.lanjutDiagnosisMakanan()">📋 Lanjut Diagnosis Kandungan Gizi ➔</button>' : '') +
            '</div>';
        return;
    }
    if (s.step === 3) {
        let sp = s.sample;
        let letters = ["A", "B", "C", "D"];
        let chips = [
            { k: "amilum",  lbl: "🍞 Amilum (Pati)" },
            { k: "protein", lbl: "🥩 Protein" },
            { k: "glukosa", lbl: "🍯 Glukosa" },
            { k: "lemak",   lbl: "🧈 Lemak / Lipid" }
        ];
        let stepperHtml = '<div class="lab-stepper-bar"><span class="lab-step-pill done">✓ 1. Ekstrak</span><span class="lab-step-pill done">✓ 2. Uji Reagen</span><span class="lab-step-pill active">3. Diagnosis</span><span class="lab-step-pill">4. Hasil</span><span class="lab-patient-tag">' + sp.ikon + ' ' + sp.nama + '</span></div>';

        bodyEl.innerHTML =
            '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml +
            '<div class="lab-instruction-banner"><strong>📋 Tahap 3: Diagnosis Kandungan Gizi ' + sp.nama + '</strong><span>Centang HANYA zat gizi yang terbukti positif berdasarkan perubahan warna tabungmu!</span></div>' +
            '<div class="lab-diag-panel">' +
                '<div class="lab-diag-block"><label>1. Zat gizi yang POSITIF terkandung dalam ' + sp.nama + ':</label><div class="lab-analysis-opts-grid">' +
                    chips.map(function(c) {
                        let on = s.guess[c.k];
                        return '<button type="button" class="lab-analysis-opt' + (on ? ' is-picked' : '') + '" onclick="window.toggleDiagnosisMakanan(\'' + c.k + '\')"><span>' + (on ? '☑️' : '⬜') + '</span><b>' + c.lbl + '</b></button>';
                    }).join('') +
                '</div></div>' +
                '<div class="lab-diag-block"><label>2. ' + s.quiz.q + '</label><div class="lab-analysis-opts-grid">' +
                    s.quiz.opts.map(function(txt, i) { return '<button type="button" class="lab-analysis-opt' + (s.pickedQuizIdx === i ? ' is-picked' : '') + '" onclick="window.pilihKuisMakananLab(' + i + ')"><b>' + letters[i] + '.</b> <span>' + txt + '</span></button>'; }).join('') +
                '</div></div>' +
                '<div style="display:flex; gap:8px; flex-wrap:wrap;"><button type="button" class="mypet-amber-cta sm" style="width:auto; padding:8px 14px;" onclick="window.kembaliLihatTabungMakanan()">◀ Cek Tabung Lagi</button><button type="button" class="mypet-green-cta" style="flex:1;" onclick="window.selesaikanUjiMakananLab()">📋 Serahkan Laporan</button></div>' +
            '</div></div>';
        return;
    }
    _origRenderFoodTest(bodyEl);
};

// -------------------------------------------------------------------------
// OVERRIDE ANTI-DIKTE 6: FERMENTASI (HAPUS BOCORAN SUHU & ACAK MIKROBA)
// -------------------------------------------------------------------------
const _origRenderFerm = window.renderFermentationStage;
window.renderFermentationStage = function(bodyEl) {
    let st = window.labFermSession || { setupSlot: -1, boostSlot: -1 };
    if (st.setupSlot >= 0) {
        let rec = window.MY_LAB_FERM_RECIPES.find(function(r) { return r.id === st.recipeId; }) || window.MY_LAB_FERM_RECIPES[0];
        let recBtns = window.MY_LAB_FERM_RECIPES.map(function(r) {
            return '<button type="button" class="lab-spec-btn' + (r.id === rec.id ? ' is-selected' : '') + '" style="padding:7px 9px;" onclick="window.pilihResepFermentasiLab(\'' + r.id + '\')"><span class="spec-ico" style="font-size:22px;">' + r.ikon + '</span><div style="text-align:left;"><b>' + r.nama + '</b><small>⏳ ' + r.durasiLabel + ' • 🪙 ' + r.coin + '</small></div></button>';
        }).join('');

        let mikOrder = window.urutanAcakStabilLab(st, "fermMikOrder", window.MY_LAB_FERM_RECIPES.slice());
        let mikBtns = mikOrder.map(function(r) {
            return '<button type="button" class="lab-analysis-opt' + (st.microbeOk && r.id === rec.id ? ' is-picked' : '') + '" ' + (st.microbeOk ? 'disabled' : '') + ' onclick="window.pilihMikrobaFermLab(\'' + r.id + '\')"><span>🦠</span><b><i>' + r.mikroba + '</i></b></button>';
        }).join('');

        let siapStart = st.prepped && st.microbeOk;
        bodyEl.innerHTML =
            '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            '<div class="lab-instruction-banner"><strong>🫙 Siapkan Inkubator #' + (st.setupSlot + 1) + ' — ' + rec.ikon + ' ' + rec.nama + '</strong><span>Siapkan substrat, pilih mikroba yang tepat, lalu atur suhu inkubator optimumnya!</span></div>' +
            '<div class="tc-plants-grid" style="margin-bottom:10px;">' + recBtns + '</div>' +
            '<div class="lab-diag-panel">' +
                '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;"><span style="font-size:12px; font-weight:800; color:#0b3954;">Substrat (' + rec.substrat + '):</span><button type="button" class="' + (st.prepped ? 'mypet-gray-cta sm' : 'mypet-amber-cta sm') + '" style="width:auto; padding:6px 14px;" ' + (st.prepped ? 'disabled' : '') + ' onclick="window.aksiPrepSubstratFerm()">' + (st.prepped ? '✅ Substrat Steril' : '🔥 Pasteurisasi / Kukus Substrat') + '</button></div>' +
                '<div class="lab-diag-block"><label>Pilih Mikroorganisme Inokulasi:</label><div class="lab-analysis-opts-grid">' + mikBtns + '</div></div>' +
                '<div class="lab-knob-group"><div class="lab-knob-head"><span>🌡️ Atur Suhu Inkubator</span><b>' + st.tempVal + '°C</b></div><div class="lab-slider-row"><button type="button" class="lab-step-btn" onclick="window.ubahSuhuFermLab(-1)">−1</button><input type="range" min="20" max="55" value="' + st.tempVal + '" oninput="window.aturSuhuFermLab(this.value)"><button type="button" class="lab-step-btn" onclick="window.ubahSuhuFermLab(1)">+1</button></div></div>' +
                '<div style="display:flex; gap:8px;"><button type="button" class="mypet-gray-cta sm" style="width:auto; padding:8px 14px;" onclick="window.batalSetupFermentasiLab()">◀ Batal</button><button type="button" class="' + (siapStart ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" ' + (siapStart ? '' : 'disabled') + ' onclick="window.mulaiInkubasiRealTimeFerm()">🚀 Mulai Fermentasi (' + rec.durasiLabel + ')</button></div>' +
            '</div></div>';
        return;
    }
    _origRenderFerm(bodyEl);
};

const _origMulaiInkubasiFerm = window.mulaiInkubasiRealTimeFerm;
window.mulaiInkubasiRealTimeFerm = function() {
    let st = window.labFermSession;
    if (!st || st.setupSlot < 0) return;
    let rec = window.MY_LAB_FERM_RECIPES.find(function(r) { return r.id === st.recipeId; });
    if (rec && (st.tempVal < rec.suhuMin || st.tempVal > rec.suhuMax)) {
        return window.tampilkanToastLab("⚠️ Suhu " + st.tempVal + "°C tidak berada di kisaran optimum untuk " + rec.nama + "! Buka ❓ Panduan untuk mengecek suhu fermentasi.", "err");
    }
    if (typeof _origMulaiInkubasiFerm === "function") _origMulaiInkubasiFerm();
};

// -------------------------------------------------------------------------
// OVERRIDE ANTI-DIKTE 7: MIKROSKOP (UMPAN BALIK OBSERVASIONAL TANPA BOCORAN ANGKA)
// -------------------------------------------------------------------------
const _origEvalOptikMic = window.evaluasiOptikMikroskop;
window.evaluasiOptikMikroskop = function(s) {
    let res = _origEvalOptikMic(s);
    if (!res.scopeOk) {
        res.hintText = "⚠️ Struktur preparat tidak teramati semestinya dengan mikroskop ini. Evaluasi kembali jenis mikroskop yang cocok (cek ❓ Panduan).";
    } else if (!res.magOk) {
        res.hintText = "🔍 Bidang pandang belum proporsional (" + res.totalMag.toLocaleString("id-ID") + "×). Sesuaikan kombinasi Lensa Okuler & Objektif.";
    } else if (!res.lightOk) {
        res.hintText = "💡 Kontras cahaya " + res.lightStatus.toLowerCase() + ". Sesuaikan kembali intensitas cahaya.";
    } else if (!res.focusOk) {
        res.hintText = "🎯 Bayangan masih buram. Putar Makrometer & Mikrometer hingga tajam.";
    } else {
        res.hintText = "✨ Parameter optik optimal! Ambil foto pengamatan sekarang.";
    }
    return res;
};

// -------------------------------------------------------------------------
// OVERRIDE ANTI-DIKTE 8: HEMATOPOESIS (HAPUS TAG JALUR & SINYAL BOCORAN)
// -------------------------------------------------------------------------
const _origRenderHemato = window.renderHematopoiesisStage;
window.renderHematopoiesisStage = function(bodyEl) {
    let s = window.labHematoSession;
    if (!s) return;
    if (s.step === 1) {
        let curCell = s.queue[s.qIdx];
        let mieloidList = window.MY_LAB_HEMATO_CELLS.filter(function(c) { return c.jalur === "mieloid"; });
        let limfoidList = window.MY_LAB_HEMATO_CELLS.filter(function(c) { return c.jalur === "limfoid"; });
        let renderB = function(list) {
            return list.map(function(c) {
                let isRec = s.recruited.indexOf(c.id) !== -1;
                return '<span class="hem-cell-chip' + (isRec ? ' is-recruited' : '') + '">' + (isRec ? (c.ikon + ' ' + c.nama) : '🔒 ???') + '</span>';
            }).join('');
        };
        let stepperHtml = '<div class="lab-stepper-bar"><span class="lab-step-pill active">1. Rekrut 9 Sel</span><span class="lab-step-pill">2. Misi Imun</span><span class="lab-step-pill">3. Evaluasi</span><span class="lab-step-pill">4. Hasil</span><span class="lab-patient-tag">🦴 ' + s.recruited.length + '/9 Sel</span></div>';
        bodyEl.innerHTML =
            '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml +
            '<div class="lab-instruction-banner"><strong>🦴 Tahap 1: Diferensiasi Sel Punca HSC (' + s.recruited.length + '/9)</strong><span>Kelompokkan setiap sel ke jalur progenitor yang benar (Mieloid atau Limfoid)!</span></div>' +
            '<div class="hem-tree-box"><div class="hem-hsc-node">🦴 <b>Sel Punca Hematopoietik (HSC)</b></div><div class="hem-branches-grid">' +
                '<div class="hem-branch-card mieloid"><div class="hem-branch-head">🩸 Progenitor MIELOID</div><div class="hem-chips-wrap">' + renderB(mieloidList) + '</div></div>' +
                '<div class="hem-branch-card limfoid"><div class="hem-branch-head">🛡️ Progenitor LIMFOID</div><div class="hem-chips-wrap">' + renderB(limfoidList) + '</div></div>' +
            '</div></div>' +
            (curCell
                ? '<div class="hem-recruit-card"><div class="hem-recruit-ico">' + curCell.ikon + '</div><div style="flex:1; min-width:200px;"><div style="font-size:15.5px; font-weight:900; color:#0b3954; margin-bottom:8px;">' + curCell.nama + '</div><div style="display:flex; gap:8px; flex-wrap:wrap;"><button type="button" class="mypet-amber-cta sm" style="flex:1;" onclick="window.rekrutSelHematopoesis(\'mieloid\')">🩸 Jalur MIELOID</button><button type="button" class="mypet-green-cta sm" style="flex:1; background:linear-gradient(180deg,#38bdf8,#0284c7); border-color:#0c4a6e;" onclick="window.rekrutSelHematopoesis(\'limfoid\')">🛡️ Jalur LIMFOID</button></div></div></div>'
                : '') +
            '</div>';
        return;
    }
    if (s.step === 2) {
        let curMisi = s.missions[s.mIdx];
        let stepperHtml = '<div class="lab-stepper-bar"><span class="lab-step-pill done">✓ 1. Rekrut 9 Sel</span><span class="lab-step-pill active">2. Misi Imun</span><span class="lab-step-pill">3. Evaluasi</span><span class="lab-step-pill">4. Hasil</span><span class="lab-patient-tag">🚨 Kasus ' + (s.mIdx + 1) + '/' + s.missions.length + '</span></div>';
        bodyEl.innerHTML =
            '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml +
            '<div class="lab-instruction-banner"><strong>🚨 Tahap 2: Misi Tanggap Darurat Tubuh (' + (s.mIdx + 1) + '/' + s.missions.length + ')</strong><span>Kerahkan 1 sel spesialis yang paling tepat untuk menangani kasus klinis di bawah!</span></div>' +
            '<div class="hem-mission-alert">🚨 <b>KASUS ' + (s.mIdx + 1) + ':</b> ' + curMisi.kasus + '</div>' +
            '<div class="hem-roster-grid">' +
                window.MY_LAB_HEMATO_CELLS.map(function(c) {
                    return '<button type="button" class="hem-deploy-btn" onclick="window.kirimPasukanSelImun(\'' + c.id + '\')"><span class="hem-dep-ico">' + c.ikon + '</span><b>' + c.nama + '</b></button>';
                }).join('') +
            '</div></div>';
        return;
    }
    _origRenderHemato(bodyEl);
};

// -------------------------------------------------------------------------
// HOOK GLOBAL: SUNTIK TOMBOL (?) KE SETIAP BANNER + BERSIHKAN TEKS BOCORAN TERSISA
// -------------------------------------------------------------------------
(function pasangHookGlobalPanduanDanAntiDikte() {
    if (typeof window.renderMyLabUI === "function" && !window.renderMyLabUI._guideHookedV2) {
        let origRender = window.renderMyLabUI;
        window.renderMyLabUI = function() {
            origRender.apply(this, arguments);
            if (!window.activeLabView || window.activeLabView === "lobby") return;

            let root = document.getElementById("mylab-main-body");
            if (!root) return;

            // 1. Bersihkan bocoran minor di modul Genetika (nomor urut tombol penyerbukan, label resiprok, & alasan testcross)
            if (window.activeLabView === "genetics_lab") {
                root.querySelectorAll(".lab-spec-btn small").forEach(function(sm) {
                    if (/Hasil Resiprok/i.test(sm.textContent)) sm.textContent = "Uji pembalikan kelamin ♂×♀ vs ♀×♂";
                });
                root.querySelectorAll(".tc-laf-btns button").forEach(function(b) {
                    b.innerHTML = b.innerHTML.replace(/^[12]\.\s*/, "");
                });
                root.querySelectorAll(".lab-analysis-opt span").forEach(function(sp) {
                    if (sp.innerHTML.indexOf("— karena") !== -1) {
                        sp.innerHTML = sp.innerHTML.split("— karena")[0].trim();
                    }
                });
            }

            // 2. Ringkas banner Transpor Membran agar tidak langsung mendikte definisi isotonis
            if (window.activeLabView === "membrane_transport" && window.labMembraneSession && window.labMembraneSession.step === 3) {
                let spBan = root.querySelector(".lab-instruction-banner span");
                if (spBan) spBan.textContent = "Uji berbagai konsentrasi larutan pada preparat untuk menginvestigasi konsentrasi zat terlarut internal sel misteri.";
            }

            // 3. Pasang tombol ❓ Panduan kontekstual di sebelah kanan setiap .lab-instruction-banner
            let banner = root.querySelector(".lab-instruction-banner");
            if (banner && !banner.querySelector(".lab-banner-help-btn")) {
                banner.classList.add("has-help-btn");
                let textWrap = document.createElement("div");
                textWrap.className = "lab-banner-text-col";
                while (banner.firstChild) textWrap.appendChild(banner.firstChild);
                banner.appendChild(textWrap);

                let btn = document.createElement("button");
                btn.type = "button";
                btn.className = "lab-banner-help-btn";
                btn.title = "Buka Panduan & Referensi (Menutupi Layar Sementara)";
                btn.innerHTML = "❓ <span>Panduan</span>";
                btn.onclick = function() { window.bukaPanduanLab(); };
                banner.appendChild(btn);
            }
        };
        window.renderMyLabUI._guideHookedV2 = true;
    }

    // Pastikan modal panduan ikut tertutup saat modal My Lab ditutup
    if (typeof window.tutupModalMyLab === "function" && !window.tutupModalMyLab._guideClosedHook) {
        let origClose = window.tutupModalMyLab;
        window.tutupModalMyLab = function() {
            window.tutupPanduanLab();
            origClose.apply(this, arguments);
        };
        window.tutupModalMyLab._guideClosedHook = true;
    }
})();
// =========================================================================
// 16. MESIN PRAKTIKUM NYATA: BRIEFING PROSEDUR, PILIH ALAT-BAHAN,
//     SISTEM 5 NYAWA, ROLLBACK BERANTAI, & KEGAGALAN FATAL (11 MODUL)
// =========================================================================
window.labFlowState = {
    active: false,
    expId: "",
    phase: "idle", // 'idle' | 'briefing' | 'setup_tools' | 'running' | 'failed'
    lives: 5,
    maxLives: 5,
    pickedTools: [],
    rackItems: [],
    failReason: "",
    failType: ""
};
window._labSkipNextToastLife = false;

window.MY_LAB_PROTOCOL_DB = {
    blood_test: {
        judul: "🩸 Panduan Praktikum: Tes Golongan Darah (ABO & Rhesus)",
        tujuan: "Menentukan golongan darah sistem ABO dan Rhesus pasien secara aseptis melalui pengamatan reaksi aglutinasi.",
        requiredTools: [
            { id: "bt_slide",  ikon: "🧫", nama: "Kaca Objek 4 Sumur" },
            { id: "bt_blood",  ikon: "💉", nama: "Pipet Sampel Darah" },
            { id: "bt_serum",  ikon: "🧪", nama: "Serum Anti-A, B, AB, D" },
            { id: "bt_stick",  ikon: "🥢", nama: "Tusuk Gigi Steril" }
        ],
        decoyTools: [
            { id: "dc_lugol",  ikon: "💧", nama: "Reagen Lugol" },
            { id: "dc_bunsen", ikon: "🔥", nama: "Api Bunsen" },
            { id: "dc_mortar", ikon: "🥣", nama: "Lumpang & Alu" },
            { id: "dc_ligase", ikon: "🧬", nama: "Enzim DNA Ligase" }
        ],
        steps: [
            "Siapkan kaca objek bersih, sampel darah pasien, 4 serum reagen, dan tusuk gigi steril.",
            "Teteskan darah pasien ke keempat sumur kaca objek.",
            "Teteskan masing-masing serum (Anti-A, Anti-B, Anti-AB, Anti-D) tepat pada sumur berlabel sama.",
            "Aduk tiap sumur hingga merata; WAJIB mengganti tusuk gigi steril baru setiap pindah sumur.",
            "Amati pola penggumpalan (aglutinasi) lalu tegakkan diagnosis golongan darah & donor aman."
        ],
        risks: "• <b>Berantai:</b> Salah meneteskan serum ke sumur berbeda membuat kaca objek tercemar ➔ ulang tetes darah.<br>• <b>Fatal:</b> Mengaduk sumur baru dengan tusuk gigi bekas memicu kontaminasi silang ➔ praktikum gagal total & ulang dari awal!"
    },
    membrane_transport: {
        judul: "🔬 Panduan Praktikum: Transpor Membran & Osmosis",
        tujuan: "Menginvestigasi konsentrasi zat terlarut internal sel misteri (Eritrosit / Rhoeo discolor) melalui fenomena osmosis.",
        requiredTools: [
            { id: "mt_slide",  ikon: "🧫", nama: "Kaca Objek & Cover Slip" },
            { id: "mt_scope",  ikon: "🔬", nama: "Mikroskop Cahaya" },
            { id: "mt_spec",   ikon: "🩸", nama: "Sampel Sel Uji" },
            { id: "mt_sol",    ikon: "💧", nama: "Larutan NaCl / Sukrosa" }
        ],
        decoyTools: [
            { id: "dc_serumd", ikon: "🧪", nama: "Serum Anti-D" },
            { id: "dc_paper",  ikon: "📄", nama: "Kertas Buram" },
            { id: "dc_plasmid",ikon: "⭕", nama: "Plasmid E. coli" },
            { id: "dc_kastr",  ikon: "✂️", nama: "Gunting Kastrasi" }
        ],
        steps: [
            "Pilih spesimen sel, letakkan pada kaca objek, dan tutup rapi dengan cover slip.",
            "Kalibrasi fokus mikroskop (Makrometer lalu Mikrometer) hingga bayangan tajam ≥ 92%.",
            "Uji berbagai konsentrasi larutan secara bertahap dan catat perubahan volume sel di buku pengamatan.",
            "Temukan titik isotonis (volume sel stabil 100%) lalu simpulkan konsentrasi internal sel & mekanisme osmosis."
        ],
        risks: "• <b>Kesalahan Kecil (-1 ❤️):</b> Salah pilih alat meja kerja atau prosedur penyiapan preparat terbalik (maks. 5 kesalahan)."
    },
    tissue_culture: {
        judul: "🧫 Panduan Praktikum: Kultur Jaringan Tumbuhan",
        tujuan: "Memperbanyak tanaman secara in vitro memanfaatkan sifat totipotensi sel meristem.",
        requiredTools: [
            { id: "tc_knife",  ikon: "🔪", nama: "Skalpel & Talenan Steril" },
            { id: "tc_steril", ikon: "🧴", nama: "Alkohol, Kloroks, & Akuades" },
            { id: "tc_ms",     ikon: "🧪", nama: "Media MS + Auksin/Sitokinin" },
            { id: "tc_laf",    ikon: "🔥", nama: "Api Bunsen & Pinset LAF" }
        ],
        decoyTools: [
            { id: "dc_biuret", ikon: "💧", nama: "Reagen Biuret" },
            { id: "dc_rest",   ikon: "✂️", nama: "Enzim Restriksi" },
            { id: "dc_slide4", ikon: "🧫", nama: "Kaca Objek 4 Sumur" },
            { id: "dc_tem",    ikon: "⚛️", nama: "Mikroskop Elektron" }
        ],
        steps: [
            "Pilih tanaman induk serta jaringan meristem/kambium muda, lalu iris tipis 4 eksplan di talenan steril.",
            "Sterilkan eksplan bertingkat (Alkohol 70% ➔ Kloroks ➔ Akuades) tepat pada zona waktu optimal.",
            "Racik media agar MS (Garam MS, Sukrosa, Agar) + atur rasio hormon sesuai target lalu sterilkan di autoklaf.",
            "Lakukan inokulasi aseptis di LAF (Nyalakan Bunsen ➔ Pijarkan Pinset ➔ Tanam Eksplan) & inkubasi hingga jadi plantlet.",
            "Lakukan 3 tahap aklimatisasi berurutan, jawab evaluasi, lalu jual atau kirim bibit ke My Garden."
        ],
        risks: "• <b>Berantai:</b> Perendaman sterilisasi terlalu lama membuat eksplan browning ➔ harus ulang iris eksplan baru di talenan! Menanam saat Bunsen mati memicu kontaminasi ➔ ulang sterilisasi!<br>• <b>Fatal:</b> Eksplan terendam bahan kimia hingga 95–100% mati hangus total ➔ ulang dari awal!"
    },
    dna_recomb: {
        judul: "🧬 Panduan Praktikum: Rekombinasi DNA (Produksi Insulin)",
        tujuan: "Menyisipkan gen insulin manusia ke plasmid bakteri E. coli untuk memproduksi hormon insulin rekombinan.",
        requiredTools: [
            { id: "dr_panc",   ikon: "🫀", nama: "Sampel Sel Beta Pankreas" },
            { id: "dr_ecoli",  ikon: "🦠", nama: "Kultur Plasmid E. coli" },
            { id: "dr_enz",    ikon: "✂️", nama: "Enzim Restriksi & DNA Ligase" },
            { id: "dr_bio",    ikon: "🏭", nama: "Tabung Heat Shock & Bioreaktor" }
        ],
        decoyTools: [
            { id: "dc_ms2",    ikon: "🍮", nama: "Media Agar MS" },
            { id: "dc_pap2",   ikon: "📄", nama: "Kertas Buram" },
            { id: "dc_lug2",   ikon: "💧", nama: "Larutan Lugol" },
            { id: "dc_mor2",   ikon: "🥣", nama: "Lumpang & Alu" }
        ],
        steps: [
            "Isolasi DNA gen insulin dari Sel Beta Pankreas manusia dan ekstrak plasmid sirkuler E. coli.",
            "Identifikasi urutan palindrom, pilih enzim restriksi yang tepat, lalu potong 2 situs DNA manusia & 1 situs plasmid.",
            "Pasangkan fragmen dengan ujung lengket (sticky ends) komplementer lalu segel memakai DNA Ligase.",
            "Transformasikan rDNA ke E. coli melalui Heat Shock 42°C, lalu jalankan fermentasi bioreaktor hingga panen Vial Insulin."
        ],
        risks: "• <b>Berantai:</b> Memotong segmen inti gen/situs ori merusak rantai DNA ➔ ulang isolasi DNA & Plasmid! Heat Shock berlebih merusak plasmid ➔ ulang Ligasi rDNA!<br>• <b>Fatal:</b> Heat Shock mencapai 95–100% membunuh seluruh sel E. coli ➔ ulang dari awal!"
    },
    genetics_lab: {
        judul: "🌺 Panduan Praktikum: Genetika & 6 Pola Persilangan Mendel",
        tujuan: "Merancang persilangan P1 & P2 secara mandiri, membuktikan Hukum Mendel I & II lewat penentuan gamet, dan menyusun Papan Punnett.",
        requiredTools: [
            { id: "gn_p1",     ikon: "🌺", nama: "Organisme Induk P1" },
            { id: "gn_kastr",  ikon: "✂️", nama: "Gunting Kastrasi" },
            { id: "gn_brush",  ikon: "🖌️", nama: "Kuas Penyerbukan Silang" },
            { id: "gn_pun",    ikon: "📊", nama: "Sungkup & Papan Punnett" }
        ],
        decoyTools: [
            { id: "dc_ben",    ikon: "💧", nama: "Reagen Benedict" },
            { id: "dc_cv",     ikon: "🟣", nama: "Kristal Violet" },
            { id: "dc_auto",   ikon: "🔥", nama: "Autoklaf 121°C" },
            { id: "dc_ferm",   ikon: "🫙", nama: "Inkubator Fermentasi" }
        ],
        steps: [
            "Pilih salah satu dari 6 mode genetika (Monohibrid, Intermediet, Dihibrid, Resiprok, Testcross, Backcross) & tentukan sendiri P1.",
            "Lakukan kastrasi induk betina terlebih dahulu, lalu lakukan penyerbukan silang buatan.",
            "Susun gamet unik berdasarkan Segregasi Bebas (Mendel I) atau Asortasi Bebas (Mendel II).",
            "Lengkapi Papan Punnett dengan Drag & Drop chip genotipe, lalu pilih sendiri P2 dari hasil F1 untuk membentuk F2.",
            "Analisis rasio fenotipe/genotipe serta kirim bibit varian warna genetik ke My Garden."
        ],
        risks: "• <b>Kesalahan Kecil (-1 ❤️):</b> Salah urutan penyerbukan, salah susun gamet, atau salah meletakkan genotipe di Punnett (maks. 5 kesalahan)."
    },
    microscope_lab: {
        judul: "🔭 Panduan Praktikum: Mikroskop Sel & Jaringan",
        tujuan: "Mengoperasikan 3 jenis mikroskop (Cahaya, Stereo, Elektron), mengatur lensa okuler–objektif, cahaya, serta fokus.",
        requiredTools: [
            { id: "mc_unit",   ikon: "🔬", nama: "Unit Mikroskop Multi-Tipe" },
            { id: "mc_lens",   ikon: "🔎", nama: "Set Lensa Okuler & Objektif" },
            { id: "mc_light",  ikon: "💡", nama: "Pengatur Cahaya & Diafragma" },
            { id: "mc_prep",   ikon: "🧫", nama: "Kotak Preparat Sel & Jaringan" }
        ],
        decoyTools: [
            { id: "dc_lig3",   ikon: "🧬", nama: "Enzim DNA Ligase" },
            { id: "dc_br3",    ikon: "🖌️", nama: "Kuas Penyerbukan" },
            { id: "dc_biu3",   ikon: "🧪", nama: "Reagen Biuret" },
            { id: "dc_fer3",   ikon: "🫙", nama: "Tabung Fermenter" }
        ],
        steps: [
            "Pilih 1 dari 6 preparat sel atau jaringan yang akan diamati.",
            "Pilih jenis mikroskop yang sesuai dengan ketebalan & ukuran objek.",
            "Atur kombinasi Lensa Okuler dan Lensa Objektif hingga perbesaran bidang pandang optimal.",
            "Sesuaikan intensitas cahaya/diafragma dan putar Makrometer–Mikrometer hingga tajam ≥ 90%.",
            "Ambil foto pengamatan lalu identifikasi struktur utama & hitung perbesaran total."
        ],
        risks: "• <b>Kesalahan Kecil (-1 ❤️):</b> Salah pilih alat di meja kerja atau salah prosedur persiapan (maks. 5 kesalahan)."
    },
    food_test: {
        judul: "🥗 Panduan Praktikum: Uji Kandungan Zat Makanan",
        tujuan: "Mengidentifikasi kandungan amilum, protein, glukosa, dan lemak pada bahan makanan melalui reaksi warna.",
        requiredTools: [
            { id: "ft_mortar", ikon: "🥣", nama: "Lumpang, Alu, & Akuades" },
            { id: "ft_tube",   ikon: "🧪", nama: "Tabung Reaksi & Bunsen" },
            { id: "ft_reag",   ikon: "💧", nama: "Lugol, Biuret, & Benedict" },
            { id: "ft_paper",  ikon: "📄", nama: "Kertas Buram" }
        ],
        decoyTools: [
            { id: "dc_sera",   ikon: "🩸", nama: "Serum Anti-A" },
            { id: "dc_plas",   ikon: "⭕", nama: "Plasmid E. coli" },
            { id: "dc_gram",   ikon: "🟣", nama: "Kristal Violet & Safranin" },
            { id: "dc_kas2",   ikon: "✂️", nama: "Gunting Kastrasi" }
        ],
        steps: [
            "Haluskan sampel makanan menggunakan lumpang & alu, lalu tambahkan akuades menjadi ekstrak cair.",
            "Teteskan Lugol, Biuret, dan Benedict pada masing-masing tabung, serta usapkan ekstrak pada kertas buram.",
            "Lakukan pemanasan api Bunsen HANYA pada tabung yang membutuhkannya (cek ❓ Referensi).",
            "Amati perubahan warna & noda transparan, lalu centang kandungan gizi positif pada formulir diagnosis."
        ],
        risks: "• <b>Berantai:</b> Memanaskan tabung Lugol atau Biuret merusak sampel ekstrak & menghasilkan uap berbahaya ➔ wajib ulang buat ekstrak dari Tahap 1!"
    },
    gram_stain: {
        judul: "🦠 Panduan Praktikum: Pewarnaan Gram Bakteri",
        tujuan: "Membedakan bakteri Gram Positif dan Gram Negatif serta mengamati morfologi sel di mikroskop 1.000×.",
        requiredTools: [
            { id: "gs_ose",    ikon: "🧫", nama: "Kaca Objek & Jarum Ose" },
            { id: "gs_bunsen", ikon: "🔥", nama: "Api Bunsen Fiksasi" },
            { id: "gs_set",    ikon: "🎨", nama: "Set 4 Reagen Gram" },
            { id: "gs_scope",  ikon: "🔬", nama: "Mikroskop 1.000×" }
        ],
        decoyTools: [
            { id: "dc_ben2",   ikon: "💧", nama: "Reagen Benedict" },
            { id: "dc_auk2",   ikon: "🌿", nama: "Hormon Auksin–Sitokinin" },
            { id: "dc_pap3",   ikon: "📄", nama: "Kertas Buram" },
            { id: "dc_bru3",   ikon: "🖌️", nama: "Kuas Penyerbukan" }
        ],
        steps: [
            "Buat apusan bakteri dengan jarum ose, keringkan di udara, lalu fiksasi panas di atas api Bunsen.",
            "Lakukan pewarnaan 4 reagen secara berurutan: Kristal Violet ➔ Iodin ➔ Alkohol 96% (tepat waktu) ➔ Safranin.",
            "Amati warna akhir serta bentuk sel di mikroskop 1.000×, lalu tegakkan identifikasi Gram (+)/(−) & morfologi."
        ],
        risks: "• <b>Berantai:</b> Fiksasi api saat apusan masih basah merusak sel ➔ ulang dari buat apusan! Pembilasan alkohol berlebih melunturkan pewarna utama ➔ ulang dari Kristal Violet!<br>• <b>Fatal:</b> Alkohol dibiarkan hingga 95–100% merusak preparat total ➔ ulang dari awal!"
    },
    fermentation_lab: {
        judul: "🫙 Panduan Praktikum: Fermentasi Bioteknologi (Real-Time)",
        tujuan: "Menghasilkan produk bioteknologi konvensional (Yoghurt, Tempe, Tape, Keju) dengan sterilisasi substrat, inokulasi mikroba, dan kontrol suhu optimum.",
        requiredTools: [
            { id: "fm_sub",    ikon: "🥛", nama: "Substrat (Susu/Kedelai/Singkong)" },
            { id: "fm_past",   ikon: "🔥", nama: "Alat Pasteurisasi / Pengukus" },
            { id: "fm_mik",    ikon: "🦠", nama: "Biakan Mikroorganisme" },
            { id: "fm_inc",    ikon: "🫙", nama: "Inkubator Pengatur Suhu" }
        ],
        decoyTools: [
            { id: "dc_serd",   ikon: "🧪", nama: "Serum Anti-D" },
            { id: "dc_rest2",  ikon: "✂️", nama: "Enzim Restriksi" },
            { id: "dc_sl4",    ikon: "🧫", nama: "Kaca Objek 4 Sumur" },
            { id: "dc_kas3",   ikon: "🖌️", nama: "Kuas Penyerbukan" }
        ],
        steps: [
            "Pilih slot inkubator kosong lalu tentukan produk fermentasi yang ingin diproduksi.",
            "Lakukan pasteurisasi/pengukusan substrat agar steril dari mikroba liar.",
            "Inokulasikan mikroorganisme yang sesuai dengan produk lalu atur suhu inkubator ke kisaran optimum.",
            "Pantau fermentasi berjalan real-time (bisa dipercepat lewat kuis) lalu panen menjadi Coin atau Makanan My Pet."
        ],
        risks: "• <b>Berantai:</b> Salah menginokulasi mikroba pada substrat yang sudah dipasteurisasi menyebabkan kontaminasi ➔ wajib pasteurisasi ulang substrat!"
    },
    protein_synth: {
        judul: "🧬 Panduan Praktikum: Sintesis Protein (Transkripsi & Translasi)",
        tujuan: "Menyusun pita mRNA dari DNA template di nukleus lalu menerjemahkan kodon menjadi rantai asam amino di ribosom.",
        requiredTools: [
            { id: "ps_dna",    ikon: "🧬", nama: "Pita DNA Template (Nukleus)" },
            { id: "ps_rna",    ikon: "🧩", nama: "Nukleotida mRNA (A, U, G, C)" },
            { id: "ps_ribo",   ikon: "⚙️", nama: "Kompleks Ribosom & tRNA" },
            { id: "ps_aa",     ikon: "🔗", nama: "Set Asam Amino" }
        ],
        decoyTools: [
            { id: "dc_alc3",   ikon: "🧴", nama: "Alkohol 96%" },
            { id: "dc_biu4",   ikon: "💧", nama: "Reagen Biuret" },
            { id: "dc_ms3",    ikon: "🍮", nama: "Media Agar MS" },
            { id: "dc_pap4",   ikon: "📄", nama: "Kertas Buram" }
        ],
        steps: [
            "Transkripsikan 12 basa pita DNA template (3'➔5') menjadi mRNA (5'➔3') dengan pasangan basa RNA yang tepat.",
            "Bawa pita mRNA ke ribosom, baca setiap triplet kodon (gunakan ❓ Referensi untuk melihat Tabel Kodon).",
            "Seret (Drag & Drop) asam amino yang cocok mulai dari Start Kodon (AUG) hingga STOP kodon."
        ],
        risks: "• <b>Kesalahan Kecil (-1 ❤️):</b> Menggunakan Timin (T) pada RNA, salah pasangan basa transkripsi, atau salah translasi kodon (maks. 5 kesalahan)."
    },
    hematopoiesis: {
        judul: "🛡️ Panduan Praktikum: Hematopoesis & Spesialisasi Sel Imun",
        tujuan: "Merekrut ke-9 jenis sel darah dari Sel Punca HSC ke jalur Mieloid & Limfoid lalu mengerahkan sel spesialis menghadapi ancaman tubuh.",
        requiredTools: [
            { id: "hm_hsc",    ikon: "🦴", nama: "Sel Punca HSC (Sumsum Tulang)" },
            { id: "hm_miel",   ikon: "🩸", nama: "Faktor Pertumbuhan Mieloid" },
            { id: "hm_limf",   ikon: "🛡️", nama: "Faktor Limfoid & Timus" },
            { id: "hm_pat",    ikon: "🚨", nama: "Panel Sinyal Kasus Klinis" }
        ],
        decoyTools: [
            { id: "dc_lug3",   ikon: "💧", nama: "Reagen Lugol" },
            { id: "dc_skal",   ikon: "🔪", nama: "Pisau Skalpel Eksplan" },
            { id: "dc_kuas",   ikon: "🖌️", nama: "Kuas Penyerbukan" },
            { id: "dc_ecori",  ikon: "✂️", nama: "Enzim Restriksi" }
        ],
        steps: [
            "Siapkan sel punca HSC, faktor diferensiasi Mieloid & Limfoid, serta panel kasus klinis.",
            "Rekrut seluruh 9 jenis sel darah & imun ke jalur progenitor yang tepat (6 Mieloid, 3 Limfoid).",
            "Hadapi 4 misi tanggap darurat tubuh dengan mengerahkan 1 sel spesialis yang paling tepat untuk setiap kasus.",
            "Selesaikan evaluasi konsep hematologi untuk meraih piala & hadiah."
        ],
        risks: "• <b>Kesalahan Kecil (-1 ❤️):</b> Salah memilih jalur progenitor sel atau salah mengerahkan sel imun pada kasus darurat (maks. 5 kesalahan)."
    }
};

// --- UPDATE HUD NYAWA & TOMBOL PROSEDUR ---
window.perbaruiHUDNyawaDanProsedurLab = function() {
    let f = window.labFlowState;
    let inExp = Boolean(window.activeLabView && window.activeLabView !== "lobby");
    let pill = document.getElementById("mylab-lives-pill");
    let btnProt = document.getElementById("btn-lab-protocol");
    let btnGuide = document.getElementById("btn-lab-guide");

    if (btnProt) btnProt.style.display = inExp ? "inline-flex" : "none";
    if (btnGuide) btnGuide.style.display = inExp ? "inline-flex" : "none";

    if (pill) {
        if (inExp && f.active) {
            let hearts = "";
            for (let i = 0; i < f.maxLives; i++) {
                hearts += i < f.lives ? "❤️" : "🖤";
            }
            pill.innerHTML = hearts;
            pill.classList.toggle("is-low", f.lives <= 2);
            pill.style.display = "inline-flex";
        } else {
            pill.style.display = "none";
        }
    }
};

// --- MODAL BUKU PROSEDUR PRAKTIKUM (TERPISAH DARI MODAL ? REFERENSI) ---
window.bukaProsedurPraktikumLab = function() {
    let key = window.activeLabView;
    let p = window.MY_LAB_PROTOCOL_DB[key];
    let ov = document.getElementById("mylab-protocol-overlay");
    if (!ov || !p) return;

    let toolsChips = p.requiredTools.map(function(t) {
        return '<span class="lab-prot-tool-chip">' + t.ikon + ' ' + t.nama + '</span>';
    }).join('');
    let stepsLi = p.steps.map(function(st) { return '<li>' + st + '</li>'; }).join('');

    ov.innerHTML =
        '<div class="mylab-guide-card is-protocol-card">' +
            '<div class="mylab-guide-head is-protocol-head">' +
                '<div>' +
                    '<div class="mylab-guide-title">' + p.judul + '</div>' +
                    '<div class="mylab-guide-sub">📖 Prosedur Baku Praktikum — Dapat dibaca ulang kapan saja selama bekerja.</div>' +
                '</div>' +
                '<button type="button" class="garden-quiz-close" onclick="window.tutupProsedurPraktikumLab()">✕</button>' +
            '</div>' +
            '<div class="mylab-guide-body mylab-protocol-body">' +
                '<div class="mylab-guide-sec"><h4>🎯 Tujuan Praktikum</h4><div class="mylab-guide-content"><p>' + p.tujuan + '</p></div></div>' +
                '<div class="mylab-guide-sec"><h4>🧰 Alat &amp; Bahan Wajib</h4><div class="lab-prot-tools-wrap">' + toolsChips + '</div></div>' +
                '<div class="mylab-guide-sec"><h4>📋 Urutan Langkah Kerja</h4><div class="mylab-guide-content"><ol>' + stepsLi + '</ol></div></div>' +
                '<div class="mylab-guide-sec is-risk-sec"><h4>⚠️ Aturan Keselamatan &amp; Kegagalan (5 Nyawa ❤️)</h4><div class="mylab-guide-content">' + p.risks + '</div></div>' +
            '</div>' +
            '<div class="mylab-guide-foot">' +
                '<button type="button" class="mypet-green-cta sm" style="max-width:260px;" onclick="window.tutupProsedurPraktikumLab()">✅ Tutup Prosedur &amp; Lanjut</button>' +
            '</div>' +
        '</div>';

    ov.style.display = "flex";
};

window.tutupProsedurPraktikumLab = function() {
    let ov = document.getElementById("mylab-protocol-overlay");
    if (ov) ov.style.display = "none";
};

window.tutupOverlayGagalLab = function() {
    let ov = document.getElementById("mylab-fail-overlay");
    if (ov) ov.style.display = "none";
};

// --- MESIN PENALTY NYAWA, ROLLBACK BERANTAI, & KEGAGALAN FATAL ---
window.tampilkanLayarGagalTotalLab = function(isFatal, alasan) {
    let f = window.labFlowState;
    f.phase = "failed";
    f.lives = 0;
    f.failType = isFatal ? "fatal" : "out_of_lives";
    f.failReason = alasan || "Batas maksimal 5 kesalahan kecil telah tercapai.";
    window.perbaruiHUDNyawaDanProsedurLab();

    let ov = document.getElementById("mylab-fail-overlay");
    if (!ov) return;

    ov.innerHTML =
        '<div class="mylab-guide-card is-fail-card">' +
            '<div class="mylab-guide-head is-fail-head">' +
                '<div>' +
                    '<div class="mylab-guide-title">' + (isFatal ? '💥 KEGAGALAN FATAL PRAKTIKUM!' : '💔 KESEMPATAN HABIS (0/5 ❤️)') + '</div>' +
                    '<div class="mylab-guide-sub">Dalam praktikum laboratorium nyata, eksperimen yang rusak wajib diulang dari awal.</div>' +
                '</div>' +
            '</div>' +
            '<div class="mylab-guide-body">' +
                '<div class="mylab-guide-sec is-risk-sec">' +
                    '<h4>🔍 Penyebab Kegagalan</h4>' +
                    '<div class="mylab-guide-content" style="font-size:12.5px;">' + f.failReason + '</div>' +
                '</div>' +
                '<div style="font-size:11.5px; color:#475569; text-align:center;">💡 Tips: Baca kembali <b>📖 Prosedur</b> &amp; <b>❓ Referensi</b> sebelum mengulang agar praktikum berikutnya meraih ⭐⭐⭐!</div>' +
            '</div>' +
            '<div class="mylab-guide-foot" style="gap:8px;">' +
                '<button type="button" class="mypet-green-cta sm" style="flex:1; max-width:230px;" onclick="window.ulangPraktikumDariAwalLab()">🔄 Ulang dari Awal (5 ❤️)</button>' +
                '<button type="button" class="mypet-amber-cta sm" style="flex:1; max-width:170px;" onclick="window.kembaliKeLobiLab()">🧪 Lobi My Lab</button>' +
            '</div>' +
        '</div>';

    ov.style.display = "flex";
};

window.prosesKesalahanLab = function(severity, pesan, rollbackFn) {
    let f = window.labFlowState;
    if (!f || !f.active || f.phase === "failed") return;

    if (severity === "fatal") {
        window.tampilkanLayarGagalTotalLab(true, pesan);
        return;
    }

    f.lives = Math.max(0, (Number(f.lives) || 0) - 1);
    window.perbaruiHUDNyawaDanProsedurLab();

    if (f.lives <= 0) {
        window.tampilkanLayarGagalTotalLab(false, "Kesalahan ke-5: " + pesan);
        return;
    }

    if (severity === "rollback" && typeof rollbackFn === "function") {
        rollbackFn();
    }

    window._labSkipNextToastLife = true;
    window.tampilkanToastLab(pesan + " (Sisa Nyawa: " + f.lives + "/" + f.maxLives + " ❤️)", "err");
};

window.ulangPraktikumDariAwalLab = function() {
    let expId = window.labFlowState.expId || window.activeLabView;
    window.tutupOverlayGagalLab();
    window.tutupProsedurPraktikumLab();
    window.tutupPanduanLab();
    if (expId && expId !== "lobby") {
        window.mulaiPraktikumLab(expId);
    } else {
        window.kembaliKeLobiLab();
    }
};

// --- RENDER LAYAR BRIEFING AWAL & TAHAP 0 (PILIH ALAT & BAHAN KE MEJA KERJA) ---
window.renderLayarBriefingLab = function(bodyEl) {
    let expId = window.labFlowState.expId;
    let p = window.MY_LAB_PROTOCOL_DB[expId];
    if (!p) { window.lanjutKeTahap0AlatBahanLab(); return; }

    let toolsHtml = p.requiredTools.map(function(t) {
        return '<span class="lab-prot-tool-chip">' + t.ikon + ' ' + t.nama + '</span>';
    }).join('');
    let stepsHtml = p.steps.map(function(st) { return '<li>' + st + '</li>'; }).join('');

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div class="lab-briefing-card">' +
                '<div class="lab-briefing-head">' +
                    '<div><h3>' + p.judul + '</h3><small>📖 Baca panduan ini dengan saksama sebelum menyiapkan alat &amp; bahan di meja kerja.</small></div>' +
                    '<span class="lab-briefing-hearts">❤️❤️❤️❤️❤️ (Maks. 5 Salah)</span>' +
                '</div>' +
                '<div class="lab-briefing-grid">' +
                    '<div class="mylab-guide-sec"><h4>🎯 Tujuan &amp; Alat Bahan Wajib</h4><div class="mylab-guide-content"><p>' + p.tujuan + '</p></div><div class="lab-prot-tools-wrap" style="margin-top:8px;">' + toolsHtml + '</div></div>' +
                    '<div class="mylab-guide-sec"><h4>📋 Urutan Langkah Kerja</h4><div class="mylab-guide-content"><ol>' + stepsHtml + '</ol></div></div>' +
                '</div>' +
                '<div class="mylab-guide-sec is-risk-sec"><h4>⚠️ Konsekuensi Kesalahan Praktikum</h4><div class="mylab-guide-content">' + p.risks + '</div></div>' +
                '<div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:4px;">' +
                    '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:9px 18px;" onclick="window.bukaPanduanLab()">❓ Baca Referensi Konsep</button>' +
                    '<button type="button" class="mypet-green-cta" style="max-width:340px;" onclick="window.lanjutKeTahap0AlatBahanLab()">🧰 Lanjut: Pilih Alat &amp; Bahan ke Meja Kerja ➔</button>' +
                '</div>' +
            '</div>' +
        '</div>';
};

window.lanjutKeTahap0AlatBahanLab = function() {
    let f = window.labFlowState;
    let p = window.MY_LAB_PROTOCOL_DB[f.expId];
    if (!p) { window.mulaiSesiIntiSetelahAlatSiap(); return; }

    f.phase = "setup_tools";
    f.pickedTools = [];
    let combined = p.requiredTools.map(function(x) { return Object.assign({ ok: true }, x); })
        .concat(p.decoyTools.map(function(x) { return Object.assign({ ok: false }, x); }));
    f.rackItems = combined.sort(function() { return Math.random() - 0.5; });
    window.renderMyLabUI();
};

window.renderTahap0AlatBahanLab = function(bodyEl) {
    let f = window.labFlowState;
    let p = window.MY_LAB_PROTOCOL_DB[f.expId];
    if (!p) return;

    let benchHtml = f.pickedTools.length === 0
        ? '<div class="lab-bench-empty">Meja kerja masih kosong. Pilih alat &amp; bahan yang diperlukan dari Rak Laboratorium di bawah!</div>'
        : f.pickedTools.map(function(tid) {
              let item = f.rackItems.find(function(x) { return x.id === tid; });
              if (!item) return "";
              return '<button type="button" class="lab-tool-card is-on-bench" onclick="window.togglePilihAlatMejaLab(\'' + item.id + '\')" title="Klik untuk mengembalikan ke rak">' +
                  '<span class="lab-tool-ico">' + item.ikon + '</span><b>' + item.nama + '</b><small>✕ Kembalikan</small>' +
              '</button>';
          }).join('');

    let rackHtml = f.rackItems.map(function(item) {
        let onBench = f.pickedTools.indexOf(item.id) !== -1;
        return '<button type="button" class="lab-tool-card' + (onBench ? ' is-picked' : '') + '" onclick="window.togglePilihAlatMejaLab(\'' + item.id + '\')">' +
            '<span class="lab-tool-ico">' + item.ikon + '</span><b>' + item.nama + '</b><small>' + (onBench ? '✓ Di Meja' : '+ Ambil') + '</small>' +
        '</button>';
    }).join('');

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            '<div class="lab-instruction-banner">' +
                '<strong>🧰 Tahap 0: Siapkan Alat &amp; Bahan di Meja Kerja (' + f.pickedTools.length + ' Dipilih)</strong>' +
                '<span>Pilih HANYA alat &amp; bahan yang dibutuhkan untuk <b>' + p.judul.replace(/^.*?:\s*/, '') + '</b>! (Lupa? Klik <b>📖 Prosedur</b> di atas).</span>' +
            '</div>' +
            '<div class="lab-workbench-zone">' +
                '<div class="lab-zone-heading"><span>🔬 Meja Kerja Praktikum Kamu</span><button type="button" class="mypet-green-cta sm" style="width:auto; padding:7px 18px;" onclick="window.verifikasiAlatMejaKerjaLab()">✅ Konfirmasi &amp; Mulai Praktikum ➔</button></div>' +
                '<div class="lab-bench-tray">' + benchHtml + '</div>' +
            '</div>' +
            '<div class="lab-rack-zone">' +
                '<div class="lab-zone-heading"><span>🗄️ Rak Alat &amp; Bahan Laboratorium (Hati-hati ada pengecoh!)</span></div>' +
                '<div class="lab-rack-grid">' + rackHtml + '</div>' +
            '</div>' +
        '</div>';
};

window.togglePilihAlatMejaLab = function(toolId) {
    let f = window.labFlowState;
    if (!f || f.phase !== "setup_tools") return;
    let idx = f.pickedTools.indexOf(toolId);
    if (idx !== -1) f.pickedTools.splice(idx, 1);
    else f.pickedTools.push(toolId);
    window.renderMyLabUI();
};

window.verifikasiAlatMejaKerjaLab = function() {
    let f = window.labFlowState;
    let p = window.MY_LAB_PROTOCOL_DB[f.expId];
    if (!f || !p) return;

    if (f.pickedTools.length === 0) {
        return window.tampilkanToastLab("👆 Ambil alat &amp; bahan dari Rak Laboratorium terlebih dahulu!", "err");
    }

    let reqIds = p.requiredTools.map(function(x) { return x.id; });
    let wrongPicked = f.pickedTools.filter(function(id) { return reqIds.indexOf(id) === -1; });
    let missing = reqIds.filter(function(id) { return f.pickedTools.indexOf(id) === -1; });

    if (wrongPicked.length > 0 || missing.length > 0) {
        let msg = "";
        if (wrongPicked.length > 0) {
            let nmWrong = wrongPicked.map(function(id) {
                let it = f.rackItems.find(function(x) { return x.id === id; });
                return it ? it.nama : id;
            }).join(", ");
            msg += "Alat/bahan tidak sesuai di meja: <b>" + nmWrong + "</b>. ";
        }
        if (missing.length > 0) {
            msg += "Masih kurang <b>" + missing.length + "</b> alat/bahan wajib! ";
        }
        window.prosesKesalahanLab("minor", "⚠️ Persiapan meja kurang tepat! " + msg + "Cek 📖 Prosedur lalu perbaiki pilihanmu.");
        return;
    }

    window.mulaiSesiIntiSetelahAlatSiap();
};

window.mulaiSesiIntiSetelahAlatSiap = function() {
    let f = window.labFlowState;
    f.phase = "running";
    if (typeof window._origMulaiPraktikumLabCore === "function") {
        window._origMulaiPraktikumLabCore(f.expId);
    }
    window.perbaruiHUDNyawaDanProsedurLab();
    window.tampilkanToastLab("🎉 Meja kerja siap lengkap! Selamat melaksanakan praktikum!", "ok");
};

// --- OVERRIDE KONSEKUENSI ROLLBACK BERANTAI & FATAL PADA AKSI-AKSI KRITIS ---

// 1. TES GOLONGAN DARAH: Salah tetes serum -> Rollback Tahap 1 | Tusuk gigi bekas -> FATAL
window.aksiTetesSerumSumur = function(wellKey) {
    let s = window.labBloodSession;
    if (!s || s.step !== 2 || !s.wells[wellKey] || s.wells[wellKey].reagent) return;
    let selected = s.selectedReagent;
    if (!selected) return window.tampilkanToastLab("👆 Pilih botol serum terlebih dahulu!", "err");

    if (selected !== wellKey) {
        s.mistakes++;
        window.prosesKesalahanLab("rollback", "⚠️ Kaca objek tercemar serum yang salah sumur! Wajib ganti kaca objek baru & ulang dari Tahap 1 (tetes darah).", function() {
            s.step = 1;
            Object.keys(s.wells).forEach(function(k) {
                s.wells[k].blood = false;
                s.wells[k].reagent = false;
                s.wells[k].stirPct = 0;
                s.wells[k].done = false;
            });
            window.renderMyLabUI();
        });
        return;
    }

    s.wells[wellKey].reagent = true;
    let nextBottle = window.MY_LAB_CATALOG.reagents.find(function(r) { return !s.wells[r.key].reagent; });
    s.selectedReagent = nextBottle ? nextBottle.key : "";
    let semuaTetes = Object.values(s.wells).every(function(w) { return w.reagent; });
    window.renderMyLabUI();
    if (semuaTetes) {
        window.tampilkanToastLab("✅ Keempat serum tepat diteteskan! Lanjut Pengadukan Aseptis!", "ok");
        setTimeout(function() {
            if (window.labBloodSession && window.labBloodSession.step === 2) {
                window.labBloodSession.step = 3;
                window.labBloodSession.stickState = "clean";
                window.labBloodSession.stickUsedWell = "";
                window.renderMyLabUI();
            }
        }, 700);
    }
};

window.mulaiAdukSumurLab = function(e, wellKey) {
    let s = window.labBloodSession;
    if (!s || s.step !== 3 || !s.wells[wellKey] || s.wells[wellKey].done) return;
    e.preventDefault();
    e.stopPropagation();

    if (s.stickState === "used" && s.stickUsedWell !== wellKey) {
        window.prosesKesalahanLab("fatal", "<b>KONTAMINASI SILANG FATAL!</b> Kamu menggunakan tusuk gigi bekas dari sumur lain untuk mengaduk sumur baru. Campuran antibodi antar-serum merusak hasil aglutinasi sehingga pengujian pasien tidak valid dan wajib diulang dari awal!");
        return;
    }

    s.stickUsedWell = wellKey;
    window._labStirPointer = { active: true, wellKey: wellKey, lastX: e.clientX, lastY: e.clientY };
    window.tambahProgresAdukSumur(wellKey, 22);
};

// 2. KULTUR JARINGAN: Sterilisasi terlalu lama (Browning -> Rollback iris eksplan / >=95% FATAL) & LAF Kontaminasi -> Rollback Sterilisasi
window.angkatEksplanSterilisasiLab = function() {
    let s = window.labTissueSession;
    if (!s || s.step !== 2 || !s.bathDipping) return;
    window.hentikanTimerKulturJaringan();
    s.bathDipping = false;

    let curBath = window.MY_LAB_TC_STERIL_BATHS[s.bathIdx];
    let val = s.bathVal;

    if (val >= 95) {
        window.prosesKesalahanLab("fatal", "<b>EKSPLAN MATI HANGUS (BROWNING TOTAL)!</b> Perendaman terlalu lama dalam bahan kimia pekat mematikan seluruh jaringan meristem sehingga tidak bisa tumbuh lagi.");
        return;
    }
    if (val > curBath.maxOk) {
        s.mistakes++;
        window.prosesKesalahanLab("rollback", "⚠️ Eksplan mengalami browning karena terlalu lama direndam! Kembali ke Tahap 1B untuk mengiris eksplan segar baru di talenan.", function() {
            s.step = 1;
            s.tissuePickedOk = true;
            s.slicesDone = [false, false, false, false];
            s.bathIdx = 0;
            s.bathPickedIdx = -1;
            s.bathVal = 0;
            s.bathsDone = [false, false, false];
            window.renderMyLabUI();
        });
        return;
    }
    if (val < curBath.minOk) {
        s.mistakes++;
        s.bathVal = 0;
        window.prosesKesalahanLab("minor", "⚠️ Terlalu cepat (" + Math.round(val) + "%)! Mikroba belum mati, ulangi pencelupan hingga zona optimal.");
        window.renderMyLabUI();
        return;
    }

    s.bathsDone[s.bathIdx] = true;
    s.bathVal = 0;
    s.bathPickedIdx = -1;
    if (s.bathIdx < 2) {
        s.bathIdx++;
        window.renderMyLabUI();
        window.tampilkanToastLab("✅ Steril pas! Pilih gelas larutan berikutnya.", "ok");
    } else {
        window.renderMyLabUI();
        window.tampilkanToastLab("✅ Ketiga tahap sterilisasi sempurna! Lanjut Racik Media MS!", "ok");
        setTimeout(function() {
            if (window.labTissueSession && window.labTissueSession.step === 2) {
                window.labTissueSession.step = 3;
                window.renderMyLabUI();
            }
        }, 750);
    }
};

window.aksiLAFLab = function(aksi) {
    let s = window.labTissueSession;
    if (!s || s.step !== 4 || s.explantPlanted) return;
    if (aksi === "bunsen") {
        s.bunsenOn = true;
        window.renderMyLabUI();
        window.tampilkanToastLab("🔥 Api Bunsen menyala (zona aseptis aktif)!", "ok");
    } else if (aksi === "tweezer") {
        if (!s.bunsenOn) {
            s.mistakes++;
            return window.prosesKesalahanLab("minor", "⚠️ Api Bunsen belum menyala untuk memijarkan pinset!");
        }
        s.tweezerSterile = true;
        window.renderMyLabUI();
        window.tampilkanToastLab("✨ Pinset sudah dipijarkan dan steril!", "ok");
    } else if (aksi === "plant") {
        if (!s.bunsenOn || !s.tweezerSterile) {
            s.mistakes++;
            window.prosesKesalahanLab("rollback", "⚠️ KONTAMINASI MIKROBA! Eksplan ditanam tanpa prosedur api Bunsen & pinset steril sehingga terkontaminasi — wajib mundur ke Tahap 2 (Sterilisasi ulang)!", function() {
                s.step = 2;
                s.bunsenOn = false;
                s.tweezerSterile = false;
                s.bathIdx = 0;
                s.bathPickedIdx = -1;
                s.bathVal = 0;
                s.bathsDone = [false, false, false];
                window.renderMyLabUI();
            });
            return;
        }
        s.explantPlanted = true;
        s.growthPhase = 0;
        window.renderMyLabUI();
        window.tampilkanToastLab("🧫 Eksplan berhasil ditanam aseptis! Amati fase pertumbuhannya.", "ok");
    }
};

// 3. REKOMBINASI DNA: Potong situs salah -> Rollback Isolasi DNA | Heat Shock hangus -> Rollback Ligasi / >=95% FATAL
window.aksiPotongSitusDna = function(siteKey, isValidSite) {
    let s = window.labDnaSession;
    if (!s || s.step !== 2) return;
    if (!s.pickedEnzymeId) return window.tampilkanToastLab("👆 Pilih botol enzim restriksi terlebih dahulu!", "err");
    if (s.pickedEnzymeId !== s.enzId) {
        s.mistakes++;
        return window.prosesKesalahanLab("minor", "⚠️ Enzim " + window.cariEnzimRestriksiLab(s.pickedEnzymeId).nama + " tidak mengenali situs pada DNA ini! Cek ❓ Referensi.");
    }
    if (!isValidSite) {
        s.mistakes++;
        window.prosesKesalahanLab("rollback", "⚠️ DNA TERPOTONG DI BAGIAN KRUSIAL (Inti Gen / Situs Ori)! Sampel DNA rusak — mundur ke Tahap 1 untuk isolasi ulang DNA & Plasmid!", function() {
            s.step = 1;
            s.insulinIsolated = false;
            s.plasmidExtracted = false;
            s.cuts = { insulinLeft: false, insulinRight: false, plasmidSite: false };
            s.pickedEnzymeId = "";
            window.renderMyLabUI();
        });
        return;
    }
    if (s.cuts[siteKey]) return;
    s.cuts[siteKey] = true;
    let semuaTerpotong = s.cuts.insulinLeft && s.cuts.insulinRight && s.cuts.plasmidSite;
    window.renderMyLabUI();
    if (semuaTerpotong) {
        window.tampilkanToastLab("✂️ Potongan restriksi tepat! Lanjut Tahap Ligasi!", "ok");
        setTimeout(function() {
            if (window.labDnaSession && window.labDnaSession.step === 2) {
                window.labDnaSession.step = 3;
                window.renderMyLabUI();
            }
        }, 800);
    }
};

window.hentikanHeatShockDnaLab = function() {
    let s = window.labDnaSession;
    if (!s || s.step !== 4 || !s.heatDipping) return;
    window.hentikanTimerDnaLab();
    s.heatDipping = false;
    let v = s.heatVal;

    if (v >= 95) {
        window.prosesKesalahanLab("fatal", "<b>SEL E. COLI HANGUS MATI MASSAL!</b> Pemanasan Heat Shock melampaui batas toleransi sehingga seluruh bakteri inang mati dan transformasi gagal total.");
        return;
    }
    if (v > 76) {
        s.mistakes++;
        window.prosesKesalahanLab("rollback", "⚠️ Terlalu panas (" + Math.round(v) + "%)! Plasmid rDNA mengalami denaturasi — mundur ke Tahap 3 untuk menyambung ulang plasmid rDNA!", function() {
            s.step = 3;
            s.insertPlaced = false;
            s.ligasePicked = false;
            s.ligasePct = 0;
            s.heatVal = 0;
            window.renderMyLabUI();
        });
        return;
    }
    if (v < 46) {
        s.mistakes++;
        s.heatVal = 0;
        window.prosesKesalahanLab("minor", "⚠️ Durasi Heat Shock terlalu singkat (" + Math.round(v) + "%) sehingga pori membran belum terbuka. Coba ulangi!");
        window.renderMyLabUI();
        return;
    }

    s.heatDone = true;
    window.renderMyLabUI();
    window.tampilkanToastLab("❄️ Transformasi berhasil! Jalankan tangki Bioreaktor.", "ok");
};

// 4. PEWARNAAN GRAM: Fiksasi saat basah -> Rollback Apusan | Alkohol terlalu lama -> Rollback Kristal Violet / >=95% FATAL
window.aksiPrepGramLab = function(k) {
    let s = window.labGramSession;
    if (!s || s.step !== 1) return;
    if (k === "dry" && !s.prep.smear) {
        s.mistakes++;
        return window.prosesKesalahanLab("minor", "⚠️ Belum ada apusan bakteri di kaca objek untuk dikeringkan!");
    }
    if (k === "fix" && (!s.prep.smear || !s.prep.dry)) {
        s.mistakes++;
        window.prosesKesalahanLab("rollback", "⚠️ Fiksasi api saat apusan masih basah merusak struktur sel bakteri! Ulang dari membuat apusan bakteri baru.", function() {
            s.prep = { smear: false, dry: false, fix: false };
            window.renderMyLabUI();
        });
        return;
    }
    s.prep[k] = true;
    window.renderMyLabUI();
    if (k === "fix") {
        window.tampilkanToastLab("🔥 Fiksasi panas berhasil! Lanjut Tahap Pewarnaan 4 Reagen!", "ok");
        setTimeout(function() {
            if (window.labGramSession && window.labGramSession.step === 1) {
                window.labGramSession.step = 2;
                window.renderMyLabUI();
            }
        }, 700);
    }
};

window.stopBilasAlkoholGram = function() {
    let s = window.labGramSession;
    if (!s || !s.alcoholDipping) return;
    window.hentikanTimerLabTambahan();
    s.alcoholDipping = false;

    if (s.alcoholVal >= 95) {
        window.prosesKesalahanLab("fatal", "<b>OVER-DECOLORIZED TOTAL!</b> Alkohol dibiarkan terlalu lama hingga melunturkan seluruh dinding sel bakteri dan merusak preparat permanen.");
        return;
    }
    if (s.alcoholVal > 77) {
        s.mistakes++;
        window.prosesKesalahanLab("rollback", "⚠️ Pembilasan alkohol terlalu lama (" + Math.round(s.alcoholVal) + "%) sehingga pewarna utama ikut luntur! Ulangi pewarnaan dari Kristal Violet.", function() {
            s.stainStep = 0;
            s.alcoholVal = 0;
            window.renderMyLabUI();
        });
        return;
    }
    if (s.alcoholVal < 45) {
        s.mistakes++;
        s.alcoholVal = 0;
        window.prosesKesalahanLab("minor", "⚠️ Pembilasan alkohol terlalu singkat! Ulangi tetesan alkohol sampai zona optimal.");
        window.renderMyLabUI();
        return;
    }

    s.stainStep = 3;
    s.alcoholVal = 0;
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Dekolorisasi tepat! Lanjut reagen pewarna tandingan.", "ok");
};

// 5. UJI MAKANAN: Panaskan Lugol/Biuret -> Rollback Buat Ekstrak Baru
window.aksiPanaskanTabungMakanan = function(tubeKey) {
    let s = window.labFoodSession;
    if (!s || s.step !== 2) return;
    if (tubeKey === "benedict") {
        if (!s.tests.benedictDrop) return window.tampilkanToastLab("👆 Teteskan Benedict terlebih dahulu!", "err");
        s.tests.benedictHeat = true;
        window.renderMyLabUI();
        window.tampilkanToastLab("🔥 Tabung Benedict dipanaskan! Amati warna akhirnya.", "ok");
        return;
    }
    s.mistakes++;
    window.prosesKesalahanLab("rollback", "⚠️ Tabung " + tubeKey.toUpperCase() + " rusak akibat dipanaskan di api (kompleks reaksi terurai)! Mundur ke Tahap 1 untuk membuat ekstrak makanan baru.", function() {
        s.step = 1;
        s.grindPct = 0;
        s.waterAdded = false;
        s.tests = { lugol: false, biuret: false, benedictDrop: false, benedictHeat: false, paper: false };
        window.renderMyLabUI();
    });
};

// 6. FERMENTASI: Salah inokulasi mikroba pada substrat steril -> Rollback Pasteurisasi Ulang
window.pilihMikrobaFermLab = function(pickedId) {
    let st = window.labFermSession;
    if (!st) return;
    if (pickedId !== st.recipeId) {
        if (st.prepped) {
            window.prosesKesalahanLab("rollback", "⚠️ Substrat steril terkontaminasi mikroorganisme yang salah! Wajib pasteurisasi/kukus ulang substrat baru.", function() {
                st.prepped = false;
                st.microbeOk = false;
                window.renderMyLabUI();
            });
        } else {
            window.prosesKesalahanLab("minor", "⚠️ Mikroorganisme tidak cocok untuk produk ini! Cek tabel di ❓ Referensi.");
        }
        return;
    }
    st.microbeOk = true;
    window.renderMyLabUI();
    window.tampilkanToastLab("✅ Mikroba tepat diinokulasi! Atur suhu inkubator ke zona optimum.", "ok");
};

// --- HOOK TERPADU: BRIEFING + TAHAP 0 + AUTO-DEDUCT NYAWA UNTUK SEMUA KESALAHAN KECIL ---
(function pasangHookPraktikumNyataV3() {
    // 1. Hook mulaiPraktikumLab agar selalu masuk Briefing -> Tahap 0 Pilih Alat/Bahan
    if (typeof window.mulaiPraktikumLab === "function" && !window.mulaiPraktikumLab._flowHookedV3) {
        window._origMulaiPraktikumLabCore = window.mulaiPraktikumLab;
        window.mulaiPraktikumLab = function(expId) {
            window.hentikanTimerKulturJaringan();
            window.hentikanTimerDnaLab();
            window.hentikanTimerLabTambahan();
            window.tutupPanduanLab();
            window.tutupProsedurPraktikumLab();
            window.tutupOverlayGagalLab();

            window.labFlowState = {
                active: true,
                expId: expId,
                phase: "briefing",
                lives: 5,
                maxLives: 5,
                pickedTools: [],
                rackItems: [],
                failReason: "",
                failType: ""
            };
            window.activeLabView = expId;
            window.renderMyLabUI();
        };
        window.mulaiPraktikumLab._flowHookedV3 = true;
    }

    // 2. Hook renderMyLabUI untuk menampilkan Briefing / Tahap 0 & menyinkronkan HUD Nyawa
    if (typeof window.renderMyLabUI === "function" && !window.renderMyLabUI._flowRenderHookedV3) {
        let prevRender = window.renderMyLabUI;
        window.renderMyLabUI = function() {
            let f = window.labFlowState;
            let body = document.getElementById("mylab-main-body");

            if (f && f.active && window.activeLabView === f.expId && (f.phase === "briefing" || f.phase === "setup_tools") && body) {
                window.perbaruiSaldoHUDLab();
                let btnLobby = document.getElementById("btn-lab-lobby");
                if (btnLobby) btnLobby.classList.remove("active");
                window.perbaruiHUDNyawaDanProsedurLab();

                if (f.phase === "briefing") window.renderLayarBriefingLab(body);
                else window.renderTahap0AlatBahanLab(body);
                return;
            }

            prevRender.apply(this, arguments);
            window.perbaruiHUDNyawaDanProsedurLab();
        };
        window.renderMyLabUI._flowRenderHookedV3 = true;
    }

    // 3. Hook tampilkanToastLab agar seluruh kesalahan kecil ("⚠️" / "❌") di semua praktikum otomatis mengurangi nyawa (-1 ❤️)
    if (typeof window.tampilkanToastLab === "function" && !window.tampilkanToastLab._lifeHookedV3) {
        let origToast = window.tampilkanToastLab;
        window.tampilkanToastLab = function(pesan, tipe) {
            if (window._labSkipNextToastLife) {
                window._labSkipNextToastLife = false;
                origToast(pesan, tipe);
                return;
            }
            let f = window.labFlowState;
            let teks = String(pesan || "");
            let isInputReminder = teks.indexOf("👆") === 0 || teks.indexOf("Masukkan ketiga") !== -1 || teks.indexOf("Masukkan seluruh") !== -1 || teks.indexOf("Selesaikan ketiga") !== -1 || teks.indexOf("Coin belum cukup") !== -1;

            if (tipe === "err" && f && f.active && (f.phase === "running" || f.phase === "setup_tools") && !isInputReminder) {
                f.lives = Math.max(0, (Number(f.lives) || 0) - 1);
                window.perbaruiHUDNyawaDanProsedurLab();
                if (f.lives <= 0) {
                    window.tampilkanLayarGagalTotalLab(false, "Kesalahan ke-5: " + teks);
                    return;
                }
                origToast(teks + " (Sisa Nyawa: " + f.lives + "/" + f.maxLives + " ❤️)", "err");
                return;
            }
            origToast(pesan, tipe);
        };
        window.tampilkanToastLab._lifeHookedV3 = true;
    }

    // 4. Hook tutupModalMyLab & kembaliKeLobiLab agar mereset flow state & menutup semua overlay
    if (typeof window.kembaliKeLobiLab === "function" && !window.kembaliKeLobiLab._flowCloseV3) {
        let origKembali = window.kembaliKeLobiLab;
        window.kembaliKeLobiLab = function() {
            window.labFlowState.active = false;
            window.labFlowState.phase = "idle";
            window.tutupProsedurPraktikumLab();
            window.tutupOverlayGagalLab();
            window.tutupPanduanLab();
            origKembali.apply(this, arguments);
        };
        window.kembaliKeLobiLab._flowCloseV3 = true;
    }

    if (typeof window.tutupModalMyLab === "function" && !window.tutupModalMyLab._flowCloseV3) {
        let origTutup = window.tutupModalMyLab;
        window.tutupModalMyLab = function() {
            window.labFlowState.active = false;
            window.labFlowState.phase = "idle";
            window.tutupProsedurPraktikumLab();
            window.tutupOverlayGagalLab();
            origTutup.apply(this, arguments);
        };
        window.tutupModalMyLab._flowCloseV3 = true;
    }
})();
// =========================================================================
// 17. MEJA KERJA TERPISAH + RAK REAGEN/ALAT DRAG-AND-DROP (ANTI AUTO-SELECT)
//     Diterapkan ke: Golongan Darah, Uji Makanan, Gram, Kultur Jaringan,
//                    Rekombinasi DNA, & Transpor Membran
// =========================================================================
window._labToolDnd = { active: false, scope: "", itemId: "", label: "", ghostEl: null, startX: 0, startY: 0, moved: false };
window._labPickedRackItem = { scope: "", itemId: "" };
window._labToolJustDraggedAt = 0;

window.pilihAlatRakLab = function(scope, itemId) {
    if (Date.now() - (window._labToolJustDraggedAt || 0) < 250) return;
    let cur = window._labPickedRackItem;
    if (cur.scope === scope && cur.itemId === itemId) {
        window._labPickedRackItem = { scope: "", itemId: "" };
    } else {
        window._labPickedRackItem = { scope: scope, itemId: itemId };
    }
    window.renderMyLabUI();
};

window.klikTargetDropLab = function(scope, targetId) {
    let cur = window._labPickedRackItem;
    if (!cur || cur.scope !== scope || !cur.itemId) {
        window.tampilkanToastLab("👆 Seret (Drag) atau pilih alat/reagen dari Rak Wadah Terpisah terlebih dahulu!", "");
        return;
    }
    window.prosesDropAlatKeTargetLab(scope, cur.itemId, targetId);
};

window.mulaiDragAlatLab = function(e, scope, itemId, label) {
    if (e.button !== undefined && e.button !== 0) return;
    window._labToolDnd = {
        active: true,
        scope: scope,
        itemId: itemId,
        label: label || itemId,
        ghostEl: null,
        startX: e.clientX,
        startY: e.clientY,
        moved: false
    };
};

document.addEventListener("pointermove", function(e) {
    let dnd = window._labToolDnd;
    if (!dnd || !dnd.active) return;

    if (!dnd.moved && Math.hypot(e.clientX - dnd.startX, e.clientY - dnd.startY) < 6) return;

    if (!dnd.moved) {
        dnd.moved = true;
        let ghost = document.createElement("div");
        ghost.className = "lab-dnd-ghost" + (document.body.classList.contains("world-force-rotated") ? " is-rot90" : "");
        ghost.innerText = dnd.label;
        document.body.appendChild(ghost);
        dnd.ghostEl = ghost;
    }

    e.preventDefault();
    if (dnd.ghostEl) {
        dnd.ghostEl.style.left = e.clientX + "px";
        dnd.ghostEl.style.top = e.clientY + "px";
    }

    document.querySelectorAll(".lab-drop-target.is-lab-drag-over").forEach(function(el) {
        el.classList.remove("is-lab-drag-over");
    });
    let under = document.elementFromPoint(e.clientX, e.clientY);
    let target = (under && under.closest) ? under.closest('.lab-drop-target[data-lab-drop-scope="' + dnd.scope + '"]') : null;
    if (target) target.classList.add("is-lab-drag-over");
}, { passive: false });

document.addEventListener("pointerup", function(e) {
    let dnd = window._labToolDnd;
    if (!dnd || !dnd.active) return;

    document.querySelectorAll(".lab-drop-target.is-lab-drag-over").forEach(function(el) {
        el.classList.remove("is-lab-drag-over");
    });
    if (dnd.ghostEl && dnd.ghostEl.parentNode) dnd.ghostEl.parentNode.removeChild(dnd.ghostEl);

    let wasMoved = dnd.moved;
    let scope = dnd.scope;
    let itemId = dnd.itemId;
    window._labToolDnd = { active: false, scope: "", itemId: "", label: "", ghostEl: null, startX: 0, startY: 0, moved: false };

    if (wasMoved) {
        window._labToolJustDraggedAt = Date.now();
        let under = document.elementFromPoint(e.clientX, e.clientY);
        let target = (under && under.closest) ? under.closest('.lab-drop-target[data-lab-drop-scope="' + scope + '"]') : null;
        if (target) {
            let targetId = target.getAttribute("data-lab-drop-target");
            window.prosesDropAlatKeTargetLab(scope, itemId, targetId);
        }
    }
});

document.addEventListener("pointercancel", function() {
    let dnd = window._labToolDnd;
    if (dnd && dnd.ghostEl && dnd.ghostEl.parentNode) dnd.ghostEl.parentNode.removeChild(dnd.ghostEl);
    window._labToolDnd = { active: false, scope: "", itemId: "", label: "", ghostEl: null, startX: 0, startY: 0, moved: false };
});

// Helper: Rakit Satu Kartu Item di Rak Wadah Terpisah
window.bangunHTMLItemRakLab = function(scope, id, ikon, nama, isDone, accentCol) {
    let sel = window._labPickedRackItem;
    let isPicked = (!isDone && sel && sel.scope === scope && sel.itemId === id);
    let safeLbl = (ikon + " " + nama).replace(/'/g, "\\'");
    let stBorder = accentCol ? (' style="border-top:4px solid ' + accentCol + ';"') : '';

    return '<div class="lab-dnd-item' + (isPicked ? ' is-selected' : '') + (isDone ? ' is-done' : '') + '"' + stBorder +
        (isDone ? '' : (' onpointerdown="window.mulaiDragAlatLab(event, \'' + scope + '\', \'' + id + '\', \'' + safeLbl + '\')" onclick="window.pilihAlatRakLab(\'' + scope + '\', \'' + id + '\')"')) + '>' +
        '<span class="lab-dnd-ico">' + ikon + '</span>' +
        '<b class="lab-dnd-name">' + nama + '</b>' +
        '<small class="lab-dnd-hint">' + (isDone ? '✓ Terpakai' : (isPicked ? 'Aktif — Ketuk Target' : 'Seret / Pilih')) + '</small>' +
    '</div>';
};

// =========================================================================
// DISPATCHER DROP UNIVERSAL (6 PRAKTIKUM)
// =========================================================================
window.prosesDropAlatKeTargetLab = function(scope, itemId, targetId) {
    // Selalu kosongkan pilihan setelah 1 tindakan agar TIDAK auto-select
    window._labPickedRackItem = { scope: "", itemId: "" };

    // 1A. TES GOLONGAN DARAH — TAHAP 1 (TETES DARAH)
    if (scope === "blood_step1") {
        let s = window.labBloodSession;
        if (!s || s.step !== 1 || !s.wells[targetId]) return;
        if (s.wells[targetId].blood) return;
        if (itemId !== "pipet_darah") {
            s.mistakes++;
            window.prosesKesalahanLab("minor", "⚠️ Salah bahan! Yang harus diteteskan pada Tahap 1 adalah Pipet Sampel Darah Pasien.");
            window.renderMyLabUI();
            return;
        }
        window.aksiTetesDarahSumur(targetId);
        return;
    }

    // 1B. TES GOLONGAN DARAH — TAHAP 2 (TETES SERUM)
    if (scope === "blood_step2") {
        let s = window.labBloodSession;
        if (!s || s.step !== 2 || !s.wells[targetId]) return;
        if (s.wells[targetId].reagent) return;

        let isValidBottle = (itemId === "antiA" || itemId === "antiB" || itemId === "antiAB" || itemId === "antiD");
        if (!isValidBottle || itemId !== targetId) {
            s.mistakes++;
            window.prosesKesalahanLab("rollback", "⚠️ Kaca objek tercemar reagen yang keliru! Ganti kaca objek baru & ulang dari Tahap 1 (tetes darah).", function() {
                s.step = 1;
                s.selectedReagent = "";
                Object.keys(s.wells).forEach(function(k) {
                    s.wells[k].blood = false;
                    s.wells[k].reagent = false;
                    s.wells[k].stirPct = 0;
                    s.wells[k].done = false;
                });
                window.renderMyLabUI();
            });
            return;
        }

        s.wells[targetId].reagent = true;
        s.selectedReagent = ""; // Nol auto-select!
        let semuaTetes = Object.values(s.wells).every(function(w) { return w.reagent; });
        window.renderMyLabUI();
        if (semuaTetes) {
            window.tampilkanToastLab("✅ Keempat serum tepat diteteskan! Lanjut Pengadukan Aseptis!", "ok");
            setTimeout(function() {
                if (window.labBloodSession && window.labBloodSession.step === 2) {
                    window.labBloodSession.step = 3;
                    window.labBloodSession.stickState = "clean";
                    window.labBloodSession.stickUsedWell = "";
                    window.renderMyLabUI();
                }
            }, 700);
        }
        return;
    }

    // 2. UJI KANDUNGAN ZAT MAKANAN — TAHAP 2 (4 WADAH NETRAL + BUNSEN)
    if (scope === "food_step2") {
        let s = window.labFoodSession;
        if (!s || s.step !== 2) return;

        if (itemId === "bunsen") {
            if (targetId === "glukosa") {
                if (!s.tests.benedictDrop) {
                    window.prosesKesalahanLab("minor", "⚠️ Teteskan reagen uji glukosa ke tabung ini terlebih dahulu sebelum dipanaskan!");
                    window.renderMyLabUI();
                    return;
                }
                s.tests.benedictHeat = true;
                window.renderMyLabUI();
                window.tampilkanToastLab("🔥 Tabung Uji Glukosa dipanaskan! Amati perubahan warna akhirnya.", "ok");
            } else {
                s.mistakes++;
                window.prosesKesalahanLab("rollback", "⚠️ Wadah uji ini TIDAK boleh dipanaskan di api Bunsen! Ekstrak rusak — mundur ke Tahap 1 untuk membuat ekstrak baru.", function() {
                    s.step = 1;
                    s.grindPct = 0;
                    s.waterAdded = false;
                    s.tests = { lugol: false, biuret: false, benedictDrop: false, benedictHeat: false, paper: false };
                    window.renderMyLabUI();
                });
            }
            return;
        }

        let matchMap = { amilum: "lugol", protein: "biuret", glukosa: "benedict", lemak: "paper" };
        if (matchMap[targetId] !== itemId) {
            s.mistakes++;
            window.prosesKesalahanLab("minor", "⚠️ Reagen/media tidak sesuai untuk wadah uji tersebut! Cek tabel indikator di ❓ Referensi.");
            window.renderMyLabUI();
            return;
        }

        if (targetId === "amilum") s.tests.lugol = true;
        else if (targetId === "protein") s.tests.biuret = true;
        else if (targetId === "glukosa") s.tests.benedictDrop = true;
        else if (targetId === "lemak") s.tests.paper = true;

        window.renderMyLabUI();
        window.tampilkanToastLab("💧 Uji diterapkan! Perhatikan apakah ada perlakuan tambahan (seperti pemanasan).", "ok");
        return;
    }

    // 3A. PEWARNAAN GRAM — TAHAP 1 (PREPARASI APUSAN)
    if (scope === "gram_step1") {
        let s = window.labGramSession;
        if (!s || s.step !== 1) return;
        if (itemId !== "smear" && itemId !== "dry" && itemId !== "fix") {
            s.mistakes++;
            window.prosesKesalahanLab("minor", "⚠️ Alat/reagen ini bukan untuk tahap preparasi apusan bakteri!");
            window.renderMyLabUI();
            return;
        }
        window.aksiPrepGramLab(itemId);
        return;
    }

    // 3B. PEWARNAAN GRAM — TAHAP 2 (4 REAGEN BERURUTAN + PENGECOH)
    if (scope === "gram_step2") {
        let s = window.labGramSession;
        if (!s || s.step !== 2) return;
        let idxMap = { violet: 0, iodin: 1, alkohol: 2, safranin: 3 };
        if (idxMap[itemId] === undefined) {
            s.mistakes++;
            window.prosesKesalahanLab("minor", "⚠️ Reagen ini bukan bagian dari pewarnaan Gram! Cek ❓ Referensi.");
            window.renderMyLabUI();
            return;
        }
        window.klikReagenGramLab(idxMap[itemId]);
        return;
    }

    // 4. KULTUR JARINGAN — TAHAP 3 (RACIK MEDIA MS KE LABU ERLENMEYER)
    if (scope === "tc_step3") {
        let s = window.labTissueSession;
        if (!s || s.step !== 3) return;
        if (itemId !== "ms" && itemId !== "sukrosa" && itemId !== "agar") {
            s.mistakes++;
            window.prosesKesalahanLab("rollback", "⚠️ Bahan kimia beracun/keliru masuk ke Labu Erlenmeyer! Media MS tercemar dan wajib dicuci ulang dari kosong.", function() {
                s.ingredients = { ms: false, sukrosa: false, agar: false };
                window.renderMyLabUI();
            });
            return;
        }
        s.ingredients[itemId] = true;
        window.renderMyLabUI();
        window.tampilkanToastLab("🧪 Bahan dasar Media MS berhasil ditambahkan ke Labu Erlenmeyer!", "ok");
        return;
    }

    // 5. REKOMBINASI DNA — TAHAP 2 (DRAG ENZIM RESTRIKSI KE SEGMEN DNA/PLASMID)
    if (scope === "dna_step2") {
        let s = window.labDnaSession;
        if (!s || s.step !== 2) return;
        if (itemId === "ligase_decoy" || itemId === "amilase_decoy") {
            s.mistakes++;
            window.prosesKesalahanLab("minor", "⚠️ Enzim ini bukan enzim pemotong (restriksi endonuklease)! Cek ❓ Referensi.");
            window.renderMyLabUI();
            return;
        }
        s.pickedEnzymeId = itemId;
        let isValidSeg = (targetId === "insulinLeft" || targetId === "insulinRight" || targetId === "plasmidSite");
        window.aksiPotongSitusDna(targetId, isValidSeg);
        s.pickedEnzymeId = ""; // Reset setelah 1 aksi pemotongan
        return;
    }

    // 6. TRANSPOR MEMBRAN — TAHAP 1 (PREPARAT KE KACA OBJEK)
    if (scope === "mem_step1") {
        let s = window.labMembraneSession;
        if (!s || s.step !== 1) return;
        if (itemId === "bunsen_decoy" || itemId === "biuret_decoy") {
            s.mistakes++;
            window.prosesKesalahanLab("minor", "⚠️ Bahan/alat ini merusak sel hidup pada preparat basah! Hanya sampel sel & kaca penutup yang diperlukan.");
            window.renderMyLabUI();
            return;
        }
        if (itemId === "cover" && !s.prepPlaced) {
            window.prosesKesalahanLab("minor", "⚠️ Letakkan sampel sel ke kaca objek terlebih dahulu sebelum menutup dengan Cover Slip!");
            window.renderMyLabUI();
            return;
        }
        window.aksiSiapkanPreparatMembran(itemId);
    }
};

// =========================================================================
// OVERRIDE TAMPILAN 6 PRAKTIKUM DENGAN WADAH RAK TERPISAH (NO CHEAT LAYOUT)
// =========================================================================

// 1. TES GOLONGAN DARAH: LABEL SUMUR NETRAL + WADAH RAK TERPISAH + TANPA AUTO-SELECT
window.bangunHTMLSumurDarah = function(wellKey, reagentCfg, wellState, mode, extraAttr) {
    let innerDrop = '';
    if (wellState.blood) {
        let isAggl = wellState.done && wellState.agglutinated;
        let isSmooth = wellState.done && !wellState.agglutinated;
        let reagentTint = wellState.reagent ? ('<div class="lab-reagent-ring" style="border-color:' + reagentCfg.dropCol + ';"></div>') : '';
        let clumpHtml = isAggl
            ? '<div class="lab-aggl-clumps">' +
                  '<span style="left:22%; top:24%; width:11px; height:9px;"></span>' +
                  '<span style="left:54%; top:20%; width:13px; height:10px;"></span>' +
                  '<span style="left:36%; top:48%; width:14px; height:11px;"></span>' +
                  '<span style="left:66%; top:54%; width:11px; height:10px;"></span>' +
                  '<span style="left:24%; top:66%; width:10px; height:8px;"></span>' +
                  '<span style="left:50%; top:72%; width:12px; height:9px;"></span>' +
                  '<span style="left:70%; top:34%; width:8px; height:8px;"></span>' +
              '</div>'
            : '';
        let dropClass = 'lab-blood-pool' + (isAggl ? ' is-clumped' : (isSmooth ? ' is-smooth' : ''));
        innerDrop = '<div class="' + dropClass + '">' + reagentTint + clumpHtml + '</div>';
    }

    let stirRing = (mode === "stir" && !wellState.done)
        ? '<div class="lab-stir-pct" id="lab-stir-pct-' + wellKey + '">' + Math.round(wellState.stirPct) + '%</div>'
        : (wellState.done && mode === "stir" ? '<div class="lab-stir-done">✓</div>' : '');

    let isDropMode = (mode === "blood" || mode === "reagent");
    let dropCls = isDropMode ? ' lab-drop-target' : '';
    let dropData = isDropMode ? (' data-lab-drop-scope="blood_step' + (mode === "blood" ? '1' : '2') + '" data-lab-drop-target="' + wellKey + '"') : '';

    return (
        '<div class="lab-well-slot' + dropCls + '"' + dropData + (extraAttr || '') + '>' +
            '<div class="lab-well-label is-neutral-well">' + reagentCfg.label + '</div>' +
            '<div class="lab-well-circle" id="lab-well-circle-' + wellKey + '">' + innerDrop + stirRing + '</div>' +
        '</div>'
    );
};

const _origRenderBloodV3 = window.renderBloodTestStage;
window.renderBloodTestStage = function(bodyEl) {
    let s = window.labBloodSession;
    if (!s) return;

    if (s.step === 1 || s.step === 2) {
        if (s.step === 2 && !s._v4NoAutoSel) {
            s.selectedReagent = "";
            s._v4NoAutoSel = true;
        }
        let stepNames = ["1. Tetes Darah", "2. Tetes Serum", "3. Aduk Aseptis", "4. Diagnosis"];
        let stepperHtml = '<div class="lab-stepper-bar">';
        stepNames.forEach(function(nm, idx) {
            let num = idx + 1;
            let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
            stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
        });
        stepperHtml += '<span class="lab-patient-tag">🧑‍⚕️ ' + s.patientName + '</span></div>';

        let modeStr = (s.step === 1) ? "blood" : "reagent";
        let scopeStr = (s.step === 1) ? "blood_step1" : "blood_step2";
        let doneCount = Object.values(s.wells).filter(function(w) { return s.step === 1 ? w.blood : w.reagent; }).length;

        let wellsHtml = window.MY_LAB_CATALOG.reagents.map(function(r) {
            return window.bangunHTMLSumurDarah(r.key, r, s.wells[r.key], modeStr, ' onclick="window.klikTargetDropLab(\'' + scopeStr + '\', \'' + r.key + '\')"');
        }).join('');

        let rackHtml = '';
        if (s.step === 1) {
            let items1 = window.urutanAcakStabilLab(s, "bloodStep1Rack", [
                { id: "pipet_darah", ikon: "💉", nama: "Pipet Darah Pasien", col: "#dc2626" },
                { id: "akuades_dc",  ikon: "💧", nama: "Pipet Akuades",      col: "#0284c7" },
                { id: "alkohol_dc",  ikon: "🧴", nama: "Alkohol 70%",        col: "#64748b" },
                { id: "lugol_dc",    ikon: "🧪", nama: "Larutan Lugol",      col: "#b45309" }
            ]);
            rackHtml = items1.map(function(it) {
                return window.bangunHTMLItemRakLab("blood_step1", it.id, it.ikon, it.nama, false, it.col);
            }).join('');
        } else {
            let items2 = window.urutanAcakStabilLab(s, "bloodStep2Rack", [
                { id: "antiA",      ikon: "🧪", nama: "Anti-A",          col: "#2563eb" },
                { id: "antiB",      ikon: "🧪", nama: "Anti-B",          col: "#d97706" },
                { id: "antiAB",     ikon: "🧪", nama: "Anti-AB",         col: "#059669" },
                { id: "antiD",      ikon: "🧪", nama: "Anti-D",          col: "#64748b" },
                { id: "lugol_dc2",  ikon: "🧪", nama: "Larutan Lugol",   col: "#92400e" },
                { id: "akuades_dc2",ikon: "💧", nama: "Akuades Steril",  col: "#0284c7" }
            ]);
            rackHtml = items2.map(function(it) {
                let isUsed = Boolean(s.wells[it.id] && s.wells[it.id].reagent);
                return window.bangunHTMLItemRakLab("blood_step2", it.id, it.ikon, it.nama, isUsed, it.col);
            }).join('');
        }

        bodyEl.innerHTML =
            '<div class="lab-stage-wrap">' +
                '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
                stepperHtml +
                '<div class="lab-instruction-banner">' +
                    '<strong>' + (s.step === 1 ? '🩸 Tahap 1: Teteskan Sampel Darah (' + doneCount + '/4)' : '💧 Tahap 2: Teteskan Serum Reagen (' + doneCount + '/4)') + '</strong>' +
                    '<span>Seret (Drag &amp; Drop) atau pilih wadah yang tepat dari <b>Rak Bahan Terpisah</b> ke masing-masing sumur kaca objek!</span>' +
                '</div>' +
                '<div class="lab-split-bench">' +
                    '<div class="lab-work-area">' +
                        '<div class="lab-area-badge">🔬 Meja Kaca Objek (Drop Zone)</div>' +
                        '<div class="lab-glass-slide" style="margin-bottom:0;">' + wellsHtml + '</div>' +
                    '</div>' +
                    '<div class="lab-rack-dock">' +
                        '<div class="lab-area-badge is-rack">🗄️ Rak Wadah &amp; Botol Reagen (Teracak + Pengecoh)</div>' +
                        '<div class="lab-rack-items-grid">' + rackHtml + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        return;
    }

    _origRenderBloodV3(bodyEl);
};

// 2. UJI KANDUNGAN ZAT MAKANAN — TAHAP 2: 4 WADAH NETRAL + RAK REAGEN & BUNSEN TERPISAH
const _origRenderFoodV3 = window.renderFoodTestStage;
window.renderFoodTestStage = function(bodyEl) {
    let s = window.labFoodSession;
    if (!s || s.step !== 2) return _origRenderFoodV3(bodyEl);

    let sp = s.sample, t = s.tests;
    let colLugol = !t.lugol ? "#f1f5f9" : (sp.amilum ? "#1e1b4b" : "#b45309");
    let colBiuret = !t.biuret ? "#f1f5f9" : (sp.protein ? "#7e22ce" : "#38bdf8");
    let colBen = !t.benedictDrop ? "#f1f5f9" : (!t.benedictHeat ? "#0ea5e9" : (sp.glukosa ? "#c2410c" : "#0284c7"));
    let semuaDiuji = t.lugol && t.biuret && t.benedictDrop && t.paper;

    let stepperHtml = '<div class="lab-stepper-bar"><span class="lab-step-pill done">✓ 1. Ekstrak</span><span class="lab-step-pill active">2. Uji Reagen</span><span class="lab-step-pill">3. Diagnosis</span><span class="lab-step-pill">4. Hasil</span><span class="lab-patient-tag">' + sp.ikon + ' ' + sp.nama + '</span></div>';

    let rackItems = window.urutanAcakStabilLab(s, "foodStep2Rack", [
        { id: "lugol",      ikon: "💧", nama: "Larutan Lugol",   col: "#b45309" },
        { id: "biuret",     ikon: "💧", nama: "Reagen Biuret",   col: "#7e22ce" },
        { id: "benedict",   ikon: "💧", nama: "Reagen Benedict", col: "#0284c7" },
        { id: "paper",      ikon: "📄", nama: "Kertas Buram",    col: "#8c6d53" },
        { id: "bunsen",     ikon: "🔥", nama: "Pembakar Bunsen", col: "#ea580c" },
        { id: "alkohol_dc", ikon: "🧴", nama: "Alkohol 96%",     col: "#64748b" },
        { id: "seruma_dc",  ikon: "🧪", nama: "Serum Anti-A",    col: "#2563eb" }
    ]);

    let rackHtml = rackItems.map(function(it) {
        let done = (it.id === "lugol" && t.lugol) || (it.id === "biuret" && t.biuret) || (it.id === "benedict" && t.benedictDrop) || (it.id === "paper" && t.paper) || (it.id === "bunsen" && t.benedictHeat);
        return window.bangunHTMLItemRakLab("food_step2", it.id, it.ikon, it.nama, done, it.col);
    }).join('');

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            stepperHtml +
            '<div class="lab-instruction-banner">' +
                '<strong>🧪 Tahap 2: Seret Reagen &amp; Alat ke Wadah Uji yang Tepat</strong>' +
                '<span>Tentukan sendiri reagen mana untuk masing-masing wadah uji (Amilum, Protein, Glukosa, Lemak) dan tabung mana yang wajib dipanaskan!</span>' +
            '</div>' +
            '<div class="lab-split-bench">' +
                '<div class="lab-work-area">' +
                    '<div class="lab-area-badge">🔬 Meja Tabung Uji (Drop Zone)</div>' +
                    '<div class="food-tubes-grid">' +
                        '<div class="food-test-card lab-drop-target" data-lab-drop-scope="food_step2" data-lab-drop-target="amilum" onclick="window.klikTargetDropLab(\'food_step2\', \'amilum\')">' +
                            '<div class="food-tube-title">Wadah 1: Uji Amilum</div>' +
                            '<div class="food-tube-glass"><div class="food-tube-liquid" style="background:' + colLugol + ';"></div></div>' +
                            '<small class="lab-drop-sub">' + (t.lugol ? '✓ Reagen Masuk' : 'Drop Reagen') + '</small>' +
                        '</div>' +
                        '<div class="food-test-card lab-drop-target" data-lab-drop-scope="food_step2" data-lab-drop-target="protein" onclick="window.klikTargetDropLab(\'food_step2\', \'protein\')">' +
                            '<div class="food-tube-title">Wadah 2: Uji Protein</div>' +
                            '<div class="food-tube-glass"><div class="food-tube-liquid" style="background:' + colBiuret + ';"></div></div>' +
                            '<small class="lab-drop-sub">' + (t.biuret ? '✓ Reagen Masuk' : 'Drop Reagen') + '</small>' +
                        '</div>' +
                        '<div class="food-test-card lab-drop-target" data-lab-drop-scope="food_step2" data-lab-drop-target="glukosa" onclick="window.klikTargetDropLab(\'food_step2\', \'glukosa\')">' +
                            '<div class="food-tube-title">Wadah 3: Uji Glukosa</div>' +
                            '<div class="food-tube-glass"><div class="food-tube-liquid" style="background:' + colBen + ';"></div>' + (t.benedictHeat ? '<span class="food-flame-mark">🔥</span>' : '') + '</div>' +
                            '<small class="lab-drop-sub">' + (t.benedictHeat ? '✓ Dipanaskan' : (t.benedictDrop ? 'Reagen Masuk' : 'Drop Reagen')) + '</small>' +
                        '</div>' +
                        '<div class="food-test-card lab-drop-target" data-lab-drop-scope="food_step2" data-lab-drop-target="lemak" onclick="window.klikTargetDropLab(\'food_step2\', \'lemak\')">' +
                            '<div class="food-tube-title">Wadah 4: Uji Lemak</div>' +
                            '<div class="food-paper-box' + (t.paper && sp.lemak ? ' is-greasy' : '') + '">' + (t.paper ? (sp.lemak ? '✨ Transparan' : '📄 Kering') : 'Drop Media') + '</div>' +
                            '<small class="lab-drop-sub">' + (t.paper ? '✓ Diuji' : 'Drop Media Uji') + '</small>' +
                        '</div>' +
                    '</div>' +
                    (semuaDiuji ? '<button type="button" class="mypet-green-cta sm" style="margin-top:10px;" onclick="window.lanjutDiagnosisMakanan()">📋 Lanjut Diagnosis Kandungan Gizi ➔</button>' : '') +
                '</div>' +
                '<div class="lab-rack-dock">' +
                    '<div class="lab-area-badge is-rack">🗄️ Rak Reagen &amp; Alat (Teracak + Pengecoh)</div>' +
                    '<div class="lab-rack-items-grid">' + rackHtml + '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
};

// 3. PEWARNAAN GRAM — TAHAP 1 & 2: KACA OBJEK DROP ZONE + RAK BOTOL TERPISAH
const _origRenderGramV3 = window.renderGramStainStage;
window.renderGramStainStage = function(bodyEl) {
    let s = window.labGramSession;
    if (!s || (s.step !== 1 && s.step !== 2)) return _origRenderGramV3(bodyEl);

    let bac = s.bacteria;
    let stepNames = ["1. Preparasi", "2. Pewarnaan Gram", "3. Diagnosis", "4. Hasil"];
    let stepperHtml = '<div class="lab-stepper-bar">';
    stepNames.forEach(function(nm, idx) {
        let num = idx + 1;
        let cls = num < s.step ? "done" : (num === s.step ? "active" : "");
        stepperHtml += '<span class="lab-step-pill ' + cls + '">' + (num < s.step ? '✓ ' : '') + nm + '</span>';
    });
    stepperHtml += '<span class="lab-patient-tag">🦠 Bakteri Misteri</span></div>';

    if (s.step === 1) {
        let p = s.prep;
        let rack1 = window.urutanAcakStabilLab(s, "gramRack1", [
            { id: "smear",   ikon: "🧫", nama: "Jarum Ose (Biakan)", col: "#0d9488" },
            { id: "dry",     ikon: "💨", nama: "Pengering Udara",    col: "#0284c7" },
            { id: "fix",     ikon: "🔥", nama: "Api Bunsen Fiksasi", col: "#ea580c" },
            { id: "lug_dc",  ikon: "💧", nama: "Larutan Lugol",      col: "#b45309" },
            { id: "pap_dc",  ikon: "📄", nama: "Kertas Buram",       col: "#8c6d53" }
        ]);
        let rackHtml = rack1.map(function(it) {
            return window.bangunHTMLItemRakLab("gram_step1", it.id, it.ikon, it.nama, Boolean(p[it.id]), it.col);
        }).join('');

        bodyEl.innerHTML =
            '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml +
            '<div class="lab-instruction-banner"><strong>🔥 Tahap 1: Persiapan Apusan Bakteri</strong><span>Seret alat dari Rak ke Kaca Objek sesuai urutan baku preparasi apusan!</span></div>' +
            '<div class="lab-split-bench">' +
                '<div class="lab-work-area">' +
                    '<div class="lab-area-badge">🔬 Meja Kaca Objek (Drop Zone)</div>' +
                    '<div class="lab-prep-bench lab-drop-target" data-lab-drop-scope="gram_step1" data-lab-drop-target="slide" onclick="window.klikTargetDropLab(\'gram_step1\', \'slide\')">' +
                        '<div class="lab-prep-glass">' + (p.smear ? ('<div style="font-size:12px; font-weight:900; color:#0f766e;">' + (p.fix ? '🔥 Apusan Terfiksasi!' : (p.dry ? '💨 Apusan Kering Siap Fiksasi' : '🧫 Apusan Bakteri Basah')) + '</div>') : '<span class="prep-hint-txt">Drop Alat ke Kaca Objek Ini</span>') + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="lab-rack-dock"><div class="lab-area-badge is-rack">🗄️ Rak Alat Preparasi</div><div class="lab-rack-items-grid">' + rackHtml + '</div></div>' +
            '</div></div>';
        return;
    }

    let slideTint = s.stainStep === 0 ? "#e2e8f0" : (s.stainStep === 1 ? "#a855f7" : (s.stainStep === 2 ? "#6b21a8" : (s.stainStep === 3 ? (bac.gram === "Positif" ? "#7e22ce" : "#e2e8f0") : bac.warnaHex)));
    let rack2 = window.urutanAcakStabilLab(s, "gramRack2", [
        { id: "violet",   idx: 0, ikon: "🧪", nama: "Kristal Violet",  col: "#7e22ce" },
        { id: "iodin",    idx: 1, ikon: "🧪", nama: "Larutan Iodin",   col: "#b45309" },
        { id: "alkohol",  idx: 2, ikon: "🧴", nama: "Alkohol 96%",     col: "#0284c7" },
        { id: "safranin", idx: 3, ikon: "🧪", nama: "Safranin",        col: "#e11d48" },
        { id: "ben_dc",   idx: -1,ikon: "💧", nama: "Reagen Benedict", col: "#0ea5e9" },
        { id: "biu_dc",   idx: -1,ikon: "💧", nama: "Reagen Biuret",   col: "#9333ea" }
    ]);
    let rackHtml2 = rack2.map(function(r) {
        let done = (r.idx >= 0 && r.idx < s.stainStep);
        return window.bangunHTMLItemRakLab("gram_step2", r.id, r.ikon, r.nama, done, r.col);
    }).join('');

    let alcoholPanel = s.stainStep === 2 && s.alcoholDipping
        ? '<div class="tc-steril-panel" style="margin-top:8px;"><div class="tc-steril-head"><b>💧 Dekolorisasi Alkohol 96% Berjalan!</b></div><div class="tc-gauge-track"><div class="tc-gauge-green-zone" style="left:45%; width:32%;"></div><div id="gram-alc-fill" class="tc-gauge-fill" style="width:' + Math.round(s.alcoholVal) + '%;"></div><div id="gram-alc-needle" class="tc-gauge-needle" style="left:' + Math.round(s.alcoholVal) + '%;"></div></div><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:12px; font-weight:800;">Durasi: <b id="gram-alc-txt">' + Math.round(s.alcoholVal) + '%</b></span><button type="button" class="mypet-green-cta sm" style="width:auto; padding:8px 18px;" onclick="window.stopBilasAlkoholGram()">🚿 Bilas Air!</button></div></div>'
        : '';

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml +
        '<div class="lab-instruction-banner"><strong>🎨 Tahap 2: Pewarnaan Gram (' + s.stainStep + '/4 Selesai)</strong><span>Seret botol reagen dari Rak ke Kaca Objek sesuai urutan pewarnaan Gram!</span></div>' +
        '<div class="lab-split-bench">' +
            '<div class="lab-work-area">' +
                '<div class="lab-area-badge">🔬 Meja Kaca Objek (Drop Zone)</div>' +
                '<div class="lab-prep-bench lab-drop-target" data-lab-drop-scope="gram_step2" data-lab-drop-target="slide" onclick="window.klikTargetDropLab(\'gram_step2\', \'slide\')">' +
                    '<div class="lab-prep-glass"><div style="width:104px; height:48px; border-radius:24px; background:' + slideTint + '; border:2px solid #94a3b8; transition:background 0.3s;"></div></div>' +
                    '<small class="lab-drop-sub">Seret botol reagen ke kaca objek di atas</small>' +
                '</div>' + alcoholPanel +
            '</div>' +
            '<div class="lab-rack-dock"><div class="lab-area-badge is-rack">🗄️ Rak Botol Reagen (Teracak + Pengecoh)</div><div class="lab-rack-items-grid">' + rackHtml2 + '</div></div>' +
        '</div></div>';
};

// 4. KULTUR JARINGAN — TAHAP 3: LABU ERLENMEYER DROP ZONE + RAK BAHAN KIMIA + PENGECOH
const _origRenderTCV3 = window.renderTissueCultureStage;
window.renderTissueCultureStage = function(bodyEl) {
    let s = window.labTissueSession;
    if (!s || s.step !== 3) return _origRenderTCV3(bodyEl);

    let pCfg = window.cariInfoTanamanTC(s.plantId);
    let a = s.auksin, c = s.sitokinin;
    let semuaBahanAda = s.ingredients.ms && s.ingredients.sukrosa && s.ingredients.agar;
    let jmlMasuk = (s.ingredients.ms ? 1 : 0) + (s.ingredients.sukrosa ? 1 : 0) + (s.ingredients.agar ? 1 : 0);
    let isiPersen = jmlMasuk * 28 + ((a + c) > 0 ? 10 : 0);

    let rackChem = window.urutanAcakStabilLab(s, "tcStep3ChemRack", [
        { id: "ms",      ikon: "🧪", nama: "Garam Mineral MS", col: "#0d9488" },
        { id: "sukrosa", ikon: "🍬", nama: "Sukrosa 3%",       col: "#0284c7" },
        { id: "agar",    ikon: "🍮", nama: "Agar-agar",        col: "#d97706" },
        { id: "alk_dc",  ikon: "🧴", nama: "Alkohol 70%",      col: "#dc2626" },
        { id: "klo_dc",  ikon: "🧪", nama: "Kloroks (NaOCl)",  col: "#b91c1c" },
        { id: "biu_dc",  ikon: "💧", nama: "Reagen Biuret",    col: "#7e22ce" }
    ]);
    let rackHtml = rackChem.map(function(it) {
        return window.bangunHTMLItemRakLab("tc_step3", it.id, it.ikon, it.nama, Boolean(s.ingredients[it.id]), it.col);
    }).join('');

    let stepperHtml = '<div class="lab-stepper-bar"><span class="lab-step-pill done">✓ 1. Eksplan</span><span class="lab-step-pill done">✓ 2. Sterilisasi</span><span class="lab-step-pill active">3. Media MS</span><span class="lab-step-pill">4. Inokulasi</span><span class="lab-step-pill">5. Aklimatisasi</span><span class="lab-patient-tag">' + pCfg.ikon + ' ' + pCfg.nama + '</span></div>';

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml +
        '<div class="lab-instruction-banner"><strong>🧪 Tahap 3: Racik Media MS (' + jmlMasuk + '/3 Bahan) — Misi: ' + s.hormoneGoal.judul + '</strong><span>Seret HANYA bahan penyusun Media MS dari Rak ke Labu Erlenmeyer, lalu atur perbandingan hormon Auksin–Sitokinin!</span></div>' +
        '<div class="tc-media-split">' +
            '<div class="tc-flask-card lab-drop-target" data-lab-drop-scope="tc_step3" data-lab-drop-target="flask" onclick="window.klikTargetDropLab(\'tc_step3\', \'flask\')">' +
                '<div class="lab-area-badge">🔬 Labu Erlenmeyer (Drop Bahan)</div>' +
                '<svg viewBox="0 0 140 160" width="122" height="138">' +
                    '<path d="M52,18 L52,52 L22,132 C19,142 26,150 36,150 L104,150 C114,150 121,142 118,132 L88,52 L88,18 Z" fill="#f8fafc" stroke="#0284c7" stroke-width="3.5" stroke-linejoin="round"/>' +
                    '<clipPath id="tcFlaskClip2"><path d="M55,54 L26,133 C24,140 29,146 36,146 L104,146 C111,146 116,140 114,133 L85,54 Z"/></clipPath>' +
                    '<rect x="18" y="' + (148 - Math.round(isiPersen * 0.85)) + '" width="104" height="95" fill="#fde68a" clip-path="url(#tcFlaskClip2)" style="transition:y 0.25s;"/>' +
                    '<rect x="46" y="12" width="48" height="9" rx="4" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5"/>' +
                '</svg>' +
                '<div class="tc-hormone-preview info">Bahan Masuk: <b>' + jmlMasuk + '/3</b><br>Auksin ' + a + ' : Sitokinin ' + c + '</div>' +
            '</div>' +
            '<div class="lab-controls-card">' +
                '<div class="lab-area-badge is-rack">🗄️ Rak Bahan Kimia (Hati-hati Bahan Beracun!)</div>' +
                '<div class="lab-rack-items-grid" style="grid-template-columns:repeat(3, minmax(0, 1fr));">' + rackHtml + '</div>' +
                '<div class="mic-lens-dual">' +
                    '<div class="lab-knob-group"><div class="lab-knob-head"><span>🌱 Auksin</span><b>' + a + ' ppm</b></div><div class="lab-slider-row"><button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'auksin\', -1)">−</button><input type="range" min="0" max="10" step="1" value="' + a + '" oninput="window.aturHormonMediaLab(\'auksin\', this.value)"><button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'auksin\', 1)">+</button></div></div>' +
                    '<div class="lab-knob-group"><div class="lab-knob-head"><span>🌿 Sitokinin</span><b>' + c + ' ppm</b></div><div class="lab-slider-row"><button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'sitokinin\', -1)">−</button><input type="range" min="0" max="10" step="1" value="' + c + '" oninput="window.aturHormonMediaLab(\'sitokinin\', this.value)"><button type="button" class="lab-step-btn" onclick="window.ubahHormonMediaLab(\'sitokinin\', 1)">+</button></div></div>' +
                '</div>' +
                '<button type="button" class="' + (semuaBahanAda ? 'mypet-green-cta sm' : 'mypet-gray-cta sm') + '" onclick="window.sterilisasiAutoklafMediaLab()">🔥 Autoklaf (121°C) &amp; Tuang ke Botol ➔</button>' +
            '</div>' +
        '</div></div>';
};

// 5. REKOMBINASI DNA — TAHAP 2: SERET ENZIM RESTRIKSI DARI RAK KE SEGMEN DNA
const _origRenderDnaV3 = window.renderDnaRecombStage;
window.renderDnaRecombStage = function(bodyEl) {
    let s = window.labDnaSession;
    if (!s || s.step !== 2) return _origRenderDnaV3(bodyEl);

    let enz = window.cariEnzimRestriksiLab(s.enzId);
    let doneCuts = (s.cuts.insulinLeft ? 1 : 0) + (s.cuts.insulinRight ? 1 : 0) + (s.cuts.plasmidSite ? 1 : 0);
    let dec1 = enz.decoys[0], dec2 = enz.decoys[1];

    let humanSegs = window.urutanAcakStabilLab(s, "dnaHumanSegs", [
        { k: "insulinLeft",  valid: true,  top: enz.seqTop, bot: enz.seqBot, cutPos: enz.cutPos },
        { k: "decoy1",       valid: false, top: dec1.top,   bot: dec1.bot,   cutPos: 2 },
        { k: "insulinRight", valid: true,  top: enz.seqTop, bot: enz.seqBot, cutPos: enz.cutPos }
    ]);
    let plasmidSegs = window.urutanAcakStabilLab(s, "dnaPlasmidSegs", [
        { k: "decoy2",      valid: false, top: dec2.top,   bot: dec2.bot,   cutPos: 2 },
        { k: "plasmidSite", valid: true,  top: enz.seqTop, bot: enz.seqBot, cutPos: enz.cutPos }
    ]);

    let enzRack = window.urutanAcakStabilLab(s, "dnaEnzRackV4", [
        { id: "ecori",         ikon: "✂️", nama: "EcoRI",      col: "#0284c7" },
        { id: "bamhi",         ikon: "✂️", nama: "BamHI",      col: "#0d9488" },
        { id: "hindiii",       ikon: "✂️", nama: "HindIII",    col: "#7e22ce" },
        { id: "ligase_decoy",  ikon: "🔗", nama: "DNA Ligase", col: "#d97706" },
        { id: "amilase_decoy", ikon: "🧪", nama: "Amilase",    col: "#64748b" }
    ]);
    let rackHtml = enzRack.map(function(it) {
        return window.bangunHTMLItemRakLab("dna_step2", it.id, it.ikon, it.nama, false, it.col);
    }).join('');

    let stepperHtml = '<div class="lab-stepper-bar"><span class="lab-step-pill done">✓ 1. Isolasi</span><span class="lab-step-pill active">2. Restriksi</span><span class="lab-step-pill">3. Ligasi</span><span class="lab-step-pill">4. Fermentasi</span><span class="lab-step-pill">5. Evaluasi</span><span class="lab-patient-tag">🧬 Potong DNA (' + doneCuts + '/3)</span></div>';

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml +
        '<div class="lab-instruction-banner"><strong>✂️ Tahap 2: Seret Enzim Restriksi ke Situs Palindrom DNA (' + doneCuts + '/3)</strong><span>Cek tabel palindrom di ❓ Referensi, lalu seret botol enzim yang cocok langsung ke segmen DNA &amp; Plasmid yang tepat!</span></div>' +
        '<div class="lab-rack-dock" style="margin-bottom:10px;"><div class="lab-area-badge is-rack">🗄️ Rak Botol Enzim (Seret ke Segmen DNA di Bawah)</div><div class="lab-rack-items-grid" style="grid-template-columns:repeat(5, minmax(0, 1fr));">' + rackHtml + '</div></div>' +
        '<div class="dna-cut-bench">' +
            '<div class="dna-cut-group"><div class="dna-cut-group-title">🧬 A. Pita DNA Manusia (Potong 2 situs pengenalan yang tepat):</div><div class="dna-sites-row">' +
                humanSegs.map(function(sg, idx) {
                    let isCut = sg.valid && Boolean(s.cuts[sg.k]);
                    return '<div class="dna-site-btn lab-drop-target' + (isCut ? ' is-cut' : '') + '" data-lab-drop-scope="dna_step2" data-lab-drop-target="' + sg.k + '" onclick="window.klikTargetDropLab(\'dna_step2\', \'' + sg.k + '\')">' +
                        '<div class="dna-site-lbl">Segmen DNA #' + (idx + 1) + (isCut ? ' ✅' : '') + '</div>' +
                        window.bangunPitaBasaHTML(sg.top, sg.bot, sg.cutPos, isCut) +
                    '</div>';
                }).join('') +
            '</div></div>' +
            '<div class="dna-cut-group"><div class="dna-cut-group-title">⭕ B. Cincin Plasmid E. coli (Potong 1 situs pengenalan yang cocok):</div><div class="dna-sites-row two-col">' +
                plasmidSegs.map(function(sg, idx) {
                    let isCut = sg.valid && Boolean(s.cuts[sg.k]);
                    return '<div class="dna-site-btn lab-drop-target' + (isCut ? ' is-cut' : '') + '" data-lab-drop-scope="dna_step2" data-lab-drop-target="' + sg.k + '" onclick="window.klikTargetDropLab(\'dna_step2\', \'' + sg.k + '\')">' +
                        '<div class="dna-site-lbl">Segmen Plasmid #' + (idx + 1) + (isCut ? ' ✅' : '') + '</div>' +
                        window.bangunPitaBasaHTML(sg.top, sg.bot, sg.cutPos, isCut) +
                    '</div>';
                }).join('') +
            '</div></div>' +
        '</div></div>';
};

// 6. TRANSPOR MEMBRAN — TAHAP 1: KACA OBJEK DROP ZONE + BAKI PREPARAT TERPISAH
const _origRenderMemV3 = window.renderMembraneStage;
window.renderMembraneStage = function(bodyEl) {
    let s = window.labMembraneSession;
    if (!s || s.step !== 1) return _origRenderMemV3(bodyEl);

    let spec = window.MY_LAB_MEMBRANE_SPECIMENS[s.specId];
    let specCards = Object.values(window.MY_LAB_MEMBRANE_SPECIMENS).map(function(sp) {
        return '<button type="button" class="lab-spec-btn' + (s.specId === sp.id ? ' is-selected' : '') + '" onclick="window.pilihSpesimenMembranLab(\'' + sp.id + '\')"><span class="spec-ico">' + sp.ikon + '</span><div style="text-align:left;"><b>' + sp.nama + '</b><small>' + sp.jenis + '</small></div></button>';
    }).join('');

    let rackPrep = window.urutanAcakStabilLab(s, "memStep1Rack", [
        { id: "place",        ikon: spec.ikon, nama: "Sampel " + spec.nama.split(" ")[0], col: "#0d9488" },
        { id: "cover",        ikon: "🔲",      nama: "Kaca Penutup (Cover Slip)",          col: "#0284c7" },
        { id: "bunsen_decoy", ikon: "🔥",      nama: "Api Bunsen",                         col: "#dc2626" },
        { id: "biuret_decoy", ikon: "💧",      nama: "Reagen Biuret",                      col: "#7e22ce" }
    ]);
    let rackHtml = rackPrep.map(function(it) {
        let done = (it.id === "place" && s.prepPlaced) || (it.id === "cover" && s.prepCovered);
        return window.bangunHTMLItemRakLab("mem_step1", it.id, it.ikon, it.nama, done, it.col);
    }).join('');

    let stepperHtml = '<div class="lab-stepper-bar"><span class="lab-step-pill active">1. Preparat</span><span class="lab-step-pill">2. Fokus Mikroskop</span><span class="lab-step-pill">3. Uji Konsentrasi</span><span class="lab-step-pill">4. Kesimpulan</span><span class="lab-patient-tag">' + spec.ikon + ' ' + spec.nama + '</span></div>';

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap"><div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' + stepperHtml +
        '<div class="lab-instruction-banner"><strong>🔬 Tahap 1: Siapkan Preparat Basah di Kaca Objek</strong><span>Pilih spesimen lalu seret bahan yang tepat dari Baki Preparat ke Kaca Objek secara berurutan!</span></div>' +
        '<div class="lab-spec-row">' + specCards + '</div>' +
        '<div class="lab-split-bench">' +
            '<div class="lab-work-area">' +
                '<div class="lab-area-badge">🔬 Meja Kaca Objek (Drop Zone)</div>' +
                '<div class="lab-prep-bench lab-drop-target" data-lab-drop-scope="mem_step1" data-lab-drop-target="slide" onclick="window.klikTargetDropLab(\'mem_step1\', \'slide\')">' +
                    '<div class="lab-prep-glass">' + (s.prepPlaced ? '<div class="prep-specimen-drop ' + s.specId + '">' + spec.ikon + '</div>' : '<span class="prep-hint-txt">Drop Sampel &amp; Cover Slip ke Sini</span>') + (s.prepCovered ? '<div class="prep-coverslip"></div>' : '') + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="lab-rack-dock"><div class="lab-area-badge is-rack">🗄️ Baki Preparat (Teracak + Pengecoh)</div><div class="lab-rack-items-grid">' + rackHtml + '</div></div>' +
        '</div></div>';
};
// =========================================================================
// 18. REVISI BAHASA AKADEMIK BAKU, BIAYA PRAKTIKUM 20%, & RIWAYAT LAB
// =========================================================================

// 1. STANDARISASI BAHASA ILMIAH PADA KATALOG, PROSEDUR, REFERENSI, & HEMATOPOESIS
(function standarisasiBahasaAkademikLab() {
    let petaDeskripsi = {
        blood_test: "Meneteskan sampel darah serta serum Anti-A, Anti-B, Anti-AB, dan Anti-D pada cekungan uji, mengaduk secara aseptis dengan batang pengaduk steril, lalu menganalisis reaksi aglutinasi.",
        membrane_transport: "Menentukan konsentrasi zat terlarut internal sel misteri melalui pengujian berbagai konsentrasi larutan, pengamatan mikroskopis, dan penarikan kesimpulan osmosis.",
        tissue_culture: "Melakukan pemotongan eksplan meristem, sterilisasi bertingkat, peracikan media MS dengan rasio Auksin–Sitokinin, inokulasi aseptis, hingga aklimatisasi plantlet.",
        dna_recomb: "Mengisolasi gen insulin dari sel beta pankreas, mengekstraksi plasmid E. coli, memotong urutan palindrom dengan enzim restriksi, melakukan ligasi rDNA, dan memanen vial insulin.",
        genetics_lab: "Menentukan induk P1 dan P2 secara mandiri, menyusun gamet berdasarkan Hukum Mendel I dan II, melengkapi Papan Punnett, serta menganalisis 6 pola pewarisan sifat.",
        microscope_lab: "Mengamati preparat sel dan jaringan dengan memilih jenis mikroskop (Cahaya, Stereo, Elektron), mengatur lensa okuler–objektif, pencahayaan, dan fokus.",
        food_test: "Menyiapkan ekstrak sampel makanan, melakukan uji 4 indikator (Lugol, Biuret, Benedict dengan pemanasan, dan kertas buram), serta mendiagnosis kandungan nutriennya.",
        gram_stain: "Membuat preparat apusan bakteri, melakukan fiksasi panas, melaksanakan 4 tahap pewarnaan Gram secara berurutan, dan mengidentifikasi sifat Gram serta morfologi sel.",
        fermentation_lab: "Melakukan sterilisasi substrat, inokulasi mikroorganisme spesifik, pengaturan suhu inkubator optimum, dan pemantauan fermentasi waktu nyata hingga panen.",
        protein_synth: "Melakukan transkripsi pita DNA template menjadi mRNA di nukleus serta translasi kodon menjadi rantai polipeptida di ribosom menggunakan Tabel Kodon.",
        hematopoiesis: "Memetakan diferensiasi Sel Punca Hematopoietik (HSC) ke jalur Mieloid dan Limfoid, lalu menentukan sel efektor yang tepat pada berbagai respons fisiologis dan imunologis."
    };

    if (window.MY_LAB_CATALOG && Array.isArray(window.MY_LAB_CATALOG.experiments)) {
        window.MY_LAB_CATALOG.experiments.forEach(function(exp) {
            if (petaDeskripsi[exp.id]) exp.deskripsi = petaDeskripsi[exp.id];
            if (exp.id === "hematopoiesis") {
                exp.sub = "Diferensiasi 9 Sel Darah ➔ Respons Imun";
            }
        });
    }

    if (window.MY_LAB_HEMATO_MISSIONS && Array.isArray(window.MY_LAB_HEMATO_MISSIONS)) {
        window.MY_LAB_HEMATO_MISSIONS = [
            { kasus: "Terjadi kerusakan endotel pembuluh darah pada jaringan kulit sehingga terjadi perdarahan. Tentukan sel yang berperan dalam mekanisme pembekuan darah.", ans: ["trombosit"] },
            { kasus: "Kadar oksigen di lingkungan dataran tinggi menurun sehingga jaringan mengalami hipoksia. Tentukan sel darah yang berfungsi mengangkut oksigen melalui hemoglobin.", ans: ["eritrosit"] },
            { kasus: "Bakteri patogen memasuki jaringan melalui luka terbuka. Tentukan leukosit granulosit fagositik yang pertama kali merespons infeksi bakteri akut.", ans: ["neutrofil"] },
            { kasus: "Terdeteksi infeksi parasit cacing multiseluler pada saluran pencernaan. Tentukan leukosit granulosit yang berperan khusus mengeliminasi parasit cacing.", ans: ["eosinofil"] },
            { kasus: "Antigen patogen baru teridentifikasi dan sistem imun perlu memproduksi antibodi spesifik secara humoral. Tentukan sel limfoid yang berdiferensiasi menjadi sel plasma penghasil antibodi.", ans: ["sel_b"] },
            { kasus: "Sejumlah sel inang telah terinfeksi virus intraseluler sehingga diperlukan respons imunitas seluler. Tentukan sel limfoid yang mengalami pematangan di kelenjar timus.", ans: ["sel_t"] }
        ];
    }

    if (window.MY_LAB_PROTOCOL_DB && window.MY_LAB_PROTOCOL_DB.blood_test) {
        let bt = window.MY_LAB_PROTOCOL_DB.blood_test;
        bt.requiredTools = [
            { id: "bt_slide",  ikon: "🧫", nama: "Kaca Objek 4 Cekungan" },
            { id: "bt_blood",  ikon: "💉", nama: "Pipet Sampel Darah" },
            { id: "bt_serum",  ikon: "🧪", nama: "Serum Anti-A, B, AB, D" },
            { id: "bt_stick",  ikon: "🥢", nama: "Batang Pengaduk Steril" }
        ];
        bt.steps = [
            "Siapkan kaca objek 4 cekungan yang bersih, sampel darah pasien, keempat serum reagen, dan batang pengaduk steril.",
            "Teteskan sampel darah pasien ke keempat cekungan kaca objek.",
            "Teteskan masing-masing serum (Anti-A, Anti-B, Anti-AB, Anti-D) tepat pada cekungan berlabel sesuai.",
            "Aduk setiap cekungan hingga homogen; wajib menggunakan batang pengaduk steril yang baru untuk setiap cekungan.",
            "Amati ada tidaknya reaksi aglutinasi, kemudian tetapkan golongan darah pasien dan donor yang kompatibel."
        ];
        bt.risks = "• <b>Kesalahan Berantai:</b> Penetesan serum pada cekungan yang keliru mencemari kaca objek sehingga persiapan harus diulang dari tahap penetesan darah.<br>• <b>Kesalahan Fatal:</b> Penggunaan ulang batang pengaduk antarcekungan menyebabkan kontaminasi silang antibodi sehingga praktikum dinyatakan tidak valid dan wajib diulang dari awal.";
    }

    if (window.MY_LAB_PROTOCOL_DB && window.MY_LAB_PROTOCOL_DB.hematopoiesis) {
        let hm = window.MY_LAB_PROTOCOL_DB.hematopoiesis;
        hm.tujuan = "Memahami jalur diferensiasi Sel Punca Hematopoietik (HSC) menjadi 9 jenis sel darah serta mengidentifikasi fungsi spesifik setiap sel pada mekanisme fisiologis dan imunologis.";
        hm.steps = [
            "Siapkan Sel Punca HSC, faktor diferensiasi Mieloid dan Limfoid, serta panel kasus klinis.",
            "Kelompokkan seluruh 9 jenis sel darah ke jalur progenitor yang sesuai (6 sel jalur Mieloid dan 3 sel jalur Limfoid).",
            "Analisis 4 kasus klinis dan tentukan sel darah atau sel imun yang berperan tepat pada masing-masing kondisi.",
            "Selesaikan evaluasi konsep hematologi untuk memperoleh penilaian akhir."
        ];
        hm.risks = "• <b>Kesalahan Prosedur (-1 ❤️):</b> Kekeliruan penentuan jalur progenitor atau pemilihan sel efektor pada kasus klinis (batas maksimal 5 kesalahan).";
    }
})();

// Pengubah terminologi non-baku menjadi bahasa akademik baku (hanya pada text node agar aman dari kerusakan atribut HTML)
window.MY_LAB_FORMAL_MAP = [
    [/kaca objek 4 sumur/gi, "kaca objek 4 cekungan"],
    [/4 sumur/gi, "4 cekungan uji"],
    [/keempat sumur/gi, "keempat cekungan uji"],
    [/pindah sumur/gi, "berpindah cekungan uji"],
    [/sumur baru/gi, "cekungan uji berikutnya"],
    [/sumur lain/gi, "cekungan uji lain"],
    [/sumur/gi, "cekungan uji"],
    [/tusuk gigi/gi, "batang pengaduk steril"],
    [/komandan hematopoesis/gi, "Ahli Hematologi"],
    [/pasukan sel imun/gi, "sel efektor imun"],
    [/pasukan imun/gi, "sistem sel imun"],
    [/pasukan/gi, "sel efektor"],
    [/bertempur/gi, "merespons patogen"],
    [/pertempuran/gi, "respons imun"],
    [/rekrut seluruh/gi, "diferensiasikan seluruh"],
    [/rekrut 9 sel/gi, "diferensiasi 9 sel"],
    [/rekrut ke jalur/gi, "arah diferensiasi ke jalur"],
    [/rekrut/gi, "diferensiasikan"],
    [/kerahkan/gi, "tentukan"],
    [/\bkamu\b/gi, "Anda"],
    [/\byuk\b/gi, "mari"],
    [/\bcek\b/gi, "periksa"],
    [/\bgak\b/gi, "tidak"],
    [/\baja\b/gi, "saja"],
    [/\bnih\b/gi, ""],
    [/\bdong\b/gi, ""],
    [/\blho\b/gi, ""],
    [/\bcoba lagi\b/gi, "ulangi percobaan"],
    [/\bhebat!\b/gi, "kompeten."],
    [/\bkeren\b/gi, "akurat"],
    [/\bmantap\b/gi, "tepat"]
];

window.terapkanBahasaBakuTeks = function(teks) {
    let out = String(teks || "");
    window.MY_LAB_FORMAL_MAP.forEach(function(pair) {
        out = out.replace(pair[0], pair[1]);
    });
    return out;
};

window.formalitasDOMLab = function(rootEl) {
    if (!rootEl) return;
    let walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.trim().length > 0) {
            let baru = window.terapkanBahasaBakuTeks(node.nodeValue);
            if (baru !== node.nodeValue) node.nodeValue = baru;
        }
    }
};

// 2. BIAYA PRAKTIKUM 20% DARI TOTAL MAKSIMAL COIN
window.hitungBiayaPraktikumLab = function(expId) {
    let exp = (window.MY_LAB_CATALOG && window.MY_LAB_CATALOG.experiments)
        ? window.MY_LAB_CATALOG.experiments.find(function(e) { return e.id === expId; })
        : null;
    let maxCoin = exp ? (Number(exp.rewardMaxCoin) || 100) : 100;
    return Math.max(10, Math.round(maxCoin * 0.20));
};

window.hitungBiayaBatchFermentasi = function(recipeId) {
    let rec = (window.MY_LAB_FERM_RECIPES || []).find(function(r) { return r.id === recipeId; });
    let maxCoin = rec ? (Number(rec.coin) || 100) : 100;
    return Math.max(10, Math.round(maxCoin * 0.20));
};

// 3. SISTEM RIWAYAT PRAKTIKUM (HISTORY LAB) & PEROLEHAN BINTANG (0 EXTRA READS)
window.catatRiwayatPraktikumLab = function(entry) {
    let uName = sessionStorage.getItem("username");
    let lb = window.pastikanStrukturMyLab(uName);
    if (!lb || !lb.myLabData) return;

    if (!Array.isArray(lb.myLabData.history)) {
        lb.myLabData.history = lb.myLabData.history ? Object.values(lb.myLabData.history) : [];
    }

    let exp = (window.MY_LAB_CATALOG && window.MY_LAB_CATALOG.experiments)
        ? window.MY_LAB_CATALOG.experiments.find(function(e) { return e.id === entry.expId; })
        : null;

    let now = new Date();
    let pad = function(n) { return String(n).padStart(2, "0"); };
    let waktuStr = pad(now.getDate()) + "/" + pad(now.getMonth() + 1) + "/" + now.getFullYear() + " " + pad(now.getHours()) + ":" + pad(now.getMinutes());

    let feeVal = (typeof entry.feePaid === "number")
        ? entry.feePaid
        : ((window.labFlowState && window.labFlowState.expId === entry.expId) ? (Number(window.labFlowState.feePaid) || 0) : window.hitungBiayaPraktikumLab(entry.expId));

    let item = {
        id: "lh_" + Date.now() + "_" + Math.floor(Math.random() * 900),
        expId: entry.expId || "lab",
        judul: entry.judul || (exp ? exp.judul : "Praktikum Biologi"),
        ikon: exp ? exp.ikon : "🧪",
        status: entry.status || "Selesai",
        stars: Math.max(0, Math.min(3, Number(entry.stars) || 0)),
        score: Math.max(0, Math.min(100, Number(entry.score) || 0)),
        feePaid: feeVal,
        coinGain: Number(entry.coinGain) || 0,
        xpGain: Number(entry.xpGain) || 0,
        catatan: window.terapkanBahasaBakuTeks(entry.catatan || ""),
        waktu: waktuStr,
        ts: Date.now()
    };

    lb.myLabData.history.unshift(item);
    if (lb.myLabData.history.length > 30) {
        lb.myLabData.history = lb.myLabData.history.slice(0, 30);
    }

    window.simpanDataLabKeServer(lb);
};

window.bukaRiwayatLab = function() {
    window.hentikanTimerKulturJaringan();
    window.hentikanTimerDnaLab();
    window.hentikanTimerLabTambahan();
    window.tutupPanduanLab();
    window.tutupProsedurPraktikumLab();
    window.tutupOverlayGagalLab();
    window.labFlowState.active = false;
    window.labFlowState.phase = "idle";
    window.activeLabView = "history";
    window.renderMyLabUI();
};

window.renderRiwayatLabView = function(bodyEl) {
    let ctx = window.ambilDataLabAktif();
    let labData = ctx.labData || { records: {}, history: [], totalCompleted: 0, totalStars: 0 };
    let records = labData.records || {};
    let hist = Array.isArray(labData.history) ? labData.history : Object.values(labData.history || {});
    let totalModul = (window.MY_LAB_CATALOG && window.MY_LAB_CATALOG.experiments) ? window.MY_LAB_CATALOG.experiments.length : 11;
    let maxBintangSemua = totalModul * 3;

    let totalBintang = 0;
    let modulTuntas = 0;
    window.MY_LAB_CATALOG.experiments.forEach(function(exp) {
        let r = records[exp.id];
        if (r && Number(r.bestStars) > 0) {
            totalBintang += Number(r.bestStars) || 0;
            modulTuntas++;
        }
    });

    let matrixHtml = window.MY_LAB_CATALOG.experiments.map(function(exp) {
        let r = records[exp.id] || { bestStars: 0, completions: 0 };
        let stHtml = "";
        for (let i = 1; i <= 3; i++) {
            stHtml += '<span class="lab-star-ico ' + (i <= (r.bestStars || 0) ? 'lit' : '') + '">★</span>';
        }
        return '<div class="lab-hist-mod-card' + ((r.bestStars || 0) > 0 ? ' is-done' : '') + '">' +
            '<div class="lab-hist-mod-top"><span>' + exp.ikon + ' ' + exp.judul + '</span><span class="lab-stars-row">' + stHtml + '</span></div>' +
            '<div class="lab-hist-mod-sub">Penyelesaian: <b>' + (r.completions || 0) + ' kali</b></div>' +
        '</div>';
    }).join('');

    let listHtml = '';
    if (hist.length === 0) {
        listHtml = '<div class="lab-hist-empty">Belum terdapat catatan riwayat praktikum. Selesaikan atau jalankan salah satu modul praktikum untuk mulai merekam riwayat penilaian.</div>';
    } else {
        listHtml = hist.map(function(h) {
            let isFail = (h.status === "Gagal");
            let stHtml = '';
            for (let i = 1; i <= 3; i++) {
                stHtml += '<span class="lab-star-ico ' + (!isFail && i <= (h.stars || 0) ? 'lit' : '') + '">★</span>';
            }
            return '<div class="lab-hist-row ' + (isFail ? 'is-fail' : 'is-pass') + '">' +
                '<div class="lab-hist-row-left">' +
                    '<div class="lab-hist-row-title">' + (h.ikon || '🧪') + ' <b>' + h.judul + '</b> <span class="lab-hist-status ' + (isFail ? 'fail' : 'pass') + '">' + h.status + '</span></div>' +
                    '<div class="lab-hist-row-meta">🕒 ' + (h.waktu || '-') + ' • Biaya: −🪙 ' + (h.feePaid || 0) + (h.catatan ? (' • ' + h.catatan) : '') + '</div>' +
                '</div>' +
                '<div class="lab-hist-row-right">' +
                    '<div class="lab-stars-row">' + stHtml + '</div>' +
                    '<div class="lab-hist-score">' + (isFail ? 'Diulang' : ('Skor ' + h.score + ' • +🪙 ' + h.coinGain + ' • +⭐ ' + h.xpGain)) + '</div>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    bodyEl.innerHTML =
        '<div class="lab-lobby-wrap">' +
            '<div class="lab-lobby-banner">' +
                '<div>' +
                    '<h3>📜 Riwayat &amp; Rekap Bintang Praktikum' + (ctx.isVisit ? (': ' + ctx.hostNama) : '') + '</h3>' +
                    '<p>Rekapitulasi pencapaian bintang terbaik pada setiap modul serta catatan pelaksanaan praktikum terakhir.</p>' +
                '</div>' +
                '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:7px 14px;" onclick="window.kembaliKeLobiLab()">◀ Kembali ke Daftar Lab</button>' +
            '</div>' +
            '<div class="lab-hist-summary">' +
                '<div class="lab-hist-stat-box"><small>Total Bintang</small><b>⭐ ' + totalBintang + ' / ' + maxBintangSemua + '</b></div>' +
                '<div class="lab-hist-stat-box"><small>Modul Dikuasai</small><b>🧪 ' + modulTuntas + ' / ' + totalModul + '</b></div>' +
                '<div class="lab-hist-stat-box"><small>Total Penyelesaian</small><b>✅ ' + (labData.totalCompleted || 0) + ' kali</b></div>' +
                '<div class="lab-hist-stat-box"><small>Catatan Riwayat</small><b>📜 ' + hist.length + ' entri</b></div>' +
            '</div>' +
            '<div class="lab-hist-section-title">🏆 Rekor Bintang Terbaik per Modul</div>' +
            '<div class="lab-hist-stars-grid">' + matrixHtml + '</div>' +
            '<div class="lab-hist-section-title" style="margin-top:14px;">🕒 Log Pelaksanaan Praktikum (30 Terakhir)</div>' +
            '<div class="lab-hist-list">' + listHtml + '</div>' +
        '</div>';
};

// 4. PERBARUI BRIEFING & PELUNASAN BIAYA 20% COIN SEBELUM TAHAP 0
window.renderLayarBriefingLab = function(bodyEl) {
    let expId = window.labFlowState.expId;
    let p = window.MY_LAB_PROTOCOL_DB[expId];
    if (!p) { window.lanjutKeTahap0AlatBahanLab(); return; }

    let isFerm = (expId === "fermentation_lab");
    let biaya = isFerm ? 0 : window.hitungBiayaPraktikumLab(expId);
    let exp = window.MY_LAB_CATALOG.experiments.find(function(e) { return e.id === expId; });
    let maxCoin = exp ? exp.rewardMaxCoin : 100;

    let toolsHtml = p.requiredTools.map(function(t) {
        return '<span class="lab-prot-tool-chip">' + t.ikon + ' ' + t.nama + '</span>';
    }).join('');
    let stepsHtml = p.steps.map(function(st) { return '<li>' + st + '</li>'; }).join('');

    let labelBtnStart = isFerm
        ? "🧰 Siapkan Meja Inkubator (Biaya 20% per Batch)"
        : ("💳 Bayar Biaya Bahan (🪙 " + biaya + " Coin) &amp; Siapkan Meja Kerja ➔");

    bodyEl.innerHTML =
        '<div class="lab-stage-wrap">' +
            '<div id="mylab-toast-box" class="mylab-toast-box" style="display:none;"></div>' +
            '<div class="lab-briefing-card">' +
                '<div class="lab-briefing-head">' +
                    '<div><h3>' + p.judul + '</h3><small>📖 Pelajari tujuan, daftar alat dan bahan, serta prosedur kerja sebelum memulai praktikum.</small></div>' +
                    '<div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">' +
                        '<span class="lab-fee-pill">' + (isFerm ? '🪙 Biaya: 20% / Batch' : ('🪙 Biaya: ' + biaya + ' Coin (20% dari ' + maxCoin + ')')) + '</span>' +
                        '<span class="lab-briefing-hearts">❤️❤️❤️❤️❤️ (5 Kesempatan)</span>' +
                    '</div>' +
                '</div>' +
                '<div class="lab-briefing-grid">' +
                    '<div class="mylab-guide-sec"><h4>🎯 Tujuan serta Alat dan Bahan Wajib</h4><div class="mylab-guide-content"><p>' + p.tujuan + '</p></div><div class="lab-prot-tools-wrap" style="margin-top:8px;">' + toolsHtml + '</div></div>' +
                    '<div class="mylab-guide-sec"><h4>📋 Urutan Prosedur Kerja</h4><div class="mylab-guide-content"><ol>' + stepsHtml + '</ol></div></div>' +
                '</div>' +
                '<div class="mylab-guide-sec is-risk-sec"><h4>⚠️ Ketentuan Keselamatan dan Kegagalan Praktikum</h4><div class="mylab-guide-content">' + p.risks + '</div></div>' +
                '<div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:4px;">' +
                    '<button type="button" class="mypet-amber-cta sm" style="width:auto; padding:9px 18px;" onclick="window.bukaPanduanLab()">❓ Buka Referensi Konsep</button>' +
                    '<button type="button" class="mypet-green-cta" style="max-width:400px;" onclick="window.konfirmasiBayarDanMulaiTahap0()">' + labelBtnStart + '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
};

window.konfirmasiBayarDanMulaiTahap0 = function() {
    let f = window.labFlowState;
    if (!f || !f.expId) return;

    let isFerm = (f.expId === "fermentation_lab");
    if (!isFerm && !f.feePaidFlag) {
        let biaya = window.hitungBiayaPraktikumLab(f.expId);
        let uName = sessionStorage.getItem("username");
        let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;

        if (saldo < biaya) {
            return window.tampilkanToastLab("⚠️ Saldo Coin tidak mencukupi untuk biaya bahan praktikum (" + biaya + " Coin). Saldo saat ini: " + saldo.toLocaleString("id-ID") + " Coin.", "err");
        }
        if (typeof window.gunakanCoinSiswa === "function") {
            let ok = window.gunakanCoinSiswa(biaya, "biaya_lab_" + f.expId, false);
            if (!ok) return window.tampilkanToastLab("⚠️ Gagal memproses pembayaran biaya bahan praktikum.", "err");
        }
        f.feePaid = biaya;
        f.feePaidFlag = true;
        window.perbaruiSaldoHUDLab();
    }

    window.lanjutKeTahap0AlatBahanLab();
};

// Biaya 20% per batch khusus pada Fermentasi Real-Time
const _origMulaiInkubasiV4 = window.mulaiInkubasiRealTimeFerm;
window.mulaiInkubasiRealTimeFerm = function() {
    let st = window.labFermSession;
    if (!st || st.setupSlot < 0) return;
    let rec = window.MY_LAB_FERM_RECIPES.find(function(r) { return r.id === st.recipeId; });
    if (rec && (st.tempVal < rec.suhuMin || st.tempVal > rec.suhuMax)) {
        return window.tampilkanToastLab("⚠️ Suhu " + st.tempVal + "°C tidak berada pada kisaran optimum untuk " + rec.nama + ". Periksa ❓ Referensi.", "err");
    }

    let biayaBatch = window.hitungBiayaBatchFermentasi(st.recipeId);
    let uName = sessionStorage.getItem("username");
    let saldo = (typeof window.ambilCoinSiswa === "function") ? window.ambilCoinSiswa(uName) : 0;
    if (saldo < biayaBatch) {
        return window.tampilkanToastLab("⚠️ Saldo Coin tidak mencukupi untuk biaya bahan fermentasi (" + biayaBatch + " Coin).", "err");
    }
    if (typeof window.gunakanCoinSiswa === "function") {
        window.gunakanCoinSiswa(biayaBatch, "biaya_ferm_" + st.recipeId, false);
    }
    window.perbaruiSaldoHUDLab();
    if (typeof _origMulaiInkubasiV4 === "function") _origMulaiInkubasiV4();
};

// 5. HOOK TERPADU: RIWAYAT OTOMATIS (SELESAI & GAGAL), INFO BIAYA 20% DI LOBI, & BAHASA BAKU
(function pasangHookV5FormalBiayaRiwayat() {
    // A. Hook renderMyLabUI untuk tampilan History, badge biaya 20% di Lobi, & normalisasi bahasa baku
    if (typeof window.renderMyLabUI === "function" && !window.renderMyLabUI._v5Hooked) {
        let prevRender = window.renderMyLabUI;
        window.renderMyLabUI = function() {
            let body = document.getElementById("mylab-main-body");
            let btnHist = document.getElementById("btn-lab-history");
            let btnLobby = document.getElementById("btn-lab-lobby");

            if (btnHist) btnHist.classList.toggle("active", window.activeLabView === "history");
            if (window.activeLabView === "history" && body) {
                window.perbaruiSaldoHUDLab();
                if (btnLobby) btnLobby.classList.remove("active");
                window.perbaruiHUDNyawaDanProsedurLab();
                window.renderRiwayatLabView(body);
                window.formalitasDOMLab(body);
                return;
            }

            prevRender.apply(this, arguments);

            // Tambahkan informasi Biaya Bahan 20% pada setiap kartu di Lobi My Lab
            if (window.activeLabView === "lobby" && body) {
                let cards = body.querySelectorAll(".lab-exp-card");
                window.MY_LAB_CATALOG.experiments.forEach(function(exp, idx) {
                    let card = cards[idx];
                    if (!card) return;
                    let foot = card.querySelector(".lab-exp-footer");
                    if (foot && !foot.querySelector(".lab-fee-tag")) {
                        let biaya = window.hitungBiayaPraktikumLab(exp.id);
                        let spanFee = document.createElement("span");
                        spanFee.className = "lab-fee-tag";
                        spanFee.innerHTML = exp.id === "fermentation_lab"
                            ? "💳 Biaya: 20% / Batch"
                            : ("💳 Biaya: 🪙 " + biaya);
                        foot.insertBefore(spanFee, foot.firstChild);
                    }
                });
            }

            if (body) window.formalitasDOMLab(body);
        };
        window.renderMyLabUI._v5Hooked = true;
    }

    // B. Hook Toast & Overlay agar seluruh teks notifikasi dan modal selalu berbahasa akademik baku
    if (typeof window.tampilkanToastLab === "function" && !window.tampilkanToastLab._v5FormalToast) {
        let origT = window.tampilkanToastLab;
        window.tampilkanToastLab = function(pesan, tipe) {
            origT(window.terapkanBahasaBakuTeks(pesan), tipe);
        };
        window.tampilkanToastLab._v5FormalToast = true;
    }

    if (typeof window.bukaPanduanLab === "function" && !window.bukaPanduanLab._v5FormalGuide) {
        let origG = window.bukaPanduanLab;
        window.bukaPanduanLab = function(k) {
            origG(k);
            window.formalitasDOMLab(document.getElementById("mylab-guide-overlay"));
        };
        window.bukaPanduanLab._v5FormalGuide = true;
    }

    if (typeof window.bukaProsedurPraktikumLab === "function" && !window.bukaProsedurPraktikumLab._v5FormalProt) {
        let origP = window.bukaProsedurPraktikumLab;
        window.bukaProsedurPraktikumLab = function() {
            origP();
            window.formalitasDOMLab(document.getElementById("mylab-protocol-overlay"));
        };
        window.bukaProsedurPraktikumLab._v5FormalProt = true;
    }

    // C. Hook pencatatan Riwayat Gagal (Fatal / 0 Nyawa)
    if (typeof window.tampilkanLayarGagalTotalLab === "function" && !window.tampilkanLayarGagalTotalLab._v5HistFail) {
        let origFail = window.tampilkanLayarGagalTotalLab;
        window.tampilkanLayarGagalTotalLab = function(isFatal, alasan) {
            let expId = (window.labFlowState && window.labFlowState.expId) || window.activeLabView;
            if (expId && expId !== "lobby" && expId !== "history") {
                window.catatRiwayatPraktikumLab({
                    expId: expId,
                    status: "Gagal",
                    stars: 0,
                    score: 0,
                    coinGain: 0,
                    xpGain: 0,
                    catatan: isFatal ? "Kegagalan fatal prosedur" : "Batas 5 kesalahan terlampaui"
                });
            }
            origFail(isFatal, window.terapkanBahasaBakuTeks(alasan));
            window.formalitasDOMLab(document.getElementById("mylab-fail-overlay"));
        };
        window.tampilkanLayarGagalTotalLab._v5HistFail = true;
    }

    // D. Hook pencatatan Riwayat Selesai untuk seluruh 11 modul praktikum
    if (typeof window.simpanRekorHadiahLabUmum === "function" && !window.simpanRekorHadiahLabUmum._v5HistHook) {
        let origSaveUmum = window.simpanRekorHadiahLabUmum;
        window.simpanRekorHadiahLabUmum = function(expId, stars, coinGain, xpGain, extraMutator) {
            origSaveUmum.apply(this, arguments);
            let scoreVal = 100;
            if (expId === "food_test" && window.labFoodSession && window.labFoodSession.resultData) scoreVal = window.labFoodSession.resultData.score;
            else if (expId === "gram_stain" && window.labGramSession && window.labGramSession.resultData) scoreVal = window.labGramSession.resultData.score;
            else if (expId === "protein_synth" && window.labProteinSession && window.labProteinSession.resultData) scoreVal = window.labProteinSession.resultData.score;
            else if (expId === "hematopoiesis" && window.labHematoSession && window.labHematoSession.resultData) scoreVal = window.labHematoSession.resultData.score;
            window.catatRiwayatPraktikumLab({
                expId: expId,
                status: "Selesai",
                stars: stars,
                score: scoreVal,
                coinGain: coinGain,
                xpGain: xpGain,
                feePaid: expId === "fermentation_lab" ? Math.round((coinGain || 150) * 0.2) : undefined,
                catatan: coinGain === 0 ? "Imbalan dikirim ke inventaris" : "Lulus praktikum"
            });
        };
        window.simpanRekorHadiahLabUmum._v5HistHook = true;
    }

    let hookModulSelesai = function(fnName, getPayload) {
        if (typeof window[fnName] === "function" && !window[fnName]._v5HistHook) {
            let origFn = window[fnName];
            window[fnName] = function() {
                origFn.apply(this, arguments);
                let payload = getPayload();
                if (payload) window.catatRiwayatPraktikumLab(payload);
            };
            window[fnName]._v5HistHook = true;
        }
    };

    hookModulSelesai("selesaikanDiagnosisDarah", function() {
        let r = window.labBloodSession && window.labBloodSession.resultData;
        return r ? { expId: "blood_test", status: "Selesai", stars: r.stars, score: r.score, coinGain: r.coin, xpGain: r.xp, catatan: "Golongan darah " + window.labBloodSession.blood.type } : null;
    });
    hookModulSelesai("selesaikanPraktikumMembran", function() {
        let r = window.labMembraneSession && window.labMembraneSession.resultData;
        return r ? { expId: "membrane_transport", status: "Selesai", stars: r.stars, score: r.score, coinGain: r.coin, xpGain: r.xp, catatan: "Spesimen " + window.labMembraneSession.specId } : null;
    });
    hookModulSelesai("klaimHadiahKulturJaringan", function() {
        let s = window.labTissueSession;
        let r = s && s.resultData;
        return (s && s.rewardClaimed && r) ? { expId: "tissue_culture", status: "Selesai", stars: r.stars, score: r.score, coinGain: s.claimedMode === "garden" ? 0 : r.sellCoin, xpGain: r.xp, catatan: s.claimedMode === "garden" ? "Bibit dikirim ke My Garden" : "Plantlet terjual" } : null;
    });
    hookModulSelesai("selesaikanPraktikumRekombinasiDNA", function() {
        let r = window.labDnaSession && window.labDnaSession.resultData;
        return r ? { expId: "dna_recomb", status: "Selesai", stars: r.stars, score: r.score, coinGain: r.coin, xpGain: r.xp, catatan: r.vials + " Vial Insulin" } : null;
    });
    hookModulSelesai("klaimHadiahGenetikaLab", function() {
        let s = window.labGeneticsSession;
        let r = s && s.resultData;
        return (s && s.rewardClaimed && r) ? { expId: "genetics_lab", status: "Selesai", stars: r.stars, score: r.score, coinGain: s.claimedNote.indexOf("My Garden") !== -1 ? 0 : r.coin, xpGain: r.xp, catatan: "Pola " + s.mode } : null;
    });
    hookModulSelesai("selesaikanPraktikumMikroskop", function() {
        let r = window.labMicroscopeSession && window.labMicroscopeSession.resultData;
        return r ? { expId: "microscope_lab", status: "Selesai", stars: r.stars, score: r.score, coinGain: r.coin, xpGain: r.xp, catatan: "Preparat " + window.labMicroscopeSession.specId } : null;
    });
})();