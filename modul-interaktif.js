/* =========================================================================
   ENGINE MODUL VISUAL INTERAKTIF V12
   - Kapsul Horizontal 1 Baris Rapi (Anti-Enter & Anti-Kotak Menumpuk ke Bawah)
   - Smooth Zoom In/Out (Sensitivitas Trackpad Halus 1-2% & Tombol Step 10%)
   - Free Drag & Drop Semua Balok + Garis SVG Elastis Mengikuti Balok Secara Live
   - Tombol [+] Sub-Informasi Tak Terbatas & Panel Eksperimen Kompak Anti-Tumpuk
   ========================================================================= */

window.viTargetEditElement = null;
window.viTargetEditBlockIndex = -1;
window.viPromptGenState = {
    mapel: "Biologi",
    visual: "peta_konsep"
};

(function pasangCSSBlokKhususVI() {
    let oldSt = document.getElementById("vi-standalone-block-styles");
    if (oldSt) oldSt.remove();

    let st = document.createElement("style");
    st.id = "vi-standalone-block-styles";
    st.innerHTML =
        ".content-block.vi-dedicated-block," +
        ".mode-edit-aktif .content-block.vi-dedicated-block," +
        ".force-edit-mode .content-block.vi-dedicated-block {" +
        "  padding: 0 !important; background: transparent !important; background-image: none !important;" +
        "  border: none !important; box-shadow: none !important; min-height: 0 !important;" +
        "  outline: none !important; cursor: default !important; user-select: none !important;" +
        "}" +
        ".a4-paper-wrapper.dynamic-block-shell.vi-shell-mobile," +
        ".content-block.vi-dedicated-block.vi-shell-mobile {" +
        "  max-width: 410px !important; width: 100% !important; margin: 0 auto !important; transition: none !important;" +
        "}" +
        ".a4-paper-wrapper.dynamic-block-shell.vi-shell-canvas," +
        ".content-block.vi-dedicated-block.vi-shell-canvas {" +
        "  max-width: 1040px !important; width: 100% !important; margin: 0 auto !important; transition: none !important;" +
        "}" +
        ".vi-external-edit-bar {" +
        "  display: none; background: #16a34a; color: #ffffff; font-size: 11px; font-weight: 700;" +
        "  padding: 6px 14px; text-align: center; border-bottom: 1px solid #86efac; letter-spacing: 0.2px;" +
        "}" +
        ".modul-interaktif-card[data-vi-text-edit='true'] .vi-external-edit-bar {" +
        "  display: block;" +
        "}" +
        "@media (max-width: 768px) {" +
        "  #blocks-container:has(.vi-dedicated-block) { padding-left: 4px !important; padding-right: 4px !important; }" +
        "  .a4-paper-wrapper.dynamic-block-shell.vi-shell-mobile," +
        "  .content-block.vi-dedicated-block.vi-shell-mobile," +
        "  .a4-paper-wrapper.dynamic-block-shell.vi-shell-canvas," +
        "  .content-block.vi-dedicated-block.vi-shell-canvas {" +
        "    max-width: 100% !important; width: 100% !important; margin: 0 auto !important;" +
        "  }" +
        "  .modul-interaktif-card { border-radius: 14px !important; margin: 6px auto !important; }" +
        "}";
    document.head.appendChild(st);
})();

// 1. BUKA MODAL UNTUK MENYISIPKAN MODUL BARU KE CONTENT BLOCK TERPISAH
window.sisipkanModulInteraktif = function() {
    window.viTargetEditElement = null;
    window.viTargetEditBlockIndex = -1;

    let inpJudul = document.getElementById("vi-input-judul");
    let inpHtml = document.getElementById("vi-input-html");
    let inpCss = document.getElementById("vi-input-css");
    let prevCont = document.getElementById("vi-preview-container");
    let btnSimpan = document.getElementById("btn-simpan-modul-vi");

    if (inpJudul) inpJudul.value = "";
    if (inpHtml) inpHtml.value = "";
    if (inpCss) inpCss.value = "";
    if (prevCont) prevCont.style.display = "none";
    if (btnSimpan) btnSimpan.innerHTML = "💾 Buat Content Block Modul Interaktif Baru";

    let btnPrompt = document.querySelector('[onclick*="salinPromptAIModul"]');
    if (btnPrompt) btnPrompt.innerHTML = "🤖 Buat Prompt AI (Generator)";
    let btnDemo = document.querySelector('[onclick*="isiContohModulInteraktif"]');
    if (btnDemo) btnDemo.innerHTML = "✨ Contoh Fisiologi (Aliran Darah 60FPS)";

    window.bukaModal("modal-modul-interaktif");
};

// 2. EDIT KODE MENTAH MODUL INTERAKTIF DI MODAL
window.editModulInteraktif = function(btnEl) {
    let card = btnEl ? btnEl.closest(".modul-interaktif-card") : null;
    if (!card) return;

    window.viTargetEditElement = card;
    let parentBlok = card.closest(".content-block");
    window.viTargetEditBlockIndex = parentBlok ? parseInt(parentBlok.getAttribute("data-index"), 10) : -1;

    let judulLama = decodeURIComponent(card.getAttribute("data-vi-title") || "Modul Interaktif");
    let kodeLama = decodeURIComponent(card.getAttribute("data-vi-code") || "");

    let inpJudul = document.getElementById("vi-input-judul");
    let inpHtml = document.getElementById("vi-input-html");
    let prevCont = document.getElementById("vi-preview-container");
    let btnSimpan = document.getElementById("btn-simpan-modul-vi");

    if (inpJudul) inpJudul.value = judulLama;
    if (inpHtml) inpHtml.value = kodeLama;
    if (prevCont) prevCont.style.display = "none";
    if (btnSimpan) btnSimpan.innerHTML = "💾 Perbarui Modul Interaktif Ini";

    window.bukaModal("modal-modul-interaktif");
};

// 3. TOGGLE EDIT TEKS & TAMBAH SUB-CABANG LANGSUNG DI LAYAR
window.toggleInlineEditTeksVI = function(btnEl) {
    let card = btnEl ? btnEl.closest(".modul-interaktif-card") : null;
    if (!card) return;
    let iframe = card.querySelector("iframe.vi-capsule-iframe");
    if (!iframe || !iframe.contentWindow) return;

    let isEditing = card.getAttribute("data-vi-text-edit") === "true";
    let nextState = !isEditing;
    card.setAttribute("data-vi-text-edit", String(nextState));

    if (nextState) {
        btnEl.innerHTML = "✅ Selesai Edit";
        btnEl.style.background = "#16a34a";
        btnEl.style.borderColor = "#4ade80";
    } else {
        btnEl.innerHTML = "✍️ Edit Teks";
        btnEl.style.background = "#8e44ad";
        btnEl.style.borderColor = "#c084fc";
    }

    iframe.contentWindow.postMessage({
        type: "MAHARDIKA_VI_SET_TEXT_EDIT",
        enabled: nextState
    }, "*");
};

