/* =========================================================================
   MODUL RUANG ADMINISTRASI GURU, KELOLA AKUN MULTI-GURU, DATA KELAS & SISWA,
   LEDGER AKADEMIK, REMEDIAL TERPADU, ABSENSI PERTEMUAN, & AGENDA MENGAJAR
   ========================================================================= */

window.adminData = window.adminData || {};
window.kelasAktifAdmin = window.kelasAktifAdmin || "";
window.adminAbsensiData = window.adminAbsensiData || {};
window.adminAgendaData = window.adminAgendaData || {};
window.targetCatatanSiswa = { kls: "", nama: "" };

// =========================================================================
// 1. RUANG ADMINISTRASI GURU & KELOLA AKUN MULTI-GURU (SUPER ADMIN)
// =========================================================================
window.bukaModalAdministrasi = function() {
    window.bukaModal('modal-administrasi');

    let username = (sessionStorage.getItem("username") || "mahardika").toLowerCase();
    let btnAkun = document.getElementById('btn-kelola-akun');
    let badgeGuru = document.getElementById('badge-ruang-guru-aktif');

    if (badgeGuru) {
        badgeGuru.innerText = "👤 Ruang Guru: " + username;
    }

    if (username === "mahardika" && btnAkun) {
        btnAkun.style.display = 'block';
        window.renderDaftarAkunGuru();
    } else if (btnAkun) {
        btnAkun.style.display = 'none';
    }
};

window.bukaTabAdmin = function(tabId, btnElement) {
    document.querySelectorAll('.admin-tab-content').forEach(function(el) {
        el.style.display = 'none';
    });

    let targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.style.display = 'block';

    document.querySelectorAll('.tab-admin-btn').forEach(function(btn) {
        if (btn.id !== 'btn-kelola-akun') {
            btn.style.background = '#ffffff';
            let isRemed = btn.innerText.indexOf('Remedial') !== -1;
            let isArsip = btn.innerText.indexOf('Backup') !== -1;
            btn.style.color = isRemed ? '#c0392b' : (isArsip ? '#16a085' : '#333');
            btn.style.border = isRemed ? '1px solid #f5b7b1' : (isArsip ? '1px solid #a3e4d7' : '1px solid #ccc');
            btn.style.boxShadow = 'none';
        }
    });

    if (btnElement && btnElement.id !== 'btn-kelola-akun') {
        btnElement.style.background = '#0b3954';
        btnElement.style.color = 'white';
        btnElement.style.border = 'none';
    }

    if (tabId === 'tab-ledger' && typeof window.renderLedgerSiswa === "function") {
        window.renderLedgerSiswa();
    } else if (tabId === 'tab-remedial-admin' && typeof window.renderRemedialTabAdmin === "function") {
        window.renderRemedialTabAdmin();
    } else if (tabId === 'tab-notifikasi-admin' && typeof window.renderDaftarNotifAdmin === "function") {
        window.renderDaftarNotifAdmin();
    } else if (tabId === 'tab-kelola-akun' && typeof window.renderDaftarAkunGuru === "function") {
        window.renderDaftarAkunGuru();
    } else if (tabId === 'tab-backup-arsip' && typeof window.renderTabBackupArsipAdmin === "function") {
        window.renderTabBackupArsipAdmin();
    }
};

window.salinLinkSiswaGuru = function(targetUsername) {
    let guruUser = (targetUsername || sessionStorage.getItem("username") || window.guruAktif || "mahardika").toLowerCase();
    let baseUrl = window.location.origin + window.location.pathname;
    let linkSiswa = guruUser === "mahardika"
        ? baseUrl + "?bab=home"
        : baseUrl + "?guru=" + encodeURIComponent(guruUser) + "&bab=home";

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(linkSiswa).then(function() {
            alert("🔗 Link Siswa berhasil disalin!\n\n" + linkSiswa + "\n\nBagikan link ini kepada siswa agar mereka langsung masuk ke ruang belajar \"" + guruUser + "\".");
        }).catch(function() {
            prompt("Salin link khusus siswa di bawah ini:", linkSiswa);
        });
    } else {
        prompt("Salin link khusus siswa di bawah ini:", linkSiswa);
    }
};

window.simpanAkunGuruBaru = function() {
    if (sessionStorage.getItem("username") !== "mahardika") return alert("Hanya Admin Utama yang dapat mengelola akun guru!");

    let nama = document.getElementById('input-guru-nama').value.trim();
    let userRaw = document.getElementById('input-guru-user').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    let pass = document.getElementById('input-guru-pass').value.trim();

    if (!nama || !userRaw || !pass) return alert("Nama Guru, Username, dan Password wajib diisi lengkap!");
    if (userRaw === "mahardika" || userRaw === "sbd") return alert("Username tersebut tidak bisa digunakan!");
    if (pass.length < 6) return alert("Password minimal 6 karakter untuk keamanan Firebase!");

    let emailBaru = userRaw + "@guru.com";
    let btn = document.querySelector('#tab-kelola-akun .btn-action');
    let oldText = btn.innerText;

    btn.innerText = "⏳ Mengamankan di Firebase...";
    btn.disabled = true;

    window.buatAkunAuthGuru(emailBaru, pass, function() {
        if (!window.daftarAkunGuru) window.daftarAkunGuru = {};
        window.daftarAkunGuru[userRaw] = {
            nama: nama, username: userRaw, password: pass, dibuat: new Date().toISOString()
        };

        document.getElementById('input-guru-nama').value = "";
        document.getElementById('input-guru-user').value = "";
        document.getElementById('input-guru-pass').value = "";

        window.renderDaftarAkunGuru();
        if (typeof window.simpanDaftarAkunGuruKeDB === "function") window.simpanDaftarAkunGuruKeDB();

        btn.innerText = oldText;
        btn.disabled = false;
        alert("✅ Akun guru berhasil dibuat dan dilindungi Firebase Auth tingkat tinggi!");
    }, function() {
        btn.innerText = oldText;
        btn.disabled = false;
        alert("❌ Gagal membuat akun: Username sudah dipakai atau koneksi terputus.");
    });
};

window.renderDaftarAkunGuru = function() {
    let tbody = document.getElementById('body-daftar-akun-guru');
    if (!tbody) return;

    let daftar = window.daftarAkunGuru || {};
    let keys = Object.keys(daftar).sort();

    if (keys.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#7f8c8d;">Belum ada akun guru tambahan yang terdaftar.</td></tr>';
        return;
    }

    let html = '';
    keys.forEach(function(uKey, idx) {
        let g = daftar[uKey];
        html += '<tr>' +
            '<td style="font-weight:bold; color:#7f8c8d;">' + (idx + 1) + '</td>' +
            '<td style="text-align:left; font-weight:bold; color:#2c3e50;">' + (g.nama || uKey) + '</td>' +
            '<td><span style="background:#eaf2f8; color:#2980b9; padding:3px 8px; border-radius:4px; font-weight:bold;">' + uKey + '</span></td>' +
            '<td style="font-family:monospace; font-weight:bold; color:#333;">' + (g.password || '') + '</td>' +
            '<td>' +
                '<div style="display:flex; gap:6px; justify-content:center;">' +
                    '<button style="background:#2980b9; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="window.salinLinkSiswaGuru(\'' + uKey + '\')">🔗 Link Siswa</button>' +
                    '<button style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="window.hapusAkunGuru(\'' + uKey + '\')">🗑️ Hapus</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    });

    tbody.innerHTML = html;
};

window.hapusAkunGuru = function(uKey) {
    if (!window.daftarAkunGuru || !window.daftarAkunGuru[uKey]) return;
    if (confirm('Hapus akses login untuk akun guru "' + uKey + '"?')) {
        delete window.daftarAkunGuru[uKey];
        window.renderDaftarAkunGuru();
        if (typeof window.simpanDaftarAkunGuruKeDB === "function") {
            window.simpanDaftarAkunGuruKeDB();
        }
    }
};

// =========================================================================
// 2. KELOLA DATA KELAS, SISWA, & SINKRONISASI AKUN OTOMATIS
// =========================================================================
window.sinkronkanAkunSiswaDariAdminData = function() {
    if (!window.akunSiswaLoaded || !window.adminDataLoaded) return;

    if (!window.akunSiswaData) window.akunSiswaData = {};
    if (!window.adminData) return;

    let isModified = false;
    let usernamesUsed = Object.keys(window.akunSiswaData);

    Object.keys(window.adminData).forEach(function(kls) {
        let siswaArr = window.adminData[kls] || [];
        siswaArr.forEach(function(namaLengkap) {
            let cleanNama = String(namaLengkap || "").trim().toLowerCase();
            if (!cleanNama) return;

            let alreadyHasAccount = usernamesUsed.some(function(u) {
                let ak = window.akunSiswaData[u];
                return ak && String(ak.namaLengkap || "").trim().toLowerCase() === cleanNama && ak.kelas === kls;
            });

            if (!alreadyHasAccount) {
                // Cek apakah siswa ini sudah punya data di Leaderboard sebelumnya agar username-nya tetap nyambung ke XP lamanya!
                let existingLbUser = null;
                if (window.leaderboardSiswaData) {
                    existingLbUser = Object.keys(window.leaderboardSiswaData).find(function(uKey) {
                        let lb = window.leaderboardSiswaData[uKey];
                        return lb && String(lb.namaLengkap || "").trim().toLowerCase() === cleanNama && lb.kelas === kls;
                    });
                }

                let newUser = existingLbUser;
                if (!newUser || usernamesUsed.includes(newUser)) {
                    let baseUser = namaLengkap.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                    if (!baseUser) baseUser = "siswa";
                    newUser = baseUser;
                    let counter = 2;
                    while (usernamesUsed.includes(newUser)) {
                        newUser = baseUser + counter;
                        counter++;
                    }
                }

                window.akunSiswaData[newUser] = {
                    kelas: kls,
                    namaLengkap: namaLengkap,
                    username: newUser,
                    gmail: "",
                    password: "123456",
                    dibuat: new Date().toISOString(),
                    isAutoGenerated: true
                };
                usernamesUsed.push(newUser);
                isModified = true;

                // Hanya inisialisasi leaderboard jika leaderboard sudah dimuat dari server dan siswa ini benar-benar belum ada datanya
                if (window.leaderboardLoaded && typeof window.simpanLeaderboardSiswaKeDB === "function") {
                    let sudahAdaLB = window.leaderboardSiswaData && (window.leaderboardSiswaData[newUser] || existingLbUser);
                    if (!sudahAdaLB) {
                        window.simpanLeaderboardSiswaKeDB(newUser, {
                            kelas: kls, namaLengkap: namaLengkap, xp: 0, xpTotal: 0, coin: 0, xpTersedia: 0, loginTerakhir: "", statSoal: { PG: 0, PGK: 0, IS: 0, Essay: 0 }
                        });
                    }
                }
            }
        });
    });

    if (isModified && typeof window.simpanSemuaAkunSiswaKeDB === "function") {
        window.simpanSemuaAkunSiswaKeDB();
    }
};

window.renderAdminData = function() {
    let htmlDropdown = '<option value="">-- Pilih Kelas --</option>';
    let htmlListKelas = '';
    let totalSiswaSemua = 0;

    let kelasArray = Object.keys(window.adminData || {}).sort();

    kelasArray.forEach(function(k) {
        let jml = (window.adminData[k] || []).length;
        totalSiswaSemua += jml;
        htmlDropdown += '<option value="' + k + '">' + k + '</option>';

        let isAktif = (k === window.kelasAktifAdmin) ? 'background:#e8f4f8; border-color:#3498db; border-left:4px solid #2980b9;' : 'background:#f8f9fa; border-color:#eee;';
        let safeK = k.replace(/'/g, "\\'");
        htmlListKelas +=
            '<li style="display:flex; justify-content:space-between; align-items:center; padding:10px 15px; border:1px solid transparent; border-radius:6px; cursor:pointer; transition:0.2s; ' + isAktif + '" onclick="pilihKelasAdmin(\'' + safeK + '\')">' +
                '<span style="font-weight:bold; color:#2c3e50;">🏫 ' + k + ' <span style="font-size:11px; color:#7f8c8d; font-weight:normal;">(' + jml + ' Siswa)</span></span>' +
                '<button style="background:#fadbd8; border:none; color:#c0392b; border-radius:4px; padding:4px 8px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="hapusKelasAdmin(\'' + safeK + '\', event)">🗑️ Hapus</button>' +
            '</li>';
    });

    let selKls = document.getElementById('admin-select-kelas');
    if (selKls) {
        selKls.innerHTML = htmlDropdown;
        if (window.kelasAktifAdmin) selKls.value = window.kelasAktifAdmin;
    }

    let listKls = document.getElementById('list-admin-kelas');
    if (listKls) listKls.innerHTML = htmlListKelas || '<p style="color:#7f8c8d; font-size:12px; text-align:center;">Belum ada kelas yang dibuat.</p>';

    let infoTotal = document.getElementById('admin-info-total-siswa');
    if (infoTotal) infoTotal.innerText = totalSiswaSemua;

    window.renderListSiswaAdmin();
};

window.pilihKelasAdmin = function(namaKelas) {
    if (!namaKelas) return;
    window.kelasAktifAdmin = namaKelas;
    let inpKkmTab = document.getElementById('input-kkm-remedial-admin');
    if (inpKkmTab) inpKkmTab.value = window.dapatkanKKMKelas(namaKelas);

    window.renderAdminData();
    if (typeof window.renderAbsensiAdmin === "function") window.renderAbsensiAdmin();
    if (typeof window.renderAgendaAdmin === "function") window.renderAgendaAdmin();
    if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
    if (typeof window.renderRemedialTabAdmin === "function") window.renderRemedialTabAdmin();
};

window.importDataSiswaLokal = async function(inputElem) {
    let file = inputElem.files[0];
    if (!file) return;
    let btn = inputElem.nextElementSibling;
    let oldTxt = btn.innerText;
    btn.innerText = "⏳ Mengekstrak...";
    btn.disabled = true;

    try {
        let extractedText = "";
        let ext = file.name.split('.').pop().toLowerCase();

        if (ext === "pdf") {
            if (!window.pdfjsLib) throw new Error("Mesin PDF.js belum dimuat.");
            let arrayBuffer = await file.arrayBuffer();
            let pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            for (let i = 1; i <= pdf.numPages; i++) {
                let page = await pdf.getPage(i);
                let content = await page.getTextContent();
                extractedText += content.items.map(function(item) { return item.str; }).join("\n") + "\n";
            }
        } else if (ext === "docx") {
            if (!window.mammoth) throw new Error("Mesin Mammoth.js belum dimuat.");
            let arrayBuffer = await file.arrayBuffer();
            let result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            extractedText = result.value;
        } else if (ext === "csv" || ext === "txt") {
            extractedText = await file.text();
        } else {
            throw new Error("Format file tidak didukung.");
        }

        let lines = extractedText.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 2; });
        let namaBersih = lines.map(function(line) {
            let cleanLine = line.replace(/^\d+[\.\)\,\s]+/, '').trim();
            cleanLine = cleanLine.replace(/[,;]+$/, '').trim();
            return cleanLine;
        }).filter(function(l) { return l.length > 2 && isNaN(l); });

        let textArea = document.getElementById('input-nama-siswa-massal');
        if (textArea.value.trim() !== "") textArea.value += "\n" + namaBersih.join('\n');
        else textArea.value = namaBersih.join('\n');

        alert("✅ Berhasil mengimpor " + namaBersih.length + " nama siswa.\n\nKlik tombol '+ Tambahkan Siswa ke Kelas Ini' untuk menyimpannya.");
    } catch (err) {
        console.error(err);
        alert("❌ Gagal membaca file: " + err.message);
    } finally {
        btn.innerText = oldTxt;
        btn.disabled = false;
        inputElem.value = "";
    }
};

