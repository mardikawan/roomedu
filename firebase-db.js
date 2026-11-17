import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, remove, goOffline, goOnline, update } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendEmailVerification, updatePassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
// IMPORT FIREBASE STORAGE
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-storage.js";

// Konfigurasi Database Baru: mardikawanroomedu
const firebaseConfig = {
    apiKey: "AIzaSyCO_zVSHknr4QrtuJg5TSwelfwh0QjIGe8",
    authDomain: "mardikawanroomedu.firebaseapp.com",
    databaseURL: "https://mardikawanroomedu-default-rtdb.firebaseio.com",
    projectId: "mardikawanroomedu",
    storageBucket: "mardikawanroomedu.firebasestorage.app",
    messagingSenderId: "273643057367",
    appId: "1:273643057367:web:9322dbcfc8913808fd4092",
    measurementId: "G-DNKDNVR2HE"
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
    signInWithEmailAndPassword(auth, email, password).then(function() { 
        if(onSuccess) onSuccess(); 
    }).catch(function(err) { 
        // JARING PENGAMAN: Jika admin utama belum terdaftar di Firebase Auth proyek baru, buatkan otomatis!
        if (email === "mahardika@admin.com") {
            createUserWithEmailAndPassword(auth, email, password).then(function() {
                if(onSuccess) onSuccess();
            }).catch(function(errCreate) {
                if(onError) onError(err); // Tetap kembalikan error login asli jika password salah
            });
        } else {
            if(onError) onError(err); 
        }
    });
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

// Mengambil Parameter URL & Menentukan Jalur Database Multi-Guru Lebih Awal
const urlParams = new URLSearchParams(window.location.search); 
window.babAktif = urlParams.get('bab') || "home";

let statusSistem = sessionStorage.getItem("statusLogin");
let usernameSistem = sessionStorage.getItem("username");
let guruParamUrl = urlParams.get('guru');

if (guruParamUrl) {
    sessionStorage.setItem("guruTarget", guruParamUrl.trim().toLowerCase());
}

let guruAktif = "mahardika";
if (statusSistem === "admin" && usernameSistem) {
    guruAktif = usernameSistem.trim().toLowerCase();
    sessionStorage.setItem("guruTarget", guruAktif);
} else {
    guruAktif = guruParamUrl ? guruParamUrl.trim().toLowerCase() : (sessionStorage.getItem("guruTarget") || "mahardika");
}

window.guruAktif = guruAktif;
let basePath = "data_guru/" + guruAktif;

// =========================================================================
// MESIN HEMAT KONEKSI: REST API (0 SLOT), BURST MODE, & IDLE 5 MENIT
// =========================================================================
window._burstOfflineTimer = null;
window._activeWriteCount = 0;
window._lastUserActivityTime = Date.now();
window._isIdleDisconnected = false;

// Putuskan koneksi WebSocket bawaan sejak detik pertama untuk non-admin (Siswa & Tamu = 0 Koneksi)
if (statusSistem !== "admin") {
    try { goOffline(db); } catch (e) {}
}

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

// Buka koneksi sesaat untuk menulis data, lalu otomatis putuskan kembali (Khusus Siswa/Tamu)
window.mulaiOperasiTulisDB = function() {
    clearTimeout(window._burstOfflineTimer);
    window._activeWriteCount = (window._activeWriteCount || 0) + 1;
    try { goOnline(db); } catch (e) {}
};

window.selesaiOperasiTulisDB = function(delayMs) {
    window._activeWriteCount = Math.max(0, (window._activeWriteCount || 1) - 1);
    if (sessionStorage.getItem("statusLogin") === "admin" && !window._isIdleDisconnected) return;

    clearTimeout(window._burstOfflineTimer);
    let tunggu = typeof delayMs === "number" ? delayMs : 2500;
    window._burstOfflineTimer = setTimeout(function() {
        if (window._activeWriteCount <= 0 && sessionStorage.getItem("statusLogin") !== "admin") {
            try { goOffline(db); } catch (e) {}
        }
    }, tunggu);
};

// JALUR BACA TANPA KUOTA KONEKSI (FIREBASE REST API FETCH JSON)
window.bacaDataRestFirebase = async function(path, onSuccess, onError) {
    let cleanPath = String(path || "").replace(/^\/+|\/+$/g, "");
    let url = firebaseConfig.databaseURL + "/" + cleanPath + ".json";
    try {
        if (auth && auth.currentUser) {
            try {
                let token = await auth.currentUser.getIdToken(false);
                if (token) url += "?auth=" + encodeURIComponent(token);
            } catch (e) {}
        }
        let res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
            let data = await res.json();
            if (onSuccess) onSuccess(data);
            return;
        }
        throw new Error("REST status " + res.status);
    } catch (err) {
        // Fallback aman: Buka koneksi sesaat, ambil data, lalu putuskan kembali
        window.mulaiOperasiTulisDB();
        get(ref(db, cleanPath)).then(function(snap) {
            if (onSuccess) onSuccess(snap.exists() ? snap.val() : null);
            window.selesaiOperasiTulisDB(1500);
        }).catch(function(e) {
            if (onError) onError(e);
            window.selesaiOperasiTulisDB(1500);
        });
    }
};

// ANTISIPASI 1: PEMUTUS KONEKSI OTOMATIS SAAT IDLE 5 MENIT & AUTO-REFRESH SAAT AKTIF KEMBALI
window.segarkanDataSaatAktifKembali = function() {
    if (window.isStrictUjianActive) return;
    if (typeof window.tarikDataRinganBerkalaRest === "function") {
        window.tarikDataRinganBerkalaRest();
    }
    if (typeof window.muatKontenHalaman === "function" && window.babAktif) {
        window.muatKontenHalaman(window.babAktif);
    }
    if (sessionStorage.getItem("statusLogin") === "siswa" && typeof window.updatePresensiOnlineSiswa === "function") {
        window.updatePresensiOnlineSiswa(true, false);
    }
};

window.catatAktivitasPengguna = function() {
    let now = Date.now();
    if (now - window._lastUserActivityTime < 2000 && !window._isIdleDisconnected) return;
    window._lastUserActivityTime = now;

    if (window._isIdleDisconnected) {
        window._isIdleDisconnected = false;
        let st = document.getElementById('save-status-bar');
        if (sessionStorage.getItem("statusLogin") === "admin") {
            try { goOnline(db); } catch (e) {}
            if (st) st.innerHTML = "<span style='color:#2ecc71;'>⚡ Tersambung Kembali</span>";
        }
        window.segarkanDataSaatAktifKembali();
    }
};

['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(function(evt) {
    window.addEventListener(evt, window.catatAktivitasPengguna, { passive: true });
});

