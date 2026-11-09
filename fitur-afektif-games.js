/* =========================================================================
   MODUL FITUR CHECK-IN AFEKTIF, PERKEMBANGAN SISWA, & UPGRADE MINI-GAMES
   File Terpisah agar main.js tetap ringan dan rapi
   ========================================================================= */

window.adminAfektifData = window.adminAfektifData || [];
window.checkinState = {
    emosi: "",
    labelEmosi: "",
    ikon: "",
    jawaban1: "",
    jawaban2: ""
};

// 1. PERHITUNGAN SIKLUS HARI CHECK-IN (RESET SETIAP JAM 05:00 PAGI)
window.dapatkanKunciHariCheckin = function() {
    let now = new Date();
    // Jika masih sebelum jam 05:00 pagi, masih dihitung hari sebelumnya
    if (now.getHours() < 5) {
        now.setDate(now.getDate() - 1);
    }
    let yyyy = now.getFullYear();
    let mm = String(now.getMonth() + 1).padStart(2, '0');
    let dd = String(now.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
};

// Cek apakah siswa sudah check-in pada siklus hari ini (setelah jam 05:00 pagi)
window.apakahSudahCheckinHariIni = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let uName = sessionStorage.getItem("username");
    if (stat !== "siswa" || !uName) return false;

    let keyHariIni = window.dapatkanKunciHariCheckin();
    let lb = (window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) ? window.leaderboardSiswaData[uName] : null;
    if (lb && lb.checkinTerakhir === keyHariIni) return true;

    let lokalKey = localStorage.getItem("checkin_done_" + (window.guruAktif || "mahardika") + "_" + uName);
    return lokalKey === keyHariIni;
};

// Perbarui tampilan tombol Check-in (Kuning = Belum, Hijau = Sudah)
window.perbaruiTombolCheckinUI = function() {
    let btn = document.getElementById("btn-header-checkin");
    let stat = sessionStorage.getItem("statusLogin");
    if (!btn) return;

    // Tampilkan untuk siswa (dan admin untuk preview)
    if (stat === "siswa" || stat === "admin") {
        btn.style.display = "flex";
    } else {
        btn.style.display = "flex";
    }

    if (window.apakahSudahCheckinHariIni()) {
        btn.style.background = "#27ae60";
        btn.style.color = "#ffffff";
        btn.style.borderColor = "#2ecc71";
        btn.innerHTML = "✅ <span>Sudah Check-in</span>";
    } else {
        btn.style.background = "#f1c40f";
        btn.style.color = "#0b3954";
        btn.style.borderColor = "#f39c12";
        btn.innerHTML = "😊 <span>Check-in (+20 XP)</span>";
    }
};

// Pantau pergantian waktu setiap 30 detik agar otomatis reset tepat pukul 05:00 pagi
setInterval(function() {
    window.perbaruiTombolCheckinUI();
}, 30000);

// 2. MESIN PEMBACA VALIDASI JAWABAN SISWA
window.validasiTeksCheckinSiswa = function(teks) {
    let bersih = (teks || "").trim();

    if (bersih.length < 20) {
        return {
            valid: false,
            pesan: "⚠️ Jawabanmu masih terlalu singkat (" + bersih.length + "/20 karakter). Yuk ceritakan lebih lengkap minimal 20 karakter!"
        };
    }

    // Daftar kata terlarang (tidak ada, gak tau, dll.)
    let polaTerlarang = /\b(tidak\s*ada|gak\s*ada|tak\s*ada|nggak\s*ada|ga\s*ada|enggak\s*ada|tiada|tidak\s*tau|gak\s*tau|tak\s*tau|nggak\s*tau|ga\s*tau|tidak\s*tahu|gak\s*tahu|tak\s*tahu|kurang\s*tau|kurang\s*tahu|entahlah|entah|rahasia|kosong|malas\s*ngetik|apa\s*ya)\b/i;
    if (polaTerlarang.test(bersih)) {
        return {
            valid: false,
            pesan: "⚠️ Kalimat tidak boleh mengandung kata 'tidak ada', 'gak ada', 'tidak tau', 'gak tau', dan sejenisnya. Yuk renungkan dan ceritakan dengan jujur!"
        };
    }

    // Cek ketikan karakter berulang/spam (contoh: "aaaaaaaaaaaaaaaaaaaa" atau "asdfasdfasdfasdfasdf")
    let tanpaSpasi = bersih.toLowerCase().replace(/\s+/g, '');
    let hurufUnik = new Set(tanpaSpasi.split('')).size;
    if (hurufUnik < 5 || /(.)\1{4,}/.test(tanpaSpasi)) {
        return {
            valid: false,
            pesan: "⚠️ Sistem mendeteksi ketikan huruf berulang/acak. Tuliskan kalimat yang bermakna ya!"
        };
    }

    // Cek minimal jumlah kata (minimal 4 kata)
    let jumlahKata = bersih.split(/\s+/).filter(function(k) { return k.length > 1; }).length;
    if (jumlahKata < 4) {
        return {
            valid: false,
            pesan: "⚠️ Tuliskan dalam bentuk kalimat yang utuh (minimal 4 kata dan 20 karakter)."
        };
    }

    return { valid: true, pesan: "✓ Kalimat sudah baik dan memenuhi syarat (" + bersih.length + " karakter)." };
};

// Live indicator saat siswa mengetik di kolom check-in
window.pantauKetikanCheckin = function(idTextarea, idInfo) {
    let el = document.getElementById(idTextarea);
    let info = document.getElementById(idInfo);
    if (!el || !info) return;

    let hasil = window.validasiTeksCheckinSiswa(el.value);
    info.innerText = hasil.pesan;
    info.style.color = hasil.valid ? "#27ae60" : "#c0392b";
    el.style.borderColor = hasil.valid ? "#27ae60" : "#e74c3c";
};

// 3. ALUR MODAL CHECK-IN EMOSI SISWA
window.bukaModalCheckinSiswa = function() {
    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        alert("🔒 Silakan login menggunakan akun Siswa terlebih dahulu untuk melakukan Check-in harian dan mendapatkan +20 XP!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    if (stat === "siswa" && window.apakahSudahCheckinHariIni()) {
        alert("✅ Kamu sudah menyelesaikan Check-in hari ini! Tombol Check-in akan direset kembali besok pukul 05:00 pagi. Selamat belajar!");
        return;
    }

    window.checkinState = { emosi: "", labelEmosi: "", ikon: "", jawaban1: "", jawaban2: "" };
    window.renderStepPilihEmosiCheckin();
    window.bukaModal("modal-checkin-siswa");
};

window.renderStepPilihEmosiCheckin = function() {
    let body = document.getElementById("checkin-modal-body");
    if (!body) return;

    body.innerHTML =
        '<div style="text-align:center; padding:10px 5px;">' +
            '<h3 style="margin:0 0 8px 0; color:#0b3954; font-size:20px;">Bagaimana kabarmu hari ini?</h3>' +
            '<p style="margin:0 0 20px 0; font-size:13px; color:#64748b;">Pilih satu emoji yang paling menggambarkan perasaanmu saat ini:</p>' +
            '<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">' +
                '<button type="button" onclick="window.pilihEmosiCheckin(\'bahagia\')" style="background:#fef9e7; border:2px solid #f1c40f; border-radius:14px; padding:18px 10px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:8px;">' +
                    '<span style="font-size:44px;">😊</span>' +
                    '<span style="font-weight:800; font-size:15px; color:#d35400;">Senang / Bahagia</span>' +
                '</button>' +
                '<button type="button" onclick="window.pilihEmosiCheckin(\'sedih\')" style="background:#ebf5fb; border:2px solid #3498db; border-radius:14px; padding:18px 10px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:8px;">' +
                    '<span style="font-size:44px;">😢</span>' +
                    '<span style="font-weight:800; font-size:15px; color:#2980b9;">Sedih</span>' +
                '</button>' +
                '<button type="button" onclick="window.pilihEmosiCheckin(\'marah\')" style="background:#fdedec; border:2px solid #e74c3c; border-radius:14px; padding:18px 10px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:8px;">' +
                    '<span style="font-size:44px;">😠</span>' +
                    '<span style="font-weight:800; font-size:15px; color:#c0392b;">Marah</span>' +
                '</button>' +
                '<button type="button" onclick="window.pilihEmosiCheckin(\'biasa\')" style="background:#f8fafc; border:2px solid #94a3b8; border-radius:14px; padding:18px 10px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:8px;">' +
                    '<span style="font-size:44px;">😐</span>' +
                    '<span style="font-weight:800; font-size:15px; color:#475569;">Netral / Biasa Saja</span>' +
                '</button>' +
            '</div>' +
        '</div>';
};

