/* =========================================================================
   MODUL FITUR CHECK-IN AFEKTIF, PERKEMBANGAN SISWA, MINI-GAMES,
   CONTENT BLOCK DINAMIS, & TOKO BINGKAI PROFIL (KARTU BERMOTIF + AVATAR)
   ========================================================================= */

window.adminAfektifData = window.adminAfektifData || [];
window.checkinState = {
    emosi: "",
    labelEmosi: "",
    ikon: "",
    jawaban1: "",
    jawaban2: ""
};

// =========================================================================
// 1. SIKLUS CHECK-IN DIRESET SETIAP 8 JAM & UI TOMBOL CHECK-IN
// =========================================================================
window.dapatkanKunciHariCheckin = function() {
    let now = new Date();
    let yyyy = now.getFullYear();
    let mm = String(now.getMonth() + 1).padStart(2, '0');
    let dd = String(now.getDate()).padStart(2, '0');
    let slot8Jam = Math.floor(now.getHours() / 8); // Berganti setiap 8 jam (00:00, 08:00, 16:00)
    return yyyy + '-' + mm + '-' + dd + '_S' + slot8Jam;
};

window.apakahSudahCheckinHariIni = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let uName = sessionStorage.getItem("username");
    if (stat !== "siswa" || !uName) return false;

    let keyHariIni = window.dapatkanKunciHariCheckin();
    let lb = (window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) ? window.leaderboardSiswaData[uName] : null;
    if (lb && lb.checkinTerakhir === keyHariIni) return true;

    let lokalKey = localStorage.getItem("checkin_done_" + (window.guruAktif || "mahardika") + "_" + uName);
    return lokalKey === keyHariIni;
};

window.perbaruiTombolCheckinUI = function() {
    let btn = document.getElementById("btn-header-checkin");
    if (!btn) return;

    btn.style.display = "flex";

    if (window.apakahSudahCheckinHariIni()) {
        btn.style.background = "#27ae60";
        btn.style.color = "#ffffff";
        btn.style.borderColor = "#2ecc71";
        btn.style.cursor = "not-allowed";
        btn.style.opacity = "0.95";
        btn.disabled = true;
        btn.onclick = null;
        btn.innerHTML = "✅ <span>Checked (+100 Coin)</span>";
    } else {
        btn.style.background = "#f1c40f";
        btn.style.color = "#0b3954";
        btn.style.borderColor = "#f39c12";
        btn.style.cursor = "pointer";
        btn.style.opacity = "1";
        btn.disabled = false;
        btn.onclick = function() { window.bukaModalCheckinSiswa(); };
        btn.innerHTML = "😊 <span>Check-in +100 Coin</span>";
    }
};

setInterval(function() {
    window.perbaruiTombolCheckinUI();
}, 30000);

// =========================================================================
// 2. MESIN PEMBACA VALIDASI JAWABAN SISWA (ANTI-ASAL KETIK & KONTEKSTUAL)
// =========================================================================

window.DAFTAR_JAWABAN_TERLARANG_CHECKIN = [
    "tidak tau", "tidaktau", "tidak tahu", "tidaktahu", "gak tau", "gaktau", "gak tahu", "gaktahu",
    "ga tau", "gatau", "ga tahu", "gatahu", "nggak tau", "nggak tahu", "ngga tau", "ngga tahu",
    "enggak tau", "enggak tahu", "enga tau", "tak tau", "taktau", "tak tahu", "ndak tau", "ndak tahu",
    "kurang tau", "kurang tahu", "entah", "entahlah", "ntah", "ntahlah", "mana saya tau", "mana saya tahu",
    "mana ku tau", "mana kutahu", "mana aku tau", "mana gua tau", "mana gw tau", "au ah", "tau ah",
    "tahu ah", "apa ya", "apaan ya", "bingung", "bingung mau nulis apa", "bingung ngetik apa",
    "gak ngerti", "ga ngerti", "tidak mengerti", "tidak paham", "kurang paham", "lupa", "udah lupa",
    "sudah lupa", "gak inget", "ga inget", "tidak ingat",
    "kepo deh", "kepo aja", "kepo banget", "kepo bgt", "kepo lu", "kepo kamu", "kepo amat",
    "jangan kepo", "kepo", "rahasia", "rahasia dong", "rahasia negara", "privasi", "urusan saya",
    "urusan pribadi", "bukan urusan", "mau tau aja", "mau tahu aja", "mau tau banget", "kasih tau gak ya",
    "ada deh", "adalah pokoknya", "pokoknya ada", "secret", "private",
    "ya oke aja", "oke aja", "ok aja", "oke deh", "ok deh", "okey deh", "okay deh", "iya deh",
    "iya aja", "yaudah", "ya udah", "yaudah deh", "yasudah", "ya sudah", "gitu deh", "gitu aja",
    "begitu saja", "begitu deh", "ya gitu", "ya gitu deh", "ya gitu aja", "gak deh", "ga deh",
    "nggak deh", "enggak deh", "biasa aja", "biasa saja", "b aja", "b saja", "standar aja",
    "normal aja", "aman aja", "sama aja", "sama saja", "seperti biasa", "kaya biasa", "kayak biasa",
    "kyk biasa", "nothing special", "lumayan aja", "lumayan deh", "gitu gitu aja", "begitu begitu saja",
    "ok ok aja", "fine fine aja", "aman terkendali",
    "tidak ada", "tidakada", "gak ada", "gakada", "ga ada", "gaada", "nggak ada", "ngga ada",
    "enggak ada", "tak ada", "tiada", "kosong", "zonk", "nihil", "nothing", "none", "no comment",
    "belum ada", "blm ada", "tidak ada apa apa", "gak ada apa apa", "ga ada apa apa", "tidak ada cerita",
    "gak ada cerita", "ga ada cerita",
    "malas ngetik", "males ngetik", "malas mengetik", "capek ngetik", "cape ngetik", "pegel ngetik",
    "biar dapat xp", "biar dapet xp", "demi xp", "cari xp", "buat xp", "ambil poin", "biar lewat",
    "biar panjang", "biar cukup", "biar lolos", "yang penting panjang", "yg penting panjang",
    "yang penting isi", "yg penting isi", "asal ketik", "asal ngetik", "isi asal", "ketik asal",
    "random aja", "test", "testing", "tes doang", "coba coba", "skip", "lanjut", "next", "pass",
    "bodo amat", "bodoh amat", "terserah", "serah deh", "serah lu", "whatever", "idk", "idc", "gaje",
    "gak jelas", "ga jelas", "tidak jelas", "apaan sih", "apa sih", "apasi", "wkwk", "wkwkwk",
    "hahaha", "hehehe", "hihihi", "awokawok", "bjir", "anjir", "anjay", "lorem ipsum",
    "qwerty", "asdfg", "zxcvb", "bla bla", "blah blah"
];

// Kamus Kata Kunci Refleksi & Konteks Kehidupan Siswa (Memastikan Kalimat Nyambung & Bermakna)
window.KAMUS_KATA_BERMAKNA_CHECKIN = [
    "saya", "aku", "kami", "kita", "hari", "ini", "kemarin", "tadi", "pagi", "siang", "malam", "karena", "sebab",
    "saat", "ketika", "waktu", "setelah", "sebelum", "belajar", "sekolah", "kelas", "guru", "teman", "sahabat",
    "keluarga", "orang", "tua", "ayah", "ibu", "mama", "papa", "kakak", "adik", "rumah", "tugas", "ulangan",
    "ujian", "nilai", "materi", "biologi", "fisika", "kimia", "matematika", "soal", "paham", "mengerti", "bisa",
    "berhasil", "selesai", "lulus", "tidur", "istirahat", "makan", "sehat", "sakit", "lelah", "capek", "mengantuk",
    "semangat", "senang", "bahagia", "gembira", "syukur", "bersyukur", "nikmat", "berdoa", "doa", "tuhan", "masih",
    "bernapas", "hidup", "senyum", "tersenyum", "membantu", "menolong", "berbagi", "cerita", "bicara", "ngobrol",
    "main", "bermain", "olahraga", "latihan", "musik", "buku", "baca", "menulis", "mencoba", "berusaha", "sabar",
    "tenang", "ikhlas", "memaafkan", "maaf", "emosi", "marah", "sedih", "kecewa", "kesal", "takut", "cemas",
    "khawatir", "fokus", "konsentrasi", "baik", "lebih", "positif", "pikiran", "hati", "perasaan", "suasana",
    "nyaman", "damai", "ceria", "ramah", "sopansantun", "sopan", "mendengarkan", "semoga", "besok", "depan",
    "target", "impian", "cita", "harapan", "usaha", "kerja", "keras", "kelompok", "diskusi", "praktikum", "hujan",
    "cuaca", "jalan", "pulang", "berangkat", "bangun", "tepat", "terlambat", "hadir", "nilai", "poin", "game"
];

window.POLA_KEYBOARD_ASAL_CHECKIN = [
    "qwer", "wert", "erty", "rtyu", "tyui", "yuio", "uiop",
    "asdf", "sdfg", "dfgh", "fghj", "ghjk", "hjkl",
    "zxcv", "xcvb", "cvbn", "vbnm", "abcd", "bcde", "cdef", "efgh", "ijkl", "mnop", "qrst", "uvwx"
];

window.normalisasiTeksCheckin = function(str) {
    let s = String(str || "").toLowerCase();
    s = s.replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e").replace(/4/g, "a")
         .replace(/5/g, "s").replace(/6/g, "g").replace(/7/g, "t").replace(/8/g, "b").replace(/9/g, "g")
         .replace(/@/g, "a").replace(/!/g, "i");
    let bersihSpasi = s.replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
    let leburHuruf = bersihSpasi.replace(/(.)\1+/g, function(m, c) { return c; });
    return {
        normal: bersihSpasi,
        lebur: leburHuruf
    };
};

// Deteksi apakah sebuah kata merupakan ketikan jari acak (gibberish) atau kata wajar bahasa Indonesia
window.apakahKataWajarIndonesia = function(kata) {
    if (!kata || kata.length < 2) return false;
    // Tolak jika mengandung deretan tombol keyboard bersebelahan
    for (let i = 0; i < window.POLA_KEYBOARD_ASAL_CHECKIN.length; i++) {
        if (kata.indexOf(window.POLA_KEYBOARD_ASAL_CHECKIN[i]) !== -1) return false;
    }
    // Tolak jika ada 4 konsonan berurutan tanpa vokal (kecuali 'nggr'/'nytr' yang sangat jarang, misal 'konstruksi' -> nstr)
    let bersihDigraf = kata.replace(/ng|ny|sy|kh|st|tr|pr|kr|br|dr|gr|fl|pl|kl|bl|gl/g, "k");
    if (/[bcdfghjklmnpqrstvwxyz]{3,}/.test(bersihDigraf)) return false;
    // Tolak jika ada 4 vokal berurutan
    if (/[aiueo]{4,}/.test(kata)) return false;

    if (kata.length >= 3) {
        let vokalCount = (kata.match(/[aiueo]/g) || []).length;
        let konsonanCount = (kata.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length;
        if (vokalCount === 0 || konsonanCount === 0) return false;
        let rasioVokal = vokalCount / kata.length;
        if (rasioVokal < 0.18 || rasioVokal > 0.78) return false;
    }
    // Tolak kata bersuku kata kembar berulang tidak bermakna seperti 'babibu', 'lalala', 'nanana', 'mamama'
    if (kata.length >= 6 && /^([bcdfghjklmnpqrstvwxyz][aiueo])\1{2,}$/.test(kata)) return false;
    return true;
};

window.validasiTeksCheckinSiswa = function(teks, wajibTopik) {
    let bersih = (teks || "").trim();

    if (wajibTopik && !window.checkinState.topikKonteks) {
        return {
            valid: false,
            skor: 15,
            pesan: "⚠️ Pilih minimal satu Topik Konteks di atas (misal: Pelajaran, Teman, Keluarga, atau Kesehatan) terlebih dahulu!"
        };
    }

    if (bersih.length < 30) {
        let kurang = 30 - bersih.length;
        return {
            valid: false,
            skor: Math.min(40, Math.round((bersih.length / 30) * 40)),
            pesan: "⚠️ Ceritamu masih terlalu singkat (kurang " + kurang + " karakter lagi). Yuk ceritakan alasan atau kejadiannya secara utuh!"
        };
    }

    let tanpaSpasi = bersih.toLowerCase().replace(/\s+/g, '');
    let hurufUnik = new Set(tanpaSpasi.split('')).size;
    if (hurufUnik < 7 || /(.)\1{2,}/i.test(bersih)) {
        return {
            valid: false,
            skor: 25,
            pesan: "⚠️ Hindari memanjangkan huruf secara berulang (seperti 'aaaa' atau 'kkkk'). Tulis kalimat yang wajar ya!"
        };
    }

    let norm = window.normalisasiTeksCheckin(bersih);
    let padNormal = " " + norm.normal + " ";
    let padLebur = " " + norm.lebur + " ";

    for (let i = 0; i < window.DAFTAR_JAWABAN_TERLARANG_CHECKIN.length; i++) {
        let frasa = window.DAFTAR_JAWABAN_TERLARANG_CHECKIN[i];
        let frasaLebur = frasa.replace(/(.)\1+/g, function(m, c) { return c; });
        if (padNormal.indexOf(" " + frasa + " ") !== -1 || padLebur.indexOf(" " + frasaLebur + " ") !== -1) {
            return {
                valid: false,
                skor: 20,
                pesan: "⚠️ Terdeteksi jawaban singkat/menghindar ('" + frasa + "'). Yuk ceritakan pengalaman nyatamu dengan jujur!"
            };
        }
    }

    let kataArr = norm.normal.split(/\s+/).filter(function(k) { return k.length >= 2; });
    if (kataArr.length < 6) {
        return {
            valid: false,
            skor: 45,
            pesan: "⚠️ Tuliskan minimal 6 kata yang membentuk kalimat cerita yang jelas (saat ini baru " + kataArr.length + " kata)."
        };
    }

    // Cek proporsi kata yang wajar menurut fonologi Bahasa Indonesia
    let kataTidakWajar = [];
    let jmlKataKamus = 0;
    kataArr.forEach(function(k) {
        if (!window.apakahKataWajarIndonesia(k)) {
            kataTidakWajar.push(k);
        }
        let kLebur = k.replace(/(.)\1+/g, function(m, c) { return c; });
        if (window.KAMUS_KATA_BERMAKNA_CHECKIN.indexOf(k) !== -1 || window.KAMUS_KATA_BERMAKNA_CHECKIN.indexOf(kLebur) !== -1) {
            jmlKataKamus++;
        } else if (/^(me|ber|ter|pe|di|ke|se)[a-z]{3,}(kan|i|an|nya)?/.test(k)) {
            jmlKataKamus++;
        }
    });

    if (kataTidakWajar.length > 0) {
        return {
            valid: false,
            skor: 30,
            pesan: "⚠️ Kata '" + kataTidakWajar[0] + "' tidak terbaca sebagai kata bahasa Indonesia yang jelas. Hindari mengetik huruf acak ya!"
        };
    }

    if (jmlKataKamus < 2) {
        return {
            valid: false,
            skor: 55,
            pesan: "⚠️ Kalimatmu belum menjelaskan konteks yang nyata. Gunakan kata hubung seperti 'karena', 'saat', 'hari ini', atau sebutkan aktivitasmu!"
        };
    }

    let kataLeburArr = norm.lebur.split(/\s+/).filter(function(k) { return k.length >= 2; });
    let kataUnikSet = new Set(kataLeburArr);
    let frekuensiKata = {};
    let maxUlangKata = 0;
    kataLeburArr.forEach(function(k) {
        frekuensiKata[k] = (frekuensiKata[k] || 0) + 1;
        if (frekuensiKata[k] > maxUlangKata) maxUlangKata = frekuensiKata[k];
    });

    if (kataUnikSet.size < 5 || (kataLeburArr.length >= 6 && (kataUnikSet.size / kataLeburArr.length) < 0.6) || maxUlangKata > 3) {
        return {
            valid: false,
            skor: 50,
            pesan: "⚠️ Jangan mengulang-ulang kata yang sama. Ceritakan alasan dan pengalamanmu secara bervariasi!"
        };
    }

    return { valid: true, skor: 100, pesan: "✅ Cerita refleksi sangat jelas, jujur, dan bermakna!" };
};

window.pantauKetikanCheckin = function(idTextarea, idInfo, wajibTopik) {
    let el = document.getElementById(idTextarea);
    let info = document.getElementById(idInfo);
    if (!el) return;

    let hasil = window.validasiTeksCheckinSiswa(el.value, wajibTopik);
    el.style.borderColor = hasil.valid ? "#27ae60" : (el.value.length > 5 ? "#f39c12" : "#cbd5e1");

    if (info) {
        info.style.display = "block";
        let barColor = hasil.valid ? "#27ae60" : (hasil.skor >= 45 ? "#f39c12" : "#e74c3c");
        info.innerHTML =
            '<div style="width:100%; height:6px; background:#e2e8f0; border-radius:4px; overflow:hidden; margin-bottom:5px;">' +
                '<div style="width:' + hasil.skor + '%; height:100%; background:' + barColor + '; transition:width 0.25s;"></div>' +
            '</div>' +
            '<div style="color:' + (hasil.valid ? "#16a34a" : "#64748b") + '; font-size:11px; font-weight:700;">' +
                (hasil.valid ? hasil.pesan : hasil.pesan.replace("⚠️ ", "💡 Panduan: ")) +
            '</div>';
    }
};

window.pilihTopikKonteksCheckin = function(namaTopik, btnEl) {
    window.checkinState.topikKonteks = namaTopik;
    document.querySelectorAll(".chip-topik-checkin").forEach(function(b) {
        b.style.background = "#f8fafc";
        b.style.color = "#475569";
        b.style.borderColor = "#cbd5e1";
    });
    if (btnEl) {
        btnEl.style.background = "#0b3954";
        btnEl.style.color = "#f1c40f";
        btnEl.style.borderColor = "#0b3954";
    }
    let inp1 = document.getElementById("checkin-input-1");
    if (inp1) {
        if (!inp1.value.trim()) {
            inp1.placeholder = "Ceritakan hal tentang " + namaTopik + " yang membuatmu merasa " + (window.checkinState.labelEmosi || "seperti ini") + " karena...";
        }
        window.pantauKetikanCheckin("checkin-input-1", "checkin-info-1", true);
        inp1.focus();
    }
};

// =========================================================================
// 3. ALUR MODAL CHECK-IN EMOSI SISWA (+100 COIN & +100 XP)
// =========================================================================
window.bukaModalCheckinSiswa = function() {
    if (window.apakahSudahCheckinHariIni()) return;

    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        alert("🔒 Silakan login menggunakan akun Siswa terlebih dahulu untuk melakukan Check-in (+100 Coin)!");
        if (typeof window.bukaModalLoginSistem === "function") window.bukaModalLoginSistem();
        return;
    }

    window.checkinState = { emosi: "", labelEmosi: "", ikon: "", topikKonteks: "", jawaban1: "", jawaban2: "" };
    window.renderStepPilihEmosiCheckin();
    window.bukaModal("modal-checkin-siswa");
};

window.renderStepPilihEmosiCheckin = function() {
    let body = document.getElementById("checkin-modal-body");
    if (!body) return;

    body.innerHTML =
        '<div style="text-align:center; padding:10px 5px;">' +
            '<div style="display:inline-block; background:#fef9e7; color:#d97706; border:1px solid #facc15; padding:3px 12px; border-radius:20px; font-size:11px; font-weight:800; margin-bottom:8px;">🪙 Hadiah Refleksi Jujur: +100 Coin & +100 XP</div>' +
            '<h3 style="margin:0 0 8px 0; color:#0b3954; font-size:20px;">Bagaimana kabarmu hari ini?</h3>' +
            '<p style="margin:0 0 20px 0; font-size:13px; color:#64748b;">Pilih satu emoji yang paling menggambarkan perasaanmu saat ini:</p>' +
            '<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">' +
                '<button type="button" onclick="window.pilihEmosiCheckin(\'bahagia\')" style="background:#fef9e7; border:2px solid #f1c40f; border-radius:14px; padding:18px 10px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:8px;">' +
                    '<span style="font-size:44px;">😊</span>' +
                    '<span style="font-weight:800; font-size:15px; color:#d35400;">Senang / Bahagia</span>' +
                '</button>' +
                '<button type="button" onclick="window.pilihEmosiCheckin(\'sedih\')" style="background:#ebf5fb; border:2px solid #3498db; border-radius:14px; padding:18px 10px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:8px;">' +
                    '<span style="font-size:44px;">😢</span>' +
                    '<span style="font-weight:800; font-size:15px; color:#2980b9;">Sedih</span>' +
                '</button>' +
                '<button type="button" onclick="window.pilihEmosiCheckin(\'marah\')" style="background:#fdedec; border:2px solid #e74c3c; border-radius:14px; padding:18px 10px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:8px;">' +
                    '<span style="font-size:44px;">😠</span>' +
                    '<span style="font-weight:800; font-size:15px; color:#c0392b;">Marah</span>' +
                '</button>' +
                '<button type="button" onclick="window.pilihEmosiCheckin(\'biasa\')" style="background:#f8fafc; border:2px solid #94a3b8; border-radius:14px; padding:18px 10px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:8px;">' +
                    '<span style="font-size:44px;">😐</span>' +
                    '<span style="font-weight:800; font-size:15px; color:#475569;">Netral / Biasa Saja</span>' +
                '</button>' +
            '</div>' +
        '</div>';
};

