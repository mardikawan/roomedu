/* =========================================================================
   MODUL MANAJER BANK UJIAN, MANAJER BANK LATIHAN (C1/C2/HOTS), KISI-KISI,
   KONTROL UJIAN, LIVE MONITOR, TARIK SOAL, & SMART PARSER DOKUMEN (PDF/DOCX)
   ========================================================================= */

// Bersihkan elemen modal duplikat lama jika masih ada di DOM
document.querySelectorAll('#modal-kontrol-ujian, #modal-live-monitor, #modal-admin-bank-ujian').forEach(function(el) {
    el.remove();
});

window.tempSoalUjianParsed = [];
window.tempBobotUjian = {};
window.selectedBankUjianName = "";
window.adminBankUjianData = window.adminBankUjianData || {};
window.adminBankLatihanData = window.adminBankLatihanData || {};
window.adminUjianAktifData = window.adminUjianAktifData || {};
window.adminLiveMonitorData = window.adminLiveMonitorData || {};
window.modeSimpanBankLatihan = 'new';
window.kunciEditBankLatihan = null;

// =========================================================================
// 1. UI MODAL KISI-KISI & LAZY LOADER MESIN PENALARAN
// =========================================================================
window.bukaModalKisiKisi = function() {
    let pref = JSON.parse(localStorage.getItem('pref_kisi_kisi') || "{}");
    if (pref.jenisUjian) document.getElementById('kisi-jenis-ujian').value = pref.jenisUjian;
    if (pref.tapel) document.getElementById('kisi-tahun-pelajaran').value = pref.tapel;
    if (pref.mapel) document.getElementById('kisi-mapel').value = pref.mapel;
    if (pref.kelasFase) document.getElementById('kisi-kelas-fase').value = pref.kelasFase;
    if (pref.cp) document.getElementById('kisi-cp').value = pref.cp;
    window.bukaModal('modal-kisi-kisi');
};

window.simpanPreferensiKisiKisi = function() {
    let pref = {
        jenisUjian: document.getElementById('kisi-jenis-ujian').value,
        tapel: document.getElementById('kisi-tahun-pelajaran').value,
        mapel: document.getElementById('kisi-mapel').value,
        kelasFase: document.getElementById('kisi-kelas-fase').value,
        cp: document.getElementById('kisi-cp').value
    };
    localStorage.setItem('pref_kisi_kisi', JSON.stringify(pref));
};

window.mulaiGenerateKisiKisi = function() {
    let jenisUjian = document.getElementById('kisi-jenis-ujian').value || "SUMATIF AKHIR SEMESTER (SAS)";
    let tapel = document.getElementById('kisi-tahun-pelajaran').value || "2026/2027";
    let mapel = document.getElementById('kisi-mapel').value || "Biologi";
    let kelasFase = document.getElementById('kisi-kelas-fase').value || "XI (Sebelas) / Fase F";
    let cp = document.getElementById('kisi-cp').value.trim() || "-";

    if (!window.tempSoalUjianParsed || window.tempSoalUjianParsed.length === 0) {
        return alert("⚠️ Belum ada soal yang ditarik/diketik!");
    }

    let btn = document.getElementById('btn-generate-kisi');
    let oldBtnText = btn.innerHTML;
    btn.innerHTML = "⏳ Memuat Mesin Cerdas...";
    btn.disabled = true;

    if (typeof window.eksekusiGenerateKisiKisi === "function") {
        window.eksekusiGenerateKisiKisi(jenisUjian, tapel, mapel, kelasFase, cp);
        btn.innerHTML = oldBtnText;
        btn.disabled = false;
    } else {
        let script = document.createElement('script');
        script.src = './kisi-kisi-engine.js';
        script.onload = function() {
            window.eksekusiGenerateKisiKisi(jenisUjian, tapel, mapel, kelasFase, cp);
            btn.innerHTML = oldBtnText;
            btn.disabled = false;
        };
        script.onerror = function() {
            alert("❌ Gagal memuat mesin kisi-kisi. Pastikan file kisi-kisi-engine.js tersedia.");
            btn.innerHTML = oldBtnText;
            btn.disabled = false;
        };
        document.body.appendChild(script);
    }
};

// =========================================================================
// 2. RUANG MANAJER UJIAN TERPADU & KALKULATOR BOBOT OTOMATIS
// =========================================================================
window.bukaTabManajerUjian = function(tabId, btnElement) {
    document.querySelectorAll('.ujian-tab-content').forEach(function(el) {
        el.style.display = 'none';
    });

    let targetEl = document.getElementById(tabId);
    if (targetEl) {
        targetEl.style.display = 'flex';
    }

    document.querySelectorAll('.tab-ujian-btn').forEach(function(btn) {
        btn.style.background = '#ffffff';
        btn.style.color = '#333';
        btn.style.border = '1px solid #ccc';
        btn.style.boxShadow = 'none';
    });

    let activeBtn = btnElement || document.querySelector('[onclick*="' + tabId + '"]');
    if (activeBtn) {
        activeBtn.style.background = '#0b3954';
        activeBtn.style.color = 'white';
        activeBtn.style.border = 'none';
    }

    if (tabId === 'tab-ujian-bank') {
        window.renderDropdownBankUjianTersimpan();
    } else if (tabId === 'tab-ujian-kontrol') {
        window.renderKontrolUjian();
    } else if (tabId === 'tab-ujian-monitor') {
        window.muatDropdownLiveMonitor();
        window.renderIsiLiveMonitor();
    }
    window.updateHeaderInfoManajerUjian();
};

window.updateHeaderInfoManajerUjian = function() {
    let totalBank = Object.keys(window.adminBankUjianData || {}).length;
    let totalAktif = Object.keys(window.adminUjianAktifData || {}).length;
    let elBank = document.getElementById('info-total-bank-ujian');
    let elAktif = document.getElementById('info-total-ujian-aktif');
    if (elBank) elBank.innerText = totalBank;
    if (elAktif) elAktif.innerText = totalAktif;
};

window.konversiSoalKeTeksMentah = function(soalArr) {
    if (!Array.isArray(soalArr) || soalArr.length === 0) return "";
    return soalArr.map(function(q) {
        let lines = [];
        lines.push("Soal: " + (q.question || "").replace(/<br\s*\/?>/gi, "\n"));
        if (q.type === 'IS') {
            lines.push("Tipe: IS");
            lines.push("Kunci: " + (q.correct || []).join(" | "));
        } else if (q.type === 'Essay') {
            lines.push("Tipe: Essay");
            lines.push("Kunci: " + (q.correct || []).join(" "));
        } else if (q.type === 'PGK') {
            let normKunci = window.normalisasiKunciPGK(q.correct || [], q.options || []);
            (q.options || []).forEach(function(opt, idx) {
                let lbl = (opt && opt.label) ? String(opt.label).toUpperCase() : String.fromCharCode(65 + idx);
                let txt = (opt && opt.text !== undefined) ? opt.text : String(opt || "");
                let isBenar = normKunci.includes(lbl);
                lines.push(lbl + ". " + txt + (isBenar ? " (benar)" : " (salah)"));
            });
            if (normKunci.length > 0) {
                lines.push("Kunci: " + normKunci.join(", "));
            }
        } else {
            (q.options || []).forEach(function(opt, idx) {
                let lbl = (opt && opt.label) ? opt.label : String.fromCharCode(65 + idx);
                let txt = (opt && opt.text !== undefined) ? opt.text : String(opt || "");
                lines.push(lbl + ". " + txt);
            });
            lines.push("Kunci: " + ((q.correct && q.correct[0]) ? q.correct[0] : "A"));
        }
        if (q.explanation) {
            lines.push("Pembahasan: " + q.explanation);
        }
        return lines.join("\n");
    }).join("\n\n");
};

window.renderDropdownBankUjianTersimpan = function() {
    let sel = document.getElementById('select-bank-ujian-tersimpan');
    if (!sel) return;

    let bank = window.adminBankUjianData || {};
    let keys = Object.keys(bank).sort();
    let html = '<option value="">-- Buat Paket Baru / Pilih Bank Ujian Tersimpan --</option>';

    keys.forEach(function(nama) {
        let pkt = bank[nama];
        let soalArr = (pkt && pkt.soal) ? pkt.soal : [];
        let c = { PG: 0, PGK: 0, IS: 0, Essay: 0 };
        soalArr.forEach(function(q) { if (c[q.type] !== undefined) c[q.type]++; });

        let rincian = c.PG + ' PG' + (c.PGK > 0 ? ', ' + c.PGK + ' PGK' : '') + ', ' + c.IS + ' IS, dan ' + c.Essay + ' Essay';
        let selected = (nama === window.selectedBankUjianName) ? 'selected' : '';
        html += '<option value="' + nama.replace(/"/g, '&quot;') + '" ' + selected + '>' + nama + ' — ' + soalArr.length + ' Soal (' + rincian + ')</option>';
    });

    sel.innerHTML = html;
    window.updateHeaderInfoManajerUjian();
};

window.pilihBankUjianTersimpan = function(namaPaket) {
    window.selectedBankUjianName = namaPaket || "";
    let inputNama = document.getElementById('admin-bu-nama');
    let inputText = document.getElementById('admin-bu-text');
    let inPG = document.getElementById('bobot-pg');
    let inPGK = document.getElementById('bobot-pgk');
    let inIS = document.getElementById('bobot-is');
    let inES = document.getElementById('bobot-es');

    if (!namaPaket || !window.adminBankUjianData || !window.adminBankUjianData[namaPaket]) {
        if (inputNama) inputNama.value = "";
        if (inputText) inputText.value = "";
        if (inPG) inPG.value = "";
        if (inPGK) inPGK.value = "";
        if (inIS) inIS.value = "";
        if (inES) inES.value = "";
        window.analisisSoalOtomatis();
        return;
    }

    let pkt = window.adminBankUjianData[namaPaket];
    if (inputNama) inputNama.value = namaPaket;
    if (inputText) inputText.value = window.konversiSoalKeTeksMentah(pkt.soal || []);

    if (pkt.bobot) {
        if (inPG) inPG.value = pkt.bobot.PG ? Number(pkt.bobot.PG.toFixed(2)) : "";
        if (inPGK) inPGK.value = pkt.bobot.PGK ? Number(pkt.bobot.PGK.toFixed(2)) : "";
        if (inIS) inIS.value = pkt.bobot.IS ? Number(pkt.bobot.IS.toFixed(2)) : "";
        if (inES) inES.value = pkt.bobot.Essay ? Number(pkt.bobot.Essay.toFixed(2)) : "";
    }

    window.analisisSoalOtomatis();
};

window.analisisSoalOtomatis = function() {
    let rawTextEl = document.getElementById('admin-bu-text');
    if (!rawTextEl) return;
    let rawText = rawTextEl.value;
    let infoBox = document.getElementById('info-analisis-soal');
    let bobotBox = document.getElementById('box-bobot-soal');
    let previewWrap = document.getElementById('preview-bank-ujian-wrapper');

    let blocks = rawText.split(/\n\s*\n|\n---\n/);
    let questions = [];
    let reBenarAkhir = /[\(\[]\s*benar\s*[\)\]][\.\;\,\s]*(?![\s\S])/i;
    let reSalahAkhir = /[\(\[]\s*salah\s*[\)\]][\.\;\,\s]*(?![\s\S])/i;

    blocks.forEach(function(block) {
        let lines = block.trim().split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
        if (lines.length === 0) return;

        let qObj = { type: 'PG', question: '', options: [], correct: [], explanation: '' };
        let isParsingOptions = false;

        lines.forEach(function(line) {
            let lowerLine = line.toLowerCase();

            if (lowerLine.startsWith('soal:')) {
                qObj.question = line.substring(5).trim();
            } else if (lowerLine.startsWith('tipe:')) {
                let type = lowerLine.substring(5).trim();
                if (type === 'is' || type === 'isian singkat' || type === 'isian') qObj.type = 'IS';
                else if (type === 'essay' || type === 'esai' || type === 'uraian') qObj.type = 'Essay';
                else if (type === 'pgk' || type.indexOf('kompleks') !== -1) qObj.type = 'PGK';
            } else if (lowerLine.startsWith('kunci:')) {
                isParsingOptions = false;
                let kunciStr = line.substring(6).trim();
                if (qObj.type === 'IS') {
                    qObj.correct = kunciStr.split('|').map(function(s) { return s.trim(); });
                } else if (qObj.type === 'Essay') {
                    qObj.correct = [kunciStr];
                } else {
                    let normHuruf = window.normalisasiKunciPGK(kunciStr, qObj.options);
                    if (qObj.type === 'PGK' || normHuruf.length > 1) {
                        qObj.type = 'PGK';
                        if (normHuruf.length > 0) {
                            qObj.correct = Array.from(new Set(qObj.correct.concat(normHuruf))).sort();
                        }
                    } else if (normHuruf.length === 1) {
                        qObj.correct = [normHuruf[0]];
                    } else {
                        let cleanKunci = kunciStr.toUpperCase();
                        qObj.correct = [cleanKunci.replace(/[^A-E]/g, '').charAt(0) || cleanKunci];
                    }
                }
            } else if (lowerLine.startsWith('pembahasan:')) {
                isParsingOptions = false;
                qObj.explanation = line.substring(11).trim();
            } else if (/^[a-eA-E][\.\)]/.test(line)) {
                isParsingOptions = true;
                let optLabel = line.charAt(0).toUpperCase();
                let optText = line.substring(2).trim();

                if (reBenarAkhir.test(optText)) {
                    qObj.type = 'PGK';
                    optText = optText.replace(reBenarAkhir, '').trim();
                    qObj.correct.push(optLabel);
                } else if (reSalahAkhir.test(optText)) {
                    qObj.type = 'PGK';
                    optText = optText.replace(reSalahAkhir, '').trim();
                }

                qObj.options.push({ label: optLabel, text: optText });
            } else {
                if (isParsingOptions && qObj.options.length > 0) {
                    let lastOpt = qObj.options[qObj.options.length - 1];
                    let gabungan = lastOpt.text + ' ' + line;
                    if (reBenarAkhir.test(gabungan)) {
                        qObj.type = 'PGK';
                        gabungan = gabungan.replace(reBenarAkhir, '').trim();
                        qObj.correct.push(lastOpt.label);
                    } else if (reSalahAkhir.test(gabungan)) {
                        qObj.type = 'PGK';
                        gabungan = gabungan.replace(reSalahAkhir, '').trim();
                    }
                    lastOpt.text = gabungan;
                } else if (qObj.explanation) {
                    qObj.explanation += ' ' + line;
                } else if (qObj.question && qObj.options.length === 0) {
                    qObj.question += '<br>' + line;
                }
            }
        });

        if (qObj.type === 'PGK') qObj.correct = window.normalisasiKunciPGK(qObj.correct, qObj.options);
        if (qObj.question) questions.push(qObj);
    });

    window.tempSoalUjianParsed = questions;

    let counts = { 'PG': 0, 'PGK': 0, 'IS': 0, 'Essay': 0 };
    questions.forEach(function(q) { if (counts[q.type] !== undefined) counts[q.type]++; });

    if (questions.length === 0) {
        if (infoBox) infoBox.style.display = 'block';
        if (bobotBox) bobotBox.style.display = 'none';
        if (previewWrap) previewWrap.style.display = 'none';
        return;
    }

    if (infoBox) infoBox.style.display = 'none';
    if (bobotBox) bobotBox.style.display = 'flex';

    document.getElementById('row-pg').style.display = counts['PG'] > 0 ? 'flex' : 'none';
    document.getElementById('row-pgk').style.display = counts['PGK'] > 0 ? 'flex' : 'none';
    document.getElementById('row-is').style.display = counts['IS'] > 0 ? 'flex' : 'none';
    document.getElementById('row-es').style.display = counts['Essay'] > 0 ? 'flex' : 'none';

    document.getElementById('jml-pg').innerText = counts['PG'];
    document.getElementById('jml-pgk').innerText = counts['PGK'];
    document.getElementById('jml-is').innerText = counts['IS'];
    document.getElementById('jml-es').innerText = counts['Essay'];

    window.kalkulasiBobotOtomatis();
    window.renderPreviewSoalUjianKanan(questions, counts);
};