window.renderListSiswaAdmin = function() {
    let labelKelas = document.getElementById('label-kelas-aktif');
    let labelTotal = document.getElementById('label-total-siswa-kelas');
    let listSiswa = document.getElementById('list-admin-siswa');
    if (!labelKelas || !labelTotal || !listSiswa) return;

    if (!window.kelasAktifAdmin || !window.adminData[window.kelasAktifAdmin]) {
        labelKelas.innerText = "Belum Dipilih"; labelKelas.style.color = "#e74c3c";
        labelTotal.innerText = "0";
        listSiswa.innerHTML = '<p style="color:#7f8c8d; font-size:12px; text-align:center; padding:20px; background:#f9f9f9; border-radius:6px;">Pilih kelas di sebelah kiri terlebih dahulu.</p>';
        return;
    }

    labelKelas.innerText = window.kelasAktifAdmin; labelKelas.style.color = "#2980b9";
    let siswaArr = window.adminData[window.kelasAktifAdmin];
    labelTotal.innerText = siswaArr.length;

    let akunTerdaftar = Object.values(window.akunSiswaData || {}).filter(function(ak) { return ak.kelas === window.kelasAktifAdmin; });

    let htmlSiswa = '';
    siswaArr.slice().sort().forEach(function(s, idx) {
        let cariAkun = akunTerdaftar.filter(function(ak) { return ak.namaLengkap.toLowerCase() === s.toLowerCase(); });
        let infoAkun = '';
        if (cariAkun.length > 1) {
            infoAkun = '<span style="background:#e74c3c; color:white; padding:2px 6px; border-radius:4px; font-size:9px; margin-left:6px;">⚠️ ' + cariAkun.length + ' Akun Ganda!</span>';
        } else if (cariAkun.length === 1) {
            infoAkun = '<span style="background:#2ecc71; color:white; padding:2px 6px; border-radius:4px; font-size:9px; margin-left:6px;">✓ Aktif (User: ' + cariAkun[0].username + ')</span>';
        } else {
            infoAkun = '<span style="background:#f1c40f; color:#0b3954; padding:2px 6px; border-radius:4px; font-size:9px; margin-left:6px;">⏳ Belum Registrasi</span>';
        }

        let safeS = s.replace(/'/g, "\\'");
        let userAktifSiswa = cariAkun.length > 0 ? cariAkun[0].username : '';
        let passSaatIni = cariAkun.length > 0 ? (cariAkun[0].password || '123456') : '123456';

        htmlSiswa +=
            '<li style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; border-bottom:1px dashed #eee; background:#fcfcfc; gap:8px; flex-wrap:wrap;">' +
                '<div style="font-size:13px; font-weight:bold; color:#333;">' +
                    '<span style="display:inline-block; width:20px; height:20px; background:#2c3e50; color:white; text-align:center; border-radius:50%; line-height:20px; font-size:10px; margin-right:10px;">' + (idx + 1) + '</span>' +
                    s + ' ' + infoAkun +
                '</div>' +
                '<div style="display:flex; gap:6px; align-items:center;">' +
                    (cariAkun.length > 1 ? '<button style="background:#e67e22; color:white; border:none; padding:4px 8px; font-size:10px; border-radius:4px; cursor:pointer; font-weight:bold;" onclick="window.bersihkanAkunGandaSiswa(\'' + safeS + '\')">🧹 Sortir Akun</button>' : '') +
                    '<button style="background:#2980b9; color:white; border:none; padding:4px 8px; font-size:10px; border-radius:4px; cursor:pointer; font-weight:bold;" title="Lihat Username & Reset Password Siswa (XP/Coin Tetap Aman)" onclick="window.resetPasswordSiswaAdmin(\'' + safeS + '\')">🔑 Reset Pass</button>' +
                    '<button style="background:none; color:#c0392b; border:none; font-size:11px; cursor:pointer; font-weight:bold;" onclick="hapusSiswaAdmin(\'' + safeS + '\')">🗑️ Hapus</button>' +
                '</div>' +
            '</li>';
    });

    listSiswa.innerHTML = htmlSiswa || '<p style="color:#7f8c8d; font-size:12px; text-align:center;">Kelas ini masih kosong. Silakan input nama siswa di atas.</p>';
};

window.resetPasswordSiswaAdmin = function(namaLengkap) {
    let kls = window.kelasAktifAdmin;
    if (!kls) return alert("Pilih kelas terlebih dahulu!");

    let cleanNama = String(namaLengkap || "").trim().toLowerCase();
    let userKey = Object.keys(window.akunSiswaData || {}).find(function(k) {
        let ak = window.akunSiswaData[k];
        return ak && ak.kelas === kls && String(ak.namaLengkap || "").trim().toLowerCase() === cleanNama;
    });

    // Jika akun belum terbuat, buatkan otomatis dengan mewarisi XP/Coin lama
    if (!userKey) {
        window.sinkronkanAkunSiswaDariAdminData();
        userKey = Object.keys(window.akunSiswaData || {}).find(function(k) {
            let ak = window.akunSiswaData[k];
            return ak && ak.kelas === kls && String(ak.namaLengkap || "").trim().toLowerCase() === cleanNama;
        });
    }

    if (!userKey || !window.akunSiswaData[userKey]) {
        return alert("⚠️ Data akun siswa belum ditemukan.");
    }

    let akun = window.akunSiswaData[userKey];
    let lb = (window.leaderboardSiswaData && window.leaderboardSiswaData[userKey]) ? window.leaderboardSiswaData[userKey] : null;
    let infoXP = lb ? ((Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0).toLocaleString('id-ID') + " XP") : "Tetap Aman";

    let passBaru = prompt(
        "🔑 KELOLA & RESET PASSWORD SISWA\n" +
        "----------------------------------------\n" +
        "Nama : " + akun.namaLengkap + "\n" +
        "Kelas : " + akun.kelas + "\n" +
        "Username Login : " + userKey + "\n" +
        "Password Saat Ini : " + (akun.password || "123456") + "\n" +
        "Data XP / Coin : " + infoXP + " (100% Terlindungi)\n" +
        "----------------------------------------\n" +
        "Ketik password baru di bawah ini (default: 123456):",
        "123456"
    );

    if (passBaru === null) return;
    passBaru = passBaru.trim();
    if (!passBaru) return alert("⚠️ Password tidak boleh kosong!");

    akun.password = passBaru;
    window.akunSiswaData[userKey] = akun;

    if (typeof window.simpanAkunSiswaKeDB === "function") {
        window.simpanAkunSiswaKeDB(userKey, akun, function() {
            window.renderListSiswaAdmin();
            alert("✅ Password untuk " + akun.namaLengkap + " berhasil direset!\n\nUsername: " + userKey + "\nPassword Baru: " + passBaru + "\n\nSeluruh data XP, Coin, dan progres siswa tetap utuh.");
        });
    } else if (typeof window.simpanSemuaAkunSiswaKeDB === "function") {
        window.simpanSemuaAkunSiswaKeDB();
        window.renderListSiswaAdmin();
        alert("✅ Password untuk " + akun.namaLengkap + " berhasil direset!\n\nUsername: " + userKey + "\nPassword Baru: " + passBaru);
    }
};

window.bersihkanAkunGandaSiswa = function(namaLengkap) {
    let akunGanda = Object.values(window.akunSiswaData || {}).filter(function(ak) {
        return ak.kelas === window.kelasAktifAdmin && ak.namaLengkap.toLowerCase() === namaLengkap.toLowerCase();
    });
    if (akunGanda.length <= 1) return;

    let pesan = "Ditemukan " + akunGanda.length + " akun untuk " + namaLengkap + ":\n\n";
    akunGanda.forEach(function(ak, i) {
        pesan += (i + 1) + ". Username: " + ak.username + " (Dibuat: " + (ak.dibuat ? ak.dibuat.split('T')[0] : 'Akun Lama') + ")\n";
    });
    pesan += "\nKetik angka nomor akun yang ingin DIHAPUS (Atau kosongkan untuk batal):";

    let pil = prompt(pesan);
    if (!pil || isNaN(pil)) return;

    let no = parseInt(pil) - 1;
    if (no >= 0 && no < akunGanda.length) {
        let userHapus = akunGanda[no].username;
        if (confirm("Yakin HAPUS permanen akses login untuk Username '" + userHapus + "'?")) {
            delete window.akunSiswaData[userHapus];
            if (window.leaderboardSiswaData && window.leaderboardSiswaData[userHapus]) {
                delete window.leaderboardSiswaData[userHapus];
            }
            window.renderListSiswaAdmin();
            if (typeof window.simpanSemuaAkunSiswaKeDB === "function") window.simpanSemuaAkunSiswaKeDB();
            alert("Akun ganda berhasil dihapus!");
        }
    }
};

window.tambahKelasAdmin = function() {
    let input = document.getElementById('input-nama-kelas-baru');
    let val = input.value.trim();
    if (!val) return;
    if (window.adminData[val]) return alert("Nama kelas sudah ada!");

    window.adminData[val] = [];
    window.kelasAktifAdmin = val;
    input.value = "";
    window.renderAdminData();
    if (typeof window.simpanAdminKeDB === "function") window.simpanAdminKeDB();
};

window.hapusKelasAdmin = function(namaKelas, e) {
    if (e) e.stopPropagation();
    if (confirm('Yakin ingin menghapus kelas ' + namaKelas + ' beserta seluruh siswanya?')) {
        delete window.adminData[namaKelas];
        if (window.kelasAktifAdmin === namaKelas) window.kelasAktifAdmin = "";
        window.renderAdminData();
        if (typeof window.simpanAdminKeDB === "function") window.simpanAdminKeDB();
    }
};

window.tambahSiswaAdmin = function() {
    if (!window.kelasAktifAdmin) return alert("Pilih kelas di daftar sebelah kiri terlebih dahulu!");
    let input = document.getElementById('input-nama-siswa-massal');
    let val = input.value.trim();
    if (!val) return;

    let baris = val.split('\n');
    let adaSiswaBaru = false;
    baris.forEach(function(b) {
        let nama = b.trim();
        if (nama && !window.adminData[window.kelasAktifAdmin].includes(nama)) {
            window.adminData[window.kelasAktifAdmin].push(nama);
            adaSiswaBaru = true;
        }
    });

    if (adaSiswaBaru) {
        input.value = "";
        window.renderAdminData();
        if (typeof window.simpanAdminKeDB === "function") window.simpanAdminKeDB();
    } else {
        alert("Siswa tersebut sudah ada di kelas ini.");
    }
};

window.hapusSiswaAdmin = function(namaSiswa) {
    if (confirm('Hapus ' + namaSiswa + ' dari kelas ' + window.kelasAktifAdmin + '?')) {
        window.adminData[window.kelasAktifAdmin] = window.adminData[window.kelasAktifAdmin].filter(function(s) { return s !== namaSiswa; });
        window.renderAdminData();
        if (typeof window.simpanAdminKeDB === "function") window.simpanAdminKeDB();
    }
};

// =========================================================================
// 3. LEDGER AKADEMIK SISWA & MANAJEMEN REMEDIAL TERPADU
// =========================================================================
window.dapatkanKKMKelas = function(namaKelas) {
    let n = (namaKelas || "").toUpperCase();
    if (n.includes('XII') || n.includes('12')) return 75;
    if (n.includes('XI') || n.includes('11')) return 73;
    if (n.includes('X') || n.includes('10')) return 71;
    return 70;
};

window.ambilKolomLedgerKelas = function(kls) {
    if (!kls) return [];
    let rekapData = window.ambilObjekRekapKelas(kls);
    if (!window.adminLedgerMetaData) window.adminLedgerMetaData = {};
    if (!window.adminLedgerMetaData[kls]) {
        window.adminLedgerMetaData[kls] = { kolom: [], dihapus: [] };
    }
    if (!Array.isArray(window.adminLedgerMetaData[kls].kolom)) {
        window.adminLedgerMetaData[kls].kolom = Object.values(window.adminLedgerMetaData[kls].kolom || {});
    }
    if (!Array.isArray(window.adminLedgerMetaData[kls].dihapus)) {
        window.adminLedgerMetaData[kls].dihapus = Object.values(window.adminLedgerMetaData[kls].dihapus || {});
    }

    let kolomAdaSafe = window.adminLedgerMetaData[kls].kolom.map(function(x) {
        return window.sanitasiKeyRekapFirebase(x).toLowerCase();
    });
    let dihapusSafe = window.adminLedgerMetaData[kls].dihapus.map(function(x) {
        return window.sanitasiKeyRekapFirebase(x).toLowerCase();
    });

    Object.keys(rekapData).forEach(function(pktKey) {
        let safeKey = window.sanitasiKeyRekapFirebase(pktKey).toLowerCase();
        if (!kolomAdaSafe.includes(safeKey) && !dihapusSafe.includes(safeKey)) {
            let sampelSiswa = Object.values(rekapData[pktKey] || {})[0];
            let labelPaket = (sampelSiswa && sampelSiswa.paketAsli) ? sampelSiswa.paketAsli : pktKey;
            window.adminLedgerMetaData[kls].kolom.push(labelPaket);
            kolomAdaSafe.push(safeKey);
        }
    });
    return window.adminLedgerMetaData[kls].kolom || [];
};

window.deteksiKategoriKolomLedger = function(namaKolom) {
    let low = (namaKolom || "").toLowerCase();
    if (/\b(sas|pas|pat|uas|akhir\s*semester|sumatif\s*akhir)\b/.test(low)) return 'SAS';
    if (/\b(kuis|quiz|tugas|latihan|praktikum)\b/.test(low)) return 'KUIS';
    return 'PH';
};

window.hitungNilaiAkhirRumusLedger = function(kls, namaSiswa, kolomUjian) {
    let sumKuis = 0, cntKuis = 0;
    let sumPH = 0, cntPH = 0;
    let sumSAS = 0, cntSAS = 0;
    let adaKolomKuis = false, adaKolomPH = false, adaKolomSAS = false;

    (kolomUjian || []).forEach(function(kol) {
        let kat = window.deteksiKategoriKolomLedger(kol);
        if (kat === 'KUIS') adaKolomKuis = true;
        else if (kat === 'SAS') adaKolomSAS = true;
        else adaKolomPH = true;

        let rekapPaket = window.ambilObjekRekapPaket(kls, kol);
        let dataSiswa = window.ambilDataSiswaDiObjekRekap(rekapPaket, namaSiswa);

        if (dataSiswa && dataSiswa.nilaiAkhir !== undefined) {
            let n = parseFloat(dataSiswa.nilaiAkhir);
            if (!isNaN(n)) {
                if (kat === 'KUIS') { sumKuis += n; cntKuis++; }
                else if (kat === 'SAS') { sumSAS += n; cntSAS++; }
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

window.renderLedgerSiswa = function() {
    let thead = document.getElementById('head-ledger-siswa');
    let tbody = document.getElementById('body-ledger-siswa');
    let label = document.getElementById('label-ledger-kelas');
    if (!tbody || !label || !thead) return;

    let kls = window.kelasAktifAdmin;
    if (!kls) {
        label.innerHTML = '<span style="color:#e74c3c;">Belum Dipilih</span>';
        tbody.innerHTML = '<tr><td colspan="10" style="padding:20px; color:#7f8c8d; font-weight:bold;">Pilih kelas di header atas terlebih dahulu.</td></tr>';
        return;
    }

    label.innerHTML = '<span style="color:#2980b9;">' + kls + '</span> <span style="font-size:11px; color:#16a085; font-weight:normal;">(Rumus NA: Rata-rata Kuis 40% + Rata-rata PH 30% + SAS 30%)</span>';
    let kkm = window.dapatkanKKMKelas(kls);
    let siswaArr = (window.adminData[kls] || []).slice().sort();

    let absData = (window.adminAbsensiData && window.adminAbsensiData[kls]) ? window.adminAbsensiData[kls] : { status: {} };
    let kolomUjian = window.ambilKolomLedgerKelas(kls);

    let theadHTML =
        '<tr>' +
            '<th rowspan="2" style="width:40px; background:#2c3e50; position:sticky; left:0; z-index:4;">No</th>' +
            '<th rowspan="2" style="text-align:left; background:#2c3e50; min-width:180px; position:sticky; left:40px; z-index:4;">Nama Siswa</th>';

    kolomUjian.forEach(function(kol, i) {
        let kat = window.deteksiKategoriKolomLedger(kol);
        let badgeKat = kat === 'KUIS' ? 'Kuis 40%' : (kat === 'SAS' ? 'SAS 30%' : 'PH 30%');
        theadHTML +=
            '<th rowspan="2" style="background:#34495e; min-width:105px; color:#f1c40f; padding:6px 8px;">' +
                '<div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">' +
                    '<span style="cursor:pointer; flex:1; text-align:center;" title="Klik untuk ubah nama kolom" onclick="window.editKolomUjianLedger(' + i + ')">✏️ ' + kol + '</span>' +
                    '<button type="button" style="background:rgba(231,76,60,0.25); color:#ff7675; border:1px solid rgba(231,76,60,0.5); border-radius:4px; padding:1px 5px; font-size:10px; cursor:pointer; font-weight:bold;" title="Hapus kolom ujian ini dari Ledger" onclick="event.stopPropagation(); window.hapusKolomUjianLedgerLangsung(' + i + ')">✕</button>' +
                '</div>' +
                '<div style="font-size:9px; color:#ecf0f1; font-weight:normal; margin-top:2px; opacity:0.85;">[' + badgeKat + ']</div>' +
            '</th>';
    });

    theadHTML +=
            '<th rowspan="2" style="background:#2c3e50; min-width:90px;" title="Rata-rata Kuis (40%) + Rata-rata PH (30%) + SAS (30%)">Nilai Akhir</th>' +
            '<th colspan="4" style="background:#2c3e50;">Kehadiran</th>' +
            '<th rowspan="2" style="background:#2c3e50; width:90px;">Aksi</th>' +
        '</tr>' +
        '<tr>' +
            '<th style="background:#27ae60; width:45px;">H</th>' +
            '<th style="background:#f39c12; width:45px;">S</th>' +
            '<th style="background:#2980b9; width:45px;">I</th>' +
            '<th style="background:#c0392b; width:45px;">A</th>' +
        '</tr>';
    thead.innerHTML = theadHTML;

    if (siswaArr.length === 0) {
        tbody.innerHTML = '<tr><td colspan="' + (8 + kolomUjian.length) + '" style="padding:20px; color:#e67e22; font-weight:bold;">Kelas ini belum memiliki daftar siswa.</td></tr>';
        return;
    }

    let html = '';
    let totalNilaiPerKolom = new Array(kolomUjian.length).fill(0);
    let countSiswaPerKolom = new Array(kolomUjian.length).fill(0);
    let totalNilaiAkhir = 0;
    let countSiswaAkhir = 0;

    siswaArr.forEach(function(nama, idx) {
        let statArr = (absData.status && absData.status[nama]) ? absData.status[nama] : [];
        let cH = 0, cS = 0, cI = 0, cA = 0;
        statArr.forEach(function(s) { if (s === 'H') cH++; else if (s === 'S') cS++; else if (s === 'I') cI++; else if (s === 'A') cA++; });

        let barisNilai = '';
        let safeNama = nama.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

        kolomUjian.forEach(function(kol, i) {
            let rekapPaket = window.ambilObjekRekapPaket(kls, kol);
            let dataSiswa = window.ambilDataSiswaDiObjekRekap(rekapPaket, nama);
            let hasEntry = Boolean(dataSiswa && dataSiswa.nilaiAkhir !== undefined);
            let n = hasEntry ? parseFloat(dataSiswa.nilaiAkhir) : 0;
            if (isNaN(n)) n = 0;

            if (hasEntry) {
                totalNilaiPerKolom[i] += n;
                countSiswaPerKolom[i]++;
            }

            let isDiBawahKKM = hasEntry && n < kkm;
            let safeKol = kol.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

            barisNilai += '<td style="font-weight:bold; color:' + (isDiBawahKKM ? '#c0392b' : '#2c3e50') + '; background:' + (isDiBawahKKM ? '#fadbd8' : 'transparent') + '; cursor:pointer;" onclick="window.editNilaiSiswaLedger(\'' + safeKol + '\', \'' + safeNama + '\', ' + (hasEntry ? n : 0) + ')" title="Klik untuk mengedit nilai manual">' + (hasEntry ? Number(n.toFixed(1)) : '-') + '</td>';
        });

        let hasilNA = window.hitungNilaiAkhirRumusLedger(kls, nama, kolomUjian);
        let nilaiAkhir = hasilNA.nilaiAkhir;
        if (hasilNA.adaNilai) {
            totalNilaiAkhir += nilaiAkhir;
            countSiswaAkhir++;
        }

        let isNA_KKM = hasilNA.adaNilai && nilaiAkhir < kkm;
        let safeKlsAttr = kls.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let bgRow = isNA_KKM ? '#fdf2f2' : '#ffffff';

        html +=
        '<tr style="border-bottom:1px solid #eee; background:' + bgRow + '">' +
            '<td style="color:#7f8c8d; font-weight:bold; position:sticky; left:0; background:' + bgRow + '; z-index:2;">' + (idx + 1) + '</td>' +
            '<td style="text-align:left; font-weight:bold; color:#2c3e50; position:sticky; left:40px; background:' + bgRow + '; z-index:2;">' + nama + '</td>' +
            barisNilai +
            '<td style="font-size:15px; font-weight:900; color:' + (isNA_KKM ? '#c0392b' : '#16a085') + ';">' + (hasilNA.adaNilai ? nilaiAkhir.toFixed(1) : '-') + '</td>' +
            '<td style="font-weight:bold; color:#27ae60;">' + cH + '</td>' +
            '<td style="font-weight:bold; color:#f39c12;">' + cS + '</td>' +
            '<td style="font-weight:bold; color:#2980b9;">' + cI + '</td>' +
            '<td style="font-weight:bold; color:#c0392b;">' + cA + '</td>' +
            '<td>' +
                '<button style="background:#f1c40f; color:#2c3e50; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="window.catatanSiswaBuka(\'' + safeKlsAttr + '\', \'' + safeNama + '\')">📝 Catatan</button>' +
            '</td>' +
        '</tr>';
    });

    html += '<tr style="background:#ecf0f1; font-weight:bold; border-top:2px solid #bdc3c7;">' +
        '<td colspan="2" style="text-align:right; color:#2c3e50; position:sticky; left:0; background:#ecf0f1; z-index:2; padding-right:12px;">Rata-rata Kelas :</td>';

    kolomUjian.forEach(function(kol, i) {
        let rata = countSiswaPerKolom[i] > 0 ? (totalNilaiPerKolom[i] / countSiswaPerKolom[i]) : 0;
        html += '<td style="color:#2980b9; font-size:14px; font-weight:800;">' + (countSiswaPerKolom[i] > 0 ? rata.toFixed(1) : '-') + '</td>';
    });

    let rataAkhir = countSiswaAkhir > 0 ? (totalNilaiAkhir / countSiswaAkhir) : 0;
    html +=
        '<td style="font-size:16px; color:#27ae60; font-weight:900;">' + (countSiswaAkhir > 0 ? rataAkhir.toFixed(1) : '-') + '</td>' +
        '<td colspan="5"></td>' +
    '</tr>';

    tbody.innerHTML = html;
    if (typeof window.renderRemedialTabAdmin === "function") {
        window.renderRemedialTabAdmin();
    }
};

window.tambahKolomUjianLedger = function() {
    let kls = window.kelasAktifAdmin;
    if (!kls) return alert("Pilih kelas di bagian atas terlebih dahulu!");
    let namaKolom = prompt("Masukkan nama kolom ujian/evaluasi baru:\n• Awali/beri kata 'Kuis' untuk bobot Kuis (40%)\n• Awali/beri kata 'PH' atau 'UH' untuk bobot PH (30%)\n• Awali/beri kata 'SAS' atau 'PAS' untuk bobot SAS (30%)");
    if (!namaKolom || !namaKolom.trim()) return;
    namaKolom = namaKolom.trim();

    let kolomArr = window.ambilKolomLedgerKelas(kls);
    let safeBaru = window.sanitasiKeyRekapFirebase(namaKolom).toLowerCase();
    let sudahAda = kolomArr.some(function(x) { return window.sanitasiKeyRekapFirebase(x).toLowerCase() === safeBaru; });
    if (sudahAda) return alert("Nama kolom ujian tersebut sudah ada di Ledger kelas ini!");

    if (Array.isArray(window.adminLedgerMetaData[kls].dihapus)) {
        window.adminLedgerMetaData[kls].dihapus = window.adminLedgerMetaData[kls].dihapus.filter(function(x) {
            return window.sanitasiKeyRekapFirebase(x).toLowerCase() !== safeBaru;
        });
    }
    window.adminLedgerMetaData[kls].kolom.push(namaKolom);
    window.renderLedgerSiswa();
    if (typeof window.simpanLedgerMetaKeDB === "function") window.simpanLedgerMetaKeDB();
};

window.hapusKolomUjianLedgerLangsung = function(idx) {
    let kls = window.kelasAktifAdmin;
    if (!kls || !window.adminLedgerMetaData || !window.adminLedgerMetaData[kls]) return;
    let oldName = window.adminLedgerMetaData[kls].kolom[idx];
    if (!oldName) return;

    if (confirm('Hapus kolom ujian "' + oldName + '" dari Ledger kelas ' + kls + ' beserta seluruh nilai di dalamnya?')) {
        window.adminLedgerMetaData[kls].kolom.splice(idx, 1);
        if (!Array.isArray(window.adminLedgerMetaData[kls].dihapus)) window.adminLedgerMetaData[kls].dihapus = [];
        if (!window.adminLedgerMetaData[kls].dihapus.includes(oldName)) {
            window.adminLedgerMetaData[kls].dihapus.push(oldName);
        }

        let safeKls = window.sanitasiKeyRekapFirebase(kls);
        let safeOld = window.sanitasiKeyRekapFirebase(oldName);
        if (window.adminRekapNilaiData) {
            if (window.adminRekapNilaiData[kls]) {
                delete window.adminRekapNilaiData[kls][oldName];
                delete window.adminRekapNilaiData[kls][safeOld];
            }
            if (window.adminRekapNilaiData[safeKls]) {
                delete window.adminRekapNilaiData[safeKls][oldName];
                delete window.adminRekapNilaiData[safeKls][safeOld];
            }
        }
        window.renderLedgerSiswa();
        if (typeof window.simpanLedgerMetaKeDB === "function") window.simpanLedgerMetaKeDB();
        if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
            window.kirimNilaiUjianAmanKeDB('admin_rekap_nilai/' + safeKls + '/' + safeOld, null);
        }
    }
};

window.editKolomUjianLedger = function(idx) {
    let kls = window.kelasAktifAdmin;
    if (!kls || !window.adminLedgerMetaData || !window.adminLedgerMetaData[kls]) return;
    let oldName = window.adminLedgerMetaData[kls].kolom[idx];
    if (!oldName) return;

    let action = prompt('Ubah nama kolom ujian "' + oldName + '":\n\n(Atau ketik HAPUS untuk menghapus kolom ini)', oldName);
    if (action === null) return;
    action = action.trim();

    if (action.toUpperCase() === "HAPUS") {
        window.hapusKolomUjianLedgerLangsung(idx);
    } else if (action !== "" && action !== oldName) {
        window.adminLedgerMetaData[kls].kolom[idx] = action;
        let safeKls = window.sanitasiKeyRekapFirebase(kls);
        let safeOld = window.sanitasiKeyRekapFirebase(oldName);
        let safeNew = window.sanitasiKeyRekapFirebase(action);

        let rekapKelas = window.ambilObjekRekapKelas(kls);
        let dataLama = rekapKelas[oldName] || rekapKelas[safeOld];
        if (dataLama) {
            Object.keys(dataLama).forEach(function(sKey) {
                if (dataLama[sKey]) {
                    dataLama[sKey].paketAsli = action;
                }
            });
            if (!window.adminRekapNilaiData[safeKls]) window.adminRekapNilaiData[safeKls] = {};
            window.adminRekapNilaiData[safeKls][safeNew] = dataLama;
            if (safeOld !== safeNew) delete window.adminRekapNilaiData[safeKls][safeOld];
            if (oldName !== safeNew) delete window.adminRekapNilaiData[safeKls][oldName];
            if (window.adminRekapNilaiData[kls] && kls !== safeKls) {
                delete window.adminRekapNilaiData[kls][oldName];
                delete window.adminRekapNilaiData[kls][safeOld];
            }
            if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
                window.kirimNilaiUjianAmanKeDB('admin_rekap_nilai/' + safeKls + '/' + safeNew, dataLama, function() {
                    if (safeOld !== safeNew) {
                        window.kirimNilaiUjianAmanKeDB('admin_rekap_nilai/' + safeKls + '/' + safeOld, null);
                    }
                });
            }
        }
        window.renderLedgerSiswa();
        if (typeof window.simpanLedgerMetaKeDB === "function") window.simpanLedgerMetaKeDB();
    }
};

window.editNilaiSiswaLedger = function(kolom, nama, nilaiLama) {
    let kls = window.kelasAktifAdmin;
    if (!kls) return;
    let n = prompt('Input / Edit Nilai Manual\nSiswa: ' + nama + '\nEvaluasi: ' + kolom + '\n\n(Kosongkan lalu klik OK jika ingin mengosongkan nilai)', nilaiLama > 0 ? nilaiLama : "");
    if (n === null) return;
    n = n.trim().replace(",", ".");

    let safeKls = window.sanitasiKeyRekapFirebase(kls);
    let safeKol = window.sanitasiKeyRekapFirebase(kolom);
    let safeNama = window.sanitasiKeyRekapFirebase(nama);
    let pathItem = 'admin_rekap_nilai/' + safeKls + '/' + safeKol + '/' + safeNama;

    if (!window.adminRekapNilaiData) window.adminRekapNilaiData = {};
    if (!window.adminRekapNilaiData[safeKls]) window.adminRekapNilaiData[safeKls] = {};
    if (!window.adminRekapNilaiData[safeKls][safeKol]) window.adminRekapNilaiData[safeKls][safeKol] = {};

    let rekapPaket = window.ambilObjekRekapPaket(kls, kolom);
    let existingObj = window.ambilDataSiswaDiObjekRekap(rekapPaket, nama);

    if (n === "") {
        delete window.adminRekapNilaiData[safeKls][safeKol][safeNama];
        delete window.adminRekapNilaiData[safeKls][safeKol][nama];
        window.renderLedgerSiswa();
        if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
            window.kirimNilaiUjianAmanKeDB(pathItem, null);
        }
    } else {
        let num = parseFloat(n);
        if (!isNaN(num) && num >= 0 && num <= 100) {
            let record = existingObj ? Object.assign({}, existingObj) : {
                namaAsli: nama,
                kelasAsli: kls,
                paketAsli: kolom,
                waktuKumpul: new Date().toISOString(),
                pelanggaran: 0
            };
            record.nilaiAkhir = num;
            window.adminRekapNilaiData[safeKls][safeKol][safeNama] = record;
            if (nama !== safeNama) delete window.adminRekapNilaiData[safeKls][safeKol][nama];
            window.renderLedgerSiswa();
            if (typeof window.kirimNilaiUjianAmanKeDB === "function") {
                window.kirimNilaiUjianAmanKeDB(pathItem, record);
            } else if (typeof window.simpanRekapNilaiPenuhKeDB === "function") {
                window.simpanRekapNilaiPenuhKeDB();
            }
        } else {
            return alert("⚠️ Masukkan angka nilai yang valid (0 - 100)!");
        }
    }
};

window.exportExcelLedgerSiswa = function() {
    if (!window.kelasAktifAdmin) return alert("Pilih kelas terlebih dahulu!");
    let kls = window.kelasAktifAdmin;
    let siswaArr = (window.adminData[kls] || []).slice().sort();
    if (siswaArr.length === 0) return alert("Belum ada siswa di kelas ini!");

    let absData = (window.adminAbsensiData && window.adminAbsensiData[kls]) ? window.adminAbsensiData[kls] : { status: {} };
    let kolomUjian = window.ambilKolomLedgerKelas(kls);

    let csv = "No,Nama Siswa,";
    kolomUjian.forEach(function(k) { csv += '"' + k + '",'; });
    csv += "Nilai Akhir (40% Kuis + 30% PH + 30% SAS),Hadir (H),Sakit (S),Izin (I),Alfa (A)\n";

    let totalNilaiPerKolom = new Array(kolomUjian.length).fill(0);
    let countSiswaPerKolom = new Array(kolomUjian.length).fill(0);
    let totalNilaiAkhir = 0;
    let countSiswaAkhir = 0;

    siswaArr.forEach(function(nama, idx) {
        let statArr = (absData.status && absData.status[nama]) ? absData.status[nama] : [];
        let cH = 0, cS = 0, cI = 0, cA = 0;
        statArr.forEach(function(s) { if (s === 'H') cH++; else if (s === 'S') cS++; else if (s === 'I') cI++; else if (s === 'A') cA++; });

        let barisNilai = "";
        kolomUjian.forEach(function(kol, i) {
            let rekapPaket = window.ambilObjekRekapPaket(kls, kol);
            let dataSiswa = window.ambilDataSiswaDiObjekRekap(rekapPaket, nama);
            let hasEntry = Boolean(dataSiswa && dataSiswa.nilaiAkhir !== undefined);
            let n = hasEntry ? parseFloat(dataSiswa.nilaiAkhir) : 0;
            barisNilai += (hasEntry ? n.toFixed(1) : '') + ",";
            if (hasEntry) {
                totalNilaiPerKolom[i] += n;
                countSiswaPerKolom[i]++;
            }
        });

        let hasilNA = window.hitungNilaiAkhirRumusLedger(kls, nama, kolomUjian);
        if (hasilNA.adaNilai) {
            totalNilaiAkhir += hasilNA.nilaiAkhir;
            countSiswaAkhir++;
        }
        csv += (idx + 1) + ',"' + nama + '",' + barisNilai + (hasilNA.adaNilai ? hasilNA.nilaiAkhir.toFixed(1) : '') + ',' + cH + ',' + cS + ',' + cI + ',' + cA + '\n';
    });

    csv += ',"RATA-RATA KELAS",';
    kolomUjian.forEach(function(kol, i) {
        let rata = countSiswaPerKolom[i] > 0 ? (totalNilaiPerKolom[i] / countSiswaPerKolom[i]).toFixed(1) : '';
        csv += rata + ',';
    });
    let rataAkhir = countSiswaAkhir > 0 ? (totalNilaiAkhir / countSiswaAkhir).toFixed(1) : '';
    csv += rataAkhir + ',,,,\n';

    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = 'Ledger_' + kls.replace(/\s+/g, '_') + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.renderRemedialTabAdmin = function() {
    let tbody = document.getElementById('body-remedial-tab-admin');
    let lblKls = document.getElementById('label-remedial-admin-kelas');
    let inpKkm = document.getElementById('input-kkm-remedial-admin');
    let badge = document.getElementById('badge-remedial-admin');
    if (!tbody) return;

    let kls = window.kelasAktifAdmin;
    if (!kls) {
        if (lblKls) lblKls.innerHTML = '<span style="color:#e74c3c;">Belum Dipilih</span>';
        if (badge) { badge.innerText = "0"; badge.style.background = "#95a5a6"; }
        tbody.innerHTML = '<tr><td colspan="6" style="padding:20px; color:#7f8c8d; font-weight:bold;">Pilih kelas di header atas terlebih dahulu.</td></tr>';
        return;
    }

    if (lblKls) lblKls.innerHTML = '<span style="color:#2980b9;">' + kls + '</span>';
    let defaultKkm = window.dapatkanKKMKelas(kls);
    if (inpKkm && !inpKkm.value) inpKkm.value = defaultKkm;
    let kkm = (inpKkm && parseFloat(inpKkm.value)) ? parseFloat(inpKkm.value) : defaultKkm;

    let siswaArr = (window.adminData[kls] || []).slice().sort();
    let kolomUjian = window.ambilKolomLedgerKelas(kls);

    let daftarRemed = [];
    siswaArr.forEach(function(nama) {
        kolomUjian.forEach(function(kol) {
            let rekapPaket = window.ambilObjekRekapPaket(kls, kol);
            let dataSiswa = window.ambilDataSiswaDiObjekRekap(rekapPaket, nama);
            if (dataSiswa && dataSiswa.nilaiAkhir !== undefined) {
                let n = parseFloat(dataSiswa.nilaiAkhir);
                if (!isNaN(n) && n < kkm) {
                    daftarRemed.push({ nama: nama, ujian: kol, nilai: n });
                }
            }
        });
    });

    if (badge) {
        badge.innerText = String(daftarRemed.length);
        badge.style.background = daftarRemed.length > 0 ? "#e74c3c" : "#27ae60";
    }

    if (daftarRemed.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding:25px; color:#27ae60; font-weight:bold; background:#e8f8f5;">🎉 Luar biasa! Seluruh siswa di kelas ' + kls + ' telah mencapai batas KKM (' + kkm + ') pada semua evaluasi.</td></tr>';
        return;
    }

    let html = '';
    daftarRemed.forEach(function(item, idx) {
        let safeKlsAttr = kls.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeNamaAttr = item.nama.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeUjianAttr = item.ujian.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

        html +=
        '<tr style="background:#fdf2f2; border-bottom:1px solid #fadbd8;">' +
            '<td style="color:#c0392b; font-weight:bold;">' + (idx + 1) + '</td>' +
            '<td style="text-align:left; font-weight:bold; color:#2c3e50;"><span style="background:#34495e; color:white; padding:3px 8px; border-radius:4px; font-size:11px;">' + item.ujian + '</span></td>' +
            '<td style="text-align:left; font-weight:bold; color:#c0392b;">' + item.nama + '</td>' +
            '<td style="font-size:15px; font-weight:900; color:#c0392b;">' + item.nilai.toFixed(1) + '</td>' +
            '<td style="font-size:14px; font-weight:bold; color:#d35400;">' + kkm + '</td>' +
            '<td>' +
                '<div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap;">' +
                    '<button style="background:#0b3954; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" title="Buka sesi ujian remedial CBT untuk evaluasi ini" onclick="window.aktifkanUjianRemedial(\'' + safeKlsAttr + '\', \'' + safeUjianAttr + '\', \'' + safeNamaAttr + '\', ' + kkm + ')">🚀 Mulai Remedial</button>' +
                    '<button style="background:#27ae60; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" title="Naikkan langsung ke nilai KKM di Ledger" onclick="window.tuntasRemedialSiswa(\'' + safeKlsAttr + '\', \'' + safeUjianAttr + '\', \'' + safeNamaAttr + '\', ' + kkm + ')">✅ Tuntas</button>' +
                    '<button style="background:#f1c40f; color:#2c3e50; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="window.catatanSiswaBuka(\'' + safeKlsAttr + '\', \'' + safeNamaAttr + '\')">📝 Catatan</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    });

    tbody.innerHTML = html;
};

window.updateModalRemedial = function() {
    let selKelas = document.getElementById('rem-select-kelas');
    let selPaket = document.getElementById('rem-select-paket');
    let kkmInput = document.getElementById('rem-input-kkm');
    if (!selKelas || !selPaket || !kkmInput) return;

    let kls = selKelas.value;
    if (!kls) {
        selPaket.innerHTML = '<option value="">-- Pilih Kelas Dahulu --</option>';
        window.renderDaftarRemedial();
        return;
    }

    kkmInput.value = window.dapatkanKKMKelas(kls);
    let kolomUjian = window.ambilKolomLedgerKelas(kls);
    let htmlOpt = '<option value="SEMUA">-- Semua Ujian di Kelas Ini --</option>';
    kolomUjian.forEach(function(k) { htmlOpt += '<option value="' + k + '">' + k + '</option>'; });

    selPaket.innerHTML = htmlOpt;
    window.renderDaftarRemedial();
};

window.renderDaftarRemedial = function() {
    let container = document.getElementById('rem-list-container');
    if (!container) return;

    let selKelas = document.getElementById('rem-select-kelas');
    let selPaket = document.getElementById('rem-select-paket');
    let inpKkm = document.getElementById('rem-input-kkm');

    let kls = (selKelas && selKelas.value) ? selKelas.value : window.kelasAktifAdmin;
    let pkt = (selPaket && selPaket.value) ? selPaket.value : "SEMUA";
    let kkm = (inpKkm && parseFloat(inpKkm.value)) ? parseFloat(inpKkm.value) : window.dapatkanKKMKelas(kls);

    if (!kls) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#7f8c8d;">Pilih kelas terlebih dahulu.</div>';
        return;
    }

    let siswaArr = (window.adminData[kls] || []).slice().sort();
    let kolomUjian = window.ambilKolomLedgerKelas(kls);

    let daftarRemed = [];
    siswaArr.forEach(function(nama) {
        kolomUjian.forEach(function(kol) {
            if (pkt !== "SEMUA" && pkt !== kol) return;
            let rekapPaket = window.ambilObjekRekapPaket(kls, kol);
            let dataSiswa = window.ambilDataSiswaDiObjekRekap(rekapPaket, nama);
            if (dataSiswa && dataSiswa.nilaiAkhir !== undefined) {
                let n = parseFloat(dataSiswa.nilaiAkhir);
                if (!isNaN(n) && n < kkm) daftarRemed.push({ nama: nama, ujian: kol, nilai: n });
            }
        });
    });

    if (daftarRemed.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#27ae60; border:1px dashed #27ae60; background:#e8f8f5; border-radius:8px; font-weight:bold;">🎉 Luar biasa! Tidak ada siswa yang perlu diremedial.</div>';
        return;
    }

    let htmlCards = '';
    daftarRemed.forEach(function(item) {
        let safeKlsAttr = kls.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeNamaAttr = item.nama.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeUjianAttr = item.ujian.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

        htmlCards +=
        '<div style="display:flex; justify-content:space-between; align-items:center; background:#fdf2f2; border:1px solid #fadbd8; border-left:4px solid #c0392b; padding:12px 15px; border-radius:8px;">' +
            '<div>' +
                '<div style="font-size:11px; color:#7f8c8d; margin-bottom:2px;"><span style="background:#34495e; color:white; padding:1px 5px; border-radius:3px;">' + item.ujian + '</span></div>' +
                '<div style="font-size:14px; font-weight:bold; color:#c0392b; margin-bottom:2px;">' + item.nama + '</div>' +
                '<div style="font-size:12px; color:#2c3e50;">Nilai Awal: <b style="color:#c0392b; font-size:14px;">' + item.nilai.toFixed(1) + '</b> &nbsp;|&nbsp; KKM: <b>' + kkm + '</b></div>' +
            '</div>' +
            '<div style="display:flex; gap:6px; flex-wrap:wrap;">' +
                '<button style="background:#0b3954; color:white; border:none; padding:6px 12px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" title="Buka ruang ujian (Kontrol Ujian) khusus siswa ini agar bisa remedial" onclick="window.aktifkanUjianRemedial(\'' + safeKlsAttr + '\', \'' + safeUjianAttr + '\', \'' + safeNamaAttr + '\', ' + kkm + ')">🚀 Mulai Remedial</button>' +
                '<button style="background:#27ae60; color:white; border:none; padding:6px 12px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" title="Luluskan paksa tanpa ujian ulang" onclick="window.tuntasRemedialSiswa(\'' + safeKlsAttr + '\', \'' + safeUjianAttr + '\', \'' + safeNamaAttr + '\', ' + kkm + ')">✅ Bypass KKM</button>' +
                '<button style="background:#f1c40f; color:#2c3e50; border:none; padding:6px 12px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="window.catatanSiswaBuka(\'' + safeKlsAttr + '\', \'' + safeNamaAttr + '\')">📝 Catatan</button>' +
            '</div>' +
        '</div>';
    });

    container.innerHTML = htmlCards;
};

window.tuntasRemedialSiswa = function(kls, ujian, nama, nilaiKkm) {
    if (confirm('Tandai TUNTAS REMEDIAL untuk ' + nama + ' pada evaluasi "' + ujian + '"?\n\nNilai di Ledger akan otomatis dinaikkan menjadi KKM (' + nilaiKkm + ').')) {
        let safeKls = window.sanitasiKeyRekapFirebase(kls);
        let safeUjian = window.sanitasiKeyRekapFirebase(ujian);
        let safeNama = window.sanitasiKeyRekapFirebase(nama);

        if (!window.adminRekapNilaiData) window.adminRekapNilaiData = {};
        if (!window.adminRekapNilaiData[safeKls]) window.adminRekapNilaiData[safeKls] = {};
        if (!window.adminRekapNilaiData[safeKls][safeUjian]) window.adminRekapNilaiData[safeKls][safeUjian] = {};

        let rekapPaket = window.ambilObjekRekapPaket(kls, ujian);
        let existingObj = window.ambilDataSiswaDiObjekRekap(rekapPaket, nama);

        let record = existingObj || {
            namaAsli: nama,
            kelasAsli: kls,
            paketAsli: ujian,
            waktuKumpul: "Remedial Tuntas",
            pelanggaran: 0
        };
        record.nilaiAkhir = parseFloat(nilaiKkm);
        window.adminRekapNilaiData[safeKls][safeUjian][safeNama] = record;

        window.renderLedgerSiswa();
        window.renderRemedialTabAdmin();
        window.renderDaftarRemedial();
        if (typeof window.simpanRekapNilaiPenuhKeDB === "function") window.simpanRekapNilaiPenuhKeDB();
    }
};

window.aktifkanUjianRemedial = function(kls, paket, nama, maxKkm) {
    if (typeof window.pastikanListenerBankUjianAktif === "function") {
        window.pastikanListenerBankUjianAktif();
    }
    let safePkt = window.sanitasiKeyRekapFirebase(paket);
    let targetPaketKey = (window.adminBankUjianData && window.adminBankUjianData[paket])
        ? paket
        : ((window.adminBankUjianData && window.adminBankUjianData[safePkt]) ? safePkt : null);

    if (!targetPaketKey) {
        return window.tampilkanCustomDialog("alert", "Bank Soal untuk ujian '" + paket + "' sudah tidak ada di Manajer Ujian. Silakan gunakan tombol '✅ Tuntas / Bypass KKM' atau buat kembali Bank Soalnya.", null, null);
    }

    window.tampilkanCustomDialog("confirm", "Aktifkan sesi ujian remedial '" + paket + "' untuk kelas " + kls + "?\n\n- Siswa akan melihat ini sebagai ujian normal.\n- Nilai yang masuk akan menimpa nilai lama di ledger yang sama.\n- Sistem akan membatasi nilai maksimalnya sebesar KKM (" + maxKkm + ").", null, function(isYes) {
        if (!isYes) return;

        let kodeUnik = "REM" + Math.floor(1000 + Math.random() * 9000);

        if (!window.adminUjianAktifData) window.adminUjianAktifData = {};
        window.adminUjianAktifData[kodeUnik] = {
            paket: targetPaketKey,
            kelas: kls,
            durasi: 90,
            waktuAktif: new Date().toISOString(),
            isRemedial: true,
            maxScore: maxKkm
        };

        if (typeof window.simpanUjianAktifKeDB === "function") window.simpanUjianAktifKeDB();

        window.tutupModal('modal-remedial');
        window.tutupModal('modal-administrasi');
        window.bukaModal('modal-manajer-ujian');
        window.bukaTabManajerUjian('tab-ujian-kontrol');

        setTimeout(function() {
            window.tampilkanCustomDialog("alert", "Ujian Remedial '" + paket + "' BERHASIL DIAKTIFKAN!\n\nKode Ujian untuk siswa: " + kodeUnik + "\nBagikan kode ini kepada " + nama + " (atau siswa lain di kelas " + kls + " yang remedial).", null, null);
        }, 500);
    });
};

window.bukaModalRemedial = function() {
    let selRekapKls = document.getElementById("filter-rekap-kelas");
    let kls = (selRekapKls && selRekapKls.value) ? selRekapKls.value : window.kelasAktifAdmin;
    let selKelas = document.getElementById("rem-select-kelas");

    let htmlOpt = '<option value="">-- Pilih Kelas --</option>';
    Object.keys(window.adminData || {}).sort().forEach(function(k) {
        let sel = (k === kls) ? "selected" : "";
        htmlOpt += '<option value="' + k + '" ' + sel + '>' + k + '</option>';
    });
    if (selKelas) selKelas.innerHTML = htmlOpt;

    window.updateModalRemedial();
    window.bukaModal("modal-remedial");
};

// =========================================================================
// 4. ABSENSI PERTEMUAN, CATATAN CHECKLIST SISWA, & AGENDA MENGAJAR
// =========================================================================
window.getTanggalHariIniAbsen = function() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
};

window.pastikanDataAbsensiKelas = function(kls) {
    if (!kls) return null;
    if (!window.adminAbsensiData[kls]) {
        window.adminAbsensiData[kls] = { tgl: [window.getTanggalHariIniAbsen()], status: {}, catatan: {} };
    }
    if (!Array.isArray(window.adminAbsensiData[kls].tgl)) {
        window.adminAbsensiData[kls].tgl = window.adminAbsensiData[kls].tgl ? Object.values(window.adminAbsensiData[kls].tgl) : [];
    }
    if (window.adminAbsensiData[kls].tgl.length === 0) {
        window.adminAbsensiData[kls].tgl.push(window.getTanggalHariIniAbsen());
    }
    if (!window.adminAbsensiData[kls].status) window.adminAbsensiData[kls].status = {};
    if (!window.adminAbsensiData[kls].catatan) window.adminAbsensiData[kls].catatan = {};

    let jmlPertemuan = window.adminAbsensiData[kls].tgl.length;
    let siswaArr = window.adminData[kls] || [];
    siswaArr.forEach(function(nama) {
        if (!Array.isArray(window.adminAbsensiData[kls].status[nama])) {
            window.adminAbsensiData[kls].status[nama] = window.adminAbsensiData[kls].status[nama]
                ? Object.values(window.adminAbsensiData[kls].status[nama])
                : [];
        }
        while (window.adminAbsensiData[kls].status[nama].length < jmlPertemuan) {
            window.adminAbsensiData[kls].status[nama].push('-');
        }
        if (!Array.isArray(window.adminAbsensiData[kls].catatan[nama])) {
            window.adminAbsensiData[kls].catatan[nama] = window.adminAbsensiData[kls].catatan[nama]
                ? Object.values(window.adminAbsensiData[kls].catatan[nama])
                : [];
        }
    });

    return window.adminAbsensiData[kls];
};

window.tambahPertemuanAbsensi = function() {
    let selKelas = document.getElementById('admin-select-kelas');
    let kls = (selKelas && selKelas.value) || window.kelasAktifAdmin;
    if (!kls) return alert("Pilih kelas terlebih dahulu!");

    let absData = window.pastikanDataAbsensiKelas(kls);
    absData.tgl.push(window.getTanggalHariIniAbsen());

    let siswaArr = window.adminData[kls] || [];
    siswaArr.forEach(function(nama) {
        if (!Array.isArray(absData.status[nama])) {
            absData.status[nama] = new Array(absData.tgl.length - 1).fill('-');
        }
        absData.status[nama].push('-');
    });

    window.renderAbsensiAdmin();
    if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();

    setTimeout(function() {
        let headTr = document.getElementById('head-absensi-pertemuan');
        let wrapScroll = headTr ? headTr.closest('div') : null;
        if (wrapScroll) {
            wrapScroll.scrollTo({ left: wrapScroll.scrollWidth, behavior: 'smooth' });
        }
    }, 60);
};

window.editTanggalAbsensi = function(pIndex) {
    let selKelas = document.getElementById('admin-select-kelas');
    let kls = (selKelas && selKelas.value) || window.kelasAktifAdmin;
    if (!kls || !window.adminAbsensiData[kls] || !window.adminAbsensiData[kls].tgl) return;

    let oldTgl = window.adminAbsensiData[kls].tgl[pIndex];

    window.tampilkanCustomDialog("prompt", "Ubah tanggal Pertemuan " + (pIndex + 1) + " (ketik HAPUS jika ingin menghapus kolom pertemuan ini):", oldTgl, function(newTgl) {
        if (newTgl === null) return;
        let bersih = newTgl.trim();
        if (bersih.toUpperCase() === "HAPUS") {
            window.hapusPertemuanAbsensi(pIndex);
            return;
        }
        if (bersih !== "") {
            window.adminAbsensiData[kls].tgl[pIndex] = bersih;
            window.renderAbsensiAdmin();
            if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
        }
    });
};

window.hapusPertemuanAbsensi = function(pIndex) {
    let selKelas = document.getElementById('admin-select-kelas');
    let kls = (selKelas && selKelas.value) || window.kelasAktifAdmin;
    if (!kls || !window.adminAbsensiData[kls] || !window.adminAbsensiData[kls].tgl) return;

    window.tampilkanCustomDialog("confirm", "Hapus kolom Pertemuan " + (pIndex + 1) + " (" + window.adminAbsensiData[kls].tgl[pIndex] + ")?", null, function(isYes) {
        if (!isYes) return;
        window.adminAbsensiData[kls].tgl.splice(pIndex, 1);
        let statusMap = window.adminAbsensiData[kls].status || {};
        Object.keys(statusMap).forEach(function(nama) {
            if (Array.isArray(statusMap[nama])) {
                statusMap[nama].splice(pIndex, 1);
            }
        });

        window.renderAbsensiAdmin();
        if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
    });
};

window.toggleStatusAbsensi = function(kls, nama, pIndex, el) {
    let absData = window.pastikanDataAbsensiKelas(kls);
    if (!absData || !absData.status[nama]) return;

    let statArr = ['-', 'H', 'S', 'I', 'A'];
    let current = absData.status[nama][pIndex] || '-';
    let nextIdx = (statArr.indexOf(current) + 1) % statArr.length;
    let nextStat = statArr[nextIdx];

    absData.status[nama][pIndex] = nextStat;

    let bgCol = nextStat === 'H' ? '#d5f5e3' : (nextStat === 'A' ? '#fadbd8' : (nextStat === 'S' ? '#fdebd0' : (nextStat === 'I' ? '#d6eaf8' : '#ffffff')));
    let txtCol = nextStat === 'H' ? '#1e8449' : (nextStat === 'A' ? '#c0392b' : (nextStat === 'S' ? '#d35400' : (nextStat === 'I' ? '#2980b9' : '#7f8c8d')));
    el.innerText = nextStat;
    el.style.background = bgCol;
    el.style.color = txtCol;

    let row = el.closest('tr');
    if (row) {
        let count = { H: 0, S: 0, I: 0, A: 0 };
        absData.status[nama].forEach(function(v) {
            if (count[v] !== undefined) count[v]++;
        });
        let cEls = row.querySelectorAll('.rekap-H, .rekap-S, .rekap-I, .rekap-A');
        if (cEls.length === 4) {
            cEls[0].innerText = count.H;
            cEls[1].innerText = count.S;
            cEls[2].innerText = count.I;
            cEls[3].innerText = count.A;
        }
    }

    clearTimeout(window.absenSaveTimer);
    window.absenSaveTimer = setTimeout(function() {
        if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
    }, 600);
};

window.setSemuaHadirAbsensi = function(pIndex) {
    let selKelas = document.getElementById("admin-select-kelas");
    let kls = (selKelas && selKelas.value) || window.kelasAktifAdmin;
    if (!kls || !window.adminAbsensiData[kls] || !window.adminAbsensiData[kls].tgl) return;

    let tgl = window.adminAbsensiData[kls].tgl[pIndex];
    let siswaArr = window.adminData[kls] || [];
    if (siswaArr.length === 0) return;

    window.tampilkanCustomDialog("confirm", "Set status 'Hadir (H)' untuk SEMUA SISWA pada Pertemuan " + (pIndex + 1) + " (" + tgl + ")?", null, function(isYes) {
        if (!isYes) return;
        let absData = window.pastikanDataAbsensiKelas(kls);
        siswaArr.forEach(function(nama) {
            absData.status[nama][pIndex] = "H";
        });
        window.renderAbsensiAdmin();
        if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
    });
};

window.pastikanModalCatatanSiswaAda = function() {
    if (document.getElementById('modal-catatan-siswa')) return;

    let modalEl = document.createElement('div');
    modalEl.id = 'modal-catatan-siswa';
    modalEl.className = 'modal-overlay';
    modalEl.onclick = function(e) {
        if (e.target === modalEl) window.tutupModal('modal-catatan-siswa');
    };

    modalEl.innerHTML =
        '<div class="modal-box" style="width: 460px; max-width: 94vw; max-height: 85vh; display: flex; flex-direction: column;">' +
            '<div class="modal-header" style="background:#fef9e7; border-bottom:1px solid #f9e79f; padding:14px 20px;">' +
                '<div>' +
                    '<h3 style="color:#d35400; margin:0; font-size:16px;">📝 Catatan Siswa</h3>' +
                    '<div id="subtitle-catatan-siswa" style="font-size:12px; color:#7f8c8d; font-weight:bold; margin-top:2px;"></div>' +
                '</div>' +
                '<button class="close-btn" onclick="window.tutupModal(\'modal-catatan-siswa\')">✕</button>' +
            '</div>' +
            '<div class="modal-body" style="padding:18px; display:flex; flex-direction:column; gap:12px; flex:1; overflow-y:auto;">' +
                '<div style="display:flex; gap:8px;">' +
                    '<input type="text" id="input-catatan-siswa-baru" class="input-box" placeholder="Tulis catatan baru lalu tekan Enter..." style="margin:0; flex:1;" onkeydown="if(event.key===\'Enter\'){event.preventDefault(); window.tambahItemCatatanSiswa();}">' +
                    '<button class="btn-action" style="background:#f39c12; width:auto; padding:8px 16px; white-space:nowrap;" onclick="window.tambahItemCatatanSiswa()">+ Tambah</button>' +
                '</div>' +
                '<div id="list-catatan-siswa-container" style="display:flex; flex-direction:column; gap:8px; margin-top:4px;"></div>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modalEl);
};

window.catatanSiswaBuka = function(kls, nama) {
    window.pastikanModalCatatanSiswaAda();
    window.pastikanDataAbsensiKelas(kls);
    window.targetCatatanSiswa = { kls: kls, nama: nama };

    let subEl = document.getElementById('subtitle-catatan-siswa');
    if (subEl) subEl.innerText = nama + " (" + kls + ")";

    let inp = document.getElementById('input-catatan-siswa-baru');
    if (inp) inp.value = "";

    window.renderListCatatanSiswa();
    window.bukaModal('modal-catatan-siswa');
    setTimeout(function() { if (inp) inp.focus(); }, 120);
};

window.renderListCatatanSiswa = function() {
    let container = document.getElementById('list-catatan-siswa-container');
    if (!container) return;

    let kls = window.targetCatatanSiswa.kls;
    let nama = window.targetCatatanSiswa.nama;
    if (!kls || !nama) return;

    let absData = window.pastikanDataAbsensiKelas(kls);
    let listCatatan = (absData.catatan && absData.catatan[nama]) ? absData.catatan[nama] : [];

    if (listCatatan.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:25px 15px; color:#95a5a6; font-size:12px; background:#f8f9fa; border:1px dashed #dcdde1; border-radius:8px;">Belum ada catatan untuk siswa ini.</div>';
        return;
    }

    let html = '';
    listCatatan.forEach(function(item, idx) {
        let isDone = Boolean(item.done);
        let textStyle = isDone ? 'text-decoration: line-through; color: #95a5a6;' : 'text-decoration: none; color: #2c3e50;';
        let bgStyle = isDone ? '#f8f9fa' : '#ffffff';
        let borderStyle = isDone ? '#e1e8ed' : '#f9e79f';
        let safeText = String(item.teks || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        html +=
            '<div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; background:' + bgStyle + '; border:1px solid ' + borderStyle + '; border-left:4px solid ' + (isDone ? '#95a5a6' : '#f1c40f') + '; border-radius:6px; transition:0.2s;">' +
                '<label style="display:flex; align-items:center; gap:10px; flex:1; cursor:pointer; font-size:13px; font-weight:600; word-break:break-word;">' +
                    '<input type="checkbox" ' + (isDone ? 'checked' : '') + ' style="width:17px; height:17px; cursor:pointer; accent-color:#27ae60; flex-shrink:0;" onchange="window.toggleCentangCatatanSiswa(' + idx + ')">' +
                    '<span style="' + textStyle + ' transition:0.15s;">' + safeText + '</span>' +
                '</label>' +
                '<button type="button" style="background:#fadbd8; color:#c0392b; border:none; border-radius:6px; width:28px; height:28px; cursor:pointer; font-size:12px; font-weight:bold; flex-shrink:0; display:flex; align-items:center; justify-content:center;" title="Hapus Catatan" onclick="window.hapusItemCatatanSiswa(' + idx + ')">🗑️</button>' +
            '</div>';
    });

    container.innerHTML = html;
};

window.tambahItemCatatanSiswa = function() {
    let inp = document.getElementById('input-catatan-siswa-baru');
    if (!inp) return;
    let teks = inp.value.trim();
    if (!teks) return;

    let kls = window.targetCatatanSiswa.kls;
    let nama = window.targetCatatanSiswa.nama;
    if (!kls || !nama) return;

    let absData = window.pastikanDataAbsensiKelas(kls);
    absData.catatan[nama].push({
        teks: teks,
        done: false,
        waktu: new Date().toISOString()
    });

    inp.value = "";
    window.renderListCatatanSiswa();
    window.renderAbsensiAdmin();
    if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
};

window.toggleCentangCatatanSiswa = function(idx) {
    let kls = window.targetCatatanSiswa.kls;
    let nama = window.targetCatatanSiswa.nama;
    if (!kls || !nama) return;

    let absData = window.pastikanDataAbsensiKelas(kls);
    if (!absData.catatan[nama] || !absData.catatan[nama][idx]) return;

    absData.catatan[nama][idx].done = !absData.catatan[nama][idx].done;
    window.renderListCatatanSiswa();
    window.renderAbsensiAdmin();
    if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
};

window.hapusItemCatatanSiswa = function(idx) {
    let kls = window.targetCatatanSiswa.kls;
    let nama = window.targetCatatanSiswa.nama;
    if (!kls || !nama) return;

    let absData = window.pastikanDataAbsensiKelas(kls);
    if (!absData.catatan[nama] || !absData.catatan[nama][idx]) return;

    absData.catatan[nama].splice(idx, 1);
    window.renderListCatatanSiswa();
    window.renderAbsensiAdmin();
    if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
};

window.renderAbsensiAdmin = function() {
    let tbody = document.getElementById('body-absensi-siswa');
    let thead = document.getElementById('head-absensi-pertemuan');
    let selKelas = document.getElementById('admin-select-kelas');

    if (!tbody || !thead || !selKelas) return;

    let tableEl = thead.closest('table');
    let scrollWrap = tableEl ? tableEl.parentElement : null;
    if (scrollWrap) {
        scrollWrap.style.overflowX = 'auto';
        scrollWrap.style.maxWidth = '100%';
        scrollWrap.style.webkitOverflowScrolling = 'touch';
    }
    if (tableEl) {
        tableEl.style.width = 'max-content';
        tableEl.style.minWidth = '100%';
        tableEl.style.borderCollapse = 'separate';
        tableEl.style.borderSpacing = '0';
    }

    let kls = selKelas.value || window.kelasAktifAdmin;
    if (kls && selKelas.value !== kls) selKelas.value = kls;

    let baseHeadHTML =
        '<th style="width:42px; min-width:42px; background:#2c3e50; color:white; text-align:center; position:sticky; left:0; z-index:6; border-right:1px solid #3e5871;">No</th>' +
        '<th style="text-align:left; background:#2c3e50; color:white; min-width:260px; position:sticky; left:42px; z-index:6; border-right:2px solid #bdc3c7;">Nama Siswa</th>';

    let endHeadHTML =
        '<th style="background:#27ae60; color:white; width:45px; min-width:45px; text-align:center;">H</th>' +
        '<th style="background:#f39c12; color:white; width:45px; min-width:45px; text-align:center;">S</th>' +
        '<th style="background:#2980b9; color:white; width:45px; min-width:45px; text-align:center;">I</th>' +
        '<th style="background:#c0392b; color:white; width:45px; min-width:45px; text-align:center;">A</th>';

    if (!kls) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:18px; color:#7f8c8d;">Pilih kelas terlebih dahulu.</td></tr>';
        thead.innerHTML = baseHeadHTML + endHeadHTML;
        document.getElementById('label-absensi-kelas').innerHTML = '<span style="color:#e74c3c;">Belum Dipilih</span>';
        return;
    }

    document.getElementById('label-absensi-kelas').innerHTML = '<span style="color:#2980b9;">' + kls + '</span>';

    let siswaArr = (window.adminData[kls] || []).slice().sort();
    if (siswaArr.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:18px; color:#e67e22;">Kelas ini belum memiliki siswa. Silakan input data siswa terlebih dahulu di tab Input Data Siswa & Kelas.</td></tr>';
        thead.innerHTML = baseHeadHTML + endHeadHTML;
        return;
    }

    let absData = window.pastikanDataAbsensiKelas(kls);
    let arrTgl = absData.tgl || [];

    let htmlHead = baseHeadHTML;
    arrTgl.forEach(function(t, pIndex) {
        htmlHead +=
            '<th style="background:#2c3e50; color:white; min-width:120px; padding:10px 8px 32px 8px; cursor:pointer; text-align:center; user-select:none; white-space:nowrap; position:relative; border-right:1px solid #3e5871;" onclick="window.editTanggalAbsensi(' + pIndex + ')" oncontextmenu="event.preventDefault(); window.hapusPertemuanAbsensi(' + pIndex + ');" title="Klik untuk ubah tanggal | Klik kanan untuk hapus kolom pertemuan">' +
                '<div style="font-size:12px; font-weight:700; margin-bottom:2px;">Pertemuan ' + (pIndex + 1) + '</div>' +
                '<div style="color:#f1c40f; font-size:11px; font-weight:700;">' + t + '</div>' +
                '<button type="button" onclick="event.stopPropagation(); window.setSemuaHadirAbsensi(' + pIndex + ')" style="position:absolute; bottom:6px; left:50%; transform:translateX(-50%); background:#27ae60; border:none; color:white; font-size:9px; padding:4px 8px; border-radius:12px; cursor:pointer; font-weight:bold; white-space:nowrap; box-shadow:0 2px 4px rgba(0,0,0,0.2);" title="Set status Hadir (H) untuk semua siswa">☑️ Hadir Semua</button>' +
            '</th>';
    });
    htmlHead += endHeadHTML;
    thead.innerHTML = htmlHead;

    let htmlBody = '';
    siswaArr.forEach(function(nama, idx) {
        let count = { H: 0, S: 0, I: 0, A: 0 };
        let cellsTgl = '';
        let safeNamaAttr = nama.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeKlsAttr = kls.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

        arrTgl.forEach(function(t, pIndex) {
            let statArray = absData.status[nama] || [];
            let val = statArray[pIndex] || '-';
            if (val === 'H') count.H++;
            else if (val === 'S') count.S++;
            else if (val === 'I') count.I++;
            else if (val === 'A') count.A++;

            let bgCol = val === 'H' ? '#d5f5e3' : (val === 'A' ? '#fadbd8' : (val === 'S' ? '#fdebd0' : (val === 'I' ? '#d6eaf8' : '#ffffff')));
            let txtCol = val === 'H' ? '#1e8449' : (val === 'A' ? '#c0392b' : (val === 'S' ? '#d35400' : (val === 'I' ? '#2980b9' : '#7f8c8d')));

            cellsTgl += '<td style="background:' + bgCol + '; color:' + txtCol + '; font-weight:bold; cursor:pointer; font-size:13px; transition:0.15s; text-align:center; min-width:120px; user-select:none;" onclick="window.toggleStatusAbsensi(\'' + safeKlsAttr + '\', \'' + safeNamaAttr + '\', ' + pIndex + ', this)">' + val + '</td>';
        });

        let catatanArr = (absData.catatan && absData.catatan[nama]) ? absData.catatan[nama] : [];
        let totalCatatan = catatanArr.length;
        let belumSelesai = catatanArr.filter(function(c) { return !c.done; }).length;
        let badgeCatatan = '';
        if (totalCatatan > 0) {
            let badgeBg = belumSelesai > 0 ? '#e74c3c' : '#27ae60';
            let badgeTxt = belumSelesai > 0 ? belumSelesai : '✓';
            badgeCatatan = ' <span style="background:' + badgeBg + '; color:white; padding:1px 5px; border-radius:10px; font-size:9px; margin-left:3px;">' + badgeTxt + '</span>';
        }

        let rowBg = (idx % 2 === 1) ? '#f8f9fa' : '#ffffff';

        htmlBody +=
            '<tr>' +
                '<td style="color:#7f8c8d; font-weight:bold; text-align:center; background:' + rowBg + '; position:sticky; left:0; z-index:4;">' + (idx + 1) + '</td>' +
                '<td style="text-align:left; font-weight:bold; color:#2c3e50; background:' + rowBg + '; position:sticky; left:42px; z-index:4; border-right:2px solid #e1e8ed; min-width:260px;">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px; width:100%;">' +
                        '<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + nama + '</span>' +
                        '<button type="button" style="background:#f1c40f; color:#2c3e50; border:none; padding:4px 10px; border-radius:5px; font-size:11px; font-weight:bold; cursor:pointer; flex-shrink:0; display:inline-flex; align-items:center; gap:4px; box-shadow:0 1px 3px rgba(0,0,0,0.12);" onclick="window.catatanSiswaBuka(\'' + safeKlsAttr + '\', \'' + safeNamaAttr + '\')">📝 Catatan' + badgeCatatan + '</button>' +
                    '</div>' +
                '</td>' +
                cellsTgl +
                '<td class="rekap-H" style="text-align:center; font-weight:bold; color:#27ae60;">' + count.H + '</td>' +
                '<td class="rekap-S" style="text-align:center; font-weight:bold; color:#f39c12;">' + count.S + '</td>' +
                '<td class="rekap-I" style="text-align:center; font-weight:bold; color:#2980b9;">' + count.I + '</td>' +
                '<td class="rekap-A" style="text-align:center; font-weight:bold; color:#c0392b;">' + count.A + '</td>' +
            '</tr>';
    });

    tbody.innerHTML = htmlBody;
};

window.renderAgendaAdmin = function() {
    let label = document.getElementById('label-agenda-kelas');
    let tbody = document.getElementById('body-agenda-mengajar');
    if (!label || !tbody) return;

    if (!window.kelasAktifAdmin) {
        label.innerText = "Belum Dipilih"; label.style.color = "#e74c3c";
        tbody.innerHTML = "<tr><td colspan='7' style='text-align:center; color:#7f8c8d; font-weight:bold; padding:20px;'>Pilih kelas terlebih dahulu.</td></tr>";
        return;
    }

    label.innerText = window.kelasAktifAdmin; label.style.color = "#2980b9";
    if (!window.adminAgendaData[window.kelasAktifAdmin]) window.adminAgendaData[window.kelasAktifAdmin] = [];

    let agendaArr = window.adminAgendaData[window.kelasAktifAdmin];

    let totalAgendaSemua = 0;
    Object.values(window.adminAgendaData).forEach(function(arr) { totalAgendaSemua += arr.length; });
    let infoAgenda = document.getElementById('admin-info-total-agenda');
    if (infoAgenda) infoAgenda.innerText = totalAgendaSemua;

    if (agendaArr.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7' style='text-align:center; color:#7f8c8d; padding:20px;'>Belum ada catatan agenda untuk kelas ini.</td></tr>";
        return;
    }

    let bHTML = '';
    agendaArr.forEach(function(item, idx) {
        bHTML += '<tr>' +
            '<td style="text-align:center; font-weight:bold; color:#7f8c8d;">' + (idx + 1) + '</td>' +
            '<td style="font-weight:600;">' + item.tgl + '</td>' +
            '<td style="text-align:center; font-weight:bold;">' + item.jp + '</td>' +
            '<td>' + item.materi + '</td>' +
            '<td>' + item.ket + '</td>' +
            '<td style="color:#16a085; font-weight:600;">' + item.rencana + '</td>' +
            '<td style="text-align:center;"><button style="background:none; color:#c0392b; border:none; cursor:pointer; font-size:14px;" onclick="hapusAgendaAdmin(' + idx + ')" title="Hapus Jurnal">🗑️</button></td>' +
        '</tr>';
    });
    tbody.innerHTML = bHTML;
};

window.tambahAgendaAdmin = function() {
    if (!window.kelasAktifAdmin) return alert("Pilih kelas di sebelah kiri terlebih dahulu!");
    let tgl = document.getElementById('agenda-tanggal').value;
    let jp = document.getElementById('agenda-jp').value;
    let materi = document.getElementById('agenda-materi').value.trim();
    let ket = document.getElementById('agenda-keterangan').value.trim();
    let rencana = document.getElementById('agenda-rencana').value.trim();

    if (!tgl || !jp || !materi) return alert("Tanggal, JP, dan Materi wajib diisi!");

    if (!window.adminAgendaData[window.kelasAktifAdmin]) window.adminAgendaData[window.kelasAktifAdmin] = [];

    window.adminAgendaData[window.kelasAktifAdmin].push({
        tgl: tgl, jp: jp, materi: materi, ket: ket, rencana: rencana
    });

    document.getElementById('agenda-materi').value = "";
    document.getElementById('agenda-keterangan').value = "";
    document.getElementById('agenda-rencana').value = "";

    window.renderAgendaAdmin();
    if (typeof window.simpanAgendaKeDB === "function") window.simpanAgendaKeDB();
};

window.hapusAgendaAdmin = function(idx) {
    if (confirm("Hapus catatan agenda ini?")) {
        window.adminAgendaData[window.kelasAktifAdmin].splice(idx, 1);
        window.renderAgendaAdmin();
        if (typeof window.simpanAgendaKeDB === "function") window.simpanAgendaKeDB();
    }
};

window.exportExcelAbsensi = function() {
    if (!window.kelasAktifAdmin || !window.adminData[window.kelasAktifAdmin] || window.adminData[window.kelasAktifAdmin].length === 0) {
        return alert("Pilih kelas yang memiliki data absensi terlebih dahulu!");
    }

    let absData = window.adminAbsensiData[window.kelasAktifAdmin] || { tgl: [], status: {} };
    let siswaArr = window.adminData[window.kelasAktifAdmin].slice().sort();

    let csvContent = "No,Nama Siswa,";
    absData.tgl.forEach(function(t, i) {
        csvContent += 'Pertemuan ' + (i + 1) + ' (' + t + '),';
    });
    csvContent += "Hadir,Sakit,Izin,Alfa\n";

    siswaArr.forEach(function(s, idx) {
        let row = (idx + 1) + ',"' + s + '",';
        let rekap = { 'H': 0, 'S': 0, 'I': 0, 'A': 0 };

        absData.tgl.forEach(function(t, i) {
            let stat = (absData.status[s] && absData.status[s][i]) ? absData.status[s][i] : '-';
            if (rekap[stat] !== undefined) rekap[stat]++;
            row += stat + ',';
        });

        row += rekap['H'] + ',' + rekap['S'] + ',' + rekap['I'] + ',' + rekap['A'] + '\n';
        csvContent += row;
    });

    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", 'Absensi_Kelas_' + window.kelasAktifAdmin + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.exportExcelAgenda = function() {
    if (!window.kelasAktifAdmin || !window.adminAgendaData[window.kelasAktifAdmin] || window.adminAgendaData[window.kelasAktifAdmin].length === 0) {
        return alert("Pilih kelas yang memiliki catatan agenda terlebih dahulu!");
    }

    let agendaArr = window.adminAgendaData[window.kelasAktifAdmin];
    let csvContent = "No,Tanggal,JP,Materi Pembelajaran,Keterangan,Rencana Berikutnya\n";

    agendaArr.forEach(function(item, idx) {
        csvContent += (idx + 1) + ',"' + item.tgl + '","' + item.jp + '","' + item.materi + '","' + item.ket + '","' + item.rencana + '"\n';
    });

    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", 'Agenda_Mengajar_Kelas_' + window.kelasAktifAdmin + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// =========================================================================
// 5. OBSERVER MODAL ADMINISTRASI GURU
// =========================================================================
document.addEventListener("DOMContentLoaded", function() {
    let modalAdm = document.getElementById('modal-administrasi');
    if (modalAdm) {
        let obsAdm = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.target.id === 'modal-administrasi' && m.target.style.display === 'flex') {
                    window.renderAdminData();
                    window.renderAbsensiAdmin();
                    window.renderAgendaAdmin();
                    if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
                    if (typeof window.renderRemedialTabAdmin === "function") window.renderRemedialTabAdmin();
                }
            });
        });
        obsAdm.observe(modalAdm, { attributes: true, attributeFilter: ['style'] });
    }
});

