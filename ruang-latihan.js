/* =========================================================================
   MODUL RUANG LATIHAN MANDIRI, JALUR ADAPTIF (C1-C2-HOTS), PANEN XP,
   PRINTER SOAL UNIVERSAL, & 6 MINI-GAMES PENYEGAR OTAK
   ========================================================================= */

// =========================================================================
// 1. GERBANG PILIH TOPIK LATIHAN & DROPDOWN DINAMIS
// =========================================================================
window.renderDropdownLatihan = function() {
    let selKelas = document.getElementById('latihan-select-kelas');
    if (!selKelas) return;

    let prevKelas = selKelas.value;
    let bank = window.adminBankLatihanData || {};
    let kelasSet = new Set();
    Object.values(bank).forEach(function(item) {
        if (item && item.kelas) kelasSet.add(item.kelas);
    });

    let daftarKelas = Array.from(kelasSet).sort();
    if (daftarKelas.length === 0) {
        selKelas.innerHTML = '<option value="">-- Memuat Daftar Kelas... --</option>';
        return;
    }

    let html = '<option value="">-- Pilih Kelas Anda --</option>';
    daftarKelas.forEach(function(k) {
        let sel = (k === prevKelas) ? 'selected' : '';
        html += '<option value="' + k + '" ' + sel + '>' + k + '</option>';
    });
    selKelas.innerHTML = html;

    if (prevKelas && kelasSet.has(prevKelas)) {
        window.updateDropdownLatihanMapel();
    } else {
        document.getElementById('latihan-select-mapel').innerHTML = '<option value="">-- Pilih Kelas Dahulu --</option>';
        document.getElementById('latihan-select-bab').innerHTML = '<option value="">-- Pilih Mapel Dahulu --</option>';
        let selKes = document.getElementById('latihan-select-kesulitan');
        if (selKes) selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
    }
};

window.inisialisasiDropdownLatihanSiswa = window.renderDropdownLatihan;

window.updateDropdownLatihanMapel = function() {
    let kelas = document.getElementById('latihan-select-kelas').value;
    let selMapel = document.getElementById('latihan-select-mapel');
    let selKes = document.getElementById('latihan-select-kesulitan');

    if (!kelas) {
        selMapel.innerHTML = '<option value="">-- Pilih Kelas Dahulu --</option>';
        document.getElementById('latihan-select-bab').innerHTML = '<option value="">-- Pilih Mapel Dahulu --</option>';
        if (selKes) selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
        return;
    }

    let bank = window.adminBankLatihanData || {};
    let mapelSet = new Set();
    Object.values(bank).forEach(function(item) {
        if (item && item.kelas === kelas) mapelSet.add(item.mapel);
    });

    let html = '<option value="">-- Pilih Mata Pelajaran --</option>';
    Array.from(mapelSet).sort().forEach(function(m) {
        html += '<option value="' + m + '">' + m + '</option>';
    });
    selMapel.innerHTML = html;
    document.getElementById('latihan-select-bab').innerHTML = '<option value="">-- Pilih Mapel Dahulu --</option>';
    if (selKes) selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
};

window.updateDropdownLatihanBab = function() {
    let kelas = document.getElementById('latihan-select-kelas').value;
    let mapel = document.getElementById('latihan-select-mapel').value;
    let selBab = document.getElementById('latihan-select-bab');
    let selKes = document.getElementById('latihan-select-kesulitan');

    if (!mapel) {
        selBab.innerHTML = '<option value="">-- Pilih Mapel Dahulu --</option>';
        if (selKes) selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
        return;
    }

    let bank = window.adminBankLatihanData || {};
    let babSet = new Set();

    Object.keys(bank).forEach(function(k) {
        let item = bank[k];
        if (item && item.kelas === kelas && item.mapel === mapel && item.bab) {
            babSet.add(item.bab);
        }
    });

    let html = '<option value="">-- Pilih Bab Materi --</option>';
    Array.from(babSet).sort().forEach(function(b) {
        html += '<option value="' + b + '">' + b + '</option>';
    });
    selBab.innerHTML = html;
    if (selKes) selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
};

window.updateDropdownLatihanKesulitan = function() {
    let kelas = document.getElementById('latihan-select-kelas').value;
    let mapel = document.getElementById('latihan-select-mapel').value;
    let bab = document.getElementById('latihan-select-bab').value;
    let selKes = document.getElementById('latihan-select-kesulitan');
    if (!selKes) return;

    if (!bab) {
        selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
        return;
    }

    let bank = window.adminBankLatihanData || {};
    let urutanLevel = { 'C1': 1, 'C2': 2, 'HOTS': 3 };
    let ditemukan = [];
    let setLevelTersedia = new Set();

    Object.keys(bank).forEach(function(k) {
        let item = bank[k];
        if (item && item.kelas === kelas && item.mapel === mapel && item.bab === bab) {
            let arrSoal = Array.isArray(item.soal) ? item.soal : Object.values(item.soal || {});
            ditemukan.push({ key: k, kesulitan: item.kesulitan, jml: arrSoal.length });
            setLevelTersedia.add(item.kesulitan);
        }
    });

    ditemukan.sort(function(a, b) {
        return (urutanLevel[a.kesulitan] || 99) - (urutanLevel[b.kesulitan] || 99);
    });

    let html = '<option value="">-- Pilih Tingkat Kesulitan --</option>';
    ditemukan.forEach(function(d) {
        html += '<option value="' + d.key + '">Tingkat ' + d.kesulitan + ' (' + d.jml + ' Soal)</option>';
    });

    if (setLevelTersedia.has('C1') && setLevelTersedia.has('C2')) {
        html += '<option value="COMBO_C1_C2">C1 + C2 (Proporsi 40% : 60%)</option>';
    }
    if (setLevelTersedia.has('C1') && setLevelTersedia.has('C2') && setLevelTersedia.has('HOTS')) {
        html += '<option value="COMBO_CAMPURAN">Campuran (30% : 40% : 30%)</option>';
    }

    selKes.innerHTML = html;
};

// =========================================================================
// 2. PENGINGAT TANPA LOGIN, BANNER PANEN XP, & PERSIAPAN SOAL LATIHAN
// =========================================================================
window.tampilkanPopupPengingatLatihanTanpaLogin = function(onCloseCallback) {
    let oldModal = document.getElementById('modal-pengingat-poin-latihan');
    if (oldModal) oldModal.remove();

    let modal = document.createElement('div');
    modal.id = 'modal-pengingat-poin-latihan';
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.style.zIndex = '1000090';

    function tutupDanLanjut() {
        modal.remove();
        if (onCloseCallback) onCloseCallback();
    }

    modal.onclick = function(e) {
        if (e.target === modal) tutupDanLanjut();
    };

    modal.innerHTML =
        '<div class="modal-box" style="width:390px; max-width:92vw; text-align:center; border-radius:14px; overflow:hidden; box-shadow:0 15px 35px rgba(0,0,0,0.3);">' +
            '<div class="modal-header" style="background:#fef9e7; border-bottom:1px solid #f9e79f; padding:14px 18px;">' +
                '<h3 style="margin:0; color:#d35400; font-size:16px;">⚠️ Pengingat Poin Latihan</h3>' +
                '<button type="button" class="close-btn" id="btn-x-pengingat-latihan" style="color:#d35400;">✕</button>' +
            '</div>' +
            '<div class="modal-body" style="padding:22px 20px;">' +
                '<div style="font-size:44px; margin-bottom:8px;">💡</div>' +
                '<p style="margin:0 0 18px 0; font-size:15px; font-weight:700; color:#1e293b; line-height:1.5;">Jika belum login, Anda tidak akan mendapatkan poin.</p>' +
                '<button type="button" id="btn-ok-pengingat-latihan" class="btn-action" style="background:#0b3954; width:100%; padding:11px; border-radius:25px; font-size:14px;">Mengerti & Lanjut Latihan ➔</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);
    document.getElementById('btn-x-pengingat-latihan').onclick = tutupDanLanjut;
    document.getElementById('btn-ok-pengingat-latihan').onclick = tutupDanLanjut;
};

window.normalisasiDaftarSoalLatihan = function(rawSoalArray) {
    return (rawSoalArray || []).filter(Boolean).map(function(q, origIndex) {
        let copyQ = Object.assign({}, q);
        if (typeof copyQ.origIdx !== 'number') copyQ.origIdx = origIndex;
        let opts = Array.isArray(copyQ.options) ? copyQ.options : Object.values(copyQ.options || {});

        if (opts.length === 0 && copyQ.question && /<br\s*\/?>\s*[A-Ea-e][\.\)]/.test(copyQ.question)) {
            let parts = copyQ.question.split(/<br\s*\/?>/i);
            let qClean = [];
            parts.forEach(function(p) {
                let line = p.trim();
                if (/^[A-Ea-e][\.\)]\s*/.test(line)) {
                    let lbl = line.charAt(0).toUpperCase();
                    let txt = line.substring(2).trim();
                    opts.push({ label: lbl, text: txt });
                } else {
                    qClean.push(line);
                }
            });
            copyQ.question = qClean.join('<br>');
        }
        copyQ.options = opts.map(function(o, idx) {
            if (typeof o === 'string') return { label: String.fromCharCode(65 + idx), text: o };
            return { label: o.label || String.fromCharCode(65 + idx), text: o.text || '' };
        });

        let rawCorrect = copyQ.correct || copyQ.correctAnswers || [];
        if (typeof rawCorrect === 'string') rawCorrect = [rawCorrect];
        else if (!Array.isArray(rawCorrect)) rawCorrect = Object.values(rawCorrect);

        if (copyQ.type === 'Essay') {
            copyQ.type = 'Essay';
        } else if (copyQ.options.length === 0 || copyQ.type === 'IS' || copyQ.type === 'short_answer') {
            copyQ.type = 'IS';
            let splitKeys = [];
            rawCorrect.forEach(function(k) {
                String(k).split(/\||,/).forEach(function(sub) {
                    if (sub.trim()) splitKeys.push(sub.trim());
                });
            });
            rawCorrect = splitKeys;
        } else if (copyQ.type !== 'PGK') {
            copyQ.type = 'PG';
        }

        copyQ.correct = rawCorrect;
        return copyQ;
    });
};