window.pilihEmosiCheckin = function(kodeEmosi) {
    let mapEmosi = {
        bahagia: {
            label: "Bahagia",
            ikon: "😊",
            warna: "#d35400",
            bg: "#fef9e7",
            q1: "Ceritakan apa yang membuatmu bahagia hari ini, apa yang kamu syukuri hari ini?",
            q2: "Wah, senang mendengarnya. Apa yang bisa kamu lakukan untuk menyebarkan kebahagiaan kamu kepada sekitarmu?",
            pesanPenutup: "Tetap semangat ya, jangan lupa untuk tersenyum. Selamat belajar!"
        },
        sedih: {
            label: "Sedih",
            ikon: "😢",
            warna: "#2980b9",
            bg: "#ebf5fb",
            q1: "Apa hal yang membuatmu sedih?",
            q2: "Bagaimana respon awalmu dan bagaimana caramu menyikapinya?",
            pesanPenutup: "Bersedih adalah emosi yang nyata dan benar. Yang penting jangan berlarut-larut dalam kesedihan ya. Banyak hal yang dapat kita syukuri, sesederhana masih bisa bernapas hari ini. Semangat!"
        },
        marah: {
            label: "Marah",
            ikon: "😠",
            warna: "#c0392b",
            bg: "#fdedec",
            q1: "Apakah sekarang perasaannya sudah lebih baik? Apa hal yang membuatmu marah?",
            q2: "Marah adalah respon yang wajar ketika sesuatu terjadi di luar harapan kita. Apakah kamu sudah mencoba belajar memaafkan keadaan?",
            pesanPenutup: "Tidak apa untuk marah. Tapi ingat, marah yang tidak dimaafkan akan menjadi masalah untuk kita sendiri, bukan orang lain. Yuk ingat kembali apa hal yang bisa membuat kita happy dan semangat lagi!"
        },
        biasa: {
            label: "Biasa Saja",
            ikon: "😐",
            warna: "#475569",
            bg: "#f8fafc",
            q1: "Apa hal yang bisa kamu syukuri kemarin?",
            q2: "",
            pesanPenutup: "Bersyukur adalah salah satu cara menjaga hati kita tetap damai dan tenang. Mengingat hal-hal menyenangkan dapat membuat hati kita kembali semangat!"
        }
    };

    let cfg = mapEmosi[kodeEmosi];
    if (!cfg) return;

    window.checkinState.emosi = kodeEmosi;
    window.checkinState.labelEmosi = cfg.label;
    window.checkinState.ikon = cfg.ikon;
    window.checkinState.cfg = cfg;

    // Render Pertanyaan 1
    let body = document.getElementById("checkin-modal-body");
    body.innerHTML =
        '<div style="text-align:left;">' +
            '<div style="display:flex; align-items:center; justify-content:space-between; background:' + cfg.bg + '; padding:10px 14px; border-radius:10px; margin-bottom:14px;">' +
                '<span style="font-weight:800; color:' + cfg.warna + '; font-size:15px;">' + cfg.ikon + ' Perasaan: ' + cfg.label + '</span>' +
                '<button type="button" onclick="window.renderStepPilihEmosiCheckin()" style="background:transparent; border:1px solid ' + cfg.warna + '; color:' + cfg.warna + '; border-radius:6px; padding:3px 8px; font-size:11px; font-weight:bold; cursor:pointer;">Ganti Emoji</button>' +
            '</div>' +
            '<label style="font-weight:700; font-size:14px; color:#1e293b; display:block; margin-bottom:8px; line-height:1.4;">' + cfg.q1 + '</label>' +
            '<textarea id="checkin-input-1" class="input-box" rows="4" placeholder="Ketik ceritamu di sini (minimal 20 karakter, jujur & jelas)..." style="margin-bottom:6px; font-size:13px;" oninput="window.pantauKetikanCheckin(\'checkin-input-1\', \'checkin-info-1\')"></textarea>' +
            '<div id="checkin-info-1" style="font-size:11px; font-weight:bold; color:#7f8c8d; margin-bottom:14px;">Minimal 20 karakter.</div>' +
            '<button type="button" class="btn-action" style="background:#0b3954; width:100%; padding:11px; font-size:14px;" onclick="window.lanjutStepCheckinKedua()">Lanjutkan ➔</button>' +
        '</div>';
};

window.lanjutStepCheckinKedua = function() {
    let inp1 = document.getElementById("checkin-input-1");
    if (!inp1) return;

    let cek1 = window.validasiTeksCheckinSiswa(inp1.value);
    if (!cek1.valid) {
        alert(cek1.pesan);
        inp1.focus();
        return;
    }

    window.checkinState.jawaban1 = inp1.value.trim();
    let cfg = window.checkinState.cfg;

    // Jika emosi "biasa" (hanya 1 pertanyaan), langsung ke pesan penutup & tombol Semangat Belajar
    if (!cfg.q2) {
        window.renderStepPenutupCheckin();
        return;
    }

    // Jika ada pertanyaan ke-2 (Bahagia, Sedih, Marah)
    let body = document.getElementById("checkin-modal-body");
    body.innerHTML =
        '<div style="text-align:left;">' +
            '<div style="background:' + cfg.bg + '; padding:10px 14px; border-radius:10px; margin-bottom:14px; font-weight:800; color:' + cfg.warna + '; font-size:14px;">' +
                cfg.ikon + ' ' + cfg.label + ' — Langkah Terakhir' +
            '</div>' +
            '<label style="font-weight:700; font-size:14px; color:#1e293b; display:block; margin-bottom:8px; line-height:1.4;">' + cfg.q2 + '</label>' +
            '<textarea id="checkin-input-2" class="input-box" rows="4" placeholder="Ketik jawabanmu di sini (minimal 20 karakter)..." style="margin-bottom:6px; font-size:13px;" oninput="window.pantauKetikanCheckin(\'checkin-input-2\', \'checkin-info-2\')"></textarea>' +
            '<div id="checkin-info-2" style="font-size:11px; font-weight:bold; color:#7f8c8d; margin-bottom:14px;">Minimal 20 karakter.</div>' +
            '<button type="button" class="btn-action" style="background:#0b3954; width:100%; padding:11px; font-size:14px;" onclick="window.verifikasiStepKeduaCheckin()">Lanjutkan ➔</button>' +
        '</div>';
};

window.verifikasiStepKeduaCheckin = function() {
    let inp2 = document.getElementById("checkin-input-2");
    if (!inp2) return;

    let cek2 = window.validasiTeksCheckinSiswa(inp2.value);
    if (!cek2.valid) {
        alert(cek2.pesan);
        inp2.focus();
        return;
    }

    window.checkinState.jawaban2 = inp2.value.trim();
    window.renderStepPenutupCheckin();
};

window.renderStepPenutupCheckin = function() {
    let cfg = window.checkinState.cfg;
    let body = document.getElementById("checkin-modal-body");
    if (!body || !cfg) return;

    body.innerHTML =
        '<div style="text-align:center; padding:12px 6px;">' +
            '<div style="font-size:54px; margin-bottom:10px;">' + cfg.ikon + '</div>' +
            '<div style="background:' + cfg.bg + '; border-left:4px solid ' + cfg.warna + '; padding:16px; border-radius:10px; font-size:14px; color:#1e293b; line-height:1.6; font-weight:600; margin-bottom:20px; text-align:left;">' +
                cfg.pesanPenutup +
            '</div>' +
            '<button type="button" class="btn-action" style="background:#27ae60; width:100%; font-size:16px; padding:14px; border-radius:30px; font-weight:900; box-shadow:0 6px 15px rgba(39,174,96,0.35);" onclick="window.selesaikanCheckinHarian()">🔥 Semangat Belajar! (+20 XP)</button>' +
        '</div>';
};

window.selesaikanCheckinHarian = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let uName = sessionStorage.getItem("username") || "admin";
    let keyHariIni = window.dapatkanKunciHariCheckin();

    let namaLengkap = uName;
    let kelasSiswa = "Umum";

    if (window.akunSiswaData && window.akunSiswaData[uName]) {
        namaLengkap = window.akunSiswaData[uName].namaLengkap || uName;
        kelasSiswa = window.akunSiswaData[uName].kelas || "Umum";
    } else if (window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) {
        namaLengkap = window.leaderboardSiswaData[uName].namaLengkap || uName;
        kelasSiswa = window.leaderboardSiswaData[uName].kelas || "Umum";
    }

    let now = new Date();
    let waktuStr = String(now.getDate()).padStart(2, '0') + '/' +
                   String(now.getMonth() + 1).padStart(2, '0') + '/' +
                   now.getFullYear() + ' ' +
                   String(now.getHours()).padStart(2, '0') + ':' +
                   String(now.getMinutes()).padStart(2, '0');

    let recordAfektif = {
        id: "af_" + Date.now() + "_" + uName,
        username: uName,
        nama: namaLengkap,
        kelas: kelasSiswa,
        tanggalKey: keyHariIni,
        waktu: waktuStr,
        timestamp: now.toISOString(),
        emosi: window.checkinState.labelEmosi,
        ikon: window.checkinState.ikon,
        jawaban1: window.checkinState.jawaban1,
        jawaban2: window.checkinState.jawaban2 || "-"
    };

    if (!Array.isArray(window.adminAfektifData)) window.adminAfektifData = [];
    window.adminAfektifData.push(recordAfektif);

    if (typeof window.simpanDataAfektifKeDB === "function") {
        window.simpanDataAfektifKeDB();
    }

    // Berikan +20 XP ke Siswa dan catat checkinTerakhir
    if (stat === "siswa") {
        localStorage.setItem("checkin_done_" + (window.guruAktif || "mahardika") + "_" + uName, keyHariIni);
        if (window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) {
            window.leaderboardSiswaData[uName].checkinTerakhir = keyHariIni;
        }
        if (typeof window.tambahXPSiswa === "function") {
            window.tambahXPSiswa(20, "checkin_harian");
        }
    }

    window.tutupModal("modal-checkin-siswa");
    window.perbaruiTombolCheckinUI();
};

// 4. DASBOR PERKEMBANGAN SISWA (KOGNITIF & AFEKTIF FORMAT EXCEL)
window.bukaModalPerkembanganSiswa = function() {
    window.bukaModal("modal-perkembangan-siswa");
    window.gantiTabPerkembanganSiswa("afektif");
};