// =========================================================================
// 6. MODUL BACKUP JSON, RESTORE CADANGAN, & ARSIP TUTUP SEMESTER
// =========================================================================
window.NODE_BACKUP_SEMESTER = [
    "admin_data",
    "admin_rekap_nilai",
    "admin_ledger_meta",
    "admin_absensi",
    "admin_agenda",
    "admin_afektif_siswa",
    "admin_notifikasi",
    "admin_live_monitor",
    "admin_jadwal_kalender",
    "admin_catatan_guru",
    "admin_catatan_kelas"
];

window.NODE_BACKUP_PENUH = window.NODE_BACKUP_SEMESTER.concat([
    "admin_bank_ujian",
    "admin_bank_latihan",
    "akun_siswa",
    "leaderboard_siswa",
    "pages_struktur",
    "theme_settings",
    "popup_pengumuman",
    "materi_koleksi"
]);

window.OPSI_BERSIHKAN_SEMESTER = [
    {
        id: "rekap_nilai",
        nodes: ["admin_rekap_nilai", "admin_ledger_meta"],
        judul: "Rekap Nilai Ujian & Kolom Ledger",
        ket: "Menghapus seluruh hasil ujian semester lama & kolom evaluasi Ledger agar kuota download turun drastis.",
        checkedDefault: true
    },
    {
        id: "absensi",
        nodes: ["admin_absensi"],
        judul: "Data Absensi Pertemuan & Catatan Harian",
        ket: "Mereset tabel kehadiran pertemuan semester lalu (daftar nama kelas & siswa tetap utuh).",
        checkedDefault: true
    },
    {
        id: "agenda",
        nodes: ["admin_agenda"],
        judul: "Jurnal & Agenda Mengajar",
        ket: "Mengosongkan catatan jurnal pertemuan kelas semester sebelumnya.",
        checkedDefault: true
    },
    {
        id: "afektif",
        nodes: ["admin_afektif_siswa"],
        judul: "Rekaman Check-in Afektif Siswa",
        ket: "Membersihkan riwayat cerita refleksi harian siswa dari semester lalu.",
        checkedDefault: true
    },
    {
        id: "monitor_notif",
        nodes: ["admin_live_monitor", "admin_notifikasi"],
        judul: "Riwayat Live Monitor & Notifikasi Lama",
        ket: "Membersihkan sisa pantauan ujian lama dan pengumuman lonceng yang sudah lewat.",
        checkedDefault: true
    }
];