// Cek setiap 15 detik: Jika tidak aktif selama 5 menit (300.000 ms), putuskan koneksi!
setInterval(function() {
    let durasiIdle = Date.now() - (window._lastUserActivityTime || Date.now());
    if (durasiIdle >= 300000 && !window._isIdleDisconnected) {
        window._isIdleDisconnected = true;
        try { goOffline(db); } catch (e) {}
        let st = document.getElementById('save-status-bar');
        if (st) st.innerHTML = "<span style='color:#f39c12;'>💤 Mode Hemat Koneksi (Idle 5m)</span>";
    }
}, 15000);

// Jika tab di-minimize / pindah aplikasi, langsung lepaskan koneksi untuk siswa/tamu
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") {
        if (sessionStorage.getItem("statusLogin") !== "admin" && window._activeWriteCount <= 0) {
            try { goOffline(db); } catch (e) {}
        }
    } else if (document.visibilityState === "visible") {
        window.catatAktivitasPengguna();
    }
});

// Pastikan koneksi online & gunakan akun Firebase Auth masing-masing siswa saat hendak menulis data
window.pastikanAuthFirebaseSiswaAktif = function(callback) {
    window.mulaiOperasiTulisDB();
    if (auth.currentUser) {
        if (callback) callback();
        return;
    }
    let stat = sessionStorage.getItem("statusLogin");
    let rawU = (sessionStorage.getItem("username") || "").trim().toLowerCase();
    if (stat === "siswa" && rawU) {
        let dataSiswa = (window.akunSiswaData && window.akunSiswaData[rawU]) ? window.akunSiswaData[rawU] : null;
        let emailSiswa = (dataSiswa && dataSiswa.gmail) ? dataSiswa.gmail : (rawU + "@siswamahardika.com");
        let passSiswa = (dataSiswa && dataSiswa.password && String(dataSiswa.password).length >= 6) ? String(dataSiswa.password) : "123456";

        signInWithEmailAndPassword(auth, emailSiswa, passSiswa).then(function() {
            if (callback) callback();
        }).catch(function() {
            createUserWithEmailAndPassword(auth, emailSiswa, passSiswa).then(function() {
                if (callback) callback();
            }).catch(function() {
                if (callback) callback();
            });
        });
    } else {
        if (callback) callback();
    }
};

// Fungsi Update Status Online/Offline & Waktu Login Terakhir Siswa (Mode Ketuk-Lepas 0 Koneksi Menggantung)
window.updatePresensiOnlineSiswa = function(isOnlineNow, isInitialLogin) {
    let stat = sessionStorage.getItem("statusLogin");
    let rawU = (sessionStorage.getItem("username") || "").trim().toLowerCase();
    if (stat !== "siswa" || !rawU || rawU === "mahardika" || rawU === "tamu" || window.isStrictUjianActive || window._isIdleDisconnected) return;

    let cleanKey = window.sanitasiKeyRekapFirebase ? window.sanitasiKeyRekapFirebase(rawU).toLowerCase() : rawU;
    let now = new Date();
    let waktuStr = String(now.getDate()).padStart(2, '0') + '/' +
                   String(now.getMonth() + 1).padStart(2, '0') + '/' +
                   now.getFullYear() + ' ' +
                   String(now.getHours()).padStart(2, '0') + ':' +
                   String(now.getMinutes()).padStart(2, '0');

    let payloadUpdate = {
        isOnline: Boolean(isOnlineNow),
        lastActive: Date.now()
    };
    if (isInitialLogin) {
        payloadUpdate.waktuLoginTerakhir = waktuStr;
        payloadUpdate.loginTerakhir = waktuStr;
    }

    if (window.leaderboardSiswaData && window.leaderboardSiswaData[cleanKey]) {
        Object.assign(window.leaderboardSiswaData[cleanKey], payloadUpdate);
    }

    window.pastikanAuthFirebaseSiswaAktif(function() {
        update(ref(db, basePath + '/leaderboard_siswa/' + cleanKey), payloadUpdate).then(function() {
            window.selesaiOperasiTulisDB(1500);
        }).catch(function() {
            window.selesaiOperasiTulisDB(1500);
        });
    });
};

// Detak presensi hanya berjalan jika siswa benar-benar aktif dalam 5 menit terakhir (diubah ke 4 menit agar hemat)
setInterval(function() {
    let aktifBaruSaja = (Date.now() - (window._lastUserActivityTime || 0)) < 240000;
    if (document.visibilityState === "visible" && aktifBaruSaja && sessionStorage.getItem("statusLogin") === "siswa" && !window.isStrictUjianActive && !window._isIdleDisconnected) {
        window.updatePresensiOnlineSiswa(true, false);
    }
}, 240000);

window.addEventListener("beforeunload", function() {
    if (sessionStorage.getItem("statusLogin") === "siswa") {
        try { goOffline(db); } catch (e) {}
    }
});

// Pengiriman Nilai Ujian dengan Jaminan Terkirim + Putus Koneksi Otomatis Setelah Sukses
window.kirimNilaiUjianAmanKeDB = function(pathInfo, payload, onSuccess, onError) {
    try {
        window.mulaiOperasiTulisDB();
        set(ref(db, basePath + '/' + pathInfo), payload).then(function() {
            window.selesaiOperasiTulisDB(2500);
            if (onSuccess) onSuccess();
        }).catch(function(err) {
            window.selesaiOperasiTulisDB(2500);
            if (onError) onError(err);
        });
    } catch (e) {
        window.selesaiOperasiTulisDB(2500);
        if (onError) onError(e);
    }
};

/* =========================================
   SINKRONISASI DAFTAR AKUN GURU (SUPER ADMIN) VIA REST API
   ========================================= */
window.daftarAkunGuru = window.daftarAkunGuru || {};

window.bacaDataRestFirebase('sistem_utama/daftar_akun_guru', function(data) {
    window.daftarAkunGuru = data || {};
    if (typeof window.renderDaftarAkunGuru === "function") {
        window.renderDaftarAkunGuru();
    }
});

window.simpanDaftarAkunGuruKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin" || sessionStorage.getItem("username") !== "mahardika") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Akun Guru...</span>";

    window.mulaiOperasiTulisDB();
    set(ref(db, 'sistem_utama/daftar_akun_guru'), window.daftarAkunGuru).then(function() {
        window.selesaiOperasiTulisDB();
        if(typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(error) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal menyimpan akun guru:", error);
    });
};

/* =========================================
   PENGAMBILAN DATA (READ) VIA REST API (0 KUOTA KONEKSI)
   ========================================= */

