/* =========================================================================
   MODUL RUANG EKSTRAKURIKULER (RENCANA MINGGUAN, ANGGOTA, KEHADIRAN, & UJIAN)
   Penyimpanan terpisah penuh di node Firebase: data_guru/<guru>/admin_ekskul_data
   ========================================================================= */

window.adminEkskulData = window.adminEkskulData || {};
window.ekskulAktifId = window.ekskulAktifId || '';
window.ekskulTabAktif = 'tab-ekskul-rencana';
window._ekskulServerLoaded = false;
window._ekskulFilterKelasAnggota = 'Semua';
window._ekskulCariAnggota = '';
window._ekskulFilterStatusAnggota = 'Semua';
window._ekskulSaveTimer = null;

window.ekskulEscHtml = function(str) {
    return String(str === undefined || str === null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

window.ekskulKeyGuruAktif = function() {
    return (window.guruAktif || sessionStorage.getItem('guruTarget') || 'mahardika').trim().toLowerCase();
};

window.ekskulCacheLocalKey = function() {
    return 'cache_admin_ekskul_' + window.ekskulKeyGuruAktif();
};

window.ekskulTanggalHariIniISO = function() {
    let d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

window.normalisasiSatuObjekEkskul = function(id, raw) {
    let obj = (raw && typeof raw === 'object') ? raw : {};
    let rencanaArr = Array.isArray(obj.rencana) ? obj.rencana : Object.values(obj.rencana || {});
    let anggotaArr = Array.isArray(obj.anggota) ? obj.anggota : Object.values(obj.anggota || {});
    let pertemuanArr = Array.isArray(obj.pertemuan) ? obj.pertemuan : Object.values(obj.pertemuan || {});

    return {
        id: obj.id || id,
        nama: obj.nama || 'Ekstrakurikuler',
        pembina: obj.pembina || '',
        jadwalRutin: obj.jadwalRutin || '',
        semester: obj.semester || 'Ganjil / Genap 2026/2027',
        rencana: rencanaArr.filter(Boolean),
        anggota: anggotaArr.filter(Boolean),
        pertemuan: pertemuanArr.filter(Boolean),
        absensi: (obj.absensi && typeof obj.absensi === 'object') ? obj.absensi : {},
        ujianAktif: (obj.ujianAktif && typeof obj.ujianAktif === 'object') ? obj.ujianAktif : {},
        rekapNilai: (obj.rekapNilai && typeof obj.rekapNilai === 'object') ? obj.rekapNilai : {}
    };
};

window.pastikanDataEkskulSiap = function() {
    if (!window.adminEkskulData || typeof window.adminEkskulData !== 'object') {
        window.adminEkskulData = {};
    }

    // Muat cadangan lokal jika memori masih kosong
    if (Object.keys(window.adminEkskulData).length === 0) {
        try {
            let rawLocal = localStorage.getItem(window.ekskulCacheLocalKey());
            if (rawLocal) {
                let parsed = JSON.parse(rawLocal);
                if (parsed && typeof parsed === 'object') {
                    window.adminEkskulData = parsed;
                }
            }
        } catch (e) {}
    }

    // Normalisasi seluruh ekskul agar aman terhadap array kosong Firebase
    let keys = Object.keys(window.adminEkskulData);
    keys.forEach(function(k) {
        window.adminEkskulData[k] = window.normalisasiSatuObjekEkskul(k, window.adminEkskulData[k]);
    });

    // Jika benar-benar belum ada ekskul, siapkan 1 ruang default siap pakai
    if (Object.keys(window.adminEkskulData).length === 0) {
        let defId = 'ekskul_utama';
        window.adminEkskulData[defId] = window.normalisasiSatuObjekEkskul(defId, {
            id: defId,
            nama: 'Ekstrakurikuler Utama',
            pembina: '',
            jadwalRutin: ''
        });
    }

    if (!window.ekskulAktifId || !window.adminEkskulData[window.ekskulAktifId]) {
        window.ekskulAktifId = Object.keys(window.adminEkskulData).sort()[0];
    }
};

window.ambilEkskulAktif = function() {
    window.pastikanDataEkskulSiap();
    return window.adminEkskulData[window.ekskulAktifId] || null;
};

window.simpanDataEkskulKeServer = function(langsung) {
    try {
        localStorage.setItem(window.ekskulCacheLocalKey(), JSON.stringify(window.adminEkskulData || {}));
    } catch (e) {}

    let eksekusiTulis = function() {
        let pathDB = 'data_guru/' + window.ekskulKeyGuruAktif() + '/admin_ekskul_data';
        if (typeof window.tulisDataRestFirebase === 'function') {
            window.tulisDataRestFirebase(pathDB, window.adminEkskulData, 'PUT');
        }
    };

    clearTimeout(window._ekskulSaveTimer);
    if (langsung) {
        eksekusiTulis();
    } else {
        window._ekskulSaveTimer = setTimeout(eksekusiTulis, 450);
    }
};

window.muatDataEkskulDariServer = function(forceRefresh, onDone) {
    window.pastikanDataEkskulSiap();
    let pathDB = 'data_guru/' + window.ekskulKeyGuruAktif() + '/admin_ekskul_data';

    if (typeof window.bacaDataRestFirebase !== 'function') {
        if (onDone) onDone();
        return;
    }

    window.bacaDataRestFirebase(pathDB, function(val) {
        if (val && typeof val === 'object' && Object.keys(val).length > 0) {
            let cleaned = {};
            Object.keys(val).forEach(function(k) {
                if (val[k]) cleaned[k] = window.normalisasiSatuObjekEkskul(k, val[k]);
            });
            if (Object.keys(cleaned).length > 0) {
                window.adminEkskulData = cleaned;
                try {
                    localStorage.setItem(window.ekskulCacheLocalKey(), JSON.stringify(window.adminEkskulData));
                } catch (e) {}
            }
        }
        window._ekskulServerLoaded = true;
        window.pastikanDataEkskulSiap();
        window.renderDropdownEkskul();
        window.renderTabEkskulAktif();
        if (onDone) onDone();
    }, function() {
        if (onDone) onDone();
    }, { forceRefresh: Boolean(forceRefresh), ttlMs: 120000 });
};

// =========================================================================
// 1. NAVIGASI, DROPDOWN, & CRUD DAFTAR EKSTRAKURIKULER
// =========================================================================
window.bukaRuangEkstrakurikuler = function() {
    window.pastikanDataEkskulSiap();
    window.renderDropdownEkskul();
    window.bukaTabEkskul(window.ekskulTabAktif || 'tab-ekskul-rencana');

    if (!window._ekskulServerLoaded) {
        window.muatDataEkskulDariServer(false);
    }
};

window.renderDropdownEkskul = function() {
    window.pastikanDataEkskulSiap();
    let sel = document.getElementById('ekskul-select-aktif');
    let keys = Object.keys(window.adminEkskulData).sort(function(a, b) {
        return String(window.adminEkskulData[a].nama || '').localeCompare(String(window.adminEkskulData[b].nama || ''));
    });

    if (sel) {
        let html = '';
        keys.forEach(function(k) {
            let item = window.adminEkskulData[k];
            let isSel = (k === window.ekskulAktifId) ? ' selected' : '';
            html += '<option value="' + window.ekskulEscHtml(k) + '"' + isSel + '>' + window.ekskulEscHtml(item.nama) + '</option>';
        });
        sel.innerHTML = html;
    }

    window.perbaruiStatistikEkskul();
};

window.perbaruiStatistikEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    let jmlAnggota = ek.anggota.length;
    let jmlRencana = ek.rencana.length;

    let elAng = document.getElementById('ekskul-info-anggota');
    let elRen = document.getElementById('ekskul-info-rencana');
    let badgeAng = document.getElementById('badge-ekskul-anggota');

    if (elAng) elAng.innerText = String(jmlAnggota);
    if (elRen) elRen.innerText = String(jmlRencana);
    if (badgeAng) badgeAng.innerText = String(jmlAnggota);
};

window.pilihEkskulAktif = function(id) {
    if (!id || !window.adminEkskulData[id]) return;
    window.ekskulAktifId = id;
    window.perbaruiStatistikEkskul();
    window.renderTabEkskulAktif();
};

window.tambahEkskulBaru = function() {
    let prosesTambah = function(namaBaru) {
        let bersih = String(namaBaru || '').trim();
        if (!bersih) return;
        let newId = 'ekskul_' + Date.now();
        window.adminEkskulData[newId] = window.normalisasiSatuObjekEkskul(newId, {
            id: newId,
            nama: bersih,
            pembina: '',
            jadwalRutin: ''
        });
        window.ekskulAktifId = newId;
        window.simpanDataEkskulKeServer(true);
        window.renderDropdownEkskul();
        window.renderTabEkskulAktif();
    };

    if (typeof window.tampilkanCustomDialog === 'function') {
        window.tampilkanCustomDialog('prompt', 'Masukkan nama Ekstrakurikuler baru (misal: KIR Biologi / Pramuka Penegak / Olimpiade):', '', prosesTambah);
    } else {
        let val = prompt('Masukkan nama Ekstrakurikuler baru:');
        if (val) prosesTambah(val);
    }
};

window.ubahNamaEkskulAktif = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;

    let prosesUbah = function(namaBaru) {
        let bersih = String(namaBaru || '').trim();
        if (!bersih) return;
        ek.nama = bersih;
        window.simpanDataEkskulKeServer(true);
        window.renderDropdownEkskul();
        window.renderTabEkskulAktif();
    };

    if (typeof window.tampilkanCustomDialog === 'function') {
        window.tampilkanCustomDialog('prompt', 'Ubah nama Ekstrakurikuler:', ek.nama, prosesUbah);
    } else {
        let val = prompt('Ubah nama Ekstrakurikuler:', ek.nama);
        if (val) prosesUbah(val);
    }
};

window.hapusEkskulAktif = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    let totalEkskul = Object.keys(window.adminEkskulData || {}).length;
    if (totalEkskul <= 1) {
        return alert('⚠️ Minimal harus tersisa 1 ruang Ekstrakurikuler. Anda bisa mengganti namanya lewat tombol Ubah Nama.');
    }

    let jalankanHapus = function() {
        delete window.adminEkskulData[ek.id];
        window.ekskulAktifId = Object.keys(window.adminEkskulData).sort()[0] || '';
        window.simpanDataEkskulKeServer(true);
        window.renderDropdownEkskul();
        window.renderTabEkskulAktif();
    };

    let msg = 'Yakin ingin menghapus Ekstrakurikuler "' + ek.nama + '" beserta seluruh rencana, anggota, kehadiran, dan nilai ekskulnya?';
    if (typeof window.tampilkanCustomDialog === 'function') {
        window.tampilkanCustomDialog('confirm', msg, null, function(isYes) {
            if (isYes) jalankanHapus();
        });
    } else if (confirm(msg)) {
        jalankanHapus();
    }
};

