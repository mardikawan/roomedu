import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, remove, goOffline, goOnline } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendEmailVerification, updatePassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
// IMPORT FIREBASE STORAGE
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-storage.js";

// Konfigurasi Database Mahardika (Ditambah URL Storage Bucket)
const firebaseConfig = { 
    apiKey: "AIzaSyCD2-v7vgvgAgOlvkn_tzOHpAtZZEP6B0w", 
    databaseURL: "https://mardikawan-project-default-rtdb.firebaseio.com", 
    projectId: "mardikawan-project",
    storageBucket: "mardikawan-project.appspot.com" 
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app); 

// ==========================================
// FUNGSI BARU: UPLOAD MEDIA KE FIREBASE STORAGE
// ==========================================
window.uploadMediaKeFirebaseStorage = function(file, onProgress, onSuccess, onError) {
    let uniqueName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    let fileRef = sRef(storage, 'media_guru/' + (window.guruAktif || 'mahardika') + '/' + uniqueName);
    let uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on('state_changed',
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if(onProgress) onProgress(progress);
        },
        (error) => { if(onError) onError(error); },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                if(onSuccess) onSuccess(downloadURL);
            });
        }
    );
};

// Mesin Bayangan untuk membuat akun Guru tanpa me-logout Admin Utama
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

window.loginFirebase = function(email, password, onSuccess, onError) {
    goOnline(db);
    signInWithEmailAndPassword(auth, email, password).then(function() { if(onSuccess) onSuccess(); }).catch(function(err) { if(onError) onError(err); });
};

window.logoutFirebase = function(onSuccess) {
    goOnline(db);
    signOut(auth).then(function() { if(onSuccess) onSuccess(); });
};

window.buatAkunAuthGuru = function(email, password, onSuccess, onError) {
    createUserWithEmailAndPassword(secondaryAuth, email, password).then(function() {
        secondaryAuth.signOut();
        if(onSuccess) onSuccess();
    }).catch(function(err) { if(onError) onError(err); });
};

// PENGATUR LALU LINTAS SERVER (PASTIKAN KONEKSI SELALU ONLINE SAAT UJIAN & PENGUMPULAN NILAI)
window.modeHematServerUjian = function(isOfflineMode) {
    try {
        goOnline(db);
    } catch (e) {
        console.warn("Pengaturan koneksi:", e);
    }
};

// Jembatan Otomatis agar Akun Siswa (123456) Selalu Memiliki Izin Tulis ke Firebase
window.pastikanAuthFirebaseSiswaAktif = function(callback) {
    goOnline(db);
    if (auth.currentUser) {
        if (callback) callback();
        return;
    }
    let stat = sessionStorage.getItem("statusLogin");
    if (stat === "siswa" || stat === "tamu") {
        signInWithEmailAndPassword(auth, "siswa@sbd.com", "semangat").then(function() {
            if (callback) callback();
        }).catch(function() {
            if (callback) callback();
        });
    } else {
        if (callback) callback();
    }
};

// Pengiriman Nilai Ujian dengan JaminanTerkirim (Callback Sukses/Gagal)
window.kirimNilaiUjianAmanKeDB = function(pathInfo, payload, onSuccess, onError) {
    try {
        goOnline(db);
        set(ref(db, basePath + '/' + pathInfo), payload).then(function() {
            if (onSuccess) onSuccess();
        }).catch(function(err) {
            if (onError) onError(err);
        });
    } catch (e) {
        if (onError) onError(e);
    }
};

// Semua fungsi Write/Read Data (onValue, set, get) akan dikelola secara terisolasi di file ini

// Mengambil Parameter URL dari main.js
const urlParams = new URLSearchParams(window.location.search); 
window.babAktif = urlParams.get('bab') || "home";

// MENGATUR JALUR DATABASE MULTI-GURU (ISOLASI DATA 100% TERPISAH)
let statusSistem = sessionStorage.getItem("statusLogin");
let usernameSistem = sessionStorage.getItem("username");
let guruParamUrl = urlParams.get('guru');

if (guruParamUrl) {
    sessionStorage.setItem("guruTarget", guruParamUrl.trim().toLowerCase());
}

let guruAktif = "mahardika"; // Default ke pemilik utama web
if (statusSistem === "admin" && usernameSistem) {
    guruAktif = usernameSistem.trim().toLowerCase();
    sessionStorage.setItem("guruTarget", guruAktif);
} else {
    guruAktif = guruParamUrl ? guruParamUrl.trim().toLowerCase() : (sessionStorage.getItem("guruTarget") || "mahardika");
}

window.guruAktif = guruAktif;
let basePath = "data_guru/" + guruAktif;

/* =========================================
   SINKRONISASI DAFTAR AKUN GURU (SUPER ADMIN)
   ========================================= */
window.daftarAkunGuru = window.daftarAkunGuru || {};

onValue(ref(db, 'sistem_utama/daftar_akun_guru'), function(snap) {
    if (snap.exists()) {
        window.daftarAkunGuru = snap.val();
    } else {
        window.daftarAkunGuru = {};
    }
    if (typeof window.renderDaftarAkunGuru === "function") {
        window.renderDaftarAkunGuru();
    }
});

window.simpanDaftarAkunGuruKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin" || sessionStorage.getItem("username") !== "mahardika") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Akun Guru...</span>";

    set(ref(db, 'sistem_utama/daftar_akun_guru'), window.daftarAkunGuru).then(function() {
        if(typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(error) {
        console.error("Gagal menyimpan akun guru:", error);
    });
};

/* =========================================
   PENGAMBILAN DATA (READ) FIREBASE PER GURU
   ========================================= */

// 1. Tarik Pengaturan Tema & Popup Pengumuman
onValue(ref(db, basePath + '/theme_settings'), function(snap) { 
    let webTitleEl = document.getElementById('web-title');
    let headerWrap = document.querySelector('.header-wrapper');
    if(snap.exists()){ 
        let t = snap.val(); 
        document.documentElement.style.setProperty('--primary-bg', t.bgColor || '#0b3954'); 
        document.documentElement.style.setProperty('--main-font', t.fontFamily || "'Quicksand', sans-serif"); 
        if(webTitleEl) webTitleEl.innerText = t.webTitle || (guruAktif === "mahardika" ? "Mahardika" : "Ruang Belajar " + guruAktif.toUpperCase()); 
        let pad = t.headerPad || '20';
        if(headerWrap) headerWrap.style.padding = pad + 'px 20px';
    } else {
        if(webTitleEl) webTitleEl.innerText = (guruAktif === "mahardika" ? "Mahardika" : "Ruang Belajar " + guruAktif.toUpperCase());
    }
});

/* =========================================
   TARIK & SIMPAN DATA CATATAN GURU (ANTI-LONCAT KURSOR)
   ========================================= */
onValue(ref(db, basePath + '/admin_catatan_guru'), function(snap) {
    // Abaikan pantulan data dari penyimpanan lokal sendiri agar kursor tidak pernah loncat saat mengetik
    if (window.isTypingCG || (Date.now() - (window._lastSaveCGTime || 0) < 1500)) return;

    if (snap.exists()) {
        let data = snap.val();
        window.adminCatatanGuruData = Array.isArray(data) ? data : Object.values(data);
    } else {
        window.adminCatatanGuruData = [{ id: 'sheet_1', nama: 'Sheet 1', html: '' }];
    }
    
    let modalCG = document.getElementById('modal-catatan-guru');
    let editorCG = document.getElementById('cg-editor-area');
    if (modalCG && modalCG.style.display === 'flex' && typeof window.renderSheetsCG === "function") {
        // Jangan pernah menimpa innerHTML jika kursor guru sedang aktif di dalam editor Catatan Guru
        if (document.activeElement !== editorCG) {
            window.renderSheetsCG();
            window.muatKontenSheetAktifCG();
        }
    }
});

window.simpanCatatanGuruKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    
    let stat = document.getElementById('cg-sync-status');
    if(stat) stat.innerHTML = "<span style='color:#f1c40f;'>☁️ Menyimpan...</span>";
    window._lastSaveCGTime = Date.now();
    
    try {
        let payload = {};
        let sourceData = Array.isArray(window.adminCatatanGuruData) ? window.adminCatatanGuruData : Object.values(window.adminCatatanGuruData);
        
        sourceData.forEach((sheet, idx) => {
            if (sheet) {
                payload['sheet_' + idx] = {
                    id: sheet.id || ('sheet_' + Date.now()),
                    nama: sheet.nama || ('Sheet ' + (idx + 1)),
                    html: sheet.html || ''
                };
            }
        });
        
        set(ref(db, basePath + '/admin_catatan_guru'), payload).then(() => {
            window._lastSaveCGTime = Date.now();
            window.isTypingCG = false;
            if(stat) stat.innerHTML = "<span style='color:#2ecc71;'>✓ Tersimpan</span>";
        }).catch(err => {
            window.isTypingCG = false;
            console.error("Gagal simpan Catatan Guru:", err);
            if(stat) stat.innerHTML = "<span style='color:#e74c3c;' title='" + err.message + "'>❌ Gagal Simpan</span>";
        });
    } catch(e) {
        window.isTypingCG = false;
        if(stat) stat.innerHTML = "<span style='color:#e74c3c;'>❌ Error Data Format</span>";
    }
};

/* =========================================
   TARIK & SIMPAN DATA CATATAN KELAS (ANTI-LONCAT KURSOR)
   ========================================= */
onValue(ref(db, basePath + '/admin_catatan_kelas'), function(snap) {
    if (window.isTypingCK || (Date.now() - (window._lastSaveCKTime || 0) < 1500)) return;

    if (snap.exists()) {
        window.adminCatatanKelasData = snap.val();
        for (let kls in window.adminCatatanKelasData) {
            if (!Array.isArray(window.adminCatatanKelasData[kls])) {
                window.adminCatatanKelasData[kls] = Object.values(window.adminCatatanKelasData[kls]);
            }
        }
    } else {
        window.adminCatatanKelasData = {};
    }
    
    let modalCK = document.getElementById('modal-catatan-kelas');
    let editorCK = document.getElementById('ck-editor-area');
    if (modalCK && modalCK.style.display === 'flex' && typeof window.renderSheetsCK === "function") {
        if (document.activeElement !== editorCK) {
            window.renderSheetsCK();
            window.muatKontenSheetAktifCK();
        }
    }
});

window.simpanCatatanKelasKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    
    let stat = document.getElementById('ck-sync-status');
    if(stat) stat.innerHTML = "<span style='color:#f1c40f;'>☁️ Menyimpan...</span>";
    window._lastSaveCKTime = Date.now();
    
    try {
        let payload = {};
        for (let kls in window.adminCatatanKelasData) {
            payload[kls] = {};
            let sourceData = Array.isArray(window.adminCatatanKelasData[kls]) ? window.adminCatatanKelasData[kls] : Object.values(window.adminCatatanKelasData[kls]);
            sourceData.forEach((sheet, idx) => {
                if (sheet) {
                    payload[kls]['sheet_' + idx] = {
                        id: sheet.id || ('sheet_' + Date.now()),
                        nama: sheet.nama || ('Sheet ' + (idx + 1)),
                        html: sheet.html || ''
                    };
                }
            });
        }
        
        set(ref(db, basePath + '/admin_catatan_kelas'), payload).then(() => {
            window._lastSaveCKTime = Date.now();
            window.isTypingCK = false;
            if(stat) stat.innerHTML = "<span style='color:#2ecc71;'>✓ Tersimpan</span>";
        }).catch(err => {
            window.isTypingCK = false;
            console.error("Gagal simpan Catatan Kelas:", err);
            if(stat) stat.innerHTML = "<span style='color:#e74c3c;'>❌ Gagal Simpan</span>";
        });
    } catch(e) {
        window.isTypingCK = false;
        if(stat) stat.innerHTML = "<span style='color:#e74c3c;'>❌ Error Format</span>";
    }
};