// 1. Tarik Pengaturan Tema via REST API
window.bacaDataRestFirebase(basePath + '/theme_settings', function(t) {
    let webTitleEl = document.getElementById('web-title');
    let headerWrap = document.querySelector('.header-wrapper');
    if (t) {
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
   TARIK & SIMPAN DATA CATATAN GURU & KELAS (KHUSUS ADMIN)
   ========================================= */
if (sessionStorage.getItem("statusLogin") === "admin") {
    window.bacaDataRestFirebase(basePath + '/admin_catatan_guru', function(data) {
        if (window.isTypingCG || (Date.now() - (window._lastSaveCGTime || 0) < 1500)) return;
        if (data) {
            window.adminCatatanGuruData = Array.isArray(data) ? data : Object.values(data);
        } else {
            window.adminCatatanGuruData = [{ id: 'sheet_1', nama: 'Sheet 1', html: '' }];
        }
        let modalCG = document.getElementById('modal-catatan-guru');
        let editorCG = document.getElementById('cg-editor-area');
        if (modalCG && modalCG.style.display === 'flex' && typeof window.renderSheetsCG === "function") {
            if (document.activeElement !== editorCG) {
                window.renderSheetsCG();
                window.muatKontenSheetAktifCG();
            }
        }
    });

    window.bacaDataRestFirebase(basePath + '/admin_catatan_kelas', function(data) {
        if (window.isTypingCK || (Date.now() - (window._lastSaveCKTime || 0) < 1500)) return;
        if (data) {
            window.adminCatatanKelasData = data;
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
}

window.simpanCatatanGuruKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    
    let stat = document.getElementById('cg-sync-status');
    if(stat) stat.innerHTML = "<span style='color:#f1c40f;'>☁️ Menyimpan...</span>";
    window._lastSaveCGTime = Date.now();
    
    try {
        let payload = {};
        let sourceData = Array.isArray(window.adminCatatanGuruData) ? window.adminCatatanGuruData : Object.values(window.adminCatatanGuruData);
        
        sourceData.forEach(function(sheet, idx) {
            if (sheet) {
                payload['sheet_' + idx] = {
                    id: sheet.id || ('sheet_' + Date.now()),
                    nama: sheet.nama || ('Sheet ' + (idx + 1)),
                    html: sheet.html || ''
                };
            }
        });
        
        window.mulaiOperasiTulisDB();
        set(ref(db, basePath + '/admin_catatan_guru'), payload).then(function() {
            window.selesaiOperasiTulisDB();
            window._lastSaveCGTime = Date.now();
            window.isTypingCG = false;
            if(stat) stat.innerHTML = "<span style='color:#2ecc71;'>✓ Tersimpan</span>";
        }).catch(function(err) {
            window.selesaiOperasiTulisDB();
            window.isTypingCG = false;
            console.error("Gagal simpan Catatan Guru:", err);
            if(stat) stat.innerHTML = "<span style='color:#e74c3c;' title='" + err.message + "'>❌ Gagal Simpan</span>";
        });
    } catch(e) {
        window.isTypingCG = false;
        if(stat) stat.innerHTML = "<span style='color:#e74c3c;'>❌ Error Data Format</span>";
    }
};

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
            sourceData.forEach(function(sheet, idx) {
                if (sheet) {
                    payload[kls]['sheet_' + idx] = {
                        id: sheet.id || ('sheet_' + Date.now()),
                        nama: sheet.nama || ('Sheet ' + (idx + 1)),
                        html: sheet.html || ''
                    };
                }
            });
        }
        
        window.mulaiOperasiTulisDB();
        set(ref(db, basePath + '/admin_catatan_kelas'), payload).then(function() {
            window.selesaiOperasiTulisDB();
            window._lastSaveCKTime = Date.now();
            window.isTypingCK = false;
            if(stat) stat.innerHTML = "<span style='color:#2ecc71;'>✓ Tersimpan</span>";
        }).catch(function(err) {
            window.selesaiOperasiTulisDB();
            window.isTypingCK = false;
            console.error("Gagal simpan Catatan Kelas:", err);
            if(stat) stat.innerHTML = "<span style='color:#e74c3c;'>❌ Gagal Simpan</span>";
        });
    } catch(e) {
        window.isTypingCK = false;
        if(stat) stat.innerHTML = "<span style='color:#e74c3c;'>❌ Error Format</span>";
    }
};

// Tarik Popup Pengumuman via REST API
window.bacaDataRestFirebase(basePath + '/popup_pengumuman', function(val) {
    let box = document.getElementById('popup-content-box');
    if (val && val.html) {
        let htmlContent = val.html || '';
        if(box) box.innerHTML = htmlContent;
        
        if(htmlContent.trim() !== '' && htmlContent !== '<p><br></p>') {
            setTimeout(function() {
                if(typeof window.bukaWelcomePopup === 'function' && !window.isStrictUjianActive) {
                    if (!sessionStorage.getItem('popup_welcome_seen')) {
                        window.bukaWelcomePopup();
                        sessionStorage.setItem('popup_welcome_seen', 'true');
                    }
                }
            }, 1000);
        }
    } else {
        if(box) box.innerHTML = '';
    }
});

// 2. Tarik Struktur Halaman & Render Navbar via REST API
window.bacaDataRestFirebase(basePath + '/pages_struktur', function(val) {
    if (val) {
        window.pagesData = Array.isArray(val) ? val : Object.values(val);
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

    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/pages_struktur'), window.pagesData).then(function() {
        window.selesaiOperasiTulisDB();
        if(typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(error) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal menyimpan struktur halaman:", error);
    });
};

// Fungsi Simpan Pengaturan Tema Header ke Firebase
window.simpanTemaKeDB = function(themeObj) {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Theme...</span>";

    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/theme_settings'), themeObj).then(function() {
        window.selesaiOperasiTulisDB();
        if(typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(error) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal menyimpan tema:", error);
    });
};

// Fungsi Simpan Popup Pengumuman ke Firebase
window.simpanPopupKeDB = function(htmlContent) {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Popup...</span>";

    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/popup_pengumuman'), { html: htmlContent }).then(function() {
        window.selesaiOperasiTulisDB();
        if(typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(error) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal menyimpan popup:", error);
    });
};

// 3. Mesin Pemuat Konten Halaman Tanpa Refresh (SPA Engine - 100% via REST API 0 Koneksi)
window.isLoadingRoom = false;

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
            window.homeLeftBlocksData = parsed.leftBlocksObj || [];
            window.homeRightBlocksData = parsed.rightBlocksObj || [];
            
            if(typeof window.renderBlocks === 'function') window.renderBlocks(); 
            if(typeof window.renderFloatingBoxes === 'function') window.renderFloatingBoxes();
            
            window.isLoadingRoom = false;
            if(st) st.innerHTML = "<span style='color:#2ecc71;'>⚡ Ready</span>";
        } catch(e) {}
    } else {
        if(container) container.innerHTML = '';
    }
    
    // 2. SINKRONISASI DIAM-DIAM DARI FIREBASE REST API (0 Kuota Koneksi!)
    let timeoutFirebase = setTimeout(function() {
        window.isLoadingRoom = false;
        if (st) st.innerHTML = "<span style='color:#e74c3c;'>⚠️ Koneksi Lambat</span>";
    }, 8000);

    window.bacaDataRestFirebase(basePath + '/materi_koleksi/' + targetRoom, function(rawVal) {
        clearTimeout(timeoutFirebase);
        if (window.babAktif !== targetRoom) {
            window.isLoadingRoom = false;
            return;
        }

        let dataDariServer = (rawVal && rawVal.blocksObj) ? rawVal : null;
        
        if (dataDariServer) {
            window.contentBlocksData = JSON.parse(JSON.stringify(dataDariServer.blocksObj)); 
            window.floatingBoxesData = JSON.parse(JSON.stringify(dataDariServer.floatingBoxesObj || [])); 
            window.homeLeftBlocksData = JSON.parse(JSON.stringify(dataDariServer.leftBlocksObj || []));
            window.homeRightBlocksData = JSON.parse(JSON.stringify(dataDariServer.rightBlocksObj || []));
            
            try { sessionStorage.setItem(cacheKey, JSON.stringify(dataDariServer)); } catch (e) {}
        } else {
            if (!cachedData) {
                window.contentBlocksData = [{type:'text', html:"<p>Ketik materi...</p>", bg:"#ffffff", pattern:"", color:"#333333", width:"M", padTop:"40px", padBot:"40px", drawing:""}]; 
                window.floatingBoxesData = []; 
                window.homeLeftBlocksData = [];
                window.homeRightBlocksData = [];
            }
        }
        
        window.contentBlocksData.forEach(function(b) {
            if(!b.padTop) b.padTop = "40px"; if(!b.padBot) b.padBot = "40px"; 
            if(!b.drawing) b.drawing = ""; if(!b.type) b.type = "text"; if(!b.pattern) b.pattern = "";
        }); 

        window.isLoadingRoom = false;
        
        if(typeof window.renderBlocks === 'function') window.renderBlocks(); 
        if(typeof window.renderFloatingBoxes === 'function') window.renderFloatingBoxes();
        if(typeof window.updateBreadcrumb === 'function') window.updateBreadcrumb();
        
        if(st) st.innerHTML = "<span style='color:#2ecc71;'>✓ Cloud Sync: OK</span>";
        setTimeout(function() { if(st && st.innerHTML.indexOf('Sync: OK') !== -1) st.innerHTML = "Cloud Sync: Ready"; }, 1500);
    }, function() {
        clearTimeout(timeoutFirebase);
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

// 4. Tarik Data Bank Latihan via REST API (DENGAN CACHE LOKAL INSTAN 0.01 DETIK ANTI-LAG)
let cacheLatihanKey = 'cache_bank_latihan_' + guruAktif;
try {
    let rawCacheLat = localStorage.getItem(cacheLatihanKey);
    if (rawCacheLat) {
        window.adminBankLatihanData = JSON.parse(rawCacheLat);
        window.bankLatihanLoaded = true;
    }
} catch(e) {}

window.muatBankLatihanOnDemand = function(forceRefresh) {
    if (window._bankLatihanFetched && !forceRefresh) return;
    window._bankLatihanFetched = true;

    window.bacaDataRestFirebase(basePath + '/admin_bank_latihan', function(val) {
        window.bankLatihanLoaded = true;
        if (val) {
            window.adminBankLatihanData = val;
            try { localStorage.setItem(cacheLatihanKey, JSON.stringify(window.adminBankLatihanData)); } catch(e) {}
        } else {
            window.adminBankLatihanData = {};
        }
        if (typeof window.renderManajerSoal === "function" && document.getElementById('modal-manajer-soal') && document.getElementById('modal-manajer-soal').style.display === 'flex') {
            window.renderManajerSoal();
        }
        let modalEnterLat = document.getElementById('modal-enter-latihan');
        if (modalEnterLat && modalEnterLat.style.display === 'flex' && typeof window.inisialisasiDropdownLatihanSiswa === "function") {
            window.inisialisasiDropdownLatihanSiswa();
        }
    });
};

// Tarik dari server via REST hanya saat siswa klik tombol Latihan atau Guru klik Manajer Latihan
document.addEventListener('click', function(e) {
    if (e.target.closest('[onclick*="modal-enter-latihan"], [onclick*="modal-manajer-soal"]')) {
        window.muatBankLatihanOnDemand(false);
    }
}, true);

// 4C. Tarik Data Jadwal Sekolah & Kalender Pengingat Admin + Kolom Kustom Ledger via REST API
if (sessionStorage.getItem("statusLogin") === "admin") {
    window.bacaDataRestFirebase(basePath + '/admin_jadwal_kalender', function(val) {
        window.adminJadwalKalenderData = val || { excelHtml: "", events: {} };
        if (typeof window.hitungDanUpdateBadgeNotifikasi === "function") {
            window.hitungDanUpdateBadgeNotifikasi();
        }
        let modalJG = document.getElementById('modal-jadwal-guru');
        if (modalJG && modalJG.style.display === 'flex' && typeof window.renderKalenderGuru === "function") {
            window.renderKalenderGuru();
        }
    });
}

window.simpanJadwalKalenderKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/admin_jadwal_kalender'), window.adminJadwalKalenderData || { excelHtml: "", events: {} }).then(function() {
        window.selesaiOperasiTulisDB();
        if (typeof window.showSaveToast === "function") window.showSaveToast();
        if (typeof window.hitungDanUpdateBadgeNotifikasi === "function") window.hitungDanUpdateBadgeNotifikasi();
    }).catch(function() {
        window.selesaiOperasiTulisDB();
    });
};