// 4. HAPUS CONTENT BLOCK MODUL INTERAKTIF
window.hapusModulInteraktif = function(btnEl) {
    let card = btnEl ? btnEl.closest(".modul-interaktif-card") : null;
    if (!card) return;

    let wrapper = card.closest(".block-wrapper");
    let blockIdx = wrapper ? parseInt(wrapper.getAttribute("data-index"), 10) : -1;

    if (blockIdx >= 0 && window.contentBlocksData && window.contentBlocksData.length > 1 && typeof window.hapusBlok === "function") {
        window.hapusBlok(blockIdx);
        return;
    }

    window.tampilkanCustomDialog("confirm", "Hapus modul visual interaktif ini dari halaman?", null, function(isYes) {
        if (!isYes) return;
        let parentBlok = card.closest(".content-block");
        card.remove();
        if (parentBlok) {
            parentBlok.classList.remove("vi-dedicated-block", "vi-shell-mobile", "vi-shell-canvas");
            parentBlok.setAttribute("contenteditable", "true");
            parentBlok.innerHTML = "<p>Ketik materi...</p>";
            parentBlok.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (typeof window.simpanKeDB === "function") window.simpanKeDB();
    });
};

// 5. TOGGLE MODE SKALA (MODE HP PORTRAIT 410x720 vs MODE KANVAS LANDSCAPE 1040x600)
window.toggleModeSkalaModulVI = function(btnEl) {
    let card = btnEl ? btnEl.closest(".modul-interaktif-card") : null;
    if (!card) return;

    let curMode = card.getAttribute("data-vi-scale-mode") || "responsive";
    let nextMode = (curMode === "responsive") ? "canvas" : "responsive";
    card.setAttribute("data-vi-scale-mode", nextMode);

    btnEl.innerHTML = (nextMode === "canvas") ? "📐 Mode Kanvas" : "📱 Mode HP";
    window.sesuaikanSkalaSatuModulVI(card);
};

// 6. KONTROL KECEPATAN ANIMASI UNIVERSAL (0.5x -> 1x -> 2x)
window.ubahKecepatanAnimasiModulVI = function(btnEl) {
    let card = btnEl ? btnEl.closest(".modul-interaktif-card") : null;
    if (!card) return;
    let iframe = card.querySelector("iframe.vi-capsule-iframe");
    if (!iframe || !iframe.contentWindow) return;

    let speeds = [1, 2, 0.5];
    let curSpeed = parseFloat(card.getAttribute("data-vi-speed")) || 1;
    let nextIdx = (speeds.indexOf(curSpeed) + 1) % speeds.length;
    let nextSpeed = speeds[nextIdx];

    card.setAttribute("data-vi-speed", String(nextSpeed));
    btnEl.innerHTML = (nextSpeed === 2 ? "🔥 2x" : (nextSpeed === 0.5 ? "🐢 0.5x" : "⚡ 1x"));

    iframe.contentWindow.postMessage({
        type: "MAHARDIKA_VI_SET_SPEED",
        speed: nextSpeed
    }, "*");
};

// 7. MUAT ULANG / RESET ANIMASI MODUL INTERAKTIF
window.reloadModulInteraktif = function(btnEl) {
    let card = btnEl ? btnEl.closest(".modul-interaktif-card") : null;
    if (!card) return;
    let iframe = card.querySelector("iframe.vi-capsule-iframe");
    if (!iframe) return;

    let judul = decodeURIComponent(card.getAttribute("data-vi-title") || "Modul Interaktif");
    let kode = decodeURIComponent(card.getAttribute("data-vi-code") || "");
    let frameId = iframe.getAttribute("data-vi-frame-id") || ("vi_frame_" + Date.now());
    iframe.setAttribute("data-vi-frame-id", frameId);
    card.setAttribute("data-vi-paused", "false");
    card.setAttribute("data-vi-text-edit", "false");
    card.setAttribute("data-vi-speed", "1");

    let btnPause = card.querySelector(".vi-btn-pause");
    if (btnPause) btnPause.innerHTML = "⏸️ Jeda";
    let btnSpeed = card.querySelector(".vi-btn-speed");
    if (btnSpeed) btnSpeed.innerHTML = "⚡ 1x";
    let btnEditTxt = card.querySelector(".vi-btn-edit-text");
    if (btnEditTxt) {
        btnEditTxt.innerHTML = "✍️ Edit Teks";
        btnEditTxt.style.background = "#8e44ad";
    }

    iframe.onload = function() {
        window.sesuaikanSkalaSatuModulVI(card);
    };
    iframe.srcdoc = window.generateKapsulModul(judul, kode, "", frameId);
};

// 8. GENERATOR KAPSUL IFRAME (ZOOM 10% INSTAN, FREE DRAG TANPA PEMBATAS, & KAPSUL 1 BARIS)
window.generateKapsulModul = function(judul, rawCode, extraCss, frameId) {
    let raw = String(rawCode || "").trim();
    let cssTambahan = String(extraCss || "").trim();
    let idFrame = frameId || ("vi_frame_" + Math.random().toString(36).substring(2, 9));

    let headContent = "";
    let bodyAttrs = "";
    let bodyInner = raw;

    let headMatch = raw.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (headMatch && headMatch[1]) {
        headContent = headMatch[1];
    }

    let bodyMatch = raw.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
        bodyAttrs = bodyMatch[1] || "";
        bodyInner = bodyMatch[2] || "";
    } else if (/<html[\s>]/i.test(raw)) {
        bodyInner = raw
            .replace(/<!DOCTYPE[^>]*>/gi, "")
            .replace(/<\/?html[^>]*>/gi, "")
            .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");
    }

    bodyInner = bodyInner.replace(/\b(const|let)\s+([a-zA-Z0-9_$]+)\s*=\s*(\[|\{)/g, "var $2 = window.$2 = $3");

    let combinedCheck = headContent + " " + bodyAttrs + " " + bodyInner;
    let hasTailwindScript = /tailwindcss\.com/i.test(combinedCheck);
    let usesTailwindClasses = /class\s*=\s*["'][^"']*\b(flex|grid|bg-|text-|p-\d|px-\d|py-\d|rounded-|shadow-|border-|w-\d|h-\d|absolute|relative|inset-|items-center|justify-between)\b/i.test(combinedCheck);
    let autoTailwindTag = (!hasTailwindScript && usesTailwindClasses)
        ? '<script src="https://cdn.tailwindcss.com"><' + '/script>'
        : '';

    let helperCss =
        "<style>" +
        "html, body { -webkit-text-size-adjust: 100%; margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; overflow: hidden !important; }" +
        "#info-panel #info-desc, #info-panel p, #info-panel .vi-editable-subspan { white-space: pre-line; }" +
        "body.vi-anim-paused *, body.vi-anim-paused *::before, body.vi-anim-paused *::after { animation-play-state: paused !important; transition: none !important; }" +
        "/* ===================================================================" +
        "   KAPSUL HORIZONTAL 1 BARIS & MATIKAN TRANSISI POSISI AGAR DRAG BEBAS" +
        "   =================================================================== */" +
        "#nodes-container .truncate, #canvas-area .truncate {" +
        "  overflow: visible !important; text-overflow: clip !important; white-space: nowrap !important; max-width: none !important;" +
        "}" +
        ".concept-node, .vi-node-item, .vi-pill-horizontal, .process-box-node, .food-node-wrapper, .hotspot-wrap {" +
        "  transition: border-color 0.15s, box-shadow 0.15s, opacity 0.15s !important;" +
        "  touch-action: none !important; user-select: none !important; -webkit-user-select: none !important;" +
        "}" +
        ".concept-node, .vi-node-item, .vi-pill-horizontal {" +
        "  display: inline-flex !important; flex-direction: row !important; align-items: center !important;" +
        "  justify-content: center !important; flex-wrap: nowrap !important; white-space: nowrap !important;" +
        "  width: auto !important; max-width: none !important; cursor: grab !important;" +
        "}" +
        ".concept-node:active, .vi-node-item:active, .vi-pill-horizontal:active { cursor: grabbing !important; }" +
        ".concept-node *, .vi-node-item *, .vi-pill-horizontal * { white-space: nowrap !important; }" +
        ".concept-node br, .vi-node-item br, .vi-pill-horizontal br { display: none !important; }" +
        "/* Bebaskan overflow di dalam surface zoom agar balok bisa digeser keluar tanpa tertahan batas! */" +
        "#vi-stage-inner-wrap { position: relative !important; flex: 1 1 0% !important; width: 100% !important; height: auto !important; min-height: 0 !important; overflow: hidden !important; cursor: grab; touch-action: none; }" +
        "#vi-stage-inner-wrap:active { cursor: grabbing; }" +
        "#vi-zoom-pan-surface, #nodes-container, #svg-layer, #vi-custom-svg-layer {" +
        "  position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible !important; transform-origin: center center;" +
        "}" +
        ".vi-docked-control-bar {" +
        "  position: relative !important; bottom: auto !important; top: auto !important; left: auto !important; right: auto !important;" +
        "  transform: none !important; width: 100% !important; max-width: 100% !important; margin: 0 !important;" +
        "  border-radius: 0 !important; border: none !important; border-top: 1px solid #334155 !important;" +
        "  background: rgba(15, 23, 42, 0.98) !important; padding: 6px 10px !important; z-index: 45 !important; flex-shrink: 0 !important;" +
        "  max-height: 110px !important; overflow-y: auto !important; box-shadow: 0 -4px 12px rgba(0,0,0,0.25) !important;" +
        "}" +
        ".vi-docked-control-bar button { padding: 4px 8px !important; font-size: 10.5px !important; min-height: 0 !important; border-radius: 6px !important; }" +
        ".vi-docked-control-bar p, .vi-docked-control-bar span, .vi-docked-control-bar label, .vi-docked-control-bar div { font-size: 10px !important; margin-bottom: 2px !important; }" +
        "/* Tombol Zoom In / Out di Pojok Kanan Bawah Kanvas */" +
        "#vi-canvas-zoom-controls {" +
        "  position: absolute; right: 10px; bottom: 10px; z-index: 90; display: flex; align-items: center; gap: 4px;" +
        "  background: rgba(15, 23, 42, 0.92); border: 1px solid #475569; padding: 3px 6px; border-radius: 20px;" +
        "  box-shadow: 0 4px 12px rgba(0,0,0,0.4); backdrop-filter: blur(6px); user-select: none; pointer-events: auto;" +
        "}" +
        "#vi-canvas-zoom-controls button {" +
        "  background: #1e293b; color: #f8fafc; border: 1px solid #334155; width: 24px; height: 24px; border-radius: 50%;" +
        "  font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; transition: 0.15s;" +
        "}" +
        "#vi-canvas-zoom-controls button:hover { background: #0284c7; border-color: #38bdf8; }" +
        "#vi-canvas-zoom-controls .vi-zoom-pct-btn {" +
        "  width: auto !important; border-radius: 10px !important; padding: 0 8px !important; font-size: 10px !important; color: #38bdf8 !important;" +
        "}" +
        "/* Tombol [+] Tambah Sub-Informasi & [✕] Hapus pada Balok Konsep */" +
        ".vi-node-add-sub-btn, .vi-node-del-btn {" +
        "  display: none; position: absolute; width: 18px; height: 18px; border-radius: 50%; font-size: 11px; font-weight: 900;" +
        "  align-items: center; justify-content: center; cursor: pointer; z-index: 95; padding: 0; line-height: 1;" +
        "  box-shadow: 0 2px 6px rgba(0,0,0,0.5); transition: transform 0.15s; pointer-events: auto;" +
        "}" +
        ".vi-node-add-sub-btn { top: -9px; right: -9px; background: #16a34a; color: #ffffff; border: 1.5px solid #bbf7d0; }" +
        ".vi-node-add-sub-btn:hover { transform: scale(1.22); background: #22c55e; }" +
        ".vi-node-del-btn { top: -9px; left: -9px; background: #dc2626; color: #ffffff; border: 1.5px solid #fecaca; font-size: 9px; }" +
        ".vi-node-del-btn:hover { transform: scale(1.22); }" +
        "body.vi-text-edit-active .vi-node-add-sub-btn," +
        "body.vi-text-edit-active .vi-node-del-btn { display: flex !important; }" +
        "#vi-btn-add-info-card {" +
        "  display: none; margin-top: 8px; width: 100%; background: rgba(22, 163, 74, 0.2); color: #4ade80;" +
        "  border: 1.5px dashed #22c55e; padding: 7px 10px; border-radius: 10px; font-size: 11px; font-weight: 800;" +
        "  cursor: pointer; text-align: center; transition: 0.15s;" +
        "}" +
        "#vi-btn-add-info-card:hover { background: rgba(22, 163, 74, 0.35); color: #ffffff; }" +
        "body.vi-text-edit-active #vi-btn-add-info-card { display: block !important; }" +
        "/* Skala Kepadatan Otomatis */" +
        "#canvas-area.vi-density-normal .concept-node, #canvas-area.vi-density-normal .process-box-node, #canvas-area.vi-density-normal .vi-node-item {" +
        "  font-size: 11px !important; padding: 4px 10px !important; gap: 5px !important;" +
        "}" +
        "#canvas-area.vi-density-medium .concept-node, #canvas-area.vi-density-medium .process-box-node, #canvas-area.vi-density-medium .vi-node-item {" +
        "  font-size: 9.8px !important; padding: 3px 8px !important; gap: 4px !important;" +
        "}" +
        "#canvas-area.vi-density-complex .concept-node, #canvas-area.vi-density-complex .process-box-node, #canvas-area.vi-density-complex .vi-node-item {" +
        "  font-size: 8.8px !important; padding: 2px 6px !important; gap: 3.5px !important;" +
        "  min-width: 0 !important; width: auto !important; max-width: none !important;" +
        "  line-height: 1.15 !important; border-width: 1px !important; border-radius: 6px !important;" +
        "}" +
        "#canvas-area.vi-density-complex .vi-node-item span, #canvas-area.vi-density-complex .concept-node span { font-size: 8.8px !important; line-height: 1.15 !important; }" +
        "#canvas-area.vi-density-complex .vi-node-item > span:first-child, #canvas-area.vi-density-complex .concept-node > span:first-child, #canvas-area.vi-density-complex .vi-node-item > div:first-child {" +
        "  font-size: 7.8px !important; padding: 0.5px 3.5px !important;" +
        "}" +
        "#canvas-area.vi-density-complex > div.absolute.top-4.left-4, #canvas-area.vi-density-complex > div.absolute.top-3.left-3, #canvas-area.vi-density-complex > div.absolute.top-2\\.5.left-2\\.5," +
        "#canvas-area.vi-density-complex #vi-stage-inner-wrap > div.absolute.top-4.left-4, #canvas-area.vi-density-complex #vi-stage-inner-wrap > div.absolute.top-3.left-3, #canvas-area.vi-density-complex #vi-stage-inner-wrap > div.absolute.top-2\\.5.left-2\\.5 {" +
        "  left: 50% !important; top: 4px !important; transform: translateX(-50%) scale(0.76) !important;" +
        "  transform-origin: top center !important; padding: 2px 10px !important; white-space: nowrap !important; opacity: 0.85; z-index: 55 !important;" +
        "}" +
        "/* Layout Mode Kanvas vs Mode HP */" +
        "body:not(.vi-force-mobile-stack) {" +
        "  width: 100% !important; height: 600px !important; max-height: 600px !important;" +
        "  display: flex !important; flex-direction: row !important; overflow: hidden !important;" +
        "}" +
        "body:not(.vi-force-mobile-stack) #canvas-area {" +
        "  flex: 1 1 0% !important; width: auto !important; min-width: 580px !important;" +
        "  height: 600px !important; min-height: 600px !important; max-height: 600px !important;" +
        "  display: flex !important; flex-direction: column !important;" +
        "  border-bottom: none !important; border-right: 1px solid #334155 !important; overflow: hidden !important;" +
        "}" +
        "body:not(.vi-force-mobile-stack) #info-panel {" +
        "  width: 360px !important; min-width: 360px !important; max-width: 360px !important;" +
        "  height: 600px !important; min-height: 600px !important; max-height: 600px !important;" +
        "  flex-shrink: 0 !important; overflow-y: auto !important; overflow-x: hidden !important;" +
        "}" +
        "body.vi-force-mobile-stack {" +
        "  width: 100% !important; height: 720px !important; max-height: 720px !important;" +
        "  display: flex !important; flex-direction: column !important; overflow: hidden !important;" +
        "}" +
        "body.vi-force-mobile-stack #canvas-area {" +
        "  width: 100% !important; min-width: 0 !important; height: 440px !important; min-height: 440px !important; max-height: 440px !important;" +
        "  flex: none !important; display: flex !important; flex-direction: column !important;" +
        "  border-right: none !important; border-bottom: 1px solid #334155 !important; overflow: hidden !important;" +
        "}" +
        "body.vi-force-mobile-stack #info-panel {" +
        "  width: 100% !important; min-width: 0 !important; max-width: 100% !important;" +
        "  height: 280px !important; min-height: 280px !important; max-height: 280px !important;" +
        "  flex: none !important; overflow-y: auto !important; overflow-x: hidden !important;" +
        "}" +
        "body.vi-force-mobile-stack #info-panel > div { padding: 12px 16px !important; min-height: 100% !important; }" +
        "body.vi-force-mobile-stack #info-default { padding: 8px 0 !important; margin: auto 0 !important; }" +
        "body.vi-force-mobile-stack #info-default > div:first-child { width: 42px !important; height: 42px !important; margin-bottom: 6px !important; font-size: 18px !important; }" +
        "body.vi-force-mobile-stack #info-default h1 { font-size: 15px !important; margin-bottom: 2px !important; }" +
        "body.vi-force-mobile-stack #info-default h2 { font-size: 10px !important; margin-bottom: 4px !important; }" +
        "body.vi-force-mobile-stack #info-default p { font-size: 11.5px !important; line-height: 1.4 !important; max-width: 92% !important; margin: 0 auto !important; }" +
        "body.vi-force-mobile-stack #info-active > div:first-child { gap: 10px !important; margin-bottom: 8px !important; padding-bottom: 8px !important; }" +
        "body.vi-force-mobile-stack #info-emoji { width: 40px !important; height: 40px !important; font-size: 20px !important; border-radius: 10px !important; }" +
        "body.vi-force-mobile-stack #info-name { font-size: 15px !important; margin-bottom: 2px !important; line-height: 1.2 !important; }" +
        "body.vi-force-mobile-stack #info-role { font-size: 9px !important; padding: 1.5px 7px !important; }" +
        "body.vi-force-mobile-stack #info-active > div:nth-child(2) { margin-bottom: 8px !important; }" +
        "body.vi-force-mobile-stack #info-active h3 { font-size: 9.5px !important; margin-bottom: 3px !important; }" +
        "body.vi-force-mobile-stack #info-desc { font-size: 11.5px !important; line-height: 1.38 !important; }" +
        "body.vi-force-mobile-stack #info-active .space-y-4, body.vi-force-mobile-stack #info-active .space-y-3, body.vi-force-mobile-stack #info-active .grid {" +
        "  display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; margin-top: auto !important;" +
        "}" +
        "body.vi-force-mobile-stack #info-active .space-y-4 > div, body.vi-force-mobile-stack #info-active .space-y-3 > div, body.vi-force-mobile-stack #info-active .grid > div {" +
        "  margin-top: 0 !important; padding: 8px 10px !important; border-radius: 10px !important;" +
        "}" +
        "body.vi-force-mobile-stack #info-active .grid p, body.vi-force-mobile-stack #info-active .grid div, body.vi-force-mobile-stack #info-active .space-y-4 p, body.vi-force-mobile-stack #info-active .space-y-4 div, body.vi-force-mobile-stack #info-eats, body.vi-force-mobile-stack #info-eaten-by {" +
        "  font-size: 10.5px !important; line-height: 1.3 !important;" +
        "}" +
        "body.vi-force-mobile-stack .food-node-wrapper { width: 42px !important; height: 42px !important; margin-top: -8px !important; }" +
        "body.vi-force-mobile-stack .food-node-wrapper > .food-node > span:first-child { font-size: 18px !important; }" +
        "body.vi-force-mobile-stack .food-node-wrapper > .food-node > span:last-child { bottom: -16px !important; font-size: 8.5px !important; padding: 1px 5px !important; }" +
        "body.vi-force-mobile-stack .process-box-node { padding: 4px 8px !important; font-size: 10px !important; min-width: 92px !important; }" +
        "body.vi-force-mobile-stack .arrow-label-badge { font-size: 8.5px !important; padding: 1px 5px !important; }" +
        "/* Indikator Garis Putus-Putus Biru di Mode Edit Teks */" +
        "body.vi-text-edit-active .vi-editable-target, body.vi-text-edit-active [contenteditable='true'] {" +
        "  outline: 1.5px dashed rgba(56, 189, 248, 0.85) !important; outline-offset: 2px; border-radius: 4px;" +
        "}" +
        "body.vi-text-edit-active .vi-editable-target:hover, body.vi-text-edit-active [contenteditable='true']:hover {" +
        "  outline: 2px dashed #facc15 !important; background: rgba(250, 204, 21, 0.14) !important;" +
        "}" +
        "body.vi-text-edit-active [contenteditable='true']:focus {" +
        "  outline: 2px solid #22c55e !important; background: rgba(15, 23, 42, 0.94) !important; color: #ffffff !important; cursor: text !important;" +
        "}" +
        (cssTambahan ? ("\n" + cssTambahan) : "") +
        "</" + "style>";

    let preScript =
        "<" + "script>" +
        "(function() {" +
        "  window.__viAnimPaused = false;" +
        "  window.__viAnimSpeed = 1.0;" +
        "  var origPerfNow = performance.now.bind(performance);" +
        "  var virtualTime = origPerfNow();" +
        "  var lastRealTime = origPerfNow();" +
        "  performance.now = function() {" +
        "    var now = origPerfNow();" +
        "    var dt = now - lastRealTime;" +
        "    lastRealTime = now;" +
        "    if (!window.__viAnimPaused) {" +
        "      virtualTime += dt * (window.__viAnimSpeed || 1.0);" +
        "    }" +
        "    return virtualTime;" +
        "  };" +
        "  var origRAF = window.requestAnimationFrame.bind(window);" +
        "  window.requestAnimationFrame = function(cb) {" +
        "    return origRAF(function() {" +
        "      if (window.__viAnimPaused) {" +
        "        setTimeout(function() { window.requestAnimationFrame(cb); }, 100);" +
        "        return;" +
        "      }" +
        "      cb(performance.now());" +
        "    });" +
        "  };" +
        "})();" +
        "<" + "/script>";

let runtimeScript =
        "<" + "script>" +
        "(function() {" +
        "  var FRAME_ID = '" + idFrame + "';" +
        "  /* MESIN RENDER ATLAS 2D TERKUNCI PAS DENGAN WADAH HOTSPOT (#vi-atlas-sync-box) */" +
        "  function pasangGambarKeSurfaceAtlas(validUrl) {" +
        "    if (!validUrl) return;" +
        "    siapkanKameraZoomDanDocking();" +
        "    var zoomSurf = document.getElementById('vi-zoom-pan-surface');" +
        "    if (!zoomSurf) return;" +
        "    zoomSurf.style.display = 'flex';" +
        "    zoomSurf.style.alignItems = 'center';" +
        "    zoomSurf.style.justifyContent = 'center';" +
        "    var syncBox = document.getElementById('vi-atlas-sync-box');" +
        "    if (!syncBox) {" +
        "      syncBox = document.createElement('div');" +
        "      syncBox.id = 'vi-atlas-sync-box';" +
        "      syncBox.style.cssText = 'position:relative; display:inline-block; max-width:92%; max-height:88%; line-height:0; border-radius:14px; background:rgba(248,250,252,0.97); padding:8px; box-shadow:0 10px 30px rgba(0,0,0,0.45);';" +
        "      zoomSurf.insertBefore(syncBox, zoomSurf.firstChild);" +
        "    }" +
        "    var img = document.getElementById('vi-atlas-bg-img');" +
        "    if (!img) {" +
        "      img = document.createElement('img');" +
        "      img.id = 'vi-atlas-bg-img';" +
        "      img.setAttribute('referrerpolicy', 'no-referrer');" +
        "      img.style.cssText = 'display:block; max-width:100%; max-height:370px; width:auto; height:auto; object-fit:contain; border-radius:10px; user-select:none; pointer-events:none;';" +
        "      syncBox.insertBefore(img, syncBox.firstChild);" +
        "    }" +
        "    img.src = validUrl;" +
        "    /* Pindahkan #nodes-container ke dalam #vi-atlas-sync-box agar koordinat 0%-100% pas di atas gambar! */" +
        "    var nodesCont = document.getElementById('nodes-container');" +
        "    if (nodesCont && nodesCont.parentElement !== syncBox) {" +
        "      nodesCont.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:20;';" +
        "      syncBox.appendChild(nodesCont);" +
        "    }" +
        "    /* Tambahkan tombol Susun Ulang Pin & Ganti Gambar saat Mode Edit Teks aktif */" +
        "    var stageWrap = document.getElementById('vi-stage-inner-wrap');" +
        "    if (stageWrap && !document.getElementById('vi-btn-change-atlas-img')) {" +
        "      var topCtrl = document.createElement('div');" +
        "      topCtrl.id = 'vi-btn-change-atlas-img';" +
        "      topCtrl.style.cssText = 'display:none; position:absolute; top:10px; right:10px; z-index:95; gap:6px;';" +
        "      topCtrl.innerHTML =" +
        "        '<button type=\"button\" id=\"vi-act-reset-pins\" style=\"background:#eab308; color:#0f172a; border:1.5px solid #fef08a; padding:5px 9px; border-radius:10px; font-size:10px; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.4);\">📍 Susun Ulang Pin</button>' +" +
        "        '<button type=\"button\" id=\"vi-act-chg-img\" style=\"background:#0284c7; color:#fff; border:1.5px solid #bae6fd; padding:5px 10px; border-radius:10px; font-size:10px; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.4);\">🖼️ Ganti Gambar</button>';" +
        "      stageWrap.appendChild(topCtrl);" +
        "      document.getElementById('vi-act-reset-pins').onclick = function(ev) {" +
        "        ev.stopPropagation();" +
        "        window.__viCustomGraph.movedNodes = {};" +
        "        var pins = document.querySelectorAll('#nodes-container [data-vi-node-key]');" +
        "        pins.forEach(function(p, i) {" +
        "          var gx = 54 + ((i % 2) * 16);" +
        "          var gy = 18 + (i * 11);" +
        "          p.style.left = gx + '%'; p.style.top = Math.min(86, gy) + '%';" +
        "          window.__viCustomGraph.movedNodes[p.getAttribute('data-vi-node-key')] = { x: gx, y: Math.min(86, gy) };" +
        "        });" +
        "        simpanGraphKeInduk();" +
        "      };" +
        "      document.getElementById('vi-act-chg-img').onclick = function(ev) {" +
        "        ev.stopPropagation();" +
        "        var newUrl = prompt('Masukkan URL Gambar Atlas baru (atau kata kunci bahasa Inggris seperti: nephron, kidney, heart, neuron, plant cell):', window.atlasImageUrl || '');" +
        "        if (newUrl && newUrl.trim() !== '') {" +
        "          var oldU = window.atlasImageUrl || '';" +
        "          window.atlasImageUrl = newUrl.trim();" +
        "          img.removeAttribute('data-vi-resolved');" +
        "          muatGambarAtlasDariVariabel();" +
        "          if (oldU) {" +
        "            window.parent.postMessage({ type: 'MAHARDIKA_VI_SAVE_TEXT_EDIT', frameId: FRAME_ID, origText: oldU, newText: window.atlasImageUrl }, '*');" +
        "          }" +
        "        }" +
        "      };" +
        "      var stBtn = document.createElement('style');" +
        "      stBtn.innerHTML = 'body.vi-text-edit-active #vi-btn-change-atlas-img { display:flex !important; }';" +
        "      document.head.appendChild(stBtn);" +
        "    }" +
        "  }" +
        "  function cariGambarFallbackWikimedia(keyword) {" +
        "    var cleanKw = String(keyword || 'kidney anatomy').replace(/^File:/i, '').replace(/\\.(jpg|jpeg|png|svg)$/i, '').replace(/[_-]+/g, ' ').trim();" +
        "    var apiSearch = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(cleanKw + ' diagram') + '&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*';" +
        "    fetch(apiSearch).then(function(r) { return r.json(); }).then(function(d) {" +
        "      if (d && d.query && d.query.pages) {" +
        "        var pages = Object.values(d.query.pages);" +
        "        for (var i = 0; i < pages.length; i++) {" +
        "          if (pages[i].imageinfo && pages[i].imageinfo[0]) {" +
        "            var realUrl = pages[i].imageinfo[0].thumburl || pages[i].imageinfo[0].url;" +
        "            pasangGambarKeSurfaceAtlas(realUrl);" +
        "            return;" +
        "          }" +
        "        }" +
        "      }" +
        "    }).catch(function() {});" +
        "  }" +
        "  function muatGambarAtlasDariVariabel() {" +
        "    siapkanKameraZoomDanDocking();" +
        "    if (!window.atlasImageUrl) {" +
        "      var oldImg = document.querySelector('#canvas-area img:not(#vi-atlas-bg-img)');" +
        "      if (oldImg) {" +
        "        window.atlasImageUrl = oldImg.getAttribute('src') || oldImg.getAttribute('alt') || '';" +
        "        oldImg.style.display = 'none';" +
        "      }" +
        "    }" +
        "    if (typeof window.atlasImageUrl !== 'string' || window.atlasImageUrl.trim() === '') return;" +
        "    var existingImg = document.getElementById('vi-atlas-bg-img');" +
        "    if (existingImg && existingImg.getAttribute('data-vi-resolved') === 'true') return;" +
        "    var rawUrl = window.atlasImageUrl.trim();" +
        "    if (existingImg) existingImg.setAttribute('data-vi-resolved', 'true');" +
        "    if (!/^https?:\\/\\//i.test(rawUrl) && !/^data:image/i.test(rawUrl)) {" +
        "      cariGambarFallbackWikimedia(rawUrl);" +
        "      return;" +
        "    }" +
        "    if (/wikimedia\\.org/i.test(rawUrl)) {" +
        "      var parts = rawUrl.split('/');" +
        "      var fileName = decodeURIComponent(parts[parts.length - 1].split('?')[0]);" +
        "      var apiExact = 'https://commons.wikimedia.org/w/api.php?action=query&titles=File:' + encodeURIComponent(fileName) + '&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*';" +
        "      fetch(apiExact).then(function(r) { return r.json(); }).then(function(d) {" +
        "        if (d && d.query && d.query.pages) {" +
        "          var pg = Object.values(d.query.pages)[0];" +
        "          if (pg && pg.imageinfo && pg.imageinfo[0]) {" +
        "            pasangGambarKeSurfaceAtlas(pg.imageinfo[0].thumburl || pg.imageinfo[0].url);" +
        "            return;" +
        "          }" +
        "        }" +
        "        cariGambarFallbackWikimedia(fileName);" +
        "      }).catch(function() { cariGambarFallbackWikimedia(fileName); });" +
        "      return;" +
        "    }" +
        "    pasangGambarKeSurfaceAtlas(rawUrl);" +
        "    var checkImg = document.getElementById('vi-atlas-bg-img');" +
        "    if (checkImg) {" +
        "      checkImg.onerror = function() { cariGambarFallbackWikimedia(document.title || 'anatomy'); };" +
        "    }" +
        "  }" +
        "  setTimeout(muatGambarAtlasDariVariabel, 150);" +
        "  setTimeout(muatGambarAtlasDariVariabel, 500);" +
        "  window.__viTextEditMode = false;" +
        "  window.__viActiveSelectedNodeKey = 'root';" +
        "  window.__viCustomGraph = window.__viSavedGraph || { addedNodes: [], movedNodes: {}, nodeDetails: {}, extraInfoCards: {} };" +
        "  var _camZoom = 1, _camPanX = 0, _camPanY = 0, _isPanning = false, _panMoved = false, _panStartX = 0, _panStartY = 0;" +
        "  var _isDraggingNode = false, _nodeWasDragged = false, _lastWheelZoomTime = 0;" +
        "  var _lastHotspotClickTime = 0;" +
        "  function simpanGraphKeInduk() {" +
        "    window.parent.postMessage({" +
        "      type: 'MAHARDIKA_VI_SAVE_CUSTOM_GRAPH'," +
        "      frameId: FRAME_ID," +
        "      graph: window.__viCustomGraph" +
        "    }, '*');" +
        "  }" +
        "  function terapkanTransformKamera() {" +
        "    var zoomSurf = document.getElementById('vi-zoom-pan-surface');" +
        "    if (!zoomSurf) {" +
        "      siapkanKameraZoomDanDocking();" +
        "      zoomSurf = document.getElementById('vi-zoom-pan-surface');" +
        "    }" +
        "    if (zoomSurf) {" +
        "      zoomSurf.style.transform = 'translate(' + _camPanX.toFixed(1) + 'px, ' + _camPanY.toFixed(1) + 'px) scale(' + _camZoom.toFixed(2) + ')';" +
        "    }" +
        "    var lbl = document.getElementById('vi-zoom-pct-label');" +
        "    if (lbl) lbl.innerText = Math.round(_camZoom * 100) + '%';" +
        "  }" +
        "  window.__viUbahZoomKanvas = function(delta) {" +
        "    _camZoom = Math.min(2.5, Math.max(0.4, Math.round((_camZoom + delta) * 100) / 100));" +
        "    terapkanTransformKamera();" +
        "  };" +
        "  window.__viResetZoomKanvas = function() {" +
        "    _camZoom = 1; _camPanX = 0; _camPanY = 0;" +
        "    terapkanTransformKamera();" +
        "  };" +
        "  window.addEventListener('wheel', function(ev) {" +
        "    var cArea = document.getElementById('canvas-area');" +
        "    if (!cArea || !cArea.contains(ev.target)) return;" +
        "    if (ev.target.closest && ev.target.closest('.vi-docked-control-bar')) return;" +
        "    ev.preventDefault();" +
        "    ev.stopPropagation();" +
        "    if (ev.ctrlKey) {" +
        "      var now = Date.now();" +
        "      if (now - _lastWheelZoomTime < 55) return;" +
        "      _lastWheelZoomTime = now;" +
        "      var step = ev.deltaY < 0 ? 0.12 : -0.12;" +
        "      window.__viUbahZoomKanvas(step);" +
        "    } else {" +
        "      _camPanX -= ev.deltaX;" +
        "      _camPanY -= ev.deltaY;" +
        "      terapkanTransformKamera();" +
        "    }" +
        "  }, { passive: false, capture: true });" +
        "  function siapkanKameraZoomDanDocking() {" +
        "    var cArea = document.getElementById('canvas-area');" +
        "    if (!cArea) return;" +
        "    var stageWrap = document.getElementById('vi-stage-inner-wrap');" +
        "    if (!stageWrap) {" +
        "      stageWrap = document.createElement('div');" +
        "      stageWrap.id = 'vi-stage-inner-wrap';" +
        "      Array.from(cArea.children).forEach(function(ch) {" +
        "        var cls = String(ch.className || '');" +
        "        var hasControl = ch.querySelector && ch.querySelector('input[type=\"range\"], button');" +
        "        var isBottomControl = hasControl && (/bottom-/.test(cls) || /vi-docked-control-bar/.test(cls));" +
        "        if (isBottomControl) {" +
        "          ch.classList.add('vi-docked-control-bar');" +
        "        } else {" +
        "          stageWrap.appendChild(ch);" +
        "        }" +
        "      });" +
        "      cArea.insertBefore(stageWrap, cArea.firstChild);" +
        "    } else {" +
        "      Array.from(stageWrap.children).forEach(function(ch) {" +
        "        if (ch.id === 'nodes-container' || ch.id === 'svg-layer' || ch.id === 'particle-canvas' || ch.id === 'vi-zoom-pan-surface' || ch.id === 'vi-canvas-zoom-controls' || ch.id === 'vi-btn-change-atlas-img') return;" +
        "        var cls = String(ch.className || '');" +
        "        var hasControl = ch.querySelector && ch.querySelector('input[type=\"range\"], button');" +
        "        if (hasControl && /bottom-/.test(cls)) {" +
        "          ch.classList.add('vi-docked-control-bar');" +
        "          cArea.appendChild(ch);" +
        "        }" +
        "      });" +
        "    }" +
        "    var zoomSurf = document.getElementById('vi-zoom-pan-surface');" +
        "    if (!zoomSurf) {" +
        "      zoomSurf = document.createElement('div');" +
        "      zoomSurf.id = 'vi-zoom-pan-surface';" +
        "      Array.from(stageWrap.children).forEach(function(ch) {" +
        "        if (ch.id === 'vi-canvas-zoom-controls' || ch.id === 'vi-btn-change-atlas-img') return;" +
        "        var cls = String(ch.className || '');" +
        "        var isTopBadge = /absolute/.test(cls) && /top-(2|3|4|5)\\b/.test(cls) && !(/w-full|h-full|inset-0|top-0/.test(cls)) && ch.id !== 'nodes-container' && ch.tagName !== 'SVG' && ch.tagName !== 'CANVAS';" +
        "        if (!isTopBadge) {" +
        "          zoomSurf.appendChild(ch);" +
        "        }" +
        "      });" +
        "      stageWrap.appendChild(zoomSurf);" +
        "    }" +
        "    if (!document.getElementById('vi-custom-svg-layer')) {" +
        "      var cSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');" +
        "      cSvg.id = 'vi-custom-svg-layer';" +
        "      cSvg.setAttribute('class', 'absolute inset-0 w-full h-full pointer-events-none');" +
        "      cSvg.style.zIndex = '18';" +
        "      zoomSurf.insertBefore(cSvg, zoomSurf.firstChild);" +
        "    }" +
        "    if (!document.getElementById('vi-canvas-zoom-controls')) {" +
        "      var zBar = document.createElement('div');" +
        "      zBar.id = 'vi-canvas-zoom-controls';" +
        "      zBar.innerHTML =" +
        "        '<button type=\"button\" title=\"Perkecil Kanvas (-12%)\" onclick=\"window.__viUbahZoomKanvas(-0.12)\">−</button>' +" +
        "        '<button type=\"button\" id=\"vi-zoom-pct-label\" class=\"vi-zoom-pct-btn\" title=\"Reset Zoom 100%\" onclick=\"window.__viResetZoomKanvas()\">100%</button>' +" +
        "        '<button type=\"button\" title=\"Perbesar Kanvas (+12%)\" onclick=\"window.__viUbahZoomKanvas(0.12)\">+</button>';" +
        "      stageWrap.appendChild(zBar);" +
        "      pasangEventPanKanvas(stageWrap);" +
        "    }" +
        "  }" +
        "  function pasangEventPanKanvas(stageWrap) {" +
        "    stageWrap.addEventListener('pointerdown', function(ev) {" +
        "      if (_isDraggingNode) return;" +
        "      if (ev.target.closest && ev.target.closest('#vi-canvas-zoom-controls, #vi-btn-change-atlas-img, [data-vi-node-key], .concept-node, .vi-node-item, .process-box-node, .food-node-wrapper, .hotspot-wrap')) return;" +
        "      _isPanning = true; _panMoved = false;" +
        "      _panStartX = ev.clientX - _camPanX;" +
        "      _panStartY = ev.clientY - _camPanY;" +
        "    });" +
        "    window.addEventListener('pointermove', function(ev) {" +
        "      if (!_isPanning || _isDraggingNode) return;" +
        "      var nx = ev.clientX - _panStartX;" +
        "      var ny = ev.clientY - _panStartY;" +
        "      if (Math.hypot(nx - _camPanX, ny - _camPanY) > 4) _panMoved = true;" +
        "      if (_panMoved) {" +
        "        _camPanX = nx; _camPanY = ny;" +
        "        terapkanTransformKamera();" +
        "      }" +
        "    });" +
        "    window.addEventListener('pointerup', function() {" +
        "      _isPanning = false;" +
        "    });" +
        "  }" +
        "  function paksaKapsulSatuBaris(nodeEl) {" +
        "    if (!nodeEl) return;" +
        "    if (nodeEl.classList.contains('food-node-wrapper') || nodeEl.classList.contains('hotspot-wrap')) return;" +
        "    nodeEl.classList.remove('flex-col');" +
        "    nodeEl.classList.add('vi-pill-horizontal');" +
        "    nodeEl.querySelectorAll('.flex-col').forEach(function(colEl) {" +
        "      colEl.classList.remove('flex-col');" +
        "      colEl.classList.add('vi-pill-horizontal');" +
        "    });" +
        "    nodeEl.querySelectorAll('br').forEach(function(br) { br.remove(); });" +
        "  }" +
        "  function ikatGarisSVGKeNodeTerdekat() {" +
        "    var svg = document.getElementById('svg-layer');" +
        "    var zoomSurf = document.getElementById('vi-zoom-pan-surface');" +
        "    if (!svg || !zoomSurf) return;" +
        "    var prevTf = zoomSurf.style.transform;" +
        "    zoomSurf.style.transform = 'none';" +
        "    var svgRect = svg.getBoundingClientRect();" +
        "    var nodes = Array.from(document.querySelectorAll('[data-vi-node-key]'));" +
        "    var nodeCenters = nodes.map(function(n) {" +
        "      var r = n.getBoundingClientRect();" +
        "      return { key: n.getAttribute('data-vi-node-key'), el: n, cx: (r.left - svgRect.left) + r.width / 2, cy: (r.top - svgRect.top) + r.height / 2, w: r.width, h: r.height };" +
        "    });" +
        "    function cariNodeTerdekat(px, py) {" +
        "      var best = null, minDist = 999999;" +
        "      nodeCenters.forEach(function(nc) {" +
        "        var dx = Math.max(0, Math.abs(px - nc.cx) - nc.w / 2);" +
        "        var dy = Math.max(0, Math.abs(py - nc.cy) - nc.h / 2);" +
        "        var d = Math.hypot(dx, dy);" +
        "        if (d < minDist && d < 65) { minDist = d; best = nc; }" +
        "      });" +
        "      return best;" +
        "    }" +
        "    svg.querySelectorAll('path').forEach(function(p) {" +
        "      if (p.getAttribute('data-vi-from-key') && p.getAttribute('data-vi-to-key')) return;" +
        "      var d = p.getAttribute('d') || '';" +
        "      var nums = (d.match(/-?\\d+(?:\\.\\d+)?/g) || []).map(Number);" +
        "      if (nums.length >= 8 && /^[Mm]/.test(d.trim()) && /[Cc]/.test(d)) {" +
        "        var nStart = cariNodeTerdekat(nums[0], nums[1]);" +
        "        var nEnd = cariNodeTerdekat(nums[6], nums[7]);" +
        "        if (nStart) p.setAttribute('data-vi-from-key', nStart.key);" +
        "        if (nEnd) p.setAttribute('data-vi-to-key', nEnd.key);" +
        "      }" +
        "    });" +
        "    svg.querySelectorAll('line').forEach(function(ln) {" +
        "      if (ln.getAttribute('data-vi-from-key') && ln.getAttribute('data-vi-to-key')) return;" +
        "      var x1 = parseFloat(ln.getAttribute('x1')), y1 = parseFloat(ln.getAttribute('y1'));" +
        "      var x2 = parseFloat(ln.getAttribute('x2')), y2 = parseFloat(ln.getAttribute('y2'));" +
        "      var nStart = cariNodeTerdekat(x1, y1);" +
        "      var nEnd = cariNodeTerdekat(x2, y2);" +
        "      if (nStart) ln.setAttribute('data-vi-from-key', nStart.key);" +
        "      if (nEnd) ln.setAttribute('data-vi-to-key', nEnd.key);" +
        "    });" +
        "    zoomSurf.style.transform = prevTf;" +
        "  }" +
        "  function perbaruiGarisSVGDariPosisiDOM() {" +
        "    var svg = document.getElementById('svg-layer');" +
        "    var zoomSurf = document.getElementById('vi-zoom-pan-surface');" +
        "    if (!svg || !zoomSurf) return;" +
        "    var prevTf = zoomSurf.style.transform;" +
        "    zoomSurf.style.transform = 'none';" +
        "    var svgRect = svg.getBoundingClientRect();" +
        "    function infoKotak(key) {" +
        "      if (!key) return null;" +
        "      var el = document.querySelector('[data-vi-node-key=\"' + key + '\"]');" +
        "      if (!el) return null;" +
        "      var r = el.getBoundingClientRect();" +
        "      return { cx: (r.left - svgRect.left) + r.width / 2, cy: (r.top - svgRect.top) + r.height / 2, left: r.left - svgRect.left, right: r.right - svgRect.left, w: r.width, h: r.height };" +
        "    }" +
        "    svg.querySelectorAll('path[data-vi-from-key], path[data-vi-to-key]').forEach(function(p) {" +
        "      var fBox = infoKotak(p.getAttribute('data-vi-from-key'));" +
        "      var tBox = infoKotak(p.getAttribute('data-vi-to-key'));" +
        "      if (!fBox || !tBox) return;" +
        "      var x0 = fBox.cx < tBox.cx ? fBox.right : fBox.left;" +
        "      var y0 = fBox.cy;" +
        "      var x3 = fBox.cx < tBox.cx ? tBox.left : tBox.right;" +
        "      var y3 = tBox.cy;" +
        "      if (Math.abs(fBox.cx - tBox.cx) < 40) { x0 = fBox.cx; x3 = tBox.cx; }" +
        "      var cx1 = x0 + (x3 - x0) * 0.5;" +
        "      var cy1 = y0;" +
        "      var cx2 = x0 + (x3 - x0) * 0.5;" +
        "      var cy2 = y3;" +
        "      p.setAttribute('d', 'M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' C ' + cx1.toFixed(1) + ' ' + cy1.toFixed(1) + ', ' + cx2.toFixed(1) + ' ' + cy2.toFixed(1) + ', ' + x3.toFixed(1) + ' ' + y3.toFixed(1));" +
        "    });" +
        "    svg.querySelectorAll('line[data-vi-from-key], line[data-vi-to-key]').forEach(function(ln) {" +
        "      var fBox = infoKotak(ln.getAttribute('data-vi-from-key'));" +
        "      var tBox = infoKotak(ln.getAttribute('data-vi-to-key'));" +
        "      if (!fBox || !tBox) return;" +
        "      ln.setAttribute('x1', fBox.cx.toFixed(1)); ln.setAttribute('y1', fBox.cy.toFixed(1));" +
        "      ln.setAttribute('x2', tBox.cx.toFixed(1)); ln.setAttribute('y2', tBox.cy.toFixed(1));" +
        "    });" +
        "    zoomSurf.style.transform = prevTf;" +
        "  }" +
        "  function sinkronkanKoordinatKeDataAI(nodeEl, nodeKey, nx, ny) {" +
        "    var texts = Array.from(nodeEl.querySelectorAll('span, div')).map(function(s) { return s.textContent.trim(); }).filter(Boolean);" +
        "    Object.keys(window).forEach(function(wKey) {" +
        "      var arr = window[wKey];" +
        "      if (Array.isArray(arr)) {" +
        "        arr.forEach(function(item) {" +
        "          if (item && typeof item === 'object') {" +
        "            var matchId = (item.id && (item.id === nodeKey || item.id === nodeEl.id));" +
        "            var matchCode = (item.code && texts.indexOf(String(item.code)) !== -1);" +
        "            var matchName = (item.name && texts.indexOf(String(item.name)) !== -1) || (item.title && texts.indexOf(String(item.title)) !== -1);" +
        "            if (matchId || matchCode || matchName) {" +
        "              if (typeof item.x === 'number') item.x = nx;" +
        "              if (typeof item.y === 'number') item.y = ny;" +
        "              if (typeof item.left === 'number') item.left = nx;" +
        "              if (typeof item.top === 'number') item.top = ny;" +
        "            }" +
        "          }" +
        "        });" +
        "      }" +
        "    });" +
        "  }" +
        "  function dapatkanWadahNodes() {" +
        "    return document.getElementById('nodes-container') || document.getElementById('vi-atlas-sync-box') || document.getElementById('vi-zoom-pan-surface') || document.getElementById('canvas-area');" +
        "  }" +
        "  function gambarGarisCabangCustom() {" +
        "    var cSvg = document.getElementById('vi-custom-svg-layer');" +
        "    var zoomSurf = document.getElementById('vi-zoom-pan-surface');" +
        "    if (!cSvg || !zoomSurf) return;" +
        "    var prevTf = zoomSurf.style.transform;" +
        "    zoomSurf.style.transform = 'none';" +
        "    var surfRect = zoomSurf.getBoundingClientRect();" +
        "    var htmlPaths = '';" +
        "    (window.__viCustomGraph.addedNodes || []).forEach(function(nd) {" +
        "      var pEl = document.querySelector('[data-vi-node-key=\"' + nd.parentId + '\"]') || document.getElementById(nd.parentId);" +
        "      var cEl = document.querySelector('[data-vi-node-key=\"' + nd.id + '\"]') || document.getElementById(nd.id);" +
        "      if (!pEl || !cEl) return;" +
        "      var r1 = pEl.getBoundingClientRect();" +
        "      var r2 = cEl.getBoundingClientRect();" +
        "      var x1 = (r1.left - surfRect.left) + r1.width / 2;" +
        "      var y1 = (r1.top - surfRect.top) + r1.height / 2;" +
        "      var x2 = (r2.left - surfRect.left) + r2.width / 2;" +
        "      var y2 = (r2.top - surfRect.top) + r2.height / 2;" +
        "      var cx1 = x1 + (x2 - x1) * 0.5;" +
        "      var cy1 = y1;" +
        "      var cx2 = x1 + (x2 - x1) * 0.5;" +
        "      var cy2 = y2;" +
        "      var isAct = (window.__viActiveSelectedNodeKey === nd.id || window.__viActiveSelectedNodeKey === nd.parentId);" +
        "      var strokeCol = isAct ? '#facc15' : '#38bdf8';" +
        "      var strokeW = isAct ? '2.4' : '1.6';" +
        "      htmlPaths += '<path d=\"M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' C ' + cx1.toFixed(1) + ' ' + cy1.toFixed(1) + ', ' + cx2.toFixed(1) + ' ' + cy2.toFixed(1) + ', ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '\" fill=\"none\" stroke=\"' + strokeCol + '\" stroke-width=\"' + strokeW + '\"/>';" +
        "    });" +
        "    cSvg.innerHTML = htmlPaths;" +
        "    zoomSurf.style.transform = prevTf;" +
        "  }" +
        "  function bukaDetailNodeDiPanel(nodeKey, defaultObj) {" +
        "    window.__viActiveSelectedNodeKey = nodeKey;" +
        "    var saved = (window.__viCustomGraph.nodeDetails && window.__viCustomGraph.nodeDetails[nodeKey]) || defaultObj;" +
        "    if (saved) {" +
        "      var infDef = document.getElementById('info-default');" +
        "      var infAct = document.getElementById('info-active');" +
        "      if (infDef && infAct) {" +
        "        infDef.classList.add('hidden', 'opacity-0');" +
        "        infAct.classList.remove('hidden', 'opacity-0');" +
        "        infAct.classList.add('flex');" +
        "        infAct.style.opacity = '1';" +
        "      }" +
        "      var emEl = document.getElementById('info-emoji');" +
        "      var nmEl = document.getElementById('info-name');" +
        "      var rlEl = document.getElementById('info-role') || document.getElementById('info-code');" +
        "      var dsEl = document.getElementById('info-desc');" +
        "      if (emEl && saved.emoji) emEl.innerText = saved.emoji;" +
        "      if (nmEl && saved.name) nmEl.innerText = saved.name;" +
        "      if (rlEl && saved.role) rlEl.innerText = saved.role;" +
        "      if (dsEl && saved.desc) dsEl.innerText = saved.desc;" +
        "      var b1 = document.getElementById('info-eats') || document.getElementById('info-box-1');" +
        "      var b2 = document.getElementById('info-eaten-by') || document.getElementById('info-box-2');" +
        "      if (b1 && saved.box1Text) b1.innerText = saved.box1Text;" +
        "      if (b2 && saved.box2Text) b2.innerText = saved.box2Text;" +
        "    }" +
        "    renderExtraInfoCardsUntukNode(nodeKey);" +
        "    gambarGarisCabangCustom();" +
        "    if (window.__viTextEditMode) segarkanStatusEditableDOM();" +
        "  }" +
        "  function buatElemenNodeCustom(nd) {" +
        "    var cont = dapatkanWadahNodes();" +
        "    if (!cont) return;" +
        "    var existing = cont.querySelector('[data-vi-node-key=\"' + nd.id + '\"]');" +
        "    if (existing) existing.remove();" +
        "    var el = document.createElement('div');" +
        "    el.className = 'concept-node vi-node-item vi-pill-horizontal vi-custom-added-node absolute pointer-events-auto z-30 cursor-grab inline-flex flex-row items-center gap-1.5 bg-slate-800/95 border border-sky-400 text-slate-100 px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap';" +
        "    el.setAttribute('data-vi-node-key', nd.id);" +
        "    el.id = nd.id;" +
        "    el.style.left = nd.x + '%';" +
        "    el.style.top = nd.y + '%';" +
        "    el.style.transform = 'translate(-50%, -50%)';" +
        "    el.innerHTML =" +
        "      '<span class=\"bg-sky-600/40 text-sky-300 border border-sky-400/40 px-1.5 py-0.5 rounded text-[8.5px] font-bold\">' + nd.code + '</span>' +" +
        "      '<span class=\"text-xs\">' + nd.emoji + '</span>' +" +
        "      '<span class=\"font-bold text-[9.5px] text-white whitespace-nowrap\">' + nd.name + '</span>';" +
        "    cont.appendChild(el);" +
        "    pasangTombolDanDragPadaNode(el, nd.id, true);" +
        "  }" +
        "  function pasangTombolDanDragPadaNode(nodeEl, nodeKey, isCustom) {" +
        "    if (!nodeEl || nodeEl.id === 'canvas-area' || nodeEl.id === 'vi-stage-inner-wrap' || nodeEl.id === 'vi-zoom-pan-surface' || nodeEl.id === 'vi-atlas-sync-box' || nodeEl.id === 'nodes-container') return;" +
        "    var clsNode = String(nodeEl.className || '');" +
        "    if (/inset-0|w-full|h-full/.test(clsNode) && !nodeEl.style.left) return;" +
        "    if (nodeEl.classList.contains('concept-node')) paksaKapsulSatuBaris(nodeEl);" +
        "    if (nodeEl._viDragInitialized) return;" +
        "    nodeEl._viDragInitialized = true;" +
        "    nodeEl.setAttribute('data-vi-node-key', nodeKey);" +
        "    if (window.__viCustomGraph.movedNodes && window.__viCustomGraph.movedNodes[nodeKey]) {" +
        "      var mv = window.__viCustomGraph.movedNodes[nodeKey];" +
        "      nodeEl.style.left = mv.x + '%';" +
        "      nodeEl.style.top = mv.y + '%';" +
        "      nodeEl.setAttribute('data-orig-x', mv.x);" +
        "      nodeEl.setAttribute('data-orig-y', mv.y);" +
        "      sinkronkanKoordinatKeDataAI(nodeEl, nodeKey, mv.x, mv.y);" +
        "    }" +
        "    var btnAdd = document.createElement('button');" +
        "    btnAdd.type = 'button';" +
        "    btnAdd.className = 'vi-node-add-sub-btn';" +
        "    btnAdd.title = 'Tambah Balok Sub-Informasi Baru dari Cabang Ini';" +
        "    btnAdd.innerHTML = '+';" +
        "    btnAdd.onpointerdown = function(ev) { ev.stopPropagation(); };" +
        "    btnAdd.onclick = function(ev) {" +
        "      ev.stopPropagation(); ev.preventDefault();" +
        "      tambahSubNodeDariInduk(nodeEl, nodeKey);" +
        "    };" +
        "    nodeEl.appendChild(btnAdd);" +
        "    if (isCustom) {" +
        "      var btnDel = document.createElement('button');" +
        "      btnDel.type = 'button';" +
        "      btnDel.className = 'vi-node-del-btn';" +
        "      btnDel.title = 'Hapus Balok Sub-Informasi Ini';" +
        "      btnDel.innerHTML = '✕';" +
        "      btnDel.onpointerdown = function(ev) { ev.stopPropagation(); };" +
        "      btnDel.onclick = function(ev) {" +
        "        ev.stopPropagation(); ev.preventDefault();" +
        "        window.__viCustomGraph.addedNodes = (window.__viCustomGraph.addedNodes || []).filter(function(n) { return n.id !== nodeKey; });" +
        "        delete window.__viCustomGraph.nodeDetails[nodeKey];" +
        "        nodeEl.remove();" +
        "        gambarGarisCabangCustom();" +
        "        simpanGraphKeInduk();" +
        "      };" +
        "      nodeEl.appendChild(btnDel);" +
        "    }" +
        "    nodeEl.addEventListener('pointerdown', function(ev) {" +
        "      if (ev.button && ev.button !== 0) return;" +
        "      if (ev.target.closest && ev.target.closest('.vi-node-add-sub-btn, .vi-node-del-btn')) return;" +
        "      if (ev.target.getAttribute && ev.target.getAttribute('contenteditable') === 'true' && document.activeElement === ev.target) return;" +
        "      ev.stopPropagation();" +
        "      var zoomSurf = document.getElementById('vi-zoom-pan-surface') || nodeEl.parentElement;" +
        "      var coordBox = document.getElementById('vi-atlas-sync-box') || nodeEl.offsetParent || zoomSurf;" +
        "      var prevTf = zoomSurf.style.transform;" +
        "      zoomSurf.style.transform = 'none';" +
        "      var baseW = coordBox.offsetWidth || 600;" +
        "      var baseH = coordBox.offsetHeight || 440;" +
        "      var surfRectUnscaled = coordBox.getBoundingClientRect();" +
        "      var nRectUnscaled = nodeEl.getBoundingClientRect();" +
        "      var nRectUnscaled = nodeEl.getBoundingClientRect();" +
        "      var initPctX = parseFloat(nodeEl.style.left);" +
        "      var initPctY = parseFloat(nodeEl.style.top);" +
        "      if (isNaN(initPctX)) {" +
        "        initPctX = (((nRectUnscaled.left + nRectUnscaled.width / 2) - surfRectUnscaled.left) / baseW) * 100;" +
        "      }" +
        "      if (isNaN(initPctY)) {" +
        "        initPctY = (((nRectUnscaled.top + nRectUnscaled.height / 2) - surfRectUnscaled.top) / baseH) * 100;" +
        "      }" +
        "      zoomSurf.style.transform = prevTf;" +
        "      var startClientX = ev.clientX;" +
        "      var startClientY = ev.clientY;" +
        "      var clickedTarget = ev.target;" +
        "      var pointerId = ev.pointerId;" +
        "      _isDraggingNode = false;" +
        "      _nodeWasDragged = false;" +
        "      function onPointerMove(me) {" +
        "        var dist = Math.hypot(me.clientX - startClientX, me.clientY - startClientY);" +
        "        if (dist > 6) {" +
        "          if (!_nodeWasDragged) {" +
        "            _nodeWasDragged = true;" +
        "            _isDraggingNode = true;" +
        "            ikatGarisSVGKeNodeTerdekat();" +
        "            if (nodeEl.setPointerCapture) {" +
        "              try { nodeEl.setPointerCapture(pointerId); } catch(e) {}" +
        "            }" +
        "          }" +
        "          me.preventDefault();" +
        "          var dxUnscaled = (me.clientX - startClientX) / (_camZoom || 1);" +
        "          var dyUnscaled = (me.clientY - startClientY) / (_camZoom || 1);" +
        "          var nx = initPctX + (dxUnscaled / baseW) * 100;" +
        "          var ny = initPctY + (dyUnscaled / baseH) * 100;" +
        "          var cleanX = parseFloat(nx.toFixed(2));" +
        "          var cleanY = parseFloat(ny.toFixed(2));" +
        "          nodeEl.style.left = cleanX + '%';" +
        "          nodeEl.style.top = cleanY + '%';" +
        "          nodeEl.setAttribute('data-orig-x', cleanX);" +
        "          nodeEl.setAttribute('data-orig-y', cleanY);" +
        "          window.__viCustomGraph.movedNodes[nodeKey] = { x: cleanX, y: cleanY };" +
        "          var cNode = (window.__viCustomGraph.addedNodes || []).find(function(n) { return n.id === nodeKey; });" +
        "          if (cNode) { cNode.x = cleanX; cNode.y = cleanY; }" +
        "          sinkronkanKoordinatKeDataAI(nodeEl, nodeKey, cleanX, cleanY);" +
        "          panggilBuildConnectionsAman();" +
        "          perbaruiGarisSVGDariPosisiDOM();" +
        "          gambarGarisCabangCustom();" +
        "        }" +
        "      }" +
        "      function onPointerUp(ue) {" +
        "        if (_nodeWasDragged && nodeEl.releasePointerCapture) {" +
        "          try { nodeEl.releasePointerCapture(ue.pointerId); } catch(e) {}" +
        "        }" +
        "        window.removeEventListener('pointermove', onPointerMove);" +
        "        window.removeEventListener('pointerup', onPointerUp);" +
        "        _isDraggingNode = false;" +
        "        if (_nodeWasDragged) {" +
        "          simpanGraphKeInduk();" +
        "          setTimeout(function() { _nodeWasDragged = false; }, 60);" +
        "        } else if (window.__viTextEditMode && clickedTarget) {" +
        "          var editEl = clickedTarget.classList && clickedTarget.classList.contains('vi-editable-target') ? clickedTarget : (clickedTarget.querySelector ? clickedTarget.querySelector('.vi-editable-target') : null);" +
        "          if (editEl) {" +
        "            editEl.setAttribute('contenteditable', 'true');" +
        "            editEl.setAttribute('spellcheck', 'false');" +
        "            editEl.focus();" +
        "          }" +
        "        }" +
        "      }" +
        "      window.addEventListener('pointermove', onPointerMove);" +
        "      window.addEventListener('pointerup', onPointerUp);" +
        "    });" +
        "    nodeEl.addEventListener('click', function(ev) {" +
        "      if (_nodeWasDragged) {" +
        "        ev.stopImmediatePropagation();" +
        "        ev.preventDefault();" +
        "        return;" +
        "      }" +
        "      _lastHotspotClickTime = Date.now();" +
        "      window.__viActiveSelectedNodeKey = nodeKey;" +
        "      var cNode = (window.__viCustomGraph.addedNodes || []).find(function(n) { return n.id === nodeKey; });" +
        "      var savedDet = (window.__viCustomGraph.nodeDetails && window.__viCustomGraph.nodeDetails[nodeKey]) || cNode;" +
        "      if (savedDet) {" +
        "        setTimeout(function() { bukaDetailNodeDiPanel(nodeKey, savedDet); }, 20);" +
        "      } else {" +
        "        setTimeout(function() {" +
        "          var infAct = document.getElementById('info-active');" +
        "          if (infAct && (infAct.classList.contains('hidden') || infAct.classList.contains('opacity-0'))) {" +
        "            var rawTxt = (nodeEl.innerText || '').trim();" +
        "            var matchedItem = null;" +
        "            Object.keys(window).forEach(function(wKey) {" +
        "              if (Array.isArray(window[wKey])) {" +
        "                window[wKey].forEach(function(it) {" +
        "                  if (it && typeof it === 'object' && (it.name || it.title)) {" +
        "                    var nm = String(it.name || it.title).trim();" +
        "                    if (rawTxt.indexOf(nm) !== -1 || String(it.id) === String(nodeEl.id) || String(it.no) === rawTxt.split(/\\s+/)[0]) {" +
        "                      matchedItem = it;" +
        "                    }" +
        "                  }" +
        "                });" +
        "              }" +
        "            });" +
        "            if (matchedItem) {" +
        "              bukaDetailNodeDiPanel(nodeKey, {" +
        "                emoji: matchedItem.emoji || matchedItem.no || '🔬'," +
        "                name: matchedItem.name || matchedItem.title," +
        "                role: matchedItem.role || matchedItem.category || matchedItem.subtitle || 'Struktur Anatomi'," +
        "                desc: matchedItem.desc || matchedItem.description || matchedItem.detail || ''," +
        "                box1Text: matchedItem.structure || matchedItem.location || matchedItem.trigger || matchedItem.flow || matchedItem.box1 || ''," +
        "                box2Text: matchedItem.function || matchedItem.func || matchedItem.clinical || matchedItem.result || matchedItem.box2 || ''" +
        "              });" +
        "            }" +
        "          }" +
        "          renderExtraInfoCardsUntukNode(nodeKey);" +
        "          gambarGarisCabangCustom();" +
        "        }, 35);" +
        "      }" +
        "    });" +
        "  }" +
        "  function tambahSubNodeDariInduk(parentEl, parentKey) {" +
        "    var px = parseFloat(parentEl.style.left) || 50;" +
        "    var py = parseFloat(parentEl.style.top) || 50;" +
        "    var childCount = (window.__viCustomGraph.addedNodes || []).filter(function(n) { return n.parentId === parentKey; }).length;" +
        "    var dirX = (px < 48) ? -13 : (px > 52 ? 13 : (childCount % 2 === 0 ? -15 : 15));" +
        "    var newX = px + dirX;" +
        "    var newY = py + 7 + (childCount * 6);" +
        "    var parentTexts = Array.from(parentEl.querySelectorAll('span, div')).map(function(s) { return s.textContent.trim(); }).filter(Boolean);" +
        "    var parentCode = (parentTexts[0] && parentTexts[0].length <= 4) ? parentTexts[0] : '1';" +
        "    var parentTitle = parentTexts[parentTexts.length - 1] || 'Induk';" +
        "    var suffixChar = String.fromCharCode(97 + (childCount % 26));" +
        "    var newCode = parentCode + suffixChar;" +
        "    var newId = 'vi_sub_' + Date.now();" +
        "    var newNodeObj = {" +
        "      id: newId," +
        "      parentId: parentKey," +
        "      code: newCode," +
        "      emoji: '📌'," +
        "      name: 'Sub-Info ' + newCode," +
        "      role: 'Kode: ' + newCode," +
        "      desc: 'Ketik penjelasan lengkap untuk Sub-Info ' + newCode + ' di sini.'," +
        "      box1Text: parentTitle + ' ➔ Sub-Info ' + newCode," +
        "      box2Text: 'Ketik rincian atau contoh spesifik di sini.'," +
        "      x: parseFloat(newX.toFixed(1))," +
        "      y: parseFloat(newY.toFixed(1))" +
        "    };" +
        "    if (!window.__viCustomGraph.addedNodes) window.__viCustomGraph.addedNodes = [];" +
        "    window.__viCustomGraph.addedNodes.push(newNodeObj);" +
        "    if (!window.__viCustomGraph.nodeDetails) window.__viCustomGraph.nodeDetails = {};" +
        "    window.__viCustomGraph.nodeDetails[newId] = newNodeObj;" +
        "    buatElemenNodeCustom(newNodeObj);" +
        "    kalibrasiKepadatanDanTataLetak();" +
        "    bukaDetailNodeDiPanel(newId, newNodeObj);" +
        "    simpanGraphKeInduk();" +
        "  }" +
        "  function siapkanTombolTambahKotakInfoPanel() {" +
        "    var infAct = document.getElementById('info-active');" +
        "    if (!infAct || document.getElementById('vi-btn-add-info-card')) return;" +
        "    var extraHost = document.createElement('div');" +
        "    extraHost.id = 'vi-extra-info-cards-host';" +
        "    extraHost.className = 'grid grid-cols-1 gap-2.5 mt-2.5';" +
        "    infAct.appendChild(extraHost);" +
        "    var btn = document.createElement('button');" +
        "    btn.type = 'button';" +
        "    btn.id = 'vi-btn-add-info-card';" +
        "    btn.innerHTML = '➕ Tambah Balok Sub-Informasi Baru di Panel Ini';" +
        "    btn.onclick = function(ev) {" +
        "      ev.stopPropagation();" +
        "      var key = window.__viActiveSelectedNodeKey || 'root';" +
        "      if (!window.__viCustomGraph.extraInfoCards) window.__viCustomGraph.extraInfoCards = {};" +
        "      if (!window.__viCustomGraph.extraInfoCards[key]) window.__viCustomGraph.extraInfoCards[key] = [];" +
        "      window.__viCustomGraph.extraInfoCards[key].push({" +
        "        id: 'ic_' + Date.now()," +
        "        title: '📌 SUB-INFORMASI TAMBAHAN'," +
        "        body: 'Klik teks ini untuk mengetik rincian materi tambahan secara bebas.'" +
        "      });" +
        "      renderExtraInfoCardsUntukNode(key);" +
        "      segarkanStatusEditableDOM();" +
        "      simpanGraphKeInduk();" +
        "    };" +
        "    infAct.appendChild(btn);" +
        "  }" +
        "  function renderExtraInfoCardsUntukNode(nodeKey) {" +
        "    siapkanTombolTambahKotakInfoPanel();" +
        "    var host = document.getElementById('vi-extra-info-cards-host');" +
        "    if (!host) return;" +
        "    var list = (window.__viCustomGraph.extraInfoCards && window.__viCustomGraph.extraInfoCards[nodeKey]) || [];" +
        "    host.innerHTML = '';" +
        "    list.forEach(function(item, idx) {" +
        "      var card = document.createElement('div');" +
        "      card.className = 'bg-slate-800/70 p-3 rounded-xl border border-sky-500/30 relative';" +
        "      card.innerHTML =" +
        "        '<div class=\"text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-1\" data-vi-extra-field=\"title\" data-vi-extra-idx=\"' + idx + '\">' + item.title + '</div>' +" +
        "        '<div class=\"text-xs text-slate-200 leading-relaxed\" data-vi-extra-field=\"body\" data-vi-extra-idx=\"' + idx + '\">' + item.body + '</div>' +" +
        "        '<button type=\"button\" class=\"vi-node-del-btn\" style=\"top:6px; right:6px; left:auto;\" title=\"Hapus Kotak Info Ini\">✕</button>';" +
        "      card.querySelector('.vi-node-del-btn').onclick = function(ev) {" +
        "        ev.stopPropagation();" +
        "        list.splice(idx, 1);" +
        "        renderExtraInfoCardsUntukNode(nodeKey);" +
        "        simpanGraphKeInduk();" +
        "      };" +
        "      host.appendChild(card);" +
        "    });" +
        "  }" +
        "  function panggilBuildConnectionsAman() {" +
        "    var zoomSurf = document.getElementById('vi-zoom-pan-surface');" +
        "    var prevTf = zoomSurf ? zoomSurf.style.transform : '';" +
        "    if (zoomSurf) zoomSurf.style.transform = 'none';" +
        "    if (typeof window.buildConnections === 'function') {" +
        "      try { window.buildConnections(); } catch(e) {}" +
        "    }" +
        "    if (typeof window.drawConnections === 'function') {" +
        "      try { window.drawConnections(); } catch(e) {}" +
        "    }" +
        "    if (typeof window.renderLines === 'function') {" +
        "      try { window.renderLines(); } catch(e) {}" +
        "    }" +
        "    if (zoomSurf) zoomSurf.style.transform = prevTf;" +
        "  }" +
        "  function cariRootWrapperNode(el, nodesCont) {" +
        "    var cur = el;" +
        "    while (cur && cur.parentElement && cur.parentElement !== nodesCont && cur.parentElement.id !== 'vi-atlas-sync-box' && cur.parentElement.id !== 'vi-zoom-pan-surface' && cur.parentElement.id !== 'vi-stage-inner-wrap' && cur.parentElement.id !== 'canvas-area') {" +
        "      if (cur.style && (cur.style.left || cur.style.top)) return cur;" +
        "      var pCls = String(cur.parentElement.className || '');" +
        "      if (/inset-0|w-full|h-full/.test(pCls) && !cur.parentElement.style.left) break;" +
        "      cur = cur.parentElement;" +
        "    }" +
        "    return cur || el;" +
        "  }" +
        "  function kalibrasiKepadatanDanTataLetak() {" +
        "    siapkanKameraZoomDanDocking();" +
        "    siapkanTombolTambahKotakInfoPanel();" +
        "    var cArea = document.getElementById('canvas-area');" +
        "    if (!cArea) return;" +
        "    var nodesCont = dapatkanWadahNodes();" +
        "    (window.__viCustomGraph.addedNodes || []).forEach(function(nd) {" +
        "      if (!nodesCont.querySelector('[data-vi-node-key=\"' + nd.id + '\"]')) {" +
        "        buatElemenNodeCustom(nd);" +
        "      }" +
        "    });" +
        "    var rawCandidates = Array.from(nodesCont.querySelectorAll('[style*=\"left\"][style*=\"top\"], .concept-node, .process-box-node, .food-node-wrapper, .hotspot-wrap'));" +
        "    var rootSet = new Set();" +
        "    rawCandidates.forEach(function(c) {" +
        "      if (c.id === 'svg-layer' || c.id === 'vi-custom-svg-layer' || c.id === 'particle-canvas' || c.id === 'vi-canvas-zoom-controls' || c.id === 'vi-atlas-sync-box' || c.id === 'vi-atlas-bg-img') return;" +
        "      var rw = cariRootWrapperNode(c, nodesCont);" +
        "      var rwCls = String(rw.className || '');" +
        "      if (/inset-0|w-full|h-full/.test(rwCls) && !rw.style.left) return;" +
        "      rootSet.add(rw);" +
        "    });" +
        "    var topNodes = Array.from(rootSet);" +
        "    topNodes.forEach(function(el, idx) {" +
        "      var nKey = el.getAttribute('data-vi-node-key') || el.id || ('vi_node_' + idx);" +
        "      var isCust = el.classList.contains('vi-custom-added-node');" +
        "      pasangTombolDanDragPadaNode(el, nKey, isCust);" +
        "    });" +
        "    var count = topNodes.length;" +
        "    cArea.classList.remove('vi-density-normal', 'vi-density-medium', 'vi-density-complex');" +
        "    if (count >= 15) cArea.classList.add('vi-density-complex');" +
        "    else if (count >= 10) cArea.classList.add('vi-density-medium');" +
        "    else cArea.classList.add('vi-density-normal');" +
        "    topNodes.forEach(function(nodeEl) {" +
        "      var nKey = nodeEl.getAttribute('data-vi-node-key');" +
        "      if (window.__viCustomGraph.movedNodes && window.__viCustomGraph.movedNodes[nKey]) {" +
        "        var mv = window.__viCustomGraph.movedNodes[nKey];" +
        "        nodeEl.style.left = mv.x + '%';" +
        "        nodeEl.style.top = mv.y + '%';" +
        "        return;" +
        "      }" +
        "      if (nodeEl.classList.contains('vi-custom-added-node')) return;" +
        "      var origX = nodeEl.getAttribute('data-orig-x');" +
        "      var origY = nodeEl.getAttribute('data-orig-y');" +
        "      if (!origX && nodeEl.style.left && nodeEl.style.left.indexOf('%') !== -1) {" +
        "        origX = parseFloat(nodeEl.style.left);" +
        "        nodeEl.setAttribute('data-orig-x', origX);" +
        "      }" +
        "      if (!origY && nodeEl.style.top && nodeEl.style.top.indexOf('%') !== -1) {" +
        "        origY = parseFloat(nodeEl.style.top);" +
        "        nodeEl.setAttribute('data-orig-y', origY);" +
        "      }" +
        "    });" +
        "    ikatGarisSVGKeNodeTerdekat();" +
        "    perbaruiGarisSVGDariPosisiDOM();" +
        "    gambarGarisCabangCustom();" +
        "  }" +
        "  function siapkanSpanTeksAman(rootEl) {" +
        "    if (!rootEl) return;" +
        "    rootEl.querySelectorAll('h1, h2, h3, h4, div, span, p, button, li').forEach(function(el) {" +
        "      if (el.closest && el.closest('svg, script, style, #vi-canvas-zoom-controls, #vi-btn-change-atlas-img')) return;" +
        "      if (el.classList.contains('vi-node-add-sub-btn') || el.classList.contains('vi-node-del-btn')) return;" +
        "      if (el.children.length > 0) {" +
        "        Array.from(el.childNodes).forEach(function(n) {" +
        "          if (n.nodeType === 3 && n.nodeValue && n.nodeValue.trim().length > 0) {" +
        "            var sp = document.createElement('span');" +
        "            sp.className = 'vi-editable-subspan';" +
        "            sp.textContent = n.nodeValue;" +
        "            el.replaceChild(sp, n);" +
        "          }" +
        "        });" +
        "      }" +
        "    });" +
        "  }" +
        "  function bacaTeksBersih(el) {" +
        "    if (!el) return '';" +
        "    return (el.innerText !== undefined ? el.innerText : el.textContent || '').replace(/\\r\\n/g, '\\n').trim();" +
        "  }" +
        "  function segarkanStatusEditableDOM() {" +
        "    siapkanSpanTeksAman(document.body);" +
        "    var kandidat = document.querySelectorAll('h1, h2, h3, h4, p, span, li, .vi-editable-subspan, .arrow-label-badge, .process-box-node, #info-emoji, #info-name, #info-role, #info-desc, div');" +
        "    kandidat.forEach(function(el) {" +
        "      if (el.id === 'canvas-area' || el.id === 'vi-stage-inner-wrap' || el.id === 'vi-zoom-pan-surface' || el.id === 'vi-atlas-sync-box' || el.id === 'info-panel' || el.id === 'nodes-container' || el.id === 'info-active' || el.id === 'info-default' || el.id === 'vi-btn-add-info-card') return;" +
        "      if (el.closest && el.closest('svg, script, style, #vi-canvas-zoom-controls, #vi-btn-change-atlas-img')) return;" +
        "      if (el.classList.contains('vi-node-add-sub-btn') || el.classList.contains('vi-node-del-btn')) return;" +
        "      var nonBrChildren = Array.from(el.children).filter(function(c) {" +
        "        return c.tagName !== 'BR' && !c.classList.contains('vi-node-add-sub-btn') && !c.classList.contains('vi-node-del-btn');" +
        "      });" +
        "      if (nonBrChildren.length > 0) return;" +
        "      var txt = bacaTeksBersih(el);" +
        "      if (!txt) return;" +
        "      var insideCanvasNode = el.closest && el.closest('[data-vi-node-key]');" +
        "      if (window.__viTextEditMode) {" +
        "        el.classList.add('vi-editable-target');" +
        "        if (!insideCanvasNode) {" +
        "          el.setAttribute('contenteditable', 'true');" +
        "          el.setAttribute('spellcheck', 'false');" +
        "        }" +
        "      } else {" +
        "        el.classList.remove('vi-editable-target');" +
        "        el.removeAttribute('contenteditable');" +
        "      }" +
        "    });" +
        "  }" +
        "  function updateVariabelDataDiRAM(oldStr, newStr, elTarget) {" +
        "    if (!oldStr || oldStr === newStr) return;" +
        "    if (elTarget && elTarget.getAttribute('data-vi-extra-field')) {" +
        "      var fName = elTarget.getAttribute('data-vi-extra-field');" +
        "      var fIdx = parseInt(elTarget.getAttribute('data-vi-extra-idx'), 10);" +
        "      var nKey = window.__viActiveSelectedNodeKey || 'root';" +
        "      if (window.__viCustomGraph.extraInfoCards && window.__viCustomGraph.extraInfoCards[nKey] && window.__viCustomGraph.extraInfoCards[nKey][fIdx]) {" +
        "        window.__viCustomGraph.extraInfoCards[nKey][fIdx][fName] = newStr;" +
        "        simpanGraphKeInduk();" +
        "      }" +
        "    }" +
        "    var actKey = window.__viActiveSelectedNodeKey;" +
        "    if (actKey && window.__viCustomGraph.nodeDetails && window.__viCustomGraph.nodeDetails[actKey]) {" +
        "      var nd = window.__viCustomGraph.nodeDetails[actKey];" +
        "      if (elTarget && elTarget.id === 'info-name') nd.name = newStr;" +
        "      else if (elTarget && (elTarget.id === 'info-role' || elTarget.id === 'info-code')) nd.role = newStr;" +
        "      else if (elTarget && elTarget.id === 'info-emoji') nd.emoji = newStr;" +
        "      else if (elTarget && elTarget.id === 'info-desc') nd.desc = newStr;" +
        "      Object.keys(nd).forEach(function(k) { if (nd[k] === oldStr) nd[k] = newStr; });" +
        "      simpanGraphKeInduk();" +
        "    }" +
        "    var visited = new Set();" +
        "    function telusuriObjek(obj, depth) {" +
        "      if (!obj || typeof obj !== 'object' || depth > 6 || visited.has(obj)) return;" +
        "      if (obj === window || obj instanceof Node || obj instanceof Window) return;" +
        "      visited.add(obj);" +
        "      Object.keys(obj).forEach(function(k) {" +
        "        try {" +
        "          var val = obj[k];" +
        "          if (typeof val === 'string') {" +
        "            var cleanVal = val.replace(/\\r\\n/g, '\\n').trim();" +
        "            if (cleanVal === oldStr || cleanVal.toLowerCase() === oldStr.toLowerCase()) {" +
        "              obj[k] = newStr;" +
        "            }" +
        "          } else if (typeof val === 'object' && val !== null) {" +
        "            telusuriObjek(val, depth + 1);" +
        "          }" +
        "        } catch(e) {}" +
        "      });" +
        "    }" +
        "    Object.keys(window).forEach(function(wKey) {" +
        "      if (/^(nodes|data|items|concepts|connections|branches|organs|steps|taxa|info|flow|stages|hotspots|monera|fungi|tree)/i.test(wKey) || Array.isArray(window[wKey]) || (window[wKey] && typeof window[wKey] === 'object' && !window[wKey].nodeType)) {" +
        "        try { telusuriObjek(window[wKey], 0); } catch(e) {}" +
        "      }" +
        "    });" +
        "    document.querySelectorAll('[contenteditable], .vi-editable-target, span, h1, h2, h3, p, div, text, tspan').forEach(function(otherEl) {" +
        "      if (otherEl.children.length === 0 && bacaTeksBersih(otherEl) === oldStr) {" +
        "        otherEl.innerText = newStr;" +
        "      }" +
        "    });" +
        "  }" +
        "  document.addEventListener('focusin', function(ev) {" +
        "    if (!window.__viTextEditMode) return;" +
        "    var el = ev.target;" +
        "    if (el && el.getAttribute && el.getAttribute('contenteditable') === 'true') {" +
        "      el.setAttribute('data-vi-session-start', bacaTeksBersih(el));" +
        "    }" +
        "  }, true);" +
        "  document.addEventListener('keydown', function(ev) {" +
        "    if (!window.__viTextEditMode) return;" +
        "    if (ev.key === 'Enter') {" +
        "      var el = ev.target;" +
        "      if (el && el.getAttribute && el.getAttribute('contenteditable') === 'true') {" +
        "        ev.preventDefault();" +
        "        if (el.closest && el.closest('#canvas-area')) {" +
        "          el.blur();" +
        "        } else {" +
        "          document.execCommand('insertLineBreak');" +
        "        }" +
        "      }" +
        "    }" +
        "  }, true);" +
        "  document.addEventListener('focusout', function(ev) {" +
        "    if (!window.__viTextEditMode) return;" +
        "    var el = ev.target;" +
        "    if (!el || !el.getAttribute || el.getAttribute('contenteditable') !== 'true') return;" +
        "    var origText = (el.getAttribute('data-vi-session-start') || '').trim();" +
        "    var newText = bacaTeksBersih(el);" +
        "    if (el.closest && el.closest('#canvas-area')) {" +
        "      newText = newText.replace(/\\n+/g, ' ').trim();" +
        "      el.innerText = newText;" +
        "      el.removeAttribute('contenteditable');" +
        "    }" +
        "    if (origText && newText && origText !== newText) {" +
        "      el.setAttribute('data-vi-session-start', newText);" +
        "      updateVariabelDataDiRAM(origText, newText, el);" +
        "      window.parent.postMessage({" +
        "        type: 'MAHARDIKA_VI_SAVE_TEXT_EDIT'," +
        "        frameId: FRAME_ID," +
        "        origText: origText," +
        "        newText: newText" +
        "      }, '*');" +
        "      setTimeout(picuKalibrasiGarisDanUkuran, 60);" +
        "    }" +
        "  }, true);" +
        "  function picuKalibrasiGarisDanUkuran() {" +
        "    kalibrasiKepadatanDanTataLetak();" +
        "    panggilBuildConnectionsAman();" +
        "    ikatGarisSVGKeNodeTerdekat();" +
        "    perbaruiGarisSVGDariPosisiDOM();" +
        "    gambarGarisCabangCustom();" +
        "  }" +
        "  window.addEventListener('message', function(ev) {" +
        "    if (!ev.data) return;" +
        "    if (ev.data.type === 'MAHARDIKA_VI_TOGGLE_PAUSE') {" +
        "      window.__viAnimPaused = !window.__viAnimPaused;" +
        "      document.body.classList.toggle('vi-anim-paused', window.__viAnimPaused);" +
        "    } else if (ev.data.type === 'MAHARDIKA_VI_SET_SPEED') {" +
        "      window.__viAnimSpeed = parseFloat(ev.data.speed) || 1.0;" +
        "      if (document.getAnimations) {" +
        "        document.getAnimations().forEach(function(anim) {" +
        "          try { anim.playbackRate = window.__viAnimSpeed; } catch(e) {}" +
        "        });" +
        "      }" +
        "    } else if (ev.data.type === 'MAHARDIKA_VI_SET_LAYOUT_MODE') {" +
        "      var isStackMode = (ev.data.mode === 'responsive');" +
        "      document.body.classList.toggle('vi-force-mobile-stack', isStackMode);" +
        "      picuKalibrasiGarisDanUkuran();" +
        "      requestAnimationFrame(function() {" +
        "        picuKalibrasiGarisDanUkuran();" +
        "        setTimeout(picuKalibrasiGarisDanUkuran, 60);" +
        "        setTimeout(picuKalibrasiGarisDanUkuran, 180);" +
        "      });" +
        "    } else if (ev.data.type === 'MAHARDIKA_VI_SET_TEXT_EDIT') {" +
        "      if (!ev.data.enabled && document.activeElement && document.activeElement.getAttribute && document.activeElement.getAttribute('contenteditable') === 'true') {" +
        "        document.activeElement.blur();" +
        "      }" +
        "      window.__viTextEditMode = Boolean(ev.data.enabled);" +
        "      document.body.classList.toggle('vi-text-edit-active', window.__viTextEditMode);" +
        "      kalibrasiKepadatanDanTataLetak();" +
        "      segarkanStatusEditableDOM();" +
        "    } else if (ev.data.type === 'MAHARDIKA_VI_TRIGGER_RESIZE') {" +
        "      picuKalibrasiGarisDanUkuran();" +
        "      setTimeout(picuKalibrasiGarisDanUkuran, 80);" +
        "    }" +
        "  });" +
        "  window.addEventListener('DOMContentLoaded', function() {" +
        "    var cArea = document.getElementById('canvas-area');" +
        "    if (cArea) {" +
        "      cArea.addEventListener('click', function(ev) {" +
        "        if (_panMoved || _nodeWasDragged || Date.now() - _lastHotspotClickTime < 150) return;" +
        "        if (ev.target === cArea || ev.target.id === 'vi-stage-inner-wrap' || ev.target.id === 'vi-zoom-pan-surface' || ev.target.id === 'vi-atlas-sync-box' || ev.target.id === 'nodes-container' || ev.target.id === 'svg-layer') {" +
        "          if (typeof window.resetInteractions === 'function') window.resetInteractions();" +
        "        }" +
        "      });" +
        "    }" +
        "    var iPanel = document.getElementById('info-panel');" +
        "    if (iPanel && window.MutationObserver) {" +
        "      var obsEdit = new MutationObserver(function() {" +
        "        if (window.__viTextEditMode) segarkanStatusEditableDOM();" +
        "      });" +
        "      obsEdit.observe(iPanel, { childList: true, subtree: true, characterData: true });" +
        "    }" +
        "    setTimeout(picuKalibrasiGarisDanUkuran, 100);" +
        "    setTimeout(picuKalibrasiGarisDanUkuran, 300);" +
        "    setTimeout(picuKalibrasiGarisDanUkuran, 700);" +
        "    if (window.ResizeObserver) {" +
        "      var ro = new ResizeObserver(function() {" +
        "        if (!_isDraggingNode) {" +
        "          panggilBuildConnectionsAman();" +
        "          perbaruiGarisSVGDariPosisiDOM();" +
        "          gambarGarisCabangCustom();" +
        "        }" +
        "      });" +
        "      ro.observe(document.body);" +
        "      if (cArea) ro.observe(cArea);" +
        "    }" +
        "  });" +
        "  window.addEventListener('load', function() {" +
        "    muatGambarAtlasDariVariabel();" +
        "    picuKalibrasiGarisDanUkuran();" +
        "    setTimeout(picuKalibrasiGarisDanUkuran, 250);" +
        "  });" +
        "})();" +
        "<" + "/script>";

    return "<!DOCTYPE html><html lang='id'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
           autoTailwindTag +
           headContent +
           helperCss +
           "</head><body" + (bodyAttrs ? (" " + bodyAttrs) : "") + ">" +
           preScript +
           bodyInner +
           runtimeScript +
           "</body></html>";
};

// 9. PENGATUR UKURAN PASTI CONTENT BLOCK MODUL INTERAKTIF (MODE HP 410x720 vs MODE KANVAS 1040x600)
window.sesuaikanSkalaSatuModulVI = function(card) {
    if (!card) return;
    let bodyWrap = card.querySelector(".vi-card-body");
    let iframe = card.querySelector("iframe.vi-capsule-iframe");
    if (!bodyWrap || !iframe) return;

    let parentBlok = card.closest(".content-block");
    let parentShell = card.closest(".dynamic-block-shell");

    if (parentBlok) {
        parentBlok.classList.add("vi-dedicated-block");
        parentBlok.removeAttribute("contenteditable");
    }

    let isMobileDevice = window.innerWidth <= 768;
    let scaleMode = isMobileDevice ? "responsive" : (card.getAttribute("data-vi-scale-mode") || "responsive");

    let btnScale = card.querySelector('[onclick*="toggleModeSkalaModulVI"]');
    if (btnScale) {
        btnScale.innerHTML = (scaleMode === "canvas") ? "📐 Mode Kanvas" : "📱 Mode HP";
    }

    card.style.width = "100%";
    card.style.maxWidth = "100%";

    if (scaleMode === "responsive") {
        if (parentBlok) {
            parentBlok.classList.add("vi-shell-mobile");
            parentBlok.classList.remove("vi-shell-canvas");
        }
        if (parentShell) {
            parentShell.classList.add("vi-shell-mobile");
            parentShell.classList.remove("vi-shell-canvas");
        }

        let fixedMobileH = 720;
        iframe.style.width = "100%";
        iframe.style.height = fixedMobileH + "px";
        iframe.style.transform = "none";
        bodyWrap.style.height = fixedMobileH + "px";

        if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: "MAHARDIKA_VI_SET_LAYOUT_MODE", mode: "responsive" }, "*");
        }
        return;
    }

    if (parentBlok) {
        parentBlok.classList.add("vi-shell-canvas");
        parentBlok.classList.remove("vi-shell-mobile");
    }
    if (parentShell) {
        parentShell.classList.add("vi-shell-canvas");
        parentShell.classList.remove("vi-shell-mobile");
    }

    let containerW = (parentShell ? parentShell.offsetWidth : 0) || bodyWrap.offsetWidth || 1024;
    let baseCanvasW = 1024;
    let baseCanvasH = 600;

    if (containerW < baseCanvasW && containerW > 100) {
        let ratio = containerW / baseCanvasW;
        let scaledH = Math.ceil(baseCanvasH * ratio);
        iframe.style.width = baseCanvasW + "px";
        iframe.style.height = baseCanvasH + "px";
        iframe.style.transformOrigin = "top left";
        iframe.style.transform = "scale(" + ratio.toFixed(4) + ")";
        bodyWrap.style.height = scaledH + "px";
    } else {
        iframe.style.width = "100%";
        iframe.style.height = baseCanvasH + "px";
        iframe.style.transform = "none";
        bodyWrap.style.height = baseCanvasH + "px";
    }

    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "MAHARDIKA_VI_SET_LAYOUT_MODE", mode: "canvas" }, "*");
    }
};