window.renderPreviewSoalUjianKanan = function(questions, counts) {
    let wrap = document.getElementById('preview-bank-ujian-wrapper');
    let listEl = document.getElementById('preview-bank-ujian-list');
    let titleEl = document.getElementById('preview-bu-title');
    let sumEl = document.getElementById('preview-bu-summary');
    let btnHapusBank = document.getElementById('btn-hapus-bank-terpilih');
    if (!wrap || !listEl) return;

    wrap.style.display = 'block';
    let namaPaket = (document.getElementById('admin-bu-nama') && document.getElementById('admin-bu-nama').value.trim()) || window.selectedBankUjianName || "Draft Paket Ujian";
    if (titleEl) titleEl.innerText = namaPaket;

    let rincian = counts.PG + ' PG' + (counts.PGK > 0 ? ', ' + counts.PGK + ' PGK' : '') + ', ' + counts.IS + ' IS, dan ' + counts.Essay + ' Essay';
    if (sumEl) sumEl.innerText = '📊 Total: ' + questions.length + ' Soal (' + rincian + ')';

    let isSavedBank = Boolean(window.selectedBankUjianName && window.adminBankUjianData && window.adminBankUjianData[window.selectedBankUjianName]);
    if (btnHapusBank) btnHapusBank.style.display = isSavedBank ? 'inline-block' : 'none';

    let html = '';
    questions.forEach(function(q, idx) {
        let badgeBg = q.type === 'PG' ? '#3498db' : (q.type === 'PGK' ? '#8e44ad' : (q.type === 'IS' ? '#f39c12' : '#e67e22'));
        let opsiStr = '';
        if (q.options && q.options.length > 0) {
            opsiStr = 'Opsi: ' + q.options.map(function(o) { return o.label + '. ' + o.text; }).join(' | ') + ' — ';
        }
        let kunciStr = (q.correct && q.correct.length > 0) ? q.correct.join(', ') : '-';

        html += '<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">' +
            '<div style="flex:1; min-width:0;">' +
                '<div style="font-size:12px; font-weight:bold; color:#1e293b; margin-bottom:4px; line-height:1.4;">' +
                    (idx + 1) + '. <span style="background:' + badgeBg + '; color:white; padding:1px 6px; border-radius:4px; font-size:10px; margin:0 4px;">' + q.type + '</span> ' +
                    q.question +
                '</div>' +
                '<div style="font-size:11px; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
                    opsiStr + '<span style="color:#16a085; font-weight:bold;">Kunci: ' + kunciStr + '</span>' +
                '</div>' +
            '</div>' +
            '<button style="background:#fadbd8; color:#c0392b; border:none; border-radius:6px; width:28px; height:28px; cursor:pointer; font-size:12px; flex-shrink:0;" title="Hapus Soal Nomor ' + (idx + 1) + '" onclick="window.hapusSatuSoalPreviewUjian(' + idx + ')">🗑️</button>' +
        '</div>';
    });

    listEl.innerHTML = html;
};

window.hapusSatuSoalPreviewUjian = function(idx) {
    if (!window.tempSoalUjianParsed || !window.tempSoalUjianParsed[idx]) return;
    if (!confirm('Hapus soal nomor ' + (idx + 1) + ' dari paket ini?')) return;

    window.tempSoalUjianParsed.splice(idx, 1);
    let inputText = document.getElementById('admin-bu-text');
    if (inputText) {
        inputText.value = window.konversiSoalKeTeksMentah(window.tempSoalUjianParsed);
    }
    window.analisisSoalOtomatis();

    if (window.selectedBankUjianName && window.adminBankUjianData && window.adminBankUjianData[window.selectedBankUjianName]) {
        window.adminBankUjianData[window.selectedBankUjianName].soal = window.tempSoalUjianParsed;
        window.adminBankUjianData[window.selectedBankUjianName].bobot = window.tempBobotUjian;
        if (typeof window.simpanBankUjianKeDB === "function") window.simpanBankUjianKeDB();
        window.renderDropdownBankUjianTersimpan();
    }
};

window.cetakPreviewBankUjian = function(format) {
    let judul = (document.getElementById('admin-bu-nama') && document.getElementById('admin-bu-nama').value.trim()) || window.selectedBankUjianName || "Soal Ujian";
    if (typeof window.cetakDokumenUniversal === "function") {
        window.cetakDokumenUniversal(format, judul, window.tempSoalUjianParsed);
    }
};

window.hapusBankUjianTerpilih = function() {
    let target = window.selectedBankUjianName;
    if (!target || !window.adminBankUjianData || !window.adminBankUjianData[target]) return;
    if (confirm('Yakin ingin menghapus Bank Ujian "' + target + '" secara permanen?')) {
        delete window.adminBankUjianData[target];
        window.selectedBankUjianName = "";
        window.pilihBankUjianTersimpan("");
        window.renderDropdownBankUjianTersimpan();
        if (typeof window.simpanBankUjianKeDB === "function") window.simpanBankUjianKeDB();
    }
};

window.kalkulasiBobotOtomatis = function() {
    let maxScore = 100;

    let cPG = parseInt(document.getElementById('jml-pg').innerText) || 0;
    let cPGK = parseInt(document.getElementById('jml-pgk').innerText) || 0;
    let cIS = parseInt(document.getElementById('jml-is').innerText) || 0;
    let cES = parseInt(document.getElementById('jml-es').innerText) || 0;

    let inPG = document.getElementById('bobot-pg').value;
    let inPGK = document.getElementById('bobot-pgk').value;
    let inIS = document.getElementById('bobot-is').value;
    let inES = document.getElementById('bobot-es').value;

    let usedScore = 0;
    let totalQuestionsInEmptyTypes = 0;

    if (cPG > 0) { if (inPG !== "") usedScore += cPG * parseFloat(inPG); else totalQuestionsInEmptyTypes += cPG; }
    if (cPGK > 0) { if (inPGK !== "") usedScore += cPGK * parseFloat(inPGK); else totalQuestionsInEmptyTypes += cPGK; }
    if (cIS > 0) { if (inIS !== "") usedScore += cIS * parseFloat(inIS); else totalQuestionsInEmptyTypes += cIS; }
    if (cES > 0) { if (inES !== "") usedScore += cES * parseFloat(inES); else totalQuestionsInEmptyTypes += cES; }

    let sisaScore = maxScore - usedScore;
    let calculatedScorePerItem = 0;

    if (totalQuestionsInEmptyTypes > 0 && sisaScore > 0) {
        calculatedScorePerItem = sisaScore / totalQuestionsInEmptyTypes;
    }

    document.getElementById('bobot-pg').placeholder = (cPG > 0 && inPG === "") ? calculatedScorePerItem.toFixed(1) : "";
    document.getElementById('bobot-pgk').placeholder = (cPGK > 0 && inPGK === "") ? calculatedScorePerItem.toFixed(1) : "";
    document.getElementById('bobot-is').placeholder = (cIS > 0 && inIS === "") ? calculatedScorePerItem.toFixed(1) : "";
    document.getElementById('bobot-es').placeholder = (cES > 0 && inES === "") ? calculatedScorePerItem.toFixed(1) : "";

    let finalTotal = usedScore + (totalQuestionsInEmptyTypes * calculatedScorePerItem);

    let totalEl = document.getElementById('total-poin-bobot');
    totalEl.innerText = parseFloat(finalTotal.toFixed(2));

    let btnSimpan = document.getElementById('btn-simpan-bank-ujian');

    if (Math.abs(finalTotal - 100) > 0.01 || finalTotal < 0) {
        totalEl.style.color = '#c0392b';
        totalEl.parentElement.style.borderColor = '#c0392b';
        totalEl.parentElement.style.background = '#fadbd8';
        btnSimpan.disabled = true;
        btnSimpan.style.background = '#bdc3c7';
        btnSimpan.style.cursor = 'not-allowed';
        btnSimpan.innerText = "Total Harus 100 Poin ⚠️";
    } else {
        totalEl.style.color = '#16a085';
        totalEl.parentElement.style.borderColor = '#16a085';
        totalEl.parentElement.style.background = '#e8f8f5';
        btnSimpan.disabled = false;
        btnSimpan.style.background = '#e67e22';
        btnSimpan.style.cursor = 'pointer';
        btnSimpan.innerText = "Simpan Ke Bank Ujian 💾";
    }

    window.tempBobotUjian = {
        'PG': inPG !== "" ? parseFloat(inPG) : calculatedScorePerItem,
        'PGK': inPGK !== "" ? parseFloat(inPGK) : calculatedScorePerItem,
        'IS': inIS !== "" ? parseFloat(inIS) : calculatedScorePerItem,
        'Essay': inES !== "" ? parseFloat(inES) : calculatedScorePerItem
    };
};

window.simpanPaketUjianSistem = function() {
    let namaPaket = document.getElementById('admin-bu-nama').value.trim();
    if (!namaPaket) return alert("Nama paket ujian tidak boleh kosong!");
    if (window.tempSoalUjianParsed.length === 0) return alert("Belum ada soal yang terdeteksi!");

    window.adminBankUjianData[namaPaket] = {
        soal: window.tempSoalUjianParsed,
        bobot: window.tempBobotUjian,
        tanggalDibuat: new Date().toISOString()
    };

    window.selectedBankUjianName = namaPaket;
    window.renderDropdownBankUjianTersimpan();
    window.analisisSoalOtomatis();

    if (typeof window.simpanBankUjianKeDB === "function") window.simpanBankUjianKeDB();
    alert('✅ Paket ujian "' + namaPaket + '" berhasil disimpan ke Bank Ujian!');
};

