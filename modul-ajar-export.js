/* =========================================================================
   MESIN LIVE PREVIEW & EXPORT DOKUMEN ADMINISTRASI (PDF A4 & WORD .doc)
   Mendukung 5 Dokumen Resmi dengan 2 Logo (Tut Wuri Handayani & Sekolah):
   1) Modul Ajar Deep Learning (Portrait A4 — Cover + Isi + Lampiran A-F)
   2) Kalender Pendidikan & Rincian Minggu Efektif (Portrait A4)
   3) Dokumen CP, TP & ATP (Landscape A4)
   4) Program Tahunan / Prota (Portrait A4)
   5) Program Semester / Promes Matriks Mingguan (Landscape A4)
   ========================================================================= */

(function() {
    function maEsc(str) {
        return String(str === undefined || str === null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function maStripHtml(html) {
        let div = document.createElement('div');
        div.innerHTML = String(html || '');
        return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
    }

    function maFormatParagraf(str, highlightDeepLearning) {
        let safe = maEsc(str).trim();
        if (!safe) return '-';
        if (highlightDeepLearning) {
            safe = safe
                .replace(/Menggembirakan\s*:/gi, '<b>Menggembirakan:</b>')
                .replace(/Berkesadaran\s*:/gi, '<b>Berkesadaran:</b>')
                .replace(/Bermakna\s*:/gi, '<b>Bermakna:</b>')
                .replace(/(Sintaks\s+\d+(?:\s*&amp;\s*\d+)?\s*\([^)]+\)\s*:)/gi, function(m) {
                    return '<b>' + m + '</b>';
                });
        }
        return safe.replace(/\r?\n/g, '<br>');
    }

    function maFormatListBaris(str) {
        let lines = String(str || '').split(/\r?\n/).map(function(l) { return l.trim(); }).filter(Boolean);
        if (lines.length === 0) return '-';
        return lines.map(function(l) {
            if (/^Rincian IKTP Penyusun TP\s*:/i.test(l)) {
                return '<div style="margin:5pt 0 2pt 0; font-weight:bold; color:#0b3954;">' + maEsc(l) + '</div>';
            }
            return '<div style="margin-bottom:2.5pt;">' + maEsc(l) + '</div>';
        }).join('');
    }

    function maDeteksiBloomLokal(teksSoal, tipeSoal) {
        let txt = maStripHtml(teksSoal).toLowerCase();
        let tipe = String(tipeSoal || 'PG').toUpperCase();

        if (/rancang|desain|ciptakan|buatlah|susunlah|proyek|inovasi/.test(txt)) {
            return { level: 'C6', kata: 'Merancang / Mencipta', skorDefault: tipe === 'ESSAY' ? 20 : 5 };
        }
        if (/evaluasi|nilai|simpulkan|kritik|bandingkan efektivitas|tindakan nyata paling tepat|setujukah/.test(txt)) {
            return { level: 'C5', kata: 'Mengevaluasi', skorDefault: tipe === 'ESSAY' ? 20 : 5 };
        }
        if (/analisis|analisislah|hubungan antara|mengapa|penyebab utama|dampak jangka panjang|prediksi|berdasarkan grafik|berdasarkan data|studi kasus/.test(txt)) {
            return { level: 'C4', kata: 'Menganalisis', skorDefault: tipe === 'ESSAY' ? 15 : 5 };
        }
        if (/hitunglah|tentukan|terapkan|aplikasikan|jika diketahui|proses yang terjadi pada/.test(txt)) {
            return { level: 'C3', kata: 'Menerapkan', skorDefault: tipe === 'ESSAY' ? 15 : 4 };
        }
        if (/jelaskan|perbedaan|fungsi|mekanisme|menguraikan|ciri-ciri|contoh/.test(txt)) {
            return { level: 'C2', kata: 'Memahami', skorDefault: tipe === 'ESSAY' ? 10 : 3 };
        }
        return { level: 'C1', kata: 'Mengingat / Mengidentifikasi', skorDefault: tipe === 'ESSAY' ? 10 : 2 };
    }

    function maBuatIndikatorRingkas(soalText, bloomKata) {
        let clean = maStripHtml(soalText);
        if (clean.length > 95) clean = clean.substring(0, 95).trim() + '...';
        if (!clean) return 'Murid mampu ' + bloomKata.toLowerCase() + ' konsep inti pada bab ini.';
        return 'Disajikan stimulus/pernyataan, murid mampu ' + bloomKata.toLowerCase() + ' terkait: "' + clean + '"';
    }

    function maBersihkanHtmlMateriCetak(rawHtml) {
        let wrap = document.createElement('div');
        wrap.innerHTML = String(rawHtml || '');
        wrap.querySelectorAll('script, style, button, .a4-type-meta, .block-controls, .drawing-layer, .draw-float-layer, .table-controls, .image-controls').forEach(function(el) {
            el.remove();
        });
        wrap.querySelectorAll('img').forEach(function(img) {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });
        wrap.querySelectorAll('table').forEach(function(tbl) {
            tbl.style.width = '100%';
            tbl.style.borderCollapse = 'collapse';
            tbl.style.margin = '8pt 0';
        });
        return wrap.innerHTML;
    }

    // =========================================================================
    // 1. KOMPONEN BERSAMA: KOP 2 LOGO & BLOK PENGESAHAN TANDA TANGAN
    // =========================================================================
    window.maBangunKopDokumen = function(profil, judulUtama, subJudul) {
        let p = profil || {};
        return '' +
            '<table style="width:100%; border-collapse:collapse; border:none; border-bottom:3px solid #0b3954; margin-bottom:10pt;">' +
                '<tr>' +
                    '<td style="width:15%; text-align:left; border:none; padding:0 8pt 6pt 0; vertical-align:middle;">' +
                        (p.logoSekolah ? '<img src="' + maEsc(p.logoSekolah) + '" width="64" style="height:64px; width:auto;">' : '') +
                    '</td>' +
                    '<td style="width:85%; text-align:center; border:none; padding:0 12pt 6pt 0; vertical-align:middle; line-height:1.28;">' +
                        '<div style="font-size:12.5pt; font-weight:bold; color:#0b3954; text-transform:uppercase;">' + maEsc(judulUtama || 'DOKUMEN ADMINISTRASI PEMBELAJARAN') + '</div>' +
                        '<div style="font-size:11.5pt; font-weight:bold; color:#1f4e79; text-transform:uppercase;">' + maEsc(p.instansi || 'SMAS BODHI DHARMA BATAM') + '</div>' +
                        (subJudul ? ('<div style="font-size:9.5pt; font-weight:bold; color:#333333; margin-top:1pt;">' + maEsc(subJudul) + '</div>') : '') +
                        (p.alamatSekolah ? ('<div style="font-size:8.5pt; color:#555555;">' + maEsc(p.alamatSekolah) + '</div>') : '') +
                    '</td>' +
                '</tr>' +
            '</table>';
    };

    window.maBangunBlokTTD = function(profil, tanggalTeks) {
        let p = profil || {};
        let tgl = tanggalTeks || p.tanggalPengesahan || ((p.kota || 'Batam') + ', Juli 2026');
        return '' +
            '<table class="ttd-tbl">' +
                '<tr>' +
                    '<td style="width:50%; text-align:center; border:none; vertical-align:top;">' +
                        'Mengetahui,<br>Kepala ' + maEsc(p.instansi || 'Sekolah') +
                        '<div style="height:52pt;"></div>' +
                        '<b><u>' + maEsc(p.kepalaSekolah || '.................................') + '</u></b><br>' +
                        'NIP. ' + maEsc(p.nipKepsek || '-') +
                    '</td>' +
                    '<td style="width:50%; text-align:center; border:none; vertical-align:top;">' +
                        maEsc(tgl) + '<br>Guru Mata Pelajaran ' + maEsc(p.mapel || 'Biologi') +
                        '<div style="height:52pt;"></div>' +
                        '<b><u>' + maEsc(p.penyusun || '.................................') + '</u></b><br>' +
                        'NIP. ' + maEsc(p.nipPenyusun || '-') +
                    '</td>' +
                '</tr>' +
            '</table>';
    };

    // =========================================================================
    // 2. DOKUMEN 1: MODUL AJAR DEEP LEARNING (COVER LOGO SEKOLAH KIRI + ISI + LAMPIRAN A-F)
    // =========================================================================
    window.maBangunSectionCover = function(mod, profil) {
        let id = mod.identitas || {};
        let p = profil || {};
        let headerLogoKiri =
            '<table style="width:100%; border:none; border-collapse:collapse; margin:6pt 0 34pt 0;">' +
                '<tr>' +
                    '<td style="width:22%; text-align:left; border:none; vertical-align:middle; padding-right:10pt;">' +
                        (p.logoSekolah ? '<img src="' + maEsc(p.logoSekolah) + '" width="96" style="height:96px; width:auto; object-fit:contain;">' : '') +
                    '</td>' +
                    '<td style="width:78%; text-align:left; border:none; vertical-align:middle; line-height:1.35;">' +
                        '<div style="font-size:15pt; font-weight:bold; color:#0b3954; text-transform:uppercase;">' + maEsc(p.instansi || 'SMAS BODHI DHARMA BATAM') + '</div>' +
                        (p.alamatSekolah ? ('<div style="font-size:9.5pt; color:#444444; margin-top:2pt;">' + maEsc(p.alamatSekolah) + '</div>') : '') +
                        '<div style="font-size:10.5pt; font-weight:bold; color:#1f4e79; margin-top:4pt;">PERENCANAAN PEMBELAJARAN MENDALAM (DEEP LEARNING)</div>' +
                    '</td>' +
                '</tr>' +
            '</table>';

        return '' +
            '<div class="cover-page">' +
                '<div style="border-top:5px solid #0b3954; border-bottom:2px solid #d4a017; height:6pt; margin-bottom:20pt;"></div>' +
                headerLogoKiri +
                '<div style="text-align:center; font-size:28pt; font-weight:bold; color:#0b3954; margin:24pt 0 6pt 0; letter-spacing:1.2px;">MODUL AJAR</div>' +
                '<div style="text-align:center; font-size:17pt; font-weight:bold; color:#1f4e79; margin-bottom:26pt; text-transform:uppercase;">(' + maEsc(id.mapel || p.mapel || 'BIOLOGI') + ')</div>' +
                '<table style="width:88%; margin:0 auto 36pt auto; border:2px solid #0b3954; background:#f4f8fb; border-collapse:collapse;">' +
                    '<tr><td style="padding:16pt 18pt; text-align:center; border:none;">' +
                        '<div style="font-size:15.5pt; font-weight:bold; color:#0b3954; margin-bottom:6pt;">' + maEsc(id.bab || 'BAB MATERI') + '</div>' +
                        (id.materiPokok ? ('<div style="font-size:11pt; color:#333333; line-height:1.45;">' + maEsc(id.materiPokok) + '</div>') : '') +
                    '</td></tr>' +
                '</table>' +
                '<div style="text-align:center; margin-top:28pt; margin-bottom:44pt; line-height:1.7;">' +
                    '<div style="font-size:11.5pt; color:#444444;">Disusun Oleh:</div>' +
                    '<div style="font-size:14pt; font-weight:bold; color:#000000; margin-top:4pt;">' + maEsc(p.penyusun || '-') + '</div>' +
                    (p.nipPenyusun && p.nipPenyusun !== '-' ? ('<div style="font-size:10.5pt; color:#333333;">NIP. ' + maEsc(p.nipPenyusun) + '</div>') : '') +
                '</div>' +
                '<div style="text-align:center; margin-top:46pt; line-height:1.65;">' +
                    '<div style="font-size:13pt; font-weight:bold; color:#0b3954; text-transform:uppercase;">FASE ' + maEsc(id.fase || 'E') + ' / KELAS ' + maEsc(id.kelas || '-') + ' / SEMESTER ' + maEsc(id.semester || '-') + '</div>' +
                    '<div style="font-size:12.5pt; font-weight:bold; color:#0b3954; margin-top:8pt;">TAHUN AJARAN ' + maEsc(id.tahunAjaran || p.tahunAjaran || '2026/2027') + '</div>' +
                '</div>' +
                '<div style="border-top:2px solid #d4a017; border-bottom:5px solid #0b3954; height:6pt; margin-top:38pt;"></div>' +
            '</div>';
    };

    window.maBangunSectionIsiUtama = function(mod, profil) {
        let opsi = mod.opsiExport || {};
        let id = mod.identitas || {};
        let idf = mod.identifikasi || {};
        let des = mod.desain || {};
        let as = mod.asesmen || {};

        let html = window.maBangunKopDokumen(
            profil,
            'PERENCANAAN PEMBELAJARAN MENDALAM (MODUL AJAR)',
            (id.mapel || 'Biologi') + ' • Kelas ' + (id.kelas || '-') + ' (Fase ' + (id.fase || 'E') + ') • Tahun Ajaran ' + (id.tahunAjaran || profil.tahunAjaran || '2026/2027')
        );

        if (opsi.identitas !== false) {
            html += '<div class="sec-heading">I. IDENTITAS MODUL AJAR</div>' +
                '<table class="doc-tbl">' +
                    '<thead><tr><th style="width:30%;">Komponen</th><th style="width:70%;">Keterangan</th></tr></thead>' +
                    '<tbody>' +
                        '<tr><td><b>Penyusun</b></td><td>' + maEsc(profil.penyusun || '-') + '</td></tr>' +
                        '<tr><td><b>Instansi</b></td><td>' + maEsc(profil.instansi || '-') + '</td></tr>' +
                        '<tr><td><b>Tahun Penyusunan</b></td><td>' + maEsc(id.tahunAjaran || profil.tahunAjaran || '-') + '</td></tr>' +
                        '<tr><td><b>Jenjang / Mata Pelajaran</b></td><td>' + maEsc(id.jenjang || 'SMA') + ' / ' + maEsc(id.mapel || 'Biologi') + '</td></tr>' +
                        '<tr><td><b>Fase / Kelas / Semester</b></td><td>Fase ' + maEsc(id.fase || '-') + ' / ' + maEsc(id.kelas || '-') + ' / ' + maEsc(id.semester || '-') + '</td></tr>' +
                        '<tr><td><b>Bab</b></td><td><b>' + maEsc(id.bab || '-') + '</b></td></tr>' +
                        '<tr><td><b>Materi Pokok</b></td><td>' + maFormatParagraf(id.materiPokok, false) + '</td></tr>' +
                        '<tr><td><b>Alokasi Waktu</b></td><td>' + maEsc(id.alokasiWaktu || '-') + '</td></tr>' +
                        '<tr><td><b>Jumlah Murid &amp; Target</b></td><td>' + maEsc(id.jumlahMurid || '-') + ' (' + maEsc(id.targetPeserta || 'Murid Reguler') + ')</td></tr>' +
                    '</tbody>' +
                '</table>';
        }

        if (opsi.identifikasi !== false) {
            let daftarDpl = window.MA_DAFTAR_DPL || [];
            let dplRows = daftarDpl.map(function(item) {
                let st = (idf.dpl && idf.dpl[item.kode]) || { aktif: false, ket: '' };
                let simbol = st.aktif ? '&#9745;' : '&#9744;';
                let ketTampil = st.aktif
                    ? ('<b>' + maEsc(item.nama) + '</b>' + (st.ket ? (' (' + maEsc(st.ket) + ')') : ''))
                    : ('<span style="color:#666666;">' + maEsc(item.nama) + '</span>');
                return '<tr><td style="width:16%; text-align:center;"><b>' + maEsc(item.kode) + '</b></td><td style="width:6%; text-align:center; font-size:13pt;">' + simbol + '</td><td>' + ketTampil + '</td></tr>';
            }).join('');

            html += '<div class="sec-heading">II. IDENTIFIKASI</div>' +
                '<table class="doc-tbl">' +
                    '<thead><tr><th style="width:28%;">Komponen</th><th style="width:72%;">Deskripsi</th></tr></thead>' +
                    '<tbody>' +
                        '<tr><td><b>Kesiapan Murid</b></td><td>' +
                            '<b>Sudah memahami:</b> ' + maFormatParagraf(idf.kesiapanSudah, false) +
                            '<div style="height:5pt;"></div>' +
                            '<b>Belum memahami:</b> ' + maFormatParagraf(idf.kesiapanBelum, false) +
                        '</td></tr>' +
                        '<tr><td><b>Karakteristik Materi Pelajaran</b></td><td>' + maFormatParagraf(idf.karakteristikMateri, false) + '</td></tr>' +
                    '</tbody>' +
                '</table>' +
                '<div class="sub-heading">Dimensi Profil Lulusan (DPL)</div>' +
                '<table class="doc-tbl">' +
                    '<thead><tr><th style="width:16%; text-align:center;">Dimensi</th><th style="width:6%; text-align:center;">Pilih</th><th>Keterangan Kontekstual</th></tr></thead>' +
                    '<tbody>' + dplRows + '</tbody>' +
                '</table>';
        }

        if (opsi.desain !== false) {
            html += '<div class="sec-heading">III. DESAIN PEMBELAJARAN</div>' +
                '<table class="doc-tbl">' +
                    '<thead><tr><th style="width:28%;">Komponen</th><th style="width:72%;">Deskripsi</th></tr></thead>' +
                    '<tbody>' +
                        '<tr><td><b>Capaian Pembelajaran (CP)</b></td><td>' + maFormatParagraf(des.cp, false) + '</td></tr>' +
                        '<tr><td><b>Lintas Disiplin Ilmu</b></td><td>' + maFormatListBaris(des.lintasDisiplin) + '</td></tr>' +
                        '<tr><td><b>Tujuan Pembelajaran (TP)</b></td><td>' + maFormatListBaris(des.tp) + '</td></tr>' +
                        '<tr><td><b>Alur Tujuan Pembelajaran (ATP) / Topik</b></td><td>' + maFormatListBaris(des.topik) + '</td></tr>' +
                        '<tr><td><b>Praktik Pedagogis</b></td><td>' +
                            '<b>Model Pembelajaran:</b> ' + maEsc(des.modelUtama || '-') + '<br>' +
                            '<b>Pendekatan:</b> ' + maEsc(des.pendekatan || '-') + '<br>' +
                            '<b>Mode Pembelajaran:</b> ' + maEsc(des.modePembelajaran || 'Luring') + '<br>' +
                            '<b>Metode Pembelajaran:</b> ' + maEsc(des.metodeUmum || '-') +
                        '</td></tr>' +
                        '<tr><td><b>Kemitraan Pembelajaran</b></td><td>' + maFormatParagraf(des.kemitraan, false) + '</td></tr>' +
                        '<tr><td><b>Lingkungan Pembelajaran</b></td><td>' +
                            '<b>Ruang Fisik:</b> ' + maEsc(des.lingkunganFisik || '-') + '<br>' +
                            '<b>Ruang Virtual:</b> ' + maEsc(des.lingkunganVirtual || '-') + '<br>' +
                            '<b>Budaya Belajar:</b> ' + maEsc(des.budayaBelajar || '-') +
                        '</td></tr>' +
                        '<tr><td><b>Pemanfaatan Digital</b></td><td>' + maFormatParagraf(des.pemanfaatanDigital, false) + '</td></tr>' +
                    '</tbody>' +
                '</table>';
        }

        if (opsi.pengalaman !== false && Array.isArray(mod.pertemuan) && mod.pertemuan.length > 0) {
            html += '<div class="sec-heading">IV. PENGALAMAN BELAJAR</div>';
            mod.pertemuan.forEach(function(pt, idx) {
                let noPt = pt.pertemuanKe || (idx + 1);
                let alokTeks = pt.alokasiTeks || ((Number(pt.jp) || 2) + ' JP (' + ((Number(pt.jp) || 2) * (Number(profil.menitPerJP) || 45)) + ' Menit)');
                let labelSubBab = pt.subBabJudul ? (' — ' + maEsc(pt.subBabJudul)) : '';
                html += '' +
                    '<div class="pert-block">' +
                        '<div class="pert-title">Pertemuan Ke-' + noPt + labelSubBab + '</div>' +
                        '<table class="meta-tbl">' +
                            '<tr><td style="width:24%;"><b>Model Pembelajaran</b></td><td style="width:2%;">:</td><td>' + maEsc(pt.model || '-') + '</td></tr>' +
                            '<tr><td><b>Metode</b></td><td>:</td><td>' + maEsc(pt.metode || '-') + '</td></tr>' +
                            '<tr><td><b>IKTP / Tujuan Pertemuan</b></td><td>:</td><td>' + maEsc(pt.tp || '-') + '</td></tr>' +
                            '<tr><td><b>Alokasi Waktu</b></td><td>:</td><td>' + maEsc(alokTeks) + '</td></tr>' +
                        '</table>' +
                        '<table class="doc-tbl">' +
                            '<thead><tr><th style="width:14%; text-align:center;">Tahapan</th><th style="width:13%; text-align:center;">Alokasi Waktu</th><th style="width:73%;">Kegiatan Guru / Proses Memuliakan Murid</th></tr></thead>' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td style="text-align:center; font-weight:bold; background:#f8fafc;">AWAL</td>' +
                                    '<td style="text-align:center; font-weight:bold;">' + (Number(pt.awalMenit) || 15) + ' MENIT</td>' +
                                    '<td>' + maFormatParagraf(pt.awalIsi, true) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td style="text-align:center; font-weight:bold; background:#f8fafc;">INTI</td>' +
                                    '<td style="text-align:center; font-weight:bold;">' + (Number(pt.intiMenit) || 60) + ' MENIT</td>' +
                                    '<td>' +
                                        '<div class="dl-stage-label">Memahami</div>' +
                                        '<div style="margin-bottom:6pt;">' + maFormatParagraf(pt.intiMemahami, true) + '</div>' +
                                        '<div class="dl-stage-label">Mengaplikasikan</div>' +
                                        '<div style="margin-bottom:6pt;">' + maFormatParagraf(pt.intiMengaplikasikan, true) + '</div>' +
                                        '<div class="dl-stage-label">Merefleksi</div>' +
                                        '<div>' + maFormatParagraf(pt.intiMerefleksi, true) + '</div>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td style="text-align:center; font-weight:bold; background:#f8fafc;">PENUTUP</td>' +
                                    '<td style="text-align:center; font-weight:bold;">' + (Number(pt.penutupMenit) || 15) + ' MENIT</td>' +
                                    '<td>' + maFormatParagraf(pt.penutupIsi, true) + '</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>';
            });
        }

        if (opsi.asesmenRingkas !== false) {
            html += '<div class="sec-heading">V. ASESMEN PEMBELAJARAN</div>' +
                '<table class="doc-tbl">' +
                    '<thead><tr><th style="width:24%;">Jenis Asesmen</th><th style="width:76%;">Deskripsi</th></tr></thead>' +
                    '<tbody>' +
                        '<tr><td><b>Formatif</b></td><td>' + maFormatParagraf(as.ringkasFormatif, false) + '</td></tr>' +
                        '<tr><td><b>Sumatif</b></td><td>' + maFormatParagraf(as.ringkasSumatif, false) + '</td></tr>' +
                        '<tr><td><b>Remedial</b></td><td>' + maFormatParagraf(as.remedial, false) + '</td></tr>' +
                        '<tr><td><b>Pengayaan</b></td><td>' + maFormatParagraf(as.pengayaan, false) + '</td></tr>' +
                    '</tbody>' +
                '</table>';
        }

        if (opsi.pengesahan !== false) {
            html += window.maBangunBlokTTD(profil, id.tanggalPengesahan);
        }

        return html;
    };

    window.maBangunSectionLampiran = function(mod, profil) {
        let opsi = mod.opsiExport || {};
        let id = mod.identitas || {};
        let as = mod.asesmen || {};
        let lkpd = mod.lkpd || {};
        let rub = mod.rubrik || {};

        let adaLampiran = opsi.lampiranAsesmen !== false || opsi.lampiranKisiKisi !== false || opsi.lampiranSoal !== false ||
            opsi.lampiranLkpd !== false || opsi.lampiranRubrik !== false || opsi.lampiranMateri !== false ||
            opsi.lampiranGlosarium !== false || opsi.lampiranPustaka !== false;

        if (!adaLampiran) return '';

        let html = '<div style="text-align:center; font-size:14pt; font-weight:bold; color:#0b3954; margin-bottom:10pt; border-bottom:2px solid #0b3954; padding-bottom:5pt;">DOKUMEN LAMPIRAN MODUL AJAR</div>' +
            '<table class="doc-tbl" style="margin-bottom:14pt;">' +
                '<tbody>' +
                    '<tr><td style="width:26%;"><b>Mata Pelajaran</b></td><td>' + maEsc(id.mapel || 'Biologi') + '</td></tr>' +
                    '<tr><td><b>Fase / Kelas</b></td><td>Fase ' + maEsc(id.fase || 'E') + ' / ' + maEsc(id.kelas || '-') + '</td></tr>' +
                    '<tr><td><b>Bab / Unit / Topik</b></td><td>' + maEsc(id.bab || '-') + '</td></tr>' +
                    '<tr><td><b>Materi Pokok</b></td><td>' + maEsc(id.materiPokok || '-') + '</td></tr>' +
                '</tbody>' +
            '</table>';

        let soalArr = (typeof window.maAmbilSoalTerpilih === 'function') ? window.maAmbilSoalTerpilih(mod) : [];

        if (opsi.lampiranAsesmen !== false || opsi.lampiranKisiKisi !== false || opsi.lampiranSoal !== false) {
            html += '<div class="sec-heading">A. ASESMEN LENGKAP</div>';
        }

        if (opsi.lampiranAsesmen !== false) {
            let dg = as.diagnostik || {};
            let fm = as.formatifDetail || {};
            html += '<div class="sub-heading">1. Asesmen Awal (Diagnostik)</div>' +
                '<table class="doc-tbl">' +
                    '<thead><tr><th style="width:26%;">Komponen</th><th style="width:74%;">Deskripsi</th></tr></thead>' +
                    '<tbody>' +
                        '<tr><td><b>Tujuan</b></td><td>' + maFormatParagraf(dg.tujuan, false) + '</td></tr>' +
                        '<tr><td><b>Waktu Pelaksanaan</b></td><td>' + maEsc(dg.waktu || '-') + '</td></tr>' +
                        '<tr><td><b>Teknik Asesmen</b></td><td>' + maEsc(dg.teknik || '-') + '</td></tr>' +
                        '<tr><td><b>Instrumen</b></td><td>' + maFormatListBaris(dg.instrumen) + '</td></tr>' +
                        '<tr><td><b>Indikator</b></td><td>' + maFormatParagraf(dg.indikator, false) + '</td></tr>' +
                        '<tr><td><b>Pedoman Asesmen</b></td><td>' + maFormatParagraf(dg.pedoman, false) + '</td></tr>' +
                        '<tr><td><b>Interpretasi Hasil</b></td><td>' + maFormatListBaris(dg.interpretasi) + '</td></tr>' +
                        '<tr><td><b>Tindak Lanjut</b></td><td>' + maFormatParagraf(dg.tindakLanjut, false) + '</td></tr>' +
                    '</tbody>' +
                '</table>' +
                '<div class="sub-heading">2. Asesmen Formatif</div>' +
                '<table class="doc-tbl">' +
                    '<thead><tr><th style="width:26%;">Komponen</th><th style="width:74%;">Deskripsi</th></tr></thead>' +
                    '<tbody>' +
                        '<tr><td><b>Tujuan</b></td><td>' + maFormatParagraf(fm.tujuan, false) + '</td></tr>' +
                        '<tr><td><b>Waktu Pelaksanaan</b></td><td>' + maEsc(fm.waktu || '-') + '</td></tr>' +
                        '<tr><td><b>Teknik Asesmen</b></td><td>' + maEsc(fm.teknik || '-') + '</td></tr>' +
                        '<tr><td><b>Instrumen</b></td><td>' + maFormatParagraf(fm.instrumen, false) + '</td></tr>' +
                        '<tr><td><b>Indikator</b></td><td>' + maFormatParagraf(fm.indikator, false) + '</td></tr>' +
                        '<tr><td><b>Pedoman Asesmen</b></td><td>' + maFormatParagraf(fm.pedoman, false) + '</td></tr>' +
                        '<tr><td><b>Interpretasi Hasil</b></td><td>' + maFormatParagraf(fm.interpretasi, false) + '</td></tr>' +
                        '<tr><td><b>Tindak Lanjut</b></td><td>' + maFormatParagraf(fm.tindakLanjut, false) + '</td></tr>' +
                    '</tbody>' +
                '</table>';
        }

        if (opsi.lampiranKisiKisi !== false) {
            html += '<div class="sub-heading">3. Kisi-Kisi Asesmen Sumatif (Akhir Bab)</div>';
            if (soalArr.length === 0) {
                html += '<p style="font-style:italic; color:#555555;">Belum ada paket soal yang ditautkan pada panel Asesmen bab ini.</p>';
            } else {
                let tpLines = String((mod.desain && mod.desain.tp) || '').split(/\r?\n/).map(function(s) { return s.trim(); }).filter(Boolean);
                let totalSkor = 0;
                let kisiRows = soalArr.map(function(q, idx) {
                    let bloom = maDeteksiBloomLokal(q.question, q.type);
                    totalSkor += bloom.skorDefault;
                    let tpAcuan = tpLines.length > 0 ? tpLines[idx % tpLines.length] : ('Mencapai Tujuan Pembelajaran Bab ' + (id.bab || ''));
                    let kunciArr = Array.isArray(q.correct) ? q.correct : [q.correct || '-'];
                    let kunciTampil = kunciArr.filter(Boolean).join(', ') || '-';
                    if (String(q.type || '').toUpperCase() === 'ESSAY' && kunciTampil.length > 45) {
                        kunciTampil = kunciTampil.substring(0, 45) + '...';
                    }
                    return '<tr>' +
                        '<td style="text-align:center;">' + (idx + 1) + '</td>' +
                        '<td>' + maEsc(tpAcuan) + '</td>' +
                        '<td>' + maEsc(maBuatIndikatorRingkas(q.question, bloom.kata)) + '</td>' +
                        '<td style="text-align:center;"><b>' + bloom.level + '</b></td>' +
                        '<td style="text-align:center;">' + maEsc(q.type || 'PG') + '</td>' +
                        '<td style="text-align:center;">' + bloom.skorDefault + '</td>' +
                        '<td style="text-align:center;"><b>' + maEsc(kunciTampil) + '</b></td>' +
                    '</tr>';
                }).join('');

                let kkmVal = Number(as.kkm) || 75;
                html += '<table class="doc-tbl">' +
                    '<thead><tr>' +
                        '<th style="width:5%; text-align:center;">No</th>' +
                        '<th style="width:24%;">Tujuan / Indikator Ketercapaian</th>' +
                        '<th style="width:35%;">Indikator Soal</th>' +
                        '<th style="width:8%; text-align:center;">Level</th>' +
                        '<th style="width:9%; text-align:center;">Bentuk</th>' +
                        '<th style="width:7%; text-align:center;">Skor</th>' +
                        '<th style="width:12%; text-align:center;">Kunci</th>' +
                    '</tr></thead>' +
                    '<tbody>' + kisiRows + '</tbody>' +
                '</table>' +
                '<div style="background:#f8fafc; border:1px solid #cbd5e1; padding:8pt 10pt; margin:6pt 0 12pt 0; font-size:9.5pt; line-height:1.45;">' +
                    '<b>Rumus Nilai Sumatif Murid:</b> (Jumlah Skor Perolehan / ' + totalSkor + ') x 100<br>' +
                    '<b>Kriteria Ketercapaian (KKM = ' + kkmVal + '):</b> ' +
                    '0 - 49: Belum Berkembang (Remedial Total) | ' +
                    '50 - ' + (kkmVal - 1) + ': Mulai Berkembang (Remedial Indikator Belum Tercapai) | ' +
                    kkmVal + ' - 90: Berkembang Sesuai Harapan | ' +
                    '91 - 100: Sangat Berkembang.' +
                '</div>';
            }
        }

        if (opsi.lampiranSoal !== false && soalArr.length > 0) {
            html += '<div class="sub-heading">4. Instrumen Soal Asesmen Sumatif</div>';
            let pgList = soalArr.filter(function(q) { return q.type === 'PG' || q.type === 'PGK'; });
            let isList = soalArr.filter(function(q) { return q.type === 'IS'; });
            let esList = soalArr.filter(function(q) { return q.type === 'Essay'; });

            if (pgList.length > 0) {
                html += '<div style="font-weight:bold; margin:8pt 0 4pt 0; color:#0b3954;">A. Soal Pilihan Ganda / PGK (' + pgList.length + ' Butir)</div>';
                pgList.forEach(function(q, i) {
                    let optsHtml = (q.options || []).map(function(o) {
                        return '<div style="margin-left:16pt; margin-bottom:1.5pt;">' + maEsc(o.label) + '. ' + (o.text || '') + '</div>';
                    }).join('');
                    html += '<div class="soal-item">' +
                        '<div style="margin-bottom:3pt;"><b>' + (i + 1) + '.</b> ' + (q.question || '') + (q.type === 'PGK' ? ' <i>(Pilihan Ganda Kompleks)</i>' : '') + '</div>' +
                        optsHtml +
                    '</div>';
                });
            }
            if (isList.length > 0) {
                html += '<div style="font-weight:bold; margin:10pt 0 4pt 0; color:#0b3954;">B. Soal Isian Singkat (' + isList.length + ' Butir)</div>';
                isList.forEach(function(q, i) {
                    html += '<div class="soal-item"><b>' + (i + 1) + '.</b> ' + (q.question || '') + ' ..............................................</div>';
                });
            }
            if (esList.length > 0) {
                html += '<div style="font-weight:bold; margin:10pt 0 4pt 0; color:#0b3954;">C. Soal Esai / Uraian (' + esList.length + ' Butir)</div>';
                esList.forEach(function(q, i) {
                    html += '<div class="soal-item"><b>' + (i + 1) + '.</b> ' + (q.question || '') + '</div>';
                });
            }
        }

        if (opsi.lampiranLkpd !== false) {
            html += '<div class="page-break"></div>' +
                '<div class="sec-heading">B. LEMBAR KERJA MURID (LKPD / LKM)</div>' +
                '<table class="doc-tbl" style="margin-bottom:10pt;">' +
                    '<tbody>' +
                        '<tr><td style="width:24%;"><b>Topik / Judul LKPD</b></td><td colspan="3"><b>' + maEsc(lkpd.judul || '-') + '</b></td></tr>' +
                        '<tr><td><b>Tujuan Aktivitas</b></td><td colspan="3">' + maFormatParagraf(lkpd.tujuan, false) + '</td></tr>' +
                        '<tr><td><b>Nama Kelompok</b></td><td style="width:32%;">..........................................</td><td style="width:14%;"><b>Kelas / Tgl</b></td><td style="width:30%;">........................... / ................</td></tr>' +
                        '<tr><td><b>Anggota Kelompok</b></td><td colspan="3">1. .............................. &nbsp; 2. .............................. &nbsp; 3. .............................. &nbsp; 4. ..............................</td></tr>' +
                    '</tbody>' +
                '</table>' +
                '<div class="sub-heading">Langkah-Langkah Aktivitas</div>' +
                '<div style="margin-bottom:12pt; line-height:1.5;">' + maFormatListBaris(lkpd.langkah) + '</div>';

            let kasusArr = Array.isArray(lkpd.kasusList) ? lkpd.kasusList : [];
            kasusArr.forEach(function(ks, idx) {
                let cols = String(ks.kolomAmat || 'Identifikasi Masalah|Analisis Biologi|Bukti Data|Solusi Nyata')
                    .split('|').map(function(s) { return s.trim(); }).filter(Boolean);
                if (cols.length === 0) cols = ['Hasil Pengamatan', 'Analisis Konsep', 'Kesimpulan'];

                let colRows = '';
                for (let c = 0; c < cols.length; c += 2) {
                    let kiri = cols[c];
                    let kanan = cols[c + 1] || '';
                    colRows += '<tr>' +
                        '<td style="width:50%; vertical-align:top; height:74pt;"><b>' + maEsc(kiri) + ':</b><br>&nbsp;</td>' +
                        (kanan ? ('<td style="width:50%; vertical-align:top; height:74pt;"><b>' + maEsc(kanan) + ':</b><br>&nbsp;</td>') : '<td style="width:50%; vertical-align:top; height:74pt;"><b>Catatan Tambahan / Kesimpulan:</b><br>&nbsp;</td>') +
                    '</tr>';
                }

                html += '<div class="kasus-box">' +
                    '<div style="background:#0b3954; color:#ffffff; padding:6pt 10pt; font-weight:bold; font-size:10.5pt;">' + maEsc(ks.judul || ('KASUS ' + (idx + 1))) + '</div>' +
                    '<div style="padding:10pt; border:1px solid #0b3954; border-top:none;">' +
                        (ks.gambarUrl ? ('<div style="text-align:center; margin-bottom:8pt;"><img src="' + maEsc(ks.gambarUrl) + '" style="max-width:85%; max-height:220px; border:1px solid #cbd5e1;"></div>') : '') +
                        '<div style="margin-bottom:8pt; text-align:justify; line-height:1.45;">' + maFormatParagraf(ks.narasi, false) + '</div>' +
                        '<div style="font-weight:bold; font-size:9.5pt; margin-bottom:4pt;">Tuliskan hasil penyelidikan dan diskusi kelompok kalian pada tabel berikut:</div>' +
                        '<table class="doc-tbl" style="margin:0;"><tbody>' + colRows + '</tbody></table>' +
                    '</div>' +
                '</div>';
            });
        }

        if (opsi.lampiranRubrik !== false) {
            let kritArr = Array.isArray(rub.kriteriaProyek) ? rub.kriteriaProyek : [];
            let rumusParts = [];
            let kritRows = kritArr.map(function(kr) {
                rumusParts.push('(' + maEsc(kr.nama) + ' x ' + (Number(kr.bobot) || 0) + '%)');
                return '<tr>' +
                    '<td><b>' + maEsc(kr.nama) + '</b><br><span style="font-size:8.5pt; color:#555555;">(Bobot ' + (Number(kr.bobot) || 0) + '%)</span></td>' +
                    '<td>' + maEsc(kr.s4 || '-') + '</td>' +
                    '<td>' + maEsc(kr.s3 || '-') + '</td>' +
                    '<td>' + maEsc(kr.s2 || '-') + '</td>' +
                    '<td>' + maEsc(kr.s1 || '-') + '</td>' +
                '</tr>';
            }).join('');

            let dplRubArr = (Array.isArray(rub.rubrikDpl) && rub.rubrikDpl.length > 0)
                ? rub.rubrikDpl
                : (window.MA_DEFAULT_RUBRIK_DPL || []);

            let dplRubRows = dplRubArr.map(function(rd) {
                return '<tr>' +
                    '<td><b>' + maEsc(rd.aspek) + '</b></td>' +
                    '<td>' + maEsc(rd.bb) + '</td>' +
                    '<td>' + maEsc(rd.mb) + '</td>' +
                    '<td>' + maEsc(rd.bsh) + '</td>' +
                    '<td>' + maEsc(rd.sb) + '</td>' +
                '</tr>';
            }).join('');

            html += '<div class="page-break"></div>' +
                '<div class="sec-heading">C. RUBRIK ASESMEN</div>' +
                '<div class="sub-heading">1. ' + maEsc(rub.judulProyek || 'Rubrik Penilaian Kinerja, LKPD & Produk') + '</div>' +
                '<table class="doc-tbl">' +
                    '<thead><tr>' +
                        '<th style="width:18%;">Kriteria Penilaian</th>' +
                        '<th style="width:20.5%;">Sangat Baik (4)</th>' +
                        '<th style="width:20.5%;">Baik (3)</th>' +
                        '<th style="width:20.5%;">Cukup (2)</th>' +
                        '<th style="width:20.5%;">Perlu Bimbingan (1)</th>' +
                    '</tr></thead>' +
                    '<tbody>' + (kritRows || '<tr><td colspan="5" style="text-align:center;">Belum ada kriteria rubrik.</td></tr>') + '</tbody>' +
                '</table>' +
                (rumusParts.length > 0 ? ('<div style="font-size:9.5pt; background:#f8fafc; border:1px solid #cbd5e1; padding:6pt 10pt; margin:4pt 0 12pt 0;"><b>Rumus Perhitungan Nilai Akhir:</b> ' + rumusParts.join(' + ') + ' (dikonversi ke skala 100)</div>') : '') +
                '<div class="sub-heading">2. Rubrik Observasi Dimensi Profil Lulusan (DPL)</div>' +
                '<table class="doc-tbl">' +
                    '<thead><tr>' +
                        '<th style="width:16%;">Aspek DPL</th>' +
                        '<th style="width:21%;">Belum Berkembang (BB)</th>' +
                        '<th style="width:21%;">Mulai Berkembang (MB)</th>' +
                        '<th style="width:21%;">Berkembang Sesuai Harapan (BSH)</th>' +
                        '<th style="width:21%;">Sangat Berkembang (SB)</th>' +
                    '</tr></thead>' +
                    '<tbody>' + dplRubRows + '</tbody>' +
                '</table>';
        }

        if (opsi.lampiranMateri !== false) {
            html += '<div class="page-break"></div>' +
                '<div class="sec-heading">D. MATERI AJAR (' + maEsc(id.bab || '1 BAB UTUH') + ')</div>';
            let pages = Array.isArray(mod.materiPages) ? mod.materiPages : [];
            if (pages.length === 0 && !mod.materiRingkasanTambahan) {
                html += '<p style="font-style:italic; color:#555555;">Belum ada lembar materi A4 yang tersimpan untuk bab ini. Buka halaman materi bab tersebut lalu klik Simpan atau Tangkap Ulang Lembar A4.</p>';
            } else {
                pages.forEach(function(pg, i) {
                    html += '<div class="materi-section">' +
                        '<div class="sub-heading">' + (i + 1) + '. ' + maEsc(pg.judul) + '</div>' +
                        '<div class="materi-html-body">' + maBersihkanHtmlMateriCetak(pg.html) + '</div>' +
                    '</div>';
                });
                if (mod.materiRingkasanTambahan && mod.materiRingkasanTambahan.trim()) {
                    html += '<div class="sub-heading">Ringkasan / Catatan Tambahan</div>' +
                        '<div style="line-height:1.5; text-align:justify;">' + maFormatParagraf(mod.materiRingkasanTambahan, false) + '</div>';
                }
            }
        }

        if (opsi.lampiranGlosarium !== false) {
            let glosArr = (Array.isArray(mod.glosarium) ? mod.glosarium : [])
                .filter(function(g) { return g && g.istilah && g.istilah.trim(); })
                .slice()
                .sort(function(a, b) { return a.istilah.localeCompare(b.istilah); });

            html += '<div class="sec-heading" style="margin-top:16pt;">E. GLOSARIUM</div>';
            if (glosArr.length === 0) {
                html += '<p style="font-style:italic; color:#555555;">Belum ada daftar istilah glosarium.</p>';
            } else {
                let gRows = glosArr.map(function(g) {
                    return '<tr><td style="width:26%;"><b>' + maEsc(g.istilah) + '</b></td><td>' + maEsc(g.definisi || '-') + '</td></tr>';
                }).join('');
                html += '<table class="doc-tbl">' +
                    '<thead><tr><th style="width:26%;">Istilah</th><th>Definisi</th></tr></thead>' +
                    '<tbody>' + gRows + '</tbody>' +
                '</table>';
            }
        }

        if (opsi.lampiranPustaka !== false) {
            let pusLines = String(mod.daftarPustaka || '').split(/\r?\n/).map(function(s) { return s.trim(); }).filter(Boolean);
            html += '<div class="sec-heading" style="margin-top:16pt;">F. DAFTAR PUSTAKA</div>';
            if (pusLines.length === 0) {
                html += '<p style="font-style:italic; color:#555555;">-</p>';
            } else {
                html += pusLines.map(function(line) {
                    return '<p style="margin:0 0 6pt 24pt; text-indent:-24pt; text-align:justify; line-height:1.45;">' + maEsc(line) + '</p>';
                }).join('');
            }
        }

        return html;
    };

    // =========================================================================
    // 3. DOKUMEN 2: KALENDER PENDIDIKAN & RINCIAN MINGGU EFEKTIF (PORTRAIT)
    // =========================================================================
    window.daBangunDokumenKaldik = function(ctx) {
        let u = ctx.umum || {};
        let kal = ctx.kaldik || { ganjil: [], genap: [] };
        let jpE = (u.jpPerMinggu && Number(u.jpPerMinggu.E)) || 3;
        let jpF = (u.jpPerMinggu && Number(u.jpPerMinggu.F)) || 5;
        let mntJP = Number(u.menitPerJP) || 45;

        function rakitSem(list, labelSem) {
            let tM = 0, tTE = 0, tE = 0;
            let rows = (list || []).map(function(r, idx) {
                let jm = Number(r.jumlahMinggu) || 0;
                let te = Math.min(jm, Number(r.tidakEfektif) || 0);
                let ef = Math.max(0, jm - te);
                tM += jm; tTE += te; tE += ef;
                return '<tr>' +
                    '<td style="text-align:center;">' + (idx + 1) + '</td>' +
                    '<td><b>' + maEsc(r.bulan) + '</b></td>' +
                    '<td style="text-align:center;">' + jm + '</td>' +
                    '<td style="text-align:center;">' + te + '</td>' +
                    '<td style="text-align:center; font-weight:bold; color:#15803d;">' + ef + '</td>' +
                    '<td>' + maEsc(r.ket || '-') + '</td>' +
                '</tr>';
            }).join('');

            return {
                efektif: tE,
                html: '<div class="sub-heading">' + labelSem + '</div>' +
                    '<table class="doc-tbl">' +
                        '<thead><tr>' +
                            '<th style="width:6%; text-align:center;">No</th>' +
                            '<th style="width:18%;">Bulan</th>' +
                            '<th style="width:13%; text-align:center;">Jumlah Minggu</th>' +
                            '<th style="width:14%; text-align:center;">Minggu Tidak Efektif</th>' +
                            '<th style="width:13%; text-align:center;">Minggu Efektif</th>' +
                            '<th style="width:36%;">Keterangan Kegiatan / Hari Libur</th>' +
                        '</tr></thead>' +
                        '<tbody>' + rows +
                            '<tr style="background:#eef6fb; font-weight:bold;">' +
                                '<td colspan="2" style="text-align:center;">JUMLAH</td>' +
                                '<td style="text-align:center;">' + tM + '</td>' +
                                '<td style="text-align:center;">' + tTE + '</td>' +
                                '<td style="text-align:center; color:#15803d;">' + tE + '</td>' +
                                '<td>Fase E: ' + (tE * jpE) + ' JP | Fase F: ' + (tE * jpF) + ' JP</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>'
            };
        }

        let sem1 = rakitSem(kal.ganjil, 'A. Perhitungan Minggu Efektif — Semester I (Ganjil)');
        let sem2 = rakitSem(kal.genap, 'B. Perhitungan Minggu Efektif — Semester II (Genap)');
        let totEf = sem1.efektif + sem2.efektif;

        return window.maBangunKopDokumen(
                u,
                'ANALISIS KALENDER PENDIDIKAN & ALOKASI WAKTU EFEKTIF',
                'Mata Pelajaran ' + (u.mapel || 'Biologi') + ' • Tahun Ajaran ' + (u.tahunAjaran || '2026/2027')
            ) +
            '<table class="meta-tbl" style="margin-bottom:10pt;">' +
                '<tr><td style="width:24%;"><b>Satuan Pendidikan</b></td><td style="width:2%;">:</td><td>' + maEsc(u.instansi || '-') + '</td></tr>' +
                '<tr><td><b>Mata Pelajaran</b></td><td>:</td><td>' + maEsc(u.mapel || 'Biologi') + ' (' + maEsc(u.jenjang || 'SMA') + ')</td></tr>' +
                '<tr><td><b>Tahun Ajaran</b></td><td>:</td><td>' + maEsc(u.tahunAjaran || '-') + '</td></tr>' +
                '<tr><td><b>Alokasi 1 JP</b></td><td>:</td><td>' + mntJP + ' Menit (Fase E: ' + jpE + ' JP/Minggu • Fase F: ' + jpF + ' JP/Minggu)</td></tr>' +
            '</table>' +
            sem1.html +
            sem2.html +
            '<div class="sec-heading">C. REKAPITULASI ALOKASI WAKTU 1 TAHUN AJARAN</div>' +
            '<table class="doc-tbl">' +
                '<thead><tr><th>Fase / Jenjang</th><th style="text-align:center;">JP / Minggu</th><th style="text-align:center;">Minggu Efektif (1 Thn)</th><th style="text-align:center;">Total JP Efektif</th><th style="text-align:center;">Total Menit Efektif</th></tr></thead>' +
                '<tbody>' +
                    '<tr><td><b>Fase E (Kelas X)</b></td><td style="text-align:center;">' + jpE + ' JP</td><td style="text-align:center;">' + totEf + ' Minggu</td><td style="text-align:center;"><b>' + (totEf * jpE) + ' JP</b></td><td style="text-align:center;">' + (totEf * jpE * mntJP) + ' Menit</td></tr>' +
                    '<tr><td><b>Fase F (Kelas XI &amp; XII)</b></td><td style="text-align:center;">' + jpF + ' JP</td><td style="text-align:center;">' + totEf + ' Minggu</td><td style="text-align:center;"><b>' + (totEf * jpF) + ' JP</b></td><td style="text-align:center;">' + (totEf * jpF * mntJP) + ' Menit</td></tr>' +
                '</tbody>' +
            '</table>' +
            '<div class="page-break"></div>' +
            '<div class="sec-heading">D. KALENDER PENDIDIKAN &amp; DAFTAR HARI LIBUR / KEGIATAN (' + maEsc(u.tahunAjaran || '2026/2027') + ')</div>' +
            (typeof window.daRenderGridKalender12BulanHTML === 'function' ? window.daRenderGridKalender12BulanHTML(u.tahunAjaran, true) : '') +
            '<div class="sub-heading" style="margin-top:10pt;">Daftar Rentang Tanggal Libur &amp; Kegiatan Sekolah</div>' +
            '<table class="doc-tbl">' +
                '<thead><tr><th style="width:6%; text-align:center;">No</th><th style="width:26%;">Rentang Tanggal</th><th style="width:20%; text-align:center;">Kategori</th><th style="width:48%;">Penjelasan Acara / Kegiatan</th></tr></thead>' +
                '<tbody>' +
                    ((ctx.kaldikEvents && ctx.kaldikEvents.length > 0)
                        ? ctx.kaldikEvents.map(function(ev, i) {
                            let rTgl = (ev.start === ev.end)
                                ? (typeof window.daFormatTanggalPendek === 'function' ? window.daFormatTanggalPendek(ev.start) : ev.start)
                                : ((typeof window.daFormatTanggalPendek === 'function' ? window.daFormatTanggalPendek(ev.start) : ev.start) + ' s.d. ' + (typeof window.daFormatTanggalPendek === 'function' ? window.daFormatTanggalPendek(ev.end) : ev.end));
                            let kat = ev.type === 'libur' ? '<b style="color:#dc2626;">Libur / Tdk Efektif</b>' : '<b style="color:#7e22ce;">Kegiatan / Ujian</b>';
                            return '<tr><td style="text-align:center;">' + (i + 1) + '</td><td><b>' + maEsc(rTgl) + '</b></td><td style="text-align:center;">' + kat + '</td><td>' + maEsc(ev.title || '-') + '</td></tr>';
                        }).join('')
                        : '<tr><td colspan="4" style="text-align:center; color:#666666; font-style:italic;">Belum ada agenda rentang tanggal yang ditambahkan.</td></tr>') +
                '</tbody>' +
            '</table>' +
            window.maBangunBlokTTD(u, u.tanggalPengesahan);
    };

    // =========================================================================
    // 4. DOKUMEN 3: CP, TP & ATP TERKELOMPOK PER KELAS + HIERARKI (LANDSCAPE A4)
    // =========================================================================
    function daKelompokkanBabPerKelasCetak(babList) {
        let urutan = ['X (Sepuluh)', 'XI (Sebelas)', 'XII (Dua Belas)'];
        let hasil = [];
        urutan.forEach(function(kls) {
            let items = (babList || []).filter(function(b) { return b && b.kelas === kls; });
            if (items.length > 0) hasil.push({ kelas: kls, fase: kls.indexOf('X (') === 0 ? 'E' : 'F', items: items });
        });
        return hasil;
    }

    window.daBangunDokumenCpTpAtp = function(ctx) {
        let u = ctx.umum || {};
        let grupKelas = daKelompokkanBabPerKelasCetak(ctx.babList || []);
        let klsLabel = (ctx.filterKelas && ctx.filterKelas !== 'Semua') ? ('Kelas ' + ctx.filterKelas) : 'Kelas X, XI & XII';

        let faseSet = Array.from(new Set(grupKelas.map(function(g) { return g.fase; })));
        if (faseSet.length === 0) faseSet = ['E', 'F'];

        let cpHtml = faseSet.map(function(f) {
            let teksCp = (u.cpPerFase && u.cpPerFase[f]) ? u.cpPerFase[f] : '-';
            return '<tr><td style="width:14%; text-align:center;"><b>Fase ' + maEsc(f) + '</b></td><td>' + maFormatParagraf(teksCp, false) + '</td></tr>';
        }).join('');

        let rowsAtp = '';
        grupKelas.forEach(function(grp) {
            rowsAtp += '<tr><td colspan="6" style="background:#eaf2f8; color:#0b3954; font-weight:bold; font-size:10.5pt;">KELAS ' + maEsc(grp.kelas.toUpperCase()) + ' — FASE ' + grp.fase + '</td></tr>';
            grp.items.forEach(function(b) {
                let lvl = Number(b.level) || 0;
                let indentPt = lvl * 14;
                let prefix = lvl > 0 ? '&#8627; ' : '';
                let dplAktif = (window.MA_DAFTAR_DPL || []).filter(function(item) {
                    return b.dpl && b.dpl[item.kode] && b.dpl[item.kode].aktif;
                }).map(function(item) { return item.nama; }).join(', ') || '-';

                let kodeTampil = lvl === 0 ? (b.kodeAtp || b.kodeHierarki || '-') : (b.kodeHierarki || '-');
                let adaBarisSubDiBawah = (lvl === 0) && grp.items.some(function(x) { return x.isSubHalaman && x.indukKey === b.pageKey; });
                let iktpGabBab = (lvl === 0 && !adaBarisSubDiBawah && Array.isArray(b.iktpPenyusun) && b.iktpPenyusun.length > 0)
                    ? b.iktpPenyusun.filter(function(it) { return it.iktp; }).map(function(it, i) { return (i + 1) + '. ' + it.iktp.replace(/^\d+[\.\)]\s*/, ''); }).join('\n')
                    : '';
                let teksTpBabCetak = (b.tp && iktpGabBab) ? (b.tp + '\nRincian IKTP Penyusun TP:\n' + iktpGabBab) : (b.tp || iktpGabBab);
                let kolTpIktp = lvl === 0
                    ? ('<b>TP:</b> ' + maFormatListBaris(teksTpBabCetak))
                    : ('<i>IKTP ' + (b.urutanPertemuan || '') + ':</i> ' + maFormatListBaris(b.iktp || b.tp));

                rowsAtp += '<tr style="background:' + (lvl === 0 ? '#ffffff' : '#f8fafc') + ';">' +
                    '<td style="text-align:center;">' + (lvl === 0 ? ('<b>' + maEsc(kodeTampil) + '</b>') : maEsc(kodeTampil)) + '</td>' +
                    '<td style="padding-left:' + (6 + indentPt) + 'pt;">' + prefix + (lvl === 0 ? ('<b>' + maEsc(b.judulHalaman || '-') + '</b>') : maEsc(b.judulHalaman || '-')) +
                        '<br><span style="font-size:8.5pt; color:#555555;">' + maEsc(b.semester || 'I (Ganjil)') + (b.materiPokok ? (' • ' + maEsc(b.materiPokok)) : '') + '</span>' +
                    '</td>' +
                    '<td>' + kolTpIktp + '</td>' +
                    '<td>' + maFormatListBaris(b.atp) + '</td>' +
                    '<td style="text-align:center;"><b>' + (Number(b.totalJP) || 0) + ' JP</b></td>' +
                    '<td style="font-size:9pt;">' + maEsc(dplAktif) + '</td>' +
                '</tr>';
            });
        });

        return window.maBangunKopDokumen(
                u,
                'CAPAIAN PEMBELAJARAN (CP), TUJUAN PEMBELAJARAN (TP) & ALUR TUJUAN PEMBELAJARAN (ATP)',
                (u.mapel || 'Biologi') + ' • ' + klsLabel + ' • Tahun Ajaran ' + (u.tahunAjaran || '2026/2027')
            ) +
            '<div class="sec-heading">I. CAPAIAN PEMBELAJARAN (CP)</div>' +
            '<table class="doc-tbl"><thead><tr><th style="width:14%; text-align:center;">Fase</th><th>Rumusan Capaian Pembelajaran</th></tr></thead><tbody>' + cpHtml + '</tbody></table>' +
            '<div class="sec-heading">II. MATRIKS TUJUAN PEMBELAJARAN (TP) &amp; ALUR TUJUAN PEMBELAJARAN (ATP)</div>' +
            '<table class="doc-tbl">' +
                '<thead><tr>' +
                    '<th style="width:6%; text-align:center;">No</th>' +
                    '<th style="width:20%;">Bab Utama &amp; Sub-Bab</th>' +
                    '<th style="width:26%;">Tujuan Pembelajaran (TP)</th>' +
                    '<th style="width:26%;">Alur Tujuan Pembelajaran (ATP)</th>' +
                    '<th style="width:8%; text-align:center;">JP</th>' +
                    '<th style="width:14%;">Dimensi Profil Lulusan</th>' +
                '</tr></thead>' +
                '<tbody>' + (rowsAtp || '<tr><td colspan="6" style="text-align:center; padding:16pt; color:#666666;">Belum ada bab di dalam Kelas X–XII.</td></tr>') + '</tbody>' +
            '</table>' +
            window.maBangunBlokTTD(u, u.tanggalPengesahan);
    };

    // =========================================================================
    // 5. DOKUMEN 4: PROGRAM TAHUNAN / PROTA TERKELOMPOK PER KELAS (PORTRAIT A4)
    // =========================================================================
    window.daBangunDokumenProta = function(ctx) {
        let u = ctx.umum || {};
        let grupKelas = daKelompokkanBabPerKelasCetak(ctx.babList || []);

        if (grupKelas.length === 0) {
            return window.maBangunKopDokumen(u, 'PROGRAM TAHUNAN (PROTA)', (u.mapel || 'Biologi') + ' • Tahun Ajaran ' + (u.tahunAjaran || '2026/2027')) +
                '<p style="text-align:center; color:#666666; padding:24pt;">Belum ditemukan bab di dalam menu Kelas X, Kelas XI, atau Kelas XII.</p>';
        }

        function rakitSemProta(list, labelSem) {
            let subJP = 0;
            let rows = list.map(function(b) {
                let jp = Number(b.totalJP) || 0;
                subJP += jp;
                let lvl = Number(b.level) || 0;
                let indentPt = lvl * 14;
                let prefix = lvl > 0 ? '&#8627; ' : '';
                let adaSubProta = (lvl === 0) && list.some(function(x) { return x.isSubHalaman && x.indukKey === b.pageKey; });
                let iktpProtaBab = (lvl === 0 && !adaSubProta && Array.isArray(b.iktpPenyusun) && b.iktpPenyusun.length > 0)
                    ? b.iktpPenyusun.filter(function(it) { return it.iktp; }).map(function(it, i) { return (i + 1) + '. ' + it.iktp.replace(/^\d+[\.\)]\s*/, ''); }).join('\n')
                    : '';
                let gabProtaTp = (b.tp && iktpProtaBab) ? (b.tp + '\nRincian IKTP Penyusun TP:\n' + iktpProtaBab) : (b.tp || iktpProtaBab);
                let teksTpProta = lvl === 0
                    ? maFormatListBaris(gabProtaTp)
                    : ('<span style="color:#475569;"><i>IKTP ' + (b.urutanPertemuan || '') + ':</i> ' + maFormatListBaris(b.iktp || b.tp) + '</span>');
                return '<tr style="background:' + (lvl === 0 ? '#ffffff' : '#f8fafc') + ';">' +
                    '<td style="text-align:center;">' + (lvl === 0 ? ('<b>' + maEsc(b.kodeAtp || b.kodeHierarki || '-') + '</b>') : maEsc(b.kodeHierarki || '-')) + '</td>' +
                    '<td style="padding-left:' + (6 + indentPt) + 'pt;">' + prefix + (lvl === 0 ? ('<b>' + maEsc(b.judulHalaman || '-') + '</b>') : maEsc(b.judulHalaman || '-')) + '</td>' +
                    '<td>' + teksTpProta + '</td>' +
                    '<td style="text-align:center;"><b>' + jp + ' JP</b></td>' +
                    '<td style="font-size:9pt;">' + maEsc(b.alokasiWaktu || '-') + '</td>' +
                '</tr>';
            }).join('');

            return {
                subJP: subJP,
                html: '<tr><td colspan="5" style="background:#eaf2f8; font-weight:bold; color:#0b3954;">' + labelSem + '</td></tr>' +
                    (rows || '<tr><td colspan="5" style="text-align:center; color:#666666; font-style:italic;">Belum ada bab pada semester ini.</td></tr>') +
                    '<tr style="background:#f8fafc; font-weight:bold;"><td colspan="3" style="text-align:right;">Subtotal ' + labelSem + '</td><td style="text-align:center; color:#0b3954;">' + subJP + ' JP</td><td></td></tr>'
            };
        }

        return grupKelas.map(function(grp, gIdx) {
            let bGanjil = grp.items.filter(function(b) { return String(b.semester || 'I (Ganjil)').indexOf('Genap') === -1; });
            let bGenap = grp.items.filter(function(b) { return String(b.semester || 'I (Ganjil)').indexOf('Genap') !== -1; });
            let g1 = rakitSemProta(bGanjil, 'SEMESTER I (GANJIL)');
            let g2 = rakitSemProta(bGenap, 'SEMESTER II (GENAP)');
            let totKls = g1.subJP + g2.subJP;

            return (gIdx > 0 ? '<div class="page-break"></div>' : '') +
                window.maBangunKopDokumen(
                    u,
                    'PROGRAM TAHUNAN (PROTA)',
                    (u.mapel || 'Biologi') + ' • Kelas ' + grp.kelas + ' (Fase ' + grp.fase + ') • Tahun Ajaran ' + (u.tahunAjaran || '2026/2027')
                ) +
                '<table class="meta-tbl" style="margin-bottom:10pt;">' +
                    '<tr><td style="width:24%;"><b>Satuan Pendidikan</b></td><td style="width:2%;">:</td><td>' + maEsc(u.instansi || '-') + '</td></tr>' +
                    '<tr><td><b>Mata Pelajaran</b></td><td>:</td><td>' + maEsc(u.mapel || 'Biologi') + '</td></tr>' +
                    '<tr><td><b>Kelas / Fase</b></td><td>:</td><td><b>' + maEsc(grp.kelas) + ' / Fase ' + grp.fase + '</b></td></tr>' +
                    '<tr><td><b>Tahun Ajaran</b></td><td>:</td><td>' + maEsc(u.tahunAjaran || '-') + '</td></tr>' +
                '</table>' +
                '<table class="doc-tbl">' +
                    '<thead><tr>' +
                        '<th style="width:8%; text-align:center;">No</th>' +
                        '<th style="width:28%;">Bab Utama &amp; Sub-Bab</th>' +
                        '<th style="width:39%;">Tujuan Pembelajaran (TP)</th>' +
                        '<th style="width:11%; text-align:center;">Alokasi JP</th>' +
                        '<th style="width:14%;">Keterangan</th>' +
                    '</tr></thead>' +
                    '<tbody>' +
                        g1.html +
                        g2.html +
                        '<tr style="background:#0b3954; color:#ffffff; font-weight:bold;">' +
                            '<td colspan="3" style="text-align:right; color:#ffffff;">TOTAL ALOKASI WAKTU KELAS ' + maEsc(grp.kelas.toUpperCase()) + '</td>' +
                            '<td style="text-align:center; color:#f1c40f;">' + totKls + ' JP</td>' +
                            '<td style="color:#ffffff;">' + grp.items.filter(function(x) { return !x.isSubHalaman; }).length + ' Bab Utama</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +
                window.maBangunBlokTTD(u, u.tanggalPengesahan);
        }).join('');
    };

    // =========================================================================
    // 6. DOKUMEN 5: PROGRAM SEMESTER / PROMES PER KELAS + HIERARKI (LANDSCAPE A4)
    // =========================================================================
    window.daBangunDokumenPromes = function(ctx) {
        let u = ctx.umum || {};
        let semLabel = ctx.filterSemester || 'I (Ganjil)';
        let isGenap = semLabel.indexOf('Genap') !== -1;
        let kalSem = (ctx.kaldik && ctx.kaldik[isGenap ? 'genap' : 'ganjil']) || [];
        let marks = ctx.promesMarks || {};
        let grupKelas = daKelompokkanBabPerKelasCetak(ctx.babList || []);

        if (grupKelas.length === 0) {
            return window.maBangunKopDokumen(u, 'PROGRAM SEMESTER (PROMES) — ' + semLabel.toUpperCase(), (u.mapel || 'Biologi') + ' • Tahun Ajaran ' + (u.tahunAjaran || '2026/2027')) +
                '<p style="text-align:center; color:#666666; padding:24pt;">Belum ditemukan bab di dalam menu Kelas X, Kelas XI, atau Kelas XII.</p>';
        }

        let head1 = '<th rowspan="2" style="width:5%; text-align:center;">No</th>' +
            '<th rowspan="2" style="width:25%;">Bab Utama &amp; Hierarki Sub-Bab</th>' +
            '<th rowspan="2" style="width:5%; text-align:center;">JP</th>';
        let head2 = '';
        let totalColsMinggu = 0;

        kalSem.forEach(function(bl) {
            let mCount = Math.max(4, Math.min(5, Number(bl.jumlahMinggu) || 4));
            totalColsMinggu += mCount;
            head1 += '<th colspan="' + mCount + '" style="text-align:center;">' + maEsc(bl.bulan) + '</th>';
            for (let m = 1; m <= mCount; m++) {
                head2 += '<th style="text-align:center; font-size:8.5pt; padding:3pt 2pt;">' + m + '</th>';
            }
        });

        return grupKelas.map(function(grp, gIdx) {
            let babsSem = grp.items.filter(function(b) {
                return (String(b.semester || 'I (Ganjil)').indexOf('Genap') !== -1) === isGenap;
            });

            let totalJP = 0;
            let rowsHtml = babsSem.map(function(b) {
                let jp = Number(b.totalJP) || 0;
                totalJP += jp;
                let lvl = Number(b.level) || 0;
                let indentPt = lvl * 13;
                let prefix = lvl > 0 ? '&#8627; ' : '';
                let rowBg = lvl === 0 ? '#ffffff' : '#f8fafc';

                let tds = '<td style="text-align:center; background:' + rowBg + ';">' + (lvl === 0 ? ('<b>' + maEsc(b.kodeHierarki || '-') + '</b>') : maEsc(b.kodeHierarki || '-')) + '</td>' +
                    '<td style="padding-left:' + (6 + indentPt) + 'pt; background:' + rowBg + ';">' + prefix + (lvl === 0 ? ('<b>' + maEsc(b.judulHalaman || '-') + '</b>') : maEsc(b.judulHalaman || '-')) + '</td>' +
                    '<td style="text-align:center; background:' + rowBg + ';"><b>' + jp + '</b></td>';

                kalSem.forEach(function(bl) {
                    let mCount = Math.max(4, Math.min(5, Number(bl.jumlahMinggu) || 4));
                    for (let m = 1; m <= mCount; m++) {
                        let k = b.pageKey + '::' + bl.bulan + '::' + m;
                        let v = marks[k] || '';
                        let bg = v === 'P' ? '#22c55e' : (v === 'U' ? '#f59e0b' : (v === 'L' ? '#ef4444' : rowBg));
                        let col = v ? '#ffffff' : '#94a3b8';
                        tds += '<td style="text-align:center; vertical-align:middle; font-weight:bold; font-size:9pt; background:' + bg + '; color:' + col + '; padding:3pt 2pt;">' + maEsc(v) + '</td>';
                    }
                });
                return '<tr>' + tds + '</tr>';
            }).join('');

            return (gIdx > 0 ? '<div class="page-break"></div>' : '') +
                window.maBangunKopDokumen(
                    u,
                    'PROGRAM SEMESTER (PROMES) — ' + semLabel.toUpperCase(),
                    (u.mapel || 'Biologi') + ' • Kelas ' + grp.kelas + ' (Fase ' + grp.fase + ') • Tahun Ajaran ' + (u.tahunAjaran || '2026/2027')
                ) +
                '<table class="doc-tbl" style="font-size:9.5pt;">' +
                    '<thead><tr>' + head1 + '</tr><tr>' + head2 + '</tr></thead>' +
                    '<tbody>' +
                        (rowsHtml || '<tr><td colspan="' + (3 + totalColsMinggu) + '" style="text-align:center; padding:16pt; color:#666666;">Belum ada bab Kelas ' + maEsc(grp.kelas) + ' pada semester ini.</td></tr>') +
                        '<tr style="background:#eef6fb; font-weight:bold;">' +
                            '<td colspan="2" style="text-align:right;">TOTAL JP KELAS ' + maEsc(grp.kelas.toUpperCase()) + ' (' + maEsc(semLabel.toUpperCase()) + ')</td>' +
                            '<td style="text-align:center; color:#0b3954;">' + totalJP + '</td>' +
                            '<td colspan="' + totalColsMinggu + '" style="font-size:9pt;">Keterangan: <span style="background:#22c55e; color:#fff; padding:1pt 5pt;">P = Pembelajaran</span> &nbsp; <span style="background:#f59e0b; color:#fff; padding:1pt 5pt;">U = Asesmen / Ujian</span> &nbsp; <span style="background:#ef4444; color:#fff; padding:1pt 5pt;">L = Libur / Jeda</span></td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +
                window.maBangunBlokTTD(u, u.tanggalPengesahan);
        }).join('');
    };


    // =========================================================================
    // 7. CSS & PEMBUNGKUS UNIVERSAL (PREVIEW, PRINT PDF, & WORD .doc)
    // =========================================================================
    function daBangunStyleDokumen(mode, isLandscape) {
        let baseCss = '' +
            '* { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }' +
            'body { font-family: "Times New Roman", Times, serif; font-size: 10.5pt; color: #111111; line-height: 1.45; margin: 0; padding: 0; background: #ffffff; }' +
            '.sec-heading { font-size: 11.5pt; font-weight: bold; color: #0b3954; background: #eaf2f8; border-left: 4px solid #0b3954; padding: 5pt 9pt; margin: 12pt 0 7pt 0; text-transform: uppercase; page-break-after: avoid; break-after: avoid; }' +
            '.sub-heading { font-size: 10.5pt; font-weight: bold; color: #1f4e79; margin: 9pt 0 4pt 0; page-break-after: avoid; break-after: avoid; }' +
            '.doc-tbl { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt 0; font-size: 10pt; }' +
            '.doc-tbl th { background: #0b3954; color: #ffffff; font-weight: bold; border: 1px solid #334155; padding: 5pt 6pt; text-align: left; vertical-align: middle; }' +
            '.doc-tbl td { border: 1px solid #475569; padding: 4.5pt 6pt; vertical-align: top; text-align: justify; }' +
            '.doc-tbl tr { page-break-inside: avoid; break-inside: avoid; }' +
            '.meta-tbl { width: 100%; border-collapse: collapse; border: none; margin: 3pt 0 6pt 0; font-size: 10pt; }' +
            '.meta-tbl td { border: none; padding: 1.5pt 3pt; vertical-align: top; }' +
            '.pert-block { margin-bottom: 12pt; }' +
            '.pert-title { font-size: 11pt; font-weight: bold; color: #0b3954; border-bottom: 1.5px solid #0b3954; padding-bottom: 2pt; margin: 9pt 0 4pt 0; page-break-after: avoid; break-after: avoid; }' +
            '.dl-stage-label { font-weight: bold; color: #0b3954; text-decoration: underline; margin-bottom: 2pt; }' +
            '.ttd-tbl { width: 100%; border-collapse: collapse; border: none; margin-top: 20pt; page-break-inside: avoid; break-inside: avoid; font-size: 10.5pt; }' +
            '.soal-item { margin-bottom: 7pt; page-break-inside: avoid; break-inside: avoid; text-align: justify; }' +
            '.kasus-box { margin-bottom: 12pt; page-break-inside: avoid; break-inside: avoid; }' +
            '.materi-html-body { font-size: 10.5pt; line-height: 1.5; text-align: justify; }' +
            '.materi-html-body img { max-width: 100% !important; height: auto !important; }' +
            '.materi-html-body table { width: 100% !important; border-collapse: collapse !important; }' +
            '.materi-html-body th, .materi-html-body td { border: 1px solid #64748b !important; padding: 4pt 6pt !important; }' +
            '.kc-12-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; margin: 6pt 0 10pt 0; }' +
            '.kc-month-card { border: 1px solid #475569; page-break-inside: avoid; break-inside: avoid; }' +
            '.kc-month-head { background: #0b3954; color: #ffffff; font-size: 8.5pt; font-weight: bold; text-align: center; padding: 3pt; text-transform: uppercase; }' +
            '.kc-tbl { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 8pt; }' +
            '.kc-tbl th { background: #eef2f7; color: #1e293b; border: 1px solid #cbd5e1; padding: 2pt 0; text-align: center; }' +
            '.kc-tbl th.is-sun, .kc-day.is-sun { color: #dc2626; }' +
            '.kc-tbl td { border: 1px solid #e2e8f0; text-align: center; padding: 2pt 0; }' +
            '.kc-day.is-libur { background: #dc2626; color: #ffffff; font-weight: bold; }' +
            '.kc-day.is-acara { background: #7e22ce; color: #ffffff; font-weight: bold; }' +
            '.page-break { page-break-before: always; break-before: page; }';

        if (mode === 'word') {
            if (isLandscape) {
                return baseCss +
                    '@page SectionLand { size: 841.9pt 595.3pt; mso-page-orientation: landscape; margin: 38pt 42pt 38pt 42pt; }' +
                    'div.SectionLand { page: SectionLand; }';
            }
            return baseCss +
                '@page Section1 { size: 595.3pt 841.9pt; margin: 45pt 50pt 45pt 50pt; }' +
                'div.Section1 { page: Section1; }' +
                '@page Section2 { size: 595.3pt 841.9pt; margin: 48pt 46pt 48pt 52pt; }' +
                'div.Section2 { page: Section2; }' +
                '@page Section3 { size: 595.3pt 841.9pt; margin: 48pt 46pt 48pt 52pt; }' +
                'div.Section3 { page: Section3; }';
        }

        let sheetMaxW = isLandscape ? '1060px' : '794px';
        let pageRule = isLandscape
            ? '@page { size: A4 landscape; margin: 1.3cm 1.4cm 1.3cm 1.4cm; }'
            : '@page { size: A4 portrait; margin: 1.6cm 1.6cm 1.6cm 1.8cm; }';

        if (mode === 'preview') {
            return baseCss +
                'body { background: #cbd5e1; padding: 14px; }' +
                '.preview-paper { max-width: ' + sheetMaxW + '; margin: 0 auto 18px auto; padding: 28px 32px; background: #ffffff; box-shadow: 0 4px 18px rgba(15,23,42,0.16); border-radius: 4px; }' +
                '.page-break { border-top: 2px dashed #94a3b8; margin: 24px -32px; padding-top: 20px; }';
        }

        return baseCss +
            pageRule +
            '.print-topbar { position: sticky; top: 0; z-index: 99; background: #0b3954; color: #fff; padding: 10px 18px; display: flex; justify-content: space-between; align-items: center; font-family: Arial, sans-serif; box-shadow: 0 3px 10px rgba(0,0,0,0.2); }' +
            '.print-topbar button { border: none; border-radius: 20px; padding: 7px 16px; font-weight: bold; cursor: pointer; font-size: 12.5px; margin-left: 8px; }' +
            '.print-sheet-wrap { max-width: ' + sheetMaxW + '; margin: 18px auto 40px auto; padding: 26px 30px; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.14); }' +
            '@media print { body { background: #ffffff !important; } .print-topbar { display: none !important; } .print-sheet-wrap { max-width: none; margin: 0; padding: 0; box-shadow: none; } }';
    }

    window.bangunHtmlDokumenAdministrasi = function(ctx, mode) {
        let docType = (ctx && ctx.docType) || 'modul_ajar';
        let u = (ctx && ctx.umum) || {};
        let isLandscape = (docType === 'cp_tp_atp' || docType === 'promes');
        let judulDoc = 'DOKUMEN ADMINISTRASI';
        let bodyInner = '';

        if (docType === 'modul_ajar') {
            let mod = ctx.modulAjar;
            if (!mod) {
                return '<!DOCTYPE html><html lang="id"><body style="font-family:Poppins,Arial,sans-serif; padding:32px; color:#334155; text-align:center; background:#f8fafc;">' +
                    '<div style="font-size:40px; margin-bottom:10px;">📘</div>' +
                    '<h3 style="margin:0 0 8px 0; color:#0b3954;">Belum Ada Bab Materi yang Dipilih</h3>' +
                    '<p style="font-size:13px; max-width:440px; margin:0 auto; line-height:1.6;">Buka salah satu halaman Bab materi di web (misalnya BAB 1 atau BAB 2), isi panel <b>Desain &amp; Administrasi Bab</b> di baris paling atas, lalu klik <b>Simpan</b> agar muncul di daftar Preview &amp; Export ini.</p>' +
                '</body></html>';
            }
            judulDoc = 'MODUL AJAR - ' + ((mod.identitas && mod.identitas.bab) || 'BIOLOGI');
            let opsi = mod.opsiExport || {};
            let coverHtml = (opsi.cover !== false) ? window.maBangunSectionCover(mod, u) : '';
            let isiHtml = window.maBangunSectionIsiUtama(mod, u);
            let lampHtml = window.maBangunSectionLampiran(mod, u);

            if (mode === 'word') {
                bodyInner = (coverHtml ? ('<div class="Section1">' + coverHtml + '</div><br clear="all" style="page-break-before:always; mso-break-type:section-break">') : '') +
                    '<div class="Section2">' + isiHtml + '</div>' +
                    (lampHtml ? ('<br clear="all" style="page-break-before:always; mso-break-type:section-break"><div class="Section3">' + lampHtml + '</div>') : '');
            } else {
                bodyInner = (coverHtml ? (coverHtml + '<div class="page-break"></div>') : '') +
                    isiHtml +
                    (lampHtml ? ('<div class="page-break"></div>' + lampHtml) : '');
            }
        } else {
            let kontenTunggal = '';
            if (docType === 'kaldik') {
                judulDoc = 'KALDIK & MINGGU EFEKTIF';
                kontenTunggal = window.daBangunDokumenKaldik(ctx);
            } else if (docType === 'cp_tp_atp') {
                judulDoc = 'CP, TP & ATP';
                kontenTunggal = window.daBangunDokumenCpTpAtp(ctx);
            } else if (docType === 'prota') {
                judulDoc = 'PROGRAM TAHUNAN (PROTA)';
                kontenTunggal = window.daBangunDokumenProta(ctx);
            } else if (docType === 'promes') {
                judulDoc = 'PROGRAM SEMESTER (PROMES)';
                kontenTunggal = window.daBangunDokumenPromes(ctx);
            }

            if (mode === 'word') {
                bodyInner = '<div class="' + (isLandscape ? 'SectionLand' : 'Section2') + '">' + kontenTunggal + '</div>';
            } else {
                bodyInner = kontenTunggal;
            }
        }

        if (mode === 'word') {
            return '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
                '<head><meta charset="utf-8"><title>' + maEsc(judulDoc) + '</title>' +
                '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->' +
                '<style>' + daBangunStyleDokumen('word', isLandscape) + '</style></head><body lang="ID">' +
                bodyInner +
                '</body></html>';
        }

        if (mode === 'preview') {
            return '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Preview ' + maEsc(judulDoc) + '</title>' +
                '<style>' + daBangunStyleDokumen('preview', isLandscape) + '</style></head><body>' +
                '<div class="preview-paper">' + bodyInner + '</div>' +
                '</body></html>';
        }

        return '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>' + maEsc(judulDoc) + '</title>' +
            '<style>' + daBangunStyleDokumen('pdf', isLandscape) + '</style></head><body style="background:#cbd5e1;">' +
            '<div class="print-topbar">' +
                '<div><b>🖨️ Cetak A4 ' + (isLandscape ? 'Landscape' : 'Portrait') + '</b> — ' + maEsc(judulDoc) + '</div>' +
                '<div>' +
                    '<button type="button" style="background:#f1c40f; color:#0b3954;" onclick="window.print()">🖨️ Cetak / Save PDF</button>' +
                    '<button type="button" style="background:#e74c3c; color:#ffffff;" onclick="window.close()">✕ Tutup</button>' +
                '</div>' +
            '</div>' +
            '<div class="print-sheet-wrap">' + bodyInner + '</div>' +
            '</body></html>';
    };

    window.exportDokumenAdministrasi = function(format, ctx) {
        let docType = (ctx && ctx.docType) || 'modul_ajar';
        let u = (ctx && ctx.umum) || {};
        let mapel = String(u.mapel || 'BIOLOGI').toUpperCase();
        let namaDasar = docType.toUpperCase() + '_' + mapel;
        if (docType === 'modul_ajar' && ctx.modulAjar && ctx.modulAjar.identitas) {
            namaDasar = 'MODUL_AJAR_' + mapel + '_' + String(ctx.modulAjar.identitas.bab || 'BAB');
        } else if (ctx.filterKelas && ctx.filterKelas !== 'Semua') {
            namaDasar += '_' + ctx.filterKelas;
        }
        let namaFileBersih = namaDasar.toUpperCase().replace(/[^A-Z0-9]+/g, '_');

        if (format === 'word') {
            let wordHtml = window.bangunHtmlDokumenAdministrasi(ctx, 'word');
            let blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = namaFileBersih + '.doc';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function() { URL.revokeObjectURL(url); }, 3000);
            if (typeof window.ckToast === 'function') window.ckToast('📄 File Word (.doc) berhasil diunduh!');
            return;
        }

        let pdfHtml = window.bangunHtmlDokumenAdministrasi(ctx, 'pdf');
        let printWin = window.open('', '_blank', 'width=1020,height=780');
        if (!printWin) return alert('Pop-up diblokir browser. Izinkan pop-up agar jendela cetak PDF dapat terbuka.');

        printWin.document.open();
        printWin.document.write(pdfHtml);
        printWin.document.close();

        let imgs = Array.from(printWin.document.querySelectorAll('img'));
        let sudahPrint = false;
        function mulaiPrint() {
            if (sudahPrint) return;
            sudahPrint = true;
            printWin.focus();
            setTimeout(function() { printWin.print(); }, 400);
        }

        if (imgs.length === 0) {
            mulaiPrint();
        } else {
            let selesai = 0;
            imgs.forEach(function(img) {
                if (img.complete) selesai++;
                else img.onload = img.onerror = function() {
                    selesai++;
                    if (selesai >= imgs.length) mulaiPrint();
                };
            });
            if (selesai >= imgs.length) mulaiPrint();
            else setTimeout(mulaiPrint, 2200);
        }
    };

    // Kompatibilitas mundur jika ada pemanggilan langsung fungsi lama
    window.exportModulAjarDokumen = function(format, mod, profil) {
        window.exportDokumenAdministrasi(format, {
            docType: 'modul_ajar',
            umum: profil || (window.DOC_ADMIN_STATE ? window.DOC_ADMIN_STATE.umum : {}),
            modulAjar: mod
        });
    };
})();