window.bukaTabEkskul = function(tabId, btnEl) {
    window.ekskulTabAktif = tabId || 'tab-ekskul-rencana';

    document.querySelectorAll('#ekskul-tab-content-area .ekskul-tab-content').forEach(function(el) {
        el.style.display = (el.id === window.ekskulTabAktif) ? 'block' : 'none';
    });

    let subWrap = document.getElementById('aws-ekskul-subtabs');
    if (subWrap) {
        subWrap.querySelectorAll('.tab-ekskul-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        let targetBtn = btnEl || subWrap.querySelector('[onclick*="' + window.ekskulTabAktif + '"]');
        if (targetBtn) targetBtn.classList.add('active');
    }

    window.renderTabEkskulAktif();
};

window.renderTabEkskulAktif = function() {
    window.perbaruiStatistikEkskul();
    if (window.ekskulTabAktif === 'tab-ekskul-rencana') {
        window.renderTabRencanaEkskul();
    } else if (window.ekskulTabAktif === 'tab-ekskul-anggota') {
        window.renderTabAnggotaEkskul();
    } else if (window.ekskulTabAktif === 'tab-ekskul-absensi') {
        window.renderTabAbsensiEkskul();
    } else if (window.ekskulTabAktif === 'tab-ekskul-ujian') {
        if (typeof window.renderTabUjianEkskul === 'function') {
            window.renderTabUjianEkskul();
        } else {
            window.renderPlaceholderUjianEkskul();
        }
    }
};

// =========================================================================
// 2. TAB 1: RENCANA MINGGUAN EKSTRAKURIKULER + CETAK PDF & EXPORT EXCEL
// =========================================================================
window.simpanInfoHeaderEkskul = function(field, val) {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    ek[field] = String(val || '').trim();
    window.simpanDataEkskulKeServer(false);
};

window.renderTabRencanaEkskul = function() {
    let cont = document.getElementById('tab-ekskul-rencana');
    let ek = window.ambilEkskulAktif();
    if (!cont || !ek) return;

    let nextMinggu = 'Minggu ' + (ek.rencana.length + 1);
    let todayISO = window.ekskulTanggalHariIniISO();

    let rowsHtml = '';
    if (ek.rencana.length === 0) {
        rowsHtml = '<tr><td colspan="7" style="padding:24px; text-align:center; color:#64748b; font-weight:600;">Belum ada rencana mingguan untuk <b>' + window.ekskulEscHtml(ek.nama) + '</b>. Tambahkan melalui formulir di atas.</td></tr>';
    } else {
        ek.rencana.forEach(function(item, idx) {
            rowsHtml +=
                '<tr>' +
                    '<td style="text-align:center; font-weight:700; color:#526a7d;">' + (idx + 1) + '</td>' +
                    '<td><input type="text" class="agenda-inline-input" value="' + window.ekskulEscHtml(item.minggu || ('Minggu ' + (idx + 1))) + '" onchange="window.updateRencanaEkskul(' + idx + ', \'minggu\', this.value)"></td>' +
                    '<td><input type="date" class="agenda-inline-input agenda-inline-date" value="' + window.ekskulEscHtml(item.tanggal || '') + '" onchange="window.updateRencanaEkskul(' + idx + ', \'tanggal\', this.value)"></td>' +
                    '<td><div contenteditable="true" class="agenda-inline-editable" data-placeholder="Topik kegiatan..." onblur="window.updateRencanaEkskul(' + idx + ', \'materi\', this.innerText)">' + window.ekskulEscHtml(item.materi || '') + '</div></td>' +
                    '<td><div contenteditable="true" class="agenda-inline-editable" data-placeholder="Aktivitas / target..." onblur="window.updateRencanaEkskul(' + idx + ', \'aktivitas\', this.innerText)">' + window.ekskulEscHtml(item.aktivitas || '') + '</div></td>' +
                    '<td><div contenteditable="true" class="agenda-inline-editable" data-placeholder="Alat / catatan..." onblur="window.updateRencanaEkskul(' + idx + ', \'keterangan\', this.innerText)">' + window.ekskulEscHtml(item.keterangan || '') + '</div></td>' +
                    '<td style="text-align:center; white-space:nowrap;">' +
                        '<button type="button" class="ekskul-mini-icon-btn" onclick="window.geserRencanaEkskul(' + idx + ', -1)" title="Geser Naik">⬆️</button>' +
                        '<button type="button" class="ekskul-mini-icon-btn" onclick="window.geserRencanaEkskul(' + idx + ', 1)" title="Geser Turun">⬇️</button>' +
                        '<button type="button" class="ekskul-mini-icon-btn is-del" onclick="window.hapusRencanaEkskul(' + idx + ')" title="Hapus Baris">🗑️</button>' +
                    '</td>' +
                '</tr>';
        });
    }

    cont.innerHTML =
        '<div class="ekskul-section-head">' +
            '<div>' +
                '<h4 style="margin:0;">📋 Program &amp; Rencana Mingguan: <span style="color:var(--aws-blue);">' + window.ekskulEscHtml(ek.nama) + '</span></h4>' +
                '<div style="font-size:11.5px; color:#526a7d; margin-top:2px;">Klik langsung sel tabel untuk mengedit teks. Perubahan tersimpan otomatis.</div>' +
            '</div>' +
            '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
                '<button type="button" class="aws-quick-btn is-primary" onclick="window.cetakRencanaMingguanEkskul()">🖨️ Cetak PDF Rencana</button>' +
                '<button type="button" class="aws-quick-btn" onclick="window.exportExcelRencanaEkskul()">📥 Export Excel</button>' +
            '</div>' +
        '</div>' +

        '<div class="ekskul-meta-grid">' +
            '<div>' +
                '<label>👤 Pembina / Pembimbing (Tampil di Cetakan):</label>' +
                '<input type="text" class="input-box" style="margin:0;" placeholder="Contoh: Mahardika Wiryawan, S.Pd" value="' + window.ekskulEscHtml(ek.pembina || '') + '" oninput="window.simpanInfoHeaderEkskul(\'pembina\', this.value)">' +
            '</div>' +
            '<div>' +
                '<label>🕒 Jadwal Rutin:</label>' +
                '<input type="text" class="input-box" style="margin:0;" placeholder="Contoh: Setiap Jumat, 14.30 – 16.00 WIB" value="' + window.ekskulEscHtml(ek.jadwalRutin || '') + '" oninput="window.simpanInfoHeaderEkskul(\'jadwalRutin\', this.value)">' +
            '</div>' +
            '<div>' +
                '<label>📅 Semester / Tahun Pelajaran:</label>' +
                '<input type="text" class="input-box" style="margin:0;" placeholder="Contoh: Ganjil 2026/2027" value="' + window.ekskulEscHtml(ek.semester || '') + '" oninput="window.simpanInfoHeaderEkskul(\'semester\', this.value)">' +
            '</div>' +
        '</div>' +

        '<div class="ekskul-form-card">' +
            '<div style="font-size:12.5px; font-weight:800; color:var(--aws-dark); margin-bottom:10px;">➕ Tambah Rencana Pertemuan Mingguan</div>' +
            '<div class="ekskul-form-row">' +
                '<input type="text" id="ekskul-in-minggu" class="input-box" style="width:120px; margin:0; font-weight:700;" value="' + window.ekskulEscHtml(nextMinggu) + '" placeholder="Minggu ke-">' +
                '<input type="date" id="ekskul-in-tanggal" class="input-box" style="width:150px; margin:0;" value="' + todayISO + '">' +
                '<input type="text" id="ekskul-in-materi" class="input-box" style="flex:1.4; min-width:180px; margin:0;" placeholder="Topik / Materi Kegiatan...">' +
                '<input type="text" id="ekskul-in-aktivitas" class="input-box" style="flex:1.6; min-width:200px; margin:0;" placeholder="Rincian Aktivitas &amp; Target Capaian...">' +
                '<input type="text" id="ekskul-in-ket" class="input-box" style="flex:1; min-width:150px; margin:0;" placeholder="Alat / Keterangan...">' +
                '<button type="button" class="aws-quick-btn is-primary" style="padding:9px 16px;" onclick="window.tambahRencanaMingguanEkskul()">💾 Simpan</button>' +
            '</div>' +
        '</div>' +

        '<div class="ekskul-table-wrap">' +
            '<table class="excel-table" style="min-width:820px; text-align:left;">' +
                '<thead>' +
                    '<tr>' +
                        '<th style="width:45px; text-align:center;">No</th>' +
                        '<th style="width:110px;">Minggu</th>' +
                        '<th style="width:130px;">Tanggal</th>' +
                        '<th style="min-width:190px;">Topik / Materi</th>' +
                        '<th style="min-width:230px;">Aktivitas &amp; Target Capaian</th>' +
                        '<th style="min-width:160px;">Alat / Keterangan</th>' +
                        '<th style="width:105px; text-align:center;">Aksi</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' + rowsHtml + '</tbody>' +
            '</table>' +
        '</div>';
};

window.tambahRencanaMingguanEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;

    let minggu = (document.getElementById('ekskul-in-minggu') ? document.getElementById('ekskul-in-minggu').value.trim() : '') || ('Minggu ' + (ek.rencana.length + 1));
    let tanggal = document.getElementById('ekskul-in-tanggal') ? document.getElementById('ekskul-in-tanggal').value : '';
    let materi = document.getElementById('ekskul-in-materi') ? document.getElementById('ekskul-in-materi').value.trim() : '';
    let aktivitas = document.getElementById('ekskul-in-aktivitas') ? document.getElementById('ekskul-in-aktivitas').value.trim() : '';
    let ket = document.getElementById('ekskul-in-ket') ? document.getElementById('ekskul-in-ket').value.trim() : '';

    if (!materi && !aktivitas) {
        return alert('⚠️ Isi minimal Topik / Materi atau Aktivitas terlebih dahulu!');
    }

    ek.rencana.push({
        id: 'ren_' + Date.now(),
        minggu: minggu,
        tanggal: tanggal,
        materi: materi,
        aktivitas: aktivitas,
        keterangan: ket
    });

    window.simpanDataEkskulKeServer(true);
    window.perbaruiStatistikEkskul();
    window.renderTabRencanaEkskul();
};

window.updateRencanaEkskul = function(idx, field, val) {
    let ek = window.ambilEkskulAktif();
    if (!ek || !ek.rencana[idx]) return;
    ek.rencana[idx][field] = String(val || '').trim();
    window.simpanDataEkskulKeServer(false);
};

window.geserRencanaEkskul = function(idx, arah) {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    let target = idx + arah;
    if (target < 0 || target >= ek.rencana.length) return;
    let tmp = ek.rencana[idx];
    ek.rencana[idx] = ek.rencana[target];
    ek.rencana[target] = tmp;
    window.simpanDataEkskulKeServer(true);
    window.renderTabRencanaEkskul();
};

window.hapusRencanaEkskul = function(idx) {
    let ek = window.ambilEkskulAktif();
    if (!ek || !ek.rencana[idx]) return;

    let jalankan = function() {
        ek.rencana.splice(idx, 1);
        window.simpanDataEkskulKeServer(true);
        window.perbaruiStatistikEkskul();
        window.renderTabRencanaEkskul();
    };

    if (typeof window.tampilkanCustomDialog === 'function') {
        window.tampilkanCustomDialog('confirm', 'Hapus rencana pertemuan baris ke-' + (idx + 1) + '?', null, function(ok) {
            if (ok) jalankan();
        });
    } else if (confirm('Hapus rencana pertemuan baris ke-' + (idx + 1) + '?')) {
        jalankan();
    }
};

