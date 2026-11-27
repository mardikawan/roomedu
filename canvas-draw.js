/* =========================================================================
   MODUL GOODNOTES ULTRA-HD RETINA DRAW (IPAD PALM REJECT, BEZIER SMOOTHING,
   SMART SHAPE, LASO PRO, LASER POINTER, GAMBAR BEBAS, & SLIDE PDF HD)
   ========================================================================= */

window.DRAW_DPR = Math.max(2.5, Math.min((window.devicePixelRatio || 2) * 1.5, 3.5));

// Pengonversi koordinat presisi (kebal terhadap CSS zoom A4, zoom +/-, & pinch zoom iPad)
window.ambilKoordinatKanvas = function(cvs, clientX, clientY) {
    let r = cvs.getBoundingClientRect();
    let dpr = parseFloat(cvs.getAttribute('data-dpr')) || window.DRAW_DPR || 2.5;
    let cssW = parseFloat(cvs.getAttribute('data-css-w')) || (cvs.width / dpr) || r.width || 1;
    let cssH = parseFloat(cvs.getAttribute('data-css-h')) || (cvs.height / dpr) || r.height || 1;
    let scaleX = r.width > 0 ? (cssW / r.width) : 1;
    let scaleY = r.height > 0 ? (cssH / r.height) : 1;
    return {
        x: (clientX - r.left) * scaleX,
        y: (clientY - r.top) * scaleY,
        scaleX: scaleX,
        scaleY: scaleY
    };
};
window.isDrawingMode = false;
let currentDrawCtx = null, isPenDown = false, activeTool = 'pen';
window.penSize = 3.6;
window.penColor = '#e74c3c';
window.pencilOnly = true;
window.drawUndoStack = [];
window.drawRedoStack = [];
window.shapeHoldTimer = null;
window.isShapeRecognized = false;

let laserStrokes = [], currentLaserStroke = null;
let globalLaserCvs = document.getElementById('laser-canvas');
let globalLaserCtx = globalLaserCvs ? globalLaserCvs.getContext('2d') : null;
let laserLastActiveTime = 0;

let lassoPath = [], isFloating = false, lassoTargetCanvas = null, lassoSavedImageData = null, floatUI = null;
window.lassoClipboardDataUrl = null;

// =========================================================================
// 1. MESIN SLIDE PDF HD (KONVERSI, NAVIGASI, SWIPE, FOKUS, & EXPORT A4)
// =========================================================================
window.prosesUploadPDFMateri = async function(input) {
    let file = input.files && input.files[0];
    if (!file) return;
    if (!window.pdfjsLib) return alert("Mesin PDF.js sedang dimuat, silakan tunggu 2 detik lalu coba lagi.");

    let cloudName = "rtkfvwvg";
    let uploadPreset = "studykawan_video";

    let st = document.getElementById('save-status-bar');
    if (st) st.innerHTML = "<span style='color:#f39c12; font-weight:bold;'>⏳ Mengonversi PDF ke Slide HD...</span>";

    try {
        let arrayBuffer = await file.arrayBuffer();
        let pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let numPages = pdfDoc.numPages;
        let slidesArr = [];

        // Resolusi HD 1.5x A4 Landscape (1684 x 1191 px) agar teks & diagram sangat tajam
        let targetW = 1684, targetH = 1191;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            if (st) st.innerHTML = "<span style='color:#f39c12; font-weight:bold;'>⏳ Memproses & Mengunggah Slide HD " + pageNum + " / " + numPages + "...</span>";
            let page = await pdfDoc.getPage(pageNum);
            let unscaledViewport = page.getViewport({ scale: 1 });

            let scale = Math.min(targetW / unscaledViewport.width, targetH / unscaledViewport.height);
            let viewport = page.getViewport({ scale: scale });

            let offCanvas = document.createElement('canvas');
            offCanvas.width = targetW;
            offCanvas.height = targetH;
            let offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
            offCtx.imageSmoothingEnabled = true;
            offCtx.imageSmoothingQuality = 'high';

            offCtx.fillStyle = '#ffffff';
            offCtx.fillRect(0, 0, targetW, targetH);
            let offsetX = (targetW - viewport.width) / 2;
            let offsetY = (targetH - viewport.height) / 2;

            offCtx.save();
            offCtx.translate(offsetX, offsetY);
            await page.render({ canvasContext: offCtx, viewport: viewport }).promise;
            offCtx.restore();

            let base64Image = offCanvas.toDataURL('image/jpeg', 0.88);

            let formData = new FormData();
            formData.append("file", base64Image);
            formData.append("upload_preset", uploadPreset);

            let response = await fetch("https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload", {
                method: "POST", body: formData
            });
            let data = await response.json();

            if (data.secure_url) {
                slidesArr.push({ bg: data.secure_url, drawing: "", floatImages: [] });
            } else {
                throw new Error(data.error ? data.error.message : "Gagal mengunggah slide ke Cloudinary");
            }

            offCanvas.width = 0;
            offCanvas.height = 0;
            offCtx = null;
            base64Image = null;
        }

        let pdfBlockObj = {
            type: 'pdf_slides', title: file.name.replace(/\.pdf$/i, ''), activeSlide: 0, slides: slidesArr,
            bg: '#ffffff', pattern: '', color: '#333333', width: 'L', padTop: '25px', padBot: '25px', drawing: '', floatImages: []
        };

        window.contentBlocksData.push(pdfBlockObj);
        window.renderBlocks();

        if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
        if (st) st.innerHTML = "<span style='color:#2ecc71; font-weight:bold;'>✓ PDF HD Berhasil Disimpan Permanen!</span>";
    } catch (err) {
        console.error("Gagal memproses PDF:", err);
        alert("Gagal memproses PDF: " + err.message);
    }
    input.value = "";
};

window.gantiSlidePDF = function(blockIdx, arah) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok || blok.type !== 'pdf_slides' || !Array.isArray(blok.slides)) return;

    let curCvs = document.querySelector('.drawing-layer[data-index="' + blockIdx + '"][data-slide-index="' + blok.activeSlide + '"]');
    if (curCvs && blok.slides[blok.activeSlide]) {
        blok.slides[blok.activeSlide].drawing = curCvs.toDataURL('image/png');
    }

    let nextIdx = (blok.activeSlide || 0) + arah;
    if (nextIdx < 0 || nextIdx >= blok.slides.length) return;

    blok.activeSlide = nextIdx;
    window.renderBlocks();
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
};

window.lompatKeSlidePDF = function(blockIdx, nilaiInput) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok || blok.type !== 'pdf_slides' || !Array.isArray(blok.slides)) return;

    let targetIdx = parseInt(nilaiInput) - 1;
    if (isNaN(targetIdx) || targetIdx < 0) targetIdx = 0;
    else if (targetIdx >= blok.slides.length) targetIdx = blok.slides.length - 1;

    if (targetIdx === blok.activeSlide) return;

    let curCvs = document.querySelector('.drawing-layer[data-index="' + blockIdx + '"][data-slide-index="' + blok.activeSlide + '"]');
    if (curCvs && blok.slides[blok.activeSlide]) {
        blok.slides[blok.activeSlide].drawing = curCvs.toDataURL('image/png');
    }

    blok.activeSlide = targetIdx;
    window.renderBlocks();
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
};

window.pdfSwipeStartX = null;
window.mulaiSwipeSlidePDF = function(e, blockIdx) {
    if (window.isDrawingMode) return;
    window.pdfSwipeStartX = e.clientX;
};

window.akhirSwipeSlidePDF = function(e, blockIdx) {
    if (window.isDrawingMode) return;
    if (window.pdfSwipeStartX === null) return;
    let dx = e.clientX - window.pdfSwipeStartX;
    window.pdfSwipeStartX = null;
    if (Math.abs(dx) > 75) {
        window.gantiSlidePDF(blockIdx, dx < 0 ? 1 : -1);
    }
};

window.toggleFokusSlidePDF = function(blockIdx) {
    if (window.focusedPdfBlockIndex === blockIdx) {
        window.focusedPdfBlockIndex = -1;
    } else {
        window.focusedPdfBlockIndex = blockIdx;
    }
    window.renderBlocks();
};

window.exportSlidePDFKeA4 = async function(blockIdx) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok || !Array.isArray(blok.slides) || blok.slides.length === 0) return;

    let curCvs = document.querySelector('.drawing-layer[data-index="' + blockIdx + '"][data-slide-index="' + blok.activeSlide + '"]');
    if (curCvs && blok.slides[blok.activeSlide]) {
        blok.slides[blok.activeSlide].drawing = curCvs.toDataURL('image/png');
    }

    let st = document.getElementById('save-status-bar');
    if (st) st.innerHTML = "<span style='color:#f39c12;'>⏳ Menyiapkan Export PDF HD...</span>";

    function loadImgAsync(src) {
        return new Promise(function(resolve) {
            if (!src) return resolve(null);
            let img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function() { resolve(img); };
            img.onerror = function() { resolve(null); };
            img.src = src;
        });
    }

    let expW = 1684, expH = 1191;
    let compositePages = [];
    for (let i = 0; i < blok.slides.length; i++) {
        let s = blok.slides[i];
        let c = document.createElement('canvas');
        c.width = expW;
        c.height = expH;
        let ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, expW, expH);

        let bgImg = await loadImgAsync(s.bg);
        if (bgImg) ctx.drawImage(bgImg, 0, 0, expW, expH);

        let fImgs = s.floatImages || [];
        for (let j = 0; j < fImgs.length; j++) {
            let fi = fImgs[j];
            let im = await loadImgAsync(fi.src);
            if (im) {
                let px = (parseFloat(fi.xPct) || 10) / 100 * expW;
                let py = (parseFloat(fi.yPct) || 10) / 100 * expH;
                let pw = (parseFloat(fi.wPct) || 25) / 100 * expW;
                let ph = (parseFloat(fi.hPct) || 25) / 100 * expH;
                ctx.drawImage(im, px, py, pw, ph);
            }
        }

        let drawImg = await loadImgAsync(s.drawing);
        if (drawImg) ctx.drawImage(drawImg, 0, 0, expW, expH);

        compositePages.push(c.toDataURL('image/jpeg', 0.92));
    }

    let win = window.open('', '_blank');
    let html = '<html><head><title>' + (blok.title || 'Slide PDF') + '</title><style>' +
        '@page { size: A4 landscape; margin: 0; }' +
        'body { margin: 0; padding: 0; background: #fff; }' +
        '.page-slide { width: 297mm; height: 210mm; page-break-after: always; display: flex; align-items: center; justify-content: center; overflow: hidden; }' +
        '.page-slide:last-child { page-break-after: auto; }' +
        '.page-slide img { width: 100%; height: 100%; object-fit: contain; }' +
        '</style></head><body>';
    compositePages.forEach(function(src) {
        html += '<div class="page-slide"><img src="' + src + '"></div>';
    });
    html += '</body></html>';
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(function() {
        win.print();
        if (st) st.innerHTML = "Cloud Sync: Ready";
    }, 600);
};

// =========================================================================
// 2. INISIALISASI KANVAS RETINA HIGH-DPI & KURVA BEZIER HALUS (ANTI-PECAH)
// =========================================================================
window.siapkanKonteksRetina = function(cvs) {
    let dpr = parseFloat(cvs.getAttribute('data-dpr')) || window.DRAW_DPR || 2;
    let ctx = cvs.getContext('2d', { willReadFrequently: true });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    return ctx;
};

// Fungsi Penghalus Kurva Bezier Kuadratik (Membuat Goresan Pena Setajam Vektor GoodNotes)
window.gambarKurvaHalus = function(ctx, pts) {
    if (!pts || pts.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 1) {
        ctx.lineTo(pts[0].x + 0.1, pts[0].y + 0.1);
    } else if (pts.length === 2) {
        ctx.lineTo(pts[1].x, pts[1].y);
    } else {
        for (let i = 1; i < pts.length - 1; i++) {
            let midX = (pts[i].x + pts[i + 1].x) / 2;
            let midY = (pts[i].y + pts[i + 1].y) / 2;
            ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
        }
        let last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
    }
    ctx.stroke();
};

window.ambilDataDrawingTarget = function(cvs) {
    let fbIdx = cvs.getAttribute('data-fb-index');
    let blockIdx = cvs.getAttribute('data-index');
    let slideIdx = cvs.getAttribute('data-slide-index');
    let qIdx = cvs.getAttribute('data-q-index');

    if (fbIdx !== null && window.floatingBoxesData[fbIdx]) {
        return window.floatingBoxesData[fbIdx].drawing || "";
    }
    if (blockIdx !== null && window.contentBlocksData[blockIdx]) {
        let blok = window.contentBlocksData[blockIdx];
        if (blok.type === 'pdf_slides' && slideIdx !== null && blok.slides && blok.slides[slideIdx]) {
            return blok.slides[slideIdx].drawing || "";
        }
        if (blok.type === 'quiz' && qIdx !== null && blok.questions && blok.questions[qIdx]) {
            return blok.questions[qIdx].drawing || "";
        }
        return blok.drawing || "";
    }
    return "";
};