window.sesuaikanSkalaSemuaModulVI = function() {
    document.querySelectorAll(".modul-interaktif-card").forEach(function(card) {
        window.sesuaikanSkalaSatuModulVI(card);
    });
};

window.addEventListener("resize", function() {
    clearTimeout(window._viResizeTimer);
    window._viResizeTimer = setTimeout(window.sesuaikanSkalaSemuaModulVI, 100);
});

// 10. PENYIMPAN EDITAN TEKS & POSISI DRAG BALOK KE DALAM KODE SUMBER DAN FIREBASE
window.gantiTeksDalamKodeVI = function(rawCode, origText, newText) {
    if (!rawCode || !origText || origText === newText) return rawCode;
    let cleanOrig = origText.replace(/\r\n/g, "\n").trim();
    let cleanNew = newText.replace(/\r\n/g, "\n").trim();

    let jsEscapedNew = cleanNew.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
    let jsOrigEscaped = cleanOrig.replace(/\n/g, "\\n");

    if (rawCode.indexOf(jsOrigEscaped) !== -1) {
        return rawCode.split(jsOrigEscaped).join(jsEscapedNew);
    }

    if (rawCode.indexOf(cleanOrig) !== -1) {
        return rawCode.split(cleanOrig).join(jsEscapedNew);
    }

    let escapedRegex = cleanOrig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '(?:\\s|\\\\n)+');
    let reFlex = new RegExp(escapedRegex, "gi");
    if (reFlex.test(rawCode)) {
        return rawCode.replace(reFlex, jsEscapedNew);
    }
    return rawCode;
};

