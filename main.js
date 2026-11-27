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

// SOFT UPDATE SYSTEM (Bersihkan cache lama secara senyap tanpa logout & tanpa reload paksa)
let currentAppVersion = "2.0.3";
if (localStorage.getItem("app_version_mahardika") !== currentAppVersion) {
    try {
        Object.keys(sessionStorage).forEach(function(k) {
            if (k.indexOf("cache_room_") === 0 || k.indexOf("rest_ttl_") === 0) {
                sessionStorage.removeItem(k);
            }
        });
    } catch (e) {}
    localStorage.setItem("app_version_mahardika", currentAppVersion);
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

// 5. Render Sidebar Kiri Ruang Belajar (Drawer 3 Garis + Accordion hingga 10 Tingkat)
window._navTreeRootNodes = [];
window._navNodeBySlug = {};
window._drawerExpandedSlugs = new Set();

window.apakahPerangkatLaptopDrawer = function() {
    let ua = navigator.userAgent || '';
    let isMobileOrTablet = /Android|iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return !isMobileOrTablet && window.innerWidth >= 960;
};

window.terapkanLebarPanelKiriLaptop = function() {
    let nav = document.getElementById('main-nav');
    if (!nav) return;

    if (window.apakahPerangkatLaptopDrawer()) {
        let lebarTarget = Math.min(365, Math.round(window.innerWidth * 0.30));
        nav.style.setProperty('width', lebarTarget + 'px', 'important');
        nav.style.setProperty('max-width', lebarTarget + 'px', 'important');
        nav.style.removeProperty('min-width');
        nav.classList.add('is-laptop-wide-drawer');
    } else {
        nav.style.removeProperty('width');
        nav.style.removeProperty('max-width');
        nav.style.removeProperty('min-width');
        nav.classList.remove('is-laptop-wide-drawer');
    }
};

window.pasangPengaturanPanelKiri = function() {
    if (!document.getElementById('css-main-drawer-upgrade')) {
        let st = document.createElement('style');
        st.id = 'css-main-drawer-upgrade';
        st.textContent =
            'html.drawer-scroll-locked, body.drawer-scroll-locked { overflow: hidden !important; overscroll-behavior: none !important; }' +
            'aside#main-nav.main-left-drawer, aside#main-nav.main-left-drawer * { box-sizing: border-box !important; }' +
            'aside#main-nav.main-left-drawer { overscroll-behavior: contain !important; }' +
            'aside#main-nav.main-left-drawer .main-drawer-scroll {' +
                'overscroll-behavior: contain !important; -webkit-overflow-scrolling: touch;' +
                'width: 100% !important; max-width: 100% !important; overflow-x: hidden !important;' +
            '}' +
            'aside#main-nav.main-left-drawer #dynamic-navbar, aside#main-nav.main-left-drawer .sub-menu-nav {' +
                'width: 100% !important; max-width: 100% !important;' +
            '}' +
            'aside#main-nav.main-left-drawer .drawer-item-row {' +
                'display: flex !important; align-items: center !important; width: 100% !important; max-width: 100% !important; min-width: 0 !important; gap: 6px !important;' +
            '}' +
            'aside#main-nav.main-left-drawer .drawer-nav-link { flex: 1 1 auto !important; min-width: 0 !important; overflow-wrap: break-word; }' +
            'aside#main-nav.main-left-drawer .drawer-expand-btn { flex-shrink: 0 !important; margin-right: 2px !important; }' +
            '#main-nav-backdrop { overscroll-behavior: none !important; touch-action: none !important; }' +
            'aside#main-nav.main-left-drawer.is-laptop-wide-drawer:not(.is-open) {' +
                'left: 0 !important;' +
                'transform: translateX(-115%) !important;' +
                'visibility: hidden !important;' +
                'pointer-events: none !important;' +
            '}' +
            'aside#main-nav.main-left-drawer.is-laptop-wide-drawer.is-open {' +
                'left: 0 !important;' +
                'transform: translateX(0) !important;' +
                'visibility: visible !important;' +
                'pointer-events: auto !important;' +
            '}';
        document.head.appendChild(st);
    }

    window.terapkanLebarPanelKiriLaptop();
    if (!window._drawerResizeBound) {
        window._drawerResizeBound = true;
        window.addEventListener('resize', window.terapkanLebarPanelKiriLaptop);
    }

    if (!window._drawerScrollLockBound) {
        window._drawerScrollLockBound = true;
        let lastTouchY = 0;

        document.addEventListener('wheel', function(e) {
            let navEl = document.getElementById('main-nav');
            if (!navEl || !navEl.classList.contains('is-open')) return;

            let scrollBox = (e.target && e.target.closest) ? e.target.closest('#main-nav .main-drawer-scroll') : null;
            if (!scrollBox) {
                e.preventDefault();
                return;
            }

            let canScroll = scrollBox.scrollHeight > scrollBox.clientHeight + 1;
            if (!canScroll) {
                e.preventDefault();
                return;
            }

            let atTop = scrollBox.scrollTop <= 0 && e.deltaY < 0;
            let atBottom = (scrollBox.scrollTop + scrollBox.clientHeight >= scrollBox.scrollHeight - 1) && e.deltaY > 0;
            if (atTop || atBottom) {
                e.preventDefault();
            }
        }, { passive: false, capture: true });

        document.addEventListener('touchstart', function(e) {
            if (e.touches && e.touches.length === 1) {
                lastTouchY = e.touches[0].clientY;
            }
        }, { passive: true, capture: true });

        document.addEventListener('touchmove', function(e) {
            let navEl = document.getElementById('main-nav');
            if (!navEl || !navEl.classList.contains('is-open')) return;
            if (!e.touches || e.touches.length !== 1) return;

            let scrollBox = (e.target && e.target.closest) ? e.target.closest('#main-nav .main-drawer-scroll') : null;
            if (!scrollBox) {
                e.preventDefault();
                return;
            }

            let curY = e.touches[0].clientY;
            let dy = curY - lastTouchY;
            lastTouchY = curY;

            let canScroll = scrollBox.scrollHeight > scrollBox.clientHeight + 1;
            if (!canScroll) {
                e.preventDefault();
                return;
            }

            let atTop = scrollBox.scrollTop <= 0 && dy > 0;
            let atBottom = (scrollBox.scrollTop + scrollBox.clientHeight >= scrollBox.scrollHeight - 1) && dy < 0;
            if (atTop || atBottom) {
                e.preventDefault();
            }
        }, { passive: false, capture: true });
    }
};

window.toggleMainSidebarNav = function(forceOpen) {
    window.pasangPengaturanPanelKiri();
    let nav = document.getElementById('main-nav');
    let bd = document.getElementById('main-nav-backdrop');
    let btn = document.getElementById('btn-toggle-main-sidebar');
    if (!nav) return;

    let willOpen = (typeof forceOpen === 'boolean') ? forceOpen : !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', willOpen);
    if (bd) bd.classList.toggle('is-open', willOpen);
    if (btn) btn.classList.toggle('is-open', willOpen);

    document.documentElement.classList.toggle('drawer-scroll-locked', willOpen);
    document.body.classList.toggle('drawer-scroll-locked', willOpen);

    if (willOpen && typeof window.tutupMenuHeaderMore === 'function') {
        window.tutupMenuHeaderMore();
    }
};

document.addEventListener('DOMContentLoaded', window.pasangPengaturanPanelKiri);

window.closeDropdowns = function() {
    window.toggleMainSidebarNav(false);
    let portal = document.getElementById('mobile-nav-dropdown-portal');
    let backdrop = document.getElementById('mobile-nav-dropdown-backdrop');
    if (portal) portal.style.display = 'none';
    if (backdrop) backdrop.style.display = 'none';
};

window.ambilAnakVisibleNav = function(node) {
    if (!node || !Array.isArray(node.children)) return [];
    let isAdminEdit = (typeof window.isAdminSession === 'function' && window.isAdminSession()) &&
        (document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode'));
    return node.children.filter(function(child) {
        return isAdminEdit || !child.effectiveHidden;
    });
};

window.apakahCabangMemuatSlugAktif = function(node, targetSlug) {
    if (!node || !targetSlug) return false;
    if (node.slug === targetSlug) return true;
    let kids = node.children || [];
    for (let i = 0; i < kids.length; i++) {
        if (window.apakahCabangMemuatSlugAktif(kids[i], targetSlug)) return true;
    }
    return false;
};

window.renderDynamicNavbar = function() {
    window.pastikanRoomHiddenTerkunci();

    let container = document.getElementById("dynamic-pages-container");
    let navUl = document.getElementById("dynamic-navbar");
    if (!container || !navUl) return;

    let staticHomeLink = navUl.querySelector('li.is-home-fallback > a');
    let hasDynamicHome = window.pagesData.some(function(p) { return p.slug === "home"; });
    if (staticHomeLink && staticHomeLink.parentElement) {
        staticHomeLink.parentElement.style.display = hasDynamicHome ? "none" : "";
        staticHomeLink.onclick = function(e) { window.klikMenuNavbar(e, 'home', staticHomeLink); };
    }

    let rootNodes = [];
    let stack = [];
    let nodeMap = {};

    window.pagesData.forEach(function(page, idx) {
        let node = {
            title: page.title,
            slug: page.slug,
            level: page.level,
            hidden: Boolean(page.hidden),
            isLockedHidden: Boolean(page.isLockedHidden),
            index: idx,
            children: [],
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

    let aktifSlug = window.babAktif || babAktif || "home";

    function cetakMenuHTML(nodes) {
        let html = "";
        nodes.forEach(function(node) {
            let visibleChildren = window.ambilAnakVisibleNav(node);
            let hasChildren = visibleChildren.length > 0;
            let isActive = (node.slug === aktifSlug);
            let containsActive = hasChildren && !isActive && window.apakahCabangMemuatSlugAktif(node, aktifSlug);
            let isExpanded = hasChildren && (window._drawerExpandedSlugs.has(node.slug) || containsActive);

            let liClasses = ["drawer-nav-item"];
            if (node.effectiveHidden) liClasses.push("hidden-nav-item");
            if (hasChildren) liClasses.push("has-sub");
            if (isExpanded) liClasses.push("is-expanded");
            if (node.isLockedHidden) liClasses.push("locked-hidden-nav-item");

            let aClasses = ["drawer-nav-link"];
            if (node.effectiveHidden) aClasses.push("hidden-nav-link");
            if (isActive) aClasses.push("active");

            let labelTitle = node.title;
            if (node.level === 0 && node.slug === "home" && labelTitle.indexOf("🏠") === -1) labelTitle = "🏠 " + labelTitle;
            else if (node.isLockedHidden && labelTitle.indexOf("🔒") === -1) labelTitle = "🔒 " + labelTitle;

            let safeSlug = String(node.slug || "").replace(/'/g, "\\'");

            html += '<li class="' + liClasses.join(" ") + '" data-level="' + node.level + '" data-slug="' + safeSlug + '">';
            html += '  <div class="drawer-item-row">';
            html += '    <a href="index.html?bab=' + encodeURIComponent(node.slug) + '" class="' + aClasses.join(" ") + '" onclick="window.klikMenuNavbar(event, \'' + safeSlug + '\', this)">';
            html += '      <span class="drawer-link-txt">' + labelTitle + '</span>';
            html += '    </a>';
            if (hasChildren) {
                html += '    <button type="button" class="drawer-expand-btn" onclick="window.toggleSubMenuSidebar(event, \'' + safeSlug + '\', this)" title="Buka / Tutup Sub-Ruang" aria-expanded="' + (isExpanded ? 'true' : 'false') + '">' + (isExpanded ? '▾' : '▸') + '</button>';
            }
            html += '  </div>';

            if (hasChildren) {
                html += '  <ul class="sub-menu-nav' + (isExpanded ? ' open-sub' : '') + '" data-sub-level="' + (node.level + 1) + '">';
                html += cetakMenuHTML(node.children);
                html += '  </ul>';
            }
            html += '</li>';
        });
        return html;
    }

    container.innerHTML = cetakMenuHTML(rootNodes);
};

// Klik Nama Ruang di Sidebar Kiri: Langsung Buka Halamannya & Tutup Drawer
window.klikMenuNavbar = function(e, slug) {
    if (e) e.preventDefault();
    window.navigasiHalaman(e, slug);
    window.toggleMainSidebarNav(false);
};

// Klik Panah Sub-Ruang di Sidebar Kiri: Buka/Tutup Cabang (Accordion) Tanpa Menutup Drawer
window.toggleSubMenuSidebar = function(e, slug, btnEl) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    let li = btnEl ? btnEl.closest('li.drawer-nav-item') : null;
    if (!li) return;
    let subUl = li.querySelector(':scope > ul.sub-menu-nav');
    let willExpand = !li.classList.contains('is-expanded');

    li.classList.toggle('is-expanded', willExpand);
    if (subUl) subUl.classList.toggle('open-sub', willExpand);
    if (btnEl) {
        btnEl.innerText = willExpand ? '▾' : '▸';
        btnEl.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
    }

    if (willExpand) window._drawerExpandedSlugs.add(slug);
    else window._drawerExpandedSlugs.delete(slug);
};

// Tutup Drawer Sidebar Kiri Saat Tekan Tombol ESC
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        let nav = document.getElementById("main-nav");
        if (nav && nav.classList.contains("is-open")) {
            window.toggleMainSidebarNav(false);
        }
    }
});

// 7. Render & Operasi di Dalam Modal "⚙️ Pages"
let dragSourcePageIndex = null;

window.pasangCssWarnaLevelPages = function() {
    if (document.getElementById("css-pages-level-colors")) return;
    let st = document.createElement("style");
    st.id = "css-pages-level-colors";
    st.textContent =
        '#sortable-list > li.page-item-card { color: #0f172a !important; transition: filter 0.15s ease; }' +
        '#sortable-list > li.page-item-card .page-title-input { background: transparent !important; color: #0f172a !important; font-weight: 700 !important; }' +
        '#sortable-list > li.page-item-card .page-title-input:focus { background: rgba(255, 255, 255, 0.92) !important; }' +
        '#sortable-list > li.page-item-card .page-drag-handle { color: #334155 !important; }' +
        '#sortable-list > li.page-item-card .page-level-badge { background: rgba(15, 23, 42, 0.09) !important; color: #0f172a !important; border: 1px solid rgba(15, 23, 42, 0.16) !important; }' +
        '#sortable-list > li.page-item-card .page-btn-icon { background: rgba(255, 255, 255, 0.85); }' +

        /* Lv 1 (level 0): Putih */
        '#sortable-list > li.page-item-card[data-page-level="0"] { background: #ffffff !important; border: 1px solid #cbd5e1 !important; }' +
        /* Lv 2 (level 1): Abu-abu tipis */
        '#sortable-list > li.page-item-card[data-page-level="1"] { background: #eef2f6 !important; border: 1px solid #cbd5e1 !important; }' +
        /* Lv 3 (level 2): Abu-abu agak gelap */
        '#sortable-list > li.page-item-card[data-page-level="2"] { background: #cbd5e1 !important; border: 1px solid #94a3b8 !important; }' +
        /* Lv 4 (level 3): Bintik-bintik abu-abu */
        '#sortable-list > li.page-item-card[data-page-level="3"] { background-color: #ffffff !important; background-image: radial-gradient(#94a3b8 1.5px, transparent 1.5px) !important; background-size: 9px 9px !important; border: 1px solid #94a3b8 !important; }' +
        /* Lv 5 (level 4): Border hitam agak tebal, dalamnya putih */
        '#sortable-list > li.page-item-card[data-page-level="4"] { background: #ffffff !important; border: 3px solid #111111 !important; }' +
        /* Lv 6 (level 5): Setengah putih setengah abu tipis */
        '#sortable-list > li.page-item-card[data-page-level="5"] { background: linear-gradient(90deg, #ffffff 0%, #ffffff 50%, #e5ebf2 50%, #e5ebf2 100%) !important; border: 1px solid #cbd5e1 !important; }' +
        /* Lv 7 (level 6): Setengah putih setengah abu agak gelap */
        '#sortable-list > li.page-item-card[data-page-level="6"] { background: linear-gradient(90deg, #ffffff 0%, #ffffff 50%, #cbd5e1 50%, #cbd5e1 100%) !important; border: 1px solid #94a3b8 !important; }' +
        /* Lv 8 (level 7): Garis-garis */
        '#sortable-list > li.page-item-card[data-page-level="7"] { background: repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 6px, #cbd5e1 6px, #cbd5e1 8px) !important; border: 1px solid #94a3b8 !important; }' +
        /* Lv 9 (level 8): Garis diagonal */
        '#sortable-list > li.page-item-card[data-page-level="8"] { background: repeating-linear-gradient(-45deg, #ffffff 0px, #ffffff 6px, #cbd5e1 6px, #cbd5e1 9px) !important; border: 1px solid #94a3b8 !important; }' +
        /* Lv 10 (level 9): Warna kuning */
        '#sortable-list > li.page-item-card[data-page-level="9"] { background: #fde047 !important; border: 1.5px solid #ca8a04 !important; }' +

        /* Tetap bedakan border putus-putus untuk room terkunci Hidden */
        '#sortable-list > li.page-item-card.locked-hidden-card { border-style: dashed !important; border-color: #ef4444 !important; }';
    document.head.appendChild(st);
};

window.renderModalPages = function() {
    window.pasangCssWarnaLevelPages();
    window.pastikanRoomHiddenTerkunci();
    let listEl = document.getElementById("sortable-list");
    if (!listEl) return;

    let html = "";
    window.pagesData.forEach(function(page, idx) {
        let isLockedHidden = Boolean(page.isLockedHidden);
        let isHome = (page.level === 0 && page.slug === "home");
        let lvl = Math.max(0, Math.min(9, Number(page.level) || 0));
        let indentPx = lvl * 26;
        let canAddSub = lvl < 9;

        let eyeIcon = (page.hidden || isLockedHidden) ? "🚫" : "👁️";
        let eyeTitle = isLockedHidden ? "Room khusus (Terkunci)" : (page.hidden ? "Klik untuk tampilkan" : "Klik untuk sembunyikan");
        let cardClass = "page-item-card" + (isLockedHidden ? " locked-hidden-card" : "");
        let levelLabel = lvl === 0 ? "Main" : "Lv." + (lvl + 1);

        let dragGrip = !isLockedHidden
            ? 'onmousedown="this.closest(\'li\').setAttribute(\'draggable\', true)" onmouseup="this.closest(\'li\').setAttribute(\'draggable\', false)" onmouseleave="this.closest(\'li\').setAttribute(\'draggable\', false)"'
            : "";

        html += '<li class="' + cardClass + '" style="margin-left:' + indentPx + 'px;" draggable="false" data-page-index="' + idx + '" data-page-level="' + lvl + '" ondragstart="window.onPageDragStart(event, ' + idx + ')" ondragover="window.onPageDragOver(event)" ondrop="window.onPageDrop(event, ' + idx + ')">';
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
            let editable = el.closest(".quiz-editable-field, .content-block, .fb-content, #popup-content-box, #cg-editor-area");
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
    let selectorEditable = ".quiz-editable-field, .content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area";
    let a = (document.activeElement && document.activeElement.closest)
        ? document.activeElement.closest(selectorEditable)
        : null;
    if (!a) a = window.lastActiveEditable;
    if (a && document.body.contains(a)) {
        window.lastActiveEditable = a;
        if (typeof window.catatSnapshotUndo === "function") {
            window.catatSnapshotUndo(a, true);
        }
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
        // Otomatis hapus tanda manual ("-", "1.", "1).", "(1)", "A.", "a.", dll.) & sinkronkan level list 5 tingkat
        if (command === "insertUnorderedList" || command === "insertOrderedList") {
            let selList = window.getSelection();
            if (selList && selList.rangeCount > 0) {
                let rList = selList.getRangeAt(0);
                let anc = rList.commonAncestorContainer;
                let rootEl = (anc.nodeType === 3 ? anc.parentElement : anc);
                let editableHost = (rootEl && rootEl.closest) ? rootEl.closest(".content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area") : null;
                if (editableHost) {
                    let listItems = Array.from(editableHost.querySelectorAll("li")).filter(function(li) {
                        return rList.intersectsNode(li);
                    });
                    listItems.forEach(function(li) {
                        let walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT, null, false);
                        let tn = walker.nextNode();
                        while (tn && !tn.nodeValue.replace(/[\s\u200B-\u200D\uFEFF]/g, "")) {
                            tn = walker.nextNode();
                        }
                        if (tn) {
                            tn.nodeValue = tn.nodeValue.replace(/^[\s\u200B-\u200D\uFEFF]*(?:[-•*–—▪▫◦●○▸◆]|\((?:\d+|[a-zA-Z])\)|(?:\d+|[a-zA-Z])\)\.?|(?:\d+|[a-zA-Z])\.)[\s\u00A0]+/, "");
                        }
                    });
                    if (typeof window.sinkronkanTingkatList === "function") {
                        window.sinkronkanTingkatList(editableHost);
                    }
                }
            }
        }
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

window.toggleCollapseBlock = function(idx, fromBottom) {
    if (!window.contentBlocksData[idx]) return;
    let wrapper = document.querySelector('#blocks-container > .block-wrapper[data-index="' + idx + '"]');
    let topBefore = wrapper ? wrapper.getBoundingClientRect().top : null;

    let nextCollapsed = !window.contentBlocksData[idx].isCollapsed;
    window.contentBlocksData[idx].isCollapsed = nextCollapsed;

    if (wrapper) {
        let area = wrapper.querySelector(':scope > div > .block-collapsible-area');
        let btn = wrapper.querySelector('.block-collapse-bar > button');
        if (area) area.style.display = nextCollapsed ? 'none' : 'block';
        if (btn) btn.innerText = nextCollapsed ? '▶' : '▼';

        // Jika ditutup dari tombol kanan bawah dan judul blok ada di atas layar, arahkan halus ke judul blok
        if (fromBottom && nextCollapsed && topBefore !== null && topBefore < 60) {
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (topBefore !== null) {
            let topAfter = wrapper.getBoundingClientRect().top;
            let selisih = topAfter - topBefore;
            if (Math.abs(selisih) > 1) {
                window.scrollBy(0, selisih);
            }
        }

        // Jika baru dibuka, segarkan ukuran kanvas coretan & rumus MathJax di blok ini saja
        if (!nextCollapsed) {
            setTimeout(function() {
                if (typeof window.inisialisasiSemuaCanvas === 'function') window.inisialisasiSemuaCanvas();
                if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                    let belumRender = Array.from(wrapper.querySelectorAll('.latex-inline, .math-latex-block')).filter(function(node) {
                        return !node.querySelector('mjx-container');
                    });
                    if (belumRender.length > 0) {
                        window.MathJax.typesetPromise(belumRender).catch(function() {});
                    }
                }
            }, 60);
        }
    } else {
        window.renderBlocks();
    }

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

window.lastFocusedBlockIndex = -1;
window._pendingInsertAfterIdx = null;

// Rekam blok terakhir yang disentuh + Otomatis pindahkan Sidebar Settings jika sedang terbuka
document.addEventListener('pointerdown', function(e) {
    let bw = e.target && e.target.closest ? e.target.closest('#blocks-container > .block-wrapper') : null;
    if (bw) {
        let idx = parseInt(bw.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
            window.lastFocusedBlockIndex = idx;
            let sidebar = document.getElementById('sidebar-block');
            let isDeleteOrMoveBtn = e.target.closest && e.target.closest('.block-controls button[onclick*="hapusBlok"], .block-controls button[onclick*="geserBlok"]');
            if (sidebar && sidebar.classList.contains('open') && !isDeleteOrMoveBtn && window.activeBlockIndex !== idx) {
                window.bukaSidebarBlock(idx);
            }
        }
    }
}, true);

window.ambilIndexBlokAktif = function() {
    if (window.lastActiveEditable && window.lastActiveEditable.classList && window.lastActiveEditable.classList.contains('content-block')) {
        let idx = parseInt(window.lastActiveEditable.getAttribute('data-index'), 10);
        if (!isNaN(idx) && idx >= 0 && idx < window.contentBlocksData.length) return idx;
    }
    if (typeof window.lastFocusedBlockIndex === 'number' && window.lastFocusedBlockIndex >= 0 && window.lastFocusedBlockIndex < window.contentBlocksData.length) {
        return window.lastFocusedBlockIndex;
    }
    return window.contentBlocksData.length - 1;
};

window.tambahBlokDiBawah = function(idx) {
    let newBlock = {
        type: 'text', html: "<p>Ketik materi...</p>", bg: "#ffffff", pattern: "",
        color: "#333333", width: "M", padTop: "0px", padBot: "0px", drawing: "",
        floatImages: [], isCollapsed: false, blockTitle: "Materi Baru", twoColumns: false
    };
    let pos = (typeof idx === 'number' && idx >= 0 && idx < window.contentBlocksData.length) ? (idx + 1) : window.contentBlocksData.length;
    window.contentBlocksData.splice(pos, 0, newBlock);
    window.lastFocusedBlockIndex = pos;
    window.renderBlocks();
    if (window.simpanKeDB) window.simpanKeDB();

    setTimeout(function() {
        let targetEl = document.querySelector('#blocks-container > .block-wrapper[data-index="' + pos + '"]');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
};

window.toggleDuaKolomBlok = function(idx) {
    if (!window.contentBlocksData[idx]) return;
    window.contentBlocksData[idx].twoColumns = !window.contentBlocksData[idx].twoColumns;
    window.renderBlocks();
    if (window.simpanKeDB) window.simpanKeDB();
};

window.renderBlocks = function() {
    // Jika Media (PDF Slide) atau Modul Interaktif baru ditambahkan ke akhir array, pindahkan tepat ke bawah blok aktif
    if (typeof window._pendingInsertAfterIdx === 'number' && window._pendingInsertAfterIdx >= 0 && window.contentBlocksData.length > 1) {
        let lastIdx = window.contentBlocksData.length - 1;
        let lastBlok = window.contentBlocksData[lastIdx];
        if (lastBlok && (lastBlok.type === 'pdf_slides' || lastBlok.type === 'modul_interaktif') && !lastBlok._posisiTersusun) {
            lastBlok._posisiTersusun = true;
            let targetPos = Math.min(window._pendingInsertAfterIdx + 1, lastIdx);
            if (targetPos < lastIdx) {
                window.contentBlocksData.pop();
                window.contentBlocksData.splice(targetPos, 0, lastBlok);
                window.lastFocusedBlockIndex = targetPos;
            }
            window._pendingInsertAfterIdx = null;
        }
    }

    if (typeof window.sinkronkanModeEditorKhususSiswa === 'function') {
        window.sinkronkanModeEditorKhususSiswa(true);
    }
    let html = '';
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');

    window.contentBlocksData.forEach(function(blok, index) {
        if (!blok.floatImages) blok.floatImages = [];
        let widthMode = blok.width || 'M';
        let bgCol = blok.bg || '#ffffff';
        let patClass = blok.pattern || '';
        let txtCol = blok.color || '#333333';
        let padTop = (blok.padTop !== undefined && blok.padTop !== null && blok.padTop !== '') ? blok.padTop : '0px';
        let padBot = (blok.padBot !== undefined && blok.padBot !== null && blok.padBot !== '') ? blok.padBot : '0px';

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
        let bgPhotoUrl = (blok.bgImage && typeof blok.bgImage === 'string') ? blok.bgImage.trim() : '';
        let bgPhotoOpPct = (typeof blok.bgImageOpacity === 'number' && !isNaN(blok.bgImageOpacity)) ? blok.bgImageOpacity : 25;
        let hasBgPhotoCls = bgPhotoUrl ? ' has-bg-photo' : '';
        let safeBgPhotoUrl = bgPhotoUrl.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        let bgPhotoLayerHtml = bgPhotoUrl
            ? '<div class="block-bg-photo-layer" style="background-image:url(\'' + safeBgPhotoUrl + '\'); opacity:' + (bgPhotoOpPct / 100) + ';"></div>'
            : '';
        let bottomCollapseBtnHtml = '<button type="button" class="btn-collapse-bottom-right" onclick="window.toggleCollapseBlock(' + index + ', true)" title="Tutup / Collapse Blok Ini">▲</button>';

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
                        ? '<div class="quiz-question-text" style="display:flex; gap:6px; align-items:flex-start; padding-right:76px;">' +
                              '<span style="font-weight:bold; flex-shrink:0;">' + (qIdx + 1) + '.</span>' +
                              '<div class="quiz-editable-field" contenteditable="true" data-quiz-block="' + index + '" data-quiz-q="' + qIdx + '" data-quiz-field="q" style="flex:1; min-width:0; outline:none;" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'q\',this)" onblur="updateSoalInline(' + index + ',' + qIdx + ',\'q\',this,null,true)">' + (q.question || '') + '</div>' +
                          '</div>'
                        : '<div class="quiz-question-text">' + (qIdx + 1) + '. ' + (q.question || '') + '</div>';

                    qi += '<div class="quiz-question-card" id="inline-q-' + index + '-' + qIdx + '">';
                    if (isEdit) {
                        qi += '<button type="button" onclick="window.pilihGambarUntukSoalInline(' + index + ',' + qIdx + ',\'q\',null)" title="Sisipkan Gambar ke Soal" style="position:absolute; top:10px; right:42px; background:#e0f2fe; color:#0284c7; border:1px solid #7dd3fc; border-radius:6px; padding:3px 7px; font-size:12px; cursor:pointer; z-index:5;">🖼️</button>';
                        qi += '<button class="btn-delete-q" onclick="hapusSoalSistem(' + qIdx + ', \'inline\', ' + index + ')" title="Hapus Soal">🗑️</button>';
                    }
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
                                qi += '<div style="display:flex; align-items:flex-start; gap:8px; margin-bottom:6px;">' +
                                      '<input type="checkbox" ' + (isKunci ? 'checked' : '') + ' style="width:16px;height:16px;margin-top:10px;cursor:pointer;accent-color:#27ae60;" onchange="updateKunciInlinePGK(' + index + ',' + qIdx + ',' + oIdx + ', this.checked)" title="Jadikan Kunci Jawaban">' +
                                      '<div class="quiz-option-btn" style="flex:1; margin:0; display:flex; align-items:flex-start; gap:6px;">' +
                                          '<span style="font-weight:bold; flex-shrink:0;">' + String.fromCharCode(65 + oIdx) + '.</span>' +
                                          '<div class="quiz-editable-field" contenteditable="true" data-quiz-block="' + index + '" data-quiz-q="' + qIdx + '" data-quiz-field="o" data-quiz-opt="' + oIdx + '" style="flex:1; min-width:0; outline:none;" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'o\',this,' + oIdx + ')" onblur="updateSoalInline(' + index + ',' + qIdx + ',\'o\',this,' + oIdx + ',true)">' + (opt || '') + '</div>' +
                                          '<button type="button" onclick="event.stopPropagation(); window.pilihGambarUntukSoalInline(' + index + ',' + qIdx + ',\'o\',' + oIdx + ')" title="Sisipkan Gambar ke Opsi" style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:5px; padding:2px 6px; font-size:11px; cursor:pointer; flex-shrink:0;">🖼️</button>' +
                                      '</div>' +
                                      '</div>';
                            }
                             else {
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
                                qi += '<div style="display:flex; align-items:flex-start; gap:8px; margin-bottom:6px;">' +
                                      '<input type="radio" name="kunci-' + index + '-' + qIdx + '" ' + (isKunci ? 'checked' : '') + ' style="width:16px;height:16px;margin-top:10px;cursor:pointer;accent-color:#27ae60;" onchange="updateKunciInline(' + index + ',' + qIdx + ',' + oIdx + ')" title="Jadikan Kunci Jawaban">' +
                                      '<div class="quiz-option-btn" style="flex:1; margin:0; display:flex; align-items:flex-start; gap:6px;">' +
                                          '<span style="font-weight:bold; flex-shrink:0;">' + String.fromCharCode(65 + oIdx) + '.</span>' +
                                          '<div class="quiz-editable-field" contenteditable="true" data-quiz-block="' + index + '" data-quiz-q="' + qIdx + '" data-quiz-field="o" data-quiz-opt="' + oIdx + '" style="flex:1; min-width:0; outline:none;" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'o\',this,' + oIdx + ')" onblur="updateSoalInline(' + index + ',' + qIdx + ',\'o\',this,' + oIdx + ',true)">' + (opt || '') + '</div>' +
                                          '<button type="button" onclick="event.stopPropagation(); window.pilihGambarUntukSoalInline(' + index + ',' + qIdx + ',\'o\',' + oIdx + ')" title="Sisipkan Gambar ke Opsi" style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:5px; padding:2px 6px; font-size:11px; cursor:pointer; flex-shrink:0;">🖼️</button>' +
                                      '</div>' +
                                      '</div>';
                            }
                             else {
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
                    let editBahasAttr = isEdit
                        ? 'contenteditable="true" class="content-block quiz-editable-field" data-quiz-block="' + index + '" data-quiz-q="' + qIdx + '" data-quiz-field="e" onblur="updateSoalInline(' + index + ',' + qIdx + ',\'e\',this,null,true)"'
                        : 'class="content-block"';

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
                    '<div class="block-collapsible-area' + hasBgPhotoCls + '" style="display:' + displayStyle + '; width:100%; position:relative;">' +
                        bgPhotoLayerHtml +
                        '<div class="draw-float-layer" data-index="' + index + '">' + floatImgsQuiz + '</div>' +
                        '<canvas class="drawing-layer" data-index="' + index + '"></canvas>' +
                        '<div class="content-block dynamic-content-block ' + patClass + '" data-index="' + index + '" data-width="' + widthMode + '" style="background-color:transparent; border:none!important; box-shadow:none!important; min-height:0!important; padding:0!important;">' +
                            qi +
                        '</div>' +
                        bottomCollapseBtnHtml +
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
                        bottomCollapseBtnHtml +
                    '</div>' +
                '</div>' +
            '</div>';
        }
        // 4. TIPE BLOK TEKS & TABEL DINAMIS
        else {
            let floatImgsText = window.renderFloatImagesHTML(index, -1, blok.floatImages || []);
            let twoColClass = blok.twoColumns ? ' two-columns-block' : '';
            let btnTwoColLabel = blok.twoColumns ? '📄 1 Kolom' : '◫ 2 Kolom';

            html += '<div class="block-wrapper" data-index="' + index + '" style="padding-top:' + padTop + ';padding-bottom:' + padBot + ';">' +
                '<div class="a4-paper-wrapper dynamic-block-shell" data-width="' + widthMode + '" style="background-color:' + bgCol + '; border:1px solid #cbd5e1; border-radius:10px; box-shadow:0 4px 16px rgba(15, 23, 42, 0.08); overflow:visible;">' +
                    '<div class="block-controls">' +
                        '<button onclick="geserBlok(' + index + ', -1)">⬆️</button>' +
                        '<button onclick="geserBlok(' + index + ', 1)">⬇️</button>' +
                        '<button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button>' +
                        '<button onclick="window.toggleDuaKolomBlok(' + index + ')" title="Bagi 2 Kolom Tengah / Kembali 1 Kolom">' + btnTwoColLabel + '</button>' +
                        '<button onclick="hapusBlok(' + index + ')">🗑️ Delete</button>' +
                    '</div>' +
                    collapseBarHtml +
                    '<div class="block-collapsible-area' + hasBgPhotoCls + '" style="display:' + displayStyle + '; width:100%; position:relative;">' +
                        bgPhotoLayerHtml +
                        '<div class="draw-float-layer" data-index="' + index + '">' + floatImgsText + '</div>' +
                        '<canvas class="drawing-layer" data-index="' + index + '"></canvas>' +
                        '<div class="content-block a4-portrait-block dynamic-content-block ' + patClass + twoColClass + '" ' + (isEdit ? 'contenteditable="true"' : '') + ' data-index="' + index + '" data-block-type="text" data-width="' + widthMode + '" style="background-color:transparent; color:' + txtCol + '; border:none!important; box-shadow:none!important;" oninput="window.cekBatasTinggiA4Input(event, this)">' +
                            blok.html +
                        '</div>' +
                        bottomCollapseBtnHtml +
                    '</div>' +
                    '<button type="button" class="btn-add-block-below" onclick="window.tambahBlokDiBawah(' + index + ')" title="Tambah Content Block Baru di Bawah Blok Ini">+</button>' +
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
        let btnEkstrak = w.querySelector('button[onclick*="bukaAIQuizModal"]');
        if (btnEkstrak) btnEkstrak.setAttribute('onclick', 'bukaAIQuizModal(' + idx + ')');
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
        color: "#333333", width: "M", padTop: "0px", padBot: "0px", drawing: "", 
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
        color: "#333333", width: "M", padTop: "0px", padBot: "0px", drawing: "", 
        floatImages: [], isCollapsed: false, blockTitle: "Materi Baru"
    };
    
    if (window.activeBlockIndex > -1 && window.activeBlockIndex < window.contentBlocksData.length) {
        window.contentBlocksData.splice(window.activeBlockIndex + 1, 0, newBlock);
    } else {
        window.contentBlocksData.push(newBlock);
    }
    
    window.tutupSidebarBlock();
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
        if (window.activeBlockIndex === i) window.tutupSidebarBlock();
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

window.tutupSidebarBlock = function() {
    let sb = document.getElementById('sidebar-block');
    if (sb) sb.classList.remove('open');
    document.querySelectorAll('#blocks-container > .block-wrapper.sidebar-target-block').forEach(function(el) {
        el.classList.remove('sidebar-target-block');
    });
};

window.bukaSidebarBlock = function(i) {
    window.activeBlockIndex = i;
    let b = window.contentBlocksData[i];
    if (!b) return;

    let topNum = parseInt(b.padTop, 10);
    if (isNaN(topNum)) topNum = 0;
    let botNum = parseInt(b.padBot, 10);
    if (isNaN(botNum)) botNum = 0;

    let inTop = document.querySelector('input[oninput*="padTop"]');
    let inBot = document.querySelector('input[oninput*="padBot"]');
    if (inTop) inTop.value = topNum;
    if (document.getElementById('val-padtop')) document.getElementById('val-padtop').innerText = topNum + 'px';
    if (inBot) inBot.value = botNum;
    if (document.getElementById('val-padbot')) document.getElementById('val-padbot').innerText = botNum + 'px';

    let lblAktif = document.getElementById('sidebar-active-block-label');
    if (lblAktif) {
        let namaBlok = b.blockTitle || b.quizTitle || (b.type === 'quiz' ? 'Uji Pemahaman' : 'Materi');
        lblAktif.innerText = 'Blok #' + (i + 1) + ' • ' + namaBlok;
    }

    // Tandai blok yang sedang diatur oleh Sidebar Settings
    document.querySelectorAll('#blocks-container > .block-wrapper.sidebar-target-block').forEach(function(el) {
        el.classList.remove('sidebar-target-block');
    });
    let targetWrap = document.querySelector('#blocks-container > .block-wrapper[data-index="' + i + '"]');
    if (targetWrap) targetWrap.classList.add('sidebar-target-block');

    if (typeof window.sinkronkanUIBgFotoSidebar === 'function') {
        window.sinkronkanUIBgFotoSidebar(b);
    }

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
        if (t === 'bg') {
            if (shell) {
                shell.style.backgroundColor = v;
                d.style.backgroundColor = 'transparent';
            } else {
                d.style.backgroundColor = v;
            }
        }
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
window.topModalZIndex = 9700;

window.angkatKeLapisanTeratas = function(el) {
    if (!el) return;
    let maxZ = window.topModalZIndex || 9700;
    document.querySelectorAll('.modal-overlay, .floating-cg').forEach(function(item) {
        if (item.id === 'modal-custom-dialog') return;
        let disp = window.getComputedStyle(item).display;
        if (disp !== 'none') {
            let z = parseInt(window.getComputedStyle(item).zIndex, 10);
            if (!isNaN(z) && z < 999900 && z > maxZ) maxZ = z;
        }
    });
    window.topModalZIndex = maxZ + 10;
    el.style.zIndex = window.topModalZIndex;
};
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

window._adminWsActive = false;
window._adminWsCurrentMenu = 'administrasi';
window._isSyncingAdminWS = false;
window._isClosingAdminWS = false;

window._ADMIN_WS_MAP = {
    'administrasi':    { modalId: 'modal-administrasi',    icon: '📁', title: 'Administrasi Kelas' },
    'manajer-soal':    { modalId: 'modal-manajer-soal',    icon: '🗂️', title: 'Manajer Latihan' },
    'manajer-ujian':   { modalId: 'modal-manajer-ujian',   icon: '🎯', title: 'Manajer Ujian' },
    'rekap-nilai':     { modalId: 'modal-rekap-nilai',     icon: '📊', title: 'Rekap Nilai' },
    'ekstrakurikuler': { modalId: 'modal-ekstrakurikuler', icon: '🏕️', title: 'Ekstrakurikuler' }
};

window.cariKeyMenuAdminWSByModalId = function(modalId) {
    let keys = Object.keys(window._ADMIN_WS_MAP);
    for (let i = 0; i < keys.length; i++) {
        if (window._ADMIN_WS_MAP[keys[i]].modalId === modalId) return keys[i];
    }
    return null;
};

window.pastikanModulTerpasangDiAdminWS = function() {
    let stage = document.getElementById('admin-ws-stage');
    if (!stage) return;
    Object.keys(window._ADMIN_WS_MAP).forEach(function(key) {
        let mId = window._ADMIN_WS_MAP[key].modalId;
        let el = document.getElementById(mId);
        if (el && el.parentElement !== stage) {
            stage.appendChild(el);
        }
        if (el) {
            el.classList.add('admin-ws-docked');
        }
    });
};

window.sinkronkanSubTabsTopbarWS = function(menuKey) {
    let host = document.getElementById('admin-ws-topbar-tabs');
    if (!host) return;

    let tabAdmin  = document.getElementById('aws-admin-subtabs');
    let tabUjian  = document.getElementById('aws-ujian-subtabs');
    let tabEkskul = document.getElementById('aws-ekskul-subtabs');

    if (tabAdmin  && tabAdmin.parentElement  !== host) host.appendChild(tabAdmin);
    if (tabUjian  && tabUjian.parentElement  !== host) host.appendChild(tabUjian);
    if (tabEkskul && tabEkskul.parentElement !== host) host.appendChild(tabEkskul);

    if (tabAdmin)  tabAdmin.style.display  = (menuKey === 'administrasi')    ? 'flex' : 'none';
    if (tabUjian)  tabUjian.style.display  = (menuKey === 'manajer-ujian')   ? 'flex' : 'none';
    if (tabEkskul) tabEkskul.style.display = (menuKey === 'ekstrakurikuler') ? 'flex' : 'none';

    let hasSub = (menuKey === 'administrasi' || menuKey === 'manajer-ujian' || menuKey === 'ekstrakurikuler');
    host.style.display = hasSub ? 'flex' : 'none';
};

window.perbaruiHeaderAdminWS = function(menuKey) {
    let cfg = window._ADMIN_WS_MAP[menuKey] || window._ADMIN_WS_MAP['administrasi'];
    let icoEl = document.getElementById('ws-topbar-icon');
    let ttlEl = document.getElementById('ws-topbar-title');
    let subEl = document.getElementById('ws-topbar-subtitle');

    if (icoEl) icoEl.innerText = cfg.icon;
    if (ttlEl) ttlEl.innerText = cfg.title;

    let tglStr = '';
    try {
        tglStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
        tglStr = '';
    }
    if (subEl) subEl.innerText = 'Mardikawan Room Edu' + (tglStr ? ' • ' + tglStr : '');

    document.querySelectorAll('#admin-ws-sidebar .admin-ws-nav-item[data-ws-menu]').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-ws-menu') === menuKey);
    });

    window.sinkronkanSubTabsTopbarWS(menuKey);

    if (typeof window.sinkronkanBadgeUjianSidebarWS === 'function') {
        window.sinkronkanBadgeUjianSidebarWS();
    }
};

window.toggleSidebarAdminWS = function(forceState) {
    let sb = document.getElementById('admin-ws-sidebar');
    let bd = document.getElementById('admin-ws-sidebar-backdrop');
    if (!sb) return;
    let willOpen = (typeof forceState === 'boolean') ? forceState : !sb.classList.contains('is-open');
    sb.classList.toggle('is-open', willOpen);
    if (bd) bd.classList.toggle('is-open', willOpen);
};

window.bukaModeAdministrasiPenuh = function(defaultMenu) {
    let shell = document.getElementById('admin-workspace-shell');
    if (!shell) {
        if (typeof window.bukaModalAdministrasi === 'function') window.bukaModalAdministrasi();
        return;
    }

    window.pastikanModulTerpasangDiAdminWS();
    window._adminWsActive = true;
    shell.style.display = 'flex';
    document.body.classList.add('admin-ws-mode-active');

    let targetMenu = (defaultMenu && window._ADMIN_WS_MAP[defaultMenu]) ? defaultMenu : 'administrasi';
    window.pindahMenuAdminWS(targetMenu);
};

window.pindahMenuAdminWS = function(menuKey) {
    if (!window._ADMIN_WS_MAP[menuKey]) menuKey = 'administrasi';
    window.pastikanModulTerpasangDiAdminWS();
    window._adminWsCurrentMenu = menuKey;
    window.perbaruiHeaderAdminWS(menuKey);
    window.toggleSidebarAdminWS(false);

    let targetModalId = window._ADMIN_WS_MAP[menuKey].modalId;

    // Sembunyikan 3 modul lain agar hanya 1 modul aktif yang tampil bersih
    Object.keys(window._ADMIN_WS_MAP).forEach(function(k) {
        let mId = window._ADMIN_WS_MAP[k].modalId;
        let el = document.getElementById(mId);
        if (!el) return;
        if (mId !== targetModalId) {
            el.style.display = 'none';
            el.classList.remove('admin-ws-active-view');
        } else {
            el.classList.add('admin-ws-active-view');
        }
    });

    // Jalankan pembuka asli masing-masing modul agar seluruh data & observer tetap 100% aktif
    window._isSyncingAdminWS = true;
    try {
        if (menuKey === 'administrasi' && typeof window.bukaModalAdministrasi === 'function') {
            window.bukaModalAdministrasi();
        } else if (menuKey === 'ekstrakurikuler') {
            window.bukaModal(targetModalId);
            if (typeof window.bukaRuangEkstrakurikuler === 'function') {
                window.bukaRuangEkstrakurikuler();
            }
        } else {
            window.bukaModal(targetModalId);
        }
    } finally {
        window._isSyncingAdminWS = false;
    }

    // Pastikan tampilan selalu mulai dari paling atas saat pindah modul
    let stage = document.getElementById('admin-ws-stage');
    if (stage) stage.scrollTop = 0;
};

window.tutupModeAdministrasiPenuh = function() {
    let shell = document.getElementById('admin-workspace-shell');
    window._isClosingAdminWS = true;
    window._adminWsActive = false;

    Object.keys(window._ADMIN_WS_MAP).forEach(function(k) {
        let el = document.getElementById(window._ADMIN_WS_MAP[k].modalId);
        if (el) {
            el.style.display = 'none';
            el.classList.remove('admin-ws-active-view');
        }
    });

    window.toggleSidebarAdminWS(false);
    if (shell) shell.style.display = 'none';
    document.body.classList.remove('admin-ws-mode-active');

    window._isClosingAdminWS = false;
    window.sinkronkanKunciScrollModal();
};

window.perbaruiPillStatusKelasWS = function() {
    let pill = document.getElementById('ws-status-pill');
    if (!pill) return;

    let menu = window._adminWsCurrentMenu || 'administrasi';
    if (menu === 'administrasi') {
        let sel = document.getElementById('admin-select-kelas');
        let kls = (sel && sel.value) ? sel.value : (window.kelasAktifAdmin || '');
        pill.innerText = kls ? ('🏫 Kelas Aktif: ' + kls) : '● Mode Administrasi Aktif';
    } else if (menu === 'manajer-soal') {
        let selLat = document.getElementById('filter-manajer-kelas');
        let klsLat = (selLat && selLat.value) ? selLat.value : 'Semua';
        pill.innerText = '🗂️ Filter Latihan: ' + klsLat;
    } else if (menu === 'manajer-ujian') {
        let aktifEl = document.getElementById('info-total-ujian-aktif');
        let jmlAktif = aktifEl ? (aktifEl.innerText || '0') : '0';
        pill.innerText = '🎯 Ujian Aktif: ' + jmlAktif;
    } else if (menu === 'rekap-nilai') {
        let selRek = document.getElementById('filter-rekap-kelas');
        let klsRek = (selRek && selRek.value) ? selRek.value : 'Semua';
        pill.innerText = '📊 Rekap Kelas: ' + klsRek;
    } else {
        pill.innerText = '● Mode Administrasi Aktif';
    }
};

window.sinkronkanBadgeUjianSidebarWS = function() {
    let srcBadge = document.getElementById('badge-notif');
    let dstBadge = document.getElementById('ws-badge-ujian-notif');
    if (!srcBadge || !dstBadge) return;
    let isVis = (srcBadge.style.display && srcBadge.style.display !== 'none');
    dstBadge.style.display = isVis ? 'inline-flex' : 'none';
    dstBadge.innerText = srcBadge.innerText || '!';
};

document.addEventListener('DOMContentLoaded', function() {
    // 1. Jaga status aktif pada sub-tab Administrasi Kelas
    let subTabs = document.getElementById('aws-admin-subtabs');
    if (subTabs) {
        subTabs.addEventListener('click', function(e) {
            let btn = e.target.closest ? e.target.closest('.tab-admin-btn') : null;
            if (!btn) return;
            subTabs.querySelectorAll('.tab-admin-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
        });
    }

    // 2. Jaga status aktif pada sub-tab Manajer Ujian
    let ujianTabs = document.getElementById('aws-ujian-subtabs');
    if (ujianTabs) {
        ujianTabs.addEventListener('click', function(e) {
            let btn = e.target.closest ? e.target.closest('.tab-ujian-btn') : null;
            if (!btn) return;
            ujianTabs.querySelectorAll('.tab-ujian-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
        });
    }

    // 3. Pantau perubahan filter untuk memperbarui pill status di topbar
    ['admin-select-kelas', 'filter-manajer-kelas', 'filter-rekap-kelas', 'filter-rekap-paket'].forEach(function(idSel) {
        let el = document.getElementById(idSel);
        if (!el) return;
        el.addEventListener('change', function() {
            setTimeout(window.perbaruiPillStatusKelasWS, 60);
        });
        let obs = new MutationObserver(function() {
            window.perbaruiPillStatusKelasWS();
        });
        obs.observe(el, { childList: true });
    });

    // 4. Sinkronkan badge Live Monitor ke sidebar kiri secara real-time
    let srcNotif = document.getElementById('badge-notif');
    if (srcNotif) {
        let obsNotif = new MutationObserver(window.sinkronkanBadgeUjianSidebarWS);
        obsNotif.observe(srcNotif, { attributes: true, childList: true, characterData: true, subtree: true });
    }

    // 5. Perbarui pill status setiap kali jumlah ujian aktif berubah
    // 5. Perbarui pill status setiap kali jumlah ujian aktif berubah
    let infoAktif = document.getElementById('info-total-ujian-aktif');
    if (infoAktif) {
        let obsAktif = new MutationObserver(window.perbaruiPillStatusKelasWS);
        obsAktif.observe(infoAktif, { childList: true, characterData: true, subtree: true });
    }

    // 6. Tombol ESC: Tutup sub-modal paling atas atau sidebar mobile tanpa keluar dari Mode Administrasi
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape' || !window._adminWsActive) return;

        // Jangan tutup paksa jika dialog konfirmasi/alert sedang terbuka
        let dlg = document.getElementById('modal-custom-dialog');
        if (dlg && dlg.style.display === 'flex') {
            window.tutupCustomDialog(false);
            return;
        }

        // Cari sub-modal yang terbuka di atas Mode Administrasi (non-docked)
        let subModals = Array.from(document.querySelectorAll('.modal-overlay:not(.admin-ws-docked)')).filter(function(m) {
            return m.id !== 'modal-custom-dialog' && window.getComputedStyle(m).display !== 'none';
        });

        if (subModals.length > 0) {
            subModals.sort(function(a, b) {
                let za = parseInt(window.getComputedStyle(a).zIndex, 10) || 0;
                let zb = parseInt(window.getComputedStyle(b).zIndex, 10) || 0;
                return zb - za;
            });
            window.tutupModal(subModals[0].id);
            return;
        }

        // Jika tidak ada sub-modal, tutup sidebar drawer di layar tablet/HP jika sedang terbuka
        let sb = document.getElementById('admin-ws-sidebar');
        if (sb && sb.classList.contains('is-open')) {
            window.toggleSidebarAdminWS(false);
        }
    });

    // 7. Tutup otomatis backdrop sidebar mobile saat jendela diperbesar ke mode desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 960) {
            window.toggleSidebarAdminWS(false);
        }
    });

    // 8. Sinkronisasi tampilan kosong & isi Daftar Soal di Tab Bank Soal Ujian
    let prevWrap = document.getElementById('preview-bank-ujian-wrapper');
    let prevList = document.getElementById('preview-bank-ujian-list');
    if (prevWrap) {
        let obsPrev = new MutationObserver(function() {
            if (typeof window.sinkronkanEmptyPreviewBankUjianWS === 'function') {
                window.sinkronkanEmptyPreviewBankUjianWS();
            }
        });
        obsPrev.observe(prevWrap, { attributes: true, attributeFilter: ['style'] });
        if (prevList) {
            obsPrev.observe(prevList, { childList: true });
        }
        if (typeof window.sinkronkanEmptyPreviewBankUjianWS === 'function') {
            window.sinkronkanEmptyPreviewBankUjianWS();
        }
    }
});

window.sinkronkanEmptyPreviewBankUjianWS = function() {
    let wrap = document.getElementById('preview-bank-ujian-wrapper');
    let empty = document.getElementById('aws-bu-preview-empty');
    if (!wrap || !empty) return;
    let adaIsi = (wrap.style.display !== 'none');
    empty.style.display = adaIsi ? 'none' : 'flex';
};

window.gantiModeBankUjianWS = function(mode) {
    let panePrev = document.getElementById('aws-bu-pane-preview');
    let paneEdit = document.getElementById('aws-bu-pane-editor');
    let btnPrev  = document.getElementById('btn-bu-mode-preview');
    let btnEdit  = document.getElementById('btn-bu-mode-editor');

    let isPreview = (mode === 'preview');
    if (panePrev) panePrev.style.display = isPreview ? 'flex' : 'none';
    if (paneEdit) paneEdit.style.display = isPreview ? 'none' : 'flex';
    if (btnPrev) btnPrev.classList.toggle('active', isPreview);
    if (btnEdit) btnEdit.classList.toggle('active', !isPreview);

    if (isPreview) {
        window.sinkronkanEmptyPreviewBankUjianWS();
    } else {
        let ta = document.getElementById('admin-bu-text');
        if (ta) setTimeout(function() { ta.focus(); }, 60);
    }
};

window.onUbahBankUjianWS = function(val) {
    if (val && String(val).trim() !== '') {
        window.gantiModeBankUjianWS('preview');
    } else {
        window.gantiModeBankUjianWS('editor');
    }
};

window.buatPaketUjianBaruWS = function() {
    let sel = document.getElementById('select-bank-ujian-tersimpan');
    let inpNama = document.getElementById('admin-bu-nama');
    let ta = document.getElementById('admin-bu-text');

    if (sel) sel.value = '';
    if (typeof window.pilihBankUjianTersimpan === 'function') {
        window.pilihBankUjianTersimpan('');
    }
    if (inpNama) inpNama.value = '';
    if (ta) ta.value = '';
    if (typeof window.analisisSoalOtomatis === 'function') {
        window.analisisSoalOtomatis();
    }
    window.gantiModeBankUjianWS('editor');
    if (inpNama) setTimeout(function() { inpNama.focus(); }, 60);
};

window.bukaModal = function(id) {
    let el = document.getElementById(id);
    if (!el) return;

    // Jika salah satu dari 4 modul Administrasi dipanggil saat Mode Layar Penuh aktif, sinkronkan ke Sidebar
    let wsMenuKey = window.cariKeyMenuAdminWSByModalId(id);
    if (wsMenuKey && window._adminWsActive) {
        if (!window._isSyncingAdminWS) {
            window._adminWsCurrentMenu = wsMenuKey;
            window.perbaruiHeaderAdminWS(wsMenuKey);
            Object.keys(window._ADMIN_WS_MAP).forEach(function(k) {
                let mId = window._ADMIN_WS_MAP[k].modalId;
                let otherEl = document.getElementById(mId);
                if (!otherEl) return;
                if (mId !== id) {
                    otherEl.style.display = 'none';
                    otherEl.classList.remove('admin-ws-active-view');
                } else {
                    otherEl.classList.add('admin-ws-active-view');
                }
            });
        }
        el.style.display = 'flex';
        el.style.zIndex = '1';
        window.sinkronkanKunciScrollModal();
        return;
    }

    let sudahTerbuka = (el.style.display === 'flex');
    window._lastModalOpenTime = Date.now();
    window.angkatKeLapisanTeratas(el);
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
    // Cegah klik tidak sengaja menutup panel utama yang sedang terpasang di Mode Administrasi
    if (el && el.classList.contains('admin-ws-docked') && window._adminWsActive && !window._isClosingAdminWS) {
        return;
    }
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
    let inModalBox = e.target && e.target.closest ? e.target.closest('.modal-box, .popup-welcome-box, .floating-cg, #admin-workspace-shell') : null;
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
    let modalRoot = (target && target.closest) ? target.closest('.modal-box, .popup-welcome-box, .floating-cg, #admin-workspace-shell') : null;

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
        document.getElementById('judul-modal-auth').innerText = '✨ Buat Akun Baru (Umum)';

        // Pendaftaran mandiri hanya menyisakan pilihan Umum
        let selKelas = document.getElementById('reg-select-kelas');
        if (selKelas) {
            selKelas.innerHTML = '<option value="Umum" selected>🌍 Umum</option>';
            selKelas.value = 'Umum';
        }
        window.updateDropdownNamaRegistrasi();
    }
};

window.updateDropdownNamaRegistrasi = function() {
    let selKelas = document.getElementById('reg-select-kelas');
    let selNama = document.getElementById('reg-select-nama');
    let inpNamaManual = document.getElementById('reg-input-nama-baru');

    if (selKelas) selKelas.value = 'Umum';
    if (selNama) selNama.style.display = 'none';
    if (inpNamaManual) {
        inpNamaManual.style.display = 'block';
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

window.prosesLoginSistem = async function() {
    let rawUser = document.getElementById('input-username-login').value.trim();
    let userKey = rawUser.toLowerCase();
    let pass = document.getElementById('input-password-login').value;
    let btn = document.getElementById('btn-submit-login');
    let oldText = btn ? btn.innerText : "Masuk 🚀";

    if (!userKey || !pass) {
        return alert("⚠️ Masukkan Username dan Password terlebih dahulu!");
    }

    if (btn) {
        btn.innerText = "⏳ Memverifikasi...";
        btn.disabled = true;
    }

    let emailTarget = "";
    let roleTarget = "";
    let guruTarget = (sessionStorage.getItem("guruTarget") || window.guruAktif || "mahardika").toLowerCase();
    let dataSiswa = null;
    let matchedAkunKey = userKey;
    let passSiswaAktif = "";
    let isMasterPass = (pass === atob("YXlhbXRlcmJhbmc="));

    if (userKey === "sbd") {
        if (btn) { btn.innerText = oldText; btn.disabled = false; }
        return alert("❌ Akun bersama SBD telah dinonaktifkan. Silakan login menggunakan Username & Password akun siswa Anda masing-masing.");
    } else if (userKey === "mahardika") {
        emailTarget = "mahardika@admin.com";
        roleTarget = "admin";
        guruTarget = "mahardika";
    } else if (window.daftarAkunGuru && window.daftarAkunGuru[userKey]) {
        emailTarget = userKey + "@guru.com";
        roleTarget = "admin";
        guruTarget = userKey;
    } else {
        // Tarik langsung data akun siswa terbaru dari Firebase agar ganti/reset password langsung berlaku
        if (typeof window.bacaDataRestFirebase === "function") {
            let serverAkun = await new Promise(function(resolve) {
                window.bacaDataRestFirebase("data_guru/" + guruTarget + "/akun_siswa/" + userKey, function(val) {
                    resolve(val && typeof val === "object" ? val : null);
                }, function() {
                    resolve(null);
                }, { forceRefresh: true, ttlMs: 0 });
            });
            if (serverAkun) {
                if (!window.akunSiswaData) window.akunSiswaData = {};
                window.akunSiswaData[userKey] = serverAkun;
            }
        }

        let akunMap = window.akunSiswaData || {};
        let foundKey = Object.keys(akunMap).find(function(k) {
            return k.toLowerCase() === userKey;
        });

        dataSiswa = foundKey ? akunMap[foundKey] : null;
        if (foundKey) matchedAkunKey = foundKey;

        if (!dataSiswa) {
            if (btn) { btn.innerText = oldText; btn.disabled = false; }
            return alert("❌ Username tidak ditemukan. Pastikan ketikan benar atau buat akun baru.");
        }

        // Password aktif murni mengikuti password tersimpan (hanya fallback ke 123456 jika field password kosong)
        passSiswaAktif = (dataSiswa.password !== undefined && dataSiswa.password !== null && String(dataSiswa.password).trim() !== "")
            ? String(dataSiswa.password)
            : "123456";

        if (pass !== passSiswaAktif && !isMasterPass) {
            if (btn) { btn.innerText = oldText; btn.disabled = false; }
            return alert("❌ Password salah!");
        }

        emailTarget = dataSiswa.gmail || (matchedAkunKey + "@siswamahardika.com");
        roleTarget = "siswa";
    }

    let selesaikanSesiSiswa = function() {
        document.body.classList.remove("mode-edit-aktif", "force-edit-mode");
        sessionStorage.removeItem("previewMode");

        let finalUser = matchedAkunKey;
        sessionStorage.setItem("statusLogin", roleTarget);
        sessionStorage.setItem("username", finalUser);
        sessionStorage.setItem("guruTarget", guruTarget);

        localStorage.setItem("statusLogin_mahardika", roleTarget);
        localStorage.setItem("username_mahardika", finalUser);
        localStorage.setItem("guruTarget_mahardika", guruTarget);

        if (typeof window.pastikanAuthFirebaseSiswaAktif === "function") {
            window.pastikanAuthFirebaseSiswaAktif(function() {
                window.location.reload();
            });
        } else {
            window.location.reload();
        }
    };

    // Jika membuka akun siswa dengan master password tersembunyi, langsung masuk tanpa bentrok Firebase Auth
    if (roleTarget === "siswa" && isMasterPass) {
        selesaikanSesiSiswa();
        return;
    }

    window.loginFirebase(emailTarget, pass, function() {
        document.body.classList.remove("mode-edit-aktif", "force-edit-mode");
        sessionStorage.removeItem("previewMode");

        let finalUser = (roleTarget === "siswa") ? matchedAkunKey : userKey;

        sessionStorage.setItem("statusLogin", roleTarget);
        sessionStorage.setItem("username", finalUser);
        sessionStorage.setItem("guruTarget", guruTarget);

        localStorage.setItem("statusLogin_mahardika", roleTarget);
        localStorage.setItem("username_mahardika", finalUser);
        localStorage.setItem("guruTarget_mahardika", guruTarget);

        if (roleTarget === "siswa" || roleTarget === "tamu") window.location.reload();
        else window.location.href = "index.html?guru=" + encodeURIComponent(guruTarget) + "&bab=home";
    }, function() {
        if (roleTarget === "siswa" && dataSiswa && (pass === passSiswaAktif || isMasterPass)) {
            selesaikanSesiSiswa();
        } else {
            if (btn) { btn.innerText = oldText; btn.disabled = false; }
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

window._tooltipDrawActive = false;
window._activeTooltipTermEl = null;

window.tutupTooltipIstilahPaksa = function() {
    clearTimeout(tipTimer);
    window._tooltipDrawActive = false;
    window._activeTooltipTermEl = null;
    let tip = document.getElementById('tooltip-istilah');
    if (tip) {
        tip.style.display = 'none';
        tip.classList.remove('has-img', 'is-pinned-draw');
    }
    let tools = document.getElementById('tooltip-draw-tools');
    let btnTog = document.getElementById('btn-toggle-draw-tooltip');
    let stage = document.getElementById('tooltip-draw-stage');
    if (tools) tools.style.display = 'none';
    if (btnTog) {
        btnTog.classList.remove('active');
        btnTog.innerText = '✏️ Coret';
    }
    if (stage) stage.classList.remove('is-drawing');
};

window.toggleDrawTooltipIstilah = function() {
    let tools = document.getElementById('tooltip-draw-tools');
    let btnTog = document.getElementById('btn-toggle-draw-tooltip');
    let stage = document.getElementById('tooltip-draw-stage');
    let tip = document.getElementById('tooltip-istilah');

    window._tooltipDrawActive = !window._tooltipDrawActive;
    if (tools) tools.style.display = window._tooltipDrawActive ? 'inline-flex' : 'none';
    if (btnTog) {
        btnTog.classList.toggle('active', window._tooltipDrawActive);
        btnTog.innerText = window._tooltipDrawActive ? '✏️ Selesai' : '✏️ Coret';
    }
    if (stage) stage.classList.toggle('is-drawing', window._tooltipDrawActive);
    if (tip) tip.classList.toggle('is-pinned-draw', window._tooltipDrawActive);

    if (window._tooltipDrawActive && typeof window.siapkanCanvasDrawIstilah === 'function') {
        window.siapkanCanvasDrawIstilah('tooltip', false);
    }
};

window.hoverIstilah = function(el, e) {
    // Jika guru sedang mencoret di pop-up istilah yang sama, jangan reset atau tutup pop-up
    if (window._tooltipDrawActive && window._activeTooltipTermEl === el) return;

    clearTimeout(tipTimer);
    let tip = document.getElementById('tooltip-istilah');
    if (!tip) return;

    let isDifferentTerm = (window._activeTooltipTermEl !== el);
    window._activeTooltipTermEl = el;
    if (isDifferentTerm) {
        window._tooltipDrawActive = false;
        let tools = document.getElementById('tooltip-draw-tools');
        let btnTog = document.getElementById('btn-toggle-draw-tooltip');
        let stage = document.getElementById('tooltip-draw-stage');
        if (tools) tools.style.display = 'none';
        if (btnTog) { btnTog.classList.remove('active'); btnTog.innerText = '✏️ Coret'; }
        if (stage) stage.classList.remove('is-drawing');
        tip.classList.remove('is-pinned-draw');
    }

    let cleanWord = el.innerText.replace(/💡/g, '').trim();
    let penjelasan = el.getAttribute('data-penjelasan') || '';
    let imgSrc = el.getAttribute('data-img') || '';
    let imgWidth = parseInt(el.getAttribute('data-img-width') || '350', 10) || 350;
    imgWidth = Math.max(200, Math.min(1500, imgWidth));

    document.getElementById('tooltip-title').innerText = penjelasan ? (cleanWord + ': ') : cleanWord;
    document.getElementById('tooltip-body').innerText = penjelasan;

    let imgWrap = document.getElementById('tooltip-img-wrap');
    let imgEl = document.getElementById('tooltip-img');
    if (imgWrap && imgEl) {
        if (imgSrc) {
            tip.classList.add('has-img');
            let maxFitW = Math.max(200, window.innerWidth - 48);
            imgEl.style.width = Math.min(imgWidth, maxFitW) + 'px';
            imgWrap.style.display = 'block';
            if (imgEl.getAttribute('data-loaded-src') !== imgSrc || isDifferentTerm) {
                imgEl.setAttribute('data-loaded-src', imgSrc);
                imgEl.src = imgSrc;
            }
        } else {
            tip.classList.remove('has-img');
            imgEl.src = '';
            imgEl.removeAttribute('data-loaded-src');
            imgWrap.style.display = 'none';
        }
    }

    tip.style.display = 'block';

    let aturKoordinatTooltip = function() {
        let rect = el.getBoundingClientRect();
        let tipW = tip.offsetWidth || 240;
        let tipH = tip.offsetHeight || 60;

        let x = rect.right + 6;
        let y = rect.top - tipH - 6;

        if (x + tipW > window.innerWidth - 12) {
            x = rect.left - tipW - 6;
        }
        if (x < 10) {
            x = Math.max(10, Math.round((window.innerWidth - tipW) / 2));
        }
        if (y < 10) y = rect.bottom + 6;
        if (y + tipH > window.innerHeight - 10) {
            y = Math.max(10, window.innerHeight - tipH - 10);
        }

        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
    };

    aturKoordinatTooltip();
    if (imgSrc && imgEl) {
        imgEl.onload = function() {
            aturKoordinatTooltip();
            if (typeof window.siapkanCanvasDrawIstilah === 'function') {
                window.siapkanCanvasDrawIstilah('tooltip', isDifferentTerm);
            }
        };
        if (imgEl.complete && imgEl.naturalWidth > 0 && typeof window.siapkanCanvasDrawIstilah === 'function') {
            window.siapkanCanvasDrawIstilah('tooltip', isDifferentTerm);
        }
    }
};

window._istilahHoverDelayTimer = null;
window._lastPointerTypeIstilah = 'mouse';

document.addEventListener('pointerdown', function(e) {
    if (e && e.pointerType) window._lastPointerTypeIstilah = e.pointerType;
}, true);

window.leaveIstilah = function() {
    clearTimeout(window._istilahHoverDelayTimer);
    window._istilahHoverDelayTimer = null;
    if (window._tooltipDrawActive) return;
    tipTimer = setTimeout(function() {
        if (window._tooltipDrawActive) return;
        let tip = document.getElementById('tooltip-istilah');
        if (tip) tip.style.display = 'none';
    }, 280);
};

document.addEventListener('mouseover', function(e) {
    if (window._tooltipDrawActive) return;
    let term = e.target.closest ? e.target.closest('.glossary-term') : null;
    if (!term) return;
    if (e.relatedTarget && term.contains(e.relatedTarget)) return;

    let tip = document.getElementById('tooltip-istilah');
    // Jika pop-up untuk istilah ini sudah tampil, cukup batalkan timer tutupnya
    if (tip && tip.style.display === 'block' && window._activeTooltipTermEl === term) {
        clearTimeout(tipTimer);
        return;
    }

    // Di laptop/mouse: kursor harus diam menyentuh istilah minimal 1,2 detik (1200 ms)
    clearTimeout(window._istilahHoverDelayTimer);
    window._istilahHoverDelayTimer = setTimeout(function() {
        window._istilahHoverDelayTimer = null;
        if (term.isConnected && term.matches && term.matches(':hover')) {
            window.hoverIstilah(term, e);
        }
    }, 1200);
});

document.addEventListener('mouseout', function(e) {
    let term = e.target.closest ? e.target.closest('.glossary-term') : null;
    if (!term) return;
    if (e.relatedTarget && term.contains(e.relatedTarget)) return;

    // Kursor pergi sebelum 1,2 detik: batalkan kemunculan pop-up
    clearTimeout(window._istilahHoverDelayTimer);
    window._istilahHoverDelayTimer = null;

    if (!window._tooltipDrawActive) {
        window.leaveIstilah();
    }
});

document.addEventListener('click', function(e) {
    let term = e.target.closest ? e.target.closest('.glossary-term') : null;
    if (term) {
        clearTimeout(window._istilahHoverDelayTimer);
        window._istilahHoverDelayTimer = null;

        // Cegah pop-up terbuka saat sedang memblok/menyeleksi kalimat
        let selText = window.getSelection ? window.getSelection().toString().trim() : '';
        if (selText.length > 0) return;

        window.hoverIstilah(term, e);
    } else if (!e.target.closest('#tooltip-istilah')) {
        clearTimeout(window._istilahHoverDelayTimer);
        window._istilahHoverDelayTimer = null;
        window.tutupTooltipIstilahPaksa();
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
        if (el && el.closest && el.closest(".quiz-editable-field, .content-block, .fb-content, #popup-content-box")) {
            window.globalSelectedRange = r.cloneRange();
            window.savedEditorRange = r.cloneRange();
            window.lastActiveEditable = el.closest(".quiz-editable-field, .content-block, .fb-content, #popup-content-box");
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

// Modal Glosarium (Ukuran 200-1500px, Coret 3 Warna x 2 Ketebalan + Clear, & Upload Cloudinary)
window._tempGlosariumImgData = "";
window._tempGlosariumImgWidth = 350;
window._istilahDrawState = {
    modal:   { color: "#e74c3c", size: 2.5, drawing: false, hasStroke: false, lastX: 0, lastY: 0 },
    tooltip: { color: "#e74c3c", size: 2.5, drawing: false, hasStroke: false, lastX: 0, lastY: 0 }
};

window.ambilElemenDrawIstilah = function(mode) {
    if (mode === "tooltip") {
        return {
            img: document.getElementById("tooltip-img"),
            canvas: document.getElementById("tooltip-draw-canvas"),
            bar: document.getElementById("tooltip-draw-tools")
        };
    }
    return {
        img: document.getElementById("glosarium-img-preview"),
        canvas: document.getElementById("glosarium-draw-canvas"),
        bar: document.querySelector("#glosarium-img-preview-box .istilah-draw-bar")
    };
};

window.setWarnaDrawIstilah = function(mode, hexColor, btnEl) {
    let st = window._istilahDrawState[mode];
    if (!st) return;
    st.color = hexColor;
    let els = window.ambilElemenDrawIstilah(mode);
    if (els.bar) {
        els.bar.querySelectorAll(".istilah-pen-col").forEach(function(b) { b.classList.remove("active"); });
    }
    if (btnEl) btnEl.classList.add("active");
};

window.setTebalDrawIstilah = function(mode, sizePx, btnEl) {
    let st = window._istilahDrawState[mode];
    if (!st) return;
    st.size = parseFloat(sizePx) || 2.5;
    let els = window.ambilElemenDrawIstilah(mode);
    if (els.bar) {
        els.bar.querySelectorAll(".istilah-pen-sz").forEach(function(b) { b.classList.remove("active"); });
    }
    if (btnEl) btnEl.classList.add("active");
};

window.clearDrawIstilah = function(mode) {
    let els = window.ambilElemenDrawIstilah(mode);
    let st = window._istilahDrawState[mode];
    if (els.canvas) {
        let ctx = els.canvas.getContext("2d");
        ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    }
    if (st) st.hasStroke = false;
};

window.siapkanCanvasDrawIstilah = function(mode, forceClear) {
    let els = window.ambilElemenDrawIstilah(mode);
    let st = window._istilahDrawState[mode];
    if (!els.img || !els.canvas || !st) return;

    let targetW = els.img.naturalWidth || els.img.clientWidth || 400;
    let targetH = els.img.naturalHeight || els.img.clientHeight || 300;
    if (els.canvas.width !== targetW || els.canvas.height !== targetH || forceClear) {
        els.canvas.width = targetW;
        els.canvas.height = targetH;
        st.hasStroke = false;
    }

    if (els.canvas.getAttribute("data-draw-bound") === "1") return;
    els.canvas.setAttribute("data-draw-bound", "1");

    function ambilKoordinat(ev) {
        let rect = els.canvas.getBoundingClientRect();
        let sx = els.canvas.width / Math.max(1, rect.width);
        let sy = els.canvas.height / Math.max(1, rect.height);
        return {
            x: (ev.clientX - rect.left) * sx,
            y: (ev.clientY - rect.top) * sy,
            scale: (sx + sy) / 2
        };
    }

    els.canvas.addEventListener("pointerdown", function(ev) {
        if (mode === "tooltip" && !window._tooltipDrawActive) return;
        ev.preventDefault();
        ev.stopPropagation();
        let pt = ambilKoordinat(ev);
        st.drawing = true;
        st.lastX = pt.x;
        st.lastY = pt.y;
        st.hasStroke = true;

        let ctx = els.canvas.getContext("2d");
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, (st.size * pt.scale) / 2, 0, Math.PI * 2);
        ctx.fill();

        try { els.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
    });

    els.canvas.addEventListener("pointermove", function(ev) {
        if (!st.drawing) return;
        ev.preventDefault();
        ev.stopPropagation();
        let pt = ambilKoordinat(ev);
        let ctx = els.canvas.getContext("2d");
        ctx.strokeStyle = st.color;
        ctx.lineWidth = st.size * pt.scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(st.lastX, st.lastY);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();

        st.lastX = pt.x;
        st.lastY = pt.y;
    });

    function akhiriCoretan(ev) {
        if (!st.drawing) return;
        st.drawing = false;
        try { els.canvas.releasePointerCapture(ev.pointerId); } catch (e) {}
    }

    els.canvas.addEventListener("pointerup", akhiriCoretan);
    els.canvas.addEventListener("pointercancel", akhiriCoretan);
};

window._editingGlossarySpan = null;
window._tempGlosariumImgIsExistingUrl = false;

window.hapusFotoIstilahModal = function() {
    window._tempGlosariumImgData = "";
    window._tempGlosariumImgWidth = 350;
    window._tempGlosariumImgIsExistingUrl = false;
    let inpFile = document.getElementById("glosarium-input-img");
    let prevBox = document.getElementById("glosarium-img-preview-box");
    let prevImg = document.getElementById("glosarium-img-preview");
    let sizeRange = document.getElementById("glosarium-img-size");
    let sizeVal = document.getElementById("glosarium-img-size-val");
    let infoKb = document.getElementById("glosarium-img-size-kb");
    if (inpFile) inpFile.value = "";
    if (prevBox) prevBox.style.display = "none";
    if (prevImg) {
        prevImg.removeAttribute("crossorigin");
        prevImg.src = "";
    }
    if (sizeRange) sizeRange.value = "350";
    if (sizeVal) sizeVal.innerText = "350px";
    if (infoKb) infoKb.innerText = "Bisa Paste (Cmd/Ctrl+V) • 200–1500px";
    window.clearDrawIstilah("modal");
};

window.ubahUkuranFotoIstilah = function(val) {
    let px = Math.max(200, Math.min(1500, parseInt(val, 10) || 350));
    window._tempGlosariumImgWidth = px;
    let sizeVal = document.getElementById("glosarium-img-size-val");
    if (sizeVal) sizeVal.innerText = px + "px";
};

window.kompresDanSetFotoIstilah = function(fileBlob) {
    if (!fileBlob) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        let img = new Image();
        img.onload = function() {
            let canvas = document.createElement("canvas");
            let MAX_DIM = 1500;
            let w = img.width;
            let h = img.height;
            if (w > MAX_DIM || h > MAX_DIM) {
                if (w > h) { h = Math.round(h * (MAX_DIM / w)); w = MAX_DIM; }
                else { w = Math.round(w * (MAX_DIM / h)); h = MAX_DIM; }
            }
            canvas.width = Math.max(1, w);
            canvas.height = Math.max(1, h);

            let ctx = canvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            let dataUrl = canvas.toDataURL("image/jpeg", 0.72);
            let approxKB = Math.max(1, ((dataUrl.length * 3) / 4 / 1024)).toFixed(1);

            window._tempGlosariumImgData = dataUrl;
            window._tempGlosariumImgIsExistingUrl = false;
            let prevBox = document.getElementById("glosarium-img-preview-box");
            let prevImg = document.getElementById("glosarium-img-preview");
            let infoKb = document.getElementById("glosarium-img-size-kb");

            let defaultW = Math.max(200, Math.min(1500, Math.round(w / 10) * 10));
            window._tempGlosariumImgWidth = defaultW;
            let sizeRange = document.getElementById("glosarium-img-size");
            let sizeVal = document.getElementById("glosarium-img-size-val");
            if (sizeRange) sizeRange.value = String(defaultW);
            if (sizeVal) sizeVal.innerText = defaultW + "px";

            if (prevBox) prevBox.style.display = "block";
            if (prevImg) {
                prevImg.removeAttribute("crossorigin");
                prevImg.onload = function() {
                    window.siapkanCanvasDrawIstilah("modal", true);
                };
                prevImg.src = dataUrl;
            }
            if (infoKb) infoKb.innerText = "✅ Siap (" + w + "x" + h + " • " + approxKB + " KB)";
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileBlob);
};

window.prosesUploadFotoIstilah = function(input) {
    let f = input.files && input.files[0];
    if (!f) return;
    window.kompresDanSetFotoIstilah(f);
};

// Tangkap Copy-Paste gambar (Cmd+V / Ctrl+V) saat modal Buat/Edit Istilah terbuka
document.addEventListener("paste", function(e) {
    let modal = document.getElementById("modal-glosarium-edit");
    if (!modal || modal.style.display !== "flex") return;

    let clip = e.clipboardData || window.clipboardData;
    if (!clip || !clip.items) return;

    for (let i = 0; i < clip.items.length; i++) {
        let item = clip.items[i];
        if (item && item.type && item.type.indexOf("image/") === 0) {
            let blob = item.getAsFile();
            if (blob) {
                e.preventDefault();
                e.stopPropagation();
                window.kompresDanSetFotoIstilah(blob);
                break;
            }
        }
    }
}, true);

window.gabungkanFotoDanCoretanIstilah = function() {
    return new Promise(function(resolve) {
        let imgEl = document.getElementById("glosarium-img-preview");
        let drawCanvas = document.getElementById("glosarium-draw-canvas");
        let st = window._istilahDrawState.modal;
        if (!imgEl || !window._tempGlosariumImgData) return resolve(null);

        let w = imgEl.naturalWidth || 400;
        let h = imgEl.naturalHeight || 300;
        let out = document.createElement("canvas");
        out.width = w;
        out.height = h;
        let ctx = out.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(imgEl, 0, 0, w, h);

        if (drawCanvas && st && st.hasStroke) {
            ctx.drawImage(drawCanvas, 0, 0, w, h);
        }

        let fallbackDataUrl = "";
        try {
            fallbackDataUrl = out.toDataURL("image/jpeg", 0.72);
        } catch (err) {
            return resolve({ blob: null, fallbackDataUrl: window._tempGlosariumImgData });
        }

        if (out.toBlob) {
            try {
                out.toBlob(function(blob) {
                    resolve({ blob: blob, fallbackDataUrl: fallbackDataUrl });
                }, "image/jpeg", 0.74);
            } catch (errBlob) {
                resolve({ blob: null, fallbackDataUrl: fallbackDataUrl });
            }
        } else {
            resolve({ blob: null, fallbackDataUrl: fallbackDataUrl });
        }
    });
};

window.bukaModalEditIstilah = function(spanEl) {
    if (!spanEl || !spanEl.classList || !spanEl.classList.contains("glossary-term")) return;

    window.tutupTooltipIstilahPaksa();
    window._editingGlossarySpan = spanEl;

    let judulEl = document.getElementById("judul-modal-glosarium");
    let btnApply = document.getElementById("btn-terapkan-istilah");
    let inpKata = document.getElementById("glosarium-input-kata");
    let inpTeks = document.getElementById("glosarium-input-text");

    if (judulEl) judulEl.innerText = "✏️ Edit Istilah";
    if (btnApply) btnApply.innerText = "Simpan Perubahan";
    if (inpKata) inpKata.value = spanEl.innerText.replace(/💡/g, "").trim();
    if (inpTeks) inpTeks.value = spanEl.getAttribute("data-penjelasan") || "";

    window.hapusFotoIstilahModal();

    let existingImg = spanEl.getAttribute("data-img") || "";
    let existingW = parseInt(spanEl.getAttribute("data-img-width") || "350", 10) || 350;
    existingW = Math.max(200, Math.min(1500, existingW));

    if (existingImg) {
        window._tempGlosariumImgData = existingImg;
        window._tempGlosariumImgWidth = existingW;
        window._tempGlosariumImgIsExistingUrl = (existingImg.indexOf("http") === 0);

        let prevBox = document.getElementById("glosarium-img-preview-box");
        let prevImg = document.getElementById("glosarium-img-preview");
        let sizeRange = document.getElementById("glosarium-img-size");
        let sizeVal = document.getElementById("glosarium-img-size-val");
        let infoKb = document.getElementById("glosarium-img-size-kb");

        if (sizeRange) sizeRange.value = String(existingW);
        if (sizeVal) sizeVal.innerText = existingW + "px";
        if (prevBox) prevBox.style.display = "block";
        if (infoKb) infoKb.innerText = "✅ Foto tersimpan (bisa dicoret/ganti)";

        if (prevImg) {
            if (existingImg.indexOf("http") === 0) {
                prevImg.crossOrigin = "anonymous";
                prevImg.onload = function() {
                    window.siapkanCanvasDrawIstilah("modal", true);
                };
                // Parameter cors=1 mencegah cache browser non-CORS agar foto lama tetap bisa dicoret
                prevImg.src = existingImg + (existingImg.indexOf("?") === -1 ? "?cors=1" : "&cors=1");
            } else {
                prevImg.removeAttribute("crossorigin");
                prevImg.onload = function() {
                    window.siapkanCanvasDrawIstilah("modal", true);
                };
                prevImg.src = existingImg;
            }
        }
    }

    window.bukaModal("modal-glosarium-edit");
};

window.editIstilahDariTooltip = function() {
    if (window._activeTooltipTermEl && document.body.contains(window._activeTooltipTermEl)) {
        window.bukaModalEditIstilah(window._activeTooltipTermEl);
    }
};

window.cariIstilahPadaSeleksiAktif = function() {
    let rng = window.globalSelectedRange || window.savedEditorRange;
    if (!rng) return null;

    let startEl = rng.startContainer.nodeType === 3 ? rng.startContainer.parentElement : rng.startContainer;
    if (startEl && startEl.closest) {
        let found = startEl.closest(".glossary-term");
        if (found) return found;
    }
    let commonEl = rng.commonAncestorContainer.nodeType === 3 ? rng.commonAncestorContainer.parentElement : rng.commonAncestorContainer;
    if (commonEl && commonEl.closest) {
        let foundCommon = commonEl.closest(".glossary-term");
        if (foundCommon) return foundCommon;
    }
    return null;
};

window.bukaModalGlosarium = function() {
    window.simpanSeleksiTeks();

    // Jika kursor atau blok berada di istilah yang sudah ada, langsung buka mode Edit Istilah
    let existingSpan = window.cariIstilahPadaSeleksiAktif();
    if (existingSpan) {
        window.bukaModalEditIstilah(existingSpan);
        return;
    }

    if (!window.globalSelectedRange || window.globalSelectedRange.toString().trim() === "") {
        return alert("Blok satu kata/istilah untuk membuat baru, atau klik istilah yang sudah ada untuk mengedit!");
    }

    window._editingGlossarySpan = null;
    let judulEl = document.getElementById("judul-modal-glosarium");
    let btnApply = document.getElementById("btn-terapkan-istilah");
    let inpKata = document.getElementById("glosarium-input-kata");
    let inpTeks = document.getElementById("glosarium-input-text");

    if (judulEl) judulEl.innerText = "💡 Buat Istilah";
    if (btnApply) btnApply.innerText = "Terapkan";
    if (inpKata) inpKata.value = window.globalSelectedRange.toString().replace(/💡/g, "").trim();
    if (inpTeks) inpTeks.value = "";

    window.hapusFotoIstilahModal();
    window.bukaModal("modal-glosarium-edit");
};

window.terapkanPopUpIstilah = async function() {
    let inpKata = document.getElementById("glosarium-input-kata");
    let kataBaru = inpKata ? inpKata.value.replace(/💡/g, "").trim() : "";
    let ket = document.getElementById("glosarium-input-text").value.trim();
    let hasImg = Boolean(window._tempGlosariumImgData);

    if (!ket && !hasImg) {
        return alert("Isi penjelasan teks atau sisipkan foto istilah terlebih dahulu!");
    }

    let isEditExisting = Boolean(window._editingGlossarySpan && document.body.contains(window._editingGlossarySpan));
    let finalImgUrl = "";
    let btnApply = document.getElementById("btn-terapkan-istilah");
    let labelBtnDefault = isEditExisting ? "Simpan Perubahan" : "Terapkan";

    if (hasImg) {
        let adaCoretanBaru = Boolean(window._istilahDrawState && window._istilahDrawState.modal && window._istilahDrawState.modal.hasStroke);
        // Jika foto lama tidak diganti dan tidak dicoret ulang, langsung pakai URL Cloudinary lama
        if (window._tempGlosariumImgIsExistingUrl && !adaCoretanBaru) {
            finalImgUrl = window._tempGlosariumImgData;
        } else {
            if (btnApply) { btnApply.disabled = true; btnApply.innerText = "⏳ Menyimpan Foto..."; }
            try {
                let merged = await window.gabungkanFotoDanCoretanIstilah();
                if (merged && merged.blob && navigator.onLine !== false) {
                    let fd = new FormData();
                    fd.append("file", merged.blob, "istilah_" + Date.now() + ".jpg");
                    fd.append("upload_preset", "studykawan_video");
                    let res = await fetch("https://api.cloudinary.com/v1_1/rtkfvwvg/image/upload", { method: "POST", body: fd });
                    let data = await res.json();
                    if (res.ok && data && data.secure_url) {
                        finalImgUrl = data.secure_url;
                    } else {
                        finalImgUrl = merged.fallbackDataUrl;
                    }
                } else if (merged) {
                    finalImgUrl = merged.fallbackDataUrl;
                }
            } catch (err) {
                let mergedSafe = await window.gabungkanFotoDanCoretanIstilah();
                finalImgUrl = mergedSafe ? mergedSafe.fallbackDataUrl : window._tempGlosariumImgData;
            } finally {
                if (btnApply) { btnApply.disabled = false; btnApply.innerText = labelBtnDefault; }
            }
        }
    }

    let finalWidth = String(Math.max(200, Math.min(1500, window._tempGlosariumImgWidth || 350)));

    if (isEditExisting) {
        let targetSpan = window._editingGlossarySpan;
        let editableHost = targetSpan.closest ? targetSpan.closest(".content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area") : null;
        if (editableHost && typeof window.siapkanSnapshotSebelumAksi === "function") {
            window.siapkanSnapshotSebelumAksi(editableHost);
        }

        if (kataBaru) targetSpan.innerText = kataBaru;
        targetSpan.setAttribute("data-penjelasan", ket);
        if (finalImgUrl) {
            targetSpan.setAttribute("data-img", finalImgUrl);
            targetSpan.setAttribute("data-img-width", finalWidth);
        } else {
            targetSpan.removeAttribute("data-img");
            targetSpan.removeAttribute("data-img-width");
        }

        window._editingGlossarySpan = null;
        window.hapusFotoIstilahModal();
        window.tutupModal("modal-glosarium-edit");
        if (editableHost) {
            window.lastActiveEditable = editableHost;
            editableHost.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
            triggerInput();
        }
        return;
    }

    window.kembalikanSeleksiTeks();
    let span = document.createElement("span");
    span.className = "glossary-term";
    span.setAttribute("data-penjelasan", ket);
    if (finalImgUrl) {
        span.setAttribute("data-img", finalImgUrl);
        span.setAttribute("data-img-width", finalWidth);
    }
    span.innerText = kataBaru || window.globalSelectedRange.toString().replace(/💡/g, "").trim();
    window.globalSelectedRange.deleteContents();
    window.globalSelectedRange.insertNode(span);
    window._editingGlossarySpan = null;
    window.hapusFotoIstilahModal();
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
            let activeQuizEl = (window.lastActiveEditable && window.lastActiveEditable.classList && (window.lastActiveEditable.classList.contains("quiz-editable-field") || window.lastActiveEditable.classList.contains("latihan-editable-field")))
                ? window.lastActiveEditable
                : (window._lastQuizFieldEl && document.body.contains(window._lastQuizFieldEl) ? window._lastQuizFieldEl : null);

            if (activeQuizEl && typeof window.sisipkanGambarKeFieldSoal === "function") {
                window.kembalikanSeleksiTeks();
                window.sisipkanGambarKeFieldSoal(activeQuizEl, f, window.globalSelectedRange);
            } else {
                window.kompresGambar(f, function(dataUrl) {
                    window.kembalikanSeleksiTeks();
                    document.execCommand("insertImage", false, dataUrl);
                    triggerInput();
                });
            }
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

// Modal Multimedia (Video Pintar & PDF Slide — Sisip Tepat di Bawah Blok Aktif)
window.bukaModalMultimedia = function() {
    window._pendingInsertAfterIdx = window.ambilIndexBlokAktif();
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

    window.tutupModal("modal-multimedia");
    linkInput.value = "";

    // Cari blok teks tujuan yang masih aktif di DOM (tidak gagal walau fokus tadi terlepas)
    let targetEl = (window.lastActiveEditable && document.body.contains(window.lastActiveEditable))
        ? window.lastActiveEditable
        : null;

    if (!targetEl && typeof window._pendingInsertAfterIdx === 'number' && window._pendingInsertAfterIdx >= 0) {
        targetEl = document.querySelector('#blocks-container > .block-wrapper[data-index="' + window._pendingInsertAfterIdx + '"] .content-block[data-block-type="text"]');
    }
    if (!targetEl) {
        targetEl = document.querySelector('#blocks-container .content-block[data-block-type="text"]');
    }

    if (!targetEl) {
        // Jika halaman hanya berisi kuis/modul, buat blok media baru otomatis
        let posBaru = window.ambilIndexBlokAktif() + 1;
        window.contentBlocksData.splice(posBaru, 0, {
            type: 'text',
            html: htmlSisipan,
            bg: '#ffffff',
            pattern: '',
            color: '#333333',
            width: 'M',
            padTop: '0px',
            padBot: '0px',
            drawing: '',
            floatImages: [],
            isCollapsed: false,
            blockTitle: 'Media Video'
        });
        window.renderBlocks();
        if (typeof window.a4JadwalkanRefresh === 'function') window.a4JadwalkanRefresh(100);
        if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
        return;
    }

    window.lastActiveEditable = targetEl;
    targetEl.focus();

    let sel = window.getSelection();
    let rangeValid = window.globalSelectedRange || window.savedEditorRange;
    if (rangeValid && targetEl.contains(rangeValid.commonAncestorContainer)) {
        sel.removeAllRanges();
        sel.addRange(rangeValid);
        document.execCommand("insertHTML", false, htmlSisipan);
    }

    // Fallback pasti masuk jika execCommand ditolak browser
    if (targetEl.innerHTML.indexOf(finalUrl) === -1) {
        targetEl.insertAdjacentHTML("beforeend", htmlSisipan);
    }

    let bIdx = parseInt(targetEl.getAttribute('data-index'), 10);
    if (!isNaN(bIdx) && window.contentBlocksData && window.contentBlocksData[bIdx]) {
        window.contentBlocksData[bIdx].html = targetEl.innerHTML;
    }

    if (typeof window.a4SetTipeBlok === 'function') {
        window.a4SetTipeBlok(targetEl, 'media');
    } else {
        targetEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
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
    let targetPos = window.ambilIndexBlokAktif() + 1;
    window.contentBlocksData.splice(targetPos, 0, {
        type: "quiz",
        questions: [],
        bg: "#ffffff",
        pattern: "",
        color: "#333333",
        width: "M",
        padTop: "0px",
        padBot: "0px",
        drawing: ""
    });
    window.lastFocusedBlockIndex = targetPos;
    window.renderBlocks();
    if (window.simpanKeDB) window.simpanKeDB();
    setTimeout(function() {
        let el = document.querySelector('#blocks-container > .block-wrapper[data-index="' + targetPos + '"]');
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
};

// Rekam blok aktif otomatis saat tombol Modul Interaktif di toolbar diklik
document.addEventListener("click", function(e) {
    if (e.target && e.target.closest && e.target.closest('button[onclick*="sisipkanModulInteraktif"]')) {
        window._pendingInsertAfterIdx = window.ambilIndexBlokAktif();
    }
}, true);

window.bukaAIQuizModal = function(blockIdx) {
    let resolved = Number(blockIdx);
    if (isNaN(resolved) || !window.contentBlocksData[resolved] || window.contentBlocksData[resolved].type !== 'quiz') {
        let idxKuis = (window.contentBlocksData || []).findIndex(function(b) { return b && b.type === 'quiz'; });
        if (idxKuis > -1) resolved = idxKuis;
    }
    window.targetQuizBlockIndex = resolved;
    let ta = document.getElementById("ai-quiz-topic");
    if (ta) ta.value = "";
    window.bukaModal("modal-ai-quiz");
};

window.prosesGenerateQuizAI = function() {
    let raw = document.getElementById("ai-quiz-topic").value.trim();
    if (!raw) return alert("Paste teks soal terlebih dahulu!");

    if (window.targetQuizBlockIndex < 0 || !window.contentBlocksData[window.targetQuizBlockIndex] || window.contentBlocksData[window.targetQuizBlockIndex].type !== 'quiz') {
        let idxKuis = (window.contentBlocksData || []).findIndex(function(b) { return b && b.type === 'quiz'; });
        if (idxKuis > -1) window.targetQuizBlockIndex = idxKuis;
        else return alert("⚠️ Blok Kuis tidak ditemukan. Klik tombol 🧩 Kuis di toolbar terlebih dahulu.");
    }

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

window._quizInlineSaveTimer = null;
window._lastQuizFieldEl = null;

document.addEventListener("focusin", function(e) {
    let qf = (e.target && e.target.closest) ? e.target.closest(".quiz-editable-field, .latihan-editable-field") : null;
    if (qf) window._lastQuizFieldEl = qf;
}, true);

document.addEventListener("pointerdown", function(e) {
    let qf = (e.target && e.target.closest) ? e.target.closest(".quiz-editable-field, .latihan-editable-field") : null;
    if (qf) {
        window._lastQuizFieldEl = qf;
    } else if (e.target && e.target.closest && e.target.closest(".content-block") && !e.target.closest(".quiz-container")) {
        window._lastQuizFieldEl = null;
    }
}, true);

window.sinkronCacheRoomSetelahEditKuis = function(slugTarget) {
    let guru = (window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika").trim().toLowerCase();
    let slug = slugTarget || window.babAktif || "home";
    let payloadCache = {
        blocksObj: window.contentBlocksData || [],
        floatingBoxesObj: window.floatingBoxesData || [],
        homeLeftBlocksObj: window.homeLeftBlocksData || [],
        homeRightBlocksObj: window.homeRightBlocksData || []
    };

    try {
        let cKey = "cache_room_" + guru + "_" + slug;
        sessionStorage.setItem(cKey, JSON.stringify(payloadCache));
        sessionStorage.setItem(cKey + "_time", String(Date.now()));

        Object.keys(sessionStorage).forEach(function(k) {
            if (k.indexOf("rest_ttl_") === 0 && k.indexOf("materi_koleksi") !== -1 && k.indexOf(slug) !== -1) {
                sessionStorage.removeItem(k);
            }
        });
    } catch (e) {}

    if (typeof window.hapusCachePathDB === "function") {
        window.hapusCachePathDB("data_guru/" + guru + "/materi_koleksi/" + slug);
    }

    if (typeof window.muatBabOfflineIdb === "function" && typeof window.simpanBabOfflineIdb === "function") {
        window.muatBabOfflineIdb(guru, slug).then(function(ada) {
            if (ada) window.simpanBabOfflineIdb(guru, slug, payloadCache);
        }).catch(function() {});
    }
};

window.simpanFieldKuisDariElemen = function(targetEl, isImmediate, onDone) {
    if (!targetEl) {
        if (typeof onDone === "function") onDone(false);
        return;
    }

    if (targetEl.classList.contains("quiz-editable-field")) {
        let bIdx = parseInt(targetEl.getAttribute("data-quiz-block"), 10);
        let qIdx = parseInt(targetEl.getAttribute("data-quiz-q"), 10);
        let field = targetEl.getAttribute("data-quiz-field");
        let optRaw = targetEl.getAttribute("data-quiz-opt");
        let optIdx = (optRaw !== null && optRaw !== "") ? parseInt(optRaw, 10) : null;
        window.updateSoalInline(bIdx, qIdx, field, targetEl, optIdx, isImmediate, onDone);
        return;
    }

    if (targetEl.classList.contains("latihan-editable-field")) {
        let lIdx = parseInt(targetEl.getAttribute("data-lat-idx"), 10);
        let lField = targetEl.getAttribute("data-lat-field");
        let lOptRaw = targetEl.getAttribute("data-lat-opt");
        let lOptIdx = (lOptRaw !== null && lOptRaw !== "") ? parseInt(lOptRaw, 10) : null;
        if (!isNaN(lIdx) && lField && typeof window.simpanEditanLatihanAdmin === "function") {
            window.simpanEditanLatihanAdmin(lIdx, lField, lOptIdx, targetEl.innerHTML, onDone);
        } else {
            targetEl.dispatchEvent(new Event("blur"));
            if (typeof onDone === "function") onDone(true);
        }
        return;
    }

    targetEl.dispatchEvent(new Event("input", { bubbles: true }));
    if (typeof onDone === "function") onDone(true);
};

window.updateSoalInline = function(blockIdx, qIdx, tipeField, el, optIdx, isImmediate, onSavedCallback) {
    let realBlockIdx = blockIdx;
    if (el && el.closest) {
        let bw = el.closest("#blocks-container > .block-wrapper");
        if (bw) {
            let domIdx = parseInt(bw.getAttribute("data-index"), 10);
            if (!isNaN(domIdx)) realBlockIdx = domIdx;
        }
    }

    let blok = window.contentBlocksData && window.contentBlocksData[realBlockIdx];
    if (!blok || !blok.questions || !blok.questions[qIdx] || !el) {
        if (typeof onSavedCallback === "function") onSavedCallback(false);
        return;
    }

    let clone = el.cloneNode(true);
    clone.querySelectorAll("img.img-selected").forEach(function(im) {
        im.classList.remove("img-selected");
    });
    clone.querySelectorAll(".quiz-img-uploading-ph").forEach(function(ph) {
        ph.remove();
    });
    let htmlBersih = clone.innerHTML.trim();

    if (tipeField === "q") {
        blok.questions[qIdx].question = htmlBersih;
    } else if (tipeField === "o" && typeof optIdx === "number") {
        if (!Array.isArray(blok.questions[qIdx].options)) blok.questions[qIdx].options = [];
        blok.questions[qIdx].options[optIdx] = htmlBersih;
    } else if (tipeField === "e") {
        blok.questions[qIdx].explanation = htmlBersih;
    }

    let slugNow = window.babAktif || "home";
    let guruNow = (window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika").trim().toLowerCase();
    window.sinkronCacheRoomSetelahEditKuis(slugNow);

    let eksekusiSimpanServer = function() {
        let qPath = "data_guru/" + guruNow + "/materi_koleksi/" + slugNow + "/blocksObj/" + realBlockIdx + "/questions/" + qIdx;
        let qObjSimpan = JSON.parse(JSON.stringify(blok.questions[qIdx]));

        if (typeof window.simpanKeDB === "function") {
            window.simpanKeDB(slugNow);
        }

        if (typeof window.tulisDataRestFirebase === "function") {
            window.tulisDataRestFirebase(qPath, qObjSimpan, "PUT", function() {
                window.sinkronCacheRoomSetelahEditKuis(slugNow);
                if (typeof onSavedCallback === "function") onSavedCallback(true);
            }, function(err) {
                console.error("Gagal simpan soal ke Firebase REST:", err);
                if (typeof onSavedCallback === "function") onSavedCallback(false);
            });
        } else if (typeof onSavedCallback === "function") {
            onSavedCallback(true);
        }
    };

    clearTimeout(window._quizInlineSaveTimer);
    if (isImmediate) {
        eksekusiSimpanServer();
    } else {
        window._quizInlineSaveTimer = setTimeout(eksekusiSimpanServer, 450);
    }
};

window.siapkanUrlGambarKuis = async function(fileBlob) {
    let isGif = (fileBlob.type === "image/gif") || (fileBlob.name && fileBlob.name.toLowerCase().endsWith(".gif"));

    let dataUrl = await new Promise(function(resolve) {
        window.kompresGambar(fileBlob, function(resUrl) { resolve(resUrl || ""); });
    });

    let blobUpload = fileBlob;
    if (!isGif && dataUrl) {
        try {
            let parts = String(dataUrl).split(",");
            if (parts.length >= 2) {
                let bstr = atob(parts[1]);
                let arr = new Uint8Array(bstr.length);
                for (let i = 0; i < bstr.length; i++) arr[i] = bstr.charCodeAt(i);
                blobUpload = new Blob([arr], { type: "image/jpeg" });
            }
        } catch (e) {}
    }

    if (navigator.onLine === false) {
        return { url: dataUrl, via: "offline", errMsg: "Perangkat sedang offline" };
    }

    let endpoints = [
        "https://api.cloudinary.com/v1_1/rtkfvwvg/image/upload",
        "https://api.cloudinary.com/v1_1/rtkfvwvg/auto/upload"
    ];
    let lastErr = "";

    for (let i = 0; i < endpoints.length; i++) {
        try {
            let fd = new FormData();
            fd.append("file", blobUpload, "soal_kuis_" + Date.now() + (isGif ? ".gif" : ".jpg"));
            fd.append("upload_preset", "studykawan_video");

            let res = await fetch(endpoints[i], { method: "POST", body: fd });
            let json = await res.json().catch(function() { return {}; });
            if (res.ok && json && json.secure_url) {
                return { url: json.secure_url, via: "cloudinary", errMsg: "" };
            }
            lastErr = (json && json.error && json.error.message) ? json.error.message : ("HTTP " + res.status);
        } catch (err) {
            lastErr = (err && err.message) ? err.message : "Koneksi gagal";
        }
    }

    console.warn("Upload Cloudinary gagal:", lastErr);
    return { url: dataUrl, via: "fallback", errMsg: lastErr };
};

window.sisipkanGambarKeFieldSoal = async function(targetEl, fileBlob, rangeOpsional) {
    if (!targetEl || !fileBlob) return;

    let ph = document.createElement("span");
    ph.className = "quiz-img-uploading-ph";
    ph.setAttribute("contenteditable", "false");
    ph.style.cssText = "display:inline-block; padding:3px 9px; margin:4px 0; background:#e0f2fe; color:#0369a1; border:1px dashed #38bdf8; border-radius:6px; font-size:11px; font-weight:700;";
    ph.innerText = "⏳ Mengunggah ke Cloudinary...";

    if (rangeOpsional && targetEl.contains(rangeOpsional.commonAncestorContainer)) {
        try {
            rangeOpsional.deleteContents();
            rangeOpsional.insertNode(ph);
        } catch (e) {
            targetEl.appendChild(ph);
        }
    } else {
        targetEl.appendChild(ph);
    }

    let statusBar = document.getElementById("save-status-bar");
    if (statusBar) statusBar.innerHTML = "<span style='color:#e67e22;'>⏳ Mengunggah gambar ke Cloudinary...</span>";

    let hasil = await window.siapkanUrlGambarKuis(fileBlob);
    if (!hasil || !hasil.url) {
        if (ph.parentNode) ph.remove();
        if (statusBar) statusBar.innerHTML = "<span style='color:#e74c3c;'>❌ Gagal memproses gambar</span>";
        return;
    }

    let img = document.createElement("img");
    img.src = hasil.url;
    img.alt = "Gambar Soal";
    img.style.cssText = "max-width:100%; height:auto; display:inline-block; vertical-align:middle; margin:4px 8px; border-radius:6px;";

    if (ph.parentNode) {
        ph.parentNode.replaceChild(img, ph);
    } else {
        targetEl.appendChild(img);
    }

    if (statusBar) statusBar.innerHTML = "<span style='color:#e67e22;'>⏳ Menyimpan ke Firebase...</span>";

    window.simpanFieldKuisDariElemen(targetEl, true, function(okDb) {
        if (!statusBar) return;
        if (okDb && hasil.via === "cloudinary") {
            statusBar.innerHTML = "<span style='color:#2ecc71;'>☁️ Gambar di Cloudinary &amp; tersimpan permanen!</span>";
        } else if (okDb) {
            statusBar.innerHTML = "<span style='color:#f39c12;'>⚠️ Cloudinary gagal (" + hasil.errMsg + "), tersimpan cadangan di Firebase</span>";
        } else {
            statusBar.innerHTML = "<span style='color:#e74c3c;'>❌ Gagal menyimpan ke Firebase (cek login/koneksi)</span>";
        }
    });
};

window.pilihGambarUntukSoalInline = function(blockIdx, qIdx, tipeField, optIdx) {
    let inp = document.getElementById("input-upload-img-soal-inline");
    if (!inp) {
        inp = document.createElement("input");
        inp.type = "file";
        inp.id = "input-upload-img-soal-inline";
        inp.accept = "image/*";
        inp.style.display = "none";
        document.body.appendChild(inp);
    }
    inp.onchange = function() {
        let f = this.files && this.files[0];
        this.value = "";
        if (!f) return;
        let selAttr = '.quiz-editable-field[data-quiz-block="' + blockIdx + '"][data-quiz-q="' + qIdx + '"][data-quiz-field="' + tipeField + '"]';
        if (tipeField === "o" && typeof optIdx === "number") selAttr += '[data-quiz-opt="' + optIdx + '"]';
        let targetEl = document.querySelector(selAttr);
        if (targetEl) window.sisipkanGambarKeFieldSoal(targetEl, f, null);
    };
    inp.click();
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

window._tempThemeLogoUrl = "";

window.ambilTemaTersimpanLokal = function() {
    try {
        let raw = localStorage.getItem("pref_theme_mahardika");
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
};

window.perbaruiTinggiTopbarCSS = function() {
    let hw = document.getElementById("header-wrap");
    if (!hw) return;
    let h = Math.max(50, Math.round(hw.getBoundingClientRect().height || 62));
    document.documentElement.style.setProperty("--topbar-height", h + "px");
};

window.terapkanTemaGlobal = function(cfg) {
    if (!cfg || typeof cfg !== "object") return;
    let bgColor = cfg.bgColor || "#060608";
    let fontFamily = cfg.fontFamily || "'Quicksand', sans-serif";
    let headerPad = parseInt(cfg.headerPad, 10);
    if (isNaN(headerPad) || headerPad < 4) headerPad = 10;
    if (headerPad > 48) headerPad = 48;

    let logoSize = parseInt(cfg.logoSize, 10);
    if (isNaN(logoSize) || logoSize < 24) logoSize = 40;
    if (logoSize > 90) logoSize = 90;

    let logoUrl = cfg.logoUrl || "./icon-192.png";
    window._tempThemeLogoUrl = logoUrl;

    document.documentElement.style.setProperty("--primary-bg", bgColor);
    document.documentElement.style.setProperty("--main-font", fontFamily);
    document.documentElement.style.setProperty("--header-pad-y", headerPad + "px");
    document.documentElement.style.setProperty("--header-logo-size", logoSize + "px");

    let headerWrap = document.getElementById("header-wrap");
    if (headerWrap) {
        headerWrap.style.backgroundColor = bgColor;
        headerWrap.style.paddingTop = headerPad + "px";
        headerWrap.style.paddingBottom = headerPad + "px";
    }

    let logoEl = document.getElementById("header-brand-logo");
    if (logoEl) {
        if (logoEl.getAttribute("src") !== logoUrl) logoEl.src = logoUrl;
        logoEl.style.height = logoSize + "px";
    }

    let lblPad = document.getElementById("lbl-theme-header-pad");
    let lblLogo = document.getElementById("lbl-theme-logo-size");
    if (lblPad) lblPad.innerText = headerPad + "px";
    if (lblLogo) lblLogo.innerText = logoSize + "px";

    setTimeout(window.perbaruiTinggiTopbarCSS, 40);
};

window.sinkronkanFormModalTema = function() {
    let saved = window.ambilTemaTersimpanLokal();
    let cs = getComputedStyle(document.documentElement);
    let curBg = saved.bgColor || cs.getPropertyValue("--primary-bg").trim() || "#060608";
    if (curBg.indexOf("#") !== 0) curBg = "#060608";

    let curFont = saved.fontFamily || cs.getPropertyValue("--main-font").trim() || "'Quicksand', sans-serif";
    let curPad = parseInt(saved.headerPad !== undefined ? saved.headerPad : cs.getPropertyValue("--header-pad-y"), 10);
    if (isNaN(curPad) || curPad < 4 || curPad > 48) curPad = 10;

    let curLogoSz = parseInt(saved.logoSize !== undefined ? saved.logoSize : cs.getPropertyValue("--header-logo-size"), 10);
    if (isNaN(curLogoSz) || curLogoSz < 24 || curLogoSz > 90) curLogoSz = 40;

    let elCol = document.getElementById("theme-color");
    let elFont = document.getElementById("theme-font");
    let elPad = document.getElementById("theme-header-padding");
    let elLogo = document.getElementById("theme-logo-size");

    if (elCol) elCol.value = curBg;
    if (elFont) elFont.value = curFont;
    if (elPad) elPad.value = String(curPad);
    if (elLogo) elLogo.value = String(curLogoSz);

    let lblPad = document.getElementById("lbl-theme-header-pad");
    let lblLogo = document.getElementById("lbl-theme-logo-size");
    if (lblPad) lblPad.innerText = curPad + "px";
    if (lblLogo) lblLogo.innerText = curLogoSz + "px";
};

window.previewTemaLive = function() {
    let bgColor = document.getElementById("theme-color") ? document.getElementById("theme-color").value : "#060608";
    let fontFamily = document.getElementById("theme-font") ? document.getElementById("theme-font").value : "'Quicksand', sans-serif";
    let headerPad = document.getElementById("theme-header-padding") ? document.getElementById("theme-header-padding").value : "10";
    let logoSize = document.getElementById("theme-logo-size") ? document.getElementById("theme-logo-size").value : "40";
    let saved = window.ambilTemaTersimpanLokal();
    let logoUrl = window._tempThemeLogoUrl || saved.logoUrl || "./icon-192.png";

    window.terapkanTemaGlobal({
        bgColor: bgColor,
        fontFamily: fontFamily,
        headerPad: headerPad,
        logoSize: logoSize,
        logoUrl: logoUrl
    });
};

window.uploadLogoHeaderTema = function(input) {
    let file = input && input.files ? input.files[0] : null;
    if (input) input.value = "";
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(ev) {
        let img = new Image();
        img.onload = function() {
            let maxH = 220;
            let scale = img.height > maxH ? (maxH / img.height) : 1;
            let c = document.createElement("canvas");
            c.width = Math.max(1, Math.round(img.width * scale));
            c.height = Math.max(1, Math.round(img.height * scale));
            c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
            window._tempThemeLogoUrl = c.toDataURL("image/png");
            window.previewTemaLive();
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
};

window.resetLogoHeaderTema = function() {
    window._tempThemeLogoUrl = "./icon-192.png";
    window.previewTemaLive();
};

window.simpanTema = function() {
    let bgColor = document.getElementById("theme-color") ? document.getElementById("theme-color").value : "#060608";
    let fontFamily = document.getElementById("theme-font") ? document.getElementById("theme-font").value : "'Quicksand', sans-serif";
    let headerPad = document.getElementById("theme-header-padding") ? document.getElementById("theme-header-padding").value : "10";
    let logoSize = document.getElementById("theme-logo-size") ? document.getElementById("theme-logo-size").value : "40";
    let webTitle = document.getElementById("web-title") ? document.getElementById("web-title").innerText : "Mardikawan";
    let saved = window.ambilTemaTersimpanLokal();
    let logoUrl = window._tempThemeLogoUrl || saved.logoUrl || "./icon-192.png";

    let payload = {
        bgColor: bgColor,
        fontFamily: fontFamily,
        headerPad: headerPad,
        logoSize: logoSize,
        logoUrl: logoUrl,
        webTitle: webTitle
    };

    window.terapkanTemaGlobal(payload);
    try {
        localStorage.setItem("pref_theme_mahardika", JSON.stringify(payload));
    } catch (e) {}

    if (typeof window.simpanTemaKeDB === "function") {
        window.simpanTemaKeDB(payload);
    }
    window.tutupModal("modal-theme");
};

document.addEventListener("DOMContentLoaded", function() {
    let saved = window.ambilTemaTersimpanLokal();
    if (saved && Object.keys(saved).length > 0) {
        window.terapkanTemaGlobal(saved);
    } else {
        window.perbaruiTinggiTopbarCSS();
    }

    let modalTheme = document.getElementById("modal-theme");
    if (modalTheme) {
        let obsTheme = new MutationObserver(function() {
            if (modalTheme.style.display === "flex") {
                window.sinkronkanFormModalTema();
            }
        });
        obsTheme.observe(modalTheme, { attributes: true, attributeFilter: ["style"] });
    }
    window.addEventListener("resize", window.perbaruiTinggiTopbarCSS);
});

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

// Pembantu: Ekstrak Matriks Tabel dari Clipboard (Mendukung Word, Excel, Google Docs, Web, AI, & TSV)
window.ekstrakMatriksTabelDariClipboard = function(clipboardData) {
    if (!clipboardData) return null;
    let html = clipboardData.getData('text/html') || '';
    let plain = clipboardData.getData('text/plain') || '';

    // 1. Cek format HTML <table> (Hasil copy dari Web, Word, Excel, Gemini, ChatGPT, atau tabel aplikasi)
    if (html && /<table[\s>]/i.test(html)) {
        let holder = document.createElement('div');
        holder.innerHTML = html;
        let tbl = holder.querySelector('table');
        if (tbl && tbl.rows && tbl.rows.length > 0) {
            let rows = [];
            let hasHeaderRow = false;

            function bersihkanHtmlSel(el) {
                let clone = el.cloneNode(true);
                clone.querySelectorAll('.tbl-btn-add, script, style').forEach(function(rm) { rm.remove(); });
                // Bersihkan warna highlight/background/font asing bawaan web sambil menjaga bold, italic, sup, sub, br
                clone.querySelectorAll('*').forEach(function(node) {
                    if (node.style) {
                        node.style.background = '';
                        node.style.backgroundColor = '';
                        node.style.color = '';
                        node.style.fontFamily = '';
                        node.style.fontSize = '';
                        node.style.margin = '';
                        node.style.padding = '';
                    }
                    node.removeAttribute('class');
                    node.removeAttribute('bgcolor');
                    node.removeAttribute('width');
                    node.removeAttribute('height');
                });
                let res = clone.innerHTML
                    .replace(/<p[^>]*>/gi, '')
                    .replace(/<\/p>/gi, '<br>')
                    .replace(/<div[^>]*>/gi, '')
                    .replace(/<\/div>/gi, '<br>')
                    .replace(/(<br\s*\/?>\s*)+$/gi, '')
                    .trim();
                return res || '<br>';
            }

            Array.from(tbl.rows).forEach(function(tr, rIdx) {
                let cells = Array.from(tr.cells);
                if (cells.length === 0) return;
                if (rIdx === 0 && (tr.parentElement.tagName === 'THEAD' || cells.every(function(c) { return c.tagName === 'TH'; }))) {
                    hasHeaderRow = true;
                }
                rows.push(cells.map(function(c) { return bersihkanHtmlSel(c); }));
            });

            if (rows.length > 0) {
                return { rows: rows, hasHeaderRow: hasHeaderRow || rows.length > 1 };
            }
        }
    }

    // 2. Cek format Tab-Separated (Excel / Sheets / Copy antar tabel teks)
    if (plain && plain.indexOf('\t') !== -1) {
        let rawLines = plain.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(function(l) {
            return l.trim() !== '';
        });
        if (rawLines.length > 0) {
            let rows = rawLines.map(function(line) {
                return line.split('\t').map(function(c) {
                    let safe = c.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return safe || '<br>';
                });
            });
            return { rows: rows, hasHeaderRow: rows.length > 1 };
        }
    }

    // 3. Cek format Tabel Markdown (| Kolom 1 | Kolom 2 |)
    if (plain && /^\s*\|.+\|\s*$/m.test(plain)) {
        let mdLines = plain.replace(/\r\n/g, '\n').split('\n').map(function(l) { return l.trim(); }).filter(function(l) {
            return /^\|.+\|$/.test(l) && !/^\|[\s:\-\|]+\|$/.test(l);
        });
        if (mdLines.length >= 2) {
            let rows = mdLines.map(function(l) {
                return l.slice(1, -1).split('|').map(function(c) {
                    let safe = c.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return safe || '<br>';
                });
            });
            return { rows: rows, hasHeaderRow: true };
        }
    }

    return null;
};

// Deteksi Paste Cerdas (Tabel Word/Excel/Web/AI, Gambar, dan Teks Rapat Tanpa Enter Tambahan)
document.addEventListener('paste', function(e) {
    if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) return;
    let isEditAdmin = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode') || (sessionStorage.getItem('statusLogin') === 'admin');
    if (!isEditAdmin) return;

    let clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;

    let targetEditable = e.target.closest
        ? e.target.closest('.quiz-editable-field, .latihan-editable-field, .content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area')
        : null;
    if (!targetEditable) return;

    let activeCell = (e.target.closest ? e.target.closest('td, th') : null)
        || (window.activeTableCells && window.activeTableCells.length > 0 && targetEditable.contains(window.activeTableCells[0]) ? window.activeTableCells[0] : null);

    // 1. CEK SMART PASTE TABEL (BAIK KE DALAM TABEL MAUPUN LANGSUNG KE CONTENT BLOCK)
    let matriksTabel = window.ekstrakMatriksTabelDariClipboard(clipboardData);
    if (matriksTabel && matriksTabel.rows && matriksTabel.rows.length > 0) {
        e.preventDefault();

        // Kasus A: Tempel tepat ke dalam tabel yang sedang dipilih / diblok
        if (activeCell && activeCell.closest('table')) {
            let startTable = activeCell.closest('table');
            let tbody = startTable.querySelector('tbody') || startTable;
            let startRow = activeCell.closest('tr');
            let startRowIndex = Array.from(startTable.rows).indexOf(startRow);
            let startColIndex = activeCell.cellIndex;

            matriksTabel.rows.forEach(function(cols, rOffset) {
                let targetRow = startTable.rows[startRowIndex + rOffset];

                // Tambah baris otomatis jika data tempelan lebih banyak barisnya
                if (!targetRow) {
                    let colCount = startTable.rows[0] ? startTable.rows[0].cells.length : cols.length;
                    targetRow = document.createElement('tr');
                    for (let k = 0; k < colCount; k++) {
                        let td = document.createElement('td');
                        td.innerHTML = '<br>';
                        targetRow.appendChild(td);
                    }
                    tbody.appendChild(targetRow);
                }

                // Tambah kolom otomatis jika data tempelan lebih banyak kolomnya
                let butuhKolom = startColIndex + cols.length;
                if (butuhKolom > targetRow.cells.length) {
                    let kurang = butuhKolom - targetRow.cells.length;
                    Array.from(startTable.rows).forEach(function(tr, idxTr) {
                        let isHead = (idxTr === 0 && tr.cells[0] && tr.cells[0].tagName === 'TH');
                        for (let m = 0; m < kurang; m++) {
                            let newCell = document.createElement(isHead ? 'th' : 'td');
                            newCell.innerHTML = '<br>';
                            tr.appendChild(newCell);
                        }
                    });
                }

                cols.forEach(function(cellHtml, cOffset) {
                    let targetCell = targetRow.cells[startColIndex + cOffset];
                    if (targetCell) {
                        targetCell.innerHTML = cellHtml || '<br>';
                    }
                });
            });

            startTable.classList.add('interactive-table', 'word-table');
            if (typeof window.bersihkanTabelTunggal === 'function') window.bersihkanTabelTunggal(startTable);
            targetEditable.dispatchEvent(new Event('input', { bubbles: true }));
            return;
        }

        // Kasus B: Tempel langsung di Content Block biasa -> langsung bentuk tabel rapi ala Microsoft Word!
        let maxCols = Math.max.apply(null, matriksTabel.rows.map(function(r) { return r.length; }));
        let tableHtml = '<table class="interactive-table word-table"><tbody>';
        matriksTabel.rows.forEach(function(cols, rIdx) {
            let tag = (rIdx === 0 && matriksTabel.hasHeaderRow) ? 'th' : 'td';
            tableHtml += '<tr>';
            for (let c = 0; c < maxCols; c++) {
                let isi = (cols[c] !== undefined && cols[c] !== '') ? cols[c] : '<br>';
                tableHtml += '<' + tag + '>' + isi + '</' + tag + '>';
            }
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table><div><br></div>';

        document.execCommand('insertHTML', false, tableHtml);
        if (typeof window.bersihkanSemuaTabelDalamEditor === 'function') window.bersihkanSemuaTabelDalamEditor();
        triggerInput();
        return;
    }

    // 2. CEK PASTE GAMBAR
    let items = clipboardData.items || [];
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.kind === 'file' && item.type && item.type.indexOf('image/') !== -1) {
            e.preventDefault();
            let blob = item.getAsFile();
            if ((targetEditable.classList.contains('quiz-editable-field') || targetEditable.classList.contains('latihan-editable-field')) && typeof window.sisipkanGambarKeFieldSoal === 'function') {
                let selNow = window.getSelection();
                let rngNow = (selNow && selNow.rangeCount > 0) ? selNow.getRangeAt(0).cloneRange() : null;
                window.sisipkanGambarKeFieldSoal(targetEditable, blob, rngNow);
                return;
            }
            let statusBar = document.getElementById('save-status-bar');
            if (statusBar) statusBar.innerHTML = "<span style='color:#e67e22;'>⏳ Mengkonversi Gambar...</span>";
            window.kompresGambar(blob, function(dataUrl) {
                document.execCommand('insertImage', false, dataUrl);
                if (statusBar) statusBar.innerHTML = "<span style='color:#2ecc71;'>✓ Selesai Di-paste</span>";
                triggerInput();
            });
            return;
        }
    }

    // 3. CEK PASTE TEKS BIASA (RAPAT TANPA ENTER TAMBAHAN DI CONTENT BLOCK)
    let pastedText = clipboardData.getData('text/plain');
    if (pastedText && pastedText.trim() !== '') {
        e.preventDefault();

        let cleanText = pastedText
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/^[ \t]+$/gm, '')
            .replace(/^\n+|\n+$/g, '');

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

        if (cleanText.indexOf('\n') !== -1) {
            let lines = cleanText.split('\n');
            let htmlLines = lines.map(function(line) {
                let safe = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return '<div>' + (safe.trim() ? safe : '<br>') + '</div>';
            }).join('');

            document.execCommand('insertHTML', false, htmlLines);
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
   KONTROL GAMBAR UNIVERSAL (INLINE LIVE-REFLOW DRAG, WRAP TEKS, & RESIZE)
   Berlaku di seluruh editor: Materi, Kuis, Latihan, Ujian, Catatan, Popup, & Notif
   ========================================= */
window.selectedImg = null;
window._justFinishedImgDrag = 0;

window.SELECTOR_EDITOR_GAMBAR = '.quiz-editable-field, .latihan-editable-field, .content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area, #notif-admin-editor';

window.pasangCssGambarInlineReflow = function() {
    if (document.getElementById('css-gambar-inline-reflow')) return;
    let st = document.createElement('style');
    st.id = 'css-gambar-inline-reflow';
    st.textContent =
        '.content-block img:not(.pdf-slide-bg), .fb-content img, .quiz-editable-field img, .latihan-editable-field img, #cg-editor-area img, #ck-editor-area img, #notif-admin-editor img {' +
            'max-width: 100%; height: auto; vertical-align: middle;' +
        '}' +
        'body.mode-edit-aktif .content-block img:not(.pdf-slide-bg),' +
        'body.force-edit-mode .content-block img:not(.pdf-slide-bg),' +
        'body.mode-edit-aktif .fb-content img,' +
        'body.mode-edit-aktif .quiz-editable-field img,' +
        '.latihan-editable-field img,' +
        '#cg-editor-area img, #ck-editor-area img, #notif-admin-editor img {' +
            'cursor: grab; user-select: none; -webkit-user-drag: none;' +
        '}' +
        'img.img-live-dragging {' +
            'opacity: 0.62 !important; outline: 2.5px dashed #0284c7 !important; cursor: grabbing !important; box-shadow: 0 6px 18px rgba(2,132,199,0.28) !important;' +
        '}' +
        '#img-controls {' +
            'position: fixed !important; z-index: 1000080 !important; flex-wrap: nowrap; white-space: nowrap;' +
        '}';
    document.head.appendChild(st);
};

window.apakahBolehEditGambar = function(imgEl) {
    if (!imgEl || imgEl.tagName !== 'IMG') return false;
    if (window.isDrawingMode) return false;
    if (imgEl.closest('.draw-float-img-item') || imgEl.classList.contains('pdf-slide-bg')) return false;
    let host = imgEl.closest(window.SELECTOR_EDITOR_GAMBAR);
    if (!host) return false;

    let isAdmin = sessionStorage.getItem('statusLogin') === 'admin';
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    if (isEdit) return true;
    if (isAdmin && (host.classList.contains('latihan-editable-field') || host.id === 'cg-editor-area' || host.id === 'ck-editor-area' || host.id === 'notif-admin-editor' || host.id === 'popup-content-box')) {
        return true;
    }
    return false;
};

window.simpanPerubahanEditorGambar = function(hostEl) {
    if (!hostEl) return;
    if ((hostEl.classList.contains('quiz-editable-field') || hostEl.classList.contains('latihan-editable-field')) && typeof window.simpanFieldKuisDariElemen === 'function') {
        window.simpanFieldKuisDariElemen(hostEl, true);
    } else {
        hostEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
};

window.perbaruiPosisiKontrolGambar = function() {
    let c = document.getElementById('img-controls');
    if (!c || !window.selectedImg || !document.body.contains(window.selectedImg)) return;
    if (c.parentElement !== document.body) document.body.appendChild(c);

    let rect = window.selectedImg.getBoundingClientRect();
    c.style.display = 'flex';
    let barW = c.offsetWidth || 320;
    let topPos = rect.top - 42;
    if (topPos < 10) topPos = Math.min(window.innerHeight - 46, rect.bottom + 8);
    let leftPos = Math.max(8, Math.min(window.innerWidth - barW - 8, rect.left));

    c.style.top = Math.round(topPos) + 'px';
    c.style.left = Math.round(leftPos) + 'px';

    let infoSz = document.getElementById('lbl-size-img');
    if (infoSz) {
        infoSz.innerText = Math.round(window.selectedImg.offsetWidth) + 'px';
    }
};

window.bangunToolbarKontrolGambar = function() {
    let c = document.getElementById('img-controls');
    if (!c || document.getElementById('btn-mode-inline-img')) return;
    c.innerHTML =
        '<button type="button" onclick="window.ubahUkuranGambarTerpilih(-30)" title="Perkecil Gambar (Rasio Terkunci)" style="font-weight:900;">➖</button>' +
        '<span id="lbl-size-img" style="color:#f1c40f; font-size:11px; font-weight:bold; padding:0 4px; display:flex; align-items:center;">100px</span>' +
        '<button type="button" onclick="window.ubahUkuranGambarTerpilih(30)" title="Perbesar Gambar (Rasio Terkunci)" style="font-weight:900;">➕</button>' +
        '<div style="width:1px;height:14px;background:rgba(255,255,255,0.3);margin:0 4px;"></div>' +
        '<button type="button" id="btn-mode-inline-img" onclick="window.setModeLayoutGambar(\'inline\')" title="Masuk Baris Teks (Geser &amp; Teks Otomatis Bergeser)" style="font-size:11px; font-weight:700;">📝 Inline</button>' +
        '<button type="button" onclick="window.setModeLayoutGambar(\'wrap-left\')" title="Wrap Teks Kiri (Teks Mengalir di Kanan)" style="font-size:11px;">◧ Kiri</button>' +
        '<button type="button" onclick="window.setModeLayoutGambar(\'wrap-right\')" title="Wrap Teks Kanan (Teks Mengalir di Kiri)" style="font-size:11px;">◨ Kanan</button>' +
        '<button type="button" onclick="window.setModeLayoutGambar(\'center\')" title="Rata Tengah (Baris Sendiri)" style="font-size:11px;">≡</button>' +
        '<div style="width:1px;height:14px;background:rgba(255,255,255,0.3);margin:0 4px;"></div>' +
        '<button type="button" onclick="window.cropGambarTerpilih()" style="font-size:11px; font-weight:800; color:#7dd3fc;" title="Crop Gambar (Kotak atau Freehand)">✂️ Crop</button>' +
        '<button type="button" id="btn-layout-img" onclick="window.toggleLayoutGambar()" style="font-size:11px; font-weight:bold;" title="Ubah ke Melayang Bebas (Float) / Kembali ke Inline">🕊️ Float</button>';
};

/* =========================================================================
   MESIN CROP GAMBAR UNIVERSAL (MODE KOTAK & MODE FREEHAND / LASO)
   - Mendukung Mouse, Jari, & Apple Pencil
   - Freehand menghasilkan PNG transparan tepat mengikuti garis potongan
   - Otomatis unggah hasil crop ke Cloudinary jika gambar dari soal / cloud
   ========================================================================= */
window._imgCropState = {
    mode: 'rect',
    img: null,
    dispW: 0,
    dispH: 0,
    rect: null,
    freePath: [],
    dragAction: null,
    dragStart: null,
    initRect: null,
    onApply: null,
    origSrc: ''
};

window.muatGambarUntukCrop = async function(src) {
    function loadImg(url, useCors) {
        return new Promise(function(resolve, reject) {
            let im = new Image();
            if (useCors) im.crossOrigin = 'anonymous';
            im.onload = function() { resolve(im); };
            im.onerror = reject;
            im.src = url;
        });
    }

    if (!src) throw new Error('Sumber gambar kosong.');
    if (src.indexOf('data:') === 0 || src.indexOf('blob:') === 0) {
        return await loadImg(src, false);
    }

    try {
        let sep = (src.indexOf('?') === -1) ? '?' : '&';
        return await loadImg(src + sep + 'crop_cors=' + Date.now(), true);
    } catch (e1) {
        let resp = await fetch(src);
        let blob = await resp.blob();
        let objUrl = URL.createObjectURL(blob);
        let im = await loadImg(objUrl, false);
        setTimeout(function() { URL.revokeObjectURL(objUrl); }, 15000);
        return im;
    }
};

window.pastikanModalCropGambarAda = function() {
    let modal = document.getElementById('modal-crop-gambar');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'modal-crop-gambar';
    modal.className = 'modal-overlay';
    modal.style.zIndex = '1000280';
    modal.onclick = function(e) {
        if (e.target === modal) window.tutupModal('modal-crop-gambar');
    };

    modal.innerHTML =
        '<div class="modal-box" style="width:740px; max-width:95vw; max-height:92vh; display:flex; flex-direction:column; border-radius:14px; overflow:hidden;">' +
            '<div class="modal-header" style="background:#0b3954; color:#ffffff; padding:12px 16px;">' +
                '<div>' +
                    '<h3 style="margin:0; font-size:15px;">✂️ Crop Gambar (Kotak &amp; Freehand)</h3>' +
                    '<div id="crop-mode-hint" style="font-size:11px; color:#bae6fd; margin-top:2px;">Geser 4 titik sudut atau tarik area kotak untuk memotong gambar.</div>' +
                '</div>' +
                '<button type="button" class="close-btn" style="color:#ffffff;" onclick="window.tutupModal(\'modal-crop-gambar\')">✕</button>' +
            '</div>' +
            '<div class="modal-body" style="padding:14px; background:#0f172a; display:flex; flex-direction:column; gap:10px; align-items:center;">' +
                '<div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:8px; flex-wrap:wrap;">' +
                    '<div style="display:flex; gap:6px; background:#1e293b; padding:4px; border-radius:10px;">' +
                        '<button type="button" id="btn-crop-mode-rect" onclick="window.setModeCropGambar(\'rect\')" style="padding:6px 14px; border:none; border-radius:7px; background:#38bdf8; color:#0b3954; font-weight:800; font-size:12px; cursor:pointer;">⬚ Kotak</button>' +
                        '<button type="button" id="btn-crop-mode-free" onclick="window.setModeCropGambar(\'freehand\')" style="padding:6px 14px; border:none; border-radius:7px; background:transparent; color:#cbd5e1; font-weight:800; font-size:12px; cursor:pointer;">✂️ Freehand (Laso)</button>' +
                    '</div>' +
                    '<button type="button" onclick="window.resetAreaCropGambar()" style="padding:6px 12px; border:1px solid #475569; border-radius:8px; background:#1e293b; color:#e2e8f0; font-size:11.5px; font-weight:700; cursor:pointer;">↺ Reset Area</button>' +
                '</div>' +

                '<div style="width:100%; display:flex; justify-content:center; align-items:center; background:#020617; border:1px solid #334155; border-radius:10px; padding:10px; overflow:hidden; min-height:240px;">' +
                    '<canvas id="crop-gambar-canvas" style="display:block; max-width:100%; touch-action:none; cursor:crosshair; border-radius:4px;"></canvas>' +
                '</div>' +

                '<div style="display:flex; justify-content:flex-end; gap:8px; width:100%;">' +
                    '<button type="button" class="btn-action" style="background:#475569; width:auto; padding:9px 18px; font-size:12.5px;" onclick="window.tutupModal(\'modal-crop-gambar\')">Batal</button>' +
                    '<button type="button" id="btn-terapkan-crop-gambar" class="btn-action" style="background:#16a34a; width:auto; padding:9px 22px; font-size:12.5px; font-weight:800;" onclick="window.terapkanCropGambarSekarang()">✅ Terapkan Crop</button>' +
                '</div>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);
    window.pasangEventKanvasCrop();
    return modal;
};

window.setModeCropGambar = function(mode) {
    let st = window._imgCropState;
    st.mode = (mode === 'freehand') ? 'freehand' : 'rect';

    let bRect = document.getElementById('btn-crop-mode-rect');
    let bFree = document.getElementById('btn-crop-mode-free');
    let hint = document.getElementById('crop-mode-hint');

    if (bRect) {
        bRect.style.background = (st.mode === 'rect') ? '#38bdf8' : 'transparent';
        bRect.style.color = (st.mode === 'rect') ? '#0b3954' : '#cbd5e1';
    }
    if (bFree) {
        bFree.style.background = (st.mode === 'freehand') ? '#38bdf8' : 'transparent';
        bFree.style.color = (st.mode === 'freehand') ? '#0b3954' : '#cbd5e1';
    }
    if (hint) {
        hint.innerText = (st.mode === 'freehand')
            ? 'Coret melingkar bebas pada bagian gambar yang ingin diambil (hasil otomatis transparan).'
            : 'Geser 4 titik sudut, geser kotak di tengah, atau tarik ulang area kotak crop.';
    }
    window.gambarKanvasCrop();
};

window.resetAreaCropGambar = function() {
    let st = window._imgCropState;
    let w = st.dispW || 300;
    let h = st.dispH || 200;
    st.rect = { x: w * 0.08, y: h * 0.08, w: w * 0.84, h: h * 0.84 };
    st.freePath = [];
    window.gambarKanvasCrop();
};

window.gambarKanvasCrop = function() {
    let st = window._imgCropState;
    let cvs = document.getElementById('crop-gambar-canvas');
    if (!cvs || !st.img) return;

    let ctx = cvs.getContext('2d');
    let w = st.dispW, h = st.dispH;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(st.img, 0, 0, w, h);

    if (st.mode === 'rect' && st.rect) {
        let r = st.rect;
        // Redupkan bagian luar kotak crop
        ctx.save();
        ctx.fillStyle = 'rgba(2, 6, 23, 0.58)';
        ctx.beginPath();
        ctx.rect(0, 0, w, h);
        ctx.rect(r.x, r.y, r.w, r.h);
        ctx.fill('evenodd');

        // Bingkai & garis bantu 3x3
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(r.x, r.y, r.w, r.h);

        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1;
        for (let k = 1; k <= 2; k++) {
            ctx.beginPath();
            ctx.moveTo(r.x + (r.w * k / 3), r.y);
            ctx.lineTo(r.x + (r.w * k / 3), r.y + r.h);
            ctx.moveTo(r.x, r.y + (r.h * k / 3));
            ctx.lineTo(r.x + r.w, r.y + (r.h * k / 3));
            ctx.stroke();
        }

        // 4 Titik sudut
        let corners = [
            { x: r.x, y: r.y },
            { x: r.x + r.w, y: r.y },
            { x: r.x + r.w, y: r.y + r.h },
            { x: r.x, y: r.y + r.h }
        ];
        corners.forEach(function(pt) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
        });
        ctx.restore();
    } else if (st.mode === 'freehand') {
        if (st.freePath && st.freePath.length > 2) {
            ctx.save();
            ctx.fillStyle = 'rgba(2, 6, 23, 0.58)';
            ctx.beginPath();
            ctx.rect(0, 0, w, h);
            ctx.moveTo(st.freePath[0].x, st.freePath[0].y);
            for (let i = 1; i < st.freePath.length; i++) {
                ctx.lineTo(st.freePath[i].x, st.freePath[i].y);
            }
            ctx.closePath();
            ctx.fill('evenodd');

            ctx.beginPath();
            ctx.moveTo(st.freePath[0].x, st.freePath[0].y);
            for (let j = 1; j < st.freePath.length; j++) {
                ctx.lineTo(st.freePath[j].x, st.freePath[j].y);
            }
            ctx.closePath();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 4]);
            ctx.stroke();
            ctx.restore();
        }
    }
};

window.pasangEventKanvasCrop = function() {
    let cvs = document.getElementById('crop-gambar-canvas');
    if (!cvs || cvs.getAttribute('data-crop-bound') === '1') return;
    cvs.setAttribute('data-crop-bound', '1');

    function getPt(ev) {
        let rc = cvs.getBoundingClientRect();
        let sx = cvs.width / Math.max(1, rc.width);
        let sy = cvs.height / Math.max(1, rc.height);
        return {
            x: Math.max(0, Math.min(cvs.width, (ev.clientX - rc.left) * sx)),
            y: Math.max(0, Math.min(cvs.height, (ev.clientY - rc.top) * sy))
        };
    }

    cvs.addEventListener('pointerdown', function(ev) {
        let st = window._imgCropState;
        if (!st.img) return;
        ev.preventDefault();
        let pt = getPt(ev);
        try { cvs.setPointerCapture(ev.pointerId); } catch (e) {}

        if (st.mode === 'freehand') {
            st.dragAction = 'freehand';
            st.freePath = [pt];
            window.gambarKanvasCrop();
            return;
        }

        let r = st.rect;
        let hitRad = 18;
        if (Math.hypot(pt.x - r.x, pt.y - r.y) <= hitRad) st.dragAction = 'tl';
        else if (Math.hypot(pt.x - (r.x + r.w), pt.y - r.y) <= hitRad) st.dragAction = 'tr';
        else if (Math.hypot(pt.x - (r.x + r.w), pt.y - (r.y + r.h)) <= hitRad) st.dragAction = 'br';
        else if (Math.hypot(pt.x - r.x, pt.y - (r.y + r.h)) <= hitRad) st.dragAction = 'bl';
        else if (pt.x >= r.x && pt.x <= r.x + r.w && pt.y >= r.y && pt.y <= r.y + r.h) st.dragAction = 'move';
        else {
            st.dragAction = 'new';
            st.rect = { x: pt.x, y: pt.y, w: 1, h: 1 };
        }
        st.dragStart = pt;
        st.initRect = Object.assign({}, st.rect);
        window.gambarKanvasCrop();
    });

    cvs.addEventListener('pointermove', function(ev) {
        let st = window._imgCropState;
        if (!st.dragAction || !st.img) return;
        ev.preventDefault();
        let pt = getPt(ev);

        if (st.dragAction === 'freehand') {
            let last = st.freePath[st.freePath.length - 1];
            if (!last || Math.hypot(pt.x - last.x, pt.y - last.y) >= 3) {
                st.freePath.push(pt);
                window.gambarKanvasCrop();
            }
            return;
        }

        let r0 = st.initRect;
        let w = st.dispW, h = st.dispH;
        let minSz = 24;

        if (st.dragAction === 'move') {
            let nx = Math.max(0, Math.min(w - r0.w, r0.x + (pt.x - st.dragStart.x)));
            let ny = Math.max(0, Math.min(h - r0.h, r0.y + (pt.y - st.dragStart.y)));
            st.rect = { x: nx, y: ny, w: r0.w, h: r0.h };
        } else if (st.dragAction === 'new') {
            let x1 = Math.min(st.dragStart.x, pt.x);
            let y1 = Math.min(st.dragStart.y, pt.y);
            let x2 = Math.max(st.dragStart.x, pt.x);
            let y2 = Math.max(st.dragStart.y, pt.y);
            st.rect = { x: x1, y: y1, w: Math.max(minSz, x2 - x1), h: Math.max(minSz, y2 - y1) };
        } else if (st.dragAction === 'tl') {
            let rx = r0.x + r0.w, by = r0.y + r0.h;
            let nx = Math.min(rx - minSz, pt.x), ny = Math.min(by - minSz, pt.y);
            st.rect = { x: nx, y: ny, w: rx - nx, h: by - ny };
        } else if (st.dragAction === 'tr') {
            let by = r0.y + r0.h;
            let ny = Math.min(by - minSz, pt.y), nw = Math.max(minSz, pt.x - r0.x);
            st.rect = { x: r0.x, y: ny, w: Math.min(w - r0.x, nw), h: by - ny };
        } else if (st.dragAction === 'br') {
            let nw = Math.max(minSz, pt.x - r0.x), nh = Math.max(minSz, pt.y - r0.y);
            st.rect = { x: r0.x, y: r0.y, w: Math.min(w - r0.x, nw), h: Math.min(h - r0.y, nh) };
        } else if (st.dragAction === 'bl') {
            let rx = r0.x + r0.w;
            let nx = Math.min(rx - minSz, pt.x), nh = Math.max(minSz, pt.y - r0.y);
            st.rect = { x: nx, y: r0.y, w: rx - nx, h: Math.min(h - r0.y, nh) };
        }
        window.gambarKanvasCrop();
    });

    function endDrag(ev) {
        let st = window._imgCropState;
        if (!st.dragAction) return;
        st.dragAction = null;
        try { cvs.releasePointerCapture(ev.pointerId); } catch (e) {}
    }

    cvs.addEventListener('pointerup', endDrag);
    cvs.addEventListener('pointercancel', endDrag);
};

window.bukaModalCropGambar = async function(imgSrc, onApplyCallback) {
    window.pastikanModalCropGambarAda();
    let st = window._imgCropState;
    st.onApply = onApplyCallback;
    st.origSrc = imgSrc;
    st.mode = 'rect';
    st.freePath = [];

    window.bukaModal('modal-crop-gambar');
    let btnOk = document.getElementById('btn-terapkan-crop-gambar');
    if (btnOk) { btnOk.disabled = true; btnOk.innerText = '⏳ Memuat gambar...'; }

    try {
        let img = await window.muatGambarUntukCrop(imgSrc);
        st.img = img;

        let maxW = Math.min(680, Math.max(260, window.innerWidth - 70));
        let maxH = Math.min(460, Math.max(220, window.innerHeight - 250));
        let scale = Math.min(maxW / Math.max(1, img.naturalWidth), maxH / Math.max(1, img.naturalHeight), 1);

        st.dispW = Math.max(120, Math.round(img.naturalWidth * scale));
        st.dispH = Math.max(90, Math.round(img.naturalHeight * scale));

        let cvs = document.getElementById('crop-gambar-canvas');
        if (cvs) {
            cvs.width = st.dispW;
            cvs.height = st.dispH;
        }
        window.resetAreaCropGambar();
        window.setModeCropGambar('rect');
    } catch (err) {
        alert('❌ Gambar tidak bisa dimuat untuk di-crop: ' + (err && err.message ? err.message : 'CORS / Jaringan'));
        window.tutupModal('modal-crop-gambar');
    } finally {
        if (btnOk) { btnOk.disabled = false; btnOk.innerText = '✅ Terapkan Crop'; }
    }
};

window.terapkanCropGambarSekarang = async function() {
    let st = window._imgCropState;
    if (!st.img) return;

    let scaleX = st.img.naturalWidth / Math.max(1, st.dispW);
    let scaleY = st.img.naturalHeight / Math.max(1, st.dispH);
    let isFree = (st.mode === 'freehand');

    let sx = 0, sy = 0, sw = 0, sh = 0;
    if (isFree) {
        if (!st.freePath || st.freePath.length < 4) {
            return alert('⚠️ Coret bentuk bebas pada gambar terlebih dahulu untuk Crop Freehand.');
        }
        let minX = st.dispW, minY = st.dispH, maxX = 0, maxY = 0;
        st.freePath.forEach(function(p) {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        });
        sx = Math.max(0, Math.round(minX * scaleX));
        sy = Math.max(0, Math.round(minY * scaleY));
        sw = Math.max(10, Math.round((maxX - minX) * scaleX));
        sh = Math.max(10, Math.round((maxY - minY) * scaleY));
    } else {
        if (!st.rect || st.rect.w < 10 || st.rect.h < 10) {
            return alert('⚠️ Area kotak crop terlalu kecil.');
        }
        sx = Math.max(0, Math.round(st.rect.x * scaleX));
        sy = Math.max(0, Math.round(st.rect.y * scaleY));
        sw = Math.max(10, Math.round(st.rect.w * scaleX));
        sh = Math.max(10, Math.round(st.rect.h * scaleY));
    }

    // Batasi dimensi output maks 1200px agar tetap tajam dan ringan
    let maxOut = 1200;
    let outScale = Math.max(sw, sh) > maxOut ? (maxOut / Math.max(sw, sh)) : 1;
    let outW = Math.max(10, Math.round(sw * outScale));
    let outH = Math.max(10, Math.round(sh * outScale));

    let outCvs = document.createElement('canvas');
    outCvs.width = outW;
    outCvs.height = outH;
    let ctx = outCvs.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (isFree) {
        ctx.save();
        ctx.beginPath();
        st.freePath.forEach(function(p, idx) {
            let px = ((p.x * scaleX) - sx) * outScale;
            let py = ((p.y * scaleY) - sy) * outScale;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(st.img, sx, sy, sw, sh, 0, 0, outW, outH);
        ctx.restore();
    } else {
        ctx.drawImage(st.img, sx, sy, sw, sh, 0, 0, outW, outH);
    }

    let mimeType = isFree ? 'image/png' : 'image/jpeg';
    let dataUrl = isFree ? outCvs.toDataURL('image/png') : outCvs.toDataURL('image/jpeg', 0.86);

    let btnOk = document.getElementById('btn-terapkan-crop-gambar');
    if (btnOk) { btnOk.disabled = true; btnOk.innerText = '⏳ Menyimpan hasil crop...'; }

    let finalUrl = dataUrl;
    let perluCloud = (st.origSrc && st.origSrc.indexOf('http') === 0 && navigator.onLine !== false);
    if (perluCloud) {
        try {
            let blobOut = await new Promise(function(resolve) {
                outCvs.toBlob(function(b) { resolve(b); }, mimeType, 0.88);
            });
            if (blobOut) {
                let fd = new FormData();
                fd.append('file', blobOut, 'crop_' + Date.now() + (isFree ? '.png' : '.jpg'));
                fd.append('upload_preset', 'studykawan_video');
                let res = await fetch('https://api.cloudinary.com/v1_1/rtkfvwvg/image/upload', { method: 'POST', body: fd });
                let j = await res.json().catch(function() { return {}; });
                if (res.ok && j && j.secure_url) finalUrl = j.secure_url;
            }
        } catch (eCloud) {}
    }

    if (btnOk) { btnOk.disabled = false; btnOk.innerText = '✅ Terapkan Crop'; }
    window.tutupModal('modal-crop-gambar');

    if (typeof st.onApply === 'function') {
        st.onApply({
            dataUrl: dataUrl,
            finalUrl: finalUrl,
            isFreehand: isFree,
            width: sw,
            height: sh,
            origWidth: st.img.naturalWidth,
            origHeight: st.img.naturalHeight
        });
    }
};

window.cropGambarTerpilih = function() {
    let img = window.selectedImg;
    if (!img || !document.body.contains(img)) return;
    let hostEl = img.closest(window.SELECTOR_EDITOR_GAMBAR);
    let oldVisualW = img.offsetWidth || 250;

    window.bukaModalCropGambar(img.src, function(res) {
        if (!res || !res.dataUrl) return;
        let propW = Math.max(40, Math.round(oldVisualW * (res.width / Math.max(1, res.origWidth || res.width))));
        img.src = res.finalUrl || res.dataUrl;
        img.style.width = propW + 'px';
        img.style.height = 'auto';
        img.style.maxWidth = '100%';
        window.perbaruiPosisiKontrolGambar();
        window.simpanPerubahanEditorGambar(hostEl);
    });
};

window.ubahUkuranGambarTerpilih = function(deltaPx) {
    if (!window.selectedImg) return;
    let curW = window.selectedImg.offsetWidth || 250;
    let hostEl = window.selectedImg.closest(window.SELECTOR_EDITOR_GAMBAR);
    let maxW = hostEl ? Math.max(120, hostEl.clientWidth - 16) : 900;
    let nextW = Math.max(36, Math.min(maxW, curW + deltaPx));

    window.selectedImg.removeAttribute('height');
    window.selectedImg.style.width = nextW + 'px';
    window.selectedImg.style.height = 'auto';
    window.selectedImg.style.maxWidth = '100%';

    window.perbaruiPosisiKontrolGambar();
    window.simpanPerubahanEditorGambar(hostEl);
};

window.setModeLayoutGambar = function(mode) {
    let img = window.selectedImg;
    if (!img) return;
    let hostEl = img.closest(window.SELECTOR_EDITOR_GAMBAR);

    img.style.height = 'auto';
    img.style.maxWidth = '100%';

    if (mode === 'inline') {
        img.style.position = '';
        img.style.left = '';
        img.style.top = '';
        img.style.zIndex = '';
        img.style.float = 'none';
        img.style.display = 'inline-block';
        img.style.verticalAlign = 'middle';
        img.style.margin = '4px 8px';
        img.style.cursor = 'grab';
        img.setAttribute('data-img-layout', 'inline-reflow');
        img.onpointerdown = null;
    } else if (mode === 'wrap-left') {
        img.style.position = '';
        img.style.left = '';
        img.style.top = '';
        img.style.zIndex = '';
        img.style.display = 'inline-block';
        img.style.verticalAlign = 'top';
        img.style.float = 'left';
        img.style.margin = '4px 14px 8px 0';
        img.style.cursor = 'grab';
        img.setAttribute('data-img-layout', 'wrap-left');
        img.onpointerdown = null;
    } else if (mode === 'wrap-right') {
        img.style.position = '';
        img.style.left = '';
        img.style.top = '';
        img.style.zIndex = '';
        img.style.display = 'inline-block';
        img.style.verticalAlign = 'top';
        img.style.float = 'right';
        img.style.margin = '4px 0 8px 14px';
        img.style.cursor = 'grab';
        img.setAttribute('data-img-layout', 'wrap-right');
        img.onpointerdown = null;
    } else if (mode === 'center') {
        img.style.position = '';
        img.style.left = '';
        img.style.top = '';
        img.style.zIndex = '';
        img.style.float = 'none';
        img.style.display = 'block';
        img.style.margin = '12px auto';
        img.style.cursor = 'grab';
        img.setAttribute('data-img-layout', 'center');
        img.onpointerdown = null;
    }

    window.perbaruiPosisiKontrolGambar();
    window.simpanPerubahanEditorGambar(hostEl);
};

window.alignGambar = function(p) {
    if (p === 'left') window.setModeLayoutGambar('wrap-left');
    else if (p === 'right') window.setModeLayoutGambar('wrap-right');
    else window.setModeLayoutGambar('center');
};

window.toggleLayoutGambar = function() {
    let img = window.selectedImg;
    if (!img) return;
    let isAbsolute = img.style.position === 'absolute';
    if (isAbsolute) {
        window.setModeLayoutGambar('inline');
    } else {
        let hostEl = img.closest(window.SELECTOR_EDITOR_GAMBAR);
        if (hostEl && window.getComputedStyle(hostEl).position === 'static') {
            hostEl.style.position = 'relative';
        }
        img.style.float = 'none';
        img.style.position = 'absolute';
        img.style.zIndex = '10';
        img.style.margin = '0';
        img.style.height = 'auto';
        img.style.cursor = 'move';
        img.setAttribute('data-img-layout', 'float');
        img.onpointerdown = window.startDragGambarFloat;
        window.perbaruiPosisiKontrolGambar();
        window.simpanPerubahanEditorGambar(hostEl);
    }
};

window.ambilRangeTitikKursor = function(clientX, clientY) {
    if (document.caretRangeFromPoint) {
        return document.caretRangeFromPoint(clientX, clientY);
    }
    if (document.caretPositionFromPoint) {
        let pos = document.caretPositionFromPoint(clientX, clientY);
        if (pos && pos.offsetNode) {
            let r = document.createRange();
            r.setStart(pos.offsetNode, pos.offset);
            r.collapse(true);
            return r;
        }
    }
    return null;
};

// Geser Gambar Secara Live di Dalam Baris Teks (Teks di Belakang Otomatis Bergeser)
window.mulaiDragGambarInlineReflow = function(e, img) {
    if (!img || img.style.position === 'absolute') return;
    if (!window.apakahBolehEditGambar(img)) return;
    if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;

    let rect = img.getBoundingClientRect();
    // Beri ruang 22px di tepi kanan/bawah untuk resize drag jika ada
    if ((rect.right - e.clientX) <= 22 && (rect.bottom - e.clientY) <= 22) return;

    let hostEl = img.closest(window.SELECTOR_EDITOR_GAMBAR);
    if (!hostEl) return;

    let startX = e.clientX;
    let startY = e.clientY;
    let dragging = false;
    let lastProbeTs = 0;

    function onMove(ev) {
        let dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
        if (!dragging) {
            if (dist < 6) return;
            dragging = true;
            img.classList.add('img-live-dragging');
            if (window.selectedImg !== img) {
                document.querySelectorAll('img.img-selected').forEach(function(i) { i.classList.remove('img-selected'); });
                window.selectedImg = img;
                img.classList.add('img-selected');
            }
            // Jika sebelumnya berformat block tengah, otomatis ubah jadi inline agar masuk mulus ke baris teks
            if (img.style.display === 'block' && img.style.float !== 'left' && img.style.float !== 'right') {
                img.style.display = 'inline-block';
                img.style.verticalAlign = 'middle';
                img.style.margin = '4px 8px';
            }
        }

        ev.preventDefault();
        let now = Date.now();
        if (now - lastProbeTs < 32) return;
        lastProbeTs = now;

        let prevPE = img.style.pointerEvents;
        img.style.pointerEvents = 'none';
        let rng = window.ambilRangeTitikKursor(ev.clientX, ev.clientY);
        img.style.pointerEvents = prevPE;

        if (!rng || !rng.startContainer) return;
        let containerNode = rng.startContainer;
        let elCheck = (containerNode.nodeType === 3) ? containerNode.parentElement : containerNode;
        if (!elCheck || !hostEl.contains(elCheck)) return;
        if (elCheck === img || img.contains(elCheck)) return;
        if (elCheck.closest('button, input, textarea, select, canvas, .block-controls, .quiz-header, .quiz-nav-bar, [contenteditable="false"]')) return;

        // Cegah pemindahan berulang di posisi yang persis sama
        if (containerNode === img.parentNode) {
            let idxImg = Array.prototype.indexOf.call(containerNode.childNodes, img);
            if (rng.startOffset === idxImg || rng.startOffset === idxImg + 1) return;
        }

        try {
            rng.collapse(true);
            rng.insertNode(img);
            window.perbaruiPosisiKontrolGambar();
        } catch (err) {}
    }

    function onUp() {
        document.removeEventListener('pointermove', onMove, true);
        document.removeEventListener('pointerup', onUp, true);
        document.removeEventListener('pointercancel', onUp, true);

        if (dragging) {
            img.classList.remove('img-live-dragging');
            window._justFinishedImgDrag = Date.now();
            try { hostEl.normalize(); } catch (err) {}
            window.perbaruiPosisiKontrolGambar();
            window.simpanPerubahanEditorGambar(hostEl);
        }
    }

    document.addEventListener('pointermove', onMove, true);
    document.addEventListener('pointerup', onUp, true);
    document.addEventListener('pointercancel', onUp, true);
};

// Tangkap dragstart native browser agar tidak bentrok dengan Live-Reflow Drag
document.addEventListener('dragstart', function(e) {
    if (e.target && e.target.tagName === 'IMG' && window.apakahBolehEditGambar(e.target)) {
        e.preventDefault();
    }
}, true);

document.addEventListener('pointerdown', function(e) {
    if (e.target && e.target.tagName === 'IMG' && window.apakahBolehEditGambar(e.target)) {
        if (e.target.style.position !== 'absolute') {
            window.mulaiDragGambarInlineReflow(e, e.target);
        }
    }
}, true);

document.addEventListener('click', function(e) {
    if (window.isDrawingMode) return;

    if (e.target && e.target.tagName === 'IMG' && window.apakahBolehEditGambar(e.target)) {
        document.querySelectorAll('img.img-selected').forEach(function(i) { i.classList.remove('img-selected'); });
        e.target.classList.add('img-selected');
        window.selectedImg = e.target;
        window.selectedImg.style.height = 'auto';

        window.pasangCssGambarInlineReflow();
        window.bangunToolbarKontrolGambar();
        window.perbaruiPosisiKontrolGambar();
    } else if (!e.target.closest('#img-controls')) {
        if (Date.now() - (window._justFinishedImgDrag || 0) < 250) return;
        if (window.selectedImg) window.selectedImg.classList.remove('img-selected');
        window.selectedImg = null;
        let c = document.getElementById('img-controls');
        if (c) c.style.display = 'none';
    }
});

window.addEventListener('scroll', function() {
    if (window.selectedImg) window.perbaruiPosisiKontrolGambar();
}, true);

document.addEventListener('keydown', function(e) {
    if ((e.key === 'Delete' || e.key === 'Backspace') && window.selectedImg && !window.isDrawingMode) {
        let activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;
        e.preventDefault();
        let hostEl = window.selectedImg.closest(window.SELECTOR_EDITOR_GAMBAR);
        window.selectedImg.remove();
        window.selectedImg = null;
        let c = document.getElementById('img-controls');
        if (c) c.style.display = 'none';
        window.simpanPerubahanEditorGambar(hostEl);
    }
});

window.startDragGambarFloat = function(e) {
    let img = e.target;
    if (!window.apakahBolehEditGambar(img) || img.style.position !== 'absolute') return;

    let rect = img.getBoundingClientRect();
    let isResizeEdge = (rect.right - e.clientX) <= 28 || (rect.bottom - e.clientY) <= 28;
    if (isResizeEdge) return;

    e.preventDefault();
    e.stopPropagation();

    let hostEl = img.closest(window.SELECTOR_EDITOR_GAMBAR);
    if (!hostEl) return;

    let startX = e.clientX;
    let startY = e.clientY;
    let initLeft = img.offsetLeft;
    let initTop = img.offsetTop;

    try { img.setPointerCapture(e.pointerId); } catch (err) {}

    function move(ev) {
        img.style.left = (initLeft + (ev.clientX - startX)) + 'px';
        img.style.top = (initTop + (ev.clientY - startY)) + 'px';
        window.perbaruiPosisiKontrolGambar();
    }

    function up(ev) {
        try { img.releasePointerCapture(e.pointerId); } catch (err) {}
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        window.simpanPerubahanEditorGambar(hostEl);
    }

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
};

document.addEventListener('DOMContentLoaded', function() {
    window.pasangCssGambarInlineReflow();
});

/* =========================================
   KONTROL TABEL ALA MICROSOFT WORD (KETIK LANCAR, DRAG-SELECT, COPY-PASTE, & RESIZE KOLOM)
   ========================================= */
window.activeTableCell = null;
window.activeTableCells = [];
window._isSelectingTableCells = false;
window._tableSelectStartCell = null;
window._resizingTableCol = null;

// Bersihkan tabel lama agar tidak ada tombol "+" pengganggu atau contenteditable ganda
window.bersihkanTabelTunggal = function(tableEl) {
    if (!tableEl || window._isRestoringUndo) return;
    if (tableEl.hasAttribute('contenteditable')) tableEl.removeAttribute('contenteditable');
    if (!tableEl.classList.contains('interactive-table')) tableEl.classList.add('interactive-table');
    if (!tableEl.classList.contains('word-table')) tableEl.classList.add('word-table');

    let legacyBtns = tableEl.querySelectorAll('.tbl-btn-add');
    if (legacyBtns.length > 0) {
        legacyBtns.forEach(function(btn) { btn.remove(); });
    }

    tableEl.querySelectorAll('td, th').forEach(function(cell) {
        if (cell.hasAttribute('contenteditable')) cell.removeAttribute('contenteditable');
        if (cell.style.resize) cell.style.resize = '';
        if (cell.style.overflow) cell.style.overflow = '';
    });
};

window.bersihkanSemuaTabelDalamEditor = function() {
    if (window._isRestoringUndo) return;
    document.querySelectorAll('.content-block table, .fb-content table').forEach(function(tbl) {
        window.bersihkanTabelTunggal(tbl);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(window.bersihkanSemuaTabelDalamEditor, 400);
    let cont = document.getElementById('blocks-container');
    if (cont) {
        // Hanya pantau childList tingkat atas (saat pindah bab/render ulang), tidak mengganggu ketikan & Undo
        let obsTbl = new MutationObserver(function() {
            window.bersihkanSemuaTabelDalamEditor();
        });
        obsTbl.observe(cont, { childList: true });
    }
});

window.posisikanToolbarTabel = function(tableOrCell) {
    let c = document.getElementById('tbl-controls');
    if (!c || !tableOrCell) return;
    let tbl = tableOrCell.tagName === 'TABLE' ? tableOrCell : tableOrCell.closest('table');
    let rect = (tbl || tableOrCell).getBoundingClientRect();
    c.style.display = 'flex';
    c.style.top = Math.max(8, (rect.top + window.scrollY - 38)) + 'px';
    c.style.left = Math.max(8, (rect.left + window.scrollX)) + 'px';
};

window.bersihkanSorotanSelTabel = function() {
    document.querySelectorAll('.tbl-cell-selected').forEach(function(el) {
        el.classList.remove('tbl-cell-selected');
    });
    window.activeTableCells = [];
};

window.pilihRentangSelTabel = function(table, cellA, cellB) {
    if (!table || !cellA || !cellB) return;
    let r1 = Math.min(cellA.parentElement.rowIndex, cellB.parentElement.rowIndex);
    let r2 = Math.max(cellA.parentElement.rowIndex, cellB.parentElement.rowIndex);
    let c1 = Math.min(cellA.cellIndex, cellB.cellIndex);
    let c2 = Math.max(cellA.cellIndex, cellB.cellIndex);

    window.bersihkanSorotanSelTabel();
    for (let r = r1; r <= r2; r++) {
        let row = table.rows[r];
        if (!row) continue;
        for (let c = c1; c <= c2; c++) {
            let cell = row.cells[c];
            if (cell) {
                cell.classList.add('tbl-cell-selected');
                window.activeTableCells.push(cell);
            }
        }
    }
};

window.blokSemuaSelTabel = function() {
    let tbl = window.activeTableCell ? window.activeTableCell.closest('table') : null;
    if (!tbl && window.activeTableCells && window.activeTableCells[0]) {
        tbl = window.activeTableCells[0].closest('table');
    }
    if (!tbl || tbl.rows.length === 0) return;

    window.bersihkanSorotanSelTabel();
    Array.from(tbl.rows).forEach(function(r) {
        Array.from(r.cells).forEach(function(c) {
            c.classList.add('tbl-cell-selected');
            window.activeTableCells.push(c);
        });
    });

    // Fokuskan sel pertama agar langsung siap Copy (Cmd+C), Paste (Cmd+V), Warnai, atau Delete
    let firstCell = tbl.rows[0].cells[0];
    if (firstCell) {
        window.activeTableCell = firstCell;
        let editable = tbl.closest('.content-block, .fb-content');
        if (editable) editable.focus();
        try {
            let sel = window.getSelection();
            let rng = document.createRange();
            rng.selectNodeContents(tbl);
            sel.removeAllRanges();
            sel.addRange(rng);
        } catch (err) {}
    }
    window.posisikanToolbarTabel(tbl);
};

window.sisipkanTabel = function() {
    window.simpanSeleksiTeks();
    window.bukaModal('modal-tabel');
};

window.terapkanSisipanTabel = function() {
    let cols = Math.max(1, Math.min(12, parseInt(document.getElementById('input-tabel-kolom').value, 10) || 3));
    let rows = Math.max(1, Math.min(30, parseInt(document.getElementById('input-tabel-baris').value, 10) || 3));
    let uid = 'word-tbl-' + Date.now();

    let html = '<table id="' + uid + '" class="interactive-table word-table"><tbody>';
    for (let r = 0; r < rows; r++) {
        html += '<tr>';
        let tag = (r === 0) ? 'th' : 'td';
        for (let c = 0; c < cols; c++) {
            html += '<' + tag + '><br></' + tag + '>';
        }
        html += '</tr>';
    }
    html += '</tbody></table><div><br></div>';

    window.kembalikanSeleksiTeks();
    window.formatTeks('insertHTML', html);
    window.tutupModal('modal-tabel');

    setTimeout(function() {
        let newTbl = document.getElementById(uid);
        if (newTbl) {
            newTbl.removeAttribute('id');
            let firstCell = newTbl.rows[0] && newTbl.rows[0].cells[0];
            if (firstCell) {
                window.activeTableCell = firstCell;
                let editable = newTbl.closest('.content-block, .fb-content');
                if (editable) editable.focus();
                let rng = document.createRange();
                rng.setStart(firstCell, 0);
                rng.collapse(true);
                let sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(rng);
                window.posisikanToolbarTabel(newTbl);
            }
        }
    }, 30);
};

// Ubah kursor saat mengarah ke garis kolom kanan (untuk seret lebar kolom ala Microsoft Word)
window._lastTableHoverCheck = 0;
document.addEventListener('mousemove', function(e) {
    if (window._resizingTableCol) {
        let info = window._resizingTableCol;
        let nextW = Math.max(45, info.startWidth + (e.clientX - info.startX));
        Array.from(info.table.rows).forEach(function(tr) {
            if (tr.cells[info.colIndex]) {
                tr.cells[info.colIndex].style.width = nextW + 'px';
            }
        });
        return;
    }

    if (window._isSelectingTableCells && window._tableSelectStartCell) {
        let overCell = e.target && e.target.closest ? e.target.closest('td, th') : null;
        if (overCell && overCell.closest('table') === window._tableSelectStartCell.closest('table') && overCell !== window._tableSelectStartCell) {
            window.pilihRentangSelTabel(overCell.closest('table'), window._tableSelectStartCell, overCell);
        }
        return;
    }

    let now = Date.now();
    if (now - window._lastTableHoverCheck < 50) return;
    window._lastTableHoverCheck = now;

    if (!document.body.classList.contains('mode-edit-aktif') && !document.documentElement.classList.contains('force-edit-mode')) return;
    let cell = (e.target && e.target.closest) ? e.target.closest('td, th') : null;
    if (cell && cell.closest('.content-block, .fb-content')) {
        let rect = cell.getBoundingClientRect();
        let dekatTepiKanan = (rect.right - e.clientX) <= 6;
        cell.style.cursor = dekatTepiKanan ? 'col-resize' : 'text';
    }
}, { passive: true });

document.addEventListener('mousedown', function(e) {
    if (window.isDrawingMode) return;
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    if (!isEdit) return;

    let cell = (e.target && e.target.closest) ? e.target.closest('td, th') : null;
    if (cell && cell.closest('.content-block, .fb-content')) {
        let table = cell.closest('table');
        window.bersihkanTabelTunggal(table);
        window.activeTableCell = cell;
        window.posisikanToolbarTabel(table);

        // Cek apakah menggeser garis batas kolom kanan (Resize Kolom ala Word)
        let rect = cell.getBoundingClientRect();
        if ((rect.right - e.clientX) <= 6) {
            e.preventDefault();
            window._resizingTableCol = {
                table: table,
                colIndex: cell.cellIndex,
                startX: e.clientX,
                startWidth: cell.offsetWidth
            };
            return;
        }

        // Mulai pelacakan drag-select antar sel (tetap izinkan klik normal untuk langsung mengetik!)
        window.bersihkanSorotanSelTabel();
        window._isSelectingTableCells = true;
        window._tableSelectStartCell = cell;
    } else if (!e.target.closest('#tbl-controls') && !e.target.closest('.mozello-toolbar')) {
        let c = document.getElementById('tbl-controls');
        if (c) c.style.display = 'none';
        window.activeTableCell = null;
        window.bersihkanSorotanSelTabel();
    }
});

document.addEventListener('mouseup', function() {
    if (window._resizingTableCol) {
        let tbl = window._resizingTableCol.table;
        window._resizingTableCol = null;
        let blok = tbl ? tbl.closest('.content-block, .fb-content') : null;
        if (blok) blok.dispatchEvent(new Event('input', { bubbles: true }));
    }
    window._isSelectingTableCells = false;
    window._tableSelectStartCell = null;
});

// Copy rapi dalam bentuk HTML <table> + TSV saat memblok banyak sel / seluruh tabel
document.addEventListener('copy', function(e) {
    if (!window.activeTableCells || window.activeTableCells.length <= 1) return;
    let tbl = window.activeTableCells[0].closest('table');
    if (!tbl || !tbl.closest('.content-block, .fb-content')) return;

    let selectedSet = new Set(window.activeTableCells);
    let htmlOut = '<table><tbody>';
    let plainRows = [];

    Array.from(tbl.rows).forEach(function(tr) {
        let picked = Array.from(tr.cells).filter(function(c) { return selectedSet.has(c); });
        if (picked.length === 0) return;
        htmlOut += '<tr>';
        let colsPlain = [];
        picked.forEach(function(c) {
            let tag = c.tagName === 'TH' ? 'th' : 'td';
            htmlOut += '<' + tag + '>' + c.innerHTML + '</' + tag + '>';
            colsPlain.push((c.innerText || '').replace(/\r?\n/g, ' ').trim());
        });
        htmlOut += '</tr>';
        plainRows.push(colsPlain.join('\t'));
    });
    htmlOut += '</tbody></table>';

    e.preventDefault();
    e.clipboardData.setData('text/html', htmlOut);
    e.clipboardData.setData('text/plain', plainRows.join('\n'));
});

// Navigasi Tab / Shift+Tab antar sel ala Word + Delete isi saat memblok banyak sel
document.addEventListener('keydown', function(e) {
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    if (!isEdit) return;

    // 1. Delete / Backspace saat memblok beberapa sel: kosongkan isi sel tanpa merusak tabel
    if ((e.key === 'Delete' || e.key === 'Backspace') && window.activeTableCells && window.activeTableCells.length > 1) {
        e.preventDefault();
        let tbl = window.activeTableCells[0].closest('table');
        window.activeTableCells.forEach(function(c) {
            c.innerHTML = '<br>';
        });
        let blok = tbl ? tbl.closest('.content-block, .fb-content') : null;
        if (blok) blok.dispatchEvent(new Event('input', { bubbles: true }));
        return;
    }

    // 2. Tombol Tab / Shift+Tab di dalam sel tabel (pindah sel & otomatis tambah baris di ujung bawah)
    if (e.key === 'Tab') {
        let sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        let node = sel.anchorNode;
        let el = node && node.nodeType === 3 ? node.parentElement : node;
        let cell = el && el.closest ? el.closest('td, th') : null;
        if (!cell || !cell.closest('.content-block, .fb-content')) return;

        e.preventDefault();
        let tbl = cell.closest('table');
        let allCells = Array.from(tbl.querySelectorAll('th, td'));
        let idx = allCells.indexOf(cell);
        let nextCell = null;

        if (e.shiftKey) {
            if (idx > 0) nextCell = allCells[idx - 1];
        } else {
            if (idx >= 0 && idx < allCells.length - 1) {
                nextCell = allCells[idx + 1];
            } else {
                window.activeTableCell = cell;
                window.tambahBarisTabel();
                let updated = Array.from(tbl.querySelectorAll('th, td'));
                nextCell = updated[idx + 1] || null;
            }
        }

        if (nextCell) {
            window.activeTableCell = nextCell;
            let rng = document.createRange();
            rng.selectNodeContents(nextCell);
            rng.collapse(false);
            sel.removeAllRanges();
            sel.addRange(rng);
            window.posisikanToolbarTabel(tbl);
        }
    }
});

window.warnaiSelTabel = function(w) {
    if (window.activeTableCells && window.activeTableCells.length > 0) {
        window.activeTableCells.forEach(function(c) { c.style.backgroundColor = w; });
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
        newCell.innerHTML = '<br>';
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
        let newCell = document.createElement(isHeader ? 'th' : 'td');
        newCell.innerHTML = '<br>';
        if (cellIndex + 1 < tr.children.length) tr.insertBefore(newCell, tr.children[cellIndex + 1]);
        else tr.appendChild(newCell);
    });
    triggerInput();
};

window.hapusBarisTabel = function() {
    if (!window.activeTableCell) return;
    let tr = window.activeTableCell.parentNode;
    let tb = tr.closest('table');
    if (tb && tb.rows.length <= 1) {
        return window.hapusTabelUtuh();
    }
    tr.parentNode.removeChild(tr);
    window.activeTableCell = null;
    window.bersihkanSorotanSelTabel();
    document.getElementById('tbl-controls').style.display = 'none';
    triggerInput();
};

window.hapusKolomTabel = function() {
    if (!window.activeTableCell) return;
    let tb = window.activeTableCell.closest('table');
    let cI = window.activeTableCell.cellIndex;
    if (tb && tb.rows[0] && tb.rows[0].cells.length <= 1) {
        return window.hapusTabelUtuh();
    }
    Array.from(tb.rows).forEach(function(r) { if (r.cells.length > cI) r.deleteCell(cI); });
    window.activeTableCell = null;
    window.bersihkanSorotanSelTabel();
    document.getElementById('tbl-controls').style.display = 'none';
    triggerInput();
};

window.hapusTabelUtuh = function() {
    let refCell = window.activeTableCell || (window.activeTableCells && window.activeTableCells[0]);
    if (!refCell) return;
    let tb = refCell.closest('table');
    if (!tb) return;
    let blok = tb.closest('.content-block, .fb-content');
    window.tampilkanCustomDialog("confirm", "Hapus seluruh tabel ini?", null, function(isYes) {
        if (!isYes) return;
        tb.remove();
        window.activeTableCell = null;
        window.bersihkanSorotanSelTabel();
        let c = document.getElementById('tbl-controls');
        if (c) c.style.display = 'none';
        if (blok) blok.dispatchEvent(new Event('input', { bubbles: true }));
    });
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
    if (!window.globalSelectedRange || window.globalSelectedRange.collapsed) {
        return alert("Blok teks atau rumus matematika terlebih dahulu!");
    }
    window.sisipkanLatexInlineKeSeleksi();
};

window.batalLatex = function(el, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (!document.body.classList.contains('mode-edit-aktif') && !document.documentElement.classList.contains('force-edit-mode')) return;
    if (!el || !el.parentNode) return;

    let editableHost = el.closest ? el.closest('.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area') : null;
    let rawText = el.getAttribute('data-raw') || el.getAttribute('data-latex-src') || el.textContent || '';
    rawText = rawText.trim();
    if (rawText.indexOf('\\(') === 0 && rawText.lastIndexOf('\\)') === rawText.length - 2) {
        rawText = rawText.slice(2, -2).trim();
    }

    if (editableHost) editableHost.focus();

    // Pakai execCommand agar pembatalan rumus juga tercatat di riwayat Cmd+Z / Undo
    let berhasilUndoable = false;
    try {
        let sel = window.getSelection();
        let r = document.createRange();
        r.selectNode(el);
        sel.removeAllRanges();
        sel.addRange(r);
        document.execCommand('insertText', false, rawText);
        berhasilUndoable = !el.isConnected;
    } catch (err) {}

    if (!berhasilUndoable && el.parentNode) {
        let textNode = document.createTextNode(rawText);
        el.parentNode.replaceChild(textNode, el);
    }

    if (editableHost) {
        editableHost.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (typeof triggerInput === 'function') {
        triggerInput();
    }
};

// Tangkap klik 2x pada rumus LaTeX sebelum menyentuh #main-editor-wrapper (cegah bentrok restoreMathJax)
document.addEventListener('dblclick', function(e) {
    if (!document.body.classList.contains('mode-edit-aktif') && !document.documentElement.classList.contains('force-edit-mode')) return;
    let latexEl = (e.target && e.target.closest) ? e.target.closest('.latex-inline, .math-latex-block') : null;
    if (latexEl) {
        window.batalLatex(latexEl, e);
    }
}, true);

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
    let el = document.getElementById('modal-catatan-guru');
    if (el) {
        el.style.display = 'flex';
        window.angkatKeLapisanTeratas(el);
    }
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
    let elCK = document.getElementById('modal-catatan-kelas');
    if (elCK) {
        elCK.style.display = 'flex';
        window.angkatKeLapisanTeratas(elCK);
    }
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
    let btnRen = document.getElementById('btn-tab-jadwal-rencana');
    let viewKal = document.getElementById('view-jadwal-kalender');
    let viewExc = document.getElementById('view-jadwal-excel');
    let viewRen = document.getElementById('view-jadwal-rencana');

    let setTabBtn = function(btn, active) {
        if (!btn) return;
        btn.style.background = active ? '#e67e22' : 'transparent';
        btn.style.color = active ? '#ffffff' : '#cbd5e1';
    };

    setTabBtn(btnKal, tabName === 'kalender');
    setTabBtn(btnExc, tabName === 'excel');
    setTabBtn(btnRen, tabName === 'rencana');

    if (viewKal) viewKal.style.display = (tabName === 'kalender') ? 'flex' : 'none';
    if (viewExc) viewExc.style.display = (tabName === 'excel') ? 'flex' : 'none';
    if (viewRen) viewRen.style.display = (tabName === 'rencana') ? 'flex' : 'none';

    if (tabName === 'kalender') {
        window.renderKalenderGuru();
    } else if (tabName === 'excel') {
        window.muatTabelJadwalExcel();
    } else if (tabName === 'rencana') {
        window.sinkronkanDanRenderRencana(false);
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

window.deteksiKategoriAgendaKalender = function(ev) {
    if (!ev) return 'agenda';
    if (ev.kategori === 'libur' || ev.kategori === 'acara') return ev.kategori;
    let t = String(ev.title || '').trim().toLowerCase();
    if (t.indexOf('libur/') === 0 || t.indexOf('libur:') === 0) return 'libur';
    if (t.indexOf('acara/') === 0 || t.indexOf('acara:') === 0) return 'acara';
    return 'agenda';
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

    for (let i = firstDay - 1; i >= 0; i--) {
        let dNum = prevMonthDays - i;
        html += '<div class="cal-day-cell other-month"><div class="cal-day-num">' + dNum + '</div></div>';
    }

    for (let d = 1; d <= daysInMonth; d++) {
        let dateKey = window.calCurrentYear + '-' + String(window.calCurrentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        let isToday = (dateKey === todayKey) ? ' is-today' : '';
        let dayEvents = Array.isArray(eventsMap[dateKey]) ? eventsMap[dateKey] : (eventsMap[dateKey] ? Object.values(eventsMap[dateKey]) : []);

        let pillsHtml = '';
        dayEvents.forEach(function(ev, idx) {
            let kat = window.deteksiKategoriAgendaKalender(ev);
            let katClass = kat === 'libur' ? ' is-libur' : (kat === 'acara' ? ' is-acara' : '');
            let prefix = kat === 'libur' ? '🔴 ' : (kat === 'acara' ? '🎭 ' : '');
            let cleanTitle = String(ev.title || '').replace(/^(?:libur|acara)\s*[\/:]\s*/i, '').trim() || String(ev.title || '');
            let safeTitle = cleanTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            let jamStr = ev.jam ? (ev.jam + ' ') : '';

            pillsHtml += '<div class="cal-event-pill' + katClass + '" onclick="event.stopPropagation(); window.hapusAgendaKalenderGuru(\'' + dateKey + '\', ' + idx + ')" title="' + prefix + safeTitle + ' (Klik untuk menghapus)">' +
                            '<span style="overflow:hidden; text-overflow:ellipsis;">' + prefix + jamStr + safeTitle + '</span>' +
                            '<span style="font-size:9px; opacity:0.8;">✕</span>' +
                         '</div>';
        });

        html += '<div class="cal-day-cell' + isToday + '" onclick="window.klikTanggalKalenderGuru(\'' + dateKey + '\')">' +
                    '<div class="cal-day-num">' + d + '</div>' +
                    pillsHtml +
                '</div>';
    }

    let totalCells = firstDay + daysInMonth;
    let remaining = (7 - (totalCells % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
        html += '<div class="cal-day-cell other-month"><div class="cal-day-num">' + j + '</div></div>';
    }

    grid.innerHTML = html;
};

window.togglePanelImportLiburAcara = function(forceOpen) {
    let p = document.getElementById('panel-import-libur-acara');
    if (!p) return;
    let buka = (typeof forceOpen === 'boolean') ? forceOpen : (p.style.display === 'none');
    p.style.display = buka ? 'block' : 'none';
    if (buka) {
        let ta = document.getElementById('input-batch-libur-acara');
        if (ta) setTimeout(function() { ta.focus(); }, 60);
    }
};

window.parseBulanIndonesiaKeAngka = function(namaBulan) {
    let s = String(namaBulan || '').trim().toLowerCase();
    let peta = {
        januari: 1, jan: 1,
        februari: 2, feb: 2, pebruari: 2, peb: 2,
        maret: 3, mar: 3,
        april: 4, apr: 4,
        mei: 5, may: 5,
        juni: 6, jun: 6,
        juli: 7, jul: 7,
        agustus: 8, agu: 8, ags: 8, agust: 8, aug: 8,
        september: 9, sep: 9, sept: 9,
        oktober: 10, okt: 10, oct: 10,
        november: 11, nov: 11, nop: 11, nopember: 11,
        desember: 12, des: 12, dec: 12
    };
    return peta[s] || 0;
};

window.prosesImportBatchLiburAcara = function() {
    let ta = document.getElementById('input-batch-libur-acara');
    if (!ta) return;
    let raw = ta.value.trim();
    if (!raw) return alert('Masukkan minimal 1 baris daftar hari libur atau acara terlebih dahulu.');

    if (!window.adminJadwalKalenderData) window.adminJadwalKalenderData = { excelHtml: "", events: {} };
    if (!window.adminJadwalKalenderData.events) window.adminJadwalKalenderData.events = {};

    let lines = raw.split(/\r?\n/).map(function(l) { return l.trim(); }).filter(Boolean);
    let berhasil = 0;
    let gagalBaris = [];

    lines.forEach(function(line) {
        let colonIdx = line.indexOf(':');
        if (colonIdx === -1) {
            gagalBaris.push(line);
            return;
        }
        let datePart = line.slice(0, colonIdx).trim();
        let descPart = line.slice(colonIdx + 1).trim();
        if (!datePart || !descPart) {
            gagalBaris.push(line);
            return;
        }

        // Deteksi kategori Libur/... atau Acara/...
        let kategori = 'agenda';
        let judul = descPart;
        let mKat = descPart.match(/^(libur|acara)\s*\/\s*(.+)/i);
        if (mKat) {
            kategori = mKat[1].toLowerCase();
            judul = mKat[2].trim();
        }

        // Parse format "10 Oktober 2026" atau rentang "13-14 November 2026" atau "2026-10-10"
        let daftarDateKey = [];
        let mIso = datePart.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        let mIndo = datePart.match(/^(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?\s+([a-zA-Z]+)\s+(\d{4})/);

        if (mIso) {
            let y = parseInt(mIso[1], 10);
            let m = parseInt(mIso[2], 10);
            let d = parseInt(mIso[3], 10);
            daftarDateKey.push(y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0'));
        } else if (mIndo) {
            let dStart = parseInt(mIndo[1], 10);
            let dEnd = mIndo[2] ? parseInt(mIndo[2], 10) : dStart;
            let mNum = window.parseBulanIndonesiaKeAngka(mIndo[3]);
            let yNum = parseInt(mIndo[4], 10);
            if (!mNum || dStart < 1 || dStart > 31) {
                gagalBaris.push(line);
                return;
            }
            let minD = Math.min(dStart, dEnd);
            let maxD = Math.min(31, Math.max(dStart, dEnd));
            for (let d = minD; d <= maxD; d++) {
                daftarDateKey.push(yNum + '-' + String(mNum).padStart(2, '0') + '-' + String(d).padStart(2, '0'));
            }
        } else {
            gagalBaris.push(line);
            return;
        }

        daftarDateKey.forEach(function(dk) {
            if (!Array.isArray(window.adminJadwalKalenderData.events[dk])) {
                window.adminJadwalKalenderData.events[dk] = window.adminJadwalKalenderData.events[dk]
                    ? Object.values(window.adminJadwalKalenderData.events[dk])
                    : [];
            }
            let arr = window.adminJadwalKalenderData.events[dk];
            let sudahAda = arr.some(function(ev) {
                return String(ev.title || '').toLowerCase() === judul.toLowerCase() && (ev.kategori || 'agenda') === kategori;
            });
            if (!sudahAda) {
                arr.push({
                    id: 'cal_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
                    title: judul,
                    jam: '',
                    kategori: kategori,
                    dibuat: new Date().toISOString()
                });
                berhasil++;
            }
        });
    });

    if (berhasil > 0) {
        if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
        window.renderKalenderGuru();
        ta.value = '';
        window.togglePanelImportLiburAcara(false);
    }

    if (gagalBaris.length > 0) {
        alert('✅ ' + berhasil + ' tanggal tersimpan.\n⚠️ ' + gagalBaris.length + ' baris gagal dibaca (pastikan format: 10 Oktober 2026: Libur/Nama).');
    } else {
        alert('✅ Berhasil menyimpan ' + berhasil + ' agenda Libur/Acara ke Kalender & otomatis tersinkron ke Rencana Pembelajaran!');
    }
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

/* =========================================================================
   MESIN JADWAL PELAJARAN FULL-FIT (KELAS X, KELAS XI & XII, FOTO/PDF, & ZOOM)
   ========================================================================= */
window._jadwalActiveSheetId = 'kelas_x';
window._jadwalZoomState = {
    scale: 1,
    tx: 0,
    ty: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    baseTx: 0,
    baseTy: 0,
    pinching: false,
    pinchStartDist: 0,
    pinchStartScale: 1
};

window.pastikanStrukturJadwalMedia = function() {
    if (!window.adminJadwalKalenderData || typeof window.adminJadwalKalenderData !== 'object') {
        window.adminJadwalKalenderData = { excelHtml: '', events: {}, mediaSheets: [] };
    }
    let raw = window.adminJadwalKalenderData.mediaSheets;
    let arr = Array.isArray(raw) ? raw : (raw && typeof raw === 'object' ? Object.values(raw) : []);
    arr = arr.filter(function(item) { return item && item.id && item.label; });

    if (arr.length === 0) {
        arr = [
            { id: 'kelas_x', label: '📘 Kelas X', url: '', updatedAt: 0 },
            { id: 'kelas_xi_xii', label: '📗 Kelas XI & XII', url: '', updatedAt: 0 }
        ];
    }
    window.adminJadwalKalenderData.mediaSheets = arr;

    let adaAktif = arr.some(function(s) { return s.id === window._jadwalActiveSheetId; });
    if (!adaAktif) {
        window._jadwalActiveSheetId = arr[0].id;
    }
    return arr;
};

window.ambilSheetJadwalAktif = function() {
    let arr = window.pastikanStrukturJadwalMedia();
    return arr.find(function(s) { return s.id === window._jadwalActiveSheetId; }) || arr[0];
};

window.muatTabelJadwalExcel = function() {
    window.pastikanStrukturJadwalMedia();
    window.pasangEventZoomPanJadwal();
    window.renderJadwalSekolahMedia();
};

window.renderJadwalSekolahMedia = function() {
    let sheets = window.pastikanStrukturJadwalMedia();
    let activeSheet = window.ambilSheetJadwalAktif();

    let tabsEl = document.getElementById('jadwal-sheet-tabs');
    if (tabsEl) {
        let htmlTabs = '';
        sheets.forEach(function(sh) {
            let isAct = (sh.id === activeSheet.id);
            let isDefault = (sh.id === 'kelas_x' || sh.id === 'kelas_xi_xii');
            let dot = sh.url ? '<span class="jadwal-tab-dot"></span>' : '';
            let safeId = String(sh.id).replace(/'/g, "\\'");
            let safeLabel = String(sh.label).replace(/</g, '&lt;').replace(/>/g, '&gt;');
            let delBtn = (!isDefault && isAct)
                ? '<span class="jadwal-tab-del" onclick="event.stopPropagation(); window.hapusTabJadwalMedia(\'' + safeId + '\')" title="Hapus Tab Ini">✕</span>'
                : '';

            htmlTabs +=
                '<button type="button" class="jadwal-sheet-tab' + (isAct ? ' active' : '') + '" onclick="window.pilihTabJadwalMedia(\'' + safeId + '\')">' +
                    dot + '<span>' + safeLabel + '</span>' + delBtn +
                '</button>';
        });
        htmlTabs += '<button type="button" class="jadwal-sheet-tab add-tab" onclick="window.tambahTabJadwalMedia()" title="Tambah Tab Jadwal Baru">+ Tab</button>';
        tabsEl.innerHTML = htmlTabs;
    }

    let imgEl = document.getElementById('jadwal-viewer-img');
    let emptyEl = document.getElementById('jadwal-empty-state');
    let emptyTitle = document.getElementById('jadwal-empty-title');
    let btnHapus = document.getElementById('btn-hapus-jadwal-media');

    window.resetZoomJadwal();

    if (activeSheet && activeSheet.url) {
        if (imgEl) {
            imgEl.src = activeSheet.url;
            imgEl.style.display = 'block';
        }
        if (emptyEl) emptyEl.style.display = 'none';
        if (btnHapus) btnHapus.style.display = 'inline-flex';
    } else {
        if (imgEl) {
            imgEl.src = '';
            imgEl.style.display = 'none';
        }
        if (emptyTitle) emptyTitle.innerText = 'Belum Ada Jadwal untuk ' + (activeSheet ? activeSheet.label : 'Tab Ini');
        if (emptyEl) emptyEl.style.display = 'flex';
        if (btnHapus) btnHapus.style.display = 'none';
    }
};

window.pilihTabJadwalMedia = function(sheetId) {
    window._jadwalActiveSheetId = sheetId;
    window.renderJadwalSekolahMedia();
};

window.tambahTabJadwalMedia = function() {
    window.tampilkanCustomDialog('prompt', 'Nama Tab Jadwal Baru (Contoh: Jadwal Piket / Lab):', '', function(nama) {
        if (!nama || !nama.trim()) return;
        let sheets = window.pastikanStrukturJadwalMedia();
        let newId = 'jadwal_' + Date.now();
        sheets.push({ id: newId, label: '📋 ' + nama.trim(), url: '', updatedAt: 0 });
        window._jadwalActiveSheetId = newId;
        window.renderJadwalSekolahMedia();
        if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
    });
};

window.hapusTabJadwalMedia = function(sheetId) {
    let sheets = window.pastikanStrukturJadwalMedia();
    let idx = sheets.findIndex(function(s) { return s.id === sheetId; });
    if (idx === -1) return;
    window.tampilkanCustomDialog('confirm', 'Hapus tab "' + sheets[idx].label + '"?', null, function(isYes) {
        if (!isYes) return;
        sheets.splice(idx, 1);
        window._jadwalActiveSheetId = sheets[0] ? sheets[0].id : 'kelas_x';
        window.renderJadwalSekolahMedia();
        if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
    });
};

window.hapusMediaJadwalAktif = function() {
    let activeSheet = window.ambilSheetJadwalAktif();
    if (!activeSheet || !activeSheet.url) return;
    window.tampilkanCustomDialog('confirm', 'Hapus gambar jadwal di tab ' + activeSheet.label + '?', null, function(isYes) {
        if (!isYes) return;
        activeSheet.url = '';
        activeSheet.updatedAt = Date.now();
        window.renderJadwalSekolahMedia();
        if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
    });
};

window.toggleFullscreenModalJadwal = function() {
    let box = document.querySelector('#modal-jadwal-guru .modal-box');
    let btn = document.getElementById('btn-fullscreen-jadwal');
    if (!box) return;
    let isFull = box.classList.toggle('jadwal-modal-fullscreen');
    if (btn) btn.innerText = isFull ? '🗗' : '⛶';
    window.resetZoomJadwal();
};

// --- KONTROL ZOOM & PAN (DEFAULT FIT FULL 1 LAYAR TANPA GESER) ---
window.terapkanTransformJadwal = function() {
    let imgEl = document.getElementById('jadwal-viewer-img');
    let stage = document.getElementById('jadwal-viewer-stage');
    let lbl = document.getElementById('lbl-zoom-jadwal');
    let z = window._jadwalZoomState;

    if (z.scale <= 1.01) {
        z.scale = 1;
        z.tx = 0;
        z.ty = 0;
    } else if (imgEl && stage) {
        let imgW = imgEl.offsetWidth || 0;
        let imgH = imgEl.offsetHeight || 0;
        let maxTx = Math.max(0, ((imgW * z.scale) - stage.clientWidth) / 2 + 80);
        let maxTy = Math.max(0, ((imgH * z.scale) - stage.clientHeight) / 2 + 80);
        z.tx = Math.max(-maxTx, Math.min(maxTx, z.tx));
        z.ty = Math.max(-maxTy, Math.min(maxTy, z.ty));
    }

    if (imgEl) {
        imgEl.style.transform = 'translate(' + Math.round(z.tx) + 'px, ' + Math.round(z.ty) + 'px) scale(' + z.scale.toFixed(3) + ')';
    }
    if (stage) {
        stage.classList.toggle('is-zoomed', z.scale > 1.01);
    }
    if (lbl) {
        lbl.innerText = z.scale <= 1.01 ? 'Fit' : Math.round(z.scale * 100) + '%';
    }
};

window.resetZoomJadwal = function() {
    let z = window._jadwalZoomState;
    z.scale = 1;
    z.tx = 0;
    z.ty = 0;
    z.dragging = false;
    z.pinching = false;
    window.terapkanTransformJadwal();
};

window.aturZoomJadwalStep = function(delta) {
    let imgEl = document.getElementById('jadwal-viewer-img');
    if (!imgEl || imgEl.style.display === 'none') return;
    let z = window._jadwalZoomState;
    z.scale = Math.max(1, Math.min(6, z.scale + delta));
    window.terapkanTransformJadwal();
};

window.pasangEventZoomPanJadwal = function() {
    let stage = document.getElementById('jadwal-viewer-stage');
    if (!stage || stage.getAttribute('data-zoom-bound') === '1') return;
    stage.setAttribute('data-zoom-bound', '1');

    // 1. Trackpad / Mouse Wheel:
    //    - Cubit (Pinch) / Ctrl+Scroll (e.ctrlKey === true)  -> ZOOM IN / OUT
    //    - 2 Jari Scroll (e.ctrlKey === false)               -> SCROLL / GESER GAMBAR
    stage.addEventListener('wheel', function(e) {
        let imgEl = document.getElementById('jadwal-viewer-img');
        if (!imgEl || imgEl.style.display === 'none') return;
        e.preventDefault();
        e.stopPropagation();

        let z = window._jadwalZoomState;
        if (e.ctrlKey) {
            let factor = Math.exp(-e.deltaY * 0.012);
            let nextScale = Math.max(1, Math.min(6, z.scale * factor));
            if (nextScale === z.scale) return;

            let rect = stage.getBoundingClientRect();
            let cx = e.clientX - (rect.left + rect.width / 2);
            let cy = e.clientY - (rect.top + rect.height / 2);
            let ratio = nextScale / z.scale;

            z.tx = cx - (cx - z.tx) * ratio;
            z.ty = cy - (cy - z.ty) * ratio;
            z.scale = nextScale;
            window.terapkanTransformJadwal();
        } else {
            if (z.scale > 1.01) {
                z.tx -= e.deltaX;
                z.ty -= e.deltaY;
                window.terapkanTransformJadwal();
            }
        }
    }, { passive: false });

    // Dukungan Pinch Safari macOS
    stage.addEventListener('gesturestart', function(e) {
        e.preventDefault();
        window._jadwalZoomState.pinchStartScale = window._jadwalZoomState.scale;
    }, { passive: false });

    stage.addEventListener('gesturechange', function(e) {
        e.preventDefault();
        let z = window._jadwalZoomState;
        z.scale = Math.max(1, Math.min(6, (z.pinchStartScale || 1) * (e.scale || 1)));
        window.terapkanTransformJadwal();
    }, { passive: false });

    // 2. Klik 2x: Zoom 2.2x di titik klik atau kembali ke Fit Full
    stage.addEventListener('dblclick', function(e) {
        let imgEl = document.getElementById('jadwal-viewer-img');
        if (!imgEl || imgEl.style.display === 'none') return;
        e.preventDefault();
        let z = window._jadwalZoomState;
        if (z.scale > 1.05) {
            window.resetZoomJadwal();
        } else {
            let rect = stage.getBoundingClientRect();
            let cx = e.clientX - (rect.left + rect.width / 2);
            let cy = e.clientY - (rect.top + rect.height / 2);
            z.scale = 2.4;
            z.tx = -cx * 1.4;
            z.ty = -cy * 1.4;
            window.terapkanTransformJadwal();
        }
    });

    // 3. Mouse Drag saat sedang di-zoom
    stage.addEventListener('mousedown', function(e) {
        let z = window._jadwalZoomState;
        if (z.scale <= 1.01) return;
        e.preventDefault();
        z.dragging = true;
        z.startX = e.clientX;
        z.startY = e.clientY;
        z.baseTx = z.tx;
        z.baseTy = z.ty;
        stage.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', function(e) {
        let z = window._jadwalZoomState;
        if (!z.dragging) return;
        z.tx = z.baseTx + (e.clientX - z.startX);
        z.ty = z.baseTy + (e.clientY - z.startY);
        window.terapkanTransformJadwal();
    });

    window.addEventListener('mouseup', function() {
        let z = window._jadwalZoomState;
        if (!z.dragging) return;
        z.dragging = false;
        stage.classList.remove('is-dragging');
    });

    // 4. Touch iPad / HP: Pinch (ubah jarak 2 jari) = Zoom, Geser 2 jari / 1 jari = Scroll
    function jarakDuaJari(t1, t2) {
        let dx = t1.clientX - t2.clientX;
        let dy = t1.clientY - t2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    stage.addEventListener('touchstart', function(e) {
        let imgEl = document.getElementById('jadwal-viewer-img');
        if (!imgEl || imgEl.style.display === 'none') return;
        let z = window._jadwalZoomState;

        if (e.touches.length === 2) {
            z.pinching = true;
            z.dragging = false;
            z.pinchStartDist = jarakDuaJari(e.touches[0], e.touches[1]);
            z.pinchStartScale = z.scale;
            z.pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            z.pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        } else if (e.touches.length === 1 && z.scale > 1.01) {
            z.dragging = true;
            z.pinching = false;
            z.startX = e.touches[0].clientX;
            z.startY = e.touches[0].clientY;
            z.baseTx = z.tx;
            z.baseTy = z.ty;
        }
    }, { passive: true });

    stage.addEventListener('touchmove', function(e) {
        let z = window._jadwalZoomState;
        if (z.pinching && e.touches.length === 2) {
            e.preventDefault();
            let curDist = jarakDuaJari(e.touches[0], e.touches[1]);
            let curMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            let curMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

            // Geser 2 jari bersamaan -> scroll/pan halus
            if (z.scale > 1.01) {
                z.tx += (curMidX - (z.pinchMidX || curMidX));
                z.ty += (curMidY - (z.pinchMidY || curMidY));
            }
            z.pinchMidX = curMidX;
            z.pinchMidY = curMidY;

            // Cubit 2 jari (perubahan jarak > 8px) -> zoom in/out
            if (z.pinchStartDist > 0 && Math.abs(curDist - z.pinchStartDist) > 8) {
                z.scale = Math.max(1, Math.min(6, z.pinchStartScale * (curDist / z.pinchStartDist)));
            }
            window.terapkanTransformJadwal();
        } else if (z.dragging && e.touches.length === 1 && z.scale > 1.01) {
            e.preventDefault();
            z.tx = z.baseTx + (e.touches[0].clientX - z.startX);
            z.ty = z.baseTy + (e.touches[0].clientY - z.startY);
            window.terapkanTransformJadwal();
        }
    }, { passive: false });

    stage.addEventListener('touchend', function(e) {
        let z = window._jadwalZoomState;
        if (e.touches.length < 2) z.pinching = false;
        if (e.touches.length === 0) z.dragging = false;
    });
};

// --- MESIN UPLOAD FOTO / PDF / PASTE SCREENSHOT KE CLOUDINARY ---
window.setStatusUploadJadwal = function(pesan, warnaBg) {
    let st = document.getElementById('jadwal-upload-status');
    if (!st) return;
    if (!pesan) {
        st.style.display = 'none';
        return;
    }
    st.style.display = 'block';
    st.style.background = warnaBg || '#0369a1';
    st.innerText = pesan;
};

// KHUSUS JADWAL PELAJARAN: Upload 100% resolusi & kualitas asli tanpa pengecilan/kompresi
window.siapkanBlobGambarJadwal = function(fileOrBlob) {
    return Promise.resolve(fileOrBlob);
};

window.kirimBlobJadwalKeCloudinary = async function(blob, namaFile) {
    let formData = new FormData();
    formData.append('file', blob, namaFile || ('jadwal_hd_' + Date.now() + '.png'));
    formData.append('upload_preset', 'studykawan_video');

    let response = await fetch('https://api.cloudinary.com/v1_1/rtkfvwvg/image/upload', {
        method: 'POST',
        body: formData
    });
    let data = await response.json();
    if (!response.ok || !data || !data.secure_url) {
        throw new Error((data && data.error && data.error.message) ? data.error.message : 'Gagal unggah ke Cloudinary.');
    }
    return data.secure_url;
};

// Render PDF Jadwal pada resolusi ultra-tajam (PNG lossless, hingga 3600px)
window.renderHalamanPdfKeBlobJadwal = async function(pdfDoc, pageNum) {
    let page = await pdfDoc.getPage(pageNum);
    let vp1 = page.getViewport({ scale: 1 });
    let scale = Math.min(4.0, Math.max(2.6, 3600 / Math.max(vp1.width, vp1.height)));
    let viewport = page.getViewport({ scale: scale });

    let canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport: viewport }).promise;

    return await new Promise(function(resolve) {
        canvas.toBlob(function(blob) { resolve(blob); }, 'image/png');
    });
};

window.prosesSimpanGambarJadwalKeTab = async function(fileOrBlob, targetSheetId) {
    let sheets = window.pastikanStrukturJadwalMedia();
    let targetSheet = sheets.find(function(s) { return s.id === targetSheetId; }) || window.ambilSheetJadwalAktif();
    let btnUp = document.getElementById('btn-upload-jadwal-media');

    if (btnUp) btnUp.disabled = true;
    window.setStatusUploadJadwal('⏳ Mengunggah gambar jadwal untuk ' + targetSheet.label + ' ke Cloudinary...', '#0369a1');

    try {
        let blobSiap = await window.siapkanBlobGambarJadwal(fileOrBlob);
        let ext = (blobSiap.type && blobSiap.type.indexOf('png') !== -1) ? 'png' : 'jpg';
        let secureUrl = await window.kirimBlobJadwalKeCloudinary(blobSiap, 'jadwal_' + targetSheet.id + '_' + Date.now() + '.' + ext);

        targetSheet.url = secureUrl;
        targetSheet.updatedAt = Date.now();
        window.renderJadwalSekolahMedia();
        if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();

        window.setStatusUploadJadwal('✅ Jadwal ' + targetSheet.label + ' berhasil disimpan!', '#15803d');
        setTimeout(function() { window.setStatusUploadJadwal(''); }, 2500);
    } catch (err) {
        console.error('Upload Jadwal error:', err);
        window.setStatusUploadJadwal('❌ Gagal menyimpan jadwal: ' + (err ? err.message : 'Periksa internet'), '#b91c1c');
    } finally {
        if (btnUp) btnUp.disabled = false;
    }
};

window.uploadFileJadwalMedia = async function(input) {
    let file = input && input.files ? input.files[0] : null;
    if (input) input.value = '';
    if (!file) return;

    let activeSheet = window.ambilSheetJadwalAktif();
    let isPdf = (file.type === 'application/pdf') || /\.pdf$/i.test(file.name || '');

    if (!isPdf) {
        await window.prosesSimpanGambarJadwalKeTab(file, activeSheet.id);
        return;
    }

    // Jika file adalah PDF: konversi halaman PDF ke gambar tajam lalu unggah ke Cloudinary
    let btnUp = document.getElementById('btn-upload-jadwal-media');
    if (btnUp) btnUp.disabled = true;
    window.setStatusUploadJadwal('⏳ Memuat mesin PDF & merender halaman jadwal...', '#0369a1');

    try {
        if (typeof window.pastikanMesinDokumenSiap === 'function') {
            await window.pastikanMesinDokumenSiap('pdf');
        }
        if (!window.pdfjsLib) {
            throw new Error('Mesin pembaca PDF belum siap. Periksa koneksi internet.');
        }

        let arrayBuf = await file.arrayBuffer();
        let pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuf }).promise;
        let sheets = window.pastikanStrukturJadwalMedia();

        // Jika PDF memiliki 2 halaman & ada tab Kelas X + Kelas XI & XII, tawarkan isi keduanya sekaligus
        if (pdfDoc.numPages >= 2 && sheets.length >= 2) {
            let bagiDua = confirm(
                'File PDF ini memiliki ' + pdfDoc.numPages + ' halaman.\n\n' +
                '• Klik OK untuk otomatis memasukkan Halaman 1 ke "' + sheets[0].label + '" dan Halaman 2 ke "' + sheets[1].label + '".\n' +
                '• Klik Batal untuk hanya memasukkan Halaman 1 ke tab "' + activeSheet.label + '".'
            );

            if (bagiDua) {
                window.setStatusUploadJadwal('⏳ Merender & mengunggah Halaman 1 (' + sheets[0].label + ')...', '#0369a1');
                let blob1 = await window.renderHalamanPdfKeBlobJadwal(pdfDoc, 1);
                sheets[0].url = await window.kirimBlobJadwalKeCloudinary(blob1, 'jadwal_p1_' + Date.now() + '.jpg');
                sheets[0].updatedAt = Date.now();

                window.setStatusUploadJadwal('⏳ Merender & mengunggah Halaman 2 (' + sheets[1].label + ')...', '#0369a1');
                let blob2 = await window.renderHalamanPdfKeBlobJadwal(pdfDoc, 2);
                sheets[1].url = await window.kirimBlobJadwalKeCloudinary(blob2, 'jadwal_p2_' + Date.now() + '.jpg');
                sheets[1].updatedAt = Date.now();

                window.renderJadwalSekolahMedia();
                if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
                window.setStatusUploadJadwal('✅ Kedua halaman PDF berhasil disimpan ke Kelas X & Kelas XI–XII!', '#15803d');
                setTimeout(function() { window.setStatusUploadJadwal(''); }, 3000);
                return;
            }
        }

        let blobSingle = await window.renderHalamanPdfKeBlobJadwal(pdfDoc, 1);
        await window.prosesSimpanGambarJadwalKeTab(blobSingle, activeSheet.id);
    } catch (err) {
        console.error('Upload PDF Jadwal error:', err);
        window.setStatusUploadJadwal('❌ Gagal memproses PDF: ' + (err ? err.message : 'Error'), '#b91c1c');
    } finally {
        if (btnUp) btnUp.disabled = false;
    }
};

// Tangkap Paste Screenshot (Cmd+V / Ctrl+V) saat Tab Jadwal Pelajaran sedang terbuka
document.addEventListener('paste', function(e) {
    let modal = document.getElementById('modal-jadwal-guru');
    let viewJadwal = document.getElementById('view-jadwal-excel');
    if (!modal || modal.style.display !== 'flex') return;
    if (!viewJadwal || viewJadwal.style.display === 'none') return;

    let clip = e.clipboardData || window.clipboardData;
    if (!clip || !clip.items) return;

    for (let i = 0; i < clip.items.length; i++) {
        let item = clip.items[i];
        if (item && item.type && item.type.indexOf('image/') === 0) {
            let blob = item.getAsFile();
            if (blob) {
                e.preventDefault();
                e.stopPropagation();
                let activeSheet = window.ambilSheetJadwalAktif();
                window.prosesSimpanGambarJadwalKeTab(blob, activeSheet.id);
                break;
            }
        }
    }
}, true);

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

        // Catat progres Event Ujian SAS (khusus Ruang Latihan dalam rentang jadwal WIB)
        if (typeof window.catatProgresEventSAS === "function") {
            window.catatProgresEventSAS(lb, aktivitas, arrSoalBenar);
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

window.toggleMenuHeaderMore = function(e) {
    if (e) e.stopPropagation();
    let dd = document.getElementById('header-more-dropdown');
    let btn = document.getElementById('btn-header-more');
    if (!dd) return;

    let willOpen = (dd.style.display === 'none' || !dd.style.display);
    dd.style.display = willOpen ? 'flex' : 'none';
    if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (willOpen && typeof window.sinkronkanTitikMerahHeaderMore === 'function') {
        window.sinkronkanTitikMerahHeaderMore();
    }
};

window.tutupMenuHeaderMore = function() {
    let dd = document.getElementById('header-more-dropdown');
    let btn = document.getElementById('btn-header-more');
    if (dd) dd.style.display = 'none';
    if (btn) btn.setAttribute('aria-expanded', 'false');
};

window.sinkronkanTitikMerahHeaderMore = function() {
    let badgeMisi = document.getElementById('badge-header-misi');
    let dot = document.getElementById('badge-header-more-dot');
    if (!dot) return;
    let adaMisi = Boolean(badgeMisi && badgeMisi.style.display !== 'none' && parseInt(badgeMisi.innerText || '0', 10) > 0);
    dot.style.display = adaMisi ? 'block' : 'none';
};

document.addEventListener('click', function(e) {
    if (!e.target || !e.target.closest || !e.target.closest('.header-more-wrap')) {
        window.tutupMenuHeaderMore();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    let badgeMisi = document.getElementById('badge-header-misi');
    if (badgeMisi) {
        let obsMisi = new MutationObserver(window.sinkronkanTitikMerahHeaderMore);
        obsMisi.observe(badgeMisi, { attributes: true, childList: true, characterData: true, subtree: true });
        window.sinkronkanTitikMerahHeaderMore();
    }
    window.perbaruiUIHeaderProfilSiswa();
});

window.perbaruiUIHeaderProfilSiswa = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let uName = sessionStorage.getItem("username");

    let btnProfil = document.getElementById('btn-profil-utama');
    let btnLogin = document.getElementById('btn-login-utama');
    let moreLogoutWrap = document.getElementById('header-more-logout-wrap');

    // Tombol LOGIN hanya tampil jika belum login sama sekali
    if (btnLogin) {
        btnLogin.style.display = stat ? 'none' : 'block';
    }

    // Khusus Admin/Tamu, sediakan tombol keluar di dalam menu titik tiga agar tidak terkunci
    if (moreLogoutWrap) {
        moreLogoutWrap.style.display = (stat === 'admin' || stat === 'tamu') ? 'block' : 'none';
    }

    if (stat === "siswa" && uName) {
        if (btnProfil) btnProfil.style.display = 'flex';

        let lb = (window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) ? window.leaderboardSiswaData[uName] : null;
        if (lb) {
            let lencana = window.kalkulasiLencanaSains(lb.xp || 0);
            let namaTampil = lb.namaPanggilan || lb.namaLengkap.split(' ')[0];

            let namaEl = document.getElementById('header-profil-nama');
            let fotoEl = document.getElementById('header-profil-foto');
            if (namaEl) namaEl.innerText = namaTampil;
            if (fotoEl) {
                if (lb.foto) fotoEl.src = lb.foto;
                fotoEl.style.borderColor = lencana.warna;
            }

            if (!window._presensiSesiTercatat && typeof window.updatePresensiOnlineSiswa === "function") {
                window._presensiSesiTercatat = true;
                window.updatePresensiOnlineSiswa(true, true);
            }
        }
    } else {
        if (btnProfil) btnProfil.style.display = 'none';
    }
    window.hitungDanUpdateBadgeNotifikasi();
    window.sinkronkanTitikMerahHeaderMore();
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

    if (typeof window.renderKartuEventSASDiProfil === "function") {
        window.renderKartuEventSASDiProfil(uName);
    }

    window.bukaModal('modal-profil-siswa');

    // Tarik data terbaru dari server setiap kali siswa membuka Profil agar perubahan Admin langsung tampil
    if (typeof window.muatProfilSiswaSekarangRest === "function") {
        window.muatProfilSiswaSekarangRest(true, function() {
            if (typeof window.sinkronkanModeEditorKhususSiswa === "function") {
                window.sinkronkanModeEditorKhususSiswa(false);
            }
        });
    }
};

/* =========================================================================
   EVENT UJIAN SAS — 1 PROGRESS BAR DENGAN 6 CHECKPOINT KLAIM LANGSUNG
   - Periode: 26 Nov 2026 (18:00 WIB) s.d. 3 Des 2026 (08:00 WIB)
   - Sumber: Khusus soal PG & IS benar di Ruang Latihan
   - Klaim: Langsung di Ruang Masuk Ujian, Ruang Masuk Latihan, & Profil (1x/tier)
   ========================================================================= */
window.EVENT_SAS_CONFIG = {
    id: 'sas_nov_des_2026',
    judul: 'Event Ujian SAS',
    startMs: new Date('2026-11-26T18:00:00+07:00').getTime(),
    endMs: new Date('2026-12-03T08:00:00+07:00').getTime(),
    tiers: [
        { id: 't1', pg: 100,  is: 10,  reward: 1000,   shortReward: '+1rb' },
        { id: 't2', pg: 200,  is: 50,  reward: 2000,   shortReward: '+2rb' },
        { id: 't3', pg: 500,  is: 100, reward: 3000,   shortReward: '+3rb' },
        { id: 't4', pg: 1000, is: 200, reward: 10000,  shortReward: '+10rb' },
        { id: 't5', pg: 1500, is: 500, reward: 250000, shortReward: '+250rb' },
        { id: 't6', pg: 2500, is: 750, reward: 500000, shortReward: '+500rb' }
    ]
};

window.pasangCssEventSAS = function() {
    if (document.getElementById('event-sas-checkpoint-css')) return;
    let st = document.createElement('style');
    st.id = 'event-sas-checkpoint-css';
    st.textContent =
        '.sas-card{background:linear-gradient(135deg,#fffbeb 0%,#ffffff 100%);border:2px solid #f59e0b;border-radius:12px;padding:12px 13px;box-shadow:0 4px 12px rgba(245,158,11,0.12);font-family:Poppins,Quicksand,sans-serif;text-align:left;}' +
        '.sas-head{display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:5px;}' +
        '.sas-title{font-size:13px;font-weight:900;color:#92400e;}' +
        '.sas-badge{padding:2px 8px;border-radius:12px;font-size:10px;font-weight:800;white-space:nowrap;}' +
        '.sas-badge.is-wait{background:#fef3c7;color:#92400e;border:1px solid #f59e0b;}' +
        '.sas-badge.is-live{background:#dcfce7;color:#15803d;border:1px solid #22c55e;}' +
        '.sas-badge.is-end{background:#f1f5f9;color:#475569;border:1px solid #cbd5e1;}' +
        '.sas-meta{font-size:10.5px;color:#475569;line-height:1.45;margin-bottom:8px;}' +
        '.sas-counts{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;}' +
        '.sas-count-pill{flex:1;min-width:120px;background:#ffffff;border:1px solid #fde68a;border-radius:8px;padding:5px 8px;font-size:11px;font-weight:800;color:#1e293b;display:flex;justify-content:space-between;align-items:center;}' +
        '.sas-track-wrap{position:relative;padding-top:2px;margin:6px 0 10px 0;}' +
        '.sas-rail-bg{position:absolute;top:14px;left:8%;right:8%;height:7px;background:#e2e8f0;border-radius:6px;overflow:hidden;z-index:1;}' +
        '.sas-rail-fill{height:100%;background:linear-gradient(90deg,#0284c7 0%,#16a34a 55%,#f59e0b 100%);border-radius:6px;transition:width 0.35s ease;}' +
        '.sas-nodes-grid{position:relative;z-index:2;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:3px;}' +
        '.sas-node{display:flex;flex-direction:column;align-items:center;text-align:center;}' +
        '.sas-dot{width:28px;height:28px;border-radius:50%;border:2px solid #cbd5e1;background:#ffffff;color:#64748b;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;padding:0;cursor:default;transition:transform 0.15s,box-shadow 0.15s;}' +
        '.sas-dot.is-ready{background:linear-gradient(135deg,#f59e0b,#ea580c);border-color:#fde047;color:#ffffff;cursor:pointer;box-shadow:0 0 0 3px rgba(245,158,11,0.35);animation:pulse-badge 1.2s infinite;}' +
        '.sas-dot.is-ready:hover{transform:scale(1.12);}' +
        '.sas-dot.is-claimed{background:#16a34a;border-color:#86efac;color:#ffffff;}' +
        '.sas-rew{font-size:10px;font-weight:900;color:#b45309;margin-top:4px;line-height:1.15;}' +
        '.sas-rew.is-claimed{color:#15803d;}' +
        '.sas-req{font-size:8.5px;font-weight:700;color:#64748b;line-height:1.2;margin-top:2px;}' +
        '.sas-foot-note{font-size:10.5px;color:#64748b;font-weight:700;text-align:center;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:8px;padding:6px 8px;}' +
        'body.dark-mode-active .sas-card{background:#1e293b !important;border-color:#f59e0b !important;}' +
        'body.dark-mode-active .sas-title{color:#fde047 !important;}' +
        'body.dark-mode-active .sas-meta,body.dark-mode-active .sas-req{color:#cbd5e1 !important;}' +
        'body.dark-mode-active .sas-count-pill,body.dark-mode-active .sas-foot-note{background:#0f172a !important;border-color:#334155 !important;color:#f1f5f9 !important;}';
    document.head.appendChild(st);
};

window.dapatkanStatusEventSAS = function() {
    let now = Date.now();
    let cfg = window.EVENT_SAS_CONFIG;
    if (now < cfg.startMs) return 'belum';
    if (now > cfg.endMs) return 'selesai';
    return 'aktif';
};

window.ambilObjekLbSiswaEventSAS = function(uNameOpt) {
    let stat = sessionStorage.getItem('statusLogin');
    let uName = (uNameOpt || sessionStorage.getItem('username') || '').trim();
    let uLow = uName.toLowerCase();
    if (stat !== 'siswa' || !uLow || uLow === 'sbd' || uLow === 'tamu' || uLow === 'mahardika') return null;
    let cleanU = window.sanitasiKeyRekapFirebase ? window.sanitasiKeyRekapFirebase(uLow).toLowerCase() : uLow;
    let lb = (window.leaderboardSiswaData && (window.leaderboardSiswaData[uName] || window.leaderboardSiswaData[cleanU])) || null;
    return lb ? { uName: uName, cleanU: cleanU, lb: lb } : null;
};

window.pastikanDataEventSAS = function(lb) {
    if (!lb || typeof lb !== 'object') return { pg: 0, is: 0, claimedTiers: {}, updatedAt: 0 };
    if (!lb.eventSas2026 || typeof lb.eventSas2026 !== 'object') {
        lb.eventSas2026 = { pg: 0, is: 0, claimedTiers: {}, updatedAt: 0 };
    }
    lb.eventSas2026.pg = Math.max(0, Number(lb.eventSas2026.pg) || 0);
    lb.eventSas2026.is = Math.max(0, Number(lb.eventSas2026.is) || 0);
    if (!lb.eventSas2026.claimedTiers || typeof lb.eventSas2026.claimedTiers !== 'object') {
        lb.eventSas2026.claimedTiers = {};
    }
    return lb.eventSas2026;
};

window.hitungPersenGarisEventSAS = function(pgNow, isNow) {
    let tiers = window.EVENT_SAS_CONFIG.tiers;
    let prevPG = 0;
    let prevIS = 0;
    let segmenSelesai = 0;
    let parsial = 0;

    for (let i = 0; i < tiers.length; i++) {
        let t = tiers[i];
        if (pgNow >= t.pg && isNow >= t.is) {
            segmenSelesai++;
            prevPG = t.pg;
            prevIS = t.is;
        } else {
            let fPG = Math.max(0, Math.min(1, (pgNow - prevPG) / Math.max(1, t.pg - prevPG)));
            let fIS = Math.max(0, Math.min(1, (isNow - prevIS) / Math.max(1, t.is - prevIS)));
            parsial = Math.min(0.92, (fPG + fIS) / 2);
            break;
        }
    }

    return Math.min(100, Math.round(((segmenSelesai + parsial) / tiers.length) * 100));
};

window.rekamProgresEventSASDariLatihan = function(tipeSoal) {
    if (window.dapatkanStatusEventSAS() !== 'aktif') return;
    if (window.antiMacroGuard && window.antiMacroGuard.macroFlagged) return;

    let info = window.ambilObjekLbSiswaEventSAS();
    let lb = info ? info.lb : null;
    if (!lb) {
        let uName = (sessionStorage.getItem('username') || '').trim();
        if (sessionStorage.getItem('statusLogin') === 'siswa' && uName && typeof window.pastikanStrukturDualXPDanPet === 'function') {
            lb = window.pastikanStrukturDualXPDanPet(uName);
        }
    }
    if (!lb) return;

    let ev = window.pastikanDataEventSAS(lb);
    let rawT = String(tipeSoal || '').trim().toUpperCase();
    if (rawT === 'PG' || rawT === 'MC') {
        ev.pg++;
    } else if (rawT === 'IS' || rawT === 'SHORT_ANSWER' || rawT === 'ISIAN' || rawT === 'ISIAN SINGKAT') {
        ev.is++;
    } else {
        return;
    }
    ev.updatedAt = Date.now();
};

window.bangunHtmlWidgetEventSAS = function(uNameOpt) {
    window.pasangCssEventSAS();
    let cfg = window.EVENT_SAS_CONFIG;
    let status = window.dapatkanStatusEventSAS();
    let info = window.ambilObjekLbSiswaEventSAS(uNameOpt);
    let ev = info ? window.pastikanDataEventSAS(info.lb) : { pg: 0, is: 0, claimedTiers: {} };

    let badgeHtml = status === 'belum'
        ? '<span class="sas-badge is-wait">⏳ Mulai 26 Nov 18:00 WIB</span>'
        : (status === 'aktif'
            ? '<span class="sas-badge is-live">🔥 Berlangsung</span>'
            : '<span class="sas-badge is-end">🏁 Periode Selesai</span>');

    let persenGaris = window.hitungPersenGarisEventSAS(ev.pg, ev.is);
    let tierSiapList = [];
    let tierBerikutnya = null;

    let nodesHtml = cfg.tiers.map(function(t) {
        let tercapai = (ev.pg >= t.pg && ev.is >= t.is);
        let sudahKlaim = Boolean(ev.claimedTiers[t.id]);
        let siapKlaim = Boolean(info && tercapai && !sudahKlaim);

        if (siapKlaim) tierSiapList.push(t);
        if (!tercapai && !tierBerikutnya) tierBerikutnya = t;

        let dotCls = 'sas-dot' + (sudahKlaim ? ' is-claimed' : (siapKlaim ? ' is-ready' : ''));
        let dotIco = sudahKlaim ? '✓' : (siapKlaim ? '🎁' : '🔒');
        let clickAttr = siapKlaim ? (' onclick="window.klaimCheckpointEventSAS(\'' + t.id + '\')" title="Klik untuk klaim +' + t.reward.toLocaleString('id-ID') + ' XP &amp; Coin"') : (' title="Target: ' + t.pg + ' PG &amp; ' + t.is + ' IS benar (+' + t.reward.toLocaleString('id-ID') + ' XP/Coin)"');

        return '<div class="sas-node">' +
            '<button type="button" class="' + dotCls + '"' + clickAttr + '>' + dotIco + '</button>' +
            '<div class="sas-rew' + (sudahKlaim ? ' is-claimed' : '') + '">' + t.shortReward + '</div>' +
            '<div class="sas-req">' + t.pg + ' PG<br>' + t.is + ' IS</div>' +
        '</div>';
    }).join('');

    let aksiBawahHtml = '';
    if (!info) {
        aksiBawahHtml = '<div class="sas-foot-note">Login dengan akun siswa untuk mencatat progres &amp; klaim bonus checkpoint.</div>';
    } else if (tierSiapList.length > 0) {
        let totalSiap = tierSiapList.reduce(function(sum, t) { return sum + t.reward; }, 0);
        let labelTombol = tierSiapList.length === 1
            ? ('🎁 Klaim Checkpoint +' + totalSiap.toLocaleString('id-ID') + ' XP &amp; Coin')
            : ('🎁 Klaim ' + tierSiapList.length + ' Checkpoint (+' + totalSiap.toLocaleString('id-ID') + ' XP &amp; Coin)');
        aksiBawahHtml = '<button type="button" class="btn-action" style="background:linear-gradient(135deg,#f59e0b,#ea580c);font-size:12px;padding:9px 12px;font-weight:900;box-shadow:0 4px 10px rgba(234,88,12,0.32);" onclick="window.klaimCheckpointEventSAS(\'ALL\')">' + labelTombol + '</button>';
    } else if (!tierBerikutnya) {
        aksiBawahHtml = '<div class="sas-foot-note" style="background:#dcfce7;border-color:#22c55e;color:#15803d;">🏆 Selamat! Seluruh 6 Checkpoint Event Ujian SAS sudah diklaim!</div>';
    } else if (status === 'belum') {
        aksiBawahHtml = '<div class="sas-foot-note">⏳ Progres mulai dihitung 26 Nov 2026 pukul 18:00 WIB dari Ruang Latihan.</div>';
    } else if (status === 'selesai') {
        aksiBawahHtml = '<div class="sas-foot-note">🏁 Periode pengumpulan soal telah berakhir (3 Des 2026 pukul 08:00 WIB).</div>';
    } else {
        let kurangPG = Math.max(0, tierBerikutnya.pg - ev.pg);
        let kurangIS = Math.max(0, tierBerikutnya.is - ev.is);
        aksiBawahHtml = '<div class="sas-foot-note">Target berikutnya (<b>+' + tierBerikutnya.reward.toLocaleString('id-ID') + ' XP &amp; Coin</b>): kurang <b style="color:#0284c7;">' + kurangPG + ' PG</b> &amp; <b style="color:#d97706;">' + kurangIS + ' IS</b> benar lagi.</div>';
    }

    return '<div class="sas-card">' +
        '<div class="sas-head">' +
            '<div class="sas-title">🎯 Event Ujian SAS (Bonus Tambahan)</div>' +
            badgeHtml +
        '</div>' +
        '<div class="sas-meta">' +
            'Periode <b>26 Nov 18:00 – 3 Des 08:00 WIB</b> • Khusus <b>Ruang Latihan</b> • Di luar XP normal.' +
        '</div>' +
        '<div class="sas-counts">' +
            '<div class="sas-count-pill"><span>PG Benar</span><span style="color:#0284c7;">' + ev.pg + ' / 2500</span></div>' +
            '<div class="sas-count-pill"><span>IS Benar</span><span style="color:#d97706;">' + ev.is + ' / 750</span></div>' +
        '</div>' +
        '<div class="sas-track-wrap">' +
            '<div class="sas-rail-bg"><div class="sas-rail-fill" style="width:' + persenGaris + '%;"></div></div>' +
            '<div class="sas-nodes-grid">' + nodesHtml + '</div>' +
        '</div>' +
        aksiBawahHtml +
    '</div>';
};

window.renderKartuEventSASDiProfil = function(uNameOpt) {
    let modal = document.getElementById('modal-profil-siswa');
    if (!modal) return;
    let body = modal.querySelector('.modal-body');
    if (!body) return;

    let card = document.getElementById('profil-event-sas-card');
    if (!card) {
        card = document.createElement('div');
        card.id = 'profil-event-sas-card';
        card.style.marginBottom = '15px';
        let statPgEl = document.getElementById('profil-stat-pg');
        let statCard = statPgEl ? statPgEl.closest('div[style*="margin-bottom:15px"]') : null;
        if (statCard && statCard.nextSibling) body.insertBefore(card, statCard.nextSibling);
        else body.appendChild(card);
    }
    card.innerHTML = window.bangunHtmlWidgetEventSAS(uNameOpt);
};

window.renderKartuEventSASDiMasukUjian = function() {
    let modal = document.getElementById('modal-enter-ujian');
    if (!modal) return;
    let body = modal.querySelector('.modal-body');
    if (!body) return;

    let box = document.getElementById('ujian-event-sas-card');
    if (!box) {
        box = document.createElement('div');
        box.id = 'ujian-event-sas-card';
        box.style.marginTop = '4px';
        body.appendChild(box);
    }
    box.innerHTML = window.bangunHtmlWidgetEventSAS();
};

window.segarkanSemuaWidgetEventSAS = function() {
    if (document.getElementById('profil-event-sas-card')) window.renderKartuEventSASDiProfil();
    if (document.getElementById('ujian-event-sas-card')) window.renderKartuEventSASDiMasukUjian();
    if (typeof window.pastikanBannerEventSASLatihanAda === 'function') window.pastikanBannerEventSASLatihanAda();
};

window.klaimCheckpointEventSAS = async function(tierIdOrAll) {
    let info = window.ambilObjekLbSiswaEventSAS();
    if (!info || !info.lb) return alert('Silakan login dengan akun siswa terlebih dahulu.');
    if (window._sedangKlaimEventSAS) return;
    window._sedangKlaimEventSAS = true;

    try {
        let lb = info.lb;
        let guru = (window.guruAktif || sessionStorage.getItem('guruTarget') || 'mahardika').toLowerCase();

        // Verifikasi server agar anti-klaim ganda dari 2 tab/perangkat
        if (typeof window.bacaDataRestFirebase === 'function') {
            let srvObj = await new Promise(function(resolve) {
                window.bacaDataRestFirebase('data_guru/' + guru + '/leaderboard_siswa/' + info.cleanU, function(val) {
                    resolve(val && typeof val === 'object' ? val : null);
                }, function() {
                    resolve(null);
                }, { forceRefresh: true, ttlMs: 0 });
            });
            if (srvObj && srvObj.eventSas2026) {
                let locEv = window.pastikanDataEventSAS(lb);
                let mergedTiers = Object.assign({}, locEv.claimedTiers || {}, srvObj.eventSas2026.claimedTiers || {});
                lb.eventSas2026 = {
                    pg: Math.max(locEv.pg, Number(srvObj.eventSas2026.pg) || 0),
                    is: Math.max(locEv.is, Number(srvObj.eventSas2026.is) || 0),
                    claimedTiers: mergedTiers,
                    updatedAt: Date.now()
                };
            }
        }

        let ev = window.pastikanDataEventSAS(lb);
        let kandidat = (tierIdOrAll === 'ALL')
            ? window.EVENT_SAS_CONFIG.tiers
            : window.EVENT_SAS_CONFIG.tiers.filter(function(t) { return t.id === tierIdOrAll; });

        let diklaimSekarang = [];
        let totalBonus = 0;

        kandidat.forEach(function(t) {
            if (ev.pg >= t.pg && ev.is >= t.is && !ev.claimedTiers[t.id]) {
                ev.claimedTiers[t.id] = Date.now();
                diklaimSekarang.push(t);
                totalBonus += t.reward;
            }
        });

        if (diklaimSekarang.length === 0 || totalBonus <= 0) {
            window.segarkanSemuaWidgetEventSAS();
            return alert('ℹ️ Checkpoint belum terpenuhi atau sudah pernah diklaim sebelumnya.');
        }

        let curTotal = Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0;
        let curCoin = Number(lb.coin !== undefined ? lb.coin : (lb.xpTersedia !== undefined ? lb.xpTersedia : lb.xp)) || 0;
        lb.xpTotal = curTotal + totalBonus;
        lb.xp = lb.xpTotal;
        lb.coin = curCoin + totalBonus;
        lb.xpTersedia = lb.coin;
        ev.updatedAt = Date.now();

        if (typeof window.simpanLeaderboardSiswaKeDB === 'function') {
            window.simpanLeaderboardSiswaKeDB(info.uName, lb);
        }

        let totalEl = document.getElementById('profil-total-xp');
        if (totalEl) totalEl.innerText = lb.xpTotal + ' XP';
        if (typeof window.perbaruiUIHeaderProfilSiswa === 'function') window.perbaruiUIHeaderProfilSiswa();
        if (typeof window.perbaruiTampilanSaldoXPPet === 'function') window.perbaruiTampilanSaldoXPPet();
        window.segarkanSemuaWidgetEventSAS();

        let daftarTeks = diklaimSekarang.map(function(t) { return t.pg + ' PG + ' + t.is + ' IS (+' + t.reward.toLocaleString('id-ID') + ')'; }).join('\n• ');
        alert('🎉 Berhasil Klaim Event Ujian SAS!\n\n• ' + daftarTeks + '\n\nTotal tambahan masuk: +' + totalBonus.toLocaleString('id-ID') + ' XP & +' + totalBonus.toLocaleString('id-ID') + ' Coin!');
    } finally {
        window._sedangKlaimEventSAS = false;
    }
};

// Pasang otomatis kartu checkpoint Event Ujian SAS setiap Modal Masuk Ujian dibuka
document.addEventListener('DOMContentLoaded', function() {
    window.pasangCssEventSAS();
    let modalUjian = document.getElementById('modal-enter-ujian');
    if (modalUjian) {
        let obsUjianSas = new MutationObserver(function() {
            if (modalUjian.style.display === 'flex') {
                window.renderKartuEventSASDiMasukUjian();
            }
        });
        obsUjianSas.observe(modalUjian, { attributes: true, attributeFilter: ['style'] });
    }
});

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

    if (!email || !newPass || !newUser) return alert("Isi Gmail, Username Baru, dan Password Baru terlebih dahulu!");
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) return alert("⚠️ Masukkan alamat Gmail yang valid!");
    if (newPass.length < 6) return alert("Password minimal 6 karakter sesuai standar keamanan.");
    if (newUser === "sbd" || newUser === "mahardika") return alert("Username tersebut tidak diizinkan.");

    let oldRaw = (sessionStorage.getItem("username") || "").trim();
    let oldKey = oldRaw.toLowerCase();
    let akunSekarang = (window.akunSiswaData && (window.akunSiswaData[oldKey] || window.akunSiswaData[oldRaw])) || {};
    let isGmailMilikSendiri = Boolean(akunSekarang.gmail && akunSekarang.gmail.trim().toLowerCase() === email);

    if (newUser !== oldKey && window.akunSiswaData && window.akunSiswaData[newUser]) {
        return alert("⚠️ Username baru sudah dipakai siswa lain. Gunakan nama lain.");
    }

    let daftarAkunSamaGmail = Object.keys(window.akunSiswaData || {}).filter(function(k) {
        return k.toLowerCase() !== oldKey && window.akunSiswaData[k] && (window.akunSiswaData[k].gmail || "").toLowerCase() === email;
    });
    if (daftarAkunSamaGmail.length >= 5) {
        return alert("⚠️ Gmail ini sudah digunakan oleh 5 akun siswa lain (Maksimal 5 akun per Gmail).");
    }

    let statEl = document.getElementById('profil-status-gmail');

    // Jika memakai Gmail miliknya sendiri yang sudah pernah tertaut, langsung siap disimpan tanpa terblokir email-already-in-use
    if (isGmailMilikSendiri) {
        if (statEl) {
            statEl.innerText = "✅ Gmail Terverifikasi (Klik 2. Simpan)";
            statEl.style.background = "#27ae60";
            statEl.style.color = "white";
        }
        window.tempProfilKredensial = { email: email, newUser: newUser, newPass: newPass, forceVerified: true };
        return;
    }

    if (statEl) {
        statEl.innerText = "⏳ Memanggil Server Google...";
        statEl.style.background = "#f39c12";
        statEl.style.color = "white";
    }

    window.daftarkanEmailVerifikasiNyata(email, newPass, function(uid, isAlreadyVerified) {
        if (isAlreadyVerified) {
            if (statEl) { statEl.innerText = "✅ Gmail Valid (Siap Disimpan)"; statEl.style.background = "#27ae60"; }
        } else {
            if (statEl) { statEl.innerText = "📩 Link Dikirim! Cek Kotak Masuk Gmail."; statEl.style.background = "#e67e22"; }
            alert("Berhasil! Link verifikasi telah dikirim ke " + email + ". Klik link di Gmail Anda lalu tekan tombol '2. Simpan'.");
        }
        window.tempProfilKredensial = { email: email, newUser: newUser, newPass: newPass, forceVerified: isAlreadyVerified };
    }, function(err) {
        let code = (err && err.code) ? err.code : "";
        if (daftarAkunSamaGmail.length < 5 && (code.indexOf("email-already-in-use") !== -1 || code.indexOf("invalid-credential") !== -1 || code.indexOf("wrong-password") !== -1)) {
            if (statEl) { statEl.innerText = "✅ Gmail Terdaftar (Klik 2. Simpan)"; statEl.style.background = "#27ae60"; }
            window.tempProfilKredensial = { email: email, newUser: newUser, newPass: newPass, forceVerified: true };
            return;
        }
        if (statEl) { statEl.innerText = "❌ Gagal: " + (err ? err.message : "Error"); statEl.style.background = "#c0392b"; }
    });
};

window.terapkanGantiKredensialProfil = function() {
    let temp = window.tempProfilKredensial;
    if (!temp) return alert("Anda harus menekan tombol '1. Kirim Link Verifikasi' terlebih dahulu!");

    let statEl = document.getElementById('profil-status-gmail');
    if (statEl) {
        statEl.innerText = "⏳ Menyimpan ke Server...";
        statEl.style.background = "#f39c12";
        statEl.style.color = "white";
    }

    async function eksekusiSimpanKredensial() {
        let oldRaw = (sessionStorage.getItem("username") || "").trim();
        let akunMap = window.akunSiswaData || {};
        let oldKey = Object.keys(akunMap).find(function(k) { return k.toLowerCase() === oldRaw.toLowerCase(); }) || oldRaw.toLowerCase();
        let akunLama = akunMap[oldKey];
        if (!akunLama) {
            if (statEl) { statEl.innerText = "❌ Data akun tidak ditemukan"; statEl.style.background = "#c0392b"; }
            return;
        }

        let lbMap = window.leaderboardSiswaData || {};
        let oldLbKey = Object.keys(lbMap).find(function(k) { return k.toLowerCase() === oldKey.toLowerCase(); }) || oldKey;
        let lbLama = lbMap[oldLbKey] ? Object.assign({}, lbMap[oldLbKey]) : null;

        let guruAktif = (window.guruAktif || sessionStorage.getItem("guruTarget") || "mahardika").toLowerCase();
        let newUser = temp.newUser;
        let akunBaru = Object.assign({}, akunLama, {
            username: newUser,
            gmail: temp.email,
            password: temp.newPass,
            isAutoGenerated: false,
            updatedAt: new Date().toISOString()
        });

        window.akunSiswaData[newUser] = akunBaru;
        if (newUser !== oldKey) {
            delete window.akunSiswaData[oldKey];
            if (lbLama) {
                window.leaderboardSiswaData[newUser] = lbLama;
                delete window.leaderboardSiswaData[oldLbKey];
            }
        }

        // Pastikan seluruh tulisan ke Firebase selesai SEBELUM logout agar password baru 100% tersimpan
        let simpanServer = async function() {
            let tasks = [];
            if (typeof window.tulisDataRestFirebase === "function") {
                tasks.push(Promise.resolve(window.tulisDataRestFirebase("data_guru/" + guruAktif + "/akun_siswa/" + newUser, akunBaru, "PUT")));
                if (newUser !== oldKey) {
                    tasks.push(Promise.resolve(window.tulisDataRestFirebase("data_guru/" + guruAktif + "/akun_siswa/" + oldKey, null, "PUT")));
                }
                if (lbLama && newUser !== oldKey) {
                    tasks.push(Promise.resolve(window.tulisDataRestFirebase("data_guru/" + guruAktif + "/leaderboard_siswa/" + newUser, lbLama, "PUT")));
                    tasks.push(Promise.resolve(window.tulisDataRestFirebase("data_guru/" + guruAktif + "/leaderboard_siswa/" + oldLbKey, null, "PUT")));
                }
            }
            if (typeof window.simpanAkunSiswaKeDB === "function") {
                tasks.push(new Promise(function(res) {
                    try { window.simpanAkunSiswaKeDB(newUser, akunBaru, res); setTimeout(res, 1200); } catch (e) { res(); }
                }));
            }
            if (typeof window.simpanLeaderboardSiswaKeDB === "function" && lbLama) {
                try { window.simpanLeaderboardSiswaKeDB(newUser, lbLama); } catch (e) {}
            }
            await Promise.all(tasks);
        };

        if (typeof window.pastikanAuthFirebaseSiswaAktif === "function") {
            await new Promise(function(res) { window.pastikanAuthFirebaseSiswaAktif(res); });
        }
        await simpanServer();
        await new Promise(function(res) { setTimeout(res, 400); });

        window.tempProfilKredensial = null;
        if (statEl) { statEl.innerText = "✅ Tersimpan!"; statEl.style.background = "#27ae60"; }

        let pesanSukses = "🔐 Username & Password baru berhasil disimpan!\n\nUsername: " + newUser + "\nPassword lama (123456) sudah tidak berlaku.\nSilakan login ulang menggunakan password baru Anda.";
        if (typeof window.tampilkanCustomDialog === "function") {
            window.tampilkanCustomDialog("alert", pesanSukses, null, function() {
                window.prosesLogoutSistem(true);
            });
        } else {
            alert(pesanSukses);
            window.prosesLogoutSistem(true);
        }
    }

    if (temp.forceVerified) {
        eksekusiSimpanKredensial();
        return;
    }

    window.cekStatusVerifikasiGmail(temp.email, temp.newPass, function(isVerified) {
        if (isVerified) {
            eksekusiSimpanKredensial();
        } else {
            if (statEl) { statEl.innerText = "❌ Belum Diverifikasi"; statEl.style.background = "#c0392b"; }
            alert("Sistem mendeteksi Anda belum mengklik link konfirmasi di kotak masuk Gmail Anda.");
        }
    });
};

// 6. Mesin Papan Peringkat (Leaderboard Filterable + Tombol Segarkan Khusus Admin)
window.pasangTombolSegarkanLeaderboardAdmin = function() {
    let isAdmin = (typeof window.isAdminSession === 'function')
        ? window.isAdminSession()
        : (sessionStorage.getItem('statusLogin') === 'admin');
    let existing = document.getElementById('btn-admin-segarkan-lb');

    if (!isAdmin) {
        if (existing) existing.remove();
        return;
    }

    if (existing) return;
    let selCakupan = document.getElementById('lb-filter-cakupan');
    let filterBar = selCakupan ? selCakupan.closest('div[style*="display:flex"]') : null;
    if (!filterBar) return;

    let btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btn-admin-segarkan-lb';
    btn.className = 'btn-action';
    btn.style.cssText = 'background:#16a085; width:auto; padding:8px 14px; font-size:12px; border-radius:8px; align-self:flex-end; white-space:nowrap; box-shadow:0 2px 8px rgba(22,160,133,0.28);';
    btn.innerText = '🔄 Segarkan Leaderboard';
    btn.title = 'Tarik data terbaru dari Firebase & segarkan otomatis di perangkat semua siswa';
    btn.onclick = function() { window.klikSegarkanLeaderboardAdmin(btn); };
    filterBar.appendChild(btn);
};

window.klikSegarkanLeaderboardAdmin = function(btnEl) {
    if (sessionStorage.getItem('statusLogin') !== 'admin') return;
    let btn = btnEl || document.getElementById('btn-admin-segarkan-lb');
    if (btn) {
        btn.disabled = true;
        btn.innerText = '⏳ Menyegarkan...';
    }

    let selesai = function() {
        if (btn) {
            btn.disabled = false;
            btn.innerText = '🔄 Segarkan Leaderboard';
        }
        if (typeof window.ckToast === 'function') {
            window.ckToast('✅ Leaderboard diperbarui! Perangkat siswa juga akan otomatis menyegarkan data.');
        } else {
            alert('✅ Leaderboard berhasil disegarkan dari Firebase dan sinyal pembaruan otomatis sudah dikirim ke perangkat siswa!');
        }
    };

    if (typeof window.kirimSinyalSegarkanLeaderboardAdmin === 'function') {
        window.kirimSinyalSegarkanLeaderboardAdmin(selesai);
    } else if (typeof window.muatLeaderboardPenuhSekali === 'function') {
        window.muatLeaderboardPenuhSekali(function() {
            if (typeof window.renderTabelLeaderboard === 'function') window.renderTabelLeaderboard();
            selesai();
        }, true);
    } else {
        selesai();
    }
};

window.bukaModalLeaderboard = function() {
    document.getElementById('lb-filter-cakupan').value = 'semua';
    document.getElementById('lb-box-subfilter').style.display = 'none';
    window.pasangTombolSegarkanLeaderboardAdmin();

    let cont = document.getElementById('leaderboard-list-container');
    let belumPernahTarikPenuh = !window._lastFullLBFetchTime;
    if (cont && belumPernahTarikPenuh && typeof window.buatHTMLSkeleton === 'function') {
        cont.innerHTML = window.buatHTMLSkeleton('leaderboard', 5);
    } else {
        window.renderTabelLeaderboard();
        if (typeof window.perbaruiBannerMigrasiFotoAdmin === 'function') window.perbaruiBannerMigrasiFotoAdmin();
    }

    window.bukaModal('modal-leaderboard');

    if (sessionStorage.getItem('statusLogin') === 'siswa' && typeof window.cekSinyalRefreshLeaderboard === 'function') {
        window.cekSinyalRefreshLeaderboard(true, function(adaRefresh) {
            if (!adaRefresh && belumPernahTarikPenuh && typeof window.muatLeaderboardPenuhSekali === 'function') {
                window.muatLeaderboardPenuhSekali(function() {
                    window.renderTabelLeaderboard();
                }, false);
            }
        });
    } else if (belumPernahTarikPenuh && typeof window.muatLeaderboardPenuhSekali === 'function') {
        window.muatLeaderboardPenuhSekali(function() {
            window.renderTabelLeaderboard();
            if (typeof window.perbaruiBannerMigrasiFotoAdmin === 'function') window.perbaruiBannerMigrasiFotoAdmin();
        }, false);
    }
};

/* =========================================================================
   PENGATURAN KHUSUS ADMIN: TAMBAH XP, COIN, STAT SOAL (PG/PGK/IS/ESSAY),
   STREAK LOGIN, & AKSES TOOLBAR EDIT KHUSUS RUANG OLIMPIADE BIOLOGI
   ========================================================================= */
window.apakahAdminBolehAturData = function() {
    if (typeof window.isAdminSession === 'function') return window.isAdminSession();
    let st = sessionStorage.getItem('statusLogin');
    let u = (sessionStorage.getItem('username') || '').trim().toLowerCase();
    return st === 'admin' && u !== 'sbd';
};

window.pasangTombolAdminAturDataSiswa = function() {
    let existing = document.getElementById('btn-header-admin-atur-data');
    if (!window.apakahAdminBolehAturData()) {
        if (existing) existing.remove();
        return;
    }
    if (existing) return;

    let btnLb = document.getElementById('btn-header-leaderboard');
    if (!btnLb || !btnLb.parentElement) return;

    let btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btn-header-admin-atur-data';
    btn.className = 'header-more-item';
    btn.style.cssText = 'background:#fef9e7; color:#92400e; border:1px solid #f59e0b; font-weight:800;';
    btn.innerHTML = '<span class="hm-ico">⚙️</span><span class="hm-txt">Atur Data Siswa</span>';
    btn.title = 'Khusus Admin: Tambah XP, Coin, Jumlah Soal, Streak Login, & Akses Edit Olimpiade Biologi';
    btn.onclick = function() {
        if (typeof window.tutupMenuHeaderMore === 'function') window.tutupMenuHeaderMore();
        window.bukaModalAdminAturDataSiswa();
    };
    btnLb.insertAdjacentElement('afterend', btn);
};

// Ambil indeks induk OLIMPIADE BIOLOGI & seluruh sub-room di bawahnya dari window.pagesData
window.ambilCabangOlimpiadeBiologi = function() {
    let pages = Array.isArray(window.pagesData) ? window.pagesData : [];
    let rootIdx = pages.findIndex(function(p) {
        if (!p || Number(p.level) !== 0) return false;
        let sl = String(p.slug || '').trim().toLowerCase();
        let tl = String(p.title || '').trim().toLowerCase();
        return sl === 'olimpiade-biologi' || tl === 'olimpiade biologi' || tl.indexOf('olimpiade biologi') !== -1;
    });
    if (rootIdx === -1) {
        rootIdx = pages.findIndex(function(p) {
            if (!p || Number(p.level) !== 0) return false;
            let sl = String(p.slug || '').trim().toLowerCase();
            let tl = String(p.title || '').trim().toLowerCase();
            return sl === 'olimpiade' || tl.indexOf('olimpiade') !== -1;
        });
    }
    if (rootIdx === -1) return { rootIdx: -1, rootPage: null, allPages: [], subPages: [] };

    let rentang = (typeof window.ambilRentangCabangPage === 'function')
        ? window.ambilRentangCabangPage(rootIdx)
        : { start: rootIdx, end: rootIdx + 1, count: 1 };
    let allPages = pages.slice(rentang.start, rentang.end);
    return {
        rootIdx: rootIdx,
        rootPage: pages[rootIdx],
        allPages: allPages,
        subPages: allPages.slice(1)
    };
};

window.adminBacaInfoStreakDariLB = function(lb) {
    if (!lb || typeof lb !== 'object') return { nilai: 0, lokasi: [] };
    let ditemukan = [];

    ['misiHarian', 'misi', 'dailyMission', 'streakData'].forEach(function(objKey) {
        let sub = lb[objKey];
        if (sub && typeof sub === 'object') {
            ['streak', 'loginStreak', 'streakLogin', 'streakCount', 'hari'].forEach(function(fKey) {
                if (typeof sub[fKey] === 'number' || (typeof sub[fKey] === 'string' && /^\d+$/.test(sub[fKey]))) {
                    ditemukan.push({ parent: objKey, key: fKey, val: Number(sub[fKey]) || 0 });
                }
            });
        }
    });

    Object.keys(lb).forEach(function(k) {
        if (/streak/i.test(k) && (typeof lb[k] === 'number' || (typeof lb[k] === 'string' && /^\d+$/.test(lb[k])))) {
            ditemukan.push({ parent: null, key: k, val: Number(lb[k]) || 0 });
        }
    });

    let nilaiMax = ditemukan.reduce(function(mx, item) {
        return Math.max(mx, item.val);
    }, 0);

    return { nilai: nilaiMax, lokasi: ditemukan };
};

window.adminTerapkanStreakKeLB = function(lb, deltaStreak) {
    if (!lb || !deltaStreak) return;
    let info = window.adminBacaInfoStreakDariLB(lb);
    let nilaiBaru = Math.max(0, info.nilai + deltaStreak);

    if (info.lokasi.length > 0) {
        info.lokasi.forEach(function(loc) {
            if (loc.parent && lb[loc.parent]) {
                lb[loc.parent][loc.key] = nilaiBaru;
            } else if (!loc.parent) {
                lb[loc.key] = nilaiBaru;
            }
        });
    } else {
        lb.loginStreak = nilaiBaru;
        if (!lb.misiHarian || typeof lb.misiHarian !== 'object') lb.misiHarian = {};
        lb.misiHarian.streak = nilaiBaru;
    }

    let now = new Date();
    let todayIso = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    if (lb.misiHarian && typeof lb.misiHarian === 'object') {
        if (lb.misiHarian.streak !== undefined) lb.misiHarian.streak = nilaiBaru;
        if (lb.misiHarian.lastLoginDate !== undefined) lb.misiHarian.lastLoginDate = todayIso;
        if (lb.misiHarian.lastDate !== undefined) lb.misiHarian.lastDate = todayIso;
    }
    return nilaiBaru;
};

window.pastikanModalAdminAturDataAda = function() {
    let modal = document.getElementById('modal-admin-atur-data-siswa');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'modal-admin-atur-data-siswa';
    modal.className = 'modal-overlay';
    modal.onclick = function(e) {
        if (e.target === modal) window.tutupModal('modal-admin-atur-data-siswa');
    };

    modal.innerHTML =
        '<div class="modal-box" style="width:640px; max-width:95vw; max-height:90vh; display:flex; flex-direction:column;">' +
            '<div class="modal-header" style="background:linear-gradient(135deg,#0b3954,#145374); color:#ffffff;">' +
                '<div>' +
                    '<h3 style="margin:0; font-size:16px;">⚙️ Pengaturan Data Siswa (Khusus Admin)</h3>' +
                    '<div style="font-size:11px; color:#fde047; margin-top:2px;">XP, Coin, Jumlah Soal, Streak Login, &amp; Akses Editor Ruang OLIMPIADE BIOLOGI</div>' +
                '</div>' +
                '<button type="button" class="close-btn" style="color:#ffffff;" onclick="window.tutupModal(\'modal-admin-atur-data-siswa\')">✕</button>' +
            '</div>' +
            '<div class="modal-body" style="padding:16px; background:#f8fafc; display:flex; flex-direction:column; gap:12px;">' +

                /* 1. Pilih Kelas & Siswa */
                '<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:12px;">' +
                    '<div style="display:grid; grid-template-columns:150px 1fr; gap:8px; margin-bottom:8px;">' +
                        '<div>' +
                            '<label style="font-size:11px; font-weight:800; color:#334155; display:block; margin-bottom:3px;">Filter Kelas</label>' +
                            '<select id="adm-adj-kelas" class="input-box" style="margin:0; padding:7px; font-weight:700;" onchange="window.renderDropdownSiswaAdminAtur()"></select>' +
                        '</div>' +
                        '<div>' +
                            '<label style="font-size:11px; font-weight:800; color:#334155; display:block; margin-bottom:3px;">Cari Nama / Username</label>' +
                            '<input type="text" id="adm-adj-cari" class="input-box" style="margin:0; padding:7px;" placeholder="Ketik sebagian nama..." oninput="window.renderDropdownSiswaAdminAtur()">' +
                        '</div>' +
                    '</div>' +
                    '<div style="display:flex; gap:8px; align-items:flex-end;">' +
                        '<div style="flex:1;">' +
                            '<label style="font-size:11px; font-weight:800; color:#334155; display:block; margin-bottom:3px;">Pilih Akun Siswa</label>' +
                            '<select id="adm-adj-siswa" class="input-box" style="margin:0; padding:8px; font-weight:800; color:#0b3954;" onchange="window.muatDetailSiswaAdminAtur(true)"></select>' +
                        '</div>' +
                        '<button type="button" class="btn-action" style="background:#0284c7; width:auto; padding:9px 12px; font-size:11.5px; white-space:nowrap;" onclick="window.muatDetailSiswaAdminAtur(true)">🔄 Cek Server</button>' +
                    '</div>' +
                '</div>' +

                /* 2. Kondisi Data Live dari Firebase */
                '<div id="adm-adj-preview-live" style="background:#eef6fb; border:1.5px solid #7dd3fc; border-radius:10px; padding:11px 12px; font-size:12px; color:#0b3954;">' +
                    'Pilih siswa di atas untuk melihat data terkini dari server.' +
                '</div>' +

                /* 3. Form Tambah Terpisah */
                '<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:10px;">' +
                    '<div style="font-size:11.5px; font-weight:800; color:#0b3954; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">➕ Nominal Tambahan (Kosongkan jika hanya ingin mengatur akses room)</div>' +

                    '<div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px;">' +
                        '<div>' +
                            '<label style="font-size:11px; font-weight:800; color:#0284c7; display:block; margin-bottom:3px;">⭐ Tambah XP Saja</label>' +
                            '<input type="number" id="adm-adj-xp" class="input-box" style="margin:0; padding:7px; font-weight:800;" placeholder="0">' +
                        '</div>' +
                        '<div>' +
                            '<label style="font-size:11px; font-weight:800; color:#d97706; display:block; margin-bottom:3px;">🪙 Tambah Coin Saja</label>' +
                            '<input type="number" id="adm-adj-coin" class="input-box" style="margin:0; padding:7px; font-weight:800;" placeholder="0">' +
                        '</div>' +
                        '<div>' +
                            '<label style="font-size:11px; font-weight:800; color:#ea580c; display:block; margin-bottom:3px;">🔥 Tambah Streak (Hari)</label>' +
                            '<input type="number" id="adm-adj-streak" class="input-box" style="margin:0; padding:7px; font-weight:800;" placeholder="0">' +
                        '</div>' +
                    '</div>' +

                    '<div style="font-size:11px; font-weight:800; color:#334155; margin-top:2px;">📊 Tambah Jumlah Soal yang Sudah Dikerjakan (Terpisah):</div>' +
                    '<div style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px;">' +
                        '<div>' +
                            '<label style="font-size:11px; font-weight:800; color:#2980b9; display:block; margin-bottom:3px;">PG Saja</label>' +
                            '<input type="number" id="adm-adj-pg" class="input-box" style="margin:0; padding:7px; font-weight:800; text-align:center;" placeholder="0">' +
                        '</div>' +
                        '<div>' +
                            '<label style="font-size:11px; font-weight:800; color:#8e44ad; display:block; margin-bottom:3px;">PGK Saja</label>' +
                            '<input type="number" id="adm-adj-pgk" class="input-box" style="margin:0; padding:7px; font-weight:800; text-align:center;" placeholder="0">' +
                        '</div>' +
                        '<div>' +
                            '<label style="font-size:11px; font-weight:800; color:#d35400; display:block; margin-bottom:3px;">IS Saja</label>' +
                            '<input type="number" id="adm-adj-is" class="input-box" style="margin:0; padding:7px; font-weight:800; text-align:center;" placeholder="0">' +
                        '</div>' +
                        '<div>' +
                            '<label style="font-size:11px; font-weight:800; color:#16a085; display:block; margin-bottom:3px;">Essay Saja</label>' +
                            '<input type="number" id="adm-adj-essay" class="input-box" style="margin:0; padding:7px; font-weight:800; text-align:center;" placeholder="0">' +
                        '</div>' +
                    '</div>' +

                    '<label style="display:flex; align-items:center; gap:7px; font-size:11.5px; color:#475569; background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:7px 10px; cursor:pointer;">' +
                        '<input type="checkbox" id="adm-adj-sync-sas" style="width:15px; height:15px; accent-color:#d97706;">' +
                        '<span>Ikut tambahkan angka <b>PG &amp; IS</b> di atas ke progres <b>Event Ujian SAS</b> siswa ini</span>' +
                    '</label>' +

                    /* 4. Akses Khusus Toolbar Edit Ruang OLIMPIADE BIOLOGI */
                    '<div style="background:#f0fdf4; border:1.5px solid #22c55e; border-radius:10px; padding:10px 12px; display:flex; flex-direction:column; gap:8px;">' +
                        '<div style="font-size:12px; font-weight:900; color:#15803d;">🧬 Akses Room Khusus: OLIMPIADE BIOLOGI (Toolbar Font s.d. Draw)</div>' +
                        '<label style="display:flex; align-items:center; gap:8px; font-size:12px; font-weight:700; color:#1e293b; cursor:pointer;">' +
                            '<input type="checkbox" id="adm-adj-oli-enable" style="width:16px; height:16px; accent-color:#16a34a;" onchange="window.togglePanelAksesOliAdmin()">' +
                            '<span>Berikan Toolbar Edit (Font sampai Draw) untuk akun ini di ruang <b>OLIMPIADE BIOLOGI</b></span>' +
                        '</label>' +
                        '<div id="adm-adj-oli-scope-wrap" style="display:none; flex-direction:column; gap:7px; padding-top:4px; border-top:1px dashed #86efac;">' +
                            '<label style="font-size:11px; font-weight:800; color:#166534;">Cakupan Room yang Bisa Diedit:</label>' +
                            '<div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">' +
                                '<select id="adm-adj-oli-room" class="input-box" style="margin:0; flex:1; min-width:210px; padding:7px; font-size:12px; font-weight:700;"></select>' +
                                '<button type="button" class="btn-action" style="background:#0f766e; width:auto; padding:7px 11px; font-size:11px; white-space:nowrap;" onclick="window.adminBuatSubRoomOlimpiadeUntukSiswa()">➕ Buat Sub-Room Khusus</button>' +
                            '</div>' +
                            '<div style="font-size:10.5px; color:#475569; line-height:1.4;">Akun ini hanya mendapat toolbar edit saat membuka room tersebut (menu Admin &amp; room Hidden tetap terkunci).</div>' +
                        '</div>' +
                    '</div>' +

                    '<div id="adm-adj-status-msg" style="display:none; font-size:12px; font-weight:700; padding:8px 10px; border-radius:8px;"></div>' +

                    '<button type="button" id="btn-simpan-adm-adj" class="btn-action" style="background:#16a34a; font-size:13.5px; padding:11px; font-weight:800;" onclick="window.terapkanAdminAturDataSiswa()">💾 Terapkan &amp; Sinkronkan ke Server</button>' +
                '</div>' +

            '</div>' +
        '</div>';

    document.body.appendChild(modal);
    return modal;
};

window.togglePanelAksesOliAdmin = function() {
    let chk = document.getElementById('adm-adj-oli-enable');
    let wrap = document.getElementById('adm-adj-oli-scope-wrap');
    if (wrap) wrap.style.display = (chk && chk.checked) ? 'flex' : 'none';
};

window.isiDropdownRoomOlimpiadeAdmin = function(selectedSlug) {
    let sel = document.getElementById('adm-adj-oli-room');
    if (!sel) return;
    let cabang = window.ambilCabangOlimpiadeBiologi();
    let rootTitle = cabang.rootPage ? cabang.rootPage.title : 'OLIMPIADE BIOLOGI';

    let html = '<option value="ALL">📚 Seluruh Ruang ' + rootTitle + ' (Induk + Semua Sub-Room)</option>';
    if (cabang.rootPage) {
        html += '<option value="' + cabang.rootPage.slug.replace(/"/g, '&quot;') + '">📄 Hanya Halaman Utama: ' + cabang.rootPage.title + '</option>';
    }
    cabang.subPages.forEach(function(p) {
        let indent = '— '.repeat(Math.max(1, Number(p.level) || 1));
        html += '<option value="' + p.slug.replace(/"/g, '&quot;') + '">' + indent + p.title + '</option>';
    });
    sel.innerHTML = html;

    if (selectedSlug && Array.from(sel.options).some(function(o) { return o.value === selectedSlug; })) {
        sel.value = selectedSlug;
    } else {
        sel.value = 'ALL';
    }
};

window.adminBuatSubRoomOlimpiadeUntukSiswa = function() {
    if (!window.apakahAdminBolehAturData()) return;
    let cabang = window.ambilCabangOlimpiadeBiologi();
    if (cabang.rootIdx === -1 || !cabang.rootPage) {
        return alert('⚠️ Room utama "OLIMPIADE BIOLOGI" belum ditemukan di daftar Pages.');
    }

    let selSiswa = document.getElementById('adm-adj-siswa');
    let userKey = selSiswa ? selSiswa.value : '';
    let lb = (window.leaderboardSiswaData && window.leaderboardSiswaData[userKey]) || {};
    let defaultNama = lb.namaLengkap ? ('Ruang ' + lb.namaLengkap) : 'Sub-Room Khusus Olimpiade';

    let judulSub = prompt('Masukkan nama Sub-Room khusus di dalam "' + cabang.rootPage.title + '":', defaultNama);
    if (!judulSub || !judulSub.trim()) return;
    judulSub = judulSub.trim();

    let slugSub = (typeof window.buatSlugUnik === 'function')
        ? window.buatSlugUnik(judulSub, -1)
        : judulSub.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    let newSubPage = {
        title: judulSub,
        slug: slugSub,
        level: (Number(cabang.rootPage.level) || 0) + 1,
        hidden: false,
        isLockedHidden: false
    };

    let branch = window.ambilRentangCabangPage(cabang.rootIdx);
    window.pagesData.splice(branch.end, 0, newSubPage);
    if (typeof window.pastikanRoomHiddenTerkunci === 'function') window.pastikanRoomHiddenTerkunci();
    if (typeof window.renderDynamicNavbar === 'function') window.renderDynamicNavbar();
    if (typeof window.simpanPagesKeDB === 'function') window.simpanPagesKeDB();

    let chk = document.getElementById('adm-adj-oli-enable');
    if (chk) chk.checked = true;
    window.togglePanelAksesOliAdmin();
    window.isiDropdownRoomOlimpiadeAdmin(slugSub);

    alert('✅ Sub-Room "' + judulSub + '" berhasil dibuat di bawah ' + cabang.rootPage.title + '!\n\nSekarang klik tombol "💾 Terapkan & Sinkronkan ke Server" untuk mengaktifkan akses edit akun ini.');
};

window.bukaModalAdminAturDataSiswa = function() {
    if (!window.apakahAdminBolehAturData()) {
        return alert('🔒 Fitur ini khusus untuk Admin/Guru.');
    }
    window.pastikanModalAdminAturDataAda();
    window.bukaModal('modal-admin-atur-data-siswa');

    let statusEl = document.getElementById('adm-adj-status-msg');
    if (statusEl) statusEl.style.display = 'none';

    let selKls = document.getElementById('adm-adj-kelas');
    let klsSet = new Set();
    Object.keys(window.adminData || {}).forEach(function(k) { if (k) klsSet.add(k); });
    Object.values(window.leaderboardSiswaData || {}).forEach(function(item) { if (item && item.kelas) klsSet.add(item.kelas); });
    Object.values(window.akunSiswaData || {}).forEach(function(item) { if (item && item.kelas) klsSet.add(item.kelas); });

    if (selKls) {
        let htmlKls = '<option value="Semua">Semua Kelas</option>';
        Array.from(klsSet).sort().forEach(function(k) {
            htmlKls += '<option value="' + k.replace(/"/g, '&quot;') + '">' + k + '</option>';
        });
        selKls.innerHTML = htmlKls;
    }

    window.isiDropdownRoomOlimpiadeAdmin('ALL');

    if (typeof window.muatLeaderboardPenuhSekali === 'function') {
        window.muatLeaderboardPenuhSekali(function() {
            window.renderDropdownSiswaAdminAtur();
        }, true);
    } else {
        window.renderDropdownSiswaAdminAtur();
    }
};

window.renderDropdownSiswaAdminAtur = function() {
    let selSiswa = document.getElementById('adm-adj-siswa');
    if (!selSiswa) return;

    let filterKls = (document.getElementById('adm-adj-kelas') || {}).value || 'Semua';
    let cari = String((document.getElementById('adm-adj-cari') || {}).value || '').trim().toLowerCase();
    let prevVal = selSiswa.value;

    let mapSiswa = {};
    let daftarGuru = window.daftarAkunGuru || {};

    function gabungEntri(rawKey, obj) {
        if (!rawKey || !obj || typeof obj !== 'object') return;
        let cleanKey = (typeof window.sanitasiKeyRekapFirebase === 'function')
            ? window.sanitasiKeyRekapFirebase(rawKey).toLowerCase()
            : String(rawKey).trim().toLowerCase();
        if (!cleanKey || cleanKey === 'mahardika' || cleanKey === 'sbd' || cleanKey === 'tamu' || cleanKey === 'admin' || daftarGuru[cleanKey]) return;

        if (!mapSiswa[cleanKey]) {
            mapSiswa[cleanKey] = {
                key: cleanKey,
                nama: obj.namaLengkap || rawKey,
                kelas: obj.kelas || 'Umum'
            };
        } else {
            if (obj.namaLengkap && mapSiswa[cleanKey].nama === cleanKey) mapSiswa[cleanKey].nama = obj.namaLengkap;
            if (obj.kelas && mapSiswa[cleanKey].kelas === 'Umum') mapSiswa[cleanKey].kelas = obj.kelas;
        }
    }

    Object.keys(window.leaderboardSiswaData || {}).forEach(function(k) { gabungEntri(k, window.leaderboardSiswaData[k]); });
    Object.keys(window.akunSiswaData || {}).forEach(function(k) { gabungEntri(k, window.akunSiswaData[k]); });

    let list = Object.values(mapSiswa).filter(function(item) {
        if (filterKls !== 'Semua' && item.kelas !== filterKls) return false;
        if (cari) {
            let txt = (item.nama + ' ' + item.key + ' ' + item.kelas).toLowerCase();
            if (txt.indexOf(cari) === -1) return false;
        }
        return true;
    }).sort(function(a, b) {
        if (a.kelas !== b.kelas) return a.kelas.localeCompare(b.kelas);
        return a.nama.localeCompare(b.nama);
    });

    if (list.length === 0) {
        selSiswa.innerHTML = '<option value="">-- Tidak ada siswa cocok --</option>';
        let prev = document.getElementById('adm-adj-preview-live');
        if (prev) prev.innerHTML = 'Tidak ada siswa yang sesuai dengan filter.';
        return;
    }

    selSiswa.innerHTML = list.map(function(s) {
        let lbItem = window.leaderboardSiswaData && window.leaderboardSiswaData[s.key];
        let markOli = (lbItem && lbItem.aksesEditOlimpiade && lbItem.aksesEditOlimpiade.aktif) ? ' 🧬' : '';
        return '<option value="' + s.key.replace(/"/g, '&quot;') + '">[' + s.kelas + '] ' + s.nama + ' (' + s.key + ')' + markOli + '</option>';
    }).join('');

    if (prevVal && list.some(function(s) { return s.key === prevVal; })) {
        selSiswa.value = prevVal;
    }
    window.muatDetailSiswaAdminAtur(false);
};

window.sinkronFormAksesOliDariLB = function(lb) {
    let akses = (lb && lb.aksesEditOlimpiade && typeof lb.aksesEditOlimpiade === 'object') ? lb.aksesEditOlimpiade : null;
    let aktif = Boolean(akses && akses.aktif);
    let targetVal = (aktif && akses.scope === 'specific' && akses.targetSlug) ? akses.targetSlug : 'ALL';

    let chk = document.getElementById('adm-adj-oli-enable');
    if (chk) chk.checked = aktif;
    window.isiDropdownRoomOlimpiadeAdmin(targetVal);
    window.togglePanelAksesOliAdmin();
};

window.renderPreviewDetailSiswaAdminAtur = function(userKey, lb) {
    let box = document.getElementById('adm-adj-preview-live');
    if (!box) return;
    if (!userKey) {
        box.innerHTML = 'Pilih siswa terlebih dahulu.';
        return;
    }

    let obj = lb || {};
    let xpVal = Math.max(Number(obj.xpTotal) || 0, Number(obj.xp) || 0);
    let coinVal = (obj.coin !== undefined) ? (Number(obj.coin) || 0) : ((obj.xpTersedia !== undefined) ? (Number(obj.xpTersedia) || 0) : xpVal);
    let st = obj.statSoal || {};
    let streakInfo = window.adminBacaInfoStreakDariLB(obj);
    let sas = obj.eventSas2026 || { pg: 0, is: 0 };
    let aksesOli = (obj.aksesEditOlimpiade && obj.aksesEditOlimpiade.aktif) ? obj.aksesEditOlimpiade : null;
    let labelOli = aksesOli
        ? ('<span style="color:#15803d; font-weight:800;">✅ Aktif (' + (aksesOli.scope === 'specific' ? ('Khusus: ' + (aksesOli.targetTitle || aksesOli.targetSlug)) : 'Seluruh OLIMPIADE BIOLOGI') + ')</span>')
        : '<span style="color:#64748b;">Tidak Aktif</span>';

    window.sinkronFormAksesOliDariLB(obj);

    box.innerHTML =
        '<div style="font-weight:900; font-size:13px; margin-bottom:6px; color:#0b3954;">👤 ' + (obj.namaLengkap || userKey) + ' <span style="font-weight:600; color:#475569; font-size:11px;">(' + (obj.kelas || 'Umum') + ' • ' + userKey + ')</span></div>' +
        '<div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; margin-bottom:6px; text-align:center;">' +
            '<div style="background:#ffffff; border:1px solid #bae6fd; border-radius:7px; padding:5px;"><div style="font-size:10px; color:#64748b; font-weight:700;">XP Total</div><b style="font-size:14px; color:#0284c7;">' + xpVal.toLocaleString('id-ID') + '</b></div>' +
            '<div style="background:#ffffff; border:1px solid #fde68a; border-radius:7px; padding:5px;"><div style="font-size:10px; color:#64748b; font-weight:700;">Coin</div><b style="font-size:14px; color:#d97706;">' + coinVal.toLocaleString('id-ID') + '</b></div>' +
            '<div style="background:#ffffff; border:1px solid #fed7aa; border-radius:7px; padding:5px;"><div style="font-size:10px; color:#64748b; font-weight:700;">Streak Login</div><b style="font-size:14px; color:#ea580c;">🔥 ' + streakInfo.nilai + ' Hari</b></div>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:6px; text-align:center;">' +
            '<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:4px; font-size:11px;">PG: <b>' + (Number(st.PG) || 0) + '</b></div>' +
            '<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:4px; font-size:11px;">PGK: <b>' + (Number(st.PGK) || 0) + '</b></div>' +
            '<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:4px; font-size:11px;">IS: <b>' + (Number(st.IS) || 0) + '</b></div>' +
            '<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:4px; font-size:11px;">Essay: <b>' + (Number(st.Essay) || 0) + '</b></div>' +
        '</div>' +
        '<div style="margin-top:6px; font-size:10.5px; color:#475569;">🎯 Progres Event SAS: <b>' + (Number(sas.pg) || 0) + ' PG</b> • <b>' + (Number(sas.is) || 0) + ' IS</b> &nbsp;|&nbsp; 🧬 Editor Olimpiade: ' + labelOli + '</div>';
};

window.muatDetailSiswaAdminAtur = function(forceServer) {
    let sel = document.getElementById('adm-adj-siswa');
    let userKey = sel ? sel.value : '';
    if (!userKey) return;

    let lokal = (window.leaderboardSiswaData && window.leaderboardSiswaData[userKey]) || null;
    window.renderPreviewDetailSiswaAdminAtur(userKey, lokal);

    if (forceServer && typeof window.bacaDataRestFirebase === 'function') {
        let guru = (window.guruAktif || sessionStorage.getItem('guruTarget') || 'mahardika').trim().toLowerCase();
        let box = document.getElementById('adm-adj-preview-live');
        if (box) box.style.opacity = '0.7';
        window.bacaDataRestFirebase('data_guru/' + guru + '/leaderboard_siswa/' + userKey, function(srvVal) {
            if (box) box.style.opacity = '1';
            if (srvVal && typeof srvVal === 'object') {
                if (!window.leaderboardSiswaData) window.leaderboardSiswaData = {};
                window.leaderboardSiswaData[userKey] = srvVal;
                window.renderPreviewDetailSiswaAdminAtur(userKey, srvVal);
            }
        }, function() {
            if (box) box.style.opacity = '1';
        }, { forceRefresh: true, ttlMs: 0 });
    }
};

window.cariKeyAsliLeaderboard = function(userKey) {
    let targetLow = String(userKey || '').trim().toLowerCase();
    let lbMap = window.leaderboardSiswaData || {};
    if (lbMap[userKey]) return userKey;
    let exactMatch = Object.keys(lbMap).find(function(k) {
        return k.trim().toLowerCase() === targetLow;
    });
    return exactMatch || targetLow;
};

window.tulisDataAdminTerverifikasi = async function(guru, relPath, payload) {
    let fullPath = 'data_guru/' + guru + '/' + relPath;

    // Jalur 1 (Utama): kirimNilaiUjianAmanKeDB (jalur terautentikasi Firebase resmi)
    if (typeof window.kirimNilaiUjianAmanKeDB === 'function') {
        try {
            let res1 = await new Promise(function(resolve, reject) {
                let selesai = false;
                let t = setTimeout(function() {
                    if (!selesai) { selesai = true; reject(new Error('Timeout simpan Firebase')); }
                }, 8000);
                window.kirimNilaiUjianAmanKeDB(relPath, payload, function(res) {
                    if (selesai) return;
                    selesai = true;
                    clearTimeout(t);
                    if (res && typeof res === 'object' && res.error) reject(new Error(res.error));
                    else resolve(res || true);
                }, function(err) {
                    if (selesai) return;
                    selesai = true;
                    clearTimeout(t);
                    reject(err instanceof Error ? err : new Error(String(err || 'Gagal kirimNilaiUjianAmanKeDB')));
                });
            });
            return res1;
        } catch (err1) {
            console.warn('Fallback ke tulisDataRestFirebase:', err1.message);
        }
    }

    // Jalur 2 (Cadangan): tulisDataRestFirebase
    if (typeof window.tulisDataRestFirebase === 'function') {
        return await new Promise(function(resolve, reject) {
            let selesai = false;
            let t = setTimeout(function() {
                if (!selesai) { selesai = true; reject(new Error('Timeout REST Firebase')); }
            }, 8000);
            let ret = window.tulisDataRestFirebase(fullPath, payload, 'PUT', function(res) {
                if (selesai) return;
                selesai = true;
                clearTimeout(t);
                if (res && typeof res === 'object' && res.error) reject(new Error(res.error));
                else resolve(res || true);
            }, function(err) {
                if (selesai) return;
                selesai = true;
                clearTimeout(t);
                reject(err instanceof Error ? err : new Error(String(err || 'Gagal REST PUT')));
            });
            if (ret && typeof ret.then === 'function') {
                ret.then(function(res) {
                    if (selesai) return;
                    selesai = true;
                    clearTimeout(t);
                    if (res && typeof res === 'object' && res.error) reject(new Error(res.error));
                    else resolve(res || true);
                }).catch(function(err) {
                    if (selesai) return;
                    selesai = true;
                    clearTimeout(t);
                    reject(err);
                });
            }
        });
    }

    throw new Error('Fungsi tulis Firebase belum siap.');
};

window.terapkanAdminAturDataSiswa = async function() {
    if (!window.apakahAdminBolehAturData()) return alert('🔒 Akses ditolak.');

    let sel = document.getElementById('adm-adj-siswa');
    let userKeyRaw = sel ? sel.value : '';
    if (!userKeyRaw) return alert('⚠️ Pilih akun siswa terlebih dahulu.');

    let targetKey = window.cariKeyAsliLeaderboard(userKeyRaw);
    let cleanKey = (typeof window.sanitasiKeyRekapFirebase === 'function')
        ? window.sanitasiKeyRekapFirebase(targetKey).toLowerCase()
        : targetKey.trim().toLowerCase();

    let addXP = parseInt((document.getElementById('adm-adj-xp') || {}).value || '0', 10) || 0;
    let addCoin = parseInt((document.getElementById('adm-adj-coin') || {}).value || '0', 10) || 0;
    let addStreak = parseInt((document.getElementById('adm-adj-streak') || {}).value || '0', 10) || 0;
    let addPG = parseInt((document.getElementById('adm-adj-pg') || {}).value || '0', 10) || 0;
    let addPGK = parseInt((document.getElementById('adm-adj-pgk') || {}).value || '0', 10) || 0;
    let addIS = parseInt((document.getElementById('adm-adj-is') || {}).value || '0', 10) || 0;
    let addEssay = parseInt((document.getElementById('adm-adj-essay') || {}).value || '0', 10) || 0;
    let ikutSas = Boolean((document.getElementById('adm-adj-sync-sas') || {}).checked);

    let oliEnable = Boolean((document.getElementById('adm-adj-oli-enable') || {}).checked);
    let selOliRoom = document.getElementById('adm-adj-oli-room');
    let oliRoomVal = selOliRoom ? selOliRoom.value : 'ALL';
    let oliRoomTitle = (selOliRoom && selOliRoom.selectedOptions && selOliRoom.selectedOptions[0])
        ? selOliRoom.selectedOptions[0].textContent.replace(/^[📚📄—\s]+/, '').trim()
        : 'OLIMPIADE BIOLOGI';

    let btn = document.getElementById('btn-simpan-adm-adj');
    let statusEl = document.getElementById('adm-adj-status-msg');
    if (btn) { btn.disabled = true; btn.innerText = '⏳ Menarik data server & menyimpan...'; }

    let guru = (window.guruAktif || sessionStorage.getItem('guruTarget') || 'mahardika').trim().toLowerCase();
    let relPath = 'leaderboard_siswa/' + targetKey;
    let fullPath = 'data_guru/' + guru + '/' + relPath;

    let bacaDariServer = function(pathStr) {
        return new Promise(function(resolve) {
            if (typeof window.bacaDataRestFirebase !== 'function') return resolve(null);
            window.bacaDataRestFirebase(pathStr, function(val) {
                resolve(val && typeof val === 'object' ? val : null);
            }, function() {
                resolve(null);
            }, { forceRefresh: true, ttlMs: 0 });
        });
    };

    try {
        // 1. Tarik data terbaru langsung dari server (cek targetKey, lalu cleanKey bila beda)
        let baseObj = await bacaDariServer(fullPath);
        if (!baseObj && cleanKey !== targetKey) {
            let altObj = await bacaDariServer('data_guru/' + guru + '/leaderboard_siswa/' + cleanKey);
            if (altObj) {
                baseObj = altObj;
                targetKey = cleanKey;
                relPath = 'leaderboard_siswa/' + targetKey;
                fullPath = 'data_guru/' + guru + '/' + relPath;
            }
        }

        let akunRef = (window.akunSiswaData && (window.akunSiswaData[targetKey] || window.akunSiswaData[cleanKey])) || {};
        let lokalRef = (window.leaderboardSiswaData && (window.leaderboardSiswaData[targetKey] || window.leaderboardSiswaData[cleanKey])) || {};
        let merged = JSON.parse(JSON.stringify(baseObj || lokalRef || {}));

        let prevOliAktif = Boolean(merged.aksesEditOlimpiade && merged.aksesEditOlimpiade.aktif);
        let prevOliTarget = (merged.aksesEditOlimpiade && merged.aksesEditOlimpiade.scope === 'specific') ? (merged.aksesEditOlimpiade.targetSlug || '') : 'ALL';
        let adaPerubahanOli = (oliEnable !== prevOliAktif) || (oliEnable && oliRoomVal !== prevOliTarget);

        if (!addXP && !addCoin && !addStreak && !addPG && !addPGK && !addIS && !addEssay && !adaPerubahanOli) {
            if (btn) { btn.disabled = false; btn.innerText = '💾 Terapkan & Sinkronkan ke Server'; }
            return alert('⚠️ Isi minimal satu angka tambahan atau ubah pengaturan akses room OLIMPIADE BIOLOGI.');
        }

        if (!merged.namaLengkap) merged.namaLengkap = akunRef.namaLengkap || targetKey;
        if (!merged.kelas) merged.kelas = akunRef.kelas || 'Umum';

        // 2. XP & Coin terpisah
        let curXP = Math.max(Number(merged.xpTotal) || 0, Number(merged.xp) || 0);
        let curCoin = (merged.coin !== undefined) ? (Number(merged.coin) || 0) : ((merged.xpTersedia !== undefined) ? (Number(merged.xpTersedia) || 0) : curXP);
        if (addXP !== 0) curXP = Math.max(0, curXP + addXP);
        if (addCoin !== 0) curCoin = Math.max(0, curCoin + addCoin);
        merged.xpTotal = curXP;
        merged.xp = curXP;
        merged.coin = curCoin;
        merged.xpTersedia = curCoin;
        merged.coinInitialized = true;

        // 3. Stat Soal terpisah
        if (!merged.statSoal || typeof merged.statSoal !== 'object') {
            merged.statSoal = { PG: 0, PGK: 0, IS: 0, Essay: 0 };
        }
        merged.statSoal.PG = Math.max(0, (Number(merged.statSoal.PG) || 0) + addPG);
        merged.statSoal.PGK = Math.max(0, (Number(merged.statSoal.PGK) || 0) + addPGK);
        merged.statSoal.IS = Math.max(0, (Number(merged.statSoal.IS) || 0) + addIS);
        merged.statSoal.Essay = Math.max(0, (Number(merged.statSoal.Essay) || 0) + addEssay);

        // 4. Opsional: Event SAS
        if (ikutSas && (addPG !== 0 || addIS !== 0)) {
            if (typeof window.pastikanDataEventSAS === 'function') window.pastikanDataEventSAS(merged);
            else if (!merged.eventSas2026) merged.eventSas2026 = { pg: 0, is: 0, claimedTiers: {}, updatedAt: 0 };
            merged.eventSas2026.pg = Math.max(0, (Number(merged.eventSas2026.pg) || 0) + addPG);
            merged.eventSas2026.is = Math.max(0, (Number(merged.eventSas2026.is) || 0) + addIS);
            merged.eventSas2026.updatedAt = Date.now();
        }

        // 5. Streak Login (sinkronkan ke semua field streak agar langsung tampil di Misi siswa)
        if (addStreak !== 0) {
            let streakBaru = window.adminTerapkanStreakKeLB(merged, addStreak);
            merged.streak = streakBaru;
            merged.loginStreak = streakBaru;
            if (!merged.misiHarian || typeof merged.misiHarian !== 'object') merged.misiHarian = {};
            merged.misiHarian.streak = streakBaru;
        }

        // 6. Akses Khusus Toolbar Edit Ruang OLIMPIADE BIOLOGI
        merged.aksesEditOlimpiade = oliEnable
            ? {
                aktif: true,
                scope: oliRoomVal === 'ALL' ? 'all' : 'specific',
                targetSlug: oliRoomVal === 'ALL' ? '' : oliRoomVal,
                targetTitle: oliRoomVal === 'ALL' ? 'OLIMPIADE BIOLOGI' : oliRoomTitle,
                updatedAt: Date.now()
            }
            : { aktif: false, scope: 'all', targetSlug: '', targetTitle: '', updatedAt: Date.now() };

        // Penanda waktu edit Admin agar sesi siswa yang lama tidak bisa menimpa balik
        let adjTs = Date.now();
        merged._adminAdjTs = adjTs;

        // 7. Tulis ke Firebase & VERIFIKASI BACA ULANG dari server
        await window.tulisDataAdminTerverifikasi(guru, relPath, merged);

        if (typeof window.bersihkanCacheLeaderboardLokal === 'function') {
            window.bersihkanCacheLeaderboardLokal();
        }

        let srvVerify = await bacaDariServer(fullPath);
        if (!srvVerify || Number(srvVerify._adminAdjTs) !== adjTs) {
            // Coba jalur cadangan simpanLeaderboardSiswaKeDB jika jalur utama belum masuk
            if (typeof window.simpanLeaderboardSiswaKeDB === 'function') {
                window.simpanLeaderboardSiswaKeDB(targetKey, merged);
                await new Promise(function(r) { setTimeout(r, 900); });
                srvVerify = await bacaDariServer(fullPath);
            }
        }

        if (!srvVerify || Number(srvVerify._adminAdjTs) !== adjTs) {
            throw new Error('Firebase menolak penulisan data (kemungkinan sesi login Admin kedaluwarsa — coba Logout lalu Login Admin kembali).');
        }

        // 8. Perbarui memori lokal Admin & kirim sinyal refresh paksa ke perangkat siswa
        if (!window.leaderboardSiswaData) window.leaderboardSiswaData = {};
        window.leaderboardSiswaData[targetKey] = srvVerify;
        window.leaderboardSiswaData[cleanKey] = srvVerify;
        if (userKeyRaw) window.leaderboardSiswaData[userKeyRaw] = srvVerify;

        try {
            await window.tulisDataAdminTerverifikasi(guru, 'sistem_refresh_lb', {
                ts: Date.now(),
                by: sessionStorage.getItem('username') || 'admin',
                target: targetKey
            });
        } catch (eSig) {}

        ['adm-adj-xp', 'adm-adj-coin', 'adm-adj-streak', 'adm-adj-pg', 'adm-adj-pgk', 'adm-adj-is', 'adm-adj-essay'].forEach(function(id) {
            let el = document.getElementById(id);
            if (el) el.value = '';
        });

        window.renderPreviewDetailSiswaAdminAtur(targetKey, srvVerify);
        if (typeof window.renderTabelLeaderboard === 'function') window.renderTabelLeaderboard();

        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.background = '#dcfce7';
            statusEl.style.color = '#15803d';
            statusEl.style.border = '1px solid #22c55e';
            statusEl.innerText = '✅ Terverifikasi di server Firebase! Data ' + (srvVerify.namaLengkap || targetKey) + ' sudah berubah & tersinkron ke perangkat siswa.';
        }
    } catch (err) {
        console.error('Admin adjust error:', err);
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.background = '#fee2e2';
            statusEl.style.color = '#b91c1c';
            statusEl.style.border = '1px solid #ef4444';
            statusEl.innerText = '❌ BELUM TERSIMPAN KE SERVER: ' + (err && err.message ? err.message : 'Periksa koneksi / login ulang Admin.');
        }
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = '💾 Terapkan & Sinkronkan ke Server'; }
    }
};

/* =========================================================================
   MESIN TOOLBAR EDIT KHUSUS SISWA DI RUANG OLIMPIADE BIOLOGI
   - Mengaktifkan Toolbar Edit lengkap (Font s.d. Draw) hanya di room yang diizinkan
   - Menyembunyikan seluruh menu Admin, Preview, Pengaturan Tema, & Room Hidden
   - Auto-save perubahan materi, kuis, tabel, media, & coretan Draw ke Firebase
   ========================================================================= */
window.pasangCssEditorKhususSiswa = function() {
    if (document.getElementById('css-student-special-editor')) return;
    let st = document.createElement('style');
    st.id = 'css-student-special-editor';
    st.textContent =
        'body.student-room-editor-mode #admin-menu-bar,' +
        'body.student-room-editor-mode #btn-preview,' +
        'body.student-room-editor-mode .header-settings-btn,' +
        'body.student-room-editor-mode #page-cakupan-panel-wrap,' +
        'body.student-room-editor-mode .a4-sheet-admin-strip,' +
        'body.student-room-editor-mode .hidden-nav-item,' +
        'body.student-room-editor-mode .locked-hidden-nav-item { display: none !important; }' +
        'body.student-room-editor-mode .toolbar-wrapper { display: flex !important; }' +
        'body.student-room-editor-mode .block-controls { display: flex !important; }';
    document.head.appendChild(st);
};

window.isStudentSpecialEditorHere = function(slugOpt) {
    if (typeof window.isAdminSession === 'function' && window.isAdminSession()) return false;
    let stat = sessionStorage.getItem('statusLogin');
    let rawU = (sessionStorage.getItem('username') || '').trim();
    let uLow = rawU.toLowerCase();
    if (stat !== 'siswa' || !uLow || uLow === 'sbd' || uLow === 'tamu' || uLow === 'mahardika') return false;

    let cleanU = (typeof window.sanitasiKeyRekapFirebase === 'function')
        ? window.sanitasiKeyRekapFirebase(uLow).toLowerCase()
        : uLow;
    let lb = (window.leaderboardSiswaData && (window.leaderboardSiswaData[rawU] || window.leaderboardSiswaData[cleanU])) || null;
    if (!lb || !lb.aksesEditOlimpiade || !lb.aksesEditOlimpiade.aktif) return false;

    let slugNow = String(slugOpt || window.babAktif || 'home').trim().toLowerCase();
    if (!slugNow || slugNow === 'home') return false;

    let akses = lb.aksesEditOlimpiade;
    let cabang = window.ambilCabangOlimpiadeBiologi();
    let allowedSlugs = cabang.allPages.map(function(p) { return String(p.slug || '').trim().toLowerCase(); });

    if (allowedSlugs.length === 0) {
        if (akses.scope === 'specific' && akses.targetSlug) {
            return slugNow === String(akses.targetSlug).trim().toLowerCase();
        }
        return slugNow === 'olimpiade-biologi' || slugNow === 'olimpiade';
    }

    if (allowedSlugs.indexOf(slugNow) === -1) return false;

    if (akses.scope === 'specific' && akses.targetSlug) {
        let tSlug = String(akses.targetSlug).trim().toLowerCase();
        if (slugNow === tSlug) return true;
        // Izinkan juga sub-room di bawah targetSlug jika ada
        let tIdx = (window.pagesData || []).findIndex(function(p) {
            return p && String(p.slug || '').trim().toLowerCase() === tSlug;
        });
        if (tIdx !== -1 && typeof window.ambilRentangCabangPage === 'function') {
            let subBranch = window.ambilRentangCabangPage(tIdx);
            let subSlugs = (window.pagesData || []).slice(subBranch.start, subBranch.end).map(function(p) {
                return String(p.slug || '').trim().toLowerCase();
            });
            return subSlugs.indexOf(slugNow) !== -1;
        }
        return false;
    }

    return true;
};

window.sinkronkanModeEditorKhususSiswa = function(skipReRender) {
    if (typeof window.isAdminSession === 'function' && window.isAdminSession()) return;
    window.pasangCssEditorKhususSiswa();

    let bolehEdit = window.isStudentSpecialEditorHere();
    let sebelumnyaAktif = document.body.classList.contains('student-room-editor-mode');

    if (bolehEdit) {
        document.body.classList.add('student-room-editor-mode', 'mode-edit-aktif');
        document.documentElement.classList.add('force-edit-mode');
        let titleEl = document.getElementById('web-title');
        if (titleEl) titleEl.removeAttribute('contenteditable');
    } else {
        if (sebelumnyaAktif) {
            if (window.isDrawingMode && typeof window.toggleDrawingMode === 'function') {
                window.toggleDrawingMode();
            }
            if (typeof window.tutupSidebarBlock === 'function') {
                window.tutupSidebarBlock();
            }
        }
        document.body.classList.remove('student-room-editor-mode', 'mode-edit-aktif');
        document.documentElement.classList.remove('force-edit-mode');
    }

    if (!skipReRender && bolehEdit !== sebelumnyaAktif) {
        if (typeof window.renderBlocks === 'function') window.renderBlocks();
        if (typeof window.renderFloatingBoxes === 'function') window.renderFloatingBoxes();
    }
};

window.simpanMateriSiswaKhususKeDB = function(slugOpt) {
    let slug = slugOpt || window.babAktif || 'home';
    if (!window.isStudentSpecialEditorHere(slug)) return false;

    document.querySelectorAll('#blocks-container > .block-wrapper').forEach(function(wrap, i) {
        let b = window.contentBlocksData && window.contentBlocksData[i];
        if (!b || b.type === 'quiz' || b.type === 'pdf_slides' || b.type === 'modul_interaktif') return;
        let cb = wrap.querySelector(':scope > .a4-paper-wrapper > .block-collapsible-area > .content-block, :scope > .dynamic-block-shell > .block-collapsible-area > .content-block');
        if (cb) {
            let clone = cb.cloneNode(true);
            clone.querySelectorAll('img.img-selected').forEach(function(im) { im.classList.remove('img-selected'); });
            b.html = clone.innerHTML;
        }
    });

    document.querySelectorAll('#floating-boxes-container .fb-content[data-fb-index]').forEach(function(el) {
        let fi = parseInt(el.getAttribute('data-fb-index'), 10);
        if (!isNaN(fi) && window.floatingBoxesData && window.floatingBoxesData[fi]) {
            let clone = el.cloneNode(true);
            clone.querySelectorAll('canvas.drawing-layer').forEach(function(c) { c.remove(); });
            window.floatingBoxesData[fi].html = clone.innerHTML;
        }
    });

    let guru = (window.guruAktif || sessionStorage.getItem('guruTarget') || 'mahardika').trim().toLowerCase();
    let payload = {
        blocksObj: window.contentBlocksData || [],
        floatingBoxesObj: window.floatingBoxesData || [],
        updatedAt: Date.now(),
        updatedBy: sessionStorage.getItem('username') || 'siswa_khusus'
    };

    let stBar = document.getElementById('save-status-bar');
    if (stBar) stBar.innerHTML = "<span style='color:#e67e22;'>⏳ Menyimpan (Olimpiade)...</span>";

    if (typeof window.sinkronCacheRoomSetelahEditKuis === 'function') {
        window.sinkronCacheRoomSetelahEditKuis(slug);
    }

    if (typeof window.tulisDataRestFirebase === 'function') {
        window.tulisDataRestFirebase('data_guru/' + guru + '/materi_koleksi/' + slug, payload, 'PUT', function() {
            if (stBar) stBar.innerHTML = "<span style='color:#2ecc71;'>Cloud Sync: Tersimpan ✓</span>";
        }, function() {
            if (stBar) stBar.innerHTML = "<span style='color:#e74c3c;'>⚠️ Gagal simpan ke server</span>";
        });
        return true;
    }
    return false;
};

// Pasang hook simpanKeDB, perbaruiUIHeaderProfilSiswa, & auto-save ketikan khusus siswa berizin
(function inisialisasiHookEditorKhususSiswa() {
    function bungkusSimpanKeDB() {
        if (typeof window.simpanKeDB === 'function' && !window.simpanKeDB._wrappedOli) {
            let origSimpan = window.simpanKeDB;
            window.simpanKeDB = function(slugArg) {
                if (window.isStudentSpecialEditorHere(slugArg)) {
                    return window.simpanMateriSiswaKhususKeDB(slugArg);
                }
                return origSimpan.apply(this, arguments);
            };
            window.simpanKeDB._wrappedOli = true;
        }
    }

    if (typeof window.perbaruiUIHeaderProfilSiswa === 'function' && !window.perbaruiUIHeaderProfilSiswa._wrappedOli) {
        let origHeader = window.perbaruiUIHeaderProfilSiswa;
        window.perbaruiUIHeaderProfilSiswa = function() {
            let r = origHeader.apply(this, arguments);
            window.sinkronkanModeEditorKhususSiswa(false);
            return r;
        };
        window.perbaruiUIHeaderProfilSiswa._wrappedOli = true;
    }

    document.addEventListener('DOMContentLoaded', function() {
        window.pasangTombolAdminAturDataSiswa();
        setTimeout(window.pasangTombolAdminAturDataSiswa, 600);
        window.pasangCssEditorKhususSiswa();
        bungkusSimpanKeDB();
        setTimeout(bungkusSimpanKeDB, 800);
        setTimeout(bungkusSimpanKeDB, 2000);
        window.sinkronkanModeEditorKhususSiswa(false);

        let editorWrap = document.getElementById('main-editor-wrapper');
        if (editorWrap) {
            editorWrap.addEventListener('input', function(e) {
                if (!window.isStudentSpecialEditorHere()) return;
                if (!e.target || !e.target.closest || !e.target.closest('.content-block, .fb-content')) return;
                let stBar = document.getElementById('save-status-bar');
                if (stBar) stBar.innerHTML = "<span style='color:#e67e22;'>✍️ Mengetik...</span>";
                clearTimeout(window.typingTimer);
                let roomTarget = window.babAktif;
                window.typingTimer = setTimeout(function() {
                    window.typingTimer = null;
                    window.simpanMateriSiswaKhususKeDB(roomTarget);
                }, 650);
            });
        }
    });

    window.addEventListener('load', function() {
        bungkusSimpanKeDB();
        setTimeout(function() { window.sinkronkanModeEditorKhususSiswa(false); }, 500);
    });
})();
let cb = w.querySelector('.content-block');
        if (cb) cb.setAttribute('data-index', idx);
        let btns = w.querySelectorAll('.block-controls button');

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
            "Aplikasi Mardikawan Room Edu akan langsung muncul di layar utama Anda!"
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
/* =========================================================================
   MESIN LATEX MULTI-BARIS & UNDO NATIVE (CMD+Z AMAN, ANTI-ERROR %, PER LURUS)
   ========================================================================= */
window.konversiPecahanKeFrac = function(input) {
    let str = String(input || '');

    function ambilKiri(s, idx) {
        while (idx >= 0 && s[idx] === ' ') idx--;
        if (idx < 0) return null;

        let end = idx;
        if (s[idx] === ')') {
            let depth = 0;
            let i = idx;
            while (i >= 0) {
                if (s[i] === ')') depth++;
                else if (s[i] === '(') {
                    depth--;
                    if (depth === 0) break;
                }
                i--;
            }
            if (depth === 0 && i >= 0) {
                return { start: i, content: s.slice(i + 1, end).trim() };
            }
            return null;
        }

        let i = idx;
        while (i >= 0) {
            let ch = s[i];
            if (ch === '}') {
                let d = 0;
                while (i >= 0) {
                    if (s[i] === '}') d++;
                    else if (s[i] === '{') {
                        d--;
                        if (d === 0) break;
                    }
                    i--;
                }
                i--;
                continue;
            }
            if (ch === ',' && i > 0 && /[0-9]/.test(s[i - 1]) && i < end && /[0-9]/.test(s[i + 1])) {
                i--;
                continue;
            }
            if (/[a-zA-Z0-9._^%\\]/.test(ch)) {
                i--;
                continue;
            }
            break;
        }
        let start = i + 1;
        if (start > end) return null;
        return { start: start, content: s.slice(start, end + 1).trim() };
    }

    function ambilKanan(s, idx) {
        let len = s.length;
        while (idx < len && s[idx] === ' ') idx++;
        if (idx >= len) return null;

        if (s[idx] === '(') {
            let depth = 0;
            let i = idx;
            while (i < len) {
                if (s[i] === '(') depth++;
                else if (s[i] === ')') {
                    depth--;
                    if (depth === 0) break;
                }
                i++;
            }
            if (depth === 0 && i < len) {
                return { end: i + 1, content: s.slice(idx + 1, i).trim() };
            }
            return null;
        }

        let i = idx;
        while (i < len) {
            let ch = s[i];
            if (ch === '{') {
                let d = 0;
                while (i < len) {
                    if (s[i] === '{') d++;
                    else if (s[i] === '}') {
                        d--;
                        if (d === 0) break;
                    }
                    i++;
                }
                i++;
                continue;
            }
            if (ch === ',' && i > idx && /[0-9]/.test(s[i - 1]) && i + 1 < len && /[0-9]/.test(s[i + 1])) {
                i++;
                continue;
            }
            if (ch === '\\') {
                if (i + 1 < len && s[i + 1] === '%') {
                    i += 2;
                    continue;
                }
                if (i > idx) break;
                i++;
                while (i < len && /[a-zA-Z]/.test(s[i])) i++;
                continue;
            }
            if (/[a-zA-Z0-9._^%]/.test(ch)) {
                i++;
                continue;
            }
            break;
        }
        if (i <= idx) return null;
        return { end: i, content: s.slice(idx, i).trim() };
    }

    let guard = 0;
    let searchFrom = 0;
    while (guard < 30) {
        let slashIdx = str.indexOf('/', searchFrom);
        if (slashIdx === -1) break;

        if ((slashIdx > 0 && str[slashIdx - 1] === '\\') || str[slashIdx + 1] === '/' || (slashIdx > 0 && str[slashIdx - 1] === '/')) {
            searchFrom = slashIdx + 1;
            continue;
        }

        let kiri = ambilKiri(str, slashIdx - 1);
        let kanan = ambilKanan(str, slashIdx + 1);

        if (!kiri || !kanan || !kiri.content || !kanan.content) {
            searchFrom = slashIdx + 1;
            continue;
        }

        let fracStr = '\\frac{' + kiri.content + '}{' + kanan.content + '}';
        str = str.slice(0, kiri.start) + fracStr + str.slice(kanan.end);
        searchFrom = kiri.start + fracStr.length;
        guard++;
    }

    return str;
};

window.siapkanTeksLatexRapi = function(rawText) {
    let dlr = String.fromCharCode(36);
    let teks = String(rawText || '')
        .replace(/\r\n/g, ' ')
        .replace(/[\r\n]+/g, ' ')
        .trim();

    if (teks.indexOf(dlr + dlr) === 0 && teks.lastIndexOf(dlr + dlr) === teks.length - 2 && teks.length > 4) {
        teks = teks.slice(2, -2).trim();
    } else if (teks.indexOf(dlr) === 0 && teks.lastIndexOf(dlr) === teks.length - 1 && teks.length > 2) {
        teks = teks.slice(1, -1).trim();
    } else if (teks.indexOf('\\[') === 0 && teks.lastIndexOf('\\]') === teks.length - 2 && teks.length > 4) {
        teks = teks.slice(2, -2).trim();
    } else if (teks.indexOf('\\(') === 0 && teks.lastIndexOf('\\)') === teks.length - 2 && teks.length > 4) {
        teks = teks.slice(2, -2).trim();
    }

    // 1. Amankan tanda % menjadi \% agar tidak dianggap komentar
    while (/(^|[^\\])%/.test(teks)) {
        teks = teks.replace(/(^|[^\\])%/g, function(match, prev) {
            return prev + '\\%';
        });
    }

    // 2. Ubah pembagian "/" menjadi pecahan per lurus (\frac{...}{...})
    teks = window.konversiPecahanKeFrac(teks);

    // 3. Buat tanda kurung di sekitar pecahan otomatis tinggi proporsional
    teks = teks.replace(/\(\s*(\\frac\{[^{}]*\}\{[^{}]*\})\s*\)/g, function(match, frac) {
        return '\\left(' + frac + '\\right)';
    });

    // 4. Rapikan koma desimal Indonesia (misal 0,1 -> 0{,}1) & simbol kali/bagi
    teks = teks.replace(/(\d),(\d)/g, function(match, d1, d2) {
        return d1 + '{,}' + d2;
    });
    teks = teks.replace(/×/g, ' \\times ').replace(/÷/g, ' \\div ');

    // 5. Pakai \displaystyle agar ukuran pecahan per lurus tetap jelas
    if (teks && teks.indexOf('\\displaystyle') === -1 && teks.indexOf('\\frac{') !== -1) {
        teks = '\\displaystyle ' + teks;
    }

    return teks;
};

window.ekstrakBarisDariRange = function(range) {
    let frag = range.cloneContents();
    let out = '';

    function jalanNode(node) {
        if (node.nodeType === 3) {
            out += node.nodeValue || '';
            return;
        }
        if (node.nodeType !== 1) return;

        let tag = node.tagName.toUpperCase();
        if (tag === 'BR') {
            out += '\n';
            return;
        }
        if (node.classList && (node.classList.contains('latex-inline') || node.classList.contains('math-latex-block'))) {
            out += node.getAttribute('data-raw') || node.getAttribute('data-latex-src') || '';
            return;
        }

        let isBlock = /^(DIV|P|LI|H[1-6]|BLOCKQUOTE|TR)$/.test(tag);
        if (isBlock && out.length > 0 && out[out.length - 1] !== '\n') {
            out += '\n';
        }
        for (let i = 0; i < node.childNodes.length; i++) {
            jalanNode(node.childNodes[i]);
        }
        if (isBlock && out.length > 0 && out[out.length - 1] !== '\n') {
            out += '\n';
        }
    }

    for (let i = 0; i < frag.childNodes.length; i++) {
        jalanNode(frag.childNodes[i]);
    }

    let lines = out.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').map(function(l) {
        return l.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    });

    // Buang baris kosong di paling awal atau paling akhir hasil seleksi
    while (lines.length > 0 && lines[0] === '') lines.shift();
    while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();

    return lines;
};

window.cekPosisiBarisLatex = function(range) {
    let commonEl = range.commonAncestorContainer.nodeType === 3
        ? range.commonAncestorContainer.parentElement
        : range.commonAncestorContainer;
    let editableHost = (commonEl && commonEl.closest)
        ? commonEl.closest('.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area')
        : null;
    if (!editableHost) {
        return { adaTeksKiri: true, adaTeksKanan: true, editableHost: null };
    }

    function cariBlokTerdekat(node) {
        let el = node.nodeType === 3 ? node.parentElement : node;
        let blk = (el && el.closest) ? el.closest('p, div, li, h1, h2, h3, h4, h5, h6, blockquote, td, th') : editableHost;
        return (blk && editableHost.contains(blk)) ? blk : editableHost;
    }

    function bersihkanKosong(s) {
        return String(s || '').replace(/&nbsp;/gi, ' ').replace(/[\s\u00A0\u200B-\u200D\uFEFF]/g, '');
    }

    function normalisasiSisiHtml(rawHtml, arah) {
        return String(rawHtml || '')
            .replace(/<mjx-container[\s\S]*?<\/mjx-container>/gi, 'X')
            .replace(/<span[^>]*class=["'][^"']*latex-inline[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, 'X')
            .replace(/<svg[\s\S]*?<\/svg>/gi, 'X')
            .replace(/<img\b[^>]*>/gi, 'X')
            .replace(arah === 'kiri'
                ? /<br\s*\/?>|<\/(?:p|div|li|h[1-6]|blockquote|tr|table)>/gi
                : /<br\s*\/?>|<(?:p|div|li|h[1-6]|blockquote|tr|table)\b[^>]*>/gi, '\n')
            .replace(/<[^>]*>/g, '');
    }

    let startBlock = cariBlokTerdekat(range.startContainer);
    let endBlock = cariBlokTerdekat(range.endContainer);

    // 1. Cek sisi KIRI secara DOM
    let leftRange = document.createRange();
    leftRange.setStart(startBlock, 0);
    leftRange.setEnd(range.startContainer, range.startOffset);
    let tempLeft = document.createElement('div');
    tempLeft.appendChild(leftRange.cloneContents());
    let leftParts = normalisasiSisiHtml(tempLeft.innerHTML, 'kiri').split('\n');
    let adaTeksKiri = bersihkanKosong(leftParts[leftParts.length - 1]).length > 0;

    // 2. Cek sisi KIRI secara posisi visual layar (anti-gagal meskipun ada tag span/latex/bullet)
    if (!adaTeksKiri) {
        if (startBlock.tagName === 'LI') {
            // Di dalam bullet / numbering list: di sebelah kiri ada penanda bullet/nomor
            adaTeksKiri = true;
        } else {
            let rects = range.getClientRects();
            let firstRect = null;
            for (let i = 0; i < rects.length; i++) {
                if (rects[i].width > 0 || rects[i].height > 0) {
                    firstRect = rects[i];
                    break;
                }
            }
            if (firstRect) {
                let sbRect = startBlock.getBoundingClientRect();
                let sbStyle = window.getComputedStyle(startBlock);
                let padL = parseFloat(sbStyle.paddingLeft) || 0;
                let align = (sbStyle.textAlign || 'left').toLowerCase();
                if ((align === 'left' || align === 'start' || align === 'justify') && firstRect.left > (sbRect.left + padL + 8)) {
                    adaTeksKiri = true;
                }
            }
        }
    }

    // 3. Cek sisi KANAN secara DOM
    let rightRange = document.createRange();
    // Jika user drag melewati ujung kanan hingga awal baris berikutnya (endOffset === 0 di blok lain), cek sisi kanan blok awal
    if (endBlock !== startBlock && range.endOffset === 0) {
        rightRange.setStart(range.endContainer, 0);
        rightRange.setEnd(range.endContainer, 0);
    } else {
        rightRange.setStart(range.endContainer, range.endOffset);
        rightRange.setEnd(endBlock, endBlock.childNodes.length);
    }
    let tempRight = document.createElement('div');
    tempRight.appendChild(rightRange.cloneContents());
    let rightParts = normalisasiSisiHtml(tempRight.innerHTML, 'kanan').split('\n');
    let adaTeksKanan = bersihkanKosong(rightParts[0]).length > 0;

    return {
        adaTeksKiri: adaTeksKiri,
        adaTeksKanan: adaTeksKanan,
        editableHost: editableHost
    };
};

window.sisipkanLatexInlineKeSeleksi = function(rawTextOpsional) {
    if (typeof window.kembalikanSeleksiTeks === 'function') {
        window.kembalikanSeleksiTeks();
    }

    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let range = sel.getRangeAt(0);

    let lines = (typeof rawTextOpsional === 'string' && rawTextOpsional.trim() !== '')
        ? rawTextOpsional.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').map(function(l) { return l.trim(); })
        : window.ekstrakBarisDariRange(range);

    if (!lines || lines.length === 0 || lines.every(function(l) { return !l; })) {
        return alert('Blok teks atau rumus matematika terlebih dahulu!');
    }

    let posisi = window.cekPosisiBarisLatex(range);
    let batchPrefix = 'mjx-tmp-' + Date.now() + '-' + Math.floor(Math.random() * 10000) + '-';
    let idList = [];

    function escAttr(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function escHtml(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    let potonganHtml = lines.map(function(rawLine, idx) {
        if (!rawLine) return '';

        let hasil = window.siapkanTeksLatexRapi(rawLine);
        if (!hasil) return escHtml(rawLine);

        let isCenter = false;
        if (lines.length === 1) {
            isCenter = !posisi.adaTeksKiri && !posisi.adaTeksKanan;
        } else if (idx === 0) {
            isCenter = !posisi.adaTeksKiri;
        } else if (idx === lines.length - 1) {
            isCenter = !posisi.adaTeksKanan;
        } else {
            isCenter = true;
        }

        let uid = batchPrefix + idx;
        idList.push(uid);
        let cls = isCenter ? 'latex-inline latex-center-self' : 'latex-inline';
        let trailingSpace = (!isCenter && lines.length === 1) ? '&nbsp;' : '';

        return '<span id="' + uid + '" class="' + cls + '" contenteditable="false" data-raw="' + escAttr(rawLine) + '" data-latex-src="' + escAttr(hasil) + '" ondblclick="window.batalLatex(this, event)" title="Klik 2x untuk membatalkan format rumus">\\(' + escHtml(hasil) + '\\)</span>' + trailingSpace;
    });

    let insertHtml = potonganHtml.join('<br>');

    // Gunakan execCommand('insertHTML') agar 100% tercatat di riwayat Undo (Cmd+Z) & Redo browser
    if (posisi.editableHost) posisi.editableHost.focus();
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand('insertHTML', false, insertHtml);

    let insertedSpans = [];
    idList.forEach(function(uid) {
        let el = document.getElementById(uid);
        if (el) {
            el.removeAttribute('id');
            insertedSpans.push(el);
        }
    });

    if (insertedSpans.length > 0 && window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        window.MathJax.typesetPromise(insertedSpans).catch(function(err) {
            console.warn('MathJax render warning:', err);
        });
    }

    if (posisi.editableHost) {
        posisi.editableHost.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (typeof triggerInput === 'function') {
        triggerInput();
    }
};

/* =========================================================================
   MESIN UNDO / REDO UNIVERSAL EDITOR (TABEL, LATEX, FORMAT, GAMBAR, & TEKS)
   ========================================================================= */
window._editorHistoryStacks = window._editorHistoryStacks || {};
window._editorUndoTimers = window._editorUndoTimers || {};
window._isRestoringUndo = false;
window._SELECTOR_EDITABLE_UNDO = '.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area';

window.ambilIdHistoryEditor = function(el) {
    if (!el) return '';
    let bab = String(window.babAktif || 'home');
    let bahasParent = el.closest ? el.closest('[id^="bahas-box-"]') : null;
    if (bahasParent && bahasParent.id) return bab + '__' + bahasParent.id;
    if (el.classList && el.classList.contains('home-side-editable')) {
        return bab + '__side_' + (el.getAttribute('data-side-pos') || 'x') + '_' + (el.getAttribute('data-side-index') || '0');
    }
    if (el.classList && el.classList.contains('fb-content')) {
        return bab + '__fb_' + (el.getAttribute('data-fb-index') || '0');
    }
    if (el.id) return bab + '__id_' + el.id;
    if (el.hasAttribute && el.hasAttribute('data-index')) {
        return bab + '__block_' + el.getAttribute('data-index');
    }
    return bab + '__generic_editor';
};

window.rekamPosisiKursorEditor = function(rootEl) {
    try {
        let sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        let rng = sel.getRangeAt(0);
        if (!rootEl.contains(rng.startContainer)) return null;

        let path = [];
        let node = rng.startContainer;
        while (node && node !== rootEl) {
            let parent = node.parentNode;
            if (!parent) return null;
            path.unshift(Array.prototype.indexOf.call(parent.childNodes, node));
            node = parent;
        }
        return { path: path, offset: rng.startOffset };
    } catch (e) {
        return null;
    }
};

window.pulihkanPosisiKursorEditor = function(rootEl, caret) {
    if (!rootEl) return;
    try {
        rootEl.focus();
        if (!caret || !Array.isArray(caret.path)) return;
        let node = rootEl;
        for (let i = 0; i < caret.path.length; i++) {
            let idx = caret.path[i];
            if (!node.childNodes || idx < 0 || idx >= node.childNodes.length) return;
            node = node.childNodes[idx];
        }
        let maxOff = (node.nodeType === 3) ? node.nodeValue.length : node.childNodes.length;
        let safeOff = Math.max(0, Math.min(caret.offset || 0, maxOff));
        let rng = document.createRange();
        rng.setStart(node, safeOff);
        rng.collapse(true);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(rng);
        window.savedEditorRange = rng.cloneRange();
        window.globalSelectedRange = rng.cloneRange();
    } catch (e) {}
};

window.pastikanHistoryEditorAda = function(el) {
    if (!el) return null;
    let key = window.ambilIdHistoryEditor(el);
    let state = window._editorHistoryStacks[key];
    if (!state || !Array.isArray(state.stack) || state.stack.length === 0) {
        state = {
            stack: [{ html: el.innerHTML, caret: window.rekamPosisiKursorEditor(el) }],
            pointer: 0
        };
        window._editorHistoryStacks[key] = state;
    }
    return { key: key, state: state };
};

window.catatSnapshotUndo = function(el, forceImmediate) {
    if (!el || window._isRestoringUndo) return;
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    if (!isEdit) return;

    let info = window.pastikanHistoryEditorAda(el);
    if (!info) return;

    let simpanSekarang = function() {
        if (window._isRestoringUndo || !document.body.contains(el)) return;
        let curHtml = el.innerHTML;
        let st = info.state;
        let topItem = st.stack[st.pointer];
        if (topItem && topItem.html === curHtml) return;

        // Buang cabang Redo lama jika mulai mengedit perubahan baru
        if (st.pointer < st.stack.length - 1) {
            st.stack = st.stack.slice(0, st.pointer + 1);
        }

        st.stack.push({ html: curHtml, caret: window.rekamPosisiKursorEditor(el) });

        // Batasi kapasitas memori (25 langkah jika ada gambar besar, 60 langkah untuk teks/tabel)
        let maxSteps = curHtml.length > 60000 ? 25 : 60;
        if (st.stack.length > maxSteps) {
            st.stack.shift();
        }
        st.pointer = st.stack.length - 1;
    };

    clearTimeout(window._editorUndoTimers[info.key]);
    if (forceImmediate) {
        simpanSekarang();
    } else {
        window._editorUndoTimers[info.key] = setTimeout(simpanSekarang, 420);
    }
};

window.siapkanSnapshotSebelumAksi = function(el) {
    let target = el || window.lastActiveEditable;
    if (!target || !document.body.contains(target)) return;
    window.catatSnapshotUndo(target, true);
};

window.cariTargetEditableUntukUndo = function() {
    let active = document.activeElement;
    if (active) {
        let tag = active.tagName ? active.tagName.toUpperCase() : '';
        // Biarkan input/textarea biasa (misalnya di modal) memakai Undo bawaan browser
        if (tag === 'INPUT' || tag === 'TEXTAREA') return null;

        let closestEd = active.closest ? active.closest(window._SELECTOR_EDITABLE_UNDO) : null;
        if (closestEd && document.body.contains(closestEd)) {
            return closestEd;
        }
    }

    // Jika tidak ada modal input lain yang terbuka, pakai blok editor terakhir yang disentuh (penting setelah klik tombol tabel!)
    if (typeof window.apakahAdaModalOverlayTerbuka === 'function' && window.apakahAdaModalOverlayTerbuka()) {
        let popBox = document.getElementById('popup-content-box');
        let popModal = document.getElementById('modal-welcome-popup');
        if (popModal && popModal.style.display === 'flex' && popBox) return popBox;
        return null;
    }

    if (window.lastActiveEditable && document.body.contains(window.lastActiveEditable)) {
        return window.lastActiveEditable;
    }
    return null;
};

window.terapkanLangkahHistoryEditor = function(arah) {
    if (window.isDrawingMode) return false;
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    if (!isEdit) return false;

    let el = window.cariTargetEditableUntukUndo();
    if (!el) return false;

    let info = window.pastikanHistoryEditorAda(el);
    if (!info) return false;

    let st = info.state;
    clearTimeout(window._editorUndoTimers[info.key]);

    // Jika baru saja mengetik (< 420ms) sebelum menekan Cmd+Z, kunci dulu ketikan terakhir agar bisa di-Redo nanti
    if (arah < 0 && st.stack[st.pointer] && st.stack[st.pointer].html !== el.innerHTML) {
        if (st.pointer < st.stack.length - 1) {
            st.stack = st.stack.slice(0, st.pointer + 1);
        }
        st.stack.push({ html: el.innerHTML, caret: window.rekamPosisiKursorEditor(el) });
        st.pointer = st.stack.length - 1;
    }

    let nextPtr = st.pointer + arah;
    if (nextPtr < 0 || nextPtr >= st.stack.length) {
        return true; // Sudah mentok awal/akhir, tetap cegah browser Undo liar
    }

    st.pointer = nextPtr;
    let snapshot = st.stack[st.pointer];

    window._isRestoringUndo = true;
    try {
        el.innerHTML = snapshot.html;
        window.lastActiveEditable = el;

        // Bersihkan sorotan / kontrol melayang jika elemen lamanya sudah tidak ada
        if (typeof window.bersihkanSorotanSelTabel === 'function') window.bersihkanSorotanSelTabel();
        if (window.activeTableCell && !document.body.contains(window.activeTableCell)) {
            window.activeTableCell = null;
            let tc = document.getElementById('tbl-controls');
            if (tc) tc.style.display = 'none';
        }
        if (window.selectedImg && !document.body.contains(window.selectedImg)) {
            window.selectedImg = null;
            let ic = document.getElementById('img-controls');
            if (ic) ic.style.display = 'none';
        }

        // Sinkronkan data model blok & pemicu Auto-Save ke Firebase
        if (el.classList.contains('home-side-editable')) {
            let pos = el.getAttribute('data-side-pos');
            let sIdx = parseInt(el.getAttribute('data-side-index'), 10);
            let arr = pos === 'left' ? window.homeLeftBlocksData : window.homeRightBlocksData;
            if (Array.isArray(arr) && arr[sIdx]) arr[sIdx].html = el.innerHTML;
        } else if (el.classList.contains('fb-content')) {
            let fIdx = parseInt(el.getAttribute('data-fb-index'), 10);
            if (window.floatingBoxesData && window.floatingBoxesData[fIdx]) {
                window.floatingBoxesData[fIdx].html = el.innerHTML;
            }
        } else if (el.classList.contains('content-block') && el.hasAttribute('data-index') && !el.closest('[id^="bahas-box-"]')) {
            let bIdx = parseInt(el.getAttribute('data-index'), 10);
            if (window.contentBlocksData && window.contentBlocksData[bIdx]) {
                window.contentBlocksData[bIdx].html = el.innerHTML;
            }
        }

        el.dispatchEvent(new Event('input', { bubbles: true }));
        window.pulihkanPosisiKursorEditor(el, snapshot.caret);

        // Render ulang hanya rumus LaTeX yang belum ter-render MathJax
        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
            let belumRender = Array.from(el.querySelectorAll('.latex-inline, .math-latex-block')).filter(function(node) {
                return !node.querySelector('mjx-container');
            });
            if (belumRender.length > 0) {
                window.MathJax.typesetPromise(belumRender).catch(function() {});
            }
        }
    } finally {
        window._isRestoringUndo = false;
    }

    return true;
};

window.eksekusiUndoEditor = function() {
    window.terapkanLangkahHistoryEditor(-1);
};

window.eksekusiRedoEditor = function() {
    window.terapkanLangkahHistoryEditor(1);
};

// 1. Rekam kondisi awal setiap kali masuk ke Content Block / Tabel / Shape / Catatan
document.addEventListener('focusin', function(e) {
    let ed = (e.target && e.target.closest) ? e.target.closest(window._SELECTOR_EDITABLE_UNDO) : null;
    if (ed) {
        window.lastActiveEditable = ed;
        window.pastikanHistoryEditorAda(ed);
    }
}, true);

// 2. Kunci kondisi SEBELUM tombol toolbar, tabel, gambar, atau aksi paste mengubah DOM
document.addEventListener('mousedown', function(e) {
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    if (!isEdit) return;

    let ed = (e.target && e.target.closest) ? e.target.closest(window._SELECTOR_EDITABLE_UNDO) : null;
    if (ed) {
        window.lastActiveEditable = ed;
        window.pastikanHistoryEditorAda(ed);
        // Jika mulai seret tepi kolom tabel untuk resize, kunci kondisi sebelum resize
        let cell = e.target.closest ? e.target.closest('td, th') : null;
        if (cell) {
            let rect = cell.getBoundingClientRect();
            if ((rect.right - e.clientX) <= 8) {
                window.siapkanSnapshotSebelumAksi(ed);
            }
        }
        return;
    }

    if (e.target && e.target.closest && e.target.closest('#toolbar, #tbl-controls, #img-controls')) {
        let btnUndoRedo = e.target.closest('button[onclick*="eksekusiUndoEditor"], button[onclick*="eksekusiRedoEditor"]');
        if (!btnUndoRedo) {
            window.siapkanSnapshotSebelumAksi(window.lastActiveEditable);
        }
    }
}, true);

document.addEventListener('paste', function(e) {
    let ed = (e.target && e.target.closest) ? e.target.closest(window._SELECTOR_EDITABLE_UNDO) : null;
    if (ed) {
        window.lastActiveEditable = ed;
        window.siapkanSnapshotSebelumAksi(ed);
    }
}, true);

// 3. Rekam otomatis setiap perubahan ketikan maupun aksi DOM (input event)
document.addEventListener('input', function(e) {
    if (window._isRestoringUndo) return;
    let ed = (e.target && e.target.closest) ? e.target.closest(window._SELECTOR_EDITABLE_UNDO) : null;
    if (!ed) return;

    window.lastActiveEditable = ed;
    let tipe = e.inputType || '';
    let langsung = !e.isTrusted ||
        tipe === 'insertFromPaste' ||
        tipe === 'deleteByCut' ||
        tipe === 'insertParagraph' ||
        tipe === 'insertLineBreak' ||
        tipe.indexOf('format') === 0;

    window.catatSnapshotUndo(ed, langsung);
}, true);

// 4. Tangkap shortcut Cmd+Z / Ctrl+Z (Undo) dan Cmd+Shift+Z / Ctrl+Y (Redo)
document.addEventListener('keydown', function(e) {
    if (window.isDrawingMode) return;
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    if (!isEdit) return;

    let key = (e.key || '').toLowerCase();
    let mod = (e.metaKey || e.ctrlKey) && !e.altKey;

    if (mod && key === 'z' && !e.shiftKey) {
        if (window.terapkanLangkahHistoryEditor(-1)) {
            e.preventDefault();
            e.stopPropagation();
        }
        return;
    }

    if (mod && ((e.shiftKey && key === 'z') || (!e.shiftKey && key === 'y'))) {
        if (window.terapkanLangkahHistoryEditor(1)) {
            e.preventDefault();
            e.stopPropagation();
        }
        return;
    }

    // Sebelum hapus isi multi-sel tabel atau Enter baru, kunci snapshot saat ini
    if (e.key === 'Delete' || e.key === 'Backspace') {
        if (window.activeTableCells && window.activeTableCells.length > 1) {
            let tbl = window.activeTableCells[0].closest('table');
            let ed = tbl ? tbl.closest(window._SELECTOR_EDITABLE_UNDO) : window.lastActiveEditable;
            if (ed) window.siapkanSnapshotSebelumAksi(ed);
        }
    }
}, true);
/* =========================================================================
   TAHAP 2: LIST 5 TINGKAT (BULLETS & NUMBERING 1./A./a.), TAB WORD, & SHORTCUT
   ========================================================================= */
window.sinkronkanTingkatList = function(rootScope) {
    let scope = rootScope || document.getElementById('main-editor-wrapper') || document;
    if (!scope || !scope.querySelectorAll) return;

    scope.querySelectorAll('ul, ol').forEach(function(listEl) {
        if (!listEl.closest('.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area')) return;

        let tag = listEl.tagName.toUpperCase();
        let depth = 1;
        let curr = listEl.parentElement;
        let rootOl = (tag === 'OL') ? listEl : null;

        while (curr && !curr.matches('.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area')) {
            if (curr.tagName && curr.tagName.toUpperCase() === tag) {
                depth++;
                if (tag === 'OL') rootOl = curr;
            }
            curr = curr.parentElement;
        }

        let clampedLevel = String(Math.min(5, depth));
        if (listEl.getAttribute('data-list-level') !== clampedLevel) {
            listEl.setAttribute('data-list-level', clampedLevel);
        }

        if (tag === 'OL') {
            let rootStyle = (rootOl && rootOl.getAttribute('data-ol-style'))
                || listEl.getAttribute('data-ol-style')
                || 'decimal';
            if (listEl.getAttribute('data-ol-style') !== rootStyle) {
                listEl.setAttribute('data-ol-style', rootStyle);
            }
        }
    });
};

window.terapkanNumberedList = function(tipeStyle) {
    let targetStyle = tipeStyle || 'decimal';
    if (typeof pastikanFokusEditor === 'function') pastikanFokusEditor();

    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let rng = sel.getRangeAt(0);
    let anchorEl = rng.startContainer.nodeType === 3 ? rng.startContainer.parentElement : rng.startContainer;
    let editableHost = (anchorEl && anchorEl.closest)
        ? anchorEl.closest('.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area')
        : window.lastActiveEditable;
    if (!editableHost) return;

    if (typeof window.siapkanSnapshotSebelumAksi === 'function') {
        window.siapkanSnapshotSebelumAksi(editableHost);
    }

    // Jika kursor sudah berada di dalam <ol> dengan gaya berbeda (misal dari 1. klik A—), cukup ubah gayanya
    let existingOl = (anchorEl && anchorEl.closest) ? anchorEl.closest('ol') : null;
    if (existingOl && editableHost.contains(existingOl)) {
        let rootOl = existingOl;
        let p = existingOl.parentElement;
        while (p && editableHost.contains(p)) {
            if (p.tagName && p.tagName.toUpperCase() === 'OL') rootOl = p;
            p = p.parentElement;
        }
        let curStyle = rootOl.getAttribute('data-ol-style') || 'decimal';
        if (curStyle !== targetStyle) {
            rootOl.setAttribute('data-ol-style', targetStyle);
            window.sinkronkanTingkatList(editableHost);
            if (typeof triggerInput === 'function') triggerInput();
            return;
        }
    }

    // Buat atau matikan ordered list memakai formatTeks (otomatis membersihkan prefix manual)
    window.formatTeks('insertOrderedList');

    // Terapkan gaya (decimal / upper-alpha / lower-alpha) pada <ol> yang baru terbentuk
    let selAfter = window.getSelection();
    if (selAfter && selAfter.rangeCount > 0) {
        let aAfter = selAfter.anchorNode && selAfter.anchorNode.nodeType === 3
            ? selAfter.anchorNode.parentElement
            : selAfter.anchorNode;
        let newOl = (aAfter && aAfter.closest) ? aAfter.closest('ol') : null;
        if (newOl && editableHost.contains(newOl)) {
            let rootOl = newOl;
            let p = newOl.parentElement;
            while (p && editableHost.contains(p)) {
                if (p.tagName && p.tagName.toUpperCase() === 'OL') rootOl = p;
                p = p.parentElement;
            }
            rootOl.setAttribute('data-ol-style', targetStyle);
        }
    }

    window.sinkronkanTingkatList(editableHost);
    if (typeof triggerInput === 'function') triggerInput();
};

window.geserTingkatListToolbar = function(arah) {
    if (typeof pastikanFokusEditor === 'function') pastikanFokusEditor();
    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let node = sel.anchorNode;
    let el = node && node.nodeType === 3 ? node.parentElement : node;
    let editableHost = (el && el.closest)
        ? el.closest('.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area')
        : window.lastActiveEditable;
    if (!editableHost) return;

    if (typeof window.siapkanSnapshotSebelumAksi === 'function') {
        window.siapkanSnapshotSebelumAksi(editableHost);
    }

    let li = (el && el.closest) ? el.closest('li') : null;
    if (li && editableHost.contains(li)) {
        window.sinkronkanTingkatList(editableHost);
        let parentList = li.parentElement;
        let curLvl = parseInt((parentList && parentList.getAttribute('data-list-level')) || '1', 10) || 1;
        if (arah > 0 && curLvl >= 5) return; // Batas maksimal 5 tingkat
        document.execCommand(arah > 0 ? 'indent' : 'outdent', false, null);
        window.sinkronkanTingkatList(editableHost);
        if (typeof triggerInput === 'function') triggerInput();
    } else {
        window.formatTeks(arah > 0 ? 'indent' : 'outdent');
    }
};

// Listener Keyboard: Tab (List 5 Tingkat / Tab Spasi Word) & Shortcut Alignment + Besarkan Font
document.addEventListener('keydown', function(e) {
    if (window.isDrawingMode) return;
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    if (!isEdit) return;

    let active = document.activeElement;
    if (!active) return;
    let activeTag = active.tagName ? active.tagName.toUpperCase() : '';
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    let editableHost = active.closest
        ? active.closest('.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area')
        : null;
    if (!editableHost) return;

    // 1. TOMBOL TAB & SHIFT+TAB
    if (e.key === 'Tab') {
        let sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        let node = sel.anchorNode;
        let el = node && node.nodeType === 3 ? node.parentElement : node;
        let li = (el && el.closest) ? el.closest('li') : null;
        let cell = (el && el.closest) ? el.closest('td, th') : null;

        // A. Di dalam Bullets / Numbering (<li>): Naik/turun tingkat hingga 5 level
        if (li && editableHost.contains(li)) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.siapkanSnapshotSebelumAksi === 'function') {
                window.siapkanSnapshotSebelumAksi(editableHost);
            }
            window.sinkronkanTingkatList(editableHost);
            let parentList = li.parentElement;
            let curLvl = parseInt((parentList && parentList.getAttribute('data-list-level')) || '1', 10) || 1;

            if (!e.shiftKey) {
                if (curLvl < 5) {
                    document.execCommand('indent', false, null);
                }
            } else {
                document.execCommand('outdent', false, null);
            }

            window.sinkronkanTingkatList(editableHost);
            if (typeof triggerInput === 'function') triggerInput();
            return;
        }

        // B. Di dalam sel tabel biasa (bukan list): biarkan handler Tab tabel yang memindahkan sel
        if (cell && editableHost.contains(cell)) {
            return;
        }

        // C. Di teks biasa: Tab berfungsi sebagai spasi panjang (tabulasi ala Microsoft Word)
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.siapkanSnapshotSebelumAksi === 'function') {
            window.siapkanSnapshotSebelumAksi(editableHost);
        }

        if (!e.shiftKey) {
            document.execCommand('insertText', false, '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0');
        } else {
            // Shift+Tab di teks biasa: hapus tabulasi spasi di belakang kursor jika ada
            let rng = sel.getRangeAt(0);
            if (rng.collapsed && rng.startContainer.nodeType === 3 && rng.startOffset > 0) {
                let tn = rng.startContainer;
                let before = tn.nodeValue.slice(0, rng.startOffset);
                let matchSp = before.match(/[\u00A0 ]{1,8}$/);
                if (matchSp) {
                    let delRng = document.createRange();
                    delRng.setStart(tn, rng.startOffset - matchSp[0].length);
                    delRng.setEnd(tn, rng.startOffset);
                    sel.removeAllRanges();
                    sel.addRange(delRng);
                    document.execCommand('delete', false, null);
                }
            }
        }
        if (typeof triggerInput === 'function') triggerInput();
        return;
    }

    // 2. SHORTCUT KEYBOARD MICROSOFT WORD (CMD/CTRL + L, E, R, J & CMD/CTRL + SHIFT + > / <)
    let mod = (e.metaKey || e.ctrlKey) && !e.altKey;
    if (!mod) return;

    let keyLow = (e.key || '').toLowerCase();

    if (!e.shiftKey && (keyLow === 'l' || keyLow === 'e' || keyLow === 'r' || keyLow === 'j')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.siapkanSnapshotSebelumAksi === 'function') {
            window.siapkanSnapshotSebelumAksi(editableHost);
        }
        if (keyLow === 'l') window.formatTeks('justifyLeft');
        else if (keyLow === 'e') window.formatTeks('justifyCenter');
        else if (keyLow === 'r') window.formatTeks('justifyRight');
        else if (keyLow === 'j') window.formatTeks('justifyFull');
        return;
    }

    if (e.shiftKey && (e.key === '>' || e.code === 'Period')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.siapkanSnapshotSebelumAksi === 'function') {
            window.siapkanSnapshotSebelumAksi(editableHost);
        }
        if (typeof window.ubahFontStep === 'function') window.ubahFontStep(1);
        return;
    }

    if (e.shiftKey && (e.key === '<' || e.code === 'Comma')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.siapkanSnapshotSebelumAksi === 'function') {
            window.siapkanSnapshotSebelumAksi(editableHost);
        }
        if (typeof window.ubahFontStep === 'function') window.ubahFontStep(-1);
        return;
    }
}, true);

// Sinkronkan tingkat list otomatis saat halaman dimuat & saat konten bab baru dirender
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { window.sinkronkanTingkatList(); }, 450);
    let cont = document.getElementById('blocks-container');
    if (cont) {
        let obsListSync = new MutationObserver(function() {
            window.sinkronkanTingkatList(cont);
        });
        obsListSync.observe(cont, { childList: true });
    }
});
/* =========================================================================
   TAHAP 3: BACKGROUND FOTO CONTENT BLOCK (CLOUDINARY) + SLIDER OPASITAS
   ========================================================================= */
window._bgOpacitySaveTimer = null;

window.sinkronkanUIBgFotoSidebar = function(blokObj) {
    let ctrlBox = document.getElementById('sidebar-bg-photo-controls');
    let btnHapus = document.getElementById('btn-hapus-bg-photo');
    let thumb = document.getElementById('sidebar-bg-photo-thumb');
    let slider = document.getElementById('slider-bg-photo-opacity');
    let valLbl = document.getElementById('val-bg-opacity');
    let statusEl = document.getElementById('status-upload-bg-photo');
    if (statusEl) statusEl.style.display = 'none';

    let url = (blokObj && typeof blokObj.bgImage === 'string') ? blokObj.bgImage.trim() : '';
    let op = (blokObj && typeof blokObj.bgImageOpacity === 'number' && !isNaN(blokObj.bgImageOpacity)) ? blokObj.bgImageOpacity : 25;

    if (url) {
        if (ctrlBox) ctrlBox.style.display = 'block';
        if (btnHapus) btnHapus.style.display = 'inline-flex';
        if (thumb) thumb.src = url;
        if (slider) slider.value = String(op);
        if (valLbl) valLbl.innerText = op + '%';
    } else {
        if (ctrlBox) ctrlBox.style.display = 'none';
        if (btnHapus) btnHapus.style.display = 'none';
        if (thumb) thumb.src = '';
        if (slider) slider.value = '25';
        if (valLbl) valLbl.innerText = '25%';
    }
};

window.terapkanBgFotoKeBlokDOM = function(idx) {
    let b = window.contentBlocksData && window.contentBlocksData[idx];
    if (!b) return;
    let wrapper = document.querySelector('#blocks-container > .block-wrapper[data-index="' + idx + '"]');
    if (!wrapper) return;

    let area = wrapper.querySelector(':scope > div > .block-collapsible-area');
    if (!area) return;

    let layer = area.querySelector(':scope > .block-bg-photo-layer');
    let url = (typeof b.bgImage === 'string') ? b.bgImage.trim() : '';
    let op = (typeof b.bgImageOpacity === 'number' && !isNaN(b.bgImageOpacity)) ? b.bgImageOpacity : 25;

    if (url) {
        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'block-bg-photo-layer';
            area.insertBefore(layer, area.firstChild);
        }
        layer.style.backgroundImage = 'url("' + url.replace(/"/g, '\\"') + '")';
        layer.style.opacity = String(op / 100);
        layer.style.display = 'block';
        area.classList.add('has-bg-photo');
    } else {
        if (layer) layer.remove();
        area.classList.remove('has-bg-photo');
    }
};

window.kompresFotoUntukBgCloudinary = function(file) {
    return new Promise(function(resolve) {
        let isGif = (file.type === 'image/gif') || (file.name && /\.gif$/i.test(file.name));
        if (isGif) {
            resolve(file);
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e) {
            let img = new Image();
            img.onload = function() {
                let MAX_DIM = 1280;
                let w = img.width;
                let h = img.height;
                if (w > MAX_DIM || h > MAX_DIM) {
                    if (w > h) { h = Math.round(h * (MAX_DIM / w)); w = MAX_DIM; }
                    else { w = Math.round(w * (MAX_DIM / h)); h = MAX_DIM; }
                }
                let canvas = document.createElement('canvas');
                canvas.width = Math.max(1, w);
                canvas.height = Math.max(1, h);
                let ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                if (canvas.toBlob) {
                    canvas.toBlob(function(blob) {
                        resolve(blob || file);
                    }, 'image/jpeg', 0.78);
                } else {
                    resolve(file);
                }
            };
            img.onerror = function() { resolve(file); };
            img.src = e.target.result;
        };
        reader.onerror = function() { resolve(file); };
        reader.readAsDataURL(file);
    });
};

window.uploadBgFotoBlokCloudinary = async function(inputElem) {
    let file = inputElem && inputElem.files ? inputElem.files[0] : null;
    if (inputElem) inputElem.value = '';
    if (!file) return;

    let idx = (typeof window.activeBlockIndex === 'number' && window.activeBlockIndex > -1) ? window.activeBlockIndex : -1;
    if (idx === -1 || !window.contentBlocksData || !window.contentBlocksData[idx]) {
        return alert('⚠️ Pilih salah satu Content Block terlebih dahulu.');
    }

    let btnUp = document.getElementById('btn-upload-bg-photo');
    let statusEl = document.getElementById('status-upload-bg-photo');
    if (btnUp) {
        btnUp.disabled = true;
        btnUp.innerText = '⏳ Mengunggah...';
    }
    if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#d97706';
        statusEl.innerText = '⏳ Mengompres & mengirim foto ke Cloudinary...';
    }

    try {
        let blobSiap = await window.kompresFotoUntukBgCloudinary(file);
        let ext = (blobSiap.type && blobSiap.type.indexOf('gif') !== -1) ? 'gif' : 'jpg';
        let cloudName = 'rtkfvwvg';
        let uploadPreset = 'studykawan_video';
        let urlCloudinary = 'https://api.cloudinary.com/v1_1/' + cloudName + '/image/upload';

        let formData = new FormData();
        formData.append('file', blobSiap, 'bg_blok_' + Date.now() + '.' + ext);
        formData.append('upload_preset', uploadPreset);

        let response = await fetch(urlCloudinary, { method: 'POST', body: formData });
        let data = await response.json();

        if (!response.ok || !data || !data.secure_url) {
            throw new Error((data && data.error && data.error.message) ? data.error.message : 'Upload Cloudinary ditolak.');
        }

        let blok = window.contentBlocksData[idx];
        blok.bgImage = data.secure_url;
        if (typeof blok.bgImageOpacity !== 'number' || isNaN(blok.bgImageOpacity)) {
            blok.bgImageOpacity = 25;
        }

        window.terapkanBgFotoKeBlokDOM(idx);
        window.sinkronkanUIBgFotoSidebar(blok);
        if (typeof window.simpanKeDB === 'function') window.simpanKeDB();

        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.color = '#16a34a';
            statusEl.innerText = '✅ Foto latar tersimpan di Cloudinary!';
        }
    } catch (err) {
        console.error('Upload BG Cloudinary error:', err);
        if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.color = '#dc2626';
            statusEl.innerText = '❌ Gagal upload: ' + (err ? err.message : 'Periksa koneksi internet');
        }
    } finally {
        if (btnUp) {
            btnUp.disabled = false;
            btnUp.innerText = '🖼️ Upload Foto';
        }
    }
};

window.ubahOpasitasBgFotoBlok = function(val) {
    let idx = (typeof window.activeBlockIndex === 'number' && window.activeBlockIndex > -1) ? window.activeBlockIndex : -1;
    if (idx === -1 || !window.contentBlocksData || !window.contentBlocksData[idx]) return;

    let pct = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
    window.contentBlocksData[idx].bgImageOpacity = pct;

    let valLbl = document.getElementById('val-bg-opacity');
    if (valLbl) valLbl.innerText = pct + '%';

    window.terapkanBgFotoKeBlokDOM(idx);

    // Tunda simpan ke Firebase 350ms agar geser slider tetap mulus & hemat kuota
    clearTimeout(window._bgOpacitySaveTimer);
    window._bgOpacitySaveTimer = setTimeout(function() {
        if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
    }, 350);
};

window.hapusBgFotoBlok = function() {
    let idx = (typeof window.activeBlockIndex === 'number' && window.activeBlockIndex > -1) ? window.activeBlockIndex : -1;
    if (idx === -1 || !window.contentBlocksData || !window.contentBlocksData[idx]) return;

    window.contentBlocksData[idx].bgImage = '';
    window.terapkanBgFotoKeBlokDOM(idx);
    window.sinkronkanUIBgFotoSidebar(window.contentBlocksData[idx]);
    if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
};
/* =========================================================================
   MESIN RENCANA PEMBELAJARAN TERINTEGRASI (AGENDA + JADWAL M1 + LIBUR/ACARA)
   ========================================================================= */
window._rencanaNoteSaveTimer = null;

window.normalisasiNamaKelasJadwal = function(nama) {
    return String(nama || '')
        .toLowerCase()
        .replace(/kelas/g, '')
        .replace(/[^a-z0-9]/g, '');
};

window.ambilJadwalMengajarDefaultGuru = function() {
    let guru = String(window.guruAktif || sessionStorage.getItem('username') || 'mahardika').toLowerCase();
    if (guru === 'mahardika') {
        // Jadwal Biologi (M1) — SMAS Bodhi Dharma Batam (1=Senin, 2=Selasa, 3=Rabu, 4=Kamis, 5=Jumat)
        return {
            'X Ariya':       { 1: 2, 2: 1 },
            'X Dana':        { 4: 2, 5: 1 },
            'X Sila':        { 1: 2, 5: 1 },
            'X Kosalla':     { 5: 3 },
            'XI Adhitthana': { 2: 2, 3: 2 },
            'XI Kovida':     { 1: 3, 4: 1 },
            'XII Chandaka':  { 2: 1, 3: 3 }
        };
    }
    return {};
};

window.pastikanStrukturRencanaPembelajaran = function() {
    if (!window.adminJadwalKalenderData || typeof window.adminJadwalKalenderData !== 'object') {
        window.adminJadwalKalenderData = { excelHtml: '', events: {}, mediaSheets: [] };
    }
    if (!window.adminJadwalKalenderData.teachingSchedule || Object.keys(window.adminJadwalKalenderData.teachingSchedule).length === 0) {
        window.adminJadwalKalenderData.teachingSchedule = window.ambilJadwalMengajarDefaultGuru();
    }
    if (!window.adminJadwalKalenderData.rencanaNotes || typeof window.adminJadwalKalenderData.rencanaNotes !== 'object') {
        window.adminJadwalKalenderData.rencanaNotes = {};
    }
    if (typeof window.adminJadwalKalenderData.skipAcaraDiRencana !== 'boolean') {
        window.adminJadwalKalenderData.skipAcaraDiRencana = true;
    }
    return window.adminJadwalKalenderData;
};

window.formatTanggalIndoSingkat = function(dateKey) {
    if (!dateKey || dateKey.indexOf('-') === -1) return '-';
    let p = dateKey.split('-');
    let bln = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return parseInt(p[2], 10) + ' ' + (bln[parseInt(p[1], 10)] || p[1]) + ' ' + p[0];
};

window.buatDateKeyLokal = function(dt) {
    return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
};

window.ambilAgendaTerbaruUntukKelas = function(namaKelas) {
    let sumber = window.adminAgendaData || window.agendaMengajarData || window.agendaData || {};
    if (!sumber || typeof sumber !== 'object') return null;

    let targetNorm = window.normalisasiNamaKelasJadwal(namaKelas);
    let arrCocok = null;

    if (sumber[namaKelas]) {
        arrCocok = sumber[namaKelas];
    } else {
        let kunciCocok = Object.keys(sumber).find(function(k) {
            return window.normalisasiNamaKelasJadwal(k) === targetNorm;
        });
        if (kunciCocok) arrCocok = sumber[kunciCocok];
    }

    if (!arrCocok) return null;
    let list = Array.isArray(arrCocok) ? arrCocok.slice() : Object.values(arrCocok);
    list = list.filter(Boolean);
    if (list.length === 0) return null;

    // Urutkan berdasarkan tanggal terbaru (jika tanggal sama, entri terakhir menang)
    let best = list[0];
    let bestDate = String(best.tanggal || best.tgl || '');
    for (let i = 1; i < list.length; i++) {
        let cur = list[i];
        let curDate = String(cur.tanggal || cur.tgl || '');
        if (curDate >= bestDate) {
            best = cur;
            bestDate = curDate;
        }
    }

    return {
        tanggal: String(best.tanggal || best.tgl || '').trim(),
        materi: String(best.materi || '').trim(),
        rencana: String(best.rencana || best.rencanaBerikutnya || best.rencana_berikutnya || '').trim()
    };
};

window.hitungJadwalPertemuanBerikutnya = function(polaHariMap, tanggalAgendaTerakhir, skipAcara) {
    const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    let hariAktif = {};
    if (polaHariMap && typeof polaHariMap === 'object') {
        Object.keys(polaHariMap).forEach(function(hKey) {
            let jp = parseInt(polaHariMap[hKey], 10) || 0;
            if (jp > 0) hariAktif[parseInt(hKey, 10)] = jp;
        });
    }
    if (Object.keys(hariAktif).length === 0) return null;

    // Jika sudah ada agenda terakhir -> cari jadwal pertama SETELAH tanggal agenda tersebut
    // Jika belum ada agenda -> cari jadwal mulai dari HARI INI
    let cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    if (tanggalAgendaTerakhir && /^\d{4}-\d{2}-\d{2}$/.test(tanggalAgendaTerakhir)) {
        let parts = tanggalAgendaTerakhir.split('-');
        cursor = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
        cursor.setDate(cursor.getDate() + 1);
    }

    let eventsMap = (window.adminJadwalKalenderData && window.adminJadwalKalenderData.events) ? window.adminJadwalKalenderData.events : {};
    let dilewati = [];
    let catatanAcaraHariItu = [];

    for (let step = 0; step < 90; step++) {
        let dow = cursor.getDay(); // 1=Senin..6=Sabtu
        if (hariAktif[dow]) {
            let dk = window.buatDateKeyLokal(cursor);
            let rawEv = eventsMap[dk];
            let evList = Array.isArray(rawEv) ? rawEv : (rawEv ? Object.values(rawEv) : []);

            let liburEv = evList.find(function(ev) {
                return window.deteksiKategoriAgendaKalender(ev) === 'libur';
            });
            let acaraEv = evList.find(function(ev) {
                return window.deteksiKategoriAgendaKalender(ev) === 'acara';
            });

            if (liburEv) {
                let tLibur = String(liburEv.title || '').replace(/^libur\s*[\/:]\s*/i, '').trim() || 'Libur';
                dilewati.push('🔴 Libur: ' + tLibur + ' (' + window.formatTanggalIndoSingkat(dk) + ')');
                cursor.setDate(cursor.getDate() + 1);
                continue;
            }

            if (acaraEv && skipAcara) {
                let tAcara = String(acaraEv.title || '').replace(/^acara\s*[\/:]\s*/i, '').trim() || 'Acara';
                dilewati.push('🎭 Acara: ' + tAcara + ' (' + window.formatTanggalIndoSingkat(dk) + ')');
                cursor.setDate(cursor.getDate() + 1);
                continue;
            }

            if (acaraEv && !skipAcara) {
                let tAcaraInfo = String(acaraEv.title || '').replace(/^acara\s*[\/:]\s*/i, '').trim() || 'Acara';
                catatanAcaraHariItu.push('🎭 Acara: ' + tAcaraInfo);
            }

            return {
                dateKey: dk,
                hari: namaHari[dow],
                tanggalTampil: window.formatTanggalIndoSingkat(dk),
                jp: hariAktif[dow],
                dilewati: dilewati,
                catatanAcara: catatanAcaraHariItu
            };
        }
        cursor.setDate(cursor.getDate() + 1);
    }
    return null;
};

window.sinkronkanDanRenderRencana = function(forceFetch) {
    window.pastikanStrukturRencanaPembelajaran();
    let statusEl = document.getElementById('status-sync-rencana');
    let chkSkip = document.getElementById('chk-rencana-skip-acara');
    if (chkSkip) chkSkip.checked = Boolean(window.adminJadwalKalenderData.skipAcaraDiRencana);

    let belumAdaAgenda = !window.adminAgendaData || Object.keys(window.adminAgendaData).length === 0;
    if ((forceFetch || belumAdaAgenda) && typeof window.bacaDataRestFirebase === 'function') {
        let guru = String(window.guruAktif || 'mahardika').toLowerCase();
        if (statusEl) statusEl.innerText = '⏳ Menyinkronkan Agenda...';

        window.bacaDataRestFirebase('data_guru/' + guru + '/admin_agenda', function(val) {
            if (val && typeof val === 'object') {
                window.adminAgendaData = val;
            }
            if (statusEl) statusEl.innerText = '✅ Tersinkron';
            window.renderTabelRencanaPembelajaran();
        }, function() {
            if (statusEl) statusEl.innerText = '';
            window.renderTabelRencanaPembelajaran();
        }, { forceRefresh: Boolean(forceFetch), ttlMs: forceFetch ? 0 : 120000 });
        return;
    }

    if (statusEl) statusEl.innerText = '✅ Tersinkron';
    window.renderTabelRencanaPembelajaran();
};

window.ubahOpsiSkipAcaraRencana = function(isChecked) {
    window.pastikanStrukturRencanaPembelajaran();
    window.adminJadwalKalenderData.skipAcaraDiRencana = Boolean(isChecked);
    window.renderTabelRencanaPembelajaran();
    if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
};

window.pastikanJamJadwalRencanaAda = function() {
    let data = window.pastikanStrukturRencanaPembelajaran();
    if (!data.teachingHours || typeof data.teachingHours !== 'object') {
        data.teachingHours = {};
    }
    return data;
};

window.ambilJamMengajarSlot = function(namaKelas, hariNum) {
    let data = window.pastikanJamJadwalRencanaAda();
    let jamMap = data.teachingHours[namaKelas];
    if (!jamMap || typeof jamMap !== 'object') return '';
    return String(jamMap[hariNum] || '').trim();
};

window.ekstrakMenitUrutJam = function(jamStr) {
    let m = String(jamStr || '').match(/(\d{1,2})[:.](\d{2})/);
    if (!m) return 99999;
    return (parseInt(m[1], 10) * 60) + parseInt(m[2], 10);
};

// Cari referensi agenda terakhir (sebelum hari ini) milik suatu kelas agar bisa diedit langsung & sinkron balik
window.cariReferensiAgendaUntukRencana = function(namaKelas, batasSebelumDateKey) {
    let store = window.adminAgendaData || {};
    let normTarget = window.normalisasiNamaKelasJadwal(namaKelas);
    let matchedKey = Object.keys(store).find(function(k) {
        return window.normalisasiNamaKelasJadwal(k) === normTarget;
    });

    if (!matchedKey || !store[matchedKey]) {
        return { matchedKey: matchedKey || '', refObj: null, tanggal: '', materi: '', rencana: '', adaAgendaHariIni: false };
    }

    let rawList = store[matchedKey];
    let items = Array.isArray(rawList) ? rawList : Object.values(rawList || {});
    let bestBefore = null;
    let bestAny = null;
    let adaAgendaHariIni = false;

    items.forEach(function(it) {
        if (!it || typeof it !== 'object') return;
        let tgl = String(it.tgl || it.tanggal || '').trim();
        let ren = String(it.rencana || it.rencanaBerikutnya || it.rencana_berikutnya || '').trim();
        let mat = String(it.materi || '').trim();
        let entry = { refObj: it, tanggal: tgl, materi: mat, rencana: ren };

        if (batasSebelumDateKey && tgl === batasSebelumDateKey) {
            adaAgendaHariIni = true;
        }
        if (!bestAny || (tgl && tgl >= bestAny.tanggal)) {
            bestAny = entry;
        }
        if (batasSebelumDateKey) {
            if (!tgl || tgl < batasSebelumDateKey) {
                if (!bestBefore || tgl >= bestBefore.tanggal) {
                    bestBefore = entry;
                }
            }
        }
    });

    let chosen = batasSebelumDateKey ? (bestBefore || bestAny) : bestAny;
    if (!chosen) {
        return { matchedKey: matchedKey, refObj: null, tanggal: '', materi: '', rencana: '', adaAgendaHariIni: adaAgendaHariIni };
    }
    return {
        matchedKey: matchedKey,
        refObj: chosen.refObj,
        tanggal: chosen.tanggal,
        materi: chosen.materi,
        rencana: chosen.rencana,
        adaAgendaHariIni: adaAgendaHariIni
    };
};

window.renderTabelRencanaHariIni = function() {
    let tbody = document.getElementById('tbody-rencana-hari-ini');
    let judulEl = document.getElementById('judul-rencana-hari-ini');
    let badgeEl = document.getElementById('badge-ringkasan-hari-ini');
    let calBanner = document.getElementById('banner-kalender-hari-ini');
    if (!tbody) return;

    let data = window.pastikanJamJadwalRencanaAda();
    let schedule = data.teachingSchedule || {};
    let notesMap = data.rencanaNotes || {};

    let now = new Date();
    let todayDow = now.getDay(); // 0=Minggu, 1=Senin..6=Sabtu
    let todayKey = window.buatDateKeyLokal(now);
    let namaHariArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    let namaHariIni = namaHariArr[todayDow] || '';
    let tanggalIndo = window.formatTanggalIndoSingkat(todayKey);

    if (judulEl) {
        judulEl.innerText = '📅 Rencana Pembelajaran Hari Ini — ' + namaHariIni + ', ' + tanggalIndo;
    }

    // Tampilkan informasi jika hari ini ditandai Libur / Acara di Kalender
    if (calBanner) {
        let evTodayRaw = (data.events && data.events[todayKey]) ? data.events[todayKey] : [];
        let evToday = Array.isArray(evTodayRaw) ? evTodayRaw : Object.values(evTodayRaw || {});
        if (evToday.length > 0) {
            let labels = evToday.map(function(ev) {
                let kat = typeof window.deteksiKategoriAgendaKalender === 'function' ? window.deteksiKategoriAgendaKalender(ev) : 'agenda';
                let ico = kat === 'libur' ? '🔴 Libur' : (kat === 'acara' ? '🎭 Acara' : '📌 Agenda');
                let titleClean = String(ev.title || '').replace(/^(?:libur|acara)\s*[\/:]\s*/i, '').trim();
                return ico + ': ' + titleClean;
            });
            calBanner.style.display = 'block';
            calBanner.innerText = 'ℹ️ Catatan Kalender Hari Ini: ' + labels.join(' • ');
        } else {
            calBanner.style.display = 'none';
            calBanner.innerText = '';
        }
    }

    let daftarHariIni = [];
    Object.keys(schedule).forEach(function(namaKelas) {
        let mapHari = schedule[namaKelas] || {};
        let jp = parseInt(mapHari[todayDow], 10) || 0;
        if (jp <= 0) return;

        let jamStr = window.ambilJamMengajarSlot(namaKelas, todayDow);
        let agendaRef = window.cariReferensiAgendaUntukRencana(namaKelas, todayKey);
        let normK = window.normalisasiNamaKelasJadwal(namaKelas);
        let noteKey = normK + '__after_' + (agendaRef.tanggal || 'awal');
        let noteObj = notesMap[noteKey] || { persiapan: '', keterangan: '', rencanaManual: '' };
        let teksRencana = agendaRef.rencana || noteObj.rencanaManual || '';

        daftarHariIni.push({
            namaKelas: namaKelas,
            jp: jp,
            jam: jamStr,
            jamUrut: window.ekstrakMenitUrutJam(jamStr),
            agendaRef: agendaRef,
            noteKey: noteKey,
            teksRencana: teksRencana,
            persiapan: noteObj.persiapan || '',
            keterangan: noteObj.keterangan || ''
        });
    });

    // Urutkan otomatis berdasarkan jam mengajar paling pagi
    daftarHariIni.sort(function(a, b) {
        if (a.jamUrut !== b.jamUrut) return a.jamUrut - b.jamUrut;
        return a.namaKelas.localeCompare(b.namaKelas);
    });

    let totalJP = daftarHariIni.reduce(function(acc, r) { return acc + r.jp; }, 0);
    if (badgeEl) {
        badgeEl.innerText = daftarHariIni.length + ' Kelas • ' + totalJP + ' JP';
    }

    if (daftarHariIni.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="6" style="padding:22px; text-align:center; color:#475569; background:#f8fffc;">' +
                'Tidak ada jadwal mengajar untuk hari <b>' + namaHariIni + ', ' + tanggalIndo + '</b>. ' +
                'Anda tetap dapat melihat jadwal seluruh kelas di tabel bawah atau mengatur jadwal lewat <b>⚙️ Atur Jadwal Saya</b>.' +
            '</td></tr>';
        return;
    }

    let esc = function(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    let html = '';
    daftarHariIni.forEach(function(item) {
        let safeKls = item.namaKelas.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        let safeNoteKey = item.noteKey.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

        let sumberMeta = '';
        if (item.agendaRef.tanggal) {
            sumberMeta = '<div class="rencana-source-meta">Dari agenda ' + window.formatTanggalIndoSingkat(item.agendaRef.tanggal) +
                (item.agendaRef.materi ? ' • ' + esc(item.agendaRef.materi) : '') +
                (item.agendaRef.adaAgendaHariIni ? ' • <b style="color:#15803d;">✓ Agenda hari ini tercatat</b>' : '') +
                '</div>';
        } else {
            sumberMeta = '<div class="rencana-source-meta">Belum ada agenda sebelumnya — ketikan di atas akan otomatis tersimpan.</div>';
        }

        html +=
            '<tr>' +
                '<td style="vertical-align:top; padding:6px;">' +
                    '<input type="text" class="rencana-jam-input" value="' + esc(item.jam) + '" placeholder="07:30 - 09:00" title="Isi atau ubah jam mengajar untuk hari ' + namaHariIni + '" oninput="window.ubahJamJadwalKelas(\'' + safeKls + '\', ' + todayDow + ', this.value, true)">' +
                '</td>' +
                '<td style="font-weight:800; color:#0b3954; vertical-align:top;">' +
                    '<div>' + esc(item.namaKelas) + '</div>' +
                    '<span class="rencana-badge-today" style="margin-left:0; margin-top:4px;">HARI INI</span>' +
                '</td>' +
                '<td style="text-align:center; vertical-align:top;">' +
                    '<span class="rencana-jp-pill">' + item.jp + ' JP</span>' +
                '</td>' +
                '<td style="vertical-align:top; padding:6px;">' +
                    '<textarea class="rencana-cell-input is-agenda-edit" rows="2" placeholder="Tulis / edit rencana pembelajaran hari ini..." oninput="window.simpanEditRencanaDariJadwal(\'' + safeKls + '\', \'' + safeNoteKey + '\', this.value)">' + esc(item.teksRencana) + '</textarea>' +
                    sumberMeta +
                '</td>' +
                '<td style="vertical-align:top; padding:6px;">' +
                    '<textarea class="rencana-cell-input" data-sync-note="' + esc(item.noteKey) + '" data-sync-field="persiapan" rows="2" placeholder="Alat/bahan, LKPD, media..." oninput="window.simpanInputRencanaNote(\'' + safeNoteKey + '\', \'persiapan\', this.value, this)">' + esc(item.persiapan) + '</textarea>' +
                '</td>' +
                '<td style="vertical-align:top; padding:6px;">' +
                    '<textarea class="rencana-cell-input" data-sync-note="' + esc(item.noteKey) + '" data-sync-field="keterangan" rows="2" placeholder="Catatan tambahan..." oninput="window.simpanInputRencanaNote(\'' + safeNoteKey + '\', \'keterangan\', this.value, this)">' + esc(item.keterangan) + '</textarea>' +
                '</td>' +
            '</tr>';
    });

    tbody.innerHTML = html;
};

window.simpanEditRencanaDariJadwal = function(namaKelas, noteKey, valBaru) {
    let data = window.pastikanJamJadwalRencanaAda();
    let todayKey = window.buatDateKeyLokal(new Date());
    let agendaRef = window.cariReferensiAgendaUntukRencana(namaKelas, todayKey);
    let nilaiBersih = String(valBaru || '');
    let adaUpdateAgenda = false;

    // 1. Jika ada agenda sebelumnya di kelas tersebut, perbarui langsung kolom rencana di objek Agenda aslinya
    if (agendaRef && agendaRef.refObj) {
        let obj = agendaRef.refObj;
        if ('rencanaBerikutnya' in obj && !('rencana' in obj)) obj.rencanaBerikutnya = nilaiBersih.trim();
        else if ('rencana_berikutnya' in obj && !('rencana' in obj)) obj.rencana_berikutnya = nilaiBersih.trim();
        else obj.rencana = nilaiBersih.trim();
        adaUpdateAgenda = true;
    }

    // 2. Simpan juga cadangan sinkron di rencanaNotes agar kelas yang belum punya agenda tetap tersimpan
    if (!data.rencanaNotes[noteKey]) {
        data.rencanaNotes[noteKey] = { persiapan: '', keterangan: '' };
    }
    data.rencanaNotes[noteKey].rencanaManual = nilaiBersih;

    // 3. Cerminkan perubahan ke teks rencana di tabel "Semua Kelas" di bawah secara live tanpa merusak fokus ketik
    let normTarget = window.normalisasiNamaKelasJadwal(namaKelas);
    document.querySelectorAll('[data-sync-rencana-kelas="' + normTarget + '"]').forEach(function(el) {
        if (nilaiBersih.trim()) {
            el.style.color = '#0f172a';
            el.style.fontStyle = 'normal';
            el.style.fontWeight = '700';
            el.innerText = nilaiBersih.trim();
        } else {
            el.style.color = '#94a3b8';
            el.style.fontStyle = 'italic';
            el.style.fontWeight = '400';
            el.innerText = 'Belum ada "Rencana Berikutnya" di Agenda kelas ini.';
        }
    });

    let st = document.getElementById('status-sync-rencana');
    if (st) st.innerText = '✍️ Menyimpan rencana...';

    clearTimeout(window._rencanaAgendaEditTimer);
    window._rencanaAgendaEditTimer = setTimeout(function() {
        if (adaUpdateAgenda && typeof window.simpanPerubahanAgendaKeServer === 'function') {
            window.simpanPerubahanAgendaKeServer();
        }
        if (typeof window.simpanJadwalKalenderKeDB === 'function') {
            window.simpanJadwalKalenderKeDB();
        }
        if (typeof window.renderAgendaAdmin === 'function' && window.kelasAktifAdmin && window.normalisasiNamaKelasJadwal(window.kelasAktifAdmin) === normTarget) {
            window.renderAgendaAdmin();
        }
        if (st) st.innerText = '✅ Rencana tersinkron';
    }, 550);
};

window.renderTabelRencanaPembelajaran = function() {
    // Render bagian atas (Rencana Pembelajaran Hari Ini) terlebih dahulu
    window.renderTabelRencanaHariIni();

    let tbody = document.getElementById('tbody-rencana-pembelajaran');
    if (!tbody) return;

    let data = window.pastikanJamJadwalRencanaAda();
    let schedule = data.teachingSchedule || {};
    let notesMap = data.rencanaNotes || {};
    let skipAcara = Boolean(data.skipAcaraDiRencana);

    let kelasSet = Object.keys(schedule);
    if (kelasSet.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding:24px; text-align:center; color:#64748b;">Belum ada jadwal kelas. Klik <b>⚙️ Atur Jadwal Saya</b> di atas untuk menambahkan jadwal mengajar Anda.</td></tr>';
        return;
    }

    let todayKey = window.buatDateKeyLokal(new Date());
    let rowsData = kelasSet.map(function(namaKelas) {
        let agenda = window.ambilAgendaTerbaruUntukKelas(namaKelas);
        let nextInfo = window.hitungJadwalPertemuanBerikutnya(schedule[namaKelas], agenda ? agenda.tanggal : '', skipAcara);
        let normK = window.normalisasiNamaKelasJadwal(namaKelas);
        let noteKey = normK + '__after_' + ((agenda && agenda.tanggal) ? agenda.tanggal : 'awal');
        let noteObj = notesMap[noteKey] || { persiapan: '', keterangan: '', rencanaManual: '' };

        let nextJam = '';
        if (nextInfo && nextInfo.dateKey) {
            let nextDow = new Date(nextInfo.dateKey + 'T00:00:00').getDay();
            nextJam = window.ambilJamMengajarSlot(namaKelas, nextDow);
        }

        return {
            namaKelas: namaKelas,
            normK: normK,
            agenda: agenda,
            nextInfo: nextInfo,
            nextJam: nextJam,
            noteKey: noteKey,
            rencanaManual: noteObj.rencanaManual || '',
            persiapan: noteObj.persiapan || '',
            keterangan: noteObj.keterangan || ''
        };
    });

    // Urutkan otomatis berdasarkan tanggal pertemuan berikutnya yang paling dekat (lalu jam jika hari sama)
    rowsData.sort(function(a, b) {
        let da = a.nextInfo ? a.nextInfo.dateKey : '9999-12-31';
        let db = b.nextInfo ? b.nextInfo.dateKey : '9999-12-31';
        if (da !== db) return da.localeCompare(db);
        let ja = window.ekstrakMenitUrutJam(a.nextJam);
        let jb = window.ekstrakMenitUrutJam(b.nextJam);
        if (ja !== jb) return ja - jb;
        return a.namaKelas.localeCompare(b.namaKelas);
    });

    let esc = function(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    let html = '';
    rowsData.forEach(function(item) {
        let nextHtml = '<span style="color:#94a3b8; font-style:italic;">Jadwal belum diatur</span>';
        let jpHtml = '-';

        if (item.nextInfo) {
            let isHariIni = (item.nextInfo.dateKey === todayKey);
            let badgeToday = isHariIni ? ' <span class="rencana-badge-today">HARI INI</span>' : '';
            let jamBadgeHtml = item.nextJam ? '<div class="rencana-jam-chip">🕒 ' + esc(item.nextJam) + '</div>' : '';
            let skipHtml = '';
            if (item.nextInfo.dilewati && item.nextInfo.dilewati.length > 0) {
                skipHtml = '<div class="rencana-skip-note">⏭️ Lewati ' + esc(item.nextInfo.dilewati.join(', ')) + '</div>';
            }
            let acaraHtml = '';
            if (item.nextInfo.catatanAcara && item.nextInfo.catatanAcara.length > 0) {
                acaraHtml = '<div class="rencana-acara-note">' + esc(item.nextInfo.catatanAcara.join(', ')) + '</div>';
            }
            nextHtml =
                '<div style="font-weight:800; color:#0b3954; font-size:13px;">' + item.nextInfo.hari + badgeToday + '</div>' +
                '<div style="font-size:11.5px; color:#475569; font-weight:600;">' + item.nextInfo.tanggalTampil + '</div>' +
                jamBadgeHtml + skipHtml + acaraHtml;
            jpHtml = '<span class="rencana-jp-pill">' + item.nextInfo.jp + ' JP</span>';
        }

        let teksRencanaTampil = (item.agenda && item.agenda.rencana) ? item.agenda.rencana : (item.rencanaManual || '');
        let rencanaHtml = '';
        if (teksRencanaTampil) {
            rencanaHtml =
                '<div data-sync-rencana-kelas="' + esc(item.normK) + '" style="font-weight:700; color:#0f172a; font-size:12.5px; line-height:1.45;">' + esc(teksRencanaTampil) + '</div>' +
                (item.agenda && item.agenda.tanggal
                    ? '<div style="font-size:10.5px; color:#64748b; margin-top:4px;">Dari agenda ' + window.formatTanggalIndoSingkat(item.agenda.tanggal) + (item.agenda.materi ? ' • ' + esc(item.agenda.materi) : '') + '</div>'
                    : '');
        } else if (item.agenda && item.agenda.tanggal) {
            rencanaHtml =
                '<div data-sync-rencana-kelas="' + esc(item.normK) + '" style="color:#94a3b8; font-style:italic; font-size:11.5px;">Kolom rencana kosong pada agenda terakhir (' + window.formatTanggalIndoSingkat(item.agenda.tanggal) + ').</div>';
        } else {
            rencanaHtml = '<div data-sync-rencana-kelas="' + esc(item.normK) + '" style="color:#94a3b8; font-style:italic; font-size:12px;">Belum ada "Rencana Berikutnya" di Agenda kelas ini.</div>';
        }

        let safeNoteKey = item.noteKey.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

        html +=
            '<tr>' +
                '<td style="font-weight:800; color:#0b3954; vertical-align:top;">' + esc(item.namaKelas) + '</td>' +
                '<td style="vertical-align:top;">' + nextHtml + '</td>' +
                '<td style="text-align:center; vertical-align:top;">' + jpHtml + '</td>' +
                '<td style="vertical-align:top;">' + rencanaHtml + '</td>' +
                '<td style="vertical-align:top; padding:6px;">' +
                    '<textarea class="rencana-cell-input" data-sync-note="' + esc(item.noteKey) + '" data-sync-field="persiapan" rows="2" placeholder="Alat/bahan, LKPD, media..." oninput="window.simpanInputRencanaNote(\'' + safeNoteKey + '\', \'persiapan\', this.value, this)">' + esc(item.persiapan) + '</textarea>' +
                '</td>' +
                '<td style="vertical-align:top; padding:6px;">' +
                    '<textarea class="rencana-cell-input" data-sync-note="' + esc(item.noteKey) + '" data-sync-field="keterangan" rows="2" placeholder="Catatan tambahan..." oninput="window.simpanInputRencanaNote(\'' + safeNoteKey + '\', \'keterangan\', this.value, this)">' + esc(item.keterangan) + '</textarea>' +
                '</td>' +
            '</tr>';
    });

    tbody.innerHTML = html;
};

window.simpanInputRencanaNote = function(noteKey, field, val, sourceEl) {
    let data = window.pastikanJamJadwalRencanaAda();
    if (!data.rencanaNotes[noteKey]) {
        data.rencanaNotes[noteKey] = { persiapan: '', keterangan: '' };
    }
    data.rencanaNotes[noteKey][field] = val;

    // Sinkronkan isi textarea yang sama antara tabel Hari Ini & tabel Semua Kelas secara real-time
    document.querySelectorAll('textarea[data-sync-note][data-sync-field="' + field + '"]').forEach(function(ta) {
        if (ta !== sourceEl && ta.getAttribute('data-sync-note') === noteKey) {
            ta.value = val;
        }
    });

    let st = document.getElementById('status-sync-rencana');
    if (st) st.innerText = '✍️ Menyimpan...';

    clearTimeout(window._rencanaNoteSaveTimer);
    window._rencanaNoteSaveTimer = setTimeout(function() {
        if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
        if (st) st.innerText = '✅ Tersimpan';
    }, 550);
};

// --- PANEL EDITOR JADWAL MENGAJAR SAYA (JP + JAM MENGAJAR PER HARI) ---
window.toggleEditorJadwalSaya = function() {
    let panel = document.getElementById('panel-editor-jadwal-saya');
    if (!panel) return;
    let akanBuka = (panel.style.display === 'none');
    panel.style.display = akanBuka ? 'block' : 'none';
    if (akanBuka) window.renderEditorJadwalSaya();
};

window.renderEditorJadwalSaya = function() {
    let panel = document.getElementById('panel-editor-jadwal-saya');
    if (!panel) return;
    let data = window.pastikanJamJadwalRencanaAda();
    let schedule = data.teachingSchedule || {};
    let daftarKelas = Object.keys(schedule);

    let esc = function(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    let rowsHtml = '';
    daftarKelas.forEach(function(kls) {
        let map = schedule[kls] || {};
        let safeKls = kls.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        let colsHari = '';
        for (let h = 1; h <= 5; h++) {
            let jp = parseInt(map[h], 10) || 0;
            let jamStr = window.ambilJamMengajarSlot(kls, h);
            colsHari +=
                '<td style="text-align:center; padding:5px 4px; vertical-align:top;">' +
                    '<div class="rencana-slot-cell">' +
                        '<div class="rencana-slot-jp-row">' +
                            '<input type="number" min="0" max="10" value="' + jp + '" title="Jumlah JP" onchange="window.ubahJpJadwalKelas(\'' + safeKls + '\', ' + h + ', this.value)">' +
                            '<span>JP</span>' +
                        '</div>' +
                        '<input type="text" class="rencana-slot-jam-in" value="' + esc(jamStr) + '" placeholder="07:30-09:00" title="Jam Mengajar (mis: 07:30 - 09:00)" onchange="window.ubahJamJadwalKelas(\'' + safeKls + '\', ' + h + ', this.value, false)">' +
                    '</div>' +
                '</td>';
        }
        rowsHtml +=
            '<tr>' +
                '<td style="font-weight:800; color:#0b3954; vertical-align:middle;">' + esc(kls) + '</td>' +
                colsHari +
                '<td style="text-align:center; vertical-align:middle;"><button type="button" style="background:#fee2e2; color:#dc2626; border:none; border-radius:6px; padding:4px 8px; cursor:pointer; font-weight:700; font-size:11px;" onclick="window.hapusKelasJadwalSaya(\'' + safeKls + '\')">✕</button></td>' +
            '</tr>';
    });

    panel.innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">' +
            '<div style="font-size:12px; font-weight:800; color:#0b3954;">⚙️ Pengaturan Jumlah JP &amp; Jam Mengajar per Hari (Isi 0 JP jika tidak mengajar hari tersebut)</div>' +
            '<div style="display:flex; gap:6px; align-items:center;">' +
                '<input type="text" id="input-tambah-kelas-jadwal" placeholder="Nama kelas baru..." style="padding:5px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; width:145px;">' +
                '<button type="button" class="jadwal-act-btn primary" style="padding:5px 10px; font-size:11px;" onclick="window.tambahKelasJadwalSaya()">+ Kelas</button>' +
                '<button type="button" class="jadwal-act-btn neutral" style="padding:5px 10px; font-size:11px;" onclick="window.toggleEditorJadwalSaya()">Selesai</button>' +
            '</div>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
            '<table class="excel-table" style="width:100%; min-width:740px; font-size:12px;">' +
                '<thead><tr><th style="background:#334155;">Kelas</th><th style="text-align:center; background:#334155;">Senin</th><th style="text-align:center; background:#334155;">Selasa</th><th style="text-align:center; background:#334155;">Rabu</th><th style="text-align:center; background:#334155;">Kamis</th><th style="text-align:center; background:#334155;">Jumat</th><th style="width:45px; text-align:center; background:#334155;">Hapus</th></tr></thead>' +
                '<tbody>' + rowsHtml + '</tbody>' +
            '</table>' +
        '</div>';
};

window.ubahJpJadwalKelas = function(namaKelas, hariNum, jpVal) {
    let schedule = window.pastikanJamJadwalRencanaAda().teachingSchedule;
    if (!schedule[namaKelas]) schedule[namaKelas] = {};
    let jp = Math.max(0, Math.min(12, parseInt(jpVal, 10) || 0));
    if (jp > 0) schedule[namaKelas][hariNum] = jp;
    else delete schedule[namaKelas][hariNum];

    window.renderTabelRencanaPembelajaran();
    if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
};

window.ubahJamJadwalKelas = function(namaKelas, hariNum, jamVal, fromInlineToday) {
    let data = window.pastikanJamJadwalRencanaAda();
    if (!data.teachingHours[namaKelas]) data.teachingHours[namaKelas] = {};
    let bersih = String(jamVal || '').trim();
    if (bersih) data.teachingHours[namaKelas][hariNum] = bersih;
    else delete data.teachingHours[namaKelas][hariNum];

    let st = document.getElementById('status-sync-rencana');
    if (st) st.innerText = '✍️ Menyimpan jam...';

    clearTimeout(window._rencanaJamSaveTimer);
    window._rencanaJamSaveTimer = setTimeout(function() {
        if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
        if (!fromInlineToday) {
            window.renderTabelRencanaPembelajaran();
        }
        if (st) st.innerText = '✅ Jam tersimpan';
    }, fromInlineToday ? 500 : 80);
};

window.tambahKelasJadwalSaya = function() {
    let inp = document.getElementById('input-tambah-kelas-jadwal');
    let nama = inp ? inp.value.trim() : '';
    if (!nama) return;
    let schedule = window.pastikanJamJadwalRencanaAda().teachingSchedule;
    if (!schedule[nama]) schedule[nama] = {};
    if (inp) inp.value = '';
    window.renderEditorJadwalSaya();
    window.renderTabelRencanaPembelajaran();
    if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
};

window.hapusKelasJadwalSaya = function(namaKelas) {
    let data = window.pastikanJamJadwalRencanaAda();
    delete data.teachingSchedule[namaKelas];
    if (data.teachingHours) delete data.teachingHours[namaKelas];
    window.renderEditorJadwalSaya();
    window.renderTabelRencanaPembelajaran();
    if (typeof window.simpanJadwalKalenderKeDB === 'function') window.simpanJadwalKalenderKeDB();
};

// Klik di Catatan Guru / Catatan Kelas selalu mengangkatnya ke atas jika ada beberapa catatan terbuka
document.addEventListener('pointerdown', function(e) {
    let cg = e.target && e.target.closest ? e.target.closest('.floating-cg') : null;
    if (cg && typeof window.angkatKeLapisanTeratas === 'function') {
        window.angkatKeLapisanTeratas(cg);
    }
}, true);
/* =========================================================================
   AGENDA MENGAJAR EDITABLE LANGSUNG (INLINE EDIT + AUTO-SAVE + SYNC RENCANA)
   ========================================================================= */
window._agendaInlineSaveTimer = null;
window._sedangPasangEditAgenda = false;

window.ambilKelasAktifAgenda = function() {
    let sel = document.getElementById('admin-select-kelas');
    if (sel && sel.value) return sel.value;
    return window.kelasAktifAdmin || '';
};

window.cariStoreAgendaAdmin = function(kls) {
    if (!kls) return null;
    let kandidatNama = ['adminAgendaData', 'agendaMengajarData', 'agendaData', 'dataAgendaAdmin'];
    for (let i = 0; i < kandidatNama.length; i++) {
        let obj = window[kandidatNama[i]];
        if (obj && typeof obj === 'object' && obj[kls]) {
            return { store: obj, key: kandidatNama[i] };
        }
    }
    let keysWin = Object.keys(window);
    for (let j = 0; j < keysWin.length; j++) {
        let k = keysWin[j];
        if (/agenda/i.test(k) && typeof window[k] === 'object' && window[k] !== null && window[k][kls]) {
            return { store: window[k], key: k };
        }
    }
    return null;
};

window.simpanPerubahanAgendaKeServer = function() {
    let kandidatFn = [
        'simpanAgendaKeDB',
        'simpanAdminAgendaKeDB',
        'simpanAgendaAdminKeDB',
        'simpanAgendaMengajarKeDB',
        'simpanDataAgendaKeDB',
        'simpanAdministrasiKeDB'
    ];
    for (let i = 0; i < kandidatFn.length; i++) {
        if (typeof window[kandidatFn[i]] === 'function') {
            window[kandidatFn[i]]();
            return true;
        }
    }
    let foundFn = Object.keys(window).find(function(fnName) {
        return typeof window[fnName] === 'function' && /^simpan.*agenda/i.test(fnName);
    });
    if (foundFn) {
        window[foundFn]();
        return true;
    }
    return false;
};

window.simpanEditSelAgenda = function(rowIdx, field, newVal) {
    let kls = window.ambilKelasAktifAgenda();
    let info = window.cariStoreAgendaAdmin(kls);
    let statusEl = document.getElementById('status-edit-agenda-inline');

    if (!info || !info.store || !info.store[kls]) return;

    let rawList = info.store[kls];
    let targetObj = null;
    if (Array.isArray(rawList)) {
        targetObj = rawList[rowIdx];
    } else if (typeof rawList === 'object') {
        let keys = Object.keys(rawList);
        targetObj = rawList[rowIdx] || rawList[keys[rowIdx]];
    }
    if (!targetObj || typeof targetObj !== 'object') return;

    let valBersih = String(newVal || '').trim();
    if (field === 'tanggal') {
        if ('tgl' in targetObj && !('tanggal' in targetObj)) targetObj.tgl = valBersih;
        else targetObj.tanggal = valBersih;
    } else if (field === 'jp') {
        let numJp = parseInt(valBersih, 10);
        targetObj.jp = (!isNaN(numJp) && numJp > 0) ? numJp : 1;
    } else if (field === 'materi') {
        targetObj.materi = valBersih;
    } else if (field === 'keterangan') {
        if ('ket' in targetObj && !('keterangan' in targetObj)) targetObj.ket = valBersih;
        else targetObj.keterangan = valBersih;
    } else if (field === 'rencana') {
        if ('rencanaBerikutnya' in targetObj && !('rencana' in targetObj)) targetObj.rencanaBerikutnya = valBersih;
        else if ('rencana_berikutnya' in targetObj && !('rencana' in targetObj)) targetObj.rencana_berikutnya = valBersih;
        else targetObj.rencana = valBersih;
    }

    if (statusEl) {
        statusEl.style.color = '#d97706';
        statusEl.innerText = '✍️ Menyimpan perubahan...';
    }

    clearTimeout(window._agendaInlineSaveTimer);
    window._agendaInlineSaveTimer = setTimeout(function() {
        let saved = window.simpanPerubahanAgendaKeServer();
        if (typeof window.renderTabelRencanaPembelajaran === 'function') {
            window.renderTabelRencanaPembelajaran();
        }
        if (statusEl) {
            statusEl.style.color = saved ? '#16a34a' : '#0284c7';
            statusEl.innerText = saved ? '✅ Perubahan agenda tersimpan' : '✅ Diperbarui di sesi ini';
        }
    }, 450);
};

window.aktifkanEditInlineTabelAgenda = function() {
    let tbody = document.getElementById('body-agenda-mengajar');
    if (!tbody || window._sedangPasangEditAgenda) return;

    let rows = Array.from(tbody.querySelectorAll('tr'));
    if (rows.length === 0) return;

    window._sedangPasangEditAgenda = true;
    try {
        rows.forEach(function(tr, domIdx) {
            if (tr.getAttribute('data-agenda-editable') === '1') return;
            if (!tr.cells || tr.cells.length < 6) return;

            // Ambil indeks data asli dari tombol hapus di kolom Aksi agar tetap akurat meski urutan dibalik
            let dataIdx = domIdx;
            let delBtn = tr.cells[6] ? tr.cells[6].querySelector('[onclick]') : null;
            if (delBtn) {
                let oc = delBtn.getAttribute('onclick') || '';
                let m = oc.match(/\((\d+)/);
                if (m && m[1] !== undefined) dataIdx = parseInt(m[1], 10);
            }

            // 1. Kolom Tanggal -> input date
            let tdTgl = tr.cells[1];
            let tglVal = (tdTgl.innerText || '').trim();
            tdTgl.innerHTML = '';
            let inpTgl = document.createElement('input');
            inpTgl.type = 'date';
            inpTgl.className = 'agenda-inline-input agenda-inline-date';
            inpTgl.value = /^\d{4}-\d{2}-\d{2}$/.test(tglVal) ? tglVal : '';
            inpTgl.onchange = function() {
                window.simpanEditSelAgenda(dataIdx, 'tanggal', this.value);
            };
            tdTgl.appendChild(inpTgl);

            // 2. Kolom JP -> input number
            let tdJp = tr.cells[2];
            let jpVal = parseInt((tdJp.innerText || '').trim(), 10) || 1;
            tdJp.innerHTML = '';
            let inpJp = document.createElement('input');
            inpJp.type = 'number';
            inpJp.min = '1';
            inpJp.max = '12';
            inpJp.className = 'agenda-inline-input agenda-inline-jp';
            inpJp.value = String(jpVal);
            inpJp.oninput = function() {
                window.simpanEditSelAgenda(dataIdx, 'jp', this.value);
            };
            tdJp.appendChild(inpJp);

            // 3. Kolom Materi, Keterangan, & Rencana Berikutnya -> contenteditable langsung
            let petaTeks = [
                { cell: tr.cells[3], field: 'materi', extraCls: '' },
                { cell: tr.cells[4], field: 'keterangan', extraCls: '' },
                { cell: tr.cells[5], field: 'rencana', extraCls: ' is-rencana-col' }
            ];

            petaTeks.forEach(function(cfg) {
                let cell = cfg.cell;
                let isiAwal = (cell.innerText || '').trim();
                cell.className = (cell.className ? cell.className + ' ' : '') + 'agenda-inline-editable' + cfg.extraCls;
                cell.setAttribute('contenteditable', 'true');
                cell.setAttribute('spellcheck', 'false');
                cell.setAttribute('data-placeholder', 'Klik untuk mengisi...');
                cell.innerText = isiAwal;

                cell.addEventListener('input', function() {
                    window.simpanEditSelAgenda(dataIdx, cfg.field, cell.innerText);
                });
                cell.addEventListener('keydown', function(ev) {
                    if (ev.key === 'Enter' && !ev.shiftKey) {
                        ev.preventDefault();
                        cell.blur();
                    }
                });
            });

            tr.setAttribute('data-agenda-editable', '1');
        });
    } finally {
        window._sedangPasangEditAgenda = false;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    let tbody = document.getElementById('body-agenda-mengajar');
    if (tbody) {
        let obsAgenda = new MutationObserver(function() {
            if (!window._sedangPasangEditAgenda) {
                window.aktifkanEditInlineTabelAgenda();
            }
        });
        obsAgenda.observe(tbody, { childList: true });
        setTimeout(window.aktifkanEditInlineTabelAgenda, 500);
    }
});
/* =========================================================================
   SOFT UPDATE MANAGER (TIDAK MENGINTERUPSI SISWA SAAT BELAJAR / LATIHAN / UJIAN)
   - Menahan pembaruan Service Worker di latar belakang selama sesi aktif
   - Hanya menawarkan tombol "Perbarui" setelah siswa keluar dari Latihan/Ujian
   - Jika tidak diklik, versi baru otomatis aktif saat siswa membuka aplikasi lagi nanti
   ========================================================================= */
(function() {
    window._swPendingWorker = null;
    window._swUserApprovedReload = false;
    window._swUpdateDismissed = false;

    window.apakahPenggunaSedangSibukBelajar = function() {
        if (window.isStrictUjianActive) return true;
        let strictRoom = document.getElementById('ujian-strict-room');
        if (strictRoom && window.getComputedStyle(strictRoom).display !== 'none') return true;
        let tempRoom = document.getElementById('temporary-quiz-room');
        if (tempRoom && window.getComputedStyle(tempRoom).display !== 'none') return true;
        let mgModal = document.getElementById('modal-minigame-latihan');
        if (mgModal && window.getComputedStyle(mgModal).display !== 'none') return true;
        if (window.typingTimer) return true;
        return false;
    };

    window.sembunyikanBannerUpdateSantai = function() {
        let b = document.getElementById('soft-update-banner');
        if (b) b.remove();
    };

    window.tampilkanBannerUpdateSantai = function() {
        if (!window._swPendingWorker || window._swUpdateDismissed) return;
        if (window.apakahPenggunaSedangSibukBelajar()) {
            window.sembunyikanBannerUpdateSantai();
            return;
        }
        if (document.getElementById('soft-update-banner')) return;

        let bar = document.createElement('div');
        bar.id = 'soft-update-banner';
        bar.style.cssText = 'position:fixed; bottom:52px; left:50%; transform:translateX(-50%); z-index:9650; background:#0b3954; color:#ffffff; border:1.5px solid #38bdf8; border-radius:28px; padding:8px 14px; display:flex; align-items:center; gap:10px; box-shadow:0 8px 24px rgba(0,0,0,0.28); font-family:Poppins,sans-serif; font-size:12px; max-width:92vw;';
        bar.innerHTML =
            '<span style="font-weight:700;">✨ Pembaruan aplikasi siap dipasang</span>' +
            '<button type="button" onclick="window.terapkanUpdateAplikasiSekarang()" style="background:#22c55e; color:#ffffff; border:none; border-radius:16px; padding:5px 12px; font-weight:800; font-size:11.5px; cursor:pointer; white-space:nowrap;">🔄 Perbarui</button>' +
            '<button type="button" onclick="window._swUpdateDismissed=true; window.sembunyikanBannerUpdateSantai();" title="Update nanti setelah tutup aplikasi" style="background:transparent; color:#cbd5e1; border:none; font-size:14px; font-weight:800; cursor:pointer; padding:0 4px;">✕</button>';
        document.body.appendChild(bar);
    };

    window.terapkanUpdateAplikasiSekarang = function() {
        if (!window._swPendingWorker) {
            window.location.reload();
            return;
        }
        window._swUserApprovedReload = true;
        window.sembunyikanBannerUpdateSantai();
        try {
            window._swPendingWorker.postMessage({ type: 'APPLY_UPDATE_SAFE' });
        } catch (e) {
            window.location.reload();
        }
    };

    function tandaiWorkerMenunggu(worker) {
        if (!worker) return;
        window._swPendingWorker = worker;
        window._swUpdateDismissed = false;
        window.tampilkanBannerUpdateSantai();
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            // Hanya reload jika pengguna sendiri yang klik tombol "Perbarui"
            if (window._swUserApprovedReload && !window._swReloadingNow) {
                window._swReloadingNow = true;
                window.location.reload();
            }
        });

        window.addEventListener('load', function() {
            navigator.serviceWorker.getRegistration().then(function(reg) {
                if (!reg) return;
                if (reg.waiting) tandaiWorkerMenunggu(reg.waiting);

                reg.addEventListener('updatefound', function() {
                    let nw = reg.installing;
                    if (!nw) return;
                    nw.addEventListener('statechange', function() {
                        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                            tandaiWorkerMenunggu(nw);
                        }
                    });
                });
            }).catch(function() {});
        });

        // Pantau saat siswa keluar dari Ruang Latihan / Ruang Ujian -> baru tawarkan update
        document.addEventListener('DOMContentLoaded', function() {
            let strictRoom = document.getElementById('ujian-strict-room');
            if (strictRoom) {
                new MutationObserver(function() {
                    if (window.apakahPenggunaSedangSibukBelajar()) {
                        window.sembunyikanBannerUpdateSantai();
                    } else if (window._swPendingWorker && !window._swUpdateDismissed) {
                        setTimeout(window.tampilkanBannerUpdateSantai, 600);
                    }
                }).observe(strictRoom, { attributes: true, attributeFilter: ['style'] });
            }
        });
    }
})();