window.simpanDataDrawingTarget = function(cvs, dataUrl) {
    let fbIdx = cvs.getAttribute('data-fb-index');
    let blockIdx = cvs.getAttribute('data-index');
    let slideIdx = cvs.getAttribute('data-slide-index');
    let qIdx = cvs.getAttribute('data-q-index');

    if (fbIdx !== null && window.floatingBoxesData[fbIdx]) {
        window.floatingBoxesData[fbIdx].drawing = dataUrl;
    } else if (blockIdx !== null && window.contentBlocksData[blockIdx]) {
        let blok = window.contentBlocksData[blockIdx];
        if (blok.type === 'pdf_slides' && slideIdx !== null && blok.slides && blok.slides[slideIdx]) {
            blok.slides[slideIdx].drawing = dataUrl;
        } else if (blok.type === 'quiz' && qIdx !== null && blok.questions && blok.questions[qIdx]) {
            blok.questions[qIdx].drawing = dataUrl;
        } else {
            blok.drawing = dataUrl;
        }
    }
};

function inisialisasiSemuaCanvas() {
    document.querySelectorAll('.drawing-layer').forEach(function(cvs) {
        inisialisasiSatuCanvas(cvs);
    });
}
window.inisialisasiSemuaCanvas = inisialisasiSemuaCanvas;

function inisialisasiSatuCanvas(cvs) {
    let p = cvs.parentElement;
    if (!p) return;
    let cw = p.clientWidth || p.offsetWidth;
    let ch = p.clientHeight || p.offsetHeight;
    if (cw === 0 || ch === 0) return;

    let dpr = window.DRAW_DPR || 2.5;
    // Batas aman tekstur GPU browser/iPad (maks 4096px) agar tidak blank pada blok sangat panjang
    let maxSide = Math.max(cw, ch);
    if (maxSide * dpr > 4096) {
        dpr = Math.max(1.5, 4096 / maxSide);
    }
    let targetW = Math.round(cw * dpr);
    let targetH = Math.round(ch * dpr);
    let sv = window.ambilDataDrawingTarget(cvs);

    if (cvs.width !== targetW || cvs.height !== targetH || (!cvs.getAttribute('data-loaded') && sv)) {
        cvs.width = targetW;
        cvs.height = targetH;
        cvs.setAttribute('data-css-w', cw);
        cvs.setAttribute('data-css-h', ch);
        cvs.setAttribute('data-dpr', dpr);

        let ctx = window.siapkanKonteksRetina(cvs);
        ctx.clearRect(0, 0, cw, ch);

        if (sv) {
            let i = new Image();
            i.onload = function() {
                let c2 = window.siapkanKonteksRetina(cvs);
                c2.globalCompositeOperation = 'source-over';
                c2.drawImage(i, 0, 0, cw, ch);
                cvs.setAttribute('data-loaded', 'true');
            };
            i.src = sv;
        } else {
            cvs.setAttribute('data-loaded', 'true');
        }
    }
}

window.undoDraw = function() {
    if (window.drawUndoStack.length === 0) return;
    let action = window.drawUndoStack.pop();
    let currentData = action.cvs.toDataURL("image/png");
    window.drawRedoStack.push({ cvs: action.cvs, data: currentData });

    let dpr = parseFloat(action.cvs.getAttribute('data-dpr')) || window.DRAW_DPR || 2;
    let cw = action.cvs.width / dpr;
    let ch = action.cvs.height / dpr;
    let ctx = window.siapkanKonteksRetina(action.cvs);
    ctx.clearRect(0, 0, cw, ch);

    if (action.data) {
        let img = new Image();
        img.onload = function() {
            let c2 = window.siapkanKonteksRetina(action.cvs);
            c2.globalCompositeOperation = 'source-over';
            c2.globalAlpha = 1.0;
            c2.drawImage(img, 0, 0, cw, ch);
            window.simpanDataDrawingTarget(action.cvs, action.data);
            if (window.simpanKeDB) window.simpanKeDB();
        };
        img.src = action.data;
    } else {
        window.simpanDataDrawingTarget(action.cvs, "");
        if (window.simpanKeDB) window.simpanKeDB();
    }
};

window.redoDraw = function() {
    if (window.drawRedoStack.length === 0) return;
    let action = window.drawRedoStack.pop();
    let currentData = action.cvs.toDataURL("image/png");
    window.drawUndoStack.push({ cvs: action.cvs, data: currentData });

    let dpr = parseFloat(action.cvs.getAttribute('data-dpr')) || window.DRAW_DPR || 2;
    let cw = action.cvs.width / dpr;
    let ch = action.cvs.height / dpr;
    let ctx = window.siapkanKonteksRetina(action.cvs);
    ctx.clearRect(0, 0, cw, ch);

    if (action.data) {
        let img = new Image();
        img.onload = function() {
            let c2 = window.siapkanKonteksRetina(action.cvs);
            c2.globalCompositeOperation = 'source-over';
            c2.globalAlpha = 1.0;
            c2.drawImage(img, 0, 0, cw, ch);
            window.simpanDataDrawingTarget(action.cvs, action.data);
            if (window.simpanKeDB) window.simpanKeDB();
        };
        img.src = action.data;
    } else {
        window.simpanDataDrawingTarget(action.cvs, "");
        if (window.simpanKeDB) window.simpanKeDB();
    }
};

// =========================================================================
// 3. KONTROL TOOLBAR DRAW, LASER POINTER HD, & SENTUHAN IPAD PALM REJECT
// =========================================================================
window.toggleDrawingMode = function() {
    window.isDrawingMode = !window.isDrawingMode;
    if (window.isDrawingMode) {
        document.body.classList.add('drawing-mode-active');
        if (window.pencilOnly) document.body.classList.add('palm-reject-on');
        document.querySelectorAll('.content-block, .fb-content').forEach(function(el) { el.removeAttribute('contenteditable'); });
        inisialisasiSemuaCanvas();
        resizeLaserCanvas();
        if (window.updateToolbarPosition) window.updateToolbarPosition();
    } else {
        document.body.classList.remove('drawing-mode-active', 'palm-reject-on');
        window.tutupMenuKonteksDraw();
        if (document.body.classList.contains('mode-edit-aktif')) {
            document.querySelectorAll('.content-block.a4-portrait-block, .fb-content').forEach(function(el) { el.setAttribute('contenteditable', 'true'); });
        }
        stampLasso();
        if (window.simpanKeDB) window.simpanKeDB();
        let pt = document.getElementById('pen-tools');
        if (pt) pt.style.transform = 'none';
    }
};

window.isUpdatingToolbar = false;
window.updateToolbarPosition = function() {
    if (!window.isDrawingMode || !window.visualViewport) return;
    if (window.isUpdatingToolbar) return;

    window.isUpdatingToolbar = true;
    window.requestAnimationFrame(function() {
        const tools = document.getElementById('pen-tools');
        const vv = window.visualViewport;
        if (tools) {
            tools.style.transform = 'translate(' + vv.offsetLeft + 'px, ' + vv.offsetTop + 'px) scale(' + (1 / vv.scale) + ')';
        }
        window.isUpdatingToolbar = false;
    });
};

if (window.visualViewport) {
    window.visualViewport.addEventListener('scroll', window.updateToolbarPosition, { passive: true });
    window.visualViewport.addEventListener('resize', window.updateToolbarPosition, { passive: true });
}

window.DRAW_PRESET_COLORS = [
    '#111111', '#e74c3c', '#f97316', '#f1c40f',
    '#39ff14', '#16a34a', '#0284c7', '#192a56', '#8e44ad'
];
window.DRAW_SIZE_OPTIONS = [
    { label: 'XS', val: 1 },
    { label: 'S',  val: 1.8 },
    { label: 'M',  val: 3.6 },
    { label: 'L',  val: 7.2 },
    { label: 'XL', val: 10.8 }
];
window.DRAW_CUSTOM_COLORS_KEY = 'mahardika_draw_custom_colors_v1';
window.DRAW_LAST_LASSO_KEY = 'mahardika_draw_last_lasso_v1';
window.activeCustomColorSlot = -1;
window.lastLassoTool = (function() {
    try {
        let saved = localStorage.getItem('mahardika_draw_last_lasso_v1');
        if (saved === 'lasso' || saved === 'lasso-box') return saved;
    } catch (e) {}
    return 'lasso';
})();

window.muatWarnaKustomDraw = function() {
    let def = ['#ec4899', '#14b8a6', '#7f8c8d'];
    try {
        let raw = localStorage.getItem(window.DRAW_CUSTOM_COLORS_KEY);
        if (raw) {
            let arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length === 3) return arr;
        }
    } catch (e) {}
    return def;
};

window.simpanWarnaKustomDraw = function(arr) {
    try {
        localStorage.setItem(window.DRAW_CUSTOM_COLORS_KEY, JSON.stringify(arr));
    } catch (e) {}
};

window.tutupSemuaPopoverDraw = function() {
    document.querySelectorAll('.draw-popover-panel').forEach(function(p) {
        p.style.display = 'none';
    });
};

window.bukaPopoverDrawDiBawah = function(popoverId, anchorBtn) {
    let pop = document.getElementById(popoverId);
    if (!pop || !anchorBtn) return;
    let sudahBuka = (pop.style.display === 'flex' || pop.style.display === 'block');
    window.tutupSemuaPopoverDraw();
    if (sudahBuka) return;

    pop.style.display = 'flex';
    let rect = anchorBtn.getBoundingClientRect();
    let pw = pop.offsetWidth || 200;
    let leftPos = Math.max(8, Math.min(window.innerWidth - pw - 8, rect.left + (rect.width / 2) - (pw / 2)));
    let topPos = Math.min(window.innerHeight - 160, rect.bottom + 8);
    pop.style.left = Math.round(leftPos) + 'px';
    pop.style.top = Math.round(topPos) + 'px';
};

window.setDrawingTool = function(t) {
    stampLasso();
    activeTool = t;
    if (t === 'lasso' || t === 'lasso-box') {
        window.lastLassoTool = t;
        try { localStorage.setItem(window.DRAW_LAST_LASSO_KEY, t); } catch (e) {}
    }

    document.querySelectorAll('#pen-tools .pt-tool-btn, #pen-tools .pt-lasso-group').forEach(function(b) {
        b.classList.remove('active');
    });

    if (t === 'lasso' || t === 'lasso-box') {
        let grp = document.getElementById('pt-lasso-group');
        if (grp) grp.classList.add('active');
        let ico = document.getElementById('pt-lasso-main-ico');
        let lbl = document.getElementById('pt-lasso-main-lbl');
        if (ico) ico.innerText = (t === 'lasso-box') ? '⬚' : '✂️';
        if (lbl) lbl.innerText = (t === 'lasso-box') ? 'Kotak' : 'Laso';
        document.querySelectorAll('#draw-popover-lasso .pt-pop-opt').forEach(function(opt) {
            opt.classList.toggle('active', opt.getAttribute('data-lasso-type') === t);
        });
    } else {
        let btn = document.getElementById('btn-' + t);
        if (btn) btn.classList.add('active');
    }
    window.tutupSemuaPopoverDraw();
};

window.klikTombolLasoUtama = function(btnEl) {
    let sedangLaso = (activeTool === 'lasso' || activeTool === 'lasso-box');
    if (sedangLaso) {
        window.bukaPopoverDrawDiBawah('draw-popover-lasso', btnEl);
    } else {
        window.setDrawingTool(window.lastLassoTool || 'lasso');
    }
};

window.setPenColor = function(c, btn, customSlotIdx, tutupPopover) {
    window.penColor = c;
    window.activeCustomColorSlot = (typeof customSlotIdx === 'number') ? customSlotIdx : -1;

    let sw = document.getElementById('pt-active-color-dot');
    if (sw) sw.style.background = c;

    document.querySelectorAll('#draw-popover-color .col-btn').forEach(function(b) {
        b.classList.remove('active');
        b.style.borderColor = b.classList.contains('is-custom-slot') ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.22)';
    });
    if (btn) {
        btn.classList.add('active');
        btn.style.borderColor = '#ffffff';
    }
    let picker = document.getElementById('draw-custom-color-input');
    if (picker && c && c.length === 7 && c.charAt(0) === '#') {
        picker.value = c;
    }
    if (tutupPopover !== false) {
        window.tutupSemuaPopoverDraw();
    }
};

window.klikSlotWarnaKustom = function(slotIdx, btn) {
    let customCols = window.muatWarnaKustomDraw();
    let warnaSlot = customCols[slotIdx] || '#ec4899';
    let sudahAktif = btn.classList.contains('active') && window.activeCustomColorSlot === slotIdx;

    if (sudahAktif) {
        window.setPenColor(warnaSlot, btn, slotIdx, false);
        let picker = document.getElementById('draw-custom-color-input');
        if (picker) {
            picker.value = warnaSlot;
            picker.click();
        }
    } else {
        window.setPenColor(warnaSlot, btn, slotIdx, true);
    }
};

window.terapkanWarnaDariPickerDraw = function(hexColor) {
    if (!hexColor) return;
    let targetSlot = (window.activeCustomColorSlot >= 0 && window.activeCustomColorSlot < 3) ? window.activeCustomColorSlot : 0;
    let customCols = window.muatWarnaKustomDraw();
    customCols[targetSlot] = hexColor;
    window.simpanWarnaKustomDraw(customCols);

    let slotBtn = document.querySelector('#draw-popover-color .col-btn[data-custom-slot="' + targetSlot + '"]');
    if (slotBtn) slotBtn.style.background = hexColor;
    window.setPenColor(hexColor, slotBtn, targetSlot, false);
};