window.gantiTabPerkembanganSiswa = function(tab) {
    let btnKog = document.getElementById("btn-tab-perkembangan-kognitif");
    let btnAfe = document.getElementById("btn-tab-perkembangan-afektif");
    let viewKog = document.getElementById("view-perkembangan-kognitif");
    let viewAfe = document.getElementById("view-perkembangan-afektif");

    if (tab === "kognitif") {
        if (btnKog) { btnKog.style.background = "#0b3954"; btnKog.style.color = "white"; }
        if (btnAfe) { btnAfe.style.background = "#ffffff"; btnAfe.style.color = "#333"; }
        if (viewKog) viewKog.style.display = "block";
        if (viewAfe) viewAfe.style.display = "none";
    } else {
        if (btnAfe) { btnAfe.style.background = "#27ae60"; btnAfe.style.color = "white"; }
        if (btnKog) { btnKog.style.background = "#ffffff"; btnKog.style.color = "#333"; }
        if (viewKog) viewKog.style.display = "none";
        if (viewAfe) viewAfe.style.display = "flex";
        window.muatFilterKelasAfektif();
        window.renderTabelAfektifAdmin();
    }
};

window.muatFilterKelasAfektif = function() {
    let sel = document.getElementById("filter-afektif-kelas");
    if (!sel) return;
    let prev = sel.value || "Semua";
    let kelasSet = new Set();

    Object.keys(window.adminData || {}).forEach(function(k) { kelasSet.add(k); });
    (window.adminAfektifData || []).forEach(function(item) {
        if (item && item.kelas) kelasSet.add(item.kelas);
    });

    let html = '<option value="Semua">🏫 Semua Kelas</option>';
    Array.from(kelasSet).sort().forEach(function(k) {
        let selected = (k === prev) ? "selected" : "";
        html += '<option value="' + k + '" ' + selected + '>' + k + '</option>';
    });
    sel.innerHTML = html;
};

window.renderTabelAfektifAdmin = function() {
    let tbody = document.getElementById("body-tabel-afektif-excel");
    let statBox = document.getElementById("rekap-statistik-afektif");
    if (!tbody) return;

    let filterKelas = document.getElementById("filter-afektif-kelas") ? document.getElementById("filter-afektif-kelas").value : "Semua";
    let filterEmosi = document.getElementById("filter-afektif-emosi") ? document.getElementById("filter-afektif-emosi").value : "Semua";
    let filterTgl = document.getElementById("filter-afektif-tanggal") ? document.getElementById("filter-afektif-tanggal").value : "";

    let list = Array.isArray(window.adminAfektifData) ? window.adminAfektifData.slice() : [];

    // Filter data
    let filtered = list.filter(function(item) {
        if (!item) return false;
        if (filterKelas !== "Semua" && item.kelas !== filterKelas) return false;
        if (filterEmosi !== "Semua" && item.emosi !== filterEmosi) return false;
        if (filterTgl && item.tanggalKey !== filterTgl) return false;
        return true;
    });

    // Urutkan terbaru di atas
    filtered.sort(function(a, b) {
        return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
    });

    // Hitung statistik ringkas
    let count = { "Bahagia": 0, "Sedih": 0, "Marah": 0, "Biasa Saja": 0 };
    filtered.forEach(function(item) {
        if (count[item.emosi] !== undefined) count[item.emosi]++;
    });
    let total = filtered.length || 1;

    if (statBox) {
        statBox.innerHTML =
            '<div style="flex:1; min-width:130px; background:#fef9e7; border:1px solid #f1c40f; border-radius:8px; padding:10px 12px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#d35400;">😊 Bahagia / Senang</div>' +
                '<div style="font-size:20px; font-weight:900; color:#1e293b;">' + count["Bahagia"] + ' <span style="font-size:11px; font-weight:normal; color:#64748b;">(' + Math.round((count["Bahagia"] / total) * 100) + '%)</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:130px; background:#ebf5fb; border:1px solid #3498db; border-radius:8px; padding:10px 12px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#2980b9;">😢 Sedih</div>' +
                '<div style="font-size:20px; font-weight:900; color:#1e293b;">' + count["Sedih"] + ' <span style="font-size:11px; font-weight:normal; color:#64748b;">(' + Math.round((count["Sedih"] / total) * 100) + '%)</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:130px; background:#fdedec; border:1px solid #e74c3c; border-radius:8px; padding:10px 12px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#c0392b;">😠 Marah</div>' +
                '<div style="font-size:20px; font-weight:900; color:#1e293b;">' + count["Marah"] + ' <span style="font-size:11px; font-weight:normal; color:#64748b;">(' + Math.round((count["Marah"] / total) * 100) + '%)</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:130px; background:#f8fafc; border:1px solid #94a3b8; border-radius:8px; padding:10px 12px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#475569;">😐 Biasa Saja</div>' +
                '<div style="font-size:20px; font-weight:900; color:#1e293b;">' + count["Biasa Saja"] + ' <span style="font-size:11px; font-weight:normal; color:#64748b;">(' + Math.round((count["Biasa Saja"] / total) * 100) + '%)</span></div>' +
            '</div>';
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:25px; color:#7f8c8d; font-weight:bold;">Belum ada data rekaman Check-in Afektif siswa untuk filter ini.</td></tr>';
        return;
    }

    let html = "";
    filtered.forEach(function(item, idx) {
        let badgeBg = item.emosi === "Bahagia" ? "#fef9e7" : (item.emosi === "Sedih" ? "#ebf5fb" : (item.emosi === "Marah" ? "#fdedec" : "#f1f5f9"));
        let badgeCol = item.emosi === "Bahagia" ? "#d35400" : (item.emosi === "Sedih" ? "#2980b9" : (item.emosi === "Marah" ? "#c0392b" : "#475569"));

        html +=
            '<tr>' +
                '<td style="text-align:center; font-weight:bold; color:#7f8c8d;">' + (idx + 1) + '</td>' +
                '<td style="white-space:nowrap; font-size:12px;">' + (item.waktu || item.tanggalKey || "-") + '</td>' +
                '<td style="font-weight:bold; color:#2c3e50;">' + (item.nama || "-") + '</td>' +
                '<td style="text-align:center;"><span style="background:#eaf2f8; color:#2980b9; padding:2px 8px; border-radius:4px; font-weight:bold; font-size:11px;">' + (item.kelas || "-") + '</span></td>' +
                '<td style="text-align:center;"><span style="background:' + badgeBg + '; color:' + badgeCol + '; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:12px; white-space:nowrap;">' + (item.ikon || "") + ' ' + (item.emosi || "-") + '</span></td>' +
                '<td style="min-width:240px; line-height:1.4;">' + (item.jawaban1 || "-") + '</td>' +
                '<td style="min-width:240px; line-height:1.4;">' + (item.jawaban2 || "-") + '</td>' +
            '</tr>';
    });

    tbody.innerHTML = html;
};

