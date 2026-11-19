// Konfigurasi Parameter URL dan State Global
const urlParams = new URLSearchParams(window.location.search); 
window.babAktif = urlParams.get('bab') || "home"; let babAktif = window.babAktif;
if (urlParams.get('guru')) {
    sessionStorage.setItem("guruTarget", urlParams.get('guru').trim().toLowerCase());
}

// SINKRONISASI INGATAN LOGIN PERMANEN (AUTO-LOGIN SEBELUM CEK AKSES)
if (localStorage.getItem("statusLogin_mahardika")) {
    sessionStorage.setItem("statusLogin", localStorage.getItem("statusLogin_mahardika"));
    sessionStorage.setItem("username", localStorage.getItem("username_mahardika"));
    sessionStorage.setItem("guruTarget", localStorage.getItem("guruTarget_mahardika"));
}

// FORCE WIPE SYSTEM (Reset sesi lama setelah pindah ke database baru)
let currentAppVersion = "2.0.3";
if (localStorage.getItem("app_version_mahardika") !== currentAppVersion) {
    sessionStorage.clear();
    localStorage.setItem("app_version_mahardika", currentAppVersion);
    window.location.reload();
}

/* =========================================
   OVERRIDE BROWSER DIALOG (ALERT, CONFIRM, PROMPT)
   ========================================= */
window._dialogCallback = null;
window._dialogType = null;

window.tampilkanCustomDialog = function(tipe, pesan, nilaiDefault, callback) {
    let modal = document.getElementById("modal-custom-dialog");
    let judulEl = document.getElementById("dialog-title");
    let pesanEl = document.getElementById("dialog-message");
    let inputEl = document.getElementById("dialog-input");
    let btnOk = document.getElementById("dialog-btn-ok");
    let btnCancel = document.getElementById("dialog-btn-cancel");

    if (!modal) {
        // Fallback jika HTML belum ada
        if (tipe === "alert") return window._originalAlert(pesan);
        if (tipe === "confirm") return window._originalConfirm(pesan);
        if (tipe === "prompt") return window._originalPrompt(pesan, nilaiDefault);
    }

    window._dialogCallback = callback;
    window._dialogType = tipe;
    
    // Trik agar \n di-render sebagai baris baru
    pesanEl.innerHTML = (pesan || "").toString().replace(/\n/g, "<br>");

    // Konfigurasi per tipe
    if (tipe === "alert") {
        judulEl.innerText = "Pemberitahuan";
        judulEl.style.color = "#0b3954";
        inputEl.style.display = "none";
        btnCancel.style.display = "none";
        btnOk.innerText = "OK";
        btnOk.style.background = "#3498db";
    } else if (tipe === "confirm") {
        judulEl.innerText = "Konfirmasi";
        judulEl.style.color = "#d35400";
        inputEl.style.display = "none";
        btnCancel.style.display = "inline-block";
        btnOk.innerText = "Ya, Lanjutkan";
        btnOk.style.background = "#e67e22";
    } else if (tipe === "prompt") {
        judulEl.innerText = "Masukkan Data";
        judulEl.style.color = "#27ae60";
        inputEl.style.display = "block";
        inputEl.value = nilaiDefault || "";
        btnCancel.style.display = "inline-block";
        btnOk.innerText = "Simpan";
        btnOk.style.background = "#27ae60";
    }

    // Tangani event Enter pada input
    inputEl.onkeydown = function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            window.tutupCustomDialog(true);
        }
    };

    modal.style.display = "flex";
    
    if (tipe === "prompt") {
        setTimeout(function() { inputEl.focus(); inputEl.select(); }, 100);
    } else {
        setTimeout(function() { btnOk.focus(); }, 100);
    }
};

window.tutupCustomDialog = function(isOk) {
    let modal = document.getElementById("modal-custom-dialog");
    let inputEl = document.getElementById("dialog-input");
    if (modal) modal.style.display = "none";

    let cb = window._dialogCallback;
    let tipe = window._dialogType;
    
    window._dialogCallback = null;
    window._dialogType = null;

    if (cb) {
        if (tipe === "alert") {
            cb();
        } else if (tipe === "confirm") {
            cb(isOk);
        } else if (tipe === "prompt") {
            if (isOk) {
                cb(inputEl.value);
            } else {
                cb(null);
            }
        }
    }
};

// Backup fungsi asli
window._originalAlert = window.alert;
window._originalConfirm = window.confirm;
window._originalPrompt = window.prompt;

// OVERRIDE FUNGSI GLOBAL (Membuatnya berjalan secara Asynchronous dengan Callback)
// CATATAN PENTING: Karena ini sekarang Asynchronous, kita tidak bisa menimpanya langsung 
// untuk kode yang lama yang masih menggunakan gaya sinkron (cth: `if(confirm("...")) { ... }`).
// Namun, kita AKAN menimpa fungsi editTanggalAbsensi yang ada di gambar Anda sebagai contoh.
// Satu sumber pemeriksaan hak akses admin untuk UI editor.
// Username SBD selalu diperlakukan sebagai siswa.
window.isAdminSession = function() {
    const status = sessionStorage.getItem("statusLogin");
    const username = (sessionStorage.getItem("username") || "").trim().toLowerCase();

    return status === "admin" && username !== "sbd";
};

// Kunci editor untuk pengguna yang bukan admin.
window.kunciEditorUntukNonAdmin = function() {
    document.body.classList.remove("mode-edit-aktif");
    document.documentElement.classList.remove("force-edit-mode");
    sessionStorage.removeItem("previewMode");

    const btnPreview = document.getElementById("btn-preview");

    if (btnPreview) {
        btnPreview.hidden = true;
        btnPreview.style.setProperty("display", "none", "important");
        btnPreview.setAttribute("aria-hidden", "true");
    }

    // Hapus atribut edit dari elemen yang sudah ada.
    document.querySelectorAll("[contenteditable]").forEach(function(el) {
        el.removeAttribute("contenteditable");
    });
};

// Listener utama saat halaman selesai dimuat.
document.addEventListener("DOMContentLoaded", function() {
    const status = sessionStorage.getItem("statusLogin");
    const isAdmin = window.isAdminSession();

    const btnLogin = document.getElementById("btn-login-utama");
    const btnLogout = document.getElementById("btn-logout-utama");
    const btnPreview = document.getElementById("btn-preview");

    if (btnLogin) {
        btnLogin.style.display = status ? "none" : "block";
    }

    if (btnLogout) {
        btnLogout.style.display = status ? "block" : "none";
    }

    if (status) {
        document.body.classList.add("has-login");
    } else {
        document.body.classList.remove("has-login");
    }

    // Tamu dan siswa tidak boleh menggunakan mode edit.
    if (!isAdmin) {
        window.kunciEditorUntukNonAdmin();
        return;
    }

    // Hanya admin yang dapat melihat tombol preview.
    if (btnPreview) {
        btnPreview.hidden = false;
        btnPreview.removeAttribute("aria-hidden");
        btnPreview.style.removeProperty("display");
    }

    const titleEl = document.getElementById("web-title");

    if (sessionStorage.getItem("previewMode") === "true") {
        document.body.classList.remove("mode-edit-aktif");
        document.documentElement.classList.remove("force-edit-mode");

        document.querySelectorAll("[contenteditable]").forEach(function(el) {
            el.removeAttribute("contenteditable");
        });

        if (btnPreview) {
            btnPreview.innerHTML = "✏️ Back to Edit";
            btnPreview.style.background = "#27ae60";
        }
    } else {
        document.body.classList.add("mode-edit-aktif");
        document.documentElement.classList.add("force-edit-mode");

        if (titleEl) {
            titleEl.setAttribute("contenteditable", "true");

            titleEl.addEventListener("blur", function() {
                if (typeof window.simpanTema === "function") {
                    window.simpanTema();
                }
            });
        }

        if (btnPreview) {
            btnPreview.innerHTML = "👁️ Preview as Student";
            btnPreview.style.background = "#e67e22";
        }
    }
});

/* =========================================
   FUNGSI DROPDOWN NAVBAR & MANAJEMEN PAGES (10 TINGKAT + ROOM HIDDEN)
   ========================================= */

// 1. Inisialisasi Data Default jika Database Kosong (Bersih untuk Guru Baru)
window.inisialisasiDataPagesDefault = function() {
    let aktifGuru = window.guruAktif || sessionStorage.getItem("username") || "mahardika";
    if (aktifGuru === "mahardika") {
        window.pagesData = [
            { title: "HOME", slug: "home", level: 0, hidden: false, isLockedHidden: false },
            { title: "Kelas X", slug: "kelas-x", level: 0, hidden: false, isLockedHidden: false },
            { title: "Kelas XI", slug: "kelas-xi", level: 0, hidden: false, isLockedHidden: false },
            { title: "Kelas XII", slug: "kelas-xii", level: 0, hidden: false, isLockedHidden: false },
            { title: "TKA Biologi", slug: "tka-biologi", level: 0, hidden: false, isLockedHidden: false },
            { title: "Olimpiade", slug: "olimpiade", level: 0, hidden: false, isLockedHidden: false },
            { title: "Hidden", slug: "hidden", level: 0, hidden: true, isLockedHidden: true }
        ];
    } else {
        // Untuk guru lain, mulai dalam keadaan bersih (hanya HOME dan Hidden)
        window.pagesData = [
            { title: "HOME", slug: "home", level: 0, hidden: false, isLockedHidden: false },
            { title: "Hidden", slug: "hidden", level: 0, hidden: true, isLockedHidden: true }
        ];
    }
    if (typeof window.simpanPagesKeDB === "function") {
        window.simpanPagesKeDB();
    }
};

// 2. Pengunci Posisi Room "Hidden" (Selalu Hidden & Selalu Paling Kanan/Akhir)
window.pastikanRoomHiddenTerkunci = function() {
    if (!Array.isArray(window.pagesData)) window.pagesData = [];

    // Normalisasi properti setiap item
    window.pagesData.forEach(function(p) {
        if (typeof p.level !== "number") p.level = parseInt(p.level) || 0;
        if (p.level < 0) p.level = 0;
        if (p.level > 9) p.level = 9; // Maksimal 10 tingkat (Level 0 s/d 9)
        if (typeof p.hidden !== "boolean") p.hidden = Boolean(p.hidden);
    });

    // Cari apakah room khusus Hidden sudah ada
    let hiddenIdx = window.pagesData.findIndex(function(p) {
        return p.isLockedHidden === true || (p.level === 0 && (p.slug === "hidden" || (p.title && p.title.trim().toLowerCase() === "hidden")));
    });

    if (hiddenIdx === -1) {
        // Jika belum ada, tambahkan di paling akhir
        window.pagesData.push({
            title: "Hidden",
            slug: "hidden",
            level: 0,
            hidden: true,
            isLockedHidden: true
        });
        hiddenIdx = window.pagesData.length - 1;
    }

    // Pastikan atribut pengunci pada induk Hidden
    window.pagesData[hiddenIdx].level = 0;
    window.pagesData[hiddenIdx].hidden = true;
    window.pagesData[hiddenIdx].isLockedHidden = true;
    if (!window.pagesData[hiddenIdx].title) window.pagesData[hiddenIdx].title = "Hidden";
    if (!window.pagesData[hiddenIdx].slug) window.pagesData[hiddenIdx].slug = "hidden";

    // Hapus flag isLockedHidden dari item lain agar hanya ada 1 induk Hidden
    window.pagesData.forEach(function(p, idx) {
        if (idx !== hiddenIdx) p.isLockedHidden = false;
    });

    // Ambil seluruh cabang milik Hidden (induk + semua sub-room di bawahnya)
    let endHiddenIdx = hiddenIdx + 1;
    while (endHiddenIdx < window.pagesData.length && window.pagesData[endHiddenIdx].level > 0) {
        endHiddenIdx++;
    }

    // Jika cabang Hidden belum berada di paling akhir array, pindahkan ke paling akhir
    if (endHiddenIdx < window.pagesData.length) {
        let hiddenBranch = window.pagesData.splice(hiddenIdx, endHiddenIdx - hiddenIdx);
        window.pagesData.push.apply(window.pagesData, hiddenBranch);
    }

    // Pastikan item pertama di daftar adalah Level 0
    if (window.pagesData.length > 0 && window.pagesData[0].level !== 0) {
        window.pagesData[0].level = 0;
    }
};

// 3. Fungsi Pembantu Pembuat Slug URL Unik
window.buatSlugUnik = function(judul, excludeIndex) {
    let baseSlug = (judul || "room")
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    if (!baseSlug) baseSlug = "room";

    let slugFinal = baseSlug;
    let counter = 2;
    while (window.pagesData.some(function(p, idx) { return idx !== excludeIndex && p.slug === slugFinal; })) {
        slugFinal = baseSlug + "-" + counter;
        counter++;
    }
    return slugFinal;
};

// 4. Hitung Rentang Cabang (Induk beserta seluruh Sub-Room di bawahnya)
window.ambilRentangCabangPage = function(startIndex) {
    if (!window.pagesData[startIndex]) return { start: startIndex, end: startIndex, count: 0 };
    let baseLevel = window.pagesData[startIndex].level;
    let endIndex = startIndex + 1;
    while (endIndex < window.pagesData.length && window.pagesData[endIndex].level > baseLevel) {
        endIndex++;
    }
    return { start: startIndex, end: endIndex, count: endIndex - startIndex };
};

// 4.5 Mesin Navigasi SPA (Isolasi Penuh Antar-Room)
window.navigasiHalaman = function(e, slug) {
    if(e) e.preventDefault();
    let currentRoom = window.babAktif || babAktif;
    if(currentRoom === slug) return; 

    // 1. Jika ada ketikan yang belum tersimpan di room lama, simpan ke room lama sekarang juga
    let container = document.getElementById('blocks-container');
    let domRoom = container ? container.getAttribute('data-active-room') : '';
    if (window.typingTimer) {
        clearTimeout(window.typingTimer);
        window.typingTimer = null;
        if (!window.isLoadingRoom && domRoom === currentRoom && typeof window.simpanKeDB === 'function') {
            window.simpanKeDB(currentRoom);
        }
    }

    // 2. Ubah penunjuk room aktif ke room yang baru
    babAktif = slug;
    window.babAktif = slug;
    let guruParam = (window.guruAktif && window.guruAktif !== "mahardika") ? "guru=" + encodeURIComponent(window.guruAktif) + "&" : "";
    window.history.pushState({bab: slug}, "", "index.html?" + guruParam + "bab=" + encodeURIComponent(slug));

    document.querySelectorAll('#dynamic-navbar a').forEach(function(a) { a.classList.remove('active'); });
    let activeLink = document.querySelector('#dynamic-navbar a[href*="bab=' + slug + '"]');
    if(activeLink) activeLink.classList.add('active');

    // 3. Tarik materi khusus untuk room baru
    if(typeof window.muatKontenHalaman === 'function') {
        window.muatKontenHalaman(slug);
    }
    window.closeDropdowns();
};

// Deteksi jika user menekan tombol Back/Forward di browser
window.addEventListener('popstate', function(e) {
    
    // PENAHAN UJIAN KETAT: Jika siswa menekan tombol Back saat ujian berlangsung
    if (window.isStrictUjianActive) {
        // Tembak kembali jebakannya agar posisi user tidak mundur
        window.history.pushState({ inExam: true }, null, window.location.href);
        // Munculkan notifikasi tanpa memicu pelanggaran
        window.alertAmanUjian("⚠️ Tombol KEMBALI (Back) dikunci selama ujian!\nSilakan selesaikan ujian Anda terlebih dahulu.");
        return; 
    }

    let currentRoom = window.babAktif || babAktif;
    let container = document.getElementById('blocks-container');
    let domRoom = container ? container.getAttribute('data-active-room') : '';

    if (window.typingTimer) {
        clearTimeout(window.typingTimer);
        window.typingTimer = null;
        if (!window.isLoadingRoom && domRoom === currentRoom && typeof window.simpanKeDB === 'function') {
            window.simpanKeDB(currentRoom);
        }
    }
    
    let uParams = new URLSearchParams(window.location.search);
    let backSlug = uParams.get('bab') || "home";
    babAktif = backSlug;
    window.babAktif = backSlug;
    
    if(typeof window.muatKontenHalaman === 'function') window.muatKontenHalaman(backSlug);
    
    document.querySelectorAll('#dynamic-navbar a').forEach(function(a) { a.classList.remove('active'); });
    let activeLink = document.querySelector('#dynamic-navbar a[href*="bab=' + backSlug + '"]');
    if(activeLink) activeLink.classList.add('active');
});

// 5. Render Toolbar Utama (Navbar) dengan Sub-Room hingga 10 Tingkat
window._navTreeRootNodes = [];
window._navNodeBySlug = {};

window.ambilAnakVisibleNav = function(node) {
    if (!node || !Array.isArray(node.children)) return [];
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    return node.children.filter(function(child) {
        return isEdit || !child.effectiveHidden;
    });
};

window.renderDynamicNavbar = function() {
    window.pastikanRoomHiddenTerkunci();

    let container = document.getElementById("dynamic-pages-container");
    let navUl = document.getElementById("dynamic-navbar");
    if (!container || !navUl) return;

    let staticHomeLink = navUl.querySelector(':scope > li > a[href="index.html?bab=home"]');
    let hasDynamicHome = window.pagesData.some(function(p) { return p.slug === "home"; });
    if (staticHomeLink && staticHomeLink.parentElement) {
        staticHomeLink.parentElement.style.display = hasDynamicHome ? "none" : "";
        staticHomeLink.onclick = function(e) { window.klikMenuNavbar(e, 'home', staticHomeLink); };
    }

    navUl.querySelectorAll(':scope > li > a').forEach(function(a) {
        let href = a.getAttribute('href');
        if (href && href.indexOf('index.html?bab=') === 0 && href !== 'index.html?bab=home') {
            let slug = href.split('=')[1];
            a.onclick = function(ev) { window.klikMenuNavbar(ev, slug, a); };
        }
    });

    let rootNodes = [];
    let stack = [];
    let nodeMap = {};

    window.pagesData.forEach(function(page, idx) {
        let node = {
            title: page.title, slug: page.slug, level: page.level, hidden: Boolean(page.hidden),
            isLockedHidden: Boolean(page.isLockedHidden), index: idx, children: [],
            effectiveHidden: Boolean(page.hidden) || Boolean(page.isLockedHidden)
        };
        nodeMap[node.slug] = node;

        while (stack.length > 0 && stack[stack.length - 1].level >= node.level) { stack.pop(); }

        if (stack.length === 0) {
            rootNodes.push(node);
        } else {
            let parentNode = stack[stack.length - 1];
            if (parentNode.effectiveHidden) node.effectiveHidden = true;
            parentNode.children.push(node);
        }
        stack.push(node);
    });

    window._navTreeRootNodes = rootNodes;
    window._navNodeBySlug = nodeMap;

    function cetakMenuHTML(nodes, isSubMenu) {
        let html = "";
        nodes.forEach(function(node) {
            let visibleChildren = window.ambilAnakVisibleNav(node);
            let hasChildren = visibleChildren.length > 0;
            let liClasses = [];
            if (node.effectiveHidden) liClasses.push("hidden-nav-item");
            if (hasChildren) liClasses.push("has-sub");
            if (node.isLockedHidden) liClasses.push("locked-hidden-nav-item");

            let aClasses = [];
            if (node.effectiveHidden) aClasses.push("hidden-nav-link");
            if (node.slug === babAktif) aClasses.push("active");

            let labelTitle = node.title;
            if (node.level === 0 && node.slug === "home" && labelTitle.indexOf("🏠") === -1) labelTitle = "🏠 " + labelTitle;
            else if (node.isLockedHidden && labelTitle.indexOf("🔒") === -1) labelTitle = "🔒 " + labelTitle;

            let arrowHTML = hasChildren ? (isSubMenu ? ' <span class="sub-arrow-ind" style="font-size:11px; margin-left:8px;">▸</span>' : ' <span class="sub-arrow-ind" style="font-size:10px; margin-left:4px;">▾</span>') : "";
            let safeSlug = String(node.slug || "").replace(/'/g, "\\'");

            html += '<li class="' + liClasses.join(" ") + '" data-level="' + node.level + '" data-slug="' + safeSlug + '">';
            html += '<a href="index.html?bab=' + encodeURIComponent(node.slug) + '" class="' + aClasses.join(" ") + '" onclick="window.klikMenuNavbar(event, \'' + safeSlug + '\', this)">';
            html += '<span>' + labelTitle + '</span>' + arrowHTML;
            html += '</a>';

            if (hasChildren) {
                html += '<ul class="sub-menu-nav" data-sub-level="' + (node.level + 1) + '">';
                html += cetakMenuHTML(node.children, true);
                html += '</ul>';
            }
            html += '</li>';
        });
        return html;
    }

    container.innerHTML = cetakMenuHTML(rootNodes, false);
};

// 6. Logika Buka-Tutup Sub-Menu 10 Tingkat (Hover Desktop & Portal Dropdown HP 1x/2x Tekan)
let navCloseTimer = null;
window._mobileOpenTopSlug = null;
window._mobileExpandedSubSlugs = new Set();

window.closeDropdowns = function() {
    document.querySelectorAll("#dynamic-navbar ul.sub-menu-nav.open-sub").forEach(function(ul) {
        ul.classList.remove("open-sub", "flyout-left", "align-right-edge");
        ul.style.position = ''; ul.style.top = ''; ul.style.left = ''; ul.style.right = '';
    });

    window._mobileOpenTopSlug = null;
    window._mobileExpandedSubSlugs = new Set();

    document.querySelectorAll('#dynamic-navbar a.mobile-nav-opened').forEach(function(el) {
        el.classList.remove('mobile-nav-opened');
    });

    let portal = document.getElementById('mobile-nav-dropdown-portal');
    let backdrop = document.getElementById('mobile-nav-dropdown-backdrop');
    if (portal) portal.style.display = 'none';
    if (backdrop) backdrop.style.display = 'none';
};

window.pastikanPortalDropdownMobileAda = function() {
    let backdrop = document.getElementById('mobile-nav-dropdown-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'mobile-nav-dropdown-backdrop';
        backdrop.className = 'mobile-nav-dropdown-backdrop';
        backdrop.onclick = function() { window.closeDropdowns(); };
        document.body.appendChild(backdrop);
    }

    let portal = document.getElementById('mobile-nav-dropdown-portal');
    if (!portal) {
        portal = document.createElement('div');
        portal.id = 'mobile-nav-dropdown-portal';
        portal.className = 'mobile-nav-dropdown-portal';
        document.body.appendChild(portal);
    }
    return { portal: portal, backdrop: backdrop };
};

window.bangunHTMLDaftarMobileSub = function(nodes, depth) {
    let html = '';
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');

    nodes.forEach(function(node) {
        if (!isEdit && node.effectiveHidden) return;

        let visibleChildren = window.ambilAnakVisibleNav(node);
        let hasSub = visibleChildren.length > 0;
        let isExpanded = hasSub && window._mobileExpandedSubSlugs.has(node.slug);
        let isActiveRoom = (node.slug === (window.babAktif || babAktif));
        let safeSlug = String(node.slug || "").replace(/'/g, "\\'");

        let padLeft = 16 + (depth * 16);
        let itemClasses = 'mobile-dd-item';
        if (isExpanded) itemClasses += ' is-expanded';
        if (isActiveRoom) itemClasses += ' is-active-room';
        if (depth > 0) itemClasses += ' is-nested';

        let arrowHtml = hasSub
            ? '<span class="mobile-dd-arrow">' + (isExpanded ? '▾' : '▸') + '</span>'
            : '';

        let hintHtml = isExpanded
            ? '<span class="mobile-dd-tap-hint">Tap lagi ➔ Masuk</span>'
            : '';

        html +=
            '<button type="button" class="' + itemClasses + '" style="padding-left:' + padLeft + 'px;" onclick="window.klikSubMenuMobile(event, \'' + safeSlug + '\')">' +
                '<span class="mobile-dd-label">' + node.title + '</span>' +
                '<span class="mobile-dd-right">' + hintHtml + arrowHtml + '</span>' +
            '</button>';

        if (hasSub && isExpanded) {
            html += '<div class="mobile-dd-children">' + window.bangunHTMLDaftarMobileSub(visibleChildren, depth + 1) + '</div>';
        }
    });

    return html;
};

window.renderPortalDropdownMobile = function(topSlug, triggerAnchorEl) {
    let topNode = window._navNodeBySlug ? window._navNodeBySlug[topSlug] : null;
    if (!topNode) return;

    let visibleChildren = window.ambilAnakVisibleNav(topNode);
    if (visibleChildren.length === 0) return;

    let els = window.pastikanPortalDropdownMobileAda();
    let oldScrollEl = els.portal.querySelector('.mobile-dd-scroll');
    let prevScrollTop = oldScrollEl ? oldScrollEl.scrollTop : 0;

    let navEl = document.getElementById('main-nav');
    let navRect = navEl ? navEl.getBoundingClientRect() : { bottom: 96 };
    let topPos = Math.max(40, Math.round(navRect.bottom));

    els.backdrop.style.top = topPos + 'px';
    els.backdrop.style.display = 'block';

    let safeTopSlug = String(topNode.slug || "").replace(/'/g, "\\'");
    let headerHTML =
        '<div class="mobile-dd-header" onclick="window.navigasiHalaman(event, \'' + safeTopSlug + '\')">' +
            '<span>📂 ' + topNode.title + '</span>' +
            '<span class="mobile-dd-enter-pill">Masuk Room ➔</span>' +
        '</div>';

    let listHTML = '<div class="mobile-dd-scroll">' + window.bangunHTMLDaftarMobileSub(visibleChildren, 0) + '</div>';

    els.portal.innerHTML = headerHTML + listHTML;
    els.portal.style.top = topPos + 'px';
    els.portal.style.maxHeight = 'calc(100dvh - ' + (topPos + 54) + 'px)';
    els.portal.style.display = 'flex';

    let newScrollEl = els.portal.querySelector('.mobile-dd-scroll');
    if (newScrollEl && prevScrollTop > 0) {
        newScrollEl.scrollTop = prevScrollTop;
    }

    document.querySelectorAll('#dynamic-navbar a.mobile-nav-opened').forEach(function(el) {
        el.classList.remove('mobile-nav-opened');
    });
    if (triggerAnchorEl) {
        triggerAnchorEl.classList.add('mobile-nav-opened');
    } else {
        let aFound = document.querySelector('#dynamic-navbar li[data-slug="' + safeTopSlug + '"] > a');
        if (aFound) aFound.classList.add('mobile-nav-opened');
    }
};

// Klik Menu Utama Navbar (HP: 1x Buka Dropdown, 2x Masuk Room | Tanpa Anak: 1x Langsung Masuk)
window.klikMenuNavbar = function(e, slug, anchorEl) {
    if (e) e.preventDefault();

    let isMobile = window.innerWidth <= 768;
    let node = window._navNodeBySlug ? window._navNodeBySlug[slug] : null;

    if (!isMobile || !node) {
        window.navigasiHalaman(e, slug);
        return;
    }

    let visibleChildren = window.ambilAnakVisibleNav(node);

    if (visibleChildren.length === 0) {
        window.closeDropdowns();
        window.navigasiHalaman(e, slug);
        return;
    }

    if (window._mobileOpenTopSlug === slug) {
        window.closeDropdowns();
        window.navigasiHalaman(e, slug);
        return;
    }

    if (e) e.stopPropagation();
    window._mobileOpenTopSlug = slug;
    window._mobileExpandedSubSlugs = new Set();
    window.renderPortalDropdownMobile(slug, anchorEl);
};

// Klik Sub-Room di Dalam Dropdown HP (Tanpa Sub-Sub: 1x Masuk | Punya Sub-Sub: 1x Buka, 2x Masuk)
window.klikSubMenuMobile = function(e, slug) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    let node = window._navNodeBySlug ? window._navNodeBySlug[slug] : null;
    if (!node) {
        window.closeDropdowns();
        window.navigasiHalaman(e, slug);
        return;
    }

    let visibleChildren = window.ambilAnakVisibleNav(node);

    if (visibleChildren.length === 0) {
        window.closeDropdowns();
        window.navigasiHalaman(e, slug);
        return;
    }

    if (window._mobileExpandedSubSlugs.has(slug)) {
        window.closeDropdowns();
        window.navigasiHalaman(e, slug);
        return;
    }

    window._mobileExpandedSubSlugs.add(slug);
    window.renderPortalDropdownMobile(window._mobileOpenTopSlug, null);
};

function aturPosisiSubMenu(ulElement) {
    if (!ulElement || window.innerWidth <= 768) return;
    ulElement.classList.add("open-sub");
    let parentLi = ulElement.parentElement;
    let rect = parentLi.getBoundingClientRect();
    let isTopLevelDropdown = parentLi && parentLi.parentElement && (parentLi.parentElement.id === "dynamic-pages-container" || parentLi.parentElement.id === "dynamic-navbar");

    if (isTopLevelDropdown) {
        ulElement.style.position = 'fixed';
        ulElement.style.zIndex = '4800';
        ulElement.style.top = rect.bottom + 'px';
        ulElement.style.left = rect.left + 'px';
        ulElement.style.right = 'auto';

        if (rect.left + 220 > window.innerWidth) {
            ulElement.style.left = 'auto';
            ulElement.style.right = '10px';
        }
    } else {
        ulElement.style.position = '';
        ulElement.style.top = '';
        ulElement.style.left = '';
        ulElement.style.right = '';

        if (rect.right + 220 > window.innerWidth) {
            ulElement.classList.add("flyout-left");
        } else {
            ulElement.classList.remove("flyout-left");
        }
    }
}

function bukaJalurSubMenu(liElement) {
    if (!liElement || window.innerWidth <= 768) return;
    let activeUls = new Set();
    let curr = liElement;
    while (curr && curr.id !== "dynamic-navbar") {
        if (curr.tagName === "UL" && curr.classList.contains("sub-menu-nav")) activeUls.add(curr);
        curr = curr.parentElement;
    }
    let directSubUl = liElement.querySelector(":scope > ul.sub-menu-nav");
    if (directSubUl) {
        activeUls.add(directSubUl);
    }

    document.querySelectorAll("#dynamic-navbar ul.sub-menu-nav.open-sub").forEach(function(ul) {
        if (!activeUls.has(ul)) {
            ul.classList.remove("open-sub", "flyout-left", "align-right-edge");
            ul.style.position = ''; ul.style.top = ''; ul.style.left = ''; ul.style.right = '';
        }
    });

    activeUls.forEach(function(ul) {
        aturPosisiSubMenu(ul);
    });
}

document.addEventListener("mouseover", function(e) {
    if (window.innerWidth > 768) {
        let li = e.target.closest("#dynamic-navbar li");
        if (li) { clearTimeout(navCloseTimer); bukaJalurSubMenu(li); }
        else if (!e.target.closest("#dynamic-navbar")) { clearTimeout(navCloseTimer); navCloseTimer = setTimeout(window.closeDropdowns, 220); }
    }
});

document.addEventListener("click", function(e) {
    if (window.innerWidth <= 768 && window._mobileOpenTopSlug) {
        if (!e.target.closest("#dynamic-navbar") && !e.target.closest("#mobile-nav-dropdown-portal")) {
            window.closeDropdowns();
        }
    }
});

window.addEventListener("scroll", function() {
    if (window.innerWidth <= 768 && window._mobileOpenTopSlug) {
        let navEl = document.getElementById('main-nav');
        let portal = document.getElementById('mobile-nav-dropdown-portal');
        let backdrop = document.getElementById('mobile-nav-dropdown-backdrop');
        if (navEl && portal && portal.style.display === 'flex') {
            let navRect = navEl.getBoundingClientRect();
            let topPos = Math.max(0, Math.round(navRect.bottom));
            portal.style.top = topPos + 'px';
            portal.style.maxHeight = 'calc(100dvh - ' + (topPos + 54) + 'px)';
            if (backdrop) backdrop.style.top = topPos + 'px';
        }
    }
}, { passive: true });

// 7. Render & Operasi di Dalam Modal "⚙️ Pages"
let dragSourcePageIndex = null;

window.renderModalPages = function() {
    window.pastikanRoomHiddenTerkunci();
    let listEl = document.getElementById("sortable-list");
    if (!listEl) return;

    let html = "";
    window.pagesData.forEach(function(page, idx) {
        let isLockedHidden = Boolean(page.isLockedHidden);
        let isHome = (page.level === 0 && page.slug === "home");
        let indentPx = page.level * 26;
        let canAddSub = page.level < 9; 
        
        let eyeIcon = (page.hidden || isLockedHidden) ? "🚫" : "👁️";
        let eyeTitle = isLockedHidden ? "Room khusus (Terkunci)" : (page.hidden ? "Klik untuk tampilkan" : "Klik untuk sembunyikan");
        let cardClass = "page-item-card" + (isLockedHidden ? " locked-hidden-card" : "");
        let levelLabel = page.level === 0 ? "Main" : "Lv." + (page.level + 1);

        // Gagang titik 6 dipasang fungsi khusus onmousedown & onmouseup agar hanya gagang ini yang bisa ditarik
        let dragGrip = !isLockedHidden ? `onmousedown="this.closest('li').setAttribute('draggable', true)" onmouseup="this.closest('li').setAttribute('draggable', false)" onmouseleave="this.closest('li').setAttribute('draggable', false)"` : "";

        html += '<li class="' + cardClass + '" style="margin-left:' + indentPx + 'px;" draggable="false" data-page-index="' + idx + '" ondragstart="window.onPageDragStart(event, ' + idx + ')" ondragover="window.onPageDragOver(event)" ondrop="window.onPageDrop(event, ' + idx + ')">';
        html += '  <div class="page-item-left">';
        html += '    <span class="page-drag-handle" title="' + (isLockedHidden ? "Terkunci" : "Tarik titik ini untuk geser") + '" ' + dragGrip + '>' + (isLockedHidden ? "🔒" : "⋮⋮") + '</span>';
        html += '    <input type="text" class="page-title-input" value="' + (page.title || "").replace(/"/g, "&quot;") + '" ' + (isLockedHidden ? "readonly" : "") + ' onchange="window.ubahNamaHalaman(' + idx + ', this.value)">';
        html += '    <span class="page-level-badge">' + levelLabel + '</span>';
        html += '    <button class="page-btn-icon" style="background:#27ae60; color:white; margin-left:8px; font-size:11px; padding:2px 8px; border-radius:12px;" onclick="window.navigasiHalaman(event, \'' + page.slug + '\'); window.tutupModal(\'modal-pages\');" title="Langsung Buka Halaman Ini">GO 🚀</button>';
        html += '  </div>';
        html += '  <div class="page-item-actions">';
        if (!isLockedHidden) {
            html += '    <button class="page-btn-icon" title="Geser Naik" onclick="window.geserUrutanHalaman(' + idx + ', -1)">↑</button>';
            html += '    <button class="page-btn-icon" title="Geser Turun" onclick="window.geserUrutanHalaman(' + idx + ', 1)">↓</button>';
        }
        html += '    <button class="page-btn-icon" title="' + eyeTitle + '" onclick="window.toggleVisibilitasHalaman(' + idx + ')">' + eyeIcon + '</button>';
        html += '    <button class="page-btn-icon" style="color:#2980b9;" title="Tambah Sub-Room" ' + (!canAddSub ? "disabled" : "") + ' onclick="window.tambahSubHalaman(' + idx + ')"><b>+Sub</b></button>';
        if (!isLockedHidden && !isHome) {
            html += '    <button class="page-btn-icon delete-btn" title="Hapus Room" onclick="window.hapusHalaman(' + idx + ')">🗑️</button>';
        }
        html += '  </div>';
        html += '</li>';
    });
    listEl.innerHTML = html;
};

// Tambah Main Room Baru (Selalu diselipkan tepat sebelum grup Hidden)
window.tambahHalamanBaru = function(levelTarget) {
    window.pastikanRoomHiddenTerkunci();
    let lvl = typeof levelTarget === "number" ? levelTarget : 0;
    let judulBaru = prompt("Masukkan nama Room utama baru:", "Room Baru");
    if (!judulBaru || !judulBaru.trim()) return;
    judulBaru = judulBaru.trim();

    let slugBaru = window.buatSlugUnik(judulBaru, -1);
    let newPage = {
        title: judulBaru,
        slug: slugBaru,
        level: lvl,
        hidden: false,
        isLockedHidden: false
    };

    // Cari posisi induk Hidden agar halaman utama baru masuk sebelum Hidden
    let hiddenIdx = window.pagesData.findIndex(function(p) { return p.isLockedHidden === true; });
    if (hiddenIdx > -1) {
        window.pagesData.splice(hiddenIdx, 0, newPage);
    } else {
        window.pagesData.push(newPage);
    }

    window.renderModalPages();
    window.renderDynamicNavbar();
    if (typeof window.updateBreadcrumb === "function") window.updateBreadcrumb();
    if (typeof window.simpanPagesKeDB === "function") window.simpanPagesKeDB();
};

// Tambah Sub-Room Baru (Hingga 10 Tingkat: Level 0 s/d Level 9)
window.tambahSubHalaman = function(parentIndex) {
    let parentPage = window.pagesData[parentIndex];
    if (!parentPage) return;

    if (parentPage.level >= 9) {
        return alert("Maksimal kedalaman sub-room adalah 10 tingkat!");
    }

    let judulSub = prompt('Masukkan nama Sub-Room di bawah "' + parentPage.title + '":', "Sub Room Baru");
    if (!judulSub || !judulSub.trim()) return;
    judulSub = judulSub.trim();

    let slugSub = window.buatSlugUnik(judulSub, -1);
    let newSubPage = {
        title: judulSub,
        slug: slugSub,
        level: parentPage.level + 1,
        hidden: false,
        isLockedHidden: false
    };

    // Selipkan di akhir cabang milik induk tersebut
    let branch = window.ambilRentangCabangPage(parentIndex);
    window.pagesData.splice(branch.end, 0, newSubPage);

    window.renderModalPages();
    window.renderDynamicNavbar();
    if (typeof window.updateBreadcrumb === "function") window.updateBreadcrumb();
    if (typeof window.simpanPagesKeDB === "function") window.simpanPagesKeDB();
};

// Ubah Nama Room
window.ubahNamaHalaman = function(index, judulBaru) {
    let page = window.pagesData[index];
    if (!page) return;
    if (page.isLockedHidden) {
        window.renderModalPages();
        return;
    }

    let bersih = (judulBaru || "").trim();
    if (!bersih) {
        alert("Nama room tidak boleh kosong!");
        window.renderModalPages();
        return;
    }

    page.title = bersih;
    if (page.slug !== "home") {
        page.slug = window.buatSlugUnik(bersih, index);
    }

    window.renderModalPages();
    window.renderDynamicNavbar();
    if (typeof window.updateBreadcrumb === "function") window.updateBreadcrumb();
    if (typeof window.simpanPagesKeDB === "function") window.simpanPagesKeDB();
};

// Toggle Visibilitas (Mata / Sembunyi)
window.toggleVisibilitasHalaman = function(index) {
    let page = window.pagesData[index];
    if (!page) return;

    if (page.isLockedHidden) {
        return alert("Room 'Hidden' dikunci khusus agar selalu tersembunyi dari menu siswa dan selalu berada di paling kanan menu Admin. Anda bebas menambahkan +Sub di bawahnya untuk materi/kuis tambahan yang diakses lewat tombol.");
    }

    page.hidden = !page.hidden;
    window.renderModalPages();
    window.renderDynamicNavbar();
    if (typeof window.simpanPagesKeDB === "function") window.simpanPagesKeDB();
};

// Geser Urutan Room (Beserta Seluruh Sub-Room di Bawahnya)
window.geserUrutanHalaman = function(index, arah) {
    let page = window.pagesData[index];
    if (!page || page.isLockedHidden) return;

    let currentBranch = window.ambilRentangCabangPage(index);
    let targetLevel = page.level;

    if (arah === -1) {
        // Cari saudara selevel tepat di atasnya (dalam induk yang sama)
        let prevIdx = -1;
        for (let i = index - 1; i >= 0; i--) {
            if (window.pagesData[i].level < targetLevel) break;
            if (window.pagesData[i].level === targetLevel) {
                prevIdx = i;
                break;
            }
        }
        if (prevIdx === -1) return;

        let movingItems = window.pagesData.splice(currentBranch.start, currentBranch.count);
        window.pagesData.splice(prevIdx, 0, ...movingItems);
    } else if (arah === 1) {
        // Cari saudara selevel tepat di bawahnya (jangan melewati induk Hidden)
        let nextIdx = -1;
        if (currentBranch.end < window.pagesData.length) {
            let candidate = window.pagesData[currentBranch.end];
            if (candidate.level === targetLevel && !candidate.isLockedHidden) {
                nextIdx = currentBranch.end;
            }
        }
        if (nextIdx === -1) return;

        let nextBranch = window.ambilRentangCabangPage(nextIdx);
        let movingItems = window.pagesData.splice(currentBranch.start, currentBranch.count);
        let insertPos = nextBranch.end - currentBranch.count;
        window.pagesData.splice(insertPos, 0, ...movingItems);
    }

    window.pastikanRoomHiddenTerkunci();
    window.renderModalPages();
    window.renderDynamicNavbar();
    if (typeof window.updateBreadcrumb === "function") window.updateBreadcrumb();
    if (typeof window.simpanPagesKeDB === "function") window.simpanPagesKeDB();
};

// Drag and Drop untuk Mengurutkan Room di Modal Pages
window.onPageDragStart = function(e, index) {
    if (window.pagesData[index] && window.pagesData[index].isLockedHidden) {
        e.preventDefault();
        return;
    }
    dragSourcePageIndex = index;
    e.dataTransfer.effectAllowed = "move";
};

window.onPageDragOver = function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
};

window.onPageDrop = function(e, targetIndex) {
    e.preventDefault();
    if (dragSourcePageIndex === null || dragSourcePageIndex === targetIndex) return;

    let sourceBranch = window.ambilRentangCabangPage(dragSourcePageIndex);
    // Cegah drop ke dalam cabangnya sendiri
    if (targetIndex >= sourceBranch.start && targetIndex < sourceBranch.end) return;

    let targetPage = window.pagesData[targetIndex];
    if (!targetPage || targetPage.isLockedHidden) return;

    // Sesuaikan level jika dipindahkan ke level yang sama
    let selisihLevel = targetPage.level - window.pagesData[dragSourcePageIndex].level;
    let movingItems = window.pagesData.splice(sourceBranch.start, sourceBranch.count);

    movingItems.forEach(function(item) {
        let newLvl = item.level + selisihLevel;
        if (newLvl < 0) newLvl = 0;
        if (newLvl > 9) newLvl = 9;
        item.level = newLvl;
    });

    let newTargetIndex = targetIndex > sourceBranch.start ? targetIndex - sourceBranch.count : targetIndex;
    window.pagesData.splice(newTargetIndex, 0, ...movingItems);

    dragSourcePageIndex = null;
    window.pastikanRoomHiddenTerkunci();
    window.renderModalPages();
    window.renderDynamicNavbar();
    if (typeof window.updateBreadcrumb === "function") window.updateBreadcrumb();
    if (typeof window.simpanPagesKeDB === "function") window.simpanPagesKeDB();
};

// Hapus Room (Beserta Sub-Room di Bawahnya)
window.hapusHalaman = function(index) {
    let page = window.pagesData[index];
    if (!page) return;
    if (page.isLockedHidden) return alert("Room utama 'Hidden' tidak dapat dihapus karena merupakan fitur sistem.");
    if (page.level === 0 && page.slug === "home") return alert("Halaman utama 'HOME' tidak dapat dihapus.");

    let branch = window.ambilRentangCabangPage(index);
    let pesan = branch.count > 1
        ? 'Hapus room "' + page.title + '" beserta ' + (branch.count - 1) + ' sub-room di dalamnya?'
        : 'Yakin ingin menghapus room "' + page.title + '"?';

    if (confirm(pesan)) {
        window.pagesData.splice(branch.start, branch.count);
        window.pastikanRoomHiddenTerkunci();
        window.renderModalPages();
        window.renderDynamicNavbar();
        if (typeof window.updateBreadcrumb === "function") window.updateBreadcrumb();
        if (typeof window.simpanPagesKeDB === "function") window.simpanPagesKeDB();
    }
};

// Pemantau Otomatis: Saat Modal Pages dibuka, langsung render daftar halaman
document.addEventListener("DOMContentLoaded", function() {
    let modalPagesEl = document.getElementById("modal-pages");
    if (modalPagesEl) {
        let obsPages = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.target.id === "modal-pages" && m.target.style.display === "flex") {
                    window.renderModalPages();
                }
            });
        });
        obsPages.observe(modalPagesEl, { attributes: true, attributeFilter: ["style"] });
    }
});