window.formatUkuranMemoriArsip = function(dataObj) {
    try {
        let str = JSON.stringify(dataObj || {});
        let bytes = str.length * 2;
        if (bytes < 1024) return bytes + " B";
        let kb = bytes / 1024;
        if (kb < 1024) return kb.toFixed(1) + " KB";
        return (kb / 1024).toFixed(2) + " MB";
    } catch (e) {
        return "0 KB";
    }
};

window.sinkronkanMemoriLokalDariNodeArsip = function(nodeName, val) {
    if (nodeName === "admin_data") window.adminData = val || {};
    else if (nodeName === "admin_rekap_nilai") window.adminRekapNilaiData = val || {};
    else if (nodeName === "admin_ledger_meta") window.adminLedgerMetaData = val || {};
    else if (nodeName === "admin_absensi") window.adminAbsensiData = val || {};
    else if (nodeName === "admin_agenda") window.adminAgendaData = val || {};
    else if (nodeName === "admin_afektif_siswa") window.adminAfektifData = Array.isArray(val) ? val : Object.values(val || {});
    else if (nodeName === "admin_notifikasi") window.adminNotifikasiData = Array.isArray(val) ? val : Object.values(val || {});
    else if (nodeName === "admin_live_monitor") window.adminLiveMonitorData = val || {};
    else if (nodeName === "admin_bank_ujian") window.adminBankUjianData = val || {};
    else if (nodeName === "admin_bank_latihan") window.adminBankLatihanData = val || {};
    else if (nodeName === "akun_siswa") window.akunSiswaData = val || {};
    else if (nodeName === "leaderboard_siswa") window.leaderboardSiswaData = val || {};
    else if (nodeName === "admin_jadwal_kalender") window.adminJadwalKalenderData = val || { excelHtml: "", events: {} };
    else if (nodeName === "admin_catatan_guru") window.adminCatatanGuruData = Array.isArray(val) ? val : Object.values(val || {});
    else if (nodeName === "admin_catatan_kelas") window.adminCatatanKelasData = val || {};
    else if (nodeName === "pages_struktur" && Array.isArray(val)) window.pagesData = val;
};

