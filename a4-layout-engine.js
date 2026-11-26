/* =========================================================================
   A4 LAYOUT ENGINE (STABIL — SEJAJAR 100% A4, KUIS, MEDIA, & MODUL INTERAKTIF)
   - Lembar A4 Fix: 794x1123px (Margin 2cm) diskalakan ke 80% layar
   - Blok Kuis, Modul Interaktif, Video, & PDF: lebar identik (--a4-visual-width)
     TANPA CSS zoom agar tombol Ekstrak, iframe, & input berjalan 100% normal
   - Observer ringan (childList saja) -> tidak mengganggu Ekstrak/Media/Modul
   - Menjaga tombol kanan bawah (Dark Mode, Zoom +/-, Fullscreen, Scroll) selalu aktif
   ========================================================================= */

(function() {
    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;
    const A4_MARGIN_PX = 75.6;
    const A4_SAFE_BOTTOM_PX = A4_HEIGHT_PX - A4_MARGIN_PX;

    let _a4Updating = false;
    let _a4Timer = null;

    // =========================================================================
    // 1. DETEKSI HOME & KALKULASI LEBAR SERAGAM (80% LAYAR)
    // =========================================================================
    window.a4ApakahHalamanHome = function() {
        let homeLayout = document.querySelector('.home-three-col-layout.is-home-active');
        if (homeLayout) return true;
        let params = new URLSearchParams(window.location.search);
        let bab = (params.get('bab') || '').trim().toLowerCase();
        if (bab === 'home') return true;
        let bc = document.getElementById('bottom-breadcrumb');
        if (!bab && bc && bc.innerText.trim().toLowerCase() === 'home') return true;
        return false;
    };

    window.a4HitungSkalaLayar = function() {
        let isHome = window.a4ApakahHalamanHome();
        let vw = document.documentElement.clientWidth || window.innerWidth || 1200;

        if (isHome) {
            document.body.classList.remove('a4-workspace-active');
            document.documentElement.style.setProperty('--a4-screen-scale', '1');
            document.documentElement.style.setProperty('--a4-visual-width', '820px');
            return;
        }

        document.body.classList.add('a4-workspace-active');

        if (vw <= 768) {
            document.documentElement.style.setProperty('--a4-screen-scale', '1');
            document.documentElement.style.setProperty('--a4-visual-width', '100%');
            return;
        }

        let targetVisualWidth = Math.round(vw * 0.80);
        let scale = targetVisualWidth / A4_WIDTH_PX;
        document.documentElement.style.setProperty('--a4-screen-scale', scale.toFixed(4));
        document.documentElement.style.setProperty('--a4-visual-width', Math.round(A4_WIDTH_PX * scale) + 'px');
    };

    // =========================================================================
    // 2. DETEKSI TIPE BLOK ('a4' vs 'media') & JENIS WIDGET BAWAAN
    // =========================================================================
    window.a4ApakahBlokWidgetTetap = function(contentBlockEl, wrapperEl) {
        if (wrapperEl && wrapperEl.querySelector('.pdf-landscape-block, .quiz-container, .modul-interaktif-card')) {
            return true;
        }
        if (contentBlockEl && contentBlockEl.querySelector('.quiz-container, .modul-interaktif-card')) {
            return true;
        }
        return false;
    };

    window.a4DeteksiTipeBlok = function(contentBlockEl, wrapperEl) {
        if (!contentBlockEl) return 'media';
        if (window.a4ApakahBlokWidgetTetap(contentBlockEl, wrapperEl)) return 'media';

        let meta = contentBlockEl.querySelector('.a4-type-meta');
        if (meta) {
            let savedType = meta.getAttribute('data-sheet-type');
            if (savedType === 'a4' || savedType === 'media') return savedType;
        }

        let hasMedia = Boolean(
            contentBlockEl.querySelector('.gdrive-pdf-a4, video, audio, iframe')
        );
        if (hasMedia) return 'media';

        return 'a4';
    };

    window.a4SetTipeBlok = function(contentBlockEl, tipeBaru) {
        if (!contentBlockEl) return;
        let meta = contentBlockEl.querySelector('.a4-type-meta');
        if (!meta) {
            meta = document.createElement('span');
            meta.className = 'a4-type-meta';
            meta.setAttribute('contenteditable', 'false');
            meta.style.display = 'none';
            contentBlockEl.appendChild(meta);
        }
        meta.setAttribute('data-sheet-type', tipeBaru);

        contentBlockEl.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(function() {
            contentBlockEl.dispatchEvent(new Event('blur', { bubbles: true }));
        }, 80);

        window.a4SegarkanSemuaBlok();
    };

    window.a4ToggleTipeBlokByIdx = function(blockIdx) {
        let wrappers = document.querySelectorAll('#blocks-container > .block-wrapper');
        let wrap = wrappers[blockIdx];
        if (!wrap) return;
        let cb = wrap.querySelector(':scope > .a4-paper-wrapper > .block-collapsible-area > .content-block, :scope > .dynamic-block-shell > .block-collapsible-area > .content-block, :scope > .content-block');
        if (!cb) return;
        let cur = wrap.getAttribute('data-sheet-type') || 'a4';
        let next = (cur === 'a4') ? 'media' : 'a4';
        window.a4SetTipeBlok(cb, next);
    };

    // =========================================================================
    // 3. PEMISAH OTOMATIS KONTEN YANG MELUBER KE LEMBAR A4 BERIKUTNYA
    // =========================================================================
    window.a4PisahKontenMeluber = function(blockIdx) {
        let wrappers = document.querySelectorAll('#blocks-container > .block-wrapper');
        let wrap = wrappers[blockIdx];
        if (!wrap) return;
        let cb = wrap.querySelector(':scope > .a4-paper-wrapper > .block-collapsible-area > .content-block, :scope > .dynamic-block-shell > .block-collapsible-area > .content-block');
        if (!cb) return;

        let children = Array.from(cb.childNodes).filter(function(node) {
            if (node.nodeType === 1 && node.classList.contains('a4-type-meta')) return false;
            if (node.nodeType === 3 && !node.textContent.trim()) return false;
            return true;
        });

        if (children.length <= 1) {
            return alert('⚠️ Konten meluber berada di dalam 1 elemen besar. Tekan Enter untuk membagi paragraf terlebih dahulu.');
        }

        let cbRect = cb.getBoundingClientRect();
        let a4Scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--a4-screen-scale')) || 1;
        let pageZoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--user-page-zoom')) || 1;
        let batasVisualY = cbRect.top + (A4_SAFE_BOTTOM_PX * a4Scale * pageZoom);

        let nodesPindah = [];
        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            let rect = null;
            if (node.nodeType === 1) {
                rect = node.getBoundingClientRect();
            } else if (node.nodeType === 3) {
                let range = document.createRange();
                range.selectNodeContents(node);
                rect = range.getBoundingClientRect();
            }
            if (i > 0 && rect && rect.bottom > batasVisualY) {
                nodesPindah = children.slice(i);
                break;
            }
        }

        if (nodesPindah.length === 0) {
            return alert('ℹ️ Konten sudah pas di dalam 1 lembar A4.');
        }

        let htmlPindah = nodesPindah.map(function(n) {
            return (n.nodeType === 1) ? n.outerHTML : ('<p>' + n.textContent + '</p>');
        }).join('');

        let btnAddBelow = wrap.querySelector('.btn-add-block-below');
        if (!btnAddBelow) {
            return alert('⚠️ Masuk ke Mode Edit terlebih dahulu agar sistem bisa menambah lembar A4 baru.');
        }

        nodesPindah.forEach(function(n) {
            if (n.parentNode) n.parentNode.removeChild(n);
        });
        cb.dispatchEvent(new Event('input', { bubbles: true }));
        btnAddBelow.click();

        setTimeout(function() {
            let newWrappers = document.querySelectorAll('#blocks-container > .block-wrapper');
            let targetWrap = newWrappers[blockIdx + 1];
            let targetCb = targetWrap ? targetWrap.querySelector(':scope > .a4-paper-wrapper > .block-collapsible-area > .content-block, :scope > .dynamic-block-shell > .block-collapsible-area > .content-block') : null;
            if (targetCb) {
                targetCb.innerHTML = htmlPindah;
                window.a4SetTipeBlok(targetCb, 'a4');
                targetCb.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(function() {
                    cb.dispatchEvent(new Event('blur', { bubbles: true }));
                    targetCb.dispatchEvent(new Event('blur', { bubbles: true }));
                    window.a4SegarkanSemuaBlok();
                }, 120);
            }
        }, 220);
    };

    // =========================================================================
    // 4. SINKRONISASI VISUAL SEMUA CONTENT BLOCK (A4 vs KUIS/MEDIA/MODUL)
    // =========================================================================
    window.a4SegarkanSemuaBlok = function() {
        if (_a4Updating) return;
        _a4Updating = true;

        try {
            window.a4HitungSkalaLayar();
            let isHome = window.a4ApakahHalamanHome();
            let wrappers = document.querySelectorAll('#blocks-container > .block-wrapper');
            let nomorLembarA4 = 0;

            wrappers.forEach(function(wrap, idx) {
                let shell = wrap.querySelector(':scope > .a4-paper-wrapper, :scope > .dynamic-block-shell');
                let cb = shell
                    ? shell.querySelector(':scope > .block-collapsible-area > .content-block')
                    : wrap.querySelector(':scope > .content-block');
                let oldStrip = wrap.querySelector(':scope > .a4-paper-wrapper > .a4-sheet-admin-strip, :scope > .dynamic-block-shell > .a4-sheet-admin-strip');
                let oldCut = wrap.querySelector('.a4-overflow-cutline');

                if (isHome || !cb) {
                    wrap.removeAttribute('data-sheet-type');
                    wrap.classList.remove('sheet-is-a4', 'sheet-is-media', 'sheet-is-overflow', 'has-a4-strip', 'has-embedded-widget');
                    if (oldStrip) oldStrip.remove();
                    if (oldCut) oldCut.remove();
                    return;
                }

                // Khusus Slide PDF (.pdf-landscape-block tanpa .a4-paper-wrapper)
                if (!shell) {
                    wrap.setAttribute('data-sheet-type', 'media');
                    wrap.classList.add('sheet-is-media', 'has-embedded-widget');
                    wrap.classList.remove('sheet-is-a4', 'sheet-is-overflow', 'has-a4-strip');
                    if (oldStrip) oldStrip.remove();
                    if (oldCut) oldCut.remove();
                    return;
                }

                let isWidgetTetap = window.a4ApakahBlokWidgetTetap(cb, wrap);
                let tipe = isWidgetTetap ? 'media' : window.a4DeteksiTipeBlok(cb, wrap);

                wrap.setAttribute('data-sheet-type', tipe);
                shell.setAttribute('data-sheet-type', tipe);
                wrap.classList.toggle('has-embedded-widget', isWidgetTetap);

                if (tipe === 'a4') {
                    nomorLembarA4++;
                    wrap.classList.add('sheet-is-a4');
                    wrap.classList.remove('sheet-is-media');
                } else {
                    wrap.classList.add('sheet-is-media');
                    wrap.classList.remove('sheet-is-a4');
                }

                // Untuk Kuis & Modul Interaktif: jangan pasang strip A4 agar tombol Ekstrak/header bersih
                if (isWidgetTetap) {
                    wrap.classList.remove('sheet-is-overflow', 'has-a4-strip');
                    if (oldStrip) oldStrip.remove();
                    if (oldCut) oldCut.remove();
                    return;
                }

                let collapsible = cb.closest('.block-collapsible-area');
                let isCollapsed = Boolean(collapsible && collapsible.style.display === 'none');

                let isOverflow = false;
                let perkiraanHal = 1;
                if (tipe === 'a4' && !isCollapsed) {
                    let tinggiKonten = cb.scrollHeight || 0;
                    if (tinggiKonten > A4_HEIGHT_PX + 6) {
                        isOverflow = true;
                        perkiraanHal = (tinggiKonten / A4_HEIGHT_PX).toFixed(1);
                    }
                }
                wrap.classList.toggle('sheet-is-overflow', isOverflow);
                wrap.classList.add('has-a4-strip');

                let strip = oldStrip;
                if (!strip) {
                    strip = document.createElement('div');
                    strip.className = 'a4-sheet-admin-strip';
                    shell.insertBefore(strip, shell.firstChild);
                }

                let statusHtml = (tipe === 'a4')
                    ? '<span class="a4-badge-type is-a4">📄 Lembar A4 #' + nomorLembarA4 + ' (210×297 mm • Margin 2 cm)</span>' +
                        (isOverflow
                            ? '<span class="a4-badge-warn">⚠️ Melebihi 1 halaman (~' + perkiraanHal + ' hal)</span>'
                            : '<span class="a4-badge-ok">✅ Pas 1 Halaman</span>')
                    : '<span class="a4-badge-type is-media">🧩 Blok Media / Non-Fix (Tinggi Fleksibel)</span>';

                let aksiHtml = '<div class="a4-strip-actions">' +
                    (isOverflow
                        ? '<button type="button" class="a4-strip-btn is-split" onclick="window.a4PisahKontenMeluber(' + idx + ')" title="Pindahkan otomatis konten di bawah garis merah ke lembar A4 baru">✂️ Pisah ke Lembar Baru</button>'
                        : '') +
                    '<button type="button" class="a4-strip-btn" onclick="window.a4ToggleTipeBlokByIdx(' + idx + ')">' +
                        (tipe === 'a4' ? '🔄 Jadikan Blok Media' : '🔄 Jadikan Lembar A4') +
                    '</button>' +
                '</div>';

                let desiredStripHtml = '<div class="a4-strip-left">' + statusHtml + '</div>' + aksiHtml;
                if (strip.getAttribute('data-sig') !== desiredStripHtml) {
                    strip.setAttribute('data-sig', desiredStripHtml);
                    strip.innerHTML = desiredStripHtml;
                }

                if (isOverflow && collapsible) {
                    let cut = oldCut;
                    if (!cut) {
                        cut = document.createElement('div');
                        cut.className = 'a4-overflow-cutline';
                        cut.innerHTML = '<span>✂️ BATAS BAWAH KERTAS A4 (297 mm) — Konten di bawah garis ini melewati 1 halaman</span>';
                        collapsible.style.position = 'relative';
                        collapsible.appendChild(cut);
                    }
                    cut.style.top = A4_HEIGHT_PX + 'px';
                } else if (oldCut) {
                    oldCut.remove();
                }
            });
        } finally {
            _a4Updating = false;
        }
    };

    window.a4JadwalkanRefresh = function(delayMs) {
        clearTimeout(_a4Timer);
        _a4Timer = setTimeout(function() {
            window.a4SegarkanSemuaBlok();
        }, delayMs || 140);
    };

    // =========================================================================
    // 5. MESIN PRINT PDF A4 & EXPORT WORD (.doc) LANGSUNG DARI LEMBAR MATERI
    // =========================================================================
    window.a4KumpulkanLembarSiapCetak = function() {
        let wrappers = document.querySelectorAll('#blocks-container > .block-wrapper');
        let lembarA4 = [];
        let mediaCatatan = [];

        wrappers.forEach(function(wrap, idx) {
            let cb = wrap.querySelector(':scope > .a4-paper-wrapper > .block-collapsible-area > .content-block, :scope > .dynamic-block-shell > .block-collapsible-area > .content-block, :scope > .content-block');
            if (!cb) return;
            let tipe = wrap.getAttribute('data-sheet-type') || window.a4DeteksiTipeBlok(cb, wrap);
            let judulBar = wrap.querySelector('.block-collapse-bar');
            let judulBlok = judulBar ? judulBar.innerText.replace(/[▼▲▾▴]/g, '').trim() : ('Bagian ' + (idx + 1));

            if (tipe === 'a4') {
                let clone = cb.cloneNode(true);
                clone.querySelectorAll('.a4-type-meta, .block-controls, .btn-add-block-below, .btn-collapse-bottom-right, .drawing-layer, .draw-float-layer, .table-controls, .image-controls, script, style').forEach(function(el) {
                    el.remove();
                });
                let bersih = clone.innerHTML.trim();
                if (bersih && bersih.replace(/<[^>]*>/g, '').trim().length > 0) {
                    lembarA4.push({ nomor: lembarA4.length + 1, judul: judulBlok, html: bersih });
                }
            } else {
                let jenis = 'Media Digital / Interaktif';
                if (cb.querySelector('.quiz-container')) jenis = 'Kuis Interaktif';
                else if (cb.querySelector('.modul-interaktif-card')) jenis = 'Modul Visual Interaktif';
                else if (cb.querySelector('.gdrive-pdf-a4') || wrap.querySelector('.pdf-landscape-block')) jenis = 'Slide / Dokumen PDF';
                else if (cb.querySelector('iframe, video')) jenis = 'Video / Media Sematan';
                mediaCatatan.push({ judul: judulBlok, jenis: jenis });
            }
        });

        return { lembarA4: lembarA4, mediaCatatan: mediaCatatan };
    };

    window.a4PrintAtauExportMateri = function(format) {
        if (window.a4ApakahHalamanHome()) {
            return alert('ℹ️ Buka salah satu halaman Bab Materi terlebih dahulu untuk mencetak lembar A4.');
        }

        let data = window.a4KumpulkanLembarSiapCetak();
        if (data.lembarA4.length === 0) {
            return alert('⚠️ Tidak ada blok bertipe Lembar A4 pada halaman ini.');
        }

        let judulHal = (typeof window.maDeteksiJudulHalamanAktif === 'function')
            ? window.maDeteksiJudulHalamanAktif()
            : (document.title || 'MATERI_A4');

        let sheetsHtml = data.lembarA4.map(function(sheet, i) {
            let isLast = (i === data.lembarA4.length - 1);
            return '<div class="a4-physical-sheet' + (isLast ? ' is-last' : '') + '">' + sheet.html + '</div>';
        }).join('');

        let cssCetak =
            '* { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }' +
            'body { font-family: "Quicksand", "Times New Roman", Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #111111; margin: 0; padding: 0; background: #cbd5e1; }' +
            '.a4-physical-sheet { width: 210mm; min-height: 297mm; padding: 20mm; margin: 16px auto; background: #ffffff; box-shadow: 0 6px 24px rgba(0,0,0,0.18); page-break-after: always; break-after: page; overflow-wrap: break-word; }' +
            '.a4-physical-sheet.is-last { page-break-after: auto; break-after: auto; }' +
            '.a4-physical-sheet img { max-width: 100% !important; height: auto !important; }' +
            '.a4-physical-sheet table { width: 100% !important; border-collapse: collapse !important; margin: 8pt 0; }' +
            '.a4-physical-sheet th, .a4-physical-sheet td { border: 1px solid #475569 !important; padding: 5pt 7pt !important; vertical-align: top; }' +
            '.a4-physical-sheet h1 { font-size: 20pt; margin: 0 0 8pt 0; } .a4-physical-sheet h2 { font-size: 15pt; margin: 8pt 0 5pt 0; } .a4-physical-sheet h3 { font-size: 12.5pt; margin: 6pt 0 4pt 0; }' +
            '.a4-physical-sheet p { margin: 0 0 5pt 0; }' +
            '.a4-print-bar { position: sticky; top: 0; z-index: 99; background: #0b3954; color: #fff; padding: 10px 18px; display: flex; justify-content: space-between; align-items: center; font-family: Poppins, Arial, sans-serif; font-size: 13px; }' +
            '.a4-print-bar button { border: none; border-radius: 20px; padding: 7px 14px; font-weight: bold; cursor: pointer; font-size: 12px; margin-left: 6px; }' +
            '@page { size: A4 portrait; margin: 0; }' +
            '@media print { body { background: #ffffff !important; } .a4-print-bar { display: none !important; } .a4-physical-sheet { width: 210mm !important; min-height: 297mm !important; margin: 0 !important; box-shadow: none !important; } }';

        if (format === 'word') {
            let wordSheets = data.lembarA4.map(function(sheet, i) {
                let brk = (i < data.lembarA4.length - 1)
                    ? '<br clear="all" style="page-break-before:always; mso-break-type:section-break">'
                    : '';
                return '<div class="SectionA4">' + sheet.html + '</div>' + brk;
            }).join('');

            let wordHtml =
                '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
                '<head><meta charset="utf-8"><title>' + judulHal + '</title>' +
                '<style>' +
                    '@page SectionA4 { size: 210mm 297mm; margin: 20mm 20mm 20mm 20mm; }' +
                    'div.SectionA4 { page: SectionA4; font-family: "Times New Roman", serif; font-size: 11pt; line-height: 1.5; }' +
                    'table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #333; padding: 5pt; }' +
                    'img { max-width: 100%; height: auto; }' +
                '</style></head><body lang="ID">' + wordSheets + '</body></html>';

            let blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'MATERI_A4_' + judulHal.toUpperCase().replace(/[^A-Z0-9]+/g, '_') + '.doc';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function() { URL.revokeObjectURL(url); }, 3000);
            return;
        }

        let win = window.open('', '_blank', 'width=920,height=780');
        if (!win) return alert('Pop-up diblokir browser. Izinkan pop-up untuk mencetak lembar A4.');

        let infoSkip = data.mediaCatatan.length > 0
            ? (' (' + data.mediaCatatan.length + ' blok media/kuis dilewati otomatis)')
            : '';

        let htmlDoc =
            '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Print A4 - ' + judulHal + '</title>' +
            '<style>' + cssCetak + '</style></head><body>' +
            '<div class="a4-print-bar">' +
                '<div><b>🖨️ Lembar Materi A4 (Margin 2 cm)</b> — ' + data.lembarA4.length + ' Lembar' + infoSkip + '</div>' +
                '<div>' +
                    '<button type="button" style="background:#f1c40f; color:#0b3954;" onclick="window.print()">🖨️ Cetak / Save PDF</button>' +
                    '<button type="button" style="background:#38bdf8; color:#0b3954;" onclick="window.opener && window.opener.a4PrintAtauExportMateri(\'word\')">📄 Export Word</button>' +
                    '<button type="button" style="background:#e74c3c; color:#ffffff;" onclick="window.close()">✕ Tutup</button>' +
                '</div>' +
            '</div>' +
            sheetsHtml +
            '</body></html>';

        win.document.open();
        win.document.write(htmlDoc);
        win.document.close();

        let imgs = Array.from(win.document.querySelectorAll('img'));
        let done = false;
        function triggerPrint() {
            if (done) return;
            done = true;
            win.focus();
            setTimeout(function() { win.print(); }, 350);
        }
        if (imgs.length === 0) {
            triggerPrint();
        } else {
            let loaded = 0;
            imgs.forEach(function(img) {
                if (img.complete) loaded++;
                else img.onload = img.onerror = function() {
                    loaded++;
                    if (loaded >= imgs.length) triggerPrint();
                };
            });
            if (loaded >= imgs.length) triggerPrint();
            else setTimeout(triggerPrint, 2000);
        }
    };

    // =========================================================================
    // 6. CSS OVERRIDE A4 FIX + LEBAR SERAGAM KUIS/MEDIA/MODUL + FAST SCROLL FIX
    // =========================================================================
    window.a4PasangCSS = function() {
        let old = document.getElementById('a4-layout-engine-css');
        if (old) old.remove();
        let st = document.createElement('style');
        st.id = 'a4-layout-engine-css';
        st.textContent =
            ':root { --a4-screen-scale: 1; --a4-visual-width: 80vw; }' +

            /* Pastikan tombol kanan bawah (Dark Mode, Zoom +/-, Fullscreen, Scroll) selalu di atas & bisa diklik */
            '.fast-scroll-btns { z-index: 9550 !important; pointer-events: auto !important; zoom: 1 !important; transform: translateZ(0); }' +
            '.fast-scroll-btns button { pointer-events: auto !important; cursor: pointer !important; }' +
            'body.drawing-mode-active .fast-scroll-btns, body.strict-mode-active .fast-scroll-btns, body.modal-open-lock .fast-scroll-btns { display: none !important; }' +

            /* Wadah utama ruang kerja materi (kecuali Home) */
            'body.a4-workspace-active #main-editor-wrapper { background-color: #dbe4ee !important; padding-top: 18px !important; padding-bottom: 70px !important; }' +
            'body.a4-workspace-active #blocks-container { width: 100% !important; max-width: 100% !important; gap: 22px !important; align-items: center !important; }' +
            'body.a4-workspace-active #blocks-container > .block-wrapper { width: 100% !important; display: flex !important; justify-content: center !important; }' +

            /* JENIS 1: LEMBAR KERTAS A4 FIX (794x1123px diskalakan tepat ke 80% layar) */
            'body.a4-workspace-active .block-wrapper.sheet-is-a4:not(.pdf-focus-fullscreen) > .a4-paper-wrapper,' +
            'body.a4-workspace-active .block-wrapper.sheet-is-a4:not(.pdf-focus-fullscreen) > .dynamic-block-shell {' +
                'width: 794px !important; max-width: 794px !important; min-width: 794px !important;' +
                'zoom: var(--a4-screen-scale, 1);' +
                'margin: 0 auto !important; position: relative !important;' +
            '}' +
            'body.a4-workspace-active .block-wrapper.sheet-is-a4 > .a4-paper-wrapper > .block-collapsible-area > .content-block,' +
            'body.a4-workspace-active .block-wrapper.sheet-is-a4 > .dynamic-block-shell > .block-collapsible-area > .content-block {' +
                'width: 794px !important; max-width: 794px !important;' +
                'min-height: 1123px !important;' +
                'padding: 75.6px 75.6px 75.6px 75.6px !important;' +
                'background-color: #ffffff;' +
                'border: 1px solid #94a3b8 !important;' +
                'border-radius: 3px !important;' +
                'box-shadow: 0 8px 24px rgba(15, 23, 42, 0.14) !important;' +
                'box-sizing: border-box !important;' +
            '}' +

            /* Siku panduan margin 2cm (75.6px) saat Admin di Mode Edit */
            'body.a4-workspace-active.mode-edit-aktif .block-wrapper.sheet-is-a4 > .a4-paper-wrapper > .block-collapsible-area > .content-block:not(.bg-pattern-lines):not(.bg-pattern-grid):not(.bg-pattern-dots),' +
            'body.a4-workspace-active.force-edit-mode .block-wrapper.sheet-is-a4 > .a4-paper-wrapper > .block-collapsible-area > .content-block:not(.bg-pattern-lines):not(.bg-pattern-grid):not(.bg-pattern-dots) {' +
                'background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'794\' height=\'1123\' viewBox=\'0 0 794 1123\'%3E%3Cpath d=\'M 52 75.6 L 75.6 75.6 L 75.6 52\' fill=\'none\' stroke=\'%23cbd5e1\' stroke-width=\'1.3\'/%3E%3Cpath d=\'M 742 75.6 L 718.4 75.6 L 718.4 52\' fill=\'none\' stroke=\'%23cbd5e1\' stroke-width=\'1.3\'/%3E%3Cpath d=\'M 52 1047.4 L 75.6 1047.4 L 75.6 1071\' fill=\'none\' stroke=\'%23cbd5e1\' stroke-width=\'1.3\'/%3E%3Cpath d=\'M 742 1047.4 L 718.4 1047.4 L 718.4 1071\' fill=\'none\' stroke=\'%23cbd5e1\' stroke-width=\'1.3\'/%3E%3C/svg%3E") !important;' +
                'background-repeat: no-repeat !important; background-position: top center !important;' +
            '}' +

            /* JENIS 2: BLOK KUIS, MODUL INTERAKTIF, VIDEO, & PDF — LEBAR IDENTIK DENGAN LEMBAR A4 TANPA ZOOM */
            'body.a4-workspace-active .block-wrapper.sheet-is-media:not(.pdf-focus-fullscreen) > .a4-paper-wrapper,' +
            'body.a4-workspace-active .block-wrapper.sheet-is-media:not(.pdf-focus-fullscreen) > .dynamic-block-shell,' +
            'body.a4-workspace-active .block-wrapper:not(.pdf-focus-fullscreen) > .pdf-landscape-block {' +
                'width: var(--a4-visual-width, 80vw) !important; max-width: var(--a4-visual-width, 80vw) !important; min-width: 0 !important;' +
                'zoom: 1 !important;' +
                'margin: 0 auto !important; position: relative !important; box-sizing: border-box !important;' +
            '}' +
            'body.a4-workspace-active .block-wrapper.sheet-is-media > .a4-paper-wrapper > .block-collapsible-area > .content-block,' +
            'body.a4-workspace-active .block-wrapper.sheet-is-media > .dynamic-block-shell > .block-collapsible-area > .content-block {' +
                'width: 100% !important; max-width: 100% !important;' +
                'min-height: 100px !important; height: auto !important;' +
                'padding: 20px 26px !important;' +
                'background-color: #ffffff;' +
                'border-radius: 0 0 10px 10px !important;' +
                'box-sizing: border-box !important;' +
            '}' +
            'body.a4-workspace-active .block-wrapper.sheet-is-media.has-embedded-widget > .a4-paper-wrapper > .block-collapsible-area > .content-block,' +
            'body.a4-workspace-active .block-wrapper.sheet-is-media.has-embedded-widget > .dynamic-block-shell > .block-collapsible-area > .content-block {' +
                'padding: 0 !important; background-color: transparent !important; border: none !important; box-shadow: none !important;' +
            '}' +
            'body.a4-workspace-active .block-wrapper.sheet-is-media .quiz-container {' +
                'width: 100% !important; max-width: 100% !important; box-sizing: border-box !important;' +
            '}' +
            'body.a4-workspace-active .block-wrapper.sheet-is-media .quiz-question-text {' +
                'padding-right: 44px;' +
            '}' +

            /* Posisi tombol kontrol blok rapi (tidak pernah menabrak tombol Ekstrak Kuis) */
            'body.a4-workspace-active .block-wrapper.has-a4-strip > .a4-paper-wrapper > .block-controls,' +
            'body.a4-workspace-active .block-wrapper.has-a4-strip > .dynamic-block-shell > .block-controls {' +
                'top: 34px !important; right: 10px !important; left: auto !important; flex-direction: row !important;' +
            '}' +
            'body.a4-workspace-active .block-wrapper:not(.has-a4-strip) > .a4-paper-wrapper > .block-controls,' +
            'body.a4-workspace-active .block-wrapper:not(.has-a4-strip) > .dynamic-block-shell > .block-controls {' +
                'top: 10px !important; right: 12px !important; left: auto !important; flex-direction: row !important;' +
            '}' +
            'body.a4-workspace-active .a4-paper-wrapper > .block-controls button,' +
            'body.a4-workspace-active .dynamic-block-shell > .block-controls button {' +
                'width: auto !important; border-bottom: none !important; border-right: 1px solid #e2e8f0 !important;' +
            '}' +
            'body.a4-workspace-active .btn-add-block-below {' +
                'left: 50% !important; right: auto !important; bottom: -16px !important; transform: translateX(-50%) !important;' +
            '}' +

            /* Strip status tipis di atas lembar A4 (khusus Admin Mode Edit) */
            '.a4-sheet-admin-strip { display: none; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; padding: 5px 10px; background: #1e293b; color: #f8fafc; font-family: Poppins, sans-serif; font-size: 10.5px; border-radius: 6px 6px 0 0; }' +
            'body.a4-workspace-active.mode-edit-aktif .a4-sheet-admin-strip,' +
            'body.a4-workspace-active.force-edit-mode .a4-sheet-admin-strip { display: flex; }' +
            'body.drawing-mode-active .a4-sheet-admin-strip, body.drawing-mode-active .a4-overflow-cutline { display: none !important; }' +
            '.a4-strip-left, .a4-strip-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }' +
            '.a4-badge-type { font-weight: 800; padding: 2px 8px; border-radius: 10px; }' +
            '.a4-badge-type.is-a4 { background: #0284c7; color: #ffffff; }' +
            '.a4-badge-type.is-media { background: #7e22ce; color: #ffffff; }' +
            '.a4-badge-ok { background: #15803d; color: #dcfce7; padding: 2px 7px; border-radius: 10px; font-weight: 700; }' +
            '.a4-badge-warn { background: #b91c1c; color: #fee2e2; padding: 2px 7px; border-radius: 10px; font-weight: 800; }' +
            '.a4-strip-btn { background: rgba(255,255,255,0.14); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; padding: 2px 9px; font-family: Poppins, sans-serif; font-size: 10px; font-weight: 700; cursor: pointer; }' +
            '.a4-strip-btn:hover { background: #f1c40f; color: #0b3954; border-color: #f1c40f; }' +
            '.a4-strip-btn.is-split { background: #ea580c; border-color: #fde047; color: #ffffff; }' +

            /* Garis potong merah batas bawah 1 halaman A4 (297mm) */
            '.a4-overflow-cutline { display: none; position: absolute; left: 0; right: 0; border-top: 2.5px dashed #dc2626; z-index: 80; pointer-events: none; text-align: center; }' +
            'body.a4-workspace-active.mode-edit-aktif .a4-overflow-cutline,' +
            'body.a4-workspace-active.force-edit-mode .a4-overflow-cutline { display: block; }' +
            '.a4-overflow-cutline span { display: inline-block; transform: translateY(-50%); background: #dc2626; color: #ffffff; font-family: Poppins, sans-serif; font-size: 9.5px; font-weight: 800; padding: 2px 10px; border-radius: 12px; }' +

            /* Dark Mode lengkap untuk ruang kerja A4 */
            'body.dark-mode-active.a4-workspace-active #main-editor-wrapper { background-color: #0f172a !important; }' +
            'body.dark-mode-active.a4-workspace-active .block-wrapper.sheet-is-a4 > .a4-paper-wrapper > .block-collapsible-area > .content-block,' +
            'body.dark-mode-active.a4-workspace-active .block-wrapper.sheet-is-media:not(.has-embedded-widget) > .a4-paper-wrapper > .block-collapsible-area > .content-block {' +
                'background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #334155 !important;' +
            '}' +

            /* HP (<=768px): tetap responsif penuh 100% */
            '@media (max-width: 768px) {' +
                'body.a4-workspace-active .block-wrapper:not(.pdf-focus-fullscreen) > .a4-paper-wrapper,' +
                'body.a4-workspace-active .block-wrapper:not(.pdf-focus-fullscreen) > .dynamic-block-shell,' +
                'body.a4-workspace-active .block-wrapper:not(.pdf-focus-fullscreen) > .pdf-landscape-block,' +
                'body.a4-workspace-active .block-wrapper.sheet-is-a4 > .a4-paper-wrapper > .block-collapsible-area > .content-block,' +
                'body.a4-workspace-active .block-wrapper.sheet-is-media > .a4-paper-wrapper > .block-collapsible-area > .content-block {' +
                    'width: 100% !important; max-width: 100% !important; min-width: 0 !important; zoom: 1 !important;' +
                '}' +
                'body.a4-workspace-active .block-wrapper.sheet-is-a4 > .a4-paper-wrapper > .block-collapsible-area > .content-block { min-height: 220px !important; padding: 16px 14px !important; }' +
            '}';
        document.head.appendChild(st);
    };

    window.a4PasangTombolPrintAdmin = function() {
        let bar = document.getElementById('admin-menu-bar');
        if (!bar || document.getElementById('btn-admin-print-a4')) return;
        let span = document.createElement('span');
        span.id = 'btn-admin-print-a4';
        span.innerHTML = '🖨️ Print A4';
        span.title = 'Cetak Lembar Materi A4 (Margin 2 cm) ke PDF atau Word';
        span.onclick = function() { window.a4PrintAtauExportMateri('pdf'); };
        let btnMA = document.getElementById('btn-admin-modul-ajar');
        if (btnMA) bar.insertBefore(span, btnMA);
        else bar.appendChild(span);
    };

    // Pengaman tombol kanan bawah (Dark Mode & Zoom +/- tetap berfungsi penuh di semua halaman)
    window.a4PastikanTombolKananBawahAktif = function() {
        if (typeof window.toggleDarkModeGlobal !== 'function') {
            window.toggleDarkModeGlobal = function() {
                let isDark = document.body.classList.toggle('dark-mode-active');
                try { localStorage.setItem('pref_dark_mode_mahardika', isDark ? '1' : '0'); } catch (e) {}
                let btn = document.getElementById('btn-darkmode-global');
                if (btn) btn.innerText = isDark ? '☀️' : '🌙';
            };
        }

        if (typeof window.ubahZoomTeksGlobal !== 'function') {
            window.ubahZoomTeksGlobal = function(stepDir) {
                let cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--user-page-zoom')) || 1;
                let next = Math.round((cur + (stepDir > 0 ? 0.1 : -0.1)) * 100) / 100;
                if (next < 0.6) next = 0.6;
                if (next > 1.5) next = 1.5;
                document.documentElement.style.setProperty('--user-page-zoom', String(next));
                try { localStorage.setItem('pref_page_zoom_mahardika', String(next)); } catch (e) {}
                if (typeof window.ckSamakanLebarDenganContentBlock === 'function') {
                    setTimeout(window.ckSamakanLebarDenganContentBlock, 60);
                }
            };
        }
    };

    // =========================================================================
    // 7. INISIALISASI OBSERVER RINGAN (TIDAK MENGGANGGU EKSTRAK / MEDIA / MODUL)
    // =========================================================================
    document.addEventListener('DOMContentLoaded', function() {
        window.a4PasangCSS();
        window.a4PastikanTombolKananBawahAktif();
        window.a4PasangTombolPrintAdmin();
        setTimeout(window.a4PasangTombolPrintAdmin, 900);
        window.a4JadwalkanRefresh(180);

        window.addEventListener('resize', function() {
            window.a4HitungSkalaLayar();
        });

        // Hanya pantau penambahan/pergantian blok (childList), bukan setiap klik/atribut internal
        let container = document.getElementById('blocks-container');
        if (container) {
            let obs = new MutationObserver(function() {
                if (!_a4Updating) window.a4JadwalkanRefresh(150);
            });
            obs.observe(container, { childList: true });

            container.addEventListener('input', function(e) {
                if (e.target && e.target.closest && e.target.closest('.sheet-is-a4')) {
                    window.a4JadwalkanRefresh(260);
                }
            });
        }

        let threeCol = document.querySelector('.home-three-col-layout');
        if (threeCol) {
            new MutationObserver(function() {
                window.a4JadwalkanRefresh(100);
            }).observe(threeCol, { attributes: true, attributeFilter: ['class'] });
        }

        new MutationObserver(function() {
            window.a4JadwalkanRefresh(120);
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    });
})();