/* =========================================
   FUNGSI TOOLBAR FORMAT TEKS (AKTIF PENUH & ANTI-LEPAS SELEKSI)
   ========================================= */
window.lastActiveEditable = null;
window.savedEditorRange = null;

// Perbaikan Seleksi Penuh (Cmd/Ctrl + A) agar tidak melampaui batas blok editor dan bisa dihapus/ditimpa
document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        let active = document.activeElement;
        if (active && (active.classList.contains('content-block') || active.classList.contains('fb-content') || active.id === 'popup-content-box' || active.id === 'cg-editor-area' || active.id === 'ck-editor-area')) {
            e.preventDefault();
            let sel = window.getSelection();
            let range = document.createRange();
            range.selectNodeContents(active);
            sel.removeAllRanges();
            sel.addRange(range);
            if (typeof window.simpanSeleksiTeks === "function") window.simpanSeleksiTeks();
        }
    }
});

// Rekam seleksi teks & blok aktif secara otomatis setiap kali guru memblok teks
document.addEventListener("selectionchange", function() {
    let sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
        let range = sel.getRangeAt(0);
        let container = range.commonAncestorContainer;
        let el = container.nodeType === 3 ? container.parentNode : container;
        if (el && el.closest) {
            let editable = el.closest(".content-block, .fb-content, #popup-content-box, #cg-editor-area");
            if (editable) {
                window.lastActiveEditable = editable;
                window.savedEditorRange = range.cloneRange();
                window.globalSelectedRange = range.cloneRange();
            }
        }
    }
});

// Cegah tombol di Toolbar Content mencuri fokus saat diklik
document.addEventListener("DOMContentLoaded", function() {
    let toolbarEl = document.getElementById("toolbar");
    if (toolbarEl) {
        toolbarEl.addEventListener("mousedown", function(e) {
            let btn = e.target.closest("button");
            if (btn) {
                e.preventDefault(); // Menjaga blok teks di editor tetap aktif!
            }
        });
        // Pastikan klik Undo/Redo juga memicu penyimpanan ke database
        toolbarEl.addEventListener("click", function(e) {
            let btn = e.target.closest("button");
            if (btn) {
                let onclickAttr = btn.getAttribute("onclick") || "";
                if (onclickAttr.indexOf("undo") !== -1 || onclickAttr.indexOf("redo") !== -1) {
                    setTimeout(triggerInput, 50);
                }
            }
        });
    }
});

function pastikanFokusEditor() {
    let active = document.activeElement;
    let isInsideEditor = active && (active.classList.contains("content-block") || active.classList.contains("fb-content") || active.id === "popup-content-box");
    if (!isInsideEditor && window.lastActiveEditable) {
        window.lastActiveEditable.focus();
    }
    if (window.savedEditorRange) {
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(window.savedEditorRange);
    }
}

function triggerInput() { 
    let a = document.activeElement;
    if (!a || !(a.classList.contains("content-block") || a.classList.contains("fb-content") || a.id === "cg-editor-area")) {
        a = window.lastActiveEditable;
    }
    if (a && (a.classList.contains("content-block") || a.classList.contains("fb-content"))) {
        a.dispatchEvent(new Event("input", { bubbles: true })); 
    }
}

// Format Teks Utama (Bold, Italic, Underline, Superscript, Font, Style, Color, List, Align)
window.formatTeks = function(command, value = null) { 
    pastikanFokusEditor();

    // EKSEKUSI UNTUK MULTIPLE SEL TABEL (BLOK BARIS/KOLOM)
    if (window.activeTableCells && window.activeTableCells.length > 0) {
        window.activeTableCells.forEach(cell => {
            let range = document.createRange();
            range.selectNodeContents(cell);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            
            if (command === "formatBlock" && value) {
                let tagVal = value.indexOf("<") === 0 ? value : "<" + value + ">";
                document.execCommand("formatBlock", false, tagVal);
            } else {
                document.execCommand(command, false, value);
            }
        });
        window.getSelection().removeAllRanges();
        triggerInput();
        return;
    }

    if (command === "removeFormat") { 
        document.execCommand("removeFormat", false, null); 
        let sel = window.getSelection(); 
        if (sel.rangeCount > 0) { 
            let b = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentNode : sel.anchorNode; 
            while (b && b !== document.body && !(b.classList && (b.classList.contains("content-block") || b.classList.contains("fb-content")))) { 
                let c = b.style ? b.style.textAlign : ""; 
                b.removeAttribute("style"); 
                b.removeAttribute("class"); 
                if (c) b.style.textAlign = c; 
                b = b.parentNode; 
            } 
        } 
    } else if (command === "formatBlock" && value) {
        let tagVal = value.indexOf("<") === 0 ? value : "<" + value + ">";
        document.execCommand("formatBlock", false, tagVal);
    } else { 
        document.execCommand(command, false, value); 
    }

    // Perbarui rekaman seleksi setelah format diterapkan
    let selAfter = window.getSelection();
    if (selAfter && selAfter.rangeCount > 0) {
        window.savedEditorRange = selAfter.getRangeAt(0).cloneRange();
    }
    triggerInput(); 
};

/* =========================================
   MESIN UKURAN FONT ALA MICROSOFT WORD, CASE, & SORTIR
   ========================================= */
window.DAFTAR_UKURAN_FONT_WORD = [5, 5.5, 6.5, 7.5, 8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
window.isFontSizeDropdownOpen = false;
window.typedCustomFontSize = "";

// 1. Membaca Ukuran Font (dalam satuan pt) dari Sebuah Node Teks / Elemen
window.ambilUkuranFontNode = function(node) {
    let el = (node && node.nodeType === 3) ? node.parentElement : node;
    if (!el) return 10;

    // Cek apakah ada style inline dalam satuan pt pada elemen atau induknya di dalam editor
    let curr = el;
    while (curr && curr !== document.body) {
        if (curr.style && curr.style.fontSize) {
            let fs = curr.style.fontSize.trim().toLowerCase();
            if (fs.endsWith("pt")) {
                let ptVal = parseFloat(fs);
                if (!isNaN(ptVal)) return Math.round(ptVal * 10) / 10;
            } else if (fs.endsWith("px")) {
                let pxVal = parseFloat(fs);
                if (!isNaN(pxVal)) return Math.round((pxVal * 0.75) * 2) / 2;
            }
        }
        if (curr.classList && (curr.classList.contains("content-block") || curr.classList.contains("fb-content") || curr.id === "popup-content-box" || curr.id === "cg-editor-area" || curr.id === "ck-editor-area")) {
            break;
        }
        curr = curr.parentElement;
    }

    // Fallback ke computed style jika belum ada inline style pt
    let compPx = parseFloat(window.getComputedStyle(el).fontSize);
    if (!isNaN(compPx) && compPx > 0) {
        return Math.round((compPx * 0.75) * 2) / 2;
    }
    return 10;
};

// 2. Mengambil Semua Text Node yang Berada di Dalam Seleksi Range
window.ambilTextNodesDalamRange = function(range, rootEditable) {
    let nodes = [];
    if (!range || !rootEditable) return nodes;

    if (range.startContainer.nodeType === 3 && range.startContainer === range.endContainer) {
        if (range.startContainer.nodeValue.length > 0) {
            nodes.push(range.startContainer);
        }
        return nodes;
    }

    let walker = document.createTreeWalker(rootEditable, NodeFilter.SHOW_TEXT, null, false);
    let currentNode = walker.nextNode();
    while (currentNode) {
        if (range.intersectsNode(currentNode) && currentNode.nodeValue.trim().length > 0) {
            // Abaikan teks tombol internal tabel (+Row/+Col)
            let parentEl = currentNode.parentElement;
            if (!parentEl || !parentEl.classList.contains("tbl-btn-add")) {
                nodes.push(currentNode);
            }
        }
        currentNode = walker.nextNode();
    }
    return nodes;
};

// 3. Memperbarui Angka / Titik-Titik (....) di Kotak Ukuran Font Saat Memblok Teks
window.perbaruiIndikatorFontSize = function() {
    let inp = document.getElementById("input-font-size");
    if (!inp) return;

    let sel = window.getSelection();
    let range = (sel && sel.rangeCount > 0) ? sel.getRangeAt(0) : window.savedEditorRange;
    if (!range) return;

    let container = range.commonAncestorContainer;
    let el = container.nodeType === 3 ? container.parentElement : container;
    let editable = (el && el.closest) ? el.closest(".content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area") : null;
    if (!editable) return;

    if (range.collapsed) {
        let sz = window.ambilUkuranFontNode(range.startContainer);
        inp.value = String(sz);
    } else {
        let textNodes = window.ambilTextNodesDalamRange(range, editable);
        if (textNodes.length === 0) {
            let sz = window.ambilUkuranFontNode(range.startContainer);
            inp.value = String(sz);
            return;
        }
        let ukuranSet = new Set();
        textNodes.forEach(function(tn) {
            ukuranSet.add(window.ambilUkuranFontNode(tn));
        });
        if (ukuranSet.size > 1) {
            inp.value = "....";
        } else {
            let satuUkuran = Array.from(ukuranSet)[0];
            inp.value = String(satuUkuran);
        }
    }
};

window._fontSizeIndTimer = null;
document.addEventListener("selectionchange", function() {
    if (!document.body.classList.contains("mode-edit-aktif") && !document.documentElement.classList.contains("force-edit-mode")) return;
    clearTimeout(window._fontSizeIndTimer);
    window._fontSizeIndTimer = setTimeout(function() {
        window.perbaruiIndikatorFontSize();
    }, 150);
});

// 4. Memisahkan (Split) Batas Text Node Agar Hanya Teks yang Diblok yang Berubah Ukuran
window.isolasiTextNodesDalamRange = function(range, editable) {
    if (!range || range.collapsed) return [];

    if (range.startContainer.nodeType === 3 && range.startContainer === range.endContainer) {
        let textNode = range.startContainer;
        let startOff = range.startOffset;
        let endOff = range.endOffset;
        if (endOff < textNode.nodeValue.length) {
            textNode.splitText(endOff);
        }
        if (startOff > 0) {
            textNode = textNode.splitText(startOff);
        }
        return [textNode];
    }

    if (range.endContainer.nodeType === 3 && range.endOffset > 0 && range.endOffset < range.endContainer.nodeValue.length) {
        range.endContainer.splitText(range.endOffset);
    }
    if (range.startContainer.nodeType === 3 && range.startOffset > 0 && range.startOffset < range.startContainer.nodeValue.length) {
        let newStartNode = range.startContainer.splitText(range.startOffset);
        range.setStartBefore(newStartNode);
    }

    let hasilNodes = [];
    let walker = document.createTreeWalker(editable, NodeFilter.SHOW_TEXT, null, false);
    let curr = walker.nextNode();
    while (curr) {
        if (range.intersectsNode(curr) && curr.nodeValue.length > 0) {
            let pEl = curr.parentElement;
            if (!pEl || !pEl.classList.contains("tbl-btn-add")) {
                // Pastikan benar-benar berada di dalam rentang awal-akhir
                let nodeRange = document.createRange();
                nodeRange.selectNodeContents(curr);
                let afterStart = range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0;
                let beforeEnd = range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0;
                if (afterStart && beforeEnd) {
                    hasilNodes.push(curr);
                }
            }
        }
        curr = walker.nextNode();
    }
    return hasilNodes;
};

// 5. Mesin Inti Pengubah Ukuran Font (Serentak maupun Relatif +/- Tanpa Menghilangkan Blok)
window.terapkanPerubahanFontSize = function(mode, nilai) {
    pastikanFokusEditor();

    // Dukungan jika sedang memblok beberapa sel tabel sekaligus
    if (window.activeTableCells && window.activeTableCells.length > 1) {
        window.activeTableCells.forEach(function(cell) {
            let r = document.createRange();
            r.selectNodeContents(cell);
            let nodes = window.ambilTextNodesDalamRange(r, cell);
            nodes.forEach(function(tn) {
                let curSize = window.ambilUkuranFontNode(tn);
                let targetSize = (mode === "step") ? (curSize + nilai) : parseFloat(nilai);
                if (targetSize < 1) targetSize = 1;
                if (targetSize > 200) targetSize = 200;
                targetSize = Math.round(targetSize * 10) / 10;
                let p = tn.parentElement;
                if (p && p.tagName === "SPAN" && p.childNodes.length === 1 && !p.classList.contains("glossary-term")) {
                    p.style.fontSize = targetSize + "pt";
                } else {
                    let sp = document.createElement("span");
                    sp.style.fontSize = targetSize + "pt";
                    tn.parentNode.insertBefore(sp, tn);
                    sp.appendChild(tn);
                }
            });
        });
        triggerInput();
        return;
    }

    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let range = sel.getRangeAt(0);
    if (range.collapsed) return;

    let container = range.commonAncestorContainer;
    let el = container.nodeType === 3 ? container.parentElement : container;
    let editable = (el && el.closest) ? el.closest(".content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area") : window.lastActiveEditable;
    if (!editable) return;

    let selectedNodes = window.isolasiTextNodesDalamRange(range, editable);
    if (selectedNodes.length === 0) return;

    selectedNodes.forEach(function(tn) {
        // Lewati spasi kosong antarelemen blok jika tidak memiliki teks nyata
        if (tn.nodeValue.trim().length === 0 && selectedNodes.length > 1) return;

        let curSize = window.ambilUkuranFontNode(tn);
        let targetSize = (mode === "step") ? (curSize + nilai) : parseFloat(nilai);
        if (isNaN(targetSize)) return;
        if (targetSize < 1) targetSize = 1;
        if (targetSize > 200) targetSize = 200;
        targetSize = Math.round(targetSize * 10) / 10;

        let parent = tn.parentElement;
        if (parent && parent.tagName === "SPAN" && parent.childNodes.length === 1 && !parent.classList.contains("glossary-term")) {
            parent.style.fontSize = targetSize + "pt";
        } else {
            let span = document.createElement("span");
            span.style.fontSize = targetSize + "pt";
            tn.parentNode.insertBefore(span, tn);
            span.appendChild(tn);
        }
    });

    // Pertahankan blok seleksi biru pada kalimat yang baru diubah ukurannya
    let firstNode = selectedNodes[0];
    let lastNode = selectedNodes[selectedNodes.length - 1];
    let newRange = document.createRange();
    newRange.setStart(firstNode, 0);
    newRange.setEnd(lastNode, lastNode.nodeValue.length);

    sel.removeAllRanges();
    sel.addRange(newRange);
    window.savedEditorRange = newRange.cloneRange();
    window.globalSelectedRange = newRange.cloneRange();

    window.perbaruiIndikatorFontSize();
    triggerInput();
};

// Fungsi Tombol + dan - Ukuran Font
window.ubahFontStep = function(step) {
    window.tutupDropdownFontSize();
    window.terapkanPerubahanFontSize("step", step);
};

// Fungsi Pilih / Atur Ukuran Font Serentak
window.aturUkuranFont = function(value) {
    window.tutupDropdownFontSize();
    let numVal = parseFloat(value);
    if (isNaN(numVal) || numVal <= 0) return;
    window.terapkanPerubahanFontSize("set", numVal);
};

// 6. UI Dropdown Ukuran Font Ala Microsoft Word (5 s/d 72)
window.pastikanDropdownFontSizeAda = function() {
    let dd = document.getElementById("word-fontsize-dropdown");
    if (dd) return dd;

    dd = document.createElement("div");
    dd.id = "word-fontsize-dropdown";
    dd.className = "word-fontsize-dropdown";
    document.body.appendChild(dd);
    return dd;
};

window.toggleDropdownFontSize = function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (window.isFontSizeDropdownOpen) {
        window.tutupDropdownFontSize();
    } else {
        window.bukaDropdownFontSize();
    }
};

window.bukaDropdownFontSize = function() {
    let box = document.getElementById("word-fontsize-box");
    let inp = document.getElementById("input-font-size");
    if (!box || !inp) return;

    let dd = window.pastikanDropdownFontSizeAda();
    let currentVal = inp.value.trim();
    window.typedCustomFontSize = "";

    let html = "";
    window.DAFTAR_UKURAN_FONT_WORD.forEach(function(sz) {
        let isActive = (String(sz) === currentVal) ? " active-size" : "";
        html += '<div class="word-fontsize-item' + isActive + '" onmousedown="event.preventDefault(); event.stopPropagation(); window.aturUkuranFont(' + sz + ')">' + sz + '</div>';
    });
    dd.innerHTML = html;

    let rect = box.getBoundingClientRect();
    dd.style.display = "flex";
    dd.style.top = (rect.bottom + 4) + "px";
    dd.style.left = rect.left + "px";
    window.isFontSizeDropdownOpen = true;

    // Gulir otomatis ke ukuran yang sedang aktif
    let activeEl = dd.querySelector(".active-size");
    if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
    }
};

window.tutupDropdownFontSize = function() {
    let dd = document.getElementById("word-fontsize-dropdown");
    if (dd) dd.style.display = "none";
    window.isFontSizeDropdownOpen = false;
    window.typedCustomFontSize = "";
};

// Tutup dropdown saat klik di luar, dan izinkan ketik angka manual saat dropdown terbuka tanpa menghilangkan blok
document.addEventListener("mousedown", function(e) {
    if (window.isFontSizeDropdownOpen) {
        if (!e.target.closest("#word-fontsize-box") && !e.target.closest("#word-fontsize-dropdown")) {
            window.tutupDropdownFontSize();
        }
    }
});

document.addEventListener("keydown", function(e) {
    if (!window.isFontSizeDropdownOpen) return;
    let inp = document.getElementById("input-font-size");
    if (!inp) return;

    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
        e.preventDefault();
        window.typedCustomFontSize += e.key;
        inp.value = window.typedCustomFontSize;
    } else if (e.key === "Backspace") {
        e.preventDefault();
        window.typedCustomFontSize = window.typedCustomFontSize.slice(0, -1);
        inp.value = window.typedCustomFontSize || "....";
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (window.typedCustomFontSize) {
            window.aturUkuranFont(window.typedCustomFontSize);
        } else {
            window.tutupDropdownFontSize();
        }
    } else if (e.key === "Escape") {
        e.preventDefault();
        window.tutupDropdownFontSize();
        window.perbaruiIndikatorFontSize();
    }
}, true);

// 7. Fitur Tombol UPPERCASE dan lowercase (Tanpa Menghilangkan Blok & Format)
window.ubahCaseTeks = function(mode) {
    pastikanFokusEditor();

    if (window.activeTableCells && window.activeTableCells.length > 1) {
        window.activeTableCells.forEach(function(cell) {
            let r = document.createRange();
            r.selectNodeContents(cell);
            let nodes = window.ambilTextNodesDalamRange(r, cell);
            nodes.forEach(function(tn) {
                tn.nodeValue = (mode === "upper") ? tn.nodeValue.toUpperCase() : tn.nodeValue.toLowerCase();
            });
        });
        triggerInput();
        return;
    }

    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        return alert("Blok kalimat yang ingin diubah huruf besar/kecilnya terlebih dahulu!");
    }

    let range = sel.getRangeAt(0);
    let container = range.commonAncestorContainer;
    let el = container.nodeType === 3 ? container.parentElement : container;
    let editable = (el && el.closest) ? el.closest(".content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area") : window.lastActiveEditable;
    if (!editable) return;

    let selectedNodes = window.isolasiTextNodesDalamRange(range, editable);
    if (selectedNodes.length === 0) return;

    selectedNodes.forEach(function(tn) {
        tn.nodeValue = (mode === "upper") ? tn.nodeValue.toUpperCase() : tn.nodeValue.toLowerCase();
    });

    let firstNode = selectedNodes[0];
    let lastNode = selectedNodes[selectedNodes.length - 1];
    let newRange = document.createRange();
    newRange.setStart(firstNode, 0);
    newRange.setEnd(lastNode, lastNode.nodeValue.length);

    sel.removeAllRanges();
    sel.addRange(newRange);
    window.savedEditorRange = newRange.cloneRange();
    window.globalSelectedRange = newRange.cloneRange();

    triggerInput();
};

// 8. Fitur Sortir Kalimat / Baris / List (A-Z, Z-A, Angka 1-Seterusnya, Angka Besar ke 1)
window.ekstrakKunciSortir = function(teks, tipeSortir) {
    let bersih = (teks || "").trim();
    if (tipeSortir === "num-asc" || tipeSortir === "num-desc") {
        let matchNum = bersih.match(/-?\d+(?:[\.,]\d+)?/);
        if (matchNum) {
            return parseFloat(matchNum[0].replace(",", "."));
        }
        return tipeSortir === "num-asc" ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
    }
    // Untuk A-Z dan Z-A: abaikan nomor urut/simbol di awal baris jika ada huruf setelahnya
    let tanpaNomorAwal = bersih.replace(/^[\d\.\)\-\•\*\s]+/, "").trim();
    return (tanpaNomorAwal || bersih).toLowerCase();
};

window.bandingkanItemSortir = function(teksA, teksB, tipeSortir) {
    if (tipeSortir === "num-asc" || tipeSortir === "num-desc") {
        let numA = window.ekstrakKunciSortir(teksA, tipeSortir);
        let numB = window.ekstrakKunciSortir(teksB, tipeSortir);
        if (numA !== numB) {
            return tipeSortir === "num-asc" ? (numA - numB) : (numB - numA);
        }
        return teksA.localeCompare(teksB, "id", { sensitivity: "base", numeric: true });
    } else {
        let keyA = window.ekstrakKunciSortir(teksA, tipeSortir);
        let keyB = window.ekstrakKunciSortir(teksB, tipeSortir);
        let cmp = keyA.localeCompare(keyB, "id", { sensitivity: "base", numeric: true });
        return tipeSortir === "az" ? cmp : -cmp;
    }
};

window.sortirTeksTerpilih = function(tipeSortir) {
    pastikanFokusEditor();
    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        return alert("Blok beberapa baris atau daftar kalimat yang ingin disortir terlebih dahulu!");
    }

    let range = sel.getRangeAt(0);
    let container = range.commonAncestorContainer;
    let el = container.nodeType === 3 ? container.parentElement : container;
    let editable = (el && el.closest) ? el.closest(".content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area") : window.lastActiveEditable;
    if (!editable) return;

    // KASUS A: Cek apakah blok seleksi mencakup beberapa elemen blok sejajar (<li>, <p>, <div>, dll.)
    let allBlockCandidates = Array.from(editable.querySelectorAll("li, p, div, h1, h2, h3, h4, h5, h6, blockquote")).filter(function(blk) {
        if (!range.intersectsNode(blk)) return false;
        // Ambil elemen blok terdalam yang tidak membungkus blok lain di daftar ini
        let hasChildBlock = blk.querySelector("li, p, div, h1, h2, h3, h4, h5, h6, blockquote");
        return !hasChildBlock && blk.innerText.trim().length > 0;
    });

    if (allBlockCandidates.length >= 2) {
        let firstParent = allBlockCandidates[0].parentNode;
        let sameParentBlocks = allBlockCandidates.filter(function(b) { return b.parentNode === firstParent; });

        if (sameParentBlocks.length >= 2) {
            // Jika hanya ada 1 blok tapi di dalamnya ada <br>, lewati ke Kasus B
            let anchorMarker = document.createTextNode("");
            firstParent.insertBefore(anchorMarker, sameParentBlocks[0]);

            let sortedBlocks = sameParentBlocks.slice().sort(function(a, b) {
                return window.bandingkanItemSortir(a.innerText, b.innerText, tipeSortir);
            });

            sortedBlocks.forEach(function(blk) {
                firstParent.insertBefore(blk, anchorMarker);
            });
            anchorMarker.remove();

            let newRange = document.createRange();
            newRange.setStartBefore(sortedBlocks[0]);
            newRange.setEndAfter(sortedBlocks[sortedBlocks.length - 1]);
            sel.removeAllRanges();
            sel.addRange(newRange);
            window.savedEditorRange = newRange.cloneRange();
            window.globalSelectedRange = newRange.cloneRange();

            triggerInput();
            return;
        }
    }

    // KASUS B: Baris-baris yang dipisahkan oleh <br> atau Enter (\n) di dalam satu blok
    let frag = range.cloneContents();
    let tempDiv = document.createElement("div");
    tempDiv.appendChild(frag);
    let rawHtml = tempDiv.innerHTML;

    let parts = [];
    if (/<br\s*\/?>/i.test(rawHtml)) {
        parts = rawHtml.split(/<br\s*\/?>/i);
    } else {
        parts = rawHtml.split(/\r?\n/);
    }

    let validParts = parts.map(function(p) { return p.trim(); }).filter(function(p) { return p.length > 0; });
    if (validParts.length < 2) {
        return alert("Blok minimal 2 baris kalimat atau daftar (list) untuk melakukan sortir!");
    }

    validParts.sort(function(htmlA, htmlB) {
        let dA = document.createElement("div"); dA.innerHTML = htmlA;
        let dB = document.createElement("div"); dB.innerHTML = htmlB;
        return window.bandingkanItemSortir(dA.innerText, dB.innerText, tipeSortir);
    });

    let wrapperSpan = document.createElement("span");
    wrapperSpan.innerHTML = validParts.join("<br>");

    range.deleteContents();
    let firstInserted = wrapperSpan.firstChild;
    let lastInserted = wrapperSpan.lastChild;
    let insertFrag = document.createDocumentFragment();
    while (wrapperSpan.firstChild) {
        insertFrag.appendChild(wrapperSpan.firstChild);
    }
    range.insertNode(insertFrag);

    if (firstInserted && lastInserted) {
        let newRange = document.createRange();
        newRange.setStartBefore(firstInserted);
        newRange.setEndAfter(lastInserted);
        sel.removeAllRanges();
        sel.addRange(newRange);
        window.savedEditorRange = newRange.cloneRange();
        window.globalSelectedRange = newRange.cloneRange();
    }

    triggerInput();
};

// Pengaturan Spasi & Jarak Paragraf Standar Word
window.aturSpasiParagraf = function(cmd) { 
    pastikanFokusEditor();
    let sel = window.getSelection(); 
    if (sel.rangeCount > 0) { 
        let node = sel.anchorNode; 
        let block = node.nodeType === 3 ? node.parentNode : node; 
        let container = block.closest ? block.closest("p, h1, h2, h3, blockquote, td, li, div") : null; 
        
        if ((!container || container.classList.contains("content-block") || container.classList.contains("fb-content")) && block.closest(".content-block, .fb-content")) { 
            document.execCommand("formatBlock", false, "<P>"); 
            let newAnchor = window.getSelection().anchorNode;
            container = newAnchor ? (newAnchor.nodeType === 3 ? newAnchor.parentNode : newAnchor) : null; 
        } 
        
        if (container && (container.closest(".content-block") || container.closest(".fb-content"))) { 
            if (cmd.indexOf("line-") === 0) { 
                container.style.lineHeight = cmd.split("-")[1]; 
                container.querySelectorAll("*").forEach(function(c) { if (c.style) c.style.lineHeight = ""; }); 
            } else if (cmd === "add-after") { 
                container.style.marginBottom = "8pt"; 
            } else if (cmd === "add-before") { 
                container.style.marginTop = "12pt"; 
            } else if (cmd === "remove-space") { 
                container.style.marginTop = "0pt"; 
                container.style.marginBottom = "0pt"; 
            } 
            triggerInput(); 
        } 
    } 
};

/* =========================================
   STATE GLOBAL & ENGINE RENDER KONTEN
   ========================================= */
window.pagesData = []; 
window.contentBlocksData = []; 
window.floatingBoxesData = []; 
window.quizState = {}; 

window.updateBreadcrumb = function() {
    let path = [];
    if(window.pagesData) {
        let targetIdx = window.pagesData.findIndex(p => p.slug === babAktif);
        if(targetIdx > -1) {
            let currentLevel = window.pagesData[targetIdx].level;
            path.unshift(`<span>${window.pagesData[targetIdx].title}</span>`);
            for(let i = targetIdx - 1; i >= 0; i--) {
                if(window.pagesData[i].level < currentLevel) {
                    path.unshift(`<span>${window.pagesData[i].title}</span>`);
                    currentLevel = window.pagesData[i].level;
                }
            }
        }
    }
    let text = path.length > 0 ? path.join(' ➔ ') : '<span>Beranda</span>';
    let bc = document.getElementById('bottom-breadcrumb');
    if(bc) bc.innerHTML = '📍 ' + text;
};

window.focusedPdfBlockIndex = -1;

window.cekBatasTinggiA4Input = function(e, el) {
    let idx = parseInt(el.getAttribute('data-index'), 10);
    if (!isNaN(idx) && window.contentBlocksData && window.contentBlocksData[idx]) {
        window.contentBlocksData[idx].html = el.innerHTML;
    }
    clearTimeout(el._dynCanvasTimer);
    el._dynCanvasTimer = setTimeout(function() {
        if (typeof window.inisialisasiSemuaCanvas === 'function') {
            window.inisialisasiSemuaCanvas();
        }
    }, 150);
};

window.toggleCollapseBlock = function(idx) {
    if (!window.contentBlocksData[idx]) return;
    window.contentBlocksData[idx].isCollapsed = !window.contentBlocksData[idx].isCollapsed;
    window.renderBlocks();
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
};

window.updateBlockTitle = function(idx, newTitle) {
    if (!window.contentBlocksData[idx]) return;
    let bersih = newTitle.replace(/\n/g, '').trim();
    window.contentBlocksData[idx].blockTitle = bersih;
    if (window.contentBlocksData[idx].type === 'quiz') {
        window.contentBlocksData[idx].quizTitle = bersih;
    }
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
};

