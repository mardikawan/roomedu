const CACHE_NAME = 'mahardika-pwa-v12';

// Daftar file inti aplikasi (menggunakan ./ agar cocok di GitHub Pages & Live Server)
const CORE_ASSETS = [
    './',
    './index.html',
    './style.css',
    './main.js',
    './modul-interaktif.js',
    './canvas-draw.js',
    './administrasi-guru.js',
    './bank-soal-manajer.js',
    './ujian-rekap-cbt.js',
    './ruang-latihan.js',
    './fitur-afektif-games.js',
    './my-pet-engine.js',
    './firebase-db.js'
];

// 1. Saat versi baru diinstal: simpan file kerangka lalu tunggu persetujuan tombol Perbarui
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return Promise.allSettled(
                CORE_ASSETS.map(function(url) {
                    return cache.add(url);
                })
            );
        })
    );
});

// Dengarkan perintah dari tombol "Perbarui Sekarang" di layar aplikasi
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 2. Saat versi baru aktif: bersihkan cache versi lama secara otomatis
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(
                keyList.map(function(key) {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// 3. Pengaturan Lalu Lintas Data (Bypass Firebase & Network-First untuk Kode Web)
self.addEventListener('fetch', function(event) {
    let req = event.request;
    let url = req.url || '';

    // Jangan pernah mengintervensi metode selain GET
    if (req.method !== 'GET') return;

    // WAJIB BYPASS: Jangan cache koneksi Firebase, Google Auth, Cloudinary, atau ekstensi browser
    if (
        url.indexOf('firebaseio.com') !== -1 ||
        url.indexOf('googleapis.com') !== -1 ||
        url.indexOf('firebasestorage.app') !== -1 ||
        url.indexOf('gstatic.com/firebasejs') !== -1 ||
        url.indexOf('cloudinary.com') !== -1 ||
        url.indexOf('chrome-extension') !== -1
    ) {
        return;
    }

    // Strategi Network-First: Utamakan ambil versi terbaru dari server, jika offline baru ambil dari cache HP
    event.respondWith(
        fetch(req).then(function(networkResponse) {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                let responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(req, responseClone);
                });
            }
            return networkResponse;
        }).catch(function() {
            return caches.match(req).then(function(cachedResponse) {
                if (cachedResponse) return cachedResponse;
                if (req.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});