window.segarkanSemuaTabelSetelahArsip = function() {
    if (typeof window.renderAdminData === "function") window.renderAdminData();
    if (typeof window.renderAbsensiAdmin === "function") window.renderAbsensiAdmin();
    if (typeof window.renderAgendaAdmin === "function") window.renderAgendaAdmin();
    if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
    if (typeof window.renderRemedialTabAdmin === "function") window.renderRemedialTabAdmin();
    if (typeof window.renderDaftarNotifAdmin === "function") window.renderDaftarNotifAdmin();
    if (typeof window.renderRekapNilai === "function") window.renderRekapNilai();
    if (typeof window.renderTabBackupArsipAdmin === "function") window.renderTabBackupArsipAdmin();
};

window.renderTabBackupArsipAdmin = function() {
    let container = document.getElementById("tab-backup-arsip");
    if (!container) return;

    let guruAktif = (window.guruAktif || sessionStorage.getItem("username") || "mahardika").toLowerCase();
    let lastBackupInfo = localStorage.getItem("last_backup_mahardika_" + guruAktif) || "Belum pernah backup di perangkat ini";

    // Hitung ringkasan beban data saat ini
    let jmlKelas = Object.keys(window.adminData || {}).length;
    let jmlSiswa = 0;
    Object.values(window.adminData || {}).forEach(function(arr) { jmlSiswa += (arr || []).length; });

    let jmlEntriNilai = 0;
    Object.values(window.adminRekapNilaiData || {}).forEach(function(klsObj) {
        Object.values(klsObj || {}).forEach(function(pktObj) {
            jmlEntriNilai += Object.keys(pktObj || {}).length;
        });
    });

    let jmlAgenda = 0;
    Object.values(window.adminAgendaData || {}).forEach(function(arr) { jmlAgenda += (arr || []).length; });

    let jmlAfektif = Array.isArray(window.adminAfektifData) ? window.adminAfektifData.length : 0;
    let jmlBankUjian = Object.keys(window.adminBankUjianData || {}).length;

    let statsCards =
        '<div class="arsip-stat-grid">' +
            '<div class="arsip-stat-box">' +
                '<div class="arsip-stat-label">📊 Rekap Nilai Ujian</div>' +
                '<div class="arsip-stat-val">' + jmlEntriNilai + ' Entri</div>' +
                '<div class="arsip-stat-size">~ ' + window.formatUkuranMemoriArsip(window.adminRekapNilaiData) + '</div>' +
            '</div>' +
            '<div class="arsip-stat-box">' +
                '<div class="arsip-stat-label">📋 Absensi & Agenda</div>' +
                '<div class="arsip-stat-val">' + jmlKelas + ' Kls / ' + jmlAgenda + ' Agd</div>' +
                '<div class="arsip-stat-size">~ ' + window.formatUkuranMemoriArsip({ a: window.adminAbsensiData, b: window.adminAgendaData }) + '</div>' +
            '</div>' +
            '<div class="arsip-stat-box">' +
                '<div class="arsip-stat-label">💚 Check-in Afektif</div>' +
                '<div class="arsip-stat-val">' + jmlAfektif + ' Catatan</div>' +
                '<div class="arsip-stat-size">~ ' + window.formatUkuranMemoriArsip(window.adminAfektifData) + '</div>' +
            '</div>' +
            '<div class="arsip-stat-box">' +
                '<div class="arsip-stat-label">📦 Bank Ujian & Siswa</div>' +
                '<div class="arsip-stat-val">' + jmlBankUjian + ' Paket / ' + jmlSiswa + ' Siswa</div>' +
                '<div class="arsip-stat-size">~ ' + window.formatUkuranMemoriArsip(window.adminBankUjianData) + '</div>' +
            '</div>' +
        '</div>';

    let cekListHtml = "";
    window.OPSI_BERSIHKAN_SEMESTER.forEach(function(item) {
        cekListHtml +=
            '<label class="arsip-check-row">' +
                '<input type="checkbox" class="chk-arsip-wipe" value="' + item.id + '" ' + (item.checkedDefault ? 'checked' : '') + '>' +
                '<div>' +
                    '<div class="arsip-check-title">' + item.judul + '</div>' +
                    '<div class="arsip-check-desc">' + item.ket + '</div>' +
                '</div>' +
            '</label>';
    });

    let defaultLabelSem = "Semester_" + new Date().getFullYear();

    container.innerHTML =
        '<div class="arsip-header-strip">' +
            '<div>' +
                '<h4 style="margin:0; color:#0b3954; font-size:15px;">💾 Pusat Backup, Restore, & Arsip Semester</h4>' +
                '<div style="font-size:11.5px; color:#64748b; margin-top:2px;">Cadangkan seluruh data semester ke file JSON sebelum membersihkan database agar kuota Firebase tetap ringan.</div>' +
            '</div>' +
            '<div class="arsip-last-badge">🕒 Backup Terakhir: <b>' + lastBackupInfo + '</b></div>' +
        '</div>' +

        statsCards +

        '<div class="arsip-main-grid">' +
            '<!-- KARTU 1: EXPORT BACKUP JSON -->' +
            '<div class="arsip-card">' +
                '<h5 class="arsip-card-title" style="color:#0b3954;">📥 1. Unduh Cadangan Data (Backup .JSON)</h5>' +
                '<p class="arsip-card-desc">Beri nama label semester (misal: <b>Ganjil_2026_2027</b>) agar file arsip mudah ditemukan kembali di komputer atau Google Drive Anda.</p>' +
                '<label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Label Nama Arsip Semester:</label>' +
                '<input type="text" id="input-label-arsip-semester" class="input-box" value="' + defaultLabelSem + '" placeholder="Contoh: Ganjil_2026_2027" style="margin-bottom:12px; font-weight:700;">' +
                '<div id="status-progres-backup" class="arsip-progress-box" style="display:none;"></div>' +
                '<div style="display:flex; flex-direction:column; gap:8px;">' +
                    '<button type="button" id="btn-backup-semester-ringan" class="btn-action" style="background:#16a085; padding:10px; font-size:12.5px;" onclick="window.eksekusiBackupSemesterJSON(false)">📦 Backup Data Semester (Nilai, Absensi, Agenda, Afektif)</button>' +
                    '<button type="button" id="btn-backup-penuh-sistem" class="btn-action" style="background:#0b3954; padding:10px; font-size:12.5px;" onclick="window.eksekusiBackupSemesterJSON(true)">🗄️ Backup Penuh Seluruh Ruang Guru (+ Bank Soal & Materi)</button>' +
                '</div>' +
            '</div>' +

            '<!-- KARTU 2: RESTORE / PULIHKAN CADANGAN -->' +
            '<div class="arsip-card">' +
                '<h5 class="arsip-card-title" style="color:#2980b9;">♻️ 2. Pulihkan Data dari File Backup (Restore)</h5>' +
                '<p class="arsip-card-desc">Pilih file <b>.json</b> hasil backup sebelumnya untuk mengembalikan data nilai, absensi, agenda, bank soal, atau struktur kelas ke server Firebase.</p>' +
                '<div class="arsip-restore-drop">' +
                    '<div style="font-size:32px; margin-bottom:6px;">📂</div>' +
                    '<div style="font-size:12px; color:#475569; margin-bottom:10px;">Format didukung: File arsip <b>.json</b> resmi dari Sistem Belajar Mahardika.</div>' +
                    '<input type="file" id="input-file-restore-json" accept=".json,application/json" style="display:none;" onchange="window.prosesRestoreBackupJSON(this)">' +
                    '<button type="button" id="btn-pilih-file-restore" class="btn-action" style="background:#2980b9; width:auto; padding:9px 18px; font-size:12px; border-radius:20px;" onclick="document.getElementById(\'input-file-restore-json\').click()">📤 Pilih File Backup (.JSON)</button>' +
                '</div>' +
                '<div id="status-progres-restore" class="arsip-progress-box" style="display:none; margin-top:10px;"></div>' +
            '</div>' +
        '</div>' +

        '<!-- KARTU 3: TUTUP & BERSIHKAN SEMESTER LAMA -->' +
        '<div class="arsip-card arsip-danger-card">' +
            '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap; margin-bottom:10px;">' +
                '<div>' +
                    '<h5 class="arsip-card-title" style="color:#c0392b; margin-bottom:4px;">🧹 3. Tutup Semester & Bersihkan Data Lama (Hemat Kuota Firebase)</h5>' +
                    '<p class="arsip-card-desc" style="margin:0;">Pilih data transaksi semester lalu yang ingin dikosongkan. <b>Bank Soal, Materi Pelajaran, Daftar Kelas, Akun Siswa, XP Leaderboard, & My Pet 100% AMAN dan tidak akan dihapus.</b></p>' +
                '</div>' +
            '</div>' +
            '<div class="arsip-check-list">' + cekListHtml + '</div>' +
            '<div id="status-progres-wipe" class="arsip-progress-box" style="display:none; margin-bottom:10px;"></div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-top:12px; padding-top:12px; border-top:1px dashed #f5b7b1;">' +
                '<span style="font-size:11.5px; color:#991b1b; font-weight:700;">🛡️ Sistem otomatis mengunduh file backup pengaman sebelum membersihkan data.</span>' +
                '<button type="button" id="btn-eksekusi-tutup-semester" class="btn-action" style="background:#c0392b; width:auto; padding:10px 18px; font-size:12px; border-radius:8px;" onclick="window.eksekusiBersihkanSemesterLama()">🧹 Backup Otomatis & Bersihkan Data Terpilih</button>' +
            '</div>' +
        '</div>';
};