window.renderBlocks = function() {
    let html = '';
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');

    window.contentBlocksData.forEach(function(blok, index) {
        if (!blok.floatImages) blok.floatImages = [];
        let widthMode = blok.width || 'M';
        let bgCol = blok.bg || '#ffffff';
        let patClass = blok.pattern || '';
        let txtCol = blok.color || '#333333';
        let padTop = blok.padTop || '25px';
        let padBot = blok.padBot || '25px';

        // Logika Toggle (Collapse) Baris Judul
        let isCollapsed = Boolean(blok.isCollapsed);
        let titleStr = blok.blockTitle || blok.quizTitle || (blok.type === 'quiz' ? '🧩 Uji Pemahaman' : 'Judul Materi...');
        let safeTitle = titleStr.replace(/"/g, '&quot;');
        let editTitleAttr = isEdit ? 'contenteditable="true" style="outline:none; border-bottom:1px dashed #3498db; cursor:text;" onblur="window.updateBlockTitle(' + index + ', this.innerText)"' : '';
        let btnIcon = isCollapsed ? '▶' : '▼';
        
        if (blok.type === 'quiz') {
            blok.quizTitle = titleStr; // Sinkronkan judul kuis agar 1 pintu
        }

        let collapseBarHtml = '<div class="block-collapse-bar" style="display:flex; align-items:center; gap:10px; padding:12px 20px; background:#f8fafc; border-bottom:1px solid #e2e8f0; border-radius:10px 10px 0 0; z-index:50; position:relative; box-shadow:0 2px 4px rgba(0,0,0,0.02);">' +
            '<button type="button" onclick="window.toggleCollapseBlock(' + index + ')" style="background:#e2e8f0; border:1px solid #cbd5e1; border-radius:50%; width:28px; height:28px; font-size:12px; cursor:pointer; color:#334155; display:flex; align-items:center; justify-content:center; transition:0.2s;" title="Buka/Tutup Blok" onmouseover="this.style.background=\'#cbd5e1\'" onmouseout="this.style.background=\'#e2e8f0\'">' + btnIcon + '</button>' +
            '<div style="font-size:16px; font-weight:800; color:#1e293b; flex:1;" ' + editTitleAttr + '>' + titleStr + '</div>' +
        '</div>';

        let displayStyle = isCollapsed ? 'none' : 'block';

        // 1. TIPE BLOK SLIDE PDF
        if (blok.type === 'pdf_slides') {
            let slides = Array.isArray(blok.slides) ? blok.slides : [];
            let sIdx = typeof blok.activeSlide === 'number' ? blok.activeSlide : 0;
            if (sIdx < 0) sIdx = 0;
            if (sIdx >= slides.length) sIdx = Math.max(0, slides.length - 1);
            blok.activeSlide = sIdx;

            let curSlide = slides[sIdx] || { bg: '', drawing: '', floatImages: [] };
            let isFocus = (window.focusedPdfBlockIndex === index);
            let floatImgsHtml = window.renderFloatImagesHTML(index, sIdx, curSlide.floatImages || []);

            html += '<div class="block-wrapper' + (isFocus ? ' pdf-focus-fullscreen' : '') + '" data-index="' + index + '" style="padding-top:' + padTop + ';padding-bottom:' + padBot + ';">' +
                '<div class="content-block pdf-landscape-block ' + patClass + '" data-index="' + index + '" data-block-type="pdf_slides" style="background-color:' + bgCol + '; position:relative; overflow:visible !important; border-radius:10px;">' +
                    '<div class="block-controls">' +
                        '<button onclick="geserBlok(' + index + ', -1)" title="Geser Naik">⬆️</button>' +
                        '<button onclick="geserBlok(' + index + ', 1)" title="Geser Turun">⬇️</button>' +
                        '<button onclick="bukaSidebarBlock(' + index + ')" title="Pengaturan Blok">⚙️ Setting</button>' +
                        '<button onclick="hapusBlok(' + index + ')" title="Hapus Blok">🗑️ Delete</button>' +
                    '</div>' +
                    collapseBarHtml +
                    '<div class="block-collapsible-area" style="display:' + displayStyle + '; width:100%; position:relative;">' +
                        '<div class="pdf-slide-nav-bar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:nowrap; overflow-x:auto;">' +
                            '<div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">' +
                                '<button onclick="window.gantiSlidePDF(' + index + ', -1)" ' + (sIdx <= 0 ? 'disabled' : '') + '>◀ Prev</button>' +
                                '<span style="font-weight:bold; color:#f1c40f; display:flex; align-items:center; gap:4px; font-size:11px;">Hal ' +
                                    '<input type="number" min="1" max="' + slides.length + '" value="' + (sIdx + 1) + '" ' +
                                    'style="width:35px; text-align:center; font-weight:bold; background:rgba(255,255,255,0.2); color:#f1c40f; border:1px solid rgba(255,255,255,0.3); border-radius:4px; padding:2px;" ' +
                                    'onchange="window.lompatKeSlidePDF(' + index + ', this.value)" ' +
                                    'onkeydown="if(event.key===\'Enter\'){ this.blur(); window.lompatKeSlidePDF(' + index + ', this.value); }"> / ' + slides.length +
                                '</span>' +
                                '<button onclick="window.gantiSlidePDF(' + index + ', 1)" ' + (sIdx >= slides.length - 1 ? 'disabled' : '') + '>Next ▶</button>' +
                            '</div>' +
                            '<div style="font-weight:700; color:#ecf0f1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; text-align:center; margin:0 10px; font-size:11px;" title="' + (blok.title || 'Slide Materi PDF') + '">📄 ' + (blok.title || 'Slide Materi PDF') + '</div>' +
                            '<div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">' +
                                '<button onclick="window.toggleDrawingMode()" style="background:#ffeaa7; color:#2c3e50; border-color:#fdcb6e;">🖍️ Draw</button>' +
                                '<button onclick="window.toggleFokusSlidePDF(' + index + ')" style="background:#2980b9;">' + (isFocus ? '🗗 Tutup Fokus' : '🔍 Mode Fokus') + '</button>' +
                                '<button onclick="window.exportSlidePDFKeA4(' + index + ')" style="background:#27ae60;">📥 Export PDF</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="pdf-slide-stage" data-index="' + index + '" data-slide-index="' + sIdx + '" onpointerdown="window.mulaiSwipeSlidePDF(event, ' + index + ')" onpointerup="window.akhirSwipeSlidePDF(event, ' + index + ')" style="border-radius:0 0 8px 8px;">' +
                            '<img class="pdf-slide-bg" src="' + (curSlide.bg || '') + '" alt="Slide PDF">' +
                            '<div class="draw-float-layer" data-index="' + index + '" data-slide-index="' + sIdx + '">' + floatImgsHtml + '</div>' +
                            '<canvas class="drawing-layer" data-index="' + index + '" data-slide-index="' + sIdx + '"></canvas>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }
        // 2. TIPE BLOK KUIS INLINE
        else if (blok.type === 'quiz') {
            let judulBersihKuis = titleStr.replace(/🧩/g, '').trim().replace(/'/g, "\\'");

            // Judul kuis sudah digabung di collapseBar, jadi hapus `<h3 class="quiz-title">` yang ada di dalam
            let qi = '<div class="quiz-container" id="inline-kuis-' + index + '" style="margin:0; border:none; box-shadow:none; padding:20px;">' +
                    '<div class="quiz-header" style="justify-content:flex-end; padding-bottom:0; border-bottom:none; margin-bottom:15px;">' +
                        '<div style="display:flex; gap:5px; flex-wrap:wrap;">' +
                            '<button class="btn-action" style="background:#2c3e50;width:auto;font-size:11px;padding:6px 12px;" onclick="cetakKuisPDF(\'inline-kuis-' + index + '\',\'' + judulBersihKuis + '\')">🖨️ PDF</button>' +
                            '<button class="btn-action" style="background:#2980b9;width:auto;font-size:11px;padding:6px 12px;" onclick="exportWordKuis(\'inline-kuis-' + index + '\',\'' + judulBersihKuis + '\')">📄 Word</button>' +
                            (isEdit ? '<button class="btn-action" style="background:#2e7d32;width:auto;font-size:11px;padding:6px 12px;" onclick="bukaAIQuizModal(' + index + ')">🤖 Ekstrak</button>' : '') +
                        '</div>' +
                    '</div>';

            if (blok.questions && blok.questions.length > 0) {
                blok.questions.forEach(function(q, qIdx) {
                    if (q.drawing === undefined) q.drawing = "";
                    let isBahasOpen = !!q.isBahasOpen;

                    let qTextHtml = isEdit
                        ? '<div class="quiz-question-text" contenteditable="true" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'q\',this)">' + (qIdx + 1) + '. ' + q.question + '</div>'
                        : '<div class="quiz-question-text">' + (qIdx + 1) + '. ' + q.question + '</div>';

                    qi += '<div class="quiz-question-card" id="inline-q-' + index + '-' + qIdx + '">';
                    if (isEdit) qi += '<button class="btn-delete-q" onclick="hapusSoalSistem(' + qIdx + ', \'inline\', ' + index + ')" title="Hapus Soal">🗑️</button>';
                    qi += qTextHtml;

                    if (q.type === 'short_answer' || (!q.options && q.correctAnswers)) {
                        let altStr = q.correctAnswers ? q.correctAnswers.join(' | ') : '';
                        qi += '<div class="short-answer-box" style="margin-top:10px;">' +
                            '<input type="text" class="input-box" placeholder="Ketik jawaban singkat lalu tekan Enter..." style="font-size:15px; font-weight:600; padding:10px 12px; border:2px solid #3498db; border-radius:8px; width:100%; box-sizing:border-box;" onchange="jawabKuisInlineIsian(this, ' + index + ', ' + qIdx + ')">' +
                            (isEdit ? '<div style="font-size:11px; color:#c0392b; margin-top:8px; background:#fadbd8; padding:6px; border-radius:4px; border-left:4px solid #e74c3c;" contenteditable="true" oninput="updateKunciIsianInline(' + index + ',' + qIdx + ',this.innerText)"><b>🔒 Info Admin (Edit Kunci):</b> ' + altStr + '</div>' : '') +
                        '</div>';
                    } else if (q.type === 'essay') {
                        let altStr = q.correctAnswers ? q.correctAnswers.join(' | ') : '';
                        qi += '<div class="short-answer-box" style="margin-top:10px;">' +
                            '<textarea class="input-box" placeholder="Ketik jawaban uraian/essay di sini..." rows="4" style="font-size:14px; padding:10px 12px; border:2px solid #3498db; border-radius:8px; width:100%; box-sizing:border-box; resize:vertical;"></textarea>' +
                            (isEdit ? '<div style="font-size:11px; color:#c0392b; margin-top:8px; background:#fadbd8; padding:6px; border-radius:4px; border-left:4px solid #e74c3c;" contenteditable="true" oninput="updateKunciIsianInline(' + index + ',' + qIdx + ',this.innerText)"><b>🔒 Kunci/Poin Essay:</b> ' + altStr + '</div>' : '') +
                        '</div>';
                    } else if (q.type === 'pgk') {
                        qi += '<div class="quiz-options">';
                        (q.options || []).forEach(function(opt, oIdx) {
                            let isKunci = isEdit ? (q.correctIndices && q.correctIndices.includes(oIdx)) : false;
                            if (isEdit) {
                                qi += '<div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">' +
                                      '<input type="checkbox" ' + (isKunci ? 'checked' : '') + ' style="width:16px;height:16px;cursor:pointer;accent-color:#27ae60;" onchange="updateKunciInlinePGK(' + index + ',' + qIdx + ',' + oIdx + ', this.checked)" title="Jadikan Kunci Jawaban">' +
                                      '<div class="quiz-option-btn" contenteditable="true" style="flex:1; margin:0;" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'o\',this,' + oIdx + ')">' + String.fromCharCode(65 + oIdx) + '. ' + opt + '</div>' +
                                      '</div>';
                            } else {
                                qi += '<label id="lbl-inline-pgk-' + index + '-' + qIdx + '-' + oIdx + '" class="quiz-option-btn" style="display:flex; align-items:center; gap:10px; cursor:pointer;">' +
                                      '<input type="checkbox" style="width:18px; height:18px; cursor:pointer; accent-color:#27ae60;" class="chk-inline-pgk-' + index + '-' + qIdx + '" value="' + oIdx + '">' +
                                      '<span>' + String.fromCharCode(65 + oIdx) + '. ' + opt + '</span>' +
                                      '</label>';
                            }
                        });
                        if (!isEdit) {
                            qi += '<button class="btn-action" id="btn-submit-pgk-' + index + '-' + qIdx + '" style="background:#27ae60; width:100%; margin-top:10px; padding:10px;" onclick="koreksiKuisInlinePGK(' + index + ',' + qIdx + ')">Kirim Jawaban PGK</button>';
                        }
                        qi += '</div>';
                    } else {
                        qi += '<div class="quiz-options">';
                        (q.options || []).forEach(function(opt, oIdx) {
                            let isKunci = isEdit ? (q.correctIndex === oIdx) : false;
                            if (isEdit) {
                                qi += '<div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">' +
                                      '<input type="radio" name="kunci-' + index + '-' + qIdx + '" ' + (isKunci ? 'checked' : '') + ' style="width:16px;height:16px;cursor:pointer;accent-color:#27ae60;" onchange="updateKunciInline(' + index + ',' + qIdx + ',' + oIdx + ')" title="Jadikan Kunci Jawaban">' +
                                      '<div class="quiz-option-btn" contenteditable="true" style="flex:1; margin:0;" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'o\',this,' + oIdx + ')">' + String.fromCharCode(65 + oIdx) + '. ' + opt + '</div>' +
                                      '</div>';
                            } else {
                                qi += '<button class="quiz-option-btn" id="opt-inline-' + index + '-' + qIdx + '-' + oIdx + '" onclick="jawabKuisInline(this,' + index + ',' + qIdx + ',' + oIdx + ',' + q.correctIndex + ')">' + String.fromCharCode(65 + oIdx) + '. ' + opt + '</button>';
                            }
                        });
                        qi += '</div>';
                    }

                    let btnBahas = '<div style="margin-top:15px; border-top:1px dashed #ddd; padding-top:10px; display:flex; justify-content:space-between; align-items:center;">' +
                                   '<button class="btn-action" style="background:#8e44ad; padding:6px 14px; font-size:12px; width:auto; border-radius:20px;" onclick="togglePembahasanInline(' + index + ',' + qIdx + ', ' + (!isEdit) + ')">' +
                                   '<span id="icon-bahas-' + index + '-' + qIdx + '">' + (isBahasOpen ? '− Tutup' : '+ Buka') + '</span> Pembahasan</button></div>';
                    qi += btnBahas;

                    let displayBahas = isBahasOpen ? 'block' : 'none';
                    let editBahasAttr = isEdit ? 'contenteditable="true" class="content-block"' : 'class="content-block"';

                    qi += '<div id="bahas-box-' + index + '-' + qIdx + '" style="display:' + displayBahas + '; margin-top:12px; padding:15px; background:#fdfefe; border:1px solid #d5dbdb; border-left:4px solid #8e44ad; border-radius:8px; position:relative; min-height:80px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">';
                    qi += '<canvas class="drawing-layer" data-index="' + index + '" data-q-index="' + qIdx + '" style="z-index:3;"></canvas>';
                    qi += '<div ' + editBahasAttr + ' data-index="' + index + '" style="position:relative; z-index:4; min-height:50px; background:transparent; border:none; outline:none; max-width:100% !important; padding:0 !important; box-shadow:none !important;" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'e\',this)">' + (q.explanation || 'Ketik pembahasan lengkap di sini...') + '</div>';
                    qi += '</div></div>';
                });

                qi += '<div class="quiz-nav-bar" style="margin-top:0;border-top:none;">';
                blok.questions.forEach(function(q, qIdx) {
                    qi += '<button class="quiz-nav-btn" id="nav-btn-inline-' + index + '-' + qIdx + '" onclick="document.querySelector(\'#inline-q-' + index + '-' + qIdx + '\').scrollIntoView({behavior:\'smooth\',block:\'center\'})">' + (qIdx + 1) + '</button>';
                });
                qi += '</div>';
            } else {
                qi += '<p style="color:#888;">Belum ada soal.</p>';
            }
            qi += '</div>';

            let floatImgsQuiz = window.renderFloatImagesHTML(index, -1, blok.floatImages || []);
            html += '<div class="block-wrapper" data-index="' + index + '" style="padding-top:' + padTop + ';padding-bottom:' + padBot + ';">' +
                '<div class="a4-paper-wrapper dynamic-block-shell" data-width="' + widthMode + '" style="background-color:' + bgCol + '; border:1px solid #cbd5e1; border-radius:10px; box-shadow:0 4px 16px rgba(15, 23, 42, 0.08); overflow:visible;">' +
                    '<div class="block-controls"><button onclick="geserBlok(' + index + ', -1)">⬆️</button><button onclick="geserBlok(' + index + ', 1)">⬇️</button><button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button><button onclick="hapusBlok(' + index + ')">🗑️ Delete</button></div>' +
                    collapseBarHtml +
                    '<div class="block-collapsible-area" style="display:' + displayStyle + '; width:100%; position:relative;">' +
                        '<div class="draw-float-layer" data-index="' + index + '">' + floatImgsQuiz + '</div>' +
                        '<canvas class="drawing-layer" data-index="' + index + '"></canvas>' +
                        '<div class="content-block dynamic-content-block ' + patClass + '" data-index="' + index + '" data-width="' + widthMode + '" style="background-color:transparent; border:none!important; box-shadow:none!important; min-height:0!important; padding:0!important;">' +
                            qi +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }
        // 3. TIPE BLOK MODUL INTERAKTIF
        else if (blok.type === 'modul_interaktif') {
            let htmlKartu = "";
            if (typeof window.bangunHTMLKartuModulInteraktif === 'function') {
                let gabunganKode = blok.cssCode ? ("<style>\n" + blok.cssCode + "\n</style>\n" + blok.htmlCode) : blok.htmlCode;
                htmlKartu = window.bangunHTMLKartuModulInteraktif(blok.judul, gabunganKode);
            } else {
                htmlKartu = "<div style='padding:20px; text-align:center; color:#e74c3c; border:2px dashed #e74c3c; border-radius:12px;'>Mesin Modul Interaktif sedang dimuat... Silakan refresh halaman.</div>";
            }

            html += '<div class="block-wrapper" data-index="' + index + '" style="padding-top:' + padTop + ';padding-bottom:' + padBot + ';">' +
                '<div class="a4-paper-wrapper dynamic-block-shell" data-width="' + widthMode + '" style="border:1px solid #cbd5e1; border-radius:10px; box-shadow:0 4px 16px rgba(15, 23, 42, 0.08); overflow:visible; background-color:' + bgCol + ';">' +
                    (isEdit ? '<div class="block-controls"><button onclick="geserBlok(' + index + ', -1)">⬆️</button><button onclick="geserBlok(' + index + ', 1)">⬇️</button><button onclick="hapusBlok(' + index + ')">🗑️ Delete</button></div>' : '') +
                    collapseBarHtml +
                    '<div class="block-collapsible-area" style="display:' + displayStyle + '; width:100%; position:relative;">' +
                        '<div class="content-block dynamic-content-block" data-width="' + widthMode + '" data-index="' + index + '" style="border:none !important; box-shadow:none !important; background:transparent !important; min-height:auto !important; padding:0 !important;">' +
                            htmlKartu +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }
        // 4. TIPE BLOK TEKS & TABEL DINAMIS
        else {
            let floatImgsText = window.renderFloatImagesHTML(index, -1, blok.floatImages || []);
            html += '<div class="block-wrapper" data-index="' + index + '" style="padding-top:' + padTop + ';padding-bottom:' + padBot + ';">' +
                '<div class="a4-paper-wrapper dynamic-block-shell" data-width="' + widthMode + '" style="background-color:' + bgCol + '; border:1px solid #cbd5e1; border-radius:10px; box-shadow:0 4px 16px rgba(15, 23, 42, 0.08); overflow:visible;">' +     
                    '<div class="block-controls"><button onclick="geserBlok(' + index + ', -1)">⬆️</button><button onclick="geserBlok(' + index + ', 1)">⬇️</button><button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button><button onclick="hapusBlok(' + index + ')">🗑️ Delete</button></div>' +
                    collapseBarHtml +
                    '<div class="block-collapsible-area" style="display:' + displayStyle + '; width:100%; position:relative;">' +
                        '<div class="draw-float-layer" data-index="' + index + '">' + floatImgsText + '</div>' +
                        '<canvas class="drawing-layer" data-index="' + index + '"></canvas>' +
                        '<div class="content-block a4-portrait-block dynamic-content-block ' + patClass + '" ' + (isEdit ? 'contenteditable="true"' : '') + ' data-index="' + index + '" data-block-type="text" data-width="' + widthMode + '" style="background-color:transparent; color:' + txtCol + '; border:none!important; box-shadow:none!important;" oninput="window.cekBatasTinggiA4Input(event, this)">' +
                            blok.html +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }
    });

    let container = document.getElementById('blocks-container');
    if (container) container.innerHTML = html;

    if (typeof window.renderHomeSideBlocks === 'function') {
        window.renderHomeSideBlocks();
    }

    if (window.renderMathJax) window.renderMathJax();
    setTimeout(function() {
        if (typeof window.inisialisasiSemuaCanvas === 'function') window.inisialisasiSemuaCanvas();
    }, 150);
};

/* =========================================================
   CONTENT BLOCK KIRI & KANAN KHUSUS HALAMAN HOME
   ========================================================= */
window.homeLeftBlocksData = window.homeLeftBlocksData || [];
window.homeRightBlocksData = window.homeRightBlocksData || [];

window.pastikanWadahHomeSideAda = function() {
    let editorWrap = document.getElementById('main-editor-wrapper');
    let blocksCont = document.getElementById('blocks-container');
    if (!editorWrap || !blocksCont) return;

    let layoutGrid = document.getElementById('home-three-col-layout');
    if (!layoutGrid) {
        layoutGrid = document.createElement('div');
        layoutGrid.id = 'home-three-col-layout';
        layoutGrid.className = 'home-three-col-layout';

        let leftSide = document.createElement('div');
        leftSide.id = 'home-left-sidebar';
        leftSide.className = 'home-side-column home-side-left';

        let rightSide = document.createElement('div');
        rightSide.id = 'home-right-sidebar';
        rightSide.className = 'home-side-column home-side-right';

        editorWrap.insertBefore(layoutGrid, blocksCont);
        layoutGrid.appendChild(leftSide);
        layoutGrid.appendChild(blocksCont);
        layoutGrid.appendChild(rightSide);
    }
};

window.renderHomeSideBlocks = function() {
    window.pastikanWadahHomeSideAda();
    let leftSide = document.getElementById('home-left-sidebar');
    let rightSide = document.getElementById('home-right-sidebar');
    let layoutGrid = document.getElementById('home-three-col-layout');
    if (!leftSide || !rightSide || !layoutGrid) return;

    let currentBab = (window.babAktif || "home").toLowerCase();
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');

    // HANYA TAMPIL DI HALAMAN HOME
    if (currentBab !== "home") {
        leftSide.style.display = 'none';
        rightSide.style.display = 'none';
        layoutGrid.classList.remove('is-home-active');
        return;
    }

    layoutGrid.classList.add('is-home-active');
    let leftArr = Array.isArray(window.homeLeftBlocksData) ? window.homeLeftBlocksData : [];
    let rightArr = Array.isArray(window.homeRightBlocksData) ? window.homeRightBlocksData : [];

    // Sembunyikan kolom samping di mode siswa jika belum ada blok yang ditambahkan
    leftSide.style.display = (isEdit || leftArr.length > 0) ? 'flex' : 'none';
    rightSide.style.display = (isEdit || rightArr.length > 0) ? 'flex' : 'none';

    function bangunHTMLKolomSamping(posisi, arrData) {
        let labelPosisi = posisi === 'left' ? 'Kiri' : 'Kanan';
        let htmlSamping = '';

        arrData.forEach(function(item, idx) {
            let bgCol = item.bg || '#ffffff';
            htmlSamping +=
                '<div class="home-side-card-wrap">' +
                    (isEdit ? (
                        '<div class="home-side-controls">' +
                            (arrData.length > 1 ? '<button type="button" onclick="window.geserBlokSampingHome(\'' + posisi + '\', ' + idx + ', -1)" title="Geser Naik">⬆️</button>' : '') +
                            (arrData.length > 1 ? '<button type="button" onclick="window.geserBlokSampingHome(\'' + posisi + '\', ' + idx + ', 1)" title="Geser Turun">⬇️</button>' : '') +
                            '<button type="button" onclick="window.hapusBlokSampingHome(\'' + posisi + '\', ' + idx + ')" style="color:#e74c3c;" title="Hapus Blok ' + labelPosisi + '">🗑️ Hapus</button>' +
                        '</div>'
                    ) : '') +
                    '<div class="content-block home-side-editable" ' + (isEdit ? 'contenteditable="true"' : '') + ' data-side-pos="' + posisi + '" data-side-index="' + idx + '" style="background:' + bgCol + ';" oninput="window.ketikBlokSampingHome(\'' + posisi + '\', ' + idx + ', this)">' +
                        (item.html || '<p>Ketik materi blok ' + labelPosisi.toLowerCase() + '...</p>') +
                    '</div>' +
                '</div>';
        });

        if (isEdit) {
            htmlSamping +=
                '<button type="button" class="btn-add-side-home" onclick="window.tambahBlokSampingHome(\'' + posisi + '\')">' +
                    '⊕ Tambah Content Block ' + labelPosisi +
                '</button>';
        }
        return htmlSamping;
    }

    leftSide.innerHTML = bangunHTMLKolomSamping('left', leftArr);
    rightSide.innerHTML = bangunHTMLKolomSamping('right', rightArr);
};

window.tambahBlokSampingHome = function(posisi) {
    let blokBaru = {
        id: 'side_' + posisi + '_' + Date.now(),
        html: '<h3>Info ' + (posisi === 'left' ? 'Kiri' : 'Kanan') + '</h3><p>Ketik pengumuman atau materi di sini...</p>',
        bg: '#ffffff'
    };
    if (posisi === 'left') {
        if (!Array.isArray(window.homeLeftBlocksData)) window.homeLeftBlocksData = [];
        window.homeLeftBlocksData.push(blokBaru);
    } else {
        if (!Array.isArray(window.homeRightBlocksData)) window.homeRightBlocksData = [];
        window.homeRightBlocksData.push(blokBaru);
    }
    window.renderHomeSideBlocks();
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB('home');
};

window.hapusBlokSampingHome = function(posisi, idx) {
    window.tampilkanCustomDialog("confirm", "Hapus Content Block " + (posisi === 'left' ? 'Kiri' : 'Kanan') + " ini?", null, function(isYes) {
        if (!isYes) return;
        if (posisi === 'left' && Array.isArray(window.homeLeftBlocksData)) {
            window.homeLeftBlocksData.splice(idx, 1);
        } else if (posisi === 'right' && Array.isArray(window.homeRightBlocksData)) {
            window.homeRightBlocksData.splice(idx, 1);
        }
        window.renderHomeSideBlocks();
        if (typeof window.simpanKeDB === 'function') window.simpanKeDB('home');
    });
};

window.geserBlokSampingHome = function(posisi, idx, dir) {
    let arr = posisi === 'left' ? window.homeLeftBlocksData : window.homeRightBlocksData;
    if (!Array.isArray(arr)) return;
    if (idx + dir >= 0 && idx + dir < arr.length) {
        let temp = arr[idx];
        arr[idx] = arr[idx + dir];
        arr[idx + dir] = temp;
        window.renderHomeSideBlocks();
        if (typeof window.simpanKeDB === 'function') window.simpanKeDB('home');
    }
};

window.ketikBlokSampingHome = function(posisi, idx, el) {
    let arr = posisi === 'left' ? window.homeLeftBlocksData : window.homeRightBlocksData;
    if (Array.isArray(arr) && arr[idx]) {
        arr[idx].html = el.innerHTML;
    }
    let st = document.getElementById('save-status-bar');
    if (st) st.innerHTML = "<span style='color:#e67e22;'>✍️ Typing...</span>";
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(function() {
        if (typeof window.simpanKeDB === 'function') window.simpanKeDB('home');
        window.typingTimer = null;
    }, 450);
};

window.activeBlockIndex = -1;

window.perbaruiIndeksSemuaBlokDOM = function() {
    let wrappers = document.querySelectorAll('#blocks-container > .block-wrapper');
    wrappers.forEach(function(w, idx) {
        w.setAttribute('data-index', idx);
        let fl = w.querySelector('.draw-float-layer');
        if (fl) fl.setAttribute('data-index', idx);
        let cv = w.querySelector('.drawing-layer');
        if (cv) cv.setAttribute('data-index', idx);
        let cb = w.querySelector('.content-block');
        if (cb) cb.setAttribute('data-index', idx);
        let btns = w.querySelectorAll('.block-controls button');
        if (btns.length === 4) {
            btns[0].setAttribute('onclick', 'geserBlok(' + idx + ', -1)');
            btns[1].setAttribute('onclick', 'geserBlok(' + idx + ', 1)');
            btns[2].setAttribute('onclick', 'bukaSidebarBlock(' + idx + ')');
            btns[3].setAttribute('onclick', 'hapusBlok(' + idx + ')');
        }
    });
};

window.tambahBlokBaruAkhir = function() { 
    let newBlock = {
        type: 'text', html: "<p>Ketik materi...</p>", bg: "#ffffff", pattern: "", 
        color: "#333333", width: "M", padTop: "40px", padBot: "40px", drawing: "", 
        floatImages: [], isCollapsed: false, blockTitle: "Materi Baru"
    };
    window.contentBlocksData.push(newBlock);
    window.renderBlocks();
    window.perbaruiIndeksSemuaBlokDOM();
    if (window.simpanKeDB) window.simpanKeDB(); 
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'}); 
}; 

window.tambahBlokBaruTengah = function() {
    let newBlock = { 
        type: "text", html: "<p>Ketik materi...</p>", bg: "#ffffff", pattern: "", 
        color: "#333333", width: "M", padTop: "40px", padBot: "40px", drawing: "", 
        floatImages: [], isCollapsed: false, blockTitle: "Materi Baru"
    };
    
    if (window.activeBlockIndex > -1 && window.activeBlockIndex < window.contentBlocksData.length) {
        window.contentBlocksData.splice(window.activeBlockIndex + 1, 0, newBlock);
    } else {
        window.contentBlocksData.push(newBlock);
    }
    
    document.getElementById("sidebar-block").classList.remove("open");
    window.renderBlocks();
    window.perbaruiIndeksSemuaBlokDOM();
    if (window.simpanKeDB) window.simpanKeDB();
};

window.hapusBlok = function(i) {
    if (window.contentBlocksData.length <= 1) {
        return window.tampilkanCustomDialog("alert", "⚠️ Minimal harus tersisa 1 content block di halaman ini!", null, null);
    }
    window.tampilkanCustomDialog("confirm", "Hapus blok materi ini?", null, function(isYes) {
        if (!isYes) return;
        window.contentBlocksData.splice(i, 1);
        let wrappers = document.querySelectorAll('#blocks-container > .block-wrapper');
        if (wrappers[i]) wrappers[i].remove();
        window.perbaruiIndeksSemuaBlokDOM();
        if (window.simpanKeDB) window.simpanKeDB();
    });
};

window.geserBlok = function(i, dir) {
    if(i + dir >= 0 && i + dir < window.contentBlocksData.length) {
        let temp = window.contentBlocksData[i]; 
        window.contentBlocksData[i] = window.contentBlocksData[i+dir]; 
        window.contentBlocksData[i+dir] = temp;
        
        let container = document.getElementById('blocks-container');
        let wrappers = container.children;
        let currentEl = wrappers[i];
        
        if (dir === -1) {
            container.insertBefore(currentEl, wrappers[i - 1]);
        } else if (dir === 1) {
            container.insertBefore(currentEl, wrappers[i + 2] || null);
        }
        
        window.perbaruiIndeksSemuaBlokDOM();
        if(window.simpanKeDB) window.simpanKeDB();
    }
};

window.bukaSidebarBlock = function(i) {
    window.activeBlockIndex = i;
    let b = window.contentBlocksData[i];
    if (!b) return;
    let inTop = document.querySelector('input[oninput*="padTop"]');
    let inBot = document.querySelector('input[oninput*="padBot"]');
    if (inTop) inTop.value = parseInt(b.padTop) || 25;
    if (document.getElementById('val-padtop')) document.getElementById('val-padtop').innerText = b.padTop || '25px';
    if (inBot) inBot.value = parseInt(b.padBot) || 25;
    if (document.getElementById('val-padbot')) document.getElementById('val-padbot').innerText = b.padBot || '25px';
    document.getElementById('sidebar-block').classList.add('open');
};

window.ubahStyleBlok = function(t, v) {
    let idx = (typeof window.activeBlockIndex === 'number' && window.activeBlockIndex > -1) ? window.activeBlockIndex : -1;
    if (idx === -1 || !window.contentBlocksData[idx]) return;

    window.contentBlocksData[idx][t] = v;
    let d = document.querySelector('.content-block[data-index="' + idx + '"]');
    let shell = d ? d.closest('.dynamic-block-shell') : null;
    let wrap = document.querySelector('.block-wrapper[data-index="' + idx + '"]');

    if (d) {
        if (t === 'bg') d.style.backgroundColor = v;
        if (t === 'color') d.style.color = v;
        if (t === 'width') {
            d.setAttribute('data-width', v);
            if (shell) shell.setAttribute('data-width', v);
            setTimeout(function() {
                if (typeof window.inisialisasiSemuaCanvas === 'function') window.inisialisasiSemuaCanvas();
            }, 100);
        }
    }
    if (wrap) {
        if (t === 'padTop') wrap.style.paddingTop = v;
        if (t === 'padBot') wrap.style.paddingBottom = v;
    }
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
};

window.ubahPolaBkg = function(pola) {
    let idx = (typeof window.activeBlockIndex === 'number' && window.activeBlockIndex > -1) ? window.activeBlockIndex : -1;
    if (idx === -1 || !window.contentBlocksData[idx]) return;

    window.contentBlocksData[idx].pattern = pola;
    let d = document.querySelector('.content-block[data-index="' + idx + '"]');
    let wrap = document.querySelector('.block-wrapper[data-index="' + idx + '"]');

    if (wrap) wrap.classList.remove('bg-pattern-lines', 'bg-pattern-grid', 'bg-pattern-dots');
    if (d) {
        d.classList.remove('bg-pattern-lines', 'bg-pattern-grid', 'bg-pattern-dots');
        if (pola) d.classList.add(pola);
    }
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
};

/* =========================================
   FUNGSI FLOATING BOXES (SHAPE)
   ========================================= */
window.renderFloatingBoxes = function() {
    let html = ''; 
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    
    (window.floatingBoxesData || []).forEach((fb, i) => {
        html += `<div class="floating-box" id="fb-${i}" style="left:${fb.x}; top:${fb.y}; width:${fb.w}; height:${fb.h}; background:${fb.bg||'#fafafa'};">
            <div class="fb-drag" onpointerdown="startDragFB(event, ${i})">✥ Drag</div>
            <button class="fb-delete" onclick="hapusFloatingBox(${i})">✕</button>
            <div class="fb-content" data-fb-index="${i}" ${isEdit?'contenteditable="true"':''}>
                <canvas class="drawing-layer fb-canvas" data-fb-index="${i}"></canvas>
                ${fb.html}
            </div>
            <div class="fb-resize" onpointerdown="startResizeFB(event, ${i})"></div>
        </div>`;
    });
    
    let container = document.getElementById('floating-boxes-container');
    if(container) container.innerHTML = html; 
};

window.tambahFloatingBox = function() { 
    if(!window.floatingBoxesData) window.floatingBoxesData = []; 
    window.floatingBoxesData.push({ x: '20px', y: '20px', w: '300px', h: '200px', html: '<h3>Shape Baru</h3><p>Ketik penjelasan...</p>', drawing: '', bg: '#fdfdfd' }); 
    window.renderFloatingBoxes(); 
    if(window.simpanKeDB) window.simpanKeDB(); 
};

window.hapusFloatingBox = function(i) { 
    if(confirm('Hapus elemen ini?')) { 
        window.floatingBoxesData.splice(i, 1); 
        window.renderFloatingBoxes(); 
        if(window.simpanKeDB) window.simpanKeDB(); 
    } 
};

window.startDragFB = function(e, i) {
    if(!document.body.classList.contains('mode-edit-aktif')) return; 
    e.preventDefault();
    let el = document.getElementById('fb-'+i), sX = e.clientX, sY = e.clientY;
    let sL = parseInt(el.style.left) || 0, sT = parseInt(el.style.top) || 0;
    
    function move(ev) { 
        el.style.left = (sL + (ev.clientX - sX)) + 'px'; 
        el.style.top = (sT + (ev.clientY - sY)) + 'px'; 
    }
    function up(ev) { 
        document.removeEventListener('pointermove', move); 
        document.removeEventListener('pointerup', up); 
        window.floatingBoxesData[i].x = el.style.left; 
        window.floatingBoxesData[i].y = el.style.top; 
        if(window.simpanKeDB) window.simpanKeDB(); 
    }
    document.addEventListener('pointermove', move); 
    document.addEventListener('pointerup', up);
};

window.startResizeFB = function(e, i) {
    if(!document.body.classList.contains('mode-edit-aktif')) return; 
    e.preventDefault(); e.stopPropagation();
    let el = document.getElementById('fb-'+i), sX = e.clientX, sY = e.clientY;
    let sW = el.offsetWidth, sH = el.offsetHeight;
    
    function move(ev) { 
        el.style.width = (sW + (ev.clientX - sX)) + 'px'; 
        el.style.height = (sH + (ev.clientY - sY)) + 'px'; 
    }
    function up(ev) { 
        document.removeEventListener('pointermove', move); 
        document.removeEventListener('pointerup', up); 
        window.floatingBoxesData[i].w = el.style.width; 
        window.floatingBoxesData[i].h = el.style.height; 
        if(window.simpanKeDB) window.simpanKeDB(); 
    }
    document.addEventListener('pointermove', move); 
    document.addEventListener('pointerup', up);
};

/* =========================================================================
   FUNGSI KONTROL MODAL & PENGUNCI SCROLL BACKGROUND (HP & LAPTOP)
   ========================================================================= */
window.topModalZIndex = 5100;
window._openModalStack = [];
window._lastModalOpenTime = 0;
window._savedScrollContainersOverflow = null;

window.apakahAdaModalOverlayTerbuka = function() {
    let ada = false;
    document.querySelectorAll('.modal-overlay').forEach(function(m) {
        let disp = window.getComputedStyle(m).display;
        if (m.style.display === 'flex' || m.style.display === 'block' || disp === 'flex' || disp === 'block') {
            ada = true;
        }
    });
    return ada;
};

window.sinkronkanKunciScrollModal = function() {
    let adaModalTerbuka = window.apakahAdaModalOverlayTerbuka();
    let ujianRoom = document.getElementById('ujian-strict-room');
    let tempRoom = document.getElementById('temporary-quiz-room');
    let isRoomOpen = Boolean(
        (ujianRoom && window.getComputedStyle(ujianRoom).display !== 'none') ||
        (tempRoom && window.getComputedStyle(tempRoom).display !== 'none')
    );

    let scrollTargets = [
        ujianRoom,
        tempRoom,
        document.getElementById('main-editor-wrapper')
    ].filter(Boolean);

    if (adaModalTerbuka) {
        document.documentElement.classList.add('modal-open-lock');
        document.body.classList.add('modal-open-lock');

        if (!window._savedScrollContainersOverflow) {
            window._savedScrollContainersOverflow = {
                scrollY: window.scrollY || window.pageYOffset || 0,
                lockedBodyFixed: !isRoomOpen && !window.isStrictUjianActive,
                bodyOverflow: document.body.style.overflow,
                htmlOverflow: document.documentElement.style.overflow,
                containers: scrollTargets.map(function(el) {
                    return { el: el, overflow: el.style.overflow };
                })
            };

            // Kunci fisik posisi body di halaman normal agar iOS Safari tidak mungkin menarik background
            if (window._savedScrollContainersOverflow.lockedBodyFixed) {
                document.body.style.position = 'fixed';
                document.body.style.top = '-' + window._savedScrollContainersOverflow.scrollY + 'px';
                document.body.style.left = '0';
                document.body.style.right = '0';
                document.body.style.width = '100%';
            }
        }

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        scrollTargets.forEach(function(el) {
            el.style.overflow = 'hidden';
        });
    } else {
        document.documentElement.classList.remove('modal-open-lock');
        document.body.classList.remove('modal-open-lock');
        window._openModalStack = [];

        if (window._savedScrollContainersOverflow) {
            let saved = window._savedScrollContainersOverflow;
            window._savedScrollContainersOverflow = null;

            document.documentElement.style.overflow = saved.htmlOverflow || '';
            document.body.style.overflow = window.isStrictUjianActive ? 'auto' : (saved.bodyOverflow || '');

            if (saved.lockedBodyFixed) {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.width = '';
            }

            (saved.containers || []).forEach(function(item) {
                if (item && item.el) {
                    item.el.style.overflow = item.overflow || '';
                }
            });

            if (saved.lockedBodyFixed && saved.scrollY > 0) {
                window.scrollTo(0, saved.scrollY);
            }
        } else if (!window.isStrictUjianActive) {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }
    }
};

window.bukaModal = function(id) {
    let el = document.getElementById(id);
    if (!el) return;

    let sudahTerbuka = (el.style.display === 'flex');
    window._lastModalOpenTime = Date.now();
    window.topModalZIndex += 10;
    el.style.zIndex = window.topModalZIndex;
    el.style.display = 'flex';

    if (typeof window.closeDropdowns === 'function') {
        window.closeDropdowns();
    }

    if (!sudahTerbuka) {
        let bodyEl = el.querySelector('.modal-body');
        if (bodyEl) bodyEl.scrollTop = 0;
    }

    window._openModalStack = (window._openModalStack || []).filter(function(mId) { return mId !== id; });
    window._openModalStack.push(id);
    window.sinkronkanKunciScrollModal();
};

window.tutupModal = function(id) {
    let el = document.getElementById(id);
    if (el) el.style.display = 'none';

    if (id === 'modal-my-pet') {
        window.isMyPetModalOpen = false;
    }

    window._openModalStack = (window._openModalStack || []).filter(function(mId) { return mId !== id; });
    window.sinkronkanKunciScrollModal();
};

window.tutupModalHasilQuiz = function() {
    window.tutupModal('modal-quiz-result');
};

// Blokir scroll latar belakang di Laptop (wheel/trackpad) saat ada modal terbuka
document.addEventListener('wheel', function(e) {
    if (!window.apakahAdaModalOverlayTerbuka()) return;
    let inModalBox = e.target && e.target.closest ? e.target.closest('.modal-box, .popup-welcome-box, .floating-cg') : null;
    if (!inModalBox) {
        e.preventDefault();
    }
}, { passive: false, capture: true });

// Blokir scroll latar belakang di HP/Tablet (touchmove) saat ada modal terbuka,
// sambil membebaskan penuh scroll horizontal (kiri-kanan) & vertikal di seluruh elemen dalam modal
window._modalTouchState = {
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    axis: null
};

window.cariKontainerScrollableDalamModal = function(startEl, modalRoot, arah, delta) {
    let el = startEl;
    while (el && el !== document.body && el !== document.documentElement) {
        if (el.nodeType === 1) {
            let st = window.getComputedStyle(el);
            if (arah === 'x') {
                let bisaScrollX = (st.overflowX === 'auto' || st.overflowX === 'scroll') && (el.scrollWidth > el.clientWidth + 1);
                if (bisaScrollX) return el;
            } else {
                let bisaScrollY = (st.overflowY === 'auto' || st.overflowY === 'scroll') && (el.scrollHeight > el.clientHeight + 1);
                if (bisaScrollY) {
                    let mentokAtas = el.scrollTop <= 0 && delta > 0;
                    let mentokBawah = (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) && delta < 0;
                    if (!mentokAtas && !mentokBawah) return el;
                }
            }
        }
        if (el === modalRoot) break;
        el = el.parentElement;
    }
    return null;
};

document.addEventListener('touchstart', function(e) {
    if (e.touches && e.touches.length === 1) {
        let t = e.touches[0];
        window._modalTouchState = {
            startX: t.clientX,
            startY: t.clientY,
            lastX: t.clientX,
            lastY: t.clientY,
            axis: null
        };
    }
}, { passive: true, capture: true });

document.addEventListener('touchmove', function(e) {
    if (!window.apakahAdaModalOverlayTerbuka()) return;
    if (!e.touches || e.touches.length !== 1) return;

    let target = e.target;
    let modalRoot = (target && target.closest) ? target.closest('.modal-box, .popup-welcome-box, .floating-cg') : null;

    // Sentuhan di area gelap backdrop luar modal: blokir penuh
    if (!modalRoot) {
        e.preventDefault();
        return;
    }

    // Bebaskan kontrol form (slider, dropdown, ketikan)
    let tag = target.tagName ? target.tagName.toUpperCase() : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
    }

    let t = e.touches[0];
    let st = window._modalTouchState;
    let totalDx = t.clientX - st.startX;
    let totalDy = t.clientY - st.startY;
    let stepDy = t.clientY - st.lastY;
    st.lastX = t.clientX;
    st.lastY = t.clientY;

    // Tunggu pergerakan minimal 5px agar getaran awal jari tidak membatalkan native scroll di iOS Safari
    if (!st.axis) {
        if (Math.abs(totalDx) < 5 && Math.abs(totalDy) < 5) {
            return;
        }
        st.axis = (Math.abs(totalDx) > Math.abs(totalDy)) ? 'x' : 'y';
    }

    // Gestur horizontal (kiri-kanan): izinkan penuh jika berada di dalam tabel/tab yang bisa digeser
    if (st.axis === 'x') {
        let scrollXEl = window.cariKontainerScrollableDalamModal(target, modalRoot, 'x', totalDx);
        if (scrollXEl) {
            return;
        }
        e.preventDefault();
        return;
    }

    // Gestur vertikal (atas-bawah): izinkan hanya jika masih bisa di-scroll di dalam modal
    let deltaY = stepDy !== 0 ? stepDy : totalDy;
    let scrollYEl = window.cariKontainerScrollableDalamModal(target, modalRoot, 'y', deltaY);
    if (!scrollYEl) {
        e.preventDefault();
    }
}, { passive: false, capture: true });

// Pantau perubahan display pada semua .modal-overlay (termasuk modal yang dibuat dinamis oleh JS)
document.addEventListener('DOMContentLoaded', function() {
    window.sinkronkanKunciScrollModal();
    let obsAllModals = new MutationObserver(function() {
        window.sinkronkanKunciScrollModal();
    });
    document.querySelectorAll('.modal-overlay').forEach(function(m) {
        obsAllModals.observe(m, { attributes: true, attributeFilter: ['style', 'class'] });
    });
    let bodyObs = new MutationObserver(function(muts) {
        muts.forEach(function(mu) {
            if (mu.type === 'childList') {
                mu.addedNodes.forEach(function(node) {
                    if (node && node.nodeType === 1) {
                        if (node.classList && node.classList.contains('modal-overlay')) {
                            obsAllModals.observe(node, { attributes: true, attributeFilter: ['style', 'class'] });
                            window.sinkronkanKunciScrollModal();
                        }
                        if (node.querySelectorAll) {
                            node.querySelectorAll('.modal-overlay').forEach(function(subM) {
                                obsAllModals.observe(subM, { attributes: true, attributeFilter: ['style', 'class'] });
                                window.sinkronkanKunciScrollModal();
                            });
                        }
                    }
                });
                mu.removedNodes.forEach(function(node) {
                    if (node && node.nodeType === 1 && node.classList && node.classList.contains('modal-overlay')) {
                        window.sinkronkanKunciScrollModal();
                    }
                });
            }
        });
    });
    bodyObs.observe(document.body, { childList: true, subtree: true });
});

// Cegah semua link <a href="#"> yang memiliki onclick agar tidak memicu lompatan halaman di iOS/Android
document.addEventListener('click', function(e) {
    let a = e.target.closest ? e.target.closest('a[href="#"]') : null;
    if (a && a.getAttribute('onclick')) {
        e.preventDefault();
    }
}, true);

window.bukaWelcomePopup = function() { 
    window.bukaModal('modal-welcome-popup'); 
    let box = document.getElementById('popup-content-box');
    if(document.body.classList.contains('mode-edit-aktif')) {
        document.getElementById('popup-img-tool').style.display = 'block';
        if(box) {
            // Beri izin edit dan paksa kursor berkedip otomatis
            box.setAttribute('contenteditable', 'true');
            if(!box.innerHTML.trim() || box.innerHTML.indexOf('Ketik pengumuman') !== -1) {
                box.innerHTML = "Ketik pengumuman Anda di sini...";
            }
            setTimeout(function() { box.focus(); }, 200); 
        }
    } else {
        document.getElementById('popup-img-tool').style.display = 'none';
        if(box) box.removeAttribute('contenteditable');
    }
};

window.tutupWelcomePopup = function() { 
    window.tutupModal('modal-welcome-popup'); 
    // Ingatan sessionStorage telah dihapus. Popup akan selalu muncul jika web di-refresh (F5).
};

/* =========================================
   SISTEM AUTENTIKASI 5 LEVEL, TAMU, & REGISTRASI MANDIRI
   ========================================= */
window.bukaModalLoginSistem = function() {
    window.bukaModal('modal-login-sistem');
    window.gantiTabAuth('login');
};

window.gantiTabAuth = function(tab) {
    let btnLog = document.getElementById('tab-auth-login');
    let btnReg = document.getElementById('tab-auth-register');
    let formLog = document.getElementById('form-auth-login');
    let formReg = document.getElementById('form-auth-register');
    
    if (tab === 'login') {
        btnLog.style.background = '#0b3954'; btnLog.style.color = 'white';
        btnReg.style.background = 'transparent'; btnReg.style.color = '#475569';
        formLog.style.display = 'block'; formReg.style.display = 'none';
        document.getElementById('judul-modal-auth').innerText = '🔒 Akses Sistem Belajar';
    } else {
        btnReg.style.background = '#0b3954'; btnReg.style.color = 'white';
        btnLog.style.background = 'transparent'; btnLog.style.color = '#475569';
        formLog.style.display = 'none'; formReg.style.display = 'block';
        document.getElementById('judul-modal-auth').innerText = '✨ Buat Akun Siswa Baru';
        
        // Populate dropdown kelas saat masuk tab registrasi
        let selKelas = document.getElementById('reg-select-kelas');
        let htmlKelas = '<option value="">-- Pilih Kelas Anda --</option>';
        Object.keys(window.adminData || {}).sort().forEach(k => htmlKelas += `<option value="${k}">${k}</option>`);
        htmlKelas += '<option value="Umum">🌍 Kelas Umum (Tamu/Luar)</option>';
        if (selKelas) selKelas.innerHTML = htmlKelas;
    }
};

window.updateDropdownNamaRegistrasi = function() {
    let kelas = document.getElementById('reg-select-kelas').value;
    let selNama = document.getElementById('reg-select-nama');
    let inpNamaManual = document.getElementById('reg-input-nama-baru');
    
    if (kelas === "Umum") {
        selNama.style.display = 'none';
        inpNamaManual.style.display = 'block';
        inpNamaManual.value = "";
    } else {
        selNama.style.display = 'block';
        inpNamaManual.style.display = 'none';
        let htmlNama = '<option value="">-- Pilih Nama Anda --</option>';
        (window.adminData[kelas] || []).sort().forEach(s => htmlNama += `<option value="${s}">${s}</option>`);
        selNama.innerHTML = htmlNama;
    }
};

window.isiOtomatisUsernameReg = function() {
    let nama = document.getElementById('reg-select-nama').value || document.getElementById('reg-input-nama-baru').value;
    if (!nama) return;
    let baseUser = nama.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    let inputUser = document.getElementById('reg-input-username');
    if (inputUser && baseUser) {
        inputUser.value = baseUser;
    }
};

window.masukSebagaiTamu = function() {
    sessionStorage.setItem("statusLogin", "tamu");
    sessionStorage.setItem("username", "Tamu");
    sessionStorage.setItem("guruTarget", window.guruAktif || "mahardika");
    
    // Simpan ingatan ke LocalStorage agar tidak perlu login ulang (Auto-Login)
    localStorage.setItem("statusLogin_mahardika", "tamu");
    localStorage.setItem("username_mahardika", "Tamu");
    localStorage.setItem("guruTarget_mahardika", window.guruAktif || "mahardika");
    
    window.location.reload();
};

window.prosesLoginSistem = function() {
    let rawUser = document.getElementById('input-username-login').value.trim();
    let userKey = rawUser.toLowerCase();
    let pass = document.getElementById('input-password-login').value;
    let btn = document.getElementById('btn-submit-login');
    let oldText = btn.innerText;
    
    btn.innerText = "⏳ Memverifikasi...";
    btn.disabled = true;

    let emailTarget = "";
    let roleTarget = "";
    let guruTarget = sessionStorage.getItem("guruTarget") || window.guruAktif || "mahardika";
    let dataSiswa = null;

    // SISTEM LOGIN (Tamu, Superadmin, Admin Guru, & Akun Masing-Masing Siswa)
    if (userKey === "sbd") {
        btn.innerText = oldText; btn.disabled = false;
        return alert("❌ Akun bersama SBD telah dinonaktifkan. Silakan login menggunakan Username & Password akun siswa Anda masing-masing.");
    }
    else if (userKey === "mahardika") {
        emailTarget = "mahardika@admin.com";
        roleTarget = "admin";
        guruTarget = "mahardika";
    }
    else if (window.daftarAkunGuru && window.daftarAkunGuru[userKey]) {
        emailTarget = userKey + "@guru.com";
        roleTarget = "admin";
        guruTarget = userKey;
    } 
    else {
        // Pengecekan Akun Siswa dari Database
        dataSiswa = window.akunSiswaData ? window.akunSiswaData[userKey] : null;
        if (!dataSiswa) {
            btn.innerText = oldText; btn.disabled = false;
            return alert("❌ Username tidak ditemukan. Pastikan ketikan benar atau buat akun baru.");
        }
        if (pass !== dataSiswa.password && pass !== "123456") {
            btn.innerText = oldText; btn.disabled = false;
            return alert("❌ Password salah!");
        }
        
        emailTarget = dataSiswa.gmail || (userKey + "@siswamahardika.com"); // Jika belum verif gmail, pakai dummy
        roleTarget = "siswa";
    }

    // Tembak Firebase Auth
    window.loginFirebase(emailTarget, pass, function() {
        document.body.classList.remove("mode-edit-aktif", "force-edit-mode");
        sessionStorage.removeItem("previewMode");
        
        let finalUser = userKey === "sbd" ? "SBD" : userKey;
        
        sessionStorage.setItem("statusLogin", roleTarget);
        sessionStorage.setItem("username", finalUser);
        sessionStorage.setItem("guruTarget", guruTarget);
        
        // Simpan ingatan ke LocalStorage agar tidak perlu login ulang (Auto-Login)
        localStorage.setItem("statusLogin_mahardika", roleTarget);
        localStorage.setItem("username_mahardika", finalUser);
        localStorage.setItem("guruTarget_mahardika", guruTarget);
        
        if (roleTarget === "siswa" || roleTarget === "tamu") window.location.reload();
        else window.location.href = "index.html?guru=" + encodeURIComponent(guruTarget) + "&bab=home";
    }, function(err) {
        // Jika siswa sudah tervalidasi username & password-nya di akun_siswa (termasuk akun otomatis / hasil reset guru),
        // izinkan masuk dan aktifkan sesi tulis Firebase di latar belakang
        if (roleTarget === "siswa" && dataSiswa && (pass === dataSiswa.password || pass === "123456")) {
            document.body.classList.remove("mode-edit-aktif", "force-edit-mode");
            sessionStorage.removeItem("previewMode");

            sessionStorage.setItem("statusLogin", roleTarget);
            sessionStorage.setItem("username", userKey);
            sessionStorage.setItem("guruTarget", guruTarget);

            localStorage.setItem("statusLogin_mahardika", roleTarget);
            localStorage.setItem("username_mahardika", userKey);
            localStorage.setItem("guruTarget_mahardika", guruTarget);

            if (typeof window.pastikanAuthFirebaseSiswaAktif === "function") {
                window.pastikanAuthFirebaseSiswaAktif(function() {
                    window.location.reload();
                });
            } else {
                window.location.reload();
            }
        } else {
            btn.innerText = oldText; btn.disabled = false;
            alert("❌ Akses Ditolak: Kredensial tidak valid. Pastikan username dan password benar.");
        }
    });
};

window.prosesRegistrasiAkunMandiri = function() {
    let kls = document.getElementById('reg-select-kelas').value;
    let nManual = document.getElementById('reg-input-nama-baru').value.trim();
    let nSelect = document.getElementById('reg-select-nama').value;
    let namaLengkap = (kls === "Umum") ? nManual : nSelect;
    let userRaw = document.getElementById('reg-input-username').value.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');
    let email = document.getElementById('reg-input-email').value.trim().toLowerCase();
    let pass = document.getElementById('reg-input-password').value;
    
    if(!kls || !namaLengkap || !userRaw || !email || !pass) return alert("⚠️ Semua kolom wajib diisi!");
    if(email.indexOf('@') === -1 || email.indexOf('.') === -1) return alert("⚠️ Masukkan alamat Gmail yang valid!");
    if(pass.length < 6) return alert("⚠️ Password minimal 6 karakter!");
    if(userRaw === "sbd" || userRaw === "mahardika") return alert("⚠️ Username tersebut tidak diizinkan.");

    // Cek apakah sudah ada akun otomatis untuk siswa ini di kelas yang sama (Jika ada, kita upgrade akunnya tanpa menolak!)
    let existingAutoKey = Object.keys(window.akunSiswaData || {}).find(function(k) {
        let ak = window.akunSiswaData[k];
        return ak && ak.kelas === kls && (ak.namaLengkap || "").trim().toLowerCase() === namaLengkap.trim().toLowerCase();
    });

    if (window.akunSiswaData && window.akunSiswaData[userRaw] && userRaw !== existingAutoKey) {
        return alert("⚠️ Username '" + userRaw + "' sudah dipakai siswa lain. Coba tambahkan angka di belakangnya.");
    }

    if (existingAutoKey && !window.akunSiswaData[existingAutoKey].isAutoGenerated && window.akunSiswaData[existingAutoKey].gmail) {
        return alert("⚠️ Nama '" + namaLengkap + "' sudah memiliki akun aktif (Username: " + existingAutoKey + ") di kelas " + kls + "!\nSilakan langsung Login atau minta Guru mereset password di menu Administrasi.");
    }

    // CEK ATURAN: 1 GMAIL MAKSIMAL 5 AKUN SISWA
    let daftarAkunSamaGmail = Object.values(window.akunSiswaData || {}).filter(function(ak) {
        return ak && ak.gmail && ak.gmail.trim().toLowerCase() === email;
    });
    if (daftarAkunSamaGmail.length >= 5) {
        return alert("⚠️ Batas Maksimal Tercapai!\n\nAlamat Gmail (" + email + ") sudah digunakan untuk 5 akun siswa. 1 Gmail maksimal hanya bisa mendaftarkan 5 akun.");
    }

    let btn = document.getElementById('btn-submit-register');
    let oldTxt = btn.innerText;
    btn.innerText = "⏳ Memproses & Mengirim Email...";
    btn.disabled = true;

    function simpanAkunSiswaBaruLokalDanServer(uidVal, sudahTerverifikasi) {
        if (!window.akunSiswaData) window.akunSiswaData = {};

        // Cari data Leaderboard lama milik siswa ini (baik dari username lama maupun nama lengkap) agar XP/Coin TIDAK HILANG
        let lbLama = null;
        if (window.leaderboardSiswaData) {
            if (window.leaderboardSiswaData[userRaw]) {
                lbLama = window.leaderboardSiswaData[userRaw];
            } else if (existingAutoKey && window.leaderboardSiswaData[existingAutoKey]) {
                lbLama = window.leaderboardSiswaData[existingAutoKey];
            } else {
                let foundLbKey = Object.keys(window.leaderboardSiswaData).find(function(k) {
                    let item = window.leaderboardSiswaData[k];
                    return item && item.kelas === kls && (item.namaLengkap || "").trim().toLowerCase() === namaLengkap.trim().toLowerCase();
                });
                if (foundLbKey) lbLama = window.leaderboardSiswaData[foundLbKey];
            }
        }

        if (existingAutoKey && existingAutoKey !== userRaw) {
            delete window.akunSiswaData[existingAutoKey];
        }

        window.akunSiswaData[userRaw] = {
            kelas: kls,
            namaLengkap: namaLengkap,
            username: userRaw,
            gmail: email,
            password: pass,
            uid: uidVal || ("uid_" + Date.now()),
            dibuat: new Date().toISOString(),
            isAutoGenerated: false
        };
        
        if (typeof window.simpanSemuaAkunSiswaKeDB === "function") window.simpanSemuaAkunSiswaKeDB();

        // Pertahankan XP, Coin, Pet, dan Border lama jika sudah ada!
        let payloadLB = Object.assign({
            kelas: kls,
            namaLengkap: namaLengkap,
            xp: 0,
            xpTotal: 0,
            coin: 0,
            xpTersedia: 0,
            loginTerakhir: "",
            statSoal: { PG: 0, PGK: 0, IS: 0, Essay: 0 }
        }, lbLama || {});
        payloadLB.kelas = kls;
        payloadLB.namaLengkap = namaLengkap;

        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(userRaw, payloadLB);
        }
        
        btn.innerText = oldTxt; btn.disabled = false;
        let infoKuota = " (Kuota Gmail terpakai: " + (daftarAkunSamaGmail.length + 1) + "/5 akun)";
        if (sudahTerverifikasi) {
            alert("✅ Akun berhasil diaktifkan!" + infoKuota + "\n\nSilakan Login menggunakan Username: " + userRaw);
        } else {
            alert("📩 BERHASIL!" + infoKuota + "\nLink verifikasi telah dikirim ke " + email + ".\n\nSilakan Login menggunakan Username: " + userRaw);
        }
        window.gantiTabAuth('login');
        document.getElementById('input-username-login').value = userRaw;
        document.getElementById('input-password-login').value = pass;
    }

    window.daftarkanEmailVerifikasiNyata(email, pass, function(uid, isAlreadyVerified) {
        simpanAkunSiswaBaruLokalDanServer(uid, isAlreadyVerified);
    }, function(err) {
        let errCode = (err && err.code) ? err.code : "";
        if (daftarAkunSamaGmail.length > 0 && daftarAkunSamaGmail.length < 5 && (errCode.indexOf("email-already-in-use") !== -1 || errCode.indexOf("invalid-credential") !== -1 || errCode.indexOf("wrong-password") !== -1)) {
            simpanAkunSiswaBaruLokalDanServer("shared_gmail_" + Date.now(), true);
            return;
        }
        btn.innerText = oldTxt; btn.disabled = false;
        alert("❌ Gagal mendaftar: Pastikan alamat Gmail valid.\nDetail: " + (err ? err.message : "Unknown error"));
    });
};

window.prosesLupaPassword = function() {
    let inputAwal = document.getElementById('input-username-login') ? document.getElementById('input-username-login').value.trim() : "";
    let userOrEmail = prompt("Masukkan USERNAME atau alamat GMAIL akun Anda untuk mereset password:", inputAwal);
    if (!userOrEmail || !userOrEmail.trim()) return;
    let bersih = userOrEmail.trim().toLowerCase();

    let targetEmail = "";
    let targetUserKey = "";

    if (window.akunSiswaData && window.akunSiswaData[bersih]) {
        targetUserKey = bersih;
        targetEmail = window.akunSiswaData[bersih].gmail || "";
    } else if (bersih.indexOf("@") !== -1) {
        targetEmail = bersih;
        let foundKey = Object.keys(window.akunSiswaData || {}).find(function(k) {
            return window.akunSiswaData[k] && (window.akunSiswaData[k].gmail || "").toLowerCase() === bersih;
        });
        if (foundKey) targetUserKey = foundKey;
    }

    if (!targetEmail) {
        return alert("⚠️ Akun ini belum menautkan alamat Gmail aktif. Silakan hubungi Guru Anda untuk mereset password atau gunakan password default (123456).");
    }

    if (typeof window.kirimResetPasswordGmail === "function") {
        window.kirimResetPasswordGmail(targetEmail, function() {
            alert("📩 Link reset password telah dikirim ke Gmail: " + targetEmail + (targetUserKey ? "\n(Username Login Anda: " + targetUserKey + ")" : ""));
        }, function(err) {
            alert("⚠️ Tidak dapat mengirim email reset otomatis (" + err.message + "). Silakan hubungi Guru Anda untuk bantuan reset password.");
        });
    }
};

window.prosesLogoutSistem = function(forceLogout) {
    if(forceLogout === true || confirm("Yakin ingin keluar dari akun ini?")) {
        if (sessionStorage.getItem("statusLogin") === "siswa" && typeof window.updatePresensiOnlineSiswa === "function") {
            window.updatePresensiOnlineSiswa(false, false);
        }
        let prevStatus = sessionStorage.getItem("statusLogin");
        let currentGuru = sessionStorage.getItem("guruTarget") || "mahardika";
        
        // 1. Bersihkan Data Sesi Browser
        sessionStorage.removeItem("statusLogin");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("previewMode");
        sessionStorage.clear(); // Pastikan bersih total
        
        // 2. Bersihkan Data Ingatan Permanen (Auto-Login)
        localStorage.removeItem("statusLogin_mahardika");
        localStorage.removeItem("username_mahardika");
        localStorage.removeItem("guruTarget_mahardika");

        // 3. Tembak Firebase untuk Logout
        if (typeof window.logoutFirebase === "function") {
            window.logoutFirebase(function() {
                // Beri jeda sangat singkat agar Firebase selesai memutuskan koneksi sebelum halaman dialihkan
                setTimeout(function() {
                    if (prevStatus === "admin" && currentGuru !== "mahardika") {
                        window.location.href = "index.html?guru=" + encodeURIComponent(currentGuru) + "&bab=home";
                    } else {
                        window.location.replace("index.html?bab=home"); // Gunakan replace agar tidak tersimpan di riwayat tombol "Back"
                    }
                }, 150);
            });
        } else {
            window.location.replace("index.html?bab=home");
        }
    }
};

// MODE PREVIEW: KHUSUS ADMIN/GURU
window.togglePreviewMode = function() {

    // PENGAMAN: Tolak pengguna selain admin
    if (
        typeof window.isAdminSession !== "function" ||
        !window.isAdminSession()
    ) {
        if (typeof window.kunciEditorUntukNonAdmin === "function") {
            window.kunciEditorUntukNonAdmin();
        } else {
            document.body.classList.remove("mode-edit-aktif");
            document.documentElement.classList.remove("force-edit-mode");
            sessionStorage.removeItem("previewMode");

            document.querySelectorAll(
                ".content-block, .fb-content, .header-title, #web-title"
            ).forEach(function(el) {
                el.removeAttribute("contenteditable");
            });

            const btn = document.getElementById("btn-preview");

            if (btn) {
                btn.style.setProperty("display", "none", "important");
            }
        }

        alert("🔒 Akses ditolak! Fitur ini hanya untuk admin/guru.");

        if (typeof window.renderBlocks === "function") {
            window.renderBlocks();
        }

        if (typeof window.renderFloatingBoxes === "function") {
            window.renderFloatingBoxes();
        }

        return;
    }

    // Jika admin, jalankan fungsi preview seperti biasa
    const b = document.body;
    const d = document.documentElement;
    const btn = document.getElementById("btn-preview");

    if (
        b.classList.contains("mode-edit-aktif") ||
        d.classList.contains("force-edit-mode")
    ) {
        // ADMIN MASUK KE MODE PREVIEW SISWA
        b.classList.remove("mode-edit-aktif");
        d.classList.remove("force-edit-mode");

        sessionStorage.setItem("previewMode", "true");

        document.querySelectorAll(
            ".content-block, .fb-content, .header-title"
        ).forEach(function(el) {
            el.removeAttribute("contenteditable");
        });

        if (btn) {
            btn.innerHTML = "✏️ Back to Edit";
            btn.style.background = "#27ae60";
        }

        if (window.renderMathJax) {
            window.renderMathJax();
        }

    } else {
        // ADMIN KEMBALI KE MODE EDIT
        b.classList.add("mode-edit-aktif");
        d.classList.add("force-edit-mode");

        sessionStorage.removeItem("previewMode");

        document.querySelectorAll(
            ".content-block, .fb-content, .header-title"
        ).forEach(function(el) {
            el.setAttribute("contenteditable", "true");
        });

        if (btn) {
            btn.innerHTML = "👁️ Preview as Student";
            btn.style.background = "#e67e22";
        }

        if (window.restoreMathJax) {
            window.restoreMathJax();
        }
    }

    if (window.renderBlocks) {
        window.renderBlocks();
    }

    if (window.renderFloatingBoxes) {
        window.renderFloatingBoxes();
    }
};

/* =========================================
   TOOLTIP ISTILAH (KANAN ATAS / KIRI ATAS OTOMATIS & TANPA SIMBOL 💡)
   ========================================= */
let tipTimer;

// Bersihkan simbol 💡 lama pada elemen .glossary-term jika masih ada
document.addEventListener('DOMContentLoaded', function() {
    let obsCleanGlossary = new MutationObserver(function() {
        document.querySelectorAll('.glossary-term').forEach(function(el) {
            if (el.innerText.indexOf('💡') !== -1) {
                el.innerText = el.innerText.replace(/💡/g, '').trim();
            }
        });
    });
    let editorWrap = document.getElementById('main-editor-wrapper');
    if (editorWrap) obsCleanGlossary.observe(editorWrap, { childList: true, subtree: true });
});

window.hoverIstilah = function(el, e) {
    clearTimeout(tipTimer);
    let tip = document.getElementById('tooltip-istilah');
    if (!tip) return;

    let cleanWord = el.innerText.replace(/💡/g, '').trim();
    document.getElementById('tooltip-title').innerText = cleanWord + ': ';
    document.getElementById('tooltip-body').innerText = el.getAttribute('data-penjelasan') || '';
    tip.style.display = 'block';

    // Hitung posisi kata di layar
    let rect = el.getBoundingClientRect();
    let tipW = tip.offsetWidth || 220;
    let tipH = tip.offsetHeight || 60;

    // Posisi Default: Kanan Atas dari kata tersebut
    let x = rect.right + 6;
    let y = rect.top - tipH - 6;

    // Jika kata berada di ujung kanan layar, pindahkan pop-up ke Kiri Atas dari kata tersebut
    if (x + tipW > window.innerWidth - 12) {
        x = rect.left - tipW - 6;
    }

    // Jaga agar tidak keluar batas kiri atau batas atas layar
    if (x < 10) x = 10;
    if (y < 10) y = rect.bottom + 6;

    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
};

window.leaveIstilah = function() { 
    tipTimer = setTimeout(function() {
        let tip = document.getElementById('tooltip-istilah');
        if (tip) tip.style.display = 'none';
    }, 250); 
};

document.addEventListener('mouseover', function(e) {
    let term = e.target.closest ? e.target.closest('.glossary-term') : null;
    if (term) window.hoverIstilah(term, e);
});
document.addEventListener('mouseout', function(e) {
    let term = e.target.closest ? e.target.closest('.glossary-term') : null;
    if (term) window.leaveIstilah();
});
document.addEventListener('click', function(e) {
    let term = e.target.closest ? e.target.closest('.glossary-term') : null;
    if (term) {
        window.hoverIstilah(term, e);
    } else if (!e.target.closest('#tooltip-istilah')) {
        let tip = document.getElementById('tooltip-istilah');
        if (tip) tip.style.display = 'none';
    }
});

/* =========================================
   AI TUTOR UI LOGIC
   ========================================= */
window.tutupAITutor = function() { document.getElementById('ai-tutor-box').style.display = 'none'; };

let aiHeader = document.getElementById('ai-tutor-header');
let aiBox = document.getElementById('ai-tutor-box');
let isDraggingAI = false, aiStartPosX, aiStartPosY, aiStartMouseX, aiStartMouseY;

if(aiHeader) {
    aiHeader.addEventListener('pointerdown', function(e) {
        isDraggingAI = true;
        aiStartMouseX = e.clientX; aiStartMouseY = e.clientY;
        let rect = aiBox.getBoundingClientRect();
        aiStartPosX = rect.left; aiStartPosY = rect.top;
        aiHeader.setPointerCapture(e.pointerId);
    });
    aiHeader.addEventListener('pointermove', function(e) {
        if(!isDraggingAI) return;
        aiBox.style.right = 'auto'; aiBox.style.bottom = 'auto';
        aiBox.style.left = (aiStartPosX + (e.clientX - aiStartMouseX)) + 'px';
        aiBox.style.top = (aiStartPosY + (e.clientY - aiStartMouseY)) + 'px';
    });
    aiHeader.addEventListener('pointerup', function(e) { 
        isDraggingAI = false; 
        aiHeader.releasePointerCapture(e.pointerId); 
    });
}

/* =========================================
   SELEKSI TEKS & SISIPAN EDITOR (MODAL TOOLS)
   ========================================= */
window.globalSelectedRange = null;

window.simpanSeleksiTeks = function() { 
    let sel = window.getSelection(); 
    if (sel && sel.rangeCount > 0) {
        let r = sel.getRangeAt(0);
        let el = r.commonAncestorContainer.nodeType === 3 ? r.commonAncestorContainer.parentNode : r.commonAncestorContainer;
        if (el && el.closest && el.closest(".content-block, .fb-content, #popup-content-box")) {
            window.globalSelectedRange = r.cloneRange();
            window.savedEditorRange = r.cloneRange();
            window.lastActiveEditable = el.closest(".content-block, .fb-content, #popup-content-box");
            return;
        }
    }
    if (window.savedEditorRange) {
        window.globalSelectedRange = window.savedEditorRange.cloneRange();
    }
};

window.kembalikanSeleksiTeks = function() { 
    if (window.lastActiveEditable) {
        window.lastActiveEditable.focus();
    }
    let targetRange = window.globalSelectedRange || window.savedEditorRange;
    if (targetRange) { 
        let sel = window.getSelection(); 
        sel.removeAllRanges(); 
        sel.addRange(targetRange); 
    } 
};

function simpanSeleksiTeks() { window.simpanSeleksiTeks(); }
function kembalikanSeleksiTeks() { window.kembalikanSeleksiTeks(); }

window.buatOpsiDropdownHalaman = function(placeholderText) {
    let html = '<option value="" disabled selected>' + placeholderText + '</option>';
    if (Array.isArray(window.pagesData)) {
        let inHiddenBranch = false;
        let guruSuffix = (window.guruAktif && window.guruAktif !== "mahardika") ? "guru=" + encodeURIComponent(window.guruAktif) + "&" : "";
        window.pagesData.forEach(function(p) {
            if (p.level === 0) {
                inHiddenBranch = Boolean(p.isLockedHidden);
            }
            let indent = "— ".repeat(p.level || 0);
            let badgeHidden = (inHiddenBranch || p.hidden) ? " 🔒 [Hidden]" : "";
            html += '<option value="index.html?' + guruSuffix + 'bab=' + encodeURIComponent(p.slug) + '">' + indent + p.title + badgeHidden + '</option>';
        });
    }
    return html;
};

// Modal Simbol
window.bukaModalSimbol = function() { 
    window.simpanSeleksiTeks(); 
    window.bukaModal("modal-simbol"); 
};
window.sisipkanSimbol = function(sym) { 
    window.kembalikanSeleksiTeks(); 
    document.execCommand("insertText", false, sym); 
    window.tutupModal("modal-simbol"); 
    triggerInput(); 
};

// Modal Glosarium (Istilah Tanpa Simbol 💡)
window.bukaModalGlosarium = function() { 
    window.simpanSeleksiTeks(); 
    if (!window.globalSelectedRange || window.globalSelectedRange.toString().trim() === "") {
        return alert("Blok satu kata atau istilah di dalam materi terlebih dahulu!"); 
    }
    document.getElementById("glosarium-input-text").value = ""; 
    window.bukaModal("modal-glosarium-edit"); 
};
window.terapkanPopUpIstilah = function() { 
    let ket = document.getElementById("glosarium-input-text").value.trim(); 
    if (!ket) return; 
    window.kembalikanSeleksiTeks(); 
    let span = document.createElement("span"); 
    span.className = "glossary-term"; 
    span.setAttribute("data-penjelasan", ket); 
    span.innerText = window.globalSelectedRange.toString().replace(/💡/g, "").trim(); 
    window.globalSelectedRange.deleteContents(); 
    window.globalSelectedRange.insertNode(span); 
    window.tutupModal("modal-glosarium-edit"); 
    triggerInput(); 
};
window.hapusIstilah = function() {
    pastikanFokusEditor();
    let sel = window.getSelection();
    if (sel.rangeCount > 0) {
        let node = sel.anchorNode;
        let span = node.nodeType === 3 ? node.parentNode : node;
        if (span && span.closest) span = span.closest(".glossary-term") || span;
        if (span && span.classList && span.classList.contains("glossary-term")) {
            let textClean = span.innerText.replace(/💡/g, "").trim();
            let textNode = document.createTextNode(textClean);
            span.parentNode.replaceChild(textNode, span); 
            triggerInput();
        } else { 
            alert("Letakkan kursor di dalam teks istilah yang ingin dihapus (bergaris bawah putus-putus)."); 
        }
    }
};

// Modal Tombol (Button Custom - Terhubung ke Semua Room & Room Hidden)
window.bukaModalCustomButton = function() { 
    window.simpanSeleksiTeks(); 
    document.getElementById("btn-text-input").value = "";
    document.getElementById("btn-external-input").value = "";
    document.getElementById("btn-internal-select").innerHTML = window.buatOpsiDropdownHalaman("-- Pilih Room Tujuan (Termasuk Room Hidden) --"); 
    window.bukaModal("modal-button-edit"); 
};
window.terapkanCustomButton = function() { 
    let txt = document.getElementById("btn-text-input").value || "Buka Materi"; 
    let int = document.getElementById("btn-internal-select").value; 
    let ext = document.getElementById("btn-external-input").value.trim(); 
    let url = ext ? (ext.indexOf("http") === 0 ? ext : "https://" + ext) : (int || "#"); 
    window.kembalikanSeleksiTeks(); 
    let a = document.createElement("a"); 
    a.className = "custom-site-btn"; 
    a.href = url; 
    a.innerText = txt; 
    if (window.globalSelectedRange) {
        window.globalSelectedRange.insertNode(a); 
    } else {
        window.formatTeks("insertHTML", a.outerHTML);
    }
    window.tutupModal("modal-button-edit"); 
    triggerInput(); 
};

// Modal Hyperlink
window.bukaModalHyperlink = function() { 
    window.simpanSeleksiTeks(); 
    document.getElementById("link-external-input").value = "";
    document.getElementById("link-internal-select").innerHTML = window.buatOpsiDropdownHalaman("-- Pilih Halaman Internal --"); 
    window.bukaModal("modal-link"); 
};
window.terapkanHyperlink = function() { 
    let int = document.getElementById("link-internal-select").value; 
    let ext = document.getElementById("link-external-input").value.trim(); 
    let url = ext ? (ext.indexOf("http") === 0 ? ext : "https://" + ext) : int; 
    if (url) { 
        window.kembalikanSeleksiTeks(); 
        if (window.globalSelectedRange && window.globalSelectedRange.toString().trim() === "") {
            let linkHtml = '<a href="' + url + '">' + url + '</a>';
            document.execCommand("insertHTML", false, linkHtml);
        } else {
            document.execCommand("createLink", false, url); 
        }
        window.tutupModal("modal-link"); 
        triggerInput(); 
    } 
};

// Upload Gambar via Tombol Toolbar (🖼️)
document.addEventListener("DOMContentLoaded", function() {
    let imgInput = document.getElementById("image-upload-input");
    if (imgInput) {
        imgInput.addEventListener("change", function() {
            let f = this.files && this.files[0];
            if (!f) return;
            window.kompresGambar(f, function(dataUrl) {
                window.kembalikanSeleksiTeks();
                document.execCommand("insertImage", false, dataUrl);
                triggerInput();
            });
            this.value = "";
        });
    }
});


/* =========================================
   MESIN INDEXED-DB UNTUK FILE LOKAL & MODE BACA OFFLINE PER BAB
   ========================================= */
window.initLocalDB = function() {
    return new Promise(function(resolve, reject) {
        let req = indexedDB.open("MahardikaLocalDB", 2);
        req.onupgradeneeded = function(e) {
            let db = e.target.result;
            if (!db.objectStoreNames.contains("mediaFiles")) {
                db.createObjectStore("mediaFiles", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("offlineRooms")) {
                db.createObjectStore("offlineRooms", { keyPath: "id" });
            }
        };
        req.onsuccess = function(e) { resolve(e.target.result); };
        req.onerror = function(e) { reject(e); };
    });
};

window.buatKeyOfflineBab = function(guru, slug) {
    return (guru || window.guruAktif || "mahardika").toLowerCase() + "__" + (slug || window.babAktif || "home");
};

window.ambilJudulBabDariSlug = function(slug) {
    let target = slug || window.babAktif || "home";
    if (Array.isArray(window.pagesData)) {
        let found = window.pagesData.find(function(p) { return p && p.slug === target; });
        if (found && found.title) return found.title;
    }
    return target === "home" ? "HOME" : target.replace(/-/g, " ").toUpperCase();
};

window.simpanBabOfflineIdb = async function(guru, slug, dataObj) {
    let db = await window.initLocalDB();
    let record = {
        id: window.buatKeyOfflineBab(guru, slug),
        guru: (guru || window.guruAktif || "mahardika").toLowerCase(),
        slug: slug || "home",
        title: window.ambilJudulBabDariSlug(slug),
        savedAt: Date.now(),
        data: dataObj
    };
    return new Promise(function(resolve, reject) {
        let tx = db.transaction("offlineRooms", "readwrite");
        tx.objectStore("offlineRooms").put(record);
        tx.oncomplete = function() { resolve(record); };
        tx.onerror = function(err) { reject(err); };
    });
};

window.muatBabOfflineIdb = async function(guru, slug) {
    try {
        let db = await window.initLocalDB();
        let key = window.buatKeyOfflineBab(guru, slug);
        return await new Promise(function(resolve) {
            let tx = db.transaction("offlineRooms", "readonly");
            let req = tx.objectStore("offlineRooms").get(key);
            req.onsuccess = function(e) { resolve(e.target.result || null); };
            req.onerror = function() { resolve(null); };
        });
    } catch (e) {
        return null;
    }
};

// Ambil semua daftar bab publik yang aktif (mengabaikan room Hidden & sub-room tersembunyi)
window.ambilDaftarSlugBabPublikUntukOffline = function() {
    let slugs = ["home"];
    if (!Array.isArray(window.pagesData) || window.pagesData.length === 0) {
        return slugs;
    }

    let hiddenLevelCutoff = null;
    window.pagesData.forEach(function(p) {
        if (!p || !p.slug) return;
        let lvl = typeof p.level === "number" ? p.level : (parseInt(p.level, 10) || 0);

        if (hiddenLevelCutoff !== null) {
            if (lvl > hiddenLevelCutoff) return;
            hiddenLevelCutoff = null;
        }

        if (p.hidden || p.isLockedHidden) {
            hiddenLevelCutoff = lvl;
            return;
        }

        if (slugs.indexOf(p.slug) === -1) {
            slugs.push(p.slug);
        }
    });

    return slugs;
};

window.pastikanBarOfflineBabAda = function() {
    let editorWrap = document.getElementById("main-editor-wrapper");
    if (!editorWrap) return null;

    let bar = document.getElementById("offline-bab-bar");
    if (!bar) {
        bar = document.createElement("div");
        bar.id = "offline-bab-bar";
        bar.className = "offline-bab-bar";
        bar.innerHTML =
            '<button type="button" id="btn-simpan-bab-offline" class="offline-pill-btn primary" onclick="window.bukaModalSimpanOffline()">📥 Simpan Offline</button>' +
            '<button type="button" id="btn-sync-bab-online" class="offline-pill-btn secondary" onclick="window.mulaiUpdateDataOffline()">🔄 Update</button>';
        editorWrap.insertBefore(bar, editorWrap.firstChild);
    }
    return bar;
};

// Tampilkan bar minimalis HANYA di halaman HOME
window.perbaruiBarOfflineBab = function() {
    let bar = window.pastikanBarOfflineBabAda();
    if (!bar) return;

    let slugAktif = String(window.babAktif || "home").toLowerCase();
    bar.style.display = (slugAktif === "home") ? "flex" : "none";
};

window.pastikanModalOfflineMinimalisAda = function() {
    let modal = document.getElementById("modal-offline-minimalis");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "modal-offline-minimalis";
    modal.className = "modal-overlay";
    modal.onclick = function(e) {
        if (e.target === modal && !window._sedangProsesOffline) {
            window.tutupModal("modal-offline-minimalis");
        }
    };
    modal.innerHTML =
        '<div class="modal-box" style="width:420px; max-width:94vw;">' +
            '<div class="modal-header" style="background:#0b3954; color:#ffffff; padding:13px 16px;">' +
                '<h3 id="judul-modal-offline-min" style="margin:0; font-size:15px;">📥 Simpan Offline</h3>' +
                '<button type="button" id="btn-close-modal-offline-min" class="close-btn" style="color:#ffffff;" onclick="if(!window._sedangProsesOffline) window.tutupModal(\'modal-offline-minimalis\')">✕</button>' +
            '</div>' +
            '<div class="modal-body" id="body-modal-offline-min" style="padding:16px; background:#f8fafc;"></div>' +
        '</div>';
    document.body.appendChild(modal);
    return modal;
};

// Tombol 1: Munculkan modal penjelasan manfaat mode offline + tombol Simpan Offline
window.bukaModalSimpanOffline = function() {
    window.pastikanModalOfflineMinimalisAda();
    let judul = document.getElementById("judul-modal-offline-min");
    let body = document.getElementById("body-modal-offline-min");
    let btnClose = document.getElementById("btn-close-modal-offline-min");
    if (btnClose) btnClose.style.display = "inline-flex";
    if (judul) judul.innerText = "📥 Mode Baca Offline";

    if (body) {
        body.innerHTML =
            '<div style="display:flex; flex-direction:column; gap:10px;">' +
                '<p style="margin:0; font-size:12.5px; color:#334155; line-height:1.5;">Simpan seluruh materi pelajaran ke perangkatmu agar belajar jadi lebih nyaman:</p>' +
                '<div class="offline-benefit-list">' +
                    '<div class="offline-benefit-item"><span>⚡</span><div><b>Buka Materi Instan</b><small>Pindah antar bab tanpa menunggu loading ulang.</small></div></div>' +
                    '<div class="offline-benefit-item"><span>📶</span><div><b>Tetap Bisa Belajar Tanpa Sinyal</b><small>Materi tetap terbuka lancar meski internet lemah atau mati.</small></div></div>' +
                    '<div class="offline-benefit-item"><span>💾</span><div><b>Hemat Kuota Internet</b><small>Cukup unduh sekali, bisa dibaca berulang kali kapan saja.</small></div></div>' +
                '</div>' +
                '<button type="button" class="btn-action" style="background:#0b3954; padding:11px; border-radius:10px; font-size:13px; margin-top:4px;" onclick="window.jalankanProsesUnduhOffline(false)">📥 Simpan Offline Sekarang</button>' +
            '</div>';
    }
    window.bukaModal("modal-offline-minimalis");
};

// Tombol 2: Langsung tampilkan loading sedang memperbarui data
window.mulaiUpdateDataOffline = function() {
    window.jalankanProsesUnduhOffline(true);
};

// Mesin Pengunduh / Pembaru Semua Materi Bab ke IndexedDB
window.jalankanProsesUnduhOffline = async function(isUpdateMode) {
    if (navigator.onLine === false) {
        return alert("📴 Perangkat sedang offline. Sambungkan internet terlebih dahulu untuk " + (isUpdateMode ? "memperbarui" : "mengunduh") + " data.");
    }
    if (window._sedangProsesOffline) return;

    window.pastikanModalOfflineMinimalisAda();
    window._sedangProsesOffline = true;

    let judul = document.getElementById("judul-modal-offline-min");
    let body = document.getElementById("body-modal-offline-min");
    let btnClose = document.getElementById("btn-close-modal-offline-min");
    if (btnClose) btnClose.style.display = "none";
    if (judul) judul.innerText = isUpdateMode ? "🔄 Memperbarui Data" : "📥 Mengunduh Materi";

    let teksLoading = isUpdateMode ? "Sedang memperbarui data..." : "Sedang mengunduh materi offline...";
    if (body) {
        body.innerHTML =
            '<div style="text-align:center; padding:16px 8px;">' +
                '<div class="offline-spinner-ring"></div>' +
                '<div id="offline-load-status" style="font-weight:800; font-size:14px; color:#0b3954; margin-bottom:6px;">' + teksLoading + '</div>' +
                '<div id="offline-load-sub" style="font-size:11.5px; color:#64748b; margin-bottom:12px;">Menyiapkan daftar materi...</div>' +
                '<div class="offline-prog-track"><div id="offline-prog-fill" class="offline-prog-fill" style="width:6%;"></div></div>' +
            '</div>';
    }
    window.bukaModal("modal-offline-minimalis");

    let guru = (window.guruAktif || "mahardika").toLowerCase();
    let basePath = "data_guru/" + guru;

    try {
        // 1. Segarkan struktur halaman terbaru saat mode Update
        if (typeof window.bacaDataRestFirebase === "function") {
            await new Promise(function(resolve) {
                window.bacaDataRestFirebase(basePath + "/pages_struktur", function(val) {
                    if (val) {
                        window.pagesData = Array.isArray(val) ? val : Object.values(val);
                        try { localStorage.setItem("offline_pages_" + guru, JSON.stringify(val)); } catch (e) {}
                        if (typeof window.renderDynamicNavbar === "function") window.renderDynamicNavbar();
                    }
                    resolve();
                }, function() { resolve(); }, { forceRefresh: isUpdateMode, ttlMs: isUpdateMode ? 0 : 600000 });
            });
        }

        // 2. Unduh seluruh bab publik satu per satu dengan progres yang jelas
        let daftarSlug = window.ambilDaftarSlugBabPublikUntukOffline();
        let total = daftarSlug.length;
        let berhasil = 0;

        for (let i = 0; i < total; i++) {
            let slug = daftarSlug[i];
            let pct = Math.max(8, Math.round(((i + 1) / total) * 100));
            let subEl = document.getElementById("offline-load-sub");
            let fillEl = document.getElementById("offline-prog-fill");
            if (subEl) subEl.innerText = (isUpdateMode ? "Memperbarui " : "Mengunduh ") + "(" + (i + 1) + "/" + total + "): " + window.ambilJudulBabDariSlug(slug);
            if (fillEl) fillEl.style.width = pct + "%";

            let dataBab = await new Promise(function(resolve) {
                if (typeof window.bacaDataRestFirebase !== "function") return resolve(null);
                window.bacaDataRestFirebase(basePath + "/materi_koleksi/" + slug, function(val) {
                    resolve(val);
                }, function() {
                    resolve(null);
                }, { forceRefresh: isUpdateMode, ttlMs: isUpdateMode ? 0 : 900000 });
            });

            if (dataBab && dataBab.blocksObj) {
                await window.simpanBabOfflineIdb(guru, slug, dataBab);
                try {
                    let cKey = "cache_room_" + guru + "_" + slug;
                    sessionStorage.setItem(cKey, JSON.stringify(dataBab));
                    sessionStorage.setItem(cKey + "_time", String(Date.now()));
                } catch (e) {}
                berhasil++;
            }
        }

        // Segarkan tampilan HOME bila sedang berada di HOME
        if (isUpdateMode && window.babAktif === "home" && typeof window.muatKontenHalaman === "function") {
            window.muatKontenHalaman("home", false);
        }

        window._sedangProsesOffline = false;
        if (btnClose) btnClose.style.display = "inline-flex";
        if (body) {
            body.innerHTML =
                '<div style="text-align:center; padding:12px 6px;">' +
                    '<div style="font-size:42px; margin-bottom:8px;">✅</div>' +
                    '<div style="font-weight:800; font-size:15px; color:#15803d; margin-bottom:6px;">' +
                        (isUpdateMode ? "Data Berhasil Diperbarui!" : "Materi Tersimpan Offline!") +
                    '</div>' +
                    '<div style="font-size:12px; color:#475569; margin-bottom:16px; line-height:1.45;">' +
                        '<b>' + berhasil + ' halaman materi</b> siap dibuka cepat kapan saja, termasuk saat sinyal lemah.' +
                    '</div>' +
                    '<button type="button" class="btn-action" style="background:#16a085; padding:10px; border-radius:10px; font-size:13px;" onclick="window.tutupModal(\'modal-offline-minimalis\')">Selesai</button>' +
                '</div>';
        }
    } catch (err) {
        window._sedangProsesOffline = false;
        if (btnClose) btnClose.style.display = "inline-flex";
        if (body) {
            body.innerHTML =
                '<div style="text-align:center; padding:12px 6px;">' +
                    '<div style="font-size:38px; margin-bottom:8px;">⚠️</div>' +
                    '<div style="font-weight:800; font-size:14px; color:#c0392b; margin-bottom:6px;">Proses Terhenti</div>' +
                    '<div style="font-size:12px; color:#64748b; margin-bottom:14px;">Periksa koneksi internet Anda lalu coba lagi.</div>' +
                    '<button type="button" class="btn-action" style="background:#0b3954; padding:9px; border-radius:10px;" onclick="window.tutupModal(\'modal-offline-minimalis\')">Tutup</button>' +
                '</div>';
        }
    }
};

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(window.perbaruiBarOfflineBab, 400);
});

