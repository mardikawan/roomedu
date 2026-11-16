/* =========================================================================
   MODUL GERBANG UJIAN, RUANG UJIAN KETAT (ANTI-CHEAT & WAKE LOCK),
   NAVIGASI CBT MELAYANG, REKAP NILAI, SPREADSHEET, OCR LJK, & KOREKSI MANUAL
   ========================================================================= */

window.adminRekapNilaiData = window.adminRekapNilaiData || {};
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
    let isTouchDevice = (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isTouchDevice) return;

    let elem = document.documentElement;
    try {
        if (elem.requestFullscreen) elem.requestFullscreen().catch(function() {});
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
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

    let safePaketLM = (typeof window.sanitasiKeyRekapFirebase === "function") ? window.sanitasiKeyRekapFirebase(namaPaket) : namaPaket;
    let safeKelasLM = (typeof window.sanitasiKeyRekapFirebase === "function") ? window.sanitasiKeyRekapFirebase(kelas) : kelas;
    let safeNamaLM = (typeof window.sanitasiKeyRekapFirebase === "function") ? window.sanitasiKeyRekapFirebase(namaLengkap) : namaLengkap;

    if (isRemedialExam && typeof window.ambilObjekRekapPaket === "function" && typeof window.ambilDataSiswaDiObjekRekap === "function") {
        let rekapPaketCek = window.ambilObjekRekapPaket(kelas, namaPaket);
        let dataNilaiLama = window.ambilDataSiswaDiObjekRekap(rekapPaketCek, namaLengkap);
        let targetKkmCek = maxScoreRemedial || (typeof window.dapatkanKKMKelas === "function" ? window.dapatkanKKMKelas(kelas) : 75);
        if (dataNilaiLama && dataNilaiLama.nilaiAkhir !== undefined && parseFloat(dataNilaiLama.nilaiAkhir) >= targetKkmCek) {
            return alert("✅ Nilai Anda pada evaluasi \"" + namaPaket + "\" sudah mencapai batas KKM (" + dataNilaiLama.nilaiAkhir + "). Anda tidak perlu mengikuti ujian remedial ini.");
        }
    }

    let monitorPaketObj = (window.adminLiveMonitorData && (window.adminLiveMonitorData[namaPaket] || window.adminLiveMonitorData[safePaketLM])) || null;
    let monitorKelasObj = monitorPaketObj ? (monitorPaketObj[kelas] || monitorPaketObj[safeKelasLM]) : null;
    let dataMonitorSiswa = monitorKelasObj ? (monitorKelasObj[namaLengkap] || monitorKelasObj[safeNamaLM]) : null;

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

    window.ujianEntryShieldUntil = Date.now() + 3500;
    window.graceOrientationTime = Date.now() + 3500;
    window.graceKeyboardTime = Date.now() + 3500;
    window.graceZoomTime = Date.now() + 3500;

    if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
    }
    window.aktifkanFullscreenUjian();

    window.sesiUjianSiswa = {
        kelas: kelas,
        nama: namaLengkap,
        kode: kode,
        paket: namaPaket,
        durasi: Number(ujianAktif.durasi) || 90,
        soal: soalDisiapkan,
        bobot: paketData.bobot || { PG: 100 / soalDisiapkan.length, PGK: 0, IS: 0, Essay: 0 },
        jawaban: {},
        isResumeMode: isResumeMode,
        prevPelanggaran: prevPelanggaran,
        isRemedial: isRemedialExam,
        maxScore: maxScoreRemedial
    };

    window.tutupModal('modal-enter-ujian');
    window.bukaRuangUjianStrict();
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
            sisaDetik: window.sisaDetikUjian || (window.sesiUjianSiswa.durasi * 60)
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
        let prevLokalViolation = Math.max(Number(dataLokal.violationCount) || 0, Number(pkt.prevPelanggaran) || 0);
        window.violationCount = pkt.isResumeMode ? (prevLokalViolation + 1) : prevLokalViolation;
        window.sisaDetikUjian = dataLokal.sisaDetik || (pkt.durasi * 60);
    } else {
        window.sesiUjianSiswa.jawaban = {};
        window.violationCount = pkt.isResumeMode ? ((Number(pkt.prevPelanggaran) || 0) + 1) : (Number(pkt.prevPelanggaran) || 0);
        window.sisaDetikUjian = pkt.durasi * 60;
    }
    window.simpanCadanganLokalUjian();

    if (window.violationCount >= 5 && !isAdmin) {
        window.isStrictUjianActive = false;
        window.alertAmanUjian("❌ AKSES DIBLOKIR!\n\nTotal pelanggaran Anda telah mencapai batas maksimal (5x).\n\nUjian dihentikan paksa dan hasil Anda akan otomatis dikumpulkan!");
        window.kumpulkanUjianSiswa(true, true);
        return;
    }

    window.isPenaltyActive = false;
    clearInterval(window.penaltyInterval);
    window.penaltyInterval = null;

    // Pastikan tirai privasi terbuka penuh sebelum soal digambar
    window.setTiraiPrivasiUjian(false);
    window.renderSoalUjianSiswa();
    window.mulaiTimerUjian();

    window.lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    window.initUjianWidth = window.innerWidth;
    window.initUjianHeight = window.innerHeight;
    window.ujianEntryShieldUntil = Date.now() + 3500;
    window.graceOrientationTime = Date.now() + 3500;
    window.graceKeyboardTime = Date.now() + 2500;
    window.graceZoomTime = Date.now() + 2500;
    window.isStrictUjianActive = true;

    window.aktifkanWakeLockUjian();
    window.pasangWatermarkIdentitasUjian();
    window.history.pushState({ inExam: true }, null, window.location.href);

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

        // 2. Pengecekan Kehilangan Fokus (Membuka Floating App / Jendela Lain)
        if (Date.now() > (window.ujianEntryShieldUntil || 0) && !window.apakahTransisiKeyboardAktif() && !window.apakahTransisiZoomAktif()) {
            if (!document.hasFocus()) {
                window.triggerPelanggaran("Fokus layar berpindah ke aplikasi mengambang atau ke luar ruang ujian!");
                return;
            }
        }

        // 3. Pengecekan Split-Screen
        let statusLayar = window.cekKondisiLayarPenuhDanBersih();
        if (!statusLayar.aman) {
            window.triggerPelanggaran(statusLayar.alasan);
        } else {
            window.setTiraiPrivasiUjian(false);
        }
    }, 1200);

    if (typeof window.simpanStatusLiveMonitorKeDB === "function") {
        if (typeof window.modeHematServerUjian === "function") window.modeHematServerUjian(false);
        window.simpanStatusLiveMonitorKeDB(pkt.paket, pkt.kelas, pkt.nama, {
            kelas: pkt.kelas,
            nama: pkt.nama,
            paket: pkt.paket,
            status: "Sedang Mengerjakan",
            pelanggaran: window.violationCount || 0,
            waktuUpdate: new Date().toISOString()
        });
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

    if (tipe === 'latihan') {
        let key = sesi.paketKey;
        if (key && window.adminBankLatihanData && window.adminBankLatihanData[key]) {
            window.adminBankLatihanData[key].soal = sesi.soal;
            if (typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
        }
    } else {
        let key = sesi.paket;
        if (key && window.adminBankUjianData && window.adminBankUjianData[key]) {
            window.adminBankUjianData[key].soal = sesi.soal;
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
            html += '<input type="text" class="input-box" value="' + valLama + '" placeholder="Ketik jawaban Anda..." style="font-size:15px; font-weight:600; border:2px solid #3498db; width:100%; box-sizing:border-box;" oninput="window.simpanJawabanUjian(' + idx + ', this.value, \'' + q.type + '\', this)">';
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

    clearInterval(window.timerIntervalUjian);
    window.timerIntervalUjian = setInterval(function() {
        window.sisaDetikUjian--;
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
            btnKumpul.innerText = "⏳ Mengirim Nilai & Jawaban ke Server...";
        }

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
            detail: hasilDetail,
            rincian: hasilDetail
        };

        if (!window.adminRekapNilaiData) window.adminRekapNilaiData = {};
        if (!window.adminRekapNilaiData[safeKelas]) window.adminRekapNilaiData[safeKelas] = {};
        if (!window.adminRekapNilaiData[safeKelas][safePaket]) window.adminRekapNilaiData[safeKelas][safePaket] = {};
        window.adminRekapNilaiData[safeKelas][safePaket][safeNama] = payloadRekap;

        function selesaikanKeluarRuangUjian() {
            try {
                if (sessionStorage.getItem("statusLogin") === "siswa" && typeof window.tambahXPSiswa === "function" && totalXPUjian > 0) {
                    window.tambahXPSiswa(totalXPUjian, "ujian", soalBenarUjian);
                }
            } catch (xpErr) {
                console.warn("Isolasi XP:", xpErr);
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

            if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
                window.kirimNilaiUjianAmanKeDB(pathRekap, payloadRekap, function() {
                    selesaikanKeluarRuangUjian();
                }, function() {
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

// 1. Pelacak Transisi Keyboard Virtual (Memberi jeda 1.5 detik saat animasi buka/tutup keyboard)
document.addEventListener('focusin', function(e) {
    let t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) {
        window.graceKeyboardTime = Date.now() + 1500;
        clearTimeout(window.blurCheckTimer);
    }
}, true);

document.addEventListener('focusout', function(e) {
    let t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) {
        window.graceKeyboardTime = Date.now() + 1500;
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
        window.graceKeyboardTime = Date.now() + 1500;
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
            window.graceKeyboardTime = Date.now() + 1500;
        }
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'AudioVolumeUp' || e.key === 'AudioVolumeDown' || e.key === 'AudioVolumeMute' || e.keyCode === 174 || e.keyCode === 175 || e.keyCode === 173) {
        return;
    }

    if (window.isStrictUjianActive && sessionStorage.getItem("statusLogin") !== "admin") {
        let keyUpper = (e.key || '').toUpperCase();

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
    if (now - window.lastViolationTime < 1500) return;
    window.lastViolationTime = now;

    window.violationCount++;
    window.simpanCadanganLokalUjian();
    clearInterval(window.penaltyInterval);

    if (typeof window.simpanStatusLiveMonitorKeDB === "function" && window.sesiUjianSiswa) {
        let pkt = window.sesiUjianSiswa;
        if (typeof window.modeHematServerUjian === "function") window.modeHematServerUjian(false);
        window.simpanStatusLiveMonitorKeDB(pkt.paket, pkt.kelas, pkt.nama, {
            kelas: pkt.kelas,
            nama: pkt.nama,
            paket: pkt.paket,
            status: window.violationCount >= 5 ? "Dikeluarkan" : "Sedang Mengerjakan",
            pelanggaran: window.violationCount,
            waktuUpdate: new Date().toISOString()
        });
        if (window.violationCount < 5) {
            setTimeout(function() {
                if (window.isStrictUjianActive && typeof window.modeHematServerUjian === "function") {
                    window.modeHematServerUjian(true);
                }
            }, 3000);
        }
    }

    let overlay = document.getElementById('strict-warning-overlay');
    let info = document.getElementById('strict-warning-info');
    let countdownEl = document.getElementById('strict-countdown');

    if (window.violationCount === 1) window.penaltyWaitTime = 600;
    else if (window.violationCount === 2) window.penaltyWaitTime = 1000;
    else if (window.violationCount === 3) window.penaltyWaitTime = 2000;
    else if (window.violationCount === 4) window.penaltyWaitTime = 3000;
    else if (window.violationCount >= 5) {
        if (overlay) overlay.style.display = 'none';
        window.isPenaltyActive = false;
        window.isStrictUjianActive = false;
        window.setTiraiPrivasiUjian(false);
        window.alertAmanUjian("❌ PELANGGARAN MAKSIMAL (5x)!\n\nSistem mendeteksi aktivitas mencurigakan berulang kali. Ujian dihentikan paksa dan hasil pekerjaan Anda telah dikirim ke Rekap Nilai Guru!");
        window.kumpulkanUjianSiswa(true, true);
        return;
    }

    window.isPenaltyActive = true;
    window.setTiraiPrivasiUjian(true);
    if (overlay) overlay.style.display = 'flex';

    let teksAlasan = alasanKhusus ? ' (' + alasanKhusus + ')' : '';
    if (info) info.innerText = 'Pelanggaran ke-' + window.violationCount + '/5!' + teksAlasan + ' ' + (window.violationCount === 4 ? '(PERINGATAN TERAKHIR!)' : '');
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

// 4. DETEKSI KEHILANGAN FOKUS (Floating App, App Switcher, Control Center, Pindah Jendela)
window.addEventListener("blur", function() {
    if (!window.isStrictUjianActive || window.sedangDialogSistem) return;
    if (Date.now() < (window.ujianEntryShieldUntil || 0)) return;

    clearTimeout(window.blurCheckTimer);
    window.blurCheckTimer = setTimeout(function() {
        if (!window.isStrictUjianActive || window.sedangDialogSistem) return;

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

        if (!document.hasFocus()) {
            window.triggerPelanggaran("Fokus layar berpindah ke luar ruang ujian (Membuka Aplikasi Mengambang / Panel Sistem)!");
        }
    }, 850);
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
window.toggleCbtNav = function() {
    let drawer = document.getElementById('cbt-nav-drawer');
    if (drawer) drawer.classList.toggle('show-nav');
};

window.renderCbtNavigation = function(total, tipe) {
    let grid = document.getElementById('cbt-nav-grid');
    let btn = document.getElementById('btn-toggle-cbt-nav');
    if (!grid || !btn) return;

    let html = '';
    for (let i = 0; i < total; i++) {
        let prefix = tipe === 'ujian' ? 'soal-ujian-' : 'card-latihan-';
        html += '<button class="quiz-nav-btn" id="nav-cbt-' + i + '" onclick="document.getElementById(\'' + prefix + i + '\').scrollIntoView({behavior:\'smooth\', block:\'center\'}); window.toggleCbtNav();">' + (i + 1) + '</button>';
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
    let paketSet = new Set();

    if (window.adminRekapNilaiData && window.adminRekapNilaiData[namaKelas]) {
        Object.keys(window.adminRekapNilaiData[namaKelas]).forEach(function(p) {
            if (Object.keys(window.adminRekapNilaiData[namaKelas][p] || {}).length > 0) {
                paketSet.add(p);
            }
        });
    }

    if (window.adminLiveMonitorData) {
        Object.keys(window.adminLiveMonitorData).forEach(function(p) {
            if (window.adminLiveMonitorData[p] && window.adminLiveMonitorData[p][namaKelas] && Object.keys(window.adminLiveMonitorData[p][namaKelas]).length > 0) {
                paketSet.add(p);
            }
        });
    }

    if (window.adminLedgerMetaData && window.adminLedgerMetaData[namaKelas] && Array.isArray(window.adminLedgerMetaData[namaKelas].kolom)) {
        window.adminLedgerMetaData[namaKelas].kolom.forEach(function(p) {
            if ((window.adminBankUjianData && window.adminBankUjianData[p]) || (window.adminRekapNilaiData[namaKelas] && window.adminRekapNilaiData[namaKelas][p])) {
                paketSet.add(p);
            }
        });
    }

    return Array.from(paketSet).sort();
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

    let rekapKls = (typeof window.ambilObjekRekapKelas === "function") ? window.ambilObjekRekapKelas(kls) : (window.adminRekapNilaiData[kls] || {});
    let daftarPaketKelas = Object.keys(rekapKls);

    selPaket.disabled = false;

    if (daftarPaketKelas.length === 0) {
        selPaket.innerHTML = '<option value="">-- Belum Ada Ujian di Kelas Ini --</option>';
        window.renderRekapNilai();
        return;
    }

    let htmlP = '<option value="">-- History Semua Ujian (' + daftarPaketKelas.length + ' Ujian) --</option>';
    daftarPaketKelas.forEach(function(p) {
        let sampel = Object.values(rekapKls[p] || {})[0];
        let labelPkt = (sampel && sampel.paketAsli) ? sampel.paketAsli : p;
        let isSel = (p === prevPaket || labelPkt === prevPaket) ? 'selected' : '';
        htmlP += '<option value="' + p.replace(/"/g, '&quot;') + '" ' + isSel + '>' + labelPkt + '</option>';
    });
    selPaket.innerHTML = htmlP;

    if (!daftarPaketKelas.includes(prevPaket) && !isFromInit && prevPaket !== "") {
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

        html += '<tr style="border-bottom:1px solid #eee;">' +
            '<td style="color:#7f8c8d; font-weight:bold;">' + (noUrut++) + '</td>' +
            '<td style="text-align:left; font-weight:bold; color:#2c3e50;">' + nama + '</td>' +
            '<td style="font-size:11px; color:#7f8c8d; font-weight:bold;">' + dDate + '</td>' +
            '<td style="display:none;"></td>' +
            '<td>' + badgePelanggaran + '</td>' +
            '<td style="font-size:18px; font-weight:900; color:#16a085;">' + (d.nilaiAkhir !== undefined ? Number(d.nilaiAkhir).toFixed(1) : '-') + '</td>' +
            '<td>' + btnKoreksi + '</td>' +
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
// 6. KOREKSI ESSAY & DETAIL JAWABAN SISWA
// =========================================================================
window.bukaKoreksiUjian = function(btnElement) {
    let k = btnElement.getAttribute('data-k');
    let p = btnElement.getAttribute('data-p');
    let n = btnElement.getAttribute('data-n');
    window.tempKoreksiTarget = { kelas: k, paket: p };
    window.muatDataKoreksi(n);
};

window.gantiSiswaKoreksi = function() {
    let n = document.getElementById('koreksi-select-siswa').value;
    window.muatDataKoreksi(n);
};

window.centangSemuaKoreksi = function() {
    document.querySelectorAll('#koreksi-grid-container input[type="checkbox"][id^="chk-koreksi-"]').forEach(function(chk) {
        chk.checked = true;
    });
    document.querySelectorAll('#koreksi-grid-container input[type="number"][id^="input-koreksi-"]').forEach(function(inp) {
        inp.value = "1.00";
    });
    window.hitungSkorLiveKoreksi();
};

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

    let paketMap = (window.adminRekapNilaiData[t.kelas] && window.adminRekapNilaiData[t.kelas][t.paket]) ? window.adminRekapNilaiData[t.kelas][t.paket] : {};
    let dataSiswa = paketMap[namaSiswa] || (typeof window.ambilDataSiswaDiObjekRekap === "function" ? window.ambilDataSiswaDiObjekRekap(paketMap, namaSiswa) : null);
    if (!dataSiswa) return;

    if (!dataSiswa.detail && dataSiswa.rincian) dataSiswa.detail = dataSiswa.rincian;
    if (!dataSiswa.detail) dataSiswa.detail = [];
    t.nama = namaSiswa; t.data = dataSiswa;

    let sel = document.getElementById('koreksi-select-siswa');
    let allStudents = Object.keys(paketMap).sort();
    let opt = '';
    allStudents.forEach(function(s) {
        let lblSiswa = (paketMap[s] && paketMap[s].namaAsli) ? paketMap[s].namaAsli : s;
        opt += '<option value="' + s + '" ' + (s === namaSiswa ? 'selected' : '') + '>' + lblSiswa + '</option>';
    });
    sel.innerHTML = opt;

    let labelKelasTampil = dataSiswa.kelasAsli || t.kelas;
    let labelPaketTampil = dataSiswa.paketAsli || t.paket;
    let badgePelanggaran = dataSiswa.pelanggaran > 0 ? '<span style="background:#e74c3c; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">⚠️ ' + dataSiswa.pelanggaran + 'x Pelanggaran</span>' : '<span style="background:#27ae60; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">✅ Aman</span>';
    document.getElementById('koreksi-info-badges').innerHTML = '<span style="background:#2980b9; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">' + labelKelasTampil + '</span> <span style="background:#8e44ad; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">' + labelPaketTampil + '</span> ' + badgePelanggaran;

    let grid = document.getElementById('koreksi-grid-container');
    let bankData = (window.adminBankUjianData && (window.adminBankUjianData[t.paket] || window.adminBankUjianData[labelPaketTampil])) || null;
    let maxPoinIS = (bankData && bankData.bobot) ? bankData.bobot.IS : 0;
    let maxPoinEssay = (bankData && bankData.bobot) ? bankData.bobot.Essay : 0;

    let grupBelumBenar = [];
    let grupSudahBenar = [];

    dataSiswa.detail.forEach(function(h, idx) {
        if (h.poinDidapat === undefined && h.poin !== undefined) h.poinDidapat = h.poin;
        if (h.jawabSiswa === undefined && h.jawabanSiswa !== undefined) h.jawabSiswa = h.jawabanSiswa;
        if (h.tipe === 'IS' || h.tipe === 'Essay') {
            let isEssay = h.tipe === 'Essay';
            let defaultMaxP = isEssay ? maxPoinEssay : maxPoinIS;
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : defaultMaxP;
            let fraksiSkor = maxP > 0 ? ((h.poinDidapat || 0) / maxP) : 0;
            let sudahBenar = isEssay ? (fraksiSkor >= 1 && h.status !== 'Menunggu Guru') : ((h.poinDidapat || 0) > 0);

            let uiKoreksiGuru = '';
            if (isEssay) {
                uiKoreksiGuru = '<div style="flex:1; min-width:220px; background:#fdf2e9; border:1px solid #edbb99; border-radius:6px; padding:10px; display:flex; justify-content:space-between; align-items:center;">' +
                    '<div><div style="font-size:10px; font-weight:bold; color:#d35400; margin-bottom:3px; text-transform:uppercase;">Koreksi Essay</div><div style="font-size:11px; color:#ba4a00;">Input fraksi (0.0 - 1.0)</div></div>' +
                    '<input type="number" id="input-koreksi-' + idx + '" step="0.1" min="0" max="1" value="' + fraksiSkor.toFixed(2) + '" style="width:60px; padding:5px; text-align:center; font-weight:bold; border:2px solid #d35400; border-radius:4px; color:#d35400; background:white; font-size:14px;" oninput="window.hitungSkorLiveKoreksi()">' +
                '</div>';
            } else {
                let isChecked = ((h.poinDidapat || 0) > 0) ? 'checked' : '';
                uiKoreksiGuru = '<div style="flex:1; min-width:220px; background:#eafaf1; border:1px solid #a9dfbf; border-radius:6px; padding:10px; display:flex; justify-content:space-between; align-items:center;">' +
                    '<div><div style="font-size:10px; font-weight:bold; color:#27ae60; margin-bottom:3px; text-transform:uppercase;">Koreksi Guru</div><div style="font-size:11px; color:#1e8449;">Klik centang jika benar</div></div>' +
                    '<label style="cursor:pointer; display:flex; align-items:center; gap:8px; background:white; padding:6px 10px; border-radius:6px; border:1px solid #27ae60;">' +
                        '<span style="font-size:12px; font-weight:bold; color:#27ae60;">BENAR</span>' +
                        '<input type="checkbox" id="chk-koreksi-' + idx + '" style="width:20px; height:20px; cursor:pointer; accent-color:#16a085;" onchange="window.hitungSkorLiveKoreksi()" ' + isChecked + '>' +
                    '</label>' +
                '</div>';
            }

            let borderLeftColor = sudahBenar ? '#27ae60' : '#e67e22';
            let cardHTML = '<div style="background:#ffffff; border:1px solid #e1e8ed; border-left:5px solid ' + borderLeftColor + '; border-radius:8px; overflow:hidden; box-shadow:0 2px 4px rgba(0,0,0,0.02);">' +
                '<div style="background:#f8f9fa; padding:8px 15px; border-bottom:1px solid #e1e8ed; display:flex; justify-content:space-between; align-items:center;">' +
                    '<span style="font-weight:bold; color:#2c3e50; font-size:13px;">Soal ' + (idx + 1) + ' <span style="font-size:11px; color:#7f8c8d; font-weight:normal; margin-left:5px;">(' + h.tipe + ')</span></span>' +
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
                        '<strong style="color:#2980b9;">💡 Kunci: ' + (h.kunci || []).join(' | ') + '</strong> <br>' +
                        '<div style="margin-top:4px; line-height:1.4;">' + (h.pembahasan || '') + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

            if (sudahBenar) grupSudahBenar.push(cardHTML);
            else grupBelumBenar.push(cardHTML);
        }
    });

    let finalHTML = '';
    if (grupBelumBenar.length > 0) {
        finalHTML += '<div style="background:#fef9e7; border:1px solid #f9e79f; color:#d35400; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:bold;">🔍 Perlu Diperiksa Manual / Belum Tercentang Benar (' + grupBelumBenar.length + ' Soal)</div>';
        finalHTML += grupBelumBenar.join('');
    }
    if (grupSudahBenar.length > 0) {
        finalHTML += '<div style="background:#eafaf1; border:1px solid #a9dfbf; color:#1e8449; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:bold; margin-top:10px;">✅ Sudah Terdeteksi / Tercentang Benar (' + grupSudahBenar.length + ' Soal)</div>';
        finalHTML += grupSudahBenar.join('');
    }
    if (grupBelumBenar.length === 0 && grupSudahBenar.length === 0) {
        finalHTML = '<div style="text-align:center; padding:30px; color:#7f8c8d; font-weight:bold;">Tidak ada soal Isian Singkat atau Essay pada paket ujian ini.</div>';
    }

    grid.innerHTML = finalHTML;
    window.hitungSkorLiveKoreksi();
    window.bukaModal('modal-koreksi-ujian');
};

window.hitungSkorLiveKoreksi = function() {
    let t = window.tempKoreksiTarget;
    let labelPaketAsli = (t.data && t.data.paketAsli) ? t.data.paketAsli : t.paket;
    let bankData = (window.adminBankUjianData && (window.adminBankUjianData[t.paket] || window.adminBankUjianData[labelPaketAsli])) || null;
    let maxPoinIS = (bankData && bankData.bobot) ? bankData.bobot.IS : 0;
    let maxPoinEssay = (bankData && bankData.bobot) ? bankData.bobot.Essay : 0;

    let total = 0;
    (t.data.detail || []).forEach(function(h, idx) {
        let pAwal = h.poinDidapat !== undefined ? h.poinDidapat : (h.poin || 0);
        if (h.tipe === 'PG' || h.tipe === 'PGK') {
            total += pAwal;
        } else if (h.tipe === 'IS' || h.tipe === 'Isian') {
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : maxPoinIS;
            let chk = document.getElementById('chk-koreksi-' + idx);
            if (chk && chk.checked) total += maxP;
        } else if (h.tipe === 'Essay') {
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : maxPoinEssay;
            let inp = document.getElementById('input-koreksi-' + idx);
            if (inp) {
                let val = parseFloat(inp.value) || 0;
                if (val > 1) val = 1;
                if (val < 0) val = 0;
                total += (val * maxP);
            }
        }
    });

    if (t.data && t.data.isRemedial) {
        let batasKkm = Number(t.data.maxScore) || (typeof window.dapatkanKKMKelas === "function" ? window.dapatkanKKMKelas(t.kelas) : 75);
        if (total > batasKkm) total = batasKkm;
        if (t.data.nilaiSebelumRemedial !== undefined && t.data.nilaiSebelumRemedial !== null && !isNaN(Number(t.data.nilaiSebelumRemedial))) {
            total = Math.max(Number(t.data.nilaiSebelumRemedial), total);
        }
    }

    document.getElementById('koreksi-nilai-live').innerText = total.toFixed(2);
};

window.simpanKoreksiManual = function() {
    let t = window.tempKoreksiTarget;
    let safeKls = window.sanitasiKeyRekapFirebase(t.kelas);
    let safePkt = window.sanitasiKeyRekapFirebase(t.paket);
    let safeNama = window.sanitasiKeyRekapFirebase(t.nama);
    let labelPaketAsli = (t.data && t.data.paketAsli) ? t.data.paketAsli : t.paket;

    let bankData = (window.adminBankUjianData && (window.adminBankUjianData[t.paket] || window.adminBankUjianData[safePkt] || window.adminBankUjianData[labelPaketAsli])) || null;
    let maxPoinIS = (bankData && bankData.bobot) ? bankData.bobot.IS : 0;
    let maxPoinEssay = (bankData && bankData.bobot) ? bankData.bobot.Essay : 0;

    let updateDetail = (t.data.detail || []).slice();
    let totalPoinBaru = 0;
    let xpTambahanSiswa = 0;

    updateDetail.forEach(function(h, idx) {
        let pAwal = h.poinDidapat !== undefined ? h.poinDidapat : (h.poin || 0);
        let wasCorrect = pAwal > 0;

        if (h.tipe === 'PG' || h.tipe === 'PGK') {
            h.poinDidapat = pAwal;
            totalPoinBaru += pAwal;
        } else if (h.tipe === 'IS' || h.tipe === 'Isian' || h.tipe === 'SHORT_ANSWER') {
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : maxPoinIS;
            let chk = document.getElementById('chk-koreksi-' + idx);
            let isChecked = chk ? chk.checked : false;
            h.poinDidapat = isChecked ? maxP : 0;
            h.poin = h.poinDidapat;
            h.maxPoin = maxP;
            h.status = isChecked ? "Benar" : "Salah";
            totalPoinBaru += h.poinDidapat;

            if (!wasCorrect && isChecked) xpTambahanSiswa += window.dapatkanPoinXPPerSoal('IS');
            else if (wasCorrect && !isChecked) xpTambahanSiswa -= window.dapatkanPoinXPPerSoal('IS');

        } else if (h.tipe === 'Essay' || h.tipe === 'ESAI' || h.tipe === 'URAIAN') {
            let maxP = (h.maxPoin !== undefined && Number(h.maxPoin) > 0) ? Number(h.maxPoin) : maxPoinEssay;
            let inp = document.getElementById('input-koreksi-' + idx);
            let val = inp ? parseFloat(inp.value) : 0;
            if (isNaN(val)) val = 0; if (val > 1) val = 1; if (val < 0) val = 0;

            h.poinDidapat = (val * maxP);
            h.poin = h.poinDidapat;
            h.maxPoin = maxP;
            h.status = val === 1 ? "Benar Sempurna" : (val > 0 ? "Benar Parsial" : "Salah");
            totalPoinBaru += h.poinDidapat;

            let isCorrectNow = val > 0;
            if (!wasCorrect && isCorrectNow) xpTambahanSiswa += window.dapatkanPoinXPPerSoal('Essay');
            else if (wasCorrect && !isCorrectNow) xpTambahanSiswa -= window.dapatkanPoinXPPerSoal('Essay');
        }
    });

    if (t.data && t.data.isRemedial) {
        let batasKkm = Number(t.data.maxScore) || (typeof window.dapatkanKKMKelas === "function" ? window.dapatkanKKMKelas(t.kelas) : 75);
        if (totalPoinBaru > batasKkm) totalPoinBaru = batasKkm;
        if (t.data.nilaiSebelumRemedial !== undefined && t.data.nilaiSebelumRemedial !== null && !isNaN(Number(t.data.nilaiSebelumRemedial))) {
            totalPoinBaru = Math.max(Number(t.data.nilaiSebelumRemedial), totalPoinBaru);
        }
    }

    t.data.nilaiAkhir = parseFloat(totalPoinBaru.toFixed(2));
    t.data.xpSudahDiberikan = (t.data.xpSudahDiberikan || 0) + xpTambahanSiswa;
    t.data.detail = updateDetail;
    t.data.rincian = updateDetail;
    t.data.sudahDikoreksi = true;

    if (!window.adminRekapNilaiData[safeKls]) window.adminRekapNilaiData[safeKls] = {};
    if (!window.adminRekapNilaiData[safeKls][safePkt]) window.adminRekapNilaiData[safeKls][safePkt] = {};
    window.adminRekapNilaiData[safeKls][safePkt][safeNama] = t.data;

    if (t.nama !== safeNama && window.adminRekapNilaiData[safeKls][safePkt][t.nama]) {
        delete window.adminRekapNilaiData[safeKls][safePkt][t.nama];
    }

    let pathDB = 'admin_rekap_nilai/' + safeKls + '/' + safePkt + '/' + safeNama;
    if (typeof window.simpanNilaiUjianKeDB === "function") window.simpanNilaiUjianKeDB(pathDB, t.data);

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

    window.muatDataKoreksi(t.nama);
    window.renderRekapNilai();
    if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
    if (typeof window.renderRemedialTabAdmin === "function") window.renderRemedialTabAdmin();
};

// =========================================================================
// 7. OBSERVER MODAL GERBANG UJIAN & REKAP NILAI
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
});