onValue(ref(db, basePath + '/popup_pengumuman'), function(snap) {
    let box = document.getElementById('popup-content-box');
    if(snap.exists()) {
        let htmlContent = snap.val().html || '';
        if(box) box.innerHTML = htmlContent;
        
        if(htmlContent.trim() !== '' && htmlContent !== '<p><br></p>') {
            setTimeout(function() {
                if(typeof window.bukaWelcomePopup === 'function' && !window.isStrictUjianActive) {
                    // Cek apakah pop-up sudah pernah dilihat di sesi ini
                    if (!sessionStorage.getItem('popup_welcome_seen')) {
                        window.bukaWelcomePopup();
                        // Tandai bahwa pop-up sudah dilihat agar tidak muncul lagi saat direfresh
                        sessionStorage.setItem('popup_welcome_seen', 'true');
                    }
                }
            }, 1000);
        }
    } else {
        if(box) box.innerHTML = '';
    }
});

// 2. Tarik Struktur Halaman & Render Navbar
onValue(ref(db, basePath + '/pages_struktur'), function(snap) {
    if(snap.exists()){ 
        window.pagesData = snap.val(); 
    } else {
        if(typeof window.inisialisasiDataPagesDefault === "function") {
            window.inisialisasiDataPagesDefault();
        } else {
            window.pagesData = [];
        }
    }
    
    if(typeof window.pastikanRoomHiddenTerkunci === "function") {
        window.pastikanRoomHiddenTerkunci();
    }

    if(typeof window.updateBreadcrumb === 'function') window.updateBreadcrumb();
    
    if(typeof window.renderDynamicNavbar === 'function') {
        window.renderDynamicNavbar();
    }

    let modalPages = document.getElementById('modal-pages');
    if(modalPages && modalPages.style.display === 'flex' && typeof window.renderModalPages === 'function') {
        window.renderModalPages();
    }
});