window.setPenSize = function(s, btn, labelOpt) {
    window.penSize = s;
    let found = window.DRAW_SIZE_OPTIONS.find(function(o) { return o.val === s; });
    let lbl = labelOpt || (found ? found.label : 'M');
    let lblEl = document.getElementById('pt-active-size-lbl');
    if (lblEl) lblEl.innerText = lbl;

    document.querySelectorAll('#draw-popover-size .sz-btn').forEach(function(b) {
        b.classList.toggle('active', parseFloat(b.getAttribute('data-size')) === s);
    });
    window.tutupSemuaPopoverDraw();
};

window.togglePalmReject = function(isActive) {
    window.pencilOnly = Boolean(isActive);
    if (window.pencilOnly) document.body.classList.add('palm-reject-on');
    else document.body.classList.remove('palm-reject-on');

    let btnPalm = document.getElementById('btn-palm-reject-toggle');
    if (btnPalm) btnPalm.classList.toggle('is-on', window.pencilOnly);
    let chk = document.getElementById('palm-reject');
    if (chk) chk.checked = window.pencilOnly;
};

window.pasangCssToolbarDrawFit = function() {
    if (document.getElementById('css-pen-tools-fit')) return;
    let st = document.createElement('style');
    st.id = 'css-pen-tools-fit';
    st.textContent =
        '#pen-tools {' +
            'width: 100vw !important; max-width: 100vw !important; left: 0 !important; right: 0 !important;' +
            'box-sizing: border-box !important; overflow: hidden !important; overflow-x: hidden !important;' +
            'padding: 6px 8px !important; gap: 4px !important; flex-wrap: nowrap !important;' +
            'justify-content: space-between !important; align-items: center !important;' +
            'background: #1e293b !important; border-bottom: 1px solid rgba(255,255,255,0.12) !important;' +
        '}' +
        '.pt-group { display: flex; align-items: center; gap: 4px; flex-shrink: 1; min-width: 0; }' +
        '.pt-sep { width: 1px; height: 20px; background: rgba(255,255,255,0.18); flex-shrink: 0; }' +
        '.pt-btn {' +
            'display: inline-flex; align-items: center; justify-content: center; gap: 4px;' +
            'height: 32px; padding: 0 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);' +
            'background: rgba(255,255,255,0.08); color: #f8fafc; font-family: Poppins, sans-serif;' +
            'font-size: 11.5px; font-weight: 700; cursor: pointer; white-space: nowrap; flex-shrink: 0;' +
            'transition: background 0.15s, border-color 0.15s;' +
        '}' +
        '.pt-btn:hover { background: rgba(255,255,255,0.18); }' +
        '.pt-btn.active { background: #38bdf8 !important; color: #0b3954 !important; border-color: #7dd3fc !important; }' +
        '.pt-btn.is-icon-only { padding: 0 7px; min-width: 30px; }' +
        '.pt-btn.is-clear { color: #fca5a5; border-color: rgba(248,113,113,0.55); }' +
        '.pt-btn.is-close { background: #dc2626 !important; border-color: #ef4444 !important; color: #ffffff !important; }' +
        '.pt-btn.is-palm.is-on { background: #0f766e !important; border-color: #2dd4bf !important; color: #ffffff !important; }' +
        '.pt-color-trigger { padding: 0 6px !important; gap: 4px !important; }' +
        '.pt-color-dot { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #ffffff; display: inline-block; flex-shrink: 0; }' +
        '.pt-caret { font-size: 9px; opacity: 0.85; line-height: 1; }' +
        '.pt-lasso-group { display: inline-flex; align-items: center; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); overflow: hidden; flex-shrink: 0; }' +
        '.pt-lasso-group.active { background: #38bdf8 !important; border-color: #7dd3fc !important; }' +
        '.pt-lasso-group.active button { color: #0b3954 !important; }' +
        '.pt-lasso-main { height: 30px; padding: 0 7px; border: none; background: transparent; color: #f8fafc; font-family: Poppins, sans-serif; font-size: 11.5px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }' +
        '.pt-lasso-drop { height: 30px; padding: 0 5px; border: none; border-left: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.12); color: #f8fafc; font-size: 10px; cursor: pointer; }' +
        '.draw-popover-panel {' +
            'display: none; position: fixed; z-index: 1000260; background: #1e293b; color: #ffffff;' +
            'border: 1.5px solid rgba(255,255,255,0.22); border-radius: 12px; padding: 10px;' +
            'box-shadow: 0 12px 30px rgba(0,0,0,0.45); flex-direction: column; gap: 8px;' +
            'font-family: Poppins, sans-serif;' +
        '}' +
        '.pt-color-grid { display: grid; grid-template-columns: repeat(5, 28px); gap: 7px; align-items: center; justify-items: center; }' +
        '.draw-popover-panel .col-btn { width: 26px; height: 26px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.22); cursor: pointer; padding: 0; }' +
        '.draw-popover-panel .col-btn.active { transform: scale(1.12); box-shadow: 0 0 0 2px #38bdf8; }' +
        '.pt-pop-opt { display: flex; align-items: center; gap: 8px; padding: 7px 11px; border: none; border-radius: 8px; background: rgba(255,255,255,0.06); color: #f8fafc; font-family: Poppins, sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; text-align: left; }' +
        '.pt-pop-opt:hover { background: rgba(255,255,255,0.16); }' +
        '.pt-pop-opt.active { background: #38bdf8; color: #0b3954; }' +
        '.pt-size-row { display: flex; gap: 6px; }' +
        '.draw-popover-panel .sz-btn { min-width: 34px; height: 30px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); color: #ffffff; font-weight: 800; font-size: 11px; cursor: pointer; }' +
        '.draw-popover-panel .sz-btn.active { background: #ffffff; color: #0b3954; }' +
        '.draw-float-img-item.is-lasso-attached { outline: 2.5px dashed #38bdf8 !important; box-shadow: 0 6px 20px rgba(56,189,248,0.35) !important; }' +
        '.draw-float-img-crop { position: absolute; top: -10px; right: 18px; width: 24px; height: 24px; border-radius: 50%; border: 2px solid #ffffff; background: #0284c7; color: #ffffff; font-size: 11px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 6; box-shadow: 0 2px 6px rgba(0,0,0,0.3); padding: 0; }' +
        /* Hilangkan tulisan tombol otomatis di layar tablet/HP/laptop sempit agar 100% pas tanpa scroll */
        '@media (max-width: 1160px) { #pen-tools .pt-lbl { display: none !important; } #pen-tools .pt-btn { padding: 0 6px !important; min-width: 28px; } #pen-tools .pt-lasso-main { padding: 0 6px !important; } }' +
        '@media (max-width: 560px) { #pen-tools { padding: 4px 5px !important; gap: 2px !important; } #pen-tools .pt-group { gap: 2px !important; } #pen-tools .pt-sep { display: none !important; } #pen-tools .pt-btn { height: 28px !important; min-width: 25px !important; padding: 0 4px !important; font-size: 12px !important; } #pen-tools .pt-lasso-main, #pen-tools .pt-lasso-drop { height: 26px !important; padding: 0 4px !important; } .pt-color-dot { width: 15px !important; height: 15px !important; } }';
    document.head.appendChild(st);
};

window.inisialisasiToolbarDrawKompak = function() {
    window.pasangCssToolbarDrawFit();
    let penTools = document.getElementById('pen-tools');
    if (!penTools || penTools.getAttribute('data-compact-v2') === '1') return;
    penTools.setAttribute('data-compact-v2', '1');

    let lastLasso = window.lastLassoTool || 'lasso';
    let lassoIco = (lastLasso === 'lasso-box') ? '⬚' : '✂️';
    let lassoLbl = (lastLasso === 'lasso-box') ? 'Kotak' : 'Laso';

    penTools.innerHTML =
        '<div class="pt-group">' +
            '<button type="button" class="pt-btn is-icon-only" onclick="window.undoDraw()" title="Undo">↩️</button>' +
            '<button type="button" class="pt-btn is-icon-only" onclick="window.redoDraw()" title="Redo">↪️</button>' +
            '<span class="pt-sep"></span>' +
            '<button type="button" id="btn-pt-color" class="pt-btn pt-color-trigger" onclick="window.bukaPopoverDrawDiBawah(\'draw-popover-color\', this)" title="Pilih &amp; Ubah Warna">' +
                '<span id="pt-active-color-dot" class="pt-color-dot" style="background:' + (window.penColor || '#e74c3c') + ';"></span>' +
                '<span class="pt-caret">▾</span>' +
            '</button>' +
            '<button type="button" id="btn-pt-size" class="pt-btn" onclick="window.bukaPopoverDrawDiBawah(\'draw-popover-size\', this)" title="Ukuran Pena">' +
                '<span id="pt-active-size-lbl">M</span><span class="pt-caret">▾</span>' +
            '</button>' +
        '</div>' +

        '<div class="pt-group">' +
            '<button type="button" id="btn-pen" class="pt-btn pt-tool-btn active" onclick="window.setDrawingTool(\'pen\')" title="Pena">✏️<span class="pt-lbl"> Pena</span></button>' +
            '<button type="button" id="btn-highlighter" class="pt-btn pt-tool-btn" onclick="window.setDrawingTool(\'highlighter\')" title="Stabilo">🖍️<span class="pt-lbl"> Stabilo</span></button>' +
            '<button type="button" id="btn-line" class="pt-btn pt-tool-btn" onclick="window.setDrawingTool(\'line\')" title="Garis Lurus">📏<span class="pt-lbl"> Garis</span></button>' +
            '<button type="button" id="btn-laser" class="pt-btn pt-tool-btn" onclick="window.setDrawingTool(\'laser\')" title="Laser Pointer">🔴<span class="pt-lbl"> Laser</span></button>' +
            '<button type="button" id="btn-eraser" class="pt-btn pt-tool-btn" onclick="window.setDrawingTool(\'eraser\')" title="Penghapus">🧽<span class="pt-lbl"> Hapus</span></button>' +
            '<div id="pt-lasso-group" class="pt-lasso-group">' +
                '<button type="button" class="pt-lasso-main" onclick="window.klikTombolLasoUtama(this.parentElement)" title="Laso (Otomatis pakai jenis terakhir)">' +
                    '<span id="pt-lasso-main-ico">' + lassoIco + '</span><span id="pt-lasso-main-lbl" class="pt-lbl">' + lassoLbl + '</span>' +
                '</button>' +
                '<button type="button" class="pt-lasso-drop" onclick="event.stopPropagation(); window.bukaPopoverDrawDiBawah(\'draw-popover-lasso\', this.parentElement)" title="Pilih Jenis Laso (Freehand / Kotak)">▾</button>' +
            '</div>' +
        '</div>' +

        '<div class="pt-group">' +
            '<button type="button" id="btn-palm-reject-toggle" class="pt-btn is-palm' + (window.pencilOnly ? ' is-on' : '') + '" onclick="window.togglePalmReject(!window.pencilOnly)" title="Palm Reject (iPad Apple Pencil)">✋<span class="pt-lbl"> Palm</span></button>' +
            '<input type="checkbox" id="palm-reject" style="display:none;" ' + (window.pencilOnly ? 'checked' : '') + '>' +
            '<button type="button" class="pt-btn is-clear" onclick="window.clearSemuaCoretan()" title="Hapus Semua Coretan">🗑️<span class="pt-lbl"> Clear</span></button>' +
            '<button type="button" class="pt-btn is-close" onclick="window.toggleDrawingMode()" title="Tutup Mode Draw">✕<span class="pt-lbl"> Tutup</span></button>' +
        '</div>';

    // Popover 1: Pilihan Warna (9 Preset + 3 Slot Kustom + Pemilih Warna)
    let oldPopCol = document.getElementById('draw-popover-color');
    if (oldPopCol) oldPopCol.remove();
    let popCol = document.createElement('div');
    popCol.id = 'draw-popover-color';
    popCol.className = 'draw-popover-panel';

    let customCols = window.muatWarnaKustomDraw();
    let presetHtml = window.DRAW_PRESET_COLORS.map(function(hex) {
        let isDef = (hex.toLowerCase() === (window.penColor || '#e74c3c').toLowerCase());
        return '<button type="button" class="col-btn' + (isDef ? ' active' : '') + '" style="background:' + hex + ';" onclick="window.setPenColor(\'' + hex + '\', this)" title="' + hex + '"></button>';
    }).join('');
    let customHtml = customCols.map(function(hex, idx) {
        return '<button type="button" class="col-btn is-custom-slot" data-custom-slot="' + idx + '" style="background:' + hex + '; border:2px dashed rgba(255,255,255,0.7);" onclick="window.klikSlotWarnaKustom(' + idx + ', this)" title="Slot Kustom ' + (idx + 1) + ' (klik lagi saat aktif untuk ubah warna)"></button>';
    }).join('');

    popCol.innerHTML =
        '<div style="font-size:10.5px; font-weight:700; color:#94a3b8;">🎨 Pilih Warna</div>' +
        '<div class="pt-color-grid">' + presetHtml + '</div>' +
        '<div style="height:1px; background:rgba(255,255,255,0.14);"></div>' +
        '<div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">' +
            '<div style="display:flex; gap:7px; align-items:center;">' + customHtml + '</div>' +
            '<label title="Ubah Warna Slot Kustom" style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:conic-gradient(#ef4444,#f59e0b,#22c55e,#3b82f6,#a855f7,#ef4444); border:2px solid #ffffff; cursor:pointer; position:relative; overflow:hidden;">' +
                '<span style="font-size:12px; pointer-events:none;">🎨</span>' +
                '<input type="color" id="draw-custom-color-input" value="' + customCols[0] + '" style="position:absolute; inset:0; opacity:0; width:100%; height:100%; cursor:pointer;" oninput="window.terapkanWarnaDariPickerDraw(this.value)" onchange="window.terapkanWarnaDariPickerDraw(this.value)">' +
            '</label>' +
        '</div>' +
        '<div style="font-size:9.5px; color:#94a3b8;">Tip: pilih slot putus-putus lalu tekan 🎨 untuk simpan warna sendiri.</div>';
    document.body.appendChild(popCol);

    // Popover 2: Pilihan Ukuran Pena (XS - XL)
    let oldPopSz = document.getElementById('draw-popover-size');
    if (oldPopSz) oldPopSz.remove();
    let popSz = document.createElement('div');
    popSz.id = 'draw-popover-size';
    popSz.className = 'draw-popover-panel';
    popSz.innerHTML =
        '<div style="font-size:10.5px; font-weight:700; color:#94a3b8;">Ketebalan Pena</div>' +
        '<div class="pt-size-row">' +
            window.DRAW_SIZE_OPTIONS.map(function(o) {
                let act = (o.val === window.penSize) ? ' active' : '';
                return '<button type="button" class="sz-btn' + act + '" data-size="' + o.val + '" onclick="window.setPenSize(' + o.val + ', this, \'' + o.label + '\')">' + o.label + '</button>';
            }).join('') +
        '</div>';
    document.body.appendChild(popSz);

    // Popover 3: Pilihan Jenis Laso (Freehand / Kotak)
    let oldPopLas = document.getElementById('draw-popover-lasso');
    if (oldPopLas) oldPopLas.remove();
    let popLas = document.createElement('div');
    popLas.id = 'draw-popover-lasso';
    popLas.className = 'draw-popover-panel';
    popLas.innerHTML =
        '<div style="font-size:10.5px; font-weight:700; color:#94a3b8;">Jenis Seleksi Laso</div>' +
        '<button type="button" class="pt-pop-opt' + (lastLasso === 'lasso' ? ' active' : '') + '" data-lasso-type="lasso" onclick="window.setDrawingTool(\'lasso\')">✂️ Freehand (Bebas)</button>' +
        '<button type="button" class="pt-pop-opt' + (lastLasso === 'lasso-box' ? ' active' : '') + '" data-lasso-type="lasso-box" onclick="window.setDrawingTool(\'lasso-box\')">⬚ Kotak (Persegi)</button>';
    document.body.appendChild(popLas);
};