window.cariPaketLatihanByLevel = function(kelas, mapel, bab, targetKesulitan) {
    let bank = window.adminBankLatihanData || {};
    let targetUpper = (targetKesulitan || '').toUpperCase().trim();
    let foundKey = null;
    Object.keys(bank).forEach(function(k) {
        let item = bank[k];
        if (item && item.kelas === kelas && item.mapel === mapel && item.bab === bab && String(item.kesulitan || '').toUpperCase().trim() === targetUpper) {
            foundKey = k;
        }
    });
    if (!foundKey || !bank[foundKey]) return null;
    let soals = Array.isArray(bank[foundKey].soal) ? bank[foundKey].soal : Object.values(bank[foundKey].soal || {});
    return { key: foundKey, soal: soals, kesulitan: targetUpper };
};

window.eksekusiMulaiLatihanInti = function() {
    let selKes = document.getElementById('latihan-select-kesulitan');
    let keyVal = (selKes && selKes.value) ? selKes.value : document.getElementById('latihan-select-bab').value;
    let inpJumlah = document.getElementById('latihan-jumlah-soal');
    let jumlahTotal = parseInt(inpJumlah ? inpJumlah.value : 20, 10);

    if (isNaN(jumlahTotal) || jumlahTotal < 20) {
        alert("⚠️ Ditolak! Minimal soal untuk berlatih adalah 20 soal.");
        if (inpJumlah) inpJumlah.value = 20;
        return;
    }

    if (!keyVal) return alert("Pilih Bab dan Tingkat Kesulitan terlebih dahulu!");

    let bank = window.adminBankLatihanData || {};
    let kelas = document.getElementById('latihan-select-kelas').value;
    let mapel = document.getElementById('latihan-select-mapel').value;
    let bab = document.getElementById('latihan-select-bab').value;

    let rawSoalKumpulan = [];
    let kesulitanTitel = keyVal;

    function ambilSoalBerurutanDariKesulitan(targetKesulitan, jumlahKebutuhan) {
        let ditemukan = window.cariPaketLatihanByLevel(kelas, mapel, bab, targetKesulitan);
        if (!ditemukan || !Array.isArray(ditemukan.soal)) return [];
        return ditemukan.soal.slice(0, jumlahKebutuhan);
    }

    if (keyVal === 'COMBO_C1_C2') {
        let pC1 = Math.round(jumlahTotal * 0.40);
        let pC2 = jumlahTotal - pC1;
        rawSoalKumpulan = [].concat(ambilSoalBerurutanDariKesulitan('C1', pC1), ambilSoalBerurutanDariKesulitan('C2', pC2));
        kesulitanTitel = 'C1';
    } else if (keyVal === 'COMBO_CAMPURAN') {
        let pC1 = Math.round(jumlahTotal * 0.30);
        let pHOTS = Math.round(jumlahTotal * 0.30);
        let pC2 = jumlahTotal - pC1 - pHOTS;
        rawSoalKumpulan = [].concat(ambilSoalBerurutanDariKesulitan('C1', pC1), ambilSoalBerurutanDariKesulitan('C2', pC2), ambilSoalBerurutanDariKesulitan('HOTS', pHOTS));
        kesulitanTitel = 'C1';
    } else {
        let paketData = bank[keyVal];
        if (!paketData) return alert("Paket latihan tidak ditemukan di arsip!");
        let allSoal = Array.isArray(paketData.soal) ? paketData.soal : Object.values(paketData.soal || {});
        rawSoalKumpulan = allSoal.slice(0, jumlahTotal);
        kesulitanTitel = (paketData.kesulitan || 'C1').toUpperCase().trim();
    }

    if (rawSoalKumpulan.length === 0) return alert("Soal tidak ditemukan untuk kombinasi ini, atau stok soal habis!");

    if (typeof window.resetAntiMacroSession === "function") window.resetAntiMacroSession();
    let normalizedSoal = window.normalisasiDaftarSoalLatihan(rawSoalKumpulan);

    window.sesiLatihanSiswa = {
        paketKey: keyVal,
        kelas: kelas,
        mapel: mapel,
        bab: bab,
        kesulitan: kesulitanTitel,
        soal: normalizedSoal,
        jawaban: {},
        _startTimeMs: Date.now(),
        _panenClaimed: false
    };
    window.tutupModal('modal-enter-latihan');
    window.bukaRuangLatihan();
};

window.mulaiLatihanSiswa = function() {
    let selKes = document.getElementById('latihan-select-kesulitan');
    let keyVal = (selKes && selKes.value) ? selKes.value : document.getElementById('latihan-select-bab').value;
    if (!keyVal) return alert("Pilih Bab dan Tingkat Kesulitan terlebih dahulu!");

    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        window.tampilkanPopupPengingatLatihanTanpaLogin(function() {
            window.eksekusiMulaiLatihanInti();
        });
        return;
    }
    window.eksekusiMulaiLatihanInti();
};

// =========================================================================
// 3. JALUR BELAJAR ADAPTIF (C1 ➔ C2 ➔ HOTS) & RENDER SOAL LATIHAN
// =========================================================================
window.muatLevelAdaptifLatihan = function(targetLevel) {
    if (!window.sesiLatihanSiswa) return;
    let kls = window.sesiLatihanSiswa.kelas;
    let mpl = window.sesiLatihanSiswa.mapel;
    let bab = window.sesiLatihanSiswa.bab;
    let prevDisableMG = Boolean(window.sesiLatihanSiswa.disableMiniGames);

    let paketTarget = window.cariPaketLatihanByLevel(kls, mpl, bab, targetLevel);
    if (!paketTarget || !paketTarget.soal || paketTarget.soal.length === 0) {
        return alert("⚠️ Soal untuk tingkat " + targetLevel + " pada bab \"" + bab + "\" belum tersedia di Bank Latihan.");
    }

    window.tutupModalHasilQuiz();
    let soalNormalized = window.normalisasiDaftarSoalLatihan(paketTarget.soal);

    window.sesiLatihanSiswa = {
        paketKey: paketTarget.key,
        kelas: kls,
        mapel: mpl,
        bab: bab,
        kesulitan: targetLevel.toUpperCase(),
        soal: soalNormalized,
        jawaban: {},
        disableMiniGames: prevDisableMG,
        _startTimeMs: Date.now(),
        _panenClaimed: false
    };

    window.bukaRuangLatihan();
};

window.ulangSoalSalahLatihanC1 = function() {
    if (!window.sesiLatihanSiswa || !Array.isArray(window.sesiLatihanSiswa.soal)) return;
    let hasilBenarArr = window.sesiLatihanSiswa.hasilBenar || [];
    let soalSalahSaja = window.sesiLatihanSiswa.soal.filter(function(q, idx) {
        return !hasilBenarArr[idx];
    });

    if (soalSalahSaja.length === 0) {
        return alert("🎉 Semua soal sudah Anda jawab dengan benar!");
    }

    window.tutupModalHasilQuiz();
    window.sesiLatihanSiswa.soal = soalSalahSaja.map(function(q) {
        return Object.assign({}, q);
    });
    window.sesiLatihanSiswa.jawaban = {};
    window.sesiLatihanSiswa.hasilSudahTampil = false;

    window.bukaRuangLatihan();
};