window.sisipkanDataGraphKeKodeVI = function(rawCode, graphObj) {
    let cleanCode = String(rawCode || "").replace(/<script id="vi-saved-graph-data">[\s\S]*?<\/script>/gi, "");
    let scriptTag = '<script id="vi-saved-graph-data">window.__viSavedGraph = ' + JSON.stringify(graphObj || {}) + ';<' + '/script>';
    if (/<\/body>/i.test(cleanCode)) {
        return cleanCode.replace(/<\/body>/i, scriptTag + "\n</body>");
    }
    return cleanCode + "\n" + scriptTag;
};

window.simpanKodeKartuKeDatabaseVI = function(card, updatedCode) {
    card.setAttribute("data-vi-code", encodeURIComponent(updatedCode));
    card.removeAttribute("data-vi-overrides");
    card.removeAttribute("data-vi-hydrated");

    let parentBlok = card.closest(".content-block");
    if (parentBlok) {
        let bIdx = parseInt(parentBlok.getAttribute("data-index"), 10);
        if (!isNaN(bIdx) && window.contentBlocksData && window.contentBlocksData[bIdx]) {
            if (window.contentBlocksData[bIdx].type === "modul_interaktif") {
                window.contentBlocksData[bIdx].htmlCode = updatedCode;
                window.contentBlocksData[bIdx].cssCode = "";
            } else {
                window.contentBlocksData[bIdx].html = card.outerHTML;
            }
        }
    }
    if (typeof window.simpanKeDB === "function") window.simpanKeDB();
    if (typeof window.showSaveToast === "function") window.showSaveToast();
};