window.pilihEmosiCheckin = function(kodeEmosi) {
    let mapEmosi = {
        bahagia: {
            label: "Bahagia",
            ikon: "😊",
            warna: "#d35400",
            bg: "#fef9e7",
            q1: "Ceritakan apa yang membuatmu bahagia dan kamu syukuri hari ini (gunakan kata 'karena' atau 'saat'):",
            q2: "Wah, senang mendengarnya! Apa tindakan positif yang akan kamu lakukan hari ini untuk menyebarkan semangat tersebut?",
            pesanPenutup: "Tetap semangat ya, jangan lupa untuk tersenyum. Selamat belajar!"
        },
        sedih: {
            label: "Sedih",
            ikon: "😢",
            warna: "#2980b9",
            bg: "#ebf5fb",
            q1: "Ceritakan kejadian atau alasan apa yang sedang membuatmu merasa sedih hari ini:",
            q2: "Bagaimana caramu menenangkan diri dan menyikapi situasi tersebut agar kembali kuat?",
            pesanPenutup: "Bersedih adalah emosi yang nyata dan wajar. Yang penting jangan berlarut-larut dalam kesedihan ya. Banyak hal yang dapat kita syukuri, sesederhana masih bisa bernapas hari ini. Semangat!"
        },
        marah: {
            label: "Marah",
            ikon: "😠",
            warna: "#c0392b",
            bg: "#fdedec",
            q1: "Apakah sekarang perasaanmu sudah lebih tenang? Ceritakan hal apa yang memicu rasa kesal/marahmu:",
            q2: "Apa langkah yang kamu pilih untuk meredakan amarah tersebut dan memaafkan keadaan?",
            pesanPenutup: "Tidak apa untuk merasa marah. Tapi ingat, marah yang dipendam akan merugikan diri kita sendiri. Yuk tarik napas dalam-dalam dan fokus kembali pada hal yang membuatmu bahagia!"
        },
        biasa: {
            label: "Biasa Saja",
            ikon: "😐",
            warna: "#475569",
            bg: "#f8fafc",
            q1: "Ceritakan satu kegiatan atau hal baik yang paling kamu syukuri dari hari kemarin/hari ini:",
            q2: "",
            pesanPenutup: "Bersyukur adalah kunci menjaga hati tetap damai dan tenang. Mengingat hal-hal kecil yang baik akan membuat langkah belajarmu hari ini jauh lebih ringan!"
        }
    };

    let cfg = mapEmosi[kodeEmosi];
    if (!cfg) return;

    window.checkinState.emosi = kodeEmosi;
    window.checkinState.labelEmosi = cfg.label;
    window.checkinState.ikon = cfg.ikon;
    window.checkinState.topikKonteks = "";
    window.checkinState.cfg = cfg;

    let daftarTopik = [
        { label: "📚 Pelajaran & Tugas", val: "Pelajaran & Sekolah" },
        { label: "👥 Teman & Pergaulan", val: "Teman & Pergaulan" },
        { label: "🏠 Keluarga di Rumah", val: "Keluarga di Rumah" },
        { label: "💪 Kesehatan & Fisik", val: "Kesehatan & Istirahat" },
        { label: "🎯 Hobi & Kegiatan", val: "Hobi & Kegiatan" }
    ];

    let chipsHtml = daftarTopik.map(function(t) {
        return '<button type="button" class="chip-topik-checkin" onclick="window.pilihTopikKonteksCheckin(\'' + t.val + '\', this)" style="background:#f8fafc; color:#475569; border:1.5px solid #cbd5e1; border-radius:18px; padding:5px 11px; font-size:11px; font-weight:700; cursor:pointer; transition:0.15s;">' + t.label + '</button>';
    }).join("");

    let body = document.getElementById("checkin-modal-body");
    body.innerHTML =
        '<div style="text-align:left;">' +
            '<div style="display:flex; align-items:center; justify-content:space-between; background:' + cfg.bg + '; padding:10px 14px; border-radius:10px; margin-bottom:12px;">' +
                '<span style="font-weight:800; color:' + cfg.warna + '; font-size:15px;">' + cfg.ikon + ' Perasaan: ' + cfg.label + '</span>' +
                '<button type="button" onclick="window.renderStepPilihEmosiCheckin()" style="background:transparent; border:1px solid ' + cfg.warna + '; color:' + cfg.warna + '; border-radius:6px; padding:3px 8px; font-size:11px; font-weight:bold; cursor:pointer;">Ganti Emoji</button>' +
            '</div>' +
            '<label style="font-weight:800; font-size:12px; color:#475569; display:block; margin-bottom:6px;">1. Pilih Topik yang Berkaitan dengan Perasaanmu:</label>' +
            '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">' + chipsHtml + '</div>' +
            '<label style="font-weight:700; font-size:13px; color:#1e293b; display:block; margin-bottom:6px; line-height:1.4;">2. ' + cfg.q1 + '</label>' +
            '<textarea id="checkin-input-1" class="input-box" rows="4" placeholder="Pilih topik di atas lalu ketik ceritamu secara jujur dan jelas (minimal 6 kata bermakna)..." style="margin-bottom:6px; font-size:13px;" oninput="window.pantauKetikanCheckin(\'checkin-input-1\', \'checkin-info-1\', true)"></textarea>' +
            '<div id="checkin-info-1" style="margin-bottom:14px;"></div>' +
            '<button type="button" class="btn-action" style="background:#0b3954; width:100%; padding:11px; font-size:14px;" onclick="window.lanjutStepCheckinKedua()">Lanjutkan ➔</button>' +
        '</div>';
};

window.lanjutStepCheckinKedua = function() {
    let inp1 = document.getElementById("checkin-input-1");
    if (!inp1) return;

    let cek1 = window.validasiTeksCheckinSiswa(inp1.value, true);
    if (!cek1.valid) {
        alert(cek1.pesan);
        inp1.focus();
        return;
    }

    let prefixTopik = window.checkinState.topikKonteks ? ("[" + window.checkinState.topikKonteks + "] ") : "";
    window.checkinState.jawaban1 = prefixTopik + inp1.value.trim();
    let cfg = window.checkinState.cfg;

    if (!cfg.q2) {
        window.renderStepPenutupCheckin();
        return;
    }

    let body = document.getElementById("checkin-modal-body");
    body.innerHTML =
        '<div style="text-align:left;">' +
            '<div style="background:' + cfg.bg + '; padding:10px 14px; border-radius:10px; margin-bottom:14px; font-weight:800; color:' + cfg.warna + '; font-size:14px;">' +
                cfg.ikon + ' ' + cfg.label + ' — Langkah Terakhir' +
            '</div>' +
            '<label style="font-weight:700; font-size:14px; color:#1e293b; display:block; margin-bottom:8px; line-height:1.4;">' + cfg.q2 + '</label>' +
            '<textarea id="checkin-input-2" class="input-box" rows="4" placeholder="Tuliskan sikap atau rencana positifmu dengan kalimat yang jelas..." style="margin-bottom:6px; font-size:13px;" oninput="window.pantauKetikanCheckin(\'checkin-input-2\', \'checkin-info-2\', false)"></textarea>' +
            '<div id="checkin-info-2" style="margin-bottom:14px;"></div>' +
            '<button type="button" class="btn-action" style="background:#0b3954; width:100%; padding:11px; font-size:14px;" onclick="window.verifikasiStepKeduaCheckin()">Lanjutkan ➔</button>' +
        '</div>';
};

window.verifikasiStepKeduaCheckin = function() {
    let inp2 = document.getElementById("checkin-input-2");
    if (!inp2) return;

    let cek2 = window.validasiTeksCheckinSiswa(inp2.value, false);
    if (!cek2.valid) {
        alert(cek2.pesan);
        inp2.focus();
        return;
    }

    window.checkinState.jawaban2 = inp2.value.trim();
    window.renderStepPenutupCheckin();
};

window.renderStepPenutupCheckin = function() {
    let cfg = window.checkinState.cfg;
    let body = document.getElementById("checkin-modal-body");
    if (!body || !cfg) return;

    body.innerHTML =
        '<div style="text-align:center; padding:12px 6px;">' +
            '<div style="font-size:54px; margin-bottom:10px;">' + cfg.ikon + '</div>' +
            '<div style="background:' + cfg.bg + '; border-left:4px solid ' + cfg.warna + '; padding:16px; border-radius:10px; font-size:14px; color:#1e293b; line-height:1.6; font-weight:600; margin-bottom:20px; text-align:left;">' +
                cfg.pesanPenutup +
            '</div>' +
            '<button type="button" class="btn-action" style="background:#27ae60; width:100%; font-size:16px; padding:14px; border-radius:30px; font-weight:900; box-shadow:0 6px 15px rgba(39,174,96,0.35);" onclick="window.selesaikanCheckinHarian()">🔥 Klaim +100 Coin & Semangat Belajar!</button>' +
        '</div>';
};

window.selesaikanCheckinHarian = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let uName = sessionStorage.getItem("username") || "admin";
    let keyHariIni = window.dapatkanKunciHariCheckin();

    let namaLengkap = uName;
    let kelasSiswa = "Umum";

    if (window.akunSiswaData && window.akunSiswaData[uName]) {
        namaLengkap = window.akunSiswaData[uName].namaLengkap || uName;
        kelasSiswa = window.akunSiswaData[uName].kelas || "Umum";
    } else if (window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) {
        namaLengkap = window.leaderboardSiswaData[uName].namaLengkap || uName;
        kelasSiswa = window.leaderboardSiswaData[uName].kelas || "Umum";
    }

    let now = new Date();
    let waktuStr = String(now.getDate()).padStart(2, '0') + '/' +
                   String(now.getMonth() + 1).padStart(2, '0') + '/' +
                   now.getFullYear() + ' ' +
                   String(now.getHours()).padStart(2, '0') + ':' +
                   String(now.getMinutes()).padStart(2, '0');

    let recordAfektif = {
        id: "af_" + Date.now() + "_" + uName,
        username: uName,
        nama: namaLengkap,
        kelas: kelasSiswa,
        tanggalKey: keyHariIni.split('_')[0],
        waktu: waktuStr,
        timestamp: now.toISOString(),
        emosi: window.checkinState.labelEmosi,
        ikon: window.checkinState.ikon,
        jawaban1: window.checkinState.jawaban1,
        jawaban2: window.checkinState.jawaban2 || "-"
    };

    if (!Array.isArray(window.adminAfektifData)) window.adminAfektifData = [];
    window.adminAfektifData.push(recordAfektif);

    if (typeof window.simpanDataAfektifKeDB === "function") {
        window.simpanDataAfektifKeDB();
    }

    if (stat === "siswa") {
        localStorage.setItem("checkin_done_" + (window.guruAktif || "mahardika") + "_" + uName, keyHariIni);
        if (window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) {
            window.leaderboardSiswaData[uName].checkinTerakhir = keyHariIni;
        }
        if (typeof window.tambahXPSiswa === "function") {
            window.tambahXPSiswa(100, "checkin_harian");
        }
    }

    window.tutupModal("modal-checkin-siswa");
    window.perbaruiTombolCheckinUI();
    alert("🎉 Check-in Berhasil! Kamu mendapatkan +100 Coin dan +100 XP!");
};

// =========================================================================
// 4. DASBOR PERKEMBANGAN SISWA (KOGNITIF & AFEKTIF SINKRON REAL-TIME)
// =========================================================================
window.bukaModalPerkembanganSiswa = function() {
    window.bukaModal("modal-perkembangan-siswa");
    window.gantiTabPerkembanganSiswa("kognitif");
};

window.gantiTabPerkembanganSiswa = function(tab) {
    let btnKog = document.getElementById("btn-tab-perkembangan-kognitif");
    let btnAfe = document.getElementById("btn-tab-perkembangan-afektif");
    let viewKog = document.getElementById("view-perkembangan-kognitif");
    let viewAfe = document.getElementById("view-perkembangan-afektif");

    if (tab === "kognitif") {
        if (btnKog) { btnKog.style.background = "#0b3954"; btnKog.style.color = "white"; }
        if (btnAfe) { btnAfe.style.background = "#ffffff"; btnAfe.style.color = "#333"; }
        if (viewKog) viewKog.style.display = "flex";
        if (viewAfe) viewAfe.style.display = "none";
        window.muatFilterKognitifAdmin();
        window.renderTabelKognitifAdmin();
    } else {
        if (btnAfe) { btnAfe.style.background = "#27ae60"; btnAfe.style.color = "white"; }
        if (btnKog) { btnKog.style.background = "#ffffff"; btnKog.style.color = "#333"; }
        if (viewKog) viewKog.style.display = "none";
        if (viewAfe) viewAfe.style.display = "flex";
        window.muatFilterKelasAfektif();
        window.renderTabelAfektifAdmin();
    }
};

// --- MESIN ANALITIK PERKEMBANGAN KOGNITIF SISWA ---
window.muatFilterKognitifAdmin = function() {
    let selKls = document.getElementById("filter-kognitif-kelas");
    if (!selKls) return;
    let prevKls = selKls.value || "Semua";
    let kelasSet = new Set();

    Object.keys(window.adminData || {}).forEach(function(k) { kelasSet.add(k); });
    Object.keys(window.adminRekapNilaiData || {}).forEach(function(k) { kelasSet.add(k); });

    let htmlKls = '<option value="Semua">🏫 Semua Kelas</option>';
    Array.from(kelasSet).sort().forEach(function(k) {
        let sel = (k === prevKls) ? "selected" : "";
        htmlKls += '<option value="' + k + '" ' + sel + '>' + k + '</option>';
    });
    selKls.innerHTML = htmlKls;
    window.perbaruiDropdownUjianKognitif();
};

window.ubahFilterKelasKognitif = function() {
    window.perbaruiDropdownUjianKognitif();
    window.renderTabelKognitifAdmin();
};

window.perbaruiDropdownUjianKognitif = function() {
    let selKls = document.getElementById("filter-kognitif-kelas");
    let selUjian = document.getElementById("filter-kognitif-ujian");
    if (!selUjian) return;

    let filterKelas = selKls ? selKls.value : "Semua";
    let prevUjian = selUjian.value || "Semua";
    let ujianSet = new Set();

    let daftarKelas = filterKelas === "Semua"
        ? Object.keys(window.adminData || {}).concat(Object.keys(window.adminRekapNilaiData || {}))
        : [filterKelas];

    daftarKelas.forEach(function(kls) {
        if (typeof window.ambilKolomLedgerKelas === "function") {
            (window.ambilKolomLedgerKelas(kls) || []).forEach(function(u) { ujianSet.add(u); });
        }
        let objRekap = (typeof window.ambilObjekRekapKelas === "function") ? window.ambilObjekRekapKelas(kls) : ((window.adminRekapNilaiData && window.adminRekapNilaiData[kls]) || {});
        Object.keys(objRekap || {}).forEach(function(u) { ujianSet.add(u); });
    });

    let htmlUjian = '<option value="Semua">📚 Semua Evaluasi (Ledger NA)</option>';
    Array.from(ujianSet).forEach(function(u) {
        let sel = (u === prevUjian) ? "selected" : "";
        htmlUjian += '<option value="' + u + '" ' + sel + '>📝 ' + u + '</option>';
    });
    selUjian.innerHTML = htmlUjian;
};

// Kumpulkan profil kognitif lengkap satu siswa dari seluruh sumber nilai
window.hitungProfilKognitifSatuSiswa = function(kls, namaSiswa) {
    let kolomUjian = (typeof window.ambilKolomLedgerKelas === "function") ? window.ambilKolomLedgerKelas(kls) : [];
    let rekapKelas = (typeof window.ambilObjekRekapKelas === "function") ? window.ambilObjekRekapKelas(kls) : {};
    Object.keys(rekapKelas).forEach(function(pkt) {
        let safePkt = (typeof window.sanitasiKeyRekapFirebase === "function") ? window.sanitasiKeyRekapFirebase(pkt).toLowerCase() : pkt.toLowerCase();
        let sudah = kolomUjian.some(function(x) {
            let sx = (typeof window.sanitasiKeyRekapFirebase === "function") ? window.sanitasiKeyRekapFirebase(x).toLowerCase() : x.toLowerCase();
            return sx === safePkt;
        });
        if (!sudah) kolomUjian.push(pkt);
    });

    let riwayatUjian = [];
    let sumKuis = 0, cntKuis = 0;
    let sumPH = 0, cntPH = 0;
    let sumSAS = 0, cntSAS = 0;

    let tipeStatUjian = {
        PG: { benar: 0, total: 0 },
        PGK: { benar: 0, total: 0 },
        IS: { benar: 0, total: 0 },
        Essay: { benar: 0, total: 0 }
    };

    kolomUjian.forEach(function(namaPaket) {
        let objPaket = (typeof window.ambilObjekRekapPaket === "function") ? window.ambilObjekRekapPaket(kls, namaPaket) : (rekapKelas[namaPaket] || {});
        let rec = (typeof window.ambilDataSiswaDiObjekRekap === "function") ? window.ambilDataSiswaDiObjekRekap(objPaket, namaSiswa) : objPaket[namaSiswa];

        if (rec && rec.nilaiAkhir !== undefined) {
            let nilai = parseFloat(rec.nilaiAkhir);
            if (!isNaN(nilai)) {
                let kat = (typeof window.deteksiKategoriKolomLedger === "function") ? window.deteksiKategoriKolomLedger(namaPaket) : "PH";
                if (kat === "KUIS") { sumKuis += nilai; cntKuis++; }
                else if (kat === "SAS") { sumSAS += nilai; cntSAS++; }
                else { sumPH += nilai; cntPH++; }

                riwayatUjian.push({
                    paket: rec.paketAsli || namaPaket,
                    kategori: kat,
                    nilai: nilai,
                    waktu: rec.waktuKumpul || "-",
                    pelanggaran: Number(rec.pelanggaran) || 0
                });

                // Ekstrak akurasi per tipe soal jika ada detail jawaban ujian
                let detailArr = rec.detailJawaban || rec.rincianJawaban || [];
                if (Array.isArray(detailArr)) {
                    detailArr.forEach(function(dj) {
                        if (!dj) return;
                        let t = dj.type || dj.tipe || "PG";
                        if (t === "mc") t = "PG";
                        else if (t === "short_answer") t = "IS";
                        else if (t === "pgk") t = "PGK";
                        else if (t === "essay") t = "Essay";
                        if (!tipeStatUjian[t]) tipeStatUjian[t] = { benar: 0, total: 0 };
                        tipeStatUjian[t].total++;
                        if (dj.isCorrect || dj.benar || Number(dj.skor) > 0) {
                            tipeStatUjian[t].benar++;
                        }
                    });
                }
            }
        }
    });

    let hasilNA = (typeof window.hitungNilaiAkhirRumusLedger === "function")
        ? window.hitungNilaiAkhirRumusLedger(kls, namaSiswa, kolomUjian)
        : { adaNilai: riwayatUjian.length > 0, nilaiAkhir: riwayatUjian.length > 0 ? (riwayatUjian.reduce(function(a, b) { return a + b.nilai; }, 0) / riwayatUjian.length) : 0 };

    // Cari data latihan mandiri & XP dari Leaderboard
    let lbSiswa = null;
    let trimTarget = String(namaSiswa || "").trim().toLowerCase();
    Object.values(window.leaderboardSiswaData || {}).forEach(function(item) {
        if (item && (String(item.namaLengkap || "").trim().toLowerCase() === trimTarget) && item.kelas === kls) {
            lbSiswa = item;
        }
    });

    let statLatihan = (lbSiswa && lbSiswa.statSoal) ? lbSiswa.statSoal : { PG: 0, PGK: 0, IS: 0, Essay: 0 };
    let totalLatihan = (Number(statLatihan.PG) || 0) + (Number(statLatihan.PGK) || 0) + (Number(statLatihan.IS) || 0) + (Number(statLatihan.Essay) || 0);
    let xpSiswa = lbSiswa ? (Number(lbSiswa.xpTotal !== undefined ? lbSiswa.xpTotal : lbSiswa.xp) || 0) : 0;

    // Hitung tren kognitif (Ujian terakhir vs Ujian sebelumnya)
    let selisihTren = 0;
    let statusTren = "Stabil";
    if (riwayatUjian.length >= 2) {
        let terakhir = riwayatUjian[riwayatUjian.length - 1].nilai;
        let sebelumnya = riwayatUjian[riwayatUjian.length - 2].nilai;
        selisihTren = terakhir - sebelumnya;
        if (selisihTren >= 2.5) statusTren = "Naik";
        else if (selisihTren <= -2.5) statusTren = "Turun";
    }

    return {
        nama: namaSiswa,
        kelas: kls,
        riwayatUjian: riwayatUjian,
        jmlUjian: riwayatUjian.length,
        avgKuis: cntKuis > 0 ? (sumKuis / cntKuis) : null,
        avgPH: cntPH > 0 ? (sumPH / cntPH) : null,
        avgSAS: cntSAS > 0 ? (sumSAS / cntSAS) : null,
        adaNilai: hasilNA.adaNilai,
        nilaiAkhir: hasilNA.nilaiAkhir,
        selisihTren: selisihTren,
        statusTren: statusTren,
        tipeStatUjian: tipeStatUjian,
        statLatihan: statLatihan,
        totalLatihan: totalLatihan,
        xpSiswa: xpSiswa
    };
};