// Export Rekap Afektif Siswa ke File Excel (.xls)
window.exportExcelAfektifSiswa = function() {
    let table = document.getElementById("tabel-afektif-excel");
    if (!table) return;

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Calibri,sans-serif;font-size:12px;}th,td{border:1px solid #000;padding:6px;vertical-align:top;}th{background:#2c3e50;color:#fff;font-weight:bold;}</style></head>' +
        '<body><h3>Rekap Perkembangan Afektif & Check-In Harian Siswa</h3>' + table.outerHTML + '</body></html>';

    let blob = new Blob([html], { type: "application/vnd.ms-excel" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Rekap_Afektif_Siswa_" + window.dapatkanKunciHariCheckin() + ".xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/* =========================================================================
   TAHAP 2: UPGRADE MINI-GAMES (ROTASI 6 GAMES)
   - Game 3: Simon Says (Minimal 8 Ketukan & Jaminan Variasi 4 Warna)
   - Game 4: Anagram Pengetahuan Umum (Bukan Biologi)
   - Game 6: Cari 5 Perbedaan pada 2 Gambar (SVG Interaktif Anti-Pecah)
   ========================================================================= */

// Override Rotasi Mini-Games menjadi 6 Permainan
window.bukaMiniGameLatihan = function(onCloseCallback) {
    if (!window.sesiLatihanSiswa || window.sesiLatihanSiswa.disableMiniGames) {
        if (onCloseCallback) onCloseCallback();
        return;
    }

    window.bersihkanTimerMiniGame();
    window.minigameOnCloseCallback = onCloseCallback || null;
    window.minigameRewardClaimed = false;

    window.sesiLatihanSiswa.minigameAppearCount = (window.sesiLatihanSiswa.minigameAppearCount || 0) + 1;
    let appearCount = window.sesiLatihanSiswa.minigameAppearCount;

    let btnOptOut = document.getElementById('btn-fokus-tanpa-game');
    if (btnOptOut) {
        if (appearCount === 1 || appearCount % 5 === 0) {
            btnOptOut.style.display = 'inline-block';
        } else {
            btnOptOut.style.display = 'none';
        }
    }

    let totalGames = 6;
    let gameIndex = window.minigameRotationIdx % totalGames;
    let badgeUrutan = document.getElementById('minigame-badge-urutan');
    if (badgeUrutan) {
        badgeUrutan.innerText = '🎮 Istirahat Sejenak • Game ' + (gameIndex + 1) + ' dari ' + totalGames;
    }

    let modal = document.getElementById('modal-minigame-latihan');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '1000050';
    }

    window.minigameRotationIdx = (gameIndex + 1) % totalGames;
    sessionStorage.setItem('mg_rot_idx', String(window.minigameRotationIdx));

    if (gameIndex === 0) window.mulaiGame1MemoryMatch();
    else if (gameIndex === 1) window.mulaiGame2WhackVirus();
    else if (gameIndex === 2) window.mulaiGame3SimonSays();
    else if (gameIndex === 3) window.mulaiGame4BioAnagram();
    else if (gameIndex === 4) window.mulaiGame5TapGoodCells();
    else window.mulaiGame6SpotDiff();
};

// -------------------------------------------------------------------------
// GAME 3 (UPGRADE): SIMON SAYS — MINIMAL 8 KETUKAN & VARIASI 4 WARNA MERATA
// -------------------------------------------------------------------------
window.buatPolaSimonBeragam = function(panjangKetukan) {
    // Pastikan keempat warna (0=Merah, 1=Hijau, 2=Biru, 3=Kuning) wajib muncul minimal 2 kali
    let poolWajib = [0, 1, 2, 3, 0, 1, 2, 3];
    while (poolWajib.length < panjangKetukan) {
        poolWajib.push(Math.floor(Math.random() * 4));
    }

    // Acak urutan menggunakan Fisher-Yates Shuffle
    for (let i = poolWajib.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = poolWajib[i];
        poolWajib[i] = poolWajib[j];
        poolWajib[j] = temp;
    }

    // Cegah 1 warna menyala 3 kali berturut-turut agar pola terasa dinamis
    for (let k = 2; k < poolWajib.length; k++) {
        if (poolWajib[k] === poolWajib[k - 1] && poolWajib[k] === poolWajib[k - 2]) {
            poolWajib[k] = (poolWajib[k] + 1 + Math.floor(Math.random() * 3)) % 4;
        }
    }
    return poolWajib;
};

window.mulaiGame3SimonSays = function() {
    let targetKetukan = 8 + Math.floor(Math.random() * 3); // 8, 9, atau 10 ketukan (Minimal 8 ketukan)
    document.getElementById('minigame-title').innerText = '⚡ 3. Simon Says: Pola ' + targetKetukan + ' Ketukan';
    document.getElementById('minigame-subtitle').innerText = 'Ingat urutan ' + targetKetukan + ' ketukan dari 4 warna tombol di bawah, lalu tirukan!';
    document.getElementById('minigame-score-val').innerText = '0/' + targetKetukan;

    let stage = document.getElementById('minigame-stage-body');
    stage.innerHTML =
        '<div id="mg-simon-status" style="font-size:13px; font-weight:800; color:#0b3954; margin-bottom:8px; text-align:center;">👀 Perhatikan pola ' + targetKetukan + ' ketukan warna...</div>' +
        '<div id="mg-simon-dots" style="display:flex; gap:5px; margin-bottom:14px; justify-content:center; flex-wrap:wrap;"></div>' +
        '<div class="mg-simon-grid">' +
            '<div class="mg-simon-pad" id="mg-pad-0" style="background:#e74c3c;" onclick="window.klikPadSimon(0)">🔴</div>' +
            '<div class="mg-simon-pad" id="mg-pad-1" style="background:#2ecc71;" onclick="window.klikPadSimon(1)">🟢</div>' +
            '<div class="mg-simon-pad" id="mg-pad-2" style="background:#3498db;" onclick="window.klikPadSimon(2)">🔵</div>' +
            '<div class="mg-simon-pad" id="mg-pad-3" style="background:#f1c40f;" onclick="window.klikPadSimon(3)">🟡</div>' +
        '</div>' +
        '<button type="button" id="btn-ulang-pola-simon" class="minigame-skip-btn" style="margin-top:14px; display:none;" onclick="window.putarUlangPolaSimon()">🔄 Putar Ulang Pola</button>';

    window.mgSimonState = {
        sequence: window.buatPolaSimonBeragam(targetKetukan),
        targetLen: targetKetukan,
        userStep: 0,
        acceptingInput: false
    };

    window.renderIndikatorTitikSimon();

    window.jalankanTimerMiniGame(50, function() {
        window.selesaikanMiniGameDenganHadiah('Waktu selesai! Latihan memori pola yang bagus!');
    });

    window.mulaiRondeSimonSays();
};

window.renderIndikatorTitikSimon = function() {
    let st = window.mgSimonState;
    let dotsEl = document.getElementById('mg-simon-dots');
    if (!st || !dotsEl) return;

    let html = '';
    for (let i = 0; i < st.targetLen; i++) {
        let done = i < st.userStep;
        let bg = done ? '#27ae60' : '#cbd5e1';
        html += '<span style="width:12px; height:12px; border-radius:50%; background:' + bg + '; display:inline-block; transition:0.2s;"></span>';
    }
    dotsEl.innerHTML = html;
};

window.nyalakanPadSimon = function(padIdx) {
    let pad = document.getElementById('mg-pad-' + padIdx);
    if (!pad) return;
    pad.classList.add('lit');
    let t = setTimeout(function() {
        pad.classList.remove('lit');
    }, 300);
    window.minigameActiveTimers.push(t);
};

window.putarUlangPolaSimon = function() {
    if (!window.mgSimonState || !window.mgSimonState.acceptingInput) return;
    window.mulaiRondeSimonSays();
};

window.mulaiRondeSimonSays = function() {
    let st = window.mgSimonState;
    if (!st) return;
    st.acceptingInput = false;
    st.userStep = 0;
    window.renderIndikatorTitikSimon();
    document.getElementById('minigame-score-val').innerText = '0/' + st.targetLen;

    let btnReplay = document.getElementById('btn-ulang-pola-simon');
    if (btnReplay) btnReplay.style.display = 'none';

    let statusEl = document.getElementById('mg-simon-status');
    if (statusEl) statusEl.innerText = '👀 Perhatikan urutan ' + st.targetLen + ' ketukan...';

    st.sequence.forEach(function(padIdx, i) {
        let t = setTimeout(function() {
            if (statusEl) statusEl.innerText = '👀 Ketukan ke-' + (i + 1) + ' dari ' + st.targetLen + '...';
            window.nyalakanPadSimon(padIdx);
            if (i === st.sequence.length - 1) {
                let t2 = setTimeout(function() {
                    st.acceptingInput = true;
                    if (statusEl) statusEl.innerText = '👆 Giliranmu! Tekan ' + st.targetLen + ' urutan warna tadi!';
                    if (btnReplay) btnReplay.style.display = 'inline-block';
                }, 420);
                window.minigameActiveTimers.push(t2);
            }
        }, (i + 1) * 520);
        window.minigameActiveTimers.push(t);
    });
};

window.klikPadSimon = function(padIdx) {
    let st = window.mgSimonState;
    if (!st || !st.acceptingInput) return;

    window.nyalakanPadSimon(padIdx);

    if (padIdx === st.sequence[st.userStep]) {
        st.userStep++;
        window.renderIndikatorTitikSimon();
        document.getElementById('minigame-score-val').innerText = st.userStep + '/' + st.targetLen;

        if (st.userStep >= st.sequence.length) {
            st.acceptingInput = false;
            let t = setTimeout(function() {
                window.selesaikanMiniGameDenganHadiah('Luar Biasa! Kamu berhasil mengingat seluruh ' + st.targetLen + ' ketukan warna dengan tepat!');
            }, 300);
            window.minigameActiveTimers.push(t);
        }
    } else {
        st.acceptingInput = false;
        let statusEl = document.getElementById('mg-simon-status');
        if (statusEl) statusEl.innerText = '❌ Urutan salah di ketukan ke-' + (st.userStep + 1) + '! Perhatikan ulang polanya...';
        let t = setTimeout(function() {
            window.mulaiRondeSimonSays();
        }, 1000);
        window.minigameActiveTimers.push(t);
    }
};

// -------------------------------------------------------------------------
// GAME 4 (UPGRADE): ACAK HURUF PENGETAHUAN UMUM (BUKAN BIOLOGI)
// -------------------------------------------------------------------------
window.mulaiGame4BioAnagram = function() {
    document.getElementById('minigame-title').innerText = '🔤 4. Susun Kata: Pengetahuan Umum';
    document.getElementById('minigame-subtitle').innerText = 'Susun huruf acak di bawah untuk menjawab pertanyaan pengetahuan umum!';
    document.getElementById('minigame-score-val').innerText = '1 Kata';

    const daftarKataUmum = [
        { kata: 'KAPUAS', hint: 'Apa nama sungai terpanjang di Indonesia yang terletak di Kalimantan Barat?' },
        { kata: 'TOBA', hint: 'Apa nama danau vulkanik terbesar di Indonesia yang berada di Sumatera Utara?' },
        { kata: 'KERINCI', hint: 'Apa nama gunung berapi tertinggi di Indonesia yang terletak di Sumatera?' },
        { kata: 'SOEKARNO', hint: 'Siapa nama tokoh proklamator sekaligus Presiden pertama Republik Indonesia?' },
        { kata: 'BOROBUDUR', hint: 'Apa nama candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah?' },
        { kata: 'ANGKLUNG', hint: 'Apa nama alat musik tradisional dari Jawa Barat yang terbuat dari bambu?' },
        { kata: 'GARUDA', hint: 'Apa nama burung yang menjadi lambang negara Indonesia?' },
        { kata: 'PASIFIK', hint: 'Apa nama samudra terluas dan terdalam di permukaan bumi?' },
        { kata: 'SAHARA', hint: 'Apa nama gurun pasir panas terluas di dunia yang terletak di benua Afrika?' },
        { kata: 'RENDANG', hint: 'Apa nama masakan khas Sumatera Barat yang pernah dinobatkan sebagai makanan terenak di dunia?' },
        { kata: 'MAJAPAHIT', hint: 'Apa nama kerajaan besar di Nusantara yang memiliki mahapatih bernama Gajah Mada?' },
        { kata: 'MONAS', hint: 'Apa singkatan dari tugu peringatan kemerdekaan yang menjadi ikon kota Jakarta?' },
        { kata: 'SUMATERA', hint: 'Apa nama pulau besar di bagian paling barat Indonesia yang membentang dari Aceh hingga Lampung?' },
        { kata: 'BATIK', hint: 'Apa nama kain bergambar khas Indonesia yang diakui UNESCO sebagai warisan budaya dunia?' },
        { kata: 'TOKYO', hint: 'Apa nama ibu kota dari negara Jepang?' }
    ];

    let terpilih = daftarKataUmum[Math.floor(Math.random() * daftarKataUmum.length)];
    let hurufAsli = terpilih.kata.split('');
    let hurufAcak = [...hurufAsli].sort(function() { return Math.random() - 0.5; });
    if (hurufAcak.join('') === terpilih.kata) hurufAcak.reverse();

    window.mgAnagramState = {
        target: terpilih.kata,
        hint: terpilih.hint,
        shuffled: hurufAcak,
        pickedIndices: []
    };

    window.renderUIBioAnagram();

    window.jalankanTimerMiniGame(35, function() {
        window.selesaikanMiniGameDenganHadiah('Waktu habis! Jawaban yang benar adalah: ' + terpilih.kata);
    });
};

// -------------------------------------------------------------------------
// GAME 6 (BARU): MENCARI 5 PERBEDAAN PADA 2 GAMBAR
// -------------------------------------------------------------------------
window.DAFTAR_TEMA_SPOT_DIFF = [
    {
        judul: "Pemandangan Pagi di Pegunungan",
        // Gambar Dasar yang Sama untuk Gambar 1 dan Gambar 2
        baseSVG:
            '<rect x="0" y="0" width="240" height="170" fill="#bae6fd"/>' +
            '<polygon points="10,135 75,55 140,135" fill="#64748b"/>' +
            '<polygon points="75,55 57,78 93,78" fill="#f8fafc"/>' +
            '<polygon points="95,135 165,45 235,135" fill="#475569"/>' +
            '<rect x="0" y="130" width="240" height="40" fill="#4ade80"/>' +
            // Rumah
            '<rect x="35" y="95" width="46" height="36" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>' +
            '<polygon points="30,95 58,72 86,95" fill="#ef4444"/>' +
            // Pohon Kanan
            '<rect x="190" y="102" width="10" height="30" fill="#78350f"/>' +
            '<circle cx="195" cy="92" r="18" fill="#16a34a"/>',
        // 5 Perbedaan (svgA = Gambar 1, svgB = Gambar 2, x & y = titik koordinat klik)
        diffs: [
            { id: 0, x: 35, y: 30, r: 20, svgA: '<circle cx="35" cy="30" r="14" fill="#facc15"/>', svgB: '<circle cx="35" cy="30" r="14" fill="#fb923c"/>' }, // 1. Warna Matahari (Kuning vs Oranye)
            { id: 1, x: 120, y: 32, r: 22, svgA: '<ellipse cx="120" cy="32" rx="18" ry="9" fill="#ffffff"/>', svgB: '' }, // 2. Awan Putih di Tengah Atas (Ada vs Hilang)
            { id: 2, x: 58, y: 115, r: 18, svgA: '<rect x="52" y="108" width="12" height="23" fill="#92400e"/>', svgB: '<rect x="52" y="108" width="12" height="23" fill="#2563eb"/>' }, // 3. Warna Pintu Rumah (Cokelat vs Biru)
            { id: 3, x: 195, y: 88, r: 20, svgA: '<circle cx="189" cy="88" r="3.5" fill="#ef4444"/><circle cx="201" cy="94" r="3.5" fill="#ef4444"/>', svgB: '' }, // 4. Buah Apel Merah di Pohon (Ada vs Tidak Ada)
            { id: 4, x: 135, y: 150, r: 20, svgA: '<circle cx="135" cy="150" r="6" fill="#ec4899"/><circle cx="135" cy="150" r="2.5" fill="#facc15"/>', svgB: '<circle cx="135" cy="150" r="6" fill="#a855f7"/><circle cx="135" cy="150" r="2.5" fill="#ffffff"/>' } // 5. Bunga di Rumput (Pink vs Ungu)
        ]
    },
    {
        judul: "Meja Belajar & Eksperimen",
        baseSVG:
            '<rect x="0" y="0" width="240" height="170" fill="#f1f5f9"/>' +
            '<rect x="0" y="125" width="240" height="45" fill="#d97706"/>' +
            // Layar Monitor
            '<rect x="75" y="45" width="85" height="58" rx="5" fill="#1e293b" stroke="#475569" stroke-width="3"/>' +
            '<rect x="108" y="103" width="18" height="16" fill="#64748b"/>' +
            '<rect x="92" y="118" width="50" height="7" rx="3" fill="#475569"/>' +
            // Rak Buku Atas
            '<rect x="15" y="25" width="45" height="6" fill="#78350f"/>' +
            // Gelas / Mug di Kanan
            '<rect x="185" y="96" width="22" height="28" rx="3" fill="#ef4444"/>',
        diffs: [
            { id: 0, x: 195, y: 32, r: 22, svgA: '<circle cx="195" cy="32" r="15" fill="#ffffff" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="195" y2="21" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="203" y2="32" stroke="#0f172a" stroke-width="2"/>', svgB: '<circle cx="195" cy="32" r="15" fill="#fef08a" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="195" y2="21" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="186" y2="32" stroke="#0f172a" stroke-width="2"/>' }, // 1. Jam Dinding (Jarum & Warna)
            { id: 1, x: 37, y: 16, r: 20, svgA: '<rect x="22" y="8" width="9" height="17" fill="#3b82f6"/><rect x="33" y="6" width="9" height="19" fill="#10b981"/>', svgB: '<rect x="22" y="8" width="9" height="17" fill="#3b82f6"/>' }, // 2. Buku Hijau di Rak Atas
            { id: 2, x: 117, y: 74, r: 22, svgA: '<circle cx="117" cy="74" r="12" fill="#38bdf8"/>', svgB: '<polygon points="117,60 131,86 103,86" fill="#f43f5e"/>' }, // 3. Ikon di Layar Monitor (Lingkaran Biru vs Segitiga Merah)
            { id: 3, x: 196, y: 83, r: 20, svgA: '<path d="M192,92 Q190,82 195,76 M200,92 Q198,82 203,76" stroke="#94a3b8" stroke-width="2" fill="none"/>', svgB: '' }, // 4. Uap Panas di Atas Mug
            { id: 4, x: 42, y: 145, r: 22, svgA: '<rect x="25" y="140" width="36" height="8" rx="3" fill="#22c55e"/>', svgB: '<rect x="25" y="140" width="36" height="8" rx="3" fill="#a855f7"/>' } // 5. Pena di Atas Meja (Hijau vs Ungu)
        ]
    },
    {
        judul: "Petualangan Bawah Laut",
        baseSVG:
            '<rect x="0" y="0" width="240" height="170" fill="#0284c7"/>' +
            '<rect x="0" y="140" width="240" height="30" fill="#fde047"/>' +
            // Kapal Selam
            '<ellipse cx="115" cy="75" rx="45" ry="24" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>' +
            '<rect x="105" y="40" width="16" height="14" fill="#eab308"/>' +
            '<rect x="105" y="36" width="24" height="6" rx="2" fill="#ca8a04"/>' +
            // Rumput Laut Kiri
            '<path d="M25,140 Q18,115 28,95 Q35,115 28,140" fill="#16a34a"/>' +
            '<path d="M38,140 Q45,118 36,102 Q28,118 38,140" fill="#15803d"/>',
        diffs: [
            { id: 0, x: 115, y: 75, r: 20, svgA: '<circle cx="115" cy="75" r="10" fill="#bae6fd" stroke="#0369a1" stroke-width="2"/>', svgB: '<rect x="105" y="65" width="20" height="20" rx="3" fill="#bae6fd" stroke="#0369a1" stroke-width="2"/>' }, // 1. Jendela Kapal Selam (Bulat vs Kotak)
            { id: 1, x: 64, y: 75, r: 18, svgA: '<polygon points="70,75 56,64 56,86" fill="#ef4444"/>', svgB: '<polygon points="70,75 56,64 56,86" fill="#22c55e"/>' }, // 2. Baling-baling Ekor Kapal Selam (Merah vs Hijau)
            { id: 2, x: 195, y: 45, r: 22, svgA: '<ellipse cx="195" cy="45" rx="14" ry="8" fill="#fb923c"/><polygon points="209,45 220,38 220,52" fill="#fb923c"/>', svgB: '<ellipse cx="195" cy="45" rx="14" ry="8" fill="#f472b6"/><polygon points="209,45 220,38 220,52" fill="#f472b6"/>' }, // 3. Warna Ikan Kecil di Kanan Atas
            { id: 3, x: 48, y: 38, r: 20, svgA: '<circle cx="48" cy="45" r="5" fill="#e0f2fe"/><circle cx="54" cy="32" r="3.5" fill="#e0f2fe"/>', svgB: '' }, // 4. Gelembung Udara Kiri Atas
            { id: 4, x: 180, y: 148, r: 20, svgA: '<polygon points="180,136 184,145 194,146 186,152 188,161 180,156 172,161 174,152 166,146 176,145" fill="#f97316"/>', svgB: '' } // 5. Bintang Laut di Pasir Kanan Bawah
        ]
    }
];

window.mulaiGame6SpotDiff = function() {
    let temaList = window.DAFTAR_TEMA_SPOT_DIFF;
    let tema = temaList[Math.floor(Math.random() * temaList.length)];

    document.getElementById('minigame-title').innerText = '🔍 6. Cari 5 Perbedaan Gambar';
    document.getElementById('minigame-subtitle').innerText = 'Sentuh/klik langsung pada 5 bagian yang berbeda antara Gambar 1 dan Gambar 2!';
    document.getElementById('minigame-score-val').innerText = '0/5';

    window.mgSpotState = {
        tema: tema,
        foundIds: []
    };

    window.renderUISpotDiff();

    window.jalankanTimerMiniGame(45, function() {
        window.selesaikanMiniGameDenganHadiah('Waktu selesai! Kamu menemukan ' + window.mgSpotState.foundIds.length + ' dari 5 perbedaan!');
    });
};

window.renderUISpotDiff = function() {
    let st = window.mgSpotState;
    let stage = document.getElementById('minigame-stage-body');
    if (!st || !stage) return;

    let diffLayerA = '';
    let diffLayerB = '';
    let ringsLayer = '';

    st.tema.diffs.forEach(function(d) {
        diffLayerA += d.svgA;
        diffLayerB += d.svgB;
        if (st.foundIds.includes(d.id)) {
            ringsLayer += '<circle cx="' + d.x + '" cy="' + d.y + '" r="16" fill="none" stroke="#22c55e" stroke-width="3.5"/>';
            ringsLayer += '<circle cx="' + d.x + '" cy="' + d.y + '" r="16" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="3,3"/>';
        }
    });

    stage.innerHTML =
        '<div style="font-size:12px; font-weight:800; color:#0b3954; margin-bottom:8px;">🖼️ Tema: ' + st.tema.judul + ' (Ditemukan: ' + st.foundIds.length + '/5)</div>' +
        '<div class="mg-spot-wrapper">' +
            '<div class="mg-spot-box">' +
                '<div class="mg-spot-label">GAMBAR 1</div>' +
                '<svg viewBox="0 0 240 170" class="mg-spot-svg" onclick="window.klikGambarSpotDiff(event, this)">' +
                    st.tema.baseSVG + diffLayerA + ringsLayer +
                '</svg>' +
            '</div>' +
            '<div class="mg-spot-box">' +
                '<div class="mg-spot-label">GAMBAR 2</div>' +
                '<svg viewBox="0 0 240 170" class="mg-spot-svg" onclick="window.klikGambarSpotDiff(event, this)">' +
                    st.tema.baseSVG + diffLayerB + ringsLayer +
                '</svg>' +
            '</div>' +
        '</div>';
};

window.klikGambarSpotDiff = function(evt, svgEl) {
    let st = window.mgSpotState;
    if (!st) return;

    let rect = svgEl.getBoundingClientRect();
    let scaleX = 240 / rect.width;
    let scaleY = 170 / rect.height;
    let clickX = (evt.clientX - rect.left) * scaleX;
    let clickY = (evt.clientY - rect.top) * scaleY;

    let hitDiff = null;
    st.tema.diffs.forEach(function(d) {
        if (!st.foundIds.includes(d.id)) {
            let dist = Math.hypot(clickX - d.x, clickY - d.y);
            if (dist <= (d.r || 22)) {
                hitDiff = d;
            }
        }
    });

    if (hitDiff) {
        st.foundIds.push(hitDiff.id);
        document.getElementById('minigame-score-val').innerText = st.foundIds.length + '/5';
        window.renderUISpotDiff();

        if (st.foundIds.length >= 5) {
            let t = setTimeout(function() {
                window.selesaikanMiniGameDenganHadiah('Mata Elang! Kamu berhasil menemukan kelima perbedaan pada gambar!');
            }, 350);
            window.minigameActiveTimers.push(t);
        }
    } else {
        // Beri tanda silang merah singkat jika salah klik
        let missMark = document.createElementNS("http://www.w3.org/2000/svg", "text");
        missMark.setAttribute("x", clickX - 6);
        missMark.setAttribute("y", clickY + 6);
        missMark.setAttribute("fill", "#ef4444");
        missMark.setAttribute("font-size", "16");
        missMark.setAttribute("font-weight", "bold");
        missMark.textContent = "✕";
        svgEl.appendChild(missMark);
        setTimeout(function() { if (missMark.parentNode) missMark.remove(); }, 450);
    }
};

/* =========================================================================
   TAHAP 3: ROMBAK CONTENT BLOCK DINAMIS, PATTERN DI DALAM BLOK, & LINE SPACING
   ========================================================================= */

// 1. Matikan Pengunci Kertas A4 & Hapus Garis Siku Margin 4 Sudut
window.matikanPengunciKertasA4 = function() {
    let styleA4 = document.getElementById('ms-word-a4-override');
    if (styleA4) styleA4.remove();
    document.querySelectorAll('.a4-page-numbers-container').forEach(function(el) {
        el.remove();
    });
};
window.matikanPengunciKertasA4();

// Nonaktifkan fungsi pemotong halaman A4 otomatis agar blok memanjang bebas ke bawah
window.pasangGayaKertasWordA4 = function() { window.matikanPengunciKertasA4(); };
window.jalankanPaginasiWord = function() { window.matikanPengunciKertasA4(); };
window.rapikanSemuaBlokA4Word = function() { window.matikanPengunciKertasA4(); };
window.rapikanHalamanA4Word = function() {};
window.bangunLembarCetakPresisiA4 = function() {};
window.bersihkanLembarCetakPresisiA4 = function() {};
window.cekBatasTinggiA4Keydown = function() {};

// Saat mengetik, cukup sesuaikan tinggi kanvas coretan & simpan ke DB tanpa memotong blok
window.cekBatasTinggiA4Input = function(e, el) {
    let idx = parseInt(el.getAttribute('data-index'), 10);
    if (!isNaN(idx) && window.contentBlocksData && window.contentBlocksData[idx]) {
        window.contentBlocksData[idx].html = el.innerHTML;
    }
    clearTimeout(el._dynCanvasTimer);
    el._dynCanvasTimer = setTimeout(function() {
        if (typeof window.inisialisasiSemuaCanvas === 'function') {
            window.inisialisasiSemuaCanvas();
        }
    }, 150);
};

// Cetak materi langsung tanpa pemotong kaku A4
window.cetakMateriHalamanA4 = function() {
    window.print();
};

// 2. Render Content Block Dinamis (Pattern & Warna Latar Berada DI DALAM Content Block)
window.renderBlocks = function() {
    window.matikanPengunciKertasA4();
    let html = '';
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');

    window.contentBlocksData.forEach(function(blok, index) {
        if (!blok.floatImages) blok.floatImages = [];
        let widthMode = blok.width || 'M';
        let bgCol = blok.bg || '#ffffff';
        let patClass = blok.pattern || '';
        let txtCol = blok.color || '#333333';
        let padTop = blok.padTop || '25px';
        let padBot = blok.padBot || '25px';

        // A. TIPE BLOK SLIDE PDF
        if (blok.type === 'pdf_slides') {
            let slides = Array.isArray(blok.slides) ? blok.slides : [];
            let sIdx = typeof blok.activeSlide === 'number' ? blok.activeSlide : 0;
            if (sIdx < 0) sIdx = 0;
            if (sIdx >= slides.length) sIdx = Math.max(0, slides.length - 1);
            blok.activeSlide = sIdx;

            let curSlide = slides[sIdx] || { bg: '', drawing: '', floatImages: [] };
            let isFocus = (window.focusedPdfBlockIndex === index);
            let floatImgsHtml = window.renderFloatImagesHTML(index, sIdx, curSlide.floatImages || []);

            html += '<div class="block-wrapper' + (isFocus ? ' pdf-focus-fullscreen' : '') + '" data-index="' + index + '" style="padding-top:' + padTop + ';padding-bottom:' + padBot + ';">' +
                '<div class="block-controls">' +
                    '<button onclick="geserBlok(' + index + ', -1)">⬆️</button>' +
                    '<button onclick="geserBlok(' + index + ', 1)">⬇️</button>' +
                    '<button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button>' +
                    '<button onclick="hapusBlok(' + index + ')">🗑️ Delete</button>' +
                '</div>' +
                '<div class="content-block pdf-landscape-block ' + patClass + '" data-index="' + index + '" data-block-type="pdf_slides" style="background-color:' + bgCol + ';">' +
                    '<div class="pdf-slide-nav-bar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:nowrap; overflow-x:auto;">' +
                        '<div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">' +
                            '<button onclick="window.gantiSlidePDF(' + index + ', -1)" ' + (sIdx <= 0 ? 'disabled' : '') + '>◀ Prev</button>' +
                            '<span style="font-weight:bold; color:#f1c40f; display:flex; align-items:center; gap:4px; font-size:11px;">Hal ' +
                                '<input type="number" min="1" max="' + slides.length + '" value="' + (sIdx + 1) + '" ' +
                                'style="width:35px; text-align:center; font-weight:bold; background:rgba(255,255,255,0.2); color:#f1c40f; border:1px solid rgba(255,255,255,0.3); border-radius:4px; padding:2px;" ' +
                                'onchange="window.lompatKeSlidePDF(' + index + ', this.value)" ' +
                                'onkeydown="if(event.key===\'Enter\'){ this.blur(); window.lompatKeSlidePDF(' + index + ', this.value); }"> / ' + slides.length +
                            '</span>' +
                            '<button onclick="window.gantiSlidePDF(' + index + ', 1)" ' + (sIdx >= slides.length - 1 ? 'disabled' : '') + '>Next ▶</button>' +
                        '</div>' +
                        '<div style="font-weight:700; color:#ecf0f1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; text-align:center; margin:0 10px; font-size:11px;" title="' + (blok.title || 'Slide Materi PDF') + '">📄 ' + (blok.title || 'Slide Materi PDF') + '</div>' +
                        '<div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">' +
                            '<button onclick="window.toggleDrawingMode()" style="background:#ffeaa7; color:#2c3e50; border-color:#fdcb6e;">🖍️ Draw</button>' +
                            '<button onclick="window.toggleFokusSlidePDF(' + index + ')" style="background:#2980b9;">' + (isFocus ? '🗗 Tutup Fokus' : '🔍 Mode Fokus') + '</button>' +
                            '<button onclick="window.exportSlidePDFKeA4(' + index + ')" style="background:#27ae60;">📥 Export PDF</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="pdf-slide-stage" data-index="' + index + '" data-slide-index="' + sIdx + '" onpointerdown="window.mulaiSwipeSlidePDF(event, ' + index + ')" onpointerup="window.akhirSwipeSlidePDF(event, ' + index + ')">' +
                        '<img class="pdf-slide-bg" src="' + (curSlide.bg || '') + '" alt="Slide PDF">' +
                        '<div class="draw-float-layer" data-index="' + index + '" data-slide-index="' + sIdx + '">' + floatImgsHtml + '</div>' +
                        '<canvas class="drawing-layer" data-index="' + index + '" data-slide-index="' + sIdx + '"></canvas>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }
        // B. TIPE BLOK KUIS INLINE
        else if (blok.type === 'quiz') {
            let judulKuis = blok.quizTitle || '🧩 Uji Pemahaman';
            let editJudulAttr = isEdit ? 'contenteditable="true" style="outline:none; border-bottom:1px dashed #3498db; padding-bottom:2px;" onblur="window.contentBlocksData[' + index + '].quizTitle=this.innerText; if(window.simpanKeDB) window.simpanKeDB();"' : '';

            let qi = '<div class="quiz-container" id="inline-kuis-' + index + '">' +
                    '<div class="quiz-header">' +
                        '<h3 class="quiz-title" ' + editJudulAttr + '>' + judulKuis + '</h3>' +
                        '<div>' +
                            '<button class="btn-action" style="background:#34495e;width:auto;font-size:11px;padding:6px 12px;margin-right:5px;" onclick="cetakKuisPDF(\'inline-kuis-' + index + '\',\'Materi\')">🖨️ Cetak</button>' +
                            (isEdit ? '<button class="btn-action" style="background:#2e7d32;width:auto;font-size:11px;padding:6px 12px;" onclick="bukaAIQuizModal(' + index + ')">🤖 Ekstrak</button>' : '') +
                        '</div>' +
                    '</div>';

            if (blok.questions && blok.questions.length > 0) {
                blok.questions.forEach(function(q, qIdx) {
                    if (q.drawing === undefined) q.drawing = "";
                    let isBahasOpen = !!q.isBahasOpen;

                    let qTextHtml = isEdit
                        ? '<div class="quiz-question-text" contenteditable="true" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'q\',this)">' + (qIdx + 1) + '. ' + q.question + '</div>'
                        : '<div class="quiz-question-text">' + (qIdx + 1) + '. ' + q.question + '</div>';

                    qi += '<div class="quiz-question-card" id="inline-q-' + index + '-' + qIdx + '">';
                    if (isEdit) qi += '<button class="btn-delete-q" onclick="hapusSoalSistem(' + qIdx + ', \'inline\', ' + index + ')" title="Hapus Soal">🗑️</button>';
                    qi += qTextHtml;

                    if (q.type === 'short_answer' || (!q.options && q.correctAnswers)) {
                        let altStr = q.correctAnswers ? q.correctAnswers.join(' | ') : '';
                        qi += '<div class="short-answer-box" style="margin-top:10px;">' +
                            '<input type="text" class="input-box" placeholder="Ketik jawaban singkat lalu tekan Enter..." style="font-size:15px; font-weight:600; padding:10px 12px; border:2px solid #3498db; border-radius:8px; width:100%; box-sizing:border-box;" onchange="jawabKuisInlineIsian(this, ' + index + ', ' + qIdx + ')">' +
                            (isEdit ? '<div style="font-size:11px; color:#c0392b; margin-top:8px; background:#fadbd8; padding:6px; border-radius:4px; border-left:4px solid #e74c3c;" contenteditable="true" oninput="updateKunciIsianInline(' + index + ',' + qIdx + ',this.innerText)"><b>🔒 Info Admin (Edit Kunci):</b> ' + altStr + '</div>' : '') +
                        '</div>';
                    } else if (q.type === 'essay') {
                        let altStr = q.correctAnswers ? q.correctAnswers.join(' | ') : '';
                        qi += '<div class="short-answer-box" style="margin-top:10px;">' +
                            '<textarea class="input-box" placeholder="Ketik jawaban uraian/essay di sini..." rows="4" style="font-size:14px; padding:10px 12px; border:2px solid #3498db; border-radius:8px; width:100%; box-sizing:border-box; resize:vertical;"></textarea>' +
                            (isEdit ? '<div style="font-size:11px; color:#c0392b; margin-top:8px; background:#fadbd8; padding:6px; border-radius:4px; border-left:4px solid #e74c3c;" contenteditable="true" oninput="updateKunciIsianInline(' + index + ',' + qIdx + ',this.innerText)"><b>🔒 Kunci/Poin Essay:</b> ' + altStr + '</div>' : '') +
                        '</div>';
                    } else if (q.type === 'pgk') {
                        qi += '<div class="quiz-options">';
                        (q.options || []).forEach(function(opt, oIdx) {
                            let isKunci = isEdit ? (q.correctIndices && q.correctIndices.includes(oIdx)) : false;
                            if (isEdit) {
                                qi += '<div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">' +
                                      '<input type="checkbox" ' + (isKunci ? 'checked' : '') + ' style="width:16px;height:16px;cursor:pointer;accent-color:#27ae60;" onchange="updateKunciInlinePGK(' + index + ',' + qIdx + ',' + oIdx + ', this.checked)" title="Jadikan Kunci Jawaban">' +
                                      '<div class="quiz-option-btn" contenteditable="true" style="flex:1; margin:0;" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'o\',this,' + oIdx + ')">' + String.fromCharCode(65 + oIdx) + '. ' + opt + '</div>' +
                                      '</div>';
                            } else {
                                qi += '<label id="lbl-inline-pgk-' + index + '-' + qIdx + '-' + oIdx + '" class="quiz-option-btn" style="display:flex; align-items:center; gap:10px; cursor:pointer;">' +
                                      '<input type="checkbox" style="width:18px; height:18px; cursor:pointer; accent-color:#27ae60;" class="chk-inline-pgk-' + index + '-' + qIdx + '" value="' + oIdx + '">' +
                                      '<span>' + String.fromCharCode(65 + oIdx) + '. ' + opt + '</span>' +
                                      '</label>';
                            }
                        });
                        if (!isEdit) {
                            qi += '<button class="btn-action" id="btn-submit-pgk-' + index + '-' + qIdx + '" style="background:#27ae60; width:100%; margin-top:10px; padding:10px;" onclick="koreksiKuisInlinePGK(' + index + ',' + qIdx + ')">Kirim Jawaban PGK</button>';
                        }
                        qi += '</div>';
                    } else {
                        qi += '<div class="quiz-options">';
                        (q.options || []).forEach(function(opt, oIdx) {
                            let isKunci = isEdit ? (q.correctIndex === oIdx) : false;
                            if (isEdit) {
                                qi += '<div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">' +
                                      '<input type="radio" name="kunci-' + index + '-' + qIdx + '" ' + (isKunci ? 'checked' : '') + ' style="width:16px;height:16px;cursor:pointer;accent-color:#27ae60;" onchange="updateKunciInline(' + index + ',' + qIdx + ',' + oIdx + ')" title="Jadikan Kunci Jawaban">' +
                                      '<div class="quiz-option-btn" contenteditable="true" style="flex:1; margin:0;" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'o\',this,' + oIdx + ')">' + String.fromCharCode(65 + oIdx) + '. ' + opt + '</div>' +
                                      '</div>';
                            } else {
                                qi += '<button class="quiz-option-btn" id="opt-inline-' + index + '-' + qIdx + '-' + oIdx + '" onclick="jawabKuisInline(this,' + index + ',' + qIdx + ',' + oIdx + ',' + q.correctIndex + ')">' + String.fromCharCode(65 + oIdx) + '. ' + opt + '</button>';
                            }
                        });
                        qi += '</div>';
                    }

                    let btnBahas = '<div style="margin-top:15px; border-top:1px dashed #ddd; padding-top:10px; display:flex; justify-content:space-between; align-items:center;">' +
                                   '<button class="btn-action" style="background:#8e44ad; padding:6px 14px; font-size:12px; width:auto; border-radius:20px;" onclick="togglePembahasanInline(' + index + ',' + qIdx + ', ' + (!isEdit) + ')">' +
                                   '<span id="icon-bahas-' + index + '-' + qIdx + '">' + (isBahasOpen ? '− Tutup' : '+ Buka') + '</span> Pembahasan</button></div>';
                    qi += btnBahas;

                    let displayBahas = isBahasOpen ? 'block' : 'none';
                    let editBahasAttr = isEdit ? 'contenteditable="true" class="content-block"' : 'class="content-block"';

                    qi += '<div id="bahas-box-' + index + '-' + qIdx + '" style="display:' + displayBahas + '; margin-top:12px; padding:15px; background:#fdfefe; border:1px solid #d5dbdb; border-left:4px solid #8e44ad; border-radius:8px; position:relative; min-height:80px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">';
                    qi += '<canvas class="drawing-layer" data-index="' + index + '" data-q-index="' + qIdx + '" style="z-index:3;"></canvas>';
                    qi += '<div ' + editBahasAttr + ' data-index="' + index + '" style="position:relative; z-index:4; min-height:50px; background:transparent; border:none; outline:none; max-width:100% !important; padding:0 !important; box-shadow:none !important;" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'e\',this)">' + (q.explanation || 'Ketik pembahasan lengkap di sini...') + '</div>';
                    qi += '</div></div>';
                });

                qi += '<div class="quiz-nav-bar" style="margin-top:0;border-top:none;">';
                blok.questions.forEach(function(q, qIdx) {
                    qi += '<button class="quiz-nav-btn" id="nav-btn-inline-' + index + '-' + qIdx + '" onclick="document.querySelector(\'#inline-q-' + index + '-' + qIdx + '\').scrollIntoView({behavior:\'smooth\',block:\'center\'})">' + (qIdx + 1) + '</button>';
                });
                qi += '</div>';
            } else {
                qi += '<p style="color:#888;">Belum ada soal.</p>';
            }
            qi += '</div>';

            let floatImgsQuiz = window.renderFloatImagesHTML(index, -1, blok.floatImages || []);
            html += '<div class="block-wrapper" data-index="' + index + '" style="padding-top:' + padTop + ';padding-bottom:' + padBot + ';">' +
                '<div class="block-controls"><button onclick="geserBlok(' + index + ', -1)">⬆️</button><button onclick="geserBlok(' + index + ', 1)">⬇️</button><button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button><button onclick="hapusBlok(' + index + ')">🗑️ Delete</button></div>' +
                '<div class="a4-paper-wrapper dynamic-block-shell" data-width="' + widthMode + '">' +
                    '<div class="draw-float-layer" data-index="' + index + '">' + floatImgsQuiz + '</div>' +
                    '<canvas class="drawing-layer" data-index="' + index + '"></canvas>' +
                    '<div class="content-block dynamic-content-block ' + patClass + '" data-index="' + index + '" data-width="' + widthMode + '" style="background-color:' + bgCol + ';">' +
                        qi +
                    '</div>' +
                '</div>' +
            '</div>';
        }
        // C. TIPE BLOK TEKS & TABEL DINAMIS (LEBAR S/M/L/XL & PANJANG BEBAS KE BAWAH)
        else {
            let floatImgsText = window.renderFloatImagesHTML(index, -1, blok.floatImages || []);
            html += '<div class="block-wrapper" data-index="' + index + '" style="padding-top:' + padTop + ';padding-bottom:' + padBot + ';">' +
                '<div class="block-controls"><button onclick="geserBlok(' + index + ', -1)">⬆️</button><button onclick="geserBlok(' + index + ', 1)">⬇️</button><button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button><button onclick="hapusBlok(' + index + ')">🗑️ Delete</button></div>' +
                '<div class="a4-paper-wrapper dynamic-block-shell" data-width="' + widthMode + '">' +
                    '<div class="draw-float-layer" data-index="' + index + '">' + floatImgsText + '</div>' +
                    '<canvas class="drawing-layer" data-index="' + index + '"></canvas>' +
                    '<div class="content-block a4-portrait-block dynamic-content-block ' + patClass + '" ' + (isEdit ? 'contenteditable="true"' : '') + ' data-index="' + index + '" data-block-type="text" data-width="' + widthMode + '" style="background-color:' + bgCol + '; color:' + txtCol + ';" oninput="window.cekBatasTinggiA4Input(event, this)">' +
                        blok.html +
                    '</div>' +
                '</div>' +
            '</div>';
        }
    });

    let container = document.getElementById('blocks-container');
    if (container) container.innerHTML = html;

    if (window.renderMathJax) window.renderMathJax();
    setTimeout(function() {
        if (typeof window.inisialisasiSemuaCanvas === 'function') window.inisialisasiSemuaCanvas();
    }, 150);
};

// 3. Pengaturan Style & Pattern (Langsung di Dalam Content Block, Bukan di Luar)
window.bukaSidebarBlock = function(i) {
    window.activeBlockIndex = i;
    let b = window.contentBlocksData[i];
    if (!b) return;
    let inTop = document.querySelector('input[oninput*="padTop"]');
    let inBot = document.querySelector('input[oninput*="padBot"]');
    if (inTop) inTop.value = parseInt(b.padTop) || 25;
    if (document.getElementById('val-padtop')) document.getElementById('val-padtop').innerText = b.padTop || '25px';
    if (inBot) inBot.value = parseInt(b.padBot) || 25;
    if (document.getElementById('val-padbot')) document.getElementById('val-padbot').innerText = b.padBot || '25px';
    document.getElementById('sidebar-block').classList.add('open');
};

window.ubahStyleBlok = function(t, v) {
    let idx = (typeof window.activeBlockIndex === 'number' && window.activeBlockIndex > -1) ? window.activeBlockIndex : -1;
    if (idx === -1 || !window.contentBlocksData[idx]) return;

    window.contentBlocksData[idx][t] = v;
    let d = document.querySelector('.content-block[data-index="' + idx + '"]');
    let shell = d ? d.closest('.dynamic-block-shell') : null;
    let wrap = document.querySelector('.block-wrapper[data-index="' + idx + '"]');

    if (d) {
        if (t === 'bg') d.style.backgroundColor = v;
        if (t === 'color') d.style.color = v;
        if (t === 'width') {
            d.setAttribute('data-width', v);
            if (shell) shell.setAttribute('data-width', v);
            setTimeout(function() {
                if (typeof window.inisialisasiSemuaCanvas === 'function') window.inisialisasiSemuaCanvas();
            }, 100);
        }
    }
    if (wrap) {
        if (t === 'padTop') wrap.style.paddingTop = v;
        if (t === 'padBot') wrap.style.paddingBottom = v;
    }
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
};

window.ubahPolaBkg = function(pola) {
    let idx = (typeof window.activeBlockIndex === 'number' && window.activeBlockIndex > -1) ? window.activeBlockIndex : -1;
    if (idx === -1 || !window.contentBlocksData[idx]) return;

    window.contentBlocksData[idx].pattern = pola;
    let d = document.querySelector('.content-block[data-index="' + idx + '"]');
    let wrap = document.querySelector('.block-wrapper[data-index="' + idx + '"]');

    // Pastikan wrapper luar bersih dan pattern hanya ada di dalam content-block
    if (wrap) wrap.classList.remove('bg-pattern-lines', 'bg-pattern-grid', 'bg-pattern-dots');
    if (d) {
        d.classList.remove('bg-pattern-lines', 'bg-pattern-grid', 'bg-pattern-dots');
        if (pola) d.classList.add(pola);
    }
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
};

// 4. Mesin Line Spacing Baru: Atas = 0, Bawah = 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2
window.aturSpasiParagraf = function(cmd) {
    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let range = sel.getRangeAt(0);
    let anchorEl = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer;
    let editable = (anchorEl && anchorEl.closest) ? anchorEl.closest('.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area') : window.lastActiveEditable;
    if (!editable) return;

    let rawVal = String(cmd).replace('line-', '').trim();
    let numVal = parseFloat(rawVal);
    if (isNaN(numVal)) return;

    // Peta skala jarak bawah baris & kerapatan baris (0.25 sangat dempet s/d 2 renggang, atas selalu 0)
    let petaSpasiBawah = {
        "0.25": { lh: "0.88", mb: "0.05em" },
        "0.5":  { lh: "1.02", mb: "0.15em" },
        "0.75": { lh: "1.15", mb: "0.25em" },
        "1":    { lh: "1.30", mb: "0.38em" },
        "1.25": { lh: "1.45", mb: "0.52em" },
        "1.5":  { lh: "1.62", mb: "0.72em" },
        "2":    { lh: "1.90", mb: "1.05em" }
    };
    let cfg = petaSpasiBawah[String(numVal)] || { lh: String(numVal), mb: (numVal * 0.4) + "em" };

    // Cari semua elemen baris/paragraf yang berada di dalam blok seleksi
    let targetBlocks = Array.from(editable.querySelectorAll('p, div, li, h1, h2, h3, h4, h5, h6, blockquote, td')).filter(function(blk) {
        if (!range.intersectsNode(blk)) return false;
        let hasChildBlock = blk.querySelector('p, div, li, h1, h2, h3, h4, h5, h6, blockquote');
        return !hasChildBlock;
    });

    // Jika kursor hanya berada di 1 baris atau teks belum dibungkus <p>
    if (targetBlocks.length === 0) {
        let closestBlk = anchorEl.closest ? anchorEl.closest('p, div, li, h1, h2, h3, h4, h5, h6, blockquote, td') : null;
        if (!closestBlk || closestBlk === editable) {
            document.execCommand('formatBlock', false, '<P>');
            let newSel = window.getSelection();
            if (newSel && newSel.anchorNode) {
                let nEl = newSel.anchorNode.nodeType === 3 ? newSel.anchorNode.parentElement : newSel.anchorNode;
                closestBlk = nEl.closest ? nEl.closest('p, div, li, h1, h2, h3, h4, h5, h6, blockquote, td') : null;
            }
        }
        if (closestBlk && closestBlk !== editable) {
            targetBlocks.push(closestBlk);
        }
    }

    if (targetBlocks.length > 0) {
        targetBlocks.forEach(function(blk) {
            blk.style.marginTop = "0px";
            blk.style.paddingTop = "0px";
            blk.style.marginBottom = cfg.mb;
            blk.style.lineHeight = cfg.lh;
            blk.querySelectorAll('*').forEach(function(child) {
                if (child.style && child.style.lineHeight) child.style.lineHeight = "";
            });
        });
    } else {
        editable.style.lineHeight = cfg.lh;
    }

    editable.dispatchEvent(new Event('input', { bubbles: true }));
};