window.simpanFileLokalIdb = async function(id, fileBlob) {
    try {
        let db = await window.initLocalDB();
        let tx = db.transaction("mediaFiles", "readwrite");
        tx.objectStore("mediaFiles").put({ id: id, blob: fileBlob });
    } catch(e) { console.error("IDB Save Error:", e); }
};

window.muatFileLokalIdb = async function(id) {
    try {
        let db = await window.initLocalDB();
        return new Promise(function(resolve) {
            let tx = db.transaction("mediaFiles", "readonly");
            let req = tx.objectStore("mediaFiles").get(id);
            req.onsuccess = function(e) { resolve(e.target.result ? e.target.result.blob : null); };
            req.onerror = function() { resolve(null); };
        });
    } catch(e) { return null; }
};

window.pulihkanFileLokalIdb = async function() {
    let localVids = document.querySelectorAll('video[data-local-id], iframe[data-local-id]');
    for (let i = 0; i < localVids.length; i++) {
        let el = localVids[i];
        if (el.getAttribute('data-loaded')) continue;
        let id = el.getAttribute('data-local-id');
        let blob = await window.muatFileLokalIdb(id);
        if (blob) {
            el.src = URL.createObjectURL(blob);
            el.setAttribute('data-loaded', 'true');
        } else {
            if (el.tagName === 'VIDEO' && !el.getAttribute('data-warned')) {
                let warn = document.createElement('div');
                warn.style.cssText = "padding:10px; background:#fadbd8; color:#c0392b; border-radius:8px; font-size:12px; font-weight:bold; margin-top:10px;";
                warn.innerText = "⚠️ Video lokal ini tidak ditemukan. Jika Anda meng-upload-nya dari perangkat lain, siswa tidak akan bisa melihatnya. Harap gunakan link Google Drive untuk materi publik.";
                el.parentElement.appendChild(warn);
                el.setAttribute('data-warned', 'true');
            }
        }
    }
};