window.addEventListener("message", function(e) {
    if (!e.data) return;

    if (e.data.type === "MAHARDIKA_VI_SAVE_TEXT_EDIT") {
        let fId = e.data.frameId;
        let origText = (e.data.origText || "").trim();
        let newText = (e.data.newText || "").trim();
        if (!fId || !origText || !newText || origText === newText) return;

        let targetIframe = document.querySelector('iframe[data-vi-frame-id="' + fId + '"]');
        if (!targetIframe) return;
        let card = targetIframe.closest(".modul-interaktif-card");
        if (!card) return;

        let oldCode = decodeURIComponent(card.getAttribute("data-vi-code") || "");
        oldCode = oldCode.replace(/\)\.Hahai+hai+/gi, ").");
        let updatedCode = window.gantiTeksDalamKodeVI(oldCode, origText, newText);
        window.simpanKodeKartuKeDatabaseVI(card, updatedCode);
    } else if (e.data.type === "MAHARDIKA_VI_SAVE_CUSTOM_GRAPH") {
        let fId = e.data.frameId;
        let graph = e.data.graph;
        if (!fId || !graph) return;

        let targetIframe = document.querySelector('iframe[data-vi-frame-id="' + fId + '"]');
        if (!targetIframe) return;
        let card = targetIframe.closest(".modul-interaktif-card");
        if (!card) return;

        let oldCode = decodeURIComponent(card.getAttribute("data-vi-code") || "");
        let updatedCode = window.sisipkanDataGraphKeKodeVI(oldCode, graph);
        window.simpanKodeKartuKeDatabaseVI(card, updatedCode);
    }
});