window.renderTabelKognitifAdmin = function() {
    let tbody = document.getElementById("body-tabel-kognitif-excel");
    let statBox = document.getElementById("rekap-statistik-kognitif");
    if (!tbody) return;

    let filterKelas = document.getElementById("filter-kognitif-kelas") ? document.getElementById("filter-kognitif-kelas").value : "Semua";
    let filterUjian = document.getElementById("filter-kognitif-ujian") ? document.getElementById("filter-kognitif-ujian").value : "Semua";
    let filterStatus = document.getElementById("filter-kognitif-status") ? document.getElementById("filter-kognitif-status").value : "Semua";
    let kataCari = document.getElementById("filter-kognitif-cari") ? document.getElementById("filter-kognitif-cari").value.trim().toLowerCase() : "";

    let semuaKelas = filterKelas === "Semua" ? Object.keys(window.adminData || {}).sort() : [filterKelas];
    let daftarProfil = [];

    semuaKelas.forEach(function(kls) {
        let siswaKelas = (window.adminData && window.adminData[kls]) ? window.adminData[kls].slice().sort() : [];
        // Tambahkan juga siswa yang ada di rekap nilai meskipun belum diinput ke daftar kelas
        let rekapKls = (typeof window.ambilObjekRekapKelas === "function") ? window.ambilObjekRekapKelas(kls) : {};
        Object.values(rekapKls || {}).forEach(function(paketMap) {
            Object.keys(paketMap || {}).forEach(function(nKey) {
                let rec = paketMap[nKey];
                let namaAsli = (rec && rec.namaAsli) ? rec.namaAsli : nKey;
                let sudahAda = siswaKelas.some(function(s) { return s.trim().toLowerCase() === namaAsli.trim().toLowerCase(); });
                if (!sudahAda) siswaKelas.push(namaAsli);
            });
        });

        siswaKelas.forEach(function(nama) {
            let p = window.hitungProfilKognitifSatuSiswa(kls, nama);
            let kkm = (typeof window.dapatkanKKMKelas === "function") ? window.dapatkanKKMKelas(kls) : 70;
            p.kkm = kkm;

            if (filterUjian !== "Semua") {
                let ujianCocok = p.riwayatUjian.find(function(u) { return u.paket === filterUjian; });
                p.skorTampil = ujianCocok ? ujianCocok.nilai : null;
                p.adaSkorTampil = Boolean(ujianCocok);
            } else {
                p.skorTampil = p.adaNilai ? p.nilaiAkhir : null;
                p.adaSkorTampil = p.adaNilai;
            }

            p.isTuntas = p.adaSkorTampil && (p.skorTampil >= kkm);
            daftarProfil.push(p);
        });
    });

    // Terapkan filter pencarian & status
    let terfilter = daftarProfil.filter(function(p) {
        if (kataCari && p.nama.toLowerCase().indexOf(kataCari) === -1) return false;
        if (filterStatus === "Tuntas" && (!p.adaSkorTampil || !p.isTuntas)) return false;
        if (filterStatus === "Remedial" && (!p.adaSkorTampil || p.isTuntas)) return false;
        if (filterStatus === "Naik" && p.statusTren !== "Naik") return false;
        if (filterStatus === "Turun" && p.statusTren !== "Turun") return false;
        return true;
    });

    // Hitung statistik agregat
    let jmlAdaNilai = 0, totalNilai = 0, jmlTuntas = 0, jmlRemedial = 0, jmlNaik = 0, jmlTurun = 0, totalSoalLatihanKelas = 0;
    terfilter.forEach(function(p) {
        totalSoalLatihanKelas += p.totalLatihan;
        if (p.adaSkorTampil) {
            jmlAdaNilai++;
            totalNilai += p.skorTampil;
            if (p.isTuntas) jmlTuntas++;
            else jmlRemedial++;
        }
        if (p.statusTren === "Naik") jmlNaik++;
        else if (p.statusTren === "Turun") jmlTurun++;
    });

    let rataKelas = jmlAdaNilai > 0 ? (totalNilai / jmlAdaNilai).toFixed(1) : "0.0";
    let pctTuntas = jmlAdaNilai > 0 ? Math.round((jmlTuntas / jmlAdaNilai) * 100) : 0;

    if (statBox) {
        statBox.innerHTML =
            '<div style="flex:1; min-width:170px; background:#eaf2f8; border:1px solid #3498db; border-radius:8px; padding:10px 14px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#2980b9;">📊 Rata-rata Capaian Kognitif</div>' +
                '<div style="font-size:22px; font-weight:900; color:#0b3954;">' + rataKelas + ' <span style="font-size:11px; font-weight:normal; color:#475569;">(' + jmlAdaNilai + ' Siswa Dinilai)</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:170px; background:#e8f8f5; border:1px solid #16a085; border-radius:8px; padding:10px 14px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#16a085;">✅ Ketuntasan KKM</div>' +
                '<div style="font-size:22px; font-weight:900; color:#0b3954;">' + pctTuntas + '% <span style="font-size:11px; font-weight:700; color:#16a085;">(' + jmlTuntas + ' Tuntas / ' + jmlRemedial + ' Remedial)</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:170px; background:#fef9e7; border:1px solid #f1c40f; border-radius:8px; padding:10px 14px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#d35400;">📈 Dinamika Tren Nilai</div>' +
                '<div style="font-size:18px; font-weight:900; color:#1e293b;">📈 ' + jmlNaik + ' Naik <span style="font-size:12px; color:#94a3b8;">|</span> <span style="color:#c0392b;">📉 ' + jmlTurun + ' Turun</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:170px; background:#f5eef8; border:1px solid #8e44ad; border-radius:8px; padding:10px 14px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#8e44ad;">🔥 Total Latihan Mandiri</div>' +
                '<div style="font-size:22px; font-weight:900; color:#1e293b;">' + totalSoalLatihanKelas.toLocaleString("id-ID") + ' <span style="font-size:11px; font-weight:normal; color:#64748b;">Soal Dikerjakan</span></div>' +
            '</div>';
    }

    if (terfilter.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:25px; color:#7f8c8d; font-weight:bold;">Belum ada data kognitif siswa untuk filter ini.</td></tr>';
        return;
    }

    let html = "";
    terfilter.forEach(function(p, idx) {
        let kompStr =
            '<span title="Rata-rata Kuis (40%)">K: <b>' + (p.avgKuis !== null ? p.avgKuis.toFixed(0) : '-') + '</b></span> • ' +
            '<span title="Rata-rata PH (30%)">PH: <b>' + (p.avgPH !== null ? p.avgPH.toFixed(0) : '-') + '</b></span> • ' +
            '<span title="Rata-rata SAS (30%)">SAS: <b>' + (p.avgSAS !== null ? p.avgSAS.toFixed(0) : '-') + '</b></span>';

        let skorHtml = p.adaSkorTampil
            ? '<div style="font-size:16px; font-weight:900; color:' + (p.isTuntas ? '#16a085' : '#c0392b') + ';">' + p.skorTampil.toFixed(1) + '</div>' +
              '<span style="font-size:10px; font-weight:800; padding:1px 6px; border-radius:8px; background:' + (p.isTuntas ? '#d1fae5' : '#fee2e2') + '; color:' + (p.isTuntas ? '#065f46' : '#991b1b') + ';">' + (p.isTuntas ? 'Tuntas (≥' + p.kkm + ')' : 'Remedial (<' + p.kkm + ')') + '</span>'
            : '<span style="color:#94a3b8; font-weight:bold;">Belum Ujian</span>';

        let trenHtml = '<span style="color:#64748b; font-size:11px; font-weight:bold;">➖ Stabil</span>';
        if (p.jmlUjian < 2) {
            trenHtml = '<span style="color:#94a3b8; font-size:11px;">Data Baru (' + p.jmlUjian + 'x)</span>';
        } else if (p.statusTren === "Naik") {
            trenHtml = '<span style="background:#dcfce7; color:#15803d; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:800;">📈 +' + p.selisihTren.toFixed(1) + '</span>';
        } else if (p.statusTren === "Turun") {
            trenHtml = '<span style="background:#fee2e2; color:#b91c1c; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:800;">📉 ' + p.selisihTren.toFixed(1) + '</span>';
        }

        let rincianLatihan =
            '<div style="font-size:11px; font-weight:700; color:#1e293b;">PG:' + (p.statLatihan.PG || 0) + ' | PGK:' + (p.statLatihan.PGK || 0) + ' | IS:' + (p.statLatihan.IS || 0) + ' | ES:' + (p.statLatihan.Essay || 0) + '</div>' +
            '<div style="font-size:10px; color:#0b3954; font-weight:800; margin-top:2px;">⚡ Total: ' + p.totalLatihan + ' Soal (' + p.xpSiswa.toLocaleString("id-ID") + ' XP)</div>';

        // Rekomendasi Pedagogis Otomatis berdasarkan Skor & Tren
        let levelKog = "Belum Terukur";
        let rekomTeks = "Arahkan siswa mengikuti ujian/latihan mandiri untuk memetakan kemampuan awal.";
        let badgeLevelBg = "#f1f5f9", badgeLevelCol = "#475569";

        if (p.adaSkorTampil) {
            if (p.skorTampil >= 88) {
                levelKog = "🌟 Sangat Mahir (C4–C6 HOTS)";
                badgeLevelBg = "#dcfce7"; badgeLevelCol = "#15803d";
                rekomTeks = "Penguasaan konsep sangat kuat. Berikan tantangan soal tingkat HOTS / Olimpiade atau jadikan tutor sebaya.";
            } else if (p.isTuntas) {
                levelKog = "✅ Mahir (C3 Aplikasi)";
                badgeLevelBg = "#dbeafe"; badgeLevelCol = "#1d4ed8";
                rekomTeks = p.statusTren === "Turun"
                    ? "Nilai sudah tuntas KKM namun tren menurun. Perlu penguatan konsistensi pada soal analisis (PGK/Essay)."
                    : "Capaian kognitif stabil di atas KKM. Pertahankan latihan rutin menuju level analisis HOTS.";
            } else if (p.skorTampil >= p.kkm - 12) {
                levelKog = "⚠️ Cukup (C2 Pemahaman Dasar)";
                badgeLevelBg = "#fef3c7"; badgeLevelCol = "#b45309";
                rekomTeks = "Hampir mencapai KKM. Berikan remedial terfokus pada materi yang salah dan latihan mandiri tingkat C2.";
            } else {
                levelKog = "🆘 Perlu Bimbingan Khusus (C1)";
                badgeLevelBg = "#fee2e2"; badgeLevelCol = "#b91c1c";
                rekomTeks = "Perlu pendampingan konsep dasar (C1–C2) secara bertahap dan wajib menuntaskan program Remedial.";
            }
        }

        let safeKls = p.kelas.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        let safeNama = p.nama.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

        html +=
            '<tr>' +
                '<td style="text-align:center; font-weight:bold; color:#7f8c8d;">' + (idx + 1) + '</td>' +
                '<td style="font-weight:800; color:#1e293b;">' + p.nama + '</td>' +
                '<td style="text-align:center;"><span style="background:#eaf2f8; color:#2980b9; padding:2px 8px; border-radius:4px; font-weight:bold; font-size:11px;">' + p.kelas + '</span></td>' +
                '<td style="text-align:center; font-weight:800; color:#334155;">' + p.jmlUjian + 'x</td>' +
                '<td style="text-align:center; font-size:11px; color:#475569; white-space:nowrap;">' + kompStr + '</td>' +
                '<td style="text-align:center;">' + skorHtml + '</td>' +
                '<td style="text-align:center; white-space:nowrap;">' + trenHtml + '</td>' +
                '<td style="text-align:center; white-space:nowrap;">' + rincianLatihan + '</td>' +
                '<td style="min-width:250px;">' +
                    '<span style="display:inline-block; background:' + badgeLevelBg + '; color:' + badgeLevelCol + '; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:800; margin-bottom:4px;">' + levelKog + '</span>' +
                    '<div style="font-size:11px; color:#475569; line-height:1.35;">' + rekomTeks + '</div>' +
                '</td>' +
                '<td style="text-align:center;">' +
                    '<button type="button" class="btn-action" style="background:#0b3954; width:auto; padding:5px 10px; font-size:11px;" onclick="window.bukaDetailRiwayatKognitifSiswa(\'' + safeKls + '\', \'' + safeNama + '\')">🔍 Detail</button>' +
                '</td>' +
            '</tr>';
    });

    tbody.innerHTML = html;
};

window.bukaDetailRiwayatKognitifSiswa = function(kls, nama) {
    let p = window.hitungProfilKognitifSatuSiswa(kls, nama);
    if (!p.riwayatUjian || p.riwayatUjian.length === 0) {
        return alert("📋 Siswa " + nama + " (" + kls + ") belum memiliki riwayat nilai ujian yang tercatat.");
    }

    let teks = "📈 RIWAYAT PERKEMBANGAN KOGNITIF SISWA\n" +
               "Nama : " + nama + "\n" +
               "Kelas : " + kls + "\n" +
               "Nilai Akhir (NA Ledger) : " + p.nilaiAkhir.toFixed(1) + "\n" +
               "----------------------------------------\n";

    p.riwayatUjian.forEach(function(r, i) {
        teks += (i + 1) + ". [" + r.kategori + "] " + r.paket + " ➔ Nilai: " + r.nilai.toFixed(1) + (r.pelanggaran > 0 ? " (⚠️ " + r.pelanggaran + "x Pelanggaran)" : "") + "\n";
    });

    teks += "----------------------------------------\n" +
            "Akumulasi Soal Latihan Mandiri: " + p.totalLatihan + " Soal (" + p.xpSiswa.toLocaleString("id-ID") + " XP)";
    alert(teks);
};

