/* =========================================================================
   PANEL DESAIN & ADMINISTRASI PERTEMUAN (KHUSUS RUANG SUB-BAB — ADMIN ONLY)
   - Layout bersih per kartu bagian (tanpa ruang kosong & tanpa teks terpotong)
   - Lebar sejajar presisi dengan Lembar A4 di bawahnya (mengikuti zoom)
   - Semua kotak isian fix tanpa gagang tarik & tinggi otomatis pas isi teks
   - Sinkron 2 arah real-time dengan Tab TP & ATP di Dokumen Administrasi
   ========================================================================= */

(function() {
    const CK_STORAGE_KEY = 'mahardika_cakupan_halaman_v2';

    window.MA_DAFTAR_DPL = window.MA_DAFTAR_DPL || [
        { kode: 'DPL 1', nama: 'Keimanan & Ketakwaan', defaultKet: 'Mengagumi kebesaran Tuhan melalui keteraturan sistem biologis dan kelestarian makhluk hidup.' },
        { kode: 'DPL 2', nama: 'Kewargaan', defaultKet: 'Menunjukkan kepedulian terhadap lingkungan sekitar, kearifan lokal, dan keberlanjutan ekosistem.' },
        { kode: 'DPL 3', nama: 'Penalaran Kritis', defaultKet: 'Menganalisis data pengamatan, fenomena biologis, dan mengevaluasi solusi ilmiah secara objektif.' },
        { kode: 'DPL 4', nama: 'Kreativitas', defaultKet: 'Merancang model, karya visual, atau solusi inovatif atas permasalahan kontekstual Biologi.' },
        { kode: 'DPL 5', nama: 'Kolaborasi', defaultKet: 'Bekerja sama secara aktif dalam praktikum, diskusi kelompok, dan saling memverifikasi data.' },
        { kode: 'DPL 6', nama: 'Kemandirian', defaultKet: 'Bertanggung jawab melakukan literasi, eksperimen, dan evaluasi diri secara mandiri.' },
        { kode: 'DPL 7', nama: 'Kesehatan', defaultKet: 'Menerapkan pemahaman biologis untuk menjaga kesehatan diri, kebersihan, dan kesejahteraan lingkungan.' },
        { kode: 'DPL 8', nama: 'Komunikasi', defaultKet: 'Menyajikan laporan hasil penyelidikan dan argumen ilmiah secara runtut, lugas, dan visual.' }
    ];

    window.CAKUPAN_HALAMAN_DATA = window.CAKUPAN_HALAMAN_DATA || {};
    window.CK_STATE = {
        activePageKey: '',
        activeRenderSig: '',
        activeMiniTab: 'identitas',
        isExpanded: false,
        firebaseLoaded: false,
        saveTimer: null
    };

    function ckEsc(str) {
        return String(str === undefined || str === null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function ckBersihSegmen(teks) {
        return String(teks || '')
            .replace(/\uFE0F/g, '')
            .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
            .replace(/[▸▾▼▶◀◄►⌄⌃❯›»→➔➜➡➤]/g, ' ')
            .replace(/[\u2190-\u21FF\u2790-\u27FF\u2B00-\u2BFF]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function ckParseKelasFase(teks) {
        let up = ckBersihSegmen(teks).toUpperCase();
        if (!up || up.length > 28 || /\bBAB\b/.test(up)) return null;
        if (/\b(?:XII|12)\b/.test(up)) return { kelas: 'XII (Dua Belas)', fase: 'F' };
        if (/\b(?:XI|11)\b/.test(up)) return { kelas: 'XI (Sebelas)', fase: 'F' };
        if (/\b(?:X|10)\b/.test(up)) return { kelas: 'X (Sepuluh)', fase: 'E' };
        return null;
    }

    window.ckSanitasiKey = function(raw) {
        let s = String(raw || '').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
        while (s.startsWith('_')) s = s.slice(1);
        while (s.endsWith('_')) s = s.slice(0, -1);
        return s || 'halaman_materi';
    };

    window.ckToast = function(pesan, isErr) {
        let old = document.getElementById('ck-toast-box');
        if (old) old.remove();
        let el = document.createElement('div');
        el.id = 'ck-toast-box';
        el.innerText = pesan;
        el.style.cssText = 'position:fixed; top:18px; left:50%; transform:translateX(-50%); z-index:10000999; padding:10px 20px; border-radius:30px; font-family:Poppins,sans-serif; font-size:12.5px; font-weight:700; color:#fff; box-shadow:0 8px 24px rgba(0,0,0,0.28); background:' + (isErr ? '#c0392b' : '#16a085') + ';';
        document.body.appendChild(el);
        setTimeout(function() { if (el.parentNode) el.remove(); }, 2600);
    };

    window.ckGetMenitPerJP = function() {
        if (window.DOC_ADMIN_STATE && window.DOC_ADMIN_STATE.umum) {
            return Number(window.DOC_ADMIN_STATE.umum.menitPerJP) || 45;
        }
        return 45;
    };

    window.ckBuatTemplatePertemuan = function(nomor, model, jp, tpSingkat) {
        let menitJP = window.ckGetMenitPerJP();
        let jmlJP = Number(jp) || 2;
        let totalMenit = jmlJP * menitJP;
        let mAwal = Math.round(totalMenit * 0.15);
        let mPenutup = Math.round(totalMenit * 0.15);
        let mInti = Math.max(20, totalMenit - mAwal - mPenutup);

        let modName = model || 'Discovery Learning';
        let metode = 'Observasi, Eksplorasi Visual, Diskusi Kelompok, dan Tanya Jawab';
        let awalTxt = '1. Doa, presensi, dan memastikan suasana kelas aman dan nyaman.\n' +
            '2. Menggembirakan: Guru memantik rasa ingin tahu murid lewat fenomena kontekstual atau kuis singkat.\n' +
            '3. Berkesadaran: Guru mengaitkan fenomena dengan konsep Biologi hari ini.\n' +
            '4. Bermakna: Menyampaikan manfaat nyata penguasaan materi dan Tujuan Pembelajaran.';

        let intiMemahami = '';
        let intiMengaplikasikan = '';
        let intiMerefleksi = '';

        if (modName.indexOf('Problem Based') !== -1 || modName === 'PBL') {
            metode = 'Studi Kasus, Diskusi Kelompok, dan Presentasi';
            intiMemahami = '1. Sintaks 1 (Orientasi Masalah): Guru menyajikan studi kasus kontekstual dan pertanyaan pemantik kritis.\n' +
                '2. Sintaks 2 (Mengorganisasi Murid): Murid dibagi kelompok heterogen untuk memetakan akar masalah dan peran penyelidikan.';
            intiMengaplikasikan = '3. Sintaks 3 (Membimbing Penyelidikan): Murid menggali data dari bahan ajar/LKPD dan menyusun solusi ilmiah (Kolaborasi, Penalaran Kritis).\n' +
                '4. Sintaks 4 (Menyajikan Karya): Kelompok mempresentasikan hasil analisis di depan kelas (Komunikasi).';
            intiMerefleksi = '5. Sintaks 5 (Menganalisis & Mengevaluasi): Guru bersama murid mengevaluasi ketepatan konsep, meluruskan miskonsepsi, dan menarik kesimpulan.';
        } else if (modName.indexOf('Project Based') !== -1 || modName === 'PjBL') {
            metode = 'Perancangan Proyek, Eksplorasi Digital/Praktikum, dan Gelar Karya';
            intiMemahami = '1. Sintaks 1 (Pertanyaan Mendasar): Guru mengajukan tantangan proyek berbasis konsep Biologi.\n' +
                '2. Sintaks 2 (Mendesain Perencanaan): Murid merancang konsep karya, alat/bahan, dan pembagian peran tim (Kreativitas, Kolaborasi).';
            intiMengaplikasikan = '3. Sintaks 3 (Menyusun Jadwal): Murid menyepakati lini masa pengerjaan.\n' +
                '4. Sintaks 4 (Memonitor Kemajuan): Murid membuat produk dengan bimbingan guru.\n' +
                '5. Sintaks 5 (Menguji Hasil): Kelompok memamerkan dan mempresentasikan karyanya (Komunikasi).';
            intiMerefleksi = '6. Sintaks 6 (Evaluasi Pengalaman): Murid dan guru merefleksikan proses kerja tim dan ketepatan konsep ilmiah pada produk.';
        } else if (modName.indexOf('Asesmen Sumatif') !== -1) {
            metode = 'Tes Tertulis Mandiri / CBT';
            intiMemahami = '1. Guru menjelaskan aturan pengerjaan Asesmen Sumatif secara tenang dan suportif.';
            intiMengaplikasikan = '2. Murid mengerjakan Asesmen Sumatif secara mandiri dengan kejujuran dan penalaran kritis (Kemandirian).';
            intiMerefleksi = '3. Murid memeriksa ketelitian jawaban sebelum mengumpulkan hasil tes.';
        } else {
            intiMemahami = '1. Sintaks 1 (Stimulation): Guru menayangkan gambar/video fenomena biologis terkait topik.\n' +
                '2. Sintaks 2 (Problem Statement): Murid merumuskan pertanyaan penyelidikan dan hipotesis awal (Penalaran Kritis).';
            intiMengaplikasikan = '3. Sintaks 3 (Data Collection): Murid mengumpulkan data lewat bahan ajar, pengamatan, atau praktikum (Kemandirian).\n' +
                '4. Sintaks 4 (Data Processing): Murid mengolah data dan berdiskusi dalam kelompok (Kolaborasi).';
            intiMerefleksi = '5. Sintaks 5 & 6 (Verification & Generalization): Murid memverifikasi temuan dengan teori ilmiah dan menyimpulkan konsep utama.';
        }

        let penutupTxt = '1. Guru dan murid menyimpulkan poin utama pembelajaran hari ini.\n' +
            '2. Asesmen formatif singkat dan refleksi diri murid.\n' +
            '3. Penyampaian agenda pertemuan berikutnya dan doa penutup.';

        return {
            pertemuanKe: nomor || 1,
            model: modName,
            metode: metode,
            tp: tpSingkat || 'Mencapai Tujuan Pembelajaran pertemuan ini.',
            jp: jmlJP,
            alokasiTeks: jmlJP + ' JP (' + totalMenit + ' Menit)',
            awalMenit: mAwal,
            awalIsi: awalTxt,
            intiMenit: mInti,
            intiMemahami: intiMemahami,
            intiMengaplikasikan: intiMengaplikasikan,
            intiMerefleksi: intiMerefleksi,
            penutupMenit: mPenutup,
            penutupIsi: penutupTxt
        };
    };

    // =========================================================================
    // 1. DETEKSI MODE EDIT ADMIN & HIERARKI HALAMAN (PRIORITAS window.pagesData)
    // =========================================================================
    window.ckApakahHome = function() {
        let slug = String((new URLSearchParams(window.location.search).get('bab')) || window.babAktif || 'home').trim().toLowerCase();
        if (slug && slug !== 'home') return false;
        return true;
    };

    window.ckApakahAdminEditAktif = function() {
        let isAdmin = (typeof window.isAdminSession === 'function')
            ? window.isAdminSession()
            : (sessionStorage.getItem('statusLogin') === 'admin');
        if (!isAdmin) return false;
        if (sessionStorage.getItem('previewMode') === 'true') return false;

        let b = document.body;
        if (b.classList.contains('drawing-mode-active') || b.classList.contains('strict-mode-active')) return false;
        return b.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    };

    window.ckDeteksiInfoHalamanAktif = function() {
        let slugAktif = String((new URLSearchParams(window.location.search).get('bab')) || window.babAktif || '').trim();
        let pageKey = window.ckSanitasiKey(slugAktif || 'halaman_materi');

        if (Array.isArray(window.pagesData) && window.pagesData.length > 0 && slugAktif) {
            let targetIdx = window.pagesData.findIndex(function(p) {
                return p && String(p.slug || '').trim().toLowerCase() === slugAktif.toLowerCase();
            });

            if (targetIdx > -1) {
                let targetPage = window.pagesData[targetIdx];
                let rantai = [targetPage];
                let curLvl = Number(targetPage.level) || 0;

                for (let i = targetIdx - 1; i >= 0; i--) {
                    let p = window.pagesData[i];
                    let pLvl = Number(p.level) || 0;
                    if (pLvl < curLvl) {
                        rantai.unshift(p);
                        curLvl = pLvl;
                    }
                    if (curLvl === 0) break;
                }

                let rootNode = rantai[0];
                let infoKls = ckParseKelasFase(rootNode ? rootNode.title : '');
                let lvlTarget = Number(targetPage.level) || 0;

                if (infoKls) {
                    if (lvlTarget === 0) {
                        return { pageKey: pageKey, judul: ckBersihSegmen(targetPage.title), breadcrumb: ckBersihSegmen(targetPage.title), kelasAuto: infoKls.kelas, faseAuto: infoKls.fase, tipeNode: 'kelas', isSubHalaman: false, indukBab: '', indukKey: '', urutanPertemuan: 0, totalSubBabInduk: 0, sumberAkurat: true };
                    }
                    if (lvlTarget === 1) {
                        return { pageKey: pageKey, judul: ckBersihSegmen(targetPage.title), breadcrumb: rantai.map(function(x) { return ckBersihSegmen(x.title); }).join(' > '), kelasAuto: infoKls.kelas, faseAuto: infoKls.fase, tipeNode: 'bab', isSubHalaman: false, indukBab: '', indukKey: '', urutanPertemuan: 0, totalSubBabInduk: 0, sumberAkurat: true };
                    }

                    let babNode = rantai[1] || rantai[0];
                    let babIdx = window.pagesData.indexOf(babNode);
                    let urutanPt = 1;
                    let totalSub = 0;

                    if (babIdx > -1) {
                        let babLvl = Number(babNode.level) || 1;
                        for (let j = babIdx + 1; j < window.pagesData.length; j++) {
                            let cand = window.pagesData[j];
                            let cLvl = Number(cand.level) || 0;
                            if (cLvl <= babLvl) break;
                            if (cand.hidden || cand.isLockedHidden) continue;
                            totalSub++;
                            if (j === targetIdx) urutanPt = totalSub;
                        }
                    }

                    return {
                        pageKey: pageKey,
                        judul: ckBersihSegmen(targetPage.title),
                        breadcrumb: rantai.map(function(x) { return ckBersihSegmen(x.title); }).join(' > '),
                        kelasAuto: infoKls.kelas,
                        faseAuto: infoKls.fase,
                        tipeNode: 'subbab',
                        isSubHalaman: true,
                        indukBab: ckBersihSegmen(babNode.title),
                        indukKey: window.ckSanitasiKey(babNode.slug || babNode.title),
                        urutanPertemuan: urutanPt || 1,
                        totalSubBabInduk: totalSub || 1,
                        sumberAkurat: true
                    };
                }
            }
        }

        let bcEl = document.getElementById('bottom-breadcrumb');
        let parts = [];
        if (bcEl) {
            Array.from(bcEl.querySelectorAll('span')).forEach(function(sp) {
                let t = ckBersihSegmen(sp.textContent || '');
                if (t) parts.push(t);
            });
        }

        let klsDariBC = parts.length > 0 ? ckParseKelasFase(parts[0]) : null;
        if (klsDariBC && parts.length >= 3) {
            return {
                pageKey: pageKey,
                judul: parts[parts.length - 1],
                breadcrumb: parts.join(' > '),
                kelasAuto: klsDariBC.kelas,
                faseAuto: klsDariBC.fase,
                tipeNode: 'subbab',
                isSubHalaman: true,
                indukBab: parts[1],
                indukKey: window.ckSanitasiKey(parts[1]),
                urutanPertemuan: 1,
                totalSubBabInduk: 1,
                sumberAkurat: true
            };
        }

        return {
            pageKey: pageKey,
            judul: parts.length > 0 ? parts[parts.length - 1] : pageKey,
            breadcrumb: parts.join(' > '),
            kelasAuto: klsDariBC ? klsDariBC.kelas : 'X (Sepuluh)',
            faseAuto: klsDariBC ? klsDariBC.fase : 'E',
            tipeNode: (klsDariBC && parts.length === 1) ? 'kelas' : 'bab',
            isSubHalaman: false,
            indukBab: '',
            indukKey: '',
            urutanPertemuan: 0,
            totalSubBabInduk: 0,
            sumberAkurat: false
        };
    };

    window.ckAmbilSnapshotLembarA4 = function() {
        let lembarList = [];
        let glosMap = {};
        document.querySelectorAll('#blocks-container > .block-wrapper').forEach(function(wrap) {
            let cb = wrap.querySelector('.content-block');
            if (!cb) return;
            let tipe = wrap.getAttribute('data-sheet-type') || (typeof window.a4DeteksiTipeBlok === 'function' ? window.a4DeteksiTipeBlok(cb, wrap) : 'a4');
            if (tipe !== 'a4' || cb.querySelector('.quiz-container')) return;

            let clone = cb.cloneNode(true);
            clone.querySelectorAll('.a4-type-meta, .block-controls, .btn-add-block-below, .btn-collapse-bottom-right, .drawing-layer, .draw-float-layer, .table-controls, .image-controls, script, style').forEach(function(el) {
                el.remove();
            });
            clone.querySelectorAll('.glossary-term').forEach(function(sp) {
                let ist = (sp.innerText || '').trim();
                let def = sp.getAttribute('data-penjelasan') || sp.getAttribute('data-def') || sp.getAttribute('title') || '';
                if (ist) glosMap[ist.toLowerCase()] = { istilah: ist, definisi: def };
            });

            let bersih = clone.innerHTML.trim();
            if (bersih && bersih.replace(/<[^>]*>/g, '').trim().length > 0) lembarList.push(bersih);
        });

        return {
            jumlahLembar: lembarList.length,
            htmlGabungan: lembarList.join('<hr style="border:none; border-top:1px dashed #cbd5e1; margin:12px 0;">'),
            glosarium: Object.values(glosMap)
        };
    };

    window.ckBuatDefaultRecord = function(info) {
        let dplMap = {};
        window.MA_DAFTAR_DPL.forEach(function(item) {
            let aktifAwal = (item.kode === 'DPL 3' || item.kode === 'DPL 5' || item.kode === 'DPL 8');
            dplMap[item.kode] = { aktif: aktifAwal, ket: item.defaultKet };
        });

        return {
            pageKey: info.pageKey,
            judulHalaman: info.judul,
            breadcrumb: info.breadcrumb || '',
            isSubHalaman: info.isSubHalaman !== false,
            indukBab: info.indukBab || '',
            indukKey: info.indukKey || '',
            kelas: info.kelasAuto || info.kelas || 'X (Sepuluh)',
            fase: info.faseAuto || info.fase || 'E',
            semester: info.semester || 'I (Ganjil)',
            materiPokok: info.judul || '',
            jumlahPertemuan: 1,
            totalJP: 2,
            alokasiWaktu: '1 Pertemuan (2 JP)',
            kesiapanSudah: 'Murid telah memahami konsep prasyarat dari pertemuan sebelumnya.',
            kesiapanBelum: 'Murid belum sepenuhnya menguasai konsep inti pada sub-bab ini.',
            karakteristikMateri: 'Materi konseptual dan kontekstual Biologi yang menuntut pengamatan dan penalaran kritis.',
            dpl: dplMap,
            tp: 'Murid mampu memahami dan menganalisis konsep utama ' + (info.judul || 'sub-bab ini') + ' secara ilmiah.',
            atp: 'Eksplorasi konsep, analisis data/kasus, dan refleksi materi ' + (info.judul || ''),
            lintasDisiplin: 'Kimia / Informatika / Bahasa Indonesia (sesuai konteks sub-bab).',
            modelPembelajaran: 'Discovery Learning',
            metodePembelajaran: 'Observasi, Diskusi Kelompok, Eksplorasi Visual, dan Tanya Jawab',
            pendekatan: 'Deep Learning (Berkesadaran, Bermakna, Menggembirakan)',
            modePembelajaran: 'Luring (Tatap Muka)',
            pertanyaanPemantik: '',
            kemitraan: 'Budaya sekolah aman dan nyaman serta portal belajar digital.',
            lingkunganFisik: 'Ruang kelas modular / Laboratorium Biologi.',
            lingkunganVirtual: 'Web pembelajaran sekolah.',
            budayaBelajar: 'Teliti, ingin tahu, kolaboratif, dan saling menghormati.',
            pemanfaatanDigital: 'Proyektor/LCD, modul interaktif web, dan bahan ajar digital.',
            pertemuan: [
                window.ckBuatTemplatePertemuan(info.urutanPertemuan || 1, 'Discovery Learning', 2, 'Memahami & menganalisis ' + (info.judul || 'materi pertemuan ini'))
            ],
            asesmen: {
                ringkasFormatif: 'Observasi diskusi kelompok, unjuk kerja LKPD, dan cek pemahaman lisan.',
                ringkasSumatif: 'Tes tertulis akhir bab (PG/PGK/Isian/Esai).',
                remedial: 'Pendampingan visual terarah dan latihan adaptif bertahap.',
                pengayaan: 'Eksplorasi studi kasus lanjutan / artikel ilmiah.',
                diagnostik: { tujuan: 'Memetakan kesiapan awal murid.', waktu: '10 menit awal pertemuan.', teknik: 'Tanya jawab singkat.', instrumen: '1. Pertanyaan prasyarat?', indikator: 'Ketepatan respon awal.', pedoman: 'Observasi lisan.', interpretasi: 'Paham Utuh / Perlu Scaffolding.', tindakLanjut: 'Pendampingan kelompok heterogen.' },
                formatifDetail: { tujuan: 'Memantau proses belajar secara langsung.', waktu: 'Selama kegiatan inti.', teknik: 'Observasi & LKPD.', instrumen: 'Ceklis observasi & rubrik.', indikator: 'Akurasi konsep & kolaborasi.', pedoman: 'Skala 1-4.', interpretasi: 'Dasar umpan balik langsung.', tindakLanjut: 'Klarifikasi miskonsepsi.' },
                sumberSoalTipe: '',
                sumberSoalKey: '',
                kkm: 75
            },
            lkpd: {
                judul: 'LKPD — ' + (info.judul || 'Pertemuan'),
                tujuan: 'Melatih analisis fenomena dan pemecahan masalah pada materi ' + (info.judul || '') + '.',
                langkah: '1. Bentuk kelompok 4-5 murid.\n2. Amati studi kasus dan lembar materi A4.\n3. Diskusikan dan isi tabel pengamatan.\n4. Presentasikan hasil kelompok.',
                kasusList: [
                    {
                        judul: 'Kasus: ' + (info.judul || 'Fenomena Kontekstual'),
                        gambarUrl: '',
                        narasi: 'Amati fenomena terkait ' + (info.judul || 'sub-bab ini') + ' dan analisislah penyebab, mekanisme, serta solusinya.',
                        kolomAmat: 'Identifikasi Masalah|Analisis Konsep Biologi|Bukti / Data|Solusi & Simpulan'
                    }
                ]
            },
            rubrik: {
                judulProyek: 'Rubrik Penilaian LKPD & Kinerja',
                kriteriaProyek: [
                    { nama: 'Akurasi Konsep Biologi', bobot: 40, s4: 'Sangat akurat & logis.', s3: 'Tepat dengan 1-2 detail kecil.', s2: 'Konsep dasar dipahami, ada kekeliruan mekanisme.', s1: 'Konsep belum tepat.' },
                    { nama: 'Kreativitas & Penyajian', bobot: 30, s4: 'Sangat rapi & informatif.', s3: 'Rapi dan mudah diikuti.', s2: 'Cukup rapi namun sederhana.', s1: 'Belum tuntas.' },
                    { nama: 'Kolaborasi & Komunikasi', bobot: 30, s4: 'Semua aktif, presentasi lugas.', s3: 'Sebagian besar aktif & runtut.', s2: 'Beberapa aktif, butuh pancingan.', s1: 'Pasif dalam tim.' }
                ]
            },
            glosarium: [],
            daftarPustaka: '',
            materiHtmlSnapshot: '',
            jumlahLembarSnapshot: 0,
            updatedAt: 0
        };
    };

    // =========================================================================
    // 2. PENYIMPANAN LOCALSTORAGE + FIREBASE REST
    // =========================================================================
    window.ckMuatLokal = function() {
        try {
            let raw = localStorage.getItem(CK_STORAGE_KEY);
            if (raw) {
                let obj = JSON.parse(raw);
                if (obj && typeof obj === 'object') window.CAKUPAN_HALAMAN_DATA = Object.assign({}, window.CAKUPAN_HALAMAN_DATA, obj);
            }
        } catch (e) {}
    };

    window.ckSimpanLokal = function() {
        try { localStorage.setItem(CK_STORAGE_KEY, JSON.stringify(window.CAKUPAN_HALAMAN_DATA)); } catch (e) {}
    };

    window.ckSinkronDariFirebase = function(onDone) {
        if (sessionStorage.getItem('statusLogin') !== 'admin') { if (onDone) onDone(); return; }
        let guruAktif = window.guruAktif || sessionStorage.getItem('guruTarget') || 'mahardika';
        if (typeof window.bacaDataRestFirebase !== 'function') { window.CK_STATE.firebaseLoaded = true; if (onDone) onDone(); return; }
        window.bacaDataRestFirebase('data_guru/' + guruAktif + '/cakupan_halaman_data', function(data) {
            if (data && typeof data === 'object') {
                Object.keys(data).forEach(function(k) {
                    if (k === 'home') return;
                    let remote = data[k], lokal = window.CAKUPAN_HALAMAN_DATA[k];
                    if (remote && typeof remote === 'object') {
                        if ((Number(remote.updatedAt) || 0) >= (lokal ? (Number(lokal.updatedAt) || 0) : -1)) {
                            window.CAKUPAN_HALAMAN_DATA[k] = remote;
                        }
                    }
                });
                window.ckSimpanLokal();
            }
            window.CK_STATE.firebaseLoaded = true;
            if (onDone) onDone();
        }, function() { window.CK_STATE.firebaseLoaded = true; if (onDone) onDone(); }, { ttlMs: 120000 });
    };

    window.ckPerbaruiSnapshotAktif = function(isToast) {
        if (window.ckApakahHome()) return;
        let info = window.ckDeteksiInfoHalamanAktif();
        if (info.tipeNode !== 'subbab') return;
        let rec = window.ckGetRecordAktif();
        let snap = window.ckAmbilSnapshotLembarA4();
        rec.materiHtmlSnapshot = snap.htmlGabungan;
        rec.jumlahLembarSnapshot = snap.jumlahLembar;

        let gMap = {};
        (rec.glosarium || []).forEach(function(g) { if (g && g.istilah) gMap[g.istilah.toLowerCase()] = g; });
        snap.glosarium.forEach(function(g) {
            let k = g.istilah.toLowerCase();
            if (!gMap[k]) rec.glosarium.push({ istilah: g.istilah, definisi: g.definisi || '' });
            else if (!gMap[k].definisi && g.definisi) gMap[k].definisi = g.definisi;
        });

        window.ckSimpanLokal();
        if (isToast) {
            window.ckRenderPanel();
            window.ckToast('📄 ' + snap.jumlahLembar + ' Lembar A4 & ' + snap.glosarium.length + ' istilah glosarium tersinkron!');
        }
    };

    window.ckSimpanHalamanKeCloud = function(pageKey, isSilent) {
        let rec = window.CAKUPAN_HALAMAN_DATA[pageKey];
        if (!rec) return;
        if (pageKey === window.CK_STATE.activePageKey && !window.ckApakahHome()) {
            let snap = window.ckAmbilSnapshotLembarA4();
            if (snap.jumlahLembar > 0) {
                rec.materiHtmlSnapshot = snap.htmlGabungan;
                rec.jumlahLembarSnapshot = snap.jumlahLembar;
            }
        }
        rec.updatedAt = Date.now();
        window.ckSimpanLokal();

        // Jika menyimpan Sub-Bab, ikut sinkronkan record TP & ATP Bab Induk ke cloud
        if (!isSilent && rec.isSubHalaman && rec.indukKey && window.CAKUPAN_HALAMAN_DATA[rec.indukKey] && rec.indukKey !== pageKey) {
            let babRec = window.CAKUPAN_HALAMAN_DATA[rec.indukKey];
            babRec.updatedAt = Date.now();
            if (typeof window.kirimNilaiUjianAmanKeDB === 'function') {
                window.kirimNilaiUjianAmanKeDB('cakupan_halaman_data/' + rec.indukKey, babRec, function() {}, function() {});
            }
        }

        if (typeof window.kirimNilaiUjianAmanKeDB === 'function') {
            window.kirimNilaiUjianAmanKeDB('cakupan_halaman_data/' + pageKey, rec, function() {
                if (!isSilent) window.ckToast('💾 Desain Pertemuan & TP/ATP Bab Induk tersimpan & tersinkron!');
            }, function() {
                if (!isSilent) window.ckToast('💾 Tersimpan di perangkat (cloud offline).');
            });
        } else if (!isSilent) {
            window.ckToast('💾 Desain Pertemuan & TP/ATP berhasil disimpan!');
        }
    };

    window.ckJadwalkanAutoSave = function(pageKey) {
        window.ckSimpanLokal();
        clearTimeout(window.CK_STATE.saveTimer);
        window.CK_STATE.saveTimer = setTimeout(function() {
            window.ckSimpanHalamanKeCloud(pageKey, true);
        }, 1200);
    };

    window.ckGetRecordBabInduk = function(infoOpt) {
        let info = infoOpt || window.ckDeteksiInfoHalamanAktif();
        let babKey = info && info.indukKey ? info.indukKey : '';
        if (!babKey) return null;
        if (!window.CAKUPAN_HALAMAN_DATA) window.CAKUPAN_HALAMAN_DATA = {};

        let babRec = window.CAKUPAN_HALAMAN_DATA[babKey];
        if (!babRec) {
            babRec = {
                pageKey: babKey,
                judulHalaman: info.indukBab || babKey,
                kelas: info.kelasAuto || 'X (Sepuluh)',
                fase: info.faseAuto || 'E',
                semester: 'I (Ganjil)',
                isSubHalaman: false,
                kodeAtp: '',
                tp: '',
                atp: '',
                updatedAt: 0
            };
            window.CAKUPAN_HALAMAN_DATA[babKey] = babRec;
        } else {
            babRec.pageKey = babKey;
            if (info.indukBab) babRec.judulHalaman = info.indukBab;
            if (info.sumberAkurat) {
                babRec.kelas = info.kelasAuto;
                babRec.fase = info.faseAuto;
            }
            if (babRec.tp === undefined) babRec.tp = '';
            if (babRec.atp === undefined) babRec.atp = '';
            if (babRec.kodeAtp === undefined) babRec.kodeAtp = '';
        }
        return babRec;
    };

    window._ckBabSaveTimer = null;
    window.ckSetBabIndukField = function(field, val) {
        let info = window.ckDeteksiInfoHalamanAktif();
        let babRec = window.ckGetRecordBabInduk(info);
        if (!babRec) return;
        babRec[field] = val;
        babRec.updatedAt = Date.now();
        window.ckSimpanLokal();

        clearTimeout(window._ckBabSaveTimer);
        window._ckBabSaveTimer = setTimeout(function() {
            window.ckSimpanHalamanKeCloud(babRec.pageKey, true);
        }, 1000);
    };

    window.ckBangunHtmlRantaiIktpBab = function(infoOpt) {
        let info = infoOpt || window.ckDeteksiInfoHalamanAktif();
        if (!info || !info.indukKey || typeof window.daAmbilSemuaBabRuangMateri !== 'function') return '';
        let semua = window.daAmbilSemuaBabRuangMateri(true);
        let subList = semua.filter(function(b) {
            return b.isSubHalaman && b.indukKey === info.indukKey;
        });
        if (subList.length === 0) return '';

        let baris = subList.map(function(sb, idx) {
            let isNow = sb.pageKey === info.pageKey;
            let teks = String((sb.iktp !== undefined && sb.iktp !== null) ? sb.iktp : (sb.tp || '')).replace(/^\d+[\.\)]\s*/, '').replace(/\r?\n/g, ' ').trim();
            return '<div style="padding:3px 6px; border-radius:6px; margin-top:2px; background:' + (isNow ? '#dbeafe' : 'transparent') + '; color:' + (isNow ? '#0b3954' : '#334155') + '; font-weight:' + (isNow ? '700' : '500') + ';">' +
                '<b>' + (idx + 1) + '.</b> ' +
                (teks ? ckEsc(teks) : '<span style="color:#94a3b8; font-style:italic;">IKTP belum diisi</span>') +
                ' <span style="font-size:10px; color:#0369a1;">[' + ckEsc(sb.judulHalaman) + (isNow ? ' • Sedang diedit' : '') + ']</span>' +
            '</div>';
        }).join('');

        return '<div class="ck-iktp-chain-box">' +
            '<div style="font-size:10.5px; font-weight:800; color:#0369a1; margin-bottom:3px;">🔗 Rincian IKTP Penyusun TP Bab Ini (Otomatis dari ' + subList.length + ' Sub-Bab):</div>' +
            baris +
        '</div>';
    };

    window.ckPerbaruiRantaiIktpBab = function() {
        let host = document.getElementById('ck-bab-iktp-chain');
        if (!host) return;
        host.innerHTML = window.ckBangunHtmlRantaiIktpBab();
    };

    window.ckGetRecordAktif = function() {
        let info = window.ckDeteksiInfoHalamanAktif();
        let rec = window.CAKUPAN_HALAMAN_DATA[info.pageKey];
        let def = window.ckBuatDefaultRecord(info);
        if (!rec) {
            rec = def;
            rec.iktp = def.tp;
            window.CAKUPAN_HALAMAN_DATA[info.pageKey] = rec;
        } else {
            Object.keys(def).forEach(function(k) {
                if (rec[k] === undefined || rec[k] === null) rec[k] = def[k];
            });
            // Migrasi otomatis: ketikan tp lama di Sub-Bab otomatis masuk ke iktp
            if (rec.iktp === undefined || rec.iktp === null) {
                rec.iktp = rec.tp || def.tp;
            }
            if (!Array.isArray(rec.pertemuan) || rec.pertemuan.length === 0) rec.pertemuan = def.pertemuan;
            if (!rec.asesmen) rec.asesmen = def.asesmen;
            if (!rec.lkpd) rec.lkpd = def.lkpd;
            if (!Array.isArray(rec.lkpd.kasusList)) rec.lkpd.kasusList = def.lkpd.kasusList;
            if (!rec.rubrik) rec.rubrik = def.rubrik;
            if (!Array.isArray(rec.rubrik.kriteriaProyek)) rec.rubrik.kriteriaProyek = def.rubrik.kriteriaProyek;
            if (!Array.isArray(rec.glosarium)) rec.glosarium = [];

            rec.pageKey = info.pageKey;
            rec.judulHalaman = info.judul;
            rec.breadcrumb = info.breadcrumb;
            rec.isSubHalaman = true;
            rec.indukBab = info.indukBab || rec.indukBab || '';
            rec.indukKey = info.indukKey || rec.indukKey || '';
            if (info.sumberAkurat) {
                rec.kelas = info.kelasAuto;
                rec.fase = info.faseAuto;
            }
        }
        rec.pertemuan[0].pertemuanKe = info.urutanPertemuan || 1;
        return rec;
    };

    // =========================================================================
    // 3. MUTATOR FIELD PERTEMUAN SUB-BAB (OTOMATIS SINKRON KE DOKUMEN ADMIN)
    // =========================================================================
    window.ckSetField = function(field, val) {
        let rec = window.ckGetRecordAktif();
        rec[field] = val;
        if (field === 'totalJP') {
            let jp = Number(val) || 2;
            rec.totalJP = jp;
            rec.jumlahPertemuan = 1;
            rec.alokasiWaktu = '1 Pertemuan (' + jp + ' JP)';
            if (rec.pertemuan && rec.pertemuan[0]) {
                rec.pertemuan[0].jp = jp;
                rec.pertemuan[0].alokasiTeks = jp + ' JP (' + (jp * window.ckGetMenitPerJP()) + ' Menit)';
            }
        }
        if (field === 'modelPembelajaran' && rec.pertemuan && rec.pertemuan[0]) rec.pertemuan[0].model = val;
        if (field === 'metodePembelajaran' && rec.pertemuan && rec.pertemuan[0]) rec.pertemuan[0].metode = val;
        if (field === 'iktp' || field === 'tp') {
            rec.iktp = val;
            rec.tp = val;
            if (rec.pertemuan && rec.pertemuan[0]) rec.pertemuan[0].tp = val;
            window.ckPerbaruiRantaiIktpBab();
        }

        window.ckPerbaruiStatusHeader();
        window.ckJadwalkanAutoSave(rec.pageKey);
    };

    window.ckSetPertemuanTunggal = function(field, val) {
        let rec = window.ckGetRecordAktif();
        if (!rec.pertemuan || !rec.pertemuan[0]) {
            rec.pertemuan = [window.ckBuatTemplatePertemuan(1, rec.modelPembelajaran, rec.totalJP, rec.tp)];
        }
        rec.pertemuan[0][field] = val;
        window.ckJadwalkanAutoSave(rec.pageKey);
    };

    window.ckIsiSintaksOtomatisSubBab = function() {
        let rec = window.ckGetRecordAktif();
        let info = window.ckDeteksiInfoHalamanAktif();
        rec.pertemuan = [window.ckBuatTemplatePertemuan(info.urutanPertemuan || 1, rec.modelPembelajaran, rec.totalJP, rec.tp)];
        window.ckJadwalkanAutoSave(rec.pageKey);
        window.ckRenderPanel();
        window.ckToast('⚡ Kerangka sintaks ' + rec.modelPembelajaran + ' diterapkan!');
    };

    window.ckSetNested = function(section, field, val) {
        let rec = window.ckGetRecordAktif();
        if (!rec[section]) rec[section] = {};
        rec[section][field] = val;
        window.ckJadwalkanAutoSave(rec.pageKey);
    };

    window.ckToggleDPL = function(kode, checked) {
        let rec = window.ckGetRecordAktif();
        if (!rec.dpl[kode]) rec.dpl[kode] = { aktif: false, ket: '' };
        rec.dpl[kode].aktif = Boolean(checked);
        let row = document.getElementById('ck-dpl-row-' + kode.replace(/\s+/g, ''));
        if (row) row.classList.toggle('is-active', Boolean(checked));
        window.ckPerbaruiStatusHeader();
        window.ckJadwalkanAutoSave(rec.pageKey);
    };

    window.ckSetKetDPL = function(kode, teks) {
        let rec = window.ckGetRecordAktif();
        if (!rec.dpl[kode]) rec.dpl[kode] = { aktif: true, ket: '' };
        rec.dpl[kode].ket = teks;
        window.ckJadwalkanAutoSave(rec.pageKey);
    };

    window.ckPilihSumberSoal = function(valGabung) {
        let rec = window.ckGetRecordAktif();
        if (!valGabung) { rec.asesmen.sumberSoalTipe = ''; rec.asesmen.sumberSoalKey = ''; }
        else {
            let sep = valGabung.indexOf('::');
            rec.asesmen.sumberSoalTipe = valGabung.substring(0, sep);
            rec.asesmen.sumberSoalKey = valGabung.substring(sep + 2);
        }
        window.ckJadwalkanAutoSave(rec.pageKey);
        window.ckRenderPanel();
    };

    window.ckAmbilDaftarPaketSoal = function() {
        let list = [];
        Object.keys(window.adminBankUjianData || {}).sort().forEach(function(k) {
            let item = window.adminBankUjianData[k];
            if (!item || !item.soal) return;
            let arr = Array.isArray(item.soal) ? item.soal : Object.values(item.soal);
            list.push({ tipe: 'ujian', key: k, label: '[Bank Ujian] ' + k + ' (' + arr.length + ' Soal)' });
        });
        Object.keys(window.adminBankLatihanData || {}).sort().forEach(function(k) {
            let item = window.adminBankLatihanData[k];
            if (!item || !item.soal) return;
            let arr = Array.isArray(item.soal) ? item.soal : Object.values(item.soal);
            list.push({ tipe: 'latihan', key: k, label: '[Bank Latihan] ' + (item.kelas || '') + ' - ' + (item.bab || k) + ' (' + arr.length + ' Soal)' });
        });
        return list;
    };

    window.ckTambahKasus = function() {
        let rec = window.ckGetRecordAktif();
        rec.lkpd.kasusList.push({ judul: 'Kasus ' + (rec.lkpd.kasusList.length + 1), gambarUrl: '', narasi: '', kolomAmat: 'Identifikasi Masalah|Analisis Biologi|Bukti Data|Solusi' });
        window.ckJadwalkanAutoSave(rec.pageKey);
        window.ckRenderPanel();
    };
    window.ckHapusKasus = function(i) { let r = window.ckGetRecordAktif(); r.lkpd.kasusList.splice(i, 1); window.ckJadwalkanAutoSave(r.pageKey); window.ckRenderPanel(); };
    window.ckSetKasus = function(i, f, v) { let r = window.ckGetRecordAktif(); if (r.lkpd.kasusList[i]) r.lkpd.kasusList[i][f] = v; window.ckJadwalkanAutoSave(r.pageKey); };
    window.ckUploadGambarKasus = function(idx, inputEl) {
        let file = inputEl && inputEl.files ? inputEl.files[0] : null;
        if (!file) return;
        let reader = new FileReader();
        reader.onload = function(ev) {
            let img = new Image();
            img.onload = function() {
                let scale = img.naturalWidth > 720 ? (720 / img.naturalWidth) : 1;
                let c = document.createElement('canvas');
                c.width = Math.round(img.naturalWidth * scale);
                c.height = Math.round(img.naturalHeight * scale);
                c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                window.ckSetKasus(idx, 'gambarUrl', c.toDataURL('image/jpeg', 0.78));
                window.ckRenderPanel();
                window.ckToast('🖼️ Gambar kasus terpasang!');
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };
    window.ckTambahGlosarium = function() { let r = window.ckGetRecordAktif(); r.glosarium.push({ istilah: '', definisi: '' }); window.ckJadwalkanAutoSave(r.pageKey); window.ckRenderPanel(); };
    window.ckHapusGlosarium = function(i) { let r = window.ckGetRecordAktif(); r.glosarium.splice(i, 1); window.ckJadwalkanAutoSave(r.pageKey); window.ckRenderPanel(); };
    window.ckSetGlosarium = function(i, f, v) { let r = window.ckGetRecordAktif(); if (r.glosarium[i]) r.glosarium[i][f] = v; window.ckJadwalkanAutoSave(r.pageKey); };

    // =========================================================================
    // 4. HYBRID AI KHUSUS 1 PERTEMUAN SUB-BAB (PROMPT <-> JSON)
    // =========================================================================
    window.ckSalinPromptAI = function() {
        let rec = window.ckGetRecordAktif();
        let info = window.ckDeteksiInfoHalamanAktif();
        window.ckPerbaruiSnapshotAktif(false);
        let umum = (window.DOC_ADMIN_STATE && window.DOC_ADMIN_STATE.umum) ? window.DOC_ADMIN_STATE.umum : {};
        let cpFase = (umum.cpPerFase && umum.cpPerFase[rec.fase]) ? umum.cpPerFase[rec.fase] : '';
        let catatan = ((document.getElementById('ck-ai-catatan') || {}).value || '').trim();

        let divTmp = document.createElement('div');
        divTmp.innerHTML = rec.materiHtmlSnapshot || '';
        let teksMateri = (divTmp.textContent || divTmp.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 4800);

        let skema = {
            totalJP: Number(rec.totalJP) || 2,
            materiPokok: 'Ringkasan fokus materi sub-bab ini',
            kesiapanSudah: 'Prasyarat yang sudah dipahami',
            kesiapanBelum: 'Hal yang belum dikuasai',
            tp: 'Tujuan Pembelajaran spesifik pertemuan ini',
            atp: 'Alur ringkas pertemuan ini',
            modelPembelajaran: 'Discovery Learning / PBL / PjBL',
            metodePembelajaran: 'Observasi, Diskusi Kelompok, Presentasi',
            pertanyaanPemantik: '1. Pertanyaan pemantik 1?\n2. Pertanyaan pemantik 2?',
            dpl: {
                'DPL 1': { aktif: false, ket: '' }, 'DPL 2': { aktif: false, ket: '' },
                'DPL 3': { aktif: true, ket: 'Alasan spesifik pertemuan ini' },
                'DPL 4': { aktif: true, ket: 'Alasan spesifik pertemuan ini' },
                'DPL 5': { aktif: true, ket: 'Alasan spesifik pertemuan ini' },
                'DPL 6': { aktif: false, ket: '' }, 'DPL 7': { aktif: false, ket: '' },
                'DPL 8': { aktif: true, ket: 'Alasan spesifik pertemuan ini' }
            },
            pertemuan: {
                awalMenit: 15,
                awalIsi: '1. Doa...\n2. Menggembirakan: ...\n3. Berkesadaran: ...\n4. Bermakna: ...',
                intiMenit: 60,
                intiMemahami: '1. Sintaks 1...\n2. Sintaks 2...',
                intiMengaplikasikan: '3. Sintaks 3...\n4. Sintaks 4...',
                intiMerefleksi: '5. Sintaks 5...',
                penutupMenit: 15,
                penutupIsi: '1. Kesimpulan...\n2. Refleksi...\n3. Doa...'
            },
            kasusLkpd: {
                judul: 'Kasus Kontekstual: ' + rec.judulHalaman,
                narasi: 'Narasi kasus kontekstual untuk diskusi kelompok...',
                kolomAmat: 'Identifikasi Masalah|Analisis Biologi|Bukti Data|Solusi Nyata'
            },
            glosarium: [{ istilah: 'Istilah 1', definisi: 'Definisi ringkas ilmiah' }]
        };

        let promptTxt = [
            'Susun Desain Pertemuan Deep Learning (Berkesadaran, Bermakna, Menggembirakan) untuk 1 SUB-BAB (1 Pertemuan) dalam Modul Ajar Biologi SMA:',
            '- Bab Induk: ' + (info.indukBab || '-'),
            '- Sub-Bab (Pertemuan Ke-' + (info.urutanPertemuan || 1) + '): ' + rec.judulHalaman,
            '- Kelas / Fase: ' + rec.kelas + ' / Fase ' + rec.fase,
            '- Alokasi Pertemuan Ini: ' + (Number(rec.totalJP) || 2) + ' JP (1 JP = ' + window.ckGetMenitPerJP() + ' menit)',
            cpFase ? ('- CP Fase ' + rec.fase + ': ' + cpFase) : '',
            catatan ? ('- Catatan Guru: ' + catatan) : '',
            '',
            'ISI LEMBAR MATERI A4 SUB-BAB INI:',
            teksMateri || '(Susun sesuai topik Biologi SMA untuk sub-bab ini.)',
            '',
            'ATURAN: Kembalikan HANYA 1 blok JSON valid tanpa narasi di luar JSON.',
            JSON.stringify(skema, null, 2)
        ].filter(Boolean).join('\n');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(promptTxt).then(function() {
                window.ckToast('📋 Prompt Hybrid AI Sub-Bab disalin! Tempel ke Gemini lalu paste JSON hasilnya.');
            }).catch(function() { ckFallbackCopy(promptTxt); });
        } else ckFallbackCopy(promptTxt);
    };

    function ckFallbackCopy(txt) {
        let ta = document.createElement('textarea');
        ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); window.ckToast('📋 Prompt disalin!'); } catch (e) {}
        document.body.removeChild(ta);
    }

    window.ckTerapkanJsonAI = function() {
        let ta = document.getElementById('ck-ai-json-box');
        let raw = ta ? ta.value.trim() : '';
        if (!raw) return window.ckToast('⚠️ Tempel hasil JSON dari AI terlebih dahulu.', true);

        let parsed = null;
        try {
            let clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
            let a = clean.indexOf('{'), b = clean.lastIndexOf('}');
            if (a === -1 || b === -1 || b <= a) throw new Error('Blok JSON tidak ditemukan');
            parsed = JSON.parse(clean.substring(a, b + 1));
        } catch (err) {
            return window.ckToast('❌ Format JSON belum valid: ' + err.message, true);
        }

        let rec = window.ckGetRecordAktif();
        let info = window.ckDeteksiInfoHalamanAktif();

        ['materiPokok', 'kesiapanSudah', 'kesiapanBelum', 'atp', 'modelPembelajaran', 'metodePembelajaran', 'pertanyaanPemantik'].forEach(function(k) {
            if (parsed[k]) rec[k] = String(parsed[k]);
        });
        if (parsed.iktp || parsed.tp) {
            rec.iktp = String(parsed.iktp || parsed.tp);
            rec.tp = rec.iktp;
        }
        if (parsed.tpBab) {
            let babRec = window.ckGetRecordBabInduk(info);
            if (babRec && !String(babRec.tp || '').trim()) {
                babRec.tp = String(parsed.tpBab);
                babRec.updatedAt = Date.now();
            }
        }
        if (parsed.totalJP) {
            rec.totalJP = Number(parsed.totalJP) || 2;
            rec.alokasiWaktu = '1 Pertemuan (' + rec.totalJP + ' JP)';
        }
        if (parsed.dpl && typeof parsed.dpl === 'object') {
            window.MA_DAFTAR_DPL.forEach(function(item) {
                let d = parsed.dpl[item.kode];
                if (d && typeof d === 'object') rec.dpl[item.kode] = { aktif: Boolean(d.aktif), ket: d.ket ? String(d.ket) : item.defaultKet };
            });
        }
        let ptObj = Array.isArray(parsed.pertemuan) ? parsed.pertemuan[0] : parsed.pertemuan;
        if (ptObj && typeof ptObj === 'object') {
            let jpV = Number(rec.totalJP) || 2;
            rec.pertemuan = [{
                pertemuanKe: info.urutanPertemuan || 1,
                model: rec.modelPembelajaran || 'Discovery Learning',
                metode: rec.metodePembelajaran || 'Diskusi & Eksplorasi',
                tp: rec.tp || rec.judulHalaman,
                jp: jpV,
                alokasiTeks: jpV + ' JP (' + (jpV * window.ckGetMenitPerJP()) + ' Menit)',
                awalMenit: Number(ptObj.awalMenit) || 15,
                awalIsi: String(ptObj.awalIsi || ''),
                intiMenit: Number(ptObj.intiMenit) || Math.max(20, (jpV * window.ckGetMenitPerJP()) - 30),
                intiMemahami: String(ptObj.intiMemahami || ''),
                intiMengaplikasikan: String(ptObj.intiMengaplikasikan || ''),
                intiMerefleksi: String(ptObj.intiMerefleksi || ''),
                penutupMenit: Number(ptObj.penutupMenit) || 15,
                penutupIsi: String(ptObj.penutupIsi || '')
            }];
        }
        if (parsed.kasusLkpd && typeof parsed.kasusLkpd === 'object') {
            rec.lkpd.kasusList = [{
                judul: String(parsed.kasusLkpd.judul || ('Kasus: ' + rec.judulHalaman)),
                gambarUrl: '',
                narasi: String(parsed.kasusLkpd.narasi || ''),
                kolomAmat: String(parsed.kasusLkpd.kolomAmat || 'Identifikasi Masalah|Analisis Biologi|Bukti Data|Solusi')
            }];
        }
        if (Array.isArray(parsed.glosarium)) {
            let gMap = {};
            (rec.glosarium || []).forEach(function(g) { if (g && g.istilah) gMap[g.istilah.toLowerCase()] = g; });
            parsed.glosarium.forEach(function(g) {
                if (g && g.istilah && !gMap[String(g.istilah).toLowerCase()]) {
                    rec.glosarium.push({ istilah: String(g.istilah).trim(), definisi: String(g.definisi || '').trim() });
                }
            });
        }

        window.ckSimpanHalamanKeCloud(rec.pageKey, true);
        window.CK_STATE.activeMiniTab = 'desain';
        window.ckRenderPanel();
        window.ckToast('🎉 Desain Pertemuan Sub-Bab ini terisi otomatis dari JSON!');
    };

    // =========================================================================
    // 5. AUTO-FIT TINGGI TEXTAREA (ANTI-POTONG) & LEBAR SEJAJAR LEMBAR A4
    // =========================================================================
    window.ckAutoFitTextarea = function(el) {
        if (!el || el.id === 'ck-ai-json-box') return;
        el.style.height = 'auto';
        let cs = getComputedStyle(el);
        let borderExtra = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
        el.style.height = Math.max(36, Math.ceil(el.scrollHeight + borderExtra + 4)) + 'px';
    };

    window.ckAutoFitSemuaTextarea = function() {
        let wrap = document.getElementById('page-cakupan-panel-wrap');
        if (!wrap) return;
        wrap.querySelectorAll('textarea.ck-ta').forEach(function(ta) {
            window.ckAutoFitTextarea(ta);
        });
    };

    window.ckSamakanLebarDenganContentBlock = function() {
        let wrap = document.getElementById('page-cakupan-panel-wrap');
        if (!wrap || !wrap.firstChild) return;

        let vw = document.documentElement.clientWidth || window.innerWidth || 1200;
        if (vw <= 768) {
            wrap.style.width = '100%';
            wrap.style.maxWidth = '100%';
            window.ckAutoFitSemuaTextarea();
            return;
        }

        if (wrap.offsetWidth < 50) {
            wrap.style.width = '794px';
            wrap.style.maxWidth = 'none';
        }
        let wrapRect = wrap.getBoundingClientRect();
        let effectiveZoom = (wrap.offsetWidth > 50 && wrapRect.width > 50)
            ? (wrapRect.width / wrap.offsetWidth)
            : (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--user-page-zoom')) || 1);
        if (!isFinite(effectiveZoom) || effectiveZoom <= 0.1) effectiveZoom = 1;

        let targetEl = document.querySelector('#blocks-container .a4-paper-wrapper, #blocks-container .dynamic-block-shell, #blocks-container .content-block');
        if (targetEl) {
            let rect = targetEl.getBoundingClientRect();
            if (rect && rect.width > 200) {
                let px = Math.round(rect.width / effectiveZoom) + 'px';
                wrap.style.width = px;
                wrap.style.maxWidth = px;
                window.ckAutoFitSemuaTextarea();
                return;
            }
        }

        let a4Scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--a4-screen-scale')) || 1;
        let fallbackPx = Math.round(794 * a4Scale) + 'px';
        wrap.style.width = fallbackPx;
        wrap.style.maxWidth = fallbackPx;
        window.ckAutoFitSemuaTextarea();
    };

    // =========================================================================
    // 6. RENDER PANEL MODERN & RAPI KHUSUS SUB-BAB (4 MINI-TAB)
    // =========================================================================
    window.ckTogglePanel = function() {
        window.CK_STATE.isExpanded = !window.CK_STATE.isExpanded;
        window.ckRenderPanel();
    };

    window.ckPindahMiniTab = function(tabName) {
        window.CK_STATE.isExpanded = true;
        window.CK_STATE.activeMiniTab = tabName;
        window.ckRenderPanel();
    };

    window.ckBukaPreviewExportBabInduk = function() {
        let rec = window.ckGetRecordAktif();
        let info = window.ckDeteksiInfoHalamanAktif();
        window.ckSimpanHalamanKeCloud(rec.pageKey, true);
        if (typeof window.bukaModalDokumenAdministrasi === 'function') {
            window.bukaModalDokumenAdministrasi('preview', info.indukKey || rec.indukKey || rec.pageKey);
        }
    };

    window.ckBukaSinkronTpAtp = function() {
        let rec = window.ckGetRecordAktif();
        window.ckSimpanHalamanKeCloud(rec.pageKey, true);
        if (typeof window.bukaModalDokumenAdministrasi === 'function') {
            window.bukaModalDokumenAdministrasi('tp_atp');
        }
    };

    window.ckPerbaruiStatusHeader = function() {
        let el = document.getElementById('ck-status-summary');
        if (!el) return;
        let rec = window.ckGetRecordAktif();
        let info = window.ckDeteksiInfoHalamanAktif();
        let jmlDpl = Object.values(rec.dpl || {}).filter(function(d) { return d && d.aktif; }).length;
        el.innerHTML =
            '<span class="ck-pill is-bab">📘 ' + ckEsc(info.indukBab || 'Bab Induk') + '</span>' +
            '<span class="ck-pill is-meta">Pertemuan Ke-' + (info.urutanPertemuan || 1) + ' • ' + (Number(rec.totalJP) || 2) + ' JP</span>' +
            '<span class="ck-pill is-meta">' + ckEsc(rec.kelas) + ' (Fase ' + ckEsc(rec.fase) + ')</span>' +
            '<span class="ck-pill is-meta">🎯 ' + jmlDpl + ' DPL</span>';
    };

    window.ckRenderIsiMiniTab = function(rec, info) {
        let tab = window.CK_STATE.activeMiniTab || 'identitas';
        let pt = (rec.pertemuan && rec.pertemuan[0]) || window.ckBuatTemplatePertemuan(info.urutanPertemuan || 1, rec.modelPembelajaran, rec.totalJP, rec.tp);

        if (tab === 'identitas') {
            let dplGrid = window.MA_DAFTAR_DPL.map(function(item) {
                let st = (rec.dpl && rec.dpl[item.kode]) || { aktif: false, ket: item.defaultKet };
                let idSafe = item.kode.replace(/\s+/g, '');
                return '<div id="ck-dpl-row-' + idSafe + '" class="ck-dpl-item' + (st.aktif ? ' is-active' : '') + '">' +
                    '<label class="ck-dpl-lbl">' +
                        '<input type="checkbox" ' + (st.aktif ? 'checked' : '') + ' onchange="window.ckToggleDPL(\'' + item.kode + '\', this.checked)">' +
                        '<span><b>' + item.kode + '</b> · ' + item.nama + '</span>' +
                    '</label>' +
                    '<textarea class="ck-ta ck-ta-mini" rows="1" oninput="window.ckSetKetDPL(\'' + item.kode + '\', this.value)" placeholder="Konteks penerapan pada sub-bab ini...">' + ckEsc(st.ket) + '</textarea>' +
                '</div>';
            }).join('');

            return '<div class="ck-info-note">📌 Sub-Bab ini otomatis menjadi <b>Pertemuan Ke-' + (info.urutanPertemuan || 1) + '</b> di dalam 1 Dokumen Modul Ajar <b>' + ckEsc(info.indukBab || 'Bab Induk') + '</b>.</div>' +
                '<div class="ck-sec-card">' +
                    '<div class="ck-sec-head">🧾 Identitas &amp; Kesiapan Pertemuan</div>' +
                    '<div class="ck-grid-id">' +
                        '<div><label class="ck-lbl">Alokasi JP</label><input type="number" min="1" max="12" class="ck-inp" style="text-align:center; font-weight:800;" value="' + (Number(rec.totalJP) || 2) + '" oninput="window.ckSetField(\'totalJP\', Number(this.value)||2)"></div>' +
                        '<div><label class="ck-lbl">Fokus Materi Pokok Sub-Bab</label><textarea class="ck-ta" rows="1" oninput="window.ckSetField(\'materiPokok\', this.value)">' + ckEsc(rec.materiPokok) + '</textarea></div>' +
                        '<div><label class="ck-lbl">Mode Pembelajaran</label><input type="text" class="ck-inp" value="' + ckEsc(rec.modePembelajaran) + '" oninput="window.ckSetField(\'modePembelajaran\', this.value)"></div>' +
                    '</div>' +
                    '<div class="ck-grid-2" style="margin-top:12px;">' +
                        '<div><label class="ck-lbl">Kesiapan Murid (Sudah Memahami)</label><textarea class="ck-ta" rows="1" oninput="window.ckSetField(\'kesiapanSudah\', this.value)">' + ckEsc(rec.kesiapanSudah) + '</textarea></div>' +
                        '<div><label class="ck-lbl">Kesiapan Murid (Belum Memahami)</label><textarea class="ck-ta" rows="1" oninput="window.ckSetField(\'kesiapanBelum\', this.value)">' + ckEsc(rec.kesiapanBelum) + '</textarea></div>' +
                    '</div>' +
                '</div>' +
                '<div class="ck-sec-card">' +
                    '<div class="ck-sec-head">🌟 Dimensi Profil Lulusan (DPL) — Centang yang Aktif</div>' +
                    '<div class="ck-dpl-grid">' + dplGrid + '</div>' +
                '</div>';
        }

        if (tab === 'desain') {
            let babRec = window.ckGetRecordBabInduk(info);
            let tpBabVal = babRec ? (babRec.tp || '') : '';
            let atpBabVal = babRec ? (babRec.atp || '') : '';
            let iktpSubVal = (rec.iktp !== undefined && rec.iktp !== null) ? rec.iktp : (rec.tp || '');

            let modelList = ['Discovery Learning', 'Problem Based Learning (PBL)', 'Project Based Learning (PjBL)', 'Inquiry Learning', 'Asesmen Sumatif'];
            let modelOpts = modelList.map(function(m) {
                return '<option value="' + ckEsc(m) + '"' + (rec.modelPembelajaran === m ? ' selected' : '') + '>' + ckEsc(m) + '</option>';
            }).join('');
            if (rec.modelPembelajaran && modelList.indexOf(rec.modelPembelajaran) === -1) {
                modelOpts = '<option value="' + ckEsc(rec.modelPembelajaran) + '" selected>' + ckEsc(rec.modelPembelajaran) + '</option>' + modelOpts;
            }

            return '<div class="ck-sec-card" style="background:#f0f9ff; border-color:#7dd3fc;">' +
                    '<div class="ck-sec-head-row">' +
                        '<span class="ck-sec-head" style="margin:0;">🧭 TP &amp; ATP Bab Induk (' + ckEsc(info.indukBab || 'Bab Utama') + ') · Sinkron 2 Arah ke Dokumen Administrasi</span>' +
                        '<button type="button" class="ck-sub-btn is-slate" onclick="window.ckBukaSinkronTpAtp()" title="Buka tabel sinkronisasi TP, ATP &amp; IKTP semua bab">🧭 Tabel TP &amp; ATP</button>' +
                    '</div>' +
                    '<div class="ck-grid-2" style="margin-top:10px;">' +
                        '<div><label class="ck-lbl">Tujuan Pembelajaran (TP) Payung Bab Utama</label><textarea class="ck-ta" rows="1" placeholder="Isi TP payung 1 Bab utuh (otomatis sinkron ke semua sub-bab &amp; Dokumen Administrasi)..." oninput="window.ckSetBabIndukField(\'tp\', this.value)">' + ckEsc(tpBabVal) + '</textarea></div>' +
                        '<div><label class="ck-lbl">Alur Tujuan Pembelajaran (ATP) / Lingkup Bab</label><textarea class="ck-ta" rows="1" placeholder="Ringkasan alur/lingkup materi 1 Bab utuh..." oninput="window.ckSetBabIndukField(\'atp\', this.value)">' + ckEsc(atpBabVal) + '</textarea></div>' +
                    '</div>' +
                    '<div id="ck-bab-iktp-chain">' + window.ckBangunHtmlRantaiIktpBab(info) + '</div>' +
                '</div>' +
                '<div class="ck-sec-card">' +
                    '<div class="ck-sec-head">🎯 IKTP Pertemuan Sub-Bab Ini &amp; Praktik Pedagogis</div>' +
                    '<div class="ck-grid-2">' +
                        '<div><label class="ck-lbl">IKTP / Tujuan Pertemuan (' + ckEsc(rec.judulHalaman) + ')</label><textarea class="ck-ta" rows="1" placeholder="Indikator Ketercapaian Tujuan Pembelajaran khusus pertemuan ini..." oninput="window.ckSetField(\'iktp\', this.value)">' + ckEsc(iktpSubVal) + '</textarea></div>' +
                        '<div><label class="ck-lbl">Fokus Topik / Alur Pertemuan Ini</label><textarea class="ck-ta" rows="1" placeholder="Urutan aktivitas/topik inti pertemuan ini..." oninput="window.ckSetField(\'atp\', this.value)">' + ckEsc(rec.atp) + '</textarea></div>' +
                    '</div>' +
                    '<div class="ck-grid-model" style="margin-top:12px;">' +
                        '<div><label class="ck-lbl">⚙️ Model Pembelajaran</label><select class="ck-inp" onchange="window.ckSetField(\'modelPembelajaran\', this.value)">' + modelOpts + '</select></div>' +
                        '<div><label class="ck-lbl">🛠️ Metode Pembelajaran</label><textarea class="ck-ta" rows="1" oninput="window.ckSetField(\'metodePembelajaran\', this.value)">' + ckEsc(rec.metodePembelajaran) + '</textarea></div>' +
                    '</div>' +
                    '<div style="margin-top:12px;">' +
                        '<label class="ck-lbl">💡 Pertanyaan Pemantik</label>' +
                        '<textarea class="ck-ta" rows="1" oninput="window.ckSetField(\'pertanyaanPemantik\', this.value)" placeholder="Tuliskan 1-2 pertanyaan pemantik kontekstual...">' + ckEsc(rec.pertanyaanPemantik) + '</textarea>' +
                    '</div>' +
                '</div>' +
                '<div class="ck-sec-card">' +
                    '<div class="ck-sec-head-row">' +
                        '<span class="ck-sec-head" style="margin:0;">🗓️ Skenario Pengalaman Belajar — Pertemuan Ke-' + (info.urutanPertemuan || 1) + ' (' + ckEsc(rec.judulHalaman) + ')</span>' +
                        '<button type="button" class="ck-sub-btn is-purple" onclick="window.ckIsiSintaksOtomatisSubBab()">⚡ Isi Sintaks Otomatis</button>' +
                    '</div>' +
                    '<div class="ck-phase-box is-awal">' +
                        '<div class="ck-phase-top"><b>🌅 AWAL · Menggembirakan · Berkesadaran · Bermakna</b><span class="ck-min-badge">Menit <input type="number" class="ck-min-inp" value="' + (Number(pt.awalMenit) || 15) + '" oninput="window.ckSetPertemuanTunggal(\'awalMenit\', Number(this.value)||10)"></span></div>' +
                        '<textarea class="ck-ta" rows="1" oninput="window.ckSetPertemuanTunggal(\'awalIsi\', this.value)">' + ckEsc(pt.awalIsi) + '</textarea>' +
                    '</div>' +
                    '<div class="ck-phase-box is-inti">' +
                        '<div class="ck-phase-top"><b>🧠 INTI · Pengalaman Deep Learning</b><span class="ck-min-badge">Menit <input type="number" class="ck-min-inp" value="' + (Number(pt.intiMenit) || 60) + '" oninput="window.ckSetPertemuanTunggal(\'intiMenit\', Number(this.value)||60)"></span></div>' +
                        '<div class="ck-dl-subblock"><label class="ck-lbl is-dl">1) Memahami</label><textarea class="ck-ta" rows="1" oninput="window.ckSetPertemuanTunggal(\'intiMemahami\', this.value)">' + ckEsc(pt.intiMemahami) + '</textarea></div>' +
                        '<div class="ck-dl-subblock"><label class="ck-lbl is-dl">2) Mengaplikasikan</label><textarea class="ck-ta" rows="1" oninput="window.ckSetPertemuanTunggal(\'intiMengaplikasikan\', this.value)">' + ckEsc(pt.intiMengaplikasikan) + '</textarea></div>' +
                        '<div class="ck-dl-subblock"><label class="ck-lbl is-dl">3) Merefleksi</label><textarea class="ck-ta" rows="1" oninput="window.ckSetPertemuanTunggal(\'intiMerefleksi\', this.value)">' + ckEsc(pt.intiMerefleksi) + '</textarea></div>' +
                    '</div>' +
                    '<div class="ck-phase-box is-penutup">' +
                        '<div class="ck-phase-top"><b>🌇 PENUTUP · Simpulan &amp; Refleksi</b><span class="ck-min-badge">Menit <input type="number" class="ck-min-inp" value="' + (Number(pt.penutupMenit) || 15) + '" oninput="window.ckSetPertemuanTunggal(\'penutupMenit\', Number(this.value)||10)"></span></div>' +
                        '<textarea class="ck-ta" rows="1" oninput="window.ckSetPertemuanTunggal(\'penutupIsi\', this.value)">' + ckEsc(pt.penutupIsi) + '</textarea>' +
                    '</div>' +
                '</div>';
        }

        if (tab === 'asesmen') {
            let soalList = window.ckAmbilDaftarPaketSoal();
            let curVal = (rec.asesmen.sumberSoalTipe && rec.asesmen.sumberSoalKey) ? (rec.asesmen.sumberSoalTipe + '::' + rec.asesmen.sumberSoalKey) : '';
            let optSoal = '<option value="">-- (Opsional) Pilih Paket Soal Bank Ujian / Latihan --</option>' +
                soalList.map(function(pk) {
                    let v = pk.tipe + '::' + pk.key;
                    return '<option value="' + ckEsc(v) + '"' + (v === curVal ? ' selected' : '') + '>' + ckEsc(pk.label) + '</option>';
                }).join('');

            let kasusHtml = (rec.lkpd.kasusList || []).map(function(ks, i) {
                return '<div class="ck-kasus-card">' +
                    '<div class="ck-sec-head-row" style="margin-bottom:8px;">' +
                        '<b style="font-size:12px; color:#0b3954;">🔍 Studi Kasus #' + (i + 1) + '</b>' +
                        '<button type="button" class="ck-sub-btn is-red" onclick="window.ckHapusKasus(' + i + ')">✕ Hapus</button>' +
                    '</div>' +
                    '<div class="ck-grid-2">' +
                        '<div><label class="ck-lbl">Judul Kasus</label><input type="text" class="ck-inp" value="' + ckEsc(ks.judul) + '" oninput="window.ckSetKasus(' + i + ', \'judul\', this.value)"></div>' +
                        '<div><label class="ck-lbl">Gambar Kasus (URL / Upload)</label><div style="display:flex; gap:6px;"><input type="text" class="ck-inp" style="flex:1;" value="' + ckEsc(ks.gambarUrl) + '" oninput="window.ckSetKasus(' + i + ', \'gambarUrl\', this.value)" placeholder="https://..."><label class="ck-upload-btn">📷<input type="file" accept="image/*" style="display:none;" onchange="window.ckUploadGambarKasus(' + i + ', this)"></label></div></div>' +
                    '</div>' +
                    '<div style="margin-top:8px;"><label class="ck-lbl">Narasi Kasus</label><textarea class="ck-ta" rows="1" oninput="window.ckSetKasus(' + i + ', \'narasi\', this.value)">' + ckEsc(ks.narasi) + '</textarea></div>' +
                    '<div style="margin-top:8px;"><label class="ck-lbl">Kolom Pengamatan (pisah tanda | )</label><input type="text" class="ck-inp" value="' + ckEsc(ks.kolomAmat) + '" oninput="window.ckSetKasus(' + i + ', \'kolomAmat\', this.value)"></div>' +
                '</div>';
            }).join('');

            let glosHtml = (rec.glosarium || []).map(function(g, i) {
                return '<div class="ck-glos-row">' +
                    '<input type="text" class="ck-inp" style="width:28%;" value="' + ckEsc(g.istilah) + '" oninput="window.ckSetGlosarium(' + i + ', \'istilah\', this.value)" placeholder="Istilah">' +
                    '<textarea class="ck-ta" rows="1" style="flex:1;" oninput="window.ckSetGlosarium(' + i + ', \'definisi\', this.value)" placeholder="Definisi">' + ckEsc(g.definisi) + '</textarea>' +
                    '<button type="button" class="ck-sub-btn is-red" onclick="window.ckHapusGlosarium(' + i + ')">✕</button>' +
                '</div>';
            }).join('');

            return '<div class="ck-sec-card" style="background:#f0f9ff; border-color:#bae6fd;">' +
                    '<div class="ck-sec-head-row">' +
                        '<div style="font-size:12px; color:#0b3954;"><b>📄 Lembar A4 Sub-Bab Ini:</b> ' + (rec.jumlahLembarSnapshot || 0) + ' lembar siap digabung ke Lampiran D Modul Ajar Bab.</div>' +
                        '<button type="button" class="ck-sub-btn is-blue" onclick="window.ckPerbaruiSnapshotAktif(true)">🔄 Tangkap Ulang Lembar A4</button>' +
                    '</div>' +
                '</div>' +
                '<div class="ck-sec-card">' +
                    '<div class="ck-sec-head">🎯 Tautan Soal Sumatif Bab</div>' +
                    '<div class="ck-grid-soal">' +
                        '<div><label class="ck-lbl">Paket Soal Bank Ujian / Latihan (Cukup pilih di salah satu Sub-Bab)</label><select class="ck-inp" onchange="window.ckPilihSumberSoal(this.value)">' + optSoal + '</select></div>' +
                        '<div><label class="ck-lbl">KKM</label><input type="number" class="ck-inp" style="text-align:center; font-weight:800;" value="' + (Number(rec.asesmen.kkm) || 75) + '" oninput="window.ckSetNested(\'asesmen\', \'kkm\', Number(this.value)||75)"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="ck-sec-card">' +
                    '<div class="ck-sec-head-row" style="margin-bottom:10px;">' +
                        '<span class="ck-sec-head" style="margin:0;">🧪 LKPD / Studi Kasus Pertemuan Ini</span>' +
                        '<button type="button" class="ck-sub-btn is-green" onclick="window.ckTambahKasus()">➕ Tambah Kasus</button>' +
                    '</div>' +
                    kasusHtml +
                '</div>' +
                '<div class="ck-sec-card">' +
                    '<div class="ck-sec-head-row" style="margin-bottom:10px;">' +
                        '<span class="ck-sec-head" style="margin:0;">📖 Glosarium Sub-Bab (' + (rec.glosarium || []).length + ')</span>' +
                        '<button type="button" class="ck-sub-btn is-blue" onclick="window.ckTambahGlosarium()">➕ Tambah Istilah</button>' +
                    '</div>' +
                    (glosHtml || '<div style="font-size:12px; color:#64748b;">Belum ada istilah glosarium.</div>') +
                '</div>';
        }

        return '<div class="ck-sec-card ck-ai-drawer">' +
            '<div class="ck-sec-head" style="color:#5b21b6;">🤖 Hybrid AI Khusus 1 Pertemuan (Sub-Bab: ' + ckEsc(rec.judulHalaman) + ')</div>' +
            '<div style="margin-bottom:10px;"><label class="ck-lbl">Arahan Tambahan (Opsional)</label><input type="text" id="ck-ai-catatan" class="ck-inp" placeholder="Misal: fokus praktikum pengamatan preparat..."></div>' +
            '<button type="button" class="ck-sub-btn is-purple" style="width:100%; padding:10px; font-size:12.5px; margin-bottom:12px;" onclick="window.ckSalinPromptAI()">📋 1. Salin Prompt AI untuk Pertemuan Ini</button>' +
            '<label class="ck-lbl">2. Tempel Hasil JSON dari AI di sini:</label>' +
            '<textarea id="ck-ai-json-box" class="ck-ta" rows="6" placeholder="Tempelkan blok JSON balasan AI di sini..."></textarea>' +
            '<button type="button" class="ck-sub-btn is-green" style="width:100%; padding:10px; font-size:12.5px; margin-top:10px;" onclick="window.ckTerapkanJsonAI()">📥 3. Terapkan JSON ke Pertemuan Ini</button>' +
        '</div>';
    };

    window.ckPastikanWadahPanelAda = function() {
        let wrap = document.getElementById('page-cakupan-panel-wrap');
        if (wrap) return wrap;
        let editor = document.getElementById('main-editor-wrapper');
        if (!editor) return null;
        wrap = document.createElement('div');
        wrap.id = 'page-cakupan-panel-wrap';
        wrap.className = 'ck-panel-outer';
        wrap.addEventListener('input', function(e) {
            if (e.target && e.target.tagName === 'TEXTAREA') {
                window.ckAutoFitTextarea(e.target);
            }
        });
        let threeCol = editor.querySelector('.home-three-col-layout');
        if (threeCol) editor.insertBefore(wrap, threeCol);
        else editor.insertBefore(wrap, editor.firstChild);
        return wrap;
    };

    window.ckSembunyikanPanel = function(wrap) {
        if (!wrap) return;
        wrap.classList.remove('is-shown');
        wrap.style.display = 'none';
        wrap.innerHTML = '';
    };

    window.ckRenderPanel = function() {
        let wrap = window.ckPastikanWadahPanelAda();
        if (!wrap) return;

        if (window.ckApakahHome() || !window.ckApakahAdminEditAktif()) {
            window.ckSembunyikanPanel(wrap);
            return;
        }
        let info = window.ckDeteksiInfoHalamanAktif();
        if (info.tipeNode !== 'subbab') {
            window.ckSembunyikanPanel(wrap);
            window.CK_STATE.activePageKey = info.pageKey;
            return;
        }

        let rec = window.ckGetRecordAktif();
        window.CK_STATE.activePageKey = rec.pageKey;
        let tab = window.CK_STATE.activeMiniTab || 'identitas';

        let tabsNav = window.CK_STATE.isExpanded
            ? '<div class="ck-mini-tabs">' +
                '<button type="button" class="ck-mtab' + (tab === 'identitas' ? ' active' : '') + '" onclick="window.ckPindahMiniTab(\'identitas\')">1. Identitas &amp; DPL</button>' +
                '<button type="button" class="ck-mtab' + (tab === 'desain' ? ' active' : '') + '" onclick="window.ckPindahMiniTab(\'desain\')">2. Desain, TP, ATP &amp; Pertemuan</button>' +
                '<button type="button" class="ck-mtab' + (tab === 'asesmen' ? ' active' : '') + '" onclick="window.ckPindahMiniTab(\'asesmen\')">3. Asesmen, LKPD &amp; Glosarium</button>' +
                '<button type="button" class="ck-mtab' + (tab === 'ai' ? ' active' : '') + '" onclick="window.ckPindahMiniTab(\'ai\')">4. 🤖 Hybrid AI</button>' +
              '</div>' +
              '<div class="ck-panel-body">' + window.ckRenderIsiMiniTab(rec, info) + '</div>'
            : '';

        wrap.innerHTML =
            '<div class="ck-panel-card">' +
                '<div class="ck-panel-head">' +
                    '<div class="ck-head-left" onclick="window.ckTogglePanel()">' +
                        '<span class="ck-toggle-arrow">' + (window.CK_STATE.isExpanded ? '▼' : '▶') + '</span>' +
                        '<div style="min-width:0;">' +
                            '<div class="ck-head-title">📋 Desain Pertemuan (Sub-Bab): <span>' + ckEsc(rec.judulHalaman) + '</span></div>' +
                            '<div id="ck-status-summary" class="ck-head-pills"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ck-head-actions">' +
                        '<button type="button" class="ck-btn is-ai" onclick="window.ckPindahMiniTab(\'ai\')">🤖 AI</button>' +
                        '<button type="button" class="ck-btn is-save" onclick="window.ckSimpanHalamanKeCloud(window.CK_STATE.activePageKey, false)">💾 Simpan</button>' +
                        '<button type="button" class="ck-btn is-sync" onclick="window.ckBukaPreviewExportBabInduk()" title="Preview & Export 1 Dokumen Modul Ajar Bab Induk">👁️ Modul Ajar Bab</button>' +
                    '</div>' +
                '</div>' +
                tabsNav +
            '</div>';

        wrap.classList.add('is-shown');
        wrap.style.display = 'block';
        window.ckPerbaruiStatusHeader();
        requestAnimationFrame(function() {
            window.ckSamakanLebarDenganContentBlock();
        });
        setTimeout(window.ckSamakanLebarDenganContentBlock, 220);
        setTimeout(window.ckAutoFitSemuaTextarea, 450);
    };

    // =========================================================================
    // 7. CSS MODERN, KARTU TERSTRUKTUR, & TEXTAREA AUTO-FIT TANPA POTONGAN
    // =========================================================================
    window.ckPasangCSS = function() {
        let oldCss = document.getElementById('page-cakupan-engine-css');
        if (oldCss) oldCss.remove();
        let st = document.createElement('style');
        st.id = 'page-cakupan-engine-css';
        st.textContent =
            '.ck-panel-outer{display:none;margin:0 auto 20px auto;box-sizing:border-box;font-family:Poppins,Quicksand,sans-serif;z-index:25;}' +
            '.ck-panel-outer.is-shown{display:block !important;}' +
            'body.drawing-mode-active .ck-panel-outer,body.strict-mode-active .ck-panel-outer{display:none !important;}' +
            '.ck-panel-card{background:#fff;border:1px solid #cbd5e1;border-radius:12px;box-shadow:0 6px 22px rgba(15,23,42,0.09);overflow:hidden;}' +
            '.ck-panel-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:11px 16px;background:linear-gradient(135deg,#0b3954 0%,#164e63 100%);color:#fff;}' +
            '.ck-head-left{display:flex;align-items:center;gap:11px;flex:1;min-width:220px;cursor:pointer;user-select:none;}' +
            '.ck-toggle-arrow{width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,0.16);display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;}' +
            '.ck-head-title{font-size:13.5px;font-weight:800;color:#fde047;line-height:1.3;}' +
            '.ck-head-title span{color:#fff;}' +
            '.ck-head-pills{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;}' +
            '.ck-pill{font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:12px;}' +
            '.ck-pill.is-bab{background:#0284c7;color:#fff;}' +
            '.ck-pill.is-meta{background:rgba(255,255,255,0.15);color:#f1f5f9;}' +
            '.ck-head-actions{display:flex;gap:7px;flex-wrap:wrap;}' +
            '.ck-btn{border:1px solid rgba(255,255,255,0.28);background:rgba(255,255,255,0.14);color:#fff;padding:6px 12px;border-radius:8px;font-family:Poppins,sans-serif;font-size:11.5px;font-weight:700;cursor:pointer;white-space:nowrap;transition:filter 0.15s;}' +
            '.ck-btn:hover{filter:brightness(1.08);}' +
            '.ck-btn.is-ai{background:#7e22ce;border-color:#c084fc;}' +
            '.ck-btn.is-save{background:#16a34a;border-color:#86efac;}' +
            '.ck-btn.is-sync{background:#facc15;color:#0b3954;border-color:#fde047;font-weight:800;}' +
            '.ck-mini-tabs{display:flex;gap:8px;padding:10px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;overflow-x:auto;}' +
            '.ck-mtab{background:#fff;color:#475569;border:1px solid #cbd5e1;padding:6px 14px;border-radius:20px;font-family:Poppins,sans-serif;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.15s;}' +
            '.ck-mtab:hover{border-color:#0b3954;color:#0b3954;}' +
            '.ck-mtab.active{background:#0b3954;color:#fde047;border-color:#0b3954;box-shadow:0 2px 6px rgba(11,57,84,0.2);}' +
            '.ck-panel-body{padding:14px 16px;background:#f1f5f9;display:flex;flex-direction:column;gap:12px;}' +
            '.ck-sec-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;box-shadow:0 1px 3px rgba(15,23,42,0.04);}' +
            '.ck-sec-head{font-size:12.5px;font-weight:800;color:#0b3954;margin-bottom:10px;display:block;}' +
            '.ck-sec-head-row{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;}' +
            '.ck-info-note{background:#e0f2fe;border:1px solid #7dd3fc;color:#0369a1;font-size:12px;padding:9px 12px;border-radius:9px;}' +
            '.ck-iktp-chain-box{margin-top:10px;padding:8px 10px;background:rgba(255,255,255,0.85);border:1px dashed #7dd3fc;border-radius:8px;font-size:11.5px;line-height:1.45;}' +
            'body.dark-mode-active .ck-iktp-chain-box{background:#0f172a !important;border-color:#0284c7 !important;}' +
            '.ck-ai-drawer{background:#faf5ff;border:1.5px solid #c084fc;}' +
            '.ck-lbl{display:block;font-size:11.5px;font-weight:700;color:#334155;margin-bottom:5px;}' +
            '.ck-lbl.is-dl{color:#15803d;font-weight:800;}' +
            '.ck-inp,.ck-ta{width:100%;box-sizing:border-box;padding:8px 11px;border:1px solid #cbd5e1;border-radius:8px;font-family:Quicksand,Poppins,sans-serif;font-size:12.5px;font-weight:600;color:#0f172a;background:#fff;outline:none;transition:border-color 0.15s,box-shadow 0.15s;}' +
            '.ck-ta{resize:none !important;overflow:hidden !important;line-height:1.55;min-height:36px;display:block;}' +
            '.ck-ta-mini{font-size:11.5px;padding:6px 9px;background:#f8fafc;color:#334155;min-height:32px;}' +
            '#ck-ai-json-box{overflow-y:auto !important;max-height:220px;font-family:Consolas,monospace;font-size:11.5px;}' +
            '.ck-inp:focus,.ck-ta:focus{border-color:#0284c7;box-shadow:0 0 0 3px rgba(2,132,199,0.14);background:#fff;}' +
            '.ck-grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start;}' +
            '.ck-grid-id{display:grid;grid-template-columns:100px 1.6fr 1fr;gap:12px;align-items:start;}' +
            '.ck-grid-model{display:grid;grid-template-columns:250px 1fr;gap:14px;align-items:start;}' +
            '.ck-grid-soal{display:grid;grid-template-columns:1fr 110px;gap:12px;align-items:end;}' +
            '.ck-dpl-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}' +
            '.ck-dpl-item{background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;padding:9px 11px;display:flex;flex-direction:column;gap:6px;transition:all 0.15s;}' +
            '.ck-dpl-item.is-active{background:#f0fdf4;border-color:#4ade80;}' +
            '.ck-dpl-lbl{display:flex;align-items:center;gap:7px;font-size:12px;color:#0f172a;cursor:pointer;}' +
            '.ck-dpl-lbl input{width:15px;height:15px;accent-color:#16a34a;cursor:pointer;}' +
            '.ck-phase-box{background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0284c7;border-radius:9px;padding:11px 13px;margin-top:10px;}' +
            '.ck-phase-box.is-inti{background:#f0fdf4;border-color:#bbf7d0;border-left-color:#16a34a;}' +
            '.ck-phase-box.is-penutup{background:#eef2ff;border-color:#c7d2fe;border-left-color:#6366f1;}' +
            '.ck-phase-top{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;color:#0b3954;margin-bottom:8px;}' +
            '.ck-min-badge{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid #cbd5e1;padding:3px 8px;border-radius:8px;font-size:11px;font-weight:700;color:#475569;}' +
            '.ck-min-inp{width:46px;padding:2px 4px;border:none;border-left:1px solid #e2e8f0;text-align:center;font-weight:800;color:#0f172a;outline:none;background:transparent;}' +
            '.ck-dl-subblock{margin-top:9px;}' +
            '.ck-dl-subblock:first-of-type{margin-top:2px;}' +
            '.ck-kasus-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;padding:11px 12px;margin-bottom:10px;}' +
            '.ck-kasus-card:last-child{margin-bottom:0;}' +
            '.ck-glos-row{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;}' +
            '.ck-sub-btn{border:none;border-radius:8px;padding:6px 12px;font-family:Poppins,sans-serif;font-size:11.5px;font-weight:700;color:#fff;cursor:pointer;white-space:nowrap;}' +
            '.ck-sub-btn.is-green{background:#16a34a;} .ck-sub-btn.is-blue{background:#0284c7;} .ck-sub-btn.is-purple{background:#7e22ce;} .ck-sub-btn.is-red{background:#dc2626;} .ck-sub-btn.is-slate{background:#475569;}' +
            '.ck-upload-btn{background:#0b3954;color:#fff;padding:0 11px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;font-size:13px;}' +
            'body.dark-mode-active .ck-panel-card,body.dark-mode-active .ck-sec-card,body.dark-mode-active .ck-kasus-card{background:#1e293b !important;border-color:#334155 !important;}' +
            'body.dark-mode-active .ck-panel-body,body.dark-mode-active .ck-mini-tabs{background:#0f172a !important;border-color:#334155 !important;color:#f1f5f9 !important;}' +
            'body.dark-mode-active .ck-sec-head,body.dark-mode-active .ck-lbl,body.dark-mode-active .ck-dpl-lbl,body.dark-mode-active .ck-phase-top{color:#f1f5f9 !important;}' +
            'body.dark-mode-active .ck-phase-box{background:#0f172a !important;border-color:#334155 !important;}' +
            'body.dark-mode-active .ck-inp,body.dark-mode-active .ck-ta,body.dark-mode-active .ck-dpl-item,body.dark-mode-active .ck-mtab,body.dark-mode-active .ck-min-badge{background:#1e293b !important;border-color:#475569 !important;color:#f8fafc !important;}' +
            'body.dark-mode-active .ck-min-inp{color:#f8fafc !important;}' +
            'body.dark-mode-active .ck-mtab.active{background:#0b3954 !important;color:#fde047 !important;}' +
            '@media(max-width:860px){.ck-grid-2,.ck-grid-id,.ck-grid-model,.ck-grid-soal,.ck-dpl-grid{grid-template-columns:1fr !important;}}' +
            '@media print{.ck-panel-outer{display:none !important;}}';
        document.head.appendChild(st);
    };

    let _ckNavTimer = null;
    function ckPantauHalaman() {
        clearTimeout(_ckNavTimer);
        _ckNavTimer = setTimeout(function() {
            let isHome = window.ckApakahHome();
            let adminAktif = window.ckApakahAdminEditAktif();
            if (isHome || !adminAktif) {
                window.ckSembunyikanPanel(document.getElementById('page-cakupan-panel-wrap'));
                window.CK_STATE.activeRenderSig = 'HIDDEN|' + isHome + '|' + adminAktif;
                return;
            }
            let info = window.ckDeteksiInfoHalamanAktif();
            let sigBaru = info.pageKey + '|' + info.tipeNode + '|' + info.judul + '|' + info.indukBab + '|' + info.urutanPertemuan + '|1';
            let cardAda = Boolean(document.querySelector('#page-cakupan-panel-wrap .ck-panel-card'));

            if (sigBaru !== window.CK_STATE.activeRenderSig || (info.tipeNode === 'subbab' && !cardAda)) {
                window.CK_STATE.activeRenderSig = sigBaru;
                window.ckRenderPanel();
                if (info.tipeNode === 'subbab') {
                    let keyNow = info.pageKey;
                    setTimeout(function() {
                        if (!window.ckApakahHome() && window.CK_STATE.activePageKey === keyNow) {
                            window.ckPerbaruiSnapshotAktif(false);
                            window.ckSamakanLebarDenganContentBlock();
                        }
                    }, 650);
                }
            } else {
                window.ckSamakanLebarDenganContentBlock();
            }
        }, 140);
    }

    window.ckPantauHalaman = ckPantauHalaman;

    function ckPasangHookNavigasi() {
        if (!window._ckBreadcrumbHooked && typeof window.updateBreadcrumb === 'function') {
            window._ckBreadcrumbHooked = true;
            let origUB = window.updateBreadcrumb;
            window.updateBreadcrumb = function() {
                let ret = origUB.apply(this, arguments);
                ckPantauHalaman();
                return ret;
            };
        }
        if (!window._ckHistoryHooked) {
            window._ckHistoryHooked = true;
            ['pushState', 'replaceState'].forEach(function(fnName) {
                let orig = history[fnName];
                if (typeof orig === 'function') {
                    history[fnName] = function() {
                        let ret = orig.apply(this, arguments);
                        ckPantauHalaman();
                        if (typeof window.a4JadwalkanRefresh === 'function') window.a4JadwalkanRefresh(180);
                        return ret;
                    };
                }
            });
            window.addEventListener('popstate', ckPantauHalaman);
        }
    }

    function ckMulaiInisialisasi() {
        window.ckPasangCSS();
        window.ckMuatLokal();
        ckPasangHookNavigasi();
        window.ckSinkronDariFirebase(function() { ckPantauHalaman(); });

        window.addEventListener('resize', window.ckSamakanLebarDenganContentBlock);

        let bc = document.getElementById('bottom-breadcrumb');
        if (bc) new MutationObserver(ckPantauHalaman).observe(bc, { childList: true, subtree: true, characterData: true });

        let blocks = document.getElementById('blocks-container');
        if (blocks) new MutationObserver(function() {
            ckPantauHalaman();
            setTimeout(window.ckSamakanLebarDenganContentBlock, 180);
        }).observe(blocks, { childList: true });

        new MutationObserver(ckPantauHalaman).observe(document.body, { attributes: true, attributeFilter: ['class'] });
        new MutationObserver(function() {
            ckPantauHalaman();
            setTimeout(window.ckSamakanLebarDenganContentBlock, 60);
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });

        let hit = 0;
        let bootPoll = setInterval(function() {
            hit++;
            ckPantauHalaman();
            if (hit >= 12) clearInterval(bootPoll);
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ckMulaiInisialisasi);
    } else {
        ckMulaiInisialisasi();
    }
})();