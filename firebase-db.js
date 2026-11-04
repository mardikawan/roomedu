import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, remove, goOffline, goOnline } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
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

// PENGATUR LALU LINTAS SERVER (HEMAT KONEKSI UNTUK 1000+ SISWA)
window.modeHematServerUjian = function(isOfflineMode) {
    try {
        if (isOfflineMode) {
            goOffline(db);
        } else {
            goOnline(db);
        }
    } catch (e) {
        console.warn("Pengaturan koneksi:", e);
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
   TARIK & SIMPAN DATA CATATAN GURU (EXCEL STYLE)
   ========================================= */
onValue(ref(db, basePath + '/admin_catatan_guru'), function(snap) {
    if (snap.exists()) {
        let data = snap.val();
        // Normalisasi: Firebase terkadang mengubah array menjadi object, kita pastikan tetap array
        window.adminCatatanGuruData = Array.isArray(data) ? data : Object.values(data);
    } else {
        window.adminCatatanGuruData = [{ id: 'sheet_1', nama: 'Sheet 1', html: '' }];
    }
    
    // Render ulang UI hanya jika Jendela sedang terbuka DAN guru TIDAK sedang mengetik
    let modalCG = document.getElementById('modal-catatan-guru');
    if (modalCG && modalCG.style.display === 'flex' && typeof window.renderSheetsCG === "function") {
        if (!window.isTypingCG) {
            window.renderSheetsCG();
            window.muatKontenSheetAktifCG();
        }
    }
});

window.simpanCatatanGuruKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    
    let stat = document.getElementById('cg-sync-status');
    if(stat) stat.innerHTML = "<span style='color:#f1c40f;'>☁️ Menyimpan...</span>";
    
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
            if(stat) stat.innerHTML = "<span style='color:#2ecc71;'>✓ Tersimpan</span>";
            window.isTypingCG = false; 
        }).catch(err => {
            console.error("Gagal simpan Catatan Guru:", err);
            if(stat) stat.innerHTML = "<span style='color:#e74c3c;' title='" + err.message + "'>❌ Gagal Simpan</span>";
        });
    } catch(e) {
        console.error("Data error:", e);
        if(stat) stat.innerHTML = "<span style='color:#e74c3c;'>❌ Error Data Format</span>";
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
    get(child(ref(db), basePath + '/materi_koleksi/' + targetRoom)).then(function(snap) {
        if (window.babAktif !== targetRoom) return;

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

// 4. Tarik Data Bank Latihan (OPEN AKSES UNTUK PUBLIK/TAMU)
onValue(ref(db, basePath + '/admin_bank_latihan'), function(snap) {
    if(snap.exists()) {
        window.adminBankLatihanData = snap.val();
    } else {
        window.adminBankLatihanData = {};
    }
    if(typeof window.renderManajerSoal === "function" && document.getElementById('modal-manajer-soal') && document.getElementById('modal-manajer-soal').style.display === 'flex') {
        window.renderManajerSoal();
    }
});

// --- DATA DI BAWAH INI HANYA DITARIK JIKA USER SUDAH LOGIN (SISWA / ADMIN) ---
if (statusSistem === "admin" || statusSistem === "siswa") {
    
    // 5. Tarik Data Administrasi (Daftar Kelas & Siswa)
    onValue(ref(db, basePath + '/admin_data'), function(snap) {
        if(snap.exists()) window.adminData = snap.val();
        else window.adminData = {};
        if(typeof window.renderAdminData === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
            window.renderAdminData();
        }
    });

    // 6. Tarik Data Absensi Siswa
    onValue(ref(db, basePath + '/admin_absensi'), function(snap) {
        if(snap.exists()) window.adminAbsensiData = snap.val();
        else window.adminAbsensiData = {};
        if(typeof window.renderAbsensiAdmin === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
            window.renderAbsensiAdmin();
        }
    });

    // 7. Tarik Data Agenda Mengajar
    onValue(ref(db, basePath + '/admin_agenda'), function(snap) {
        if(snap.exists()) window.adminAgendaData = snap.val();
        else window.adminAgendaData = {};
        if(typeof window.renderAgendaAdmin === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
            window.renderAgendaAdmin();
        }
    });

    // 8. Tarik Data Bank Ujian
    onValue(ref(db, basePath + '/admin_bank_ujian'), function(snap) {
        if(snap.exists()) window.adminBankUjianData = snap.val();
        else window.adminBankUjianData = {};
        if(typeof window.renderManajerUjian === "function" && document.getElementById('modal-manajer-ujian') && document.getElementById('modal-manajer-ujian').style.display === 'flex') {
            window.renderManajerUjian();
        }
    });

    // 9. Tarik Data Ujian yang Sedang Aktif
    onValue(ref(db, basePath + '/admin_ujian_aktif'), function(snap) {
        if(snap.exists()) window.adminUjianAktifData = snap.val();
        else window.adminUjianAktifData = {};
        if(typeof window.renderKontrolUjian === "function" && document.getElementById('modal-kontrol-ujian') && document.getElementById('modal-kontrol-ujian').style.display === 'flex') {
            window.renderKontrolUjian();
        }
    });

    // 10. Tarik Data Rekap Nilai Ujian (Ledger)
    onValue(ref(db, basePath + '/admin_rekap_nilai'), function(snap) {
        if(snap.exists()) window.adminRekapNilaiData = snap.val();
        else window.adminRekapNilaiData = {};
        if(typeof window.renderRekapNilai === "function" && document.getElementById('modal-rekap-nilai') && document.getElementById('modal-rekap-nilai').style.display === 'flex') {
            window.renderDropdownRekap();
        }
    });

    // 11. Tarik Data Live Monitor
    onValue(ref(db, basePath + '/admin_live_monitor'), function(snap) {
        if(snap.exists()) window.adminLiveMonitorData = snap.val();
        else window.adminLiveMonitorData = {};
        
        if(typeof window.perbaruiBadgeNotifMonitor === "function") window.perbaruiBadgeNotifMonitor();
        
        let modalMU = document.getElementById('modal-manajer-ujian'); 
        let isMonitorOpen = (modalMU && modalMU.style.display === 'flex' && document.getElementById('tab-ujian-monitor') && document.getElementById('tab-ujian-monitor').style.display !== 'none');
        
        if(isMonitorOpen && typeof window.renderIsiLiveMonitor === "function") {
            window.renderIsiLiveMonitor();
        }
    });
}

// Fungsi Kirim Status Siswa ke Live Monitor (Mulai, Melanggar, Selesai)
window.simpanStatusLiveMonitorKeDB = function(paket, kelas, nama, payload) {
    if(!paket || !kelas || !nama) return;
    let pathLM = basePath + '/admin_live_monitor/' + paket + '/' + kelas + '/' + nama;
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

    // Hanya ambil .content-block yang berada di dalam #blocks-container (abaikan popup pengumuman)
    document.querySelectorAll('#blocks-container .content-block').forEach(function(b) {
        let i = b.getAttribute('data-index');
        if(window.contentBlocksData[i] && window.contentBlocksData[i].type !== 'quiz') {
            window.contentBlocksData[i].html = b.innerHTML;
        }
    }); 
    
    document.querySelectorAll('#floating-boxes-container .fb-content').forEach(function(fb) {
        let i = fb.getAttribute('data-fb-index');
        if(window.floatingBoxesData[i]) {
            window.floatingBoxesData[i].html = fb.innerHTML;
        }
    });
    
    // Bekukan salinan data saat ini sebelum dikirim ke Firebase
    let payloadBlocks = JSON.parse(JSON.stringify(window.contentBlocksData || []));
    let payloadFloating = JSON.parse(JSON.stringify(window.floatingBoxesData || []));
    sessionStorage.setItem('cache_room_' + (window.guruAktif || 'mahardika') + '_' + targetBab, JSON.stringify({ blocksObj: payloadBlocks, floatingBoxesObj: payloadFloating }));

    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing (" + targetBab + ")...</span>"; 
    
    set(ref(db, basePath + '/materi_koleksi/' + targetBab), {
        blocksObj: payloadBlocks, 
        floatingBoxesObj: payloadFloating
    }).then(function() {
        if(typeof window.showSaveToast === "function") window.showSaveToast();
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