window.exportExcelKognitifSiswa = function() {
    let table = document.getElementById("tabel-kognitif-excel");
    if (!table) return;

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Calibri,sans-serif;font-size:12px;}th,td{border:1px solid #000;padding:6px;vertical-align:top;}th{background:#0b3954;color:#fff;font-weight:bold;}</style></head>' +
        '<body><h3>Laporan Analisis Perkembangan Kognitif Siswa</h3>' + table.outerHTML + '</body></html>';

    let blob = new Blob([html], { type: "application/vnd.ms-excel" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Analisis_Kognitif_Siswa.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.muatFilterKelasAfektif = function() {
    let sel = document.getElementById("filter-afektif-kelas");
    if (!sel) return;
    let prev = sel.value || "Semua";
    let kelasSet = new Set();

    Object.keys(window.adminData || {}).forEach(function(k) { kelasSet.add(k); });
    (window.adminAfektifData || []).forEach(function(item) {
        if (item && item.kelas) kelasSet.add(item.kelas);
    });

    let html = '<option value="Semua">🏫 Semua Kelas</option>';
    Array.from(kelasSet).sort().forEach(function(k) {
        let selected = (k === prev) ? "selected" : "";
        html += '<option value="' + k + '" ' + selected + '>' + k + '</option>';
    });
    sel.innerHTML = html;
};

window.renderTabelAfektifAdmin = function() {
    let tbody = document.getElementById("body-tabel-afektif-excel");
    let statBox = document.getElementById("rekap-statistik-afektif");
    if (!tbody) return;

    let filterKelas = document.getElementById("filter-afektif-kelas") ? document.getElementById("filter-afektif-kelas").value : "Semua";
    let filterEmosi = document.getElementById("filter-afektif-emosi") ? document.getElementById("filter-afektif-emosi").value : "Semua";
    let filterTgl = document.getElementById("filter-afektif-tanggal") ? document.getElementById("filter-afektif-tanggal").value : "";

    let list = Array.isArray(window.adminAfektifData) ? window.adminAfektifData.slice() : [];

    let filtered = list.filter(function(item) {
        if (!item) return false;
        if (filterKelas !== "Semua" && item.kelas !== filterKelas) return false;
        if (filterEmosi !== "Semua" && item.emosi !== filterEmosi) return false;
        let tglSaja = (item.tanggalKey || "").split('_')[0];
        if (filterTgl && tglSaja !== filterTgl) return false;
        return true;
    });

    filtered.sort(function(a, b) {
        return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
    });

    let count = { "Bahagia": 0, "Sedih": 0, "Marah": 0, "Biasa Saja": 0 };
    filtered.forEach(function(item) {
        if (count[item.emosi] !== undefined) count[item.emosi]++;
    });
    let total = filtered.length || 1;

    if (statBox) {
        statBox.innerHTML =
            '<div style="flex:1; min-width:130px; background:#fef9e7; border:1px solid #f1c40f; border-radius:8px; padding:10px 12px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#d35400;">😊 Bahagia / Senang</div>' +
                '<div style="font-size:20px; font-weight:900; color:#1e293b;">' + count["Bahagia"] + ' <span style="font-size:11px; font-weight:normal; color:#64748b;">(' + Math.round((count["Bahagia"] / total) * 100) + '%)</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:130px; background:#ebf5fb; border:1px solid #3498db; border-radius:8px; padding:10px 12px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#2980b9;">😢 Sedih</div>' +
                '<div style="font-size:20px; font-weight:900; color:#1e293b;">' + count["Sedih"] + ' <span style="font-size:11px; font-weight:normal; color:#64748b;">(' + Math.round((count["Sedih"] / total) * 100) + '%)</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:130px; background:#fdedec; border:1px solid #e74c3c; border-radius:8px; padding:10px 12px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#c0392b;">😠 Marah</div>' +
                '<div style="font-size:20px; font-weight:900; color:#1e293b;">' + count["Marah"] + ' <span style="font-size:11px; font-weight:normal; color:#64748b;">(' + Math.round((count["Marah"] / total) * 100) + '%)</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:130px; background:#f8fafc; border:1px solid #94a3b8; border-radius:8px; padding:10px 12px;">' +
                '<div style="font-size:11px; font-weight:bold; color:#475569;">😐 Biasa Saja</div>' +
                '<div style="font-size:20px; font-weight:900; color:#1e293b;">' + count["Biasa Saja"] + ' <span style="font-size:11px; font-weight:normal; color:#64748b;">(' + Math.round((count["Biasa Saja"] / total) * 100) + '%)</span></div>' +
            '</div>';
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:25px; color:#7f8c8d; font-weight:bold;">Belum ada data rekaman Check-in Afektif siswa untuk filter ini.</td></tr>';
        return;
    }

    let html = "";
    filtered.forEach(function(item, idx) {
        let badgeBg = item.emosi === "Bahagia" ? "#fef9e7" : (item.emosi === "Sedih" ? "#ebf5fb" : (item.emosi === "Marah" ? "#fdedec" : "#f1f5f9"));
        let badgeCol = item.emosi === "Bahagia" ? "#d35400" : (item.emosi === "Sedih" ? "#2980b9" : (item.emosi === "Marah" ? "#c0392b" : "#475569"));

        html +=
            '<tr>' +
                '<td style="text-align:center; font-weight:bold; color:#7f8c8d;">' + (idx + 1) + '</td>' +
                '<td style="white-space:nowrap; font-size:12px;">' + (item.waktu || item.tanggalKey || "-") + '</td>' +
                '<td style="font-weight:bold; color:#2c3e50;">' + (item.nama || "-") + '</td>' +
                '<td style="text-align:center;"><span style="background:#eaf2f8; color:#2980b9; padding:2px 8px; border-radius:4px; font-weight:bold; font-size:11px;">' + (item.kelas || "-") + '</span></td>' +
                '<td style="text-align:center;"><span style="background:' + badgeBg + '; color:' + badgeCol + '; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:12px; white-space:nowrap;">' + (item.ikon || "") + ' ' + (item.emosi || "-") + '</span></td>' +
                '<td style="min-width:240px; line-height:1.4;">' + (item.jawaban1 || "-") + '</td>' +
                '<td style="min-width:240px; line-height:1.4;">' + (item.jawaban2 || "-") + '</td>' +
            '</tr>';
    });

    tbody.innerHTML = html;
};

window.exportExcelAfektifSiswa = function() {
    let table = document.getElementById("tabel-afektif-excel");
    if (!table) return;

    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Calibri,sans-serif;font-size:12px;}th,td{border:1px solid #000;padding:6px;vertical-align:top;}th{background:#2c3e50;color:#fff;font-weight:bold;}</style></head>' +
        '<body><h3>Rekap Perkembangan Afektif & Check-In Harian Siswa</h3>' + table.outerHTML + '</body></html>';

    let blob = new Blob([html], { type: "application/vnd.ms-excel" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Rekap_Afektif_Siswa.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// =========================================================================
// 5. UPGRADE MINI-GAMES (ROTASI 6 GAMES)
// =========================================================================
window.bukaMiniGameLatihan = function(onCloseCallback) {
    if (!window.sesiLatihanSiswa || window.sesiLatihanSiswa.disableMiniGames) {
        if (onCloseCallback) onCloseCallback();
        return;
    }

    window.bersihkanTimerMiniGame();
    window.minigameOnCloseCallback = onCloseCallback || null;
    window.minigameRewardClaimed = false;

    window.sesiLatihanSiswa.minigameAppearCount = (window.sesiLatihanSiswa.minigameAppearCount || 0) + 1;
    let appearCount = window.sesiLatihanSiswa.minigameAppearCount;

    let btnOptOut = document.getElementById('btn-fokus-tanpa-game');
    if (btnOptOut) {
        if (appearCount === 1 || appearCount % 5 === 0) {
            btnOptOut.style.display = 'inline-block';
        } else {
            btnOptOut.style.display = 'none';
        }
    }

    let totalGames = 6;
    let gameIndex = window.minigameRotationIdx % totalGames;
    let badgeUrutan = document.getElementById('minigame-badge-urutan');
    if (badgeUrutan) {
        badgeUrutan.innerText = '🎮 Istirahat Sejenak • Game ' + (gameIndex + 1) + ' dari ' + totalGames;
    }

    let modal = document.getElementById('modal-minigame-latihan');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '1000050';
    }

    window.minigameRotationIdx = (gameIndex + 1) % totalGames;
    sessionStorage.setItem('mg_rot_idx', String(window.minigameRotationIdx));

    if (gameIndex === 0) window.mulaiGame1MemoryMatch();
    else if (gameIndex === 1) window.mulaiGame2WhackVirus();
    else if (gameIndex === 2) window.mulaiGame3SimonSays();
    else if (gameIndex === 3) window.mulaiGame4BioAnagram();
    else if (gameIndex === 4) window.mulaiGame5TapGoodCells();
    else window.mulaiGame6SpotDiff();
};

window.buatPolaSimonBeragam = function(panjangKetukan) {
    let poolWajib = [0, 1, 2, 3, 0, 1, 2, 3];
    while (poolWajib.length < panjangKetukan) {
        poolWajib.push(Math.floor(Math.random() * 4));
    }
    for (let i = poolWajib.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = poolWajib[i];
        poolWajib[i] = poolWajib[j];
        poolWajib[j] = temp;
    }
    for (let k = 2; k < poolWajib.length; k++) {
        if (poolWajib[k] === poolWajib[k - 1] && poolWajib[k] === poolWajib[k - 2]) {
            poolWajib[k] = (poolWajib[k] + 1 + Math.floor(Math.random() * 3)) % 4;
        }
    }
    return poolWajib;
};

window.mulaiGame3SimonSays = function() {
    let targetKetukan = 8 + Math.floor(Math.random() * 3);
    document.getElementById('minigame-title').innerText = '⚡ 3. Simon Says: Pola ' + targetKetukan + ' Ketukan';
    document.getElementById('minigame-subtitle').innerText = 'Ingat urutan ' + targetKetukan + ' ketukan dari 4 warna tombol di bawah, lalu tirukan!';
    document.getElementById('minigame-score-val').innerText = '0/' + targetKetukan;

    let stage = document.getElementById('minigame-stage-body');
    stage.innerHTML =
        '<div id="mg-simon-status" style="font-size:13px; font-weight:800; color:#0b3954; margin-bottom:8px; text-align:center;">👀 Perhatikan pola ' + targetKetukan + ' ketukan warna...</div>' +
        '<div id="mg-simon-dots" style="display:flex; gap:5px; margin-bottom:14px; justify-content:center; flex-wrap:wrap;"></div>' +
        '<div class="mg-simon-grid">' +
            '<div class="mg-simon-pad" id="mg-pad-0" style="background:#e74c3c;" onclick="window.klikPadSimon(0)">🔴</div>' +
            '<div class="mg-simon-pad" id="mg-pad-1" style="background:#2ecc71;" onclick="window.klikPadSimon(1)">🟢</div>' +
            '<div class="mg-simon-pad" id="mg-pad-2" style="background:#3498db;" onclick="window.klikPadSimon(2)">🔵</div>' +
            '<div class="mg-simon-pad" id="mg-pad-3" style="background:#f1c40f;" onclick="window.klikPadSimon(3)">🟡</div>' +
        '</div>' +
        '<button type="button" id="btn-ulang-pola-simon" class="minigame-skip-btn" style="margin-top:14px; display:none;" onclick="window.putarUlangPolaSimon()">🔄 Putar Ulang Pola</button>';

    window.mgSimonState = {
        sequence: window.buatPolaSimonBeragam(targetKetukan),
        targetLen: targetKetukan,
        userStep: 0,
        acceptingInput: false
    };

    window.renderIndikatorTitikSimon();
    window.jalankanTimerMiniGame(50, function() {
        window.selesaikanMiniGameDenganHadiah('Waktu selesai! Latihan memori pola yang bagus!');
    });
    window.mulaiRondeSimonSays();
};

window.renderIndikatorTitikSimon = function() {
    let st = window.mgSimonState;
    let dotsEl = document.getElementById('mg-simon-dots');
    if (!st || !dotsEl) return;

    let html = '';
    for (let i = 0; i < st.targetLen; i++) {
        let done = i < st.userStep;
        let bg = done ? '#27ae60' : '#cbd5e1';
        html += '<span style="width:12px; height:12px; border-radius:50%; background:' + bg + '; display:inline-block; transition:0.2s;"></span>';
    }
    dotsEl.innerHTML = html;
};

window.nyalakanPadSimon = function(padIdx) {
    let pad = document.getElementById('mg-pad-' + padIdx);
    if (!pad) return;
    pad.classList.add('lit');
    let t = setTimeout(function() {
        pad.classList.remove('lit');
    }, 300);
    window.minigameActiveTimers.push(t);
};

window.putarUlangPolaSimon = function() {
    if (!window.mgSimonState || !window.mgSimonState.acceptingInput) return;
    window.mulaiRondeSimonSays();
};

window.mulaiRondeSimonSays = function() {
    let st = window.mgSimonState;
    if (!st) return;
    st.acceptingInput = false;
    st.userStep = 0;
    window.renderIndikatorTitikSimon();
    document.getElementById('minigame-score-val').innerText = '0/' + st.targetLen;

    let btnReplay = document.getElementById('btn-ulang-pola-simon');
    if (btnReplay) btnReplay.style.display = 'none';

    let statusEl = document.getElementById('mg-simon-status');
    if (statusEl) statusEl.innerText = '👀 Perhatikan urutan ' + st.targetLen + ' ketukan...';

    st.sequence.forEach(function(padIdx, i) {
        let t = setTimeout(function() {
            if (statusEl) statusEl.innerText = '👀 Ketukan ke-' + (i + 1) + ' dari ' + st.targetLen + '...';
            window.nyalakanPadSimon(padIdx);
            if (i === st.sequence.length - 1) {
                let t2 = setTimeout(function() {
                    st.acceptingInput = true;
                    if (statusEl) statusEl.innerText = '👆 Giliranmu! Tekan ' + st.targetLen + ' urutan warna tadi!';
                    if (btnReplay) btnReplay.style.display = 'inline-block';
                }, 420);
                window.minigameActiveTimers.push(t2);
            }
        }, (i + 1) * 520);
        window.minigameActiveTimers.push(t);
    });
};

window.klikPadSimon = function(padIdx) {
    let st = window.mgSimonState;
    if (!st || !st.acceptingInput) return;

    window.nyalakanPadSimon(padIdx);

    if (padIdx === st.sequence[st.userStep]) {
        st.userStep++;
        window.renderIndikatorTitikSimon();
        document.getElementById('minigame-score-val').innerText = st.userStep + '/' + st.targetLen;

        if (st.userStep >= st.sequence.length) {
            st.acceptingInput = false;
            let t = setTimeout(function() {
                window.selesaikanMiniGameDenganHadiah('Luar Biasa! Kamu berhasil mengingat seluruh ' + st.targetLen + ' ketukan warna dengan tepat!');
            }, 300);
            window.minigameActiveTimers.push(t);
        }
    } else {
        st.acceptingInput = false;
        let statusEl = document.getElementById('mg-simon-status');
        if (statusEl) statusEl.innerText = '❌ Urutan salah di ketukan ke-' + (st.userStep + 1) + '! Perhatikan ulang polanya...';
        let t = setTimeout(function() {
            window.mulaiRondeSimonSays();
        }, 1000);
        window.minigameActiveTimers.push(t);
    }
};

window.mulaiGame4BioAnagram = function() {
    document.getElementById('minigame-title').innerText = '🔤 4. Susun Kata: Pengetahuan Umum';
    document.getElementById('minigame-subtitle').innerText = 'Susun huruf acak di bawah untuk menjawab pertanyaan pengetahuan umum!';
    document.getElementById('minigame-score-val').innerText = '1 Kata';

    const daftarKataUmum = [
        { kata: 'KAPUAS', hint: 'Apa nama sungai terpanjang di Indonesia yang terletak di Kalimantan Barat?' },
        { kata: 'TOBA', hint: 'Apa nama danau vulkanik terbesar di Indonesia yang berada di Sumatera Utara?' },
        { kata: 'KERINCI', hint: 'Apa nama gunung berapi tertinggi di Indonesia yang terletak di Sumatera?' },
        { kata: 'SOEKARNO', hint: 'Siapa nama tokoh proklamator sekaligus Presiden pertama Republik Indonesia?' },
        { kata: 'BOROBUDUR', hint: 'Apa nama candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah?' },
        { kata: 'ANGKLUNG', hint: 'Apa nama alat musik tradisional dari Jawa Barat yang terbuat dari bambu?' },
        { kata: 'GARUDA', hint: 'Apa nama burung yang menjadi lambang negara Indonesia?' },
        { kata: 'PASIFIK', hint: 'Apa nama samudra terluas dan terdalam di permukaan bumi?' },
        { kata: 'SAHARA', hint: 'Apa nama gurun pasir panas terluas di dunia yang terletak di benua Afrika?' },
        { kata: 'RENDANG', hint: 'Apa nama masakan khas Sumatera Barat yang pernah dinobatkan sebagai makanan terenak di dunia?' },
        { kata: 'MAJAPAHIT', hint: 'Apa nama kerajaan besar di Nusantara yang memiliki mahapatih bernama Gajah Mada?' },
        { kata: 'MONAS', hint: 'Apa singkatan dari tugu peringatan kemerdekaan yang menjadi ikon kota Jakarta?' },
        { kata: 'SUMATERA', hint: 'Apa nama pulau besar di bagian paling barat Indonesia yang membentang dari Aceh hingga Lampung?' },
        { kata: 'BATIK', hint: 'Apa nama kain bergambar khas Indonesia yang diakui UNESCO sebagai warisan budaya dunia?' },
        { kata: 'TOKYO', hint: 'Apa nama ibu kota dari negara Jepang?' }
    ];

    let terpilih = daftarKataUmum[Math.floor(Math.random() * daftarKataUmum.length)];
    let hurufAsli = terpilih.kata.split('');
    let hurufAcak = [...hurufAsli].sort(function() { return Math.random() - 0.5; });
    if (hurufAcak.join('') === terpilih.kata) hurufAcak.reverse();

    window.mgAnagramState = {
        target: terpilih.kata,
        hint: terpilih.hint,
        shuffled: hurufAcak,
        pickedIndices: []
    };

    window.renderUIBioAnagram();
    window.jalankanTimerMiniGame(35, function() {
        window.selesaikanMiniGameDenganHadiah('Waktu habis! Jawaban yang benar adalah: ' + terpilih.kata);
    });
};

window.DAFTAR_TEMA_SPOT_DIFF = [
    {
        judul: "Pemandangan Pagi di Pegunungan",
        baseSVG:
            '<rect x="0" y="0" width="240" height="170" fill="#bae6fd"/>' +
            '<polygon points="10,135 75,55 140,135" fill="#64748b"/>' +
            '<polygon points="75,55 57,78 93,78" fill="#f8fafc"/>' +
            '<polygon points="95,135 165,45 235,135" fill="#475569"/>' +
            '<rect x="0" y="130" width="240" height="40" fill="#4ade80"/>' +
            '<rect x="35" y="95" width="46" height="36" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>' +
            '<polygon points="30,95 58,72 86,95" fill="#ef4444"/>' +
            '<rect x="190" y="102" width="10" height="30" fill="#78350f"/>' +
            '<circle cx="195" cy="92" r="18" fill="#16a34a"/>',
        diffs: [
            { id: 0, x: 35, y: 30, r: 20, svgA: '<circle cx="35" cy="30" r="14" fill="#facc15"/>', svgB: '<circle cx="35" cy="30" r="14" fill="#fb923c"/>' },
            { id: 1, x: 120, y: 32, r: 22, svgA: '<ellipse cx="120" cy="32" rx="18" ry="9" fill="#ffffff"/>', svgB: '' },
            { id: 2, x: 58, y: 115, r: 18, svgA: '<rect x="52" y="108" width="12" height="23" fill="#92400e"/>', svgB: '<rect x="52" y="108" width="12" height="23" fill="#2563eb"/>' },
            { id: 3, x: 195, y: 88, r: 20, svgA: '<circle cx="189" cy="88" r="3.5" fill="#ef4444"/><circle cx="201" cy="94" r="3.5" fill="#ef4444"/>', svgB: '' },
            { id: 4, x: 135, y: 150, r: 20, svgA: '<circle cx="135" cy="150" r="6" fill="#ec4899"/><circle cx="135" cy="150" r="2.5" fill="#facc15"/>', svgB: '<circle cx="135" cy="150" r="6" fill="#a855f7"/><circle cx="135" cy="150" r="2.5" fill="#ffffff"/>' }
        ]
    },
    {
        judul: "Meja Belajar & Eksperimen",
        baseSVG:
            '<rect x="0" y="0" width="240" height="170" fill="#f1f5f9"/>' +
            '<rect x="0" y="125" width="240" height="45" fill="#d97706"/>' +
            '<rect x="75" y="45" width="85" height="58" rx="5" fill="#1e293b" stroke="#475569" stroke-width="3"/>' +
            '<rect x="108" y="103" width="18" height="16" fill="#64748b"/>' +
            '<rect x="92" y="118" width="50" height="7" rx="3" fill="#475569"/>' +
            '<rect x="15" y="25" width="45" height="6" fill="#78350f"/>' +
            '<rect x="185" y="96" width="22" height="28" rx="3" fill="#ef4444"/>',
        diffs: [
            { id: 0, x: 195, y: 32, r: 22, svgA: '<circle cx="195" cy="32" r="15" fill="#ffffff" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="195" y2="21" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="203" y2="32" stroke="#0f172a" stroke-width="2"/>', svgB: '<circle cx="195" cy="32" r="15" fill="#fef08a" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="195" y2="21" stroke="#0f172a" stroke-width="2"/><line x1="195" y1="32" x2="186" y2="32" stroke="#0f172a" stroke-width="2"/>' },
            { id: 1, x: 37, y: 16, r: 20, svgA: '<rect x="22" y="8" width="9" height="17" fill="#3b82f6"/><rect x="33" y="6" width="9" height="19" fill="#10b981"/>', svgB: '<rect x="22" y="8" width="9" height="17" fill="#3b82f6"/>' },
            { id: 2, x: 117, y: 74, r: 22, svgA: '<circle cx="117" cy="74" r="12" fill="#38bdf8"/>', svgB: '<polygon points="117,60 131,86 103,86" fill="#f43f5e"/>' },
            { id: 3, x: 196, y: 83, r: 20, svgA: '<path d="M192,92 Q190,82 195,76 M200,92 Q198,82 203,76" stroke="#94a3b8" stroke-width="2" fill="none"/>', svgB: '' },
            { id: 4, x: 42, y: 145, r: 22, svgA: '<rect x="25" y="140" width="36" height="8" rx="3" fill="#22c55e"/>', svgB: '<rect x="25" y="140" width="36" height="8" rx="3" fill="#a855f7"/>' }
        ]
    },
    {
        judul: "Petualangan Bawah Laut",
        baseSVG:
            '<rect x="0" y="0" width="240" height="170" fill="#0284c7"/>' +
            '<rect x="0" y="140" width="240" height="30" fill="#fde047"/>' +
            '<ellipse cx="115" cy="75" rx="45" ry="24" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>' +
            '<rect x="105" y="40" width="16" height="14" fill="#eab308"/>' +
            '<rect x="105" y="36" width="24" height="6" rx="2" fill="#ca8a04"/>' +
            '<path d="M25,140 Q18,115 28,95 Q35,115 28,140" fill="#16a34a"/>' +
            '<path d="M38,140 Q45,118 36,102 Q28,118 38,140" fill="#15803d"/>',
        diffs: [
            { id: 0, x: 115, y: 75, r: 20, svgA: '<circle cx="115" cy="75" r="10" fill="#bae6fd" stroke="#0369a1" stroke-width="2"/>', svgB: '<rect x="105" y="65" width="20" height="20" rx="3" fill="#bae6fd" stroke="#0369a1" stroke-width="2"/>' },
            { id: 1, x: 64, y: 75, r: 18, svgA: '<polygon points="70,75 56,64 56,86" fill="#ef4444"/>', svgB: '<polygon points="70,75 56,64 56,86" fill="#22c55e"/>' },
            { id: 2, x: 195, y: 45, r: 22, svgA: '<ellipse cx="195" cy="45" rx="14" ry="8" fill="#fb923c"/><polygon points="209,45 220,38 220,52" fill="#fb923c"/>', svgB: '<ellipse cx="195" cy="45" rx="14" ry="8" fill="#f472b6"/><polygon points="209,45 220,38 220,52" fill="#f472b6"/>' },
            { id: 3, x: 48, y: 38, r: 20, svgA: '<circle cx="48" cy="45" r="5" fill="#e0f2fe"/><circle cx="54" cy="32" r="3.5" fill="#e0f2fe"/>', svgB: '' },
            { id: 4, x: 180, y: 148, r: 20, svgA: '<polygon points="180,136 184,145 194,146 186,152 188,161 180,156 172,161 174,152 166,146 176,145" fill="#f97316"/>', svgB: '' }
        ]
    }
];

window.mulaiGame6SpotDiff = function() {
    let temaList = window.DAFTAR_TEMA_SPOT_DIFF;
    let tema = temaList[Math.floor(Math.random() * temaList.length)];

    document.getElementById('minigame-title').innerText = '🔍 6. Cari 5 Perbedaan Gambar';
    document.getElementById('minigame-subtitle').innerText = 'Sentuh/klik langsung pada 5 bagian yang berbeda antara Gambar 1 dan Gambar 2!';
    document.getElementById('minigame-score-val').innerText = '0/5';

    window.mgSpotState = { tema: tema, foundIds: [] };
    window.renderUISpotDiff();

    window.jalankanTimerMiniGame(45, function() {
        window.selesaikanMiniGameDenganHadiah('Waktu selesai! Kamu menemukan ' + window.mgSpotState.foundIds.length + ' dari 5 perbedaan!');
    });
};

window.renderUISpotDiff = function() {
    let st = window.mgSpotState;
    let stage = document.getElementById('minigame-stage-body');
    if (!st || !stage) return;

    let diffLayerA = '', diffLayerB = '', ringsLayer = '';
    st.tema.diffs.forEach(function(d) {
        diffLayerA += d.svgA;
        diffLayerB += d.svgB;
        if (st.foundIds.includes(d.id)) {
            ringsLayer += '<circle cx="' + d.x + '" cy="' + d.y + '" r="16" fill="none" stroke="#22c55e" stroke-width="3.5"/>';
            ringsLayer += '<circle cx="' + d.x + '" cy="' + d.y + '" r="16" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="3,3"/>';
        }
    });

    stage.innerHTML =
        '<div style="font-size:12px; font-weight:800; color:#0b3954; margin-bottom:8px;">🖼️ Tema: ' + st.tema.judul + ' (Ditemukan: ' + st.foundIds.length + '/5)</div>' +
        '<div class="mg-spot-wrapper">' +
            '<div class="mg-spot-box">' +
                '<div class="mg-spot-label">GAMBAR 1</div>' +
                '<svg viewBox="0 0 240 170" class="mg-spot-svg" onclick="window.klikGambarSpotDiff(event, this)">' +
                    st.tema.baseSVG + diffLayerA + ringsLayer +
                '</svg>' +
            '</div>' +
            '<div class="mg-spot-box">' +
                '<div class="mg-spot-label">GAMBAR 2</div>' +
                '<svg viewBox="0 0 240 170" class="mg-spot-svg" onclick="window.klikGambarSpotDiff(event, this)">' +
                    st.tema.baseSVG + diffLayerB + ringsLayer +
                '</svg>' +
            '</div>' +
        '</div>';
};

window.klikGambarSpotDiff = function(evt, svgEl) {
    let st = window.mgSpotState;
    if (!st) return;

    let rect = svgEl.getBoundingClientRect();
    let scaleX = 240 / rect.width;
    let scaleY = 170 / rect.height;
    let clickX = (evt.clientX - rect.left) * scaleX;
    let clickY = (evt.clientY - rect.top) * scaleY;

    let hitDiff = null;
    st.tema.diffs.forEach(function(d) {
        if (!st.foundIds.includes(d.id)) {
            let dist = Math.hypot(clickX - d.x, clickY - d.y);
            if (dist <= (d.r || 22)) hitDiff = d;
        }
    });

    if (hitDiff) {
        st.foundIds.push(hitDiff.id);
        document.getElementById('minigame-score-val').innerText = st.foundIds.length + '/5';
        window.renderUISpotDiff();

        if (st.foundIds.length >= 5) {
            let t = setTimeout(function() {
                window.selesaikanMiniGameDenganHadiah('Mata Elang! Kamu berhasil menemukan kelima perbedaan pada gambar!');
            }, 350);
            window.minigameActiveTimers.push(t);
        }
    } else {
        let missMark = document.createElementNS("http://www.w3.org/2000/svg", "text");
        missMark.setAttribute("x", clickX - 6);
        missMark.setAttribute("y", clickY + 6);
        missMark.setAttribute("fill", "#ef4444");
        missMark.setAttribute("font-size", "16");
        missMark.setAttribute("font-weight", "bold");
        missMark.textContent = "✕";
        svgEl.appendChild(missMark);
        setTimeout(function() { if (missMark.parentNode) missMark.remove(); }, 450);
    }
};

// =========================================================================
// 6. ROMBAK CONTENT BLOCK DINAMIS, PATTERN DI DALAM BLOK, & LINE SPACING
// =========================================================================
window.matikanPengunciKertasA4 = function() {
    let styleA4 = document.getElementById('ms-word-a4-override');
    if (styleA4) styleA4.remove();
    document.querySelectorAll('.a4-page-numbers-container').forEach(function(el) {
        el.remove();
    });
};
window.matikanPengunciKertasA4();

window.pasangGayaKertasWordA4 = function() { window.matikanPengunciKertasA4(); };
window.jalankanPaginasiWord = function() { window.matikanPengunciKertasA4(); };
window.rapikanSemuaBlokA4Word = function() { window.matikanPengunciKertasA4(); };
window.rapikanHalamanA4Word = function() {};
window.bangunLembarCetakPresisiA4 = function() {};
window.bersihkanLembarCetakPresisiA4 = function() {};
window.cekBatasTinggiA4Keydown = function() {};

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

window.cetakMateriHalamanA4 = function() {
    window.print();
};

window.renderBlocks = function() {
    window.matikanPengunciKertasA4();
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
                '<div class="block-controls">' +
                    '<button onclick="geserBlok(' + index + ', -1)">⬆️</button>' +
                    '<button onclick="geserBlok(' + index + ', 1)">⬇️</button>' +
                    '<button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button>' +
                    '<button onclick="hapusBlok(' + index + ')">🗑️ Delete</button>' +
                '</div>' +
                '<div class="content-block pdf-landscape-block ' + patClass + '" data-index="' + index + '" data-block-type="pdf_slides" style="background-color:' + bgCol + ';">' +
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
                    '<div class="pdf-slide-stage" data-index="' + index + '" data-slide-index="' + sIdx + '" onpointerdown="window.mulaiSwipeSlidePDF(event, ' + index + ')" onpointerup="window.akhirSwipeSlidePDF(event, ' + index + ')">' +
                        '<img class="pdf-slide-bg" src="' + (curSlide.bg || '') + '" alt="Slide PDF">' +
                        '<div class="draw-float-layer" data-index="' + index + '" data-slide-index="' + sIdx + '">' + floatImgsHtml + '</div>' +
                        '<canvas class="drawing-layer" data-index="' + index + '" data-slide-index="' + sIdx + '"></canvas>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }
        else if (blok.type === 'quiz') {
            let judulKuis = blok.quizTitle || '🧩 Uji Pemahaman';
            let editJudulAttr = isEdit ? 'contenteditable="true" style="outline:none; border-bottom:1px dashed #3498db; padding-bottom:2px;" onblur="window.contentBlocksData[' + index + '].quizTitle=this.innerText; if(window.simpanKeDB) window.simpanKeDB();"' : '';

            let qi = '<div class="quiz-container" id="inline-kuis-' + index + '">' +
                    '<div class="quiz-header">' +
                        '<h3 class="quiz-title" ' + editJudulAttr + '>' + judulKuis + '</h3>' +
                        '<div>' +
                            '<button class="btn-action" style="background:#34495e;width:auto;font-size:11px;padding:6px 12px;margin-right:5px;" onclick="cetakKuisPDF(\'inline-kuis-' + index + '\',\'Materi\')">🖨️ Cetak</button>' +
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
                '<div class="block-controls"><button onclick="geserBlok(' + index + ', -1)">⬆️</button><button onclick="geserBlok(' + index + ', 1)">⬇️</button><button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button><button onclick="hapusBlok(' + index + ')">🗑️ Delete</button></div>' +
                '<div class="a4-paper-wrapper dynamic-block-shell" data-width="' + widthMode + '">' +
                    '<div class="draw-float-layer" data-index="' + index + '">' + floatImgsQuiz + '</div>' +
                    '<canvas class="drawing-layer" data-index="' + index + '"></canvas>' +
                    '<div class="content-block dynamic-content-block ' + patClass + '" data-index="' + index + '" data-width="' + widthMode + '" style="background-color:' + bgCol + ';">' +
                        qi +
                    '</div>' +
                '</div>' +
            '</div>';
        }
        else {
            let floatImgsText = window.renderFloatImagesHTML(index, -1, blok.floatImages || []);
            html += '<div class="block-wrapper" data-index="' + index + '" style="padding-top:' + padTop + ';padding-bottom:' + padBot + ';">' +
                '<div class="block-controls"><button onclick="geserBlok(' + index + ', -1)">⬆️</button><button onclick="geserBlok(' + index + ', 1)">⬇️</button><button onclick="bukaSidebarBlock(' + index + ')">⚙️ Setting</button><button onclick="hapusBlok(' + index + ')">🗑️ Delete</button></div>' +
                '<div class="a4-paper-wrapper dynamic-block-shell" data-width="' + widthMode + '">' +
                    '<div class="draw-float-layer" data-index="' + index + '">' + floatImgsText + '</div>' +
                    '<canvas class="drawing-layer" data-index="' + index + '"></canvas>' +
                    '<div class="content-block a4-portrait-block dynamic-content-block ' + patClass + '" ' + (isEdit ? 'contenteditable="true"' : '') + ' data-index="' + index + '" data-block-type="text" data-width="' + widthMode + '" style="background-color:' + bgCol + '; color:' + txtCol + ';" oninput="window.cekBatasTinggiA4Input(event, this)">' +
                        blok.html +
                    '</div>' +
                '</div>' +
            '</div>';
        }
    });

    let container = document.getElementById('blocks-container');
    if (container) container.innerHTML = html;

    if (window.renderMathJax) window.renderMathJax();
    setTimeout(function() {
        if (typeof window.inisialisasiSemuaCanvas === 'function') window.inisialisasiSemuaCanvas();
    }, 150);
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

window.aturSpasiParagraf = function(cmd) {
    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let range = sel.getRangeAt(0);
    let anchorEl = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer;
    let editable = (anchorEl && anchorEl.closest) ? anchorEl.closest('.content-block, .fb-content, #popup-content-box, #cg-editor-area, #ck-editor-area') : window.lastActiveEditable;
    if (!editable) return;

    let rawVal = String(cmd).replace('line-', '').trim();
    let numVal = parseFloat(rawVal);
    if (isNaN(numVal)) return;

    let petaSpasiBawah = {
        "0.25": { lh: "0.88", mb: "0.05em" },
        "0.5":  { lh: "1.02", mb: "0.15em" },
        "0.75": { lh: "1.15", mb: "0.25em" },
        "1":    { lh: "1.30", mb: "0.38em" },
        "1.25": { lh: "1.45", mb: "0.52em" },
        "1.5":  { lh: "1.62", mb: "0.72em" },
        "2":    { lh: "1.90", mb: "1.05em" }
    };
    let cfg = petaSpasiBawah[String(numVal)] || { lh: String(numVal), mb: (numVal * 0.4) + "em" };

    let targetBlocks = Array.from(editable.querySelectorAll('p, div, li, h1, h2, h3, h4, h5, h6, blockquote, td')).filter(function(blk) {
        if (!range.intersectsNode(blk)) return false;
        let hasChildBlock = blk.querySelector('p, div, li, h1, h2, h3, h4, h5, h6, blockquote');
        return !hasChildBlock;
    });

    if (targetBlocks.length === 0) {
        let closestBlk = anchorEl.closest ? anchorEl.closest('p, div, li, h1, h2, h3, h4, h5, h6, blockquote, td') : null;
        if (!closestBlk || closestBlk === editable) {
            document.execCommand('formatBlock', false, '<P>');
            let newSel = window.getSelection();
            if (newSel && newSel.anchorNode) {
                let nEl = newSel.anchorNode.nodeType === 3 ? newSel.anchorNode.parentElement : newSel.anchorNode;
                closestBlk = nEl.closest ? nEl.closest('p, div, li, h1, h2, h3, h4, h5, h6, blockquote, td') : null;
            }
        }
        if (closestBlk && closestBlk !== editable) {
            targetBlocks.push(closestBlk);
        }
    }

    if (targetBlocks.length > 0) {
        targetBlocks.forEach(function(blk) {
            blk.style.marginTop = "0px";
            blk.style.paddingTop = "0px";
            blk.style.marginBottom = cfg.mb;
            blk.style.lineHeight = cfg.lh;
            blk.querySelectorAll('*').forEach(function(child) {
                if (child.style && child.style.lineHeight) child.style.lineHeight = "";
            });
        });
    } else {
        editable.style.lineHeight = cfg.lh;
    }

    editable.dispatchEvent(new Event('input', { bubbles: true }));
};



document.addEventListener('DOMContentLoaded', function() {
    let inpNamaManual = document.getElementById('reg-input-nama-baru');
    if (inpNamaManual) {
        inpNamaManual.addEventListener('input', function() {
            if (typeof window.isiOtomatisUsernameReg === 'function') {
                window.isiOtomatisUsernameReg();
            }
        });
    }
    window.perbaruiTombolCheckinUI();
});

window.tampilkanPopupPengingatLatihanTanpaLogin = function(onCloseCallback) {
    let oldModal = document.getElementById('modal-pengingat-poin-latihan');
    if (oldModal) oldModal.remove();

    let modal = document.createElement('div');
    modal.id = 'modal-pengingat-poin-latihan';
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.style.zIndex = '1000090';

    function tutupDanLanjut() {
        modal.remove();
        if (onCloseCallback) onCloseCallback();
    }

    modal.onclick = function(e) {
        if (e.target === modal) tutupDanLanjut();
    };

    modal.innerHTML =
        '<div class="modal-box" style="width:390px; max-width:92vw; text-align:center; border-radius:14px; overflow:hidden; box-shadow:0 15px 35px rgba(0,0,0,0.3);">' +
            '<div class="modal-header" style="background:#fef9e7; border-bottom:1px solid #f9e79f; padding:14px 18px;">' +
                '<h3 style="margin:0; color:#d35400; font-size:16px;">⚠️ Pengingat Poin Latihan</h3>' +
                '<button type="button" class="close-btn" id="btn-x-pengingat-latihan" style="color:#d35400;">✕</button>' +
            '</div>' +
            '<div class="modal-body" style="padding:22px 20px;">' +
                '<div style="font-size:44px; margin-bottom:8px;">💡</div>' +
                '<p style="margin:0 0 18px 0; font-size:15px; font-weight:700; color:#1e293b; line-height:1.5;">Jika belum login, Anda tidak akan mendapatkan poin.</p>' +
                '<button type="button" id="btn-ok-pengingat-latihan" class="btn-action" style="background:#0b3954; width:100%; padding:11px; border-radius:25px; font-size:14px;">Mengerti & Lanjut Latihan ➔</button>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);
    document.getElementById('btn-x-pengingat-latihan').onclick = tutupDanLanjut;
    document.getElementById('btn-ok-pengingat-latihan').onclick = tutupDanLanjut;
};

if (!window._baseMulaiLatihanSiswa) {
    window._baseMulaiLatihanSiswa = window.mulaiLatihanSiswa;
}
window.mulaiLatihanSiswa = function() {
    let stat = sessionStorage.getItem("statusLogin");
    if (stat !== "siswa" && stat !== "admin") {
        let selKes = document.getElementById('latihan-select-kesulitan');
        let keyVal = (selKes && selKes.value) ? selKes.value : document.getElementById('latihan-select-bab').value;
        if (!keyVal) return alert("Pilih Bab dan Tingkat Kesulitan terlebih dahulu!");

        window.tampilkanPopupPengingatLatihanTanpaLogin(function() {
            if (window._baseMulaiLatihanSiswa) window._baseMulaiLatihanSiswa();
        });
        return;
    }
    if (window._baseMulaiLatihanSiswa) window._baseMulaiLatihanSiswa();
};

// =========================================================================
// 8. RENTANG LENCANA BARU (SAMPAI PROFESOR) & TOKO BINGKAI PROFIL (KARTU + AVATAR)
// =========================================================================
window.kalkulasiLencanaSains = function(xp) {
    let poin = Number(xp) || 0;
    if (poin <= 500) {
        return { nama: "Pengamat", ikon: "🔍", batas: 500, warna: "#d35400", bg: "#fef9e7", border: "#f9e79f", deskripsi: "Baru memulai perjalanan mengamati keajaiban sains (0 - 500 XP)." };
    }
    if (poin <= 10000) {
        return { nama: "Asisten Lab", ikon: "🧪", batas: 10000, warna: "#16a085", bg: "#e8f8f5", border: "#a3e4d7", deskripsi: "Telah mahir menggunakan alat dasar dan memahami modul (501 - 10.000 XP)." };
    }
    if (poin <= 75000) {
        return { nama: "Analis", ikon: "🔬", batas: 75000, warna: "#2980b9", bg: "#eaf2f8", border: "#aed6f1", deskripsi: "Ahli dalam mengumpulkan data dan mengevaluasi materi (10.001 - 75.000 XP)." };
    }
    if (poin <= 500000) {
        return { nama: "Peneliti", ikon: "🧬", batas: 500000, warna: "#8e44ad", bg: "#f5eef8", border: "#d7bde2", deskripsi: "Mampu memecahkan masalah HOTS dan meraih skor tinggi (75.001 - 500.000 XP)." };
    }
    if (poin <= 10000000) {
        return { nama: "Cendekiawan", ikon: "⚛️", batas: 10000000, warna: "#c0392b", bg: "#fdedec", border: "#fadbd8", deskripsi: "Menguasai berbagai cabang ilmu sains secara mendalam (500.001 - 10.000.000 XP)." };
    }
    return { nama: "Profesor", ikon: "👑", batas: "Max", warna: "#b45309", bg: "#fffbeb", border: "#f59e0b", deskripsi: "Pangkat mahaguru tertinggi (> 10.000.000 XP). Legenda Sains Sejati!" };
};

// KATALOG 27 PAKET BINGKAI (MENCAKUP BINGKAI KARTU BERMOTIF/BATIK/LEKUKAN + BINGKAI AVATAR)
window.KATALOG_BORDER_SHOP = [
    // TIER 1: STANDARD (1.000 XP) - Pola Geometris Halus & Bingkai Avatar Cincin Mengilap
    { id: "b1",  no: 1,  tier: "Standard",  harga: 1000,    nama: "1. Silver Clean",     ikonKanan: "✨", classCss: "sbd-border-1",  avatarCss: "av-frame-1" },
    { id: "b2",  no: 2,  tier: "Standard",  harga: 1000,    nama: "2. Nature Leaf",      ikonKanan: "🌿", classCss: "sbd-border-2",  avatarCss: "av-frame-2" },
    { id: "b3",  no: 3,  tier: "Standard",  harga: 1000,    nama: "3. Sky Breeze",       ikonKanan: "💎", classCss: "sbd-border-3",  avatarCss: "av-frame-3" },
    { id: "b4",  no: 4,  tier: "Standard",  harga: 1000,    nama: "4. Sunny Gold",       ikonKanan: "⭐", classCss: "sbd-border-4",  avatarCss: "av-frame-4" },
    { id: "b5",  no: 5,  tier: "Standard",  harga: 1000,    nama: "5. Mint Crown",       ikonKanan: "👑", classCss: "sbd-border-5",  avatarCss: "av-frame-5" },

    // TIER 2: ELITE (10.000 XP) - Motif Batik Kawung & Sulur Klasik + Bingkai Avatar Segi Delapan Permata
    { id: "b6",  no: 6,  tier: "Elite",     harga: 10000,   nama: "6. Navy Batik Crest", ikonKanan: "⚡", classCss: "sbd-border-6",  avatarCss: "av-frame-6" },
    { id: "b7",  no: 7,  tier: "Elite",     harga: 10000,   nama: "7. Golden Kawung",    ikonKanan: "🌾", classCss: "sbd-border-7",  avatarCss: "av-frame-7" },
    { id: "b8",  no: 8,  tier: "Elite",     harga: 10000,   nama: "8. Mystic Violet",    ikonKanan: "🔮", classCss: "sbd-border-8",  avatarCss: "av-frame-8" },
    { id: "b9",  no: 9,  tier: "Elite",     harga: 10000,   nama: "9. Emerald Royal",    ikonKanan: "👑", classCss: "sbd-border-9",  avatarCss: "av-frame-9" },
    { id: "b10", no: 10, tier: "Elite",     harga: 10000,   nama: "10. Sapphire Crest",  ikonKanan: "🛡️", classCss: "sbd-border-10", avatarCss: "av-frame-10" },

    // TIER 3: SPECIAL (50.000 XP) - Lekukan Gelombang Ombak & Batik Mega Mendung + Avatar Berkelopak
    { id: "b11", no: 11, tier: "Special",   harga: 50000,   nama: "11. Sweet Sakura",    ikonKanan: "💖", classCss: "sbd-border-11", avatarCss: "av-frame-11" },
    { id: "b12", no: 12, tier: "Special",   harga: 50000,   nama: "12. Spring Blossom",  ikonKanan: "🌼", classCss: "sbd-border-12", avatarCss: "av-frame-12" },
    { id: "b13", no: 13, tier: "Special",   harga: 50000,   nama: "13. Cosmic Saturn",   ikonKanan: "🪐", classCss: "sbd-border-13", avatarCss: "av-frame-13" },
    { id: "b14", no: 14, tier: "Special",   harga: 50000,   nama: "14. Cyber Crystal",   ikonKanan: "🧊", classCss: "sbd-border-14", avatarCss: "av-frame-14" },
    { id: "b15", no: 15, tier: "Special",   harga: 50000,   nama: "15. Party Fiesta",    ikonKanan: "🎈", classCss: "sbd-border-15", avatarCss: "av-frame-15" },

    // TIER 4: LEGENDARY (1.000.000 XP) - Ukiran Batik Emas Kerajaan & Sudut Perisai + Avatar Mahkota Berputar
    { id: "b16", no: 16, tier: "Legendary", harga: 1000000, nama: "16. Sovereign Gold",  ikonKanan: "👑", classCss: "sbd-border-16", avatarCss: "av-frame-16" },
    { id: "b17", no: 17, tier: "Legendary", harga: 1000000, nama: "17. Seraphim Wings",  ikonKanan: "🪽", classCss: "sbd-border-17", avatarCss: "av-frame-17" },
    { id: "b18", no: 18, tier: "Legendary", harga: 1000000, nama: "18. Astral Archon",   ikonKanan: "🌌", classCss: "sbd-border-18", avatarCss: "av-frame-18" },
    { id: "b19", no: 19, tier: "Legendary", harga: 1000000, nama: "19. Inferno Dragon",  ikonKanan: "🐉", classCss: "sbd-border-19", avatarCss: "av-frame-19" },
    { id: "b20", no: 20, tier: "Legendary", harga: 1000000, nama: "20. Celestial Void",  ikonKanan: "⚜️", classCss: "sbd-border-20", avatarCss: "av-frame-20" },

    // TIER 5: THEME (500.000 XP) - Anime & Kosmik Custom (Ornamen SVG)
    { id: "b21", no: 21, tier: "Theme",     harga: 500000,  nama: "21. Ninja Way (Naruto)", ikonKanan: "🍃", classCss: "sbd-border-21", avatarCss: "av-frame-21" },
    { id: "b22", no: 22, tier: "Theme",     harga: 500000,  nama: "22. Demon Slayer (KNY)", ikonKanan: "⚔️", classCss: "sbd-border-22", avatarCss: "av-frame-22" },
    { id: "b23", no: 23, tier: "Theme",     harga: 500000,  nama: "23. Pirate King (OP)",   ikonKanan: "⚓", classCss: "sbd-border-23", avatarCss: "av-frame-23" },
    { id: "b24", no: 24, tier: "Theme",     harga: 500000,  nama: "24. Sorcerer (JJK)",     ikonKanan: "🤞", classCss: "sbd-border-24", avatarCss: "av-frame-24" },
    { id: "b25", no: 25, tier: "Theme",     harga: 500000,  nama: "25. Scout Legion (AOT)", ikonKanan: "🛡️", classCss: "sbd-border-25", avatarCss: "av-frame-25" },
    { id: "b26", no: 26, tier: "Theme",     harga: 500000,  nama: "26. Super Saiyan (DB)",  ikonKanan: "🐉", classCss: "sbd-border-26", avatarCss: "av-frame-26" },
    { id: "b27", no: 27, tier: "Theme",     harga: 500000,  nama: "27. Cyberpunk Neon",     ikonKanan: "🤖", classCss: "sbd-border-27", avatarCss: "av-frame-27" }
];

window.cariDataBorderById = function(borderId) {
    if (!borderId) return null;
    return window.KATALOG_BORDER_SHOP.find(function(b) { return b.id === borderId; }) || null;
};

// Pembangun HTML Bingkai Avatar Berornamen (Bisa Dipakai di Leaderboard, Shop, Profil, & Header)
window.buatHTMLBingkaiAvatar = function(fotoSrc, borderId, sizePx, fallbackColor) {
    let item = window.cariDataBorderById(borderId);
    let defaultSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
    let src = fotoSrc || defaultSvg;
    let sz = sizePx || 46;

    if (!item) {
        return '<div class="av-frame-wrap" style="width:' + sz + 'px; height:' + sz + 'px;">' +
                   '<img class="av-frame-img" src="' + src + '" style="border:2px solid ' + (fallbackColor || '#3498db') + ';">' +
               '</div>';
    }

    let tierClass = "av-tier-" + item.tier.toLowerCase();
    return '<div class="av-frame-wrap ' + tierClass + ' ' + item.avatarCss + '" style="width:' + sz + 'px; height:' + sz + 'px;" data-badge="' + item.ikonKanan + '">' +
               '<span class="av-frame-ring"></span>' +
               '<img class="av-frame-img" src="' + src + '">' +
               '<span class="av-frame-crest">' + item.ikonKanan + '</span>' +
           '</div>';
};

window.pastikanAreaShopDiProfilAda = function() {
    let modalProfil = document.getElementById('modal-profil-siswa');
    if (!modalProfil) return;
    let body = modalProfil.querySelector('.modal-body');
    if (!body || document.getElementById('profil-shop-section')) return;

    let shopContainer = document.createElement('div');
    shopContainer.id = 'profil-shop-section';
    shopContainer.style.cssText = 'background:white; padding:14px; border-radius:10px; border:2px solid #f1c40f; margin-bottom:15px; box-shadow:0 4px 12px rgba(241,196,15,0.12);';
    shopContainer.innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
            '<div>' +
                '<div style="font-size:14px; font-weight:800; color:#0b3954;">🛒 Toko Bingkai & Ornamen Profil (XP Shop)</div>' +
                '<div style="font-size:11px; color:#64748b;">Tukarkan poin XP-mu dengan Bingkai Avatar & Kartu berpola unik!</div>' +
            '</div>' +
            '<button type="button" class="btn-action" style="background:linear-gradient(135deg, #f39c12, #d35400); width:auto; padding:7px 14px; font-size:12px; border-radius:20px;" onclick="window.toggleBukaTutupShopProfil()">🛍️ Buka Shop</button>' +
        '</div>' +
        '<div id="profil-shop-drawer" style="display:none; margin-top:14px; border-top:1px dashed #cbd5e1; padding-top:12px;">' +
            '<div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:8px; margin-bottom:10px;" id="shop-tier-tabs">' +
                '<button type="button" class="shop-tier-btn active" onclick="window.renderIsiShopBorder(\'Standard\', this)">⭐ Standard (1rb)</button>' +
                '<button type="button" class="shop-tier-btn" onclick="window.renderIsiShopBorder(\'Elite\', this)">👑 Elite (10rb)</button>' +
                '<button type="button" class="shop-tier-btn" onclick="window.renderIsiShopBorder(\'Special\', this)">🔮 Special (50rb)</button>' +
                '<button type="button" class="shop-tier-btn" onclick="window.renderIsiShopBorder(\'Theme\', this)">🎌 Theme (500rb)</button>' +
                '<button type="button" class="shop-tier-btn" onclick="window.renderIsiShopBorder(\'Legendary\', this)">🐉 Legendary (1jt)</button>' +
            '</div>' +
            '<div id="shop-border-list" style="display:grid; grid-template-columns:1fr; gap:12px; max-height:310px; overflow-y:auto; padding:4px;"></div>' +
        '</div>';

    let firstCard = body.firstElementChild;
    if (firstCard && firstCard.nextSibling) {
        body.insertBefore(shopContainer, firstCard.nextSibling);
    } else {
        body.appendChild(shopContainer);
    }
};

window.toggleBukaTutupShopProfil = function() {
    let drawer = document.getElementById('profil-shop-drawer');
    if (!drawer) return;
    if (drawer.style.display === 'none') {
        drawer.style.display = 'block';
        window.renderIsiShopBorder('Standard');
    } else {
        drawer.style.display = 'none';
    }
};

window.activeShopTier = 'Standard';
window.renderIsiShopBorder = function(tierFilter, btnEl) {
    if (tierFilter) window.activeShopTier = tierFilter;
    if (btnEl) {
        document.querySelectorAll('#shop-tier-tabs .shop-tier-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        btnEl.classList.add('active');
    }

    let listEl = document.getElementById('shop-border-list');
    if (!listEl) return;

    let uName = sessionStorage.getItem("username");
    let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(uName)
        : ((window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) ? window.leaderboardSiswaData[uName] : null);
    if (!lb) return;

    let owned = Array.isArray(lb.ownedBorders) ? lb.ownedBorders : (lb.ownedBorders ? Object.values(lb.ownedBorders) : []);
    let equipped = lb.equippedBorder || "";
    let namaTampil = lb.namaPanggilan || lb.namaLengkap || uName;

    let items = window.KATALOG_BORDER_SHOP.filter(function(item) {
        return item.tier === window.activeShopTier;
    });

    let html = '';
    items.forEach(function(item) {
        let isOwned = owned.includes(item.id);
        let isEquipped = (equipped === item.id);
        let hargaStr = item.harga.toLocaleString('id-ID') + ' Coin';

        let btnAksi = '';
        if (isEquipped) {
            btnAksi = '<button type="button" onclick="window.lepasBorderProfil()" style="background:#64748b; color:white; border:none; padding:6px 12px; border-radius:16px; font-size:11px; font-weight:bold; cursor:pointer;">✓ Terpasang (Lepas)</button>';
        } else if (isOwned) {
            btnAksi = '<button type="button" onclick="window.pasangBorderProfil(\'' + item.id + '\')" style="background:#27ae60; color:white; border:none; padding:6px 14px; border-radius:16px; font-size:11px; font-weight:bold; cursor:pointer;">Pasang</button>';
        } else {
            btnAksi = '<button type="button" onclick="window.beliBorderDiShop(\'' + item.id + '\')" style="background:#0b3954; color:#f1c40f; border:1px solid #f1c40f; padding:6px 12px; border-radius:16px; font-size:11px; font-weight:800; cursor:pointer;">🪙 Beli (' + hargaStr + ')</button>';
        }

        let avatarHtml = window.buatHTMLBingkaiAvatar(lb.foto, item.id, 44);
        let tierClass = "sbd-tier-" + item.tier.toLowerCase();

        html +=
            '<div class="sbd-banner-frame ' + tierClass + ' ' + item.classCss + '" style="padding:12px 15px; display:flex; align-items:center; justify-content:space-between; gap:12px;">' +
                '<div style="display:flex; align-items:center; gap:12px; z-index:2;">' +
                    avatarHtml +
                    '<div>' +
                        '<div style="font-weight:800; font-size:14px; color:#1e293b;">' + namaTampil + ' <span style="font-size:14px;">' + item.ikonKanan + '</span></div>' +
                        '<div style="font-size:11px; font-weight:700; color:#334155;">' + item.nama + ' • ' + item.tier + '</div>' +
                    '</div>' +
                '</div>' +
                '<div style="z-index:2; flex-shrink:0;">' + btnAksi + '</div>' +
            '</div>';
    });

    listEl.innerHTML = html;
};

window.beliBorderDiShop = function(borderId) {
    let uName = sessionStorage.getItem("username");
    let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(uName)
        : (window.leaderboardSiswaData ? window.leaderboardSiswaData[uName] : null);
    if (!lb) return;

    let item = window.cariDataBorderById(borderId);
    if (!item) return;

    if (!Array.isArray(lb.ownedBorders)) {
        lb.ownedBorders = lb.ownedBorders ? Object.values(lb.ownedBorders) : [];
    }

    if (lb.ownedBorders.includes(borderId)) {
        window.pasangBorderProfil(borderId);
        return;
    }

    let saldoCoin = (typeof window.ambilCoinSiswa === "function")
        ? window.ambilCoinSiswa(uName)
        : (Number(lb.coin !== undefined ? lb.coin : (lb.xpTersedia !== undefined ? lb.xpTersedia : lb.xp)) || 0);

    if (saldoCoin < item.harga) {
        let kurang = (item.harga - saldoCoin).toLocaleString('id-ID');
        return alert("⚠️ Saldo Coin kamu belum cukup untuk membeli bingkai " + item.nama + "!\n\nHarga: " + item.harga.toLocaleString('id-ID') + " Coin\nCoin kamu: " + saldoCoin.toLocaleString('id-ID') + " Coin\n(Kurang " + kurang + " Coin lagi)");
    }

    if (!confirm("Beli bingkai \"" + item.nama + "\" (" + item.tier + ") seharga " + item.harga.toLocaleString('id-ID') + " Coin?\n\nHanya Coin yang berkurang, sedangkan XP kamu di Leaderboard tetap utuh!")) {
        return;
    }

    if (typeof window.gunakanCoinSiswa === "function") {
        if (!window.gunakanCoinSiswa(item.harga, "beli_border_" + borderId)) return;
    } else {
        lb.coin = Math.max(0, saldoCoin - item.harga);
        lb.xpTersedia = lb.coin;
    }

    lb.ownedBorders.push(borderId);
    lb.equippedBorder = borderId;

    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, lb);
    }

    window.bukaModalProfilSiswa();
    window.renderIsiShopBorder(window.activeShopTier);
    window.perbaruiUIHeaderProfilSiswa();
    alert("🎉 Selamat! Kamu berhasil membeli dan memasang bingkai \"" + item.nama + "\"!");
};

window.pasangBorderProfil = function(borderId) {
    let uName = sessionStorage.getItem("username");
    if (!uName || !window.leaderboardSiswaData || !window.leaderboardSiswaData[uName]) return;

    window.leaderboardSiswaData[uName].equippedBorder = borderId;
    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, window.leaderboardSiswaData[uName]);
    }
    window.bukaModalProfilSiswa();
    window.renderIsiShopBorder(window.activeShopTier);
    window.perbaruiUIHeaderProfilSiswa();
};

window.lepasBorderProfil = function() {
    let uName = sessionStorage.getItem("username");
    if (!uName || !window.leaderboardSiswaData || !window.leaderboardSiswaData[uName]) return;

    window.leaderboardSiswaData[uName].equippedBorder = "";
    if (typeof window.simpanLeaderboardSiswaKeDB === "function") {
        window.simpanLeaderboardSiswaKeDB(uName, window.leaderboardSiswaData[uName]);
    }
    window.bukaModalProfilSiswa();
    window.renderIsiShopBorder(window.activeShopTier);
    window.perbaruiUIHeaderProfilSiswa();
};

if (!window._baseBukaModalProfilSiswa) {
    window._baseBukaModalProfilSiswa = window.bukaModalProfilSiswa;
}
window.bukaModalProfilSiswa = function() {
    if (window._baseBukaModalProfilSiswa) window._baseBukaModalProfilSiswa();
    window.pastikanAreaShopDiProfilAda();

    let uName = sessionStorage.getItem("username");
    let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(uName)
        : ((window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) ? window.leaderboardSiswaData[uName] : null);
    if (!lb) return;

    let itemBorder = window.cariDataBorderById(lb.equippedBorder);
    let modalProfil = document.getElementById('modal-profil-siswa');
    let firstCard = modalProfil ? modalProfil.querySelector('.modal-body > div:first-child') : null;

    if (firstCard) {
        firstCard.className = "";
        if (itemBorder) {
            firstCard.classList.add("sbd-banner-frame", "sbd-tier-" + itemBorder.tier.toLowerCase(), itemBorder.classCss);
        }
    }

    let imgPreview = document.getElementById('profil-img-preview');
    if (imgPreview && imgPreview.parentElement) {
        let wrapFoto = imgPreview.parentElement;
        wrapFoto.className = "av-profil-host";
        if (itemBorder) {
            wrapFoto.classList.add("av-tier-" + itemBorder.tier.toLowerCase(), itemBorder.avatarCss);
        }
    }
    if (typeof window.perbaruiTampilanSaldoXPPet === "function") {
        window.perbaruiTampilanSaldoXPPet();
    }
};

if (!window._basePerbaruiHeaderProfil) {
    window._basePerbaruiHeaderProfil = window.perbaruiUIHeaderProfilSiswa;
}
window.perbaruiUIHeaderProfilSiswa = function() {
    if (window._basePerbaruiHeaderProfil) window._basePerbaruiHeaderProfil();
    let uName = sessionStorage.getItem("username");
    let btnProfil = document.getElementById('btn-profil-utama');
    let lb = (window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) ? window.leaderboardSiswaData[uName] : null;
    if (btnProfil && lb) {
        btnProfil.className = "header-profile-btn";
        let itemBorder = window.cariDataBorderById(lb.equippedBorder);
        if (itemBorder) {
            btnProfil.classList.add(itemBorder.classCss, itemBorder.avatarCss);
        }
    }
    window.perbaruiTombolCheckinUI();
};

window.apakahKelasSMALeaderboard = function(namaKelas) {
    let kls = String(namaKelas || "").toUpperCase().trim();
    if (!kls || kls === "UMUM" || kls.indexOf("ADMIN") !== -1 || kls.indexOf("GURU") !== -1) return false;
    return (kls === "X" || kls === "XI" || kls === "XII" ||
            kls.indexOf("X ") === 0 || kls.indexOf("XI ") === 0 || kls.indexOf("XII ") === 0 ||
            kls.indexOf("X-") === 0 || kls.indexOf("XI-") === 0 || kls.indexOf("XII-") === 0);
};

window.renderTabelLeaderboard = function() {
    let container = document.getElementById('leaderboard-list-container');
    if (!container) return;

    let filterType = document.getElementById('lb-filter-cakupan').value;
    let filterVal = document.getElementById('lb-select-subfilter').value;
    let currentUsername = (sessionStorage.getItem("username") || "").toLowerCase();

    let rawMap = window.leaderboardSiswaData || {};
    let filtered = [];

    Object.keys(rawMap).forEach(function(uKey) {
        if (uKey.toLowerCase() === "mahardika" || uKey.toLowerCase() === "sbd") return;
        let item = rawMap[uKey];
        if (!item) return;

        let kls = String(item.kelas || "").toUpperCase().trim();
        if (!window.apakahKelasSMALeaderboard(kls)) return;

        let entry = Object.assign({}, item, { _userKey: uKey });

        if (filterType === 'semua') {
            filtered.push(entry);
        } else if (filterType === 'angkatan') {
            let prefixTarget = String(filterVal || "").toUpperCase().trim();
            if (kls === prefixTarget || kls.indexOf(prefixTarget + " ") === 0 || kls.indexOf(prefixTarget + "-") === 0) {
                filtered.push(entry);
            }
        } else if (filterType === 'kelas' && item.kelas === filterVal) {
            filtered.push(entry);
        }
    });

    filtered.sort(function(a, b) {
        let xpA = Number(a.xpTotal !== undefined ? a.xpTotal : a.xp) || 0;
        let xpB = Number(b.xpTotal !== undefined ? b.xpTotal : b.xp) || 0;
        return xpB - xpA;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:30px; color:#7f8c8d; font-style:italic;">Belum ada data ilmuwan sains untuk kategori ini.</div>';
        return;
    }

    let html = '';
    filtered.forEach(function(siswa, i) {
        let xpTotalSiswa = Number(siswa.xpTotal !== undefined ? siswa.xpTotal : siswa.xp) || 0;
        let lencana = window.kalkulasiLencanaSains(xpTotalSiswa);
        let namaAsli = (siswa.namaLengkap || "").trim();
        let namaPanggilan = (siswa.namaPanggilan || "").trim();
        let namaUtama = namaPanggilan || namaAsli;

        // Nama lengkap dienter ke bawah nama panggilan
        let htmlNamaLengkapBawah = "";
        if (namaPanggilan && namaAsli && namaPanggilan.toLowerCase() !== namaAsli.toLowerCase()) {
            htmlNamaLengkapBawah = '<div style="font-size:12px; font-weight:600; color:#475569; margin-top:1px; line-height:1.3;">(' + namaAsli + ')</div>';
        }

        let statSoal = siswa.statSoal || { PG: 0, PGK: 0, IS: 0, Essay: 0 };
        let totalDikerjakan = (Number(statSoal.PG) || 0) + (Number(statSoal.PGK) || 0) + (Number(statSoal.IS) || 0) + (Number(statSoal.Essay) || 0);

        let bgRank = i === 0 ? '#fef9e7' : (i === 1 ? '#f8f9fa' : (i === 2 ? '#fdf2e9' : '#ffffff'));
        let borderRank = i === 0 ? '#f1c40f' : (i === 1 ? '#bdc3c7' : (i === 2 ? '#e67e22' : '#e2e8f0'));
        let medali = i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : (i + 1)));

        let itemBorder = window.cariDataBorderById(siswa.equippedBorder);
        let tierClass = itemBorder ? ('sbd-tier-' + itemBorder.tier.toLowerCase()) : '';
        let classBorder = itemBorder ? ('sbd-banner-frame ' + tierClass + ' ' + itemBorder.classCss) : '';
        let styleDefault = itemBorder ? '' : ('background:' + bgRank + '; border:1px solid ' + borderRank + ';');
        let ikonOrnamen = itemBorder ? (' <span title="' + itemBorder.nama + '">' + itemBorder.ikonKanan + '</span>') : '';

        let avatarHtml = window.buatHTMLBingkaiAvatar(siswa.foto, siswa.equippedBorder, 50, lencana.warna);

        let uKeySafe = String(siswa._userKey || "").replace(/'/g, "\\'");
        let isSelf = (uKeySafe.toLowerCase() === currentUsername);
        let btnVisitHtml = (!isSelf && uKeySafe)
            ? '<button type="button" class="lb-visit-btn" onclick="window.tutupModal(\'modal-leaderboard\'); window.kunjungiHabitatSiswaLain(\'' + uKeySafe + '\');" title="Kunjungi Habitat ' + namaUtama + '">🏡 Visit</button>'
            : '';

        html +=
        '<div class="' + classBorder + '" style="display:flex; align-items:flex-start; gap:12px; ' + styleDefault + ' padding:14px 15px; border-radius:12px; position:relative;">' +
            '<div style="display:flex; align-items:center; gap:10px; flex-shrink:0; z-index:2; margin-top:2px;">' +
                '<div style="font-size:20px; font-weight:900; color:' + (i < 3 ? '#d35400' : '#64748b') + '; width:24px; text-align:center;">' + medali + '</div>' +
                avatarHtml +
            '</div>' +
            '<div style="flex:1; min-width:0; z-index:2; display:flex; flex-direction:column; gap:4px;">' +
                '<div style="font-weight:800; font-size:15px; color:#1e293b; line-height:1.25; word-break:break-word;">' +
                    namaUtama + ikonOrnamen +
                    htmlNamaLengkapBawah +
                '</div>' +
                '<div style="font-size:11px; color:#475569; display:flex; align-items:center; flex-wrap:wrap; gap:5px;">' +
                    '<span style="background:' + lencana.bg + '; color:' + lencana.warna + '; border:1px solid ' + lencana.border + '; padding:1px 7px; border-radius:10px; font-weight:bold;">' + lencana.ikon + ' ' + lencana.nama + '</span>' +
                    '<span>• <b>' + siswa.kelas + '</b></span>' +
                '</div>' +
                '<!-- Jumlah XP, Soal Selesai, & Tombol Visit Tepat di Bawah Nama -->' +
                '<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-top:4px; padding-top:6px; border-top:1px dashed rgba(100,116,139,0.25);">' +
                    '<div style="display:flex; align-items:baseline; gap:8px; flex-wrap:wrap;">' +
                        '<span style="font-size:20px; font-weight:900; color:#0b3954; font-family:\'Bebas Neue\', sans-serif; letter-spacing:0.5px;">' + xpTotalSiswa.toLocaleString('id-ID') + ' XP</span>' +
                        '<span style="font-size:11px; color:#475569; font-weight:bold;">🔥 ' + totalDikerjakan + ' Soal Selesai</span>' +
                    '</div>' +
                    btnVisitHtml +
                '</div>' +
            '</div>' +
        '</div>';
    });
    container.innerHTML = html;
};
/* =========================================================================
   MODUL TAMBAHAN:
   1. SINKRONISASI XP & COIN KUIS CONTENT BLOCK (PG=5, PGK=10, IS=10, ESSAY=50)
   2. SISTEM ANTI-MACRO / ANTI-AUTOCLICKER 5 LAPIS & ACARA KHUSUS "PANEN XP" (+200 XP & +200 COIN)
   3. NOTIFIKASI ANGKATAN (X, XI, XII), SINAR MENGGANGGU, & TOMBOL "OKE" -> "SIP" (RESET TIAP MASUK WEB)
   ========================================================================= */

// -------------------------------------------------------------------------
// A. PASTIKAN TAMBAH XP SISWA SELALU MENAMBAH XP LEADERBOARD + COIN BELANJA
// -------------------------------------------------------------------------
window.tambahXPSiswa = function(jumlahPoin, sumber, rincianSoalArr) {
    let stat = sessionStorage.getItem("statusLogin");
    let uName = sessionStorage.getItem("username");
    if (stat !== "siswa" || !uName || uName.toLowerCase() === "sbd" || uName.toLowerCase() === "tamu") return;

    let poin = Math.max(0, Number(jumlahPoin) || 0);
    if (poin <= 0) return;

    let lb = (typeof window.pastikanStrukturDualXPDanPet === "function")
        ? window.pastikanStrukturDualXPDanPet(uName)
        : ((window.leaderboardSiswaData && window.leaderboardSiswaData[uName]) ? window.leaderboardSiswaData[uName] : null);

    if (!lb) {
        let akun = (window.akunSiswaData && window.akunSiswaData[uName]) ? window.akunSiswaData[uName] : {};
        if (!window.leaderboardSiswaData) window.leaderboardSiswaData = {};
        window.leaderboardSiswaData[uName] = {
            kelas: akun.kelas || "Umum",
            namaLengkap: akun.namaLengkap || uName,
            xp: 0,
            xpTotal: 0,
            coin: 0,
            xpTersedia: 0,
            statSoal: { PG: 0, PGK: 0, IS: 0, Essay: 0 }
        };
        lb = window.leaderboardSiswaData[uName];
    }

    lb.xpTotal = (Number(lb.xpTotal !== undefined ? lb.xpTotal : lb.xp) || 0) + poin;
    lb.xp = lb.xpTotal;
    lb.coin = (Number(lb.coin !== undefined ? lb.coin : lb.xpTersedia) || 0) + poin;
    lb.xpTersedia = lb.coin;

    if (!lb.statSoal) lb.statSoal = { PG: 0, PGK: 0, IS: 0, Essay: 0 };
    if (Array.isArray(rincianSoalArr)) {
        rincianSoalArr.forEach(function(item) {
            if (!item || !item.sudahBenar) return;
            let t = String(item.type || "PG").toUpperCase();
            if (t === "MC" || t === "PG") lb.statSoal.PG = (Number(lb.statSoal.PG) || 0) + 1;
            else if (t === "PGK") lb.statSoal.PGK = (Number(lb.statSoal.PGK) || 0) + 1;
            else if (t === "IS" || t === "SHORT_ANSWER" || t === "ISIAN") lb.statSoal.IS = (Number(lb.statSoal.IS) || 0) + 1;
            else if (t === "ESSAY" || t === "ESAI") lb.statSoal.Essay = (Number(lb.statSoal.Essay) || 0) + 1;
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
};

// Floating Badge Saat Siswa Mendapat XP & Coin di Kuis Materi / Latihan
window.tampilkanBadgeHadiahKuis = function(anchorEl, teksHadiah) {
    let toast = document.createElement("div");
    toast.style.cssText = "position:fixed; bottom:85px; right:24px; background:linear-gradient(135deg, #0b3954, #16a085); color:#ffffff; border:2px solid #f1c40f; padding:10px 18px; border-radius:30px; font-family:'Poppins',sans-serif; font-size:13px; font-weight:800; box-shadow:0 8px 25px rgba(0,0,0,0.28); z-index:1000095; transition:all 0.4s ease;";
    toast.innerHTML = teksHadiah;
    document.body.appendChild(toast);
    setTimeout(function() {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px)";
        setTimeout(function() { if (toast.parentNode) toast.remove(); }, 400);
    }, 2400);
};

// -------------------------------------------------------------------------
// B. SISTEM KEAMANAN ANTI-MACRO & WAJIB JEDA MINIMAL 2 DETIK ANTAR JAWABAN
// -------------------------------------------------------------------------
window.antiMacroGuard = {
    lastClickTime: 0,
    intervals: [],
    fastClickStrikes: 0,
    macroFlagged: false,
    isLockedChallenge: false
};

window.resetAntiMacroSession = function() {
    window.antiMacroGuard = {
        lastClickTime: 0,
        intervals: [],
        fastClickStrikes: 0,
        macroFlagged: false,
        isLockedChallenge: false
    };
};

window.verifikasiKlikManusiaAsli = function(evt, minBacaMs) {
    let batasMin = Math.max(2000, Number(minBacaMs) || 2000); // Wajib minimal jeda 2 detik (2000 ms) antar menjawab soal!
    let now = Date.now();
    let guard = window.antiMacroGuard;

    if (guard.isLockedChallenge) return false;

    if (evt && evt.isTrusted === false) {
        guard.macroFlagged = true;
        window.munculkanChallengeAntiMacro("Terdeteksi eksekusi script/macro otomatis pada browser!");
        return false;
    }

    let selisih = guard.lastClickTime ? (now - guard.lastClickTime) : 99999;

    // Jika menjawab lagi kurang dari 2 detik, langsung tolak klik tersebut!
    if (selisih < batasMin) {
        guard.fastClickStrikes++;
        let sisaDetik = ((batasMin - selisih) / 1000).toFixed(1);
        window.tampilkanBadgeHadiahKuis(null, "⏳ Tahan! Minimal jeda menjawab 2 detik (Tunggu " + sisaDetik + " dtk). Baca soal dengan teliti!");

        if (guard.fastClickStrikes >= 3) {
            guard.macroFlagged = true;
            window.munculkanChallengeAntiMacro("Kamu menekan jawaban secara membabi buta tanpa jeda (< 2 detik/soal)! Baca dan pahami soal sebelum menjawab.");
        }
        return false;
    }

    guard.lastClickTime = now;
    guard.fastClickStrikes = Math.max(0, guard.fastClickStrikes - 1);

    if (selisih < 30000) {
        guard.intervals.push(selisih);
        if (guard.intervals.length > 8) guard.intervals.shift();
        if (guard.intervals.length >= 6) {
            let avg = guard.intervals.reduce(function(a, b) { return a + b; }, 0) / guard.intervals.length;
            let variance = guard.intervals.reduce(function(a, b) { return a + Math.pow(b - avg, 2); }, 0) / guard.intervals.length;
            if (Math.sqrt(variance) < 130) {
                guard.macroFlagged = true;
                window.munculkanChallengeAntiMacro("Pola ketukan terdeteksi memiliki jeda waktu konstan seperti Macro Otomatis!");
                return false;
            }
        }
    }
    return true;
};

// Pencegat Global Fase Capture: Menangkal Klik Membabi Buta (< 2 Detik) di Latihan, Ujian, dan Kuis Materi
document.addEventListener("click", function(e) {
    if (sessionStorage.getItem("statusLogin") === "admin") return;
    let btnOpsi = e.target.closest(".quiz-option-btn");
    if (!btnOpsi || btnOpsi.disabled) return;

    // Jika opsi adalah label PGK yang hanya mencentang checkbox, izinkan centang tapi cegat tombol kirim PGK-nya
    if (btnOpsi.tagName === "LABEL" && btnOpsi.querySelector('input[type="checkbox"]')) return;

    if (!window.verifikasiKlikManusiaAsli(e, 2000)) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
    }
    if (window.sesiLatihanSiswa) {
        window.sesiLatihanSiswa._humanClicks = (window.sesiLatihanSiswa._humanClicks || 0) + 1;
    }
}, true);

window.munculkanChallengeAntiMacro = function(alasan) {
    let guard = window.antiMacroGuard;
    guard.isLockedChallenge = true;

    let old = document.getElementById("modal-anti-macro-challenge");
    if (old) old.remove();

    let kodeAcak = String(Math.floor(1000 + Math.random() * 9000));
    let posTombol = Math.floor(Math.random() * 3);

    let modal = document.createElement("div");
    modal.id = "modal-anti-macro-challenge";
    modal.className = "modal-overlay";
    modal.style.display = "flex";
    modal.style.zIndex = "10000999";

    modal.innerHTML =
        '<div class="modal-box" style="width:430px; max-width:92vw; text-align:center; border:3px solid #e74c3c; border-radius:16px; overflow:hidden;">' +
            '<div class="modal-header" style="background:#c0392b; color:white; padding:14px 18px;">' +
                '<h3 style="margin:0; font-size:16px;">🛡️ Peringatan Kecepatan & Anti-Macro</h3>' +
            '</div>' +
            '<div class="modal-body" style="padding:20px; background:#fff;">' +
                '<div style="font-size:44px; margin-bottom:8px;">⏳🚫</div>' +
                '<p style="font-size:13px; color:#c0392b; font-weight:800; margin:0 0 10px 0;">' + alasan + '</p>' +
                '<p style="font-size:12px; color:#475569; margin:0 0 14px 0; line-height:1.5;">Ketik 4 angka di bawah ini untuk membuka kunci soal:</p>' +
                '<div style="font-size:28px; font-weight:900; letter-spacing:8px; background:#f1f5f9; color:#0b3954; padding:10px; border-radius:10px; border:2px dashed #94a3b8; margin-bottom:12px; user-select:none;">' + kodeAcak + '</div>' +
                '<input type="text" id="input-verif-antimacro" class="input-box" placeholder="Ketik 4 angka di atas..." style="text-align:center; font-size:18px; font-weight:900; margin-bottom:12px;">' +
                '<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">' +
                    (posTombol === 0 ? '<button type="button" id="btn-lolos-antimacro" class="btn-action" style="background:#27ae60;">Verifikasi</button>' : '<button type="button" class="btn-action" style="background:#94a3b8;">Batal</button>') +
                    (posTombol === 1 ? '<button type="button" id="btn-lolos-antimacro" class="btn-action" style="background:#27ae60;">Verifikasi</button>' : '<button type="button" class="btn-action" style="background:#94a3b8;">Reset</button>') +
                    (posTombol === 2 ? '<button type="button" id="btn-lolos-antimacro" class="btn-action" style="background:#27ae60;">Verifikasi</button>' : '<button type="button" class="btn-action" style="background:#94a3b8;">Tutup</button>') +
                '</div>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);

    document.getElementById("btn-lolos-antimacro").onclick = function(e) {
        if (e && e.isTrusted === false) return;
        let val = (document.getElementById("input-verif-antimacro").value || "").trim();
        if (val !== kodeAcak) {
            window.tampilkanCustomDialog("alert", "⚠️ Kode verifikasi salah! Ketik 4 angka yang tampil di layar.", null, null);
            return;
        }
        guard.isLockedChallenge = false;
        guard.fastClickStrikes = 0;
        guard.intervals = [];
        guard.lastClickTime = Date.now();
        modal.remove();
    };
};

// -------------------------------------------------------------------------
// C. KUIS PADA CONTENT BLOCK MENDAPATKAN XP & COIN SETARA LATIHAN
// -------------------------------------------------------------------------
window.jawabKuisInline = function(btnEl, blockIdx, qIdx, optIdx, correctIdx) {
    let card = document.getElementById("inline-q-" + blockIdx + "-" + qIdx);
    if (!card || card.classList.contains("answered")) return;

    card.classList.add("answered");
    let allBtns = card.querySelectorAll(".quiz-option-btn");
    allBtns.forEach(function(b, i) {
        b.disabled = true;
        b.style.cursor = "not-allowed";
        if (i === correctIdx) b.classList.add("selected-correct");
        else if (i === optIdx) b.classList.add("selected-wrong");
    });

    let navBtn = document.getElementById("nav-btn-inline-" + blockIdx + "-" + qIdx);
    if (navBtn) navBtn.classList.add("nav-answered");

    if (optIdx === correctIdx) {
        window.tambahXPSiswa(5, "kuis_inline_pg", [{ type: "PG", sudahBenar: true }]);
        window.tampilkanBadgeHadiahKuis(btnEl, "🎉 Benar! +5 XP & +5 Coin");
    } else {
        let box = document.getElementById("bahas-box-" + blockIdx + "-" + qIdx);
        if (box && box.style.display === "none") {
            window.togglePembahasanInline(blockIdx, qIdx, true);
        }
    }
};

window.koreksiKuisInlinePGK = function(blockIdx, qIdx) {
    if (!window.verifikasiKlikManusiaAsli(window.event, 2000)) return;

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

    if (dipilih.length === 0) return window.tampilkanCustomDialog("alert", "Pilih minimal satu jawaban terlebih dahulu!", null, null);

    card.classList.add("answered");
    let rawKunci = (Array.isArray(q.correctIndices) && q.correctIndices.length > 0) ? q.correctIndices : (q.correct || []);
    let isAllCorrect = (typeof window.apakahJawabanPGKBenar === "function")
        ? window.apakahJawabanPGKBenar(dipilih, rawKunci, q.options)
        : (dipilih.length === rawKunci.length && dipilih.every(function(v) { return rawKunci.includes(v); }));
    let normKunciHuruf = (typeof window.normalisasiKunciPGK === "function")
        ? window.normalisasiKunciPGK(rawKunci, q.options)
        : rawKunci.map(function(idx) { return String.fromCharCode(65 + Number(idx)); });

    checkboxes.forEach(function(cb) {
        cb.disabled = true;
        let idx = parseInt(cb.value, 10);
        let hurufIdx = String.fromCharCode(65 + idx);
        let lbl = document.getElementById("lbl-inline-pgk-" + blockIdx + "-" + qIdx + "-" + idx);
        if (lbl) {
            if (normKunciHuruf.includes(hurufIdx) || rawKunci.includes(idx)) lbl.classList.add("selected-correct");
            else if (cb.checked) lbl.classList.add("selected-wrong");
        }
    });

    let btnSubmit = document.getElementById("btn-submit-pgk-" + blockIdx + "-" + qIdx);
    if (btnSubmit) btnSubmit.style.display = "none";

    let navBtn = document.getElementById("nav-btn-inline-" + blockIdx + "-" + qIdx);
    if (navBtn) navBtn.classList.add("nav-answered");

    if (isAllCorrect) {
        window.tambahXPSiswa(10, "kuis_inline_pgk", [{ type: "PGK", sudahBenar: true }]);
        window.tampilkanBadgeHadiahKuis(btnSubmit, "🎉 PGK Tepat! +10 XP & +10 Coin");
    } else {
        let box = document.getElementById("bahas-box-" + blockIdx + "-" + qIdx);
        if (box && box.style.display === "none") {
            window.togglePembahasanInline(blockIdx, qIdx, true);
        }
    }
};

window.jawabKuisInlineIsian = function(inputEl, blockIdx, qIdx) {
    if (!window.verifikasiKlikManusiaAsli(window.event, 2000)) return;

    let blok = window.contentBlocksData[blockIdx];
    if (!blok || !blok.questions || !blok.questions[qIdx]) return;
    let q = blok.questions[qIdx];
    let card = document.getElementById("inline-q-" + blockIdx + "-" + qIdx);
    if (card && card.classList.contains("answered")) return;

    let val = (inputEl.value || "").trim().toLowerCase();
    if (!val) return;

    let kunciArr = (q.correctAnswers || q.correct || []).map(function(k) { return String(k).toLowerCase().trim(); });

    if (kunciArr.indexOf(val) !== -1) {
        if (card) card.classList.add("answered");
        inputEl.style.borderColor = "#27ae60";
        inputEl.style.background = "#d4edda";
        inputEl.disabled = true;
        let navBtn = document.getElementById("nav-btn-inline-" + blockIdx + "-" + qIdx);
        if (navBtn) navBtn.classList.add("nav-answered");
        window.tambahXPSiswa(10, "kuis_inline_is", [{ type: "IS", sudahBenar: true }]);
        window.tampilkanBadgeHadiahKuis(inputEl, "🎉 Isian Benar! +10 XP & +10 Coin");
    } else {
        inputEl.style.borderColor = "#e74c3c";
        inputEl.style.background = "#f8d7da";
    }
};

// -------------------------------------------------------------------------
// D. ACARA KHUSUS "PANEN XP" (+200 XP & +200 COIN UNTUK >=50 SOAL & BENAR >=40)
// -------------------------------------------------------------------------
window.pastikanBannerPanenXPLatihanAda = function() {
    let modalLat = document.getElementById("modal-enter-latihan");
    if (!modalLat || document.getElementById("banner-event-panen-xp")) return;
    let inpJml = document.getElementById("latihan-jumlah-soal");
    if (!inpJml) return;

    let banner = document.createElement("div");
    banner.id = "banner-event-panen-xp";
    banner.style.cssText = "background:linear-gradient(135deg, #fef9e7, #fdebd0); border:2px solid #f39c12; border-radius:10px; padding:12px; margin-top:4px;";
    banner.innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">' +
            '<div>' +
                '<div style="font-size:13px; font-weight:900; color:#d35400;">🌾 ACARA KHUSUS: PANEN XP RAYA!</div>' +
                '<div style="font-size:11px; color:#475569; line-height:1.4; margin-top:2px;">Kerjakan minimal <b>50 Soal</b> dan raih minimal <b>40 Benar</b> (jeda minimal 2 detik/soal) untuk klaim bonus <b>+200 XP & +200 Coin</b>!</div>' +
            '</div>' +
            '<button type="button" class="btn-action" style="background:#d35400; color:#fff; width:auto; padding:6px 12px; font-size:11px; border-radius:18px; white-space:nowrap;" onclick="document.getElementById(\'latihan-jumlah-soal\').value=50; window.tampilkanBadgeHadiahKuis(this, \'🌾 Mode Panen XP (50 Soal) Diaktifkan!\');">🔥 Set 50 Soal</button>' +
        '</div>';
    inpJml.parentElement.after(banner);
};

document.addEventListener("DOMContentLoaded", function() {
    window.pastikanBannerPanenXPLatihanAda();
    let modalRes = document.getElementById("modal-quiz-result");
    if (modalRes) {
        let obsRes = new MutationObserver(function() {
            if (modalRes.style.display === "flex") window.evaluasiBonusPanenXPLatihan();
        });
        obsRes.observe(modalRes, { attributes: true, attributeFilter: ["style"] });
    }
});

if (!window._wrappedMulaiLatihanPanen) {
    window._wrappedMulaiLatihanPanen = window.mulaiLatihanSiswa;
    window.mulaiLatihanSiswa = function() {
        window.resetAntiMacroSession();
        if (window._wrappedMulaiLatihanPanen) window._wrappedMulaiLatihanPanen();
        setTimeout(function() {
            if (window.sesiLatihanSiswa) {
                window.sesiLatihanSiswa._startTimeMs = Date.now();
                window.sesiLatihanSiswa._panenClaimed = false;
            }
        }, 200);
    };
}

window.evaluasiBonusPanenXPLatihan = function() {
    let sesi = window.sesiLatihanSiswa;
    if (!sesi || sesi._panenClaimed) return;

    let totalSoal = parseInt(document.getElementById("quiz-result-total") ? document.getElementById("quiz-result-total").innerText : "0", 10) || 0;
    let totalBenar = parseInt(document.getElementById("quiz-result-correct") ? document.getElementById("quiz-result-correct").innerText : "0", 10) || 0;
    let msgBox = document.getElementById("quiz-result-adaptive-msg");

    if (totalSoal < 50) return;

    let durasiDetik = sesi._startTimeMs ? ((Date.now() - sesi._startTimeMs) / 1000) : 999;
    let rataDetikPerSoal = durasiDetik / Math.max(1, totalSoal);

    if (window.antiMacroGuard.macroFlagged || rataDetikPerSoal < 2.0) {
        if (msgBox) {
            msgBox.innerHTML += '<div style="margin-top:8px; padding:8px; background:#fee2e2; color:#991b1b; border:1px solid #ef4444; border-radius:6px; font-weight:800;">🚫 Bonus Panen XP Dibatalkan: Terdeteksi pengerjaan terlalu cepat / indikasi Macro (' + rataDetikPerSoal.toFixed(1) + ' dtk/soal).</div>';
        }
        return;
    }

    if (totalSoal >= 50 && totalBenar >= 40) {
        sesi._panenClaimed = true;
        window.tambahXPSiswa(200, "bonus_panen_xp");
        if (msgBox) {
            msgBox.innerHTML += '<div style="margin-top:8px; padding:10px; background:linear-gradient(135deg, #fef9e7, #dcfce7); color:#15803d; border:2px solid #22c55e; border-radius:8px; font-weight:900; font-size:13px;">🌾 BONUS PANEN XP RAYA TERCAPAI! (' + totalBenar + '/' + totalSoal + ' Benar)<br>Kamu mendapatkan tambahan <b>+200 XP & +200 Coin</b>!</div>';
        }
        window.tampilkanBadgeHadiahKuis(null, "🌾 PANEN XP RAYA! +200 XP & +200 Coin!");
    }
};

// -------------------------------------------------------------------------
// E. PERBAIKAN FILTER NOTIFIKASI PER KELAS / ANGKATAN & MATIKAN SINAR DI ADMIN
// -------------------------------------------------------------------------
window.ackNotifSesiIni = new Set();

window.bacaTargetNotifikasi = function(notif) {
    if (!notif) return "Semua";
    return String(notif.targetKelas || notif.target || notif.kelas || notif.untuk || "Semua").trim();
};

window.apakahNotifCocokUntukSiswa = function(notif, kelasSiswa, isAdmin) {
    if (!notif) return false;
    if (isAdmin) return true;

    let rawTarget = window.bacaTargetNotifikasi(notif);
    let cleanTarget = rawTarget.replace(/^🏫\s*/, "").replace(/^kelas\s+/i, "").trim().toUpperCase();
    let kls = String(kelasSiswa || "").replace(/^kelas\s+/i, "").trim().toUpperCase();

    if (cleanTarget === "SEMUA" || cleanTarget === "SEMUA KELAS & ANGKATAN" || cleanTarget === "UMUM") {
        return true;
    }

    // Jika siswa belum login atau berstatus Tamu/Umum, jangan tampilkan notifikasi khusus kelas!
    if (!kls || kls === "UMUM" || kls === "TAMU") {
        return false;
    }

    if (cleanTarget === "ANGKATAN_X" || cleanTarget === "ANGKATAN KELAS X" || cleanTarget === "X") {
        return kls === "X" || kls.indexOf("X ") === 0 || kls.indexOf("X-") === 0 || kls.indexOf("10") === 0;
    }
    if (cleanTarget === "ANGKATAN_XI" || cleanTarget === "ANGKATAN KELAS XI" || cleanTarget === "XI") {
        return kls === "XI" || kls.indexOf("XI ") === 0 || kls.indexOf("XI-") === 0 || kls.indexOf("11") === 0;
    }
    if (cleanTarget === "ANGKATAN_XII" || cleanTarget === "ANGKATAN KELAS XII" || cleanTarget === "XII") {
        return kls === "XII" || kls.indexOf("XII ") === 0 || kls.indexOf("XII-") === 0 || kls.indexOf("12") === 0;
    }

    return cleanTarget === kls;
};

window.ambilDaftarNotifSiswaAktif = function() {
    let stat = sessionStorage.getItem("statusLogin");
    let uName = (sessionStorage.getItem("username") || "").toLowerCase();
    let isAdmin = (stat === "admin" || (typeof window.isAdminSession === "function" && window.isAdminSession()));
    let kelasSiswa = "";

    if (stat === "siswa" && uName) {
        if (window.akunSiswaData && window.akunSiswaData[uName] && window.akunSiswaData[uName].kelas) {
            kelasSiswa = window.akunSiswaData[uName].kelas;
        } else if (window.leaderboardSiswaData && window.leaderboardSiswaData[uName] && window.leaderboardSiswaData[uName].kelas) {
            kelasSiswa = window.leaderboardSiswaData[uName].kelas;
        }
    }

    let rawList = Array.isArray(window.adminNotifikasiData) ? window.adminNotifikasiData : Object.values(window.adminNotifikasiData || {});
    return rawList.filter(function(n) {
        return window.apakahNotifCocokUntukSiswa(n, kelasSiswa, isAdmin);
    });
};

window.perbaruiSinarTombolNotifikasi = function() {
    let btnNotif = document.getElementById("btn-header-notif");
    let badgeNotif = document.getElementById("badge-header-notif");
    if (!btnNotif) return;

    let isAdmin = (sessionStorage.getItem("statusLogin") === "admin") ||
                  (typeof window.isAdminSession === "function" && window.isAdminSession()) ||
                  document.body.classList.contains("mode-edit-aktif");

    // Matikan efek sinar mengganggu saat Mode Admin
    if (isAdmin) {
        btnNotif.classList.remove("notif-glow-active");
        if (badgeNotif) badgeNotif.style.display = "none";
        return;
    }

    let daftar = window.ambilDaftarNotifSiswaAktif();
    let belumDiOke = daftar.filter(function(n, idx) {
        let nId = n.id || ("notif_" + (n.judul || "") + "_" + idx);
        return !window.ackNotifSesiIni.has(nId);
    });

    if (badgeNotif) {
        if (belumDiOke.length > 0) {
            badgeNotif.style.display = "inline-block";
            badgeNotif.innerText = String(belumDiOke.length);
        } else {
            badgeNotif.style.display = "none";
        }
    }

    if (belumDiOke.length > 0) {
        btnNotif.classList.add("notif-glow-active");
    } else {
        btnNotif.classList.remove("notif-glow-active");
    }
};

window.klikOkeSatuNotifikasi = function(notifId, btnEl) {
    window.ackNotifSesiIni.add(notifId);
    if (btnEl) {
        btnEl.innerText = "✓ Sip";
        btnEl.className = "btn-notif-ack-sip";
        btnEl.disabled = true;
        btnEl.onclick = null;
    }
    window.perbaruiSinarTombolNotifikasi();
};

window.bukaModalNotifikasiSiswa = function() {
    window.bukaModal("modal-notifikasi-siswa");
    let cont = document.getElementById("list-notifikasi-siswa-container");
    if (!cont) return;

    let daftar = window.ambilDaftarNotifSiswaAktif().slice().reverse();
    if (daftar.length === 0) {
        cont.innerHTML = '<div style="text-align:center; padding:30px; color:#64748b; font-weight:700;">🔔 Belum ada pengumuman atau tugas baru untuk kelasmu.</div>';
        window.perbaruiSinarTombolNotifikasi();
        return;
    }

    let labelTargetMap = {
        "Semua": "🌍 Semua Kelas & Angkatan",
        "ANGKATAN_X": "🎓 Angkatan Kelas X",
        "ANGKATAN_XI": "🎓 Angkatan Kelas XI",
        "ANGKATAN_XII": "🎓 Angkatan Kelas XII"
    };

    let html = "";
    daftar.forEach(function(n, idx) {
        let nId = n.id || ("notif_" + (n.judul || "") + "_" + idx);
        let sudahSip = window.ackNotifSesiIni.has(nId);
        let targetRaw = window.bacaTargetNotifikasi(n);
        let labelTarget = labelTargetMap[targetRaw] || ("🏫 Kelas " + targetRaw.replace(/^kelas\s+/i, ""));
        let safeId = String(nId).replace(/'/g, "\\'");

        let btnAckHtml = sudahSip
            ? '<button type="button" class="btn-notif-ack-sip" disabled>✓ Sip</button>'
            : '<button type="button" class="btn-notif-ack-oke" onclick="window.klikOkeSatuNotifikasi(\'' + safeId + '\', this)">Oke</button>';

        html +=
            '<div style="background:white; border:2px solid ' + (sudahSip ? '#e2e8f0' : '#f39c12') + '; border-left:5px solid ' + (sudahSip ? '#94a3b8' : '#e67e22') + '; border-radius:12px; padding:14px 16px; display:flex; justify-content:space-between; align-items:center; gap:14px; box-shadow:0 4px 12px rgba(0,0,0,0.04);">' +
                '<div style="flex:1; min-width:0;">' +
                    '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">' +
                        '<span style="background:#eaf2f8; color:#2980b9; font-size:10px; font-weight:800; padding:2px 8px; border-radius:10px;">' + labelTarget + '</span>' +
                        '<span style="font-size:11px; color:#94a3b8; font-weight:600;">' + (n.waktu || n.tanggal || "") + '</span>' +
                    '</div>' +
                    '<h4 style="margin:0 0 6px 0; color:#0b3954; font-size:15px;">' + (n.judul || "Pengumuman") + '</h4>' +
                    '<div style="font-size:13px; color:#334155; line-height:1.5; word-break:break-word;">' + (n.html || n.isi || "") + '</div>' +
                '</div>' +
                '<div style="flex-shrink:0;">' +
                    btnAckHtml +
                '</div>' +
            '</div>';
    });

    cont.innerHTML = html;
};

// Pastikan Dropdown Target Penerima Menyertakan Angkatan X, XI, XII SETELAH fungsi bawaan selesai
window.isiOpsiTargetNotifAdminLengkap = function() {
    let sel = document.getElementById("notif-admin-target-kelas");
    if (!sel) return;
    let prev = sel.value || "Semua";

    let html =
        '<option value="Semua">📢 Semua Kelas & Angkatan</option>' +
        '<option value="ANGKATAN_X">🎓 Angkatan Kelas X (Semua Kelas X)</option>' +
        '<option value="ANGKATAN_XI">🎓 Angkatan Kelas XI (Semua Kelas XI)</option>' +
        '<option value="ANGKATAN_XII">🎓 Angkatan Kelas XII (Semua Kelas XII)</option>';

    Object.keys(window.adminData || {}).sort().forEach(function(kls) {
        let labelBersih = kls.replace(/^kelas\s+/i, "");
        html += '<option value="' + kls + '">🏫 Kelas ' + labelBersih + '</option>';
    });

    sel.innerHTML = html;
    if (prev) sel.value = prev;
};

// Pastikan saat guru menerbitkan notifikasi, properti target, kelas, dan targetKelas tersimpan seragam
window.kirimNotifikasiAdminKeSiswa = function() {
    let selTarget = document.getElementById("notif-admin-target-kelas");
    let inpJudul = document.getElementById("notif-admin-judul");
    let editor = document.getElementById("notif-admin-editor");
    if (!selTarget || !inpJudul || !editor) return;

    let targetVal = selTarget.value || "Semua";
    let judulVal = inpJudul.value.trim();
    let htmlVal = editor.innerHTML.trim();

    if (!judulVal) return window.tampilkanCustomDialog("alert", "⚠️ Judul notifikasi wajib diisi!", null, null);

    let now = new Date();
    let waktuStr = String(now.getDate()).padStart(2, "0") + "/" + String(now.getMonth() + 1).padStart(2, "0") + "/" + now.getFullYear() + " " + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

    if (!Array.isArray(window.adminNotifikasiData)) {
        window.adminNotifikasiData = Object.values(window.adminNotifikasiData || {});
    }

    window.adminNotifikasiData.push({
        id: "notif_" + Date.now(),
        target: targetVal,
        kelas: targetVal,
        targetKelas: targetVal,
        judul: judulVal,
        html: htmlVal,
        isi: htmlVal,
        waktu: waktuStr
    });

    inpJudul.value = "";
    editor.innerHTML = "";

    if (typeof window.simpanNotifikasiAdminKeDB === "function") window.simpanNotifikasiAdminKeDB();
    if (typeof window.renderDaftarNotifAdmin === "function") window.renderDaftarNotifAdmin();
    window.tampilkanCustomDialog("alert", "✅ Notifikasi berhasil diterbitkan untuk: " + targetVal, null, null);
};

if (!window._baseRenderDaftarNotifAdmin) {
    window._baseRenderDaftarNotifAdmin = window.renderDaftarNotifAdmin;
}
window.renderDaftarNotifAdmin = function() {
    if (window._baseRenderDaftarNotifAdmin) window._baseRenderDaftarNotifAdmin();
    window.isiOpsiTargetNotifAdminLengkap(); // Dipanggil SETELAH fungsi dasar agar opsi Angkatan X-XII tidak tertimpa!
    window.perbaruiSinarTombolNotifikasi();
};

if (!window._baseHitungBadgeNotif) {
    window._baseHitungBadgeNotif = window.hitungDanUpdateBadgeNotifikasi;
}
window.hitungDanUpdateBadgeNotifikasi = function() {
    if (window._baseHitungBadgeNotif) window._baseHitungBadgeNotif();
    window.perbaruiSinarTombolNotifikasi();
};

// Override Modal Notifikasi Siswa agar Menampilkan Tombol "Oke" -> "Sip" di Samping Tiap Notifikasi
window.bukaModalNotifikasiSiswa = function() {
    window.bukaModal("modal-notifikasi-siswa");
    let cont = document.getElementById("list-notifikasi-siswa-container");
    if (!cont) return;

    let daftar = window.ambilDaftarNotifSiswaAktif().slice().reverse();
    if (daftar.length === 0) {
        cont.innerHTML = '<div style="text-align:center; padding:30px; color:#64748b; font-weight:700;">🔔 Belum ada pengumuman atau tugas baru untuk kelasmu.</div>';
        window.perbaruiSinarTombolNotifikasi();
        return;
    }

    let labelTargetMap = {
        "Semua": "🌍 Semua Kelas & Angkatan",
        "ANGKATAN_X": "🎓 Angkatan Kelas X",
        "ANGKATAN_XI": "🎓 Angkatan Kelas XI",
        "ANGKATAN_XII": "🎓 Angkatan Kelas XII"
    };

    let html = "";
    daftar.forEach(function(n, idx) {
        let nId = n.id || ("notif_idx_" + idx);
        let sudahSip = window.ackNotifSesiIni.has(nId);
        let labelTarget = labelTargetMap[n.targetKelas] || ("🏫 Kelas " + (n.targetKelas || "Semua"));
        let safeId = String(nId).replace(/'/g, "\\'");

        let btnAckHtml = sudahSip
            ? '<button type="button" class="btn-notif-ack-sip" disabled>✓ Sip</button>'
            : '<button type="button" class="btn-notif-ack-oke" onclick="window.klikOkeSatuNotifikasi(\'' + safeId + '\', this)">Oke</button>';

        html +=
            '<div style="background:white; border:2px solid ' + (sudahSip ? '#e2e8f0' : '#f39c12') + '; border-left:5px solid ' + (sudahSip ? '#94a3b8' : '#e67e22') + '; border-radius:12px; padding:14px 16px; display:flex; justify-content:space-between; align-items:center; gap:14px; box-shadow:0 4px 12px rgba(0,0,0,0.04);">' +
                '<div style="flex:1; min-width:0;">' +
                    '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">' +
                        '<span style="background:#eaf2f8; color:#2980b9; font-size:10px; font-weight:800; padding:2px 8px; border-radius:10px;">' + labelTarget + '</span>' +
                        '<span style="font-size:11px; color:#94a3b8; font-weight:600;">' + (n.waktu || "") + '</span>' +
                    '</div>' +
                    '<h4 style="margin:0 0 6px 0; color:#0b3954; font-size:15px;">' + (n.judul || "Pengumuman") + '</h4>' +
                    '<div style="font-size:13px; color:#334155; line-height:1.5; word-break:break-word;">' + (n.html || n.isi || "") + '</div>' +
                '</div>' +
                '<div style="flex-shrink:0;">' +
                    btnAckHtml +
                '</div>' +
            '</div>';
    });

    cont.innerHTML = html;
};

// Pastikan Dropdown Target Penerima di Ruang Administrasi Memiliki Opsi Angkatan Kelas X, XI, dan XII
window.isiOpsiTargetNotifAdminLengkap = function() {
    let sel = document.getElementById("notif-admin-target-kelas");
    if (!sel) return;
    let prev = sel.value || "Semua";

    let html =
        '<option value="Semua">🌍 Semua Kelas & Angkatan</option>' +
        '<option value="ANGKATAN_X">🎓 Angkatan Kelas X (Semua Kelas X)</option>' +
        '<option value="ANGKATAN_XI">🎓 Angkatan Kelas XI (Semua Kelas XI)</option>' +
        '<option value="ANGKATAN_XII">🎓 Angkatan Kelas XII (Semua Kelas XII)</option>';

    Object.keys(window.adminData || {}).sort().forEach(function(kls) {
        html += '<option value="' + kls + '">🏫 Kelas ' + kls + '</option>';
    });

    sel.innerHTML = html;
    if (prev) sel.value = prev;
};

if (!window._baseRenderDaftarNotifAdmin) {
    window._baseRenderDaftarNotifAdmin = window.renderDaftarNotifAdmin;
}
window.renderDaftarNotifAdmin = function() {
    window.isiOpsiTargetNotifAdminLengkap();
    if (window._baseRenderDaftarNotifAdmin) window._baseRenderDaftarNotifAdmin();
    window.perbaruiSinarTombolNotifikasi();
};

if (!window._baseHitungBadgeNotif) {
    window._baseHitungBadgeNotif = window.hitungDanUpdateBadgeNotifikasi;
}
window.hitungDanUpdateBadgeNotifikasi = function() {
    if (window._baseHitungBadgeNotif) window._baseHitungBadgeNotif();
    window.perbaruiSinarTombolNotifikasi();
};

setInterval(function() {
    window.perbaruiSinarTombolNotifikasi();
}, 3000);