// Pemantau otomatis saat blok baru dimuat
const obsLocalMedia = new MutationObserver(function() {
    window.pulihkanFileLokalIdb();
});
document.addEventListener("DOMContentLoaded", function() {
    let cont = document.getElementById('blocks-container');
    if (cont) obsLocalMedia.observe(cont, { childList: true, subtree: true });
});

// Modal Multimedia (Video Pintar & PDF Slide)
window.bukaModalMultimedia = function() {
    window.simpanSeleksiTeks();
    let inputLink = document.getElementById("input-link-media");
    if (inputLink) inputLink.value = "";
    window.bukaModal("modal-multimedia");
};

window.previewNamaFileMedia = function(input) {
    if (input.files && input.files[0]) {
        document.getElementById("nama-file-terpilih").innerText = "File siap: " + input.files[0].name;
        document.getElementById("input-link-media").value = "";
    }
};

/* =========================================
   SISTEM SISIPAN VIDEO (YOUTUBE & G-DRIVE NATIVE PLAYER)
   ========================================= */
window.prosesSisipanVideo = function() {
    let linkInput = document.getElementById("input-link-media");
    if (!linkInput) return;
    
    let link = linkInput.value.trim();
    if (!link) return alert("⚠️ Silakan paste link video YouTube, G-Drive, atau Cloudinary terlebih dahulu!");

    let finalUrl = "";
    let htmlSisipan = "";

    // Deteksi Cerdas Format Link (Diperkuat untuk menangkap semua variasi URL Mobile/Desktop & Parameter)
    let ytMatch = link.match(/(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?.*v=))([\w-]{11})/i);
    let driveMatch = link.match(/\/d\/([a-zA-Z0-9_-]+)/) || link.match(/id=([a-zA-Z0-9_-]+)/);
    let directMp4Match = link.match(/^https?:\/\/.*\.mp4/i) || link.indexOf('cloudinary.com') !== -1;

    window.kembalikanSeleksiTeks();

    if (ytMatch) {
        let ytId = ytMatch[1];
        // Menggunakan standar youtube.com (Domain nocookie sering diblokir oleh video berlisensi musik)
        finalUrl = "https://www.youtube.com/embed/" + ytId + "?rel=0&modestbranding=1&playsinline=1";
        
        htmlSisipan = '<div contenteditable="false" style="margin: 20px auto; border-radius: 8px; overflow: hidden; position: relative; width: 100%; max-width: 800px; aspect-ratio: 16/9; box-shadow:0 6px 15px rgba(0,0,0,0.15); background:black;">' +
            '<iframe src="' + finalUrl + '" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>' +
            '</div><p><br></p>';
            
    } else if (driveMatch || directMp4Match) {
        if (driveMatch) {
            finalUrl = "https://drive.google.com/uc?export=download&id=" + driveMatch[1];
        } else {
            finalUrl = link;
        }
        
        htmlSisipan = '<div contenteditable="false" style="margin: 20px auto; text-align: center; width: 100%; max-width: 800px;">' +
            '<video controls controlsList="nodownload" style="width: 100%; max-height: 550px; border-radius: 8px; box-shadow: 0 6px 15px rgba(0,0,0,0.15); background:black; outline:none;" preload="metadata">' +
            '<source src="' + finalUrl + '" type="video/mp4">' +
            '</video>' +
            '</div><p><br></p>';
    } else {
        return alert("❌ Format link tidak dikenali! Gunakan link YouTube, G-Drive, atau Cloudinary.");
    }

    window.formatTeks("insertHTML", htmlSisipan);
    window.tutupModal("modal-multimedia");
    linkInput.value = "";
    if (typeof triggerInput === 'function') triggerInput();
};

/* =========================================
   UPLOAD VIDEO LANGSUNG KE CLOUDINARY (BEBAN 0% FIREBASE)
   ========================================= */
window.uploadVideoLangsung = async function(inputElem) {
    let file = inputElem.files[0];
    if (!file) return;

    let btnUpload = document.getElementById('btn-upload-vid');
    let oldText = btnUpload.innerText;
    btnUpload.innerText = "⏳ Mengunggah (" + (file.size / (1024*1024)).toFixed(1) + " MB)...";
    btnUpload.disabled = true;

    // TODO: Buat akun di Cloudinary.com, dan masukkan "Cloud Name" serta "Upload Preset" Unsigned Anda di sini.
    let cloudName = "rtkfvwvg"; // Ganti dengan Cloud Name Anda
    let uploadPreset = "studykawan_video"; // Ganti dengan Upload Preset Unsigned Anda
    let urlCloudinary = "https://api.cloudinary.com/v1_1/" + cloudName + "/video/upload";

    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        let response = await fetch(urlCloudinary, {
            method: "POST",
            body: formData
        });
        
        let data = await response.json();
        if (data.secure_url) {
            // Langsung panggil fungsi sisipkan video secara otomatis!
            document.getElementById("input-link-media").value = data.secure_url;
            window.prosesSisipanVideo(); 
            // Fungsi prosesSisipanVideo akan otomatis menutup modal dan memanggil triggerInput()
        } else {
            throw new Error(data.error ? data.error.message : "Gagal mengunggah video.");
        }
    } catch (err) {
        console.error("Upload Error:", err);
        alert("❌ Gagal mengunggah video: " + err.message);
    } finally {
        btnUpload.innerText = oldText;
        btnUpload.disabled = false;
        inputElem.value = "";
    }
};

// Fungsi Kuis Inline di Materi (🧩 Kuis) & Tambah Blok Tengah
window.targetQuizBlockIndex = -1;

window.sisipkanBlokKuis = function() {
    window.contentBlocksData.push({
        type: "quiz",
        questions: [],
        bg: "#ffffff",
        pattern: "",
        color: "#333333",
        width: "M",
        padTop: "40px",
        padBot: "40px",
        drawing: ""
    });
    window.renderBlocks();
    if (window.simpanKeDB) window.simpanKeDB();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};

window.bukaAIQuizModal = function(blockIdx) {
    window.targetQuizBlockIndex = blockIdx;
    document.getElementById("ai-quiz-topic").value = "";
    window.bukaModal("modal-ai-quiz");
};

window.prosesGenerateQuizAI = function() {
    let raw = document.getElementById("ai-quiz-topic").value.trim();
    if (!raw) return alert("Paste teks soal terlebih dahulu!");
    if (window.targetQuizBlockIndex < 0 || !window.contentBlocksData[window.targetQuizBlockIndex]) return;

    let blocks = raw.split(/\n\s*\n|\n---\n/);
    let parsedQuestions = [];

    blocks.forEach(function(b) {
        let lines = b.trim().split("\n").map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
        if (lines.length === 0) return;

        let qObj = { type: 'mc', question: '', options: [], correctIndex: 0, correctIndices: [], correctAnswers: [], explanation: '' };
        let isParsingOptions = false;

        lines.forEach(function(line) {
            let low = line.toLowerCase();
            if (low.startsWith("soal:")) {
                qObj.question = line.substring(5).trim();
            } else if (low.startsWith("tipe:")) {
                let t = low.substring(5).trim();
                if (t === "is" || t === "isian singkat" || t === "isian") qObj.type = "short_answer";
                else if (t === "essay" || t === "esai" || t === "uraian") qObj.type = "essay";
                else if (t === "pgk" || t.indexOf("kompleks") !== -1) qObj.type = "pgk";
            } else if (low.startsWith("kunci:")) {
                isParsingOptions = false;
                let k = line.substring(6).trim();
                if (qObj.type === "short_answer" || qObj.type === "essay" || qObj.options.length === 0) {
                    if (qObj.type === "mc") qObj.type = "short_answer";
                    qObj.correctAnswers = k.split("|").map(function(s) { return s.trim(); });
                } else {
                    let normHuruf = window.normalisasiKunciPGK(k, qObj.options);
                    if (qObj.type === "pgk" || normHuruf.length > 1) {
                        qObj.type = "pgk";
                        if (normHuruf.length > 0) {
                            qObj.correctIndices = normHuruf.map(function(ch) { return ch.charCodeAt(0) - 65; }).filter(function(idx) { return idx >= 0 && idx < 10; });
                        }
                    } else if (normHuruf.length === 1) {
                        let code = normHuruf[0].charCodeAt(0) - 65;
                        if (code >= 0 && code < 10) qObj.correctIndex = code;
                    }
                }
            } else if (low.startsWith("pembahasan:")) {
                isParsingOptions = false;
                qObj.explanation = line.substring(11).trim();
            } else if (/^[a-eA-E][\.\)]/.test(line)) {
                isParsingOptions = true;
                let optLabel = line.charAt(0).toUpperCase();
                let optText = line.substring(2).trim();
                let optIdx = optLabel.charCodeAt(0) - 65;

                if (/[\(\[]\s*benar\s*[\)\]][\.\;\,\s]*$/i.test(optText)) {
                    qObj.type = 'pgk';
                    optText = optText.replace(/[\(\[]\s*benar\s*[\)\]][\.\;\,\s]*$/i, '').trim();
                    qObj.correctIndices.push(optIdx);
                } else if (/[\(\[]\s*salah\s*[\)\]][\.\;\,\s]*$/i.test(optText)) {
                    qObj.type = 'pgk';
                    optText = optText.replace(/[\(\[]\s*salah\s*[\)\]][\.\;\,\s]*$/i, '').trim();
                }
                qObj.options.push(optText);
            } else {
                if (isParsingOptions && qObj.options.length > 0) {
                    let gabungan = qObj.options[qObj.options.length - 1] + ' ' + line;
                    let lastIdx = qObj.options.length - 1;
                    if (/[\(\[]\s*benar\s*[\)\]][\.\;\,\s]*$/i.test(gabungan)) {
                        qObj.type = 'pgk';
                        gabungan = gabungan.replace(/[\(\[]\s*benar\s*[\)\]][\.\;\,\s]*$/i, '').trim();
                        qObj.correctIndices.push(lastIdx);
                    } else if (/[\(\[]\s*salah\s*[\)\]][\.\;\,\s]*$/i.test(gabungan)) {
                        qObj.type = 'pgk';
                        gabungan = gabungan.replace(/[\(\[]\s*salah\s*[\)\]][\.\;\,\s]*$/i, '').trim();
                    }
                    qObj.options[lastIdx] = gabungan;
                } else if (qObj.explanation) {
                    qObj.explanation += ' ' + line;
                } else if (qObj.question && qObj.options.length === 0) {
                    qObj.question += '<br>' + line;
                }
            }
        });

        if (qObj.type === 'pgk') qObj.correctIndices = Array.from(new Set(qObj.correctIndices)).sort(function(a, b) { return a - b; });
        if (qObj.question) parsedQuestions.push(qObj);
    });

    if (parsedQuestions.length === 0) return alert("Format soal tidak dikenali. Pastikan ada baris Soal:, opsi A. B., dan Kunci:.");

    if (!window.contentBlocksData[window.targetQuizBlockIndex].questions) {
        window.contentBlocksData[window.targetQuizBlockIndex].questions = [];
    }
    window.contentBlocksData[window.targetQuizBlockIndex].questions.push.apply(window.contentBlocksData[window.targetQuizBlockIndex].questions, parsedQuestions);

    window.tutupModal("modal-ai-quiz");
    window.renderBlocks();
    if (window.simpanKeDB) window.simpanKeDB();
};

window.togglePembahasanInline = function(blockIdx, qIdx, isStudent) {
    let box = document.getElementById('bahas-box-' + blockIdx + '-' + qIdx);
    let icon = document.getElementById('icon-bahas-' + blockIdx + '-' + qIdx);
    if (!box) return;

    let blok = window.contentBlocksData[blockIdx];
    let q = blok.questions[qIdx];
    let isHidden = box.style.display === 'none';

    if (isHidden) {
        box.style.display = 'block';
        if (icon) icon.innerText = '− Tutup';
        q.isBahasOpen = true;

        if (isStudent) {
            let card = document.getElementById('inline-q-' + blockIdx + '-' + qIdx);
            if (card && !card.classList.contains('answered')) {
                card.classList.add('answered');
                let allBtns = card.querySelectorAll('.quiz-option-btn');
                allBtns.forEach(function(b, i) {
                    b.disabled = true;
                    b.style.cursor = 'not-allowed';
                    if (i === q.correctIndex) b.classList.add('selected-neutral');
                });
                let inpIsian = card.querySelector('input[type="text"]');
                if (inpIsian) {
                    inpIsian.disabled = true;
                    inpIsian.style.background = '#f8d7da';
                    inpIsian.style.borderColor = '#dc3545';
                    inpIsian.value = "Kunci: " + (q.correctAnswers ? q.correctAnswers.join(' | ') : '');
                }
                let navBtn = document.getElementById("nav-btn-inline-" + blockIdx + "-" + qIdx);
                if (navBtn) navBtn.classList.add("nav-answered");
            }
        }
        if (typeof inisialisasiSemuaCanvas === 'function') inisialisasiSemuaCanvas();
    } else {
        box.style.display = 'none';
        if (icon) icon.innerText = '+ Buka';
        q.isBahasOpen = false;
    }
    sessionStorage.setItem('cache_room_' + window.guruAktif + '_' + window.babAktif, JSON.stringify({ blocksObj: window.contentBlocksData, floatingBoxesObj: window.floatingBoxesData }));
};


window.jawabKuisInline = function(btnEl, blockIdx, qIdx, optIdx, correctIdx) {
    let card = document.getElementById("inline-q-" + blockIdx + "-" + qIdx);
    if (!card || card.classList.contains('answered')) return;

    card.classList.add('answered');
    let allBtns = card.querySelectorAll(".quiz-option-btn");
    allBtns.forEach(function(b, i) {
        b.disabled = true;
        b.style.cursor = 'not-allowed';
        if (i === correctIdx) b.classList.add("selected-correct");
        else if (i === optIdx) b.classList.add("selected-wrong");
    });

    let navBtn = document.getElementById("nav-btn-inline-" + blockIdx + "-" + qIdx);
    if (navBtn) navBtn.classList.add("nav-answered");

    if (optIdx === correctIdx) {
        if (typeof window.tambahXPSiswa === "function") {
            window.tambahXPSiswa(5, "kuis_inline", [{ type: "PG", sudahBenar: true }]); // PG = 5 Poin
        }
    } else {
        let box = document.getElementById('bahas-box-' + blockIdx + '-' + qIdx);
        if (box && box.style.display === 'none') {
            window.togglePembahasanInline(blockIdx, qIdx, true);
        }
    }
};

window.jawabKuisInlineIsian = function(inputEl, blockIdx, qIdx) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok || !blok.questions || !blok.questions[qIdx]) return;
    let q = blok.questions[qIdx];
    let val = (inputEl.value || "").trim().toLowerCase();
    let kunciArr = (q.correctAnswers || []).map(function(k) { return k.toLowerCase().trim(); });

    if (kunciArr.indexOf(val) !== -1 && val !== "") {
        inputEl.style.borderColor = "#27ae60";
        inputEl.style.background = "#d4edda";
        inputEl.disabled = true;
        let navBtn = document.getElementById("nav-btn-inline-" + blockIdx + "-" + qIdx);
        if (navBtn) navBtn.classList.add("nav-answered");
        if (typeof window.tambahXPSiswa === "function") {
            window.tambahXPSiswa(10, "kuis_inline", [{ type: "IS", sudahBenar: true }]); // IS = 10 Poin
        }
    } else {
        inputEl.style.borderColor = "#e74c3c";
        inputEl.style.background = "#f8d7da";
    }
};

window.updateKunciInline = function(blockIdx, qIdx, optIdx) {
    let blok = window.contentBlocksData[blockIdx];
    if (blok && blok.questions && blok.questions[qIdx]) {
        blok.questions[qIdx].correctIndex = optIdx;
        if (window.simpanKeDB) window.simpanKeDB();
    }
};

window.updateKunciInlinePGK = function(blockIdx, qIdx, optIdx, isChecked) {
    let blok = window.contentBlocksData[blockIdx];
    if (blok && blok.questions && blok.questions[qIdx]) {
        let q = blok.questions[qIdx];
        if (!Array.isArray(q.correctIndices)) q.correctIndices = [];
        let numIdx = parseInt(optIdx, 10);
        if (isChecked) {
            if (!q.correctIndices.includes(numIdx)) q.correctIndices.push(numIdx);
        } else {
            q.correctIndices = q.correctIndices.filter(function(i) { return parseInt(i, 10) !== numIdx; });
        }
        q.correctIndices.sort(function(a, b) { return a - b; });
        if (window.simpanKeDB) window.simpanKeDB();
    }
};

window.koreksiKuisInlinePGK = function(blockIdx, qIdx) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok || !blok.questions || !blok.questions[qIdx]) return;
    let q = blok.questions[qIdx];
    let card = document.getElementById("inline-q-" + blockIdx + "-" + qIdx);
    if (!card || card.classList.contains("answered")) return;

    let checkboxes = card.querySelectorAll(".chk-inline-pgk-" + blockIdx + "-" + qIdx);
    let dipilih = [];
    checkboxes.forEach(function(cb) {
        if (cb.checked) dipilih.push(parseInt(cb.value, 10));
    });

    if (dipilih.length === 0) return alert("Pilih minimal satu jawaban terlebih dahulu!");

    card.classList.add("answered");
    let rawKunci = (Array.isArray(q.correctIndices) && q.correctIndices.length > 0) ? q.correctIndices : (q.correct || []);
    let isAllCorrect = window.apakahJawabanPGKBenar(dipilih, rawKunci, q.options);
    let normKunciHuruf = window.normalisasiKunciPGK(rawKunci, q.options);

    checkboxes.forEach(function(cb) {
        cb.disabled = true;
        let idx = parseInt(cb.value, 10);
        let hurufIdx = String.fromCharCode(65 + idx);
        let lbl = document.getElementById("lbl-inline-pgk-" + blockIdx + "-" + qIdx + "-" + idx);
        if (lbl) {
            if (normKunciHuruf.includes(hurufIdx)) lbl.classList.add("selected-correct");
            else if (cb.checked) lbl.classList.add("selected-wrong");
        }
    });

    let btnSubmit = document.getElementById("btn-submit-pgk-" + blockIdx + "-" + qIdx);
    if (btnSubmit) btnSubmit.style.display = "none";

    let navBtn = document.getElementById("nav-btn-inline-" + blockIdx + "-" + qIdx);
    if (navBtn) navBtn.classList.add("nav-answered");

    if (isAllCorrect) {
        if (typeof window.tambahXPSiswa === "function") {
            window.tambahXPSiswa(10, "kuis_inline", [{ type: "PGK", sudahBenar: true }]); // PGK = 10 Poin
        }
    } else {
        let box = document.getElementById("bahas-box-" + blockIdx + "-" + qIdx);
        if (box && box.style.display === "none") {
            window.togglePembahasanInline(blockIdx, qIdx, true);
        }
    }
};

window.updateKunciIsianInline = function(blockIdx, qIdx, rawText) {
    let blok = window.contentBlocksData[blockIdx];
    if (blok && blok.questions && blok.questions[qIdx]) {
        let bersih = rawText.replace("🔒 Info Admin (Edit Kunci):", "").replace("🔒 Kunci/Poin Essay:", "").trim();
        blok.questions[qIdx].correctAnswers = bersih.split('|').map(s => s.trim()).filter(Boolean);
        if (window.simpanKeDB) window.simpanKeDB();
    }
};

window.updateSoalInline = function(blockIdx, qIdx, tipeField, el, optIdx) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok || !blok.questions || !blok.questions[qIdx]) return;
    
    if (tipeField === "q") {
        let txt = el.innerText.trim();
        blok.questions[qIdx].question = txt.replace(/^\d+\.\s*/, "");
    } else if (tipeField === "o" && typeof optIdx === "number") {
        let txt = el.innerText.trim();
        blok.questions[qIdx].options[optIdx] = txt.replace(/^[A-Z]\.\s*/, "");
    } else if (tipeField === "e") {
        // Karena ini div contenteditable (.content-block), kita simpan HTML-nya secara penuh agar format gambar/latex tetap hidup
        blok.questions[qIdx].explanation = el.innerHTML;
    }
    // Save dipicu lewat typingTimer (Auto-save) karena el.innerHTML terikat di event global, tapi kita trigger manual juga aman.
    if (window.simpanKeDB) window.simpanKeDB();
};

window.hapusSoalSistem = function(qIdx, mode, blockIdx) {
    if (mode === "inline" && window.contentBlocksData[blockIdx] && window.contentBlocksData[blockIdx].questions) {
        if (confirm("Hapus soal ini dari kuis materi?")) {
            window.contentBlocksData[blockIdx].questions.splice(qIdx, 1);
            window.renderBlocks();
            if (window.simpanKeDB) window.simpanKeDB();
        }
    }
};

window.tambahBlokBaruTengah = function() {
    let newBlock = { type: "text", html: "<p>Ketik materi...</p>", bg: "#ffffff", pattern: "", color: "#333333", width: "M", padTop: "40px", padBot: "40px", drawing: "" };
    if (activeBlockIndex > -1 && activeBlockIndex < window.contentBlocksData.length) {
        window.contentBlocksData.splice(activeBlockIndex + 1, 0, newBlock);
    } else {
        window.contentBlocksData.push(newBlock);
    }
    document.getElementById("sidebar-block").classList.remove("open");
    window.renderBlocks();
    if (window.simpanKeDB) window.simpanKeDB();
};

window.simpanTema = function() {
    let bgColor = document.getElementById("theme-color").value || "#0b3954";
    let fontFamily = document.getElementById("theme-font").value || "'Quicksand', sans-serif";
    let headerPad = document.getElementById("theme-header-padding").value || "20";
    let webTitle = document.getElementById("web-title") ? document.getElementById("web-title").innerText : "Mahardika";

    document.documentElement.style.setProperty("--primary-bg", bgColor);
    document.documentElement.style.setProperty("--main-font", fontFamily);
    let headerWrap = document.querySelector(".header-wrapper");
    if (headerWrap) headerWrap.style.padding = headerPad + "px 20px";

    if (typeof window.simpanTemaKeDB === "function") {
        window.simpanTemaKeDB({ bgColor: bgColor, fontFamily: fontFamily, headerPad: headerPad, webTitle: webTitle });
    }
    window.tutupModal("modal-theme");
};

window.simpanPopupPengumuman = function() {
    let box = document.getElementById('popup-content-box');
    if(box && typeof window.simpanPopupKeDB === "function") {
        window.simpanPopupKeDB(box.innerHTML); 
    }
    window.tutupWelcomePopup();
    alert("✅ Pengumuman berhasil disimpan dan diaktifkan!");
};

/* =========================================
   KOMPRESI GAMBAR & PASTE LISTENER
   ========================================= */