window.bacaDataRestFirebase(basePath + '/admin_ledger_meta', function(val) {
    window.adminLedgerMetaData = val || {};
    if (typeof window.renderLedgerSiswa === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
        window.renderLedgerSiswa();
    }
});

window.simpanLedgerMetaKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/admin_ledger_meta'), window.adminLedgerMetaData || {}).then(function() {
        window.selesaiOperasiTulisDB();
        if (typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function() {
        window.selesaiOperasiTulisDB();
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
    let updates = {};

    Object.keys(rawRekap).forEach(function(kls) {
        let safeKls = window.sanitasiKeyRekapFirebase(kls);
        if (!safeKls) return;
        
        let paketMap = rawRekap[kls] || {};
        Object.keys(paketMap).forEach(function(pkt) {
            let safePkt = window.sanitasiKeyRekapFirebase(pkt);
            if (!safePkt) return;
            
            let siswaMap = paketMap[pkt] || {};
            Object.keys(siswaMap).forEach(function(nama) {
                let safeNama = window.sanitasiKeyRekapFirebase(nama);
                if (!safeNama) return;
                let item = Object.assign({}, siswaMap[nama]);
                if (!item.namaAsli) item.namaAsli = nama;
                if (!item.kelasAsli) item.kelasAsli = kls;
                if (!item.paketAsli) item.paketAsli = pkt;
                
                updates[safeKls + '/' + safePkt + '/' + safeNama] = item;
            });
        });
    });

    window.mulaiOperasiTulisDB();
    update(ref(db, basePath + '/admin_rekap_nilai'), updates).then(function() {
        window.selesaiOperasiTulisDB();
        if (typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(err) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal memperbarui Rekap Nilai ke DB:", err);
    });
};

// 4B. Tarik Data Kelas & Siswa, Akun Siswa, Leaderboard, Notifikasi, & Ujian Aktif via REST API (0 Koneksi)
window.adminDataLoaded = false;
window.muatAdminDataRest = function() {
    window.bacaDataRestFirebase(basePath + '/admin_data', function(val) {
        window.adminDataLoaded = true;
        window.adminData = val || {};
        if (typeof window.sinkronkanAkunSiswaDariAdminData === "function") window.sinkronkanAkunSiswaDariAdminData();
        if (typeof window.renderAdminData === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
            window.renderAdminData();
        }
    });
};
window.muatAdminDataRest();

window.akunSiswaLoaded = false;
window.muatDataAkunSiswaSekali = function() {
    window.bacaDataRestFirebase(basePath + '/akun_siswa', function(val) {
        window.akunSiswaLoaded = true;
        window.akunSiswaData = val || {};
        if (typeof window.sinkronkanAkunSiswaDariAdminData === "function") window.sinkronkanAkunSiswaDariAdminData();
        if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
    });
};
window.muatDataAkunSiswaSekali();

window.leaderboardLoaded = false;
window._lastSaveLBTime = 0;

window.muatLeaderboardPenuhSekali = function(onDone) {
    window.bacaDataRestFirebase(basePath + '/leaderboard_siswa', function(val) {
        window.leaderboardLoaded = true;
        let serverData = val || {};

        if (window.leaderboardSiswaData && (Date.now() - (window._lastSaveLBTime || 0) < 5000)) {
            Object.keys(window.leaderboardSiswaData).forEach(function(k) {
                let loc = window.leaderboardSiswaData[k];
                let srv = serverData[k];
                if (loc && srv) {
                    let locXP = Math.max(Number(loc.xpTotal) || 0, Number(loc.xp) || 0);
                    let srvXP = Math.max(Number(srv.xpTotal) || 0, Number(srv.xp) || 0);
                    if (locXP >= srvXP) serverData[k] = loc;
                } else if (loc && !srv) {
                    serverData[k] = loc;
                }
            });
        }

        window.leaderboardSiswaData = serverData;
        let rawU = sessionStorage.getItem("username");
        if (rawU && typeof window.sinkronkanObjekDualXPDanCoin === "function") {
            window.sinkronkanObjekDualXPDanCoin(rawU);
        }
        if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
        if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
        if (typeof window.renderTabelLeaderboard === "function" && document.getElementById('modal-leaderboard') && document.getElementById('modal-leaderboard').style.display === 'flex') {
            window.renderTabelLeaderboard();
        }
        if (onDone) onDone();
    });
};

// Saat awal buka web: jika siswa login, tarik 1 data miliknya sendiri via REST API (0 Kuota Koneksi!)
(function muatProfilSiswaAwalRest() {
    let rawU = (sessionStorage.getItem("username") || "").trim().toLowerCase();
    let stat = sessionStorage.getItem("statusLogin");
    if (stat === "siswa" && rawU && rawU !== "sbd") {
        let cleanU = window.sanitasiKeyRekapFirebase(rawU).toLowerCase();
        window.bacaDataRestFirebase(basePath + '/leaderboard_siswa/' + cleanU, function(val) {
            window.leaderboardLoaded = true;
            if (!window.leaderboardSiswaData) window.leaderboardSiswaData = {};
            if (val) {
                window.leaderboardSiswaData[cleanU] = val;
                window.leaderboardSiswaData[rawU] = val;
            }
            if (typeof window.sinkronkanObjekDualXPDanCoin === "function") window.sinkronkanObjekDualXPDanCoin(rawU);
            if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
            if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
        });
    } else if (stat === "admin") {
        window.muatLeaderboardPenuhSekali();
    }
})();

// Tarik Notifikasi & Ujian Aktif via REST API (Tanpa Menahan WebSocket)
window.tarikDataRinganBerkalaRest = function(onDone) {
    window.bacaDataRestFirebase(basePath + '/admin_notifikasi', function(val) {
        window.adminNotifikasiData = val ? (Array.isArray(val) ? val : Object.values(val)) : [];
        if (typeof window.hitungDanUpdateBadgeNotifikasi === "function") {
            window.hitungDanUpdateBadgeNotifikasi();
        }
        if (typeof window.renderDaftarNotifAdmin === "function") {
            window.renderDaftarNotifAdmin();
        }
    });

    window.bacaDataRestFirebase(basePath + '/admin_ujian_aktif', function(val) {
        window.adminUjianAktifData = val || {};
        if (typeof window.renderKontrolUjian === "function" && document.getElementById('modal-manajer-ujian') && document.getElementById('modal-manajer-ujian').style.display === 'flex') {
            window.renderKontrolUjian();
        }
        if (onDone) onDone();
    });
};
window.tarikDataRinganBerkalaRest();

// Tarik daftar penuh Leaderboard, Notifikasi, atau Akun Siswa via REST saat tombol terkait diklik
document.addEventListener('click', function(e) {
    if (e.target.closest('#btn-header-leaderboard, [onclick*="bukaModalLeaderboard"], [onclick*="bukaModalPerkembanganSiswa"]')) {
        window.muatLeaderboardPenuhSekali();
    }
    if (e.target.closest('#btn-login-utama, [onclick*="bukaModalLoginSistem"]')) {
        if (!window.akunSiswaLoaded || Object.keys(window.akunSiswaData || {}).length === 0) {
            window.muatDataAkunSiswaSekali();
        }
    }
    if (e.target.closest('#btn-header-notif, [onclick*="bukaModalNotifikasiSiswa"], [onclick*="bukaModalMasukUjianSiswa"], [onclick*="modal-enter-ujian"]')) {
        window.tarikDataRinganBerkalaRest();
    }
}, true);

window.simpanAkunSiswaKeDB = function(usernameKey, dataObj, onDone) {
    if (!usernameKey) return;
    let cleanKey = window.sanitasiKeyRekapFirebase(usernameKey).toLowerCase();
    window.pastikanAuthFirebaseSiswaAktif(function() {
        set(ref(db, basePath + '/akun_siswa/' + cleanKey), dataObj).then(function() {
            window.selesaiOperasiTulisDB(2000);
            if (onDone) onDone();
        }).catch(function() {
            window.selesaiOperasiTulisDB(2000);
        });
    });
};

window.simpanSemuaAkunSiswaKeDB = function() {
    if (!window.akunSiswaData) return;
    window.pastikanAuthFirebaseSiswaAktif(function() {
        update(ref(db, basePath + '/akun_siswa'), window.akunSiswaData).then(function() {
            window.selesaiOperasiTulisDB(2000);
        }).catch(function() {
            window.selesaiOperasiTulisDB(2000);
        });
    });
};

window.simpanLeaderboardSiswaKeDB = function(usernameKey, dataObj) {
    if (!usernameKey || !dataObj) return;
    let cleanKey = window.sanitasiKeyRekapFirebase(usernameKey).toLowerCase();
    if (!cleanKey || cleanKey === "mahardika" || cleanKey === "sbd" || cleanKey === "tamu" || cleanKey === "admin") return;
    if (window.daftarAkunGuru && window.daftarAkunGuru[cleanKey]) return;

    window._lastSaveLBTime = Date.now();

    let prosesSimpanAman = function(existingServerObj) {
        let cleanIncoming = JSON.parse(JSON.stringify(dataObj));
        let srvXP = existingServerObj ? Math.max(Number(existingServerObj.xpTotal) || 0, Number(existingServerObj.xp) || 0) : 0;
        let srvCoin = existingServerObj
            ? ((existingServerObj.coin !== undefined) ? Number(existingServerObj.coin) : ((existingServerObj.xpTersedia !== undefined) ? Number(existingServerObj.xpTersedia) : srvXP))
            : 0;
        let locXP = Math.max(Number(cleanIncoming.xpTotal) || 0, Number(cleanIncoming.xp) || 0);

        if (cleanIncoming._createdBeforeLoad && existingServerObj && srvXP > 0) {
            let deltaXP = Number(cleanIncoming._pendingXPDelta) || locXP;
            let deltaCoin = Number(cleanIncoming._pendingCoinDelta) || Number(cleanIncoming.coin) || 0;
            locXP = srvXP + deltaXP;
            cleanIncoming.xpTotal = locXP;
            cleanIncoming.xp = locXP;
            cleanIncoming.coin = srvCoin + deltaCoin;
            cleanIncoming.xpTersedia = cleanIncoming.coin;
        }
        delete cleanIncoming._createdBeforeLoad;
        delete cleanIncoming._pendingXPDelta;
        delete cleanIncoming._pendingCoinDelta;
        delete dataObj._createdBeforeLoad;
        delete dataObj._pendingXPDelta;
        delete dataObj._pendingCoinDelta;

        let isUninitializedZeroObj = (locXP === 0 && (Number(cleanIncoming.coin) || 0) === 0 && srvXP > 0);
        if (isUninitializedZeroObj && existingServerObj) {
            cleanIncoming.xpTotal = srvXP;
            cleanIncoming.xp = srvXP;
            cleanIncoming.coin = srvCoin;
            cleanIncoming.xpTersedia = srvCoin;
        }

        let merged = Object.assign({}, existingServerObj || {}, cleanIncoming);

        merged.xpTotal = Math.max(srvXP, locXP);
        merged.xp = merged.xpTotal;

        if (merged.coin === undefined && merged.xpTersedia === undefined) {
            merged.coin = existingServerObj ? srvCoin : merged.xpTotal;
        } else {
            merged.coin = Math.max(0, Number(merged.coin !== undefined ? merged.coin : merged.xpTersedia) || 0);
        }
        merged.xpTersedia = merged.coin;
        merged.coinInitialized = true;

        if (!window.leaderboardSiswaData) window.leaderboardSiswaData = {};
        window.leaderboardSiswaData[cleanKey] = merged;
        let rawU = sessionStorage.getItem("username");
        if (rawU && window.sanitasiKeyRekapFirebase(rawU).toLowerCase() === cleanKey) {
            window.leaderboardSiswaData[rawU] = merged;
        }
        window._lastSaveLBTime = Date.now();
        window.leaderboardLoaded = true;

        window.pastikanAuthFirebaseSiswaAktif(function() {
            set(ref(db, basePath + '/leaderboard_siswa/' + cleanKey), merged).then(function() {
                window.selesaiOperasiTulisDB(2000);
                if (typeof window.perbaruiTampilanSaldoXPPet === "function") window.perbaruiTampilanSaldoXPPet();
                if (typeof window.perbaruiUIHeaderProfilSiswa === "function") window.perbaruiUIHeaderProfilSiswa();
            }).catch(function(err) {
                window.selesaiOperasiTulisDB(2000);
                console.error("Gagal menyimpan XP/Coin ke Firebase:", err);
            });
        });
    };

    let cariExistingByNama = function() {
        if (!window.leaderboardSiswaData) return null;
        if (window.leaderboardSiswaData[cleanKey]) return window.leaderboardSiswaData[cleanKey];
        let targetNama = String(dataObj.namaLengkap || "").trim().toLowerCase();
        let targetKls = String(dataObj.kelas || "").trim();
        if (!targetNama) return null;
        let foundKey = Object.keys(window.leaderboardSiswaData).find(function(k) {
            let item = window.leaderboardSiswaData[k];
            return item && String(item.namaLengkap || "").trim().toLowerCase() === targetNama && (!targetKls || item.kelas === targetKls);
        });
        return foundKey ? window.leaderboardSiswaData[foundKey] : null;
    };

    if (!window.leaderboardLoaded || dataObj._createdBeforeLoad) {
        window.bacaDataRestFirebase(basePath + '/leaderboard_siswa/' + cleanKey, function(val) {
            prosesSimpanAman(val || cariExistingByNama());
        }, function() {
            prosesSimpanAman(cariExistingByNama());
        });
    } else {
        prosesSimpanAman(cariExistingByNama());
    }
};

window.simpanNotifikasiAdminKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/admin_notifikasi'), window.adminNotifikasiData || []).then(function() {
        window.selesaiOperasiTulisDB();
        if (typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function() {
        window.selesaiOperasiTulisDB();
    });
};

// MESIN ON-DEMAND LISTENER DATA BERAT (SISWA MENGGUNAKAN REST API 0 KONEKSI)
window._heavyListenersAttached = {
    bankUjian: false,
    adminBerat: false
};

window.pastikanListenerBankUjianAktif = function() {
    if (sessionStorage.getItem("statusLogin") === "admin") {
        if (window._heavyListenersAttached.bankUjian) return;
        window._heavyListenersAttached.bankUjian = true;
        window.bacaDataRestFirebase(basePath + '/admin_bank_ujian', function(val) {
            window.adminBankUjianData = val || {};
            if (typeof window.renderManajerUjian === "function" && document.getElementById('modal-manajer-ujian') && document.getElementById('modal-manajer-ujian').style.display === 'flex') {
                window.renderManajerUjian();
            }
        });
    } else {
        // Siswa menarik Bank Ujian & Ujian Aktif murni via REST API (0 Kuota Koneksi WebSocket!)
        window.tarikDataRinganBerkalaRest();
        window.bacaDataRestFirebase(basePath + '/admin_bank_ujian', function(val) {
            window.adminBankUjianData = val || {};
        });
    }
};

// Tarik Data Administrasi Berat khusus untuk Admin saat dibutuhkan
window.pastikanListenerAdminBeratAktif = function() {
    window.pastikanListenerBankUjianAktif();
    if (window._heavyListenersAttached.adminBerat) return;
    window._heavyListenersAttached.adminBerat = true;

    window.bacaDataRestFirebase(basePath + '/admin_absensi', function(val) {
        window.adminAbsensiData = val || {};
        if (typeof window.renderAbsensiAdmin === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
            window.renderAbsensiAdmin();
        }
    });

    window.bacaDataRestFirebase(basePath + '/admin_agenda', function(val) {
        window.adminAgendaData = val || {};
        if (typeof window.renderAgendaAdmin === "function" && document.getElementById('modal-administrasi') && document.getElementById('modal-administrasi').style.display === 'flex') {
            window.renderAgendaAdmin();
        }
    });

    // Khusus Rekap Nilai & Live Monitor pada sesi Admin menggunakan listener real-time (otomatis putus saat Admin idle 5 menit)
    if (sessionStorage.getItem("statusLogin") === "admin") {
        try { goOnline(db); } catch (e) {}
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
    }
};

if (sessionStorage.getItem("statusLogin") === "admin") {
    setTimeout(function() {
        window.pastikanListenerAdminBeratAktif();
    }, 2500);
}

document.addEventListener('click', function(e) {
    let t = e.target.closest('[onclick*="modal-enter-ujian"], [onclick*="bukaModalMasukUjianSiswa"]');
    if (t) window.pastikanListenerBankUjianAktif();

    let adm = e.target.closest('#admin-menu-bar span, [onclick*="modal-rekap-nilai"], [onclick*="modal-manajer-ujian"], [onclick*="bukaModalAdministrasi"], [onclick*="bukaModalPerkembanganSiswa"]');
    if (adm) {
        window.pastikanListenerAdminBeratAktif();
        if (typeof window.muatDataAfektifRest === "function") window.muatDataAfektifRest();
    }
}, true);

// Fungsi Kirim Status Siswa ke Live Monitor (Burst Mode: Kirim lalu Putus Koneksi)
window.simpanStatusLiveMonitorKeDB = function(paket, kelas, nama, payload) {
    if (!paket || !kelas || !nama) return;
    let safeNama = window.sanitasiKeyRekapFirebase(nama);
    let safePaket = window.sanitasiKeyRekapFirebase(paket);
    let safeKelas = window.sanitasiKeyRekapFirebase(kelas);

    let pathLM = basePath + '/admin_live_monitor/' + safePaket + '/' + safeKelas + '/' + safeNama;
    window.mulaiOperasiTulisDB();
    set(ref(db, pathLM), payload).then(function() {
        window.selesaiOperasiTulisDB(2000);
    }).catch(function(err) {
        window.selesaiOperasiTulisDB(2000);
        console.error("Gagal memperbarui Live Monitor:", err);
    });
};

window.hapusDataLiveMonitorDiDB = function(paket, kelas, nama) {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let targetPath = basePath + '/admin_live_monitor';
    
    if (paket && kelas && kelas !== "Semua" && nama) {
        targetPath += '/' + paket + '/' + kelas + '/' + nama;
    } else if (paket && kelas && kelas !== "Semua") {
        targetPath += '/' + paket + '/' + kelas;
    } else if (paket) {
        targetPath += '/' + paket;
    }
    
    window.mulaiOperasiTulisDB();
    remove(ref(db, targetPath)).then(function() {
        window.selesaiOperasiTulisDB();
        if(typeof window.showSaveToast === "function") window.showSaveToast();
    }).catch(function(err) {
        window.selesaiOperasiTulisDB();
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
        setTimeout(function() { st.innerHTML = "Cloud Sync: Ready"; }, 2000); 
    }
};

window.simpanAdminKeDB = function() { 
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Admin...</span>"; 
    
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/admin_data'), window.adminData).then(function() {
        window.selesaiOperasiTulisDB();
        window.showSaveToast();
    }).catch(function(error) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal menyimpan data admin:", error);
    });
};