window.formatTanggalCetakIndo = function(isoStr) {
    if (!isoStr) return '-';
    let parts = String(isoStr).split('-');
    if (parts.length !== 3) return isoStr;
    let bln = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    let mIdx = parseInt(parts[1], 10) - 1;
    return parseInt(parts[2], 10) + ' ' + (bln[mIdx] || parts[1]) + ' ' + parts[0];
};

window.cetakRencanaMingguanEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    if (ek.rencana.length === 0) {
        return alert('⚠️ Belum ada rencana mingguan untuk dicetak. Tambahkan minimal 1 baris rencana terlebih dahulu.');
    }

    let pembina = ek.pembina || '........................................';
    let jadwal = ek.jadwalRutin || '-';
    let sem = ek.semester || '-';
    let tglCetak = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    let rows = ek.rencana.map(function(item, i) {
        return '<tr>' +
            '<td style="text-align:center;">' + (i + 1) + '</td>' +
            '<td style="text-align:center; font-weight:bold;">' + window.ekskulEscHtml(item.minggu || ('Minggu ' + (i + 1))) + '</td>' +
            '<td style="text-align:center; white-space:nowrap;">' + window.ekskulEscHtml(window.formatTanggalCetakIndo(item.tanggal)) + '</td>' +
            '<td><b>' + window.ekskulEscHtml(item.materi || '-') + '</b></td>' +
            '<td>' + window.ekskulEscHtml(item.aktivitas || '-').replace(/\n/g, '<br>') + '</td>' +
            '<td>' + window.ekskulEscHtml(item.keterangan || '-').replace(/\n/g, '<br>') + '</td>' +
        '</tr>';
    }).join('');

    let win = window.open('', '_blank', 'width=960,height=720');
    if (!win) {
        return alert('⚠️ Pop-up diblokir browser. Izinkan pop-up untuk mencetak PDF.');
    }

    let docHtml =
        '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">' +
        '<title>Rencana Mingguan - ' + window.ekskulEscHtml(ek.nama) + '</title>' +
        '<style>' +
            '@page { size: A4 portrait; margin: 16mm 14mm; }' +
            'body { font-family: "Times New Roman", Georgia, serif; color: #111; margin: 0; font-size: 11.5pt; line-height: 1.4; }' +
            '.kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 14px; }' +
            '.kop h2 { margin: 0; font-size: 15pt; letter-spacing: 0.4px; }' +
            '.kop p { margin: 3px 0 0 0; font-size: 10.5pt; }' +
            '.judul { text-align: center; margin: 12px 0 14px 0; }' +
            '.judul h3 { margin: 0; font-size: 13pt; text-transform: uppercase; text-decoration: underline; }' +
            '.meta { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11pt; }' +
            '.meta td { padding: 3px 6px; vertical-align: top; }' +
            'table.data { width: 100%; border-collapse: collapse; font-size: 10.5pt; }' +
            'table.data th, table.data td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; }' +
            'table.data th { background: #e8f4f8; text-align: center; font-weight: bold; }' +
            'table.data tr { page-break-inside: avoid; }' +
            '.ttd-grid { display: flex; justify-content: space-between; margin-top: 32px; page-break-inside: avoid; }' +
            '.ttd-box { width: 42%; text-align: center; }' +
            '.ttd-space { height: 64px; }' +
            '@media print { .no-print { display: none; } }' +
        '</style></head><body>' +
        '<div class="no-print" style="background:#060608; color:#00E1FF; padding:10px 16px; display:flex; justify-content:space-between; align-items:center; font-family:sans-serif; font-size:13px;">' +
            '<span><b>Pratinjau Cetak Rencana Mingguan</b> — Pilih "Save as PDF" pada jendela cetak.</span>' +
            '<button onclick="window.print()" style="background:#00E1FF; color:#060608; border:none; border-radius:20px; padding:7px 18px; font-weight:bold; cursor:pointer;">🖨️ Cetak / Simpan PDF</button>' +
        '</div>' +
        '<div class="kop">' +
            '<h2>PROGRAM KEGIATAN EKSTRAKURIKULER</h2>' +
            '<p>SMAS BODHI DHARMA BATAM</p>' +
        '</div>' +
        '<div class="judul"><h3>RENCANA MINGGUAN KEGIATAN EKSTRAKURIKULER</h3></div>' +
        '<table class="meta">' +
            '<tr><td style="width:170px;"><b>Nama Ekstrakurikuler</b></td><td style="width:12px;">:</td><td>' + window.ekskulEscHtml(ek.nama) + '</td></tr>' +
            '<tr><td><b>Pembina / Pembimbing</b></td><td>:</td><td>' + window.ekskulEscHtml(pembina) + '</td></tr>' +
            '<tr><td><b>Jadwal Rutin</b></td><td>:</td><td>' + window.ekskulEscHtml(jadwal) + '</td></tr>' +
            '<tr><td><b>Periode / Semester</b></td><td>:</td><td>' + window.ekskulEscHtml(sem) + ' • Total Anggota: ' + ek.anggota.length + ' Siswa</td></tr>' +
        '</table>' +
        '<table class="data">' +
            '<thead><tr>' +
                '<th style="width:32px;">No</th>' +
                '<th style="width:82px;">Minggu</th>' +
                '<th style="width:88px;">Tanggal</th>' +
                '<th style="width:24%;">Topik / Materi</th>' +
                '<th>Aktivitas &amp; Target Capaian</th>' +
                '<th style="width:20%;">Alat / Keterangan</th>' +
            '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
        '</table>' +
        '<div class="ttd-grid">' +
            '<div class="ttd-box"><div>Mengetahui,</div><div>Kepala Sekolah / Wakasek Kesiswaan</div><div class="ttd-space"></div><div><b>( ........................................ )</b></div></div>' +
            '<div class="ttd-box"><div>Batam, ' + window.ekskulEscHtml(tglCetak) + '</div><div>Pembina Ekstrakurikuler</div><div class="ttd-space"></div><div><b>' + window.ekskulEscHtml(pembina) + '</b></div></div>' +
        '</div>' +
        '</body></html>';

    win.document.open();
    win.document.write(docHtml);
    win.document.close();
    setTimeout(function() { win.print(); }, 350);
};

