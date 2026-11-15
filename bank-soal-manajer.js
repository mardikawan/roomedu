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
window.bukaModalBankLatihanBaru = function() {
    document.getElementById("admin-bs-kelas").disabled = false;
    document.getElementById("admin-bs-mapel").disabled = false;
    document.getElementById("admin-bs-bab").disabled = false;
    document.getElementById("admin-bs-kesulitan").disabled = false;
    document.getElementById("admin-bs-text").value = "";

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

    document.getElementById("admin-bs-kelas").disabled = true;
    document.getElementById("admin-bs-mapel").disabled = true;
    document.getElementById("admin-bs-bab").disabled = true;
    document.getElementById("admin-bs-kesulitan").disabled = true;

    if (typeof window.konversiSoalKeTeksMentah === "function") {
        document.getElementById("admin-bs-text").value = window.konversiSoalKeTeksMentah(item.soal || []);
    }

    window.modeSimpanBankLatihan = "edit";
    window.kunciEditBankLatihan = key;

    document.querySelector("#modal-admin-bank-soal .modal-header h3").innerHTML = "✏️ Edit Arsip Latihan (" + item.kesulitan + ")";
    let btn = document.querySelector("#modal-admin-bank-soal .btn-action");
    btn.innerHTML = "Simpan Perubahan 💾";
    btn.style.background = "#27ae60";
    btn.style.color = "#ffffff";

    window.bukaModal("modal-admin-bank-soal");
};

window.tambahSoalBankLatihan = function(key) {
    let item = window.adminBankLatihanData[key];
    if (!item) return;

    document.getElementById("admin-bs-kelas").value = item.kelas;
    document.getElementById("admin-bs-mapel").value = item.mapel;
    document.getElementById("admin-bs-bab").value = item.bab;
    document.getElementById("admin-bs-kesulitan").value = item.kesulitan || "C1";

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
        window.adminBankLatihanData[window.kunciEditBankLatihan].soal = questions;
    } else if (window.modeSimpanBankLatihan === 'append_or_new' || window.modeSimpanBankLatihan === 'append') {
        let existingKey = null;
        Object.keys(window.adminBankLatihanData).forEach(function(k) {
            let i = window.adminBankLatihanData[k];
            if (i && i.kelas === kelas && i.mapel === mapel && i.bab === bab && i.kesulitan === kesulitan) {
                existingKey = k;
            }
        });

        if (existingKey) {
            let lama = window.adminBankLatihanData[existingKey].soal || [];
            window.adminBankLatihanData[existingKey].soal = lama.concat(questions);
        } else {
            let newKey = "bs_" + Date.now();
            window.adminBankLatihanData[newKey] = {
                kelas: kelas, mapel: mapel, bab: bab, kesulitan: kesulitan, soal: questions
            };
        }
    } else {
        let newKey = "bs_" + Date.now();
        window.adminBankLatihanData[newKey] = {
            kelas: kelas, mapel: mapel, bab: bab, kesulitan: kesulitan, soal: questions
        };
    }

    window.renderManajerSoal();
    if (typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();

    window.tutupModal('modal-admin-bank-soal');
    alert("Berhasil menyimpan ke Bank Soal Latihan!");
};