window.renderManajerUjian = function() {
    window.renderDropdownBankUjianTersimpan();
    window.renderKontrolUjian();
    window.updateHeaderInfoManajerUjian();
};

window.hapusPaketUjian = function(namaPaket) {
    if (confirm('Yakin ingin menghapus paket ujian "' + namaPaket + '" secara permanen?')) {
        delete window.adminBankUjianData[namaPaket];
        if (window.selectedBankUjianName === namaPaket) {
            window.selectedBankUjianName = "";
            window.pilihBankUjianTersimpan("");
        }
        window.renderManajerUjian();
        if (typeof window.simpanBankUjianKeDB === "function") window.simpanBankUjianKeDB();
    }
};

window.editPaketUjian = function(namaPaket) {
    window.bukaModal('modal-manajer-ujian');
    window.bukaTabManajerUjian('tab-ujian-bank');
    window.pilihBankUjianTersimpan(namaPaket);
};

// =========================================================================
// 3. MANAJER BANK LATIHAN MANDIRI (GROUPING C1, C2, HOTS)
// =========================================================================
window.adminLatihanSettings = window.adminLatihanSettings || null;

window.normalisasiTopikLatihan = function(rawTopik) {
    let s = String(rawTopik || "").trim();
    return s ? s : "Umum";
};