document.addEventListener('pointerdown', function(e) {
    if (!e.target.closest('.draw-popover-panel') && !e.target.closest('#btn-pt-color') && !e.target.closest('#btn-pt-size') && !e.target.closest('#pt-lasso-group')) {
        window.tutupSemuaPopoverDraw();
    }
}, true);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.inisialisasiToolbarDrawKompak);
} else {
    window.inisialisasiToolbarDrawKompak();
}

window.clearSemuaCoretan = function() {
    if (confirm("Hapus semua coretan di halaman ini?")) {
        document.querySelectorAll('.drawing-layer').forEach(function(cvs) {
            let dpr = parseFloat(cvs.getAttribute('data-dpr')) || window.DRAW_DPR || 2;
            let ctx = window.siapkanKonteksRetina(cvs);
            ctx.clearRect(0, 0, cvs.width / dpr, cvs.height / dpr);
            window.simpanDataDrawingTarget(cvs, "");
        });
        if (window.simpanKeDB) window.simpanKeDB();
    }
};

function resizeLaserCanvas() {
    if (globalLaserCvs) {
        let dpr = window.DRAW_DPR || 2;
        globalLaserCvs.width = Math.round(window.innerWidth * dpr);
        globalLaserCvs.height = Math.round(window.innerHeight * dpr);
        globalLaserCvs.style.width = window.innerWidth + 'px';
        globalLaserCvs.style.height = window.innerHeight + 'px';
        if (globalLaserCtx) {
            globalLaserCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    }
}
window.addEventListener('resize', function() {
    setTimeout(inisialisasiSemuaCanvas, 250);
    resizeLaserCanvas();
    stampLasso();
});

window.isLaserLoopRunning = false;
window.mulaiLoopLaser = function() {
    if (!window.isLaserLoopRunning) {
        window.isLaserLoopRunning = true;
        requestAnimationFrame(renderLaser);
    }
};

function renderLaser() {
    if (!globalLaserCtx) {
        window.isLaserLoopRunning = false;
        return;
    }
    globalLaserCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (laserStrokes.length === 0) {
        window.isLaserLoopRunning = false;
        return;
    }

    let now = Date.now();
    let fadeStart = laserLastActiveTime + 900;
    if (now > fadeStart && laserLastActiveTime > 0) {
        let alpha = 1 - ((now - fadeStart) / 900);
        if (alpha <= 0) {
            laserStrokes = [];
            laserLastActiveTime = 0;
            globalLaserCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            window.isLaserLoopRunning = false;
            return;
        }
        globalLaserCtx.globalAlpha = alpha;
    } else {
        globalLaserCtx.globalAlpha = 1;
    }

    laserStrokes.forEach(function(s) {
        if (s.points.length < 2) return;
        globalLaserCtx.lineCap = 'round';
        globalLaserCtx.lineJoin = 'round';
        globalLaserCtx.lineWidth = 6;
        globalLaserCtx.strokeStyle = '#ff2e2e';
        globalLaserCtx.shadowColor = '#ff0000';
        globalLaserCtx.shadowBlur = 8;
        window.gambarKurvaHalus(globalLaserCtx, s.points);
        globalLaserCtx.shadowBlur = 0;
    });
    requestAnimationFrame(renderLaser);
}

window.activeTouches = 0;
window.longPressDrawTimer = null;
window.drawContextTarget = null;

document.addEventListener('touchstart', function(e) {
    if (!window.isDrawingMode) return;
    if (e.target.closest('#pen-tools') || e.target.closest('#draw-context-menu') || e.target.closest('.lasso-float')) return;
    window.activeTouches = e.touches.length;

    let hasStylus = false;
    for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].touchType === 'stylus' || e.touches[i].touchType === 'pen') hasStylus = true;
    }

    if (hasStylus) {
        clearTimeout(window.longPressDrawTimer);
        e.preventDefault();
        return;
    }

    if (e.touches.length === 1) {
        let touch = e.touches[0];
        let targetCvs = e.target.closest('.drawing-layer');
        if (targetCvs) {
            let startX = touch.clientX;
            let startY = touch.clientY;
            clearTimeout(window.longPressDrawTimer);
            window.longPressDrawTimer = setTimeout(function() {
                window.bukaMenuKonteksDraw(startX, startY, targetCvs);
            }, 550);
        }
        if (!window.pencilOnly) {
            e.preventDefault();
        }
    } else {
        clearTimeout(window.longPressDrawTimer);
    }
}, { passive: false });

document.addEventListener('touchmove', function() {
    if (window.longPressDrawTimer) {
        clearTimeout(window.longPressDrawTimer);
        window.longPressDrawTimer = null;
    }
}, { passive: true });

document.addEventListener('touchend', function() {
    if (window.longPressDrawTimer) {
        clearTimeout(window.longPressDrawTimer);
        window.longPressDrawTimer = null;
    }
});

document.addEventListener('contextmenu', function(e) {
    if (!window.isDrawingMode) return;
    let targetCvs = e.target.closest('.drawing-layer');
    if (targetCvs) {
        e.preventDefault();
        window.bukaMenuKonteksDraw(e.clientX, e.clientY, targetCvs);
    }
});

window.bukaMenuKonteksDraw = function(clientX, clientY, targetCvs) {
    let menu = document.getElementById('draw-context-menu');
    if (!menu || !targetCvs) return;
    let rect = targetCvs.getBoundingClientRect();
    window.drawContextTarget = {
        cvs: targetCvs,
        blockIdx: parseInt(targetCvs.getAttribute('data-index')),
        slideIdx: targetCvs.getAttribute('data-slide-index') !== null ? parseInt(targetCvs.getAttribute('data-slide-index')) : -1,
        xPct: Math.max(2, Math.min(80, ((clientX - rect.left) / rect.width) * 100)),
        yPct: Math.max(2, Math.min(80, ((clientY - rect.top) / rect.height) * 100))
    };

    let btnPasteLasso = document.getElementById('btn-ctx-paste-lasso');
    if (btnPasteLasso) {
        btnPasteLasso.style.display = window.lassoClipboardDataUrl ? 'flex' : 'none';
    }

    menu.style.display = 'block';
    let mx = Math.min(clientX, window.innerWidth - 210);
    let my = Math.min(clientY, window.innerHeight - 130);
    menu.style.left = Math.max(10, mx) + 'px';
    menu.style.top = Math.max(10, my) + 'px';
};

window.tutupMenuKonteksDraw = function() {
    let menu = document.getElementById('draw-context-menu');
    if (menu) menu.style.display = 'none';
};