// 11. TOGGLE PAUSE / PLAY ANIMASI DARI HEADER KARTU MODUL
window.togglePauseAnimasiModulVI = function(btnEl) {
    let card = btnEl ? btnEl.closest(".modul-interaktif-card") : null;
    if (!card) return;
    let iframe = card.querySelector("iframe.vi-capsule-iframe");
    if (!iframe || !iframe.contentWindow) return;

    let isPaused = card.getAttribute("data-vi-paused") === "true";
    let nextState = !isPaused;
    card.setAttribute("data-vi-paused", String(nextState));
    btnEl.innerHTML = nextState ? "▶️ Play" : "⏸️ Jeda";
    iframe.contentWindow.postMessage({ type: "MAHARDIKA_VI_TOGGLE_PAUSE" }, "*");
};

// 12. MEMBANGUN HTML KARTU MODUL INTERAKTIF
window.bangunHTMLKartuModulInteraktif = function(judul, kodeHtml) {
    let frameId = "vi_frame_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    let encodedTitle = encodeURIComponent(judul || "Modul Visual Interaktif");
    let encodedCode = encodeURIComponent(kodeHtml || "");
    let srcdocStr = window.generateKapsulModul(judul, kodeHtml, "", frameId);
    let safeSrcdoc = srcdocStr.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    let safeJudulTampil = String(judul || "Modul Visual Interaktif").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return '<div class="modul-interaktif-card" contenteditable="false" data-vi-version="14" data-vi-scale-mode="responsive" data-vi-speed="1" data-vi-title="' + encodedTitle + '" data-vi-code="' + encodedCode + '" style="margin: 0 auto; width: 100%; max-width: 100%; background: #0f172a; border: 2px solid #cbd5e1; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 28px rgba(15, 23, 42, 0.16); user-select: none;">' +
        '<div class="vi-card-header" style="background: linear-gradient(135deg, #0b3954, #0284c7); color: #ffffff; padding: 9px 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">' +
            '<div style="display:flex; align-items:center; gap:8px; font-weight:800; font-size:13px; color:#f8fafc; flex:1; min-width:140px;">' +
                '<span>🧩</span> <span class="vi-card-title-text">' + safeJudulTampil + '</span>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap;">' +
                '<button type="button" onclick="window.toggleModeSkalaModulVI(this)" style="background:rgba(255,255,255,0.16); color:#bae6fd; border:1px solid rgba(255,255,255,0.3); padding:4px 9px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;" title="Ganti Mode HP (Portrait) / Mode Kanvas (Landscape Melebar)">📱 Mode HP</button>' +
                '<button type="button" class="vi-btn-pause" onclick="window.togglePauseAnimasiModulVI(this)" style="background:rgba(255,255,255,0.16); color:#ffffff; border:1px solid rgba(255,255,255,0.3); padding:4px 9px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;" title="Jeda / Putar Animasi">⏸️ Jeda</button>' +
                '<button type="button" class="vi-btn-speed" onclick="window.ubahKecepatanAnimasiModulVI(this)" style="background:rgba(255,255,255,0.16); color:#fde047; border:1px solid rgba(255,255,255,0.3); padding:4px 9px; border-radius:8px; font-size:11px; font-weight:800; cursor:pointer;" title="Ubah Kecepatan Animasi (0.5x / 1x / 2x)">⚡ 1x</button>' +
                '<button type="button" onclick="window.reloadModulInteraktif(this)" style="background:rgba(255,255,255,0.16); color:#ffffff; border:1px solid rgba(255,255,255,0.3); padding:4px 9px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;" title="Muat Ulang Simulasi">🔄 Reset</button>' +
                '<button type="button" class="vi-admin-only-btn vi-btn-edit-text" onclick="window.toggleInlineEditTeksVI(this)" style="background:#8e44ad; color:#ffffff; border:1px solid #c084fc; padding:4px 9px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;" title="Edit Teks & Tambah Sub-Informasi [+] di Layar">✍️ Edit Teks</button>' +
                '<button type="button" class="vi-admin-only-btn" onclick="window.editModulInteraktif(this)" style="background:#f39c12; color:#ffffff; border:none; padding:4px 9px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;" title="Edit Kode HTML">✏️ Kode</button>' +
                '<button type="button" class="vi-admin-only-btn" onclick="window.hapusModulInteraktif(this)" style="background:#e74c3c; color:#ffffff; border:none; padding:4px 9px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;" title="Hapus Modul">🗑️</button>' +
            '</div>' +
        '</div>' +
        '<div class="vi-external-edit-bar">✍️ Mode Edit Aktif: Tarik langsung balok konsep untuk memindahkan posisinya, klik [+] untuk menambah sub-cabang, atau klik teks untuk mengedit.</div>' +
        '<div class="vi-card-body" style="width:100%; height:720px; background:#0f172a; position:relative; overflow:hidden;">' +
            '<iframe class="vi-capsule-iframe" data-vi-frame-id="' + frameId + '" data-vi-raw-h="720" srcdoc="' + safeSrcdoc + '" style="width:100%; height:720px; border:none; display:block; background:#0f172a; transform-origin:top left;" scrolling="no" allowfullscreen></iframe>' +
        '</div>' +
    '</div>';
};

// 13. AUTO-UPGRADE, LOCK CONTENT BLOCK, & RE-HYDRATE MODUL SAAT HALAMAN DIMUAT
window.segarkanModulInteraktifDiDOM = function() {
    document.querySelectorAll(".modul-interaktif-card").forEach(function(card) {
        let parentBlok = card.closest(".content-block");
        if (parentBlok) {
            parentBlok.classList.add("vi-dedicated-block");
            parentBlok.removeAttribute("contenteditable");
            Array.from(parentBlok.childNodes).forEach(function(node) {
                if (node !== card) node.remove();
            });
            let bIdx = parseInt(parentBlok.getAttribute("data-index"), 10);
            if (!isNaN(bIdx) && window.contentBlocksData && window.contentBlocksData[bIdx] && window.contentBlocksData[bIdx].type === "text") {
                window.contentBlocksData[bIdx].html = card.outerHTML;
            }
        }

        if (card._viHydratedSession === true) return;
        card._viHydratedSession = true;
        card.removeAttribute("data-vi-hydrated");
        card.removeAttribute("data-vi-overrides");

        let judul = decodeURIComponent(card.getAttribute("data-vi-title") || "Modul Visual Interaktif");
        let kode = decodeURIComponent(card.getAttribute("data-vi-code") || "");
        if (!kode) return;

        if (/\.Hahai+hai+/i.test(kode)) {
            kode = kode.replace(/\.Hahai+hai+/gi, ".");
            card.setAttribute("data-vi-code", encodeURIComponent(kode));
        }

        card.style.margin = "0 auto";
        card.style.width = "100%";
        card.style.maxWidth = "100%";

        if (!card.getAttribute("data-vi-scale-mode") || card.getAttribute("data-vi-scale-mode") === "auto") {
            card.setAttribute("data-vi-scale-mode", "responsive");
        }

        let headerEl = card.querySelector(".vi-card-header");
        let existingBar = card.querySelector(".vi-external-edit-bar");
        if (headerEl && !existingBar) {
            let extBar = document.createElement("div");
            extBar.className = "vi-external-edit-bar";
            extBar.innerHTML = "✍️ Mode Edit Aktif: Tarik langsung balok konsep untuk memindahkan posisinya, klik [+] untuk menambah sub-cabang, atau klik teks untuk mengedit.";
            headerEl.after(extBar);
        } else if (existingBar) {
            existingBar.innerHTML = "✍️ Mode Edit Aktif: Tarik langsung balok konsep untuk memindahkan posisinya, klik [+] untuk menambah sub-cabang, atau klik teks untuk mengedit.";
        }

        let headerBtnBox = card.querySelector(".vi-card-header > div:last-child");
        if (headerBtnBox) {
            let btnFullOld = headerBtnBox.querySelector('[onclick*="toggleFullscreenModulVI"]');
            if (btnFullOld) btnFullOld.remove();

            if (!headerBtnBox.querySelector('[onclick*="toggleModeSkalaModulVI"]')) {
                let btnScale = document.createElement("button");
                btnScale.type = "button";
                btnScale.setAttribute("onclick", "window.toggleModeSkalaModulVI(this)");
                btnScale.style.cssText = "background:rgba(255,255,255,0.16); color:#bae6fd; border:1px solid rgba(255,255,255,0.3); padding:4px 9px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;";
                btnScale.title = "Ganti Mode HP (Portrait) / Mode Kanvas (Landscape Melebar)";
                btnScale.innerHTML = "📱 Mode HP";
                headerBtnBox.insertBefore(btnScale, headerBtnBox.firstChild);
            }
            if (!headerBtnBox.querySelector('[onclick*="ubahKecepatanAnimasiModulVI"]')) {
                let btnSpd = document.createElement("button");
                btnSpd.type = "button";
                btnSpd.className = "vi-btn-speed";
                btnSpd.setAttribute("onclick", "window.ubahKecepatanAnimasiModulVI(this)");
                btnSpd.style.cssText = "background:rgba(255,255,255,0.16); color:#fde047; border:1px solid rgba(255,255,255,0.3); padding:4px 9px; border-radius:8px; font-size:11px; font-weight:800; cursor:pointer;";
                btnSpd.title = "Ubah Kecepatan Animasi (0.5x / 1x / 2x)";
                btnSpd.innerHTML = "⚡ 1x";
                let resetBtn = headerBtnBox.querySelector('[onclick*="reloadModulInteraktif"]');
                if (resetBtn) headerBtnBox.insertBefore(btnSpd, resetBtn);
                else headerBtnBox.appendChild(btnSpd);
            }
            if (!headerBtnBox.querySelector('[onclick*="toggleInlineEditTeksVI"]')) {
                let btnEditTxt = document.createElement("button");
                btnEditTxt.type = "button";
                btnEditTxt.className = "vi-admin-only-btn vi-btn-edit-text";
                btnEditTxt.setAttribute("onclick", "window.toggleInlineEditTeksVI(this)");
                btnEditTxt.style.cssText = "background:#8e44ad; color:#ffffff; border:1px solid #c084fc; padding:4px 9px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;";
                btnEditTxt.title = "Edit Teks & Tambah Sub-Informasi [+] di Layar";
                btnEditTxt.innerHTML = "✍️ Edit Teks";
                let editCodeBtn = headerBtnBox.querySelector('[onclick*="editModulInteraktif"]');
                if (editCodeBtn) {
                    editCodeBtn.innerHTML = "✏️ Kode";
                    headerBtnBox.insertBefore(btnEditTxt, editCodeBtn);
                } else {
                    headerBtnBox.appendChild(btnEditTxt);
                }
            }
        }

        let iframe = card.querySelector("iframe.vi-capsule-iframe");
        if (iframe) {
            let frameId = iframe.getAttribute("data-vi-frame-id") || ("vi_frame_" + Date.now() + "_" + Math.floor(Math.random() * 1000));
            iframe.setAttribute("data-vi-frame-id", frameId);
            iframe.onload = function() {
                window.sesuaikanSkalaSatuModulVI(card);
            };
            iframe.srcdoc = window.generateKapsulModul(judul, kode, "", frameId);
            window.sesuaikanSkalaSatuModulVI(card);
        }
    });
};

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(window.segarkanModulInteraktifDiDOM, 250);
    let cont = document.getElementById("blocks-container");
    if (cont && window.MutationObserver) {
        let obsVI = new MutationObserver(function() {
            window.segarkanModulInteraktifDiDOM();
        });
        obsVI.observe(cont, { childList: true, subtree: true });
    }
});

// 14. PRATINJAU MODUL SEMENTARA DI DALAM MODAL (PROPORSI HP PERSEGI PANJANG 410x720)
window.previewModulSementara = function() {
    let judul = (document.getElementById("vi-input-judul").value || "").trim() || "Pratinjau Modul Interaktif";
    let htmlCode = (document.getElementById("vi-input-html").value || "").trim();

    if (!htmlCode) {
        return alert("⚠️ Silakan paste kode HTML visual interaktif pada Kolom 2 terlebih dahulu!");
    }

    let cont = document.getElementById("vi-preview-container");
    let frame = document.getElementById("vi-preview-frame");
    if (!cont || !frame) return;

    let previewFrameId = "vi_preview_modal_frame";
    frame.setAttribute("data-vi-frame-id", previewFrameId);
    frame.style.maxWidth = "410px";
    frame.style.height = "720px";
    cont.style.display = "block";
    frame.onload = function() {
        if (frame.contentWindow) {
            frame.contentWindow.postMessage({ type: "MAHARDIKA_VI_SET_LAYOUT_MODE", mode: "responsive" }, "*");
        }
    };
    frame.srcdoc = window.generateKapsulModul(judul, htmlCode, "", previewFrameId);
};

// 15. SIMPAN & BUAT CONTENT BLOCK KHUSUS MODUL INTERAKTIF (TERPISAH DARI BLOK TEKS LAIN)
window.simpanDanPasangModul = function() {
    let judul = (document.getElementById("vi-input-judul").value || "").trim() || "Modul Visual Interaktif";
    let htmlCode = (document.getElementById("vi-input-html").value || "").trim();

    if (!htmlCode) {
        return alert("⚠️ Kolom kode HTML tidak boleh kosong!");
    }

    if (window.viTargetEditElement && document.body.contains(window.viTargetEditElement)) {
        let card = window.viTargetEditElement;
        card.setAttribute("data-vi-title", encodeURIComponent(judul));
        card.setAttribute("data-vi-code", encodeURIComponent(htmlCode));
        card._viHydratedSession = true;

        let titleEl = card.querySelector(".vi-card-title-text");
        if (titleEl) titleEl.innerText = judul;

        let iframe = card.querySelector("iframe.vi-capsule-iframe");
        if (iframe) {
            let fId = iframe.getAttribute("data-vi-frame-id") || ("vi_frame_" + Date.now());
            iframe.setAttribute("data-vi-frame-id", fId);
            iframe.onload = function() {
                window.sesuaikanSkalaSatuModulVI(card);
            };
            iframe.srcdoc = window.generateKapsulModul(judul, htmlCode, "", fId);
            window.sesuaikanSkalaSatuModulVI(card);
        }

        let parentBlok = card.closest(".content-block");
        if (parentBlok) {
            let bIdx = parseInt(parentBlok.getAttribute("data-index"), 10);
            if (!isNaN(bIdx) && window.contentBlocksData && window.contentBlocksData[bIdx]) {
                if (window.contentBlocksData[bIdx].type === "modul_interaktif") {
                    window.contentBlocksData[bIdx].judul = judul;
                    window.contentBlocksData[bIdx].htmlCode = htmlCode;
                    window.contentBlocksData[bIdx].cssCode = "";
                } else {
                    window.contentBlocksData[bIdx].html = card.outerHTML;
                }
            }
        }

        window.viTargetEditElement = null;
        window.tutupModal("modal-modul-interaktif");
        if (typeof window.simpanKeDB === "function") window.simpanKeDB();
        return;
    }

    let newModulBlock = {
        type: "modul_interaktif",
        judul: judul,
        htmlCode: htmlCode,
        cssCode: "",
        bg: "transparent",
        pattern: "",
        color: "#333333",
        width: "M",
        padTop: "20px",
        padBot: "20px",
        drawing: "",
        floatImages: []
    };

    if (!Array.isArray(window.contentBlocksData)) window.contentBlocksData = [];

    let lastIdx = window.contentBlocksData.length - 1;
    if (lastIdx >= 0 && window.contentBlocksData[lastIdx].type === "text") {
        let rawH = (window.contentBlocksData[lastIdx].html || "").replace(/<[^>]+>/g, "").trim();
        if (rawH === "Ketik materi..." || rawH === "") {
            window.contentBlocksData[lastIdx] = newModulBlock;
        } else {
            window.contentBlocksData.push(newModulBlock);
        }
    } else {
        window.contentBlocksData.push(newModulBlock);
    }

    window.tutupModal("modal-modul-interaktif");
    if (typeof window.renderBlocks === "function") window.renderBlocks();
    setTimeout(window.segarkanModulInteraktifDiDOM, 80);
    if (typeof window.simpanKeDB === "function") window.simpanKeDB();
};