window.renderManajerSoal = function() {
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

        if (!groupedByBab[groupKey]) {
            groupedByBab[groupKey] = {
                kelas: item.kelas,
                mapel: item.mapel,
                bab: item.bab,
                c1: { key: null, count: 0 },
                c2: { key: null, count: 0 },
                hots: { key: null, count: 0 },
                total: 0
            };
        }

        let jmlSoal = item.soal ? item.soal.length : 0;
        groupedByBab[groupKey].total += jmlSoal;

        let t = (item.kesulitan || "").toUpperCase();
        if (t === "C1") { groupedByBab[groupKey].c1 = { key: key, count: jmlSoal }; }
        else if (t === "C2") { groupedByBab[groupKey].c2 = { key: key, count: jmlSoal }; }
        else if (t === "HOTS") { groupedByBab[groupKey].hots = { key: key, count: jmlSoal }; }
    });

    let groupKeys = Object.keys(groupedByBab).sort();

    if (groupKeys.length === 0) {
        listEl.innerHTML = '<li style="text-align:center; padding:20px; color:#7f8c8d;">Belum ada soal latihan untuk kelas ini.</li>';
        return;
    }

    let html = '';
    groupKeys.forEach(function(gKey) {
        let g = groupedByBab[gKey];

        let badgeC1 = g.c1.key
            ? '<span style="background:#27ae60; color:white; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold; display:inline-flex; align-items:center; gap:4px; cursor:pointer;" onclick="window.editBankLatihan(\'' + g.c1.key + '\')" title="Edit Soal C1">C1: ' + g.c1.count + ' <span style="font-size:9px;">✏️</span></span>'
            : '<span style="background:#e2e8f0; color:#94a3b8; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold;">C1: 0</span>';

        let badgeC2 = g.c2.key
            ? '<span style="background:#f39c12; color:white; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold; display:inline-flex; align-items:center; gap:4px; cursor:pointer;" onclick="window.editBankLatihan(\'' + g.c2.key + '\')" title="Edit Soal C2">C2: ' + g.c2.count + ' <span style="font-size:9px;">✏️</span></span>'
            : '<span style="background:#e2e8f0; color:#94a3b8; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold;">C2: 0</span>';

        let badgeHOTS = g.hots.key
            ? '<span style="background:#c0392b; color:white; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold; display:inline-flex; align-items:center; gap:4px; cursor:pointer;" onclick="window.editBankLatihan(\'' + g.hots.key + '\')" title="Edit Soal HOTS">HOTS: ' + g.hots.count + ' <span style="font-size:9px;">✏️</span></span>'
            : '<span style="background:#e2e8f0; color:#94a3b8; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold;">HOTS: 0</span>';

        let repKey = g.c1.key || g.c2.key || g.hots.key;
        let safeKls = String(g.kelas || '').replace(/'/g, "\\'");
        let safeMpl = String(g.mapel || '').replace(/'/g, "\\'");
        let safeBab = String(g.bab || '').replace(/'/g, "\\'");

        html += '<li class="soal-manager-item" style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">' +
            '<div class="soal-manager-info" style="flex:1; min-width:260px;">' +
                '<strong style="font-size:15px; color:#2c3e50;">🚀 ' + g.bab + '</strong> <span style="color:#7f8c8d; font-size:13px;">(' + g.mapel + ')</span><br>' +
                '<div style="margin-top:6px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">' +
                    '<span class="soal-manager-tag" style="background:#8e44ad; font-size:11px; display:inline-block; margin-right:4px;">' + g.kelas + '</span>' +
                    badgeC1 + badgeC2 + badgeHOTS +
                '</div>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:10px;">' +
                '<span style="color:#27ae60; font-weight:900; font-size:13px; margin-right:5px; white-space:nowrap;">' + g.total + ' Total Soal</span>' +
                '<div style="display:flex; gap:5px;">' +
                    '<button class="btn-action" style="background:#f1c40f; color:#2c3e50; padding:6px 12px; font-size:12px; width:auto;" onclick="window.tambahSoalBankLatihan(\'' + repKey + '\')">➕ Tambah</button>' +
                    '<button class="btn-delete-soal" style="padding:6px 12px; font-size:12px; width:auto;" onclick="window.hapusBankLatihanGroup(\'' + safeKls + '\', \'' + safeMpl + '\', \'' + safeBab + '\')">🗑️ Hapus</button>' +
                '</div>' +
            '</div>' +
        '</li>';
    });

    listEl.innerHTML = html;
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
    let htmlOpt = '<option value="">-- Pilih Paket Ujian --</option>';

    let paketAktif = Object.values(window.adminUjianAktifData || {}).map(function(u) { return u.paket; });
    let bankKeys = Object.keys(window.adminBankUjianData || {});

    bankKeys.forEach(function(k) {
        if (!paketAktif.includes(k)) {
            htmlOpt += '<option value="' + k + '">' + k + '</option>';
        }
    });

    if (selectEl) selectEl.innerHTML = htmlOpt;

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
window.bukaModalAmbilSoal = function(isUntukKuisInline) {
    window.isTarikKeKuisInline = Boolean(isUntukKuisInline);

    let selKelas = document.getElementById('ambil-soal-kelas');
    let bank = window.adminBankLatihanData || {};
    let kelasSet = new Set();
    Object.values(bank).forEach(function(item) { if (item && item.kelas) kelasSet.add(item.kelas); });

    let htmlK = '<option value="">-- Pilih Kelas --</option>';
    Array.from(kelasSet).sort().forEach(function(k) { htmlK += '<option value="' + k + '">' + k + '</option>'; });
    if (selKelas) selKelas.innerHTML = htmlK;

    let selMapel = document.getElementById('ambil-soal-mapel');
    if (selMapel) selMapel.innerHTML = '<option value="">-- Tunggu Kelas --</option>';

    let container = document.getElementById('ambil-soal-bab-container');
    if (container) container.innerHTML = '';

    window.resetAmbilSoalPersen();
    window.bukaModal('modal-ambil-soal-ujian');
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
                    '<input type="checkbox" class="chk-ambil-bab" value="' + safeVal + '" onchange="window.updateInfoStokTarikSoal()"> ' + b +
                 '</label>';
    });
    container.innerHTML = htmlB || '<span style="font-size:12px; color:#888;">Tidak ada bab tersedia.</span>';
    window.updateInfoStokTarikSoal();
};

window.updateInfoStokTarikSoal = function() {
    let kelas = document.getElementById('ambil-soal-kelas').value;
    let mapel = document.getElementById('ambil-soal-mapel').value;
    let selectedBabs = Array.from(document.querySelectorAll('.chk-ambil-bab:checked')).map(function(el) { return el.value; });

    let stok = {
        PG: { C1: 0, C2: 0, HOTS: 0 },
        PGK: { C1: 0, C2: 0, HOTS: 0 },
        IS: { C1: 0, C2: 0, HOTS: 0 },
        Essay: { C1: 0, C2: 0, HOTS: 0 }
    };

    let bank = window.adminBankLatihanData || {};
    Object.values(bank).forEach(function(item) {
        if (item && item.kelas === kelas && item.mapel === mapel && selectedBabs.includes(item.bab)) {
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

window.eksekusiTarikSoalKeUjian = function() {
    let kelas = document.getElementById('ambil-soal-kelas').value;
    let mapel = document.getElementById('ambil-soal-mapel').value;
    let selectedBabs = Array.from(document.querySelectorAll('.chk-ambil-bab:checked')).map(function(el) { return el.value; });

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

        if (peringatanStok.length > 0) {
            alert('⚠️ Berhasil menarik ' + totalDitarik + ' soal ke Kuis Inline.\n\nStok tidak mencukupi untuk kategori berikut:\n' + peringatanStok.join('\n'));
        } else {
            alert('✅ Berhasil menarik tepat ' + totalDitarik + ' soal ke Kuis Inline secara acak!');
        }
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

        if (peringatanStok.length > 0) {
            alert('⚠️ Berhasil menarik ' + totalDitarik + ' soal ke editor.\n\nStok tidak mencukupi untuk kategori berikut:\n' + peringatanStok.join('\n'));
        } else {
            alert('✅ Berhasil menarik tepat ' + totalDitarik + ' soal ke editor secara acak!');
        }
    }
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
                }
            });
        });
        obsMS.observe(modalMS, { attributes: true, attributeFilter: ['style'] });
    }
});