window.kompresGambar = function(file, callback) {
    if (!file) return;
    const isGif = (file.type === 'image/gif') || (file.name && /\.gif$/i.test(file.name));

    const reader = new FileReader();
    reader.onload = function(e) {
        // Jika file bertipe GIF, pertahankan DataURL asli agar animasi GIF tetap bergerak hidup!
        if (isGif) {
            if (file.size > 2.5 * 1024 * 1024) {
                alert("⚠️ Ukuran file GIF terlalu besar (Maksimal 2.5 MB). Silakan pilih GIF dengan ukuran lebih kecil.");
                return;
            }
            callback(e.target.result);
            return;
        }

        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1000; const MAX_HEIGHT = 1000;
            let width = img.width; let height = img.height;
            if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

window.uploadPopupImg = function(input) {
    const f = input.files[0]; if(!f) return; 
    window.kompresGambar(f, function(dataUrl) {
        document.getElementById('popup-content-box').focus();
        document.execCommand('insertImage', false, dataUrl);
    });
    input.value = '';
};

// Deteksi Paste Cerdas (Tabel Excel, Gambar, dan Match Word Formatting)
document.addEventListener('paste', function(e) {
    if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) return;
    if(!document.body.classList.contains('mode-edit-aktif') && !document.documentElement.classList.contains('force-edit-mode')) return;
    
    let activeCell = e.target.closest('td, th');
    let clipboardData = e.clipboardData || window.clipboardData;
    let pastedText = clipboardData.getData('text/plain');

    // 1. CEK SMART PASTE EXCEL/TABEL
    if (activeCell && activeCell.closest('.interactive-table')) {
        if (pastedText && pastedText.indexOf('\t') !== -1) {
            e.preventDefault(); 
            
            let rows = pastedText.trim().split('\n');
            let startRow = activeCell.closest('tr');
            let startTable = startRow.closest('table');
            let startRowIndex = Array.from(startTable.rows).indexOf(startRow);
            let startColIndex = activeCell.cellIndex;

            rows.forEach((rowData, rOffset) => {
                let cols = rowData.split('\t');
                let targetRow = startTable.rows[startRowIndex + rOffset];

                if (!targetRow) {
                    let prevRow = startTable.rows[startTable.rows.length - 1];
                    targetRow = prevRow.cloneNode(true);
                    Array.from(targetRow.cells).forEach(c => {
                        let btns = c.querySelectorAll('.tbl-btn-add');
                        c.innerHTML = "";
                        btns.forEach(b => c.appendChild(b));
                    });
                    startTable.querySelector('tbody').appendChild(targetRow);
                }

                cols.forEach((cellData, cOffset) => {
                    let targetCell = targetRow.cells[startColIndex + cOffset];
                    
                    if (!targetCell) {
                        Array.from(startTable.rows).forEach(tr => {
                            let newCell = document.createElement(tr.rowIndex === 0 && startTable.rows[0].cells[0].tagName === 'TH' ? 'th' : 'td');
                            newCell.innerHTML = '<button type="button" class="tbl-btn-add tbl-add-col" contenteditable="false" onclick="window.tambahKolomTabel(this)" title="Tambah Kolom ke Kanan">+</button>' +
                                                '<button type="button" class="tbl-btn-add tbl-add-row" contenteditable="false" onclick="window.tambahBarisTabel(this)" title="Tambah Baris ke Bawah">+</button>';
                            tr.appendChild(newCell);
                        });
                        targetCell = targetRow.cells[startColIndex + cOffset];
                    }

                    if (targetCell) {
                        let btnsHtml = '';
                        targetCell.querySelectorAll('.tbl-btn-add').forEach(b => btnsHtml += b.outerHTML);
                        targetCell.innerHTML = cellData.trim() + btnsHtml;
                    }
                });
            });
            
            let blokEl = startTable.closest('.content-block');
            if (blokEl) blokEl.dispatchEvent(new Event('input', { bubbles: true }));
            return; 
        }
    }

    // 2. CEK PASTE GAMBAR (Logika Lama Dipertahankan)
    let items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let index in items) {
        let item = items[index];
        if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
            e.preventDefault(); 
            let statusBar = document.getElementById('save-status-bar');
            if(statusBar) statusBar.innerHTML = "<span style='color:#e67e22;'>⏳ Mengkonversi Gambar...</span>";
            
            let blob = item.getAsFile();
            window.kompresGambar(blob, function(dataUrl) {
                document.execCommand('insertImage', false, dataUrl);
                if(statusBar) statusBar.innerHTML = "<span style='color:#2ecc71;'>✓ Selesai Di-paste</span>";
                triggerInput(); 
            });
            return; 
        }
    }

    // 3. CEK PASTE TEKS BIASA (RAPAT TANPA ENTER TAMBAHAN DI CONTENT BLOCK)
    if (pastedText && pastedText.trim() !== '') {
        e.preventDefault();
        let targetEditable = e.target.closest
            ? e.target.closest('.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area')
            : null;

        let cleanText = pastedText
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/^[ \t]+$/gm, '')
            .replace(/^\n+|\n+$/g, '');

        // Hilangkan enter ganda bawaan salinan dari Word / Google Docs / Web / AI
        if (cleanText.indexOf('\n\n') !== -1) {
            let adaBarisTunggal = /[^\n]\n[^\n]/.test(cleanText);
            if (!adaBarisTunggal) {
                cleanText = cleanText.replace(/\n{2,}/g, '\n');
            } else {
                cleanText = cleanText
                    .replace(/\n{2,}(?=[ \t]*(?:[-•*–—]|\d+[\.\)]|[a-zA-Z][\.\)])[ \t]+)/g, '\n')
                    .replace(/\n{3,}/g, '\n\n');
            }
        }

        if (targetEditable && cleanText.indexOf('\n') !== -1) {
            let lines = cleanText.split('\n');
            let htmlLines = lines.map(function(line) {
                let safe = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return '<div>' + (safe.trim() ? safe : '<br>') + '</div>';
            }).join('');

            document.execCommand('insertHTML', false, htmlLines);

            // Bersihkan tag kosong sisa pecahan bawaan browser saat paste
            targetEditable.querySelectorAll('p:empty, div:empty').forEach(function(el) {
                el.remove();
            });

            if (targetEditable.classList.contains('a4-portrait-block')) {
                setTimeout(function() {
                    if (typeof window.rapikanHalamanA4Word === 'function') window.rapikanHalamanA4Word(targetEditable, false);
                }, 30);
            }
        } else {
            document.execCommand('insertText', false, cleanText);
        }
        triggerInput();
    }
});


/* =========================================
   KONTROL GAMBAR DALAM BLOK (KUNCI RASIO & TOMBOL PERKECIL/PERBESAR)
   ========================================= */
window.selectedImg = null;

window.perbaruiPosisiKontrolGambar = function() {
    let c = document.getElementById('img-controls');
    if (!c || !window.selectedImg || !document.body.contains(window.selectedImg)) return;
    let rect = window.selectedImg.getBoundingClientRect();
    c.style.display = 'flex';
    c.style.top = Math.max(10, (rect.top + window.scrollY - 38)) + 'px';
    c.style.left = Math.max(10, (rect.left + window.scrollX)) + 'px';
    let infoSz = document.getElementById('lbl-size-img');
    if (infoSz) {
        infoSz.innerText = Math.round(window.selectedImg.offsetWidth) + 'px';
    }
};

window.ubahUkuranGambarTerpilih = function(deltaPx) {
    if (!window.selectedImg) return;
    let curW = window.selectedImg.offsetWidth || 250;
    let parentEl = window.selectedImg.closest('.content-block, .fb-content');
    let maxW = parentEl ? (parentEl.clientWidth - 20) : 900;
    let nextW = Math.max(40, Math.min(maxW, curW + deltaPx));

    // Kunci rasio mutlak: hanya ubah width dan paksa height: auto
    window.selectedImg.removeAttribute('height');
    window.selectedImg.style.width = nextW + 'px';
    window.selectedImg.style.height = 'auto';
    window.selectedImg.style.maxWidth = '100%';

    window.perbaruiPosisiKontrolGambar();
    if (parentEl) parentEl.dispatchEvent(new Event('input', { bubbles: true }));
};

document.addEventListener('click', function(e) {
    if (window.isDrawingMode) return;

    if (e.target.tagName === 'IMG' && !e.target.closest('.draw-float-img-item') && !e.target.classList.contains('pdf-slide-bg') && (document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode')) && (e.target.closest('.content-block') || e.target.closest('.fb-content'))) {
        document.querySelectorAll('.content-block img, .fb-content img').forEach(function(i) { i.classList.remove('img-selected'); });
        e.target.classList.add('img-selected');
        window.selectedImg = e.target;

        // Pastikan rasio gambar selalu terkunci
        window.selectedImg.style.height = 'auto';

        const c = document.getElementById('img-controls');
        if (c) {
            if (!document.getElementById('btn-layout-img')) {
                c.innerHTML =
                    '<button type="button" onclick="window.ubahUkuranGambarTerpilih(-35)" title="Perkecil Gambar (Rasio Terkunci)" style="font-weight:900;">➖</button>' +
                    '<span id="lbl-size-img" style="color:#f1c40f; font-size:11px; font-weight:bold; padding:0 4px; display:flex; align-items:center;">100px</span>' +
                    '<button type="button" onclick="window.ubahUkuranGambarTerpilih(35)" title="Perbesar Gambar (Rasio Terkunci)" style="font-weight:900;">➕</button>' +
                    '<div style="width:1px;height:14px;background:rgba(255,255,255,0.3);margin:0 4px;"></div>' +
                    '<button type="button" onclick="alignGambar(\'left\')" title="Rata Kiri">⫷</button>' +
                    '<button type="button" onclick="alignGambar(\'center\')" title="Rata Tengah">≡</button>' +
                    '<button type="button" onclick="alignGambar(\'right\')" title="Rata Kanan">⫸</button>' +
                    '<div style="width:1px;height:14px;background:rgba(255,255,255,0.3);margin:0 4px;"></div>' +
                    '<button type="button" id="btn-layout-img" onclick="window.toggleLayoutGambar()" style="font-size:11px; font-weight:bold;" title="Ubah Layout Gambar (Melayang / Sebaris)">🔄 Float</button>';
            }
            window.perbaruiPosisiKontrolGambar();
        }
    } else if (!e.target.closest('#img-controls') && e.type === 'click') {
        if (window.selectedImg) {
            window.selectedImg.classList.remove('img-selected');
        }
        window.selectedImg = null;
        let c = document.getElementById('img-controls');
        if (c) c.style.display = 'none';
    }
});

document.addEventListener('keydown', function(e) {
    if ((e.key === 'Delete' || e.key === 'Backspace') && window.selectedImg && !window.isDrawingMode) {
        let activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;
        e.preventDefault();
        let p = window.selectedImg.closest('.content-block') || window.selectedImg.closest('.fb-content');
        window.selectedImg.remove();
        window.selectedImg = null;
        let c = document.getElementById('img-controls');
        if (c) c.style.display = 'none';
        if (p) p.dispatchEvent(new Event('input', { bubbles: true }));
    }
});

window.alignGambar = function(p) {
    if (window.selectedImg) {
        if (window.selectedImg.style.position === 'absolute') {
            window.selectedImg.style.position = 'static';
            window.selectedImg.style.zIndex = '';
        }
        window.selectedImg.style.display = 'block';
        window.selectedImg.style.height = 'auto';
        window.selectedImg.style.margin = p === 'left' ? '15px auto 15px 0' : (p === 'right' ? '15px 0 15px auto' : '15px auto');
        window.perbaruiPosisiKontrolGambar();
        triggerInput();
    }
};

window.toggleLayoutGambar = function() {
    if (window.selectedImg) {
        let isAbsolute = window.selectedImg.style.position === 'absolute';
        if (isAbsolute) {
            window.selectedImg.style.position = 'static';
            window.selectedImg.style.zIndex = '';
            window.selectedImg.style.margin = '15px auto';
            window.selectedImg.style.cursor = 'ew-resize';
            window.selectedImg.onpointerdown = null;
        } else {
            let parentBlock = window.selectedImg.closest('.content-block, .fb-content');
            if (parentBlock && window.getComputedStyle(parentBlock).position === 'static') {
                parentBlock.style.position = 'relative';
            }
            window.selectedImg.style.position = 'absolute';
            window.selectedImg.style.zIndex = '10';
            window.selectedImg.style.margin = '0';
            window.selectedImg.style.height = 'auto';
            window.selectedImg.style.cursor = 'move';
            window.selectedImg.onpointerdown = window.startDragGambarFloat;
        }
        window.perbaruiPosisiKontrolGambar();
        triggerInput();
    }
};

window.startDragGambarFloat = function(e) {
    if (!document.body.classList.contains('mode-edit-aktif') && !document.documentElement.classList.contains('force-edit-mode')) return;
    let img = e.target;
    if (img.style.position !== 'absolute') return;

    let rect = img.getBoundingClientRect();
    // Jika pengguna menarik tepi kanan / sudut kanan-bawah (28px terakhir), jalankan RESIZE dengan rasio terkunci!
    let isResizeEdge = (rect.right - e.clientX) <= 28 || (rect.bottom - e.clientY) <= 28;
    if (isResizeEdge) return; // Biarkan listener resize di canvas-draw.js yang menangani pengecilan ukuran

    e.preventDefault();
    e.stopPropagation();

    let parentBlock = img.closest('.content-block, .fb-content');
    if (!parentBlock) return;

    let startX = e.clientX;
    let startY = e.clientY;
    let initLeft = img.offsetLeft;
    let initTop = img.offsetTop;

    img.setPointerCapture(e.pointerId);

    function move(ev) {
        img.style.left = (initLeft + (ev.clientX - startX)) + 'px';
        img.style.top = (initTop + (ev.clientY - startY)) + 'px';
        window.perbaruiPosisiKontrolGambar();
    }

    function up(ev) {
        img.releasePointerCapture(e.pointerId);
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        if (parentBlock) parentBlock.dispatchEvent(new Event('input', { bubbles: true }));
    }

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
};

/* =========================================
   KONTROL TABEL DALAM BLOK (TABLE SETTINGS)
   ========================================= */
window.activeTableCell = null; 

// Modal Tabel Interaktif Modern
window.sisipkanTabel = function() {
    window.simpanSeleksiTeks();
    window.bukaModal('modal-tabel');
};

window.terapkanSisipanTabel = function() {
    let cols = parseInt(document.getElementById('input-tabel-kolom').value) || 3;
    let rows = parseInt(document.getElementById('input-tabel-baris').value) || 3;
    
    // Tanpa wrapper, langsung masukkan tabel dengan ukuran dinamis
    let html = '<table class="interactive-table" contenteditable="true" style="margin: 15px 0;"><tbody>';
    
    for(let r = 0; r < rows; r++) {
        html += '<tr>';
        for(let c = 0; c < cols; c++) {
            let isHeader = (r === 0);
            let tag = isHeader ? 'th' : 'td';
            html += '<' + tag + '>' + 
                    '<button type="button" class="tbl-btn-add tbl-add-col" contenteditable="false" onclick="window.tambahKolomTabel(this)" title="Tambah Kolom ke Kanan">+</button>' +
                    '<button type="button" class="tbl-btn-add tbl-add-row" contenteditable="false" onclick="window.tambahBarisTabel(this)" title="Tambah Baris ke Bawah">+</button>' +
                    '</' + tag + '>';
        }
        html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    
    window.kembalikanSeleksiTeks();
    window.formatTeks('insertHTML', html);
    window.tutupModal('modal-tabel');
};

window.tambahKolomTabel = function(btn) {
    let cell = btn.closest('td, th');
    let row = cell.parentElement;
    let table = row.parentElement.parentElement;
    let cellIndex = Array.from(row.children).indexOf(cell);
    
    Array.from(table.rows).forEach(function(tr, rIdx) {
        let isHeader = (rIdx === 0 && table.rows[0].children[0].tagName === 'TH');
        let tag = isHeader ? 'th' : 'td';
        let newCell = document.createElement(tag);
        newCell.innerHTML = '<button type="button" class="tbl-btn-add tbl-add-col" contenteditable="false" onclick="window.tambahKolomTabel(this)" title="Tambah Kolom ke Kanan">+</button>' +
                            '<button type="button" class="tbl-btn-add tbl-add-row" contenteditable="false" onclick="window.tambahBarisTabel(this)" title="Tambah Baris ke Bawah">+</button>';
        
        if (cellIndex + 1 < tr.children.length) {
            tr.insertBefore(newCell, tr.children[cellIndex + 1]);
        } else {
            tr.appendChild(newCell);
        }
    });
    
    let blokEl = btn.closest('.content-block');
    if (blokEl) blokEl.dispatchEvent(new Event('input', { bubbles: true }));
};

window.tambahBarisTabel = function(btn) {
    let cell = btn.closest('td, th');
    let row = cell.parentElement;
    
    let newRow = document.createElement('tr');
    Array.from(row.children).forEach(function() {
        let newCell = document.createElement('td');
        newCell.innerHTML = '<button type="button" class="tbl-btn-add tbl-add-col" contenteditable="false" onclick="window.tambahKolomTabel(this)" title="Tambah Kolom ke Kanan">+</button>' +
                            '<button type="button" class="tbl-btn-add tbl-add-row" contenteditable="false" onclick="window.tambahBarisTabel(this)" title="Tambah Baris ke Bawah">+</button>';
        newRow.appendChild(newCell);
    });
    
    if (row.nextSibling) {
        row.parentElement.insertBefore(newRow, row.nextSibling);
    } else {
        row.parentElement.appendChild(newRow);
    }
    
    let blokEl = btn.closest('.content-block');
    if (blokEl) blokEl.dispatchEvent(new Event('input', { bubbles: true }));
};

// Menambahkan fungsi hapus tabel utuh
window.hapusTabelUtuh = function() { 
    if(window.activeTableCell) { 
        let tb = window.activeTableCell.closest('table');
        if (tb) {
            let blok = tb.closest('.content-block, .fb-content');
            if (confirm("Hapus seluruh tabel ini?")) {
                tb.remove(); 
                document.getElementById('tbl-controls').style.display = 'none'; 
                if (blok) blok.dispatchEvent(new Event('input', {bubbles: true})); 
            }
        }
    } 
};

window.activeTableCells = []; // Menyimpan sel-sel yang di-blok

// Ubah kursor jadi panah hitam saat di tepi tabel (Dengan Throttle 80ms Anti-Lag)
window._lastTableHoverCheck = 0;
document.addEventListener('mousemove', function(e) {
    let now = Date.now();
    if (now - window._lastTableHoverCheck < 80) return;
    window._lastTableHoverCheck = now;

    if (!document.body.classList.contains('mode-edit-aktif') && !document.documentElement.classList.contains('force-edit-mode')) return;
    let cell = (e.target && e.target.closest) ? e.target.closest('td, th') : null;
    if (cell && cell.closest('.interactive-table')) {
        let rect = cell.getBoundingClientRect();
        let isTop = (cell.parentElement.rowIndex === 0) && (e.clientY - rect.top < 12);
        let isLeft = (cell.cellIndex === 0) && (e.clientX - rect.left < 12);
        
        if (isTop && isLeft) cell.style.cursor = 'nwse-resize';
        else if (isTop) cell.style.cursor = 's-resize';
        else if (isLeft) cell.style.cursor = 'e-resize';
        else cell.style.cursor = 'text';
    }
}, { passive: true });

// Aksi ketika tabel diklik (Blok & Munculkan Toolbar)
document.addEventListener('mousedown', e => { 
    if(window.isDrawingMode) return; 
    
    let cell = e.target.closest('td, th');
    if(cell && cell.closest('.interactive-table') && (document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode'))) { 
        
        let rect = cell.getBoundingClientRect();
        let isTop = (cell.parentElement.rowIndex === 0) && (e.clientY - rect.top < 12);
        let isLeft = (cell.cellIndex === 0) && (e.clientX - rect.left < 12);
        let table = cell.closest('table');

        // Bersihkan blok sebelumnya
        table.querySelectorAll('.tbl-cell-selected').forEach(c => c.classList.remove('tbl-cell-selected'));
        window.activeTableCells = [];
        window.activeTableCell = cell;

        if (isTop || isLeft) {
            e.preventDefault(); // Cegah kursor masuk ke dalam teks agar bisa mem-blok
            
            if (isTop && isLeft) {
                Array.from(table.rows).forEach(r => Array.from(r.cells).forEach(c => { c.classList.add('tbl-cell-selected'); window.activeTableCells.push(c); }));
            } else if (isTop) {
                let cIdx = cell.cellIndex;
                Array.from(table.rows).forEach(r => { if(r.cells[cIdx]) { r.cells[cIdx].classList.add('tbl-cell-selected'); window.activeTableCells.push(r.cells[cIdx]); } });
            } else if (isLeft) {
                Array.from(cell.parentElement.cells).forEach(c => { c.classList.add('tbl-cell-selected'); window.activeTableCells.push(c); });
            }
        } else {
            // Jika klik biasa di dalam sel
            window.activeTableCells.push(cell); 
        }

        const c = document.getElementById('tbl-controls');
        if(c) {
            c.style.display = 'flex'; 
            c.style.top = (rect.top + window.scrollY - 35) + 'px'; 
            c.style.left = (rect.left + window.scrollX) + 'px'; 
        }
    } else if(!e.target.closest('#tbl-controls') && !e.target.closest('.mozello-toolbar') && !e.target.closest('.tbl-btn-add')) { 
        let c = document.getElementById('tbl-controls');
        if(c) c.style.display = 'none'; 
        window.activeTableCell = null;
        document.querySelectorAll('.tbl-cell-selected').forEach(c => c.classList.remove('tbl-cell-selected'));
        window.activeTableCells = []; 
    } 
});

// Aksi tombol Backspace/Delete saat sel diblok (Menghapus isi tanpa menghapus tabel)
document.addEventListener('keydown', e => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && window.activeTableCells && window.activeTableCells.length > 1) {
        e.preventDefault();
        window.activeTableCells.forEach(c => {
            let btns = '';
            c.querySelectorAll('.tbl-btn-add').forEach(b => btns += b.outerHTML);
            c.innerHTML = btns;
        });
        let table = window.activeTableCells[0].closest('table');
        let blok = table ? table.closest('.content-block') : null;
        if (blok) blok.dispatchEvent(new Event('input', { bubbles: true }));
    }
});

window.warnaiSelTabel = function(w) { 
    if (window.activeTableCells && window.activeTableCells.length > 0) {
        window.activeTableCells.forEach(function(c) {
            c.style.backgroundColor = w;
        });
        triggerInput(); 
    } else if (window.activeTableCell) { 
        window.activeTableCell.style.backgroundColor = w; 
        triggerInput(); 
    } 
};

window.tambahBarisTabel = function(btn) {
    let cell = (btn && btn.closest) ? btn.closest('td, th') : window.activeTableCell;
    if (!cell) return;
    let row = cell.parentElement;
    let newRow = document.createElement('tr');
    Array.from(row.children).forEach(function() {
        let newCell = document.createElement('td');
        newCell.innerHTML = '<button type="button" class="tbl-btn-add tbl-add-col" contenteditable="false" onclick="window.tambahKolomTabel(this)" title="Tambah Kolom ke Kanan">+</button>' +
                            '<button type="button" class="tbl-btn-add tbl-add-row" contenteditable="false" onclick="window.tambahBarisTabel(this)" title="Tambah Baris ke Bawah">+</button>';
        newRow.appendChild(newCell);
    });
    if (row.nextSibling) row.parentElement.insertBefore(newRow, row.nextSibling);
    else row.parentElement.appendChild(newRow);
    triggerInput();
};

window.tambahKolomTabel = function(btn) {
    let cell = (btn && btn.closest) ? btn.closest('td, th') : window.activeTableCell;
    if (!cell) return;
    let row = cell.parentElement;
    let table = row.closest('table');
    if (!table) return;
    let cellIndex = Array.from(row.children).indexOf(cell);
    Array.from(table.rows).forEach(function(tr, rIdx) {
        let isHeader = (rIdx === 0 && table.rows[0].children[0] && table.rows[0].children[0].tagName === 'TH');
        let tag = isHeader ? 'th' : 'td';
        let newCell = document.createElement(tag);
        newCell.innerHTML = '<button type="button" class="tbl-btn-add tbl-add-col" contenteditable="false" onclick="window.tambahKolomTabel(this)" title="Tambah Kolom ke Kanan">+</button>' +
                            '<button type="button" class="tbl-btn-add tbl-add-row" contenteditable="false" onclick="window.tambahBarisTabel(this)" title="Tambah Baris ke Bawah">+</button>';
        if (cellIndex + 1 < tr.children.length) tr.insertBefore(newCell, tr.children[cellIndex + 1]);
        else tr.appendChild(newCell);
    });
    triggerInput();
};

window.hapusBarisTabel = function() { 
    if(window.activeTableCell) { 
        let tr = window.activeTableCell.parentNode; 
        tr.parentNode.removeChild(tr); 
        document.getElementById('tbl-controls').style.display = 'none'; 
        triggerInput(); 
    } 
}; 
window.hapusKolomTabel = function() { 
    if(window.activeTableCell) { 
        let tb = window.activeTableCell.closest('table');
        let cI = window.activeTableCell.cellIndex; 
        Array.from(tb.rows).forEach(r => { if(r.cells.length > cI) r.deleteCell(cI); }); 
        document.getElementById('tbl-controls').style.display = 'none'; 
        triggerInput(); 
    } 
};

/* =========================================
   RENDER MATHJAX (LATEX) & AI TEXT CHAT
   ========================================= */
window.renderMathJax = function() { 
    if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) { 
        MathJax.typesetClear(); 
        MathJax.typesetPromise().catch((err) => console.log('MathJax:', err.message)); 
    } 
};

window.terapkanLatex = function() {
    window.simpanSeleksiTeks();
    let text = window.globalSelectedRange ? window.globalSelectedRange.toString().trim() : "";
    if (!text) return alert("Blok teks atau rumus matematika terlebih dahulu!");

    // Konversi Cerdas: Jika tidak ada kode LaTeX (backslash '\'), ubah pecahan biasa jadi pecahan LaTeX
    if (text.indexOf('\\') === -1) {
        // Mengubah pola "a/b" atau "2/3" menjadi "\frac{2}{3}"
        text = text.replace(/([0-9a-zA-Z]+)\/([0-9a-zA-Z]+)/g, "\\frac{$1}{$2}");
    }

    let rawTextEscaped = text.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Bungkus dengan div rata tengah dan tambahkan fungsi batal (double click)
    let latexHTML = '<div class="math-latex-block" contenteditable="false" data-raw="' + rawTextEscaped + '" ondblclick="window.batalLatex(this, event)" style="text-align:center; margin: 15px 0; cursor:pointer;" title="Klik ganda untuk membatalkan format rumus">$$ ' + text + ' $$</div><p><br></p>';

    window.kembalikanSeleksiTeks();
    document.execCommand("insertHTML", false, latexHTML);
    window.renderMathJax();
    triggerInput();
};

window.batalLatex = function(el, event) {
    event.stopPropagation();
    if (!document.body.classList.contains('mode-edit-aktif') && !document.documentElement.classList.contains('force-edit-mode')) return;
    
    let rawText = el.getAttribute('data-raw') || "";
    let textNode = document.createTextNode(rawText);
    el.parentNode.replaceChild(textNode, el);
    triggerInput();
};

window.restoreMathJax = function() {
    if (typeof MathJax !== 'undefined' && MathJax.startup && MathJax.startup.document) {
        try {
            MathJax.startup.document.state(0); 
            // Pastikan fungsi restore ada sebelum memanggilnya untuk mencegah crash TypeError
            if (typeof MathJax.startup.document.restore === "function") {
                MathJax.startup.document.restore();
            } else if (typeof MathJax.startup.document.clear === "function") {
                MathJax.startup.document.clear();
            }
        } catch (e) {
            console.warn("MathJax restore ditunda:", e);
        }
    }
};

window.tanyaAIText = function() {
    simpanSeleksiTeks();
    let text = globalSelectedRange ? globalSelectedRange.toString().trim() : "";
    if(!text) return alert("Blok teks/kata yang ingin ditanyakan pada AI terlebih dahulu.");
    
    document.getElementById('ai-tutor-box').style.display = 'flex';
    let body = document.getElementById('ai-tutor-body');
    body.innerHTML += `<div class="user-bubble">Tolong jelaskan ini: "${text}"</div>`;
    body.innerHTML += `<div class="ai-bubble" id="ai-typing"><em>AI sedang mengetik...</em></div>`;
    body.scrollTop = body.scrollHeight;
    
    setTimeout(() => {
        let t = document.getElementById('ai-typing'); if(t) t.remove();
        body.innerHTML += `<div class="ai-bubble">Dalam konteks materi ini, <b>${text}</b> adalah konsep yang mengacu pada struktur atau proses penting. Bayangkan ini seperti sistem kerja pada mesin yang memastikan semuanya berjalan lancar. Ada hal spesifik dari ini yang ingin diperdalam?</div>`;
        body.scrollTop = body.scrollHeight;
    }, 1500);
};

window.kirimPesanAI = function() {
    let input = document.getElementById('ai-tutor-input');
    let val = input.value.trim();
    if(!val) return;
    let body = document.getElementById('ai-tutor-body');
    body.innerHTML += `<div class="user-bubble">${val}</div>`;
    input.value = "";
    body.innerHTML += `<div class="ai-bubble" id="ai-typing"><em>AI memproses...</em></div>`;
    body.scrollTop = body.scrollHeight;
    
    setTimeout(() => {
        let t = document.getElementById('ai-typing'); if(t) t.remove();
        body.innerHTML += `<div class="ai-bubble">Pertanyaan bagus! Jika kita pecah lebih sederhana, ini bekerja dengan hukum sebab-akibat. Jika A terjadi, maka B akan merespon. Cobalah perhatikan grafik atau gambar di samping untuk memvisualisasikannya.</div>`;
        body.scrollTop = body.scrollHeight;
    }, 1000);
};


// --- TOMBOL FULLSCREEN UNIVERSAL (KANAN BAWAH LAYAR) & CETAK MATERI A4 ---
window.isManualFullscreenLocked = false;

window.toggleUniversalFullscreen = function() {
    let btn = document.getElementById('btn-fullscreen-global');
    let elem = document.documentElement;
    let isCurrentlyFull = Boolean(document.fullscreenElement || document.webkitFullscreenElement || window.isManualFullscreenLocked);
    let isTouchDevice = navigator.maxTouchPoints > 0 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (!isCurrentlyFull) {
        window.isManualFullscreenLocked = true;
        document.documentElement.classList.add('ios-fullscreen-lock');
        document.body.classList.add('ios-fullscreen-lock');
        if (btn) {
            btn.classList.add('is-fullscreen-active');
            btn.innerHTML = '🗗';
        }
        // Jangan gunakan native fullscreen pada perangkat sentuh agar fitur Pinch-to-Zoom peramban tidak dimatikan
        if (!isTouchDevice) {
            try {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().catch(function() {});
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                }
            } catch (e) {}
        }
        window.scrollTo(0, 1);
    } else {
        window.isManualFullscreenLocked = false;
        document.documentElement.classList.remove('ios-fullscreen-lock');
        document.body.classList.remove('ios-fullscreen-lock');
        if (btn) {
            btn.classList.remove('is-fullscreen-active');
            btn.innerHTML = '⛶';
        }
        try {
            if (document.exitFullscreen && document.fullscreenElement) {
                document.exitFullscreen().catch(function() {});
            } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
                document.webkitExitFullscreen();
            }
        } catch (e) {}
    }
};

// Jaga agar Fullscreen tetap terkunci kecuali pengguna menekan ESC atau tombol Fullscreen
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && window.isManualFullscreenLocked) {
        window.isManualFullscreenLocked = false;
        document.body.classList.remove('ios-fullscreen-lock');
        let btn = document.getElementById('btn-fullscreen-global');
        if (btn) {
            btn.classList.remove('is-fullscreen-active');
            btn.innerHTML = '⛶';
        }
    }
});

/* ========================================================
   CETAK MATERI HALAMAN (DYNAMIC CONTENT BLOCK)
   ======================================================== */
window.cetakMateriHalamanA4 = function() {
    window.print();
};

    
/* =========================================
   MESIN CATATAN GURU & CATATAN KELAS (DRAG ANTI-NYANGKUT + POINTER CANCEL)
   ========================================= */
window.adminCatatanGuruData = window.adminCatatanGuruData || [{ id: 'sheet_1', nama: 'Sheet 1', html: '' }];
window.cgActiveIndex = 0;

window.bukaCatatanGuru = function() {
    document.getElementById('modal-catatan-guru').style.display = 'flex';
    window.renderSheetsCG();
    window.muatKontenSheetAktifCG();
};

window.tutupCatatanGuru = function() {
    document.getElementById('modal-catatan-guru').style.display = 'none';
};

window.toggleSizeCatatanGuru = function() {
    document.getElementById('modal-catatan-guru').classList.toggle('cg-maximized');
};

window.pasangDragModalFloating = function(headerId, boxId) {
    let headerEl = document.getElementById(headerId);
    let boxEl = document.getElementById(boxId);
    if (!headerEl || !boxEl) return;

    let isDragging = false, startX = 0, startY = 0, mouseX = 0, mouseY = 0, activePid = null;

    function akhiriDrag() {
        if (!isDragging) return;
        isDragging = false;
        if (activePid !== null) {
            try { headerEl.releasePointerCapture(activePid); } catch (e) {}
            activePid = null;
        }
    }

    // KUNCI PERBAIKAN: Hanya izinkan drag jika kursor menyentuh HEADER, bukan area lain.
    headerEl.addEventListener('pointerdown', function(e) {
        if (e.target.closest('button') || boxEl.classList.contains('cg-maximized')) return;
        isDragging = true;
        activePid = e.pointerId;
        mouseX = e.clientX;
        mouseY = e.clientY;
        let rect = boxEl.getBoundingClientRect();
        startX = rect.left;
        startY = rect.top;
        
        // Hentikan perambatan klik agar tidak memblokir input di editor
        e.stopPropagation();
        try { headerEl.setPointerCapture(e.pointerId); } catch (err) {}
    });

    window.addEventListener('pointermove', function(e) {
        if (!isDragging) return;
        // Pindahkan kotak dengan pembatasan area layar
        let nextLeft = Math.max(0, Math.min(window.innerWidth - 80, startX + (e.clientX - mouseX)));
        let nextTop = Math.max(0, Math.min(window.innerHeight - 40, startY + (e.clientY - mouseY)));
        boxEl.style.right = 'auto';
        boxEl.style.bottom = 'auto';
        boxEl.style.left = nextLeft + 'px';
        boxEl.style.top = nextTop + 'px';
        e.preventDefault(); // Cegah block text tanpa sengaja saat geser
    });

    window.addEventListener('pointerup', akhiriDrag);
    window.addEventListener('pointercancel', akhiriDrag);
    headerEl.addEventListener('lostpointercapture', akhiriDrag);
};

window.pasangDragModalFloating('cg-header', 'modal-catatan-guru');
window.pasangDragModalFloating('ck-header', 'modal-catatan-kelas');

window.renderSheetsCG = function() {
    let listEl = document.getElementById('cg-sheet-list');
    if (!listEl) return;
    let html = '';
    window.adminCatatanGuruData.forEach((sheet, idx) => {
        let isActive = (idx === window.cgActiveIndex) ? 'active' : '';
        html += `<div class="cg-sheet-item ${isActive}" onclick="window.pindahSheetCG(${idx})" ondblclick="window.gantiNamaSheetCG(${idx})">
                    <span>${sheet.nama}</span>
                    <button class="cg-del-sheet" onclick="event.stopPropagation(); window.hapusSheetCG(${idx})" title="Hapus Sheet">✕</button>
                 </div>`;
    });
    listEl.innerHTML = html;
};

window.muatKontenSheetAktifCG = function() {
    let editor = document.getElementById('cg-editor-area');
    if (!editor || !window.adminCatatanGuruData[window.cgActiveIndex]) return;
    editor.innerHTML = window.adminCatatanGuruData[window.cgActiveIndex].html || '';
};

window.pindahSheetCG = function(idx) {
    if (window.cgActiveIndex === idx) return;
    window.cgActiveIndex = idx;
    window.renderSheetsCG();
    window.muatKontenSheetAktifCG();
};

window.tambahSheetCG = function() {
    let namaBaru = "Sheet " + (window.adminCatatanGuruData.length + 1);
    window.adminCatatanGuruData.push({ id: 'sheet_' + Date.now(), nama: namaBaru, html: '' });
    window.cgActiveIndex = window.adminCatatanGuruData.length - 1;
    window.renderSheetsCG();
    window.muatKontenSheetAktifCG();
    if(typeof window.simpanCatatanGuruKeDB === "function") window.simpanCatatanGuruKeDB();
};

window.gantiNamaSheetCG = function(idx) {
    let namaLama = window.adminCatatanGuruData[idx].nama;
    let namaBaru = prompt("Ubah nama sheet:", namaLama);
    if (namaBaru && namaBaru.trim() !== "") {
        window.adminCatatanGuruData[idx].nama = namaBaru.trim();
        window.renderSheetsCG();
        if(typeof window.simpanCatatanGuruKeDB === "function") window.simpanCatatanGuruKeDB();
    }
};

window.hapusSheetCG = function(idx) {
    if (window.adminCatatanGuruData.length <= 1) return alert("Minimal harus ada 1 sheet tersisa!");
    if (confirm(`Hapus sheet "${window.adminCatatanGuruData[idx].nama}" beserta isinya?`)) {
        window.adminCatatanGuruData.splice(idx, 1);
        window.cgActiveIndex = 0;
        window.renderSheetsCG();
        window.muatKontenSheetAktifCG();
        if(typeof window.simpanCatatanGuruKeDB === "function") window.simpanCatatanGuruKeDB();
    }
};

window.cgSaveTimer = null;
window.isTypingCG = false;

window.simpanCatatanGuruDelay = function() {
    let editor = document.getElementById('cg-editor-area');
    if (!editor || !window.adminCatatanGuruData[window.cgActiveIndex]) return;
    
    window.isTypingCG = true;
    window.adminCatatanGuruData[window.cgActiveIndex].html = editor.innerHTML;

    let stat = document.getElementById('cg-sync-status');
    if (stat) stat.innerHTML = "<span style='color:#e67e22;'>✍️ Mengetik...</span>";

    clearTimeout(window.cgSaveTimer);
    window.cgSaveTimer = setTimeout(function() {
        if(typeof window.simpanCatatanGuruKeDB === "function") {
            window.simpanCatatanGuruKeDB();
        }
    }, 800);
};

window.adminCatatanKelasData = window.adminCatatanKelasData || {}; 
window.ckActiveIndex = 0;
window.isTypingCK = false;

window.bukaCatatanKelas = function() {
    let kls = window.kelasAktifAdmin;
    if(!kls) return alert("Silakan pilih kelas terlebih dahulu di dropdown Administrasi!");
    
    document.getElementById('ck-kelas-title').innerText = kls;
    
    if(!window.adminCatatanKelasData[kls] || window.adminCatatanKelasData[kls].length === 0) {
        window.adminCatatanKelasData[kls] = [{ id: 'sheet_1', nama: 'Sheet 1', html: '' }];
    }
    
    window.ckActiveIndex = 0;
    document.getElementById('modal-catatan-kelas').style.display = 'flex';
    window.renderSheetsCK();
    window.muatKontenSheetAktifCK();
};

window.tutupCatatanKelas = function() {
    document.getElementById('modal-catatan-kelas').style.display = 'none';
};

window.toggleSizeCatatanKelas = function() {
    document.getElementById('modal-catatan-kelas').classList.toggle('cg-maximized');
};

window.renderSheetsCK = function() {
    let kls = window.kelasAktifAdmin;
    let container = document.getElementById('ck-sheet-list');
    if(!container || !kls || !window.adminCatatanKelasData[kls]) return;
    
    let html = '';
    window.adminCatatanKelasData[kls].forEach((sheet, idx) => {
        let isActive = (idx === window.ckActiveIndex) ? 'active' : '';
        html += `<div class="cg-sheet-item ${isActive}" onclick="window.pindahSheetCK(${idx})">
                    <span contenteditable="true" onblur="window.ubahNamaSheetCK(${idx}, this.innerText)" onclick="event.stopPropagation()">${sheet.nama}</span>
                    <button class="cg-del-sheet" onclick="event.stopPropagation(); window.hapusSheetCK(${idx})" title="Hapus Sheet">✕</button>
                 </div>`;
    });
    container.innerHTML = html;
};

window.pindahSheetCK = function(idx) {
    window.ckActiveIndex = idx;
    window.renderSheetsCK();
    window.muatKontenSheetAktifCK();
};

window.muatKontenSheetAktifCK = function() {
    let kls = window.kelasAktifAdmin;
    let area = document.getElementById('ck-editor-area');
    if(area && kls && window.adminCatatanKelasData[kls][window.ckActiveIndex]) {
        area.innerHTML = window.adminCatatanKelasData[kls][window.ckActiveIndex].html || '';
    }
};