// =========================================================================
// 16. MODAL GENERATOR PROMPT AI TERPADU (DENGAN ATLAS MEDIS WIKIMEDIA / OPENSTAX UNTUK 2D)
// =========================================================================
window.KATALOG_ATLAS_2D_WIKIMEDIA = [
    { label: "🔬 Nefron Ginjal (OpenStax)", url: "https://upload.wikimedia.org/wikipedia/commons/2/27/2611_Blood_Flow_in_the_Nephron.jpg" },
    { label: "🫘 Penampang Ginjal (OpenStax)", url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/2610_The_Kidney.jpg" },
    { label: "🌿 Sel Tumbuhan Detail", url: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Plant_cell_structure-en.svg" },
    { label: "🧬 Sel Hewan Detail", url: "https://upload.wikimedia.org/wikipedia/commons/1/11/Animal_cell_structure_en.svg" },
    { label: "⚡ Sel Saraf / Neuron", url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Neuron.svg" },
    { label: "🫁 Alveolus & Pertukaran Gas", url: "https://upload.wikimedia.org/wikipedia/commons/3/36/2309_The_Respiratory_Zone.jpg" },
    { label: "🫀 Penampang Dalam Jantung", url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Diagram_of_the_human_heart_%28cropped%29.svg" },
    { label: "👁️ Anatomi Dalam Mata", url: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Schematic_diagram_of_the_human_eye_en.svg" },
    { label: "👂 Anatomi Dalam Telinga", url: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Anatomy_of_the_Human_Ear_blank.svg" },
    { label: "🔋 Struktur Mitokondria", url: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Animal_mitochondrion_diagram_en.svg" },
    { label: "🍃 Struktur Kloroplas", url: "https://upload.wikimedia.org/wikipedia/commons/4/49/Chloroplast_II.svg" },
    { label: "🦠 Struktur Sel Bakteri", url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Average_prokaryote_cell-_en.svg" }
];

window.DAFTAR_PLACEHOLDER_DETAIL_VI = {
    peta_konsep:
        "Gunakan kode hierarki (1, 1a, 1aa, 1ab, 1b, 1ba) agar cabang peta konsep terbentuk rapi:\n" +
        "1 Monera (Prokariota)\n" +
        "1a Anatomi & Struktur Sel\n" +
        "1aa Gram Positif (Peptidoglikan tebal, ungu kristal violet)\n" +
        "1ab Gram Negatif (Peptidoglikan tipis + membran luar LPS, merah safranin)",
    anatomi_3d:
        "Tuliskan model 3D anatomi yang akan dimuat beserta daftar struktur titik hotspot penjelasannya:\n" +
        "- Model 3D: [Pilih salah satu: heart / brain / lungs / liver / kidneys / eyeball / intestine / pancreas / skin]\n" +
        "- Titik 1: (Nama bagian & Penjelasan struktur/fungsinya)\n" +
        "- Titik 2: (Nama bagian & Penjelasan struktur/fungsinya)\n" +
        "- Fitur 3D Wajib: Sediakan tombol Cross-Section (irisan), X-Ray, Auto-Rotate, dan Reset Kamera.",
    anatomi_2d:
        "- URL Gambar Referensi Atlas Medis: https://upload.wikimedia.org/wikipedia/commons/2/27/2611_Blood_Flow_in_the_Nephron.jpg\n" +
        "- Titik Hotspot yang Wajib Dipasang di Atas Gambar:\n" +
        "1. Glomerulus & Kapsula Bowman (Badan Malpighi): Tempat filtrasi darah menghasilkan urin primer.\n" +
        "2. Tubulus Kontortus Proksimal: Tempat reabsorpsi zat berguna (glukosa, asam amino) menghasilkan urin sekunder.\n" +
        "3. Lengkung Henle (Desendens & Asendens): Memelihara gradien osmotik medula ginjal & reabsorpsi air/NaCl.\n" +
        "4. Tubulus Kontortus Distal: Tempat augmentasi (sekresi H+, K+, NH3) menghasilkan urin sesungguhnya.\n" +
        "5. Tubulus Kolektivus: Saluran pengumpul urin menuju pelvis renalis.",
    fisiologi:
        "Tuliskan urutan mekanisme fisiologis, gerakan organ, dan variabel laju yang bisa diatur:\n" +
        "- Siklus Peredaran Darah Ganda: Vena Kava -> Atrium Kanan (RA) -> Ventrikel Kanan (RV) -> Arteri Pulmonalis -> Paru-paru -> ...\n" +
        "- Gerakan Fisiologis: Otot jantung memompa (Sistol/Diastol), katup membuka-menutup, sel darah mengalir.\n" +
        "- Kontrol Laju (Di Bawah Kanvas): Slider Laju Detak Jantung (40 - 160 BPM).",
    eksperimen:
        "Tuliskan objek spesimen, alat laboratorium, variabel perlakuan, dan reaksi biologisnya:\n" +
        "- Spesimen Uji: 1. Sel Tumbuhan, 2. Sel Hewan (Eritrosit).\n" +
        "- Perlakuan Larutan: Hipotonik (Aquades), Isotonik (NaCl 0.9%), Hipertonik (NaCl 5%).\n" +
        "- Reaksi Visual: Membran plasma sel tumbuhan terlepas dari dinding sel (Plasmolisis) saat Hipertonik.",
    bagan_proses:
        "Tuliskan urutan kotak alur proses beserta label pemicu/enzim di atas atau di bawah panahnya:\n" +
        "1. [Trombosit pecah] --(mengeluarkan)--> [Trombokinase]\n" +
        "2. [Trombokinase] --(faktor antihemofilia)--> memicu [Protrombin]\n" +
        "3. [Protrombin] --(atas panah: Vitamin K | bawah panah: Ca++ ion kalsium)--> [Trombin]"
};

window.pastikanModalGeneratorPromptVIAda = function() {
    if (document.getElementById("modal-generator-prompt-vi")) return;

    let presetBtnsHtml = window.KATALOG_ATLAS_2D_WIKIMEDIA.map(function(item) {
        return '<button type="button" onclick="window.pilihGambarAtlas2D(\'' + item.url + '\', \'' + item.label.replace(/'/g, "") + '\')" style="background:#ffffff; color:#0369a1; border:1px solid #bae6fd; padding:4px 9px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer;">' + item.label + '</button>';
    }).join("");

    let modal = document.createElement("div");
    modal.id = "modal-generator-prompt-vi";
    modal.className = "modal-overlay";
    modal.onclick = function(e) {
        if (e.target === modal) window.tutupModal("modal-generator-prompt-vi");
    };

    modal.innerHTML =
        '<div class="modal-box" style="width: 790px; max-width: 96vw; max-height: 92vh; display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.35);">' +
            '<div class="modal-header" style="background: linear-gradient(135deg, #0f172a, #0284c7); color: white; padding: 14px 20px;">' +
                '<div>' +
                    '<h3 style="margin:0; font-size:16px; display:flex; align-items:center; gap:8px;">🤖 Generator Prompt AI Visual Interaktif</h3>' +
                    '<div style="font-size:11px; color:#bae6fd; margin-top:2px;">Susun perintah AI spesifik sesuai Mata Pelajaran, Jenis Visual, dan Referensi Atlas Ilmiah</div>' +
                '</div>' +
                '<button type="button" class="close-btn" style="color:white;" onclick="window.tutupModal(\'modal-generator-prompt-vi\')">✕</button>' +
            '</div>' +
            '<div class="modal-body" style="padding: 18px 20px; overflow-y: auto; background: #f8fafc; display: flex; flex-direction: column; gap: 14px;">' +

                '<div>' +
                    '<label style="font-weight:800; font-size:12.5px; color:#0f172a; display:block; margin-bottom:7px;">1. Pilih Mata Pelajaran:</label>' +
                    '<div id="vi-gen-mapel-group" style="display:flex; flex-wrap:wrap; gap:8px;">' +
                        '<button type="button" class="vi-pill-mapel active" data-val="Biologi" onclick="window.pilihMapelPromptVI(\'Biologi\', this)">🧬 Biologi</button>' +
                        '<button type="button" class="vi-pill-mapel" data-val="Fisika" onclick="window.pilihMapelPromptVI(\'Fisika\', this)">⚛️ Fisika</button>' +
                        '<button type="button" class="vi-pill-mapel" data-val="Kimia" onclick="window.pilihMapelPromptVI(\'Kimia\', this)">🧪 Kimia</button>' +
                        '<button type="button" class="vi-pill-mapel" data-val="Matematika" onclick="window.pilihMapelPromptVI(\'Matematika\', this)">📐 Matematika</button>' +
                        '<button type="button" class="vi-pill-mapel" data-val="IPA Terpadu" onclick="window.pilihMapelPromptVI(\'IPA Terpadu\', this)">🔬 IPA Terpadu</button>' +
                        '<button type="button" class="vi-pill-mapel" data-val="Sains Umum" onclick="window.pilihMapelPromptVI(\'Sains Umum\', this)">🌍 Sains Umum</button>' +
                    '</div>' +
                '</div>' +

                '<div>' +
                    '<label style="font-weight:800; font-size:12.5px; color:#0f172a; display:block; margin-bottom:7px;">2. Pilih Jenis Visual Interaktif:</label>' +
                    '<div id="vi-gen-visual-group" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(122px, 1fr)); gap:8px;">' +
                        '<button type="button" class="vi-card-visual active" data-val="peta_konsep" onclick="window.pilihVisualPromptVI(\'peta_konsep\', this)">' +
                            '<div style="font-size:20px; margin-bottom:3px;">🗺️</div>' +
                            '<div style="font-weight:800; font-size:12px;">Peta Konsep</div>' +
                            '<div style="font-size:10px; opacity:0.8; line-height:1.25; margin-top:2px;">Kapsul 1 baris, Hierarki 1a</div>' +
                        '</button>' +
                        '<button type="button" class="vi-card-visual" data-val="anatomi_3d" onclick="window.pilihVisualPromptVI(\'anatomi_3d\', this)">' +
                            '<div style="font-size:20px; margin-bottom:3px;">🧊</div>' +
                            '<div style="font-weight:800; font-size:12px;">Anatomi 3D</div>' +
                            '<div style="font-size:10px; opacity:0.8; line-height:1.25; margin-top:2px;">9 Organ Three.js & X-Ray</div>' +
                        '</button>' +
                        '<button type="button" class="vi-card-visual" data-val="anatomi_2d" onclick="window.pilihVisualPromptVI(\'anatomi_2d\', this)">' +
                            '<div style="font-size:20px; margin-bottom:3px;">🫀</div>' +
                            '<div style="font-weight:800; font-size:12px;">Anatomi 2D</div>' +
                            '<div style="font-size:10px; opacity:0.8; line-height:1.25; margin-top:2px;">Atlas Medis Wikimedia + Pin</div>' +
                        '</button>' +
                        '<button type="button" class="vi-card-visual" data-val="fisiologi" onclick="window.pilihVisualPromptVI(\'fisiologi\', this)">' +
                            '<div style="font-size:20px; margin-bottom:3px;">⚡</div>' +
                            '<div style="font-weight:800; font-size:12px;">Fisiologi (Proses)</div>' +
                            '<div style="font-size:10px; opacity:0.8; line-height:1.25; margin-top:2px;">Animasi 60fps & bar laju</div>' +
                        '</button>' +
                        '<button type="button" class="vi-card-visual" data-val="eksperimen" onclick="window.pilihVisualPromptVI(\'eksperimen\', this)">' +
                            '<div style="font-size:20px; margin-bottom:3px;">🧪</div>' +
                            '<div style="font-weight:800; font-size:12px;">Eksperimen</div>' +
                            '<div style="font-size:10px; opacity:0.8; line-height:1.25; margin-top:2px;">Spesimen & variabel uji</div>' +
                        '</button>' +
                        '<button type="button" class="vi-card-visual" data-val="bagan_proses" onclick="window.pilihVisualPromptVI(\'bagan_proses\', this)">' +
                            '<div style="font-size:20px; margin-bottom:3px;">🔄</div>' +
                            '<div style="font-weight:800; font-size:12px;">Bagan Proses</div>' +
                            '<div style="font-size:10px; opacity:0.8; line-height:1.25; margin-top:2px;">Skema alur & panah label</div>' +
                        '</button>' +
                    '</div>' +
                '</div>' +

                '<!-- PANEL KHUSUS ANATOMI 2D: KATALOG & PENCARI GAMBAR ATLAS MEDIS WIKIMEDIA / OPENSTAX -->' +
                '<div id="vi-atlas-2d-helper-box" style="display:none; background:#f0f9ff; border:2px solid #7dd3fc; border-radius:12px; padding:12px;">' +
                    '<div style="font-weight:800; font-size:12px; color:#0369a1; margin-bottom:6px;">🔬 Pilih Referensi Gambar Atlas Anatomi 2D (Wikimedia Commons / OpenStax):</div>' +
                    '<div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px;">' + presetBtnsHtml + '</div>' +
                    '<div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">' +
                        '<input type="text" id="vi-wikimedia-search-inp" class="input-box" placeholder="Cari diagram ilmiah lain di Wikimedia (ketik Bhs Inggris/Latin, misal: nephron, alveolus)..." style="margin:0; flex:1; min-width:200px; font-size:11.5px; padding:6px 10px; background:#fff;">' +
                        '<button type="button" onclick="window.cariGambarAtlasWikimediaVI()" style="background:#0284c7; color:#fff; border:none; padding:7px 12px; border-radius:8px; font-size:11.5px; font-weight:800; cursor:pointer;">🔍 Cari Atlas</button>' +
                    '</div>' +
                    '<div id="vi-wikimedia-search-results" style="display:none; grid-template-columns:repeat(auto-fill, minmax(110px, 1fr)); gap:8px; margin-top:8px; max-height:165px; overflow-y:auto; padding:6px; background:#fff; border-radius:8px; border:1px solid #bae6fd;"></div>' +
                    '<div style="margin-top:7px;">' +
                        '<label style="font-size:11px; font-weight:700; color:#0f172a;">URL Gambar Referensi Terpilih (Akan dikirim ke AI):</label>' +
                        '<input type="text" id="vi-gen-ref-img-url" class="input-box" placeholder="https://upload.wikimedia.org/..." style="margin:3px 0 0 0; font-size:11px; padding:5px 8px; background:#fff; font-family:Consolas, monospace;">' +
                    '</div>' +
                '</div>' +

                '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">' +
                    '<div>' +
                        '<label style="font-weight:800; font-size:12.5px; color:#0f172a; display:block; margin-bottom:5px;">3. Nama Bab Materi:</label>' +
                        '<input type="text" id="vi-gen-bab" class="input-box" placeholder="Contoh: Sistem Ekskresi Manusia" style="margin:0; font-weight:700; border:2px solid #cbd5e1;">' +
                    '</div>' +
                    '<div>' +
                        '<label style="font-weight:800; font-size:12.5px; color:#0f172a; display:block; margin-bottom:5px;">4. Topik Inti Visual Interaktif:</label>' +
                        '<input type="text" id="vi-gen-topik" class="input-box" placeholder="Contoh: Anatomi Mikroskopis Nefron Ginjal" style="margin:0; font-weight:700; border:2px solid #cbd5e1;">' +
                    '</div>' +
                '</div>' +

                '<div>' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; flex-wrap:wrap; gap:4px;">' +
                        '<label id="vi-gen-detail-label" style="font-weight:800; font-size:12.5px; color:#0f172a;">5. Detail Materi / Susunan Hierarki (1, 1a, 1aa, 1ab, 1b, 1ba):</label>' +
                        '<button type="button" onclick="window.isiContohFormGeneratorVI()" style="background:#e0f2fe; color:#0369a1; border:1px solid #7dd3fc; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:700; cursor:pointer;">💡 Isi Contoh Sesuai Jenis Visual</button>' +
                    '</div>' +
                    '<textarea id="vi-gen-detail" class="input-box" rows="6" placeholder="' + window.DAFTAR_PLACEHOLDER_DETAIL_VI.peta_konsep.replace(/"/g, '&quot;') + '" style="margin:0; font-family:Consolas, monospace; font-size:12px; line-height:1.5; border:2px solid #cbd5e1; resize:vertical;"></textarea>' +
                '</div>' +

                '<button type="button" class="btn-action" style="background:linear-gradient(135deg, #0284c7, #0b3954); width:100%; padding:12px; font-size:14px; font-weight:800; border-radius:10px; box-shadow:0 6px 15px rgba(2,132,199,0.25);" onclick="window.eksekusiGeneratePromptVI()">⚡ Generate Prompt AI Lengkap</button>' +

                '<div id="vi-gen-result-box" style="display:none; background:#0f172a; border:2px solid #38bdf8; border-radius:12px; padding:14px;">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">' +
                        '<span style="color:#38bdf8; font-weight:800; font-size:12px;">✅ Prompt AI Siap Dicopy (Berikan ke ChatGPT / Claude / Gemini):</span>' +
                        '<button type="button" id="btn-copy-hasil-prompt-vi" class="btn-action" style="background:#16a34a; width:auto; padding:6px 16px; font-size:12px; font-weight:800; border-radius:8px;" onclick="window.copyHasilGeneratePromptVI()">📋 Copy Prompt Ini</button>' +
                    '</div>' +
                    '<textarea id="vi-gen-output-text" readonly style="width:100%; height:190px; background:#1e293b; color:#e2e8f0; border:1px solid #334155; border-radius:8px; padding:10px; font-family:Consolas, monospace; font-size:11.5px; line-height:1.45; resize:vertical; outline:none;"></textarea>' +
                '</div>' +

            '</div>' +
        '</div>';

    document.body.appendChild(modal);

    if (!document.getElementById("vi-prompt-gen-styles")) {
        let st = document.createElement("style");
        st.id = "vi-prompt-gen-styles";
        st.innerHTML =
            ".vi-pill-mapel { background:#ffffff; color:#334155; border:2px solid #cbd5e1; padding:7px 14px; border-radius:20px; font-size:12px; font-weight:800; cursor:pointer; transition:0.18s; }" +
            ".vi-pill-mapel:hover { border-color:#0284c7; color:#0284c7; }" +
            ".vi-pill-mapel.active { background:#0284c7; color:#ffffff; border-color:#0284c7; box-shadow:0 4px 10px rgba(2,132,199,0.3); }" +
            ".vi-card-visual { background:#ffffff; color:#1e293b; border:2px solid #cbd5e1; padding:10px 8px; border-radius:12px; text-align:center; cursor:pointer; transition:0.18s; display:flex; flex-direction:column; align-items:center; justify-content:center; }" +
            ".vi-card-visual:hover { border-color:#0284c7; transform:translateY(-2px); }" +
            ".vi-card-visual.active { background:#f0f9ff; color:#0369a1; border-color:#0284c7; box-shadow:0 4px 12px rgba(2,132,199,0.22); }";
        document.head.appendChild(st);
    }
};

window.pilihGambarAtlas2D = function(url, label) {
    let inpUrl = document.getElementById("vi-gen-ref-img-url");
    if (inpUrl) inpUrl.value = url;
    let inpTopik = document.getElementById("vi-gen-topik");
    if (inpTopik && !inpTopik.value.trim() && label) {
        inpTopik.value = "Anatomi 2D: " + label.replace(/^[^\w]+/, "");
    }
};

window.cariGambarAtlasWikimediaVI = function() {
    let q = (document.getElementById("vi-wikimedia-search-inp").value || "").trim();
    if (!q) return alert("Ketik kata kunci organ/struktur terlebih dahulu (contoh: nephron, alveolus, neuron, mitosis)!");
    let resBox = document.getElementById("vi-wikimedia-search-results");
    resBox.style.display = "grid";
    resBox.innerHTML = '<div style="grid-column:1/-1; font-size:11px; color:#0284c7; font-weight:700;">⏳ Mencari ilustrasi medis di Wikimedia Commons...</div>';

    let apiUrl = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
                 encodeURIComponent(q + " diagram OR anatomy") +
                 "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*";

    fetch(apiUrl)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (!data.query || !data.query.pages) {
                resBox.innerHTML = '<div style="grid-column:1/-1; font-size:11px; color:#dc2626;">Tidak ditemukan gambar untuk kata kunci tersebut. Coba istilah bahasa Inggris/Latin (misal: nephron, heart diagram, plant cell).</div>';
                return;
            }
            let pages = Object.values(data.query.pages);
            resBox.innerHTML = "";
            pages.forEach(function(p) {
                if (!p.imageinfo || !p.imageinfo[0]) return;
                let info = p.imageinfo[0];
                let fullUrl = info.url;
                let thumbUrl = info.thumburl || fullUrl;
                let shortTitle = (p.title || "").replace(/^File:/i, "").replace(/\.(svg|png|jpg|jpeg)$/i, "");
                let itemDiv = document.createElement("div");
                itemDiv.style.cssText = "border:1px solid #cbd5e1; border-radius:8px; padding:4px; cursor:pointer; background:#f8fafc; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:space-between;";
                itemDiv.innerHTML =
                    '<img src="' + thumbUrl + '" style="width:100%; height:70px; object-fit:contain; background:#fff; border-radius:4px;">' +
                    '<div style="font-size:9.5px; font-weight:700; color:#1e293b; margin-top:4px; line-height:1.2; max-height:24px; overflow:hidden;">' + shortTitle + '</div>';
                itemDiv.onclick = function() {
                    window.pilihGambarAtlas2D(fullUrl, shortTitle);
                    resBox.querySelectorAll("div").forEach(function(d) { d.style.borderColor = "#cbd5e1"; });
                    itemDiv.style.borderColor = "#0284c7";
                    itemDiv.style.background = "#e0f2fe";
                };
                resBox.appendChild(itemDiv);
            });
        })
        .catch(function() {
            resBox.innerHTML = '<div style="grid-column:1/-1; font-size:11px; color:#dc2626;">Gagal menghubungi Wikimedia API. Silakan pilih dari tombol katalog di atas.</div>';
        });
};

window.pilihMapelPromptVI = function(namaMapel, btnEl) {
    window.viPromptGenState.mapel = namaMapel;
    document.querySelectorAll("#vi-gen-mapel-group .vi-pill-mapel").forEach(function(b) {
        b.classList.remove("active");
    });
    if (btnEl) btnEl.classList.add("active");
};

window.pilihVisualPromptVI = function(kodeVisual, btnEl) {
    window.viPromptGenState.visual = kodeVisual;
    document.querySelectorAll("#vi-gen-visual-group .vi-card-visual").forEach(function(b) {
        b.classList.remove("active");
    });
    if (btnEl) btnEl.classList.add("active");

    let helper2D = document.getElementById("vi-atlas-2d-helper-box");
    if (helper2D) {
        helper2D.style.display = (kodeVisual === "anatomi_2d") ? "block" : "none";
    }

    let lbl = document.getElementById("vi-gen-detail-label");
    let txt = document.getElementById("vi-gen-detail");
    if (lbl) {
        lbl.innerText = kodeVisual === "peta_konsep"
            ? "5. Detail Materi / Susunan Hierarki Peta Konsep (Gunakan kode 1, 1a, 1aa, 1ab, 1b, 1ba):"
            : "5. Detail Materi Lengkap (Isi Materi / Tahapan / Struktur yang Wajib Masuk):";
    }
    if (txt && window.DAFTAR_PLACEHOLDER_DETAIL_VI[kodeVisual]) {
        txt.placeholder = window.DAFTAR_PLACEHOLDER_DETAIL_VI[kodeVisual];
    }
};

window.isiContohFormGeneratorVI = function() {
    let v = window.viPromptGenState.visual || "peta_konsep";
    let inpBab = document.getElementById("vi-gen-bab");
    let inpTopik = document.getElementById("vi-gen-topik");
    let inpDetail = document.getElementById("vi-gen-detail");
    let inpRefUrl = document.getElementById("vi-gen-ref-img-url");

    if (v === "peta_konsep") {
        inpBab.value = "Kingdom Monera (Bakteri & Archaea)";
        inpTopik.value = "Peta Konsep Struktur & Reproduksi Monera";
        inpDetail.value = window.DAFTAR_PLACEHOLDER_DETAIL_VI.peta_konsep;
    } else if (v === "anatomi_3d") {
        inpBab.value = "Sistem Saraf Pusat Manusia";
        inpTopik.value = "Atlas Anatomi 3D: Struktur Otak Manusia";
        inpDetail.value = window.DAFTAR_PLACEHOLDER_DETAIL_VI.anatomi_3d;
    } else if (v === "anatomi_2d") {
        inpBab.value = "Sistem Ekskresi Manusia";
        inpTopik.value = "Anatomi Struktur Mikroskopis Nefron Ginjal";
        if (inpRefUrl) inpRefUrl.value = "https://upload.wikimedia.org/wikipedia/commons/2/27/2611_Blood_Flow_in_the_Nephron.jpg";
        inpDetail.value = window.DAFTAR_PLACEHOLDER_DETAIL_VI.anatomi_2d;
    } else if (v === "fisiologi") {
        inpBab.value = "Sistem Peredaran Darah Manusia";
        inpTopik.value = "Fisiologi Siklus Peredaran Darah & Laju Detak Jantung";
        inpDetail.value = window.DAFTAR_PLACEHOLDER_DETAIL_VI.fisiologi;
    } else if (v === "eksperimen") {
        inpBab.value = "Transpor Membran Sel";
        inpTopik.value = "Eksperimen Osmosis pada Sel Tumbuhan & Sel Hewan";
        inpDetail.value = window.DAFTAR_PLACEHOLDER_DETAIL_VI.eksperimen;
    } else {
        inpBab.value = "Sistem Peredaran Darah Manusia";
        inpTopik.value = "Bagan Proses Pembekuan Darah (Hemostasis)";
        inpDetail.value = window.DAFTAR_PLACEHOLDER_DETAIL_VI.bagan_proses;
    }
    window.eksekusiGeneratePromptVI();
};

window.salinPromptAIModul = function() {
    window.pastikanModalGeneratorPromptVIAda();
    let curJudul = (document.getElementById("vi-input-judul") ? document.getElementById("vi-input-judul").value : "").trim();
    let inpTopik = document.getElementById("vi-gen-topik");
    if (curJudul && inpTopik && !inpTopik.value.trim()) {
        inpTopik.value = curJudul;
    }
    window.bukaModal("modal-generator-prompt-vi");
};

window.eksekusiGeneratePromptVI = function() {
    let mapel = window.viPromptGenState.mapel || "Biologi";
    let visual = window.viPromptGenState.visual || "peta_konsep";
    let bab = (document.getElementById("vi-gen-bab").value || "").trim() || "Materi " + mapel;
    let topik = (document.getElementById("vi-gen-topik").value || "").trim();
    let detail = (document.getElementById("vi-gen-detail").value || "").trim();
    let refImgUrl = (document.getElementById("vi-gen-ref-img-url") ? document.getElementById("vi-gen-ref-img-url").value : "").trim();

    if (!topik) return alert("⚠️ Mohon isi Kolom 4 (Topik Inti) terlebih dahulu!");
    if (!detail) return alert("⚠️ Mohon isi Kolom 5 (Detail Materi Lengkap)!");

    let inpJudulUtama = document.getElementById("vi-input-judul");
    if (inpJudulUtama && !inpJudulUtama.value.trim()) inpJudulUtama.value = topik;

    let instruksiVisualKhusus = "";
    let namaVisualLabel = "";

    if (visual === "peta_konsep") {
        namaVisualLabel = "PETA KONSEP BERJENJANG (KAPSUL HORIZONTAL 1 BARIS RAPI)";
        instruksiVisualKhusus =
`3. SPESIFIKASI VISUAL KHUSUS — PETA KONSEP BERJENJANG (KODE HIERARKI 1, 1a, 1aa, 1ab, 1b, 1ba):
   - JANGAN gunakan partikel aliran energi!
   - DESAIN KAPSUL WAJIB 1 BARIS HORIZONTAL (DILARANG KERAS FLEX-COL / TUMPUK ATAS-BAWAH!):
     * Setiap balok konsep WAJIB berbentuk kapsul/pil 1 baris memanjang ke samping (class="concept-node vi-node-item inline-flex flex-row items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/95 border border-slate-600 shadow-md cursor-pointer absolute -translate-x-1/2 -translate-y-1/2") yang di dalamnya berjejer ke samping: [Badge Kode] [Emoji] [Nama Konsep 1 Baris Tanpa Enter].
   - TATA LETAK KOLOM HIERARKI:
     * Induk Pusat (Root) di tengah kanvas (left: 50%, top: 50%).
     * Cabang Tingkat 1 di kolom dalam kiri (left: 33%) dan kolom dalam kanan (left: 67%).
     * Sub-Cabang Tingkat 2 di kolom luar kiri (left: 11%) dan kolom luar kanan (left: 89%).
   - Dua kotak ringkasan di bagian bawah #info-active diberi judul kontekstual: "INDUK & JALUR HIERARKI" dan "RINCIAN KONSEP / SUB-CABANG".`;
    } else if (visual === "anatomi_3d") {
        namaVisualLabel = "ATLAS ANATOMI 3D INTERAKTIF (THREE.JS GLB MODELS)";
        instruksiVisualKhusus =
`3. SPESIFIKASI VISUAL KHUSUS — ATLAS ANATOMI 3D (MENGGUNAKAN THREE.JS):
   - Gunakan ES Module Three.js (three@0.160.0), OrbitControls, GLTFLoader, dan MeshoptDecoder (dari three/addons/libs/meshopt_decoder.module.js) langsung di dalam 1 file HTML.
   - Base URL Model: https://cdn.jsdelivr.net/gh/thebuggeddev/anatomy@main/public/models/{id}.glb (Ganti {id} dengan: heart, brain, lungs, liver, kidneys, eyeball, intestine, pancreas, atau skin).
   - Standar Render 3D: Gunakan ACESFilmicToneMapping, outputColorSpace = SRGBColorSpace, localClippingEnabled = true, FIT_SIZE = 3.8, kamera di (0, 1.05, 8.2) FOV 34, dan pedestal silinder di (y = -2.5).
   - Letakkan barisan tombol kontrol 3D (Cross-Section, X-Ray, Wireframe, Auto-Rotate, Reset) DI BAWAH #vi-stage-inner-wrap (gunakan class="vi-docked-control-bar flex flex-wrap gap-2").
   - Kotak ringkasan di #info-active: "STRUKTUR PENYUSUN" dan "FUNGSI KLINIS".`;
    } else if (visual === "anatomi_2d") {
        namaVisualLabel = "ATLAS ANATOMI 2D ILMIAH (REFERENSI WIKIMEDIA / OPENSTAX + HOTSPOT INTERAKTIF)";
        let urlpetunjuk = refImgUrl
            ? `window.atlasImageUrl = "${refImgUrl}";`
            : `window.atlasImageUrl = "https://upload.wikimedia.org/wikipedia/commons/2/27/2611_Blood_Flow_in_the_Nephron.jpg"; /* GANTI URL INI JIKA ADA YANG LEBIH COCOK */`;
        instruksiVisualKhusus =
`3. SPESIFIKASI VISUAL KHUSUS — ATLAS ANATOMI 2D BERBASIS REFERENSI MEDIS ASLI:
   - DILARANG KERAS merender gambar atlas menggunakan tag <img> atau <iframe> di dalam HTML!
   - WAJIB gunakan variabel JS ini tepat di dalam <script> utama agar mesin kami bisa merendernya dengan aman bebas CORS:
     ${urlpetunjuk}
   - Di dalam #vi-stage-inner-wrap, cukup sediakan wadah kosong <div id="nodes-container" class="absolute inset-0 w-full h-full pointer-events-none"> (Mesin kami yang akan menggambar gambarnya secara otomatis di bawah wadah ini!).
   - Tempatkan Pin Hotspot Bernomor (class="hotspot-wrap absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer flex items-center gap-1.5") di dalam #nodes-container, dengan koordinat style left (%) dan top (%) yang menunjuk tepat ke bagian struktur pada gambar (Batas aman layar HP: left 15%-85%).
   - Setiap Pin Hotspot WAJIB menggunakan event 'click' dengan event.stopPropagation() yang langsung mengisi dan membuka #info-active. DILARANG menggunakan event 'mousedown', 'pointerdown', 'mousemove', atau 'drag' buatan Anda karena itu akan MEMATIKAN fitur Zoom/Pan Camera mesin kami!
   - Buat tombol Navigasi Titik (Sebelumnya/Selanjutnya) di dalam <div class="vi-docked-control-bar flex items-center justify-between px-4 py-2"> tepat di bawah #vi-stage-inner-wrap.
   - Kotak ringkasan di #info-active: "STRUKTUR PENYUSUN & LETAK" dan "FUNGSI FISIOLOGIS / KLINIS".`;
    } else if (visual === "fisiologi") {
        namaVisualLabel = "FISIOLOGI (ANIMASI MEKANISME 60FPS + DOCKED CONTROL BAR TIPIS)";
        instruksiVisualKhusus =
`3. SPESIFIKASI VISUAL KHUSUS — FISIOLOGI (ANIMASI HIDUP 60FPS & KONTROL TIDAK MENUTUPI GAMBAR):
   - Visual di dalam kanvas WAJIB HIDUP dan BERGERAK KONSTAN 60FPS (organ memompa/bergerak dan sel/molekul mengalir mengikuti jalur pembuluh SVG menggunakan path.getPointAtLength()).
   - Letakkan bar kontrol laju (Slider BPM + indikator Fase + tombol Play/Pause) dalam 1 baris tipis di BAWAH #vi-stage-inner-wrap (gunakan class="vi-docked-control-bar flex items-center justify-between gap-2 px-3 py-1.5").
   - Kotak ringkasan di #info-active: "MEKANISME & ARAH ALIRAN" dan "FUNGSI FISIOLOGIS / REGULASI".`;
    } else if (visual === "eksperimen") {
        namaVisualLabel = "SIMULATOR EKSPERIMEN & PRAKTIKUM LABORATORIUM (SVG REALISTIS & KONTROL BARIS TIPIS)";
        instruksiVisualKhusus =
`3. SPESIFIKASI VISUAL KHUSUS — EKSPERIMEN / PRAKTIKUM (WAJIB SVG ORGANIK DETAIL, DILARANG KOTAK POLOS!):
   - DILARANG KERAS menggambar spesimen sel, membran, atau alat laboratorium hanya dengan kotak/lingkaran <div> CSS polos atau bentuk geometris kaku!
   - WAJIB gambar menggunakan vektor <svg viewBox="0 0 500 380"> ilmiah yang detail dan nyata (lengkap organel/struktur berlapis serta animasi partikel/molekul 60fps).
   - ATURAN MUTLAK PANEL KONTROL KONDISI EKSPERIMEN (ANTI-MENUTUPI & ANTI-TERPOTONG!):
     * Buat panel pengatur kondisi dalam 1 atau 2 baris tombol pil yang SANGAT RINGKAS (tinggi maksimal 68px) dan letakkan di dalam <div class="vi-docked-control-bar"> tepat di BAWAH #vi-stage-inner-wrap (di luar area gambar SVG) sehingga gambar sel 100% bebas terlihat!
   - Kotak ringkasan di #info-active: "VARIABEL & PERLAKUAN UJI" dan "HASIL PENGAMATAN & REAKSI".`;
    } else {
        namaVisualLabel = "BAGAN PROSES (SKEMA ALUR KASKADE & PANAH BERLABEL)";
        instruksiVisualKhusus =
`3. SPESIFIKASI VISUAL KHUSUS — BAGAN PROSES (SKEMA KASKADE KOTAK & PANAH BERLABEL):
   - Buat skema alur proses bertahap menggunakan kotak tahapan 1 baris (.process-box-node) yang dihubungkan garis panah SVG tegas (#svg-layer) beserta LABEL KETERANGAN DI TENGAH PANAH (.arrow-label-badge) dan sinyal partikel 60fps (#particle-canvas).
   - Kotak ringkasan di #info-active: "FAKTOR PEMICU / ENZIM / KOFAKTOR" dan "PROSES & HASIL TAHAPAN".`;
    }

    let finalPrompt =
`Buatkan saya 1 file kode HTML utuh (<!DOCTYPE html><html lang="id">...</html>) untuk Visualisasi Interaktif Pembelajaran SMA.

===================================================================
DATA MATERI PEMBELAJARAN (WAJIB DIGUNAKAN 100% AKURAT):
- Mata Pelajaran : ${mapel}
- Bab Materi     : ${bab}
- Topik Inti     : ${topik}
- Jenis Visual   : ${namaVisualLabel}
${refImgUrl ? "- URL Gambar Referensi Atlas Medis : " + refImgUrl + "\n" : ""}- Detail Materi Lengkap:
${detail}
===================================================================

WAJIB IKUTI 6 ATURAN DIMENSI & ARSITEKTUR MESIN KAMI (PROPORSI HP PERSEGI PANJANG VERTIKAL 410x720 & KANVAS LANDSCAPE 1040x600):

1. TEKNOLOGI & GAYA VISUAL LABORATORIUM:
   - Gunakan Tailwind CSS CDN (<script src="https://cdn.tailwindcss.com"></script>) dan Google Font 'Plus Jakarta Sans'.
   - Tema gelap ilmiah: body background-color #0f172a, color #f8fafc, dan class .bg-grid (background-size: 36px 36px; linear-gradient rgba(255,255,255,0.04) 1px).

2. DIMENSI PASTI & PEMISAHAN KAMERA VISUAL DARI PANEL PENJELASAN:
   - Gunakan <body class="w-full h-screen flex flex-col md:flex-row overflow-hidden">
   - AREA VISUAL (<main id="canvas-area">):
     Gunakan class="flex-1 relative bg-grid shadow-inner flex flex-col h-[440px] md:h-full border-b md:border-b-0 md:border-r border-slate-700 shrink-0 overflow-hidden".
     Di dalamnya bagi menjadi:
     a) <div id="vi-stage-inner-wrap" class="relative flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden"> untuk menempatkan Gambar Atlas/SVG, Canvas, dan <div id="nodes-container" class="absolute inset-0 w-full h-full pointer-events-none">.
     b) Jika ada panel pengatur kondisi/slider/tombol navigasi titik, WAJIB letakkan sebagai bar tipis di BAWAH #vi-stage-inner-wrap dengan class="vi-docked-control-bar".
   - AREA PENJELASAN TETAP (<aside id="info-panel">):
     Gunakan class="w-full md:w-[360px] bg-slate-900 h-[280px] md:h-full overflow-y-auto flex-shrink-0 z-40 flex flex-col".

${instruksiVisualKhusus}

4. SISTEM INTERAKSI "KLIK-KUNCI" (STICKY SELECTION):
   - Simpan seluruh data node/hotspot di dalam variabel global window.nodesData = [...] di dalam <script>.
   - Setiap node/hotspot di dalam #nodes-container cukup diberi event 'click' langsung untuk menampilkan penjelasannya di #info-panel (pastikan #info-default diberi class 'hidden' dan #info-active dihapus class 'hidden' serta 'opacity-0'-nya!).
   - DILARANG memasang event 'mouseleave' yang mereset #info-panel!

5. STRUKTUR PANEL PENJELASAN (#info-panel) AGAR 100% EDITABLE:
   - Di dalam #info-active gunakan ID standar: #info-emoji, #info-name, #info-role, <p id="info-desc">, serta 2 kotak informasi di bawahnya (#info-eats dan #info-eaten-by dengan class="grid grid-cols-2 md:grid-cols-1 gap-2.5 mt-auto").

6. KALIBRASI RESPONSIF & KAPSUL 1 BARIS:
   - Buat fungsi global window.buildConnections = function() {...} yang membaca posisi setiap elemen secara langsung dari DOM menggunakan getBoundingClientRect(). Pastikan seluruh label kapsul di kanvas selalu 1 baris horizontal (whitespace-nowrap).`;

    let resBox = document.getElementById("vi-gen-result-box");
    let outTxt = document.getElementById("vi-gen-output-text");
    if (resBox && outTxt) {
        outTxt.value = finalPrompt;
        resBox.style.display = "block";
        resBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
};

window.copyHasilGeneratePromptVI = function() {
    let outTxt = document.getElementById("vi-gen-output-text");
    let btnCopy = document.getElementById("btn-copy-hasil-prompt-vi");
    if (!outTxt || !outTxt.value.trim()) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(outTxt.value).then(function() {
            if (btnCopy) {
                let oldHtml = btnCopy.innerHTML;
                btnCopy.innerHTML = "✓ Berhasil Dicopy!";
                btnCopy.style.background = "#0284c7";
                setTimeout(function() {
                    btnCopy.innerHTML = oldHtml;
                    btnCopy.style.background = "#16a34a";
                }, 2000);
            }
        });
    } else {
        outTxt.select();
        document.execCommand("copy");
        alert("📋 Prompt AI berhasil disalin!");
    }
};

// 17. CONTOH FISIOLOGI SIAP PAKAI
window.isiContohModulInteraktif = function() {
    window.pastikanModalGeneratorPromptVIAda();
    window.pilihVisualPromptVI("fisiologi", document.querySelector('.vi-card-visual[data-val="fisiologi"]'));
    window.isiContohFormGeneratorVI();
    window.bukaModal("modal-generator-prompt-vi");
};