window.simpanAbsensiKeDB = function() { 
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Absen...</span>"; 
    
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/admin_absensi'), window.adminAbsensiData).then(function() {
        window.selesaiOperasiTulisDB();
        window.showSaveToast();
    }).catch(function(error) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal menyimpan data absensi:", error);
    });
};

window.simpanAgendaKeDB = function() { 
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Agenda...</span>"; 
    
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/admin_agenda'), window.adminAgendaData).then(function() {
        window.selesaiOperasiTulisDB();
        window.showSaveToast();
    }).catch(function(error) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal menyimpan data agenda:", error);
    });
};

window.simpanBankUjianKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Bank Ujian...</span>"; 
    
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/admin_bank_ujian'), window.adminBankUjianData).then(function() {
        window.selesaiOperasiTulisDB();
        window.showSaveToast();
    }).catch(function(error) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal menyimpan bank ujian:", error);
    });
};

window.simpanBankLatihanKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Latihan...</span>"; 
    
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/admin_bank_latihan'), window.adminBankLatihanData).then(function() {
        window.selesaiOperasiTulisDB();
        try { localStorage.setItem(cacheLatihanKey, JSON.stringify(window.adminBankLatihanData)); } catch(e) {}
        window.showSaveToast();
    }).catch(function(error) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal menyimpan bank latihan:", error);
    });
};