window.tambahSheetCK = function() {
    let kls = window.kelasAktifAdmin;
    if(!kls) return;
    let newIdx = window.adminCatatanKelasData[kls].length + 1;
    window.adminCatatanKelasData[kls].push({ id: 'sheet_' + Date.now(), nama: 'Sheet ' + newIdx, html: '' });
    window.ckActiveIndex = window.adminCatatanKelasData[kls].length - 1;
    window.renderSheetsCK();
    window.muatKontenSheetAktifCK();
    if(typeof window.simpanCatatanKelasKeDB === "function") window.simpanCatatanKelasKeDB();
};

window.ubahNamaSheetCK = function(idx, namaBaru) {
    let kls = window.kelasAktifAdmin;
    if(kls && window.adminCatatanKelasData[kls][idx]) {
        window.adminCatatanKelasData[kls][idx].nama = namaBaru.trim() || 'Sheet ' + (idx+1);
        if(typeof window.simpanCatatanKelasKeDB === "function") window.simpanCatatanKelasKeDB();
    }
};

window.hapusSheetCK = function(idx) {
    let kls = window.kelasAktifAdmin;
    if(!kls || window.adminCatatanKelasData[kls].length <= 1) return alert("Minimal harus ada 1 sheet!");
    if(confirm("Hapus sheet ini?")) {
        window.adminCatatanKelasData[kls].splice(idx, 1);
        window.ckActiveIndex = 0;
        window.renderSheetsCK();
        window.muatKontenSheetAktifCK();
        if(typeof window.simpanCatatanKelasKeDB === "function") window.simpanCatatanKelasKeDB();
    }
};

window.ckTypingTimer = null;
window.simpanCatatanKelasDelay = function() {
    window.isTypingCK = true;
    let stat = document.getElementById('ck-sync-status');
    if(stat) stat.innerHTML = "<span style='color:#f1c40f;'>✍️ Mengetik...</span>";
    
    clearTimeout(window.ckTypingTimer);
    window.ckTypingTimer = setTimeout(function() {
        let kls = window.kelasAktifAdmin;
        let area = document.getElementById('ck-editor-area');
        if(kls && area && window.adminCatatanKelasData[kls][window.ckActiveIndex]) {
            window.adminCatatanKelasData[kls][window.ckActiveIndex].html = area.innerHTML;
            if(typeof window.simpanCatatanKelasKeDB === "function") window.simpanCatatanKelasKeDB();
        }
    }, 800);
};

/* =====================================================================
   JADWAL SEKOLAH (EXCEL) & KALENDER PENGINGAT ADMIN (DARK MODE)
   ===================================================================== */
window.adminJadwalKalenderData = window.adminJadwalKalenderData || { excelHtml: "", events: {} };
window.calCurrentYear = new Date().getFullYear();
window.calCurrentMonth = new Date().getMonth();

window.bukaModalJadwalGuru = function() {
    window.bukaModal('modal-jadwal-guru');
    window.gantiTabJadwalGuru('kalender');
};

window.gantiTabJadwalGuru = function(tabName) {
    let btnKal = document.getElementById('btn-tab-jadwal-kalender');
    let btnExc = document.getElementById('btn-tab-jadwal-excel');
    let viewKal = document.getElementById('view-jadwal-kalender');
    let viewExc = document.getElementById('view-jadwal-excel');

    if (tabName === 'kalender') {
        if (btnKal) { btnKal.style.background = '#e67e22'; btnKal.style.color = 'white'; }
        if (btnExc) { btnExc.style.background = 'transparent'; btnExc.style.color = '#cbd5e1'; }
        if (viewKal) viewKal.style.display = 'flex';
        if (viewExc) viewExc.style.display = 'none';
        window.renderKalenderGuru();
    } else {
        if (btnExc) { btnExc.style.background = '#e67e22'; btnExc.style.color = 'white'; }
        if (btnKal) { btnKal.style.background = 'transparent'; btnKal.style.color = '#cbd5e1'; }
        if (viewKal) viewKal.style.display = 'none';
        if (viewExc) viewExc.style.display = 'flex';
        window.muatTabelJadwalExcel();
    }
};

window.geserBulanKalenderGuru = function(offset) {
    window.calCurrentMonth += offset;
    if (window.calCurrentMonth < 0) {
        window.calCurrentMonth = 11;
        window.calCurrentYear--;
    } else if (window.calCurrentMonth > 11) {
        window.calCurrentMonth = 0;
        window.calCurrentYear++;
    }
    window.renderKalenderGuru();
};

window.resetBulanKalenderHariIni = function() {
    let now = new Date();
    window.calCurrentYear = now.getFullYear();
    window.calCurrentMonth = now.getMonth();
    window.renderKalenderGuru();
};

window.renderKalenderGuru = function() {
    let grid = document.getElementById('kalender-grid-days');
    let titleEl = document.getElementById('kalender-title-bulan');
    if (!grid || !titleEl) return;

    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    titleEl.innerHTML = namaBulan[window.calCurrentMonth] + ' <span style="font-weight:300; color:#a1a1aa;">' + window.calCurrentYear + '</span>';

    if (!window.adminJadwalKalenderData) window.adminJadwalKalenderData = { excelHtml: "", events: {} };
    if (!window.adminJadwalKalenderData.events) window.adminJadwalKalenderData.events = {};
    let eventsMap = window.adminJadwalKalenderData.events;

    let firstDay = new Date(window.calCurrentYear, window.calCurrentMonth, 1).getDay();
    let daysInMonth = new Date(window.calCurrentYear, window.calCurrentMonth + 1, 0).getDate();
    let prevMonthDays = new Date(window.calCurrentYear, window.calCurrentMonth, 0).getDate();

    let today = new Date();
    let todayKey = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    let html = '';

    // Hari dari bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
        let dNum = prevMonthDays - i;
        html += `<div class="cal-day-cell other-month"><div class="cal-day-num">${dNum}</div></div>`;
    }

    // Hari di bulan aktif
    for (let d = 1; d <= daysInMonth; d++) {
        let dateKey = window.calCurrentYear + '-' + String(window.calCurrentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        let isToday = (dateKey === todayKey) ? ' is-today' : '';
        let dayEvents = Array.isArray(eventsMap[dateKey]) ? eventsMap[dateKey] : (eventsMap[dateKey] ? Object.values(eventsMap[dateKey]) : []);

        let pillsHtml = '';
        dayEvents.forEach(function(ev, idx) {
            let safeTitle = (ev.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            pillsHtml += `<div class="cal-event-pill" onclick="event.stopPropagation(); window.hapusAgendaKalenderGuru('${dateKey}', ${idx})" title="${safeTitle} (Klik untuk menghapus)">
                            <span style="overflow:hidden; text-overflow:ellipsis;">${ev.jam ? ev.jam + ' ' : ''}${safeTitle}</span>
                            <span style="font-size:9px; opacity:0.8;">✕</span>
                          </div>`;
        });

        html += `<div class="cal-day-cell${isToday}" onclick="window.klikTanggalKalenderGuru('${dateKey}')">
                    <div class="cal-day-num">${d}</div>
                    ${pillsHtml}
                 </div>`;
    }

    // Hari pelengkap ke bulan berikutnya agar genap 42 sel (6 baris)
    let totalCells = firstDay + daysInMonth;
    let remaining = (7 - (totalCells % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
        html += `<div class="cal-day-cell other-month"><div class="cal-day-num">${j}</div></div>`;
    }

    grid.innerHTML = html;
};

window.klikTanggalKalenderGuru = function(dateKey) {
    window.tampilkanCustomDialog("prompt", "➕ Tambah Pengingat Agenda pada Tanggal " + dateKey + ":\n(Pengingat ini akan muncul di Lonceng Notifikasi Admin Anda)", "", function(judul) {
        if (!judul || !judul.trim()) return;
        
        // Beri jeda sedikit agar modal pertama selesai ditutup sebelum membuka modal kedua
        setTimeout(function() {
            window.tampilkanCustomDialog("prompt", "Jam Agenda (Opsional, contoh: 08:00):", "", function(jam) {
                if (!window.adminJadwalKalenderData) window.adminJadwalKalenderData = { excelHtml: "", events: {} };
                if (!window.adminJadwalKalenderData.events) window.adminJadwalKalenderData.events = {};
                if (!Array.isArray(window.adminJadwalKalenderData.events[dateKey])) {
                    window.adminJadwalKalenderData.events[dateKey] = window.adminJadwalKalenderData.events[dateKey]
                        ? Object.values(window.adminJadwalKalenderData.events[dateKey])
                        : [];
                }

                window.adminJadwalKalenderData.events[dateKey].push({
                    id: 'cal_' + Date.now(),
                    title: judul.trim(),
                    jam: (jam || '').trim(),
                    dibuat: new Date().toISOString()
                });

                window.renderKalenderGuru();
                if (typeof window.simpanJadwalKalenderKeDB === "function") window.simpanJadwalKalenderKeDB();
            });
        }, 400);
    });
};

window.hapusAgendaKalenderGuru = function(dateKey, idx) {
    if (!window.adminJadwalKalenderData || !window.adminJadwalKalenderData.events || !window.adminJadwalKalenderData.events[dateKey]) return;
    let item = window.adminJadwalKalenderData.events[dateKey][idx];
    if (!item) return;

    window.tampilkanCustomDialog("confirm", 'Hapus agenda "' + item.title + '" pada tanggal ' + dateKey + '?', null, function(isYes) {
        if (!isYes) return;
        window.adminJadwalKalenderData.events[dateKey].splice(idx, 1);
        if (window.adminJadwalKalenderData.events[dateKey].length === 0) {
            delete window.adminJadwalKalenderData.events[dateKey];
        }
        window.renderKalenderGuru();
        if (typeof window.simpanJadwalKalenderKeDB === "function") window.simpanJadwalKalenderKeDB();
    });
};

window.muatTabelJadwalExcel = function() {
    let ed = document.getElementById('editor-jadwal-excel');
    if (!ed) return;
    if (window.adminJadwalKalenderData && window.adminJadwalKalenderData.excelHtml) {
        ed.innerHTML = window.adminJadwalKalenderData.excelHtml;
    } else {
        window.resetTabelJadwalDefault(true);
    }
};

window.resetTabelJadwalDefault = function(silent) {
    if (!silent && !confirm("Buat tabel jadwal kosong baru? Tabel yang ada saat ini akan diganti.")) return;
    let ed = document.getElementById('editor-jadwal-excel');
    if (!ed) return;
    let defaultHtml = `
        <table class="excel-table" style="width:100%;">
            <thead>
                <tr>
                    <th style="width:110px;">Jam / Waktu</th>
                    <th>Senin</th>
                    <th>Selasa</th>
                    <th>Rabu</th>
                    <th>Kamis</th>
                    <th>Jumat</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>07:30 - 09:00</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
                <tr><td>09:00 - 10:30</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
                <tr><td>10:45 - 12:15</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
                <tr><td>13:00 - 14:30</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
            </tbody>
        </table>`;
    ed.innerHTML = defaultHtml;
    if (!silent) window.simpanJadwalSekolahExcel();
};

window.jadwalSaveTimer = null;
window.simpanJadwalSekolahDelay = function() {
    clearTimeout(window.jadwalSaveTimer);
    window.jadwalSaveTimer = setTimeout(function() {
        window.simpanJadwalSekolahExcel(true);
    }, 900);
};

window.simpanJadwalSekolahExcel = function(silent) {
    let ed = document.getElementById('editor-jadwal-excel');
    if (!ed) return;
    if (!window.adminJadwalKalenderData) window.adminJadwalKalenderData = { excelHtml: "", events: {} };
    window.adminJadwalKalenderData.excelHtml = ed.innerHTML;
    if (typeof window.simpanJadwalKalenderKeDB === "function") window.simpanJadwalKalenderKeDB();
    if (!silent) alert("✅ Jadwal Sekolah berhasil disimpan!");
};

window.importFileJadwalCSV = async function(input) {
    let file = input.files && input.files[0];
    if (!file) return;
    let text = await file.text();
    let rows = text.trim().split(/\r?\n/);
    if (rows.length === 0) return;

    let html = '<table class="excel-table" style="width:100%;"><tbody>';
    rows.forEach(function(r, rIdx) {
        let delimiter = r.indexOf('\t') !== -1 ? '\t' : (r.indexOf(';') !== -1 ? ';' : ',');
        let cols = r.split(delimiter);
        html += '<tr>';
        cols.forEach(function(c) {
            let clean = c.replace(/^"|"$/g, '').trim();
            if (rIdx === 0) html += '<th>' + clean + '</th>';
            else html += '<td>' + clean + '</td>';
        });
        html += '</tr>';
    });
    html += '</tbody></table>';

    let ed = document.getElementById('editor-jadwal-excel');
    if (ed) ed.innerHTML = html;
    window.simpanJadwalSekolahExcel(true);
    input.value = "";
};

// Izinkan Copy-Paste Tabel Langsung dari Excel ke Editor Jadwal Sekolah
document.addEventListener('paste', function(e) {
    let ed = e.target.closest ? e.target.closest('#editor-jadwal-excel') : null;
    if (!ed) return;
    let clip = e.clipboardData || window.clipboardData;
    let htmlPaste = clip.getData('text/html');
    let textPaste = clip.getData('text/plain');

    if (htmlPaste && htmlPaste.indexOf('<table') !== -1) {
        e.preventDefault();
        document.execCommand('insertHTML', false, htmlPaste);
        window.simpanJadwalSekolahDelay();
    } else if (textPaste && textPaste.indexOf('\t') !== -1) {
        e.preventDefault();
        let rows = textPaste.trim().split(/\r?\n/);
        let tbl = '<table class="excel-table" style="width:100%;"><tbody>';
        rows.forEach(function(r, idx) {
            tbl += '<tr>';
            r.split('\t').forEach(function(c) {
                tbl += (idx === 0 ? '<th>' : '<td>') + c.trim() + (idx === 0 ? '</th>' : '</td>');
            });
            tbl += '</tr>';
        });
        tbl += '</tbody></table>';
        ed.innerHTML = tbl;
        window.simpanJadwalSekolahDelay();
    }
});

/* =====================================================================
   SISTEM GAMIFIKASI (XP & LENCANA), PROFIL INTERAKTIF, LEADERBOARD, & NOTIFIKASI (SISWA & ADMIN)
   ===================================================================== */

// 1. STANDAR POIN XP PER 1 SOAL BENAR (PG = 10, PGK = 20, IS = 50, Essay = 100)
window.dapatkanPoinXPPerSoal = function(tipeSoal) {
    let t = String(tipeSoal || "PG").trim().toUpperCase();
    if (t === "PGK") return 20;
    if (t === "IS" || t === "SHORT_ANSWER" || t === "ISIAN" || t === "ISIAN SINGKAT") return 50;
    if (t === "ESSAY" || t === "ESAI" || t === "URAIAN") return 100;
    return 10; // Default PG / MC
};

// 2. NORMALISASI JAWABAN & KUNCI PGK AGAR TIDAK PERNAH SALAH BACA FORMAT
window.normalisasiKunciPGK = function(inputVal, daftarOpsi) {
    if (inputVal === undefined || inputVal === null) return [];
    let rawList = [];

    if (Array.isArray(inputVal)) {
        inputVal.forEach(function(item) {
            if (typeof item === "string" && (item.indexOf(",") !== -1 || item.indexOf("|") !== -1 || item.indexOf(";") !== -1)) {
                item.split(/[,|;]+/).forEach(function(sub) { rawList.push(sub.trim()); });
            } else {
                rawList.push(item);
            }
        });
    } else if (typeof inputVal === "string") {
        let bersih = inputVal.trim();
        if (!bersih) return [];
        if (bersih.indexOf(",") !== -1 || bersih.indexOf("|") !== -1 || bersih.indexOf(";") !== -1 || /\bdan\b/i.test(bersih)) {
            bersih.split(/[,|;]|\bdan\b/i).forEach(function(sub) { rawList.push(sub.trim()); });
        } else if (/^[A-Ea-e\s]+$/.test(bersih) && bersih.replace(/\s+/g, "").length > 1) {
            bersih.replace(/\s+/g, "").split("").forEach(function(ch) { rawList.push(ch); });
        } else {
            rawList.push(bersih);
        }
    } else if (typeof inputVal === "number") {
        rawList.push(inputVal);
    }

    let hasilHuruf = [];
    rawList.forEach(function(val) {
        if (typeof val === "number" && !isNaN(val) && val >= 0 && val < 26) {
            hasilHuruf.push(String.fromCharCode(65 + val));
            return;
        }
        let s = String(val || "").trim();
        if (!s) return;

        // Jika berupa angka indeks dalam string ("0", "1", "2")
        if (/^\d+$/.test(s)) {
            let idx = parseInt(s, 10);
            if (idx >= 0 && idx < 26) {
                hasilHuruf.push(String.fromCharCode(65 + idx));
                return;
            }
        }
        // Jika berupa huruf tunggal A-Z
        if (/^[a-zA-Z]$/.test(s)) {
            hasilHuruf.push(s.toUpperCase());
            return;
        }
        // Jika diawali label opsi seperti "A. Mitokondria" atau "B) Ribosom"
        let matchAwal = s.match(/^([a-zA-Z])[\.\)\:\-\s]/);
        if (matchAwal && matchAwal[1]) {
            hasilHuruf.push(matchAwal[1].toUpperCase());
            return;
        }
        // Jika berupa teks opsi penuh, cocokkan dengan daftarOpsi pada soal
        if (Array.isArray(daftarOpsi) && daftarOpsi.length > 0) {
            let sLow = s.toLowerCase();
            for (let i = 0; i < daftarOpsi.length; i++) {
                let opt = daftarOpsi[i];
                let optText = (typeof opt === "object" && opt !== null) ? String(opt.text || "").trim() : String(opt || "").trim();
                let optLabel = (typeof opt === "object" && opt !== null && opt.label) ? String(opt.label).trim().toUpperCase() : String.fromCharCode(65 + i);
                if (optText.toLowerCase() === sLow) {
                    hasilHuruf.push(optLabel);
                    return;
                }
            }
        }
    });

    return Array.from(new Set(hasilHuruf)).sort();
};

window.apakahJawabanPGKBenar = function(jawabanSiswa, kunciSoal, daftarOpsi) {
    let normSiswa = window.normalisasiKunciPGK(jawabanSiswa, daftarOpsi);
    let normKunci = window.normalisasiKunciPGK(kunciSoal, daftarOpsi);
    if (normKunci.length === 0 || normSiswa.length === 0) return false;
    if (normSiswa.length !== normKunci.length) return false;
    return normSiswa.every(function(huruf, i) { return huruf === normKunci[i]; });
};

// 3. PENAMBAHAN XP SISWA (HANYA MENCATAT SOAL YANG DIJAWAB BENAR)
window.tambahXPSiswa = function(jumlahXP, aktivitas, arrSoalBenar) {
    try {
        let uName = sessionStorage.getItem("username");
        let stat = sessionStorage.getItem("statusLogin");
        if (stat !== "siswa" || !uName || uName.toLowerCase() === "sbd" || uName.toLowerCase() === "mahardika") return;

        let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
            ? window.pastikanStrukturDualXPDanPet(uName)
            : (window.leaderboardSiswaData ? window.leaderboardSiswaData[uName] : null);
        if (!lb) return;

        let tambahan = Number(jumlahXP) || 0;

        // Jika dipanggil dari latihan/kuis dengan daftar soal yang benar, pastikan XP sesuai rumus per soal benar
        if (aktivitas === "latihan" && Array.isArray(arrSoalBenar)) {
            let hitungXPBenar = 0;
            arrSoalBenar.forEach(function(q) {
                if (q && q. sudahBenar !== false) {
                    hitungXPBenar += window.dapatkanPoinXPPerSoal(q.type);
                }
            });
            if (hitungXPBenar > 0 || arrSoalBenar.length === 0) {
                tambahan = hitungXPBenar;
            }
        }

        if (tambahan <= 0 && (!arrSoalBenar || arrSoalBenar.length === 0)) return;

        let curTotal = Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0;
        let curCoin = Number(lb.coin !== undefined ? lb.coin : (lb.xpTersedia !== undefined ? lb.xpTersedia : lb.xp)) || 0;
        lb.xpTotal = curTotal + tambahan;
        lb.xp = lb.xpTotal;
        lb.coin = curCoin + tambahan;
        lb.xpTersedia = lb.coin;

        if (arrSoalBenar && Array.isArray(arrSoalBenar)) {
            if (!lb.statSoal) lb.statSoal = { PG: 0, PGK: 0, IS: 0, Essay: 0 };
            arrSoalBenar.forEach(function(q) {
                if (!q || q.sudahBenar === false) return;
                let rawT = String(q.type || "PG").toUpperCase();
                let t = rawT === "PGK" ? "PGK" : ((rawT === "IS" || rawT === "SHORT_ANSWER") ? "IS" : ((rawT === "ESSAY" || rawT === "ESAI") ? "Essay" : "PG"));
                if (lb.statSoal[t] !== undefined) lb.statSoal[t]++;
            });
        }

        if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
            window.simpanLeaderboardSiswaKeDB(uName, lb);
        }
        if (typeof window.perbaruiTampilanSaldoXPPet === "function") {
            window.perbaruiTampilanSaldoXPPet();
        }
        if (typeof window.perbaruiUIHeaderProfilSiswa === "function") {
            window.perbaruiUIHeaderProfilSiswa();
        }
    } catch (e) {
        console.warn("Gagal memperbarui XP siswa:", e);
    }
};

// Catatan: Poin Baca Modul (+20 XP) telah dihapus sesuai pembaruan sistem.

window.perbaruiUIHeaderProfilSiswa = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let uName = sessionStorage.getItem("username");
    
    let btnProfil = document.getElementById('btn-profil-utama');
    let btnLogin = document.getElementById('btn-login-utama');
    
    if (stat === "siswa" && uName) {
        if(btnProfil) btnProfil.style.display = 'flex';
        if(btnLogin) btnLogin.style.display = 'none';
        
        let lb = (window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) ? window.leaderboardSiswaData[uName] : null;
        if (lb) {
            let lencana = window.kalkulasiLencanaSains(lb.xp || 0);
            let namaTampil = lb.namaPanggilan || lb.namaLengkap.split(' ')[0];
            
            document.getElementById('header-profil-nama').innerText = namaTampil;
            if (lb.foto) document.getElementById('header-profil-foto').src = lb.foto;
            document.getElementById('header-profil-foto').style.borderColor = lencana.warna;

            if (!window._presensiSesiTercatat && typeof window.updatePresensiOnlineSiswa === "function") {
                window._presensiSesiTercatat = true;
                window.updatePresensiOnlineSiswa(true, true);
            }
        }
    } else {
        if(btnProfil) btnProfil.style.display = 'none';
        if(btnLogin && stat !== "admin") btnLogin.style.display = 'block';
    }
    window.hitungDanUpdateBadgeNotifikasi();
};

if (typeof window.perbaruiTombolCheckinUI === "function") {
    window.perbaruiTombolCheckinUI();
}

window.bukaModalProfilSiswa = function() {
    let uName = sessionStorage.getItem("username");
    if (!window.akunSiswaData || !window.leaderboardSiswaData) return;
    
    let akun = window.akunSiswaData[uName];
    let lb = window.leaderboardSiswaData[uName];
    if (!akun || !lb) return;
    
    let lencana = window.kalkulasiLencanaSains(lb.xp || 0);
    
    document.getElementById('profil-img-preview').src = lb.foto || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
    document.getElementById('profil-img-preview').style.borderColor = lencana.warna;
    
    let bLencana = document.getElementById('profil-badge-lencana');
    bLencana.innerText = lencana.ikon + " " + lencana.nama;
    bLencana.style.background = lencana.bg;
    bLencana.style.color = lencana.warna;
    bLencana.style.borderColor = lencana.border;
    
    document.getElementById('profil-nama-asli').innerText = akun.namaLengkap;
    document.getElementById('profil-info-kelas').innerText = "Kelas: " + akun.kelas + " | Username: " + uName;
    document.getElementById('profil-deskripsi-lencana').innerText = lencana.deskripsi;
    document.getElementById('profil-total-xp').innerText = (lb.xp || 0) + " XP";
    
    let s = lb.statSoal || { PG: 0, PGK: 0, IS: 0, Essay: 0 };
    document.getElementById('profil-stat-pg').innerText = s.PG;
    document.getElementById('profil-stat-pgk').innerText = s.PGK;
    document.getElementById('profil-stat-is').innerText = s.IS;
    document.getElementById('profil-stat-es').innerText = s.Essay;
    
    document.getElementById('profil-input-panggilan').value = lb.namaPanggilan || "";
    
    let statGmail = document.getElementById('profil-status-gmail');
    statGmail.innerText = "Terverifikasi / Aman";
    statGmail.style.background = "#2ecc71"; statGmail.style.color = "white";
    
    if (akun.password === "123456") {
        statGmail.innerText = "⚠️ Gunakan Gmail asli & ganti password";
        statGmail.style.background = "#f1c40f"; statGmail.style.color = "#2c3e50";
    }

    document.getElementById('profil-input-gmail').value = akun.gmail || "";
    document.getElementById('profil-input-username-baru').value = uName;
    document.getElementById('profil-input-password-baru').value = "";
    
    window.bukaModal('modal-profil-siswa');
};

window.simpanNamaPanggilanProfil = function() {
    let uName = sessionStorage.getItem("username");
    let val = document.getElementById('profil-input-panggilan').value.trim();
    if (!val || !window.leaderboardSiswaData[uName]) return;
    
    window.leaderboardSiswaData[uName].namaPanggilan = val;
    if (typeof window.simpanLeaderboardSiswaKeDB === "function") window.simpanLeaderboardSiswaKeDB(uName, window.leaderboardSiswaData[uName]);
    
    window.perbaruiUIHeaderProfilSiswa();
    alert("✅ Nama panggilan berhasil diperbarui!");
};

