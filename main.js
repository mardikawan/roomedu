// Konfigurasi Parameter URL dan State Global
const urlParams = new URLSearchParams(window.location.search); 
window.babAktif = urlParams.get('bab') || "home"; let babAktif = window.babAktif;
if (urlParams.get('guru')) {
    sessionStorage.setItem("guruTarget", urlParams.get('guru').trim().toLowerCase());
}

// Listener Utama saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function() { 
    let status = sessionStorage.getItem("statusLogin");
    let btnLogin = document.getElementById('btn-login-utama');
    let btnLogout = document.getElementById('btn-logout-utama');
    
    // 1. Logika untuk Tamu (Belum Login)
    if(!status) {
        if(btnLogin) btnLogin.style.display = 'block';
        if(btnLogout) btnLogout.style.display = 'none';
    } else {
        // 2. Jika sudah login (Siswa atau Admin/Guru)
        if(btnLogin) btnLogin.style.display = 'none';
        if(btnLogout) btnLogout.style.display = 'block';
        
        document.body.classList.add('has-login'); 
        
        // 3. Logika Khusus Admin / Guru (Bisa Edit Ruang Kerjanya Sendiri)
        if(status === "admin") {
            let titleEl = document.getElementById('web-title');
            if(sessionStorage.getItem("previewMode") === "true") { 
                document.documentElement.classList.remove("force-edit-mode");
                if(titleEl) titleEl.removeAttribute('contenteditable');
            } else { 
                document.body.classList.add("mode-edit-aktif"); 
                document.documentElement.classList.add("force-edit-mode");
                if(titleEl) {
                    titleEl.setAttribute('contenteditable', 'true');
                    titleEl.addEventListener('blur', function() {
                        if(typeof window.simpanTema === "function") window.simpanTema();
                    });
                }
            }
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
window.renderDynamicNavbar = function() {
    window.pastikanRoomHiddenTerkunci();

    let container = document.getElementById("dynamic-pages-container");
    let navUl = document.getElementById("dynamic-navbar");
    if (!container || !navUl) return;

    let staticHomeLink = navUl.querySelector(':scope > li > a[href="index.html?bab=home"]');
    let hasDynamicHome = window.pagesData.some(function(p) { return p.slug === "home"; });
    if (staticHomeLink && staticHomeLink.parentElement) {
        staticHomeLink.parentElement.style.display = hasDynamicHome ? "none" : "";
        // Pasang pencegah refresh ke tombol HOME statis
        staticHomeLink.onclick = function(e) { window.navigasiHalaman(e, 'home'); };
    }
    
    // Pasang pencegah refresh ke Latihan dan Ujian jika mereka berupa link
    navUl.querySelectorAll(':scope > li > a').forEach(function(a) {
        let href = a.getAttribute('href');
        if(href && href.indexOf('index.html?bab=') === 0 && href !== 'index.html?bab=home') {
            let slug = href.split('=')[1];
            a.onclick = function(ev) { window.navigasiHalaman(ev, slug); };
        }
    });

    let rootNodes = [];
    let stack = [];

    window.pagesData.forEach(function(page, idx) {
        let node = {
            title: page.title, slug: page.slug, level: page.level, hidden: Boolean(page.hidden),
            isLockedHidden: Boolean(page.isLockedHidden), index: idx, children: [],
            effectiveHidden: Boolean(page.hidden) || Boolean(page.isLockedHidden)
        };

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

    function cetakMenuHTML(nodes, isSubMenu) {
        let html = "";
        nodes.forEach(function(node) {
            let hasChildren = node.children && node.children.length > 0;
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

            html += '<li class="' + liClasses.join(" ") + '" data-level="' + node.level + '">';
            // Integrasi Mesin SPA di Navbar
            html += '<a href="index.html?bab=' + encodeURIComponent(node.slug) + '" class="' + aClasses.join(" ") + '" onclick="window.navigasiHalaman(event, \'' + node.slug + '\')">';
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

// 6. Logika Buka-Tutup Sub-Menu 10 Tingkat (Hover Desktop & Klik Sentuh)
let navCloseTimer = null;

window.closeDropdowns = function() {
    document.querySelectorAll("#dynamic-navbar ul.sub-menu-nav.open-sub").forEach(function(ul) {
        ul.classList.remove("open-sub", "flyout-left", "align-right-edge");
    });
};

function aturPosisiSubMenu(ulElement) {
    if (!ulElement) return;
    ulElement.classList.add("open-sub");
    let parentLi = ulElement.parentElement;
    let isTopLevelDropdown = parentLi && parentLi.parentElement && (parentLi.parentElement.id === "dynamic-pages-container" || parentLi.parentElement.id === "dynamic-navbar");

    if (isTopLevelDropdown) {
        ulElement.classList.remove("align-right-edge");
        if (ulElement.getBoundingClientRect().right > window.innerWidth - 10) ulElement.classList.add("align-right-edge");
    } else {
        ulElement.classList.remove("flyout-left");
        if (ulElement.getBoundingClientRect().right > window.innerWidth - 10) ulElement.classList.add("flyout-left");
    }
}

function bukaJalurSubMenu(liElement) {
    if (!liElement) return;
    let activeUls = new Set();
    let curr = liElement;
    while (curr && curr.id !== "dynamic-navbar") {
        if (curr.tagName === "UL" && curr.classList.contains("sub-menu-nav")) activeUls.add(curr);
        curr = curr.parentElement;
    }
    let directSubUl = liElement.querySelector(":scope > ul.sub-menu-nav");
    if (directSubUl) activeUls.add(directSubUl);

    document.querySelectorAll("#dynamic-navbar ul.sub-menu-nav.open-sub").forEach(function(ul) {
        if (!activeUls.has(ul)) ul.classList.remove("open-sub", "flyout-left", "align-right-edge");
    });
    if (directSubUl) aturPosisiSubMenu(directSubUl);
}

document.addEventListener("mouseover", function(e) {
    if (window.innerWidth > 768) {
        let li = e.target.closest("#dynamic-navbar li");
        if (li) { clearTimeout(navCloseTimer); bukaJalurSubMenu(li); } 
        else if (!e.target.closest("#dynamic-navbar")) { clearTimeout(navCloseTimer); navCloseTimer = setTimeout(window.closeDropdowns, 220); }
    }
});

document.addEventListener("click", function(e) {
    if (window.innerWidth <= 768) {
        let a = e.target.closest("#dynamic-navbar a");
        if (a) {
            let li = a.parentElement;
            let directSubUl = li ? li.querySelector(":scope > ul.sub-menu-nav") : null;
            if (directSubUl && !directSubUl.classList.contains("open-sub")) {
                e.preventDefault(); bukaJalurSubMenu(li); return;
            }
        } else if (!e.target.closest("#dynamic-navbar")) { window.closeDropdowns(); }
    }
});

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

// Rekam seleksi teks & blok aktif secara otomatis setiap kali guru memblok teks
document.addEventListener("selectionchange", function() {
    let sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
        let range = sel.getRangeAt(0);
        let container = range.commonAncestorContainer;
        let el = container.nodeType === 3 ? container.parentNode : container;
        if (el && el.closest) {
            let editable = el.closest(".content-block, .fb-content, #popup-content-box");
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
    if (!a || !(a.classList.contains("content-block") || a.classList.contains("fb-content"))) {
        a = window.lastActiveEditable;
    }
    if (a && (a.classList.contains("content-block") || a.classList.contains("fb-content"))) {
        a.dispatchEvent(new Event("input", { bubbles: true })); 
    }
}

// Format Teks Utama (Bold, Italic, Underline, Superscript, Font, Style, Color, List, Align)
window.formatTeks = function(command, value = null) { 
    pastikanFokusEditor();

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

// Ukuran Font (10pt s/d 48pt)
window.aturUkuranFont = function(value) {
    pastikanFokusEditor();
    window.formatTeks("fontSize", value);
};

// Pengaturan Spasi & Jarak Paragraf
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
                container.style.marginBottom = "24px"; 
            } else if (cmd === "add-before") { 
                container.style.marginTop = "24px"; 
            } else if (cmd === "remove-space") { 
                container.style.marginTop = "0px"; 
                container.style.marginBottom = "0px"; 
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

window.renderBlocks = function() {
    let html = ''; 
    let isEdit = document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode');
    
    window.contentBlocksData.forEach(function(blok, index) {
        if (!blok.floatImages) blok.floatImages = [];

        // 1. TIPE BLOK SLIDE PDF (A4 LANDSCAPE + GESER KANAN KIRI + CORETAN PER SLIDE)
        if (blok.type === 'pdf_slides') {
            let slides = Array.isArray(blok.slides) ? blok.slides : [];
            let sIdx = typeof blok.activeSlide === 'number' ? blok.activeSlide : 0;
            if (sIdx < 0) sIdx = 0;
            if (sIdx >= slides.length) sIdx = Math.max(0, slides.length - 1);
            blok.activeSlide = sIdx;

            let curSlide = slides[sIdx] || { bg: '', drawing: '', floatImages: [] };
            let isFocus = (window.focusedPdfBlockIndex === index);

            let floatImgsHtml = window.renderFloatImagesHTML(index, sIdx, curSlide.floatImages || []);

            html += '<div class="block-wrapper ' + (blok.pattern||'') + (isFocus ? ' pdf-focus-fullscreen' : '') + '" data-index="' + index + '" style="background-color:' + (blok.bg||'#ffffff') + ';padding-top:' + (blok.padTop||'25px') + ';padding-bottom:' + (blok.padBot||'25px') + ';">' +
                '<div class="block-controls">' +
                    '<button onclick="geserBlok(' + index + ', -1)">⬆️</button>' +
                    '<button onclick="geserBlok(' + index + ', 1)">⬇️</button>' +
                    '<button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button>' +
                    '<button onclick="hapusBlok(' + index + ')">🗑️ Delete</button>' +
                '</div>' +
                '<div class="content-block pdf-landscape-block" data-index="' + index + '" data-block-type="pdf_slides">' +
                    '<div class="pdf-slide-nav-bar">' +
                        '<div style="display:flex; align-items:center; gap:8px;">' +
                            '<button onclick="window.gantiSlidePDF(' + index + ', -1)" ' + (sIdx <= 0 ? 'disabled' : '') + '>◀ Prev</button>' +
                            '<span style="font-weight:bold; color:#f1c40f; min-width:95px; text-align:center;">Halaman ' + (sIdx + 1) + ' / ' + slides.length + '</span>' +
                            '<button onclick="window.gantiSlidePDF(' + index + ', 1)" ' + (sIdx >= slides.length - 1 ? 'disabled' : '') + '>Next ▶</button>' +
                        '</div>' +
                        '<div style="font-weight:700; color:#ecf0f1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:260px;">📄 ' + (blok.title || 'Slide Materi PDF') + '</div>' +
                        '<div style="display:flex; align-items:center; gap:6px;">' +
                            '<button onclick="window.toggleDrawingMode()" style="background:#ffeaa7; color:#2c3e50; border-color:#fdcb6e;">🖍️ Draw</button>' +
                            '<button onclick="window.toggleFokusSlidePDF(' + index + ')" style="background:#2980b9;">' + (isFocus ? '🗗 Tutup Fokus' : '🔍 Mode Fokus') + '</button>' +
                            '<button onclick="window.exportSlidePDFKeA4(' + index + ')" style="background:#27ae60;">📥 Export PDF (A4)</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="pdf-slide-stage" data-index="' + index + '" data-slide-index="' + sIdx + '" onpointerdown="window.mulaiSwipeSlidePDF(event, ' + index + ')" onpointerup="window.akhirSwipeSlidePDF(event, ' + index + ')">' +
                        '<img class="pdf-slide-bg" src="' + (curSlide.bg || '') + '" alt="Slide PDF">' +
                        '<div class="draw-float-layer" data-index="' + index + '" data-slide-index="' + sIdx + '">' + floatImgsHtml + '</div>' +
                        '<canvas class="drawing-layer" data-index="' + index + '" data-slide-index="' + sIdx + '"></canvas>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }
        // 2. TIPE BLOK KUIS INLINE
        else if (blok.type === 'quiz') {
            let qi = '<div class="quiz-container" id="inline-kuis-' + index + '">' +
                    '<div class="quiz-header">' +
                        '<h3 class="quiz-title">🧩 Uji Pemahaman</h3>' +
                        '<div>' +
                            '<button class="btn-action" style="background:#34495e;width:auto;font-size:11px;padding:6px 12px;margin-right:5px;" onclick="cetakKuisPDF(\'inline-kuis-' + index + '\',\'Materi\')">🖨️ Cetak</button>' +
                            (isEdit ? '<button class="btn-action" style="background:#2e7d32;width:auto;font-size:11px;padding:6px 12px;" onclick="bukaAIQuizModal(' + index + ')">🤖 Ekstrak</button>' : '') +
                        '</div>' +
                    '</div>';
            
            if (blok.questions && blok.questions.length > 0) {
                blok.questions.forEach(function(q, qIdx) { 
                    let qTextHtml = isEdit 
                        ? '<div class="quiz-question-text" contenteditable="true" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'q\',this)">' + (qIdx+1) + '. ' + q.question + '</div>' 
                        : '<div class="quiz-question-text">' + (qIdx+1) + '. ' + q.question + '</div>';
                    qi += '<div class="quiz-question-card" id="inline-q-' + index + '-' + qIdx + '">' + (isEdit ? '<button class="btn-delete-q" onclick="hapusSoalSistem(' + qIdx + ', \'inline\', ' + index + ')" title="Hapus Soal">🗑️</button>' : '') + qTextHtml;
                    
                    if (q.type === 'short_answer' || (!q.options && q.correctAnswers)) {
                        let altStr = q.correctAnswers ? q.correctAnswers.join(' | ') : '';
                        qi += '<div class="short-answer-box" style="margin-top:10px;">' +
                            '<input type="text" class="input-box" placeholder="Ketik jawaban singkat..." style="font-size:15px; font-weight:600; padding:10px 12px; border:2px solid #3498db; border-radius:8px; width:100%; box-sizing:border-box;" oninput="jawabKuisInlineIsian(this, ' + index + ', ' + qIdx + ')">' +
                            (isEdit ? '<div style="font-size:11px; color:#c0392b; margin-top:8px; background:#fadbd8; padding:6px; border-radius:4px; border-left:4px solid #e74c3c;"><b>🔒 Info Admin:</b> Alternatif Kunci: ' + altStr + '</div>' : '') +
                        '</div>';
                    } else {
                        qi += '<div class="quiz-options">';
                        (q.options || []).forEach(function(opt, oIdx) { 
                            let optHtml = isEdit 
                                ? '<div class="quiz-option-btn" contenteditable="true" oninput="updateSoalInline(' + index + ',' + qIdx + ',\'o\',this,' + oIdx + ')">' + String.fromCharCode(65+oIdx) + '. ' + opt + '</div>' 
                                : '<button class="quiz-option-btn" onclick="jawabKuisInline(this,' + index + ',' + qIdx + ',' + oIdx + ',' + q.correctIndex + ')">' + String.fromCharCode(65+oIdx) + '. ' + opt + '</button>';
                            qi += optHtml; 
                        }); 
                        qi += '</div>';
                    }
                    qi += '<div class="quiz-explanation"><b>Pembahasan:</b> ' + (q.explanation || 'Tepat!') + '</div></div>'; 
                });
                qi += '<div class="quiz-nav-bar" style="margin-top:0;border-top:none;">'; 
                blok.questions.forEach(function(q, qIdx) {
                    qi += '<button class="quiz-nav-btn" id="nav-btn-inline-' + index + '-' + qIdx + '" onclick="document.querySelector(\'#inline-q-' + index + '-' + qIdx + '\').scrollIntoView({behavior:\'smooth\',block:\'center\'})">' + (qIdx+1) + '</button>';
                }); 
                qi += '</div>';
            } else {
                qi += '<p style="color:#888;">Belum ada soal.</p>'; 
            }
            qi += '</div>';
            
            let floatImgsQuiz = window.renderFloatImagesHTML(index, -1, blok.floatImages || []);
            html += '<div class="block-wrapper ' + (blok.pattern||'') + '" data-index="' + index + '" style="background-color:' + blok.bg + ';padding-top:' + blok.padTop + ';padding-bottom:' + blok.padBot + ';">' +
                '<div class="draw-float-layer" data-index="' + index + '">' + floatImgsQuiz + '</div>' +
                '<canvas class="drawing-layer" data-index="' + index + '"></canvas>' +
                '<div class="block-controls"><button onclick="geserBlok(' + index + ', -1)">⬆️</button><button onclick="geserBlok(' + index + ', 1)">⬇️</button><button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button><button onclick="hapusBlok(' + index + ')">🗑️ Delete</button></div>' +
                '<div class="content-block" data-index="' + index + '" data-width="' + blok.width + '">' +
                    qi +
                '</div>' +
            '</div>';
        }
        // 3. TIPE BLOK TEKS & TABEL (MAKSIMAL UKURAN KERTAS A4 PORTRAIT: 794px x 1123px)
        else {
            let floatImgsText = window.renderFloatImagesHTML(index, -1, blok.floatImages || []);
            html += '<div class="block-wrapper ' + (blok.pattern||'') + '" data-index="' + index + '" style="background-color:' + blok.bg + ';padding-top:' + blok.padTop + ';padding-bottom:' + blok.padBot + ';">' +
                '<div class="draw-float-layer" data-index="' + index + '">' + floatImgsText + '</div>' +
                '<canvas class="drawing-layer" data-index="' + index + '"></canvas>' +
                '<div class="block-controls"><button onclick="geserBlok(' + index + ', -1)">⬆️</button><button onclick="geserBlok(' + index + ', 1)">⬇️</button><button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button><button onclick="hapusBlok(' + index + ')">🗑️ Delete</button></div>' +
                '<div class="content-block a4-portrait-block" ' + (isEdit?'contenteditable="true"':'') + ' data-index="' + index + '" data-block-type="text" data-width="' + blok.width + '" style="color:' + blok.color + ';" onkeydown="window.cekBatasTinggiA4Keydown(event, this)" oninput="window.cekBatasTinggiA4Input(event, this)">' +
                    blok.html +
                '</div>' +
            '</div>';
        }
    }); 
    
    document.getElementById('blocks-container').innerHTML = html; 
    
    if(window.renderMathJax) window.renderMathJax();
    // AKTIFKAN KEMBALI SEMUA CORETAN KANVAS SETELAH REFRESH AGAR TETAP MUNCUL & BISA DIHAPUS/DILASO
    setTimeout(function() {
        if (typeof inisialisasiSemuaCanvas === 'function') inisialisasiSemuaCanvas();
    }, 180);
};

// Pengawas Batas Tinggi Kertas A4 Portrait (1123px) dengan Fitur Auto Page-Break (MS Word Style)
window.lastValidBlockHTML = {};

// Pengawas Batas Kertas A4 Portrait dengan Auto Page-Break (MS Word Style)
window.lastValidBlockHTML = {};

window.cekBatasTinggiA4Keydown = function(e, el) {
    let idx = parseInt(el.getAttribute('data-index'));
    
    // Auto Page-Break: Jika menekan Enter di dekat batas bawah halaman A4
    if (e.key === 'Enter' && el.scrollHeight >= 1060) {
        e.preventDefault(); 
        let nextIdx = idx + 1;
        let nextBlock = window.contentBlocksData[nextIdx];
        
        if (!nextBlock || nextBlock.type !== "text" || nextBlock.html.replace(/<[^>]*>?/gm, '').trim() !== "") {
            let newBlock = { type: "text", html: "<p><br></p>", bg: window.contentBlocksData[idx].bg || "#ffffff", pattern: "", color: "#333333", width: "M", padTop: "40px", padBot: "40px", drawing: "" };
            window.contentBlocksData.splice(nextIdx, 0, newBlock);
            window.renderBlocks();
        }

        setTimeout(function() {
            let nextBlockEl = document.querySelector('.content-block[data-index="' + nextIdx + '"]');
            if (nextBlockEl) {
                nextBlockEl.focus();
                let range = document.createRange();
                range.selectNodeContents(nextBlockEl);
                range.collapse(true);
                let sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }, 10);
        
        if (window.simpanKeDB) window.simpanKeDB();
    } else {
        if (el.scrollHeight <= 1123) {
            window.lastValidBlockHTML[idx] = el.innerHTML;
        }
    }
};

window.cekBatasTinggiA4Input = function(e, el) {
    let idx = parseInt(el.getAttribute('data-index'));
    
    // Jika ketikan meluap menabrak batas A4
    if (el.scrollHeight > 1123) {
        // 1. Kembalikan isi halaman ke detik sebelum huruf terakhir diketik
        if (window.lastValidBlockHTML[idx] !== undefined) {
            el.innerHTML = window.lastValidBlockHTML[idx];
        }
        
        // 2. Tangkap huruf terakhir yang memicu luapan
        let charTyped = e.data || "";
        let nextIdx = idx + 1;
        let nextBlock = window.contentBlocksData[nextIdx];
        
        // 3. Buat lembar A4 baru jika di bawahnya belum ada
        if (!nextBlock || nextBlock.type !== "text") {
            let newBlock = { type: "text", html: "<p><br></p>", bg: window.contentBlocksData[idx].bg || "#ffffff", pattern: "", color: "#333333", width: "M", padTop: "40px", padBot: "40px", drawing: "" };
            window.contentBlocksData.splice(nextIdx, 0, newBlock);
            window.renderBlocks();
        }
        
        // 4. Pindah kursor ke lembar baru & suntikkan huruf yang meluap tadi secara instan!
        setTimeout(function() {
            let nextEl = document.querySelector('.content-block[data-index="' + nextIdx + '"]');
            if (nextEl) {
                nextEl.focus();
                let range = document.createRange();
                range.selectNodeContents(nextEl);
                range.collapse(true); // Pindah ke baris paling awal
                let sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                
                if (charTyped) {
                    document.execCommand('insertText', false, charTyped);
                }
            }
        }, 10);
        
        if (window.simpanKeDB) window.simpanKeDB();
    } else {
        window.lastValidBlockHTML[idx] = el.innerHTML;
    }
};

/* =========================================
   FUNGSI BLOCK CONTROLS & SIDEBAR
   ========================================= */
let activeBlockIndex = -1;

window.tambahBlokBaruAkhir = function() { 
    window.contentBlocksData.push({type:'text',html:"<p>Ketik materi...</p>",bg:"#ffffff",pattern:"",color:"#333333",width:"M",padTop:"40px",padBot:"40px",drawing:""}); 
    window.renderBlocks(); 
    if(window.simpanKeDB) window.simpanKeDB(); 
    window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'}); 
}; 

window.hapusBlok = function(i) { 
    if(window.contentBlocksData.length <= 1) return alert("Minimal 1 block!"); 
    if(confirm("Hapus blok ini?")){ 
        window.contentBlocksData.splice(i,1); 
        window.renderBlocks(); 
        if(window.simpanKeDB) window.simpanKeDB(); 
    } 
}; 

window.geserBlok = function(i, dir) {
    if(i + dir >= 0 && i + dir < window.contentBlocksData.length) {
        let temp = window.contentBlocksData[i]; 
        window.contentBlocksData[i] = window.contentBlocksData[i+dir]; 
        window.contentBlocksData[i+dir] = temp;
        window.renderBlocks(); 
        if(window.simpanKeDB) window.simpanKeDB();
    }
};

window.bukaSidebarBlock = function(i) { 
    activeBlockIndex = i; 
    let b = window.contentBlocksData[i]; 
    document.querySelector('input[oninput*="padTop"]').value = parseInt(b.padTop); 
    document.getElementById('val-padtop').innerText = b.padTop; 
    document.querySelector('input[oninput*="padBot"]').value = parseInt(b.padBot); 
    document.getElementById('val-padbot').innerText = b.padBot; 
    document.getElementById('sidebar-block').classList.add('open'); 
}; 

window.ubahStyleBlok = function(t, v) { 
    if(activeBlockIndex > -1) { 
        window.contentBlocksData[activeBlockIndex][t] = v; 
        let d = document.querySelector(`.content-block[data-index="${activeBlockIndex}"]`); 
        if(d) { 
            if(t === 'bg') d.parentElement.style.backgroundColor = v; 
            if(t === 'color') d.style.color = v; 
            if(t === 'width') d.setAttribute('data-width', v);
            if(t === 'padTop') d.parentElement.style.paddingTop = v;
            if(t === 'padBot') d.parentElement.style.paddingBottom = v;
        } 
        // Trigger simpan otomatis ada di event listener firebase
        triggerInput();
    } 
};

window.ubahPolaBkg = function(pola) {
    if(activeBlockIndex > -1){ 
        window.contentBlocksData[activeBlockIndex].pattern = pola;
        let wrap = document.querySelector(`.block-wrapper[data-index="${activeBlockIndex}"]`);
        if(wrap) {
            wrap.classList.remove('bg-pattern-lines', 'bg-pattern-grid', 'bg-pattern-dots');
            if(pola) wrap.classList.add(pola);
        }
        triggerInput();
    }
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

/* =========================================
   FUNGSI KONTROL MODAL & POPUP (AUTO TOP-LAYER)
   ========================================= */
window.topModalZIndex = 5100;

window.bukaModal = function(id) { 
    let el = document.getElementById(id);
    if (!el) return;
    window.topModalZIndex += 10;
    el.style.zIndex = window.topModalZIndex;
    el.style.display = 'flex'; 
};

window.tutupModal = function(id) { 
    let el = document.getElementById(id);
    if (el) el.style.display = 'none'; 
};

window.tutupModalHasilQuiz = function() { 
    let modal = document.getElementById('modal-quiz-result');
    if (modal) modal.style.display = 'none';
};

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
   SISTEM LOGIN 3 LAPIS (MULTI-GURU) & PREVIEW
   ========================================= */
window.prosesLoginSistem = function() {
    let rawUser = document.getElementById('input-username-login').value.trim();
    let userKey = rawUser.toLowerCase();
    let pass = document.getElementById('input-password-login').value;
    let btn = document.querySelector('#modal-login-sistem .btn-action');
    let oldText = btn.innerText;
    
    btn.innerText = "Memverifikasi...";
    btn.disabled = true;

    let emailTarget = "";
    let roleTarget = "";
    let guruTarget = "";

    // Pemetaan Username Lokal ke Email Firebase Auth
    if (userKey === "mahardika") {
        emailTarget = "mahardika@admin.com";
        roleTarget = "admin";
        guruTarget = "mahardika";
    } else if (userKey === "sbd") {
        emailTarget = "siswa@sbd.com";
        roleTarget = "siswa";
        guruTarget = sessionStorage.getItem("guruTarget") || "mahardika";
    } else {
        emailTarget = userKey + "@guru.com";
        roleTarget = "admin";
        guruTarget = userKey;
    }

    // Tembak ke Firebase Auth
    window.loginFirebase(emailTarget, pass, function() {
        sessionStorage.setItem("statusLogin", roleTarget);
        sessionStorage.setItem("username", userKey === "sbd" ? "SBD" : userKey);
        sessionStorage.setItem("guruTarget", guruTarget);
        
        if (roleTarget === "siswa") window.location.reload();
        else window.location.href = "index.html?guru=" + encodeURIComponent(guruTarget) + "&bab=home";
    }, function(err) {
        btn.innerText = oldText;
        btn.disabled = false;
        alert("❌ Akses Ditolak: Username atau Password salah!");
    });
};

window.prosesLogoutSistem = function() {
    if(confirm("Yakin ingin keluar?")) {
        let prevStatus = sessionStorage.getItem("statusLogin");
        let currentGuru = sessionStorage.getItem("guruTarget") || "mahardika";
        
        sessionStorage.removeItem("statusLogin");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("previewMode");

        window.logoutFirebase(function() {
            if (prevStatus === "admin" && currentGuru !== "mahardika") {
                window.location.href = "index.html?guru=" + encodeURIComponent(currentGuru) + "&bab=home";
            } else {
                window.location.reload();
            }
        });
    }
};

window.togglePreviewMode = function() { 
    const b = document.body, d = document.documentElement, btn = document.getElementById('btn-preview'); 
    if(b.classList.contains('mode-edit-aktif') || d.classList.contains('force-edit-mode')) { 
        b.classList.remove('mode-edit-aktif'); 
        d.classList.remove('force-edit-mode'); 
        sessionStorage.setItem("previewMode", "true"); 
        document.querySelectorAll('.content-block, .fb-content, .header-title').forEach(function(el) { el.removeAttribute('contenteditable'); }); 
        if(btn) { btn.innerHTML = "✏️ Back to Edit"; btn.style.background = "#27ae60"; }
        if(window.renderMathJax) window.renderMathJax(); 
    } else { 
        b.classList.add('mode-edit-aktif'); 
        d.classList.add('force-edit-mode'); 
        sessionStorage.removeItem("previewMode"); 
        document.querySelectorAll('.content-block, .fb-content, .header-title').forEach(function(el) { el.setAttribute('contenteditable', 'true'); }); 
        if(btn) { btn.innerHTML = "👁️ Preview as Student"; btn.style.background = "#e67e22"; }
        if(window.restoreMathJax) window.restoreMathJax(); 
    } 
    window.renderBlocks(); 
    if(window.renderFloatingBoxes) window.renderFloatingBoxes(); 
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

// Konversi File PDF Menjadi Blok Slide A4 Landscape Permanen (Tersimpan di Firebase & Tidak Rusak Saat Refresh)
window.prosesUploadPDFMateri = async function(input) {
    let file = input.files && input.files[0];
    if (!file) return;
    if (!window.pdfjsLib) {
        return alert("Mesin PDF.js sedang dimuat, silakan tunggu 2 detik lalu coba lagi.");
    }

    let st = document.getElementById('save-status-bar');
    if (st) st.innerHTML = "<span style='color:#f39c12; font-weight:bold;'>⏳ Mengonversi PDF ke Slide A4 Landscape...</span>";

    try {
        let arrayBuffer = await file.arrayBuffer();
        let pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let numPages = pdfDoc.numPages;
        let slidesArr = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            if (st) st.innerHTML = "<span style='color:#f39c12; font-weight:bold;'>⏳ Memproses Slide PDF " + pageNum + " / " + numPages + "...</span>";
            let page = await pdfDoc.getPage(pageNum);
            let unscaledViewport = page.getViewport({ scale: 1 });

            // Render ke kanvas A4 Landscape (1123 x 794 px) agar tajam & ringan di database
            let targetW = 1123;
            let targetH = 794;
            let scale = Math.min(targetW / unscaledViewport.width, targetH / unscaledViewport.height);
            let viewport = page.getViewport({ scale: scale });

            let offCanvas = document.createElement('canvas');
            offCanvas.width = targetW;
            offCanvas.height = targetH;
            let offCtx = offCanvas.getContext('2d');

            // Latar putih bersih A4 Landscape
            offCtx.fillStyle = '#ffffff';
            offCtx.fillRect(0, 0, targetW, targetH);

            // Posisikan halaman PDF tepat di tengah kertas A4 Landscape
            let offsetX = (targetW - viewport.width) / 2;
            let offsetY = (targetH - viewport.height) / 2;
            offCtx.save();
            offCtx.translate(offsetX, offsetY);
            await page.render({ canvasContext: offCtx, viewport: viewport }).promise;
            offCtx.restore();

            let dataUrl = offCanvas.toDataURL('image/jpeg', 0.78);
            slidesArr.push({
                bg: dataUrl,
                drawing: "",
                floatImages: []
            });
        }

        let pdfBlockObj = {
            type: 'pdf_slides',
            title: file.name.replace(/\.pdf$/i, ''),
            activeSlide: 0,
            slides: slidesArr,
            bg: '#ffffff',
            pattern: '',
            color: '#333333',
            width: 'L',
            padTop: '25px',
            padBot: '25px',
            drawing: '',
            floatImages: []
        };

        window.contentBlocksData.push(pdfBlockObj);
        window.renderBlocks();
        if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
        if (st) st.innerHTML = "<span style='color:#2ecc71; font-weight:bold;'>✓ " + numPages + " Slide PDF Berhasil Disimpan Permanen!</span>";
    } catch (err) {
        console.error("Gagal memproses PDF:", err);
        alert("Gagal memproses file PDF: " + err.message);
    }
    input.value = "";
};

// Konversi File PDF Menjadi Blok Slide A4 Landscape Permanen (Anti-Rusak Saat Refresh)
window.prosesUploadPDFMateri = async function(input) {
    let file = input.files && input.files[0];
    if (!file) return;
    if (!window.pdfjsLib) return alert("Mesin PDF.js sedang dimuat, silakan tunggu 2 detik lalu coba lagi.");

    let st = document.getElementById('save-status-bar');
    if (st) st.innerHTML = "<span style='color:#f39c12; font-weight:bold;'>⏳ Mengonversi PDF ke Slide A4 Landscape...</span>";

    try {
        let arrayBuffer = await file.arrayBuffer();
        let pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let numPages = pdfDoc.numPages;
        let slidesArr = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            if (st) st.innerHTML = "<span style='color:#f39c12; font-weight:bold;'>⏳ Memproses Slide " + pageNum + " / " + numPages + "...</span>";
            let page = await pdfDoc.getPage(pageNum);
            let unscaledViewport = page.getViewport({ scale: 1 });

            let targetW = 1123, targetH = 794;
            let scale = Math.min(targetW / unscaledViewport.width, targetH / unscaledViewport.height);
            let viewport = page.getViewport({ scale: scale });

            let offCanvas = document.createElement('canvas');
            offCanvas.width = targetW; offCanvas.height = targetH;
            let offCtx = offCanvas.getContext('2d');

            offCtx.fillStyle = '#ffffff'; offCtx.fillRect(0, 0, targetW, targetH);
            let offsetX = (targetW - viewport.width) / 2;
            let offsetY = (targetH - viewport.height) / 2;
            
            offCtx.save();
            offCtx.translate(offsetX, offsetY);
            await page.render({ canvasContext: offCtx, viewport: viewport }).promise;
            offCtx.restore();

            slidesArr.push({ bg: offCanvas.toDataURL('image/jpeg', 0.78), drawing: "", floatImages: [] });
        }

        let pdfBlockObj = {
            type: 'pdf_slides', title: file.name.replace(/\.pdf$/i, ''), activeSlide: 0, slides: slidesArr, bg: '#ffffff', pattern: '', color: '#333333', width: 'L', padTop: '25px', padBot: '25px', drawing: '', floatImages: []
        };

        window.contentBlocksData.push(pdfBlockObj);
        window.renderBlocks();
        if (typeof window.simpanKeDB === 'function') window.simpanKeDB();
        if (st) st.innerHTML = "<span style='color:#2ecc71; font-weight:bold;'>✓ PDF Berhasil Disimpan Permanen!</span>";
    } catch (err) {
        console.error("Gagal memproses PDF:", err); alert("Gagal memproses PDF: " + err.message);
    }
    input.value = "";
};

// Geser Halaman Slide PDF ke Kiri / Kanan (Menyimpan Coretan di Halaman Sebelumnya)
window.gantiSlidePDF = function(blockIdx, arah) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok || blok.type !== 'pdf_slides' || !Array.isArray(blok.slides)) return;

    // Pastikan coretan pada slide saat ini tersimpan sebelum berpindah slide
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

// Swipe Kiri / Kanan dengan Jari di luar Mode Menulis Pena
window.pdfSwipeStartX = null;
window.mulaiSwipeSlidePDF = function(e, blockIdx) {
    // KUNCI: Matikan total sensor geser halaman (swipe) saat Mode Draw aktif!
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

// Mode Fokus Slide PDF (Layar Penuh Khusus Mengajar)
window.toggleFokusSlidePDF = function(blockIdx) {
    if (window.focusedPdfBlockIndex === blockIdx) {
        window.focusedPdfBlockIndex = -1;
    } else {
        window.focusedPdfBlockIndex = blockIdx;
    }
    window.renderBlocks();
};

// Export Seluruh Slide PDF Beserta Coretan & Gambar Tempelan Menjadi PDF A4 Landscape
window.exportSlidePDFKeA4 = async function(blockIdx) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok || !Array.isArray(blok.slides) || blok.slides.length === 0) return;

    // Simpan coretan aktif terlebih dahulu
    let curCvs = document.querySelector('.drawing-layer[data-index="' + blockIdx + '"][data-slide-index="' + blok.activeSlide + '"]');
    if (curCvs && blok.slides[blok.activeSlide]) {
        blok.slides[blok.activeSlide].drawing = curCvs.toDataURL('image/png');
    }

    let st = document.getElementById('save-status-bar');
    if (st) st.innerHTML = "<span style='color:#f39c12;'>⏳ Menyiapkan Export PDF A4 Landscape...</span>";

    function loadImgAsync(src) {
        return new Promise(function(resolve) {
            if (!src) return resolve(null);
            let img = new Image();
            img.onload = function() { resolve(img); };
            img.onerror = function() { resolve(null); };
            img.src = src;
        });
    }

    let compositePages = [];
    for (let i = 0; i < blok.slides.length; i++) {
        let s = blok.slides[i];
        let c = document.createElement('canvas');
        c.width = 1123;
        c.height = 794;
        let ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1123, 794);

        let bgImg = await loadImgAsync(s.bg);
        if (bgImg) ctx.drawImage(bgImg, 0, 0, 1123, 794);

        // Gambar semua stiker/gambar bebas di atas slide
        let fImgs = s.floatImages || [];
        for (let j = 0; j < fImgs.length; j++) {
            let fi = fImgs[j];
            let im = await loadImgAsync(fi.src);
            if (im) {
                let px = (parseFloat(fi.xPct) || 10) / 100 * 1123;
                let py = (parseFloat(fi.yPct) || 10) / 100 * 794;
                let pw = (parseFloat(fi.wPct) || 25) / 100 * 1123;
                let ph = (parseFloat(fi.hPct) || 25) / 100 * 794;
                ctx.drawImage(im, px, py, pw, ph);
            }
        }

        // Gambar coretan pena/stabilo di atas slide
        let drawImg = await loadImgAsync(s.drawing);
        if (drawImg) ctx.drawImage(drawImg, 0, 0, 1123, 794);

        compositePages.push(c.toDataURL('image/jpeg', 0.9));
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

/* =========================================
   MESIN INDEXED-DB UNTUK FILE LOKAL (0% BEBAN FIREBASE)
   ========================================= */
window.initLocalDB = function() {
    return new Promise(function(resolve, reject) {
        let req = indexedDB.open("MahardikaLocalDB", 1);
        req.onupgradeneeded = function(e) {
            let db = e.target.result;
            if (!db.objectStoreNames.contains("mediaFiles")) {
                db.createObjectStore("mediaFiles", { keyPath: "id" });
            }
        };
        req.onsuccess = function(e) { resolve(e.target.result); };
        req.onerror = function(e) { reject(e); };
    });
};

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
    let link = document.getElementById("input-link-media").value.trim();

    if (!link) {
        return alert("⚠️ Silakan paste link video Google Drive atau YouTube terlebih dahulu!");
    }

    let finalUrl = "";
    let htmlSisipan = "";

    // 1. Ekstrak ID YouTube (Mencegah error "Video tidak tersedia")
    let ytMatch = link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    // 2. Ekstrak ID Google Drive
    let driveMatch = link.match(/\/d\/([a-zA-Z0-9_-]+)/) || link.match(/id=([a-zA-Z0-9_-]+)/);

    window.kembalikanSeleksiTeks();

    if (ytMatch) {
        let ytId = ytMatch[1];
        // Susun ulang URL embed murni YouTube tanpa cookie agar tampil rapi
        finalUrl = "https://www.youtube-nocookie.com/embed/" + ytId + "?rel=0&modestbranding=1&playsinline=1";
        
        htmlSisipan = '<div contenteditable="false" style="margin: 20px auto; border-radius: 8px; overflow: hidden; position: relative; width: 100%; max-width: 800px; aspect-ratio: 16/9; box-shadow:0 6px 15px rgba(0,0,0,0.15); background:black;">' +
            '<iframe src="' + finalUrl + '" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>' +
            '</div><p><br></p>';
            
    } else if (driveMatch) {
        let fileId = driveMatch[1];
        // Konversi link G-Drive menjadi Direct Stream Link untuk dimasukkan ke Tag <video> asli
        finalUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
        
        htmlSisipan = '<div contenteditable="false" style="margin: 20px auto; text-align: center; width: 100%; max-width: 800px;">' +
            '<video controls controlsList="nodownload" style="width: 100%; max-height: 550px; border-radius: 8px; box-shadow: 0 6px 15px rgba(0,0,0,0.15); background:black; outline:none;" preload="metadata">' +
            '<source src="' + finalUrl + '" type="video/mp4">' +
            'Browser Anda tidak mendukung tag video HTML5.' +
            '</video>' +
            '</div><p><br></p>';
            
    } else {
        return alert("❌ Format link tidak dikenali! Pastikan Anda memasukkan link YouTube atau Google Drive yang valid.");
    }

    window.formatTeks("insertHTML", htmlSisipan);
    window.tutupModal("modal-multimedia");
    document.getElementById("input-link-media").value = "";
    triggerInput();
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

        let qText = "";
        let opts = [];
        let correctIdx = 0;
        let correctAnsArr = [];
        let expl = "";
        let qType = "mc";

        lines.forEach(function(line) {
            let low = line.toLowerCase();
            if (low.indexOf("soal:") === 0) {
                qText = line.substring(5).trim();
            } else if (low.indexOf("tipe:") === 0) {
                let t = low.substring(5).trim();
                if (t === "is" || t === "isian singkat") qType = "short_answer";
            } else if (/^[a-eA-E][\.\)]/.test(line)) {
                opts.push(line.substring(2).trim());
            } else if (low.indexOf("kunci:") === 0) {
                let k = line.substring(6).trim();
                if (qType === "short_answer" || opts.length === 0) {
                    qType = "short_answer";
                    correctAnsArr = k.split("|").map(function(s) { return s.trim(); });
                } else {
                    let code = k.toUpperCase().charCodeAt(0) - 65;
                    if (code >= 0 && code < 10) correctIdx = code;
                }
            } else if (low.indexOf("pembahasan:") === 0) {
                expl = line.substring(11).trim();
            } else if (!qText && opts.length === 0) {
                qText = line.replace(/^\d+[\.\)]\s*/, "");
            }
        });

        if (qText) {
            if (qType === "short_answer" || opts.length === 0) {
                parsedQuestions.push({ type: "short_answer", question: qText, correctAnswers: correctAnsArr, explanation: expl });
            } else {
                parsedQuestions.push({ type: "mc", question: qText, options: opts, correctIndex: correctIdx, explanation: expl });
            }
        }
    });

    if (parsedQuestions.length === 0) return alert("Format soal tidak dikenali. Pastikan ada baris Soal:, opsi A. B., dan Kunci:.");

    if (!window.contentBlocksData[window.targetQuizBlockIndex].questions) {
        window.contentBlocksData[window.targetQuizBlockIndex].questions = [];
    }
    window.contentBlocksData[window.targetQuizBlockIndex].questions.push.apply(
        window.contentBlocksData[window.targetQuizBlockIndex].questions,
        parsedQuestions
    );

    window.tutupModal("modal-ai-quiz");
    window.renderBlocks();
    if (window.simpanKeDB) window.simpanKeDB();
};

window.jawabKuisInline = function(btnEl, blockIdx, qIdx, optIdx, correctIdx) {
    let card = document.getElementById("inline-q-" + blockIdx + "-" + qIdx);
    if (!card) return;
    let allBtns = card.querySelectorAll(".quiz-option-btn");
    allBtns.forEach(function(b, i) {
        b.disabled = true;
        if (i === correctIdx) b.classList.add("selected-correct");
        else if (i === optIdx) b.classList.add("selected-wrong");
    });
    let exp = card.querySelector(".quiz-explanation");
    if (exp) exp.style.display = "block";
    let navBtn = document.getElementById("nav-btn-inline-" + blockIdx + "-" + qIdx);
    if (navBtn) navBtn.classList.add("nav-answered");
};

window.jawabKuisInlineIsian = function(inputEl, blockIdx, qIdx) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok || !blok.questions || !blok.questions[qIdx]) return;
    let q = blok.questions[qIdx];
    let val = (inputEl.value || "").trim().toLowerCase();
    let kunciArr = (q.correctAnswers || []).map(function(k) { return k.toLowerCase().trim(); });
    let card = document.getElementById("inline-q-" + blockIdx + "-" + qIdx);
    let exp = card ? card.querySelector(".quiz-explanation") : null;

    if (kunciArr.indexOf(val) !== -1 && val !== "") {
        inputEl.style.borderColor = "#27ae60";
        inputEl.style.background = "#d4edda";
        if (exp) exp.style.display = "block";
    } else {
        inputEl.style.borderColor = "#3498db";
        inputEl.style.background = "#ffffff";
    }
};

window.updateSoalInline = function(blockIdx, qIdx, tipeField, el, optIdx) {
    let blok = window.contentBlocksData[blockIdx];
    if (!blok || !blok.questions || !blok.questions[qIdx]) return;
    let txt = el.innerText.trim();
    if (tipeField === "q") {
        blok.questions[qIdx].question = txt.replace(/^\d+\.\s*/, "");
    } else if (tipeField === "o" && typeof optIdx === "number") {
        blok.questions[qIdx].options[optIdx] = txt.replace(/^[A-Z]\.\s*/, "");
    }
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
    const reader = new FileReader();
    reader.onload = function(e) {
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
        }
        img.src = e.target.result;
    }
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

// Deteksi Paste Gambar di Editor
document.addEventListener('paste', function(e) {
    if(!document.body.classList.contains('mode-edit-aktif')) return;
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
});

/* =========================================
   PENCEGAHAN KECURANGAN (STRICT MODE)
   ========================================= */
document.addEventListener('contextmenu', e => { if(window.isStrictUjianActive) e.preventDefault(); });
document.addEventListener('copy', e => { if(window.isStrictUjianActive) { e.preventDefault(); alert("⚠️ Dilarang menyalin soal ujian!"); } });
document.addEventListener('cut', e => { if(window.isStrictUjianActive) e.preventDefault(); });
document.addEventListener('paste', e => { if(window.isStrictUjianActive) e.preventDefault(); });
document.addEventListener('selectstart', e => { if(window.isStrictUjianActive) e.preventDefault(); });

/* =========================================
   KONTROL GAMBAR DALAM BLOK (IMAGE SETTINGS)
   ========================================= */
window.selectedImg = null; 

document.addEventListener('click', e => { 
    if(window.isDrawingMode) return; 
    
    // Saat gambar di dalam blok diklik
    if(e.target.tagName === 'IMG' && (document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode')) && (e.target.closest('.content-block') || e.target.closest('.fb-content'))) { 
        document.querySelectorAll('.content-block img, .fb-content img').forEach(i => i.classList.remove('img-selected')); 
        e.target.classList.add('img-selected'); 
        window.selectedImg = e.target; 
        
        let r = document.createRange(); 
        r.selectNode(e.target); 
        let s = window.getSelection(); 
        s.removeAllRanges(); 
        s.addRange(r); 
        
        const c = document.getElementById('img-controls'); 
        const rect = window.selectedImg.getBoundingClientRect(); 
        if(c) {
            c.style.display = 'flex'; 
            c.style.top = (rect.top + window.scrollY - 35) + 'px'; 
            c.style.left = (rect.left + window.scrollX) + 'px'; 
        }
    } 
    // Saat klik di luar area gambar/kontrol
    else if(!e.target.closest('#img-controls') && e.type === 'click') { 
        if(window.selectedImg) window.selectedImg.classList.remove('img-selected'); 
        window.selectedImg = null; 
        let c = document.getElementById('img-controls');
        if(c) c.style.display = 'none'; 
    } 
}); 

// Hapus gambar menggunakan tombol Delete/Backspace
document.addEventListener('keydown', e => { 
    if((e.key === 'Delete' || e.key === 'Backspace') && window.selectedImg && !window.isDrawingMode) { 
        e.preventDefault(); 
        let p = window.selectedImg.closest('.content-block') || window.selectedImg.closest('.fb-content'); 
        window.selectedImg.remove(); 
        window.selectedImg = null; 
        let c = document.getElementById('img-controls');
        if(c) c.style.display = 'none'; 
        if(p) p.dispatchEvent(new Event('input', {bubbles: true})); 
    } 
}); 

window.alignGambar = function(p) { 
    if(window.selectedImg) { 
        window.selectedImg.style.display = 'block'; 
        window.selectedImg.style.margin = p === 'left' ? '15px auto 15px 0' : (p === 'right' ? '15px 0 15px auto' : '15px auto'); 
        triggerInput(); 
    } 
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
    
    // Bungkus dengan table-control-wrap yang contenteditable="false" agar bisa dihapus utuh via Backspace
    let html = '<div class="table-control-wrap" contenteditable="false">' +
               '<table class="interactive-table" contenteditable="true"><tbody>';
    
    for(let r = 0; r < rows; r++) {
        html += '<tr>';
        for(let c = 0; c < cols; c++) {
            let isHeader = (r === 0);
            let tag = isHeader ? 'th' : 'td';
            html += '<' + tag + '>' + (isHeader ? 'Header' : 'Isi Sel') + 
                    '<button type="button" class="tbl-btn-add tbl-add-col" contenteditable="false" onclick="window.tambahKolomTabel(this)" title="Tambah Kolom ke Kanan">+</button>' +
                    '<button type="button" class="tbl-btn-add tbl-add-row" contenteditable="false" onclick="window.tambahBarisTabel(this)" title="Tambah Baris ke Bawah">+</button>' +
                    '</' + tag + '>';
        }
        html += '</tr>';
    }
    html += '</tbody></table></div><p><br></p>';
    
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
        newCell.innerHTML = (isHeader ? 'Header Baru' : 'Isi Sel') + 
                            '<button type="button" class="tbl-btn-add tbl-add-col" contenteditable="false" onclick="window.tambahKolomTabel(this)" title="Tambah Kolom ke Kanan">+</button>' +
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
        newCell.innerHTML = 'Isi Sel' + 
                            '<button type="button" class="tbl-btn-add tbl-add-col" contenteditable="false" onclick="window.tambahKolomTabel(this)" title="Tambah Kolom ke Kanan">+</button>' +
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

document.addEventListener('click', e => { 
    if(window.isDrawingMode) return; 
    
    // Memunculkan menu kontrol saat klik sel tabel
    if((e.target.tagName === 'TD' || e.target.tagName === 'TH') && (document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode'))) { 
        window.activeTableCell = e.target; 
        const c = document.getElementById('tbl-controls');
        const rect = window.activeTableCell.getBoundingClientRect(); 
        if(c) {
            c.style.display = 'flex'; 
            c.style.top = (rect.top + window.scrollY - 35) + 'px'; 
            c.style.left = (rect.left + window.scrollX) + 'px'; 
        }
    } else if(!e.target.closest('#tbl-controls') && !e.target.closest('.mozello-toolbar')) { 
        let c = document.getElementById('tbl-controls');
        if(c) c.style.display = 'none'; 
        window.activeTableCell = null; 
    } 
}); 

window.warnaiSelTabel = function(w) { 
    if(window.activeTableCell) { 
        window.activeTableCell.style.backgroundColor = w; 
        triggerInput(); 
    } 
}; 
window.tambahBarisTabel = function() { 
    if(window.activeTableCell) { 
        let tr = window.activeTableCell.parentNode; 
        let cl = tr.cloneNode(true); 
        Array.from(cl.children).forEach(td => td.innerHTML = ""); 
        tr.parentNode.insertBefore(cl, tr.nextSibling); 
        triggerInput(); 
    } 
}; 
window.tambahKolomTabel = function() { 
    if(window.activeTableCell) { 
        let tb = window.activeTableCell.closest('table');
        let cI = window.activeTableCell.cellIndex; 
        Array.from(tb.rows).forEach(r => { let nC = r.insertCell(cI + 1); nC.innerHTML = ""; }); 
        triggerInput(); 
    } 
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

window.restoreMathJax = function() {
    if (typeof MathJax !== 'undefined' && MathJax.startup && MathJax.startup.document) { 
        MathJax.startup.document.state(0); 
        MathJax.startup.document.restore(); 
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

/* =========================================
   MODAL ALAT GAMBAR GOODNOTES (IPAD PALM REJECT, LASO COPY/RESIZE, LASER TETAP, & GAMBAR BEBAS)
   ========================================= */
window.isDrawingMode = false; 
let currentDrawCtx = null, isPenDown = false, activeTool = 'pen'; 
window.penSize = 4; window.penColor = '#e74c3c'; window.pencilOnly = true; 
window.shapeHoldTimer = null; window.isShapeRecognized = false;

let laserStrokes = [], currentLaserStroke = null;
let globalLaserCvs = document.getElementById('laser-canvas'); 
let globalLaserCtx = globalLaserCvs ? globalLaserCvs.getContext('2d') : null; 
let laserLastActiveTime = 0; 

let lassoPath = [], isFloating = false, lassoTargetCanvas = null, lassoSavedImageData = null, floatUI = null;
window.lassoClipboardDataUrl = null;

function updateToolbarPosition() {
    if(!window.isDrawingMode || !window.visualViewport) return;
    const tools = document.getElementById('pen-tools'); const vv = window.visualViewport;
    tools.style.position = 'fixed'; tools.style.top = '0px'; tools.style.left = '0px'; tools.style.width = window.innerWidth + 'px';
    tools.style.transform = 'translate(' + vv.offsetLeft + 'px, ' + vv.offsetTop + 'px) scale(' + (1 / vv.scale) + ')';
    tools.style.transformOrigin = 'top left';
}
if(window.visualViewport) { 
    window.visualViewport.addEventListener('scroll', updateToolbarPosition); 
    window.visualViewport.addEventListener('resize', updateToolbarPosition); 
}

// Helper mengambil dan menyimpan data coretan kanvas (mendukung blok biasa, slide PDF, & floating box)
window.ambilDataDrawingTarget = function(cvs) {
    let fbIdx = cvs.getAttribute('data-fb-index');
    let blockIdx = cvs.getAttribute('data-index');
    let slideIdx = cvs.getAttribute('data-slide-index');
    if (fbIdx !== null && window.floatingBoxesData[fbIdx]) {
        return window.floatingBoxesData[fbIdx].drawing || "";
    }
    if (blockIdx !== null && window.contentBlocksData[blockIdx]) {
        let blok = window.contentBlocksData[blockIdx];
        if (blok.type === 'pdf_slides' && slideIdx !== null && blok.slides && blok.slides[slideIdx]) {
            return blok.slides[slideIdx].drawing || "";
        }
        return blok.drawing || "";
    }
    return "";
};

window.simpanDataDrawingTarget = function(cvs, dataUrl) {
    let fbIdx = cvs.getAttribute('data-fb-index');
    let blockIdx = cvs.getAttribute('data-index');
    let slideIdx = cvs.getAttribute('data-slide-index');
    if (fbIdx !== null && window.floatingBoxesData[fbIdx]) {
        window.floatingBoxesData[fbIdx].drawing = dataUrl;
    } else if (blockIdx !== null && window.contentBlocksData[blockIdx]) {
        let blok = window.contentBlocksData[blockIdx];
        if (blok.type === 'pdf_slides' && slideIdx !== null && blok.slides && blok.slides[slideIdx]) {
            blok.slides[slideIdx].drawing = dataUrl;
        } else {
            blok.drawing = dataUrl;
        }
    }
};

window.toggleDrawingMode = function() { 
    window.isDrawingMode = !window.isDrawingMode; 
    if(window.isDrawingMode) {
        document.body.classList.add('drawing-mode-active'); 
        if (window.pencilOnly) document.body.classList.add('palm-reject-on');
        document.querySelectorAll('.content-block, .fb-content').forEach(function(el) { el.removeAttribute('contenteditable'); });
        inisialisasiSemuaCanvas(); resizeLaserCanvas(); 
        if(window.visualViewport) updateToolbarPosition();
    } else {
        document.body.classList.remove('drawing-mode-active', 'palm-reject-on'); 
        window.tutupMenuKonteksDraw();
        if(document.body.classList.contains('mode-edit-aktif')) { 
            document.querySelectorAll('.content-block.a4-portrait-block, .fb-content').forEach(function(el) { el.setAttribute('contenteditable','true'); }); 
        }
        stampLasso(); 
        if(window.simpanKeDB) window.simpanKeDB(); 
        let pt = document.getElementById('pen-tools');
        if(pt) pt.style.transform = 'none';
    } 
};

window.setDrawingTool = function(t) { 
    stampLasso(); 
    activeTool = t; 
    document.querySelectorAll('#pen-tools button.tool-btn').forEach(function(b) { b.classList.remove('active'); }); 
    let btn = document.getElementById('btn-'+t);
    if (btn) btn.classList.add('active'); 
};

window.setPenColor = function(c, btn) { 
    window.penColor = c; 
    document.querySelectorAll('.col-btn').forEach(function(b) { b.classList.remove('active'); }); 
    if(btn) btn.classList.add('active'); 
};

window.setPenSize = function(s, btn) { 
    window.penSize = s; 
    document.querySelectorAll('.sz-btn').forEach(function(b) { b.classList.remove('active'); }); 
    if(btn) btn.classList.add('active'); 
};

window.togglePalmReject = function(isActive) {
    window.pencilOnly = isActive;
    if (isActive) document.body.classList.add('palm-reject-on');
    else document.body.classList.remove('palm-reject-on');
};

window.clearSemuaCoretan = function() { 
    if(confirm("Hapus semua coretan di halaman ini?")) { 
        document.querySelectorAll('.drawing-layer').forEach(function(cvs) { 
            cvs.getContext('2d').clearRect(0,0,cvs.width,cvs.height); 
            window.simpanDataDrawingTarget(cvs, "");
        }); 
        if(window.simpanKeDB) window.simpanKeDB(); 
    } 
};

// Inisialisasi Kanvas Lintas Sesi (Tetap Bisa Dihapus & Dilaso Setelah Refresh)
function inisialisasiSemuaCanvas() {
    document.querySelectorAll('.drawing-layer').forEach(function(cvs) {
        inisialisasiSatuCanvas(cvs);
    });
}
window.inisialisasiSemuaCanvas = inisialisasiSemuaCanvas;

function inisialisasiSatuCanvas(cvs) { 
    let p = cvs.parentElement;
    if(!p) return; 
    let cw = p.clientWidth || p.offsetWidth;
    let ch = p.clientHeight || p.offsetHeight;
    if(cw === 0 || ch === 0) return; 

    let sv = window.ambilDataDrawingTarget(cvs);
    if(cvs.width !== cw || cvs.height !== ch || (!cvs.getAttribute('data-loaded') && sv)) { 
        cvs.width = cw;
        cvs.height = ch; 
        let ctx = cvs.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, cw, ch);
        if(sv) {
            let i = new Image();
            i.onload = function() {
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(i, 0, 0, cw, ch);
                cvs.setAttribute('data-loaded', 'true');
            };
            i.src = sv;
        } else {
            cvs.setAttribute('data-loaded', 'true');
        }
    } 
} 

function resizeLaserCanvas() { 
    if(globalLaserCvs) { globalLaserCvs.width = window.innerWidth; globalLaserCvs.height = window.innerHeight; } 
} 
window.addEventListener('resize', function() { setTimeout(inisialisasiSemuaCanvas, 250); resizeLaserCanvas(); stampLasso(); });

// Render Laser (Ukuran Mandiri Standar M = 6px, Tidak Dipengaruhi Ukuran Pena)
function renderLaser() { 
    if(!globalLaserCtx) return;
    globalLaserCtx.clearRect(0,0,globalLaserCvs.width,globalLaserCvs.height); 
    let now = Date.now(); let fadeStart = laserLastActiveTime + 900; 
    if (now > fadeStart && laserLastActiveTime > 0) { 
        let alpha = 1 - ((now - fadeStart) / 900); 
        if (alpha <= 0) { alpha = 0; laserStrokes = []; laserLastActiveTime = 0; } 
        globalLaserCtx.globalAlpha = alpha; 
    } else { globalLaserCtx.globalAlpha = 1; } 
    
    laserStrokes.forEach(function(s) { 
        if(s.points.length < 2) return; 
        globalLaserCtx.beginPath(); globalLaserCtx.moveTo(s.points[0].x,s.points[0].y); 
        for(let i=1; i<s.points.length; i++) globalLaserCtx.lineTo(s.points[i].x,s.points[i].y); 
        globalLaserCtx.lineCap = 'round'; globalLaserCtx.lineJoin = 'round'; 
        // Ukuran Laser berdiri sendiri (Standar M = 6px + efek pijar halus)
        globalLaserCtx.lineWidth = 6; 
        globalLaserCtx.strokeStyle = '#ff2e2e';
        globalLaserCtx.shadowColor = '#ff0000';
        globalLaserCtx.shadowBlur = 8;
        globalLaserCtx.stroke(); 
        globalLaserCtx.shadowBlur = 0;
    }); 
    requestAnimationFrame(renderLaser); 
} 
renderLaser();

// Deteksi Sentuhan iPad (Palm Rejection + Tekan Lama 1 Jari untuk Paste Gambar Bebas)
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

    // Jika menggunakan Apple Pencil: kunci layar agar tidak goyang saat menulis
    if (hasStylus) {
        clearTimeout(window.longPressDrawTimer);
        e.preventDefault();
        return;
    }

    // Jika menyentuh dengan 1 jari di iPad/Tablet: tahan 550ms untuk memunculkan menu Paste Gambar Bebas
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
        // Jika Palm Reject TIDAK aktif, maka 1 jari dipakai untuk menggambar
        if (!window.pencilOnly) {
            e.preventDefault();
        }
    } else {
        // Jika 2 jari (Pinch Zoom), batalkan timer tekan lama dan biarkan iPad melakukan zoom in/out
        clearTimeout(window.longPressDrawTimer);
    }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    // Jika jari bergeser (sedang scroll 1 jari atau zoom 2 jari), batalkan timer tekan lama
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

// Klik Kanan di Laptop saat Mode Draw untuk Paste Gambar Bebas
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

document.addEventListener('pointerdown', function(e) { 
    if (!e.target.closest('#draw-context-menu')) {
        window.tutupMenuKonteksDraw();
    }

    if(!window.isDrawingMode && e.target.tagName === 'IMG' && !e.target.closest('.draw-float-img-item') && !e.target.classList.contains('pdf-slide-bg') && (document.body.classList.contains('mode-edit-aktif') || document.documentElement.classList.contains('force-edit-mode'))) { 
        let i = e.target, sX = e.clientX, sW = i.offsetWidth; 
        function m(me) { i.style.width = (sW + (me.clientX - sX)) + 'px'; i.style.maxWidth = '100%'; } 
        function up() { 
            document.removeEventListener('pointermove', m); document.removeEventListener('pointerup', up); 
            let p = i.closest('.content-block') || i.closest('.fb-content'); 
            if(p) p.dispatchEvent(new Event('input', {bubbles: true})); 
        } 
        document.addEventListener('pointermove', m); document.addEventListener('pointerup', up); 
        e.preventDefault(); return; 
    } 
    
    if(!window.isDrawingMode) return;
    if (e.target.closest('#pen-tools') || e.target.closest('#draw-context-menu') || e.target.closest('.pdf-slide-nav-bar') || e.target.closest('.draw-float-img-item')) return;

    if (e.pointerType === 'touch') {
        if (window.pencilOnly || window.activeTouches > 1) {
            isPenDown = false;
            return;
        }
    }

    if(isFloating && floatUI) {
        if(e.target.closest('.lasso-float')) return;
        stampLasso();
    } 
    
    if(e.target.classList.contains('drawing-layer')) { 
        clearTimeout(window.longPressDrawTimer);
        isPenDown = true; window.isShapeRecognized = false; clearTimeout(window.shapeHoldTimer);
        
        if(activeTool === 'laser') { 
            laserLastActiveTime = Date.now(); 
            currentLaserStroke = {points: [{x: e.clientX, y: e.clientY}]}; 
            laserStrokes.push(currentLaserStroke); 
        } else { 
            let c = e.target;
            currentDrawCtx = c.getContext('2d', { willReadFrequently: true }); 
            let r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; 
            
            if(activeTool === 'lasso' || activeTool === 'lasso-box') { 
                currentDrawCtx.globalCompositeOperation = 'source-over';
                lassoTargetCanvas = c; lassoPath = [{x: x, y: y}]; 
                lassoSavedImageData = currentDrawCtx.getImageData(0,0,c.width,c.height); 
            } else if (activeTool === 'highlighter' || activeTool === 'line' || activeTool === 'pen') {
                currentDrawCtx.globalCompositeOperation = 'source-over';
                currentDrawCtx.strokeStyle = window.penColor;
                currentDrawCtx.lineWidth = window.penSize;
                window.drawSnapshot = currentDrawCtx.getImageData(0,0,c.width,c.height);
                window.drawPoints = [{x: x, y: y}];
                currentDrawCtx.beginPath(); currentDrawCtx.moveTo(x,y); 
                currentDrawCtx.lineCap = 'round'; currentDrawCtx.lineJoin = 'round'; 
            } else if(activeTool === 'eraser') { 
                currentDrawCtx.beginPath(); currentDrawCtx.moveTo(x,y); 
                currentDrawCtx.lineCap = 'round'; currentDrawCtx.lineJoin = 'round'; 
                currentDrawCtx.globalCompositeOperation = 'destination-out'; 
                currentDrawCtx.lineWidth = window.penSize * 5; 
                currentDrawCtx.strokeStyle = 'rgba(0,0,0,1)'; 
            } 
        } 
    } 
});

window.recognizeShape = function() {
    if(!isPenDown || !currentDrawCtx || window.isShapeRecognized || window.drawPoints.length < 10) return;
    let pts = window.drawPoints;
    let minX = pts[0].x, maxX = pts[0].x, minY = pts[0].y, maxY = pts[0].y;
    pts.forEach(function(p) { if(p.x < minX) minX = p.x; if(p.x > maxX) maxX = p.x; if(p.y < minY) minY = p.y; if(p.y > maxY) maxY = p.y; });
    
    let w = maxX - minX; let h = maxY - minY;
    let start = pts[0]; let end = pts[pts.length - 1];
    let dist = Math.hypot(end.x - start.x, end.y - start.y);
    
    currentDrawCtx.putImageData(window.drawSnapshot, 0, 0);
    currentDrawCtx.globalCompositeOperation = 'source-over';
    currentDrawCtx.beginPath();
    currentDrawCtx.strokeStyle = window.penColor;
    currentDrawCtx.lineWidth = window.penSize;
    
    if(dist < (Math.max(w,h) * 0.4)) { 
        let centerX = minX + (w/2); let centerY = minY + (h/2);
        if(Math.abs(w-h) < Math.max(w,h) * 0.3) {
            currentDrawCtx.arc(centerX, centerY, Math.max(w,h)/2, 0, 2 * Math.PI);
        } else {
            currentDrawCtx.rect(minX, minY, w, h);
        }
    } else {
        currentDrawCtx.moveTo(start.x, start.y);
        currentDrawCtx.lineTo(end.x, end.y);
    }
    currentDrawCtx.stroke();
    window.isShapeRecognized = true;
};

document.addEventListener('pointermove', function(e) { 
    if(!window.isDrawingMode || !isPenDown) return; 
    if(e.pointerType === 'touch' && (window.pencilOnly || window.activeTouches > 1)) { isPenDown = false; return; }

    if(activeTool === 'laser' && currentLaserStroke) { 
        laserLastActiveTime = Date.now(); currentLaserStroke.points.push({x: e.clientX, y: e.clientY}); 
    } else if(currentDrawCtx) { 
        let r = currentDrawCtx.canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; 
        
        if(activeTool === 'lasso') { 
            lassoPath.push({x: x, y: y}); currentDrawCtx.putImageData(lassoSavedImageData,0,0); 
            currentDrawCtx.beginPath(); currentDrawCtx.moveTo(lassoPath[0].x,lassoPath[0].y); 
            for(let i=1; i<lassoPath.length; i++) currentDrawCtx.lineTo(lassoPath[i].x,lassoPath[i].y); 
            currentDrawCtx.strokeStyle = '#3498db'; currentDrawCtx.lineWidth = 1.5; currentDrawCtx.setLineDash([5,5]); currentDrawCtx.stroke(); currentDrawCtx.setLineDash([]); 
        } else if (activeTool === 'lasso-box') {
            lassoPath[1] = {x: x, y: y}; currentDrawCtx.putImageData(lassoSavedImageData,0,0); 
            currentDrawCtx.beginPath();
            let startX = lassoPath[0].x, startY = lassoPath[0].y;
            currentDrawCtx.rect(startX, startY, x - startX, y - startY);
            currentDrawCtx.strokeStyle = '#3498db'; currentDrawCtx.lineWidth = 1.5; currentDrawCtx.setLineDash([5,5]); currentDrawCtx.stroke(); currentDrawCtx.setLineDash([]); 
        } else if(activeTool === 'highlighter') {
            window.drawPoints.push({x: x, y: y}); currentDrawCtx.putImageData(window.drawSnapshot,0,0); currentDrawCtx.beginPath(); currentDrawCtx.moveTo(window.drawPoints[0].x, window.drawPoints[0].y);
            for(let i=1; i<window.drawPoints.length; i++) currentDrawCtx.lineTo(window.drawPoints[i].x, window.drawPoints[i].y);
            currentDrawCtx.globalAlpha = 0.38; currentDrawCtx.strokeStyle = window.penColor; currentDrawCtx.lineWidth = window.penSize * 4; currentDrawCtx.stroke(); currentDrawCtx.globalAlpha = 1.0;
        } else if(activeTool === 'line') {
            currentDrawCtx.putImageData(window.drawSnapshot,0,0); currentDrawCtx.beginPath(); currentDrawCtx.moveTo(window.drawPoints[0].x, window.drawPoints[0].y); currentDrawCtx.lineTo(x, y);
            currentDrawCtx.strokeStyle = window.penColor; currentDrawCtx.lineWidth = window.penSize; currentDrawCtx.stroke();
        } else if(activeTool === 'pen') {
            if(!window.isShapeRecognized) {
                currentDrawCtx.strokeStyle = window.penColor;
                currentDrawCtx.lineWidth = window.penSize;
                window.drawPoints.push({x: x, y: y}); currentDrawCtx.lineTo(x,y); currentDrawCtx.stroke(); 
                clearTimeout(window.shapeHoldTimer); window.shapeHoldTimer = setTimeout(window.recognizeShape, 650);
            }
        } else if (activeTool === 'eraser') { 
            currentDrawCtx.lineTo(x,y); currentDrawCtx.stroke(); 
        } 
    } 
});

document.addEventListener('pointerup', function() { 
    if(!window.isDrawingMode || !isPenDown) return; 
    isPenDown = false; clearTimeout(window.shapeHoldTimer);
    if(isFloating) return; 
    
    if(activeTool === 'laser' && currentLaserStroke) { 
        laserLastActiveTime = Date.now(); currentLaserStroke = null; 
    } else if((activeTool === 'lasso' || activeTool === 'lasso-box') && currentDrawCtx && lassoPath.length > 0) { 
        currentDrawCtx.putImageData(lassoSavedImageData,0,0); 
        
        // Konversi kotak laso menjadi 4 titik sudut agar mesin laso utama bisa memotongnya
        if (activeTool === 'lasso-box' && lassoPath[1]) {
            let sx = lassoPath[0].x, sy = lassoPath[0].y;
            let ex = lassoPath[1].x, ey = lassoPath[1].y;
            lassoPath = [
                {x: sx, y: sy}, {x: ex, y: sy}, {x: ex, y: ey}, {x: sx, y: ey}
            ];
        }
        
        if (lassoPath.length > 2) {
            createFloatingLasso(currentDrawCtx.canvas); 
        }
    } else if(activeTool !== 'laser' && activeTool !== 'lasso' && activeTool !== 'lasso-box' && currentDrawCtx) { 
        currentDrawCtx.globalCompositeOperation = 'source-over';
        let dataToSave = currentDrawCtx.canvas.toDataURL("image/png");
        window.simpanDataDrawingTarget(currentDrawCtx.canvas, dataToSave);
        
        let st = document.getElementById('save-status-bar');
        if(st) st.innerHTML = "<span style='color:#e67e22;'>✍️ Saving Draw...</span>"; 
        if(window.simpanKeDB) window.simpanKeDB();
    } 
    if(activeTool !== 'laser') currentDrawCtx = null; 
});

// --- FITUR LASO PRO (COPY, PASTE, RESIZE, HAPUS, & MATH AI) ---
function createFloatingLasso(cvs) { 
    let ctx = cvs.getContext('2d'), miX = cvs.width, miY = cvs.height, maX = 0, maY = 0; 
    lassoPath.forEach(function(p) { if(p.x < miX) miX = p.x; if(p.x > maX) maX = p.x; if(p.y < miY) miY = p.y; if(p.y > maY) maY = p.y; }); 
    let w = Math.round(maX - miX), h = Math.round(maY - miY);
    if(w < 8 || h < 8) return; 
    
    let tCvs = document.createElement('canvas'); tCvs.width = w; tCvs.height = h; tCvs.className = "lasso-float-canvas";
    let tCtx = tCvs.getContext('2d'); tCtx.beginPath(); 
    lassoPath.forEach(function(p,i) { if (i === 0) tCtx.moveTo(p.x - miX, p.y - miY); else tCtx.lineTo(p.x - miX, p.y - miY); }); 
    tCtx.closePath(); tCtx.clip(); tCtx.drawImage(cvs, -miX, -miY); 
    
    // Hapus area asal yang dipotong laso
    ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); 
    lassoPath.forEach(function(p,i) { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.closePath(); ctx.fill(); 
    ctx.globalCompositeOperation = 'source-over'; 
    
    window.bangunElemenLassoFloat(cvs, tCvs, miX, miY, w, h);
    lassoPath = []; 
}

window.bangunElemenLassoFloat = function(targetCvs, sourceCanvas, localX, localY, w, h) {
    stampLasso();
    lassoTargetCanvas = targetCvs;
    floatUI = document.createElement('div');
    floatUI.className = 'lasso-float';
    floatUI.appendChild(sourceCanvas);

    // Gagang Resize di Sudut Kanan Bawah Laso
    let resizeHandle = document.createElement('div');
    resizeHandle.className = 'lasso-resize-handle';
    resizeHandle.title = 'Tarik untuk mengubah ukuran (Resize)';
    floatUI.appendChild(resizeHandle);

    // Bar Tombol Laso: Copy, Paste, Hapus, Math
    let btnBar = document.createElement('div');
    btnBar.className = 'lasso-btn-bar';
    btnBar.innerHTML = '<button onclick="window.copySelectionLasso()" title="Salin Coretan">📋 Copy</button>' +
        '<button onclick="window.pasteSelectionLasso()" title="Gandakan Coretan">📥 Paste</button>' +
        '<button onclick="window.hapusSelectionLasso()" style="background:#e74c3c;" title="Hapus Coretan">🗑️ Hapus</button>' +
        '<button onclick="window.convertLassoToMath()" style="background:#8e44ad;" title="Ubah ke Rumus">∑ Math</button>';
    floatUI.appendChild(btnBar);

    let r = targetCvs.getBoundingClientRect();
    floatUI.style.width = w + 'px';
    floatUI.style.height = h + 'px';
    floatUI.style.left = (r.left + localX + window.scrollX) + 'px';
    floatUI.style.top = (r.top + localY + window.scrollY) + 'px';

    // Logika Geser (Drag) Kotak Laso
    let isDraggingFloat = false, sX, sY, sL, sT;
    sourceCanvas.addEventListener('pointerdown', function(e) {
        e.stopPropagation(); e.preventDefault();
        isDraggingFloat = true; sX = e.clientX; sY = e.clientY;
        sL = parseFloat(floatUI.style.left) || 0; sT = parseFloat(floatUI.style.top) || 0;
        sourceCanvas.setPointerCapture(e.pointerId);
    });
    sourceCanvas.addEventListener('pointermove', function(e) {
        if(!isDraggingFloat) return; e.stopPropagation(); e.preventDefault();
        floatUI.style.left = (sL + (e.clientX - sX)) + 'px'; floatUI.style.top = (sT + (e.clientY - sY)) + 'px';
    });
    sourceCanvas.addEventListener('pointerup', function(e) {
        if(!isDraggingFloat) return; isDraggingFloat = false; sourceCanvas.releasePointerCapture(e.pointerId); e.stopPropagation(); e.preventDefault();
    });

    // Logika Resize Kotak Laso
    let isResizingLasso = false, rSX, rSY, rSW, rSH;
    resizeHandle.addEventListener('pointerdown', function(e) {
        e.stopPropagation(); e.preventDefault();
        isResizingLasso = true; rSX = e.clientX; rSY = e.clientY;
        rSW = parseFloat(floatUI.style.width) || w;
        rSH = parseFloat(floatUI.style.height) || h;
        resizeHandle.setPointerCapture(e.pointerId);
    });
    resizeHandle.addEventListener('pointermove', function(e) {
        if (!isResizingLasso) return; e.stopPropagation(); e.preventDefault();
        let newW = Math.max(25, rSW + (e.clientX - rSX));
        let newH = Math.max(25, rSH + (e.clientY - rSY));
        floatUI.style.width = newW + 'px';
        floatUI.style.height = newH + 'px';
    });
    resizeHandle.addEventListener('pointerup', function(e) {
        if (!isResizingLasso) return;
        isResizingLasso = false;
        resizeHandle.releasePointerCapture(e.pointerId);
        e.stopPropagation(); e.preventDefault();
    });

    document.body.appendChild(floatUI);
    isFloating = true;
};

window.copySelectionLasso = function() {
    if (!isFloating || !floatUI) return;
    let cvs = floatUI.querySelector('canvas');
    if (cvs) {
        window.lassoClipboardDataUrl = cvs.toDataURL('image/png');
        window.lassoClipboardW = parseFloat(floatUI.style.width) || cvs.width;
        window.lassoClipboardH = parseFloat(floatUI.style.height) || cvs.height;
        let st = document.getElementById('save-status-bar');
        if (st) st.innerHTML = "<span style='color:#2ecc71;'>📋 Coretan Laso Disalin!</span>";
    }
};

window.pasteSelectionLasso = function() {
    if (isFloating && floatUI && !window.lassoClipboardDataUrl) {
        window.copySelectionLasso();
    }
    if (!window.lassoClipboardDataUrl || !lassoTargetCanvas) return;
    let targetCvs = lassoTargetCanvas;
    stampLasso(); // Tempel potongan pertama terlebih dahulu

    let img = new Image();
    img.onload = function() {
        let newCvs = document.createElement('canvas');
        newCvs.width = img.width;
        newCvs.height = img.height;
        newCvs.className = 'lasso-float-canvas';
        newCvs.getContext('2d').drawImage(img, 0, 0);
        window.bangunElemenLassoFloat(targetCvs, newCvs, 40, 40, window.lassoClipboardW || img.width, window.lassoClipboardH || img.height);
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
        newCvs.getContext('2d').drawImage(img, 0, 0);
        let r = t.cvs.getBoundingClientRect();
        let lx = (t.xPct / 100) * r.width;
        let ly = (t.yPct / 100) * r.height;
        window.bangunElemenLassoFloat(t.cvs, newCvs, lx, ly, window.lassoClipboardW || img.width, window.lassoClipboardH || img.height);
    };
    img.src = window.lassoClipboardDataUrl;
};

window.hapusSelectionLasso = function() {
    if (!isFloating || !floatUI) return;
    floatUI.remove();
    floatUI = null;
    isFloating = false;
    if (lassoTargetCanvas) {
        window.simpanDataDrawingTarget(lassoTargetCanvas, lassoTargetCanvas.toDataURL('image/png'));
        if (window.simpanKeDB) window.simpanKeDB();
    }
};

function stampLasso() { 
    if(!isFloating || !floatUI || !lassoTargetCanvas) return; 
    let ctx = lassoTargetCanvas.getContext('2d');
    let cR = lassoTargetCanvas.getBoundingClientRect();
    let fR = floatUI.getBoundingClientRect(); 
    let targetW = parseFloat(floatUI.style.width) || fR.width;
    let targetH = parseFloat(floatUI.style.height) || fR.height;

    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(floatUI.querySelector('canvas'), fR.left - cR.left, fR.top - cR.top, targetW, targetH); 
    floatUI.remove(); floatUI = null; isFloating = false; 
    
    window.simpanDataDrawingTarget(lassoTargetCanvas, lassoTargetCanvas.toDataURL('image/png'));
    if(window.simpanKeDB) window.simpanKeDB(); 
}

window.convertLassoToMath = function() {
    if(!isFloating || !floatUI) return;
    let dummyMath = "$$ E = mc^2 $$<br>$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$";
    floatUI.remove(); floatUI = null; isFloating = false;
    let blockIdx = lassoTargetCanvas.getAttribute('data-index'); 
    if(blockIdx !== null && window.contentBlocksData[blockIdx] && window.contentBlocksData[blockIdx].type !== 'pdf_slides') {
        window.contentBlocksData[blockIdx].html += '<div style="position:relative; margin-top:20px; color:#2c3e50; font-weight:bold;"><b>AI Math Detected:</b><br>' + dummyMath + '</div>';
        window.simpanDataDrawingTarget(lassoTargetCanvas, lassoTargetCanvas.toDataURL('image/png'));
    }
    if(window.simpanKeDB) window.simpanKeDB();
    window.toggleDrawingMode(); 
    if(window.renderMathJax) setTimeout(window.renderMathJax, 500);
};

// --- FITUR PASTE GAMBAR BEBAS GESER (DRAGGABLE & RESIZABLE DI ATAS BLOK / SLIDE PDF) ---
window.renderFloatImagesHTML = function(blockIdx, slideIdx, arrImages) {
    if (!Array.isArray(arrImages) || arrImages.length === 0) return "";
    let html = "";
    arrImages.forEach(function(im, imgIdx) {
        html += '<div class="draw-float-img-item" style="left:' + (im.xPct||10) + '%; top:' + (im.yPct||10) + '%; width:' + (im.wPct||28) + '%; height:' + (im.hPct||28) + '%;" onpointerdown="window.mulaiDragFloatImg(event, ' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ', this)">' +
            '<button type="button" class="draw-float-img-del" onpointerdown="event.stopPropagation()" onclick="window.hapusFloatImg(' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ')">✕</button>' +
            '<img src="' + im.src + '" alt="Gambar Tempel">' +
            '<div class="draw-float-img-resize" onpointerdown="window.mulaiResizeFloatImg(event, ' + blockIdx + ', ' + slideIdx + ', ' + imgIdx + ', this.parentElement)"></div>' +
        '</div>';
    });
    return html;
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
        // Fallback jika iPad/Browser meminta pilih file langsung
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
    if (e.target.classList.contains('draw-float-img-del') || e.target.classList.contains('draw-float-img-resize')) return;
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
    let startX = e.clientX, startY = e.clientY;
    let arr = window.ambilArrayFloatImgTarget(blockIdx, slideIdx);
    if (!arr || !arr[imgIdx]) return;
    let initWPct = parseFloat(arr[imgIdx].wPct) || 25;
    let initHPct = parseFloat(arr[imgIdx].hPct) || 25;

    e.target.setPointerCapture(e.pointerId);
    function move(ev) {
        let dwPct = ((ev.clientX - startX) / pRect.width) * 100;
        let dhPct = ((ev.clientY - startY) / pRect.height) * 100;
        arr[imgIdx].wPct = Math.max(8, Math.min(95, initWPct + dwPct)).toFixed(2);
        arr[imgIdx].hPct = Math.max(8, Math.min(95, initHPct + dhPct)).toFixed(2);
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

// --- TOMBOL FULLSCREEN UNIVERSAL (KANAN BAWAH LAYAR) & CETAK MATERI A4 ---
window.isManualFullscreenLocked = false;

window.toggleUniversalFullscreen = function() {
    let btn = document.getElementById('btn-fullscreen-global');
    let elem = document.documentElement;
    let isCurrentlyFull = Boolean(document.fullscreenElement || document.webkitFullscreenElement || window.isManualFullscreenLocked);

    if (!isCurrentlyFull) {
        window.isManualFullscreenLocked = true;
        document.body.classList.add('ios-fullscreen-lock');
        if (btn) {
            btn.classList.add('is-fullscreen-active');
            btn.innerHTML = '🗗';
        }
        try {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(function() {});
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        } catch (e) {}
        window.scrollTo(0, 1);
    } else {
        window.isManualFullscreenLocked = false;
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

// Cetak Seluruh Content Block Materi Sesuai Ukuran Kertas A4
window.cetakMateriHalamanA4 = function() {
    window.print();
};

/* =========================================
   LOGIKA RUANG ADMINISTRASI GURU & KELOLA AKUN MULTI-GURU
   ========================================= */
window.bukaModalAdministrasi = function() {
    window.bukaModal('modal-administrasi');
    
    let username = (sessionStorage.getItem("username") || "mahardika").toLowerCase();
    let btnAkun = document.getElementById('btn-kelola-akun');
    let badgeGuru = document.getElementById('badge-ruang-guru-aktif');
    
    if (badgeGuru) {
        badgeGuru.innerText = "👤 Ruang Guru: " + username;
    }

    // Tombol Kelola Akun Guru HANYA muncul untuk pemilik utama (mahardika)
    if(username === "mahardika" && btnAkun) {
        btnAkun.style.display = 'block';
        window.renderDaftarAkunGuru();
    } else if(btnAkun) {
        btnAkun.style.display = 'none';
    }
};

window.bukaTabAdmin = function(tabId, btnElement) {
    document.querySelectorAll('.admin-tab-content').forEach(function(el) {
        el.style.display = 'none';
    });
    
    let targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.style.display = 'block';
    
    document.querySelectorAll('.tab-admin-btn').forEach(function(btn) {
        if(btn.id !== 'btn-kelola-akun') {
            btn.style.background = '#ffffff';
            btn.style.color = '#333';
            btn.style.border = '1px solid #ccc';
            btn.style.boxShadow = 'none';
        }
    });
    
    if(btnElement && btnElement.id !== 'btn-kelola-akun') {
        btnElement.style.background = '#0b3954';
        btnElement.style.color = 'white';
        btnElement.style.border = 'none';
    }

    if (tabId === 'tab-kelola-akun') {
        window.renderDaftarAkunGuru();
    }
};

// Fungsi Salin Link Siswa untuk Guru yang Sedang Login (atau dari Tabel Akun Guru)
window.salinLinkSiswaGuru = function(targetUsername) {
    let guruUser = (targetUsername || sessionStorage.getItem("username") || window.guruAktif || "mahardika").toLowerCase();
    let baseUrl = window.location.origin + window.location.pathname;
    let linkSiswa = guruUser === "mahardika"
        ? baseUrl + "?bab=home"
        : baseUrl + "?guru=" + encodeURIComponent(guruUser) + "&bab=home";

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(linkSiswa).then(function() {
            alert("🔗 Link Siswa berhasil disalin!\n\n" + linkSiswa + "\n\nBagikan link ini kepada siswa agar mereka langsung masuk ke ruang belajar \"" + guruUser + "\".");
        }).catch(function() {
            prompt("Salin link khusus siswa di bawah ini:", linkSiswa);
        });
    } else {
        prompt("Salin link khusus siswa di bawah ini:", linkSiswa);
    }
};

// Fungsi Simpan Akun Guru Baru (Khusus Super Admin Mahardika)
window.simpanAkunGuruBaru = function() {
    if (sessionStorage.getItem("username") !== "mahardika") return alert("Hanya Admin Utama yang dapat mengelola akun guru!");

    let nama = document.getElementById('input-guru-nama').value.trim();
    let userRaw = document.getElementById('input-guru-user').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    let pass = document.getElementById('input-guru-pass').value.trim();

    if (!nama || !userRaw || !pass) return alert("Nama Guru, Username, dan Password wajib diisi lengkap!");
    if (userRaw === "mahardika" || userRaw === "sbd") return alert("Username tersebut tidak bisa digunakan!");
    if (pass.length < 6) return alert("Password minimal 6 karakter untuk keamanan Firebase!");

    let emailBaru = userRaw + "@guru.com";
    let btn = document.querySelector('#tab-kelola-akun .btn-action');
    let oldText = btn.innerText;
    
    btn.innerText = "⏳ Mengamankan di Firebase...";
    btn.disabled = true;

    // Buat akun di Firebase Auth melalui Mesin Bayangan
    window.buatAkunAuthGuru(emailBaru, pass, function() {
        if (!window.daftarAkunGuru) window.daftarAkunGuru = {};
        window.daftarAkunGuru[userRaw] = {
            nama: nama, username: userRaw, password: pass, dibuat: new Date().toISOString()
        };

        document.getElementById('input-guru-nama').value = "";
        document.getElementById('input-guru-user').value = "";
        document.getElementById('input-guru-pass').value = "";

        window.renderDaftarAkunGuru();
        if (typeof window.simpanDaftarAkunGuruKeDB === "function") window.simpanDaftarAkunGuruKeDB();
        
        btn.innerText = oldText;
        btn.disabled = false;
        alert("✅ Akun guru berhasil dibuat dan dilindungi Firebase Auth tingkat tinggi!");
    }, function(err) {
        btn.innerText = oldText;
        btn.disabled = false;
        alert("❌ Gagal membuat akun: Username sudah dipakai atau koneksi terputus.");
    });
};

// Render Tabel Daftar Akun Guru
window.renderDaftarAkunGuru = function() {
    let tbody = document.getElementById('body-daftar-akun-guru');
    if (!tbody) return;

    let daftar = window.daftarAkunGuru || {};
    let keys = Object.keys(daftar).sort();

    if (keys.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#7f8c8d;">Belum ada akun guru tambahan yang terdaftar.</td></tr>';
        return;
    }

    let html = '';
    keys.forEach(function(uKey, idx) {
        let g = daftar[uKey];
        html += '<tr>' +
            '<td style="font-weight:bold; color:#7f8c8d;">' + (idx + 1) + '</td>' +
            '<td style="text-align:left; font-weight:bold; color:#2c3e50;">' + (g.nama || uKey) + '</td>' +
            '<td><span style="background:#eaf2f8; color:#2980b9; padding:3px 8px; border-radius:4px; font-weight:bold;">' + uKey + '</span></td>' +
            '<td style="font-family:monospace; font-weight:bold; color:#333;">' + (g.password || '') + '</td>' +
            '<td>' +
                '<div style="display:flex; gap:6px; justify-content:center;">' +
                    '<button style="background:#2980b9; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="window.salinLinkSiswaGuru(\'' + uKey + '\')">🔗 Link Siswa</button>' +
                    '<button style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="window.hapusAkunGuru(\'' + uKey + '\')">🗑️ Hapus</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    });

    tbody.innerHTML = html;
};

window.hapusAkunGuru = function(uKey) {
    if (!window.daftarAkunGuru || !window.daftarAkunGuru[uKey]) return;
    if (confirm('Hapus akses login untuk akun guru "' + uKey + '"?')) {
        delete window.daftarAkunGuru[uKey];
        window.renderDaftarAkunGuru();
        if (typeof window.simpanDaftarAkunGuruKeDB === "function") {
            window.simpanDaftarAkunGuruKeDB();
        }
    }
};

/* =========================================
   LOGIKA KELOLA KELAS & SISWA (ADMINISTRASI)
   ========================================= */
window.adminData = {}; // Format: { "X Dana": ["Ali", "Budi"], "X Sila": ["Cici"] }
window.kelasAktifAdmin = "";

window.renderAdminData = function() {
    let htmlDropdown = '<option value="">-- Pilih Kelas --</option>';
    let htmlListKelas = '';
    let totalSiswaSemua = 0;
    
    let kelasArray = Object.keys(window.adminData).sort();
    
    kelasArray.forEach(k => {
        let jml = window.adminData[k].length;
        totalSiswaSemua += jml;
        htmlDropdown += `<option value="${k}">${k}</option>`;
        
        let isAktif = (k === window.kelasAktifAdmin) ? 'background:#e8f4f8; border-color:#3498db; border-left:4px solid #2980b9;' : 'background:#f8f9fa; border-color:#eee;';
        htmlListKelas += `
            <li style="display:flex; justify-content:space-between; align-items:center; padding:10px 15px; border:1px solid transparent; border-radius:6px; cursor:pointer; transition:0.2s; ${isAktif}" onclick="pilihKelasAdmin('${k}')">
                <span style="font-weight:bold; color:#2c3e50;">🏫 ${k} <span style="font-size:11px; color:#7f8c8d; font-weight:normal;">(${jml} Siswa)</span></span>
                <button style="background:#fadbd8; border:none; color:#c0392b; border-radius:4px; padding:4px 8px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="hapusKelasAdmin('${k}', event)">🗑️ Hapus</button>
            </li>`;
    });
    
    document.getElementById('admin-select-kelas').innerHTML = htmlDropdown;
    if(window.kelasAktifAdmin) document.getElementById('admin-select-kelas').value = window.kelasAktifAdmin;
    
    document.getElementById('list-admin-kelas').innerHTML = htmlListKelas || '<p style="color:#7f8c8d; font-size:12px; text-align:center;">Belum ada kelas yang dibuat.</p>';
    document.getElementById('admin-info-total-siswa').innerText = totalSiswaSemua;
    
    window.renderListSiswaAdmin();
};

window.pilihKelasAdmin = function(namaKelas) {
    if(!namaKelas) return;
    window.kelasAktifAdmin = namaKelas;
    window.renderAdminData();
    if(typeof window.renderAbsensiAdmin === "function") window.renderAbsensiAdmin();
    if(typeof window.renderAgendaAdmin === "function") window.renderAgendaAdmin();
    if(typeof window.renderReminderAdmin === "function") window.renderReminderAdmin();
};

window.renderListSiswaAdmin = function() {
    let labelKelas = document.getElementById('label-kelas-aktif');
    let labelTotal = document.getElementById('label-total-siswa-kelas');
    let listSiswa = document.getElementById('list-admin-siswa');
    
    if(!window.kelasAktifAdmin || !window.adminData[window.kelasAktifAdmin]) {
        labelKelas.innerText = "Belum Dipilih"; labelKelas.style.color = "#e74c3c";
        labelTotal.innerText = "0";
        listSiswa.innerHTML = '<p style="color:#7f8c8d; font-size:12px; text-align:center; padding:20px; background:#f9f9f9; border-radius:6px;">Pilih kelas di sebelah kiri terlebih dahulu.</p>';
        return;
    }
    
    labelKelas.innerText = window.kelasAktifAdmin; labelKelas.style.color = "#2980b9";
    let siswaArr = window.adminData[window.kelasAktifAdmin];
    labelTotal.innerText = siswaArr.length;
    
    let htmlSiswa = '';
    siswaArr.sort().forEach((s, idx) => {
        htmlSiswa += `
            <li style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; border-bottom:1px dashed #eee; background:#fcfcfc;">
                <span style="font-size:13px; font-weight:bold; color:#333;"><span style="display:inline-block; width:20px; height:20px; background:#2c3e50; color:white; text-align:center; border-radius:50%; line-height:20px; font-size:10px; margin-right:10px;">${idx+1}</span> ${s}</span>
                <button style="background:none; color:#c0392b; border:none; font-size:11px; cursor:pointer; font-weight:bold;" onclick="hapusSiswaAdmin('${s}')">🗑️ Hapus</button>
            </li>`;
    });
    
    listSiswa.innerHTML = htmlSiswa || '<p style="color:#7f8c8d; font-size:12px; text-align:center;">Kelas ini masih kosong. Silakan input nama siswa di atas.</p>';
};

window.tambahKelasAdmin = function() {
    let input = document.getElementById('input-nama-kelas-baru');
    let val = input.value.trim();
    if(!val) return;
    if(window.adminData[val]) return alert("Nama kelas sudah ada!");
    
    window.adminData[val] = []; // Buat kelas dengan array siswa kosong
    window.kelasAktifAdmin = val;
    input.value = "";
    window.renderAdminData();
    if(typeof window.simpanAdminKeDB === "function") window.simpanAdminKeDB();
};

window.hapusKelasAdmin = function(namaKelas, e) {
    e.stopPropagation();
    if(confirm(`Yakin ingin menghapus kelas ${namaKelas} beserta seluruh siswanya?`)) {
        delete window.adminData[namaKelas];
        if(window.kelasAktifAdmin === namaKelas) window.kelasAktifAdmin = "";
        window.renderAdminData();
        if(typeof window.simpanAdminKeDB === "function") window.simpanAdminKeDB();
    }
};

window.tambahSiswaAdmin = function() {
    if(!window.kelasAktifAdmin) return alert("Pilih kelas di daftar sebelah kiri terlebih dahulu!");
    let input = document.getElementById('input-nama-siswa-massal');
    let val = input.value.trim();
    if(!val) return;
    
    let baris = val.split('\n');
    let adaSiswaBaru = false;
    baris.forEach(b => {
        let nama = b.trim();
        if(nama && !window.adminData[window.kelasAktifAdmin].includes(nama)) {
            window.adminData[window.kelasAktifAdmin].push(nama);
            adaSiswaBaru = true;
        }
    });
    
    if(adaSiswaBaru) {
        input.value = "";
        window.renderAdminData();
        if(typeof window.simpanAdminKeDB === "function") window.simpanAdminKeDB();
    } else {
        alert("Siswa tersebut sudah ada di kelas ini.");
    }
};

window.hapusSiswaAdmin = function(namaSiswa) {
    if(confirm(`Hapus ${namaSiswa} dari kelas ${window.kelasAktifAdmin}?`)) {
        window.adminData[window.kelasAktifAdmin] = window.adminData[window.kelasAktifAdmin].filter(s => s !== namaSiswa);
        window.renderAdminData();
        if(typeof window.simpanAdminKeDB === "function") window.simpanAdminKeDB();
    }
};

const modalAdminObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
        if(m.target.id === 'modal-administrasi' && m.target.style.display === 'flex') {
            window.renderAdminData();
            if(typeof window.renderAbsensiAdmin === "function") window.renderAbsensiAdmin();
            if(typeof window.renderAgendaAdmin === "function") window.renderAgendaAdmin();
            if(typeof window.renderReminderAdmin === "function") window.renderReminderAdmin();
        }
    });
});
modalAdminObserver.observe(document.getElementById('modal-administrasi'), { attributes: true, attributeFilter: ['style'] });

const modalManajerObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
        if(m.target.id === 'modal-manajer-ujian' && m.target.style.display === 'flex') {
            if(typeof window.renderManajerUjian === "function") window.renderManajerUjian();
        }
    });
});
if(document.getElementById('modal-manajer-ujian')) {
    modalManajerObserver.observe(document.getElementById('modal-manajer-ujian'), { attributes: true, attributeFilter: ['style'] });
}

/* =========================================
   LOGIKA ABSENSI SISWA (ADMINISTRASI)
   ========================================= */
window.adminAbsensiData = window.adminAbsensiData || {};
window.targetCatatanSiswa = { kls: "", nama: "" };

// Helper Tanggal Hari Ini (Format: DD/MM/YYYY)
window.getTanggalHariIniAbsen = function() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
};

// Pastikan Struktur Data Absensi & Catatan Siswa Siap
window.pastikanDataAbsensiKelas = function(kls) {
    if (!kls) return null;
    if (!window.adminAbsensiData[kls]) {
        window.adminAbsensiData[kls] = { tgl: [window.getTanggalHariIniAbsen()], status: {}, catatan: {} };
    }
    if (!Array.isArray(window.adminAbsensiData[kls].tgl)) {
        window.adminAbsensiData[kls].tgl = window.adminAbsensiData[kls].tgl ? Object.values(window.adminAbsensiData[kls].tgl) : [];
    }
    // Otomatis aktifkan minimal Pertemuan 1 jika kelas sudah memiliki siswa namun belum ada kolom pertemuan
    if (window.adminAbsensiData[kls].tgl.length === 0) {
        window.adminAbsensiData[kls].tgl.push(window.getTanggalHariIniAbsen());
    }
    if (!window.adminAbsensiData[kls].status) window.adminAbsensiData[kls].status = {};
    if (!window.adminAbsensiData[kls].catatan) window.adminAbsensiData[kls].catatan = {};

    let jmlPertemuan = window.adminAbsensiData[kls].tgl.length;
    let siswaArr = window.adminData[kls] || [];
    siswaArr.forEach(function(nama) {
        if (!Array.isArray(window.adminAbsensiData[kls].status[nama])) {
            window.adminAbsensiData[kls].status[nama] = window.adminAbsensiData[kls].status[nama]
                ? Object.values(window.adminAbsensiData[kls].status[nama])
                : [];
        }
        while (window.adminAbsensiData[kls].status[nama].length < jmlPertemuan) {
            window.adminAbsensiData[kls].status[nama].push('-');
        }
        if (!Array.isArray(window.adminAbsensiData[kls].catatan[nama])) {
            window.adminAbsensiData[kls].catatan[nama] = window.adminAbsensiData[kls].catatan[nama]
                ? Object.values(window.adminAbsensiData[kls].catatan[nama])
                : [];
        }
    });

    return window.adminAbsensiData[kls];
};

// 1. Fungsi Tambah Kolom Pertemuan Baru (Otomatis Tanggal Hari Ini & Auto-Scroll ke Kanan)
window.tambahPertemuanAbsensi = function() {
    let selKelas = document.getElementById('admin-select-kelas');
    let kls = (selKelas && selKelas.value) || window.kelasAktifAdmin;
    if (!kls) return alert("Pilih kelas terlebih dahulu!");

    let absData = window.pastikanDataAbsensiKelas(kls);
    absData.tgl.push(window.getTanggalHariIniAbsen());

    let siswaArr = window.adminData[kls] || [];
    siswaArr.forEach(function(nama) {
        if (!Array.isArray(absData.status[nama])) {
            absData.status[nama] = new Array(absData.tgl.length - 1).fill('-');
        }
        absData.status[nama].push('-');
    });

    window.renderAbsensiAdmin();
    if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();

    // Otomatis geser scroll ke kolom pertemuan paling kanan yang baru dibuat
    setTimeout(function() {
        let headTr = document.getElementById('head-absensi-pertemuan');
        let wrapScroll = headTr ? headTr.closest('div') : null;
        if (wrapScroll) {
            wrapScroll.scrollTo({ left: wrapScroll.scrollWidth, behavior: 'smooth' });
        }
    }, 60);
};

// 2. Fungsi Ubah Tanggal (Klik pada Header Pertemuan) & Hapus Pertemuan (Klik Kanan)
window.editTanggalAbsensi = function(pIndex) {
    let selKelas = document.getElementById('admin-select-kelas');
    let kls = (selKelas && selKelas.value) || window.kelasAktifAdmin;
    if (!kls || !window.adminAbsensiData[kls] || !window.adminAbsensiData[kls].tgl) return;

    let oldTgl = window.adminAbsensiData[kls].tgl[pIndex];
    let newTgl = prompt("Ubah tanggal Pertemuan " + (pIndex + 1) + " (ketik HAPUS jika ingin menghapus kolom pertemuan ini):", oldTgl);

    if (newTgl === null) return;
    let bersih = newTgl.trim();
    if (bersih.toUpperCase() === "HAPUS") {
        window.hapusPertemuanAbsensi(pIndex);
        return;
    }
    if (bersih !== "") {
        window.adminAbsensiData[kls].tgl[pIndex] = bersih;
        window.renderAbsensiAdmin();
        if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
    }
};

window.hapusPertemuanAbsensi = function(pIndex) {
    let selKelas = document.getElementById('admin-select-kelas');
    let kls = (selKelas && selKelas.value) || window.kelasAktifAdmin;
    if (!kls || !window.adminAbsensiData[kls] || !window.adminAbsensiData[kls].tgl) return;

    if (!confirm("Hapus kolom Pertemuan " + (pIndex + 1) + " (" + window.adminAbsensiData[kls].tgl[pIndex] + ")?")) return;

    window.adminAbsensiData[kls].tgl.splice(pIndex, 1);
    let statusMap = window.adminAbsensiData[kls].status || {};
    Object.keys(statusMap).forEach(function(nama) {
        if (Array.isArray(statusMap[nama])) {
            statusMap[nama].splice(pIndex, 1);
        }
    });

    window.renderAbsensiAdmin();
    if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
};

// 3. Fungsi Ganti Status Per Siswa (H / S / I / A)
window.toggleStatusAbsensi = function(kls, nama, pIndex, el) {
    let absData = window.pastikanDataAbsensiKelas(kls);
    if (!absData || !absData.status[nama]) return;

    let statArr = ['-', 'H', 'S', 'I', 'A'];
    let current = absData.status[nama][pIndex] || '-';
    let nextIdx = (statArr.indexOf(current) + 1) % statArr.length;
    let nextStat = statArr[nextIdx];

    absData.status[nama][pIndex] = nextStat;

    // Update visual sel secara instan
    let bgCol = nextStat === 'H' ? '#d5f5e3' : (nextStat === 'A' ? '#fadbd8' : (nextStat === 'S' ? '#fdebd0' : (nextStat === 'I' ? '#d6eaf8' : '#ffffff')));
    let txtCol = nextStat === 'H' ? '#1e8449' : (nextStat === 'A' ? '#c0392b' : (nextStat === 'S' ? '#d35400' : (nextStat === 'I' ? '#2980b9' : '#7f8c8d')));
    el.innerText = nextStat;
    el.style.background = bgCol;
    el.style.color = txtCol;

    let row = el.closest('tr');
    if (row) {
        let count = { H: 0, S: 0, I: 0, A: 0 };
        absData.status[nama].forEach(function(v) {
            if (count[v] !== undefined) count[v]++;
        });
        let cEls = row.querySelectorAll('.rekap-H, .rekap-S, .rekap-I, .rekap-A');
        if (cEls.length === 4) {
            cEls[0].innerText = count.H;
            cEls[1].innerText = count.S;
            cEls[2].innerText = count.I;
            cEls[3].innerText = count.A;
        }
    }

    clearTimeout(window.absenSaveTimer);
    window.absenSaveTimer = setTimeout(function() {
        if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
    }, 600);
};

// 4. Fungsi Cepat 1-Klik Hadir Semua
window.setSemuaHadirAbsensi = function(pIndex) {
    let selKelas = document.getElementById('admin-select-kelas');
    let kls = (selKelas && selKelas.value) || window.kelasAktifAdmin;
    if (!kls || !window.adminAbsensiData[kls] || !window.adminAbsensiData[kls].tgl) return;

    let tgl = window.adminAbsensiData[kls].tgl[pIndex];
    let siswaArr = window.adminData[kls] || [];
    if (siswaArr.length === 0) return;

    if (!confirm("Set status 'Hadir (H)' untuk SEMUA SISWA pada Pertemuan " + (pIndex + 1) + " (" + tgl + ")?")) return;

    let absData = window.pastikanDataAbsensiKelas(kls);
    siswaArr.forEach(function(nama) {
        absData.status[nama][pIndex] = 'H';
    });

    window.renderAbsensiAdmin();
    if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
};

// 5. Modal & Logika Catatan Siswa (Checklist Garis Tengah + Hapus)
window.pastikanModalCatatanSiswaAda = function() {
    if (document.getElementById('modal-catatan-siswa')) return;

    let modalEl = document.createElement('div');
    modalEl.id = 'modal-catatan-siswa';
    modalEl.className = 'modal-overlay';
    modalEl.onclick = function(e) {
        if (e.target === modalEl) window.tutupModal('modal-catatan-siswa');
    };

    modalEl.innerHTML =
        '<div class="modal-box" style="width: 460px; max-width: 94vw; max-height: 85vh; display: flex; flex-direction: column;">' +
            '<div class="modal-header" style="background:#fef9e7; border-bottom:1px solid #f9e79f; padding:14px 20px;">' +
                '<div>' +
                    '<h3 style="color:#d35400; margin:0; font-size:16px;">📝 Catatan Siswa</h3>' +
                    '<div id="subtitle-catatan-siswa" style="font-size:12px; color:#7f8c8d; font-weight:bold; margin-top:2px;"></div>' +
                '</div>' +
                '<button class="close-btn" onclick="window.tutupModal(\'modal-catatan-siswa\')">✕</button>' +
            '</div>' +
            '<div class="modal-body" style="padding:18px; display:flex; flex-direction:column; gap:12px; flex:1; overflow-y:auto;">' +
                '<div style="display:flex; gap:8px;">' +
                    '<input type="text" id="input-catatan-siswa-baru" class="input-box" placeholder="Tulis catatan baru lalu tekan Enter..." style="margin:0; flex:1;" onkeydown="if(event.key===\'Enter\'){event.preventDefault(); window.tambahItemCatatanSiswa();}">' +
                    '<button class="btn-action" style="background:#f39c12; width:auto; padding:8px 16px; white-space:nowrap;" onclick="window.tambahItemCatatanSiswa()">+ Tambah</button>' +
                '</div>' +
                '<div id="list-catatan-siswa-container" style="display:flex; flex-direction:column; gap:8px; margin-top:4px;"></div>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modalEl);
};

window.catatanSiswaBuka = function(kls, nama) {
    window.pastikanModalCatatanSiswaAda();
    window.pastikanDataAbsensiKelas(kls);
    window.targetCatatanSiswa = { kls: kls, nama: nama };

    let subEl = document.getElementById('subtitle-catatan-siswa');
    if (subEl) subEl.innerText = nama + " (" + kls + ")";

    let inp = document.getElementById('input-catatan-siswa-baru');
    if (inp) inp.value = "";

    window.renderListCatatanSiswa();
    window.bukaModal('modal-catatan-siswa');
    setTimeout(function() { if (inp) inp.focus(); }, 120);
};

window.renderListCatatanSiswa = function() {
    let container = document.getElementById('list-catatan-siswa-container');
    if (!container) return;

    let kls = window.targetCatatanSiswa.kls;
    let nama = window.targetCatatanSiswa.nama;
    if (!kls || !nama) return;

    let absData = window.pastikanDataAbsensiKelas(kls);
    let listCatatan = (absData.catatan && absData.catatan[nama]) ? absData.catatan[nama] : [];

    if (listCatatan.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:25px 15px; color:#95a5a6; font-size:12px; background:#f8f9fa; border:1px dashed #dcdde1; border-radius:8px;">Belum ada catatan untuk siswa ini.</div>';
        return;
    }

    let html = '';
    listCatatan.forEach(function(item, idx) {
        let isDone = Boolean(item.done);
        let textStyle = isDone
            ? 'text-decoration: line-through; color: #95a5a6;'
            : 'text-decoration: none; color: #2c3e50;';
        let bgStyle = isDone ? '#f8f9fa' : '#ffffff';
        let borderStyle = isDone ? '#e1e8ed' : '#f9e79f';
        let safeText = String(item.teks || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        html +=
            '<div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; background:' + bgStyle + '; border:1px solid ' + borderStyle + '; border-left:4px solid ' + (isDone ? '#95a5a6' : '#f1c40f') + '; border-radius:6px; transition:0.2s;">' +
                '<label style="display:flex; align-items:center; gap:10px; flex:1; cursor:pointer; font-size:13px; font-weight:600; word-break:break-word;">' +
                    '<input type="checkbox" ' + (isDone ? 'checked' : '') + ' style="width:17px; height:17px; cursor:pointer; accent-color:#27ae60; flex-shrink:0;" onchange="window.toggleCentangCatatanSiswa(' + idx + ')">' +
                    '<span style="' + textStyle + ' transition:0.15s;">' + safeText + '</span>' +
                '</label>' +
                '<button type="button" style="background:#fadbd8; color:#c0392b; border:none; border-radius:6px; width:28px; height:28px; cursor:pointer; font-size:12px; font-weight:bold; flex-shrink:0; display:flex; align-items:center; justify-content:center;" title="Hapus Catatan" onclick="window.hapusItemCatatanSiswa(' + idx + ')">🗑️</button>' +
            '</div>';
    });

    container.innerHTML = html;
};

window.tambahItemCatatanSiswa = function() {
    let inp = document.getElementById('input-catatan-siswa-baru');
    if (!inp) return;
    let teks = inp.value.trim();
    if (!teks) return;

    let kls = window.targetCatatanSiswa.kls;
    let nama = window.targetCatatanSiswa.nama;
    if (!kls || !nama) return;

    let absData = window.pastikanDataAbsensiKelas(kls);
    absData.catatan[nama].push({
        teks: teks,
        done: false,
        waktu: new Date().toISOString()
    });

    inp.value = "";
    window.renderListCatatanSiswa();
    window.renderAbsensiAdmin();
    if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
};

window.toggleCentangCatatanSiswa = function(idx) {
    let kls = window.targetCatatanSiswa.kls;
    let nama = window.targetCatatanSiswa.nama;
    if (!kls || !nama) return;

    let absData = window.pastikanDataAbsensiKelas(kls);
    if (!absData.catatan[nama] || !absData.catatan[nama][idx]) return;

    absData.catatan[nama][idx].done = !absData.catatan[nama][idx].done;
    window.renderListCatatanSiswa();
    window.renderAbsensiAdmin();
    if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
};

window.hapusItemCatatanSiswa = function(idx) {
    let kls = window.targetCatatanSiswa.kls;
    let nama = window.targetCatatanSiswa.nama;
    if (!kls || !nama) return;

    let absData = window.pastikanDataAbsensiKelas(kls);
    if (!absData.catatan[nama] || !absData.catatan[nama][idx]) return;

    absData.catatan[nama].splice(idx, 1);
    window.renderListCatatanSiswa();
    window.renderAbsensiAdmin();
    if (typeof window.simpanAbsensiKeDB === "function") window.simpanAbsensiKeDB();
};

// 6. Mesin Render UI Tabel Absensi (Dengan Tombol Hadir Semua & Sticky Kolom)
window.renderAbsensiAdmin = function() {
    let tbody = document.getElementById('body-absensi-siswa');
    let thead = document.getElementById('head-absensi-pertemuan');
    let selKelas = document.getElementById('admin-select-kelas');

    if (!tbody || !thead || !selKelas) return;

    let tableEl = thead.closest('table');
    let scrollWrap = tableEl ? tableEl.parentElement : null;
    if (scrollWrap) {
        scrollWrap.style.overflowX = 'auto';
        scrollWrap.style.maxWidth = '100%';
        scrollWrap.style.webkitOverflowScrolling = 'touch';
    }
    if (tableEl) {
        tableEl.style.width = 'max-content';
        tableEl.style.minWidth = '100%';
        tableEl.style.borderCollapse = 'separate';
        tableEl.style.borderSpacing = '0';
    }

    let kls = selKelas.value || window.kelasAktifAdmin;
    if (kls && selKelas.value !== kls) selKelas.value = kls;

    let baseHeadHTML =
        '<th style="width:42px; min-width:42px; background:#2c3e50; color:white; text-align:center; position:sticky; left:0; z-index:6; border-right:1px solid #3e5871;">No</th>' +
        '<th style="text-align:left; background:#2c3e50; color:white; min-width:260px; position:sticky; left:42px; z-index:6; border-right:2px solid #bdc3c7;">Nama Siswa</th>';

    let endHeadHTML =
        '<th style="background:#27ae60; color:white; width:45px; min-width:45px; text-align:center;">H</th>' +
        '<th style="background:#f39c12; color:white; width:45px; min-width:45px; text-align:center;">S</th>' +
        '<th style="background:#2980b9; color:white; width:45px; min-width:45px; text-align:center;">I</th>' +
        '<th style="background:#c0392b; color:white; width:45px; min-width:45px; text-align:center;">A</th>';

    if (!kls) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:18px; color:#7f8c8d;">Pilih kelas terlebih dahulu.</td></tr>';
        thead.innerHTML = baseHeadHTML + endHeadHTML;
        document.getElementById('label-absensi-kelas').innerHTML = '<span style="color:#e74c3c;">Belum Dipilih</span>';
        return;
    }

    document.getElementById('label-absensi-kelas').innerHTML = '<span style="color:#2980b9;">' + kls + '</span>';

    let siswaArr = (window.adminData[kls] || []).slice().sort();
    if (siswaArr.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:18px; color:#e67e22;">Kelas ini belum memiliki siswa. Silakan input data siswa terlebih dahulu di tab Input Data Siswa & Kelas.</td></tr>';
        thead.innerHTML = baseHeadHTML + endHeadHTML;
        return;
    }

    let absData = window.pastikanDataAbsensiKelas(kls);
    let arrTgl = absData.tgl || [];

    // RENDER HEADER TABEL DINAMIS (Tambahan Tombol Hadir Semua)
    let htmlHead = baseHeadHTML;
    arrTgl.forEach(function(t, pIndex) {
        htmlHead +=
            '<th style="background:#2c3e50; color:white; min-width:120px; padding:10px 8px 32px 8px; cursor:pointer; text-align:center; user-select:none; white-space:nowrap; position:relative; border-right:1px solid #3e5871;" onclick="window.editTanggalAbsensi(' + pIndex + ')" oncontextmenu="event.preventDefault(); window.hapusPertemuanAbsensi(' + pIndex + ');" title="Klik untuk ubah tanggal | Klik kanan untuk hapus kolom pertemuan">' +
                '<div style="font-size:12px; font-weight:700; margin-bottom:2px;">Pertemuan ' + (pIndex + 1) + '</div>' +
                '<div style="color:#f1c40f; font-size:11px; font-weight:700;">' + t + '</div>' +
                '<button type="button" onclick="event.stopPropagation(); window.setSemuaHadirAbsensi(' + pIndex + ')" style="position:absolute; bottom:6px; left:50%; transform:translateX(-50%); background:#27ae60; border:none; color:white; font-size:9px; padding:4px 8px; border-radius:12px; cursor:pointer; font-weight:bold; white-space:nowrap; box-shadow:0 2px 4px rgba(0,0,0,0.2);" title="Set status Hadir (H) untuk semua siswa">☑️ Hadir Semua</button>' +
            '</th>';
    });
    htmlHead += endHeadHTML;
    thead.innerHTML = htmlHead;

    // RENDER BODY TABEL SISWA
    let htmlBody = '';
    siswaArr.forEach(function(nama, idx) {
        let count = { H: 0, S: 0, I: 0, A: 0 };
        let cellsTgl = '';
        let safeNamaAttr = nama.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeKlsAttr = kls.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

        arrTgl.forEach(function(t, pIndex) {
            let statArray = absData.status[nama] || [];
            let val = statArray[pIndex] || '-';
            if (val === 'H') count.H++;
            else if (val === 'S') count.S++;
            else if (val === 'I') count.I++;
            else if (val === 'A') count.A++;

            let bgCol = val === 'H' ? '#d5f5e3' : (val === 'A' ? '#fadbd8' : (val === 'S' ? '#fdebd0' : (val === 'I' ? '#d6eaf8' : '#ffffff')));
            let txtCol = val === 'H' ? '#1e8449' : (val === 'A' ? '#c0392b' : (val === 'S' ? '#d35400' : (val === 'I' ? '#2980b9' : '#7f8c8d')));

            cellsTgl += '<td style="background:' + bgCol + '; color:' + txtCol + '; font-weight:bold; cursor:pointer; font-size:13px; transition:0.15s; text-align:center; min-width:120px; user-select:none;" onclick="window.toggleStatusAbsensi(\'' + safeKlsAttr + '\', \'' + safeNamaAttr + '\', ' + pIndex + ', this)">' + val + '</td>';
        });

        let catatanArr = (absData.catatan && absData.catatan[nama]) ? absData.catatan[nama] : [];
        let totalCatatan = catatanArr.length;
        let belumSelesai = catatanArr.filter(function(c) { return !c.done; }).length;
        let badgeCatatan = '';
        if (totalCatatan > 0) {
            let badgeBg = belumSelesai > 0 ? '#e74c3c' : '#27ae60';
            let badgeTxt = belumSelesai > 0 ? belumSelesai : '✓';
            badgeCatatan = ' <span style="background:' + badgeBg + '; color:white; padding:1px 5px; border-radius:10px; font-size:9px; margin-left:3px;">' + badgeTxt + '</span>';
        }

        let rowBg = (idx % 2 === 1) ? '#f8f9fa' : '#ffffff';

        htmlBody +=
            '<tr>' +
                '<td style="color:#7f8c8d; font-weight:bold; text-align:center; background:' + rowBg + '; position:sticky; left:0; z-index:4;">' + (idx + 1) + '</td>' +
                '<td style="text-align:left; font-weight:bold; color:#2c3e50; background:' + rowBg + '; position:sticky; left:42px; z-index:4; border-right:2px solid #e1e8ed; min-width:260px;">' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px; width:100%;">' +
                        '<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + nama + '</span>' +
                        '<button type="button" style="background:#f1c40f; color:#2c3e50; border:none; padding:4px 10px; border-radius:5px; font-size:11px; font-weight:bold; cursor:pointer; flex-shrink:0; display:inline-flex; align-items:center; gap:4px; box-shadow:0 1px 3px rgba(0,0,0,0.12);" onclick="window.catatanSiswaBuka(\'' + safeKlsAttr + '\', \'' + safeNamaAttr + '\')">📝 Catatan' + badgeCatatan + '</button>' +
                    '</div>' +
                '</td>' +
                cellsTgl +
                '<td class="rekap-H" style="text-align:center; font-weight:bold; color:#27ae60;">' + count.H + '</td>' +
                '<td class="rekap-S" style="text-align:center; font-weight:bold; color:#f39c12;">' + count.S + '</td>' +
                '<td class="rekap-I" style="text-align:center; font-weight:bold; color:#2980b9;">' + count.I + '</td>' +
                '<td class="rekap-A" style="text-align:center; font-weight:bold; color:#c0392b;">' + count.A + '</td>' +
            '</tr>';
    });

    tbody.innerHTML = htmlBody;
};

/* =========================================
   LOGIKA AGENDA MENGAJAR (ADMINISTRASI)
   ========================================= */
window.adminAgendaData = {}; // Format: { "X Dana": [ {tgl: "2026-10-31", jp: 2, materi: "biologi", ket: "lancar", rencana: "ujian"} ] }

window.renderAgendaAdmin = function() {
    let label = document.getElementById('label-agenda-kelas');
    let tbody = document.getElementById('body-agenda-mengajar');
    if(!label || !tbody) return;

    if(!window.kelasAktifAdmin) {
        label.innerText = "Belum Dipilih"; label.style.color = "#e74c3c";
        tbody.innerHTML = "<tr><td colspan='7' style='text-align:center; color:#7f8c8d; font-weight:bold; padding:20px;'>Pilih kelas terlebih dahulu.</td></tr>";
        return;
    }
    
    label.innerText = window.kelasAktifAdmin; label.style.color = "#2980b9";
    if(!window.adminAgendaData[window.kelasAktifAdmin]) window.adminAgendaData[window.kelasAktifAdmin] = [];
    
    let agendaArr = window.adminAgendaData[window.kelasAktifAdmin];
    
    // Hitung total semua agenda untuk header administrasi
    let totalAgendaSemua = 0;
    Object.values(window.adminAgendaData).forEach(arr => totalAgendaSemua += arr.length);
    let infoAgenda = document.getElementById('admin-info-total-agenda');
    if(infoAgenda) infoAgenda.innerText = totalAgendaSemua;

    if(agendaArr.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7' style='text-align:center; color:#7f8c8d; padding:20px;'>Belum ada catatan agenda untuk kelas ini.</td></tr>";
        return;
    }

    let bHTML = '';
    agendaArr.forEach((item, idx) => {
        bHTML += `<tr>
            <td style="text-align:center; font-weight:bold; color:#7f8c8d;">${idx+1}</td>
            <td style="font-weight:600;">${item.tgl}</td>
            <td style="text-align:center; font-weight:bold;">${item.jp}</td>
            <td>${item.materi}</td>
            <td>${item.ket}</td>
            <td style="color:#16a085; font-weight:600;">${item.rencana}</td>
            <td style="text-align:center;"><button style="background:none; color:#c0392b; border:none; cursor:pointer; font-size:14px;" onclick="hapusAgendaAdmin(${idx})" title="Hapus Jurnal">🗑️</button></td>
        </tr>`;
    });
    tbody.innerHTML = bHTML;
};

window.tambahAgendaAdmin = function() {
    if(!window.kelasAktifAdmin) return alert("Pilih kelas di sebelah kiri terlebih dahulu!");
    let tgl = document.getElementById('agenda-tanggal').value;
    let jp = document.getElementById('agenda-jp').value;
    let materi = document.getElementById('agenda-materi').value.trim();
    let ket = document.getElementById('agenda-keterangan').value.trim();
    let rencana = document.getElementById('agenda-rencana').value.trim();

    if(!tgl || !jp || !materi) return alert("Tanggal, JP, dan Materi wajib diisi!");

    if(!window.adminAgendaData[window.kelasAktifAdmin]) window.adminAgendaData[window.kelasAktifAdmin] = [];
    
    window.adminAgendaData[window.kelasAktifAdmin].push({
        tgl: tgl, jp: jp, materi: materi, ket: ket, rencana: rencana
    });

    // Bersihkan input teks setelah simpan
    document.getElementById('agenda-materi').value = "";
    document.getElementById('agenda-keterangan').value = "";
    document.getElementById('agenda-rencana').value = "";

    window.renderAgendaAdmin();
    if(typeof window.simpanAgendaKeDB === "function") window.simpanAgendaKeDB();
};

window.hapusAgendaAdmin = function(idx) {
    if(confirm("Hapus catatan agenda ini?")) {
        window.adminAgendaData[window.kelasAktifAdmin].splice(idx, 1);
        window.renderAgendaAdmin();
        if(typeof window.simpanAgendaKeDB === "function") window.simpanAgendaKeDB();
    }
};

/* =========================================
   LOGIKA EXPORT EXCEL (CSV) ADMINISTRASI
   ========================================= */
window.exportExcelAbsensi = function() {
    if(!window.kelasAktifAdmin || !window.adminData[window.kelasAktifAdmin] || window.adminData[window.kelasAktifAdmin].length === 0) {
        return alert("Pilih kelas yang memiliki data absensi terlebih dahulu!");
    }
    
    let absData = window.adminAbsensiData[window.kelasAktifAdmin] || { tgl: [], status: {} };
    let siswaArr = window.adminData[window.kelasAktifAdmin].sort();
    
    // 1. Menyusun Judul Kolom (Header)
    let csvContent = "No,Nama Siswa,";
    absData.tgl.forEach((t, i) => {
        csvContent += `Pertemuan ${i+1} (${t}),`;
    });
    csvContent += "Hadir,Sakit,Izin,Alfa\n";
    
    // 2. Menyusun Baris Data Siswa
    siswaArr.forEach((s, idx) => {
        let row = `${idx+1},"${s}",`;
        let rekap = { 'H':0, 'S':0, 'I':0, 'A':0 };
        
        absData.tgl.forEach((t, i) => {
            let stat = (absData.status[s] && absData.status[s][i]) ? absData.status[s][i] : '-';
            if(rekap[stat] !== undefined) rekap[stat]++;
            row += `${stat},`;
        });
        
        row += `${rekap['H']},${rekap['S']},${rekap['I']},${rekap['A']}\n`;
        csvContent += row;
    });
    
    // 3. Proses Download File
    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Absensi_Kelas_${window.kelasAktifAdmin}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.exportExcelAgenda = function() {
    if(!window.kelasAktifAdmin || !window.adminAgendaData[window.kelasAktifAdmin] || window.adminAgendaData[window.kelasAktifAdmin].length === 0) {
        return alert("Pilih kelas yang memiliki catatan agenda terlebih dahulu!");
    }
    
    let agendaArr = window.adminAgendaData[window.kelasAktifAdmin];
    
    // 1. Menyusun Judul Kolom
    let csvContent = "No,Tanggal,JP,Materi Pembelajaran,Keterangan,Rencana Berikutnya\n";
    
    // 2. Menyusun Baris Catatan (Pakai kutip ganda agar teks yang mengandung koma tidak error di Excel)
    agendaArr.forEach((item, idx) => {
        csvContent += `${idx+1},"${item.tgl}","${item.jp}","${item.materi}","${item.ket}","${item.rencana}"\n`;
    });
    
    // 3. Proses Download File
    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Agenda_Mengajar_Kelas_${window.kelasAktifAdmin}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/* =========================================
   LOGIKA PENGINGAT (REMINDER) ADMINISTRASI
   ========================================= */
window.modeReminderAdmin = 'khusus';

// Array memori permanen untuk menyimpan ID pengingat absensi yang sudah dihapus (Terkunci di Perangkat)
window.adminPengingatMateriDismissed = JSON.parse(localStorage.getItem('dismissed_rem_' + (window.guruAktif || 'mahardika')) || "[]");

window.simpanDismissedLokal = function() {
    localStorage.setItem('dismissed_rem_' + (window.guruAktif || 'mahardika'), JSON.stringify(window.adminPengingatMateriDismissed));
};

window.setModeReminder = function(mode) {
    window.modeReminderAdmin = mode;
    let bK = document.getElementById('btn-rem-khusus');
    let bS = document.getElementById('btn-rem-semua');
    if(mode === 'khusus') {
        bK.style.background = '#0b3954'; bK.style.color = 'white'; bK.style.border = 'none';
        bS.style.background = '#ffffff'; bS.style.color = '#333'; bS.style.border = '1px solid #ccc';
    } else {
        bS.style.background = '#0b3954'; bS.style.color = 'white'; bS.style.border = 'none';
        bK.style.background = '#ffffff'; bK.style.color = '#333'; bK.style.border = '1px solid #ccc';
    }
    window.renderReminderAdmin();
};

function groupBerdasarkanKelas(arrayData) {
    return arrayData.reduce((acc, item) => {
        if (!acc[item.kelas]) acc[item.kelas] = [];
        acc[item.kelas].push(item);
        return acc;
    }, {});
}

// ----------------------------------------------------
// 1. MESIN SINKRONISASI MATERI (ABSENSI)
// ----------------------------------------------------
window.sinkronisasiMateriOtomatis = function() {
    if(!window.adminDataPengingat) window.adminDataPengingat = { materi: [], ujian: [] };
    
    if(window.adminAbsensiData) {
        for(let kelas in window.adminAbsensiData) {
            let absKelas = window.adminAbsensiData[kelas];
            for(let nama in absKelas.status) {
                let statArray = absKelas.status[nama];
                
                statArray.forEach((stat, pIndex) => {
                    if(['-', 'S', 'I', 'A'].includes(stat)) {
                        let tgl = absKelas.tgl[pIndex];
                        let idRem = `materi_${kelas.replace(/\s/g,'_')}_${nama.replace(/\s/g,'_')}_${pIndex}`;

                        let isDismissed = window.adminPengingatMateriDismissed.includes(idRem);
                        let isAlreadyIn = window.adminDataPengingat.materi.find(m => m.id === idRem);

                        if(!isDismissed && !isAlreadyIn) {
                            window.adminDataPengingat.materi.push({
                                id: idRem, kelas: kelas, nama: nama, teks: `tertinggal materi Pertemuan ${pIndex + 1} (${tgl})`, status: stat
                            });
                        }
                    }
                });
            }
        }
    }
};

window.hapusMateriLevel = function(level, kelas = null, itemId = null) {
    if(!window.adminDataPengingat) return;

    if (level === 'kelas') {
        if(!confirm('Tutup semua pengingat absensi untuk Kelas ' + kelas + '?')) return;
        window.adminDataPengingat.materi.forEach(function(m) {
            if(m.kelas === kelas && !window.adminPengingatMateriDismissed.includes(m.id)) {
                window.adminPengingatMateriDismissed.push(m.id);
            }
        });
        window.adminDataPengingat.materi = window.adminDataPengingat.materi.filter(function(item) { return item.kelas !== kelas; });
    } 
    else if (level === 'item') {
        if (!window.adminPengingatMateriDismissed.includes(itemId)) {
            window.adminPengingatMateriDismissed.push(itemId);
        }
        window.adminDataPengingat.materi = window.adminDataPengingat.materi.filter(function(item) { return item.id !== itemId; });
    }
    
    window.simpanDismissedLokal(); // Kunci ke penyimpanan browser agar tidak kembali saat direfresh
    window.renderReminderAdmin();
};

// ----------------------------------------------------
// 4. PANTAUAN UJIAN (Merah-Ungu, Tampil Penuh Semua Siswa)
// ----------------------------------------------------
window.dataPantauanUjian = null;

window.pantauUjianOtomatis = function() {
    let kelas = window.kelasAktifAdmin;
    let paket = document.getElementById('rem-pilih-ujian').value;

    if(!kelas) return alert("Pilih kelas di header atas (Pilih Kelas Terlebih Dahulu)!");
    if(!paket) return alert("Pilih paket ujian di menu dropdown terlebih dahulu!");

    let semuaSiswa = window.adminData[kelas] || [];
    if(semuaSiswa.length === 0) return alert("Kelas ini belum memiliki daftar siswa.");

    let rekapKelas = (window.adminRekapNilaiData && window.adminRekapNilaiData[kelas]) ? window.adminRekapNilaiData[kelas] : {};
    let rekapPaket = rekapKelas[paket] || {};
    let siswaSudahUjian = Object.keys(rekapPaket);

    let siswaBelumUjian = semuaSiswa.filter(function(nama) { return !siswaSudahUjian.includes(nama); });

    window.dataPantauanUjian = { kelas: kelas, paket: paket, siswaBelum: siswaBelumUjian };
    window.renderReminderAdmin();
};

window.gambarUIHasilPantauan = function() {
    let listUjian = document.getElementById('list-rem-ujian');
    if(!listUjian) return;

    let data = window.dataPantauanUjian;
    
    if(!data || !data.siswaBelum || data.siswaBelum.length === 0) {
        listUjian.innerHTML = '<div style="text-align:center; padding:15px; color:#95a5a6; font-size:13px; border:1px dashed #bdc3c7; border-radius:8px; background:#fafafa;">🎉 Tidak ada pantauan atau semua siswa telah selesai ujian.</div>';
        return;
    }

    let html = '<details open style="margin-bottom:15px; background:#fff; border:1px solid #d5dbdb; border-radius:8px; flex-shrink:0; box-shadow:0 1px 3px rgba(0,0,0,0.05);">' +
        '<summary style="display:flex; justify-content:space-between; align-items:center; padding:12px 15px; background:#f4f0fa; cursor:pointer; list-style:none; border-left:4px solid #8e44ad; border-radius:8px 8px 0 0;">' +
            '<div style="display:flex; align-items:center; gap:10px; flex:1;">' +
                '<span style="font-size:12px;">▶</span>' +
                '<span style="background:#8e44ad; color:white; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:bold;">' + data.kelas + '</span>' +
                '<span style="background:#fadbd8; color:#c0392b; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:bold;">🎯 ' + data.siswaBelum.length + ' Siswa Belum Ujian</span>' +
            '</div>' +
            '<button style="background:#e74c3c; color:white; border-radius:50%; width:24px; height:24px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px; font-weight:bold;" onclick="event.preventDefault(); window.hapusPantauanKelas();">✕</button>' +
        '</summary>' +
        '<div style="padding:12px 15px; display:flex; flex-direction:column; gap:8px; background:#fdfefe; border-radius:0 0 8px 8px;">';
    
    data.siswaBelum.forEach(function(nama) {
        html += '<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#fdf2f2; border:1px solid #fadbd8; border-left:4px solid #e74c3c; border-radius:6px; flex-shrink:0;">' +
                '<div style="font-size:13px; color:#c0392b;">' +
                    '<span style="background:#c0392b; color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:bold; margin-right:6px;">' + data.kelas + '</span> ' +
                    '<strong>' + nama + '</strong> belum mengikuti <u>' + data.paket + '</u>' +
                '</div>' +
                '<button style="background:#e74c3c; color:white; border-radius:50%; width:22px; height:22px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:10px; font-weight:bold; flex-shrink:0;" onclick="window.hapusPantauanSiswa(\'' + nama.replace(/'/g, "\\'") + '\')">✕</button>' +
            '</div>';
    });

    html += '</div></details>';
    listUjian.innerHTML = html;
};

window.hapusPantauanKelas = function() {
    if(confirm("Tutup hasil pantauan ujian ini?")) {
        window.dataPantauanUjian = null;
        window.renderReminderAdmin();
    }
};

window.hapusPantauanSiswa = function(namaSiswa) {
    if(window.dataPantauanUjian && window.dataPantauanUjian.siswaBelum) {
        window.dataPantauanUjian.siswaBelum = window.dataPantauanUjian.siswaBelum.filter(function(n) { return n !== namaSiswa; });
        window.renderReminderAdmin();
    }
};

/* =========================================
   MESIN PARSER SOAL, PREVIEW KANAN, & MANAJER UJIAN TERPADU
   ========================================= */
// Bersihkan modal duplikat lama (jika masih ada di atas HTML) agar ID mengarah ke Ruang Manajer Ujian Terpadu
document.querySelectorAll('#modal-kontrol-ujian, #modal-live-monitor, #modal-admin-bank-ujian').forEach(function(el) {
    el.remove();
});

window.tempSoalUjianParsed = [];
window.tempBobotUjian = {};
window.selectedBankUjianName = "";

// Fungsi Berpindah Tab di dalam Ruang Manajer Ujian Terpadu (Gaya Ruang Administrasi)
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

// Ubah Soal Array kembali ke Format Teks Mentah agar bisa diedit di Textarea
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
            (q.options || []).forEach(function(opt) {
                let isBenar = (q.correct || []).includes(opt.label);
                lines.push(opt.label + ". " + opt.text + (isBenar ? " (benar)" : " (salah)"));
            });
        } else {
            (q.options || []).forEach(function(opt) {
                lines.push(opt.label + ". " + opt.text);
            });
            lines.push("Kunci: " + ((q.correct && q.correct[0]) ? q.correct[0] : "A"));
        }
        if (q.explanation) {
            lines.push("Pembahasan: " + q.explanation);
        }
        return lines.join("\n");
    }).join("\n\n");
};

// Render Dropdown "🗂️ Pilih Bank Ujian Tersimpan" di Bawah Kiri
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

// Saat Guru Memilih Bank Ujian Tersimpan dari Dropdown Kiri Bawah
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
    
    blocks.forEach(function(block) {
        let lines = block.trim().split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
        if(lines.length === 0) return;
        
        let qObj = { type: 'PG', question: '', options: [], correct: [], explanation: '' };
        let isParsingOptions = false;
        
        lines.forEach(function(line) {
            let lowerLine = line.toLowerCase();
            
            if (lowerLine.startsWith('soal:')) {
                qObj.question = line.substring(5).trim();
            } 
            else if (lowerLine.startsWith('tipe:')) {
                let type = lowerLine.substring(5).trim();
                if(type === 'is' || type === 'isian singkat') qObj.type = 'IS';
                else if(type === 'essay' || type === 'esai') qObj.type = 'Essay';
            }
            else if (lowerLine.startsWith('kunci:')) {
                isParsingOptions = false;
                let kunciStr = line.substring(6).trim();
                if(qObj.type === 'IS') {
                    qObj.correct = kunciStr.split('|').map(function(s) { return s.trim(); });
                } else if (qObj.type === 'Essay') {
                    qObj.correct = [kunciStr];
                } else {
                    qObj.correct = [kunciStr.toUpperCase()];
                }
            }
            else if (lowerLine.startsWith('pembahasan:')) {
                isParsingOptions = false;
                qObj.explanation = line.substring(11).trim();
            }
            else if (/^[a-eA-E]\./.test(line)) { 
                isParsingOptions = true;
                let optLabel = line.charAt(0).toUpperCase();
                let optText = line.substring(2).trim();
                
                if(optText.toLowerCase().endsWith('(benar)')) {
                    qObj.type = 'PGK';
                    optText = optText.substring(0, optText.length - 7).trim();
                    qObj.correct.push(optLabel);
                } else if (optText.toLowerCase().endsWith('(salah)')) {
                    qObj.type = 'PGK';
                    optText = optText.substring(0, optText.length - 7).trim();
                }
                
                qObj.options.push({ label: optLabel, text: optText });
            }
            else {
                if(isParsingOptions && qObj.options.length > 0) {
                    qObj.options[qObj.options.length-1].text += ' ' + line;
                } else if (qObj.explanation) {
                    qObj.explanation += ' ' + line;
                } else if (qObj.question && qObj.options.length === 0) {
                    qObj.question += '<br>' + line;
                }
            }
        });
        
        if(qObj.type === 'PGK') qObj.correct = [...new Set(qObj.correct)];
        if(qObj.question) questions.push(qObj);
    });
    
    window.tempSoalUjianParsed = questions;
    
    let counts = { 'PG':0, 'PGK':0, 'IS':0, 'Essay':0 };
    questions.forEach(function(q) { if(counts[q.type] !== undefined) counts[q.type]++; });
    
    if(questions.length === 0) {
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

// Render Preview Soal di Bawah Kalkulator Bobot (Bisa Di-scroll ke Bawah)
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

// Hapus 1 Nomor Soal dari Preview Kanan
window.hapusSatuSoalPreviewUjian = function(idx) {
    if (!window.tempSoalUjianParsed || !window.tempSoalUjianParsed[idx]) return;
    if (!confirm('Hapus soal nomor ' + (idx + 1) + ' dari paket ini?')) return;

    window.tempSoalUjianParsed.splice(idx, 1);
    let inputText = document.getElementById('admin-bu-text');
    if (inputText) {
        inputText.value = window.konversiSoalKeTeksMentah(window.tempSoalUjianParsed);
    }
    window.analisisSoalOtomatis();

    // Jika sedang mengedit Bank Ujian yang sudah tersimpan, langsung perbarui ke DB
    if (window.selectedBankUjianName && window.adminBankUjianData && window.adminBankUjianData[window.selectedBankUjianName]) {
        window.adminBankUjianData[window.selectedBankUjianName].soal = window.tempSoalUjianParsed;
        window.adminBankUjianData[window.selectedBankUjianName].bobot = window.tempBobotUjian;
        if (typeof window.simpanBankUjianKeDB === "function") window.simpanBankUjianKeDB();
        window.renderDropdownBankUjianTersimpan();
    }
};

// Cetak PDF / Export Word langsung dari Preview Bank Ujian
window.cetakPreviewBankUjian = function(format) {
    let judul = (document.getElementById('admin-bu-nama') && document.getElementById('admin-bu-nama').value.trim()) || window.selectedBankUjianName || "Soal Ujian";
    window.cetakDokumenUniversal(format, judul, window.tempSoalUjianParsed);
};

// Hapus Bank Ujian yang Sedang Dipilih di Dropdown
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
    
    if(cPG > 0) { if(inPG !== "") usedScore += cPG * parseFloat(inPG); else totalQuestionsInEmptyTypes += cPG; }
    if(cPGK > 0) { if(inPGK !== "") usedScore += cPGK * parseFloat(inPGK); else totalQuestionsInEmptyTypes += cPGK; }
    if(cIS > 0) { if(inIS !== "") usedScore += cIS * parseFloat(inIS); else totalQuestionsInEmptyTypes += cIS; }
    if(cES > 0) { if(inES !== "") usedScore += cES * parseFloat(inES); else totalQuestionsInEmptyTypes += cES; }
    
    let sisaScore = maxScore - usedScore;
    let calculatedScorePerItem = 0;
    
    if(totalQuestionsInEmptyTypes > 0 && sisaScore > 0) {
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
    
    if(Math.abs(finalTotal - 100) > 0.01 || finalTotal < 0) {
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

window.adminBankUjianData = window.adminBankUjianData || {};

window.simpanPaketUjianSistem = function() {
    let namaPaket = document.getElementById('admin-bu-nama').value.trim();
    if(!namaPaket) return alert("Nama paket ujian tidak boleh kosong!");
    if(window.tempSoalUjianParsed.length === 0) return alert("Belum ada soal yang terdeteksi!");

    window.adminBankUjianData[namaPaket] = {
        soal: window.tempSoalUjianParsed,
        bobot: window.tempBobotUjian,
        tanggalDibuat: new Date().toISOString()
    };

    window.selectedBankUjianName = namaPaket;
    window.renderDropdownBankUjianTersimpan();
    window.analisisSoalOtomatis();
    
    if(typeof window.simpanBankUjianKeDB === "function") window.simpanBankUjianKeDB();
    alert('✅ Paket ujian "' + namaPaket + '" berhasil disimpan ke Bank Ujian!');
};

window.renderManajerUjian = function() {
    window.renderDropdownBankUjianTersimpan();
    window.renderKontrolUjian();
    window.updateHeaderInfoManajerUjian();
};

window.hapusPaketUjian = function(namaPaket) {
    if(confirm('Yakin ingin menghapus paket ujian "' + namaPaket + '" secara permanen?')) {
        delete window.adminBankUjianData[namaPaket];
        if (window.selectedBankUjianName === namaPaket) {
            window.selectedBankUjianName = "";
            window.pilihBankUjianTersimpan("");
        }
        window.renderManajerUjian();
        if(typeof window.simpanBankUjianKeDB === "function") window.simpanBankUjianKeDB();
    }
};

window.editPaketUjian = function(namaPaket) {
    window.bukaModal('modal-manajer-ujian');
    window.bukaTabManajerUjian('tab-ujian-bank');
    window.pilihBankUjianTersimpan(namaPaket);
};

/* =========================================
   LOGIKA MANAJER LATIHAN & BANK SOAL (EDIT & TAMBAH SOAL)
   ========================================= */
window.adminBankLatihanData = window.adminBankLatihanData || {};
window.modeSimpanBankLatihan = 'new';
window.kunciEditBankLatihan = null;

window.bukaModalBankLatihanBaru = function() {
    document.getElementById('admin-bs-kelas').disabled = false;
    document.getElementById('admin-bs-mapel').disabled = false;
    document.getElementById('admin-bs-bab').disabled = false;
    document.getElementById('admin-bs-kesulitan').disabled = false;
    document.getElementById('admin-bs-text').value = "";

    window.modeSimpanBankLatihan = 'new';
    window.kunciEditBankLatihan = null;

    document.querySelector('#modal-admin-bank-soal .modal-header h3').innerHTML = '📥 Arsip Latihan Mandiri';
    let btn = document.querySelector('#modal-admin-bank-soal .btn-action');
    btn.innerHTML = 'Arsipkan 💾';
    btn.style.background = '#8e44ad';

    window.tutupModal('modal-manajer-soal');
    window.bukaModal('modal-admin-bank-soal');
};

window.editBankLatihan = function(key) {
    let item = window.adminBankLatihanData[key];
    if(!item) return;

    document.getElementById('admin-bs-kelas').value = item.kelas;
    document.getElementById('admin-bs-mapel').value = item.mapel;
    document.getElementById('admin-bs-bab').value = item.bab;
    document.getElementById('admin-bs-kesulitan').value = item.kesulitan;

    document.getElementById('admin-bs-kelas').disabled = true;
    document.getElementById('admin-bs-mapel').disabled = true;
    document.getElementById('admin-bs-bab').disabled = true;
    document.getElementById('admin-bs-kesulitan').disabled = true;

    // Pastikan fungsi konversiSoalKeTeksMentah sudah ada di file Anda (biasanya tergabung di fitur ujian)
    if(typeof window.konversiSoalKeTeksMentah === "function") {
        document.getElementById('admin-bs-text').value = window.konversiSoalKeTeksMentah(item.soal || []);
    } else {
        document.getElementById('admin-bs-text').value = "Error: Sistem teks formatter tidak ditemukan.";
    }

    window.modeSimpanBankLatihan = 'edit';
    window.kunciEditBankLatihan = key;

    document.querySelector('#modal-admin-bank-soal .modal-header h3').innerHTML = '✏️ Edit Arsip Latihan';
    let btn = document.querySelector('#modal-admin-bank-soal .btn-action');
    btn.innerHTML = 'Simpan Perubahan 💾';
    btn.style.background = '#27ae60';

    window.tutupModal('modal-manajer-soal');
    window.bukaModal('modal-admin-bank-soal');
};

window.tambahSoalBankLatihan = function(key) {
    let item = window.adminBankLatihanData[key];
    if(!item) return;

    document.getElementById('admin-bs-kelas').value = item.kelas;
    document.getElementById('admin-bs-mapel').value = item.mapel;
    document.getElementById('admin-bs-bab').value = item.bab;
    document.getElementById('admin-bs-kesulitan').value = item.kesulitan;

    document.getElementById('admin-bs-kelas').disabled = true;
    document.getElementById('admin-bs-mapel').disabled = true;
    document.getElementById('admin-bs-bab').disabled = true;
    document.getElementById('admin-bs-kesulitan').disabled = true;

    document.getElementById('admin-bs-text').value = "";

    window.modeSimpanBankLatihan = 'append';
    window.kunciEditBankLatihan = key;

    document.querySelector('#modal-admin-bank-soal .modal-header h3').innerHTML = '➕ Tambah Soal Baru';
    let btn = document.querySelector('#modal-admin-bank-soal .btn-action');
    btn.innerHTML = 'Tambahkan Soal 💾';
    btn.style.background = '#f1c40f';
    btn.style.color = '#2c3e50';

    window.tutupModal('modal-manajer-soal');
    window.bukaModal('modal-admin-bank-soal');
};

window.simpanKeBankSoalPusat = function() {
    let kelas = document.getElementById('admin-bs-kelas').value;
    let mapel = document.getElementById('admin-bs-mapel').value;
    let bab = document.getElementById('admin-bs-bab').value.trim();
    let kesulitan = document.getElementById('admin-bs-kesulitan').value;
    let rawText = document.getElementById('admin-bs-text').value;

    if(!bab) return alert("Nama Bab wajib diisi!");
    if(!rawText) return alert("Soal tidak boleh kosong!");

    let blocks = rawText.split(/\n\s*\n|\n---\n/);
    let questions = [];
    
    blocks.forEach(function(block) {
        let lines = block.trim().split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
        if(lines.length === 0) return;
        
        let qObj = { type: 'PG', question: '', options: [], correct: [], explanation: '' };
        let isParsingOptions = false;
        
        lines.forEach(function(line) {
            let lowerLine = line.toLowerCase();
            if (lowerLine.startsWith('soal:')) { qObj.question = line.substring(5).trim(); } 
            else if (lowerLine.startsWith('tipe:')) {
                let type = lowerLine.substring(5).trim();
                if(type === 'is' || type === 'isian singkat') qObj.type = 'IS';
                else if(type === 'essay' || type === 'esai') qObj.type = 'Essay';
            }
            else if (lowerLine.startsWith('kunci:')) {
                isParsingOptions = false;
                let kunciStr = line.substring(6).trim();
                if(qObj.type === 'IS') qObj.correct = kunciStr.split('|').map(function(s) { return s.trim(); });
                else if (qObj.type === 'Essay') qObj.correct = [kunciStr];
                else qObj.correct = [kunciStr.toUpperCase()];
            }
            else if (lowerLine.startsWith('pembahasan:')) {
                isParsingOptions = false;
                qObj.explanation = line.substring(11).trim();
            }
            else if (/^[a-eA-E]\./.test(line)) { 
                isParsingOptions = true;
                let optLabel = line.charAt(0).toUpperCase();
                let optText = line.substring(2).trim();
                if(optText.toLowerCase().endsWith('(benar)')) {
                    qObj.type = 'PGK'; optText = optText.substring(0, optText.length - 7).trim(); qObj.correct.push(optLabel);
                } else if (optText.toLowerCase().endsWith('(salah)')) {
                    qObj.type = 'PGK'; optText = optText.substring(0, optText.length - 7).trim();
                }
                qObj.options.push({ label: optLabel, text: optText });
            }
            else {
                if(isParsingOptions && qObj.options.length > 0) qObj.options[qObj.options.length-1].text += ' ' + line;
                else if (qObj.explanation) qObj.explanation += ' ' + line;
                else if (qObj.question && qObj.options.length === 0) qObj.question += '<br>' + line;
            }
        });
        
        if(qObj.type === 'PGK') qObj.correct = [...new Set(qObj.correct)];
        if(qObj.question) questions.push(qObj);
    });

    if(questions.length === 0) return alert("Gagal mengekstrak soal. Pastikan format teks benar!");

    let key = window.kunciEditBankLatihan || (kelas + '_' + mapel + '_' + bab + '_' + kesulitan);
    if(!window.adminBankLatihanData[key]) {
        window.adminBankLatihanData[key] = { kelas: kelas, mapel: mapel, bab: bab, kesulitan: kesulitan, soal: [] };
    }

    if (window.modeSimpanBankLatihan === 'edit') {
        window.adminBankLatihanData[key].soal = questions; 
        alert("✅ Perubahan soal berhasil disimpan!");
    } else {
        window.adminBankLatihanData[key].soal.push(...questions); 
        alert("✅ " + questions.length + " Soal berhasil ditambahkan!");
    }

    document.getElementById('admin-bs-text').value = "";
    window.tutupModal('modal-admin-bank-soal');
    window.bukaModal('modal-manajer-soal');
    window.renderManajerSoal();
    
    if(typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
};

window.renderManajerSoal = function() {
    let listEl = document.getElementById('list-manajer-soal');
    let selFilter = document.getElementById('filter-manajer-kelas');
    if(!listEl || !selFilter) return;

    let currentFilter = selFilter.value || "Semua";
    let keys = Object.keys(window.adminBankLatihanData || {});
    let kelasSet = new Set();
    
    keys.forEach(function(k) {
        let item = window.adminBankLatihanData[k];
        if (item && item.kelas) kelasSet.add(item.kelas);
    });

    let htmlOpt = '<option value="Semua">Semua Kelas</option>';
    Array.from(kelasSet).sort().forEach(function(kls) {
        let selected = (kls === currentFilter) ? 'selected' : '';
        htmlOpt += '<option value="' + kls + '" ' + selected + '>' + kls + '</option>';
    });
    selFilter.innerHTML = htmlOpt;

    if (currentFilter !== "Semua" && !kelasSet.has(currentFilter)) {
        currentFilter = "Semua";
        selFilter.value = "Semua";
    }

    let filteredKeys = keys.filter(function(k) {
        return currentFilter === "Semua" || window.adminBankLatihanData[k].kelas === currentFilter;
    });

    if(filteredKeys.length === 0) {
        listEl.innerHTML = '<p style="color:#7f8c8d; font-size:12px; text-align:center; margin-top:20px;">Belum ada arsip latihan yang sesuai dengan filter kelas.</p>';
        return;
    }

    let html = '';
    filteredKeys.sort().forEach(function(k) {
        let item = window.adminBankLatihanData[k];
        let badgeDiffColor = item.kesulitan === 'C1' ? '#27ae60' : (item.kesulitan === 'C2' ? '#f39c12' : '#c0392b');
        html += '<li class="soal-manager-item" style="display:flex; justify-content:space-between; align-items:center; background:#f8f9fa; border:1px solid #eee; margin-bottom:8px; padding:12px; border-radius:6px; flex-wrap:wrap; gap:10px;">' +
            '<div class="soal-manager-info">' +
                '<div style="font-weight:bold; color:#2c3e50; font-size:13px; margin-bottom:4px;">🚀 ' + item.bab + ' <span style="font-size:11px; color:#7f8c8d; font-weight:normal;">(' + item.mapel + ')</span></div>' +
                '<div style="font-size:11px; color:#7f8c8d; display:flex; gap:6px; align-items:center; flex-wrap:wrap;">' +
                    '<span class="soal-manager-tag" style="background:#8e44ad; padding:2px 6px;">' + item.kelas + '</span>' +
                    '<span class="soal-manager-tag" style="background:' + badgeDiffColor + '; padding:2px 6px;">' + item.kesulitan + '</span>' +
                    '<span style="font-weight:bold; color:#27ae60;">' + item.soal.length + ' Soal Tersimpan</span>' +
                '</div>' +
            '</div>' +
            '<div style="display:flex; gap:6px;">' +
                '<button style="background:#2ecc71; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="window.editBankLatihan(\'' + k + '\')">✏️ Edit</button>' +
                '<button style="background:#f1c40f; color:#2c3e50; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="window.tambahSoalBankLatihan(\'' + k + '\')">➕ Tambah</button>' +
                '<button style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;" onclick="window.hapusBankLatihan(\'' + k + '\')">🗑️ Hapus</button>' +
            '</div>' +
        '</li>';
    });
    listEl.innerHTML = html;
};

window.hapusBankLatihan = function(key) {
    if(confirm("Hapus seluruh arsip soal untuk bab ini?")) {
        delete window.adminBankLatihanData[key];
        window.renderManajerSoal();
        if(typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
    }
};

const modalLatihanObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
        if(m.target.id === 'modal-manajer-soal' && m.target.style.display === 'flex') {
            if(typeof window.renderManajerSoal === "function") window.renderManajerSoal();
        }
    });
});
if(document.getElementById('modal-manajer-soal')) {
    modalLatihanObserver.observe(document.getElementById('modal-manajer-soal'), { attributes: true, attributeFilter: ['style'] });
}

/* =========================================
   LOGIKA KONTROL UJIAN & LIVE MONITOR (TERINTEGRASI DI MANAJER UJIAN)
   ========================================= */
window.adminUjianAktifData = window.adminUjianAktifData || {};
window.adminLiveMonitorData = window.adminLiveMonitorData || {};

window.bukaModalKontrolUjian = function() {
    window.bukaModal('modal-manajer-ujian');
    window.bukaTabManajerUjian('tab-ujian-kontrol');
};

window.renderKontrolUjian = function() {
    let selectEl = document.getElementById('admin-pilih-ujian');
    let htmlOpt = '<option value="">-- Pilih Paket Ujian --</option>';
    
    let paketAktif = Object.values(window.adminUjianAktifData).map(function(u) { return u.paket; });
    let bankKeys = Object.keys(window.adminBankUjianData || {});
    
    bankKeys.forEach(function(k) {
        if(!paketAktif.includes(k)) {
            htmlOpt += '<option value="' + k + '">' + k + '</option>';
        }
    });
    
    if(selectEl) selectEl.innerHTML = htmlOpt;

    let container = document.getElementById('container-ujian-aktif');
    let aktifKeys = Object.keys(window.adminUjianAktifData || {});
    window.updateHeaderInfoManajerUjian();
    
    if(aktifKeys.length === 0) {
        if(container) container.innerHTML = '<p style="color:#7f8c8d; font-size:12px; text-align:center; padding:20px; background:#f8f9fa; border-radius:6px; border:1px dashed #ccc;">Belum ada ujian yang diaktifkan.</p>';
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
    if(container) container.innerHTML = htmlAktif;
};

window.simpanKontrolUjian = function() {
    let paket = document.getElementById('admin-pilih-ujian').value;
    let kode = document.getElementById('admin-kode-ujian').value.trim().toUpperCase();
    let durasi = parseInt(document.getElementById('admin-durasi-ujian').value);

    if(!paket) return alert("Pilih paket ujian terlebih dahulu!");
    if(!kode) return alert("Kode akses ujian tidak boleh kosong!");
    if(window.adminUjianAktifData[kode]) return alert("Kode ujian ini sudah dipakai/sedang aktif. Gunakan kode lain!");
    if(!durasi || durasi <= 0) return alert("Durasi ujian tidak valid!");

    window.adminUjianAktifData[kode] = {
        paket: paket,
        durasi: durasi,
        dibuat: new Date().toISOString()
    };

    document.getElementById('admin-kode-ujian').value = "";
    document.getElementById('admin-durasi-ujian').value = "90";
    
    window.renderKontrolUjian();
    if(typeof window.simpanUjianAktifKeDB === "function") window.simpanUjianAktifKeDB();
};

window.nonaktifkanUjian = function(kode) {
    if(confirm('Yakin ingin menutup akses ujian (Kode: ' + kode + ')? Siswa yang belum masuk tidak akan bisa mengaksesnya lagi.')) {
        delete window.adminUjianAktifData[kode];
        window.renderKontrolUjian();
        if(typeof window.simpanUjianAktifKeDB === "function") window.simpanUjianAktifKeDB();
    }
};

// --- MESIN LIVE MONITOR UJIAN ---
window.perbaruiBadgeNotifMonitor = function() {
    let badge = document.getElementById('badge-notif');
    if(!badge) return;
    let adaPelanggaran = false;
    let allPaket = window.adminLiveMonitorData || {};
    Object.keys(allPaket).forEach(function(p) {
        let kelasObj = allPaket[p] || {};
        Object.keys(kelasObj).forEach(function(k) {
            let siswaObj = kelasObj[k] || {};
            Object.keys(siswaObj).forEach(function(s) {
                if((siswaObj[s].pelanggaran || 0) > 0) adaPelanggaran = true;
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
    if(!selPaket) return;

    let prevPaket = selPaket.value;
    let prevKelas = selKelas ? selKelas.value : 'Semua';

    let paketSet = new Set();
    Object.keys(window.adminBankUjianData || {}).forEach(function(p) { paketSet.add(p); });
    Object.values(window.adminUjianAktifData || {}).forEach(function(u) { if(u.paket) paketSet.add(u.paket); });
    Object.keys(window.adminLiveMonitorData || {}).forEach(function(p) { paketSet.add(p); });

    let htmlPaket = '<option value="">-- Pilih Ujian --</option>';
    Array.from(paketSet).sort().forEach(function(p) {
        let selected = (p === prevPaket) ? 'selected' : '';
        htmlPaket += '<option value="' + p + '" ' + selected + '>' + p + '</option>';
    });
    selPaket.innerHTML = htmlPaket;

    if(!selPaket.value) {
        let liveKeys = Object.keys(window.adminLiveMonitorData || {});
        if(liveKeys.length === 1) selPaket.value = liveKeys[0];
    }

    window.perbaruiDropdownKelasMonitor(prevKelas);
};

window.perbaruiDropdownKelasMonitor = function(prevKelas) {
    let selPaket = document.getElementById('live-monitor-paket');
    let selKelas = document.getElementById('live-monitor-kelas');
    if(!selKelas) return;

    let paketDipilih = selPaket ? selPaket.value : '';
    let kelasSet = new Set();

    Object.keys(window.adminData || {}).forEach(function(k) { kelasSet.add(k); });
    if(paketDipilih && window.adminLiveMonitorData && window.adminLiveMonitorData[paketDipilih]) {
        Object.keys(window.adminLiveMonitorData[paketDipilih]).forEach(function(k) { kelasSet.add(k); });
    }

    let htmlKelas = '<option value="Semua">Semua Kelas</option>';
    Array.from(kelasSet).sort().forEach(function(k) {
        let selected = (k === prevKelas) ? 'selected' : '';
        htmlKelas += '<option value="' + k + '" ' + selected + '>' + k + '</option>';
    });
    selKelas.innerHTML = htmlKelas;
};

window.loadLiveMonitor = function(paketVal) {
    window.perbaruiDropdownKelasMonitor(document.getElementById('live-monitor-kelas') ? document.getElementById('live-monitor-kelas').value : 'Semua');
    window.renderIsiLiveMonitor();
};

window.renderIsiLiveMonitor = function() {
    let selPaket = document.getElementById('live-monitor-paket');
    let selKelas = document.getElementById('live-monitor-kelas');
    let listEl = document.getElementById('live-monitor-list');
    if(!listEl || !selPaket) return;

    let paket = selPaket.value;
    let filterKelas = selKelas ? selKelas.value : 'Semua';

    if(!paket) {
        listEl.innerHTML = '<div style="text-align:center; padding:25px; color:#7f8c8d; background:#f8f9fa; border-radius:8px; border:1px dashed #ccc;">Pilih paket ujian di atas untuk melihat pantauan siswa secara langsung.</div>';
        return;
    }

    let dataPaket = (window.adminLiveMonitorData && window.adminLiveMonitorData[paket]) ? window.adminLiveMonitorData[paket] : {};
    let daftarBaris = [];

    Object.keys(dataPaket).sort().forEach(function(kls) {
        if(filterKelas !== 'Semua' && kls !== filterKelas) return;
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

    if(daftarBaris.length === 0) {
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

        html += '<div style="display:flex; justify-content:space-between; align-items:center; background:' + bgCard + '; border:1px solid ' + borderCard + '; padding:12px 16px; border-radius:8px;">' +
            '<div>' +
                '<div style="font-weight:700; font-size:15px; color:#1e272e; margin-bottom:2px;">' + row.kelas + ' - ' + row.nama + '</div>' +
                '<div style="font-size:12px; color:#485460;">' + row.status + '</div>' +
            '</div>' +
            '<div style="font-size:14px;">' + statusRight + '</div>' +
        '</div>';
    });

    listEl.innerHTML = html;
};

window.hapusLiveMonitorData = function() {
    let selPaket = document.getElementById('live-monitor-paket');
    let selKelas = document.getElementById('live-monitor-kelas');
    let paket = selPaket ? selPaket.value : '';
    let kelas = selKelas ? selKelas.value : 'Semua';

    if(!paket) {
        return alert("Pilih ujian yang ingin dihapus history-nya terlebih dahulu!");
    }

    let pesanKonfirmasi = (kelas && kelas !== 'Semua')
        ? 'Hapus riwayat Live Monitor untuk ujian "' + paket + '" khusus kelas "' + kelas + '"?'
        : 'Hapus seluruh riwayat Live Monitor untuk ujian "' + paket + '" (Semua Kelas)?';

    if(confirm(pesanKonfirmasi)) {
        if(window.adminLiveMonitorData && window.adminLiveMonitorData[paket]) {
            if(kelas && kelas !== 'Semua') {
                delete window.adminLiveMonitorData[paket][kelas];
            } else {
                delete window.adminLiveMonitorData[paket];
            }
        }
        if(typeof window.hapusDataLiveMonitorDiDB === "function") {
            window.hapusDataLiveMonitorDiDB(paket, kelas);
        }
        window.renderIsiLiveMonitor();
        window.perbaruiBadgeNotifMonitor();
    }
};

/* =========================================
   LOGIKA GERBANG MASUK UJIAN & DETEKSI LAYAR PENUH PRA-UJIAN
   ========================================= */
window.renderDropdownKelasUjian = function() {
    if (!sessionStorage.getItem("statusLogin")) {
        window.tutupModal('modal-enter-ujian');
        alert("🔒 Akses Ditolak: Anda harus LOGIN sebagai Siswa untuk mengikuti Ujian Kelas.");
        window.bukaModal('modal-login-sistem');
        return;
    }

    let selKelas = document.getElementById('ujian-select-kelas');
    if(!selKelas) return;
    
    let htmlOpt = '<option value="">-- Pilih Kelas Anda --</option>';
    let kelasArray = Object.keys(window.adminData || {}).sort();
    
    kelasArray.forEach(function(k) {
        htmlOpt += '<option value="' + k + '">' + k + '</option>';
    });
    selKelas.innerHTML = htmlOpt;
    document.getElementById('ujian-select-nama').innerHTML = '<option value="">-- Pilih Kelas Terlebih Dahulu --</option>';
    document.getElementById('input-kode-ujian').value = "";
};

window.updateDropdownNamaUjian = function() {
    let selKelas = document.getElementById('ujian-select-kelas').value;
    let selNama = document.getElementById('ujian-select-nama');
    
    if(!selKelas) {
        selNama.innerHTML = '<option value="">-- Pilih Kelas Terlebih Dahulu --</option>';
        return;
    }
    
    let siswaArr = (window.adminData[selKelas] || []).sort();
    let htmlOpt = '<option value="">-- Pilih Nama Anda --</option>';
    
    siswaArr.forEach(function(s) {
        htmlOpt += '<option value="' + s + '">' + s + '</option>';
    });
    selNama.innerHTML = htmlOpt;
};

// Fungsi Deteksi Apakah Layar Bersih & Penuh (Tidak Sedang Split-Screen / Floating Window)
window.cekKondisiLayarPenuhDanBersih = function() {
    // 1. Cek apakah fokus diambil oleh aplikasi melayang (Floating App)
    if (!document.hasFocus() || document.hidden) {
        return { aman: false, alasan: "Terdapat aplikasi melayang (Floating App) yang aktif di atas layar." };
    }

    // 2. Bandingkan ukuran layar browser dengan ukuran layar fisik perangkat
    let sw = window.screen.availWidth || window.screen.width || window.innerWidth;
    let sh = window.screen.availHeight || window.screen.height || window.innerHeight;
    let uw = window.outerWidth || window.innerWidth;
    let uh = window.outerHeight || window.innerHeight;

    // Deteksi apakah orientasi layar fisik dan browser berbeda (tanda Split-Screen di HP/Tablet)
    let isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobileDevice) {
        // Di HP/Tablet, jika lebar atau tinggi browser kurang dari 72% layar fisik, berarti sedang Split-Screen atau Pop-up View!
        let minDimScreen = Math.min(sw, sh);
        let maxDimScreen = Math.max(sw, sh);
        let minDimWin = Math.min(window.innerWidth, window.innerHeight);
        let maxDimWin = Math.max(window.innerWidth, window.innerHeight);

        if (minDimWin < minDimScreen * 0.72 || maxDimWin < maxDimScreen * 0.65) {
            return { aman: false, alasan: "Layar terdeteksi tidak penuh (sedang membuka Split-Screen atau Layar Melayang)." };
        }
    } else {
        // Di Laptop/PC, jendela browser harus memenuhi minimal 85% lebar dan 78% tinggi layar monitor
        if (uw < sw * 0.85 || uh < sh * 0.78 || window.innerWidth < sw * 0.80) {
            return { aman: false, alasan: "Jendela browser belum layar penuh (Maximize). Tutup aplikasi samping dan perbesar jendela browser Anda." };
        }
    }

    return { aman: true, alasan: "" };
};

// Fungsi Meminta Fullscreen Otomatis (Menutup Layar Melayang di Android/Laptop)
window.aktifkanFullscreenUjian = function() {
    let elem = document.documentElement;
    try {
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(function() {});
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } catch (e) {}
};

window.verifikasiMasukUjian = function() {
    let kelas = document.getElementById('ujian-select-kelas').value;
    let nama = document.getElementById('ujian-select-nama').value;
    let kode = document.getElementById('input-kode-ujian').value.trim().toUpperCase();

    if(!kelas) return alert("Pilih kelas Anda terlebih dahulu!");
    if(!nama) return alert("Pilih nama Anda terlebih dahulu!");
    if(!kode) return alert("Masukkan Kode Ujian!");

    let ujianAktif = window.adminUjianAktifData[kode];
    if(!ujianAktif) {
        return alert("❌ Kode Ujian tidak valid atau ujian belum diaktifkan oleh guru!");
    }

    let namaPaket = ujianAktif.paket;
    let paketData = window.adminBankUjianData[namaPaket];
    if(!paketData) {
        return alert("❌ Terjadi kesalahan sistem: Paket soal tidak ditemukan.");
    }

    // CEK LAYAR BERSIH & PENUH SEBELUM MASUK UJIAN
    let cekLayar = window.cekKondisiLayarPenuhDanBersih();
    if (!cekLayar.aman) {
        return alert("⚠️ TIDAK DAPAT MEMULAI UJIAN!\n\n" + cekLayar.alasan + "\n\nPastikan layar Anda bersih, penuh (Full Screen), dan tidak membuka aplikasi tambahan sebelum menekan tombol Mulai Ujian.");
    }

    // Paksa masuk ke Fullscreen agar aplikasi melayang tertutup otomatis
    window.graceOrientationTime = Date.now() + 1800;
    window.aktifkanFullscreenUjian();

    window.sesiUjianSiswa = {
        kelas: kelas,
        nama: nama,
        kode: kode,
        paket: namaPaket,
        durasi: ujianAktif.durasi,
        soal: paketData.soal,
        bobot: paketData.bobot,
        jawaban: {}
    };

    window.tutupModal('modal-enter-ujian');
    window.bukaRuangUjianStrict();
};

const modalEnterUjianObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
        if(m.target.id === 'modal-enter-ujian' && m.target.style.display === 'flex') {
            if(typeof window.renderDropdownKelasUjian === "function") window.renderDropdownKelasUjian();
        }
    });
});
if(document.getElementById('modal-enter-ujian')) {
    modalEnterUjianObserver.observe(document.getElementById('modal-enter-ujian'), { attributes: true, attributeFilter: ['style'] });
}

/* =========================================
   LOGIKA RUANG UJIAN KETAT (HEMAT SERVER, OFFLINE-ONLINE, & ANTI-CHEAT PRESISI)
   ========================================= */
window.sedangDialogSistem = false;
window.graceOrientationTime = 0;
window.screenGuardInterval = null;

window.alertAmanUjian = function(pesan) {
    window.sedangDialogSistem = true;
    alert(pesan);
    setTimeout(function() { window.sedangDialogSistem = false; }, 600);
};

window.confirmAmanUjian = function(pesan) {
    window.sedangDialogSistem = true;
    let hasil = confirm(pesan);
    setTimeout(function() { window.sedangDialogSistem = false; }, 600);
    return hasil;
};

window.simpanCadanganLokalUjian = function() {
    if (!window.sesiUjianSiswa) return;
    try {
        let keyCadangan = 'cadangan_ujian_' + window.sesiUjianSiswa.kode + '_' + window.sesiUjianSiswa.kelas + '_' + window.sesiUjianSiswa.nama;
        localStorage.setItem(keyCadangan, JSON.stringify({
            jawaban: window.sesiUjianSiswa.jawaban || {},
            violationCount: window.violationCount || 0,
            sisaDetik: window.sisaDetikUjian || (window.sesiUjianSiswa.durasi * 60)
        }));
    } catch (e) {}
};

window.hapusCadanganLokalUjian = function() {
    if (!window.sesiUjianSiswa) return;
    try {
        let keyCadangan = 'cadangan_ujian_' + window.sesiUjianSiswa.kode + '_' + window.sesiUjianSiswa.kelas + '_' + window.sesiUjianSiswa.nama;
        localStorage.removeItem(keyCadangan);
    } catch (e) {}
};

window.bukaRuangUjianStrict = function() {
    let header = document.getElementById('header-wrap');
    let nav = document.getElementById('main-nav');
    let breadcrumb = document.querySelector('.bottom-breadcrumb-bar');
    if(header) header.style.display = 'none';
    if(nav) nav.style.display = 'none';
    if(breadcrumb) breadcrumb.style.display = 'none';
    
    document.body.style.overflow = 'hidden';
    document.body.classList.add('strict-mode-active');
    
    let room = document.getElementById('ujian-strict-room');
    if(room) room.style.display = 'block';
    let judulUI = document.getElementById('ujian-judul-ui');
    if(judulUI) {
        judulUI.style.color = '#c0392b';
        judulUI.innerText = "🎯 " + window.sesiUjianSiswa.paket;
    }
    let subUI = document.getElementById('ujian-strict-subtitle');
    if(subUI) subUI.innerText = "Mode Ketat: Dilarang Keluar atau Membuka Aplikasi Lain!";

    let pkt = window.sesiUjianSiswa;
    let keyCadangan = 'cadangan_ujian_' + pkt.kode + '_' + pkt.kelas + '_' + pkt.nama;
    let dataLokal = null;
    try {
        let rawLokal = localStorage.getItem(keyCadangan);
        if (rawLokal) dataLokal = JSON.parse(rawLokal);
    } catch (e) {}

    if (dataLokal && dataLokal.jawaban) {
        window.sesiUjianSiswa.jawaban = dataLokal.jawaban;
        window.violationCount = dataLokal.violationCount || 0;
        window.sisaDetikUjian = dataLokal.sisaDetik || (pkt.durasi * 60);
    } else {
        window.sesiUjianSiswa.jawaban = {};
        window.violationCount = 0;
        window.sisaDetikUjian = pkt.durasi * 60;
    }
    
    window.renderSoalUjianSiswa();
    window.mulaiTimerUjian();
    
    window.isPenaltyActive = false;
    window.penaltyInterval = null;
    window.lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    window.initUjianWidth = window.innerWidth;
    window.initUjianHeight = window.innerHeight;
    window.isStrictUjianActive = true;

    // Pemantau Layar Berkala (Mendeteksi Layar Melayang / Split-Screen yang Dibuka Sebelum/Saat Ujian)
    clearInterval(window.screenGuardInterval);
    window.screenGuardInterval = setInterval(function() {
        if (!window.isStrictUjianActive || window.isPenaltyActive || window.sedangDialogSistem) return;
        if (Date.now() < window.graceOrientationTime) return;

        let activeTag = document.activeElement ? document.activeElement.tagName : '';
        let isTypingInput = (activeTag === 'INPUT' || activeTag === 'TEXTAREA');
        if (isTypingInput) return; // Abaikan penyusutan tinggi layar saat keyboard HP muncul

        let statusLayar = window.cekKondisiLayarPenuhDanBersih();
        if (!statusLayar.aman) {
            window.triggerPelanggaran(statusLayar.alasan);
        }
    }, 1500);

    // Kirim status mulai ke Live Monitor, lalu masuk mode hemat server setelah 3 detik
    if(typeof window.simpanStatusLiveMonitorKeDB === "function") {
        if(typeof window.modeHematServerUjian === "function") window.modeHematServerUjian(false);
        window.simpanStatusLiveMonitorKeDB(pkt.paket, pkt.kelas, pkt.nama, {
            kelas: pkt.kelas,
            nama: pkt.nama,
            paket: pkt.paket,
            status: "Sedang Mengerjakan",
            pelanggaran: window.violationCount || 0,
            waktuUpdate: new Date().toISOString()
        });
        setTimeout(function() {
            if (window.isStrictUjianActive && typeof window.modeHematServerUjian === "function") {
                window.modeHematServerUjian(true);
            }
        }, 3000);
    }
};

window.inlineEditSoal = function(tipe, soalIdx, field, optLabel, newText) {
    let isAdmin = sessionStorage.getItem("statusLogin") === "admin";
    if(!isAdmin) return;

    let sesi = tipe === 'latihan' ? window.sesiLatihanSiswa : window.sesiUjianSiswa;
    let q = sesi.soal[soalIdx];

    if(field === 'question') q.question = newText;
    if(field === 'explanation') q.explanation = newText;
    if(field === 'option') {
        let opt = q.options.find(function(o) { return o.label === optLabel; });
        if(opt) opt.text = newText;
    }

    if(tipe === 'latihan') {
        let key = sesi.paketKey;
        if (key && window.adminBankLatihanData[key]) {
            window.adminBankLatihanData[key].soal = sesi.soal;
            if(typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
        }
    } else {
        let key = sesi.paket;
        if (key && window.adminBankUjianData[key]) {
            window.adminBankUjianData[key].soal = sesi.soal;
            if(typeof window.simpanBankUjianKeDB === "function") window.simpanBankUjianKeDB();
        }
    }
};

window.renderSoalUjianSiswa = function() {
    let container = document.getElementById('ujian-strict-container');
    if(!container) return;
    
    let isAdmin = sessionStorage.getItem("statusLogin") === "admin";
    let soalArr = window.sesiUjianSiswa.soal;
    let jawabanTersimpan = window.sesiUjianSiswa.jawaban || {};
    let html = '';

    html += '<div id="banner-status-koneksi-ujian" style="max-width:800px; margin:0 auto 15px auto; padding:8px 15px; border-radius:8px; background:#eafaf1; border:1px solid #a9dfbf; color:#1e8449; font-size:12px; font-weight:bold; text-align:center;">🛡️ Mode Ujian Mandiri Aktif: Jawaban Anda tersimpan otomatis di perangkat dan tetap aman meskipun sinyal internet naik-turun.</div>';
    
    soalArr.forEach(function(q, idx) {
        let qEditAttr = isAdmin ? 'contenteditable="true" style="border-bottom:1px dashed #e67e22; outline:none; cursor:text;" onblur="window.inlineEditSoal(\'ujian\', ' + idx + ', \'question\', null, this.innerText)"' : '';
        let ansLama = jawabanTersimpan[idx];
        
        html += '<div class="quiz-question-card" id="soal-ujian-' + idx + '" style="margin-bottom:25px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">';
        html += '<div class="quiz-question-text" style="font-size:16px;" ' + qEditAttr + '>' + (idx+1) + '. ' + q.question + '</div>';
        
        if(q.type === 'IS' || q.type === 'Essay') {
            let valLama = (typeof ansLama === 'string') ? ansLama.replace(/"/g, '&quot;') : '';
            html += '<input type="text" class="input-box" value="' + valLama + '" placeholder="Ketik jawaban Anda..." style="font-size:15px; font-weight:600; border:2px solid #3498db; width:100%; box-sizing:border-box;" oninput="window.simpanJawabanUjian(' + idx + ', this.value, \'' + q.type + '\', this)">';
        } else if (q.type === 'PG' || q.type === 'PGK') {
            html += '<div class="quiz-options">';
            q.options.forEach(function(opt) {
                let optEditAttr = isAdmin ? 'contenteditable="true" style="border-bottom:1px dashed #e67e22; outline:none; cursor:text; padding:2px;" onclick="event.stopPropagation()" onblur="window.inlineEditSoal(\'ujian\', ' + idx + ', \'option\', \'' + opt.label + '\', this.innerText)"' : '';
                
                if(q.type === 'PG') {
                    let isSelected = (ansLama === opt.label);
                    let stylePG = isSelected ? 'background:#3498db; color:white; border-color:#2980b9; font-weight:bold;' : '';
                    html += '<button type="button" class="quiz-option-btn opsi-ujian-' + idx + '" style="' + stylePG + '" onclick="window.pilihJawabanUjianPG(' + idx + ', \'' + opt.label + '\', this)">' + opt.label + '. <span ' + optEditAttr + '>' + opt.text + '</span></button>';
                } else {
                    let isChecked = Array.isArray(ansLama) && ansLama.includes(opt.label);
                    let stylePGK = isChecked ? 'background:#ebf5fb; border-color:#2980b9; font-weight:bold;' : '';
                    html += '<label id="lbl-ujian-pgk-' + idx + '-' + opt.label + '" class="quiz-option-btn" style="display:flex; align-items:center; gap:10px; cursor:pointer; ' + stylePGK + '">' +
                                '<input type="checkbox" ' + (isChecked ? 'checked' : '') + ' style="width:18px; height:18px; cursor:pointer;" onchange="window.pilihJawabanUjianPGK(' + idx + ', \'' + opt.label + '\', this.checked)">' +
                                '<span ' + optEditAttr + '>' + opt.label + '. ' + opt.text + '</span>' +
                             '</label>';
                }
            });
            html += '</div>';
        }
        html += '</div>';
    });
    
    html += '<div id="box-status-kumpul-offline" style="display:none; max-width:500px; margin:20px auto; padding:15px; border-radius:10px; background:#fef9e7; border:2px solid #f39c12; text-align:center; color:#d35400; font-weight:bold;"></div>';
    html += '<div style="text-align:center; margin-top:30px; margin-bottom:60px;">' +
                '<button id="btn-kumpul-ujian-utama" class="btn-action" style="background:#27ae60; width:100%; max-width:400px; font-size:18px; padding:15px; border-radius:30px;" onclick="window.kumpulkanUjianSiswa()">📥 Kumpulkan Jawaban</button>' +
             '</div>';
             
    container.innerHTML = html;
    
    let exitBtn = document.getElementById('btn-keluar-latihan');
    if(exitBtn) exitBtn.style.display = 'none'; 
};

window.pilihJawabanUjianPG = function(soalIdx, labelPilihan, btnEl) {
    document.querySelectorAll('.opsi-ujian-' + soalIdx).forEach(function(b) {
        b.style.background = 'white'; b.style.color = '#495057';
        b.style.borderColor = '#ced4da'; b.style.fontWeight = 'normal';
    });
    btnEl.style.background = '#3498db'; btnEl.style.color = 'white';
    btnEl.style.borderColor = '#2980b9'; btnEl.style.fontWeight = 'bold';
    
    window.sesiUjianSiswa.jawaban[soalIdx] = labelPilihan;
    window.simpanCadanganLokalUjian();
};

window.pilihJawabanUjianPGK = function(soalIdx, labelPilihan, isChecked) {
    if(!Array.isArray(window.sesiUjianSiswa.jawaban[soalIdx])) {
        window.sesiUjianSiswa.jawaban[soalIdx] = [];
    }
    let arr = window.sesiUjianSiswa.jawaban[soalIdx];
    
    if(isChecked) {
        if(!arr.includes(labelPilihan)) arr.push(labelPilihan);
    } else {
        window.sesiUjianSiswa.jawaban[soalIdx] = arr.filter(function(l) { return l !== labelPilihan; });
    }

    let lblEl = document.getElementById('lbl-ujian-pgk-' + soalIdx + '-' + labelPilihan);
    if (lblEl) {
        lblEl.style.background = isChecked ? '#ebf5fb' : 'white';
        lblEl.style.borderColor = isChecked ? '#2980b9' : '#ced4da';
        lblEl.style.fontWeight = isChecked ? 'bold' : 'normal';
    }
    window.simpanCadanganLokalUjian();
};

window.simpanJawabanUjian = function(soalIdx, nilaiText, tipe, inputEl) {
    if(tipe === 'IS') {
        let trimmed = nilaiText.trim();
        let words = trimmed ? trimmed.split(/\s+/) : [];
        if(words.length > 3) {
            window.alertAmanUjian("⚠️ Isian singkat dibatasi maksimal 3 kata!");
            nilaiText = words.slice(0,3).join(" ");
            if (inputEl) inputEl.value = nilaiText;
        }
    }
    window.sesiUjianSiswa.jawaban[soalIdx] = nilaiText;
    window.simpanCadanganLokalUjian();
};

window.timerIntervalUjian = null;
window.mulaiTimerUjian = function() {
    let timerEl = document.getElementById('ujian-timer-fixed');
    if(timerEl) timerEl.style.display = 'block';
    
    if (typeof window.sisaDetikUjian !== 'number' || window.sisaDetikUjian <= 0) {
        window.sisaDetikUjian = window.sesiUjianSiswa.durasi * 60;
    }
    
    clearInterval(window.timerIntervalUjian);
    window.timerIntervalUjian = setInterval(function() {
        window.sisaDetikUjian--;
        if (window.sisaDetikUjian % 10 === 0) {
            window.simpanCadanganLokalUjian();
        }

        if(window.sisaDetikUjian <= 0) {
            clearInterval(window.timerIntervalUjian);
            timerEl.innerText = "00:00:00";
            window.isStrictUjianActive = false;
            window.alertAmanUjian("⌛ WAKTU HABIS! Jawaban Anda akan dikumpulkan secara otomatis.");
            window.kumpulkanUjianSiswa(true);
            return;
        }
        
        let jam = Math.floor(window.sisaDetikUjian / 3600);
        let mnt = Math.floor((window.sisaDetikUjian % 3600) / 60);
        let dtk = window.sisaDetikUjian % 60;
        
        timerEl.innerText = String(jam).padStart(2, '0') + ":" + String(mnt).padStart(2, '0') + ":" + String(dtk).padStart(2, '0');
            
        if(window.sisaDetikUjian < 300) timerEl.style.background = '#c0392b';
        else timerEl.style.background = '#2c3e50';
        
    }, 1000);
};

// Pengumpul Jawaban (Tetap Mengirim ke Rekap Nilai Meskipun Siswa Kicked 5x Melanggar)
window.kumpulkanUjianSiswa = function(isForce, isKicked) {
    try {
        let forceSubmit = isForce === true;
        let kickedSubmit = isKicked === true;

        if(!forceSubmit) {
            if(!window.confirmAmanUjian("Yakin ingin mengumpulkan jawaban sekarang? Pastikan semua jawaban sudah Anda periksa.")) return;
        }
        
        clearInterval(window.timerIntervalUjian);
        clearInterval(window.penaltyInterval);
        clearInterval(window.screenGuardInterval);
        window.isStrictUjianActive = false; 
        document.body.classList.remove('strict-mode-active');

        // Keluar dari mode Fullscreen setelah ujian selesai
        try {
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(function() {});
            }
        } catch (e) {}

        let pkt = window.sesiUjianSiswa;
        let totalNilai = 0; 
        let hasilDetail = []; 
        
        if(!pkt || !pkt.soal) {
            window.alertAmanUjian("❌ Sesi ujian tidak valid. Anda akan dikembalikan ke beranda.");
            window.location.href = "index.html?bab=home";
            return;
        }

        // Pastikan setiap input teks terakhir di layar ikut dipanen sebelum dinilai
        document.querySelectorAll('#ujian-strict-container input[type="text"]').forEach(function(inp, i) {
            let oninputAttr = inp.getAttribute('oninput') || '';
            let matchIdx = oninputAttr.match(/simpanJawabanUjian\((\d+)/);
            if (matchIdx && matchIdx[1] !== undefined) {
                let sIdx = parseInt(matchIdx[1]);
                if (inp.value && (!pkt.jawaban[sIdx] || pkt.jawaban[sIdx] !== inp.value)) {
                    pkt.jawaban[sIdx] = inp.value.trim();
                }
            }
        });

        let bobotPG = (pkt.bobot && pkt.bobot.PG) ? pkt.bobot.PG : 0;
        let bobotPGK = (pkt.bobot && pkt.bobot.PGK) ? pkt.bobot.PGK : 0;
        let bobotIS = (pkt.bobot && pkt.bobot.IS) ? pkt.bobot.IS : 0;

        pkt.soal.forEach(function(q, idx) {
            let ans = (pkt.jawaban && pkt.jawaban[idx] !== undefined) ? pkt.jawaban[idx] : "";
            let poin = 0; 
            let status = "Salah";
            
            if (q.type === 'PG') {
                if (ans && q.correct && q.correct.includes(ans)) { 
                    poin = bobotPG; 
                    status = "Benar"; 
                }
            } else if (q.type === 'PGK') {
                let studentAnsArr = Array.isArray(ans) ? ans : [];
                let correctCount = 0; 
                let totalOps = (q.options || []).length;
                
                if(totalOps > 0 && studentAnsArr.length > 0) {
                    (q.options || []).forEach(function(opt) {
                        let isExpected = (q.correct || []).includes(opt.label);
                        let isAnswered = studentAnsArr.includes(opt.label);
                        if (isExpected === isAnswered) correctCount++;
                    });
                    poin = (bobotPGK / totalOps) * correctCount;
                    if (correctCount === totalOps) status = "Benar Sempurna";
                    else if (correctCount > 0) status = "Benar Parsial";
                }
            } else if (q.type === 'IS') {
                if (ans && q.correct && q.correct.some(function(k) { return String(ans).toLowerCase().trim() === String(k).toLowerCase().trim(); })) {
                    poin = bobotIS; 
                    status = "Benar";
                }
            } else if (q.type === 'Essay') { 
                poin = 0; 
                status = "Menunggu Guru"; 
            }

            totalNilai += poin;
            hasilDetail.push({ 
                soal: q.question, 
                tipe: q.type, 
                kunci: q.correct || [], 
                jawabSiswa: (ans !== "" && (!Array.isArray(ans) || ans.length > 0)) ? ans : "-", 
                pembahasan: q.explanation || "Tidak ada pembahasan.", 
                poinDidapat: poin, 
                status: status 
            });
        });

        let pathDB = 'admin_rekap_nilai/' + pkt.kelas + '/' + pkt.paket + '/' + pkt.nama;
        let payload = { 
            nilaiAkhir: parseFloat(totalNilai.toFixed(2)), 
            waktuKumpul: new Date().toISOString(), 
            detail: hasilDetail, 
            pelanggaran: window.violationCount || 0 
        };

        if (typeof window.modeHematServerUjian === "function") {
            window.modeHematServerUjian(false);
        }

        let btnKumpul = document.getElementById('btn-kumpul-ujian-utama');
        if (btnKumpul) {
            btnKumpul.disabled = true;
            btnKumpul.innerText = "⏳ Mengirim Jawaban ke Rekap Nilai...";
        }

        window.paketAntreanKumpul = {
            pathDB: pathDB,
            payload: payload,
            pkt: pkt,
            kickedSubmit: kickedSubmit,
            totalNilai: totalNilai,
            hasilDetail: hasilDetail
        };

        window.prosesKirimAntreanUjian();

    } catch(e) {
        console.error("Error Ujian:", e);
        window.alertAmanUjian("Sistem mendeteksi kendala teknis: " + e.message);
    }
};

window.prosesKirimAntreanUjian = function() {
    if (!window.paketAntreanKumpul) return;
    let item = window.paketAntreanKumpul;
    let boxOffline = document.getElementById('box-status-kumpul-offline');
    let btnKumpul = document.getElementById('btn-kumpul-ujian-utama');

    if (!navigator.onLine) {
        if (boxOffline) {
            boxOffline.style.display = 'block';
            boxOffline.innerHTML = '📡 Koneksi internet Anda sedang terputus.<br>Jangan tutup halaman ini! Jawaban Anda sudah dikunci dengan aman dan akan <b>otomatis terkirim ke Rekap Nilai</b> begitu internet tersambung kembali.<br><button class="btn-action" style="background:#e67e22; width:auto; margin-top:10px; padding:8px 16px; font-size:12px;" onclick="window.prosesKirimAntreanUjian()">🔄 Coba Kirim Ulang Sekarang</button>';
        }
        return;
    }

    if (typeof window.modeHematServerUjian === "function") window.modeHematServerUjian(false);

    let fungsiKirim = window.kirimNilaiUjianAmanKeDB || function(p, data, ok) {
        if (typeof window.simpanNilaiUjianKeDB === "function") window.simpanNilaiUjianKeDB(p, data);
        setTimeout(function() { if (ok) ok(); }, 600);
    };

    // Tunggu sampai data benar-benar masuk ke Rekap Nilai Firebase SEBELUM pindah halaman
    fungsiKirim(item.pathDB, item.payload, function() {
        if(typeof window.simpanStatusLiveMonitorKeDB === "function") {
            window.simpanStatusLiveMonitorKeDB(item.pkt.paket, item.pkt.kelas, item.pkt.nama, {
                kelas: item.pkt.kelas,
                nama: item.pkt.nama,
                paket: item.pkt.paket,
                status: item.kickedSubmit ? "Dikeluarkan" : "Selesai",
                pelanggaran: window.violationCount || 0,
                waktuUpdate: new Date().toISOString()
            });
        }

        window.hapusCadanganLokalUjian();
        window.paketAntreanKumpul = null;

        if (item.kickedSubmit) {
            // Beri jeda 400ms agar paket Live Monitor selesai terkirim sebelum halaman dialihkan
            setTimeout(function() {
                document.body.style.overflow = 'auto'; 
                window.location.href = "index.html?bab=home"; 
            }, 400);
        } else {
            window.alertAmanUjian("✅ Jawaban Anda telah berhasil dikumpulkan dan dicatat oleh sistem!");
            window.renderPembahasanUjian(item.totalNilai, item.hasilDetail);
        }
    }, function(err) {
        if (boxOffline) {
            boxOffline.style.display = 'block';
            boxOffline.innerHTML = '⚠️ Gagal menghubungi server karena sinyal lemah.<br>Jawaban Anda tetap aman. Silakan periksa sinyal internet Anda lalu klik tombol di bawah:<br><button class="btn-action" style="background:#e67e22; width:auto; margin-top:10px; padding:8px 16px; font-size:12px;" onclick="window.prosesKirimAntreanUjian()">🔄 Kirim Ulang Jawaban</button>';
        }
        if (btnKumpul) {
            btnKumpul.disabled = false;
            btnKumpul.innerText = "🔄 Kirim Ulang Jawaban";
        }
    });
};

window.addEventListener('online', function() {
    if (window.paketAntreanKumpul) {
        window.prosesKirimAntreanUjian();
    }
});

window.renderPembahasanUjian = function(totalNilai, hasilDetail) {
    let container = document.getElementById('ujian-strict-container');
    if(!container) return;
    
    window.scrollTo(0,0); 
    let roomEl = document.getElementById('ujian-strict-room');
    if(roomEl) roomEl.scrollTo(0,0);

    let headerWrap = document.getElementById('header-wrap');
    let nav = document.getElementById('main-nav');
    if(headerWrap) headerWrap.style.display = 'flex';
    if(nav) nav.style.display = 'block';
    document.body.style.overflow = 'auto'; 

    let judulUI = document.getElementById('ujian-judul-ui');
    if(judulUI) judulUI.innerText = "📈 HASIL & PEMBAHASAN UJIAN";
    let timerEl = document.getElementById('ujian-timer-fixed');
    if(timerEl) timerEl.style.display = 'none';

    let html = '<div style="background:#e8f8f5; border:2px solid #16a085; padding:20px; border-radius:8px; text-align:center; margin-bottom:30px;"><h2 style="color:#2c3e50; margin:0 0 10px 0;">Nilai Akhir Anda</h2><div style="font-size:48px; font-weight:900; color:#16a085;">' + totalNilai.toFixed(1) + '</div></div>';
    
    hasilDetail.forEach(function(h, idx) {
        let badgeColor = h.status.includes('Benar') ? '#27ae60' : (h.status==='Menunggu Guru' ? '#f39c12' : '#c0392b');
        let jawabStr = Array.isArray(h.jawabSiswa) ? h.jawabSiswa.join(', ') : h.jawabSiswa;
        html += '<div class="quiz-question-card" style="margin-bottom:20px; border-left:5px solid ' + badgeColor + '; box-shadow:0 2px 8px rgba(0,0,0,0.05);">' +
            '<div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:10px; flex-wrap:wrap; gap:6px;">' +
                '<span style="font-weight:bold; color:#7f8c8d;">Soal ' + (idx+1) + ' (' + h.tipe + ')</span>' +
                '<span style="background:' + badgeColor + '; color:white; padding:4px 10px; border-radius:12px; font-size:11px; font-weight:bold;">' + h.status + ' (+' + h.poinDidapat.toFixed(1) + ' pt)</span>' +
            '</div>' +
            '<div style="font-size:15px; color:#2c3e50; margin-bottom:15px;">' + h.soal + '</div>' +
            '<div style="background:#f8f9fa; padding:12px; border-radius:6px; font-size:13px; margin-bottom:10px; border:1px solid #e1e8ed;">' +
                '<div style="margin-bottom:8px;"><strong>Jawaban Anda:</strong> <span style="color:#e74c3c; font-weight:bold;">' + jawabStr + '</span></div>' +
                '<div><strong>Kunci Jawaban:</strong> <span style="color:#27ae60; font-weight:bold;">' + (h.kunci || []).join(', ') + '</span></div>' +
            '</div>' +
            '<div style="background:#eef2f3; padding:12px; border-radius:6px; font-size:13px; border-left:3px solid #2980b9;"><strong>💡 Pembahasan:</strong><br><div style="margin-top:5px; line-height:1.5;">' + h.pembahasan + '</div></div>' +
        '</div>';
    });
    
    html += '<div style="text-align:center; margin-top:30px; margin-bottom:50px;"><button class="btn-action" style="background:#c0392b; padding:12px 25px; font-size:14px; border-radius:30px; width:100%; max-width:300px;" onclick="window.location.href=\'index.html?bab=home\'">🚪 Keluar dari Pembahasan</button></div>';
    
    container.innerHTML = html;
};

/* =========================================
   SISTEM KEAMANAN GLOBAL & SENSOR ANTI-CHEAT PRESISI
   ========================================= */
window.lastViolationTime = window.lastViolationTime || 0;
window.blurCheckTimer = null;

document.addEventListener('contextmenu', function(e) { 
    if (sessionStorage.getItem("statusLogin") !== "admin") {
        e.preventDefault(); 
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'AudioVolumeUp' || e.key === 'AudioVolumeDown' || e.key === 'AudioVolumeMute' || e.keyCode === 174 || e.keyCode === 175 || e.keyCode === 173) {
        return;
    }

    if (window.isStrictUjianActive) {
        let isPrintScreen = (e.key === 'PrintScreen' || e.keyCode === 44);
        let isMacShot = (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'));
        let isWinSnip = (e.metaKey && e.shiftKey && (e.key === 'S' || e.key === 's'));
        if (isPrintScreen || isMacShot || isWinSnip) {
            e.preventDefault();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText("Screenshot dilarang selama ujian berlangsung!");
            }
            window.triggerPelanggaran("Terdeteksi melakukan tangkapan layar (Screenshot)!");
            return false;
        }
    }

    if (sessionStorage.getItem("statusLogin") === "admin") return;

    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault(); return false;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault(); return false;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's')) {
        e.preventDefault(); return false;
    }
});

document.addEventListener('keyup', function(e) {
    if (window.isStrictUjianActive && (e.key === 'PrintScreen' || e.keyCode === 44)) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText("Screenshot dilarang selama ujian berlangsung!");
        }
        window.triggerPelanggaran("Terdeteksi menekan tombol Screenshot!");
    }
});

window.triggerPelanggaran = function(alasanKhusus) {
    if(!window.isStrictUjianActive || window.sedangDialogSistem) return;
    
    // PENGECUALIAN MUTLAK: Admin kebal terhadap semua sensor pelanggaran ujian
    if (sessionStorage.getItem("statusLogin") === "admin") {
        console.log("Sensor diabaikan: Admin sedang memantau ruang ujian.");
        return;
    }

    let now = Date.now();
    if(now - window.lastViolationTime < 1200) return; 
    window.lastViolationTime = now;

    window.violationCount++;
    window.simpanCadanganLokalUjian();
    clearInterval(window.penaltyInterval); 

    if(typeof window.simpanStatusLiveMonitorKeDB === "function" && window.sesiUjianSiswa) {
        let pkt = window.sesiUjianSiswa;
        if (typeof window.modeHematServerUjian === "function") window.modeHematServerUjian(false);
        window.simpanStatusLiveMonitorKeDB(pkt.paket, pkt.kelas, pkt.nama, {
            kelas: pkt.kelas,
            nama: pkt.nama,
            paket: pkt.paket,
            status: window.violationCount >= 5 ? "Dikeluarkan" : "Sedang Mengerjakan",
            pelanggaran: window.violationCount,
            waktuUpdate: new Date().toISOString()
        });
        if (window.violationCount < 5) {
            setTimeout(function() {
                if (window.isStrictUjianActive && typeof window.modeHematServerUjian === "function") {
                    window.modeHematServerUjian(true);
                }
            }, 3000);
        }
    }
    
    let overlay = document.getElementById('strict-warning-overlay');
    let info = document.getElementById('strict-warning-info');
    let countdownEl = document.getElementById('strict-countdown');
    
    overlay.style.display = 'flex';
    
    if(window.violationCount === 1) window.penaltyWaitTime = 600;
    else if(window.violationCount === 2) window.penaltyWaitTime = 1000;
    else if(window.violationCount === 3) window.penaltyWaitTime = 2000; 
    else if(window.violationCount === 4) window.penaltyWaitTime = 3000; 
    else if(window.violationCount >= 5) {
        overlay.style.display = 'none';
        window.isStrictUjianActive = false;
        window.alertAmanUjian("❌ PELANGGARAN MAKSIMAL (5x)!\n\nSistem mendeteksi aktivitas mencurigakan berulang kali. Ujian dihentikan paksa dan hasil pekerjaan Anda telah dikirim ke Rekap Nilai Guru!");
        window.kumpulkanUjianSiswa(true, true); 
        return;
    }

    window.isPenaltyActive = true;
    let teksAlasan = alasanKhusus ? ' (' + alasanKhusus + ')' : '';
    info.innerText = 'Pelanggaran ke-' + window.violationCount + '/5!' + teksAlasan + ' ' + (window.violationCount === 4 ? '(PERINGATAN TERAKHIR!)' : '');
    countdownEl.innerText = window.penaltyWaitTime;

    window.penaltyInterval = setInterval(function() {
        window.penaltyWaitTime--;
        countdownEl.innerText = window.penaltyWaitTime;
        
        if(window.penaltyWaitTime <= 0) {
            clearInterval(window.penaltyInterval);
            overlay.style.display = 'none';
            window.isPenaltyActive = false;
        }
    }, 1000);
};

window.cancelHukuman = function() {
    clearInterval(window.penaltyInterval);
    document.getElementById('strict-warning-overlay').style.display = 'none';
    window.isPenaltyActive = false;
    window.alertAmanUjian("Kunci penalti berhasil dibuka oleh Guru.");
};

document.addEventListener("visibilitychange", function() {
    if (document.hidden && window.isStrictUjianActive && !window.sedangDialogSistem) {
        window.triggerPelanggaran("Keluar dari tab atau menutup layar aplikasi");
    }
});

window.addEventListener("blur", function() {
    if (!window.isStrictUjianActive || window.sedangDialogSistem) return;
    clearTimeout(window.blurCheckTimer);
    window.blurCheckTimer = setTimeout(function() {
        if (window.isStrictUjianActive && !window.sedangDialogSistem && (!document.hasFocus() || document.hidden)) {
            window.triggerPelanggaran("Membuka aplikasi pihak ketiga atau layar melayang");
        }
    }, 350);
});

window.addEventListener("focus", function() {
    clearTimeout(window.blurCheckTimer);
});

window.addEventListener("orientationchange", function() {
    window.graceOrientationTime = Date.now() + 1200;
    setTimeout(function() {
        window.lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        window.initUjianWidth = window.innerWidth;
        window.initUjianHeight = window.innerHeight;
    }, 500);
});

window.addEventListener("resize", function() {
    if(!window.isStrictUjianActive || window.sedangDialogSistem) return;
    
    if (Date.now() < window.graceOrientationTime) {
        window.lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        window.initUjianWidth = window.innerWidth;
        window.initUjianHeight = window.innerHeight;
        return;
    }

    let currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    if(currentOrientation !== window.lastOrientation) {
        window.graceOrientationTime = Date.now() + 1000;
        window.lastOrientation = currentOrientation; 
        window.initUjianWidth = window.innerWidth;
        window.initUjianHeight = window.innerHeight;
        return; 
    }
    
    let activeTag = document.activeElement ? document.activeElement.tagName : '';
    let isTypingInput = (activeTag === 'INPUT' || activeTag === 'TEXTAREA');

    if(Math.abs(window.innerWidth - window.initUjianWidth) > 45) {
        window.initUjianWidth = window.innerWidth;
        window.triggerPelanggaran("Mengubah ukuran layar atau membuka Split-Screen");
        return;
    }

    if (!isTypingInput && window.initUjianHeight && (window.initUjianHeight - window.innerHeight > window.initUjianHeight * 0.35)) {
        window.initUjianHeight = window.innerHeight;
        window.triggerPelanggaran("Membagi layar (Split-Screen)");
    }
});

/* =========================================
   LOGIKA REKAP NILAI (LEDGER & EXPORT)
   ========================================= */
window.adminRekapNilaiData = window.adminRekapNilaiData || {};

window.renderDropdownRekap = function() {
    let selKelas = document.getElementById('filter-rekap-kelas');
    let selPaket = document.getElementById('filter-rekap-paket');
    if(!selKelas || !selPaket) return;
    
    let kelasAktif = selKelas.value;
    let paketAktif = selPaket.value;

    let kelasArr = Object.keys(window.adminData || {}).sort();
    let htmlK = '<option value="">-- Pilih Kelas --</option>';
    kelasArr.forEach(function(k) { htmlK += '<option value="' + k + '" ' + (k===kelasAktif?'selected':'') + '>' + k + '</option>'; });
    selKelas.innerHTML = htmlK;

    let bankKeys = Object.keys(window.adminBankUjianData || {}).sort();
    let htmlP = '<option value="">-- Pilih Paket Ujian --</option>';
    bankKeys.forEach(function(p) { htmlP += '<option value="' + p + '" ' + (p===paketAktif?'selected':'') + '>' + p + '</option>'; });
    selPaket.innerHTML = htmlP;
    
    window.renderRekapNilai();
};

window.renderRekapNilai = function() {
    let selKelas = document.getElementById('filter-rekap-kelas').value;
    let selPaket = document.getElementById('filter-rekap-paket').value;
    let tbody = document.getElementById('body-rekap-nilai');
    if(!tbody) return;
    
    if(!selKelas || !selPaket) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding:20px; color:#7f8c8d; font-weight:bold;">Pilih Kelas dan Paket Ujian di atas untuk melihat ledger.</td></tr>';
        return;
    }
    
    let dataSiswa = (window.adminRekapNilaiData[selKelas] && window.adminRekapNilaiData[selKelas][selPaket]) ? window.adminRekapNilaiData[selKelas][selPaket] : {};
    let namaSiswaArr = Object.keys(dataSiswa).sort();
    
    if(namaSiswaArr.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding:20px; color:#e67e22; font-weight:bold;">Belum ada siswa dari kelas ' + selKelas + ' yang mengumpulkan ujian ' + selPaket + '.</td></tr>';
        return;
    }

    let html = '';
    namaSiswaArr.forEach(function(nama, idx) {
        let d = dataSiswa[nama];
        let dDateObj = new Date(d.waktuKumpul);
        let dDate = dDateObj.getHours().toString().padStart(2,'0')+':'+dDateObj.getMinutes().toString().padStart(2,'0')+' - '+dDateObj.getDate().toString().padStart(2,'0')+'/'+(dDateObj.getMonth()+1).toString().padStart(2,'0');
        
        let badgePelanggaran = d.pelanggaran >= 5 ? '<span style="background:#c0392b; color:white; padding:3px 8px; border-radius:12px; font-size:10px; font-weight:bold;">KICKED (' + d.pelanggaran + 'x)</span>' : (d.pelanggaran > 0 ? '<span style="background:#f39c12; color:white; padding:3px 8px; border-radius:12px; font-size:10px; font-weight:bold;">' + d.pelanggaran + 'x</span>' : '<span style="color:#27ae60; font-weight:bold;">Aman</span>');
        
        let perluPeriksa = false;
        if(d.detail) {
            perluPeriksa = d.detail.some(function(x) {
                return x.status === 'Menunggu Guru' || (x.tipe === 'IS' && x.poinDidapat <= 0);
            });
        }
        
        let btnKoreksi = perluPeriksa ? 
            '<button style="background:#8e44ad; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;" data-k="' + selKelas + '" data-p="' + selPaket + '" data-n="' + nama + '" onclick="window.bukaKoreksiUjian(this)">✏️ Periksa / Koreksi</button>' :
            '<button style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;" data-k="' + selKelas + '" data-p="' + selPaket + '" data-n="' + nama + '" onclick="window.bukaKoreksiUjian(this)">👁️ Lihat Detail</button>';

        html += '<tr style="border-bottom:1px solid #eee;">' +
            '<td style="color:#7f8c8d; font-weight:bold;">' + (idx+1) + '</td>' +
            '<td style="text-align:left; font-weight:bold; color:#2c3e50;">' + nama + '</td>' +
            '<td style="font-size:11px; color:#7f8c8d; font-weight:bold;">' + dDate + '</td>' +
            '<td>' + badgePelanggaran + '</td>' +
            '<td style="font-size:18px; font-weight:900; color:#16a085;">' + d.nilaiAkhir + '</td>' +
            '<td>' + btnKoreksi + '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
};

window.exportExcelRekapNilai = function() {
    let selKelas = document.getElementById('filter-rekap-kelas').value;
    let selPaket = document.getElementById('filter-rekap-paket').value;
    if(!selKelas || !selPaket) return alert("Pilih kelas dan paket terlebih dahulu!");
    
    let dataSiswa = (window.adminRekapNilaiData[selKelas] && window.adminRekapNilaiData[selKelas][selPaket]) ? window.adminRekapNilaiData[selKelas][selPaket] : {};
    let namaSiswaArr = Object.keys(dataSiswa).sort();
    if(namaSiswaArr.length === 0) return alert("Tidak ada data nilai!");

    let bankPaket = window.adminBankUjianData[selPaket] || {};
    let bankSoal = bankPaket.soal || [];
    let bobot = bankPaket.bobot || {PG:0, PGK:0, IS:0, Essay:0};
    if(bankSoal.length === 0 && namaSiswaArr.length > 0) bankSoal = dataSiswa[namaSiswaArr[0]].detail; 

    let pgCount = 0, pgkCount = 0, isCount = 0, esCount = 0;
    bankSoal.forEach(function(q) {
        let tipe = q.tipe || q.type;
        if(tipe === 'PG') pgCount++;
        else if(tipe === 'PGK') pgkCount++;
        else if(tipe === 'IS' || tipe === 'Isian') isCount++;
        else if(tipe === 'Essay') esCount++;
    });

    let offsetTabelBobot = 2 + pgCount + pgkCount - 1;
    if(offsetTabelBobot < 2) offsetTabelBobot = 2;

    let bPG = Number(bobot.PG.toFixed(2));
    let bPGK = Number(bobot.PGK.toFixed(2));
    let bIS = Number(bobot.IS.toFixed(2));
    let bESS = Number(bobot.Essay.toFixed(2));

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
    '<head><meta charset="utf-8"><style>' +
        'table { border-collapse: collapse; font-family: Calibri, sans-serif; font-size: 12px; }' +
        'th, td { border: 1px solid #000000; padding: 6px; text-align: center; vertical-align: middle; }' +
        '.text-left { text-align: left; }' +
        '.bg-header { background-color: #f2f2f2; font-weight: bold; }' +
        '.bg-title { font-size: 16px; font-weight: bold; border: none; text-align: center; }' +
        '.no-border { border: none; }' +
    '</style></head><body><table>' +
        '<tr><td colspan="' + (2 + pgCount + pgkCount + isCount + esCount + 1) + '" class="bg-title">Ledger Siswa</td></tr>' +
        '<tr><td colspan="' + (2 + pgCount + pgkCount + isCount + esCount + 1) + '" class="no-border"></td></tr>' +
        '<tr><td colspan="2" class="text-left no-border" style="font-weight:bold;">Kelas: ' + selKelas + '</td>';
    for(let i=0; i<offsetTabelBobot - 2; i++) html += '<td class="no-border"></td>';
    if(pgCount > 0) html += '<td class="bg-header">PG</td>';
    if(pgkCount > 0) html += '<td class="bg-header">PGK</td>';
    if(isCount > 0) html += '<td class="bg-header">IS</td>';
    if(esCount > 0) html += '<td class="bg-header">ESS</td>';
    
    html += '</tr><tr><td colspan="2" class="text-left no-border" style="font-weight:bold;">Ujian: ' + selPaket + '</td>';
    for(let i=0; i<offsetTabelBobot - 2; i++) html += '<td class="no-border"></td>';
    if(pgCount > 0) html += '<td>' + bPG + '</td>';
    if(pgkCount > 0) html += '<td>' + bPGK + '</td>';
    if(isCount > 0) html += '<td>' + bIS + '</td>';
    if(esCount > 0) html += '<td>' + bESS + '</td>';
    html += '</tr><tr><td colspan="' + (2 + pgCount + pgkCount + isCount + esCount + 1) + '" class="no-border"></td></tr>';

    html += '<tr><td rowspan="2" class="bg-header">No</td><td rowspan="2" class="bg-header text-left" style="width:200px;">Nama Siswa</td>';
    if(pgCount > 0) html += '<td colspan="' + pgCount + '" class="bg-header">Pilihan Ganda</td>';
    if(pgkCount > 0) html += '<td colspan="' + pgkCount + '" class="bg-header">Pilihan Ganda Kompleks</td>';
    if(isCount > 0) html += '<td colspan="' + isCount + '" class="bg-header">Isian</td>';
    if(esCount > 0) html += '<td colspan="' + esCount + '" class="bg-header">Essay</td>';
    html += '<td rowspan="2" class="bg-header">Nilai Akhir</td></tr><tr>';

    for(let i=1; i<=pgCount; i++) html += '<td class="bg-header">' + i + '</td>';
    for(let i=1; i<=pgkCount; i++) html += '<td class="bg-header">' + i + '</td>';
    for(let i=1; i<=isCount; i++) html += '<td class="bg-header">' + i + '</td>';
    for(let i=1; i<=esCount; i++) html += '<td class="bg-header">' + i + '</td>';
    html += '</tr>';

    namaSiswaArr.forEach(function(nama, idx) {
        let d = dataSiswa[nama];
        html += '<tr><td>' + (idx+1) + '</td><td class="text-left">' + nama + '</td>';
        d.detail.forEach(function(h) {
            if(h.tipe === 'PG') {
                let ans = Array.isArray(h.jawabSiswa) ? h.jawabSiswa[0] : h.jawabSiswa;
                html += '<td>' + (ans||'').toLowerCase() + '</td>';
            } else if(h.tipe === 'PGK') {
                let frac = bobot.PGK > 0 ? (h.poinDidapat / bobot.PGK) : 0;
                html += '<td>' + Number(frac.toFixed(2)) + '</td>';
            } else if(h.tipe === 'IS' || h.tipe === 'Isian') {
                html += '<td>' + (h.poinDidapat > 0 ? 1 : 0) + '</td>';
            } else if(h.tipe === 'Essay') {
                let frac = bobot.Essay > 0 ? (h.poinDidapat / bobot.Essay) : 0;
                html += '<td>' + Number(frac.toFixed(2)) + '</td>';
            }
        });
        html += '<td style="font-weight:bold;">' + d.nilaiAkhir + '</td></tr>';
    });

    html += '</table></body></html>';

    let blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = 'Ledger_' + selKelas + '_' + selPaket.replace(/\s+/g, '_') + '.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const modalRekapObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
        if(m.target.id === 'modal-rekap-nilai' && m.target.style.display === 'flex') {
            if(typeof window.renderDropdownRekap === "function") window.renderDropdownRekap();
        }
    });
});
if(document.getElementById('modal-rekap-nilai')) {
    modalRekapObserver.observe(document.getElementById('modal-rekap-nilai'), { attributes: true, attributeFilter: ['style'] });
}

/* =========================================
   LOGIKA KOREKSI ESSAY & DETAIL JAWABAN (BELUM BENAR DI ATAS, SUDAH BENAR DI BAWAH)
   ========================================= */
window.koreksiDataBuffer = {}; 

window.bukaKoreksiUjian = function(btnElement) {
    let k = btnElement.getAttribute('data-k');
    let p = btnElement.getAttribute('data-p');
    let n = btnElement.getAttribute('data-n');
    window.tempKoreksiTarget = { kelas: k, paket: p };
    window.muatDataKoreksi(n);
};

window.gantiSiswaKoreksi = function() {
    let n = document.getElementById('koreksi-select-siswa').value;
    window.muatDataKoreksi(n);
};

// Fungsi Tombol "☑️ Centang Semua"
window.centangSemuaKoreksi = function() {
    document.querySelectorAll('#koreksi-grid-container input[type="checkbox"][id^="chk-koreksi-"]').forEach(function(chk) {
        chk.checked = true;
    });
    document.querySelectorAll('#koreksi-grid-container input[type="number"][id^="input-koreksi-"]').forEach(function(inp) {
        inp.value = "1.00";
    });
    window.hitungSkorLiveKoreksi();
};

window.muatDataKoreksi = function(namaSiswa) {
    let t = window.tempKoreksiTarget;
    let dataSiswa = window.adminRekapNilaiData[t.kelas][t.paket][namaSiswa];
    t.nama = namaSiswa; t.data = dataSiswa;

    let sel = document.getElementById('koreksi-select-siswa');
    let allStudents = Object.keys(window.adminRekapNilaiData[t.kelas][t.paket]).sort();
    let opt = '';
    allStudents.forEach(function(s) { opt += '<option value="' + s + '" ' + (s===namaSiswa?'selected':'') + '>' + s + '</option>'; });
    sel.innerHTML = opt;

    let badgePelanggaran = dataSiswa.pelanggaran > 0 ? '<span style="background:#e74c3c; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">⚠️ ' + dataSiswa.pelanggaran + 'x Pelanggaran</span>' : '<span style="background:#27ae60; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">✅ Aman</span>';
    document.getElementById('koreksi-info-badges').innerHTML = '<span style="background:#2980b9; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">' + t.kelas + '</span> <span style="background:#8e44ad; color:white; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold;">' + t.paket + '</span> ' + badgePelanggaran;
    
    let grid = document.getElementById('koreksi-grid-container');
    let bankData = window.adminBankUjianData[t.paket];
    let maxPoinIS = bankData ? bankData.bobot.IS : 0;
    let maxPoinEssay = bankData ? bankData.bobot.Essay : 0;

    // Pisahkan kartu soal yang BELUM tercentang benar (Atas) dan yang SUDAH tercentang benar (Bawah)
    let grupBelumBenar = [];
    let grupSudahBenar = [];
    
    dataSiswa.detail.forEach(function(h, idx) {
        if (h.tipe === 'IS' || h.tipe === 'Essay') {
            let isEssay = h.tipe === 'Essay';
            let maxP = isEssay ? maxPoinEssay : maxPoinIS;
            let fraksiSkor = maxP > 0 ? (h.poinDidapat / maxP) : 0; 
            let sudahBenar = isEssay ? (fraksiSkor >= 1 && h.status !== 'Menunggu Guru') : (h.poinDidapat > 0);

            let uiKoreksiGuru = '';
            if(isEssay) {
                uiKoreksiGuru = '<div style="flex:1; min-width:220px; background:#fdf2e9; border:1px solid #edbb99; border-radius:6px; padding:10px; display:flex; justify-content:space-between; align-items:center;">' +
                    '<div><div style="font-size:10px; font-weight:bold; color:#d35400; margin-bottom:3px; text-transform:uppercase;">Koreksi Essay</div><div style="font-size:11px; color:#ba4a00;">Input fraksi (0.0 - 1.0)</div></div>' +
                    '<input type="number" id="input-koreksi-' + idx + '" step="0.1" min="0" max="1" value="' + fraksiSkor.toFixed(2) + '" style="width:60px; padding:5px; text-align:center; font-weight:bold; border:2px solid #d35400; border-radius:4px; color:#d35400; background:white; font-size:14px;" oninput="window.hitungSkorLiveKoreksi()">' +
                '</div>';
            } else {
                let isChecked = (h.poinDidapat > 0) ? 'checked' : '';
                uiKoreksiGuru = '<div style="flex:1; min-width:220px; background:#eafaf1; border:1px solid #a9dfbf; border-radius:6px; padding:10px; display:flex; justify-content:space-between; align-items:center;">' +
                    '<div><div style="font-size:10px; font-weight:bold; color:#27ae60; margin-bottom:3px; text-transform:uppercase;">Koreksi Guru</div><div style="font-size:11px; color:#1e8449;">Klik centang jika benar</div></div>' +
                    '<label style="cursor:pointer; display:flex; align-items:center; gap:8px; background:white; padding:6px 10px; border-radius:6px; border:1px solid #27ae60;">' +
                        '<span style="font-size:12px; font-weight:bold; color:#27ae60;">BENAR</span>' +
                        '<input type="checkbox" id="chk-koreksi-' + idx + '" style="width:20px; height:20px; cursor:pointer; accent-color:#16a085;" onchange="window.hitungSkorLiveKoreksi()" ' + isChecked + '>' +
                    '</label>' +
                '</div>';
            }
            
            let borderLeftColor = sudahBenar ? '#27ae60' : '#e67e22';
            let cardHTML = '<div style="background:#ffffff; border:1px solid #e1e8ed; border-left:5px solid ' + borderLeftColor + '; border-radius:8px; overflow:hidden; box-shadow:0 2px 4px rgba(0,0,0,0.02);">' +
                '<div style="background:#f8f9fa; padding:8px 15px; border-bottom:1px solid #e1e8ed; display:flex; justify-content:space-between; align-items:center;">' +
                    '<span style="font-weight:bold; color:#2c3e50; font-size:13px;">Soal ' + (idx+1) + ' <span style="font-size:11px; color:#7f8c8d; font-weight:normal; margin-left:5px;">(' + h.tipe + ')</span></span>' +
                    '<span style="background:#ecf0f1; color:#34495e; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:bold;">Maks: ' + maxP.toFixed(2) + ' pt</span>' +
                '</div>' +
                '<div style="padding:12px 15px;">' +
                    '<div style="font-size:14px; color:#2c3e50; margin-bottom:12px; line-height:1.4;">' + h.soal + '</div>' +
                    '<div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">' +
                        '<div style="flex:1; min-width:220px; background:#fdfefe; border:1px solid #d5dbdb; border-radius:6px; padding:10px;">' +
                            '<div style="font-size:10px; font-weight:bold; color:#7f8c8d; margin-bottom:5px; text-transform:uppercase;">Jawaban Siswa</div>' +
                            '<div style="font-size:14px; color:#c0392b; font-weight:600;">' + h.jawabSiswa + '</div>' +
                        '</div>' +
                        uiKoreksiGuru +
                    '</div>' +
                    '<div style="background:#f4f6f6; border-radius:6px; padding:10px 12px; font-size:12px; color:#34495e; border-left:3px solid #3498db;">' +
                        '<strong style="color:#2980b9;">💡 Kunci: ' + (h.kunci || []).join(' | ') + '</strong> <br>' +
                        '<div style="margin-top:4px; line-height:1.4;">' + h.pembahasan + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

            if (sudahBenar) {
                grupSudahBenar.push(cardHTML);
            } else {
                grupBelumBenar.push(cardHTML);
            }
        }
    });

    let finalHTML = '';
    if (grupBelumBenar.length > 0) {
        finalHTML += '<div style="background:#fef9e7; border:1px solid #f9e79f; color:#d35400; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:bold;">🔍 Perlu Diperiksa Manual / Belum Tercentang Benar (' + grupBelumBenar.length + ' Soal)</div>';
        finalHTML += grupBelumBenar.join('');
    }
    if (grupSudahBenar.length > 0) {
        finalHTML += '<div style="background:#eafaf1; border:1px solid #a9dfbf; color:#1e8449; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:bold; margin-top:10px;">✅ Sudah Terdeteksi / Tercentang Benar (' + grupSudahBenar.length + ' Soal)</div>';
        finalHTML += grupSudahBenar.join('');
    }
    if (grupBelumBenar.length === 0 && grupSudahBenar.length === 0) {
        finalHTML = '<div style="text-align:center; padding:30px; color:#7f8c8d; font-weight:bold;">Tidak ada soal Isian Singkat atau Essay pada paket ujian ini.</div>';
    }

    grid.innerHTML = finalHTML;
    window.hitungSkorLiveKoreksi();
    window.bukaModal('modal-koreksi-ujian');
};

window.hitungSkorLiveKoreksi = function() {
    let t = window.tempKoreksiTarget;
    let bankData = window.adminBankUjianData[t.paket];
    let maxPoinIS = bankData ? bankData.bobot.IS : 0;
    let maxPoinEssay = bankData ? bankData.bobot.Essay : 0;

    let total = 0;
    t.data.detail.forEach(function(h, idx) {
        if(h.tipe === 'PG' || h.tipe === 'PGK') {
            total += h.poinDidapat;
        } else if(h.tipe === 'IS' || h.tipe === 'Isian') {
            let chk = document.getElementById('chk-koreksi-' + idx);
            if(chk && chk.checked) total += maxPoinIS;
        } else if(h.tipe === 'Essay') {
            let inp = document.getElementById('input-koreksi-' + idx);
            if(inp) {
                let val = parseFloat(inp.value) || 0;
                if(val > 1) val = 1; 
                if(val < 0) val = 0;
                total += (val * maxPoinEssay);
            }
        }
    });
    document.getElementById('koreksi-nilai-live').innerText = total.toFixed(2);
};

window.simpanKoreksiManual = function() {
    let t = window.tempKoreksiTarget;
    let bankData = window.adminBankUjianData[t.paket];
    let maxPoinIS = bankData ? bankData.bobot.IS : 0;
    let maxPoinEssay = bankData ? bankData.bobot.Essay : 0;

    let updateDetail = [...t.data.detail];
    let totalPoinBaru = 0;

    updateDetail.forEach(function(h, idx) {
        if(h.tipe === 'PG' || h.tipe === 'PGK') {
            totalPoinBaru += h.poinDidapat;
        } else if(h.tipe === 'IS' || h.tipe === 'Isian') {
            let chk = document.getElementById('chk-koreksi-' + idx);
            let isChecked = chk ? chk.checked : false;
            h.poinDidapat = isChecked ? maxPoinIS : 0;
            h.status = isChecked ? "Benar" : "Salah";
            totalPoinBaru += h.poinDidapat;
        } else if(h.tipe === 'Essay') {
            let inp = document.getElementById('input-koreksi-' + idx);
            let val = inp ? parseFloat(inp.value) : 0;
            if(isNaN(val)) val = 0; if(val > 1) val = 1; if(val < 0) val = 0;
            
            h.poinDidapat = (val * maxPoinEssay);
            h.status = val === 1 ? "Benar Sempurna" : (val > 0 ? "Benar Parsial" : "Salah");
            totalPoinBaru += h.poinDidapat;
        }
    });

    t.data.nilaiAkhir = parseFloat(totalPoinBaru.toFixed(2));
    t.data.detail = updateDetail;
    window.adminRekapNilaiData[t.kelas][t.paket][t.nama] = t.data;
    
    let pathDB = 'admin_rekap_nilai/' + t.kelas + '/' + t.paket + '/' + t.nama;
    if(typeof window.simpanNilaiUjianKeDB === "function") window.simpanNilaiUjianKeDB(pathDB, t.data);

    alert("✅ Nilai berhasil diperbarui ke database!");
    window.muatDataKoreksi(t.nama); // Susun ulang otomatis: yang baru dicentang benar langsung turun ke bawah!
    window.renderRekapNilai(); 
};
    
/* =========================================
   LOGIKA GERBANG & RUANG LATIHAN SISWA (SINKRON C1, C2, HOTS)
   ========================================= */
window.renderDropdownLatihan = function() {
    let selKelas = document.getElementById('latihan-select-kelas');
    if(!selKelas) return;
    
    let bank = window.adminBankLatihanData || {};
    let kelasSet = new Set();
    Object.values(bank).forEach(function(item) { if (item && item.kelas) kelasSet.add(item.kelas); });

    let html = '<option value="">-- Pilih Kelas Anda --</option>';
    Array.from(kelasSet).sort().forEach(function(k) { html += '<option value="' + k + '">' + k + '</option>'; });
    selKelas.innerHTML = html;

    document.getElementById('latihan-select-mapel').innerHTML = '<option value="">-- Pilih Kelas Dahulu --</option>';
    document.getElementById('latihan-select-bab').innerHTML = '<option value="">-- Pilih Mapel Dahulu --</option>';
    let selKes = document.getElementById('latihan-select-kesulitan');
    if (selKes) selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
};

window.updateDropdownLatihanMapel = function() {
    let kelas = document.getElementById('latihan-select-kelas').value;
    let selMapel = document.getElementById('latihan-select-mapel');
    let selKes = document.getElementById('latihan-select-kesulitan');
    
    if(!kelas) {
        selMapel.innerHTML = '<option value="">-- Pilih Kelas Dahulu --</option>';
        document.getElementById('latihan-select-bab').innerHTML = '<option value="">-- Pilih Mapel Dahulu --</option>';
        if (selKes) selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
        return;
    }

    let bank = window.adminBankLatihanData || {};
    let mapelSet = new Set();
    Object.values(bank).forEach(function(item) { if(item && item.kelas === kelas) mapelSet.add(item.mapel); });

    let html = '<option value="">-- Pilih Mata Pelajaran --</option>';
    Array.from(mapelSet).sort().forEach(function(m) { html += '<option value="' + m + '">' + m + '</option>'; });
    selMapel.innerHTML = html;
    document.getElementById('latihan-select-bab').innerHTML = '<option value="">-- Pilih Mapel Dahulu --</option>';
    if (selKes) selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
};

window.updateDropdownLatihanBab = function() {
    let kelas = document.getElementById('latihan-select-kelas').value;
    let mapel = document.getElementById('latihan-select-mapel').value;
    let selBab = document.getElementById('latihan-select-bab');
    let selKes = document.getElementById('latihan-select-kesulitan');

    if(!mapel) {
        selBab.innerHTML = '<option value="">-- Pilih Mapel Dahulu --</option>';
        if (selKes) selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
        return;
    }

    let bank = window.adminBankLatihanData || {};
    let babSet = new Set();

    Object.keys(bank).forEach(function(k) {
        let item = bank[k];
        if(item && item.kelas === kelas && item.mapel === mapel && item.bab) {
            babSet.add(item.bab);
        }
    });

    let html = '<option value="">-- Pilih Bab Materi --</option>';
    Array.from(babSet).sort().forEach(function(b) {
        html += '<option value="' + b + '">' + b + '</option>';
    });
    selBab.innerHTML = html;
    if (selKes) selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
};

window.updateDropdownLatihanKesulitan = function() {
    let kelas = document.getElementById('latihan-select-kelas').value;
    let mapel = document.getElementById('latihan-select-mapel').value;
    let bab = document.getElementById('latihan-select-bab').value;
    let selKes = document.getElementById('latihan-select-kesulitan');
    if (!selKes) return;

    if (!bab) {
        selKes.innerHTML = '<option value="">-- Pilih Bab Dahulu --</option>';
        return;
    }

    let bank = window.adminBankLatihanData || {};
    let urutanLevel = { 'C1': 1, 'C2': 2, 'HOTS': 3 };
    let ditemukan = [];

    Object.keys(bank).forEach(function(k) {
        let item = bank[k];
        if (item && item.kelas === kelas && item.mapel === mapel && item.bab === bab) {
            let arrSoal = Array.isArray(item.soal) ? item.soal : Object.values(item.soal || {});
            ditemukan.push({ key: k, kesulitan: item.kesulitan, jml: arrSoal.length });
        }
    });

    ditemukan.sort(function(a, b) {
        return (urutanLevel[a.kesulitan] || 99) - (urutanLevel[b.kesulitan] || 99);
    });

    let html = '<option value="">-- Pilih Tingkat Kesulitan (C1 / C2 / HOTS) --</option>';
    ditemukan.forEach(function(d) {
        html += '<option value="' + d.key + '">Tingkat ' + d.kesulitan + ' (' + d.jml + ' Soal)</option>';
    });
    selKes.innerHTML = html;

    if (ditemukan.length === 1) {
        selKes.value = ditemukan[0].key;
    }
};

window.sesiLatihanSiswa = null;

window.mulaiLatihanSiswa = function() {
    let selKes = document.getElementById('latihan-select-kesulitan');
    let key = (selKes && selKes.value) ? selKes.value : document.getElementById('latihan-select-bab').value;
    if(!key) return alert("Pilih Bab dan Tingkat Kesulitan (C1 / C2 / HOTS) terlebih dahulu!");

    let paketData = window.adminBankLatihanData ? window.adminBankLatihanData[key] : null;
    if (!paketData) return alert("Paket latihan tidak ditemukan di arsip!");

    let rawSoal = Array.isArray(paketData.soal) ? paketData.soal : Object.values(paketData.soal || {});
    if(rawSoal.length === 0) return alert("Belum ada butir soal di dalam topik ini!");

    // Normalisasi struktur soal & rekam origIdx (indeks asli di database sebelum diacak)
    let normalizedSoal = rawSoal.filter(Boolean).map(function(q, origIndex) {
        let copyQ = Object.assign({}, q);
        copyQ.origIdx = origIndex;
        let opts = Array.isArray(copyQ.options) ? copyQ.options : Object.values(copyQ.options || {});
        
        if (opts.length === 0 && copyQ.question && /<br\s*\/?>\s*[A-Ea-e][\.\)]/.test(copyQ.question)) {
            let parts = copyQ.question.split(/<br\s*\/?>/i);
            let qClean = [];
            parts.forEach(function(p) {
                let line = p.trim();
                if (/^[A-Ea-e][\.\)]\s*/.test(line)) {
                    let lbl = line.charAt(0).toUpperCase();
                    let txt = line.substring(2).trim();
                    opts.push({ label: lbl, text: txt });
                } else {
                    qClean.push(line);
                }
            });
            copyQ.question = qClean.join('<br>');
        }

        copyQ.options = opts.map(function(o, idx) {
            if (typeof o === 'string') return { label: String.fromCharCode(65 + idx), text: o };
            return { label: o.label || String.fromCharCode(65 + idx), text: o.text || '' };
        });

        let rawCorrect = copyQ.correct || copyQ.correctAnswers || [];
        if (typeof rawCorrect === 'string') rawCorrect = [rawCorrect];
        else if (!Array.isArray(rawCorrect)) rawCorrect = Object.values(rawCorrect);

        if (copyQ.type === 'Essay') {
            copyQ.type = 'Essay';
        } else if (copyQ.options.length === 0 || copyQ.type === 'IS' || copyQ.type === 'short_answer') {
            copyQ.type = 'IS';
            let splitKeys = [];
            rawCorrect.forEach(function(k) {
                String(k).split(/\||,/).forEach(function(sub) {
                    if (sub.trim()) splitKeys.push(sub.trim());
                });
            });
            rawCorrect = splitKeys;
        } else if (copyQ.type !== 'PGK') {
            copyQ.type = 'PG';
        }

        copyQ.correct = rawCorrect;
        return copyQ;
    });

    let shuffledSoal = [...normalizedSoal].sort(function() { return Math.random() - 0.5; });

    window.sesiLatihanSiswa = {
        paketKey: key,
        kelas: paketData.kelas,
        mapel: paketData.mapel,
        bab: paketData.bab,
        kesulitan: paketData.kesulitan,
        soal: shuffledSoal,
        jawaban: {}
    };
    window.tutupModal('modal-enter-latihan');
    window.bukaRuangLatihan();
};

window.bukaRuangLatihan = function() {
    let header = document.getElementById('header-wrap');
    let nav = document.getElementById('main-nav');
    let breadcrumb = document.querySelector('.bottom-breadcrumb-bar');
    if(header) header.style.display = 'none';
    if(nav) nav.style.display = 'none';
    if(breadcrumb) breadcrumb.style.display = 'none';

    document.body.style.overflow = 'auto';
    document.body.classList.remove('strict-mode-active');

    let room = document.getElementById('ujian-strict-room');
    if(room) { room.style.display = 'block'; room.scrollTo(0,0); }

    let judulUI = document.getElementById('ujian-judul-ui');
    if(judulUI) {
        judulUI.style.color = '#2c3e50';
        judulUI.innerText = '🚀 Latihan: ' + window.sesiLatihanSiswa.bab + ' (Tingkat ' + window.sesiLatihanSiswa.kesulitan + ')';
    }

    let isAdmin = sessionStorage.getItem("statusLogin") === "admin";
    let subUI = document.getElementById('ujian-strict-subtitle');
    if(subUI) {
        subUI.innerText = isAdmin
            ? '🛠️ Mode Admin Aktif: Klik langsung pada teks soal, opsi, atau pembahasan untuk mengedit, atau klik 🗑️ untuk membuang soal.'
            : 'Soal diacak. Hasil tidak disimpan permanen.';
    }

    let timerEl = document.getElementById('ujian-timer-fixed');
    if(timerEl) timerEl.style.display = 'none';

    window.isStrictUjianActive = false;
    window.renderSoalLatihanSiswa();
};

window.keluarRuangLatihanSiswa = function() {
    let room = document.getElementById('ujian-strict-room');
    if(room) room.style.display = 'none';

    let header = document.getElementById('header-wrap');
    let nav = document.getElementById('main-nav');
    let breadcrumb = document.querySelector('.bottom-breadcrumb-bar');
    if(header) header.style.display = 'block';
    if(nav) nav.style.display = 'flex';
    if(breadcrumb) breadcrumb.style.display = 'flex';

    let judulUI = document.getElementById('ujian-judul-ui');
    if(judulUI) judulUI.style.color = '#c0392b';
    let subUI = document.getElementById('ujian-strict-subtitle');
    if(subUI) subUI.innerText = 'Mode Ketat: Dilarang Keluar atau Membuka Aplikasi Lain!';
};

// Fungsi Simpan Editan Soal/Opsi/Kunci/Pembahasan oleh Admin di Ruang Latihan
window.simpanEditanLatihanAdmin = function(soalIdx, field, optIdx, newValue) {
    if (sessionStorage.getItem("statusLogin") !== "admin" || !window.sesiLatihanSiswa) return;
    let q = window.sesiLatihanSiswa.soal[soalIdx];
    if (!q) return;

    let cleanVal = (newValue || "").trim();
    if (field === 'question') {
        q.question = cleanVal;
    } else if (field === 'option' && q.options && q.options[optIdx]) {
        q.options[optIdx].text = cleanVal;
    } else if (field === 'explanation') {
        q.explanation = cleanVal;
    } else if (field === 'correct') {
        q.correct = cleanVal.split(/\||,/).map(function(s) { return s.trim(); }).filter(Boolean);
    }

    let key = window.sesiLatihanSiswa.paketKey;
    if (key && window.adminBankLatihanData && window.adminBankLatihanData[key]) {
        let bankSoalArr = window.adminBankLatihanData[key].soal;
        if (Array.isArray(bankSoalArr) && typeof q.origIdx === 'number' && bankSoalArr[q.origIdx]) {
            bankSoalArr[q.origIdx].question = q.question;
            bankSoalArr[q.origIdx].options = q.options;
            bankSoalArr[q.origIdx].explanation = q.explanation;
            bankSoalArr[q.origIdx].correct = q.correct;
            if (typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
        }
    }
};

// Fungsi Buang / Hapus Soal oleh Admin langsung dari Ruang Latihan
window.buangSoalLatihanAdmin = function(soalIdx) {
    if (sessionStorage.getItem("statusLogin") !== "admin" || !window.sesiLatihanSiswa) return;
    let q = window.sesiLatihanSiswa.soal[soalIdx];
    if (!q) return;
    if (!confirm("Buang soal nomor " + (soalIdx + 1) + " ini secara permanen dari Bank Latihan?")) return;

    let key = window.sesiLatihanSiswa.paketKey;
    let origToDelete = q.origIdx;

    // Hapus dari sesi layar saat ini
    window.sesiLatihanSiswa.soal.splice(soalIdx, 1);

    // Hapus dari Bank Latihan utama & sesuaikan indeks origIdx soal lainnya
    if (key && window.adminBankLatihanData && window.adminBankLatihanData[key]) {
        let bankSoalArr = window.adminBankLatihanData[key].soal;
        if (Array.isArray(bankSoalArr) && typeof origToDelete === 'number') {
            bankSoalArr.splice(origToDelete, 1);
            window.sesiLatihanSiswa.soal.forEach(function(item) {
                if (item.origIdx > origToDelete) item.origIdx -= 1;
            });
            if (typeof window.simpanBankLatihanKeDB === "function") window.simpanBankLatihanKeDB();
        }
    }

    window.renderSoalLatihanSiswa();
};

// ---------------------------------------------------------
// MESIN UI LATIHAN, AUTO-CHECK, & EXPORT UNIVERSAL
// ---------------------------------------------------------
window.renderSoalLatihanSiswa = function() {
    let container = document.getElementById('ujian-strict-container');
    if(!container) return;

    let isAdmin = sessionStorage.getItem("statusLogin") === "admin";
    let soalArr = (window.sesiLatihanSiswa && window.sesiLatihanSiswa.soal) ? window.sesiLatihanSiswa.soal : [];
    window.sesiLatihanSiswa.statusJawab = new Array(soalArr.length).fill(false);
    window.sesiLatihanSiswa.skorTotal = 0;

    let judulCetak = ('Latihan Mandiri - ' + (window.sesiLatihanSiswa.bab || '') + ' (' + (window.sesiLatihanSiswa.kesulitan || '') + ')').replace(/'/g, "\\'");

    let html = '<div style="max-width:800px; margin:0 auto;">';

    html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; background:white; padding:12px 16px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.06); border:1px solid #e1e8ed; flex-wrap:wrap; gap:10px;">' +
        '<div style="display:flex; gap:10px; flex-wrap:wrap;">' +
            '<button class="btn-action" style="background:#2c3e50; padding:8px 16px; font-size:12px; border-radius:30px; display:flex; align-items:center; gap:6px; width:auto;" onclick="window.cetakDokumenUniversal(\'pdf\', \'' + judulCetak + '\', window.sesiLatihanSiswa.soal)">🖨️ Print PDF</button>' +
            '<button class="btn-action" style="background:#2c3e50; padding:8px 16px; font-size:12px; border-radius:30px; display:flex; align-items:center; gap:6px; width:auto;" onclick="window.cetakDokumenUniversal(\'word\', \'' + judulCetak + '\', window.sesiLatihanSiswa.soal)">📄 Export Word</button>' +
        '</div>' +
        '<button class="btn-action" style="background:#e74c3c; padding:8px 18px; font-size:12px; border-radius:30px; display:flex; align-items:center; gap:6px; width:auto;" onclick="window.keluarRuangLatihanSiswa()">✕ Keluar Ruang</button>' +
    '</div>';

    soalArr.forEach(function(q, idx) {
        let kunciArr = Array.isArray(q.correct) ? q.correct : [];
        let opsiArr = Array.isArray(q.options) ? q.options : [];

        let btnBuangSoal = isAdmin
            ? '<button type="button" style="display:block !important; position:absolute; top:15px; right:15px; background:#e74c3c; color:white; border:none; border-radius:4px; padding:6px 10px; font-size:11px; font-weight:bold; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.2); z-index:10;" onclick="window.buangSoalLatihanAdmin(' + idx + ')" title="Buang Soal Ini">🗑️ Buang Soal</button>'
            : '';

        let qEditAttr = isAdmin
            ? 'contenteditable="true" style="outline:none; cursor:text; background:#fffdf9; padding:4px 6px; border-radius:4px; border-bottom:1px dashed #e67e22;" onblur="window.simpanEditanLatihanAdmin(' + idx + ', \'question\', null, this.innerHTML)"'
            : '';

        html += '<div class="quiz-question-card" id="card-latihan-' + idx + '" style="margin-bottom:25px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border-radius:10px; background:white; padding:22px 20px 20px 20px; border:1px solid #e1e8ed; border-left:4px solid #3498db; position:relative;">' +
            btnBuangSoal +
            '<div class="quiz-question-text" style="font-size:15px; color:#2c3e50; margin-bottom:15px; line-height:1.5; padding-bottom:8px; padding-right:' + (isAdmin ? '100px' : '0') + ';">' +
                '<span>' + (idx+1) + '. </span><span ' + qEditAttr + '>' + (q.question || '') + '</span>' +
            '</div>';

        if(q.type === 'IS' || q.type === 'Essay' || opsiArr.length === 0) {
            html += '<input type="text" id="input-latihan-' + idx + '" class="input-box" placeholder="Ketik jawaban Anda lalu tekan Enter..." style="font-size:14px; padding:11px 14px; border:1px solid #cbd5e1; border-radius:8px; width:100%; box-sizing:border-box; margin-bottom:0;" onchange="window.simpanJawabanLatihan(' + idx + ', this)" onkeydown="if(event.key===\'Enter\'){this.blur();}">';
        } else {
            html += '<div class="quiz-options" style="display:flex; flex-direction:column; gap:8px;">';
            opsiArr.forEach(function(opt, oIdx) {
                let optEditSpan = isAdmin
                    ? '<span contenteditable="true" style="flex:1; outline:none; border-bottom:1px dashed #e67e22; background:#fffdf9; cursor:text; padding:2px 4px;" onclick="event.stopPropagation();" onblur="window.simpanEditanLatihanAdmin(' + idx + ', \'option\', ' + oIdx + ', this.innerText)">' + opt.text + '</span>'
                    : '<span>' + opt.text + '</span>';

                if(q.type === 'PGK') {
                    html += '<label id="opsi-lbl-' + idx + '-' + opt.label + '" class="quiz-option-btn opsi-latihan-' + idx + '" data-label="' + opt.label + '" style="display:flex; align-items:center; gap:10px; background:white; border:1px solid #e1e8ed; padding:12px 15px; border-radius:6px; cursor:pointer; font-size:14px; color:#34495e;">' +
                                '<input type="checkbox" id="chk-latihan-' + idx + '-' + opt.label + '" style="width:16px; height:16px; cursor:pointer; accent-color:#f39c12;" onchange="window.pilihJawabanLatihanPGK(' + idx + ', \'' + opt.label + '\', this.checked)">' +
                                '<b>' + opt.label + '.</b> ' + optEditSpan +
                             '</label>';
                } else {
                    html += '<div id="opsi-btn-' + idx + '-' + opt.label + '" class="quiz-option-btn opsi-latihan-' + idx + '" data-label="' + opt.label + '" style="display:flex; align-items:center; gap:6px; text-align:left; background:white; border:1px solid #e1e8ed; padding:12px 15px; border-radius:6px; cursor:pointer; font-size:14px; color:#34495e; transition:0.2s;" onclick="window.pilihJawabanLatihanPG(' + idx + ', \'' + opt.label + '\', this)">' +
                                '<b>' + opt.label + '.</b> ' + optEditSpan +
                             '</div>';
                }
            });
            html += '</div>';
        }

        let bahasDisplay = isAdmin ? 'block' : 'none';
        let kunciEditAttr = isAdmin
            ? 'contenteditable="true" style="outline:none; border-bottom:1px dashed #e74c3c; padding:1px 4px; cursor:text; background:#fdf2e9; border-radius:3px;" onblur="window.simpanEditanLatihanAdmin(' + idx + ', \'correct\', null, this.innerText)"'
            : '';
        let bahasEditAttr = isAdmin
            ? 'contenteditable="true" style="outline:none; border-bottom:1px dashed #e74c3c; padding:2px 4px; cursor:text; background:#fdf2e9; border-radius:3px; display:inline-block; min-width:60%;" onblur="window.simpanEditanLatihanAdmin(' + idx + ', \'explanation\', null, this.innerHTML)"'
            : '';

        html += '<div id="bahas-' + idx + '" style="display:' + bahasDisplay + '; margin-top:15px; padding:12px 15px; background:#ebf5fb; border-left:4px solid #2980b9; border-radius:6px; font-size:13px; color:#2c3e50;">' +
                    '<strong style="color:#2980b9;">Kunci: <span ' + kunciEditAttr + '>' + (kunciArr.join(', ') || '-') + '</span></strong><br>' +
                    '<div style="margin-top:6px; color:#34495e;"><strong>Pembahasan:</strong> <span ' + bahasEditAttr + '>' + (q.explanation || 'Tidak ada pembahasan.') + '</span></div>' +
                 '</div>';
        html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
};

window.cekSelesaiLatihan = function() {
    let dijawab = window.sesiLatihanSiswa.statusJawab.filter(Boolean).length;
    let total = window.sesiLatihanSiswa.soal.length;
    if (total > 0 && dijawab === total) {
        let nilaiAkhir = Math.round((window.sesiLatihanSiswa.skorTotal / total) * 100);
        let modal = document.getElementById('modal-quiz-result');
        if(modal) {
            let scoreEl = document.getElementById('quiz-result-score');
            scoreEl.innerText = nilaiAkhir;
            document.getElementById('quiz-result-correct').innerText = window.sesiLatihanSiswa.skorTotal;
            document.getElementById('quiz-result-total').innerText = total;
            let btnRem = document.getElementById('btn-remedial');
            if (btnRem) btnRem.style.display = 'none';
            window.bukaModal('modal-quiz-result');
        }
    }
};

window.pilihJawabanLatihanPG = function(soalIdx, labelPilihan, btnEl) {
    if(window.sesiLatihanSiswa.statusJawab[soalIdx]) return;

    let q = window.sesiLatihanSiswa.soal[soalIdx];
    let kunciArr = Array.isArray(q.correct) ? q.correct : [];
    window.sesiLatihanSiswa.statusJawab[soalIdx] = true;
    window.sesiLatihanSiswa.jawaban[soalIdx] = labelPilihan;

    let isCorrect = kunciArr.includes(labelPilihan);
    if(isCorrect) window.sesiLatihanSiswa.skorTotal += 1;

    document.querySelectorAll('.opsi-latihan-' + soalIdx).forEach(function(btn) {
        btn.style.cursor = 'not-allowed';
        btn.disabled = true;
        let lbl = btn.getAttribute('data-label');
        if (kunciArr.includes(lbl)) {
            btn.style.background = '#d5f5e3'; btn.style.borderColor = '#27ae60'; btn.style.color = '#1e8449'; btn.style.fontWeight = 'bold';
        } else if (lbl === labelPilihan && !isCorrect) {
            btn.style.background = '#fadbd8'; btn.style.borderColor = '#e74c3c'; btn.style.color = '#c0392b'; btn.style.fontWeight = 'bold';
        } else {
            btn.style.opacity = '0.6';
        }
    });

    document.getElementById('bahas-' + soalIdx).style.display = 'block';
    window.cekSelesaiLatihan();
};

window.pilihJawabanLatihanPGK = function(soalIdx, labelPilihan, isChecked) {
    if(window.sesiLatihanSiswa.statusJawab[soalIdx]) {
        document.getElementById('chk-latihan-' + soalIdx + '-' + labelPilihan).checked = !isChecked;
        return;
    }
    
    let q = window.sesiLatihanSiswa.soal[soalIdx];
    let kunciArr = Array.isArray(q.correct) ? q.correct : [];
    let lblEl = document.getElementById('opsi-lbl-' + soalIdx + '-' + labelPilihan);

    if (kunciArr.includes(labelPilihan)) {
        lblEl.style.background = '#d5f5e3'; lblEl.style.borderColor = '#27ae60';
    } else {
        lblEl.style.background = '#fadbd8'; lblEl.style.borderColor = '#e74c3c';
        window.sesiLatihanSiswa.statusJawab[soalIdx] = true;
        document.getElementById('bahas-' + soalIdx).style.display = 'block';
        window.cekSelesaiLatihan();
        return; 
    }

    let correctCount = 0;
    kunciArr.forEach(function(c) {
        let el = document.getElementById('chk-latihan-' + soalIdx + '-' + c);
        if(el && el.checked) correctCount++;
    });

    if (kunciArr.length > 0 && correctCount === kunciArr.length) {
        window.sesiLatihanSiswa.statusJawab[soalIdx] = true;
        window.sesiLatihanSiswa.skorTotal += 1;
        document.getElementById('bahas-' + soalIdx).style.display = 'block';
        window.cekSelesaiLatihan();
    }
};

window.simpanJawabanLatihan = function(soalIdx, inputEl) {
    if(window.sesiLatihanSiswa.statusJawab[soalIdx]) return;
    let val = inputEl.value.trim();
    if(!val) return;

    let q = window.sesiLatihanSiswa.soal[soalIdx];
    let kunciArr = Array.isArray(q.correct) ? q.correct : [];
    window.sesiLatihanSiswa.statusJawab[soalIdx] = true;
    window.sesiLatihanSiswa.jawaban[soalIdx] = val;

    inputEl.disabled = true;
    inputEl.style.cursor = 'not-allowed';

    if (q.type === 'IS' || !q.options || q.options.length === 0) {
        let keys = kunciArr.map(function(k) { return String(k).toLowerCase().trim(); });
        if (keys.includes(val.toLowerCase())) {
            inputEl.style.background = '#d5f5e3'; inputEl.style.borderColor = '#27ae60'; inputEl.style.color = '#1e8449'; inputEl.style.fontWeight = 'bold';
            window.sesiLatihanSiswa.skorTotal += 1;
        } else {
            inputEl.style.background = '#fadbd8'; inputEl.style.borderColor = '#e74c3c'; inputEl.style.color = '#c0392b'; inputEl.style.fontWeight = 'bold';
        }
    } else {
        inputEl.style.background = '#eef2f7'; inputEl.style.borderColor = '#94a3b8';
        window.sesiLatihanSiswa.skorTotal += 1;
    }

    document.getElementById('bahas-' + soalIdx).style.display = 'block';
    window.cekSelesaiLatihan();
};

// =========================================================
// MESIN PRINTER UNIVERSAL SOAL (PDF & WORD)
// =========================================================
window.cetakDokumenUniversal = function(format, judul, dataSoal) {
    if(!dataSoal || dataSoal.length === 0) return alert("Belum ada soal untuk dicetak!");

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">';
    html += '<head><meta charset="utf-8"><title>' + judul + '</title>';
    html += '<style>';
    html += '@page { size: A4; margin: 1in; } ';
    html += 'body { font-family: "Times New Roman", Times, serif; font-size: 10pt; color: #000; line-height: 1.5; margin: 0; padding: 0; } ';
    html += 'h1 { font-size: 12pt; font-weight: bold; text-align: center; margin-bottom: 20pt; } ';
    html += '.soal-item { margin-bottom: 15pt; page-break-inside: avoid; } ';
    html += '.soal-teks { margin-bottom: 5pt; } ';
    html += '.opsi-list { list-style-type: none; padding-left: 15pt; margin: 0; } ';
    html += '.opsi-item { margin-bottom: 3pt; } ';
    html += '.titik-isian { letter-spacing: 2pt; font-weight: normal; } ';
    html += '</style></head><body>';
    html += '<h1>' + judul + '</h1>';

    dataSoal.forEach(function(q, i) {
        html += '<div class="soal-item">';
        let qText = q.question || '';
        let opsiArr = Array.isArray(q.options) ? q.options : [];

        if (q.type === 'IS' || q.type === 'short_answer' || (q.type !== 'Essay' && opsiArr.length === 0)) {
            qText += ' <span class="titik-isian">....................</span>'; 
        } else if (q.type === 'Essay') {
            qText += '<br><br><span class="titik-isian">....................................................................................................</span><br><span class="titik-isian">....................................................................................................</span><br><span class="titik-isian">....................................................................................................</span>';
        }

        html += '<div class="soal-teks">' + (i+1) + '. ' + qText + '</div>';

        if (opsiArr.length > 0 && q.type !== 'IS' && q.type !== 'Essay') {
            html += '<ul class="opsi-list">';
            opsiArr.forEach(function(opt, optIdx) {
                let label = opt.label || String.fromCharCode(65 + optIdx);
                let text = opt.text || opt;
                html += '<li class="opsi-item">' + label + '. ' + text + '</li>';
            });
            html += '</ul>';
        }
        html += '</div>';
    });

    html += '</body></html>';

    if (format === 'word') {
        let blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        let url = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = url;
        link.download = judul.replace(/[^a-z0-9]/gi, '_') + '.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (format === 'pdf') {
        let printWin = window.open('', '', 'width=800,height=600');
        printWin.document.write(html);
        printWin.document.close();
        printWin.focus();
        setTimeout(function() {
            printWin.print();
            printWin.close();
        }, 500);
    }
};

window.cetakKuisPDF = function(containerId, judul) {
    let soalArr = [];
    if (containerId.indexOf('inline-kuis-') === 0) {
        let idx = containerId.split('-')[2];
        soalArr = window.contentBlocksData[idx].questions;
    } else {
        soalArr = window.sesiLatihanSiswa ? window.sesiLatihanSiswa.soal : (window.sesiUjianSiswa ? window.sesiUjianSiswa.soal : []);
    }
    window.cetakDokumenUniversal('pdf', judul || 'Kuis', soalArr);
};

window.exportWordKuis = function(containerId, judul) {
    let soalArr = [];
    if (containerId.indexOf('inline-kuis-') === 0) {
        let idx = containerId.split('-')[2];
        soalArr = window.contentBlocksData[idx].questions;
    } else {
        soalArr = window.sesiLatihanSiswa ? window.sesiLatihanSiswa.soal : (window.sesiUjianSiswa ? window.sesiUjianSiswa.soal : []);
    }
    window.cetakDokumenUniversal('word', judul || 'Kuis', soalArr);
};

const modalLatihanEnterObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
        if(m.target.id === 'modal-enter-latihan' && m.target.style.display === 'flex') {
            if(typeof window.renderDropdownLatihan === "function") window.renderDropdownLatihan();
        }
    });
});
if(document.getElementById('modal-enter-latihan')) {
    modalLatihanEnterObserver.observe(document.getElementById('modal-enter-latihan'), { attributes: true, attributeFilter: ['style'] });
}