window.simpanUjianAktifKeDB = function() {
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing Kontrol...</span>"; 
    
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/admin_ujian_aktif'), window.adminUjianAktifData).then(function() {
        window.selesaiOperasiTulisDB();
        window.showSaveToast();
    }).catch(function(error) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal menyimpan ujian aktif:", error);
    });
};

window.simpanNilaiUjianKeDB = function(pathInfo, payload) {
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/' + pathInfo), payload).then(function() {
        window.selesaiOperasiTulisDB(2500);
        console.log("Nilai ujian berhasil direkam secara permanen ke server.");
    }).catch(function(error) {
        window.selesaiOperasiTulisDB(2500);
        console.error("Gagal mengirim nilai ujian:", error);
    });
};

// KUNCI ISOLASI ROOM: Hanya menyimpan ke room yang sesuai dengan atribut DOM aktif
window.simpanKeDB = function(slugTujuan) { 
    if (sessionStorage.getItem("statusLogin") !== "admin") return;
    if (window.isLoadingRoom) return;

    let container = document.getElementById('blocks-container');
    let domRoom = container ? container.getAttribute('data-active-room') : '';
    let targetBab = slugTujuan || domRoom || window.babAktif;

    if (!targetBab) return;
    if (domRoom && domRoom !== targetBab) return;

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
    
    let payloadBlocks = window.contentBlocksData.map(function(block) {
        if (block.type === 'pdf_slides') {
            let safeBlock = Object.assign({}, block);
            safeBlock.slides = []; 
            return safeBlock;
        }
        return block;
    });
    
    if (targetBab === "home") {
        document.querySelectorAll('#home-left-sidebar .home-side-editable').forEach(function(el) {
            let idx = parseInt(el.getAttribute('data-side-index'), 10);
            if (window.homeLeftBlocksData && window.homeLeftBlocksData[idx]) {
                window.homeLeftBlocksData[idx].html = el.innerHTML;
            }
        });
        document.querySelectorAll('#home-right-sidebar .home-side-editable').forEach(function(el) {
            let idx = parseInt(el.getAttribute('data-side-index'), 10);
            if (window.homeRightBlocksData && window.homeRightBlocksData[idx]) {
                window.homeRightBlocksData[idx].html = el.innerHTML;
            }
        });
    }

    let payloadFloating = window.floatingBoxesData || [];
    let payloadLeft = (targetBab === "home") ? (window.homeLeftBlocksData || []) : [];
    let payloadRight = (targetBab === "home") ? (window.homeRightBlocksData || []) : [];

    try {
        sessionStorage.setItem('cache_room_' + (window.guruAktif || 'mahardika') + '_' + targetBab, JSON.stringify({
            blocksObj: payloadBlocks,
            floatingBoxesObj: payloadFloating,
            leftBlocksObj: payloadLeft,
            rightBlocksObj: payloadRight
        }));
    } catch (cacheError) {
        sessionStorage.clear();
    }

    let st = document.getElementById('save-status-bar');
    if(st) st.innerHTML = "<span style='color:#3498db;'>☁️ Syncing (" + targetBab + ")...</span>"; 
    
    window.mulaiOperasiTulisDB();
    set(ref(db, basePath + '/materi_koleksi/' + targetBab), {
        blocksObj: payloadBlocks, 
        floatingBoxesObj: payloadFloating,
        leftBlocksObj: payloadLeft,
        rightBlocksObj: payloadRight
    }).then(function() {
        let janjiSimpanSlides = [];
        window.contentBlocksData.forEach(function(block, index) {
            if (block.type === 'pdf_slides' && Array.isArray(block.slides)) {
                let pathSlides = basePath + '/materi_koleksi/' + targetBab + '/blocksObj/' + index + '/slides';
                janjiSimpanSlides.push(set(ref(db, pathSlides), block.slides));
            }
        });

        if (janjiSimpanSlides.length > 0) {
            Promise.all(janjiSimpanSlides).then(function() {
                window.selesaiOperasiTulisDB();
                if(typeof window.showSaveToast === "function") window.showSaveToast();
            }).catch(function(err) {
                window.selesaiOperasiTulisDB();
                console.error("Gagal sinkron array PDF:", err);
                if (st) st.innerHTML = "<span style='color:#e74c3c;'>⚠️ Sebagian PDF Gagal Sync</span>";
            });
        } else {
            window.selesaiOperasiTulisDB();
            if(typeof window.showSaveToast === "function") window.showSaveToast();
        }
    }).catch(function(err) {
        window.selesaiOperasiTulisDB();
        console.error("Gagal sinkron utama:", err);
        if (st) st.innerHTML = "<span style='color:#e74c3c;'>❌ Gagal Sync</span>";
    });
};

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