window.konversiDataUrlKeBlobAvatar = function(dataUrl) {
    let parts = String(dataUrl || "").split(",");
    if (parts.length < 2) return null;
    let mimeMatch = parts[0].match(/:(.*?);/);
    let mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    let bstr = atob(parts[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

window.prosesUploadFotoProfil = function(input) {
    let f = input.files && input.files[0];
    if (!f) return;
    let rawU = sessionStorage.getItem("username") || "";
    let cleanU = (typeof window.normalisasiUsernameSiswa === "function")
        ? window.normalisasiUsernameSiswa(rawU)
        : rawU.trim().toLowerCase();

    let btnCam = input.nextElementSibling;
    let oldIcon = btnCam ? btnCam.innerText : "📷";
    if (btnCam) {
        btnCam.disabled = true;
        btnCam.innerText = "⏳";
    }

    let selesaiUI = function() {
        if (btnCam) {
            btnCam.disabled = false;
            btnCam.innerText = oldIcon;
        }
        input.value = "";
    };

    let simpanUrlFotoKeProfil = function(urlFoto) {
        let previewEl = document.getElementById('profil-img-preview');
        if (previewEl) previewEl.src = urlFoto;

        let lb = (window.leaderboardSiswaData && (window.leaderboardSiswaData[cleanU] || window.leaderboardSiswaData[rawU])) || null;
        if (lb) {
            lb.foto = urlFoto;
            window.leaderboardSiswaData[cleanU] = lb;
            if (rawU) window.leaderboardSiswaData[rawU] = lb;
            if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
                window.simpanLeaderboardSiswaKeDB(cleanU, lb);
            }
            window.perbaruiUIHeaderProfilSiswa();
        }
        selesaiUI();
    };

    // Jika file adalah GIF animasi: unggah langsung tanpa canvas agar animasi tetap bergerak!
    let isGif = (f.type === 'image/gif') || (f.name && /\.gif$/i.test(f.name));
    if (isGif) {
        if (f.size > 2 * 1024 * 1024) {
            selesaiUI();
            return alert("⚠️ Ukuran file GIF terlalu besar (Maksimal 2 MB). Pilih GIF dengan ukuran lebih kecil ya!");
        }
        let previewEl = document.getElementById('profil-img-preview');
        if (previewEl) previewEl.src = URL.createObjectURL(f);

        if (typeof window.uploadFotoProfilKeStorage === "function") {
            window.uploadFotoProfilKeStorage(f, cleanU, function(downloadUrl) {
                simpanUrlFotoKeProfil(downloadUrl);
                if (typeof window.tampilkanBadgeHadiahKuis === "function") {
                    window.tampilkanBadgeHadiahKuis(null, "✅ Foto profil GIF animasi berhasil dipasang!");
                }
            }, function(err) {
                console.warn("Gagal upload GIF ke Storage:", err);
                selesaiUI();
                alert("❌ Gagal mengunggah foto GIF. Pastikan koneksi stabil dan ukuran di bawah 2 MB.");
            });
        } else {
            selesaiUI();
            alert("⚠️ Layanan Firebase Storage belum siap. Muat ulang halaman lalu coba lagi.");
        }
        return;
    }

    let reader = new FileReader();
    reader.onload = function(e) {
        let img = new Image();
        img.onload = function() {
            let canvas = document.createElement('canvas');
            let MAX_AVATAR = 200;
            let w = img.width, h = img.height;
            if (w > h) { if (w > MAX_AVATAR) { h *= MAX_AVATAR / w; w = MAX_AVATAR; } }
            else { if (h > MAX_AVATAR) { w *= MAX_AVATAR / h; h = MAX_AVATAR; } }
            canvas.width = Math.round(w);
            canvas.height = Math.round(h);
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Tampilkan pratinjau lokal seketika agar terasa instan
            let fallbackDataUrl = canvas.toDataURL('image/jpeg', 0.65);
            let previewEl = document.getElementById('profil-img-preview');
            if (previewEl) previewEl.src = fallbackDataUrl;

            let prosesUnggahBlob = function(blob) {
                if (blob && typeof window.uploadFotoProfilKeStorage === "function") {
                    window.uploadFotoProfilKeStorage(blob, cleanU, function(downloadUrl) {
                        simpanUrlFotoKeProfil(downloadUrl);
                        if (typeof window.tampilkanBadgeHadiahKuis === "function") {
                            window.tampilkanBadgeHadiahKuis(null, "✅ Foto profil tersimpan ringan di Cloud Storage!");
                        }
                    }, function(err) {
                        console.warn("Storage upload gagal, memakai cadangan lokal:", err);
                        simpanUrlFotoKeProfil(fallbackDataUrl);
                    });
                } else {
                    simpanUrlFotoKeProfil(fallbackDataUrl);
                }
            };

            if (canvas.toBlob) {
                canvas.toBlob(function(blob) {
                    prosesUnggahBlob(blob || window.konversiDataUrlKeBlobAvatar(fallbackDataUrl));
                }, 'image/jpeg', 0.72);
            } else {
                prosesUnggahBlob(window.konversiDataUrlKeBlobAvatar(fallbackDataUrl));
            }
        };
        img.onerror = selesaiUI;
        img.src = e.target.result;
    };
    reader.onerror = selesaiUI;
    reader.readAsDataURL(f);
};

// Alat 1-Klik Admin untuk Memindahkan Foto Base64 Lama di Leaderboard ke Firebase Storage
window.perbaruiBannerMigrasiFotoAdmin = function() {
    let lbCont = document.getElementById('leaderboard-list-container');
    if (!lbCont || !lbCont.parentElement) return;

    let oldBanner = document.getElementById('admin-banner-migrasi-foto');
    let isAdmin = (sessionStorage.getItem("statusLogin") === "admin") || (typeof window.isAdminSession === "function" && window.isAdminSession());
    if (!isAdmin) {
        if (oldBanner) oldBanner.remove();
        return;
    }

    let rawMap = window.leaderboardSiswaData || {};
    let daftarBase64 = Object.keys(rawMap).filter(function(k) {
        let item = rawMap[k];
        return item && typeof item.foto === "string" && item.foto.indexOf("data:image/") === 0;
    });

    if (daftarBase64.length === 0) {
        if (oldBanner) oldBanner.remove();
        return;
    }

    if (!oldBanner) {
        oldBanner = document.createElement('div');
        oldBanner.id = 'admin-banner-migrasi-foto';
        oldBanner.style.cssText = 'background:#fef3c7; border:1.5px solid #f59e0b; border-radius:10px; padding:10px 14px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;';
        lbCont.parentElement.insertBefore(oldBanner, lbCont);
    }

    oldBanner.innerHTML =
        '<div style="font-size:12px; color:#92400e; font-weight:700; flex:1; min-width:200px;">' +
            '⚡ Ditemukan <b>' + daftarBase64.length + ' foto profil lama (Base64)</b> yang memberatkan kuota Download Realtime Database.' +
        '</div>' +
        '<button type="button" id="btn-migrasi-foto-storage" class="btn-action" style="background:#d97706; width:auto; padding:7px 14px; font-size:11.5px; border-radius:20px;" onclick="window.migrasiSemuaFotoBase64KeStorage()">☁️ Pindahkan Semua ke Storage</button>';
};

window.migrasiSemuaFotoBase64KeStorage = async function() {
    if (typeof window.uploadFotoProfilKeStorage !== "function") {
        return alert("⚠️ Mesin Firebase Storage belum siap. Silakan muat ulang halaman.");
    }

    let rawMap = window.leaderboardSiswaData || {};
    let targetKeys = Object.keys(rawMap).filter(function(k) {
        let item = rawMap[k];
        return item && typeof item.foto === "string" && item.foto.indexOf("data:image/") === 0;
    });

    if (targetKeys.length === 0) {
        window.perbaruiBannerMigrasiFotoAdmin();
        return alert("✅ Seluruh foto profil sudah ringan (tidak ada lagi Base64 di Realtime Database)!");
    }

    let btn = document.getElementById('btn-migrasi-foto-storage');
    if (btn) btn.disabled = true;

    let berhasil = 0;
    let gagal = 0;

    for (let i = 0; i < targetKeys.length; i++) {
        let uKey = targetKeys[i];
        let item = rawMap[uKey];
        if (btn) btn.innerText = '⏳ Memindahkan (' + (i + 1) + '/' + targetKeys.length + ')...';

        let blob = window.konversiDataUrlKeBlobAvatar(item.foto);
        if (!blob) {
            gagal++;
            continue;
        }

        await new Promise(function(resolve) {
            window.uploadFotoProfilKeStorage(blob, uKey, function(downloadUrl) {
                item.foto = downloadUrl;
                if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
                    window.simpanLeaderboardSiswaKeDB(uKey, item);
                }
                berhasil++;
                resolve();
            }, function(err) {
                console.warn("Gagal migrasi foto " + uKey + ":", err);
                gagal++;
                resolve();
            });
        });
    }

    window.perbaruiBannerMigrasiFotoAdmin();
    if (typeof window.renderTabelLeaderboard === "function") window.renderTabelLeaderboard();

    if (gagal > 0 && berhasil === 0) {
        alert("❌ Migrasi gagal (" + gagal + " akun). Pastikan Firebase Storage Rules sudah mengizinkan akses tulis ke folder profil_siswa.");
    } else {
        alert("✅ Selesai! " + berhasil + " foto profil berhasil dipindahkan ke Firebase Storage" + (gagal > 0 ? " (" + gagal + " gagal)" : "") + ". Kuota Download Leaderboard kini jauh lebih hemat!");
    }
};

window.kirimVerifikasiGmailProfil = function() {
    let email = document.getElementById('profil-input-gmail').value.trim().toLowerCase();
    let newPass = document.getElementById('profil-input-password-baru').value;
    let newUser = document.getElementById('profil-input-username-baru').value.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');
    
    if(!email || !newPass || !newUser) return alert("Isi Gmail, Username Baru, dan Password Baru terlebih dahulu!");
    if(newPass.length < 6) return alert("Password minimal 6 karakter sesuai standar keamanan.");
    if(newUser === "sbd" || newUser === "mahardika") return alert("Username tersebut tidak diizinkan.");
    
    let uName = sessionStorage.getItem("username");
    if(newUser !== uName && window.akunSiswaData && window.akunSiswaData[newUser]) {
        return alert("⚠️ Username baru sudah dipakai siswa lain. Gunakan nama lain.");
    }

    // Cek aturan 1 Gmail maksimal 5 akun
    let daftarAkunSamaGmail = Object.keys(window.akunSiswaData || {}).filter(function(k) {
        return k !== uName && window.akunSiswaData[k] && (window.akunSiswaData[k].gmail || "").toLowerCase() === email;
    });
    if (daftarAkunSamaGmail.length >= 5) {
        return alert("⚠️ Gmail ini sudah digunakan oleh 5 akun siswa lain (Maksimal 5 akun per Gmail).");
    }
    
    let statEl = document.getElementById('profil-status-gmail');
    statEl.innerText = "⏳ Memanggil Server Google..."; 
    statEl.style.background = "#f39c12"; statEl.style.color = "white";
    
    window.daftarkanEmailVerifikasiNyata(email, newPass, function(uid, isAlreadyVerified) {
        if(isAlreadyVerified) {
            statEl.innerText = "✅ Gmail Valid (Siap Disimpan)"; statEl.style.background = "#27ae60";
        } else {
            statEl.innerText = "📩 Link Dikirim! Cek Kotak Masuk Gmail."; statEl.style.background = "#e67e22";
            alert("Berhasil! Link verifikasi telah dikirim ke " + email + ". Klik link di Gmail Anda lalu tekan tombol '2. Simpan'.");
        }
        window.tempProfilKredensial = { email: email, newUser: newUser, newPass: newPass, forceVerified: isAlreadyVerified };
    }, function(err) {
        if (daftarAkunSamaGmail.length > 0 && daftarAkunSamaGmail.length < 5) {
            statEl.innerText = "✅ Gmail Terdaftar (Siap Disimpan)"; statEl.style.background = "#27ae60";
            window.tempProfilKredensial = { email: email, newUser: newUser, newPass: newPass, forceVerified: true };
            return;
        }
        statEl.innerText = "❌ Gagal: " + err.message; statEl.style.background = "#c0392b";
    });
};

window.terapkanGantiKredensialProfil = function() {
    let temp = window.tempProfilKredensial;
    if(!temp) return alert("Anda harus menekan tombol 'Kirim Link Verifikasi' (Nomor 1) terlebih dahulu!");
    
    let statEl = document.getElementById('profil-status-gmail');
    statEl.innerText = "⏳ Menyimpan...";

    function eksekusiSimpanKredensial() {
        let oldUName = sessionStorage.getItem("username");
        let akunLama = window.akunSiswaData[oldUName];
        let lbLama = window.leaderboardSiswaData[oldUName];
        
        akunLama.username = temp.newUser;
        akunLama.gmail = temp.email;
        akunLama.password = temp.newPass;
        
        if(temp.newUser !== oldUName) {
            window.akunSiswaData[temp.newUser] = akunLama;
            delete window.akunSiswaData[oldUName];
            
            if(lbLama) {
                window.leaderboardSiswaData[temp.newUser] = lbLama;
                delete window.leaderboardSiswaData[oldUName];
                if(typeof window.simpanLeaderboardSiswaKeDB === "function") window.simpanLeaderboardSiswaKeDB(temp.newUser, lbLama);
            }
        }
        if(typeof window.simpanSemuaAkunSiswaKeDB === "function") window.simpanSemuaAkunSiswaKeDB();
        
        statEl.innerText = "✅ Tersimpan!"; statEl.style.background = "#27ae60";
        alert("🔐 Data kredensial berhasil diperbarui! Silakan login ulang menggunakan Username: " + temp.newUser);
        setTimeout(function() { window.prosesLogoutSistem(true); }, 1200);
    }

    if (temp.forceVerified) {
        eksekusiSimpanKredensial();
        return;
    }
    
    window.cekStatusVerifikasiGmail(temp.email, temp.newPass, function(isVerified) {
        if(isVerified) {
            eksekusiSimpanKredensial();
        } else {
            statEl.innerText = "❌ Belum Diverifikasi"; statEl.style.background = "#c0392b";
            alert("Sistem mendeteksi Anda belum mengklik link konfirmasi di kotak masuk Gmail Anda.");
        }
    });
};

// 6. Mesin Papan Peringkat (Leaderboard Filterable dengan Skeleton Loading)
window.bukaModalLeaderboard = function() {
    document.getElementById('lb-filter-cakupan').value = 'semua';
    document.getElementById('lb-box-subfilter').style.display = 'none';

    let cont = document.getElementById('leaderboard-list-container');
    let belumPernahTarikPenuh = !window._lastFullLBFetchTime;
    if (cont && belumPernahTarikPenuh && typeof window.buatHTMLSkeleton === 'function') {
        cont.innerHTML = window.buatHTMLSkeleton('leaderboard', 5);
    } else {
        window.renderTabelLeaderboard();
        if (typeof window.perbaruiBannerMigrasiFotoAdmin === 'function') window.perbaruiBannerMigrasiFotoAdmin();
    }

    window.bukaModal('modal-leaderboard');
    if (belumPernahTarikPenuh && typeof window.muatLeaderboardPenuhSekali === 'function') {
        window.muatLeaderboardPenuhSekali(function() {
            window.renderTabelLeaderboard();
            if (typeof window.perbaruiBannerMigrasiFotoAdmin === 'function') window.perbaruiBannerMigrasiFotoAdmin();
        }, false);
    }
};

window.ubahFilterLeaderboard = function() {
    let val = document.getElementById('lb-filter-cakupan').value;
    let boxSub = document.getElementById('lb-box-subfilter');
    let lblSub = document.getElementById('lb-label-subfilter');
    let selSub = document.getElementById('lb-select-subfilter');
    
    if (val === 'semua') {
        boxSub.style.display = 'none';
    } else if (val === 'angkatan') {
        boxSub.style.display = 'block';
        lblSub.innerText = "Pilih Angkatan:";
        selSub.innerHTML = '<option value="X">Kelas X</option><option value="XI">Kelas XI</option><option value="XII">Kelas XII</option>';
    } else if (val === 'kelas') {
        boxSub.style.display = 'block';
        lblSub.innerText = "Pilih Kelas Spesifik:";
        let htmlKls = '';
        Object.keys(window.adminData || {}).sort().forEach(k => htmlKls += `<option value="${k}">${k}</option>`);
        selSub.innerHTML = htmlKls;
    }
    window.renderTabelLeaderboard();
};


// 7. Pusat Notifikasi (Mendukung Notifikasi Tugas Siswa & Notifikasi Kalender Pengingat Admin)
window.notifikasiSiswaDismissed = JSON.parse(localStorage.getItem("dismissed_notif_" + (sessionStorage.getItem("username") || "admin")) || "[]");

window.ambilPengingatKalenderAdmin = function() {
    let hasil = [];
    if (!window.adminJadwalKalenderData || !window.adminJadwalKalenderData.events) return hasil;

    let now = new Date();
    let todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

    let eventsMap = window.adminJadwalKalenderData.events;
    Object.keys(eventsMap).sort().forEach(function(dateKey) {
        // Tampilkan agenda hari ini dan yang akan datang (atau maksimal 3 hari ke belakang jika belum di-dismiss)
        let diffDays = Math.floor((new Date(dateKey + 'T00:00:00') - new Date(todayStr + 'T00:00:00')) / (1000 * 60 * 60 * 24));
        if (diffDays >= -1 && diffDays <= 14) {
            let arr = Array.isArray(eventsMap[dateKey]) ? eventsMap[dateKey] : Object.values(eventsMap[dateKey] || {});
            arr.forEach(function(ev) {
                let idEv = ev.id || ('cal_' + dateKey + '_' + ev.title);
                if (!window.notifikasiSiswaDismissed.includes(idEv)) {
                    let statusHari = diffDays === 0 ? "🔴 HARI INI" : (diffDays === 1 ? "🟠 BESOK" : (diffDays < 0 ? "⚪ KEMARIN" : "🗓️ " + dateKey));
                    hasil.push({
                        id: idEv,
                        tipe: 'kalender_admin',
                        judul: statusHari + (ev.jam ? " (" + ev.jam + ")" : "") + " — " + ev.title,
                        isi: "Pengingat Kalender Guru pada tanggal <b>" + dateKey + "</b>" + (ev.jam ? " pukul <b>" + ev.jam + "</b>" : "") + ": " + ev.title,
                        tanggal: dateKey
                    });
                }
            });
        }
    });
    return hasil;
};

window.hitungDanUpdateBadgeNotifikasi = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let uName = sessionStorage.getItem("username");
    let badge = document.getElementById("badge-header-notif");
    if (!badge) return;

    // A. JIKA ADMIN / GURU YANG LOGIN: Hitung pengingat dari Kalender Agenda Guru
    if (stat === "admin") {
        let listKalAdmin = window.ambilPengingatKalenderAdmin();
        if (listKalAdmin.length > 0) {
            badge.innerText = listKalAdmin.length;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
        return;
    }

    // B. JIKA SISWA YANG LOGIN:
    if (stat !== "siswa" || !uName || !window.akunSiswaData || !window.akunSiswaData[uName]) {
        badge.style.display = 'none';
        return;
    }
    
    let kls = window.akunSiswaData[uName].kelas;
    let countUnread = 0;
    
    (window.adminNotifikasiData || []).forEach(n => {
        if ((n.kelas === "Semua" || n.kelas === kls) && !window.notifikasiSiswaDismissed.includes(n.id)) {
            countUnread++;
        }
    });
    
    let rekapKelas = (window.adminRekapNilaiData && window.adminRekapNilaiData[kls]) ? window.adminRekapNilaiData[kls] : null;
    if (rekapKelas) {
        Object.keys(rekapKelas).forEach(paket => {
            let idAuto = "auto_ujian_" + paket.replace(/\s/g, '_');
            let dataPaket = rekapKelas[paket] || {};
            if (Object.keys(dataPaket).length > 0 && !dataPaket[window.akunSiswaData[uName].namaLengkap] && !window.notifikasiSiswaDismissed.includes(idAuto)) {
                countUnread++;
            }
        });
    }
    
    if (countUnread > 0) {
        badge.innerText = countUnread;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
};

window.bukaModalNotifikasiSiswa = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let container = document.getElementById('list-notifikasi-siswa-container');
    if (!container) return;

    // A. JIKA ADMIN / GURU YANG MEMBUKA LONCENG NOTIFIKASI: Tampilkan Pengingat Kalender Guru
    if (stat === "admin") {
        let listKalAdmin = window.ambilPengingatKalenderAdmin();
        let html = `<div style="display:flex; justify-content:space-between; align-items:center; background:#eaf2f8; padding:10px 14px; border-radius:8px; border-left:4px solid #2980b9; margin-bottom:6px;">
                        <span style="font-size:12px; font-weight:bold; color:#0b3954;">🗓️ Pengingat Kalender Agenda Guru</span>
                        <button type="button" class="btn-action" style="background:#e67e22; width:auto; padding:5px 12px; font-size:11px;" onclick="window.tutupModal('modal-notifikasi-siswa'); window.bukaModalJadwalGuru();">+ Buka Kalender</button>
                    </div>`;
        if (listKalAdmin.length === 0) {
            html += '<div style="text-align:center; padding:30px; color:#94a3b8; font-style:italic;">Belum ada pengingat agenda terdekat di Kalender Guru Anda.</div>';
        } else {
            listKalAdmin.forEach(function(item) {
                html += `
                <div style="background:#ffffff; border:1px solid #fed7aa; border-left:4px solid #f97316; padding:14px; border-radius:8px; position:relative; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                    <button type="button" onclick="window.tutupNotifikasiSiswa('${item.id}')" style="position:absolute; top:10px; right:10px; background:#e2e8f0; color:#64748b; border:none; width:26px; height:26px; border-radius:50%; font-size:12px; font-weight:bold; cursor:pointer;" title="Tandai selesai">✕</button>
                    <div style="font-weight:bold; font-size:14px; color:#9a3412; margin-bottom:4px; padding-right:25px;">${item.judul}</div>
                    <div style="font-size:12px; color:#475569;">${item.isi}</div>
                </div>`;
            });
        }
        container.innerHTML = html;
        window.bukaModal('modal-notifikasi-siswa');
        return;
    }

    if(stat !== "siswa") return alert("Silakan login terlebih dahulu untuk membuka pusat notifikasi.");
    
    let uName = sessionStorage.getItem("username");
    let kls = window.akunSiswaData[uName].kelas;
    let arrNotifGabungan = [];
    
    (window.adminNotifikasiData || []).forEach(n => {
        if ((n.kelas === "Semua" || n.kelas === kls) && !window.notifikasiSiswaDismissed.includes(n.id)) {
            arrNotifGabungan.push({
                id: n.id, tipe: 'admin', judul: n.judul, isi: n.isi, tanggal: n.tanggal
            });
        }
    });
    
    let rekapKelas = (window.adminRekapNilaiData && window.adminRekapNilaiData[kls]) ? window.adminRekapNilaiData[kls] : null;
    if (rekapKelas) {
        Object.keys(rekapKelas).forEach(paket => {
            let idAuto = "auto_ujian_" + paket.replace(/\s/g, '_');
            let dataPaket = rekapKelas[paket] || {};
            if (Object.keys(dataPaket).length > 0 && !dataPaket[window.akunSiswaData[uName].namaLengkap] && !window.notifikasiSiswaDismissed.includes(idAuto)) {
                arrNotifGabungan.push({
                    id: idAuto, tipe: 'sistem', 
                    judul: "🎯 Ujian Belum Dikerjakan", 
                    isi: `Sebagian besar teman di kelas <b>${kls}</b> telah menyelesaikan ujian <b>${paket}</b>, sedangkan Anda belum mengerjakannya. Harap segera diselesaikan!`, 
                    tanggal: new Date().toISOString()
                });
            }
        });
    }
    
    if(arrNotifGabungan.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:30px; color:#94a3b8; font-style:italic;">Hore! Anda tidak memiliki tugas atau notifikasi yang tertunda.</div>';
    } else {
        arrNotifGabungan.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        let html = '';
        arrNotifGabungan.forEach(item => {
            let bg = item.tipe === 'sistem' ? '#fdf2f2' : '#ffffff';
            let border = item.tipe === 'sistem' ? '#fadbd8' : '#e2e8f0';
            let ikon = item.tipe === 'sistem' ? '⚠️' : '📢';
            
            html += `
            <div style="background:${bg}; border:1px solid ${border}; padding:14px; border-radius:8px; position:relative; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <button type="button" onclick="window.tutupNotifikasiSiswa('${item.id}')" style="position:absolute; top:10px; right:10px; background:#e2e8f0; color:#64748b; border:none; width:26px; height:26px; border-radius:50%; font-size:12px; font-weight:bold; cursor:pointer;" title="Tandai sudah dibaca">✕</button>
                <div style="font-weight:bold; font-size:15px; color:#1e293b; margin-bottom:6px; padding-right:25px;">${ikon} ${item.judul}</div>
                <div class="content-block" style="font-size:13px; color:#475569; min-height:0; padding:0; border:none; max-width:100%; box-shadow:none;">${item.isi}</div>
            </div>`;
        });
        container.innerHTML = html;
    }
    window.bukaModal('modal-notifikasi-siswa');
};

window.tutupNotifikasiSiswa = function(id) {
    window.notifikasiSiswaDismissed.push(id);
    localStorage.setItem("dismissed_notif_" + (sessionStorage.getItem("username") || "admin"), JSON.stringify(window.notifikasiSiswaDismissed));
    window.hitungDanUpdateBadgeNotifikasi();
    window.bukaModalNotifikasiSiswa();
};

// 8. Dasbor Editor Notifikasi (Khusus Admin)
window.kirimNotifikasiAdminKeSiswa = function() {
    let kls = document.getElementById('notif-admin-target-kelas').value;
    let judul = document.getElementById('notif-admin-judul').value.trim();
    let htmlIsi = document.getElementById('notif-admin-editor').innerHTML;
    
    if(!kls || !judul || htmlIsi.trim() === "" || htmlIsi.indexOf('Ketik isi notifikasi') !== -1) return alert("Pilih kelas, isi judul, dan lengkapi konten notifikasi!");
    
    if(!window.adminNotifikasiData) window.adminNotifikasiData = [];
    window.adminNotifikasiData.push({
        id: 'notif_' + Date.now(),
        kelas: kls,
        judul: judul,
        isi: htmlIsi,
        tanggal: new Date().toISOString()
    });
    
    document.getElementById('notif-admin-judul').value = "";
    document.getElementById('notif-admin-editor').innerHTML = "Ketik isi notifikasi, tugas, atau sisipkan tombol menuju halaman materi...";
    
    if(typeof window.simpanNotifikasiAdminKeDB === "function") window.simpanNotifikasiAdminKeDB();
    window.renderDaftarNotifAdmin();
    alert("✅ Notifikasi berhasil diterbitkan ke lonceng siswa " + kls);
};

window.renderDaftarNotifAdmin = function() {
    let container = document.getElementById('list-notif-admin-aktif');
    if(!container) return;
    
    let data = window.adminNotifikasiData || [];
    if(data.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#7f8c8d; font-size:12px; background:#f8f9fa; border-radius:6px; border:1px dashed #ccc;">Belum ada notifikasi manual yang diterbitkan.</div>';
        return;
    }
    
    let html = '';
    [...data].reverse().forEach((n, idx) => {
        let oriIdx = data.length - 1 - idx;
        html += `
        <div style="background:#ffffff; border:1px solid #cbd5e1; border-left:4px solid #2980b9; padding:10px 12px; border-radius:6px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                <div>
                    <span style="background:#0b3954; color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:bold; margin-right:6px;">${n.kelas}</span>
                    <strong style="font-size:13px; color:#1e293b;">${n.judul}</strong>
                </div>
                <button type="button" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:14px;" onclick="window.hapusNotifikasiAdmin(${oriIdx})" title="Cabut Notifikasi">🗑️</button>
            </div>
            <div style="font-size:11px; color:#64748b; max-height:35px; overflow:hidden; text-overflow:ellipsis;">${n.isi.replace(/<[^>]*>?/gm, ' ')}</div>
        </div>`;
    });
    container.innerHTML = html;
};

window.hapusNotifikasiAdmin = function(idx) {
    if(confirm("Yakin ingin mencabut notifikasi ini dari akun semua siswa?")) {
        window.adminNotifikasiData.splice(idx, 1);
        if(typeof window.simpanNotifikasiAdminKeDB === "function") window.simpanNotifikasiAdminKeDB();
        window.renderDaftarNotifAdmin();
    }
};

window.uploadGambarNotifAdmin = function(input) {
    let f = input.files && input.files[0];
    if(!f) return;
    window.kompresGambar(f, function(dataUrl) {
        document.getElementById('notif-admin-editor').focus();
        document.execCommand("insertImage", false, dataUrl);
    });
    input.value = "";
};

window.sisipkanLinkNotifAdmin = function() {
    let url = prompt("Masukkan Link (URL) Tujuan:", "https://");
    if(url) {
        document.getElementById('notif-admin-editor').focus();
        document.execCommand("createLink", false, url);
    }
};

window.sisipkanButtonNotifAdmin = function() {
    let txt = prompt("Teks Tombol:", "Buka Latihan");
    let url = prompt("Link Tujuan Tombol:", "https://");
    if(txt && url) {
        let html = `<a href="${url}" class="custom-site-btn" style="padding:6px 14px; font-size:12px; margin:6px 0; display:inline-block; background:#e67e22;">${txt}</a>`;
        document.getElementById('notif-admin-editor').focus();
        document.execCommand("insertHTML", false, html);
    }
};

const modalAdminObserverNotif = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
        if(m.target.id === 'modal-administrasi' && m.target.style.display === 'flex') {
            let sel = document.getElementById('notif-admin-target-kelas');
            if(sel) {
                let html = '<option value="Semua">📢 Semua Kelas & Angkatan</option>';
                Object.keys(window.adminData || {}).sort().forEach(k => html += `<option value="${k}">🏫 Kelas ${k}</option>`);
                sel.innerHTML = html;
            }
        }
    });
});
if(document.getElementById('modal-administrasi')) {
    modalAdminObserverNotif.observe(document.getElementById('modal-administrasi'), { attributes: true, attributeFilter: ['style'] });
}


/* =========================================================================
   MODUL KEAMANAN ANTI-AI LATIHAN (POP-UP 5 DETIK FADE-OUT), ZOOM TEKS (+/-),
   DARK MODE, SINKRONISASI CONTENT BLOCK HP 100%, & PROTEKSI ANTI-INSPECT
   ========================================================================= */

// 1. CEK APAKAH RUANG LATIHAN SEDANG AKTIF
window.apakahRuangLatihanAktif = function() {
    let r = document.getElementById("temporary-quiz-room");
    return Boolean(r && r.style.display && r.style.display !== "none");
};

// 2. POP-UP PERINGATAN ANTI-AI SELAMA 5 DETIK YANG PERLAHAN MENGHILANG (FADE-OUT)
window.tampilkanPeringatanAntiAILatihan = function(pesanKhusus) {
    let existing = document.getElementById("anti-ai-warning-popup");
    if (existing) existing.remove();
    clearTimeout(window._antiAiPopupTimer1);
    clearTimeout(window._antiAiPopupTimer2);

    let popup = document.createElement("div");
    popup.id = "anti-ai-warning-popup";
    popup.className = "anti-ai-warning-toast";
    popup.innerHTML =
        '<div style="font-size:28px; line-height:1;">🚫🤖</div>' +
        '<div style="text-align:left;">' +
            '<div style="font-weight:900; font-size:14px; color:#fef08a; letter-spacing:0.3px;">PERINGATAN KEAMANAN RUANG LATIHAN</div>' +
            '<div style="font-size:12px; color:#ffffff; margin-top:2px; line-height:1.4;">' +
                (pesanKhusus || "Dilarang menggunakan bantuan AI, menyalin soal, atau membuka ekstensi AI selama berada di Ruang Latihan Mandiri!") +
            '</div>' +
        '</div>';
    document.body.appendChild(popup);

    // Mulai memudar perlahan dan hilang tepat setelah 5 detik
    window._antiAiPopupTimer1 = setTimeout(function() {
        if (popup) popup.classList.add("fade-out-slow");
    }, 3200);
    window._antiAiPopupTimer2 = setTimeout(function() {
        if (popup && popup.parentNode) popup.remove();
    }, 5000);
};

// Blokir AI Tutor saat Ruang Latihan Aktif
const _asliTanyaAIText = window.tanyaAIText;
window.tanyaAIText = function() {
    if (window.apakahRuangLatihanAktif() || window.isStrictUjianActive) {
        let aiBox = document.getElementById("ai-tutor-box");
        if (aiBox) aiBox.style.display = "none";
        window.tampilkanPeringatanAntiAILatihan("Fitur AI Assistant dikunci selama sesi latihan berlangsung!");
        return;
    }
    if (_asliTanyaAIText) _asliTanyaAIText();
};

const _asliKirimPesanAI = window.kirimPesanAI;
window.kirimPesanAI = function() {
    if (window.apakahRuangLatihanAktif() || window.isStrictUjianActive) {
        let aiBox = document.getElementById("ai-tutor-box");
        if (aiBox) aiBox.style.display = "none";
        window.tampilkanPeringatanAntiAILatihan("Fitur AI Assistant tidak dapat digunakan saat mengerjakan latihan!");
        return;
    }
    if (_asliKirimPesanAI) _asliKirimPesanAI();
};

// Deteksi Copy Soal / Klik Kanan / Pindah ke Tab AI saat Ruang Latihan Aktif
document.addEventListener("copy", function(e) {
    if (window.apakahRuangLatihanAktif() && !window.isAdminSession()) {
        e.preventDefault();
        window.tampilkanPeringatanAntiAILatihan("Menyalin (Copy) teks soal latihan dilarang untuk mencegah penggunaan AI!");
    }
});

document.addEventListener("paste", function(e) {
    if (window.apakahRuangLatihanAktif() && !window.isAdminSession()) {
        let tag = (e.target && e.target.tagName) ? e.target.tagName : "";
        if (tag === "INPUT" || tag === "TEXTAREA") {
            e.preventDefault();
            window.tampilkanPeringatanAntiAILatihan("Menempel (Paste) jawaban dari luar/AI ke dalam kolom latihan tidak diizinkan!");
        }
    }
});

// Sembunyikan AI Box otomatis setiap kali Ruang Latihan dibuka
if (typeof window.bukaRuangLatihan === "function") {
    const _asliBukaRuangLatihan = window.bukaRuangLatihan;
    window.bukaRuangLatihan = function() {
        let aiBox = document.getElementById("ai-tutor-box");
        if (aiBox) aiBox.style.display = "none";
        _asliBukaRuangLatihan();
    };
}

// 3. TOMBOL ZOOM LAYAR KESELURUHAN (OTOMATIS 100% DI HP AGAR TIDAK TER-ZOOM)
window.currentTextZoomPct = parseInt(localStorage.getItem("user_text_zoom_pct") || "100", 10);
if (isNaN(window.currentTextZoomPct) || window.currentTextZoomPct < 50 || window.currentTextZoomPct > 200 || window.innerWidth <= 768) {
    window.currentTextZoomPct = 100;
    if (window.innerWidth <= 768) {
        try { localStorage.removeItem("user_text_zoom_pct"); } catch (e) {}
    }
}

window.terapkanZoomTeksGlobal = function(tampilkanInfo) {
    if (window.innerWidth <= 768) {
        window.currentTextZoomPct = 100;
        document.documentElement.style.setProperty("--user-page-zoom", "1");
        document.documentElement.style.setProperty("--user-font-scale", "1");
        return;
    }
    let scaleVal = (window.currentTextZoomPct / 100).toFixed(2);
    document.documentElement.style.setProperty("--user-page-zoom", scaleVal);
    document.documentElement.style.setProperty("--user-font-scale", "1");

    let btnIn = document.getElementById("btn-zoom-in-global");
    let btnOut = document.getElementById("btn-zoom-out-global");
    if (btnIn) btnIn.title = "Perbesar Tampilan Layar (" + window.currentTextZoomPct + "%)";
    if (btnOut) btnOut.title = "Perkecil Tampilan Layar (" + window.currentTextZoomPct + "%)";

    if (tampilkanInfo) {
        let badge = document.getElementById("zoom-level-indicator-toast");
        if (!badge) {
            badge = document.createElement("div");
            badge.id = "zoom-level-indicator-toast";
            badge.style.cssText = "position:fixed; bottom:215px; right:70px; background:#0b3954; color:#f1c40f; padding:6px 14px; border-radius:20px; font-family:'Poppins',sans-serif; font-size:12px; font-weight:800; z-index:9500; box-shadow:0 4px 12px rgba(0,0,0,0.25); border:1px solid #f1c40f; pointer-events:none; transition:opacity 0.25s;";
            document.body.appendChild(badge);
        }
        badge.innerText = "🔍 Zoom Layar: " + window.currentTextZoomPct + "%";
        badge.style.opacity = "1";
        clearTimeout(window._zoomToastTimer);
        window._zoomToastTimer = setTimeout(function() {
            if (badge) badge.style.opacity = "0";
        }, 1400);
    }
    window.optimalkanContentBlockUntukLayarHP();
    if (typeof window.inisialisasiSemuaCanvas === "function") {
        setTimeout(window.inisialisasiSemuaCanvas, 120);
    }
};

window.ubahZoomTeksGlobal = function(arah) {
    let step = 10;
    let nextPct = window.currentTextZoomPct + (arah * step);
    if (nextPct < 50) nextPct = 50;
    if (nextPct > 200) nextPct = 200;
    window.currentTextZoomPct = nextPct;
    localStorage.setItem("user_text_zoom_pct", String(nextPct));
    window.terapkanZoomTeksGlobal(true);
};

// 4. SINKRONISASI TAMPILAN CONTENT BLOCK LAPTOP VS HP (100% UTUH & TIDAK TERPOTONG)
window.optimalkanContentBlockUntukLayarHP = function() {
    let isMobileScreen = window.innerWidth <= 768;
    document.querySelectorAll(".content-block").forEach(function(blok) {
        // Pastikan semua tabel di dalam Content Block tidak pernah memotong layar HP
        blok.querySelectorAll("table").forEach(function(tbl) {
            if (!tbl.parentElement.classList.contains("responsive-table-scroll-box")) {
                let wrap = document.createElement("div");
                wrap.className = "responsive-table-scroll-box";
                wrap.style.cssText = "width:100%; max-width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; margin:10px 0;";
                tbl.parentNode.insertBefore(wrap, tbl);
                wrap.appendChild(tbl);
            }
        });

        // Pastikan elemen yang memiliki width pixel tetap (misal dari copy-paste Word) menyesuaikan 100% layar HP
        if (isMobileScreen) {
            blok.querySelectorAll("[style*='width']").forEach(function(el) {
                if (el.tagName === "IMG" || el.tagName === "DIV" || el.tagName === "TABLE" || el.tagName === "P") {
                    let wPx = parseFloat(el.style.width);
                    if (!isNaN(wPx) && el.style.width.indexOf("px") !== -1 && wPx > (window.innerWidth - 32)) {
                        el.style.maxWidth = "100%";
                        el.style.width = "100%";
                        el.style.boxSizing = "border-box";
                    }
                }
            });
        }
    });
};

window.addEventListener("resize", function() {
    clearTimeout(window._hpFitTimer);
    window._hpFitTimer = setTimeout(window.optimalkanContentBlockUntukLayarHP, 150);
});

// 5. MODE GELAP / DARK MODE GLOBAL
window.toggleDarkModeGlobal = function(forceState) {
    let isDark = typeof forceState === "boolean"
        ? forceState
        : !document.body.classList.contains("dark-mode-active");

    if (isDark) {
        document.body.classList.add("dark-mode-active");
        localStorage.setItem("pref_dark_mode", "true");
    } else {
        document.body.classList.remove("dark-mode-active");
        localStorage.setItem("pref_dark_mode", "false");
    }

    let btnDark = document.getElementById("btn-darkmode-global");
    if (btnDark) {
        btnDark.innerText = isDark ? "☀️" : "🌙";
        btnDark.title = isDark ? "Kembali ke Mode Terang (Light Mode)" : "Aktifkan Mode Gelap (Dark Mode)";
    }
};

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("pref_dark_mode") === "true") {
        window.toggleDarkModeGlobal(true);
    }
    window.terapkanZoomTeksGlobal(false);
    setTimeout(window.optimalkanContentBlockUntukLayarHP, 600);

    let cont = document.getElementById("blocks-container");
    if (cont) {
        let obsFit = new MutationObserver(function() {
            window.optimalkanContentBlockUntukLayarHP();
        });
        obsFit.observe(cont, { childList: true });
    }
});

// 6. LAPISAN KEAMANAN ANTI-HACK & ANTI-INSPECT ELEMENT (KHUSUS NON-ADMIN)
document.addEventListener("contextmenu", function(e) {
    if (typeof window.isAdminSession === "function" && window.isAdminSession()) return;
    e.preventDefault();
});

document.addEventListener("keydown", function(e) {
    if (typeof window.isAdminSession === "function" && window.isAdminSession()) return;

    let key = (e.key || "").toUpperCase();
    let ctrlOrCmd = e.ctrlKey || e.metaKey;
    let shiftOrAlt = e.shiftKey || e.altKey;

    // Blokir F12, Ctrl+Shift+I/J/C/K, Cmd+Option+I/J/C/U, dan Ctrl+U (View Source)
    if (
        e.key === "F12" ||
        (ctrlOrCmd && shiftOrAlt && (key === "I" || key === "J" || key === "C" || key === "K")) ||
        (ctrlOrCmd && key === "U")
    ) {
        e.preventDefault();
        e.stopPropagation();
        window.tampilkanPeringatanAntiAILatihan("🔒 Sistem Keamanan Aktif: Inspect Element & Console Developer dikunci untuk menjaga integritas belajar!");
        return false;
    }
}, true);

// 7. MONITORING KETAT LAYAR LATIHAN (ANTI SPLIT-SCREEN & APLIKASI PIHAK KE-3)
// Radar mengecek layar setiap 4 detik. Karena pop-up bertahan 5 detik, 
// pop-up tidak akan pernah hilang (terus menutupi layar) selama siswa berbuat curang!
setInterval(function() {
    if (window.apakahRuangLatihanAktif() && !window.isAdminSession()) {
        let isFull = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
        
        // Jika tidak fullscreen, berarti siswa mencoba membuka aplikasi lain / Split Screen
        if (!isFull) {
            window.tampilkanPeringatanAntiAILatihan("⚠️ LAYAR TIDAK PENUH! Tutup aplikasi lain (Split Screen) atau AI. Harap kembali ke mode Layar Penuh agar latihan tidak terganggu!");
        }
    }
}, 4000);

// Ubah seluruh alert() menjadi Modal Web secara otomatis
window.alert = function(pesan) {
    if (typeof window.tampilkanCustomDialog === "function") {
        window.tampilkanCustomDialog("alert", String(pesan || ""), null, null);
    } else if (window._originalAlert) {
        window._originalAlert(pesan);
    }
};

/* =========================================================================
   8. MESIN REGISTRASI PWA & TOMBOL INSTALL OTOMATIS (ANDROID, IOS, & DESKTOP)
   ========================================================================= */
window._deferredPWAPrompt = null;

window.apakahSudahModeAplikasiPWA = function() {
    return Boolean(
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true
    );
};

window.perbaruiVisibilitasTombolPWA = function() {
    let btn = document.getElementById('btn-header-install-pwa');
    if (!btn) return;

    // Jika sudah dibuka sebagai aplikasi terinstal, sembunyikan tombol Install
    if (window.apakahSudahModeAplikasiPWA()) {
        btn.style.display = 'none';
        return;
    }

    let isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent || '') ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Munculkan tombol jika browser mendukung prompt otomatis ATAU jika menggunakan iPhone/iPad
    if (window._deferredPWAPrompt || isIOS) {
        btn.style.display = 'flex';
    }
};

// 1. Daftarkan Service Worker & Mesin Banner Update Otomatis PWA
window._pwaRegistrationAktif = null;
window._pwaRefreshingPage = false;
window._lastPwaUpdateCheckMs = 0;

window.tampilkanBannerUpdatePWA = function(reg) {
    // Jangan pernah mengganggu siswa saat ruang ujian ketat sedang berjalan
    if (window.isStrictUjianActive) return;
    if (!reg || !reg.waiting) return;

    window._pwaRegistrationAktif = reg;

    let existing = document.getElementById('pwa-update-banner');
    if (existing) {
        existing.style.display = 'flex';
        return;
    }

    let banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.className = 'pwa-update-banner';
    banner.innerHTML =
        '<div class="pwa-update-info">' +
            '<span class="pwa-update-icon">✨</span>' +
            '<div class="pwa-update-text">' +
                '<strong>Pembaruan Tersedia</strong>' +
                '<span>Versi terbaru aplikasi siap dipasang.</span>' +
            '</div>' +
        '</div>' +
        '<div class="pwa-update-actions">' +
            '<button type="button" id="btn-pwa-apply-update" class="pwa-update-btn-now" onclick="window.terapkanUpdatePWA()">🔄 Perbarui</button>' +
            '<button type="button" class="pwa-update-btn-close" onclick="window.tutupBannerUpdatePWA()" title="Tutup sementara">✕</button>' +
        '</div>';

    document.body.appendChild(banner);
};

window.tutupBannerUpdatePWA = function() {
    let banner = document.getElementById('pwa-update-banner');
    if (banner) banner.style.display = 'none';
};

window.terapkanUpdatePWA = function() {
    if (window.isStrictUjianActive) return;

    let reg = window._pwaRegistrationAktif;
    let btn = document.getElementById('btn-pwa-apply-update');
    if (btn) {
        btn.disabled = true;
        btn.innerText = '⏳ Memperbarui...';
    }

    if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        // Pengaman jika browser tidak memicu controllerchange dalam 3 detik
        setTimeout(function() {
            if (!window._pwaRefreshingPage) {
                window._pwaRefreshingPage = true;
                window.location.reload();
            }
        }, 3000);
    } else {
        window.location.reload();
    }
};

window.pantauUpdateServiceWorker = function(reg) {
    if (!reg) return;
    window._pwaRegistrationAktif = reg;

    // Jika versi baru sudah selesai diunduh dan sedang menunggu
    if (reg.waiting && navigator.serviceWorker.controller) {
        window.tampilkanBannerUpdatePWA(reg);
    }

    // Tangkap ketika Service Worker baru mulai terdeteksi di latar belakang
    reg.addEventListener('updatefound', function() {
        let newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', function() {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                window.tampilkanBannerUpdatePWA(reg);
            }
        });
    });
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').then(function(reg) {
            window._lastPwaUpdateCheckMs = Date.now();
            window.perbaruiVisibilitasTombolPWA();
            window.pantauUpdateServiceWorker(reg);

            // Cek pembaruan otomatis saat siswa membuka kembali aplikasi (cooldown 10 menit)
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible' && !window.isStrictUjianActive) {
                    let now = Date.now();
                    if (now - window._lastPwaUpdateCheckMs >= 600000) {
                        window._lastPwaUpdateCheckMs = now;
                        reg.update().catch(function() {});
                    } else if (reg.waiting && navigator.serviceWorker.controller) {
                        window.tampilkanBannerUpdatePWA(reg);
                    }
                }
            });
        }).catch(function(err) {
            console.warn('Service Worker gagal dimuat:', err);
        });
    });

    // Muat ulang otomatis begitu Service Worker versi baru resmi mengambil alih
    navigator.serviceWorker.addEventListener('controllerchange', function() {
        if (window._pwaRefreshingPage || window.isStrictUjianActive) return;
        window._pwaRefreshingPage = true;
        window.location.reload();
    });
}

// 2. Tangkap sinyal instalasi dari Chrome/Edge (Android, Windows, MacBook)
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    window._deferredPWAPrompt = e;
    window.perbaruiVisibilitasTombolPWA();
});

// 3. Sembunyikan tombol begitu aplikasi selesai diinstal
window.addEventListener('appinstalled', function() {
    window._deferredPWAPrompt = null;
    let btn = document.getElementById('btn-header-install-pwa');
    if (btn) btn.style.display = 'none';
});

// 4. Aksi saat siswa/guru menekan tombol "📲 Install App"
window.klikInstallAplikasiPWA = async function() {
    if (window._deferredPWAPrompt) {
        window._deferredPWAPrompt.prompt();
        let choiceResult = await window._deferredPWAPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
            window._deferredPWAPrompt = null;
            let btn = document.getElementById('btn-header-install-pwa');
            if (btn) btn.style.display = 'none';
        }
        return;
    }

    // Panduan otomatis khusus untuk pengguna Safari di iPhone & iPad
    let isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent || '') ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) {
        alert(
            "📲 CARA INSTALL APLIKASI DI IPHONE / IPAD:\n" +
            "----------------------------------------\n" +
            "1. Pastikan Anda membuka halaman ini di browser SAFARI.\n" +
            "2. Ketuk ikon SHARE (Kotak dengan panah ke atas ⬆️ di bar Safari).\n" +
            "3. Geser ke bawah lalu pilih 'Tambahkan ke Layar Utama' (Add to Home Screen ➕).\n" +
            "4. Ketuk 'Tambah' di pojok kanan atas.\n\n" +
            "Aplikasi Mahardika akan langsung muncul di layar utama Anda!"
        );
    } else {
        alert("📲 Untuk memasang aplikasi di Laptop/PC, klik ikon 'Install' (komputer dengan panah ke bawah) di sisi kanan kolom URL browser Chrome/Edge Anda.");
    }
};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(window.perbaruiVisibilitasTombolPWA, 800);
});

/* =========================================================================
   9. GENERATOR SKELETON LOADING UNIVERSAL (MATERI, LEADERBOARD, & TABEL)
   ========================================================================= */
window.buatHTMLSkeleton = function(tipe, jumlah) {
    let count = Math.max(1, parseInt(jumlah, 10) || 2);
    let html = '';

    if (tipe === 'materi') {
        for (let i = 0; i < count; i++) {
            html +=
                '<div class="sk-materi-card">' +
                    '<div class="sk-materi-head">' +
                        '<div class="sk-box sk-circle-sm"></div>' +
                        '<div class="sk-box sk-line" style="width:48%; height:16px;"></div>' +
                    '</div>' +
                    '<div class="sk-materi-body">' +
                        '<div class="sk-box sk-line" style="width:94%;"></div>' +
                        '<div class="sk-box sk-line" style="width:86%;"></div>' +
                        '<div class="sk-box sk-line" style="width:72%;"></div>' +
                        '<div class="sk-box sk-rect-media"></div>' +
                        '<div class="sk-box sk-line" style="width:90%;"></div>' +
                        '<div class="sk-box sk-line" style="width:62%;"></div>' +
                    '</div>' +
                '</div>';
        }
        return html;
    }

    if (tipe === 'leaderboard') {
        for (let i = 0; i < count; i++) {
            html +=
                '<div class="sk-lb-card">' +
                    '<div class="sk-box sk-circle-md"></div>' +
                    '<div style="flex:1; display:flex; flex-direction:column; gap:8px;">' +
                        '<div class="sk-box sk-line" style="width:55%; height:14px;"></div>' +
                        '<div class="sk-box sk-line" style="width:38%; height:11px;"></div>' +
                        '<div class="sk-box sk-line" style="width:70%; height:11px;"></div>' +
                    '</div>' +
                    '<div class="sk-box sk-pill-sm"></div>' +
                '</div>';
        }
        return html;
    }

    if (tipe === 'table-row') {
        let cols = Math.max(2, count);
        html += '<tr class="sk-table-row">';
        for (let c = 0; c < cols; c++) {
            let lebar = c === 0 ? '75%' : '60%';
            html += '<td style="padding:14px 10px;"><div class="sk-box sk-line" style="width:' + lebar + '; margin:0 auto;"></div></td>';
        }
        html += '</tr>';
        return html;
    }

    return '<div class="sk-materi-card"><div class="sk-materi-body"><div class="sk-box sk-line" style="width:80%;"></div><div class="sk-box sk-line" style="width:60%;"></div></div></div>';
};