// =========================================================================
// 4. EVENT POINTER MENGGAMBAR & MESIN SMART SHAPE VEKTOR
// =========================================================================
document.addEventListener('pointerdown', function(e) {
    if (!e.target.closest('#draw-context-menu')) {
        window.tutupMenuKonteksDraw();
    }

    if (!window.isDrawingMode && e.target.tagName === 'IMG' && !e.target.closest('.draw-float-img-item') && !e.target.classList.contains('pdf-slide-bg') && (document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode'))) {
        let i = e.target;
        let iRect = i.getBoundingClientRect();
        let isNearCorner = (iRect.right - e.clientX) <= 22 && (iRect.bottom - e.clientY) <= 22;
        if (!isNearCorner) return;
        let sX = e.clientX, sW = i.offsetWidth;
        let parentEl = i.closest('.content-block, .fb-content');
        let maxW = parentEl ? (parentEl.clientWidth - 20) : 900;
        function m(me) {
            let newW = Math.max(40, Math.min(maxW, sW + (me.clientX - sX)));
            i.removeAttribute('height');
            i.style.width = newW + 'px';
            i.style.height = 'auto';
            i.style.maxWidth = '100%';
            if (typeof window.perbaruiPosisiKontrolGambar === 'function') window.perbaruiPosisiKontrolGambar();
        }
        function up() {
            document.removeEventListener('pointermove', m);
            document.removeEventListener('pointerup', up);
            if (parentEl) parentEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
        document.addEventListener('pointermove', m);
        document.addEventListener('pointerup', up);
        e.preventDefault();
        return;
    }

    if (!window.isDrawingMode) return;
    if (e.target.closest('#pen-tools') || e.target.closest('.draw-popover-panel') || e.target.closest('#draw-context-menu') || e.target.closest('.pdf-slide-nav-bar') || e.target.closest('.draw-float-img-item')) return;

    if (e.pointerType === 'touch') {
        if (window.pencilOnly || window.activeTouches > 1) {
            isPenDown = false;
            return;
        }
    }

    if (isFloating && floatUI) {
        if (e.target.closest('.lasso-float')) return;
        stampLasso();
    }

    if (e.target.classList.contains('drawing-layer')) {
        clearTimeout(window.longPressDrawTimer);
        let c = e.target;
        let pt = window.ambilKoordinatKanvas(c, e.clientX, e.clientY);
        let x = pt.x, y = pt.y;

        if (window.activeSmartShape && window.activeSmartShape.ctx.canvas === c) {
            let hit = -1;
            window.activeSmartShape.vertices.forEach(function(v, idx) {
                if (Math.hypot(x - v.x, y - v.y) < 18) hit = idx;
            });
            if (hit !== -1) {
                window.draggingSmartVertex = hit;
                return;
            } else {
                window.burnActiveSmartShape();
            }
        }

        isPenDown = true;
        window.isShapeRecognized = false;
        clearTimeout(window.shapeHoldTimer);

        if (activeTool === 'laser') {
            laserLastActiveTime = Date.now();
            currentLaserStroke = { points: [{ x: e.clientX, y: e.clientY }] };
            laserStrokes.push(currentLaserStroke);
            window.mulaiLoopLaser();
        } else {
            currentDrawCtx = window.siapkanKonteksRetina(c);

            if (activeTool === 'lasso' || activeTool === 'lasso-box') {
                currentDrawCtx.globalCompositeOperation = 'source-over';
                lassoTargetCanvas = c;
                lassoPath = [{ x: x, y: y }];
                lassoSavedImageData = currentDrawCtx.getImageData(0, 0, c.width, c.height);
            } else if (activeTool === 'highlighter' || activeTool === 'line' || activeTool === 'pen' || activeTool === 'eraser') {
                window.drawUndoStack.push({ cvs: c, data: c.toDataURL("image/png") });
                window.drawRedoStack = [];

                currentDrawCtx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over';
                currentDrawCtx.strokeStyle = window.penColor;
                currentDrawCtx.lineWidth = activeTool === 'eraser' ? (window.penSize * 5) : window.penSize;
                window.drawSnapshot = currentDrawCtx.getImageData(0, 0, c.width, c.height);
                window.drawPoints = [{ x: x, y: y }];
                currentDrawCtx.beginPath();
                currentDrawCtx.moveTo(x, y);
            }
        }
    }
});

window.getPerpendicularDist = function(p, p1, p2) {
    let A = p.x - p1.x, B = p.y - p1.y, C = p2.x - p1.x, D = p2.y - p1.y;
    let dot = A * C + B * D, len_sq = C * C + D * D, param = -1, xx, yy;
    if (len_sq !== 0) param = dot / len_sq;
    if (param < 0) { xx = p1.x; yy = p1.y; } else if (param > 1) { xx = p2.x; yy = p2.y; } else { xx = p1.x + param * C; yy = p1.y + param * D; }
    let dx = p.x - xx, dy = p.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
};

window.simplifyDouglasPeucker = function(points, epsilon) {
    let maxDist = 0, index = 0, end = points.length - 1;
    for (let i = 1; i < end; i++) {
        let d = window.getPerpendicularDist(points[i], points[0], points[end]);
        if (d > maxDist) { maxDist = d; index = i; }
    }
    if (maxDist > epsilon) {
        let left = window.simplifyDouglasPeucker(points.slice(0, index + 1), epsilon);
        let right = window.simplifyDouglasPeucker(points.slice(index), epsilon);
        return left.slice(0, left.length - 1).concat(right);
    } else {
        return [points[0], points[end]];
    }
};

window.jarakAntarTitik = function(p1, p2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
};

window.sudutAntarTigaTitik = function(p1, p2, p3) {
    let a = window.jarakAntarTitik(p2, p3);
    let b = window.jarakAntarTitik(p1, p2);
    let c = window.jarakAntarTitik(p1, p3);
    if (a === 0 || b === 0) return 0;
    let cosVal = (a * a + b * b - c * c) / (2 * a * b);
    return Math.acos(Math.max(-1, Math.min(1, cosVal))) * (180 / Math.PI);
};

window.recognizeShape = function() {
    if (!isPenDown || !currentDrawCtx || window.isShapeRecognized || window.drawPoints.length < 10) return;
    let pts = window.drawPoints;
    let start = pts[0], end = pts[pts.length - 1];

    let minX = pts[0].x, maxX = pts[0].x, minY = pts[0].y, maxY = pts[0].y;
    pts.forEach(function(p) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    });
    let w = maxX - minX, h = maxY - minY;
    let diag = Math.hypot(w, h);
    let isClosed = window.jarakAntarTitik(start, end) < Math.max(45, diag * 0.25);

    let epsilon = Math.max(w, h) * 0.08;
    if (epsilon < 14) epsilon = 14;
    let simplified = window.simplifyDouglasPeucker(pts, epsilon);

    if (isClosed && simplified.length > 2) {
        simplified[simplified.length - 1] = { x: simplified[0].x, y: simplified[0].y };
    }

    let type = 'polygon';
    let vertices = simplified;

    // Hitung seberapa dekat coretan dengan elips/lingkaran (Circularity Fit)
    let isMiripLingkaran = false;
    if (isClosed && w > 18 && h > 18) {
        let cx = minX + w / 2;
        let cy = minY + h / 2;
        let rx = w / 2;
        let ry = h / 2;
        let sumDev = 0;
        let maxNormR = 0;
        pts.forEach(function(p) {
            let normR = Math.hypot((p.x - cx) / rx, (p.y - cy) / ry);
            sumDev += Math.abs(normR - 1);
            if (normR > maxNormR) maxNormR = normR;
        });
        let mad = sumDev / pts.length;
        // Jika bentuk membulat (tidak bersudut tajam seperti persegi/segitiga) atau sudut >= 6, jadikan lingkaran/oval
        if ((simplified.length >= 6 && mad < 0.26) || (simplified.length === 5 && mad < 0.13 && maxNormR < 1.24)) {
            isMiripLingkaran = true;
        }
    }

    if (isMiripLingkaran) {
        let rasio = Math.max(w, h) / Math.max(1, Math.min(w, h));
        let cx = minX + w / 2, cy = minY + h / 2;
        if (rasio < 1.25) {
            type = 'circle';
            let radius = (w + h) / 4;
            vertices = [{ x: cx, y: cy - radius }, { x: cx + radius, y: cy }, { x: cx, y: cy + radius }, { x: cx - radius, y: cy }];
        } else {
            type = 'oval';
            vertices = [{ x: cx, y: minY }, { x: maxX, y: cy }, { x: cx, y: maxY }, { x: minX, y: cy }];
        }
    } else if (isClosed && simplified.length >= 4 && simplified.length <= 5) {
        let nPoints = simplified.length - 1;
        let cx = minX + w / 2;
        let cy = minY + h / 2;

        if (nPoints === 3) {
            let s1 = window.jarakAntarTitik(simplified[0], simplified[1]);
            let s2 = window.jarakAntarTitik(simplified[1], simplified[2]);
            let s3 = window.jarakAntarTitik(simplified[2], simplified[0]);
            let a1 = window.sudutAntarTigaTitik(simplified[2], simplified[0], simplified[1]);
            let a2 = window.sudutAntarTigaTitik(simplified[0], simplified[1], simplified[2]);
            let a3 = window.sudutAntarTigaTitik(simplified[1], simplified[2], simplified[0]);

            let sisiUrut = [s1, s2, s3].sort(function(a, b) { return a - b; });
            let sudutUrut = [a1, a2, a3].sort(function(a, b) { return a - b; });

            if (sisiUrut[2] / sisiUrut[0] < 1.15) {
                let r = Math.max(w, h) / 2;
                vertices = [
                    { x: cx, y: cy - r },
                    { x: cx + r * Math.cos(30 * Math.PI / 180), y: cy + r * Math.sin(30 * Math.PI / 180) },
                    { x: cx - r * Math.cos(30 * Math.PI / 180), y: cy + r * Math.sin(30 * Math.PI / 180) },
                    { x: cx, y: cy - r }
                ];
            } else if (Math.abs(sudutUrut[2] - 90) < 15) {
                if (Math.abs(a1 - 90) < 15 || Math.abs(a2 - 90) < 15 || Math.abs(a3 - 90) < 15) {
                    vertices = [{ x: minX, y: minY }, { x: maxX, y: maxY }, { x: minX, y: maxY }, { x: minX, y: minY }];
                }
            } else if ((sisiUrut[1] / sisiUrut[0] < 1.15) || (sisiUrut[2] / sisiUrut[1] < 1.15)) {
                vertices = [{ x: cx, y: minY }, { x: maxX, y: maxY }, { x: minX, y: maxY }, { x: cx, y: minY }];
            }
        } else if (nPoints === 4) {
            let s1 = window.jarakAntarTitik(simplified[0], simplified[1]);
            let s2 = window.jarakAntarTitik(simplified[1], simplified[2]);
            let s3 = window.jarakAntarTitik(simplified[2], simplified[3]);
            let s4 = window.jarakAntarTitik(simplified[3], simplified[0]);

            let d1 = window.jarakAntarTitik(simplified[0], simplified[2]);
            let d2 = window.jarakAntarTitik(simplified[1], simplified[3]);

            let isPersegiPanjang = (Math.abs(s1 - s3) / s1 < 0.2) && (Math.abs(s2 - s4) / s2 < 0.2) && (Math.abs(d1 - d2) / d1 < 0.2);
            let isJajargenjang = (Math.abs(s1 - s3) / s1 < 0.2) && (Math.abs(s2 - s4) / s2 < 0.2) && (Math.abs(d1 - d2) / d1 >= 0.2);
            let isLayangLayang = ((Math.abs(s1 - s2) / s1 < 0.15) && (Math.abs(s3 - s4) / s3 < 0.15)) || ((Math.abs(s1 - s4) / s1 < 0.15) && (Math.abs(s2 - s3) / s2 < 0.15));

            if (isPersegiPanjang) {
                let rasio = Math.max(w, h) / Math.min(w, h);
                if (rasio < 1.15) {
                    let s = Math.max(w, h);
                    vertices = [{ x: cx - s / 2, y: cy - s / 2 }, { x: cx + s / 2, y: cy - s / 2 }, { x: cx + s / 2, y: cy + s / 2 }, { x: cx - s / 2, y: cy + s / 2 }, { x: cx - s / 2, y: cy - s / 2 }];
                } else {
                    vertices = [{ x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY }, { x: minX, y: maxY }, { x: minX, y: minY }];
                }
            } else if (isJajargenjang) {
                let miring = w * 0.2;
                vertices = [{ x: minX + miring, y: minY }, { x: maxX, y: minY }, { x: maxX - miring, y: maxY }, { x: minX, y: maxY }, { x: minX + miring, y: minY }];
            } else if (isLayangLayang) {
                vertices = [{ x: cx, y: minY }, { x: maxX, y: cy }, { x: cx, y: maxY }, { x: minX, y: cy }, { x: cx, y: minY }];
            }
        }
    }

    window.activeSmartShape = {
        type: type,
        isClosed: isClosed,
        vertices: vertices,
        color: window.penColor,
        size: window.penSize,
        ctx: currentDrawCtx
    };

    window.isShapeRecognized = true;
    window.renderActiveSmartShape();
};

window.renderActiveSmartShape = function() {
    let shape = window.activeSmartShape;
    if (!shape) return;
    let ctx = shape.ctx;

    ctx.putImageData(window.drawSnapshot, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    ctx.beginPath();
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (shape.type === 'oval' || shape.type === 'circle') {
        let v = shape.vertices;
        let cx = (v[3].x + v[1].x) / 2, cy = (v[0].y + v[2].y) / 2;
        let rx = Math.abs(v[1].x - v[3].x) / 2, ry = Math.abs(v[2].y - v[0].y) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
    } else {
        ctx.moveTo(shape.vertices[0].x, shape.vertices[0].y);
        for (let i = 1; i < shape.vertices.length; i++) {
            ctx.lineTo(shape.vertices[i].x, shape.vertices[i].y);
        }
    }
    ctx.stroke();

    ctx.fillStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    shape.vertices.forEach(function(v) {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    });
};

window.burnActiveSmartShape = function() {
    if (!window.activeSmartShape) return;
    let shape = window.activeSmartShape;
    let ctx = shape.ctx;
    ctx.putImageData(window.drawSnapshot, 0, 0);

    ctx.beginPath();
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (shape.type === 'oval' || shape.type === 'circle') {
        let v = shape.vertices;
        let cx = (v[3].x + v[1].x) / 2, cy = (v[0].y + v[2].y) / 2;
        let rx = Math.abs(v[1].x - v[3].x) / 2, ry = Math.abs(v[2].y - v[0].y) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
    } else {
        ctx.moveTo(shape.vertices[0].x, shape.vertices[0].y);
        for (let i = 1; i < shape.vertices.length; i++) {
            ctx.lineTo(shape.vertices[i].x, shape.vertices[i].y);
        }
    }
    ctx.stroke();

    let dataToSave = ctx.canvas.toDataURL("image/png");
    window.simpanDataDrawingTarget(ctx.canvas, dataToSave);
    if (window.simpanKeDB) window.simpanKeDB();

    window.activeSmartShape = null;
    currentDrawCtx = null;
};

document.addEventListener('pointermove', function(e) {
    if (!window.isDrawingMode) return;

    if (window.draggingSmartVertex !== undefined && window.activeSmartShape) {
        let ptDrag = window.ambilKoordinatKanvas(window.activeSmartShape.ctx.canvas, e.clientX, e.clientY);
        let x = ptDrag.x, y = ptDrag.y;
        window.activeSmartShape.vertices[window.draggingSmartVertex] = { x: x, y: y };

        if (window.activeSmartShape.type === 'polygon' && window.activeSmartShape.isClosed) {
            if (window.draggingSmartVertex === 0) {
                window.activeSmartShape.vertices[window.activeSmartShape.vertices.length - 1] = { x: x, y: y };
            } else if (window.draggingSmartVertex === window.activeSmartShape.vertices.length - 1) {
                window.activeSmartShape.vertices[0] = { x: x, y: y };
            }
        }
        window.renderActiveSmartShape();
        return;
    }

    if (!isPenDown) return;
    if (e.pointerType === 'touch' && (window.pencilOnly || window.activeTouches > 1)) {
        isPenDown = false;
        return;
    }

    if (activeTool === 'laser' && currentLaserStroke) {
        laserLastActiveTime = Date.now();
        currentLaserStroke.points.push({ x: e.clientX, y: e.clientY });
    } else if (currentDrawCtx) {
        let ptMove = window.ambilKoordinatKanvas(currentDrawCtx.canvas, e.clientX, e.clientY);
        let x = ptMove.x, y = ptMove.y;

        if (activeTool === 'lasso') {
            lassoPath.push({ x: x, y: y });
            currentDrawCtx.putImageData(lassoSavedImageData, 0, 0);
            currentDrawCtx.beginPath();
            currentDrawCtx.moveTo(lassoPath[0].x, lassoPath[0].y);
            for (let i = 1; i < lassoPath.length; i++) currentDrawCtx.lineTo(lassoPath[i].x, lassoPath[i].y);
            currentDrawCtx.strokeStyle = '#3498db';
            currentDrawCtx.lineWidth = 1.5;
            currentDrawCtx.setLineDash([5, 5]);
            currentDrawCtx.stroke();
            currentDrawCtx.setLineDash([]);
        } else if (activeTool === 'lasso-box') {
            lassoPath[1] = { x: x, y: y };
            currentDrawCtx.putImageData(lassoSavedImageData, 0, 0);
            currentDrawCtx.beginPath();
            let startX = lassoPath[0].x, startY = lassoPath[0].y;
            currentDrawCtx.rect(startX, startY, x - startX, y - startY);
            currentDrawCtx.strokeStyle = '#3498db';
            currentDrawCtx.lineWidth = 1.5;
            currentDrawCtx.setLineDash([5, 5]);
            currentDrawCtx.stroke();
            currentDrawCtx.setLineDash([]);
        } else if (activeTool === 'highlighter') {
            window.drawPoints.push({ x: x, y: y });
            currentDrawCtx.putImageData(window.drawSnapshot, 0, 0);
            currentDrawCtx.globalAlpha = 0.38;
            currentDrawCtx.strokeStyle = window.penColor;
            currentDrawCtx.lineWidth = window.penSize * 4;
            window.gambarKurvaHalus(currentDrawCtx, window.drawPoints);
            currentDrawCtx.globalAlpha = 1.0;
        } else if (activeTool === 'line') {
            currentDrawCtx.putImageData(window.drawSnapshot, 0, 0);
            currentDrawCtx.beginPath();
            currentDrawCtx.moveTo(window.drawPoints[0].x, window.drawPoints[0].y);
            currentDrawCtx.lineTo(x, y);
            currentDrawCtx.strokeStyle = window.penColor;
            currentDrawCtx.lineWidth = window.penSize;
            currentDrawCtx.stroke();
        } else if (activeTool === 'pen') {
            if (!window.isShapeRecognized) {
                // Tangkap seluruh sampel Apple Pencil 120Hz (Coalesced Events) jika didukung iPad
                let events = (typeof e.getCoalescedEvents === 'function') ? e.getCoalescedEvents() : [e];
                if (!events || events.length === 0) events = [e];
                events.forEach(function(ev) {
                    let ptEv = window.ambilKoordinatKanvas(currentDrawCtx.canvas, ev.clientX, ev.clientY);
                    window.drawPoints.push({ x: ptEv.x, y: ptEv.y });
                });

                currentDrawCtx.putImageData(window.drawSnapshot, 0, 0);
                currentDrawCtx.strokeStyle = window.penColor;
                currentDrawCtx.lineWidth = window.penSize;
                window.gambarKurvaHalus(currentDrawCtx, window.drawPoints);

                clearTimeout(window.shapeHoldTimer);
                window.shapeHoldTimer = setTimeout(window.recognizeShape, 650);
            }
        } else if (activeTool === 'eraser') {
            currentDrawCtx.lineTo(x, y);
            currentDrawCtx.stroke();
        }
    }
});

document.addEventListener('pointerup', function() {
    if (!window.isDrawingMode) return;

    if (window.draggingSmartVertex !== undefined) {
        window.draggingSmartVertex = undefined;
        return;
    }

    if (!isPenDown) return;
    isPenDown = false;
    clearTimeout(window.shapeHoldTimer);
    if (isFloating) return;

    if (activeTool === 'laser' && currentLaserStroke) {
        laserLastActiveTime = Date.now();
        currentLaserStroke = null;
    } else if ((activeTool === 'lasso' || activeTool === 'lasso-box') && currentDrawCtx && lassoPath.length > 0) {
        currentDrawCtx.putImageData(lassoSavedImageData, 0, 0);

        if (activeTool === 'lasso-box' && lassoPath[1]) {
            let sx = lassoPath[0].x, sy = lassoPath[0].y;
            let ex = lassoPath[1].x, ey = lassoPath[1].y;
            lassoPath = [
                { x: sx, y: sy }, { x: ex, y: sy }, { x: ex, y: ey }, { x: sx, y: ey }
            ];
        }

        if (lassoPath.length > 2) {
            createFloatingLasso(currentDrawCtx.canvas);
        }
    } else if (activeTool !== 'laser' && activeTool !== 'lasso' && activeTool !== 'lasso-box' && currentDrawCtx) {
        if (window.isShapeRecognized && window.activeSmartShape) {
            // Menunggu pengguna selesai menggeser titik Smart Shape
        } else {
            currentDrawCtx.globalCompositeOperation = 'source-over';
            let dataToSave = currentDrawCtx.canvas.toDataURL("image/png");
            window.simpanDataDrawingTarget(currentDrawCtx.canvas, dataToSave);

            let st = document.getElementById('save-status-bar');
            if (st) st.innerHTML = "<span style='color:#e67e22;'>✍️ Saving Draw...</span>";
            if (window.simpanKeDB) window.simpanKeDB();
        }
    }
    if (activeTool !== 'laser' && !window.activeSmartShape) currentDrawCtx = null;
});

// =========================================================================
// 5. FITUR LASO PRO RETINA (BAWA CORETAN + GAMBAR, COPY, PASTE 1:1, WARNA)
// =========================================================================
window.lassoAttachedFloats = [];
window.lassoClipboardImages = [];

window.titikDalamPoligon = function(px, py, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        let xi = poly[i].x, yi = poly[i].y;
        let xj = poly[j].x, yj = poly[j].y;
        let intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / ((yj - yi) || 0.0001) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

window.buatElemenFloatImgDOM = function(blockIdx, slideIdx, imgIdx, im) {
    let div = document.createElement('div');
    div.className = 'draw-float-img-item';
    div.setAttribute('data-float-idx', imgIdx);
    div.style.left = (im.xPct || 10) + '%';
    div.style.top = (im.yPct || 10) + '%';
    div.style.width = (im.wPct || 28) + '%';
    div.style.height = (im.hPct || 28) + '%';
    div.setAttribute('onpointerdown', 'window.mulaiDragFloatImg(event, ' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ', this)');
    div.innerHTML =
        '<button type="button" class="draw-float-img-crop" onpointerdown="event.stopPropagation()" onclick="window.cropFloatImg(' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ')" title="Crop Gambar (Kotak / Freehand)">✂️</button>' +
        '<button type="button" class="draw-float-img-del" onpointerdown="event.stopPropagation()" onclick="window.hapusFloatImg(' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ')">✕</button>' +
        '<img src="' + im.src + '" alt="Gambar Tempel">' +
        '<div class="draw-float-img-resize" onpointerdown="window.mulaiResizeFloatImg(event, ' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ', this.parentElement)"></div>';
    return div;
};

window.sinkronPosisiGambarLaso = function() {
    if (!floatUI || !lassoTargetCanvas || !window.lassoAttachedFloats.length) return;
    let fR = floatUI.getBoundingClientRect();
    let pt = window.ambilKoordinatKanvas(lassoTargetCanvas, fR.left, fR.top);
    let dpr = parseFloat(lassoTargetCanvas.getAttribute('data-dpr')) || window.DRAW_DPR || 2.5;
    let cssW = parseFloat(lassoTargetCanvas.getAttribute('data-css-w')) || (lassoTargetCanvas.width / dpr) || 1;
    let cssH = parseFloat(lassoTargetCanvas.getAttribute('data-css-h')) || (lassoTargetCanvas.height / dpr) || 1;

    let boxX = pt.x;
    let boxY = pt.y;
    let boxW = fR.width * pt.scaleX;
    let boxH = fR.height * pt.scaleY;

    window.lassoAttachedFloats.forEach(function(item) {
        let nx = boxX + (item.relX * boxW);
        let ny = boxY + (item.relY * boxH);
        let nw = Math.max(12, item.relW * boxW);
        let nh = Math.max(12, item.relH * boxH);

        let xPct = (nx / cssW) * 100;
        let yPct = (ny / cssH) * 100;
        let wPct = (nw / cssW) * 100;
        let hPct = (nh / cssH) * 100;

        item.curXPct = xPct;
        item.curYPct = yPct;
        item.curWPct = wPct;
        item.curHPct = hPct;

        if (item.el) {
            item.el.style.left = xPct.toFixed(2) + '%';
            item.el.style.top = yPct.toFixed(2) + '%';
            item.el.style.width = wPct.toFixed(2) + '%';
            item.el.style.height = hPct.toFixed(2) + '%';
        }
    });
};

function createFloatingLasso(cvs) {
    let dpr = parseFloat(cvs.getAttribute('data-dpr')) || window.DRAW_DPR || 2.5;
    let cssW = parseFloat(cvs.getAttribute('data-css-w')) || (cvs.width / dpr);
    let cssH = parseFloat(cvs.getAttribute('data-css-h')) || (cvs.height / dpr);
    let ctx = window.siapkanKonteksRetina(cvs);

    let miX = cssW, miY = cssH, maX = 0, maY = 0;
    lassoPath.forEach(function(p) {
        if (p.x < miX) miX = p.x;
        if (p.x > maX) maX = p.x;
        if (p.y < miY) miY = p.y;
        if (p.y > maY) maY = p.y;
    });
    let w = Math.round(maX - miX), h = Math.round(maY - miY);
    if (w < 8 || h < 8) return;

    // 1. Cari gambar tempel (.draw-float-img-item) & gambar di dalam materi yang masuk area laso
    let blockIdxAttr = cvs.getAttribute('data-index');
    let slideIdxAttr = cvs.getAttribute('data-slide-index');
    let blockIdx = blockIdxAttr !== null ? parseInt(blockIdxAttr, 10) : -1;
    let slideIdx = slideIdxAttr !== null ? parseInt(slideIdxAttr, 10) : -1;
    let parentEl = cvs.parentElement;
    let capturedFloats = [];

    if (blockIdx >= 0 && parentEl) {
        let arrImages = window.ambilArrayFloatImgTarget(blockIdx, slideIdx);
        let floatLayer = parentEl.querySelector('.draw-float-layer');

        // A. Cek gambar yang ada di dalam .content-block (ubah jadi float di posisi persis sama agar bisa digeser bebas bersama laso)
        let contentBlock = parentEl.querySelector('.content-block');
        if (contentBlock && arrImages && floatLayer) {
            let inlineImgs = Array.from(contentBlock.querySelectorAll('img')).filter(function(im) {
                return !im.classList.contains('pdf-slide-bg') && !im.closest('.draw-float-img-item');
            });
            let adaDipromosikan = false;

            inlineImgs.forEach(function(im) {
                let ir = im.getBoundingClientRect();
                if (ir.width < 4 || ir.height < 4) return;
                let pTL = window.ambilKoordinatKanvas(cvs, ir.left, ir.top);
                let pBR = window.ambilKoordinatKanvas(cvs, ir.right, ir.bottom);
                let ix = pTL.x, iy = pTL.y, iw = pBR.x - pTL.x, ih = pBR.y - pTL.y;
                let cx = ix + iw / 2, cy = iy + ih / 2;

                let ovW = Math.max(0, Math.min(maX, ix + iw) - Math.max(miX, ix));
                let ovH = Math.max(0, Math.min(maY, iy + ih) - Math.max(miY, iy));
                let overlapRatio = (ovW * ovH) / Math.max(1, iw * ih);

                if (window.titikDalamPoligon(cx, cy, lassoPath) || overlapRatio >= 0.35) {
                    let newImObj = {
                        src: im.src,
                        xPct: ((ix / cssW) * 100).toFixed(2),
                        yPct: ((iy / cssH) * 100).toFixed(2),
                        wPct: ((iw / cssW) * 100).toFixed(2),
                        hPct: ((ih / cssH) * 100).toFixed(2)
                    };
                    let newIdx = arrImages.length;
                    arrImages.push(newImObj);
                    let newEl = window.buatElemenFloatImgDOM(blockIdx, slideIdx, newIdx, newImObj);
                    floatLayer.appendChild(newEl);
                    im.remove();
                    adaDipromosikan = true;
                }
            });

            if (adaDipromosikan && window.contentBlocksData[blockIdx]) {
                window.contentBlocksData[blockIdx].html = contentBlock.innerHTML;
            }
        }

        // B. Cek seluruh .draw-float-img-item pada blok/slide ini
        if (arrImages && floatLayer) {
            let floatEls = Array.from(floatLayer.querySelectorAll('.draw-float-img-item'));
            floatEls.forEach(function(el, fIdx) {
                let imData = arrImages[fIdx];
                if (!imData) return;
                let fx = (parseFloat(imData.xPct) || 0) / 100 * cssW;
                let fy = (parseFloat(imData.yPct) || 0) / 100 * cssH;
                let fw = (parseFloat(imData.wPct) || 25) / 100 * cssW;
                let fh = (parseFloat(imData.hPct) || 25) / 100 * cssH;
                let cx = fx + fw / 2, cy = fy + fh / 2;

                let ovW = Math.max(0, Math.min(maX, fx + fw) - Math.max(miX, fx));
                let ovH = Math.max(0, Math.min(maY, fy + fh) - Math.max(miY, fy));
                let overlapRatio = (ovW * ovH) / Math.max(1, fw * fh);

                if (window.titikDalamPoligon(cx, cy, lassoPath) || overlapRatio >= 0.35) {
                    capturedFloats.push({
                        blockIdx: blockIdx,
                        slideIdx: slideIdx,
                        imgIdx: fIdx,
                        el: el,
                        dataRef: imData,
                        fx: fx, fy: fy, fw: fw, fh: fh
                    });
                }
            });
        }
    }

    // 2. Perluas kotak seleksi agar mencakup coretan + gambar yang terbawa
    let uMinX = miX, uMinY = miY, uMaxX = maX, uMaxY = maY;
    capturedFloats.forEach(function(cf) {
        if (cf.fx < uMinX) uMinX = cf.fx;
        if (cf.fy < uMinY) uMinY = cf.fy;
        if (cf.fx + cf.fw > uMaxX) uMaxX = cf.fx + cf.fw;
        if (cf.fy + cf.fh > uMaxY) uMaxY = cf.fy + cf.fh;
    });
    let uW = Math.max(8, Math.round(uMaxX - uMinX));
    let uH = Math.max(8, Math.round(uMaxY - uMinY));

    // 3. Potong coretan pena di dalam poligon laso ke kanvas melayang
    let tCvs = document.createElement('canvas');
    tCvs.width = Math.round(uW * dpr);
    tCvs.height = Math.round(uH * dpr);
    tCvs.setAttribute('data-dpr', dpr);
    tCvs.className = 'lasso-float-canvas';

    let tCtx = tCvs.getContext('2d');
    tCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tCtx.imageSmoothingEnabled = true;
    tCtx.imageSmoothingQuality = 'high';
    tCtx.beginPath();
    lassoPath.forEach(function(p, i) {
        if (i === 0) tCtx.moveTo(p.x - uMinX, p.y - uMinY);
        else tCtx.lineTo(p.x - uMinX, p.y - uMinY);
    });
    tCtx.closePath();
    tCtx.clip();
    tCtx.drawImage(cvs, 0, 0, cvs.width, cvs.height, -uMinX, -uMinY, cssW, cssH);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    lassoPath.forEach(function(p, i) {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Hitung koordinat relatif setiap gambar terhadap kotak laso
    let attached = capturedFloats.map(function(cf) {
        cf.el.classList.add('is-lasso-attached');
        return {
            blockIdx: cf.blockIdx,
            slideIdx: cf.slideIdx,
            imgIdx: cf.imgIdx,
            el: cf.el,
            dataRef: cf.dataRef,
            relX: (cf.fx - uMinX) / uW,
            relY: (cf.fy - uMinY) / uH,
            relW: cf.fw / uW,
            relH: cf.fh / uH,
            curXPct: parseFloat(cf.dataRef.xPct) || 0,
            curYPct: parseFloat(cf.dataRef.yPct) || 0,
            curWPct: parseFloat(cf.dataRef.wPct) || 25,
            curHPct: parseFloat(cf.dataRef.hPct) || 25
        };
    });

    window.bangunElemenLassoFloat(cvs, tCvs, uMinX, uMinY, uW, uH, attached);
    lassoPath = [];
}

window.bangunElemenLassoFloat = function(targetCvs, sourceCanvas, localX, localY, w, h, attachedFloatsOpt) {
    stampLasso();
    lassoTargetCanvas = targetCvs;
    window.lassoAttachedFloats = Array.isArray(attachedFloatsOpt) ? attachedFloatsOpt : [];

    floatUI = document.createElement('div');
    floatUI.className = 'lasso-float';
    floatUI.appendChild(sourceCanvas);

    let resizeHandle = document.createElement('div');
    resizeHandle.className = 'lasso-resize-handle';
    resizeHandle.title = 'Tarik untuk mengubah ukuran (Resize)';
    floatUI.appendChild(resizeHandle);

    let btnBar = document.createElement('div');
    btnBar.className = 'lasso-btn-bar';
    btnBar.innerHTML = '<button onclick="window.copySelectionLasso()" title="Salin Coretan &amp; Gambar">📋 Copy</button>' +
        '<button onclick="window.pasteSelectionLasso()" title="Gandakan Coretan &amp; Gambar">📥 Paste</button>' +
        '<label title="Ubah Warna Coretan Laso" style="display:inline-flex; align-items:center; gap:3px; background:#0284c7; color:#ffffff; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer; position:relative; overflow:hidden; margin:0;">' +
            '<span>🎨 Warna</span>' +
            '<input type="color" value="' + (window.penColor || '#e74c3c') + '" style="position:absolute; inset:0; opacity:0; width:100%; height:100%; cursor:pointer;" oninput="window.ubahWarnaSelectionLasso(this.value)" onchange="window.ubahWarnaSelectionLasso(this.value)">' +
        '</label>' +
        '<button onclick="window.hapusSelectionLasso()" style="background:#e74c3c;" title="Hapus Seleksi">🗑️ Hapus</button>' +
        '<button onclick="window.convertLassoToMath()" style="background:#8e44ad;" title="Ubah ke Rumus">∑ Math</button>';
    floatUI.appendChild(btnBar);

    let r = targetCvs.getBoundingClientRect();
    let dpr = parseFloat(targetCvs.getAttribute('data-dpr')) || window.DRAW_DPR || 2.5;
    let cssW = parseFloat(targetCvs.getAttribute('data-css-w')) || (targetCvs.width / dpr) || r.width || 1;
    let cssH = parseFloat(targetCvs.getAttribute('data-css-h')) || (targetCvs.height / dpr) || r.height || 1;
    let invX = r.width / cssW;
    let invY = r.height / cssH;

    floatUI.style.width = (w * invX) + 'px';
    floatUI.style.height = (h * invY) + 'px';
    floatUI.style.left = (r.left + (localX * invX) + window.scrollX) + 'px';
    floatUI.style.top = (r.top + (localY * invY) + window.scrollY) + 'px';

    let isDraggingFloat = false, sX, sY, sL, sT;
    sourceCanvas.addEventListener('pointerdown', function(e) {
        e.stopPropagation(); e.preventDefault();
        isDraggingFloat = true; sX = e.clientX; sY = e.clientY;
        sL = parseFloat(floatUI.style.left) || 0; sT = parseFloat(floatUI.style.top) || 0;
        sourceCanvas.setPointerCapture(e.pointerId);
    });
    sourceCanvas.addEventListener('pointermove', function(e) {
        if (!isDraggingFloat) return; e.stopPropagation(); e.preventDefault();
        floatUI.style.left = (sL + (e.clientX - sX)) + 'px';
        floatUI.style.top = (sT + (e.clientY - sY)) + 'px';
        window.sinkronPosisiGambarLaso();
    });
    sourceCanvas.addEventListener('pointerup', function(e) {
        if (!isDraggingFloat) return; isDraggingFloat = false;
        sourceCanvas.releasePointerCapture(e.pointerId);
        window.sinkronPosisiGambarLaso();
        e.stopPropagation(); e.preventDefault();
    });

    let isResizingLasso = false, rSX, rSY, rSW, rSH;
    resizeHandle.addEventListener('pointerdown', function(e) {
        e.stopPropagation(); e.preventDefault();
        isResizingLasso = true; rSX = e.clientX; rSY = e.clientY;
        rSW = parseFloat(floatUI.style.width) || (w * invX);
        rSH = parseFloat(floatUI.style.height) || (h * invY);
        resizeHandle.setPointerCapture(e.pointerId);
    });
    resizeHandle.addEventListener('pointermove', function(e) {
        if (!isResizingLasso) return; e.stopPropagation(); e.preventDefault();
        let newW = Math.max(25, rSW + (e.clientX - rSX));
        let newH = Math.max(25, rSH + (e.clientY - rSY));
        floatUI.style.width = newW + 'px';
        floatUI.style.height = newH + 'px';
        window.sinkronPosisiGambarLaso();
    });
    resizeHandle.addEventListener('pointerup', function(e) {
        if (!isResizingLasso) return;
        isResizingLasso = false;
        resizeHandle.releasePointerCapture(e.pointerId);
        window.sinkronPosisiGambarLaso();
        e.stopPropagation(); e.preventDefault();
    });

    document.body.appendChild(floatUI);
    isFloating = true;
};

window.ubahWarnaSelectionLasso = function(hexColor) {
    if (!isFloating || !floatUI || !hexColor) return;
    let cvs = floatUI.querySelector('canvas');
    if (!cvs) return;
    let ctx = cvs.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.restore();
};

window.copySelectionLasso = function() {
    if (!isFloating || !floatUI || !lassoTargetCanvas) return;
    let cvs = floatUI.querySelector('canvas');
    if (cvs) {
        let fR = floatUI.getBoundingClientRect();
        let pt = window.ambilKoordinatKanvas(lassoTargetCanvas, fR.left, fR.top);
        let dpr = parseFloat(lassoTargetCanvas.getAttribute('data-dpr')) || window.DRAW_DPR || 2.5;

        window.lassoClipboardDataUrl = cvs.toDataURL('image/png');
        window.lassoClipboardW = fR.width * pt.scaleX;
        window.lassoClipboardH = fR.height * pt.scaleY;
        window.lassoClipboardX = pt.x;
        window.lassoClipboardY = pt.y;
        window.lassoClipboardDpr = dpr;
        window.lassoClipboardImages = (window.lassoAttachedFloats || []).map(function(it) {
            return { src: it.dataRef.src, relX: it.relX, relY: it.relY, relW: it.relW, relH: it.relH };
        });

        let st = document.getElementById('save-status-bar');
        if (st) st.innerHTML = "<span style='color:#2ecc71;'>📋 Seleksi Laso Disalin!</span>";
    }
};

window.duplikatGambarClipboardLasoKeKanvas = function(targetCvs, pasteX, pasteY, pasteW, pasteH) {
    if (!Array.isArray(window.lassoClipboardImages) || window.lassoClipboardImages.length === 0) return [];
    let bAttr = targetCvs.getAttribute('data-index');
    let sAttr = targetCvs.getAttribute('data-slide-index');
    let blockIdx = bAttr !== null ? parseInt(bAttr, 10) : -1;
    let slideIdx = sAttr !== null ? parseInt(sAttr, 10) : -1;
    let parentEl = targetCvs.parentElement;
    let floatLayer = parentEl ? parentEl.querySelector('.draw-float-layer') : null;
    if (blockIdx < 0 || !floatLayer) return [];

    let arrImages = window.ambilArrayFloatImgTarget(blockIdx, slideIdx);
    if (!arrImages) return [];

    let dpr = parseFloat(targetCvs.getAttribute('data-dpr')) || window.DRAW_DPR || 2.5;
    let cssW = parseFloat(targetCvs.getAttribute('data-css-w')) || (targetCvs.width / dpr) || 1;
    let cssH = parseFloat(targetCvs.getAttribute('data-css-h')) || (targetCvs.height / dpr) || 1;

    let attachedBaru = [];
    window.lassoClipboardImages.forEach(function(ci) {
        let nx = pasteX + (ci.relX * pasteW);
        let ny = pasteY + (ci.relY * pasteH);
        let nw = Math.max(12, ci.relW * pasteW);
        let nh = Math.max(12, ci.relH * pasteH);
        let imObj = {
            src: ci.src,
            xPct: ((nx / cssW) * 100).toFixed(2),
            yPct: ((ny / cssH) * 100).toFixed(2),
            wPct: ((nw / cssW) * 100).toFixed(2),
            hPct: ((nh / cssH) * 100).toFixed(2)
        };
        let newIdx = arrImages.length;
        arrImages.push(imObj);
        let newEl = window.buatElemenFloatImgDOM(blockIdx, slideIdx, newIdx, imObj);
        newEl.classList.add('is-lasso-attached');
        floatLayer.appendChild(newEl);

        attachedBaru.push({
            blockIdx: blockIdx,
            slideIdx: slideIdx,
            imgIdx: newIdx,
            el: newEl,
            dataRef: imObj,
            relX: ci.relX, relY: ci.relY, relW: ci.relW, relH: ci.relH,
            curXPct: parseFloat(imObj.xPct),
            curYPct: parseFloat(imObj.yPct),
            curWPct: parseFloat(imObj.wPct),
            curHPct: parseFloat(imObj.hPct)
        });
    });
    return attachedBaru;
};

window.pasteSelectionLasso = function() {
    if (isFloating && floatUI) {
        window.copySelectionLasso();
    }
    if (!window.lassoClipboardDataUrl || !lassoTargetCanvas) return;
    let targetCvs = lassoTargetCanvas;
    stampLasso();

    let img = new Image();
    img.onload = function() {
        let newCvs = document.createElement('canvas');
        newCvs.width = img.width;
        newCvs.height = img.height;
        newCvs.className = 'lasso-float-canvas';
        let nCtx = newCvs.getContext('2d');
        nCtx.imageSmoothingEnabled = true;
        nCtx.imageSmoothingQuality = 'high';
        nCtx.drawImage(img, 0, 0);

        let dpr = parseFloat(targetCvs.getAttribute('data-dpr')) || window.DRAW_DPR || 2.5;
        let cssW = parseFloat(targetCvs.getAttribute('data-css-w')) || (targetCvs.width / dpr) || targetCvs.getBoundingClientRect().width;
        let cssH = parseFloat(targetCvs.getAttribute('data-css-h')) || (targetCvs.height / dpr) || targetCvs.getBoundingClientRect().height;
        let clipDpr = window.lassoClipboardDpr || dpr;

        let pasteW = window.lassoClipboardW || (img.width / clipDpr);
        let pasteH = window.lassoClipboardH || (img.height / clipDpr);
        let pasteX = (typeof window.lassoClipboardX === 'number') ? (window.lassoClipboardX + 18) : 40;
        let pasteY = (typeof window.lassoClipboardY === 'number') ? (window.lassoClipboardY + 18) : 40;
        pasteX = Math.max(8, Math.min(Math.max(8, cssW - pasteW), pasteX));
        pasteY = Math.max(8, Math.min(Math.max(8, cssH - pasteH), pasteY));

        window.lassoClipboardX = pasteX;
        window.lassoClipboardY = pasteY;
        let attachedPaste = window.duplikatGambarClipboardLasoKeKanvas(targetCvs, pasteX, pasteY, pasteW, pasteH);
        window.bangunElemenLassoFloat(targetCvs, newCvs, pasteX, pasteY, pasteW, pasteH, attachedPaste);
    };
    img.src = window.lassoClipboardDataUrl;
};

window.pasteHasilLasoDiTitik = function() {
    window.tutupMenuKonteksDraw();
    if (!window.lassoClipboardDataUrl || !window.drawContextTarget || !window.drawContextTarget.cvs) return;
    let t = window.drawContextTarget;
    let img = new Image();
    img.onload = function() {
        let newCvs = document.createElement('canvas');
        newCvs.width = img.width;
        newCvs.height = img.height;
        newCvs.className = 'lasso-float-canvas';
        let nCtx = newCvs.getContext('2d');
        nCtx.imageSmoothingEnabled = true;
        nCtx.imageSmoothingQuality = 'high';
        nCtx.drawImage(img, 0, 0);

        let dpr = parseFloat(t.cvs.getAttribute('data-dpr')) || window.DRAW_DPR || 2.5;
        let cssW = parseFloat(t.cvs.getAttribute('data-css-w')) || (t.cvs.width / dpr) || t.cvs.getBoundingClientRect().width;
        let cssH = parseFloat(t.cvs.getAttribute('data-css-h')) || (t.cvs.height / dpr) || t.cvs.getBoundingClientRect().height;
        let clipDpr = window.lassoClipboardDpr || dpr;

        let pasteW = window.lassoClipboardW || (img.width / clipDpr);
        let pasteH = window.lassoClipboardH || (img.height / clipDpr);
        let lx = (t.xPct / 100) * cssW;
        let ly = (t.yPct / 100) * cssH;

        let attachedPaste = window.duplikatGambarClipboardLasoKeKanvas(t.cvs, lx, ly, pasteW, pasteH);
        window.bangunElemenLassoFloat(t.cvs, newCvs, lx, ly, pasteW, pasteH, attachedPaste);
    };
    img.src = window.lassoClipboardDataUrl;
};

window.hapusSelectionLasso = function() {
    if (!isFloating || !floatUI) return;
    floatUI.remove();
    floatUI = null;
    isFloating = false;

    let adaGambarDihapus = false;
    if (window.lassoAttachedFloats && window.lassoAttachedFloats.length > 0) {
        let byTarget = {};
        window.lassoAttachedFloats.forEach(function(it) {
            if (it.el && it.el.parentNode) it.el.remove();
            let key = it.blockIdx + ':' + it.slideIdx;
            if (!byTarget[key]) byTarget[key] = { b: it.blockIdx, s: it.slideIdx, refs: [] };
            byTarget[key].refs.push(it.dataRef);
        });
        Object.values(byTarget).forEach(function(g) {
            let arr = window.ambilArrayFloatImgTarget(g.b, g.s);
            if (arr) {
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (g.refs.indexOf(arr[i]) !== -1) arr.splice(i, 1);
                }
                adaGambarDihapus = true;
            }
        });
        window.lassoAttachedFloats = [];
    }

    if (lassoTargetCanvas) {
        window.simpanDataDrawingTarget(lassoTargetCanvas, lassoTargetCanvas.toDataURL('image/png'));
        if (adaGambarDihapus && typeof window.renderBlocks === 'function') window.renderBlocks();
        if (window.simpanKeDB) window.simpanKeDB();
    }
};

function stampLasso() {
    if (!isFloating || !floatUI || !lassoTargetCanvas) return;
    window.sinkronPosisiGambarLaso();

    let ctx = window.siapkanKonteksRetina(lassoTargetCanvas);
    let fR = floatUI.getBoundingClientRect();
    let ptTopLeft = window.ambilKoordinatKanvas(lassoTargetCanvas, fR.left, fR.top);
    let drawW = fR.width * ptTopLeft.scaleX;
    let drawH = fR.height * ptTopLeft.scaleY;

    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(floatUI.querySelector('canvas'), ptTopLeft.x, ptTopLeft.y, drawW, drawH);

    if (window.lassoAttachedFloats && window.lassoAttachedFloats.length > 0) {
        window.lassoAttachedFloats.forEach(function(it) {
            if (it.el) it.el.classList.remove('is-lasso-attached');
            if (it.dataRef) {
                it.dataRef.xPct = Number(it.curXPct).toFixed(2);
                it.dataRef.yPct = Number(it.curYPct).toFixed(2);
                it.dataRef.wPct = Number(it.curWPct).toFixed(2);
                it.dataRef.hPct = Number(it.curHPct).toFixed(2);
            }
        });
        window.lassoAttachedFloats = [];
    }

    floatUI.remove();
    floatUI = null;
    isFloating = false;

    window.simpanDataDrawingTarget(lassoTargetCanvas, lassoTargetCanvas.toDataURL('image/png'));
    if (window.simpanKeDB) window.simpanKeDB();
}

window.convertLassoToMath = function() {
    if (!isFloating || !floatUI) return;
    let dummyMath = "$$ E = mc^2 $$<br>$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$";
    floatUI.remove();
    floatUI = null;
    isFloating = false;
    let blockIdx = lassoTargetCanvas.getAttribute('data-index');
    if (blockIdx !== null && window.contentBlocksData[blockIdx] && window.contentBlocksData[blockIdx].type !== 'pdf_slides') {
        window.contentBlocksData[blockIdx].html += '<div style="position:relative; margin-top:20px; color:#2c3e50; font-weight:bold;"><b>AI Math Detected:</b><br>' + dummyMath + '</div>';
        window.simpanDataDrawingTarget(lassoTargetCanvas, lassoTargetCanvas.toDataURL('image/png'));
    }
    if (window.simpanKeDB) window.simpanKeDB();
    window.toggleDrawingMode();
    if (window.renderMathJax) setTimeout(window.renderMathJax, 500);
};

// =========================================================================
// 6. GAMBAR BEBAS GESER (DRAGGABLE & RESIZABLE STICKER DI ATAS BLOK / PDF)
// =========================================================================
window.renderFloatImagesHTML = function(blockIdx, slideIdx, arrImages) {
    if (!Array.isArray(arrImages) || arrImages.length === 0) return "";
    let html = "";
    arrImages.forEach(function(im, imgIdx) {
        html += '<div class="draw-float-img-item" style="left:' + (im.xPct || 10) + '%; top:' + (im.yPct || 10) + '%; width:' + (im.wPct || 28) + '%; height:' + (im.hPct || 28) + '%;" onpointerdown="window.mulaiDragFloatImg(event, ' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ', this)">' +
            '<button type="button" class="draw-float-img-crop" onpointerdown="event.stopPropagation()" onclick="window.cropFloatImg(' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ')" title="Crop Gambar (Kotak / Freehand)">✂️</button>' +
            '<button type="button" class="draw-float-img-del" onpointerdown="event.stopPropagation()" onclick="window.hapusFloatImg(' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ')">✕</button>' +
            '<img src="' + im.src + '" alt="Gambar Tempel">' +
            '<div class="draw-float-img-resize" onpointerdown="window.mulaiResizeFloatImg(event, ' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ', this.parentElement)"></div>' +
        '</div>';
    });
    return html;
};

window.cropFloatImg = function(blockIdx, slideIdx, imgIdx) {
    let arr = window.ambilArrayFloatImgTarget(blockIdx, slideIdx);
    if (!arr || !arr[imgIdx] || typeof window.bukaModalCropGambar !== 'function') return;
    let item = arr[imgIdx];

    window.bukaModalCropGambar(item.src, function(res) {
        if (!res || !res.dataUrl) return;
        let oldW = parseFloat(item.wPct) || 25;
        let oldH = parseFloat(item.hPct) || 25;
        let ratioW = res.width / Math.max(1, res.origWidth || res.width);
        let ratioH = res.height / Math.max(1, res.origHeight || res.height);

        item.src = res.finalUrl || res.dataUrl;
        item.wPct = Math.max(6, Math.min(95, oldW * ratioW)).toFixed(2);
        item.hPct = Math.max(6, Math.min(95, oldH * ratioH)).toFixed(2);
        window.renderBlocks();
        if (window.simpanKeDB) window.simpanKeDB();
    });
};

window.ambilArrayFloatImgTarget = function(blockIdx, slideIdx) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok) return null;
    if (blok.type === 'pdf_slides' && slideIdx >= 0 && blok.slides && blok.slides[slideIdx]) {
        if (!blok.slides[slideIdx].floatImages) blok.slides[slideIdx].floatImages = [];
        return blok.slides[slideIdx].floatImages;
    }
    if (!blok.floatImages) blok.floatImages = [];
    return blok.floatImages;
};

window.tambahkanGambarBebasKeTarget = function(dataUrl) {
    let t = window.drawContextTarget;
    if (!t || isNaN(t.blockIdx)) {
        t = { blockIdx: 0, slideIdx: -1, xPct: 15, yPct: 15 };
    }
    let arr = window.ambilArrayFloatImgTarget(t.blockIdx, t.slideIdx);
    if (!arr) return;
    arr.push({
        src: dataUrl,
        xPct: t.xPct || 15,
        yPct: t.yPct || 15,
        wPct: 30,
        hPct: 30
    });
    window.renderBlocks();
    if (window.simpanKeDB) window.simpanKeDB();
};

window.pasteGambarDariClipboardDraw = async function() {
    window.tutupMenuKonteksDraw();
    try {
        if (navigator.clipboard && navigator.clipboard.read) {
            let items = await navigator.clipboard.read();
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let imgType = item.types.find(function(type) { return type.indexOf('image/') === 0; });
                if (imgType) {
                    let blob = await item.getType(imgType);
                    window.kompresGambar(blob, function(dataUrl) {
                        window.tambahkanGambarBebasKeTarget(dataUrl);
                    });
                    return;
                }
            }
        }
        document.getElementById('draw-float-img-input').click();
    } catch (e) {
        document.getElementById('draw-float-img-input').click();
    }
};

window.pilihGambarDariDeviceDraw = function() {
    window.tutupMenuKonteksDraw();
    document.getElementById('draw-float-img-input').click();
};

window.prosesFileGambarDraw = function(input) {
    let f = input.files && input.files[0];
    if (!f) return;
    window.kompresGambar(f, function(dataUrl) {
        window.tambahkanGambarBebasKeTarget(dataUrl);
    });
    input.value = "";
};

window.mulaiDragFloatImg = function(e, blockIdx, slideIdx, imgIdx, el) {
    if (e.target.classList.contains('draw-float-img-del') || e.target.classList.contains('draw-float-img-crop') || e.target.classList.contains('draw-float-img-resize')) return;  
    e.stopPropagation(); e.preventDefault();
    let parentLayer = el.parentElement;
    let pRect = parentLayer.getBoundingClientRect();
    let startX = e.clientX, startY = e.clientY;
    let arr = window.ambilArrayFloatImgTarget(blockIdx, slideIdx);
    if (!arr || !arr[imgIdx]) return;
    let initXPct = parseFloat(arr[imgIdx].xPct) || 0;
    let initYPct = parseFloat(arr[imgIdx].yPct) || 0;

    el.setPointerCapture(e.pointerId);
    function move(ev) {
        let dxPct = ((ev.clientX - startX) / pRect.width) * 100;
        let dyPct = ((ev.clientY - startY) / pRect.height) * 100;
        arr[imgIdx].xPct = Math.max(0, Math.min(92, initXPct + dxPct)).toFixed(2);
        arr[imgIdx].yPct = Math.max(0, Math.min(92, initYPct + dyPct)).toFixed(2);
        el.style.left = arr[imgIdx].xPct + '%';
        el.style.top = arr[imgIdx].yPct + '%';
    }
    function up(ev) {
        el.releasePointerCapture(e.pointerId);
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        if (window.simpanKeDB) window.simpanKeDB();
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
};

window.mulaiResizeFloatImg = function(e, blockIdx, slideIdx, imgIdx, el) {
    e.stopPropagation(); e.preventDefault();
    let parentLayer = el.parentElement;
    let pRect = parentLayer.getBoundingClientRect();
    let startX = e.clientX;
    let arr = window.ambilArrayFloatImgTarget(blockIdx, slideIdx);
    if (!arr || !arr[imgIdx]) return;
    let initWPct = parseFloat(arr[imgIdx].wPct) || 25;
    let initHPct = parseFloat(arr[imgIdx].hPct) || 25;
    let aspectRatio = initHPct / (initWPct || 1);

    e.target.setPointerCapture(e.pointerId);
    function move(ev) {
        let dwPct = ((ev.clientX - startX) / pRect.width) * 100;
        let nextWPct = Math.max(5, Math.min(95, initWPct + dwPct));
        let nextHPct = Math.max(5, Math.min(95, nextWPct * aspectRatio));
        arr[imgIdx].wPct = nextWPct.toFixed(2);
        arr[imgIdx].hPct = nextHPct.toFixed(2);
        el.style.width = arr[imgIdx].wPct + '%';
        el.style.height = arr[imgIdx].hPct + '%';
    }
    function up(ev) {
        e.target.releasePointerCapture(e.pointerId);
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        if (window.simpanKeDB) window.simpanKeDB();
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
};

window.hapusFloatImg = function(blockIdx, slideIdx, imgIdx) {
    let arr = window.ambilArrayFloatImgTarget(blockIdx, slideIdx);
    if (!arr) return;
    arr.splice(imgIdx, 1);
    window.renderBlocks();
    if (window.simpanKeDB) window.simpanKeDB();
};