window.unduhObjekSebagaiFileJSON = function(objData, namaFile) {
    let jsonStr = JSON.stringify(objData, null, 2);
    let blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = namaFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
    return Math.max(1, Math.round(blob.size / 1024));
};

window.eksekusiBackupSemesterJSON = async function(modePenuh, silentOnSuccess) {
    if (typeof window.tarikDataBackupGuruRest !== "function") {
        alert("⚠️ Mesin backup REST Firebase belum termuat. Silakan muat ulang halaman.");
        return false;
    }

    let guruAktif = (window.guruAktif || sessionStorage.getItem("username") || "mahardika").toLowerCase();
    let inpLabel = document.getElementById("input-label-arsip-semester");
    let rawLabel = (inpLabel && inpLabel.value.trim()) ? inpLabel.value.trim() : ("Semester_" + new Date().getFullYear());
    let safeLabel = rawLabel.replace(/[^a-zA-Z0-9_-]/g, "_");

    let statusEl = document.getElementById("status-progres-backup");
    let btn1 = document.getElementById("btn-backup-semester-ringan");
    let btn2 = document.getElementById("btn-backup-penuh-sistem");

    if (btn1) btn1.disabled = true;
    if (btn2) btn2.disabled = true;
    if (statusEl) {
        statusEl.style.display = "block";
        statusEl.innerText = "⏳ Menyiapkan koneksi backup...";
    }

    try {
        let daftarNode = modePenuh ? window.NODE_BACKUP_PENUH : window.NODE_BACKUP_SEMESTER;
        let dataTerambil = await window.tarikDataBackupGuruRest(daftarNode, function(curr, total, namaNode) {
            if (statusEl) {
                statusEl.innerText = "⏳ Mengunduh data (" + curr + "/" + total + "): " + namaNode + "...";
            }
        });

        let now = new Date();
        let tglFile = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
        let waktuIndo = String(now.getDate()).padStart(2, "0") + "/" + String(now.getMonth() + 1).padStart(2, "0") + "/" + now.getFullYear() + " " +
                        String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

        let paketBackup = {
            meta: {
                app: "Mahardika",
                version: "1.0",
                mode: modePenuh ? "FULL_BACKUP" : "SEMESTER_ARCHIVE",
                guru: guruAktif,
                labelSemester: rawLabel,
                exportedAt: now.toISOString(),
                exportedLocal: waktuIndo
            },
            data: dataTerambil
        };

        let prefix = modePenuh ? "Backup_PENUH_Mahardika_" : "Arsip_Semester_Mahardika_";
        let namaFile = prefix + guruAktif + "_" + safeLabel + "_" + tglFile + ".json";
        let sizeKB = window.unduhObjekSebagaiFileJSON(paketBackup, namaFile);

        localStorage.setItem("last_backup_mahardika_" + guruAktif, waktuIndo + " (" + sizeKB + " KB)");

        if (statusEl) {
            statusEl.innerText = "✅ File arsip selesai diunduh: " + namaFile + " (" + sizeKB + " KB)";
        }
        if (!silentOnSuccess) {
            alert("✅ Backup berhasil diunduh!\n\nNama File: " + namaFile + "\nUkuran: " + sizeKB + " KB\n\nSimpan file JSON ini di folder arsip laptop atau Google Drive Anda.");
            window.renderTabBackupArsipAdmin();
        }
        return true;
    } catch (err) {
        console.error("Backup error:", err);
        if (statusEl) statusEl.innerText = "❌ Gagal membuat backup: " + (err ? err.message : "Koneksi terputus");
        alert("❌ Gagal membuat backup: " + (err ? err.message : "Periksa koneksi internet Anda."));
        return false;
    } finally {
        if (btn1) btn1.disabled = false;
        if (btn2) btn2.disabled = false;
    }
};

