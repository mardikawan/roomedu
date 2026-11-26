/* =========================================================================
   PORTAL DOKUMEN ADMINISTRASI — INFORMASI UMUM, KALDIK VISUAL 12 BULAN,
   PROTA/PROMES AUTO-SYNC RUANG BELAJAR, & LIVE PREVIEW / EXPORT
   ========================================================================= */

(function() {
    const DOC_ADMIN_STORAGE_KEY = 'mahardika_dokumen_admin_umum_v3';

    const NAMA_BULAN_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const DEFAULT_KALDIK_GANJIL = [
        { bulan: 'Juli', bulanIdx: 6, jumlahMinggu: 4, tidakEfektif: 2, ket: 'Libur Semester & MPLS' },
        { bulan: 'Agustus', bulanIdx: 7, jumlahMinggu: 4, tidakEfektif: 0, ket: 'Hari Kemerdekaan RI' },
        { bulan: 'September', bulanIdx: 8, jumlahMinggu: 4, tidakEfektif: 1, ket: 'Asesmen Tengah Semester (STS)' },
        { bulan: 'Oktober', bulanIdx: 9, jumlahMinggu: 5, tidakEfektif: 0, ket: 'Pembelajaran Efektif' },
        { bulan: 'November', bulanIdx: 10, jumlahMinggu: 4, tidakEfektif: 0, ket: 'Pembelajaran Efektif' },
        { bulan: 'Desember', bulanIdx: 11, jumlahMinggu: 4, tidakEfektif: 3, ket: 'SAS, Pengolahan Nilai & Libur Semester' }
    ];

    const DEFAULT_KALDIK_GENAP = [
        { bulan: 'Januari', bulanIdx: 0, jumlahMinggu: 4, tidakEfektif: 0, ket: 'Awal Semester Genap' },
        { bulan: 'Februari', bulanIdx: 1, jumlahMinggu: 4, tidakEfektif: 0, ket: 'Pembelajaran Efektif' },
        { bulan: 'Maret', bulanIdx: 2, jumlahMinggu: 4, tidakEfektif: 2, ket: 'STS & Libur Hari Raya' },
        { bulan: 'April', bulanIdx: 3, jumlahMinggu: 4, tidakEfektif: 1, ket: 'Ujian Sekolah / Libur Nasional' },
        { bulan: 'Mei', bulanIdx: 4, jumlahMinggu: 5, tidakEfektif: 0, ket: 'Pembelajaran Efektif' },
        { bulan: 'Juni', bulanIdx: 5, jumlahMinggu: 4, tidakEfektif: 3, ket: 'SAT, Rapor & Libur Kenaikan Kelas' }
    ];

    window.MA_DEFAULT_RUBRIK_DPL = window.MA_DEFAULT_RUBRIK_DPL || [
        {
            aspek: 'Penalaran Kritis',
            bb: 'Belum mampu mengidentifikasi hubungan sebab-akibat konsep secara tepat dan masih bergantung pada arahan guru.',
            mb: 'Mulai mampu menjelaskan alasan yang relevan dalam memecahkan masalah namun bukti ilmiahnya masih terbatas.',
            bsh: 'Mampu membuktikan penalaran dengan argumen dan data ilmiah yang akurat dalam mengambil simpulan.',
            sb: 'Mampu menganalisis, mengevaluasi secara mendalam berbagai argumen ilmiah, serta merumuskan solusi yang tepat.'
        },
        {
            aspek: 'Kreativitas',
            bb: 'Masih meniru contoh yang diberikan tanpa mencoba memodifikasi gagasan atau rancangan sendiri.',
            mb: 'Mulai menghasilkan gagasan alternatif sederhana berdasarkan identifikasi terhadap situasi masalah.',
            bsh: 'Menghasilkan solusi atau produk karya yang orisinal dengan mengadaptasi berbagai gagasan dan umpan balik.',
            sb: 'Mampu bereksperimen secara kreatif, memodifikasi gagasan secara fleksibel, dan menghasilkan karya inovatif bernilai guna.'
        },
        {
            aspek: 'Kolaborasi',
            bb: 'Masih cenderung bekerja sendiri, pasif dalam diskusi, dan jarang memberikan kontribusi dalam kelompok.',
            mb: 'Mulai terlibat dalam kerja kelompok dan mendengarkan pendapat teman, namun kontribusinya belum konsisten.',
            bsh: 'Bekerja sama secara aktif, menghargai perbedaan pendapat, dan menuntaskan peran kelompok dengan baik.',
            sb: 'Menjadi motor penggerak tim, memfasilitasi pembagian peran secara adil, dan mendorong kelompok mencapai hasil optimal.'
        },
        {
            aspek: 'Komunikasi',
            bb: 'Kesulitan menyampaikan hasil kerja secara lisan maupun tertulis meskipun sudah diberi pancingan.',
            mb: 'Mampu menyampaikan hasil kerja secara sederhana dengan sesekali melihat catatan atau arahan guru.',
            bsh: 'Menyampaikan hasil penyelidikan secara runtut, jelas, dan didukung visualisasi data yang mudah dipahami.',
            sb: 'Mempresentasikan gagasan secara sangat lugas, percaya diri, persuasif, dan mampu menjawab pertanyaan kritis dengan tepat.'
        }
    ];

    window.DOC_ADMIN_DEFAULT = {
        umum: {
            penyusun: 'Mahardika Wiryawan, S.Pd',
            nipPenyusun: '-',
            instansi: 'SMAS Bodhi Dharma Batam',
            jenjang: 'SMA',
            mapel: 'Biologi',
            alamatSekolah: 'Komp. Limindo Trade Centre, Kel. Taman Baloi, Kec. Batam Kota, Kota Batam',
            kota: 'Batam',
            kepalaSekolah: 'Kepala SMAS Bodhi Dharma Batam',
            nipKepsek: '-',
            tahunAjaran: '2026/2027',
            tanggalPengesahan: 'Batam, Juli 2026',
            jumlahMurid: '30 - 36 Orang',
            targetPeserta: 'Murid Reguler',
            menitPerJP: 45,
            jpPerMinggu: { E: 3, F: 5, D: 4 },
            logoSekolah: 'https://lh3.googleusercontent.com/d/1lxMkCHRQ4uDmeuGUZ4kay_PW8GJU28KE',
            cpPerFase: {
                D: 'Pada akhir Fase D, murid mampu menelaah identifikasi makhluk hidup, sistem organisasi kehidupan, interaksi makhluk hidup dengan lingkungannya, pewarisan sifat, dan bioteknologi konvensional.',
                E: 'Pada akhir Fase E, murid memiliki kemampuan menciptakan solusi atas permasalahan berdasarkan isu lokal, nasional, atau global terkait pemahaman keanekaragaman makhluk hidup dan peranannya, virus dan peranannya, inovasi teknologi biologi, komponen ekosistem dan interaksi antar komponen serta perubahan lingkungan.',
                F: 'Pada akhir Fase F, murid memiliki kemampuan mendeskripsikan struktur sel serta bioproses yang terjadi seperti transpor membran dan pembelahan sel; menganalisis keterkaitan struktur organ pada sistem organ dengan fungsinya serta kelainan yang muncul; memahami fungsi enzim dan mengenal proses metabolisme; serta menganalisis pewarisan sifat, pertumbuhan dan perkembangan, evolusi, dan bioteknologi modern.'
            },
            daftarPustakaUmum: 'Kemendikbudristek. (2022). Buku Panduan Guru dan Siswa Biologi SMA/MA. Jakarta: Pusat Perbukuan Kemendikbudristek.\nCampbell, N. A., Urry, L. A., Cain, M. L., Wasserman, S. A., Minorsky, P. V., & Reece, J. B. (2020). Biology (12th ed.). Pearson.'
        },
        kaldik: {
            ganjil: JSON.parse(JSON.stringify(DEFAULT_KALDIK_GANJIL)),
            genap: JSON.parse(JSON.stringify(DEFAULT_KALDIK_GENAP))
        },
        kaldikEvents: [],
        promesMarks: {},
        updatedAt: 0
    };

    window.DOC_ADMIN_STATE = {
        umum: JSON.parse(JSON.stringify(window.DOC_ADMIN_DEFAULT.umum)),
        kaldik: JSON.parse(JSON.stringify(window.DOC_ADMIN_DEFAULT.kaldik)),
        kaldikEvents: [],
        promesMarks: {},
        activeTab: 'umum',
        filterKelas: 'Semua',
        filterSemester: 'I (Ganjil)',
        tampilSubBabProta: true,
        previewDocType: 'modul_ajar',
        selectedBabKey: '',
        mergedPageKeys: [],
        opsiExport: {
            cover: true, identitas: true, identifikasi: true, desain: true,
            pengalaman: true, asesmenRingkas: true, pengesahan: true,
            lampiranAsesmen: true, lampiranKisiKisi: true, lampiranSoal: true,
            lampiranLkpd: true, lampiranRubrik: true, lampiranMateri: true,
            lampiranGlosarium: true, lampiranPustaka: true
        },
        firebaseLoaded: false
    };

    function daEsc(str) {
        return String(str === undefined || str === null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function daSanitasiKey(raw) {
        if (typeof window.ckSanitasiKey === 'function') return window.ckSanitasiKey(raw);
        let s = String(raw || '').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
        while (s.startsWith('_')) s = s.slice(1);
        while (s.endsWith('_')) s = s.slice(0, -1);
        return s || 'bab_materi';
    }

    function daToast(pesan, isErr) {
        if (typeof window.ckToast === 'function') window.ckToast(pesan, isErr);
        else alert(pesan);
    }

    function daPad2(n) {
        return n < 10 ? ('0' + n) : String(n);
    }

    window.daParseTahunAjaran = function(taStr) {
        let m = String(taStr || '').match(/(\d{4})\D+(\d{4})/);
        if (m) return { mulai: parseInt(m[1], 10), akhir: parseInt(m[2], 10) };
        let m1 = String(taStr || '').match(/(\d{4})/);
        let y = m1 ? parseInt(m1[1], 10) : (new Date()).getFullYear();
        return { mulai: y, akhir: y + 1 };
    };

    window.daEkspansiRentangTanggal = function(startStr, endStr) {
        if (!startStr) return [];
        let sParts = String(startStr).split('-').map(Number);
        let eParts = String(endStr || startStr).split('-').map(Number);
        if (sParts.length !== 3 || eParts.length !== 3) return [];
        let cur = new Date(sParts[0], sParts[1] - 1, sParts[2]);
        let end = new Date(eParts[0], eParts[1] - 1, eParts[2]);
        if (isNaN(cur.getTime()) || isNaN(end.getTime())) return [];
        if (end < cur) {
            let tmp = cur; cur = end; end = tmp;
        }
        let hasil = [];
        let guard = 0;
        while (cur <= end && guard < 370) {
            hasil.push(cur.getFullYear() + '-' + daPad2(cur.getMonth() + 1) + '-' + daPad2(cur.getDate()));
            cur.setDate(cur.getDate() + 1);
            guard++;
        }
        return hasil;
    };

    window.daFormatTanggalPendek = function(isoStr) {
        let p = String(isoStr || '').split('-');
        if (p.length !== 3) return isoStr || '-';
        let bln = NAMA_BULAN_ID[parseInt(p[1], 10) - 1] || p[1];
        return parseInt(p[2], 10) + ' ' + bln.substring(0, 3) + ' ' + p[0];
    };

    // =========================================================================
    // 1. STORAGE LOCAL + FIREBASE REST
    // =========================================================================
    window.daMuatLokal = function() {
        try {
            let raw = localStorage.getItem(DOC_ADMIN_STORAGE_KEY) || localStorage.getItem('mahardika_dokumen_admin_umum_v2');
            if (raw) {
                let d = JSON.parse(raw);
                if (d && d.umum) {
                    window.DOC_ADMIN_STATE.umum = Object.assign({}, window.DOC_ADMIN_DEFAULT.umum, d.umum);
                    window.DOC_ADMIN_STATE.umum.cpPerFase = Object.assign({}, window.DOC_ADMIN_DEFAULT.umum.cpPerFase, d.umum.cpPerFase || {});
                    window.DOC_ADMIN_STATE.umum.jpPerMinggu = Object.assign({}, window.DOC_ADMIN_DEFAULT.umum.jpPerMinggu, d.umum.jpPerMinggu || {});
                }
                if (d && d.kaldik) {
                    window.DOC_ADMIN_STATE.kaldik = {
                        ganjil: Array.isArray(d.kaldik.ganjil) ? d.kaldik.ganjil : JSON.parse(JSON.stringify(DEFAULT_KALDIK_GANJIL)),
                        genap: Array.isArray(d.kaldik.genap) ? d.kaldik.genap : JSON.parse(JSON.stringify(DEFAULT_KALDIK_GENAP))
                    };
                }
                if (d && Array.isArray(d.kaldikEvents)) {
                    window.DOC_ADMIN_STATE.kaldikEvents = d.kaldikEvents;
                }
                if (d && d.promesMarks && typeof d.promesMarks === 'object') {
                    window.DOC_ADMIN_STATE.promesMarks = d.promesMarks;
                }
            }
        } catch (e) {}
    };

    window.daSimpanLokal = function() {
        try {
            localStorage.setItem(DOC_ADMIN_STORAGE_KEY, JSON.stringify({
                umum: window.DOC_ADMIN_STATE.umum,
                kaldik: window.DOC_ADMIN_STATE.kaldik,
                kaldikEvents: window.DOC_ADMIN_STATE.kaldikEvents,
                promesMarks: window.DOC_ADMIN_STATE.promesMarks,
                updatedAt: Date.now()
            }));
        } catch (e) {}
    };

    window.daSinkronDariFirebase = function(onDone) {
        let guruAktif = window.guruAktif || sessionStorage.getItem('guruTarget') || 'mahardika';
        if (typeof window.bacaDataRestFirebase !== 'function') {
            window.DOC_ADMIN_STATE.firebaseLoaded = true;
            if (onDone) onDone();
            return;
        }
        window.bacaDataRestFirebase('data_guru/' + guruAktif + '/dokumen_admin_umum', function(d) {
            if (d && typeof d === 'object') {
                if (d.umum) {
                    window.DOC_ADMIN_STATE.umum = Object.assign({}, window.DOC_ADMIN_DEFAULT.umum, d.umum);
                    window.DOC_ADMIN_STATE.umum.cpPerFase = Object.assign({}, window.DOC_ADMIN_DEFAULT.umum.cpPerFase, d.umum.cpPerFase || {});
                    window.DOC_ADMIN_STATE.umum.jpPerMinggu = Object.assign({}, window.DOC_ADMIN_DEFAULT.umum.jpPerMinggu, d.umum.jpPerMinggu || {});
                }
                if (d.kaldik && Array.isArray(d.kaldik.ganjil) && Array.isArray(d.kaldik.genap)) {
                    window.DOC_ADMIN_STATE.kaldik = d.kaldik;
                }
                if (Array.isArray(d.kaldikEvents)) {
                    window.DOC_ADMIN_STATE.kaldikEvents = d.kaldikEvents;
                }
                if (d.promesMarks && typeof d.promesMarks === 'object') {
                    window.DOC_ADMIN_STATE.promesMarks = d.promesMarks;
                }
                window.daSimpanLokal();
            }
            window.DOC_ADMIN_STATE.firebaseLoaded = true;
            if (onDone) onDone();
        }, function() {
            window.DOC_ADMIN_STATE.firebaseLoaded = true;
            if (onDone) onDone();
        }, { ttlMs: 120000 });
    };

    window.daSimpanKeCloud = function(isSilent) {
        window.daSimpanLokal();
        let payload = {
            umum: window.DOC_ADMIN_STATE.umum,
            kaldik: window.DOC_ADMIN_STATE.kaldik,
            kaldikEvents: window.DOC_ADMIN_STATE.kaldikEvents,
            promesMarks: window.DOC_ADMIN_STATE.promesMarks,
            updatedAt: Date.now()
        };
        if (typeof window.kirimNilaiUjianAmanKeDB === 'function') {
            window.kirimNilaiUjianAmanKeDB('dokumen_admin_umum', payload, function() {
                if (!isSilent) daToast('💾 Informasi Umum, Kaldik & Promes tersimpan ke cloud!');
            }, function() {
                if (!isSilent) daToast('💾 Tersimpan di perangkat (cloud offline).');
            });
        } else if (!isSilent) {
            daToast('💾 Data Dokumen Administrasi berhasil disimpan!');
        }
    };

    // =========================================================================
    // 2. SINKRONISASI RENTANG TANGGAL KALDIK <-> PENJADWALAN / KALENDER GURU
    // =========================================================================
    window.daTemukanObjekKalenderGuru = function() {
        let kandidatNama = [
            'kalenderGuruData', 'kalenderEventsData', 'adminKalenderData',
            'guruCalendarEvents', 'calendarEventsData', 'kalenderData', 'calEventsData'
        ];
        for (let i = 0; i < kandidatNama.length; i++) {
            let key = kandidatNama[i];
            if (window[key] && typeof window[key] === 'object') {
                return { key: key, ref: window[key] };
            }
        }
        return null;
    };

    window.daSinkronKaldikKePenjadwalan = function(isToast) {
        let events = window.DOC_ADMIN_STATE.kaldikEvents || [];
        let dateMap = {};
        events.forEach(function(ev) {
            let days = window.daEkspansiRentangTanggal(ev.start, ev.end);
            days.forEach(function(iso) {
                if (!dateMap[iso]) dateMap[iso] = [];
                dateMap[iso].push({
                    id: ev.id,
                    title: ev.title,
                    judul: ev.title,
                    nama: ev.title,
                    text: ev.title,
                    type: ev.type,
                    jenis: ev.type,
                    kategori: ev.type,
                    isLibur: ev.type === 'libur',
                    isAcara: ev.type === 'acara',
                    fromKaldik: true,
                    start: ev.start,
                    end: ev.end
                });
            });
        });

        // 1. Ekspos peta tanggal global agar Rencana Pembelajaran / Kalender mana pun bisa langsung membacanya
        window.kaldikSyncedDateMap = dateMap;
        try {
            localStorage.setItem('mahardika_kaldik_synced_dates', JSON.stringify(dateMap));
        } catch (e) {}

        // 2. Jika Kalender Guru main.js sudah aktif di memori, dorong event Kaldik ke dalamnya (tanpa menimpa catatan manual lain)
        let target = window.daTemukanObjekKalenderGuru();
        let jumlahTersinkron = 0;
        if (target && target.ref && !Array.isArray(target.ref)) {
            // Bersihkan dulu entri lama yang berasal dari Kaldik agar jika dihapus ikut bersih
            Object.keys(target.ref).forEach(function(dtKey) {
                let val = target.ref[dtKey];
                if (Array.isArray(val)) {
                    target.ref[dtKey] = val.filter(function(item) { return !(item && item.fromKaldik); });
                    if (target.ref[dtKey].length === 0) delete target.ref[dtKey];
                }
            });
            // Tambahkan entri terbaru dari Kaldik
            Object.keys(dateMap).forEach(function(iso) {
                if (!Array.isArray(target.ref[iso])) target.ref[iso] = [];
                dateMap[iso].forEach(function(item) {
                    let sudahAda = target.ref[iso].some(function(ex) {
                        return ex && (ex.id === item.id || (ex.title === item.title && ex.type === item.type));
                    });
                    if (!sudahAda) {
                        target.ref[iso].push(item);
                        jumlahTersinkron++;
                    }
                });
            });

            // Panggil fungsi simpan & render Kalender/Rencana Pembelajaran milik main.js jika tersedia
            ['simpanKalenderGuruKeDB', 'simpanKalenderKeDB', 'saveCalendarEventsToDB'].forEach(function(fn) {
                if (typeof window[fn] === 'function') {
                    try { window[fn](); } catch (e) {}
                }
            });
            ['renderKalenderGuru', 'renderCalendarGrid', 'renderKalenderBulanan', 'renderRencanaPembelajaran', 'renderTabRencanaPembelajaran'].forEach(function(fn) {
                if (typeof window[fn] === 'function') {
                    try { window[fn](); } catch (e) {}
                }
            });
        }

        // Kirim juga ke path Firebase kalender_guru agar langsung terbaca saat jadwal dibuka di perangkat lain
        if (typeof window.kirimNilaiUjianAmanKeDB === 'function') {
            window.kirimNilaiUjianAmanKeDB('kaldik_penjadwalan_events', events, function() {}, function() {});
        }

        // Dispatch custom event untuk listener di main.js bila ada
        try {
            window.dispatchEvent(new CustomEvent('kaldikEventsUpdated', { detail: { events: events, dateMap: dateMap } }));
        } catch (e) {}

        if (isToast) {
            let infoExtra = target ? (' (tersambung ke ' + target.key + ')') : ' (tersimpan ke peta sinkron jadwal & cloud)';
            daToast('🔗 ' + events.length + ' rentang tanggal Kaldik disinkronkan ke Penjadwalan' + infoExtra + '!');
        }
    };

    window.daTarikEventDariKalenderGuru = function() {
        let target = window.daTemukanObjekKalenderGuru();
        if (!target || !target.ref) {
            return daToast('ℹ️ Belum ditemukan data kalender aktif di memori. Buka menu Kalender Guru dulu jika ingin menarik datanya.', true);
        }

        // Kelompokkan tanggal berurutan dengan judul & jenis sama menjadi rentang tanggal
        let flatByKey = {};
        Object.keys(target.ref).sort().forEach(function(dtKey) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dtKey)) return;
            let list = Array.isArray(target.ref[dtKey]) ? target.ref[dtKey] : [target.ref[dtKey]];
            list.forEach(function(ev) {
                if (!ev || ev.fromKaldik) return;
                let title = String(ev.title || ev.judul || ev.nama || ev.text || '').trim();
                if (!title) return;
                let tipe = (ev.isLibur || ev.type === 'libur' || ev.jenis === 'libur' || ev.kategori === 'libur') ? 'libur' : 'acara';
                let gKey = tipe + '::' + title.toLowerCase();
                if (!flatByKey[gKey]) flatByKey[gKey] = { title: title, type: tipe, dates: [] };
                if (flatByKey[gKey].dates.indexOf(dtKey) === -1) flatByKey[gKey].dates.push(dtKey);
            });
        });

        let ditambahkan = 0;
        Object.values(flatByKey).forEach(function(grp) {
            grp.dates.sort();
            let rangeStart = grp.dates[0];
            let prev = grp.dates[0];

            function pushRange(s, e) {
                let dup = window.DOC_ADMIN_STATE.kaldikEvents.some(function(ex) {
                    return ex.start === s && ex.end === e && ex.title.toLowerCase() === grp.title.toLowerCase();
                });
                if (!dup) {
                    window.DOC_ADMIN_STATE.kaldikEvents.push({
                        id: 'ke_' + Date.now() + '_' + Math.floor(Math.random() * 9999),
                        start: s,
                        end: e,
                        type: grp.type,
                        title: grp.title,
                        tidakEfektif: grp.type === 'libur'
                    });
                    ditambahkan++;
                }
            }

            for (let i = 1; i < grp.dates.length; i++) {
                let dPrev = new Date(prev + 'T00:00:00');
                let dCur = new Date(grp.dates[i] + 'T00:00:00');
                let diffDays = Math.round((dCur - dPrev) / 86400000);
                if (diffDays > 1) {
                    pushRange(rangeStart, prev);
                    rangeStart = grp.dates[i];
                }
                prev = grp.dates[i];
            }
            pushRange(rangeStart, prev);
        });

        window.daSimpanKeCloud(true);
        window.daRenderTab();
        daToast(ditambahkan > 0 ? ('✅ ' + ditambahkan + ' jadwal berhasil ditarik dari Kalender Guru!') : 'ℹ️ Semua jadwal dari Kalender Guru sudah tersinkron.');
    };

    window.daTambahEventKaldik = function() {
        let inpStart = document.getElementById('da-ke-start');
        let inpEnd = document.getElementById('da-ke-end');
        let selType = document.getElementById('da-ke-type');
        let inpTitle = document.getElementById('da-ke-title');
        let chkTE = document.getElementById('da-ke-te');

        let start = inpStart ? inpStart.value : '';
        let end = (inpEnd && inpEnd.value) ? inpEnd.value : start;
        let type = selType ? selType.value : 'libur';
        let title = inpTitle ? inpTitle.value.trim() : '';
        let isTE = chkTE ? Boolean(chkTE.checked) : (type === 'libur');

        if (!start) return daToast('⚠️ Pilih Tanggal Mulai terlebih dahulu!', true);
        if (!title) return daToast('⚠️ Isi penjelasan acara atau hari liburnya!', true);
        if (end < start) {
            let tmp = start; start = end; end = tmp;
        }

        window.DOC_ADMIN_STATE.kaldikEvents.push({
            id: 'ke_' + Date.now() + '_' + Math.floor(Math.random() * 999),
            start: start,
            end: end,
            type: type,
            title: title,
            tidakEfektif: isTE
        });
        window.DOC_ADMIN_STATE.kaldikEvents.sort(function(a, b) {
            return String(a.start || '').localeCompare(String(b.start || ''));
        });

        window.daSinkronKaldikKePenjadwalan(false);
        window.daHitungRmeDariEventKaldik(true);
        window.daSimpanKeCloud(true);
        window.daRenderTab();
        daToast('✅ Rentang tanggal ditambahkan & disinkronkan ke Penjadwalan!');
    };

    window.daHapusEventKaldik = function(id) {
        window.DOC_ADMIN_STATE.kaldikEvents = (window.DOC_ADMIN_STATE.kaldikEvents || []).filter(function(ev) {
            return ev.id !== id;
        });
        window.daSinkronKaldikKePenjadwalan(false);
        window.daHitungRmeDariEventKaldik(true);
        window.daSimpanKeCloud(true);
        window.daRenderTab();
        daToast('🗑️ Agenda Kaldik dihapus & penjadwalan diperbarui.');
    };

    window.daHitungRmeDariEventKaldik = function(isSilent) {
        let ta = window.daParseTahunAjaran(window.DOC_ADMIN_STATE.umum.tahunAjaran);
        let events = window.DOC_ADMIN_STATE.kaldikEvents || [];
        let perBulan = {};

        events.forEach(function(ev) {
            let days = window.daEkspansiRentangTanggal(ev.start, ev.end);
            days.forEach(function(iso) {
                let parts = iso.split('-').map(Number);
                let dt = new Date(parts[0], parts[1] - 1, parts[2]);
                let y = parts[0], mIdx = parts[1] - 1;
                let keyYM = y + '-' + mIdx;
                if (!perBulan[keyYM]) perBulan[keyYM] = { ketList: [], weekOffDays: {} };
                if (perBulan[keyYM].ketList.indexOf(ev.title) === -1) {
                    perBulan[keyYM].ketList.push(ev.title);
                }
                // Hanya hitung hari kerja Senin-Jumat untuk status minggu tidak efektif
                let dow = dt.getDay();
                if ((ev.tidakEfektif || ev.type === 'libur') && dow >= 1 && dow <= 5) {
                    let weekNo = Math.floor((parts[2] + (new Date(y, mIdx, 1)).getDay() - 1) / 7);
                    perBulan[keyYM].weekOffDays[weekNo] = (perBulan[keyYM].weekOffDays[weekNo] || 0) + 1;
                }
            });
        });

        function updateSemRows(rows, tahunTarget) {
            (rows || []).forEach(function(r) {
                let mIdx = (typeof r.bulanIdx === 'number') ? r.bulanIdx : NAMA_BULAN_ID.indexOf(r.bulan);
                if (mIdx < 0) return;
                // Hitung jumlah minggu riil (Senin-Sabtu) pada bulan tersebut
                let daysInMonth = (new Date(tahunTarget, mIdx + 1, 0)).getDate();
                let firstDow = (new Date(tahunTarget, mIdx, 1)).getDay();
                let totalWeekRows = Math.ceil((firstDow + daysInMonth) / 7);
                r.jumlahMinggu = Math.min(5, Math.max(4, totalWeekRows >= 5 && daysInMonth >= 30 ? 5 : 4));

                let infoBln = perBulan[tahunTarget + '-' + mIdx];
                if (infoBln) {
                    let mggTE = 0;
                    Object.keys(infoBln.weekOffDays).forEach(function(wk) {
                        if (infoBln.weekOffDays[wk] >= 3) mggTE++;
                    });
                    r.tidakEfektif = Math.min(r.jumlahMinggu, mggTE);
                    if (infoBln.ketList.length > 0) r.ket = infoBln.ketList.join('; ');
                }
            });
        }

        updateSemRows(window.DOC_ADMIN_STATE.kaldik.ganjil, ta.mulai);
        updateSemRows(window.DOC_ADMIN_STATE.kaldik.genap, ta.akhir);
        window.daSimpanLokal();

        if (!isSilent) {
            window.daRenderTab();
            daToast('🔄 Tabel Minggu Efektif diperbarui otomatis dari rentang tanggal kalender!');
        }
    };

    window.daBangunPetaTanggalEvent = function() {
        let map = {};
        (window.DOC_ADMIN_STATE.kaldikEvents || []).forEach(function(ev) {
            window.daEkspansiRentangTanggal(ev.start, ev.end).forEach(function(iso) {
                if (!map[iso]) map[iso] = [];
                map[iso].push(ev);
            });
        });
        return map;
    };

    window.daRenderGridKalender12BulanHTML = function(taStr, isUntukCetak) {
        let ta = window.daParseTahunAjaran(taStr);
        let evMap = window.daBangunPetaTanggalEvent();
        let urutanBulan = [
            { m: 6, y: ta.mulai }, { m: 7, y: ta.mulai }, { m: 8, y: ta.mulai },
            { m: 9, y: ta.mulai }, { m: 10, y: ta.mulai }, { m: 11, y: ta.mulai },
            { m: 0, y: ta.akhir }, { m: 1, y: ta.akhir }, { m: 2, y: ta.akhir },
            { m: 3, y: ta.akhir }, { m: 4, y: ta.akhir }, { m: 5, y: ta.akhir }
        ];

        let cards = urutanBulan.map(function(item) {
            let y = item.y, m = item.m;
            let firstDow = (new Date(y, m, 1)).getDay(); // 0 = Min
            let totalDays = (new Date(y, m + 1, 0)).getDate();
            let cells = '';
            for (let i = 0; i < firstDow; i++) cells += '<td class="kc-empty"></td>';

            let col = firstDow;
            let rowsHtml = '<tr>';
            for (let d = 1; d <= totalDays; d++) {
                let iso = y + '-' + daPad2(m + 1) + '-' + daPad2(d);
                let evs = evMap[iso] || [];
                let isSun = (col === 0);
                let hasLibur = evs.some(function(e) { return e.type === 'libur'; });
                let hasAcara = evs.some(function(e) { return e.type === 'acara'; });
                let cls = 'kc-day';
                if (hasLibur) cls += ' is-libur';
                else if (hasAcara) cls += ' is-acara';
                else if (isSun) cls += ' is-sun';

                let tooltip = evs.map(function(e) { return (e.type === 'libur' ? '[Libur] ' : '[Kegiatan] ') + e.title; }).join(' • ');
                let clickAttr = isUntukCetak ? '' : (' onclick="window.daPilihTanggalDariKalender(\'' + iso + '\')"');
                rowsHtml += '<td class="' + cls + '" title="' + daEsc(tooltip || iso) + '"' + clickAttr + '>' + d + '</td>';
                col++;
                if (col === 7 && d < totalDays) {
                    rowsHtml += '</tr><tr>';
                    col = 0;
                }
            }
            while (col > 0 && col < 7) {
                rowsHtml += '<td class="kc-empty"></td>';
                col++;
            }
            rowsHtml += '</tr>';

            return '<div class="kc-month-card">' +
                '<div class="kc-month-head">' + NAMA_BULAN_ID[m] + ' ' + y + '</div>' +
                '<table class="kc-tbl">' +
                    '<thead><tr><th class="is-sun">M</th><th>S</th><th>S</th><th>R</th><th>K</th><th>J</th><th>S</th></tr></thead>' +
                    '<tbody>' + rowsHtml + '</tbody>' +
                '</table>' +
            '</div>';
        }).join('');

        return '<div class="kc-12-grid">' + cards + '</div>';
    };

    window.daPilihTanggalDariKalender = function(iso) {
        let inpS = document.getElementById('da-ke-start');
        let inpE = document.getElementById('da-ke-end');
        if (!inpS || !inpE) return;
        if (!inpS.value || (inpS.value && inpE.value && inpE.value !== inpS.value)) {
            inpS.value = iso;
            inpE.value = iso;
        } else {
            inpE.value = iso;
        }
        let inpT = document.getElementById('da-ke-title');
        if (inpT) inpT.focus();
    };

    // =========================================================================
    // 3. AUTO-SCAN BAB KHUSUS ISI KELAS X, XI, XII & HIERARKI SUB-BAB
    // =========================================================================
    const DA_URUTAN_KELAS = ['X (Sepuluh)', 'XI (Sebelas)', 'XII (Dua Belas)'];

    function daBersihkanLabelMenu(teks) {
        return String(teks || '')
            .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
            .replace(/[▸▾▼▶◀◄►⌄⌃❯›»→➔➜•·|]/g, ' ')
            .replace(/\u00A0|\u200B|\uFEFF/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function daDeteksiFolderKelas(teks, sedangDiDalamKelas) {
        let clean = daBersihkanLabelMenu(teks);
        let up = clean.toUpperCase();
        if (!up || /^BAB\b/.test(up) || /^SUB\b/.test(up) || /^TOPIK\b/.test(up) || /^PERTEMUAN\b/.test(up)) return null;

        if (sedangDiDalamKelas) {
            if (/^(?:(?:BIOLOGI|MATERI)\s+)?KELAS\s+(?:XII|12)\b/.test(up)) return { kelas: 'XII (Dua Belas)', fase: 'F', order: 3 };
            if (/^(?:(?:BIOLOGI|MATERI)\s+)?KELAS\s+(?:XI|11)\b/.test(up)) return { kelas: 'XI (Sebelas)', fase: 'F', order: 2 };
            if (/^(?:(?:BIOLOGI|MATERI)\s+)?KELAS\s+(?:X|10)\b/.test(up)) return { kelas: 'X (Sepuluh)', fase: 'E', order: 1 };
            return null;
        }
        if (/^(?:(?:BIOLOGI|MATERI|RUANG\s+BELAJAR)\s+)?(?:KELAS\s+)?(?:XII|12)\b/.test(up)) return { kelas: 'XII (Dua Belas)', fase: 'F', order: 3 };
        if (/^(?:(?:BIOLOGI|MATERI|RUANG\s+BELAJAR)\s+)?(?:KELAS\s+)?(?:XI|11)\b/.test(up)) return { kelas: 'XI (Sebelas)', fase: 'F', order: 2 };
        if (/^(?:(?:BIOLOGI|MATERI|RUANG\s+BELAJAR)\s+)?(?:KELAS\s+)?(?:X|10)\b/.test(up)) return { kelas: 'X (Sepuluh)', fase: 'E', order: 1 };
        return null;
    }

    function daApakahMenuNonMateri(label, pageId) {
        let l = daBersihkanLabelMenu(label).toLowerCase();
        let p = String(pageId || '').trim().toLowerCase();
        if (!l || l === 'home' || p === 'home' || l === 'beranda') return true;
        let blokirPersis = ['latihan', 'ruang latihan', 'ujian', 'ruang ujian', 'nilai saya', 'hidden', 'catatan guru', 'profil', 'login', 'logout', 'administrasi', 'my world', 'my pet', 'pages', 'popup', 'jadwal pelajaran', 'daftar ruang belajar'];
        return blokirPersis.some(function(b) { return l === b || p === b; });
    }

    function daEkstrakPageIdDariLink(el) {
        if (!el) return '';
        let attrId = el.getAttribute('data-page-id') || el.getAttribute('data-bab') || el.getAttribute('data-id') || el.getAttribute('data-slug') || '';
        if (attrId) return attrId.trim();
        let onclk = el.getAttribute('onclick') || '';
        let m1 = onclk.match(/(?:navigasiHalaman|bukaHalaman|openPage|pilihHalaman|loadPage)\s*\([^'"]*['"]([^'"]+)['"]/);
        if (m1 && m1[1]) return m1[1].trim();
        let href = el.getAttribute('href') || '';
        let m2 = href.match(/bab=([^&]+)/);
        if (m2 && m2[1]) return decodeURIComponent(m2[1]).trim();
        return '';
    }

    function daCariLcaElemen(elList) {
        if (!elList || elList.length === 0) return null;
        if (elList.length === 1) return elList[0].parentElement;
        let rantaiPertama = [];
        let cur = elList[0];
        while (cur) {
            rantaiPertama.push(cur);
            cur = cur.parentElement;
        }
        for (let i = 0; i < rantaiPertama.length; i++) {
            let cand = rantaiPertama[i];
            if (cand === document.body || cand === document.documentElement) break;
            let semuaMasuk = elList.every(function(el) { return cand.contains(el); });
            if (semuaMasuk) return cand;
        }
        return null;
    }

    function daHitungDomDepth(el, rootEl) {
        let d = 0;
        let cur = el;
        while (cur && cur !== rootEl && cur !== document.body) {
            d++;
            cur = cur.parentElement;
        }
        return d;
    }

    function daBuatKolektorBab() {
        let hasil = [];
        let seen = {};
        let counterPerParent = {};
        let folderKelasKeys = {};

        function buatNomor(kelas, parentCode) {
            let bucket = kelas + '::' + (parentCode || 'ROOT');
            counterPerParent[bucket] = (counterPerParent[bucket] || 0) + 1;
            return parentCode ? (parentCode + '.' + counterPerParent[bucket]) : String(counterPerParent[bucket]);
        }

        return {
            hasil: hasil,
            folderKelasKeys: folderKelasKeys,
            catatFolderKelas: function(pageId, judul, infoKls) {
                let k = daSanitasiKey(pageId || judul);
                if (k) folderKelasKeys[k] = { pageKey: k, judulHalaman: judul, kelas: infoKls.kelas, fase: infoKls.fase, tipeNode: 'kelas' };
            },
            tambah: function(raw) {
                if (!raw.kelas || DA_URUTAN_KELAS.indexOf(raw.kelas) === -1) return null;
                let key = daSanitasiKey(raw.pageKey || (raw.kelas + '_' + raw.judulHalaman));
                if (!key || key === 'home' || seen[key]) return null;
                seen[key] = true;
                let kode = buatNomor(raw.kelas, raw.parentCode);
                let lvl = Number(raw.level) || 0;
                let item = {
                    pageKey: key,
                    judulHalaman: raw.judulHalaman,
                    kelas: raw.kelas,
                    fase: raw.fase || (raw.kelas.indexOf('X (') === 0 ? 'E' : 'F'),
                    kelasOrder: DA_URUTAN_KELAS.indexOf(raw.kelas) + 1,
                    level: lvl,
                    tipeNode: lvl === 0 ? 'bab' : 'subbab',
                    kodeHierarki: kode,
                    isSubHalaman: lvl > 0,
                    indukBab: raw.indukBab || '',
                    indukKey: raw.indukKey || '',
                    parentKey: raw.parentKey || '',
                    urutanNav: hasil.length
                };
                hasil.push(item);
                return item;
            }
        };
    }

    function daEkstrakDariMenuRootDOM(menuRoot) {
        if (!menuRoot) return { hasil: [], folderKelasKeys: {} };
        let col = daBuatKolektorBab();

        // Kumpulkan semua link halaman (?bab= / navigasiHalaman) dan header Kelas X/XI/XII dalam urutan DOM
        let links = Array.from(menuRoot.querySelectorAll('a[href*="bab="], a[onclick*="navigasiHalaman"], a[onclick*="bukaHalaman"], [data-page-id], [data-bab]'))
            .filter(function(el) {
                return !el.closest('.locked-hidden-nav-item, #modal-dokumen-admin, #page-cakupan-panel-wrap, #main-editor-wrapper');
            });

        let elemenTerpilih = [];
        let elSet = new Set();

        links.forEach(function(a) {
            if (!elSet.has(a)) {
                elSet.add(a);
                elemenTerpilih.push(a);
            }
        });

        // Sertakan label folder Kelas X / XI / XII non-<a> (misalnya div/span/button)
        menuRoot.querySelectorAll('a, div, span, p, button, h3, h4').forEach(function(el) {
            if (elSet.has(el)) return;
            if (el.closest('.locked-hidden-nav-item, #modal-dokumen-admin, #page-cakupan-panel-wrap, #main-editor-wrapper')) return;
            if (el.querySelector('a, ul, ol')) return;
            let txt = daBersihkanLabelMenu(el.textContent || '');
            if (txt.length > 0 && txt.length <= 28 && daDeteksiFolderKelas(txt, false)) {
                let adaAnakSama = Array.from(el.children || []).some(function(ch) {
                    return daBersihkanLabelMenu(ch.textContent || '') === txt;
                });
                if (!adaAnakSama) {
                    elSet.add(el);
                    elemenTerpilih.push(el);
                }
            }
        });

        // Urutkan persis sesuai posisi DOM (atas ke bawah)
        elemenTerpilih.sort(function(a, b) {
            if (a === b) return 0;
            let pos = a.compareDocumentPosition(b);
            if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
            if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
            return 0;
        });

        // Buang elemen yang berada di dalam elemen terpilih lain
        elemenTerpilih = elemenTerpilih.filter(function(el) {
            let p = el.parentElement;
            while (p && p !== menuRoot) {
                if (elSet.has(p)) return false;
                p = p.parentElement;
            }
            return true;
        });

        function hitungKedalamanNesting(el) {
            let ulCount = 0;
            let divDepth = 0;
            let cur = el.parentElement;
            while (cur && cur !== menuRoot && cur !== document.body) {
                if (cur.tagName === 'UL' || cur.tagName === 'OL') ulCount++;
                divDepth++;
                cur = cur.parentElement;
            }
            return ulCount > 0 ? ulCount : divDepth;
        }

        // Tahap 1: Kelompokkan elemen ke masing-masing Kelas X, XI, XII tanpa terputus oleh depth header kelas
        let kelompokPerKelas = [];
        let grupAktif = null;

        elemenTerpilih.forEach(function(el) {
            let teks = daBersihkanLabelMenu(el.textContent || el.innerText || '');
            if (!teks || teks.length > 150) return;
            let pageId = daEkstrakPageIdDariLink(el);
            let folderKls = daDeteksiFolderKelas(teks, Boolean(grupAktif));

            if (folderKls) {
                col.catatFolderKelas(pageId, teks, folderKls);
                let liWrap = el.closest('li');
                let containerScope = null;
                if (liWrap && menuRoot.contains(liWrap)) {
                    let linkDiDalam = liWrap.querySelectorAll('a[href*="bab="], a[onclick*="navigasiHalaman"], a[onclick*="bukaHalaman"]');
                    if (linkDiDalam.length > 1 || (linkDiDalam.length === 1 && linkDiDalam[0] !== el)) {
                        containerScope = liWrap;
                    }
                }
                grupAktif = {
                    kelas: folderKls.kelas,
                    fase: folderKls.fase,
                    scopeEl: containerScope,
                    entries: []
                };
                kelompokPerKelas.push(grupAktif);
                return;
            }

            if (!grupAktif) return;
            if (grupAktif.scopeEl && !grupAktif.scopeEl.contains(el)) {
                grupAktif = null;
                return;
            }
            if (daApakahMenuNonMateri(teks, pageId)) return;

            grupAktif.entries.push({
                el: el,
                teks: teks,
                pageId: pageId,
                nestDepth: hitungKedalamanNesting(el)
            });
        });

        // Tahap 2: Di dalam tiap Kelas, kedalaman terkecil = Bab Utama (level 0), lebih dalam = Sub-Bab (level 1+)
        kelompokPerKelas.forEach(function(grp) {
            if (!grp.entries.length) return;
            let minDepth = grp.entries.reduce(function(mn, it) {
                return Math.min(mn, it.nestDepth);
            }, grp.entries[0].nestDepth);

            let depthStack = [];
            grp.entries.forEach(function(it) {
                let d = it.nestDepth;
                if (d <= minDepth) {
                    depthStack = [];
                } else {
                    while (depthStack.length > 0 && depthStack[depthStack.length - 1].depth >= d) {
                        depthStack.pop();
                    }
                }

                let level = depthStack.length;
                let parentNode = level > 0 ? depthStack[level - 1].item : null;

                let added = col.tambah({
                    pageKey: it.pageId || (grp.kelas + '_' + it.teks),
                    judulHalaman: it.teks,
                    kelas: grp.kelas,
                    fase: grp.fase,
                    level: level,
                    indukBab: level > 0 ? depthStack[0].item.judulHalaman : '',
                    indukKey: level > 0 ? depthStack[0].item.pageKey : '',
                    parentKey: parentNode ? parentNode.pageKey : '',
                    parentCode: parentNode ? parentNode.kodeHierarki : ''
                });

                if (added) depthStack.push({ depth: d, item: added });
            });
        });

        return { hasil: col.hasil, folderKelasKeys: col.folderKelasKeys };
    }

    function daSkorHasilScan(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return 0;
        let klsSet = {};
        let subCount = 0;
        arr.forEach(function(it) {
            if (it && it.kelas) klsSet[it.kelas] = true;
            if (it && it.tipeNode === 'subbab') subCount++;
        });
        return (Object.keys(klsSet).length * 1000) + (subCount * 10) + arr.length;
    }

    function daEkstrakDariPagesData() {
        if (!Array.isArray(window.pagesData) || window.pagesData.length === 0) {
            return { hasil: [], folderKelasKeys: {} };
        }
        let col = daBuatKolektorBab();
        let ctxKelas = '';
        let ctxFase = '';
        let hiddenCutoff = null;
        let stack = [];

        window.pagesData.forEach(function(p) {
            if (!p) return;
            let lvlRaw = Number(p.level) || 0;

            if (hiddenCutoff !== null) {
                if (lvlRaw > hiddenCutoff) return;
                hiddenCutoff = null;
            }
            if (p.hidden === true || p.isLockedHidden === true) {
                hiddenCutoff = lvlRaw;
                if (lvlRaw === 0) {
                    ctxKelas = '';
                    ctxFase = '';
                    stack = [];
                }
                return;
            }

            let title = daBersihkanLabelMenu(p.title || '');
            let slug = String(p.slug || '').trim();
            if (!title) return;

            // Level 0 = Folder utama (Kelas X / XI / XII atau menu non-kelas seperti HOME, Olimpiade, TKA)
            if (lvlRaw === 0) {
                let fKls = daDeteksiFolderKelas(title, false);
                if (fKls) {
                    ctxKelas = fKls.kelas;
                    ctxFase = fKls.fase;
                    stack = [];
                    col.catatFolderKelas(slug || title, title, fKls);
                } else {
                    ctxKelas = '';
                    ctxFase = '';
                    stack = [];
                }
                return;
            }

            if (!ctxKelas) return;
            if (daApakahMenuNonMateri(title, slug)) return;

            while (stack.length > 0 && stack[stack.length - 1].lvlRaw >= lvlRaw) {
                stack.pop();
            }

            // level 1 di pagesData = Bab Utama (level 0 pada pohon modul); level 2+ = Sub-Bab (Pertemuan)
            let treeLevel = stack.length;
            let parentItem = treeLevel > 0 ? stack[treeLevel - 1].item : null;
            let rootBabItem = treeLevel > 0 ? stack[0].item : null;

            let added = col.tambah({
                pageKey: slug || (ctxKelas + '_' + title),
                judulHalaman: title,
                kelas: ctxKelas,
                fase: ctxFase,
                level: treeLevel,
                indukBab: rootBabItem ? rootBabItem.judulHalaman : '',
                indukKey: rootBabItem ? rootBabItem.pageKey : '',
                parentKey: parentItem ? parentItem.pageKey : '',
                parentCode: parentItem ? parentItem.kodeHierarki : ''
            });

            if (added) stack.push({ lvlRaw: lvlRaw, item: added });
        });

        return { hasil: col.hasil, folderKelasKeys: col.folderKelasKeys };
    }

    window.daScanStrukturBabRuangBelajar = function() {
        let terbaik = [];
        let folderKelasTerbaik = {};
        let skorTerbaik = 0;

        function pertimbangkan(res, sumberLabel) {
            let arr = res && res.hasil ? res.hasil : [];
            let skor = daSkorHasilScan(arr);
            if (skor > skorTerbaik) {
                skorTerbaik = skor;
                terbaik = arr;
                folderKelasTerbaik = res.folderKelasKeys || {};
                window._daLastScanSource = sumberLabel || '';
            }
        }

        // JALUR 0 (UTAMA — 100% AKURAT): Baca langsung struktur resmi window.pagesData dari main.js
        let dariPagesData = daEkstrakDariPagesData();
        if (dariPagesData.hasil.length > 0) {
            terbaik = dariPagesData.hasil;
            folderKelasTerbaik = dariPagesData.folderKelasKeys;
            skorTerbaik = daSkorHasilScan(terbaik) + 50000;
            window._daLastScanSource = 'window.pagesData (' + window.pagesData.length + ' node)';
        } else {
            // CADANGAN: Pindai DOM bila window.pagesData belum selesai dimuat
            let semuaLinkMenu = Array.from(document.querySelectorAll('a[href*="bab="], a[onclick*="navigasiHalaman"], a[onclick*="bukaHalaman"]'))
                .filter(function(a) {
                    return !a.closest('#main-editor-wrapper, #modal-dokumen-admin, #admin-menu-bar, #page-cakupan-panel-wrap');
                });
            if (semuaLinkMenu.length > 0) {
                let lca = daCariLcaElemen(semuaLinkMenu);
                if (lca) {
                    pertimbangkan(daEkstrakDariMenuRootDOM(lca), 'DOM:LCA');
                    if (lca.parentElement && lca.parentElement !== document.body) {
                        pertimbangkan(daEkstrakDariMenuRootDOM(lca.parentElement), 'DOM:LCA_Parent');
                    }
                }
            }
            ['#dynamic-navbar', 'aside', 'nav'].forEach(function(sel) {
                document.querySelectorAll(sel).forEach(function(el) {
                    if (!el.closest('#modal-dokumen-admin, #main-editor-wrapper')) {
                        pertimbangkan(daEkstrakDariMenuRootDOM(el), 'DOM:' + sel);
                    }
                });
            });
        }

        window._daFolderKelasKeys = folderKelasTerbaik;

        let grouped = [];
        let hitSubPerBab = {};
        DA_URUTAN_KELAS.forEach(function(klsName) {
            terbaik.forEach(function(item) {
                if (item.kelas === klsName) {
                    if (item.tipeNode === 'subbab' && item.indukKey) {
                        hitSubPerBab[item.indukKey] = (hitSubPerBab[item.indukKey] || 0) + 1;
                        item.urutanPertemuan = hitSubPerBab[item.indukKey];
                    } else {
                        item.urutanPertemuan = 0;
                    }
                    grouped.push(item);
                }
            });
        });

        grouped.forEach(function(item) {
            if (item.tipeNode === 'bab') {
                item.jumlahSubBab = hitSubPerBab[item.pageKey] || 0;
            } else if (item.indukKey) {
                item.totalSubBabInduk = hitSubPerBab[item.indukKey] || 1;
            }
        });

        return grouped;
    };

    window.daCekDiagnosaStrukturMenu = function() {
        let hasil = window.daScanStrukturBabRuangBelajar();
        let semuaLinkMenu = Array.from(document.querySelectorAll('a[href*="bab="], a[onclick*="navigasiHalaman"]'))
            .filter(function(a) { return !a.closest('#main-editor-wrapper, #modal-dokumen-admin'); });
        let sample = semuaLinkMenu.slice(0, 20).map(function(a) {
            return daBersihkanLabelMenu(a.textContent || '') + ' [' + daEkstrakPageIdDariLink(a) + ']';
        });

        let info = [
            'Sumber Terdeteksi: ' + (window._daLastScanSource || 'Belum ditemukan'),
            'Total Bab Utama: ' + hasil.filter(function(x) { return x.tipeNode === 'bab'; }).length +
            ' | Total Sub-Bab (Pertemuan): ' + hasil.filter(function(x) { return x.tipeNode === 'subbab'; }).length,
            'Kelas X: ' + hasil.filter(function(x) { return x.kelas === 'X (Sepuluh)'; }).length +
            ' | Kelas XI: ' + hasil.filter(function(x) { return x.kelas === 'XI (Sebelas)'; }).length +
            ' | Kelas XII: ' + hasil.filter(function(x) { return x.kelas === 'XII (Dua Belas)'; }).length,
            'Total link ?bab= di luar editor: ' + semuaLinkMenu.length,
            'Contoh link: ' + sample.join(' | ')
        ].join('\n');

        console.log('=== DIAGNOSA STRUKTUR MENU ===\n' + info);
        alert(info);
    };

    window.daCariNodeMenuByKey = function(pageKey, judulOpsional) {
        let daftar = window.daScanStrukturBabRuangBelajar();
        let folderKls = window._daFolderKelasKeys || {};
        let targetKey = daSanitasiKey(pageKey || '');
        let targetCompact = targetKey.replace(/[^a-z0-9]/g, '');

        // 1. Cek apakah ini halaman Folder Kelas (Kelas X / XI / XII)
        if (targetKey && folderKls[targetKey]) return folderKls[targetKey];
        let klsMatch = Object.values(folderKls).find(function(fk) {
            return fk && fk.pageKey.replace(/[^a-z0-9]/g, '') === targetCompact;
        });
        if (klsMatch) return klsMatch;

        // 2. Cek exact key di daftar Bab & Sub-Bab
        let found = daftar.find(function(it) { return it.pageKey === targetKey; });
        if (found) return found;

        // 3. Cek key tanpa beda tanda strip/underscore
        if (targetCompact) {
            found = daftar.find(function(it) {
                return it.pageKey.replace(/[^a-z0-9]/g, '') === targetCompact;
            });
            if (found) return found;
        }

        // 4. Cek berdasarkan judul bersih
        let targetJudul = daBersihkanLabelMenu(judulOpsional || '').toLowerCase();
        if (targetJudul) {
            found = daftar.find(function(it) {
                return daBersihkanLabelMenu(it.judulHalaman).toLowerCase() === targetJudul;
            });
            if (found) return found;
        }
        return null;
    };

    window.daCariInfoBabByKey = window.daCariNodeMenuByKey;

    window.daAmbilSemuaBabRuangMateri = function(ikutkanSubBab) {
        if (typeof window.ckMuatLokal === 'function') window.ckMuatLokal();
        let savedMap = window.CAKUPAN_HALAMAN_DATA || {};
        let navList = window.daScanStrukturBabRuangBelajar();
        let merged = [];
        let semIndukMap = {};

        // Hitung total JP, jumlah pertemuan, & daftar IKTP Sub-Bab penyusun TP untuk setiap Bab Utama
        let sumJpPerBab = {};
        let countSubPerBab = {};
        let iktpListPerBab = {};
        navList.forEach(function(nv) {
            if (nv.tipeNode === 'subbab' && nv.indukKey) {
                let recSub = savedMap[nv.pageKey];
                let jpSub = recSub ? (Number(recSub.totalJP) || Number(recSub.jpPertemuan) || 2) : 2;
                sumJpPerBab[nv.indukKey] = (sumJpPerBab[nv.indukKey] || 0) + jpSub;
                countSubPerBab[nv.indukKey] = (countSubPerBab[nv.indukKey] || 0) + 1;

                if (!iktpListPerBab[nv.indukKey]) iktpListPerBab[nv.indukKey] = [];
                let iktpTeks = recSub
                    ? String((recSub.iktp !== undefined && recSub.iktp !== null) ? recSub.iktp : (recSub.tp || '')).trim()
                    : '';
                iktpListPerBab[nv.indukKey].push({
                    urutan: countSubPerBab[nv.indukKey],
                    pageKey: nv.pageKey,
                    judul: nv.judulHalaman,
                    iktp: iktpTeks
                });
            }
        });

        navList.forEach(function(nv) {
            let rec = savedMap[nv.pageKey];
            let semDefault = (nv.isSubHalaman && nv.indukKey && semIndukMap[nv.indukKey])
                ? semIndukMap[nv.indukKey]
                : 'I (Ganjil)';

            let defaultJP = nv.isSubHalaman
                ? 2
                : (countSubPerBab[nv.pageKey] ? sumJpPerBab[nv.pageKey] : 4);

            let obj = rec ? Object.assign({}, rec) : {
                pageKey: nv.pageKey,
                judulHalaman: nv.judulHalaman,
                kelas: nv.kelas,
                fase: nv.fase,
                semester: semDefault,
                materiPokok: '',
                jumlahPertemuan: nv.isSubHalaman ? 1 : (countSubPerBab[nv.pageKey] || 2),
                totalJP: defaultJP,
                alokasiWaktu: nv.isSubHalaman ? '1 Pertemuan (2 JP)' : ((countSubPerBab[nv.pageKey] || 2) + ' Pertemuan (' + defaultJP + ' JP)'),
                tp: '',
                atp: '',
                dpl: {},
                pertemuan: [],
                asesmen: {},
                lkpd: {},
                rubrik: {},
                glosarium: [],
                jumlahLembarSnapshot: 0,
                belumDisimpanDiHalaman: true
            };

            obj.pageKey = nv.pageKey;
            obj.judulHalaman = nv.judulHalaman;
            obj.kelas = nv.kelas;
            obj.fase = nv.fase;
            obj.level = nv.level;
            obj.tipeNode = nv.tipeNode;
            obj.kodeHierarki = nv.kodeHierarki;
            obj.isSubHalaman = nv.isSubHalaman;
            obj.indukBab = nv.indukBab;
            obj.indukKey = nv.indukKey;
            obj.parentKey = nv.parentKey;
            obj.urutanPertemuan = nv.urutanPertemuan || 0;
            obj.jumlahSubBab = countSubPerBab[nv.pageKey] || 0;

            let angkaKls = nv.kelas.indexOf('XII') !== -1 ? '12' : (nv.kelas.indexOf('XI') !== -1 ? '11' : '10');
            obj.kodeAtp = (rec && rec.kodeAtp) ? rec.kodeAtp : (!nv.isSubHalaman ? (angkaKls + '.' + nv.kodeHierarki) : '');
            if (nv.isSubHalaman) {
                obj.iktp = (rec && rec.iktp !== undefined && rec.iktp !== null) ? rec.iktp : ((rec && rec.tp) || '');
                obj.iktpPenyusun = [];
            } else {
                obj.iktp = '';
                obj.iktpPenyusun = iktpListPerBab[nv.pageKey] || [];
            }

            // Jika Bab Utama memiliki Sub-Bab, total JP & pertemuan Bab otomatis mencerminkan gabungan seluruh Sub-Bab
            if (!nv.isSubHalaman && countSubPerBab[nv.pageKey] > 0) {
                obj.totalJP = sumJpPerBab[nv.pageKey];
                obj.jumlahPertemuan = countSubPerBab[nv.pageKey];
                obj.alokasiWaktu = countSubPerBab[nv.pageKey] + ' Pertemuan (' + sumJpPerBab[nv.pageKey] + ' JP)';
            }

            if (!nv.isSubHalaman) {
                semIndukMap[nv.pageKey] = obj.semester || 'I (Ganjil)';
            } else if (nv.indukKey && semIndukMap[nv.indukKey]) {
                obj.semester = semIndukMap[nv.indukKey];
            }

            if (ikutkanSubBab || !obj.isSubHalaman) merged.push(obj);
        });

        return merged;
    };

    window.daEditCepatBabDariProta = function(pageKey, judulHalaman, kelas, fase, field, val) {
        if (typeof window.ckMuatLokal === 'function') window.ckMuatLokal();
        let rec = window.CAKUPAN_HALAMAN_DATA[pageKey];
        if (!rec) {
            rec = { pageKey: pageKey, judulHalaman: judulHalaman, kelas: kelas, fase: fase, semester: 'I (Ganjil)', jumlahPertemuan: 1, totalJP: 2, alokasiWaktu: '1 Pertemuan (2 JP)' };
            window.CAKUPAN_HALAMAN_DATA[pageKey] = rec;
        }

        if (field === 'totalJP') {
            rec.totalJP = Number(val) || 0;
            rec.jpPertemuan = Number(val) || 0;
            rec.alokasiWaktu = '1 Pertemuan (' + rec.totalJP + ' JP)';
        } else {
            rec[field] = val;
        }
        rec.updatedAt = Date.now();

        if (field === 'semester') {
            let navList = window.daScanStrukturBabRuangBelajar();
            navList.forEach(function(nv) {
                if (nv.isSubHalaman && nv.indukKey === pageKey) {
                    if (!window.CAKUPAN_HALAMAN_DATA[nv.pageKey]) {
                        window.CAKUPAN_HALAMAN_DATA[nv.pageKey] = { pageKey: nv.pageKey, judulHalaman: nv.judulHalaman, kelas: nv.kelas, fase: nv.fase, totalJP: 2 };
                    }
                    window.CAKUPAN_HALAMAN_DATA[nv.pageKey].semester = val;
                    window.CAKUPAN_HALAMAN_DATA[nv.pageKey].updatedAt = Date.now();
                }
            });
        }

        if (typeof window.ckSimpanLokal === 'function') window.ckSimpanLokal();
        if (typeof window.ckSimpanHalamanKeCloud === 'function') window.ckSimpanHalamanKeCloud(pageKey, true);
        if (typeof window.ckRenderPanel === 'function') window.ckRenderPanel();
        window.daRenderTab();
    };

    window._daTpAtpSaveTimers = window._daTpAtpSaveTimers || {};

    window.daAutoFitTextarea = function(el) {
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.max(40, el.scrollHeight + 4) + 'px';
    };

    window.daAutoFitSemuaTextarea = function() {
        let stage = document.getElementById('da-tab-stage');
        if (!stage) return;
        stage.querySelectorAll('textarea.da-tpatp-ta').forEach(function(ta) {
            window.daAutoFitTextarea(ta);
        });
    };

    // EDIT SINKRON 2 ARAH (DOKUMEN ADMINISTRASI <-> PANEL DESAIN PERTEMUAN SUB-BAB)
    window.daEditTpAtpSinkron = function(pageKey, judulHalaman, kelas, fase, semester, isSub, indukBab, indukKey, field, val, el) {
        if (typeof window.ckMuatLokal === 'function') window.ckMuatLokal();
        if (!window.CAKUPAN_HALAMAN_DATA) window.CAKUPAN_HALAMAN_DATA = {};

        let rec = window.CAKUPAN_HALAMAN_DATA[pageKey];
        if (!rec) {
            if (typeof window.ckBuatDefaultRecord === 'function') {
                rec = window.ckBuatDefaultRecord({
                    pageKey: pageKey,
                    judul: judulHalaman,
                    kelasAuto: kelas,
                    faseAuto: fase,
                    semester: semester || 'I (Ganjil)',
                    isSubHalaman: Boolean(isSub),
                    indukBab: indukBab || '',
                    indukKey: indukKey || ''
                });
            } else {
                rec = {
                    pageKey: pageKey,
                    judulHalaman: judulHalaman,
                    kelas: kelas,
                    fase: fase,
                    semester: semester || 'I (Ganjil)',
                    isSubHalaman: Boolean(isSub),
                    indukBab: indukBab || '',
                    indukKey: indukKey || '',
                    totalJP: isSub ? 2 : 4,
                    tp: '',
                    atp: ''
                };
            }
            window.CAKUPAN_HALAMAN_DATA[pageKey] = rec;
        }

        rec[field] = val;
        if (field === 'iktp') {
            rec.tp = val;
            if (Array.isArray(rec.pertemuan) && rec.pertemuan[0]) rec.pertemuan[0].tp = val;
        } else if (field === 'tp' && isSub) {
            rec.iktp = val;
            if (Array.isArray(rec.pertemuan) && rec.pertemuan[0]) rec.pertemuan[0].tp = val;
        }
        rec.updatedAt = Date.now();

        if (el) window.daAutoFitTextarea(el);
        if (typeof window.ckSimpanLokal === 'function') window.ckSimpanLokal();

        // Perbarui live daftar IKTP penyusun (1, 2, 3...) di baris Bab Induk pada Tab TP & ATP
        if (isSub && indukKey && typeof window.daPerbaruiPreviewIktpBab === 'function') {
            window.daPerbaruiPreviewIktpBab(indukKey);
        }

        // Sinkron langsung ke panel Sub-Bab di belakang modal (baik saat edit Sub-Bab maupun edit Bab Induknya!)
        if (typeof window.ckDeteksiInfoHalamanAktif === 'function' && typeof window.ckRenderPanel === 'function') {
            let infoOpen = window.ckDeteksiInfoHalamanAktif();
            if (infoOpen && (infoOpen.pageKey === pageKey || infoOpen.indukKey === pageKey)) {
                window.ckRenderPanel();
            }
        }

        let badge = document.getElementById('da-tpatp-stat-' + pageKey);
        if (badge) {
            badge.innerHTML = '<span style="color:#d97706;">⏳ Menyimpan...</span>';
        }

        clearTimeout(window._daTpAtpSaveTimers[pageKey]);
        window._daTpAtpSaveTimers[pageKey] = setTimeout(function() {
            if (typeof window.ckSimpanHalamanKeCloud === 'function') {
                window.ckSimpanHalamanKeCloud(pageKey, true);
            }
            let bNow = document.getElementById('da-tpatp-stat-' + pageKey);
            if (bNow) {
                bNow.innerHTML = '<span style="color:#15803d; font-weight:700;">✅ Tersinkron</span>';
            }
        }, 900);
    };

    window.daBangunHtmlPreviewIktpBab = function(listIktp) {
        if (!Array.isArray(listIktp) || listIktp.length === 0) return '';
        let items = listIktp.map(function(it, i) {
            let bersih = String(it.iktp || '').replace(/^\d+[\.\)]\s*/, '').replace(/\r?\n/g, ' ').trim();
            return '<div style="margin-top:2px; line-height:1.4;"><b>' + (i + 1) + '.</b> ' +
                (bersih
                    ? (daEsc(bersih) + ' <span style="color:#64748b; font-size:10px;">(' + daEsc(it.judul) + ')</span>')
                    : ('<span style="color:#94a3b8; font-style:italic;">[' + daEsc(it.judul) + ' — IKTP belum diisi]</span>')) +
            '</div>';
        }).join('');
        return '<div class="da-bab-iktp-preview">' +
            '<div style="font-size:10px; font-weight:800; color:#0369a1; margin-bottom:2px;">🔗 Rincian IKTP Penyusun TP (Otomatis dari ' + listIktp.length + ' Sub-Bab):</div>' +
            items +
        '</div>';
    };

    window.daPerbaruiPreviewIktpBab = function(babKey) {
        let host = document.getElementById('da-bab-iktp-preview-' + babKey);
        if (!host) return;
        let semua = window.daAmbilSemuaBabRuangMateri(true);
        let babNode = semua.find(function(b) { return b.pageKey === babKey && !b.isSubHalaman; });
        host.innerHTML = babNode ? window.daBangunHtmlPreviewIktpBab(babNode.iktpPenyusun) : '';
    };

    window.daHitungKaldik = function(semKey) {
        let rows = (window.DOC_ADMIN_STATE.kaldik && window.DOC_ADMIN_STATE.kaldik[semKey]) || [];
        let totM = 0, totTE = 0, totE = 0;
        rows.forEach(function(r) {
            let jm = Number(r.jumlahMinggu) || 0;
            let te = Math.min(jm, Number(r.tidakEfektif) || 0);
            let ef = Math.max(0, jm - te);
            totM += jm; totTE += te; totE += ef;
        });
        return { totalMinggu: totM, totalTidakEfektif: totTE, totalEfektif: totE };
    };

    // PERAKIT 1 DOKUMEN MODUL AJAR PER BAB (MERANGKUM SELURUH SUB-BAB MENJADI PERTEMUAN 1..N)
    window.daRakitPayloadModulAjar = function(babKey, extraKeys) {
        let semuaNode = window.daAmbilSemuaBabRuangMateri(true);
        let nodeMap = {};
        semuaNode.forEach(function(it) { nodeMap[it.pageKey] = it; });

        let targetNode = nodeMap[babKey];
        if (!targetNode) return null;

        // Jika yang dipilih ternyata Sub-Bab, naikkan otomatis ke Bab Induknya agar 1 Modul Ajar tetap = 1 Bab Utuh
        if (targetNode.tipeNode === 'subbab' && targetNode.indukKey && nodeMap[targetNode.indukKey]) {
            targetNode = nodeMap[targetNode.indukKey];
            babKey = targetNode.pageKey;
        }

        let u = window.DOC_ADMIN_STATE.umum || {};
        let menitJP = Number(u.menitPerJP) || 45;

        // Ambil seluruh Sub-Bab di bawah Bab ini sesuai urutan menu Ruang Belajar
        let subBabList = semuaNode.filter(function(it) {
            return it.tipeNode === 'subbab' && it.indukKey === babKey;
        });

        // Tambahkan halaman ekstra jika dicentang manual
        (extraKeys || []).forEach(function(ek) {
            if (ek && ek !== babKey && nodeMap[ek] && !subBabList.some(function(s) { return s.pageKey === ek; })) {
                subBabList.push(nodeMap[ek]);
            }
        });

        // Sumber penggabungan: semua Sub-Bab (atau Bab itu sendiri jika belum ada Sub-Bab)
        let sumberList = subBabList.length > 0 ? subBabList : [targetNode];

        let totalJPBab = 0;
        let materiPokokArr = [];
        let kesiapanSudahArr = [];
        let kesiapanBelumArr = [];
        let karakArr = [];
        let tpArr = [];
        let atpArr = [];
        let lintasArr = [];
        let modelSet = [];
        let metodeSet = [];
        let kemitraanArr = [];
        let digitalArr = [];
        let pertemuanGabungan = [];
        let kasusGabungan = [];
        let materiPages = [];
        let glosMap = {};
        let pustakaSet = [];
        let dplGabungan = {};

        (window.MA_DAFTAR_DPL || []).forEach(function(d) {
            dplGabungan[d.kode] = { aktif: false, ketList: [] };
        });

        if (u.daftarPustakaUmum) {
            String(u.daftarPustakaUmum).split(/\r?\n/).forEach(function(l) {
                if (l.trim() && pustakaSet.indexOf(l.trim()) === -1) pustakaSet.push(l.trim());
            });
        }

        let asesmenTerbaik = null;
        let rubrikTerbaik = null;
        let lkpdJudul = 'LKPD & Eksplorasi — ' + targetNode.judulHalaman;
        let lkpdTujuan = '';
        let lkpdLangkah = '';

        function pushUnik(arr, teks) {
            let t = String(teks || '').trim();
            if (t && arr.indexOf(t) === -1) arr.push(t);
        }

        sumberList.forEach(function(sub, idx) {
            let jpSub = Number(sub.totalJP) || Number(sub.jpPertemuan) || 2;
            totalJPBab += jpSub;
            pushUnik(materiPokokArr, sub.materiPokok || sub.judulHalaman);
            pushUnik(kesiapanSudahArr, sub.kesiapanSudah);
            pushUnik(kesiapanBelumArr, sub.kesiapanBelum);
            pushUnik(karakArr, sub.karakteristikMateri);

            let iktpSub = String(sub.iktp || sub.tp || '').trim();
            if (iktpSub) {
                let iktpClean = iktpSub.replace(/^\d+[\.\)]\s*/, '').replace(/\r?\n/g, ' ').trim();
                tpArr.push((idx + 1) + '. ' + iktpClean + ' (' + sub.judulHalaman + ')');
            }
            if (sub.atp && String(sub.atp).trim()) {
                pushUnik(atpArr, 'Pert. ' + (idx + 1) + ' — ' + sub.judulHalaman + ': ' + String(sub.atp).trim().replace(/\r?\n/g, ' '));
            } else {
                pushUnik(atpArr, 'Pert. ' + (idx + 1) + ' — ' + sub.judulHalaman + ' (' + jpSub + ' JP)');
            }

            String(sub.lintasDisiplin || '').split(/\r?\n/).forEach(function(l) { pushUnik(lintasArr, l); });
            pushUnik(modelSet, sub.modelPembelajaran);
            pushUnik(metodeSet, sub.metodePembelajaran);
            pushUnik(kemitraanArr, sub.kemitraan);
            pushUnik(digitalArr, sub.pemanfaatanDigital);

            // Gabungkan DPL dari seluruh Sub-Bab
            (window.MA_DAFTAR_DPL || []).forEach(function(d) {
                let st = sub.dpl && sub.dpl[d.kode];
                if (st && st.aktif) {
                    dplGabungan[d.kode].aktif = true;
                    if (st.ket && dplGabungan[d.kode].ketList.indexOf(st.ket.trim()) === -1) {
                        dplGabungan[d.kode].ketList.push(st.ket.trim());
                    }
                }
            });

            // 1 Sub-Bab = 1 Pertemuan (ambil skenario pertemuan tunggal dari Sub-Bab tsb)
            let ptSrc = (Array.isArray(sub.pertemuan) && sub.pertemuan.length > 0)
                ? sub.pertemuan[0]
                : (typeof window.ckBuatTemplatePertemuan === 'function'
                    ? window.ckBuatTemplatePertemuan(idx + 1, sub.modelPembelajaran || 'Discovery Learning', jpSub, sub.tp || sub.judulHalaman)
                    : null);

            if (ptSrc) {
                let awalGab = String(ptSrc.awalIsi || '');
                if (sub.pertanyaanPemantik && awalGab.indexOf('Pertanyaan Pemantik') === -1) {
                    awalGab += (awalGab ? '\n' : '') + 'Pertanyaan Pemantik:\n' + sub.pertanyaanPemantik;
                }
                pertemuanGabungan.push({
                    pertemuanKe: idx + 1,
                    subBabJudul: sub.judulHalaman,
                    model: ptSrc.model || sub.modelPembelajaran || 'Discovery Learning',
                    metode: ptSrc.metode || sub.metodePembelajaran || 'Diskusi & Eksplorasi',
                    tp: sub.iktp || ptSrc.tp || sub.tp || sub.judulHalaman,
                    jp: jpSub,
                    alokasiTeks: jpSub + ' JP (' + (jpSub * menitJP) + ' Menit)',
                    awalMenit: Number(ptSrc.awalMenit) || 15,
                    awalIsi: awalGab,
                    intiMenit: Number(ptSrc.intiMenit) || Math.max(20, (jpSub * menitJP) - 30),
                    intiMemahami: ptSrc.intiMemahami || '',
                    intiMengaplikasikan: ptSrc.intiMengaplikasikan || '',
                    intiMerefleksi: ptSrc.intiMerefleksi || '',
                    penutupMenit: Number(ptSrc.penutupMenit) || 15,
                    penutupIsi: ptSrc.penutupIsi || ''
                });
            }

            // Asesmen (utamakan Sub-Bab yang sudah memilih paket soal Bank Web)
            if (sub.asesmen && sub.asesmen.sumberSoalKey) {
                asesmenTerbaik = sub.asesmen;
            } else if (!asesmenTerbaik && sub.asesmen && Object.keys(sub.asesmen).length > 0) {
                asesmenTerbaik = sub.asesmen;
            }

            // LKPD & Kasus dari semua Sub-Bab digabung
            if (sub.lkpd) {
                if (!lkpdTujuan && sub.lkpd.tujuan) lkpdTujuan = sub.lkpd.tujuan;
                if (!lkpdLangkah && sub.lkpd.langkah) lkpdLangkah = sub.lkpd.langkah;
                if (Array.isArray(sub.lkpd.kasusList)) {
                    sub.lkpd.kasusList.forEach(function(ks) {
                        if (ks && (ks.judul || ks.narasi)) {
                            kasusGabungan.push(Object.assign({}, ks, {
                                judul: (subBabList.length > 1 ? ('[' + sub.judulHalaman + '] ') : '') + (ks.judul || 'Studi Kasus')
                            }));
                        }
                    });
                }
            }

            if (!rubrikTerbaik && sub.rubrik && Array.isArray(sub.rubrik.kriteriaProyek) && sub.rubrik.kriteriaProyek.length > 0) {
                rubrikTerbaik = sub.rubrik;
            }

            if (sub.materiHtmlSnapshot && sub.materiHtmlSnapshot.trim()) {
                materiPages.push({ pageId: sub.pageKey, judul: sub.judulHalaman, html: sub.materiHtmlSnapshot });
            }

            (sub.glosarium || []).forEach(function(g) {
                if (g && g.istilah) {
                    let gLow = g.istilah.toLowerCase();
                    if (!glosMap[gLow] || (!glosMap[gLow].definisi && g.definisi)) {
                        glosMap[gLow] = { istilah: g.istilah, definisi: g.definisi || '' };
                    }
                }
            });

            if (sub.daftarPustaka) {
                String(sub.daftarPustaka).split(/\r?\n/).forEach(function(l) {
                    if (l.trim() && pustakaSet.indexOf(l.trim()) === -1) pustakaSet.push(l.trim());
                });
            }
        });

        let dplFinal = {};
        (window.MA_DAFTAR_DPL || []).forEach(function(d) {
            let g = dplGabungan[d.kode];
            dplFinal[d.kode] = {
                aktif: Boolean(g && g.aktif),
                ket: (g && g.ketList.length > 0) ? g.ketList.join('; ') : d.defaultKet
            };
        });

        let pertama = sumberList[0] || targetNode;

        return {
            id: babKey,
            jumlahSubBabTergabung: subBabList.length,
            daftarSubBab: subBabList.map(function(s) { return s.judulHalaman; }),
            identitas: {
                jenjang: u.jenjang || 'SMA',
                mapel: u.mapel || 'Biologi',
                fase: targetNode.fase || 'E',
                kelas: targetNode.kelas || 'X (Sepuluh)',
                semester: targetNode.semester || pertama.semester || 'I (Ganjil)',
                tahunAjaran: u.tahunAjaran || '2026/2027',
                bab: targetNode.judulHalaman || babKey,
                materiPokok: materiPokokArr.join(', '),
                alokasiWaktu: pertemuanGabungan.length + ' Pertemuan (' + totalJPBab + ' JP)',
                jumlahMurid: u.jumlahMurid || '30 - 36 Orang',
                targetPeserta: u.targetPeserta || 'Murid Reguler',
                tanggalPengesahan: u.tanggalPengesahan || ((u.kota || 'Batam') + ', Juli 2026')
            },
            identifikasi: {
                kesiapanSudah: kesiapanSudahArr.join(' ') || 'Murid telah mengenal konsep dasar Biologi dari jenjang sebelumnya.',
                kesiapanBelum: kesiapanBelumArr.join(' ') || 'Murid perlu pendalaman analisis mekanisme dan pemecahan masalah kontekstual.',
                karakteristikMateri: karakArr.join(' ') || 'Materi mencakup konsep faktual, konseptual, prosedural, dan kontekstual Biologi.',
                dpl: dplFinal
            },
            desain: {
                cp: (u.cpPerFase && u.cpPerFase[targetNode.fase]) ? u.cpPerFase[targetNode.fase] : '',
                lintasDisiplin: lintasArr.join('\n') || '-',
                tp: (function() {
                    let tpPayung = targetNode.tp ? String(targetNode.tp).trim() : '';
                    if (tpPayung && tpArr.length > 0) {
                        return tpPayung + '\nRincian IKTP Penyusun TP:\n' + tpArr.join('\n');
                    }
                    if (tpPayung) return tpPayung;
                    return tpArr.join('\n') || '-';
                })(),
                topik: (function() {
                    let headAtp = [];
                    if (targetNode.kodeAtp) headAtp.push('Kode ATP: ' + targetNode.kodeAtp);
                    if (targetNode.atp && String(targetNode.atp).trim()) headAtp.push(String(targetNode.atp).trim());
                    let gab = headAtp.length > 0 ? [headAtp.join(' — ')].concat(atpArr) : atpArr;
                    return gab.join('\n') || '-';
                })(),
                modelUtama: modelSet.join(', ') || 'Discovery Learning / PBL',
                pendekatan: pertama.pendekatan || 'Deep Learning (Berkesadaran, Bermakna, Menggembirakan)',
                modePembelajaran: pertama.modePembelajaran || 'Luring (Tatap Muka)',
                metodeUmum: metodeSet.join(', ') || 'Diskusi Kelompok, Eksplorasi, Presentasi',
                kemitraan: kemitraanArr.join(' ') || '-',
                lingkunganFisik: pertama.lingkunganFisik || 'Ruang kelas modular dan Laboratorium Biologi sekolah.',
                lingkunganVirtual: pertama.lingkunganVirtual || 'Web pembelajaran sekolah.',
                budayaBelajar: pertama.budayaBelajar || 'Teliti, ingin tahu, kolaboratif, dan saling menghormati.',
                pemanfaatanDigital: digitalArr.join(' ') || '-'
            },
            pertemuan: pertemuanGabungan,
            asesmen: asesmenTerbaik || {},
            lkpd: {
                judul: lkpdJudul,
                tujuan: lkpdTujuan || 'Melatih murid menganalisis fenomena kontekstual dan merancang solusi ilmiah.',
                langkah: lkpdLangkah || '1. Amati studi kasus secara berkelompok.\n2. Diskusikan dan isi tabel pengamatan.\n3. Presentasikan hasil di depan kelas.',
                kasusList: kasusGabungan
            },
            rubrik: {
                judulProyek: (rubrikTerbaik && rubrikTerbaik.judulProyek) || 'Rubrik Penilaian Kinerja, LKPD & Produk',
                kriteriaProyek: (rubrikTerbaik && rubrikTerbaik.kriteriaProyek) || [],
                rubrikDpl: window.MA_DEFAULT_RUBRIK_DPL
            },
            materiPages: materiPages,
            materiRingkasanTambahan: '',
            glosarium: Object.values(glosMap),
            daftarPustaka: pustakaSet.join('\n'),
            opsiExport: window.DOC_ADMIN_STATE.opsiExport
        };
    };

    window.maAmbilSoalTerpilih = function(mod) {
        let tipe = mod && mod.asesmen && mod.asesmen.sumberSoalTipe;
        let key = mod && mod.asesmen && mod.asesmen.sumberSoalKey;
        if (!tipe || !key) return [];
        let rawSoal = [];
        if (tipe === 'ujian' && window.adminBankUjianData && window.adminBankUjianData[key]) rawSoal = window.adminBankUjianData[key].soal || [];
        else if (tipe === 'latihan' && window.adminBankLatihanData && window.adminBankLatihanData[key]) rawSoal = window.adminBankLatihanData[key].soal || [];
        if (typeof window.normalisasiSoalUjianCBT === 'function') return window.normalisasiSoalUjianCBT(rawSoal);
        return Array.isArray(rawSoal) ? rawSoal : Object.values(rawSoal || {});
    };

    // =========================================================================
    // 4. MUTATOR INFORMASI UMUM, KALDIK, PROMES, & PREVIEW
    // =========================================================================
    window.daSetUmum = function(field, val) {
        window.DOC_ADMIN_STATE.umum[field] = val;
        window.daSimpanLokal();
        if (field === 'tahunAjaran') window.daRenderTab();
    };

    window.daSetCP = function(fase, val) {
        window.DOC_ADMIN_STATE.umum.cpPerFase[fase] = val;
        window.daSimpanLokal();
    };

    window.daSetJPPerMinggu = function(fase, val) {
        window.DOC_ADMIN_STATE.umum.jpPerMinggu[fase] = Number(val) || 2;
        window.daSimpanLokal();
        window.daRenderTab();
    };

    window.daSetKaldikCell = function(semKey, idx, field, val) {
        let row = window.DOC_ADMIN_STATE.kaldik[semKey][idx];
        if (!row) return;
        row[field] = (field === 'ket' || field === 'bulan') ? val : (Number(val) || 0);
        window.daSimpanLokal();
        window.daRenderTab();
    };

    window.daTogglePromesCell = function(pageKey, bulan, mingguKe) {
        let k = pageKey + '::' + bulan + '::' + mingguKe;
        let cur = window.DOC_ADMIN_STATE.promesMarks[k] || '';
        let next = (cur === '') ? 'P' : (cur === 'P' ? 'U' : (cur === 'U' ? 'L' : ''));
        if (next) window.DOC_ADMIN_STATE.promesMarks[k] = next;
        else delete window.DOC_ADMIN_STATE.promesMarks[k];
        window.daSimpanLokal();
        window.daRenderTab();
    };

    window.daSetPreviewDocType = function(tipe) {
        window.DOC_ADMIN_STATE.previewDocType = tipe;
        window.daRenderTab();
    };

    window.daSetSelectedBab = function(key) {
        window.DOC_ADMIN_STATE.selectedBabKey = key;
        window.DOC_ADMIN_STATE.mergedPageKeys = [];
        window.daRenderTab();
    };

    window.daToggleMergePage = function(key, checked) {
        let arr = window.DOC_ADMIN_STATE.mergedPageKeys || [];
        let idx = arr.indexOf(key);
        if (checked && idx === -1) arr.push(key);
        else if (!checked && idx !== -1) arr.splice(idx, 1);
        window.DOC_ADMIN_STATE.mergedPageKeys = arr;
        window.daSegarkanIframePreview();
    };

    window.daToggleOpsiExport = function(key, checked) {
        window.DOC_ADMIN_STATE.opsiExport[key] = Boolean(checked);
        window.daSegarkanIframePreview();
    };

    window.daSiapkanKonteksExport = function() {
        let st = window.DOC_ADMIN_STATE;
        let semuaBab = window.daAmbilSemuaBabRuangMateri(Boolean(st.tampilSubBabProta));
        let babFilter = semuaBab.filter(function(b) {
            return st.filterKelas === 'Semua' || b.kelas === st.filterKelas;
        });

        return {
            docType: st.previewDocType,
            umum: st.umum,
            kaldik: st.kaldik,
            kaldikEvents: st.kaldikEvents || [],
            promesMarks: st.promesMarks,
            filterKelas: st.filterKelas,
            filterSemester: st.filterSemester,
            babList: babFilter,
            modulAjar: st.selectedBabKey ? window.daRakitPayloadModulAjar(st.selectedBabKey, st.mergedPageKeys) : null
        };
    };

    window.daSegarkanIframePreview = function() {
        let iframe = document.getElementById('da-live-preview-iframe');
        if (!iframe || typeof window.bangunHtmlDokumenAdministrasi !== 'function') return;
        iframe.srcdoc = window.bangunHtmlDokumenAdministrasi(window.daSiapkanKonteksExport(), 'preview');
    };

    window.daJalankanExport = function(format) {
        window.daSimpanKeCloud(true);
        let ctx = window.daSiapkanKonteksExport();
        if (ctx.docType === 'modul_ajar' && !ctx.modulAjar) {
            return daToast('⚠️ Pilih minimal 1 Bab Materi terlebih dahulu!', true);
        }
        if (typeof window.exportDokumenAdministrasi === 'function') {
            window.exportDokumenAdministrasi(format, ctx);
        }
    };

    // =========================================================================
    // 5. RENDER 3 TAB PORTAL DOKUMEN ADMINISTRASI
    // =========================================================================
    window.daPindahTab = function(tabName) {
        window.DOC_ADMIN_STATE.activeTab = tabName;
        document.querySelectorAll('.da-tab-btn').forEach(function(b) {
            b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
        });
        window.daRenderTab();
    };

    window.daRenderTab = function() {
        let stage = document.getElementById('da-tab-stage');
        if (!stage) return;
        let tab = window.DOC_ADMIN_STATE.activeTab || 'umum';
        let u = window.DOC_ADMIN_STATE.umum;

        // TAB 1: INFORMASI UMUM + KALDIK & KALENDER VISUAL 12 BULAN
        if (tab === 'umum') {
            let buildKaldikTable = function(semKey, judulSem) {
                let rows = window.DOC_ADMIN_STATE.kaldik[semKey] || [];
                let stat = window.daHitungKaldik(semKey);
                let trs = rows.map(function(r, i) {
                    let ef = Math.max(0, (Number(r.jumlahMinggu) || 0) - (Number(r.tidakEfektif) || 0));
                    return '<tr>' +
                        '<td><b>' + daEsc(r.bulan) + '</b></td>' +
                        '<td><input type="number" class="da-num-cell" min="0" max="6" value="' + (Number(r.jumlahMinggu) || 0) + '" onchange="window.daSetKaldikCell(\'' + semKey + '\', ' + i + ', \'jumlahMinggu\', this.value)"></td>' +
                        '<td><input type="number" class="da-num-cell" min="0" max="6" value="' + (Number(r.tidakEfektif) || 0) + '" onchange="window.daSetKaldikCell(\'' + semKey + '\', ' + i + ', \'tidakEfektif\', this.value)"></td>' +
                        '<td style="text-align:center; font-weight:900; color:#15803d;">' + ef + '</td>' +
                        '<td><input type="text" class="da-txt-cell" value="' + daEsc(r.ket) + '" oninput="window.daSetKaldikCell(\'' + semKey + '\', ' + i + ', \'ket\', this.value)"></td>' +
                    '</tr>';
                }).join('');
                return '<div class="da-kaldik-box">' +
                    '<div style="font-size:12px; font-weight:800; color:#0b3954; margin-bottom:6px;">' + judulSem + ' — Minggu Efektif: <span style="color:#15803d;">' + stat.totalEfektif + ' Minggu</span></div>' +
                    '<table class="excel-table" style="font-size:11.5px;"><thead><tr><th>Bulan</th><th style="width:55px;">Mgg</th><th style="width:60px;">Tdk Ef</th><th style="width:50px;">Efektif</th><th>Keterangan Libur / Kegiatan</th></tr></thead><tbody>' + trs +
                    '<tr style="background:#eef6fb; font-weight:800;"><td>TOTAL</td><td style="text-align:center;">' + stat.totalMinggu + '</td><td style="text-align:center;">' + stat.totalTidakEfektif + '</td><td style="text-align:center; color:#15803d;">' + stat.totalEfektif + '</td><td>E: ' + (stat.totalEfektif * (u.jpPerMinggu.E || 3)) + ' JP | F: ' + (stat.totalEfektif * (u.jpPerMinggu.F || 5)) + ' JP</td></tr>' +
                    '</tbody></table>' +
                '</div>';
            };

            let evListHtml = (window.DOC_ADMIN_STATE.kaldikEvents || []).length > 0
                ? (window.DOC_ADMIN_STATE.kaldikEvents || []).map(function(ev) {
                    let badge = ev.type === 'libur'
                        ? '<span class="da-ev-badge is-libur">🔴 Libur / Tdk Efektif</span>'
                        : '<span class="da-ev-badge is-acara">🟣 Kegiatan / Ujian</span>';
                    let rentang = (ev.start === ev.end)
                        ? window.daFormatTanggalPendek(ev.start)
                        : (window.daFormatTanggalPendek(ev.start) + ' s.d. ' + window.daFormatTanggalPendek(ev.end));
                    return '<div class="da-ev-row">' +
                        '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">' +
                            badge +
                            '<b style="font-size:12px; color:#0b3954;">' + daEsc(rentang) + '</b>' +
                            '<span style="font-size:12px; color:#334155;">— ' + daEsc(ev.title) + '</span>' +
                        '</div>' +
                        '<button type="button" class="da-del-ev-btn" onclick="window.daHapusEventKaldik(\'' + daEsc(ev.id) + '\')" title="Hapus agenda ini">✕</button>' +
                    '</div>';
                }).join('')
                : '<div style="font-size:12px; color:#64748b; padding:10px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; text-align:center;">Belum ada rentang tanggal libur/kegiatan. Isi form di atas atau klik tanggal langsung di kalender visual di bawah.</div>';

            stage.innerHTML =
                '<div class="da-card">' +
                    '<div class="da-card-title">🏫 1. Identitas Umum Sekolah, Guru &amp; Logo Sekolah (Sebelah Kiri)</div>' +
                    '<div class="da-logo-bar" style="margin-bottom:10px;">' +
                        '<img src="' + daEsc(u.logoSekolah) + '" alt="Logo Sekolah" onerror="this.style.opacity=0.25">' +
                        '<div style="flex:1; min-width:220px;">' +
                            '<label class="da-lbl">URL Logo Sekolah (SMAS Bodhi Dharma Batam — Tampil di Sebelah Kiri Kop &amp; Cover)</label>' +
                            '<input type="text" class="input-box da-inp" style="margin-bottom:0 !important;" value="' + daEsc(u.logoSekolah) + '" oninput="window.daSetUmum(\'logoSekolah\', this.value)">' +
                        '</div>' +
                    '</div>' +
                    '<div class="da-grid-3">' +
                        '<div><label class="da-lbl">Nama Instansi / Sekolah</label><input type="text" class="input-box da-inp" value="' + daEsc(u.instansi) + '" oninput="window.daSetUmum(\'instansi\', this.value)"></div>' +
                        '<div><label class="da-lbl">Jenjang &amp; Mata Pelajaran</label><div style="display:flex; gap:6px;"><input type="text" class="input-box da-inp" style="width:80px;" value="' + daEsc(u.jenjang) + '" oninput="window.daSetUmum(\'jenjang\', this.value)"><input type="text" class="input-box da-inp" style="flex:1;" value="' + daEsc(u.mapel) + '" oninput="window.daSetUmum(\'mapel\', this.value)"></div></div>' +
                        '<div><label class="da-lbl">Tahun Ajaran</label><input type="text" class="input-box da-inp" value="' + daEsc(u.tahunAjaran) + '" onchange="window.daSetUmum(\'tahunAjaran\', this.value)"></div>' +
                        '<div><label class="da-lbl">Nama Guru Penyusun</label><input type="text" class="input-box da-inp" value="' + daEsc(u.penyusun) + '" oninput="window.daSetUmum(\'penyusun\', this.value)"></div>' +
                        '<div><label class="da-lbl">NIP Guru</label><input type="text" class="input-box da-inp" value="' + daEsc(u.nipPenyusun) + '" oninput="window.daSetUmum(\'nipPenyusun\', this.value)"></div>' +
                        '<div><label class="da-lbl">Kota &amp; Tanggal Pengesahan</label><input type="text" class="input-box da-inp" value="' + daEsc(u.tanggalPengesahan) + '" oninput="window.daSetUmum(\'tanggalPengesahan\', this.value)"></div>' +
                        '<div><label class="da-lbl">Nama Kepala Sekolah</label><input type="text" class="input-box da-inp" value="' + daEsc(u.kepalaSekolah) + '" oninput="window.daSetUmum(\'kepalaSekolah\', this.value)"></div>' +
                        '<div><label class="da-lbl">NIP Kepala Sekolah</label><input type="text" class="input-box da-inp" value="' + daEsc(u.nipKepsek) + '" oninput="window.daSetUmum(\'nipKepsek\', this.value)"></div>' +
                        '<div><label class="da-lbl">Menit/JP &amp; JP/Minggu (E / F)</label><div style="display:flex; gap:5px;"><input type="number" class="input-box da-inp" value="' + (Number(u.menitPerJP) || 45) + '" oninput="window.daSetUmum(\'menitPerJP\', Number(this.value)||45)" title="Menit per 1 JP"><input type="number" class="input-box da-inp" value="' + (Number(u.jpPerMinggu.E) || 3) + '" onchange="window.daSetJPPerMinggu(\'E\', this.value)" title="JP/Minggu Fase E"><input type="number" class="input-box da-inp" value="' + (Number(u.jpPerMinggu.F) || 5) + '" onchange="window.daSetJPPerMinggu(\'F\', this.value)" title="JP/Minggu Fase F"></div></div>' +
                    '</div>' +
                    '<div><label class="da-lbl">Alamat Sekolah</label><input type="text" class="input-box da-inp" value="' + daEsc(u.alamatSekolah) + '" oninput="window.daSetUmum(\'alamatSekolah\', this.value)"></div>' +
                '</div>' +

                '<div class="da-card">' +
                    '<div class="da-card-title">🧭 2. Capaian Pembelajaran (CP) Universal per Fase</div>' +
                    '<div><label class="da-lbl">CP Fase E (Kelas X)</label><textarea class="input-box da-ta" rows="2" oninput="window.daSetCP(\'E\', this.value)">' + daEsc(u.cpPerFase.E) + '</textarea></div>' +
                    '<div><label class="da-lbl">CP Fase F (Kelas XI &amp; XII)</label><textarea class="input-box da-ta" rows="2" oninput="window.daSetCP(\'F\', this.value)">' + daEsc(u.cpPerFase.F) + '</textarea></div>' +
                    '<div><label class="da-lbl">Daftar Pustaka Umum</label><textarea class="input-box da-ta" rows="2" oninput="window.daSetUmum(\'daftarPustakaUmum\', this.value)">' + daEsc(u.daftarPustakaUmum) + '</textarea></div>' +
                '</div>' +

                '<div class="da-card">' +
                    '<div class="da-card-title">📅 3. Kalender Pendidikan &amp; Rincian Minggu Efektif</div>' +
                    '<div class="da-grid-2">' +
                        buildKaldikTable('ganjil', 'Semester I (Ganjil)') +
                        buildKaldikTable('genap', 'Semester II (Genap)') +
                    '</div>' +

                    '<div class="da-kaldik-cal-section">' +
                        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">' +
                            '<div style="font-size:13px; font-weight:800; color:#0b3954;">🗓️ Input Rentang Tanggal Libur / Kegiatan (Tersinkron ke Penjadwalan)</div>' +
                            '<div style="display:flex; gap:6px; flex-wrap:wrap;">' +
                                '<button type="button" class="da-mini-action" style="background:#7e22ce;" onclick="window.daTarikEventDariKalenderGuru()">📥 Tarik dari Kalender Guru</button>' +
                                '<button type="button" class="da-mini-action" style="background:#0284c7;" onclick="window.daHitungRmeDariEventKaldik(false)">🔄 Hitung Ulang RME</button>' +
                                '<button type="button" class="da-mini-action" style="background:#16a34a;" onclick="window.daSinkronKaldikKePenjadwalan(true)">🔗 Sinkron ke Jadwal</button>' +
                            '</div>' +
                        '</div>' +

                        '<div class="da-event-form">' +
                            '<div><label class="da-lbl">Tanggal Mulai</label><input type="date" id="da-ke-start" class="input-box da-inp" style="margin:0 !important;"></div>' +
                            '<div><label class="da-lbl">Tanggal Selesai</label><input type="date" id="da-ke-end" class="input-box da-inp" style="margin:0 !important;"></div>' +
                            '<div><label class="da-lbl">Kategori</label><select id="da-ke-type" class="input-box da-inp" style="margin:0 !important;"><option value="libur">🔴 Hari Libur / Tdk Efektif</option><option value="acara">🟣 Kegiatan Sekolah / Ujian</option></select></div>' +
                            '<div><label class="da-lbl">Penjelasan Acara / Libur</label><input type="text" id="da-ke-title" class="input-box da-inp" style="margin:0 !important;" placeholder="Contoh: Libur Semester, MPLS, STS..."></div>' +
                            '<div style="display:flex; align-items:flex-end; gap:6px;">' +
                                '<button type="button" class="btn-action" style="background:#0b3954; padding:8px 12px; font-size:12px;" onclick="window.daTambahEventKaldik()">➕ Tambah</button>' +
                            '</div>' +
                        '</div>' +
                        '<label style="display:inline-flex; align-items:center; gap:6px; font-size:11.5px; color:#475569; margin:6px 0 10px 0; cursor:pointer;"><input type="checkbox" id="da-ke-te" checked> Tandai mengurangi Minggu Efektif jika jatuh ≥3 hari kerja dalam 1 minggu</label>' +

                        '<div class="da-ev-list">' + evListHtml + '</div>' +

                        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin:14px 0 8px 0;">' +
                            '<b style="font-size:12.5px; color:#0b3954;">📆 Kalender Pendidikan Visual Tahun Ajaran ' + daEsc(u.tahunAjaran) + ' (Klik tanggal untuk mengisi rentang)</b>' +
                            '<div style="font-size:11px; display:flex; gap:10px; flex-wrap:wrap;">' +
                                '<span><b style="color:#dc2626;">■</b> Libur / Tdk Efektif</span>' +
                                '<span><b style="color:#7e22ce;">■</b> Kegiatan / Ujian</span>' +
                                '<span><b style="color:#ef4444;">M</b> Hari Minggu</span>' +
                            '</div>' +
                        '</div>' +
                        window.daRenderGridKalender12BulanHTML(u.tahunAjaran, false) +
                    '</div>' +
                '</div>';
            return;
        }

        // TAB 2: RUANG SINKRONISASI TP (BAB), ATP (URUTAN FASE), & IKTP (SUB-BAB) — EDITABEL 2 ARAH
        if (tab === 'tp_atp') {
            let semuaNode = window.daAmbilSemuaBabRuangMateri(true);
            let kelasTersedia = DA_URUTAN_KELAS.filter(function(k) {
                return semuaNode.some(function(b) { return b.kelas === k; });
            });

            let filterKls = window.DOC_ADMIN_STATE.filterKelas || 'Semua';
            let filterSemTp = window.DOC_ADMIN_STATE.filterSemTpAtp || 'Semua';
            let cariTxt = String(window.DOC_ADMIN_STATE.cariTpAtp || '').trim().toLowerCase();

            let kelasDitampilkan = (filterKls === 'Semua')
                ? kelasTersedia
                : kelasTersedia.filter(function(k) { return k === filterKls; });

            let tbodyHtml = '';
            let totalBarisTampil = 0;

            kelasDitampilkan.forEach(function(klsName) {
                let daftarKls = semuaNode.filter(function(b) {
                    if (b.kelas !== klsName) return false;
                    let semNow = b.semester || 'I (Ganjil)';
                    if (filterSemTp !== 'Semua' && semNow !== filterSemTp) return false;
                    if (cariTxt) {
                        let gab = (b.judulHalaman + ' ' + (b.indukBab || '') + ' ' + (b.kodeAtp || '') + ' ' + (b.tp || '') + ' ' + (b.iktp || '') + ' ' + (b.atp || '')).toLowerCase();
                        if (gab.indexOf(cariTxt) === -1) return false;
                    }
                    return true;
                });

                if (daftarKls.length === 0) return;

                let faseKls = klsName.indexOf('X (') === 0 ? 'E' : 'F';
                tbodyHtml +=
                    '<tr style="background:#0b3954; color:#fde047;">' +
                        '<td colspan="5" style="text-align:left; font-weight:900; font-size:12.5px; padding:8px 12px;">📚 KELAS ' + daEsc(klsName.toUpperCase()) + ' — ALUR TUJUAN PEMBELAJARAN (FASE ' + faseKls + ')</td>' +
                    '</tr>';

                daftarKls.forEach(function(b) {
                    totalBarisTampil++;
                    let lvl = Number(b.level) || 0;
                    let isSub = lvl > 0;
                    let semNow = b.semester || 'I (Ganjil)';

                    let safeKey = daEsc(b.pageKey).replace(/'/g, "\\'");
                    let safeJudul = daEsc(b.judulHalaman).replace(/'/g, "\\'");
                    let safeKls = daEsc(b.kelas).replace(/'/g, "\\'");
                    let safeFase = daEsc(b.fase).replace(/'/g, "\\'");
                    let safeSem = daEsc(semNow).replace(/'/g, "\\'");
                    let safeIndukBab = daEsc(b.indukBab || '').replace(/'/g, "\\'");
                    let safeIndukKey = daEsc(b.indukKey || '').replace(/'/g, "\\'");

                    let bgRow = isSub ? '#ffffff' : '#eef6fb';
                    let indentPx = isSub ? 20 : 0;
                    let badgeNode = isSub
                        ? '<span class="da-node-tag is-sub">Pert. ' + (b.urutanPertemuan || 1) + '</span>'
                        : '<span class="da-node-tag is-bab">BAB</span>';

                    let kolKode = !isSub
                        ? '<input type="text" class="da-num-cell" style="width:52px; font-size:11px; color:#0b3954;" value="' + daEsc(b.kodeAtp || '') + '" title="Kode Urutan ATP" oninput="window.daEditTpAtpSinkron(\'' + safeKey + '\', \'' + safeJudul + '\', \'' + safeKls + '\', \'' + safeFase + '\', \'' + safeSem + '\', false, \'\', \'\', \'kodeAtp\', this.value, null)">'
                        : '<span style="font-size:11px; color:#64748b; font-weight:700;">' + daEsc(b.kodeHierarki || '-') + '</span>';

                    let semCell = !isSub
                        ? '<select class="da-inline-sel" onchange="window.daEditCepatBabDariProta(\'' + safeKey + '\', \'' + safeJudul + '\', \'' + safeKls + '\', \'' + safeFase + '\', \'semester\', this.value)">' +
                              '<option value="I (Ganjil)"' + (semNow.indexOf('Genap') === -1 ? ' selected' : '') + '>I (Ganjil)</option>' +
                              '<option value="II (Genap)"' + (semNow.indexOf('Genap') !== -1 ? ' selected' : '') + '>II (Genap)</option>' +
                          '</select>'
                        : '<span style="font-size:11px; color:#64748b; font-weight:700;">↳ ' + daEsc(semNow) + '</span>';

                    let fieldUtama = isSub ? 'iktp' : 'tp';
                    let valUtama = isSub ? (b.iktp || '') : (b.tp || '');
                    let lblKol3 = isSub
                        ? '<div style="font-size:10px; font-weight:800; color:#0369a1; margin-bottom:3px;">IKTP / Tujuan Pertemuan Sub-Bab</div>'
                        : '<div style="font-size:10px; font-weight:800; color:#0b3954; margin-bottom:3px;">🎯 TP Bab Utama (1 Unit)</div>';
                    let lblKol4 = isSub
                        ? '<div style="font-size:10px; font-weight:700; color:#64748b; margin-bottom:3px;">Fokus Topik / Alur Pertemuan</div>'
                        : '<div style="font-size:10px; font-weight:800; color:#0b3954; margin-bottom:3px;">🗺️ Alur ATP / Ruang Lingkup Bab</div>';

                    let statLabel = (valUtama && valUtama.trim())
                        ? '<span style="color:#15803d; font-weight:700;">✅ Tersinkron</span>'
                        : '<span style="color:#94a3b8;">Belum diisi</span>';

                    tbodyHtml +=
                        '<tr style="background:' + bgRow + '; vertical-align:top;">' +
                            '<td style="text-align:center; padding-top:8px;">' + kolKode + '</td>' +
                            '<td style="text-align:left; padding:8px 8px 8px ' + (10 + indentPx) + 'px;">' +
                                '<div style="display:flex; align-items:flex-start; gap:6px;">' +
                                    badgeNode +
                                    '<div style="font-weight:' + (isSub ? '700' : '800') + '; color:' + (isSub ? '#1e293b' : '#0b3954') + '; font-size:' + (isSub ? '12px' : '12.5px') + '; line-height:1.35;">' + daEsc(b.judulHalaman) + '</div>' +
                                '</div>' +
                                '<div id="da-tpatp-stat-' + daEsc(b.pageKey) + '" style="font-size:10px; margin-top:4px;">' + statLabel + '</div>' +
                            '</td>' +
                            '<td style="text-align:center; padding-top:8px;">' + semCell + '</td>' +
                            '<td style="padding:6px;">' +
                                lblKol3 +
                                '<textarea class="da-tpatp-ta" rows="1" placeholder="' + (isSub ? 'Ketik IKTP khusus pertemuan ini...' : 'Ketik Tujuan Pembelajaran (TP) Payung 1 Bab...') + '" oninput="window.daEditTpAtpSinkron(\'' + safeKey + '\', \'' + safeJudul + '\', \'' + safeKls + '\', \'' + safeFase + '\', \'' + safeSem + '\', ' + (isSub ? 'true' : 'false') + ', \'' + safeIndukBab + '\', \'' + safeIndukKey + '\', \'' + fieldUtama + '\', this.value, this)">' + daEsc(valUtama) + '</textarea>' +
                                (!isSub ? ('<div id="da-bab-iktp-preview-' + daEsc(b.pageKey) + '">' + window.daBangunHtmlPreviewIktpBab(b.iktpPenyusun) + '</div>') : '') +
                            '</td>' +
                            '<td style="padding:6px;">' +
                                lblKol4 +
                                '<textarea class="da-tpatp-ta" rows="1" placeholder="' + (isSub ? 'Fokus topik / alur pertemuan...' : 'Ringkasan alur / ruang lingkup materi Bab...') + '" oninput="window.daEditTpAtpSinkron(\'' + safeKey + '\', \'' + safeJudul + '\', \'' + safeKls + '\', \'' + safeFase + '\', \'' + safeSem + '\', ' + (isSub ? 'true' : 'false') + ', \'' + safeIndukBab + '\', \'' + safeIndukKey + '\', \'atp\', this.value, this)">' + daEsc(b.atp || '') + '</textarea>' +
                            '</td>' +
                        '</tr>';
                });
            });

            stage.innerHTML =
                '<div class="da-card">' +
                    '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:10px;">' +
                        '<div>' +
                            '<div class="da-card-title" style="margin:0 0 3px 0; border:none; padding:0;">🧭 Sinkronisasi TP (Per Bab), ATP (Urutan Fase), &amp; IKTP (Per Sub-Bab)</div>' +
                            '<div style="font-size:11.5px; color:#475569;">Sesuai Panduan Pembelajaran &amp; Asesmen: <b>TP</b> disusun per <b>Bab Utama</b>, urutan Bab membentuk <b>ATP</b>, dan <b>Sub-Bab</b> berisi <b>IKTP / Tujuan Pertemuan</b>. Edit di sini langsung tersinkron 2 arah ke Panel Ruang Belajar &amp; Modul Ajar.</div>' +
                        '</div>' +
                        '<button type="button" class="da-mini-action" style="background:#0b3954; padding:7px 13px;" onclick="window.DOC_ADMIN_STATE.previewDocType=\'cp_tp_atp\'; window.daPindahTab(\'preview\');">🖨️ Preview Dokumen CP, TP &amp; ATP</button>' +
                    '</div>' +
                    '<div class="da-tpatp-toolbar">' +
                        '<select class="input-box da-inp" style="margin:0 !important; width:auto;" onchange="window.DOC_ADMIN_STATE.filterKelas=this.value; window.daRenderTab();">' +
                            '<option value="Semua"' + (filterKls === 'Semua' ? ' selected' : '') + '>Semua Kelas (X – XII)</option>' +
                            kelasTersedia.map(function(k) { return '<option value="' + daEsc(k) + '"' + (filterKls === k ? ' selected' : '') + '>Kelas ' + daEsc(k) + '</option>'; }).join('') +
                        '</select>' +
                        '<select class="input-box da-inp" style="margin:0 !important; width:auto;" onchange="window.DOC_ADMIN_STATE.filterSemTpAtp=this.value; window.daRenderTab();">' +
                            '<option value="Semua"' + (filterSemTp === 'Semua' ? ' selected' : '') + '>Semua Semester</option>' +
                            '<option value="I (Ganjil)"' + (filterSemTp === 'I (Ganjil)' ? ' selected' : '') + '>Semester I (Ganjil)</option>' +
                            '<option value="II (Genap)"' + (filterSemTp === 'II (Genap)' ? ' selected' : '') + '>Semester II (Genap)</option>' +
                        '</select>' +
                        '<input type="text" class="input-box da-inp" style="margin:0 !important; flex:1; min-width:190px;" value="' + daEsc(window.DOC_ADMIN_STATE.cariTpAtp || '') + '" placeholder="🔍 Cari Bab, Sub-Bab, TP, IKTP, atau ATP..." oninput="window.DOC_ADMIN_STATE.cariTpAtp=this.value; window.daRenderTab();">' +
                        '<span style="font-size:11.5px; font-weight:700; color:#475569; white-space:nowrap;">' + totalBarisTampil + ' baris</span>' +
                    '</div>' +
                    '<div style="overflow-x:auto;"><table class="excel-table" style="min-width:880px;"><thead><tr>' +
                        '<th style="width:68px; text-align:center;">Kode ATP</th>' +
                        '<th style="width:220px; text-align:left;">Bab Utama &amp; Sub-Bab</th>' +
                        '<th style="width:118px; text-align:center;">Semester</th>' +
                        '<th style="text-align:left;">TP (Bab) / IKTP (Sub-Bab)</th>' +
                        '<th style="text-align:left;">Alur ATP / Fokus Pertemuan</th>' +
                    '</tr></thead><tbody>' +
                        (tbodyHtml || '<tr><td colspan="5" style="padding:20px; text-align:center; color:#64748b;">Tidak ada Bab / Sub-Bab yang cocok dengan filter ini.</td></tr>') +
                    '</tbody></table></div>' +
                '</div>';

            requestAnimationFrame(window.daAutoFitSemuaTextarea);
            return;
        }

        // TAB 3: PROTA & PROMES TERKELOMPOK PER KELAS (X, XI, XII) + HIERARKI SUB-BAB
        if (tab === 'prota') {
            let semuaBab = window.daAmbilSemuaBabRuangMateri(Boolean(window.DOC_ADMIN_STATE.tampilSubBabProta));
            let kelasTersedia = DA_URUTAN_KELAS.filter(function(k) {
                return semuaBab.some(function(b) { return b.kelas === k; });
            });
            let filterKls = window.DOC_ADMIN_STATE.filterKelas || 'Semua';
            let filterSem = window.DOC_ADMIN_STATE.filterSemester || 'I (Ganjil)';
            let kelasDitampilkan = (filterKls === 'Semua')
                ? kelasTersedia
                : kelasTersedia.filter(function(k) { return k === filterKls; });

            let totalSemuaBabUtama = semuaBab.filter(function(b) {
                return !b.isSubHalaman && (filterKls === 'Semua' || b.kelas === filterKls);
            }).length;

            // 1. TABEL PROTA DIKELOMPOKKAN PER KELAS
            let protaTbodyHtml = '';
            kelasDitampilkan.forEach(function(klsName) {
                let daftarKls = semuaBab.filter(function(b) { return b.kelas === klsName; });
                if (daftarKls.length === 0) return;

                let faseKls = klsName.indexOf('X (') === 0 ? 'E' : 'F';
                let jpGanjilKls = 0, jpGenapKls = 0;

                protaTbodyHtml +=
                    '<tr style="background:#0b3954; color:#f1c40f;">' +
                        '<td colspan="5" style="text-align:left; font-weight:900; font-size:12.5px; padding:8px 10px;">📚 KELAS ' + daEsc(klsName.toUpperCase()) + ' — FASE ' + faseKls + '</td>' +
                    '</tr>';

                daftarKls.forEach(function(b) {
                    let jp = Number(b.totalJP) || 0;
                    let semNow = b.semester || 'I (Ganjil)';
                    if (String(semNow).indexOf('Genap') !== -1) jpGenapKls += jp;
                    else jpGanjilKls += jp;

                    let safeKey = daEsc(b.pageKey).replace(/'/g, "\\'");
                    let safeJudul = daEsc(b.judulHalaman).replace(/'/g, "\\'");
                    let safeKls = daEsc(b.kelas).replace(/'/g, "\\'");
                    let safeFase = daEsc(b.fase).replace(/'/g, "\\'");

                    let lvl = Number(b.level) || 0;
                    let indentPx = lvl * 22;
                    let prefixTree = lvl > 0 ? '<span style="color:#64748b; margin-right:5px;">└─</span>' : '';
                    let bgRow = lvl === 0 ? '#ffffff' : '#f8fafc';
                    let titleStyle = lvl === 0 ? 'font-weight:800; color:#0f172a;' : 'font-weight:600; color:#475569; font-size:12px;';

                    let semCell = lvl === 0
                        ? '<select class="da-inline-sel" onchange="window.daEditCepatBabDariProta(\'' + safeKey + '\', \'' + safeJudul + '\', \'' + safeKls + '\', \'' + safeFase + '\', \'semester\', this.value)">' +
                              '<option value="I (Ganjil)"' + (semNow.indexOf('Genap') === -1 ? ' selected' : '') + '>I (Ganjil)</option>' +
                              '<option value="II (Genap)"' + (semNow.indexOf('Genap') !== -1 ? ' selected' : '') + '>II (Genap)</option>' +
                          '</select>'
                        : '<span style="font-size:11px; color:#64748b;">↳ ' + daEsc(semNow) + '</span>';

                    protaTbodyHtml +=
                        '<tr style="background:' + bgRow + ';">' +
                            '<td style="text-align:center; font-weight:' + (lvl === 0 ? '800' : '600') + '; color:' + (lvl === 0 ? '#0b3954' : '#64748b') + ';">' + daEsc(b.kodeHierarki || '-') + '</td>' +
                            '<td style="text-align:left; padding-left:' + (10 + indentPx) + 'px; ' + titleStyle + '">' + prefixTree + daEsc(b.judulHalaman) + '</td>' +
                            '<td style="text-align:center;">' + semCell + '</td>' +
                            '<td style="text-align:center;"><input type="number" class="da-num-cell" min="0" max="60" value="' + jp + '" onchange="window.daEditCepatBabDariProta(\'' + safeKey + '\', \'' + safeJudul + '\', \'' + safeKls + '\', \'' + safeFase + '\', \'totalJP\', this.value)"></td>' +
                            '<td style="text-align:center; font-size:11px;">' + (b.belumDisimpanDiHalaman ? '<span style="color:#d97706;">Menu</span>' : '<span style="color:#15803d; font-weight:700;">✅ Terdesain</span>') + '</td>' +
                        '</tr>';
                });

                protaTbodyHtml +=
                    '<tr style="background:#eef6fb; font-weight:800; font-size:11.5px;">' +
                        '<td colspan="3" style="text-align:right; color:#0b3954;">Subtotal JP Kelas ' + daEsc(klsName) + ' (Ganjil: ' + jpGanjilKls + ' JP • Genap: ' + jpGenapKls + ' JP)</td>' +
                        '<td style="text-align:center; color:#15803d;">' + (jpGanjilKls + jpGenapKls) + ' JP</td>' +
                        '<td></td>' +
                    '</tr>';
            });

            // 2. MATRIKS PROMES DIKELOMPOKKAN PER KELAS (X, XI, XII) + HIERARKI SUB-BAB
            let isGenap = filterSem.indexOf('Genap') !== -1;
            let kaldikSem = window.DOC_ADMIN_STATE.kaldik[isGenap ? 'genap' : 'ganjil'] || [];

            let promesHead1 = '<th rowspan="2" style="width:46px; text-align:center;">No</th><th rowspan="2" style="min-width:210px; text-align:left;">Bab &amp; Sub-Bab</th><th rowspan="2" style="width:45px;">JP</th>';
            let promesHead2 = '';
            let totalKolMinggu = 0;
            kaldikSem.forEach(function(bl) {
                let mCount = Math.max(4, Math.min(5, Number(bl.jumlahMinggu) || 4));
                totalKolMinggu += mCount;
                promesHead1 += '<th colspan="' + mCount + '">' + daEsc(bl.bulan.substring(0, 3)) + '</th>';
                for (let m = 1; m <= mCount; m++) promesHead2 += '<th style="width:24px; font-size:10px;">' + m + '</th>';
            });

            let promesBlokPerKelasHtml = '';
            kelasDitampilkan.forEach(function(klsName) {
                let babSemKls = semuaBab.filter(function(b) {
                    return b.kelas === klsName && ((String(b.semester || 'I (Ganjil)').indexOf('Genap') !== -1) === isGenap);
                });
                let faseKls = klsName.indexOf('X (') === 0 ? 'E' : 'F';
                let subJPSem = 0;

                let rowsKls = babSemKls.map(function(b) {
                    let jp = Number(b.totalJP) || 0;
                    subJPSem += jp;
                    let lvl = Number(b.level) || 0;
                    let indentPx = lvl * 18;
                    let prefix = lvl > 0 ? '<span style="color:#64748b; margin-right:4px;">└─</span>' : '';
                    let rowBg = lvl === 0 ? '#ffffff' : '#f8fafc';

                    let tds = '<td style="text-align:center; font-weight:' + (lvl === 0 ? '800' : '600') + '; background:' + rowBg + ';">' + daEsc(b.kodeHierarki || '-') + '</td>' +
                        '<td style="text-align:left; padding-left:' + (8 + indentPx) + 'px; font-weight:' + (lvl === 0 ? '800' : '600') + '; color:' + (lvl === 0 ? '#0f172a' : '#475569') + '; background:' + rowBg + ';">' + prefix + daEsc(b.judulHalaman) + '</td>' +
                        '<td style="text-align:center; font-weight:800; background:' + rowBg + ';">' + jp + '</td>';

                    kaldikSem.forEach(function(bl) {
                        let mCount = Math.max(4, Math.min(5, Number(bl.jumlahMinggu) || 4));
                        for (let m = 1; m <= mCount; m++) {
                            let k = b.pageKey + '::' + bl.bulan + '::' + m;
                            let val = window.DOC_ADMIN_STATE.promesMarks[k] || '';
                            let bg = val === 'P' ? '#22c55e' : (val === 'U' ? '#f59e0b' : (val === 'L' ? '#ef4444' : rowBg));
                            let col = val ? '#ffffff' : '#94a3b8';
                            tds += '<td onclick="window.daTogglePromesCell(\'' + daEsc(b.pageKey) + '\', \'' + daEsc(bl.bulan) + '\', ' + m + ')" style="cursor:pointer; text-align:center; font-weight:900; font-size:10px; background:' + bg + '; color:' + col + '; user-select:none;" title="Klik: P (Belajar) -> U (Ujian) -> L (Libur)">' + (val || '·') + '</td>';
                        }
                    });
                    return '<tr>' + tds + '</tr>';
                }).join('');

                promesBlokPerKelasHtml +=
                    '<div style="margin-bottom:14px;">' +
                        '<div style="background:#0b3954; color:#f1c40f; font-size:12px; font-weight:900; padding:6px 10px; border-radius:6px 6px 0 0; display:flex; justify-content:space-between; align-items:center;">' +
                            '<span>🗓️ PROMES KELAS ' + daEsc(klsName.toUpperCase()) + ' (FASE ' + faseKls + ') — ' + daEsc(filterSem.toUpperCase()) + '</span>' +
                            '<span>Total: ' + subJPSem + ' JP</span>' +
                        '</div>' +
                        '<div style="overflow-x:auto;"><table class="excel-table" style="font-size:11px;"><thead><tr>' + promesHead1 + '</tr><tr>' + promesHead2 + '</tr></thead><tbody>' +
                            (rowsKls || '<tr><td colspan="' + (3 + totalKolMinggu) + '" style="padding:12px; text-align:center; color:#64748b;">Belum ada bab Kelas ' + daEsc(klsName) + ' di semester ini. Ubah dropdown Semester di tabel Prota di atas.</td></tr>') +
                        '</tbody></table></div>' +
                    '</div>';
            });

            stage.innerHTML =
                '<div class="da-card">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">' +
                        '<div class="da-card-title" style="margin:0; border:none; padding:0;">📋 Program Tahunan (Prota) Per Kelas — Khusus Isi Kelas X, XI, XII (' + totalSemuaBabUtama + ' Bab Utama)</div>' +
                        '<div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">' +
                            '<button type="button" class="da-mini-action" style="background:#475569;" onclick="window.daCekDiagnosaStrukturMenu()">🔍 Cek Menu</button>' +
                            '<label style="font-size:11.5px; font-weight:700; display:flex; align-items:center; gap:4px; cursor:pointer;"><input type="checkbox" ' + (window.DOC_ADMIN_STATE.tampilSubBabProta ? 'checked' : '') + ' onchange="window.DOC_ADMIN_STATE.tampilSubBabProta=this.checked; window.daRenderTab();"> Tampilkan Hierarki Sub-Bab</label>' +
                            '<select class="input-box da-inp" style="margin:0 !important; width:auto;" onchange="window.DOC_ADMIN_STATE.filterKelas=this.value; window.daRenderTab();">' +
                                '<option value="Semua"' + (filterKls === 'Semua' ? ' selected' : '') + '>Semua Kelas (X – XII)</option>' +
                                kelasTersedia.map(function(k) { return '<option value="' + daEsc(k) + '"' + (filterKls === k ? ' selected' : '') + '>Kelas ' + daEsc(k) + '</option>'; }).join('') +
                            '</select>' +
                        '</div>' +
                    '</div>' +
                    '<div style="overflow-x:auto;"><table class="excel-table"><thead><tr><th style="width:58px;">No</th><th style="text-align:left;">Bab Utama &amp; Hierarki Sub-Bab</th><th style="width:120px;">Semester</th><th style="width:72px;">JP</th><th style="width:95px;">Status</th></tr></thead><tbody>' +
                        (protaTbodyHtml || '<tr><td colspan="5" style="padding:18px; text-align:center; color:#64748b;">Belum ditemukan bab di dalam menu Kelas X, Kelas XI, atau Kelas XII.</td></tr>') +
                    '</tbody></table></div>' +
                '</div>' +

                '<div class="da-card">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">' +
                        '<div class="da-card-title" style="margin:0; border:none; padding:0;">🗓️ Matriks Program Semester (Promes) Per Kelas — Klik Kotak Minggu</div>' +
                        '<select class="input-box da-inp" style="margin:0 !important; width:auto;" onchange="window.DOC_ADMIN_STATE.filterSemester=this.value; window.daRenderTab();">' +
                            '<option value="I (Ganjil)"' + (!isGenap ? ' selected' : '') + '>Semester I (Ganjil)</option>' +
                            '<option value="II (Genap)"' + (isGenap ? ' selected' : '') + '>Semester II (Genap)</option>' +
                        '</select>' +
                    '</div>' +
                    '<div style="font-size:11px; color:#475569; margin-bottom:10px;">Klik kotak minggu: <b style="color:#16a34a;">P = Pembelajaran</b> • <b style="color:#d97706;">U = Asesmen/Ujian</b> • <b style="color:#dc2626;">L = Libur/Jeda</b></div>' +
                    (promesBlokPerKelasHtml || '<div style="padding:16px; text-align:center; color:#64748b;">Belum ada bab pada Kelas X–XII.</div>') +
                '</div>';
            return;
        }

        // TAB 3: LIVE PREVIEW & EXPORT
        let semuaBab = window.daAmbilSemuaBabRuangMateri(true);
        let daftarBabUtama = semuaBab.filter(function(b) { return b.tipeNode === 'bab'; });
        let st = window.DOC_ADMIN_STATE;

        // Jika selectedBabKey adalah Sub-Bab, arahkan otomatis ke Bab Induknya (1 Modul Ajar = 1 Bab)
        let curNodeSel = semuaBab.find(function(b) { return b.pageKey === st.selectedBabKey; });
        if (curNodeSel && curNodeSel.tipeNode === 'subbab' && curNodeSel.indukKey) {
            st.selectedBabKey = curNodeSel.indukKey;
        }
        if ((!st.selectedBabKey || !daftarBabUtama.some(function(b) { return b.pageKey === st.selectedBabKey; })) && daftarBabUtama.length > 0) {
            let curInfo = (typeof window.ckDeteksiInfoHalamanAktif === 'function' && !window.ckApakahHome()) ? window.ckDeteksiInfoHalamanAktif() : null;
            let keyCari = (curInfo && curInfo.indukKey) ? curInfo.indukKey : (curInfo ? curInfo.pageKey : '');
            let matchCur = keyCari && daftarBabUtama.find(function(b) { return b.pageKey === keyCari; });
            st.selectedBabKey = matchCur ? matchCur.pageKey : daftarBabUtama[0].pageKey;
        }

        let babOpts = daftarBabUtama.map(function(b) {
            let jSub = b.jumlahSubBab || 0;
            return '<option value="' + daEsc(b.pageKey) + '"' + (b.pageKey === st.selectedBabKey ? ' selected' : '') + '>' +
                daEsc('[' + b.kelas + '] ' + b.judulHalaman + ' (' + jSub + ' Sub-Bab)') +
            '</option>';
        }).join('');

        let subBabMilikBabIni = semuaBab.filter(function(b) {
            return b.tipeNode === 'subbab' && b.indukKey === st.selectedBabKey;
        });

        let mergeBoxes = subBabMilikBabIni.length > 0
            ? '<div style="font-size:11px; color:#0f172a; line-height:1.5;">' +
                '<div style="font-weight:800; color:#15803d; margin-bottom:4px;">✅ Otomatis Merangkum ' + subBabMilikBabIni.length + ' Pertemuan (Sub-Bab):</div>' +
                subBabMilikBabIni.map(function(sb, idx) {
                    return '<div>' + (idx + 1) + '. ' + daEsc(sb.judulHalaman) + ' <span style="color:#64748b;">(' + (Number(sb.totalJP) || 2) + ' JP)</span></div>';
                }).join('') +
              '</div>'
            : '<div style="font-size:11px; color:#64748b;">Belum ada Sub-Bab di dalam Bab ini. Tambahkan Sub-Bab di menu Pages untuk membentuk pertemuan-pertemuan otomatis.</div>';

        let daftarCek = [
            ['cover', 'Cover Resmi'], ['identitas', 'Identitas'], ['identifikasi', 'Identifikasi & DPL'],
            ['desain', 'Desain Deep Learning'], ['pengalaman', 'Pengalaman Belajar'], ['asesmenRingkas', 'Ringkasan & Pengesahan'],
            ['lampiranAsesmen', 'Lamp. A: Diagnostik/Formatif'], ['lampiranKisiKisi', 'Lamp. A: Kisi-Kisi'],
            ['lampiranSoal', 'Lamp. A: Naskah Soal'], ['lampiranLkpd', 'Lamp. B: LKPD Kasus'],
            ['lampiranRubrik', 'Lamp. C: Rubrik'], ['lampiranMateri', 'Lamp. D: Materi A4'],
            ['lampiranGlosarium', 'Lamp. E: Glosarium'], ['lampiranPustaka', 'Lamp. F: Daftar Pustaka']
        ];

        let opsiExportHtml = daftarCek.map(function(it) {
            let isOn = st.opsiExport[it[0]] !== false;
            return '<label class="da-mini-chk"><input type="checkbox" ' + (isOn ? 'checked' : '') + ' onchange="window.daToggleOpsiExport(\'' + it[0] + '\', this.checked)"> ' + it[1] + '</label>';
        }).join('');

        let panelKiriModul = st.previewDocType === 'modul_ajar'
            ? '<div style="margin-top:8px;"><label class="da-lbl">Pilih Bab Utama (Dari Ruang Belajar)</label><select class="input-box da-inp" onchange="window.daSetSelectedBab(this.value)">' + (babOpts || '<option value="">Belum ada bab</option>') + '</select></div>' +
              (mergeBoxes ? ('<div style="margin-top:6px;"><label class="da-lbl">Gabung Sub-Halaman ke 1 Bab Utuh (Opsional)</label><div class="da-scroll-checks">' + mergeBoxes + '</div></div>') : '') +
              '<div style="margin-top:8px;"><label class="da-lbl">Komponen yang Dicetak</label><div class="da-scroll-checks" style="max-height:140px;">' + opsiExportHtml + '</div></div>'
            : '<div style="margin-top:8px;"><label class="da-lbl">Filter Kelas</label><select class="input-box da-inp" onchange="window.DOC_ADMIN_STATE.filterKelas=this.value; window.daSegarkanIframePreview();">' +
                '<option value="Semua"' + (st.filterKelas === 'Semua' ? ' selected' : '') + '>Semua Kelas</option>' +
                Array.from(new Set(semuaBab.map(function(b) { return b.kelas; }).filter(Boolean))).map(function(k) {
                    return '<option value="' + daEsc(k) + '"' + (st.filterKelas === k ? ' selected' : '') + '>' + daEsc(k) + '</option>';
                }).join('') +
              '</select></div>' +
              (st.previewDocType === 'promes' ? ('<div style="margin-top:6px;"><label class="da-lbl">Semester Promes</label><select class="input-box da-inp" onchange="window.DOC_ADMIN_STATE.filterSemester=this.value; window.daSegarkanIframePreview();"><option value="I (Ganjil)"' + (st.filterSemester === 'I (Ganjil)' ? ' selected' : '') + '>Semester I (Ganjil)</option><option value="II (Genap)"' + (st.filterSemester === 'II (Genap)' ? ' selected' : '') + '>Semester II (Genap)</option></select></div>') : '');

        stage.innerHTML =
            '<div class="da-preview-split">' +
                '<div class="da-preview-sidebar">' +
                    '<div class="da-card" style="margin:0;">' +
                        '<div class="da-card-title">🖨️ Pengaturan Preview &amp; Export</div>' +
                        '<label class="da-lbl">Pilih Jenis Dokumen</label>' +
                        '<select class="input-box da-inp" onchange="window.daSetPreviewDocType(this.value)">' +
                            '<option value="modul_ajar"' + (st.previewDocType === 'modul_ajar' ? ' selected' : '') + '>📘 Modul Ajar Deep Learning (1 Bab Utuh)</option>' +
                            '<option value="kaldik"' + (st.previewDocType === 'kaldik' ? ' selected' : '') + '>📅 Kaldik, Minggu Efektif &amp; Kalender 12 Bln</option>' +
                            '<option value="cp_tp_atp"' + (st.previewDocType === 'cp_tp_atp' ? ' selected' : '') + '>🧭 Dokumen CP, TP &amp; ATP (Landscape)</option>' +
                            '<option value="prota"' + (st.previewDocType === 'prota' ? ' selected' : '') + '>📋 Program Tahunan (Prota)</option>' +
                            '<option value="promes"' + (st.previewDocType === 'promes' ? ' selected' : '') + '>🗓️ Program Semester (Promes Landscape)</option>' +
                        '</select>' +
                        panelKiriModul +
                        '<div style="display:flex; flex-direction:column; gap:7px; margin-top:12px;">' +
                            '<button type="button" class="btn-action" style="background:#0b3954; padding:10px;" onclick="window.daJalankanExport(\'pdf\')">🖨️ Print / Simpan PDF A4</button>' +
                            '<button type="button" class="btn-action" style="background:#2980b9; padding:10px;" onclick="window.daJalankanExport(\'word\')">📄 Export Microsoft Word (.doc)</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="da-preview-viewer">' +
                    '<div class="da-preview-bar"><span>👁️ Live Preview Dokumen (A4 • Logo Sekolah Kiri)</span><button type="button" class="da-mini-refresh" onclick="window.daSegarkanIframePreview()">🔄 Muat Ulang Preview</button></div>' +
                    '<iframe id="da-live-preview-iframe" class="da-preview-iframe"></iframe>' +
                '</div>' +
            '</div>';

        window.daSegarkanIframePreview();
    };

    // =========================================================================
    // 6. MODAL, CSS, & TOMBOL ADMIN MENU BAR
    // =========================================================================
    window.daPasangCSS = function() {
        if (document.getElementById('dokumen-admin-css')) return;
        let st = document.createElement('style');
        st.id = 'dokumen-admin-css';
        st.textContent =
            '.da-modal-box{width:1120px !important;max-width:96vw !important;height:91vh !important;max-height:91dvh !important;border-radius:14px !important;}' +
            '.da-tabs-bar{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 16px;background:#fff;border-bottom:1px solid #e2e8f0;flex-shrink:0;}' +
            '.da-tabs-left{display:flex;gap:6px;overflow-x:auto;}' +
            '.da-tab-btn{background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;padding:7px 14px;border-radius:20px;font-family:Poppins,sans-serif;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;}' +
            '.da-tab-btn.active{background:#0b3954;color:#f1c40f;border-color:#0b3954;}' +
            '.da-stage{flex:1;min-height:0;overflow-y:auto;padding:14px 16px;background:#f1f5f9;}' +
            '.da-card{background:#fff;border:1px solid #cbd5e1;border-radius:10px;padding:14px;margin-bottom:12px;}' +
            '.da-card-title{font-size:13.5px;font-weight:800;color:#0b3954;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;}' +
            '.da-lbl{display:block;font-size:11px;font-weight:700;color:#475569;margin-bottom:3px;}' +
            '.da-inp,.da-ta{margin-bottom:8px !important;padding:7px 10px !important;font-size:12.5px !important;}' +
            '.da-grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}' +
            '.da-grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}' +
            '.da-logo-bar{display:flex;align-items:center;gap:14px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:8px;padding:10px 12px;flex-wrap:wrap;}' +
            '.da-logo-bar img{height:52px;width:auto;object-fit:contain;}' +
            '.da-kaldik-box{overflow-x:auto;}' +
            '.da-kaldik-cal-section{margin-top:16px;padding-top:14px;border-top:2px dashed #cbd5e1;}' +
            '.da-event-form{display:grid;grid-template-columns:135px 135px 185px 1fr auto;gap:8px;align-items:end;background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:10px;}' +
            '.da-mini-action{color:#fff;border:none;border-radius:16px;padding:5px 11px;font-family:Poppins,sans-serif;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;}' +
            '.da-ev-list{display:flex;flex-direction:column;gap:5px;max-height:175px;overflow-y:auto;}' +
            '.da-ev-row{display:flex;justify-content:space-between;align-items:center;gap:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:6px 10px;}' +
            '.da-ev-badge{font-size:10px;font-weight:800;padding:2px 8px;border-radius:10px;white-space:nowrap;}' +
            '.da-ev-badge.is-libur{background:#fee2e2;color:#b91c1c;}' +
            '.da-ev-badge.is-acara{background:#f3e8ff;color:#6b21a8;}' +
            '.da-del-ev-btn{background:#fee2e2;color:#b91c1c;border:none;border-radius:50%;width:24px;height:24px;font-weight:800;cursor:pointer;flex-shrink:0;}' +
            '.kc-12-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;}' +
            '.kc-month-card{background:#fff;border:1px solid #cbd5e1;border-radius:8px;overflow:hidden;}' +
            '.kc-month-head{background:#0b3954;color:#f1c40f;font-size:11px;font-weight:800;text-align:center;padding:5px 4px;text-transform:uppercase;}' +
            '.kc-tbl{width:100%;border-collapse:collapse;table-layout:fixed;font-size:10.5px;}' +
            '.kc-tbl th{background:#f1f5f9;color:#475569;padding:3px 0;text-align:center;font-weight:800;border-bottom:1px solid #e2e8f0;}' +
            '.kc-tbl th.is-sun{color:#dc2626;}' +
            '.kc-tbl td{text-align:center;padding:3.5px 0;border:1px solid #f1f5f9;font-weight:700;color:#1e293b;}' +
            '.kc-day{cursor:pointer;transition:background 0.12s;}' +
            '.kc-day:hover{background:#e0f2fe !important;}' +
            '.kc-day.is-sun{color:#dc2626;background:#fff5f5;}' +
            '.kc-day.is-libur{background:#dc2626 !important;color:#fff !important;border-radius:3px;}' +
            '.kc-day.is-acara{background:#7e22ce !important;color:#fff !important;border-radius:3px;}' +
            '.da-num-cell{width:48px;padding:3px;text-align:center;border:1px solid #cbd5e1;border-radius:4px;font-weight:700;}' +
            '.da-txt-cell{width:100%;box-sizing:border-box;padding:3px 6px;border:1px solid #cbd5e1;border-radius:4px;font-size:11px;}' +
            '.da-inline-sel{padding:3px 6px;border:1px solid #cbd5e1;border-radius:5px;font-size:11.5px;font-weight:700;background:#fff;color:#0b3954;}' +
            '.da-preview-split{display:grid;grid-template-columns:300px 1fr;gap:12px;height:100%;min-height:540px;}' +
            '.da-preview-viewer{display:flex;flex-direction:column;background:#cbd5e1;border:1.5px solid #94a3b8;border-radius:10px;overflow:hidden;min-height:540px;}' +
            '.da-preview-bar{background:#1e293b;color:#f8fafc;padding:7px 12px;display:flex;justify-content:space-between;align-items:center;font-size:11.5px;font-weight:700;}' +
            '.da-mini-refresh{background:#38bdf8;color:#0f172a;border:none;border-radius:12px;padding:3px 10px;font-size:11px;font-weight:800;cursor:pointer;}' +
            '.da-preview-iframe{flex:1;width:100%;border:none;background:#e2e8f0;}' +
            '.da-scroll-checks{max-height:110px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;padding:6px 8px;background:#f8fafc;display:flex;flex-direction:column;gap:4px;}' +
            '.da-mini-chk{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;color:#1e293b;cursor:pointer;}' +
            'body.dark-mode-active .da-stage{background:#0f172a !important;}' +
            'body.dark-mode-active .da-card,body.dark-mode-active .da-tabs-bar,body.dark-mode-active .kc-month-card{background:#1e293b !important;border-color:#334155 !important;color:#f1f5f9 !important;}' +
            'body.dark-mode-active .da-card-title,body.dark-mode-active .da-lbl,body.dark-mode-active .da-mini-chk,body.dark-mode-active .kc-tbl td{color:#f8fafc !important;}' +
            'body.dark-mode-active .da-scroll-checks,body.dark-mode-active .da-event-form,body.dark-mode-active .da-ev-row,body.dark-mode-active .da-logo-bar,body.dark-mode-active .kc-tbl th{background:#0f172a !important;border-color:#334155 !important;}' +
            '.da-tpatp-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;background:#f8fafc;border:1px solid #e2e8f0;padding:8px 10px;border-radius:8px;}' +
            '.da-tpatp-ta{width:100%;box-sizing:border-box;padding:7px 9px;border:1px solid #cbd5e1;border-radius:7px;font-family:Quicksand,Poppins,sans-serif;font-size:12px;font-weight:600;color:#0f172a;background:#fff;line-height:1.5;resize:none !important;overflow:hidden !important;min-height:40px;display:block;outline:none;}' +
            '.da-tpatp-ta:focus{border-color:#0284c7;box-shadow:0 0 0 2px rgba(2,132,199,0.16);}' +
            '.da-bab-iktp-preview{margin-top:6px;padding:7px 9px;background:#f8fafc;border:1px dashed #7dd3fc;border-radius:7px;font-size:11px;color:#1e293b;text-align:left;}' +
            'body.dark-mode-active .da-bab-iktp-preview{background:#0f172a !important;border-color:#0284c7 !important;color:#e2e8f0 !important;}' +
            '.da-node-tag{font-size:9.5px;font-weight:800;padding:2px 6px;border-radius:6px;white-space:nowrap;flex-shrink:0;margin-top:1px;}' +
            '.da-node-tag.is-bab{background:#0b3954;color:#fde047;}' +
            '.da-node-tag.is-sub{background:#e0f2fe;color:#0369a1;}' +
            'body.dark-mode-active .da-tpatp-toolbar{background:#0f172a !important;border-color:#334155 !important;}' +
            'body.dark-mode-active .da-tpatp-ta{background:#1e293b !important;border-color:#475569 !important;color:#f8fafc !important;}' +
            '@media(max-width:1024px){.kc-12-grid{grid-template-columns:repeat(3,minmax(0,1fr));}.da-event-form{grid-template-columns:1fr 1fr;}}' +
            '@media(max-width:900px){.da-grid-2,.da-grid-3,.da-preview-split{grid-template-columns:1fr !important;}.kc-12-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}';
        document.head.appendChild(st);
    };

    window.daPastikanModalAda = function() {
        let modal = document.getElementById('modal-dokumen-admin');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'modal-dokumen-admin';
        modal.className = 'modal-overlay';
        modal.style.zIndex = '9600';
        modal.onclick = function(e) { if (e.target === modal) window.tutupModalDokumenAdministrasi(); };
        modal.innerHTML =
            '<div class="modal-box da-modal-box">' +
                '<div class="modal-header" style="background:#0b3954; color:#fff; padding:12px 18px;">' +
                    '<div>' +
                        '<h3 style="margin:0; font-size:16px; color:#f1c40f;">📂 Dokumen Administrasi Guru</h3>' +
                        '<div style="font-size:11px; color:#cbd5e1;">Informasi Umum &amp; Kalender Pendidikan • Prota &amp; Promes (Ruang Belajar) • Preview &amp; Export</div>' +
                    '</div>' +
                    '<button type="button" class="close-btn" style="color:#fff;" onclick="window.tutupModalDokumenAdministrasi()">✕</button>' +
                '</div>' +
                '<div class="da-tabs-bar">' +
                    '<div class="da-tabs-left">' +
                        '<button type="button" class="da-tab-btn active" data-tab="umum" onclick="window.daPindahTab(\'umum\')">1. Informasi Umum &amp; Kaldik</button>' +
                        '<button type="button" class="da-tab-btn" data-tab="tp_atp" onclick="window.daPindahTab(\'tp_atp\')">2. 🧭 TP &amp; ATP (Sinkron)</button>' +
                        '<button type="button" class="da-tab-btn" data-tab="prota" onclick="window.daPindahTab(\'prota\')">3. 📋 Prota &amp; Promes</button>' +
                        '<button type="button" class="da-tab-btn" data-tab="preview" onclick="window.daPindahTab(\'preview\')">4. 👁️ Preview &amp; Export</button>' +
                    '</div>' +
                    '<button type="button" class="btn-action" style="background:#16a085; width:auto; padding:6px 14px; font-size:12px;" onclick="window.daSimpanKeCloud(false)">💾 Simpan Data Umum</button>' +
                '</div>' +
                '<div id="da-tab-stage" class="da-stage"></div>' +
            '</div>';
        document.body.appendChild(modal);
        return modal;
    };

    window.bukaModalDokumenAdministrasi = function(tabAwal, babKeyTarget) {
        if (sessionStorage.getItem('statusLogin') !== 'admin') {
            return alert('🔒 Dokumen Administrasi hanya dapat diakses pada Mode Guru/Admin.');
        }
        window.daPasangCSS();
        window.daMuatLokal();
        window.daPastikanModalAda();

        if (babKeyTarget) {
            window.DOC_ADMIN_STATE.selectedBabKey = babKeyTarget;
            window.DOC_ADMIN_STATE.previewDocType = 'modul_ajar';
        }
        if (tabAwal) window.DOC_ADMIN_STATE.activeTab = tabAwal;

        if (typeof window.bukaModal === 'function') window.bukaModal('modal-dokumen-admin');
        else document.getElementById('modal-dokumen-admin').style.display = 'flex';

        window.daPindahTab(window.DOC_ADMIN_STATE.activeTab || 'umum');

        if (!window.DOC_ADMIN_STATE.firebaseLoaded) {
            window.daSinkronDariFirebase(function() { window.daRenderTab(); });
        }
    };

    window.bukaModalModulAjar = window.bukaModalDokumenAdministrasi;

    window.tutupModalDokumenAdministrasi = function() {
        if (typeof window.tutupModal === 'function') window.tutupModal('modal-dokumen-admin');
        else {
            let m = document.getElementById('modal-dokumen-admin');
            if (m) m.style.display = 'none';
        }
        if (typeof window.ckRenderPanel === 'function') window.ckRenderPanel();
    };

    window.daPasangTombolAdminMenu = function() {
        let bar = document.getElementById('admin-menu-bar');
        if (!bar) return;
        let existing = document.getElementById('btn-admin-modul-ajar');
        if (existing) {
            existing.innerHTML = '📂 Dokumen Administrasi';
            existing.title = 'Informasi Umum, Kaldik, Prota, Promes, Preview & Export Modul Ajar';
            existing.onclick = function() { window.bukaModalDokumenAdministrasi(); };
            return;
        }
        let span = document.createElement('span');
        span.id = 'btn-admin-modul-ajar';
        span.innerHTML = '📂 Dokumen Administrasi';
        span.title = 'Informasi Umum, Kaldik, Prota, Promes, Preview & Export Modul Ajar';
        span.onclick = function() { window.bukaModalDokumenAdministrasi(); };
        bar.appendChild(span);
    };

    document.addEventListener('DOMContentLoaded', function() {
        window.daPasangCSS();
        window.daMuatLokal();
        window.daPasangTombolAdminMenu();
        setTimeout(window.daPasangTombolAdminMenu, 850);
    });
})();