// Fungsi Simpan Struktur Halaman (Pages) ke Firebase
window.simpanPagesKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    if (typeof window.pastikanRoomHiddenTerkunci === "function") {
        window.pastikanRoomHiddenTerkunci();
    }
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Pages...</span>";

    set(ref(db, basePath + '/pages_struktur'), window.pagesData).then(function() {
        if(typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(error) {
        console.error("Gagal menyimpan struktur halaman:", error);
    });
};

// Fungsi Simpan Pengaturan Tema Header ke Firebase
window.simpanTemaKeDB = function(themeObj) {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Theme...</span>";

    set(ref(db, basePath + '/theme_settings'), themeObj).then(function() {
        if(typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(error) {
        console.error("Gagal menyimpan tema:", error);
    });
};

// Fungsi Simpan Popup Pengumuman ke Firebase
window.simpanPopupKeDB = function(htmlContent) {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Popup...</span>";

    set(ref(db, basePath + '/popup_pengumuman'), { html: htmlContent }).then(function() {
        if(typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(error) {
        console.error("Gagal menyimpan popup:", error);
    });
};

// 3. Mesin Pemuat Konten Halaman Tanpa Refresh (SPA Engine - Terisolasi Per Room)
window.isLoadingRoom = false;

// Mesin Pemuat Konten Instan (0.01 Detik) Menggunakan Cache + Background Sync
window.muatKontenHalaman = function(slugBab) {
    let targetRoom = slugBab || window.babAktif || "home";
    window.babAktif = targetRoom;
    window.isLoadingRoom = true;

    if (window.typingTimer) {
        clearTimeout(window.typingTimer);
        window.typingTimer = null;
    }

    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#f39c12;'>⚡ Loading...</span>";
    
    let container = document.getElementById('blocks-container');
    if(container) container.setAttribute('data-active-room', targetRoom);

    let cacheKey = 'cache_room_' + (window.guruAktif || 'mahardika') + '_' + targetRoom;
    let cachedData = sessionStorage.getItem(cacheKey);

    // 1. TAMPILKAN INSTAN DARI CACHE (0.01 detik loading!)
    if (cachedData) {
        try {
            let parsed = JSON.parse(cachedData);
            window.contentBlocksData = parsed.blocksObj || [];
            window.floatingBoxesData = parsed.floatingBoxesObj || [];
            
            if(typeof window.renderBlocks === 'function') window.renderBlocks(); 
            if(typeof window.renderFloatingBoxes === 'function') window.renderFloatingBoxes();
            
            window.isLoadingRoom = false; // Langsung buka gembok, admin bisa langsung ngetik!
            if(st) st.innerHTML = "<span style='color:#2ecc71;'>⚡ Ready</span>";
        } catch(e) {}
    } else {
        if(container) container.innerHTML = ''; // Kosongkan layar hanya jika cache belum ada
    }
    
    // 2. SINKRONISASI DIAM-DIAM DARI FIREBASE (Latar Belakang)
    let timeoutFirebase = setTimeout(function() {
        window.isLoadingRoom = false; // Buka kunci layar jika sinyal macet
        if (st) st.innerHTML = "<span style='color:#e74c3c;'>⚠️ Koneksi Lambat</span>";
    }, 8000);

    get(child(ref(db), basePath + '/materi_koleksi/' + targetRoom)).then(function(snap) {
        clearTimeout(timeoutFirebase);
        if (window.babAktif !== targetRoom) {
            window.isLoadingRoom = false; // Wajib dibuka agar bisa mengetik di room baru
            return;
        }

        let dataDariServer = (snap.exists() && snap.val().blocksObj) ? snap.val() : null;
        
        if (dataDariServer) {
            window.contentBlocksData = JSON.parse(JSON.stringify(dataDariServer.blocksObj)); 
            window.floatingBoxesData = JSON.parse(JSON.stringify(dataDariServer.floatingBoxesObj || [])); 
            
            // Perbarui cache dengan data segar dari server
            sessionStorage.setItem(cacheKey, JSON.stringify(dataDariServer));
        } else {
            if (!cachedData) {
                window.contentBlocksData = [{type:'text', html:"<p>Ketik materi...</p>", bg:"#ffffff", pattern:"", color:"#333333", width:"M", padTop:"40px", padBot:"40px", drawing:""}]; 
                window.floatingBoxesData = []; 
            }
        }
        
        window.contentBlocksData.forEach(function(b) {
            if(!b.padTop) b.padTop = "40px"; if(!b.padBot) b.padBot = "40px"; 
            if(!b.drawing) b.drawing = ""; if(!b.type) b.type = "text"; if(!b.pattern) b.pattern = "";
        }); 

        window.isLoadingRoom = false;
        
        // Render ulang hanya jika ada pembaruan dari server yang beda dari cache
        if(typeof window.renderBlocks === 'function') window.renderBlocks(); 
        if(typeof window.renderFloatingBoxes === 'function') window.renderFloatingBoxes();
        if(typeof window.updateBreadcrumb === 'function') window.updateBreadcrumb();
        
        if(st) st.innerHTML = "<span style='color:#2ecc71;'>✓ Cloud Sync: OK</span>";
        setTimeout(function() { if(st && st.innerHTML.indexOf('Sync: OK') !== -1) st.innerHTML = "Cloud Sync: Ready"; }, 1500);
    }).catch(function(err) {
        window.isLoadingRoom = false;
        if (!cachedData && st) st.innerHTML = "<span style='color:#e74c3c;'>❌ Gagal Memuat</span>";
    });
};

// Panggil fungsi saat web pertama kali dibuka
window.muatKontenHalaman(window.babAktif);

// =========================================================
// MESIN REGISTRASI & VERIFIKASI GMAIL NYATA (FIREBASE AUTH)
// =========================================================
window.daftarkanEmailVerifikasiNyata = function(email, password, onSuccess, onError) {
    goOnline(db);
    createUserWithEmailAndPassword(secondaryAuth, email, password).then(function(userCred) {
        sendEmailVerification(userCred.user).then(function() {
            secondaryAuth.signOut();
            if (onSuccess) onSuccess(userCred.user.uid);
        }).catch(function(errVerif) {
            secondaryAuth.signOut();
            if (onError) onError(errVerif);
        });
    }).catch(function(errCreate) {
        // Jika email sudah pernah terdaftar di Auth namun belum diverifikasi, coba login & kirim ulang link verifikasi
        signInWithEmailAndPassword(secondaryAuth, email, password).then(function(userCred) {
            if (userCred.user.emailVerified) {
                secondaryAuth.signOut();
                if (onSuccess) onSuccess(userCred.user.uid, true);
            } else {
                sendEmailVerification(userCred.user).then(function() {
                    secondaryAuth.signOut();
                    if (onSuccess) onSuccess(userCred.user.uid, false);
                }).catch(function(e2) {
                    secondaryAuth.signOut();
                    if (onError) onError(e2);
                });
            }
        }).catch(function() {
            if (onError) onError(errCreate);
        });
    });
};

window.kirimResetPasswordGmail = function(email, onSuccess, onError) {
    goOnline(db);
    sendPasswordResetEmail(auth, email).then(function() {
        if (onSuccess) onSuccess();
    }).catch(function(err) {
        if (onError) onError(err);
    });
};

window.cekStatusVerifikasiGmail = function(email, password, onResult, onError) {
    goOnline(db);
    signInWithEmailAndPassword(secondaryAuth, email, password).then(function(userCred) {
        userCred.user.reload().then(function() {
            let isVerified = Boolean(userCred.user.emailVerified);
            secondaryAuth.signOut();
            if (onResult) onResult(isVerified);
        });
    }).catch(function(err) {
        if (onError) onError(err);
    });
};

// 4. Tarik Data Bank Latihan (DENGAN CACHE LOKAL INSTAN 0.01 DETIK ANTI-LAG)
let cacheLatihanKey = 'cache_bank_latihan_' + guruAktif;
try {
    let rawCacheLat = localStorage.getItem(cacheLatihanKey);
    if (rawCacheLat) {
        window.adminBankLatihanData = JSON.parse(rawCacheLat);
        window.bankLatihanLoaded = true;
    }
} catch(e) {}

onValue(ref(db, basePath + '/admin_bank_latihan'), function(snap) {
    window.bankLatihanLoaded = true;
    if(snap.exists()) {
        window.adminBankLatihanData = snap.val();
        try { localStorage.setItem(cacheLatihanKey, JSON.stringify(window.adminBankLatihanData)); } catch(e) {}
    } else {
        window.adminBankLatihanData = {};
    }
    if(typeof window.renderManajerSoal === "function" && document.getElementById('modal-manajer-soal') && document.getElementById('modal-manajer-soal').style.display === 'flex') {
        window.renderManajerSoal();
    }
    // Jika siswa sedang membuka modal Pilih Topik Latihan, langsung perbarui dropdown kelas tanpa perlu keluar-masuk!
    let modalEnterLat = document.getElementById('modal-enter-latihan');
    if (modalEnterLat && modalEnterLat.style.display === 'flex' && typeof window.inisialisasiDropdownLatihanSiswa === "function") {
        window.inisialisasiDropdownLatihanSiswa();
    }
});

// 4C. Tarik Data Jadwal Sekolah & Kalender Pengingat Admin (Per Akun Guru) + Kolom Kustom Ledger
onValue(ref(db, basePath + '/admin_jadwal_kalender'), function(snap) {
    window.adminJadwalKalenderData = snap.exists() ? snap.val() : { excelHtml: "", events: {} };
    if (typeof window.hitungDanUpdateBadgeNotifikasi === "function") {
        window.hitungDanUpdateBadgeNotifikasi();
    }
    let modalJG = document.getElementById('modal-jadwal-guru');
    if (modalJG && modalJG.style.display === 'flex' && typeof window.renderKalenderGuru === "function") {
        window.renderKalenderGuru();
    }
});

window.simpanJadwalKalenderKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    set(ref(db, basePath + '/admin_jadwal_kalender'), window.adminJadwalKalenderData || { excelHtml: "", events: {} }).then(function() {
        if (typeof window.showSaveToast === "function") window.showSaveToast();
        if (typeof window.hitungDanUpdateBadgeNotifikasi === "function") window.hitungDanUpdateBadgeNotifikasi();
    });
};

onValue(ref(db, basePath + '/admin_ledger_meta'), function(snap) {
    window.adminLedgerMetaData = snap.exists() ? snap.val() : {};
    if (typeof window.renderLedgerSiswa === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
        window.renderLedgerSiswa();
    }
});

window.simpanLedgerMetaKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    set(ref(db, basePath + '/admin_ledger_meta'), window.adminLedgerMetaData || {}).then(function() {
        if (typeof window.showSaveToast === "function") window.showSaveToast();
    });
};

// FUNGSI SANITASI & PENCOCOKAN KUNCI REKAP NILAI / LEDGER SATU PINTU
window.sanitasiKeyRekapFirebase = function(teks) {
    return String(teks || "").replace(/[\.\#\x24\[\]\/]/g, "").trim();
};

window.ambilObjekRekapKelas = function(namaKelas) {
    if (!window.adminRekapNilaiData || !namaKelas) return {};
    if (window.adminRekapNilaiData[namaKelas]) return window.adminRekapNilaiData[namaKelas];
    let safeKls = window.sanitasiKeyRekapFirebase(namaKelas);
    return window.adminRekapNilaiData[safeKls] || {};
};

window.ambilObjekRekapPaket = function(namaKelas, namaPaket) {
    let rekapKelas = window.ambilObjekRekapKelas(namaKelas);
    if (!rekapKelas || !namaPaket) return {};
    if (rekapKelas[namaPaket]) return rekapKelas[namaPaket];
    let safePkt = window.sanitasiKeyRekapFirebase(namaPaket);
    return rekapKelas[safePkt] || {};
};

window.ambilDataSiswaDiObjekRekap = function(objRekapPaket, namaSiswa) {
    if (!objRekapPaket || !namaSiswa) return null;
    if (objRekapPaket[namaSiswa]) return objRekapPaket[namaSiswa];

    let cleanTarget = window.sanitasiKeyRekapFirebase(namaSiswa).toLowerCase();
    let trimTarget = String(namaSiswa).trim().toLowerCase();

    let keys = Object.keys(objRekapPaket);
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        let item = objRekapPaket[k];
        if (k.trim().toLowerCase() === trimTarget) return item;
        if (window.sanitasiKeyRekapFirebase(k).toLowerCase() === cleanTarget) return item;
        if (item && item.namaAsli && item.namaAsli.trim().toLowerCase() === trimTarget) return item;
    }
    return null;
};

window.simpanRekapNilaiPenuhKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let rawRekap = window.adminRekapNilaiData || {};
    let cleanRekap = {};

    Object.keys(rawRekap).forEach(function(kls) {
        let safeKls = window.sanitasiKeyRekapFirebase(kls);
        if (!safeKls) return;
        if (!cleanRekap[safeKls]) cleanRekap[safeKls] = {};

        let paketMap = rawRekap[kls] || {};
        Object.keys(paketMap).forEach(function(pkt) {
            let safePkt = window.sanitasiKeyRekapFirebase(pkt);
            if (!safePkt) return;
            if (!cleanRekap[safeKls][safePkt]) cleanRekap[safeKls][safePkt] = {};

            let siswaMap = paketMap[pkt] || {};
            Object.keys(siswaMap).forEach(function(nama) {
                let safeNama = window.sanitasiKeyRekapFirebase(nama);
                if (!safeNama) return;
                let item = Object.assign({}, siswaMap[nama]);
                if (!item.namaAsli) item.namaAsli = nama;
                if (!item.kelasAsli) item.kelasAsli = kls;
                if (!item.paketAsli) item.paketAsli = pkt;
                cleanRekap[safeKls][safePkt][safeNama] = item;
            });
        });
    });

    window.adminRekapNilaiData = cleanRekap;
    set(ref(db, basePath + '/admin_rekap_nilai'), cleanRekap).then(function() {
        if (typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(err) {
        console.error("Gagal menyimpan Rekap Nilai ke DB:", err);
    });
};

// 4B. Tarik Data Kelas & Siswa, Akun Siswa, Leaderboard, dan Notifikasi
window.adminDataLoaded = false;
onValue(ref(db, basePath + '/admin_data'), function(snap) {
    window.adminDataLoaded = true;
    window.adminData = snap.exists() ? snap.val() : {};
    if (typeof window.sinkronkanAkunSiswaDariAdminData === "function") window.sinkronkanAkunSiswaDariAdminData();
    if (typeof window.renderAdminData === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
        window.renderAdminData();
    }
});

window.akunSiswaLoaded = false;
onValue(ref(db, basePath + '/akun_siswa'), function(snap) {
    window.akunSiswaLoaded = true;
    window.akunSiswaData = snap.exists() ? snap.val() : {};
    if (typeof window.sinkronkanAkunSiswaDariAdminData === "function") window.sinkronkanAkunSiswaDariAdminData();
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
});

window.leaderboardLoaded = false;
onValue(ref(db, basePath + '/leaderboard_siswa'), function(snap) {
    window.leaderboardLoaded = true;
    window.leaderboardSiswaData = snap.exists() ? snap.val() : {};
    if (typeof window.perbaruiUIHeaderProfilSiswa === "function") {
        window.perbaruiUIHeaderProfilSiswa();
    }
    if (typeof window.renderTabelLeaderboard === "function" && document.getElementById('modal-leaderboard') && document.getElementById('modal-leaderboard').style.display === 'flex') {
        window.renderTabelLeaderboard();
    }
});

onValue(ref(db, basePath + '/admin_notifikasi'), function(snap) {
    window.adminNotifikasiData = snap.exists() ? snap.val() : [];
    if (!Array.isArray(window.adminNotifikasiData)) {
        window.adminNotifikasiData = Object.values(window.adminNotifikasiData);
    }
    if (typeof window.hitungDanUpdateBadgeNotifikasi === "function") {
        window.hitungDanUpdateBadgeNotifikasi();
    }
    if (typeof window.renderDaftarNotifAdmin === "function") {
        window.renderDaftarNotifAdmin();
    }
});

window.simpanAkunSiswaKeDB = function(usernameKey, dataObj, onDone) {
    if (!usernameKey) return;
    set(ref(db, basePath + '/akun_siswa/' + usernameKey), dataObj).then(function() {
        if (onDone) onDone();
    });
};

window.simpanSemuaAkunSiswaKeDB = function() {
    if (!window.akunSiswaData) return;
    set(ref(db, basePath + '/akun_siswa'), window.akunSiswaData);
};

window.simpanLeaderboardSiswaKeDB = function(usernameKey, dataObj) {
    if (!usernameKey || !dataObj) return;
    let cleanKey = window.sanitasiKeyRekapFirebase(usernameKey).toLowerCase();
    // Isolasi Penuh: Jangan pernah menyimpan akun Guru/Admin ke tabel leaderboard_siswa
    if (cleanKey === "mahardika" || cleanKey === "sbd" || sessionStorage.getItem("statusLogin") === "admin") return;
    if (window.daftarAkunGuru && window.daftarAkunGuru[cleanKey]) return;
    set(ref(db, basePath + '/leaderboard_siswa/' + cleanKey), dataObj);
};

window.simpanNotifikasiAdminKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    set(ref(db, basePath + '/admin_notifikasi'), window.adminNotifikasiData || []).then(function() {
        if (typeof window.showSaveToast === "function") window.showSaveToast();
    });
};

// 9. Tarik Data Ujian yang Sedang Aktif (Ringan & Dibutuhkan Siswa/Guru)
onValue(ref(db, basePath + '/admin_ujian_aktif'), function(snap) {
    window.adminUjianAktifData = snap.exists() ? snap.val() : {};
    if (typeof window.renderKontrolUjian === "function" && document.getElementById('modal-manajer-ujian') && document.getElementById('modal-manajer-ujian').style.display === 'flex') {
        window.renderKontrolUjian();
    }
});

// MESIN ON-DEMAND LISTENER DATA BERAT (MENCEGAH LAG SAAT AWAL BUKA WEB)
window._heavyListenersAttached = {
    bankUjian: false,
    adminBerat: false
};

// Tarik Bank Ujian hanya saat masuk ruang ujian atau saat Admin membuka Manajer Ujian
window.pastikanListenerBankUjianAktif = function() {
    if (window._heavyListenersAttached.bankUjian) return;
    window._heavyListenersAttached.bankUjian = true;

    onValue(ref(db, basePath + '/admin_bank_ujian'), function(snap) {
        window.adminBankUjianData = snap.exists() ? snap.val() : {};
        if (typeof window.renderManajerUjian === "function" && document.getElementById('modal-manajer-ujian') && document.getElementById('modal-manajer-ujian').style.display === 'flex') {
            window.renderManajerUjian();
        }
    });
};

// Tarik Data Administrasi Berat (Absensi, Agenda, Rekap Nilai, Live Monitor) khusus untuk Admin / Saat Modal Dibuka
window.pastikanListenerAdminBeratAktif = function() {
    window.pastikanListenerBankUjianAktif();
    if (window._heavyListenersAttached.adminBerat) return;
    window._heavyListenersAttached.adminBerat = true;

    onValue(ref(db, basePath + '/admin_absensi'), function(snap) {
        window.adminAbsensiData = snap.exists() ? snap.val() : {};
        if (typeof window.renderAbsensiAdmin === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
            window.renderAbsensiAdmin();
        }
    });

    onValue(ref(db, basePath + '/admin_agenda'), function(snap) {
        window.adminAgendaData = snap.exists() ? snap.val() : {};
        if (typeof window.renderAgendaAdmin === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
            window.renderAgendaAdmin();
        }
    });

    onValue(ref(db, basePath + '/admin_rekap_nilai'), function(snap) {
        window.adminRekapNilaiData = snap.exists() ? snap.val() : {};
        let modalRN = document.getElementById('modal-rekap-nilai');
        if (modalRN && modalRN.style.display === 'flex') {
            if (typeof window.renderDropdownRekap === "function") window.renderDropdownRekap();
            if (typeof window.renderRekapNilai === "function") window.renderRekapNilai();
        }
        let modalAdm = document.getElementById('modal-administrasi');
        if (modalAdm && modalAdm.style.display === 'flex') {
            if (typeof window.renderLedgerSiswa === "function") window.renderLedgerSiswa();
            if (typeof window.renderRemedialTabAdmin === "function") window.renderRemedialTabAdmin();
        }
        let modalPS = document.getElementById('modal-perkembangan-siswa');
        if (modalPS && modalPS.style.display === 'flex' && typeof window.renderTabelKognitifAdmin === "function") {
            window.muatFilterKognitifAdmin();
            window.renderTabelKognitifAdmin();
        }
    });

    onValue(ref(db, basePath + '/admin_live_monitor'), function(snap) {
        window.adminLiveMonitorData = snap.exists() ? snap.val() : {};
        if (typeof window.perbaruiBadgeNotifMonitor === "function") window.perbaruiBadgeNotifMonitor();

        let modalMU = document.getElementById('modal-manajer-ujian');
        let isMonitorOpen = (modalMU && modalMU.style.display === 'flex' && document.getElementById('tab-ujian-monitor') && document.getElementById('tab-ujian-monitor').style.display !== 'none');
        if (isMonitorOpen && typeof window.renderIsiLiveMonitor === "function") {
            window.renderIsiLiveMonitor();
        }
    });
};

// Jika yang login adalah Admin, tunda penarikan data berat selama 2.5 detik agar halaman utama terbuka instan lebih dulu
if (sessionStorage.getItem("statusLogin") === "admin") {
    setTimeout(function() {
        window.pastikanListenerAdminBeratAktif();
    }, 2500);
}

// Aktifkan otomatis tepat saat tombol Ujian atau menu Admin diklik
document.addEventListener('click', function(e) {
    let t = e.target.closest('[onclick*="modal-enter-ujian"], [onclick*="bukaModalMasukUjianSiswa"]');
    if (t) window.pastikanListenerBankUjianAktif();

    let adm = e.target.closest('#admin-menu-bar span, [onclick*="modal-rekap-nilai"], [onclick*="modal-manajer-ujian"], [onclick*="bukaModalAdministrasi"], [onclick*="bukaModalPerkembanganSiswa"]');
    if (adm) window.pastikanListenerAdminBeratAktif();
}, true);

// Fungsi Kirim Status Siswa ke Live Monitor (Mulai, Melanggar, Selesai)
window.simpanStatusLiveMonitorKeDB = function(paket, kelas, nama, payload) {
    if (!paket || !kelas || !nama) return;
    let safeNama = window.sanitasiKeyRekapFirebase(nama);
    let safePaket = window.sanitasiKeyRekapFirebase(paket);
    let safeKelas = window.sanitasiKeyRekapFirebase(kelas);

    let pathLM = basePath + '/admin_live_monitor/' + safePaket + '/' + safeKelas + '/' + safeNama;
    goOnline(db);
    set(ref(db, pathLM), payload).catch(function(err) {
        console.error("Gagal memperbarui Live Monitor:", err);
    });
};

// Fungsi Hapus History Live Monitor di Firebase (Mendukung Hapus Masal & Hapus Per-Siswa)
window.hapusDataLiveMonitorDiDB = function(paket, kelas, nama) {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let targetPath = basePath + '/admin_live_monitor';
    
    // Rute Tembakan Firebase:
    if (paket && kelas && kelas !== "Semua" && nama) {
        targetPath += '/' + paket + '/' + kelas + '/' + nama; // Hapus spesifik 1 anak
    } else if (paket && kelas && kelas !== "Semua") {
        targetPath += '/' + paket + '/' + kelas; // Hapus masal 1 kelas
    } else if (paket) {
        targetPath += '/' + paket; // Hapus masal 1 angkatan paket ujian
    }
    
    remove(ref(db, targetPath)).then(function() {
        if(typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(err) {
        console.error("Gagal menghapus history Live Monitor:", err);
    });
};


/* =========================================
   PENGIRIMAN DATA (WRITE) FIREBASE & AUTO-SAVE
   ========================================= */

window.showSaveToast = function() { 
    let st = document.getElementById('save-status-bar'); 
    if(st) {
        st.innerHTML = "<span style='color:#2ecc71;'>✓ Saved</span>"; 
        setTimeout(() => { st.innerHTML = "Cloud Sync: Ready"; }, 2000); 
    }
};

window.simpanAdminKeDB = function() { 
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Admin...</span>"; 
    
    set(ref(db, basePath + '/admin_data'), window.adminData).then(() => {
        window.showSaveToast();
    }).catch((error) => {
        console.error("Gagal menyimpan data admin:", error);
    });
};

window.simpanAbsensiKeDB = function() { 
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Absen...</span>"; 
    
    set(ref(db, basePath + '/admin_absensi'), window.adminAbsensiData).then(() => {
        window.showSaveToast();
    }).catch((error) => {
        console.error("Gagal menyimpan data absensi:", error);
    });
};

window.simpanAgendaKeDB = function() { 
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Agenda...</span>"; 
    
    set(ref(db, basePath + '/admin_agenda'), window.adminAgendaData).then(() => {
        window.showSaveToast();
    }).catch((error) => {
        console.error("Gagal menyimpan data agenda:", error);
    });
};

window.simpanBankUjianKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Bank Ujian...</span>"; 
    
    set(ref(db, basePath + '/admin_bank_ujian'), window.adminBankUjianData).then(() => {
        window.showSaveToast();
    }).catch((error) => {
        console.error("Gagal menyimpan bank ujian:", error);
    });
};

window.simpanBankLatihanKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Latihan...</span>"; 
    
    set(ref(db, basePath + '/admin_bank_latihan'), window.adminBankLatihanData).then(() => {
        window.showSaveToast();
    }).catch((error) => {
        console.error("Gagal menyimpan bank latihan:", error);
    });
};

window.simpanUjianAktifKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Kontrol...</span>"; 
    
    set(ref(db, basePath + '/admin_ujian_aktif'), window.adminUjianAktifData).then(() => {
        window.showSaveToast();
    }).catch((error) => {
        console.error("Gagal menyimpan ujian aktif:", error);
    });
};

// Fungsi Penembak Nilai Ujian Siswa ke Rekap Nilai Guru
window.simpanNilaiUjianKeDB = function(pathInfo, payload) {
    set(ref(db, basePath + '/' + pathInfo), payload).then(() => {
        console.log("Nilai ujian berhasil direkam secara permanen ke server.");
    }).catch(error => {
        console.error("Gagal mengirim nilai ujian:", error);
    });
};

// KUNCI ISOLASI ROOM: Hanya menyimpan ke room yang sesuai dengan atribut DOM aktif
window.simpanKeDB = function(slugTujuan) { 
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    if (window.isLoadingRoom) return; // Dilarang menyimpan saat sedang transisi pindah room

    let container = document.getElementById('blocks-container');
    let domRoom = container ? container.getAttribute('data-active-room') : '';
    let targetBab = slugTujuan || domRoom || window.babAktif;

    if (!targetBab) return;
    // Pengaman Mutlak: Jika room di layar berbeda dengan target simpan, batalkan!
    if (domRoom && domRoom !== targetBab) return;

    // PENGAMANAN PAYLOAD: Kecualikan tipe quiz dan pdf_slides agar kode UI HTML-nya tidak membebani database
    document.querySelectorAll('#blocks-container .content-block').forEach(function(b) {
        let i = b.getAttribute('data-index');
        if(window.contentBlocksData[i] && window.contentBlocksData[i].type !== 'quiz' && window.contentBlocksData[i].type !== 'pdf_slides') {
            window.contentBlocksData[i].html = b.innerHTML;
        }
    });
    
    document.querySelectorAll('#floating-boxes-container .fb-content').forEach(function(fb) {
        let i = fb.getAttribute('data-fb-index');
        if(window.floatingBoxesData[i]) {
            window.floatingBoxesData[i].html = fb.innerHTML;
        }
    });
    
    // PENGAMANAN PAYLOAD PDF: Jangan ikutkan array 'slides' yang masif ke dalam stringify utama
    let payloadBlocks = window.contentBlocksData.map(function(block) {
        if (block.type === 'pdf_slides') {
            // Salin blok, tapi kosongkan array slides-nya sementara agar tidak membuat payload macet
            let safeBlock = Object.assign({}, block);
            safeBlock.slides = []; 
            return safeBlock;
        }
        return block;
    });
    
    let payloadFloating = window.floatingBoxesData || [];

    try {
        sessionStorage.setItem('cache_room_' + (window.guruAktif || 'mahardika') + '_' + targetBab, JSON.stringify({ blocksObj: payloadBlocks, floatingBoxesObj: payloadFloating }));
    } catch (cacheError) {
        console.warn("Memori cache lokal penuh. Data tetap diamankan di Firebase.");
        sessionStorage.clear();
    }

    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing (" + targetBab + ")...</span>"; 
    
    // Simpan struktur dasar (tanpa array slides yang besar)
    set(ref(db, basePath + '/materi_koleksi/' + targetBab), {
        blocksObj: payloadBlocks, 
        floatingBoxesObj: payloadFloating
    }).then(function() {
        // SETELAH struktur utama aman, barulah kita tembakkan array slides PDF secara spesifik per indeks
        let janjiSimpanSlides = [];
        window.contentBlocksData.forEach(function(block, index) {
            if (block.type === 'pdf_slides' && Array.isArray(block.slides)) {
                // Tembak langsung ke path spesifik indeksnya
                let pathSlides = basePath + '/materi_koleksi/' + targetBab + '/blocksObj/' + index + '/slides';
                janjiSimpanSlides.push(set(ref(db, pathSlides), block.slides));
            }
        });

        if (janjiSimpanSlides.length > 0) {
            Promise.all(janjiSimpanSlides).then(function() {
                if(typeof window.showSaveToast === "function") window.showSaveToast();
            }).catch(function(err) {
                console.error("Gagal sinkron array PDF:", err);
                if (st) st.innerHTML = "<span style='color:#e74c3c;'>⚠️ Sebagian PDF Gagal Sync</span>";
            });
        } else {
            if(typeof window.showSaveToast === "function") window.showSaveToast();
        }
    }).catch(function(err) {
        console.error("Gagal sinkron utama:", err);
        if (st) st.innerHTML = "<span style='color:#e74c3c;'>❌ Gagal Sync</span>";
    });
};

// Event Listener untuk mendeteksi ketikan (Auto-save 0.4 detik terkunci per room)
window.typingTimer = null; 
document.getElementById('main-editor-wrapper').addEventListener('input', function(e) { 
    if (window.isLoadingRoom) return;
    if(e.target.classList.contains('content-block') || e.target.classList.contains('fb-content')) { 
        let container = document.getElementById('blocks-container');
        let lockedBab = (container && container.getAttribute('data-active-room')) || window.babAktif;
        if (!lockedBab) return;

        let st = document.getElementById('save-status-bar'); 
        if(st) st.innerHTML = "<span style='color:#e67e22;'>✍️ Typing...</span>";
        
        clearTimeout(window.typingTimer); 
        window.typingTimer = setTimeout(function() {
            window.simpanKeDB(lockedBab);
            window.typingTimer = null;
        }, 400); 
    }
});

if(window.floatingBoxesData && window.renderFloatingBoxes) {
    window.renderFloatingBoxes();
}
// Tarik & Simpan Data Check-in Afektif Siswa
onValue(ref(db, basePath + '/admin_afektif_siswa'), function(snap) {
    if (snap.exists()) {
        let val = snap.val();
        window.adminAfektifData = Array.isArray(val) ? val : Object.values(val);
    } else {
        window.adminAfektifData = [];
    }
    let modalPS = document.getElementById('modal-perkembangan-siswa');
    if (modalPS && modalPS.style.display === 'flex' && typeof window.renderTabelAfektifAdmin === 'function') {
        window.renderTabelAfektifAdmin();
    }
});

window.simpanDataAfektifKeDB = function() {
    set(ref(db, basePath + '/admin_afektif_siswa'), window.adminAfektifData || []).then(function() {
        if (typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(err) {
        console.error("Gagal menyimpan data afektif:", err);
    });
};