window.prosesRestoreBackupJSON = async function(inputElem) {
    let file = inputElem.files && inputElem.files[0];
    inputElem.value = "";
    if (!file) return;

    if (typeof window.tulisAtauHapusNodeAdminRest !== "function") {
        return alert("⚠️ Mesin restore Firebase belum termuat. Silakan muat ulang halaman.");
    }

    let statusEl = document.getElementById("status-progres-restore");
    let parsed = null;

    try {
        let teks = await file.text();
        parsed = JSON.parse(teks);
    } catch (e) {
        return alert("❌ File tidak valid! Pastikan Anda memilih file .JSON hasil backup Sistem Belajar Mahardika.");
    }

    if (!parsed || !parsed.meta || parsed.meta.app !== "Mahardika" || !parsed.data || typeof parsed.data !== "object") {
        return alert("❌ Format JSON tidak dikenali sebagai file cadangan Sistem Belajar Mahardika.");
    }

    let daftarNodeValid = Object.keys(parsed.data).filter(function(k) {
        return window.NODE_BACKUP_PENUH.indexOf(k) !== -1 && parsed.data[k] !== undefined;
    });

    if (daftarNodeValid.length === 0) {
        return alert("⚠️ File backup ini tidak mengandung data yang dapat dipulihkan.");
    }

    let pesanKonfirm =
        "Pulihkan data dari file cadangan berikut?\n\n" +
        "• Label Arsip: " + (parsed.meta.labelSemester || "-") + "\n" +
        "• Tanggal Backup: " + (parsed.meta.exportedLocal || parsed.meta.exportedAt || "-") + "\n" +
        "• Mode: " + (parsed.meta.mode || "-") + "\n" +
        "• Jumlah Modul Data: " + daftarNodeValid.length + " kategori (" + daftarNodeValid.join(", ") + ")\n\n" +
        "Data saat ini pada kategori tersebut akan ditimpa sesuai isi file backup.";

    let jalankanRestore = async function() {
        let btn = document.getElementById("btn-pilih-file-restore");
        if (btn) btn.disabled = true;
        if (statusEl) {
            statusEl.style.display = "block";
            statusEl.innerText = "⏳ Memulai pemulihan data...";
        }

        let sukses = 0;
        let gagal = 0;

        for (let i = 0; i < daftarNodeValid.length; i++) {
            let nodeName = daftarNodeValid[i];
            if (statusEl) {
                statusEl.innerText = "⏳ Memulihkan (" + (i + 1) + "/" + daftarNodeValid.length + "): " + nodeName + "...";
            }
            try {
                let val = parsed.data[nodeName];
                await window.tulisAtauHapusNodeAdminRest(nodeName, val);
                window.sinkronkanMemoriLokalDariNodeArsip(nodeName, val);
                sukses++;
            } catch (errNode) {
                console.error("Gagal restore node " + nodeName + ":", errNode);
                gagal++;
            }
        }

        if (btn) btn.disabled = false;
        window.segarkanSemuaTabelSetelahArsip();

        if (statusEl) {
            statusEl.innerText = "✅ Pemulihan selesai (" + sukses + " berhasil" + (gagal > 0 ? ", " + gagal + " gagal" : "") + ").";
        }
        alert("✅ Pemulihan data selesai!\n\nBerhasil dipulihkan: " + sukses + " kategori data" + (gagal > 0 ? "\nGagal: " + gagal : "") + ".");
    };

    if (typeof window.tampilkanCustomDialog === "function") {
        window.tampilkanCustomDialog("confirm", pesanKonfirm, null, function(isYes) {
            if (isYes) jalankanRestore();
        });
    } else if (confirm(pesanKonfirm)) {
        jalankanRestore();
    }
};