window.kunciCachePengaturanLatihan = function() {
    let guru = (window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika").trim().toLowerCase();
    return "pref_latihan_settings_" + guru;
};

window.apakahAcakSoalLatihanAktif = function() {
    if (window.adminLatihanSettings && typeof window.adminLatihanSettings.acakSoal === "boolean") {
        return window.adminLatihanSettings.acakSoal;
    }
    try {
        let raw = localStorage.getItem(window.kunciCachePengaturanLatihan());
        if (raw) {
            let parsed = JSON.parse(raw);
            if (parsed && typeof parsed.acakSoal === "boolean") {
                window.adminLatihanSettings = parsed;
                return parsed.acakSoal;
            }
        }
    } catch (e) {}
    return false;
};

window.perbaruiTombolAcakLatihanUI = function() {
    let btn = document.getElementById("btn-toggle-acak-latihan");
    let lbl = document.getElementById("lbl-toggle-acak-latihan");
    let aktif = window.apakahAcakSoalLatihanAktif();
    if (btn) {
        btn.classList.toggle("is-on", aktif);
        btn.classList.toggle("is-off", !aktif);
    }
    if (lbl) {
        lbl.innerText = aktif ? "🔀 Acak Soal: AKTIF" : "🔀 Acak Soal: MATI";
    }
};

window.muatPengaturanLatihanDariServer = function(forceRefresh, onDone) {
    let guru = (window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika").trim().toLowerCase();
    let pathDB = "data_guru/" + guru + "/admin_latihan_settings";
    window.perbaruiTombolAcakLatihanUI();

    if (typeof window.bacaDataRestFirebase !== "function") {
        if (onDone) onDone();
        return;
    }

    window.bacaDataRestFirebase(pathDB, function(val) {
        if (val && typeof val === "object") {
            window.adminLatihanSettings = { acakSoal: Boolean(val.acakSoal) };
            try {
                localStorage.setItem(window.kunciCachePengaturanLatihan(), JSON.stringify(window.adminLatihanSettings));
            } catch (e) {}
        }
        window.perbaruiTombolAcakLatihanUI();
        if (onDone) onDone();
    }, function() {
        window.perbaruiTombolAcakLatihanUI();
        if (onDone) onDone();
    }, { forceRefresh: Boolean(forceRefresh), ttlMs: forceRefresh ? 0 : 60000 });
};

window.toggleAcakSoalLatihan = function() {
    let baru = !window.apakahAcakSoalLatihanAktif();
    window.adminLatihanSettings = { acakSoal: baru, updatedAt: new Date().toISOString() };
    try {
        localStorage.setItem(window.kunciCachePengaturanLatihan(), JSON.stringify(window.adminLatihanSettings));
    } catch (e) {}

    window.perbaruiTombolAcakLatihanUI();

    let guru = (window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika").trim().toLowerCase();
    let pathDB = "data_guru/" + guru + "/admin_latihan_settings";
    if (typeof window.tulisDataRestFirebase === "function") {
        window.tulisDataRestFirebase(pathDB, window.adminLatihanSettings, "PUT");
    }

    let toast = document.createElement("div");
    toast.innerText = baru
        ? "🔀 Pengacakan Soal Latihan DIHIDUPKAN — soal siswa otomatis diacak."
        : "📋 Pengacakan Soal Latihan DIMATIKAN — urutan soal mengikuti Bank Soal.";
    toast.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#060608; color:#00E1FF; border:1.5px solid #00E1FF; padding:9px 18px; border-radius:24px; font-family:'Poppins',sans-serif; font-size:12px; font-weight:700; z-index:9999999;";
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2200);
};

window.isiSaranTopikUntukBab = function(kelas, mapel, bab) {
    let dl = document.getElementById("admin-topik-list");
    if (!dl) return;
    let topikSet = new Set();
    Object.values(window.adminBankLatihanData || {}).forEach(function(it) {
        if (!it) return;
        if ((!kelas || it.kelas === kelas) && (!mapel || it.mapel === mapel) && (!bab || it.bab === bab)) {
            let t = window.normalisasiTopikLatihan(it.topik);
            if (t !== "Umum") topikSet.add(t);
        }
    });
    let html = "";
    Array.from(topikSet).sort().forEach(function(t) {
        html += '<option value="' + t.replace(/"/g, "&quot;") + '"></option>';
    });
    dl.innerHTML = html;
};

window.bukaModalBankLatihanBaru = function() {
    document.getElementById("admin-bs-kelas").disabled = false;
    document.getElementById("admin-bs-mapel").disabled = false;
    document.getElementById("admin-bs-bab").disabled = false;
    document.getElementById("admin-bs-bab").value = "";
    let inpTopik = document.getElementById("admin-bs-topik");
    if (inpTopik) {
        inpTopik.disabled = false;
        inpTopik.value = "";
    }
    document.getElementById("admin-bs-kesulitan").disabled = false;
    document.getElementById("admin-bs-text").value = "";
    window.isiSaranTopikUntukBab("", "", "");

    window.modeSimpanBankLatihan = "new";
    window.kunciEditBankLatihan = null;

    document.querySelector("#modal-admin-bank-soal .modal-header h3").innerHTML = "📥 Arsip Latihan Mandiri";
    let btn = document.querySelector("#modal-admin-bank-soal .btn-action");
    btn.innerHTML = "Arsipkan 💾";
    btn.style.background = "#8e44ad";
    btn.style.color = "#ffffff";

    window.bukaModal("modal-admin-bank-soal");
};

window.editBankLatihan = function(key) {
    let item = window.adminBankLatihanData[key];
    if (!item) return;

    document.getElementById("admin-bs-kelas").value = item.kelas;
    document.getElementById("admin-bs-mapel").value = item.mapel;
    document.getElementById("admin-bs-bab").value = item.bab;
    document.getElementById("admin-bs-kesulitan").value = item.kesulitan;

    let topikAsli = window.normalisasiTopikLatihan(item.topik);
    let inpTopik = document.getElementById("admin-bs-topik");
    if (inpTopik) {
        inpTopik.disabled = false;
        inpTopik.value = (topikAsli === "Umum") ? "" : topikAsli;
    }
    window.isiSaranTopikUntukBab(item.kelas, item.mapel, item.bab);

    document.getElementById("admin-bs-kelas").disabled = true;
    document.getElementById("admin-bs-mapel").disabled = true;
    document.getElementById("admin-bs-bab").disabled = true;
    document.getElementById("admin-bs-kesulitan").disabled = true;

    if (typeof window.konversiSoalKeTeksMentah === "function") {
        document.getElementById("admin-bs-text").value = window.konversiSoalKeTeksMentah(item.soal || []);
    }

    window.modeSimpanBankLatihan = "edit";
    window.kunciEditBankLatihan = key;

    let labelTopik = (topikAsli !== "Umum") ? (" • " + topikAsli) : "";
    document.querySelector("#modal-admin-bank-soal .modal-header h3").innerHTML = "✏️ Edit Arsip Latihan (" + item.kesulitan + labelTopik + ")";
    let btn = document.querySelector("#modal-admin-bank-soal .btn-action");
    btn.innerHTML = "Simpan Perubahan 💾";
    btn.style.background = "#27ae60";
    btn.style.color = "#ffffff";

    window.bukaModal("modal-admin-bank-soal");
};

window.tambahSoalBankLatihan = function(key, presetTopik) {
    let item = window.adminBankLatihanData[key];
    if (!item) return;

    document.getElementById("admin-bs-kelas").value = item.kelas;
    document.getElementById("admin-bs-mapel").value = item.mapel;
    document.getElementById("admin-bs-bab").value = item.bab;
    document.getElementById("admin-bs-kesulitan").value = item.kesulitan || "C1";

    let inpTopik = document.getElementById("admin-bs-topik");
    if (inpTopik) {
        inpTopik.disabled = false;
        let tPrefill = presetTopik !== undefined ? presetTopik : "";
        inpTopik.value = (tPrefill === "Umum") ? "" : tPrefill;
    }
    window.isiSaranTopikUntukBab(item.kelas, item.mapel, item.bab);

    document.getElementById("admin-bs-kelas").disabled = true;
    document.getElementById("admin-bs-mapel").disabled = true;
    document.getElementById("admin-bs-bab").disabled = true;
    document.getElementById("admin-bs-kesulitan").disabled = false;

    document.getElementById("admin-bs-text").value = "";

    window.modeSimpanBankLatihan = "append_or_new";
    window.kunciEditBankLatihan = key;

    document.querySelector("#modal-admin-bank-soal .modal-header h3").innerHTML = "➕ Tambah Soal Baru (" + item.bab + ")";
    let btn = document.querySelector("#modal-admin-bank-soal .btn-action");
    btn.innerHTML = "Tambahkan Soal 💾";
    btn.style.background = "#f1c40f";
    btn.style.color = "#2c3e50";

    window.bukaModal("modal-admin-bank-soal");
};

window.simpanKeBankSoalPusat = function() {
    let kelas = document.getElementById('admin-bs-kelas').value;
    let mapel = document.getElementById('admin-bs-mapel').value;
    let bab = document.getElementById('admin-bs-bab').value.trim();
    let inpTopik = document.getElementById('admin-bs-topik');
    let topik = window.normalisasiTopikLatihan(inpTopik ? inpTopik.value : "");
    let kesulitan = document.getElementById('admin-bs-kesulitan').value;
    let rawText = document.getElementById('admin-bs-text').value;

    if (!bab) return alert("Nama Bab wajib diisi!");
    if (!rawText) return alert("Soal tidak boleh kosong!");

    let blocks = rawText.split(/\n\s*\n|\n---\n/);
    let questions = [];
    let reBenarAkhir = /[\(\[]\s*benar\s*[\)\]][\.\;\,\s]*(?![\s\S])/i;
    let reSalahAkhir = /[\(\[]\s*salah\s*[\)\]][\.\;\,\s]*(?![\s\S])/i;

    blocks.forEach(function(block) {
        let lines = block.trim().split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
        if (lines.length === 0) return;

        let qObj = { type: 'PG', question: '', options: [], correct: [], explanation: '' };
        let isParsingOptions = false;

        lines.forEach(function(line) {
            let lowerLine = line.toLowerCase();
            if (lowerLine.startsWith('soal:')) {
                qObj.question = line.substring(5).trim();
            } else if (lowerLine.startsWith('tipe:')) {
                let type = lowerLine.substring(5).trim();
                if (type === 'is' || type === 'isian singkat' || type === 'isian') qObj.type = 'IS';
                else if (type === 'essay' || type === 'esai' || type === 'uraian') qObj.type = 'Essay';
                else if (type === 'pgk' || type.indexOf('kompleks') !== -1) qObj.type = 'PGK';
            } else if (lowerLine.startsWith('kunci:')) {
                isParsingOptions = false;
                let kunciStr = line.substring(6).trim();
                if (qObj.type === 'IS') {
                    qObj.correct = kunciStr.split('|').map(function(s) { return s.trim(); });
                } else if (qObj.type === 'Essay') {
                    qObj.correct = [kunciStr];
                } else {
                    let normHuruf = window.normalisasiKunciPGK(kunciStr, qObj.options);
                    if (qObj.type === 'PGK' || normHuruf.length > 1) {
                        qObj.type = 'PGK';
                        if (normHuruf.length > 0) {
                            qObj.correct = Array.from(new Set(qObj.correct.concat(normHuruf))).sort();
                        }
                    } else if (normHuruf.length === 1) {
                        qObj.correct = [normHuruf[0]];
                    } else {
                        let cleanKunci = kunciStr.toUpperCase();
                        qObj.correct = [cleanKunci.replace(/[^A-E]/g, '').charAt(0) || cleanKunci];
                    }
                }
            } else if (lowerLine.startsWith('pembahasan:')) {
                isParsingOptions = false;
                qObj.explanation = line.substring(11).trim();
            } else if (/^[a-eA-E][\.\)]/.test(line)) {
                isParsingOptions = true;
                let optLabel = line.charAt(0).toUpperCase();
                let optText = line.substring(2).trim();
                if (reBenarAkhir.test(optText)) {
                    qObj.type = 'PGK';
                    optText = optText.replace(reBenarAkhir, '').trim();
                    qObj.correct.push(optLabel);
                } else if (reSalahAkhir.test(optText)) {
                    qObj.type = 'PGK';
                    optText = optText.replace(reSalahAkhir, '').trim();
                }

                qObj.options.push({ label: optLabel, text: optText });
            } else {
                if (isParsingOptions && qObj.options.length > 0) {
                    let lastOpt = qObj.options[qObj.options.length - 1];
                    let gabungan = lastOpt.text + ' ' + line;
                    if (reBenarAkhir.test(gabungan)) {
                        qObj.type = 'PGK';
                        gabungan = gabungan.replace(reBenarAkhir, '').trim();
                        qObj.correct.push(lastOpt.label);
                    } else if (reSalahAkhir.test(gabungan)) {
                        qObj.type = 'PGK';
                        gabungan = gabungan.replace(reSalahAkhir, '').trim();
                    }
                    lastOpt.text = gabungan;
                } else if (qObj.explanation) {
                    qObj.explanation += ' ' + line;
                } else if (qObj.question && qObj.options.length === 0) {
                    qObj.question += '<br>' + line;
                }
            }
        });

        if (qObj.type === 'PGK') qObj.correct = window.normalisasiKunciPGK(qObj.correct, qObj.options);
        if (qObj.question) questions.push(qObj);
    });

    if (questions.length === 0) return alert("Gagal mengekstrak soal. Pastikan format teks benar (ada kata 'Soal:', opsi 'A.', 'B.', dan 'Kunci:').");

    if (window.modeSimpanBankLatihan === 'edit' && window.kunciEditBankLatihan) {
        let targetEdit = window.adminBankLatihanData[window.kunciEditBankLatihan];
        if (targetEdit) {
            targetEdit.topik = topik;
            targetEdit.soal = questions;
        }
    } else {
        let existingKey = null;
        Object.keys(window.adminBankLatihanData).forEach(function(k) {
            let i = window.adminBankLatihanData[k];
            if (i && i.kelas === kelas && i.mapel === mapel && i.bab === bab &&
                window.normalisasiTopikLatihan(i.topik) === topik && i.kesulitan === kesulitan) {
                existingKey = k;
            }
        });

        if (existingKey) {
            let lama = Array.isArray(window.adminBankLatihanData[existingKey].soal) ? window.adminBankLatihanData[existingKey].soal : [];
            window.adminBankLatihanData[existingKey].topik = topik;
            window.adminBankLatihanData[existingKey].soal = lama.concat(questions);
        } else {
            let newKey = "bs_" + Date.now();
            window.adminBankLatihanData[newKey] = {
                kelas: kelas, mapel: mapel, bab: bab, topik: topik, kesulitan: kesulitan, soal: questions
            };
        }
    }

    window.renderManajerSoal();
    if (typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();

    window.tutupModal('modal-admin-bank-soal');
    alert("Berhasil menyimpan ke Bank Soal Latihan!");
};

window.renderManajerSoal = function() {
    window.perbaruiTombolAcakLatihanUI();

    let listEl = document.getElementById('list-manajer-soal');
    let selKelas = document.getElementById('filter-manajer-kelas');
    if (!listEl || !selKelas) return;

    let klsAktif = selKelas.value;
    let data = window.adminBankLatihanData || {};
    let keys = Object.keys(data);
    let kelasSet = new Set();
    keys.forEach(function(k) { if (data[k] && data[k].kelas) kelasSet.add(data[k].kelas); });

    let filterHtml = '<option value="Semua">Semua Kelas</option>';
    Array.from(kelasSet).sort().forEach(function(k) {
        filterHtml += '<option value="' + k + '" ' + (k === klsAktif ? 'selected' : '') + '>' + k + '</option>';
    });
    selKelas.innerHTML = filterHtml;
    if (!klsAktif) klsAktif = "Semua";

    let groupedByBab = {};
    keys.forEach(function(key) {
        let item = data[key];
        if (!item) return;
        if (klsAktif !== "Semua" && item.kelas !== klsAktif) return;

        let groupKey = item.kelas + "_" + item.mapel + "_" + item.bab;
        let topikName = window.normalisasiTopikLatihan(item.topik);

        if (!groupedByBab[groupKey]) {
            groupedByBab[groupKey] = {
                kelas: item.kelas,
                mapel: item.mapel,
                bab: item.bab,
                repKey: key,
                topics: {},
                total: 0
            };
        }

        if (!groupedByBab[groupKey].topics[topikName]) {
            groupedByBab[groupKey].topics[topikName] = {
                nama: topikName,
                c1: { key: null, count: 0 },
                c2: { key: null, count: 0 },
                hots: { key: null, count: 0 },
                total: 0
            };
        }

        let arrS = Array.isArray(item.soal) ? item.soal : Object.values(item.soal || {});
        let jmlSoal = arrS.length;
        groupedByBab[groupKey].total += jmlSoal;
        groupedByBab[groupKey].topics[topikName].total += jmlSoal;

        let lvl = String(item.kesulitan || "").toUpperCase();
        if (lvl === "C1") {
            groupedByBab[groupKey].topics[topikName].c1.key = key;
            groupedByBab[groupKey].topics[topikName].c1.count += jmlSoal;
        } else if (lvl === "C2") {
            groupedByBab[groupKey].topics[topikName].c2.key = key;
            groupedByBab[groupKey].topics[topikName].c2.count += jmlSoal;
        } else if (lvl === "HOTS") {
            groupedByBab[groupKey].topics[topikName].hots.key = key;
            groupedByBab[groupKey].topics[topikName].hots.count += jmlSoal;
        }
    });

    let groupKeys = Object.keys(groupedByBab).sort();

    if (groupKeys.length === 0) {
        listEl.innerHTML = '<li style="text-align:center; padding:20px; color:#7f8c8d;">Belum ada soal latihan untuk kelas ini.</li>';
        return;
    }

    let buatBadgeLevel = function(slot, label, cls) {
        if (slot && slot.key) {
            return '<span class="ml-tier-badge ' + cls + '" onclick="window.editBankLatihan(\'' + slot.key + '\')" title="Edit Soal ' + label + '">' + label + ': ' + slot.count + ' ✏️</span>';
        }
        return '<span class="ml-tier-badge is-empty">' + label + ': 0</span>';
    };

    let html = '';
    groupKeys.forEach(function(gKey) {
        let g = groupedByBab[gKey];
        let topikNames = Object.keys(g.topics).sort(function(a, b) {
            if (a === "Umum") return 1;
            if (b === "Umum") return -1;
            return a.localeCompare(b);
        });

        let hanyaUmum = (topikNames.length === 1 && topikNames[0] === "Umum");
        let repKey = g.repKey;
        let safeKls = String(g.kelas || '').replace(/'/g, "\\'");
        let safeMpl = String(g.mapel || '').replace(/'/g, "\\'");
        let safeBab = String(g.bab || '').replace(/'/g, "\\'");

        let bodyBadgesHtml = '';
        if (hanyaUmum) {
            let tp = g.topics["Umum"];
            bodyBadgesHtml =
                '<div class="ml-card-badges">' +
                    '<span class="ml-tier-badge is-kelas">' + g.kelas + '</span>' +
                    buatBadgeLevel(tp.c1, 'C1', 'is-c1') +
                    buatBadgeLevel(tp.c2, 'C2', 'is-c2') +
                    buatBadgeLevel(tp.hots, 'HOTS', 'is-hots') +
                '</div>';
        } else {
            let rowsTopik = topikNames.map(function(tNama) {
                let tp = g.topics[tNama];
                let safeTopik = tNama.replace(/'/g, "\\'");
                return '<div class="ml-topic-row">' +
                    '<div class="ml-topic-head">' +
                        '<span class="ml-topic-name">📌 ' + tNama + '</span>' +
                        '<button type="button" class="ml-topic-add-btn" onclick="window.tambahSoalBankLatihan(\'' + repKey + '\', \'' + safeTopik + '\')" title="Tambah soal ke topik ' + tNama + '">➕</button>' +
                    '</div>' +
                    '<div class="ml-card-badges">' +
                        buatBadgeLevel(tp.c1, 'C1', 'is-c1') +
                        buatBadgeLevel(tp.c2, 'C2', 'is-c2') +
                        buatBadgeLevel(tp.hots, 'HOTS', 'is-hots') +
                    '</div>' +
                '</div>';
            }).join('');

            bodyBadgesHtml =
                '<div class="ml-card-badges" style="margin-bottom:2px;">' +
                    '<span class="ml-tier-badge is-kelas">' + g.kelas + '</span>' +
                    '<span class="ml-tier-badge is-topic-cnt">📂 ' + topikNames.length + ' Topik</span>' +
                '</div>' +
                '<div class="ml-topic-list">' + rowsTopik + '</div>';
        }

        html += '<li class="soal-manager-item ml-card-compact">' +
            '<div class="ml-card-top">' +
                '<div class="ml-card-title-wrap">' +
                    '<strong class="ml-card-title">🚀 ' + g.bab + '</strong>' +
                    '<span class="ml-card-mapel">(' + g.mapel + ')</span>' +
                '</div>' +
                '<span class="ml-card-total-pill">' + g.total + ' Soal</span>' +
            '</div>' +
            bodyBadgesHtml +
            '<div class="ml-card-actions">' +
                '<button type="button" class="ml-act-btn is-pdf" title="Cetak PDF Bab Ini" onclick="window.cetakBankLatihanGroup(\'pdf\', \'' + safeKls + '\', \'' + safeMpl + '\', \'' + safeBab + '\')">🖨️ PDF</button>' +
                '<button type="button" class="ml-act-btn is-word" title="Export Word Bab Ini" onclick="window.cetakBankLatihanGroup(\'word\', \'' + safeKls + '\', \'' + safeMpl + '\', \'' + safeBab + '\')">📄 Word</button>' +
                '<button type="button" class="ml-act-btn is-add" title="Tambah Soal / Topik Baru di Bab Ini" onclick="window.tambahSoalBankLatihan(\'' + repKey + '\', \'\')">➕ Tambah</button>' +
                '<button type="button" class="ml-act-btn is-del" title="Hapus Semua Soal Bab Ini" onclick="window.hapusBankLatihanGroup(\'' + safeKls + '\', \'' + safeMpl + '\', \'' + safeBab + '\')">🗑️</button>' +
            '</div>' +
        '</li>';
    });

    listEl.innerHTML = html;
};

window.cetakBankLatihanGroup = function(format, kelas, mapel, bab) {
    let data = window.adminBankLatihanData || {};
    let urutan = { 'C1': 1, 'C2': 2, 'HOTS': 3 };
    let paketCocok = [];

    Object.keys(data).forEach(function(k) {
        let item = data[k];
        if (item && item.kelas === kelas && item.mapel === mapel && item.bab === bab) {
            paketCocok.push(item);
        }
    });

    paketCocok.sort(function(a, b) {
        let lvlA = urutan[(a.kesulitan || '').toUpperCase()] || 99;
        let lvlB = urutan[(b.kesulitan || '').toUpperCase()] || 99;
        return lvlA - lvlB;
    });

    let gabunganSoal = [];
    paketCocok.forEach(function(p) {
        let arr = Array.isArray(p.soal) ? p.soal : Object.values(p.soal || {});
        gabunganSoal = gabunganSoal.concat(arr);
    });

    if (gabunganSoal.length === 0) {
        return alert("Belum ada soal pada bab ini untuk dicetak!");
    }

    let judulCetak = (bab + ' ' + mapel + ' ' + kelas).toUpperCase();
    if (typeof window.cetakDokumenUniversal === "function") {
        window.cetakDokumenUniversal(format, judulCetak, gabunganSoal);
    }
};

window.hapusBankLatihanGroup = function(kelas, mapel, bab) {
    window.tampilkanCustomDialog("confirm", 'Hapus seluruh soal (C1, C2, HOTS) untuk bab "' + bab + '" (' + kelas + ')?', null, function(isYes) {
        if (!isYes) return;
        let data = window.adminBankLatihanData || {};
        Object.keys(data).forEach(function(key) {
            let item = data[key];
            if (item && item.kelas === kelas && item.mapel === mapel && item.bab === bab) {
                delete window.adminBankLatihanData[key];
            }
        });
        window.renderManajerSoal();
        if (typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
    });
};

window.hapusBankLatihan = function(key) {
    window.tampilkanCustomDialog("confirm", "Hapus kumpulan soal latihan ini?", null, function(isYes) {
        if (!isYes) return;
        delete window.adminBankLatihanData[key];
        window.renderManajerSoal();
        if (typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
    });
};

// =========================================================================
// 4. KONTROL UJIAN AKTIF & LIVE MONITOR REAL-TIME
// =========================================================================
window.bukaModalKontrolUjian = function() {
    window.bukaModal('modal-manajer-ujian');
    window.bukaTabManajerUjian('tab-ujian-kontrol');
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
    window.updateHeaderInfoManajerUjian();

    if (aktifKeys.length === 0) {
        if (container) container.innerHTML = '<p style="color:#7f8c8d; font-size:12px; text-align:center; padding:20px; background:#f8f9fa; border-radius:6px; border:1px dashed #ccc;">Belum ada ujian yang diaktifkan.</p>';
        return;
    }

    let htmlAktif = '';
    aktifKeys.forEach(function(kode) {
        let u = window.adminUjianAktifData[kode];
        htmlAktif += '<div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #e1e8ed; padding:12px; border-radius:6px; margin-bottom:8px; border-left:4px solid #27ae60; box-shadow:0 2px 5px rgba(0,0,0,0.02);">' +
            '<div>' +
                '<div style="font-weight:bold; color:#2c3e50; font-size:14px; margin-bottom:4px;">🎯 ' + u.paket + '</div>' +
                '<div style="font-size:11px; color:#7f8c8d;">' +
                    'Kode Akses: <span style="background:#f1c40f; color:#333; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:12px; letter-spacing:1px;">' + kode + '</span> | Waktu: <span style="font-weight:bold;">' + u.durasi + ' Menit</span>' +
                '</div>' +
            '</div>' +
            '<button style="background:#c0392b; color:white; border:none; padding:6px 12px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer; transition:0.2s;" onclick="nonaktifkanUjian(\'' + kode + '\')" onmouseover="this.style.background=\'#a93226\'" onmouseout="this.style.background=\'#c0392b\'">🛑 Tutup Akses</button>' +
        '</div>';
    });
    if (container) container.innerHTML = htmlAktif;
};

window.simpanKontrolUjian = function() {
    let paket = document.getElementById('admin-pilih-ujian').value;
    let kode = document.getElementById('admin-kode-ujian').value.trim().toUpperCase();
    let durasi = parseInt(document.getElementById('admin-durasi-ujian').value);

    if (!paket) return alert("Pilih paket ujian terlebih dahulu!");
    if (!kode) return alert("Kode akses ujian tidak boleh kosong!");
    if (window.adminUjianAktifData[kode]) return alert("Kode ujian ini sudah dipakai/sedang aktif. Gunakan kode lain!");
    if (!durasi || durasi <= 0) return alert("Durasi ujian tidak valid!");

    window.adminUjianAktifData[kode] = {
        paket: paket,
        durasi: durasi,
        dibuat: new Date().toISOString()
    };

    document.getElementById('admin-kode-ujian').value = "";
    document.getElementById('admin-durasi-ujian').value = "90";

    window.renderKontrolUjian();
    if (typeof window.simpanUjianAktifKeDB === "function") window.simpanUjianAktifKeDB();
};

window.nonaktifkanUjian = function(kode) {
    if (confirm('Yakin ingin menutup akses ujian (Kode: ' + kode + ')? Siswa yang belum masuk tidak akan bisa mengaksesnya lagi.')) {
        delete window.adminUjianAktifData[kode];
        window.renderKontrolUjian();
        if (typeof window.simpanUjianAktifKeDB === "function") window.simpanUjianAktifKeDB();
    }
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
                if ((siswaObj[s].pelanggaran || 0) > 0) adaPelanggaran = true;
            });
        });
    });
    badge.style.display = adaPelanggaran ? 'inline-block' : 'none';
};

window.bukaModalLiveMonitor = function() {
    window.bukaModal('modal-manajer-ujian');
    window.bukaTabManajerUjian('tab-ujian-monitor');
};

window.tutupLiveMonitor = function() {
    window.tutupModal('modal-manajer-ujian');
};

window.muatDropdownLiveMonitor = function() {
    let selPaket = document.getElementById('live-monitor-paket');
    let selKelas = document.getElementById('live-monitor-kelas');
    if (!selPaket) return;

    let prevPaket = selPaket.value;
    let prevKelas = selKelas ? selKelas.value : 'Semua';

    let paketSet = new Set();
    Object.keys(window.adminBankUjianData || {}).forEach(function(p) { paketSet.add(p); });
    Object.values(window.adminUjianAktifData || {}).forEach(function(u) { if (u.paket) paketSet.add(u.paket); });
    Object.keys(window.adminLiveMonitorData || {}).forEach(function(p) { paketSet.add(p); });

    let htmlPaket = '<option value="">-- Pilih Ujian --</option>';
    Array.from(paketSet).sort().forEach(function(p) {
        let selected = (p === prevPaket) ? 'selected' : '';
        htmlPaket += '<option value="' + p + '" ' + selected + '>' + p + '</option>';
    });
    selPaket.innerHTML = htmlPaket;

    if (!selPaket.value) {
        let liveKeys = Object.keys(window.adminLiveMonitorData || {});
        if (liveKeys.length === 1) selPaket.value = liveKeys[0];
    }

    window.perbaruiDropdownKelasMonitor(prevKelas);
};

window.perbaruiDropdownKelasMonitor = function(prevKelas) {
    let selPaket = document.getElementById('live-monitor-paket');
    let selKelas = document.getElementById('live-monitor-kelas');
    if (!selKelas) return;

    let paketDipilih = selPaket ? selPaket.value : '';
    let kelasSet = new Set();

    Object.keys(window.adminData || {}).forEach(function(k) { kelasSet.add(k); });
    if (paketDipilih && window.adminLiveMonitorData && window.adminLiveMonitorData[paketDipilih]) {
        Object.keys(window.adminLiveMonitorData[paketDipilih]).forEach(function(k) { kelasSet.add(k); });
    }

    let htmlKelas = '<option value="Semua">Semua Kelas</option>';
    Array.from(kelasSet).sort().forEach(function(k) {
        let selected = (k === prevKelas) ? 'selected' : '';
        htmlKelas += '<option value="' + k + '" ' + selected + '>' + k + '</option>';
    });
    selKelas.innerHTML = htmlKelas;
};

window.loadLiveMonitor = function() {
    window.perbaruiDropdownKelasMonitor(document.getElementById('live-monitor-kelas') ? document.getElementById('live-monitor-kelas').value : 'Semua');
    window.renderIsiLiveMonitor();
};

window.renderIsiLiveMonitor = function() {
    let selPaket = document.getElementById('live-monitor-paket');
    let selKelas = document.getElementById('live-monitor-kelas');
    let listEl = document.getElementById('live-monitor-list');
    if (!listEl || !selPaket) return;

    let paket = selPaket.value;
    let filterKelas = selKelas ? selKelas.value : 'Semua';

    if (!paket) {
        listEl.innerHTML = '<div style="text-align:center; padding:25px; color:#7f8c8d; background:#f8f9fa; border-radius:8px; border:1px dashed #ccc;">Pilih paket ujian di atas untuk melihat pantauan siswa secara langsung.</div>';
        return;
    }

    let dataPaket = (window.adminLiveMonitorData && window.adminLiveMonitorData[paket]) ? window.adminLiveMonitorData[paket] : {};
    let daftarBaris = [];

    Object.keys(dataPaket).sort().forEach(function(kls) {
        if (filterKelas !== 'Semua' && kls !== filterKelas) return;
        let siswaMap = dataPaket[kls] || {};
        Object.keys(siswaMap).sort().forEach(function(nama) {
            let item = siswaMap[nama];
            daftarBaris.push({
                kelas: kls,
                nama: nama,
                status: item.status || 'Sedang Mengerjakan',
                pelanggaran: item.pelanggaran || 0
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

        let btnHapusSiswa = '<button type="button" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:16px; margin-left:12px; font-weight:bold; transition:0.2s;" title="Hapus dari Live Monitor (Izinkan Ujian Ulang)" onclick="window.hapusSiswaLiveMonitor(\'' + paket.replace(/'/g, "\\'") + '\', \'' + row.kelas.replace(/'/g, "\\'") + '\', \'' + row.nama.replace(/'/g, "\\'") + '\')" onmouseover="this.style.transform=\'scale(1.2)\'" onmouseout="this.style.transform=\'scale(1)\'">✕</button>';

        html += '<div style="display:flex; justify-content:space-between; align-items:center; background:' + bgCard + '; border:1px solid ' + borderCard + '; padding:12px 16px; border-radius:8px;">' +
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
        if (window.adminLiveMonitorData && window.adminLiveMonitorData[paket] && window.adminLiveMonitorData[paket][kelas]) {
            delete window.adminLiveMonitorData[paket][kelas][nama];
            if (Object.keys(window.adminLiveMonitorData[paket][kelas]).length === 0) delete window.adminLiveMonitorData[paket][kelas];
            if (Object.keys(window.adminLiveMonitorData[paket]).length === 0) delete window.adminLiveMonitorData[paket];
        }
        if (typeof window.hapusDataLiveMonitorDiDB === "function") {
            window.hapusDataLiveMonitorDiDB(paket, kelas, nama);
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
        if (window.adminLiveMonitorData && window.adminLiveMonitorData[paket]) {
            if (kelas && kelas !== 'Semua') {
                delete window.adminLiveMonitorData[paket][kelas];
            } else {
                delete window.adminLiveMonitorData[paket];
            }
        }
        if (typeof window.hapusDataLiveMonitorDiDB === "function") {
            window.hapusDataLiveMonitorDiDB(paket, kelas, null);
        }
        window.renderIsiLiveMonitor();
        window.perbaruiBadgeNotifMonitor();
    }
};

// =========================================================================
// 5. FITUR TARIK SOAL DARI BANK LATIHAN & UPLOAD DOKUMEN LOKAL (PDF/DOCX)
// =========================================================================
window.modeAmbilSoalAktif = 'acak';
window.selectedSoalSpesifikMap = {};
window.currentSpesifikRenderedList = [];

window.bukaModalAmbilSoal = function(isUntukKuisInline) {
    window.isTarikKeKuisInline = Boolean(isUntukKuisInline);
    window.selectedSoalSpesifikMap = {};
    window.currentSpesifikRenderedList = [];

    let bank = window.adminBankLatihanData || {};
    let kelasSet = new Set();
    Object.values(bank).forEach(function(item) { if (item && item.kelas) kelasSet.add(item.kelas); });

    let htmlK = '<option value="">-- Pilih Kelas --</option>';
    Array.from(kelasSet).sort().forEach(function(k) { htmlK += '<option value="' + k + '">' + k + '</option>'; });

    // Inisialisasi Dropdown Tab 1 (Acak)
    let selKelas = document.getElementById('ambil-soal-kelas');
    if (selKelas) selKelas.innerHTML = htmlK;
    let selMapel = document.getElementById('ambil-soal-mapel');
    if (selMapel) selMapel.innerHTML = '<option value="">-- Tunggu Kelas --</option>';
    let container = document.getElementById('ambil-soal-bab-container');
    if (container) container.innerHTML = '';
    let boxTopik = document.getElementById('ambil-soal-topik-box');
    if (boxTopik) boxTopik.style.display = 'none';
    let contTopik = document.getElementById('ambil-soal-topik-container');
    if (contTopik) contTopik.innerHTML = '';

    // Inisialisasi Dropdown Tab 2 (Spesifik)
    let selKelasSp = document.getElementById('spesifik-soal-kelas');
    if (selKelasSp) selKelasSp.innerHTML = htmlK;
    let selMapelSp = document.getElementById('spesifik-soal-mapel');
    if (selMapelSp) selMapelSp.innerHTML = '<option value="">-- Tunggu Kelas --</option>';
    let selBabSp = document.getElementById('spesifik-soal-bab');
    if (selBabSp) selBabSp.innerHTML = '<option value="">-- Tunggu Mapel --</option>';
    let selTopikSp = document.getElementById('spesifik-soal-topik');
    if (selTopikSp) selTopikSp.innerHTML = '<option value="SEMUA">-- Tunggu Bab --</option>';
    let selKesSp = document.getElementById('spesifik-soal-kesulitan');
    if (selKesSp) selKesSp.innerHTML = '<option value="">-- Tunggu Mapel --</option>';

    let listSp = document.getElementById('spesifik-daftar-soal-container');
    if (listSp) {
        listSp.innerHTML = '<div style="text-align:center; padding:35px 15px; color:#7f8c8d; font-size:13px;">Silakan pilih <b>Kelas</b>, <b>Mapel</b>, dan <b>Tingkat Kesulitan</b> di atas untuk membuka daftar soal.</div>';
    }

    window.resetAmbilSoalPersen();
    window.perbaruiCounterSoalSpesifik();
    window.gantiModeAmbilSoal('acak');
    window.bukaModal('modal-ambil-soal-ujian');
};

window.gantiModeAmbilSoal = function(mode) {
    window.modeAmbilSoalAktif = (mode === 'spesifik') ? 'spesifik' : 'acak';
    let btnAcak = document.getElementById('tab-btn-ambil-acak');
    let btnSpesifik = document.getElementById('tab-btn-ambil-spesifik');
    let viewAcak = document.getElementById('view-ambil-soal-acak');
    let viewSpesifik = document.getElementById('view-ambil-soal-spesifik');

    if (window.modeAmbilSoalAktif === 'acak') {
        if (btnAcak) {
            btnAcak.style.background = '#8e44ad';
            btnAcak.style.color = '#ffffff';
            btnAcak.style.border = 'none';
            btnAcak.style.boxShadow = '0 2px 6px rgba(142,68,173,0.3)';
        }
        if (btnSpesifik) {
            btnSpesifik.style.background = '#ffffff';
            btnSpesifik.style.color = '#475569';
            btnSpesifik.style.border = '1px solid #cbd5e1';
            btnSpesifik.style.boxShadow = 'none';
        }
        if (viewAcak) viewAcak.style.display = 'flex';
        if (viewSpesifik) viewSpesifik.style.display = 'none';
    } else {
        if (btnSpesifik) {
            btnSpesifik.style.background = '#8e44ad';
            btnSpesifik.style.color = '#ffffff';
            btnSpesifik.style.border = 'none';
            btnSpesifik.style.boxShadow = '0 2px 6px rgba(142,68,173,0.3)';
        }
        if (btnAcak) {
            btnAcak.style.background = '#ffffff';
            btnAcak.style.color = '#475569';
            btnAcak.style.border = '1px solid #cbd5e1';
            btnAcak.style.boxShadow = 'none';
        }
        if (viewAcak) viewAcak.style.display = 'none';
        if (viewSpesifik) viewSpesifik.style.display = 'flex';
    }
};

window.updateAmbilSoalMapel = function() {
    let kelas = document.getElementById('ambil-soal-kelas').value;
    let selMapel = document.getElementById('ambil-soal-mapel');
    let bank = window.adminBankLatihanData || {};
    let mapelSet = new Set();

    Object.values(bank).forEach(function(item) { if (item && item.kelas === kelas) mapelSet.add(item.mapel); });
    let htmlM = '<option value="">-- Pilih Mapel --</option>';
    Array.from(mapelSet).sort().forEach(function(m) { htmlM += '<option value="' + m + '">' + m + '</option>'; });
    selMapel.innerHTML = htmlM;
    document.getElementById('ambil-soal-bab-container').innerHTML = '';
    let boxTopik = document.getElementById('ambil-soal-topik-box');
    if (boxTopik) boxTopik.style.display = 'none';
    let contTopik = document.getElementById('ambil-soal-topik-container');
    if (contTopik) contTopik.innerHTML = '';
    window.updateInfoStokTarikSoal();
};

window.updateAmbilSoalBab = function() {
    let kelas = document.getElementById('ambil-soal-kelas').value;
    let mapel = document.getElementById('ambil-soal-mapel').value;
    let container = document.getElementById('ambil-soal-bab-container');

    let bank = window.adminBankLatihanData || {};
    let babSet = new Set();

    Object.values(bank).forEach(function(item) {
        if (item && item.kelas === kelas && item.mapel === mapel && item.bab) babSet.add(item.bab);
    });

    let htmlB = '';
    Array.from(babSet).sort().forEach(function(b) {
        let safeVal = b.replace(/"/g, '&quot;');
        htmlB += '<label style="cursor:pointer; display:flex; gap:8px; font-size:13px; align-items:center;">' +
                    '<input type="checkbox" class="chk-ambil-bab" value="' + safeVal + '" onchange="window.updateAmbilSoalTopik()"> ' + b +
                 '</label>';
    });
    container.innerHTML = htmlB || '<span style="font-size:12px; color:#888;">Tidak ada bab tersedia.</span>';
    window.updateAmbilSoalTopik();
};

window.updateAmbilSoalTopik = function() {
    let kelas = document.getElementById('ambil-soal-kelas').value;
    let mapel = document.getElementById('ambil-soal-mapel').value;
    let selectedBabs = Array.from(document.querySelectorAll('.chk-ambil-bab:checked')).map(function(el) { return el.value; });
    let prevCheckedTopiks = new Set(Array.from(document.querySelectorAll('.chk-ambil-topik:checked')).map(function(el) { return el.value; }));

    let boxTopik = document.getElementById('ambil-soal-topik-box');
    let contTopik = document.getElementById('ambil-soal-topik-container');
    if (!boxTopik || !contTopik) {
        window.updateInfoStokTarikSoal();
        return;
    }

    if (selectedBabs.length === 0) {
        boxTopik.style.display = 'none';
        contTopik.innerHTML = '';
        window.updateInfoStokTarikSoal();
        return;
    }

    let bank = window.adminBankLatihanData || {};
    let topikMap = {};
    let adaTopikNonUmum = false;

    Object.values(bank).forEach(function(item) {
        if (!item || item.kelas !== kelas || item.mapel !== mapel || !selectedBabs.includes(item.bab)) return;
        let tName = (typeof window.normalisasiTopikLatihan === 'function')
            ? window.normalisasiTopikLatihan(item.topik)
            : (String(item.topik || '').trim() || 'Umum');
        if (tName !== 'Umum') adaTopikNonUmum = true;

        let pairKey = item.bab + '||' + tName;
        let arrS = Array.isArray(item.soal) ? item.soal : Object.values(item.soal || {});
        if (!topikMap[pairKey]) {
            topikMap[pairKey] = { key: pairKey, bab: item.bab, topik: tName, count: 0 };
        }
        topikMap[pairKey].count += arrS.length;
    });

    let daftarTopik = Object.values(topikMap).sort(function(a, b) {
        let cmpB = a.bab.localeCompare(b.bab);
        if (cmpB !== 0) return cmpB;
        if (a.topik === 'Umum') return 1;
        if (b.topik === 'Umum') return -1;
        return a.topik.localeCompare(b.topik);
    });

    if (!adaTopikNonUmum && daftarTopik.length <= 1) {
        boxTopik.style.display = 'none';
        contTopik.innerHTML = '';
        window.updateInfoStokTarikSoal();
        return;
    }

    boxTopik.style.display = 'block';
    let showBabPrefix = selectedBabs.length > 1;
    let htmlT = '';
    daftarTopik.forEach(function(tp) {
        let safeVal = tp.key.replace(/"/g, '&quot;');
        let checkedAttr = prevCheckedTopiks.has(tp.key) ? ' checked' : '';
        let labelTampil = (showBabPrefix ? (tp.bab + ' • ') : '') + tp.topik + ' (' + tp.count + ')';
        htmlT += '<label style="cursor:pointer; display:inline-flex; gap:6px; align-items:center; background:#ffffff; border:1px solid #a7f3d0; padding:4px 9px; border-radius:14px; font-size:12px; font-weight:600; color:#065f46;">' +
                    '<input type="checkbox" class="chk-ambil-topik" value="' + safeVal + '"' + checkedAttr + ' style="accent-color:#047857; cursor:pointer;" onchange="window.updateInfoStokTarikSoal()"> ' + labelTampil +
                 '</label>';
    });
    contTopik.innerHTML = htmlT;
    window.updateInfoStokTarikSoal();
};

window.resetCentangTopikAmbilSoal = function() {
    document.querySelectorAll('.chk-ambil-topik').forEach(function(cb) { cb.checked = false; });
    window.updateInfoStokTarikSoal();
};

window.updateInfoStokTarikSoal = function() {
    let kelas = document.getElementById('ambil-soal-kelas').value;
    let mapel = document.getElementById('ambil-soal-mapel').value;
    let selectedBabs = Array.from(document.querySelectorAll('.chk-ambil-bab:checked')).map(function(el) { return el.value; });
    let selectedTopiks = Array.from(document.querySelectorAll('.chk-ambil-topik:checked')).map(function(el) { return el.value; });
    let pakaiFilterTopik = selectedTopiks.length > 0;

    let statusTopikEl = document.getElementById('ambil-soal-topik-status');
    if (statusTopikEl) {
        statusTopikEl.innerText = pakaiFilterTopik ? (selectedTopiks.length + ' Topik Dipilih') : 'Semua Topik';
    }

    let stok = {
        PG: { C1: 0, C2: 0, HOTS: 0 },
        PGK: { C1: 0, C2: 0, HOTS: 0 },
        IS: { C1: 0, C2: 0, HOTS: 0 },
        Essay: { C1: 0, C2: 0, HOTS: 0 }
    };

    let bank = window.adminBankLatihanData || {};
    Object.values(bank).forEach(function(item) {
        if (item && item.kelas === kelas && item.mapel === mapel && selectedBabs.includes(item.bab)) {
            if (pakaiFilterTopik) {
                let tName = (typeof window.normalisasiTopikLatihan === 'function')
                    ? window.normalisasiTopikLatihan(item.topik)
                    : (String(item.topik || '').trim() || 'Umum');
                if (!selectedTopiks.includes(item.bab + '||' + tName)) return;
            }

            let diff = (item.kesulitan || 'C1').trim().toUpperCase();
            if (!['C1', 'C2', 'HOTS'].includes(diff)) diff = 'C1';

            let arrSoal = Array.isArray(item.soal) ? item.soal : Object.values(item.soal || {});
            arrSoal.forEach(function(q) {
                let tipeQ = (q.type || q.tipe || 'PG').toUpperCase();
                if (tipeQ === 'ISIAN' || tipeQ === 'SHORT_ANSWER') tipeQ = 'IS';
                if (tipeQ === 'ESAI') tipeQ = 'ESSAY';

                if (stok[tipeQ] && stok[tipeQ][diff] !== undefined) {
                    stok[tipeQ][diff]++;
                }
            });
        }
    });

    ['PG', 'PGK', 'IS', 'Essay'].forEach(function(tipe) {
        let idTipe = tipe.toLowerCase();
        let el = document.getElementById('stok-' + idTipe);
        if (el) el.innerHTML = stok[tipe].C1 + ' C1 | ' + stok[tipe].C2 + ' C2 | ' + stok[tipe].HOTS + ' HOTS';
    });
};

window.resetAmbilSoalPersen = function() {
    ['pg', 'pgk', 'is', 'es'].forEach(function(tipe) {
        ['c1', 'c2', 'hots'].forEach(function(diff) {
            let inp = document.getElementById('tarik-' + tipe + '-' + diff);
            if (inp) inp.value = "0";
        });
    });
    window.updateInfoStokTarikSoal();
};

// FUNGSI PEMBANTU: MEMASUKKAN KUMPULAN SOAL KE KUIS INLINE ATAU EDITOR UJIAN
window.masukkanSoalKeTargetAmbil = function(hasilSoalKumpulan, pesanSukses) {
    if (!Array.isArray(hasilSoalKumpulan) || hasilSoalKumpulan.length === 0) return;

    if (window.isTarikKeKuisInline && window.targetQuizBlockIndex >= 0) {
        let blokKuis = window.contentBlocksData[window.targetQuizBlockIndex];
        if (!blokKuis.questions) blokKuis.questions = [];

        let finalInlineArr = hasilSoalKumpulan.map(function(q) {
            let nQ = Object.assign({}, q);
            let t = (nQ.type || nQ.tipe || 'PG').toUpperCase();
            nQ.type = (t === 'IS' || t === 'ISIAN' || t === 'SHORT_ANSWER') ? 'short_answer' : (t === 'ESSAY' || t === 'ESAI' ? 'essay' : (t === 'PGK' ? 'pgk' : 'mc'));
            nQ.options = nQ.options ? nQ.options.map(function(o) { return (typeof o === 'object' ? o.text : o); }) : [];

            if (nQ.type === 'short_answer' || nQ.type === 'essay') {
                nQ.correctAnswers = Array.isArray(nQ.correct) ? nQ.correct : [nQ.correct];
            } else if (nQ.type === 'pgk') {
                nQ.correctIndices = [];
                let nHuruf = window.normalisasiKunciPGK(nQ.correct, nQ.options);
                nHuruf.forEach(function(h) {
                    let idx = h.toUpperCase().charCodeAt(0) - 65;
                    if (idx >= 0 && idx < 10) nQ.correctIndices.push(idx);
                });
            } else {
                let kStr = (nQ.correct && nQ.correct[0]) ? nQ.correct[0].toUpperCase() : 'A';
                nQ.correctIndex = kStr.charCodeAt(0) - 65;
            }
            return nQ;
        });

        blokKuis.questions.push.apply(blokKuis.questions, finalInlineArr);
        window.tutupModal('modal-ambil-soal-ujian');
        window.renderBlocks();
        if (window.simpanKeDB) window.simpanKeDB();
        alert(pesanSukses);
    } else {
        let textArea = document.getElementById('admin-bu-text');
        let convertedText = window.konversiSoalKeTeksMentah(hasilSoalKumpulan);

        convertedText = convertedText.split(/\n\n(?=Soal:)/).join('\n\n---\n\n');

        if (textArea && textArea.value.trim() !== "") textArea.value += "\n\n---\n\n" + convertedText;
        else if (textArea) textArea.value = convertedText;

        window.tempSoalUjianParsed.push.apply(window.tempSoalUjianParsed, hasilSoalKumpulan);
        window.analisisSoalOtomatis();
        window.tutupModal('modal-ambil-soal-ujian');

        if (window.selectedBankUjianName && window.adminBankUjianData[window.selectedBankUjianName]) {
            window.adminBankUjianData[window.selectedBankUjianName].soal = window.tempSoalUjianParsed;
            window.adminBankUjianData[window.selectedBankUjianName].bobot = window.tempBobotUjian;
            if (typeof window.simpanBankUjianKeDB === "function") window.simpanBankUjianKeDB();
        }
        alert(pesanSukses);
    }
};

window.eksekusiTarikSoalKeUjian = function() {
    let kelas = document.getElementById('ambil-soal-kelas').value;
    let mapel = document.getElementById('ambil-soal-mapel').value;
    let selectedBabs = Array.from(document.querySelectorAll('.chk-ambil-bab:checked')).map(function(el) { return el.value; });
    let selectedTopiks = Array.from(document.querySelectorAll('.chk-ambil-topik:checked')).map(function(el) { return el.value; });
    let pakaiFilterTopik = selectedTopiks.length > 0;

    if (selectedBabs.length === 0) return alert("Pilih minimal 1 Bab materi!");

    let bank = window.adminBankLatihanData || {};
    let hasilSoalKumpulan = [];
    let poolSoal = {
        PG: { C1: [], C2: [], HOTS: [] },
        PGK: { C1: [], C2: [], HOTS: [] },
        IS: { C1: [], C2: [], HOTS: [] },
        Essay: { C1: [], C2: [], HOTS: [] }
    };

    Object.values(bank).forEach(function(item) {
        if (item && item.kelas === kelas && item.mapel === mapel && selectedBabs.includes(item.bab)) {
            if (pakaiFilterTopik) {
                let tName = (typeof window.normalisasiTopikLatihan === 'function')
                    ? window.normalisasiTopikLatihan(item.topik)
                    : (String(item.topik || '').trim() || 'Umum');
                if (!selectedTopiks.includes(item.bab + '||' + tName)) return;
            }

            let diff = (item.kesulitan || 'C1').trim().toUpperCase();
            if (!['C1', 'C2', 'HOTS'].includes(diff)) diff = 'C1';

            let arrSoal = Array.isArray(item.soal) ? item.soal : Object.values(item.soal || {});

            arrSoal.forEach(function(q) {
                let tipeQ = (q.type || q.tipe || 'PG').toUpperCase();
                if (tipeQ === 'ISIAN' || tipeQ === 'SHORT_ANSWER') tipeQ = 'IS';
                if (tipeQ === 'ESAI') tipeQ = 'ESSAY';

                if (poolSoal[tipeQ] && poolSoal[tipeQ][diff]) {
                    poolSoal[tipeQ][diff].push(q);
                }
            });
        }
    });

    let peringatanStok = [];
    let totalDitarik = 0;

    ['PG', 'PGK', 'IS', 'Essay'].forEach(function(tipe) {
        let idTipe = tipe.toLowerCase();
        ['C1', 'C2', 'HOTS'].forEach(function(diff) {
            let inputId = 'tarik-' + (idTipe === 'essay' ? 'es' : idTipe) + '-' + diff.toLowerCase();
            let inputEl = document.getElementById(inputId);
            let jmlMinta = inputEl ? parseInt(inputEl.value) || 0 : 0;

            if (jmlMinta > 0) {
                let tersedia = poolSoal[tipe][diff].sort(function() { return Math.random() - 0.5; });
                if (tersedia.length < jmlMinta) {
                    peringatanStok.push('- ' + tipe + ' (' + diff + '): Diminta ' + jmlMinta + ', tersedia ' + tersedia.length);
                }
                let ditarik = tersedia.slice(0, jmlMinta);
                hasilSoalKumpulan.push.apply(hasilSoalKumpulan, ditarik);
                totalDitarik += ditarik.length;
            }
        });
    });

    if (totalDitarik === 0) return alert("Anda belum menentukan jumlah soal yang ingin ditarik (atau semua diisi 0)!");

    hasilSoalKumpulan.sort(function() { return Math.random() - 0.5; });

    let namaTarget = window.isTarikKeKuisInline ? "Kuis Inline" : "editor";
    let pesan = peringatanStok.length > 0
        ? '⚠️ Berhasil menarik ' + totalDitarik + ' soal ke ' + namaTarget + '.\n\nStok tidak mencukupi untuk kategori berikut:\n' + peringatanStok.join('\n')
        : '✅ Berhasil menarik tepat ' + totalDitarik + ' soal ke ' + namaTarget + ' secara acak!';

    window.masukkanSoalKeTargetAmbil(hasilSoalKumpulan, pesan);
};

// =========================================================================
// LOGIKA MODE 2: AMBIL SOAL SPESIFIK (FILTER DROPDOWN & CENTANG PER SOAL)
// =========================================================================
window.updateSpesifikSoalMapel = function() {
    let kelas = document.getElementById('spesifik-soal-kelas').value;
    let selMapel = document.getElementById('spesifik-soal-mapel');
    let selBab = document.getElementById('spesifik-soal-bab');
    let selTopik = document.getElementById('spesifik-soal-topik');
    let selKes = document.getElementById('spesifik-soal-kesulitan');

    if (!kelas) {
        selMapel.innerHTML = '<option value="">-- Tunggu Kelas --</option>';
        selBab.innerHTML = '<option value="">-- Tunggu Mapel --</option>';
        if (selTopik) selTopik.innerHTML = '<option value="SEMUA">-- Tunggu Bab --</option>';
        selKes.innerHTML = '<option value="">-- Tunggu Mapel --</option>';
        window.renderDaftarSoalSpesifik();
        return;
    }

    let bank = window.adminBankLatihanData || {};
    let mapelSet = new Set();
    Object.values(bank).forEach(function(item) {
        if (item && item.kelas === kelas && item.mapel) mapelSet.add(item.mapel);
    });

    let htmlM = '<option value="">-- Pilih Mapel --</option>';
    Array.from(mapelSet).sort().forEach(function(m) {
        htmlM += '<option value="' + m + '">' + m + '</option>';
    });
    selMapel.innerHTML = htmlM;
    selBab.innerHTML = '<option value="">-- Tunggu Mapel --</option>';
    if (selTopik) selTopik.innerHTML = '<option value="SEMUA">-- Tunggu Bab --</option>';
    selKes.innerHTML = '<option value="">-- Tunggu Mapel --</option>';
    window.renderDaftarSoalSpesifik();
};

window.updateSpesifikSoalBabDanLevel = function() {
    let kelas = document.getElementById('spesifik-soal-kelas').value;
    let mapel = document.getElementById('spesifik-soal-mapel').value;
    let selBab = document.getElementById('spesifik-soal-bab');
    let selTopik = document.getElementById('spesifik-soal-topik');
    let selKes = document.getElementById('spesifik-soal-kesulitan');

    if (!kelas || !mapel) {
        selBab.innerHTML = '<option value="">-- Tunggu Mapel --</option>';
        if (selTopik) selTopik.innerHTML = '<option value="SEMUA">-- Tunggu Bab --</option>';
        selKes.innerHTML = '<option value="">-- Tunggu Mapel --</option>';
        window.renderDaftarSoalSpesifik();
        return;
    }

    let bank = window.adminBankLatihanData || {};
    let babSet = new Set();
    let levelSet = new Set();

    Object.values(bank).forEach(function(item) {
        if (item && item.kelas === kelas && item.mapel === mapel) {
            if (item.bab) babSet.add(item.bab);
            if (item.kesulitan) levelSet.add(String(item.kesulitan).toUpperCase().trim());
        }
    });

    let htmlBab = '<option value="SEMUA">📚 Semua Bab (' + babSet.size + ' Bab)</option>';
    Array.from(babSet).sort().forEach(function(b) {
        htmlBab += '<option value="' + b.replace(/"/g, '&quot;') + '">' + b + '</option>';
    });
    selBab.innerHTML = htmlBab;

    let urutanLvl = ['C1', 'C2', 'HOTS'];
    let htmlKes = '<option value="SEMUA">⚡ Semua Tingkat (C1, C2, HOTS)</option>';
    urutanLvl.forEach(function(lvl) {
        if (levelSet.has(lvl)) {
            htmlKes += '<option value="' + lvl + '">Tingkat ' + lvl + '</option>';
        }
    });
    selKes.innerHTML = htmlKes;

    window.onUbahBabSpesifikSoal();
};

window.onUbahBabSpesifikSoal = function() {
    let kelas = document.getElementById('spesifik-soal-kelas') ? document.getElementById('spesifik-soal-kelas').value : '';
    let mapel = document.getElementById('spesifik-soal-mapel') ? document.getElementById('spesifik-soal-mapel').value : '';
    let bab = document.getElementById('spesifik-soal-bab') ? document.getElementById('spesifik-soal-bab').value : '';
    let selTopik = document.getElementById('spesifik-soal-topik');

    if (selTopik) {
        if (!kelas || !mapel) {
            selTopik.innerHTML = '<option value="SEMUA">-- Tunggu Bab --</option>';
        } else {
            let bank = window.adminBankLatihanData || {};
            let topikSet = new Set();
            Object.values(bank).forEach(function(item) {
                if (!item || item.kelas !== kelas || item.mapel !== mapel) return;
                if (bab && bab !== 'SEMUA' && item.bab !== bab) return;
                let tName = (typeof window.normalisasiTopikLatihan === 'function')
                    ? window.normalisasiTopikLatihan(item.topik)
                    : (String(item.topik || '').trim() || 'Umum');
                topikSet.add(tName);
            });

            let daftarT = Array.from(topikSet).sort(function(a, b) {
                if (a === 'Umum') return 1;
                if (b === 'Umum') return -1;
                return a.localeCompare(b);
            });

            let htmlT = '<option value="SEMUA">📌 Semua Topik' + (daftarT.length > 1 ? (' (' + daftarT.length + ')') : '') + '</option>';
            daftarT.forEach(function(t) {
                htmlT += '<option value="' + t.replace(/"/g, '&quot;') + '">' + t + '</option>';
            });
            selTopik.innerHTML = htmlT;
        }
    }

    window.renderDaftarSoalSpesifik();
};

window.renderDaftarSoalSpesifik = function() {
    let kelas = document.getElementById('spesifik-soal-kelas') ? document.getElementById('spesifik-soal-kelas').value : '';
    let mapel = document.getElementById('spesifik-soal-mapel') ? document.getElementById('spesifik-soal-mapel').value : '';
    let bab = document.getElementById('spesifik-soal-bab') ? document.getElementById('spesifik-soal-bab').value : '';
    let topik = document.getElementById('spesifik-soal-topik') ? document.getElementById('spesifik-soal-topik').value : 'SEMUA';
    let kesulitan = document.getElementById('spesifik-soal-kesulitan') ? document.getElementById('spesifik-soal-kesulitan').value : '';
    let container = document.getElementById('spesifik-daftar-soal-container');
    let infoTampil = document.getElementById('spesifik-info-jumlah-tampil');

    if (!container) return;

    if (!kelas || !mapel || !kesulitan) {
        window.currentSpesifikRenderedList = [];
        if (infoTampil) infoTampil.innerText = '0';
        container.innerHTML = '<div style="text-align:center; padding:35px 15px; color:#7f8c8d; font-size:13px;">Silakan pilih <b>Kelas</b>, <b>Mapel</b>, dan <b>Tingkat Kesulitan</b> di atas untuk membuka daftar soal.</div>';
        window.perbaruiCounterSoalSpesifik();
        return;
    }

    let bank = window.adminBankLatihanData || {};
    let daftarTampil = [];

    Object.keys(bank).sort().forEach(function(bankKey) {
        let item = bank[bankKey];
        if (!item || item.kelas !== kelas || item.mapel !== mapel) return;
        if (bab && bab !== 'SEMUA' && item.bab !== bab) return;

        let topikItem = (typeof window.normalisasiTopikLatihan === 'function')
            ? window.normalisasiTopikLatihan(item.topik)
            : (String(item.topik || '').trim() || 'Umum');
        if (topik && topik !== 'SEMUA' && topikItem !== topik) return;

        let lvlItem = String(item.kesulitan || 'C1').toUpperCase().trim();
        if (kesulitan !== 'SEMUA' && lvlItem !== kesulitan) return;

        let arrSoal = Array.isArray(item.soal) ? item.soal : Object.values(item.soal || {});
        arrSoal.forEach(function(q, qIdx) {
            if (!q || !q.question) return;
            let uniqueId = bankKey + '__' + qIdx;
            daftarTampil.push({
                uid: uniqueId,
                bab: item.bab || '-',
                topik: topikItem,
                kesulitan: lvlItem,
                soalObj: q
            });
        });
    });

    window.currentSpesifikRenderedList = daftarTampil;
    if (infoTampil) infoTampil.innerText = String(daftarTampil.length);

    if (daftarTampil.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:35px 15px; color:#e67e22; font-weight:bold; font-size:13px;">Tidak ada soal yang ditemukan untuk filter ini.</div>';
        window.perbaruiCounterSoalSpesifik();
        return;
    }

    let html = '';
    daftarTampil.forEach(function(entry, idx) {
        let q = entry.soalObj;
        let isChecked = Boolean(window.selectedSoalSpesifikMap[entry.uid]);
        let tipeQ = (q.type || q.tipe || 'PG').toUpperCase();
        if (tipeQ === 'ISIAN' || tipeQ === 'SHORT_ANSWER') tipeQ = 'IS';
        if (tipeQ === 'ESAI') tipeQ = 'Essay';

        let warnaTipe = tipeQ === 'PG' ? '#3498db' : (tipeQ === 'PGK' ? '#8e44ad' : (tipeQ === 'IS' ? '#f39c12' : '#e67e22'));
        let warnaLvl = entry.kesulitan === 'C1' ? '#27ae60' : (entry.kesulitan === 'C2' ? '#d35400' : '#c0392b');

        let opsiHtml = '';
        if (Array.isArray(q.options) && q.options.length > 0 && tipeQ !== 'IS' && tipeQ !== 'Essay') {
            opsiHtml = '<div style="margin-top:6px; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:4px; font-size:11px; color:#475569; background:#f8fafc; padding:6px 8px; border-radius:6px; border:1px solid #e2e8f0;">';
            q.options.forEach(function(o, oIdx) {
                let lbl = (typeof o === 'object' && o.label) ? o.label : String.fromCharCode(65 + oIdx);
                let txt = (typeof o === 'object' && o.text !== undefined) ? o.text : String(o || '');
                opsiHtml += '<div><b>' + lbl + '.</b> ' + txt + '</div>';
            });
            opsiHtml += '</div>';
        }

        let kunciArr = Array.isArray(q.correct) ? q.correct : (q.correct ? [q.correct] : []);
        let kunciStr = kunciArr.length > 0 ? kunciArr.join(', ') : '-';
        let safeUid = entry.uid.replace(/'/g, "\\'");

        let borderCard = isChecked ? '2px solid #8e44ad' : '1px solid #cbd5e1';
        let bgCard = isChecked ? '#faf5ff' : '#ffffff';
        let badgeTopikHtml = (entry.topik && entry.topik !== 'Umum')
            ? '<span style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; padding:1px 7px; border-radius:4px; font-size:10px; font-weight:bold;">📌 ' + entry.topik + '</span>'
            : '';

        html +=
            '<label id="card-spesifik-' + entry.uid + '" style="display:flex; align-items:flex-start; gap:12px; background:' + bgCard + '; border:' + borderCard + '; border-radius:8px; padding:12px; cursor:pointer; transition:0.15s;">' +
                '<input type="checkbox" class="chk-item-soal-spesifik" data-uid="' + entry.uid + '" ' + (isChecked ? 'checked' : '') + ' style="width:19px; height:19px; margin-top:2px; cursor:pointer; accent-color:#8e44ad; flex-shrink:0;" onchange="window.togglePilihSatuSoalSpesifik(\'' + safeUid + '\', this.checked)">' +
                '<div style="flex:1; min-width:0;">' +
                    '<div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:5px;">' +
                        '<span style="font-weight:800; font-size:12px; color:#1e293b;">#' + (idx + 1) + '</span>' +
                        '<span style="background:' + warnaTipe + '; color:white; padding:1px 7px; border-radius:4px; font-size:10px; font-weight:bold;">' + tipeQ + '</span>' +
                        '<span style="background:' + warnaLvl + '; color:white; padding:1px 7px; border-radius:4px; font-size:10px; font-weight:bold;">' + entry.kesulitan + '</span>' +
                        '<span style="background:#eaf2f8; color:#2980b9; padding:1px 7px; border-radius:4px; font-size:10px; font-weight:bold;">📖 ' + entry.bab + '</span>' +
                        badgeTopikHtml +
                        '<span style="font-size:11px; color:#16a085; font-weight:bold; margin-left:auto;">🔑 Kunci: ' + kunciStr + '</span>' +
                    '</div>' +
                    '<div style="font-size:13px; color:#1e293b; line-height:1.45; font-weight:600;">' + q.question + '</div>' +
                    opsiHtml +
                '</div>' +
            '</label>';
    });

    container.innerHTML = html;
    window.perbaruiCounterSoalSpesifik();
};

window.togglePilihSatuSoalSpesifik = function(uid, isChecked) {
    let found = (window.currentSpesifikRenderedList || []).find(function(item) {
        return item.uid === uid;
    });

    if (isChecked && found) {
        window.selectedSoalSpesifikMap[uid] = found.soalObj;
    } else {
        delete window.selectedSoalSpesifikMap[uid];
    }

    let cardEl = document.getElementById('card-spesifik-' + uid);
    if (cardEl) {
        cardEl.style.border = isChecked ? '2px solid #8e44ad' : '1px solid #cbd5e1';
        cardEl.style.background = isChecked ? '#faf5ff' : '#ffffff';
    }

    window.perbaruiCounterSoalSpesifik();
};

window.toggleCentangSemuaSoalSpesifik = function(centang) {
    let list = window.currentSpesifikRenderedList || [];
    if (list.length === 0) return;

    list.forEach(function(item) {
        if (centang) {
            window.selectedSoalSpesifikMap[item.uid] = item.soalObj;
        } else {
            delete window.selectedSoalSpesifikMap[item.uid];
        }
    });

    window.renderDaftarSoalSpesifik();
};

window.resetPilihanSoalSpesifik = function() {
    window.selectedSoalSpesifikMap = {};
    window.renderDaftarSoalSpesifik();
};

window.perbaruiCounterSoalSpesifik = function() {
    let jml = Object.keys(window.selectedSoalSpesifikMap || {}).length;
    let infoEl = document.getElementById('spesifik-info-jumlah-terpilih');
    if (infoEl) infoEl.innerText = String(jml);

    let btnEl = document.getElementById('btn-eksekusi-ambil-spesifik');
    if (btnEl) {
        btnEl.innerText = '📥 Ambil Soal (' + jml + ' Terpilih) 🚀';
        btnEl.style.opacity = jml > 0 ? '1' : '0.75';
    }
};

window.eksekusiAmbilSoalSpesifik = function() {
    let keys = Object.keys(window.selectedSoalSpesifikMap || {});
    if (keys.length === 0) {
        return alert("⚠️ Centang minimal 1 soal dari daftar di atas terlebih dahulu!");
    }

    let hasilSoalKumpulan = keys.map(function(k) {
        return window.selectedSoalSpesifikMap[k];
    }).filter(Boolean);

    let namaTarget = window.isTarikKeKuisInline ? "Kuis Inline" : "editor Manajer Ujian";
    let pesan = '✅ Berhasil mengambil ' + hasilSoalKumpulan.length + ' soal spesifik pilihan Anda ke ' + namaTarget + '!';

    window.masukkanSoalKeTargetAmbil(hasilSoalKumpulan, pesan);
};

window.ekstrakSoalLokalRegex = function(text) {
    let lines = text.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
    let finalOutput = "";
    let currentMode = null;
    let hasOptions = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        let qMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
        if (qMatch) {
            if (finalOutput !== "") finalOutput += "\n\n---\n\n";
            finalOutput += "Soal: " + qMatch[2];
            currentMode = 'Q';
            hasOptions = false;
            continue;
        }

        if (!currentMode) continue;

        let optMatch = line.match(/^([A-Ea-e])[\.\)]\s+(.*)/);
        if (optMatch) {
            finalOutput += "\n" + optMatch[1].toUpperCase() + ". " + optMatch[2];
            currentMode = 'O';
            hasOptions = true;
            continue;
        }

        let keyMatch = line.match(/^(?:Kunci|Jawaban)\s*:\s*(.*)/i);
        if (keyMatch) {
            if (!hasOptions) {
                finalOutput += "\nTipe: IS";
            }
            finalOutput += "\nKunci: " + keyMatch[1].toUpperCase();
            currentMode = 'K';
            continue;
        }

        let expMatch = line.match(/^Pembahasan\s*:\s*(.*)/i);
        if (expMatch) {
            finalOutput += "\nPembahasan: " + expMatch[1];
            currentMode = 'P';
            continue;
        }

        if (currentMode === 'Q') {
            finalOutput += "<br>" + line;
        } else if (currentMode === 'O' || currentMode === 'K' || currentMode === 'P') {
            finalOutput += " " + line;
        }
    }
    return finalOutput;
};

window.prosesUploadSoalLokal = async function(inputElem) {
    let file = inputElem.files[0];
    if (!file) return;

    let btnUpload = inputElem.nextElementSibling;
    let oldBtnText = btnUpload.innerText;
    btnUpload.innerText = "⏳ Membaca Dokumen...";
    btnUpload.disabled = true;

    try {
        let extractedText = "";

        if (file.name.toLowerCase().endsWith(".pdf")) {
            if (!window.pdfjsLib) throw new Error("Mesin PDF.js belum siap, tunggu beberapa detik.");
            let arrayBuffer = await file.arrayBuffer();
            let pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            for (let i = 1; i <= pdf.numPages; i++) {
                let page = await pdf.getPage(i);
                let content = await page.getTextContent();
                extractedText += content.items.map(function(item) { return item.str; }).join(" ") + "\n";
            }
        } else if (file.name.toLowerCase().endsWith(".docx")) {
            if (!window.mammoth) throw new Error("Mesin Mammoth.js belum siap, tunggu beberapa detik.");
            let arrayBuffer = await file.arrayBuffer();
            let result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            extractedText = result.value;
        } else {
            throw new Error("Format file tidak didukung. Harap upload .pdf atau .docx");
        }

        if (extractedText.trim().length < 10) throw new Error("Teks dalam dokumen kosong atau tidak terbaca.");

        btnUpload.innerText = "⚙️ Menyusun Soal...";

        let finalOutput = window.ekstrakSoalLokalRegex(extractedText);

        if (finalOutput.trim() === "") throw new Error("Gagal mengenali format. Pastikan dokumen memiliki Nomor Soal (1.), Opsi (A.), dan Kunci:.");

        let textArea = document.getElementById('admin-bu-text');
        if (textArea.value.trim() !== "") textArea.value += "\n\n---\n\n" + finalOutput;
        else textArea.value = finalOutput;

        window.analisisSoalOtomatis();
        alert("✅ Ekstraksi dokumen berhasil! Soal telah masuk ke dalam editor.");

    } catch (err) {
        console.error(err);
        alert("❌ Error: " + err.message);
    } finally {
        btnUpload.innerText = oldBtnText;
        btnUpload.disabled = false;
        inputElem.value = "";
    }
};

// =========================================================================
// 6. OBSERVER MODAL MANAJER UJIAN & MANAJER LATIHAN
// =========================================================================
document.addEventListener("DOMContentLoaded", function() {
    let modalMU = document.getElementById('modal-manajer-ujian');
    if (modalMU) {
        let obsMU = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.target.id === 'modal-manajer-ujian' && m.target.style.display === 'flex') {
                    window.renderManajerUjian();
                }
            });
        });
        obsMU.observe(modalMU, { attributes: true, attributeFilter: ['style'] });
    }

    let modalMS = document.getElementById('modal-manajer-soal');
    if (modalMS) {
        let obsMS = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.target.id === 'modal-manajer-soal' && m.target.style.display === 'flex') {
                    window.renderManajerSoal();
                    window.muatPengaturanLatihanDariServer(false);
                }
            });
        });
        obsMS.observe(modalMS, { attributes: true, attributeFilter: ['style'] });
    }
});