// Tarik & Simpan Data Check-in Afektif Siswa via REST API (Aman dari Timpa Data)
window.muatDataAfektifRest = function(onDone) {
    window.bacaDataRestFirebase(basePath + '/admin_afektif_siswa', function(val) {
        if (val) {
            window.adminAfektifData = Array.isArray(val) ? val : Object.values(val);
        } else {
            window.adminAfektifData = [];
        }
        let modalPS = document.getElementById('modal-perkembangan-siswa');
        if (modalPS && modalPS.style.display === 'flex' && typeof window.renderTabelAfektifAdmin === 'function') {
            window.renderTabelAfektifAdmin();
        }
        if (onDone) onDone(window.adminAfektifData);
    });
};

if (sessionStorage.getItem("statusLogin") === "admin") {
    window.muatDataAfektifRest();
}

window.simpanDataAfektifKeDB = function() {
    let lokalArr = Array.isArray(window.adminAfektifData) ? window.adminAfektifData.slice() : [];
    window.bacaDataRestFirebase(basePath + '/admin_afektif_siswa', function(serverVal) {
        let serverArr = serverVal ? (Array.isArray(serverVal) ? serverVal : Object.values(serverVal)) : [];
        let mapGabung = {};
        serverArr.forEach(function(item) {
            if (item && item.id) mapGabung[item.id] = item;
        });
        lokalArr.forEach(function(item) {
            if (item && item.id) mapGabung[item.id] = item;
        });
        window.adminAfektifData = Object.values(mapGabung);

        window.pastikanAuthFirebaseSiswaAktif(function() {
            set(ref(db, basePath + '/admin_afektif_siswa'), window.adminAfektifData).then(function() {
                window.selesaiOperasiTulisDB(2000);
                if (typeof window.showSaveToast === "function") window.showSaveToast();
            }).catch(function(err) {
                window.selesaiOperasiTulisDB(2000);
                console.error("Gagal menyimpan data afektif:", err);
            });
        });
    });
};