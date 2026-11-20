/* =========================================================================
   MODUL GERBANG UJIAN, RUANG UJIAN KETAT (ANTI-CHEAT & WAKE LOCK),
   NAVIGASI CBT MELAYANG, REKAP NILAI, SPREADSHEET, OCR LJK, & KOREKSI MANUAL
   ========================================================================= */

window.adminRekapNilaiData = window.adminRekapNilaiData || {};
window.adminUjianAktifData = window.adminUjianAktifData || {};
window.adminLiveMonitorData = window.adminLiveMonitorData || {};
window.koreksiDataBuffer = {};
window.sedangDialogSistem = false;
window.graceOrientationTime = 0;
window.graceKeyboardTime = 0;
window.graceZoomTime = 0;
window.lastDPRUjian = window.devicePixelRatio || 1;
window.screenGuardInterval = null;
window.ujianWakeLock = null;
window.ujianWakeLockTimer = null;
window.ujianEntryShieldUntil = 0;
window.timerIntervalUjian = null;
window.lastViolationTime = window.lastViolationTime || 0;
window.blurCheckTimer = null;

// =========================================================================
// 0. HELPER SINKRONISASI KUNCI FIREBASE, REKAP NILAI, & KUNCI SOAL CBT
// =========================================================================
window.sanitasiKeyRekapFirebase = window.sanitasiKeyRekapFirebase || function(str) {
    return String(str || "").trim().replace(/[.#\[\]\/]/g, "_");
};

window.ambilObjekRekapKelas = function(kls) {
    if (!kls || !window.adminRekapNilaiData) return {};
    let safeKls = window.sanitasiKeyRekapFirebase(kls);
    let hasil = {};

    let sumber = [];
    if (window.adminRekapNilaiData[kls]) sumber.push(window.adminRekapNilaiData[kls]);
    if (safeKls !== kls && window.adminRekapNilaiData[safeKls]) sumber.push(window.adminRekapNilaiData[safeKls]);

    Object.keys(window.adminRekapNilaiData).forEach(function(kKey) {
        if (kKey !== kls && kKey !== safeKls && window.sanitasiKeyRekapFirebase(kKey).toLowerCase() === safeKls.toLowerCase()) {
            sumber.push(window.adminRekapNilaiData[kKey]);
        }
    });

    sumber.forEach(function(objKls) {
        Object.keys(objKls || {}).forEach(function(pktKey) {
            if (!hasil[pktKey]) hasil[pktKey] = {};
            Object.assign(hasil[pktKey], objKls[pktKey] || {});
        });
    });
    return hasil;
};

window.ambilObjekRekapPaket = function(kls, paket) {
    if (!kls || !paket) return {};
    let rekapKls = window.ambilObjekRekapKelas(kls);
    let safePkt = window.sanitasiKeyRekapFirebase(paket).toLowerCase();
    let targetPktLow = String(paket).trim().toLowerCase();
    let gabunganSiswa = {};

    Object.keys(rekapKls).forEach(function(pKey) {
        let pKeyLow = String(pKey).trim().toLowerCase();
        let pKeySafe = window.sanitasiKeyRekapFirebase(pKey).toLowerCase();
        let mapSiswa = rekapKls[pKey] || {};
        let sampel = Object.values(mapSiswa)[0];
        let paketAsliLow = (sampel && sampel.paketAsli) ? String(sampel.paketAsli).trim().toLowerCase() : "";

        if (pKeyLow === targetPktLow || pKeySafe === safePkt || paketAsliLow === targetPktLow) {
            Object.assign(gabunganSiswa, mapSiswa);
        }
    });
    return gabunganSiswa;
};

window.ambilDataSiswaDiObjekRekap = function(rekapPaketObj, namaSiswa) {
    if (!rekapPaketObj || !namaSiswa) return null;
    if (rekapPaketObj[namaSiswa]) return rekapPaketObj[namaSiswa];

    let safeNama = window.sanitasiKeyRekapFirebase(namaSiswa);
    if (rekapPaketObj[safeNama]) return rekapPaketObj[safeNama];

    let targetLow = String(namaSiswa).trim().toLowerCase();
    let safeLow = safeNama.toLowerCase();

    let foundKey = Object.keys(rekapPaketObj).find(function(k) {
        let item = rekapPaketObj[k];
        let namaAsliLow = (item && item.namaAsli) ? String(item.namaAsli).trim().toLowerCase() : "";
        return k.toLowerCase() === targetLow || window.sanitasiKeyRekapFirebase(k).toLowerCase() === safeLow || namaAsliLow === targetLow;
    });
    return foundKey ? rekapPaketObj[foundKey] : null;
};

window.normalisasiKunciPGK = window.normalisasiKunciPGK || function(ans, options) {
    if (ans === undefined || ans === null || ans === "") return [];
    let rawArr = Array.isArray(ans) ? ans : [ans];
    let opts = Array.isArray(options) ? options : [];
    let hasil = [];

    rawArr.forEach(function(item) {
        let s = String(item || "").trim();
        if (!s) return;
        let upper = s.toUpperCase();
        if (/^[A-F]$/.test(upper)) {
            if (!hasil.includes(upper)) hasil.push(upper);
            return;
        }
        let matchOpt = opts.find(function(o) {
            return String(o.label || "").toUpperCase() === upper || String(o.text || "").trim().toLowerCase() === s.toLowerCase();
        });
        if (matchOpt && matchOpt.label) {
            let lbl = String(matchOpt.label).toUpperCase();
            if (!hasil.includes(lbl)) hasil.push(lbl);
        } else if (!hasil.includes(upper)) {
            hasil.push(upper);
        }
    });
    return hasil.sort();
};

window.apakahJawabanPGKBenar = window.apakahJawabanPGKBenar || function(ans, correct, options) {
    let normAns = window.normalisasiKunciPGK(ans, options);
    let normKey = window.normalisasiKunciPGK(correct, options);
    if (normAns.length === 0 || normAns.length !== normKey.length) return false;
    return normAns.every(function(val, idx) { return val === normKey[idx]; });
};

window.dapatkanPoinXPPerSoal = window.dapatkanPoinXPPerSoal || function(tipe) {
    let t = String(tipe || "PG").toUpperCase();
    if (t === "ESSAY" || t === "ESAI") return 15;
    if (t === "IS" || t === "ISIAN" || t === "PGK") return 10;
    return 5;
};

// =========================================================================
// 1. GERBANG MASUK UJIAN SISWA & DETEKSI LAYAR PENUH PRA-UJIAN
// =========================================================================
window.ambilAkunSiswaAktifUjian = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let rawUser = (sessionStorage.getItem("username") || "").trim();
    let userKey = rawUser.toLowerCase();
    if (stat !== "siswa" || !userKey || userKey === "sbd" || userKey === "tamu") return null;

    let mapAkun = window.akunSiswaData || {};
    if (mapAkun[userKey]) return mapAkun[userKey];
    if (mapAkun[rawUser]) return mapAkun[rawUser];

    let foundKey = Object.keys(mapAkun).find(function(k) {
        return k.toLowerCase() === userKey;
    });
    if (foundKey) return mapAkun[foundKey];

    let mapLB = window.leaderboardSiswaData || {};
    let lbData = mapLB[userKey] || mapLB[rawUser];
    if (lbData && lbData.namaLengkap && lbData.kelas) {
        return {
            username: userKey,
            namaLengkap: lbData.namaLengkap,
            kelas: lbData.kelas
        };
    }
    return null;
};

window.bukaModalMasukUjianSiswa = function() {
    let stat = sessionStorage.getItem("statusLogin");
    if (!stat || stat === "tamu") {
        alert("🔒 Akses Ditolak: Mode Ujian terkunci. Anda wajib LOGIN menggunakan akun Siswa terlebih dahulu!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }
    if (typeof window.pastikanListenerBankUjianAktif === "function") {
        window.pastikanListenerBankUjianAktif();
    }
    window.bukaModal('modal-enter-ujian');
    window.renderDropdownKelasUjian();
};

window.renderDropdownKelasUjian = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let rawUser = (sessionStorage.getItem("username") || "").trim();
    let userKey = rawUser.toLowerCase();

    if (!stat || stat === "tamu") {
        window.tutupModal('modal-enter-ujian');
        alert("🔒 Akses Ditolak: Mode Ujian terkunci. Anda harus LOGIN menggunakan akun Siswa resmi.");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    let selKelas = document.getElementById('ujian-select-kelas');
    let selNama = document.getElementById('ujian-select-nama');
    let inpNamaManual = document.getElementById('ujian-input-nama-manual');
    let inpKode = document.getElementById('input-kode-ujian');
    if (!selKelas || !selNama) return;

    if (inpKode) inpKode.value = "";

    // JIKA LOGIN SEBAGAI SISWA RESMI: KUNCI OTOMATIS KELAS & NAMA SESUAI AKUNNYA
    if (stat === "siswa" && userKey !== "sbd") {
        let akun = window.ambilAkunSiswaAktifUjian();
        if (akun && akun.kelas && akun.namaLengkap) {
            let safeKls = akun.kelas.replace(/"/g, '&quot;');
            let safeNama = akun.namaLengkap.replace(/"/g, '&quot;');

            selKelas.innerHTML = '<option value="' + safeKls + '" selected>🔒 ' + akun.kelas + ' (Terkunci Sesuai Akun)</option>';
            selKelas.value = akun.kelas;
            selKelas.disabled = true;
            selKelas.style.background = '#eef2f7';
            selKelas.style.color = '#0b3954';
            selKelas.style.cursor = 'not-allowed';

            selNama.style.display = 'block';
            selNama.innerHTML = '<option value="' + safeNama + '" selected>🔒 ' + akun.namaLengkap + '</option>';
            selNama.value = akun.namaLengkap;
            selNama.disabled = true;
            selNama.style.background = '#eef2f7';
            selNama.style.color = '#0b3954';
            selNama.style.cursor = 'not-allowed';

            if (inpNamaManual) {
                inpNamaManual.style.display = 'none';
                inpNamaManual.value = "";
            }
            return;
        }
    }

    // JIKA LOGIN SEBAGAI ADMIN / AKUN TESTING SBD: BUKA PILIHAN KELAS & NAMA
    selKelas.disabled = false;
    selKelas.style.background = '';
    selKelas.style.color = '';
    selKelas.style.cursor = 'pointer';

    selNama.disabled = false;
    selNama.style.background = '';
    selNama.style.color = '';
    selNama.style.cursor = 'pointer';

    let htmlOpt = '<option value="">-- Pilih Kelas Anda --</option>';
    Object.keys(window.adminData || {}).sort().forEach(function(k) {
        htmlOpt += '<option value="' + k + '">' + k + '</option>';
    });

    if (rawUser.toUpperCase() === "SBD") {
        htmlOpt += '<option value="Umum">🌍 Kelas Umum (Akun SBD)</option>';
    }

    selKelas.innerHTML = htmlOpt;
    selNama.innerHTML = '<option value="">-- Pilih Kelas Terlebih Dahulu --</option>';
    if (inpNamaManual) {
        inpNamaManual.style.display = 'none';
        inpNamaManual.value = "";
    }
};

window.updateDropdownNamaUjian = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let userKey = (sessionStorage.getItem("username") || "").trim().toLowerCase();

    if (stat === "siswa" && userKey !== "sbd") {
        window.renderDropdownKelasUjian();
        return;
    }

    let kelas = document.getElementById('ujian-select-kelas').value;
    let selNama = document.getElementById('ujian-select-nama');
    let inpNamaManual = document.getElementById('ujian-input-nama-manual');

    if (!kelas) {
        selNama.innerHTML = '<option value="">-- Pilih Kelas Terlebih Dahulu --</option>';
        selNama.style.display = 'block';
        inpNamaManual.style.display = 'none';
        return;
    }

    if (kelas === "Umum") {
        selNama.style.display = 'none';
        inpNamaManual.style.display = 'block';
        inpNamaManual.value = "";
    } else {
        selNama.style.display = 'block';
        inpNamaManual.style.display = 'none';
        let htmlOpt = '<option value="">-- Pilih Nama Anda --</option>';
        (window.adminData[kelas] || []).slice().sort().forEach(function(s) {
            htmlOpt += '<option value="' + s + '">' + s + '</option>';
        });
        selNama.innerHTML = htmlOpt;
    }
};

window.aktifkanWakeLockUjian = async function() {
    try {
        if ('wakeLock' in navigator && window.isStrictUjianActive) {
            window.ujianWakeLock = await navigator.wakeLock.request('screen');
            window.ujianWakeLock.addEventListener('release', function() {
                window.ujianWakeLock = null;
            });
        }
    } catch (e) {}

    clearInterval(window.ujianWakeLockTimer);
    window.ujianWakeLockTimer = setInterval(async function() {
        if (!window.isStrictUjianActive) {
            clearInterval(window.ujianWakeLockTimer);
            return;
        }
        if ('wakeLock' in navigator && !window.ujianWakeLock && document.visibilityState === 'visible') {
            try {
                window.ujianWakeLock = await navigator.wakeLock.request('screen');
            } catch (e) {}
        }
    }, 10000);
};

window.matikanWakeLockUjian = function() {
    clearInterval(window.ujianWakeLockTimer);
    window.ujianWakeLockTimer = null;
    if (window.ujianWakeLock) {
        try { window.ujianWakeLock.release(); } catch (e) {}
        window.ujianWakeLock = null;
    }
};

// PENGAMAN TIRAI PRIVASI: Hanya buramkan soal saat penalti benar-benar aktif & bukan Admin
window.setTiraiPrivasiUjian = function(isBlur) {
    let cont = document.getElementById('ujian-strict-container');
    if (!cont) return;

    let isAdmin = sessionStorage.getItem("statusLogin") === "admin";
    let harusBlur = Boolean(isBlur && window.isPenaltyActive && !isAdmin);

    cont.style.filter = harusBlur ? 'blur(25px)' : 'none';
    cont.style.pointerEvents = harusBlur ? 'none' : 'auto';
    cont.style.transition = 'none';
};

window.pasangWatermarkIdentitasUjian = function() {
    let oldWm = document.getElementById('ujian-security-watermark');
    if (oldWm) oldWm.remove();
    if (!window.sesiUjianSiswa) return;

    let wm = document.createElement('div');
    wm.id = 'ujian-security-watermark';
    wm.style.cssText = 'position:fixed; inset:0; pointer-events:none; z-index:100000; overflow:hidden; display:grid; grid-template-columns:repeat(2, 1fr); align-content:space-around; gap:140px 80px; padding:60px 40px; opacity:0.05; user-select:none;';

    let teksWm = (window.sesiUjianSiswa.nama || 'SISWA') + ' • ' + (window.sesiUjianSiswa.kelas || '') + ' • ' + (window.sesiUjianSiswa.kode || '');
    let itemHtml = '';
    for (let i = 0; i < 6; i++) {
        itemHtml += '<div style="transform:rotate(-22deg); font-family:\'Montserrat\',sans-serif; font-size:14px; font-weight:900; color:#0b3954; white-space:nowrap; text-align:center;">' + teksWm + '</div>';
    }
    wm.innerHTML = itemHtml;
    let room = document.getElementById('ujian-strict-room');
    if (room) room.appendChild(wm);
};

window.apakahPerangkatIPhone = function() {
    let ua = navigator.userAgent || '';
    return /iPhone|iPod/i.test(ua);
};

window.apakahTransisiKeyboardAktif = function() {
    return Date.now() < (window.graceKeyboardTime || 0);
};

window.apakahTransisiZoomAktif = function() {
    return Date.now() < (window.graceZoomTime || 0);
};

window.cekKondisiLayarPenuhDanBersih = function() {
    // 1. Pelanggaran mutlak jika halaman disembunyikan (pindah tab, tekan Home, pindah aplikasi)
    if (document.visibilityState === 'hidden' || document.hidden) {
        return { aman: false, alasan: "Keluar dari ruang ujian atau membuka tab/aplikasi lain!" };
    }

    // 2. Masa transisi masuk ujian, putar orientasi, animasi keyboard, atau sedang mencubit zoom -> AMAN
    if (
        Date.now() < (window.ujianEntryShieldUntil || 0) ||
        Date.now() < (window.graceOrientationTime || 0) ||
        window.apakahTransisiKeyboardAktif() ||
        window.apakahTransisiZoomAktif()
    ) {
        return { aman: true, alasan: "" };
    }

    // 3. Khusus iPhone (iOS): iPhone tidak memiliki fitur Split-Screen.
    // Perubahan ukuran viewport di Safari iPhone murni berasal dari Pinch-to-Zoom / Page Zoom 'aA' & Address Bar.
    if (window.apakahPerangkatIPhone()) {
        return { aman: true, alasan: "" };
    }

    let rawSW = window.screen.availWidth || window.screen.width || window.innerWidth;
    let rawSH = window.screen.availHeight || window.screen.height || window.innerHeight;
    let iw = window.innerWidth;
    let ih = window.innerHeight;
    let uw = window.outerWidth || iw;
    let uh = window.outerHeight || ih;

    // Hitung lebar & tinggi efektif dengan memperhitungkan skala Zoom (agar Zoom In/Out tidak dianggap Split-Screen)
    let vScale = (window.visualViewport && window.visualViewport.scale) ? window.visualViewport.scale : 1;
    let vWidth = (window.visualViewport && window.visualViewport.width) ? window.visualViewport.width : iw;
    let effectiveWidth = Math.max(iw, vWidth * vScale);

    // Sesuaikan orientasi layar acuan (Portrait vs Landscape)
    let isLandscape = iw > ih;
    let sw = isLandscape ? Math.max(rawSW, rawSH) : Math.min(rawSW, rawSH);
    let sh = isLandscape ? Math.min(rawSW, rawSH) : Math.max(rawSW, rawSH);

    let isMobileOrTablet = /Android|iPad|iPhone|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);

    if (isMobileOrTablet) {
        // Di Android & iPad: deteksi Split-Screen samping jika lebar efektif menyempit drastis (< 68% lebar layar orientasi saat ini)
        if (effectiveWidth < sw * 0.68) {
            return { aman: false, alasan: "Terdeteksi mode Layar Terbelah (Split-Screen) atau Jendela Mengambang!" };
        }
        // Deteksi Split-Screen Atas-Bawah di Android jika sedang TIDAK mengetik di kotak input
        let activeEl = document.activeElement;
        let activeTag = (activeEl && activeEl.tagName) ? activeEl.tagName.toUpperCase() : '';
        let sedangFokusKetik = (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT');
        let effectiveHeight = (window.visualViewport && window.visualViewport.height) ? (window.visualViewport.height * vScale) : ih;
        if (!sedangFokusKetik && !window.apakahTransisiKeyboardAktif() && effectiveHeight < sh * 0.50) {
            return { aman: false, alasan: "Ukuran layar terlalu pendek (Terdeteksi Split-Screen Atas-Bawah / Pop-up App)!" };
        }
    } else {
        // Di Laptop/PC: gunakan outerWidth & outerHeight agar Zoom Browser (Ctrl +/-) tetap aman
        if (uw > 0 && uw < sw * 0.72) {
            return { aman: false, alasan: "Jendela browser diperkecil (Terdeteksi Split-Screen Samping). Maksimalkan jendela Anda!" };
        }
        if (uh > 0 && uh < sh * 0.68) {
            return { aman: false, alasan: "Tinggi jendela browser diperkecil (Terdeteksi Split-Screen Atas-Bawah)!" };
        }
    }

    return { aman: true, alasan: "" };
};

window.aktifkanFullscreenUjian = function() {
    if (window.apakahPerangkatIPhone()) return;

    let elem = document.documentElement;
    let opsiImmersive = { navigationUI: "hide" };
    try {
        if (elem.requestFullscreen) {
            elem.requestFullscreen(opsiImmersive).catch(function() {
                elem.requestFullscreen().catch(function() {});
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        if (navigator.keyboard && typeof navigator.keyboard.lock === "function") {
            navigator.keyboard.lock(["Escape", "MetaLeft", "MetaRight", "AltLeft", "Tab"]).catch(function() {});
        }
    } catch (e) {}
};

// Pengunci Mati Tombol Back (15 Lapis Buffer Tanpa Pop-up & Tanpa Ruang Palsu)
window.pasangKunciMatiTombolBack = function() {
    if (sessionStorage.getItem("statusLogin") === "admin") return;
    try {
        for (let i = 0; i < 15; i++) {
            window.history.pushState({ inExamLocked: true, step: i }, "", window.location.href);
        }
    } catch (e) {}
};

// Normalisasi struktur soal ujian agar tidak pernah gagal dirender walaupun format di DB beragam
window.normalisasiSoalUjianCBT = function(rawSoal) {
    let arr = Array.isArray(rawSoal) ? rawSoal : Object.values(rawSoal || {});
    return arr.filter(Boolean).map(function(q, idx) {
        let copyQ = Object.assign({}, q);
        copyQ.originalIndex = (typeof copyQ.originalIndex === 'number') ? copyQ.originalIndex : idx;
        copyQ.question = copyQ.question || copyQ.soal || "";

        let rawOpts = Array.isArray(copyQ.options) ? copyQ.options : Object.values(copyQ.options || {});
        copyQ.options = rawOpts.map(function(opt, oIdx) {
            if (typeof opt === 'object' && opt !== null) {
                return {
                    label: String(opt.label || String.fromCharCode(65 + oIdx)).toUpperCase().trim(),
                    text: opt.text !== undefined ? String(opt.text) : ""
                };
            }
            return {
                label: String.fromCharCode(65 + oIdx),
                text: String(opt || "")
            };
        });

        let rawType = String(copyQ.type || copyQ.tipe || 'PG').trim().toUpperCase();
        if (rawType === 'SHORT_ANSWER' || rawType === 'ISIAN' || rawType === 'ISIAN SINGKAT' || rawType === 'IS') {
            copyQ.type = 'IS';
        } else if (rawType === 'ESSAY' || rawType === 'ESAI' || rawType === 'URAIAN') {
            copyQ.type = 'Essay';
        } else if (rawType === 'PGK' || rawType.indexOf('KOMPLEKS') !== -1) {
            copyQ.type = 'PGK';
        } else {
            copyQ.type = (copyQ.options.length === 0) ? 'IS' : 'PG';
        }

        let rawCorrect = copyQ.correct || copyQ.correctAnswers || copyQ.kunci || [];
        if (typeof rawCorrect === 'string') rawCorrect = [rawCorrect];
        else if (!Array.isArray(rawCorrect)) rawCorrect = Object.values(rawCorrect);
        copyQ.correct = rawCorrect;

        return copyQ;
    });
};

window.hitungBobotIdealUjian = function(paketData, soalArr) {
    let jml = (soalArr && soalArr.length) ? soalArr.length : 1;
    let rataPerSoal = 100 / jml;
    let rawBobot = (paketData && paketData.bobot) ? paketData.bobot : {};
    return {
        PG: Number(rawBobot.PG) > 0 ? Number(rawBobot.PG) : rataPerSoal,
        PGK: Number(rawBobot.PGK) > 0 ? Number(rawBobot.PGK) : rataPerSoal,
        IS: Number(rawBobot.IS) > 0 ? Number(rawBobot.IS) : rataPerSoal,
        Essay: Number(rawBobot.Essay) > 0 ? Number(rawBobot.Essay) : rataPerSoal
    };
};

window.ambilDataMonitorSiswaSinkron = function(namaPaket, kelas, namaLengkap) {
    if (!window.adminLiveMonitorData) return null;
    let safePkt = window.sanitasiKeyRekapFirebase(namaPaket);
    let safeKls = window.sanitasiKeyRekapFirebase(kelas);
    let safeNama = window.sanitasiKeyRekapFirebase(namaLengkap);

    let pktObj = window.adminLiveMonitorData[namaPaket] || window.adminLiveMonitorData[safePkt] || null;
    if (!pktObj) {
        let foundPktKey = Object.keys(window.adminLiveMonitorData).find(function(k) {
            return window.sanitasiKeyRekapFirebase(k).toLowerCase() === safePkt.toLowerCase();
        });
        if (foundPktKey) pktObj = window.adminLiveMonitorData[foundPktKey];
    }
    if (!pktObj) return null;

    let klsObj = pktObj[kelas] || pktObj[safeKls] || null;
    if (!klsObj) {
        let foundKlsKey = Object.keys(pktObj).find(function(k) {
            return window.sanitasiKeyRekapFirebase(k).toLowerCase() === safeKls.toLowerCase();
        });
        if (foundKlsKey) klsObj = pktObj[foundKlsKey];
    }
    if (!klsObj) return null;

    if (klsObj[namaLengkap]) return klsObj[namaLengkap];
    if (klsObj[safeNama]) return klsObj[safeNama];

    let foundNamaKey = Object.keys(klsObj).find(function(k) {
        let item = klsObj[k];
        let namaItem = (item && item.nama) ? String(item.nama).trim().toLowerCase() : "";
        return k.toLowerCase() === namaLengkap.toLowerCase() || window.sanitasiKeyRekapFirebase(k).toLowerCase() === safeNama.toLowerCase() || namaItem === namaLengkap.toLowerCase();
    });
    return foundNamaKey ? klsObj[foundNamaKey] : null;
};

window.verifikasiMasukUjian = function() {
    let statLogin = sessionStorage.getItem("statusLogin");
    let userLogin = (sessionStorage.getItem("username") || "").trim().toLowerCase();
    if (!statLogin || statLogin === "tamu") {
        window.tutupModal('modal-enter-ujian');
        alert("🔒 Akses Ditolak: Anda wajib login menggunakan akun Siswa resmi!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    if (typeof window.pastikanListenerBankUjianAktif === "function") {
        window.pastikanListenerBankUjianAktif();
    }

    let kelas = document.getElementById('ujian-select-kelas').value;
    let namaLengkap = kelas === "Umum" ? document.getElementById('ujian-input-nama-manual').value.trim() : document.getElementById('ujian-select-nama').value;
    let kode = document.getElementById('input-kode-ujian').value.trim().toUpperCase();

    if (statLogin === "siswa" && userLogin !== "sbd") {
        let akunResmi = window.ambilAkunSiswaAktifUjian();
        if (!akunResmi || !akunResmi.kelas || !akunResmi.namaLengkap) {
            return alert("⏳ Data akun siswa Anda sedang disinkronkan dari server. Silakan tunggu 2 detik lalu klik Mulai Ujian kembali.");
        }
        kelas = akunResmi.kelas;
        namaLengkap = akunResmi.namaLengkap;
    }

    if (!kelas) return alert("Pilih kelas Anda terlebih dahulu!");
    if (!namaLengkap) return alert("Pilih (atau isi) nama lengkap Anda terlebih dahulu!");
    if (!kode) return alert("Masukkan Kode Ujian!");

    let ujianAktif = window.adminUjianAktifData ? window.adminUjianAktifData[kode] : null;
    if (!ujianAktif) return alert("❌ Kode Ujian tidak valid atau ujian belum diaktifkan oleh guru!");

    if (ujianAktif.kelas && ujianAktif.kelas !== kelas && kelas !== "Umum") {
        return alert("⚠️ Kode ujian ini dikhususkan untuk kelas " + ujianAktif.kelas + "!");
    }

    let namaPaket = ujianAktif.paket;
    let isRemedialExam = Boolean(ujianAktif.isRemedial);
    let maxScoreRemedial = Number(ujianAktif.maxScore) || 0;
    let isResumeMode = false;
    let prevPelanggaran = 0;

    let safePaketLM = window.sanitasiKeyRekapFirebase(namaPaket);

    if (isRemedialExam) {
        let rekapPaketCek = window.ambilObjekRekapPaket(kelas, namaPaket);
        let dataNilaiLama = window.ambilDataSiswaDiObjekRekap(rekapPaketCek, namaLengkap);
        let targetKkmCek = maxScoreRemedial || (typeof window.dapatkanKKMKelas === "function" ? window.dapatkanKKMKelas(kelas) : 75);
        if (dataNilaiLama && dataNilaiLama.nilaiAkhir !== undefined && parseFloat(dataNilaiLama.nilaiAkhir) >= targetKkmCek) {
            return alert("✅ Nilai Anda pada evaluasi \"" + namaPaket + "\" sudah mencapai batas KKM (" + dataNilaiLama.nilaiAkhir + "). Anda tidak perlu mengikuti ujian remedial ini.");
        }
    }

    let dataMonitorSiswa = window.ambilDataMonitorSiswaSinkron(namaPaket, kelas, namaLengkap);

    if (dataMonitorSiswa) {
        let statusLM = dataMonitorSiswa.status || "";
        prevPelanggaran = dataMonitorSiswa.pelanggaran || 0;

        if (isRemedialExam && statusLM === "Selesai") {
            isResumeMode = false;
            prevPelanggaran = 0;
            try {
                localStorage.removeItem('cadangan_ujian_' + kode + '_' + kelas + '_' + namaLengkap);
            } catch (e) {}
        } else if (statusLM === "Selesai" || statusLM === "Dikeluarkan") {
            return alert("⚠️ AKSES DITOLAK MUTLAK!\n\nStatus ujian Anda tercatat: " + statusLM.toUpperCase() + ".\nAnda tidak dapat masuk kembali ke ujian ini tanpa izin dari Guru (Guru harus mereset nama Anda dari Live Monitor).");
        } else if (statusLM === "Sedang Mengerjakan") {
            let lanjut = confirm("⚠️ TERDETEKSI TERKELUAR DARI UJIAN!\n\nSistem menemukan sesi Anda sebelumnya terputus di tengah jalan.\nAnda dapat masuk kembali untuk melanjutkannya (waktu & jawaban tersimpan), NAMUN pelanggaran Anda akan bertambah +1.\n\nKlik OK untuk meneruskan ujian.");
            if (!lanjut) return;
            isResumeMode = true;
        }
    }

    let paketData = (window.adminBankUjianData && (window.adminBankUjianData[namaPaket] || window.adminBankUjianData[safePaketLM])) || null;
    if (!paketData || !paketData.soal) {
        return alert("⏳ Bank Soal untuk ujian \"" + namaPaket + "\" sedang dimuat dari server. Silakan tunggu 2 detik lalu tekan tombol Mulai Ujian sekali lagi!");
    }

    let soalDisiapkan = window.normalisasiSoalUjianCBT(paketData.soal);
    if (soalDisiapkan.length === 0) {
        return alert("❌ Paket ujian ini belum memiliki daftar soal yang valid.");
    }
    soalDisiapkan.sort(function() { return Math.random() - 0.5; });

    // Cek kondisi layar penuh dan bersih SEBELUM shield transisi diaktifkan
    if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
    }
    let cekLayar = window.cekKondisiLayarPenuhDanBersih();
    if (!cekLayar.aman && statLogin !== "admin") {
        return alert("⚠️ TIDAK DAPAT MEMULAI UJIAN!\n\n" + cekLayar.alasan + "\n\nPastikan layar bersih, penuh (Full Screen), dan tidak membuka aplikasi tambahan.");
    }

    // Pasang Shield Transisi 4 Detik untuk Android Fullscreen & Virtual Keyboard
    window.ujianEntryShieldUntil = Date.now() + 4000;
    window.graceOrientationTime = Date.now() + 4000;
    window.graceKeyboardTime = Date.now() + 4000;
    window.graceZoomTime = Date.now() + 4000;
    window.aktifkanFullscreenUjian();

    window.sesiUjianSiswa = {
        kelas: kelas,
        nama: namaLengkap,
        kode: kode,
        paket: namaPaket,
        durasi: Number(ujianAktif.durasi) || 90,
        soal: soalDisiapkan,
        bobot: window.hitungBobotIdealUjian(paketData, soalDisiapkan),
        jawaban: {},
        isResumeMode: isResumeMode,
        prevPelanggaran: prevPelanggaran,
        isRemedial: isRemedialExam,
        maxScore: maxScoreRemedial
    };

    window.tutupModal('modal-enter-ujian');
    
    // Panggil modal persiapan menggunakan fungsi bawaan agar Z-Index aman
    window.bukaModal('modal-persiapan-ujian');
};

/* =========================================
   FUNGSI ANIMASI LOADING MASUK UJIAN
   ========================================= */
window.mulaiLoadingMasukUjian = function() {
    window.tutupModal('modal-persiapan-ujian');
    
    let loading = document.getElementById("loading-masuk-ujian");
    if (loading) loading.style.display = "flex";

    // Jeda 2 detik untuk animasi loading sebelum layar berubah ke ruang ujian ketat
    setTimeout(function() {
        if (loading) loading.style.display = "none";
        window.bukaRuangUjianStrict();
    }, 2000);
};

/* =========================================
   MODAL PERSIAPAN & ANIMASI LOADING UJIAN
   ========================================= */
window.tampilkanPersiapanUjian = function() {
    let modal = document.getElementById("modal-persiapan-ujian");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal-persiapan-ujian";
        modal.className = "modal-overlay";
        modal.style.zIndex = "10000000";
        modal.innerHTML = 
            '<div class="modal-box" style="width:450px; max-width:92vw; text-align:center; border-radius:14px; overflow:hidden; box-shadow:0 15px 35px rgba(0,0,0,0.3);">' +
                '<div class="modal-header" style="background:#0b3954; color:white; padding:16px;">' +
                    '<h3 style="margin:0; font-size:18px;">⚠️ Persiapan Sebelum Ujian</h3>' +
                '</div>' +
                '<div class="modal-body" style="padding:25px; text-align:left;">' +
                    '<div style="font-size:50px; text-align:center; margin-bottom:12px;">📱</div>' +
                    '<p style="font-size:14px; font-weight:bold; color:#c0392b; margin-top:0;">Mohon pastikan hal berikut sebelum menekan tombol Oke:</p>' +
                    '<ul style="font-size:13px; color:#2c3e50; line-height:1.6; padding-left:20px; margin-bottom:20px; font-weight:600;">' +
                        '<li style="margin-bottom:6px;">Matikan notifikasi (WhatsApp, IG, dll) atau aktifkan fitur <b style="color:#e67e22;">Jangan Ganggu (Do Not Disturb)</b> di HP Anda.</li>' +
                        '<li style="margin-bottom:6px;">Atur kecerahan layar senyaman mungkin karena layar akan menyala terus.</li>' +
                        '<li>Ujian ini dilindungi sensor keamanan. <b style="color:#c0392b;">Menutup browser, me-refresh halaman, atau membuka aplikasi lain akan menambah poin pelanggaran secara otomatis!</b></li>' +
                    '</ul>' +
                    '<button type="button" class="btn-action" style="background:#27ae60; width:100%; padding:14px; font-size:15px; border-radius:30px; font-weight:900; box-shadow:0 4px 10px rgba(39,174,96,0.3);" onclick="window.mulaiLoadingMasukUjian()">✅ OKE, SAYA MENGERTI & SIAP!</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);
    }
    modal.style.display = "flex";
};

window.mulaiLoadingMasukUjian = function() {
    let modal = document.getElementById("modal-persiapan-ujian");
    if (modal) modal.style.display = "none";

    let loading = document.getElementById("loading-masuk-ujian");
    if (!loading) {
        loading = document.createElement("div");
        loading.id = "loading-masuk-ujian";
        loading.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:#0b3954; z-index:20000000; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; font-family:'Poppins', sans-serif;";
        loading.innerHTML = 
            '<div style="width:50px; height:50px; border:5px solid rgba(255,255,255,0.2); border-top-color:#f1c40f; border-radius:50%; animation:spinLoadingCBT 1s linear infinite; margin-bottom:25px;"></div>' +
            '<h2 style="margin:0; font-size:24px; letter-spacing:1px; font-weight:800;">Memasuki Ruang Ujian...</h2>' +
            '<p style="font-size:13px; opacity:0.8; margin-top:8px; font-weight:600;">Menyiapkan soal dan mengaktifkan sensor keamanan...</p>' +
            '<style>@keyframes spinLoadingCBT { to { transform: rotate(360deg); } }</style>';
        document.body.appendChild(loading);
    }
    loading.style.display = "flex";

    // Jeda 2 detik lalu masuk ke ruang ujian sebenarnya
    setTimeout(function() {
        loading.style.display = "none";
        window.bukaRuangUjianStrict();
    }, 2000);
};

// =========================================================================
// 2. RUANG UJIAN KETAT (STRICT MODE, TIMER, & PENGUMPULAN JAWABAN)
// =========================================================================
window.alertAmanUjian = function(pesan, onDone) {
    window.sedangDialogSistem = true;
    if (typeof window.tampilkanCustomDialog === "function") {
        window.tampilkanCustomDialog("alert", String(pesan || ""), null, function() {
            setTimeout(function() { window.sedangDialogSistem = false; }, 400);
            if (onDone) onDone();
        });
        let mdl = document.getElementById("modal-custom-dialog");
        if (mdl) mdl.style.zIndex = "10000005";
    } else {
        alert(pesan);
        setTimeout(function() { window.sedangDialogSistem = false; }, 800);
        if (onDone) onDone();
    }
};

window.confirmAmanUjian = function(pesan, onResult) {
    window.sedangDialogSistem = true;
    if (typeof window.tampilkanCustomDialog === "function" && typeof onResult === "function") {
        window.tampilkanCustomDialog("confirm", String(pesan || ""), null, function(isYes) {
            setTimeout(function() { window.sedangDialogSistem = false; }, 400);
            onResult(Boolean(isYes));
        });
        let mdl = document.getElementById("modal-custom-dialog");
        if (mdl) mdl.style.zIndex = "10000005";
        return;
    }
    let hasil = window._originalConfirm ? window._originalConfirm(pesan) : confirm(pesan);
    setTimeout(function() { window.sedangDialogSistem = false; }, 800);
    if (onResult) onResult(hasil);
    return hasil;
};

window.simpanCadanganLokalUjian = function() {
    if (!window.sesiUjianSiswa) return;
    try {
        let keyCadangan = 'cadangan_ujian_' + window.sesiUjianSiswa.kode + '_' + window.sesiUjianSiswa.kelas + '_' + window.sesiUjianSiswa.nama;
        localStorage.setItem(keyCadangan, JSON.stringify({
            jawaban: window.sesiUjianSiswa.jawaban || {},
            violationCount: window.violationCount || 0,
            sisaDetik: window.sisaDetikUjian || (window.sesiUjianSiswa.durasi * 60),
            urutanSoal: window.sesiUjianSiswa.soal // Kunci urutan soal hasil pengacakan pertama
        }));
    } catch (e) {}
};

window.hapusCadanganLokalUjian = function() {
    if (!window.sesiUjianSiswa) return;
    try {
        let keyCadangan = 'cadangan_ujian_' + window.sesiUjianSiswa.kode + '_' + window.sesiUjianSiswa.kelas + '_' + window.sesiUjianSiswa.nama;
        localStorage.removeItem(keyCadangan);
    } catch (e) {}
};

window.bukaRuangUjianStrict = function() {
    let header = document.getElementById('header-wrap');
    let nav = document.getElementById('main-nav');
    let breadcrumb = document.querySelector('.bottom-breadcrumb-bar');
    let editorWrap = document.getElementById('main-editor-wrapper');
    if (header) header.style.display = 'none';
    if (nav) nav.style.display = 'none';
    if (breadcrumb) breadcrumb.style.display = 'none';
    if (editorWrap) editorWrap.style.display = 'none';

    document.body.style.overflow = 'auto';
    document.body.classList.add('strict-mode-active');

    let overlayWarn = document.getElementById('strict-warning-overlay');
    if (overlayWarn) overlayWarn.style.display = 'none';

    let room = document.getElementById('ujian-strict-room');
    if (room) {
        room.style.display = 'block';
        room.style.touchAction = 'pan-x pan-y pinch-zoom';
        room.scrollTop = 0;
    }
    window.scrollTo(0, 0);

    let judulUI = document.getElementById('ujian-judul-ui');
    if (judulUI) {
        judulUI.style.color = '#c0392b';
        judulUI.innerText = "🎯 " + window.sesiUjianSiswa.paket;
    }
    let subUI = document.getElementById('ujian-strict-subtitle');
    if (subUI) subUI.innerText = "Mode Ketat: Dilarang Keluar atau Membuka Aplikasi Lain! (Layar Anti-Sleep Aktif)";

    let isAdmin = sessionStorage.getItem("statusLogin") === "admin";
    let btnCloseStrict = document.getElementById('btn-close-strict');
    if (btnCloseStrict) {
        btnCloseStrict.style.display = isAdmin ? 'block' : 'none';
    }

    let pkt = window.sesiUjianSiswa;
    let keyCadangan = 'cadangan_ujian_' + pkt.kode + '_' + pkt.kelas + '_' + pkt.nama;
    let dataLokal = null;
    try {
        let rawLokal = localStorage.getItem(keyCadangan);
        if (rawLokal) dataLokal = JSON.parse(rawLokal);
    } catch (e) {}

    if (dataLokal && dataLokal.jawaban) {
        window.sesiUjianSiswa.jawaban = dataLokal.jawaban;
        let serverViolation = Number(pkt.prevPelanggaran) || 0;
        let prevLokalViolation = Math.max(Number(dataLokal.violationCount) || 0, serverViolation);
        
        // PASTI KENA PENALTI: Jika masuk lewat mode resume (refresh/terkeluar), pastikan pelanggaran bertambah minimal +1.
        // Logika ini mencegah hukuman ganda tapi memastikan siswa yang nge-refresh tetap dihukum.
        if (pkt.isResumeMode && prevLokalViolation <= serverViolation) {
            prevLokalViolation = serverViolation + 1;
        }
        window.violationCount = prevLokalViolation; 
        window.sisaDetikUjian = dataLokal.sisaDetik || (pkt.durasi * 60);
        
        // Pulihkan urutan soal persis seperti saat ujian baru dimulai agar jawaban tidak tertukar
        if (dataLokal.urutanSoal && dataLokal.urutanSoal.length > 0) {
            window.sesiUjianSiswa.soal = dataLokal.urutanSoal;
        }
    } else {
        window.sesiUjianSiswa.jawaban = {};
        window.violationCount = pkt.isResumeMode ? (Number(pkt.prevPelanggaran) || 0) + 1 : (Number(pkt.prevPelanggaran) || 0);
        window.sisaDetikUjian = pkt.durasi * 60;
    }
    window.simpanCadanganLokalUjian();

    if (window.violationCount >= 6 && !isAdmin) {
        window.isStrictUjianActive = false;
        window.alertAmanUjian("❌ AKSES DIBLOKIR!\n\nTotal pelanggaran Anda telah mencapai batas maksimal (6x).\n\nUjian dihentikan paksa dan hasil Anda akan otomatis dikumpulkan!");
        window.kumpulkanUjianSiswa(true, true);
        return;
    }

    window.isPenaltyActive = false;
    clearInterval(window.penaltyInterval);
    window.penaltyInterval = null;

    window.setTiraiPrivasiUjian(false);
    window.renderSoalUjianSiswa();
    window.mulaiTimerUjian();

    window.lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    window.initUjianWidth = window.innerWidth;
    window.initUjianHeight = window.innerHeight;
    window.ujianEntryShieldUntil = Date.now() + 4000;
    window.graceOrientationTime = Date.now() + 4000;
    window.graceKeyboardTime = Date.now() + 3000;
    window.graceZoomTime = Date.now() + 3000;
    window.isStrictUjianActive = true;

    window.aktifkanWakeLockUjian();
    window.pasangWatermarkIdentitasUjian();
    window.pasangKunciMatiTombolBack();

    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = function() {
            window.triggerPelanggaran("Terdeteksi percobaan merekam layar (Screen Recording)!");
            return Promise.reject(new Error("Screen recording dilarang selama ujian."));
        };
    }

    clearInterval(window.screenGuardInterval);
    window.screenGuardInterval = setInterval(function() {
        if (!window.isStrictUjianActive || window.isPenaltyActive || window.sedangDialogSistem) return;
        if (sessionStorage.getItem("statusLogin") === "admin") return;

        // 1. Pengecekan Mutlak: Jika tab/aplikasi berada di latar belakang (keluar ujian)
        if (document.visibilityState === 'hidden' || document.hidden) {
            window.triggerPelanggaran("Keluar dari ruang ujian atau membuka aplikasi lain!");
            return;
        }

        if (Date.now() < (window.ujianEntryShieldUntil || 0) || Date.now() < (window.graceOrientationTime || 0)) return;

        // Abaikan pengecekan fokus/split-screen saat siswa sedang aktif mengetik di kotak Isian/Essay
        let activeTag = document.activeElement ? document.activeElement.tagName.toUpperCase() : '';
        let isTypingInput = (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT');
        if (isTypingInput || window.apakahTransisiKeyboardAktif() || window.apakahTransisiZoomAktif()) return;

        // 2. Pengecekan Kehilangan Fokus (Membuka Floating App / Jendela Lain)
        if (!document.hasFocus()) {
            window.triggerPelanggaran("Fokus layar berpindah ke aplikasi mengambang atau ke luar ruang ujian!");
            return;
        }

        // 3. Pengecekan Split-Screen
        let statusLayar = window.cekKondisiLayarPenuhDanBersih();
        if (!statusLayar.aman) {
            window.triggerPelanggaran(statusLayar.alasan);
        } else {
            window.setTiraiPrivasiUjian(false);
        }
    }, 1500);

    // Simpan ke memori lokal & kirim ke Firebase Live Monitor
    if (!window.adminLiveMonitorData) window.adminLiveMonitorData = {};
    if (!window.adminLiveMonitorData[pkt.paket]) window.adminLiveMonitorData[pkt.paket] = {};
    if (!window.adminLiveMonitorData[pkt.paket][pkt.kelas]) window.adminLiveMonitorData[pkt.paket][pkt.kelas] = {};
    let payloadMonitorAwal = {
        kelas: pkt.kelas,
        nama: pkt.nama,
        paket: pkt.paket,
        status: "Sedang Mengerjakan",
        pelanggaran: window.violationCount || 0,
        waktuUpdate: new Date().toISOString()
    };
    window.adminLiveMonitorData[pkt.paket][pkt.kelas][pkt.nama] = payloadMonitorAwal;

    if (typeof window.simpanStatusLiveMonitorKeDB === "function") {
        if (typeof window.modeHematServerUjian === "function") window.modeHematServerUjian(false);
        window.simpanStatusLiveMonitorKeDB(pkt.paket, pkt.kelas, pkt.nama, payloadMonitorAwal);
        setTimeout(function() {
            if (window.isStrictUjianActive && typeof window.modeHematServerUjian === "function") {
                window.modeHematServerUjian(true);
            }
        }, 3000);
    }
};

window.tutupUjianStrict = function() {
    clearInterval(window.timerIntervalUjian);
    clearInterval(window.penaltyInterval);
    clearInterval(window.screenGuardInterval);
    window.isStrictUjianActive = false;
    window.isPenaltyActive = false;
    window.setTiraiPrivasiUjian(false);
    if (typeof window.matikanWakeLockUjian === "function") window.matikanWakeLockUjian();
    document.body.classList.remove("strict-mode-active");
    document.body.style.overflow = "";

    let room = document.getElementById("ujian-strict-room");
    let header = document.getElementById("header-wrap");
    let nav = document.getElementById("main-nav");
    let bc = document.querySelector(".bottom-breadcrumb-bar");
    let editorWrap = document.getElementById("main-editor-wrapper");

    if (room) room.style.display = "none";
    if (header) header.style.display = "flex";
    if (nav) nav.style.display = "block";
    if (bc) bc.style.display = "flex";
    if (editorWrap) editorWrap.style.display = "flex";

    let bNav = document.getElementById("btn-toggle-cbt-nav");
    if (bNav) bNav.style.display = "none";
    let dNav = document.getElementById("cbt-nav-drawer");
    if (dNav) dNav.classList.remove("show-nav");
};

window.inlineEditSoal = function(tipe, soalIdx, field, optLabel, newText) {
    let isAdmin = sessionStorage.getItem("statusLogin") === "admin";
    if (!isAdmin) return;

    let sesi = tipe === 'latihan' ? window.sesiLatihanSiswa : window.sesiUjianSiswa;
    if (!sesi || !sesi.soal || !sesi.soal[soalIdx]) return;
    let q = sesi.soal[soalIdx];

    if (field === 'question') q.question = newText;
    if (field === 'explanation') q.explanation = newText;
    if (field === 'option' && Array.isArray(q.options)) {
        let opt = q.options.find(function(o) { return o.label === optLabel; });
        if (opt) opt.text = newText;
    }

    let origIdx = (typeof q.originalIndex === 'number') ? q.originalIndex : soalIdx;

    if (tipe === 'latihan') {
        let key = sesi.paketKey;
        if (key && window.adminBankLatihanData && window.adminBankLatihanData[key] && Array.isArray(window.adminBankLatihanData[key].soal)) {
            let masterQ = window.adminBankLatihanData[key].soal[origIdx];
            if (masterQ) {
                if (field === 'question') masterQ.question = newText;
                if (field === 'explanation') masterQ.explanation = newText;
                if (field === 'option' && Array.isArray(masterQ.options)) {
                    let mOpt = masterQ.options.find(function(o) { return o.label === optLabel; });
                    if (mOpt) mOpt.text = newText;
                }
            }
            if (typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
        }
    } else {
        let key = sesi.paket;
        if (key && window.adminBankUjianData && window.adminBankUjianData[key] && Array.isArray(window.adminBankUjianData[key].soal)) {
            let masterQ = window.adminBankUjianData[key].soal[origIdx];
            if (masterQ) {
                if (field === 'question') masterQ.question = newText;
                if (field === 'explanation') masterQ.explanation = newText;
                if (field === 'option' && Array.isArray(masterQ.options)) {
                    let mOpt = masterQ.options.find(function(o) { return o.label === optLabel; });
                    if (mOpt) mOpt.text = newText;
                }
            }
            if (typeof window.simpanBankUjianKeDB === "function") window.simpanBankUjianKeDB();
        }
    }
};

window.renderSoalUjianSiswa = function() {
    let container = document.getElementById('ujian-strict-container');
    if (!container || !window.sesiUjianSiswa) return;

    container.style.display = 'block';
    container.style.filter = 'none';
    container.style.pointerEvents = 'auto';

    let isAdmin = sessionStorage.getItem("statusLogin") === "admin";
    let soalArr = window.normalisasiSoalUjianCBT(window.sesiUjianSiswa.soal || []);
    window.sesiUjianSiswa.soal = soalArr;
    let jawabanTersimpan = window.sesiUjianSiswa.jawaban || {};
    let html = '<div style="max-width:800px; margin:0 auto;">';

    html += '<div id="banner-status-koneksi-ujian" style="margin:0 auto 15px auto; padding:8px 15px; border-radius:8px; background:#eafaf1; border:1px solid #a9dfbf; color:#1e8449; font-size:12px; font-weight:bold; text-align:center;">🛡️ Mode Ujian Mandiri & Layar Anti-Sleep Aktif: Jawaban Anda tersimpan otomatis di perangkat.</div>';

    soalArr.forEach(function(q, idx) {
        let qEditAttr = isAdmin ? 'contenteditable="true" style="border-bottom:1px dashed #e67e22; outline:none; cursor:text;" onblur="window.inlineEditSoal(\'ujian\', ' + idx + ', \'question\', null, this.innerText)"' : '';
        let ansLama = jawabanTersimpan[idx];
        let opsiArr = Array.isArray(q.options) ? q.options : [];

        // Paksa content-visibility: visible agar tidak pernah putih kosong di Safari iPhone maupun Chrome
        html += '<div class="quiz-question-card" id="soal-ujian-' + idx + '" style="margin-bottom:25px; box-shadow:0 4px 10px rgba(0,0,0,0.05); content-visibility:visible !important; contain:none !important; opacity:1 !important; background:#ffffff;">';
        html += '<div class="quiz-question-text" style="font-size:16px;" ' + qEditAttr + '>' + (idx + 1) + '. ' + (q.question || '') + '</div>';

        if (q.type === 'IS' || q.type === 'Essay' || opsiArr.length === 0) {
            let valLama = (typeof ansLama === 'string') ? ansLama.replace(/"/g, '&quot;') : '';
            if (q.type === 'Essay') {
                html += '<textarea class="input-box" placeholder="Ketik jawaban uraian/essay Anda di sini..." style="font-size:14px; font-weight:normal; border:2px solid #3498db; width:100%; box-sizing:border-box; min-height:120px; resize:vertical; line-height:1.5;" oninput="window.simpanJawabanUjian(' + idx + ', this.value, \'' + q.type + '\', this)">' + valLama + '</textarea>';
            } else {
                html += '<input type="text" class="input-box" value="' + valLama + '" placeholder="Ketik jawaban singkat Anda..." style="font-size:15px; font-weight:600; border:2px solid #3498db; width:100%; box-sizing:border-box;" oninput="window.simpanJawabanUjian(' + idx + ', this.value, \'' + q.type + '\', this)">';
            }
        } else {
            html += '<div class="quiz-options">';
            opsiArr.forEach(function(opt) {
                let optEditAttr = isAdmin ? 'contenteditable="true" style="border-bottom:1px dashed #e67e22; outline:none; cursor:text; padding:2px;" onclick="event.stopPropagation()" onblur="window.inlineEditSoal(\'ujian\', ' + idx + ', \'option\', \'' + opt.label + '\', this.innerText)"' : '';

                if (q.type === 'PG') {
                    let isSelected = (ansLama === opt.label);
                    let stylePG = isSelected ? 'background:#3498db; color:white; border-color:#2980b9; font-weight:bold;' : '';
                    html += '<button type="button" class="quiz-option-btn opsi-ujian-' + idx + '" style="' + stylePG + '" onclick="window.pilihJawabanUjianPG(' + idx + ', \'' + opt.label + '\', this)">' + opt.label + '. <span ' + optEditAttr + '>' + opt.text + '</span></button>';
                } else {
                    let isChecked = Array.isArray(ansLama) && ansLama.includes(opt.label);
                    let stylePGK = isChecked ? 'background:#ebf5fb; border-color:#2980b9; font-weight:bold;' : '';
                    html += '<label id="lbl-ujian-pgk-' + idx + '-' + opt.label + '" class="quiz-option-btn" style="display:flex; align-items:center; gap:10px; cursor:pointer; ' + stylePGK + '">' +
                                '<input type="checkbox" ' + (isChecked ? 'checked' : '') + ' style="width:18px; height:18px; cursor:pointer;" onchange="window.pilihJawabanUjianPGK(' + idx + ', \'' + opt.label + '\', this.checked)">' +
                                '<span ' + optEditAttr + '>' + opt.label + '. ' + opt.text + '</span>' +
                             '</label>';
                }
            });
            html += '</div>';
        }
        html += '</div>';
    });

    html += '<div id="box-status-kumpul-offline" style="display:none; max-width:500px; margin:20px auto; padding:15px; border-radius:10px; background:#fef9e7; border:2px solid #f39c12; text-align:center; color:#d35400; font-weight:bold;"></div>';
    html += '<div style="text-align:center; margin-top:30px; margin-bottom:60px;">' +
                '<button id="btn-kumpul-ujian-utama" class="btn-action" style="background:#27ae60; width:100%; max-width:400px; font-size:18px; padding:15px; border-radius:30px;" onclick="window.kumpulkanUjianSiswa()">📥 Kumpulkan Jawaban</button>' +
             '</div>';
    html += '</div>';

    container.innerHTML = html;
    if (typeof window.renderMathJax === "function") window.renderMathJax();
    window.renderCbtNavigation(soalArr.length, 'ujian');
};

window.pilihJawabanUjianPG = function(soalIdx, labelPilihan, btnEl) {
    document.querySelectorAll('.opsi-ujian-' + soalIdx).forEach(function(b) {
        b.style.background = 'white'; b.style.color = '#495057';
        b.style.borderColor = '#ced4da'; b.style.fontWeight = 'normal';
    });
    btnEl.style.background = '#3498db'; btnEl.style.color = 'white';
    btnEl.style.borderColor = '#2980b9'; btnEl.style.fontWeight = 'bold';

    window.sesiUjianSiswa.jawaban[soalIdx] = labelPilihan;
    window.simpanCadanganLokalUjian();
    window.updateCbtNavInfo('ujian');
};

window.pilihJawabanUjianPGK = function(soalIdx, labelPilihan, isChecked) {
    if (!Array.isArray(window.sesiUjianSiswa.jawaban[soalIdx])) {
        window.sesiUjianSiswa.jawaban[soalIdx] = [];
    }
    let arr = window.sesiUjianSiswa.jawaban[soalIdx];

    if (isChecked) {
        if (!arr.includes(labelPilihan)) arr.push(labelPilihan);
    } else {
        window.sesiUjianSiswa.jawaban[soalIdx] = arr.filter(function(l) { return l !== labelPilihan; });
    }

    let lblEl = document.getElementById('lbl-ujian-pgk-' + soalIdx + '-' + labelPilihan);
    if (lblEl) {
        lblEl.style.background = isChecked ? '#ebf5fb' : 'white';
        lblEl.style.borderColor = isChecked ? '#2980b9' : '#ced4da';
        lblEl.style.fontWeight = isChecked ? 'bold' : 'normal';
    }
    window.simpanCadanganLokalUjian();
    window.updateCbtNavInfo('ujian');
};

window.simpanJawabanUjian = function(soalIdx, nilaiText, tipe, inputEl) {
    if (tipe === 'IS') {
        let trimmed = nilaiText.trim();
        let words = trimmed ? trimmed.split(/\s+/) : [];
        if (words.length > 3) {
            window.alertAmanUjian("⚠️ Isian singkat dibatasi maksimal 3 kata!");
            nilaiText = words.slice(0, 3).join(" ");
            if (inputEl) inputEl.value = nilaiText;
        }
    }
    window.sesiUjianSiswa.jawaban[soalIdx] = nilaiText;
    window.simpanCadanganLokalUjian();
    window.updateCbtNavInfo('ujian');
};

window.mulaiTimerUjian = function() {
    let timerEl = document.getElementById('ujian-timer-fixed');
    if (timerEl) timerEl.style.display = 'block';

    if (typeof window.sisaDetikUjian !== 'number' || window.sisaDetikUjian <= 0) {
        window.sisaDetikUjian = window.sesiUjianSiswa.durasi * 60;
    }
    
    // Tentukan waktu target selesai berdasarkan waktu jam perangkat (anti-throttle)
    window.targetWaktuSelesaiUjian = Date.now() + (window.sisaDetikUjian * 1000);

    clearInterval(window.timerIntervalUjian);
    window.timerIntervalUjian = setInterval(function() {
        // Hitung sisa detik berdasarkan selisih waktu nyata
        window.sisaDetikUjian = Math.max(0, Math.floor((window.targetWaktuSelesaiUjian - Date.now()) / 1000));
        if (window.sisaDetikUjian % 10 === 0) {
            window.simpanCadanganLokalUjian();
        }

        if (window.sisaDetikUjian <= 0) {
            clearInterval(window.timerIntervalUjian);
            if (timerEl) timerEl.innerText = "00:00:00";
            window.isStrictUjianActive = false;
            window.alertAmanUjian("⌛ WAKTU HABIS! Jawaban Anda akan dikumpulkan secara otomatis.");
            window.kumpulkanUjianSiswa(true);
            return;
        }

        let jam = Math.floor(window.sisaDetikUjian / 3600);
        let mnt = Math.floor((window.sisaDetikUjian % 3600) / 60);
        let dtk = window.sisaDetikUjian % 60;

        if (timerEl) {
            timerEl.innerText = String(jam).padStart(2, '0') + ":" + String(mnt).padStart(2, '0') + ":" + String(dtk).padStart(2, '0');
            if (window.sisaDetikUjian < 300) timerEl.style.background = '#c0392b';
            else timerEl.style.background = '#2c3e50';
        }
    }, 1000);
};

window.kumpulkanUjianSiswa = function(isForce, isKicked) {
    try {
        let forceSubmit = isForce === true;
        let kickedSubmit = isKicked === true;

        if (!forceSubmit) {
            window.confirmAmanUjian("Yakin ingin mengumpulkan jawaban sekarang?\nPastikan semua jawaban sudah Anda periksa.", function(isYes) {
                if (isYes) {
                    window.kumpulkanUjianSiswa(true, false);
                }
            });
            return;
        }

        if (window._sedangMengirimUjian) return;
        window._sedangMengirimUjian = true;

        let btnKumpul = document.getElementById("btn-kumpul-ujian-utama");
        if (btnKumpul) {
            btnKumpul.disabled = true;
            btnKumpul.style.background = "#f39c12";
            btnKumpul.innerText = "⏳ Memproses...";
        }

        // TAMPILKAN OVERLAY LOADING KUMPUL UJIAN
        let loadingKumpul = document.getElementById("loading-kumpul-ujian");
        if (!loadingKumpul) {
            loadingKumpul = document.createElement("div");
            loadingKumpul.id = "loading-kumpul-ujian";
            loadingKumpul.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(11, 57, 84, 0.95); backdrop-filter:blur(6px); z-index:20000000; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; font-family:'Poppins', sans-serif;";
            loadingKumpul.innerHTML = 
                '<div style="width:60px; height:60px; border:6px solid rgba(255,255,255,0.2); border-top-color:#27ae60; border-radius:50%; animation:spinKumpulCBT 1s linear infinite; margin-bottom:20px;"></div>' +
                '<h2 style="margin:0; font-size:24px; letter-spacing:1px; font-weight:900; text-align:center;">Mengirim Jawaban...</h2>' +
                '<p style="font-size:14px; opacity:0.9; margin-top:10px; font-weight:600; text-align:center; padding:0 20px;">Mohon tunggu, sedang menyinkronkan nilai Anda ke server Guru.</p>' +
                '<style>@keyframes spinKumpulCBT { to { transform: rotate(360deg); } }</style>';
            document.body.appendChild(loadingKumpul);
        }
        loadingKumpul.style.display = "flex";

        clearInterval(window.timerIntervalUjian);
        clearInterval(window.penaltyInterval);
        clearInterval(window.screenGuardInterval);
        window.isStrictUjianActive = false;
        window.isPenaltyActive = false;
        window.setTiraiPrivasiUjian(false);
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
        let soalBenarUjian = [];
        let totalXPUjian = 0;

        pkt.soal.forEach(function(q, idx) {
            let ans = (pkt.jawaban && pkt.jawaban[idx] !== undefined) ? pkt.jawaban[idx] : "";
            let poin = 0;
            let maxPoin = 0;
            let statusJawab = "Salah";
            let isCorrect = false;

            if (q.type === "PG") {
                maxPoin = bobotPG;
                let normAns = window.normalisasiKunciPGK(ans, q.options);
                let normKey = window.normalisasiKunciPGK(q.correct, q.options);
                if (normAns.length === 1 && normKey.length > 0 && normAns[0] === normKey[0]) {
                    poin = bobotPG;
                    statusJawab = "Benar";
                    isCorrect = true;
                }
            } else if (q.type === "PGK") {
                maxPoin = bobotPGK;
                if (window.apakahJawabanPGKBenar(ans, q.correct, q.options)) {
                    poin = bobotPGK;
                    statusJawab = "Benar Sempurna";
                    isCorrect = true;
                }
            } else if (q.type === "IS") {
                maxPoin = bobotIS;
                let ansClean = (typeof ans === "string") ? ans.trim().toLowerCase() : "";
                if (ansClean && q.correct && q.correct.some(function(k) { return String(k).trim().toLowerCase() === ansClean; })) {
                    poin = bobotIS;
                    statusJawab = "Benar";
                    isCorrect = true;
                }
            } else if (q.type === "Essay") {
                maxPoin = bobotES;
                poin = 0;
                statusJawab = "Menunggu Guru";
            }

            if (isCorrect) {
                let xpItem = window.dapatkanPoinXPPerSoal(q.type);
                totalXPUjian += xpItem;
                soalBenarUjian.push({ type: q.type || "PG", sudahBenar: true });
            }

            totalNilai += poin;
            totalMax += maxPoin;

            let tampilanJawab = Array.isArray(ans) ? window.normalisasiKunciPGK(ans, q.options).join(", ") : (ans || "-");

            hasilDetail.push({
                nomor: (typeof q.originalIndex === "number" ? q.originalIndex : idx) + 1,
                soal: q.question || "",
                tipe: q.type || "PG",
                jawabSiswa: tampilanJawab || "-",
                jawabanSiswa: tampilanJawab || "-",
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

        let rekapPaketLama = (typeof window.ambilObjekRekapPaket === "function") ? window.ambilObjekRekapPaket(pkt.kelas, pkt.paket) : {};
        let dataSiswaLama = (typeof window.ambilDataSiswaDiObjekRekap === "function") ? window.ambilDataSiswaDiObjekRekap(rekapPaketLama, pkt.nama) : null;
        let nilaiSebelumRemedial = (dataSiswaLama && dataSiswaLama.nilaiAkhir !== undefined) ? parseFloat(dataSiswaLama.nilaiAkhir) : null;

        let batasKkmRemedial = 0;
        if (pkt.isRemedial) {
            batasKkmRemedial = Number(pkt.maxScore) || (typeof window.dapatkanKKMKelas === "function" ? window.dapatkanKKMKelas(pkt.kelas) : 75);
            if (nilaiAkhir > batasKkmRemedial) {
                nilaiAkhir = batasKkmRemedial;
            }
            if (nilaiSebelumRemedial !== null && !isNaN(nilaiSebelumRemedial)) {
                nilaiAkhir = Math.max(nilaiSebelumRemedial, nilaiAkhir);
            }
        }

        let pathRekap = "admin_rekap_nilai/" + safeKelas + "/" + safePaket + "/" + safeNama;
        let payloadRekap = {
            namaAsli: pkt.nama,
            kelasAsli: pkt.kelas,
            paketAsli: pkt.paket,
            usernameSiswa: sessionStorage.getItem("username") || "",
            nilaiAkhir: nilaiAkhir,
            xpSudahDiberikan: totalXPUjian,
            pelanggaran: window.violationCount || 0,
            waktuKumpul: new Date().toISOString(),
            isRemedial: Boolean(pkt.isRemedial),
            maxScore: batasKkmRemedial || 100,
            nilaiSebelumRemedial: nilaiSebelumRemedial,
            detail: hasilDetail
        };

        if (!window.adminRekapNilaiData) window.adminRekapNilaiData = {};
        if (!window.adminRekapNilaiData[safeKelas]) window.adminRekapNilaiData[safeKelas] = {};
        if (!window.adminRekapNilaiData[safeKelas][safePaket]) window.adminRekapNilaiData[safeKelas][safePaket] = {};
        window.adminRekapNilaiData[safeKelas][safePaket][safeNama] = payloadRekap;

        function selesaikanKeluarRuangUjian() {
            let loadingKumpul = document.getElementById("loading-kumpul-ujian");
            if (loadingKumpul) loadingKumpul.style.display = "none";
            try {
                if (sessionStorage.getItem("statusLogin") === "siswa" && typeof window.tambahXPSiswa === "function" && totalXPUjian > 0) {
                    window.tambahXPSiswa(totalXPUjian, "ujian", soalBenarUjian);
                }
            } catch (xpErr) {
                console.warn("Isolasi XP:", xpErr);
            }

            try {
                if (sessionStorage.getItem("statusLogin") === "siswa" && typeof window.catatRiwayatAktivitasSiswa === "function") {
                    let jmlSoalUjian = pkt.soal ? pkt.soal.length : hasilDetail.length;
                    let jmlBenarUjian = soalBenarUjian.length;
                    let jmlMenungguUjian = hasilDetail.filter(function(h) { return h.status === "Menunggu Guru"; }).length;
                    let jmlSalahUjian = Math.max(0, jmlSoalUjian - jmlBenarUjian - jmlMenungguUjian);
                    let detailUjian = "Jumlah: " + jmlSoalUjian + " Soal | Benar: " + jmlBenarUjian + " | Salah: " + jmlSalahUjian +
                        (jmlMenungguUjian > 0 ? " | Menunggu Koreksi: " + jmlMenungguUjian : "") +
                        " | Nilai: " + nilaiAkhir;
                    window.catatRiwayatAktivitasSiswa("soal", "Ujian: " + (pkt.paket || "Ujian Kelas"), detailUjian);
                }
            } catch (histErr) {
                console.warn("Isolasi History Ujian:", histErr);
            }

            window._sedangMengirimUjian = false;
            if (typeof window.hapusCadanganLokalUjian === "function") window.hapusCadanganLokalUjian();
            window.sesiUjianSiswa = null;

            window.tutupUjianStrict();
            window.alertAmanUjian("✅ Ujian Berhasil Dikumpulkan!\n\nNilai sementara Anda: " + nilaiAkhir + "\nBonus Soal Benar: +" + totalXPUjian + " XP");

            if (typeof window.navigasiHalaman === "function") {
                window.navigasiHalaman(null, "home");
            } else {
                window.location.href = "index.html?bab=home";
            }
        }

        let jalankanKirimServer = function() {
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

            let attemptKirim = function(retryCount) {
                if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
                    window.kirimNilaiUjianAmanKeDB(pathRekap, payloadRekap, function() {
                        selesaikanKeluarRuangUjian();
                    }, function() {
                        if (retryCount > 0) {
                            setTimeout(function() { attemptKirim(retryCount - 1); }, 3000);
                        } else {
                            // JANGAN HAPUS LOCAL STORAGE. Beri peringatan dan kembalikan tombol.
                            window._sedangMengirimUjian = false;
                            let loadingKumpul = document.getElementById("loading-kumpul-ujian");
                            if (loadingKumpul) loadingKumpul.style.display = "none";
                            
                            let btnKumpul = document.getElementById("btn-kumpul-ujian-utama");
                            if (btnKumpul) {
                                btnKumpul.disabled = false;
                                btnKumpul.style.background = "#27ae60";
                                btnKumpul.innerText = "📥 Coba Kumpulkan Lagi";
                            }
                            window.alertAmanUjian("❌ GAGAL MENGIRIM JAWABAN!\n\nKoneksi internet Anda mungkin terputus. Jawaban Anda MASIH AMAN di perangkat ini.\nSilakan periksa koneksi internet Anda, lalu tekan tombol 'Coba Kumpulkan Lagi'.");
                        }
                    });
                } else if (typeof window.simpanNilaiUjianKeDB === "function") {
                    window.simpanNilaiUjianKeDB(pathRekap, payloadRekap);
                    setTimeout(selesaikanKeluarRuangUjian, 1500);
                } else {
                    selesaikanKeluarRuangUjian();
                }
            };
            
            attemptKirim(3); // Coba 3 kali dengan jeda 3 detik, jika gagal total jangan hapus jawaban
        };

        if (typeof window.pastikanAuthFirebaseSiswaAktif === "function") {
            window.pastikanAuthFirebaseSiswaAktif(jalankanKirimServer);
        } else {
            jalankanKirimServer();
        }
    } catch (err) {
        window._sedangMengirimUjian = false;
        console.error("Kesalahan saat mengumpulkan ujian:", err);
        window.alertAmanUjian("Terjadi kesalahan saat memproses pengumpulan ujian. Silakan tekan tombol Kumpulkan sekali lagi.");
    }
};

// =========================================================================
// 3. SENSOR ANTI-CHEAT PRESISI (SAFARI IPHONE ZOOM AMAN & DETEKSI KELUAR MUTLAK)
// =========================================================================
document.addEventListener('contextmenu', function(e) {
    if (sessionStorage.getItem("statusLogin") !== "admin") {
        e.preventDefault();
    }
});

document.addEventListener('copy', function(e) {
    if (window.isStrictUjianActive && sessionStorage.getItem("statusLogin") !== "admin") {
        e.preventDefault();
        window.alertAmanUjian("⚠️ Dilarang menyalin (copy) soal ujian!");
    }
});
document.addEventListener('cut', function(e) {
    if (window.isStrictUjianActive && sessionStorage.getItem("statusLogin") !== "admin") {
        e.preventDefault();
    }
});
document.addEventListener('paste', function(e) {
    if (window.isStrictUjianActive && sessionStorage.getItem("statusLogin") !== "admin") {
        e.preventDefault();
        window.alertAmanUjian("⚠️ Dilarang menempel (paste) contekan dari luar!");
    }
});
document.addEventListener('selectstart', function(e) {
    let activeTag = e.target ? e.target.tagName : '';
    let isInput = (activeTag === 'INPUT' || activeTag === 'TEXTAREA');
    if (window.isStrictUjianActive && sessionStorage.getItem("statusLogin") !== "admin" && !isInput) {
        e.preventDefault();
    }
});

// 1. Kunci Mati Tombol Kembali (Hardware Back / Swipe Back) Tanpa Pop-up & Tanpa Ruang Palsu
window.addEventListener('popstate', function(e) {
    if (window.isStrictUjianActive && sessionStorage.getItem("statusLogin") !== "admin") {
        try {
            for (let i = 0; i < 5; i++) {
                window.history.pushState({ inExamLocked: true, t: Date.now() }, "", window.location.href);
            }
        } catch (err) {}
    }
});

// 2. Blokir Tarikan Jari dari Tepi Bawah (Home Bar), Tepi Atas (Notifikasi), & Tepi Samping (Swipe Back)
document.addEventListener('touchstart', function(e) {
    if (!window.isStrictUjianActive || sessionStorage.getItem("statusLogin") === "admin") return;

    // Paksa kembali ke Immersive Fullscreen & WakeLock setiap kali layar disentuh
    if (!window.apakahPerangkatIPhone() && !document.fullscreenElement && !document.webkitFullscreenElement) {
        window.aktifkanFullscreenUjian();
    }
    if (!window.ujianWakeLock) {
        window.aktifkanWakeLockUjian();
    }

    if (e.touches && e.touches.length === 1) {
        let touch = e.touches[0];
        let x = touch.clientX;
        let y = touch.clientY;
        let w = window.innerWidth;
        let h = window.innerHeight;

        // Matikan tarikan dari tepi kiri/kanan (<= 28px) dan tepi bawah/atas (<= 28px)
        let isEdgeSwipeBack = (x <= 28 || x >= w - 28);
        let isBottomHomeSwipe = (y >= h - 32);
        let isTopBarSwipe = (y <= 24);

        if (isEdgeSwipeBack || isBottomHomeSwipe || isTopBarSwipe) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}, { passive: false, capture: true });

// 3. Cegah Penutupan Tab / Refresh Paksa Selama Ujian
window.addEventListener('beforeunload', function(e) {
    if (window.isStrictUjianActive && !window._sedangMengirimUjian && sessionStorage.getItem("statusLogin") !== "admin") {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// 4. Jika Siswa Menarik Bilah Navigasi Keluar dari Fullscreen, Kunci Kembali Saat Menyentuh Layar
document.addEventListener('fullscreenchange', function() {
    if (window.isStrictUjianActive && sessionStorage.getItem("statusLogin") !== "admin") {
        if (!document.fullscreenElement && !window.sedangDialogSistem) {
            window.graceOrientationTime = Date.now() + 1200;
        }
    }
});

// 1. Pelacak Transisi Keyboard Virtual (Memberi jeda 2 detik saat animasi buka/tutup keyboard)
document.addEventListener('focusin', function(e) {
    let t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) {
        window.graceKeyboardTime = Date.now() + 2000;
        clearTimeout(window.blurCheckTimer);
    }
}, true);

document.addEventListener('focusout', function(e) {
    let t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) {
        window.graceKeyboardTime = Date.now() + 2000;
        clearTimeout(window.blurCheckTimer);
    }
}, true);

// 2. Pelacak Gestur Pinch-to-Zoom (Termasuk Event Khusus Safari iOS: gesturestart, gesturechange, gestureend)
window.tandaiGesturZoomAktif = function() {
    if (!window.isStrictUjianActive) return;
    window.graceZoomTime = Date.now() + 2500;
    clearTimeout(window.blurCheckTimer);
};

document.addEventListener('gesturestart', window.tandaiGesturZoomAktif, { passive: true });
document.addEventListener('gesturechange', window.tandaiGesturZoomAktif, { passive: true });
document.addEventListener('gestureend', window.tandaiGesturZoomAktif, { passive: true });

document.addEventListener('touchstart', function(e) {
    if (!window.isStrictUjianActive) return;
    if (e.touches && e.touches.length >= 2) {
        window.tandaiGesturZoomAktif();
    }
    let t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) {
        window.graceKeyboardTime = Date.now() + 2000;
    }
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    if (!window.isStrictUjianActive) return;
    if (e.touches && e.touches.length >= 2) {
        window.tandaiGesturZoomAktif();
    }
}, { passive: true });

if (window.visualViewport) {
    window.lastVVScale = window.visualViewport.scale || 1;
    window.visualViewport.addEventListener('resize', function() {
        if (!window.isStrictUjianActive) return;
        let curScale = window.visualViewport.scale || 1;
        if (Math.abs(curScale - (window.lastVVScale || 1)) > 0.01) {
            window.lastVVScale = curScale;
            window.graceZoomTime = Date.now() + 2500;
            return;
        }
        if (Math.abs(window.visualViewport.width - window.innerWidth) < 35) {
            window.graceKeyboardTime = Date.now() + 2000;
        }
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'AudioVolumeUp' || e.key === 'AudioVolumeDown' || e.key === 'AudioVolumeMute' || e.keyCode === 174 || e.keyCode === 175 || e.keyCode === 173) {
        return;
    }

    let keyUpper = (e.key || '').toUpperCase();

    if (window.isStrictUjianActive && sessionStorage.getItem("statusLogin") !== "admin") {
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
            window.graceZoomTime = Date.now() + 2500;
            return;
        }

        let isPrintScreen = (e.key === 'PrintScreen' || e.keyCode === 44);
        let isMacShot = (e.metaKey && e.shiftKey && (keyUpper === '3' || keyUpper === '4' || keyUpper === '5' || keyUpper === '6'));
        let isWinSnip = (e.metaKey && e.shiftKey && keyUpper === 'S');
        let isGameBarRecord = (e.metaKey && keyUpper === 'G') || (e.metaKey && e.altKey && keyUpper === 'R');
        let isNewTabOrWin = ((e.ctrlKey || e.metaKey) && (keyUpper === 'T' || keyUpper === 'N' || keyUpper === 'W'));

        if (isPrintScreen || isMacShot || isWinSnip || isGameBarRecord) {
            e.preventDefault();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText("Screenshot & perekaman layar dilarang selama ujian berlangsung!");
            }
            window.triggerPelanggaran("Terdeteksi menekan pintasan Tangkapan Layar / Perekam Layar!");
            return false;
        }

        if (isNewTabOrWin) {
            e.preventDefault();
            window.triggerPelanggaran("Terdeteksi mencoba membuka Tab atau Jendela Peramban baru!");
            return false;
        }
    }

    if (sessionStorage.getItem("statusLogin") === "admin") return;

    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (keyUpper === 'I' || keyUpper === 'J' || keyUpper === 'C')) {
        e.preventDefault();
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && (keyUpper === 'U' || keyUpper === 'S')) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('keyup', function(e) {
    if (window.isStrictUjianActive && (e.key === 'PrintScreen' || e.keyCode === 44)) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText("Screenshot dilarang selama ujian berlangsung!");
        }
        window.triggerPelanggaran("Terdeteksi menekan tombol Screenshot!");
    }
});

window.triggerPelanggaran = function(alasanKhusus) {
    if (!window.isStrictUjianActive || window.sedangDialogSistem) return;
    if (sessionStorage.getItem("statusLogin") === "admin") {
        window.setTiraiPrivasiUjian(false);
        return;
    }

    let now = Date.now();
    if (now - window.lastViolationTime < 1400) return;
    window.lastViolationTime = now;

    window.violationCount++;
    window.simpanCadanganLokalUjian();
    clearInterval(window.penaltyInterval);

    if (window.sesiUjianSiswa) {
        let pkt = window.sesiUjianSiswa;
        let payloadPelanggaran = {
            kelas: pkt.kelas,
            nama: pkt.nama,
            paket: pkt.paket,
            status: window.violationCount >= 6 ? "Dikeluarkan" : "Sedang Mengerjakan",
            pelanggaran: window.violationCount,
            waktuUpdate: new Date().toISOString()
        };
        if (!window.adminLiveMonitorData) window.adminLiveMonitorData = {};
        if (!window.adminLiveMonitorData[pkt.paket]) window.adminLiveMonitorData[pkt.paket] = {};
        if (!window.adminLiveMonitorData[pkt.paket][pkt.kelas]) window.adminLiveMonitorData[pkt.paket][pkt.kelas] = {};
        window.adminLiveMonitorData[pkt.paket][pkt.kelas][pkt.nama] = payloadPelanggaran;

        if (typeof window.perbaruiBadgeNotifMonitor === "function") {
            window.perbaruiBadgeNotifMonitor();
        }

        if (typeof window.simpanStatusLiveMonitorKeDB === "function") {
            if (typeof window.modeHematServerUjian === "function") window.modeHematServerUjian(false);
            window.simpanStatusLiveMonitorKeDB(pkt.paket, pkt.kelas, pkt.nama, payloadPelanggaran);
            if (window.violationCount < 6) {
                setTimeout(function() {
                    if (window.isStrictUjianActive && typeof window.modeHematServerUjian === "function") {
                        window.modeHematServerUjian(true);
                    }
                }, 3000);
            }
        }
    }

    let overlay = document.getElementById('strict-warning-overlay');
    let info = document.getElementById('strict-warning-info');
    let countdownEl = document.getElementById('strict-countdown');

    if (window.violationCount === 1) window.penaltyWaitTime = 30;
    else if (window.violationCount === 2) window.penaltyWaitTime = 300;
    else if (window.violationCount === 3) window.penaltyWaitTime = 1200;
    else if (window.violationCount === 4) window.penaltyWaitTime = 2400;
    else if (window.violationCount === 5) window.penaltyWaitTime = 3600;
    else if (window.violationCount >= 6) {
        if (overlay) overlay.style.display = 'none';
        window.isPenaltyActive = false;
        window.isStrictUjianActive = false;
        window.setTiraiPrivasiUjian(false);
        window.alertAmanUjian("❌ PELANGGARAN MAKSIMAL (6x)!\n\nSistem mendeteksi aktivitas mencurigakan berulang kali. Ujian dihentikan paksa dan hasil pekerjaan Anda telah dikirim ke Rekap Nilai Guru!");
        window.kumpulkanUjianSiswa(true, true);
        return;
    }

    window.isPenaltyActive = true;
    window.setTiraiPrivasiUjian(true);
    if (overlay) overlay.style.display = 'flex';

    let teksAlasan = alasanKhusus ? ' (' + alasanKhusus + ')' : '';
    if (info) info.innerText = 'Pelanggaran ke-' + window.violationCount + '/6!' + teksAlasan + ' ' + (window.violationCount === 5 ? '(PERINGATAN TERAKHIR!)' : '');
    if (countdownEl) countdownEl.innerText = window.penaltyWaitTime;

    window.penaltyInterval = setInterval(function() {
        window.penaltyWaitTime--;
        if (countdownEl) countdownEl.innerText = window.penaltyWaitTime;

        if (window.penaltyWaitTime <= 0) {
            clearInterval(window.penaltyInterval);
            if (overlay) overlay.style.display = 'none';
            window.isPenaltyActive = false;
            window.setTiraiPrivasiUjian(false);
        }
    }, 1000);
};

window.cancelHukuman = function() {
    clearInterval(window.penaltyInterval);
    let overlay = document.getElementById('strict-warning-overlay');
    if (overlay) overlay.style.display = 'none';
    window.isPenaltyActive = false;
    window.setTiraiPrivasiUjian(false);
    window.alertAmanUjian("Kunci penalti berhasil dibuka oleh Guru.");
};

// 3. DETEKSI MUTLAK KELUAR RUANG UJIAN (Pindah Tab, Home Screen, Pindah Aplikasi, Kunci Layar)
document.addEventListener("visibilitychange", function() {
    if (!window.isStrictUjianActive || window.sedangDialogSistem) return;
    if (document.visibilityState === 'hidden' || document.hidden) {
        window.triggerPelanggaran("Keluar dari ruang ujian atau membuka tab/aplikasi lain!");
    } else if (document.visibilityState === 'visible') {
        if (!window.isPenaltyActive) window.setTiraiPrivasiUjian(false);
        window.aktifkanWakeLockUjian();
    }
});

window.addEventListener("pagehide", function() {
    if (window.isStrictUjianActive && !window.sedangDialogSistem) {
        window.triggerPelanggaran("Meninggalkan atau menutup halaman ujian!");
    }
});

// 4. DETEKSI KEHILANGAN FOKUS (Dilengkapi Proteksi Mengetik Isian/Essay & Shield Transisi 4 Detik)
window.addEventListener("blur", function() {
    if (!window.isStrictUjianActive || window.sedangDialogSistem) return;
    if (Date.now() < (window.ujianEntryShieldUntil || 0) || Date.now() < (window.graceOrientationTime || 0)) return;

    clearTimeout(window.blurCheckTimer);
    let activeTag = document.activeElement ? document.activeElement.tagName.toUpperCase() : '';
    let isTyping = (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT');
    let toleransiDelay = isTyping ? 2200 : 1100;

    window.blurCheckTimer = setTimeout(function() {
        if (!window.isStrictUjianActive || window.sedangDialogSistem) return;
        if (Date.now() < (window.ujianEntryShieldUntil || 0)) return;

        if (document.visibilityState === 'hidden' || document.hidden) {
            window.triggerPelanggaran("Keluar dari aplikasi ujian / membuka tab peramban lain!");
            return;
        }

        if (
            Date.now() < (window.graceOrientationTime || 0) ||
            window.apakahTransisiKeyboardAktif() ||
            window.apakahTransisiZoomAktif()
        ) {
            return;
        }

        if (!document.hasFocus() && !isTyping) {
            window.triggerPelanggaran("Fokus layar berpindah ke luar ruang ujian (Membuka Aplikasi Mengambang / Panel Sistem)!");
        }
    }, toleransiDelay);
});

window.addEventListener("focus", function() {
    clearTimeout(window.blurCheckTimer);
    if (window.isStrictUjianActive && !window.isPenaltyActive) {
        window.setTiraiPrivasiUjian(false);
    }
});

window.tandaiPerubahanOrientasiAman = function() {
    window.graceOrientationTime = Date.now() + 3000;
    clearTimeout(window.blurCheckTimer);
    setTimeout(function() {
        window.lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        window.initUjianWidth = window.innerWidth;
        window.initUjianHeight = window.innerHeight;
    }, 500);
};

window.addEventListener("orientationchange", window.tandaiPerubahanOrientasiAman);
if (window.screen && window.screen.orientation && window.screen.orientation.addEventListener) {
    window.screen.orientation.addEventListener("change", window.tandaiPerubahanOrientasiAman);
}

window.addEventListener("resize", function() {
    if (!window.isStrictUjianActive || window.sedangDialogSistem) return;

    // 1. Jika di iPhone (iOS), resize murni berasal dari Zoom Safari ('aA' / Pinch) atau Address Bar -> 100% Aman
    if (window.apakahPerangkatIPhone()) {
        window.graceZoomTime = Date.now() + 2000;
        return;
    }

    // 2. Cek apakah terjadi perubahan Zoom Browser (devicePixelRatio)
    let curDPR = window.devicePixelRatio || 1;
    if (Math.abs(curDPR - (window.lastDPRUjian || 1)) > 0.01) {
        window.lastDPRUjian = curDPR;
        window.graceZoomTime = Date.now() + 2500;
        return;
    }

    // 3. Cek apakah orientasi Portrait <-> Landscape berubah
    let currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    if (currentOrientation !== window.lastOrientation) {
        window.lastOrientation = currentOrientation;
        window.tandaiPerubahanOrientasiAman();
        return;
    }

    // 4. Jika lebar layar tetap sama namun hanya tinggi yang berubah di HP/Tablet, itu adalah Keyboard Virtual / Address Bar
    if (window.initUjianWidth && Math.abs(window.innerWidth - window.initUjianWidth) < 30) {
        window.graceKeyboardTime = Date.now() + 1500;
        return;
    }

    if (
        Date.now() < (window.ujianEntryShieldUntil || 0) ||
        Date.now() < (window.graceOrientationTime || 0) ||
        window.apakahTransisiKeyboardAktif() ||
        window.apakahTransisiZoomAktif()
    ) {
        return;
    }

    let cek = window.cekKondisiLayarPenuhDanBersih();
    if (!cek.aman) {
        window.triggerPelanggaran(cek.alasan);
    }
});

// =========================================================================
// 4. NAVIGASI CBT MELAYANG (AUTO-TRACKING JAWABAN UJIAN & LATIHAN)
// =========================================================================
window.toggleCbtNav = function(forceOpen) {
    let drawer = document.getElementById('cbt-nav-drawer');
    if (!drawer) return;
    if (typeof forceOpen === 'boolean') {
        if (forceOpen) drawer.classList.add('show-nav');
        else drawer.classList.remove('show-nav');
    } else {
        drawer.classList.toggle('show-nav');
    }
};

window.lompatKeSoalCBT = function(targetId) {
    window.toggleCbtNav(false);
    setTimeout(function() {
        let el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 120);
};

window.renderCbtNavigation = function(total, tipe) {
    let grid = document.getElementById('cbt-nav-grid');
    let btn = document.getElementById('btn-toggle-cbt-nav');
    if (!grid || !btn) return;

    let html = '';
    for (let i = 0; i < total; i++) {
        let prefix = tipe === 'ujian' ? 'soal-ujian-' : 'card-latihan-';
        html += '<button type="button" class="quiz-nav-btn" id="nav-cbt-' + i + '" onclick="window.lompatKeSoalCBT(\'' + prefix + i + '\')">' + (i + 1) + '</button>';
    }
    grid.innerHTML = html;
    btn.style.display = 'flex';
    window.updateCbtNavInfo(tipe);
};

window.updateCbtNavInfo = function(tipe) {
    let info = document.getElementById('cbt-nav-info');
    if (!info) return;

    let dijawab = 0;
    let total = 0;

    if (tipe === 'ujian' && window.sesiUjianSiswa) {
        total = window.sesiUjianSiswa.soal.length;
        let ansObj = window.sesiUjianSiswa.jawaban || {};
        for (let i = 0; i < total; i++) {
            let btn = document.getElementById('nav-cbt-' + i);
            let ans = ansObj[i];
            let isAnswered = ans !== undefined && ans !== null && ans !== "" && (!Array.isArray(ans) || ans.length > 0);
            if (isAnswered) dijawab++;

            if (btn) {
                if (isAnswered) btn.classList.add('nav-answered');
                else btn.classList.remove('nav-answered');
            }
        }
    } else if (tipe === 'latihan' && window.sesiLatihanSiswa) {
        total = window.sesiLatihanSiswa.soal.length;
        dijawab = (window.sesiLatihanSiswa.statusJawab || []).filter(Boolean).length;
        for (let i = 0; i < total; i++) {
            let btn = document.getElementById('nav-cbt-' + i);
            if (btn) {
                if (window.sesiLatihanSiswa.statusJawab[i]) btn.classList.add('nav-answered');
                else btn.classList.remove('nav-answered');
            }
        }
    }
    info.innerText = dijawab + '/' + total + ' Terjawab';
};

// =========================================================================
// 5. REKAP NILAI HISTORY, SPREADSHEET ANALISIS (0-1), & SCANNER LJK OCR
// =========================================================================
window.ambilDaftarPaketUjianKelas = function(namaKelas) {
    if (!namaKelas) return [];
    let safeKelas = window.sanitasiKeyRekapFirebase(namaKelas);
    let paketMap = {};

    function daftarkanPaket(rawKey, labelAsli) {
        if (!rawKey) return;
        let safeP = window.sanitasiKeyRekapFirebase(rawKey).toLowerCase();
        if (!paketMap[safeP]) {
            paketMap[safeP] = labelAsli || rawKey;
        }
    }

    let rekapKls = window.ambilObjekRekapKelas(namaKelas);
    Object.keys(rekapKls).forEach(function(p) {
        let mapSiswa = rekapKls[p] || {};
        if (Object.keys(mapSiswa).length > 0) {
            let sampel = Object.values(mapSiswa)[0];
            daftarkanPaket(p, (sampel && sampel.paketAsli) ? sampel.paketAsli : p);
        }
    });

    if (window.adminLiveMonitorData) {
        Object.keys(window.adminLiveMonitorData).forEach(function(p) {
            let monPaket = window.adminLiveMonitorData[p] || {};
            let monKelas = monPaket[namaKelas] || monPaket[safeKelas];
            if (monKelas && Object.keys(monKelas).length > 0) {
                let sampel = Object.values(monKelas)[0];
                daftarkanPaket(p, (sampel && sampel.paket) ? sampel.paket : p);
            }
        });
    }

    if (window.adminLedgerMetaData && window.adminLedgerMetaData[namaKelas] && Array.isArray(window.adminLedgerMetaData[namaKelas].kolom)) {
        window.adminLedgerMetaData[namaKelas].kolom.forEach(function(p) {
            let safeP = window.sanitasiKeyRekapFirebase(p);
            let adaBank = window.adminBankUjianData && (window.adminBankUjianData[p] || window.adminBankUjianData[safeP]);
            let adaRekap = Object.keys(window.ambilObjekRekapPaket(namaKelas, p)).length > 0;
            if (adaBank || adaRekap) {
                daftarkanPaket(p, p);
            }
        });
    }

    return Object.values(paketMap).sort();
};

window.ubahKelasRekapNilai = function(isFromInit) {
    let selKelas = document.getElementById('filter-rekap-kelas');
    let selPaket = document.getElementById('filter-rekap-paket');
    if (!selKelas || !selPaket) return;

    let kls = selKelas.value;
    let prevPaket = selPaket.value;

    if (!kls) {
        selPaket.innerHTML = '<option value="">-- Pilih Kelas Terlebih Dahulu --</option>';
        selPaket.disabled = true;
        window.renderRekapNilai();
        return;
    }

    let rekapKls = window.ambilObjekRekapKelas(kls);
    let paketUnikMap = {};

    Object.keys(rekapKls).forEach(function(pKey) {
        let mapSiswa = rekapKls[pKey] || {};
        if (Object.keys(mapSiswa).length === 0) return;
        let safeP = window.sanitasiKeyRekapFirebase(pKey).toLowerCase();
        let sampel = Object.values(mapSiswa)[0];
        let labelPkt = (sampel && sampel.paketAsli) ? sampel.paketAsli : pKey;
        if (!paketUnikMap[safeP]) {
            paketUnikMap[safeP] = { key: pKey, label: labelPkt };
        }
    });

    let daftarPaketKelas = Object.values(paketUnikMap).sort(function(a, b) {
        return a.label.localeCompare(b.label);
    });

    selPaket.disabled = false;

    if (daftarPaketKelas.length === 0) {
        selPaket.innerHTML = '<option value="">-- Belum Ada Ujian di Kelas Ini --</option>';
        window.renderRekapNilai();
        return;
    }

    let prevSafe = window.sanitasiKeyRekapFirebase(prevPaket).toLowerCase();
    let htmlP = '<option value="">-- History Semua Ujian (' + daftarPaketKelas.length + ' Ujian) --</option>';
    let masihAdaPrev = false;

    daftarPaketKelas.forEach(function(item) {
        let itemSafe = window.sanitasiKeyRekapFirebase(item.key).toLowerCase();
        let isSel = (prevPaket !== "" && (item.key === prevPaket || item.label === prevPaket || itemSafe === prevSafe));
        if (isSel) masihAdaPrev = true;
        htmlP += '<option value="' + item.key.replace(/"/g, '&quot;') + '" ' + (isSel ? 'selected' : '') + '>' + item.label + '</option>';
    });
    selPaket.innerHTML = htmlP;

    if (!masihAdaPrev && !isFromInit && prevPaket !== "") {
        selPaket.focus();
    }

    window.renderRekapNilai();
};

window.renderDropdownRekap = function() {
    let selKelas = document.getElementById('filter-rekap-kelas');
    let selPaket = document.getElementById('filter-rekap-paket');
    if (!selKelas || !selPaket) return;

    let kelasAktif = selKelas.value || window.kelasAktifAdmin || "";
    let kelasArr = Object.keys(window.adminData || {}).sort();

    let htmlK = '<option value="">-- Pilih Kelas --</option>';
    kelasArr.forEach(function(k) { htmlK += '<option value="' + k + '" ' + (k === kelasAktif ? 'selected' : '') + '>' + k + '</option>'; });
    selKelas.innerHTML = htmlK;

    window.ubahKelasRekapNilai(true);
};

window.renderRekapNilai = function() {
    let selKelas = document.getElementById('filter-rekap-kelas').value;
    let selPaket = document.getElementById('filter-rekap-paket').value;
    let tbody = document.getElementById('body-rekap-nilai');
    let thead = document.getElementById('head-rekap-nilai');
    if (!tbody) return;

    let btnHapusSemua = document.getElementById('btn-hapus-semua-rekap');
    if (btnHapusSemua) {
        btnHapusSemua.style.display = (selKelas && selPaket) ? 'inline-block' : 'none';
    }

    if (!selKelas) {
        tbody.innerHTML = '<tr><td colspan="7" style="padding:20px; color:#7f8c8d; font-weight:bold;">Pilih Kelas di atas untuk melihat rekap nilai.</td></tr>';
        return;
    }

    let rekapKls = (typeof window.ambilObjekRekapKelas === "function") ? window.ambilObjekRekapKelas(selKelas) : (window.adminRekapNilaiData[selKelas] || {});
    let semuaSiswaKelas = window.adminData[selKelas] || [];

    if (!selPaket) {
        if (thead) thead.innerHTML = '<tr><th style="width:40px; background:#2c3e50;">No</th><th style="text-align:left; background:#2c3e50; min-width:150px;">Nama Siswa</th><th style="background:#2c3e50; width:140px;">Waktu Kumpul</th><th style="background:#2c3e50; width:160px;">Nama Ujian</th><th style="background:#2c3e50; width:90px;">Pelanggaran</th><th style="background:#2c3e50; width:80px;">Nilai Akhir</th><th style="background:#2c3e50; width:120px;">Aksi Guru</th></tr>';

        let daftarRiwayat = [];
        Object.keys(rekapKls).forEach(function(namaPkt) {
            let pktMap = rekapKls[namaPkt] || {};
            Object.keys(pktMap).forEach(function(namaSiswa) {
                let d = pktMap[namaSiswa];
                if (!d) return;
                d._keySiswa = namaSiswa;
                d._namaSiswa = d.namaAsli || namaSiswa;
                d._keyPaket = namaPkt;
                d._namaPaket = d.paketAsli || namaPkt;
                daftarRiwayat.push(d);
            });
        });

        if (daftarRiwayat.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="padding:20px; color:#e67e22; font-weight:bold;">Belum ada riwayat pengerjaan ujian di kelas ini.</td></tr>';
            return;
        }

        daftarRiwayat.sort(function(a, b) {
            let timeA = new Date(a.waktuKumpul || 0).getTime();
            let timeB = new Date(b.waktuKumpul || 0).getTime();
            return timeB - timeA;
        });

        let html = '';
        daftarRiwayat.forEach(function(d, idx) {
            let dDateObj = d.waktuKumpul ? new Date(d.waktuKumpul) : null;
            let dDate = (dDateObj && !isNaN(dDateObj.getTime()))
                ? (dDateObj.getHours().toString().padStart(2, '0') + ':' + dDateObj.getMinutes().toString().padStart(2, '0') + ' - ' + dDateObj.getDate().toString().padStart(2, '0') + '/' + (dDateObj.getMonth() + 1).toString().padStart(2, '0'))
                : (d.waktu || 'Input Manual');
            if (d.waktuKumpul === "Remedial Tuntas") dDate = "Remedial";

            let badgePelanggaran = d.pelanggaran >= 5 ? '<span style="background:#c0392b; color:white; padding:3px 8px; border-radius:12px; font-size:10px; font-weight:bold;">KICKED (' + d.pelanggaran + 'x)</span>' : (d.pelanggaran > 0 ? '<span style="background:#f39c12; color:white; padding:3px 8px; border-radius:12px; font-size:10px; font-weight:bold;">' + d.pelanggaran + 'x</span>' : '<span style="color:#27ae60; font-weight:bold;">Aman</span>');

            let btnKoreksi = '<button style="background:#8e44ad; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;" data-k="' + selKelas.replace(/"/g, '&quot;') + '" data-p="' + d._keyPaket.replace(/"/g, '&quot;') + '" data-n="' + d._keySiswa.replace(/"/g, '&quot;') + '" onclick="window.bukaKoreksiUjian(this)">🔍 Detail</button>';

            html += '<tr style="border-bottom:1px solid #eee;">' +
                '<td style="color:#7f8c8d; font-weight:bold;">' + (idx + 1) + '</td>' +
                '<td style="text-align:left; font-weight:bold; color:#2c3e50;">' + d._namaSiswa + '</td>' +
                '<td style="font-size:11px; color:#7f8c8d; font-weight:bold;">' + dDate + '</td>' +
                '<td style="font-weight:bold; color:#8e44ad; font-size:11px;">' + d._namaPaket + '</td>' +
                '<td>' + badgePelanggaran + '</td>' +
                '<td style="font-size:18px; font-weight:900; color:#16a085;">' + (d.nilaiAkhir !== undefined ? Number(d.nilaiAkhir).toFixed(1) : '-') + '</td>' +
                '<td>' + btnKoreksi + '</td>' +
            '</tr>';
        });
        tbody.innerHTML = html;
        return;
    }

    if (thead) thead.innerHTML = '<tr><th style="width:40px; background:#2c3e50;">No</th><th style="text-align:left; background:#2c3e50; min-width:150px;">Nama Siswa</th><th style="background:#2c3e50; width:140px;">Waktu Kumpul</th><th style="display:none;">Nama Ujian</th><th style="background:#2c3e50; width:90px;">Pelanggaran</th><th style="background:#2c3e50; width:80px;">Nilai Akhir</th><th style="background:#2c3e50; width:120px;">Aksi Guru</th></tr>';

    let dataSiswa = (typeof window.ambilObjekRekapPaket === "function") ? window.ambilObjekRekapPaket(selKelas, selPaket) : (rekapKls[selPaket] || {});
    let namaSiswaArr = Object.keys(dataSiswa);

    let listSiswaTerurut = namaSiswaArr.map(function(keyNama) {
        let d = dataSiswa[keyNama];
        let namaTampil = (d && d.namaAsli) ? d.namaAsli : keyNama;
        let detailArr = d.detail || d.rincian || [];
        let perluPeriksa = false;
        if (!d.sudahDikoreksi && detailArr.length > 0) {
            perluPeriksa = detailArr.some(function(x) {
                let pDidapat = x.poinDidapat !== undefined ? x.poinDidapat : (x.poin || 0);
                return x.status === 'Menunggu Guru' || ((x.tipe === 'IS' || x.tipe === 'Isian' || x.tipe === 'Essay') && pDidapat <= 0);
            });
        }
        return { keyNama: keyNama, nama: namaTampil, data: d, perluPeriksa: perluPeriksa };
    });

    listSiswaTerurut.sort(function(a, b) {
        if (a.perluPeriksa && !b.perluPeriksa) return -1;
        if (!a.perluPeriksa && b.perluPeriksa) return 1;
        return a.nama.localeCompare(b.nama);
    });

    let html = '';
    let noUrut = 1;

    if (namaSiswaArr.length === 0) {
        html += '<tr><td colspan="7" style="padding:20px; color:#e67e22; font-weight:bold;">Belum ada siswa dari kelas ' + selKelas + ' yang mengumpulkan ujian ' + selPaket + '.</td></tr>';
    }

    listSiswaTerurut.forEach(function(item) {
        let nama = item.nama;
        let keyNama = item.keyNama;
        let d = item.data;
        let perluPeriksa = item.perluPeriksa;

        let dDateObj = d.waktuKumpul ? new Date(d.waktuKumpul) : null;
        let dDate = (dDateObj && !isNaN(dDateObj.getTime()))
            ? (dDateObj.getHours().toString().padStart(2, '0') + ':' + dDateObj.getMinutes().toString().padStart(2, '0') + ' - ' + dDateObj.getDate().toString().padStart(2, '0') + '/' + (dDateObj.getMonth() + 1).toString().padStart(2, '0'))
            : (d.waktu || 'Input Manual');
        if (d.waktuKumpul === "Remedial Tuntas") dDate = "Remedial";

        let badgePelanggaran = d.pelanggaran >= 5 ? '<span style="background:#c0392b; color:white; padding:3px 8px; border-radius:12px; font-size:10px; font-weight:bold;">KICKED (' + d.pelanggaran + 'x)</span>' : (d.pelanggaran > 0 ? '<span style="background:#f39c12; color:white; padding:3px 8px; border-radius:12px; font-size:10px; font-weight:bold;">' + d.pelanggaran + 'x</span>' : '<span style="color:#27ae60; font-weight:bold;">Aman</span>');

        let btnKoreksi = perluPeriksa
            ? '<button style="background:#8e44ad; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;" data-k="' + selKelas.replace(/"/g, '&quot;') + '" data-p="' + selPaket.replace(/"/g, '&quot;') + '" data-n="' + keyNama.replace(/"/g, '&quot;') + '" onclick="window.bukaKoreksiUjian(this)">✏️ Periksa / Koreksi</button>'
            : '<button style="background:#27ae60; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;" data-k="' + selKelas.replace(/"/g, '&quot;') + '" data-p="' + selPaket.replace(/"/g, '&quot;') + '" data-n="' + keyNama.replace(/"/g, '&quot;') + '" onclick="window.bukaKoreksiUjian(this)">✅ Lihat Detail</button>';

        let safeKlsJS = selKelas.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safePaketJS = selPaket.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeNamaJS = keyNama.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        
        let btnHapus = '<button style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold; margin-left:5px;" onclick="window.hapusNilaiSiswaTunggal(\'' + safeKlsJS + '\', \'' + safePaketJS + '\', \'' + safeNamaJS + '\')" title="Hapus Riwayat Ujian Siswa Ini">✕</button>';

        html += '<tr style="border-bottom:1px solid #eee;">' +
            '<td style="color:#7f8c8d; font-weight:bold;">' + (noUrut++) + '</td>' +
            '<td style="text-align:left; font-weight:bold; color:#2c3e50;">' + nama + '</td>' +
            '<td style="font-size:11px; color:#7f8c8d; font-weight:bold;">' + dDate + '</td>' +
            '<td style="display:none;"></td>' +
            '<td>' + badgePelanggaran + '</td>' +
            '<td style="font-size:18px; font-weight:900; color:#16a085;">' + (d.nilaiAkhir !== undefined ? Number(d.nilaiAkhir).toFixed(1) : '-') + '</td>' +
            '<td>' + btnKoreksi + btnHapus + '</td>' +
        '</tr>';
    });

    let siswaBelumUjian = semuaSiswaKelas.filter(function(n) {
        if (typeof window.ambilDataSiswaDiObjekRekap === "function") {
            return !window.ambilDataSiswaDiObjekRekap(dataSiswa, n);
        }
        return !namaSiswaArr.includes(n);
    }).sort();

    if (siswaBelumUjian.length > 0) {
        html += '<tr><td colspan="7" style="background:#f4f6f6; padding:8px; font-size:11px; font-weight:bold; color:#7f8c8d; text-transform:uppercase; letter-spacing:1px; border-top:2px dashed #cbd5e1; border-bottom:2px dashed #cbd5e1;">Belum Ujian / Input Manual (' + siswaBelumUjian.length + ' Siswa)</td></tr>';

        siswaBelumUjian.forEach(function(namaBelum) {
            let safeNama = namaBelum.replace(/'/g, "\\'");
            let safeKelas = selKelas.replace(/'/g, "\\'");
            let safePaket = selPaket.replace(/'/g, "\\'");
            let idInput = 'input-manual-' + namaBelum.replace(/[^a-zA-Z0-9]/g, '');

            html += '<tr style="border-bottom:1px solid #eee; background:#fdfdfd;">' +
                '<td style="color:#7f8c8d; font-weight:bold;">' + (noUrut++) + '</td>' +
                '<td style="text-align:left; font-weight:bold; color:#7f8c8d;">' + namaBelum + ' <span style="font-size:10px; color:#e74c3c; font-style:italic;">(Belum Ujian)</span></td>' +
                '<td style="font-weight:bold; color:#bdc3c7;">-</td>' +
                '<td style="display:none;"></td>' +
                '<td style="font-weight:bold; color:#bdc3c7;">-</td>' +
                '<td>' +
                    '<input type="number" id="' + idInput + '" min="0" max="100" class="input-box" placeholder="Skor" style="width:70px; margin:0; padding:6px; text-align:center; font-weight:bold; color:#2980b9; border:2px solid #3498db;" onchange="window.simpanNilaiManual(\'' + safeKelas + '\', \'' + safePaket + '\', \'' + safeNama + '\', this.value, \'' + idInput + '\')">' +
                '</td>' +
                '<td>' +
                    '<button style="background:#8e44ad; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold; display:flex; align-items:center; gap:5px; margin:0 auto; box-shadow:0 2px 4px rgba(0,0,0,0.15);" onclick="window.triggerUploadLJK(\'' + safeKelas + '\', \'' + safePaket + '\', \'' + safeNama + '\')">📷 Kamera / Upload</button>' +
                '</td>' +
            '</tr>';
        });
    }

    tbody.innerHTML = html;
};

// MESIN SINKRONISASI JAWABAN SISWA KE URUTAN ASLI BANK UJIAN
window.normalisasiTeksSoalSinkron = function(teks) {
    return String(teks || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
};

window.sinkronkanDetailSiswaKeBankUjian = function(detailSiswa, bankSoal) {
    let arrDetail = Array.isArray(detailSiswa) ? detailSiswa : Object.values(detailSiswa || {});
    if (!Array.isArray(bankSoal) || bankSoal.length === 0) return arrDetail;
    if (arrDetail.length === 0) return [];

    let terpakai = new Array(arrDetail.length).fill(false);
    let hasilSinkron = new Array(bankSoal.length).fill(null);

    bankSoal.forEach(function(qBank, bIdx) {
        let targetQ = window.normalisasiTeksSoalSinkron(qBank.question || qBank.soal);
        if (!targetQ) return;

        if (arrDetail[bIdx] && !terpakai[bIdx] && window.normalisasiTeksSoalSinkron(arrDetail[bIdx].soal) === targetQ) {
            hasilSinkron[bIdx] = arrDetail[bIdx];
            terpakai[bIdx] = true;
            return;
        }
        for (let i = 0; i < arrDetail.length; i++) {
            if (!terpakai[i] && arrDetail[i] && window.normalisasiTeksSoalSinkron(arrDetail[i].soal) === targetQ) {
                hasilSinkron[bIdx] = arrDetail[i];
                terpakai[i] = true;
                break;
            }
        }
    });

    bankSoal.forEach(function(qBank, bIdx) {
        if (hasilSinkron[bIdx]) return;
        let targetNomor = bIdx + 1;
        for (let i = 0; i < arrDetail.length; i++) {
            if (!terpakai[i] && arrDetail[i] && Number(arrDetail[i].nomor) === targetNomor) {
                hasilSinkron[bIdx] = arrDetail[i];
                terpakai[i] = true;
                break;
            }
        }
    });

    bankSoal.forEach(function(qBank, bIdx) {
        if (hasilSinkron[bIdx]) return;
        let tipeBank = String(qBank.type || qBank.tipe || 'PG').toUpperCase();
        for (let i = 0; i < arrDetail.length; i++) {
            if (!terpakai[i] && arrDetail[i]) {
                let tipeDet = String(arrDetail[i].tipe || arrDetail[i].type || 'PG').toUpperCase();
                if (tipeDet === tipeBank) {
                    hasilSinkron[bIdx] = arrDetail[i];
                    terpakai[i] = true;
                    break;
                }
            }
        }
    });

    return hasilSinkron;
};

window.bukaModalSpreadsheetNilai = function() {
    let selKelas = document.getElementById('filter-rekap-kelas');
    if (!selKelas || !selKelas.value) return alert("Pilih kelas terlebih dahulu di Rekap Nilai!");
    window.bukaModal('modal-spreadsheet-nilai');

    let kls = selKelas.value;
    let rekapKls = (typeof window.ambilObjekRekapKelas === "function") ? window.ambilObjekRekapKelas(kls) : (window.adminRekapNilaiData[kls] || {});
    let selSpr = document.getElementById('filter-spreadsheet-paket');
    let daftarKeyPaket = Object.keys(rekapKls).sort();

    let htmlPkt = '';
    daftarKeyPaket.forEach(function(p) {
        let sampel = Object.values(rekapKls[p] || {})[0];
        let labelPkt = (sampel && sampel.paketAsli) ? sampel.paketAsli : p;
        htmlPkt += '<option value="' + p.replace(/"/g, '&quot;') + '">📝 ' + labelPkt + '</option>';
    });
    if (daftarKeyPaket.length > 1) {
        htmlPkt += '<option value="SEMUA_GABUNGAN">📚 Tampilkan Semua Paket Ujian (Per Bagian)</option>';
    }
    selSpr.innerHTML = htmlPkt || '<option value="">Belum Ada Paket Ujian</option>';

    let pktRekap = document.getElementById('filter-rekap-paket').value;
    if (pktRekap && rekapKls[pktRekap]) {
        selSpr.value = pktRekap;
    } else if (daftarKeyPaket.length > 0) {
        selSpr.value = daftarKeyPaket[0];
    }

    window.renderTabelSpreadsheet();
};

window.bangunBlokTabelSatuPaketSpreadsheet = function(kls, pktKey, paketObj, tampilkanJudulPaket) {
    let daftarSiswa = [];
    Object.keys(paketObj || {}).forEach(function(namaKey) {
        let d = paketObj[namaKey];
        if (!d) return;
        let copyD = Object.assign({}, d);
        copyD._namaSiswa = d.namaAsli || namaKey;
        copyD._namaPaket = d.paketAsli || pktKey;
        daftarSiswa.push(copyD);
    });

    daftarSiswa.sort(function(a, b) { return a._namaSiswa.localeCompare(b._namaSiswa); });
    if (daftarSiswa.length === 0) return { headHtml: '', bodyHtml: '' };

    let namaPaketAsli = daftarSiswa[0]._namaPaket || pktKey;
    let safePkt = (typeof window.sanitasiKeyRekapFirebase === "function") ? window.sanitasiKeyRekapFirebase(namaPaketAsli) : namaPaketAsli;
    let bankPaket = (window.adminBankUjianData && (window.adminBankUjianData[namaPaketAsli] || window.adminBankUjianData[pktKey] || window.adminBankUjianData[safePkt])) || null;
    let bankSoal = (bankPaket && Array.isArray(bankPaket.soal) && bankPaket.soal.length > 0) ? bankPaket.soal : [];

    if (bankSoal.length === 0) {
        let refDetail = [];
        daftarSiswa.forEach(function(r) {
            let arrD = r.detail || r.rincian || [];
            if (arrD.length > refDetail.length) refDetail = arrD;
        });
        bankSoal = refDetail.slice().sort(function(a, b) { return (Number(a.nomor) || 0) - (Number(b.nomor) || 0); }).map(function(x) {
            return {
                question: x.soal || '',
                type: x.tipe || x.type || 'PG',
                correct: x.kunci || []
            };
        });
    }

    let pgIndices = [];
    let isIndices = [];
    let kunciPG = [];
    let kunciIS = [];

    bankSoal.forEach(function(q, idx) {
        let t = String(q.type || q.tipe || 'PG').toUpperCase();
        let isPG = (t === 'PG' || t === 'MC' || t === 'PGK');
        let rawKunci = q.correct || q.kunci || [];
        if (!Array.isArray(rawKunci)) rawKunci = [rawKunci];
        let teksKunci = rawKunci.filter(Boolean).join(', ') || '-';

        if (isPG) {
            pgIndices.push(idx);
            kunciPG.push(teksKunci.toLowerCase());
        } else {
            isIndices.push(idx);
            kunciIS.push(teksKunci);
        }
    });

    let pgCount = pgIndices.length;
    let isCount = isIndices.length;
    let maxSoal = pgCount + isCount;
    let totalKolom = 3 + maxSoal;

    let barisHeaderAtas =
        '<tr>' +
            '<th rowspan="2" style="background:#2c3e50; color:white; padding:8px 12px; position:sticky; left:0; z-index:4;">No</th>' +
            '<th rowspan="2" style="background:#2c3e50; color:white; padding:8px 12px; position:sticky; left:40px; z-index:4; min-width:180px;">Nama Siswa</th>' +
            (pgCount > 0 ? '<th colspan="' + pgCount + '" style="background:#34495e; color:white; padding:4px;">Pilihan Ganda (Urutan Bank Soal)</th>' : '') +
            (isCount > 0 ? '<th colspan="' + isCount + '" style="background:#8e44ad; color:white; padding:4px;">Isian / Essay</th>' : '') +
            '<th rowspan="2" style="background:#2c3e50; color:white; padding:8px 12px;">Nilai Akhir</th>' +
        '</tr><tr>';

    for (let i = 1; i <= pgCount; i++) {
        barisHeaderAtas += '<th style="background:#bdc3c7; color:#2c3e50; min-width:28px; font-size:11px;">' + i + '</th>';
    }
    for (let i = 1; i <= isCount; i++) {
        barisHeaderAtas += '<th style="background:#d2b4de; color:#4a235a; min-width:55px; font-size:11px;">' + i + '</th>';
    }
    barisHeaderAtas += '</tr>';

    let htmlBarisKunci =
        '<tr style="background:#fef9e7; border-bottom:2px solid #f39c12;">' +
            '<td style="background:#fef9e7; color:#d35400; font-weight:900; position:sticky; left:0; z-index:4; border-right:1px solid #f9e79f;">🔑</td>' +
            '<td style="background:#fef9e7; color:#d35400; font-weight:900; text-align:left; position:sticky; left:40px; z-index:4; border-right:2px solid #f39c12;">KUNCI JAWABAN</td>';

    kunciPG.forEach(function(k) {
        htmlBarisKunci += '<td style="background:#fef9e7; color:#d35400; font-weight:900; font-size:12px;">' + k + '</td>';
    });
    kunciIS.forEach(function(k) {
        let shortK = k.length > 14 ? (k.substring(0, 14) + '...') : k;
        let safeTitle = k.replace(/"/g, '&quot;');
        htmlBarisKunci += '<td style="background:#fef5e7; color:#b9770e; font-weight:800; font-size:11px; white-space:nowrap;" title="Kunci: ' + safeTitle + '">' + shortK + '</td>';
    });
    htmlBarisKunci += '<td style="background:#fef9e7; color:#d35400; font-weight:900; font-size:13px;">100</td></tr>';

    let bodyHtml = '';
    if (tampilkanJudulPaket) {
        bodyHtml += '<tr><td colspan="' + totalKolom + '" style="background:#0b3954; color:#f1c40f; font-weight:900; font-size:14px; padding:10px 14px; text-align:left;">🎯 PAKET UJIAN: ' + namaPaketAsli + ' (' + daftarSiswa.length + ' Siswa)</td></tr>';
        bodyHtml += barisHeaderAtas + htmlBarisKunci;
    }

    let siswaTersinkron = daftarSiswa.map(function(s) {
        let rawDetail = s.detail || s.rincian || [];
        return {
            siswa: s,
            detailUrut: window.sinkronkanDetailSiswaKeBankUjian(rawDetail, bankSoal)
        };
    });

    siswaTersinkron.forEach(function(entry, idx) {
        let s = entry.siswa;
        let d = entry.detailUrut;
        let n = parseFloat(s.nilaiAkhir);

        bodyHtml += '<tr>' +
            '<td style="font-weight:bold; color:#7f8c8d; position:sticky; left:0; background:white; z-index:2; border-right:1px solid #cbd5e1;">' + (idx + 1) + '</td>' +
            '<td style="font-weight:bold; color:#1e293b; text-align:left; position:sticky; left:40px; background:white; z-index:2; border-right:2px solid #cbd5e1;">' + s._namaSiswa + '</td>';

        pgIndices.forEach(function(origIdx) {
            let item = d[origIdx];
            let ansStr = "-";
            if (item) {
                let rawJwb = item.jawabanSiswa !== undefined ? item.jawabanSiswa : (item.jawabSiswa !== undefined ? item.jawabSiswa : item.answer);
                if (Array.isArray(rawJwb)) rawJwb = rawJwb.join(',');
                let numAns = parseInt(rawJwb, 10);
                if (!isNaN(numAns) && String(rawJwb).trim() === String(numAns)) {
                    ansStr = String.fromCharCode(65 + numAns).toLowerCase();
                } else if (rawJwb) {
                    ansStr = String(rawJwb).toLowerCase();
                }
            }
            bodyHtml += '<td style="font-size:12px; color:#334155; font-weight:bold;">' + ansStr + '</td>';
        });

        isIndices.forEach(function(origIdx) {
            let item = d[origIdx];
            let fullAns = item ? String(item.jawabanSiswa || item.jawabSiswa || item.answer || "-") : "-";
            let ansStr = fullAns.length > 12 ? (fullAns.substring(0, 12) + '...') : fullAns;
            let safeTitle = fullAns.replace(/"/g, '&quot;');
            bodyHtml += '<td style="font-size:12px; color:#4a235a; white-space:nowrap;" title="' + safeTitle + '">' + ansStr + '</td>';
        });

        bodyHtml += '<td style="font-weight:900; font-size:14px; color:' + ((!isNaN(n) && n >= 70) ? '#27ae60' : '#c0392b') + ';">' + (!isNaN(n) ? n.toFixed(0) : '-') + '</td></tr>';
    });

    bodyHtml += '<tr><td colspan="' + totalKolom + '" style="height:24px; background:#f4f6f8; border:none;"></td></tr>';
    bodyHtml += '<tr><td colspan="' + totalKolom + '" style="background:#e8f8f5; color:#16a085; font-weight:bold; font-size:14px; padding:10px;">📊 Analisis Jawaban Siswa — ' + namaPaketAsli + ' (Benar = 1, Salah = 0)</td></tr>';
    bodyHtml += barisHeaderAtas + htmlBarisKunci;

    let urutanIndeksGabungan = pgIndices.concat(isIndices);
    siswaTersinkron.forEach(function(entry, idx) {
        let s = entry.siswa;
        let d = entry.detailUrut;
        let n = parseFloat(s.nilaiAkhir);

        bodyHtml += '<tr>' +
            '<td style="font-weight:bold; color:#7f8c8d; position:sticky; left:0; background:white; z-index:2; border-right:1px solid #cbd5e1;">' + (idx + 1) + '</td>' +
            '<td style="font-weight:bold; color:#1e293b; text-align:left; position:sticky; left:40px; background:white; z-index:2; border-right:2px solid #cbd5e1;">' + s._namaSiswa + '</td>';

        urutanIndeksGabungan.forEach(function(origIdx) {
            let item = d[origIdx];
            let isBenar = 0;
            let bg = '#f8d7da', col = '#721c24';

            if (item) {
                let pDidapat = item.poinDidapat !== undefined ? item.poinDidapat : (item.poin || 0);
                if (item.isCorrect || item.benar || Number(pDidapat) > 0 || item.status === "Benar" || item.status === "Benar Sempurna") {
                    isBenar = 1;
                    bg = '#d4edda'; col = '#155724';
                }
            }
            bodyHtml += '<td style="background:' + bg + '; color:' + col + '; font-weight:bold; font-size:13px;">' + isBenar + '</td>';
        });

        bodyHtml += '<td style="font-weight:900; font-size:14px;">' + (!isNaN(n) ? n.toFixed(0) : '-') + '</td></tr>';
    });

    return {
        headHtml: tampilkanJudulPaket ? '' : (barisHeaderAtas + htmlBarisKunci),
        bodyHtml: bodyHtml
    };
};

window.renderTabelSpreadsheet = function() {
    let selKelas = document.getElementById('filter-rekap-kelas');
    let selSpr = document.getElementById('filter-spreadsheet-paket');
    let thead = document.getElementById('head-spreadsheet-nilai');
    let tbody = document.getElementById('body-spreadsheet-nilai');

    if (!selKelas || !selSpr || !thead || !tbody) return;

    let kls = selKelas.value;
    let pkt = selSpr.value;
    let rekapKls = (typeof window.ambilObjekRekapKelas === "function") ? window.ambilObjekRekapKelas(kls) : (window.adminRekapNilaiData[kls] || {});
    let semuaKeyPaket = Object.keys(rekapKls).sort();

    if (semuaKeyPaket.length === 0) {
        thead.innerHTML = '';
        tbody.innerHTML = '<tr><td style="padding:20px; color:#e67e22; font-weight:bold;">Tidak ada data ujian untuk ditampilkan.</td></tr>';
        return;
    }

    if (!pkt || pkt === "SEMUA_GABUNGAN") {
        thead.innerHTML = '';
        let gabunganBody = '';
        semuaKeyPaket.forEach(function(namaPkt, idx) {
            let paketObj = rekapKls[namaPkt] || {};
            let blok = window.bangunBlokTabelSatuPaketSpreadsheet(kls, namaPkt, paketObj, true);
            if (blok.bodyHtml) {
                if (idx > 0) {
                    gabunganBody += '<tr><td colspan="30" style="height:40px; background:#e2e8f0; border:none;"></td></tr>';
                }
                gabunganBody += blok.bodyHtml;
            }
        });
        tbody.innerHTML = gabunganBody || '<tr><td style="padding:20px; color:#e67e22; font-weight:bold;">Tidak ada data ujian untuk ditampilkan.</td></tr>';
    } else {
        let paketObj = (typeof window.ambilObjekRekapPaket === "function") ? window.ambilObjekRekapPaket(kls, pkt) : (rekapKls[pkt] || {});
        let blok = window.bangunBlokTabelSatuPaketSpreadsheet(kls, pkt, paketObj, false);
        thead.innerHTML = blok.headHtml;
        tbody.innerHTML = blok.bodyHtml || '<tr><td style="padding:20px; color:#e67e22; font-weight:bold;">Tidak ada data ujian untuk ditampilkan.</td></tr>';
    }
};

window.exportCSVSpreadsheet = function() {
    let kls = document.getElementById('filter-rekap-kelas').value;
    let pkt = document.getElementById('filter-spreadsheet-paket').value;
    let table = document.getElementById('tabel-spreadsheet-excel');
    if (!table || !kls) return;

    let csv = [];
    let rows = table.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll('td, th');
        for (let j = 0; j < cols.length; j++) {
            let data = cols[j].innerText.replace(/"/g, '""');
            row.push('"' + data + '"');
        }
        csv.push(row.join(','));
    }

    let csvString = csv.join('\n');
    let blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = 'Spreadsheet_Nilai_' + kls + (pkt ? '_' + pkt : '_Semua') + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.clearDataSpreadsheet = function() {
    let kls = document.getElementById('filter-rekap-kelas').value;
    let pkt = document.getElementById('filter-spreadsheet-paket').value;
    if (!kls) return;

    let isSemua = (!pkt || pkt === "SEMUA_GABUNGAN");
    let safeKls = (typeof window.sanitasiKeyRekapFirebase === "function") ? window.sanitasiKeyRekapFirebase(kls) : kls;
    let safePkt = (!isSemua && typeof window.sanitasiKeyRekapFirebase === "function") ? window.sanitasiKeyRekapFirebase(pkt) : pkt;

    let msg = !isSemua ? 'Hapus SELURUH history nilai untuk ujian "' + pkt + '" di kelas ' + kls + '?' : 'PERINGATAN! Hapus TOTAL semua history nilai untuk kelas ' + kls + '?';
    if (confirm(msg)) {
        if (!isSemua) {
            if (window.adminRekapNilaiData && window.adminRekapNilaiData[kls]) {
                delete window.adminRekapNilaiData[kls][pkt];
                delete window.adminRekapNilaiData[kls][safePkt];
            }
            if (window.adminRekapNilaiData && window.adminRekapNilaiData[safeKls]) {
                delete window.adminRekapNilaiData[safeKls][pkt];
                delete window.adminRekapNilaiData[safeKls][safePkt];
            }
        } else {
            if (window.adminRekapNilaiData) {
                delete window.adminRekapNilaiData[kls];
                delete window.adminRekapNilaiData[safeKls];
            }
        }
        if (typeof window.simpanRekapNilaiPenuhKeDB === 'function') window.simpanRekapNilaiPenuhKeDB();
        window.bukaModalSpreadsheetNilai();
        window.renderRekapNilai();
        if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
    }
};

window.exportExcelRekapNilai = function() {
    let selKelas = document.getElementById('filter-rekap-kelas').value;
    let selPaket = document.getElementById('filter-rekap-paket').value;

    if (!selKelas || !selPaket) return alert("Pilih Kelas dan Spesifik 1 Paket Ujian terlebih dahulu untuk mengekspor Analisis 0-1!");

    let rekapPaket = (typeof window.ambilObjekRekapPaket === "function")
        ? window.ambilObjekRekapPaket(selKelas, selPaket)
        : (window.adminRekapNilaiData[selKelas] ? window.adminRekapNilaiData[selKelas][selPaket] : {});
    let siswaArr = Object.keys(rekapPaket || {}).map(function(k) {
        let item = Object.assign({}, rekapPaket[k]);
        if (!item.namaAsli) item.namaAsli = k;
        return item;
    });

    if (siswaArr.length === 0) return alert("Tidak ada data nilai untuk diekspor!");

    let namaPaketAsli = (siswaArr[0] && siswaArr[0].paketAsli) ? siswaArr[0].paketAsli : selPaket;
    let bankPaket = (window.adminBankUjianData && (window.adminBankUjianData[selPaket] || window.adminBankUjianData[namaPaketAsli])) || {};
    let bankSoal = Array.isArray(bankPaket.soal) ? bankPaket.soal : [];
    if (bankSoal.length === 0 && siswaArr.length > 0) {
        let refD = siswaArr[0].detail || siswaArr[0].rincian || [];
        bankSoal = refD.slice().sort(function(a, b) { return (Number(a.nomor) || 0) - (Number(b.nomor) || 0); }).map(function(x) {
            return { question: x.soal || '', type: x.tipe || x.type || 'PG', correct: x.kunci || [] };
        });
    }

    let pgIndices = [], isIndices = [], kunciPG = [], kunciIS = [];
    bankSoal.forEach(function(q, idx) {
        let t = (q.type || q.tipe || 'PG').toUpperCase();
        let isPG = (t === 'PG' || t === 'PGK' || t === 'MC');
        let rawK = q.correct || q.kunci || [];
        if (!Array.isArray(rawK)) rawK = [rawK];
        let teksK = rawK.filter(Boolean).join(', ') || '-';
        if (isPG) { pgIndices.push(idx); kunciPG.push(teksK.toLowerCase()); }
        else { isIndices.push(idx); kunciIS.push(teksK); }
    });

    let pgCount = pgIndices.length;
    let isCount = isIndices.length;
    let totalSoal = pgCount + isCount;
    let colspanJawaban = Math.max(1, totalSoal);
    let topColspan = 2 + colspanJawaban + 1;
    let urutanIndeksGabungan = pgIndices.concat(isIndices);

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
    html += '<head><meta charset="utf-8"><style>' +
        'table { border-collapse: collapse; font-family: Calibri, sans-serif; font-size: 12px; }' +
        'th, td { border: 1px solid #000000; padding: 6px; text-align: center; vertical-align: middle; }' +
        '.text-left { text-align: left; }' +
        '.bg-header { background-color: #f2f2f2; font-weight: bold; text-align: center; }' +
        '.bg-title { font-size: 16px; font-weight: bold; border: none; text-align: center; }' +
        '.no-border { border: none; }' +
    '</style></head><body>';

    html += '<table>';
    html += '<tr><td colspan="' + topColspan + '" class="bg-title">Rekapitulasi Ujian Siswa</td></tr>';
    html += '<tr><td colspan="' + topColspan + '" class="no-border"></td></tr>';
    html += '<tr><td colspan="2" class="text-left bg-header">Kelas: ' + selKelas + '</td><td colspan="' + colspanJawaban + '" class="bg-header">Ujian: ' + namaPaketAsli + '</td><td class="bg-header">Total: ' + totalSoal + ' Soal</td></tr>';
    html += '<tr><td colspan="' + topColspan + '" class="no-border"></td></tr>';

    html += '<tr><td rowspan="2" class="bg-header" style="width:40px;">No</td><td rowspan="2" class="bg-header text-left" style="width:200px;">Nama Siswa</td>';
    if (pgCount > 0) html += '<td colspan="' + pgCount + '" class="bg-header">Pilihan Ganda / PGK</td>';
    if (isCount > 0) html += '<td colspan="' + isCount + '" class="bg-header">Isian / Essay</td>';
    html += '<td rowspan="2" class="bg-header" style="width:80px;">Nilai Akhir</td></tr><tr>';

    for (let i = 1; i <= pgCount; i++) html += '<td class="bg-header">' + i + '</td>';
    for (let i = 1; i <= isCount; i++) html += '<td class="bg-header">' + i + '</td>';
    html += '</tr>';

    html += '<tr><td class="bg-header">🔑</td><td class="bg-header text-left">KUNCI JAWABAN</td>';
    kunciPG.forEach(function(k) { html += '<td class="bg-header" style="color:#d35400;">' + k + '</td>'; });
    kunciIS.forEach(function(k) { html += '<td class="bg-header" style="color:#d35400;">' + k + '</td>'; });
    html += '<td class="bg-header">100</td></tr>';

    siswaArr.sort(function(a, b) { return String(a.namaAsli || '').localeCompare(String(b.namaAsli || '')); });
    let siswaTersinkron = siswaArr.map(function(s) {
        return {
            siswa: s,
            detailUrut: window.sinkronkanDetailSiswaKeBankUjian(s.detail || s.rincian || [], bankSoal)
        };
    });

    siswaTersinkron.forEach(function(entry, idx) {
        let s = entry.siswa;
        let d = entry.detailUrut;
        let n = parseFloat(s.nilaiAkhir);
        html += '<tr><td>' + (idx + 1) + '</td><td class="text-left">' + s.namaAsli + '</td>';
        urutanIndeksGabungan.forEach(function(origIdx) {
            let itemJwb = d[origIdx];
            let ansStr = itemJwb ? (itemJwb.jawabSiswa !== undefined ? itemJwb.jawabSiswa : (itemJwb.jawabanSiswa || '-')) : '-';
            if (Array.isArray(ansStr)) ansStr = ansStr.join(',');
            html += '<td>' + String(ansStr).toLowerCase() + '</td>';
        });
        html += '<td style="font-weight:bold;">' + (!isNaN(n) ? n.toFixed(1) : '-') + '</td></tr>';
    });
    html += '</table><br><br>';

    html += '<table>';
    html += '<tr><td colspan="' + topColspan + '" class="no-border" style="font-size:14px; font-weight:bold; text-align:center;">Analisis Jawaban Siswa (Skala 0 - 1)</td></tr>';
    html += '<tr><td rowspan="2" class="bg-header" style="width:40px;">No</td><td rowspan="2" class="bg-header text-left" style="width:200px;">Nama Siswa</td>';
    if (pgCount > 0) html += '<td colspan="' + pgCount + '" class="bg-header">Pilihan Ganda / PGK</td>';
    if (isCount > 0) html += '<td colspan="' + isCount + '" class="bg-header">Isian / Essay</td>';
    html += '<td rowspan="2" class="bg-header" style="width:80px;">Nilai Akhir</td></tr><tr>';

    for (let i = 1; i <= pgCount; i++) html += '<td class="bg-header">' + i + '</td>';
    for (let i = 1; i <= isCount; i++) html += '<td class="bg-header">' + i + '</td>';
    html += '</tr>';

    siswaTersinkron.forEach(function(entry, idx) {
        let s = entry.siswa;
        let d = entry.detailUrut;
        let n = parseFloat(s.nilaiAkhir);
        html += '<tr><td>' + (idx + 1) + '</td><td class="text-left">' + s.namaAsli + '</td>';
        urutanIndeksGabungan.forEach(function(origIdx) {
            let item = d[origIdx];
            let isBenar = 0;
            if (item) {
                let pDidapat = item.poinDidapat !== undefined ? item.poinDidapat : (item.poin || 0);
                if (item.status === "Benar" || item.status === "Benar Sempurna" || item.isCorrect || Number(pDidapat) > 0) isBenar = 1;
            }
            html += '<td style="font-weight:bold; color:' + (isBenar ? '#155724' : '#721c24') + ';">' + isBenar + '</td>';
        });
        html += '<td style="font-weight:bold;">' + (!isNaN(n) ? n.toFixed(1) : '-') + '</td></tr>';
    });
    html += '</table></body></html>';

    let blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = 'Analisis_01_Ujian_' + selKelas + '_' + namaPaketAsli.replace(/\s+/g, '_') + '.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
window.hapusSemuaNilaiKelasUjian = function() {
    let elKelas = document.getElementById('filter-rekap-kelas');
    let elPaket = document.getElementById('filter-rekap-paket');
    let selKelas = elKelas ? elKelas.value : '';
    let selPaket = elPaket ? elPaket.value : '';

    if (!selKelas || !selPaket) {
        return alert("⚠️ Pilih Kelas dan Nama Ujian terlebih dahulu untuk menghapus datanya!");
    }

    let pesanKonfirmasi = 'PERINGATAN BAHAYA!\n\nYakin ingin MENGHAPUS SEMUA DATA NILAI ujian "' + selPaket + '" untuk seluruh siswa di kelas "' + selKelas + '"?\n\nData yang dihapus akan hilang permanen dan seluruh status siswa akan kembali menjadi "Belum Ujian"!';

    let eksekusiHapusSemua = function() {
        let safeKelas1 = window.sanitasiKeyRekapFirebase(selKelas);
        let safePaket1 = window.sanitasiKeyRekapFirebase(selPaket);
        let safeKelas2 = String(selKelas).trim().replace(/[.#\[\]\/]/g, "_");
        let safePaket2 = String(selPaket).trim().replace(/[.#\[\]\/]/g, "_");

        let kandidatKelas = Array.from(new Set([selKelas, safeKelas1, safeKelas2])).filter(Boolean);
        let kandidatPaket = Array.from(new Set([selPaket, safePaket1, safePaket2])).filter(Boolean);

        // Lacak semua variasi kunci kelas & paket yang cocok di memori lokal
        if (window.adminRekapNilaiData) {
            Object.keys(window.adminRekapNilaiData).forEach(function(kKey) {
                if (kKey.toLowerCase() === selKelas.toLowerCase() || window.sanitasiKeyRekapFirebase(kKey).toLowerCase() === safeKelas1.toLowerCase()) {
                    if (!kandidatKelas.includes(kKey)) kandidatKelas.push(kKey);
                    let objKls = window.adminRekapNilaiData[kKey] || {};
                    Object.keys(objKls).forEach(function(pKey) {
                        let sampel = Object.values(objKls[pKey] || {})[0];
                        let pktAsli = (sampel && sampel.paketAsli) ? String(sampel.paketAsli) : '';
                        if (
                            pKey.toLowerCase() === selPaket.toLowerCase() ||
                            window.sanitasiKeyRekapFirebase(pKey).toLowerCase() === safePaket1.toLowerCase() ||
                            pktAsli.toLowerCase() === selPaket.toLowerCase()
                        ) {
                            if (!kandidatPaket.includes(pKey)) kandidatPaket.push(pKey);
                        }
                    });
                }
            });

            // Hapus dari memori lokal
            kandidatKelas.forEach(function(kKey) {
                if (window.adminRekapNilaiData[kKey]) {
                    kandidatPaket.forEach(function(pKey) {
                        delete window.adminRekapNilaiData[kKey][pKey];
                    });
                }
            });
        }

        // Bersihkan juga riwayat kelas tersebut di Live Monitor agar siswa bisa ujian ulang
        if (window.adminLiveMonitorData) {
            kandidatPaket.forEach(function(pKey) {
                if (window.adminLiveMonitorData[pKey]) {
                    kandidatKelas.forEach(function(kKey) {
                        delete window.adminLiveMonitorData[pKey][kKey];
                    });
                }
            });
        }
        if (typeof window.hapusDataLiveMonitorDiDB === "function") {
            window.hapusDataLiveMonitorDiDB(safePaket1, safeKelas1, null);
        }

        let btn = document.getElementById('btn-hapus-semua-rekap');
        let oldTxt = btn ? btn.innerHTML : '🗑️ Hapus Data Ujian Ini';
        if (btn) {
            btn.innerHTML = "⏳ Menghapus...";
            btn.disabled = true;
        }

        let selesaiHapusUI = function() {
            if (btn) {
                btn.innerHTML = oldTxt;
                btn.disabled = false;
            }
            if (elPaket) elPaket.value = "";
            window.ubahKelasRekapNilai(true);
            if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
            if (typeof window.renderRemedialTabAdmin === "function") window.renderRemedialTabAdmin();
            alert('✅ Seluruh data nilai ujian "' + selPaket + '" di kelas "' + selKelas + '" berhasil dihapus!');
        };

        // Hapus permanen dari Firebase Database melalui REST API
        if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
            let pathsToDelete = [];
            kandidatKelas.forEach(function(kKey) {
                let sK = window.sanitasiKeyRekapFirebase(kKey);
                kandidatPaket.forEach(function(pKey) {
                    let sP = window.sanitasiKeyRekapFirebase(pKey);
                    if (sK && sP) {
                        let p = 'admin_rekap_nilai/' + sK + '/' + sP;
                        if (!pathsToDelete.includes(p)) pathsToDelete.push(p);
                    }
                });
            });
            if (pathsToDelete.length === 0) {
                pathsToDelete.push('admin_rekap_nilai/' + safeKelas1 + '/' + safePaket1);
            }

            let sisa = pathsToDelete.length;
            pathsToDelete.forEach(function(pathItem) {
                window.kirimNilaiUjianAmanKeDB(pathItem, null, function() {
                    sisa--;
                    if (sisa <= 0) selesaiHapusUI();
                }, function() {
                    sisa--;
                    if (sisa <= 0) selesaiHapusUI();
                });
            });
        } else {
            selesaiHapusUI();
        }
    };

    if (typeof window.tampilkanCustomDialog === "function") {
        window.tampilkanCustomDialog("confirm", pesanKonfirmasi, null, function(isYes) {
            if (isYes) eksekusiHapusSemua();
        });
    } else if (confirm(pesanKonfirmasi)) {
        eksekusiHapusSemua();
    }
};

window.hapusNilaiSiswaTunggal = function(kelas, paket, nama) {
    let pesanKonfirmasi = 'PERINGATAN!\n\nYakin ingin MENGHAPUS SELURUH data dan riwayat ujian "' + paket + '" untuk siswa "' + nama + '"?\nData yang dihapus tidak dapat dikembalikan, dan status siswa akan berubah kembali menjadi "Belum Ujian".';

    let eksekusiHapusTunggal = function() {
        let safeKelas = window.sanitasiKeyRekapFirebase(kelas);
        let safePaket = window.sanitasiKeyRekapFirebase(paket);
        let safeNama = window.sanitasiKeyRekapFirebase(nama);
        let safeKelas2 = String(kelas).trim().replace(/[.#\[\]\/]/g, "_");
        let safePaket2 = String(paket).trim().replace(/[.#\[\]\/]/g, "_");
        let safeNama2 = String(nama).trim().replace(/[.#\[\]\/]/g, "_");

        // Hapus dari data memori lokal secara sinkron
        [kelas, safeKelas, safeKelas2].forEach(function(kKey) {
            if (window.adminRekapNilaiData && window.adminRekapNilaiData[kKey]) {
                [paket, safePaket, safePaket2].forEach(function(pKey) {
                    if (window.adminRekapNilaiData[kKey][pKey]) {
                        delete window.adminRekapNilaiData[kKey][pKey][nama];
                        delete window.adminRekapNilaiData[kKey][pKey][safeNama];
                        delete window.adminRekapNilaiData[kKey][pKey][safeNama2];
                    }
                });
            }
        });

        // Reset juga status siswa tersebut di Live Monitor agar bisa masuk ujian lagi
        [paket, safePaket, safePaket2].forEach(function(pKey) {
            if (window.adminLiveMonitorData && window.adminLiveMonitorData[pKey]) {
                [kelas, safeKelas, safeKelas2].forEach(function(kKey) {
                    if (window.adminLiveMonitorData[pKey][kKey]) {
                        delete window.adminLiveMonitorData[pKey][kKey][nama];
                        delete window.adminLiveMonitorData[pKey][kKey][safeNama];
                    }
                });
            }
        });
        if (typeof window.hapusDataLiveMonitorDiDB === "function") {
            window.hapusDataLiveMonitorDiDB(safePaket, safeKelas, safeNama);
        }

        // Hapus permanen dari Firebase Database melalui REST API
        let pathItem = 'admin_rekap_nilai/' + safeKelas + '/' + safePaket + '/' + safeNama;
        if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
            window.kirimNilaiUjianAmanKeDB(pathItem, null, function() {
                window.renderRekapNilai();
                if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
                if (typeof window.renderRemedialTabAdmin === "function") window.renderRemedialTabAdmin();
            });
        } else {
            window.renderRekapNilai();
        }
    };

    if (typeof window.tampilkanCustomDialog === "function") {
        window.tampilkanCustomDialog("confirm", pesanKonfirmasi, null, function(isYes) {
            if (isYes) eksekusiHapusTunggal();
        });
    } else if (confirm(pesanKonfirmasi)) {
        eksekusiHapusTunggal();
    }
};
window.simpanNilaiManual = function(kelas, paket, nama, nilaiRaw, inputId) {
    let nilai = parseFloat(nilaiRaw);
    if (isNaN(nilai) || nilai < 0 || nilai > 100) {
        alert("Masukkan angka yang valid antara 0 - 100.");
        document.getElementById(inputId).value = "";
        return;
    }

    if (!confirm("Simpan nilai akhir " + nilai + " untuk " + nama + "?")) {
        document.getElementById(inputId).value = "";
        return;
    }

    let safeKelas = window.sanitasiKeyRekapFirebase(kelas);
    let safePaket = window.sanitasiKeyRekapFirebase(paket);
    let safeNama = window.sanitasiKeyRekapFirebase(nama);

    let rekapPaket = (typeof window.ambilObjekRekapPaket === "function") ? window.ambilObjekRekapPaket(kelas, paket) : {};
    let sampel = Object.values(rekapPaket || {})[0];
    let paketAsliLabel = (sampel && sampel.paketAsli) ? sampel.paketAsli : paket;

    let payload = {
        namaAsli: nama,
        kelasAsli: kelas,
        paketAsli: paketAsliLabel,
        nilaiAkhir: nilai,
        waktuKumpul: new Date().toISOString(),
        detail: [],
        pelanggaran: 0,
        sudahDikoreksi: true
    };

    let pathDB = 'admin_rekap_nilai/' + safeKelas + '/' + safePaket + '/' + safeNama;

    if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
        window.kirimNilaiUjianAmanKeDB(pathDB, payload, function() {
            if (!window.adminRekapNilaiData[safeKelas]) window.adminRekapNilaiData[safeKelas] = {};
            if (!window.adminRekapNilaiData[safeKelas][safePaket]) window.adminRekapNilaiData[safeKelas][safePaket] = {};
            window.adminRekapNilaiData[safeKelas][safePaket][safeNama] = payload;

            window.renderRekapNilai();
            if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
            if (typeof window.renderRemedialTabAdmin === "function") window.renderRemedialTabAdmin();
        }, function(err) {
            alert("❌ Gagal menyimpan nilai: " + err.message);
        });
    }
};

window.triggerUploadLJK = function(kelas, paket, nama) {
    window.targetUploadLJK = { kelas: kelas, paket: paket, nama: nama };
    let inputLJK = document.getElementById('input-file-ljk');
    if (inputLJK) inputLJK.click();
};

window.prosesUploadLJK = async function(inputElem) {
    let file = inputElem.files[0];
    if (!file) return;

    let t = window.targetUploadLJK;
    inputElem.value = "";

    let toast = document.createElement('div');
    toast.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#e67e22; color:white; padding:12px 25px; border-radius:30px; font-family:'Poppins', sans-serif; font-size:13px; font-weight:bold; box-shadow:0 4px 15px rgba(0,0,0,0.2); z-index:9999999; text-align:center;";
    toast.innerHTML = "⏳ Mengaktifkan AI Scanner...<br><span style='font-size:11px; font-weight:normal;'>Memindai LJK & Tulisan Tangan: " + t.nama + "</span>";
    document.body.appendChild(toast);

    try {
        let safeKelas = window.sanitasiKeyRekapFirebase(t.kelas);
        let safePaket = window.sanitasiKeyRekapFirebase(t.paket);
        let safeNama = window.sanitasiKeyRekapFirebase(t.nama);

        let paketData = (window.adminBankUjianData && (window.adminBankUjianData[t.paket] || window.adminBankUjianData[safePaket])) || null;
        if (!paketData || !paketData.soal) throw new Error("Data bank soal tidak ditemukan untuk paket ini.");

        if (!window.Tesseract) throw new Error("Mesin Tesseract OCR sedang dimuat, tunggu beberapa detik.");

        toast.innerHTML = "🔍 Membaca LJK...<br><span style='font-size:11px; font-weight:normal;'>Mengekstrak teks & pola jawaban...</span>";
        let worker = await Tesseract.createWorker('ind');
        let ocrResult = await worker.recognize(file);
        await worker.terminate();

        let extractedText = ocrResult.data.text;
        let totalNilai = 0;
        let hasilDetail = [];
        let bobot = paketData.bobot || { PG: 0, PGK: 0, IS: 0, Essay: 0 };

        paketData.soal.forEach(function(q, idx) {
            let ansSiswa = "";
            let poin = 0;
            let maxP = bobot[q.type] || 0;
            let status = "Salah";
            let noSoal = idx + 1;

            if (q.type === 'PG') {
                let regexPG = new RegExp(noSoal + "\\s*[\\.\\)]\\s*([A-E])", "i");
                let match = extractedText.match(regexPG);
                ansSiswa = match ? match[1].toUpperCase() : "-";
                if (ansSiswa === (q.correct[0] || '').toUpperCase()) { poin = bobot.PG; status = "Benar"; }
            } else if (q.type === 'PGK') {
                let ansArray = [];
                let correctCount = 0;
                let totalOps = (q.options || []).length;
                (q.options || []).forEach(function(opt, oIdx) {
                    let regexPGK = new RegExp((oIdx + 1) + "\\s+(Benar|Salah|Tepat|Tidak Tepat|Tidak|B|S|T|TT)", "i");
                    let match = extractedText.match(regexPGK);
                    if (match) {
                        let ansWord = match[1].toUpperCase();
                        let isCentangBenar = ansWord === 'BENAR' || ansWord === 'B' || ansWord === 'TEPAT' || ansWord === 'T';
                        if (isCentangBenar) ansArray.push(opt.label);
                    }
                });
                ansSiswa = ansArray;
                if (totalOps > 0 && ansArray.length > 0) {
                    (q.options || []).forEach(function(opt) {
                        let isExpected = (q.correct || []).includes(opt.label);
                        let isAnswered = ansArray.includes(opt.label);
                        if (isExpected === isAnswered) correctCount++;
                    });
                    poin = (bobot.PGK / totalOps) * correctCount;
                    if (correctCount === totalOps) status = "Benar Sempurna";
                    else if (correctCount > 0) status = "Benar Parsial";
                }
            } else if (q.type === 'IS' || q.type === 'Essay') {
                let regexIS = new RegExp(noSoal + "\\s*[\\.\\)]\\s*(.+)", "i");
                let matchIS = extractedText.match(regexIS);
                ansSiswa = matchIS ? matchIS[1].trim() : "-";
                if (q.type === 'IS' && ansSiswa !== "-") {
                    let isBenar = (q.correct || []).some(function(k) { return ansSiswa.toLowerCase().includes(k.toLowerCase().trim()); });
                    if (isBenar) { poin = bobot.IS; status = "Benar"; }
                } else if (q.type === 'Essay') {
                    poin = 0; status = "Menunggu Guru";
                }
            }

            totalNilai += poin;
            hasilDetail.push({
                nomor: noSoal,
                soal: q.question,
                tipe: q.type,
                kunci: q.correct || [],
                jawabSiswa: ansSiswa,
                jawabanSiswa: ansSiswa,
                pembahasan: q.explanation || "Tidak ada pembahasan.",
                poin: poin,
                poinDidapat: poin,
                maxPoin: maxP,
                status: status
            });
        });

        let payload = {
            namaAsli: t.nama,
            kelasAsli: t.kelas,
            paketAsli: t.paket,
            nilaiAkhir: parseFloat(totalNilai.toFixed(2)),
            waktuKumpul: new Date().toISOString(),
            detail: hasilDetail,
            rincian: hasilDetail,
            pelanggaran: 0,
            sudahDikoreksi: false
        };

        let pathDB = 'admin_rekap_nilai/' + safeKelas + '/' + safePaket + '/' + safeNama;
        window.kirimNilaiUjianAmanKeDB(pathDB, payload, function() {
            if (!window.adminRekapNilaiData[safeKelas]) window.adminRekapNilaiData[safeKelas] = {};
            if (!window.adminRekapNilaiData[safeKelas][safePaket]) window.adminRekapNilaiData[safeKelas][safePaket] = {};
            window.adminRekapNilaiData[safeKelas][safePaket][safeNama] = payload;
            window.renderRekapNilai();
            if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
            if (typeof window.renderRemedialTabAdmin === "function") window.renderRemedialTabAdmin();
            toast.style.background = "#27ae60";
            toast.innerHTML = "✅ LJK Berhasil Dipindai!<br><span style='font-size:18px;'>Nilai: " + payload.nilaiAkhir + "</span>";
            setTimeout(function() { toast.remove(); }, 3500);
        }, function(err) {
            throw new Error(err.message);
        });

    } catch (err) {
        console.error(err);
        toast.style.background = "#c0392b";
        toast.innerHTML = "❌ Gagal memindai: " + err.message;
        setTimeout(function() { toast.remove(); }, 4000);
    }
};

// =========================================================================
// 6. KOREKSI ESSAY, TAMPILAN PG/PGK (GAMBAR 2), & DETAIL JAWABAN SISWA
// =========================================================================
window.modeTampilanKoreksiPG = false;

window.bukaKoreksiUjian = function(btnElement) {
    let k = btnElement.getAttribute('data-k');
    let p = btnElement.getAttribute('data-p');
    let n = btnElement.getAttribute('data-n');
    window.tempKoreksiTarget = { kelas: k, paket: p };
    window.modeTampilanKoreksiPG = false;
    window.muatDataKoreksi(n);
};

window.gantiSiswaKoreksi = function() {
    let n = document.getElementById('koreksi-select-siswa').value;
    window.muatDataKoreksi(n);
};

window.centangSemuaKoreksi = function() {
    if (window.modeTampilanKoreksiPG) {
        window.toggleTampilanPGKoreksi(false);
    }
    document.querySelectorAll('#koreksi-grid-container input[type="checkbox"][id^="chk-koreksi-"]').forEach(function(chk) {
        chk.checked = true;
    });
    document.querySelectorAll('#koreksi-grid-container input[type="number"][id^="input-koreksi-"]').forEach(function(inp) {
        inp.value = "1.00";
    });
    window.hitungSkorLiveKoreksi();
};

window.pastikanTombolPGKoreksiAda = function() {
    let btnExisting = document.getElementById('btn-toggle-koreksi-pg');
    if (btnExisting) return btnExisting;

    let btnCentang = document.querySelector('#modal-koreksi-ujian button[onclick*="centangSemuaKoreksi"]');
    if (!btnCentang || !btnCentang.parentElement) return null;

    let barKontrol = btnCentang.parentElement;
    let grupKanan = document.createElement('div');
    grupKanan.style.cssText = 'display:flex; align-items:center; gap:8px; flex-wrap:wrap;';

    let btnPG = document.createElement('button');
    btnPG.type = 'button';
    btnPG.id = 'btn-toggle-koreksi-pg';
    btnPG.className = 'btn-action';
    btnPG.style.cssText = 'background:#2980b9; width:auto; padding:6px 14px; font-size:12px; border-radius:6px; display:flex; align-items:center; gap:6px; color:white; box-shadow:0 2px 5px rgba(41,128,185,0.3); cursor:pointer;';
    btnPG.innerHTML = '📋 PG & PGK';
    btnPG.onclick = function() {
        window.toggleTampilanPGKoreksi();
    };

    barKontrol.insertBefore(grupKanan, btnCentang);
    grupKanan.appendChild(btnPG);
    grupKanan.appendChild(btnCentang);
    return btnPG;
};

window.toggleTampilanPGKoreksi = function(forceModePG) {
    if (typeof forceModePG === "boolean") {
        window.modeTampilanKoreksiPG = forceModePG;
    } else {
        window.modeTampilanKoreksiPG = !window.modeTampilanKoreksiPG;
    }

    let secISEssay = document.getElementById('koreksi-section-is-essay');
    let secPG = document.getElementById('koreksi-section-pg-pgk');
    let btnPG = document.getElementById('btn-toggle-koreksi-pg');
    let jmlPG = btnPG ? (btnPG.getAttribute('data-jml-pg') || '0') : '0';

    if (window.modeTampilanKoreksiPG) {
        if (secISEssay) secISEssay.style.display = 'none';
        if (secPG) secPG.style.display = 'flex';
        if (btnPG) {
            btnPG.style.background = '#0b3954';
            btnPG.style.border = '2px solid #f1c40f';
            btnPG.innerHTML = '✍️ Kembali ke IS & Essay';
        }
    } else {
        if (secISEssay) secISEssay.style.display = 'flex';
        if (secPG) secPG.style.display = 'none';
        if (btnPG) {
            btnPG.style.background = '#2980b9';
            btnPG.style.border = 'none';
            btnPG.innerHTML = '📋 PG & PGK (' + jmlPG + ')';
        }
    }

    let grid = document.getElementById('koreksi-grid-container');
    if (grid && grid.parentElement) {
        grid.parentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.muatDataKoreksi = function(namaSiswa) {
    let t = window.tempKoreksiTarget;
    if (!t || !t.kelas || !t.paket) return;

    let paketMap = window.ambilObjekRekapPaket(t.kelas, t.paket);
    let dataSiswa = paketMap[namaSiswa] || window.ambilDataSiswaDiObjekRekap(paketMap, namaSiswa);
    if (!dataSiswa) return;

    let matchedKey = Object.keys(paketMap).find(function(k) {
        return paketMap[k] === dataSiswa;
    }) || namaSiswa;

    if (!dataSiswa.detail && dataSiswa.rincian) dataSiswa.detail = dataSiswa.rincian;
    if (!Array.isArray(dataSiswa.detail)) dataSiswa.detail = Object.values(dataSiswa.detail || {});

    let labelKelasTampil = dataSiswa.kelasAsli || t.kelas;
    let labelPaketTampil = dataSiswa.paketAsli || t.paket;
    let safePkt = window.sanitasiKeyRekapFirebase(labelPaketTampil);

    let bankData = (window.adminBankUjianData && (window.adminBankUjianData[t.paket] || window.adminBankUjianData[labelPaketTampil] || window.adminBankUjianData[safePkt])) || null;
    let bankSoal = (bankData && Array.isArray(bankData.soal) && bankData.soal.length > 0) ? bankData.soal : [];

    // Sinkronkan & urutkan soal agar 100% SAMA urutannya dengan Bank Soal & menu Nilai Saya (Nomor 1, 2, 3, dst.)
    if (bankSoal.length > 0 && typeof window.sinkronkanDetailSiswaKeBankUjian === "function") {
        let tersinkron = window.sinkronkanDetailSiswaKeBankUjian(dataSiswa.detail, bankSoal);
        let hasilUrut = [];
        tersinkron.forEach(function(item, bIdx) {
            let qBank = bankSoal[bIdx] || {};
            if (item) {
                item.nomor = bIdx + 1;
                if (!item.soal && (qBank.question || qBank.soal)) item.soal = qBank.question || qBank.soal;
                if ((!item.pembahasan || item.pembahasan === "Tidak ada pembahasan.") && qBank.explanation) item.pembahasan = qBank.explanation;
                if ((!item.kunci || item.kunci.length === 0) && (qBank.correct || qBank.kunci)) item.kunci = qBank.correct || qBank.kunci;
                hasilUrut.push(item);
            }
        });
        if (hasilUrut.length > 0) {
            dataSiswa.detail = hasilUrut;
        }
    } else {
        dataSiswa.detail.sort(function(a, b) {
            return (Number(a.nomor) || 0) - (Number(b.nomor) || 0);
        });
    }

    t.nama = matchedKey;
    t.data = dataSiswa;

    let sel = document.getElementById('koreksi-select-siswa');
    let allStudents = Object.keys(paketMap).sort(function(a, b) {
        let namaA = (paketMap[a] && paketMap[a].namaAsli) ? paketMap[a].namaAsli : a;
        let namaB = (paketMap[b] && paketMap[b].namaAsli) ? paketMap[b].namaAsli : b;
        return namaA.localeCompare(namaB);
    });
    let opt = '';
    allStudents.forEach(function(s) {
        let lblSiswa = (paketMap[s] && paketMap[s].namaAsli) ? paketMap[s].namaAsli : s;
        opt += '<option value="' + s.replace(/"/g, '&quot;') + '" ' + (s === matchedKey ? 'selected' : '') + '>' + lblSiswa + '</option>';
    });
    if (sel) sel.innerHTML = opt;

    let badgePelanggaran = dataSiswa.pelanggaran > 0
        ? '<span style="background:#e74c3c; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">⚠️ ' + dataSiswa.pelanggaran + 'x Pelanggaran</span>'
        : '<span style="background:#27ae60; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">✅ Aman</span>';
    let badgeEl = document.getElementById('koreksi-info-badges');
    if (badgeEl) {
        badgeEl.innerHTML = '<span style="background:#2980b9; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">' + labelKelasTampil + '</span> <span style="background:#8e44ad; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">' + labelPaketTampil + '</span> ' + badgePelanggaran;
    }

    let grid = document.getElementById('koreksi-grid-container');
    let bobotIdeal = window.hitungBobotIdealUjian(bankData, dataSiswa.detail);
    let maxPoinPG = bobotIdeal.PG;
    let maxPoinPGK = bobotIdeal.PGK;
    let maxPoinIS = bobotIdeal.IS;
    let maxPoinEssay = bobotIdeal.Essay;

    let grupBelumBenar = [];
    let grupSudahBenar = [];
    let grupPGdanPGK = [];

    dataSiswa.detail.forEach(function(h, idx) {
        if (h.poinDidapat === undefined && h.poin !== undefined) h.poinDidapat = h.poin;
        if (h.jawabSiswa === undefined && h.jawabanSiswa !== undefined) h.jawabSiswa = h.jawabanSiswa;
        let tipeNorm = String(h.tipe || h.type || 'PG').trim();
        let tipeUpper = tipeNorm.toUpperCase();
        let isEssay = (tipeUpper === 'ESSAY' || tipeUpper === 'ESAI' || tipeUpper === 'URAIAN');
        let isIS = (tipeUpper === 'IS' || tipeUpper === 'ISIAN' || tipeUpper === 'SHORT_ANSWER');
        let nomorUrut = h.nomor || (idx + 1);

        if (isIS || isEssay) {
            let defaultMaxP = isEssay ? maxPoinEssay : maxPoinIS;
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : defaultMaxP;
            h.maxPoin = maxP;
            let fraksiSkor = maxP > 0 ? ((Number(h.poinDidapat) || 0) / maxP) : 0;
            if (fraksiSkor > 1) fraksiSkor = 1;
            if (fraksiSkor < 0) fraksiSkor = 0;

            let sudahBenar = isEssay ? (fraksiSkor >= 1 && h.status !== 'Menunggu Guru') : ((Number(h.poinDidapat) || 0) > 0);

            let uiKoreksiGuru = '';
            if (isEssay) {
                uiKoreksiGuru = '<div style="flex:1; min-width:220px; background:#fdf2e9; border:1px solid #edbb99; border-radius:6px; padding:10px; display:flex; justify-content:space-between; align-items:center;">' +
                    '<div><div style="font-size:10px; font-weight:bold; color:#d35400; margin-bottom:3px; text-transform:uppercase;">Koreksi Essay</div><div style="font-size:11px; color:#ba4a00;">Input fraksi (0.0 - 1.0)</div></div>' +
                    '<input type="number" id="input-koreksi-' + idx + '" step="0.1" min="0" max="1" value="' + fraksiSkor.toFixed(2) + '" style="width:60px; padding:5px; text-align:center; font-weight:bold; border:2px solid #d35400; border-radius:4px; color:#d35400; background:white; font-size:14px;" oninput="window.hitungSkorLiveKoreksi()">' +
                '</div>';
            } else {
                let isChecked = ((Number(h.poinDidapat) || 0) > 0) ? 'checked' : '';
                uiKoreksiGuru = '<div style="flex:1; min-width:220px; background:#eafaf1; border:1px solid #a9dfbf; border-radius:6px; padding:10px; display:flex; justify-content:space-between; align-items:center;">' +
                    '<div><div style="font-size:10px; font-weight:bold; color:#27ae60; margin-bottom:3px; text-transform:uppercase;">Koreksi Guru</div><div style="font-size:11px; color:#1e8449;">Klik centang jika benar</div></div>' +
                    '<label style="cursor:pointer; display:flex; align-items:center; gap:8px; background:white; padding:6px 10px; border-radius:6px; border:1px solid #27ae60;">' +
                        '<span style="font-size:12px; font-weight:bold; color:#27ae60;">BENAR</span>' +
                        '<input type="checkbox" id="chk-koreksi-' + idx + '" style="width:20px; height:20px; cursor:pointer; accent-color:#16a085;" onchange="window.hitungSkorLiveKoreksi()" ' + isChecked + '>' +
                    '</label>' +
                '</div>';
            }

            let kunciArr = Array.isArray(h.kunci) ? h.kunci : [h.kunci || '-'];
            let borderLeftColor = sudahBenar ? '#27ae60' : '#e67e22';
            let cardHTML = '<div style="background:#ffffff; border:1px solid #e1e8ed; border-left:5px solid ' + borderLeftColor + '; border-radius:8px; overflow:hidden; box-shadow:0 2px 4px rgba(0,0,0,0.02);">' +
                '<div style="background:#f8f9fa; padding:8px 15px; border-bottom:1px solid #e1e8ed; display:flex; justify-content:space-between; align-items:center;">' +
                    '<span style="font-weight:bold; color:#2c3e50; font-size:13px;">Soal ' + nomorUrut + ' <span style="font-size:11px; color:#7f8c8d; font-weight:normal; margin-left:5px;">(' + (isEssay ? 'Essay' : 'IS') + ')</span></span>' +
                    '<span style="background:#ecf0f1; color:#34495e; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:bold;">Maks: ' + maxP.toFixed(2) + ' pt</span>' +
                '</div>' +
                '<div style="padding:12px 15px;">' +
                    '<div style="font-size:14px; color:#2c3e50; margin-bottom:12px; line-height:1.4;">' + (h.soal || '') + '</div>' +
                    '<div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">' +
                        '<div style="flex:1; min-width:220px; background:#fdfefe; border:1px solid #d5dbdb; border-radius:6px; padding:10px;">' +
                            '<div style="font-size:10px; font-weight:bold; color:#7f8c8d; margin-bottom:5px; text-transform:uppercase;">Jawaban Siswa</div>' +
                            '<div style="font-size:14px; color:#c0392b; font-weight:600;">' + (h.jawabSiswa || '-') + '</div>' +
                        '</div>' +
                        uiKoreksiGuru +
                    '</div>' +
                    '<div style="background:#f4f6f6; border-radius:6px; padding:10px 12px; font-size:12px; color:#34495e; border-left:3px solid #3498db;">' +
                        '<strong style="color:#2980b9;">💡 Kunci: ' + kunciArr.join(' | ') + '</strong> <br>' +
                        '<div style="margin-top:4px; line-height:1.4;">' + (h.pembahasan || '') + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

            if (sudahBenar) grupSudahBenar.push(cardHTML);
            else grupBelumBenar.push(cardHTML);
        } else {
            // KARTU PG & PGK (TAMPILAN PERSIS GAMBAR 2 & BERURUTAN)
            let labelTipePG = (tipeUpper === 'PGK') ? 'PGK' : 'PG';
            let defaultMaxPG = (labelTipePG === 'PGK') ? maxPoinPGK : maxPoinPG;
            let pMax = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : defaultMaxPG;
            h.maxPoin = pMax;
            let pDidapat = Number(h.poinDidapat !== undefined ? h.poinDidapat : (h.poin || 0)) || 0;
            let isBenarPG = pDidapat > 0 || h.status === "Benar" || h.status === "Benar Sempurna";
            let borderColPG = isBenarPG ? "#27ae60" : "#e74c3c";

            let badgeStatusPG = isBenarPG
                ? '<span style="background:#d4edda; color:#155724; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:800;">✅ Benar (+' + pDidapat.toFixed(2) + ' / ' + pMax.toFixed(2) + ' pt)</span>'
                : '<span style="background:#f8d7da; color:#721c24; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:800;">❌ Salah (0 / ' + pMax.toFixed(2) + ' pt)</span>';

            let rawJwbPG = h.jawabSiswa !== undefined ? h.jawabSiswa : (h.jawabanSiswa || "-");
            let strJwbPG = Array.isArray(rawJwbPG) ? rawJwbPG.join(", ") : String(rawJwbPG || "-");
            let rawKunciPG = h.kunci || [];
            let strKunciPG = Array.isArray(rawKunciPG) ? rawKunciPG.join(", ") : String(rawKunciPG || "-");

            let cardPGHTML =
                '<div style="background:white; border:1px solid #cbd5e1; border-left:5px solid ' + borderColPG + '; border-radius:10px; padding:14px 16px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-bottom:1px solid #f1f5f9; padding-bottom:8px; margin-bottom:10px;">' +
                        '<span style="font-weight:800; color:#0b3954; font-size:13px;">Soal Nomor ' + nomorUrut + ' <span style="background:#eef2f7; color:#475569; padding:2px 8px; border-radius:6px; font-size:11px; margin-left:6px;">Tipe: ' + labelTipePG + '</span></span>' +
                        badgeStatusPG +
                    '</div>' +
                    '<div style="font-size:14px; color:#1e293b; line-height:1.5; margin-bottom:12px; font-weight:600;">' + (h.soal || "-") + '</div>' +
                    '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin-bottom:10px;">' +
                        '<div style="background:' + (isBenarPG ? "#f0fdf4" : "#fef2f2") + '; border:1px solid ' + (isBenarPG ? "#bbf7d0" : "#fecaca") + '; padding:10px 12px; border-radius:8px;">' +
                            '<div style="font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:3px;">JAWABAN SISWA</div>' +
                            '<div style="font-size:14px; font-weight:800; color:' + (isBenarPG ? "#15803d" : "#b91c1c") + ';">' + strJwbPG + '</div>' +
                        '</div>' +
                        '<div style="background:#fef9e7; border:1px solid #fde68a; padding:10px 12px; border-radius:8px;">' +
                            '<div style="font-size:10px; font-weight:800; color:#b45309; text-transform:uppercase; margin-bottom:3px;">🔑 KUNCI JAWABAN</div>' +
                            '<div style="font-size:14px; font-weight:800; color:#92400e;">' + strKunciPG + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="background:#f8fafc; border-left:3px solid #3498db; padding:8px 12px; border-radius:6px; font-size:12px; color:#334155;">' +
                        '<strong style="color:#2980b9;">💡 Pembahasan:</strong> ' + (h.pembahasan || "Tidak ada pembahasan.") +
                    '</div>' +
                '</div>';

            grupPGdanPGK.push(cardPGHTML);
        }
    });

    let htmlISEssay = '';
    if (grupBelumBenar.length > 0) {
        htmlISEssay += '<div style="background:#fef9e7; border:1px solid #f9e79f; color:#d35400; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:bold;">🔍 Perlu Diperiksa Manual / Belum Tercentang Benar (' + grupBelumBenar.length + ' Soal)</div>';
        htmlISEssay += grupBelumBenar.join('');
    }
    if (grupSudahBenar.length > 0) {
        htmlISEssay += '<div style="background:#eafaf1; border:1px solid #a9dfbf; color:#1e8449; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:bold; margin-top:10px;">✅ Sudah Terdeteksi / Tercentang Benar (' + grupSudahBenar.length + ' Soal)</div>';
        htmlISEssay += grupSudahBenar.join('');
    }
    if (grupBelumBenar.length === 0 && grupSudahBenar.length === 0) {
        htmlISEssay = '<div style="text-align:center; padding:30px; color:#7f8c8d; font-weight:bold;">Tidak ada soal Isian Singkat atau Essay pada paket ujian ini. Klik tombol <b>📋 PG & PGK</b> di kanan atas untuk melihat detail jawaban PG/PGK siswa.</div>';
    }

    let htmlPGSection = '';
    if (grupPGdanPGK.length > 0) {
        htmlPGSection = grupPGdanPGK.join('');
    } else {
        htmlPGSection = '<div style="text-align:center; padding:30px; color:#7f8c8d; font-weight:bold;">Tidak ada soal Pilihan Ganda (PG) atau PGK pada paket ujian ini.</div>';
    }

    let btnPG = window.pastikanTombolPGKoreksiAda();
    if (btnPG) {
        btnPG.setAttribute('data-jml-pg', String(grupPGdanPGK.length));
    }

    if (grid) {
        grid.innerHTML =
            '<div id="koreksi-section-is-essay" style="display:flex; flex-direction:column; gap:15px;">' + htmlISEssay + '</div>' +
            '<div id="koreksi-section-pg-pgk" style="display:none; flex-direction:column; gap:14px;">' + htmlPGSection + '</div>';
    }

    window.toggleTampilanPGKoreksi(Boolean(window.modeTampilanKoreksiPG));
    window.hitungSkorLiveKoreksi();
    window.bukaModal('modal-koreksi-ujian');
};

window.hitungSkorLiveKoreksi = function() {
    let t = window.tempKoreksiTarget;
    if (!t || !t.data) return;

    let labelPaketAsli = t.data.paketAsli || t.paket;
    let safePkt = window.sanitasiKeyRekapFirebase(labelPaketAsli);
    let bankData = (window.adminBankUjianData && (window.adminBankUjianData[t.paket] || window.adminBankUjianData[labelPaketAsli] || window.adminBankUjianData[safePkt])) || null;
    let detailArr = t.data.detail || [];
    let bobotIdeal = window.hitungBobotIdealUjian(bankData, detailArr);

    let totalPoin = 0;
    let totalMax = 0;

    detailArr.forEach(function(h, idx) {
        let tipeUpper = String(h.tipe || h.type || 'PG').trim().toUpperCase();
        let pAwal = Number(h.poinDidapat !== undefined ? h.poinDidapat : (h.poin || 0)) || 0;

        if (tipeUpper === 'PG' || tipeUpper === 'PGK') {
            let defaultMax = tipeUpper === 'PGK' ? bobotIdeal.PGK : bobotIdeal.PG;
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : defaultMax;
            totalPoin += pAwal;
            totalMax += maxP;
        } else if (tipeUpper === 'IS' || tipeUpper === 'ISIAN' || tipeUpper === 'SHORT_ANSWER') {
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : bobotIdeal.IS;
            let chk = document.getElementById('chk-koreksi-' + idx);
            if (chk && chk.checked) totalPoin += maxP;
            totalMax += maxP;
        } else if (tipeUpper === 'ESSAY' || tipeUpper === 'ESAI' || tipeUpper === 'URAIAN') {
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : bobotIdeal.Essay;
            let inp = document.getElementById('input-koreksi-' + idx);
            if (inp) {
                let val = parseFloat(inp.value) || 0;
                if (val > 1) val = 1;
                if (val < 0) val = 0;
                totalPoin += (val * maxP);
            }
            totalMax += maxP;
        }
    });

    let nilaiSkala100 = totalMax > 0 ? ((totalPoin / totalMax) * 100) : totalPoin;

    if (t.data.isRemedial) {
        let batasKkm = Number(t.data.maxScore) || (typeof window.dapatkanKKMKelas === "function" ? window.dapatkanKKMKelas(t.kelas) : 75);
        if (nilaiSkala100 > batasKkm) nilaiSkala100 = batasKkm;
        if (t.data.nilaiSebelumRemedial !== undefined && t.data.nilaiSebelumRemedial !== null && !isNaN(Number(t.data.nilaiSebelumRemedial))) {
            nilaiSkala100 = Math.max(Number(t.data.nilaiSebelumRemedial), nilaiSkala100);
        }
    }

    let liveEl = document.getElementById('koreksi-nilai-live');
    if (liveEl) liveEl.innerText = nilaiSkala100.toFixed(2);
};

window.simpanKoreksiManual = function() {
    let t = window.tempKoreksiTarget;
    if (!t || !t.data) return;

    let kelasAsli = t.data.kelasAsli || t.kelas;
    let paketAsli = t.data.paketAsli || t.paket;
    let namaAsli = t.data.namaAsli || t.nama;

    let safeKls = window.sanitasiKeyRekapFirebase(kelasAsli);
    let safePkt = window.sanitasiKeyRekapFirebase(paketAsli);
    let safeNama = window.sanitasiKeyRekapFirebase(namaAsli);

    let bankData = (window.adminBankUjianData && (window.adminBankUjianData[t.paket] || window.adminBankUjianData[safePkt] || window.adminBankUjianData[paketAsli])) || null;
    let updateDetail = (t.data.detail || []).slice();
    let bobotIdeal = window.hitungBobotIdealUjian(bankData, updateDetail);

    let totalPoinBaru = 0;
    let totalMaxBaru = 0;
    let xpTambahanSiswa = 0;

    updateDetail.forEach(function(h, idx) {
        let tipeUpper = String(h.tipe || h.type || 'PG').trim().toUpperCase();
        let pAwal = Number(h.poinDidapat !== undefined ? h.poinDidapat : (h.poin || 0)) || 0;
        let wasCorrect = pAwal > 0;

        if (tipeUpper === 'PG' || tipeUpper === 'PGK') {
            let defaultMax = tipeUpper === 'PGK' ? bobotIdeal.PGK : bobotIdeal.PG;
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : defaultMax;
            h.poinDidapat = pAwal;
            h.maxPoin = maxP;
            totalPoinBaru += pAwal;
            totalMaxBaru += maxP;
        } else if (tipeUpper === 'IS' || tipeUpper === 'ISIAN' || tipeUpper === 'SHORT_ANSWER') {
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : bobotIdeal.IS;
            let chk = document.getElementById('chk-koreksi-' + idx);
            let isChecked = chk ? chk.checked : false;
            h.poinDidapat = isChecked ? maxP : 0;
            h.poin = h.poinDidapat;
            h.maxPoin = maxP;
            h.status = isChecked ? "Benar" : "Salah";
            totalPoinBaru += h.poinDidapat;
            totalMaxBaru += maxP;

            if (!wasCorrect && isChecked) xpTambahanSiswa += window.dapatkanPoinXPPerSoal('IS');
            else if (wasCorrect && !isChecked) xpTambahanSiswa -= window.dapatkanPoinXPPerSoal('IS');
        } else if (tipeUpper === 'ESSAY' || tipeUpper === 'ESAI' || tipeUpper === 'URAIAN') {
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : bobotIdeal.Essay;
            let inp = document.getElementById('input-koreksi-' + idx);
            let val = inp ? parseFloat(inp.value) : 0;
            if (isNaN(val)) val = 0;
            if (val > 1) val = 1;
            if (val < 0) val = 0;

            h.poinDidapat = (val * maxP);
            h.poin = h.poinDidapat;
            h.maxPoin = maxP;
            h.status = val === 1 ? "Benar Sempurna" : (val > 0 ? "Benar Parsial" : "Salah");
            totalPoinBaru += h.poinDidapat;
            totalMaxBaru += maxP;

            let isCorrectNow = val > 0;
            if (!wasCorrect && isCorrectNow) xpTambahanSiswa += window.dapatkanPoinXPPerSoal('Essay');
            else if (wasCorrect && !isCorrectNow) xpTambahanSiswa -= window.dapatkanPoinXPPerSoal('Essay');
        }
    });

    let nilaiSkala100 = totalMaxBaru > 0 ? ((totalPoinBaru / totalMaxBaru) * 100) : totalPoinBaru;

    if (t.data.isRemedial) {
        let batasKkm = Number(t.data.maxScore) || (typeof window.dapatkanKKMKelas === "function" ? window.dapatkanKKMKelas(kelasAsli) : 75);
        if (nilaiSkala100 > batasKkm) nilaiSkala100 = batasKkm;
        if (t.data.nilaiSebelumRemedial !== undefined && t.data.nilaiSebelumRemedial !== null && !isNaN(Number(t.data.nilaiSebelumRemedial))) {
            nilaiSkala100 = Math.max(Number(t.data.nilaiSebelumRemedial), nilaiSkala100);
        }
    }

    t.data.nilaiAkhir = parseFloat(nilaiSkala100.toFixed(2));
    t.data.xpSudahDiberikan = Math.max(0, (Number(t.data.xpSudahDiberikan) || 0) + xpTambahanSiswa);
    t.data.detail = updateDetail;
    t.data.rincian = updateDetail;
    t.data.sudahDikoreksi = true;

    if (!window.adminRekapNilaiData[safeKls]) window.adminRekapNilaiData[safeKls] = {};
    if (!window.adminRekapNilaiData[safeKls][safePkt]) window.adminRekapNilaiData[safeKls][safePkt] = {};
    window.adminRekapNilaiData[safeKls][safePkt][safeNama] = t.data;

    // Bersihkan duplikat kunci mentah jika berbeda dengan kunci yang disanitasi
    if (window.adminRekapNilaiData[kelasAsli] && window.adminRekapNilaiData[kelasAsli][paketAsli] && namaAsli !== safeNama) {
        delete window.adminRekapNilaiData[kelasAsli][paketAsli][namaAsli];
    }

    let pathDB = 'admin_rekap_nilai/' + safeKls + '/' + safePkt + '/' + safeNama;
    if (typeof window.simpanNilaiUjianKeDB === "function") {
        window.simpanNilaiUjianKeDB(pathDB, t.data);
    } else if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
        window.kirimNilaiUjianAmanKeDB(pathDB, t.data, function() {}, function() {});
    }

    if (xpTambahanSiswa !== 0) {
        let usernameSiswa = t.data.usernameSiswa || safeNama;
        let cleanUserKey = window.sanitasiKeyRekapFirebase(usernameSiswa).toLowerCase();

        if (window.leaderboardSiswaData && window.leaderboardSiswaData[cleanUserKey]) {
            let lb = window.leaderboardSiswaData[cleanUserKey];
            let curTotal = Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0;
            let curCoin = Number(lb.coin !== undefined ? lb.coin : (lb.xpTersedia !== undefined ? lb.xpTersedia : lb.xp)) || 0;
            lb.xpTotal = Math.max(0, curTotal + xpTambahanSiswa);
            lb.xp = lb.xpTotal;
            lb.coin = Math.max(0, curCoin + xpTambahanSiswa);
            lb.xpTersedia = lb.coin;
            if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
                window.simpanLeaderboardSiswaKeDB(cleanUserKey, lb);
            }
        }
    }

    let msg = xpTambahanSiswa > 0 ? "✅ Data diperbarui (Siswa mendapat +" + xpTambahanSiswa + " XP)" : "✅ Data diperbarui";
    let toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#27ae60; color:white; padding:10px 20px; border-radius:30px; font-family:'Poppins', sans-serif; font-size:13px; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.15); z-index:9999999; opacity:0; transition:opacity 0.3s;";
    document.body.appendChild(toast);
    setTimeout(function() { toast.style.opacity = '1'; }, 10);
    setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 300); }, 2000);

    window.muatDataKoreksi(safeNama);
    window.renderRekapNilai();
    if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
    if (typeof window.renderRemedialTabAdmin === "function") window.renderRemedialTabAdmin();
};

// =========================================================================
// 7. LOGIKA KONTROL UJIAN & LIVE MONITOR (TERINTEGRASI DI MANAJER UJIAN)
// =========================================================================
window.bukaModalKontrolUjian = function() {
    window.bukaModal('modal-manajer-ujian');
    if (typeof window.bukaTabManajerUjian === "function") {
        window.bukaTabManajerUjian('tab-ujian-kontrol');
    }
    window.renderKontrolUjian();
};

window.renderKontrolUjian = function() {
    let selectEl = document.getElementById('admin-pilih-ujian');
    let prevSelected = selectEl ? selectEl.value : "";
    let htmlOpt = '<option value="">-- Pilih Paket Ujian --</option>';

    let paketAktif = Object.values(window.adminUjianAktifData || {}).map(function(u) { return u.paket; });
    let bankKeys = Object.keys(window.adminBankUjianData || {}).sort();

    bankKeys.forEach(function(k) {
        if (!paketAktif.includes(k)) {
            let isSel = (k === prevSelected) ? ' selected' : '';
            htmlOpt += '<option value="' + k.replace(/"/g, '&quot;') + '"' + isSel + '>' + k + '</option>';
        }
    });

    if (selectEl) {
        selectEl.innerHTML = htmlOpt;
        if (prevSelected && !paketAktif.includes(prevSelected) && bankKeys.includes(prevSelected)) {
            selectEl.value = prevSelected;
        }
    }

    let container = document.getElementById('container-ujian-aktif');
    let aktifKeys = Object.keys(window.adminUjianAktifData || {});
    if (typeof window.updateHeaderInfoManajerUjian === "function") {
        window.updateHeaderInfoManajerUjian();
    }

    if (aktifKeys.length === 0) {
        if (container) container.innerHTML = '<p style="color:#7f8c8d; font-size:12px; text-align:center; padding:20px; background:#f8f9fa; border-radius:6px; border:1px dashed #ccc;">Belum ada ujian yang diaktifkan.</p>';
        return;
    }

    let htmlAktif = '';
    aktifKeys.forEach(function(kode) {
        let u = window.adminUjianAktifData[kode] || {};
        let badgeRemed = u.isRemedial ? ' <span style="background:#e74c3c; color:white; padding:1px 6px; border-radius:4px; font-size:10px;">REMEDIAL (' + (u.kelas || 'Semua') + ')</span>' : '';
        let safeKode = kode.replace(/'/g, "\\'");

        htmlAktif += '<div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #e1e8ed; padding:12px; border-radius:6px; margin-bottom:8px; border-left:4px solid #27ae60; box-shadow:0 2px 5px rgba(0,0,0,0.02);">' +
            '<div>' +
                '<div style="font-weight:bold; color:#2c3e50; font-size:14px; margin-bottom:4px;">🎯 ' + (u.paket || kode) + badgeRemed + '</div>' +
                '<div style="font-size:11px; color:#7f8c8d;">' +
                    'Kode Akses: <span style="background:#f1c40f; color:#333; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:12px; letter-spacing:1px;">' + kode + '</span> | Waktu: <span style="font-weight:bold;">' + (u.durasi || 90) + ' Menit</span>' +
                '</div>' +
            '</div>' +
            '<button style="background:#c0392b; color:white; border:none; padding:6px 12px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer; transition:0.2s;" onclick="window.nonaktifkanUjian(\'' + safeKode + '\')" onmouseover="this.style.background=\'#a93226\'" onmouseout="this.style.background=\'#c0392b\'">🛑 Tutup Akses</button>' +
        '</div>';
    });
    if (container) container.innerHTML = htmlAktif;
};

window.simpanKontrolUjian = function() {
    let elPilih = document.getElementById('admin-pilih-ujian');
    let elKode = document.getElementById('admin-kode-ujian');
    let elDurasi = document.getElementById('admin-durasi-ujian');
    if (!elPilih || !elKode || !elDurasi) return;

    let paket = elPilih.value;
    let kode = elKode.value.trim().toUpperCase();
    let durasi = parseInt(elDurasi.value, 10);

    if (!paket) return alert("Pilih paket ujian terlebih dahulu!");
    if (!kode) return alert("Kode akses ujian tidak boleh kosong!");
    if (window.adminUjianAktifData && window.adminUjianAktifData[kode]) return alert("Kode ujian ini sudah dipakai/sedang aktif. Gunakan kode lain!");
    if (!durasi || durasi <= 0) return alert("Durasi ujian tidak valid!");

    if (!window.adminUjianAktifData) window.adminUjianAktifData = {};
    window.adminUjianAktifData[kode] = {
        paket: paket,
        durasi: durasi,
        dibuat: new Date().toISOString()
    };

    elKode.value = "";
    elDurasi.value = "90";

    window.renderKontrolUjian();
    if (typeof window.simpanUjianAktifKeDB === "function") window.simpanUjianAktifKeDB();
};

window.nonaktifkanUjian = function(kode) {
    if (confirm('Yakin ingin menutup akses ujian (Kode: ' + kode + ')? Siswa yang belum masuk tidak akan bisa mengaksesnya lagi.')) {
        if (window.adminUjianAktifData) delete window.adminUjianAktifData[kode];
        window.renderKontrolUjian();
        if (typeof window.simpanUjianAktifKeDB === "function") window.simpanUjianAktifKeDB();
    }
};

// --- MESIN LIVE MONITOR UJIAN (SINKRON DENGAN KUNCI SANITASI FIREBASE) ---
window.ambilObjekLiveMonitorPaket = function(paket) {
    if (!paket || !window.adminLiveMonitorData) return {};
    let safePkt = window.sanitasiKeyRekapFirebase(paket).toLowerCase();
    let targetLow = String(paket).trim().toLowerCase();
    let gabunganKelas = {};

    Object.keys(window.adminLiveMonitorData).forEach(function(pKey) {
        let pKeyLow = String(pKey).trim().toLowerCase();
        let pKeySafe = window.sanitasiKeyRekapFirebase(pKey).toLowerCase();
        if (pKeyLow === targetLow || pKeySafe === safePkt) {
            let mapKelas = window.adminLiveMonitorData[pKey] || {};
            Object.keys(mapKelas).forEach(function(kKey) {
                let siswaMap = mapKelas[kKey] || {};
                Object.keys(siswaMap).forEach(function(sKey) {
                    let item = siswaMap[sKey];
                    if (!item) return;
                    let klsAsli = item.kelas || kKey;
                    let namaAsli = item.nama || sKey;
                    if (!gabunganKelas[klsAsli]) gabunganKelas[klsAsli] = {};
                    gabunganKelas[klsAsli][namaAsli] = item;
                });
            });
        }
    });
    return gabunganKelas;
};

window.perbaruiBadgeNotifMonitor = function() {
    let badge = document.getElementById('badge-notif');
    if (!badge) return;
    let adaPelanggaran = false;
    let allPaket = window.adminLiveMonitorData || {};
    Object.keys(allPaket).forEach(function(p) {
        let kelasObj = allPaket[p] || {};
        Object.keys(kelasObj).forEach(function(k) {
            let siswaObj = kelasObj[k] || {};
            Object.keys(siswaObj).forEach(function(s) {
                if (siswaObj[s] && (Number(siswaObj[s].pelanggaran) || 0) > 0) adaPelanggaran = true;
            });
        });
    });
    badge.style.display = adaPelanggaran ? 'inline-block' : 'none';
};

window.bukaModalLiveMonitor = function() {
    window.bukaModal('modal-manajer-ujian');
    if (typeof window.bukaTabManajerUjian === "function") {
        window.bukaTabManajerUjian('tab-ujian-monitor');
    }
    window.muatDropdownLiveMonitor();
    window.renderIsiLiveMonitor();
};

window.tutupLiveMonitor = function() {
    window.tutupModal('modal-manajer-ujian');
};

window.muatDropdownLiveMonitor = function() {
    let selPaket = document.getElementById('live-monitor-paket');
    let selKelas = document.getElementById('live-monitor-kelas');
    if (!selPaket) return;

    let prevPaket = selPaket.value;
    let prevSafe = window.sanitasiKeyRekapFirebase(prevPaket).toLowerCase();
    let prevKelas = selKelas ? selKelas.value : 'Semua';

    let paketMap = {};
    function tambahPaketMonitor(rawName, labelName) {
        if (!rawName) return;
        let sKey = window.sanitasiKeyRekapFirebase(rawName).toLowerCase();
        if (!paketMap[sKey]) {
            paketMap[sKey] = labelName || rawName;
        }
    }

    Object.keys(window.adminBankUjianData || {}).forEach(function(p) { tambahPaketMonitor(p, p); });
    Object.values(window.adminUjianAktifData || {}).forEach(function(u) { if (u && u.paket) tambahPaketMonitor(u.paket, u.paket); });
    Object.keys(window.adminLiveMonitorData || {}).forEach(function(p) {
        let klsMap = window.adminLiveMonitorData[p] || {};
        let firstKls = Object.values(klsMap)[0] || {};
        let firstSiswa = Object.values(firstKls)[0];
        let labelAsli = (firstSiswa && firstSiswa.paket) ? firstSiswa.paket : p;
        tambahPaketMonitor(p, labelAsli);
    });

    let daftarPaket = Object.values(paketMap).sort();
    let htmlPaket = '<option value="">-- Pilih Ujian --</option>';
    daftarPaket.forEach(function(p) {
        let isSel = (prevPaket !== "" && (p === prevPaket || window.sanitasiKeyRekapFirebase(p).toLowerCase() === prevSafe));
        htmlPaket += '<option value="' + p.replace(/"/g, '&quot;') + '" ' + (isSel ? 'selected' : '') + '>' + p + '</option>';
    });
    selPaket.innerHTML = htmlPaket;

    if (!selPaket.value) {
        let aktifValues = Object.values(window.adminUjianAktifData || {});
        if (aktifValues.length === 1 && aktifValues[0].paket) {
            selPaket.value = aktifValues[0].paket;
        } else if (daftarPaket.length === 1) {
            selPaket.value = daftarPaket[0];
        }
    }

    window.perbaruiDropdownKelasMonitor(prevKelas);
};

window.perbaruiDropdownKelasMonitor = function(prevKelas) {
    let selPaket = document.getElementById('live-monitor-paket');
    let selKelas = document.getElementById('live-monitor-kelas');
    if (!selKelas) return;

    let paketDipilih = selPaket ? selPaket.value : '';
    let kelasMap = {};

    Object.keys(window.adminData || {}).forEach(function(k) {
        kelasMap[window.sanitasiKeyRekapFirebase(k).toLowerCase()] = k;
    });

    if (paketDipilih) {
        let dataPaket = window.ambilObjekLiveMonitorPaket(paketDipilih);
        Object.keys(dataPaket).forEach(function(k) {
            let sKey = window.sanitasiKeyRekapFirebase(k).toLowerCase();
            if (!kelasMap[sKey]) kelasMap[sKey] = k;
        });
    }

    let htmlKelas = '<option value="Semua">Semua Kelas</option>';
    Object.values(kelasMap).sort().forEach(function(k) {
        let selected = (k === prevKelas) ? 'selected' : '';
        htmlKelas += '<option value="' + k.replace(/"/g, '&quot;') + '" ' + selected + '>' + k + '</option>';
    });
    selKelas.innerHTML = htmlKelas;
};

window.loadLiveMonitor = function() {
    let selKelas = document.getElementById('live-monitor-kelas');
    window.perbaruiDropdownKelasMonitor(selKelas ? selKelas.value : 'Semua');
    window.renderIsiLiveMonitor();
};

window.renderIsiLiveMonitor = function() {
    let selPaket = document.getElementById('live-monitor-paket');
    let selKelas = document.getElementById('live-monitor-kelas');
    let listEl = document.getElementById('live-monitor-list');
    if (!listEl || !selPaket) return;

    let paket = selPaket.value;
    let filterKelas = selKelas ? selKelas.value : 'Semua';
    let safeFilterKls = window.sanitasiKeyRekapFirebase(filterKelas).toLowerCase();

    if (!paket) {
        listEl.innerHTML = '<div style="text-align:center; padding:25px; color:#7f8c8d; background:#f8f9fa; border-radius:8px; border:1px dashed #ccc;">Pilih paket ujian di atas untuk melihat pantauan siswa secara langsung.</div>';
        return;
    }

    let dataPaket = window.ambilObjekLiveMonitorPaket(paket);
    let daftarBaris = [];

    Object.keys(dataPaket).sort().forEach(function(kls) {
        if (filterKelas !== 'Semua' && kls !== filterKelas && window.sanitasiKeyRekapFirebase(kls).toLowerCase() !== safeFilterKls) return;
        let siswaMap = dataPaket[kls] || {};
        Object.keys(siswaMap).sort().forEach(function(nama) {
            let item = siswaMap[nama];
            if (!item) return;
            daftarBaris.push({
                kelas: item.kelas || kls,
                nama: item.nama || nama,
                status: item.status || 'Sedang Mengerjakan',
                pelanggaran: Number(item.pelanggaran) || 0
            });
        });
    });

    if (daftarBaris.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; padding:25px; color:#7f8c8d; background:#f8f9fa; border-radius:8px; border:1px dashed #ccc;">Belum ada aktivitas siswa pada ujian <b>' + paket + '</b>' + (filterKelas !== 'Semua' ? ' di kelas <b>' + filterKelas + '</b>' : '') + '.</div>';
        return;
    }

    let html = '';
    daftarBaris.forEach(function(row) {
        let isAman = row.pelanggaran === 0;
        let isKicked = row.pelanggaran >= 5 || row.status === 'Dikeluarkan';

        let bgCard = isAman ? '#d5f5e3' : (isKicked ? '#fadbd8' : '#fef5d1');
        let borderCard = isAman ? '#a9dfbf' : (isKicked ? '#f5b7b1' : '#f5cba7');
        let statusRight = isAman
            ? '<span style="color:#1e3729; font-weight:700;">✅ Aman</span>'
            : (isKicked
                ? '<span style="color:#c0392b; font-weight:700;">❌ Dikeluarkan (' + row.pelanggaran + 'x)</span>'
                : '<span style="color:#2c3e50; font-weight:700;">⚠️ Melanggar (' + row.pelanggaran + 'x)</span>');

        let safePktJS = paket.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeKlsJS = row.kelas.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeNamaJS = row.nama.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

        let btnHapusSiswa = '<button type="button" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:16px; margin-left:12px; font-weight:bold; transition:0.2s;" title="Hapus dari Live Monitor (Izinkan Ujian Ulang)" onclick="window.hapusSiswaLiveMonitor(\'' + safePktJS + '\', \'' + safeKlsJS + '\', \'' + safeNamaJS + '\')" onmouseover="this.style.transform=\'scale(1.2)\'" onmouseout="this.style.transform=\'scale(1)\'">✕</button>';

        html += '<div style="display:flex; justify-content:space-between; align-items:center; background:' + bgCard + '; border:1px solid ' + borderCard + '; padding:12px 16px; border-radius:8px; margin-bottom:8px;">' +
            '<div>' +
                '<div style="font-weight:700; font-size:15px; color:#1e272e; margin-bottom:2px;">' + row.kelas + ' - ' + row.nama + '</div>' +
                '<div style="font-size:12px; color:#485460;">' + row.status + '</div>' +
            '</div>' +
            '<div style="font-size:14px; display:flex; align-items:center;">' + statusRight + btnHapusSiswa + '</div>' +
        '</div>';
    });

    listEl.innerHTML = html;
};

window.hapusSiswaLiveMonitor = function(paket, kelas, nama) {
    if (confirm('Hapus siswa "' + nama + '" dari pantauan ujian "' + paket + '"?\n\nIni akan mereset statusnya dan MENGIZINKAN siswa tersebut untuk masuk/login ulang ke dalam ujian.')) {
        let safePkt = window.sanitasiKeyRekapFirebase(paket);
        let safeKls = window.sanitasiKeyRekapFirebase(kelas);
        let safeNama = window.sanitasiKeyRekapFirebase(nama);

        [paket, safePkt].forEach(function(pKey) {
            if (window.adminLiveMonitorData && window.adminLiveMonitorData[pKey]) {
                [kelas, safeKls].forEach(function(kKey) {
                    if (window.adminLiveMonitorData[pKey][kKey]) {
                        delete window.adminLiveMonitorData[pKey][kKey][nama];
                        delete window.adminLiveMonitorData[pKey][kKey][safeNama];
                        if (Object.keys(window.adminLiveMonitorData[pKey][kKey]).length === 0) {
                            delete window.adminLiveMonitorData[pKey][kKey];
                        }
                    }
                });
                if (Object.keys(window.adminLiveMonitorData[pKey]).length === 0) {
                    delete window.adminLiveMonitorData[pKey];
                }
            }
        });

        if (typeof window.hapusDataLiveMonitorDiDB === "function") {
            window.hapusDataLiveMonitorDiDB(paket, kelas, nama);
            if (safePkt !== paket || safeKls !== kelas || safeNama !== nama) {
                window.hapusDataLiveMonitorDiDB(safePkt, safeKls, safeNama);
            }
        }
        window.renderIsiLiveMonitor();
        window.perbaruiBadgeNotifMonitor();
    }
};

window.hapusLiveMonitorData = function() {
    let selPaket = document.getElementById('live-monitor-paket');
    let selKelas = document.getElementById('live-monitor-kelas');
    let paket = selPaket ? selPaket.value : '';
    let kelas = selKelas ? selKelas.value : 'Semua';

    if (!paket) {
        return alert("Pilih ujian yang ingin dihapus history-nya terlebih dahulu!");
    }

    let pesanKonfirmasi = (kelas && kelas !== 'Semua')
        ? 'Hapus riwayat Live Monitor untuk ujian "' + paket + '" khusus kelas "' + kelas + '"?'
        : 'Hapus seluruh riwayat Live Monitor untuk ujian "' + paket + '" (Semua Kelas)?';

    if (confirm(pesanKonfirmasi)) {
        let safePkt = window.sanitasiKeyRekapFirebase(paket);
        let safeKls = window.sanitasiKeyRekapFirebase(kelas);

        [paket, safePkt].forEach(function(pKey) {
            if (window.adminLiveMonitorData && window.adminLiveMonitorData[pKey]) {
                if (kelas && kelas !== 'Semua') {
                    delete window.adminLiveMonitorData[pKey][kelas];
                    delete window.adminLiveMonitorData[pKey][safeKls];
                } else {
                    delete window.adminLiveMonitorData[pKey];
                }
            }
        });

        if (typeof window.hapusDataLiveMonitorDiDB === "function") {
            window.hapusDataLiveMonitorDiDB(paket, kelas, null);
            if (safePkt !== paket || (kelas !== 'Semua' && safeKls !== kelas)) {
                window.hapusDataLiveMonitorDiDB(safePkt, (kelas !== 'Semua' ? safeKls : 'Semua'), null);
            }
        }
        window.renderIsiLiveMonitor();
        window.perbaruiBadgeNotifMonitor();
    }
};

// =========================================================================
// 8. OBSERVER MODAL GERBANG UJIAN, REKAP NILAI, & MANAJER UJIAN
// =========================================================================
document.addEventListener("DOMContentLoaded", function() {
    let modalEU = document.getElementById('modal-enter-ujian');
    if (modalEU) {
        let obsEU = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.target.id === 'modal-enter-ujian' && m.target.style.display === 'flex') {
                    if (typeof window.pastikanListenerBankUjianAktif === "function") {
                        window.pastikanListenerBankUjianAktif();
                    }
                    window.renderDropdownKelasUjian();
                }
            });
        });
        obsEU.observe(modalEU, { attributes: true, attributeFilter: ['style'] });
    }

    let modalRN = document.getElementById('modal-rekap-nilai');
    if (modalRN) {
        let obsRN = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.target.id === 'modal-rekap-nilai' && m.target.style.display === 'flex') {
                    window.renderDropdownRekap();
                }
            });
        });
        obsRN.observe(modalRN, { attributes: true, attributeFilter: ['style'] });
    }

    let modalMU = document.getElementById('modal-manajer-ujian');
    if (modalMU) {
        let obsMU = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.target.id === 'modal-manajer-ujian' && m.target.style.display === 'flex') {
                    window.renderKontrolUjian();
                    window.muatDropdownLiveMonitor();
                    window.renderIsiLiveMonitor();
                }
            });
        });
        obsMU.observe(modalMU, { attributes: true, attributeFilter: ['style'] });
    }
});

// =========================================================================
// 9. FITUR "NILAI SAYA" KHUSUS AKUN SISWA (ISOLASI KETAT & HEMAT KUOTA)
// =========================================================================
window._cachePaketNilaiSayaMap = {};
window._dataAktifNilaiSaya = null;

window.bukaModalNilaiSaya = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let rawUser = (sessionStorage.getItem("username") || "").trim().toLowerCase();

    if (stat !== "siswa" || !rawUser || rawUser === "sbd" || rawUser === "tamu") {
        if (stat === "admin") {
            return alert("ℹ️ Fitur 'Nilai Saya' dikhususkan untuk akun Siswa. Sebagai Guru/Admin, silakan buka menu '📊 Rekap Nilai' atau '📁 Administrasi ➔ Ledger' untuk melihat seluruh nilai siswa.");
        }
        alert("🔒 Silakan LOGIN menggunakan akun Siswa Anda terlebih dahulu untuk melihat riwayat nilai ujian Anda!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    window.bukaModal("modal-nilai-saya");
    window.muatDaftarUjianNilaiSaya(false);
};

window.muatDaftarUjianNilaiSaya = function(forceRefresh) {
    let akun = window.ambilAkunSiswaAktifUjian();
    let subEl = document.getElementById("subtitle-nilai-saya");
    let selPaket = document.getElementById("select-nilai-saya-paket");
    let boxBaris = document.getElementById("box-baris-nilai-saya");
    let areaDetail = document.getElementById("area-detail-nilai-saya");

    if (boxBaris) boxBaris.style.display = "none";
    if (areaDetail) {
        areaDetail.style.display = "none";
        areaDetail.innerHTML = "";
    }

    if (!akun || !akun.kelas || !akun.namaLengkap) {
        if (subEl) subEl.innerText = "⏳ Menyinkronkan profil akun siswa...";
        if (typeof window.muatDataAkunSiswaSekali === "function") {
            window.muatDataAkunSiswaSekali(false);
        }
        setTimeout(function() {
            let retryAkun = window.ambilAkunSiswaAktifUjian();
            if (retryAkun && retryAkun.kelas && retryAkun.namaLengkap) {
                window.muatDaftarUjianNilaiSaya(forceRefresh);
            } else if (subEl) {
                subEl.innerText = "⚠️ Profil kelas siswa belum ditemukan.";
            }
        }, 700);
        return;
    }

    let namaResmi = akun.namaLengkap;
    let kelasResmi = akun.kelas;
    if (subEl) {
        subEl.innerText = "🔒 Akun Terkunci: " + namaResmi + " (" + kelasResmi + ")";
    }

    if (selPaket) {
        selPaket.innerHTML = '<option value="">⏳ Memeriksa riwayat ujian Anda...</option>';
    }

    let guruAktif = window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika";
    let basePath = "data_guru/" + guruAktif;
    let safeKelas = window.sanitasiKeyRekapFirebase(kelasResmi);
    let safeNamaTarget = window.sanitasiKeyRekapFirebase(namaResmi).toLowerCase();
    let trimNamaTarget = String(namaResmi).trim().toLowerCase();

    if (typeof window.bacaKeysShallowRestFirebase !== "function") return;

    // 1. Cek daftar paket ujian di kelas siswa menggunakan ?shallow=true (~0.1 KB)
    window.bacaKeysShallowRestFirebase(basePath + "/admin_rekap_nilai/" + safeKelas, function(paketKeysObj) {
        let semuaPaketKey = paketKeysObj ? Object.keys(paketKeysObj).sort() : [];
        if (semuaPaketKey.length === 0) {
            if (selPaket) selPaket.innerHTML = '<option value="">-- Belum Ada Riwayat Ujian yang Diikuti --</option>';
            return;
        }

        window._cachePaketNilaiSayaMap = {};
        let ditemukanList = [];
        let sisaCek = semuaPaketKey.length;

        semuaPaketKey.forEach(function(pktKey) {
            // 2. Cek apakah nama siswa ini ada di dalam paket tersebut secara shallow (~0.2 KB)
            window.bacaKeysShallowRestFirebase(basePath + "/admin_rekap_nilai/" + safeKelas + "/" + pktKey, function(siswaKeysObj) {
                if (siswaKeysObj) {
                    let matchedSiswaKey = Object.keys(siswaKeysObj).find(function(sKey) {
                        let sLow = String(sKey).trim().toLowerCase();
                        let sSafe = window.sanitasiKeyRekapFirebase(sKey).toLowerCase();
                        return sLow === trimNamaTarget || sSafe === safeNamaTarget;
                    });
                    if (matchedSiswaKey) {
                        window._cachePaketNilaiSayaMap[pktKey] = {
                            safeKelas: safeKelas,
                            safePaket: pktKey,
                            siswaKey: matchedSiswaKey,
                            namaResmi: namaResmi,
                            kelasResmi: kelasResmi
                        };
                        ditemukanList.push(pktKey);
                    }
                }
                sisaCek--;
                if (sisaCek <= 0) {
                    ditemukanList.sort();
                    if (ditemukanList.length === 0) {
                        if (selPaket) selPaket.innerHTML = '<option value="">-- Belum Ada Ujian yang Anda Ikuti --</option>';
                    } else {
                        let htmlOpt = '<option value="">-- Pilih Jenis Ujian (' + ditemukanList.length + ' Ujian Diikuti) --</option>';
                        ditemukanList.forEach(function(pKey) {
                            htmlOpt += '<option value="' + pKey.replace(/"/g, '&quot;') + '">🎯 ' + pKey + '</option>';
                        });
                        if (selPaket) selPaket.innerHTML = htmlOpt;
                    }
                }
            }, function() {
                sisaCek--;
            }, { ttlMs: 180000, forceRefresh: Boolean(forceRefresh) });
        });
    }, function() {
        if (selPaket) selPaket.innerHTML = '<option value="">⚠️ Gagal memuat daftar ujian. Klik Segarkan.</option>';
    }, { ttlMs: 180000, forceRefresh: Boolean(forceRefresh) });
};

window.pilihUjianNilaiSaya = function(pktKey) {
    let boxBaris = document.getElementById("box-baris-nilai-saya");
    let tbodyBaris = document.getElementById("tbody-nilai-saya-baris");
    let areaDetail = document.getElementById("area-detail-nilai-saya");

    if (areaDetail) {
        areaDetail.style.display = "none";
        areaDetail.innerHTML = "";
    }

    if (!pktKey || !window._cachePaketNilaiSayaMap || !window._cachePaketNilaiSayaMap[pktKey]) {
        if (boxBaris) boxBaris.style.display = "none";
        return;
    }

    let info = window._cachePaketNilaiSayaMap[pktKey];
    let akun = window.ambilAkunSiswaAktifUjian();
    if (!akun || String(akun.namaLengkap).trim().toLowerCase() !== String(info.namaResmi).trim().toLowerCase()) {
        alert("🔒 Akses ditolak: Anda hanya dapat melihat nilai milik akun Anda sendiri.");
        return;
    }

    if (boxBaris) boxBaris.style.display = "block";
    if (tbodyBaris) {
        tbodyBaris.innerHTML = (typeof window.buatHTMLSkeleton === "function")
            ? window.buatHTMLSkeleton("table-row", 6)
            : '<tr><td colspan="6" style="padding:18px; color:#2980b9; font-weight:bold;">⏳ Memuat data nilai ujian Anda...</td></tr>';
    }

    let guruAktif = window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika";
    let pathIndividu = "data_guru/" + guruAktif + "/admin_rekap_nilai/" + info.safeKelas + "/" + info.safePaket + "/" + info.siswaKey;

    // 3. Unduh HANYA 1 objek milik siswa ini saja (~3 KB) & simpan di cache sesi 5 menit
    window.bacaDataRestFirebase(pathIndividu, function(dataRekap) {
        if (!dataRekap) {
            if (tbodyBaris) tbodyBaris.innerHTML = '<tr><td colspan="6" style="padding:18px; color:#e74c3c; font-weight:bold;">Data nilai tidak ditemukan.</td></tr>';
            return;
        }

        // Validasi Keamanan Berlapis: Pastikan nama pada data cocok dengan akun yang sedang login
        let namaRecord = String(dataRekap.namaAsli || info.siswaKey || "").trim().toLowerCase();
        let namaAkun = String(akun.namaLengkap || "").trim().toLowerCase();
        if (namaRecord !== namaAkun && window.sanitasiKeyRekapFirebase(namaRecord) !== window.sanitasiKeyRekapFirebase(namaAkun)) {
            if (tbodyBaris) tbodyBaris.innerHTML = '<tr><td colspan="6" style="padding:18px; color:#e74c3c; font-weight:bold;">🔒 Akses Ditolak: Data tidak sesuai dengan identitas akun Anda.</td></tr>';
            return;
        }

        window._dataAktifNilaiSaya = dataRekap;

        let dDateObj = dataRekap.waktuKumpul ? new Date(dataRekap.waktuKumpul) : null;
        let waktuStr = (dDateObj && !isNaN(dDateObj.getTime()))
            ? (String(dDateObj.getDate()).padStart(2, '0') + '/' + String(dDateObj.getMonth() + 1).padStart(2, '0') + '/' + dDateObj.getFullYear() + ' ' + String(dDateObj.getHours()).padStart(2, '0') + ':' + String(dDateObj.getMinutes()).padStart(2, '0'))
            : (dataRekap.waktuKumpul || "-");

        let nilaiAkhir = dataRekap.nilaiAkhir !== undefined ? Number(dataRekap.nilaiAkhir).toFixed(1) : "-";
        let kkm = (typeof window.dapatkanKKMKelas === "function") ? window.dapatkanKKMKelas(info.kelasResmi) : 75;
        let warnaNilai = (parseFloat(nilaiAkhir) >= kkm) ? "#16a085" : "#c0392b";

        if (tbodyBaris) {
            tbodyBaris.innerHTML =
                '<tr style="background:#ffffff;">' +
                    '<td style="text-align:left; font-weight:800; color:#1e293b;">👤 ' + (dataRekap.namaAsli || info.namaResmi) + '</td>' +
                    '<td style="font-weight:bold; color:#2980b9;">' + (dataRekap.kelasAsli || info.kelasResmi) + '</td>' +
                    '<td style="font-weight:bold; color:#8e44ad;">' + (dataRekap.paketAsli || info.safePaket) + '</td>' +
                    '<td style="font-size:12px; color:#64748b; font-weight:600;">' + waktuStr + '</td>' +
                    '<td style="font-size:20px; font-weight:900; color:' + warnaNilai + ';">' + nilaiAkhir + '</td>' +
                    '<td>' +
                        '<button type="button" class="btn-action" style="background:#0b3954; width:auto; padding:6px 14px; font-size:12px; border-radius:20px;" onclick="window.bukaDetailNilaiSaya()">🔍 Lihat Detail</button>' +
                    '</td>' +
                '</tr>';
        }
    }, function() {
        if (tbodyBaris) tbodyBaris.innerHTML = '<tr><td colspan="6" style="padding:18px; color:#e74c3c; font-weight:bold;">Gagal mengambil data nilai. Periksa koneksi internet Anda.</td></tr>';
    }, { ttlMs: 300000 });
};

window.bukaDetailNilaiSaya = function() {
    let d = window._dataAktifNilaiSaya;
    let area = document.getElementById("area-detail-nilai-saya");
    if (!d || !area) return;

    let rawDetail = d.detail || d.rincian || [];
    let detailArr = Array.isArray(rawDetail) ? rawDetail.slice() : Object.values(rawDetail);

    if (detailArr.length === 0) {
        area.style.display = "flex";
        area.innerHTML = '<div style="background:white; padding:20px; border-radius:10px; border:1px solid #cbd5e1; text-align:center; color:#7f8c8d; font-weight:bold;">Nilai ujian ini diinput secara manual oleh Guru sehingga tidak memiliki rincian butir soal.</div>';
        return;
    }

    detailArr.sort(function(a, b) { return (Number(a.nomor) || 0) - (Number(b.nomor) || 0); });

    // 1. HITUNG REKAP NILAI PER JENIS SOAL (PG, PGK, IS, ESSAY)
    let statTipe = {
        PG:    { label: "Pilihan Ganda (PG)", jml: 0, benar: 0, poin: 0, max: 0, warna: "#2980b9", bg: "#ebf5fb" },
        PGK:   { label: "PG Kompleks (PGK)",  jml: 0, benar: 0, poin: 0, max: 0, warna: "#8e44ad", bg: "#f5eef8" },
        IS:    { label: "Isian Singkat (IS)", jml: 0, benar: 0, poin: 0, max: 0, warna: "#d35400", bg: "#fef9e7" },
        Essay: { label: "Uraian / Essay",     jml: 0, benar: 0, poin: 0, max: 0, warna: "#16a085", bg: "#e8f8f5" }
    };

    let pgItems = [];
    let isItems = [];

    detailArr.forEach(function(item, idx) {
        let rawT = String(item.tipe || item.type || "PG").toUpperCase();
        let kat = "PG";
        if (rawT === "PGK") kat = "PGK";
        else if (rawT === "IS" || rawT === "ISIAN" || rawT === "SHORT_ANSWER") kat = "IS";
        else if (rawT === "ESSAY" || rawT === "ESAI" || rawT === "URAIAN") kat = "Essay";

        let pDidapat = Number(item.poinDidapat !== undefined ? item.poinDidapat : (item.poin || 0)) || 0;
        let pMax = Number(item.maxPoin) || (100 / detailArr.length);
        let isBenar = pDidapat > 0 || item.status === "Benar" || item.status === "Benar Sempurna";

        statTipe[kat].jml++;
        if (isBenar) statTipe[kat].benar++;
        statTipe[kat].poin += pDidapat;
        statTipe[kat].max += pMax;

        if (kat === "PG" || kat === "PGK") {
            pgItems.push({ idxAsli: idx + 1, item: item, isBenar: isBenar ? 1 : 0 });
        } else {
            isItems.push({ idxAsli: idx + 1, item: item, isBenar: isBenar ? 1 : 0 });
        }
    });

    let htmlRekapTipe = '<div style="background:white; padding:16px; border-radius:10px; border:1px solid #cbd5e1;">' +
        '<h4 style="margin:0 0 12px 0; color:#0b3954; font-size:14px;">📌 1. Rincian Nilai Per Jenis Soal</h4>' +
        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(190px, 1fr)); gap:10px;">';

    Object.keys(statTipe).forEach(function(k) {
        let st = statTipe[k];
        if (st.jml === 0) return;
        htmlRekapTipe +=
            '<div style="background:' + st.bg + '; border:1px solid ' + st.warna + '; border-left:4px solid ' + st.warna + '; padding:10px 12px; border-radius:8px;">' +
                '<div style="font-size:11px; font-weight:800; color:' + st.warna + ';">' + st.label + '</div>' +
                '<div style="font-size:18px; font-weight:900; color:#1e293b; margin:4px 0;">' + st.poin.toFixed(1) + ' <span style="font-size:12px; font-weight:normal; color:#64748b;">/ ' + st.max.toFixed(1) + ' pt</span></div>' +
                '<div style="font-size:11px; color:#334155; font-weight:bold;">✅ terjawab benar: ' + st.benar + ' dari ' + st.jml + ' soal</div>' +
            '</div>';
    });
    htmlRekapTipe += '</div></div>';

    // 2. TABEL SPREADSHEET RINGKASAN JAWABAN, KUNCI, & SKALA 0-1 (PERSIS SPREADSHEET GURU)
    let pgCount = pgItems.length;
    let isCount = isItems.length;
    let gabunganItems = pgItems.concat(isItems);

    let htmlSpreadsheet =
        '<div style="background:white; padding:16px; border-radius:10px; border:1px solid #cbd5e1; overflow-x:auto;">' +
            '<h4 style="margin:0 0 10px 0; color:#0b3954; font-size:14px;">📊 2. Tabel Spreadsheet Jawaban, Kunci, & Skor (Benar = 1, Salah = 0)</h4>' +
            '<table class="excel-table" style="width:max-content; min-width:100%; text-align:center;">' +
                '<thead>' +
                    '<tr>' +
                        '<th rowspan="2" style="background:#2c3e50; color:white; min-width:150px; text-align:left;">Komponen</th>' +
                        (pgCount > 0 ? '<th colspan="' + pgCount + '" style="background:#34495e; color:white;">Pilihan Ganda / PGK</th>' : '') +
                        (isCount > 0 ? '<th colspan="' + isCount + '" style="background:#8e44ad; color:white;">Isian / Essay</th>' : '') +
                        '<th rowspan="2" style="background:#2c3e50; color:white; width:90px;">Total Nilai</th>' +
                    '</tr>' +
                    '<tr>';

    for (let i = 1; i <= pgCount; i++) {
        htmlSpreadsheet += '<th style="background:#bdc3c7; color:#2c3e50; min-width:32px; font-size:11px;">' + i + '</th>';
    }
    for (let i = 1; i <= isCount; i++) {
        htmlSpreadsheet += '<th style="background:#d2b4de; color:#4a235a; min-width:55px; font-size:11px;">' + i + '</th>';
    }
    htmlSpreadsheet += '</tr></thead><tbody>';

    // Baris 1: Kunci Jawaban
    htmlSpreadsheet += '<tr style="background:#fef9e7;"><td style="text-align:left; font-weight:900; color:#d35400;">🔑 KUNCI JAWABAN</td>';
    gabunganItems.forEach(function(entry) {
        let rawK = entry.item.kunci || [];
        let kStr = Array.isArray(rawK) ? rawK.join(", ") : String(rawK || "-");
        let shortK = kStr.length > 14 ? (kStr.substring(0, 14) + "...") : kStr;
        htmlSpreadsheet += '<td style="font-weight:800; color:#d35400; font-size:12px;" title="' + kStr.replace(/"/g, '&quot;') + '">' + shortK + '</td>';
    });
    htmlSpreadsheet += '<td style="font-weight:900; color:#d35400;">100</td></tr>';

    // Baris 2: Jawaban Siswa
    htmlSpreadsheet += '<tr style="background:#ffffff;"><td style="text-align:left; font-weight:800; color:#1e293b;">✍️ JAWABAN SAYA</td>';
    gabunganItems.forEach(function(entry) {
        let rawJ = entry.item.jawabSiswa !== undefined ? entry.item.jawabSiswa : (entry.item.jawabanSiswa || "-");
        let jStr = Array.isArray(rawJ) ? rawJ.join(", ") : String(rawJ || "-");
        let shortJ = jStr.length > 14 ? (jStr.substring(0, 14) + "...") : jStr;
        htmlSpreadsheet += '<td style="font-weight:bold; color:#334155; font-size:12px;" title="' + jStr.replace(/"/g, '&quot;') + '">' + shortJ + '</td>';
    });
    htmlSpreadsheet += '<td style="font-weight:900; color:#0b3954;">' + (d.nilaiAkhir !== undefined ? Number(d.nilaiAkhir).toFixed(1) : "-") + '</td></tr>';

    // Baris 3: Analisis Skala 0 - 1
    htmlSpreadsheet += '<tr style="background:#f8fafc;"><td style="text-align:left; font-weight:800; color:#16a085;">📊 SKOR ANALISIS (0/1)</td>';
    gabunganItems.forEach(function(entry) {
        let bg = entry.isBenar ? "#d4edda" : "#f8d7da";
        let col = entry.isBenar ? "#155724" : "#721c24";
        htmlSpreadsheet += '<td style="background:' + bg + '; color:' + col + '; font-weight:900; font-size:13px;">' + entry.isBenar + '</td>';
    });
    htmlSpreadsheet += '<td style="font-weight:900; color:#16a085;">' + (d.nilaiAkhir !== undefined ? Number(d.nilaiAkhir).toFixed(1) : "-") + '</td></tr>';
    htmlSpreadsheet += '</tbody></table></div>';

    // 3. DAFTAR LENGKAP SOAL, JAWABAN SISWA, KUNCI JAWABAN, & PEMBAHASAN
    let htmlButirSoal = '<div style="display:flex; flex-direction:column; gap:12px;">' +
        '<h4 style="margin:0; color:#0b3954; font-size:14px;">📖 3. Detail Soal, Jawaban Anda, Kunci Jawaban, & Pembahasan</h4>';

    detailArr.forEach(function(h, idx) {
        let pDidapat = Number(h.poinDidapat !== undefined ? h.poinDidapat : (h.poin || 0)) || 0;
        let pMax = Number(h.maxPoin) || (100 / detailArr.length);
        let isBenar = pDidapat > 0 || h.status === "Benar" || h.status === "Benar Sempurna";
        let borderCol = isBenar ? "#27ae60" : (h.status === "Menunggu Guru" ? "#f39c12" : "#e74c3c");
        let badgeStatus = isBenar
            ? '<span style="background:#d4edda; color:#155724; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:800;">✅ Benar (+' + pDidapat.toFixed(2) + ' / ' + pMax.toFixed(2) + ' pt)</span>'
            : (h.status === "Menunggu Guru"
                ? '<span style="background:#fef9e7; color:#d35400; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:800;">⏳ Menunggu Koreksi Guru (Maks: ' + pMax.toFixed(2) + ' pt)</span>'
                : '<span style="background:#f8d7da; color:#721c24; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:800;">❌ Salah (0 / ' + pMax.toFixed(2) + ' pt)</span>');

        let rawJwb = h.jawabSiswa !== undefined ? h.jawabSiswa : (h.jawabanSiswa || "-");
        let strJwb = Array.isArray(rawJwb) ? rawJwb.join(", ") : String(rawJwb || "-");
        let rawKunci = h.kunci || [];
        let strKunci = Array.isArray(rawKunci) ? rawKunci.join(" | ") : String(rawKunci || "-");

        htmlButirSoal +=
            '<div style="background:white; border:1px solid #cbd5e1; border-left:5px solid ' + borderCol + '; border-radius:10px; padding:14px 16px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">' +
                '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-bottom:1px solid #f1f5f9; padding-bottom:8px; margin-bottom:10px;">' +
                    '<span style="font-weight:800; color:#0b3954; font-size:13px;">Soal Nomor ' + (h.nomor || (idx + 1)) + ' <span style="background:#eef2f7; color:#475569; padding:2px 8px; border-radius:6px; font-size:11px; margin-left:6px;">Tipe: ' + (h.tipe || h.type || "PG") + '</span></span>' +
                    badgeStatus +
                '</div>' +
                '<div style="font-size:14px; color:#1e293b; line-height:1.5; margin-bottom:12px; font-weight:600;">' + (h.soal || "-") + '</div>' +
                '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin-bottom:10px;">' +
                    '<div style="background:' + (isBenar ? "#f0fdf4" : "#fef2f2") + '; border:1px solid ' + (isBenar ? "#bbf7d0" : "#fecaca") + '; padding:10px 12px; border-radius:8px;">' +
                        '<div style="font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:3px;">Jawaban Anda</div>' +
                        '<div style="font-size:14px; font-weight:800; color:' + (isBenar ? "#15803d" : "#b91c1c") + ';">' + strJwb + '</div>' +
                    '</div>' +
                    '<div style="background:#fef9e7; border:1px solid #fde68a; padding:10px 12px; border-radius:8px;">' +
                        '<div style="font-size:10px; font-weight:800; color:#b45309; text-transform:uppercase; margin-bottom:3px;">🔑 Kunci Jawaban</div>' +
                        '<div style="font-size:14px; font-weight:800; color:#92400e;">' + strKunci + '</div>' +
                    '</div>' +
                '</div>' +
                '<div style="background:#f8fafc; border-left:3px solid #3498db; padding:8px 12px; border-radius:6px; font-size:12px; color:#334155;">' +
                    '<strong style="color:#2980b9;">💡 Pembahasan:</strong> ' + (h.pembahasan || "Tidak ada pembahasan.") +
                '</div>' +
            '</div>';
    });
    htmlButirSoal += '</div>';

    area.style.display = "flex";
    area.innerHTML = htmlRekapTipe + htmlSpreadsheet + htmlButirSoal;
    area.scrollIntoView({ behavior: "smooth", block: "start" });
};