window.selesaiAdaptifKeBeranda = function() {
    window.tutupModalHasilQuiz();
    window.keluarRuangLatihanSiswa();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.bukaRuangLatihan = function() {
    let aiBox = document.getElementById("ai-tutor-box");
    if (aiBox) aiBox.style.display = "none";

    let header = document.getElementById('header-wrap');
    let nav = document.getElementById('main-nav');
    let breadcrumb = document.querySelector('.bottom-breadcrumb-bar');
    if (header) header.style.display = 'none';
    if (nav) nav.style.display = 'none';
    if (breadcrumb) breadcrumb.style.display = 'none';

    document.body.style.overflow = 'auto';
    document.body.classList.remove('strict-mode-active');

    let room = document.getElementById('ujian-strict-room');
    if (room) {
        room.style.display = 'block';
        room.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let judulUI = document.getElementById('ujian-judul-ui');
    if (judulUI) {
        judulUI.style.color = '#2c3e50';
        judulUI.innerText = '🚀 Latihan: ' + window.sesiLatihanSiswa.bab + ' (Tingkat ' + window.sesiLatihanSiswa.kesulitan + ')';
    }

    let isAdmin = sessionStorage.getItem("statusLogin") === "admin";
    let subUI = document.getElementById('ujian-strict-subtitle');
    if (subUI) {
        subUI.innerText = isAdmin
            ? '🛠️ Mode Admin Aktif: Klik langsung pada teks soal, opsi, atau pembahasan untuk mengedit, atau klik 🗑️ untuk membuang soal.'
            : 'Jalur Belajar Adaptif (' + window.sesiLatihanSiswa.kesulitan + ') • Soal berurutan sesuai Bank Soal.';
    }

    let timerEl = document.getElementById('ujian-timer-fixed');
    if (timerEl) timerEl.style.display = 'none';

    window.isStrictUjianActive = false;
    window.renderSoalLatihanSiswa();
};

window.keluarRuangLatihanSiswa = function() {
    let room = document.getElementById('ujian-strict-room');
    if (room) room.style.display = 'none';

    let header = document.getElementById('header-wrap');
    let nav = document.getElementById('main-nav');
    let breadcrumb = document.querySelector('.bottom-breadcrumb-bar');
    if (header) header.style.display = 'block';
    if (nav) nav.style.display = 'flex';
    if (breadcrumb) breadcrumb.style.display = 'flex';

    let judulUI = document.getElementById('ujian-judul-ui');
    if (judulUI) judulUI.style.color = '#c0392b';
    let subUI = document.getElementById('ujian-strict-subtitle');
    if (subUI) subUI.innerText = 'Mode Ketat: Dilarang Keluar atau Membuka Aplikasi Lain!';

    let b = document.getElementById('btn-toggle-cbt-nav');
    if (b) b.style.display = 'none';
    let d = document.getElementById('cbt-nav-drawer');
    if (d) d.classList.remove('show-nav');
};

window.simpanEditanLatihanAdmin = function(soalIdx, field, optIdx, newValue) {
    if (sessionStorage.getItem("statusLogin") !== "admin" || !window.sesiLatihanSiswa) return;
    let q = window.sesiLatihanSiswa.soal[soalIdx];
    if (!q) return;

    let cleanVal = (newValue || "").trim();
    if (field === 'question') {
        q.question = cleanVal;
    } else if (field === 'option' && q.options && q.options[optIdx]) {
        q.options[optIdx].text = cleanVal;
    } else if (field === 'explanation') {
        q.explanation = cleanVal;
    } else if (field === 'correct') {
        q.correct = cleanVal.split(/\||,/).map(function(s) { return s.trim(); }).filter(Boolean);
    }

    let key = window.sesiLatihanSiswa.paketKey;
    if (key && window.adminBankLatihanData && window.adminBankLatihanData[key]) {
        let bankSoalArr = window.adminBankLatihanData[key].soal;
        if (Array.isArray(bankSoalArr) && typeof q.origIdx === 'number' && bankSoalArr[q.origIdx]) {
            bankSoalArr[q.origIdx].question = q.question;
            bankSoalArr[q.origIdx].options = q.options;
            bankSoalArr[q.origIdx].explanation = q.explanation;
            bankSoalArr[q.origIdx].correct = q.correct;
            if (typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
        }
    }
};

window.buangSoalLatihanAdmin = function(soalIdx) {
    if (sessionStorage.getItem("statusLogin") !== "admin" || !window.sesiLatihanSiswa) return;
    let q = window.sesiLatihanSiswa.soal[soalIdx];
    if (!q) return;
    if (!confirm("Buang soal nomor " + (soalIdx + 1) + " ini secara permanen dari Bank Latihan?")) return;

    let key = window.sesiLatihanSiswa.paketKey;
    let origToDelete = q.origIdx;

    window.sesiLatihanSiswa.soal.splice(soalIdx, 1);

    if (key && window.adminBankLatihanData && window.adminBankLatihanData[key]) {
        let bankSoalArr = window.adminBankLatihanData[key].soal;
        if (Array.isArray(bankSoalArr) && typeof origToDelete === 'number') {
            bankSoalArr.splice(origToDelete, 1);
            window.sesiLatihanSiswa.soal.forEach(function(item) {
                if (item.origIdx > origToDelete) item.origIdx -= 1;
            });
            if (typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
        }
    }

    window.renderSoalLatihanSiswa();
};

window.renderSoalLatihanSiswa = function() {
    let container = document.getElementById('ujian-strict-container');
    if (!container) return;

    let isAdmin = sessionStorage.getItem("statusLogin") === "admin";
    let soalArr = (window.sesiLatihanSiswa && window.sesiLatihanSiswa.soal) ? window.sesiLatihanSiswa.soal : [];
    window.sesiLatihanSiswa.statusJawab = new Array(soalArr.length).fill(false);
    window.sesiLatihanSiswa.hasilBenar = new Array(soalArr.length).fill(false);
    window.sesiLatihanSiswa.skorTotal = 0;
    window.sesiLatihanSiswa.hasilSudahTampil = false;
    window.sesiLatihanSiswa.minigameTriggeredMap = {};

    let judulCetak = ('Latihan Mandiri - ' + (window.sesiLatihanSiswa.bab || '') + ' (' + (window.sesiLatihanSiswa.kesulitan || '') + ')').replace(/'/g, "\\'");

    let html = '<div style="max-width:800px; margin:0 auto;">';

    html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; background:white; padding:12px 16px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.06); border:1px solid #e1e8ed; flex-wrap:wrap; gap:10px;">' +
        '<div style="display:flex; gap:10px; flex-wrap:wrap;">' +
            '<button class="btn-action" style="background:#2c3e50; padding:8px 16px; font-size:12px; border-radius:30px; display:flex; align-items:center; gap:6px; width:auto;" onclick="window.cetakDokumenUniversal(\'pdf\', \'' + judulCetak + '\', window.sesiLatihanSiswa.soal)">🖨️ Print PDF</button>' +
            '<button class="btn-action" style="background:#2c3e50; padding:8px 16px; font-size:12px; border-radius:30px; display:flex; align-items:center; gap:6px; width:auto;" onclick="window.cetakDokumenUniversal(\'word\', \'' + judulCetak + '\', window.sesiLatihanSiswa.soal)">📄 Export Word</button>' +
        '</div>' +
        '<button class="btn-action" style="background:#e74c3c; padding:8px 18px; font-size:12px; border-radius:30px; display:flex; align-items:center; gap:6px; width:auto;" onclick="window.keluarRuangLatihanSiswa()">✕ Keluar Ruang</button>' +
    '</div>';

    soalArr.forEach(function(q, idx) {
        let kunciArr = Array.isArray(q.correct) ? q.correct : [];
        let opsiArr = Array.isArray(q.options) ? q.options : [];

        let btnBuangSoal = isAdmin
            ? '<button type="button" style="display:block !important; position:absolute; top:15px; right:15px; background:#e74c3c; color:white; border:none; border-radius:4px; padding:6px 10px; font-size:11px; font-weight:bold; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.2); z-index:10;" onclick="window.buangSoalLatihanAdmin(' + idx + ')" title="Buang Soal Ini">🗑️ Buang Soal</button>'
            : '';

        let qEditAttr = isAdmin
            ? 'contenteditable="true" style="outline:none; cursor:text; background:#fffdf9; padding:4px 6px; border-radius:4px; border-bottom:1px dashed #e67e22;" onblur="window.simpanEditanLatihanAdmin(' + idx + ', \'question\', null, this.innerHTML)"'
            : '';

        html += '<div class="quiz-question-card" id="card-latihan-' + idx + '" style="margin-bottom:25px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border-radius:10px; background:white; padding:22px 20px 20px 20px; border:1px solid #e1e8ed; border-left:4px solid #3498db; position:relative;">' +
            btnBuangSoal +
            '<div class="quiz-question-text" style="font-size:15px; color:#2c3e50; margin-bottom:15px; line-height:1.5; padding-bottom:8px; padding-right:' + (isAdmin ? '100px' : '0') + ';">' +
                '<span>' + (idx + 1) + '. </span><span ' + qEditAttr + '>' + (q.question || '') + '</span>' +
            '</div>';

        if (q.type === 'IS' || q.type === 'Essay' || opsiArr.length === 0) {
            html += '<input type="text" id="input-latihan-' + idx + '" class="input-box" placeholder="Ketik jawaban Anda lalu tekan Enter..." style="font-size:14px; padding:11px 14px; border:1px solid #cbd5e1; border-radius:8px; width:100%; box-sizing:border-box; margin-bottom:0;" onchange="window.simpanJawabanLatihan(' + idx + ', this)" onkeydown="if(event.key===\'Enter\'){this.blur();}">';
        } else {
            html += '<div class="quiz-options" style="display:flex; flex-direction:column; gap:8px;">';
            opsiArr.forEach(function(opt, oIdx) {
                let optEditSpan = isAdmin
                    ? '<span contenteditable="true" style="flex:1; outline:none; border-bottom:1px dashed #e67e22; background:#fffdf9; cursor:text; padding:2px 4px;" onclick="event.stopPropagation();" onblur="window.simpanEditanLatihanAdmin(' + idx + ', \'option\', ' + oIdx + ', this.innerText)">' + opt.text + '</span>'
                    : '<span>' + opt.text + '</span>';

                if (q.type === 'PGK') {
                    html += '<label id="opsi-lbl-' + idx + '-' + opt.label + '" class="quiz-option-btn opsi-latihan-' + idx + '" data-label="' + opt.label + '" style="display:flex; align-items:center; gap:10px; background:white; border:1px solid #e1e8ed; padding:12px 15px; border-radius:6px; cursor:pointer; font-size:14px; color:#34495e;">' +
                                '<input type="checkbox" id="chk-latihan-' + idx + '-' + opt.label + '" style="width:16px; height:16px; cursor:pointer; accent-color:#2980b9;" onchange="window.pilihJawabanLatihanPGK(' + idx + ', \'' + opt.label + '\', this.checked)">' +
                                '<b>' + opt.label + '.</b> ' + optEditSpan +
                             '</label>';
                } else {
                    html += '<div id="opsi-btn-' + idx + '-' + opt.label + '" class="quiz-option-btn opsi-latihan-' + idx + '" data-label="' + opt.label + '" style="display:flex; align-items:center; gap:6px; text-align:left; background:white; border:1px solid #e1e8ed; padding:12px 15px; border-radius:6px; cursor:pointer; font-size:14px; color:#34495e; transition:0.2s;" onclick="window.pilihJawabanLatihanPG(' + idx + ', \'' + opt.label + '\', this)">' +
                                '<b>' + opt.label + '.</b> ' + optEditSpan +
                             '</div>';
                }
            });
            if (q.type === 'PGK') {
                html += '<button type="button" id="btn-oke-pgk-latihan-' + idx + '" class="btn-action" style="background:#27ae60; width:auto; align-self:flex-start; padding:8px 18px; font-size:13px; margin-top:6px; border-radius:8px;" onclick="window.kunciJawabanLatihanPGK(' + idx + ')">✅ Oke / Kunci Jawaban</button>';
            }
            html += '</div>';
        }

        let bahasDisplay = isAdmin ? 'block' : 'none';
        let kunciEditAttr = isAdmin
            ? 'contenteditable="true" style="outline:none; border-bottom:1px dashed #e74c3c; padding:1px 4px; cursor:text; background:#fdf2e9; border-radius:3px;" onblur="window.simpanEditanLatihanAdmin(' + idx + ', \'correct\', null, this.innerText)"'
            : '';
        let bahasEditAttr = isAdmin
            ? 'contenteditable="true" style="outline:none; border-bottom:1px dashed #e74c3c; padding:2px 4px; cursor:text; background:#fdf2e9; border-radius:3px; display:inline-block; min-width:60%;" onblur="window.simpanEditanLatihanAdmin(' + idx + ', \'explanation\', null, this.innerHTML)"'
            : '';

        html += '<div id="bahas-' + idx + '" style="display:' + bahasDisplay + '; margin-top:15px; padding:12px 15px; background:#ebf5fb; border-left:4px solid #2980b9; border-radius:6px; font-size:13px; color:#2c3e50;">' +
                    '<strong style="color:#2980b9;">Kunci: <span ' + kunciEditAttr + '>' + (kunciArr.join(', ') || '-') + '</span></strong><br>' +
                    '<div style="margin-top:6px; color:#34495e;"><strong>Pembahasan:</strong> <span ' + bahasEditAttr + '>' + (q.explanation || 'Tidak ada pembahasan.') + '</span></div>' +
                 '</div>';
        html += '</div>';
    });

    html += '<div id="panel-adaptif-bawah-ruang" style="display:none; background:white; border:2px solid #3498db; border-radius:12px; padding:18px 20px; margin-top:25px; margin-bottom:70px; box-shadow:0 8px 25px rgba(0,0,0,0.1);">' +
                '<div id="teks-adaptif-bawah-ruang" style="text-align:center; font-weight:bold; font-size:14px; color:#2c3e50; margin-bottom:14px;"></div>' +
                '<div id="bar-tombol-adaptif-bawah-ruang" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; align-items:center;"></div>' +
            '</div>';

    html += '</div>';
    container.innerHTML = html;

    if (typeof window.renderCbtNavigation === 'function') {
        window.renderCbtNavigation(soalArr.length, 'latihan');
    }
};

window.bangunHTMLTombolAdaptif = function(levelSekarang, nilaiAkhir, jmlSalah) {
    let lvl = (levelSekarang || 'C1').toUpperCase().trim();
    if (!['C1', 'C2', 'HOTS'].includes(lvl)) lvl = 'C1';

    let btnKiri = '<div></div>';
    let btnTengah = '<div></div>';
    let btnKanan = '<div></div>';
    let pesanAdaptif = '';

    if (lvl === 'C1') {
        if (nilaiAkhir < 100 && jmlSalah > 0) {
            btnKiri = '<button type="button" class="btn-action" style="background:#e67e22; width:100%; padding:10px 12px; font-size:12px; border-radius:8px; justify-self:start;" onclick="window.ulangSoalSalahLatihanC1()">🔄 Coba Lagi yang Salah (' + jmlSalah + ')</button>';
        }
        if (nilaiAkhir >= 80) {
            btnKanan = '<button type="button" class="btn-action" style="background:#27ae60; width:100%; padding:10px 12px; font-size:12px; border-radius:8px; justify-self:end;" onclick="window.muatLevelAdaptifLatihan(\'C2\')">🚀 Lanjut Soal C2 ➔</button>';
        }
        if (nilaiAkhir === 100) {
            pesanAdaptif = '🌟 Sempurna! Kamu menguasai penuh pondasi C1. Silakan lanjut ke soal tingkat C2 di kanan bawah!';
        } else if (nilaiAkhir >= 80) {
            pesanAdaptif = '👍 Nilai kamu sudah mencapai target (≥80)! Kamu bisa memperbaiki soal yang salah (kiri bawah) atau langsung lanjut ke soal C2 (kanan bawah).';
        } else {
            pesanAdaptif = '💪 Jangan menyerah! Tekan tombol di kiri bawah untuk mencoba kembali soal-soal yang masih salah hingga tuntas.';
        }
    } else if (lvl === 'C2') {
        if (nilaiAkhir < 60) {
            btnKiri = '<button type="button" class="btn-action" style="background:#e74c3c; width:100%; padding:10px 12px; font-size:12px; border-radius:8px; justify-self:start;" onclick="window.muatLevelAdaptifLatihan(\'C1\')">⬅️ Kerjakan C1</button>';
            pesanAdaptif = '📘 Nilai kamu masih di bawah 60. Mari perkuat kembali konsep dasar di tingkat C1 lewat tombol di kiri bawah.';
        } else if (nilaiAkhir >= 60 && nilaiAkhir < 75) {
            btnTengah = '<button type="button" class="btn-action" style="background:#f39c12; width:100%; padding:10px 12px; font-size:12px; border-radius:8px; justify-self:center;" onclick="window.muatLevelAdaptifLatihan(\'C2\')">🔄 Kerjakan Ulang</button>';
            pesanAdaptif = '🔥 Hampir berhasil! Raih minimal skor 75 untuk membuka tantangan HOTS. Klik Kerjakan Ulang di tengah bawah.';
        } else {
            btnKanan = '<button type="button" class="btn-action" style="background:#8e44ad; width:100%; padding:10px 12px; font-size:12px; border-radius:8px; justify-self:end;" onclick="window.muatLevelAdaptifLatihan(\'HOTS\')">🔥 Lanjut HOTS ➔</button>';
            pesanAdaptif = '🚀 Mantap! Kamu lulus tantangan C2. Saatnya menaklukkan level tertinggi (HOTS) lewat tombol di kanan bawah!';
        }
    } else if (lvl === 'HOTS') {
        if (nilaiAkhir < 60) {
            btnKiri = '<button type="button" class="btn-action" style="background:#e74c3c; width:100%; padding:10px 12px; font-size:12px; border-radius:8px; justify-self:start;" onclick="window.muatLevelAdaptifLatihan(\'C2\')">⬅️ Kerjakan C2</button>';
            pesanAdaptif = '📘 Soal analisis HOTS memang menantang! Mari matangkan kembali pemahaman konsep di tingkat C2 lewat tombol di kiri bawah.';
        } else if (nilaiAkhir >= 60 && nilaiAkhir < 75) {
            btnTengah = '<button type="button" class="btn-action" style="background:#f39c12; width:100%; padding:10px 12px; font-size:12px; border-radius:8px; justify-self:center;" onclick="window.muatLevelAdaptifLatihan(\'HOTS\')">🔄 Kerjakan Ulang</button>';
            pesanAdaptif = '⚡ Sedikit lagi mencapai batas kelulusan HOTS (75)! Yuk kerjakan ulang lewat tombol di tengah bawah.';
        } else {
            btnKanan = '<button type="button" class="btn-action" style="background:#16a085; width:100%; padding:10px 12px; font-size:12px; border-radius:8px; justify-self:end;" onclick="window.selesaiAdaptifKeBeranda()">🏆 Luar Biasa! ➔</button>';
            pesanAdaptif = '🏆 LUAR BIASA! Kamu telah menaklukkan puncak tertinggi (HOTS) pada bab ini dengan sangat gemilang!';
        }
    }

    return {
        gridHTML: btnKiri + btnTengah + btnKanan,
        pesan: pesanAdaptif,
        levelLabel: 'TINGKAT ' + lvl
    };
};

window.tampilkanModalHasilAkhirLatihan = function() {
    if (!window.sesiLatihanSiswa) return;
    let dijawab = window.sesiLatihanSiswa.statusJawab.filter(Boolean).length;
    let total = window.sesiLatihanSiswa.soal.length;

    if (total > 0 && dijawab === total && !window.sesiLatihanSiswa.hasilSudahTampil) {
        window.sesiLatihanSiswa.hasilSudahTampil = true;
        let nilaiAkhir = Math.round((window.sesiLatihanSiswa.skorTotal / total) * 100);
        let jmlSalah = total - window.sesiLatihanSiswa.skorTotal;

        if (sessionStorage.getItem("statusLogin") === "siswa" && typeof window.tambahXPSiswa === "function") {
            let rincianBenar = window.sesiLatihanSiswa.soal.map(function(q, i) {
                return { type: q.type || 'PG', sudahBenar: Boolean(window.sesiLatihanSiswa.hasilBenar[i]) };
            });
            window.tambahXPSiswa(nilaiAkhir, 'latihan', rincianBenar);
        }

        let navAdaptif = window.bangunHTMLTombolAdaptif(window.sesiLatihanSiswa.kesulitan, nilaiAkhir, jmlSalah);

        let panelBawah = document.getElementById('panel-adaptif-bawah-ruang');
        let teksBawah = document.getElementById('teks-adaptif-bawah-ruang');
        let barBawah = document.getElementById('bar-tombol-adaptif-bawah-ruang');
        if (panelBawah && teksBawah && barBawah) {
            panelBawah.style.display = 'block';
            teksBawah.innerHTML = '📊 Skor Akhir ' + navAdaptif.levelLabel + ': <span style="color:#2980b9; font-size:18px;">' + nilaiAkhir + '</span> (Benar ' + window.sesiLatihanSiswa.skorTotal + ' dari ' + total + ')<br><span style="font-size:12px; color:#64748b; font-weight:normal;">' + navAdaptif.pesan + '</span>';
            barBawah.innerHTML = navAdaptif.gridHTML;
        }

        let modal = document.getElementById('modal-quiz-result');
        if (modal) {
            let badgeEl = document.getElementById('quiz-result-level-badge');
            if (badgeEl) badgeEl.innerText = navAdaptif.levelLabel + ' • ' + (window.sesiLatihanSiswa.bab || '');

            let scoreEl = document.getElementById('quiz-result-score');
            if (scoreEl) {
                scoreEl.innerText = nilaiAkhir;
                scoreEl.style.color = nilaiAkhir >= 75 ? '#27ae60' : (nilaiAkhir >= 60 ? '#f39c12' : '#e74c3c');
            }

            let correctEl = document.getElementById('quiz-result-correct');
            if (correctEl) correctEl.innerText = window.sesiLatihanSiswa.skorTotal;

            let totalEl = document.getElementById('quiz-result-total');
            if (totalEl) totalEl.innerText = total;

            let msgEl = document.getElementById('quiz-result-adaptive-msg');
            if (msgEl) msgEl.innerText = navAdaptif.pesan;

            let actEl = document.getElementById('quiz-result-adaptive-actions');
            if (actEl) actEl.innerHTML = navAdaptif.gridHTML;

            window.bukaModal('modal-quiz-result');
            modal.style.zIndex = "999999";
            window.evaluasiBonusPanenXPLatihan();
        }
    }
};

window.cekSelesaiLatihan = function() {
    if (!window.sesiLatihanSiswa || !Array.isArray(window.sesiLatihanSiswa.statusJawab)) return;
    let dijawab = window.sesiLatihanSiswa.statusJawab.filter(Boolean).length;
    let total = window.sesiLatihanSiswa.soal.length;

    if (!window.sesiLatihanSiswa.minigameTriggeredMap) {
        window.sesiLatihanSiswa.minigameTriggeredMap = {};
    }

    if (dijawab > 0 && dijawab % 10 === 0 && !window.sesiLatihanSiswa.disableMiniGames && !window.sesiLatihanSiswa.minigameTriggeredMap[dijawab]) {
        window.sesiLatihanSiswa.minigameTriggeredMap[dijawab] = true;
        setTimeout(function() {
            window.bukaMiniGameLatihan(function() {
                window.tampilkanModalHasilAkhirLatihan();
            });
        }, 350);
        return;
    }

    if (total > 0 && dijawab === total) {
        window.tampilkanModalHasilAkhirLatihan();
    }
};

// =========================================================================
// 4. LOGIKA MENJAWAB SOAL LATIHAN (PG, PGK, ISIAN) & EVENT PANEN XP
// =========================================================================
window.pilihJawabanLatihanPG = function(soalIdx, labelPilihan, btnEl) {
    if (window.sesiLatihanSiswa.statusJawab[soalIdx]) return;

    let q = window.sesiLatihanSiswa.soal[soalIdx];
    let kunciArr = Array.isArray(q.correct) ? q.correct : [];
    window.sesiLatihanSiswa.statusJawab[soalIdx] = true;
    window.sesiLatihanSiswa.jawaban[soalIdx] = labelPilihan;

    let isCorrect = kunciArr.includes(labelPilihan);
    if (!Array.isArray(window.sesiLatihanSiswa.hasilBenar)) window.sesiLatihanSiswa.hasilBenar = [];
    window.sesiLatihanSiswa.hasilBenar[soalIdx] = isCorrect;
    if (isCorrect) window.sesiLatihanSiswa.skorTotal += 1;

    document.querySelectorAll('.opsi-latihan-' + soalIdx).forEach(function(btn) {
        btn.style.cursor = 'not-allowed';
        btn.disabled = true;
        let lbl = btn.getAttribute('data-label');
        if (kunciArr.includes(lbl)) {
            btn.style.background = '#d5f5e3'; btn.style.borderColor = '#27ae60'; btn.style.color = '#1e8449'; btn.style.fontWeight = 'bold';
        } else if (lbl === labelPilihan && !isCorrect) {
            btn.style.background = '#fadbd8'; btn.style.borderColor = '#e74c3c'; btn.style.color = '#c0392b'; btn.style.fontWeight = 'bold';
        } else {
            btn.style.opacity = '0.6';
        }
    });

    document.getElementById('bahas-' + soalIdx).style.display = 'block';
    if (typeof window.updateCbtNavInfo === 'function') window.updateCbtNavInfo('latihan');
    window.cekSelesaiLatihan();
};

window.pilihJawabanLatihanPGK = function(soalIdx, labelPilihan, isChecked) {
    if (window.sesiLatihanSiswa.statusJawab[soalIdx]) {
        let chk = document.getElementById('chk-latihan-' + soalIdx + '-' + labelPilihan);
        if (chk) chk.checked = !isChecked;
        return;
    }
    let lblEl = document.getElementById('opsi-lbl-' + soalIdx + '-' + labelPilihan);
    if (lblEl) {
        lblEl.style.background = isChecked ? '#ebf5fb' : 'white';
        lblEl.style.borderColor = isChecked ? '#2980b9' : '#e1e8ed';
        lblEl.style.fontWeight = isChecked ? 'bold' : 'normal';
    }
};

window.kunciJawabanLatihanPGK = function(soalIdx) {
    if (window.sesiLatihanSiswa.statusJawab[soalIdx]) return;
    let q = window.sesiLatihanSiswa.soal[soalIdx];
    let kunciArr = Array.isArray(q.correct) ? q.correct.map(function(k) { return String(k).toUpperCase().trim(); }) : [];
    let opsiArr = Array.isArray(q.options) ? q.options : [];

    let dipilih = [];
    opsiArr.forEach(function(opt) {
        let chk = document.getElementById('chk-latihan-' + soalIdx + '-' + opt.label);
        if (chk && chk.checked) dipilih.push(String(opt.label).toUpperCase().trim());
    });

    if (dipilih.length === 0) return alert("Centang minimal 1 jawaban terlebih dahulu sebelum menekan tombol Oke!");

    window.sesiLatihanSiswa.statusJawab[soalIdx] = true;
    window.sesiLatihanSiswa.jawaban[soalIdx] = dipilih;

    let isAllCorrect = (dipilih.length === kunciArr.length) && dipilih.every(function(lbl) { return kunciArr.includes(lbl); });
    if (!Array.isArray(window.sesiLatihanSiswa.hasilBenar)) window.sesiLatihanSiswa.hasilBenar = [];
    window.sesiLatihanSiswa.hasilBenar[soalIdx] = isAllCorrect;
    if (isAllCorrect) window.sesiLatihanSiswa.skorTotal += 1;

    opsiArr.forEach(function(opt) {
        let lblUpper = String(opt.label).toUpperCase().trim();
        let chk = document.getElementById('chk-latihan-' + soalIdx + '-' + opt.label);
        let lblEl = document.getElementById('opsi-lbl-' + soalIdx + '-' + opt.label);
        if (chk) chk.disabled = true;
        if (lblEl) {
            lblEl.style.cursor = 'not-allowed';
            if (kunciArr.includes(lblUpper)) {
                lblEl.style.background = '#d5f5e3';
                lblEl.style.borderColor = '#27ae60';
                lblEl.style.color = '#1e8449';
                lblEl.style.fontWeight = 'bold';
            } else if (dipilih.includes(lblUpper)) {
                lblEl.style.background = '#fadbd8';
                lblEl.style.borderColor = '#e74c3c';
                lblEl.style.color = '#c0392b';
                lblEl.style.fontWeight = 'bold';
            } else {
                lblEl.style.opacity = '0.6';
            }
        }
    });

    let btnOke = document.getElementById('btn-oke-pgk-latihan-' + soalIdx);
    if (btnOke) btnOke.style.display = 'none';

    document.getElementById('bahas-' + soalIdx).style.display = 'block';
    if (typeof window.updateCbtNavInfo === 'function') window.updateCbtNavInfo('latihan');
    window.cekSelesaiLatihan();
};

window.simpanJawabanLatihan = function(soalIdx, inputEl) {
    if (window.sesiLatihanSiswa.statusJawab[soalIdx]) return;
    let val = inputEl.value.trim();
    if (!val) return;

    let q = window.sesiLatihanSiswa.soal[soalIdx];
    let kunciArr = Array.isArray(q.correct) ? q.correct : [];
    window.sesiLatihanSiswa.statusJawab[soalIdx] = true;
    window.sesiLatihanSiswa.jawaban[soalIdx] = val;

    inputEl.disabled = true;
    inputEl.style.cursor = 'not-allowed';
    if (!Array.isArray(window.sesiLatihanSiswa.hasilBenar)) window.sesiLatihanSiswa.hasilBenar = [];

    if (q.type === 'IS' || !q.options || q.options.length === 0) {
        let keys = kunciArr.map(function(k) { return String(k).toLowerCase().trim(); });
        let isCorrect = keys.includes(val.toLowerCase());
        window.sesiLatihanSiswa.hasilBenar[soalIdx] = isCorrect;
        if (isCorrect) {
            inputEl.style.background = '#d5f5e3'; inputEl.style.borderColor = '#27ae60'; inputEl.style.color = '#1e8449'; inputEl.style.fontWeight = 'bold';
            window.sesiLatihanSiswa.skorTotal += 1;
        } else {
            inputEl.style.background = '#fadbd8'; inputEl.style.borderColor = '#e74c3c'; inputEl.style.color = '#c0392b'; inputEl.style.fontWeight = 'bold';
        }
    } else {
        inputEl.style.background = '#eef2f7'; inputEl.style.borderColor = '#94a3b8';
        window.sesiLatihanSiswa.hasilBenar[soalIdx] = true;
        window.sesiLatihanSiswa.skorTotal += 1;
    }

    document.getElementById('bahas-' + soalIdx).style.display = 'block';
    if (typeof window.updateCbtNavInfo === 'function') window.updateCbtNavInfo('latihan');
    window.cekSelesaiLatihan();
};

window.pastikanBannerPanenXPLatihanAda = function() {
    let modalLat = document.getElementById("modal-enter-latihan");
    if (!modalLat || document.getElementById("banner-event-panen-xp")) return;
    let inpJml = document.getElementById("latihan-jumlah-soal");
    if (!inpJml) return;

    let banner = document.createElement("div");
    banner.id = "banner-event-panen-xp";
    banner.style.cssText = "background:linear-gradient(135deg, #fef9e7, #fdebd0); border:2px solid #f39c12; border-radius:10px; padding:12px; margin-top:4px;";
    banner.innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">' +
            '<div>' +
                '<div style="font-size:13px; font-weight:900; color:#d35400;">🌾 ACARA KHUSUS: PANEN XP RAYA!</div>' +
                '<div style="font-size:11px; color:#475569; line-height:1.4; margin-top:2px;">Kerjakan minimal <b>50 Soal</b> dan raih minimal <b>40 Benar</b> untuk klaim bonus <b>+200 XP & +200 Coin</b>!</div>' +
            '</div>' +
            '<button type="button" class="btn-action" style="background:#d35400; color:#fff; width:auto; padding:6px 12px; font-size:11px; border-radius:18px; white-space:nowrap;" onclick="document.getElementById(\'latihan-jumlah-soal\').value=50; if(window.tampilkanBadgeHadiahKuis) window.tampilkanBadgeHadiahKuis(this, \'🌾 Mode Panen XP (50 Soal) Diaktifkan!\');">🔥 Set 50 Soal</button>' +
        '</div>';
    inpJml.parentElement.after(banner);
};

window.evaluasiBonusPanenXPLatihan = function() {
    let sesi = window.sesiLatihanSiswa;
    if (!sesi || sesi._panenClaimed) return;

    let totalSoal = parseInt(document.getElementById("quiz-result-total") ? document.getElementById("quiz-result-total").innerText : "0", 10) || 0;
    let totalBenar = parseInt(document.getElementById("quiz-result-correct") ? document.getElementById("quiz-result-correct").innerText : "0", 10) || 0;
    let msgBox = document.getElementById("quiz-result-adaptive-msg");

    if (totalSoal < 50) return;

    let durasiDetik = sesi._startTimeMs ? ((Date.now() - sesi._startTimeMs) / 1000) : 999;
    let rataDetikPerSoal = durasiDetik / Math.max(1, totalSoal);

    if ((window.antiMacroGuard && window.antiMacroGuard.macroFlagged) || rataDetikPerSoal < 2.0) {
        if (msgBox) {
            msgBox.innerHTML += '<div style="margin-top:8px; padding:8px; background:#fee2e2; color:#991b1b; border:1px solid #ef4444; border-radius:6px; font-weight:800;">🚫 Bonus Panen XP Dibatalkan: Terdeteksi pengerjaan terlalu cepat / indikasi Macro (' + rataDetikPerSoal.toFixed(1) + ' dtk/soal).</div>';
        }
        return;
    }

    if (totalSoal >= 50 && totalBenar >= 40) {
        sesi._panenClaimed = true;
        if (typeof window.tambahXPSiswa === "function") window.tambahXPSiswa(200, "bonus_panen_xp");
        if (msgBox) {
            msgBox.innerHTML += '<div style="margin-top:8px; padding:10px; background:linear-gradient(135deg, #fef9e7, #dcfce7); color:#15803d; border:2px solid #22c55e; border-radius:8px; font-weight:900; font-size:13px;">🌾 BONUS PANEN XP RAYA TERCAPAI! (' + totalBenar + '/' + totalSoal + ' Benar)<br>Kamu mendapatkan tambahan <b>+200 XP & +200 Coin</b>!</div>';
        }
        if (typeof window.tampilkanBadgeHadiahKuis === "function") {
            window.tampilkanBadgeHadiahKuis(null, "🌾 PANEN XP RAYA! +200 XP & +200 Coin!");
        }
    }
};

// =========================================================================
// 5. MESIN 6 MINI-GAMES PENYEGAR OTAK (ROTASI OTOMATIS TIAP 10 SOAL)
// =========================================================================
window.minigameRotationIdx = parseInt(sessionStorage.getItem('mg_rot_idx') || '0', 10) || 0;
window.minigameActiveTimers = [];
window.minigameOnCloseCallback = null;
window.minigameRewardClaimed = false;

window.bersihkanTimerMiniGame = function() {
    (window.minigameActiveTimers || []).forEach(function(t) {
        clearInterval(t);
        clearTimeout(t);
    });
    window.minigameActiveTimers = [];
};

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

window.matikanMiniGamesSesiIni = function() {
    window.bersihkanTimerMiniGame();
    if (window.sesiLatihanSiswa) {
        window.sesiLatihanSiswa.disableMiniGames = true;
    }
    let modal = document.getElementById('modal-minigame-latihan');
    if (modal) modal.style.display = 'none';
    if (window.minigameOnCloseCallback) {
        let cb = window.minigameOnCloseCallback;
        window.minigameOnCloseCallback = null;
        cb();
    }
};

window.lewatiSatuMiniGame = function() {
    window.bersihkanTimerMiniGame();
    let modal = document.getElementById('modal-minigame-latihan');
    if (modal) modal.style.display = 'none';
    if (window.minigameOnCloseCallback) {
        let cb = window.minigameOnCloseCallback;
        window.minigameOnCloseCallback = null;
        cb();
    }
};

window.selesaikanMiniGameDenganHadiah = function(pesanSukses) {
    if (window.minigameRewardClaimed) return;
    window.minigameRewardClaimed = true;
    window.bersihkanTimerMiniGame();

    if (typeof window.tambahXPSiswa === "function") {
        window.tambahXPSiswa(5, 'minigame');
    }

    let stage = document.getElementById('minigame-stage-body');
    if (stage) {
        stage.innerHTML =
            '<div style="text-align:center; padding:20px 10px;">' +
                '<div style="font-size:52px; margin-bottom:8px;">🎉</div>' +
                '<h3 style="margin:0 0 6px 0; color:#1e293b; font-size:18px;">' + (pesanSukses || 'Permainan Selesai!') + '</h3>' +
                '<p style="margin:0 0 16px 0; font-size:13px; color:#16a085; font-weight:800;">🎁 Bonus +5 XP Berhasil Ditambahkan!</p>' +
                '<button type="button" class="btn-action" style="background:#27ae60; width:auto; padding:10px 26px; border-radius:30px; font-size:14px;" onclick="window.lewatiSatuMiniGame()">' +
                    '🚀 Lanjut Latihan' +
                '</button>' +
            '</div>';
    }
};

window.jalankanTimerMiniGame = function(detikAwal, onTimeUp) {
    let sisa = detikAwal;
    let timerValEl = document.getElementById('minigame-timer-val');
    if (timerValEl) timerValEl.innerText = sisa;

    let iv = setInterval(function() {
        sisa--;
        if (timerValEl) timerValEl.innerText = Math.max(0, sisa);
        if (sisa <= 0) {
            clearInterval(iv);
            if (onTimeUp) onTimeUp();
        }
    }, 1000);
    window.minigameActiveTimers.push(iv);
};

// GAME 1: MEMORY MATCH
window.mulaiGame1MemoryMatch = function() {
    document.getElementById('minigame-title').innerText = '🧠 1. Memory Match Sains';
    document.getElementById('minigame-subtitle').innerText = 'Buka & cocokkan 8 pasang benda laboratorium di bawah ini!';
    document.getElementById('minigame-score-val').innerText = '0/8';

    let icons = ['🔬', '🧬', '🦠', '🧪', '🧫', '🫀', '🌿', '⚛️'];
    let deck = icons.concat(icons).sort(function() { return Math.random() - 0.5; });

    let stage = document.getElementById('minigame-stage-body');
    let html = '<div class="mg-memory-grid">';
    deck.forEach(function(ikon, idx) {
        html += '<div class="mg-memory-card" data-idx="' + idx + '" data-icon="' + ikon + '" onclick="window.klikKartuMemoryMatch(this)">?</div>';
    });
    html += '</div>';
    stage.innerHTML = html;

    window.mgMemoryState = { firstCard: null, lockBoard: false, matchedPairs: 0 };

    window.jalankanTimerMiniGame(45, function() {
        window.selesaikanMiniGameDenganHadiah('Waktu Selesai! Memori yang hebat!');
    });
};

window.klikKartuMemoryMatch = function(cardEl) {
    let st = window.mgMemoryState;
    if (!st || st.lockBoard) return;
    if (cardEl.classList.contains('revealed') || cardEl.classList.contains('matched')) return;

    cardEl.classList.add('revealed');
    cardEl.innerText = cardEl.getAttribute('data-icon');

    if (!st.firstCard) {
        st.firstCard = cardEl;
        return;
    }

    let secondCard = cardEl;
    if (st.firstCard.getAttribute('data-icon') === secondCard.getAttribute('data-icon')) {
        st.firstCard.classList.replace('revealed', 'matched');
        secondCard.classList.replace('revealed', 'matched');
        st.firstCard = null;
        st.matchedPairs++;
        document.getElementById('minigame-score-val').innerText = st.matchedPairs + '/8';

        if (st.matchedPairs >= 8) {
            let t = setTimeout(function() {
                window.selesaikanMiniGameDenganHadiah('Luar Biasa! Semua 8 pasang kartu berhasil ditemukan!');
            }, 350);
            window.minigameActiveTimers.push(t);
        }
    } else {
        st.lockBoard = true;
        let firstRef = st.firstCard;
        st.firstCard = null;
        let t = setTimeout(function() {
            firstRef.classList.remove('revealed');
            firstRef.innerText = '?';
            secondCard.classList.remove('revealed');
            secondCard.innerText = '?';
            st.lockBoard = false;
        }, 550);
        window.minigameActiveTimers.push(t);
    }
};

// GAME 2: WHACK-A-VIRUS
window.mulaiGame2WhackVirus = function() {
    document.getElementById('minigame-title').innerText = '🦠 2. Whack-a-Virus!';
    document.getElementById('minigame-subtitle').innerText = 'Tap Virus (🦠/👾) secepatnya! Jangan pukul Sel Imun (🛡️)!';
    document.getElementById('minigame-score-val').innerText = '0';

    let stage = document.getElementById('minigame-stage-body');
    let html = '<div class="mg-whack-grid">';
    for (let i = 0; i < 9; i++) {
        html += '<div class="mg-whack-hole" id="mg-hole-' + i + '" onclick="window.pukulLubangVirus(' + i + ')"></div>';
    }
    html += '</div>';
    stage.innerHTML = html;

    window.mgWhackScore = 0;

    let spawnIv = setInterval(function() {
        let holes = document.querySelectorAll('.mg-whack-hole');
        holes.forEach(function(h) {
            h.innerText = '';
            h.className = 'mg-whack-hole';
            h.removeAttribute('data-type');
        });

        let countSpawn = Math.random() > 0.45 ? 2 : 1;
        for (let c = 0; c < countSpawn; c++) {
            let rIdx = Math.floor(Math.random() * 9);
            let hole = document.getElementById('mg-hole-' + rIdx);
            if (hole) {
                let isGood = Math.random() < 0.22;
                hole.innerText = isGood ? '🛡️' : (Math.random() > 0.5 ? '🦠' : '👾');
                hole.className = 'mg-whack-hole ' + (isGood ? 'active-good' : 'active-virus');
                hole.setAttribute('data-type', isGood ? 'good' : 'virus');
            }
        }
    }, 700);
    window.minigameActiveTimers.push(spawnIv);

    window.jalankanTimerMiniGame(20, function() {
        window.selesaikanMiniGameDenganHadiah('Selesai! Kamu berhasil membasmi ' + window.mgWhackScore + ' virus!');
    });
};

window.pukulLubangVirus = function(idx) {
    let hole = document.getElementById('mg-hole-' + idx);
    if (!hole) return;
    let tipe = hole.getAttribute('data-type');
    if (!tipe) return;

    hole.removeAttribute('data-type');
    if (tipe === 'virus') {
        window.mgWhackScore++;
        hole.innerText = '💥';
    } else {
        window.mgWhackScore = Math.max(0, window.mgWhackScore - 1);
        hole.innerText = '⚠️';
    }
    hole.className = 'mg-whack-hole';
    document.getElementById('minigame-score-val').innerText = String(window.mgWhackScore);
};

// GAME 3: SIMON SAYS (8 - 10 KETUKAN)
window.buatPolaSimonBeragam = function(panjangKetukan) {
    let poolWajib = [0, 1, 2, 3, 0, 1, 2, 3];
    while (poolWajib.length < panjangKetukan) {
        poolWajib.push(Math.floor(Math.random() * 4));
    }
    for (let i = poolWajib.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = poolWajib[i];
        poolWajib[i] = poolWajib[j];
        poolWajib[j] = temp;
    }
    for (let k = 2; k < poolWajib.length; k++) {
        if (poolWajib[k] === poolWajib[k - 1] && poolWajib[k] === poolWajib[k - 2]) {
            poolWajib[k] = (poolWajib[k] + 1 + Math.floor(Math.random() * 3)) % 4;
        }
    }
    return poolWajib;
};

window.mulaiGame3SimonSays = function() {
    let targetKetukan = 8 + Math.floor(Math.random() * 3);
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

// GAME 4: SUSUN KATA PENGETAHUAN UMUM
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
    let hurufAcak = hurufAsli.slice().sort(function() { return Math.random() - 0.5; });
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

window.renderUIBioAnagram = function() {
    let st = window.mgAnagramState;
    let stage = document.getElementById('minigame-stage-body');
    if (!st || !stage) return;

    let currentWord = st.pickedIndices.map(function(i) { return st.shuffled[i]; }).join('');

    let slotsHtml = '';
    for (let i = 0; i < st.target.length; i++) {
        let char = currentWord[i] || '';
        slotsHtml += '<div class="mg-anagram-slot" onclick="window.hapusHurufTerakhirAnagram()">' + char + '</div>';
    }

    let tilesHtml = '';
    st.shuffled.forEach(function(ch, idx) {
        let isUsed = st.pickedIndices.includes(idx) ? ' used' : '';
        tilesHtml += '<button type="button" class="mg-anagram-tile' + isUsed + '" onclick="window.pilihHurufAnagram(' + idx + ')">' + ch + '</button>';
    });

    stage.innerHTML =
        '<div style="background:#fef9e7; border:1px solid #f9e79f; padding:10px 14px; border-radius:8px; font-size:12px; color:#9a3412; text-align:center; width:100%; box-sizing:border-box;">' +
            '💡 <b>Petunjuk:</b> "' + st.hint + '"' +
        '</div>' +
        '<div class="mg-anagram-slots">' + slotsHtml + '</div>' +
        '<div class="mg-anagram-tiles">' + tilesHtml + '</div>' +
        '<div style="margin-top:14px;">' +
            '<button type="button" class="minigame-skip-btn" onclick="window.hapusHurufTerakhirAnagram()">⌫ Hapus Huruf</button>' +
        '</div>';

    if (currentWord.length === st.target.length) {
        if (currentWord === st.target) {
            let t = setTimeout(function() {
                window.selesaikanMiniGameDenganHadiah('Tepat sekali! Jawabannya adalah ' + st.target + '!');
            }, 250);
            window.minigameActiveTimers.push(t);
        } else {
            let t = setTimeout(function() {
                st.pickedIndices = [];
                window.renderUIBioAnagram();
            }, 450);
            window.minigameActiveTimers.push(t);
        }
    }
};

window.pilihHurufAnagram = function(idx) {
    let st = window.mgAnagramState;
    if (!st || st.pickedIndices.includes(idx)) return;
    if (st.pickedIndices.length < st.target.length) {
        st.pickedIndices.push(idx);
        window.renderUIBioAnagram();
    }
};

window.hapusHurufTerakhirAnagram = function() {
    let st = window.mgAnagramState;
    if (!st || st.pickedIndices.length === 0) return;
    st.pickedIndices.pop();
    window.renderUIBioAnagram();
};

// GAME 5: TAP THE GOOD CELLS
window.mulaiGame5TapGoodCells = function() {
    document.getElementById('minigame-title').innerText = '🛡️ 5. Tap the Good Cells!';
    document.getElementById('minigame-subtitle').innerText = 'Tap Sel Baik (🛡️/💊/🧬) dan hindari Racun/Patogen (🦠/☠️)!';
    document.getElementById('minigame-score-val').innerText = '0';

    let stage = document.getElementById('minigame-stage-body');
    stage.innerHTML = '<div id="mg-cells-arena" class="mg-cells-arena"></div>';

    window.mgCellsScore = 0;

    let spawnIv = setInterval(function() {
        let arena = document.getElementById('mg-cells-arena');
        if (!arena) return;

        let cell = document.createElement('div');
        let isGood = Math.random() < 0.72;
        let goodIcons = ['🛡️', '💊', '🧬'];
        let badIcons = ['🦠', '☠️'];

        cell.className = 'mg-floating-cell ' + (isGood ? 'good-cell' : 'bad-cell');
        cell.innerText = isGood
            ? goodIcons[Math.floor(Math.random() * goodIcons.length)]
            : badIcons[Math.floor(Math.random() * badIcons.length)];

        let maxX = Math.max(20, arena.clientWidth - 54);
        let maxY = Math.max(20, arena.clientHeight - 54);
        cell.style.left = Math.floor(Math.random() * maxX) + 'px';
        cell.style.top = Math.floor(Math.random() * maxY) + 'px';

        cell.onclick = function() {
            if (isGood) {
                window.mgCellsScore++;
                cell.innerText = '✨';
            } else {
                window.mgCellsScore = Math.max(0, window.mgCellsScore - 1);
                cell.innerText = '💥';
            }
            document.getElementById('minigame-score-val').innerText = String(window.mgCellsScore);
            setTimeout(function() { if (cell.parentNode) cell.remove(); }, 120);
        };

        arena.appendChild(cell);

        let removeTimer = setTimeout(function() {
            if (cell.parentNode) cell.remove();
        }, 1600);
        window.minigameActiveTimers.push(removeTimer);
    }, 520);
    window.minigameActiveTimers.push(spawnIv);

    window.jalankanTimerMiniGame(20, function() {
        window.selesaikanMiniGameDenganHadiah('Selesai! Kamu berhasil mengumpulkan ' + window.mgCellsScore + ' Sel Baik!');
    });
};

// GAME 6: CARI 5 PERBEDAAN GAMBAR
window.DAFTAR_TEMA_SPOT_DIFF = [
    {
        judul: "Pemandangan Pagi di Pegunungan",
        baseSVG:
            '<rect x="0" y="0" width="240" height="170" fill="#bae6fd"/>' +
            '<polygon points="10,135 75,55 140,135" fill="#64748b"/>' +
            '<polygon points="75,55 57,78 93,78" fill="#f8fafc"/>' +
            '<polygon points="95,135 165,45 235,135" fill="#475569"/>' +
            '<rect x="0" y="130" width="240" height="40" fill="#4ade80"/>' +
            '<rect x="35" y="95" width="46" height="36" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>' +
            '<polygon points="30,95 58,72 86,95" fill="#ef4444"/>' +
            '<rect x="190" y="102" width="10" height="30" fill="#78350f"/>' +
            '<circle cx="195" cy="92" r="18" fill="#16a34a"/>',
        diffs: [
            { id: 0, x: 35, y: 30, r: 20, svgA: '<circle cx="35" cy="30" r="14" fill="#facc15"/>', svgB: '<circle cx="35" cy="30" r="14" fill="#fb923c"/>' },
            { id: 1, x: 120, y: 32, r: 22, svgA: '<ellipse cx="120" cy="32" rx="18" ry="9" fill="#ffffff"/>', svgB: '' },
            { id: 2, x: 58, y: 115, r: 18, svgA: '<rect x="52" y="108" width="12" height="23" fill="#92400e"/>', svgB: '<rect x="52" y="108" width="12" height="23" fill="#2563eb"/>' },
            { id: 3, x: 195, y: 88, r: 20, svgA: '<circle cx="189" cy="88" r="3.5" fill="#ef4444"/><circle cx="201" cy="94" r="3.5" fill="#ef4444"/>', svgB: '' },
            { id: 4, x: 135, y: 150, r: 20, svgA: '<circle cx="135" cy="150" r="6" fill="#ec4899"/><circle cx="135" cy="150" r="2.5" fill="#facc15"/>', svgB: '<circle cx="135" cy="150" r="6" fill="#a855f7"/><circle cx="135" cy="150" r="2.5" fill="#ffffff"/>' }
        ]
    },
    {
        judul: "Meja Belajar & Eksperimen",
        baseSVG:
            '<rect x="0" y="0" width="240" height="170" fill="#f1f5f9"/>' +
            '<rect x="0" y="125" width="240" height="45" fill="#d97706"/>' +
            '<rect x="75" y="45" width="85" height="58" rx="5" fill="#1e293b" stroke="#475569" stroke-width="3"/>' +
            '<rect x="108" y="103" width="18" height="16" fill="#64748b"/>' +
            '<rect x="92" y="118" width="50" height="7" rx="3" fill="#475569"/>' +
            '<rect x="15" y="25" width="45" height="6" fill="#78350f"/>' +
            '<rect x="185" y="96" width="22" height="28" rx="3" fill="#ef4444"/>',
        diffs: [
            { id: 0, x: 195, y: 32, r: 22, svgA: '<circle cx="195" cy="32" r="15" fill="#ffffff" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="195" y2="21" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="203" y2="32" stroke="#0f172a" stroke-width="2"/>', svgB: '<circle cx="195" cy="32" r="15" fill="#fef08a" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="195" y2="21" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="186" y2="32" stroke="#0f172a" stroke-width="2"/>' },
            { id: 1, x: 37, y: 16, r: 20, svgA: '<rect x="22" y="8" width="9" height="17" fill="#3b82f6"/><rect x="33" y="6" width="9" height="19" fill="#10b981"/>', svgB: '<rect x="22" y="8" width="9" height="17" fill="#3b82f6"/>' },
            { id: 2, x: 117, y: 74, r: 22, svgA: '<circle cx="117" cy="74" r="12" fill="#38bdf8"/>', svgB: '<polygon points="117,60 131,86 103,86" fill="#f43f5e"/>' },
            { id: 3, x: 196, y: 83, r: 20, svgA: '<path d="M192,92 Q190,82 195,76 M200,92 Q198,82 203,76" stroke="#94a3b8" stroke-width="2" fill="none"/>', svgB: '' },
            { id: 4, x: 42, y: 145, r: 22, svgA: '<rect x="25" y="140" width="36" height="8" rx="3" fill="#22c55e"/>', svgB: '<rect x="25" y="140" width="36" height="8" rx="3" fill="#a855f7"/>' }
        ]
    },
    {
        judul: "Petualangan Bawah Laut",
        baseSVG:
            '<rect x="0" y="0" width="240" height="170" fill="#0284c7"/>' +
            '<rect x="0" y="140" width="240" height="30" fill="#fde047"/>' +
            '<ellipse cx="115" cy="75" rx="45" ry="24" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>' +
            '<rect x="105" y="40" width="16" height="14" fill="#eab308"/>' +
            '<rect x="105" y="36" width="24" height="6" rx="2" fill="#ca8a04"/>' +
            '<path d="M25,140 Q18,115 28,95 Q35,115 28,140" fill="#16a34a"/>' +
            '<path d="M38,140 Q45,118 36,102 Q28,118 38,140" fill="#15803d"/>',
        diffs: [
            { id: 0, x: 115, y: 75, r: 20, svgA: '<circle cx="115" cy="75" r="10" fill="#bae6fd" stroke="#0369a1" stroke-width="2"/>', svgB: '<rect x="105" y="65" width="20" height="20" rx="3" fill="#bae6fd" stroke="#0369a1" stroke-width="2"/>' },
            { id: 1, x: 64, y: 75, r: 18, svgA: '<polygon points="70,75 56,64 56,86" fill="#ef4444"/>', svgB: '<polygon points="70,75 56,64 56,86" fill="#22c55e"/>' },
            { id: 2, x: 195, y: 45, r: 22, svgA: '<ellipse cx="195" cy="45" rx="14" ry="8" fill="#fb923c"/><polygon points="209,45 220,38 220,52" fill="#fb923c"/>', svgB: '<ellipse cx="195" cy="45" rx="14" ry="8" fill="#f472b6"/><polygon points="209,45 220,38 220,52" fill="#f472b6"/>' },
            { id: 3, x: 48, y: 38, r: 20, svgA: '<circle cx="48" cy="45" r="5" fill="#e0f2fe"/><circle cx="54" cy="32" r="3.5" fill="#e0f2fe"/>', svgB: '' },
            { id: 4, x: 180, y: 148, r: 20, svgA: '<polygon points="180,136 184,145 194,146 186,152 188,161 180,156 172,161 174,152 166,146 176,145" fill="#f97316"/>', svgB: '' }
        ]
    }
];

window.mulaiGame6SpotDiff = function() {
    let temaList = window.DAFTAR_TEMA_SPOT_DIFF;
    let tema = temaList[Math.floor(Math.random() * temaList.length)];

    document.getElementById('minigame-title').innerText = '🔍 6. Cari 5 Perbedaan Gambar';
    document.getElementById('minigame-subtitle').innerText = 'Sentuh/klik langsung pada 5 bagian yang berbeda antara Gambar 1 dan Gambar 2!';
    document.getElementById('minigame-score-val').innerText = '0/5';

    window.mgSpotState = { tema: tema, foundIds: [] };
    window.renderUISpotDiff();

    window.jalankanTimerMiniGame(45, function() {
        window.selesaikanMiniGameDenganHadiah('Waktu selesai! Kamu menemukan ' + window.mgSpotState.foundIds.length + ' dari 5 perbedaan!');
    });
};

window.renderUISpotDiff = function() {
    let st = window.mgSpotState;
    let stage = document.getElementById('minigame-stage-body');
    if (!st || !stage) return;

    let diffLayerA = '', diffLayerB = '', ringsLayer = '';
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
            if (dist <= (d.r || 22)) hitDiff = d;
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

// =========================================================================
// 6. MESIN PRINTER UNIVERSAL SOAL (PDF & WORD)
// =========================================================================
window.cetakDokumenUniversal = function(format, judul, dataSoal) {
    if (!dataSoal || dataSoal.length === 0) return alert("Belum ada soal untuk dicetak!");

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">';
    html += '<head><meta charset="utf-8"><title>' + judul + '</title>';
    html += '<style>';
    html += '@page { size: A4; margin: 1in; } ';
    html += 'body { font-family: "Times New Roman", Times, serif; font-size: 10pt; color: #000; line-height: 1.5; margin: 0; padding: 0; } ';
    html += 'h1 { font-size: 12pt; font-weight: bold; text-align: center; margin-bottom: 20pt; } ';
    html += '.soal-item { margin-bottom: 15pt; page-break-inside: avoid; } ';
    html += '.soal-teks { margin-bottom: 5pt; } ';
    html += '.opsi-list { list-style-type: none; padding-left: 15pt; margin: 0; } ';
    html += '.opsi-item { margin-bottom: 3pt; } ';
    html += '.titik-isian { letter-spacing: 2pt; font-weight: normal; } ';
    html += '</style></head><body>';
    html += '<h1>' + judul + '</h1>';

    dataSoal.forEach(function(q, i) {
        html += '<div class="soal-item">';
        let qText = q.question || '';
        let opsiArr = Array.isArray(q.options) ? q.options : [];

        if (q.type === 'IS' || q.type === 'short_answer' || (q.type !== 'Essay' && opsiArr.length === 0)) {
            qText += ' <span class="titik-isian">....................</span>';
        } else if (q.type === 'Essay') {
            qText += '<br><br><span class="titik-isian">....................................................................................................</span><br><span class="titik-isian">....................................................................................................</span><br><span class="titik-isian">....................................................................................................</span>';
        }

        html += '<div class="soal-teks">' + (i + 1) + '. ' + qText + '</div>';

        if (opsiArr.length > 0 && q.type !== 'IS' && q.type !== 'Essay') {
            html += '<ul class="opsi-list">';
            opsiArr.forEach(function(opt, optIdx) {
                let label = opt.label || String.fromCharCode(65 + optIdx);
                let text = opt.text || opt;
                html += '<li class="opsi-item">' + label + '. ' + text + '</li>';
            });
            html += '</ul>';
        }
        html += '</div>';
    });

    html += '</body></html>';

    if (format === 'word') {
        let blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        let url = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = url;
        link.download = judul.replace(/[^a-z0-9]/gi, '_') + '.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (format === 'pdf') {
        let printWin = window.open('', '', 'width=800,height=600');
        printWin.document.write(html);
        printWin.document.close();
        printWin.focus();
        setTimeout(function() {
            printWin.print();
            printWin.close();
        }, 500);
    }
};

window.cetakKuisPDF = function(containerId, judul) {
    let soalArr = [];
    if (containerId.indexOf('inline-kuis-') === 0) {
        let idx = containerId.split('-')[2];
        soalArr = window.contentBlocksData[idx].questions;
    } else {
        soalArr = window.sesiLatihanSiswa ? window.sesiLatihanSiswa.soal : (window.sesiUjianSiswa ? window.sesiUjianSiswa.soal : []);
    }
    window.cetakDokumenUniversal('pdf', judul || 'Kuis', soalArr);
};

window.exportWordKuis = function(containerId, judul) {
    let soalArr = [];
    if (containerId.indexOf('inline-kuis-') === 0) {
        let idx = containerId.split('-')[2];
        soalArr = window.contentBlocksData[idx].questions;
    } else {
        soalArr = window.sesiLatihanSiswa ? window.sesiLatihanSiswa.soal : (window.sesiUjianSiswa ? window.sesiUjianSiswa.soal : []);
    }
    window.cetakDokumenUniversal('word', judul || 'Kuis', soalArr);
};

// =========================================================================
// 7. OBSERVER MODAL GERBANG LATIHAN & BANNER PANEN XP
// =========================================================================
document.addEventListener("DOMContentLoaded", function() {
    window.pastikanBannerPanenXPLatihanAda();
    let modalEnterLat = document.getElementById('modal-enter-latihan');
    if (modalEnterLat) {
        let obsEnterLat = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.target.id === 'modal-enter-latihan' && m.target.style.display === 'flex') {
                    window.renderDropdownLatihan();
                }
            });
        });
        obsEnterLat.observe(modalEnterLat, { attributes: true, attributeFilter: ['style'] });
    }
});