window.exportExcelRencanaEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek || ek.rencana.length === 0) return alert('⚠️ Belum ada data rencana mingguan untuk diekspor.');

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Calibri,sans-serif;font-size:12px;}th,td{border:1px solid #000;padding:6px;}th{background:#2370A1;color:#fff;}</style></head><body>';
    html += '<h3>Rencana Mingguan Ekstrakurikuler: ' + window.ekskulEscHtml(ek.nama) + '</h3>';
    html += '<p>Pembina: ' + window.ekskulEscHtml(ek.pembina || '-') + ' | Jadwal: ' + window.ekskulEscHtml(ek.jadwalRutin || '-') + '</p>';
    html += '<table><thead><tr><th>No</th><th>Minggu</th><th>Tanggal</th><th>Topik / Materi</th><th>Aktivitas & Target</th><th>Alat / Keterangan</th></tr></thead><tbody>';
    ek.rencana.forEach(function(item, idx) {
        html += '<tr><td>' + (idx + 1) + '</td><td>' + window.ekskulEscHtml(item.minggu || '') + '</td><td>' + window.ekskulEscHtml(item.tanggal || '') + '</td><td>' + window.ekskulEscHtml(item.materi || '') + '</td><td>' + window.ekskulEscHtml(item.aktivitas || '') + '</td><td>' + window.ekskulEscHtml(item.keterangan || '') + '</td></tr>';
    });
    html += '</tbody></table></body></html>';

    let blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'Rencana_Ekskul_' + String(ek.nama || 'Ekskul').replace(/\s+/g, '_') + '.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// =========================================================================
// 3. TAB 2: PEMILIHAN ANGGOTA EKSTRAKURIKULER (CENTANG DARI SEMUA SISWA)
// =========================================================================
window.buatKeyAnggotaEkskul = function(kelas, nama) {
    let sK = (typeof window.sanitasiKeyRekapFirebase === 'function') ? window.sanitasiKeyRekapFirebase(kelas) : String(kelas || '').trim();
    let sN = (typeof window.sanitasiKeyRekapFirebase === 'function') ? window.sanitasiKeyRekapFirebase(nama) : String(nama || '').trim();
    return sK + '__' + sN;
};

window.ambilSemuaSiswaMasterUntukEkskul = function() {
    let hasil = [];
    let data = window.adminData || {};
    Object.keys(data).sort().forEach(function(kls) {
        let arr = Array.isArray(data[kls]) ? data[kls] : Object.values(data[kls] || {});
        arr.slice().sort().forEach(function(nama) {
            let nBersih = String(nama || '').trim();
            if (!nBersih) return;
            hasil.push({
                key: window.buatKeyAnggotaEkskul(kls, nBersih),
                kelas: kls,
                nama: nBersih
            });
        });
    });
    return hasil;
};

window.renderTabAnggotaEkskul = function() {
    let cont = document.getElementById('tab-ekskul-anggota');
    let ek = window.ambilEkskulAktif();
    if (!cont || !ek) return;

    let semuaSiswa = window.ambilSemuaSiswaMasterUntukEkskul();
    let kelasList = Object.keys(window.adminData || {}).sort();
    let memberSet = new Set(ek.anggota.map(function(a) { return a.key; }));

    let filterKls = window._ekskulFilterKelasAnggota || 'Semua';
    let cari = String(window._ekskulCariAnggota || '').trim().toLowerCase();
    let filterStatus = window._ekskulFilterStatusAnggota || 'Semua';

    let tampil = semuaSiswa.filter(function(s) {
        if (filterKls !== 'Semua' && s.kelas !== filterKls) return false;
        if (cari && s.nama.toLowerCase().indexOf(cari) === -1 && s.kelas.toLowerCase().indexOf(cari) === -1) return false;
        let isIn = memberSet.has(s.key);
        if (filterStatus === 'Masuk' && !isIn) return false;
        if (filterStatus === 'Belum' && isIn) return false;
        return true;
    });

    let optKelas = '<option value="Semua">🏫 Semua Kelas (' + semuaSiswa.length + ' Siswa)</option>';
    kelasList.forEach(function(k) {
        let jml = Array.isArray(window.adminData[k]) ? window.adminData[k].length : 0;
        optKelas += '<option value="' + window.ekskulEscHtml(k) + '"' + (filterKls === k ? ' selected' : '') + '>' + window.ekskulEscHtml(k) + ' (' + jml + ')</option>';
    });

    let listHtml = '';
    if (semuaSiswa.length === 0) {
        listHtml = '<div style="grid-column:1/-1; text-align:center; padding:28px; color:#64748b;">Belum ada data siswa di <b>Administrasi Kelas ➔ Input Data Kelas</b>.</div>';
    } else if (tampil.length === 0) {
        listHtml = '<div style="grid-column:1/-1; text-align:center; padding:28px; color:#64748b;">Tidak ada siswa yang cocok dengan filter pencarian ini.</div>';
    } else {
        tampil.forEach(function(s) {
            let isChecked = memberSet.has(s.key);
            let safeKls = window.ekskulEscHtml(s.kelas).replace(/'/g, "\\'");
            let safeNama = window.ekskulEscHtml(s.nama).replace(/'/g, "\\'");
            listHtml +=
                '<label class="ekskul-member-card' + (isChecked ? ' is-selected' : '') + '">' +
                    '<input type="checkbox" ' + (isChecked ? 'checked' : '') + ' onchange="window.toggleAnggotaEkskul(\'' + safeKls + '\', \'' + safeNama + '\', this.checked)">' +
                    '<div class="ekskul-member-info">' +
                        '<strong>' + window.ekskulEscHtml(s.nama) + '</strong>' +
                        '<span>🏫 ' + window.ekskulEscHtml(s.kelas) + '</span>' +
                    '</div>' +
                '</label>';
        });
    }

    cont.innerHTML =
        '<div class="ekskul-section-head">' +
            '<div>' +
                '<h4 style="margin:0;">👥 Pilih Anggota Ekstrakurikuler: <span style="color:var(--aws-blue);">' + window.ekskulEscHtml(ek.nama) + '</span></h4>' +
                '<div style="font-size:11.5px; color:#526a7d; margin-top:2px;">Centang siswa dari semua kelas yang mengikuti ekstrakurikuler ini. Terpilih: <b>' + ek.anggota.length + ' siswa</b>.</div>' +
            '</div>' +
            '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
                '<button type="button" class="aws-quick-btn" onclick="window.centangMassalAnggotaEkskul(true)">☑️ Centang Semua (Filter)</button>' +
                '<button type="button" class="aws-quick-btn is-danger-soft" onclick="window.centangMassalAnggotaEkskul(false)">⬜ Lepas Semua (Filter)</button>' +
                '<button type="button" class="aws-quick-btn is-primary" onclick="window.exportExcelAnggotaEkskul()">📥 Export Anggota</button>' +
            '</div>' +
        '</div>' +

        '<div class="ekskul-filter-strip">' +
            '<select class="input-box aws-select-pill" style="width:210px !important;" onchange="window._ekskulFilterKelasAnggota = this.value; window.renderTabAnggotaEkskul();">' + optKelas + '</select>' +
            '<select class="input-box aws-select-pill" style="width:185px !important;" onchange="window._ekskulFilterStatusAnggota = this.value; window.renderTabAnggotaEkskul();">' +
                '<option value="Semua"' + (filterStatus === 'Semua' ? ' selected' : '') + '>📋 Semua Status</option>' +
                '<option value="Masuk"' + (filterStatus === 'Masuk' ? ' selected' : '') + '>✅ Anggota Terpilih (' + ek.anggota.length + ')</option>' +
                '<option value="Belum"' + (filterStatus === 'Belum' ? ' selected' : '') + '>⬜ Belum Dipilih</option>' +
            '</select>' +
            '<input type="text" id="ekskul-input-cari-siswa" class="input-box" style="margin:0; flex:1; min-width:190px;" placeholder="🔍 Cari nama siswa atau kelas..." value="' + window.ekskulEscHtml(window._ekskulCariAnggota || '') + '" oninput="window.cariSiswaEkskulInput(this.value)">' +
        '</div>' +

        '<div class="ekskul-member-grid">' + listHtml + '</div>';
};

window.cariSiswaEkskulInput = function(val) {
    window._ekskulCariAnggota = val;
    window.renderTabAnggotaEkskul();
    let inp = document.getElementById('ekskul-input-cari-siswa');
    if (inp) {
        inp.focus();
        let len = inp.value.length;
        try { inp.setSelectionRange(len, len); } catch (e) {}
    }
};

window.toggleAnggotaEkskul = function(kelas, nama, isChecked) {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    let key = window.buatKeyAnggotaEkskul(kelas, nama);
    let idx = ek.anggota.findIndex(function(a) { return a.key === key; });

    if (isChecked) {
        if (idx === -1) {
            ek.anggota.push({ key: key, kelas: kelas, nama: nama });
            ek.anggota.sort(function(a, b) {
                let cmpK = String(a.kelas).localeCompare(String(b.kelas));
                return cmpK !== 0 ? cmpK : String(a.nama).localeCompare(String(b.nama));
            });
        }
    } else {
        if (idx !== -1) ek.anggota.splice(idx, 1);
    }

    window.simpanDataEkskulKeServer(false);
    window.perbaruiStatistikEkskul();
    window.renderTabAnggotaEkskul();
};

window.centangMassalAnggotaEkskul = function(jadikanMasuk) {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    let semuaSiswa = window.ambilSemuaSiswaMasterUntukEkskul();
    let filterKls = window._ekskulFilterKelasAnggota || 'Semua';
    let cari = String(window._ekskulCariAnggota || '').trim().toLowerCase();

    let targetList = semuaSiswa.filter(function(s) {
        if (filterKls !== 'Semua' && s.kelas !== filterKls) return false;
        if (cari && s.nama.toLowerCase().indexOf(cari) === -1 && s.kelas.toLowerCase().indexOf(cari) === -1) return false;
        return true;
    });

    if (targetList.length === 0) return;

    let mapAda = {};
    ek.anggota.forEach(function(a) { mapAda[a.key] = a; });

    if (jadikanMasuk) {
        targetList.forEach(function(s) {
            mapAda[s.key] = { key: s.key, kelas: s.kelas, nama: s.nama };
        });
    } else {
        targetList.forEach(function(s) {
            delete mapAda[s.key];
        });
    }

    ek.anggota = Object.values(mapAda).sort(function(a, b) {
        let cmpK = String(a.kelas).localeCompare(String(b.kelas));
        return cmpK !== 0 ? cmpK : String(a.nama).localeCompare(String(b.nama));
    });

    window.simpanDataEkskulKeServer(true);
    window.perbaruiStatistikEkskul();
    window.renderTabAnggotaEkskul();
};

window.exportExcelAnggotaEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek || ek.anggota.length === 0) return alert('⚠️ Belum ada anggota ekstrakurikuler yang dipilih.');

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Calibri,sans-serif;font-size:12px;}th,td{border:1px solid #000;padding:6px;}th{background:#2370A1;color:#fff;}</style></head><body>';
    html += '<h3>Daftar Anggota Ekstrakurikuler: ' + window.ekskulEscHtml(ek.nama) + '</h3>';
    html += '<table><thead><tr><th>No</th><th>Nama Siswa</th><th>Kelas</th></tr></thead><tbody>';
    ek.anggota.forEach(function(a, idx) {
        html += '<tr><td>' + (idx + 1) + '</td><td>' + window.ekskulEscHtml(a.nama) + '</td><td>' + window.ekskulEscHtml(a.kelas) + '</td></tr>';
    });
    html += '</tbody></table></body></html>';

    let blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'Anggota_Ekskul_' + String(ek.nama || 'Ekskul').replace(/\s+/g, '_') + '.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// =========================================================================
// 4. TAB 3: KEHADIRAN / ABSENSI EKSTRAKURIKULER
// =========================================================================
window.renderTabAbsensiEkskul = function() {
    let cont = document.getElementById('tab-ekskul-absensi');
    let ek = window.ambilEkskulAktif();
    if (!cont || !ek) return;

    if (ek.anggota.length === 0) {
        cont.innerHTML =
            '<div class="ekskul-empty-box">' +
                '<div style="font-size:38px; margin-bottom:8px;">👥</div>' +
                '<strong>Belum Ada Anggota Ekstrakurikuler</strong>' +
                '<p>Centang siswa yang bergabung ke <b>' + window.ekskulEscHtml(ek.nama) + '</b> terlebih dahulu sebelum mengisi kehadiran.</p>' +
                '<button type="button" class="aws-quick-btn is-primary" onclick="window.bukaTabEkskul(\'tab-ekskul-anggota\')">👥 Pilih Anggota Sekarang</button>' +
            '</div>';
        return;
    }

    let headCols =
        '<th style="width:42px; text-align:center;">No</th>' +
        '<th style="min-width:190px; text-align:left;">Nama Anggota</th>' +
        '<th style="width:110px; text-align:center;">Kelas</th>';

    ek.pertemuan.forEach(function(pt, pIdx) {
        let lblTgl = window.formatTanggalCetakIndo(pt.tanggal);
        headCols +=
            '<th style="min-width:105px; text-align:center;">' +
                '<div style="display:flex; flex-direction:column; align-items:center; gap:3px;">' +
                    '<span style="cursor:pointer; text-decoration:underline dotted;" title="Klik untuk ubah tanggal" onclick="window.editTanggalPertemuanEkskul(' + pIdx + ')">P' + (pIdx + 1) + ' • ' + window.ekskulEscHtml(lblTgl) + '</span>' +
                    '<div style="display:flex; gap:4px;">' +
                        '<button type="button" class="ekskul-th-mini-btn" onclick="window.tandaiSemuaHadirEkskul(\'' + window.ekskulEscHtml(pt.id) + '\')" title="Centang Hadir Semua Anggota pada Pertemuan Ini">All H</button>' +
                        '<button type="button" class="ekskul-th-mini-btn is-del" onclick="window.hapusPertemuanEkskul(' + pIdx + ')" title="Hapus Pertemuan">✕</button>' +
                    '</div>' +
                '</div>' +
            '</th>';
    });

    headCols +=
        '<th style="width:44px; text-align:center;">H</th>' +
        '<th style="width:44px; text-align:center;">S</th>' +
        '<th style="width:44px; text-align:center;">I</th>' +
        '<th style="width:44px; text-align:center;">A</th>';

    let bodyRows = '';
    ek.anggota.forEach(function(ang, idx) {
        let cnt = { H: 0, S: 0, I: 0, A: 0 };
        let cells = '';

        ek.pertemuan.forEach(function(pt) {
            let mapPt = ek.absensi[pt.id] || {};
            let st = mapPt[ang.key] || '-';
            if (cnt[st] !== undefined) cnt[st]++;

            let cls = st === 'H' ? 'st-h' : (st === 'S' ? 'st-s' : (st === 'I' ? 'st-i' : (st === 'A' ? 'st-a' : 'st-empty')));
            cells +=
                '<td style="text-align:center;">' +
                    '<button type="button" class="ekskul-abs-pill ' + cls + '" onclick="window.siklusStatusAbsenEkskul(\'' + window.ekskulEscHtml(pt.id) + '\', \'' + window.ekskulEscHtml(ang.key) + '\')">' + st + '</button>' +
                '</td>';
        });

        bodyRows +=
            '<tr>' +
                '<td style="text-align:center; font-weight:700; color:#526a7d;">' + (idx + 1) + '</td>' +
                '<td style="text-align:left; font-weight:700; color:var(--aws-dark);">' + window.ekskulEscHtml(ang.nama) + '</td>' +
                '<td style="text-align:center; font-size:11.5px; font-weight:700; color:var(--aws-blue);">' + window.ekskulEscHtml(ang.kelas) + '</td>' +
                cells +
                '<td style="text-align:center; font-weight:800; color:#15803d;">' + cnt.H + '</td>' +
                '<td style="text-align:center; font-weight:800; color:#d97706;">' + cnt.S + '</td>' +
                '<td style="text-align:center; font-weight:800; color:#2370A1;">' + cnt.I + '</td>' +
                '<td style="text-align:center; font-weight:800; color:#dc2626;">' + cnt.A + '</td>' +
            '</tr>';
    });

    cont.innerHTML =
        '<div class="ekskul-section-head">' +
            '<div>' +
                '<h4 style="margin:0;">✅ Daftar Kehadiran: <span style="color:var(--aws-blue);">' + window.ekskulEscHtml(ek.nama) + '</span></h4>' +
                '<div style="font-size:11.5px; color:#526a7d; margin-top:2px;">Klik tombol status untuk mengganti (<b>H</b> = Hadir, <b>S</b> = Sakit, <b>I</b> = Izin, <b>A</b> = Alfa). Klik <b>All H</b> untuk hadir semua sekaligus.</div>' +
            '</div>' +
            '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
                '<button type="button" class="aws-quick-btn is-primary" onclick="window.tambahPertemuanEkskul()">📅 + Tambah Pertemuan</button>' +
                '<button type="button" class="aws-quick-btn" onclick="window.exportExcelAbsensiEkskul()">📥 Export Excel Kehadiran</button>' +
            '</div>' +
        '</div>' +
        (ek.pertemuan.length === 0
            ? '<div class="ekskul-empty-box" style="margin-top:10px;"><p style="margin:0 0 10px 0;">Belum ada kolom pertemuan. Klik tombol <b>📅 + Tambah Pertemuan</b> untuk memulai absensi hari ini.</p><button type="button" class="aws-quick-btn is-primary" onclick="window.tambahPertemuanEkskul()">📅 + Tambah Pertemuan Pertama</button></div>'
            : '<div class="ekskul-table-wrap"><table class="excel-table" style="min-width:100%;"><thead><tr>' + headCols + '</tr></thead><tbody>' + bodyRows + '</tbody></table></div>');
};

window.tambahPertemuanEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    let today = window.ekskulTanggalHariIniISO();

    let proses = function(tglVal) {
        let tgl = String(tglVal || today).trim() || today;
        let ptId = 'pt_' + Date.now();
        ek.pertemuan.push({ id: ptId, tanggal: tgl });
        if (!ek.absensi[ptId]) ek.absensi[ptId] = {};
        window.simpanDataEkskulKeServer(true);
        window.renderTabAbsensiEkskul();
    };

    if (typeof window.tampilkanCustomDialog === 'function') {
        window.tampilkanCustomDialog('prompt', 'Masukkan tanggal pertemuan ekstrakurikuler (YYYY-MM-DD):', today, proses);
    } else {
        let val = prompt('Masukkan tanggal pertemuan (YYYY-MM-DD):', today);
        if (val !== null) proses(val);
    }
};

window.editTanggalPertemuanEkskul = function(pIdx) {
    let ek = window.ambilEkskulAktif();
    if (!ek || !ek.pertemuan[pIdx]) return;
    let lama = ek.pertemuan[pIdx].tanggal || window.ekskulTanggalHariIniISO();

    let proses = function(val) {
        if (!val || !val.trim()) return;
        ek.pertemuan[pIdx].tanggal = val.trim();
        window.simpanDataEkskulKeServer(true);
        window.renderTabAbsensiEkskul();
    };

    if (typeof window.tampilkanCustomDialog === 'function') {
        window.tampilkanCustomDialog('prompt', 'Ubah tanggal pertemuan ke-' + (pIdx + 1) + ' (YYYY-MM-DD):', lama, proses);
    } else {
        let v = prompt('Ubah tanggal (YYYY-MM-DD):', lama);
        if (v) proses(v);
    }
};

window.hapusPertemuanEkskul = function(pIdx) {
    let ek = window.ambilEkskulAktif();
    if (!ek || !ek.pertemuan[pIdx]) return;
    let pt = ek.pertemuan[pIdx];

    let jalankan = function() {
        ek.pertemuan.splice(pIdx, 1);
        if (ek.absensi && ek.absensi[pt.id]) delete ek.absensi[pt.id];
        window.simpanDataEkskulKeServer(true);
        window.renderTabAbsensiEkskul();
    };

    let msg = 'Hapus kolom kehadiran Pertemuan ' + (pIdx + 1) + ' (' + pt.tanggal + ')?';
    if (typeof window.tampilkanCustomDialog === 'function') {
        window.tampilkanCustomDialog('confirm', msg, null, function(ok) {
            if (ok) jalankan();
        });
    } else if (confirm(msg)) {
        jalankan();
    }
};

window.siklusStatusAbsenEkskul = function(ptId, angKey) {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    if (!ek.absensi[ptId]) ek.absensi[ptId] = {};

    let urutan = ['-', 'H', 'S', 'I', 'A'];
    let cur = ek.absensi[ptId][angKey] || '-';
    let nextIdx = (urutan.indexOf(cur) + 1) % urutan.length;
    let nextVal = urutan[nextIdx];

    if (nextVal === '-') delete ek.absensi[ptId][angKey];
    else ek.absensi[ptId][angKey] = nextVal;

    window.simpanDataEkskulKeServer(false);
    window.renderTabAbsensiEkskul();
};

window.tandaiSemuaHadirEkskul = function(ptId) {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    if (!ek.absensi[ptId]) ek.absensi[ptId] = {};
    ek.anggota.forEach(function(ang) {
        ek.absensi[ptId][ang.key] = 'H';
    });
    window.simpanDataEkskulKeServer(true);
    window.renderTabAbsensiEkskul();
};

window.exportExcelAbsensiEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek || ek.anggota.length === 0) return alert('⚠️ Belum ada data kehadiran untuk diekspor.');

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Calibri,sans-serif;font-size:12px;}th,td{border:1px solid #000;padding:6px;text-align:center;}th{background:#2370A1;color:#fff;}.left{text-align:left;}</style></head><body>';
    html += '<h3>Rekap Kehadiran Ekstrakurikuler: ' + window.ekskulEscHtml(ek.nama) + '</h3>';
    html += '<table><thead><tr><th>No</th><th class="left">Nama Siswa</th><th>Kelas</th>';
    ek.pertemuan.forEach(function(pt, i) {
        html += '<th>P' + (i + 1) + ' (' + window.ekskulEscHtml(pt.tanggal) + ')</th>';
    });
    html += '<th>H</th><th>S</th><th>I</th><th>A</th></tr></thead><tbody>';

    ek.anggota.forEach(function(ang, idx) {
        let cnt = { H: 0, S: 0, I: 0, A: 0 };
        html += '<tr><td>' + (idx + 1) + '</td><td class="left">' + window.ekskulEscHtml(ang.nama) + '</td><td>' + window.ekskulEscHtml(ang.kelas) + '</td>';
        ek.pertemuan.forEach(function(pt) {
            let st = (ek.absensi[pt.id] && ek.absensi[pt.id][ang.key]) ? ek.absensi[pt.id][ang.key] : '-';
            if (cnt[st] !== undefined) cnt[st]++;
            html += '<td>' + st + '</td>';
        });
        html += '<td>' + cnt.H + '</td><td>' + cnt.S + '</td><td>' + cnt.I + '</td><td>' + cnt.A + '</td></tr>';
    });

    html += '</tbody></table></body></html>';

    let blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'Kehadiran_Ekskul_' + String(ek.nama || 'Ekskul').replace(/\s+/g, '_') + '.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// =========================================================================
// 5. TAB 4: UJIAN KHUSUS EKSTRAKURIKULER & REKAP NILAI TERPISAH
//    (Nilai 100% terpisah dari Rekap Nilai kelas reguler)
// =========================================================================
window._ekskulPaketRekapAktif = '';
window._ekskulKoreksiTarget = null;

window.sanitasiKeyEkskul = function(str) {
    if (typeof window.sanitasiKeyRekapFirebase === 'function') {
        return window.sanitasiKeyRekapFirebase(str);
    }
    return String(str || '').trim().replace(/[.#\[\]\/]/g, '_');
};

window.cariUjianAktifEkskulByKode = function(kodeRaw) {
    window.pastikanDataEkskulSiap();
    let kode = String(kodeRaw || '').trim().toUpperCase();
    if (!kode) return null;

    let keys = Object.keys(window.adminEkskulData || {});
    for (let i = 0; i < keys.length; i++) {
        let ekId = keys[i];
        let ek = window.adminEkskulData[ekId];
        if (ek && ek.ujianAktif && ek.ujianAktif[kode]) {
            return {
                ekskulId: ekId,
                ekskul: ek,
                kode: kode,
                ujian: ek.ujianAktif[kode]
            };
        }
    }
    return null;
};

window.apakahSiswaAnggotaEkskul = function(ekskulObj, kelas, nama) {
    if (!ekskulObj || !Array.isArray(ekskulObj.anggota)) return false;
    let keyTarget = window.buatKeyAnggotaEkskul(kelas, nama).toLowerCase();
    let namaLow = String(nama || '').trim().toLowerCase();
    let kelasLow = String(kelas || '').trim().toLowerCase();

    return ekskulObj.anggota.some(function(a) {
        if (!a) return false;
        let aKey = String(a.key || window.buatKeyAnggotaEkskul(a.kelas, a.nama)).toLowerCase();
        if (aKey === keyTarget) return true;
        return String(a.nama || '').trim().toLowerCase() === namaLow &&
               String(a.kelas || '').trim().toLowerCase() === kelasLow;
    });
};

window.simpanHasilUjianEkskulKeDB = function(ekskulId, paketNama, kelas, nama, payloadRekap, onSuccess, onError) {
    window.pastikanDataEkskulSiap();
    let ek = window.adminEkskulData[ekskulId];
    let safePkt = window.sanitasiKeyEkskul(paketNama);
    let angKey = window.buatKeyAnggotaEkskul(kelas, nama);

    if (ek) {
        if (!ek.rekapNilai || typeof ek.rekapNilai !== 'object') ek.rekapNilai = {};
        if (!ek.rekapNilai[safePkt] || typeof ek.rekapNilai[safePkt] !== 'object') ek.rekapNilai[safePkt] = {};
        ek.rekapNilai[safePkt][angKey] = payloadRekap;
        try {
            localStorage.setItem(window.ekskulCacheLocalKey(), JSON.stringify(window.adminEkskulData));
        } catch (e) {}
    }

    let pathRelatif = 'admin_ekskul_data/' + ekskulId + '/rekapNilai/' + safePkt + '/' + angKey;
    if (typeof window.kirimNilaiUjianAmanKeDB === 'function') {
        window.kirimNilaiUjianAmanKeDB(pathRelatif, payloadRekap, function() {
            if (window.ekskulTabAktif === 'tab-ekskul-ujian') window.renderTabUjianEkskul();
            if (onSuccess) onSuccess();
        }, function(err) {
            if (onError) onError(err);
        });
    } else if (typeof window.tulisDataRestFirebase === 'function') {
        let fullPath = 'data_guru/' + window.ekskulKeyGuruAktif() + '/' + pathRelatif;
        Promise.resolve(window.tulisDataRestFirebase(fullPath, payloadRekap, 'PUT')).then(function() {
            if (window.ekskulTabAktif === 'tab-ekskul-ujian') window.renderTabUjianEkskul();
            if (onSuccess) onSuccess();
        }).catch(function(err) {
            if (onError) onError(err);
        });
    } else {
        if (onSuccess) onSuccess();
    }
};

window.renderTabUjianEkskul = function() {
    let cont = document.getElementById('tab-ekskul-ujian');
    let ek = window.ambilEkskulAktif();
    if (!cont || !ek) return;

    if (ek.anggota.length === 0) {
        cont.innerHTML =
            '<div class="ekskul-empty-box">' +
                '<div style="font-size:38px; margin-bottom:8px;">🎯</div>' +
                '<strong>Pilih Anggota Ekstrakurikuler Terlebih Dahulu</strong>' +
                '<p>Ujian khusus Ekstrakurikuler hanya bisa diakses oleh siswa yang dicentang pada tab <b>Anggota</b>, dan nilainya tersimpan terpisah di sini.</p>' +
                '<button type="button" class="aws-quick-btn is-primary" onclick="window.bukaTabEkskul(\'tab-ekskul-anggota\')">👥 Pilih Anggota Sekarang</button>' +
            '</div>';
        return;
    }

    // 1. Opsi Bank Ujian yang tersedia untuk diaktifkan
    let bankKeys = Object.keys(window.adminBankUjianData || {}).sort();
    let optBank = '<option value="">-- Pilih Paket dari Bank Ujian --</option>';
    bankKeys.forEach(function(namaPkt) {
        optBank += '<option value="' + window.ekskulEscHtml(namaPkt) + '">' + window.ekskulEscHtml(namaPkt) + '</option>';
    });

    // 2. Daftar Ujian Ekskul Sedang Aktif
    let aktifKeys = Object.keys(ek.ujianAktif || {});
    let htmlAktif = '';
    if (aktifKeys.length === 0) {
        htmlAktif = '<div style="text-align:center; padding:18px; color:#64748b; font-size:12px; background:#f8fffc; border:1px dashed #cdebe5; border-radius:10px;">Belum ada ujian ekskul yang sedang aktif.</div>';
    } else {
        aktifKeys.forEach(function(kode) {
            let u = ek.ujianAktif[kode] || {};
            let safeKode = window.ekskulEscHtml(kode).replace(/'/g, "\\'");
            htmlAktif +=
                '<div class="ekskul-aktif-item">' +
                    '<div>' +
                        '<div style="font-weight:800; color:var(--aws-dark); font-size:13px;">🎯 ' + window.ekskulEscHtml(u.paket || kode) + '</div>' +
                        '<div style="font-size:11.5px; color:#526a7d; margin-top:3px;">' +
                            'Kode Akses: <span class="ekskul-code-pill">' + window.ekskulEscHtml(kode) + '</span> • Durasi: <b>' + (Number(u.durasi) || 60) + ' Menit</b> • Khusus ' + ek.anggota.length + ' Anggota' +
                        '</div>' +
                    '</div>' +
                    '<button type="button" class="aws-quick-btn is-danger" style="padding:6px 12px; font-size:11px;" onclick="window.tutupUjianEkskul(\'' + safeKode + '\')">🛑 Tutup</button>' +
                '</div>';
        });
    }

    // 3. Kumpulkan daftar paket nilai ekskul (gabungan ujian yang pernah ada nilainya + ujian aktif)
    let paketMap = {};
    Object.keys(ek.rekapNilai || {}).forEach(function(pKey) {
        let mapSiswa = ek.rekapNilai[pKey] || {};
        let sampel = Object.values(mapSiswa)[0];
        paketMap[pKey] = (sampel && sampel.paketAsli) ? sampel.paketAsli : pKey;
    });
    aktifKeys.forEach(function(kode) {
        let u = ek.ujianAktif[kode];
        if (u && u.paket) {
            let sP = window.sanitasiKeyEkskul(u.paket);
            if (!paketMap[sP]) paketMap[sP] = u.paket;
        }
    });

    let paketKeys = Object.keys(paketMap).sort(function(a, b) {
        return String(paketMap[a]).localeCompare(String(paketMap[b]));
    });

    if (!window._ekskulPaketRekapAktif || !paketMap[window._ekskulPaketRekapAktif]) {
        window._ekskulPaketRekapAktif = paketKeys[0] || '';
    }

    let optRekap = '<option value="">-- Pilih Paket Ujian Ekskul --</option>';
    paketKeys.forEach(function(pKey) {
        let isSel = (pKey === window._ekskulPaketRekapAktif) ? ' selected' : '';
        optRekap += '<option value="' + window.ekskulEscHtml(pKey) + '"' + isSel + '>' + window.ekskulEscHtml(paketMap[pKey]) + '</option>';
    });

    // 4. Rakit Tabel Rekap Nilai Khusus Anggota Ekskul
    let bodyRekap = '';
    let pktTerpilih = window._ekskulPaketRekapAktif;
    let mapNilaiPkt = (pktTerpilih && ek.rekapNilai && ek.rekapNilai[pktTerpilih]) ? ek.rekapNilai[pktTerpilih] : {};
    let namaPaketAsli = pktTerpilih ? (paketMap[pktTerpilih] || pktTerpilih) : '';

    if (!pktTerpilih) {
        bodyRekap = '<tr><td colspan="7" style="padding:24px; text-align:center; color:#64748b; font-weight:600;">Aktifkan ujian ekskul terlebih dahulu di panel atas untuk mulai merekam nilai khusus anggota.</td></tr>';
    } else {
        ek.anggota.forEach(function(ang, idx) {
            let rec = mapNilaiPkt[ang.key] || null;
            let safePktJS = String(pktTerpilih).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            let safeAngJS = String(ang.key).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            let safeKlsJS = String(ang.kelas).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            let safeNamaJS = String(ang.nama).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

            if (rec) {
                let dObj = rec.waktuKumpul ? new Date(rec.waktuKumpul) : null;
                let waktuStr = (dObj && !isNaN(dObj.getTime()))
                    ? (String(dObj.getHours()).padStart(2, '0') + ':' + String(dObj.getMinutes()).padStart(2, '0') + ' - ' + String(dObj.getDate()).padStart(2, '0') + '/' + String(dObj.getMonth() + 1).padStart(2, '0'))
                    : 'Input Manual';
                let pel = Number(rec.pelanggaran) || 0;
                let badgePel = pel > 0
                    ? '<span style="background:#f59e0b; color:#fff; padding:2px 8px; border-radius:10px; font-size:10.5px; font-weight:700;">' + pel + 'x</span>'
                    : '<span style="color:#15803d; font-weight:700;">Aman</span>';
                let nilaiNum = rec.nilaiAkhir !== undefined ? Number(rec.nilaiAkhir).toFixed(1) : '-';

                bodyRekap +=
                    '<tr>' +
                        '<td style="text-align:center; font-weight:700; color:#526a7d;">' + (idx + 1) + '</td>' +
                        '<td style="text-align:left; font-weight:700; color:var(--aws-dark);">' + window.ekskulEscHtml(ang.nama) + '</td>' +
                        '<td style="text-align:center; font-size:11.5px; font-weight:700; color:var(--aws-blue);">' + window.ekskulEscHtml(ang.kelas) + '</td>' +
                        '<td style="text-align:center; font-size:11.5px; color:#526a7d;">' + waktuStr + '</td>' +
                        '<td style="text-align:center;">' + badgePel + '</td>' +
                        '<td style="text-align:center; font-size:17px; font-weight:900; color:#0f766e;">' + nilaiNum + '</td>' +
                        '<td style="text-align:center; white-space:nowrap;">' +
                            '<button type="button" class="aws-quick-btn" style="padding:4px 10px; font-size:11px;" onclick="window.bukaDetailNilaiEkskul(\'' + safePktJS + '\', \'' + safeAngJS + '\')">🔍 Detail</button> ' +
                            '<button type="button" class="aws-quick-btn is-danger-soft" style="padding:4px 9px; font-size:11px;" onclick="window.hapusNilaiSiswaEkskul(\'' + safePktJS + '\', \'' + safeAngJS + '\', \'' + safeNamaJS + '\')" title="Hapus Nilai Siswa Ini">✕</button>' +
                        '</td>' +
                    '</tr>';
            } else {
                bodyRekap +=
                    '<tr style="background:#fcfdfd;">' +
                        '<td style="text-align:center; font-weight:700; color:#94a3b8;">' + (idx + 1) + '</td>' +
                        '<td style="text-align:left; font-weight:600; color:#64748b;">' + window.ekskulEscHtml(ang.nama) + ' <span style="font-size:10px; color:#dc2626; font-style:italic;">(Belum Ujian)</span></td>' +
                        '<td style="text-align:center; font-size:11.5px; color:#64748b;">' + window.ekskulEscHtml(ang.kelas) + '</td>' +
                        '<td style="text-align:center; color:#cbd5e1;">-</td>' +
                        '<td style="text-align:center; color:#cbd5e1;">-</td>' +
                        '<td style="text-align:center;">' +
                            '<input type="number" min="0" max="100" step="0.1" placeholder="Skor" class="input-box" style="width:72px; margin:0; padding:5px; text-align:center; font-weight:700;" onchange="window.simpanNilaiManualEkskul(\'' + safePktJS + '\', \'' + window.ekskulEscHtml(namaPaketAsli).replace(/'/g, "\\'") + '\', \'' + safeKlsJS + '\', \'' + safeNamaJS + '\', this)">' +
                        '</td>' +
                        '<td style="text-align:center; font-size:11px; color:#94a3b8;">Input Cepat</td>' +
                    '</tr>';
            }
        });
    }

    cont.innerHTML =
        '<div class="ekskul-section-head">' +
            '<div>' +
                '<h4 style="margin:0;">🎯 Ujian &amp; Rekap Nilai Khusus: <span style="color:var(--aws-blue);">' + window.ekskulEscHtml(ek.nama) + '</span></h4>' +
                '<div style="font-size:11.5px; color:#526a7d; margin-top:2px;">Siswa masuk melalui menu <b>🎯 UJIAN</b> biasa memakai kode di bawah. Nilai <b>hanya masuk ke tabel ini</b> (tidak mencampuri Rekap Nilai kelas).</div>' +
            '</div>' +
            '<button type="button" class="aws-quick-btn" onclick="window.muatDataEkskulDariServer(true)">🔄 Segarkan Nilai</button>' +
        '</div>' +

        '<div class="ekskul-ujian-grid">' +
            '<div class="ekskul-ujian-card">' +
                '<h5>➕ Aktifkan Ujian Khusus Anggota</h5>' +
                '<label>Pilih Paket Soal (dari Bank Ujian):</label>' +
                '<select id="ekskul-pilih-paket-ujian" class="input-box" style="margin-bottom:10px; font-weight:700;">' + optBank + '</select>' +
                '<div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">' +
                    '<div style="flex:1.2; min-width:130px;">' +
                        '<label>Kode Akses Khusus Ekskul:</label>' +
                        '<input type="text" id="ekskul-kode-ujian" class="input-box" style="margin:0; font-weight:800; text-transform:uppercase;" placeholder="Misal: KIR01">' +
                    '</div>' +
                    '<div style="flex:0.8; min-width:100px;">' +
                        '<label>Durasi (Menit):</label>' +
                        '<input type="number" id="ekskul-durasi-ujian" class="input-box" style="margin:0; font-weight:700;" value="60" min="5">' +
                    '</div>' +
                '</div>' +
                '<button type="button" class="aws-quick-btn is-primary" style="width:100%; justify-content:center; padding:9px;" onclick="window.aktifkanUjianEkskul()">🚀 Aktifkan Ujian Ekskul</button>' +
            '</div>' +

            '<div class="ekskul-ujian-card">' +
                '<h5>🔴 Ujian Ekskul Sedang Aktif (' + aktifKeys.length + ')</h5>' +
                '<div style="display:flex; flex-direction:column; gap:8px;">' + htmlAktif + '</div>' +
            '</div>' +
        '</div>' +

        '<div class="ekskul-rekap-box">' +
            '<div class="ekskul-rekap-bar">' +
                '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">' +
                    '<strong style="font-size:13px; color:var(--aws-dark);">📊 Rekap Nilai Khusus Ekskul:</strong>' +
                    '<select id="ekskul-select-rekap-paket" class="input-box aws-select-pill" style="width:240px !important;" onchange="window._ekskulPaketRekapAktif = this.value; window.renderTabUjianEkskul();">' + optRekap + '</select>' +
                '</div>' +
                '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
                    '<button type="button" class="aws-quick-btn is-primary" onclick="window.exportExcelRekapEkskul()">📥 Export Excel Nilai</button>' +
                    (pktTerpilih ? '<button type="button" class="aws-quick-btn is-danger-soft" onclick="window.hapusSemuaNilaiPaketEkskul(\'' + window.ekskulEscHtml(pktTerpilih).replace(/'/g, "\\'") + '\')">🗑️ Hapus Data Ujian Ini</button>' : '') +
                '</div>' +
            '</div>' +
            '<div class="ekskul-table-wrap">' +
                '<table class="excel-table" style="min-width:740px;">' +
                    '<thead><tr>' +
                        '<th style="width:42px; text-align:center;">No</th>' +
                        '<th style="text-align:left; min-width:180px;">Nama Anggota</th>' +
                        '<th style="width:110px; text-align:center;">Kelas</th>' +
                        '<th style="width:130px; text-align:center;">Waktu Kumpul</th>' +
                        '<th style="width:95px; text-align:center;">Pelanggaran</th>' +
                        '<th style="width:95px; text-align:center;">Nilai Akhir</th>' +
                        '<th style="width:140px; text-align:center;">Aksi</th>' +
                    '</tr></thead>' +
                    '<tbody>' + bodyRekap + '</tbody>' +
                '</table>' +
            '</div>' +
        '</div>';
};

window.aktifkanUjianEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;

    let paket = document.getElementById('ekskul-pilih-paket-ujian') ? document.getElementById('ekskul-pilih-paket-ujian').value : '';
    let kode = document.getElementById('ekskul-kode-ujian') ? document.getElementById('ekskul-kode-ujian').value.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '') : '';
    let durasi = document.getElementById('ekskul-durasi-ujian') ? parseInt(document.getElementById('ekskul-durasi-ujian').value, 10) : 60;

    if (!paket) return alert('⚠️ Pilih paket soal dari Bank Ujian terlebih dahulu!');
    if (!kode) return alert('⚠️ Masukkan Kode Akses untuk ujian ekstrakurikuler!');
    if (!durasi || durasi <= 0) return alert('⚠️ Durasi ujian harus lebih dari 0 menit!');

    // Pastikan kode tidak bentrok dengan ujian kelas reguler maupun ekskul lain
    if (window.adminUjianAktifData && window.adminUjianAktifData[kode]) {
        return alert('⚠️ Kode "' + kode + '" sedang dipakai oleh Ujian Kelas reguler. Gunakan kode lain.');
    }
    let bentrokEkskul = window.cariUjianAktifEkskulByKode(kode);
    if (bentrokEkskul) {
        return alert('⚠️ Kode "' + kode + '" sudah dipakai oleh ekskul "' + bentrokEkskul.ekskul.nama + '". Gunakan kode lain.');
    }

    if (!ek.ujianAktif) ek.ujianAktif = {};
    ek.ujianAktif[kode] = {
        paket: paket,
        durasi: durasi,
        ekskulId: ek.id,
        ekskulNama: ek.nama,
        dibuat: new Date().toISOString()
    };

    window._ekskulPaketRekapAktif = window.sanitasiKeyEkskul(paket);
    window.simpanDataEkskulKeServer(true);
    window.renderTabUjianEkskul();
    alert('✅ Ujian Ekstrakurikuler aktif!\n\nBagikan Kode Akses: ' + kode + ' kepada anggota ' + ek.nama + '.');
};

window.tutupUjianEkskul = function(kode) {
    let ek = window.ambilEkskulAktif();
    if (!ek || !ek.ujianAktif || !ek.ujianAktif[kode]) return;

    let jalankan = function() {
        delete ek.ujianAktif[kode];
        window.simpanDataEkskulKeServer(true);
        window.renderTabUjianEkskul();
    };

    let msg = 'Tutup akses ujian ekskul dengan kode "' + kode + '"?';
    if (typeof window.tampilkanCustomDialog === 'function') {
        window.tampilkanCustomDialog('confirm', msg, null, function(ok) { if (ok) jalankan(); });
    } else if (confirm(msg)) {
        jalankan();
    }
};

window.simpanNilaiManualEkskul = function(safePkt, paketAsli, kelas, nama, inputEl) {
    let ek = window.ambilEkskulAktif();
    if (!ek) return;
    let val = parseFloat(inputEl.value);
    if (isNaN(val) || val < 0 || val > 100) {
        alert('⚠️ Masukkan nilai antara 0 sampai 100.');
        inputEl.value = '';
        return;
    }

    let payload = {
        namaAsli: nama,
        kelasAsli: kelas,
        paketAsli: paketAsli,
        ekskulId: ek.id,
        ekskulNama: ek.nama,
        nilaiAkhir: parseFloat(val.toFixed(2)),
        waktuKumpul: new Date().toISOString(),
        pelanggaran: 0,
        detail: [],
        sudahDikoreksi: true
    };

    window.simpanHasilUjianEkskulKeDB(ek.id, paketAsli, kelas, nama, payload, function() {
        window.renderTabUjianEkskul();
    });
};

window.hapusNilaiSiswaEkskul = function(safePkt, angKey, namaSiswa) {
    let ek = window.ambilEkskulAktif();
    if (!ek || !ek.rekapNilai || !ek.rekapNilai[safePkt]) return;

    let jalankan = function() {
        delete ek.rekapNilai[safePkt][angKey];
        window.simpanDataEkskulKeServer(true);
        window.renderTabUjianEkskul();
    };

    let msg = 'Hapus nilai ujian ekskul milik "' + namaSiswa + '"? Siswa dapat mengerjakan ulang setelah dihapus.';
    if (typeof window.tampilkanCustomDialog === 'function') {
        window.tampilkanCustomDialog('confirm', msg, null, function(ok) { if (ok) jalankan(); });
    } else if (confirm(msg)) {
        jalankan();
    }
};

window.hapusSemuaNilaiPaketEkskul = function(safePkt) {
    let ek = window.ambilEkskulAktif();
    if (!ek || !ek.rekapNilai || !ek.rekapNilai[safePkt]) return;

    let jalankan = function() {
        delete ek.rekapNilai[safePkt];
        window._ekskulPaketRekapAktif = '';
        window.simpanDataEkskulKeServer(true);
        window.renderTabUjianEkskul();
    };

    let msg = 'Hapus SELURUH data nilai untuk paket ujian ekskul ini?';
    if (typeof window.tampilkanCustomDialog === 'function') {
        window.tampilkanCustomDialog('confirm', msg, null, function(ok) { if (ok) jalankan(); });
    } else if (confirm(msg)) {
        jalankan();
    }
};

window.exportExcelRekapEkskul = function() {
    let ek = window.ambilEkskulAktif();
    let pktKey = window._ekskulPaketRekapAktif;
    if (!ek || !pktKey) return alert('⚠️ Pilih paket ujian ekskul terlebih dahulu.');

    let mapNilai = (ek.rekapNilai && ek.rekapNilai[pktKey]) ? ek.rekapNilai[pktKey] : {};
    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Calibri,sans-serif;font-size:12px;}th,td{border:1px solid #000;padding:6px;text-align:center;}th{background:#2370A1;color:#fff;}.left{text-align:left;}</style></head><body>';
    html += '<h3>Rekap Nilai Ujian Ekstrakurikuler: ' + window.ekskulEscHtml(ek.nama) + '</h3>';
    html += '<p>Paket Ujian: ' + window.ekskulEscHtml(pktKey) + '</p>';
    html += '<table><thead><tr><th>No</th><th class="left">Nama Anggota</th><th>Kelas</th><th>Pelanggaran</th><th>Nilai Akhir</th></tr></thead><tbody>';

    ek.anggota.forEach(function(ang, idx) {
        let rec = mapNilai[ang.key];
        html += '<tr><td>' + (idx + 1) + '</td><td class="left">' + window.ekskulEscHtml(ang.nama) + '</td><td>' + window.ekskulEscHtml(ang.kelas) + '</td><td>' + (rec ? (rec.pelanggaran || 0) : '-') + '</td><td><b>' + (rec && rec.nilaiAkhir !== undefined ? Number(rec.nilaiAkhir).toFixed(1) : '-') + '</b></td></tr>';
    });

    html += '</tbody></table></body></html>';

    let blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'Nilai_Ekskul_' + String(ek.nama || 'Ekskul').replace(/\s+/g, '_') + '_' + String(pktKey).replace(/\s+/g, '_') + '.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// Modal Detail & Koreksi Khusus Nilai Ujian Ekstrakurikuler
window.bukaDetailNilaiEkskul = function(safePkt, angKey) {
    let ek = window.ambilEkskulAktif();
    if (!ek || !ek.rekapNilai || !ek.rekapNilai[safePkt] || !ek.rekapNilai[safePkt][angKey]) return;

    let rec = ek.rekapNilai[safePkt][angKey];
    let detailArr = Array.isArray(rec.detail) ? rec.detail : Object.values(rec.detail || {});
    window._ekskulKoreksiTarget = { ekskulId: ek.id, safePkt: safePkt, angKey: angKey, rec: rec };

    let modal = document.getElementById('modal-detail-nilai-ekskul');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-detail-nilai-ekskul';
        modal.className = 'modal-overlay';
        modal.onclick = function(e) { if (e.target === modal) window.tutupModal('modal-detail-nilai-ekskul'); };
        modal.innerHTML =
            '<div class="modal-box" style="width:780px; max-width:95vw; max-height:90vh; display:flex; flex-direction:column;">' +
                '<div class="modal-header" style="background:#060608; color:#fff;">' +
                    '<div><h3 id="ekskul-det-judul" style="margin:0; color:#00E1FF;">🔍 Detail Jawaban Ekskul</h3><div id="ekskul-det-sub" style="font-size:11.5px; color:#A7FFF3; margin-top:2px;"></div></div>' +
                    '<button type="button" class="close-btn" style="color:#fff;" onclick="window.tutupModal(\'modal-detail-nilai-ekskul\')">✕</button>' +
                '</div>' +
                '<div id="ekskul-det-body" class="modal-body" style="background:#f5fff9; display:flex; flex-direction:column; gap:10px;"></div>' +
                '<div style="padding:12px 18px; background:#fff; border-top:1.5px solid #A7FFF3; display:flex; justify-content:space-between; align-items:center; gap:10px;">' +
                    '<div style="font-size:13px; font-weight:800; color:#060608;">Nilai Akhir: <span id="ekskul-det-nilai-live" style="font-size:20px; color:#2370A1;">0</span></div>' +
                    '<button type="button" class="aws-quick-btn is-primary" onclick="window.simpanKoreksiDetailEkskul()">💾 Simpan Koreksi Ekskul</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);
    }

    document.getElementById('ekskul-det-judul').innerText = '🔍 ' + (rec.namaAsli || angKey) + ' (' + (rec.kelasAsli || '-') + ')';
    document.getElementById('ekskul-det-sub').innerText = '🏕️ ' + ek.nama + ' • 📝 ' + (rec.paketAsli || safePkt);

    let body = document.getElementById('ekskul-det-body');
    if (detailArr.length === 0) {
        body.innerHTML =
            '<div style="background:#fff; padding:18px; border-radius:12px; border:1px solid #cdebe5;">' +
                '<p style="margin:0 0 10px 0; font-size:13px;">Nilai ini diinput manual. Anda dapat mengubah nilai akhirnya di bawah ini:</p>' +
                '<input type="number" id="ekskul-edit-nilai-manual-only" class="input-box" min="0" max="100" step="0.1" value="' + (rec.nilaiAkhir || 0) + '" oninput="document.getElementById(\'ekskul-det-nilai-live\').innerText=this.value">' +
            '</div>';
    } else {
        let html = '';
        detailArr.forEach(function(item, idx) {
            let pDidapat = Number(item.poinDidapat !== undefined ? item.poinDidapat : (item.poin || 0)) || 0;
            let pMax = Number(item.maxPoin) || (100 / detailArr.length);
            let isBenar = pDidapat > 0;
            let kunciStr = Array.isArray(item.kunci) ? item.kunci.join(' | ') : String(item.kunci || '-');
            let jwbStr = item.jawabSiswa !== undefined ? item.jawabSiswa : (item.jawabanSiswa || '-');

            html +=
                '<div style="background:#fff; border:1.5px solid #cdebe5; border-left:4px solid ' + (isBenar ? '#16a34a' : '#dc2626') + '; border-radius:10px; padding:12px;">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">' +
                        '<strong style="font-size:12.5px; color:#060608;">No. ' + (item.nomor || (idx + 1)) + ' (' + window.ekskulEscHtml(item.tipe || 'PG') + ')</strong>' +
                        '<label style="display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:800; color:#15803d; cursor:pointer;">' +
                            '<input type="checkbox" id="chk-ekskul-kor-' + idx + '" ' + (isBenar ? 'checked' : '') + ' style="width:17px; height:17px; accent-color:#2370A1;" onchange="window.hitungLiveNilaiEkskul()"> Benar (' + pMax.toFixed(1) + ' pt)' +
                        '</label>' +
                    '</div>' +
                    '<div style="font-size:12.5px; color:#1e293b; margin-bottom:8px;">' + (item.soal || '') + '</div>' +
                    '<div style="display:flex; gap:10px; flex-wrap:wrap; font-size:12px;">' +
                        '<span style="background:#f1f5f9; padding:4px 10px; border-radius:8px;">✍️ Jawaban: <b>' + window.ekskulEscHtml(jwbStr) + '</b></span>' +
                        '<span style="background:#fef9c3; padding:4px 10px; border-radius:8px; color:#854d0e;">🔑 Kunci: <b>' + window.ekskulEscHtml(kunciStr) + '</b></span>' +
                    '</div>' +
                '</div>';
        });
        body.innerHTML = html;
    }

    document.getElementById('ekskul-det-nilai-live').innerText = Number(rec.nilaiAkhir || 0).toFixed(1);
    window.bukaModal('modal-detail-nilai-ekskul');
};

window.hitungLiveNilaiEkskul = function() {
    let t = window._ekskulKoreksiTarget;
    if (!t || !t.rec) return;
    let detailArr = Array.isArray(t.rec.detail) ? t.rec.detail : [];
    if (detailArr.length === 0) return;

    let tot = 0, maxT = 0;
    detailArr.forEach(function(item, idx) {
        let pMax = Number(item.maxPoin) || (100 / detailArr.length);
        let chk = document.getElementById('chk-ekskul-kor-' + idx);
        if (chk && chk.checked) tot += pMax;
        maxT += pMax;
    });
    let skala = maxT > 0 ? ((tot / maxT) * 100) : 0;
    let el = document.getElementById('ekskul-det-nilai-live');
    if (el) el.innerText = skala.toFixed(1);
};

window.simpanKoreksiDetailEkskul = function() {
    let t = window._ekskulKoreksiTarget;
    if (!t || !t.rec) return;

    let detailArr = Array.isArray(t.rec.detail) ? t.rec.detail : [];
    if (detailArr.length === 0) {
        let inpMan = document.getElementById('ekskul-edit-nilai-manual-only');
        let v = inpMan ? parseFloat(inpMan.value) : 0;
        if (isNaN(v) || v < 0 || v > 100) return alert('⚠️ Nilai harus 0–100.');
        t.rec.nilaiAkhir = parseFloat(v.toFixed(2));
    } else {
        let tot = 0, maxT = 0;
        detailArr.forEach(function(item, idx) {
            let pMax = Number(item.maxPoin) || (100 / detailArr.length);
            let chk = document.getElementById('chk-ekskul-kor-' + idx);
            let ok = chk ? chk.checked : false;
            item.poinDidapat = ok ? pMax : 0;
            item.poin = item.poinDidapat;
            item.maxPoin = pMax;
            item.status = ok ? 'Benar' : 'Salah';
            tot += item.poinDidapat;
            maxT += pMax;
        });
        t.rec.nilaiAkhir = parseFloat((maxT > 0 ? (tot / maxT) * 100 : 0).toFixed(2));
        t.rec.detail = detailArr;
        t.rec.sudahDikoreksi = true;
    }

    window.simpanHasilUjianEkskulKeDB(
        t.ekskulId,
        t.rec.paketAsli || t.safePkt,
        t.rec.kelasAsli || '',
        t.rec.namaAsli || t.angKey,
        t.rec,
        function() {
            window.tutupModal('modal-detail-nilai-ekskul');
            window.renderTabUjianEkskul();
        }
    );
};
window.exportExcelRencanaEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek || ek.rencana.length === 0) return alert('⚠️ Belum ada data rencana mingguan untuk diekspor.');
    let rows = ek.rencana.map(function(item, idx) {
        return [idx + 1, item.minggu || '', item.tanggal || '', item.materi || '', item.aktivitas || '', item.keterangan || ''];
    });
    window.bukaPreviewSpreadsheetUniversal({
        title: 'Rencana Mingguan Ekskul – ' + ek.nama,
        subtitle: 'Pembina: ' + (ek.pembina || '-') + ' • Jadwal: ' + (ek.jadwalRutin || '-'),
        filenameBase: 'Rencana_Ekskul_' + String(ek.nama || 'Ekskul').replace(/\s+/g, '_'),
        headers: ['No', 'Minggu', 'Tanggal', 'Topik / Materi', 'Aktivitas & Target', 'Alat / Keterangan'],
        rows: rows
    });
};

window.exportExcelAnggotaEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek || ek.anggota.length === 0) return alert('⚠️ Belum ada anggota ekstrakurikuler yang dipilih.');
    let rows = ek.anggota.map(function(a, idx) {
        return [idx + 1, a.nama, a.kelas];
    });
    window.bukaPreviewSpreadsheetUniversal({
        title: 'Daftar Anggota Ekskul – ' + ek.nama,
        subtitle: ek.anggota.length + ' Siswa Terdaftar',
        filenameBase: 'Anggota_Ekskul_' + String(ek.nama || 'Ekskul').replace(/\s+/g, '_'),
        headers: ['No', 'Nama Siswa', 'Kelas'],
        rows: rows
    });
};

window.exportExcelAbsensiEkskul = function() {
    let ek = window.ambilEkskulAktif();
    if (!ek || ek.anggota.length === 0) return alert('⚠️ Belum ada data kehadiran untuk diekspor.');
    let headers = ['No', 'Nama Siswa', 'Kelas'];
    ek.pertemuan.forEach(function(pt, i) { headers.push('P' + (i + 1) + ' (' + pt.tanggal + ')'); });
    headers.push('H', 'S', 'I', 'A');

    let rows = ek.anggota.map(function(ang, idx) {
        let cnt = { H: 0, S: 0, I: 0, A: 0 };
        let r = [idx + 1, ang.nama, ang.kelas];
        ek.pertemuan.forEach(function(pt) {
            let st = (ek.absensi[pt.id] && ek.absensi[pt.id][ang.key]) ? ek.absensi[pt.id][ang.key] : '-';
            if (cnt[st] !== undefined) cnt[st]++;
            r.push(st);
        });
        r.push(cnt.H, cnt.S, cnt.I, cnt.A);
        return r;
    });
    window.bukaPreviewSpreadsheetUniversal({
        title: 'Rekap Kehadiran Ekskul – ' + ek.nama,
        subtitle: ek.pertemuan.length + ' Pertemuan • ' + ek.anggota.length + ' Anggota',
        filenameBase: 'Kehadiran_Ekskul_' + String(ek.nama || 'Ekskul').replace(/\s+/g, '_'),
        headers: headers,
        rows: rows
    });
};

window.exportExcelRekapEkskul = function() {
    let ek = window.ambilEkskulAktif();
    let pktKey = window._ekskulPaketRekapAktif;
    if (!ek || !pktKey) return alert('⚠️ Pilih paket ujian ekskul terlebih dahulu.');
    let mapNilai = (ek.rekapNilai && ek.rekapNilai[pktKey]) ? ek.rekapNilai[pktKey] : {};
    let rows = ek.anggota.map(function(ang, idx) {
        let rec = mapNilai[ang.key];
        return [idx + 1, ang.nama, ang.kelas, rec ? (rec.pelanggaran || 0) : '-', (rec && rec.nilaiAkhir !== undefined) ? Number(rec.nilaiAkhir).toFixed(1) : '-'];
    });
    window.bukaPreviewSpreadsheetUniversal({
        title: 'Nilai Ujian Ekskul – ' + ek.nama,
        subtitle: 'Paket: ' + pktKey,
        filenameBase: 'Nilai_Ekskul_' + String(ek.nama || 'Ekskul').replace(/\s+/g, '_') + '_' + String(pktKey).replace(/\s+/g, '_'),
        headers: ['No', 'Nama Anggota', 'Kelas', 'Pelanggaran', 'Nilai Akhir'],
        rows: rows
    });
};