window.eksekusiBersihkanSemesterLama = function() {
    let checkedIds = Array.from(document.querySelectorAll(".chk-arsip-wipe:checked")).map(function(el) {
        return el.value;
    });

    if (checkedIds.length === 0) {
        return alert("⚠️ Centang minimal 1 kategori data semester lama yang ingin dibersihkan.");
    }

    let nodesTarget = [];
    let labelTarget = [];
    window.OPSI_BERSIHKAN_SEMESTER.forEach(function(item) {
        if (checkedIds.indexOf(item.id) !== -1) {
            labelTarget.push("• " + item.judul);
            item.nodes.forEach(function(n) {
                if (nodesTarget.indexOf(n) === -1) nodesTarget.push(n);
            });
        }
    });

    let pesanPrompt =
        "⚠️ KONFIRMASI TUTUP SEMESTER\n\n" +
        "Data yang akan dibersihkan dari Firebase:\n" + labelTarget.join("\n") + "\n\n" +
        "(Bank Soal, Materi, Daftar Kelas, Akun Siswa, XP, & My Pet TETAP AMAN).\n" +
        "Sistem akan otomatis mengunduh file Backup Pengaman terlebih dahulu.\n\n" +
        "Ketik kata ARSIP di bawah ini untuk melanjutkan:";

    let lanjutSetelahKetik = async function(jawaban) {
        if (jawaban === null) return;
        if (String(jawaban).trim().toUpperCase() !== "ARSIP") {
            return alert("❌ Konfirmasi dibatalkan. Anda harus mengetik kata ARSIP persis untuk membersihkan data semester.");
        }

        let btnWipe = document.getElementById("btn-eksekusi-tutup-semester");
        let statusWipe = document.getElementById("status-progres-wipe");
        if (btnWipe) btnWipe.disabled = true;
        if (statusWipe) {
            statusWipe.style.display = "block";
            statusWipe.innerText = "⏳ Langkah 1/2: Mengunduh Backup Pengaman otomatis...";
        }

        // Langkah 1: Wajib backup pengaman terlebih dahulu
        let backupOk = await window.eksekusiBackupSemesterJSON(false, true);
        if (!backupOk) {
            if (btnWipe) btnWipe.disabled = false;
            if (statusWipe) statusWipe.innerText = "❌ Pembersihan dibatalkan karena backup pengaman gagal diunduh.";
            return;
        }

        // Langkah 2: Kosongkan node semester terpilih di Firebase & memori lokal
        let terhapus = 0;
        for (let i = 0; i < nodesTarget.length; i++) {
            let nName = nodesTarget[i];
            if (statusWipe) {
                statusWipe.innerText = "⏳ Langkah 2/2: Membersihkan (" + (i + 1) + "/" + nodesTarget.length + "): " + nName + "...";
            }
            try {
                await window.tulisAtauHapusNodeAdminRest(nName, null);
                window.sinkronkanMemoriLokalDariNodeArsip(nName, null);
                terhapus++;
            } catch (errWipe) {
                console.error("Gagal membersihkan node " + nName + ":", errWipe);
            }
        }

        if (btnWipe) btnWipe.disabled = false;
        window.segarkanSemuaTabelSetelahArsip();

        alert(
            "✅ TUTUP SEMESTER SELESAI!\n\n" +
            "• File Backup Pengaman (.JSON) sudah tersimpan di perangkat Anda.\n" +
            "• " + terhapus + " kategori data semester lama telah dibersihkan dari Firebase.\n\n" +
            "Database kini jauh lebih ringan dan siap untuk semester baru!"
        );
    };

    if (typeof window.tampilkanCustomDialog === "function") {
        window.tampilkanCustomDialog("prompt", pesanPrompt, "", lanjutSetelahKetik);
    } else {
        lanjutSetelahKetik(prompt(pesanPrompt));
    }
};